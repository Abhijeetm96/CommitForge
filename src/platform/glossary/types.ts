// src/platform/glossary/types.ts
import { TechnologyType } from '../lesson-runtime/types';

export interface GlossaryEntry {
  id: string;
  term: string;
  technology: TechnologyType;
  category: string;
  simpleDefinition: string;
  technicalDefinition: string;
  analogy: string;
  exampleCommand?: string;
  commonConfusion?: string;
  relatedTerms?: string[];
  lessonId?: string;
}
