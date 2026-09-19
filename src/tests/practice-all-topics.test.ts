import { describe, it, expect } from 'vitest';
import { ACADEMY_18_TOPICS, ALL_ACADEMY_CONCEPTS } from '../data/unifiedAcademyData';

describe('Practice Section All Topics Quality & Completeness Audit', () => {
  const allConceptIds = ACADEMY_18_TOPICS.flatMap((topic) =>
    topic.concepts.map((c) => ({
      conceptId: c.id,
      title: c.title,
      topicNumber: topic.number,
      topicTitle: topic.title,
    }))
  );

  it('verifies all 71 concepts have complete practice challenge data', () => {
    expect(allConceptIds.length).toBe(71);

    const missingChallenges: string[] = [];
    const missingSafeFailures: string[] = [];
    const missingHints: string[] = [];
    const missingExpectedCommands: string[] = [];

    allConceptIds.forEach(({ conceptId, title, topicNumber }) => {
      const c = ALL_ACADEMY_CONCEPTS[conceptId];
      if (!c) {
        missingChallenges.push(`${conceptId} (not in ALL_ACADEMY_CONCEPTS)`);
        return;
      }

      if (!c.challenge) {
        missingChallenges.push(`${conceptId} (no challenge object)`);
        return;
      }

      if (!c.challenge.title || c.challenge.title.length < 5) {
        missingChallenges.push(`${conceptId} (invalid title)`);
      }

      if (!c.challenge.expectedCommands || c.challenge.expectedCommands.length === 0) {
        missingExpectedCommands.push(conceptId);
      }

      if (!c.challenge.hints || c.challenge.hints.length === 0) {
        missingHints.push(conceptId);
      }

      if (!c.challenge.safeFailure || !c.challenge.safeFailure.mistakeTitle || !c.challenge.safeFailure.recoveryCommand) {
        missingSafeFailures.push(conceptId);
      }

      // Check additional completeness fields
      expect(c.challenge.objective, `${conceptId} must have objective`).toBeTruthy();
      expect(c.challenge.seedCommands, `${conceptId} must have seedCommands`).toBeDefined();
      expect(Array.isArray(c.challenge.seedCommands), `${conceptId} seedCommands must be array`).toBe(true);
      expect(c.challenge.initialFiles, `${conceptId} must have initialFiles`).toBeDefined();
      expect(typeof c.challenge.initialFiles, `${conceptId} initialFiles must be object`).toBe('object');
      expect(c.challenge.solutionExplanation, `${conceptId} must have solutionExplanation`).toBeTruthy();
      expect(c.challenge.safeFailure?.whatHappened, `${conceptId} safeFailure.whatHappened`).toBeTruthy();
      expect(c.challenge.safeFailure?.recoveryExplanation, `${conceptId} safeFailure.recoveryExplanation`).toBeTruthy();
    });

    console.log('Missing challenges:', missingChallenges);
    console.log('Missing expectedCommands:', missingExpectedCommands);
    console.log('Missing hints:', missingHints);
    console.log('Missing safeFailures:', missingSafeFailures);

    expect(missingChallenges).toHaveLength(0);
    expect(missingExpectedCommands).toHaveLength(0);
    expect(missingHints).toHaveLength(0);
    expect(missingSafeFailures).toHaveLength(0);
  });

  it('audits each of the 18 topics individually and logs complete practice stats', () => {
    console.log('\n=== PRACTICE COVERAGE AUDIT REPORT: 18 TOPICS / 71 CONCEPTS ===');
    let totalConcepts = 0;
    let totalValid = 0;

    ACADEMY_18_TOPICS.forEach((topic) => {
      let topicValid = 0;
      topic.concepts.forEach((ref) => {
        const c = ALL_ACADEMY_CONCEPTS[ref.id];
        if (
          c &&
          c.challenge &&
          c.challenge.title &&
          c.challenge.expectedCommands?.length &&
          c.challenge.hints?.length &&
          c.challenge.safeFailure?.mistakeTitle &&
          c.challenge.safeFailure?.recoveryCommand
        ) {
          topicValid++;
        }
      });
      totalConcepts += topic.concepts.length;
      totalValid += topicValid;

      const paddedNum = String(topic.number).padStart(2, '0');
      const paddedTitle = topic.title.padEnd(40, ' ');
      const percent = Math.round((topicValid / topic.concepts.length) * 100);
      console.log(`✓ Topic ${paddedNum}: ${paddedTitle} | ${topicValid}/${topic.concepts.length} challenges [${percent}%]`);
    });

    console.log(`TOTAL: 18 Topics, ${totalConcepts} Concepts — ${totalValid}/${totalConcepts} Practice Labs Populated and Verified\n`);
    expect(totalValid).toBe(71);
    expect(totalConcepts).toBe(71);
  });
});
