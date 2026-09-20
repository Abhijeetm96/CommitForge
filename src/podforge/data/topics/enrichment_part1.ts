import type { KubePitfall, KubeQuizQuestion, KubeYamlFieldExplanation } from './types';

export interface ConceptEnrichment {
  commonPitfalls: KubePitfall[];
  quizQuestion: KubeQuizQuestion;
  yamlExplanation: KubeYamlFieldExplanation[];
  referenceCheatSheet: string[];
  solutionExplanation?: string;
  expectedOutput?: string;
}

export const PART_1_ENRICHMENT: Record<string, ConceptEnrichment> = {
  'c-k8s-overview': {
    commonPitfalls: [
      {
        mistake: 'Running imperative `kubectl run` in production instead of declarative GitOps YAML manifests.',
        whyItHappens: 'Quick debugging habits in local dev lead engineers to apply state directly without versioning in Git.',
        fix: 'Always store manifests in Git, validate with `kubectl apply --dry-run=client -f manifest.yaml`, and let CI/CD deploy.',
      },
      {
        mistake: 'Assuming Kubernetes automatically handles database state and persistent backups out of the box.',
        whyItHappens: 'Kubernetes was initially designed for stateless apps; persistent state requires careful CSI and backup strategies.',
        fix: 'Use dedicated Operators (e.g. CloudNative-PG, Strimzi) or cloud-managed database services (RDS, Cloud SQL).',
      },
    ],
    quizQuestion: {
      question: 'Which component of the Kubernetes Control Plane is the SOLE component that directly reads and writes to the cluster state database (etcd)?',
      options: [
        { label: 'A', text: 'kube-scheduler', isCorrect: false, explanation: 'The scheduler queries kube-apiserver to find unassigned pods, but never speaks to etcd directly.' },
        { label: 'B', text: 'kube-apiserver', isCorrect: true, explanation: 'Correct! kube-apiserver acts as the sole secure gateway to etcd, enforcing authentication, authorization, and schema validation.' },
        { label: 'C', text: 'kube-controller-manager', isCorrect: false, explanation: 'Controllers interact exclusively with the kube-apiserver API, never with etcd directly.' },
        { label: 'D', text: 'kubelet', isCorrect: false, explanation: 'kubelet runs on worker nodes and communicates solely with kube-apiserver.' },
      ],
    },
    yamlExplanation: [
      { field: 'apiVersion: apps/v1', explanation: 'Specifies the API group (apps) and version (v1) that defines the schema for Deployments.' },
      { field: 'kind: Deployment', explanation: 'Declares the resource type. Kubernetes routes this to the Deployment controller.' },
      { field: 'metadata.name', explanation: 'Unique alphanumeric identifier for this object within its namespace.' },
      { field: 'spec.replicas: 3', explanation: 'The desired number of identical Pods to run continuously across the worker nodes.' },
      { field: 'spec.template', explanation: 'The blueprint Pod specification used by the controller whenever creating new replicas.' },
    ],
    referenceCheatSheet: [
      'kubectl cluster-info : Display control plane and core services addresses',
      'kubectl get all -A : List every resource across all namespaces',
      'kubectl api-resources : View all available API types, shortnames, and API groups',
      'kubectl explain <resource> : Explore official field schema and definitions from the API server',
    ],
    solutionExplanation: 'Running `kubectl version --output=yaml` queries both client and server versions and prints structured YAML metadata verifying cluster connectivity.',
    expectedOutput: 'clientVersion:\n  major: "1"\n  minor: "30"\nserverVersion:\n  major: "1"\n  minor: "30"',
  },

  'c-k8s-why-use': {
    commonPitfalls: [
      {
        mistake: 'Over-engineering: Adopting Kubernetes for a simple single-page app or tiny monolithic service.',
        whyItHappens: 'Resume-driven development rather than business necessity.',
        fix: 'Evaluate platform overhead; single monoliths often thrive on simple PaaS (Fly.io, Render) or single VMs until scale demands K8s.',
      },
      {
        mistake: 'Neglecting resource requests, causing runaway pods to crash entire nodes.',
        whyItHappens: 'Omitting `resources.requests` and `limits` lets a single memory leak trigger the Linux OOM Killer across the node.',
        fix: 'Always declare both CPU and Memory requests and limits in every container spec.',
      },
    ],
    quizQuestion: {
      question: 'How does Kubernetes implement self-healing when an application container crashes with exit code 137 (OOM)?',
      options: [
        { label: 'A', text: 'The engineer must SSH into the node and run `docker start` manually.', isCorrect: false, explanation: 'Kubernetes eliminates the need for manual server intervention.' },
        { label: 'B', text: 'The node kubelet detects the process termination and restarts the container according to the Pod restartPolicy.', isCorrect: true, explanation: 'Correct! The node-local kubelet monitors the container runtime (CRI) and restarts failed containers automatically.' },
        { label: 'C', text: 'The entire worker node is terminated and replaced by the cloud provider.', isCorrect: false, explanation: 'Individual container failures do not cause node replacement.' },
        { label: 'D', text: 'Traffic is routed to external DNS servers while the pod remains dead.', isCorrect: false, explanation: 'Kubernetes self-heals by restarting or rescheduling the pod.' },
      ],
    },
    yamlExplanation: [
      { field: 'spec.restartPolicy: Always', explanation: 'Tells kubelet to restart the container regardless of why it terminated (default for Deployments).' },
      { field: 'spec.strategy.type: RollingUpdate', explanation: 'Ensures zero-downtime deployments by launching new pods before terminating old ones.' },
      { field: 'spec.strategy.rollingUpdate.maxSurge: 25%', explanation: 'Allows up to 25% extra pods during a rollout to prevent capacity drops.' },
    ],
    referenceCheatSheet: [
      'kubectl get nodes -o wide : View nodes with internal IPs, OS images, and kernel versions',
      'kubectl rollout status deployment/<name> : Track live progress of a rollout',
      'kubectl rollout undo deployment/<name> : Instantly rollback to the previous revision',
    ],
    solutionExplanation: 'Querying nodes with `-o wide` returns detailed infrastructure properties including internal IPs, container runtimes, and kernel versions.',
  },

  'c-k8s-key-concepts': {
    commonPitfalls: [
      {
        mistake: 'Confusing a Pod with a Container.',
        whyItHappens: 'In Docker, the unit of deployment is a single container; in K8s, it is always a Pod (which can contain 1 or more co-located containers).',
        fix: 'Remember: Containers in the same Pod share IPC, network namespace, and localhost.',
      },
      {
        mistake: 'Treating Namespaces as hard physical security isolation boundaries.',
        whyItHappens: 'Assuming different namespaces cannot talk to each other over the network by default.',
        fix: 'Apply NetworkPolicies! By default in Kubernetes, all Pods across all Namespaces can communicate freely.',
      },
    ],
    quizQuestion: {
      question: 'Which of the following resources is strictly NAMESPACED (cannot be shared cluster-wide)?',
      options: [
        { label: 'A', text: 'Node', isCorrect: false, explanation: 'Nodes are cluster-wide infrastructure resources.' },
        { label: 'B', text: 'PersistentVolume (PV)', isCorrect: false, explanation: 'PVs are cluster-scoped storage objects, while PVCs are namespaced.' },
        { label: 'C', text: 'ConfigMap', isCorrect: true, explanation: 'Correct! ConfigMaps belong strictly to a namespace and cannot be mounted directly across namespace boundaries.' },
        { label: 'D', text: 'ClusterRole', isCorrect: false, explanation: 'ClusterRoles are cluster-scoped RBAC templates.' },
      ],
    },
    yamlExplanation: [
      { field: 'metadata.namespace: staging', explanation: 'Scopes this resource into the "staging" isolation boundary.' },
      { field: 'spec.selector.matchLabels', explanation: 'Label query that binds a Service or Deployment to matching Pods.' },
      { field: 'metadata.labels', explanation: 'Key-value pairs attached to objects for filtering, querying, and grouping.' },
    ],
    referenceCheatSheet: [
      'kubectl get namespaces : List all logical isolation boundaries in the cluster',
      'kubectl get pods -n <namespace> : List pods in a specific namespace',
      'kubectl config set-context --current --namespace=<ns> : Set default active namespace',
    ],
    solutionExplanation: 'Listing namespaces reveals default system namespaces: default, kube-system, kube-public, and kube-node-lease.',
  },

  'c-k8s-alternatives': {
    commonPitfalls: [
      {
        mistake: 'Assuming Kubernetes is the only viable orchestrator for every project.',
        whyItHappens: 'Industry hype obscures simpler tools like Docker Swarm or HashiCorp Nomad.',
        fix: 'Consider Nomad for heterogeneous workloads (executables + containers) and Swarm for lightweight single-node to few-node stacks.',
      },
      {
        mistake: 'Underestimating the cognitive load and maintenance burden of Kubernetes.',
        whyItHappens: 'Teams adopt K8s without dedicated SRE skills and struggle with etcd, CNI, and cert rotations.',
        fix: 'Evaluate managed Kubernetes (EKS/GKE) or simpler orchestrators before building self-hosted clusters.',
      },
    ],
    quizQuestion: {
      question: 'What is a primary architectural difference between HashiCorp Nomad and Kubernetes?',
      options: [
        { label: 'A', text: 'Nomad runs as a single binary and can schedule non-containerized binaries (Java, raw exec), whereas K8s focuses strictly on containers.', isCorrect: true, explanation: 'Correct! Nomad is single-binary, highly modular, and natively orchestrates raw binaries, QEMU VMs, and containers.' },
        { label: 'B', text: 'Kubernetes cannot scale beyond 10 nodes.', isCorrect: false, explanation: 'Kubernetes officially scales to 5,000 nodes and 150,000 pods per cluster.' },
        { label: 'C', text: 'Docker Swarm requires a separate etcd cluster.', isCorrect: false, explanation: 'Docker Swarm embeds Raft directly into its manager nodes with zero external dependencies.' },
        { label: 'D', text: 'Nomad does not support high availability.', isCorrect: false, explanation: 'Nomad supports multi-region active-active clusters.' },
      ],
    },
    yamlExplanation: [
      { field: 'spec.containers[0].image: nomad:latest', explanation: 'Container image run within an orchestration comparison testbed.' },
      { field: 'metadata.annotations["orchestrator.comparison"]', explanation: 'Custom metadata used for documentation and automated tooling.' },
    ],
    referenceCheatSheet: [
      'docker swarm init : Initialize a lightweight Docker Swarm manager on a host',
      'nomad node status : Check status of HashiCorp Nomad cluster clients',
      'kubectl get nodes -o wide : Check Kubernetes node status and runtime',
    ],
    solutionExplanation: 'Comparing orchestrator architectures enables teams to pick the right trade-off between simplicity and ecosystem power.',
  },

  'c-containers-what-are': {
    commonPitfalls: [
      {
        mistake: 'Believing containers are lightweight Virtual Machines with their own kernels.',
        whyItHappens: 'Containers feel like VMs because of isolated file systems and network stacks.',
        fix: 'Remember: All containers on a host share the single underlying Linux host kernel.',
      },
      {
        mistake: 'Running processes inside containers as root (`UID 0`).',
        whyItHappens: 'Default Dockerfiles run as root unless `USER` is explicitly declared.',
        fix: 'Always specify `USER 10001` or use `securityContext.runAsNonRoot: true` in Kubernetes.',
      },
    ],
    quizQuestion: {
      question: 'Which two fundamental Linux kernel features form the bedrock of container isolation and resource constraints?',
      options: [
        { label: 'A', text: 'systemd and journald', isCorrect: false, explanation: 'These are init and logging systems, not process isolation mechanisms.' },
        { label: 'B', text: 'Namespaces (isolation) and cgroups (resource limits)', isCorrect: true, explanation: 'Correct! Linux Namespaces isolate what a process can SEE (PID, NET, MNT, IPC), while Control Groups limit what it can USE (CPU, RAM).' },
        { label: 'C', text: 'iptables and eBPF', isCorrect: false, explanation: 'These are networking and observability packet filters.' },
        { label: 'D', text: 'cron and chroot', isCorrect: false, explanation: 'chroot only isolates the filesystem root directory, not PID, network, or resources.' },
      ],
    },
    yamlExplanation: [
      { field: 'securityContext.readOnlyRootFilesystem: true', explanation: 'Mounts the root filesystem as read-only, preventing attackers from writing malware.' },
      { field: 'securityContext.runAsNonRoot: true', explanation: 'Forces the container runtime to verify that UID is not 0 (root).' },
    ],
    referenceCheatSheet: [
      'crictl ps : List running containers on a Kubernetes worker node via CRI',
      'crictl logs <container-id> : View logs of a container directly on a worker node',
      'lsns : Linux command to list active kernel namespaces on the host',
    ],
    solutionExplanation: 'Understanding that containers are just isolated Linux processes clarifies why they start in milliseconds and share host resources.',
  },

  'c-containers-vs-vms': {
    commonPitfalls: [
      {
        mistake: 'Assuming container isolation provides the same multi-tenant security boundary as hypervisor VMs.',
        whyItHappens: 'Because processes inside containers cannot see other processes, people assume total security.',
        fix: 'A kernel exploit can allow a container escape to compromise the host. For untrusted multi-tenant code, use Kata Containers or Firecracker microVMs.',
      },
      {
        mistake: 'Attempting to run kernel modules inside a container without host privileges.',
        whyItHappens: 'Containers share the host kernel; you cannot run a FreeBSD or Windows kernel inside a Linux container.',
        fix: 'Kernel modules must be loaded on the host node or via privileged DaemonSets with `CAP_SYS_ADMIN`.',
      },
    ],
    quizQuestion: {
      question: 'Why do containers boot in milliseconds while virtual machines take tens of seconds to start?',
      options: [
        { label: 'A', text: 'Containers skip booting a guest operating system kernel and virtualized hardware emulators.', isCorrect: true, explanation: 'Correct! Containers simply spawn a new process under existing host kernel namespaces, without BIOS/UEFI boot, hardware emulation, or guest kernel initialization.' },
        { label: 'B', text: 'Virtual machines use slower hard drives than containers.', isCorrect: false, explanation: 'Both run on the same underlying physical SSDs or NVMe storage.' },
        { label: 'C', text: 'Containers run in RAM only and never touch disk.', isCorrect: false, explanation: 'Containers use union filesystems (OverlayFS) backed by physical storage.' },
        { label: 'D', text: 'Kubernetes pre-compiles all container binaries before booting.', isCorrect: false, explanation: 'Kubernetes pulls pre-built OCI images from registries.' },
      ],
    },
    yamlExplanation: [
      { field: 'spec.containers[].resources.limits.memory: 256Mi', explanation: 'Enforced by Linux memory cgroups; if exceeded, the kernel triggers OOMKilled.' },
      { field: 'spec.containers[].resources.limits.cpu: 500m', explanation: 'Enforced by CFS (Completely Fair Scheduler) quotas; 500m equals 50% of one CPU core.' },
    ],
    referenceCheatSheet: [
      'systemd-cgls : Inspect the Linux cgroup hierarchy tree on a worker node',
      'cat /sys/fs/cgroup/memory/memory.stat : View detailed memory metrics for cgroups',
      'kubectl top nodes : View real-time aggregate CPU and RAM consumption across nodes',
    ],
    solutionExplanation: 'Comparing VMs and containers highlights how container lightweightness enables dense bin-packing and rapid autoscaling.',
  },

  'c-container-images': {
    commonPitfalls: [
      {
        mistake: 'Using the `:latest` tag in production manifests.',
        whyItHappens: 'It seems convenient to always get the newest build.',
        fix: 'NEVER use `:latest` in production. It breaks idempotency and rollbacks. Always use immutable semantic tags (`:v1.4.2`) or SHA256 image digests (`@sha256:...`).',
      },
      {
        mistake: 'Building bloated images with build tools (gcc, npm, maven) left in the final production image.',
        whyItHappens: 'Single-stage Dockerfiles include compilers and build dependencies.',
        fix: 'Use multi-stage Docker builds: compile in a build stage, and copy only the final binary into a minimal `distroless` or `alpine` base image.',
      },
    ],
    quizQuestion: {
      question: 'How do OCI container images achieve rapid downloads when updating an application from version 1 to version 2?',
      options: [
        { label: 'A', text: 'The container registry compresses the entire image using zip.', isCorrect: false, explanation: 'Compression is done per layer, but layer reuse is what saves bandwidth.' },
        { label: 'B', text: 'Image layer caching: only newly modified layers are downloaded; identical base layers are reused from local storage.', isCorrect: true, explanation: 'Correct! OCI images use content-addressable storage layers (OverlayFS); if the base OS layer has not changed, the node skips downloading it entirely.' },
        { label: 'C', text: 'Kubernetes streams images over peer-to-peer torrent networks by default.', isCorrect: false, explanation: 'Standard Kubernetes uses HTTPS pulls from OCI registries.' },
        { label: 'D', text: 'The node only downloads the source code and recompiles it locally.', isCorrect: false, explanation: 'Containers contain pre-compiled binary layers, not raw source code.' },
      ],
    },
    yamlExplanation: [
      { field: 'image: nginx:1.25.4-alpine@sha256:...', explanation: 'Pinning an immutable SHA256 digest guarantees that the exact byte-for-byte image verified in CI runs in production.' },
      { field: 'imagePullPolicy: IfNotPresent', explanation: 'Avoids redownloading the image if the layer cache already contains it locally on the worker node.' },
    ],
    referenceCheatSheet: [
      'docker image history <image> : Inspect layer composition, commands, and layer sizes',
      'crictl rmi <image-id> : Remove cached image from a Kubernetes worker node',
      'crane digest <image> : Fetch immutable cryptographic SHA256 digest from a registry without pulling',
    ],
    solutionExplanation: 'Immutable digests and multi-stage builds guarantee security, rapid cluster scheduling, and reproducible deployments.',
  },

  'c-container-registries': {
    commonPitfalls: [
      {
        mistake: 'Hardcoding image registry credentials in plain text in YAML manifests.',
        whyItHappens: 'Developers try to bypass `imagePullSecrets` configuration.',
        fix: 'Use `imagePullSecrets` backed by a `kubernetes.io/dockerconfigjson` Secret, or better, use IAM-based cloud service account roles (IRSA, Workload Identity).',
      },
      {
        mistake: 'Hitting public Docker Hub rate limits in production during auto-scaling events.',
        whyItHappens: 'Anonymous pulls from Docker Hub are rate-limited to 100 pulls per 6 hours.',
        fix: 'Mirror production images to a private registry (Amazon ECR, Google Artifact Registry, Harbor) or deploy an in-cluster pull-through registry cache.',
      },
    ],
    quizQuestion: {
      question: 'Which Kubernetes resource type is required to authenticate a Pod to pull images from a private container registry?',
      options: [
        { label: 'A', text: 'ConfigMap with username and password', isCorrect: false, explanation: 'ConfigMaps are for non-sensitive data and cannot be used in `imagePullSecrets`.' },
        { label: 'B', text: 'Secret of type `kubernetes.io/dockerconfigjson` referenced in `spec.imagePullSecrets`', isCorrect: true, explanation: 'Correct! This Secret format holds the encoded `.docker/config.json` containing registry authentication tokens.' },
        { label: 'C', text: 'NetworkPolicy allowing egress to port 443', isCorrect: false, explanation: 'While network access is needed, authentication credentials must be supplied via Secrets.' },
        { label: 'D', text: 'ClusterRoleBinding with pull permissions', isCorrect: false, explanation: 'RBAC controls Kubernetes API permissions, not external registry authentication.' },
      ],
    },
    yamlExplanation: [
      { field: 'imagePullSecrets: - name: regcred', explanation: 'Tells the node kubelet which Secret to decrypt to authenticate with the container registry.' },
      { field: 'type: kubernetes.io/dockerconfigjson', explanation: 'Designates the Secret as standard Docker registry credential format.' },
    ],
    referenceCheatSheet: [
      'kubectl create secret docker-registry regcred --docker-server=... : Generate registry pull secret',
      'kubectl get secrets -A : View all secrets across all namespaces',
      'crane copy <src> <dst> : Fast server-to-server image mirroring without local Docker daemon',
    ],
    solutionExplanation: 'Configuring private registries with automated IAM credential refresh prevents rate limits and unauthorized image access.',
  },

  'c-why-k8s-uses-containers': {
    commonPitfalls: [
      {
        mistake: 'Treating Kubernetes as a general-purpose virtualization platform for legacy monolithic applications.',
        whyItHappens: 'Migrating legacy apps without redesigning for container 12-factor principles.',
        fix: 'Ensure apps log to stdout/stderr, accept configuration via env vars/files, and gracefully handle SIGTERM signals within 30 seconds.',
      },
      {
        mistake: 'Ignoring SIGTERM signals in application code, causing forced kills (SIGKILL) after terminationGracePeriodSeconds.',
        whyItHappens: 'Developers do not catch SIGTERM to drain open HTTP connections and close database pools.',
        fix: 'Implement graceful shutdown handlers in code and tune `terminationGracePeriodSeconds` accordingly.',
      },
    ],
    quizQuestion: {
      question: 'What is the primary interface standard through which the Kubernetes kubelet talks to container runtimes (such as containerd or CRI-O)?',
      options: [
        { label: 'A', text: 'CRI (Container Runtime Interface)', isCorrect: true, explanation: 'Correct! The CRI is a gRPC interface that decouples Kubernetes from specific container runtimes.' },
        { label: 'B', text: 'CNI (Container Network Interface)', isCorrect: false, explanation: 'CNI standardizes network plumbing and IP allocation.' },
        { label: 'C', text: 'CSI (Container Storage Interface)', isCorrect: false, explanation: 'CSI standardizes block and file storage attachment.' },
        { label: 'D', text: 'POSIX system calls', isCorrect: false, explanation: 'POSIX is the OS API standard, not the Kubernetes runtime abstraction.' },
      ],
    },
    yamlExplanation: [
      { field: 'spec.terminationGracePeriodSeconds: 30', explanation: 'How long Kubernetes waits after sending SIGTERM before forcibly killing the process with SIGKILL.' },
      { field: 'spec.containers[].lifecycle.preStop', explanation: 'Hook executed immediately before SIGTERM is sent (ideal for sleeping 5s while iptables drains).' },
    ],
    referenceCheatSheet: [
      'crictl info : Inspect CRI status and runtime plugin configuration on a node',
      'kubectl explain pod.spec.terminationGracePeriodSeconds : Read official termination docs',
      'kubectl delete pod <name> --grace-period=0 --force : Forcefully terminate a stuck pod immediately',
    ],
    solutionExplanation: 'The CRI abstraction allows Kubernetes to run any OCI-compliant container runtime without changing core Kubernetes control plane code.',
  },

  'c-choosing-k8s-environment': {
    commonPitfalls: [
      {
        mistake: 'Choosing to build a self-managed, bare-metal Kubernetes cluster when the team has no 24/7 SRE staff.',
        whyItHappens: 'Underestimating the immense operational toil of etcd quorum management, OS patching, and network overlays.',
        fix: 'Use managed Kubernetes (EKS, GKE, AKS) unless strict regulatory, latency, or on-premise hardware constraints require bare-metal.',
      },
      {
        mistake: 'Using local developer clusters (minikube/kind) for production workloads.',
        whyItHappens: 'Attempting to save infrastructure costs on single-node development toolchains.',
        fix: 'Local tools lack high availability, multi-zone redundancy, and cloud load-balancer integrations.',
      },
    ],
    quizQuestion: {
      question: 'When is a self-managed (bare-metal) Kubernetes cluster strongly justified over a cloud-managed service like GKE or EKS?',
      options: [
        { label: 'A', text: 'When a startup needs to launch an MVP in two weeks with minimal devops staff.', isCorrect: false, explanation: 'A startup should use managed services or PaaS to move fast.' },
        { label: 'B', text: 'When strict data sovereignty laws or existing on-premise hardware infrastructure mandate that data never leave private data centers.', isCorrect: true, explanation: 'Correct! Government, banking, defense, and high-frequency trading often require physical on-premise control.' },
        { label: 'C', text: 'When the team wants to avoid writing YAML manifests.', isCorrect: false, explanation: 'Both self-managed and cloud-managed K8s use identical YAML manifests.' },
        { label: 'D', text: 'When the team wants free automated upgrades with zero downtime.', isCorrect: false, explanation: 'Cloud providers offer automated upgrades; self-managed requires manual kubeadm upgrades.' },
      ],
    },
    yamlExplanation: [
      { field: 'metadata.labels["topology.kubernetes.io/zone"]', explanation: 'Standard node label identifying physical availability zones for resilient placement.' },
      { field: 'spec.nodeSelector', explanation: 'Constrains pods to run only on nodes matching specific infrastructure labels.' },
    ],
    referenceCheatSheet: [
      'kubectl get nodes -L topology.kubernetes.io/zone : View multi-zone topology distribution',
      'minikube start : Spin up a local single-node development cluster in seconds',
      'kind create cluster --config kind.yaml : Create a multi-node local cluster inside Docker',
    ],
    solutionExplanation: 'Matching the Kubernetes environment to organizational scale and compliance requirements ensures long-term operational success.',
  },

  'c-managed-k8s-providers': {
    commonPitfalls: [
      {
        mistake: 'Assuming managed Kubernetes means zero operational responsibility.',
        whyItHappens: 'Confusing "Managed Control Plane" with "Fully Managed Serverless App".',
        fix: 'In the shared responsibility model, the cloud provider manages the control plane (etcd, apiserver), but YOU manage worker nodes, upgrades, and pod security.',
      },
      {
        mistake: 'Neglecting to configure cluster autoscaler or node pool min/max sizes.',
        whyItHappens: 'Assuming the cluster will automatically add nodes without cloud permissions.',
        fix: 'Deploy Cluster Autoscaler or Karpenter and configure cloud IAM roles for auto-scaling node groups.',
      },
    ],
    quizQuestion: {
      question: 'In the Cloud Shared Responsibility Model for managed Kubernetes (e.g. AWS EKS, GCP GKE, Azure AKS), what does the cloud provider manage?',
      options: [
        { label: 'A', text: 'Application database schema and application code bugs.', isCorrect: false, explanation: 'Application code is always the customer responsibility.' },
        { label: 'B', text: 'The Control Plane: kube-apiserver, etcd quorum, controller-manager, scheduler, and their high-availability SLA.', isCorrect: true, explanation: 'Correct! The cloud provider guarantees control plane uptime, backups, and patching across availability zones.' },
        { label: 'C', text: 'Writing all Kubernetes YAML deployment manifests.', isCorrect: false, explanation: 'Engineers author their own declarative manifests.' },
        { label: 'D', text: 'Customer data privacy and RBAC role assignments.', isCorrect: false, explanation: 'RBAC policies and user credentials are managed by the cluster administrator.' },
      ],
    },
    yamlExplanation: [
      { field: 'metadata.annotations["eks.amazonaws.com/role-arn"]', explanation: 'Attaches AWS IAM roles directly to Kubernetes ServiceAccounts (IRSA) on EKS.' },
      { field: 'iam.gke.io/gcp-service-account', explanation: 'GKE Workload Identity binding Kubernetes pods to Google Cloud IAM.' },
    ],
    referenceCheatSheet: [
      'aws eks update-kubeconfig --name <cluster> : Configure local kubectl for AWS EKS',
      'gcloud container clusters get-credentials <cluster> : Configure local kubectl for Google GKE',
      'az aks get-credentials --resource-group <rg> --name <cluster> : Configure local kubectl for Azure AKS',
    ],
    solutionExplanation: 'Managed Kubernetes offloads etcd disaster recovery, master node replication, and control plane patching to cloud hyperscalers.',
  },

  'c-installing-local-cluster': {
    commonPitfalls: [
      {
        mistake: 'Allocating too little RAM and CPU to the Docker desktop daemon for local clusters.',
        whyItHappens: 'Minikube or Kind clusters hang when default Docker settings only allow 2GB RAM.',
        fix: 'Ensure Docker Desktop has at least 4 CPU cores and 8GB RAM allocated for running multi-pod stacks.',
      },
      {
        mistake: 'Using `NodePort` or `LoadBalancer` locally without port forwarding or tunneling.',
        whyItHappens: 'Services of type LoadBalancer stay `<pending>` locally because there is no cloud provider.',
        fix: 'Run `minikube tunnel` or use `kubectl port-forward` or MetalLB for local load balancer resolution.',
      },
    ],
    quizQuestion: {
      question: 'How does Kind (Kubernetes in Docker) create a multi-node Kubernetes cluster on a single developer machine?',
      options: [
        { label: 'A', text: 'It launches multiple VirtualBox virtual machines taking 20GB of RAM.', isCorrect: false, explanation: 'Kind does not use heavyweight hypervisors like VirtualBox.' },
        { label: 'B', text: 'It runs each Kubernetes cluster node as a separate Docker container on the host.', isCorrect: true, explanation: 'Correct! Kind runs control plane and worker nodes as nested Docker containers running systemd and containerd.' },
        { label: 'C', text: 'It simulates the Kubernetes API in JavaScript without real containers.', isCorrect: false, explanation: 'Kind runs genuine upstream Kubernetes binaries.' },
        { label: 'D', text: 'It connects to an existing remote cloud cluster via VPN.', isCorrect: false, explanation: 'Kind is completely local and offline-capable.' },
      ],
    },
    yamlExplanation: [
      { field: 'kind: Cluster\napiVersion: kind.x-k8s.io/v1alpha4', explanation: 'Kind configuration file format used to define multi-node local topologies.' },
      { field: 'nodes:\n- role: control-plane\n- role: worker', explanation: 'Spawns one container acting as the control plane and another as a worker node.' },
    ],
    referenceCheatSheet: [
      'kind create cluster --name dev : Spin up a local multi-node Kind cluster',
      'kind delete cluster --name dev : Completely wipe and clean up local cluster resources',
      'kubectl config get-contexts : View all configured local and remote cluster environments',
    ],
    solutionExplanation: 'Local clusters allow rapid feedback, testing destructive scenarios, and mastering CKA commands without incurring cloud bills.',
  },

  'c-your-first-cluster': {
    commonPitfalls: [
      {
        mistake: 'Exposing the kube-apiserver port (6443) directly to the public internet without IP whitelisting.',
        whyItHappens: 'Misconfigured security groups allow unauthorized port scans against the cluster API.',
        fix: 'Keep API server private inside a VPC or restrict access strictly to corporate VPN CIDRs.',
      },
      {
        mistake: 'Deleting the `.kube/config` file and losing all cluster credentials.',
        whyItHappens: 'Clearing home directory files without backing up authentication certs.',
        fix: 'Keep backup copies of kubeconfig files and use environment variables (`KUBECONFIG`) to switch contexts.',
      },
    ],
    quizQuestion: {
      question: 'When you run `kubectl get pods`, which component receives the HTTP request and handles authentication and RBAC authorization?',
      options: [
        { label: 'A', text: 'kube-apiserver', isCorrect: true, explanation: 'Correct! All kubectl traffic routes to kube-apiserver, which verifies the client certificate or token and checks RBAC permissions.' },
        { label: 'B', text: 'kubelet', isCorrect: false, explanation: 'The kubelet runs on the worker node and takes instructions from the API server, not directly from kubectl.' },
        { label: 'C', text: 'etcd', isCorrect: false, explanation: 'etcd is a private key-value database that only allows connections from the kube-apiserver.' },
        { label: 'D', text: 'CoreDNS', isCorrect: false, explanation: 'CoreDNS resolves cluster domain names for pods, not kubectl API requests.' },
      ],
    },
    yamlExplanation: [
      { field: 'server: https://127.0.0.1:6443', explanation: 'The secure HTTPS endpoint of the kube-apiserver in your local kubeconfig file.' },
      { field: 'client-certificate-data', explanation: 'Base64-encoded X.509 client certificate used by kubectl to authenticate user identity.' },
    ],
    referenceCheatSheet: [
      'kubectl cluster-info : Print the URLs of the control plane and cluster services',
      'kubectl get nodes : Verify that all control plane and worker nodes are in Ready state',
      'kubectl auth can-i create deployments : Test your active RBAC permissions against the API',
    ],
    solutionExplanation: 'Verifying cluster readiness and inspecting the kubeconfig authentication pipeline cements the relationship between client and cluster.',
  },
};
