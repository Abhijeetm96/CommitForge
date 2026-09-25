export type DockerBlockCategory =
  | 'client'
  | 'daemon'
  | 'runtime'
  | 'kernel'
  | 'storage'
  | 'network'
  | 'registry'
  | 'compose'
  | 'security'
  | 'cloud';

export interface DockerFlowBlock {
  id: string;
  label: string;
  sublabel: string;
  category: DockerBlockCategory;
  icon: string; // 'terminal' | 'server' | 'database' | 'cpu' | 'shield' | 'network' | 'box' | 'hard-drive' | 'layers' | 'cloud' | 'activity' | 'zap'
  portOrProtocol?: string;
  statusText?: string;
  details: {
    role: string;
    processName?: string;
    cliDiagnostic: string;
    configLocation?: string;
    keyInsight: string;
  };
}

export interface DockerFlowConnection {
  from: string; // Source block id
  to: string;   // Target block id
  label: string;
  protocol?: string; // e.g. 'UNIX Domain Socket', 'gRPC / HTTP2', 'clone() syscall', 'Overlay2 mount', 'iptables NAT', 'HTTPS / v2 Registry'
  stepNumber: number; // 1-indexed step that triggers this connection
}

export interface DockerFlowStep {
  step: number;
  title: string;
  summary: string;
  activeBlockIds: string[];
  activeConnectionIdxs: number[];
  detailExplanation: {
    simpleWords: string;
    technicalMechanics: string;
  };
  dockerTrace?: string;
}

export interface DockerTopicFlowDiagramData {
  topicId: string;
  topicNumber: string;
  topicTitle: string;
  conceptId: string;
  conceptTitle: string;
  architectureType: string;
  architecturalSummary: string;
  blocks: DockerFlowBlock[];
  connections: DockerFlowConnection[];
  steps: DockerFlowStep[];
  subtopics?: string[];
}
