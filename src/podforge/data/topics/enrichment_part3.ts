import type { KubePitfall, KubeQuizQuestion, KubeYamlFieldExplanation } from './types';
import type { ConceptEnrichment } from './enrichment_part1';

export const PART_3_ENRICHMENT: Record<string, ConceptEnrichment> = {
  'c-cpu-and-memory': {
    commonPitfalls: [
      {
        mistake: 'Confusing `500m` CPU with 500 megabytes of memory.',
        whyItHappens: '`m` stands for millicores (1000m = 1 CPU core). Memory uses `Mi` (Mebibytes) or `Gi` (Gibibytes).',
        fix: 'Remember: CPU is measured in millicores (`250m` = 0.25 core); Memory is measured in bytes (`256Mi`, `1Gi`).',
      },
      {
        mistake: 'Using `MB` (megabytes, base 10) instead of `Mi` (mebibytes, base 2).',
        whyItHappens: 'Typo in units causes slight allocation discrepancies.',
        fix: 'Use standard binary IEC notation: `Mi` (1024^2 bytes) and `Gi` (1024^3 bytes).',
      },
    ],
    quizQuestion: {
      question: 'In Kubernetes resource definitions, what does `cpu: "250m"` represent?',
      options: [
        { label: 'A', text: '250 megabytes of CPU cache.', isCorrect: false, explanation: 'CPU is measured in compute time/cores, not cache size.' },
        { label: 'B', text: '0.25 (one quarter) of a physical or virtual CPU core.', isCorrect: true, explanation: 'Correct! 1000 millicores equals 1 full core; therefore 250m is 250/1000 = 0.25 cores.' },
        { label: 'C', text: '250 minutes of compute time per day.', isCorrect: false, explanation: 'Kubernetes does not quota time per day this way.' },
        { label: 'D', text: '250 instructions per second.', isCorrect: false, explanation: 'Clock instructions are not Kubernetes unit scales.' },
      ],
    },
    yamlExplanation: [
      { field: 'resources.requests.cpu: 250m', explanation: 'Guarantees 25% of a CPU core to this container during scheduling.' },
      { field: 'resources.requests.memory: 512Mi', explanation: 'Guarantees 512 Mebibytes of physical RAM on the scheduled worker node.' },
    ],
    referenceCheatSheet: [
      'kubectl describe nodes | grep -A 8 "Allocatable:" : View total allocatable CPU and RAM per node',
      'kubectl top node : View live CPU and memory utilization across the fleet',
      'kubectl explain pod.spec.containers.resources : View complete resource schema',
    ],
    solutionExplanation: 'Understanding millicores and mebibytes ensures accurate bin-packing and prevents node overallocation.',
  },

  'c-resource-requests': {
    commonPitfalls: [
      {
        mistake: 'Omitting resource requests, resulting in the BestEffort Quality of Service (QoS) tier.',
        whyItHappens: 'Developers skip resource requests because the app works locally without them.',
        fix: 'BestEffort pods are the FIRST to be killed when a node runs low on memory! Always declare requests.',
      },
      {
        mistake: 'Setting requests too high, causing severe node underutilization (wasteful cloud bills).',
        whyItHappens: 'Engineers guess memory usage instead of profiling actual production metrics.',
        fix: 'Use Vertical Pod Autoscaler (VPA) in recommendation mode to right-size requests based on historical P95 usage.',
      },
    ],
    quizQuestion: {
      question: 'How does the Kubernetes kube-scheduler use the `resources.requests` values specified in a Pod manifest?',
      options: [
        { label: 'A', text: 'It enforces hard kernel limits and kills the pod if it exceeds the request.', isCorrect: false, explanation: 'Limits trigger throttling/OOM, not requests.' },
        { label: 'B', text: 'It filters and scores candidate nodes, ensuring the chosen node has enough unallocated capacity to satisfy the requested CPU and RAM.', isCorrect: true, explanation: 'Correct! The scheduler uses requests for node placement. Once scheduled, the pod is guaranteed this allocation.' },
        { label: 'C', text: 'It charges the developer credit card for the requested compute power.', isCorrect: false, explanation: 'Billing is handled by cloud hyperscalers, not the scheduler.' },
        { label: 'D', text: 'It sends requests to external DNS providers.', isCorrect: false, explanation: 'Scheduler operates strictly within the cluster.' },
      ],
    },
    yamlExplanation: [
      { field: 'resources.requests.cpu', explanation: 'Used by kube-scheduler to determine which worker node has sufficient capacity to host the pod.' },
      { field: 'resources.requests.memory', explanation: 'Reserved RAM on the host node; cannot be allocated to other pods.' },
    ],
    referenceCheatSheet: [
      'kubectl describe node <name> | grep -A 6 "Allocated resources:" : Inspect committed request percentages',
      'kubectl get pods --all-namespaces -o custom-columns=NAME:.metadata.name,CPU_REQ:.spec.containers[*].resources.requests.cpu : List all pod CPU requests',
    ],
    solutionExplanation: 'Resource requests guarantee baseline resources and drive optimal bin-packing scheduling decisions.',
  },

  'c-resource-limits': {
    commonPitfalls: [
      {
        mistake: 'Setting CPU limits too strictly, causing severe latency spikes due to CFS throttling.',
        whyItHappens: 'When a container hits its CPU limit, the Linux kernel does not kill it; it pauses (throttles) the process until the next 100ms quota period.',
        fix: 'Monitor `container_cpu_cfs_throttled_periods_total`. In many high-performance microservices, omit CPU limits and use requests only.',
      },
      {
        mistake: 'Believing that exceeding a memory limit causes throttling.',
        whyItHappens: 'RAM cannot be paused like CPU cycles.',
        fix: 'When a container exceeds its memory limit, the Linux kernel OOM killer terminates the process immediately with Exit Code 137.',
      },
    ],
    quizQuestion: {
      question: 'What happens immediately when a container consumes more physical memory than specified in its `resources.limits.memory`?',
      options: [
        { label: 'A', text: 'The Linux kernel throttles CPU cycles and slows down the process.', isCorrect: false, explanation: 'Throttling is the consequence of CPU limits, not memory limits.' },
        { label: 'B', text: 'The container process is terminated by the kernel OOM Killer with exit code 137 (OOMKilled).', isCorrect: true, explanation: 'Correct! Memory cannot be throttled; when the cgroup limit is breached, the kernel immediately terminates the process.' },
        { label: 'C', text: 'The worker node immediately restarts and reboots.', isCorrect: false, explanation: 'The kernel isolates and terminates only the offending container process.' },
        { label: 'D', text: 'Kubernetes dynamically buys more RAM from the cloud provider.', isCorrect: false, explanation: 'Hardware is not resized dynamically per container limit violation.' },
      ],
    },
    yamlExplanation: [
      { field: 'resources.limits.memory: 512Mi', explanation: 'Hard ceiling enforced by Linux memory cgroups; exceeding this causes OOMKilled.' },
      { field: 'resources.limits.cpu: "1"', explanation: 'Maximum CPU share enforced by Linux CFS quota periods.' },
    ],
    referenceCheatSheet: [
      'kubectl describe pod <name> | grep -i oom : Check if a pod recently died due to OOMKilled',
      'kubectl get pods -o wide | grep OOMKilled : Quickly identify all OOM victims across the namespace',
    ],
    solutionExplanation: 'Resource limits establish hard ceilings, preventing rogue memory leaks or CPU loops from degrading neighboring workloads.',
  },

  'c-namespace-quotas': {
    commonPitfalls: [
      {
        mistake: 'Applying a ResourceQuota without defining a LimitRange, blocking all Pod deployments.',
        whyItHappens: 'When a ResourceQuota is enforced on a namespace, every single pod MUST specify requests and limits. If a pod omits them, it is rejected by the admission controller.',
        fix: 'Always deploy a `LimitRange` alongside `ResourceQuota` to automatically inject default requests/limits into pods that omit them.',
      },
      {
        mistake: 'Setting quota limits too close to actual usage, preventing canary deployments during rollouts.',
        whyItHappens: 'Rolling updates temporarily require up to 25% extra capacity for surge pods.',
        fix: 'Buffer ResourceQuotas by at least 30-50% above steady-state requirements.',
      },
    ],
    quizQuestion: {
      question: 'Why is a `LimitRange` recommended whenever a `ResourceQuota` is applied to a Kubernetes namespace?',
      options: [
        { label: 'A', text: 'LimitRange speeds up network packet transfers.', isCorrect: false, explanation: 'LimitRange is an admission control tool, not a networking plugin.' },
        { label: 'B', text: 'LimitRange automatically injects default CPU/memory requests and limits into pods that do not declare them, preventing admission rejection.', isCorrect: true, explanation: 'Correct! ResourceQuota rejects pods missing resource declarations; LimitRange provides sensible defaults so pods can be admitted.' },
        { label: 'C', text: 'LimitRange encrypts secrets stored in the namespace.', isCorrect: false, explanation: 'KMS handles secret encryption.' },
        { label: 'D', text: 'LimitRange allows pods to bypass RBAC security checks.', isCorrect: false, explanation: 'RBAC is enforced independently.' },
      ],
    },
    yamlExplanation: [
      { field: 'spec.hard["requests.cpu"]: "10"', explanation: 'Total aggregate CPU requests allowed across all active pods in the namespace.' },
      { field: 'spec.hard["pods"]: "20"', explanation: 'Maximum number of concurrent pods permitted in the namespace.' },
    ],
    referenceCheatSheet: [
      'kubectl get resourcequotas,limitranges -n <ns> : View active quotas, limits, and current usage',
      'kubectl describe resourcequota <name> -n <ns> : View detailed used vs hard limit breakdown',
    ],
    solutionExplanation: 'ResourceQuotas and LimitRanges enable multi-tenant governance, capping resource consumption per team or environment.',
  },

  'c-monitoring-resource-usage': {
    commonPitfalls: [
      {
        mistake: 'Running `kubectl top` on a freshly created cluster and getting the error: `Metrics API not available`.',
        whyItHappens: 'Metrics Server is not installed by default in vanilla Kubernetes clusters.',
        fix: 'Deploy the official Kubernetes Metrics Server (`kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/...`).',
      },
      {
        mistake: 'Relying on Metrics Server for long-term historical trend analysis and capacity planning.',
        whyItHappens: 'Metrics Server is an in-memory, transient component designed strictly for HPA autoscaling, not historical dashboards.',
        fix: 'Deploy Prometheus and Grafana for long-term metric persistence and alerting.',
      },
    ],
    quizQuestion: {
      question: 'Which in-cluster addon is required to enable the `kubectl top nodes` and `kubectl top pods` commands?',
      options: [
        { label: 'A', text: 'Metrics Server', isCorrect: true, explanation: 'Correct! Metrics Server scrapes resource metrics from kubelets via the Summary API and exposes them through the Kubernetes Custom Metrics API.' },
        { label: 'B', text: 'Elasticsearch', isCorrect: false, explanation: 'Elasticsearch is for log indexing, not the Kubernetes Metrics API.' },
        { label: 'C', text: 'CoreDNS', isCorrect: false, explanation: 'CoreDNS resolves cluster domain names.' },
        { label: 'D', text: 'etcd-metrics-proxy', isCorrect: false, explanation: 'Not a standard Kubernetes metrics component.' },
      ],
    },
    yamlExplanation: [
      { field: 'args: - --kubelet-insecure-tls', explanation: 'Common flag used in local or test clusters to allow Metrics Server to scrape kubelets with self-signed certificates.' },
    ],
    referenceCheatSheet: [
      'kubectl top nodes : Inspect real-time CPU and Memory utilization per node',
      'kubectl top pods -A --sort-by=memory : Identify top memory-consuming pods across the entire cluster',
      'kubectl top pods -A --sort-by=cpu : Identify top CPU-consuming pods across the entire cluster',
    ],
    solutionExplanation: 'Metrics Server aggregates lightweight resource metrics directly from kubelets, powering `kubectl top` and Horizontal Pod Autoscalers.',
  },

  'c-k8s-security-fundamentals': {
    commonPitfalls: [
      {
        mistake: 'Focusing exclusively on cluster RBAC while ignoring host-level OS and cloud IAM vulnerabilities.',
        whyItHappens: 'Security is multi-layered; compromising the underlying AWS/GCP IAM role grants full control regardless of cluster RBAC.',
        fix: 'Follow the 4C Model of Cloud-Native Security: Cloud, Cluster, Container, Code.',
      },
      {
        mistake: 'Leaving default ServiceAccount tokens mounted inside pods that never talk to the Kubernetes API.',
        whyItHappens: 'Kubernetes mounts API tokens by default.',
        fix: 'Set `automountServiceAccountToken: false` on pods and ServiceAccounts that do not need Kubernetes API access.',
      },
    ],
    quizQuestion: {
      question: 'In the CNCF 4C Security Model for cloud-native architectures, what are the four layers of defense in depth?',
      options: [
        { label: 'A', text: 'Compute, Control, Core, Configuration', isCorrect: false, explanation: 'These are operational categories, not security defense layers.' },
        { label: 'B', text: 'Cloud, Cluster, Container, Code', isCorrect: true, explanation: 'Correct! Security must be enforced at each concentric layer: the Cloud infrastructure, the Kubernetes Cluster, the Container runtime, and the Application Code.' },
        { label: 'C', text: 'Cgroups, Chroot, Capabilities, Certificates', isCorrect: false, explanation: 'These are Linux kernel mechanisms.' },
        { label: 'D', text: 'Credentials, Certificates, Cipher, Checksum', isCorrect: false, explanation: 'These are cryptographic primitives.' },
      ],
    },
    yamlExplanation: [
      { field: 'automountServiceAccountToken: false', explanation: 'Prevents the pod from automatically receiving a Kubernetes API JWT token in `/var/run/secrets/kubernetes.io/serviceaccount`.' },
    ],
    referenceCheatSheet: [
      'kubectl auth can-i --list : Audit what operations the active context is authorized to perform',
      'trivy k8s --report summary cluster : Scan entire cluster for security misconfigurations and CVEs',
    ],
    solutionExplanation: 'The 4C security model guarantees defense in depth from external cloud infrastructure down to application code.',
  },

  'c-rbac-authorization': {
    commonPitfalls: [
      {
        mistake: 'Granting wildcards (`verbs: ["*"]`, `resources: ["*"]`) in production RoleBindings.',
        whyItHappens: 'Engineers use wildcards to bypass permission errors during rapid debugging.',
        fix: 'Adhere strictly to the Principle of Least Privilege: specify explicit resources and verbs (`get`, `list`, `watch`).',
      },
      {
        mistake: 'Binding a cluster-wide `ClusterRole` with write permissions to a namespace-scoped developer.',
        whyItHappens: 'Using `ClusterRoleBinding` instead of `RoleBinding`.',
        fix: 'Use a `RoleBinding` to bind a `ClusterRole` to a specific namespace; this grants permissions ONLY within that namespace.',
      },
    ],
    quizQuestion: {
      question: 'What is the difference between a `RoleBinding` and a `ClusterRoleBinding` in Kubernetes RBAC?',
      options: [
        { label: 'A', text: 'RoleBinding only works with Windows containers.', isCorrect: false, explanation: 'RBAC is OS-agnostic.' },
        { label: 'B', text: 'A RoleBinding grants permissions within a specific single namespace, whereas a ClusterRoleBinding grants permissions across all namespaces and cluster-scoped resources.', isCorrect: true, explanation: 'Correct! RoleBinding is strictly namespaced; ClusterRoleBinding applies cluster-wide (e.g. Nodes, PVs, or all namespaces).' },
        { label: 'C', text: 'ClusterRoleBindings cannot be audited in logs.', isCorrect: false, explanation: 'All API requests are audited identically.' },
        { label: 'D', text: 'RoleBindings are deprecated in modern Kubernetes.', isCorrect: false, explanation: 'RoleBindings are the standard for namespace-scoped RBAC.' },
      ],
    },
    yamlExplanation: [
      { field: 'rules[].apiGroups: [""]', explanation: 'Specifies the core API group (holding Pods, Services, ConfigMaps).' },
      { field: 'rules[].verbs: ["get", "list", "watch"]', explanation: 'Standard read-only verbs required for controllers, dashboards, and viewing resources.' },
      { field: 'subjects[].kind: ServiceAccount', explanation: 'The identity being granted the permissions defined in the Role.' },
    ],
    referenceCheatSheet: [
      'kubectl auth can-i create pods --as=system:serviceaccount:dev:app-sa : Impersonate and test permissions',
      'kubectl get roles,rolebindings -n <ns> : List active namespace RBAC rules',
      'kubectl get clusterroles,clusterrolebindings : List cluster-wide administrative RBAC rules',
    ],
    solutionExplanation: 'Role-Based Access Control regulates access to the Kubernetes API based on Subjects, Roles, and Bindings.',
  },

  'c-network-security-policies': {
    commonPitfalls: [
      {
        mistake: 'Assuming NetworkPolicies are active when using a CNI that does not support them (e.g. Flannel).',
        whyItHappens: 'Kubernetes accepts NetworkPolicy manifests without errors even if the CNI plugin completely ignores them.',
        fix: 'Use a policy-enforcing CNI such as Calico, Cilium, or Antrea; otherwise, policies have ZERO effect.',
      },
      {
        mistake: 'Forgetting to allow DNS traffic in an egress NetworkPolicy, causing pods to fail to resolve external domain names.',
        whyItHappens: 'Applying a default-deny egress policy blocks UDP/TCP port 53 to CoreDNS.',
        fix: 'Always add an egress rule allowing port 53 to kube-system CoreDNS in restricted egress policies.',
      },
    ],
    quizQuestion: {
      question: 'What is the default network traffic behavior in Kubernetes if NO `NetworkPolicy` has been applied to a namespace?',
      options: [
        { label: 'A', text: 'All ingress and egress traffic is completely blocked.', isCorrect: false, explanation: 'Kubernetes is open by default.' },
        { label: 'B', text: 'Non-isolated: Any Pod in any namespace can communicate freely with any other Pod in the cluster.', isCorrect: true, explanation: 'Correct! By default, Kubernetes networks are completely open flat meshes until explicit NetworkPolicies isolate them.' },
        { label: 'C', text: 'Pods can only talk to pods on the same worker node.', isCorrect: false, explanation: 'CNI overlays route across all nodes.' },
        { label: 'D', text: 'Traffic is routed through external cloud firewalls.', isCorrect: false, explanation: 'Internal pod traffic does not leave the cluster network.' },
      ],
    },
    yamlExplanation: [
      { field: 'policyTypes: ["Ingress", "Egress"]', explanation: 'Declares that this policy governs both inbound and outbound packet filtering for selected pods.' },
      { field: 'spec.podSelector.matchLabels: { app: db }', explanation: 'Selects target pods that this microsegmentation policy isolates.' },
    ],
    referenceCheatSheet: [
      'kubectl get networkpolicies -A : List all active firewall rules across the cluster',
      'kubectl describe networkpolicy <name> : Inspect ingress/egress rules and CIDR blocks',
    ],
    solutionExplanation: 'NetworkPolicies enforce Layer 3 and Layer 4 microsegmentation, preventing lateral movement during security compromises.',
  },

  'c-container-security-hardening': {
    commonPitfalls: [
      {
        mistake: 'Running containers with `privileged: true`.',
        whyItHappens: 'Developers use privileged mode to bypass permission errors without understanding the risk.',
        fix: 'Privileged mode grants the container full root access to the host kernel and devices. Ban `privileged: true` via admission controllers.',
      },
      {
        mistake: 'Allowing `allowPrivilegeEscalation: true`.',
        whyItHappens: 'Default Linux settings permit setuid binaries (like `sudo`) to gain higher privileges.',
        fix: 'Explicitly set `securityContext.allowPrivilegeEscalation: false` in all container specs.',
      },
    ],
    quizQuestion: {
      question: 'Which `securityContext` setting prevents processes inside a container from modifying the container file system at runtime?',
      options: [
        { label: 'A', text: '`runAsUser: 1000`', isCorrect: false, explanation: 'Runs as non-root user, but files owned by user 1000 can still be modified.' },
        { label: 'B', text: '`readOnlyRootFilesystem: true`', isCorrect: true, explanation: 'Correct! Mounting the root filesystem as read-only prevents attackers from downloading, compiling, or persisting malicious scripts.' },
        { label: 'C', text: '`capabilities: drop: ["ALL"]`', isCorrect: false, explanation: 'Drops kernel capabilities, but does not make the filesystem read-only.' },
        { label: 'D', text: '`seccompProfile: type: Unconfined`', isCorrect: false, explanation: 'Unconfined disables syscall filtering, which is insecure.' },
      ],
    },
    yamlExplanation: [
      { field: 'securityContext.allowPrivilegeEscalation: false', explanation: 'Prevents setuid binaries inside the container from gaining elevated privileges.' },
      { field: 'securityContext.capabilities.drop: ["ALL"]', explanation: 'Strips all default Linux root capabilities (e.g. NET_ADMIN, SYS_PTRACE).' },
    ],
    referenceCheatSheet: [
      'kubectl explain pod.spec.containers.securityContext : Inspect all available container security hardening parameters',
      'docker run --cap-drop=ALL ... : Test minimal capabilities in local development',
    ],
    solutionExplanation: 'Hardening the container runtime via securityContext prevents host breakouts and limits lateral blast radiuses.',
  },

  'c-pod-security-standards': {
    commonPitfalls: [
      {
        mistake: 'Using deprecated `PodSecurityPolicies` (PSP) in modern Kubernetes versions (v1.25+).',
        whyItHappens: 'PSP was removed in Kubernetes 1.25.',
        fix: 'Migrate to built-in Pod Security Admission (PSA) with Pod Security Standards (Privileged, Baseline, Restricted).',
      },
      {
        mistake: 'Setting `pod-security.kubernetes.io/enforce: restricted` on a namespace without testing apps in `audit` mode first.',
        whyItHappens: 'Restricted mode blocks containers running as root or missing explicit securityContext fields, immediately breaking deployments.',
        fix: 'Enable `warn` and `audit` modes first; review audit logs before turning on `enforce`.',
      },
    ],
    quizQuestion: {
      question: 'What are the three tiers of the official Kubernetes Pod Security Standards (PSS)?',
      options: [
        { label: 'A', text: 'Low, Medium, High', isCorrect: false, explanation: 'These are generic severity levels.' },
        { label: 'B', text: 'Privileged, Baseline, Restricted', isCorrect: true, explanation: 'Correct! Privileged is unconstrained; Baseline prevents known privilege escalations; Restricted enforces hardened cloud-native best practices.' },
        { label: 'C', text: 'Public, Private, Confidential', isCorrect: false, explanation: 'These are data classification tiers.' },
        { label: 'D', text: 'Dev, Staging, Production', isCorrect: false, explanation: 'These are deployment environments.' },
      ],
    },
    yamlExplanation: [
      { field: 'pod-security.kubernetes.io/enforce: restricted', explanation: 'Namespace label instructing the admission controller to reject any pod violating the Restricted standard.' },
      { field: 'pod-security.kubernetes.io/enforce-version: latest', explanation: 'Pins the policy version to match the latest Kubernetes release rules.' },
    ],
    referenceCheatSheet: [
      'kubectl label namespace dev pod-security.kubernetes.io/enforce=baseline : Apply Baseline security to namespace',
      'kubectl get ns --show-labels : Audit active pod security labels across all namespaces',
    ],
    solutionExplanation: 'Pod Security Standards and Admission provide native, declarative policy enforcement across all cluster workloads.',
  },

  'c-monitoring-logs': {
    commonPitfalls: [
      {
        mistake: 'Writing application logs to local files inside the container filesystem instead of `stdout` and `stderr`.',
        whyItHappens: 'Legacy applications configured to write to `/var/log/app.log`.',
        fix: 'Kubernetes and container runtimes automatically capture `stdout`/`stderr`. Symlink log files to `/dev/stdout` or configure loggers directly to standard output.',
      },
      {
        mistake: 'Assuming `kubectl logs` retains historical logs after a Pod is deleted.',
        whyItHappens: 'When a Pod is deleted, its local log files on the worker node are purged by kubelet.',
        fix: 'Deploy a centralized logging agent (FluentBit, Vector, Promtail) to ship logs to an external storage cluster (Loki, Elasticsearch).',
      },
    ],
    quizQuestion: {
      question: 'Which flag should you pass to `kubectl logs` to inspect logs from a container that just crashed and restarted?',
      options: [
        { label: 'A', text: '`--previous` (or `-p`)', isCorrect: true, explanation: 'Correct! `kubectl logs -p` retrieves the logs of the previously terminated instance of the container.' },
        { label: 'B', text: '`--history`', isCorrect: false, explanation: '`--history` is used with `kubectl rollout`, not `kubectl logs`.' },
        { label: 'C', text: '`--crash-dump`', isCorrect: false, explanation: 'Not a valid kubectl flag.' },
        { label: 'D', text: '`--dead`', isCorrect: false, explanation: 'Not a valid kubectl flag.' },
      ],
    },
    yamlExplanation: [
      { field: 'spec.containers[0].volumeMounts[0].mountPath: /var/log', explanation: 'Used by logging sidecar containers to tail application files if stdout cannot be used directly.' },
    ],
    referenceCheatSheet: [
      'kubectl logs <pod> --tail=100 -f : Follow live streaming logs, showing the last 100 lines',
      'kubectl logs <pod> -c <container> : View logs for a specific container in a pod',
      'kubectl logs -l app=frontend --max-log-requests=10 : Stream aggregated logs from all frontend pods simultaneously',
      'kubectl logs <pod> --previous : View logs from the container instance prior to its latest crash',
    ],
    solutionExplanation: 'Streaming logs to stdout/stderr follows 12-factor principles, allowing centralized log collectors to ingest telemetry seamlessly.',
  },

  'c-monitoring-metrics': {
    commonPitfalls: [
      {
        mistake: 'Relying exclusively on infrastructure metrics (CPU, RAM) while ignoring Golden Signals (Latency, Traffic, Errors, Saturation).',
        whyItHappens: 'CPU and RAM can look healthy while application HTTP 500 errors spike to 100%.',
        fix: 'Instrument code with Prometheus client libraries to emit application-level RED/USE metrics.',
      },
      {
        mistake: 'High cardinality metric labels (e.g. putting user IDs or UUIDs into Prometheus labels).',
        whyItHappens: 'Exploding the time series database memory and crashing Prometheus.',
        fix: 'Never put unbounded dimensions (emails, customer IDs, timestamps) in metric label names.',
      },
    ],
    quizQuestion: {
      question: 'What are the four "Golden Signals" of service monitoring according to the Google SRE Handbook?',
      options: [
        { label: 'A', text: 'Latency, Traffic, Errors, Saturation', isCorrect: true, explanation: 'Correct! These four signals cover how long requests take, demand, failure rates, and system resource limits.' },
        { label: 'B', text: 'CPU, Memory, Disk, Network', isCorrect: false, explanation: 'These are basic host hardware metrics, not application golden signals.' },
        { label: 'C', text: 'Pods, Nodes, Services, Ingress', isCorrect: false, explanation: 'These are Kubernetes API resources.' },
        { label: 'D', text: 'Logs, Metrics, Traces, Events', isCorrect: false, explanation: 'These are telemetry data types.' },
      ],
    },
    yamlExplanation: [
      { field: 'metadata.annotations["prometheus.io/scrape"]: "true"', explanation: 'Standard annotation telling Prometheus to scrape this pod for Prometheus metrics.' },
      { field: 'metadata.annotations["prometheus.io/port"]: "8080"', explanation: 'Specifies which container port exposes the `/metrics` endpoint.' },
    ],
    referenceCheatSheet: [
      'kubectl top pod <name> --containers : View CPU and memory metrics broken down per container',
      'kubectl top node --sort-by=cpu : Find nodes under high compute pressure',
    ],
    solutionExplanation: 'Metrics quantify system performance over time, powering alerting thresholds and autoscaling triggers.',
  },

  'c-monitoring-traces': {
    commonPitfalls: [
      {
        mistake: 'Dropping trace context headers (e.g. `traceparent`, `tracestate`) when making downstream HTTP/gRPC calls.',
        whyItHappens: 'Developers forget to forward W3C trace headers across microservice boundaries, breaking the distributed trace into disconnected fragments.',
        fix: 'Use OpenTelemetry auto-instrumentation or propagate `traceparent` headers in all outbound HTTP client wrappers.',
      },
      {
        mistake: 'Sampling 100% of production traces at scale, overwhelming trace storage and network bandwidth.',
        whyItHappens: 'High-traffic systems generate billions of spans.',
        fix: 'Configure tail-based sampling or probabilistic head sampling (e.g. sample 1% of normal requests, 100% of errors).',
      },
    ],
    quizQuestion: {
      question: 'What is the purpose of distributed tracing in a microservices Kubernetes architecture?',
      options: [
        { label: 'A', text: 'To encrypt network packets between worker nodes.', isCorrect: false, explanation: 'WireGuard or IPsec encrypts network traffic.' },
        { label: 'B', text: 'To track the end-to-end journey of a single user request as it traverses multiple asynchronous microservices and databases.', isCorrect: true, explanation: 'Correct! Distributed tracing reveals latency bottlenecks and pinpoint which microservice caused a failure in complex call trees.' },
        { label: 'C', text: 'To compile Go binaries into container images.', isCorrect: false, explanation: 'Tracing is runtime observability, not a build tool.' },
        { label: 'D', text: 'To auto-scale worker nodes based on hard drive space.', isCorrect: false, explanation: 'Cluster autoscaling is handled by Karpenter or CA.' },
      ],
    },
    yamlExplanation: [
      { field: 'env: - name: OTEL_EXPORTER_OTLP_ENDPOINT', explanation: 'Points OpenTelemetry SDK to the in-cluster OpenTelemetry Collector daemon.' },
    ],
    referenceCheatSheet: [
      'kubectl get pods -l app.kubernetes.io/name=jaeger : Verify Jaeger tracing backend is running',
      'kubectl port-forward svc/jaeger-query 16686:16686 : Open Jaeger tracing UI in your local browser',
    ],
    solutionExplanation: 'Distributed tracing connects disparate microservice calls into unified call graphs, pinpointing latency bottlenecks.',
  },

  'c-monitoring-resource-health': {
    commonPitfalls: [
      {
        mistake: 'Using identical endpoints for both `livenessProbe` and `readinessProbe`.',
        whyItHappens: 'If an external dependency (like a database) slows down, both probes fail, causing Kubernetes to restart all healthy application pods in a cascading crash loop!',
        fix: 'Liveness probes should only check internal process health (deadlocks); readiness probes should check external dependencies and readiness to receive traffic.',
      },
      {
        mistake: 'Omitting `startupProbe` for slow-starting applications (like heavy Java Spring apps).',
        whyItHappens: 'Liveness probes kill the container before it finishes initializing.',
        fix: 'Configure `startupProbe` with generous `failureThreshold` (e.g. 30 failures * 10s = 5 minutes of grace period).',
      },
    ],
    quizQuestion: {
      question: 'If a container in a Pod fails its `readinessProbe`, what action does Kubernetes take?',
      options: [
        { label: 'A', text: 'It terminates and restarts the container process.', isCorrect: false, explanation: 'Restarting is triggered by liveness probes, NOT readiness probes.' },
        { label: 'B', text: 'It temporarily removes the Pod IP from all matching Service Endpoints, stopping incoming traffic without restarting the container.', isCorrect: true, explanation: 'Correct! Readiness probes control traffic routing: if they fail, the pod is unrouted until it recovers, preventing customer error spikes.' },
        { label: 'C', text: 'It drains the worker node and terminates the VM.', isCorrect: false, explanation: 'Readiness failures do not impact the node.' },
        { label: 'D', text: 'It deletes the container image from the node cache.', isCorrect: false, explanation: 'Images remain cached.' },
      ],
    },
    yamlExplanation: [
      { field: 'livenessProbe.httpGet', explanation: 'Kubelet checks this endpoint periodically; if it fails consecutively, kubelet kills and restarts the container.' },
      { field: 'readinessProbe.periodSeconds: 5', explanation: 'Frequency (in seconds) with which kubelet tests if the pod is ready to accept traffic.' },
      { field: 'startupProbe.failureThreshold: 30', explanation: 'Allows slow-initializing applications up to 30 failures before handing over to the liveness probe.' },
    ],
    referenceCheatSheet: [
      'kubectl describe pod <name> | grep -A 10 Conditions : Inspect Ready, Initialized, and ContainersReady status',
      'kubectl describe pod <name> | grep -i probe : Check recent probe failure error messages and HTTP codes',
    ],
    solutionExplanation: 'The trifecta of startup, liveness, and readiness probes provides comprehensive health monitoring and zero-downtime traffic management.',
  },

  'c-observability-engines': {
    commonPitfalls: [
      {
        mistake: 'Storing Prometheus time-series data on node ephemeral storage (`emptyDir`).',
        whyItHappens: 'When the Prometheus pod restarts, all historical metrics and graphs are permanently lost.',
        fix: 'Back Prometheus with PersistentVolumes (EBS, Persistent Disk) or send metrics to remote write storage (Cortex, Thanos, Mimir).',
      },
      {
        mistake: 'Running un-clustered logging solutions that drop messages during high-volume traffic bursts.',
        whyItHappens: 'Direct socket logging without backpressure buffers.',
        fix: 'Use backpressure buffers (e.g. Vector, Kafka) between log collectors and indexers.',
      },
    ],
    quizQuestion: {
      question: 'Which popular open-source project provides a unified, vendor-neutral telemetry collection framework across metrics, logs, and distributed traces?',
      options: [
        { label: 'A', text: 'OpenTelemetry (OTel)', isCorrect: true, explanation: 'Correct! OpenTelemetry is the second highest velocity CNCF project after Kubernetes, standardizing APIs, SDKs, and collectors.' },
        { label: 'B', text: 'Syslog-ng', isCorrect: false, explanation: 'Syslog is an older logging protocol, not a unified telemetry standard.' },
        { label: 'C', text: 'Nagios Core', isCorrect: false, explanation: 'Nagios is legacy polling monitoring.' },
        { label: 'D', text: 'Apache Kafka', isCorrect: false, explanation: 'Kafka is a streaming event log, not an observability API framework.' },
      ],
    },
    yamlExplanation: [
      { field: 'spec.serviceMonitorSelector', explanation: 'Prometheus Operator CRD field selecting which microservices to dynamically scrape metrics from.' },
    ],
    referenceCheatSheet: [
      'kubectl get pods -A -l app.kubernetes.io/part-of=kube-prometheus-stack : Check full monitoring stack status',
      'kubectl get servicemonitors -A : List active Prometheus Operator scraping targets',
    ],
    solutionExplanation: 'Modern observability engines unite metrics, logs, and traces into holistic dashboards and automated alerts.',
  },
};
