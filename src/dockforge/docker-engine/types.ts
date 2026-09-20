export type ContainerStatus = 'running' | 'stopped' | 'exited' | 'created' | 'paused' | 'restarting';

export interface ContainerPort {
  containerPort: number;
  hostPort: number;
  protocol: 'tcp' | 'udp';
}

export interface ContainerVolumeMount {
  type: 'volume' | 'bind' | 'tmpfs';
  source: string; // Volume name or host path
  target: string; // Path inside container
  readOnly?: boolean;
}

export interface Container {
  id: string;
  name: string;
  imageId: string;
  imageName: string;
  status: ContainerStatus;
  created: string; // ISO or human string
  ports: ContainerPort[];
  mounts: ContainerVolumeMount[];
  network: string; // e.g. 'bridge', 'host', 'custom-net'
  ipAddress: string;
  env: Record<string, string>;
  cmd: string;
  logs: string[];
  cpuUsagePct: number;
  memoryUsageMb: number;
  memoryLimitMb: number;
}

export interface ImageLayer {
  id: string;
  createdCommand: string;
  sizeMb: number;
  cached: boolean;
}

export interface DockerImage {
  id: string;
  repository: string;
  tag: string;
  digest: string;
  created: string;
  sizeMb: number;
  layers: ImageLayer[];
  exposedPorts: number[];
  entrypoint?: string[];
  cmd?: string[];
  env?: Record<string, string>;
  workingDir?: string;
}

export interface DockerVolume {
  name: string;
  driver: string;
  scope: string;
  mountpoint: string;
  createdAt: string;
  sizeMb: number;
  labels: Record<string, string>;
}

export interface DockerNetwork {
  id: string;
  name: string;
  driver: 'bridge' | 'host' | 'none' | 'overlay';
  scope: string;
  subnet: string;
  gateway: string;
  containers: string[]; // Container IDs attached
}

export interface DockerfileInstruction {
  line: number;
  keyword: 'FROM' | 'RUN' | 'COPY' | 'ADD' | 'WORKDIR' | 'ENV' | 'EXPOSE' | 'CMD' | 'ENTRYPOINT' | 'USER' | 'VOLUME' | 'ARG';
  args: string;
}

export interface ComposeService {
  name: string;
  image?: string;
  build?: string;
  ports?: string[];
  environment?: Record<string, string>;
  volumes?: string[];
  networks?: string[];
  dependsOn?: string[];
  restart?: string;
}

export interface DockerComposeConfig {
  version: string;
  services: Record<string, ComposeService>;
  volumes?: Record<string, any>;
  networks?: Record<string, any>;
}

export interface DockerCommandResult {
  rawCommand: string;
  stdout: string[];
  stderr: string[];
  exitCode: number;
  whatHappened?: string;
  affectedContainers?: string[];
  affectedImages?: string[];
}
