import type { KubePitfall, KubeQuizQuestion, KubeYamlFieldExplanation } from './types';
import type { ConceptEnrichment } from './enrichment_part1';

export const PART_5_ENRICHMENT: Record<string, ConceptEnrichment> = {
  'c-cicd-integration': {
    commonPitfalls: [
      {
        mistake: 'Embedding long-lived cluster administrator credentials inside external CI/CD runners.',
        whyItHappens: 'If the CI runner is compromised, attackers gain cluster-admin privileges.',
        fix: 'Use OpenID Connect (OIDC) federation (e.g. GitHub Actions OIDC to AWS IAM / GKE Workload Identity) or switch to GitOps pull-based deployments.',
      },
      {
        mistake: 'Triggering deployments from CI without checking rollout completion (`kubectl rollout status`).',
        whyItHappens: 'CI marks the pipeline green while the pods are actually failing in CrashLoopBackOff in the cluster.',
        fix: 'Always append `kubectl rollout status deployment/<name> --timeout=5m` to your deployment scripts.',
      },
    ],
    quizQuestion: {
      question: 'Why is a pull-based deployment model (GitOps) considered more secure than a push-based CI/CD pipeline for Kubernetes?',
      options: [
        { label: 'A', text: 'Because GitOps does not use YAML.', isCorrect: false, explanation: 'GitOps relies heavily on YAML.' },
        { label: 'B', text: 'The cluster runs an internal agent (like ArgoCD) that pulls changes from Git, eliminating the need to expose cluster API credentials to external CI runners.', isCorrect: true, explanation: 'Correct! No inbound firewall ports or external admin credentials are required.' },
        { label: 'C', text: 'GitOps makes container images smaller.', isCorrect: false, explanation: 'Image size is unaffected.' },
        { label: 'D', text: 'Push-based CI/CD cannot deploy to staging environments.', isCorrect: false, explanation: 'Both can deploy to staging.' },
      ],
    },
    yamlExplanation: [
      { field: 'strategy.type: RollingUpdate', explanation: 'Allows CI/CD pipelines to apply new image tags with zero downtime.' },
    ],
    referenceCheatSheet: [
      'kubectl rollout status deployment/<name> : CI validation command that blocks until the rollout completes or fails',
      'kubectl set image deployment/<name> web=image:tag : Update container image directly via CLI',
    ],
    solutionExplanation: 'Automated CI/CD pipelines connect code repositories to clusters with automated testing and zero-downtime rollouts.',
  },

  'c-gitops-workflow': {
    commonPitfalls: [
      {
        mistake: 'Modifying cluster state imperatively via `kubectl edit` in a GitOps-managed cluster.',
        whyItHappens: 'Emergency hotfixing directly in the cluster.',
        fix: 'The GitOps controller (ArgoCD/Flux) detects drift and immediately overwrites manual cluster edits back to Git state! All changes MUST go through Git.',
      },
      {
        mistake: 'Storing plaintext Secrets directly in Git.',
        whyItHappens: 'Attempting to declare all resources in Git without a secrets encryption strategy.',
        fix: 'Use SealedSecrets, Mozilla SOPS, or External Secrets Operator to decrypt secrets inside the cluster securely.',
      },
    ],
    quizQuestion: {
      question: 'What is the core principle of GitOps for Kubernetes cluster operations?',
      options: [
        { label: 'A', text: 'All cluster changes are done manually using keyboard shortcuts.', isCorrect: false, explanation: 'GitOps is automated.' },
        { label: 'B', text: 'Git is the single source of truth for desired infrastructure state, and an in-cluster reconciliation agent automatically drives actual state to match Git.', isCorrect: true, explanation: 'Correct! Any drift between the Git repository and the running cluster is continuously reconciled.' },
        { label: 'C', text: 'Every developer must be a cluster administrator.', isCorrect: false, explanation: 'GitOps removes direct cluster access from developers.' },
        { label: 'D', text: 'Only single-node clusters can use GitOps.', isCorrect: false, explanation: 'GitOps scales to thousands of clusters.' },
      ],
    },
    yamlExplanation: [
      { field: 'apiVersion: argoproj.io/v1alpha1\nkind: Application', explanation: 'ArgoCD custom resource mapping a Git repo path to a destination cluster namespace.' },
      { field: 'syncPolicy.automated.prune: true', explanation: 'Automatically deletes resources in the cluster if their manifests are deleted from Git.' },
    ],
    referenceCheatSheet: [
      'argocd app get <app> : Check Git sync status and cluster health',
      'argocd app sync <app> : Trigger an immediate reconciliation between Git and the cluster',
      'flux get kustomizations : View Flux GitOps synchronization status',
    ],
    solutionExplanation: 'GitOps provides auditable, versioned, declarative operations where Git pull requests drive automated cluster delivery.',
  },

  'c-helm-charts-packaging': {
    commonPitfalls: [
      {
        mistake: 'Writing raw copy-paste YAML manifests for multiple environments instead of using Helm values.',
        whyItHappens: 'Duplicating manifests causes config drift between dev, staging, and prod.',
        fix: 'Use a single parameterized Helm chart parameterized by `values-dev.yaml` and `values-prod.yaml`.',
      },
      {
        mistake: 'Forgetting to run `helm lint` and `helm template` before deploying to production.',
        whyItHappens: 'YAML indentation errors in Go templates cause deployments to fail at runtime.',
        fix: 'Always validate charts locally with `helm lint` and render templates with `helm template` in CI.',
      },
    ],
    quizQuestion: {
      question: 'What file in a Helm chart contains the default configurable variables that are injected into the Go templates?',
      options: [
        { label: 'A', text: '`Chart.yaml`', isCorrect: false, explanation: 'Chart.yaml contains metadata like chart name and version.' },
        { label: 'B', text: '`values.yaml`', isCorrect: true, explanation: 'Correct! values.yaml specifies the default parameters used to render templates in the `templates/` directory.' },
        { label: 'C', text: '`Dockerfile`', isCorrect: false, explanation: 'Dockerfile builds container images, not Helm templates.' },
        { label: 'D', text: '`bootstrap.sh`', isCorrect: false, explanation: 'Shell scripts are not standard Helm components.' },
      ],
    },
    yamlExplanation: [
      { field: 'image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"', explanation: 'Go templating syntax dynamically evaluated using parameters from values.yaml.' },
    ],
    referenceCheatSheet: [
      'helm list -A : View all installed Helm release packages across all namespaces',
      'helm upgrade --install <name> ./chart -f values.yaml : Idempotently install or upgrade a release',
      'helm rollback <name> 1 : Roll back a release to revision 1 in one command',
    ],
    solutionExplanation: 'Helm is the package manager for Kubernetes, packaging complex distributed systems into versioned, parameterized charts.',
  },

  'c-canary-deployments': {
    commonPitfalls: [
      {
        mistake: 'Trying to do fine-grained traffic splitting (e.g. 5% canary) using basic Kubernetes Services.',
        whyItHappens: 'Standard Services load balance purely based on pod counts (e.g. 1 canary pod out of 10 total = 10% traffic minimum). You cannot do 1% without 100 pods!',
        fix: 'Use an Ingress Controller (e.g. NGINX Canary annotations), a Service Mesh (Istio), or Argo Rollouts.',
      },
      {
        mistake: 'Promoting a canary release automatically without verifying error rate metrics.',
        whyItHappens: 'Rolling out broken code without automated metric analysis.',
        fix: 'Use automated canary analysis (Argo Rollouts with Prometheus queries) to abort rollouts if HTTP 5xx errors increase.',
      },
    ],
    quizQuestion: {
      question: 'What is the primary benefit of a Canary deployment strategy over a standard RollingUpdate?',
      options: [
        { label: 'A', text: 'It uses zero RAM.', isCorrect: false, explanation: 'Both run pods consuming RAM.' },
        { label: 'B', text: 'It exposes the new version to a small, controlled percentage of real production traffic (e.g. 5%), testing for regressions before full deployment.', isCorrect: true, explanation: 'Correct! Canary testing limits the blast radius of unexpected bugs to a tiny fraction of users.' },
        { label: 'C', text: 'It guarantees the database is never modified.', isCorrect: false, explanation: 'Canary pods still connect to production databases.' },
        { label: 'D', text: 'It eliminates the need for unit tests.', isCorrect: false, explanation: 'Unit testing is still mandatory.' },
      ],
    },
    yamlExplanation: [
      { field: 'nginx.ingress.kubernetes.io/canary: "true"', explanation: 'Enables canary routing on the NGINX Ingress controller.' },
      { field: 'nginx.ingress.kubernetes.io/canary-weight: "10"', explanation: 'Directs exactly 10% of incoming production requests to the canary backend service.' },
    ],
    referenceCheatSheet: [
      'kubectl argo rollouts get rollout <name> --watch : Watch live canary step promotions',
      'kubectl argo rollouts abort <name> : Instantly abort a failed canary and restore 100% traffic to stable',
    ],
    solutionExplanation: 'Canary deployments minimize release blast radiuses by directing small percentages of live traffic to new versions.',
  },

  'c-blue-green-deployments': {
    commonPitfalls: [
      {
        mistake: 'Underestimating the 2x infrastructure cost during the Blue-Green deployment window.',
        whyItHappens: 'Both Blue (current) and Green (new) environments run at 100% capacity simultaneously.',
        fix: 'Ensure the cluster has enough spare node capacity or auto-scaling head-room before initiating Blue-Green.',
      },
      {
        mistake: 'Database schema incompatibility between Blue and Green versions.',
        whyItHappens: 'Green applies destructive database migrations that break Blue before the cutover occurs.',
        fix: 'Always use the Expand-Contract database pattern: ensure schema changes are backwards-compatible with both versions.',
      },
    ],
    quizQuestion: {
      question: 'How is the final cutover from the "Blue" (v1) environment to the "Green" (v2) environment executed in Kubernetes?',
      options: [
        { label: 'A', text: 'By updating the Service label selector (`spec.selector`) to point from `version: blue` to `version: green`.', isCorrect: true, explanation: 'Correct! Patching the Service selector instantly switches traffic from the old replica set to the new one with zero downtime.' },
        { label: 'B', text: 'By physically unplugging network cables in the data center.', isCorrect: false, explanation: 'Not a cloud-native practice.' },
        { label: 'C', text: 'By rebooting all worker nodes.', isCorrect: false, explanation: 'Node reboots cause massive disruption.' },
        { label: 'D', text: 'By renaming the database tables.', isCorrect: false, explanation: 'Database renames break existing queries.' },
      ],
    },
    yamlExplanation: [
      { field: 'spec.selector.version: "green"', explanation: 'The Service label selector that routes incoming traffic to green pods once validation passes.' },
    ],
    referenceCheatSheet: [
      'kubectl patch service web-svc -p \'{"spec":{"selector":{"version":"green"}}}\' : Instantly cut over traffic to Green',
      'kubectl patch service web-svc -p \'{"spec":{"selector":{"version":"blue"}}}\' : Instant instant rollback to Blue',
    ],
    solutionExplanation: 'Blue-Green deployments maintain two identical environments, switching production traffic instantly via Service selectors.',
  },

  'c-rolling-updates-strategy': {
    commonPitfalls: [
      {
        mistake: 'Setting `maxUnavailable: 0` without setting `maxSurge: 1+` when the cluster is at 100% node capacity.',
        whyItHappens: 'The rollout deadlocks because the cluster cannot schedule the surge pod, and `maxUnavailable: 0` prevents killing an old pod.',
        fix: 'Ensure your cluster has spare capacity or allow `maxUnavailable: 1` if surge nodes cannot be provisioned.',
      },
      {
        mistake: 'Missing readiness probes causing traffic to be sent to pods before they finish warming up.',
        whyItHappens: 'Kubernetes marks containers ready as soon as the process starts if probes are omitted.',
        fix: 'Always define readiness probes so the rollout pauses until each new pod is genuinely ready to handle requests.',
      },
    ],
    quizQuestion: {
      question: 'What do `maxSurge` and `maxUnavailable` control during a Kubernetes Deployment rolling update?',
      options: [
        { label: 'A', text: 'The maximum temperature of the CPU chip.', isCorrect: false, explanation: 'Hardware temperature is not controlled by deployments.' },
        { label: 'B', text: '`maxSurge` defines how many extra Pods can be created above desired replicas; `maxUnavailable` defines how many Pods can be offline during the update.', isCorrect: true, explanation: 'Correct! These two parameters strictly govern the rate and availability limits of the rolling replacement.' },
        { label: 'C', text: 'The maximum number of database queries per second.', isCorrect: false, explanation: 'Database queries are application logic.' },
        { label: 'D', text: 'The number of days before a backup is expired.', isCorrect: false, explanation: 'Backups are managed by storage tools.' },
      ],
    },
    yamlExplanation: [
      { field: 'rollingUpdate.maxSurge: 25%', explanation: 'Allows up to 25% additional pods during the rollout to prevent capacity dips.' },
      { field: 'rollingUpdate.maxUnavailable: 0', explanation: 'Guarantees that 100% of desired pods remain available throughout the upgrade.' },
    ],
    referenceCheatSheet: [
      'kubectl rollout status deployment/<name> : Follow the step-by-step pod replacement progress',
      'kubectl rollout pause deployment/<name> : Pause rolling update to inspect intermediate behavior',
      'kubectl rollout resume deployment/<name> : Resume a paused rollout',
    ],
    solutionExplanation: 'Rolling updates replace old pods with new pods incrementally, ensuring continuous service availability.',
  },

  'c-rollbacks-recovery': {
    commonPitfalls: [
      {
        mistake: 'Attempting a rollback after database migrations have already executed non-reversible schema deletions (e.g. dropped columns).',
        whyItHappens: 'Application code is easily rolled back, but database schema changes are often not backwards compatible.',
        fix: 'Always follow the Expand-Contract database pattern: never drop old columns until the old application version is decommissioned.',
      },
      {
        mistake: 'Setting `spec.revisionHistoryLimit: 0`.',
        whyItHappens: 'If revision history limit is zero, old ReplicaSets are deleted immediately, making `kubectl rollout undo` impossible!',
        fix: 'Keep `revisionHistoryLimit: 10` to maintain a robust rollback safety net.',
      },
    ],
    quizQuestion: {
      question: 'Which kubectl command rolls back a Deployment to its immediately preceding revision in one step?',
      options: [
        { label: 'A', text: '`kubectl rollback --force`', isCorrect: false, explanation: 'Not a valid kubectl command.' },
        { label: 'B', text: '`kubectl rollout undo deployment/<name>`', isCorrect: true, explanation: 'Correct! `rollout undo` triggers a reverse rolling update back to the previous ReplicaSet template.' },
        { label: 'C', text: '`kubectl delete deployment --all`', isCorrect: false, explanation: 'This destroys all deployments permanently!' },
        { label: 'D', text: '`kubectl revert --git`', isCorrect: false, explanation: 'Git commands are not kubectl subcommands.' },
      ],
    },
    yamlExplanation: [
      { field: 'spec.revisionHistoryLimit: 10', explanation: 'Specifies that 10 historical ReplicaSet blueprints are preserved for rapid undo operations.' },
    ],
    referenceCheatSheet: [
      'kubectl rollout undo deployment/<name> : Instantly undo the last rollout',
      'kubectl rollout history deployment/<name> : View all historical revisions and change causes',
      'kubectl rollout undo deployment/<name> --to-revision=3 : Roll back specifically to revision 3',
    ],
    solutionExplanation: 'Automated rollbacks provide immediate disaster recovery when new releases fail health checks or trigger error spikes.',
  },

  'c-k8s-controllers-custom': {
    commonPitfalls: [
      {
        mistake: 'Writing controller reconciliation loops that are not idempotent.',
        whyItHappens: 'Kubernetes reconciliation loops can trigger multiple times for the same event; non-idempotent loops duplicate resources.',
        fix: 'Always ensure your `Reconcile()` function is idempotent: running it 10 times should produce the exact same outcome as running it once.',
      },
      {
        mistake: 'Querying external APIs synchronously in the main controller loop, blocking the worker thread.',
        whyItHappens: 'Slow external calls stall all cluster event processing.',
        fix: 'Use worker queues with retries (`client-go/util/workqueue`) and asynchronous reconcilers.',
      },
    ],
    quizQuestion: {
      question: 'What is the fundamental architectural pattern that every Kubernetes controller executes?',
      options: [
        { label: 'A', text: 'MapReduce', isCorrect: false, explanation: 'MapReduce is for batch big-data processing.' },
        { label: 'B', text: 'The Reconciliation Loop (Observe -> Analyze -> Act)', isCorrect: true, explanation: 'Correct! Controllers continuously observe actual state, compare it with desired state from etcd, and execute actions to bring actual state in line.' },
        { label: 'C', text: 'Client-Server Polling', isCorrect: false, explanation: 'Controllers use long-lived HTTP Watch streams, not blunt polling.' },
        { label: 'D', text: 'Round-Robin DNS', isCorrect: false, explanation: 'DNS is unrelated to controller loops.' },
      ],
    },
    yamlExplanation: [
      { field: 'spec.selector', explanation: 'Label query watched by controllers to identify child resources needing reconciliation.' },
    ],
    referenceCheatSheet: [
      'kubectl logs -n kube-system -l component=kube-controller-manager : Inspect core controller logs',
      'kubebuilder init --domain example.com : Scaffold a new custom Kubernetes controller project in Go',
    ],
    solutionExplanation: 'Controllers are the autonomic nervous system of Kubernetes, continuously steering actual state toward desired declarative state.',
  },

  'c-custom-scheduling': {
    commonPitfalls: [
      {
        mistake: 'Specifying `spec.schedulerName: custom-scheduler` when the custom scheduler binary is not running or crashed.',
        whyItHappens: 'The pod will stay in `Pending` state forever because the default scheduler ignores it and no custom scheduler claims it.',
        fix: 'Verify the custom scheduler pod is healthy in the `kube-system` namespace.',
      },
      {
        mistake: 'Writing custom schedulers from scratch instead of using the Kubernetes Scheduling Framework plugins.',
        whyItHappens: 'Maintaining a separate scheduler binary requires reimplementing cache synchronization, leader election, and binding.',
        fix: 'Extend the default scheduler by writing in-tree or out-of-tree plugins using the official Scheduling Framework (Filter, Score, Reserve, PreBind).',
      },
    ],
    quizQuestion: {
      question: 'What is the recommended approach in modern Kubernetes to customize scheduling logic without maintaining a separate scheduler binary?',
      options: [
        { label: 'A', text: 'Edit the Linux kernel source code directly.', isCorrect: false, explanation: 'Scheduling is userspace Kubernetes logic.' },
        { label: 'B', text: 'Use the Kubernetes Scheduling Framework to write modular plugins (Filter, Score, Reserve) that compile directly into the kube-scheduler.', isCorrect: true, explanation: 'Correct! The Scheduling Framework provides clean extension points at every phase of the scheduling cycle.' },
        { label: 'C', text: 'Run a cron job that moves pods between nodes every minute.', isCorrect: false, explanation: 'Cron jobs cannot replace real-time scheduling.' },
        { label: 'D', text: 'Use iptables rules to block pod placement.', isCorrect: false, explanation: 'iptables handles packet forwarding, not pod placement.' },
      ],
    },
    yamlExplanation: [
      { field: 'spec.schedulerName: custom-scheduler', explanation: 'Directs Kubernetes to hand scheduling responsibility of this pod to a custom scheduler daemon.' },
    ],
    referenceCheatSheet: [
      'kubectl get pods -n kube-system -l component=kube-scheduler : Verify scheduler status',
      'kubectl explain pod.spec.schedulerName : View official scheduler assignment documentation',
    ],
    solutionExplanation: 'Custom scheduling and extenders allow specialized hardware (GPUs, FPGAs, HPC racks) to use domain-specific placement heuristics.',
  },

  'c-custom-resources-crds': {
    commonPitfalls: [
      {
        mistake: 'Creating a CRD (Custom Resource Definition) without an associated Controller or Operator.',
        whyItHappens: 'A CRD without a controller is just a static JSON/YAML store in etcd; nothing actually happens when you create instances.',
        fix: 'Build a controller (using Kubebuilder or Operator SDK) that watches the CRD and takes real-world operational actions.',
      },
      {
        mistake: 'Omitting OpenAPI v3 validation schemas from the CRD.',
        whyItHappens: 'Allows invalid or corrupt configurations to be saved to etcd without validation errors.',
        fix: 'Always define strict OpenAPI validation schemas in the CRD spec so `kubectl apply` catches errors early.',
      },
    ],
    quizQuestion: {
      question: 'What is the difference between a Custom Resource Definition (CRD) and a Custom Resource (CR)?',
      options: [
        { label: 'A', text: 'A CRD is the database; a CR is the table.', isCorrect: false, explanation: 'Not a database terminology match.' },
        { label: 'B', text: 'A CRD defines the new API schema/type (like a class in programming); a CR is an actual instantiated instance of that type (like an object in programming).', isCorrect: true, explanation: 'Correct! CRD creates the new kind (e.g. `Kind: Database`), and CR is the specific YAML manifest (e.g. `name: prod-db`).' },
        { label: 'C', text: 'CRD is deprecated in favor of Dockerfiles.', isCorrect: false, explanation: 'CRDs are the primary extension mechanism of Kubernetes.' },
        { label: 'D', text: 'There is no difference.', isCorrect: false, explanation: 'CRD is the schema; CR is the instance.' },
      ],
    },
    yamlExplanation: [
      { field: 'apiVersion: apiextensions.k8s.io/v1\nkind: CustomResourceDefinition', explanation: 'Cluster-level resource that introduces a brand new API type to the Kubernetes API server.' },
      { field: 'spec.names.kind: Database', explanation: 'The kind name developers will use in their application manifests.' },
      { field: 'spec.scope: Namespaced', explanation: 'Scopes instances of this custom resource to individual namespaces.' },
    ],
    referenceCheatSheet: [
      'kubectl get crd : List all Custom Resource Definitions installed in the cluster',
      'kubectl get <custom-kind> -A : Query instances of a custom resource across all namespaces',
      'kubectl describe crd <name> : Inspect schema validation and supported versions',
    ],
    solutionExplanation: 'CRDs transform Kubernetes from a fixed container orchestrator into an extensible, programmable cloud-native control plane.',
  },

  'c-k8s-extensions-apis': {
    commonPitfalls: [
      {
        mistake: 'Failing to configure a valid TLS certificate for Mutating or Validating Admission Webhooks.',
        whyItHappens: 'Kube-apiserver strictly enforces HTTPS/TLS when calling external webhooks; invalid certs cause all API requests to fail!',
        fix: 'Use cert-manager to automatically generate and inject CA bundles into webhook configurations.',
      },
      {
        mistake: 'Setting `failurePolicy: Fail` on an admission webhook without high availability, blocking all cluster deployments if the webhook pod restarts.',
        whyItHappens: 'If the webhook is down and policy is Fail, the API server rejects all matching creations and updates.',
        fix: 'Run multiple replicas of webhook pods and use `failurePolicy: Ignore` during initial rollout testing.',
      },
    ],
    quizQuestion: {
      question: 'Which Kubernetes extension mechanism intercepts API requests AFTER authentication and authorization, but BEFORE persisting them to etcd?',
      options: [
        { label: 'A', text: 'Admission Webhooks (Mutating & Validating)', isCorrect: true, explanation: 'Correct! Mutating webhooks can modify objects (e.g. auto-inject sidecars), and Validating webhooks can enforce organizational security policies before etcd persistence.' },
        { label: 'B', text: 'CoreDNS plugins', isCorrect: false, explanation: 'CoreDNS resolves domain names, not API admission.' },
        { label: 'C', text: 'Kubelet CRI plugins', isCorrect: false, explanation: 'CRI runs containers on nodes, long after API admission.' },
        { label: 'D', text: 'CSI Storage drivers', isCorrect: false, explanation: 'CSI attaches storage volumes.' },
      ],
    },
    yamlExplanation: [
      { field: 'kind: ValidatingWebhookConfiguration', explanation: 'Declares an HTTP callback the API server must invoke before allowing resources to be created.' },
      { field: 'failurePolicy: Fail', explanation: 'Instructs the API server to reject requests if the webhook service cannot be reached.' },
    ],
    referenceCheatSheet: [
      'kubectl get mutatingwebhookconfigurations,validatingwebhookconfigurations : List all active admission hooks',
      'kubectl get apiservices : Inspect aggregated API servers and their connectivity status',
    ],
    solutionExplanation: 'Admission webhooks and API aggregation extend Kubernetes control plane behavior with custom security and governance rules.',
  },

  'c-should-you-manage-cluster': {
    commonPitfalls: [
      {
        mistake: 'Choosing to build a self-managed bare-metal cluster without dedicated 24/7 SRE staff.',
        whyItHappens: 'Underestimating the toil of certificate expirations, etcd backups, OS patching, and network routing.',
        fix: 'Calculate Total Cost of Ownership (TCO): engineer hours maintaining Kubernetes often exceed cloud-managed control plane fees.',
      },
      {
        mistake: 'Running an even number of etcd nodes (e.g. 2 or 4 nodes).',
        whyItHappens: 'Raft consensus requires an ODD number of nodes (3, 5) to establish majority quorum (`(N/2)+1`). 4 nodes can only tolerate 1 failure—the same as 3 nodes!',
        fix: 'Always maintain 3 or 5 etcd members.',
      },
    ],
    quizQuestion: {
      question: 'Why does an etcd cluster require an ODD number of members (typically 3 or 5)?',
      options: [
        { label: 'A', text: 'Odd numbers use less electrical power.', isCorrect: false, explanation: 'Power usage is strictly hardware based.' },
        { label: 'B', text: 'To maintain a strict majority quorum (`(N/2) + 1`) during network partitions and prevent split-brain states.', isCorrect: true, explanation: 'Correct! Raft consensus relies on odd quorums; adding a 4th node does not increase fault tolerance over 3 nodes.' },
        { label: 'C', text: 'Because Kubernetes cannot count even numbers.', isCorrect: false, explanation: 'Humorous, but not technical.' },
        { label: 'D', text: 'Cloud providers only sell servers in groups of 3.', isCorrect: false, explanation: 'VMs can be purchased individually.' },
      ],
    },
    yamlExplanation: [
      { field: 'controlPlaneEndpoint: "k8s-api.internal:6443"', explanation: 'DNS name or virtual IP of the load balancer distributing traffic across master nodes.' },
    ],
    referenceCheatSheet: [
      'kubectl cluster-info dump : Export comprehensive cluster configuration and diagnostic data',
      'etcdctl member list : View active etcd cluster nodes and leader election status',
    ],
    solutionExplanation: 'Evaluating self-hosted vs managed Kubernetes requires weighing hardware sovereignty against operational maintenance toil.',
  },

  'c-control-plane-management': {
    commonPitfalls: [
      {
        mistake: 'Letting kubeadm control plane TLS certificates expire after 1 year.',
        whyItHappens: 'Kubeadm creates 1-year certs by default; when they expire, the cluster goes down completely and kubectl stops working.',
        fix: 'Run `kubeadm certs check-expiration` regularly and automate certificate renewal using `kubeadm certs renew all` or automated OS cronjobs.',
      },
      {
        mistake: 'Failing to take automated periodic etcd snapshot backups.',
        whyItHappens: 'If an etcd quorum experiences database corruption, without a snapshot backup the cluster cannot be restored.',
        fix: 'Automate `etcdctl snapshot save` to an external S3/GCS bucket before every Kubernetes version upgrade.',
      },
    ],
    quizQuestion: {
      question: 'Which tool is the official community standard for bootstrapping and upgrading self-managed Kubernetes control planes?',
      options: [
        { label: 'A', text: 'kubeadm', isCorrect: true, explanation: 'Correct! `kubeadm init` bootstraps the control plane, and `kubeadm upgrade` orchestrates safe version upgrades.' },
        { label: 'B', text: 'npm', isCorrect: false, explanation: 'npm is the JavaScript package manager.' },
        { label: 'C', text: 'Minikube', isCorrect: false, explanation: 'Minikube is for local single-node development, not multi-node production.' },
        { label: 'D', text: 'Docker Compose', isCorrect: false, explanation: 'Docker Compose does not manage Kubernetes control planes.' },
      ],
    },
    yamlExplanation: [
      { field: 'apiVersion: kubeadm.k8s.io/v1beta3\nkind: ClusterConfiguration', explanation: 'Kubeadm configuration file defining control plane versions, SANs, and networking.' },
    ],
    referenceCheatSheet: [
      'kubeadm certs check-expiration : Audit remaining validity days for all cluster certificates',
      'kubeadm certs renew all : Renew all Kubernetes control plane TLS certificates for another year',
      'etcdctl snapshot save /backup/etcd-backup.db : Take an immediate point-in-time backup of etcd state',
    ],
    solutionExplanation: 'Control plane management involves certificate rotations, etcd snapshots, high-availability replication, and orderly version upgrades.',
  },

  'c-worker-nodes-lifecycle': {
    commonPitfalls: [
      {
        mistake: 'Rebooting or terminating a worker node without first running `kubectl drain`.',
        whyItHappens: 'Forcibly cutting power causes dropped user requests, broken TCP streams, and database transaction corruptions.',
        fix: 'Always run `kubectl cordon <node>` followed by `kubectl drain <node> --ignore-daemonsets --delete-emptydir-data`.',
      },
      {
        mistake: 'Forgetting to run `kubectl uncordon <node>` after maintenance is complete.',
        whyItHappens: 'The node remains unschedulable indefinitely, reducing cluster compute capacity.',
        fix: 'Always uncordon nodes after OS kernel updates or reboot cycles.',
      },
    ],
    quizQuestion: {
      question: 'What does the command `kubectl cordon <node>` do to a worker node?',
      options: [
        { label: 'A', text: 'It terminates all running pods immediately.', isCorrect: false, explanation: 'Cordoning does not terminate existing pods; drain does.' },
        { label: 'B', text: 'It marks the node as `SchedulingDisabled`, preventing new Pods from being scheduled onto it while letting existing Pods continue running.', isCorrect: true, explanation: 'Correct! Cordon seals the node from new workloads; drain evicts existing workloads.' },
        { label: 'C', text: 'It wipes the hard drive.', isCorrect: false, explanation: 'Cordon is purely a scheduling flag.' },
        { label: 'D', text: 'It changes the node root password.', isCorrect: false, explanation: 'K8s does not manage OS passwords.' },
      ],
    },
    yamlExplanation: [
      { field: 'spec.unschedulable: true', explanation: 'Node specification field set by `kubectl cordon` to block the scheduler from assigning new pods.' },
    ],
    referenceCheatSheet: [
      'kubectl cordon <node> : Prevent new pods from being scheduled onto the node',
      'kubectl drain <node> --ignore-daemonsets --delete-emptydir-data : Safely evict all running workloads',
      'kubectl uncordon <node> : Re-enable scheduling on the node after maintenance',
      'kubectl delete node <node> : Remove an decommissioned node from the cluster state',
    ],
    solutionExplanation: 'Graceful worker node lifecycle operations (cordon, drain, uncordon) ensure zero downtime during OS updates and maintenance.',
  },

  'c-multicluster-management': {
    commonPitfalls: [
      {
        mistake: 'Attempting to stretch a single Kubernetes cluster across multiple continents or high-latency WAN connections.',
        whyItHappens: 'etcd Raft consensus requires low latency (<10-20ms round-trip); WAN latency spikes break etcd quorum and crash the cluster.',
        fix: 'Run separate, independent Kubernetes clusters in each region, and federate traffic using multi-cluster routing or Global Server Load Balancing (GSLB).',
      },
      {
        mistake: 'Manual context switching errors: accidentally running destructive commands in production instead of staging.',
        whyItHappens: 'Forgetting which context is currently active in `~/.kube/config`.',
        fix: 'Use tools like `kubectx`, `kubens`, and starship prompt to always display the active cluster and namespace clearly.',
      },
    ],
    quizQuestion: {
      question: 'Why should an etcd cluster NOT be stretched across multiple geographical regions with high network latency (>50ms)?',
      options: [
        { label: 'A', text: 'Raft consensus requires frequent round-trip heartbeats; high latency leads to election timeouts, leader flapping, and degraded cluster performance.', isCorrect: true, explanation: 'Correct! etcd is sensitive to disk and network latency; cross-region clusters should use multi-cluster architectures instead.' },
        { label: 'B', text: 'Because etcd only speaks English.', isCorrect: false, explanation: 'Humorous, but not technical.' },
        { label: 'C', text: 'Because fiber optic cables cannot transmit Kubernetes packets.', isCorrect: false, explanation: 'All packets travel over fiber optic cables.' },
        { label: 'D', text: 'Kubernetes licenses forbid multi-region use.', isCorrect: false, explanation: 'Kubernetes is open-source Apache 2.0.' },
      ],
    },
    yamlExplanation: [
      { field: 'contexts[0].context.cluster: prod-us-east', explanation: 'Defines a named cluster environment in the client kubeconfig.' },
    ],
    referenceCheatSheet: [
      'kubectl config get-contexts : View all configured cluster contexts',
      'kubectl config use-context <context-name> : Switch active cluster target',
      'kubectl config current-context : Print the currently targeted cluster name',
    ],
    solutionExplanation: 'Multi-cluster architectures provide blast-radius containment, global compliance, and geographic disaster recovery.',
  },

  'c-cluster-operations-admin': {
    commonPitfalls: [
      {
        mistake: 'Skipping minor versions during cluster upgrades (e.g. jumping from v1.28 directly to v1.31).',
        whyItHappens: 'Kubernetes strictly does not support skipping minor versions; the upgrade MUST be sequential (1.28 -> 1.29 -> 1.30 -> 1.31).',
        fix: 'Upgrade one minor version at a time, checking API deprecations at each step.',
      },
      {
        mistake: 'Not auditing deprecated API versions before upgrading Kubernetes.',
        whyItHappens: 'When deprecated APIs are removed in a new version, running workloads may fail or be rejected.',
        fix: 'Run tools like `pluto` or `kubent` to audit manifests for removed API versions before initiating upgrades.',
      },
    ],
    quizQuestion: {
      question: 'What is the maximum supported version skew between the `kube-apiserver` and worker node `kubelet` binaries?',
      options: [
        { label: 'A', text: 'Zero: They must be the exact same patch version down to the second.', isCorrect: false, explanation: 'Kubernetes supports version skew to enable rolling upgrades.' },
        { label: 'B', text: 'Up to 3 minor versions (kubelet can be up to 3 minor versions older than kube-apiserver in modern K8s).', isCorrect: true, explanation: 'Correct! Kubelet may be up to 3 minor versions behind kube-apiserver, enabling rolling node upgrades without downtime.' },
        { label: 'C', text: 'Up to 10 minor versions.', isCorrect: false, explanation: '10 versions is far too wide and causes API breakage.' },
        { label: 'D', text: 'Kubelet must always be NEWER than the API server.', isCorrect: false, explanation: 'Kubelet must never be newer than the API server.' },
      ],
    },
    yamlExplanation: [
      { field: 'spec.minAvailable', explanation: 'Ensures cluster administrative upgrades respect application availability SLAs.' },
    ],
    referenceCheatSheet: [
      'etcdctl snapshot restore /backup/etcd.db : Restore cluster state from an etcd snapshot',
      'kubectl get nodes -o wide : Check kubelet versions across all nodes during an upgrade',
    ],
    solutionExplanation: 'Disciplined operational workflows, strict upgrade sequencing, and automated etcd recovery guarantee enterprise uptime.',
  },
};
