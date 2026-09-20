export type PodPhase =
  | 'Pending'
  | 'ContainerCreating'
  | 'Running'
  | 'CrashLoopBackOff'
  | 'OOMKilled'
  | 'Completed'
  | 'Terminating'
  | 'Failed';

export interface ContainerPort {
  containerPort: number;
  name?: string;
  protocol?: 'TCP' | 'UDP';
}

export interface ContainerResourceRequirements {
  limits?: { cpu?: string; memory?: string };
  requests?: { cpu?: string; memory?: string };
}

export interface ContainerProbe {
  type: 'httpGet' | 'exec' | 'tcpSocket';
  path?: string;
  port?: number;
  command?: string[];
  initialDelaySeconds?: number;
  periodSeconds?: number;
  failureThreshold?: number;
}

export interface ContainerSpec {
  name: string;
  image: string;
  command?: string[];
  args?: string[];
  ports?: ContainerPort[];
  env?: { name: string; value: string }[];
  resources?: ContainerResourceRequirements;
  livenessProbe?: ContainerProbe;
  readinessProbe?: ContainerProbe;
}

export interface ContainerStatus {
  name: string;
  ready: boolean;
  restartCount: number;
  image: string;
  state: {
    waiting?: { reason: string; message: string };
    running?: { startedAt: number };
    terminated?: { exitCode: number; reason: string; finishedAt: number };
  };
}

export interface ObjectMeta {
  name: string;
  namespace?: string;
  labels?: Record<string, string>;
  annotations?: Record<string, string>;
  creationTimestamp?: number;
}

export interface Pod {
  apiVersion: string;
  kind: 'Pod';
  metadata: ObjectMeta;
  spec: {
    containers: ContainerSpec[];
    nodeName?: string;
    restartPolicy?: 'Always' | 'OnFailure' | 'Never';
    tolerations?: { key: string; operator?: string; value?: string; effect?: string }[];
    nodeSelector?: Record<string, string>;
  };
  status: {
    phase: PodPhase;
    podIP?: string;
    hostIP?: string;
    containerStatuses: ContainerStatus[];
    startTime?: number;
    message?: string;
    reason?: string;
  };
}

export interface Node {
  metadata: ObjectMeta;
  spec: {
    taints?: { key: string; value: string; effect: 'NoSchedule' | 'PreferNoSchedule' | 'NoExecute' }[];
    unschedulable?: boolean;
  };
  status: {
    ready: boolean;
    role: 'control-plane' | 'worker';
    capacity: { cpu: string; memory: string; pods: number };
    usage: { cpuPercent: number; memoryPercent: number };
    nodeIP: string;
    osImage: string;
    kubeletVersion: string;
  };
}

export interface Deployment {
  apiVersion: string;
  kind: 'Deployment';
  metadata: ObjectMeta;
  spec: {
    replicas: number;
    selector: { matchLabels: Record<string, string> };
    template: {
      metadata: { labels: Record<string, string> };
      spec: { containers: ContainerSpec[] };
    };
    strategy?: { type: 'RollingUpdate' | 'Recreate' };
  };
  status: {
    replicas: number;
    readyReplicas: number;
    updatedReplicas: number;
    availableReplicas: number;
  };
}

export interface ServicePort {
  name?: string;
  port: number;
  targetPort: number;
  nodePort?: number;
  protocol?: 'TCP' | 'UDP';
}

export interface Service {
  apiVersion: string;
  kind: 'Service';
  metadata: ObjectMeta;
  spec: {
    type: 'ClusterIP' | 'NodePort' | 'LoadBalancer';
    selector: Record<string, string>;
    ports: ServicePort[];
    clusterIP?: string;
  };
  status: {
    loadBalancerIP?: string;
  };
}

export interface ConfigMap {
  apiVersion: string;
  kind: 'ConfigMap';
  metadata: ObjectMeta;
  data: Record<string, string>;
}

export interface Secret {
  apiVersion: string;
  kind: 'Secret';
  metadata: ObjectMeta;
  type?: string;
  data: Record<string, string>;
}

export interface KubeEvent {
  id: string;
  timestamp: number;
  type: 'Normal' | 'Warning';
  reason: string;
  objectKind: string;
  objectName: string;
  message: string;
}

export interface ClusterState {
  nodes: Record<string, Node>;
  pods: Record<string, Pod>;
  deployments: Record<string, Deployment>;
  services: Record<string, Service>;
  configMaps: Record<string, ConfigMap>;
  secrets: Record<string, Secret>;
  namespaces: string[];
  events: KubeEvent[];
}

export interface CommandResult {
  exitCode: number;
  stdout: string[];
  stderr: string[];
}
