import { describe, it, expect } from 'vitest';
import { ALL_ACADEMY_CONCEPTS, ACADEMY_18_TOPICS } from '../data/unifiedAcademyData';

describe('Visualization Section All Topics Quality & Completeness Audit', () => {
  const concepts = Object.values(ALL_ACADEMY_CONCEPTS);

  it('verifies all 71 concepts have rich, non-generic 3-stage visual action data', () => {
    expect(concepts.length).toBe(71);

    for (const c of concepts) {
      expect(c.actionStage, `Concept ${c.id} (${c.command}) must have actionStage`).toBeDefined();
      const { before, running, after } = c.actionStage;

      // Check Before State
      expect(before.label.length, `Concept ${c.id} before.label length`).toBeGreaterThanOrEqual(4);
      expect(before.description.length, `Concept ${c.id} before.description length`).toBeGreaterThanOrEqual(15);
      expect(before.whatChanged.length, `Concept ${c.id} before.whatChanged`).toBeGreaterThanOrEqual(1);
      expect(before.whatDidNotChange.length, `Concept ${c.id} before.whatDidNotChange`).toBeGreaterThanOrEqual(1);

      // Check Running State
      expect(running.label.length, `Concept ${c.id} running.label length`).toBeGreaterThanOrEqual(4);
      expect(running.description.length, `Concept ${c.id} running.description length`).toBeGreaterThanOrEqual(15);

      // Check After State
      expect(after.label.length, `Concept ${c.id} after.label length`).toBeGreaterThanOrEqual(4);
      expect(after.description.length, `Concept ${c.id} after.description length`).toBeGreaterThanOrEqual(15);
      expect(after.whatChanged.length, `Concept ${c.id} after.whatChanged`).toBeGreaterThanOrEqual(1);
      expect(after.whatDidNotChange.length, `Concept ${c.id} after.whatDidNotChange`).toBeGreaterThanOrEqual(1);

      // Ensure no generic placeholder strings
      expect(before.workingDirectory.some((f) => f.name === 'project-file.js')).toBe(false);
      expect(before.whatChanged).not.toContain('No change yet.');
    }
  });

  it('verifies all 18 topics have concepts accessible for visualization', () => {
    expect(ACADEMY_18_TOPICS.length).toBe(18);
    for (const topic of ACADEMY_18_TOPICS) {
      expect(topic.concepts.length).toBeGreaterThan(0);
      for (const ref of topic.concepts) {
        expect(ALL_ACADEMY_CONCEPTS[ref.id]).toBeDefined();
        expect(ALL_ACADEMY_CONCEPTS[ref.id].actionStage).toBeDefined();
      }
    }
  });
});
