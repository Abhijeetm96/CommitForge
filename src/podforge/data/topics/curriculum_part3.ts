import type { KubeChapter } from './types';

export const PART_3_CHAPTERS: KubeChapter[] = [
  // =========================================================================
  // CHAPTER 7: Resource Management
  // =========================================================================
  {
    id: 'ch07-resources',
    number: 7,
    title: 'Resource Management',
    category: 'Resource Governance',
    concepts: [
      {
        id: 'c-cpu-and-memory',
        number: '7.1',
        title: 'CPU & Memory',
        commandPill: 'kubectl describe nodes | grep -A 8 "Allocatable:"',
        badge: 'Compute Units',
        difficulty: 'Beginner',
        description: 'Master how Kubernetes measures compute: CPU millicores (m), binary memory units (Mi, Gi), compressible vs incompressible resources, and Linux cgroup accounting.',
        subtopics: [
          'CPU millicores',
          'Memory bytes and mebibytes',
          'cgroups resource accounting',
          'Compressible vs incompressible',
        ],
        whatIsIt: 'The mathematical units and kernel virtualization primitives used by Kubernetes to quantify, schedule, and enforce CPU and Memory consumption across containers and nodes.',
        inSimpleWords: 'How Kubernetes measures brainpower (CPU) and desk space (Memory). CPU is measured in slices of one core (millicores: 1000m = 1 CPU core). Memory is measured in megabytes and gigabytes (MiB and GiB).',
        realWorldAnalogy: {
          metaphor: 'Water Flow vs Storage Lockers',
          explanation: 'CPU is like running tap water (a compressible flow): if another faucet opens, your water flow slows down, but you do not drown. Memory is like a physical storage locker (incompressible space): if you try to shove 10 boxes into a 5-box locker, the door breaks and the manager throws you out (OOMKill).',
        },
        explanation: 'Kubernetes measures resources precisely: (1) `CPU`: Measured in millicores (`1000m` = 1 physical CPU core or 1 virtual vCPU). `500m` is half a CPU core. CPU is a "compressible" resource: if containers request more CPU than available, the Linux Completely Fair Scheduler (CFS) throttles execution time without terminating processes; (2) `Memory`: Measured in bytes using standard power-of-two suffix notations (`128Mi` = 128 mebibytes, `2Gi` = 2 gibibytes). Memory is an "incompressible" resource: if a container consumes more memory than its limit, the Linux kernel Out-Of-Memory (OOM) killer instantly sends `SIGKILL` (exit code 137).',
        whenToUse: [
          'Right-sizing containers to maximize worker node compute density and reduce cloud billing',
          'Understanding node `Capacity` vs `Allocatable` compute during capacity planning',
          'Diagnosing mysterious process restarts caused by memory exhaustion',
        ],
        whenNotToUse: [
          'Confusing decimal Megabytes (`1M` = 1,000,000 bytes) with binary Mebibytes (`1Mi` = 1,048,576 bytes)',
          'Setting fractional CPU units without \'m\' (e.g. `cpu: 0.5` is valid, but `cpu: "500m"` is preferred for clarity)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Node Capacity Discovery', description: 'Kubelet probes host hardware cores and RAM, reserving OS system overhead to calculate `Allocatable`.' },
          { step: 2, title: 'cgroup Translation', description: 'When a container starts, kubelet converts CPU millicores to `cpu.cfs_quota_us` and memory to `memory.max`.' },
          { step: 3, title: 'cgroup CFS Enforcement', description: 'Linux kernel throttles container CPU cycles once its quota is consumed within the 100ms period.' },
          { step: 4, title: 'OOM Killer Trigger', description: 'If memory exceeds `memory.max`, kernel triggers OOM killer targeting the process with highest `oom_score`.' },
        ],
        keyMechanisms: [
          { title: 'The Millicore Unit (1 vCPU = 1000m)', detail: 'Allows micro-allocation of compute down to 1 millicore (0.001 of a CPU core).' },
          { title: 'Binary SI Units (Ki, Mi, Gi)', detail: 'Kubernetes uses IEC standard 1024-based binary units to align with operating system memory pages.' },
          { title: 'Compressible vs Incompressible', detail: 'CPU starves with latency throttling; memory starves with immediate process death.' },
        ],
        productionTips: [
          'Always use binary units `Mi` and `Gi` rather than `M` or `G` to avoid subtle 5% memory allocation discrepancies.',
          'Monitor CPU throttling metrics in Prometheus (`container_cpu_cfs_throttled_periods_total`) to detect degraded microservice response times.',
        ],
        yamlSnippet: `apiVersion: v1
kind: Pod
metadata:
  name: resource-demo
spec:
  containers:
  - name: worker
    image: python:3.11-slim
    resources:
      requests:
        cpu: "250m"      # 1/4 of a CPU core
        memory: "256Mi"  # 256 Mebibytes
      limits:
        cpu: "1000m"     # 1 full CPU core max
        memory: "512Mi"  # Hard ceiling (OOMKill if exceeded)`,
        kubectlCommands: [
          'kubectl describe nodes',
          'kubectl top nodes',
          'kubectl top pods',
        ],
        visualizerFocus: 'CPU millicores and memory allocations compared to node allocatable limits',
        practiceChallenge: {
          instructions: 'Inspect node allocatable compute capacity using kubectl describe nodes.',
          goalCommand: 'kubectl describe nodes',
          hints: ['Run kubectl describe nodes', 'Search for the "Allocatable:" section in the output'],
        },
      },
      {
        id: 'c-resource-requests',
        number: '7.2',
        title: 'Resource Requests',
        commandPill: 'kubectl explain pod.spec.containers.resources.requests',
        badge: 'Scheduler Guarantees',
        difficulty: 'Beginner',
        description: 'How the kube-scheduler makes placement decisions: resource requests, guaranteed baseline compute, and preventing node overcrowding.',
        subtopics: [
          'What they mean',
          'Why Kubernetes needs them',
          'Kube-scheduler placement',
          'Guaranteed compute',
        ],
        whatIsIt: 'The minimum amount of compute resources (CPU and Memory) that a container is guaranteed to receive. The kube-scheduler uses the sum of all pod container requests to determine which worker node has sufficient allocatable capacity to place the pod.',
        inSimpleWords: 'A dinner reservation. You tell the restaurant "I have a party of 4 coming at 7 PM" (request). Even if all 4 people haven\'t arrived yet, the restaurant reserves the table and will not seat anyone else in those 4 chairs.',
        realWorldAnalogy: {
          metaphor: 'A Hotel Room Booking Reservation',
          explanation: 'When you book a king-size hotel room, the hotel cannot sell that room to anyone else, even if you are currently out sightseeing and not using the bed. The capacity is reserved exclusively for you.',
        },
        explanation: 'Resource requests dictate scheduling, NOT actual runtime usage. When a Pod is created, the scheduler sums the requests of all containers inside that pod. It filters through all worker nodes, eliminating any node where `current_node_requests + new_pod_requests > node_allocatable`. If no node has enough unreserved capacity, the Pod remains in `Pending` phase with `0/N nodes available: Insufficient cpu`. Once placed, the Linux kernel guarantees that the container will always have access to its requested CPU shares, even under severe cluster contention.',
        whenToUse: [
          'Every single production container without exception (containers without requests lead to catastrophic cluster oversubscription)',
          'Tuning Horizontal Pod Autoscaling (HPA targets are calculated as a percentage of your requested CPU)',
        ],
        whenNotToUse: [
          'Setting absurdly oversized requests (e.g. requesting 8 CPUs for an app that uses 50m), which starves the cluster and wastes thousands of cloud dollars on empty nodes',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Pod Submission', description: 'Pod declared with `resources.requests.cpu: 500m, memory: 1Gi`.' },
          { step: 2, title: 'Scheduler Node Filtering', description: 'Kube-scheduler inspects allocatable unreserved capacity across all nodes.' },
          { step: 3, title: 'Node Binding', description: 'Scheduler binds Pod to chosen node and subtracts 500m/1Gi from node available scheduling budget.' },
          { step: 4, title: 'cgroup Shares Guarantee', description: 'Kubelet converts requested CPU into Linux `cpu.weight` (cgroups v2) shares.' },
        ],
        keyMechanisms: [
          { title: 'Scheduler Reservation Accounting', detail: 'The scheduler evaluates requests against allocated reservations, completely ignoring current live CPU utilization.' },
          { title: 'cgroup CPU Shares', detail: 'In times of CPU contention, processes receive proportional CPU time matching their requested shares ratio.' },
          { title: 'The Pending Phase Trap', detail: 'If total requests exceed allocatable capacity on every node, pods stay Pending until new nodes are added.' },
        ],
        productionTips: [
          'Golden Rule: Base your CPU and memory requests on the 85th to 95th percentile of actual historical usage measured in Prometheus.',
          'Never leave requests blank; use a `LimitRange` in every namespace to automatically apply default requests to containers that omit them.',
        ],
        yamlSnippet: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: billing-worker
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: worker
        image: worker:v1.2
        resources:
          requests:
            cpu: "500m"
            memory: "512Mi"`,
        kubectlCommands: [
          'kubectl describe nodes | grep -A 8 "Allocated resources:"',
          'kubectl explain pod.spec.containers.resources.requests',
        ],
        visualizerFocus: 'Kube-scheduler matching container resource requests against node allocatable capacity',
        practiceChallenge: {
          instructions: 'Inspect the field documentation for container resource requests using kubectl explain.',
          goalCommand: 'kubectl explain pod.spec.containers.resources.requests',
          hints: ['Run kubectl explain pod.spec.containers.resources.requests', 'Notice cpu and memory fields'],
        },
      },
      {
        id: 'c-resource-limits',
        number: '7.3',
        title: 'Resource Limits',
        commandPill: 'kubectl explain pod.spec.containers.resources.limits',
        badge: 'Hard Ceilings',
        difficulty: 'Beginner',
        description: 'Enforce hard resource ceilings: preventing noisy neighbors, CFS CPU throttling, memory limit breaches, and the dreaded OOMKilled (exit code 137).',
        subtopics: [
          'What they mean',
          'What happens when limits are exceeded',
          'CPU throttling (CFS)',
          'OOMKilled exit code 137',
        ],
        whatIsIt: 'The maximum hard ceiling of compute resources (CPU and Memory) that a container is permitted to consume. Enforced at the Linux kernel level via cgroups, limits prevent a single runaway container from starving adjacent workloads on the same node.',
        inSimpleWords: 'A hard spending limit on your credit card. You can spend up to your limit, but the moment you try to spend one penny more, the machine declines your card (CPU throttles your speed, or Memory shuts down your app).',
        realWorldAnalogy: {
          metaphor: 'An All-You-Can-Eat Buffet Plate Size Limit',
          explanation: 'You are allowed to eat as much food as fits on a standard 10-inch plate (Limit). If you try to stack a mountain of food that spills onto the floor, the security guard escorts you out of the restaurant (OOMKilled).',
        },
        explanation: 'Resource limits prevent the "noisy neighbor" problem where a memory leak or runaway infinite loop in one container exhausts all host resources and crashes other critical services. What happens when limits are exceeded differs fundamentally by resource type: (1) `CPU Limit Exceeded`: When a container consumes its allotted CPU cycles within a 100ms CFS period, the kernel throttles the container process, temporarily pausing execution until the next period. The process does NOT crash, but response latency spikes; (2) `Memory Limit Exceeded`: Physical RAM cannot be compressed. If container memory exceeds `limits.memory`, the Linux kernel instantly invokes the Out-Of-Memory killer, killing the container with status `OOMKilled` and exit code `137` (`128 + SIGKILL 9`).',
        whenToUse: [
          'Protecting worker nodes from catastrophic memory exhaustion caused by rogue memory leaks',
          'Enforcing multi-tenant boundaries so one team\'s batch job cannot starve another team\'s web API',
          'Establishing Quality of Service (QoS) classes: setting requests == limits creates a `Guaranteed` pod',
        ],
        whenNotToUse: [
          'Setting aggressive, tight CPU limits on latency-sensitive Java, Node.js, or Go microservices (causes severe latency spikes due to CFS quota throttling)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Limit Configuration', description: 'Container manifest defines `limits.cpu: 1000m, limits.memory: 1Gi`.' },
          { step: 2, title: 'Kernel cgroup Binding', description: 'Kubelet writes `1073741824` bytes to `/sys/fs/cgroup/memory.max`.' },
          { step: 3, title: 'Memory Leak Spike', description: 'Container application leaks memory, allocating 1074000000 bytes.' },
          { step: 4, title: 'OOMKill & Exit Code 137', description: 'Kernel terminates process; kubelet records `OOMKilled: true` and increments restart counter.' },
        ],
        keyMechanisms: [
          { title: 'The Linux CFS Bandwidth Controller', detail: 'Enforces CPU limits by assigning quota/period timeslices (default period 100ms).' },
          { title: 'Exit Code 137 (OOMKill)', detail: 'Exit code 137 means the process received SIGKILL (128 + signal 9) from the kernel OOM killer.' },
          { title: 'Quality of Service (QoS) Classes', detail: 'Kubernetes assigns QoS automatically: `Guaranteed` (req == limit), `Burstable` (req < limit), `BestEffort` (no req/limit).' },
        ],
        productionTips: [
          'If a pod shows `CrashLoopBackOff`, run `kubectl describe pod <name>` and look for `Last State: Terminated` with `Reason: OOMKilled`.',
          'Consider removing CPU limits entirely while keeping memory limits strict (a widely accepted SRE best practice to eliminate latency throttling).',
          'Pods with `Guaranteed` QoS class are the very last to be evicted during node resource pressure.',
        ],
        yamlSnippet: `apiVersion: v1
kind: Pod
metadata:
  name: strict-limits
spec:
  containers:
  - name: api
    image: api:v2
    resources:
      requests:
        cpu: "500m"
        memory: "1Gi"
      limits:
        cpu: "2000m"
        memory: "2Gi" # Hard kill if 2Gi exceeded`,
        kubectlCommands: [
          'kubectl describe pod <name> | grep -E "(Requests|Limits|OOMKilled)"',
          'kubectl get pods -o custom-columns=NAME:.metadata.name,QOS:.status.qosClass',
        ],
        visualizerFocus: 'CPU throttling and memory limit breach triggering kernel OOMKill',
        practiceChallenge: {
          instructions: 'Inspect the Quality of Service (QoS) classes assigned to pods in your cluster.',
          goalCommand: 'kubectl get pods -o custom-columns=NAME:.metadata.name,QOS:.status.qosClass',
          hints: ['Run the command with custom-columns', 'Notice Guaranteed, Burstable, or BestEffort'],
        },
      },
      {
        id: 'c-namespace-quotas',
        number: '7.4',
        title: 'Namespace Quotas',
        commandPill: 'kubectl get resourcequotas,limitranges -A',
        badge: 'Governance',
        difficulty: 'Intermediate',
        description: 'Govern multi-tenant resource consumption: ResourceQuotas (namespace compute budgets), LimitRanges (default requests/limits), and object count limits.',
        subtopics: [
          'ResourceQuota',
          'LimitRange defaults',
          'Multi-tenant budget isolation',
          'Compute ceilings',
        ],
        whatIsIt: 'The cluster-level governance and cost-control mechanisms that restrict the total aggregate compute consumption (CPU, RAM, PVC storage) and object counts (Pods, Services, Secrets) permitted within a single Namespace.',
        inSimpleWords: 'A monthly spending allowance for each team. The marketing team gets 10 CPU cores and 20GB of RAM in their namespace; the data science team gets 40 CPU cores. If a team tries to deploy a 41st core, Kubernetes blocks them.',
        realWorldAnalogy: {
          metaphor: 'A Departmental Corporate Credit Card Budget',
          explanation: 'The Finance Director assigns a $10,000 monthly budget to the Engineering department card (ResourceQuota). If an engineer tries to purchase a $12,000 server, the transaction is rejected at the cashier counter (Admission Webhook).',
        },
        explanation: 'In multi-tenant clusters sharing physical hardware between different teams, projects, or environments (dev/qa/prod), uncontrolled deployments can consume all cluster resources and starve other teams. Kubernetes provides two complementary governance primitives: (1) `ResourceQuota`: Sets hard aggregate ceilings on a namespace (e.g. `requests.cpu: "20"`, `requests.memory: "40Gi"`, `pods: "50"`). If a new pod would cause the namespace to exceed these totals, the API server rejects pod creation with HTTP 403 Forbidden; (2) `LimitRange`: Enforces minimum/maximum sizes for individual pods and automatically injects default requests and limits into containers that omit them.',
        whenToUse: [
          'Enforcing fair-share resource allocation across multiple teams sharing a common cluster',
          'Preventing a junior developer or rogue CI script from accidentally spawning 10,000 pods and crashing the cluster',
          'Limiting maximum PVC persistent disk storage allocation per namespace to control cloud storage bills',
        ],
        whenNotToUse: [
          'Applying a ResourceQuota to a namespace without also configuring a `LimitRange` (if a quota exists, ANY container created without explicit requests/limits is instantly rejected)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Quota Definition', description: 'Admin applies ResourceQuota to namespace setting 20 CPU and 50Gi RAM limits.' },
          { step: 2, title: 'Admission Verification', description: 'When a new Pod is submitted, the ResourceQuota admission controller calculates new namespace totals.' },
          { step: 3, title: 'Threshold Validation', description: 'If total requests <= quota limit, the Pod is admitted; if exceeded, request is rejected.' },
          { step: 4, title: 'Usage Tracking', description: 'ResourceQuota `status` field continuously reflects current used vs hard limit values.' },
        ],
        keyMechanisms: [
          { title: 'The ResourceQuota Admission Controller', detail: 'Evaluates every create/update request synchronously at the API server gate before etcd write.' },
          { title: 'LimitRange Default Injection', detail: 'Mutating admission controller that injects predefined `default` and `defaultRequest` values into pods.' },
          { title: 'Object Count Quotas', detail: 'Restricts total counts of services (`count/services.loadbalancers`), secrets, PVCs, and jobs.' },
        ],
        productionTips: [
          'Always pair every `ResourceQuota` with a `LimitRange`; otherwise users who forget to write requests in their YAML cannot deploy anything.',
          'Run `kubectl describe quota -n <namespace>` to see exact real-time percentages of consumed vs allocated budget.',
          'Use scopes in ResourceQuotas (e.g. `scopeSelector: BestEffort`) to restrict low-priority batch jobs separately from production services.',
        ],
        yamlSnippet: `apiVersion: v1
kind: ResourceQuota
metadata:
  name: team-quota
  namespace: marketing
spec:
  hard:
    requests.cpu: "10"
    requests.memory: "20Gi"
    limits.cpu: "20"
    limits.memory: "40Gi"
    pods: "30"
    count/services.loadbalancers: "2"`,
        kubectlCommands: [
          'kubectl get resourcequotas -A',
          'kubectl describe resourcequota -n default',
          'kubectl get limitranges -A',
        ],
        visualizerFocus: 'Namespace boundary enforcing aggregate ResourceQuota ceilings',
        practiceChallenge: {
          instructions: 'Check if any ResourceQuotas or LimitRanges exist across all namespaces.',
          goalCommand: 'kubectl get resourcequotas,limitranges -A',
          hints: ['Run kubectl get resourcequotas,limitranges -A', 'Notice namespace budget allocations'],
        },
      },
      {
        id: 'c-monitoring-resource-usage',
        number: '7.5',
        title: 'Monitoring Resource Usage',
        commandPill: 'kubectl top pods -A',
        badge: 'Telemetry',
        difficulty: 'Intermediate',
        description: 'Observe real-time compute utilization: Metrics Server, cAdvisor kernel metrics, kubectl top CLI, and right-sizing workloads.',
        subtopics: [
          'kubectl top nodes/pods',
          'Metrics Server',
          'cAdvisor telemetry',
          'Right-sizing workloads',
        ],
        whatIsIt: 'The real-time telemetry and resource observability pipeline in Kubernetes, powered by the lightweight in-memory `Metrics Server` and node-level `cAdvisor` agents that expose live CPU and memory utilization via `metrics.k8s.io`.',
        inSimpleWords: 'The speedometer and gas gauge on your car dashboard. It tells you exactly how much CPU and memory your servers and containers are burning right now so you can spot bottlenecks and avoid overpaying for idle servers.',
        realWorldAnalogy: {
          metaphor: 'A Smart Home Electricity Monitor',
          explanation: 'A sensor clamped onto your home\'s main circuit breaker measures kilowatt-hours in real time. You can pull out your smartphone to see that the air conditioner is pulling 4,000 watts while the bedroom lamp is pulling only 10 watts.',
        },
        explanation: 'Kubernetes resource observability begins at the Linux kernel level. Embedded inside every `kubelet` binary is `cAdvisor` (Container Advisor), which continuously reads CPU cycles, memory usage, network packets, and disk I/O directly from `/sys/fs/cgroup`. The cluster-wide `Metrics Server` scrapes these summary endpoints from all kubelets every 60 seconds and serves them in memory via the aggregated API (`metrics.k8s.io`). This powers the `kubectl top nodes` and `kubectl top pods` commands and feeds real-time utilization data into the Horizontal Pod Autoscaler (HPA).',
        whenToUse: [
          'Checking instant cluster health during production traffic spikes or suspected resource exhaustion',
          'Auditing pods to identify "idle" workloads with oversized requests for cost optimization (right-sizing)',
          'Validating that Metrics Server is functioning correctly to support HPA autoscaling',
        ],
        whenNotToUse: [
          'Using Metrics Server for long-term historical trends, 30-day capacity planning, or alerting (Metrics Server stores only instant snapshots in RAM; use Prometheus for historical telemetry)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'cAdvisor Kernel Telemetry', description: 'cAdvisor extracts CPU nano-cores and memory working-set bytes from cgroup subsystems.' },
          { step: 2, title: 'Metrics Server Scrape', description: 'Metrics Server polls kubelet HTTPS endpoints (`/stats/summary`) on all nodes every 60s.' },
          { step: 3, title: 'API Aggregation', description: 'Metrics are exposed via `metrics.k8s.io/v1beta1` to the Kubernetes API server.' },
          { step: 4, title: 'kubectl top & HPA Query', description: 'Users run `kubectl top`, and HPA controllers query the API to calculate target replica counts.' },
        ],
        keyMechanisms: [
          { title: 'cAdvisor (Container Advisor)', detail: 'Daemon compiled directly into the kubelet; provides zero-configuration container resource metrics.' },
          { title: 'The metrics.k8s.io APIService', detail: 'Aggregated API endpoint proxying requests from kube-apiserver directly to the metrics-server pod.' },
          { title: 'Memory: RSS vs Working Set', detail: 'Kubernetes measures memory using `working_set` (memory that cannot be evicted), NOT total memory with buffer cache.' },
        ],
        productionTips: [
          'If `kubectl top` outputs "error: Metrics API not available", check if the `metrics-server` pod in `kube-system` is running and has `--kubelet-insecure-tls` configured if self-signed certs are used.',
          'Right-size your workloads: run `kubectl top pods` during peak traffic hours; if your app is requesting 2000m but using 150m, cut requests to save cloud costs.',
        ],
        yamlSnippet: `# Metrics Server High-Level Pipeline:
# Linux cgroups
#   │
#   ▼
# cAdvisor (embedded in Kubelet)
#   │ (HTTPS scrape every 60s)
#   ▼
# Metrics Server (in-memory cache)
#   │
#   ▼ metrics.k8s.io
# kubectl top / Horizontal Pod Autoscaler (HPA)`,
        kubectlCommands: [
          'kubectl top nodes',
          'kubectl top pods -A',
          'kubectl top pods --sort-by=cpu',
          'kubectl top pods --sort-by=memory',
        ],
        visualizerFocus: 'Live CPU and memory telemetry flowing from cAdvisor through Metrics Server',
        practiceChallenge: {
          instructions: 'Query real-time resource utilization across all active pods using kubectl top pods -A.',
          goalCommand: 'kubectl top pods -A',
          hints: ['Run kubectl top pods -A', 'Sort by compute using --sort-by=cpu or --sort-by=memory'],
        },
      },
    ],
  },

  // =========================================================================
  // CHAPTER 8: Security
  // =========================================================================
  {
    id: 'ch08-security',
    number: 8,
    title: 'Security',
    category: 'Security & Governance',
    concepts: [
      {
        id: 'c-k8s-security-fundamentals',
        number: '8.1',
        title: 'Kubernetes Security Fundamentals',
        commandPill: 'kubectl auth can-i --list',
        badge: 'Defense in Depth',
        difficulty: 'Beginner',
        description: 'Understand cloud-native security foundations: Defense in Depth, the 4C security model (Cloud, Cluster, Container, Code), and API authentication.',
        subtopics: [
          'Defense in depth',
          '4C model of cloud native security (Cloud, Cluster, Container, Code)',
          'API authentication',
          'TLS encryption',
        ],
        whatIsIt: 'The foundational security architecture of Kubernetes based on the principle of Defense-in-Depth, structured around the CNCF 4C Security Model: Cloud, Cluster, Container, and Code.',
        inSimpleWords: 'Security like a medieval fortress. You do not just build one front door; you have a castle moat (Cloud security), heavy outer walls (Cluster RBAC), guard towers (Container sandboxes), and personal armor for the soldiers (Application code security).',
        realWorldAnalogy: {
          metaphor: 'A High-Security Bank Vault System',
          explanation: 'The bank has street-level security cameras (Cloud), a bank lobby badge turnstile (Cluster authentication), heavy steel vault doors with dual keys (Container isolation), and serial numbers stamped on every dollar bill (Encrypted Code).',
        },
        explanation: 'Securing a Kubernetes cluster requires holistic security across 4 distinct layers: (1) `Cloud Layer`: Securing the underlying cloud VPC, IAM roles, security groups, and physical datacenters; (2) `Cluster Layer`: Securing the API server, mutual TLS (mTLS) certificates between components, RBAC authorization, and etcd encryption-at-rest; (3) `Container Layer`: Building minimal, rootless container images, vulnerability scanning, and signing artifacts; (4) `Code Layer`: Writing secure application code, sanitizing inputs, and enforcing TLS for external client traffic. If any outer layer is breached, inner layers continue to enforce containment.',
        whenToUse: [
          'Establishing enterprise compliance frameworks (SOC2, ISO 27001, HIPAA, PCI-DSS) on Kubernetes',
          'Designing threat models and security incident response runbooks for container platforms',
          'Auditing cluster access permissions and network ingress boundaries',
        ],
        whenNotToUse: [
          'Relying solely on in-cluster tools while leaving public cloud master security groups wide open to `0.0.0.0/0`',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Cloud VPC Hardening', description: 'Cluster master endpoints placed behind private VPC subnets with strict firewall security groups.' },
          { step: 2, title: 'API Authentication & TLS', description: 'All communication to kube-apiserver requires TLS 1.3 encryption and X.509/OIDC authentication.' },
          { step: 3, title: 'RBAC Authorization Gate', description: 'API server enforces least-privilege role bindings before permitting any resource mutations.' },
          { step: 4, title: 'Runtime Isolation Enforcement', description: 'Linux kernel security features (seccomp, AppArmor, cgroups) contain running processes.' },
        ],
        keyMechanisms: [
          { title: 'The 4C Security Model', detail: 'Cloud -> Cluster -> Container -> Code. Security at one layer cannot compensate for flaws in an outer layer.' },
          { title: 'Mutual TLS (mTLS)', detail: 'All internal control plane communication (kubelet to apiserver, apiserver to etcd) requires bi-directional X.509 certificates.' },
          { title: 'Least Privilege Principle', detail: 'Every user, service account, and container receives only the exact minimum permissions required to perform its function.' },
        ],
        productionTips: [
          'Run `kubectl auth can-i --list` to audit exactly what actions your current identity is authorized to perform.',
          'Never expose the kube-apiserver port 6443 directly to the public internet; always restrict access via VPN or cloud bastion hosts.',
        ],
        yamlSnippet: `# The 4C Security Model:
# [Cloud]     AWS IAM, VPC Firewalls, Disk Encryption
#   └── [Cluster]   RBAC, NetworkPolicies, etcd KMS, TLS
#         └── [Container] Distroless, Non-Root USER, Seccomp
#               └── [Code]      TLS 1.3, Input Validation, SAST/DAST`,
        kubectlCommands: [
          'kubectl auth can-i --list',
          'kubectl auth can-i create pods',
          'kubectl get clusterroles',
        ],
        visualizerFocus: 'The 4C security model defending the cluster from external and internal threats',
        practiceChallenge: {
          instructions: 'Audit your current user authorization permissions using kubectl auth can-i --list.',
          goalCommand: 'kubectl auth can-i --list',
          hints: ['Run kubectl auth can-i --list', 'Check the VERBS, RESOURCES, and API GROUPS columns'],
        },
      },
      {
        id: 'c-rbac-authorization',
        number: '8.2',
        title: 'RBAC',
        commandPill: 'kubectl auth can-i create pods',
        badge: 'Access Control',
        difficulty: 'Intermediate',
        description: 'Enforce least privilege with Role-Based Access Control: Users, ServiceAccounts, Roles, ClusterRoles, RoleBindings, and ClusterRoleBindings.',
        subtopics: [
          'Users',
          'Roles',
          'RoleBindings',
          'ClusterRoles',
          'Permissions',
        ],
        whatIsIt: 'The authorization framework in Kubernetes that regulates access to API resources based on the roles assigned to individual human users or automated machine ServiceAccounts.',
        inSimpleWords: 'The electronic keycard system for your cluster. Instead of giving everyone the master key, interns get keycards that only open the breakroom door (read-only pods in dev), while senior SREs get keycards that open the server room.',
        realWorldAnalogy: {
          metaphor: 'A Hospital Electronic Keycard Badge System',
          explanation: 'A Doctor badge opens patient exam rooms and medicine cabinets in their specific wing (RoleBinding). A Chief of Surgery badge opens surgical suites across the entire hospital system (ClusterRoleBinding). A Visitor badge only opens the front lobby.',
        },
        explanation: 'Every API request to Kubernetes passes through Authentication -> Authorization -> Admission Control. RBAC governs Authorization using four declarative objects: (1) `Role`: Defines a set of permissions (API groups, resources, verbs like `get`, `list`, `watch`, `create`, `delete`) scoped to a single Namespace; (2) `ClusterRole`: Defines cluster-wide permissions (e.g. accessing non-namespaced resources like Nodes or across all namespaces); (3) `RoleBinding`: Grants the permissions in a Role/ClusterRole to specific subjects (Users, Groups, or ServiceAccounts) within a Namespace; (4) `ClusterRoleBinding`: Grants permissions cluster-wide.',
        whenToUse: [
          'Implementing least-privilege security for human developers, CI/CD deployment pipelines, and operators',
          'Granting microservice pods access to query specific Kubernetes APIs (e.g. an ingress controller listing Services)',
          'Creating restricted read-only roles for junior engineers or automated auditing tools',
        ],
        whenNotToUse: [
          'Binding subjects to the built-in `cluster-admin` ClusterRole unless they are verified cluster infrastructure administrators',
          'Using wildcards (`verbs: ["*"]`, `resources: ["*"]`) in production Role manifests',
        ],
        lifecycleSteps: [
          { step: 1, title: 'API Request Reception', description: 'User or pod ServiceAccount sends HTTP request to `/api/v1/namespaces/default/pods`.' },
          { step: 2, title: 'Subject Identity Extraction', description: 'Kube-apiserver identifies caller identity (e.g. `system:serviceaccount:default:my-sa`).' },
          { step: 3, title: 'RBAC Graph Traversal', description: 'RBAC authorizer searches RoleBindings and ClusterRoleBindings matching the subject.' },
          { step: 4, title: 'Rule Evaluation', description: 'If any matching rule permits the requested verb on the resource, request is authorized; otherwise HTTP 403 Forbidden.' },
        ],
        keyMechanisms: [
          { title: 'Roles vs ClusterRoles', detail: 'Roles are strictly namespace-scoped; ClusterRoles apply cluster-wide and can govern nodes, namespaces, and PVs.' },
          { title: 'The kubectl auth can-i Command', detail: 'Indispensable CLI diagnostic tool to test if a user or ServiceAccount can perform an action (`kubectl auth can-i delete pods --as developer`).' },
          { title: 'Aggregation of ClusterRoles', detail: 'ClusterRoles can automatically aggregate child rules dynamically using label selectors.' },
        ],
        productionTips: [
          'CKA Exam Essential: Test permissions with `kubectl auth can-i <verb> <resource> -n <namespace> --as=<user>`.',
          'Never grant ServiceAccounts permissions to read Secrets across the entire cluster unless they are an identity vault operator.',
          'Regularly run audit tools like `rbac-lookup` to spot over-privileged service accounts.',
        ],
        yamlSnippet: `apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: development
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods-binding
  namespace: development
subjects:
- kind: ServiceAccount
  name: developer-sa
  namespace: development
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io`,
        kubectlCommands: [
          'kubectl auth can-i create pods',
          'kubectl auth can-i delete deployments --as dev-user',
          'kubectl get roles,rolebindings -A',
          'kubectl get clusterroles,clusterrolebindings',
        ],
        visualizerFocus: 'RBAC engine evaluating RoleBindings and ServiceAccount permissions',
        practiceChallenge: {
          instructions: 'Check if your active credentials have permission to create pods.',
          goalCommand: 'kubectl auth can-i create pods',
          hints: ['Run kubectl auth can-i create pods', 'Observe the yes or no output response'],
        },
      },
      {
        id: 'c-network-security-policies',
        number: '8.3',
        title: 'Network Security',
        commandPill: 'kubectl get networkpolicies -A',
        badge: 'Microsegmentation',
        difficulty: 'Advanced',
        description: 'Microsegment cluster traffic: NetworkPolicies, default-deny ingress/egress rules, pod label selectors, and namespace boundary isolation.',
        subtopics: [
          'NetworkPolicies',
          'Default deny ingress/egress',
          'Microsegmentation',
          'Namespace boundaries',
        ],
        whatIsIt: 'The native packet-filtering firewall specification in Kubernetes that controls L3/L4 IP and port traffic flow between Pods, Namespaces, and external CIDR blocks using label selectors.',
        inSimpleWords: 'A firewall for every individual container. By default in Kubernetes, all pods can talk to all other pods. A NetworkPolicy blocks all doors and only allows specific approved connections (e.g. only the Web app can talk to the Database on port 5432).',
        realWorldAnalogy: {
          metaphor: 'Office Security Doors with Keycard Badges',
          explanation: 'In an open office, anyone can walk into any room. A NetworkPolicy installs magnetic locks on every door: the Marketing team door only opens for Marketing employees, and the server room door only opens for SREs.',
        },
        explanation: 'By default, the Kubernetes network is completely open and flat: any pod in any namespace can send packets to any other pod. If an attacker compromises a frontend web container, they can probe and attack internal backend databases. `NetworkPolicies` enforce microsegmentation. When a NetworkPolicy selects a pod, that pod enters an "isolated" state: all traffic not explicitly whitelisted in `ingress` or `egress` blocks is dropped at the packet level. Important note: NetworkPolicies require a CNI plugin that supports policy enforcement (e.g. `Calico`, `Cilium`). Flannel alone does NOT enforce NetworkPolicies!',
        whenToUse: [
          'Isolating critical database pods so only authorized backend API pods can establish connections',
          'Implementing zero-trust architecture: establishing a "Default Deny All" baseline policy in every namespace',
          'Restricting egress traffic to prevent compromised pods from downloading malware from the internet or exfiltrating data',
        ],
        whenNotToUse: [
          'Clusters running Flannel CNI without an accompanying policy engine like Calico (NetworkPolicies will silently do nothing)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Policy Application', description: 'Admin applies NetworkPolicy selecting `app: db`.' },
          { step: 2, title: 'CNI Daemon Processing', description: 'Node CNI agent (Calico Felix / Cilium eBPF) translates policy into Linux eBPF maps or iptables chains.' },
          { step: 3, title: 'Packet Filter Evaluation', description: 'When packets arrive on the pod veth interface, CNI checks source IP against matching label sets.' },
          { step: 4, title: 'Drop or Permit', description: 'If source matches whitelist rule, packet is accepted; otherwise dropped silently with zero response.' },
        ],
        keyMechanisms: [
          { title: 'The Isolated State Trigger', detail: 'Pods are non-isolated (open) until selected by at least one NetworkPolicy, at which point all unlisted traffic is blocked.' },
          { title: 'Default-Deny Ingress/Egress Pattern', detail: 'Production best practice: apply a policy with empty `{}` ingress/egress to block all traffic, then explicitly whitelist needed routes.' },
          { title: 'Namespace & Pod Selector Pairing', detail: 'Policies can filter by `namespaceSelector` and `podSelector` simultaneously.' },
        ],
        productionTips: [
          'Always deploy a "default-deny-all" NetworkPolicy in every namespace to enforce a Zero-Trust security posture.',
          'Always verify that your CNI plugin actually supports NetworkPolicies (e.g. AWS VPC CNI requires the Amazon VPC CNI Network Policy Controller enabled).',
          'Use Cilium or Calico network visualization tools to audit dropped packet metrics in real time.',
        ],
        yamlSnippet: `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: secure-database-policy
  namespace: default
spec:
  podSelector:
    matchLabels:
      role: db
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          role: backend-api
    ports:
    - protocol: TCP
      port: 5432`,
        kubectlCommands: [
          'kubectl get networkpolicies -A',
          'kubectl describe networkpolicy secure-database-policy',
        ],
        visualizerFocus: 'NetworkPolicy firewall blocking unauthorized traffic and permitting whitelisted connections',
        practiceChallenge: {
          instructions: 'Check for any NetworkPolicies currently active across all namespaces.',
          goalCommand: 'kubectl get networkpolicies -A',
          hints: ['Run kubectl get networkpolicies -A or kubectl get netpol -A', 'Notice the POD-SELECTOR column'],
        },
      },
      {
        id: 'c-container-security-hardening',
        number: '8.4',
        title: 'Container Security',
        commandPill: 'kubectl explain pod.spec.securityContext',
        badge: 'Runtime Hardening',
        difficulty: 'Advanced',
        description: 'Harden container execution: runAsNonRoot, readOnlyRootFilesystem, dropping Linux capabilities (drop: ALL), seccomp profiles, and AppArmor.',
        subtopics: [
          'Rootless containers',
          'readOnlyRootFilesystem',
          'drop ALL capabilities',
          'seccomp & AppArmor',
        ],
        whatIsIt: 'The configuration of Linux security boundaries within the container runtime via `securityContext`: stripping root privileges, mounting read-only filesystems, dropping dangerous Linux kernel capabilities, and restricting system calls via seccomp.',
        inSimpleWords: 'Taking away all dangerous tools from a container before letting it run. You lock the front door, take away the root keys, make the hard drive read-only so hackers cannot install malware, and only allow the exact 2 actions the program needs to do its job.',
        realWorldAnalogy: {
          metaphor: 'A Prison Visitor Room Security Protocol',
          explanation: 'Visitors cannot bring cellphones, knives, or backpacks into the visiting room. They pass through metal detectors (seccomp), sit behind reinforced glass (cgroups), and talk through a supervised telephone (drop ALL capabilities).',
        },
        explanation: 'By default, Docker and early container runtimes launched containers as `root` (UID 0) with extensive Linux kernel capabilities. If an attacker discovers a remote code execution vulnerability in your web application, running as root allows them to escape the container, compromise the host kernel, and take over the entire physical server. `securityContext` hardens containers: (1) `runAsNonRoot: true`: Refuses to start the container if configured to run as UID 0; (2) `readOnlyRootFilesystem: true`: Prevents attackers from writing malicious binaries or modifying system libraries; (3) `capabilities.drop: ["ALL"]`: Drops all Linux root capabilities (like `CAP_SYS_ADMIN` and `CAP_NET_RAW`); (4) `seccompProfile`: Restricts which Linux system calls the process can invoke.',
        whenToUse: [
          'Every production container without exception to satisfy modern cybersecurity hardening standards',
          'Public-facing internet workloads exposed to arbitrary untrusted user inputs',
          'Preventing container breakout exploits (e.g. Dirty COW, runc CVE escapes)',
        ],
        whenNotToUse: [
          'Running `privileged: true` in user application pods (privileged disables all container isolation, giving the container raw root access to the entire host machine)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Manifest Security Validation', description: 'Pod specifies `runAsUser: 10001, readOnlyRootFilesystem: true, capabilities.drop: ["ALL"]`.' },
          { step: 2, title: 'Kubelet Security Validation', description: 'Kubelet validates UID compliance before initiating the container sandbox.' },
          { step: 3, title: 'Runtime Syscall Filtering', description: 'runc loads the `RuntimeDefault` seccomp profile into the Linux kernel.' },
          { step: 4, title: 'Restricted Execution', description: 'Process executes with zero extra capabilities; any attempt to write to `/usr` or `/bin` returns EROFS (Read-only file system).' },
        ],
        keyMechanisms: [
          { title: 'runAsNonRoot: true', detail: 'Guarantees the process runs as an unprivileged UID (e.g. 10001), preventing host file overwrites.' },
          { title: 'readOnlyRootFilesystem: true', detail: 'Makes the entire container root filesystem immutable; apps write temporary files only to explicit emptyDir mounts.' },
          { title: 'Linux Capabilities (drop ALL)', detail: 'Linux breaks superuser power into ~40 discrete capabilities; dropping ALL eliminates 99% of privilege escalation vectors.' },
        ],
        productionTips: [
          'Always configure `readOnlyRootFilesystem: true` and mount an `emptyDir` volume at `/tmp` for applications that need scratch space.',
          'Always set `allowPrivilegeEscalation: false` to prevent child processes from gaining more privileges than their parent process.',
          'Set `seccompProfile: { type: RuntimeDefault }` on all pods to block dangerous kernel syscalls by default.',
        ],
        yamlSnippet: `apiVersion: v1
kind: Pod
metadata:
  name: hardened-app
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 10001
    runAsGroup: 10001
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: web
    image: my-app:v1.0
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
        - ALL
    volumeMounts:
    - name: tmp-dir
      mountPath: /tmp
  volumes:
  - name: tmp-dir
    emptyDir: {}`,
        kubectlCommands: [
          'kubectl explain pod.spec.securityContext',
          'kubectl explain pod.spec.containers.securityContext',
        ],
        visualizerFocus: 'SecurityContext applying read-only filesystem, non-root UID, and dropped capabilities',
        practiceChallenge: {
          instructions: 'Inspect the securityContext schema documentation using kubectl explain.',
          goalCommand: 'kubectl explain pod.spec.securityContext',
          hints: ['Run kubectl explain pod.spec.securityContext', 'Notice runAsNonRoot, runAsUser, and seccompProfile'],
        },
      },
      {
        id: 'c-pod-security-standards',
        number: '8.5',
        title: 'Pod Security',
        commandPill: 'kubectl get validatingwebhookconfigurations',
        badge: 'Cluster Governance',
        difficulty: 'Advanced',
        description: 'Cluster-wide pod enforcement: Pod Security Standards (PSS) with Privileged, Baseline, and Restricted profiles, enforced via Pod Security Admission (PSA).',
        subtopics: [
          'Pod Security Standards (PSS)',
          'Privileged, Baseline, Restricted levels',
          'Pod Security Admission (PSA)',
          'Admission controllers',
        ],
        whatIsIt: 'The built-in Kubernetes admission control mechanism that replaces deprecated PodSecurityPolicies (PSP) by defining three standardized security policies (Privileged, Baseline, Restricted) enforced at the Namespace boundary via mode labels.',
        inSimpleWords: 'Building code regulations for your cluster. The city inspector (Pod Security Admission) inspects every blueprint (Pod YAML) before construction starts. If your blueprint doesn\'t meet fire codes (e.g. running as root), the inspector refuses the permit.',
        realWorldAnalogy: {
          metaphor: 'Airport TSA Security Screening Gates',
          explanation: 'Passengers must pass through security gates. Flight crew members with special clearance use Gate 1 (Privileged). Standard passengers with boarding passes use Gate 2 (Baseline). High-security international travelers pass through full-body biometric scans (Restricted).',
        },
        explanation: 'To eliminate the complexity of legacy PodSecurityPolicies, Kubernetes introduced `Pod Security Standards (PSS)` and the built-in `Pod Security Admission (PSA)` controller. PSS defines three policy levels: (1) `Privileged`: Completely unrestricted; allows root, hostPID, hostNetwork (used for system CNI and storage daemons); (2) `Baseline`: Minimally restrictive; prevents known privilege escalations while allowing default container settings; (3) `Restricted`: Hardened best practices; mandates non-root, read-only root filesystems, dropped capabilities, and seccomp. Administrators apply these policies to namespaces using labels with three distinct modes: `enforce` (rejects violating pods), `audit` (records violations in audit logs), and `warn` (displays a warning message to the user).',
        whenToUse: [
          'Enforcing enterprise-wide security baselines across hundreds of namespaces automatically without third-party tools',
          'Gradually hardening existing production clusters: start with `warn` and `audit` to discover violations without breaking live workloads, then switch to `enforce`',
        ],
        whenNotToUse: [
          'Applying `pod-security.kubernetes.io/enforce: restricted` to system namespaces (`kube-system`), which will break CNI plugins, CSI drivers, and node agents',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Namespace Labeling', description: 'Admin labels namespace with `pod-security.kubernetes.io/enforce: restricted`.' },
          { step: 2, title: 'Pod Submission Admission', description: 'When a pod is submitted, the Pod Security Admission plugin evaluates its `securityContext`.' },
          { step: 3, title: 'Compliance Check', description: 'Admission plugin verifies non-root UID, dropped capabilities, and seccomp profiles against PSS rules.' },
          { step: 4, title: 'Admission or Rejection', description: 'Compliant pods are saved to etcd; non-compliant pods receive an immediate HTTP 403 Forbidden with remediation advice.' },
        ],
        keyMechanisms: [
          { title: 'The Three PSS Levels', detail: 'Privileged (no restrictions), Baseline (prevents privilege escalation), Restricted (hardened non-root/seccomp).' },
          { title: 'The Three Admission Modes', detail: '`enforce` (blocks pod), `audit` (logs event), `warn` (outputs warning in kubectl response).' },
          { title: 'Version Pinning', detail: 'Labels can specify a Kubernetes minor version (e.g. `pod-security.kubernetes.io/enforce-version: v1.31`) to prevent breaking changes during upgrades.' },
        ],
        productionTips: [
          'Label all standard developer namespaces with `pod-security.kubernetes.io/enforce: restricted` and `pod-security.kubernetes.io/warn: restricted`.',
          'Use the `warn` mode when migrating older clusters to identify which deployments will break before turning on enforcement.',
          'For advanced policy rules beyond PSS (e.g. requiring specific label schemas or blocking specific image registries), pair PSA with `Kyverno` or `OPA Gatekeeper`.',
        ],
        yamlSnippet: `apiVersion: v1
kind: Namespace
metadata:
  name: secure-production
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/enforce-version: latest
    pod-security.kubernetes.io/warn: restricted
    pod-security.kubernetes.io/audit: restricted`,
        kubectlCommands: [
          'kubectl get namespaces --show-labels',
          'kubectl get validatingwebhookconfigurations',
          'kubectl label namespace default pod-security.kubernetes.io/warn=restricted',
        ],
        visualizerFocus: 'Pod Security Admission rejecting unhardened pods at the namespace boundary',
        practiceChallenge: {
          instructions: 'Inspect all ValidatingWebhookConfigurations configured on the cluster.',
          goalCommand: 'kubectl get validatingwebhookconfigurations',
          hints: ['Run kubectl get validatingwebhookconfigurations', 'Notice admission webhooks intercepting API requests'],
        },
      },
    ],
  },

  // =========================================================================
  // CHAPTER 9: Monitoring & Logging
  // =========================================================================
  {
    id: 'ch09-observability',
    number: 9,
    title: 'Monitoring & Logging',
    category: 'Operations & Observability',
    concepts: [
      {
        id: 'c-monitoring-logs',
        number: '9.1',
        title: 'Logs',
        commandPill: 'kubectl logs -l app=frontend-web --tail=50',
        badge: 'Log Streams',
        difficulty: 'Beginner',
        description: 'Stream, inspect, and analyze container logs: stdout/stderr streams, following logs, multi-container pod logs, previous crashed container logs, and log rotation.',
        subtopics: [
          'Container logs',
          'Pod logs',
          'Reading logs',
          'stdout/stderr capture',
        ],
        whatIsIt: 'The container logging pipeline in Kubernetes: capturing application text and structured JSON written to standard out (`stdout`) and standard error (`stderr`), persisting them to worker node disks, and querying them via `kubectl logs`.',
        inSimpleWords: 'The flight recorder of your running code. When your application prints messages using `console.log()` or `print()`, Kubernetes captures every single line so you can read them live or inspect why a crashed program failed.',
        realWorldAnalogy: {
          metaphor: 'A Continuous Receipt Tape Printer',
          explanation: 'A cash register prints every transaction onto a rolling paper tape. If a customer complains about an overcharge, the manager rolls back the paper tape to see the exact timestamp and item purchased.',
        },
        explanation: 'In 12-Factor cloud-native design, applications never manage their own log files on disk. They simply emit unbuffered text or structured JSON to `stdout` (file descriptor 1) and `stderr` (file descriptor 2). The container runtime (containerd) captures these streams and appends them to host files in `/var/log/pods/<namespace>_<pod>_<uid>/<container>/<run>.log`. When you run `kubectl logs`, the API server connects to the worker node kubelet over HTTPS, which streams the log file directly to your terminal. If a container crashed, `kubectl logs <pod> --previous` fetches the logs from the dead container instance.',
        whenToUse: [
          'Live interactive debugging of running applications during development and testing',
          'Investigating `CrashLoopBackOff` incidents using `kubectl logs <pod> --previous`',
          'Streaming live production logs during canary releases using `kubectl logs -f <pod>`',
        ],
        whenNotToUse: [
          'Writing log files directly into container writable layers (e.g. `/var/log/app.log`), which bloat container storage and disappear upon pod deletion',
          'Using `kubectl logs` as a long-term enterprise search engine across 500 pods (use a centralized log aggregator like Grafana Loki or Elasticsearch instead)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Stdout Stream Emission', description: 'Application writes log string to file descriptor 1.' },
          { step: 2, title: 'Runtime Capture', description: 'containerd streams bytes into `/var/log/pods/.../0.log` formatted with RFC3339 timestamps.' },
          { step: 3, title: 'Kubelet Log Rotation', description: 'Kubelet rotates files when reaching `containerLogMaxSize` (default 10Mi) preserving up to 5 historical files.' },
          { step: 4, title: 'Kubelet Streaming API', description: 'kubectl calls kube-apiserver proxy endpoint; kubelet streams matching lines to terminal.' },
        ],
        keyMechanisms: [
          { title: 'stdout & stderr Redirection', detail: 'Container runtimes capture POSIX file descriptors 1 and 2 automatically; no special logging SDK required.' },
          { title: 'The --previous Flag', detail: 'Crucial troubleshooting tool: reads the logs of the previous crashed container instance before its restart.' },
          { title: 'Kubelet Log Rotation', detail: 'Prevents worker node root filesystems from filling up by enforcing max log file size and count.' },
        ],
        productionTips: [
          'Always emit structured JSON logs (`{"time":"...", "level":"error", "message":"..."}`) so log search engines can parse fields without brittle regex.',
          'When debugging pods with multiple containers, specify `-c <container-name>` (e.g. `kubectl logs my-pod -c istio-proxy`).',
          'Use `kubectl logs -l app=my-app --tail=100 -f` to tail logs across all replicas of a Deployment simultaneously.',
        ],
        yamlSnippet: `# How Kubelet Captures Logs:
# Container Process -> writes to stdout/stderr
#   │
#   ▼
# containerd runtime -> appends to /var/log/pods/default_web-xxx/web/0.log
#   │
#   ▼
# Kubelet -> streams via HTTPS to kube-apiserver -> kubectl logs`,
        kubectlCommands: [
          'kubectl logs <pod-name>',
          'kubectl logs <pod-name> --previous',
          'kubectl logs -l app=frontend-web --tail=50',
          'kubectl logs <pod-name> -c <container-name> -f',
        ],
        visualizerFocus: 'Stdout log stream flowing from container process to host disk and kubectl CLI',
        practiceChallenge: {
          instructions: 'Query the most recent logs across frontend pods using kubectl logs.',
          goalCommand: 'kubectl logs -l app=frontend-web --tail=50',
          hints: ['Run kubectl logs -l app=frontend-web --tail=50', 'Inspect the emitted log messages'],
        },
      },
      {
        id: 'c-monitoring-metrics',
        number: '9.2',
        title: 'Metrics',
        commandPill: 'kubectl top pods',
        badge: 'Telemetry',
        difficulty: 'Intermediate',
        description: 'Observe numerical system performance: CPU and Memory telemetry, Prometheus exposition format, custom application metrics, and RED method.',
        subtopics: [
          'CPU',
          'Memory',
          'Application metrics',
          'Prometheus exposition format',
        ],
        whatIsIt: 'The collection, aggregation, and analysis of numerical, time-series telemetry representing infrastructure resource consumption (CPU millicores, RAM bytes, network throughput) and application-level performance (request rates, error counts, latency).',
        inSimpleWords: 'Numbers that measure how hard your system is working over time. Unlike logs (which tell individual stories line by line), metrics are numbers on a graph that show trends: "CPU is at 82%", "Database is handling 450 requests per second".',
        realWorldAnalogy: {
          metaphor: 'An ICU Patient Heart Rate & Blood Pressure Monitor',
          explanation: 'The hospital monitor continuously graphs the patient\'s heart rate (68 BPM) and oxygen saturation (99%). If heart rate spikes to 160 or oxygen drops below 90%, warning sirens beep immediately.',
        },
        explanation: 'Kubernetes metrics operate on two tiers: (1) `Core Infrastructure Metrics`: Scraped directly from Linux cgroups by cAdvisor (CPU, Memory, Disk, Network) and served via Metrics Server for autoscaling; (2) `Application & System Metrics`: Exposed by workloads over HTTP `/metrics` endpoints using the Prometheus exposition format (text-based lines with metric name, labels, and float value). SRE teams follow the `RED Method` for microservices: Rate (requests per second), Errors (number of failed requests), and Duration (time taken per request).',
        whenToUse: [
          'Triggering automated autoscaling actions (HPA) when metrics cross defined thresholds',
          'Building Grafana dashboards to visualize cluster health and application performance trends',
          'Establishing Service Level Objectives (SLOs) and measuring error budgets',
        ],
        whenNotToUse: [
          'Using high-cardinality label values (e.g. user IDs, email addresses, credit card numbers) in metric dimensions (explodes Prometheus TSDB memory)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Metric Instrumenting', description: 'Application uses Prometheus client library to count HTTP requests and measure latency.' },
          { step: 2, title: 'Endpoint Exposition', description: 'Container exposes HTTP endpoint at `http://localhost:8080/metrics`.' },
          { step: 3, title: 'Prometheus Scraping', description: 'Prometheus server polls `/metrics` every 15-30 seconds over HTTP.' },
          { step: 4, title: 'TSDB Indexing & Alerting', description: 'Prometheus appends time-stamped samples to its time-series database and evaluates alert rules.' },
        ],
        keyMechanisms: [
          { title: 'The Prometheus Metric Types', detail: 'Counter (monotonically increasing count), Gauge (fluctuating value like memory), Histogram (distribution of durations).' },
          { title: 'The RED Method', detail: 'Rate (throughput), Errors (failure count), Duration (latency percentiles: P50, P95, P99).' },
          { title: 'Time Series Dimensionality', detail: 'Metrics attach key-value label dimensions (`http_requests_total{method="POST", code="500"}`) for flexible querying.' },
        ],
        productionTips: [
          'Always measure latency using histograms (P95 and P99 percentiles); averages lie and hide terrible experiences suffered by 5% of users.',
          'Export metrics on a dedicated port or path (`/metrics`) separate from user traffic.',
        ],
        yamlSnippet: `# Standard Prometheus Metric Exposition Format:
# HELP http_requests_total Total number of HTTP requests processed
# TYPE http_requests_total counter
http_requests_total{method="GET",handler="/api/v1/users",code="200"} 41829
http_requests_total{method="POST",handler="/api/v1/checkout",code="500"} 3

# HELP process_resident_memory_bytes Resident memory size in bytes
# TYPE process_resident_memory_bytes gauge
process_resident_memory_bytes 134217728`,
        kubectlCommands: [
          'kubectl top pods',
          'kubectl top nodes',
          'kubectl get servicemonitors -A',
        ],
        visualizerFocus: 'Application exposing /metrics scraped by Prometheus time-series database',
        practiceChallenge: {
          instructions: 'Inspect current pod CPU and memory utilization across the cluster.',
          goalCommand: 'kubectl top pods',
          hints: ['Run kubectl top pods', 'Review the CPU(cores) and MEMORY(bytes) columns'],
        },
      },
      {
        id: 'c-monitoring-traces',
        number: '9.3',
        title: 'Traces',
        commandPill: 'kubectl explain pod.spec.containers.env',
        badge: 'Distributed Tracing',
        difficulty: 'Advanced',
        description: 'Track requests across microservices: Distributed Tracing, spans, trace context propagation, OpenTelemetry (OTel), and Jaeger.',
        subtopics: [
          'Distributed tracing',
          'Request flow',
          'OpenTelemetry',
          'Jaeger & trace context',
        ],
        whatIsIt: 'The observability discipline of tracking the end-to-end journey of a single user request as it traverses through dozens of interconnected microservices, message queues, and database queries across a distributed Kubernetes cluster.',
        inSimpleWords: 'A package tracking number for every HTTP request. When a user clicks "Buy Now", that request gets a unique Tracking ID. You can see the exact timeline showing 15ms in the API gateway, 42ms in the payment service, and 120ms waiting for the database.',
        realWorldAnalogy: {
          metaphor: 'A FedEx Package Tracking Timeline',
          explanation: 'When you order a package, the tracking number records: Scanned at warehouse (10:00 AM) -> Loaded on airplane (2:00 PM) -> Arrived at local distribution hub (6:00 PM). You know exactly where the parcel spent every hour of its journey.',
        },
        explanation: 'In microservice architectures, an HTTP request may trigger 15 downstream network calls across 10 different pods. When an end user experiences a 2-second delay, inspecting individual logs or CPU graphs cannot reveal which service caused the slowdown. Distributed Tracing solves this by generating a `Trace` composed of individual `Spans`. A span represents a single unit of contiguous work (e.g. executing an SQL query). Standardized protocols (W3C Trace Context, OpenTelemetry) inject trace headers (`traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`) across HTTP/gRPC network hops.',
        whenToUse: [
          'Diagnosing mysterious latency bottlenecks in complex multi-tier microservice architectures',
          'Identifying cascading failures and circular dependency calls between services',
          'Visualizing critical service dependency graphs automatically',
        ],
        whenNotToUse: [
          'Simple monolithic applications with only one backend service (basic logging and APM metrics suffice)',
          'High-throughput systems without trace sampling (capturing 100% of traces at 100,000 req/sec creates massive network and storage overhead)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Ingress Root Span Creation', description: 'Ingress controller generates unique 128-bit `trace_id` upon receiving incoming HTTP request.' },
          { step: 2, title: 'Context Propagation', description: 'Application forwarders inject `traceparent` HTTP header into all downstream RPC requests.' },
          { step: 3, title: 'Span Exportation', description: 'OpenTelemetry SDK inside containers buffers spans and pushes them via OTLP/gRPC to an OpenTelemetry Collector.' },
          { step: 4, title: 'Waterfall Visualization', description: 'Jaeger or Grafana Tempo aggregates spans by `trace_id` and renders interactive Gantt chart waterfalls.' },
        ],
        keyMechanisms: [
          { title: 'The W3C TraceContext Standard', detail: 'Universal HTTP header format (`traceparent`) enabling interoperability across different programming languages.' },
          { title: 'OpenTelemetry (OTel)', detail: 'The CNCF industry standard unifying APIs, SDKs, and collectors for telemetry (traces, metrics, logs).' },
          { title: 'Trace Sampling Strategies', detail: 'Head-based (probabilistic 5% sample) or Tail-based (keep 100% of traces that experienced HTTP 500 or latency > 1s).' },
        ],
        productionTips: [
          'Deploy the OpenTelemetry Collector as a cluster DaemonSet or sidecar to offload trace batching and compression from application runtimes.',
          'Always enable Tail-Based Sampling in production to ensure that 100% of error traces and high-latency anomalies are preserved while discarding mundane 200 OK traces.',
        ],
        yamlSnippet: `# OpenTelemetry Auto-Instrumentation Pod Annotation:
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-service
spec:
  template:
    metadata:
      annotations:
        instrumentation.opentelemetry.io/inject-java: "true"
    spec:
      containers:
      - name: app
        image: order-service:v2.0`,
        kubectlCommands: [
          'kubectl get pods -n tracing',
          'kubectl get otelcol -A',
        ],
        visualizerFocus: 'Distributed trace spans tracking request journey across microservices',
        practiceChallenge: {
          instructions: 'Check the container environment variable configuration using kubectl explain.',
          goalCommand: 'kubectl explain pod.spec.containers.env',
          hints: ['Run kubectl explain pod.spec.containers.env', 'Notice name and value fields used for OTEL configuration'],
        },
      },
      {
        id: 'c-monitoring-resource-health',
        number: '9.4',
        title: 'Resource Health',
        commandPill: 'kubectl describe pod <name> | grep -A 10 Conditions',
        badge: 'Self-Healing',
        difficulty: 'Intermediate',
        description: 'Evaluate health and lifecycle status: Pod Conditions, Node Conditions (MemoryPressure, DiskPressure), and Container Probes (Startup, Liveness, Readiness).',
        subtopics: [
          'Pod health',
          'Node health',
          'Application health',
          'Probes & condition flags',
        ],
        whatIsIt: 'The multi-tiered diagnostic health evaluation system in Kubernetes that monitors whether hardware worker nodes, system daemons, and application containers are functional, ready to accept traffic, or require autonomic self-healing restarts.',
        inSimpleWords: 'A 3-level medical checkup: (1) Is the hospital building standing? (Node Health); (2) Is the patient awake? (Liveness Probe); (3) Is the patient ready to walk out the door? (Readiness Probe).',
        realWorldAnalogy: {
          metaphor: 'A Factory Assembly Line Safety System',
          explanation: 'Sensors check if the factory has power (Node Ready). An electric eye checks if the conveyor belt motor is spinning (Liveness). A laser scanner checks if paint has dried before packing the box into a truck (Readiness).',
        },
        explanation: 'Kubernetes evaluates health across three distinct layers: (1) `Node Conditions`: Kubelet reports node status flags to the control plane: `Ready`, `MemoryPressure`, `DiskPressure`, `PIDPressure`, and `NetworkUnavailable`. If a node suffers MemoryPressure, it stops scheduling new pods and begins evicting BestEffort pods; (2) `Pod Conditions`: `PodScheduled`, `ContainersReady`, `Initialized`, `Ready`; (3) `Container Probes`: (a) `Startup Probe`: Suppresses liveness/readiness checks during slow boots; (b) `Liveness Probe`: Restarts the container if it deadlocks or freezes; (c) `Readiness Probe`: Removes the pod IP from Service routing if it cannot accept traffic.',
        whenToUse: [
          'Configuring Startup Probes for slow-starting JVM, Rails, or Python applications to prevent premature restarts',
          'Configuring Readiness Probes on database backends or cache warmers to prevent 502 Bad Gateway errors during rollouts',
          'Diagnosing why a pod is not receiving traffic despite showing `STATUS: Running`',
        ],
        whenNotToUse: [
          'Checking external downstream databases in a pod\'s liveness probe (if the database blips, ALL web pods fail liveness and restart simultaneously in a catastrophic death loop)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Startup Evaluation', description: 'Kubelet executes startupProbe; liveness and readiness probes are disabled until startup succeeds.' },
          { step: 2, title: 'Readiness Pass & Traffic Flow', description: 'Readiness probe succeeds; Endpoints controller attaches Pod IP to Service.' },
          { step: 3, title: 'Liveness Heartbeat', description: 'Kubelet runs livenessProbe every periodSeconds; consecutive failures trigger restart.' },
          { step: 4, title: 'Dynamic Deregistration', description: 'If readiness fails later, pod IP is stripped from Service endpoints without restarting the process.' },
        ],
        keyMechanisms: [
          { title: 'The Three Probe Handlers', detail: 'httpGet (HTTP 200-399 status), tcpSocket (TCP handshake), and exec (shell command exit code 0).' },
          { title: 'Node Conditions & Taints', detail: 'When a node reports MemoryPressure, the node-controller taints the node `node.kubernetes.io/memory-pressure:NoSchedule`.' },
          { title: 'failureThreshold & periodSeconds', detail: 'Prevents flapping by requiring N consecutive probe failures before taking action.' },
        ],
        productionTips: [
          'Golden CKA Rule: NEVER check external dependencies (DB, Redis, payment APIs) in your livenessProbe!',
          'Always configure `startupProbe` for legacy or slow applications; give it a high failureThreshold (e.g. 30 with periodSeconds 10 = 5 minutes).',
          'Use gRPC native probes (k8s 1.24+) for microservices instead of invoking expensive exec scripts.',
        ],
        yamlSnippet: `apiVersion: v1
kind: Pod
metadata:
  name: resilient-pod
spec:
  containers:
  - name: api
    image: api:v1
    startupProbe:
      httpGet:
        path: /health/startup
        port: 8080
      failureThreshold: 30
      periodSeconds: 10
    livenessProbe:
      httpGet:
        path: /health/live
        port: 8080
      periodSeconds: 10
    readinessProbe:
      httpGet:
        path: /health/ready
        port: 8080
      periodSeconds: 5`,
        kubectlCommands: [
          'kubectl describe pod <name> | grep -A 10 Conditions',
          'kubectl describe nodes | grep -A 8 Conditions',
        ],
        visualizerFocus: 'Readiness probe removing traffic from pod endpoints during backend saturation',
        practiceChallenge: {
          instructions: 'Inspect pod health conditions using kubectl describe pod.',
          goalCommand: 'kubectl describe pod web-frontend',
          hints: ['Run kubectl describe pod web-frontend', 'Look for the Conditions and Probes sections'],
        },
      },
      {
        id: 'c-observability-engines',
        number: '9.5',
        title: 'Observability Engines',
        commandPill: 'kubectl get pods -A -l app.kubernetes.io/part-of=kube-prometheus-stack',
        badge: 'Enterprise Stack',
        difficulty: 'Intermediate',
        description: 'Assemble the production observability stack: Prometheus, Grafana, Alertmanager, Fluent Bit, Loki, Jaeger, and OpenTelemetry.',
        subtopics: [
          'Monitoring systems',
          'Metrics systems',
          'Logging systems',
          'Tracing systems',
        ],
        whatIsIt: 'The end-to-end cloud-native observability platform architecture: integrating the "Three Pillars of Observability" (Metrics, Logs, Traces) into a unified enterprise monitoring and alerting ecosystem using standard open-source tools.',
        inSimpleWords: 'The mission control room for your entire Kubernetes fleet. Wall-to-wall screens showing live server metrics (Prometheus + Grafana), searching all log messages across thousands of machines in milliseconds (Fluent Bit + Loki), and alerting on-call engineers at 2 AM (Alertmanager + PagerDuty).',
        realWorldAnalogy: {
          metaphor: 'NASA Mission Control in Houston',
          explanation: 'Flight controllers do not stare at raw radio waves. They have dedicated telemetry engineers (Prometheus metrics), communications loggers (Loki logs), and trajectory trackers (Jaeger traces) reporting to the Flight Director (Grafana dashboard).',
        },
        explanation: 'A production Kubernetes observability stack combines specialized best-of-breed open-source engines: (1) `Metrics Engine (Prometheus Operator / VictoriaMetrics)`: Scrapes Prometheus endpoints, stores time-series data in a TSDB, and executes PromQL alert queries; (2) `Visualization (Grafana)`: Unified dashboarding UI rendering metrics, logs, and traces side-by-side; (3) `Alerting (Alertmanager)`: Deduplicates alerts, silences maintenance windows, and routes pages to PagerDuty/Slack; (4) `Logging Engine (Fluent Bit DaemonSet + Grafana Loki / Elasticsearch)`: Streams host logs to central searchable object storage; (5) `Tracing Engine (OpenTelemetry Collector + Tempo / Jaeger)`: Ingests distributed trace spans.',
        whenToUse: [
          'Operating commercial production Kubernetes clusters requiring 24/7 SRE monitoring and automated incident alerting',
          'Establishing unified observability across multiple Kubernetes clusters in hybrid or multi-cloud environments',
          'Empowering software engineering teams with self-service dashboards and automated error tracking',
        ],
        whenNotToUse: [
          'Running an unmanaged, single-node Prometheus instance without persistent storage in a 500-node cluster (use Prometheus Operator with Thanos or Cortex for multi-cluster HA)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Agent Collection', description: 'Fluent Bit tails node log files; Prometheus scrapes pod /metrics; OTel collects traces.' },
          { step: 2, title: 'Central Storage Ingestion', description: 'Logs stream to Loki/Elasticsearch; metrics store in Prometheus TSDB; traces store in Tempo.' },
          { step: 3, title: 'Unified Querying', description: 'Grafana correlates a metric spike with matching log error messages and trace waterfalls.' },
          { step: 4, title: 'Alert Notification', description: 'Prometheus fires alert rule; Alertmanager deduplicates and pages on-call engineer via PagerDuty.' },
        ],
        keyMechanisms: [
          { title: 'The Prometheus Operator (CRDs)', detail: 'Automates Prometheus deployment and dynamic target discovery using `ServiceMonitor` and `PodMonitor` CRDs.' },
          { title: 'Grafana Loki LogQL', detail: 'Indexes only metadata labels (like Prometheus), storing raw log chunks in cheap S3/GCS object storage.' },
          { title: 'Correlation Across Pillars', detail: 'Clicking a trace ID in Grafana Loki jumps directly to the corresponding Jaeger trace and Prometheus CPU graph.' },
        ],
        productionTips: [
          'Deploy the community standard `kube-prometheus-stack` Helm chart; it installs Prometheus, Grafana, Alertmanager, and 50+ pre-built Kubernetes dashboards in 2 minutes.',
          'Always configure Alertmanager routing trees with `group_by: [alertname, cluster, service]` to prevent alert storms from sending 500 separate emails during a network blip.',
        ],
        yamlSnippet: `# Prometheus Operator ServiceMonitor CRD:
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: api-monitor
  namespace: default
spec:
  selector:
    matchLabels:
      app: backend-api
  endpoints:
  - port: metrics
    interval: 15s
    path: /metrics`,
        kubectlCommands: [
          'kubectl get pods -n monitoring',
          'kubectl get servicemonitors -A',
          'kubectl get prometheuses -A',
        ],
        visualizerFocus: 'Unified observability pipeline aggregating metrics, logs, and traces into Grafana',
        practiceChallenge: {
          instructions: 'Check for monitoring resources and service monitors across all namespaces.',
          goalCommand: 'kubectl get pods -A -l app.kubernetes.io/part-of=kube-prometheus-stack',
          hints: ['Run the kubectl get command', 'Notice the Prometheus, Grafana, and Alertmanager pods'],
        },
      },
    ],
  },
];
