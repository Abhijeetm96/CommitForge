import { describe, it, expect } from 'vitest';
import { ACADEMY_18_TOPICS, ALL_ACADEMY_CONCEPTS } from '../data/unifiedAcademyData';

describe('References Section All Topics Quality & Completeness Audit', () => {
  const allConceptIds = ACADEMY_18_TOPICS.flatMap((topic) =>
    topic.concepts.map((c) => ({
      conceptId: c.id,
      title: c.title,
      topicNumber: topic.number,
      topicTitle: topic.title,
    }))
  );

  it('audits references across all 71 concepts', () => {
    expect(allConceptIds.length).toBe(71);

    const missingReference: string[] = [];
    const missingSynopsis: string[] = [];
    const missingOptions: string[] = [];
    const missingInternals: string[] = [];
    const missingEdgeCases: string[] = [];
    const missingDocUrl: string[] = [];
    const missingSyntaxCheatSheet: string[] = [];
    const missingCommonErrors: string[] = [];

    allConceptIds.forEach(({ conceptId, title, topicNumber }) => {
      const c = ALL_ACADEMY_CONCEPTS[conceptId];
      if (!c) {
        missingReference.push(`${conceptId} (not in ALL_ACADEMY_CONCEPTS)`);
        return;
      }

      if (!c.reference) {
        missingReference.push(`${conceptId} (no reference object)`);
        return;
      }

      if (!c.reference.synopsis) missingSynopsis.push(conceptId);
      if (!c.reference.options || c.reference.options.length === 0) missingOptions.push(conceptId);
      if (!c.reference.gitInternals || !c.reference.gitInternals.explanation) missingInternals.push(conceptId);
      if (!c.reference.edgeCases || c.reference.edgeCases.length === 0) missingEdgeCases.push(conceptId);
      if (!c.reference.officialDocUrl) missingDocUrl.push(conceptId);
      if (!c.reference.syntaxCheatSheet || c.reference.syntaxCheatSheet.length === 0) missingSyntaxCheatSheet.push(conceptId);
      if (!c.reference.commonErrors || c.reference.commonErrors.length === 0) missingCommonErrors.push(conceptId);
    });

    expect(missingReference).toHaveLength(0);
    expect(missingSynopsis).toHaveLength(0);
    expect(missingOptions).toHaveLength(0);
    expect(missingInternals).toHaveLength(0);
    expect(missingEdgeCases).toHaveLength(0);
    expect(missingDocUrl).toHaveLength(0);
    expect(missingSyntaxCheatSheet).toHaveLength(0);
    expect(missingCommonErrors).toHaveLength(0);
  });

  it('audits each of the 18 topics individually and logs complete references stats', () => {
    console.log('\n=== REFERENCES COVERAGE AUDIT REPORT: 18 TOPICS / 71 CONCEPTS ===');
    let totalConcepts = 0;
    let totalValid = 0;

    ACADEMY_18_TOPICS.forEach((topic) => {
      let topicValid = 0;
      topic.concepts.forEach((ref) => {
        const c = ALL_ACADEMY_CONCEPTS[ref.id];
        if (
          c &&
          c.reference &&
          c.reference.officialDocUrl &&
          c.reference.synopsis &&
          c.reference.syntaxCheatSheet?.length &&
          c.reference.options?.length &&
          c.reference.gitInternals?.explanation &&
          c.reference.commonErrors?.length &&
          c.reference.edgeCases?.length
        ) {
          topicValid++;
        }
      });
      totalConcepts += topic.concepts.length;
      totalValid += topicValid;

      const paddedNum = String(topic.number).padStart(2, '0');
      const paddedTitle = topic.title.padEnd(40, ' ');
      const percent = Math.round((topicValid / topic.concepts.length) * 100);
      console.log(`✓ Topic ${paddedNum}: ${paddedTitle} | ${topicValid}/${topic.concepts.length} concepts fully referenced [${percent}%]`);
    });

    console.log(`TOTAL: 18 Topics, ${totalConcepts} Concepts — ${totalValid}/${totalConcepts} Fully Referenced (100%)\n`);
    expect(totalValid).toBe(71);
    expect(totalConcepts).toBe(71);
  });
});
