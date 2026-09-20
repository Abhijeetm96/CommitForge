import type { KubeChapter } from './types';

export const PHASE_3_CHAPTERS: KubeChapter[] = [
  {
    id: 'ch06-configuration',
    number: 6,
    title: 'Configuration, Secrets & 12-Factor Apps',
    category: 'Configuration & Security',
    concepts: [
      {
        id: 'c-configmaps-env-files',
        number: '6.1',
        title: 'ConfigMaps: Key-Value & File Mounts',
        commandPill: 'kubectl get configmaps',
        badge: '12-Factor Config',
        difficulty: 'Beginner',
        description: 'Decouple environment-specific configuration artifacts from container image binaries using ConfigMaps.',
        explanation: 'ConfigMaps inject non-confidential configuration data into Pods. You can consume ConfigMaps in four distinct ways: (1) Inside a container command and args; (2) As environment variables for a container via `valueFrom.configMapKeyRef`; (3) Bulk environment injection via `envFrom.configMapRef`; (4) As read-only files in a mounted volume. Setting `immutable: true` prevents accidental changes and substantially reduces apiserver load by disabling watches on the ConfigMap.',
        yamlSnippet: `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: default
data:
  APP_ENV: "production"
  LOG_LEVEL: "info"
  nginx.conf: |
    server {
      listen 80;
      location / {
        return 200 "Hello from PodForge ConfigMap!";
      }
    }`,
        kubectlCommands: ['kubectl get configmaps', 'kubectl describe configmap app-config'],
        visualizerFocus: 'ConfigMap mounted as atomic volume files into /etc/config directory inside container',
        practiceChallenge: {
          instructions: 'Inspect all ConfigMaps present in the default namespace.',
          goalCommand: 'kubectl get configmaps',
          hints: ['Run kubectl get configmaps or kubectl get cm', 'Notice app-config and kube-root-ca.crt'],
        },
        whatIsIt: "A ConfigMap is an API object used to store non-confidential configuration key-value pairs or entire configuration files (e.g. nginx.conf, redis.conf), decoupling application source code and container images from environment-specific configuration artifacts.",
        inSimpleWords: "Think of a container image like a video game console, and a ConfigMap like game settings saved on a memory card (difficulty, audio volume, language). You do not manufacture a different console for every player; you boot the same console and plug in the player settings.",
        realWorldAnalogy: {
                  "metaphor": "Universal Television and Remote Control Picture Presets",
                  "explanation": "The television hardware (container image) is identical in every hotel room. The hotel central management system downloads the hotel-specific welcome channel, channel guide, and volume limits (ConfigMap) into each room upon boot."
        },
        whenToUse: [
                  "Injecting runtime environment variables (DATABASE_URL, LOG_LEVEL, FEATURE_FLAGS) into containers.",
                  "Mounting entire configuration files (e.g. prometheus.yml, nginx.conf) as read-only volumes into /etc/config.",
                  "Marking configuration as immutable: true to prevent accidental mutation and reduce API server watch load."
        ],
        whenNotToUse: [
                  "Storing sensitive credentials, database passwords, private keys, or API tokens (always use Kubernetes Secrets).",
                  "Storing massive binary files or datasets exceeding the 1MB etcd object limit (use PersistentVolumes or S3).",
                  "Configurations that change hundreds of times per second (causes etcd write thrashing)."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "ConfigMap Declaration",
                            "description": "Administrator or CI pipeline applies ConfigMap containing configuration key-value pairs and file blocks."
                  },
                  {
                            "step": 2,
                            "title": "PodSpec Reference Binding",
                            "description": "Pod references ConfigMap via env.valueFrom.configMapKeyRef, envFrom.configMapRef, or volumes.configMap."
                  },
                  {
                            "step": 3,
                            "title": "Atomic Volume Mount / Env Injection",
                            "description": "Kubelet reads ConfigMap data and either populates environment variables at container spawn or projects files as symlinks."
                  },
                  {
                            "step": 4,
                            "title": "Dynamic Volume Update (Symlink Swap)",
                            "description": "When ConfigMap is updated, kubelet atomic symlink swap updates mounted files in the container within ~60 seconds without pod restart."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "Volume Mount Symlinks",
                            "detail": "Mounted ConfigMap files use double-symlinks (..data -> ..2024_09_21 -> file) allowing atomic, zero-tearing updates."
                  },
                  {
                            "title": "immutable: true",
                            "detail": "Freezes ConfigMap content permanently; protects against accidental edits and drops API server watch load to 0."
                  },
                  {
                            "title": "envFrom vs volumeMount",
                            "detail": "Environment variables are evaluated once at container boot (require pod restart to update); volume mounts update dynamically."
                  }
        ],
        productionTips: [
                  "Set immutable: true on ConfigMaps in production GitOps pipelines; create new ConfigMaps with unique hash suffixes (config-v2-a8f3b) to trigger safe rolling updates.",
                  "Remember that environment variables do NOT automatically update when a ConfigMap is changed; only volume mounts update dynamically.",
                  "Use tools like Reloader or Stakater to automatically trigger rolling updates when mounted ConfigMaps change."
        ],
      },
      {
        id: 'c-secrets-security-vault',
        number: '6.2',
        title: 'Secrets: Credentials, TLS & Encryption-at-Rest',
        commandPill: 'kubectl get secrets',
        badge: 'Confidentiality',
        difficulty: 'Intermediate',
        description: 'Manage sensitive passwords, OAuth tokens, and SSH keys. Understand base64 encoding vs etcd KMS encryption and external secret operators.',
        explanation: '`Secrets` store sensitive data like API keys, database credentials, and TLS certificates. By default, Secret data in manifests is encoded in standard Base64 (which is NOT encryption). In production, Kubernetes administrators enable Encryption-at-Rest using KMS plugins (AWS KMS, GCP Cloud KMS, HashiCorp Vault) so etcd stores AES-GCM encrypted ciphertexts. Secrets mounted as tmpfs memory volumes prevent sensitive credentials from ever being written to node disk storage.',
        yamlSnippet: `apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
  namespace: default
type: Opaque
data:
  # Base64 encoded values ("podforge" and "supersecret")
  username: cG9kZm9yZ2U=
  password: c3VwZXJzZWNyZXQ=`,
        kubectlCommands: ['kubectl get secrets', 'kubectl describe secret db-credentials'],
        visualizerFocus: 'Secret keys mapped into container memory without persisting to node storage',
        practiceChallenge: {
          instructions: 'List the Secrets stored in the default namespace.',
          goalCommand: 'kubectl get secrets',
          hints: ['Run kubectl get secrets', 'Look for db-credentials and its TYPE and DATA count'],
        },
        whatIsIt: "A Kubernetes Secret is an object designed to store confidential data such as passwords, OAuth tokens, SSH keys, and TLS certificates, stored as Base64 in manifests and mounted into containers as in-memory tmpfs volumes to prevent disk persistence.",
        inSimpleWords: "A Secret is like a biometric hotel room safe. Regular towels and soap (ConfigMaps) sit on the bathroom shelf in plain view, but your cash and passport (Secrets) are locked inside the safe. Guests can only access the contents with their private keycard.",
        realWorldAnalogy: {
                  "metaphor": "Hotel Room Safe and Encrypted Vault Deposits",
                  "explanation": "You do not write your credit card number on a sticky note pasted to the hotel door. You lock it in the room safe. Inside the cluster, secrets are kept in memory (tmpfs) and never written to the physical server hard drive."
        },
        whenToUse: [
                  "Injecting database passwords, API secret tokens, and OAuth credentials into application pods.",
                  "Storing TLS certificate pairs (tls.crt, tls.key) for Ingress controllers and HTTPS endpoints.",
                  "Storing container registry pull credentials (kubernetes.io/dockerconfigjson) to pull private images."
        ],
        whenNotToUse: [
                  "Treating raw Kubernetes Secrets as secure by default without configuring KMS Encryption-at-Rest in etcd.",
                  "Committing raw Secret YAML files with Base64 strings into public or private Git repositories (Base64 is obfuscation, NOT encryption).",
                  "Storing non-confidential application settings (use ConfigMaps instead to avoid security audit noise)."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "Base64 Ingestion & API Submission",
                            "description": "Secret manifest is submitted; apiserver decodes Base64 to verify schema and size constraints (< 1MB)."
                  },
                  {
                            "step": 2,
                            "title": "KMS Encryption at Rest",
                            "description": "Kube-apiserver invokes the KMS plugin (AWS KMS, GCP Cloud KMS, HashiCorp Vault) to encrypt plaintext before writing to etcd."
                  },
                  {
                            "step": 3,
                            "title": "In-Memory tmpfs Projection",
                            "description": "When a Pod mounts the Secret, kubelet mounts it into an in-memory tmpfs volume, ensuring it never touches the host hard drive."
                  },
                  {
                            "step": 4,
                            "title": "Pod Teardown Wiping",
                            "description": "When the Pod terminates, the tmpfs memory is zeroed out and unmounted, leaving zero forensic trace on the node disk."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "Base64 vs Encryption",
                            "detail": "Base64 encoding is merely a transport serialization format; genuine security requires etcd EncryptionConfiguration with KMS."
                  },
                  {
                            "title": "Secret Types",
                            "detail": "Opaque (arbitrary user data), kubernetes.io/tls (TLS cert/key), kubernetes.io/dockerconfigjson (registry auth), kubernetes.io/service-account-token."
                  },
                  {
                            "title": "External Secrets Operator (ESO)",
                            "detail": "Industry best-practice controller that synchronizes secrets from AWS Secrets Manager, GCP Secret Manager, or HashiCorp Vault."
                  }
        ],
        productionTips: [
                  "Never commit Secrets to git; use SealedSecrets or External Secrets Operator (ESO) to pull credentials from enterprise vaults.",
                  "Always verify that KMS Encryption-at-Rest is active in your cluster by checking etcd raw keys (/registry/secrets/...) for encryption headers.",
                  "Mount secrets as volumes rather than environment variables to prevent credentials from leaking into crash reports and docker inspect."
        ],
      },
      {
        id: 'c-downward-api',
        number: '6.3',
        title: 'Downward API: Introspection Without Clients',
        commandPill: 'kubectl explain pod.spec.containers.env.valueFrom.fieldRef',
        badge: 'Introspection',
        difficulty: 'Intermediate',
        description: 'Expose Pod and container metadata (Pod IP, Node name, namespace, CPU/memory limits) directly to application code.',
        explanation: 'Applications frequently need to know their own runtime context—such as their Pod IP for clustering, the Node they are running on, or their cgroup memory limits to configure JVM heap sizes (`-Xmx`). Rather than linking Kubernetes client libraries and granting RBAC permissions, the `Downward API` injects these system metadata fields directly as environment variables (`fieldRef`, `resourceFieldRef`) or mounted files without exposing credentials or apiserver dependencies.',
        yamlSnippet: `apiVersion: v1
kind: Pod
metadata:
  name: downward-api-demo
spec:
  containers:
  - name: app
    image: busybox:1.36
    env:
    - name: MY_POD_NAME
      valueFrom:
        fieldRef:
          fieldPath: metadata.name
    - name: MY_POD_IP
      valueFrom:
        fieldRef:
          fieldPath: status.podIP
    - name: MY_NODE_NAME
      valueFrom:
        fieldRef:
          fieldPath: spec.nodeName`,
        kubectlCommands: ['kubectl get pods', 'kubectl describe pod web-frontend'],
        visualizerFocus: 'Runtime Pod IP and Node Name injected into container environment variables',
        practiceChallenge: {
          instructions: 'Inspect the pod metadata and status IP of web-frontend.',
          goalCommand: 'kubectl describe pod web-frontend',
          hints: ['Run kubectl describe pod web-frontend', 'Notice the IP and Node fields'],
        },
        whatIsIt: "The Downward API is a Kubernetes mechanism that allows containers to consume information about themselves and their runtime environment (Pod name, namespace, Pod IP, node name, CPU/memory limits) without coupling to the Kubernetes client library or requiring cluster RBAC permissions.",
        inSimpleWords: "Think of the Downward API like a digital dashboard inside an airplane cockpit. The pilot does not need to radio corporate headquarters just to ask: \"What is our current altitude and airspeed?\" The dashboard displays the plane internal telemetry directly on the console screen.",
        realWorldAnalogy: {
                  "metaphor": "Car Speedometer and GPS Dashboard",
                  "explanation": "Your car dashboard tells you your current vehicle speed and tire pressure directly from internal sensors. It does not need to connect to the Department of Transportation servers to figure out how fast you are driving."
        },
        whenToUse: [
                  "Injecting the Pod IP (status.podIP) into clustered applications (Cassandra, Akka, Elasticsearch) for peer discovery.",
                  "Injecting cgroup CPU and memory limits (resourceFieldRef) into JVM or Node.js runtime flags (-Xmx) for optimal garbage collection.",
                  "Logging the current Pod name and Node name in structured application logs for distributed tracing forensics."
        ],
        whenNotToUse: [
                  "Attempting to query cluster-wide information about other pods or services (use the Kubernetes API client for cluster queries).",
                  "Fields that change after container startup when consumed as environment variables (env vars are immutable after container boot).",
                  "Complex operational automation that requires active event watching."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "FieldRef & ResourceFieldRef Spec",
                            "description": "Pod author declares environment variables or downwardAPI volume items referencing metadata or status paths."
                  },
                  {
                            "step": 2,
                            "title": "Scheduler Binding & Status Population",
                            "description": "Once scheduled, kube-apiserver populates status.podIP, spec.nodeName, and metadata.uid on the Pod object."
                  },
                  {
                            "step": 3,
                            "title": "Kubelet Injection at Container Spawn",
                            "description": "Kubelet extracts the resolved fields and injects them as OS environment variables or writes them to projected files."
                  },
                  {
                            "step": 4,
                            "title": "Runtime Application Consumption",
                            "description": "Application reads process.env.MY_POD_IP or reads /etc/podinfo/labels directly using standard filesystem calls."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "fieldRef (Metadata & Status)",
                            "detail": "Exposes metadata.name, metadata.namespace, metadata.uid, metadata.labels, metadata.annotations, status.podIP, spec.nodeName."
                  },
                  {
                            "title": "resourceFieldRef (Container Limits)",
                            "detail": "Exposes requests.cpu, limits.cpu, requests.memory, limits.memory with custom divisor formatting (e.g. 1Mi)."
                  },
                  {
                            "title": "downwardAPI Volume Plugin",
                            "detail": "Mounts dynamically updating files under /etc/podinfo, allowing annotations and labels to update live without pod restart."
                  }
        ],
        productionTips: [
                  "Always pass container memory limits to Java applications via Downward API to configure -XX:MaxRAMPercentage=75.0 and prevent OOMKilled crashes.",
                  "Include status.podIP and spec.nodeName in your application structured JSON logs to drastically simplify log correlation during production outages.",
                  "Mount labels and annotations via a downwardAPI volume if your application needs to react to live metadata changes without restarting."
        ],
      },
    ],
  },
  {
    id: 'ch07-networking',
    number: 7,
    title: 'Services, Networking & Ingress Routing',
    category: 'Networking & Discovery',
    concepts: [
      {
        id: 'c-k8s-networking-model',
        number: '7.1',
        title: 'The Kubernetes Networking Model',
        commandPill: 'kubectl get pods -o wide',
        badge: 'Flat Network',
        difficulty: 'Intermediate',
        description: 'The fundamental networking philosophy: IP-per-pod, every pod communicates with every other pod across nodes without NAT.',
        explanation: 'Kubernetes imposes three strict networking requirements: (1) All pods can communicate with all other pods on any node without NAT; (2) All agents on a node (e.g. kubelet) can communicate with all pods on that node; (3) The IP that a pod sees for itself is the same IP that others see for it. Container Network Interface (CNI) plugins (Cilium, Calico, Flannel) implement this using encapsulation overlays (VXLAN, Geneve) or native routing (BGP, VPC CNI) to allocate unique IP addresses from a cluster-wide CIDR block.',
        yamlSnippet: `# Concept: Pod-to-Pod Communication
# Pod A (10.244.1.15) on Node 1 -> CNI veth pair
# -> Node 1 bridge/eBPF routing
# -> Physical Network (VXLAN/Geneve)
# -> Node 2 CNI routing -> Pod B (10.244.2.22)
# No port mapping or NAT required!`,
        kubectlCommands: ['kubectl get pods -o wide', 'kubectl get nodes -o jsonpath="{.items[*].spec.podCIDR}"'],
        visualizerFocus: 'Overlay network assigning unique IP addresses across different physical worker nodes',
        practiceChallenge: {
          instructions: 'List all running pods with wide output to see their allocated internal IP addresses and nodes.',
          goalCommand: 'kubectl get pods -o wide',
          hints: ['Run kubectl get pods -o wide', 'Look at the IP and NODE columns'],
        },
        whatIsIt: "The Kubernetes Networking Model is an IP-per-Pod, flat address space networking paradigm where every Pod in a cluster receives a unique, fully routable IP address and can communicate with every other Pod across any node without Network Address Translation (NAT).",
        inSimpleWords: "Think of the Kubernetes network like a modern telephone system. Every employee in every branch office has their own direct personal telephone extension. Employee A in New York can dial Employee B in London directly without having to go through a main switchboard or share an office line.",
        realWorldAnalogy: {
                  "metaphor": "Direct Dial Telephone Extensions across a Global Enterprise",
                  "explanation": "In older networking models, you had to map ports (HostPort), like asking for the main building and specifying an extension. In Kubernetes, every desk has its own direct external phone number—no port conflicts, no NAT gymnastics."
        },
        whenToUse: [
                  "Designing microservices architectures with seamless direct service-to-service communication.",
                  "Implementing high-performance east-west cluster traffic routing with minimal packet processing overhead.",
                  "Configuring CNI plugins (Cilium, Calico, Flannel, AWS VPC CNI) to enforce network security policies and routing."
        ],
        whenNotToUse: [
                  "Assuming that pod IPs are static or persistent across restarts (pod IPs are ephemeral; always front them with a Service).",
                  "Configuring hostPort or hostNetwork unless writing low-level system daemons that require direct host interface access.",
                  "Overlapping Pod CIDR blocks with your corporate enterprise on-premises network subnets."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "Pod Sandbox Creation",
                            "description": "Kubelet creates the Pod sandbox and invokes the CNI plugin via the Container Network Interface specification."
                  },
                  {
                            "step": 2,
                            "title": "veth Pair Generation",
                            "description": "CNI creates a virtual ethernet (veth) pair: one end moves into the Pod network namespace, the other attaches to the node bridge/eBPF."
                  },
                  {
                            "step": 3,
                            "title": "IPAM Address Allocation",
                            "description": "CNI IPAM (IP Address Management) plugin allocates a unique IP address from the node assigned podCIDR block."
                  },
                  {
                            "step": 4,
                            "title": "Route Table & Mesh Convergence",
                            "description": "Routing rules or BGP/VXLAN mesh entries are updated so all other cluster nodes know how to route packets to this new IP."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "The 3 Golden Rules",
                            "detail": "1. All pods communicate with all pods without NAT. 2. All nodes communicate with all pods without NAT. 3. The IP a pod sees for itself is what others see."
                  },
                  {
                            "title": "Overlay vs Underlay CNI",
                            "detail": "Overlay (VXLAN/Geneve) encapsulates packets inside UDP headers; Underlay (BGP/VPC CNI) routes native VPC IP addresses with zero packet overhead."
                  },
                  {
                            "title": "eBPF Routing (Cilium)",
                            "detail": "Bypasses the traditional Linux iptables networking stack entirely, routing packets directly between socket buffers in the Linux kernel."
                  }
        ],
        productionTips: [
                  "Use AWS VPC CNI or Azure CNI for cloud workloads to give pods native VPC IP addresses and eliminate overlay encapsulation latency.",
                  "Carefully size your Pod CIDR (/16 provides 65,536 IPs); running out of pod IP addresses halts all cluster deployments.",
                  "Adopt Cilium with eBPF for massive clusters (> 5,000 pods) to achieve 2x lower networking latency and eliminate iptables scaling bottlenecks."
        ],
      },
      {
        id: 'c-service-types-deepdive',
        number: '7.2',
        title: 'Service Types: ClusterIP, NodePort, LoadBalancer',
        commandPill: 'kubectl get svc',
        badge: 'Traffic Routing',
        difficulty: 'Beginner',
        description: 'Provide durable IP addresses and DNS names for dynamic ephemeral pods. Master ClusterIP, NodePort, and LoadBalancer.',
        explanation: 'Because pods are ephemeral and their IPs constantly change, `Services` provide a stable virtual IP (VIP) and DNS entry that automatically load-balances traffic across matching pods via endpoints. `ClusterIP` (default) exposes the service on an internal-only cluster IP. `NodePort` exposes the service on each node\'s static IP at a high port range (30000-32767). `LoadBalancer` integrates with cloud providers (AWS NLB, GCP Cloud LB) to provision an external public IP routing into the NodePorts.',
        yamlSnippet: `apiVersion: v1
kind: Service
metadata:
  name: frontend-svc
  namespace: default
spec:
  type: ClusterIP
  selector:
    app: frontend-web
  ports:
  - name: http
    port: 80         # Port exposed on the Service ClusterIP
    targetPort: 80   # Port application container listens on inside Pod
    protocol: TCP`,
        kubectlCommands: ['kubectl get svc', 'kubectl describe svc frontend-svc', 'kubectl get endpoints'],
        visualizerFocus: 'Service VIP load balancing layer routing traffic across backend healthy Pod endpoints',
        practiceChallenge: {
          instructions: 'Query all services running in the cluster to inspect their ClusterIP and Port bindings.',
          goalCommand: 'kubectl get svc',
          hints: ['Run kubectl get svc or kubectl get services', 'Notice TYPE and CLUSTER-IP columns'],
        },
        whatIsIt: "A Kubernetes Service is an abstract resource that defines a logical set of Pods and a policy by which to access them, providing a stable virtual IP (VIP) and DNS record that load-balances traffic across dynamic, ephemeral backend pod endpoints.",
        inSimpleWords: "Think of a Service like the customer service hotline for a bank (1-800-BANK). Customers dial the single memorable hotline number (Service VIP). Behind the scenes, the call is automatically routed to whichever call center representative (Pod) is currently available.",
        realWorldAnalogy: {
                  "metaphor": "Corporate Toll-Free Call Center Hotline",
                  "explanation": "Customer service agents clock in, take breaks, and go home (pods restarting). Customers never memorize an individual agent desk phone; they call the master 1-800 number (Service ClusterIP) and are seamlessly connected."
        },
        whenToUse: [
                  "ClusterIP: Internal east-west communication between backend microservices, databases, and message queues.",
                  "NodePort: Exposing services on static high ports (30000-32767) across all worker nodes for on-premises bare-metal access.",
                  "LoadBalancer: Exposing public-facing services directly through cloud provider native load balancers (AWS NLB/ALB, GCP Cloud LB)."
        ],
        whenNotToUse: [
                  "Creating hundreds of cloud LoadBalancers for individual microservices (prohibitive cloud costs; use a single Ingress/Gateway instead).",
                  "Exposing NodePorts directly to the public internet without external firewall security groups.",
                  "Using Services for stateful peer-to-peer clustering where unique pod addressing is required (use Headless Services with clusterIP: None)."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "Service Manifest Application",
                            "description": "Operator applies Service with selector: app: frontend. API server allocates a virtual IP from service-cluster-ip-range."
                  },
                  {
                            "step": 2,
                            "title": "EndpointSlice Discovery & Sync",
                            "description": "EndpointSlice controller queries pods matching the selector and compiles a list of healthy, ready IP:port tuples."
                  },
                  {
                            "step": 3,
                            "title": "Data Plane Rule Programming",
                            "description": "kube-proxy on every node detects the service and configures iptables/IPVS rules (or Cilium eBPF map entries)."
                  },
                  {
                            "step": 4,
                            "title": "Traffic Packet Translation (DNAT)",
                            "description": "When a packet hits the Service VIP, the kernel executes DNAT (Destination NAT), transparently rewriting the VIP to a healthy Pod IP."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "ClusterIP Virtual IP (VIP)",
                            "detail": "A purely virtual IP managed in kernel packet filters; no physical network interface ever holds this IP address."
                  },
                  {
                            "title": "EndpointSlices",
                            "detail": "Scalable successor to Endpoints that groups backend IPs in batches of 100, preventing massive API server update storms."
                  },
                  {
                            "title": "sessionAffinity: ClientIP",
                            "detail": "Routes requests from the same client IP to the same backend pod for sticky session support."
                  }
        ],
        productionTips: [
                  "Always use ClusterIP for internal services; never expose backend databases or internal APIs as NodePort or LoadBalancer.",
                  "Switch kube-proxy to IPVS mode or use eBPF when running more than 1,000 services to prevent iptables linear search latency.",
                  "Use externalTrafficPolicy: Local on LoadBalancer services to preserve client source IP addresses and eliminate extra inter-node hops."
        ],
      },
      {
        id: 'c-coredns-discovery',
        number: '7.3',
        title: 'In-Cluster DNS & CoreDNS Resolution',
        commandPill: 'kubectl get pods -n kube-system -l k8s-app=kube-dns',
        badge: 'Service Discovery',
        difficulty: 'Intermediate',
        description: 'How pods discover services using CoreDNS FQDNs: <service>.<namespace>.svc.cluster.local, search domains, and ndots:5.',
        explanation: 'Every Kubernetes cluster runs an internal DNS server (`CoreDNS`). When a service is created, CoreDNS creates an A/AAAA record mapping `<service-name>.<namespace>.svc.cluster.local` to its virtual ClusterIP. Pods within the same namespace can connect using just `<service-name>`. Pods in different namespaces use `<service-name>.<namespace>`. The `/etc/resolv.conf` inside containers configures `search` domains and `options ndots:5`, causing relative queries to query local namespaces first before hitting external DNS.',
        yamlSnippet: `# /etc/resolv.conf generated inside Pod:
# nameserver 10.96.0.10
# search default.svc.cluster.local svc.cluster.local cluster.local
# options ndots:5
#
# Resolution Rules:
# 'frontend-svc'               -> Resolves in same namespace
# 'postgres.production'        -> Resolves in 'production' namespace
# 'api.prod.svc.cluster.local' -> Full Qualified Domain Name (FQDN)`,
        kubectlCommands: ['kubectl get svc -A', 'kubectl get pods -n kube-system -l k8s-app=kube-dns'],
        visualizerFocus: 'CoreDNS translating human-readable service names into virtual ClusterIPs',
        practiceChallenge: {
          instructions: 'Inspect the frontend service to review its selector and target endpoints.',
          goalCommand: 'kubectl describe svc frontend-svc',
          hints: ['Run kubectl describe svc frontend-svc', 'Check Endpoints: list showing pod IPs and ports'],
        },
        whatIsIt: "CoreDNS is the authoritative internal DNS server in Kubernetes that automatically provisions and resolves DNS records for Services and Pods, enabling seamless service discovery using human-readable domain names across namespaces.",
        inSimpleWords: "Think of CoreDNS like the internal phone directory and GPS system of the cluster. Instead of services memorizing changing IP addresses (like 10.244.3.49), they simply ask CoreDNS for \"payment-service\" and CoreDNS returns the exact current IP in milliseconds.",
        realWorldAnalogy: {
                  "metaphor": "Corporate Internal Phonebook and Directory Assistance",
                  "explanation": "When you join a company, you do not need to memorize every employee mobile phone number. You open the corporate directory, type \"Marketing Department\", and the system instantly connects you to the active team line."
        },
        whenToUse: [
                  "Enabling seamless microservice discovery using predictable FQDNs: <service>.<namespace>.svc.cluster.local.",
                  "Configuring multi-namespace communication: pods in the \"web\" namespace connecting to \"db.production\".",
                  "Customizing upstream DNS forwarding, caching TTLs, and rewrite rules via the CoreDNS Corefile ConfigMap."
        ],
        whenNotToUse: [
                  "Using short relative service names when connecting across different namespaces (always specify service.namespace).",
                  "Overloading CoreDNS with thousands of external domain lookups that could be handled by local caching daemons (NodeLocal DNSCache).",
                  "Hardcoding virtual ClusterIP addresses in application code instead of using DNS names."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "Service Creation Event",
                            "description": "When a Service is created, CoreDNS watches the apiserver and registers an A/AAAA record for <svc>.<ns>.svc.cluster.local."
                  },
                  {
                            "step": 2,
                            "title": "Container DNS Auto-Configuration",
                            "description": "Kubelet injects nameserver <coredns-vip> and search domains into each container /etc/resolv.conf during creation."
                  },
                  {
                            "step": 3,
                            "title": "Relative Name Search Expansion",
                            "description": "When an app queries \"postgres\", the resolver checks postgres.default.svc.cluster.local, matching the local namespace record."
                  },
                  {
                            "step": 4,
                            "title": "Upstream Forwarding",
                            "description": "Queries for external domains (e.g. api.github.com) are forwarded to upstream enterprise or cloud DNS resolvers configured in the Corefile."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "Corefile Configuration",
                            "detail": "The configuration file in kube-system/coredns ConfigMap defining plugins: errors, health, kubernetes, prometheus, forward, cache."
                  },
                  {
                            "title": "ndots:5 Optimization Problem",
                            "detail": "Default glibc resolver checks all search domains before querying external domains, multiplying DNS queries by 5 for external lookups."
                  },
                  {
                            "title": "NodeLocal DNSCache",
                            "detail": "Runs a DNS caching agent as a DaemonSet on every node to intercept DNS traffic locally and eliminate network latency."
                  }
        ],
        productionTips: [
                  "Deploy NodeLocal DNSCache in high-throughput clusters to eliminate CoreDNS connection tracking (conntrack) race conditions and 5-second DNS timeouts.",
                  "Append a trailing dot to external domain names in code (e.g. api.stripe.com.) to bypass the ndots search path evaluation and save 4 round-trips.",
                  "Scale CoreDNS replicas proportionally with cluster size using the cluster-proportional-autoscaler."
        ],
      },
      {
        id: 'c-ingress-controllers-tls',
        number: '7.4',
        title: 'Ingress Controllers & Path-Based Routing',
        commandPill: 'kubectl get ingress',
        badge: 'Layer 7 Routing',
        difficulty: 'Intermediate',
        description: 'Route HTTP/HTTPS traffic from outside the cluster to services inside the cluster with host/path routing and TLS SNI termination.',
        explanation: 'Creating a cloud LoadBalancer for every single microservice is costly and wasteful. An `Ingress` resource is an API object that defines Layer 7 HTTP/HTTPS routing rules. An `Ingress Controller` (such as ingress-nginx, Traefik, or HAProxy) runs as a reverse proxy monitoring Ingress resources. It terminates SSL/TLS using certificates stored in Kubernetes Secrets and routes traffic by hostname (`api.example.com`) and URI path (`/checkout`, `/auth`) to backend ClusterIP Services.',
        yamlSnippet: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: main-ingress
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - api.podforge.io
    secretName: podforge-tls-cert
  rules:
  - host: api.podforge.io
    http:
      paths:
      - path: /v1
        pathType: Prefix
        backend:
          service:
            name: frontend-svc
            port:
              number: 80`,
        kubectlCommands: ['kubectl get ingress', 'kubectl describe ingress main-ingress'],
        visualizerFocus: 'Ingress controller routing external domain traffic through path rules to services',
        practiceChallenge: {
          instructions: 'Check for any Ingress resources configured in the cluster.',
          goalCommand: 'kubectl get ingress',
          hints: ['Run kubectl get ingress or kubectl get ing', 'Look for HOSTS, ADDRESS, and PORTS'],
        },
        whatIsIt: "An Ingress is an API resource that defines Layer 7 HTTP/HTTPS routing rules (host-based, path-based, TLS SNI), implemented by an Ingress Controller (such as ingress-nginx, Traefik, or HAProxy) that acts as an intelligent reverse proxy managing inbound traffic to cluster Services.",
        inSimpleWords: "Think of an Ingress Controller like the grand entrance lobby and concierge desk of a luxury skyscraper. Visitors do not drive cars directly into individual apartment living rooms; they enter through the secure main lobby, present their tickets, and the concierge directs them to the correct elevator and floor.",
        realWorldAnalogy: {
                  "metaphor": "Grand Hotel Reception Desk and Room Direction Signs",
                  "explanation": "All hotel guests enter through the front doors (single LoadBalancer IP). The receptionist checks the guest name (hostname) and destination (path /spa, /restaurant, /rooms) and directs them down the correct hallway (Service)."
        },
        whenToUse: [
                  "Consolidating dozens of HTTP/HTTPS microservices behind a single public cloud LoadBalancer to save infrastructure costs.",
                  "Routing traffic based on hostnames (api.example.com vs app.example.com) and URI paths (/checkout, /billing).",
                  "Terminating SSL/TLS certificates centrally using automated Let's Encrypt certificates managed by cert-manager."
        ],
        whenNotToUse: [
                  "Routing non-HTTP protocols like raw TCP database connections, gRPC streaming, or UDP game traffic (use LoadBalancer or Gateway API).",
                  "Simple single-service applications where a direct LoadBalancer service is cleaner.",
                  "Complex multi-protocol service mesh architectures requiring advanced canary traffic splitting (use Gateway API or Istio)."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "Ingress Resource Deployment",
                            "description": "Developer creates an Ingress manifest defining host rules, path prefixes, TLS secrets, and target Services."
                  },
                  {
                            "step": 2,
                            "title": "Ingress Controller Watch Event",
                            "description": "The Ingress Controller daemon watches Ingress objects and dynamically reconfigures its internal NGINX/Envoy routing tables."
                  },
                  {
                            "step": 3,
                            "title": "TLS Certificate Decryption",
                            "description": "External HTTPS requests hit the controller; the controller performs TLS SNI handshake using the secretName certificate."
                  },
                  {
                            "step": 4,
                            "title": "Direct Endpoints Forwarding",
                            "description": "Controller proxies the HTTP request directly to target Pod IP addresses, bypassing kube-proxy for lower latency and sticky sessions."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "ingressClassName",
                            "detail": "Disambiguates which controller implements the rules (e.g. ingressClassName: nginx vs ingressClassName: traefik)."
                  },
                  {
                            "title": "PathType (Exact vs Prefix)",
                            "detail": "Prefix matches all sub-paths (/api matches /api/v1 and /api/users); Exact matches only the precise literal path."
                  },
                  {
                            "title": "cert-manager Integration",
                            "detail": "Annotations like cert-manager.io/cluster-issuer: letsencrypt-prod automate zero-touch TLS certificate issuance and renewal."
                  }
        ],
        productionTips: [
                  "Always configure cert-manager with Let's Encrypt to automate TLS renewal 30 days before expiration and eliminate expired certificate outages.",
                  "Set proxy-buffer-size and client-max-body-size annotations in NGINX Ingress to prevent 502 Bad Gateway and 413 Payload Too Large errors.",
                  "Use distinct ingressClassNames if running internal-only (private VPC) and external-facing (public internet) ingress controllers in the same cluster."
        ],
      },
      {
        id: 'c-gateway-api-modern',
        number: '7.5',
        title: 'The Modern Gateway API Architecture',
        commandPill: 'kubectl get gatewayclasses,gateways,httproutes',
        badge: 'Next-Gen L7',
        difficulty: 'Advanced',
        description: 'The successor to Ingress: role-oriented routing, GatewayClass, Gateway, and cross-namespace HTTPRoutes.',
        explanation: 'The classic Ingress API suffered from vendor-specific annotation bloat and lacked role separation. The `Kubernetes Gateway API` is an expressive, role-oriented standard that splits networking into three distinct personas: (1) Infrastructure Provider defines `GatewayClass` (e.g. Istio, Envoy, Cilium); (2) Cluster Operator defines `Gateway` (declares listeners, ports, TLS certificates); (3) Application Developer defines `HTTPRoute`, `GRPCRoute`, or `TCPRoute` attached to Gateways, enabling cross-namespace routing, header-based canary matching, and request rewrites without annotations.',
        yamlSnippet: `apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: api-routing
  namespace: default
spec:
  parentRefs:
  - name: prod-gateway
  hostnames:
  - "api.podforge.io"
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /users
    backendRefs:
    - name: user-service
      port: 8080
      weight: 90
    - name: user-service-canary
      port: 8080
      weight: 10`,
        kubectlCommands: ['kubectl get gatewayclasses', 'kubectl get httproutes'],
        visualizerFocus: 'Gateway API splitting infrastructure Gateway listeners from application HTTPRoute rules',
        practiceChallenge: {
          instructions: 'Query the cluster for any GatewayClass resources.',
          goalCommand: 'kubectl get gatewayclasses',
          hints: ['Run kubectl get gatewayclasses', 'Observe the CONTROLLER and ACCEPTED status'],
        },
        whatIsIt: "The Kubernetes Gateway API is the official next-generation, expressive, and role-oriented networking standard designed to replace the classic Ingress API, providing clear role separation across Infrastructure Providers, Cluster Operators, and Application Developers.",
        inSimpleWords: "If classic Ingress is like a single shared landlord whiteboard where everyone writes conflicting notes and annotations with messy markers, Gateway API is like a modern digital leasing system with separate permissions for the property owner (GatewayClass), building manager (Gateway), and individual tenants (HTTPRoute).",
        realWorldAnalogy: {
                  "metaphor": "Commercial Airport Infrastructure vs Airline Tenant Gates",
                  "explanation": "The city port authority builds the airport runways and terminals (GatewayClass). The airport operations director assigns terminal gates and power lines (Gateway). Individual airlines (United, Delta) configure their own flight schedules and passenger boarding queues at their assigned gates (HTTPRoute)."
        },
        whenToUse: [
                  "Modern microservices architectures requiring advanced Layer 7 routing: header-based matching, query param routing, traffic splitting (canary 90/10), and request rewrites without vendor-specific annotations.",
                  "Cross-namespace routing where central platform teams manage the shared public Gateway and application teams define their own routes in their own namespaces.",
                  "Multi-protocol clusters routing HTTP, gRPC (GRPCRoute), TCP (TCPRoute), and TLS (TLSRoute) through a unified API."
        ],
        whenNotToUse: [
                  "Legacy Kubernetes clusters running versions prior to v1.26 without Gateway API CRDs installed.",
                  "Extremely basic web applications where a simple Ingress resource is already functioning perfectly.",
                  "Environments lacking a Gateway API compliant controller (Envoy Gateway, Cilium, Istio, Kong)."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "GatewayClass Registration",
                            "description": "Platform vendor or infrastructure team installs the controller and registers a GatewayClass (e.g. cilium, istio, envoy)."
                  },
                  {
                            "step": 2,
                            "title": "Gateway Listener Instantiation",
                            "description": "Cluster operator deploys a Gateway specifying listeners (ports 80, 443), allowed route namespaces, and TLS certs."
                  },
                  {
                            "step": 3,
                            "title": "HTTPRoute Attachment",
                            "description": "Application teams deploy HTTPRoutes in their own namespaces referencing the central Gateway via parentRefs."
                  },
                  {
                            "step": 4,
                            "title": "Traffic Splitting & Execution",
                            "description": "Controller continuously validates cross-namespace route bindings and enforces advanced traffic weighting and filter policies."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "Role-Oriented Architecture",
                            "detail": "GatewayClass (Infra Provider) -> Gateway (Cluster Admin) -> HTTPRoute / GRPCRoute (App Developer)."
                  },
                  {
                            "title": "Native Traffic Splitting",
                            "detail": "Built-in backendRefs with weight parameters (e.g. 90% stable, 10% canary) without requiring complex service mesh setups."
                  },
                  {
                            "title": "Cross-Namespace Routing (ReferenceGrant)",
                            "detail": "Allows Gateways in one namespace to route to Services in another namespace only when explicitly authorized by a ReferenceGrant."
                  }
        ],
        productionTips: [
                  "Adopt Gateway API for all new Kubernetes projects; it is the official long-term future of Kubernetes service networking.",
                  "Use ReferenceGrant to enforce strict cross-namespace security boundaries so unauthorized teams cannot hijack public gateway paths.",
                  "Leverage GRPCRoute for cloud-native microservices to get native gRPC status code matching and header routing without custom EnvoyFilters."
        ],
      },
    ],
  },
];
