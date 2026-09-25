import type { KubeConcept } from '../../topics/types';
import type { TopicFlowDiagramData } from '../../../components/diagrams/kubeDiagramTypes';

import { CHAPTER_01_CONCEPTS } from './chapter01';
import { CHAPTER_02_CONCEPTS } from './chapter02';
import { CHAPTER_03_CONCEPTS } from './chapter03';
import { CHAPTER_04_CONCEPTS } from './chapter04';
import { CHAPTER_05_CONCEPTS } from './chapter05';
import { CHAPTER_06_CONCEPTS } from './chapter06';
import { CHAPTER_07_CONCEPTS } from './chapter07';
import { CHAPTER_08_CONCEPTS } from './chapter08';
import { CHAPTER_09_CONCEPTS } from './chapter09';
import { CHAPTER_10_CONCEPTS } from './chapter10';
import { CHAPTER_11_CONCEPTS } from './chapter11';
import { CHAPTER_12_CONCEPTS } from './chapter12';
import { CHAPTER_13_CONCEPTS } from './chapter13';
import { CHAPTER_14_CONCEPTS } from './chapter14';
import { CHAPTER_15_CONCEPTS } from './chapter15';

export const ALL_CONCEPT_DIAGRAMS: Record<string, (c: KubeConcept) => TopicFlowDiagramData> = {
  ...CHAPTER_01_CONCEPTS,
  ...CHAPTER_02_CONCEPTS,
  ...CHAPTER_03_CONCEPTS,
  ...CHAPTER_04_CONCEPTS,
  ...CHAPTER_05_CONCEPTS,
  ...CHAPTER_06_CONCEPTS,
  ...CHAPTER_07_CONCEPTS,
  ...CHAPTER_08_CONCEPTS,
  ...CHAPTER_09_CONCEPTS,
  ...CHAPTER_10_CONCEPTS,
  ...CHAPTER_11_CONCEPTS,
  ...CHAPTER_12_CONCEPTS,
  ...CHAPTER_13_CONCEPTS,
  ...CHAPTER_14_CONCEPTS,
  ...CHAPTER_15_CONCEPTS,
};
