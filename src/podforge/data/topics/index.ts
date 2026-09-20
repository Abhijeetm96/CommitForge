import type { KubeChapter, KubeConcept } from './types';
import { PART_1_CHAPTERS } from './curriculum_part1';
import { PART_2_CHAPTERS } from './curriculum_part2';
import { PART_3_CHAPTERS } from './curriculum_part3';
import { PART_4_CHAPTERS } from './curriculum_part4';
import { PART_5_CHAPTERS } from './curriculum_part5';

export type { KubeChapter, KubeConcept };

export const KUBE_CHAPTERS: KubeChapter[] = [
  ...PART_1_CHAPTERS,
  ...PART_2_CHAPTERS,
  ...PART_3_CHAPTERS,
  ...PART_4_CHAPTERS,
  ...PART_5_CHAPTERS,
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
