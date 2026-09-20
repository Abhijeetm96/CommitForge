import type { KubeChapter } from './types';

export const PART_2_CHAPTERS: KubeChapter[] = [
  // =========================================================================
  // CHAPTER 4: Running Applications
  // =========================================================================
  {
    id: 'ch04-running-apps',
    number: 4,
    title: 'Running Applications',
    category: 'Core Workloads',
    concepts: [
      {
        id: 'c-pods-running-apps',
        number: '4.1',
        title: 'Pods',
        commandPill: 'kubectl get pods -o wide',
        badge: 'Atomic Unit',
        difficulty: 'Beginner',
        description: 'The fundamental scheduling unit of Kubernetes. Learn what a Pod is, why Pods exist, the Pod phase lifecycle, writing Pod YAML, and inspecting Pods.',
        subtopics: [
          'What is a Pod?',
          'Why Pods exist',
          'Pod lifecycle',
          'Pod YAML',
          'Create a Pod',
          'Inspect a Pod',
          'Delete a Pod',
        ],
        whatIsIt: 'A Pod is the smallest deployable computing unit in Kubernetes, encapsulating one or more tightly coupled containers sharing storage volumes, a single Linux network namespace (localhost IP), and inter-process IPC communication channels.',
        inSimpleWords: 'Think of a Pod like a pea pod containing a few closely related peas (containers). The peas live in the exact same shell, share the same water and nutrients (network loopback and volumes), and are always planted and harvested together on the same branch (worker node).',
        realWorldAnalogy: {
          metaphor: 'A Hotel Room with Twin Beds',
          explanation: 'Two guests (containers) stay in the same hotel room (Pod). They share the same telephone extension and bathroom (network IP and storage volume), but each has their own bed and luggage (isolated filesystems and memory limits).',
        },
        explanation: 'Kubernetes never schedules individual containers directly onto nodes; it always schedules Pods. A Pod models an application-specific "logical host". All containers in a Pod are co-located, co-scheduled, and run in a shared context. They share: (1) Network Namespace: every container in the Pod shares the same IP address and port space, communicating with each other via `localhost`; (2) Storage Volumes: Pod-defined volumes can be mounted into filesystem paths of any container in the Pod; (3) Lifecycle Phases: Pending (waiting for scheduler/images) -> ContainerCreating -> Running -> Succeeded (Jobs) or Failed.',
        whenToUse: [
          'Running your application processes inside Kubernetes managed workloads (wrapped inside Deployments)',
          'Pairing main application containers with helper sidecars (log forwarders, proxy sidecars, cache warmers)',
          'Executing one-off debugging pods using `kubectl run temp-debug --image=busybox -it --rm`',
        ],
        whenNotToUse: [
          'Creating standalone bare Pods directly in production without a controller (if a bare Pod crashes or its node dies, it is NEVER recreated)',
          'Packing multiple unrelated microservices into one Pod (each microservice should have its own Pod to scale independently)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Pending Phase', description: 'Pod manifest accepted by API server; kube-scheduler evaluates node resources and binds Pod to a node.' },
          { step: 2, title: 'ContainerCreating Phase', description: 'Worker node kubelet pulls container images, creates Linux network sandbox, and mounts storage volumes.' },
          { step: 3, title: 'Running Phase', description: 'All containers have executed entrypoints; startup and readiness probes evaluate passing.' },
          { step: 4, title: 'Termination Phase', description: 'Pod receives SIGTERM, executes graceful shutdown period (default 30s), then terminates cleanly or receives SIGKILL.' },
        ],
        keyMechanisms: [
          { title: 'The Pause Container (Infra Container)', detail: 'Every Pod initializes a tiny hidden "pause" container that holds open the network and IPC namespaces for the other containers.' },
          { title: 'Shared localhost Networking', detail: 'Containers in the same Pod communicate over `localhost:<port>` with zero network virtualization overhead.' },
          { title: 'Pod Phases vs Container States', detail: 'Pod phases (Pending, Running, Succeeded, Failed) aggregate lower-level container states (Waiting, Running, Terminated).' },
        ],
        productionTips: [
          'Always set `terminationGracePeriodSeconds` properly for apps that need time to finish active database transactions before shutting down.',
          'Never manage raw Pods in production manifests; always wrap Pod templates inside a Deployment, StatefulSet, or Job.',
          'Use `kubectl get pod <name> -o yaml` to inspect detailed containerStatuses and termination exit codes during incidents.',
        ],
        yamlSnippet: `apiVersion: v1
kind: Pod
metadata:
  name: web-frontend
  labels:
    app: frontend
spec:
  containers:
  - name: nginx
    image: nginx:1.25-alpine
    ports:
    - containerPort: 80
    resources:
      requests:
        cpu: "100m"
        memory: "128Mi"`,
        kubectlCommands: [
          'kubectl get pods -o wide',
          'kubectl describe pod web-frontend',
          'kubectl logs web-frontend',
          'kubectl delete pod web-frontend',
        ],
        visualizerFocus: 'Anatomy of a Pod wrapping containers and sharing localhost networking',
        practiceChallenge: {
          instructions: 'List all running pods in the active namespace with detailed node information using kubectl get pods -o wide.',
          goalCommand: 'kubectl get pods -o wide',
          hints: ['Run kubectl get pods -o wide', 'Check the READY, STATUS, and NODE columns'],
        },
      },
      {
        id: 'c-replicasets-desired-state',
        number: '4.2',
        title: 'ReplicaSets',
        commandPill: 'kubectl get rs',
        badge: 'Desired State',
        difficulty: 'Beginner',
        description: 'Guarantee application availability with ReplicaSets: label selectors, maintaining desired pod replica counts, and autonomic self-healing.',
        subtopics: [
          'Why replicas exist',
          'Desired state',
          'Replica management',
        ],
        whatIsIt: 'A core Kubernetes controller whose sole responsibility is to maintain a stable set of replica Pods running at any given time, using label selectors to acquire, monitor, and scale pods to match the declared desired state.',
        inSimpleWords: 'A tireless headcount manager. If you say "I need exactly 3 web servers running", the ReplicaSet counts how many exist. If one crashes, it creates a new one. If there are 4, it deletes one. It never sleeps.',
        realWorldAnalogy: {
          metaphor: 'A Security Guard Stationing Checkpoint',
          explanation: 'The building policy says 3 security guards must always be on duty at the front entrance. If one guard faints or goes on break, the dispatch manager immediately calls in an off-duty guard to keep the headcount at exactly 3.',
        },
        explanation: 'Standalone pods are ephemeral and fragile: if a worker node crashes or runs out of memory, bare pods die permanently. A `ReplicaSet` solves this by defining: (1) `replicas`: integer count of desired running pods; (2) `selector`: query identifying which pods belong to this ReplicaSet via labels; (3) `template`: Pod specification used when minting new pods. The ReplicaSet controller runs a continuous reconciliation loop: `desired_count == len(matching_pods)`. If actual < desired, it creates pods; if actual > desired, it deletes excess pods.',
        whenToUse: [
          'Under the hood as the execution engine for Deployments (Deployments create and manage ReplicaSets automatically)',
          'Maintaining guaranteed pod headcount across a cluster for stateless workloads',
        ],
        whenNotToUse: [
          'Creating ReplicaSets manually in YAML manifests (always use a `Deployment` instead, which adds rolling update and rollback capabilities on top of ReplicaSets)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Label Query Evaluation', description: 'ReplicaSet controller queries the cluster for pods matching `spec.selector.matchLabels`.' },
          { step: 2, title: 'Diff Calculation', description: 'Controller compares matched pod count against `spec.replicas`.' },
          { step: 3, title: 'Adoption & Creation', description: 'If replicas are missing, controller creates pods using `spec.template` and assigns OwnerReferences to itself.' },
          { step: 4, title: 'Orphan Cleanup', description: 'If matching pods exceed desired count, controller selects the newest unready pods and sends deletion requests.' },
        ],
        keyMechanisms: [
          { title: 'Set-Based vs Equality-Based Selectors', detail: 'ReplicaSets support modern set-based selectors (`environment in (production, qa)`), unlike legacy ReplicationControllers.' },
          { title: 'OwnerReferences & Garbage Collection', detail: 'Each generated Pod has `metadata.ownerReferences` pointing to the ReplicaSet UID; deleting the ReplicaSet cascades to delete its pods.' },
          { title: 'Pod Adoption', detail: 'If an unmanaged Pod exists with matching labels, a ReplicaSet will adopt it into its replica count without recreating it.' },
        ],
        productionTips: [
          'Never manage ReplicaSets directly; Deployments manage ReplicaSets for you and allow rolling updates.',
          'Never modify labels on pods managed by a ReplicaSet; changing labels will orphan the pod and cause the ReplicaSet to immediately spawn a replacement.',
        ],
        yamlSnippet: `apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: frontend-rs
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
        image: nginx:alpine`,
        kubectlCommands: [
          'kubectl get rs',
          'kubectl describe rs frontend-rs',
          'kubectl scale rs frontend-rs --replicas=5',
        ],
        visualizerFocus: 'ReplicaSet controller acquiring and scaling pods based on label selectors',
        practiceChallenge: {
          instructions: 'Inspect all active ReplicaSets across the current namespace using kubectl get rs.',
          goalCommand: 'kubectl get rs',
          hints: ['Run kubectl get rs', 'Check DESIRED, CURRENT, and READY columns'],
        },
      },
      {
        id: 'c-deployments-workloads',
        number: '4.3',
        title: 'Deployments',
        commandPill: 'kubectl rollout status deployment/<name>',
        badge: 'Primary Workload',
        difficulty: 'Beginner',
        description: 'The workhorse of Kubernetes. Master Deployments: declarative updates, RollingUpdate strategy, maxSurge, maxUnavailable, scaling, and instant rollbacks.',
        subtopics: [
          'What is a Deployment?',
          'Deployment vs ReplicaSet',
          'Updating applications',
          'Scaling applications',
        ],
        whatIsIt: 'A higher-level declarative controller that manages the automated rollout, scaling, and zero-downtime version upgrades of ReplicaSets and Pods through declarative state management.',
        inSimpleWords: 'The standard way to run any web app or API in Kubernetes. You tell the Deployment "Run version 1.0 of my app with 5 replicas". When you upgrade to version 2.0, it smoothly replaces old pods with new pods one by one with zero downtime for users.',
        realWorldAnalogy: {
          metaphor: 'A Relay Race Team Substitution',
          explanation: 'You do not stop the race to change runners. The new runner starts jogging alongside the current runner (maxSurge), takes the baton (readiness probe passes), and the old runner steps off the track (maxUnavailable) without ever pausing the race.',
        },
        explanation: 'Deployments represent the declarative standard for stateless applications in Kubernetes. You describe a desired state in a Deployment object, and the Deployment Controller changes the actual state to the desired state at a controlled rate. When you update a container image in a Deployment, it creates a new ReplicaSet and gradually scales it up while scaling down the old ReplicaSet. The `RollingUpdate` strategy controls this using two parameters: `maxSurge` (how many extra pods can be created above desired count) and `maxUnavailable` (how many pods can be taken down during update).',
        whenToUse: [
          'All stateless web applications, REST APIs, GraphQL servers, microservices, and backend workers',
          'Executing zero-downtime rolling software updates across production clusters',
          'Performing instant automated or manual rollbacks if a newly deployed image crashes in production',
        ],
        whenNotToUse: [
          'Stateful clustered applications requiring stable network identities or dedicated persistent storage per replica (use StatefulSets instead)',
          'Node-level daemons that must run on every single physical machine (use DaemonSets instead)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Image Update Trigger', description: 'Engineer runs `kubectl set image deployment/web app=myapp:v2` or applies new manifest.' },
          { step: 2, title: 'New ReplicaSet Creation', description: 'Deployment controller creates ReplicaSet #2 with pod template hash label.' },
          { step: 3, title: 'Rolling Traffic Shift', description: 'New pods scale up; once readiness probes pass, old pods receive SIGTERM and scale down.' },
          { step: 4, title: 'Completion & History Retention', description: 'Old ReplicaSet scales to 0 replicas but remains preserved in history for instant rollbacks.' },
        ],
        keyMechanisms: [
          { title: 'RollingUpdate (maxSurge & maxUnavailable)', detail: 'Guarantees service capacity during releases (e.g. maxSurge: 25%, maxUnavailable: 0% ensures zero dropped requests).' },
          { title: 'Revision History & Rollbacks', detail: 'Deployments keep previous ReplicaSet definitions; `kubectl rollout undo` rolls back in seconds.' },
          { title: 'Pod Template Hashing', detail: 'Deployment computes a 32-bit hash of the pod template and appends it to ReplicaSet names (`web-7bc9f874d`).' },
        ],
        productionTips: [
          'Always set `maxUnavailable: 0` in production deployments if you cannot tolerate any capacity reduction during deployments.',
          'Always configure readiness probes on deployment pods; without them, Kubernetes thinks a pod is ready before the application has finished booting.',
          'Check rollout health during CI/CD using `kubectl rollout status deployment/<name> --timeout=5m`.',
        ],
        yamlSnippet: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-service
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: server
        image: api-server:v1.4.0
        ports:
        - containerPort: 8080`,
        kubectlCommands: [
          'kubectl get deployments',
          'kubectl rollout status deployment/api-service',
          'kubectl rollout history deployment/api-service',
          'kubectl rollout undo deployment/api-service',
        ],
        visualizerFocus: 'Deployment orchestrating zero-downtime rolling update between two ReplicaSets',
        practiceChallenge: {
          instructions: 'Check the rollout status of active deployments in the cluster.',
          goalCommand: 'kubectl get deployments',
          hints: ['Run kubectl get deployments', 'Examine UP-TO-DATE and AVAILABLE replica counts'],
        },
      },
      {
        id: 'c-statefulsets-persistent-apps',
        number: '4.4',
        title: 'StatefulSets',
        commandPill: 'kubectl get statefulsets',
        badge: 'Stateful Apps',
        difficulty: 'Intermediate',
        description: 'Run clustered databases and persistent stateful systems: ordinal indexing (pod-0, pod-1), stable network DNS identities, and VolumeClaimTemplates.',
        subtopics: [
          'Stateful workloads',
          'Stable identity',
          'Persistent applications',
        ],
        whatIsIt: 'The workload controller designed specifically for stateful applications (PostgreSQL, MySQL, Redis, Kafka, Cassandra) that requires stable, unique network identifiers, ordered graceful deployment and scaling, and dedicated persistent storage per replica.',
        inSimpleWords: 'Deployments treat pods like cattle (nameless, interchangeable, random IDs like `web-x8f92`). StatefulSets treat pods like pets (unique names like `db-0`, `db-1`, `db-2`, each with their own personal diary and hard drive that follows them forever).',
        realWorldAnalogy: {
          metaphor: 'A Baseball Team Lineup vs Anonymous Marathon Runners',
          explanation: 'In a marathon (Deployment), thousands of runners wear random numbers; if runner #84 drops out, nobody cares as long as the total count is fine. In a baseball team (StatefulSet), Player #1 is always the Pitcher, Player #2 is Catcher; each has an exact assigned position and role.',
        },
        explanation: 'Stateless apps can be scaled up and down randomly. But distributed databases require strict guarantees: (1) Ordinal Indexing: Pods are named predictably from `0` to `N-1` (`kafka-0`, `kafka-1`, `kafka-2`); (2) Ordered Scaling: `kafka-1` is not launched until `kafka-0` is fully Running and Ready; during scale-down, `kafka-2` is terminated before `kafka-1`; (3) Stable Network Identity: Combined with a Headless Service, each pod receives an immutable DNS name (`db-0.db-svc.default.svc.cluster.local`); (4) VolumeClaimTemplates: Each pod receives its own dedicated PersistentVolumeClaim that stays bound to that exact ordinal even if the pod is rescheduled onto a different node.',
        whenToUse: [
          'Clustered databases (PostgreSQL primary/replica, MongoDB replica sets, Cassandra, CockroachDB)',
          'Distributed consensus and message queues (Apache Kafka, RabbitMQ, ZooKeeper, etcd)',
          'Applications requiring predictable hostnames and persistent storage that outlives pod rescheduling',
        ],
        whenNotToUse: [
          'Stateless web applications, REST APIs, or frontend apps (always use Deployments for stateless apps)',
          'Using StatefulSets without understanding that deleting a StatefulSet does NOT delete its PVCs (done intentionally to prevent data loss)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Ordinal 0 Initialization', description: 'StatefulSet controller provisions pod-0 and its dedicated PVC from VolumeClaimTemplates.' },
          { step: 2, title: 'Readiness Gate', description: 'Controller waits until pod-0 reports Ready before creating pod-1.' },
          { step: 3, title: 'Headless DNS Binding', description: 'CoreDNS registers direct A-records for each pod hostname pointing directly to its Pod IP.' },
          { step: 4, title: 'Controlled Reverse Termination', description: 'When scaling down from 3 to 1, pod-2 is terminated first, followed by pod-1; PVCs remain intact.' },
        ],
        keyMechanisms: [
          { title: 'VolumeClaimTemplates', detail: 'Generates a unique PVC for every replica (`data-db-0`, `data-db-1`) that reattaches automatically if the pod restarts.' },
          { title: 'Headless Service Pairing', detail: 'Service with `clusterIP: None` allows direct DNS addressing of individual database nodes without proxy load balancing.' },
          { title: 'PodManagementPolicy (OrderedReady vs Parallel)', detail: 'OrderedReady enforces sequential ordinal startup; Parallel starts all pods concurrently.' },
        ],
        productionTips: [
          'Always pair StatefulSets with a Headless Service (`clusterIP: None`) so cluster members can discover peer nodes for database replication.',
          'Never expect deleting a StatefulSet to delete its PVCs; you must delete PVCs manually after ensuring backups are complete.',
          'Use `podManagementPolicy: Parallel` for workloads like ZooKeeper that can handle concurrent startup to save initialization time.',
        ],
        yamlSnippet: `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis-cluster
spec:
  serviceName: redis-headless
  replicas: 3
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:7.2-alpine
        ports:
        - containerPort: 6379
  volumeClaimTemplates:
  - metadata:
      name: redis-data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 10Gi`,
        kubectlCommands: [
          'kubectl get statefulsets',
          'kubectl get pvc -l app=redis',
          'kubectl describe statefulset redis-cluster',
        ],
        visualizerFocus: 'StatefulSet ordinal pods attached to dedicated persistent volume claims',
        practiceChallenge: {
          instructions: 'List any StatefulSets configured in the cluster using kubectl get statefulsets.',
          goalCommand: 'kubectl get statefulsets',
          hints: ['Run kubectl get statefulsets or kubectl get sts', 'Notice the READY and AGE columns'],
        },
      },
      {
        id: 'c-jobs-batch-processing',
        number: '4.5',
        title: 'Jobs',
        commandPill: 'kubectl get jobs',
        badge: 'Batch Workloads',
        difficulty: 'Intermediate',
        description: 'Run batch processing and run-to-completion tasks: Jobs, completions, parallelism, backoffLimit, failure policies, and CronJobs schedules.',
        subtopics: [
          'One-time workloads',
          'Job completion',
          'Batch processing',
        ],
        whatIsIt: 'The Kubernetes controller for finite batch workloads and run-to-completion tasks (database schema migrations, machine learning training runs, data transformations, backups) that terminates pods once their process exits successfully.',
        inSimpleWords: 'Deployments are like security guards who must stand at the door forever (never exit). Jobs are like moving contractors hired to move 50 boxes into your house: once the boxes are moved, they clock out and go home.',
        realWorldAnalogy: {
          metaphor: 'A Sprint Race vs A 24/7 Security Patrol',
          explanation: 'A security patrol (Deployment) walks the perimeter indefinitely and must be replaced immediately if someone drops out. A 100-meter dash (Job) has a defined finish line: once the runner crosses the line, the event is complete.',
        },
        explanation: 'Deployments expect containers to run indefinitely; if an application exits with code 0, a Deployment treats it as a crash and restarts it. A `Job` creates one or more Pods and ensures that a specified number of them successfully terminate (exit code 0). Key parameters include: `completions` (total number of successful pods needed), `parallelism` (how many pods can run simultaneously), and `backoffLimit` (number of retry attempts before marking the job failed). Paired with `CronJobs`, jobs can be scheduled periodically using standard 5-field cron syntax (`0 2 * * *`).',
        whenToUse: [
          'Database schema migrations (e.g. Prisma, Flyway, Liquibase) executed before new web pods launch',
          'Daily or hourly data processing pipelines, ETL batch jobs, and nighttime database backups',
          'Machine learning model training jobs or batch video transcoding tasks',
        ],
        whenNotToUse: [
          'Long-running web servers, HTTP APIs, or message queue consumers that should never exit (use Deployments)',
          'Setting `restartPolicy: Always` on Job pods (Jobs require `restartPolicy: OnFailure` or `Never`)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Job Manifest Creation', description: 'Job controller creates pods with `restartPolicy: OnFailure`.' },
          { step: 2, title: 'Parallel Execution', description: 'Up to `parallelism` pods execute batch compute concurrently.' },
          { step: 3, title: 'Completion Counting', description: 'Controller increments `succeeded` counter each time a pod process exits with code 0.' },
          { step: 4, title: 'Terminal Completion & TTL Cleanup', description: 'Once `completions` is met, Job status transitions to Complete; `ttlSecondsAfterFinished` cleans up pods.' },
        ],
        keyMechanisms: [
          { title: 'restartPolicy: OnFailure vs Never', detail: 'OnFailure restarts container in the same pod; Never creates a brand-new pod upon container failure.' },
          { title: 'backoffLimit', detail: 'Specifies number of retries before marking Job as failed, using exponential backoff delay (10s, 20s, 40s).' },
          { title: 'ttlSecondsAfterFinished', detail: 'Automatically deletes finished Job and its pods after a duration, keeping cluster etcd clean.' },
        ],
        productionTips: [
          'Always configure `ttlSecondsAfterFinished: 86400` on Jobs so completed pods are automatically garbage collected after 24 hours.',
          'Always set `activeDeadlineSeconds` on Jobs to prevent runaway infinite loops from consuming node compute forever.',
          'For database migrations in Helm charts, use Helm pre-install/pre-upgrade hooks with a Job.',
        ],
        yamlSnippet: `apiVersion: batch/v1
kind: Job
metadata:
  name: db-migration
spec:
  completions: 1
  backoffLimit: 3
  ttlSecondsAfterFinished: 3600
  template:
    spec:
      restartPolicy: OnFailure
      containers:
      - name: migrate
        image: company/migrator:v2.1
        command: ["npm", "run", "db:migrate"]`,
        kubectlCommands: [
          'kubectl get jobs',
          'kubectl get cronjobs',
          'kubectl describe job db-migration',
          'kubectl logs -l job-name=db-migration',
        ],
        visualizerFocus: 'Batch Job executing to completion and transitioning to Succeeded state',
        practiceChallenge: {
          instructions: 'Check the status of batch jobs in the cluster using kubectl get jobs.',
          goalCommand: 'kubectl get jobs',
          hints: ['Run kubectl get jobs', 'Check COMPLETIONS, DURATION, and AGE columns'],
        },
      },
    ],
  },

  // =========================================================================
  // CHAPTER 5: Services & Networking
  // =========================================================================
  {
    id: 'ch05-networking',
    number: 5,
    title: 'Services & Networking',
    category: 'Networking & Discovery',
    concepts: [
      {
        id: 'c-why-networking-needed',
        number: '5.1',
        title: 'Why Networking Is Needed',
        commandPill: 'kubectl get pods -o wide',
        badge: 'Decoupling',
        difficulty: 'Beginner',
        description: 'Understand the fundamental challenge of Kubernetes networking: ephemeral dynamic pod IP addresses, scaling churn, and the necessity of stable abstractions.',
        subtopics: [
          'Ephemeral pod IPs',
          'Dynamic scaling routing',
          'Decoupled frontend-backend',
          'Network abstraction',
        ],
        whatIsIt: 'The foundational architectural problem of cloud-native computing: because Pods are mortal and ephemeral—frequently killed, rescheduled, and scaled up or down—their IP addresses constantly change, making hardcoded IP connections impossible.',
        inSimpleWords: 'If you want to call a friend, you do not dial the GPS coordinates of the chair they are sitting on right now (because they will move in 5 minutes). You call their permanent phone number. A Service is that permanent phone number for your pods.',
        realWorldAnalogy: {
          metaphor: 'Calling the Front Desk vs Paging a Specific Maid',
          explanation: 'In a 500-room hotel, housekeepers change shifts and move between rooms constantly. Hotel guests do not call Jane\'s personal cell phone; they dial "0" for the Front Desk, which routes the request to whichever housekeeper is currently on duty.',
        },
        explanation: 'In traditional monolithic hosting, servers had static IP addresses that rarely changed. In Kubernetes, pods are disposable: when a node reboots, a deployment updates, or an autoscaler triggers, old pods are terminated and new pods receive completely different IP addresses from the CNI pool. If a frontend application tried to send HTTP requests directly to backend pod IPs, it would constantly experience connection timeouts. Networking abstractions (Services, DNS, kube-proxy) provide a layer of indirection: a static virtual IP and DNS name that dynamically routes traffic to live backend pods.',
        whenToUse: [
          'Connecting frontend microservices to backend databases or APIs without hardcoding IP addresses',
          'Designing loosely coupled distributed systems where components scale independently',
        ],
        whenNotToUse: [
          'Hardcoding pod IP addresses into application config files or environment variables (guaranteed to break upon pod restart)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Pod IP Assignment', description: 'CNI plugin assigns an ephemeral private IP from the node subnet upon pod creation.' },
          { step: 2, title: 'Scaling Event', description: 'Deployment scales from 2 to 5 replicas; 3 new distinct IP addresses appear.' },
          { step: 3, title: 'Routing Problem', description: 'Direct IP routing requires caller to track all 5 IPs and health check each connection manually.' },
          { step: 4, title: 'Service Resolution', description: 'Introducing a Service provides a single stable virtual IP that proxies across all active pod IPs automatically.' },
        ],
        keyMechanisms: [
          { title: 'Ephemeral Pod IP Lifecycle', detail: 'Pod IPs are leased from CNI CIDR blocks and returned immediately when pods terminate.' },
          { title: 'The Indirection Layer', detail: 'Decouples service consumers from service producers using label selectors.' },
          { title: 'The Endpoints Controller', detail: 'Watches pod IP additions and deletions and maintains an active healthy target pool.' },
        ],
        productionTips: [
          'Never communicate with pods by their IP address; always communicate via Service DNS names.',
          'Always test what happens when pods are deleted (`kubectl delete pod <name>`) to confirm your application reconnects seamlessly to replacement pods.',
        ],
        yamlSnippet: `# Demonstrating Pod IP Churn:
# Pod 1: 10.244.1.45 (dies on node reboot)
# Replacement Pod: 10.244.2.89 (new IP!)
# Solution: Service Virtual IP (10.96.0.10) remains constant forever!`,
        kubectlCommands: [
          'kubectl get pods -o wide',
          'kubectl get endpoints',
        ],
        visualizerFocus: 'Ephemeral pod IP churn contrasted with stable Service virtual IP routing',
        practiceChallenge: {
          instructions: 'Inspect the IP addresses assigned to pods across the cluster using kubectl get pods -o wide.',
          goalCommand: 'kubectl get pods -o wide',
          hints: ['Run kubectl get pods -o wide', 'Compare the IP column across multiple pods'],
        },
      },
      {
        id: 'c-k8s-services-clusterip',
        number: '5.2',
        title: 'Kubernetes Services',
        commandPill: 'kubectl get svc',
        badge: 'Core Networking',
        difficulty: 'Beginner',
        description: 'The internal load balancer of Kubernetes: Services, ClusterIP, label selectors, and internal CoreDNS service discovery.',
        subtopics: [
          'What is a Service?',
          'ClusterIP',
          'Service discovery',
        ],
        whatIsIt: 'An abstract method to expose an application running on a set of Pods as a network service. A Service provides a single, immutable virtual IP address (ClusterIP) and DNS entry that load-balances L4 traffic across all healthy matching pods.',
        inSimpleWords: 'A permanent in-cluster load balancer. It sits in front of a group of pods. When any container in the cluster sends a request to `http://auth-service`, the Service distributes the traffic evenly among all healthy auth pods.',
        realWorldAnalogy: {
          metaphor: 'A Bank Drive-Through Pneumatic Tube System',
          explanation: 'Customers pull up to a single drive-through teller window. Inside the bank, 5 different tellers work at desks. The system automatically sends the canister to whichever teller is currently free, so customers never need to know which teller processed their deposit.',
        },
        explanation: 'A Kubernetes Service is defined with a label `selector`. The control plane Endpoints Controller queries all pods matching those labels and populates an `Endpoints` (or `EndpointSlice`) resource with their IP addresses. The Service is allocated a virtual IP from the cluster service CIDR (`ClusterIP`). `ClusterIP` is the default service type and is reachable ONLY from inside the cluster. Built-in CoreDNS automatically creates an internal DNS record: `<service-name>.<namespace>.svc.cluster.local`. When an app connects, kube-proxy iptables/IPVS rules intercept the virtual IP and rewrite the destination packet to a healthy pod IP.',
        whenToUse: [
          'Internal east-west microservice-to-microservice communication within the cluster',
          'Providing a stable DNS hostname for databases, backend caches, and internal REST APIs',
          'Automatic round-robin load balancing across horizontal pod replicas',
        ],
        whenNotToUse: [
          'Exposing applications directly to the public internet (ClusterIP is private to the cluster; use Ingress or LoadBalancer instead)',
          'Attempting to use ClusterIP without any matching healthy pods (leads to connection refused)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Service Manifest Creation', description: 'Admin applies Service manifest with selector `app: backend` and port 80.' },
          { step: 2, title: 'Virtual IP & DNS Allocation', description: 'Kube-apiserver assigns a static ClusterIP (e.g. 10.96.12.34); CoreDNS registers backend.default.' },
          { step: 3, title: 'Endpoint Assembly', description: 'Endpoints controller discovers all pods with `app: backend` reporting Ready and attaches their IPs.' },
          { step: 4, title: 'Packet Interception', description: 'Worker node kube-proxy configures Linux kernel netfilter/iptables rules to route 10.96.12.34 to backend pod IPs.' },
        ],
        keyMechanisms: [
          { title: 'The ClusterIP Virtual IP', detail: 'A virtual IP that never exists on any physical network interface; handled entirely by kube-proxy kernel packet redirection.' },
          { title: 'CoreDNS Automatic Resolution', detail: 'Pods can resolve services simply by name (`backend`) or fully qualified domain name (FQDN).' },
          { title: 'Readiness Probe Integration', detail: 'If a pod fails its readiness probe, its IP is immediately stripped from the Service endpoints without pod restart.' },
        ],
        productionTips: [
          'You can address services in the same namespace using just their short name (e.g. `http://auth-svc:8080`).',
          'To reach a service in a different namespace, append the namespace name: `http://auth-svc.billing:8080`.',
          'Run `kubectl get endpoints <service-name>` to verify that your service is successfully discovering backend pods.',
        ],
        yamlSnippet: `apiVersion: v1
kind: Service
metadata:
  name: backend-api
  namespace: default
spec:
  type: ClusterIP
  selector:
    app: backend
  ports:
  - name: http
    port: 80
    targetPort: 8080`,
        kubectlCommands: [
          'kubectl get svc',
          'kubectl describe svc backend-api',
          'kubectl get endpoints backend-api',
        ],
        visualizerFocus: 'ClusterIP Service routing traffic to matching backend pod endpoints',
        practiceChallenge: {
          instructions: 'List all active Services in the current namespace using kubectl get svc.',
          goalCommand: 'kubectl get svc',
          hints: ['Run kubectl get svc or kubectl get services', 'Check the TYPE, CLUSTER-IP, and PORT(S) columns'],
        },
      },
      {
        id: 'c-external-access-ingress',
        number: '5.3',
        title: 'External Access',
        commandPill: 'kubectl get ingress',
        badge: 'External Traffic',
        difficulty: 'Beginner',
        description: 'Expose applications to outside users: NodePort, cloud LoadBalancers, and L7 HTTP/HTTPS reverse proxy routing with Ingress Controllers.',
        subtopics: [
          'Exposing applications',
          'NodePort',
          'LoadBalancer',
          'Ingress',
        ],
        whatIsIt: 'The networking mechanisms for routing external internet traffic into a Kubernetes cluster: comparing L4 NodePort, cloud-integrated LoadBalancer, and L7 Ingress Controllers.',
        inSimpleWords: 'ClusterIP is your private intercom. When you want real customers on the internet to visit your website (`https://mycompany.com`), you need an external door: NodePort (a specific door number), LoadBalancer (a dedicated cloud driveway), or Ingress (a smart receptionist routing visitors to the right department by name).',
        realWorldAnalogy: {
          metaphor: 'Office Building Receptionist vs Direct Phone Lines',
          explanation: 'NodePort is telling clients "dial our company number and enter extension 31254". LoadBalancer is paying the phone company for 10 separate expensive private phone lines. Ingress is a single 1-800 number with an automated voice menu: "Press 1 for Sales (path /sales), Press 2 for Support (path /support)".',
        },
        explanation: 'Kubernetes provides three mechanisms for external ingress: (1) `NodePort`: Allocates a high port (30000-32767) on every worker node; traffic sent to `<NodeIP>:<NodePort>` routes to backend pods; (2) `LoadBalancer`: The standard in cloud providers (AWS, GCP, Azure); automatically provisions an external cloud load balancer (AWS NLB/ALB) pointing to your nodes; (3) `Ingress`: An L7 HTTP/HTTPS reverse proxy (Nginx, Traefik, Envoy). A single external IP routes traffic based on hostnames (`api.example.com`) and URL paths (`/v1`, `/v2`), while terminating TLS/SSL certificates.',
        whenToUse: [
          'Ingress: Exposing multiple HTTP/S microservices under a single external cloud IP address with SSL/TLS termination',
          'LoadBalancer: Exposing non-HTTP protocols (TCP/UDP, gRPC, gaming servers, MQTT) or single critical web entrypoints',
          'NodePort: Quick local testing or bare-metal environments lacking cloud load balancer integration',
        ],
        whenNotToUse: [
          'Creating a separate `type: LoadBalancer` Service for 50 different microservices (incurs massive cloud costs for 50 independent cloud load balancers; use one Ingress instead)',
          'Using NodePort directly in production without an external load balancer (exposes raw node IPs and high ports to users)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'DNS Resolution', description: 'Client queries public DNS for `app.company.com` and receives cloud Load Balancer IP.' },
          { step: 2, title: 'L7 Ingress Routing', description: 'Ingress Controller (e.g. Ingress-Nginx) terminates TLS and inspects HTTP Host and Path headers.' },
          { step: 3, title: 'ClusterIP Service Hop', description: 'Ingress forwards HTTP request to internal backend ClusterIP service.' },
          { step: 4, title: 'Pod Execution', description: 'Request reaches target container; response streams back through Ingress reverse proxy to client.' },
        ],
        keyMechanisms: [
          { title: 'The NodePort Range (30000-32767)', detail: 'Every node listens on the chosen port and forwards packets to the service via kube-proxy.' },
          { title: 'Cloud Controller Manager (CCM)', detail: 'Background loop watching `type: LoadBalancer` services and invoking cloud provider APIs to create ALBs/NLBs.' },
          { title: 'Ingress Controller vs Ingress Resource', detail: 'The Ingress resource is just a rule definition; an Ingress Controller (Nginx, Envoy) is the actual proxy running pods.' },
        ],
        productionTips: [
          'Always use an Ingress Controller paired with `cert-manager` to automatically provision free, auto-renewing Let\'s Encrypt SSL/TLS certificates.',
          'Set `externalTrafficPolicy: Local` on LoadBalancer services if you need to preserve original client source IP addresses.',
          'Check out the modern `Gateway API`, the next-generation successor to Ingress with role-oriented routing.',
        ],
        yamlSnippet: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  rules:
  - host: myapp.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-service
            port:
              number: 80`,
        kubectlCommands: [
          'kubectl get ingress',
          'kubectl describe ingress web-ingress',
          'kubectl get svc -l type=LoadBalancer',
        ],
        visualizerFocus: 'External internet traffic entering Ingress and routing to backend services',
        practiceChallenge: {
          instructions: 'Check for Ingress resources configured in the current namespace.',
          goalCommand: 'kubectl get ingress',
          hints: ['Run kubectl get ingress', 'Notice CLASS, HOSTS, ADDRESS, and PORTS'],
        },
      },
      {
        id: 'c-load-balancing-endpoints',
        number: '5.4',
        title: 'Load Balancing',
        commandPill: 'kubectl get endpointslices',
        badge: 'Traffic Distribution',
        difficulty: 'Intermediate',
        description: 'Deep dive into Kubernetes traffic distribution: EndpointSlices, kube-proxy modes (iptables vs IPVS), session affinity, and connection handling.',
        subtopics: [
          'Traffic distribution',
          'Service endpoints',
          'EndpointSlices',
          'kube-proxy IPVS/iptables',
        ],
        whatIsIt: 'The low-level packet-forwarding and load-balancing architecture of Kubernetes: how `kube-proxy` programs the Linux kernel using `iptables` or `IPVS` to distribute incoming connections across healthy pod endpoints at line rate.',
        inSimpleWords: 'How Kubernetes actually splits the traffic evenly. When 100 requests arrive at a service, how does the computer decide which pod gets request #1 and which gets request #2? Kube-proxy programs rules directly into the Linux operating system kernel.',
        realWorldAnalogy: {
          metaphor: 'A Casino Card Dealer Distributing Cards',
          explanation: 'The dealer (kube-proxy) stands in the center of the table. As cards (packets) arrive from the deck, the dealer flips one card to Player 1, the next to Player 2, and the next to Player 3 in a continuous, fair circle.',
        },
        explanation: 'When a Service is created, the Kubernetes control plane generates `EndpointSlices` containing lists of IP addresses and ports of all matching pods that pass readiness checks. On every worker node, the `kube-proxy` daemon watches these EndpointSlices and updates the node kernel packet-filtering tables: (1) `iptables mode`: Uses randomized match probability chains (`statistic mode random`) to achieve uniform random distribution; (2) `IPVS mode` (IP Virtual Server): Uses Netfilter hash tables designed for clusters with 10,000+ services, supporting true Round-Robin, Least-Connection, and Source-Hashing algorithms with O(1) performance.',
        whenToUse: [
          'Scaling high-throughput microservices across dozens of pods with minimal packet latency',
          'Tuning large enterprise clusters (5,000+ services) by switching kube-proxy to IPVS mode',
          'Configuring Client-IP Sticky Sessions (`sessionAffinity: ClientIP`) for stateful web sessions',
        ],
        whenNotToUse: [
          'Expecting L7 HTTP path-based routing from kube-proxy (kube-proxy operates strictly at L4 TCP/UDP layer; use Ingress or a Service Mesh for L7)',
          'Relying on legacy Endpoints objects in large clusters (EndpointSlices replaced Endpoints in k8s 1.21+ to eliminate O(N) scaling bottlenecks)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Endpoint Discovery', description: 'EndpointSlice controller tracks ready pod IPs and packages them into chunks of up to 100 endpoints.' },
          { step: 2, title: 'Kube-Proxy Sync', description: 'kube-proxy daemon on each node receives EndpointSlice delta updates via streaming watch.' },
          { step: 3, title: 'Kernel Rule Programming', description: 'kube-proxy programs Netfilter iptables chains or IPVS virtual servers in the Linux kernel.' },
          { step: 4, title: 'Packet NAT Forwarding', description: 'When a packet hits the Service IP, kernel NAT rewrites the destination IP to a chosen pod IP.' },
        ],
        keyMechanisms: [
          { title: 'EndpointSlices vs Endpoints', detail: 'Scalable successor to Endpoints; splits large target pools into chunks of 100 to prevent multi-megabyte API server updates.' },
          { title: 'IPVS vs iptables Performance', detail: 'iptables evaluates rules sequentially O(N); IPVS uses hash tables providing constant O(1) lookup time.' },
          { title: 'SessionAffinity (ClientIP)', detail: 'Directs all requests from a specific client IP to the same backend pod for up to `sessionAffinityConfig.clientIP.timeoutSeconds`.' },
        ],
        productionTips: [
          'Inspect active endpoints for any service using `kubectl get endpointslices -l kubernetes.io/service-name=<svc-name>`.',
          'Switch kube-proxy to IPVS mode if your cluster hosts more than 1,000 services to prevent CPU spikes on worker nodes.',
          'Remember that Kubernetes L4 load balancing distributes connections, not individual HTTP requests over persistent keep-alive connections.',
        ],
        yamlSnippet: `apiVersion: v1
kind: Service
metadata:
  name: sticky-service
spec:
  selector:
    app: session-app
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 10800
  ports:
  - port: 80
    targetPort: 8080`,
        kubectlCommands: [
          'kubectl get endpointslices',
          'kubectl describe endpointslices',
          'kubectl get endpoints',
        ],
        visualizerFocus: 'kube-proxy distributing traffic across EndpointSlice targets via kernel packet translation',
        practiceChallenge: {
          instructions: 'Inspect the EndpointSlices active in your cluster using kubectl get endpointslices.',
          goalCommand: 'kubectl get endpointslices',
          hints: ['Run kubectl get endpointslices', 'Check the ADDRESSES and PORTS columns'],
        },
      },
      {
        id: 'c-pod-to-pod-networking',
        number: '5.5',
        title: 'Pod-to-Pod Communication',
        commandPill: 'kubectl get pods -n kube-system -l k8s-app=kube-dns',
        badge: 'CNI Architecture',
        difficulty: 'Intermediate',
        description: 'Master the fundamental Kubernetes networking model: every pod gets an IP, zero NAT between pods, CNI plugins (Calico, Cilium, Flannel), and cross-node overlay tunnels.',
        subtopics: [
          'Pod IPs',
          'Cluster networking',
          'Service-based communication',
          'CNI overlay networks',
        ],
        whatIsIt: 'The fundamental networking contract of Kubernetes: the "IP-per-Pod" model where every Pod receives a unique, routable IP address and can communicate with every other Pod across any node in the cluster without Network Address Translation (NAT).',
        inSimpleWords: 'Every Pod has its own private telephone number. A pod on computer A can talk directly to a pod on computer B as if they were sitting on the exact same local Wi-Fi router, without complicated port forwarding tricks.',
        realWorldAnalogy: {
          metaphor: 'The Universal Global Postal Service',
          explanation: 'Every house in the country has a unique postal address (ZIP code + street address). You do not need to route a letter through a regional forwarding office or repackage it; you write the destination address on the envelope, drop it in the mailbox, and the postal network routes it directly.',
        },
        explanation: 'Kubernetes imposes three strict networking rules on any cluster implementation: (1) All pods can communicate with all other pods on any node without NAT; (2) All agents on a node (kubelet) can communicate with all pods on that node; (3) The IP that a pod sees for itself is the exact same IP that all other pods see for it. The Container Network Interface (CNI) fulfills this contract using plugins like `Calico`, `Cilium`, `Flannel`, or cloud VPC native plugins (AWS VPC CNI). Plugins encapsulate cross-node packets using overlay protocols (VXLAN, Geneve) or route packets directly via BGP or eBPF.',
        whenToUse: [
          'Understanding how distributed databases and microservices communicate across physical node boundaries',
          'Diagnosing cross-node network partitions, MTU sizing issues, and firewall blocking between worker nodes',
          'Choosing between simple overlay networks (Flannel VXLAN) and high-performance eBPF networks (Cilium)',
        ],
        whenNotToUse: [
          'Attempting to run a Kubernetes cluster without a CNI plugin installed (nodes will remain in `NotReady` status forever)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'CNI Network Attachment', description: 'When kubelet starts a pod, it invokes the CNI plugin binary passing the network namespace.' },
          { step: 2, title: 'Virtual Ethernet Pair Creation', description: 'CNI creates a veth pair: one end in the pod network namespace (`eth0`), the other on the host bridge.' },
          { step: 3, title: 'IPAM Subnet Allocation', description: 'IPAM plugin leases an IP address from the node CIDR block and assigns it to the pod interface.' },
          { step: 4, title: 'Cross-Node Tunnel Routing', description: 'When sending packets to a pod on another node, CNI encapsulates the packet in VXLAN or routes via host gateway.' },
        ],
        keyMechanisms: [
          { title: 'The IP-per-Pod Model', detail: 'Eliminates port conflicts; two pods on the same node can both listen on port 80 simultaneously.' },
          { title: 'Virtual Ethernet Pairs (veth)', detail: 'Linux kernel pipe interconnecting the isolated pod network namespace with the host root namespace.' },
          { title: 'Overlay Networks (VXLAN / Geneve)', detail: 'Encapsulates Layer 2 ethernet frames inside Layer 4 UDP packets to traverse intermediate cloud switches.' },
        ],
        productionTips: [
          'Check your MTU settings! If your cloud network uses 9000-byte Jumbo frames or 1500-byte standard frames, your CNI VXLAN MTU must be 50 bytes smaller (e.g. 1450) to prevent packet fragmentation drops.',
          'Adopt eBPF-based CNI (Cilium) for modern production clusters to bypass iptables completely and gain native cryptographic encryption (WireGuard) with near-line-rate speeds.',
          'Never block UDP port 4789 (VXLAN) or 8472 (Flannel) in your cloud security groups between worker nodes.',
        ],
        yamlSnippet: `# Concept: Cross-Node Pod Communication
# Pod A (10.244.1.5 on Node 1)
#   │
#   ▼ veth pair
# Node 1 Host (encapsulates in VXLAN UDP:4789)
#   │ (Cloud VPC Network)
#   ▼
# Node 2 Host (decapsulates packet)
#   │
#   ▼ veth pair
# Pod B (10.244.2.8 on Node 2)`,
        kubectlCommands: [
          'kubectl get pods -n kube-system',
          'kubectl get pods -o wide',
        ],
        visualizerFocus: 'Virtual ethernet veth pairs and cross-node CNI packet encapsulation',
        practiceChallenge: {
          instructions: 'Verify the health of CoreDNS system pods responsible for in-cluster name resolution.',
          goalCommand: 'kubectl get pods -n kube-system -l k8s-app=kube-dns',
          hints: ['Run kubectl get pods -n kube-system -l k8s-app=kube-dns', 'Confirm all replicas are 1/1 Running'],
        },
      },
    ],
  },

  // =========================================================================
  // CHAPTER 6: Configuration Management
  // =========================================================================
  {
    id: 'ch06-config',
    number: 6,
    title: 'Configuration Management',
    category: 'Configuration & Security',
    concepts: [
      {
        id: 'c-configuration-in-k8s',
        number: '6.1',
        title: 'Configuration in Kubernetes',
        commandPill: 'kubectl explain pod.spec.containers.env',
        badge: '12-Factor Apps',
        difficulty: 'Beginner',
        description: 'Decouple application code from environment-specific configuration: 12-Factor App methodology, configuration immutability, and dynamic injection.',
        subtopics: [
          '12-Factor App principles',
          'Decoupling configuration from code',
          'Dynamic updates',
          'Immutable config',
        ],
        whatIsIt: 'The architectural discipline of separating immutable application code and container images from environment-specific configuration (database URLs, feature toggles, API endpoints), allowing the exact same image to run across dev, staging, and production.',
        inSimpleWords: 'Never bake passwords or server URLs into your application code! You build your application container image once, and Kubernetes injects the right settings when starting it up in development or production.',
        realWorldAnalogy: {
          metaphor: 'A Universal Smartphone Charger',
          explanation: 'You do not buy a different smartphone when traveling from New York to London to Tokyo. The phone is identical (Container Image); you simply plug on a regional travel wall adapter (Configuration) to adapt to local electrical voltage.',
        },
        explanation: 'According to the 12-Factor App methodology, an application configuration is everything that is likely to vary between environments (database connection strings, queue URLs, external API credentials, logging levels). Hardcoding configuration into container images violates cloud-native best practices: it forces you to rebuild and push new container images for every config change and risks leaking sensitive data into public registries. Kubernetes provides native declarative objects (`ConfigMaps` and `Secrets`) that inject configuration into pods at runtime as environment variables, command-line arguments, or mounted configuration files.',
        whenToUse: [
          'Enforcing strict separation of concerns between application developers and infrastructure SREs',
          'Promoting identical, verified container images across testing, staging, and production environments',
          'Updating configuration settings (e.g. logging level from INFO to DEBUG) without rebuilding code',
        ],
        whenNotToUse: [
          'Baking configuration files directly into Dockerfiles using `COPY config.prod.json /app/`',
          'Checking raw unencrypted production database credentials into public Git repositories',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Build Agnostic Container', description: 'Application is compiled reading configuration purely from environment variables or `/etc/config` files.' },
          { step: 2, title: 'Declare Config in K8s', description: 'SRE writes environment-specific ConfigMap and Secret manifests for dev, staging, and prod.' },
          { step: 3, title: 'Runtime Injection', description: 'Kubelet reads ConfigMaps and populates container process environment variables and volume mounts.' },
          { step: 4, title: 'Dynamic Refresh', description: 'When config files mounted as volumes change, kubelet automatically updates the in-pod files without restarts.' },
        ],
        keyMechanisms: [
          { title: 'The 12-Factor Config Principle', detail: 'Strict separation of config from code; config varies across deploys, code does not.' },
          { title: 'Environment Variables vs Volume Mounts', detail: 'Environment variables are static for the life of the process; volume mounts update dynamically on disk.' },
          { title: 'Immutable ConfigMaps & Secrets', detail: 'Setting `immutable: true` prevents accidental edits and significantly reduces API server watch load.' },
        ],
        productionTips: [
          'Prefer mounting configuration files as volumes rather than environment variables if your application supports live config reloading.',
          'Set `immutable: true` on ConfigMaps in production to guarantee that configuration cannot drift silently without a versioned rollout.',
          'Use the Downward API to inject pod metadata (pod name, node IP) into containers without custom discovery code.',
        ],
        yamlSnippet: `# Clean 12-factor configuration injection:
apiVersion: v1
kind: Pod
metadata:
  name: config-demo
spec:
  containers:
  - name: app
    image: my-app:v1.0.0
    env:
    - name: LOG_LEVEL
      value: "info"
    - name: DATABASE_HOST
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: db_host`,
        kubectlCommands: [
          'kubectl explain pod.spec.containers.env',
          'kubectl get configmaps,secrets',
        ],
        visualizerFocus: 'Decoupled configuration injected from ConfigMaps into container runtime',
        practiceChallenge: {
          instructions: 'Inspect the field documentation for container environment variables using kubectl explain.',
          goalCommand: 'kubectl explain pod.spec.containers.env',
          hints: ['Run kubectl explain pod.spec.containers.env', 'Notice name, value, and valueFrom fields'],
        },
      },
      {
        id: 'c-configmaps-configuration',
        number: '6.2',
        title: 'ConfigMaps',
        commandPill: 'kubectl get configmaps',
        badge: 'Key-Value & Files',
        difficulty: 'Beginner',
        description: 'Store non-confidential configuration: key-value pairs, JSON/YAML files, mounting as environment variables, and mounting as volume directories.',
        subtopics: [
          'What is a ConfigMap?',
          'Creating ConfigMaps',
          'Environment variables',
          'Mounting configuration',
        ],
        whatIsIt: 'An API object used to store non-confidential data in key-value pairs or entire configuration files (like `nginx.conf` or `prometheus.yaml`) that pods can consume as environment variables, CLI arguments, or mounted directory volumes.',
        inSimpleWords: 'A settings file stored in Kubernetes. Instead of editing files inside the container, you put your settings in a ConfigMap, and Kubernetes hands those settings to your application when it turns on.',
        realWorldAnalogy: {
          metaphor: 'A Set of Recipe Cards in the Kitchen Drawer',
          explanation: 'The chef (Container) knows how to cook, but consults recipe cards (ConfigMap) for exact measurements of salt, sugar, and baking temperature. You can swap the recipe card for a low-sodium version without replacing the chef.',
        },
        explanation: 'ConfigMaps decouple environment configuration from container images. They can store individual key-value properties (e.g. `DATABASE_TIMEOUT: "30s"`) or entire multi-line configuration files (e.g. `server.conf`). Containers consume ConfigMaps in two primary ways: (1) `Environment Variables`: via `envFrom.configMapRef` (injects all keys as env vars) or `env.valueFrom.configMapKeyRef` (injects a specific key); (2) `Volume Mounts`: mounting the ConfigMap as a volume directory where each key becomes an individual file containing its value. Mounted files are updated automatically by the kubelet when the ConfigMap is modified.',
        whenToUse: [
          'Storing application configuration: ports, external URLs, logging verbosity, feature flags',
          'Mounting entire configuration files into standard containers (e.g. custom `nginx.conf` or `redis.conf`)',
          'Sharing identical configuration parameters across multiple deployments in the same namespace',
        ],
        whenNotToUse: [
          'Storing sensitive credentials, private keys, or passwords (use `Secrets` instead; ConfigMaps are unencrypted plaintext)',
          'Storing binary files larger than 1MB (the maximum object size in etcd is 1.5MB)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'ConfigMap Declaration', description: 'Author defines ConfigMap YAML or creates it via `kubectl create configmap web-config --from-file=app.properties`.' },
          { step: 2, title: 'API Server Persistence', description: 'Kube-apiserver validates data and stores key-value pairs in etcd.' },
          { step: 3, title: 'Pod Volume Mount Projection', description: 'Kubelet creates a symbolic link directory in the container filesystem projecting each key as a file.' },
          { step: 4, title: 'Automatic Synchronization', description: 'If ConfigMap data updates, kubelet updates the atomic symlink directory within ~60 seconds without restarting the pod.' },
        ],
        keyMechanisms: [
          { title: 'The Symlink Atomic Projection', detail: 'Kubelet writes files to a timestamped hidden directory (`..data`) and atomically swaps a symlink, preventing partial read corruption.' },
          { title: 'envFrom vs configMapKeyRef', detail: '`envFrom` automatically pulls all keys in the ConfigMap as env vars; `valueFrom` targets a single explicit key.' },
          { title: 'SubPath Mounts', detail: '`subPath` mounts an individual key as a single file inside an existing container directory without overwriting adjacent files.' },
        ],
        productionTips: [
          'Be aware: changes to ConfigMaps injected as environment variables are NEVER updated in running containers until the pod is restarted!',
          'Use volume mounts if your application supports watching configuration file changes via inotify.',
          'Append a SHA256 config hash annotation to your Deployment template to trigger automated rolling restarts whenever a ConfigMap changes.',
        ],
        yamlSnippet: `apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-config
data:
  default.conf: |
    server {
        listen 80;
        server_name localhost;
        location / {
            root /usr/share/nginx/html;
            index index.html;
        }
    }`,
        kubectlCommands: [
          'kubectl get configmaps',
          'kubectl describe configmap nginx-config',
          'kubectl create configmap app-settings --from-literal=env=prod',
        ],
        visualizerFocus: 'ConfigMap projecting configuration keys as mounted files inside container volume',
        practiceChallenge: {
          instructions: 'View all ConfigMaps available in the active namespace using kubectl get configmaps.',
          goalCommand: 'kubectl get configmaps',
          hints: ['Run kubectl get configmaps or kubectl get cm', 'Notice the DATA column displaying key counts'],
        },
      },
      {
        id: 'c-secrets-configuration',
        number: '6.3',
        title: 'Secrets',
        commandPill: 'kubectl get secrets',
        badge: 'Credentials & TLS',
        difficulty: 'Intermediate',
        description: 'Secure sensitive data: passwords, OAuth tokens, SSH keys, TLS certificates, base64 encoding, Secret types, and encryption-at-rest.',
        subtopics: [
          'What is a Secret?',
          'Sensitive configuration',
          'Environment variables',
          'Mounted secrets',
          'Security considerations',
        ],
        whatIsIt: 'A Kubernetes API object designed specifically to hold confidential data such as passwords, API tokens, TLS certificates, and SSH keys, preventing credentials from being exposed in plaintext manifests or container images.',
        inSimpleWords: 'A digital combination safe for your cluster. Instead of pasting your database password directly into your YAML files, you put it in a Secret, and Kubernetes unlocks it only for the specific containers that have permission to read it.',
        realWorldAnalogy: {
          metaphor: 'A Hotel Safe Box in the Closet',
          explanation: 'Valuables like passports and jewelry are not left on the coffee table (ConfigMap). They are placed in the electronic safe (Secret), accessible only by guests who know the personal PIN code.',
        },
        explanation: 'Kubernetes Secrets operate similarly to ConfigMaps, but with additional security controls: (1) In-transit: data is transmitted over HTTPS; (2) In-pod: mounted secrets are projected into an in-memory `tmpfs` RAM disk so sensitive credentials are never written to physical node disks; (3) Types: specialized types include `kubernetes.io/tls` (certificates and private keys), `kubernetes.io/dockerconfigjson` (registry credentials), and generic `Opaque` (arbitrary key-values). Important security note: in manifest YAML, secret values are merely `base64-encoded`, NOT cryptographically encrypted. Enterprise clusters must enable `EncryptionConfiguration` in the API server to encrypt secrets at rest in etcd using KMS.',
        whenToUse: [
          'Database passwords, API secret keys, Stripe payment tokens, and OAuth credentials',
          'TLS/SSL certificates and private keys used for Ingress HTTPS termination',
          'Docker registry credentials passed via `imagePullSecrets`',
        ],
        whenNotToUse: [
          'Committing base64-encoded Secrets to Git repositories (base64 is trivial to decode: `echo <str> | base64 -d`)',
          'Storing non-sensitive configuration parameters (use ConfigMaps for non-secret data)',
        ],
        lifecycleSteps: [
          { step: 1, title: 'Secret Creation', description: 'Admin generates secret via `kubectl create secret generic db-pass --from-literal=password=secret123`.' },
          { step: 2, title: 'etcd KMS Encryption', description: 'Kube-apiserver encrypts the payload using envelope encryption (AWS KMS / HashiCorp Vault) before writing to etcd.' },
          { step: 3, title: 'tmpfs Memory Mount', description: 'When scheduled, kubelet mounts the secret as a RAM-backed `tmpfs` volume in the container.' },
          { step: 4, title: 'RBAC Enforcement', description: 'Kubernetes RBAC restricts which service accounts and users can read or list secrets.' },
        ],
        keyMechanisms: [
          { title: 'The tmpfs In-Memory Mount', detail: 'Mounted secrets live strictly in RAM; if the node loses power, secret data evaporates from memory immediately.' },
          { title: 'base64 Encoding vs Encryption', detail: 'base64 is an encoding scheme, not encryption; production clusters must enable KMS encryption-at-rest.' },
          { title: 'External Secrets Operator (ESO)', detail: 'Pulls credentials directly from HashiCorp Vault, AWS Secrets Manager, or Azure Key Vault into K8s Secrets.' },
        ],
        productionTips: [
          'Never commit Kubernetes Secret manifests to Git! Use tools like Sealed Secrets, External Secrets Operator, or Mozilla SOPS.',
          'Prefer mounting Secrets as files rather than environment variables, because environment variables can leak into crash dumps and `/proc` inspects.',
          'Always restrict Secret access using RBAC: only pods that strictly require credentials should have ServiceAccounts with Secret read permissions.',
        ],
        yamlSnippet: `apiVersion: v1
kind: Secret
metadata:
  name: database-credentials
type: Opaque
data:
  # Values must be base64-encoded:
  # echo -n "admin" | base64 -> YWRtaW4=
  # echo -n "SuperSecretPass123" | base64 -> U3VwZXJTZWNyZXRQYXNzMTIz
  username: YWRtaW4=
  password: U3VwZXJTZWNyZXRQYXNzMTIz`,
        kubectlCommands: [
          'kubectl get secrets',
          'kubectl describe secret database-credentials',
          'kubectl get secret database-credentials -o jsonpath="{.data.password}" | base64 --decode',
        ],
        visualizerFocus: 'Encrypted Secrets projected into in-memory tmpfs container filesystems',
        practiceChallenge: {
          instructions: 'Inspect all Secrets created in the default namespace using kubectl get secrets.',
          goalCommand: 'kubectl get secrets',
          hints: ['Run kubectl get secrets', 'Check the NAME, TYPE, and DATA columns'],
        },
      },
    ],
  },
];
