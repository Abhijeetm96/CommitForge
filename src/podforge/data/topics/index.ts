import type { KubeChapter, KubeConcept } from './types';
import { PHASE_1_CHAPTERS } from './phase1';
import { PHASE_2_CHAPTERS } from './phase2';
import { PHASE_3_CHAPTERS } from './phase3';
import { PHASE_4_CHAPTERS } from './phase4';
import { PHASE_5_CHAPTERS } from './phase5';
import { PHASE_6_CHAPTERS } from './phase6';

export type { KubeChapter, KubeConcept };

export const KUBE_CHAPTERS: KubeChapter[] = [
  ...PHASE_1_CHAPTERS,
  ...PHASE_2_CHAPTERS,
  ...PHASE_3_CHAPTERS,
  ...PHASE_4_CHAPTERS,
  ...PHASE_5_CHAPTERS,
  ...PHASE_6_CHAPTERS,
];

export const TOTAL_CHAPTERS = KUBE_CHAPTERS.length;
export const TOTAL_CONCEPTS = KUBE_CHAPTERS.reduce((acc, ch) => acc + ch.concepts.length, 0);

export function getAllConcepts(): KubeConcept[] {
  return KUBE_CHAPTERS.flatMap((ch) => ch.concepts);
}

export function getConceptById(id: string): KubeConcept | undefined {
  for (const ch of KUBE_CHAPTERS) {
    const found = ch.concepts.find((c) => c.id === id);
    if (found) return found;
  }
  return undefined;
}
