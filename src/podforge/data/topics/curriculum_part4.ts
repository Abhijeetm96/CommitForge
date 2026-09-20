import type { KubeChapter } from './types';

export const PART_4_CHAPTERS: KubeChapter[] = [
  // =========================================================================
  // CHAPTER 10: Autoscaling
  // =========================================================================
  {
    id: 'ch10-autoscaling',
    number: 10,
    title: 'Autoscaling',
    category: 'Resource Governance',
    concepts: [
      {
        id: 'c-why-autoscaling',
        number: '10.1',
        title: 'Why Autoscaling?',
        commandPill: 'kubectl get hpa,vpa -A',
        badge: 'Elasticity Value',
        difficulty: 'Beginner',
        description: 'The business and technical justification for autoscaling: handling volatile traffic spikes, eliminating manual capacity management, and slashing cloud compute bills.',
        subtopics: [
          'Traffic variability',
          'Cost optimization',
          'Automated elasticity',
          'SLA protection',
        ],
        whatIsIt: 'The architectural capability of Kubernetes to automatically adjust compute allocation—both vertically (sizing pods) and horizontally (multiplying pods and nodes)—in real-time response to dynamic user demand.',
        inSimpleWords: 'An accordion for your cloud bill. When millions of customers shop during Black Friday, the cluster expands to 500 servers. When everyone goes to sleep at 3 AM, it shrinks to 5 servers so you don\'t waste money paying for idle machines.',
        realWorldAnalogy: {
          metaphor: 'Supermarket Cashier Lanes',
          explanation: 'At 8 AM on a Tuesday, only 1 cashier lane is open. At 6 PM on Friday when 200 shoppers enter the store with full grocery carts, the store manager pages 6 more employees to open registers 2 through 7 so checkout lines never back up.',
        },
        explanation: 'In static datacenter hosting, companies had to purchase and power enough physical servers to handle the highest peak hour of the entire year (e.g. Cyber Monday), leaving 85% of compute capacity completely idle and wasted for the remaining 364 days. In Kubernetes, elasticity is autonomic. Autoscaling solves two orthogonal dimensions: (1) `Workload Elasticity`: scaling pods horizontally (HPA) or vertically (VPA) as traffic waxes and wanes; (2) `Cluster Elasticity`: scaling worker nodes up or down (Cluster Autoscaler, Karpenter) when aggregate pod demand exceeds available node hardware.',
        whenToUse: [
          'Web applications, e-commerce stores, and APIs subject to predictable diurnal curves or sudden viral spikes',
          'Cost optimization initiatives aimed at reducing idle cloud infrastructure spending by 40-70%',
          'Guaranteeing Service Level Agreements (SLAs) during marketing campaigns without manual SRE interventions',
        ],
        whenNotToUse: [
          'Workloads that take 15 minutes to initialize (e.g. massive legacy monolithic apps) without pre-warming capacity',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Demand Influx', description: 'Incoming user traffic spikes from 1,000 to 10,000 requests per second.' },
          { step: 2, title: 'Workload Metric Reaction', description: 'HPA observes CPU exceeding target threshold and increases deployment replica count.' },
          { step: 3, title: 'Node Capacity Exhaustion', description: 'New pods stay in Pending state because existing nodes are full.' },
          { step: 4, title: 'Cluster Expansion', description: 'Karpenter / Cluster Autoscaler provisions new cloud VM instances to host the overflow pods.' },
        ],
        keyMechanisms: [
          { title: 'The Three-Tier Scaling Stack', detail: 'HPA (more pods) + VPA (bigger pods) + Cluster Autoscaler (more nodes).' },
          { title: 'Diurnal Traffic Curves', detail: 'Traffic rises during daytime business hours and plummets overnight; elasticity follows this curve automatically.' },
          { title: 'Scale-Down Stabilization Windows', detail: 'Prevents "flapping" (rapid oscillations between scale-up and scale-down) using cooldown timers.' },
        ],
        productionTips: [
          'Never run Horizontal Pod Autoscaler (HPA) without a Cluster Autoscaler; if all nodes fill up, HPA pods will remain stuck in Pending.',
          'Always set a sensible `minReplicas` (at least 2 or 3) on HPA to maintain high availability across multiple availability zones even during idle hours.',
        ],
        yamlSnippet: `# The Autoscaling Harmony:
# User Traffic Spikes
#   │
#   ▼
# Horizontal Pod Autoscaler (HPA) -> adds more Pods
#   │ (Nodes run out of CPU)
#   ▼
# Karpenter / Cluster Autoscaler -> adds more EC2/Compute Nodes`,
        kubectlCommands: [
          'kubectl get hpa',
          'kubectl get nodes',
          'kubectl get pods -o wide',
        ],
        visualizerFocus: 'Elastic cluster expansion multiplying pods and provisioning worker nodes',
        practiceChallenge: {
          instructions: 'Check if any autoscalers are currently configured in the cluster.',
          goalCommand: 'kubectl get hpa',
          hints: ['Run kubectl get hpa', 'Notice TARGETS, MINPODS, MAXPODS, and REPLICAS'],
        },
      },
      {
        id: 'c-horizontal-pod-autoscaler',
        number: '10.2',
        title: 'Horizontal Pod Autoscaler',
        commandPill: 'kubectl get hpa',
        badge: 'Pod Scaling',
        difficulty: 'Intermediate',
        description: 'Scale pods automatically with HPA v2: CPU/memory thresholds, custom Prometheus metrics, external metrics (SQS queue depth), and scaling behavior stabilization.',
        subtopics: [
          'HPA',
          'Scaling based on workload',
          'Target utilization calculations',
          'Custom & external metrics',
        ],
        whatIsIt: 'The Kubernetes controller that automatically scales the number of Pod replicas in a Deployment, ReplicaSet, or StatefulSet based on observed CPU utilization, memory consumption, or custom application metrics.',
        inSimpleWords: 'Cloning your best workers when the rush hits. If you have 2 web servers and they both reach 80% CPU capacity, HPA automatically spawns a 3rd, 4th, and 5th clone to share the workload until CPU drops back down to 50%.',
        realWorldAnalogy: {
          metaphor: 'Adding Taxis to the Airport Queue',
          explanation: 'When a single flight arrives, 5 taxis wait outside. When 10 international jumbo jets land at once, the taxi dispatcher calls 50 more cabs to the terminal so arriving passengers never wait in line.',
        },
        explanation: 'The Horizontal Pod Autoscaler (HPA) runs as a control loop inside `kube-controller-manager` with a default period of 15 seconds. It calculates the desired replica count using the formula: `desiredReplicas = ceil[currentReplicas * (currentMetricValue / targetMetricValue)]`. HPA v2 supports three metric sources: (1) `Resource Metrics`: CPU and memory from Metrics Server (e.g. target 70% of requested CPU); (2) `Custom Metrics`: In-cluster Prometheus metrics exposed via the `custom.metrics.k8s.io` API (e.g. HTTP requests/sec); (3) `External Metrics`: Outside cloud provider metrics (e.g. AWS SQS queue depth, GCP Pub/Sub messages).',
        whenToUse: [
          'Stateless web applications, REST APIs, and microservices facing variable traffic',
          'Message queue consumers that should scale up when message queue backlog grows',
          'Preventing service degradation during sudden marketing campaigns or viral events',
        ],
        whenNotToUse: [
          'Workloads with single-threaded bottlenecks where adding more pods does not relieve CPU load',
          'Applications without `resources.requests` configured (HPA cannot calculate utilization percentages without requests and will fail)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Metric Query Loop', description: 'Every 15s, HPA controller queries `metrics.k8s.io` for average container CPU utilization.' },
          { step: 2, title: 'Target Ratio Calculation', description: 'Controller divides current average (e.g. 160m) by target value (e.g. 100m), yielding ratio 1.6.' },
          { step: 3, title: 'Replica Math', description: 'If current replicas = 2, desired = ceil(2 * 1.6) = 4 replicas.' },
          { step: 4, title: 'Scale Subresource Update', description: 'HPA updates `deployment.spec.replicas` from 2 to 4 via the `/scale` subresource.' },
        ],
        keyMechanisms: [
          { title: 'The Desired Replicas Formula', detail: '`desiredReplicas = ceil[currentReplicas * (currentMetricValue / targetMetricValue)]`.' },
          { title: 'ScaleDown Stabilization Window', detail: '`behavior.scaleDown.stabilizationWindowSeconds` (default 300s) prevents premature scale-down during brief traffic lulls.' },
          { title: 'KEDA (Kubernetes Event-driven Autoscaling)', detail: 'Advanced event-driven autoscaler extending HPA to scale pods from 0 to thousands based on 50+ event triggers (Kafka, RabbitMQ, Redis).' },
        ],
        productionTips: [
          'Always configure `behavior.scaleDown.stabilizationWindowSeconds: 300` so your pods don\'t terminate immediately between consecutive traffic waves.',
          'Never set the HPA target CPU utilization above 80%; set it around 60-70% so existing pods have headroom while new pods are pulling images and warming up.',
          'Consider adopting KEDA for queue-based workers so you can scale all the way down to 0 replicas when queues are empty.',
        ],
        yamlSnippet: `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-service
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300`,
        kubectlCommands: [
          'kubectl get hpa',
          'kubectl describe hpa api-hpa',
        ],
        visualizerFocus: 'HPA multiplying deployment replica pods in response to CPU utilization spikes',
        practiceChallenge: {
          instructions: 'Inspect all HorizontalPodAutoscaler configurations across the cluster.',
          goalCommand: 'kubectl get hpa',
          hints: ['Run kubectl get hpa or kubectl get hpa -A', 'Verify scaleTargetRef, min, and max replicas'],
        },
      },
      {
        id: 'c-vertical-pod-autoscaler',
        number: '10.3',
        title: 'Vertical Pod Autoscaler',
        commandPill: 'kubectl get vpa -A',
        badge: 'Right-Sizing',
        difficulty: 'Advanced',
        description: 'Right-size compute without manual guessing: Vertical Pod Autoscaler (VPA), Recommender, Updater, Admission Controller, and HPA compatibility.',
        subtopics: [
          'VPA',
          'Resource recommendations',
          'Auto-adjusting requests/limits',
          'VPA vs HPA compatibility',
        ],
        whatIsIt: 'The Kubernetes controller that automatically analyzes historical CPU and memory consumption of your containers and adjusts their `resources.requests` and `limits` to match actual workload needs.',
        inSimpleWords: 'A personal tailor for your containers. Instead of adding more servers (horizontal), VPA makes your existing servers bigger or smaller (vertical) so you aren\'t wasting money paying for a 3-piece tuxedo when a t-shirt is all you need.',
        realWorldAnalogy: {
          metaphor: 'Upgrading to a Bigger Delivery Truck',
          explanation: 'If a delivery driver consistently carries 10 packages, the company gives them a small compact van. If the delivery volume grows to 500 packages every day, the company replaces the van with a full 18-wheeler semi-truck.',
        },
        explanation: 'Engineers notoriously struggle with estimating container resource requests, frequently over-provisioning memory by 400% (wasting money) or under-provisioning (causing OOMKills). The Vertical Pod Autoscaler (VPA) consists of three components: (1) `VPA Recommender`: Analyzes historical usage from Metrics Server / Prometheus and computes recommendations (`lowerBound`, `target`, `uncappedTarget`, `upperBound`); (2) `VPA Updater`: If `updateMode: "Auto"`, evicts pods that deviate significantly from recommendations; (3) `VPA Admission Webhook`: Intercepts pod recreation and mutates `spec.containers.resources` to inject the new recommended values.',
        whenToUse: [
          'Workloads that cannot scale horizontally (single-threaded monoliths, legacy stateful databases)',
          'Setting `updateMode: "Off"` across your entire cluster as an automated right-sizing recommendation engine for DevOps teams',
          'Automatically curing Java/JVM memory leaks and preventing OOMKills over time',
        ],
        whenNotToUse: [
          'Using VPA in `Auto` mode simultaneously with an HPA scaling on CPU or Memory (they will fight each other in an infinite scaling loop!)',
          'Workloads that cannot tolerate occasional pod restarts during vertical resize',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Historical Profiling', description: 'VPA Recommender observes container CPU/memory usage samples over 8-day rolling window.' },
          { step: 2, title: 'Recommendation Generation', description: 'Recommender calculates 95th percentile target values and writes to VPA object `status`.' },
          { step: 3, title: 'Pod Eviction (Auto Mode)', description: 'VPA Updater evicts the old pod via the Eviction API respecting PodDisruptionBudgets.' },
          { step: 4, title: 'Mutating Admission Injection', description: 'VPA mutating webhook injects the new larger/smaller requests into the replacement pod.' },
        ],
        keyMechanisms: [
          { title: 'The Three VPA Components', detail: 'Recommender (math/telemetry), Updater (evicts pods), and Admission Webhook (mutates YAML on create).' },
          { title: 'UpdateModes (Off, Initial, Recreate, Auto)', detail: '`Off` only outputs advice in status; `Initial` applies on new pods; `Auto` evicts live pods to resize.' },
          { title: 'In-Place Pod Resize (k8s 1.27+ Alpha/Beta)', detail: 'Next-gen Kubernetes feature allowing CPU/RAM resize without evicting or restarting the container.' },
        ],
        productionTips: [
          'Start with `updateMode: "Off"` in production! Read the `kubectl get vpa` recommendations in Slack or Grafana before letting VPA restart live pods.',
          'Never pair VPA on CPU/Memory with HPA on CPU/Memory; you CAN pair VPA on CPU with HPA on custom metrics (e.g. requests/sec).',
        ],
        yamlSnippet: `apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: api-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-service
  updatePolicy:
    updateMode: "Off" # Safe recommendation-only mode
  resourcePolicy:
    containerPolicies:
    - containerName: '*'
      minAllowed:
        cpu: "100m"
        memory: "128Mi"
      maxAllowed:
        cpu: "4000m"
        memory: "8Gi"`,
        kubectlCommands: [
          'kubectl get vpa -A',
          'kubectl describe vpa api-vpa',
        ],
        visualizerFocus: 'VPA Recommender analyzing historical telemetry and computing target requests',
        practiceChallenge: {
          instructions: 'Check if any VerticalPodAutoscalers are installed in the cluster.',
          goalCommand: 'kubectl get vpa -A',
          hints: ['Run kubectl get vpa -A', 'Review MODE, CPU, and MEM recommendations in output'],
        },
      },
      {
        id: 'c-cluster-autoscaling',
        number: '10.4',
        title: 'Cluster Autoscaling',
        commandPill: 'kubectl get nodes -L node.kubernetes.io/instance-type',
        badge: 'Node Elasticity',
        difficulty: 'Expert',
        description: 'Scale physical/virtual compute infrastructure: Cluster Autoscaler, node group expansion, Karpenter just-in-time provisioning, and scale-down node consolidation.',
        subtopics: [
          'Adding nodes',
          'Removing nodes',
          'Cluster Autoscaler vs Karpenter',
          'Scale-down stabilization',
        ],
        whatIsIt: 'The cluster-level elasticity mechanism that automatically provisions new worker node VMs from your cloud provider when pods cannot schedule due to resource exhaustion, and terminates underutilized nodes to minimize infrastructure costs.',
        inSimpleWords: 'Ordering new physical computers from Amazon, Google, or Microsoft with zero human intervention. When your cluster runs out of room for new pods, this robot buys more servers. When traffic slows down, it safely moves pods and turns off the empty servers.',
        realWorldAnalogy: {
          metaphor: 'Opening Additional Airport Terminal Gates',
          explanation: 'When 20 extra charter planes arrive unexpectedly and all existing airport gates are full, the airport director activates Terminal C, turning on the lights and air conditioning. When the rush ends, Terminal C is locked and powered down to save electricity.',
        },
        explanation: 'When HPA scales a deployment from 10 to 50 pods, existing worker nodes eventually run out of CPU and memory. The kube-scheduler marks the excess pods as `Pending` with `0/N nodes available: Insufficient cpu`. The `Cluster Autoscaler (CA)` watches for Pending pods, calculates how many cloud instances are needed, and calls cloud provider APIs (AWS ASG, GCP MIG) to launch new worker nodes. Once nodes register with the cluster, the scheduler places the pending pods. Modern clusters increasingly use `Karpenter`: an open-source, high-performance node autoscaler that bypasses rigid cloud Auto Scaling Groups, provisioning custom-tailored EC2 instances directly in under 45 seconds.',
        whenToUse: [
          'Any production cloud Kubernetes cluster (EKS, GKE, AKS) with variable workloads',
          'Slashing cloud compute bills by consolidating sparse nodes and leveraging Spot/Preemptible instances',
          'Rapidly absorbing massive batch workloads (machine learning training jobs) without manual node provisioning',
        ],
        whenNotToUse: [
          'Bare-metal on-premises datacenters lacking automated IPMI or PXE-boot server provisioning APIs',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Pending Pod Detection', description: 'Autoscaler detects Pods marked unschedulable due to resource deficits.' },
          { step: 2, title: 'Instance Sizing & Launch', description: 'Karpenter analyzes pod requirements (CPU, GPU, arch) and launches optimal cloud VM.' },
          { step: 3, title: 'Node Registration & Scheduling', description: 'New node initializes kubelet, joins cluster, and scheduler binds pending pods.' },
          { step: 4, title: 'Scale-Down Consolidation', description: 'If a node falls below 50% utilization, autoscaler cordons, drains, and terminates the VM.' },
        ],
        keyMechanisms: [
          { title: 'Cluster Autoscaler (ASG-based)', detail: 'Tied to cloud Auto Scaling Groups; scales in increments of predefined instance templates.' },
          { title: 'Karpenter (Group-less)', detail: 'Directly evaluates pod requirements and launches flexible, mixed instance types (m5, c5, t4g) with zero ASGs.' },
          { title: 'Scale-Down Drain Safety', detail: 'Never terminates a node containing un-replicated pods, pods with local storage, or pods blocked by PodDisruptionBudgets.' },
        ],
        productionTips: [
          'Adopt Karpenter on AWS EKS; it provisions nodes in ~40 seconds compared to 4-6 minutes for traditional Cluster Autoscaler ASGs.',
          'Always configure `PodDisruptionBudgets` on your workloads so the autoscaler does not drain too many replicas during node consolidation.',
          'Mix Spot instances (90% discount) with On-Demand fallbacks for stateless worker nodes to dramatically reduce cloud costs.',
        ],
        yamlSnippet: `# Karpenter NodePool CRD:
apiVersion: karpenter.sh/v1beta1
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
        values: ["amd64", "arm64"]
  disruption:
    consolidationPolicy: WhenUnderutilized
    expireAfter: 720h`,
        kubectlCommands: [
          'kubectl get nodes -L node.kubernetes.io/instance-type',
          'kubectl get nodepools,nodeclaims',
        ],
        visualizerFocus: 'Autoscaler detecting pending pods and provisioning new worker node instances',
        practiceChallenge: {
          instructions: 'Inspect all cluster nodes and their cloud instance types.',
          goalCommand: 'kubectl get nodes -L node.kubernetes.io/instance-type',
          hints: ['Run the kubectl get nodes command with the instance-type label', 'Verify node readiness'],
        },
      },
    ],
  },

  // =========================================================================
  // CHAPTER 11: Scheduling
  // =========================================================================
  {
    id: 'ch11-scheduling',
    number: 11,
    title: 'Scheduling',
    category: 'Resource Governance',
    concepts: [
      {
        id: 'c-k8s-scheduler-basics',
        number: '11.1',
        title: 'Kubernetes Scheduler Basics',
        commandPill: 'kubectl explain pod.spec.nodeName',
        badge: 'Placement Engine',
        difficulty: 'Intermediate',
        description: 'The matchmaking brain of Kubernetes: kube-scheduler, scheduling queues, Filtering (Predicates), Scoring (Priorities), and the Binding phase.',
        subtopics: [
          'Scheduling queue',
          'Filtering (Predicates)',
          'Scoring (Priorities)',
          'Binding phase',
        ],
        whatIsIt: 'The control plane component (`kube-scheduler`) responsible for watching newly created Pods that have no assigned `nodeName` and selecting the optimal worker node for them to run on based on resource availability, hardware constraints, and placement policies.',
        inSimpleWords: 'The ultimate matchmaker of Kubernetes. When a new pod is born, it asks: "Which computer has enough room for me, has the right GPU, lives in the right data center, and isn\'t already overcrowded?" The scheduler ranks all nodes and assigns the pod to the winner.',
        realWorldAnalogy: {
          metaphor: 'A Hotel Concierge Assigning Rooms to Guests',
          explanation: 'A family of 5 arrives at the hotel lobby. The concierge filters out rooms with only single beds (Filtering). Among the remaining penthouse suites, the concierge scores them by ocean view and elevator proximity (Scoring), and hands the guest the key to Room 402 (Binding).',
        },
        explanation: 'The kube-scheduler operates as a two-phase decision pipeline: (1) `Filtering (formerly Predicates)`: Filters out nodes that CANNOT run the pod (e.g. insufficient CPU/RAM, node taints the pod does not tolerate, disk pressure, node selector mismatches). If no nodes pass filtering, the pod stays Pending; (2) `Scoring (formerly Priorities)`: Ranks all surviving candidate nodes from 0 to 100 based on scoring plugins (e.g. least requested priority, image locality—preferring nodes that already have the container image cached, spreading across zones). The node with the highest score wins; (3) `Binding`: The scheduler sends a POST request to the API server writing `spec.nodeName = "chosen-node"`.',
        whenToUse: [
          'Understanding why pods are stuck in `Pending` phase with scheduling errors',
          'Tuning workload distribution across nodes to optimize performance and resilience',
          'Designing custom scheduling profiles for specialized AI/ML or high-performance compute clusters',
        ],
        whenNotToUse: [
          'Hardcoding `spec.nodeName: "node-1"` in production Pod manifests (bypasses the scheduler completely; if node-1 dies, your pod will never be rescheduled)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Scheduling Queue Ingestion', description: 'Unassigned pod placed in scheduler priority queue sorted by PriorityClass.' },
          { step: 2, title: 'Filtering Phase', description: 'Scheduler filters nodes using predicates: NodeResourcesFit, NodeName, NodePorts, PodTopologySpread.' },
          { step: 3, title: 'Scoring Phase', description: 'Surviving nodes scored: NodeResourcesBalancedAllocation, ImageLocality, NodeAffinityScoring.' },
          { step: 4, title: 'Binding Phase', description: 'Scheduler executes Binding subresource call, updating `pod.spec.nodeName`.' },
        ],
        keyMechanisms: [
          { title: 'The Two-Phase Pipeline (Filter & Score)', detail: 'Filter eliminates invalid nodes; Score ranks valid nodes to pick the optimal candidate.' },
          { title: 'Image Locality Scoring', detail: 'Nodes that already have the container image downloaded in local cache receive bonus points to speed up startup.' },
          { title: 'The Scheduling Framework', detail: 'Pluggable Go architecture allowing developers to hook into PreFilter, Filter, PostFilter, PreScore, Score, and Bind.' },
        ],
        productionTips: [
          'If a pod is stuck Pending, run `kubectl describe pod <name>` and look at the `Events:` section at the bottom for the scheduler rejection reasons.',
          'Never manually set `nodeName` in YAML; use `nodeSelector` or `nodeAffinity` instead to preserve scheduler flexibility.',
        ],
        yamlSnippet: `# How the Scheduler binds a Pod:
# 1. Pod submitted: spec.nodeName is EMPTY ("")
# 2. Scheduler runs Filter -> Score -> selects "worker-node-2"
# 3. Scheduler writes Binding:
#    spec:
#      nodeName: "worker-node-2"
# 4. Kubelet on worker-node-2 detects pod and launches containers`,
        kubectlCommands: [
          'kubectl explain pod.spec.nodeName',
          'kubectl get pods -o wide',
          'kubectl describe pod <pending-pod-name>',
        ],
        visualizerFocus: 'kube-scheduler filtering and scoring nodes to bind pods to target worker nodes',
        practiceChallenge: {
          instructions: 'Inspect the nodeName field documentation using kubectl explain.',
          goalCommand: 'kubectl explain pod.spec.nodeName',
          hints: ['Run kubectl explain pod.spec.nodeName', 'Notice that nodeName bypasses the scheduler'],
        },
      },
      {
        id: 'c-taints-and-tolerations',
        number: '11.2',
        title: 'Taints & Tolerations',
        commandPill: 'kubectl get nodes -o custom-columns=NAME:.metadata.name,TAINTS:.spec.taints',
        badge: 'Dedicated Nodes',
        difficulty: 'Intermediate',
        description: 'Repel pods from nodes: Node taints, Pod tolerations, effect types (NoSchedule, PreferNoSchedule, NoExecute), and dedicated GPU/infrastructure nodes.',
        subtopics: [
          'Node taints',
          'Pod tolerations',
          'Effect types (NoSchedule, PreferNoSchedule, NoExecute)',
          'Dedicated nodes',
        ],
        whatIsIt: 'The node-level exclusion mechanism in Kubernetes where Nodes express a "taint" (repelling certain pods) and Pods express "tolerations" (allowing them to be scheduled onto matching tainted nodes).',
        inSimpleWords: 'Mosquito repellent for nodes. A node sprays itself with a taint ("Only GPU workloads allowed!"). Regular pods are repelled and cannot land there. Only pods that have the matching badge (toleration) are permitted to enter.',
        realWorldAnalogy: {
          metaphor: 'A Secure Cleanroom in a Laboratory',
          explanation: 'The cleanroom door has a biohazard warning sign (Taint: `hazmat=true:NoSchedule`). Regular office staff cannot enter. Only specialized scientists wearing hazmat suits (Toleration) are allowed through the door.',
        },
        explanation: 'While Node Affinity attracts pods to specific nodes, Taints do the opposite: they allow a node to repel a set of pods. A taint consists of a `key`, `value`, and `effect`: (1) `NoSchedule`: Unless a pod has a matching toleration, it will NEVER be scheduled on this node; (2) `PreferNoSchedule`: Kube-scheduler avoids placing untolerated pods here, but will do so if no other nodes exist; (3) `NoExecute`: If added to a node, any running pods that do NOT tolerate the taint are immediately evicted from the node! Kubernetes uses built-in taints to protect the control plane (`node-role.kubernetes.io/control-plane:NoSchedule`) and handle node hardware failures (`node.kubernetes.io/unreachable:NoExecute`).',
        whenToUse: [
          'Reserving dedicated high-cost GPU nodes (A100/H100) exclusively for AI/ML training jobs',
          'Protecting control plane master nodes from running regular user application pods',
          'Isolating sensitive PCI/HIPAA compliance workloads onto dedicated bare-metal machines',
        ],
        whenNotToUse: [
          'Using taints to force a pod onto a specific node (taints only REPEL; you must pair a Taint with NodeAffinity to both repel other pods AND attract the desired pod)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Node Taint Application', description: 'Admin runs `kubectl taint nodes gpu-node-1 accelerator=nvidia:NoSchedule`.' },
          { step: 2, title: 'Scheduler Filter Check', description: 'When scheduling standard web pods, scheduler sees taint with no matching toleration and rejects node.' },
          { step: 3, title: 'Tolerant Pod Evaluation', description: 'AI training pod specifies matching toleration in its PodSpec; node passes filtering.' },
          { step: 4, title: 'NoExecute Eviction Trigger', description: 'If a node suffers disk failure, kubelet taints `node.kubernetes.io/disk-pressure:NoSchedule`.' },
        ],
        keyMechanisms: [
          { title: 'Taint Syntax (key=value:effect)', detail: 'Consists of key, optional value, and one of three strict effect types.' },
          { title: 'The NoExecute Effect', detail: 'Unlike NoSchedule, NoExecute evicts currently running live pods that lack the toleration.' },
          { title: 'tolerationSeconds', detail: 'Controls how many seconds a pod can remain on a node tainted with NoExecute before being evicted.' },
        ],
        productionTips: [
          'CKA Exam Essential: Add a taint with `kubectl taint nodes <node> key=value:NoSchedule` and remove it with a trailing minus: `kubectl taint nodes <node> key=value:NoSchedule-`.',
          'Master the built-in control plane taint: `node-role.kubernetes.io/control-plane:NoSchedule` prevents accidental workloads on master nodes.',
        ],
        yamlSnippet: `apiVersion: v1
kind: Pod
metadata:
  name: ml-training-pod
spec:
  tolerations:
  - key: "accelerator"
    operator: "Equal"
    value: "nvidia"
    effect: "NoSchedule"
  containers:
  - name: cuda-runner
    image: pytorch:2.2-cuda`,
        kubectlCommands: [
          'kubectl get nodes -o custom-columns=NAME:.metadata.name,TAINTS:.spec.taints',
          'kubectl taint nodes <node-name> dedicated=special:NoSchedule',
          'kubectl taint nodes <node-name> dedicated=special:NoSchedule-',
        ],
        visualizerFocus: 'Node taints repelling regular pods while permitting pods with matching tolerations',
        practiceChallenge: {
          instructions: 'Inspect all active taints configured on your cluster nodes.',
          goalCommand: 'kubectl get nodes -o custom-columns=NAME:.metadata.name,TAINTS:.spec.taints',
          hints: ['Run the command with custom-columns', 'Look for control-plane or specialized taints'],
        },
      },
      {
        id: 'c-topology-spread-constraints',
        number: '11.3',
        title: 'Topology Spread Constraints',
        commandPill: 'kubectl explain pod.spec.topologySpreadConstraints',
        badge: 'Failure Resilience',
        difficulty: 'Advanced',
        description: 'Distribute pods evenly across failure domains: topologyKey (zones, nodes, racks), maxSkew, whenUnsatisfiable (DoNotSchedule vs ScheduleAnyway), and high availability.',
        subtopics: [
          'maxSkew',
          'topologyKey (zones/nodes)',
          'whenUnsatisfiable',
          'High availability spread',
        ],
        whatIsIt: 'The declarative placement API in Kubernetes that controls how Pods are distributed evenly across failure domains (availability zones, regions, server racks, or individual nodes) to maximize high availability and prevent single-datacenter outages.',
        inSimpleWords: 'Don\'t put all your eggs in one basket. If you have 6 pods and 3 data centers (Zone A, Zone B, Zone C), Topology Spread Constraints forces Kubernetes to place exactly 2 pods in Zone A, 2 in Zone B, and 2 in Zone C.',
        realWorldAnalogy: {
          metaphor: 'Distributing Lifeboats Across a Cruise Ship',
          explanation: 'You do not pile all 20 lifeboats on the rear left corner of the ship. Maritime safety rules require distributing lifeboats evenly along the port side, starboard side, bow, and stern so that damage to any single area leaves lifeboats available everywhere.',
        },
        explanation: 'Earlier versions of Kubernetes relied on Pod Anti-Affinity to spread pods, but anti-affinity is binary (either allow or forbid) and caused severe scheduling deadlocks. `TopologySpreadConstraints` provides granular mathematical control using four fields: (1) `topologyKey`: The node label defining the failure domain (e.g. `topology.kubernetes.io/zone` for cloud AZs, or `kubernetes.io/hostname` for nodes); (2) `maxSkew`: The maximum allowable difference in pod count between any two topology domains; (3) `whenUnsatisfiable`: `DoNotSchedule` (hard rule) or `ScheduleAnyway` (soft priority); (4) `labelSelector`: Identifies matching pods to balance.',
        whenToUse: [
          'Distributing multi-replica deployments evenly across Multi-AZ cloud regions for 99.99% uptime',
          'Spreading stateful database replicas (Cassandra, Kafka, CockroachDB) across separate physical racks',
          'Replacing rigid `podAntiAffinity` rules with flexible, deadlock-free mathematical distribution',
        ],
        whenNotToUse: [
          'Setting `maxSkew: 1` with `whenUnsatisfiable: DoNotSchedule` in clusters with asymmetric zone sizes (causes pods to get stuck in Pending if one zone runs out of nodes)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Constraint Parsing', description: 'Scheduler reads `topologySpreadConstraints` and identifies failure domain label `topology.kubernetes.io/zone`.' },
          { step: 2, title: 'Zone Census', description: 'Scheduler counts existing matching pods in zone-a (2), zone-b (2), and zone-c (1).' },
          { step: 3, title: 'Skew Calculation', description: 'Placing a pod in zone-c yields skew 0 (2-2=0); placing in zone-a yields skew 2 (3-1=2).' },
          { step: 4, title: 'Optimal Placement', description: 'Scheduler binds the pod to zone-c to minimize skew and maintain uniform balance.' },
        ],
        keyMechanisms: [
          { title: 'The maxSkew Parameter', detail: 'The degree of allowable imbalance. `maxSkew: 1` means zone counts can differ by at most 1 pod.' },
          { title: 'The topologyKey', detail: 'Specifies the failure domain: `topology.kubernetes.io/zone` (zones), `kubernetes.io/hostname` (machines).' },
          { title: 'whenUnsatisfiable (DoNotSchedule vs ScheduleAnyway)', detail: '`DoNotSchedule` enforces strict compliance; `ScheduleAnyway` prioritizes balance without blocking scheduling.' },
        ],
        productionTips: [
          'Always use `topologyKey: topology.kubernetes.io/zone` with `maxSkew: 1` on critical production services.',
          'Prefer `whenUnsatisfiable: ScheduleAnyway` if your cluster undergoes frequent node autoscaling to avoid stuck Pending pods.',
        ],
        yamlSnippet: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ha-frontend
spec:
  replicas: 6
  template:
    spec:
      topologySpreadConstraints:
      - maxSkew: 1
        topologyKey: topology.kubernetes.io/zone
        whenUnsatisfiable: DoNotSchedule
        labelSelector:
          matchLabels:
            app: frontend
      containers:
      - name: web
        image: nginx:alpine`,
        kubectlCommands: [
          'kubectl explain pod.spec.topologySpreadConstraints',
          'kubectl get nodes --show-labels | grep zone',
        ],
        visualizerFocus: 'Topology Spread Constraints balancing pods evenly across multi-AZ failure zones',
        practiceChallenge: {
          instructions: 'Inspect the topologySpreadConstraints documentation using kubectl explain.',
          goalCommand: 'kubectl explain pod.spec.topologySpreadConstraints',
          hints: ['Run kubectl explain pod.spec.topologySpreadConstraints', 'Notice maxSkew, topologyKey, and whenUnsatisfiable'],
        },
      },
      {
        id: 'c-pod-priorities-preemption',
        number: '11.4',
        title: 'Pod Priorities',
        commandPill: 'kubectl get priorityclasses',
        badge: 'Preemption Engine',
        difficulty: 'Advanced',
        description: 'Prioritize mission-critical pods: PriorityClasses, preemption mechanics, evicting lower-priority pods during resource shortages, and system-cluster-critical tiers.',
        subtopics: [
          'PriorityClasses',
          'Preemption mechanics',
          'Evicting lower priority pods',
          'System critical priorities',
        ],
        whatIsIt: 'The Kubernetes scheduling mechanism that assigns relative integer importance to Pods via `PriorityClass` objects, allowing the scheduler to preempt (evict) lower-priority pods to make room for higher-priority pods when a cluster is out of capacity.',
        inSimpleWords: 'Emergency sirens and flashing lights for critical pods. If a hospital power generator pod needs to start, but the cluster is 100% full running YouTube downloaders (low priority), Kubernetes immediately kicks the downloaders out of their seats to make room.',
        realWorldAnalogy: {
          metaphor: 'An Ambulance in Heavy Highway Traffic',
          explanation: 'When an emergency ambulance with sirens blaring approaches gridlocked traffic, regular passenger cars pull onto the shoulder to clear a lane, allowing the ambulance to reach the hospital without delay.',
        },
        explanation: 'When a cluster is running at 100% compute capacity and a critical production payment API pod is created, standard scheduling would leave it stuck in `Pending`. `PriorityClasses` solve this through Preemption. Each PriorityClass defines an integer value between 0 and 1,000,000,000. When a high-priority pod is unschedulable, the kube-scheduler identifies lower-priority pods on candidate nodes, initiates graceful eviction of those lower-priority pods (sending SIGTERM), and binds the high-priority pod to the newly freed node. Kubernetes provides two built-in super-priorities for system daemons: `system-cluster-critical` and `system-node-critical` (2 billion value).',
        whenToUse: [
          'Guaranteeing that core business revenue services (e.g. checkout, payment) can always schedule even during peak capacity',
          'Ensuring cluster infrastructure components (CoreDNS, Calico CNI, Metrics Server) can never be starved by user pods',
          'Running low-priority batch/dev jobs with `value: 0` that gracefully yield compute when production needs capacity',
        ],
        whenNotToUse: [
          'Assigning `system-cluster-critical` to regular business applications (abusing system priority can evict CoreDNS and crash the cluster)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'High-Priority Scheduling Attempt', description: 'Critical pod with `priorityClassName: production-critical` cannot find a node with enough capacity.' },
          { step: 2, title: 'Preemption Candidate Search', description: 'Scheduler searches nodes for lower-priority pods whose eviction would satisfy the critical pod requests.' },
          { step: 3, title: 'Victim Eviction', description: 'Scheduler initiates graceful eviction of chosen low-priority victim pods (terminationGracePeriod).' },
          { step: 4, title: 'Nominated Node Binding', description: 'Scheduler sets `nominatedNodeName`; once victims exit, the critical pod binds and starts.' },
        ],
        keyMechanisms: [
          { title: 'The PriorityClass Value', detail: '32-bit integer; higher numbers indicate higher priority (e.g. 1000000 vs 1000).' },
          { title: 'Preemption vs Node Eviction', detail: 'Preemption is performed proactively by the scheduler at placement time; eviction is performed by kubelet under resource pressure.' },
          { title: 'preemptionPolicy: Never', detail: 'Allows high priority in the scheduling queue without evicting other running pods.' },
        ],
        productionTips: [
          'Create three standardized PriorityClasses: `prod-high` (1,000,000), `prod-normal` (500,000), and `batch-low` (1,000).',
          'Always give batch workloads a low priority so they automatically yield resources to production web traffic during spikes.',
        ],
        yamlSnippet: `apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: mission-critical
value: 1000000
globalDefault: false
description: "Mission-critical services that preempt all other workloads."
---
apiVersion: v1
kind: Pod
metadata:
  name: payment-service
spec:
  priorityClassName: mission-critical
  containers:
  - name: api
    image: payment:v3`,
        kubectlCommands: [
          'kubectl get priorityclasses',
          'kubectl describe priorityclass system-cluster-critical',
        ],
        visualizerFocus: 'High-priority pod triggering preemption and eviction of lower-priority victim pods',
        practiceChallenge: {
          instructions: 'View the system PriorityClasses defined in the cluster using kubectl get priorityclasses.',
          goalCommand: 'kubectl get priorityclasses',
          hints: ['Run kubectl get priorityclasses or kubectl get pc', 'Notice system-cluster-critical and system-node-critical'],
        },
      },
      {
        id: 'c-pod-evictions-graceful',
        number: '11.5',
        title: 'Pod Evictions',
        commandPill: 'kubectl get pdb -A',
        badge: 'Graceful Eviction',
        difficulty: 'Advanced',
        description: 'Understand pod termination and eviction: Kubelet node pressure eviction (MemoryPressure), API-initiated evictions, and PodDisruptionBudgets (PDB).',
        subtopics: [
          'Kubelet node pressure eviction',
          'API-initiated eviction',
          'PodDisruptionBudgets (PDB)',
          'Soft vs hard thresholds',
        ],
        whatIsIt: 'The process by which Kubernetes terminates pods proactively to preserve node stability under resource pressure (Node Pressure Eviction) or during voluntary administrative node draining (API-initiated Eviction), governed by PodDisruptionBudgets (PDB).',
        inSimpleWords: 'The eviction notice. When a worker node is running out of memory and about to crash, the kubelet starts kicking out the least important pods to save the machine. PodDisruptionBudgets make sure the landlord can\'t kick out so many servers that your website goes down.',
        realWorldAnalogy: {
          metaphor: 'Emergency Evacuation of an Overcrowded Lifeboat',
          explanation: 'If a lifeboat starts taking on water (MemoryPressure), heavy cargo and non-essential luggage (BestEffort pods) are thrown overboard first to keep the passengers (Guaranteed production pods) alive and afloat.',
        },
        explanation: 'Pod eviction occurs under two distinct scenarios: (1) `Node Pressure Eviction (Kubelet)`: If a node\'s available memory or disk drops below hard eviction thresholds (e.g. `memory.available < 100Mi`), the local kubelet evicts pods based on their QoS class and memory consumption: `BestEffort` pods first, then `Burstable` pods exceeding requests, and lastly `Guaranteed` pods; (2) `API-Initiated Eviction (kubectl drain)`: When an admin drains a node for maintenance, `kubectl drain` uses the Eviction API (`/eviction`). This API respects `PodDisruptionBudgets (PDB)`: if a PDB specifies `minAvailable: 2` and only 2 pods are currently healthy, eviction requests are blocked until replacements are running elsewhere.',
        whenToUse: [
          'Protecting production service availability during cluster maintenance using PodDisruptionBudgets',
          'Safely draining nodes for Linux kernel upgrades without dropping customer HTTP requests',
          'Diagnosing why pods were terminated with `Reason: Evicted` during memory pressure spikes',
        ],
        whenNotToUse: [
          'Configuring PDBs with `minAvailable: 100%` on single-replica Deployments (blocks node draining forever!)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Eviction Request', description: 'Admin runs `kubectl drain` or Kubelet detects memory threshold breach.' },
          { step: 2, title: 'PDB Quota Verification', description: 'Eviction API verifies that active healthy replicas minus 1 >= `minAvailable`.' },
          { step: 3, title: 'SIGTERM Broadcast', description: 'Pod receives SIGTERM and starts `terminationGracePeriodSeconds` countdown to finish requests.' },
          { step: 4, title: 'Replacement Scheduling', description: 'Deployment controller detects replica deficit and schedules replacement on another node.' },
        ],
        keyMechanisms: [
          { title: 'PodDisruptionBudget (PDB)', detail: 'Specifies `minAvailable` or `maxUnavailable` to limit concurrent voluntary disruptions during node drains.' },
          { title: 'QoS Eviction Priority Order', detail: 'BestEffort -> Burstable (exceeding requests) -> Burstable (under requests) -> Guaranteed.' },
          { title: 'Hard vs Soft Eviction Thresholds', detail: 'Hard thresholds evict immediately; soft thresholds grant a grace period before evicting.' },
        ],
        productionTips: [
          'CKA Exam Golden Rule: Always configure a `PodDisruptionBudget` for every production service with 2+ replicas (e.g. `maxUnavailable: 1`).',
          'Never use `--force` on `kubectl drain` in production unless in a catastrophic emergency, as it bypasses PDB safety guarantees.',
        ],
        yamlSnippet: `apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: api-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: backend-api`,
        kubectlCommands: [
          'kubectl get pdb -A',
          'kubectl describe pdb api-pdb',
          'kubectl get pods --field-selector=status.phase=Failed',
        ],
        visualizerFocus: 'PodDisruptionBudget permitting graceful node eviction while preserving minimum available replicas',
        practiceChallenge: {
          instructions: 'Check for any PodDisruptionBudgets configured across all namespaces.',
          goalCommand: 'kubectl get pdb -A',
          hints: ['Run kubectl get pdb -A', 'Notice MIN AVAILABLE and ALLOWED DISRUPTIONS columns'],
        },
      },
    ],
  },

  // =========================================================================
  // CHAPTER 12: Storage & Volumes
  // =========================================================================
  {
    id: 'ch12-storage',
    number: 12,
    title: 'Storage & Volumes',
    category: 'State & Storage',
    concepts: [
      {
        id: 'c-k8s-storage-fundamentals',
        number: '12.1',
        title: 'Kubernetes Storage',
        commandPill: 'kubectl explain pod.spec.volumes',
        badge: 'Storage Philosophy',
        difficulty: 'Beginner',
        description: 'Understand cloud-native storage foundations: ephemeral container layers, why persistent storage is required, and decoupling storage lifecycles from pods.',
        subtopics: [
          'Container ephemeral layer',
          'Why persistent storage is needed',
          'Storage lifecycle decoupled from pods',
        ],
        whatIsIt: 'The architectural design and storage philosophy in Kubernetes that decouples persistent state from ephemeral container lifecycles, ensuring that databases, logs, and files survive pod crashes, restarts, and node rescheduling.',
        inSimpleWords: 'Saving your game to a memory card. Containers have goldfish memory: the moment a container restarts or crashes, everything written to its hard drive is erased forever. Kubernetes volumes act as external hard drives that plug into the container so your data never gets wiped out.',
        realWorldAnalogy: {
          metaphor: 'A USB Flash Drive Plugged into an Internet Cafe Computer',
          explanation: 'When you sit at a public library computer, any files saved to the desktop are wiped clean the moment you log off. But if you plug in a USB flash drive (Volume), your documents remain safely stored on the drive when you leave.',
        },
        explanation: 'By default, all files created inside a container are written to its thin copy-on-write (CoW) ephemeral storage layer. This presents two critical problems: (1) When a container crashes, kubelet restarts it, but all files in the writable layer are permanently lost; (2) When running multiple containers inside the same Pod, they cannot share files with each other. Kubernetes Volumes solve this by introducing storage volumes that outlive individual container restarts, and PersistentVolumes that outlive the entire Pod itself.',
        whenToUse: [
          'Databases (PostgreSQL, MySQL, MongoDB) requiring durable storage across crashes',
          'Sharing files between containers in the same pod (e.g. web server serving HTML rendered by a git-sync sidecar)',
          'Mounting configuration files and TLS certificates into container filesystems',
        ],
        whenNotToUse: [
          'Storing stateful data directly inside the root filesystem of stateless microservices (stateless apps should remain ephemeral)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Volume Definition', description: 'Pod manifest defines a volume in `spec.volumes`.' },
          { step: 2, title: 'Filesystem Mount', description: 'Container mounts the volume at a designated directory via `volumeMounts`.' },
          { step: 3, title: 'Container Crash & Restart', description: 'Application container process crashes and restarts; volume remains mounted with all data intact.' },
          { step: 4, title: 'Pod Deletion', description: 'Ephemeral volumes (emptyDir) delete with the pod; persistent volumes (PVC) survive indefinitely.' },
        ],
        keyMechanisms: [
          { title: 'The Ephemeral Writable Layer', detail: 'Managed by storage drivers (OverlayFS); deleted immediately when container terminates.' },
          { title: 'Pod-Level Volume Scope', detail: 'Volumes are defined at the Pod level and mounted independently into one or more containers.' },
          { title: 'Decoupling Storage from Compute', detail: 'Separates compute nodes (which scale up and down) from storage backends (EBS, Ceph, NFS).' },
        ],
        productionTips: [
          'Never run production databases without a PersistentVolumeClaim; relying on container writable layers guarantees total data loss upon node reboot.',
          'Use `emptyDir` for temporary scratch space (e.g. unzipping archives, video processing temp files) rather than container root filesystems.',
        ],
        yamlSnippet: `apiVersion: v1
kind: Pod
metadata:
  name: shared-storage-demo
spec:
  containers:
  - name: writer
    image: busybox
    command: ["sh", "-c", "echo 'Hello from writer' > /data/message.txt && sleep 3600"]
    volumeMounts:
    - name: shared-vol
      mountPath: /data
  - name: reader
    image: busybox
    command: ["sh", "-c", "cat /data/message.txt && sleep 3600"]
    volumeMounts:
    - name: shared-vol
      mountPath: /data
  volumes:
  - name: shared-vol
    emptyDir: {}`,
        kubectlCommands: [
          'kubectl explain pod.spec.volumes',
          'kubectl explain pod.spec.containers.volumeMounts',
        ],
        visualizerFocus: 'Decoupled volume mounted into multiple containers sharing data',
        practiceChallenge: {
          instructions: 'Inspect the volumes field documentation using kubectl explain.',
          goalCommand: 'kubectl explain pod.spec.volumes',
          hints: ['Run kubectl explain pod.spec.volumes', 'Notice emptyDir, hostPath, and persistentVolumeClaim'],
        },
      },
      {
        id: 'c-k8s-volumes-emptydir-hostpath',
        number: '12.2',
        title: 'Volumes',
        commandPill: 'kubectl explain pod.spec.volumes.emptyDir',
        badge: 'Local Volumes',
        difficulty: 'Beginner',
        description: 'Explore fundamental volume types: emptyDir (scratch disk and in-memory tmpfs), hostPath (node filesystem access), and projected volumes (configMap, secret).',
        subtopics: [
          'emptyDir for scratch cache',
          'hostPath for node access',
          'configMap/secret projected volumes',
          'Downwards API',
        ],
        whatIsIt: 'The built-in local volume plugins in Kubernetes that provide storage tied directly to the lifecycle of the host node or the enclosing Pod, without requiring external network storage.',
        inSimpleWords: 'Local storage tricks. `emptyDir` is a temporary scratch pad created when your pod wakes up and erased when it dies. `hostPath` lets your pod peek directly into the hard drive of the physical server it is sitting on.',
        realWorldAnalogy: {
          metaphor: 'A Hotel Room Whiteboard & Building Maintenance Key',
          explanation: '`emptyDir` is a dry-erase whiteboard in your hotel room: you can write notes on it during your stay, but room service wipes it clean for the next guest. `hostPath` is a master key that lets you walk down into the hotel basement furnace room.',
        },
        explanation: 'Kubernetes includes several built-in volume plugins: (1) `emptyDir`: An empty directory created when a Pod is assigned to a node. Exists as long as that Pod runs. If the container crashes, data persists; but if the Pod is evicted or deleted, data is erased. Can be backed by RAM (`medium: "Memory"`) for blazing-fast tmpfs scratch disks; (2) `hostPath`: Mounts a file or directory from the host worker node filesystem (e.g. `/var/log`, `/var/run/docker.sock`) into the pod. Primarily used by system DaemonSets (logging agents, CNI); (3) `Projected Volumes`: Maps ConfigMaps, Secrets, Downward API, and ServiceAccount tokens into a unified directory.',
        whenToUse: [
          'emptyDir: Scratch space for sorting large files, image processing pipelines, local caching, inter-container file sharing',
          'emptyDir with medium Memory: High-speed RAM disks for sensitive cryptographic operations',
          'hostPath: System DaemonSets (Fluent Bit reading `/var/log/pods`, crictl debugging tools)',
        ],
        whenNotToUse: [
          'Using hostPath for regular multi-replica user applications (if pod-1 writes data to node-A, pod-2 on node-B cannot see it; if pod-1 is rescheduled to node-C, its data is gone!)',
          'Using hostPath in unprivileged namespaces (severe security risk: allows containers to overwrite host root filesystem)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Node Assignment', description: 'Pod scheduled; kubelet creates directory in `/var/lib/kubelet/pods/<pod-uid>/volumes/kubernetes.io~emptyDir/`.' },
          { step: 2, title: 'Filesystem Mount', description: 'Kubelet mounts the host directory into container mount namespace at designated path.' },
          { step: 3, title: 'Shared R/W Execution', description: 'Containers read and write to the volume concurrently.' },
          { step: 4, title: 'Teardown Cleanup', description: 'When Pod terminates, kubelet deletes the entire emptyDir directory from the host disk.' },
        ],
        keyMechanisms: [
          { title: 'emptyDir with medium: Memory', detail: 'Backs the emptyDir with a Linux `tmpfs` RAM disk; blazing fast, but counts toward container memory limit.' },
          { title: 'hostPath Security Risks', detail: 'Allows container breakout to the host OS; restricted by Pod Security Standards.' },
          { title: 'Projected Volume Token Projection', detail: 'Injects time-bound, audience-scoped ServiceAccount JWT tokens into pods.' },
        ],
        productionTips: [
          'Never use `hostPath` for stateful user databases; use PersistentVolumeClaims backed by network block storage.',
          'Always set `sizeLimit` on `emptyDir` volumes to prevent a runaway container from filling up the entire worker node root disk.',
        ],
        yamlSnippet: `apiVersion: v1
kind: Pod
metadata:
  name: ram-disk-demo
spec:
  containers:
  - name: cache
    image: redis:alpine
    volumeMounts:
    - name: memory-storage
      mountPath: /cache
  volumes:
  - name: memory-storage
    emptyDir:
      medium: Memory # Backed by RAM tmpfs!
      sizeLimit: 512Mi`,
        kubectlCommands: [
          'kubectl explain pod.spec.volumes.emptyDir',
          'kubectl explain pod.spec.volumes.hostPath',
        ],
        visualizerFocus: 'emptyDir volume sharing data between containers and persisting across container restarts',
        practiceChallenge: {
          instructions: 'Inspect the emptyDir volume specification documentation using kubectl explain.',
          goalCommand: 'kubectl explain pod.spec.volumes.emptyDir',
          hints: ['Run kubectl explain pod.spec.volumes.emptyDir', 'Notice medium and sizeLimit fields'],
        },
      },
      {
        id: 'c-persistent-storage-pv-pvc',
        number: '12.3',
        title: 'Persistent Storage',
        commandPill: 'kubectl get pv,pvc -A',
        badge: 'Storage Abstraction',
        difficulty: 'Intermediate',
        description: 'Decouple storage provisioning from consumption: PersistentVolumes (PV), PersistentVolumeClaims (PVC), access modes (RWO, RWX, ROX), and reclaim policies.',
        subtopics: [
          'PersistentVolumes (PV)',
          'PersistentVolumeClaims (PVC)',
          'Reclaim policies (Retain, Delete)',
          'Access modes (RWO, RWX, ROX)',
        ],
        whatIsIt: 'The two-tier storage abstraction in Kubernetes that separates the physical/cloud provisioning of disks (PersistentVolumes) from the application consumption request (PersistentVolumeClaims).',
        inSimpleWords: 'A ticket system for hard drives. The cluster administrator or cloud provider owns a warehouse of hard drives (PersistentVolumes). When your application needs 50GB of storage, you submit a ticket (PersistentVolumeClaim). Kubernetes finds a matching drive, plugs it in, and locks it to your app.',
        realWorldAnalogy: {
          metaphor: 'Ordering a Specific Size Coffee Cup',
          explanation: 'You walk up to the coffee shop barista and order a "Large Cold Brew" (PVC). You don\'t care which specific 20oz ceramic mug the barista pulls off the shelf (PV), as long as it holds 20oz and doesn\'t leak.',
        },
        explanation: 'Managing storage requires separating administrative infrastructure from developer consumption: (1) `PersistentVolume (PV)`: A piece of physical or cloud storage (AWS EBS, GCP Persistent Disk, Ceph, NFS) provisioned by an administrator or dynamically created by a StorageClass; (2) `PersistentVolumeClaim (PVC)`: A request for storage by a developer specifying size (`100Gi`) and `accessModes`. Kube-controller-manager binds PVCs to matching PVs (1:1 relationship); (3) `Access Modes`: `ReadWriteOnce (RWO)`: Mounted read-write by a single node; `ReadWriteMany (RWX)`: Mounted read-write by many nodes simultaneously (NFS, EFS); `ReadOnlyMany (ROX)`: Mounted read-only by many nodes; (4) `Reclaim Policy`: What happens to the PV when the PVC is deleted: `Retain` (manual admin cleanup) or `Delete` (erases cloud volume).',
        whenToUse: [
          'Production relational databases (PostgreSQL, MySQL) requiring dedicated cloud block volumes (RWO)',
          'Shared content repositories or asset uploads accessible by 20 web pods simultaneously (RWX with NFS/EFS)',
          'Machine learning datasets mounted read-only across multiple GPU worker nodes (ROX)',
        ],
        whenNotToUse: [
          'Attempting to attach a `ReadWriteOnce` volume to pods running on two different worker nodes simultaneously (the second pod will fail to start with `Multi-Attach error for volume`)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'PVC Declaration', description: 'Developer submits PVC requesting `50Gi` with `accessModes: [ReadWriteOnce]`.' },
          { step: 2, title: 'Binding Phase', description: 'PersistentVolume controller matches PVC with an available PV and transitions status to Bound.' },
          { step: 3, title: 'Attachment & Node Mount', description: 'Attach/Detach controller instructs cloud provider to attach disk to worker node; kubelet formats and mounts it.' },
          { step: 4, title: 'Reclaim Execution', description: 'When PVC is deleted, reclaim policy executes: Retain preserves data; Delete destroys cloud disk.' },
        ],
        keyMechanisms: [
          { title: 'The 1-to-1 Binding Rule', detail: 'A PersistentVolume can only be bound to exactly one PersistentVolumeClaim at a time.' },
          { title: 'Access Modes (RWO, RWX, ROX)', detail: 'Defines how many nodes can attach the volume simultaneously; cloud block disks (EBS) are strictly RWO.' },
          { title: 'Reclaim Policies (Retain vs Delete)', detail: 'Retain preserves the underlying disk upon PVC deletion to protect critical enterprise data.' },
        ],
        productionTips: [
          'Always use `reclaimPolicy: Retain` on production database storage classes to prevent accidental deletion of multi-terabyte customer databases.',
          'Understand that `ReadWriteOnce` means "One NODE at a time", NOT "One POD at a time" (multiple pods on the SAME node can share an RWO disk).',
        ],
        yamlSnippet: `apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 50Gi
---
apiVersion: v1
kind: Pod
metadata:
  name: postgres-db
spec:
  containers:
  - name: postgres
    image: postgres:16-alpine
    volumeMounts:
    - name: data
      mountPath: /var/lib/postgresql/data
  volumes:
  - name: data
    persistentVolumeClaim:
      claimName: postgres-pvc`,
        kubectlCommands: [
          'kubectl get pv',
          'kubectl get pvc -A',
          'kubectl describe pvc postgres-pvc',
        ],
        visualizerFocus: 'PersistentVolumeClaim binding 1-to-1 with PersistentVolume and mounting into database pod',
        practiceChallenge: {
          instructions: 'Inspect all PersistentVolumes and PersistentVolumeClaims currently active in the cluster.',
          goalCommand: 'kubectl get pv,pvc -A',
          hints: ['Run kubectl get pv,pvc -A', 'Notice STATUS (Bound, Available) and CAPACITY'],
        },
      },
      {
        id: 'c-csi-drivers-storage',
        number: '12.4',
        title: 'CSI Drivers',
        commandPill: 'kubectl get storageclasses',
        badge: 'CSI Architecture',
        difficulty: 'Advanced',
        description: 'Dynamic cloud storage provisioning: Container Storage Interface (CSI), StorageClasses, provisioners, reclaim policies, and cloud block storage drivers (EBS, PD, AzureDisk).',
        subtopics: [
          'Container Storage Interface (CSI)',
          'StorageClasses',
          'Dynamic provisioning',
          'Cloud block storage (EBS, PD, AzureDisk)',
        ],
        whatIsIt: 'The open standard specification (Container Storage Interface / CSI) that allows third-party storage vendors and cloud providers to build out-of-tree plugins that dynamically provision, attach, format, and mount persistent block and file storage volumes in Kubernetes.',
        inSimpleWords: 'An on-demand automated vending machine for hard drives. In the old days, an admin had to manually create an AWS EBS volume and write its ID in YAML. With CSI and StorageClasses, the moment your app asks for 100GB, the cloud creates the drive and plugs it in automatically in seconds.',
        realWorldAnalogy: {
          metaphor: 'An Automated Car Rental Kiosk',
          explanation: 'Instead of calling a human car rental agent who manually drives a car out of the garage, you walk up to an automated kiosk (StorageClass), swipe your card (PVC), and a robotic elevator drops the exact car you requested into your parking stall.',
        },
        explanation: 'Before CSI, storage driver code was compiled directly inside the core Kubernetes codebase ("in-tree"). Any bug in an AWS or Ceph driver could crash the entire Kubernetes API server. CSI moved storage drivers completely "out-of-tree" into containerized plugins running as DaemonSets and Deployments. A `StorageClass` defines a provisioner (e.g. `ebs.csi.aws.com`), parameters (disk type: `gp3`, IOPS: `3000`), and `volumeBindingMode`. When a PVC references a StorageClass, the external-provisioner sidecar detects the PVC, calls the cloud API to create a physical cloud volume, and creates a matching PV automatically ("Dynamic Provisioning").',
        whenToUse: [
          'Dynamic, automated storage provisioning in cloud environments (AWS EBS, GCP Persistent Disk, Azure Managed Disks)',
          'High-performance distributed file storage (Amazon EFS CSI, Ceph-RBD, Portworx, Longhorn)',
          'Automating volume resizing and volume snapshotting using standard Kubernetes APIs',
        ],
        whenNotToUse: [
          'Hardcoding static PV manifests in cloud environments that have dynamic StorageClasses available',
        ],
        lifecycleSteps: [
          { step: 1, title: 'PVC with StorageClass', description: 'Developer submits PVC with `storageClassName: fast-gp3`.' },
          { step: 2, title: 'Dynamic Provisioning Trigger', description: 'CSI external-provisioner detects unbound PVC and invokes CSI `CreateVolume` gRPC call.' },
          { step: 3, title: 'Cloud Disk Creation', description: 'Cloud API creates 50GB gp3 disk; provisioner creates matching PV object in cluster.' },
          { step: 4, title: 'Node Stage & Mount', description: 'Node CSI driver executes `NodeStageVolume` (formatting ext4) and `NodePublishVolume` (bind mount).' },
        ],
        keyMechanisms: [
          { title: 'The StorageClass Object', detail: 'Defines provisioner plugin, parameters (disk type, throughput), and reclaimPolicy.' },
          { title: 'volumeBindingMode: WaitForFirstConsumer', detail: 'Delays cloud disk provisioning until the pod is scheduled to a node, ensuring disk and pod inhabit the same Availability Zone.' },
          { title: 'CSI Sidecar Architecture', detail: 'external-provisioner, external-attacher, external-resizer, node-driver-registrar.' },
        ],
        productionTips: [
          'Always configure `volumeBindingMode: WaitForFirstConsumer` on your StorageClasses! This prevents creating an AWS EBS volume in `us-east-1a` when the pod is scheduled to a node in `us-east-1b`.',
          'Enable `allowVolumeExpansion: true` on StorageClasses so you can increase disk size simply by editing the PVC storage request without downtime.',
        ],
        yamlSnippet: `apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ebs-gp3
provisioner: ebs.csi.aws.com
volumeBindingMode: WaitForFirstConsumer
allowVolumeExpansion: true
reclaimPolicy: Retain
parameters:
  type: gp3
  iops: "3000"
  throughput: "125"`,
        kubectlCommands: [
          'kubectl get storageclasses',
          'kubectl describe storageclass',
          'kubectl get csidrivers',
        ],
        visualizerFocus: 'CSI Driver dynamically provisioning cloud storage from StorageClass definitions',
        practiceChallenge: {
          instructions: 'List the StorageClasses configured in your cluster using kubectl get storageclasses.',
          goalCommand: 'kubectl get storageclasses',
          hints: ['Run kubectl get storageclasses or kubectl get sc', 'Check PROVISIONER and VOLUME-BINDING-MODE'],
        },
      },
      {
        id: 'c-stateful-applications-storage',
        number: '12.5',
        title: 'Stateful Applications',
        commandPill: 'kubectl get statefulsets,pvc',
        badge: 'Data Resilience',
        difficulty: 'Advanced',
        description: 'Manage production stateful systems: VolumeClaimTemplates in StatefulSets, online volume expansion, CSI VolumeSnapshots, and disaster recovery replication.',
        subtopics: [
          'VolumeClaimTemplates in StatefulSets',
          'Volume expansion',
          'Snapshotting & backups',
          'Data resilience',
        ],
        whatIsIt: 'The end-to-end architectural engineering required to run mission-critical stateful systems (PostgreSQL, Kafka, Elasticsearch, Redis) on Kubernetes, combining StatefulSets, VolumeClaimTemplates, online volume expansion, and CSI VolumeSnapshots.',
        inSimpleWords: 'How the pros run real databases on Kubernetes without losing customer data. Every database replica gets its own dedicated disk that stays permanently glued to its identity, grows larger on the fly without restarts, and takes instant backup snapshots every night.',
        realWorldAnalogy: {
          metaphor: 'A Bank Safety Deposit Vault System',
          explanation: 'Each customer has an assigned numbered safety deposit box (db-0, db-1). If the bank relocates or remodels a teller station, the safety deposit box is transferred securely to the new vault and locked with the exact same customer key.',
        },
        explanation: 'Running stateful workloads in Kubernetes requires mastering 4 operational primitives: (1) `VolumeClaimTemplates`: Generates dedicated, predictably named PVCs (`data-db-0`, `data-db-1`) that persist indefinitely even when pods are deleted or nodes fail; (2) `Dynamic Volume Expansion`: Increasing disk size on the fly: simply edit the PVC (`storage: 100Gi` -> `200Gi`), and the CSI `external-resizer` expands the cloud volume and resizes the ext4/xfs filesystem without unmounting; (3) `CSI VolumeSnapshots`: Declarative API objects (`VolumeSnapshot`) that instruct the storage backend to take instantaneous point-in-time copy-on-write storage snapshots; (4) `Ordered Pod Rescheduling`: Re-attaching existing storage to the same ordinal during node failure.',
        whenToUse: [
          'Running enterprise stateful clusters (PostgreSQL primary/replica, Kafka brokers, Elasticsearch nodes)',
          'Executing online storage expansions when database disks approach 85% capacity',
          'Automating hourly zero-impact database backups using CSI VolumeSnapshots and Velero',
        ],
        whenNotToUse: [
          'Relying on manual VolumeClaim deletion during database upgrades (PVCs must be preserved to prevent permanent data loss)',
          'Attempting to shrink a PVC storage size (Linux filesystems and cloud volume APIs do NOT support online shrinking)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'StatefulSet Creation', description: 'StatefulSet controller creates `db-0` and triggers dynamic provisioning of PVC `data-db-0`.' },
          { step: 2, title: 'Disk Expansion Request', description: 'DBA edits PVC `storage: 100Gi`; CSI external-resizer expands cloud disk and resizes filesystem live.' },
          { step: 3, title: 'Point-in-Time Snapshot', description: 'CronJob creates `VolumeSnapshot`; CSI driver triggers instant cloud snapshot for disaster recovery.' },
          { step: 4, title: 'Disaster Restoration', description: 'DBA creates new PVC specifying `dataSource: VolumeSnapshot` to restore an exact replica in seconds.' },
        ],
        keyMechanisms: [
          { title: 'VolumeClaimTemplates Ordinal Binding', detail: 'Guarantees that `db-0` always reattaches `data-db-0`, preventing database split-brain corruption.' },
          { title: 'CSI Volume Expansion (allowVolumeExpansion)', detail: 'Allows live resizing of PVC storage requests without pod restarts.' },
          { title: 'VolumeSnapshot & VolumeSnapshotClass', detail: 'CRD standard enabling cloud-native point-in-time storage backups and clone provisioning.' },
        ],
        productionTips: [
          'Set up Prometheus alerts for PVC disk utilization; expand PVC storage automatically or alert on-call at 80% full before database crashes.',
          'Always test your disaster recovery procedure: restore a PVC from a `VolumeSnapshot` in staging to verify backup data integrity.',
          'Never attempt to shrink a PVC; cloud block storage drivers do not support volume shrinking.',
        ],
        yamlSnippet: `apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: db-backup-snapshot
spec:
  volumeSnapshotClassName: csi-aws-vsc
  source:
    persistentVolumeClaimName: data-db-0`,
        kubectlCommands: [
          'kubectl get statefulsets,pvc',
          'kubectl get volumesnapshots -A',
          'kubectl describe pvc data-db-0',
        ],
        visualizerFocus: 'StatefulSet managing dedicated persistent disks and triggering volume snapshots',
        practiceChallenge: {
          instructions: 'Inspect all StatefulSets and bound PVCs across the cluster.',
          goalCommand: 'kubectl get statefulsets,pvc',
          hints: ['Run kubectl get statefulsets,pvc', 'Notice the 1-to-1 correspondence between pods and claims'],
        },
      },
    ],
  },
];
