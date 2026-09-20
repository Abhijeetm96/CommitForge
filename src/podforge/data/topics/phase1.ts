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
        whatIsIt: 'Containers are isolated user-space processes running directly on the host Linux kernel, partitioned using kernel namespaces and resource-governed via cgroups. Unlike Virtual Machines which require a Type-1 or Type-2 hypervisor emulating virtual hardware and booting an independent guest OS kernel, containers share the host operating system kernel directly.',
        inSimpleWords: 'A Virtual Machine is like building an entire standalone house with its own foundation, plumbing, and electrical generator. A Container is like renting a private apartment in a high-rise building—you have your own private locked rooms and keyed entry, but you share the central building infrastructure (the host OS kernel), saving massive amounts of space and power.',
        realWorldAnalogy: {
          metaphor: 'High-Rise Apartments vs Standalone Single-Family Homes',
          explanation: 'In a single-family house (VM), you must purchase and maintain the roof, foundation, generator, and water tank (guest OS, virtual BIOS, virtual disk). In an apartment complex (Container), hundreds of private residences share the same municipal plumbing and foundation (host kernel), spinning up in seconds and using only the exact space needed.',
        },
        whenToUse: [
          'Microservices architectures requiring rapid horizontal autoscaling within milliseconds.',
          'High-density workloads where maximizing server CPU and RAM utilization is critical.',
          'CI/CD test runners, ephemeral build steps, and immutable artifact deployment pipelines.',
        ],
        whenNotToUse: [
          'Workloads requiring a completely different kernel family (e.g. running Windows NT kernel drivers on a Linux host).',
          'Untrusted multi-tenant execution where kernel-level isolation vulnerabilities pose risk without Kata Containers or Firecracker microVMs.',
          'Direct hardware PCI passthrough or specialized custom kernel module dependencies.',
        ],
        lifecycleSteps: [
          { step: 1, title: 'OCI Bundle Preparation', description: 'The container runtime uncompresses OCI image rootfs tarball layers into a unified mount path via OverlayFS.' },
          { step: 2, title: 'Kernel Namespace Creation', description: 'Linux clone() system call is invoked with flags CLONE_NEWPID, CLONE_NEWNET, CLONE_NEWNS, CLONE_NEWIPC, CLONE_NEWUTS to isolate system tables.' },
          { step: 3, title: 'cgroup Limits Binding', description: 'The runtime writes process PID into /sys/fs/cgroup/ to enforce CPU shares, memory caps, and block I/O throttle limits.' },
          { step: 4, title: 'pivot_root & execve', description: 'pivot_root moves the mount namespace root to the container rootfs, and execve replaces the process image with the container entrypoint as PID 1.' },
        ],
        keyMechanisms: [
          { title: 'Linux Namespaces', detail: 'Isolates visibility: PID (processes), NET (interfaces & routing), MNT (filesystems), IPC (shared memory), UTS (hostnames), and USER (UID/GID mappings).' },
          { title: 'Control Groups (cgroups v2)', detail: 'Enforces resource accounting, throttling, and hard limits across CPU, memory, swapped RAM, and I/O IOPS.' },
          { title: 'Union Filesystem (OverlayFS)', detail: 'Stacks immutable lowerdir image layers beneath a thin ephemeral upperdir copy-on-write layer.' },
        ],
        productionTips: [
          'Always run container processes as non-root (UID > 10000) using PodSecurityContext to prevent host privilege escalation.',
          'Prefer cgroups v2 over v1 on modern Linux hosts for accurate unified memory pressure stall information (PSI) and OOM accounting.',
          'Use distroless or minimal Alpine bases to eliminate package managers and shell binaries that attackers exploit in CVE payloads.',
        ],
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
        whatIsIt: 'The Open Container Initiative (OCI) Image Specification standardizes the cryptographic manifest, layer tarballs, and runtime configurations defining a container. Images are constructed from ordered, immutable filesystem layers stacked through a Union Mount (OverlayFS) with content-addressable SHA-256 digests.',
        inSimpleWords: 'Think of an OCI image like an architectural floor plan drawn on transparent acetate sheets. The bottom sheet is the bare concrete foundation (base OS), the next sheet adds plumbing and electrical wiring (runtime dependencies), and the top sheet adds the furniture and paint (your application code). Only the final transparent stack is sealed and shipped.',
        realWorldAnalogy: {
          metaphor: 'Layered Tracing Paper on an Architect Drawing Board',
          explanation: 'Each sheet of tracing paper modifies or adds lines without erasing previous sheets. When viewed from above, the sheets blend into a complete building plan. If you need to revise the furniture, you replace only the top sheet—you do not redraw the entire concrete foundation.',
        },
        whenToUse: [
          'Packaging stateless or stateful applications with strictly reproducible, versioned dependencies.',
          'Leveraging Docker/BuildKit layer caching to accelerate CI build pipelines from minutes to seconds.',
          'Distributing immutable artifacts across geographic cluster registries using content-addressable SHA-256 digests.',
        ],
        whenNotToUse: [
          'Storing mutable runtime data inside the image layer stack instead of decoupled PersistentVolumeClaims or object storage.',
          'Baking build tools (compilers, SDKs, git) into final runtime production container images.',
          'Hardcoding secrets, API tokens, or private SSH keys directly into Dockerfile intermediate RUN layers.',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Manifest Pull & Verification', description: 'The kubelet queries the OCI registry, downloads the JSON manifest, and verifies cryptographic SHA-256 layer digests.' },
          { step: 2, title: 'Layer Download & Decompression', description: 'Cached layers are skipped; missing tarball layers are downloaded concurrently and unpacked into the container runtime content store.' },
          { step: 3, title: 'OverlayFS Union Mount', description: 'Read-only image layers are mounted as lowerdir, an empty directory is created as upperdir, and an atomic merged view is created.' },
          { step: 4, title: 'Read-Write Container Layer Activation', description: 'Any file modification triggered by the application copies the file from lowerdir to upperdir (Copy-on-Write) without touching base layers.' },
        ],
        keyMechanisms: [
          { title: 'Content-Addressable Storage (CAS)', detail: 'Every layer is identified strictly by the cryptographic SHA-256 hash of its uncompressed contents, ensuring immutability.' },
          { title: 'OverlayFS lowerdir & upperdir', detail: 'Stacked read-only base layers (lowerdir) combined with an ephemeral read-write scratch layer (upperdir) and merge view (merged).' },
          { title: 'Multi-Stage Dockerfiles', detail: 'Compiling binaries in bulky builder environments and copying only static executable binaries into distroless or scratch images.' },
        ],
        productionTips: [
          'Pin images by immutable cryptographic digests (@sha256:...) in production rather than floating :latest tags to prevent silent drift.',
          'Order Dockerfile instructions from least-frequently changed (OS deps) to most-frequently changed (source code) to maximize cache hits.',
          'Always use .dockerignore to prevent accidental inclusion of node_modules, .git directories, and local environment files.',
        ],
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
        whatIsIt: 'The Container Runtime Interface (CRI) is a gRPC specification enabling the Kubernetes kubelet to orchestrate diverse container runtimes (containerd, CRI-O) without recompiling Kubernetes source code. CRI separates high-level image lifecycle management from low-level OCI process execution (runc).',
        inSimpleWords: 'Think of CRI like the universal USB-C port standard on a laptop. Instead of the laptop manufacturer soldering specific proprietary hard drives, keyboards, and displays directly onto the motherboard, the USB-C standard allows any compliant external device to plug in and work seamlessly.',
        realWorldAnalogy: {
          metaphor: 'Universal Audio Jacks and Modular Speaker Systems',
          explanation: 'Your phone does not care whether you plug in studio monitors, earbuds, or a car stereo, as long as both sides adhere to the standard audio jack interface. Similarly, the kubelet does not care whether containers run under containerd, CRI-O, or Kata microVMs, as long as they speak the CRI gRPC protocol.',
        },
        whenToUse: [
          'Selecting modern, lightweight, industry-standard runtimes (containerd or CRI-O) for production Kubernetes nodes.',
          'Injecting security-hardened runtimes (gVisor with runsc or Kata Containers with QEMU/Cloud-Hypervisor) for untrusted multi-tenant pods.',
          'Troubleshooting node-level container startup failures using crictl directly on the host.',
        ],
        whenNotToUse: [
          'Using legacy Docker Engine (dockershim was permanently deprecated in Kubernetes v1.20 and removed in v1.24).',
          'Attempting to invoke docker commands inside modern Kubernetes nodes where dockerd is not installed.',
          'Configuring manual runtime hooks that bypass the CRI gRPC lifecycle contract.',
        ],
        lifecycleSteps: [
          { step: 1, title: 'gRPC Request Dispatch', description: 'The kubelet sends a RunPodSandbox or CreateContainer gRPC request over /run/containerd/containerd.sock.' },
          { step: 2, title: 'Image Rootfs Preparation', description: 'containerd unpacks the OCI image snapshot layers and prepares the container bundle directory with config.json.' },
          { step: 3, title: 'containerd-shim-v2 Fork', description: 'A lightweight shim process is spawned per container to hold open stdio descriptors, exit status, and prevent daemon restarts from killing pods.' },
          { step: 4, title: 'runc Kernel Execution', description: 'runc executes the OCI spec, establishes namespaces and cgroups, executes the container binary, and exits, leaving the running container process monitored by the shim.' },
        ],
        keyMechanisms: [
          { title: 'CRI gRPC API Services', detail: 'RuntimeService (manages Sandbox/Pod lifecycle, container exec, attach) and ImageService (pulls, lists, and removes images).' },
          { title: 'containerd-shim-v2', detail: 'Eliminates container restarts when the containerd daemon restarts, handles I/O streaming, and reaps container exit codes.' },
          { title: 'OCI Runtime Spec (runc)', detail: 'The reference CLI tool that reads OCI config.json and configures Linux kernel namespaces and cgroups directly.' },
        ],
        productionTips: [
          'Use crictl (configured via /etc/crictl.yaml with runtime-endpoint) to debug containers directly on worker nodes when kubelet is unresponsive.',
          'Enable containerd discard_unpacked_layers to save significant local disk space on high-turnover worker nodes.',
          'Monitor the containerd-shim memory footprint on high-density nodes running hundreds of small micro-pods.',
        ],
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
        whatIsIt: 'Container Orchestration is the automated lifecycle management of containerized workloads across clustered compute nodes. It automates provisioning, bin-packing, service discovery, load balancing, health monitoring, zero-downtime rollouts, and autonomous self-healing without human intervention.',
        inSimpleWords: 'Imagine a busy airport terminal with thousands of incoming and outgoing flights. Without air traffic control (orchestration), individual pilots would crash on the runways, fight over passenger gates, and cause catastrophic gridlock. An orchestrator directs traffic, reassigns gates when planes arrive early or late, and ensures passengers reach their destinations safely.',
        realWorldAnalogy: {
          metaphor: 'Air Traffic Control Tower at an International Hub',
          explanation: 'The airport ground crew (containers) do the physical loading and flying. The tower (orchestrator) has the master radar view: assigning runways, redirecting flights if a runway is blocked, and scaling ground staff during flight surges.',
        },
        whenToUse: [
          'Managing fleets of microservices deployed across multiple physical or cloud virtual machines.',
          'Requiring high availability, automated rolling updates, and self-healing when hardware nodes fail.',
          'Dynamic load balancing and automated DNS service discovery across ephemeral container IP addresses.',
        ],
        whenNotToUse: [
          'Simple, single-node monolithic applications with zero scaling requirements (Docker Compose or systemd is simpler).',
          'Teams without platform engineering resources where the operational overhead of a cluster exceeds application complexity.',
          'Extremely static batch workloads that run once a month on a single server.',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Declarative State Ingestion', description: 'Operator submits a desired specification (e.g., 5 replicas of an API) to the kube-apiserver.' },
          { step: 2, title: 'State Storage & Notification', description: 'The spec is persisted to etcd; the deployment controller receives a watch event indicating a discrepancy.' },
          { step: 3, title: 'Intelligent Node Bin-Packing', description: 'The scheduler filters available worker nodes by capacity and taints, scoring and binding pods to optimal hosts.' },
          { step: 4, title: 'Autonomous Health Supervision', description: 'Control loops continuously poll node and pod health. If a host catches fire, pods are rescheduled to healthy nodes instantly.' },
        ],
        keyMechanisms: [
          { title: 'Declarative vs Imperative', detail: 'You define the desired target state in YAML; Kubernetes computes and executes the minimal delta necessary to reach it.' },
          { title: 'Self-Healing Loops', detail: 'Automatic restart of crashed containers, replacement of dead nodes, and traffic rerouting away from failing endpoints.' },
          { title: 'Automated Bin-Packing', detail: 'Packing containers onto nodes based on declared CPU and memory requests to maximize cluster hardware efficiency.' },
        ],
        productionTips: [
          'Never manage pods directly in production; always wrap them in controllers (Deployments, StatefulSets, DaemonSets) for self-healing guarantees.',
          'Treat compute nodes as cattle, not pets—nodes should be freely terminable and replaceable at any moment without application downtime.',
          'Set realistic resource requests and limits on every container to enable intelligent bin-packing and prevent node eviction storms.',
        ],
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
        explanation: 'The Kubernetes Control Plane governs cluster state. The kube-apiserver is the single front door: it validates and configures data for objects, rejecting unauthenticated or malformed requests. etcd is a consistent, highly available key-value store (using the Raft consensus algorithm) holding the entire cluster truth. The kube-scheduler assigns unscheduled pods to optimal nodes based on resource capacity, taints, and affinity rules. The kube-controller-manager runs core control loops (node controller, replica set controller, endpoint controller) that enforce desired state.',
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
        whatIsIt: 'The Kubernetes Control Plane is the distributed brain of the cluster, responsible for exposing the management API, storing state, scheduling workloads, and continuously reconciling actual reality with desired specifications across all worker nodes.',
        inSimpleWords: 'Think of the Control Plane like corporate executive headquarters. The CEO/Front Desk (kube-apiserver) reviews all incoming memos, the immutable corporate legal ledger (etcd) records all contracts, the logistics planner (kube-scheduler) assigns tasks to factory floors, and the operations manager (controller-manager) constantly checks factory output against corporate goals.',
        realWorldAnalogy: {
          metaphor: 'Corporate Executive Headquarters and Regional Factories',
          explanation: 'The factory workers (nodes) do the physical assembly work. The executive suite (control plane) makes strategic routing decisions, holds the master records, and hires replacements when machinery breaks down.',
        },
        whenToUse: [
          'High-availability enterprise clusters requiring redundant 3-node or 5-node control planes distributed across availability zones.',
          'Diagnosing cluster-wide scheduling delays, API timeouts, or etcd leader election bottlenecks.',
          'Hardening cluster security boundaries by auditing API server flags, encryption providers, and admission webhooks.',
        ],
        whenNotToUse: [
          'Running compute-heavy user workloads directly on control plane nodes (master nodes should remain tainted with NoSchedule).',
          'Operating an even number of etcd members (always use 3 or 5 members to prevent split-brain quorum failure).',
          'Exposing the kube-apiserver port 6443 directly to the public internet without private endpoint firewalls.',
        ],
        lifecycleSteps: [
          { step: 1, title: 'API Ingestion & Admission', description: 'Client issues an HTTP request; kube-apiserver performs Authentication (certs/tokens), Authorization (RBAC), and Admission Control webhooks.' },
          { step: 2, title: 'etcd Raft Consensus Commit', description: 'The validated object is written to etcd key /registry/pods/...; consensus is reached across the quorum of etcd followers.' },
          { step: 3, title: 'Scheduler Notification', description: 'kube-scheduler watches for Pods with spec.nodeName empty, applies filtering and scoring algorithms, and issues a Binding call to apiserver.' },
          { step: 4, title: 'Controller Reconciliation', description: 'kube-controller-manager tracks the object lifecycle, firing child controllers (endpoint slice, garbage collector, replica sets).' },
        ],
        keyMechanisms: [
          { title: 'kube-apiserver', detail: 'The only component that communicates directly with etcd; all other cluster components communicate strictly through the API server via TLS.' },
          { title: 'etcd Distributed Raft', detail: 'Strongly consistent key-value database requiring (N/2)+1 quorum to accept write operations.' },
          { title: 'Optimistic Concurrency Control (OCC)', detail: 'Uses metadata.resourceVersion to prevent write collisions when multiple controllers attempt updates simultaneously.' },
        ],
        productionTips: [
          'Back up etcd snapshots automatically every hour to encrypted object storage; etcd is the single source of cluster truth.',
          'Always deploy etcd on ultra-fast NVMe storage; etcd is extremely sensitive to disk fsync latency bottlenecks.',
          'Use managed control planes (EKS, GKE, AKS) unless on-prem regulatory requirements mandate self-managed kubeadm clusters.',
        ],
      },
      {
        id: 'c-worker-node-anatomy',
        number: '2.2',
        title: 'Worker Node Anatomy',
        commandPill: 'kubectl describe node <node>',
        badge: 'Node Architecture',
        difficulty: 'Intermediate',
        description: 'Explore the anatomy of a worker node: the kubelet agent, kube-proxy networking, and the container runtime engine.',
        explanation: 'Worker nodes host the application workloads. On every node runs: (1) kubelet, the primary node agent that registers the node with the apiserver, watches PodSpecs assigned to it, and instructs the CRI runtime to start/stop containers while reporting status back; (2) kube-proxy, a network proxy running on each node that maintains iptables or IPVS packet filtering rules to route Service ClusterIP traffic directly to pod IPs; and (3) the Container Runtime (containerd/CRI-O) executing container binaries.',
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
        whatIsIt: 'A Kubernetes Worker Node is a physical or virtual machine responsible for hosting running application pods. Every worker node runs the kubelet node agent, the kube-proxy network filter, a CRI container runtime, and a CNI network plugin.',
        inSimpleWords: 'If the Control Plane is the corporate management office, a Worker Node is the local factory warehouse floor. The factory foreman (the kubelet) receives blueprints from corporate, hires the local machines (container runtime) to assemble the products, and maintains the highway delivery signs (kube-proxy).',
        realWorldAnalogy: {
          metaphor: 'Local Distribution Warehouse and On-Site General Contractor',
          explanation: 'Corporate sends work orders to the on-site foreman (kubelet). The foreman ensures materials (container images) are unpacked, assembly lines (pods) are running, and sends hourly status reports back to headquarters.',
        },
        whenToUse: [
          'Scaling cluster compute capacity horizontally by attaching new cloud instances to meet application traffic demands.',
          'Configuring heterogeneous node pools (e.g., GPU nodes, high-memory database nodes, spot/preemptible nodes) with dedicated labels.',
          'Investigating node pressure conditions (DiskPressure, MemoryPressure, PIDPressure, NetworkUnavailable).',
        ],
        whenNotToUse: [
          'Manually modifying container configurations directly on worker node hosts using local shell tools (causes state drift).',
          'Storing persistent application state on the ephemeral local node filesystem without dedicated PV volumes.',
          'Running clusters with all worker nodes in a single availability zone without multi-AZ fault tolerance.',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Node Registration & Heartbeat', description: 'The kubelet registers the node with kube-apiserver with its capacity (CPU, RAM, max pods) and begins sending leases/heartbeats every 10s.' },
          { step: 2, title: 'PodSpec Watch Loop', description: 'The kubelet watches the apiserver for Pods assigned to its nodeName and retrieves the full Pod specification.' },
          { step: 3, title: 'Pod Sandbox & CNI Attachment', description: 'kubelet instructs containerd to create the Pod Sandbox (pause container) and invokes the CNI plugin to configure virtual veth interfaces and IP routing.' },
          { step: 4, title: 'Container Execution & Probe Supervision', description: 'containerd pulls images and launches containers; kubelet initiates periodic liveness, readiness, and startup health probes.' },
        ],
        keyMechanisms: [
          { title: 'kubelet Node Agent', detail: 'Runs as a systemd daemon on the host; verifies pod specs, mounts storage volumes, triggers health probes, and reaps failed containers.' },
          { title: 'kube-proxy (iptables/IPVS)', detail: 'Programs Linux kernel packet filtering rules on each node to translate virtual ClusterIP addresses into physical pod IPs.' },
          { title: 'Node Status Conditions', detail: 'Ready, MemoryPressure, DiskPressure, PIDPressure, and NetworkUnavailable reported continuously to the control plane.' },
        ],
        productionTips: [
          'Configure system-reserved and kube-reserved resource allocations to prevent user pods from starving the kubelet and system daemons.',
          'Migrate kube-proxy from legacy iptables mode to IPVS mode for clusters exceeding 1,000 services to prevent O(N) packet rule evaluation lag.',
          'Monitor node allocatable CPU and RAM rather than raw physical capacity when capacity planning.',
        ],
      },
      {
        id: 'c-reconciliation-loops',
        number: '2.3',
        title: 'The Reconciliation Loop Model',
        commandPill: 'kubectl diff -f manifest.yaml',
        badge: 'Core Philosophy',
        difficulty: 'Intermediate',
        description: 'How Kubernetes operates: Edge-triggered vs Level-triggered systems, infinite control loops, and self-healing.',
        explanation: 'Kubernetes is fundamentally a level-triggered, declarative system. Rather than executing imperative actions ("start container X now"), you declare a target specification (spec). Controllers execute an infinite loop: Observe reality -> Compare against desired spec -> Compute delta -> Actuate changes to reconcile reality with desired state. If a physical node crashes or a rogue process kills a container, the loop notices the deficit and automatically spins up a replacement on a healthy node.',
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
        whatIsIt: 'The Reconciliation Loop is the fundamental software design pattern powering Kubernetes. It is an infinite control loop that continuously observes current cluster state, compares it against the declared desired state, and executes actions to converge reality with the target specification.',
        inSimpleWords: 'Think of a smart thermostat in your living room. You set the temperature to 72°F (desired state). The thermostat does not care if someone opened a window, turned on an oven, or if it is freezing outside; it simply observes the current room temperature, detects the difference, and toggles the furnace or AC until the room is 72°F again.',
        realWorldAnalogy: {
          metaphor: 'Smart Home Dual-Zone HVAC Thermostat',
          explanation: 'You declare: "Keep my home at 70°F." If a sudden storm drops the temperature to 64°F, the system turns on the heater automatically. It does not wait for you to call tech support; it self-corrects based on continuous feedback.',
        },
        whenToUse: [
          'Designing robust cloud-native applications that self-heal autonomously from unexpected crashes or hardware failures.',
          'Implementing Custom Resource Controllers and Operators to automate complex operational runbooks.',
          'Auditing GitOps pipelines where the Git repository defines desired state and in-cluster controllers enforce it.',
        ],
        whenNotToUse: [
          'Relying on imperative, one-shot shell scripts that assume intermediate states are always clean and linear.',
          'Workloads with strict non-idempotent side effects (e.g. charging a credit card) executed directly in reconciliation loops without idempotency tokens.',
          'Building tight real-time systems where milliseconds of controller sync latency cannot be tolerated.',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Observe (Watch & Inform)', description: 'The controller uses client-go shared informers and reflectors to watch apiserver events and maintain a synchronized in-memory cache.' },
          { step: 2, title: 'Compare (Compute Delta)', description: 'The Reconcile(Request) function compares the spec (desired state) against status (actual reality) to determine if a discrepancy exists.' },
          { step: 3, title: 'Actuate (Execute Mutations)', description: 'The controller issues API calls (creating Pods, updating endpoints, scaling replicas) to close the discovered delta.' },
          { step: 4, title: 'Status Update & Re-queue', description: 'The controller updates the resource status subresource and returns a Result object with optional requeue duration.' },
        ],
        keyMechanisms: [
          { title: 'Level-Triggered Architecture', detail: 'Reacts to the current level (state of the world) rather than edge triggers (discrete arrival events), making it inherently resilient to lost network packets.' },
          { title: 'Idempotency', detail: 'Running the reconcile loop 1 time or 100 times with the same input produces the exact same end state without duplicate side-effects.' },
          { title: 'WorkQueue & RateLimiting', detail: 'Failed reconciliations are backed off exponentially to prevent hammering the kube-apiserver during cluster outages.' },
        ],
        productionTips: [
          'Ensure custom controllers and operators are strictly idempotent; reconciliation can fire repeatedly at any time.',
          'Always use the status subresource (status.replicas, status.conditions) when recording observations to prevent race conditions with spec updates.',
          'Use kubectl diff -f manifest.yaml before applying changes to preview exactly what the reconciliation loop will modify.',
        ],
      },
      {
        id: 'c-mastering-kubectl',
        number: '2.4',
        title: 'Mastering kubectl & Kubeconfig',
        commandPill: 'kubectl config view',
        badge: 'CLI Mastery',
        difficulty: 'Beginner',
        description: 'Master kubectl: Kubeconfig structure, multi-cluster contexts, namespaces, custom columns, and JSONPath filtering.',
        explanation: 'kubectl is the official CLI client communicating with kube-apiserver via HTTPS REST calls. Its configuration lives in ~/.kube/config, structured into clusters (API endpoints & CA certs), users (client certs, tokens, or OIDC credentials), and contexts (the triplet linking cluster + user + default namespace). Mastering kubectl involves using -n <namespace>, output formatting (-o json, -o yaml, -o wide), and JSONPath queries (-o jsonpath="{.items[*].metadata.name}") for scriptable automation.',
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
        whatIsIt: 'kubectl is the official command-line interface for administering Kubernetes clusters. It translates user commands into authenticated HTTP REST API requests against the kube-apiserver, utilizing the ~/.kube/config configuration file to manage multi-cluster contexts, authentication tokens, and default namespaces.',
        inSimpleWords: 'kubectl is like your all-access administrative pass and Swiss Army knife for the cluster. It holds your identity badges (certificates), the street addresses of all your company offices (cluster API URLs), and allows you to inspect, manage, and fix anything across the entire fleet.',
        realWorldAnalogy: {
          metaphor: 'Universal Master Remote Control and Encrypted Passport',
          explanation: 'Your passport (kubeconfig) contains entry visas for multiple countries (clusters). With a single toggle (kubectl config use-context), you switch which country you are visiting and command its infrastructure directly.',
        },
        whenToUse: [
          'Day-to-day cluster triage, inspecting pods, reading container logs, and diagnosing CrashLoopBackOff states.',
          'Imperatively generating baseline YAML manifests with --dry-run=client -o yaml to avoid manual boilerplate typing.',
          'Automating administrative scripting using JSONPath, custom-columns, and jq pipelines.',
        ],
        whenNotToUse: [
          'Imperatively managing production state with ad-hoc kubectl edit or kubectl patch in production (breaks GitOps source-of-truth).',
          'Committing raw kubeconfig files containing unencrypted admin certificates into git repositories.',
          'Running unbounded kubectl get pods across massive enterprise clusters without namespace or field-selector filtering.',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Kubeconfig Loading & Context Merging', description: 'kubectl merges configs from KUBECONFIG environment variable or ~/.kube/config and determines the current-context.' },
          { step: 2, title: 'Authentication Token Resolution', description: 'Resolves client certificates, bearer tokens, or executes OIDC auth-provider plugins (e.g., aws-iam-authenticator, gke-gcloud-auth-plugin).' },
          { step: 3, title: 'REST Request Generation', description: 'Queries OpenAPI/Swagger discovery cache, transforms command arguments into REST HTTP requests (GET, POST, PATCH), and serializes JSON payload.' },
          { step: 4, title: 'Output Formatting & Table Printing', description: 'Parses the HTTP response and renders output according to user flags (-o json, -o yaml, -o wide, -o custom-columns, or -o jsonpath).' },
        ],
        keyMechanisms: [
          { title: 'Kubeconfig Triplet', detail: 'A context binds a Cluster (API endpoint + CA cert) to a User (auth credentials) and a Namespace.' },
          { title: 'Dry-Run Client Manifest Generation', detail: 'kubectl create deploy my-api --image=nginx --dry-run=client -o yaml generates pristine production boilerplate instantly.' },
          { title: 'API Discovery Caching', detail: 'Caches API server resource types in ~/.kube/cache/discovery to speed up shell tab completion and resource resolution.' },
        ],
        productionTips: [
          'Always use alias k=kubectl and install shell tab completion (source <(kubectl completion bash)) for 10x CLI speed.',
          'Master JSONPath: kubectl get pods -o jsonpath="{.items[*].metadata.name}" to extract values without external dependencies.',
          'Set a default namespace in your active context (kubectl config set-context --current --namespace=my-app) to stop typing -n every time.',
        ],
      },
    ],
  },
];
