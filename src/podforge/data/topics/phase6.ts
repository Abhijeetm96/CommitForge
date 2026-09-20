import type { KubeChapter } from './types';

export const PHASE_6_CHAPTERS: KubeChapter[] = [
  {
    id: 'ch12-observability',
    number: 12,
    title: 'Observability, Health Checks & Monitoring',
    category: 'Operations & SRE',
    concepts: [
      {
        id: 'c-health-probes-readiness-liveness',
        number: '12.1',
        title: 'Container Health Probes: Liveness, Readiness & Startup',
        commandPill: 'kubectl describe pod <name> | grep -A 10 Probes',
        badge: 'Self-Healing',
        difficulty: 'Beginner',
        description: 'Keep applications alive and ensure only ready pods receive traffic using Liveness, Readiness, and Startup Probes.',
        explanation: 'Kubernetes provides three distinct probe types: (1) `Startup Probe`: Checks whether the application has finished its slow boot process. Disables liveness and readiness checks until it succeeds, preventing prematurely killing slow-starting apps (like Java Spring Boot); (2) `Liveness Probe`: Determines if the container needs to be restarted. If liveness fails (e.g. deadlocked thread), the kubelet kills and restarts the container; (3) `Readiness Probe`: Determines if the Pod is ready to accept incoming network traffic. If readiness fails, the endpoints controller removes the Pod IP from Service routing so users never receive 502/503 errors.',
        yamlSnippet: `apiVersion: v1
kind: Pod
metadata:
  name: resilient-service
spec:
  containers:
  - name: api
    image: my-app:v1
    startupProbe:
      httpGet:
        path: /healthz/startup
        port: 8080
      failureThreshold: 30
      periodSeconds: 10
    livenessProbe:
      httpGet:
        path: /healthz/liveness
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 10
    readinessProbe:
      httpGet:
        path: /healthz/readiness
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 5`,
        kubectlCommands: ['kubectl describe pod web-frontend', 'kubectl get pods'],
        visualizerFocus: 'Readiness probe removing traffic from pod endpoints while container re-stabilizes',
        practiceChallenge: {
          instructions: 'Inspect the health probes configured on the web-frontend pod.',
          goalCommand: 'kubectl describe pod web-frontend',
          hints: ['Run kubectl describe pod web-frontend', 'Notice Liveness and Readiness probe configurations'],
        },
      },
      {
        id: 'c-cluster-logging-fluentd',
        number: '12.2',
        title: 'Cluster Logging & Log Streaming Architectures',
        commandPill: 'kubectl logs -l app=frontend-web --tail=50',
        badge: 'Log Analytics',
        difficulty: 'Intermediate',
        description: 'Design production logging: stdout/stderr streaming, JSON formatting, node-level log agents, and centralized log aggregation.',
        explanation: 'Containers should write logs directly to standard out (`stdout`) and standard error (`stderr`). The container runtime (containerd) captures these streams and writes them to `/var/log/pods/<pod_name>` as JSON or CRI-formatted log files on the host node. In production, a node-level logging agent (e.g. Fluentbit, Vector, Promtail) runs as a DaemonSet, tails these host log files, appends Kubernetes metadata (namespace, pod name, container name, labels), and forwards them to a centralized store (Grafana Loki, Elasticsearch, OpenSearch).',
        yamlSnippet: `# Concept: Kubelet Log Pipeline
# Container Process (stdout/stderr)
# -> containerd runtime
# -> /var/log/pods/default_api-xxx/app/0.log (host disk)
# -> Fluentbit DaemonSet tailer
# -> Centralized Elasticsearch / Grafana Loki
apiVersion: v1
kind: Pod
metadata:
  name: json-logger
spec:
  containers:
  - name: app
    image: busybox:1.36
    command: ['sh', '-c', 'while true; do echo "{\\"time\\":\\"$(date -u)\\",\\"level\\":\\"info\\",\\"msg\\":\\"heartbeat\\"}"; sleep 5; done']`,
        kubectlCommands: ['kubectl logs frontend-web-7bc9f-1', 'kubectl logs -l app=frontend-web'],
        visualizerFocus: 'Stdout log stream traveling from container to host disk to central log aggregator',
        practiceChallenge: {
          instructions: 'Stream the logs from the frontend-web container.',
          goalCommand: 'kubectl logs frontend-web-7bc9f-1',
          hints: ['Run kubectl logs frontend-web-7bc9f-1', 'Inspect the emitted HTTP request lines'],
        },
      },
      {
        id: 'c-prometheus-metrics-server',
        number: '12.3',
        title: 'Prometheus & Metrics Server Infrastructure',
        commandPill: 'kubectl top nodes',
        badge: 'Telemetry',
        difficulty: 'Intermediate',
        description: 'Monitor cluster vital signs: the Metrics Server API, Prometheus pull-based scraping, kube-state-metrics, and node-exporter.',
        explanation: 'Kubernetes monitoring utilizes two separate metrics pipelines: (1) Core Metrics Pipeline: `Metrics Server` scrapes resource metrics (CPU and Memory) directly from the kubelet\'s `cAdvisor` and serves them via the `metrics.k8s.io` API. This powers `kubectl top` and the Horizontal Pod Autoscaler (HPA); (2) Complete Monitoring Pipeline: `Prometheus` scrapes application and system metrics at periodic intervals, combining `node-exporter` (OS-level hardware metrics) and `kube-state-metrics` (object health, deployment replicas, pod phase statuses).',
        yamlSnippet: `apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: app-metrics-monitor
  namespace: default
spec:
  selector:
    matchLabels:
      app: frontend-web
  endpoints:
  - port: metrics
    interval: 15s
    path: /metrics`,
        kubectlCommands: ['kubectl top nodes', 'kubectl top pods'],
        visualizerFocus: 'Metrics Server gathering cgroup telemetry from worker node cAdvisors',
        practiceChallenge: {
          instructions: 'View current node resource utilization metrics using kubectl top nodes.',
          goalCommand: 'kubectl top nodes',
          hints: ['Run kubectl top nodes', 'Review CPU and MEMORY percentages'],
        },
      },
    ],
  },
  {
    id: 'ch13-helm',
    number: 13,
    title: 'Helm & Kubernetes Package Management',
    category: 'Packaging & Delivery',
    concepts: [
      {
        id: 'c-helm-charts-anatomy',
        number: '13.1',
        title: 'Helm Architecture & Chart Anatomy',
        commandPill: 'helm list -A',
        badge: 'Package Manager',
        difficulty: 'Intermediate',
        description: 'The package manager for Kubernetes. Dissect Helm Charts: Chart.yaml, values.yaml, templates directory, and chart dependencies.',
        explanation: 'Managing dozens of static raw YAML manifests for different environments (dev, staging, prod) leads to duplication and human error. `Helm` is the de facto package manager for Kubernetes. A `Helm Chart` bundles versioned Kubernetes resources into a parameterized package. The chart contains: `Chart.yaml` (metadata & semantic version), `values.yaml` (default configuration values), and `templates/` (Go-templated YAML files). Users override values at installation time (`helm install -f values-prod.yaml`), producing clean, rendered manifests.',
        yamlSnippet: `# Chart directory structure:
# mychart/
# ├── Chart.yaml       # Chart metadata (name: web, version: 1.0.0)
# ├── values.yaml      # Default variables (replicaCount: 2, image: nginx)
# └── templates/       # Parameterized Kubernetes manifests
#     ├── deployment.yaml
#     ├── service.yaml
#     └── _helpers.tpl # Reusable template named helpers`,
        kubectlCommands: ['kubectl get deployments', 'kubectl get svc'],
        visualizerFocus: 'Helm engine merging values.yaml with templates to produce rendered cluster manifests',
        practiceChallenge: {
          instructions: 'Check what deployments are managed in the default namespace.',
          goalCommand: 'kubectl get deployments',
          hints: ['Run kubectl get deployments', 'Notice name, replicas, and age'],
        },
      },
      {
        id: 'c-helm-templating-pipelines',
        number: '13.2',
        title: 'Helm Templating, Functions & Pipelines',
        commandPill: 'helm template . -f values.yaml',
        badge: 'Template Engine',
        difficulty: 'Advanced',
        description: 'Master Go templates in Helm: template pipelines, Sprig functions, conditionals (if/else), loops (range), and named template helpers.',
        explanation: 'Helm uses Go templates augmented by over 100 Sprig functions. Templates use double curly braces `{{ .Values.image.repository }}`. Pipelines pass values through functions using the pipe `|` operator (e.g. `{{ .Values.app | quote | lower }}`). Critical functions include `toYaml` (serializing arbitrary YAML objects), `indent` / `nindent` (formatting white space correctly), and flow control (`{{ if .Values.ingress.enabled }} ... {{ end }}`). Named templates defined in `_helpers.tpl` provide standardized labeling across enterprise charts.',
        yamlSnippet: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "mychart.fullname" . }}
  labels:
    {{- include "mychart.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount | default 1 }}
  selector:
    matchLabels:
      app.kubernetes.io/name: {{ include "mychart.name" . }}
  template:
    spec:
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"`,
        kubectlCommands: ['kubectl get all', 'kubectl get deployments'],
        visualizerFocus: 'Template pipeline transforming parameter values into strictly indented YAML syntax',
        practiceChallenge: {
          instructions: 'Verify the active resources rendered in the cluster.',
          goalCommand: 'kubectl get all',
          hints: ['Run kubectl get all'],
        },
      },
      {
        id: 'c-helm-lifecycle-releases',
        number: '13.3',
        title: 'Helm Releases & Lifecycle Rollbacks',
        commandPill: 'helm rollback <release> 1',
        badge: 'Release Ops',
        difficulty: 'Intermediate',
        description: 'Track deployed release versions, manage upgrades with atomic flags, and perform instant zero-downtime rollbacks.',
        explanation: 'When Helm installs a chart, it creates a `Release`. Helm stores release history inside Kubernetes Secrets in the target namespace (`sh.helm.release.v1.<name>.v1`). Upgrades (`helm upgrade --install`) compare the new rendered manifest with the previous release version, generating a 3-way patch. If an upgrade fails (e.g. pods crash during readiness checks), running with `--atomic` triggers an automatic rollback. You can also roll back manually to any previous revision with `helm rollback <release> <revision>`.',
        yamlSnippet: `# Commands for Helm Release Management:
# helm install my-app ./mychart --namespace production --create-namespace
# helm upgrade my-app ./mychart --set replicaCount=5 --atomic --timeout 3m
# helm history my-app
# helm rollback my-app 2`,
        kubectlCommands: ['kubectl get secrets -l owner=helm', 'kubectl get deployments'],
        visualizerFocus: 'Helm storing versioned release revision records inside cluster Secrets',
        practiceChallenge: {
          instructions: 'Check for any Kubernetes secrets created in the default namespace.',
          goalCommand: 'kubectl get secrets',
          hints: ['Run kubectl get secrets'],
        },
      },
    ],
  },
  {
    id: 'ch14-gitops',
    number: 14,
    title: 'GitOps & Progressive Delivery',
    category: 'Packaging & Delivery',
    concepts: [
      {
        id: 'c-gitops-principles-argocd',
        number: '14.1',
        title: 'GitOps Principles & ArgoCD Architecture',
        commandPill: 'kubectl get applications -A',
        badge: 'GitOps Standard',
        difficulty: 'Intermediate',
        description: 'Git as the single source of truth. Pull-based reconciliation, automated sync policies, and drift detection with ArgoCD.',
        explanation: 'GitOps is an operational model where your entire system desired state is stored declaratively in a Git repository. Rather than push-based CI scripts running `kubectl apply` with broad cluster credentials, an in-cluster GitOps operator (like `ArgoCD` or `Flux`) continuously compares the live cluster state against the Git commit history. If drift occurs (e.g. someone manually edits a deployment via kubectl), the GitOps operator detects the discrepancy and automatically resets the cluster back to the Git state ("self-healing").',
        yamlSnippet: `apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: podforge-web
  namespace: argocd
spec:
  project: default
  source:
    repoURL: 'https://github.com/org/podforge-manifests.git'
    targetRevision: HEAD
    path: 'environments/production'
  destination:
    server: 'https://kubernetes.default.svc'
    namespace: default
  syncPolicy:
    automated:
      prune: true     # Delete resources removed from Git
      selfHeal: true  # Revert out-of-band manual changes`,
        kubectlCommands: ['kubectl get pods -A', 'kubectl get deployments'],
        visualizerFocus: 'In-cluster ArgoCD controller synchronizing Git repository commits to cluster state',
        practiceChallenge: {
          instructions: 'List the active deployments to verify desired replica configurations.',
          goalCommand: 'kubectl get deployments',
          hints: ['Run kubectl get deployments', 'Check UP-TO-DATE and AVAILABLE columns'],
        },
      },
      {
        id: 'c-progressive-delivery-canary',
        number: '14.2',
        title: 'Progressive Delivery: Canary & Blue/Green with Argo Rollouts',
        commandPill: 'kubectl get rollouts',
        badge: 'Advanced Rollouts',
        difficulty: 'Advanced',
        description: 'Modern zero-downtime deployment strategies beyond basic RollingUpdates: automated Canary analysis, metric gates, and Blue/Green.',
        explanation: 'Standard Kubernetes RollingUpdates cannot perform metric-based validation or progressive traffic shifting (e.g. 5% -> 20% -> 50% -> 100%). `Argo Rollouts` replaces the Deployment controller with a `Rollout` CRD. It integrates with Service Meshes and Ingresses to gradually shift user traffic. During canary steps, it runs `AnalysisTemplates` that query Prometheus for error rates and latency. If error rates exceed 0.5%, the rollout automatically aborts and instantly rolls back traffic, protecting 95% of users from encountering bugs.',
        yamlSnippet: `apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: payment-rollout
spec:
  replicas: 5
  strategy:
    canary:
      steps:
      - setWeight: 10 # Send 10% traffic to new version
      - pause: { duration: 10m }
      - analysis:
          templates:
          - templateName: prometheus-success-rate
      - setWeight: 50
      - pause: { duration: 15m }
  template:
    spec:
      containers:
      - name: payment
        image: payment-service:v2.1.0`,
        kubectlCommands: ['kubectl get deployments', 'kubectl describe deployment frontend-web'],
        visualizerFocus: 'Automated canary progression shifting traffic weight while analyzing telemetry',
        practiceChallenge: {
          instructions: 'Inspect the deployment strategy of frontend-web.',
          goalCommand: 'kubectl describe deployment frontend-web',
          hints: ['Run kubectl describe deployment frontend-web', 'Examine the RollingUpdateStrategy: 25% max unavailable, 25% max surge'],
        },
      },
    ],
  },
  {
    id: 'ch15-operators',
    number: 15,
    title: 'Custom Resources & The Operator Pattern',
    category: 'Expert & Extensibility',
    concepts: [
      {
        id: 'c-crd-custom-resources',
        number: '15.1',
        title: 'Custom Resource Definitions (CRDs)',
        commandPill: 'kubectl get crd',
        badge: 'API Extensibility',
        difficulty: 'Advanced',
        description: 'Extend the Kubernetes API with your own domain-specific resources using OpenAPI v3 schemas, validation, and subresources.',
        explanation: 'Kubernetes is fundamentally an extensible API platform. A `CustomResourceDefinition` (CRD) lets you register new API types (e.g. `PostgreSQLCluster`, `KafkaTopic`, `VirtualService`) alongside native types like Pods and Services. Once registered, users can create, get, and delete these custom resources using standard `kubectl`. CRDs use OpenAPI v3 JSON schemas to validate incoming YAML specs, define printer columns for `kubectl get`, and enable `/status` and `/scale` subresources.',
        yamlSnippet: `apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: databases.storage.podforge.io
spec:
  group: storage.podforge.io
  versions:
  - name: v1alpha1
    served: true
    storage: true
    schema:
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            required: ["engine", "storageSize"]
            properties:
              engine: { type: string, enum: ["postgres", "mysql"] }
              storageSize: { type: string }
  scope: Namespaced
  names:
    plural: databases
    singular: database
    kind: Database
    shortNames: ["db"]`,
        kubectlCommands: ['kubectl get crd', 'kubectl describe crd'],
        visualizerFocus: 'Kube-apiserver dynamically registering new REST endpoints for Custom Resources',
        practiceChallenge: {
          instructions: 'List all CustomResourceDefinitions currently registered in the cluster.',
          goalCommand: 'kubectl get crd',
          hints: ['Run kubectl get crd or kubectl get customresourcedefinitions'],
        },
      },
      {
        id: 'c-operator-pattern-controllers',
        number: '15.2',
        title: 'The Operator Pattern & Custom Controllers',
        commandPill: 'kubectl logs -n operators -l app=operator',
        badge: 'Cloud Automation',
        difficulty: 'Expert',
        description: 'Encode human operational knowledge into software: the Operator pattern, controller-runtime, reconcile loops, and Kubebuilder.',
        explanation: 'A CRD defines data; an `Operator` brings it to life. The Operator pattern combines Custom Resources with a Custom Controller. The controller runs a continuous Reconcile loop written in Go/Rust/Python using `controller-runtime`. When a user creates a `Database` resource, the operator catches the event, provisions StatefulSets, creates PVCs, executes database backups, configures replication, and performs failover automatically—automating tasks previously requiring human DBAs.',
        yamlSnippet: `# Go Controller Reconcile Loop Signature:
# func (r *DatabaseReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
#   // 1. Fetch current Database custom resource from API
#   // 2. Compare desired state (spec) vs actual running StatefulSet
#   // 3. Create, update, or self-heal DB pods
#   // 4. Update status.phase = "Ready"
#   return ctrl.Result{RequeueAfter: time.Minute * 5}, nil
# }`,
        kubectlCommands: ['kubectl get pods -A', 'kubectl get deployments'],
        visualizerFocus: 'Operator controller watching CRD events and orchestrating multi-step stateful workflows',
        practiceChallenge: {
          instructions: 'View all pods across all namespaces to observe system and application operators.',
          goalCommand: 'kubectl get pods -A',
          hints: ['Run kubectl get pods -A or kubectl get pods --all-namespaces'],
        },
      },
    ],
  },
  {
    id: 'ch16-cluster-admin',
    number: 16,
    title: 'Cluster Administration, Upgrades & Disaster Recovery',
    category: 'Expert & Extensibility',
    concepts: [
      {
        id: 'c-node-maintenance-cordon-drain',
        number: '16.1',
        title: 'Node Maintenance: Cordon, Drain & Uncordon',
        commandPill: 'kubectl drain <node> --ignore-daemonsets',
        badge: 'CKA Core',
        difficulty: 'Intermediate',
        description: 'Safely evacuate workloads from nodes for kernel patching, hardware maintenance, or OS upgrades without service outages.',
        explanation: 'When performing node maintenance (OS patches, kernel upgrades, hardware repair), workloads must be cleanly evacuated. (1) `kubectl cordon <node>` marks the node as `SchedulingDisabled`, preventing new pods from being placed there while leaving existing pods running; (2) `kubectl drain <node> --ignore-daemonsets` safely evicts all running pods via the Eviction API, respecting PodDisruptionBudgets and triggering replica replacements on healthy nodes; (3) Once maintenance is done, `kubectl uncordon <node>` restores the node to service.',
        yamlSnippet: `# Safe Node Evacuation Procedure:
# Step 1: Mark node unschedulable
# $ kubectl cordon worker-node-1
#
# Step 2: Evict running workloads gracefully
# $ kubectl drain worker-node-1 --ignore-daemonsets --delete-emptydir-data
#
# Step 3: Perform host upgrade & reboot
#
# Step 4: Re-enable scheduling
# $ kubectl uncordon worker-node-1`,
        kubectlCommands: ['kubectl cordon worker-node-1', 'kubectl drain worker-node-1', 'kubectl uncordon worker-node-1'],
        visualizerFocus: 'Workloads smoothly migrating away from cordoned node to healthy worker nodes',
        practiceChallenge: {
          instructions: 'Cordon worker-node-1 to disable any new pods from being scheduled onto it.',
          goalCommand: 'kubectl cordon worker-node-1',
          hints: ['Run kubectl cordon worker-node-1', 'Verify with kubectl get nodes that it shows SchedulingDisabled'],
        },
      },
      {
        id: 'c-etcd-backup-restore',
        number: '16.2',
        title: 'etcd Disaster Recovery: Backup & Point-in-Time Restore',
        commandPill: 'etcdctl snapshot save snapshot.db',
        badge: 'Disaster Recovery',
        difficulty: 'Expert',
        description: 'The single point of truth in Kubernetes. Create consistent point-in-time etcd database snapshots and execute cluster restores.',
        explanation: '`etcd` stores the complete state of every resource in the Kubernetes cluster. If etcd is corrupted or destroyed, the cluster is lost. High-availability etcd runs an odd number of members (3 or 5) using the Raft consensus algorithm, tolerating `(N-1)/2` node failures. SREs take recurring automated snapshots using `etcdctl snapshot save`. During disaster recovery, `etcdctl snapshot restore` reconstructs the datadir, allowing the apiserver to resume operation with zero lost configurations.',
        yamlSnippet: `# etcd Backup & Restore Commands:
# Take Snapshot:
# $ ETCDCTL_API=3 etcdctl --endpoints=https://127.0.0.1:2379 \\
#     --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
#     --cert=/etc/kubernetes/pki/etcd/server.crt \\
#     --key=/etc/kubernetes/pki/etcd/server.key \\
#     snapshot save /var/backups/etcd-snapshot.db
#
# Restore Snapshot:
# $ ETCDCTL_API=3 etcdctl snapshot restore /var/backups/etcd-snapshot.db \\
#     --data-dir=/var/lib/etcd-restored`,
        kubectlCommands: ['kubectl get nodes', 'kubectl get pods -n kube-system'],
        visualizerFocus: 'etcd Raft distributed log snapshotting full cluster state to encrypted backup storage',
        practiceChallenge: {
          instructions: 'Inspect the cluster health and active nodes to confirm control-plane status.',
          goalCommand: 'kubectl get nodes',
          hints: ['Run kubectl get nodes', 'Verify all nodes are in Ready status'],
        },
      },
      {
        id: 'c-kubeadm-cluster-upgrades',
        number: '16.3',
        title: 'Upgrading Clusters Step-by-Step with kubeadm',
        commandPill: 'kubeadm upgrade plan',
        badge: 'CKA Upgrades',
        difficulty: 'Expert',
        description: 'Perform zero-downtime version upgrades of control-plane and worker nodes conforming to the official Kubernetes upgrade skew policy.',
        explanation: 'Kubernetes follows strict version skew policies: you can never skip minor versions (e.g. from v1.29 directly to v1.31; you must step through v1.30). The standard `kubeadm` upgrade procedure follows an exact sequence: (1) Upgrade kubeadm on the first control plane node; (2) Run `kubeadm upgrade plan` to verify dependencies; (3) Run `kubeadm upgrade apply v1.31.0` (upgrades apiserver, controller-manager, scheduler, and CoreDNS); (4) Drain the node, upgrade kubelet/kubectl, and uncordon; (5) Upgrade secondary control planes, then upgrade worker nodes one by one.',
        yamlSnippet: `# Kubeadm Upgrade Sequence:
# 1. Upgrade kubeadm tool
#    $ apt-mark unhold kubeadm && apt-get install -y kubeadm=1.31.0-00
# 2. Plan and apply control-plane upgrade
#    $ kubeadm upgrade plan
#    $ sudo kubeadm upgrade apply v1.31.0
# 3. Upgrade local kubelet and kubectl
#    $ apt-mark unhold kubelet kubectl && apt-get install -y kubelet=1.31.0-00 kubectl=1.31.0-00
#    $ sudo systemctl daemon-reload && sudo systemctl restart kubelet`,
        kubectlCommands: ['kubectl get nodes', 'kubectl version --output=yaml'],
        visualizerFocus: 'Stepwise upgrade progression from control plane nodes to worker nodes',
        practiceChallenge: {
          instructions: 'Query the Kubernetes version of your active cluster control plane.',
          goalCommand: 'kubectl version --output=yaml',
          hints: ['Run kubectl version --output=yaml or kubectl version', 'Notice the serverVersion gitVersion tag'],
        },
      },
      {
        id: 'c-cluster-troubleshooting-triage',
        number: '16.4',
        title: 'Mastering Cluster Breakdown Triage & Certificate Renewal',
        commandPill: 'kubeadm certs check-expiration',
        badge: 'Master Triage',
        difficulty: 'Expert',
        description: 'Triage severe production failures: expired cluster TLS certificates, apiserver crashloops, kubelet systemd failures, and CNI partitioning.',
        explanation: 'When a Kubernetes cluster experiences a catastrophic outage, senior SREs follow a structured triage tree: (1) Check kubelet daemon: `systemctl status kubelet` and `journalctl -u kubelet -e`; (2) Check control plane certificates: `kubeadm certs check-expiration` (expired certs cause silent apiserver communication failure); (3) Check static pod manifests in `/etc/kubernetes/manifests/` (if apiserver or etcd static pod crashes, check logs via `crictl ps` and `crictl logs`); (4) Verify CNI routing and DNS resolution.',
        yamlSnippet: `# Production Triage Toolkit:
# Check certificate validity (valid for 1 year by default):
# $ kubeadm certs check-expiration
#
# Renew all certificates:
# $ sudo kubeadm certs renew all
#
# Inspect low-level container runtime when apiserver is down:
# $ sudo crictl ps -a
# $ sudo crictl logs <container_id>
#
# Check systemd kubelet journal:
# $ sudo journalctl -u kubelet -n 100 --no-pager`,
        kubectlCommands: ['kubectl get nodes', 'kubectl get events --sort-by=.metadata.creationTimestamp'],
        visualizerFocus: 'Triage flowchart isolating issues between kubelet, TLS certificates, and apiserver',
        practiceChallenge: {
          instructions: 'Query the latest events recorded across the cluster sorted by creation timestamp.',
          goalCommand: 'kubectl get events',
          hints: ['Run kubectl get events', 'Examine Reason and Message columns for warnings'],
        },
      },
    ],
  },
];
