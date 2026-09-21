import type { KubeConcept } from '../topics/types';
import type { TopicFlowDiagramData, FlowBlock, FlowConnection, FlowStep } from '../../components/diagrams/kubeDiagramTypes';

// --- CHAPTER 1: POD BASICS & RUNTIME ARCHITECTURE ---
const CHAPTER_1_FLOW: (c: KubeConcept) => TopicFlowDiagramData = (c) => ({
  chapterNumber: 1,
  chapterTitle: 'Pod Architecture & Container Runtime',
  conceptNumber: c.number,
  conceptTitle: c.title,
  architectureType: 'Pod Lifecycle & Low-Level Runtime Plumbing',
  architecturalSummary:
    'Shows how a declarative Pod manifest travels from client submission through the Kubernetes Control Plane (API Server, etcd, Scheduler) to the host node where Kubelet and Containerd (CRI) initialize the Pause container (netns/IPC) and launch application containers.',
  blocks: [
    {
      id: 'client-kubectl',
      label: 'kubectl Client',
      sublabel: 'CLI / CI Pipeline',
      category: 'client',
      icon: 'terminal',
      portOrProtocol: 'HTTPS / TLS',
      statusText: 'Originator',
      details: {
        role: 'Packages and serializes declarative YAML manifests and submits HTTP requests to the cluster API.',
        processName: 'kubectl',
        cliDiagnostic: 'kubectl apply -f pod.yaml -v=8',
        configLocation: '~/.kube/config',
        keyInsight: 'Communicates strictly over HTTPS with client certificate or bearer token authentication.',
      },
    },
    {
      id: 'kube-apiserver',
      label: 'kube-apiserver',
      sublabel: 'Control Plane Gateway',
      category: 'control-plane',
      icon: 'server',
      portOrProtocol: ':6443 HTTPS',
      statusText: 'Gatekeeper',
      details: {
        role: 'Validates schema, authenticates identity, enforces RBAC, runs admission webhooks, and serves as the single source of truth.',
        processName: 'kube-apiserver',
        cliDiagnostic: 'kubectl get --raw /livez',
        configLocation: '/etc/kubernetes/manifests/kube-apiserver.yaml',
        keyInsight: 'Stateless. Only component in the entire cluster that directly reads and writes to etcd.',
      },
    },
    {
      id: 'etcd-db',
      label: 'etcd Storage',
      sublabel: 'Distributed Raft Key-Value',
      category: 'storage',
      icon: 'database',
      portOrProtocol: ':2379 Raft / gRPC',
      statusText: 'Consensus Store',
      details: {
        role: 'Persists cluster state, resource specifications, and object metadata using Raft consensus protocol.',
        processName: 'etcd',
        cliDiagnostic: 'etcdctl endpoint health --write-out=table',
        configLocation: '/var/lib/etcd',
        keyInsight: 'Requires quorum ((N/2)+1 nodes) to accept writes. All cluster state changes are logged sequentially.',
      },
    },
    {
      id: 'kube-scheduler',
      label: 'kube-scheduler',
      sublabel: 'Workload Placement Engine',
      category: 'control-plane',
      icon: 'cpu',
      portOrProtocol: ':10259 HTTPS',
      statusText: 'Evaluator',
      details: {
        role: 'Watches for unscheduled Pods (spec.nodeName is empty), filters candidate nodes, scores them, and assigns the optimal node.',
        processName: 'kube-scheduler',
        cliDiagnostic: 'kubectl get events --field-selector reason=Scheduled',
        configLocation: '/etc/kubernetes/manifests/kube-scheduler.yaml',
        keyInsight: 'Operates in two primary phases: Filtering (predicates) and Scoring (priorities).',
      },
    },
    {
      id: 'kubelet-agent',
      label: 'Kubelet Node Agent',
      sublabel: 'Node Supervisor Daemon',
      category: 'node',
      icon: 'shield',
      portOrProtocol: ':10250 gRPC',
      statusText: 'Node Pilot',
      details: {
        role: 'Monitors the API Server for Pods assigned to this node, drives container lifecycle, volume mounts, and probe health checks.',
        processName: 'kubelet.service',
        cliDiagnostic: 'journalctl -u kubelet -f --no-tail',
        configLocation: '/var/lib/kubelet/config.yaml',
        keyInsight: 'Does not manage containers directly; delegates all container operations to CRI via gRPC sockets.',
      },
    },
    {
      id: 'cri-containerd',
      label: 'CRI (containerd / runc)',
      sublabel: 'Container Runtime Interface',
      category: 'runtime',
      icon: 'box',
      portOrProtocol: '/run/containerd.sock',
      statusText: 'Process Spawner',
      details: {
        role: 'Implements the Container Runtime Interface. Pulls OCI images, sets up storage overlays, and invokes runc for kernel isolation.',
        processName: 'containerd',
        cliDiagnostic: 'crictl ps && crictl pods',
        configLocation: '/etc/containerd/config.toml',
        keyInsight: 'Spawns runc to execute clone() and pivot_root() Linux system calls to instantiate isolated containers.',
      },
    },
    {
      id: 'pause-container',
      label: 'Pause Container',
      sublabel: 'Shared Network & IPC Namespace',
      category: 'network',
      icon: 'network',
      portOrProtocol: 'veth / lo',
      statusText: 'Anchor',
      details: {
        role: 'Holds open Linux namespaces (network, IPC, UTS) and receives the Pod IP address. Survives container crashes to preserve identity.',
        processName: 'pause (PID 1 in netns)',
        cliDiagnostic: 'crictl inspectp <pod_id>',
        configLocation: 'k8s.gcr.io/pause:3.9',
        keyInsight: 'All containers inside the same Pod share the network namespace anchored by this tiny (700KB) sleeper binary.',
      },
    },
    {
      id: 'app-containers',
      label: 'App & Sidecar Containers',
      sublabel: 'Workload Execution Units',
      category: 'runtime',
      icon: 'box',
      portOrProtocol: 'localhost:8080 / IPC',
      statusText: 'Active Workload',
      details: {
        role: 'The user application code and helper processes (log forwarders, proxies) running inside the shared Pod context.',
        processName: 'node / python / go / nginx',
        cliDiagnostic: 'kubectl logs <pod-name> -c <container-name>',
        configLocation: '/var/log/pods/<namespace>_<pod>_<uid>/',
        keyInsight: 'Communicate with each other over localhost loopback and can share memory-backed volumes.',
      },
    },
  ],
  connections: [
    { from: 'client-kubectl', to: 'kube-apiserver', label: '1. POST /api/v1/namespaces/default/pods', protocol: 'HTTPS / JSON', stepNumber: 1 },
    { from: 'kube-apiserver', to: 'etcd-db', label: '2. Put /registry/pods/default/my-pod (Pending)', protocol: 'gRPC Raft', stepNumber: 2 },
    { from: 'kube-scheduler', to: 'kube-apiserver', label: '3. Watch & Bind Pod -> node-1', protocol: 'HTTP/2 Watch', stepNumber: 3 },
    { from: 'kube-apiserver', to: 'etcd-db', label: '4. Update spec.nodeName = "node-1"', protocol: 'gRPC Raft', stepNumber: 3 },
    { from: 'kubelet-agent', to: 'kube-apiserver', label: '5. Watch sees node-1 assignment', protocol: 'HTTP/2 Watch', stepNumber: 4 },
    { from: 'kubelet-agent', to: 'cri-containerd', label: '6. gRPC RunPodSandbox & CreateContainer', protocol: 'Unix Domain Socket', stepNumber: 4 },
    { from: 'cri-containerd', to: 'pause-container', label: '7. Spawn Pause container (Create netns & Pod IP)', protocol: 'runc clone()', stepNumber: 5 },
    { from: 'cri-containerd', to: 'app-containers', label: '8. Join shared netns & start application process', protocol: 'setns() & exec', stepNumber: 5 },
  ],
  steps: [
    {
      step: 1,
      title: 'Manifest Submission & Authentication',
      summary: 'kubectl sends the declarative YAML payload to kube-apiserver over TLS.',
      activeBlockIds: ['client-kubectl', 'kube-apiserver'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'You type "kubectl apply" and your computer securely packages your request and hands it to the Kubernetes manager (API server).',
        technicalMechanics: 'The API server performs TLS mutual authentication, extracts client CN/groups, runs authorization checks (RBAC), and evaluates mutating webhooks.',
      },
      kubectlTrace: 'kubectl apply -f pod.yaml --v=6',
    },
    {
      step: 2,
      title: 'Persistence in Consensus Store',
      summary: 'kube-apiserver writes the unassigned Pod into etcd in Pending state.',
      activeBlockIds: ['kube-apiserver', 'etcd-db'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'The API server saves your Pod request permanently into the database so the cluster never forgets it, even if a server restarts.',
        technicalMechanics: 'etcd writes the serialized Protobuf representation to its write-ahead log (WAL) and commits across the Raft quorum.',
      },
      kubectlTrace: 'kubectl get pod my-pod -o jsonpath="{.status.phase}" # Returns Pending',
    },
    {
      step: 3,
      title: 'Node Selection & Binding',
      summary: 'kube-scheduler identifies the unscheduled Pod and binds it to an optimal worker node.',
      activeBlockIds: ['kube-scheduler', 'kube-apiserver', 'etcd-db'],
      activeConnectionIdxs: [2, 3],
      detailExplanation: {
        simpleWords: 'The Scheduler looks at all worker computers, checks who has enough memory and CPU, and assigns the Pod to the best machine.',
        technicalMechanics: 'Filtering checks taints, tolerations, and resource requests. Scoring calculates priority weights. A Binding subresource is posted to the API server.',
      },
      kubectlTrace: 'kubectl get events --field-selector reason=Scheduled',
    },
    {
      step: 4,
      title: 'Kubelet Node Sync & CRI Delegation',
      summary: 'Kubelet on the selected node detects the assignment and commands the CRI runtime.',
      activeBlockIds: ['kubelet-agent', 'cri-containerd'],
      activeConnectionIdxs: [4, 5],
      detailExplanation: {
        simpleWords: 'The supervisor agent on worker-node-1 notices the new task and instructs the container engine (containerd) to prepare the runtime.',
        technicalMechanics: 'Kubelet invokes the CRI gRPC API methods RunPodSandbox and PullImage, validating volume mounts and secrets before execution.',
      },
      kubectlTrace: 'journalctl -u kubelet -f | grep -i "syncing pod"',
    },
    {
      step: 5,
      title: 'Pause Namespace Anchoring & Container Boot',
      summary: 'containerd creates the Pause container netns and executes application containers.',
      activeBlockIds: ['cri-containerd', 'pause-container', 'app-containers'],
      activeConnectionIdxs: [6, 7],
      detailExplanation: {
        simpleWords: 'The container engine sets up a shared network box (Pause container) with an IP address, then launches your actual program inside it.',
        technicalMechanics: 'runc issues Linux syscalls clone(CLONE_NEWNET | CLONE_NEWIPC | CLONE_NEWPID). App containers join this netns via setns() and boot as PID 1.',
      },
      kubectlTrace: 'crictl pods && crictl ps',
    },
  ],
});

// --- CHAPTER 2: WORKLOADS & CONTROLLERS RECONCILIATION LOOP ---
const CHAPTER_2_FLOW: (c: KubeConcept) => TopicFlowDiagramData = (c) => ({
  chapterNumber: 2,
  chapterTitle: 'Workloads & Controller Reconciliation',
  conceptNumber: c.number,
  conceptTitle: c.title,
  architectureType: 'Declarative Controller Reconciliation Loop',
  architecturalSummary:
    'Illustrates the continuous level-triggered control loop: Developer specifies desired replicas, DeploymentController creates and orchestrates ReplicaSets, and Kubelet maintains running Pods across worker nodes with zero-downtime rolling updates.',
  blocks: [
    {
      id: 'deploy-client',
      label: 'Developer / CI/CD',
      sublabel: 'Desired State Specifier',
      category: 'client',
      icon: 'terminal',
      portOrProtocol: 'git push / kubectl',
      statusText: 'Intent Author',
      details: {
        role: 'Specifies desired state (e.g., replicas: 3, image: app:v2, rollingUpdate strategy).',
        cliDiagnostic: 'kubectl rollout status deployment/web-app',
        keyInsight: 'Declarative GitOps principle: describe WHAT you want, not the step-by-step commands to get there.',
      },
    },
    {
      id: 'deploy-apiserver',
      label: 'kube-apiserver',
      sublabel: 'Object Registry & Event Bus',
      category: 'control-plane',
      icon: 'server',
      portOrProtocol: ':6443 HTTPS',
      statusText: 'Event Hub',
      details: {
        role: 'Stores Deployment & ReplicaSet resources and streams mutation events to registered controller informers.',
        cliDiagnostic: 'kubectl get deployments -o wide',
        keyInsight: 'Exposes HTTP/2 watch streams so controllers do not have to poll the database.',
      },
    },
    {
      id: 'deploy-controller',
      label: 'Deployment Controller',
      sublabel: 'kube-controller-manager',
      category: 'control-plane',
      icon: 'cpu',
      portOrProtocol: 'Internal In-Memory Loop',
      statusText: 'Strategist',
      details: {
        role: 'Manages ReplicaSets during version rollouts. Implements maxSurge and maxUnavailable guarantees.',
        cliDiagnostic: 'kubectl rollout history deployment/web-app',
        keyInsight: 'Does not manage Pods directly! It only creates, deletes, and scales ReplicaSets.',
      },
    },
    {
      id: 'rs-controller',
      label: 'ReplicaSet Controller',
      sublabel: 'Pod Quantity Stabilizer',
      category: 'control-plane',
      icon: 'layers',
      portOrProtocol: 'Internal In-Memory Loop',
      statusText: 'Replica Enforcer',
      details: {
        role: 'Ensures exact count of matching pods equals spec.replicas. Spawns replacement pods if any fail.',
        cliDiagnostic: 'kubectl get rs --selector=app=web-app',
        keyInsight: 'Uses label selectors (spec.selector.matchLabels) to acquire ownership of Pods.',
      },
    },
    {
      id: 'node-kubelets',
      label: 'Worker Kubelets (Node A / B)',
      sublabel: 'Distributed Execution Plane',
      category: 'node',
      icon: 'shield',
      portOrProtocol: ':10250 gRPC',
      statusText: 'Node Executors',
      details: {
        role: 'Pulls container images, starts workloads, performs health checks, and streams status back to the control plane.',
        cliDiagnostic: 'kubectl get pods -o wide',
        keyInsight: 'If a node dies, the controller creates replacement Pods on healthy surviving nodes.',
      },
    },
    {
      id: 'active-pod-replicas',
      label: 'Target Pod Replicas (x3)',
      sublabel: 'Stateless Workload Instances',
      category: 'runtime',
      icon: 'box',
      portOrProtocol: 'Pod IPs: 10.244.1.12..14',
      statusText: 'Running',
      details: {
        role: 'The running application instances serving traffic behind a Service abstraction.',
        cliDiagnostic: 'kubectl get pods -l app=web-app -w',
        keyInsight: 'Pods are ephemeral and cattle, not pets. Each gets a new IP when rescheduled.',
      },
    },
  ],
  connections: [
    { from: 'deploy-client', to: 'deploy-apiserver', label: '1. Apply Deployment (spec.replicas: 3, v2)', protocol: 'HTTPS REST', stepNumber: 1 },
    { from: 'deploy-apiserver', to: 'deploy-controller', label: '2. Watch notification: Deployment changed', protocol: 'Informer Watch', stepNumber: 2 },
    { from: 'deploy-controller', to: 'deploy-apiserver', label: '3. Create new ReplicaSet (v2-hash)', protocol: 'POST /api/v1/replicasets', stepNumber: 3 },
    { from: 'deploy-apiserver', to: 'rs-controller', label: '4. Watch notification: RS v2 needs 3 Pods', protocol: 'Informer Watch', stepNumber: 4 },
    { from: 'rs-controller', to: 'deploy-apiserver', label: '5. Create 3 Pod objects with ownerReferences', protocol: 'POST /api/v1/pods', stepNumber: 4 },
    { from: 'deploy-apiserver', to: 'node-kubelets', label: '6. Scheduler assigns & Kubelets pull images', protocol: 'Watch / Bind', stepNumber: 5 },
    { from: 'node-kubelets', to: 'active-pod-replicas', label: '7. Containers launched & Readiness probes pass', protocol: 'CRI containerd', stepNumber: 5 },
  ],
  steps: [
    {
      step: 1,
      title: 'Declarative Intent Specification',
      summary: 'Developer applies a Deployment manifest targeting 3 replicas with version 2.',
      activeBlockIds: ['deploy-client', 'deploy-apiserver'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'You declare: "I want 3 copies of my web application running version 2."',
        technicalMechanics: 'Deployment spec is validated and stored in etcd with generation metadata and revision history annotations.',
      },
      kubectlTrace: 'kubectl apply -f deployment.yaml',
    },
    {
      step: 2,
      title: 'Informer Notification & Diff Calculation',
      summary: 'Deployment Controller calculates the delta between desired state and current state.',
      activeBlockIds: ['deploy-apiserver', 'deploy-controller'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'The master brain notices the difference between what you asked for and what currently exists.',
        technicalMechanics: 'The Informer workqueue triggers reconcileDeployment(). It compares pod-template-hash and detects a new image version.',
      },
      kubectlTrace: 'kubectl describe deployment web-app | grep Replicas',
    },
    {
      step: 3,
      title: 'New ReplicaSet Spawning',
      summary: 'Deployment Controller creates a new ReplicaSet for the updated version.',
      activeBlockIds: ['deploy-controller', 'deploy-apiserver'],
      activeConnectionIdxs: [2],
      detailExplanation: {
        simpleWords: 'Instead of killing everything at once, the controller creates a new version group to manage the rollout safely.',
        technicalMechanics: 'A new ReplicaSet object is created with matching labels and template hash (e.g. web-app-7b94cf).',
      },
      kubectlTrace: 'kubectl get rs',
    },
    {
      step: 4,
      title: 'ReplicaSet Scale-Out & Pod Generation',
      summary: 'ReplicaSet Controller requests new Pods following maxSurge constraints.',
      activeBlockIds: ['deploy-apiserver', 'rs-controller'],
      activeConnectionIdxs: [3, 4],
      detailExplanation: {
        simpleWords: 'The replica manager orders the creation of new pods while keeping old pods serving user traffic.',
        technicalMechanics: 'The RS controller loops over desired vs current replicas and calls the Pod creation API with ownerReferences.',
      },
      kubectlTrace: 'kubectl rollout status deployment/web-app',
    },
    {
      step: 5,
      title: 'Node Execution & Old Replica Phasing',
      summary: 'Kubelets start new containers; as they turn Ready, old replicas are gracefully terminated.',
      activeBlockIds: ['node-kubelets', 'active-pod-replicas'],
      activeConnectionIdxs: [5, 6],
      detailExplanation: {
        simpleWords: 'New pods start up on worker nodes. Once they are healthy, old pods are retired. Zero downtime!',
        technicalMechanics: 'Readiness probes pass, EndpointSlice includes new pod IPs, and old RS is scaled down (SIGTERM with terminationGracePeriodSeconds).',
      },
      kubectlTrace: 'kubectl get pods -l app=web-app',
    },
  ],
});

// --- CHAPTER 3: NETWORKING, SERVICES & INGRESS PACKET PATH ---
const CHAPTER_3_FLOW: (c: KubeConcept) => TopicFlowDiagramData = (c) => ({
  chapterNumber: 3,
  chapterTitle: 'Networking, Services, Ingress & DNS',
  conceptNumber: c.number,
  conceptTitle: c.title,
  architectureType: 'Kubernetes Virtual Networking & Ingress Packet Path',
  architecturalSummary:
    'Traces an incoming user request through Ingress L7 routing, CoreDNS service discovery, ClusterIP virtual IP translation via kube-proxy (iptables / IPVS / eBPF), and EndpointSlice load balancing to reach target Pod veth interfaces.',
  blocks: [
    {
      id: 'net-user',
      label: 'End User / Browser',
      sublabel: 'External Public Internet',
      category: 'client',
      icon: 'network',
      portOrProtocol: 'HTTPS :443',
      statusText: 'Client',
      details: {
        role: 'Makes HTTP requests to https://api.mycompany.com resolved to cloud LoadBalancer IP.',
        cliDiagnostic: 'curl -iv https://api.mycompany.com',
        keyInsight: 'Has no knowledge of private cluster IPs or Pod lifecycles.',
      },
    },
    {
      id: 'ingress-controller',
      label: 'Ingress Controller',
      sublabel: 'L7 Reverse Proxy (Nginx / Envoy)',
      category: 'network',
      icon: 'network',
      portOrProtocol: ':80 / :443 -> HostPort',
      statusText: 'L7 Edge Router',
      details: {
        role: 'Inspects HTTP Host and Path headers, terminates TLS certificates, and routes to backend Kubernetes Services.',
        cliDiagnostic: 'kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx',
        keyInsight: 'Can route directly to Pod IPs using EndpointSlice data, bypassing kube-proxy overhead in modern setups.',
      },
    },
    {
      id: 'coredns-service',
      label: 'CoreDNS Service',
      sublabel: 'In-Cluster DNS Resolver',
      category: 'network',
      icon: 'server',
      portOrProtocol: '10.96.0.10:53 UDP/TCP',
      statusText: 'Name Authority',
      details: {
        role: 'Resolves service names (e.g. backend-svc.default.svc.cluster.local) to virtual ClusterIPs.',
        cliDiagnostic: 'kubectl run test-dns --rm -it --image=busybox -- nslookup backend-svc',
        keyInsight: 'Configured automatically in every Pod /etc/resolv.conf as the primary nameserver.',
      },
    },
    {
      id: 'clusterip-svc',
      label: 'ClusterIP Virtual IP',
      sublabel: 'Stable Service Abstraction',
      category: 'network',
      icon: 'layers',
      portOrProtocol: '10.96.140.85:80 (VIP)',
      statusText: 'Virtual IP',
      details: {
        role: 'A synthetic IP that never responds to ping, backed by kernel packet-filtering rules across all nodes.',
        cliDiagnostic: 'kubectl get svc backend-svc -o wide',
        keyInsight: 'Never bound to any physical network card. It only exists in iptables/IPVS routing tables.',
      },
    },
    {
      id: 'kube-proxy-engine',
      label: 'kube-proxy & EndpointSlice',
      sublabel: 'Kernel Packet Rewrite Engine',
      category: 'network',
      icon: 'cpu',
      portOrProtocol: 'iptables / IPVS / eBPF',
      statusText: 'NAT Programmers',
      details: {
        role: 'Watches Services and EndpointSlices. Programs Linux kernel with DNAT rules to load-balance traffic across active pods.',
        cliDiagnostic: 'iptables-save | grep KUBE-SVC',
        keyInsight: 'Performs random or round-robin Destination Network Address Translation (DNAT).',
      },
    },
    {
      id: 'target-pod-mesh',
      label: 'Backend Pod Instances',
      sublabel: 'Target Workload Endpoints',
      category: 'runtime',
      icon: 'box',
      portOrProtocol: '10.244.2.45:8080',
      statusText: 'Target Endpoints',
      details: {
        role: 'The application pods that receive the rewritten packets over their veth network interfaces.',
        cliDiagnostic: 'kubectl get endpointslices -l kubernetes.io/service-name=backend-svc',
        keyInsight: 'Packets enter the Pod network namespace with destination changed from ClusterIP to the real Pod IP.',
      },
    },
  ],
  connections: [
    { from: 'net-user', to: 'ingress-controller', label: '1. HTTPS GET /api/v1/items', protocol: 'TLS :443', stepNumber: 1 },
    { from: 'ingress-controller', to: 'coredns-service', label: '2. Query: backend-svc.default.svc', protocol: 'DNS UDP:53', stepNumber: 2 },
    { from: 'coredns-service', to: 'ingress-controller', label: '3. Return VIP: 10.96.140.85', protocol: 'DNS Reply', stepNumber: 2 },
    { from: 'ingress-controller', to: 'clusterip-svc', label: '4. Send TCP SYN to VIP:80', protocol: 'TCP SYN', stepNumber: 3 },
    { from: 'clusterip-svc', to: 'kube-proxy-engine', label: '5. Intercepted by kernel iptables/IPVS rule', protocol: 'Kernel Hook', stepNumber: 4 },
    { from: 'kube-proxy-engine', to: 'target-pod-mesh', label: '6. DNAT packet to Pod IP (10.244.2.45:8080)', protocol: 'veth pair bridge', stepNumber: 5 },
  ],
  steps: [
    {
      step: 1,
      title: 'External Ingress Edge Routing',
      summary: 'Public traffic hits the Ingress controller reverse proxy and terminates TLS.',
      activeBlockIds: ['net-user', 'ingress-controller'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'A user opens the web page. Their browser connects to the front-door router (Ingress) which checks the domain name and security certificates.',
        technicalMechanics: 'Ingress Controller decrypts TLS, parses HTTP Host & path headers, and selects the designated upstream Service.',
      },
      kubectlTrace: 'kubectl get ingress',
    },
    {
      step: 2,
      title: 'Cluster DNS Service Resolution',
      summary: 'CoreDNS resolves the service domain name into a stable virtual ClusterIP.',
      activeBlockIds: ['ingress-controller', 'coredns-service'],
      activeConnectionIdxs: [1, 2],
      detailExplanation: {
        simpleWords: 'The router asks the internal cluster phonebook (CoreDNS): "What is the IP for backend-svc?" CoreDNS answers with a virtual service IP.',
        technicalMechanics: 'CoreDNS matches the record in etcd/cache and responds with an A record pointing to the Service ClusterIP.',
      },
      kubectlTrace: 'kubectl exec -it dns-test -- nslookup backend-svc',
    },
    {
      step: 3,
      title: 'Virtual IP Transmission',
      summary: 'Traffic is directed toward the ClusterIP virtual IP on the node network stack.',
      activeBlockIds: ['ingress-controller', 'clusterip-svc'],
      activeConnectionIdxs: [3],
      detailExplanation: {
        simpleWords: 'The request is forwarded toward the virtual service IP address.',
        technicalMechanics: 'Packet is routed into the Linux network stack with destination set to the ClusterIP (e.g. 10.96.140.85).',
      },
      kubectlTrace: 'kubectl get svc backend-svc',
    },
    {
      step: 4,
      title: 'Kernel DNAT Rewrite (kube-proxy)',
      summary: 'kube-proxy iptables or IPVS rules intercept the packet and choose a healthy Pod.',
      activeBlockIds: ['clusterip-svc', 'kube-proxy-engine'],
      activeConnectionIdxs: [4],
      detailExplanation: {
        simpleWords: 'The Linux kernel intercepts the virtual IP and replaces it with the real IP address of an active, healthy pod.',
        technicalMechanics: 'KUBE-SERVICES chain evaluates KUBE-SVC rules and applies PREROUTING DNAT based on weights from EndpointSlices.',
      },
      kubectlTrace: 'kubectl get endpointslices',
    },
    {
      step: 5,
      title: 'Pod Delivery & Response',
      summary: 'Packet travels through CNI veth bridge directly into the Pod network namespace.',
      activeBlockIds: ['kube-proxy-engine', 'target-pod-mesh'],
      activeConnectionIdxs: [5],
      detailExplanation: {
        simpleWords: 'The application receives the packet, processes the request, and sends back the result through the reverse NAT path.',
        technicalMechanics: 'Packet enters the veth interface inside the container netns. Connection tracking (conntrack) ensures response packets are correctly un-NATted.',
      },
      kubectlTrace: 'kubectl logs -l app=backend-app --tail=20',
    },
  ],
});

// --- CHAPTER 4: CONFIGURATION, SECRETS & PROJECTIONS ---
const CHAPTER_4_FLOW: (c: KubeConcept) => TopicFlowDiagramData = (c) => ({
  chapterNumber: 4,
  chapterTitle: 'Configuration, Secrets & Volume Projections',
  conceptNumber: c.number,
  conceptTitle: c.title,
  architectureType: 'Decoupled Configuration & Encrypted Secret Projection',
  architecturalSummary:
    'Details the lifecycle of ConfigMaps and Secrets: from creation and etcd encryption at rest to Kubelet VolumeManager mounting tmpfs in-memory volumes and environment variable injection into container runtimes.',
  blocks: [
    {
      id: 'cfg-admin',
      label: 'Cluster Admin / CI',
      sublabel: 'Secret & Config Author',
      category: 'client',
      icon: 'terminal',
      portOrProtocol: 'kubectl create secret',
      statusText: 'Author',
      details: {
        role: 'Submits non-sensitive configs (ConfigMaps) and sensitive credentials (Secrets).',
        cliDiagnostic: 'kubectl create secret generic db-pass --from-literal=password=secret123',
        keyInsight: 'Secrets should never be stored in plaintext git repositories.',
      },
    },
    {
      id: 'cfg-apiserver',
      label: 'kube-apiserver',
      sublabel: 'Encryption Provider Gateway',
      category: 'control-plane',
      icon: 'server',
      portOrProtocol: ':6443 HTTPS',
      statusText: 'Encryptor',
      details: {
        role: 'Validates resource schema. If EncryptionConfiguration is enabled, encrypts Secret payloads with AES-GCM or KMS before writing to etcd.',
        cliDiagnostic: 'kubectl get secret db-pass -o yaml',
        keyInsight: 'Base64 is NOT encryption! Real encryption requires EncryptionConfiguration with KMS or a local AES key.',
      },
    },
    {
      id: 'cfg-etcd',
      label: 'etcd (Encrypted at Rest)',
      sublabel: 'Encrypted Persistence',
      category: 'storage',
      icon: 'database',
      portOrProtocol: 'AES-GCM / KMS Ciphertext',
      statusText: 'Cipher Store',
      details: {
        role: 'Stores encrypted bytes under /registry/secrets/<namespace>/<name>. Direct disk reads show ciphertext.',
        cliDiagnostic: 'etcdctl get /registry/secrets/default/db-pass',
        keyInsight: 'Protects sensitive credentials if raw etcd database backups are leaked.',
      },
    },
    {
      id: 'cfg-volmanager',
      label: 'Kubelet VolumeManager',
      sublabel: 'In-Memory tmpfs Mounter',
      category: 'node',
      icon: 'shield',
      portOrProtocol: 'tmpfs Memory Mount',
      statusText: 'Volume Sync',
      details: {
        role: 'Creates an in-memory tmpfs filesystem on the host node and writes Secret keys as files. Secrets are never written to disk!',
        cliDiagnostic: 'ls -la /var/lib/kubelet/pods/<pod-uid>/volumes/kubernetes.io~secret/',
        keyInsight: 'Using tmpfs guarantees secret contents exist only in volatile RAM on the node.',
      },
    },
    {
      id: 'cfg-container',
      label: 'Application Container',
      sublabel: 'Workload Consumer',
      category: 'runtime',
      icon: 'box',
      portOrProtocol: '/etc/secrets/password',
      statusText: 'Consumer',
      details: {
        role: 'Reads configuration from injected volume mount or process environment variables.',
        cliDiagnostic: 'kubectl exec my-pod -- cat /etc/secrets/password',
        keyInsight: 'Volume-mounted secrets update automatically via Kubelet watch; env vars require pod restarts to refresh.',
      },
    },
  ],
  connections: [
    { from: 'cfg-admin', to: 'cfg-apiserver', label: '1. POST /api/v1/secrets', protocol: 'HTTPS', stepNumber: 1 },
    { from: 'cfg-apiserver', to: 'cfg-etcd', label: '2. Encrypt & write ciphertext to etcd', protocol: 'AES-GCM / Raft', stepNumber: 2 },
    { from: 'cfg-apiserver', to: 'cfg-volmanager', label: '3. Kubelet syncs secret spec for scheduled Pod', protocol: 'gRPC Watch', stepNumber: 3 },
    { from: 'cfg-volmanager', to: 'cfg-container', label: '4. Mount tmpfs RAM volume into container filesystem', protocol: 'Linux mount -t tmpfs', stepNumber: 4 },
  ],
  steps: [
    {
      step: 1,
      title: 'Secret / ConfigMap Creation',
      summary: 'Admin passes credentials or configuration keys to kube-apiserver.',
      activeBlockIds: ['cfg-admin', 'cfg-apiserver'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'You store a database password or config setting securely in Kubernetes.',
        technicalMechanics: 'The API server accepts the payload, checks RBAC permissions, and base64-encodes the fields.',
      },
      kubectlTrace: 'kubectl create secret generic api-key --from-literal=token=xyz',
    },
    {
      step: 2,
      title: 'Encryption at Rest in etcd',
      summary: 'kube-apiserver encrypts the secret using AES-GCM or KMS before writing to disk.',
      activeBlockIds: ['cfg-apiserver', 'cfg-etcd'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'The cluster locks the secret inside an encrypted safe in the database so nobody can steal it.',
        technicalMechanics: 'Encryption Provider transforms plaintext into ciphertext (k8s:enc:aescbc:v1:...) prior to etcd storage.',
      },
      kubectlTrace: 'kubectl get secrets',
    },
    {
      step: 3,
      title: 'Kubelet VolumeManager Provisioning',
      summary: 'Kubelet on the host node retrieves the secret and allocates a tmpfs RAM filesystem.',
      activeBlockIds: ['cfg-apiserver', 'cfg-volmanager'],
      activeConnectionIdxs: [2],
      detailExplanation: {
        simpleWords: 'The host server downloads the secret into computer memory (RAM) only, never saving it to the hard drive.',
        technicalMechanics: 'Kubelet creates a tmpfs mount inside /var/lib/kubelet/pods/<uid>/volumes/kubernetes.io~secret/ to avoid disk writes.',
      },
      kubectlTrace: 'journalctl -u kubelet | grep -i "MountVolume.SetUp succeeded for volume"',
    },
    {
      step: 4,
      title: 'Atomic Projection into Container',
      summary: 'Container process accesses keys as read-only files or environment variables.',
      activeBlockIds: ['cfg-volmanager', 'cfg-container'],
      activeConnectionIdxs: [3],
      detailExplanation: {
        simpleWords: 'Your app reads the password like any normal file on its drive, keeping secrets completely decoupled from your code.',
        technicalMechanics: 'Atomic symlink swap (..data directory) updates files without race conditions when the Secret is modified.',
      },
      kubectlTrace: 'kubectl exec <pod> -- ls /etc/secrets',
    },
  ],
});

// --- CHAPTER 5: STORAGE, PVCS, PVS & CSI SUBSYSTEM ---
const CHAPTER_5_FLOW: (c: KubeConcept) => TopicFlowDiagramData = (c) => ({
  chapterNumber: 5,
  chapterTitle: 'Storage, PVCs, PVs & Container Storage Interface',
  conceptNumber: c.number,
  conceptTitle: c.title,
  architectureType: 'CSI Dynamic Provisioning & Volume Attachment Pipeline',
  architecturalSummary:
    'Demonstrates the dynamic storage lifecycle: PersistentVolumeClaim requests storage, StorageClass triggers the external CSI provisioner to carve out cloud disk (EBS/Ceph/NFS), attaches to the host node, and mounts securely into the target container.',
  blocks: [
    {
      id: 'csi-pvc',
      label: 'PersistentVolumeClaim (PVC)',
      sublabel: 'Storage Request Ticket',
      category: 'storage',
      icon: 'hard-drive',
      portOrProtocol: 'Claim: 50Gi (ReadWriteOnce)',
      statusText: 'Claim',
      details: {
        role: 'The user request for storage capacity and access mode. Decouples developer needs from physical disk types.',
        cliDiagnostic: 'kubectl get pvc',
        keyInsight: 'Like asking for a table at a restaurant: you specify how big, not which exact physical table.',
      },
    },
    {
      id: 'csi-sc',
      label: 'StorageClass & CSI Provisioner',
      sublabel: 'Dynamic Volume Factory',
      category: 'control-plane',
      icon: 'cpu',
      portOrProtocol: 'Provisioner: ebs.csi.aws.com',
      statusText: 'Provisioner',
      details: {
        role: 'Watches for Pending PVCs, calls cloud storage APIs (AWS EBS / GCP PD / Ceph), and formats block devices.',
        cliDiagnostic: 'kubectl get storageclass',
        keyInsight: 'Eliminates manual admin volume provisioning by automating cloud disk creation.',
      },
    },
    {
      id: 'csi-pv',
      label: 'PersistentVolume (PV)',
      sublabel: 'Physical Storage Entity',
      category: 'storage',
      icon: 'database',
      portOrProtocol: 'Volume ID: vol-09f83a21',
      statusText: 'Bound (1-to-1)',
      details: {
        role: 'Represents the actual provisioned storage disk in the cluster, bound 1-to-1 with the requesting PVC.',
        cliDiagnostic: 'kubectl get pv',
        keyInsight: 'Has a ReclaimPolicy (Retain, Delete) that decides what happens to data when the PVC is deleted.',
      },
    },
    {
      id: 'csi-attacher',
      label: 'CSI Node Driver & Kubelet',
      sublabel: 'Host Attachment & Mount Agent',
      category: 'node',
      icon: 'shield',
      portOrProtocol: 'gRPC NodeStageVolume',
      statusText: 'Mounter',
      details: {
        role: 'Attaches the cloud block volume to the specific worker node VM and mounts the filesystem (ext4/xfs).',
        cliDiagnostic: 'lsblk && df -h',
        keyInsight: 'Mounts the formatted volume to /var/lib/kubelet/pods/<uid>/volumes/... for container access.',
      },
    },
    {
      id: 'csi-container',
      label: 'Stateful Container',
      sublabel: 'Persistent App (PostgreSQL / Redis)',
      category: 'runtime',
      icon: 'box',
      portOrProtocol: 'Mount: /var/lib/postgresql/data',
      statusText: 'Stateful App',
      details: {
        role: 'Reads and writes persistent database files that survive container crashes and pod restarts.',
        cliDiagnostic: 'kubectl exec postgres-pod -- df -h /var/lib/postgresql/data',
        keyInsight: 'Even if the pod is killed and scheduled on a different node, the volume re-attaches cleanly.',
      },
    },
  ],
  connections: [
    { from: 'csi-pvc', to: 'csi-sc', label: '1. PVC requests 50Gi from StorageClass', protocol: 'Object creation', stepNumber: 1 },
    { from: 'csi-sc', to: 'csi-pv', label: '2. CSI calls Cloud API & provisions PV', protocol: 'Cloud Storage API', stepNumber: 2 },
    { from: 'csi-pv', to: 'csi-pvc', label: '3. PV & PVC bind 1-to-1', protocol: 'Controller Sync', stepNumber: 2 },
    { from: 'csi-pv', to: 'csi-attacher', label: '4. Attach volume to worker node', protocol: 'CSI ControllerPublish', stepNumber: 3 },
    { from: 'csi-attacher', to: 'csi-container', label: '5. Mount formatted filesystem into container', protocol: 'CSI NodePublishVolume', stepNumber: 4 },
  ],
  steps: [
    {
      step: 1,
      title: 'Storage Claim Creation (PVC)',
      summary: 'User requests persistent storage via a PVC manifest without needing infrastructure admin rights.',
      activeBlockIds: ['csi-pvc', 'csi-sc'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'Your app submits a ticket: "I need a 50GB fast SSD hard drive to save my database files."',
        technicalMechanics: 'The PersistentVolumeClaim object is created with AccessModes (ReadWriteOnce) and StorageClass name.',
      },
      kubectlTrace: 'kubectl apply -f pvc.yaml',
    },
    {
      step: 2,
      title: 'CSI Dynamic Provisioning & Binding',
      summary: 'StorageClass triggers the CSI provisioner to carve out a cloud disk and bind the PV.',
      activeBlockIds: ['csi-sc', 'csi-pv', 'csi-pvc'],
      activeConnectionIdxs: [1, 2],
      detailExplanation: {
        simpleWords: 'The cluster calls the cloud provider (AWS/GCP) to create a real 50GB virtual hard drive and links it to your ticket.',
        technicalMechanics: 'The external-provisioner sidecar calls CreateVolume() on the CSI driver. A matching PV is created in Bound state.',
      },
      kubectlTrace: 'kubectl get pv,pvc',
    },
    {
      step: 3,
      title: 'Volume Attachment to Host Node',
      summary: 'CSI Attacher attaches the block device to the specific worker node where the pod is scheduled.',
      activeBlockIds: ['csi-pv', 'csi-attacher'],
      activeConnectionIdxs: [3],
      detailExplanation: {
        simpleWords: 'The cloud hard drive is plugged into the worker computer where your app will run.',
        technicalMechanics: 'AttachDetachController invokes ControllerPublishVolume() over gRPC to attach the EBS/disk device to the EC2/VM node.',
      },
      kubectlTrace: 'kubectl describe volumeattachment',
    },
    {
      step: 4,
      title: 'Formatting & Mount into Container',
      summary: 'Kubelet and CSI Node Driver format the filesystem (ext4/xfs) and mount into the container path.',
      activeBlockIds: ['csi-attacher', 'csi-container'],
      activeConnectionIdxs: [4],
      detailExplanation: {
        simpleWords: 'The node formats the drive and mounts it as a folder inside your container. Now your database can safely save data!',
        technicalMechanics: 'NodeStageVolume formats the block device, and NodePublishVolume bind-mounts it into the container filesystem root.',
      },
      kubectlTrace: 'kubectl exec <pod> -- df -h',
    },
  ],
});

// --- DYNAMIC DISPATCH ENGINE FOR ALL 15 CHAPTERS ---
export function getDiagramDataForConcept(concept: KubeConcept): TopicFlowDiagramData {
  const chapterNumber = parseInt(concept.number.split('.')[0], 10) || 1;

  switch (chapterNumber) {
    case 1:
      return CHAPTER_1_FLOW(concept);
    case 2:
      return CHAPTER_2_FLOW(concept);
    case 3:
      return CHAPTER_3_FLOW(concept);
    case 4:
      return CHAPTER_4_FLOW(concept);
    case 5:
      return CHAPTER_5_FLOW(concept);

    case 6: // Scheduling & Eviction
      return {
        chapterNumber: 6,
        chapterTitle: 'Scheduling, Affinities & Eviction',
        conceptNumber: concept.number,
        conceptTitle: concept.title,
        architectureType: 'Kube-Scheduler Filtering & Scoring Pipeline',
        architecturalSummary:
          'Explains how kube-scheduler evaluates unscheduled Pods through Filter predicates (NodeAffinity, Tolerations, Resource availability) and Priority scoring algorithms before writing the Binding subresource.',
        blocks: [
          { id: 'sched-queue', label: 'Scheduling Queue', sublabel: 'Pending Pod Workqueue', category: 'client', icon: 'layers', details: { role: 'Holds unscheduled pods prioritized by PriorityClass.', cliDiagnostic: 'kubectl get pods --field-selector=status.phase=Pending', keyInsight: 'Uses activeQ, backoffQ, and unschedulableQ.' } },
          { id: 'sched-filter', label: 'Filter Phase (Predicates)', sublabel: 'Node Elimination Engine', category: 'control-plane', icon: 'cpu', details: { role: 'Eliminates nodes that cannot run the pod (memory, CPU, taints, ports).', cliDiagnostic: 'kubectl describe pod <pending-pod>', keyInsight: 'If all nodes fail filtering, pod remains in Pending with FailedScheduling event.' } },
          { id: 'sched-score', label: 'Score Phase (Priorities)', sublabel: 'Ranking & Spread Engine', category: 'control-plane', icon: 'sparkles', details: { role: 'Scores surviving nodes 0-100 based on image locality and topology spread.', cliDiagnostic: 'kubectl get nodes -l topology.kubernetes.io/zone', keyInsight: 'Higher score wins. Ties broken randomly to avoid hot-spotting.' } },
          { id: 'sched-binding', label: 'Binding Subresource', sublabel: 'API Server Atomic Commit', category: 'storage', icon: 'database', details: { role: 'Writes spec.nodeName to API Server.', cliDiagnostic: 'kubectl get events -w', keyInsight: 'Optimistic concurrency: binding happens asynchronously.' } },
          { id: 'sched-node', label: 'Target Worker Node', sublabel: 'Selected Execution Host', category: 'node', icon: 'shield', details: { role: 'Receives the pod and executes container images.', cliDiagnostic: 'kubectl top node', keyInsight: 'Kubelet begins image pulling immediately upon detecting binding.' } },
        ],
        connections: [
          { from: 'sched-queue', to: 'sched-filter', label: '1. Pop Pod from Priority Queue', protocol: 'In-Memory', stepNumber: 1 },
          { from: 'sched-filter', to: 'sched-score', label: '2. Filter passed nodes forwarded to scoring', protocol: 'Pipeline', stepNumber: 2 },
          { from: 'sched-score', to: 'sched-binding', label: '3. Highest scoring node selected', protocol: 'Calculation', stepNumber: 3 },
          { from: 'sched-binding', to: 'sched-node', label: '4. Bind Pod to Node via API Server', protocol: 'POST /binding', stepNumber: 4 },
        ],
        steps: [
          { step: 1, title: 'Scheduling Queue Ingestion', summary: 'Unscheduled pod enters the priority queue.', activeBlockIds: ['sched-queue', 'sched-filter'], activeConnectionIdxs: [0], detailExplanation: { simpleWords: 'A waiting pod enters the queue to find a home.', technicalMechanics: 'The scheduling cycle pops the highest priority pod from activeQ.' }, kubectlTrace: 'kubectl get pods' },
          { step: 2, title: 'Filter Phase (Predicates)', summary: 'Nodes without enough resources or matching taints are dropped.', activeBlockIds: ['sched-filter', 'sched-score'], activeConnectionIdxs: [1], detailExplanation: { simpleWords: 'The scheduler disqualifies computers that lack CPU, RAM, or correct tags.', technicalMechanics: 'Runs NodeResourcesFit, NodeName, NodePorts, and PodTopologySpread predicates.' }, kubectlTrace: 'kubectl describe node' },
          { step: 3, title: 'Score Phase (Priorities)', summary: 'Remaining nodes are graded on balance and image cache.', activeBlockIds: ['sched-score', 'sched-binding'], activeConnectionIdxs: [2], detailExplanation: { simpleWords: 'The remaining candidate computers are given grades from 0 to 100.', technicalMechanics: 'Calculates ImageLocality, NodeAffinityScorer, and LeastAllocated priority weights.' }, kubectlTrace: 'kubectl get events' },
          { step: 4, title: 'Atomic Binding & Execution', summary: 'The winner node is written to the API server and Kubelet boots the pod.', activeBlockIds: ['sched-binding', 'sched-node'], activeConnectionIdxs: [3], detailExplanation: { simpleWords: 'The winning machine is chosen and starts launching the workload.', technicalMechanics: 'Binding subresource is committed to etcd; Kubelet picks up the assigned pod.' }, kubectlTrace: 'kubectl get pod -o wide' },
        ],
      };

    case 7: // Security, RBAC & Admission Controllers
      return {
        chapterNumber: 7,
        chapterTitle: 'Security, RBAC & Admission Control',
        conceptNumber: concept.number,
        conceptTitle: concept.title,
        architectureType: 'API Server Admission & Security Chain',
        architecturalSummary:
          'Illustrates the Kubernetes security pipeline: TLS authentication, RBAC authorization, Mutating Admission Webhooks, Validating Admission Webhooks, and Pod Security Standards enforcement.',
        blocks: [
          { id: 'sec-client', label: 'Client / ServiceAccount', sublabel: 'Request Origin', category: 'client', icon: 'shield', details: { role: 'Sends API request with TLS cert or JWT token.', cliDiagnostic: 'kubectl auth can-i create pods', keyInsight: 'ServiceAccount tokens are projected JWTs signed by API server.' } },
          { id: 'sec-authn', label: 'Authentication (AuthN)', sublabel: 'Identity Verification', category: 'security', icon: 'shield', details: { role: 'Extracts username, UID, and groups.', cliDiagnostic: 'kubectl config view', keyInsight: 'Supports x509 certs, OIDC tokens, and webhook authenticators.' } },
          { id: 'sec-authz', label: 'RBAC Authorization (AuthZ)', sublabel: 'Permissions Gatekeeper', category: 'security', icon: 'shield', details: { role: 'Checks if identity has permission to execute verb on resource.', cliDiagnostic: 'kubectl get clusterroles,rolebindings', keyInsight: 'Default-deny model: every action requires an explicit allow rule.' } },
          { id: 'sec-mutating', label: 'Mutating Webhooks', sublabel: 'Policy Injector (e.g. Istio)', category: 'control-plane', icon: 'cpu', details: { role: 'Can modify incoming manifests (e.g. inject sidecars).', cliDiagnostic: 'kubectl get mutatingwebhookconfigurations', keyInsight: 'Can alter the YAML payload before schema validation.' } },
          { id: 'sec-validating', label: 'Validating Webhooks & PSS', sublabel: 'Policy Enforcement (Gatekeeper)', category: 'security', icon: 'shield', details: { role: 'Enforces Pod Security Standards (Restricted, Baseline).', cliDiagnostic: 'kubectl get validatingwebhookconfigurations', keyInsight: 'Rejects non-compliant pods with clear error explanations.' } },
        ],
        connections: [
          { from: 'sec-client', to: 'sec-authn', label: '1. HTTPS Request with Bearer Token', protocol: 'TLS 1.3', stepNumber: 1 },
          { from: 'sec-authn', to: 'sec-authz', label: '2. Verify Identity -> Check RBAC rules', protocol: 'Auth Chain', stepNumber: 2 },
          { from: 'sec-authz', to: 'sec-mutating', label: '3. Pass AuthZ -> Mutate manifest', protocol: 'Webhook Call', stepNumber: 3 },
          { from: 'sec-mutating', to: 'sec-validating', label: '4. Validate security policies & PSS', protocol: 'Admission Check', stepNumber: 4 },
        ],
        steps: [
          { step: 1, title: 'Authentication (Who are you?)', summary: 'API server validates the TLS client certificate or OIDC token.', activeBlockIds: ['sec-client', 'sec-authn'], activeConnectionIdxs: [0], detailExplanation: { simpleWords: 'The system verifies your passport or digital identity.', technicalMechanics: 'TokenReview or x509 validator resolves the request into an authenticated user subject.' }, kubectlTrace: 'kubectl auth can-i --list' },
          { step: 2, title: 'Authorization (What can you do?)', summary: 'RBAC checks Roles and ClusterRoleBindings for permission.', activeBlockIds: ['sec-authn', 'sec-authz'], activeConnectionIdxs: [1], detailExplanation: { simpleWords: 'The system checks if you have permission to do this specific action.', technicalMechanics: 'Matches (verb: create, resource: pods, namespace: default) against active RoleBindings.' }, kubectlTrace: 'kubectl auth can-i create pods' },
          { step: 3, title: 'Mutating Admission (Inject defaults)', summary: 'Mutating webhooks inject required labels or sidecars.', activeBlockIds: ['sec-authz', 'sec-mutating'], activeConnectionIdxs: [2], detailExplanation: { simpleWords: 'Automated helpers add required security tags or logging tools to your request.', technicalMechanics: 'Webhooks apply JSON Patch operations to modify the incoming resource spec.' }, kubectlTrace: 'kubectl get mutatingwebhookconfigurations' },
          { step: 4, title: 'Validating Admission & PSS (Compliance check)', summary: 'Enforces Pod Security Standards and blocks privileged violations.', activeBlockIds: ['sec-mutating', 'sec-validating'], activeConnectionIdxs: [3], detailExplanation: { simpleWords: 'The safety inspector verifies that no security rules are broken (like running as root).', technicalMechanics: 'Validating webhooks and built-in PSS admission controllers audit runAsNonRoot and capabilities.' }, kubectlTrace: 'kubectl get validatingwebhookconfigurations' },
        ],
      };

    case 8: // Multi-Tenancy & Resource Management
      return {
        chapterNumber: 8,
        chapterTitle: 'Multi-Tenancy & Resource Management',
        conceptNumber: concept.number,
        conceptTitle: concept.title,
        architectureType: 'Resource Quotas & Linux cgroups Isolation',
        architecturalSummary:
          'Shows how Namespace boundaries, ResourceQuotas, LimitRanges, and Linux cgroups (CFS quota & memory limits) prevent noisy neighbors and enforce fair multi-tenant sharing.',
        blocks: [
          { id: 'ten-ns', label: 'Tenant Namespace', sublabel: 'Logical Isolation Boundary', category: 'client', icon: 'layers', details: { role: 'Isolates resources, service accounts, and network policies per team.', cliDiagnostic: 'kubectl get namespaces', keyInsight: 'Provides soft multi-tenancy within a single shared cluster.' } },
          { id: 'ten-quota', label: 'ResourceQuota Controller', sublabel: 'Cluster Capacity Cap', category: 'control-plane', icon: 'shield', details: { role: 'Prevents a single team from exceeding CPU/RAM/Pod allowances.', cliDiagnostic: 'kubectl describe resourcequota', keyInsight: 'Enforced at admission time; rejects pods if quota is full.' } },
          { id: 'ten-limit', label: 'LimitRange Admission', sublabel: 'Container Defaulting', category: 'control-plane', icon: 'cpu', details: { role: 'Injects default requests and limits if the developer omitted them.', cliDiagnostic: 'kubectl describe limitrange', keyInsight: 'Guarantees every container has defined bounds.' } },
          { id: 'ten-cgroup', label: 'Linux cgroups (CFS & Memory)', sublabel: 'Kernel Resource Enforcer', category: 'runtime', icon: 'box', details: { role: 'Throttles CPU (CFS quota) and triggers OOM Killer if RAM limit is breached.', cliDiagnostic: 'cat /sys/fs/cgroup/cpu.max', keyInsight: 'CPU is compressible (causes throttling); Memory is non-compressible (causes OOMKill 137).' } },
        ],
        connections: [
          { from: 'ten-ns', to: 'ten-quota', label: '1. Submit Pod in tenant namespace', protocol: 'API Request', stepNumber: 1 },
          { from: 'ten-quota', to: 'ten-limit', label: '2. Check team quota -> Apply default limits', protocol: 'Admission', stepNumber: 2 },
          { from: 'ten-limit', to: 'ten-cgroup', label: '3. Kubelet configures host kernel cgroups', protocol: 'cgroups v2', stepNumber: 3 },
        ],
        steps: [
          { step: 1, title: 'Namespace Isolation & Submission', summary: 'Workload submitted within designated team boundary.', activeBlockIds: ['ten-ns', 'ten-quota'], activeConnectionIdxs: [0], detailExplanation: { simpleWords: 'A team submits a workload inside their private cluster room (namespace).', technicalMechanics: 'API server scopes RBAC and resource queries to the target namespace.' }, kubectlTrace: 'kubectl get resourcequota -n team-a' },
          { step: 2, title: 'Quota Verification & Limit Injection', summary: 'ResourceQuota audits cumulative usage; LimitRange injects defaults.', activeBlockIds: ['ten-quota', 'ten-limit'], activeConnectionIdxs: [1], detailExplanation: { simpleWords: 'The system checks if the team has budget left and sets safe default CPU/RAM sizes.', technicalMechanics: 'ResourceQuota admission controller locks and validates namespace cumulative requests against limits.' }, kubectlTrace: 'kubectl describe quota' },
          { step: 3, title: 'Kernel cgroup Programming', summary: 'Kubelet writes CPU CFS quota and memory limit into host kernel cgroups.', activeBlockIds: ['ten-limit', 'ten-cgroup'], activeConnectionIdxs: [2], detailExplanation: { simpleWords: 'The Linux kernel enforces strict resource boundaries so no program can hog the computer.', technicalMechanics: 'Writes to /sys/fs/cgroup/memory.max and cpu.max to enforce bandwidth and memory ceilings.' }, kubectlTrace: 'kubectl top pod' },
        ],
      };

    case 9: // Autoscaling
      return {
        chapterNumber: 9,
        chapterTitle: 'Autoscaling, Metrics & KEDA',
        conceptNumber: concept.number,
        conceptTitle: concept.title,
        architectureType: 'Horizontal & Cluster Autoscaling Feedback Loop',
        architecturalSummary:
          'Illustrates the end-to-end autoscaling pipeline: Application traffic surges, Metrics-Server / KEDA detects load, HPA recalculates desired replicas, and Cluster Autoscaler provisions cloud nodes.',
        blocks: [
          { id: 'scale-traffic', label: 'Incoming Traffic / Queue', sublabel: 'Load Stimulus', category: 'client', icon: 'network', details: { role: 'High HTTP traffic or message queue backlog (Kafka/RabbitMQ).', cliDiagnostic: 'kubectl top pods', keyInsight: 'Spurs the scaling demand.' } },
          { id: 'scale-metrics', label: 'Metrics-Server & KEDA', sublabel: 'Metrics Aggregator', category: 'control-plane', icon: 'activity', details: { role: 'Scrapes CPU/RAM or queries external event brokers.', cliDiagnostic: 'kubectl get --raw "/apis/metrics.k8s.io/v1beta1/pods"', keyInsight: 'Provides metric streams via the Custom Metrics API.' } },
          { id: 'scale-hpa', label: 'HPA Controller Loop', sublabel: 'Reconciliation Loop (15s)', category: 'control-plane', icon: 'cpu', details: { role: 'Evaluates formula: desiredReplicas = ceil[current * (metric / target)].', cliDiagnostic: 'kubectl get hpa -w', keyInsight: 'Includes cooldown stabilization windows to prevent flapping.' } },
          { id: 'scale-ca', label: 'Cluster Autoscaler (CA)', sublabel: 'Cloud Infrastructure Provisioner', category: 'node', icon: 'server', details: { role: 'Detects unschedulable Pending pods and orders new VMs from cloud provider.', cliDiagnostic: 'kubectl get nodes -w', keyInsight: 'Scales nodes up when pods are pending; scales down when nodes are underutilized.' } },
        ],
        connections: [
          { from: 'scale-traffic', to: 'scale-metrics', label: '1. Traffic surge increases CPU/RAM consumption', protocol: 'Workload Load', stepNumber: 1 },
          { from: 'scale-metrics', to: 'scale-hpa', label: '2. Metrics API polled every 15 seconds', protocol: 'Metrics API', stepNumber: 2 },
          { from: 'scale-hpa', to: 'scale-ca', label: '3. HPA scales deployment -> Pods go Pending', protocol: 'Scale Subresource', stepNumber: 3 },
          { from: 'scale-ca', to: 'scale-traffic', label: '4. CA adds cloud nodes -> Pods scheduled & traffic handled', protocol: 'Cloud VM API', stepNumber: 4 },
        ],
        steps: [
          { step: 1, title: 'Load Ingestion & Metric Collection', summary: 'Traffic surge elevates utilization metrics.', activeBlockIds: ['scale-traffic', 'scale-metrics'], activeConnectionIdxs: [0], detailExplanation: { simpleWords: 'A sudden wave of users hits your app, causing CPU usage to spike.', technicalMechanics: 'cgroup cpuacct counters report higher utilization to Kubelet, scraped by Metrics-Server.' }, kubectlTrace: 'kubectl top pods' },
          { step: 2, title: 'HPA Evaluation & Scale Calculation', summary: 'HPA controller calculates new target replica count.', activeBlockIds: ['scale-metrics', 'scale-hpa'], activeConnectionIdxs: [1], detailExplanation: { simpleWords: 'The autoscaler calculates: "We need 10 pods instead of 3 to handle this load."', technicalMechanics: 'HPA algorithm applies target utilization ratio and patches deployment.spec.replicas.' }, kubectlTrace: 'kubectl describe hpa' },
          { step: 3, title: 'Cluster Autoscaler Node Provisioning', summary: 'New pods exceed current cluster capacity; CA boots new VMs.', activeBlockIds: ['scale-hpa', 'scale-ca'], activeConnectionIdxs: [2, 3], detailExplanation: { simpleWords: 'The cluster runs out of physical computers, so it automatically buys another server from the cloud.', technicalMechanics: 'Cluster Autoscaler detects unschedulable pods and calls cloud AutoScalingGroup API to add instances.' }, kubectlTrace: 'kubectl get nodes -w' },
        ],
      };

    default: // Chapters 10 through 15 (Observability, Helm, Mesh, CRDs, GitOps, Cluster Ops)
      return {
        chapterNumber,
        chapterTitle: concept.badge || 'Kubernetes Architecture',
        conceptNumber: concept.number,
        conceptTitle: concept.title,
        architectureType: 'Enterprise Kubernetes Operational Architecture',
        architecturalSummary:
          `Illustrates the end-to-end operational and architectural workflow for ${concept.title}, detailing component interactions, state transitions, and live diagnostic monitoring points.`,
        blocks: [
          { id: 'op-origin', label: 'Operational Trigger', sublabel: 'Admin / Event Source', category: 'client', icon: 'terminal', details: { role: 'Initiates configuration or monitoring probe.', cliDiagnostic: 'kubectl get all', keyInsight: 'Primary input trigger.' } },
          { id: 'op-control', label: 'Control Plane Manager', sublabel: 'Coordination Engine', category: 'control-plane', icon: 'server', details: { role: 'Orchestrates desired state and reconciles resources.', cliDiagnostic: 'kubectl get events -w', keyInsight: 'Central coordination hub.' } },
          { id: 'op-node', label: 'Host Node Agent', sublabel: 'Node Supervisor', category: 'node', icon: 'shield', details: { role: 'Executes low-level operational commands on the worker host.', cliDiagnostic: 'journalctl -u kubelet -n 50', keyInsight: 'Node-level executor.' } },
          { id: 'op-runtime', label: 'Workload & Telemetry', sublabel: 'Target Container Process', category: 'runtime', icon: 'box', details: { role: 'Maintains running state and streams logs / health status.', cliDiagnostic: 'kubectl logs -l app=demo', keyInsight: 'Final consumer of the operational workflow.' } },
        ],
        connections: [
          { from: 'op-origin', to: 'op-control', label: '1. Trigger operational action or policy', protocol: 'HTTPS / API', stepNumber: 1 },
          { from: 'op-control', to: 'op-node', label: '2. Reconcile state on host node', protocol: 'gRPC / Informer', stepNumber: 2 },
          { from: 'op-node', to: 'op-runtime', label: '3. Enforce runtime lifecycle & telemetry', protocol: 'CRI / Syscalls', stepNumber: 3 },
        ],
        steps: [
          { step: 1, title: 'Operational Event Dispatch', summary: 'Trigger initiates policy change or health probe check.', activeBlockIds: ['op-origin', 'op-control'], activeConnectionIdxs: [0], detailExplanation: { simpleWords: 'An operational task or check is launched in the cluster.', technicalMechanics: 'The API server accepts the event and updates the operational queue.' }, kubectlTrace: 'kubectl get events' },
          { step: 2, title: 'Control Plane Reconciliation', summary: 'Controllers evaluate state and distribute tasks to node agents.', activeBlockIds: ['op-control', 'op-node'], activeConnectionIdxs: [1], detailExplanation: { simpleWords: 'The master controller directs worker nodes to perform the required adjustments.', technicalMechanics: 'Informer watches process the delta and issue directives to Kubelet.' }, kubectlTrace: 'kubectl describe node' },
          { step: 3, title: 'Runtime Application & Telemetry', summary: 'Node executes state change and monitors telemetry pulse.', activeBlockIds: ['op-node', 'op-runtime'], activeConnectionIdxs: [2], detailExplanation: { simpleWords: 'The workload applies the change and reports its status back.', technicalMechanics: 'Kubelet and container runtime converge target state and stream health metrics.' }, kubectlTrace: 'kubectl get pods -o wide' },
        ],
      };
  }
}
