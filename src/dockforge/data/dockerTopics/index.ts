import { UniversalDockerConcept } from '../unifiedDockerData';
import { TOPIC_01_02_CONCEPTS } from './topic01_02_fundamentals';
import { TOPIC_03_04_CONCEPTS } from './topic03_04_basics';
import { TOPIC_05_06_CONCEPTS } from './topic05_06_data_images';
import { TOPIC_07_08_CONCEPTS } from './topic07_08_building_registries';
import { TOPIC_09_10_CONCEPTS } from './topic09_10_compose_management';
import { TOPIC_11_12_CONCEPTS } from './topic11_12_cli_security';
import { TOPIC_13_14_CONCEPTS } from './topic13_14_devexp_deployment';

export const ALL_DOCKER_CONCEPTS: Record<string, UniversalDockerConcept> = {
  ...TOPIC_01_02_CONCEPTS,
  ...TOPIC_03_04_CONCEPTS,
  ...TOPIC_05_06_CONCEPTS,
  ...TOPIC_07_08_CONCEPTS,
  ...TOPIC_09_10_CONCEPTS,
  ...TOPIC_11_12_CONCEPTS,
  ...TOPIC_13_14_CONCEPTS,
};
