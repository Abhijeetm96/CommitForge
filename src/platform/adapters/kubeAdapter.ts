// src/platform/adapters/kubeAdapter.ts
import { KubeEngine } from '../../podforge/kube-engine/engine';
import { KubeConcept } from '../../podforge/data/topics/types';
import {
  UniversalLesson,
  SyntaxTokenBreakdown,
  ConceptVariation as PlatformVariation,
  TerminologyItem,
  DiagramNode,
} from '../lesson-runtime/types';
import { RuntimeAdapter, ExecutionResult } from '../terminal/types';

/**
 * KubeRuntimeAdapter connects the pure KubeEngine state machine
 * to the UniversalTerminal.
 */
export class KubeRuntimeAdapter implements RuntimeAdapter {
  technology = 'kubernetes' as const;
  private engine: KubeEngine;

  constructor(engine: KubeEngine) {
    this.engine = engine;
  }

  get promptPrefix(): string {
    return 'k8s-cluster (default) $';
  }

  execute(command: string): ExecutionResult {
    const res = this.engine.execute(command);
    return {
      stdout: res.stdout.filter((line) => line !== '__CLEAR__').join('\n'),
      stderr: res.stderr.join('\n'),
      exitCode: res.exitCode,
    };
  }

  getCompletions(prefix: string): string[] {
    const kubeCommands = [
      'kubectl get pods',
      'kubectl get nodes',
      'kubectl get services',
      'kubectl get deployments',
      'kubectl describe pod',
      'kubectl describe node',
      'kubectl logs',
      'kubectl apply -f',
      'kubectl scale deployment',
      'kubectl delete pod',
      'kubectl cluster-info',
    ];
    return kubeCommands.filter((c) => c.startsWith(prefix));
  }

  reset(): void {
    // Engine maintains state
  }

  getEnvironmentInfo(): Record<string, string> {
    const st = this.engine.getState();
    return {
      nodes: String(Object.keys(st.nodes).length),
      pods: String(Object.keys(st.pods).length),
      deployments: String(Object.keys(st.deployments).length),
      services: String(Object.keys(st.services).length),
    };
  }
}

/**
 * Maps a PodForge KubeConcept into the platform-wide UniversalLesson schema.
 */
export function kubeLessonAdapter(
  concept: KubeConcept,
  chapterTitle: string = 'Kubernetes Core',
  chapterNumber: string = '01'
): UniversalLesson {
  const mainCmd = concept.commandPill || 'kubectl get pods';
  const tokensRaw = mainCmd.split(/\s+/);

  // 1. Map Syntax Tokens
  const tokens: SyntaxTokenBreakdown[] = tokensRaw.map((tok, idx) => {
    let role: SyntaxTokenBreakdown['role'] = 'argument';
    if (idx === 0) role = 'binary';
    else if (idx === 1 && !tok.startsWith('-')) role = 'subcommand';
    else if (tok.startsWith('-')) role = 'flag';
    else if (idx === 2 && !tok.startsWith('-')) role = 'target';

    return {
      token: tok,
      role,
      meaning:
        tok === 'kubectl'
          ? 'The official Kubernetes control plane CLI.'
          : tok === 'apply'
          ? 'Declarative configuration management; reconciles desired YAML with cluster reality.'
          : tok === 'get'
          ? 'Queries the API server for resource summaries.'
          : tok === 'describe'
          ? 'Fetches detailed spec, status, and historical event stream.'
          : tok.startsWith('-f')
          ? 'File flag specifying manifest YAML path.'
          : `Specifies target or operand in ${mainCmd}.`,
      withoutIt:
        idx === 0
          ? 'Command fails to execute.'
          : tok.startsWith('-f')
          ? 'kubectl would not know which manifest file to parse.'
          : 'Default cluster query rules apply.',
      whenToUse: `Use when executing cluster operations with ${mainCmd}.`,
      alternatives: tok === 'apply' ? ['create', 'replace'] : tok === 'get' ? ['describe', 'logs'] : undefined,
    };
  });

  // 2. Map Variations
  const variations: PlatformVariation[] = (concept.kubectlCommands || []).map((cmd, idx) => ({
    title: `Command Pattern ${idx + 1}`,
    syntax: cmd,
    explanation: `Executes ${cmd} to interact with ${concept.title}.`,
    whenToUse: 'Operational management, cluster debugging, or manifest deployment.',
  }));

  if (variations.length < 2) {
    variations.push(
      {
        title: 'Query with Wide Columns',
        syntax: `${mainCmd} -o wide`,
        explanation: 'Displays extended details including Node IP, Pod IP, and assigned Node.',
        whenToUse: 'When diagnosing IP allocation and pod scheduling.',
      },
      {
        title: 'Output in YAML Format',
        syntax: `${mainCmd} -o yaml`,
        explanation: 'Dumps complete resource definition and runtime status block in YAML.',
        whenToUse: 'When inspecting full cluster state or creating manifest backups.',
      }
    );
  }

  // 3. Map Diagram Nodes
  const nodes: DiagramNode[] = [
    {
      id: 'control-plane',
      label: 'Control Plane (API Server)',
      simpleDef: 'The brain of the cluster validating requests.',
      techDef: 'kube-apiserver persisting desired state into etcd.',
      status: 'active',
    },
    {
      id: 'scheduler',
      label: 'Kube-Scheduler',
      simpleDef: 'Assigns workloads to the best available physical server.',
      techDef: 'Evaluates node taints, affinities, and capacity to bind pods.',
      status: 'active',
    },
    {
      id: 'worker-node',
      label: 'Worker Node (Kubelet)',
      simpleDef: 'The physical or virtual machine running container runtimes.',
      techDef: 'kubelet talks to containerd via CRI to start containers.',
      status: 'success',
    },
    {
      id: 'pod',
      label: `${concept.title} (Resource)`,
      simpleDef: 'The atomic deployable unit running your application.',
      techDef: concept.description || 'Target Kubernetes resource object.',
      status: 'active',
    },
  ];

  // 4. Map Terminology
  const terminology: TerminologyItem[] = [
    {
      term: concept.title,
      simpleDef: concept.inSimpleWords || concept.description,
      technicalDef: concept.explanation,
      analogy: concept.realWorldAnalogy?.metaphor,
    },
    {
      term: 'Control Plane',
      simpleDef: 'The master manager that coordinates the entire cluster.',
      technicalDef: 'Group of components (apiserver, etcd, controller-manager, scheduler).',
      analogy: 'The air traffic control tower at an airport.',
    },
    {
      term: 'Kubelet',
      simpleDef: 'The agent running on each server that obeys orders from the control plane.',
      technicalDef: 'The node agent registering node capacity and maintaining pod lifecycle.',
      analogy: 'The local ground crew at a specific airport gate.',
    },
    {
      term: 'Reconciliation Loop',
      simpleDef: 'Kubernetes constantly comparing what you asked for against what actually exists.',
      technicalDef: 'Controller pattern: Observe -> Diff (Desired vs Actual) -> Act to reconcile.',
      analogy: 'A thermostat turning on the heat whenever room temperature dips below 70°F.',
    },
  ];

  if (concept.dockerBridge) {
    terminology.push({
      term: 'Docker vs K8s Bridge',
      simpleDef: `In Docker: "${concept.dockerBridge.dockerEquivalent}". In K8s: "${concept.dockerBridge.k8sEquivalent}".`,
      technicalDef: concept.dockerBridge.keyDifference,
      analogy: concept.dockerBridge.whyK8sApproach,
    });
  }

  // 5. Scenarios
  const beginnerScenario = {
    title: `Beginner: Understanding ${concept.title}`,
    context: `Deploy and inspect ${concept.title} on a running Kubernetes cluster.`,
    goal: `Execute ${mainCmd} and verify healthy Ready state.`,
  };

  const realDevScenario = {
    title: 'Cluster SRE Scenario',
    setup: 'A production microservice experiences node pressure or pod eviction.',
    problem: 'Traffic must automatically route away from failing pods without user disruption.',
    solution: `Leverage ${concept.title} self-healing controllers and reconciliation loops.`,
  };

  const productionScenario = {
    title: 'Enterprise Multi-Zone Resilience',
    context: concept.productionTips?.join(' ') || 'Multi-node clusters distribute replicas across availability zones.',
    takeaway: 'Kubernetes treats infrastructure as disposable, guaranteeing high availability.',
  };

  // 6. Simulation Steps
  const simSteps = (concept.lifecycleSteps || []).map((ls, idx) => ({
    stepNumber: ls.step || idx + 1,
    actionTitle: ls.title,
    whatHappens: ls.description,
    why: 'Controller reconciliation loop drives actual state toward desired state.',
    technicalDetail: `Target resource: ${concept.title} (${concept.commandPill})`,
  }));

  if (simSteps.length === 0) {
    simSteps.push(
      { stepNumber: 1, actionTitle: 'kubectl command sent', whatHappens: 'API Server authenticates and validates request.', why: 'Security & admission control.', technicalDetail: 'kube-apiserver REST endpoint' },
      { stepNumber: 2, actionTitle: 'Persist in etcd', whatHappens: 'Cluster records desired specification.', why: 'Single source of truth.', technicalDetail: 'Raft consensus write in etcd' },
      { stepNumber: 3, actionTitle: 'Controller Reconciles', whatHappens: 'Controller detects diff between desired and active state.', why: 'Enforces declarative model.', technicalDetail: 'Kube-controller-manager loop' },
      { stepNumber: 4, actionTitle: 'Kubelet Execution', whatHappens: 'Kubelet launches pod containers on assigned worker node.', why: 'Workload instantiation.', technicalDetail: 'CRI container creation via containerd' },
    );
  }

  // 7. Mistake & Recovery
  const pitfall = concept.commonPitfalls?.[0];
  const mistakeAndRecovery = {
    mistakeTitle: pitfall?.mistake || 'Targeting Wrong Namespace or Resource Name',
    mistakeCommand: `${mainCmd} -n wrong-namespace`,
    whatHappened:
      pitfall?.whyItHappens ||
      'Resource not found error because Kubernetes namespaces isolate objects from one another.',
    whatWasNotLost: 'The resource is alive and healthy inside its correct namespace.',
    recoveryCommand: pitfall?.fix || `${mainCmd} -A`,
    recoveryExplanation:
      'Pass -A (or --all-namespaces) to query across every namespace, or explicitly target the intended namespace.',
  };

  // 8. Challenge
  const challenge = {
    instructions:
      concept.practiceChallenge?.instructions ||
      `Use kubectl to interact with ${concept.title} and achieve the target state.`,
    taskGoal: `Manage ${concept.title}`,
    solutionCommand: concept.practiceChallenge?.goalCommand || mainCmd,
    hints: concept.practiceChallenge?.hints || ['Run kubectl get pods first.', 'Check the syntax explorer tab.'],
    explanation:
      concept.practiceChallenge?.solutionExplanation ||
      `Successfully executed ${mainCmd} and reconciled cluster state.`,
  };

  return {
    id: concept.id,
    technology: 'kubernetes',
    topicId: `topic-${chapterNumber}`,
    topicNumber: chapterNumber,
    topicTitle: chapterTitle,
    title: concept.title,
    command: mainCmd,
    subtitle: concept.description,
    difficulty: concept.difficulty,
    badges: [concept.badge || 'Kubernetes', 'Cloud-Native'],

    definition: concept.explanation,
    inSimpleWords: concept.inSimpleWords || concept.description,
    beginnerExplanation: concept.whatIsIt || concept.description,
    technicalExplanation: `Kubernetes API resource: ${concept.title}. Managed via ${mainCmd} across worker nodes.`,
    realWorldAnalogy: concept.realWorldAnalogy || {
      metaphor: 'Air Traffic Control Tower',
      explanation: 'Coordinates thousands of moving components to ensure smooth, safe landings and continuous operation.',
    },

    whyDoWeNeedIt: concept.explanation,
    problemItSolves: `Manages container orchestration, scaling, and self-healing for ${concept.title}.`,
    whenToUse: concept.whenToUse || [
      'When running containerized workloads in production clusters',
      'When high availability, auto-scaling, and zero-downtime rolling updates are required',
    ],
    whenNotToUse: concept.whenNotToUse || [
      'For single simple scripts on a single computer (use Docker directly)',
      'When infrastructure complexity outweighs application requirements',
    ],
    whereCommonlyUsed: ['Enterprise clouds (EKS, GKE, AKS)', 'High-scale web applications', 'Microservice architectures'],

    visualDiagram: {
      title: 'Kubernetes Cluster Architecture',
      nodes,
      flow: [
        { from: 'control-plane', to: 'scheduler', label: 'schedule' },
        { from: 'scheduler', to: 'worker-node', label: 'assign' },
        { from: 'worker-node', to: 'pod', label: 'start CRI' },
      ],
    },

    terminology,

    syntax: {
      command: mainCmd,
      tokens,
      variations,
    },

    scenarios: {
      beginner: beginnerScenario,
      realDeveloper: realDevScenario,
      production: productionScenario,
    },

    simulation: {
      initialStateDescription: 'Multi-node Kubernetes cluster with control-plane and worker nodes ready.',
      visualComponentKey: 'kube-cluster-mesh',
      steps: simSteps,
    },

    mistakeAndRecovery,
    challenge,
    quiz: concept.quizQuestion
      ? {
          question: concept.quizQuestion.question,
          options: concept.quizQuestion.options.map((o) => ({
            label: o.label || o.text,
            isCorrect: o.isCorrect,
            explanation: o.explanation,
          })),
        }
      : undefined,
  };
}
