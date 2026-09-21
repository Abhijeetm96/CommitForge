export type BlockCategory =
  | 'client'
  | 'control-plane'
  | 'node'
  | 'runtime'
  | 'storage'
  | 'network'
  | 'operator'
  | 'security'
  | 'external';

export interface FlowBlock {
  id: string;
  label: string;
  sublabel: string;
  category: BlockCategory;
  icon: string; // key matching icon mapping (e.g. 'terminal', 'server', 'database', 'cpu', etc.)
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

export interface FlowConnection {
  from: string; // Source block id
  to: string;   // Target block id
  label: string;
  protocol?: string; // e.g. 'HTTPS / REST', 'gRPC / HTTP2', 'Raft Protocol', 'Unix Socket / IPC', 'iptables / eBPF', 'CSI gRPC'
  stepNumber: number; // 1-indexed step that triggers this connection
}

export interface FlowStep {
  step: number;
  title: string;
  summary: string;
  activeBlockIds: string[];
  activeConnectionIdxs: number[];
  detailExplanation: {
    simpleWords: string;
    technicalMechanics: string;
  };
  kubectlTrace?: string;
}

export interface TopicFlowDiagramData {
  chapterNumber: number;
  chapterTitle: string;
  conceptNumber: string;
  conceptTitle: string;
  architectureType: string;
  blocks: FlowBlock[];
  connections: FlowConnection[];
  steps: FlowStep[];
  architecturalSummary: string;
}
