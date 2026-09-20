import type { KubePitfall, KubeQuizQuestion, KubeYamlFieldExplanation } from './types';
import type { ConceptEnrichment } from './enrichment_part1';

export const PART_2_ENRICHMENT: Record<string, ConceptEnrichment> = {
  'c-pods-running-apps': {
    commonPitfalls: [
      {
        mistake: 'Putting multiple unrelated application services inside a single Pod.',
        whyItHappens: 'Treating a Pod like a full VM and packing frontend, backend, and redis into one Pod.',
        fix: 'Follow the single-responsibility rule: One main application container per Pod. Multi-container pods should strictly be for helper sidecars (proxies, log shippers).',
      },
      {
        mistake: 'Deploying naked Pods in production without a managing controller (Deployment/StatefulSet).',
        whyItHappens: 'Running `kubectl run nginx --image=nginx` directly.',
        fix: 'If a node hosting a naked Pod dies, Kubernetes will NEVER resurrect or reschedule it. Always wrap Pods in a Deployment.',
      },
    ],
    quizQuestion: {
      question: 'Two containers running in the SAME Kubernetes Pod want to communicate. How should container A reach container B over HTTP?',
      options: [
        { label: 'A', text: 'Via the cluster public IP address through the Ingress controller.', isCorrect: false, explanation: 'Traffic between containers in the same pod does not exit the pod.' },
        { label: 'B', text: 'Over `localhost` using the destination port number (e.g. `http://localhost:8080`).', isCorrect: true, explanation: 'Correct! All containers in a single Pod share the same Linux Network namespace and IP address, so they communicate directly over localhost.' },
        { label: 'C', text: 'By querying CoreDNS for the other container name.', isCorrect: false, explanation: 'CoreDNS resolves Service names and Pod IPs, not individual container names.' },
        { label: 'D', text: 'Through an external cloud load balancer.', isCorrect: false, explanation: 'Localhost communication requires zero external hops.' },
      ],
    },
    yamlExplanation: [
      { field: 'spec.containers[].ports[].containerPort', explanation: 'Documents which network port the application process listens on inside the container.' },
      { field: 'spec.containers[].resources.requests', explanation: 'Minimum CPU and memory required; used by kube-scheduler to choose a node with adequate capacity.' },
      { field: 'spec.restartPolicy', explanation: 'Policy for restarting containers (Always, OnFailure, Never); defaults to Always for Pods in Deployments.' },
    ],
    referenceCheatSheet: [
      'kubectl get pods -o wide : View pod status, node assignment, and internal IP address',
      'kubectl describe pod <name> : Inspect event logs, probe failures, and container states',
      'kubectl logs <name> -c <container> : View logs for a specific container in a multi-container pod',
      'kubectl exec -it <name> -- sh : Open an interactive shell inside a running pod',
    ],
    solutionExplanation: 'Pods are the smallest deployable atomic units in Kubernetes, encapsulating 1+ containers sharing network namespaces and storage volumes.',
  },

  'c-replicasets-desired-state': {
    commonPitfalls: [
      {
        mistake: 'Directly creating and managing ReplicaSets manually instead of using Deployments.',
        whyItHappens: 'Forgetting that ReplicaSets do not support declarative rolling updates or rollback history.',
        fix: 'Always manage ReplicaSets through Deployments; Deployments automatically create and roll over ReplicaSets.',
      },
      {
        mistake: 'Mismatched label selectors causing the ReplicaSet to adopt or orphan unintended pods.',
        whyItHappens: 'Reusing common labels like `app: web` across different workloads.',
        fix: 'Ensure `spec.selector.matchLabels` uniquely identifies the workload.',
      },
    ],
    quizQuestion: {
      question: 'What is the primary function of a Kubernetes ReplicaSet controller?',
      options: [
        { label: 'A', text: 'To build container images from source code git repositories.', isCorrect: false, explanation: 'CI/CD pipelines build images, not ReplicaSets.' },
        { label: 'B', text: 'To maintain a stable, specified number of identical replica Pods running at any given time.', isCorrect: true, explanation: 'Correct! The ReplicaSet controller continuously monitors the cluster to ensure that the count of running pods matches `spec.replicas`.' },
        { label: 'C', text: 'To route ingress HTTP traffic across DNS zones.', isCorrect: false, explanation: 'Services and Ingress handle traffic routing.' },
        { label: 'D', text: 'To dynamically resize physical hard disks.', isCorrect: false, explanation: 'CSI drivers manage volume resizing.' },
      ],
    },
    yamlExplanation: [
      { field: 'spec.replicas: 3', explanation: 'Target count of active pods maintained by the reconciliation loop.' },
      { field: 'spec.selector.matchLabels', explanation: 'Query used by the ReplicaSet to count how many matching pods currently exist.' },
    ],
    referenceCheatSheet: [
      'kubectl get rs : List active ReplicaSets and their desired, current, and ready pod counts',
      'kubectl describe rs <name> : View replica failure events and scheduling issues',
      'kubectl scale rs <name> --replicas=5 : Imperatively adjust replica count (for testing only)',
    ],
    solutionExplanation: 'ReplicaSets enforce self-healing cardinality: if a pod crashes or a node dies, the ReplicaSet immediately creates a replacement.',
  },

  'c-deployments-workloads': {
    commonPitfalls: [
      {
        mistake: 'Updating an image tag with `:latest` and wondering why the Deployment does not trigger a rolling update.',
        whyItHappens: 'Kubernetes only rolls out a new ReplicaSet when the Pod template specification changes. Since `:latest` is unchanged text, nothing happens.',
        fix: 'Always use versioned tags (`:v1.2.0`) or update an annotation timestamp to force a rollout.',
      },
      {
        mistake: 'Setting `maxUnavailable: 100%` during a rolling update.',
        whyItHappens: 'Accidentally terminating all existing pods before new pods are ready, resulting in total downtime.',
        fix: 'Keep `maxUnavailable` at default `25%` (or `0` for zero-downtime safety) and ensure readiness probes pass.',
      },
    ],
    quizQuestion: {
      question: 'During a rolling update of a Deployment, how does Kubernetes know that a new Pod is healthy enough to receive traffic before terminating an old Pod?',
      options: [
        { label: 'A', text: 'It simply waits 5 seconds after container startup.', isCorrect: false, explanation: 'Time-based waiting is fragile and does not verify app readiness.' },
        { label: 'B', text: 'It evaluates the container Readiness Probe (`spec.containers[].readinessProbe`).', isCorrect: true, explanation: 'Correct! A container is only marked Ready and added to Service endpoints when its readiness probe succeeds.' },
        { label: 'C', text: 'The developer must approve each pod manually in the terminal.', isCorrect: false, explanation: 'Deployments automate zero-downtime rollouts autonomously.' },
        { label: 'D', text: 'It queries CPU usage to verify the app is not idle.', isCorrect: false, explanation: 'CPU usage does not indicate application HTTP health.' },
      ],
    },
    yamlExplanation: [
      { field: 'spec.strategy.type: RollingUpdate', explanation: 'Sequentially replaces old pods with new ones without taking the application offline.' },
      { field: 'spec.revisionHistoryLimit: 10', explanation: 'Specifies how many old ReplicaSets are retained to enable `kubectl rollout undo`.' },
      { field: 'readinessProbe.httpGet', explanation: 'HTTP health check executed by kubelet; traffic only flows once this probe returns 200-399.' },
    ],
    referenceCheatSheet: [
      'kubectl rollout status deployment/<name> : Watch live progress of a rollout',
      'kubectl rollout history deployment/<name> : View all previous deployment revisions',
      'kubectl rollout undo deployment/<name> --to-revision=2 : Roll back instantly to revision 2',
      'kubectl rollout pause deployment/<name> : Pause an in-flight deployment for canary inspection',
    ],
    solutionExplanation: 'Deployments provide declarative updates for Pods and ReplicaSets, managing revisions, rollouts, rollbacks, and scale.',
  },

  'c-statefulsets-persistent-apps': {
    commonPitfalls: [
      {
        mistake: 'Deploying a distributed database (Cassandra, PostgreSQL) as a Deployment instead of a StatefulSet.',
        whyItHappens: 'Deployments create interchangeable ephemeral pods with random hashes (`web-7f89d-4kx9l`), which breaks clustered quorum.',
        fix: 'StatefulSets provide stable, predictable network identities (`db-0`, `db-1`, `db-2`) and dedicated volume mounts.',
      },
      {
        mistake: 'Expecting deleting a StatefulSet to automatically delete its PersistentVolumeClaims (PVCs).',
        whyItHappens: 'Safety mechanism: Kubernetes deliberately preserves PVCs when StatefulSets are deleted to prevent catastrophic data loss.',
        fix: 'PVCs must be deleted explicitly after verifying database backups.',
      },
    ],
    quizQuestion: {
      question: 'What unique naming convention does a StatefulSet use for its created Pods?',
      options: [
        { label: 'A', text: 'Random alphanumeric hashes like `web-76d54c-x98qz`.', isCorrect: false, explanation: 'Random hashes are used by Deployments and ReplicaSets.' },
        { label: 'B', text: 'Deterministic ordinal indices from 0 to N-1, such as `redis-0`, `redis-1`, `redis-2`.', isCorrect: true, explanation: 'Correct! StatefulSets guarantee predictable ordinal identities that persist across pod rescheduling and node reboots.' },
        { label: 'C', text: 'IP addresses like `pod-10-244-1-5`.', isCorrect: false, explanation: 'Pod IPs can change upon restart; ordinal names remain constant.' },
        { label: 'D', text: 'UUIDs assigned by the Linux kernel.', isCorrect: false, explanation: 'Kubernetes manages ordinal names at the API level.' },
      ],
    },
    yamlExplanation: [
      { field: 'serviceName: "db-headless"', explanation: 'Name of the Headless Service (clusterIP: None) governing the network identity of the stateful pods.' },
      { field: 'volumeClaimTemplates', explanation: 'Provisions a dedicated, independent PersistentVolumeClaim for each ordinal pod replica.' },
    ],
    referenceCheatSheet: [
      'kubectl get statefulsets : List StatefulSets and their current replica status',
      'kubectl scale statefulset <name> --replicas=3 : Scale stateful workloads in ordered sequence (0, 1, 2...)',
      'kubectl get pvc -l app=db : Inspect storage volumes bound to specific stateful pod ordinals',
    ],
    solutionExplanation: 'StatefulSets manage stateful applications requiring unique network identifiers, ordered deployment and scaling, and persistent storage per replica.',
  },

  'c-jobs-batch-processing': {
    commonPitfalls: [
      {
        mistake: 'Using `restartPolicy: Always` inside a Job specification.',
        whyItHappens: 'Always is the default for Deployments, but Jobs require `OnFailure` or `Never` because they are designed to run to completion.',
        fix: 'Explicitly set `spec.template.spec.restartPolicy: OnFailure` or `Never` in all Job specs.',
      },
      {
        mistake: 'Leaving completed Jobs in the cluster forever without setting `ttlSecondsAfterFinished`.',
        whyItHappens: 'Finished pods clutter the cluster API and etcd storage.',
        fix: 'Specify `spec.ttlSecondsAfterFinished: 300` to automatically clean up finished Jobs after 5 minutes.',
      },
    ],
    quizQuestion: {
      question: 'What is the primary difference between a Kubernetes Pod managed by a Deployment vs a Pod managed by a Job?',
      options: [
        { label: 'A', text: 'Deployment pods cannot connect to storage volumes.', isCorrect: false, explanation: 'Both can mount volumes.' },
        { label: 'B', text: 'A Deployment runs long-lived daemon services continuously; a Job runs batch tasks until completion (exit code 0).', isCorrect: true, explanation: 'Correct! Jobs track pod exits and terminate once `completions` succeed, whereas Deployments restart pods if they exit.' },
        { label: 'C', text: 'Jobs cannot run multi-container pods.', isCorrect: false, explanation: 'Jobs support multi-container pods and initContainers.' },
        { label: 'D', text: 'Deployments require GPU nodes while Jobs run on CPU.', isCorrect: false, explanation: 'Both can run on any node architecture.' },
      ],
    },
    yamlExplanation: [
      { field: 'spec.completions: 3', explanation: 'Specifies that 3 successful pod completions are required for the Job to be marked finished.' },
      { field: 'spec.parallelism: 2', explanation: 'Specifies the maximum number of pods that can run simultaneously.' },
      { field: 'spec.backoffLimit: 4', explanation: 'Number of retries before considering the Job as failed.' },
    ],
    referenceCheatSheet: [
      'kubectl get jobs : View status of running and completed batch workloads',
      'kubectl describe job <name> : Inspect job start time, duration, and completion count',
      'kubectl create job --from=cronjob/<name> <job-name> : Manually trigger an ad-hoc run of a CronJob',
    ],
    solutionExplanation: 'Jobs supervise short-lived batch tasks, database migrations, and report generators until successful completion.',
  },

  'c-why-networking-needed': {
    commonPitfalls: [
      {
        mistake: 'Relying on hardcoded Pod IP addresses for microservice communication.',
        whyItHappens: 'Pod IPs are ephemeral; whenever a Pod is restarted or rescheduled, its IP address changes.',
        fix: 'Always communicate via Kubernetes Services (`http://my-service.default.svc.cluster.local`) instead of raw Pod IPs.',
      },
      {
        mistake: 'CIDR block overlap between Pod subnet and the host corporate network/VPC.',
        whyItHappens: 'Choosing common ranges like `10.0.0.0/16` without coordinating with cloud networking teams.',
        fix: 'Ensure Pod CIDR, Service CIDR, and VPC CIDRs are non-overlapping.',
      },
    ],
    quizQuestion: {
      question: 'What is the foundational networking rule that all Kubernetes CNI plugins MUST satisfy across the entire cluster?',
      options: [
        { label: 'A', text: 'All pods must share a single public IPv4 address through NAT.', isCorrect: false, explanation: 'Pods do not NAT each other.' },
        { label: 'B', text: 'Every Pod receives its own unique IP address and can communicate with all other Pods without NAT.', isCorrect: true, explanation: 'Correct! The Kubernetes IP-per-Pod model mandates that every pod gets a unique IP address that is directly routable from any other pod without Network Address Translation.' },
        { label: 'C', text: 'Pods cannot talk to other pods unless an external proxy is deployed.', isCorrect: false, explanation: 'Direct Pod-to-Pod communication is a fundamental cluster requirement.' },
        { label: 'D', text: 'Worker nodes must not communicate with the control plane over TCP.', isCorrect: false, explanation: 'TCP/TLS is required between nodes and apiserver.' },
      ],
    },
    yamlExplanation: [
      { field: 'spec.containers[].ports[].name: http', explanation: 'Assigning a symbolic name to a port allows Services to reference it dynamically without hardcoded port numbers.' },
    ],
    referenceCheatSheet: [
      'kubectl get pods -o wide : View dynamic IP addresses assigned to every active pod',
      'ip route : View node-level kernel routing tables for pod subnets',
      'traceroute <pod-ip> : Trace network hops between cluster nodes',
    ],
    solutionExplanation: 'The Kubernetes network model eliminates port-allocation friction by giving every Pod its own unique routable IP address.',
  },

  'c-k8s-services-clusterip': {
    commonPitfalls: [
      {
        mistake: 'Mismatched `port` vs `targetPort` in the Service specification.',
        whyItHappens: '`port` is what the Service exposes inside the cluster; `targetPort` is the port your app container listens on.',
        fix: 'Verify container listening port matches `spec.ports[].targetPort`.',
      },
      {
        mistake: 'Mismatched label selector in Service spec resulting in `<none>` under Endpoints.',
        whyItHappens: 'Typo in `spec.selector` causes the Service to find zero pods.',
        fix: 'Run `kubectl get endpoints <service-name>`. If endpoints is empty, check `spec.selector` vs `pod.metadata.labels`.',
      },
    ],
    quizQuestion: {
      question: 'What is the default Service `type` in Kubernetes if none is specified?',
      options: [
        { label: 'A', text: 'NodePort', isCorrect: false, explanation: 'NodePort must be explicitly configured.' },
        { label: 'B', text: 'ClusterIP', isCorrect: true, explanation: 'Correct! ClusterIP assigns a virtual internal IP accessible only from within the cluster.' },
        { label: 'C', text: 'LoadBalancer', isCorrect: false, explanation: 'LoadBalancer provisions cloud infrastructure and is not the default.' },
        { label: 'D', text: 'ExternalName', isCorrect: false, explanation: 'ExternalName maps to external DNS CNAMEs.' },
      ],
    },
    yamlExplanation: [
      { field: 'spec.type: ClusterIP', explanation: 'Creates a virtual IP reachable only by workloads inside the cluster.' },
      { field: 'spec.ports[0].port: 80', explanation: 'The port exposed by the Service virtual IP.' },
      { field: 'spec.ports[0].targetPort: 8080', explanation: 'The destination port where the container process is listening.' },
      { field: 'spec.selector', explanation: 'Picks pods with matching labels to populate the Endpoints/EndpointSlices list.' },
    ],
    referenceCheatSheet: [
      'kubectl get svc : List services, cluster IPs, and external port mappings',
      'kubectl get endpoints <svc> : Check which pod IPs are currently receiving traffic for this service',
      'kubectl describe svc <svc> : Inspect target ports and selector queries',
    ],
    solutionExplanation: 'A Service acts as a durable internal L4 reverse-proxy with a stable IP and DNS entry, load-balancing traffic across ephemeral Pods.',
  },

  'c-external-access-ingress': {
    commonPitfalls: [
      {
        mistake: 'Using `NodePort` for external production user traffic.',
        whyItHappens: 'NodePorts expose high ports (30000-32767) on all node host IPs, which is insecure and unmaintainable.',
        fix: 'Use an Ingress Controller or LoadBalancer with TLS termination and proper WAF protection.',
      },
      {
        mistake: 'Creating a separate `LoadBalancer` Service for every microservice, multiplying cloud costs.',
        whyItHappens: 'Each cloud LoadBalancer incurs hourly hyperscaler infrastructure charges ($20-$50/month each).',
        fix: 'Deploy ONE Ingress Controller behind a single LoadBalancer, and route traffic to hundreds of services via path/host rules.',
      },
    ],
    quizQuestion: {
      question: 'What is the default port range reserved for `NodePort` services across all Kubernetes worker nodes?',
      options: [
        { label: 'A', text: '80 to 443', isCorrect: false, explanation: 'Standard HTTP/HTTPS ports are too low for safe non-privileged node allocation.' },
        { label: 'B', text: '30000 to 32767', isCorrect: true, explanation: 'Correct! Kubernetes reserves 30000-32767 for NodePort allocations by default.' },
        { label: 'C', text: '1024 to 2048', isCorrect: false, explanation: 'Standard Linux user ports are not reserved by K8s.' },
        { label: 'D', text: '8000 to 9000', isCorrect: false, explanation: 'Common app ports are not the NodePort range.' },
      ],
    },
    yamlExplanation: [
      { field: 'spec.rules[].host: api.example.com', explanation: 'Virtual host routing; Ingress inspects HTTP Host header to forward traffic.' },
      { field: 'spec.rules[].http.paths[].path: /v1', explanation: 'URI path-based routing directing traffic to specific backend microservices.' },
    ],
    referenceCheatSheet: [
      'kubectl get ingress : View public hosts, paths, and load balancer IP assignments',
      'kubectl get svc -o wide : Check external IPs assigned by cloud providers to LoadBalancers',
      'kubectl port-forward svc/<name> 8080:80 : Securely tunnel cluster traffic to your local laptop',
    ],
    solutionExplanation: 'Ingress and LoadBalancers bridge external client requests to internal cluster services with SSL termination and path routing.',
  },

  'c-load-balancing-endpoints': {
    commonPitfalls: [
      {
        mistake: 'Assuming kube-proxy performs smart application-layer (HTTP L7) load balancing.',
        whyItHappens: 'kube-proxy operates strictly at Layer 4 (TCP/UDP); it cannot inspect HTTP headers, cookies, or gRPC multiplexing.',
        fix: 'For gRPC or sticky HTTP sessions, use an Ingress Controller (like Envoy/NGINX) or a Service Mesh (Istio, Linkerd).',
      },
      {
        mistake: 'Stale endpoints due to pods not receiving SIGTERM or shutting down before iptables rules update.',
        whyItHappens: 'Clients get HTTP 502 errors during rolling updates.',
        fix: 'Add a `preStop` sleep hook (e.g. `sleep 5`) to give kube-proxy time to remove the pod IP from iptables.',
      },
    ],
    quizQuestion: {
      question: 'Which scalable Kubernetes resource replaced the monolithic `Endpoints` object to support clusters with thousands of pods per Service?',
      options: [
        { label: 'A', text: 'EndpointSlice', isCorrect: true, explanation: 'Correct! EndpointSlice breaks backend pod endpoints into smaller chunks (default 100 per slice), dramatically reducing API server network overhead.' },
        { label: 'B', text: 'IPVS Tables', isCorrect: false, explanation: 'IPVS is a kernel proxy mode, not a Kubernetes API resource.' },
        { label: 'C', text: 'ServiceMeshConfig', isCorrect: false, explanation: 'Not a standard Kubernetes API resource.' },
        { label: 'D', text: 'CoreDNS Records', isCorrect: false, explanation: 'CoreDNS handles DNS name resolution, not endpoint management.' },
      ],
    },
    yamlExplanation: [
      { field: 'mode: ipvs', explanation: 'Configures kube-proxy to use IPVS kernel hash tables instead of linear iptables chains for O(1) performance.' },
    ],
    referenceCheatSheet: [
      'kubectl get endpointslices : Inspect EndpointSlices and their backend pod address counts',
      'kubectl logs -n kube-system -l k8s-app=kube-proxy : Check kube-proxy operational logs',
      'ipvsadm -ln : Inspect kernel IPVS load balancing tables on a worker node',
    ],
    solutionExplanation: 'kube-proxy translates Service virtual IPs to healthy Pod IP addresses via iptables or IPVS kernel rules.',
  },

  'c-pod-to-pod-networking': {
    commonPitfalls: [
      {
        mistake: 'Assuming Pod-to-Pod traffic is encrypted over the wire by default.',
        whyItHappens: 'Believing the private cluster network overlay provides automatic encryption.',
        fix: 'Default CNI overlays send packets in plain text. For in-transit encryption, use WireGuard/IPsec (supported in Cilium/Calico) or mTLS via a service mesh.',
      },
      {
        mistake: 'Ignoring MTU mismatches on cloud networks causing silent packet drops on large payloads.',
        whyItHappens: 'Overlay encapsulation (VXLAN/Geneve) adds 50 bytes of overhead; if CNI MTU matches host MTU, packets fragment or drop.',
        fix: 'Configure CNI MTU to host MTU minus encapsulation overhead (e.g. 1450 on 1500 MTU networks).',
      },
    ],
    quizQuestion: {
      question: 'How do Pods in a Kubernetes cluster locate other services via standard DNS names like `auth-service.production`?',
      options: [
        { label: 'A', text: 'Every pod maintains a static `/etc/hosts` file updated by the developer.', isCorrect: false, explanation: 'Static hosts files are impossible to maintain across dynamic clusters.' },
        { label: 'B', text: 'Pods query CoreDNS, which continuously watches the Kubernetes API and translates Service names to ClusterIPs.', isCorrect: true, explanation: 'Correct! CoreDNS runs inside the cluster and dynamically maintains DNS records for all Services and Pods.' },
        { label: 'C', text: 'By querying Google Public DNS (8.8.8.8).', isCorrect: false, explanation: 'Public DNS knows nothing about internal cluster private domains.' },
        { label: 'D', text: 'The Linux kernel broadcasts ARP packets over the internet.', isCorrect: false, explanation: 'Broadcasts are confined to local subnets.' },
      ],
    },
    yamlExplanation: [
      { field: 'dnsPolicy: ClusterFirst', explanation: 'Directs queries to CoreDNS first before forwarding external queries to upstream resolvers.' },
    ],
    referenceCheatSheet: [
      'kubectl get pods -n kube-system -l k8s-app=kube-dns : Verify CoreDNS pods are running healthy',
      'kubectl exec -it <pod> -- nslookup <service> : Test in-cluster DNS resolution from within a pod',
      'kubectl logs -n kube-system -l k8s-app=kube-dns : Inspect CoreDNS resolution error logs',
    ],
    solutionExplanation: 'Direct routability and dynamic in-cluster DNS enable seamless, decoupled microservice discovery.',
  },

  'c-configuration-in-k8s': {
    commonPitfalls: [
      {
        mistake: 'Baking environment-specific configurations (dev/stage/prod database URLs) directly into the container image.',
        whyItHappens: 'Violating the 12-Factor App methodology: Build once, deploy anywhere.',
        fix: 'Keep container images completely generic; inject configuration at runtime using ConfigMaps and Secrets.',
      },
      {
        mistake: 'Checking API keys, tokens, or passwords into public or private Git repositories.',
        whyItHappens: 'Convenience during initial prototyping leads to leaked credentials.',
        fix: 'Use external secret managers (HashiCorp Vault, AWS Secrets Manager) and tools like External Secrets Operator.',
      },
    ],
    quizQuestion: {
      question: 'According to 12-Factor Application design in Kubernetes, where should application configuration be injected?',
      options: [
        { label: 'A', text: 'Hardcoded into the source code repository.', isCorrect: false, explanation: 'Hardcoded config prevents deploying the same image across dev and prod.' },
        { label: 'B', text: 'Injected at container runtime via environment variables or mounted configuration files.', isCorrect: true, explanation: 'Correct! Strict separation of config from code allows the same container image to run in Dev, Staging, and Production unchanged.' },
        { label: 'C', text: 'Stored on the developer laptop and pushed over SSH.', isCorrect: false, explanation: 'Violates infrastructure-as-code and security principles.' },
        { label: 'D', text: 'Compiled into the operating system kernel.', isCorrect: false, explanation: 'Kernels manage hardware, not application business logic.' },
      ],
    },
    yamlExplanation: [
      { field: 'envFrom:\n- configMapRef: { name: app-config }', explanation: 'Injects all key-value pairs from the ConfigMap as environment variables in one declaration.' },
    ],
    referenceCheatSheet: [
      'kubectl explain pod.spec.containers.env : View all ways to inject environment variables into containers',
      'kubectl get cm,secret -A : View all configuration and secret objects across the cluster',
      'kubectl create cm app-config --from-literal=ENV=production : Quick CLI ConfigMap creation',
    ],
    solutionExplanation: 'Decoupling application code from runtime configuration enables identical, immutable container images across environments.',
  },

  'c-configmaps-configuration': {
    commonPitfalls: [
      {
        mistake: 'Expecting environment variables injected from a ConfigMap to automatically update when the ConfigMap is modified.',
        whyItHappens: 'Linux process environment variables are immutable once the process starts.',
        fix: 'To update env vars, restart the pods (`kubectl rollout restart deployment/<name>`). Mounted volumes, however, update automatically within ~60 seconds.',
      },
      {
        mistake: 'Storing passwords, database credentials, or private keys inside a ConfigMap.',
        whyItHappens: 'ConfigMaps are stored as unencrypted plain text in etcd and visible to anyone with read access.',
        fix: 'Use Kubernetes Secrets or external secret vaults for all sensitive data.',
      },
    ],
    quizQuestion: {
      question: 'When a ConfigMap is mounted into a Pod as a volume (`spec.volumes[].configMap`), what happens when the ConfigMap is updated in Kubernetes?',
      options: [
        { label: 'A', text: 'The mounted files in the container filesystem are eventually updated automatically without restarting the Pod.', isCorrect: true, explanation: 'Correct! The kubelet periodically syncs mounted ConfigMap volumes using atomic symlink swaps, usually updating within a minute.' },
        { label: 'B', text: 'The Pod immediately crashes and terminates.', isCorrect: false, explanation: 'ConfigMap updates do not crash pods.' },
        { label: 'C', text: 'Nothing happens until the physical server is rebooted.', isCorrect: false, explanation: 'Kubernetes does not require node reboots for configuration updates.' },
        { label: 'D', text: 'The container filesystem is corrupted.', isCorrect: false, explanation: 'Atomic symlinks prevent partial writes or corruption.' },
      ],
    },
    yamlExplanation: [
      { field: 'data: config.json: |', explanation: 'Embeds complete multiline configuration files into the ConfigMap object.' },
      { field: 'volumeMounts[0].mountPath: /etc/config', explanation: 'Directory path inside the container where ConfigMap keys will appear as individual files.' },
    ],
    referenceCheatSheet: [
      'kubectl create configmap my-config --from-file=config.properties : Create ConfigMap from a local file',
      'kubectl get configmap <name> -o yaml : View full key-value pairs in a ConfigMap',
      'kubectl describe configmap <name> : Inspect data keys and metadata',
    ],
    solutionExplanation: 'ConfigMaps store non-sensitive configuration data as key-value pairs or complete configuration files.',
  },

  'c-secrets-configuration': {
    commonPitfalls: [
      {
        mistake: 'Believing that standard Kubernetes Secrets are encrypted by default.',
        whyItHappens: 'Kubernetes Secrets are merely Base64 ENCODED, not encrypted. Anyone who can read the Secret can run `base64 -d` to read plain text.',
        fix: 'Enable Encryption-at-Rest for etcd in the API server, use KMS providers (AWS KMS, GCP KMS), and enforce RBAC least privilege.',
      },
      {
        mistake: 'Committing Base64 encoded Kubernetes Secret YAML manifests to Git repositories.',
        whyItHappens: 'Engineers think Base64 is encryption.',
        fix: 'Use Sealed Secrets, SOPS (Mozilla SOPS), or External Secrets Operator to keep secrets safe in Git.',
      },
    ],
    quizQuestion: {
      question: 'What encoding scheme does Kubernetes use by default for the `data` field in a Secret manifest?',
      options: [
        { label: 'A', text: 'AES-256 GCM encryption.', isCorrect: false, explanation: 'Manifests in YAML are not encrypted by default.' },
        { label: 'B', text: 'Base64 encoding.', isCorrect: true, explanation: 'Correct! Secret data is Base64 encoded to safely store binary and multiline strings in JSON/YAML; it is NOT encryption.' },
        { label: 'C', text: 'RSA public key cryptography.', isCorrect: false, explanation: 'RSA is used for certificates, not YAML serialization.' },
        { label: 'D', text: 'Plain MD5 hashing.', isCorrect: false, explanation: 'MD5 is a one-way hash, not a reversible encoding.' },
      ],
    },
    yamlExplanation: [
      { field: 'stringData: DB_PASS: "SuperSecret!"', explanation: 'Convenient write-only field that allows inputting plain text; Kubernetes automatically Base64 encodes it upon submission.' },
      { field: 'type: Opaque', explanation: 'Default generic secret type for arbitrary user-defined sensitive data.' },
    ],
    referenceCheatSheet: [
      'kubectl create secret generic db-secret --from-literal=password=p@ssword : Create secret imperatively',
      'echo -n "my-pass" | base64 : Manually encode a string for use in a Secret manifest',
      'kubectl get secret <name> -o jsonpath="{.data.password}" | base64 -d : Decode secret value for verification',
    ],
    solutionExplanation: 'Secrets manage sensitive credentials, tokens, and keys with fine-grained RBAC access control and optional etcd KMS encryption.',
  },
};
