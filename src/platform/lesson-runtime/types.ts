// src/platform/lesson-runtime/types.ts
/**
 * Universal Lesson Model & Pedagogical Schema for Forge Platform
 * Powers CommitForge (Git), DockForge (Docker), and PodForge (Kubernetes).
 * Supports the complete 14-step progressive disclosure learning flow.
 */

export type TechnologyType = 'git' | 'docker' | 'kubernetes';
export type ConceptDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface SyntaxTokenBreakdown {
  token: string;
  role: 'binary' | 'subcommand' | 'flag' | 'argument' | 'target' | 'option';
  meaning: string;
  withoutIt: string;
  whenToUse: string;
  alternatives?: string[];
}

export interface ConceptVariation {
  title: string;
  syntax: string;
  explanation: string;
  whenToUse: string;
}

export interface TerminologyItem {
  term: string;
  simpleDef: string;
  technicalDef: string;
  analogy?: string;
  confusionNote?: string;
}

export interface DiagramNode {
  id: string;
  label: string;
  simpleDef: string;
  techDef: string;
  color?: string;
  status?: 'active' | 'inactive' | 'pending' | 'warning' | 'success';
}

export interface DiagramFlow {
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
}

export interface VisualDiagramSpec {
  title: string;
  nodes: DiagramNode[];
  flow?: DiagramFlow[];
  layout?: 'horizontal' | 'vertical' | 'grid';
}

export interface ScenarioDetail {
  title: string;
  context?: string;
  goal?: string;
  setup?: string;
  problem?: string;
  solution?: string;
  takeaway?: string;
}

export interface SimulationStep {
  stepNumber: number;
  actionTitle: string;
  whatHappens: string;
  why: string;
  technicalDetail: string;
}

export interface MistakeRecovery {
  mistakeTitle: string;
  mistakeCommand: string;
  whatHappened: string;
  whatWasNotLost: string;
  recoveryCommand: string;
  recoveryExplanation: string;
}

export interface ChallengeSpec {
  instructions: string;
  taskGoal: string;
  seedCommands?: string[];
  solutionCommand: string;
  hints: string[];
  explanation: string;
}

export interface QuizQuestion {
  question: string;
  options: Array<{
    label: string;
    isCorrect: boolean;
    explanation: string;
  }>;
}

export interface UniversalLesson {
  id: string;
  technology: TechnologyType;
  topicId: string;
  topicNumber: string;
  topicTitle: string;
  title: string;
  command: string;
  subtitle: string;
  difficulty: ConceptDifficulty;
  badges: string[];

  // 1. Definition & Explanations
  definition: string;
  inSimpleWords: string;
  beginnerExplanation: string;
  technicalExplanation: string;
  realWorldAnalogy: {
    metaphor: string;
    explanation: string;
  };

  // 2. Why & Context
  whyDoWeNeedIt: string;
  problemItSolves: string;
  whenToUse: string[];
  whenNotToUse: string[];
  whereCommonlyUsed: string[];

  // 3. Visual Metaphor & Diagram
  visualDiagram: VisualDiagramSpec;

  // 4. Terminology Breakdown
  terminology: TerminologyItem[];

  // 5. Syntax & Tokens
  syntax: {
    command: string;
    tokens: SyntaxTokenBreakdown[];
    variations: ConceptVariation[];
  };

  // 6. Scenarios (Beginner, Real Dev, Production)
  scenarios: {
    beginner: ScenarioDetail;
    realDeveloper: ScenarioDetail;
    production: ScenarioDetail;
  };

  // 7. Interactive Simulation & State Transitions
  simulation: {
    initialStateDescription: string;
    visualComponentKey?: string; // 'git-three-area' | 'docker-hardware-rig' | 'kube-cluster-mesh'
    steps: SimulationStep[];
  };

  // 8. Controlled Mistake & Recovery
  mistakeAndRecovery: MistakeRecovery;

  // 9. Challenge & Assessment
  challenge: ChallengeSpec;
  quiz?: QuizQuestion;

  // 10. Navigation & Relationships
  prerequisites?: string[];
  nextLessons?: string[];
}

export type PedagogicalStepId =
  | 'problem'
  | 'concept'
  | 'visual'
  | 'terminology'
  | 'syntax'
  | 'variations'
  | 'scenario'
  | 'simulation'
  | 'cause_effect'
  | 'terminal'
  | 'mistake'
  | 'recovery'
  | 'challenge'
  | 'mastery';

export interface PedagogicalStepConfig {
  id: PedagogicalStepId;
  stepNumber: number;
  label: string;
  shortTitle: string;
  icon: string;
}
