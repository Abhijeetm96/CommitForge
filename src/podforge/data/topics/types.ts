export interface KubePitfall {
  mistake: string;
  whyItHappens: string;
  fix: string;
}

export interface KubeQuizOption {
  label: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface KubeQuizQuestion {
  question: string;
  options: KubeQuizOption[];
}

export interface KubeYamlFieldExplanation {
  field: string;
  explanation: string;
}

export interface KubeDockerBridge {
  dockerEquivalent: string;
  dockerCommand?: string;
  k8sEquivalent: string;
  keyDifference: string;
  whyK8sApproach: string;
}

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
    expectedOutput?: string;
    solutionExplanation?: string;
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

  // Advanced Sections: Pitfalls, Quiz, YAML Syntax & Reference
  commonPitfalls?: KubePitfall[];
  quizQuestion?: KubeQuizQuestion;
  yamlExplanation?: KubeYamlFieldExplanation[];
  referenceCheatSheet?: string[];
  dockerBridge?: KubeDockerBridge;
}

export interface KubeChapter {
  id: string;
  number: number;
  title: string;
  category: string;
  concepts: KubeConcept[];
}

