import type { KubeChapter } from './types';

export const PHASE_1_CHAPTERS: KubeChapter[] = [
  {
    id: 'ch01-foundations',
    number: 1,
    title: 'Container & Cloud-Native Foundations',
    category: 'Architecture Foundations',
    concepts: [
      {
        id: 'c-containers-vs-vms',
        number: '1.1',
        title: 'Containers vs Virtual Machines',
        commandPill: 'ls -l /proc/$$/ns',
        badge: 'Fundamental',
        difficulty: 'Beginner',
        description: 'Understand how containers leverage Linux kernel primitives (cgroups, namespaces, chroot) rather than hypervisors to deliver lightweight process isolation.',
        explanation: 'Unlike Virtual Machines that emulate hardware and run independent guest operating systems, containers are isolated Linux processes sharing the host OS kernel. Linux Namespaces partition system resources (PID for process trees, NET for network interfaces, MNT for filesystem mounts, IPC, UTS, and USER), while Control Groups (cgroups v1/v2) enforce hard limits and accounting on CPU, memory, and I/O. This results in sub-second startup times and near-zero virtualization overhead.',
        yamlSnippet: `# Concept: Linux Process Isolation Model
# Containers share the host kernel while being partitioned by namespaces:
# - pid: Process ID isolation (container process is PID 1 inside, PID 28412 outside)
# - net: Virtual network interfaces, IP addresses, routing tables
# - mnt: Isolated filesystem mounts via pivot_root / chroot
# - ipc: Inter-process communication and shared memory
# - uts: Hostname and NIS domain name
# - user: User and group ID mapping`,
        kubectlCommands: ['kubectl get nodes -o wide', 'kubectl version --output=json'],
        visualizerFocus: 'Isolated container processes running directly on host OS kernel',
        practiceChallenge: {
          instructions: 'Query the cluster nodes and verify the operating system, kernel version, and container runtime engine.',
          goalCommand: 'kubectl get nodes -o wide',
          hints: ['Use kubectl get nodes with the -o wide flag', 'Notice the OS-IMAGE, KERNEL-VERSION, and CONTAINER-RUNTIME columns'],
        },
      },
      {
        id: 'c-oci-image-layers',
        number: '1.2',
        title: 'OCI Specifications & Image Layers',
        commandPill: 'docker history <image>',
        badge: 'OCI Standards',
        difficulty: 'Beginner',
        description: 'Explore the Open Container Initiative (OCI) image format, Union Filesystems (OverlayFS), layer caching, and multi-stage builds.',
        explanation: 'Container images conform to the OCI Image Specification. An image is a cryptographic manifest referencing an ordered stack of immutable tarball layers plus runtime configurations. Using overlay filesystems (OverlayFS), each instruction in a container build creates a read-only layer. When a container runs, a thin ephemeral read-write layer is mounted on top. Multi-stage builds compile artifacts in bulky builder stages and copy only runtime binaries into minimal scratch or distroless images, radically shrinking attack surfaces and pull latency.',
        yamlSnippet: `# Container Image Spec & Layer Anatomy
apiVersion: v1
kind: Pod
metadata:
  name: optimized-app
spec:
  containers:
  - name: web
    # Distroless or Alpine base yields minimal CVEs and fast pull times
    image: cgr.dev/chainguard/nginx:latest
    imagePullPolicy: IfNotPresent
    resources:
      requests:
        cpu: "50m"
        memory: "64Mi"`,
        kubectlCommands: ['kubectl describe pod web-frontend', 'kubectl get pods -o jsonpath="{.items[*].spec.containers[*].image}"'],
        visualizerFocus: 'Immutable read-only OCI image layers stacked beneath a thin read-write container layer',
        practiceChallenge: {
          instructions: 'Describe the web-frontend pod to inspect its pulled image details and image pull policy.',
          goalCommand: 'kubectl describe pod web-frontend',
          hints: ['Run kubectl describe pod with the pod name', 'Examine the Containers section and Events at the bottom'],
        },
      },
      {
        id: 'c-container-runtimes-cri',
        number: '1.3',
        title: 'Container Runtimes & CRI Architecture',
        commandPill: 'crictl info',
        badge: 'Runtime Plumbing',
        difficulty: 'Intermediate',
        description: 'Trace how Kubernetes interacts with low-level container runtimes via the Container Runtime Interface (CRI), containerd, and runc.',
        explanation: 'Kubernetes does not execute containers directly. Instead, the kubelet communicates with a CRI-compliant daemon (such as containerd or CRI-O) over a local UNIX domain gRPC socket. The high-level runtime manages image pulling, rootfs unpacking, and snapshotting, then delegates container creation to low-level OCI runtimes like runc or Kata Containers using the containerd-shim-v2. This decouples Kubernetes from specific container tooling.',
        yamlSnippet: `# Kubelet CRI Architecture
# Kubelet -> /run/containerd/containerd.sock (gRPC)
# containerd -> containerd-shim-v2 -> runc -> Linux namespaces/cgroups
apiVersion: v1
kind: Node
metadata:
  name: worker-node-1
status:
  nodeInfo:
    containerRuntimeVersion: "containerd://1.7.13"
    kubeletVersion: "v1.31.0"`,
        kubectlCommands: ['kubectl get nodes -o wide', 'kubectl get pods -n kube-system'],
        visualizerFocus: 'Kubelet delegating lifecycle commands to containerd via CRI gRPC socket',
        practiceChallenge: {
          instructions: 'Inspect the cluster nodes to see what container runtime version is actively executing containers.',
          goalCommand: 'kubectl get nodes -o wide',
          hints: ['Run kubectl get nodes -o wide', 'Look at the CONTAINER-RUNTIME column'],
        },
      },
      {
        id: 'c-why-orchestration',
        number: '1.4',
        title: 'Why Container Orchestration?',
        commandPill: 'kubectl get all',
        badge: 'Distributed Systems',
        difficulty: 'Beginner',
        description: 'Why raw containers fail in production: declarative desired state, continuous reconciliation, automated rollouts, and self-healing.',
        explanation: 'Running solitary containers with scripts breaks down at scale: host failures crash processes unnoticed, traffic cannot easily load-balance across dynamic ephemeral IPs, and rollouts cause downtime. Kubernetes provides an automated control plane that treats fleets of physical/cloud machines as a single unified compute fabric. You declare what the system should look like (e.g., "3 replicas of API v2"), and Kubernetes continuously reconciles reality to match your intent 24/7/365.',
        yamlSnippet: `# The Declarative Orchestration Contract
apiVersion: apps/v1
kind: Deployment
metadata:
  name: resilient-microservice
spec:
  replicas: 3
  selector:
    matchLabels:
      app: microservice
  template:
    metadata:
      labels:
        app: microservice
    spec:
      containers:
      - name: api
        image: nginx:1.25-alpine`,
        kubectlCommands: ['kubectl get all', 'kubectl get deployments', 'kubectl get pods'],
        visualizerFocus: 'Continuous reconciliation loop comparing current cluster state against desired state',
        practiceChallenge: {
          instructions: 'Query all cluster resources simultaneously using the aggregated resource shortcut.',
          goalCommand: 'kubectl get all',
          hints: ['Use the kubectl get all command to see pods, services, and deployments together'],
        },
      },
    ],
  },
  {
    id: 'ch02-architecture',
    number: 2,
    title: 'Kubernetes Control Plane & Node Architecture',
    category: 'Architecture Foundations',
    concepts: [
      {
        id: 'c-control-plane-anatomy',
        number: '2.1',
        title: 'Control Plane Anatomy',
        commandPill: 'kubectl get componentstatuses',
        badge: 'Control Plane',
        difficulty: 'Intermediate',
        description: 'Dissect the brain of Kubernetes: kube-apiserver, etcd distributed consensus, kube-scheduler, and kube-controller-manager.',
        explanation: 'The Kubernetes Control Plane governs cluster state. The `kube-apiserver` is the single front door: it validates and configures data for objects, rejecting unauthenticated or malformed requests. `etcd` is a consistent, highly available key-value store (using the Raft consensus algorithm) holding the entire cluster truth. The `kube-scheduler` assigns unscheduled pods to optimal nodes based on resource capacity, taints, and affinity rules. The `kube-controller-manager` runs core control loops (node controller, replica set controller, endpoint controller) that enforce desired state.',
        yamlSnippet: `# Control Plane Component Stack
# 1. kube-apiserver: Stateless REST gateway, auth, admission webhooks
# 2. etcd: Raft-based distributed key-value store (/registry/...)
# 3. kube-scheduler: Filters and scores nodes for pending pods
# 4. kube-controller-manager: Loop of loops maintaining desired state
# 5. cloud-controller-manager: Cloud provider load balancer / route sync`,
        kubectlCommands: ['kubectl get nodes', 'kubectl get pods -n kube-system', 'kubectl cluster-info'],
        visualizerFocus: 'Control plane master node housing kube-apiserver, etcd, scheduler, and controller-manager',
        practiceChallenge: {
          instructions: 'Query the cluster endpoint and verification information using the cluster-info command.',
          goalCommand: 'kubectl cluster-info',
          hints: ['Run kubectl cluster-info', 'Notice the Kubernetes control plane master URL'],
        },
      },
      {
        id: 'c-worker-node-anatomy',
        number: '2.2',
        title: 'Worker Node Anatomy',
        commandPill: 'kubectl describe node <node>',
        badge: 'Node Architecture',
        difficulty: 'Intermediate',
        description: 'Explore the anatomy of a worker node: the kubelet agent, kube-proxy networking, and the container runtime engine.',
        explanation: 'Worker nodes host the application workloads. On every node runs: (1) `kubelet`, the primary node agent that registers the node with the apiserver, watches PodSpecs assigned to it, and instructs the CRI runtime to start/stop containers while reporting status back; (2) `kube-proxy`, a network proxy running on each node that maintains iptables or IPVS packet filtering rules to route Service ClusterIP traffic directly to pod IPs; and (3) the Container Runtime (containerd/CRI-O) executing container binaries.',
        yamlSnippet: `# Worker Node Component Structure
apiVersion: v1
kind: Node
metadata:
  name: worker-node-1
  labels:
    node-role.kubernetes.io/worker: ""
spec:
  podCIDR: "10.244.1.0/24"
status:
  conditions:
  - type: Ready
    status: "True"
    reason: KubeletReady
  - type: MemoryPressure
    status: "False"
  - type: DiskPressure
    status: "False"`,
        kubectlCommands: ['kubectl describe node worker-node-1', 'kubectl get nodes'],
        visualizerFocus: 'Worker node components: kubelet, kube-proxy, and containerd hosting application pods',
        practiceChallenge: {
          instructions: 'Describe worker-node-1 to inspect its allocated IP addresses, capacity, and system conditions.',
          goalCommand: 'kubectl describe node worker-node-1',
          hints: ['Run kubectl describe node worker-node-1', 'Check the Conditions section (Ready: True)'],
        },
      },
      {
        id: 'c-reconciliation-loops',
        number: '2.3',
        title: 'The Reconciliation Loop Model',
        commandPill: 'kubectl diff -f manifest.yaml',
        badge: 'Core Philosophy',
        difficulty: 'Intermediate',
        description: 'How Kubernetes operates: Edge-triggered vs Level-triggered systems, infinite control loops, and self-healing.',
        explanation: 'Kubernetes is fundamentally a level-triggered, declarative system. Rather than executing imperative actions ("start container X now"), you declare a target specification (`spec`). Controllers execute an infinite loop: Observe reality -> Compare against desired spec -> Compute delta -> Actuate changes to reconcile reality with desired state. If a physical node crashes or a rogue process kills a container, the loop notices the deficit and automatically spins up a replacement on a healthy node.',
        yamlSnippet: `# The Reconciliation Contract:
# Observe (Get current Pods) -> Compare (Target: 3, Actual: 2) -> Actuate (Create 1 Pod)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: self-healing-api
spec:
  replicas: 2
  selector:
    matchLabels:
      app: self-healing-api
  template:
    metadata:
      labels:
        app: self-healing-api
    spec:
      containers:
      - name: api
        image: nginx:1.25`,
        kubectlCommands: ['kubectl get deployments', 'kubectl scale deployment frontend-web --replicas=3'],
        visualizerFocus: 'Controller loop comparing spec.replicas with status.readyReplicas',
        practiceChallenge: {
          instructions: 'Scale the frontend-web deployment to 3 replicas to trigger the deployment controller reconciliation loop.',
          goalCommand: 'kubectl scale deployment frontend-web --replicas=3',
          hints: ['Run kubectl scale deployment frontend-web --replicas=3', 'Watch the controller create a new pod'],
        },
      },
      {
        id: 'c-mastering-kubectl',
        number: '2.4',
        title: 'Mastering kubectl & Kubeconfig',
        commandPill: 'kubectl config view',
        badge: 'CLI Mastery',
        difficulty: 'Beginner',
        description: 'Master kubectl: Kubeconfig structure, multi-cluster contexts, namespaces, custom columns, and JSONPath filtering.',
        explanation: '`kubectl` is the official CLI client communicating with `kube-apiserver` via HTTPS REST calls. Its configuration lives in `~/.kube/config`, structured into clusters (API endpoints & CA certs), users (client certs, tokens, or OIDC credentials), and contexts (the triplet linking cluster + user + default namespace). Mastering kubectl involves using `-n <namespace>`, output formatting (`-o json`, `-o yaml`, `-o wide`), and JSONPath queries (`-o jsonpath="{.items[*].metadata.name}"`) for scriptable automation.',
        yamlSnippet: `# Structure of ~/.kube/config
apiVersion: v1
kind: Config
preferences: {}
clusters:
- cluster:
    certificate-authority-data: LS0t...
    server: https://127.0.0.1:6443
  name: podforge-cluster
users:
- name: podforge-dev
  user:
    token: eyJhbGciOi...
contexts:
- context:
    cluster: podforge-cluster
    namespace: default
    user: podforge-dev
  name: dev-context
current-context: dev-context`,
        kubectlCommands: ['kubectl config view', 'kubectl get namespaces', 'kubectl get pods -n default'],
        visualizerFocus: 'Client CLI authenticating through kubeconfig context to kube-apiserver',
        practiceChallenge: {
          instructions: 'View the active namespaces configured inside the Kubernetes cluster.',
          goalCommand: 'kubectl get namespaces',
          hints: ['Run kubectl get namespaces or kubectl get ns', 'Observe default, kube-system, production, etc.'],
        },
      },
    ],
  },
];
