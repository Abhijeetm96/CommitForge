import type { KubeChapter } from './types';

export const PHASE_4_CHAPTERS: KubeChapter[] = [
  {
    id: 'ch08-scheduling',
    number: 8,
    title: 'Scheduling, Placement & Resource Management',
    category: 'Resource Governance',
    concepts: [
      {
        id: 'c-requests-limits-qos',
        number: '8.1',
        title: 'Resource Requests, Limits & QoS Classes',
        commandPill: 'kubectl top pods',
        badge: 'Resource Allocation',
        difficulty: 'Beginner',
        description: 'Control CPU/memory allocation and understand Quality of Service (QoS) classes: Guaranteed, Burstable, and BestEffort.',
        explanation: 'Kubernetes uses `requests` and `limits` to manage compute resources. `requests` dictate what the scheduler requires to place a Pod on a node. `limits` specify the hard ceiling enforced by the Linux kernel. CPU is a compressible resource (throttled via CFS when exceeding limits); memory is non-compressible (exceeding memory limits triggers kernel OOMKiller, exit code 137). Based on settings, Kubernetes assigns QoS classes: (1) `Guaranteed` (requests == limits for all containers); (2) `Burstable` (requests < limits); (3) `BestEffort` (no requests or limits set). During node memory pressure, BestEffort pods are evicted first, followed by Burstable pods exceeding requests.',
        yamlSnippet: `apiVersion: v1
kind: Pod
metadata:
  name: qos-guaranteed-pod
spec:
  containers:
  - name: api
    image: nginx:1.25-alpine
    resources:
      requests:
        cpu: "500m"     # 0.5 CPU core
        memory: "512Mi" # 512 Megabytes
      limits:
        cpu: "500m"     # Equal to request -> Guaranteed QoS
        memory: "512Mi"`,
        kubectlCommands: ['kubectl describe pod web-frontend', 'kubectl top nodes'],
        visualizerFocus: 'Node CPU and RAM allocation bars showing requested vs available capacity',
        practiceChallenge: {
          instructions: 'Inspect the resource requests and limits configured for web-frontend.',
          goalCommand: 'kubectl describe pod web-frontend',
          hints: ['Run kubectl describe pod web-frontend', 'Examine the Limits and Requests fields under Containers'],
        },
        whatIsIt: "Resource Requests and Limits govern CPU and memory resource allocation per container. Requests determine node placement by the kube-scheduler, while Limits enforce Linux cgroup ceilings, classifying Pods into Guaranteed, Burstable, or BestEffort Quality of Service (QoS) classes.",
        inSimpleWords: "Think of Requests as your reserved dinner table reservation at a restaurant (guaranteed seating). Limits are the maximum number of chairs the restaurant will let you pull up before they say \"no more.\" If you try to eat more memory than your limit, the bouncer (OOMKiller) kicks you out immediately.",
        realWorldAnalogy: {
                  "metaphor": "Airplane Luggage Allowance and Overhead Bin Limits",
                  "explanation": "Your ticket includes a guaranteed minimum seat space and baggage check (Request). If the overhead bin has room, you can bring an extra coat (Burstable up to Limit). But if your suitcase exceeds the maximum legal dimensions (Limit), gate security rejects it."
        },
        whenToUse: [
                  "Setting accurate requests and limits on 100% of production workloads to prevent noisy neighbor starvation.",
                  "Configuring Guaranteed QoS (requests == limits) for critical database pods and low-latency API gateways.",
                  "Enabling Horizontal Pod Autoscaler (HPA), which requires CPU/memory requests to compute target utilization percentages."
        ],
        whenNotToUse: [
                  "Omitting requests and limits (results in BestEffort QoS, making your pods the very first victims evicted during node memory pressure).",
                  "Setting memory limits lower than normal application startup heap size (causes immediate OOMKilled exit code 137).",
                  "Overcommitting node memory by more than 150% in production (risks kernel panics and cascade node evictions)."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "Scheduling Filter via Requests",
                            "description": "Kube-scheduler sums existing pod requests on each node; only nodes with unallocated capacity >= pod requests are eligible."
                  },
                  {
                            "step": 2,
                            "title": "cgroup Boundary Initialization",
                            "description": "Kubelet configures Linux cgroups: cpu.weight/cpu.shares for requests, and cpu.max / memory.max for limits."
                  },
                  {
                            "step": 3,
                            "title": "Compressible CPU Throttling",
                            "description": "When a container exceeds its CPU limit, the Completely Fair Scheduler (CFS) throttles CPU cycles without killing the process."
                  },
                  {
                            "step": 4,
                            "title": "Non-Compressible OOM Kill",
                            "description": "When a container exceeds its memory limit, the Linux kernel OOMKiller terminates the process with exit code 137."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "Quality of Service (QoS) Classes",
                            "detail": "Guaranteed (requests == limits across all containers), Burstable (requests < limits), BestEffort (no requests or limits)."
                  },
                  {
                            "title": "OOM Score Adjustment",
                            "detail": "Linux kernel oom_score_adj is set based on QoS: Guaranteed (-997), Burstable (calculated), BestEffort (1000, evicted first)."
                  },
                  {
                            "title": "CFS Quota Throttling",
                            "detail": "CPU limits enforce quota per period (e.g. 100ms); exceeding quota causes thread freezing until the next period."
                  }
        ],
        productionTips: [
                  "Always set memory request == memory limit to prevent sudden OOMKilled evictions in stateful databases and production APIs.",
                  "Avoid setting CPU limits too aggressively; CFS quota throttling can cause artificial latency spikes even when node CPU is idle.",
                  "Use LimitRange objects per namespace to automatically inject default requests and limits for teams that forget them."
        ],
      },
      {
        id: 'c-node-affinity-anti-affinity',
        number: '8.2',
        title: 'Node Affinity & Anti-Affinity',
        commandPill: 'kubectl get nodes --show-labels',
        badge: 'Advanced Placement',
        difficulty: 'Intermediate',
        description: 'Constrain which nodes your Pod is eligible to be scheduled on based on node labels using hard and soft rules.',
        explanation: 'While `nodeSelector` offers basic key-value matching, `nodeAffinity` provides rich expressive matching: (1) `requiredDuringSchedulingIgnoredDuringExecution` (hard rule: the scheduler CANNOT schedule the pod unless the node satisfies the expression); (2) `preferredDuringSchedulingIgnoredDuringExecution` (soft rule: the scheduler will try to satisfy the rule with weights from 1 to 100, but will place the pod elsewhere if no matching node is available). Supported operators include `In`, `NotIn`, `Exists`, `DoesNotExist`, `Gt`, and `Lt`.',
        yamlSnippet: `apiVersion: v1
kind: Pod
metadata:
  name: gpu-workload
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: topology.kubernetes.io/zone
            operator: In
            values: ["us-east-1a", "us-east-1b"]
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 80
        preference:
          matchExpressions:
          - key: accelerator
            operator: In
            values: ["nvidia-a100"]
  containers:
  - name: ml-model
    image: python:3.11-slim`,
        kubectlCommands: ['kubectl get nodes --show-labels', 'kubectl get nodes -L zone'],
        visualizerFocus: 'Scheduler matching Pod nodeAffinity rules against node label metadata',
        practiceChallenge: {
          instructions: 'List all cluster nodes along with their configured labels.',
          goalCommand: 'kubectl get nodes --show-labels',
          hints: ['Run kubectl get nodes --show-labels', 'Observe labels like node-role, zone, etc.'],
        },
        whatIsIt: "Node Affinity is an advanced scheduling mechanism that constrains which nodes a Pod can be scheduled on based on node labels, offering expressive boolean matching (In, NotIn, Exists, Gt) with hard (required) and soft (preferred) enforcement rules.",
        inSimpleWords: "Think of Node Affinity like employee hotel booking preferences: \"I MUST stay in a hotel with high-speed internet (hard rule: requiredDuringScheduling), and I would PREFER a hotel with a swimming pool (soft rule: preferredDuringScheduling with 80% weight), but if no pool is available, book the room anyway.\"",
        realWorldAnalogy: {
                  "metaphor": "Specialized Hospital Wing Patient Placement",
                  "explanation": "Cardiac patients MUST be placed in rooms with telemetry monitoring equipment (hard affinity). Non-critical patients PREFER south-facing sunny rooms (soft affinity), but will be admitted to any available bed during peak hospital occupancy."
        },
        whenToUse: [
                  "Pinning compute-heavy machine learning jobs to nodes equipped with hardware accelerators (accelerator: nvidia-tesla-a100).",
                  "Distributing workloads across distinct cloud availability zones (topology.kubernetes.io/zone: us-east-1a).",
                  "Targeting specific CPU architectures (kubernetes.io/arch: arm64 vs amd64) for multi-arch container deployments."
        ],
        whenNotToUse: [
                  "Simple static one-to-one matching where standard nodeSelector is sufficient and easier to read.",
                  "Over-constraining hard affinity rules across tiny clusters (leads to Pods stuck in Pending state indefinitely).",
                  "Assuming that changing node labels will evict already running pods (affinity is ignoredDuringExecution by default)."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "Scheduler Node Filtering (Hard Rules)",
                            "description": "Kube-scheduler evaluates requiredDuringSchedulingIgnoredDuringExecution; nodes failing matchExpressions are dropped."
                  },
                  {
                            "step": 2,
                            "title": "Scheduler Node Prioritization (Soft Rules)",
                            "description": "Remaining nodes are scored by preferredDuringSchedulingIgnoredDuringExecution, adding rule weights (1-100) to node score."
                  },
                  {
                            "step": 3,
                            "title": "Winning Node Binding",
                            "description": "The node with the highest composite score is selected, and a Binding object is created in the API server."
                  },
                  {
                            "step": 4,
                            "title": "Ignored During Execution",
                            "description": "If node labels change later or the preferred conditions degrade, running pods remain executing uninterrupted."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "requiredDuringScheduling...",
                            "detail": "Hard constraint: the scheduler CANNOT schedule the pod unless the node satisfies the label selector."
                  },
                  {
                            "title": "preferredDuringScheduling...",
                            "detail": "Soft constraint: scheduler attempts to find matching nodes and scores them using custom weights (1 to 100)."
                  },
                  {
                            "title": "Node Match Operators",
                            "detail": "In, NotIn, Exists, DoesNotExist, Gt, Lt provide expressive set logic beyond simple key-value equality."
                  }
        ],
        productionTips: [
                  "Use preferredDuringScheduling with weighted rules when deploying spot/preemptible workloads to maximize cost savings without downtime.",
                  "Label nodes during cloud provisioning (via Terraform or Karpenter NodePools) with zone, instance-type, and lifecycle metadata.",
                  "Avoid hard required rules with multiple strict AND conditions unless you have guaranteed capacity in all target node pools."
        ],
      },
      {
        id: 'c-taints-and-tolerations',
        number: '8.3',
        title: 'Taints & Tolerations: Dedicated Nodes',
        commandPill: 'kubectl taint nodes <node> key=value:NoSchedule',
        badge: 'Node Repulsion',
        difficulty: 'Intermediate',
        description: 'Repel Pods from nodes unless they explicitly tolerate the taint. Master NoSchedule, PreferNoSchedule, and NoExecute.',
        explanation: 'Node affinity attracts Pods to nodes; `Taints` allow a node to REPEL a set of Pods. You apply a taint to a node (`key=value:effect`), and no Pod can be scheduled on that node unless it has a matching `Toleration`. Three effects exist: (1) `NoSchedule` (new pods without toleration will not be scheduled; existing pods remain); (2) `PreferNoSchedule` (system avoids scheduling if possible); (3) `NoExecute` (if tainted, any running pod lacking toleration is immediately evicted from the node). This is how control plane nodes repel regular workloads.',
        yamlSnippet: `# Taint applied to node:
# kubectl taint nodes worker-gpu dedicated=ai-team:NoSchedule

apiVersion: v1
kind: Pod
metadata:
  name: ai-inference-worker
spec:
  tolerations:
  - key: "dedicated"
    operator: "Equal"
    value: "ai-team"
    effect: "NoSchedule"
  containers:
  - name: model
    image: pytorch/pytorch:latest`,
        kubectlCommands: ['kubectl describe node control-plane-1', 'kubectl get nodes'],
        visualizerFocus: 'Taint barrier repelling normal application pods while admitting tolerating pods',
        practiceChallenge: {
          instructions: 'Describe the control-plane node to see the default master taints applied by Kubernetes.',
          goalCommand: 'kubectl describe node control-plane-1',
          hints: ['Run kubectl describe node control-plane-1', 'Look for Taints: node-role.kubernetes.io/control-plane:NoSchedule'],
        },
        whatIsIt: "Taints and Tolerations are complementary node and pod attributes that allow a node to repel a set of pods. A Taint applied to a node prevents pods from scheduling onto it unless the Pod declares a matching Toleration.",
        inSimpleWords: "Think of a Taint like a \"DANGER: HAZARDOUS CHEMICAL LAB\" sign on a laboratory door. No worker (pod) is allowed to enter the room unless they are wearing a specialized HAZMAT suit (toleration) that explicitly matches the chemical hazard.",
        realWorldAnalogy: {
                  "metaphor": "High-Security Bank Vault and Security Clearance Badges",
                  "explanation": "The bank vault (node) is tainted with \"HighSecurity=Strict:NoSchedule\". Regular bank tellers cannot enter. Only armored car guards equipped with Top-Secret badges (tolerations) can enter the vault."
        },
        whenToUse: [
                  "Dedicating specific nodes to specialized workloads (e.g. database-only nodes, GPU-only nodes, compliance-audited nodes).",
                  "Preserving Kubernetes control plane nodes (node-role.kubernetes.io/control-plane:NoSchedule) from hosting general user pods.",
                  "Graceful node eviction during hardware degradation using NoExecute taints with tolerationSeconds."
        ],
        whenNotToUse: [
                  "Attempting to attract pods to nodes (taints REPEL; use Node Affinity to attract pods).",
                  "Applying taints across an entire cluster without adding matching tolerations (halts all new pod scheduling).",
                  "Using taints as a network security mechanism (taints govern scheduling only, not network packet filtering)."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "Node Taint Configuration",
                            "description": "Administrator or node controller taints a node: kubectl taint nodes worker-1 dedicated=gpu:NoSchedule."
                  },
                  {
                            "step": 2,
                            "title": "Scheduler Predicate Check",
                            "description": "When scheduling, kube-scheduler filters out any node whose taints are not completely satisfied by the pod tolerations."
                  },
                  {
                            "step": 3,
                            "title": "NoSchedule vs PreferNoSchedule",
                            "description": "NoSchedule strictly forbids placement; PreferNoSchedule avoids placement unless no other nodes exist."
                  },
                  {
                            "step": 4,
                            "title": "NoExecute Dynamic Eviction",
                            "description": "Applying a NoExecute taint immediately evicts all running pods on that node that lack a matching toleration."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "Taint Effects",
                            "detail": "NoSchedule (blocks new pods), PreferNoSchedule (soft avoidance), NoExecute (evicts running pods and blocks new ones)."
                  },
                  {
                            "title": "tolerationSeconds",
                            "detail": "Defines how long a pod can remain running on a node after a NoExecute taint (e.g. node.kubernetes.io/unreachable) is applied."
                  },
                  {
                            "title": "Built-in Node Taints",
                            "detail": "Node controller automatically taints nodes experiencing MemoryPressure, DiskPressure, PIDPressure, or NetworkUnavailable."
                  }
        ],
        productionTips: [
                  "Set tolerationSeconds: 300 on stateful pods for not-ready and unreachable taints to prevent immediate failover during brief 30-second network blips.",
                  "Remember: Taints REPEL pods; Tolerations ALLOW pods; Node Affinity ATTRACTS pods. Combine Affinity + Taints for full exclusivity.",
                  "Always verify control plane taints before manually scheduling system monitoring agents on master nodes."
        ],
      },
      {
        id: 'c-pod-anti-affinity-topology',
        number: '8.4',
        title: 'Pod Anti-Affinity & Topology Spread',
        commandPill: 'kubectl explain pod.spec.affinity.podAntiAffinity',
        badge: 'Failure Isolation',
        difficulty: 'Advanced',
        description: 'Ensure Pods are spread across failure domains (nodes, racks, availability zones) to withstand cloud data center outages.',
        explanation: 'To survive physical rack or cloud availability zone failures, replicas of the same service must never be co-located on the same physical host. `podAntiAffinity` prevents scheduling two pods with the same label on nodes matching a `topologyKey` (such as `kubernetes.io/hostname` or `topology.kubernetes.io/zone`). `topologySpreadConstraints` offers even finer-grained control by specifying `maxSkew` (e.g. at most 1 replica difference between zones), evenly distributing pods across zones.',
        yamlSnippet: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ha-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ha-api
  template:
    metadata:
      labels:
        app: ha-api
    spec:
      topologySpreadConstraints:
      - maxSkew: 1
        topologyKey: topology.kubernetes.io/zone
        whenUnsatisfiable: DoNotSchedule
        labelSelector:
          matchLabels:
            app: ha-api
      containers:
      - name: api
        image: nginx:1.25`,
        kubectlCommands: ['kubectl get pods -o wide', 'kubectl get nodes -L zone'],
        visualizerFocus: 'Pods distributed evenly across distinct failure zones (us-east-1a, us-east-1b)',
        practiceChallenge: {
          instructions: 'Check where frontend pods are scheduled across nodes to inspect failure spread.',
          goalCommand: 'kubectl get pods -o wide',
          hints: ['Run kubectl get pods -o wide', 'Review the NODE column distribution'],
        },
        whatIsIt: "Pod Anti-Affinity and Topology Spread Constraints allow you to prevent identical or conflicting Pods from co-locating on the same physical host, rack, or cloud availability zone, ensuring maximum high availability and fault domain resilience.",
        inSimpleWords: "Think of Pod Anti-Affinity like corporate executive travel policies: \"The CEO and the CFO are legally forbidden from flying on the exact same airplane.\" If an engine fails, the company must never lose both leaders simultaneously.",
        realWorldAnalogy: {
                  "metaphor": "Disaster Recovery Redundant Backup Power Generators",
                  "explanation": "A hospital installs two backup generators. They do not place both generators in the same basement room (which could flood). They place Generator A in the North Wing and Generator B on the South Roof (Topology Spread)."
        },
        whenToUse: [
                  "Spreading replica pods across distinct physical Availability Zones (topology.kubernetes.io/zone) to survive cloud datacenter outages.",
                  "Preventing two high-CPU or high-memory pods from being scheduled onto the same physical worker node (host anti-affinity).",
                  "Enforcing Topology Spread Constraints with maxSkew: 1 to guarantee perfectly balanced distribution across zones."
        ],
        whenNotToUse: [
                  "Using hard requiredDuringScheduling pod anti-affinity on a cluster with fewer nodes than deployment replicas (causes Pending deadlocks).",
                  "Over-constraining anti-affinity on spot instance node pools where rapid node cycling occurs.",
                  "Applications with extreme low-latency inter-pod RPC requirements that benefit from co-locating on the same node."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "Topology Key Resolution",
                            "description": "Scheduler identifies the topologyKey (e.g. topology.kubernetes.io/zone or kubernetes.io/hostname)."
                  },
                  {
                            "step": 2,
                            "title": "Label Selector Cross-Check",
                            "description": "Scheduler checks how many pods matching the anti-affinity label selector are currently running in each topology domain."
                  },
                  {
                            "step": 3,
                            "title": "maxSkew Evaluation",
                            "description": "Topology Spread calculates the difference (skew) between domains; nodes that would cause skew > maxSkew are rejected or penalized."
                  },
                  {
                            "step": 4,
                            "title": "Fault Domain Isolation",
                            "description": "The pod is scheduled in the least-populated zone, maximizing cluster survivability if a whole zone catches fire."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "topologyKey",
                            "detail": "Defines the fault domain boundary: kubernetes.io/hostname (single host), topology.kubernetes.io/zone (datacenter), or rack."
                  },
                  {
                            "title": "topologySpreadConstraints",
                            "detail": "Modern successor to podAntiAffinity; guarantees uniform distribution across zones with configurable maxSkew (e.g. maxSkew: 1)."
                  },
                  {
                            "title": "whenUnsatisfiable: DoNotSchedule vs ScheduleAnyway",
                            "detail": "DoNotSchedule enforces hard constraints; ScheduleAnyway provides soft best-effort balancing."
                  }
        ],
        productionTips: [
                  "Use topologySpreadConstraints with maxSkew: 1 and topologyKey: topology.kubernetes.io/zone for all production customer-facing services.",
                  "Prefer preferredDuringSchedulingIgnoredDuringExecution for podAntiAffinity to avoid pods getting stuck in Pending if a zone runs out of capacity.",
                  "Ensure your cluster autoscaler or Karpenter is configured with topology-aware provisioning to spin up nodes in the deficit zone."
        ],
      },
      {
        id: 'c-priorityclasses-preemption',
        number: '8.5',
        title: 'PriorityClasses & Pod Preemption',
        commandPill: 'kubectl get priorityclasses',
        badge: 'QoS Preemption',
        difficulty: 'Advanced',
        description: 'Guarantee that mission-critical services always schedule by preempting (evicting) lower-priority batch workloads when cluster capacity is full.',
        explanation: 'When cluster compute resources are exhausted, unscheduled Pods normally wait in Pending state. `PriorityClasses` assign integer weights (e.g. 1,000,000 for critical apps vs 100 for batch jobs). When a high-priority Pod cannot be scheduled due to lack of CPU/RAM, the `kube-scheduler` initiates Preemption: it finds nodes where evicting one or more lower-priority Pods will free sufficient resources, terminates the low-priority pods, and assigns the high-priority pod to the node.',
        yamlSnippet: `apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority-payment
value: 1000000
globalDefault: false
description: "Mission-critical payment gateway pods that must preempt batch jobs."
---
apiVersion: v1
kind: Pod
metadata:
  name: payment-service
spec:
  priorityClassName: high-priority-payment
  containers:
  - name: gateway
    image: payments:v2`,
        kubectlCommands: ['kubectl get priorityclasses', 'kubectl describe priorityclass system-cluster-critical'],
        visualizerFocus: 'Scheduler evicting low-priority batch pods to make room for high-priority payment pods',
        practiceChallenge: {
          instructions: 'List the system and user PriorityClasses registered in the cluster.',
          goalCommand: 'kubectl get priorityclasses',
          hints: ['Run kubectl get priorityclasses or kubectl get pc', 'Notice system-cluster-critical and system-node-critical'],
        },
        whatIsIt: "PriorityClasses define the relative importance and scheduling precedence of Pods. When a cluster runs out of compute capacity, kube-scheduler uses PriorityClasses to preempt (evict) lower-priority pods to free up CPU and memory for critical higher-priority workloads.",
        inSimpleWords: "Think of PriorityClass like an emergency room triage protocol or VIP boarding passes at an airport. If an ambulance arrives with a critically injured patient (high priority), minor injuries in waiting room chairs (low priority) are postponed so doctors can attend to the emergency.",
        realWorldAnalogy: {
                  "metaphor": "Ambulance Sirens on a Gridlocked Highway",
                  "explanation": "When an ambulance approaches with sirens blaring, regular commuter cars (batch jobs) pull over to the shoulder (preemption) so the ambulance (critical production API) can speed through without stopping."
        },
        whenToUse: [
                  "Protecting mission-critical production APIs from being blocked by non-essential background batch jobs or test runners.",
                  "Configuring system-critical daemonsets (networking, DNS, logging) with system-node-critical priority so they are never starved.",
                  "Enabling cost-saving opportunistic computing: running low-priority batch jobs on spare capacity that yield instantly when traffic surges."
        ],
        whenNotToUse: [
                  "Granting maximum priority to every single workload in the cluster (nullifies the purpose of priority and creates preemption chaos).",
                  "Workloads that cannot handle sudden termination (use PDBs and graceful shutdown to mitigate).",
                  "Multi-tenant clusters without ResourceQuotas limiting how many high-priority pods each team can create."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "Priority Assignment",
                            "description": "Pod references priorityClassName: high-priority; kube-apiserver populates spec.priority integer value (e.g. 1000000)."
                  },
                  {
                            "step": 2,
                            "title": "Scheduling Queue Ordering",
                            "description": "kube-scheduler maintains an active scheduling queue sorted by priority; high-priority pods jump straight to the head of the line."
                  },
                  {
                            "step": 3,
                            "title": "Preemption Algorithm Trigger",
                            "description": "If no nodes have enough free capacity, the scheduler searches for nodes where evicting lower-priority pods frees enough resources."
                  },
                  {
                            "step": 4,
                            "title": "Victim Eviction & Binding",
                            "description": "Selected lower-priority victim pods are gracefully terminated (SIGTERM); the high-priority pod is bound to the node."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "preemptionPolicy: PreemptLowerPriority vs Never",
                            "detail": "Never allows high priority queue position without evicting running pods (non-preempting priority)."
                  },
                  {
                            "title": "Built-in System Priorities",
                            "detail": "system-cluster-critical (2000000000) and system-node-critical (2000001000) reserved for CoreDNS, kube-proxy, and CNI."
                  },
                  {
                            "title": "ResourceQuota Priority Enforcement",
                            "detail": "Prevents non-privileged namespaces from consuming high-priority quotas and monopolizing cluster nodes."
                  }
        ],
        productionTips: [
                  "Define 3 standardized PriorityClasses: prod-critical (100000), prod-standard (10000), and batch-preemptible (1000).",
                  "Use preemptionPolicy: Never for high-priority batch jobs that need to run next without disrupting currently running services.",
                  "Always configure PodDisruptionBudgets on important services; the preemption scheduler respects PDBs on a best-effort basis."
        ],
      },
    ],
  },
  {
    id: 'ch09-autoscaling',
    number: 9,
    title: 'Autoscaling & Cluster Elasticity',
    category: 'Resource Governance',
    concepts: [
      {
        id: 'c-hpa-v2-metrics',
        number: '9.1',
        title: 'Horizontal Pod Autoscaler (HPA v2)',
        commandPill: 'kubectl get hpa',
        badge: 'Auto-Scaling',
        difficulty: 'Intermediate',
        description: 'Automatically scale the number of Pod replicas in a deployment based on CPU, memory, or custom Prometheus metrics (HTTP requests/sec).',
        explanation: 'The `HorizontalPodAutoscaler` (HPA) controller periodically queries the metrics API (every 15 seconds) to compare current resource utilization against target thresholds. The scaling equation computes: `desiredReplicas = ceil[currentReplicas * (currentMetricValue / targetMetricValue)]`. HPA v2 supports multi-metric scaling, custom Prometheus metrics (e.g. queue length, latency p99), and stabilization windows (`scaleDown.stabilizationWindowSeconds: 300`) to prevent rapid thrashing ("flapping").',
        yamlSnippet: `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-hpa
  namespace: default
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: frontend-web
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 75
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300`,
        kubectlCommands: ['kubectl get hpa', 'kubectl describe hpa web-hpa'],
        visualizerFocus: 'HPA controller dynamically multiplying pod replicas as traffic spike occurs',
        practiceChallenge: {
          instructions: 'Check the cluster for any HorizontalPodAutoscalers configured.',
          goalCommand: 'kubectl get hpa',
          hints: ['Run kubectl get hpa', 'Examine REFERENCE, TARGETS, and MINPODS/MAXPODS'],
        },
        whatIsIt: "The Horizontal Pod Autoscaler (HPA) automatically scales the number of Pod replicas in a Deployment, ReplicaSet, or StatefulSet up or down based on observed CPU utilization, memory consumption, or custom Prometheus and external metrics.",
        inSimpleWords: "Think of an HPA like automatic check-in kiosks at an airport terminal. When passenger lines grow long (high CPU/request rate), the terminal automatically boots up 5 additional kiosks. When the rush hour ends and lines vanish, the extra kiosks power down to save electricity.",
        realWorldAnalogy: {
                  "metaphor": "Highway Electronic Toll Plaza Lanes Opening on Demand",
                  "explanation": "During rush hour, traffic sensors detect gridlock and automatically open 6 additional toll lanes. At 3:00 AM, the extra lanes close, leaving only 2 lanes open for overnight traffic."
        },
        whenToUse: [
                  "Handling unpredictable web traffic surges (Black Friday sales, breaking news events, marketing email campaigns).",
                  "Scaling worker pods based on message queue depth (e.g. SQS queue length, Kafka lag) using Prometheus custom metrics.",
                  "Optimizing cloud infrastructure costs by automatically scaling down compute during off-peak night hours."
        ],
        whenNotToUse: [
                  "Workloads that cannot scale horizontally (monolithic singletons, stateful databases requiring manual shard splitting).",
                  "Workloads with containers lacking declared CPU requests (HPA cannot compute percentage without requests).",
                  "Pairing HPA on CPU/memory with VPA on the exact same metric (causes conflicting autoscaler fights; see Goldilocks)."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "Metrics Scraping Loop",
                            "description": "The HPA controller queries the Metrics Server (metrics.k8s.io) or Custom Metrics API every 15 seconds (configurable)."
                  },
                  {
                            "step": 2,
                            "title": "Desired Replica Calculation",
                            "description": "Applies formula: desiredReplicas = ceil[currentReplicas * (currentMetricValue / targetMetricValue)]."
                  },
                  {
                            "step": 3,
                            "title": "Scale Target Subresource Mutation",
                            "description": "HPA patches the /scale subresource of the target Deployment (e.g. scaling replicas from 3 to 7)."
                  },
                  {
                            "step": 4,
                            "title": "Stabilization Window & Cooldown",
                            "description": "HPA enforces stabilization windows (default 5 min for scale-down) to prevent rapid \"flapping\" oscillation."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "autoscaling/v2 API",
                            "detail": "Supports multiple metrics simultaneously: Resource (CPU/RAM), Pods (custom metrics per pod), and External (AWS SQS, Kafka)."
                  },
                  {
                            "title": "behavior Scaling Rules",
                            "detail": "Allows fine-tuning scaleUp and scaleDown policies: limiting rate of replica additions/removals per minute."
                  },
                  {
                            "title": "KEDA (Kubernetes Event-driven Autoscaling)",
                            "detail": "Advanced CNCF operator extending HPA with 60+ external triggers (Kafka, RabbitMQ, Redis, AWS SQS, Azure ServiceBus)."
                  }
        ],
        productionTips: [
                  "Always configure a scaleDown stabilizationWindowSeconds (300s) to prevent premature scale-down during temporary traffic pauses.",
                  "Set container CPU requests accurately; if request is 100m and target is 80%, HPA scales up as soon as container uses 80m.",
                  "Adopt KEDA if you need to scale workloads to 0 when message queues are completely empty, saving 100% of compute cost."
        ],
      },
      {
        id: 'c-vpa-right-sizing',
        number: '9.2',
        title: 'Vertical Pod Autoscaler (VPA)',
        commandPill: 'kubectl get vpa',
        badge: 'Right-Sizing',
        difficulty: 'Advanced',
        description: 'Automatically right-size container CPU and memory requests based on historical usage to eliminate over-provisioning and OOM kills.',
        explanation: 'While HPA adjusts the number of pods horizontally, the `VerticalPodAutoscaler` (VPA) optimizes the CPU and memory requests of individual containers. VPA operates via three components: (1) `Recommender` (analyzes historical usage over time); (2) `Updater` (evicts pods when current requests diverge significantly from recommendation); (3) `Admission Controller` (mutates new pods to inject optimal requests on restart). VPA can operate in `Off` mode (recommendation only) or `Auto` mode.',
        yamlSnippet: `apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: api-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: frontend-web
  updatePolicy:
    updateMode: "Initial" # Right-sizes pods upon initial creation
  resourcePolicy:
    containerPolicies:
    - containerName: '*'
      minAllowed:
        cpu: 100m
        memory: 128Mi
      maxAllowed:
        cpu: 2000m
        memory: 4Gi`,
        kubectlCommands: ['kubectl get vpa', 'kubectl describe vpa api-vpa'],
        visualizerFocus: 'VPA analyzer tuning container CPU/RAM resource requests based on telemetry',
        practiceChallenge: {
          instructions: 'List any VerticalPodAutoscalers defined in the cluster.',
          goalCommand: 'kubectl get vpa',
          hints: ['Run kubectl get vpa', 'Observe MODE and CPU/MEMORY recommendations'],
        },
        whatIsIt: "The Vertical Pod Autoscaler (VPA) automatically analyzes historical container CPU and memory usage and dynamically adjusts resource requests and limits, right-sizing containers to eliminate over-provisioning waste and prevent out-of-memory crashes.",
        inSimpleWords: "While HPA adds more workers to the kitchen (horizontal scaling), VPA buys the existing chef a bigger stove and sharper knives (vertical scaling). If the chef is idle, VPA swaps out the massive stove for a compact single burner to save kitchen space.",
        realWorldAnalogy: {
                  "metaphor": "Tailored Suits and Dynamic Belt Adjustments",
                  "explanation": "Instead of buying three medium-sized shirts when you gain weight (HPA), you get your exact shirt tailored to fit your exact measurements (VPA), ensuring zero loose fabric and zero tight seams."
        },
        whenToUse: [
                  "Right-sizing monolithic services that cannot scale horizontally into multiple replicas.",
                  "Running in updateMode: \"Off\" (Recommendation Mode) with Goldilocks to generate optimal request/limit recommendations.",
                  "Preventing OOMKilled crashes on background data indexing processes with fluctuating memory demands."
        ],
        whenNotToUse: [
                  "Pairing VPA in active mutation mode (updateMode: \"Auto\") on CPU/memory alongside an HPA using the same metrics.",
                  "Workloads that cannot tolerate container restarts (in standard K8s, changing requests requires restarting the Pod).",
                  "Rapidly fluctuating spiky traffic (VPA adjusts slowly based on historical 8-day moving window percentiles)."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "Resource Telemetry Collection",
                            "description": "VPA Recommender continuously collects real CPU and memory consumption history from the Metrics Server or Prometheus."
                  },
                  {
                            "step": 2,
                            "title": "Statistical Profile Computation",
                            "description": "Recommender calculates target recommendations (LowerBound, Target, UpperBound, UncappedTarget) using 95th percentile curves."
                  },
                  {
                            "step": 3,
                            "title": "Admission Webhook Mutation",
                            "description": "When a new Pod is created, the VPA Mutating Admission Webhook intercepts the request and injects the recommended requests."
                  },
                  {
                            "step": 4,
                            "title": "Eviction & In-Place Resizing",
                            "description": "VPA Updater evicts running pods if their resources deviate significantly from recommendations, triggering a recreate with new limits."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "VPA updateMode Modes",
                            "detail": "Off (recommendation only, 0 restarts), Initial (sets values only at pod creation), Recreate (evicts pods to update), InPlace (K8s 1.27+ feature gate)."
                  },
                  {
                            "title": "In-Place Pod Resize (K8s 1.27+)",
                            "detail": "Allows resizing CPU and memory cgroups live on the host node without terminating or restarting the container process."
                  },
                  {
                            "title": "Goldilocks Dashboard",
                            "detail": "Open-source utility that visualizes VPA recommendations across all cluster namespaces in a clean web UI."
                  }
        ],
        productionTips: [
                  "Start with updateMode: \"Off\" in production; inspect recommendations in Grafana or Goldilocks for 2 weeks before automating updates.",
                  "Use resourcePolicy minAllowed and maxAllowed to place safety guardrails preventing VPA from shrinking pods to 0 or ballooning to consume the whole node.",
                  "Combine HPA for daytime traffic scaling and VPA for periodic baseline right-sizing of container requests."
        ],
      },
      {
        id: 'c-karpenter-cluster-autoscaler',
        number: '9.3',
        title: 'Cluster Autoscaler & Karpenter',
        commandPill: 'kubectl get nodepools,nodeclaims',
        badge: 'Cloud Elasticity',
        difficulty: 'Expert',
        description: 'Just-in-time cloud infrastructure scaling: comparing the legacy Cluster Autoscaler against high-speed Karpenter node consolidation.',
        explanation: 'When pods are Pending because nodes lack capacity, the cluster must provision physical/cloud VMs. Legacy `Cluster Autoscaler` works through cloud node groups (ASGs/MIGs), which is slow (taking 3-5 minutes per node). Modern `Karpenter` is a flexible, group-less node autoscaler that directly talks to cloud APIs (AWS EC2, Azure). It evaluates the exact aggregate CPU, RAM, GPU, and architecture (x86 vs ARM Graviton) requirements of Pending pods, provisions the exact cheapest instance type in under 45 seconds, and automatically consolidates underutilized nodes to minimize cloud spend.',
        yamlSnippet: `apiVersion: karpenter.sh/v1beta1
kind: NodePool
metadata:
  name: default
spec:
  template:
    spec:
      requirements:
      - key: karpenter.sh/capacity-type
        operator: In
        values: ["spot", "on-demand"]
      - key: kubernetes.io/arch
        operator: In
        values: ["arm64", "amd64"]
      nodeClassRef:
        name: default-ec2
  disruption:
    consolidationPolicy: WhenUnderutilized
    expireAfter: 720h`,
        kubectlCommands: ['kubectl get nodes -o wide', 'kubectl get nodes -L node.kubernetes.io/instance-type'],
        visualizerFocus: 'Karpenter dynamically launching optimal cloud EC2/Compute instances for pending pods',
        practiceChallenge: {
          instructions: 'List all cluster nodes to see their current capacity and readiness.',
          goalCommand: 'kubectl get nodes',
          hints: ['Run kubectl get nodes', 'Observe node health and counts'],
        },
        whatIsIt: "Cluster Autoscaler and Karpenter are cluster-level elasticity controllers that automatically provision, scale up, right-size, and terminate physical or virtual cloud worker nodes based on pending unscheduled pods and cluster resource utilization.",
        inSimpleWords: "HPA adds more passengers to the bus. Cluster Autoscaler and Karpenter order an extra bus from the fleet when the bus terminal is full and passengers are left waiting on the sidewalk. When buses are half-empty, they consolidate passengers onto fewer buses and send the empty ones home.",
        realWorldAnalogy: {
                  "metaphor": "Modular Expandable Hotel Wings and Modular Construction",
                  "explanation": "When a massive convention books all hotel rooms, a modular construction crane drops 20 new ready-to-use prefabricated rooms onto the hotel roof in minutes (Karpenter). When the convention departs, the extra rooms are disassembled to eliminate heating and lighting costs."
        },
        whenToUse: [
                  "Dynamic cloud production clusters (AWS EKS, GCP GKE, Azure AKS) with fluctuating seasonal, diurnal, or batch workloads.",
                  "Rapid node provisioning: Karpenter bypasses slow cloud Auto Scaling Groups (ASGs), launching optimized EC2 instances in < 45 seconds.",
                  "Consolidating fragmented node pools to eliminate unused cloud capacity and slash cloud hosting bills by 30-50%."
        ],
        whenNotToUse: [
                  "Bare-metal on-premises datacenters lacking automated cloud infrastructure provisioning APIs.",
                  "Clusters where all workloads have static, predictable 24/7 compute consumption and pre-purchased reserved instances.",
                  "Environments lacking PodDisruptionBudgets (aggressive node consolidation can cause voluntary outage storms)."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "Pending Pod Detection",
                            "description": "Karpenter or Cluster Autoscaler watches for Pods in Pending phase because no existing worker nodes have sufficient allocatable capacity."
                  },
                  {
                            "step": 2,
                            "title": "Instance Optimization & Bin-Packing",
                            "description": "Karpenter evaluates pod constraints (labels, architecture, GPU, zones) and chooses the single cheapest compute instance that fits the workload."
                  },
                  {
                            "step": 3,
                            "title": "Cloud API Provisioning",
                            "description": "Directly calls cloud provider APIs (EC2 Fleet / GCE API), launches the optimized VM, installs kubelet, and joins it to the cluster in ~40s."
                  },
                  {
                            "step": 4,
                            "title": "Consolidation & De-provisioning",
                            "description": "When workloads terminate, Karpenter detects underutilized nodes, consolidates remaining pods onto other nodes, and terminates the idle machine."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "Cluster Autoscaler vs Karpenter",
                            "detail": "Cluster Autoscaler manages fixed Auto Scaling Groups (ASGs) with rigid node sizes; Karpenter is group-less and provisions arbitrary optimal instance types on-demand."
                  },
                  {
                            "title": "NodePool & EC2NodeClass (Karpenter v1.0)",
                            "detail": "Declarative CRDs specifying instance families (c6i, m6i, t4g), spot vs on-demand, architectures (amd64, arm64), and EBS volumes."
                  },
                  {
                            "title": "Automated Node Consolidation",
                            "detail": "Continuously searches for cheaper replacement instances or opportunities to pack pods onto fewer nodes, executing zero-waste bin-packing."
                  }
        ],
        productionTips: [
                  "Migrate from legacy Cluster Autoscaler to Karpenter on AWS EKS to drop node provisioning latency from 5 minutes down to 40 seconds.",
                  "Always configure PodDisruptionBudgets on your applications before enabling Karpenter consolidation to prevent disruptive node terminations.",
                  "Leverage ARM64 instances (Graviton) in your Karpenter NodePools to cut compute costs by an immediate 20% with higher energy efficiency."
        ],
      },
    ],
  },
];
