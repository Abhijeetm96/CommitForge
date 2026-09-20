import type { KubeChapter } from './types';

export const PHASE_2_CHAPTERS: KubeChapter[] = [
  {
    id: 'ch03-pods',
    number: 3,
    title: 'Pods — The Atomic Unit of Kubernetes',
    category: 'Core Workloads',
    concepts: [
      {
        id: 'c-pod-anatomy-lifecycle',
        number: '3.1',
        title: 'Anatomy of a Pod & Phase Lifecycle',
        commandPill: 'kubectl get pod <name> -o yaml',
        badge: 'Core Workload',
        difficulty: 'Beginner',
        description: 'The fundamental scheduling unit of Kubernetes. Explore Pod phases: Pending, ContainerCreating, Running, Succeeded, and Failed.',
        explanation: 'A Pod represents a single instance of a running process in your cluster. Containers in a Pod share the same network namespace (localhost routing) and can share storage volumes. The Pod lifecycle transitions through five distinct phases: Pending (accepted but unscheduled or downloading images), Running (at least one container running or starting), Succeeded (all containers exited with return code 0, such as batch jobs), Failed (all containers terminated and at least one exited with non-zero code), and Unknown (kubelet lost node contact).',
        yamlSnippet: `apiVersion: v1
kind: Pod
metadata:
  name: web-frontend
  namespace: default
  labels:
    app: web-frontend
    tier: presentation
spec:
  restartPolicy: Always
  terminationGracePeriodSeconds: 30
  containers:
  - name: nginx
    image: nginx:1.25-alpine
    ports:
    - containerPort: 80
      name: http
    resources:
      requests:
        cpu: "100m"
        memory: "128Mi"
      limits:
        cpu: "250m"
        memory: "256Mi"`,
        kubectlCommands: ['kubectl get pods', 'kubectl describe pod web-frontend', 'kubectl get pods -o wide'],
        visualizerFocus: 'Pod boundary encapsulating containers, shared network loopback, and volumes',
        practiceChallenge: {
          instructions: 'Inspect all running pods in the cluster and verify their status phases.',
          goalCommand: 'kubectl get pods',
          hints: ['Run kubectl get pods', 'Review the READY, STATUS, and RESTARTS columns'],
        },
        whatIsIt: "A Pod is the smallest deployable computing unit in Kubernetes, encapsulating one or more tightly coupled containers sharing storage volumes, Linux network namespace (localhost IP), and inter-process IPC communication channels.",
        inSimpleWords: "Think of a Pod like a pea pod containing a few closely related peas (containers). The peas live in the exact same shell, share the same water and nutrients (network loopback and volumes), and are always planted and harvested together on the same branch (worker node).",
        realWorldAnalogy: {
                  "metaphor": "Shared Office Suite with Roommates",
                  "explanation": "Coworkers in a single shared office suite share the physical street address and door buzzer (Pod IP), talk to each other across desks with zero latency (localhost), and share the office filing cabinet (volumes), while each working on their own computer screen (container)."
        },
        whenToUse: [
                  "Packaging primary application containers alongside auxiliary helper processes that must share localhost or disk.",
                  "Deploying atomic units of computation that must always be co-located and co-scheduled onto the same physical machine.",
                  "Configuring strict pod-level security contexts, host networking, or kernel sysctl boundaries."
        ],
        whenNotToUse: [
                  "Deploying standalone bare Pods directly in production without a managing controller (Deployments, StatefulSets).",
                  "Grouping unrelated microservices into the same Pod simply because they communicate with each other.",
                  "Attempting to scale individual containers within a Pod independently (Kubernetes scales the entire Pod as an atomic unit)."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "Pending Phase",
                            "description": "Pod manifest is accepted by apiserver; waiting for kube-scheduler to select a node and kubelet to download container images."
                  },
                  {
                            "step": 2,
                            "title": "ContainerCreating & Init Execution",
                            "description": "Kubelet creates the pause container network sandbox, runs init containers sequentially to completion, and mounts volumes."
                  },
                  {
                            "step": 3,
                            "title": "Running Phase",
                            "description": "Application containers are started; startup and readiness probes begin executing. Once readiness passes, pod receives traffic."
                  },
                  {
                            "step": 4,
                            "title": "Terminating & Graceful Shutdown",
                            "description": "Pod receives SIGTERM signal; preStop lifecycle hooks execute, endpoints are deregistered, and SIGKILL is sent after terminationGracePeriodSeconds."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "The Pause Container (infra container)",
                            "detail": "A tiny C binary (pause) that holds the Linux network and IPC namespaces open even if application containers crash and restart."
                  },
                  {
                            "title": "Shared Localhost Routing",
                            "detail": "Containers in the same pod communicate via 127.0.0.1 on distinct ports without routing through the cluster overlay network."
                  },
                  {
                            "title": "Pod Phases vs Container States",
                            "detail": "Pod phases (Pending, Running, Succeeded, Failed, Unknown) summarize the aggregate of underlying container states (Waiting, Running, Terminated)."
                  }
        ],
        productionTips: [
                  "Always specify terminationGracePeriodSeconds (default 30s) based on your application database drain and HTTP request draining requirements.",
                  "Configure preStop hooks (e.g. sleep 5) to allow in-flight network packets to drain before the container receives SIGTERM.",
                  "Use restartPolicy: OnFailure for batch processing jobs and restartPolicy: Always for persistent web services."
        ],
      },
      {
        id: 'c-multi-container-patterns',
        number: '3.2',
        title: 'Multi-Container Pod Patterns & Init Containers',
        commandPill: 'kubectl logs <pod> -c <container>',
        badge: 'Design Patterns',
        difficulty: 'Intermediate',
        description: 'Master sidecar, adapter, ambassador patterns, and sequential init containers that run to completion before app boot.',
        explanation: 'Kubernetes enables sophisticated multi-container coordination patterns. `Init Containers` run sequentially to completion before application containers start (ideal for DB schema migrations, waiting for dependencies, or security vault token fetching). `Sidecar Containers` run alongside the main container to augment functionality (e.g. Envoy proxy for service mesh, Fluentbit log forwarders). `Adapter Containers` standardize heterogeneous output (e.g. converting custom metrics to Prometheus format). `Ambassador Containers` proxy communication to external databases.',
        yamlSnippet: `apiVersion: v1
kind: Pod
metadata:
  name: logging-sidecar-demo
spec:
  initContainers:
  - name: init-db-check
    image: busybox:1.36
    command: ['sh', '-c', 'echo "Database readiness checked" && exit 0']
  containers:
  - name: primary-app
    image: busybox:1.36
    command: ['sh', '-c', 'while true; do echo "$(date) - [INFO] transaction processed" >> /var/log/app.log; sleep 5; done']
    volumeMounts:
    - name: shared-logs
      mountPath: /var/log
  - name: log-shipper-sidecar
    image: busybox:1.36
    command: ['sh', '-c', 'tail -F /var/log/app.log']
    volumeMounts:
    - name: shared-logs
      mountPath: /var/log
  volumes:
  - name: shared-logs
    emptyDir: {}`,
        kubectlCommands: ['kubectl logs web-frontend -c nginx', 'kubectl describe pod web-frontend'],
        visualizerFocus: 'Shared emptyDir volume bridging main application container and sidecar container',
        practiceChallenge: {
          instructions: 'Fetch the logs specifically from the primary container inside the pod using the -c container flag.',
          goalCommand: 'kubectl logs frontend-web-7bc9f-1 -c nginx',
          hints: ['Specify the container with -c nginx', 'Inspect the application output stream'],
        },
        whatIsIt: "Multi-Container Pod Patterns are canonical distributed systems design architectures where auxiliary containers (Init, Sidecar, Ambassador, Adapter) augment or transform the behavior of a primary container while sharing local filesystem and network resources.",
        inSimpleWords: "Think of an airplane pilot (primary container) flying with a co-pilot logging flight instruments (sidecar) and a ground mechanic running pre-flight checklists before takeoff (init container). The pilot focuses purely on flying, while specialized crew members handle logistics.",
        realWorldAnalogy: {
                  "metaphor": "Concert Lead Vocalist and Stage Crew",
                  "explanation": "The lead singer (main app) focuses exclusively on singing. The sound engineer (adapter) balances microphone levels, the roadie (init container) tunes the guitar before the show, and the security guard (ambassador) manages backstage access."
        },
        whenToUse: [
                  "Sidecar pattern: Streaming logs, forwarding traces, or proxying mTLS mesh traffic (Envoy, Fluentbit) without changing app code.",
                  "Init container pattern: Running DB database migrations or waiting for backend network dependencies before starting main service.",
                  "Adapter pattern: Normalizing heterogeneous proprietary metrics into standardized Prometheus exposition formats."
        ],
        whenNotToUse: [
                  "Coupling distinct microservices that have different scaling requirements, different release schedules, or separate team ownership.",
                  "Creating multi-container pods where one container consumes 95% of node CPU and starves adjacent sidecars of CPU cycles.",
                  "Writing long-running background tasks inside init containers (blocks main application boot indefinitely)."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "Sequential Init Container Execution",
                            "description": "Init containers run one by one in exact order; each must exit with code 0 before the next starts."
                  },
                  {
                            "step": 2,
                            "title": "Shared Volume Data Staging",
                            "description": "Init containers write configuration files, TLS certificates, or unpacked assets into a shared emptyDir volume."
                  },
                  {
                            "step": 3,
                            "title": "Concurrent Application & Sidecar Launch",
                            "description": "Once all init containers succeed, Kubernetes starts all main application and sidecar containers concurrently."
                  },
                  {
                            "step": 4,
                            "title": "Native K8s 1.28+ Sidecar Lifecycle",
                            "description": "Native sidecar containers (initContainers with restartPolicy: Always) start before app containers and terminate after them."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "Native Sidecar Containers (K8s 1.28+)",
                            "detail": "Init containers with restartPolicy: Always start before app containers, stay running throughout pod life, and shut down last."
                  },
                  {
                            "title": "Shared emptyDir Volumes",
                            "detail": "In-memory or disk-backed temporary storage accessible across all containers in the pod boundary."
                  },
                  {
                            "title": "Ambassador Proxies",
                            "detail": "Local proxies that hide remote cluster network complexity (e.g. proxying localhost:6379 to a sharded remote Redis cluster)."
                  }
        ],
        productionTips: [
                  "Always set distinct resource requests and limits on sidecar containers to prevent them from causing Out-Of-Memory (OOM) pod evictions.",
                  "Adopt native Kubernetes sidecars (restartPolicy: Always in initContainers) to fix the historic race condition where pods terminated before sidecars could flush logs.",
                  "Keep init container images tiny (busybox, alpine) to minimize pod cold-start pull delays."
        ],
      },
      {
        id: 'c-ephemeral-containers-debug',
        number: '3.3',
        title: 'Ephemeral Containers & Live Pod Debugging',
        commandPill: 'kubectl debug -it <pod> --image=busybox',
        badge: 'Troubleshooting',
        difficulty: 'Advanced',
        description: 'Troubleshoot production distroless/scratch containers in-place using ephemeral containers without restarting the pod.',
        explanation: 'Modern cloud-native best practices advocate for distroless or scratch container images lacking shells (`sh`/`bash`), `curl`, or debugging utilities. When production issues arise, `kubectl debug` injects an `Ephemeral Container` into the running Pod. The ephemeral container shares the target pod\'s network and process namespaces (`shareProcessNamespace: true`), enabling SREs to run `netstat`, `tcpdump`, `strace`, or inspect files in a live crashing workload without modifying the pod specification or triggering a restart.',
        yamlSnippet: `# Ephemeral Container Spec (added dynamically via API)
# Generated via: kubectl debug -it target-pod --image=nicolaka/netshoot
apiVersion: v1
kind: EphemeralContainer
name: debugger
image: nicolaka/netshoot:latest
stdin: true
tty: true
securityContext:
  capabilities:
    add: ["NET_ADMIN", "SYS_PTRACE"]`,
        kubectlCommands: ['kubectl debug web-frontend -it --image=busybox', 'kubectl describe pod web-frontend'],
        visualizerFocus: 'Ephemeral debugging container attached to the live process namespace of a target pod',
        practiceChallenge: {
          instructions: 'Check the details of web-frontend to verify its container namespace status.',
          goalCommand: 'kubectl describe pod web-frontend',
          hints: ['Run kubectl describe pod web-frontend', 'Look for container statuses and ephemeral containers'],
        },
        whatIsIt: "Ephemeral Containers are temporary, non-restarting containers injected dynamically into an existing, running Pod without restarting the pod or modifying its immutable PodSpec, designed specifically for troubleshooting distroless production environments.",
        inSimpleWords: "Imagine a sealed astronaut space capsule floating in orbit. You cannot bring the capsule back to Earth just to check a wire. Instead, an emergency maintenance drone (ephemeral container) docks alongside the capsule, plugs into its sensor diagnostics port, scans the systems, and detaches when done.",
        realWorldAnalogy: {
                  "metaphor": "Emergency Diagnostic Scanner Plugged into an Engine Port",
                  "explanation": "A racecar mechanic does not disassemble the running racecar on the track. They plug an OBD-II scanner into the car diagnostic port to read live sensor telemetries while the engine is running."
        },
        whenToUse: [
                  "Investigating production pods built with minimal distroless or scratch images that lack shells (bash/sh), curl, or diagnostic tools.",
                  "Debugging intermittent network routing failures, DNS resolution issues, or kernel socket exhaustion in live workloads.",
                  "Capturing live memory dumps, strace syscall traces, or running tcpdump on a pod without dropping live user traffic."
        ],
        whenNotToUse: [
                  "Attempting to run permanent production services as ephemeral containers (they cannot specify ports, resources, or restart policies).",
                  "Using ephemeral containers as a deployment mechanism rather than a temporary interactive diagnostic session.",
                  "Clusters where cluster security policies (Kyverno, Gatekeeper) forbid ephemeral container injection into production namespaces."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "Diagnostic Injection Request",
                            "description": "Operator executes kubectl debug -it <pod> --image=nicolaka/netshoot to request an ephemeral container injection."
                  },
                  {
                            "step": 2,
                            "title": "Pod EphemeralContainers Subresource Update",
                            "description": "Kube-apiserver updates the /ephemeralcontainers subresource on the running Pod object in etcd."
                  },
                  {
                            "step": 3,
                            "title": "Namespace & Process Attachment",
                            "description": "Kubelet notices the update, pulls the debugger image, and launches it attached to the target pod network and process namespaces."
                  },
                  {
                            "step": 4,
                            "title": "Interactive Triage & Termination",
                            "description": "Operator triages the pod; upon exit, the ephemeral container status transitions to Terminated and can never be restarted."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "Subresource API Isolation",
                            "detail": "Added via the ephemeralcontainers subresource because the main Pod.spec field is otherwise immutable after creation."
                  },
                  {
                            "title": "shareProcessNamespace: true",
                            "detail": "Allows the ephemeral container to see all processes running in adjacent containers via /proc and send debug signals."
                  },
                  {
                            "title": "Netshoot Diagnostic Image",
                            "detail": "A popular container image packed with tcpdump, netstat, iperf, dig, curl, nmap, and traceroute for network forensics."
                  }
        ],
        productionTips: [
                  "Use kubectl debug <pod> --copy-to=debug-copy --share-processes to create a cloned sandbox pod if you suspect your debugging tools could crash the production process.",
                  "Ensure your cluster RBAC tightly restricts the pods/ephemeralcontainers permission, as debugging containers can inspect memory and environment secrets.",
                  "Add securityContext capabilities (NET_ADMIN, SYS_PTRACE) to ephemeral containers when deep packet capturing is required."
        ],
      },
      {
        id: 'c-pdb-graceful-shutdown',
        number: '3.4',
        title: 'Pod Disruption Budgets & Graceful Shutdown',
        commandPill: 'kubectl get pdb',
        badge: 'High Availability',
        difficulty: 'Advanced',
        description: 'Prevent outages during voluntary disruptions (cluster upgrades, node draining) with PodDisruptionBudgets (PDB).',
        explanation: 'Disruptions are split into involuntary (hardware failures, kernel panics, node evictions) and voluntary (node draining for OS patches, cluster upgrades, autoscaling scale-down). A `PodDisruptionBudget` (PDB) guarantees that a minimum percentage (`minAvailable: 80%`) or maximum deficit (`maxUnavailable: 1`) of healthy replicas remains operational during voluntary disruptions. When `kubectl drain` is called, the eviction API respects PDBs, refusing to evict pods until replacement replicas are running.',
        yamlSnippet: `apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: api-pdb
  namespace: default
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: frontend-web`,
        kubectlCommands: ['kubectl get pdb', 'kubectl describe pdb api-pdb'],
        visualizerFocus: 'PDB enforcing minimum available replicas during voluntary node eviction',
        practiceChallenge: {
          instructions: 'Query the cluster for any active PodDisruptionBudgets.',
          goalCommand: 'kubectl get pdb',
          hints: ['Run kubectl get pdb or kubectl get poddisruptionbudgets', 'Examine MIN AVAILABLE and CURRENT HEALTHY'],
        },
        whatIsIt: "A PodDisruptionBudget (PDB) is a Kubernetes policy that limits the number of pods of a replicated application that can be down simultaneously during voluntary disruptions such as node draining, OS kernel upgrades, and cluster autoscaling.",
        inSimpleWords: "Think of a PDB like a hospital shift rule: \"No matter who is taking a vacation or attending training (voluntary disruption), there must always be at least 3 emergency room doctors on duty at all times.\" If a doctor tries to leave and only 2 would remain, their vacation request is denied until a replacement arrives.",
        realWorldAnalogy: {
                  "metaphor": "Minimum Staffing Quotas in Air Traffic Control",
                  "explanation": "Air traffic controllers are legally forbidden from clocking out for lunch unless an adequate number of certified relief controllers are actively monitoring radar screens, ensuring 0% gap in airspace safety."
        },
        whenToUse: [
                  "Protecting mission-critical stateless web services and APIs during automated node pool upgrades and AMI rollouts.",
                  "Preventing quorum loss in stateful distributed databases (etcd, Cassandra, ZooKeeper) where losing 2 out of 3 nodes causes catastrophic failure.",
                  "Safeguarding high-volume payment processing queues from abrupt capacity drop-offs during cluster scale-down."
        ],
        whenNotToUse: [
                  "Single-replica workloads (a PDB with minAvailable: 1 on a 1-replica deployment blocks node draining permanently).",
                  "Expecting PDB to protect against involuntary disruptions like physical hardware failure, AWS spot instance termination, or kernel panics.",
                  "Setting minAvailable: 100% on small clusters, which creates deadlocks during node maintenance."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "Maintenance Drain Trigger",
                            "description": "Operator or cluster autoscaler executes kubectl drain <node> --ignore-daemonsets."
                  },
                  {
                            "step": 2,
                            "title": "Eviction API Verification",
                            "description": "Drain tool invokes the Eviction subresource API (POST /api/v1/namespaces/default/pods/my-pod/eviction)."
                  },
                  {
                            "step": 3,
                            "title": "PDB Policy Evaluation",
                            "description": "API server evaluates active PDBs; if evicting the pod violates minAvailable or maxUnavailable, the request is rejected with 429 Too Many Requests."
                  },
                  {
                            "step": 4,
                            "title": "Reconciliation & Eventual Eviction",
                            "description": "Drain retries periodically. Once a replacement pod is launched and passes its readiness probe, the original pod eviction is granted."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "Eviction API vs Delete API",
                            "detail": "kubectl delete bypasses PDBs; kubectl drain uses the Eviction subresource which strictly honors PDB constraints."
                  },
                  {
                            "title": "minAvailable vs maxUnavailable",
                            "detail": "minAvailable specifies minimum healthy pods (integer or %); maxUnavailable specifies maximum deficit tolerated."
                  },
                  {
                            "title": "DisruptionsAllowed Counter",
                            "detail": "The PDB controller continuously calculates status.disruptionsAllowed based on current healthy ready replicas."
                  }
        ],
        productionTips: [
                  "Never set minAvailable: 1 on a single-replica pod, or kubectl drain will hang indefinitely with \"Cannot evict pod as it would violate that pod's disruption budget\".",
                  "Use maxUnavailable: 1 for 3-replica stateful clusters to allow rolling node OS upgrades one node at a time without breaking quorum.",
                  "Ensure readiness probes are configured accurately; PDBs only consider pods in the Ready condition as available."
        ],
      },
    ],
  },
  {
    id: 'ch04-stateless-workloads',
    number: 4,
    title: 'Workloads & Stateless Controllers',
    category: 'Core Workloads',
    concepts: [
      {
        id: 'c-replicasets-selectors',
        number: '4.1',
        title: 'ReplicaSets & Label Selectors',
        commandPill: 'kubectl get rs',
        badge: 'Controllers',
        difficulty: 'Beginner',
        description: 'How Kubernetes maintains a stable set of replica Pods running at any given time using equality-based and set-based label selectors.',
        explanation: 'A `ReplicaSet` is the engine of high availability in Kubernetes. Its sole purpose is to ensure that a specified number of identical Pod replicas are running at all times. ReplicaSets find their Pods via `selector.matchLabels` and `selector.matchExpressions`. If there are too few pods (due to node failure or pod crashes), it creates more. If there are too many (e.g. manual creation), it deletes the excess. In practice, Deployments manage ReplicaSets rather than creating ReplicaSets directly.',
        yamlSnippet: `apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: frontend-rs
  labels:
    app: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: web
        image: nginx:1.25`,
        kubectlCommands: ['kubectl get rs', 'kubectl describe rs frontend-rs'],
        visualizerFocus: 'ReplicaSet controller maintaining 3 identical pods matching label selector',
        practiceChallenge: {
          instructions: 'List all active ReplicaSets across the default namespace.',
          goalCommand: 'kubectl get rs',
          hints: ['Run kubectl get rs or kubectl get replicasets', 'Observe DESIRED, CURRENT, and READY columns'],
        },
        whatIsIt: "A ReplicaSet is a primary Kubernetes controller whose sole responsibility is to maintain a stable, specified population of identical Pod replicas running at all times, matching pods using declarative equality-based and set-based label selectors.",
        inSimpleWords: "Think of a ReplicaSet like an automated factory floor manager whose only rule is: \"There must always be exactly 5 conveyor belt workers on the floor.\" If a worker faints (pod crash), the manager hires another immediately. If a 6th worker wanders onto the floor, the manager sends the extra person home.",
        realWorldAnalogy: {
                  "metaphor": "Cruise Ship Lifeboat Readiness Inspector",
                  "explanation": "The maritime inspector enforces that exactly 10 fully stocked lifeboats are suspended from the deck at all times. If one is damaged in a storm, a replacement is hoisted into position immediately."
        },
        whenToUse: [
                  "Understanding low-level pod replication mechanics, label indexing, and ownerReferences in Kubernetes architecture.",
                  "Debugging Deployment rollouts by inspecting the active vs retired ReplicaSets.",
                  "Building custom workload orchestrators that require stable pod counting without complex rolling update logic."
        ],
        whenNotToUse: [
                  "Creating ReplicaSets directly in production manifests (always use Deployments, which manage ReplicaSets automatically).",
                  "Managing stateful databases where each pod requires a unique persistent identity and distinct persistent disk (use StatefulSets).",
                  "Attempting rolling image updates with raw ReplicaSets (ReplicaSets do not support rolling update strategies)."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "Label Selector Query",
                            "description": "The ReplicaSet controller queries its in-memory informer cache for Pods matching spec.selector.matchLabels."
                  },
                  {
                            "step": 2,
                            "title": "Replica Deficit Calculation",
                            "description": "The controller compares the number of active matching Pods against spec.replicas to determine surplus or deficit."
                  },
                  {
                            "step": 3,
                            "title": "Adoption & Creation",
                            "description": "If orphan pods with matching labels exist, the ReplicaSet adopts them by setting ownerReferences; otherwise, it creates new Pods."
                  },
                  {
                            "step": 4,
                            "title": "Surplus Eviction",
                            "description": "If actual pods exceed desired replicas, the controller deletes excess pods, prioritizing unready or pending pods first."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "ownerReferences & Garbage Collection",
                            "detail": "Child Pods reference their parent ReplicaSet UID; deleting the ReplicaSet automatically cascades and reaps the child pods."
                  },
                  {
                            "title": "Set-Based Label Selectors",
                            "detail": "Supports matchExpressions (In, NotIn, Exists, DoesNotExist) in addition to simple equality matchLabels."
                  },
                  {
                            "title": "Template Hash Label",
                            "detail": "Deployments inject a pod-template-hash label into ReplicaSets to ensure pods are uniquely partitioned across rollout revisions."
                  }
        ],
        productionTips: [
                  "Never change the label selector of an existing ReplicaSet; doing so creates orphaned pods that no controller manages.",
                  "Inspect ReplicaSets with kubectl get rs to see the DESIRED, CURRENT, and READY states during deployment troubleshooting.",
                  "Deployments automatically retain a revision history of ReplicaSets (default 10) to enable instant rollback capabilities."
        ],
      },
      {
        id: 'c-deployments-rolling-updates',
        number: '4.2',
        title: 'Deployments & Zero-Downtime Rolling Updates',
        commandPill: 'kubectl rollout status deployment/<name>',
        badge: 'Zero-Downtime',
        difficulty: 'Beginner',
        description: 'Declarative updates for Pods and ReplicaSets. Master rolling updates, maxSurge, maxUnavailable, rollbacks, and revisions.',
        explanation: 'A `Deployment` provides declarative updates for Pods and ReplicaSets. When you update a Deployment\'s pod template (e.g. bumping container image tag from v1 to v2), the Deployment controller creates a new ReplicaSet and orchestrates a gradual migration. The speed and safety of the rollout are governed by `strategy.rollingUpdate.maxSurge` (how many extra pods can be created above `replicas`) and `maxUnavailable` (how many pods can be unavailable during update). If errors occur, `kubectl rollout undo` instantly rolls back to the prior revision.',
        yamlSnippet: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-web
  namespace: default
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 0
  selector:
    matchLabels:
      app: frontend-web
  template:
    metadata:
      labels:
        app: frontend-web
    spec:
      containers:
      - name: nginx
        image: nginx:1.25-alpine
        ports:
        - containerPort: 80`,
        kubectlCommands: ['kubectl get deployments', 'kubectl rollout status deployment/frontend-web', 'kubectl rollout history deployment/frontend-web'],
        visualizerFocus: 'Rolling transition from old ReplicaSet v1 to new ReplicaSet v2 with zero dropped requests',
        practiceChallenge: {
          instructions: 'Check the rollout status of the frontend-web deployment.',
          goalCommand: 'kubectl rollout status deployment/frontend-web',
          hints: ['Run kubectl rollout status deployment/frontend-web', 'Notice whether rollout has successfully completed'],
        },
        whatIsIt: "A Deployment is a high-level declarative controller that manages the automated rollout, versioning, scaling, and zero-downtime rolling updates of stateless Pods and ReplicaSets.",
        inSimpleWords: "Imagine a relay race where a new team of runners (version 2) gradually replaces the old team (version 1). One new runner starts and begins carrying the baton. Once they are up to full speed, one old runner steps off the track, repeating until the entire team is running version 2 with zero pause in the race.",
        realWorldAnalogy: {
                  "metaphor": "Escalator Step Replacement on a Live Transit System",
                  "explanation": "Technicians replace individual escalator steps one at a time while the escalator continues moving passengers, ensuring travelers reach their train platforms without the station ever shutting down."
        },
        whenToUse: [
                  "Deploying standard stateless web applications, REST/GraphQL APIs, microservices, and background queue workers.",
                  "Executing zero-downtime continuous deployment updates with fine-grained control over maxSurge and maxUnavailable.",
                  "Managing fast rollbacks to historical revisions (kubectl rollout undo) when newly deployed code exhibits bugs."
        ],
        whenNotToUse: [
                  "Clustered stateful applications (PostgreSQL, MongoDB, Kafka) requiring ordered scaling and persistent node identities (use StatefulSets).",
                  "System-level daemon processes that must run exactly once on every physical node (use DaemonSets).",
                  "Finite batch processing scripts that run once and exit (use Jobs)."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "Spec Mutation Detection",
                            "description": "Operator updates deployment image or environment variables; Deployment controller detects a spec.template hash change."
                  },
                  {
                            "step": 2,
                            "title": "New ReplicaSet Provisioning",
                            "description": "A new ReplicaSet (v2) is created with 0 replicas, labeled with the new pod-template-hash."
                  },
                  {
                            "step": 3,
                            "title": "MaxSurge Expansion",
                            "description": "Deployment scales v2 ReplicaSet up by maxSurge (e.g. +25%); new pods are scheduled and begin container startup."
                  },
                  {
                            "step": 4,
                            "title": "Readiness & MaxUnavailable Shrink",
                            "description": "Once v2 pods pass readiness probes, the old v1 ReplicaSet is scaled down by maxUnavailable, repeating until v1 reaches 0."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "maxSurge & maxUnavailable",
                            "detail": "maxSurge controls how many extra pods can exist during rollout; maxUnavailable controls how many pods can be offline."
                  },
                  {
                            "title": "Rollout History & Revisions",
                            "detail": "Every pod template update generates a revision recorded in annotations; revisionHistoryLimit dictates retained rollbacks."
                  },
                  {
                            "title": "Readiness Probe Integration",
                            "detail": "Deployments will NOT scale down old pods until newly created replacement pods report Ready: True."
                  }
        ],
        productionTips: [
                  "Set maxUnavailable: 0 and maxSurge: 25% for critical production APIs to guarantee capacity never drops below 100% during updates.",
                  "Always configure accurate readiness probes; without them, Kubernetes considers containers ready the millisecond they start, causing traffic drops.",
                  "Use kubectl rollout pause and kubectl rollout resume for canary testing a deployment before committing full rollouts."
        ],
      },
      {
        id: 'c-daemonsets-node-agents',
        number: '4.3',
        title: 'DaemonSets: Cluster-Wide Node Agents',
        commandPill: 'kubectl get ds -n kube-system',
        badge: 'Infrastructure',
        difficulty: 'Intermediate',
        description: 'Ensure all (or some) nodes run a copy of a Pod. Ideal for log collection (Fluentd), monitoring (node-exporter), and CNI plugins.',
        explanation: 'A `DaemonSet` ensures that all eligible nodes run exactly one copy of a specified Pod. As new nodes join the cluster, the DaemonSet controller automatically assigns a Pod to them. If a node is deleted, the Pod is garbage collected. DaemonSets are universally used for cluster infrastructure: node monitoring agents (Prometheus `node-exporter`), log collectors (Fluentbit, Promtail), storage daemons (Ceph, GlusterFS), and CNI networking agents (Cilium, Calico, kube-proxy). They routinely tolerate control-plane taints to monitor masters.',
        yamlSnippet: `apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: node-exporter
  namespace: monitoring
spec:
  selector:
    matchLabels:
      app: node-exporter
  template:
    metadata:
      labels:
        app: node-exporter
    spec:
      hostNetwork: true
      hostPID: true
      tolerations:
      - operator: Exists
        effect: NoSchedule
      containers:
      - name: node-exporter
        image: prom/node-exporter:v1.7.0
        ports:
        - containerPort: 9100`,
        kubectlCommands: ['kubectl get ds', 'kubectl get ds -A'],
        visualizerFocus: 'One DaemonSet pod pinned to every physical worker and control-plane node in the cluster',
        practiceChallenge: {
          instructions: 'Inspect all DaemonSets running across the entire cluster using the -A flag.',
          goalCommand: 'kubectl get ds -A',
          hints: ['Run kubectl get ds -A or kubectl get daemonsets --all-namespaces'],
        },
        whatIsIt: "A DaemonSet is a Kubernetes workload controller that ensures all (or a subset of) worker and control plane nodes run exactly one copy of a specified Pod, automatically provisioning pods as new nodes join the cluster and destroying them as nodes are removed.",
        inSimpleWords: "Think of a DaemonSet like a mandatory security guard stationed at every single entrance door of a stadium. If the stadium opens a new gate (new worker node added), a security guard (daemon pod) is automatically assigned to that gate immediately.",
        realWorldAnalogy: {
                  "metaphor": "Fire Sprinkler Heads Installed in Every Hotel Room",
                  "explanation": "The hotel blueprint mandates that every room built must contain a sprinkler head. You do not calculate how many sprinkler heads you need based on guests; you install exactly one per room, guaranteed."
        },
        whenToUse: [
                  "Running cluster storage daemons on every node, such as Ceph, GlusterFS, or CSI node drivers.",
                  "Deploying node-level host log collectors, such as Fluentd, Fluentbit, Logstash, or Vector.",
                  "Deploying node monitoring and observability agents, such as Prometheus node-exporter, Datadog agent, or Dynatrace.",
                  "Running CNI networking daemons (kube-proxy, Cilium, Calico, AWS VPC CNI) that must manage host network namespaces."
        ],
        whenNotToUse: [
                  "Standard stateless application microservices that should scale elastically based on user traffic rather than node count.",
                  "Workloads that require multiple replicas running on the same node to utilize multi-core CPU capacity (use Deployments).",
                  "Batch jobs or one-off maintenance scripts."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "Node Discovery & Filter",
                            "description": "DaemonSet controller watches all cluster Nodes and evaluates nodeSelector, affinity, and taints."
                  },
                  {
                            "step": 2,
                            "title": "Host Assignment via NodeAffinity",
                            "description": "For every eligible node lacking a DaemonSet pod, the controller creates a Pod with a NodeAffinity matching that nodeName."
                  },
                  {
                            "step": 3,
                            "title": "Default Scheduler Binding",
                            "description": "Modern Kubernetes schedules DaemonSet pods using the default kube-scheduler, respecting node taints and tolerations."
                  },
                  {
                            "step": 4,
                            "title": "Dynamic Fleet Reconciliation",
                            "description": "When a node is deleted from the cluster, the controller garbage collects the orphaned daemon pod automatically."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "Tolerations for Master Taints",
                            "detail": "DaemonSets frequently specify tolerations for node-role.kubernetes.io/control-plane:NoSchedule to run on master nodes."
                  },
                  {
                            "title": "RollingUpdate Strategy",
                            "detail": "Supports maxUnavailable (default 1) to update node agents across the fleet one node at a time."
                  },
                  {
                            "title": "hostNetwork & hostPID",
                            "detail": "Infrastructure daemon pods frequently share the host network and process namespaces to gather bare-metal host metrics."
                  }
        ],
        productionTips: [
                  "Always configure resource requests and limits on DaemonSets to prevent runaway log collectors from crashing node operating systems.",
                  "Use nodeAffinity or nodeSelector to restrict DaemonSets to specific node pools (e.g. running GPU monitoring agents only on GPU nodes).",
                  "Set priorityClassName: system-node-critical on essential networking and logging DaemonSets so they are never evicted under memory pressure."
        ],
      },
      {
        id: 'c-jobs-and-cronjobs',
        number: '4.4',
        title: 'Jobs & CronJobs: Batch Workloads',
        commandPill: 'kubectl get cronjobs',
        badge: 'Batch Processing',
        difficulty: 'Intermediate',
        description: 'Run batch tasks to completion with Jobs, and schedule periodic tasks with CronJobs using cron format expressions.',
        explanation: 'While Deployments keep containers running continuously, `Jobs` supervise Pods until a specified number of successful completions (`completions: 1`) is reached. If a pod crashes, the Job controller retries it up to `backoffLimit`. A `CronJob` runs Jobs on a recurring schedule defined by standard 5-field cron syntax (`"0 2 * * *"` for 2:00 AM daily). CronJobs support concurrency policies: `Allow` (concurrent runs permitted), `Forbid` (skip if prior job still executing), and `Replace` (cancel old job and start new one).',
        yamlSnippet: `apiVersion: batch/v1
kind: CronJob
metadata:
  name: nightly-db-backup
spec:
  schedule: "0 2 * * *"
  concurrencyPolicy: Forbid
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1
  jobTemplate:
    spec:
      backoffLimit: 2
      template:
        spec:
          restartPolicy: OnFailure
          containers:
          - name: backup
            image: postgres:16-alpine
            command: ['sh', '-c', 'pg_dump -h db prod > /backup/dump.sql']`,
        kubectlCommands: ['kubectl get jobs', 'kubectl get cronjobs'],
        visualizerFocus: 'Ephemeral batch Pods running to completion with exit code 0',
        practiceChallenge: {
          instructions: 'Check for any active or scheduled CronJobs in the cluster.',
          goalCommand: 'kubectl get cronjobs',
          hints: ['Run kubectl get cronjobs or kubectl get cj', 'Check SCHEDULE and LAST SCHEDULE columns'],
        },
        whatIsIt: "Jobs and CronJobs are Kubernetes batch workload controllers. A Job creates one or more Pods and ensures a specified number of them terminate successfully (exit code 0). A CronJob manages Jobs on a time-based recurring schedule using standard cron syntax.",
        inSimpleWords: "Deployments are like security guards on a 24/7 continuous shift (if they leave, replace them). A Job is like hiring a plumber to fix a leak—they come in, do the task, report success (exit 0), and leave. A CronJob is hiring a window cleaner to clean the windows every Monday at 8:00 AM.",
        realWorldAnalogy: {
                  "metaphor": "Nightly Street Sweepers and Scheduled Bank Reconciliation",
                  "explanation": "Every night at 2:00 AM, the city dispatch sends street sweepers (CronJob). The sweepers clean the streets, dump the waste, and return to the garage (Job completion). They do not circle the streets indefinitely during morning rush hour."
        },
        whenToUse: [
                  "Running database schema migrations, seed scripts, or data backfills prior to deployment rollouts.",
                  "Executing periodic batch reports, automated data backups (pg_dump), or daily cache pre-warming.",
                  "Parallel batch data processing, image rendering pipelines, or ML model batch inference."
        ],
        whenNotToUse: [
                  "Long-running web servers, APIs, or event listeners (these will exit or restart endlessly under a Job).",
                  "Tasks where failure cannot be retried without manual human intervention (configure backoffLimit carefully).",
                  "Millisecond-precision cron tasks (Kubernetes CronJob scheduler checks roughly once a minute)."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "Cron Schedule Trigger",
                            "description": "CronJob controller evaluates schedule (e.g. 0 2 * * *); at trigger time, it creates a batch/v1 Job resource."
                  },
                  {
                            "step": 2,
                            "title": "Job Pod Instantiation",
                            "description": "Job controller reads completions and parallelism settings and launches Pods with restartPolicy: OnFailure or Never."
                  },
                  {
                            "step": 3,
                            "title": "Completion Tracking & Retries",
                            "description": "Controller tracks successful exits (code 0). If a pod fails, it creates replacements up to backoffLimit with exponential backoff."
                  },
                  {
                            "step": 4,
                            "title": "History Pruning & Retention",
                            "description": "Completed Jobs are retained up to successfulJobsHistoryLimit and failedJobsHistoryLimit for log inspection, then reaped."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "concurrencyPolicy",
                            "detail": "Governs concurrent runs: Allow (default concurrent), Forbid (skip if prior job is still running), Replace (cancel running job)."
                  },
                  {
                            "title": "completions & parallelism",
                            "detail": "completions: 10 with parallelism: 2 processes 10 batch items running 2 pods simultaneously."
                  },
                  {
                            "title": "activeDeadlineSeconds",
                            "detail": "Hard timeout: if the Job does not complete within this duration, Kubernetes terminates all pods and marks the Job failed."
                  }
        ],
        productionTips: [
                  "Always set concurrencyPolicy: Forbid on database backups and billing runs to prevent overlapping jobs from corrupting data.",
                  "Always specify activeDeadlineSeconds to prevent hanging zombie jobs from consuming cluster compute indefinitely.",
                  "Set successfulJobsHistoryLimit: 3 and failedJobsHistoryLimit: 1 to prevent completed batch pods from cluttering kubectl get pods."
        ],
      },
    ],
  },
  {
    id: 'ch05-storage',
    number: 5,
    title: 'Stateful Workloads & Persistent Storage',
    category: 'State & Storage',
    concepts: [
      {
        id: 'c-volumes-emptydir-hostpath',
        number: '5.1',
        title: 'Kubernetes Volumes: emptyDir & hostPath',
        commandPill: 'kubectl explain pod.spec.volumes',
        badge: 'Ephemeral Storage',
        difficulty: 'Beginner',
        description: 'Understand ephemeral pod storage volumes. Share files between containers using emptyDir, and mount host directories with hostPath.',
        explanation: 'Container filesystems are ephemeral: when a container crashes, changes are lost. Kubernetes `Volumes` live across container restarts within the same Pod. `emptyDir` is created when a Pod is scheduled onto a node and exists as long as that Pod is running on that node (stored on node RAM or SSD); it is ideal for scratch space, sorting algorithms, and multi-container shared data. `hostPath` mounts a file or directory from the host node filesystem into the Pod (used predominantly by system daemons requiring host access).',
        yamlSnippet: `apiVersion: v1
kind: Pod
metadata:
  name: cache-pod
spec:
  containers:
  - name: app
    image: redis:alpine
    volumeMounts:
    - name: cache-volume
      mountPath: /data
  volumes:
  - name: cache-volume
    emptyDir:
      medium: Memory # Backed by tmpfs RAM for ultra-low latency
      sizeLimit: 1Gi`,
        kubectlCommands: ['kubectl explain pod.spec.volumes', 'kubectl get pods'],
        visualizerFocus: 'Node filesystem tmpfs mounted into pod container via emptyDir volume',
        practiceChallenge: {
          instructions: 'Use kubectl explain to explore the API documentation for pod volumes.',
          goalCommand: 'kubectl explain pod.spec.volumes',
          hints: ['Run kubectl explain pod.spec.volumes', 'Review available volume types like emptyDir, configMap, secret, pvc'],
        },
        whatIsIt: "emptyDir and hostPath are fundamental node-level storage volume types in Kubernetes. emptyDir provides an ephemeral scratch directory shared across containers within a Pod, while hostPath mounts a directory or file from the host node filesystem directly into a Pod.",
        inSimpleWords: "emptyDir is like a shared whiteboard in a meeting room—anyone in the room can write notes on it, but when the meeting ends (pod terminates), the whiteboard is wiped clean. hostPath is like tapping into the electrical wiring inside the building wall—useful for building inspectors, but dangerous for regular hotel guests.",
        realWorldAnalogy: {
                  "metaphor": "Shared Kitchen Counter (emptyDir) vs Building Maintenance Room (hostPath)",
                  "explanation": "Roommates share the kitchen counter to prep food together; when they move out, the counter is cleared. The maintenance room gives access to the building furnace and fuse box—only certified building staff (system daemons) should ever enter."
        },
        whenToUse: [
                  "emptyDir: Sharing scratch space between a primary app and a log-shipping sidecar container.",
                  "emptyDir with medium: Memory: Creating ultra-fast in-memory tmpfs caches or storing sensitive short-lived cryptographic tokens.",
                  "hostPath: System daemons (Fluentd, node-exporter, CSI drivers) that need to read /var/log or /dev on the underlying Linux host."
        ],
        whenNotToUse: [
                  "Storing business data or database tables in emptyDir (all data is permanently wiped when the pod restarts or moves nodes).",
                  "Using hostPath for standard application pods (ties pods to a single node and creates catastrophic cluster security vulnerabilities).",
                  "Unbounded emptyDir without sizeLimit (a rogue process can fill the entire node root disk and trigger node eviction storms)."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "Node Scheduling & Directory Provisioning",
                            "description": "When a Pod is scheduled to a node, kubelet creates an empty directory under /var/lib/kubelet/pods/<pod-uid>/volumes/kubernetes.io~empty-dir/."
                  },
                  {
                            "step": 2,
                            "title": "Container Bind Mounting",
                            "description": "The CRI container runtime mounts the volume into each container specified in volumeMounts at mountPath."
                  },
                  {
                            "step": 3,
                            "title": "Concurrent Read/Write I/O",
                            "description": "Containers read and write to the shared directory concurrently using standard POSIX filesystem semantics."
                  },
                  {
                            "step": 4,
                            "title": "Pod Teardown & Permanent Eradication",
                            "description": "When the Pod is deleted, kubelet recursively wipes the emptyDir directory from the host disk or tmpfs memory."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "emptyDir.medium: Memory",
                            "detail": "Mounts a Linux tmpfs RAM disk instead of physical disk, delivering sub-millisecond I/O speed at the expense of host memory allocation."
                  },
                  {
                            "title": "emptyDir.sizeLimit",
                            "detail": "Enforces a maximum disk or memory quota; exceeding sizeLimit causes kubelet to evict the offending pod."
                  },
                  {
                            "title": "hostPath Type Validation",
                            "detail": "Validates host paths before mounting: DirectoryOrCreate, FileOrCreate, Socket, CharDevice, BlockDevice."
                  }
        ],
        productionTips: [
                  "Always set sizeLimit on emptyDir volumes to prevent a runaway container log loop from exhausting the node disk.",
                  "Forbid hostPath in production namespaces using Pod Security Standards (Baseline or Restricted profile).",
                  "Never rely on emptyDir across pod restarts; if a pod is rescheduled to another node, emptyDir starts completely blank."
        ],
      },
      {
        id: 'c-pv-pvc-lifecycle',
        number: '5.2',
        title: 'PersistentVolumes (PV) & Claims (PVC)',
        commandPill: 'kubectl get pv,pvc',
        badge: 'Persistent Storage',
        difficulty: 'Intermediate',
        description: 'Decouple storage definition from consumption. Understand PV provisioning, PVC requests, binding, and reclaim policies.',
        explanation: 'Kubernetes separates storage administration from developer consumption through the PV/PVC abstraction. A `PersistentVolume` (PV) is a storage resource in the cluster provisioned by an administrator or dynamically created by a StorageClass (e.g. AWS EBS, GCP PD, NFS, Ceph). A `PersistentVolumeClaim` (PVC) is a request for storage by a user (specifying capacity e.g. 50Gi and access mode e.g. `ReadWriteOnce`, `ReadOnlyMany`, `ReadWriteMany`). The control plane binds matching PVCs to PVs. Reclaim policies (`Retain`, `Delete`) dictate what happens to storage when the PVC is deleted.',
        yamlSnippet: `apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-data-pvc
spec:
  accessModes:
    - ReadWriteOnce # Mounted as read-write by a single node
  resources:
    requests:
      storage: 20Gi
  storageClassName: standard-rwo`,
        kubectlCommands: ['kubectl get pv', 'kubectl get pvc', 'kubectl describe pvc postgres-data-pvc'],
        visualizerFocus: 'PersistentVolumeClaim binding to a cluster PersistentVolume backed by network storage',
        practiceChallenge: {
          instructions: 'Query the cluster to view all PersistentVolumes and PersistentVolumeClaims simultaneously.',
          goalCommand: 'kubectl get pv,pvc',
          hints: ['Run kubectl get pv,pvc', 'Check the STATUS column (Bound, Available, Pending)'],
        },
        whatIsIt: "PersistentVolumes (PV) and PersistentVolumeClaims (PVC) form the decoupled storage abstraction layer of Kubernetes. A PV represents an actual physical or cloud storage resource in the cluster, while a PVC is a user request for storage of a specific size and access mode.",
        inSimpleWords: "Think of a PersistentVolume (PV) like an available parking spot in a parking garage. A PersistentVolumeClaim (PVC) is a parking permit voucher requested by a driver (\"I need a spot that fits an SUV\"). The garage attendant (Kubernetes storage controller) matches the driver with an available spot and locks the gate.",
        realWorldAnalogy: {
                  "metaphor": "Real Estate Land Lots and Building Lease Applications",
                  "explanation": "The landlord develops 10-acre industrial plots (PVs). A company submits an application for 5 acres with heavy power access (PVC). The property manager signs a binding lease contract, tying the company to that exact parcel."
        },
        whenToUse: [
                  "Persisting state for relational and NoSQL databases (PostgreSQL, MySQL, MongoDB, Redis).",
                  "Stateful applications requiring data survival across pod restarts, container crashes, and node migrations.",
                  "Decoupling developer application manifests from cloud-specific storage hardware implementations."
        ],
        whenNotToUse: [
                  "Stateless microservices that should remain completely ephemeral and horizontal (store state in external S3/DB instead).",
                  "Sharing read-write filesystems across hundreds of pods in multiple regions without distributed NFS/Ceph infrastructure.",
                  "High-performance distributed caching where ephemeral memory or local NVMe scratch space is preferred."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "Provisioning (Static or Dynamic)",
                            "description": "Admin creates a PV manually, or a StorageClass dynamically provisions a cloud disk upon PVC creation."
                  },
                  {
                            "step": 2,
                            "title": "Binding Phase",
                            "description": "The PersistentVolumeController matches PVC requests with an appropriate PV by capacity and accessMode, entering Bound state."
                  },
                  {
                            "step": 3,
                            "title": "Using (Node Attach & Mount)",
                            "description": "Pod is scheduled; Kubelet volume manager attaches the network disk to the node and mounts it into the container rootfs."
                  },
                  {
                            "step": 4,
                            "title": "Reclaiming (Retain or Delete)",
                            "description": "When PVC is deleted, reclaimPolicy dictates outcome: Delete wipes the physical disk; Retain preserves data for manual recovery."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "Access Modes",
                            "detail": "ReadWriteOnce (RWO: single node), ReadOnlyMany (ROX: many nodes read-only), ReadWriteMany (RWX: many nodes read-write, e.g. NFS), ReadWriteOncePod (RWOP)."
                  },
                  {
                            "title": "volumeMode (Filesystem vs Block)",
                            "detail": "Filesystem mounts formatted disk; Block mounts raw unformatted block device directly to database engines for zero-overhead I/O."
                  },
                  {
                            "title": "Reclaim Policy (Retain vs Delete)",
                            "detail": "Retain prevents accidental data loss; Delete automatically tears down cloud infrastructure disks to prevent cloud billing waste."
                  }
        ],
        productionTips: [
                  "Always use retainPolicy: Retain for critical production databases so deleting a PVC by accident does not destroy the underlying cloud snapshot.",
                  "Enable allowVolumeExpansion: true in your StorageClass so you can increase PVC disk size online without pod downtime.",
                  "Remember that standard cloud block disks (AWS gp3, GCP pd-standard) only support ReadWriteOnce; use EFS/Filestore if you need ReadWriteMany."
        ],
      },
      {
        id: 'c-storageclasses-csi',
        number: '5.3',
        title: 'StorageClasses & Dynamic CSI Provisioning',
        commandPill: 'kubectl get sc',
        badge: 'CSI Drivers',
        difficulty: 'Advanced',
        description: 'Dynamic volume provisioning with StorageClasses and the Container Storage Interface (CSI), volume expansion, and volume binding modes.',
        explanation: 'Creating PVs manually does not scale. `StorageClasses` enable dynamic "on-demand" provisioning. When a developer creates a PVC referencing a StorageClass, the underlying Container Storage Interface (CSI) driver makes an API call to the cloud or SAN provider (e.g. `ebs.csi.aws.com`), creates the physical disk, registers the PV, and binds it to the PVC automatically. `volumeBindingMode: WaitForFirstConsumer` delays disk creation until the Pod is scheduled, ensuring the volume is created in the exact availability zone where the Pod will run.',
        yamlSnippet: `apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: ebs.csi.aws.com
volumeBindingMode: WaitForFirstConsumer
allowVolumeExpansion: true
reclaimPolicy: Delete
parameters:
  type: gp3
  iops: "3000"
  throughput: "125"`,
        kubectlCommands: ['kubectl get sc', 'kubectl describe sc fast-ssd'],
        visualizerFocus: 'StorageClass invoking CSI cloud driver to dynamically create network disks on-demand',
        practiceChallenge: {
          instructions: 'Inspect the StorageClasses available in the cluster.',
          goalCommand: 'kubectl get sc',
          hints: ['Run kubectl get sc or kubectl get storageclass', 'Look for PROVISIONER and RECLAIMPOLICY'],
        },
        whatIsIt: "StorageClasses define the \"classes\" of storage offered in a cluster (e.g. fast SSDs vs cheap HDD backups) and enable dynamic volume provisioning via the Container Storage Interface (CSI), eliminating the need for cluster administrators to pre-provision storage disks.",
        inSimpleWords: "Think of a StorageClass like a vending machine for hard drives. Instead of asking the IT department to physically order a hard drive from Amazon and screw it into a server rack, a developer pushes a button for \"Fast SSD\" and the machine instantly fabricates a disk in the cloud and hands it to the pod.",
        realWorldAnalogy: {
                  "metaphor": "Hotel Room Service Menu vs Grocery Shopping",
                  "explanation": "Instead of walking to the market, buying ingredients, and cooking (static PV provisioning), you order from room service: \"I want the 5-star steak delivered to Room 302.\" The hotel kitchen prepares it on demand and brings it to your door."
        },
        whenToUse: [
                  "Automating cloud storage provisioning across AWS (ebs.csi.aws.com), GCP (pd.csi.storage.gke.io), Azure, or Ceph.",
                  "Tiering storage performance: defining \"premium-fast-nvme\" for databases and \"cheap-bulk-storage\" for logs.",
                  "Enabling topology-aware volume binding with volumeBindingMode: WaitForFirstConsumer to prevent multi-AZ scheduling failures."
        ],
        whenNotToUse: [
                  "Hardcoding cloud-specific CSI driver parameters inside developer application manifests (keep StorageClasses centralized).",
                  "Using immediate volume binding for localized cloud disks across multi-availability-zone clusters.",
                  "Environments with static, non-expandable on-premises SANs that lack CSI dynamic provisioning drivers."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "PVC Manifest Submission",
                            "description": "Developer submits a PersistentVolumeClaim referencing storageClassName: fast-ssd."
                  },
                  {
                            "step": 2,
                            "title": "CSI Provisioner Watch",
                            "description": "The CSI external-provisioner sidecar detects the unbound PVC and invokes the cloud provider API (e.g. CreateVolume)."
                  },
                  {
                            "step": 3,
                            "title": "PV Object Generation",
                            "description": "The cloud disk is created; the CSI plugin registers a matching PersistentVolume object in Kubernetes and binds it to the PVC."
                  },
                  {
                            "step": 4,
                            "title": "Node Attacher & Formatter",
                            "description": "CSI attacher attaches the volume to the target EC2/GCE instance, formats the filesystem (ext4/xfs), and kubelet mounts it."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "volumeBindingMode: WaitForFirstConsumer",
                            "detail": "Delays disk creation until the pod is scheduled to ensure the volume is provisioned in the exact Availability Zone of the worker node."
                  },
                  {
                            "title": "Container Storage Interface (CSI)",
                            "detail": "An industry standard gRPC interface separating storage vendor drivers from core Kubernetes code."
                  },
                  {
                            "title": "allowVolumeExpansion: true",
                            "detail": "Allows increasing PVC storage request in YAML; the CSI driver dynamically expands the filesystem on the fly."
                  }
        ],
        productionTips: [
                  "Always set volumeBindingMode: WaitForFirstConsumer on StorageClasses to prevent multi-AZ volume affinity deadlocks.",
                  "Mark one StorageClass as default using storageclass.kubernetes.io/is-default-class: \"true\" for developer convenience.",
                  "Always test volume snapshots and dynamic expansion in staging before relying on them for production disaster recovery."
        ],
      },
      {
        id: 'c-statefulsets-ordered-scaling',
        number: '5.4',
        title: 'StatefulSets & Headless Services',
        commandPill: 'kubectl get statefulsets',
        badge: 'Stateful Databases',
        difficulty: 'Advanced',
        description: 'Manage stateful distributed databases (PostgreSQL, Kafka, Cassandra) with stable network identifiers, ordinal index, and volumeClaimTemplates.',
        explanation: 'Deployments assume pods are fungible and replaceable. `StatefulSets` manage workloads that require unique identities: (1) Stable, unique network identifiers (`db-0`, `db-1`, `db-2`) via a Headless Service (`clusterIP: None`); (2) Ordered, graceful deployment and scaling (pod N is ready before pod N+1 starts); (3) Dedicated persistent storage per pod using `volumeClaimTemplates` (so if `db-1` crashes, its replacement re-attaches to the exact same disk); (4) Ordered termination (from highest index to lowest).',
        yamlSnippet: `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: kafka-cluster
spec:
  serviceName: kafka-headless
  replicas: 3
  selector:
    matchLabels:
      app: kafka
  template:
    metadata:
      labels:
        app: kafka
    spec:
      containers:
      - name: broker
        image: confluentinc/cp-kafka:7.5.0
        ports:
        - containerPort: 9092
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 100Gi`,
        kubectlCommands: ['kubectl get statefulsets', 'kubectl get pods -l app=kafka', 'kubectl get pvc'],
        visualizerFocus: 'StatefulSet pods with deterministic ordinal indexes (db-0, db-1) linked to dedicated PVCs',
        practiceChallenge: {
          instructions: 'List any StatefulSets present in the cluster.',
          goalCommand: 'kubectl get statefulsets',
          hints: ['Run kubectl get statefulsets or kubectl get sts', 'Observe the READY and AGE columns'],
        },
        whatIsIt: "A StatefulSet is the specialized workload controller designed for stateful applications and clustered databases (PostgreSQL, Kafka, Cassandra, ZooKeeper) that require stable, unique network identifiers, persistent ordered scaling, and dedicated persistent storage per replica.",
        inSimpleWords: "Deployments treat pods like cattle—if one gets sick, replace it with an anonymous clone. StatefulSets treat pods like pets—each has a unique name tag (db-0, db-1, db-2), its own dedicated bed and food bowl (PersistentVolume), and they always line up in the exact same order.",
        realWorldAnalogy: {
                  "metaphor": "Numbered Bank Tellers with Dedicated Locked Cash Drawers",
                  "explanation": "Teller #0 opens first and logs into the master vault. Teller #1 opens second and handles overflow. When Teller #1 goes home for lunch, nobody else touches their drawer; when Teller #1 returns, they unlock the exact same drawer with the exact same cash balance."
        },
        whenToUse: [
                  "Distributed databases and consensus systems requiring primary/replica architectures (PostgreSQL, MySQL Galera).",
                  "Clustered message brokers (Apache Kafka, RabbitMQ cluster) requiring deterministic broker IDs and stable DNS addresses.",
                  "Workloads requiring dedicated, isolated persistent disks per replica that must survive pod rescheduling."
        ],
        whenNotToUse: [
                  "Stateless web applications, REST APIs, microservices, or frontend web servers (use Deployments).",
                  "Applications that cannot handle deterministic ordered startup or where pods must scale up simultaneously.",
                  "Stateful workloads where data is stored externally in Amazon S3, Google Cloud Storage, or managed RDS."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "Ordinal Index Assignment",
                            "description": "StatefulSet assigns deterministic sequential names: <statefulset-name>-0, <statefulset-name>-1, etc."
                  },
                  {
                            "step": 2,
                            "title": "Dedicated VolumeClaimTemplate Provisioning",
                            "description": "For each pod, Kubernetes automatically generates a unique PVC (<pvc-name>-<pod-name>-<ordinal>) using dynamic storage."
                  },
                  {
                            "step": 3,
                            "title": "Strict Ordered Startup",
                            "description": "Pod 0 starts, binds to storage, passes readiness probes; only then does the controller proceed to launch Pod 1."
                  },
                  {
                            "step": 4,
                            "title": "Reverse Ordered Termination",
                            "description": "During scale-down or deletion, pods are terminated in strict reverse order (Pod N down to Pod 0) to preserve cluster quorum."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "Headless Service (clusterIP: None)",
                            "detail": "Enables deterministic SRV and A records for direct peer-to-peer communication (pod-0.my-headless-service.default.svc.cluster.local)."
                  },
                  {
                            "title": "volumeClaimTemplates",
                            "detail": "Creates an independent PVC for each replica that persists even if the pod is scaled down to 0, preventing catastrophic data loss."
                  },
                  {
                            "title": "podManagementPolicy: Parallel",
                            "detail": "Optional override that launches all stateful pods simultaneously instead of sequentially when strict ordering is not required."
                  }
        ],
        productionTips: [
                  "Deleting a StatefulSet does NOT delete its PVCs; this is an intentional safety feature to prevent accidental loss of database disks.",
                  "Always pair a StatefulSet with a Headless Service (clusterIP: None) to enable peer discovery among database nodes.",
                  "Use updateStrategy: RollingUpdate with partition for canary testing updates on high-index pods (e.g. test on db-2 before updating db-0)."
        ],
      },
    ],
  },
];
