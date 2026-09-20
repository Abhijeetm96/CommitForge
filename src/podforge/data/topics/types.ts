export interface KubeConcept {
  id: string;
  number: string;
  title: string;
  commandPill: string;
  badge: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  description: string;
  explanation: string;
  yamlSnippet: string;
  kubectlCommands: string[];
  visualizerFocus: string;
  practiceChallenge: {
    instructions: string;
    goalCommand: string;
    hints: string[];
  };

  // Structured Concept Overview & Deep Pedagogical Fields
  subtopics?: string[];
  whatIsIt?: string;
  inSimpleWords?: string;
  realWorldAnalogy?: {
    metaphor: string;
    explanation: string;
  };
  whenToUse?: string[];
  whenNotToUse?: string[];
  lifecycleSteps?: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  keyMechanisms?: Array<{
    title: string;
    detail: string;
  }>;
  productionTips?: string[];
}

export interface KubeChapter {
  id: string;
  number: number;
  title: string;
  category: string;
  concepts: KubeConcept[];
}
