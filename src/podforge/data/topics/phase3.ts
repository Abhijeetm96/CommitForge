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
      },
    ],
  },
];
