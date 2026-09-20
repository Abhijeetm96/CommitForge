import { describe, it, expect } from 'vitest';
import { ALL_ACADEMY_CONCEPTS, ACADEMY_18_TOPICS } from '../commitforge/data/unifiedAcademyData';

describe('Visualization Section All Topics Quality & Completeness Audit', () => {
  const concepts = Object.values(ALL_ACADEMY_CONCEPTS);

  it('verifies all 75 concepts have rich, non-generic 3-stage visual action data', () => {
    expect(concepts.length).toBe(75);

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

  it('audits each of the 18 topics individually and logs complete visualization stats', () => {
    const report: Array<{ topicNum: string; topicTitle: string; conceptCount: number; allVisualized: boolean }> = [];

    ACADEMY_18_TOPICS.forEach((topic) => {
      const allVisualized = topic.concepts.every((ref) => {
        const c = ALL_ACADEMY_CONCEPTS[ref.id];
        return (
          c &&
          c.actionStage &&
          c.actionStage.before &&
          c.actionStage.running &&
          c.actionStage.after &&
          c.actionStage.before.label &&
          c.actionStage.running.label &&
          c.actionStage.after.label
        );
      });

      expect(allVisualized, `Topic ${topic.number} (${topic.title}) must have all concepts visualized`).toBe(true);

      report.push({
        topicNum: topic.number,
        topicTitle: topic.title,
        conceptCount: topic.concepts.length,
        allVisualized,
      });
    });

    // Verify 18 topics
    expect(report.length).toBe(18);
    // Verify sum of concepts across 18 topics is 75
    const totalConcepts = report.reduce((sum, r) => sum + r.conceptCount, 0);
    expect(totalConcepts).toBe(75);

    console.log('=== VISUALIZATION COVERAGE AUDIT REPORT: 18 TOPICS / 75 CONCEPTS ===');
    report.forEach((r) => {
      console.log(`✓ Topic ${r.topicNum}: ${r.topicTitle.padEnd(45)} | ${r.conceptCount} concepts visualized [100%]`);
    });
    console.log(`TOTAL: 18 Topics, 75 Concepts — 100% Populated and Verified`);
  });
});
