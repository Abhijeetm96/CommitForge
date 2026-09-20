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
}

export interface KubeChapter {
  id: string;
  number: number;
  title: string;
  category: string;
  concepts: KubeConcept[];
}
