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
                whatIsIt: "Kubelet diagnostic mechanisms (HTTP, TCP, gRPC, exec) executed periodically against containers to determine initialization, liveliness, and readiness for service mesh/endpoints routing.",
        inSimpleWords: "A continuous doctor checkup for every container: startup checks if the app is done booting, liveness restarts it if it is deadlocked or frozen, and readiness cuts off user traffic if the app is overwhelmed or warming caches.",
        realWorldAnalogy: {
                "metaphor": "A restaurant kitchen station",
                "explanation": "Startup probe checks if the ovens have preheated before opening the door; liveness checks if the chef has collapsed and needs replacement; readiness checks if the station has clean plates before waiters can take new orders to the table."
        },
        whenToUse: [
                "Slow-starting runtimes (Java/JVM, Rails, large ML model loading) using startup probes to prevent premature restarts",
                "HTTP APIs prone to deadlocks or thread starvation requiring automatic container restarts via liveness probes",
                "Stateful backends or cache-warming services requiring readiness probes to prevent routing requests before memory is primed"
        ],
        whenNotToUse: [
                "External dependency checks inside liveness probes (e.g. failing a pod liveness probe because PostgreSQL or Redis is down, causing a cascading death spiral across the entire cluster)",
                "Aggressive periods (e.g. periodSeconds: 1) on heavy exec probes that fork processes and spike node CPU",
                "Identical endpoints for both liveness and readiness without decoupling operational health from backend downstream connectivity"
        ],
        lifecycleSteps: [
                {
                        "step": 1,
                        "title": "Startup Evaluation",
                        "description": "Kubelet executes startupProbe. All liveness and readiness probe evaluations are suppressed until startup succeeds or reaches failureThreshold."
                },
                {
                        "step": 2,
                        "title": "Readiness & Endpoint Registration",
                        "description": "Once started, readinessProbe fires every periodSeconds. If successful, kubelet marks container Ready, and the Endpoints controller adds the Pod IP to Service routing."
                },
                {
                        "step": 3,
                        "title": "Continuous Liveness Monitoring",
                        "description": "Kubelet runs livenessProbe. If consecutive failures exceed failureThreshold, kubelet triggers container SIGTERM, waits grace period, kills SIGKILL, and initiates restartPolicy."
                },
                {
                        "step": 4,
                        "title": "Dynamic Traffic Deregistration",
                        "description": "If a healthy container fails its readinessProbe (e.g. 503 response or connection timeout), the Endpoints controller immediately strips its IP from iptables/IPVS without terminating the container."
                }
        ],
        keyMechanisms: [
                {
                        "title": "HTTP, TCP, gRPC & Exec Probe Handlers",
                        "detail": "Kubelet supports native HTTP GET checks (200-399 status), raw TCP socket connections, standard gRPC health checking protocol, and shell exec return code evaluation (exit code 0 == healthy)."
                },
                {
                        "title": "Endpoints & EndpointSlice Controller Sync",
                        "detail": "Readiness status directly gates the kube-controller-manager Endpoints controller. Unready pods are instantly purged from kube-proxy routing rules without container recreation."
                },
                {
                        "title": "FailureThreshold & InitialDelaySeconds Mechanics",
                        "detail": "initialDelaySeconds cushions initial boot times, periodSeconds governs cadence, timeoutSeconds enforces SLA, and failureThreshold prevents flapping on transient blips."
                }
        ],
        productionTips: [
                "CKAD/CKA Golden Rule: Never check downstream dependencies (DB, Redis, external APIs) in livenessProbe! If your database goes down, every web pod will fail liveness and restart in a catastrophic cluster-wide loop.",
                "Always configure startupProbe for JVM, Python Django, or Rails applications. Give startupProbe a high failureThreshold (e.g., 30 with periodSeconds: 10 = 5 minutes) so slow migrations do not trigger crashloops.",
                "Use gRPC health probes (introduced natively in k8s 1.24+) for microservices instead of invoking expensive exec grpc_health_probe binaries that consume node PID limits."
        ],
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
                whatIsIt: "The cloud-native logging pattern in Kubernetes where containers stream JSON/text to stdout/stderr, the container runtime writes them to node disks, and a DaemonSet logging agent tails, enriches, and forwards logs to centralized search engines.",
        inSimpleWords: "Applications simply print logs to the terminal screen; the container engine saves them to files on the host node; a background agent on every computer scoops them up, tags them with the pod name and namespace, and uploads them to Elasticsearch or Grafana Loki.",
        realWorldAnalogy: {
                "metaphor": "Municipal trash collection",
                "explanation": "Tenants do not drive their own trash to the landfill. They put standard bins by their front door (stdout). A municipal garbage truck (DaemonSet agent) visits every house every morning, scans the address tag, and brings the waste to the city recycling facility."
        },
        whenToUse: [
                "All containerized workloads following 12-Factor App principles streaming unbuffered structured JSON to stdout/stderr",
                "Cluster-wide audit logging, security compliance, and centralized debugging across ephemeral pods",
                "Extracting high-throughput log streams using lightweight node agents (Fluent Bit, Vector, Promtail) to avoid memory exhaustion"
        ],
        whenNotToUse: [
                "Writing logs to files inside container writable layers (e.g. /var/log/app.log) which bloat container storage and are permanently lost when pods restart",
                "Direct in-app logging over HTTP/TCP to external logging endpoints from application pods, creating network bottlenecks and blocking request threads",
                "Unthrottled debug logging in production that exhausts worker node disk space via massive /var/log/pods files"
        ],
        lifecycleSteps: [
                {
                        "step": 1,
                        "title": "Stdout/Stderr Stream Capture",
                        "description": "Application writes log events to file descriptors 1 and 2. The container runtime (containerd) captures streams and appends them to /var/log/pods/<ns>_<pod>_<uid>/<container>/<run>.log."
                },
                {
                        "step": 2,
                        "title": "Node DaemonSet Log Ingestion",
                        "description": "A Fluent Bit, Vector, or Promtail DaemonSet mounts /var/log/pods with read-only hostPath and continuously tails new log lines using inotify."
                },
                {
                        "step": 3,
                        "title": "Kubernetes Metadata Enrichment",
                        "description": "The logging agent parses the file path, queries local kubelet or API server cache, and injects pod labels, namespace, nodeName, containerName, and annotations."
                },
                {
                        "step": 4,
                        "title": "Batching & Centralized Indexing",
                        "description": "Enriched log buffers are compressed and shipped via TLS to backends such as Elasticsearch, OpenSearch, AWS CloudWatch, or Grafana Loki for querying."
                }
        ],
        keyMechanisms: [
                {
                        "title": "Log Rotation & Kubelet Max Log Size",
                        "detail": "Kubelet manages log rotation via containerLogMaxSize (default 10Mi) and containerLogMaxFiles (default 5), preventing rogue containers from filling node root disks."
                },
                {
                        "title": "Structured JSON Logging",
                        "detail": "Emitting logs as single-line JSON strings enables automated field parsing (level, trace_id, duration_ms) without brittle multiline regex matching in log parsers."
                },
                {
                        "title": "CRI Log Formatting",
                        "detail": "Containerd formats each line with RFC3339 timestamps, stream identifier (stdout/stderr), and partial/full line delimiters (P/F) to handle large log chunks."
                }
        ],
        productionTips: [
                "CKA Tip: Run `kubectl logs <pod> --previous` to inspect the logs of a container that recently crashed or was OOMKilled before its restart.",
                "Always set `containerLogMaxSize` and `containerLogMaxFiles` in your kubelet configuration or kubeadm KubeletConfiguration to prevent disk pressure node taints.",
                "Use Fluent Bit or Vector instead of heavyweight Fluentd or Logstash on worker nodes; Fluent Bit requires only ~30MB RAM compared to 500MB+ for Ruby/JVM log collectors."
        ],
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
                whatIsIt: "The two-tier metrics architecture of Kubernetes consisting of the lightweight in-memory Metrics Server for core HPA/VPA autoscaling, paired with full-featured Prometheus time-series scraping for SRE alerting, SLAs, and Grafana dashboards.",
        inSimpleWords: "Metrics Server is the speedometer on your car dashboard (just shows instant CPU/memory for autoscaling); Prometheus is the flight data black box (records every metric every 15 seconds for historical graphs and emergency sirens).",
        realWorldAnalogy: {
                "metaphor": "Hospital vital sign monitors",
                "explanation": "Metrics Server is the bedside pulse-oximeter that beeps if oxygen dips right now; Prometheus is the central hospital telemetry database that charts 30-day blood pressure trends, nurse call history, and medical diagnostics."
        },
        whenToUse: [
                "Installing Metrics Server as a cluster prerequisite for `kubectl top nodes/pods` and HPA CPU/memory autoscaling",
                "Deploying Prometheus Operator with ServiceMonitors to scrape application /metrics endpoints across dynamic microservices",
                "Setting up Prometheus Alertmanager for PagerDuty/Slack routing on CrashLoopBackOff, disk filling, and SLO degradation"
        ],
        whenNotToUse: [
                "Using Metrics Server as a long-term historical time-series database (Metrics Server stores only instantaneous values in RAM, no history)",
                "Scraping metrics at excessive frequency (<5s intervals) across tens of thousands of pods, causing Prometheus scrape timeouts and memory thrashing",
                "Exposing high-cardinality label dimensions (e.g. user IDs, credit card numbers) in Prometheus metrics, exploding TSDB memory"
        ],
        lifecycleSteps: [
                {
                        "step": 1,
                        "title": "cAdvisor Kernel Telemetry Collection",
                        "description": "Embedded inside every kubelet, cAdvisor extracts CPU, memory, filesystem, and network socket stats directly from Linux cgroups."
                },
                {
                        "step": 2,
                        "title": "Metrics Server Ingestion",
                        "description": "Metrics Server periodically polls kubelets via internal HTTPS, caches summary stats, and serves them to API server via metrics.k8s.io."
                },
                {
                        "step": 3,
                        "title": "Prometheus Service Discovery & Scraping",
                        "description": "Prometheus queries kube-apiserver for Pod and Service endpoints matching ServiceMonitors, then issues HTTP GET /metrics requests every scrape_interval."
                },
                {
                        "step": 4,
                        "title": "Alert Evaluation & Rule Execution",
                        "description": "Prometheus evaluates PromQL recording and alerting rules against the local TSDB. If conditions fire, alerts are pushed to Alertmanager for deduplication."
                }
        ],
        keyMechanisms: [
                {
                        "title": "API Aggregation Layer (APIService)",
                        "detail": "Metrics Server registers an APIService (v1beta1.metrics.k8s.io) that proxies requests from kube-apiserver directly to the metrics-server pod."
                },
                {
                        "title": "Prometheus Operator & ServiceMonitors",
                        "detail": "Declarative CRDs (Prometheus, ServiceMonitor, PodMonitor, Alertmanager) automate Prometheus target configuration directly from Kubernetes labels."
                },
                {
                        "title": "kube-state-metrics vs cAdvisor",
                        "detail": "cAdvisor measures container resource consumption (bytes, CPU seconds); kube-state-metrics listens to the Kubernetes API to report object states (desired vs available replicas)."
                }
        ],
        productionTips: [
                "CKA Tip: If `kubectl top` fails with \"Metrics API not available\", verify that `metrics-server` pod is running in `kube-system` and has `--kubelet-insecure-tls` or proper cluster CA certs configured.",
                "Always deploy `kube-state-metrics` alongside Prometheus. cAdvisor cannot tell you how many replicas a Deployment wants or if a CronJob missed its schedule.",
                "Enable metric relabeling (`metric_relabel_configs`) to drop unneeded high-churn metrics before they enter Prometheus storage to maintain TSDB performance."
        ],
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
                whatIsIt: "The package manager standard for Kubernetes that bundles declarative resource templates into versioned, shareable, and parameterizable archives governed by Chart.yaml and values.yaml specifications.",
        inSimpleWords: "Like npm, apt, or Homebrew for Kubernetes. Instead of juggling 10 different raw YAML files for an app, you bundle them into a single chart where variables like replica counts and domain names can be changed with one settings file.",
        realWorldAnalogy: {
                "metaphor": "Flat-pack furniture assembly with customizable colors",
                "explanation": "An IKEA furniture kit provides the blueprints, screws, and wood panels (templates), but lets you choose whether you want birch, black, or white veneer (values.yaml) before building it in your living room."
        },
        whenToUse: [
                "Packaging internal microservices for reproducible deployment across dev, staging, and production environments with environment-specific values files",
                "Installing community third-party open-source software (Cert-Manager, Ingress-Nginx, Prometheus, Redis) via official artifact hubs",
                "Managing complex application dependencies using subcharts in Chart.yaml"
        ],
        whenNotToUse: [
                "Extremely simple single-manifest setups where basic `kubectl apply -f` suffices and templating adds unnecessary abstraction overhead",
                "Storing plaintext credentials and database passwords directly in unencrypted `values.yaml` files committed to public Git repos",
                "Modifying rendered resources in the cluster using ad-hoc `kubectl edit`, which creates silent drift from the Helm release tracking Secret"
        ],
        lifecycleSteps: [
                {
                        "step": 1,
                        "title": "Chart Directory Initialization",
                        "description": "Developer creates standard directory scaffold via `helm create <name>`, yielding Chart.yaml, values.yaml, templates/, and tests/."
                },
                {
                        "step": 2,
                        "title": "Dependency Resolution",
                        "description": "Helm evaluates dependencies listed in Chart.yaml and downloads dependent subcharts into the charts/ subfolder via `helm dependency update`."
                },
                {
                        "step": 3,
                        "title": "Template Compilation & Merging",
                        "description": "Helm client loads templates/, injects values.yaml defaults and CLI `--set` overrides, executes Go templating functions, and renders pure Kubernetes YAML."
                },
                {
                        "step": 4,
                        "title": "Packaging & Registry Distribution",
                        "description": "`helm package` compresses the chart into a .tgz archive. The package can then be pushed to OCI registries (Docker Hub, ECR, Harbor) via `helm push`."
                }
        ],
        keyMechanisms: [
                {
                        "title": "Chart.yaml SemVer Contract",
                        "detail": "Specifies apiVersion (v2 for Helm 3), name, description, type (application or library), appVersion (software release), and version (chart SemVer)."
                },
                {
                        "title": "Hierarchical Value Resolution",
                        "detail": "Values precedence: CLI `--set` > CLI `-f user-values.yaml` > parent chart values.yaml > subchart values.yaml."
                },
                {
                        "title": "OCI Registry Artifact Support",
                        "detail": "Helm 3.8+ treats OCI container registries as native chart repositories, allowing container images and Helm charts to reside in the same registry catalog."
                }
        ],
        productionTips: [
                "CKAD Tip: Always run `helm lint ./mychart` and `helm template ./mychart --debug` to validate Go template syntax and YAML indentation before attempting an install on a live cluster.",
                "Differentiate `version` from `appVersion` in Chart.yaml. `version` is the version of the Helm chart itself, while `appVersion` is the underlying software image version (e.g. nginx 1.25.3).",
                "Never put raw passwords in `values.yaml`. Combine Helm with Sealed Secrets, External Secrets Operator, or HashiCorp Vault to inject credentials securely at runtime."
        ],
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
                whatIsIt: "The templating engine within Helm leveraging Go text/template syntax augmented by Sprig utility functions, pipelines, conditionals, iteration, and reusable named helper templates in _helpers.tpl.",
        inSimpleWords: "The programming logic inside Helm YAML files. It lets you write `if/else` conditions, loops, and text formatting pipelines (like trimming or quoting strings) so one template file can generate dozens of different configurations.",
        realWorldAnalogy: {
                "metaphor": "A personalized mail merge document",
                "explanation": "A marketing letter template has placeholders like `{{ .FirstName }}` and rules like \"If state is CA, include the California privacy notice\". When merged with customer data, it prints personalized letters for everyone."
        },
        whenToUse: [
                "Creating reusable enterprise-grade charts that can dynamically enable/disable Ingress, TLS, ServiceMonitors, and Autoscaling via boolean flags",
                "Standardizing labels, annotations, and resource names across all microservices using centralized helper templates in `_helpers.tpl`",
                "Looping over lists of environment variables, secrets, or volume mounts using `range` blocks to reduce YAML boilerplate"
        ],
        whenNotToUse: [
                "Over-engineering templates with deeply nested logic that makes reading or debugging the resulting YAML impossible for junior team members",
                "Neglecting whitespace control (`{{-` and `-}}`), leading to invalid YAML indentation errors that break Kubernetes manifest validation",
                "Writing custom bash scripts to generate Helm values instead of using built-in template functions"
        ],
        lifecycleSteps: [
                {
                        "step": 1,
                        "title": "Template Variable Evaluation",
                        "description": "Helm parser resolves dot-notation context (`.Values`, `.Release`, `.Chart`, `.Capabilities`) inside double curly braces."
                },
                {
                        "step": 2,
                        "title": "Pipeline & Function Execution",
                        "description": "Pipes `|` pass intermediate outputs sequentially through Sprig functions like `quote`, `b64enc`, `indent`, and `toYaml`."
                },
                {
                        "step": 3,
                        "title": "Conditional Branching & Range Loops",
                        "description": "Evaluates `{{ if ... }}`, `{{ else }}`, and `{{ range ... }}` blocks, adjusting inner dot scope `.` when iterating over collections."
                },
                {
                        "step": 4,
                        "title": "Whitespace Stripping & Manifest Output",
                        "description": "Leading and trailing hyphens (`{{-` and `-}}`) collapse surrounding newlines and whitespace to guarantee valid YAML column indentation."
                }
        ],
        keyMechanisms: [
                {
                        "title": "Whitespace Control Hyphens ({{- and -}})",
                        "detail": "A hyphen after the opening delimiter (`{{- `) consumes all preceding whitespace and newlines; a hyphen before the closing (` -}}`) consumes succeeding whitespace."
                },
                {
                        "title": "The Dot Context Scope (.)",
                        "detail": "The root dot `.` holds the top-level context ($). Inside `with` and `range` blocks, the dot is rebound to the inner element; use `$` to access root values."
                },
                {
                        "title": "Named Helper Templates (define and include)",
                        "detail": "Helpers defined in `_helpers.tpl` using `{{ define \"name\" }}` are invoked using `{{ include \"name\" . }}` rather than `template` to allow piping to `nindent`."
                }
        ],
        productionTips: [
                "Best Practice: Always use `{{ include \"mychart.labels\" . | nindent 4 }}` instead of `template`. `template` is a pure Go action that cannot be piped to `nindent`, causing indentation bugs.",
                "Use `nindent` instead of `indent` when piping multi-line YAML chunks; `nindent` prepends a newline, preventing unexpected indentation shifts on the first rendered line.",
                "Test variable existence defensively using the `default` function: `{{ .Values.replicaCount | default 1 }}` to avoid template render failures when values are omitted."
        ],
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
                whatIsIt: "The state management and deployment tracking mechanism of Helm that creates numbered release revisions stored in cluster Secrets, calculates 3-way strategic merge patches, and executes automated atomic rollbacks.",
        inSimpleWords: "Helm's undo button and upgrade history. Every time you update an app with Helm, it saves a versioned snapshot. If the new version crashes during deployment, Helm automatically reverts everything back to the working version.",
        realWorldAnalogy: {
                "metaphor": "A video game checkpoint and save slot system",
                "explanation": "Before fighting a difficult boss, the game creates Save Slot #2. If your character dies, the game instantly loads Save Slot #1 so you never get permanently stuck in a broken state."
        },
        whenToUse: [
                "Running zero-downtime upgrades in CI/CD pipelines using `helm upgrade --install --atomic --timeout 5m`",
                "Inspecting release history and debugging upgrade anomalies using `helm history <release>`",
                "Instantly reverting a bad production deployment back to a known stable revision using `helm rollback <release> <revision>`"
        ],
        whenNotToUse: [
                "Modifying live resources directly with `kubectl apply` or `kubectl edit` behind Helm's back, which confuses Helm 3-way merge calculations",
                "Deleting Helm release secrets (`sh.helm.release.v1...`) manually from the namespace, which orphans live cluster resources and destroys Helm tracking",
                "Running upgrades without `--atomic` or health checks, leaving broken or partially deployed pods running in production"
        ],
        lifecycleSteps: [
                {
                        "step": 1,
                        "title": "Release State Discovery",
                        "description": "Helm reads the latest Secret labeled `owner=helm` for the specified release in the target namespace to determine the active revision manifest."
                },
                {
                        "step": 2,
                        "title": "3-Way Strategic Merge Patch",
                        "description": "Helm computes a 3-way diff between (1) previous release manifest, (2) current cluster live state, and (3) new desired chart manifest."
                },
                {
                        "step": 3,
                        "title": "Atomic Execution & Health Verification",
                        "description": "If `--atomic` is set, Helm applies the patch and monitors pod readiness. If any pod fails or exceeds `--timeout`, Helm aborts and triggers automatic rollback."
                },
                {
                        "step": 4,
                        "title": "New Revision Secret Persistence",
                        "description": "Upon successful rollout, Helm increments the release revision number (e.g. revision 4) and writes a new base64-encoded gzip Secret to the namespace."
                }
        ],
        keyMechanisms: [
                {
                        "title": "In-Cluster Secret Storage Backend",
                        "detail": "Helm 3 stores release history directly inside the release namespace as Secrets named `sh.helm.release.v1.<release-name>.v<revision>`. No server-side Tiller pod exists."
                },
                {
                        "title": "The --atomic Flag",
                        "detail": "Causes the upgrade process to roll back changes on failure. Requires `--wait` (implicit), monitoring all pods and jobs until they report ready."
                },
                {
                        "title": "Helm Hooks Lifecycle",
                        "detail": "Annotations like `helm.sh/hook: pre-install` or `post-upgrade` allow running database migration Jobs before new application pods are deployed."
                }
        ],
        productionTips: [
                "CKAD Tip: Use `helm history <release-name>` to see who upgraded what, when, and whether it succeeded or failed, then run `helm rollback <release-name> <revision>` to recover.",
                "Always set `--atomic --timeout 5m` in automated CI/CD deployment scripts so pipeline runs fail fast and restore cluster health automatically upon probe failure.",
                "Clean up old release history Secrets if you deploy frequently. Helm keeps 10 revisions by default; configure `--history-max 5` to save API server memory."
        ],
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
                whatIsIt: "The declarative infrastructure and continuous delivery pattern where Git acts as the single source of truth for desired cluster state, continuously reconciled by an in-cluster autonomous controller (ArgoCD).",
        inSimpleWords: "Instead of a developer or CI pipeline running `kubectl apply` from their laptop, an automated robot inside the cluster watches your GitHub repo. If you change a file in Git, it applies it; if someone hacks the cluster manually, it resets it.",
        realWorldAnalogy: {
                "metaphor": "A thermostat and heating system",
                "explanation": "You set the desired temperature on the wall dial (Git commit). The thermostat continuously checks the room temperature (live cluster). If a cold draft blows in (cluster drift), it turns on the furnace until reality matches the dial."
        },
        whenToUse: [
                "Multi-cluster, multi-tenant Kubernetes operations requiring continuous automated synchronization without distributing cluster admin credentials to CI runners",
                "Self-healing production environments that automatically detect and revert out-of-band manual changes made by unauthorized users",
                "Enterprise audit compliance requiring a complete Git commit log of who changed every single line of infrastructure"
        ],
        whenNotToUse: [
                "Pushing raw secrets in plaintext Git repositories without GitOps secret sealing technologies (Sealed Secrets, External Secrets, Vault)",
                "Ephemeral, rapid local prototyping environments where committing and pushing every YAML tweak adds unacceptable friction",
                "Using GitOps to manage resources whose desired state must change dynamically at runtime (like HPA replica counts or dynamic storage claims)"
        ],
        lifecycleSteps: [
                {
                        "step": 1,
                        "title": "Git Commit & Webhook Notification",
                        "description": "Engineer merges a pull request with updated Kubernetes YAML or Helm values into the repository main branch."
                },
                {
                        "step": 2,
                        "title": "Repository Server Manifest Generation",
                        "description": "ArgoCD repo-server clones the commit, renders raw YAML/Helm/Kustomize manifests, and computes the desired state tree."
                },
                {
                        "step": 3,
                        "title": "Live vs Desired Drift Calculation",
                        "description": "ArgoCD application-controller compares rendered manifests against live cluster resources retrieved from local cache."
                },
                {
                        "step": 4,
                        "title": "Reconciliation & Automated Self-Healing",
                        "description": "If differences exist and automated sync/selfHeal is active, ArgoCD applies patches to the cluster; if a resource was removed in Git, it prunes it."
                }
        ],
        keyMechanisms: [
                {
                        "title": "Pull-Based vs Push-Based Architecture",
                        "detail": "ArgoCD runs inside the Kubernetes firewall and pulls state outward from Git, eliminating the need to expose cluster API servers to external CI systems."
                },
                {
                        "title": "Drift Detection & Self-Healing",
                        "detail": "If an operator manually runs `kubectl edit deployment` or deletes a service, ArgoCD flags OutOfSync and automatically reverts the cluster to match Git."
                },
                {
                        "title": "The Application CRD",
                        "detail": "ArgoCD defines `Application` and `AppProject` custom resources specifying source repository, target cluster/namespace, and sync policies."
                }
        ],
        productionTips: [
                "Production Standard: Always separate application source code repositories from Kubernetes manifest repositories to avoid circular CI builds and keep Git histories clean.",
                "Enable `prune: true` and `selfHeal: true` in automated sync policies so deleted Git manifests remove dead cluster resources and out-of-band manual changes are reverted.",
                "Use `ignoreDifferences` in Application specs for fields managed by cluster controllers (e.g. `replicas` managed by HPA or `status` fields) to avoid perpetual OutOfSync loops."
        ],
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
                whatIsIt: "Advanced application deployment strategies (Canary, Blue/Green) orchestrated by custom controllers like Argo Rollouts that gradually shift live network traffic between versions while verifying automated metric gates.",
        inSimpleWords: "Instead of updating all 100 servers at once and praying, you send 5% of real user traffic to the new version. An automated robot checks if user error rates increase. If errors spike, it instantly reroutes traffic back to the old version with zero downtime.",
        realWorldAnalogy: {
                "metaphor": "A royal food taster before the banquet",
                "explanation": "Instead of serving an unproven dish to all 1,000 guests simultaneously, the royal taster samples a small portion first. If there is poison or bad seasoning, only the taster is affected and the feast continues with safe food."
        },
        whenToUse: [
                "Mission-critical e-commerce and financial microservices where any deployment error directly impacts revenue",
                "Automating traffic shifting (10% -> 25% -> 50% -> 100%) integrated with Service Meshes (Istio, Linkerd) or Ingress (Nginx, ALB)",
                "Executing automated rollback decisions driven by real-time Prometheus metric queries (P99 latency < 200ms, HTTP 5xx < 0.1%)"
        ],
        whenNotToUse: [
                "Simple internal development environments where fast iteration is preferred over progressive deployment overhead",
                "Monolithic applications with breaking database schema migrations that cannot coexist with older application code",
                "Stateful workloads requiring persistent single-instance locks where running two concurrent versions corrupts data"
        ],
        lifecycleSteps: [
                {
                        "step": 1,
                        "title": "Rollout Spec Modification",
                        "description": "A new container image is pushed to the `Rollout` resource. Argo Rollouts creates a new canary ReplicaSet alongside the stable ReplicaSet."
                },
                {
                        "step": 2,
                        "title": "Progressive Traffic Splitting",
                        "description": "Controller adjusts Ingress annotations or VirtualService weights to route a specified fraction (e.g. 10%) of incoming traffic to the canary pods."
                },
                {
                        "step": 3,
                        "title": "Metric Analysis Gate Execution",
                        "description": "Controller instantiates `AnalysisRun` executing background Prometheus queries. If metrics pass, the canary proceeds to the next step weight."
                },
                {
                        "step": 4,
                        "title": "Promotion or Instant Abort",
                        "description": "If all steps succeed, the canary is promoted to stable and the old ReplicaSet is scaled to 0. If analysis fails, traffic instantly snaps back to stable."
                }
        ],
        keyMechanisms: [
                {
                        "title": "The Rollout Custom Resource",
                        "detail": "Drop-in replacement for the native Kubernetes `Deployment` object, adding support for canary steps, blueGreen strategies, and metric gates."
                },
                {
                        "title": "AnalysisTemplate & Metric Queries",
                        "detail": "Defines reusable validation queries (e.g. Prometheus PromQL, Datadog, Webhooks) that run during the rollout to verify error rates and latency."
                },
                {
                        "title": "Traffic Routing Integration",
                        "detail": "Integrates natively with Nginx Ingress, AWS ALB, Istio, Traefik, and Ambassador to execute fine-grained percentage-based packet routing."
                }
        ],
        productionTips: [
                "Production Rule: Ensure your database schema migrations are backwards-compatible (expand-and-contract pattern) so both old stable pods and new canary pods can query the DB simultaneously.",
                "Always include a warm-up pause before running metric analysis queries to allow JIT compilers, cache warming, and connection pools to stabilize.",
                "Install the `kubectl argo rollouts` plugin to visualize live canary weight shifts, analysis progress, and pod transitions in real-time from the terminal."
        ],
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
                whatIsIt: "The native Kubernetes extension mechanism allowing platform engineers to define custom API endpoints, data models, OpenAPI v3 validation schemas, and subresources that behave identically to built-in types.",
        inSimpleWords: "Building your own custom Kubernetes objects. Just like Kubernetes understands `Pod` and `Service`, you can teach it new words like `Database`, `KafkaCluster`, or `Certificate`.",
        realWorldAnalogy: {
                "metaphor": "Adding custom forms to a government bureaucracy",
                "explanation": "The city hall has standard forms for building permits and birth certificates. When a new law passes, the city prints Form 504 (CRD) with custom checkboxes and rules so citizens can file the new paperwork."
        },
        whenToUse: [
                "Exposing platform capabilities (databases, queues, cloud infrastructure) to internal development teams as declarative YAML APIs",
                "Building custom automation tools and enterprise platforms on top of the Kubernetes control plane",
                "Packaging software using the Operator pattern to automate complex Day-2 stateful application lifecycles"
        ],
        whenNotToUse: [
                "Storing generic application data or user session state that belongs in an actual database like PostgreSQL or Redis",
                "Creating high-churn resources updated thousands of times per second, which swamps the etcd Raft consensus log and degrades cluster performance",
                "Simple configuration settings that could easily be stored in a standard ConfigMap or Secret"
        ],
        lifecycleSteps: [
                {
                        "step": 1,
                        "title": "CRD Manifest Submission",
                        "description": "Admin applies CustomResourceDefinition manifest specifying Group, Version, Kind, Names (plural/singular), and Scope (Namespaced or Cluster)."
                },
                {
                        "step": 2,
                        "title": "API Discovery Registration",
                        "description": "Kube-apiserver registers new REST endpoints (e.g. `/apis/storage.podforge.io/v1alpha1/namespaces/{ns}/databases`) and updates API discovery."
                },
                {
                        "step": 3,
                        "title": "OpenAPI v3 Schema Validation",
                        "description": "Apiserver validates submitted Custom Resource instances against the OpenAPI schema, rejecting missing required fields or incorrect types."
                },
                {
                        "step": 4,
                        "title": "Persistence in etcd",
                        "description": "Valid custom objects are serialized into JSON and stored in the cluster etcd datastore under the designated API path."
                }
        ],
        keyMechanisms: [
                {
                        "title": "OpenAPI v3 Validation Schema",
                        "detail": "Enforces structural typing, default values, mandatory fields, regex patterns, and range limits directly at the API server admission boundary."
                },
                {
                        "title": "The /status and /scale Subresources",
                        "detail": "Splits spec and status updates, allowing RBAC policies to restrict status mutation to controller service accounts while enabling HPA auto-scaling."
                },
                {
                        "title": "AdditionalPrinterColumns",
                        "detail": "Defines JSONPath expressions that populate custom columns when users run `kubectl get <customkind>`, showing operational status at a glance."
                }
        ],
        productionTips: [
                "CKA/CKAD Rule: Always specify `/status` subresource in your CRD. Without it, any user who can edit the spec can also forge the status field, and spec updates will overwrite status.",
                "Use `shortNames` (e.g. `shortNames: [\"db\"]`) so users can run `kubectl get db` instead of typing the full plural resource name.",
                "Plan API versioning carefully from day one (v1alpha1 -> v1beta1 -> v1). Kubernetes provides conversion webhooks to translate older resource versions on the fly."
        ],
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
                whatIsIt: "The Kubernetes architectural design pattern combining Custom Resource Definitions with custom autonomous reconciliation controllers to package and automate human operational knowledge for complex applications.",
        inSimpleWords: "An automated software engineer running inside your cluster. A DBA in code: if a database replica dies, the operator detects it, provisions a replacement, restores the latest backup, re-syncs the replication stream, and points the traffic back.",
        realWorldAnalogy: {
                "metaphor": "An autopilot system on an airplane",
                "explanation": "A human pilot sets the target altitude, heading, and speed (desired state in CRD). The autopilot continuously monitors sensors, calculates wind drift, and adjusts wing flaps and engine thrust to maintain that state."
        },
        whenToUse: [
                "Stateful distributed systems (PostgreSQL, Cassandra, Elasticsearch, Kafka) requiring ordered upgrades, automated failover, and automated backups",
                "Dynamic infrastructure provisioning (provisioning AWS S3 buckets or GCP Cloud SQL instances via Crossplane or ACK)",
                "Self-service internal developer platforms wrapping multi-component microservices into single declarative custom objects"
        ],
        whenNotToUse: [
                "Stateless 12-factor microservices that are already handled perfectly by standard Kubernetes Deployments and HPAs",
                "One-off migration scripts that only run once and do not require ongoing reconciliation or drift correction",
                "Teams lacking Go/Rust software engineering resources to maintain and debug controller code long term"
        ],
        lifecycleSteps: [
                {
                        "step": 1,
                        "title": "Informer Watch Event Trigger",
                        "description": "The controller manager initializes an Informer that registers a continuous HTTP streaming watch on the API server for target CRD events."
                },
                {
                        "step": 2,
                        "title": "Workqueue Ingestion & Deduplication",
                        "description": "When a resource is created, updated, or deleted, the event key (namespace/name) is enqueued into a rate-limiting workqueue."
                },
                {
                        "step": 3,
                        "title": "Reconciliation Execution (Reconcile)",
                        "description": "Worker goroutine pulls key and executes `Reconcile(ctx, req)`: fetches live cluster state, computes diff against desired spec, and executes mutations."
                },
                {
                        "step": 4,
                        "title": "Status Update & Requeue",
                        "description": "Controller updates the resource `status` subresource with current operational health and optionally schedules a periodic requeue for proactive polling."
                }
        ],
        keyMechanisms: [
                {
                        "title": "Level-Triggered vs Edge-Triggered Reconciliation",
                        "detail": "Kubernetes controllers are level-triggered: they reconcile toward the current state of the world rather than reacting blindly to individual change events."
                },
                {
                        "title": "Controller-Runtime & Kubebuilder / Operator SDK",
                        "detail": "The official Go framework providing clients, caches, schemes, webhooks, and leader election so developers only write the Reconcile function."
                },
                {
                        "title": "Leader Election for High Availability",
                        "detail": "Ensures only one replica of the operator is actively reconciling at any moment using a Lease lock, while standby replicas wait for failover."
                }
        ],
        productionTips: [
                "Best Practice: Make your `Reconcile` function strictly idempotent! It may be invoked 10 times in a row for the same resource; running it multiple times must never duplicate resources.",
                "Always set OwnerReferences (`controllerutil.SetControllerReference`) on child objects created by your operator so Kubernetes garbage collection automatically cleans them up when the parent CR is deleted.",
                "Leverage Kubebuilder markers (`// +kubebuilder:rbac:groups=...`) to auto-generate exact RBAC ClusterRole manifests matching your controller permissions."
        ],
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
                whatIsIt: "The administrative procedure for safely taking Kubernetes worker nodes offline for kernel upgrades, hardware repair, or decommission using cordon (unschedulable marking) and drain (graceful pod eviction).",
        inSimpleWords: "Like putting up an \"Out of Order\" sign on an elevator (cordon) so nobody gets on, and politely asking everyone currently inside to step out onto a different elevator (drain) before shutting off the power.",
        realWorldAnalogy: {
                "metaphor": "A flight gate boarding closure during airplane inspection",
                "explanation": "The gate agent announces no new passengers can scan their boarding passes (cordon). Existing passengers are rebooked onto adjacent flights (drain) so mechanics can safely service the aircraft engine."
        },
        whenToUse: [
                "Routine Linux OS kernel patching, security updates, and node operating system reboots",
                "Replacing degraded bare-metal physical hardware (failing RAM DIMM, bad disk controller) or cloud VM instance types",
                "Safely decommissioning and terminating worker nodes during cluster downscaling"
        ],
        whenNotToUse: [
                "Draining nodes hosting un-replicated standalone pods without understanding that draining will terminate the pods without automatic replacement",
                "Forcibly draining a node with `--force` when PodDisruptionBudgets report 0 allowed disruptions, causing production downtime",
                "Running drain on a control plane node without verifying that quorum exists on remaining etcd and API server instances"
        ],
        lifecycleSteps: [
                {
                        "step": 1,
                        "title": "Node Cordoning",
                        "description": "Admin runs `kubectl cordon <node>`. Kube-apiserver sets `spec.unschedulable: true`. Kube-scheduler ceases assigning any new pods to the node."
                },
                {
                        "step": 2,
                        "title": "Eviction API Invocation",
                        "description": "`kubectl drain` queries all non-DaemonSet pods on the node and creates Eviction subresource objects rather than direct pod deletes."
                },
                {
                        "step": 3,
                        "title": "PDB & Graceful Shutdown Honor",
                        "description": "Kube-apiserver verifies PodDisruptionBudgets (PDB). If allowed, pods receive SIGTERM and execute terminationGracePeriodSeconds while controllers reschedule replicas elsewhere."
                },
                {
                        "step": 4,
                        "title": "Maintenance & Uncordon",
                        "description": "Node is patched and rebooted. Once healthy, `kubectl uncordon <node>` clears `spec.unschedulable`, allowing scheduler to place pods on the node again."
                }
        ],
        keyMechanisms: [
                {
                        "title": "The Eviction API vs Delete API",
                        "detail": "`kubectl delete pod` forcibly terminates immediately; `kubectl drain` uses the Eviction API (`/pods/{name}/eviction`), which strictly honors PodDisruptionBudgets."
                },
                {
                        "title": "The --ignore-daemonsets Flag",
                        "detail": "DaemonSet pods cannot be evacuated because the DaemonSet controller will instantly recreate them on the node; `--ignore-daemonsets` bypasses them during drain."
                },
                {
                        "title": "The --delete-emptydir-data Flag",
                        "detail": "Required if any pods on the node use emptyDir storage, acknowledging that temporary local disk data will be deleted when the pod is evicted."
                }
        ],
        productionTips: [
                "CKA Exam Essential: The exact command sequence is `kubectl drain <node> --ignore-daemonsets --delete-emptydir-data`, perform work, then `kubectl uncordon <node>`. Memorize this!",
                "Never use `--force` in production unless an emergency requires abandoning PDB safety guarantees, as it can cause split-brain or data loss in quorum-based workloads.",
                "Verify with `kubectl get nodes` that the cordoned node displays `SchedulingDisabled` in its STATUS column before proceeding with any host reboots."
        ],
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
                whatIsIt: "The disaster recovery procedure for Kubernetes involving taking point-in-time Raft database snapshots of the etcd distributed key-value datastore and restoring them to recover from catastrophic control plane failure.",
        inSimpleWords: "The ultimate cluster time machine. If someone runs `rm -rf` or accidentally deletes every deployment in the cluster, restoring the etcd snapshot brings the entire cluster back to the exact second the backup was taken.",
        realWorldAnalogy: {
                "metaphor": "A bank's master ledger safe",
                "explanation": "If a bank's physical office burns down, as long as the encrypted master ledger snapshot stored in an offsite vault survives, every customer account balance and transaction can be restored 100% intact."
        },
        whenToUse: [
                "Automated hourly disaster recovery backups of all production Kubernetes control plane state",
                "Taking an immediate snapshot prior to major cluster version upgrades, etcd migrations, or risky cluster-wide administrative operations",
                "Rebuilding a dead or split-brain control plane after unrecoverable hardware failure across multiple control plane nodes"
        ],
        whenNotToUse: [
                "Attempting to use etcd backups for fine-grained single-application restore (restoring an etcd snapshot rolls back the entire cluster, overwriting all namespaces simultaneously)",
                "Restoring an old etcd snapshot onto a live running cluster without first shutting down all `kube-apiserver` instances, causing severe database corruption",
                "Storing unencrypted etcd snapshots on public storage, exposing all cluster Kubernetes Secrets in plaintext"
        ],
        lifecycleSteps: [
                {
                        "step": 1,
                        "title": "Snapshot Command Execution",
                        "description": "Admin runs `etcdctl snapshot save` specifying TLS client certificates, private key, cluster CA, and target backup file path."
                },
                {
                        "step": 2,
                        "title": "Linearizable Read & Snapshot Stream",
                        "description": "etcd leader establishes a linearizable read lock, generates an exact point-in-time copy of the bbolt database, and streams it to the destination file."
                },
                {
                        "step": 3,
                        "title": "Control Plane Service Suspension",
                        "description": "Before restoring, all kube-apiserver static pods or systemd services are stopped to ensure no active write connections exist to etcd."
                },
                {
                        "step": 4,
                        "title": "Database Initialization & Apiserver Resume",
                        "description": "Admin runs `etcdctl snapshot restore` to unpack the snapshot into a clean new `--data-dir`. The etcd static pod is updated, and apiserver restarts cleanly."
                }
        ],
        keyMechanisms: [
                {
                        "title": "The Raft Consensus Engine & bbolt DB",
                        "detail": "etcd uses Raft for quorum consensus across an odd number of members and persists all keys, revisions, and lease metadata in an embedded bbolt B+tree database file."
                },
                {
                        "title": "ETCDCTL_API=3 Environment Variable",
                        "detail": "etcdctl defaults to legacy v2 API in older tooling; always set `ETCDCTL_API=3` to operate on modern Kubernetes v3 protobuf key schemas."
                },
                {
                        "title": "mTLS Authentication Flags",
                        "detail": "etcd communication requires mutual TLS authentication using `--cacert`, `--cert`, and `--key` certificates located in `/etc/kubernetes/pki/etcd/`."
                }
        ],
        productionTips: [
                "CKA Exam Absolute Must: Always verify snapshot health immediately after taking it: `ETCDCTL_API=3 etcdctl snapshot status <file> --write-out=table`. Confirm Total Revisions and Hash are non-zero!",
                "When restoring in kubeadm, restore to a new directory (e.g. `/var/lib/etcd-restore`), then update the hostPath volume in `/etc/kubernetes/manifests/etcd.yaml` to point to the restored path.",
                "Always automate etcd snapshots using an offsite CronJob or backup tool like Velero that ships snapshots to an encrypted S3 bucket with strict lifecycle retention policies."
        ],
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
                whatIsIt: "The standard orchestration process for upgrading Kubernetes control-plane components and worker node runtimes sequentially using the official kubeadm tool suite while adhering strictly to Kubernetes version skew policies.",
        inSimpleWords: "Updating the operating system of the entire Kubernetes cluster without taking down your running websites. You upgrade one master node, then the rest, then upgrade the worker nodes one by one.",
        realWorldAnalogy: {
                "metaphor": "Renovating an airport runway system while planes are landing",
                "explanation": "You do not close the entire airport. You divert incoming flights to Runway B (drain), resurface and modernize Runway A (upgrade), reopen Runway A, and then repeat for Runway B."
        },
        whenToUse: [
                "Quarterly or annual Kubernetes minor version upgrades (e.g. v1.30 to v1.31) to access new API features and security patches",
                "Applying critical CVE security patches released for kube-apiserver, kubelet, or etcd components",
                "Upgrading self-managed clusters running on bare metal or cloud VMs managed with kubeadm"
        ],
        whenNotToUse: [
                "Skipping minor versions (e.g. attempting to jump from v1.28 directly to v1.30 without stepping through v1.29), which is explicitly unsupported and corrupts API state",
                "Upgrading worker nodes before the control plane nodes have been upgraded (violates Kubernetes version skew policy)",
                "Running upgrades without taking a verified etcd snapshot immediately beforehand"
        ],
        lifecycleSteps: [
                {
                        "step": 1,
                        "title": "Primary Control Plane Upgrade Tooling",
                        "description": "Admin unholds and upgrades `kubeadm` package on the first control plane node to the target version (e.g. `1.31.0-00`)."
                },
                {
                        "step": 2,
                        "title": "Upgrade Plan & Component Execution",
                        "description": "Admin runs `kubeadm upgrade plan` to inspect component versions, followed by `sudo kubeadm upgrade apply v1.31.0` to update control plane static pods."
                },
                {
                        "step": 3,
                        "title": "Control Plane Kubelet & Kubectl Upgrade",
                        "description": "Admin drains the control plane node, upgrades `kubelet` and `kubectl`, restarts the `kubelet` systemd service, and uncordons the node."
                },
                {
                        "step": 4,
                        "title": "Sequential Worker Node Rolling Upgrade",
                        "description": "Admin iterates through worker nodes one by one: upgrades kubeadm, runs `kubeadm upgrade node`, drains, upgrades kubelet/kubectl, restarts kubelet, and uncordons."
                }
        ],
        keyMechanisms: [
                {
                        "title": "The Version Skew Policy",
                        "detail": "kubelet cannot be newer than kube-apiserver, and kube-apiserver can only be up to 3 minor versions ahead of worker node kubelets (n-3)."
                },
                {
                        "title": "Kubeadm Upgrade Apply vs Node",
                        "detail": "`kubeadm upgrade apply` updates cluster-wide configs and control plane static pod manifests; `kubeadm upgrade node` applies local node-specific configuration."
                },
                {
                        "title": "Static Pod Manifest Replacement",
                        "detail": "Kubeadm writes updated manifests to `/etc/kubernetes/manifests/`. Kubelet detects file modification and automatically restarts apiserver, controller-manager, and scheduler."
                }
        ],
        productionTips: [
                "CKA Exam Critical Sequence: Always unhold apt packages before upgrading: `apt-mark unhold kubeadm && apt-get install -y kubeadm=1.31.0-00 && apt-mark hold kubeadm`. Repeat for kubelet and kubectl.",
                "Never run `kubeadm upgrade apply` on secondary control plane nodes or worker nodes! Run `kubeadm upgrade apply` ONLY on the first control plane node; use `kubeadm upgrade node` on all subsequent nodes.",
                "Always check `kubectl get nodes` after upgrading each node to verify that it reports the new version and returns to `Ready` status before moving to the next node."
        ],
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
                whatIsIt: "The systematic troubleshooting methodology and diagnostics toolkit used by senior Kubernetes administrators to triage and remediate critical cluster breakdowns including expired TLS certificates, kubelet crashes, apiserver failures, and CNI partitioning.",
        inSimpleWords: "The emergency room protocol for a dead Kubernetes cluster. A structured decision tree that checks certificates, system logs, container runtimes, and networking to revive a cluster that has completely stopped responding.",
        realWorldAnalogy: {
                "metaphor": "A forensic aircraft crash investigation or ER triage checklist",
                "explanation": "Paramedics do not guess. They follow ABC: Airway, Breathing, Circulation. In Kubernetes, SREs check: systemd kubelet service, TLS certificate expiration dates, static pod manifests, and CNI network routing."
        },
        whenToUse: [
                "Emergency response when `kubectl` commands fail with connection refused or TLS handshake timeouts across the cluster",
                "Diagnosing Nodes stuck in `NotReady` state or Pods failing to schedule with CNI network plugin errors",
                "Annual renewal of expiring cluster internal TLS certificates generated by kubeadm"
        ],
        whenNotToUse: [
                "Blindly restarting control plane nodes or wiping etcd directories without gathering systemd and container runtime logs first",
                "Modifying production static pod manifests with untested edits during an active incident without saving backup copies",
                "Running destructive commands like `kubeadm reset` on production nodes before diagnosing simple configuration or network errors"
        ],
        lifecycleSteps: [
                {
                        "step": 1,
                        "title": "Node & Service Layer Inspection",
                        "description": "Admin SSHs to failing node and checks systemd daemon status: `systemctl status kubelet` and examines recent journal errors via `journalctl -u kubelet -e`."
                },
                {
                        "step": 2,
                        "title": "TLS Certificate Expiration Audit",
                        "description": "Admin checks control plane certs: `kubeadm certs check-expiration`. If expired, runs `kubeadm certs renew all` and restarts control plane static pods."
                },
                {
                        "step": 3,
                        "title": "Runtime Static Pod Diagnostics",
                        "description": "If apiserver is down, admin uses low-level CRI CLI directly: `crictl ps -a` to locate stopped static pod containers and `crictl logs <id>` to inspect failure logs."
                },
                {
                        "step": 4,
                        "title": "CNI & Network Verification",
                        "description": "Admin verifies `/etc/cni/net.d/` configuration, checks CoreDNS pods, and inspects node IP routing tables and security group firewall rules."
                }
        ],
        keyMechanisms: [
                {
                        "title": "The Static Pod Manifest Directory",
                        "detail": "Control plane pods run directly from `/etc/kubernetes/manifests/`. Syntax errors, bad port bindings, or wrong flag arguments in these YAML files halt the entire control plane."
                },
                {
                        "title": "Low-Level CRI Debugging with crictl",
                        "detail": "When kube-apiserver is down, `kubectl` cannot connect. SREs use `crictl` to interact directly with containerd/CRI-O on the local host."
                },
                {
                        "title": "Kubelet Bootstrap Kubeconfig & PKI",
                        "detail": "Kubelet relies on `/etc/kubernetes/kubelet.conf` and `/etc/kubernetes/pki/` certificates; corrupt client certificates prevent nodes from reporting Ready."
                }
        ],
        productionTips: [
                "CKA Exam Golden Command: If `kubectl` refuses connections on port 6443, run `sudo crictl ps -a` and look for `kube-apiserver`. Run `sudo crictl logs <container-id>` to find the exact crash reason in seconds.",
                "Set calendar reminders to run `kubeadm certs check-expiration`. By default, kubeadm certificates expire after 365 days; running `kubeadm certs renew all` takes 10 seconds and prevents cluster death.",
                "Always check `/var/log/pods` or `journalctl -u kubelet -f` when troubleshooting node NotReady issues; 90% of NotReady states are caused by CNI plugin misconfigurations or disk pressure."
        ],
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
