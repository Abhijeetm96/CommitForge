import type { KubeChapter } from './types';

export const PHASE_5_CHAPTERS: KubeChapter[] = [
  {
    id: 'ch10-security-rbac',
    number: 10,
    title: 'Security, Authentication & RBAC',
    category: 'Security & Governance',
    concepts: [
      {
        id: 'c-auth-serviceaccounts',
        number: '10.1',
        title: 'Authentication & ServiceAccounts',
        commandPill: 'kubectl get serviceaccounts',
        badge: 'Identity & Auth',
        difficulty: 'Intermediate',
        description: 'Provide machine identities for Pods to interact with the Kubernetes API using ServiceAccount tokens and projected volumes.',
        explanation: 'In Kubernetes, human users authenticate via external identity providers (OIDC, X.509 client certificates, LDAP), whereas Pods authenticate using `ServiceAccounts`. When a Pod runs with a ServiceAccount, the kubelet mounts a short-lived, audience-bound JSON Web Token (JWT) at `/var/run/secrets/kubernetes.io/serviceaccount/token` using Projected Volumes. The apiserver verifies this JWT to determine which permissions the Pod possesses.',
        yamlSnippet: `apiVersion: v1
kind: ServiceAccount
metadata:
  name: deployment-manager-sa
  namespace: default
---
apiVersion: v1
kind: Pod
metadata:
  name: automated-deployer
spec:
  serviceAccountName: deployment-manager-sa
  containers:
  - name: runner
    image: bitnami/kubectl:latest`,
        kubectlCommands: ['kubectl get serviceaccounts', 'kubectl describe sa default'],
        visualizerFocus: 'OIDC/JWT cryptographic token injected from apiserver into container filesystem',
        practiceChallenge: {
          instructions: 'List the ServiceAccounts available in the default namespace.',
          goalCommand: 'kubectl get serviceaccounts',
          hints: ['Run kubectl get serviceaccounts or kubectl get sa', 'Notice the default service account'],
        },
      },
      {
        id: 'c-rbac-roles-bindings',
        number: '10.2',
        title: 'Role-Based Access Control (RBAC)',
        commandPill: 'kubectl auth can-i create pods',
        badge: 'Authorization',
        difficulty: 'Intermediate',
        description: 'Regulate access to Kubernetes API resources using Roles, ClusterRoles, RoleBindings, and ClusterRoleBindings with the principle of least privilege.',
        explanation: 'RBAC governs what actions users and ServiceAccounts can perform. A `Role` grants permissions (verbs: `get`, `list`, `watch`, `create`, `delete`) on resources (`pods`, `deployments`, `services`) scoped to a single namespace. A `ClusterRole` grants cluster-wide permissions (nodes, PVs, namespaces) or reusable rules across all namespaces. `RoleBinding` binds a Role to subjects (Users, Groups, ServiceAccounts) in a namespace, while `ClusterRoleBinding` grants cluster-wide scope.',
        yamlSnippet: `apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""] # Core API group
  resources: ["pods", "pods/log"]
  verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods-binding
  namespace: default
subjects:
- kind: ServiceAccount
  name: deployment-manager-sa
  namespace: default
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io`,
        kubectlCommands: ['kubectl auth can-i create pods', 'kubectl auth can-i get pods --as system:serviceaccount:default:deployment-manager-sa'],
        visualizerFocus: 'RBAC authorization gate checking API verbs against subjects and roles',
        practiceChallenge: {
          instructions: 'Check if your active administrative credentials are authorized to create pods.',
          goalCommand: 'kubectl auth can-i create pods',
          hints: ['Run kubectl auth can-i create pods', 'Observe the response: yes'],
        },
      },
      {
        id: 'c-security-contexts-hardening',
        number: '10.3',
        title: 'Security Contexts & Linux Hardening',
        commandPill: 'kubectl explain pod.spec.securityContext',
        badge: 'CKS Hardening',
        difficulty: 'Advanced',
        description: 'Enforce container hardening: runAsNonRoot, readOnlyRootFilesystem, dropping Linux capabilities, and seccomp profiles.',
        explanation: 'By default, containers often run as `root` (UID 0) with a writable filesystem and default Linux capabilities. A container breakout could compromise the host kernel. `securityContext` hardens pods: (1) `runAsNonRoot: true` forces the container to run as an unprivileged user (UID 10001); (2) `readOnlyRootFilesystem: true` prevents attackers from downloading exploits into `/tmp` or modifying binaries; (3) `capabilities.drop: ["ALL"]` strips all Linux kernel capabilities; (4) `seccompProfile: { type: RuntimeDefault }` restricts system calls.',
        yamlSnippet: `apiVersion: v1
kind: Pod
metadata:
  name: hardened-web
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 10001
    fsGroup: 20001
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: app
    image: nginx:1.25-alpine
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop: ["ALL"]
        add: ["NET_BIND_SERVICE"]`,
        kubectlCommands: ['kubectl explain pod.spec.securityContext', 'kubectl describe pod web-frontend'],
        visualizerFocus: 'Locked container sandbox with dropped kernel capabilities and read-only filesystem',
        practiceChallenge: {
          instructions: 'Use kubectl explain to inspect the securityContext parameters for pod containers.',
          goalCommand: 'kubectl explain pod.spec.containers.securityContext',
          hints: ['Run kubectl explain pod.spec.containers.securityContext', 'Review allowPrivilegeEscalation, runAsNonRoot, capabilities'],
        },
      },
      {
        id: 'c-pod-security-standards-pss',
        number: '10.4',
        title: 'Pod Security Standards & Admission Webhooks',
        commandPill: 'kubectl get validatingwebhookconfigurations',
        badge: 'Admission Control',
        difficulty: 'Advanced',
        description: 'Enforce organization-wide security policies using Pod Security Standards (Privileged, Baseline, Restricted) and Validating Admission Policies.',
        explanation: 'Following the deprecation of PodSecurityPolicy (PSP), Kubernetes introduced `Pod Security Standards` (PSS) built into namespace labels. PSS defines three tiers: `Privileged` (unrestricted, for system agents), `Baseline` (prevents known privilege escalations, default), and `Restricted` (hardened best practices, non-root, read-only rootfs). Namespaces can configure three enforcement modes: `enforce` (reject non-compliant pods), `audit` (record violations in audit log), and `warn` (emit user warning on kubectl apply).',
        yamlSnippet: `apiVersion: v1
kind: Namespace
metadata:
  name: production-secure
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/enforce-version: latest
    pod-security.kubernetes.io/warn: restricted
    pod-security.kubernetes.io/warn-version: latest`,
        kubectlCommands: ['kubectl get namespaces --show-labels', 'kubectl get validatingwebhookconfigurations'],
        visualizerFocus: 'Admission controller evaluating incoming Pod manifest against namespace security standards',
        practiceChallenge: {
          instructions: 'View all namespaces and their configured labels.',
          goalCommand: 'kubectl get namespaces --show-labels',
          hints: ['Run kubectl get namespaces --show-labels', 'Inspect security and environment labels'],
        },
      },
    ],
  },
  {
    id: 'ch11-network-policies',
    number: 11,
    title: 'Network Security & Microsegmentation',
    category: 'Security & Governance',
    concepts: [
      {
        id: 'c-network-policies-microsegmentation',
        number: '11.1',
        title: 'NetworkPolicies: Ingress & Egress Filtering',
        commandPill: 'kubectl get networkpolicies',
        badge: 'Zero Trust Network',
        difficulty: 'Advanced',
        description: 'Microsegment your cluster. Implement default-deny security postures and firewall rules at Layer 3/4 based on pod selectors and IP CIDRs.',
        explanation: 'By default, Kubernetes networking is an open mesh: any pod can communicate with any other pod across any namespace. `NetworkPolicies` act as in-cluster firewalls managed by CNI plugins (Calico, Cilium). By defining `podSelector`, `policyTypes` (`Ingress`, `Egress`), and specific ports/selectors, you enforce least-privilege network access. The standard security best practice is to declare a `Default-Deny-All` NetworkPolicy in every namespace, then explicitly allowlist only necessary pathways (e.g. Frontend -> Backend on port 8080, Backend -> PostgreSQL on port 5432).',
        yamlSnippet: `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-backend
  namespace: default
spec:
  podSelector:
    matchLabels:
      app: backend-api
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend-web
    ports:
    - protocol: TCP
      port: 8080`,
        kubectlCommands: ['kubectl get networkpolicies', 'kubectl describe networkpolicy allow-frontend-to-backend'],
        visualizerFocus: 'CNI packet filtering dropping unauthorized cross-pod traffic at node interface',
        practiceChallenge: {
          instructions: 'Check for any active NetworkPolicies configured in the default namespace.',
          goalCommand: 'kubectl get networkpolicies',
          hints: ['Run kubectl get networkpolicies or kubectl get netpol', 'Observe POD-SELECTOR and AGE'],
        },
      },
      {
        id: 'c-service-mesh-istio-cilium',
        number: '11.2',
        title: 'Service Mesh & eBPF Networking (Istio, Cilium)',
        commandPill: 'kubectl get pods -n istio-system',
        badge: 'Service Mesh',
        difficulty: 'Expert',
        description: 'Transparent mutual TLS (mTLS), traffic shifting, distributed tracing, and high-performance kernel networking with eBPF.',
        explanation: 'A `Service Mesh` provides a dedicated infrastructure layer for managing service-to-service communication. Traditional meshes (Istio, Linkerd) inject an Envoy proxy sidecar into every Pod to intercept traffic, terminate mutual TLS (mTLS) for zero-trust encryption without code changes, collect L7 metrics, and perform canary traffic splitting. Modern eBPF-based meshes (Cilium) run logic directly inside the Linux kernel, achieving the same security and observability benefits without sidecar memory overhead or latency penalties.',
        yamlSnippet: `# Istio PeerAuthentication for Automatic Strict mTLS
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: default
spec:
  mtls:
    mode: STRICT # All inter-pod traffic must be encrypted with mTLS`,
        kubectlCommands: ['kubectl get pods -n kube-system', 'kubectl get svc'],
        visualizerFocus: 'Sidecar proxies / eBPF kernel layer negotiating cryptographic mTLS handshakes',
        practiceChallenge: {
          instructions: 'Query the cluster system services to inspect the networking backbone.',
          goalCommand: 'kubectl get svc -n kube-system',
          hints: ['Run kubectl get svc -n kube-system', 'Notice kube-dns and internal service endpoints'],
        },
      },
    ],
  },
];
