// src/platform/adapters/dockerAdapter.ts
import { DockerEngine } from '../../dockforge/docker-engine/engine';
import { UniversalDockerConcept } from '../../dockforge/data/unifiedDockerData';
import { ensureFullConceptData } from '../../dockforge/data/conceptDataEnricher';
import {
  UniversalLesson,
  SyntaxTokenBreakdown,
  ConceptVariation as PlatformVariation,
  TerminologyItem,
  DiagramNode,
} from '../lesson-runtime/types';
import { RuntimeAdapter, ExecutionResult } from '../terminal/types';

/**
 * DockerRuntimeAdapter connects the pure DockerEngine state machine
 * to the UniversalTerminal.
 */
export class DockerRuntimeAdapter implements RuntimeAdapter {
  technology = 'docker' as const;
  private engine: DockerEngine;

  constructor(engine: DockerEngine) {
    this.engine = engine;
  }

  get promptPrefix(): string {
    return 'docker-host $';
  }

  execute(command: string): ExecutionResult {
    const res = this.engine.executeCommand(command);
    return {
      stdout: res.stdout.join('\n'),
      stderr: res.stderr.join('\n'),
      exitCode: res.exitCode,
      affectedResources: res.affectedContainers,
    };
  }

  getCompletions(prefix: string): string[] {
    const dockerCommands = [
      'docker run -d -p 8080:80 nginx',
      'docker ps -a',
      'docker stop',
      'docker rm',
      'docker logs',
      'docker exec -it',
      'docker images',
      'docker pull',
      'docker rmi',
      'docker volume ls',
      'docker network ls',
      'docker compose up -d',
      'docker compose down',
    ];
    return dockerCommands.filter((c) => c.startsWith(prefix));
  }

  reset(): void {
    // Engine maintains internal containers/images state
  }

  getEnvironmentInfo(): Record<string, string> {
    return {
      containers: String(this.engine.getContainers().length),
      images: String(this.engine.getImages().length),
      volumes: String(this.engine.getVolumes().length),
      networks: String(this.engine.getNetworks().length),
    };
  }
}

/**
 * Maps a DockForge UniversalDockerConcept into the platform-wide UniversalLesson schema.
 */
export function dockerLessonAdapter(rawConcept: UniversalDockerConcept): UniversalLesson {
  const concept = ensureFullConceptData(rawConcept);

  // 1. Map Syntax Tokens
  const tokens: SyntaxTokenBreakdown[] = (concept.syntaxTokens || []).map((t, idx) => {
    let role: SyntaxTokenBreakdown['role'] = 'argument';
    if (idx === 0) role = 'binary';
    else if (idx === 1 && !t.token.startsWith('-')) role = 'subcommand';
    else if (t.token.startsWith('-')) role = 'flag';
    else if (t.role.toLowerCase().includes('option')) role = 'option';
    else if (t.role.toLowerCase().includes('target')) role = 'target';

    return {
      token: t.token,
      role,
      meaning: t.explanation || `${t.token} operator in ${concept.command}`,
      withoutIt:
        t.token === '-d'
          ? 'Terminal stays attached to stdout; closing terminal kills container.'
          : t.token.startsWith('-p')
          ? 'Port remains unmapped to host; browser on localhost cannot connect!'
          : idx <= 1
          ? 'Command syntax error; binary/subcommand missing.'
          : 'Default container engine behavior applies.',
      whenToUse:
        t.token === '-d'
          ? 'Running background web servers and databases.'
          : t.token.startsWith('-p')
          ? 'Publishing a container port to the outside world.'
          : 'When configuring container execution parameters.',
      alternatives: t.token.startsWith('-p') ? ['--publish', '-P'] : t.token === '-d' ? ['--detach'] : undefined,
    };
  });

  // 2. Map Variations
  const variations: PlatformVariation[] = (concept.variations || []).map((v) => ({
    title: v.title,
    syntax: v.syntax || concept.command,
    explanation: v.whatItDoes || v.desc || concept.whatIsIt,
    whenToUse: v.whenToUse || 'When standard defaults require customization',
  }));

  // 3. Map Diagram Nodes
  const nodes: DiagramNode[] = (concept.blockDiagram?.nodes || []).map((n, i) => ({
    id: n.id || `node-${i}`,
    label: n.label,
    simpleDef: n.simpleDef,
    techDef: n.techDef,
    color: n.color,
    status: (i === 1 ? 'active' : 'inactive') as DiagramNode['status'],
  }));

  // Fallback nodes if empty
  if (nodes.length === 0) {
    nodes.push(
      { id: 'image', label: 'Docker Image', simpleDef: 'Read-only blueprint', techDef: 'OCI image layers with rootfs', status: 'inactive' },
      { id: 'container', label: 'Running Container', simpleDef: 'Live isolated process', techDef: 'Linux namespaces + cgroups', status: 'active' },
      { id: 'network', label: 'Bridge Network', simpleDef: 'Virtual network cable', techDef: 'veth pair bridged to docker0', status: 'success' },
    );
  }

  // 4. Map Terminology
  const terminology: TerminologyItem[] = (concept.terms || []).map((t) => ({
    term: t.term,
    simpleDef: t.simple,
    technicalDef: t.technical,
    analogy: t.analogy,
  }));

  // 5. Scenarios
  const devScen = concept.developerScenario;
  const beginnerScenario = {
    title: `Basic ${concept.title}`,
    context: `You need to run and manage an isolated service using ${concept.command}.`,
    goal: `Execute ${concept.command} successfully without port or namespace collisions.`,
  };

  const realDevScenario = {
    title: devScen?.title || 'Production Microservice Setup',
    setup: devScen?.setup || 'A developer needs to run a local web server mirroring production.',
    problem: devScen?.problem || 'Port conflicts and dependency drift between local OS and server.',
    solution: devScen?.solution || `Execute ${concept.command} inside a containerized sandbox.`,
  };

  const productionScenario = {
    title: 'Enterprise Container Deployment',
    context: 'Kubernetes nodes and cloud PaaS runners use the exact same OCI container standards.',
    takeaway: 'Containers ensure deterministic execution from your laptop to global clusters.',
  };

  // 6. Simulation Steps
  const simSteps = (concept.internalFlow || []).map((flow) => ({
    stepNumber: flow.step,
    actionTitle: flow.title,
    whatHappens: flow.desc,
    why: flow.why,
    technicalDetail: flow.techDetail,
  }));

  // 7. Mistake & Recovery
  const firstMistake = concept.commonMistakes?.[0];
  const mistakeAndRecovery = {
    mistakeTitle: firstMistake?.mistake || 'Missing Port Mapping Flag (-p 8080:80)',
    mistakeCommand: 'docker run -d nginx',
    whatHappened:
      firstMistake?.whyWrong ||
      'Container started, but port 80 is only accessible within the internal Docker bridge network. The host cannot reach it.',
    whatWasNotLost: 'The container and its internal filesystem are intact and running.',
    recoveryCommand: 'docker run -d -p 8080:80 --name web-fixed nginx',
    recoveryExplanation:
      firstMistake?.correctWay ||
      'Specify -p 8080:80 to forward traffic from host port 8080 to container port 80.',
  };

  // 8. Challenge
  const challengeOpt = concept.challenge?.options || [];
  const correctOpt = challengeOpt.find((o) => o.isCorrect) || challengeOpt[0];
  const challenge = {
    instructions:
      concept.challenge?.question ||
      `Configure and run ${concept.command} to solve this container workload.`,
    taskGoal: `Deploy ${concept.title}`,
    solutionCommand: concept.command,
    hints: [
      'Check the syntax explorer for detached mode and port flags.',
      'Remember the syntax: -p <host-port>:<container-port>.',
    ],
    explanation:
      correctOpt?.explanation ||
      `Successfully ran ${concept.command} with all proper isolation flags.`,
  };

  return {
    id: concept.id,
    technology: 'docker',
    topicId: concept.topicId,
    topicNumber: concept.topicNumber,
    topicTitle: concept.topicTitle,
    title: concept.title,
    command: concept.command,
    subtitle: concept.subtitle || `Mastering ${concept.command} in Docker`,
    difficulty: concept.difficulty,
    badges: concept.badges || ['Docker', 'Container'],

    definition: concept.whatIsIt,
    inSimpleWords: concept.inSimpleWords,
    beginnerExplanation: concept.whatIsIt,
    technicalExplanation: `Docker Engine command: ${concept.command}. Interacts with dockerd daemon, runc, and kernel namespaces.`,
    realWorldAnalogy: {
      metaphor: 'Standardized Shipping Container',
      explanation: concept.realWorldAnalogy || 'Packages software with all its dependencies into an immutable standardized box.',
    },

    whyDoWeNeedIt: concept.whyDoYouNeedIt,
    problemItSolves: concept.quote || `Eliminates "it works on my machine" bugs via ${concept.command}.`,
    whenToUse: concept.whenToUse || [
      'When building and testing microservices locally',
      'When ensuring reproducible deployments across staging and production',
    ],
    whenNotToUse: concept.whenNotToUse || [
      'When data must be persisted without an attached volume',
      'When simple native scripts suffice without isolation requirements',
    ],
    whereCommonlyUsed: ['Local development', 'CI/CD runner jobs', 'Cloud container registries', 'Kubernetes pods'],

    visualDiagram: {
      title: concept.blockDiagram?.title || 'Docker Containerization Model',
      nodes,
      flow: [
        { from: 'image', to: 'container', label: 'docker run' },
        { from: 'container', to: 'network', label: 'bridge veth' },
      ],
    },

    terminology,

    syntax: {
      command: concept.syntaxCode || concept.command,
      tokens,
      variations,
    },

    scenarios: {
      beginner: beginnerScenario,
      realDeveloper: realDevScenario,
      production: productionScenario,
    },

    simulation: {
      initialStateDescription: 'Docker host daemon (dockerd) listening on /var/run/docker.sock.',
      visualComponentKey: 'docker-hardware-rig',
      steps: simSteps.length > 0 ? simSteps : [
        { stepNumber: 1, actionTitle: 'Parse CLI Flags', whatHappens: 'CLI parses -d, -p, and image name.', why: 'Validates user syntax.', technicalDetail: 'REST POST /containers/create' },
        { stepNumber: 2, actionTitle: 'Fetch Image Layers', whatHappens: 'Checks local cache; unpacks rootfs.', why: 'Prepares COW filesystem.', technicalDetail: 'overlay2 snapshot' },
        { stepNumber: 3, actionTitle: 'Initialize Namespaces', whatHappens: 'Isolates PID, NET, MNT, IPC.', why: 'Guarantees process isolation.', technicalDetail: 'clone(CLONE_NEWPID | CLONE_NEWNET)' },
        { stepNumber: 4, actionTitle: 'Start Container', whatHappens: 'runc starts entrypoint process.', why: 'Container enters RUNNING state.', technicalDetail: 'cgroups v2 memory & cpu limit applied' },
      ],
    },

    mistakeAndRecovery,
    challenge,
    quiz: concept.challenge
      ? {
          question: concept.challenge.question,
          options: concept.challenge.options,
        }
      : undefined,
  };
}
