import { GitRepo } from '../../git-engine/types';
import { GitVisualSnapshot } from './gitPhysics';

export type CausalPhase =
  | 'start'
  | 'request'
  | 'check'
  | 'decide'
  | 'change'
  | 'complete';

export interface PredictionChallenge {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
}

export interface CausalAnimationStep {
  id: string;
  label: string; // e.g. "1 Start", "2 Contact", "3 Compare", "4 Prepare", "5 Transfer", "6 Update", "7 Complete"
  phase: CausalPhase;
  title: string;
  description: string;
  simpleExplanation: string;
  technicalExplanation: string;
  whatGitChecks?: string;
  whatGitChanges?: string;
  whatChangedBadges?: string[];
  whyDidGitDoThat?: string;
  prediction?: PredictionChallenge;
  snapshotModifier?: (base: GitVisualSnapshot) => GitVisualSnapshot;
  activeEntityIds?: string[]; // IDs of entities to highlight during this step
  visualMetadata?: Record<string, any>;
}

export interface CausalCommandStory {
  id: string;
  command: string;
  title: string;
  category: 'foundations' | 'branching' | 'remotes' | 'history' | 'advanced';
  subtitle: string;
  mentalModelQuote: string;
  keyTakeaways: string[];
  steps: CausalAnimationStep[];
  terminalDemo: {
    command: string;
    outputLines: string[];
  };
  simulatorType?: 'push' | 'commit' | 'add' | 'branch' | 'switch' | 'merge' | 'conflict' | 'rebase' | 'reset' | 'stash';
}

export type ViewLevel = 'human' | 'git-user' | 'expert';
export type StageMode = 'animation' | 'diagram' | 'real';
export type TimeState = 'before' | 'during' | 'after';
