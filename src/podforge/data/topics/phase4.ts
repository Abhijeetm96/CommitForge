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
      },
    ],
  },
];
