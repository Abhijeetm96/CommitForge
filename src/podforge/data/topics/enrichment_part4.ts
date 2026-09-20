import type { KubePitfall, KubeQuizQuestion, KubeYamlFieldExplanation } from './types';
import type { ConceptEnrichment } from './enrichment_part1';

export const PART_4_ENRICHMENT: Record<string, ConceptEnrichment> = {
  'c-why-autoscaling': {
    commonPitfalls: [
      {
        mistake: 'Configuring HPA without setting `resources.requests` on the target Pods.',
        whyItHappens: 'HPA calculates utilization percentages based on the ratio of current usage to requested resources. If requests are missing, HPA fails with `<unknown>/50%`.',
        fix: 'Always declare `resources.requests.cpu` and `memory` on all pods targeted by HPA.',
      },
      {
        mistake: 'Scaling up too late due to sluggish metric scraping intervals.',
        whyItHappens: 'By default, Metrics Server scrapes metrics every 60 seconds, which can be too slow for sudden flash crowds.',
        fix: 'Use KEDA (Kubernetes Event-driven Autoscaling) to trigger scaling directly from message queues (SQS, Kafka) before latency spikes.',
      },
    ],
    quizQuestion: {
      question: 'Why does an HPA show `<unknown>/50%` for target CPU utilization after deployment?',
      options: [
        { label: 'A', text: 'The application is running faster than the speed of light.', isCorrect: false, explanation: 'Humorous, but not technical.' },
        { label: 'B', text: 'The target container does not have `resources.requests.cpu` defined in its pod spec, or Metrics Server is not installed.', isCorrect: true, explanation: 'Correct! HPA requires a baseline request value to calculate target utilization percentages.' },
        { label: 'C', text: 'The cluster does not have internet access.', isCorrect: false, explanation: 'HPA operates using internal cluster metrics.' },
        { label: 'D', text: 'The pod has too many replicas.', isCorrect: false, explanation: 'Replica count does not cause unknown metrics.' },
      ],
    },
    yamlExplanation: [
      { field: 'spec.scaleTargetRef', explanation: 'Points the autoscaler to the Deployment or StatefulSet it will dynamically scale.' },
    ],
    referenceCheatSheet: [
      'kubectl get hpa -A : View all Horizontal Pod Autoscalers, current targets, and replica counts',
      'kubectl describe hpa <name> : Inspect scaling events, thresholds, and conditions',
    ],
    solutionExplanation: 'Autoscaling dynamically aligns cloud infrastructure costs with actual user demand.',
  },

  'c-horizontal-pod-autoscaler': {
    commonPitfalls: [
      {
        mistake: 'Setting the HPA target CPU percentage too high (e.g. 95%).',
        whyItHappens: 'Containers become saturated and drop packets before new pods finish booting.',
        fix: 'Target 60-70% CPU utilization to provide adequate buffer during traffic bursts while new replicas initialize.',
      },
      {
        mistake: 'Flapping / Thrashing: Pods rapidly scaling up and down in quick succession.',
        whyItHappens: 'Spiky bursty traffic without cooldown stabilization windows.',
        fix: 'Configure `behavior.scaleDown.stabilizationWindowSeconds: 300` (5 minutes) to prevent premature scale-down.',
      },
    ],
    quizQuestion: {
      question: 'What mathematical formula does the Horizontal Pod Autoscaler controller use to determine the desired number of replicas?',
      options: [
        { label: 'A', text: '`DesiredReplicas = ceil(CurrentReplicas * (CurrentMetricValue / DesiredMetricValue))`', isCorrect: true, explanation: 'Correct! This proportional formula adjusts replicas to bring the average metric value to the target setpoint.' },
        { label: 'B', text: '`DesiredReplicas = CurrentReplicas + 10`', isCorrect: false, explanation: 'HPA uses proportional mathematics, not fixed addition.' },
        { label: 'C', text: '`DesiredReplicas = sqrt(TotalRequests)`', isCorrect: false, explanation: 'Square root scaling is not the HPA algorithm.' },
        { label: 'D', text: '`DesiredReplicas = MaxReplicas / 2`', isCorrect: false, explanation: 'HPA computes dynamic targets based on real-time metrics.' },
      ],
    },
    yamlExplanation: [
      { field: 'spec.minReplicas: 2\nspec.maxReplicas: 20', explanation: 'Establishes safe boundaries so the workload never drops below 2 or scales uncontrollably beyond 20.' },
      { field: 'metrics[0].resource.target.averageUtilization: 70', explanation: 'Target average CPU utilization percentage across all replicas.' },
    ],
    referenceCheatSheet: [
      'kubectl autoscale deployment <name> --min=2 --max=10 --cpu-percent=70 : Create HPA via CLI',
      'kubectl get hpa : Check current metric value vs target threshold',
    ],
    solutionExplanation: 'HPA adjusts the number of pod replicas automatically in response to CPU, memory, or custom Prometheus metrics.',
  },

  'c-vertical-pod-autoscaler': {
    commonPitfalls: [
      {
        mistake: 'Running VPA in `Auto` mode simultaneously with an HPA scaling on the same metric (CPU/Memory).',
        whyItHappens: 'VPA and HPA fight each other: HPA adds replicas to reduce CPU, while VPA reduces CPU requests, causing instability.',
        fix: 'Never use VPA `Auto` and HPA on the same resource metric. Use VPA in `Off` (Recommendation) mode or use HPA with custom application metrics.',
      },
      {
        mistake: 'Forgetting that VPA in `Auto` mode restarts Pods to apply new resource values.',
        whyItHappens: 'In current Kubernetes kernels, in-place resource resizing is still evolving; VPA restarts the pod to apply changes.',
        fix: 'Ensure your deployment has multiple replicas and proper PDBs (PodDisruptionBudgets) before enabling VPA Auto.',
      },
    ],
    quizQuestion: {
      question: 'What mode should you configure in a Vertical Pod Autoscaler (VPA) to see recommended CPU/memory requests WITHOUT restarting your production pods?',
      options: [
        { label: 'A', text: '`updateMode: "Auto"`', isCorrect: false, explanation: 'Auto mode actively kills and restarts pods with new values.' },
        { label: 'B', text: '`updateMode: "Off"`', isCorrect: true, explanation: 'Correct! "Off" mode only generates recommendations in the VPA status block without making any changes to running pods.' },
        { label: 'C', text: '`updateMode: "Recreate"`', isCorrect: false, explanation: 'Recreate immediately restarts pods.' },
        { label: 'D', text: '`updateMode: "Forced"`', isCorrect: false, explanation: 'Not a valid VPA update mode.' },
      ],
    },
    yamlExplanation: [
      { field: 'updatePolicy.updateMode: "Off"', explanation: 'Configures recommendation-only mode, safe for production observability without surprise restarts.' },
      { field: 'resourcePolicy.containerPolicies', explanation: 'Defines minAllowed and maxAllowed resource constraints for specific containers.' },
    ],
    referenceCheatSheet: [
      'kubectl get vpa -A : List all Vertical Pod Autoscalers and their recommendations',
      'kubectl describe vpa <name> : Inspect lowerBound, target, and upperBound recommendations',
    ],
    solutionExplanation: 'VPA analyzes historical resource usage and automatically right-sizes container CPU and Memory requests.',
  },

  'c-cluster-autoscaling': {
    commonPitfalls: [
      {
        mistake: 'Waiting for node CPU to hit 90% before triggering cluster node scaling.',
        whyItHappens: 'The Kubernetes Cluster Autoscaler scales based on PENDING PODS, NOT node CPU/memory percentages!',
        fix: 'Cluster Autoscaler adds nodes only when pods are in `Pending` state because no existing node has sufficient allocatable requests.',
      },
      {
        mistake: 'Pods with local storage or unmanaged pods preventing Cluster Autoscaler from terminating underutilized nodes.',
        whyItHappens: 'Nodes fail to scale down because CA refuses to kill naked pods or pods using local `emptyDir`.',
        fix: 'Add annotation `"cluster-autoscaler.kubernetes.io/safe-to-evict": "true"` to pods.',
      },
    ],
    quizQuestion: {
      question: 'What condition triggers the Kubernetes Cluster Autoscaler to provision a new worker node from the cloud provider?',
      options: [
        { label: 'A', text: 'Average CPU utilization across existing nodes exceeds 85%.', isCorrect: false, explanation: 'Cluster Autoscaler does not scale based on node CPU averages.' },
        { label: 'B', text: 'One or more Pods are in `Pending` state because no existing node has enough allocatable resources to schedule them.', isCorrect: true, explanation: 'Correct! Cluster Autoscaler is reactive to pending unscheduled pods.' },
        { label: 'C', text: 'An engineer runs `kubectl scale nodes`.', isCorrect: false, explanation: 'Kubectl does not have a scale nodes command.' },
        { label: 'D', text: 'Network bandwidth on the control plane is saturated.', isCorrect: false, explanation: 'Network bandwidth does not trigger node autoscaling.' },
      ],
    },
    yamlExplanation: [
      { field: 'cluster-autoscaler.kubernetes.io/safe-to-evict: "true"', explanation: 'Annotation informing the autoscaler that this pod can safely be moved during node scale-down.' },
    ],
    referenceCheatSheet: [
      'kubectl get nodes -L node.kubernetes.io/instance-type : View instance types across the node pool',
      'kubectl logs -n kube-system -l app=cluster-autoscaler : Inspect scale-up and scale-down decisions',
    ],
    solutionExplanation: 'Cluster Autoscaler provisions and deprovisions cloud VMs based on unschedulable pending pods and underutilized capacity.',
  },

  'c-k8s-scheduler-basics': {
    commonPitfalls: [
      {
        mistake: 'Hardcoding `spec.nodeName` in production Pod specifications.',
        whyItHappens: 'Developers bypass the scheduler to run on a specific node during a test.',
        fix: 'Hardcoded `nodeName` circumvents all scheduler scoring, tolerations, and anti-affinity rules. Use `nodeSelector` or affinities instead.',
      },
      {
        mistake: 'Not realizing that the scheduler does not balance pods based on REAL-TIME CPU usage, but on COMMITTED REQUESTS.',
        whyItHappens: 'Nodes appear unbalanced in `kubectl top` even though the scheduler placed pods evenly.',
        fix: 'The scheduler balances based on `spec.containers.resources.requests`, not actual dynamic load.',
      },
    ],
    quizQuestion: {
      question: 'What are the two primary phases that kube-scheduler executes for every unscheduled Pod?',
      options: [
        { label: 'A', text: 'Compile and Execute', isCorrect: false, explanation: 'These are programming language build terms.' },
        { label: 'B', text: 'Filtering (Predicates) and Scoring (Priorities)', isCorrect: true, explanation: 'Correct! Filtering removes nodes that cannot run the pod; Scoring ranks remaining nodes to pick the best host.' },
        { label: 'C', text: 'Authentication and Authorization', isCorrect: false, explanation: 'These are handled by kube-apiserver, not the scheduler.' },
        { label: 'D', text: 'Ingress and Egress', isCorrect: false, explanation: 'These are network traffic directions.' },
      ],
    },
    yamlExplanation: [
      { field: 'spec.schedulerName: default-scheduler', explanation: 'Specifies which scheduler binary evaluates this pod (custom schedulers can be used).' },
      { field: 'spec.nodeSelector: { disktype: ssd }', explanation: 'Simple key-value label filter matching node labels during the Filtering phase.' },
    ],
    referenceCheatSheet: [
      'kubectl get events --sort-by=.metadata.creationTimestamp : Inspect recent scheduler placement events',
      'kubectl describe pod <name> | grep -A 5 Events : Find why a pod failed to schedule (e.g. 0/5 nodes available)',
    ],
    solutionExplanation: 'Kube-scheduler pairs unscheduled pods with optimal worker nodes through two-phase filtering and scoring algorithms.',
  },

  'c-taints-and-tolerations': {
    commonPitfalls: [
      {
        mistake: 'Believing that a Toleration attracts a Pod to a specific Node.',
        whyItHappens: 'Confusing Tolerations with NodeAffinity.',
        fix: 'Tolerations do NOT attract pods; they merely REPEL pods that lack the toleration. To attract pods to a node, pair tolerations with `nodeSelector` or `nodeAffinity`.',
      },
      {
        mistake: 'Using `effect: NoSchedule` when you wanted `NoExecute`.',
        whyItHappens: '`NoSchedule` only prevents new pods from landing; it does NOT evict existing pods already running on the node.',
        fix: 'Use `NoExecute` if you want immediately to evict currently running pods without the toleration.',
      },
    ],
    quizQuestion: {
      question: 'What is the purpose of applying a Taint to a Kubernetes worker node?',
      options: [
        { label: 'A', text: 'To mark the node as corrupt and delete all files.', isCorrect: false, explanation: 'Taints are scheduling policies, not destructive operations.' },
        { label: 'B', text: 'To allow the node to REPEL a set of Pods unless those Pods explicitly declare a matching Toleration.', isCorrect: true, explanation: 'Correct! Taints repel pods. Only pods with matching tolerations are permitted to be scheduled on tainted nodes.' },
        { label: 'C', text: 'To encrypt data transmitted to the node.', isCorrect: false, explanation: 'Encryption is handled by TLS/WireGuard.' },
        { label: 'D', text: 'To grant root access to the kubelet.', isCorrect: false, explanation: 'Taints have nothing to do with Linux root permissions.' },
      ],
    },
    yamlExplanation: [
      { field: 'tolerations[0].key: "dedicated"', explanation: 'The taint key string matched against the node.' },
      { field: 'tolerations[0].operator: "Equal"', explanation: 'Matches both key and value (or "Exists" to match any value).' },
      { field: 'tolerations[0].effect: "NoSchedule"', explanation: 'Matches the taint effect preventing scheduling.' },
    ],
    referenceCheatSheet: [
      'kubectl taint nodes <node> dedicated=gpu:NoSchedule : Apply taint to repel non-GPU workloads',
      'kubectl taint nodes <node> dedicated:NoSchedule- : Remove taint from a node (note the minus sign)',
      'kubectl describe node <node> | grep Taints : View all taints on a specific node',
    ],
    solutionExplanation: 'Taints and Tolerations ensure that dedicated, specialized, or unhealthy nodes only accept authorized workloads.',
  },

  'c-topology-spread-constraints': {
    commonPitfalls: [
      {
        mistake: 'Setting `maxSkew: 1` with `whenUnsatisfiable: DoNotSchedule` in small clusters, causing pods to stay Pending.',
        whyItHappens: 'If nodes in a zone are full, strict `DoNotSchedule` blocks placement even if other zones have idle capacity.',
        fix: 'Use `whenUnsatisfiable: ScheduleAnyway` to allow soft balancing during capacity crunches.',
      },
      {
        mistake: 'Mismatched `labelSelector` in topology spread constraint.',
        whyItHappens: 'The scheduler cannot calculate skew if the label selector does not match the pod labels.',
        fix: 'Ensure `spec.topologySpreadConstraints[].labelSelector` matches the Deployment pod template labels.',
      },
    ],
    quizQuestion: {
      question: 'What does `maxSkew: 1` define in a Kubernetes Topology Spread Constraint?',
      options: [
        { label: 'A', text: 'The maximum percentage difference in CPU usage across nodes.', isCorrect: false, explanation: 'Skew measures pod distribution count, not CPU usage.' },
        { label: 'B', text: 'The maximum allowable difference in matching pod counts between any two topology domains (e.g. zones or nodes).', isCorrect: true, explanation: 'Correct! maxSkew establishes how evenly balanced pods must be across zones or racks.' },
        { label: 'C', text: 'The maximum number of seconds a pod can run.', isCorrect: false, explanation: 'Time limits are not skew.' },
        { label: 'D', text: 'The number of network hops permitted.', isCorrect: false, explanation: 'Network routing is handled by CNI.' },
      ],
    },
    yamlExplanation: [
      { field: 'maxSkew: 1', explanation: 'Maximum difference in pod count allowed between topology domains.' },
      { field: 'topologyKey: topology.kubernetes.io/zone', explanation: 'Spreads pods evenly across multi-datacenter availability zones.' },
      { field: 'whenUnsatisfiable: DoNotSchedule', explanation: 'Hard scheduling constraint: if skew cannot be satisfied, pod remains Pending.' },
    ],
    referenceCheatSheet: [
      'kubectl get pods -o wide -L topology.kubernetes.io/zone : View pod distribution across availability zones',
      'kubectl explain pod.spec.topologySpreadConstraints : View official schema documentation',
    ],
    solutionExplanation: 'Topology Spread Constraints ensure high availability by distributing workloads evenly across failure domains (racks, zones, nodes).',
  },

  'c-pod-priorities-preemption': {
    commonPitfalls: [
      {
        mistake: 'Assigning high priority (`value: 1000000`) to non-critical development workloads.',
        whyItHappens: 'Non-critical pods preempt (kill) production pods when cluster capacity gets tight.',
        fix: 'Reserve high PriorityClasses exclusively for critical infrastructure (CoreDNS, Calico, kube-proxy, production APIs).',
      },
      {
        mistake: 'Not configuring PodDisruptionBudgets (PDB), allowing preemption to disrupt service quorum.',
        whyItHappens: 'Preemption respects PDBs on a best-effort basis, but can still cause downtime if priority gaps are extreme.',
        fix: 'Always declare PDBs alongside PriorityClasses.',
      },
    ],
    quizQuestion: {
      question: 'When a cluster is out of CPU/memory capacity and a high-priority Pod arrives, what does kube-scheduler do?',
      options: [
        { label: 'A', text: 'It terminates the control plane.', isCorrect: false, explanation: 'Control plane is protected.' },
        { label: 'B', text: 'Preemption: It evicts lower-priority Pods from a candidate node to free up enough resources to schedule the high-priority Pod.', isCorrect: true, explanation: 'Correct! Kube-scheduler preempts (evicts) lower-priority pods so mission-critical pods can run immediately.' },
        { label: 'C', text: 'It ignores the high-priority pod until morning.', isCorrect: false, explanation: 'Scheduler acts immediately.' },
        { label: 'D', text: 'It compresses the container images to save RAM.', isCorrect: false, explanation: 'Images are storage, not RAM.' },
      ],
    },
    yamlExplanation: [
      { field: 'value: 1000000', explanation: 'Integer priority value; higher numbers preempt lower numbers during resource starvation.' },
      { field: 'preemptionPolicy: PreemptLowerPriority', explanation: 'Allows this priority class to evict lower priority pods if necessary.' },
    ],
    referenceCheatSheet: [
      'kubectl get priorityclasses : List all cluster priority levels and default classes',
      'kubectl describe priorityclass <name> : Inspect preemption policy and numeric values',
    ],
    solutionExplanation: 'PriorityClasses and Preemption guarantee that mission-critical system daemons always schedule ahead of batch jobs.',
  },

  'c-pod-evictions-graceful': {
    commonPitfalls: [
      {
        mistake: 'Setting `minAvailable: 100%` on a PodDisruptionBudget for a single-replica Deployment.',
        whyItHappens: 'Engineers try to ensure 100% uptime, but this completely blocks `kubectl drain` during node upgrades!',
        fix: 'Scale the Deployment to at least 2 replicas before setting high minAvailable thresholds.',
      },
      {
        mistake: 'Running `kubectl drain` without `--ignore-daemonsets`.',
        whyItHappens: 'DaemonSets run on every node by definition; drain fails because DaemonSet pods cannot be evacuated elsewhere.',
        fix: 'Always specify `kubectl drain <node> --ignore-daemonsets --delete-emptydir-data`.',
      },
    ],
    quizQuestion: {
      question: 'What is the primary role of a PodDisruptionBudget (PDB) in Kubernetes?',
      options: [
        { label: 'A', text: 'To calculate cloud hosting invoices.', isCorrect: false, explanation: 'Disruption budgets govern availability, not financial budgets.' },
        { label: 'B', text: 'To limit the number of Pods of an application that can be concurrently down from voluntary disruptions (e.g. node drains, updates).', isCorrect: true, explanation: 'Correct! A PDB guarantees that a minimum number of healthy replicas remain available during operational maintenance.' },
        { label: 'C', text: 'To prevent containers from crashing due to code bugs.', isCorrect: false, explanation: 'PDBs manage voluntary disruptions, not involuntary crashes.' },
        { label: 'D', text: 'To restart pods every 24 hours.', isCorrect: false, explanation: 'PDBs do not trigger periodic restarts.' },
      ],
    },
    yamlExplanation: [
      { field: 'minAvailable: 2', explanation: 'Guarantees that at least 2 pods must remain healthy before any eviction can proceed.' },
      { field: 'maxUnavailable: 1', explanation: 'Alternative syntax: permits at most 1 pod to be offline simultaneously.' },
    ],
    referenceCheatSheet: [
      'kubectl get pdb -A : List all active PodDisruptionBudgets across the cluster',
      'kubectl drain <node> --ignore-daemonsets : Gracefully evict all pods respecting PDBs',
      'kubectl uncordon <node> : Re-enable scheduling on a previously drained node',
    ],
    solutionExplanation: 'PodDisruptionBudgets prevent human cluster maintenance operations from violating service SLAs.',
  },

  'c-k8s-storage-fundamentals': {
    commonPitfalls: [
      {
        mistake: 'Writing application data to the container root filesystem and expecting it to persist across restarts.',
        whyItHappens: 'Containers are ephemeral; when a container crashes, its writable layer is discarded.',
        fix: 'Always mount a Kubernetes Volume (PersistentVolume or emptyDir) for any data that must survive container crashes.',
      },
      {
        mistake: 'Sharing a `ReadWriteOnce` (RWO) cloud block volume (EBS, Persistent Disk) across multiple nodes simultaneously.',
        whyItHappens: 'Cloud block storage can only be attached to a single virtual machine at a time.',
        fix: 'Use `ReadWriteMany` (RWX) file storage (NFS, EFS, CephFS) if multiple pods on different nodes must write to the same volume.',
      },
    ],
    quizQuestion: {
      question: 'What happens to files stored in an `emptyDir` volume when a container in the Pod crashes and restarts?',
      options: [
        { label: 'A', text: 'All files are permanently deleted.', isCorrect: false, explanation: 'Container restarts do NOT delete emptyDir data.' },
        { label: 'B', text: 'The files are preserved safely across container restarts; they are only deleted when the Pod itself is deleted from the node.', isCorrect: true, explanation: 'Correct! emptyDir storage shares the Pod lifecycle, surviving container crashes.' },
        { label: 'C', text: 'The files are automatically uploaded to Amazon S3.', isCorrect: false, explanation: 'emptyDir is purely local node storage.' },
        { label: 'D', text: 'The entire worker node is wiped.', isCorrect: false, explanation: 'Only the pod scope is involved.' },
      ],
    },
    yamlExplanation: [
      { field: 'volumes[0].emptyDir: {}', explanation: 'Creates a temporary scratch volume initialized empty, deleted when the pod is deleted.' },
      { field: 'volumeMounts[0].mountPath: /data', explanation: 'Filesystem location inside the container where the volume appears.' },
    ],
    referenceCheatSheet: [
      'kubectl explain pod.spec.volumes : Browse all supported volume types in Kubernetes',
      'df -h : Check disk space on a mounted volume from inside a container',
    ],
    solutionExplanation: 'Kubernetes abstracts storage from ephemeral scratch disks to enterprise network-attached block devices.',
  },

  'c-k8s-volumes-emptydir-hostpath': {
    commonPitfalls: [
      {
        mistake: 'Using `hostPath` volumes in production multi-node clusters.',
        whyItHappens: 'Engineers use hostPath because it is simple for local testing.',
        fix: '`hostPath` ties the pod to a specific physical server; if the pod is rescheduled onto another node, its data is missing! hostPath is also a severe security risk.',
      },
      {
        mistake: 'Mounting sensitive host directories (`/etc`, `/var/run/docker.sock`) into unprivileged pods.',
        whyItHappens: 'Allows trivial container escape to take full root control of the worker node.',
        fix: 'Restrict `hostPath` access using admission controllers (Pod Security Standards Restricted).',
      },
    ],
    quizQuestion: {
      question: 'Which Kubernetes volume type is backed by the RAM of the node (tmpfs) when `medium: "Memory"` is specified?',
      options: [
        { label: 'A', text: 'PersistentVolumeClaim', isCorrect: false, explanation: 'PVCs are backed by storage classes.' },
        { label: 'B', text: '`emptyDir` with `medium: "Memory"`', isCorrect: true, explanation: 'Correct! This mounts a Linux tmpfs ramdisk, providing ultra-fast in-memory reads and writes for caches.' },
        { label: 'C', text: 'NFS share', isCorrect: false, explanation: 'NFS is network file storage.' },
        { label: 'D', text: 'ConfigMap', isCorrect: false, explanation: 'ConfigMaps store read-only configuration strings.' },
      ],
    },
    yamlExplanation: [
      { field: 'emptyDir:\n  medium: Memory\n  sizeLimit: 128Mi', explanation: 'Mounts a fast Linux tmpfs ramdisk capped at 128 Mebibytes.' },
    ],
    referenceCheatSheet: [
      'kubectl describe pod <name> | grep -A 8 Volumes : View mounted volume names and types',
      'kubectl exec -it <pod> -- mount | grep /data : Verify how a volume is mounted in the kernel',
    ],
    solutionExplanation: 'Volumes decouple data persistence from ephemeral container lifecycles, enabling shared caches and scratch storage.',
  },

  'c-persistent-storage-pv-pvc': {
    commonPitfalls: [
      {
        mistake: 'Creating a PVC that stays in `Pending` state indefinitely.',
        whyItHappens: 'Mismatched `storageClassName`, unavailable storage capacity, or volume access mode not supported by the underlying storage provider.',
        fix: 'Run `kubectl describe pvc <name>` to read the exact provisioner failure event.',
      },
      {
        mistake: 'Setting `persistentVolumeReclaimPolicy: Delete` on mission-critical databases without backups.',
        whyItHappens: 'When the PVC is deleted, the underlying cloud storage volume is permanently destroyed immediately.',
        fix: 'Use `persistentVolumeReclaimPolicy: Retain` so data is preserved for manual recovery even if the claim is deleted.',
      },
    ],
    quizQuestion: {
      question: 'What is the relationship between a PersistentVolume (PV) and a PersistentVolumeClaim (PVC)?',
      options: [
        { label: 'A', text: 'A PV is a request for storage; a PVC is the actual physical disk.', isCorrect: false, explanation: 'Inverted: PVC is the request; PV is the actual resource.' },
        { label: 'B', text: 'A PersistentVolume (PV) is a cluster-level storage resource provisioned by administrators or CSI; a PersistentVolumeClaim (PVC) is a request for storage by a developer that binds 1:1 to a matching PV.', isCorrect: true, explanation: 'Correct! Like Nodes and Pods: PV is the cluster storage resource, and PVC is the pod request that binds to it.' },
        { label: 'C', text: 'They are identical and interchangeable terms.', isCorrect: false, explanation: 'They have distinct roles and scopes.' },
        { label: 'D', text: 'PV only exists in Docker Swarm.', isCorrect: false, explanation: 'PV is a core Kubernetes concept.' },
      ],
    },
    yamlExplanation: [
      { field: 'accessModes: ["ReadWriteOnce"]', explanation: 'Volume can be mounted read-write by a single node at a time.' },
      { field: 'resources.requests.storage: 10Gi', explanation: 'Size of disk requested from the dynamic cloud storage provisioner.' },
    ],
    referenceCheatSheet: [
      'kubectl get pv,pvc -A : View all cluster persistent volumes and their binding status (Bound, Released, Pending)',
      'kubectl describe pvc <name> : Inspect volume binding events and storage class provisioner logs',
    ],
    solutionExplanation: 'PVs and PVCs provide a declarative abstraction layer separating infrastructure storage provisioning from developer consumption.',
  },

  'c-csi-drivers-storage': {
    commonPitfalls: [
      {
        mistake: 'Attempting to expand a volume when the StorageClass has `allowVolumeExpansion: false`.',
        whyItHappens: 'Kubernetes rejects edits to `pvc.spec.resources.requests.storage` if expansion is disabled.',
        fix: 'Ensure `allowVolumeExpansion: true` is enabled in the StorageClass definition.',
      },
      {
        mistake: 'Volume attachment timeouts during node crashes (`Multi-Attach error for volume`).',
        whyItHappens: 'Cloud providers take up to 6 minutes to forcefully detach an EBS volume from an unresponsive node.',
        fix: 'Use non-graceful node shutdown features (Kubelet / CSI volume attachment timeouts) or fast failover CSI drivers.',
      },
    ],
    quizQuestion: {
      question: 'What is the Container Storage Interface (CSI) in Kubernetes?',
      options: [
        { label: 'A', text: 'A hard disk manufacturer in California.', isCorrect: false, explanation: 'CSI is a software specification.' },
        { label: 'B', text: 'An industry standard specification that allows third-party storage vendors (AWS, NetApp, Ceph, Portworx) to write storage plugins out-of-tree without modifying core Kubernetes source code.', isCorrect: true, explanation: 'Correct! CSI decoupled storage providers from core Kubernetes codebase, enabling rapid vendor innovation.' },
        { label: 'C', text: 'A command line tool for formatting USB drives.', isCorrect: false, explanation: 'CSI is an API standard, not a formatting tool.' },
        { label: 'D', text: 'A tool for managing RAM memory chips.', isCorrect: false, explanation: 'CSI deals with block and file persistent storage.' },
      ],
    },
    yamlExplanation: [
      { field: 'provisioner: ebs.csi.aws.com', explanation: 'Identifies the CSI plugin responsible for dynamically allocating EBS volumes in AWS.' },
      { field: 'volumeBindingMode: WaitForFirstConsumer', explanation: 'Delays volume provisioning until the pod is scheduled to ensure the volume is created in the exact availability zone of the node.' },
    ],
    referenceCheatSheet: [
      'kubectl get storageclasses : List dynamic provisioners and default storage classes',
      'kubectl get csidrivers : View registered CSI storage drivers on the cluster',
    ],
    solutionExplanation: 'CSI standardizes storage provisioning, snapshots, cloning, and dynamic volume expansion across all storage vendors.',
  },

  'c-stateful-applications-storage': {
    commonPitfalls: [
      {
        mistake: 'Running database migrations simultaneously on all replicas during a rolling update.',
        whyItHappens: 'All replicas boot new code and attempt schema alterations concurrently, causing deadlocks.',
        fix: 'Run migrations as an isolated pre-deployment Kubernetes Job before initiating the StatefulSet rollout.',
      },
      {
        mistake: 'Neglecting automated database backup and point-in-time recovery (PITR).',
        whyItHappens: 'Relying solely on PVC storage replication without external offsite snapshots.',
        fix: 'Use VolumeSnapshots and dedicated Operator backup schedules (e.g. Wal-G, pgBackRest, Velero).',
      },
    ],
    quizQuestion: {
      question: 'Why do production Kubernetes deployments use dedicated database Operators (like CloudNative-PG, Strimzi Kafka) instead of bare StatefulSets?',
      options: [
        { label: 'A', text: 'Because StatefulSets cannot run database software.', isCorrect: false, explanation: 'StatefulSets can run databases, but lack operational intelligence.' },
        { label: 'B', text: 'Operators encode human SRE domain knowledge into software controllers, automating complex cluster failover, leader election, backup creation, and replication recovery.', isCorrect: true, explanation: 'Correct! Operators extend Kubernetes with custom logic to handle database-specific clustering that generic StatefulSets cannot do alone.' },
        { label: 'C', text: 'Operators make databases 100 times faster.', isCorrect: false, explanation: 'Performance depends on hardware and storage, not operators.' },
        { label: 'D', text: 'Because cloud providers forbid StatefulSets.', isCorrect: false, explanation: 'StatefulSets are fully supported everywhere.' },
      ],
    },
    yamlExplanation: [
      { field: 'kind: Cluster\napiVersion: postgresql.cnpg.io/v1', explanation: 'Custom Resource representing an enterprise high-availability PostgreSQL cluster managed by an Operator.' },
    ],
    referenceCheatSheet: [
      'kubectl get volumesnapshots -A : View point-in-time storage snapshots created via CSI',
      'kubectl get statefulsets,pvc : Audit stateful workloads and bound storage claims',
    ],
    solutionExplanation: 'Stateful applications combine StatefulSets, headless services, CSI drivers, and specialized Operators for resilient enterprise persistence.',
  },
};
