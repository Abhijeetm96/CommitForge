import type { KubeConcept } from '../topics/types';
import type { TopicFlowDiagramData } from '../../components/diagrams/kubeDiagramTypes';

// ============================================================================
// CHAPTER 1: INTRODUCTION TO KUBERNETES
// Cluster Control Plane Architecture & Declarative Request Lifecycle
// ============================================================================
const CHAPTER_1_FLOW: (c: KubeConcept) => TopicFlowDiagramData = (c) => ({
  chapterNumber: 1,
  chapterTitle: 'Introduction to Kubernetes',
  conceptNumber: c.number,
  conceptTitle: c.title,
  architectureType: 'Kubernetes Cluster Architecture & Declarative Request Lifecycle',
  architecturalSummary:
    'Illustrates the separation of Kubernetes Control Plane (API Server, etcd, Controller Manager, Scheduler) and Data Plane (Worker Nodes, Kubelet, Kube-Proxy, Container Engine), tracing how declarative user intent becomes running infrastructure.',
  blocks: [
    {
      id: 'cp1-client',
      label: 'kubectl Client',
      sublabel: 'Developer / CI Pipeline',
      category: 'client',
      icon: 'terminal',
      portOrProtocol: 'HTTPS / TLS',
      statusText: 'Originator',
      details: {
        role: 'Serializes declarative YAML manifests and submits HTTP requests to the cluster API.',
        processName: 'kubectl',
        cliDiagnostic: 'kubectl apply -f manifest.yaml -v=8',
        configLocation: '~/.kube/config',
        keyInsight: 'Communicates strictly over HTTPS with TLS client certificate or bearer token authentication.',
      },
    },
    {
      id: 'cp1-apiserver',
      label: 'kube-apiserver',
      sublabel: 'Control Plane Gateway',
      category: 'control-plane',
      icon: 'server',
      portOrProtocol: ':6443 HTTPS',
      statusText: 'Gatekeeper',
      details: {
        role: 'Validates schema, authenticates identity, enforces RBAC, runs admission webhooks, and acts as the single source of truth.',
        processName: 'kube-apiserver',
        cliDiagnostic: 'kubectl get --raw /livez',
        configLocation: '/etc/kubernetes/manifests/kube-apiserver.yaml',
        keyInsight: 'Stateless. Only component in the entire cluster that directly reads and writes to etcd.',
      },
    },
    {
      id: 'cp1-etcd',
      label: 'etcd Consensus Store',
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
      id: 'cp1-controller',
      label: 'kube-controller-manager',
      sublabel: 'Reconciliation Loops',
      category: 'control-plane',
      icon: 'cpu',
      portOrProtocol: ':10257 HTTPS',
      statusText: 'Reconciler',
      details: {
        role: 'Runs core control loops (Deployment, ReplicaSet, Node, EndpointSlice) reconciling desired vs actual state.',
        processName: 'kube-controller-manager',
        cliDiagnostic: 'kubectl get componentstatuses',
        configLocation: '/etc/kubernetes/manifests/kube-controller-manager.yaml',
        keyInsight: 'Continuously watches API Server etcd stream for deltas and triggers corrective actions.',
      },
    },
    {
      id: 'cp1-scheduler',
      label: 'kube-scheduler',
      sublabel: 'Workload Placement Engine',
      category: 'control-plane',
      icon: 'cpu',
      portOrProtocol: ':10259 HTTPS',
      statusText: 'Evaluator',
      details: {
        role: 'Watches for unscheduled Pods (spec.nodeName empty), filters candidate nodes, scores them, and assigns optimal nodes.',
        processName: 'kube-scheduler',
        cliDiagnostic: 'kubectl get events --field-selector reason=Scheduled',
        configLocation: '/etc/kubernetes/manifests/kube-scheduler.yaml',
        keyInsight: 'Operates in two primary phases: Filtering (predicates) and Scoring (priorities).',
      },
    },
    {
      id: 'cp1-kubelet',
      label: 'Kubelet Node Agent',
      sublabel: 'Worker Host Supervisor',
      category: 'node',
      icon: 'shield',
      portOrProtocol: ':10250 gRPC',
      statusText: 'Node Pilot',
      details: {
        role: 'Monitors API Server for Pods bound to its node; drives CRI container creation, volume mounting, and health checks.',
        processName: 'kubelet.service',
        cliDiagnostic: 'journalctl -u kubelet -f --no-tail',
        configLocation: '/var/lib/kubelet/config.yaml',
        keyInsight: 'Does not manage containers directly; delegates all container operations to CRI via gRPC sockets.',
      },
    },
    {
      id: 'cp1-proxy',
      label: 'kube-proxy & Runtime',
      sublabel: 'Networking & Container Engine',
      category: 'runtime',
      icon: 'box',
      portOrProtocol: 'iptables / CRI',
      statusText: 'Active Data Plane',
      details: {
        role: 'Programs host iptables/IPVS rules for ClusterIP routing and executes container processes via containerd.',
        processName: 'kube-proxy / containerd',
        cliDiagnostic: 'crictl ps && iptables -t nat -L KUBE-SERVICES',
        configLocation: '/etc/cni/net.d/',
        keyInsight: 'Runs on every worker node to form the distributed container execution mesh.',
      },
    },
  ],
  connections: [
    { from: 'cp1-client', to: 'cp1-apiserver', label: '1. HTTPS POST YAML manifest', protocol: 'HTTPS / TLS', stepNumber: 1 },
    { from: 'cp1-apiserver', to: 'cp1-etcd', label: '2. Persist desired state to Raft log', protocol: 'gRPC / Raft', stepNumber: 2 },
    { from: 'cp1-apiserver', to: 'cp1-controller', label: '3. Watch stream notifies controllers', protocol: 'HTTP/2 Watch', stepNumber: 3 },
    { from: 'cp1-controller', to: 'cp1-scheduler', label: '4. Emits unscheduled Pod event', protocol: 'API Object', stepNumber: 4 },
    { from: 'cp1-scheduler', to: 'cp1-kubelet', label: '5. Writes node binding; Kubelet picks up', protocol: 'POST /binding', stepNumber: 5 },
    { from: 'cp1-kubelet', to: 'cp1-proxy', label: '6. Instructs CRI to run containers & configure networking', protocol: 'CRI gRPC', stepNumber: 6 },
  ],
  steps: [
    {
      step: 1,
      title: 'Declarative Manifest Submission',
      summary: 'Engineer or CI/CD applies YAML to the API server.',
      activeBlockIds: ['cp1-client', 'cp1-apiserver'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'You hand your blueprint to the central manager (API Server).',
        technicalMechanics: 'kubectl sends HTTP POST with client cert authentication to kube-apiserver.',
      },
      kubectlTrace: 'kubectl apply -f manifest.yaml -v=6',
    },
    {
      step: 2,
      title: 'Validation & State Persistence',
      summary: 'API Server validates schema and writes atomically to etcd.',
      activeBlockIds: ['cp1-apiserver', 'cp1-etcd'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'The manager writes the order into the permanent cluster notebook (etcd).',
        technicalMechanics: 'Schema validation and RBAC pass; etcd commits record via Raft consensus.',
      },
      kubectlTrace: 'kubectl get all',
    },
    {
      step: 3,
      title: 'Controller Reconciliation',
      summary: 'Controllers observe the delta between desired state and reality.',
      activeBlockIds: ['cp1-apiserver', 'cp1-controller'],
      activeConnectionIdxs: [2],
      detailExplanation: {
        simpleWords: 'The controller notices 0 pods running when 3 are requested, so it creates 3 pod orders.',
        technicalMechanics: 'DeploymentController creates ReplicaSet; ReplicaSet generates unscheduled Pod objects.',
      },
      kubectlTrace: 'kubectl get replicasets',
    },
    {
      step: 4,
      title: 'Optimal Node Scheduling',
      summary: 'Kube-scheduler evaluates node capacity and binds the Pod to a node.',
      activeBlockIds: ['cp1-controller', 'cp1-scheduler', 'cp1-kubelet'],
      activeConnectionIdxs: [3, 4],
      detailExplanation: {
        simpleWords: 'The scheduler finds the best computer with enough free memory and assigns the work.',
        technicalMechanics: 'Filtering drops overloaded nodes; scoring picks highest rank and writes spec.nodeName.',
      },
      kubectlTrace: 'kubectl get events --field-selector reason=Scheduled',
    },
    {
      step: 5,
      title: 'Node Execution & Network Programming',
      summary: 'Kubelet pulls images and launches containers; kube-proxy programs network routes.',
      activeBlockIds: ['cp1-kubelet', 'cp1-proxy'],
      activeConnectionIdxs: [5],
      detailExplanation: {
        simpleWords: 'The local computer boots the container and connects it to the cluster phone network.',
        technicalMechanics: 'Kubelet invokes CRI (containerd) to start the pods, and kube-proxy updates iptables/IPVS rules.',
      },
      kubectlTrace: 'kubectl get pods -o wide',
    },
  ],
});

// ============================================================================
// CHAPTER 2: CONTAINERS & RUNTIMES
// OCI Container Runtime & Linux Kernel Isolation Pipeline
// ============================================================================
const CHAPTER_2_FLOW: (c: KubeConcept) => TopicFlowDiagramData = (c) => ({
  chapterNumber: 2,
  chapterTitle: 'Containers & Container Runtimes',
  conceptNumber: c.number,
  conceptTitle: c.title,
  architectureType: 'OCI Container Runtime & Linux Kernel Isolation Pipeline',
  architecturalSummary:
    'Demystifies container mechanics: shows how Docker/crictl passes OCI image bundles to containerd, which invokes runc to execute clone() system calls, creating isolated Linux namespaces (PID, NET, MNT, IPC) and cgroups v2 resource ceilings.',
  blocks: [
    {
      id: 'c2-cli',
      label: 'Container CLI / Kubelet',
      sublabel: 'crictl / docker CLI',
      category: 'client',
      icon: 'terminal',
      portOrProtocol: 'gRPC / UNIX Socket',
      statusText: 'Trigger',
      details: {
        role: 'Issues commands to pull images and run container processes.',
        processName: 'crictl / docker',
        cliDiagnostic: 'crictl pods && crictl ps',
        configLocation: '/etc/crictl.yaml',
        keyInsight: 'Talks to containerd through standard Container Runtime Interface (CRI) protobuf messages.',
      },
    },
    {
      id: 'c2-containerd',
      label: 'containerd High-Level Runtime',
      sublabel: 'Image Manager & Process Supervisor',
      category: 'runtime',
      icon: 'box',
      portOrProtocol: '/run/containerd/containerd.sock',
      statusText: 'Runtime Engine',
      details: {
        role: 'Manages complete container lifecycle: image pulling, snapshot layering, and execution handoff.',
        processName: 'containerd',
        cliDiagnostic: 'systemctl status containerd',
        configLocation: '/etc/containerd/config.toml',
        keyInsight: 'CNC-graduated industry standard high-level runtime powering both Docker and modern Kubernetes.',
      },
    },
    {
      id: 'c2-runc',
      label: 'runc Low-Level OCI Executor',
      sublabel: 'Kernel Isolation Tool',
      category: 'control-plane',
      icon: 'cpu',
      portOrProtocol: 'Linux Syscalls',
      statusText: 'Low-Level Spawner',
      details: {
        role: 'Interacts directly with the Linux kernel using clone(), setns(), and pivot_root() system calls.',
        processName: 'runc',
        cliDiagnostic: 'runc list',
        configLocation: 'OCI config.json',
        keyInsight: 'Reference implementation of the OCI Runtime Specification. Short-lived; exits once container process starts.',
      },
    },
    {
      id: 'c2-namespaces',
      label: 'Linux Kernel Namespaces',
      sublabel: 'Boundary Isolation (PID/NET/MNT/IPC)',
      category: 'security',
      icon: 'shield',
      portOrProtocol: 'clone() syscall flags',
      statusText: 'Virtual Isolation',
      details: {
        role: 'Provides process illusion: container sees only its own process tree (PID 1), network interfaces, and mounts.',
        processName: 'kernel namespace subsys',
        cliDiagnostic: 'ls -l /proc/$$/ns/',
        configLocation: 'Kernel Subsystem',
        keyInsight: 'Containers do not have virtual hardware; they are ordinary Linux processes running in restricted namespace views.',
      },
    },
    {
      id: 'c2-cgroups',
      label: 'Linux cgroups v2 Ceilings',
      sublabel: 'Hardware Resource Enforcer',
      category: 'node',
      icon: 'server',
      portOrProtocol: 'sysfs /sys/fs/cgroup',
      statusText: 'Resource Guard',
      details: {
        role: 'Limits, accounts, and isolates resource usage (CPU time via CFS, memory bytes, I/O bandwidth).',
        processName: 'cgroupfs v2',
        cliDiagnostic: 'cat /sys/fs/cgroup/cpu.max',
        configLocation: '/sys/fs/cgroup/',
        keyInsight: 'Memory limits trigger kernel OOMKiller; CPU limits trigger harmless thread throttling.',
      },
    },
  ],
  connections: [
    { from: 'c2-cli', to: 'c2-containerd', label: '1. Send RunPodSandbox / CreateContainer request', protocol: 'CRI gRPC', stepNumber: 1 },
    { from: 'c2-containerd', to: 'c2-runc', label: '2. Unpack layers & invoke runc with config.json', protocol: 'OCI Bundle', stepNumber: 2 },
    { from: 'c2-runc', to: 'c2-namespaces', label: '3. clone() with CLONE_NEWPID | CLONE_NEWNET', protocol: 'Kernel Syscall', stepNumber: 3 },
    { from: 'c2-runc', to: 'c2-cgroups', label: '4. Write CPU CFS quota & memory.max to cgroupfs', protocol: 'sysfs I/O', stepNumber: 4 },
  ],
  steps: [
    {
      step: 1,
      title: 'CRI Request Handshake',
      summary: 'Kubelet or CLI asks containerd to launch an application container.',
      activeBlockIds: ['c2-cli', 'c2-containerd'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'You tell the container manager: "Please start an isolated copy of my app."',
        technicalMechanics: 'CRI client sends RunPodSandbox and CreateContainer protobuf requests over the containerd UNIX socket.',
      },
      kubectlTrace: 'crictl pods',
    },
    {
      step: 2,
      title: 'Image Layer Unpacking & Bundle Creation',
      summary: 'containerd mounts overlayfs image layers and generates OCI config.json.',
      activeBlockIds: ['c2-containerd', 'c2-runc'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'The container manager stacks the read-only image layers and prepares the startup blueprint.',
        technicalMechanics: 'containerd creates an overlay2 mount for the container root filesystem and invokes runc.',
      },
      kubectlTrace: 'crictl images',
    },
    {
      step: 3,
      title: 'Kernel Namespace Boundary Setup',
      summary: 'runc calls clone() with namespace flags to isolate processes, network, and filesystems.',
      activeBlockIds: ['c2-runc', 'c2-namespaces'],
      activeConnectionIdxs: [2],
      detailExplanation: {
        simpleWords: 'The computer puts virtual blinders on the program so it can only see its own files and network port.',
        technicalMechanics: 'runc invokes clone(CLONE_NEWPID | CLONE_NEWNET | CLONE_NEWNS | CLONE_NEWIPC | CLONE_NEWUTS).',
      },
      kubectlTrace: 'ls -l /proc/self/ns',
    },
    {
      step: 4,
      title: 'Hardware Resource Clamping (cgroups)',
      summary: 'runc writes CPU and memory bounds to sysfs so the container cannot starve neighbors.',
      activeBlockIds: ['c2-runc', 'c2-cgroups'],
      activeConnectionIdxs: [3],
      detailExplanation: {
        simpleWords: 'The system locks the maximum memory and CPU speed the program is allowed to consume.',
        technicalMechanics: 'Writes memory limits to /sys/fs/cgroup/memory.max and CPU quotas to cpu.max.',
      },
      kubectlTrace: 'cat /sys/fs/cgroup/memory.current',
    },
  ],
});

// ============================================================================
// CHAPTER 3: SETTING UP KUBERNETES
// Cluster Bootstrap & Kubeconfig Authentication Handshake
// ============================================================================
const CHAPTER_3_FLOW: (c: KubeConcept) => TopicFlowDiagramData = (c) => ({
  chapterNumber: 3,
  chapterTitle: 'Setting Up Kubernetes',
  conceptNumber: c.number,
  conceptTitle: c.title,
  architectureType: 'Cluster Bootstrap & Kubeconfig Authentication Handshake',
  architecturalSummary:
    'Shows how local or cloud clusters boot up and how kubectl loads cluster credentials (~/.kube/config: clusters, contexts, users) to establish mutual TLS (mTLS) with kube-apiserver and initialize worker nodes.',
  blocks: [
    {
      id: 'c3-config',
      label: '~/.kube/config File',
      sublabel: 'Contexts, Clusters, Users',
      category: 'client',
      icon: 'file-text',
      portOrProtocol: 'YAML / Base64 Certs',
      statusText: 'Credentials',
      details: {
        role: 'Contains cluster API endpoints, client certificates, CA authority, and active context selection.',
        processName: 'kubeconfig',
        cliDiagnostic: 'kubectl config view --minify',
        configLocation: '~/.kube/config',
        keyInsight: 'Allows seamlessly switching between local (minikube, kind) and cloud clusters (GKE, EKS, AKS).',
      },
    },
    {
      id: 'c3-kubectl',
      label: 'kubectl CLI Client',
      sublabel: 'API Command Intermediary',
      category: 'client',
      icon: 'terminal',
      portOrProtocol: 'TLS 1.3 / HTTPS',
      statusText: 'Communicator',
      details: {
        role: 'Parses CLI flags, loads active credentials, and formats RESTful HTTPS requests to cluster endpoint.',
        processName: 'kubectl',
        cliDiagnostic: 'kubectl cluster-info',
        configLocation: 'PATH binary',
        keyInsight: 'Client-side tool only. Validates certificates before sending any packet to the remote API.',
      },
    },
    {
      id: 'c3-apiserver',
      label: 'Control Plane API Gateway',
      sublabel: 'Mutual TLS Authentication Handshake',
      category: 'control-plane',
      icon: 'server',
      portOrProtocol: ':6443 HTTPS',
      statusText: 'Validator',
      details: {
        role: 'Verifies client certificates against cluster CA, decodes bearer tokens, and returns cluster status.',
        processName: 'kube-apiserver',
        cliDiagnostic: 'kubectl get --raw /healthz',
        configLocation: '/etc/kubernetes/pki/ca.crt',
        keyInsight: 'Denies any connection that fails x509 validation or lacks proper signing authority.',
      },
    },
    {
      id: 'c3-nodes',
      label: 'Cluster Worker Nodes Fleet',
      sublabel: 'Registered Compute Hosts',
      category: 'node',
      icon: 'shield',
      portOrProtocol: 'Kubelet Node Heartbeat',
      statusText: 'Ready Fleet',
      details: {
        role: 'Nodes report status, allocatable compute, and software versions back to the Control Plane.',
        processName: 'kubelet node lease',
        cliDiagnostic: 'kubectl get nodes -o wide',
        configLocation: 'Node status lease',
        keyInsight: 'Cluster is only usable once at least one worker node transitions to the "Ready" condition.',
      },
    },
  ],
  connections: [
    { from: 'c3-config', to: 'c3-kubectl', label: '1. Load active context & client credentials', protocol: 'Local File', stepNumber: 1 },
    { from: 'c3-kubectl', to: 'c3-apiserver', label: '2. Initiate mTLS handshake with API server', protocol: 'TLS 1.3 :6443', stepNumber: 2 },
    { from: 'c3-apiserver', to: 'c3-nodes', label: '3. Verify worker node leases & cluster health', protocol: 'Cluster Network', stepNumber: 3 },
  ],
  steps: [
    {
      step: 1,
      title: 'Kubeconfig Context Resolution',
      summary: 'kubectl reads ~/.kube/config to determine target API URL and identity certificates.',
      activeBlockIds: ['c3-config', 'c3-kubectl'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'kubectl looks at your passport file to see which cluster you want to talk to.',
        technicalMechanics: 'Resolves current-context to find cluster URL, client-certificate-data, and client-key-data.',
      },
      kubectlTrace: 'kubectl config current-context',
    },
    {
      step: 2,
      title: 'Mutual TLS Handshake',
      summary: 'kubectl and kube-apiserver verify each other using cryptographic certificates.',
      activeBlockIds: ['c3-kubectl', 'c3-apiserver'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'Your computer and the cluster securely shake hands and prove their identities.',
        technicalMechanics: 'Client validates server TLS cert against certificate-authority-data; server validates client x509 cert.',
      },
      kubectlTrace: 'kubectl cluster-info',
    },
    {
      step: 3,
      title: 'Node Discovery & Cluster Readiness',
      summary: 'Control plane confirms worker nodes are registered, healthy, and reporting Ready.',
      activeBlockIds: ['c3-apiserver', 'c3-nodes'],
      activeConnectionIdxs: [2],
      detailExplanation: {
        simpleWords: 'The master checks that worker machines are powered on and ready to take jobs.',
        technicalMechanics: 'Kubelet lease heartbeats update node status to Ready in the API server.',
      },
      kubectlTrace: 'kubectl get nodes',
    },
  ],
});

// ============================================================================
// CHAPTER 4: RUNNING APPLICATIONS WITH PODS
// Pod Lifecycle & Low-Level Runtime Plumbing (Moved to Chapter 4!)
// ============================================================================
const CHAPTER_4_FLOW: (c: KubeConcept) => TopicFlowDiagramData = (c) => ({
  chapterNumber: 4,
  chapterTitle: 'Running Applications with Pods',
  conceptNumber: c.number,
  conceptTitle: c.title,
  architectureType: 'Pod Lifecycle & Low-Level Runtime Plumbing',
  architecturalSummary:
    'Shows how a declarative Pod manifest travels from client submission through the Kubernetes Control Plane to the host node where Kubelet and containerd (CRI) initialize the Pause container (netns/IPC) and launch application containers.',
  blocks: [
    {
      id: 'c4-kubectl',
      label: 'kubectl Client',
      sublabel: 'Declarative Manifest Author',
      category: 'client',
      icon: 'terminal',
      portOrProtocol: 'HTTPS / TLS',
      statusText: 'Originator',
      details: {
        role: 'Submits declarative Pod or Deployment YAML manifest to the cluster API.',
        processName: 'kubectl',
        cliDiagnostic: 'kubectl apply -f pod.yaml',
        configLocation: '~/.kube/config',
        keyInsight: 'Encapsulates container specifications into atomic Pod definitions.',
      },
    },
    {
      id: 'c4-apiserver',
      label: 'kube-apiserver',
      sublabel: 'API Gateway & Schema Validator',
      category: 'control-plane',
      icon: 'server',
      portOrProtocol: ':6443 HTTPS',
      statusText: 'Gatekeeper',
      details: {
        role: 'Validates Pod schema, injects defaults (e.g. RestartPolicy=Always), and saves record to etcd.',
        processName: 'kube-apiserver',
        cliDiagnostic: 'kubectl get pod -o yaml',
        configLocation: '/etc/kubernetes/manifests/kube-apiserver.yaml',
        keyInsight: 'Sets initial Pod status to "Pending" awaiting scheduler assignment.',
      },
    },
    {
      id: 'c4-scheduler',
      label: 'kube-scheduler',
      sublabel: 'Node Assignment Engine',
      category: 'control-plane',
      icon: 'cpu',
      portOrProtocol: ':10259 HTTPS',
      statusText: 'Evaluator',
      details: {
        role: 'Selects the optimal worker node based on CPU/RAM requests, affinities, and taints.',
        processName: 'kube-scheduler',
        cliDiagnostic: 'kubectl describe pod <name> | grep "Events:"',
        configLocation: '/etc/kubernetes/manifests/kube-scheduler.yaml',
        keyInsight: 'Writes the spec.nodeName field atomically to bind the Pod to the chosen node.',
      },
    },
    {
      id: 'c4-kubelet',
      label: 'Kubelet Node Agent',
      sublabel: 'Pod Lifecycle Driver',
      category: 'node',
      icon: 'shield',
      portOrProtocol: ':10250 gRPC',
      statusText: 'Supervisor',
      details: {
        role: 'Notices Pod assigned to this node, sets status to ContainerCreating, and invokes CRI.',
        processName: 'kubelet',
        cliDiagnostic: 'journalctl -u kubelet -f',
        configLocation: '/var/lib/kubelet/config.yaml',
        keyInsight: 'Monitors container states, restarts crashed containers, and executes health probes.',
      },
    },
    {
      id: 'c4-containerd',
      label: 'CRI (containerd)',
      sublabel: 'Container Runtime Interface',
      category: 'runtime',
      icon: 'box',
      portOrProtocol: '/run/containerd/containerd.sock',
      statusText: 'Process Spawner',
      details: {
        role: 'Pulls OCI images, mounts overlayfs storage layers, and spawns isolated Linux processes.',
        processName: 'containerd',
        cliDiagnostic: 'crictl ps',
        configLocation: '/etc/containerd/config.toml',
        keyInsight: 'First initializes the Pause container sandbox, then starts the workload containers inside it.',
      },
    },
    {
      id: 'c4-pause',
      label: 'Pause Container',
      sublabel: 'Shared Network & IPC Namespace',
      category: 'network',
      icon: 'network',
      portOrProtocol: 'veth / lo (Pod IP)',
      statusText: 'Namespace Anchor',
      details: {
        role: 'Holds open the Linux network and IPC namespaces and holds the Pod IP address.',
        processName: 'pause (PID 1 in netns)',
        cliDiagnostic: 'crictl inspectp <pod_id>',
        configLocation: 'k8s.gcr.io/pause:3.9',
        keyInsight: 'All containers inside the same Pod join this network namespace and talk via localhost.',
      },
    },
    {
      id: 'c4-containers',
      label: 'App & Sidecar Containers',
      sublabel: 'Workload Execution Units',
      category: 'runtime',
      icon: 'box',
      portOrProtocol: 'localhost:<port>',
      statusText: 'Running Workload',
      details: {
        role: 'The user application and helper processes (sidecars) running inside the shared Pod boundary.',
        processName: 'app process',
        cliDiagnostic: 'kubectl logs <pod> -c <container>',
        configLocation: '/var/log/pods/',
        keyInsight: 'Share the exact same IP, port space, and mounted volumes.',
      },
    },
  ],
  connections: [
    { from: 'c4-kubectl', to: 'c4-apiserver', label: '1. Apply Pod manifest', protocol: 'HTTPS / TLS', stepNumber: 1 },
    { from: 'c4-apiserver', to: 'c4-scheduler', label: '2. Unscheduled Pod (Pending phase)', protocol: 'Informer Watch', stepNumber: 2 },
    { from: 'c4-scheduler', to: 'c4-kubelet', label: '3. Bind to worker node (spec.nodeName)', protocol: 'POST /binding', stepNumber: 3 },
    { from: 'c4-kubelet', to: 'c4-containerd', label: '4. RunPodSandbox & CreateContainer (ContainerCreating phase)', protocol: 'CRI gRPC', stepNumber: 4 },
    { from: 'c4-containerd', to: 'c4-pause', label: '5. Launch Pause container to anchor network namespace & IP', protocol: 'setns() syscall', stepNumber: 5 },
    { from: 'c4-pause', to: 'c4-containers', label: '6. Join app containers to netns -> Running phase', protocol: 'localhost loopback', stepNumber: 6 },
  ],
  steps: [
    {
      step: 1,
      title: 'Pod Submission & Acceptance',
      summary: 'Pod manifest is validated by the API Server and marked as Pending.',
      activeBlockIds: ['c4-kubectl', 'c4-apiserver'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'You submit your Pod blueprint to Kubernetes.',
        technicalMechanics: 'API server validates spec, injects default values, and saves to etcd in Pending phase.',
      },
      kubectlTrace: 'kubectl get pod',
    },
    {
      step: 2,
      title: 'Node Placement Evaluation',
      summary: 'kube-scheduler filters and scores nodes to select the execution host.',
      activeBlockIds: ['c4-apiserver', 'c4-scheduler'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'The scheduler checks node RAM and CPU to choose where the Pod will live.',
        technicalMechanics: 'Scheduler applies filter predicates and scoring algorithms, binding spec.nodeName.',
      },
      kubectlTrace: 'kubectl describe pod',
    },
    {
      step: 3,
      title: 'Node Agent Takeover (ContainerCreating)',
      summary: 'Worker node Kubelet detects binding and commands containerd to prepare the sandbox.',
      activeBlockIds: ['c4-scheduler', 'c4-kubelet', 'c4-containerd'],
      activeConnectionIdxs: [2, 3],
      detailExplanation: {
        simpleWords: 'The worker node wakes up and starts pulling images.',
        technicalMechanics: 'Kubelet updates Pod phase to ContainerCreating and issues RunPodSandbox CRI call.',
      },
      kubectlTrace: 'kubectl get events -w',
    },
    {
      step: 4,
      title: 'Pause Container Initialization (Namespace Anchor)',
      summary: 'containerd launches the pause container to hold open shared network and IPC namespaces.',
      activeBlockIds: ['c4-containerd', 'c4-pause'],
      activeConnectionIdxs: [4],
      detailExplanation: {
        simpleWords: 'A tiny sleeper program creates the shared hotel room (IP address and network loopback).',
        technicalMechanics: 'runc starts the 700KB pause binary as PID 1 in the new network namespace.',
      },
      kubectlTrace: 'crictl pods',
    },
    {
      step: 5,
      title: 'Application Execution & Running Phase',
      summary: 'Workload containers join the network namespace; health probes pass and Pod transitions to Running.',
      activeBlockIds: ['c4-pause', 'c4-containers'],
      activeConnectionIdxs: [5],
      detailExplanation: {
        simpleWords: 'Your app containers start up inside the shared room and start serving traffic.',
        technicalMechanics: 'App containers join the netns via setns(), execute CMD entrypoint, and report Running phase.',
      },
      kubectlTrace: 'kubectl get pod -o wide',
    },
  ],
});

// ============================================================================
// CHAPTER 5: SERVICES & NETWORKING
// Virtual Networking, Services & Ingress Packet Path
// ============================================================================
const CHAPTER_5_FLOW: (c: KubeConcept) => TopicFlowDiagramData = (c) => ({
  chapterNumber: 5,
  chapterTitle: 'Services & Networking',
  conceptNumber: c.number,
  conceptTitle: c.title,
  architectureType: 'Kubernetes Virtual Networking & Ingress Packet Path',
  architecturalSummary:
    'Traces an incoming user request through Ingress L7 routing, CoreDNS service discovery, ClusterIP virtual IP translation via kube-proxy (iptables / IPVS / eBPF), and EndpointSlice load balancing to reach target Pod veth interfaces.',
  blocks: [
    {
      id: 'c5-client',
      label: 'End User / Browser',
      sublabel: 'External Public Internet',
      category: 'client',
      icon: 'network',
      portOrProtocol: 'HTTPS :443',
      statusText: 'Client',
      details: {
        role: 'Makes HTTP requests to https://api.mycompany.com resolved to cloud LoadBalancer IP.',
        processName: 'Browser / Curl',
        cliDiagnostic: 'curl -iv https://api.mycompany.com',
        configLocation: 'Public Internet',
        keyInsight: 'Has no knowledge of private cluster IPs or transient Pod lifecycles.',
      },
    },
    {
      id: 'c5-ingress',
      label: 'Ingress Controller',
      sublabel: 'L7 Reverse Proxy (Nginx / Envoy)',
      category: 'network',
      icon: 'network',
      portOrProtocol: ':80 / :443 -> HostPort',
      statusText: 'Edge Router',
      details: {
        role: 'Inspects HTTP Host and Path headers, terminates TLS certificates, and routes to backend Kubernetes Services.',
        processName: 'ingress-nginx',
        cliDiagnostic: 'kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx',
        configLocation: '/etc/nginx/nginx.conf',
        keyInsight: 'Provides virtual hosting and path-based routing for dozens of distinct services on one public IP.',
      },
    },
    {
      id: 'c5-service',
      label: 'ClusterIP Service',
      sublabel: 'Stable Virtual IP Abstraction',
      category: 'network',
      icon: 'layers',
      portOrProtocol: 'VIP 10.96.0.0/12',
      statusText: 'Virtual Anchor',
      details: {
        role: 'Stable virtual IP that never changes when underlying Pods crash or roll out updates.',
        processName: 'Service Virtual IP',
        cliDiagnostic: 'kubectl get svc web-service',
        configLocation: 'API Server Service object',
        keyInsight: 'ClusterIP is purely virtual; it has no network interface and exists only in iptables/IPVS routing tables.',
      },
    },
    {
      id: 'c5-kubeproxy',
      label: 'kube-proxy / eBPF',
      sublabel: 'Packet Translation Engine',
      category: 'node',
      icon: 'cpu',
      portOrProtocol: 'iptables NAT / IPVS',
      statusText: 'Packet Switcher',
      details: {
        role: 'Watches EndpointSlices and programs DNAT packet rewriting rules into host Linux kernel.',
        processName: 'kube-proxy daemon',
        cliDiagnostic: 'iptables-save | grep KUBE-SVC',
        configLocation: '/var/lib/kube-proxy/config.conf',
        keyInsight: 'Randomly rewrites destination virtual IP to a healthy target Pod IP address.',
      },
    },
    {
      id: 'c5-endpoints',
      label: 'EndpointSlices',
      sublabel: 'Healthy Pod IP List',
      category: 'control-plane',
      icon: 'activity',
      portOrProtocol: 'Pod IP:Port Tuples',
      statusText: 'Health Filter',
      details: {
        role: 'Tracks currently ready Pod IP addresses. Unhealthy pods failing readiness probes are instantly removed.',
        processName: 'EndpointSlice Controller',
        cliDiagnostic: 'kubectl get endpointslices',
        configLocation: 'Discovery API',
        keyInsight: 'Scales much better than legacy Endpoints objects in 10,000+ pod clusters.',
      },
    },
    {
      id: 'c5-pod',
      label: 'Target Backend Pod',
      sublabel: 'Workload veth Interface',
      category: 'runtime',
      icon: 'box',
      portOrProtocol: '10.244.1.45:8080',
      statusText: 'Serving',
      details: {
        role: 'Executes application logic, processes the HTTP request, and returns responses.',
        processName: 'Node / Go / Python process',
        cliDiagnostic: 'kubectl logs -l app=web --tail=20',
        configLocation: 'Pod Network Namespace',
        keyInsight: 'Receives the original HTTP request and communicates over its veth virtual ethernet pair.',
      },
    },
  ],
  connections: [
    { from: 'c5-client', to: 'c5-ingress', label: '1. User sends HTTPS request to domain', protocol: 'Public Internet TLS', stepNumber: 1 },
    { from: 'c5-ingress', to: 'c5-service', label: '2. Ingress evaluates host/path and routes to Service', protocol: 'HTTP L7 Routing', stepNumber: 2 },
    { from: 'c5-service', to: 'c5-kubeproxy', label: '3. ClusterIP intercepted by host network rules', protocol: 'DNAT Translation', stepNumber: 3 },
    { from: 'c5-kubeproxy', to: 'c5-endpoints', label: '4. Queries healthy target Pod IP list', protocol: 'EndpointSlice Sync', stepNumber: 4 },
    { from: 'c5-endpoints', to: 'c5-pod', label: '5. Packet forwarded to selected healthy Pod veth', protocol: 'Overlay Network (CNI)', stepNumber: 5 },
  ],
  steps: [
    {
      step: 1,
      title: 'Public Edge Ingestion',
      summary: 'Public HTTP traffic reaches the cluster Ingress Controller.',
      activeBlockIds: ['c5-client', 'c5-ingress'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'A customer visits your website; the request hits the front door router.',
        technicalMechanics: 'DNS resolves to the cloud LoadBalancer; Ingress terminates TLS.',
      },
      kubectlTrace: 'kubectl get ingress',
    },
    {
      step: 2,
      title: 'Layer-7 Path Routing',
      summary: 'Ingress rules match the HTTP path and select the backend Service.',
      activeBlockIds: ['c5-ingress', 'c5-service'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'The front door router checks the URL path (/api) and sends it to the API service.',
        technicalMechanics: 'Nginx evaluates location blocks and forwards to internal service ClusterIP.',
      },
      kubectlTrace: 'kubectl describe ingress',
    },
    {
      step: 3,
      title: 'Service Virtual IP Translation',
      summary: 'kube-proxy rules intercept the Virtual IP and perform destination NAT.',
      activeBlockIds: ['c5-service', 'c5-kubeproxy'],
      activeConnectionIdxs: [2],
      detailExplanation: {
        simpleWords: 'The virtual service number is converted into the real address of an active worker.',
        technicalMechanics: 'Linux kernel iptables/IPVS performs DNAT, rewriting the ClusterIP to a Pod IP.',
      },
      kubectlTrace: 'kubectl get svc',
    },
    {
      step: 4,
      title: 'EndpointSlice Healthy Pod Selection',
      summary: 'Only pods with passing Readiness probes are selected for traffic delivery.',
      activeBlockIds: ['c5-kubeproxy', 'c5-endpoints'],
      activeConnectionIdxs: [3],
      detailExplanation: {
        simpleWords: 'The system only sends traffic to workers that have reported: "I am ready!"',
        technicalMechanics: 'EndpointSlice controller filters out any pod with Ready=False condition.',
      },
      kubectlTrace: 'kubectl get endpointslices',
    },
    {
      step: 5,
      title: 'Packet Delivery to Pod Network Namespace',
      summary: 'CNI plugin routes packet across host veth pair directly to the application container.',
      activeBlockIds: ['c5-endpoints', 'c5-pod'],
      activeConnectionIdxs: [4],
      detailExplanation: {
        simpleWords: 'The packet arrives inside the application container, which sends back the response.',
        technicalMechanics: 'Linux bridge/veth pair pushes packet into container network namespace on port 8080.',
      },
      kubectlTrace: 'kubectl get pods -o wide',
    },
  ],
});

// ============================================================================
// CHAPTER 6: CONFIGURATION MANAGEMENT
// Decoupled Configuration & Encrypted Secret Projection
// ============================================================================
const CHAPTER_6_FLOW: (c: KubeConcept) => TopicFlowDiagramData = (c) => ({
  chapterNumber: 6,
  chapterTitle: 'Configuration Management',
  conceptNumber: c.number,
  conceptTitle: c.title,
  architectureType: 'Decoupled Configuration & Encrypted Secret Projection',
  architecturalSummary:
    'Details the lifecycle of ConfigMaps and Secrets: from creation and etcd encryption at rest to Kubelet VolumeManager mounting tmpfs in-memory volumes and environment variable injection into container runtimes.',
  blocks: [
    {
      id: 'c6-author',
      label: 'Cluster Admin / CI',
      sublabel: 'Config & Secret Author',
      category: 'client',
      icon: 'terminal',
      portOrProtocol: 'kubectl create secret',
      statusText: 'Author',
      details: {
        role: 'Submits non-sensitive configs (ConfigMaps) and sensitive credentials (Secrets).',
        processName: 'kubectl',
        cliDiagnostic: 'kubectl create secret generic db-pass --from-literal=password=secret123',
        configLocation: '~/.kube/config',
        keyInsight: 'Secrets should never be stored in plaintext git repositories without SealedSecrets or Vault.',
      },
    },
    {
      id: 'c6-apiserver',
      label: 'kube-apiserver',
      sublabel: 'Encryption Provider Gateway',
      category: 'control-plane',
      icon: 'server',
      portOrProtocol: ':6443 HTTPS',
      statusText: 'Encryptor',
      details: {
        role: 'Validates resource schema and encrypts Secret payloads with AES-GCM or KMS before writing to etcd.',
        processName: 'kube-apiserver',
        cliDiagnostic: 'kubectl get secret db-pass -o yaml',
        configLocation: '/etc/kubernetes/manifests/kube-apiserver.yaml',
        keyInsight: 'Base64 is NOT encryption! Real encryption requires EncryptionConfiguration with KMS or AES keys.',
      },
    },
    {
      id: 'c6-etcd',
      label: 'etcd (Encrypted at Rest)',
      sublabel: 'Encrypted Persistence',
      category: 'storage',
      icon: 'database',
      portOrProtocol: 'AES-GCM Ciphertext',
      statusText: 'Cipher Store',
      details: {
        role: 'Stores encrypted bytes under /registry/secrets/<namespace>/<name>. Direct disk reads show ciphertext.',
        processName: 'etcd',
        cliDiagnostic: 'etcdctl get /registry/secrets/default/db-pass',
        configLocation: '/var/lib/etcd',
        keyInsight: 'Even if physical disks are stolen, credentials cannot be decrypted without the KMS key.',
      },
    },
    {
      id: 'c6-volmanager',
      label: 'Kubelet VolumeManager',
      sublabel: 'tmpfs RAM Mount Engine',
      category: 'node',
      icon: 'shield',
      portOrProtocol: 'tmpfs RAM Disk',
      statusText: 'Mount Manager',
      details: {
        role: 'Projects secret values into in-memory tmpfs filesystem volumes so credentials never touch host disk.',
        processName: 'kubelet volume worker',
        cliDiagnostic: 'df -h | grep tmpfs',
        configLocation: '/var/lib/kubelet/pods/<pod-id>/volumes/',
        keyInsight: 'Atomic updates: ConfigMap volume mounts update automatically within minutes without restarting pods.',
      },
    },
    {
      id: 'c6-container',
      label: 'Workload Container',
      sublabel: 'Application Consumer',
      category: 'runtime',
      icon: 'box',
      portOrProtocol: 'Env Var / File Path',
      statusText: 'Decoupled',
      details: {
        role: 'Reads configuration from injected environment variables or mounted /etc/secrets files.',
        processName: 'App Process',
        cliDiagnostic: 'kubectl exec <pod> -- env',
        configLocation: '/etc/config /etc/secrets',
        keyInsight: '12-Factor App design: same binary image runs across Dev, Staging, and Production unchanged.',
      },
    },
  ],
  connections: [
    { from: 'c6-author', to: 'c6-apiserver', label: '1. Create ConfigMap / Secret', protocol: 'HTTPS / TLS', stepNumber: 1 },
    { from: 'c6-apiserver', to: 'c6-etcd', label: '2. Encrypt with KMS & persist to etcd', protocol: 'AES-GCM / Raft', stepNumber: 2 },
    { from: 'c6-apiserver', to: 'c6-volmanager', label: '3. Kubelet fetches decrypted secret for scheduled Pod', protocol: 'mTLS Pull', stepNumber: 3 },
    { from: 'c6-volmanager', to: 'c6-container', label: '4. Project into tmpfs RAM mount or inject as env var', protocol: 'bind mount', stepNumber: 4 },
  ],
  steps: [
    {
      step: 1,
      title: 'Configuration Authoring',
      summary: 'Admin declares configuration or credentials decoupled from application images.',
      activeBlockIds: ['c6-author', 'c6-apiserver'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'You store database passwords and settings in separate cluster safety deposit boxes.',
        technicalMechanics: 'kubectl applies ConfigMap and Secret manifests over authenticated HTTPS.',
      },
      kubectlTrace: 'kubectl get configmap,secrets',
    },
    {
      step: 2,
      title: 'Encryption at Rest in etcd',
      summary: 'kube-apiserver encrypts sensitive fields using cryptographic KMS before writing to disk.',
      activeBlockIds: ['c6-apiserver', 'c6-etcd'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'The master scrambles passwords with a secret key so no one can steal them off the disk.',
        technicalMechanics: 'EncryptionConfiguration provider encodes secret data via envelope encryption into etcd.',
      },
      kubectlTrace: 'kubectl describe secret',
    },
    {
      step: 3,
      title: 'In-Memory Volume Projection',
      summary: 'Kubelet fetches secrets and mounts them on host tmpfs RAM disks.',
      activeBlockIds: ['c6-apiserver', 'c6-volmanager'],
      activeConnectionIdxs: [2],
      detailExplanation: {
        simpleWords: 'The worker node holds the passwords purely in RAM so they never get written to hard drives.',
        technicalMechanics: 'Kubelet VolumeManager creates tmpfs mount points inside the pod directory structure.',
      },
      kubectlTrace: 'kubectl get pod -o yaml',
    },
    {
      step: 4,
      title: 'Workload Consumption (12-Factor)',
      summary: 'Application reads settings as files or environment variables with zero code changes.',
      activeBlockIds: ['c6-volmanager', 'c6-container'],
      activeConnectionIdxs: [3],
      detailExplanation: {
        simpleWords: 'Your app reads its database password from a file or environment variable on startup.',
        technicalMechanics: 'Container process boots with envFrom or volumeMounts pointing to projected tmpfs files.',
      },
      kubectlTrace: 'kubectl exec <pod> -- env',
    },
  ],
});

// ============================================================================
// CHAPTER 7: RESOURCE MANAGEMENT
// Resource Quotas, Limits & Linux cgroups Isolation
// ============================================================================
const CHAPTER_7_FLOW: (c: KubeConcept) => TopicFlowDiagramData = (c) => ({
  chapterNumber: 7,
  chapterTitle: 'Resource Management',
  conceptNumber: c.number,
  conceptTitle: c.title,
  architectureType: 'Resource Quotas & Linux cgroups Isolation',
  architecturalSummary:
    'Shows how Namespace boundaries, ResourceQuotas, LimitRanges, and Linux cgroups (CFS quota & memory limits) prevent noisy neighbors and enforce fair multi-tenant sharing.',
  blocks: [
    {
      id: 'c7-ns',
      label: 'Tenant Namespace',
      sublabel: 'Logical Isolation Boundary',
      category: 'client',
      icon: 'layers',
      portOrProtocol: 'Namespace Scope',
      statusText: 'Tenant Boundary',
      details: {
        role: 'Isolates resources, service accounts, and network policies per team.',
        processName: 'Namespace Object',
        cliDiagnostic: 'kubectl get namespaces',
        configLocation: 'API Object',
        keyInsight: 'Provides soft multi-tenancy within a single shared cluster.',
      },
    },
    {
      id: 'c7-quota',
      label: 'ResourceQuota Controller',
      sublabel: 'Team Capacity Budget',
      category: 'control-plane',
      icon: 'shield',
      portOrProtocol: 'Admission Check',
      statusText: 'Budget Guard',
      details: {
        role: 'Prevents a single team from exceeding CPU/RAM/Pod allowances.',
        processName: 'ResourceQuota Controller',
        cliDiagnostic: 'kubectl describe resourcequota',
        configLocation: '/etc/kubernetes/',
        keyInsight: 'Enforced at admission time; rejects pods if quota is full.',
      },
    },
    {
      id: 'c7-limit',
      label: 'LimitRange Admission',
      sublabel: 'Container Defaulting',
      category: 'control-plane',
      icon: 'cpu',
      portOrProtocol: 'Mutation Webhook',
      statusText: 'Defaulting Hook',
      details: {
        role: 'Injects default requests and limits if developer omitted them.',
        processName: 'LimitRange Plugin',
        cliDiagnostic: 'kubectl describe limitrange',
        configLocation: 'API Admission Plugin',
        keyInsight: 'Guarantees every container has defined bounds.',
      },
    },
    {
      id: 'c7-cgroup',
      label: 'Linux cgroups (CFS & Memory)',
      sublabel: 'Kernel Resource Enforcer',
      category: 'runtime',
      icon: 'box',
      portOrProtocol: 'sysfs cgroups v2',
      statusText: 'Kernel Enforcer',
      details: {
        role: 'Throttles CPU (CFS quota) and triggers OOM Killer if RAM limit is breached.',
        processName: 'Linux Kernel cgroupfs',
        cliDiagnostic: 'cat /sys/fs/cgroup/cpu.max',
        configLocation: '/sys/fs/cgroup/',
        keyInsight: 'CPU is compressible (causes throttling); Memory is non-compressible (causes OOMKill 137).',
      },
    },
  ],
  connections: [
    { from: 'c7-ns', to: 'c7-quota', label: '1. Submit Pod in tenant namespace', protocol: 'API Request', stepNumber: 1 },
    { from: 'c7-quota', to: 'c7-limit', label: '2. Check team quota -> Apply default limits', protocol: 'Admission Hook', stepNumber: 2 },
    { from: 'c7-limit', to: 'c7-cgroup', label: '3. Kubelet configures host kernel cgroups', protocol: 'cgroups v2 sysfs', stepNumber: 3 },
  ],
  steps: [
    {
      step: 1,
      title: 'Namespace Scoped Submission',
      summary: 'Workload submitted within designated team boundary.',
      activeBlockIds: ['c7-ns', 'c7-quota'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'A team submits a workload inside their private cluster room (namespace).',
        technicalMechanics: 'API server scopes RBAC and resource queries to the target namespace.',
      },
      kubectlTrace: 'kubectl get resourcequota -n team-a',
    },
    {
      step: 2,
      title: 'Quota Audit & Default Injection',
      summary: 'ResourceQuota audits cumulative usage; LimitRange injects defaults.',
      activeBlockIds: ['c7-quota', 'c7-limit'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'The system checks if the team has budget left and sets safe default CPU/RAM sizes.',
        technicalMechanics: 'ResourceQuota admission controller locks and validates namespace cumulative requests against limits.',
      },
      kubectlTrace: 'kubectl describe quota',
    },
    {
      step: 3,
      title: 'Kernel cgroup Programming',
      summary: 'Kubelet writes CPU CFS quota and memory limit into host kernel cgroups.',
      activeBlockIds: ['c7-limit', 'c7-cgroup'],
      activeConnectionIdxs: [2],
      detailExplanation: {
        simpleWords: 'The Linux kernel enforces strict resource boundaries so no program can hog the computer.',
        technicalMechanics: 'Writes to /sys/fs/cgroup/memory.max and cpu.max to enforce bandwidth and memory ceilings.',
      },
      kubectlTrace: 'kubectl top pod',
    },
  ],
});

// ============================================================================
// CHAPTER 8: SECURITY & RBAC
// API Server Admission & Security Chain
// ============================================================================
const CHAPTER_8_FLOW: (c: KubeConcept) => TopicFlowDiagramData = (c) => ({
  chapterNumber: 8,
  chapterTitle: 'Security',
  conceptNumber: c.number,
  conceptTitle: c.title,
  architectureType: 'API Server Admission & Security Chain',
  architecturalSummary:
    'Illustrates the Kubernetes security pipeline: TLS authentication, RBAC authorization, Mutating Admission Webhooks, Validating Admission Webhooks, and Pod Security Standards enforcement.',
  blocks: [
    {
      id: 'c8-client',
      label: 'Client / ServiceAccount',
      sublabel: 'Request Originator',
      category: 'client',
      icon: 'shield',
      portOrProtocol: 'TLS / JWT Bearer',
      statusText: 'Originator',
      details: {
        role: 'Sends API request with TLS cert or projected ServiceAccount JWT token.',
        processName: 'kubectl / Pod token',
        cliDiagnostic: 'kubectl auth can-i create pods',
        configLocation: '~/.kube/config',
        keyInsight: 'ServiceAccount tokens are cryptographically signed JWTs issued by API server token controller.',
      },
    },
    {
      id: 'c8-authn',
      label: 'Authentication (AuthN)',
      sublabel: 'Identity Verification',
      category: 'security',
      icon: 'shield',
      portOrProtocol: 'x509 / OIDC Token',
      statusText: 'Identifier',
      details: {
        role: 'Extracts username, UID, and group affiliations from credentials.',
        processName: 'kube-apiserver authn',
        cliDiagnostic: 'kubectl config view',
        configLocation: '/etc/kubernetes/pki/',
        keyInsight: 'Supports x509 client certs, OIDC tokens, and webhook authenticators.',
      },
    },
    {
      id: 'c8-authz',
      label: 'RBAC Authorization (AuthZ)',
      sublabel: 'Permissions Gatekeeper',
      category: 'security',
      icon: 'shield',
      portOrProtocol: 'Role / ClusterRole Check',
      statusText: 'Authorizer',
      details: {
        role: 'Checks if identity has permission to execute requested verb on resource.',
        processName: 'RBAC authorizer',
        cliDiagnostic: 'kubectl get clusterroles,rolebindings',
        configLocation: 'etcd rbac objects',
        keyInsight: 'Default-deny model: every action requires an explicit allow rule.',
      },
    },
    {
      id: 'c8-mutating',
      label: 'Mutating Webhooks',
      sublabel: 'Policy & Sidecar Injector',
      category: 'control-plane',
      icon: 'cpu',
      portOrProtocol: 'HTTPS Webhook Call',
      statusText: 'Mutator',
      details: {
        role: 'Can modify incoming manifests (e.g. inject Istio sidecars, add security labels).',
        processName: 'MutatingAdmissionWebhook',
        cliDiagnostic: 'kubectl get mutatingwebhookconfigurations',
        configLocation: 'Admission webhook config',
        keyInsight: 'Can alter the YAML payload before schema validation.',
      },
    },
    {
      id: 'c8-validating',
      label: 'Validating Webhooks & PSS',
      sublabel: 'Pod Security Standards (PSS)',
      category: 'security',
      icon: 'shield',
      portOrProtocol: 'Restricted / Baseline Audit',
      statusText: 'Enforcer',
      details: {
        role: 'Enforces Pod Security Standards and blocks privileged violations (runAsRoot, hostNetwork).',
        processName: 'ValidatingAdmissionWebhook',
        cliDiagnostic: 'kubectl get validatingwebhookconfigurations',
        configLocation: 'PSS Namespace labels',
        keyInsight: 'Rejects non-compliant pods with clear error explanations before they reach etcd.',
      },
    },
  ],
  connections: [
    { from: 'c8-client', to: 'c8-authn', label: '1. HTTPS Request with Bearer Token', protocol: 'TLS 1.3', stepNumber: 1 },
    { from: 'c8-authn', to: 'c8-authz', label: '2. Verify Identity -> Check RBAC rules', protocol: 'Auth Chain', stepNumber: 2 },
    { from: 'c8-authz', to: 'c8-mutating', label: '3. Pass AuthZ -> Mutate manifest', protocol: 'Webhook Call', stepNumber: 3 },
    { from: 'c8-mutating', to: 'c8-validating', label: '4. Validate security policies & PSS', protocol: 'Admission Check', stepNumber: 4 },
  ],
  steps: [
    {
      step: 1,
      title: 'Authentication (Who are you?)',
      summary: 'API server validates the TLS client certificate or OIDC token.',
      activeBlockIds: ['c8-client', 'c8-authn'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'The system verifies your passport or digital identity.',
        technicalMechanics: 'TokenReview or x509 validator resolves the request into an authenticated user subject.',
      },
      kubectlTrace: 'kubectl auth can-i --list',
    },
    {
      step: 2,
      title: 'Authorization (What can you do?)',
      summary: 'RBAC checks Roles and ClusterRoleBindings for permission.',
      activeBlockIds: ['c8-authn', 'c8-authz'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'The system checks if you have permission to do this specific action.',
        technicalMechanics: 'Matches (verb: create, resource: pods, namespace: default) against active RoleBindings.',
      },
      kubectlTrace: 'kubectl auth can-i create pods',
    },
    {
      step: 3,
      title: 'Mutating Admission (Inject defaults)',
      summary: 'Mutating webhooks inject required labels or sidecars.',
      activeBlockIds: ['c8-authz', 'c8-mutating'],
      activeConnectionIdxs: [2],
      detailExplanation: {
        simpleWords: 'Automated helpers add required security tags or logging tools to your request.',
        technicalMechanics: 'Webhooks apply JSON Patch operations to modify incoming resource spec.',
      },
      kubectlTrace: 'kubectl get mutatingwebhookconfigurations',
    },
    {
      step: 4,
      title: 'Validating Admission & PSS (Compliance check)',
      summary: 'Enforces Pod Security Standards and blocks privileged violations.',
      activeBlockIds: ['c8-mutating', 'c8-validating'],
      activeConnectionIdxs: [3],
      detailExplanation: {
        simpleWords: 'The safety inspector verifies that no security rules are broken (like running as root).',
        technicalMechanics: 'Validating webhooks and built-in PSS admission controllers audit runAsNonRoot and capabilities.',
      },
      kubectlTrace: 'kubectl get validatingwebhookconfigurations',
    },
  ],
});

// ============================================================================
// CHAPTER 9: MONITORING & LOGGING
// Container Health Probes & Cluster Telemetry Pipeline
// ============================================================================
const CHAPTER_9_FLOW: (c: KubeConcept) => TopicFlowDiagramData = (c) => ({
  chapterNumber: 9,
  chapterTitle: 'Monitoring & Logging',
  conceptNumber: c.number,
  conceptTitle: c.title,
  architectureType: 'Container Health Probes & Cluster Telemetry Pipeline',
  architecturalSummary:
    'Shows how Kubelet probe workers execute Liveness, Readiness, and Startup probes, isolating failing containers from Service EndpointSlices, while DaemonSets stream metrics and logs to central Prometheus and Grafana dashboards.',
  blocks: [
    {
      id: 'c9-kubelet',
      label: 'Kubelet Prober Worker',
      sublabel: 'Periodic Health Auditor',
      category: 'node',
      icon: 'shield',
      portOrProtocol: 'HTTP GET / TCP Socket',
      statusText: 'Auditor',
      details: {
        role: 'Executes liveness, readiness, and startup probe checks at configured intervals (periodSeconds).',
        processName: 'kubelet prober',
        cliDiagnostic: 'kubectl describe pod <name> | grep -A 5 "Liveness:"',
        configLocation: 'Pod spec.containers[*].livenessProbe',
        keyInsight: 'Runs locally on worker node without passing traffic through the control plane.',
      },
    },
    {
      id: 'c9-container',
      label: 'Target Container App',
      sublabel: 'Application Health Endpoints',
      category: 'runtime',
      icon: 'box',
      portOrProtocol: 'HTTP :8080/healthz',
      statusText: 'Target',
      details: {
        role: 'Exposes HTTP /healthz or /readyz endpoints reflecting internal database and cache connectivity.',
        processName: 'App HTTP Server',
        cliDiagnostic: 'kubectl exec <pod> -- curl -s http://localhost:8080/readyz',
        configLocation: 'Application Code',
        keyInsight: 'Readiness failure removes Pod from Service; Liveness failure restarts the container process.',
      },
    },
    {
      id: 'c9-endpoints',
      label: 'EndpointSlice Controller',
      sublabel: 'Traffic Gatekeeper',
      category: 'control-plane',
      icon: 'activity',
      portOrProtocol: 'Service Routing Sync',
      statusText: 'Gatekeeper',
      details: {
        role: 'Instantly removes Pod IP from Service EndpointSlice when readiness probe fails.',
        processName: 'endpoints-controller',
        cliDiagnostic: 'kubectl get endpointslices -w',
        configLocation: 'Discovery API',
        keyInsight: 'Zero dropped requests: traffic stops arriving before the unhealthy pod can serve 500 errors.',
      },
    },
    {
      id: 'c9-metrics',
      label: 'Metrics-Server & Prometheus',
      sublabel: 'Telemetry Aggregation Engine',
      category: 'storage',
      icon: 'database',
      portOrProtocol: ':10250 Scrape / PromQL',
      statusText: 'Metrics Store',
      details: {
        role: 'Scrapes container resource usage metrics from Kubelet cAdvisor and serves the Metrics API.',
        processName: 'metrics-server / prometheus',
        cliDiagnostic: 'kubectl top pods && kubectl top nodes',
        configLocation: '/var/run/secrets/kubernetes.io/serviceaccount/',
        keyInsight: 'Powers `kubectl top` and feeds metrics directly to the Horizontal Pod Autoscaler (HPA).',
      },
    },
  ],
  connections: [
    { from: 'c9-kubelet', to: 'c9-container', label: '1. Poll /livez & /readyz every 10s', protocol: 'HTTP GET / TCP', stepNumber: 1 },
    { from: 'c9-container', to: 'c9-endpoints', label: '2. Readiness failure triggers immediate traffic cut', protocol: 'Status Update', stepNumber: 2 },
    { from: 'c9-kubelet', to: 'c9-metrics', label: '3. cAdvisor streams CPU/RAM counters to Metrics-Server', protocol: 'HTTPS Scrape :10250', stepNumber: 3 },
  ],
  steps: [
    {
      step: 1,
      title: 'Periodic Probe Execution',
      summary: 'Kubelet pings container health endpoints according to probe intervals.',
      activeBlockIds: ['c9-kubelet', 'c9-container'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'The doctor checks the heart rate of your application every few seconds.',
        technicalMechanics: 'Kubelet prober issues HTTP GET /readyz; expects HTTP status code >= 200 and < 400.',
      },
      kubectlTrace: 'kubectl describe pod <name>',
    },
    {
      step: 2,
      title: 'Readiness Traffic Decoupling',
      summary: 'If readiness probe fails, EndpointSlice controller cuts traffic without killing the process.',
      activeBlockIds: ['c9-container', 'c9-endpoints'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'If an app gets bogged down, traffic is rerouted away so customers do not see errors.',
        technicalMechanics: 'Ready condition toggles to False; EndpointSlice controller withdraws the IP.',
      },
      kubectlTrace: 'kubectl get endpoints',
    },
    {
      step: 3,
      title: 'Telemetry Scraping & Dashboard Ingestion',
      summary: 'Metrics-server pulls resource usage and logs stream to monitoring platforms.',
      activeBlockIds: ['c9-kubelet', 'c9-metrics'],
      activeConnectionIdxs: [2],
      detailExplanation: {
        simpleWords: 'The health dashboard records how much CPU and memory each container is burning.',
        technicalMechanics: 'Metrics-server scrapes cAdvisor /metrics/resource endpoint for HPA scaling decisions.',
      },
      kubectlTrace: 'kubectl top pods',
    },
  ],
});

// ============================================================================
// CHAPTER 10: AUTOSCALING
// Horizontal & Cluster Autoscaling Feedback Loop
// ============================================================================
const CHAPTER_10_FLOW: (c: KubeConcept) => TopicFlowDiagramData = (c) => ({
  chapterNumber: 10,
  chapterTitle: 'Autoscaling',
  conceptNumber: c.number,
  conceptTitle: c.title,
  architectureType: 'Horizontal & Cluster Autoscaling Feedback Loop',
  architecturalSummary:
    'Illustrates the end-to-end autoscaling pipeline: Application traffic surges, Metrics-Server detects load, HPA recalculates desired replicas, and Cluster Autoscaler provisions cloud nodes.',
  blocks: [
    {
      id: 'c10-traffic',
      label: 'Incoming Traffic Surge',
      sublabel: 'External User Spike',
      category: 'client',
      icon: 'network',
      portOrProtocol: 'HTTPS / Request Surge',
      statusText: 'Load Surge',
      details: {
        role: 'High HTTP traffic or queue backlog spikes CPU/RAM consumption beyond threshold.',
        processName: 'User Traffic',
        cliDiagnostic: 'kubectl top pods',
        configLocation: 'External Traffic Source',
        keyInsight: 'Triggers the auto-remediation scaling chain.',
      },
    },
    {
      id: 'c10-metrics',
      label: 'Metrics-Server',
      sublabel: 'Resource Metrics API',
      category: 'control-plane',
      icon: 'activity',
      portOrProtocol: 'metrics.k8s.io',
      statusText: 'Scraper',
      details: {
        role: 'Scrapes CPU/RAM from Kubelets and serves the Custom Metrics API.',
        processName: 'metrics-server',
        cliDiagnostic: 'kubectl get --raw "/apis/metrics.k8s.io/v1beta1/pods"',
        configLocation: 'kube-system / metrics-server',
        keyInsight: 'Aggregates metrics without needing a heavy database.',
      },
    },
    {
      id: 'c10-hpa',
      label: 'HPA Controller',
      sublabel: 'Reconciliation Loop (15s)',
      category: 'control-plane',
      icon: 'cpu',
      portOrProtocol: 'Scale Subresource',
      statusText: 'Reconciler',
      details: {
        role: 'Evaluates formula: desiredReplicas = ceil[current * (metric / target)].',
        processName: 'hpa-controller',
        cliDiagnostic: 'kubectl get hpa -w',
        configLocation: 'Deployment spec.replicas',
        keyInsight: 'Includes stabilization windows (default 5m downscale stabilization) to prevent thrashing.',
      },
    },
    {
      id: 'c10-ca',
      label: 'Cluster Autoscaler (CA)',
      sublabel: 'Cloud VM Provisioner',
      category: 'node',
      icon: 'server',
      portOrProtocol: 'Cloud AutoScalingGroup API',
      statusText: 'Cloud Scaler',
      details: {
        role: 'Detects unschedulable Pending pods and orders new VMs from cloud provider.',
        processName: 'cluster-autoscaler / karpenter',
        cliDiagnostic: 'kubectl get nodes -w',
        configLocation: 'Cloud IAM / ASG',
        keyInsight: 'Scales nodes up when pods are pending; scales down when nodes are underutilized.',
      },
    },
  ],
  connections: [
    { from: 'c10-traffic', to: 'c10-metrics', label: '1. Traffic surge increases CPU utilization', protocol: 'Workload Load', stepNumber: 1 },
    { from: 'c10-metrics', to: 'c10-hpa', label: '2. Metrics API polled every 15 seconds', protocol: 'Metrics API', stepNumber: 2 },
    { from: 'c10-hpa', to: 'c10-ca', label: '3. HPA scales deployment -> Pods go Pending', protocol: 'Scale Subresource', stepNumber: 3 },
    { from: 'c10-ca', to: 'c10-traffic', label: '4. CA adds cloud nodes -> Pods scheduled & traffic handled', protocol: 'Cloud VM API', stepNumber: 4 },
  ],
  steps: [
    {
      step: 1,
      title: 'Load Ingestion & Metric Collection',
      summary: 'Traffic surge elevates utilization metrics.',
      activeBlockIds: ['c10-traffic', 'c10-metrics'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'A sudden wave of users hits your app, causing CPU usage to spike.',
        technicalMechanics: 'cgroup cpuacct counters report higher utilization to Kubelet, scraped by Metrics-Server.',
      },
      kubectlTrace: 'kubectl top pods',
    },
    {
      step: 2,
      title: 'HPA Evaluation & Scale Calculation',
      summary: 'HPA controller calculates new target replica count.',
      activeBlockIds: ['c10-metrics', 'c10-hpa'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'The autoscaler calculates: "We need 10 pods instead of 3 to handle this load."',
        technicalMechanics: 'HPA algorithm applies target utilization ratio and patches deployment.spec.replicas.',
      },
      kubectlTrace: 'kubectl describe hpa',
    },
    {
      step: 3,
      title: 'Cluster Autoscaler Node Provisioning',
      summary: 'New pods exceed current cluster capacity; CA boots new VMs.',
      activeBlockIds: ['c10-hpa', 'c10-ca'],
      activeConnectionIdxs: [2, 3],
      detailExplanation: {
        simpleWords: 'The cluster runs out of physical computers, so it automatically buys another server from the cloud.',
        technicalMechanics: 'Cluster Autoscaler detects unschedulable pods and calls cloud AutoScalingGroup API to add instances.',
      },
      kubectlTrace: 'kubectl get nodes -w',
    },
  ],
});

// ============================================================================
// CHAPTER 11: SCHEDULING
// Kube-Scheduler Filtering & Scoring Pipeline
// ============================================================================
const CHAPTER_11_FLOW: (c: KubeConcept) => TopicFlowDiagramData = (c) => ({
  chapterNumber: 11,
  chapterTitle: 'Scheduling',
  conceptNumber: c.number,
  conceptTitle: c.title,
  architectureType: 'Kube-Scheduler Filtering & Scoring Pipeline',
  architecturalSummary:
    'Explains how kube-scheduler evaluates unscheduled Pods through Filter predicates (NodeAffinity, Tolerations, Resource availability) and Priority scoring algorithms before writing the Binding subresource.',
  blocks: [
    {
      id: 'c11-queue',
      label: 'Scheduling Queue',
      sublabel: 'Pending Pod Workqueue',
      category: 'client',
      icon: 'layers',
      portOrProtocol: 'Priority Queue',
      statusText: 'Queued',
      details: {
        role: 'Holds unscheduled pods prioritized by PriorityClass.',
        processName: 'kube-scheduler workqueue',
        cliDiagnostic: 'kubectl get pods --field-selector=status.phase=Pending',
        configLocation: 'Scheduler memory',
        keyInsight: 'Uses activeQ, backoffQ, and unschedulableQ.',
      },
    },
    {
      id: 'c11-filter',
      label: 'Filter Phase (Predicates)',
      sublabel: 'Node Elimination Engine',
      category: 'control-plane',
      icon: 'cpu',
      portOrProtocol: 'Predicates Pipeline',
      statusText: 'Filtering',
      details: {
        role: 'Eliminates nodes that cannot run the pod (memory, CPU, taints, ports).',
        processName: 'kube-scheduler filtering',
        cliDiagnostic: 'kubectl describe pod <pending-pod>',
        configLocation: 'Scheduler configuration',
        keyInsight: 'If all nodes fail filtering, pod remains in Pending with FailedScheduling event.',
      },
    },
    {
      id: 'c11-score',
      label: 'Score Phase (Priorities)',
      sublabel: 'Ranking & Spread Engine',
      category: 'control-plane',
      icon: 'sparkles',
      portOrProtocol: '0-100 Rating',
      statusText: 'Scoring',
      details: {
        role: 'Scores surviving nodes 0-100 based on image locality and topology spread.',
        processName: 'kube-scheduler scoring',
        cliDiagnostic: 'kubectl get nodes -l topology.kubernetes.io/zone',
        configLocation: 'Score plugins',
        keyInsight: 'Higher score wins. Ties broken randomly to avoid hot-spotting.',
      },
    },
    {
      id: 'c11-binding',
      label: 'Binding Subresource',
      sublabel: 'API Server Atomic Commit',
      category: 'storage',
      icon: 'database',
      portOrProtocol: 'POST /binding',
      statusText: 'Committed',
      details: {
        role: 'Writes spec.nodeName to API Server.',
        processName: 'Binding Subresource',
        cliDiagnostic: 'kubectl get events -w',
        configLocation: 'etcd pod binding',
        keyInsight: 'Optimistic concurrency: binding happens asynchronously.',
      },
    },
    {
      id: 'c11-node',
      label: 'Target Worker Node',
      sublabel: 'Selected Execution Host',
      category: 'node',
      icon: 'shield',
      portOrProtocol: 'Node Execution',
      statusText: 'Target Host',
      details: {
        role: 'Receives the pod and executes container images.',
        processName: 'kubelet',
        cliDiagnostic: 'kubectl top node',
        configLocation: 'Node hardware',
        keyInsight: 'Kubelet begins image pulling immediately upon detecting binding.',
      },
    },
  ],
  connections: [
    { from: 'c11-queue', to: 'c11-filter', label: '1. Pop Pod from Priority Queue', protocol: 'In-Memory', stepNumber: 1 },
    { from: 'c11-filter', to: 'c11-score', label: '2. Filter passed nodes forwarded to scoring', protocol: 'Pipeline', stepNumber: 2 },
    { from: 'c11-score', to: 'c11-binding', label: '3. Highest scoring node selected', protocol: 'Calculation', stepNumber: 3 },
    { from: 'c11-binding', to: 'c11-node', label: '4. Bind Pod to Node via API Server', protocol: 'POST /binding', stepNumber: 4 },
  ],
  steps: [
    {
      step: 1,
      title: 'Scheduling Queue Ingestion',
      summary: 'Unscheduled pod enters the priority queue.',
      activeBlockIds: ['c11-queue', 'c11-filter'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'A waiting pod enters the queue to find a home.',
        technicalMechanics: 'The scheduling cycle pops the highest priority pod from activeQ.',
      },
      kubectlTrace: 'kubectl get pods',
    },
    {
      step: 2,
      title: 'Filter Phase (Predicates)',
      summary: 'Nodes without enough resources or matching taints are dropped.',
      activeBlockIds: ['c11-filter', 'c11-score'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'The scheduler disqualifies computers that lack CPU, RAM, or correct tags.',
        technicalMechanics: 'Runs NodeResourcesFit, NodeName, NodePorts, and PodTopologySpread predicates.',
      },
      kubectlTrace: 'kubectl describe node',
    },
    {
      step: 3,
      title: 'Score Phase (Priorities)',
      summary: 'Remaining nodes are graded on balance and image cache.',
      activeBlockIds: ['c11-score', 'c11-binding'],
      activeConnectionIdxs: [2],
      detailExplanation: {
        simpleWords: 'The remaining candidate computers are given grades from 0 to 100.',
        technicalMechanics: 'Calculates ImageLocality, NodeAffinityScorer, and LeastAllocated priority weights.',
      },
      kubectlTrace: 'kubectl get events',
    },
    {
      step: 4,
      title: 'Atomic Binding & Execution',
      summary: 'The winner node is written to the API server and Kubelet boots the pod.',
      activeBlockIds: ['c11-binding', 'c11-node'],
      activeConnectionIdxs: [3],
      detailExplanation: {
        simpleWords: 'The winning machine is chosen and starts launching the workload.',
        technicalMechanics: 'Binding subresource is committed to etcd; Kubelet picks up the assigned pod.',
      },
      kubectlTrace: 'kubectl get pod -o wide',
    },
  ],
});

// ============================================================================
// CHAPTER 12: STORAGE & VOLUMES
// CSI Dynamic Provisioning & Volume Attachment Pipeline
// ============================================================================
const CHAPTER_12_FLOW: (c: KubeConcept) => TopicFlowDiagramData = (c) => ({
  chapterNumber: 12,
  chapterTitle: 'Storage & Volumes',
  conceptNumber: c.number,
  conceptTitle: c.title,
  architectureType: 'CSI Dynamic Provisioning & Volume Attachment Pipeline',
  architecturalSummary:
    'Demonstrates the dynamic storage lifecycle: PersistentVolumeClaim requests storage, StorageClass triggers the external CSI provisioner to carve out cloud disk (EBS/Ceph/NFS), attaches to the host node, and mounts securely into the target container.',
  blocks: [
    {
      id: 'c12-pvc',
      label: 'PersistentVolumeClaim (PVC)',
      sublabel: 'Storage Request Ticket',
      category: 'storage',
      icon: 'hard-drive',
      portOrProtocol: 'Claim: 50Gi (ReadWriteOnce)',
      statusText: 'Claim',
      details: {
        role: 'The user request for storage capacity and access mode. Decouples developer needs from physical disk types.',
        processName: 'PVC Object',
        cliDiagnostic: 'kubectl get pvc',
        configLocation: 'User YAML',
        keyInsight: 'Like asking for a table at a restaurant: you specify how big, not which exact physical table.',
      },
    },
    {
      id: 'c12-sc',
      label: 'StorageClass & CSI Provisioner',
      sublabel: 'Dynamic Volume Factory',
      category: 'control-plane',
      icon: 'cpu',
      portOrProtocol: 'Provisioner: ebs.csi.aws.com',
      statusText: 'Provisioner',
      details: {
        role: 'Watches for Pending PVCs, calls cloud storage APIs (AWS EBS / GCP PD / Ceph), and formats block devices.',
        processName: 'csi-provisioner sidecar',
        cliDiagnostic: 'kubectl get storageclass',
        configLocation: 'StorageClass spec',
        keyInsight: 'Eliminates manual admin volume creation by automating cloud disk provisioning on the fly.',
      },
    },
    {
      id: 'c12-pv',
      label: 'PersistentVolume (PV)',
      sublabel: 'Cluster Storage Asset',
      category: 'storage',
      icon: 'database',
      portOrProtocol: 'VolumeID: vol-0987abcdef',
      statusText: 'Bound Asset',
      details: {
        role: 'Represents the actual allocated physical or cloud disk asset in the cluster.',
        processName: 'PV Object',
        cliDiagnostic: 'kubectl get pv',
        configLocation: 'Cluster-wide object',
        keyInsight: 'Life cycle is independent of any individual pod using it.',
      },
    },
    {
      id: 'c12-attacher',
      label: 'CSI Attacher & Node Driver',
      sublabel: 'Host Attachment Controller',
      category: 'node',
      icon: 'shield',
      portOrProtocol: 'AttachDisk API /dev/xvdf',
      statusText: 'Node Attacher',
      details: {
        role: 'Attaches the cloud volume to the worker node virtual machine and formats filesystem (ext4/xfs).',
        processName: 'csi-attacher / node-driver',
        cliDiagnostic: 'lsblk && df -h',
        configLocation: '/var/lib/kubelet/plugins/',
        keyInsight: 'VolumeAttachment object coordinates safe mounting across cluster nodes.',
      },
    },
    {
      id: 'c12-container',
      label: 'Stateful Application Pod',
      sublabel: 'Mounted Volume Directory',
      category: 'runtime',
      icon: 'box',
      portOrProtocol: 'Mount: /var/lib/mysql',
      statusText: 'Mounted',
      details: {
        role: 'Reads and writes persistent data (e.g. Postgres / MySQL databases).',
        processName: 'Database Engine',
        cliDiagnostic: 'kubectl exec <pod> -- df -h /var/lib/mysql',
        configLocation: '/var/lib/kubelet/pods/<pod-id>/volumes/',
        keyInsight: 'Data survives pod restarts, rescheduling across nodes, and rolling updates intact.',
      },
    },
  ],
  connections: [
    { from: 'c12-pvc', to: 'c12-sc', label: '1. Claim submitted; StorageClass matches provisioner', protocol: 'API Watch', stepNumber: 1 },
    { from: 'c12-sc', to: 'c12-pv', label: '2. Dynamic provisioner allocates cloud disk & creates PV', protocol: 'Cloud Storage API', stepNumber: 2 },
    { from: 'c12-pv', to: 'c12-attacher', label: '3. VolumeAttachment attaches block device to worker node', protocol: 'gRPC NodeStage', stepNumber: 3 },
    { from: 'c12-attacher', to: 'c12-container', label: '4. Bind-mounts directory into container filesystem', protocol: 'POSIX mount', stepNumber: 4 },
  ],
  steps: [
    {
      step: 1,
      title: 'Storage Claim Creation (PVC)',
      summary: 'Application developer creates a PersistentVolumeClaim requesting 50Gi storage.',
      activeBlockIds: ['c12-pvc', 'c12-sc'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'Your app submits a request saying: "I need a 50GB storage drive."',
        technicalMechanics: 'Developer submits PVC specifying accessModes: [ReadWriteOnce] and storageClassName: gp3.',
      },
      kubectlTrace: 'kubectl apply -f pvc.yaml',
    },
    {
      step: 2,
      title: 'Dynamic Volume Provisioning',
      summary: 'StorageClass triggers CSI plugin to create cloud volume and bind PersistentVolume.',
      activeBlockIds: ['c12-sc', 'c12-pv'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'The cloud automatically creates a real hard drive and links it to your request ticket.',
        technicalMechanics: 'CSI provisioner calls cloud provider API to create volume, creating a matching PV in Bound state.',
      },
      kubectlTrace: 'kubectl get pvc,pv',
    },
    {
      step: 3,
      title: 'Host Volume Attachment',
      summary: 'CSI Attacher attaches cloud disk to target worker node VM.',
      activeBlockIds: ['c12-pv', 'c12-attacher'],
      activeConnectionIdxs: [2],
      detailExplanation: {
        simpleWords: 'The hard drive gets plugged into the specific physical machine running your app.',
        technicalMechanics: 'Kubelet and CSI node-driver format the block device with filesystem (ext4/xfs).',
      },
      kubectlTrace: 'kubectl describe volumeattachment',
    },
    {
      step: 4,
      title: 'Container Directory Mount',
      summary: 'Kubelet bind-mounts formatted filesystem into container path.',
      activeBlockIds: ['c12-attacher', 'c12-container'],
      activeConnectionIdxs: [3],
      detailExplanation: {
        simpleWords: 'The drive appears as a normal folder inside your container so your database can save files.',
        technicalMechanics: 'NodePublishVolume bind-mounts the host directory into container root filesystem.',
      },
      kubectlTrace: 'kubectl exec <pod> -- df -h',
    },
  ],
});

// ============================================================================
// CHAPTER 13: DEPLOYMENT PATTERNS
// Declarative Controller Reconciliation & Progressive Rollouts
// ============================================================================
const CHAPTER_13_FLOW: (c: KubeConcept) => TopicFlowDiagramData = (c) => ({
  chapterNumber: 13,
  chapterTitle: 'Deployment Patterns',
  conceptNumber: c.number,
  conceptTitle: c.title,
  architectureType: 'Declarative Controller Reconciliation & Progressive Rollouts',
  architecturalSummary:
    'Illustrates the continuous level-triggered control loop: Developer specifies desired replicas, DeploymentController creates and orchestrates ReplicaSets, and Kubelet maintains running Pods across worker nodes with zero-downtime rolling updates.',
  blocks: [
    {
      id: 'c13-client',
      label: 'Developer / CI/CD',
      sublabel: 'Desired State Specifier',
      category: 'client',
      icon: 'terminal',
      portOrProtocol: 'git push / kubectl',
      statusText: 'Author',
      details: {
        role: 'Specifies desired state (e.g., replicas: 3, image: app:v2, rollingUpdate strategy).',
        processName: 'kubectl rollout',
        cliDiagnostic: 'kubectl rollout status deployment/web-app',
        configLocation: 'Git repository',
        keyInsight: 'Declarative GitOps principle: describe WHAT you want, not the step-by-step commands to get there.',
      },
    },
    {
      id: 'c13-deploy',
      label: 'Deployment Controller',
      sublabel: 'Declarative Workload Orchestrator',
      category: 'control-plane',
      icon: 'cpu',
      portOrProtocol: 'Reconcile Loop (100ms)',
      statusText: 'Orchestrator',
      details: {
        role: 'Manages ReplicaSets during rolling updates. Controls maxSurge and maxUnavailable constraints.',
        processName: 'kube-controller-manager',
        cliDiagnostic: 'kubectl describe deployment web-app',
        configLocation: '/etc/kubernetes/manifests/kube-controller-manager.yaml',
        keyInsight: 'Never creates Pods directly; delegates pod creation strictly to ReplicaSets.',
      },
    },
    {
      id: 'c13-rs1',
      label: 'ReplicaSet v1 (Old)',
      sublabel: 'Scale-down Reconciler',
      category: 'control-plane',
      icon: 'layers',
      portOrProtocol: 'pod-template-hash=7b9f8',
      statusText: 'Scaling Down',
      details: {
        role: 'Maintains old version v1 pods. Gradually scaled down to 0 replicas as v2 pods become Ready.',
        processName: 'ReplicaSet Controller',
        cliDiagnostic: 'kubectl get rs -l app=web-app',
        configLocation: 'etcd ReplicaSet object',
        keyInsight: 'Preserved with history limit for instant one-command rollbacks (`kubectl rollout undo`).',
      },
    },
    {
      id: 'c13-rs2',
      label: 'ReplicaSet v2 (New)',
      sublabel: 'Scale-up Reconciler',
      category: 'control-plane',
      icon: 'layers',
      portOrProtocol: 'pod-template-hash=64f8c',
      statusText: 'Scaling Up',
      details: {
        role: 'Created automatically when spec.template changes. Scales up v2 pods with new image.',
        processName: 'ReplicaSet Controller',
        cliDiagnostic: 'kubectl rollout history deployment/web-app',
        configLocation: 'etcd ReplicaSet object',
        keyInsight: 'Calculates unique hash from PodTemplateSpec to ensure unique selector matching.',
      },
    },
    {
      id: 'c13-pods',
      label: 'Running Pod Fleet',
      sublabel: 'Active Worker Node Workloads',
      category: 'runtime',
      icon: 'box',
      portOrProtocol: 'Container Processes',
      statusText: 'Zero Downtime',
      details: {
        role: 'The fleet of running application containers executing user code.',
        processName: 'web-app (nginx / node / go)',
        cliDiagnostic: 'kubectl get pods -l app=web-app -o wide',
        configLocation: 'Worker Node Hosts',
        keyInsight: 'Zero downtime achieved because new pods pass readiness probes before old pods receive SIGTERM.',
      },
    },
  ],
  connections: [
    { from: 'c13-client', to: 'c13-deploy', label: '1. Update image to app:v2 (kubectl set image)', protocol: 'API Patch', stepNumber: 1 },
    { from: 'c13-deploy', to: 'c13-rs2', label: '2. Create ReplicaSet v2 and scale to 1 replica (maxSurge)', protocol: 'Create / Scale', stepNumber: 2 },
    { from: 'c13-rs2', to: 'c13-pods', label: '3. Launch v2 Pod; wait for Readiness probe to pass', protocol: 'Pod Scheduling', stepNumber: 3 },
    { from: 'c13-deploy', to: 'c13-rs1', label: '4. Once v2 is Ready, scale down v1 by 1 replica', protocol: 'Graceful SIGTERM', stepNumber: 4 },
  ],
  steps: [
    {
      step: 1,
      title: 'Rollout Trigger (Intent Update)',
      summary: 'Developer applies updated container image v2 to Deployment manifest.',
      activeBlockIds: ['c13-client', 'c13-deploy'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'You tell Kubernetes: "Please upgrade my website from version 1 to version 2 without stopping service."',
        technicalMechanics: 'Deployment spec.template.spec.containers[0].image is patched to new tag.',
      },
      kubectlTrace: 'kubectl set image deployment/web-app web=nginx:1.26',
    },
    {
      step: 2,
      title: 'New ReplicaSet Spawning',
      summary: 'Deployment controller computes template hash and instantiates ReplicaSet v2.',
      activeBlockIds: ['c13-deploy', 'c13-rs2'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'The master manager creates a new team manager for version 2.',
        technicalMechanics: 'DeploymentController creates new ReplicaSet with pod-template-hash and sets replicas=1.',
      },
      kubectlTrace: 'kubectl get rs',
    },
    {
      step: 3,
      title: 'Health-Checked Container Boot',
      summary: 'v2 Pod starts on worker node and must pass Readiness check before serving traffic.',
      activeBlockIds: ['c13-rs2', 'c13-pods'],
      activeConnectionIdxs: [2],
      detailExplanation: {
        simpleWords: 'Version 2 boots up in the background and proves it is healthy before taking customer traffic.',
        technicalMechanics: 'Kubelet evaluates readiness probe; only when Status=True does Service include v2 in EndpointSlices.',
      },
      kubectlTrace: 'kubectl rollout status deployment/web-app',
    },
    {
      step: 4,
      title: 'Zero-Downtime Traffic Handover',
      summary: 'v1 ReplicaSet scales down old pods with graceful shutdown.',
      activeBlockIds: ['c13-deploy', 'c13-rs1'],
      activeConnectionIdxs: [3],
      detailExplanation: {
        simpleWords: 'Old version 1 pods finish their current customer requests and shut down cleanly.',
        technicalMechanics: 'Old pods receive SIGTERM, wait terminationGracePeriodSeconds (default 30s), and terminate.',
      },
      kubectlTrace: 'kubectl get pods -l app=web-app',
    },
  ],
});

// ============================================================================
// CHAPTER 14: ADVANCED KUBERNETES
// Custom Resource Definitions & The Operator Pattern
// ============================================================================
const CHAPTER_14_FLOW: (c: KubeConcept) => TopicFlowDiagramData = (c) => ({
  chapterNumber: 14,
  chapterTitle: 'Advanced Kubernetes',
  conceptNumber: c.number,
  conceptTitle: c.title,
  architectureType: 'Operator Pattern & Custom Controller Reconcile Loop',
  architecturalSummary:
    'Shows how Custom Resource Definitions (CRDs) extend the Kubernetes API and how custom controller operators use Informers, Workqueues, and continuous Reconcile loops to manage complex domain-specific applications (e.g. database clusters).',
  blocks: [
    {
      id: 'c14-crd',
      label: 'CustomResourceDefinition (CRD)',
      sublabel: 'API Schema Extension',
      category: 'control-plane',
      icon: 'file-text',
      portOrProtocol: 'OpenAPI v3 Schema',
      statusText: 'Registered API',
      details: {
        role: 'Defines new declarative API resource kinds (e.g. Kind: PostgresCluster, Kind: Prometheus).',
        processName: 'apiextensions-apiserver',
        cliDiagnostic: 'kubectl get crd',
        configLocation: 'Cluster-wide CRD Registry',
        keyInsight: 'Makes custom domain objects first-class citizens in Kubernetes with full kubectl support.',
      },
    },
    {
      id: 'c14-instance',
      label: 'Custom Resource (CR)',
      sublabel: 'User Domain Intent',
      category: 'client',
      icon: 'terminal',
      portOrProtocol: 'YAML / HTTPS',
      statusText: 'Custom Intent',
      details: {
        role: 'User declares domain intent (e.g. storage: 100Gi, replicas: 3, backupSchedule: "0 2 * * *").',
        processName: 'Custom Object',
        cliDiagnostic: 'kubectl get postgresclusters',
        configLocation: 'User YAML manifest',
        keyInsight: 'Hides hundreds of low-level primitive details behind simple high-level intent.',
      },
    },
    {
      id: 'c14-operator',
      label: 'Operator Controller Daemon',
      sublabel: 'Domain SRE Knowledge in Code',
      category: 'control-plane',
      icon: 'cpu',
      portOrProtocol: 'Informer Watch Stream',
      statusText: 'Reconciling',
      details: {
        role: 'Encapsulates human operational expertise into automated code: provisioning, backups, and failovers.',
        processName: 'Custom Operator Binary',
        cliDiagnostic: 'kubectl logs -l app=postgres-operator -n operators',
        configLocation: 'Deployment inside cluster',
        keyInsight: 'Level-triggered control loop: continuously compares desired CR state with real-world infrastructure.',
      },
    },
    {
      id: 'c14-child',
      label: 'Managed Core K8s Primitives',
      sublabel: 'Deployments, PVCs, Services, Secrets',
      category: 'runtime',
      icon: 'box',
      portOrProtocol: 'K8s Core Objects',
      statusText: 'Automated Mesh',
      details: {
        role: 'The operator automatically provisions and reconciles standard StatefulSets, Services, and PVCs.',
        processName: 'Reconciled Child Objects',
        cliDiagnostic: 'kubectl get statefulsets,pvc,secrets',
        configLocation: 'Target Namespace',
        keyInsight: 'Uses ownerReferences so deleting the parent CR automatically cleans up all child objects.',
      },
    },
  ],
  connections: [
    { from: 'c14-crd', to: 'c14-instance', label: '1. Register CRD schema; developer creates Custom Resource', protocol: 'kubectl apply', stepNumber: 1 },
    { from: 'c14-instance', to: 'c14-operator', label: '2. Operator Informer watches events and queues reconcile', protocol: 'HTTP/2 Watch Stream', stepNumber: 2 },
    { from: 'c14-operator', to: 'c14-child', label: '3. Reconcile() loop creates StatefulSets, PVCs, and Services', protocol: 'K8s Client-Go API', stepNumber: 3 },
  ],
  steps: [
    {
      step: 1,
      title: 'API Schema Extension & CR Submission',
      summary: 'CRD registers new API kind; developer creates high-level Custom Resource.',
      activeBlockIds: ['c14-crd', 'c14-instance'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'You teach Kubernetes a new word (like "DatabaseCluster") and ask for one.',
        technicalMechanics: 'apiextensions-apiserver registers OpenAPI v3 schema under /apis/postgres.org/v1.',
      },
      kubectlTrace: 'kubectl apply -f database.yaml',
    },
    {
      step: 2,
      title: 'Informer Watch & Queue Ingestion',
      summary: 'Operator Informer detects CR creation and pushes key to workqueue.',
      activeBlockIds: ['c14-instance', 'c14-operator'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'The automated robot administrator notices your order and wakes up.',
        technicalMechanics: 'Informer event handler adds namespace/name key to workqueue for processing.',
      },
      kubectlTrace: 'kubectl logs -l app=operator',
    },
    {
      step: 3,
      title: 'Automated Operational Reconciliation',
      summary: 'Operator creates child StatefulSets, PVCs, and Services, orchestrating backup schedules.',
      activeBlockIds: ['c14-operator', 'c14-child'],
      activeConnectionIdxs: [2],
      detailExplanation: {
        simpleWords: 'The robot administrator automatically sets up disks, passwords, and database replicas for you.',
        technicalMechanics: 'Reconcile() function applies desired child specs with OwnerReference metadata.',
      },
      kubectlTrace: 'kubectl get statefulsets,pvc',
    },
  ],
});

// ============================================================================
// CHAPTER 15: CLUSTER OPERATIONS
// etcd Distributed Raft Consensus & Disaster Recovery Pipeline
// ============================================================================
const CHAPTER_15_FLOW: (c: KubeConcept) => TopicFlowDiagramData = (c) => ({
  chapterNumber: 15,
  chapterTitle: 'Cluster Operations',
  conceptNumber: c.number,
  conceptTitle: c.title,
  architectureType: 'etcd Distributed Raft Consensus & Disaster Recovery Pipeline',
  architecturalSummary:
    'Demonstrates the disaster recovery and consensus architecture: 3-node etcd Raft quorum, periodic automated snapshots, node breakdown triage, and point-in-time restore to restore cluster state after catastrophic failure.',
  blocks: [
    {
      id: 'c15-leader',
      label: 'etcd Leader Node',
      sublabel: 'Raft Master Node',
      category: 'storage',
      icon: 'database',
      portOrProtocol: ':2379 / :2380 Peer',
      statusText: 'Raft Leader',
      details: {
        role: 'Processes all write proposals, sequences entries into log, and replicates to peer followers.',
        processName: 'etcd',
        cliDiagnostic: 'etcdctl endpoint status --write-out=table',
        configLocation: '/var/lib/etcd',
        keyInsight: 'Only the elected Raft leader can commit state changes to the distributed consensus log.',
      },
    },
    {
      id: 'c15-followers',
      label: 'etcd Follower Quorum',
      sublabel: 'Distributed Replicas (Quorum: 2/3)',
      category: 'storage',
      icon: 'database',
      portOrProtocol: ':2380 Raft Peer Protocol',
      statusText: 'Quorum (2/3)',
      details: {
        role: 'Replicates log entries and responds to heartbeats. Can elect new leader if leader dies.',
        processName: 'etcd peer members',
        cliDiagnostic: 'etcdctl member list',
        configLocation: '/etc/kubernetes/pki/etcd/',
        keyInsight: 'Requires quorum ((N/2)+1 nodes) to survive node failures without downtime.',
      },
    },
    {
      id: 'c15-snapshot',
      label: 'Snapshot Backup Cron',
      sublabel: 'Automated State Backup',
      category: 'client',
      icon: 'hard-drive',
      portOrProtocol: 'etcdctl snapshot save',
      statusText: 'Backup Engine',
      details: {
        role: 'Captures atomic, point-in-time binary snapshot of entire cluster state.',
        processName: 'backup-cron / velero',
        cliDiagnostic: 'etcdctl snapshot save /backup/snapshot.db',
        configLocation: '/etc/cron.d/etcd-backup',
        keyInsight: 'Must be saved offsite (e.g. S3 / GCS bucket) with encryption.',
      },
    },
    {
      id: 'c15-restore',
      label: 'Disaster Recovery Restore',
      sublabel: 'Point-in-Time Recovery',
      category: 'control-plane',
      icon: 'shield',
      portOrProtocol: 'etcdctl snapshot restore',
      statusText: 'Recovery Tool',
      details: {
        role: 'Restores cluster state from snapshot in case of catastrophic control plane loss or etcd corruption.',
        processName: 'etcdctl snapshot restore',
        cliDiagnostic: 'etcdctl snapshot status /backup/snapshot.db',
        configLocation: '/var/lib/etcd-restore',
        keyInsight: 'All nodes must be initialized with the same snapshot hash before cluster restarts.',
      },
    },
  ],
  connections: [
    { from: 'c15-leader', to: 'c15-followers', label: '1. Replicate state log to follower quorum', protocol: 'Raft Consensus :2380', stepNumber: 1 },
    { from: 'c15-leader', to: 'c15-snapshot', label: '2. Periodic snapshot save captures point-in-time state', protocol: 'etcdctl API', stepNumber: 2 },
    { from: 'c15-snapshot', to: 'c15-restore', label: '3. Disaster occurs -> snapshot restore reinitializes etcd', protocol: 'Binary Restore', stepNumber: 3 },
  ],
  steps: [
    {
      step: 1,
      title: 'Distributed Raft Consensus Replication',
      summary: 'etcd leader replicates sequential log entries to follower quorum.',
      activeBlockIds: ['c15-leader', 'c15-followers'],
      activeConnectionIdxs: [0],
      detailExplanation: {
        simpleWords: 'Three master servers agree on every single change so no single crash can lose data.',
        technicalMechanics: 'Leader sends AppendEntries RPC; commits entry once majority ((3/2)+1 = 2) acknowledge.',
      },
      kubectlTrace: 'etcdctl endpoint health',
    },
    {
      step: 2,
      title: 'Automated Snapshot Archiving',
      summary: 'Automated backup engine takes a consistent snapshot of the etcd database.',
      activeBlockIds: ['c15-leader', 'c15-snapshot'],
      activeConnectionIdxs: [1],
      detailExplanation: {
        simpleWords: 'The system takes a photo snapshot of all cluster settings and uploads it to safe storage.',
        technicalMechanics: 'etcdctl snapshot save writes linear transaction history without pausing API operations.',
      },
      kubectlTrace: 'etcdctl snapshot status /backup/snapshot.db',
    },
    {
      step: 3,
      title: 'Point-in-Time Disaster Recovery',
      summary: 'In case of catastrophic failure, cluster is restored from verified snapshot.',
      activeBlockIds: ['c15-snapshot', 'c15-restore'],
      activeConnectionIdxs: [2],
      detailExplanation: {
        simpleWords: 'If a major disaster wipes out the cluster, you restore from the backup in minutes.',
        technicalMechanics: 'etcdctl snapshot restore rebuilds /var/lib/etcd directories with new cluster token.',
      },
      kubectlTrace: 'kubectl get all -A',
    },
  ],
});

// ============================================================================
// DYNAMIC DISPATCH ENGINE FOR ALL 15 CHAPTERS
// Maps every single chapter directly to its authentic architectural topic
// ============================================================================
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
    case 6:
      return CHAPTER_6_FLOW(concept);
    case 7:
      return CHAPTER_7_FLOW(concept);
    case 8:
      return CHAPTER_8_FLOW(concept);
    case 9:
      return CHAPTER_9_FLOW(concept);
    case 10:
      return CHAPTER_10_FLOW(concept);
    case 11:
      return CHAPTER_11_FLOW(concept);
    case 12:
      return CHAPTER_12_FLOW(concept);
    case 13:
      return CHAPTER_13_FLOW(concept);
    case 14:
      return CHAPTER_14_FLOW(concept);
    case 15:
      return CHAPTER_15_FLOW(concept);
    default:
      return CHAPTER_1_FLOW(concept);
  }
}
