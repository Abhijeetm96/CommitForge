// src/platform/search/types.ts
import { TechnologyType } from '../lesson-runtime/types';

export interface ProblemDiagnosis {
  id: string;
  title: string;
  symptom: string;
  technology: TechnologyType;
  category: string;
  frequency: 'common' | 'critical' | 'occasional';
  whyItHappened: string;
  mentalModelExplanation: string;
  remedyCommand: string;
  explanationOfFix: string;
  preventativeTip: string;
  relatedLessonId: string;
  relatedLessonTitle: string;
}
