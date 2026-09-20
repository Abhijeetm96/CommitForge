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
        whatIsIt: "ServiceAccounts provide distinct, cryptographically verifiable identities for processes running inside Pods to authenticate against the Kubernetes API server, utilizing Projected ServiceAccount Tokens (OIDC JSON Web Tokens) with bounded audience and automatic time-based rotation.",
        inSimpleWords: "Human engineers log in with username, password, and 2-factor authentication. A ServiceAccount is an automated ID badge on a lanyard created specifically for a robot (Pod), allowing the robot to open only the specific office doors it has permission to enter.",
        realWorldAnalogy: {
                  "metaphor": "Employee RFID Smart Badges with Automatic Expiration",
                  "explanation": "A delivery contractor receives a temporary RFID keycard programmed to open only the loading dock door between 9:00 AM and 5:00 PM. If the contractor tries to enter the executive boardroom, the door stays locked."
        },
        whenToUse: [
                  "Granting in-cluster controllers, CI/CD runners, or monitoring pods permission to query the kube-apiserver.",
                  "IAM Roles for Service Accounts (IRSA on AWS, Workload Identity on GCP/Azure) to allow pods to access cloud databases (S3, RDS, DynamoDB) without static AWS access keys.",
                  "Isolating permissions between distinct applications sharing the same namespace."
        ],
        whenNotToUse: [
                  "Using the namespace default ServiceAccount for production workloads (violates principle of least privilege).",
                  "Using legacy static ServiceAccount token secrets (deprecated in K8s 1.24+ in favor of ephemeral Bound ServiceAccount Tokens).",
                  "Mounting ServiceAccount tokens in pods that never communicate with the Kubernetes API (set automountServiceAccountToken: false)."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "ServiceAccount Provisioning",
                            "description": "Operator creates a ServiceAccount resource (e.g. payment-service-sa) in the application namespace."
                  },
                  {
                            "step": 2,
                            "title": "Token Projection via Kubelet",
                            "description": "Kubelet requests an ephemeral, signed OIDC JWT token with bound audience (api) from the apiserver TokenRequest API."
                  },
                  {
                            "step": 3,
                            "title": "Atomic Volume Mount",
                            "description": "Token is mounted into container at /var/run/secrets/kubernetes.io/serviceaccount/token alongside the cluster CA root certificate."
                  },
                  {
                            "step": 4,
                            "title": "Continuous Refresh & Rotation",
                            "description": "Kubelet automatically refreshes the token before its expiration (typically at 80% of TTL or every hour)."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "Bound ServiceAccount Tokens",
                            "detail": "Tokens are cryptographically bound to the specific pod instance and automatically invalidated when the Pod is deleted."
                  },
                  {
                            "title": "automountServiceAccountToken: false",
                            "detail": "Explicitly disables mounting API credentials into pods that do not need to talk to the Kubernetes API."
                  },
                  {
                            "title": "Cloud Workload Identity (OIDC)",
                            "detail": "Federates the Kubernetes cluster OIDC discovery document with AWS IAM or GCP IAM, eliminating static cloud credentials."
                  }
        ],
        productionTips: [
                  "Always set automountServiceAccountToken: false on application pods unless they explicitly require access to the Kubernetes API.",
                  "Never share a single ServiceAccount across multiple microservices; create a dedicated ServiceAccount per deployment.",
                  "Adopt cloud Workload Identity (AWS EKS Pod Identity / IRSA, GCP Workload Identity) for all cloud API access."
        ],
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
        whatIsIt: "Role-Based Access Control (RBAC) is the authorization mechanism that regulates access to Kubernetes API resources (Pods, Deployments, Secrets) by mapping subjects (Users, Groups, ServiceAccounts) to sets of permitted operations (verbs: get, list, watch, create, delete) via RoleBindings.",
        inSimpleWords: "Think of RBAC like building security clearance levels: A \"Role\" is a job description (\"Janitor\", \"Chief Accountant\", \"Intern\"). A \"RoleBinding\" is handing that job badge to a specific person: \"Alice is assigned the Chief Accountant role in the Finance department.\"",
        realWorldAnalogy: {
                  "metaphor": "Hotel Keycard Access Profiles",
                  "explanation": "The Master Key (ClusterRole: cluster-admin) unlocks all hotel doors, offices, and safes across all properties. A Guest Key (Role: pod-reader) opens only Room 402 in Building A (single namespace)."
        },
        whenToUse: [
                  "Restricting developer and CI/CD pipelines to specific namespaces and read-only verbs in production environments.",
                  "Granting Custom Controllers and Operators the exact minimal permissions required to reconcile their target resources.",
                  "Testing permissions using kubectl auth can-i <verb> <resource> --as <user> before deploying manifests."
        ],
        whenNotToUse: [
                  "Granting cluster-admin or wildcard verbs (* on *) to application ServiceAccounts (catastrophic security vulnerability).",
                  "Using RoleBindings with system:authenticated group (grants all authenticated users access to the namespace).",
                  "Creating hundreds of duplicate bespoke Roles when a reusable ClusterRole with namespace RoleBindings is cleaner."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "API Request Authentication",
                            "description": "Client submits request; apiserver identifies the authenticated subject (e.g. system:serviceaccount:default:my-sa)."
                  },
                  {
                            "step": 2,
                            "title": "Authorizer Chain Evaluation",
                            "description": "Request passes into the RBAC Authorizer module with verb (list), resource (pods), and namespace (production)."
                  },
                  {
                            "step": 3,
                            "title": "Role & Binding Matching",
                            "description": "RBAC searches for active RoleBindings and ClusterRoleBindings referencing the subject in that namespace."
                  },
                  {
                            "step": 4,
                            "title": "Allow or Deny Decision",
                            "description": "If any matching role grants the requested verb on the target resource/subresource, request proceeds; otherwise returns 403 Forbidden."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "Role vs ClusterRole",
                            "detail": "Role is strictly scoped to one namespace; ClusterRole applies cluster-wide (nodes, PVs) or can be bound across any namespace."
                  },
                  {
                            "title": "Subresource Granularity",
                            "detail": "Permissions can target subresources specifically: pods/log, pods/exec, deployments/scale, pods/status."
                  },
                  {
                            "title": "kubectl auth can-i",
                            "detail": "Built-in diagnostic command that queries the SelfSubjectAccessReview API to audit permissions instantly."
                  }
        ],
        productionTips: [
                  "Regularly audit high-risk permissions: pods/exec, secrets, and rolebindings/create allow privilege escalation to cluster-admin.",
                  "Use kubectl auth can-i --list --as=<user> to audit all permissions granted to a service account or user.",
                  "Bind cluster-wide ClusterRoles (like view or edit) using namespace-scoped RoleBindings to grant standard permissions without duplicate Role YAML."
        ],
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
        whatIsIt: "Security Contexts configure Linux OS-level security settings on Pods and containers, enforcing non-root user execution, read-only root filesystems, dropping dangerous Linux capabilities, and activating seccomp/AppArmor profiles to prevent container escape exploits.",
        inSimpleWords: "Running a container without a securityContext is like letting a contractor enter your house with master keys, a sledgehammer, and permission to remodel your foundation. A hardened securityContext is like escorting the contractor to the specific room, taking away their sledgehammer, and locking all other doors.",
        realWorldAnalogy: {
                  "metaphor": "Bank Cashier Bulletproof Glass and Locked Cash Box",
                  "explanation": "The cashier can only slide money through a tiny slot (dropped capabilities). They cannot open the reinforced vault door, change the building locks, or carry power tools behind the desk (allowPrivilegeEscalation: false)."
        },
        whenToUse: [
                  "Hardening 100% of production container workloads against remote code execution (RCE) and kernel privilege escalation.",
                  "Complying with regulatory compliance frameworks (SOC2, PCI-DSS, ISO 27001, CIS Kubernetes Benchmark).",
                  "Configuring readOnlyRootFilesystem: true with emptyDir mounts for /tmp to prevent malware persistence."
        ],
        whenNotToUse: [
                  "Running containers with privileged: true in user application namespaces (grants full access to the host kernel and hardware).",
                  "Allowing containers to run as UID 0 (root) when unprivileged UIDs (e.g. UID 10001) are fully functional.",
                  "Setting hostPID: true or hostNetwork: true on non-infrastructure workloads."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "Manifest Admission Validation",
                            "description": "Admission controller verifies that the Pod spec satisfies namespace Pod Security Standards."
                  },
                  {
                            "step": 2,
                            "title": "Linux UID/GID Configuration",
                            "description": "Kubelet passes runAsUser, runAsGroup, and fsGroup parameters to the CRI runtime."
                  },
                  {
                            "step": 3,
                            "title": "Capability Stripping & Seccomp Loading",
                            "description": "containerd invokes runc to drop ALL Linux capabilities, leaving only explicitly allowed capabilities, and applies seccomp filters."
                  },
                  {
                            "step": 4,
                            "title": "Read-Only Filesystem Lock",
                            "description": "The root filesystem is mounted MS_RDONLY; any attempt by an attacker to write to /bin, /usr, or /etc returns EROFS (Read-only file system)."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "runAsNonRoot: true",
                            "detail": "Guarantees the kubelet refuses to start the container if image metadata specifies UID 0 (root)."
                  },
                  {
                            "title": "readOnlyRootFilesystem: true",
                            "detail": "Prevents attackers from modifying application binaries or writing executable rootkits to disk."
                  },
                  {
                            "title": "capabilities.drop: [\"ALL\"]",
                            "detail": "Strips all 38+ default Linux kernel capabilities (CAP_SYS_ADMIN, CAP_NET_RAW, etc.), blocking 99% of container escape vectors."
                  }
        ],
        productionTips: [
                  "Standard production securityContext recipe: runAsNonRoot: true, allowPrivilegeEscalation: false, capabilities.drop: [\"ALL\"], readOnlyRootFilesystem: true.",
                  "Mount temporary scratch directories (/tmp, /var/cache) as emptyDir volumes when readOnlyRootFilesystem: true is enabled.",
                  "Enable seccompProfile: { type: RuntimeDefault } on all pods to block dangerous kernel system calls."
        ],
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
        whatIsIt: "Pod Security Standards (PSS) define three comprehensive security profiles (Privileged, Baseline, Restricted) built directly into the Kubernetes admission control pipeline, allowing administrators to enforce container hardening policies declaratively through namespace labels.",
        inSimpleWords: "Think of Pod Security Standards like building code safety ratings for different rooms in a hotel: \"Privileged\" (the boiler room / electrical substation—high hazard, maintenance engineers only), \"Baseline\" (standard guest hotel rooms—safe from fire hazards), and \"Restricted\" (the bank vault / nursery—maximum security, padded walls, locked windows).",
        realWorldAnalogy: {
                  "metaphor": "Airport Security Checkpoint Lanes",
                  "explanation": "Privileged lane is for emergency responders with special clearance. Baseline lane enforces standard TSA passenger rules (no large knives). Restricted lane is maximum security screening with biometric scans and strict carry-on restrictions."
        },
        whenToUse: [
                  "Enforcing organization-wide security baselines across hundreds of multi-tenant application namespaces.",
                  "Migrating away from legacy deprecated PodSecurityPolicies (PSP) to native Kubernetes admission control.",
                  "Applying warn or audit modes in pre-production staging environments to identify compliance violations before enforcing in production."
        ],
        whenNotToUse: [
                  "Applying Restricted profile to cluster infrastructure namespaces (kube-system, monitoring) that require hostNetwork or privileged CNI agents.",
                  "Enforcing strict mode in production immediately without first running warn/audit mode to catch breaking application specs.",
                  "Expecting PSS to replace network firewalls (combine PSS with NetworkPolicies for defense-in-depth)."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "Namespace Label Configuration",
                            "description": "Administrator labels namespace: pod-security.kubernetes.io/enforce: restricted with version pin."
                  },
                  {
                            "step": 2,
                            "title": "Admission Plugin Interception",
                            "description": "Built-in PodSecurity admission controller intercepts all incoming Pod creation and update requests."
                  },
                  {
                            "step": 3,
                            "title": "Profile Rules Evaluation",
                            "description": "Controller evaluates Pod against the Restricted profile: checks runAsNonRoot, capabilities, host namespaces, and volumes."
                  },
                  {
                            "step": 4,
                            "title": "Admission, Warning, or Rejection",
                            "description": "Compliant pods are admitted; violations are rejected with detailed remediation error messages (enforce mode) or logged (audit/warn)."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "The 3 Standard Profiles",
                            "detail": "Privileged (unrestricted, for system agents), Baseline (prevents known privilege escalations, default), Restricted (hardened security best practices)."
                  },
                  {
                            "title": "The 3 Action Modes",
                            "detail": "enforce (rejects non-compliant pods), audit (records violation in API audit log), warn (emits user warning on kubectl apply)."
                  },
                  {
                            "title": "Built-in Zero-Dependency Admission",
                            "detail": "Baked directly into the kube-apiserver binary; requires no external admission webhook pods or CRDs."
                  }
        ],
        productionTips: [
                  "Roll out PSS in 3 phases: 1. Set warn: restricted for 30 days; 2. Review audit logs; 3. Flip enforce: restricted.",
                  "Always pin the policy version (pod-security.kubernetes.io/enforce-version: v1.31) to prevent surprise rejections during Kubernetes minor version upgrades.",
                  "Use the Baseline profile as the default minimum standard for all general developer namespaces."
        ],
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
        whatIsIt: "A NetworkPolicy is an API resource that controls Layer 3 and Layer 4 network packet flow at the Pod boundary, functioning as an in-cluster distributed firewall enforced by CNI plugins (Calico, Cilium) to implement Zero Trust microsegmentation.",
        inSimpleWords: "By default, Kubernetes is an open open-plan office where anyone can walk up to anyone else desk and talk. A NetworkPolicy is like installing security badge card readers on every single office door—only people with the correct department badge can enter your room.",
        realWorldAnalogy: {
                  "metaphor": "High-Security Laboratory Airlocks and Keycard Doors",
                  "explanation": "Personnel in the reception area cannot walk directly into the bio-research containment room. An automated airlock checks your badge: only personnel from Lab Team A (podSelector) can open the door on Door Port 443."
        },
        whenToUse: [
                  "Implementing Default-Deny-All ingress and egress security postures in all multi-tenant and production namespaces.",
                  "Restricting database access: ensuring only backend API pods with label app=api can connect to PostgreSQL on port 5432.",
                  "Restricting egress: blocking compromised pods from communicating with malicious external command-and-control (C2) IP addresses."
        ],
        whenNotToUse: [
                  "Clusters running default Flannel CNI (Flannel does NOT support NetworkPolicies; packets will pass through completely unfiltered).",
                  "Filtering traffic based on Layer 7 HTTP paths or domain names (use Ingress, Gateway API, or Istio service mesh).",
                  "Configuring policies without thoroughly allowlisting CoreDNS on UDP port 53 (blocks all internal DNS resolution)."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "NetworkPolicy Declaration",
                            "description": "Security engineer applies NetworkPolicy with podSelector: { app: db } and ingress rules."
                  },
                  {
                            "step": 2,
                            "title": "CNI DaemonSet Detection",
                            "description": "CNI network agents (Cilium, Calico) watch the apiserver and identify which local pods match the policy selector."
                  },
                  {
                            "step": 3,
                            "title": "Kernel Packet Filter Programming",
                            "description": "The agent compiles policies into Linux iptables rules or eBPF BPF_PROG_TYPE_SCHED_CLS kernel filters on the node veth interfaces."
                  },
                  {
                            "step": 4,
                            "title": "In-Kernel Packet Dropping",
                            "description": "Packets arriving at the Pod interface that do not match the allowlist are dropped at wire speed in the kernel before reaching the container."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "Default-Deny Posture",
                            "detail": "Selecting pods with empty ingress: [] or egress: [] drops all inbound/outbound packets unless explicitly allowlisted."
                  },
                  {
                            "title": "Three-Way Selector Matching",
                            "detail": "podSelector (pods in same namespace), namespaceSelector (pods in another namespace), ipBlock (external CIDR ranges)."
                  },
                  {
                            "title": "Stateful Connection Tracking (conntrack)",
                            "detail": "If ingress is permitted, response traffic is automatically allowed through stateful Linux conntrack session tracking."
                  }
        ],
        productionTips: [
                  "Always deploy a Default-Deny-All NetworkPolicy in every production namespace, then explicitly allowlist required connections.",
                  "Never forget to allowlist CoreDNS egress (UDP port 53 to kube-system on app=kube-dns); forgetting this breaks all DNS lookups.",
                  "Adopt Cilium for eBPF-based NetworkPolicies to achieve 10x higher throughput and support FQDN-based egress filtering (e.g. allow api.stripe.com)."
        ],
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
        whatIsIt: "A Service Mesh is a dedicated infrastructure layer that manages service-to-service communication, delivering transparent mutual TLS (mTLS) encryption, Layer 7 observability, traffic shifting, and fault injection either via sidecar proxies (Istio/Envoy) or sidecarless eBPF kernel routing (Cilium).",
        inSimpleWords: "Think of a Service Mesh like an armored diplomatic courier service for all inter-office letters. Instead of each employee manually encrypting emails with PGP and tracking delivery receipts, they drop letters into an armored lockbox (mesh). The courier fleet guarantees encrypted delivery, logs transit speed, and reroutes around traffic jams automatically.",
        realWorldAnalogy: {
                  "metaphor": "Armored Diplomatic Motorcade with Encrypted Radios",
                  "explanation": "Government officials (microservices) travel inside bulletproof limousines with police escorts (Envoy sidecars). All radio chatter is encrypted (mTLS), traffic signals turn green automatically (canary routing), and surveillance cameras log every vehicle movement (distributed tracing)."
        },
        whenToUse: [
                  "Enforcing strict zero-trust mTLS encryption across all pod-to-pod communications without modifying application code.",
                  "Advanced Layer 7 canary releases: shifting 5% of user traffic to version 2 based on HTTP headers or cookies.",
                  "Distributed tracing and golden signals (latency, error rates, saturation) across polyglot microservice architectures."
        ],
        whenNotToUse: [
                  "Simple architectures with fewer than 10 microservices where the memory overhead and operational complexity outweigh benefits.",
                  "Teams lacking dedicated platform engineers to manage service mesh upgrades, certificate rotations, and control planes.",
                  "Latency-critical high-frequency trading applications where 1-2ms of proxy interception overhead is unacceptable."
        ],
        lifecycleSteps: [
                  {
                            "step": 1,
                            "title": "Control Plane Configuration (istiod)",
                            "description": "istiod converts high-level routing rules (VirtualService, DestinationRule) into low-level Envoy proxy configuration models."
                  },
                  {
                            "step": 2,
                            "title": "Sidecar Injection or eBPF Hook",
                            "description": "Mutating webhook injects envoy-proxy sidecar, or Cilium attaches eBPF programs directly to the host cgroup socket layer."
                  },
                  {
                            "step": 3,
                            "title": "Cryptographic mTLS Handshake",
                            "description": "Proxies exchange X.509 certificates issued by the mesh CA (SPIFFE IDs), negotiating mutual TLS and verifying peer identities."
                  },
                  {
                            "step": 4,
                            "title": "Telemetry Streaming",
                            "description": "Proxies stream OpenTelemetry distributed trace spans and Prometheus metrics to Jaeger and Grafana collectors in the background."
                  }
        ],
        keyMechanisms: [
                  {
                            "title": "SPIFFE/SPIRE Identity",
                            "detail": "Every pod receives a cryptographic identity (e.g. spiffe://cluster.local/ns/default/sa/payment-sa) encoded in its X.509 certificate SAN."
                  },
                  {
                            "title": "Envoy Proxy vs Sidecarless eBPF",
                            "detail": "Envoy runs in user space per pod; Cilium eBPF operates inside the Linux kernel socket layer, saving up to 40MB RAM per pod."
                  },
                  {
                            "title": "VirtualService & DestinationRule",
                            "detail": "Istio API primitives for defining percentage-based traffic splits, circuit breakers, connection pools, and retry timeouts."
                  }
        ],
        productionTips: [
                  "Evaluate Cilium Service Mesh (sidecarless eBPF) before Istio to reduce pod memory footprint and eliminate Envoy sidecar injection complexity.",
                  "Set PeerAuthentication mode: STRICT in production to ensure all unencrypted plaintext traffic is rejected at the network boundary.",
                  "Always configure outlier detection (circuit breakers) in DestinationRules to automatically eject unhealthy pods before cascading failures occur."
        ],
      },
    ],
  },
];
