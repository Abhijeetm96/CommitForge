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
      },
    ],
  },
];
