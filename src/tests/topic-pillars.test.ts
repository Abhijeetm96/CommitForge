import { describe, it, expect } from 'vitest';
import { BENTO_CATEGORIES } from '../data/journeyModel';
import { CHAPTER_PILLARS, getChapterPillars, getTopicPillars } from '../data/topicPillars';

describe('5 Pillars Architecture: Definition, Syntax, Variations, Examples, and Explanations', () => {
  it('should verify all 12 chapters have rich, complete 5-Pillar knowledge models', () => {
    expect(BENTO_CATEGORIES.length).toBe(12);

    BENTO_CATEGORIES.forEach((cat) => {
      const pillars = getChapterPillars(cat.id);
      expect(pillars).toBeDefined();
      expect(pillars.chapterId).toBe(cat.id);
      expect(pillars.chapterTitle).toBeTruthy();
      expect(pillars.chapterEmoji).toBeTruthy();

      // 1. Definition (Short, Beginner/Kid, Technical)
      expect(pillars.definition.short.length).toBeGreaterThan(15);
      expect(pillars.definition.beginner.length).toBeGreaterThan(20);
      expect(pillars.definition.technical.length).toBeGreaterThan(20);

      // 2. Syntax (Primary, Structure, Tokens)
      expect(pillars.syntax.primary.length).toBeGreaterThan(5);
      expect(pillars.syntax.structure.length).toBeGreaterThan(5);
      expect(pillars.syntax.tokens.length).toBeGreaterThanOrEqual(2);
      pillars.syntax.tokens.forEach((t) => {
        expect(t.token).toBeTruthy();
        expect(t.role).toBeTruthy();
        expect(t.explanation).toBeTruthy();
      });

      // 3. Variations (Multiple syntax forms with whenToUse)
      expect(pillars.variations.length).toBeGreaterThanOrEqual(2);
      pillars.variations.forEach((v) => {
        expect(v.syntax).toBeTruthy();
        expect(v.title).toBeTruthy();
        expect(v.whenToUse).toBeTruthy();
      });

      // 4. Examples (Title, Code, Explanation)
      expect(pillars.examples.length).toBeGreaterThanOrEqual(1);
      pillars.examples.forEach((ex) => {
        expect(ex.title).toBeTruthy();
        expect(ex.code).toBeTruthy();
        expect(ex.explanation).toBeTruthy();
      });

      // 5. Explanation (Mental model, What changes, What stays safe, Why it matters, Pro tip)
      expect(pillars.explanation.mentalModel.length).toBeGreaterThan(15);
      expect(pillars.explanation.whatChanges.length).toBeGreaterThan(10);
      expect(pillars.explanation.whatDoesNotChange.length).toBeGreaterThan(10);
      expect(pillars.explanation.whyItMatters.length).toBeGreaterThan(10);
      expect(pillars.explanation.proTip.length).toBeGreaterThan(10);
    });
  });

  it('should verify every one of the 128 concepts has complete 5-Pillar knowledge models', () => {
    let checkedCount = 0;

    BENTO_CATEGORIES.forEach((cat) => {
      cat.concepts.forEach((concept) => {
        checkedCount++;
        const pillars = getTopicPillars(concept.id);

        expect(pillars).toBeDefined();
        expect(pillars.conceptId).toBe(concept.id);
        expect(pillars.conceptTitle).toBe(concept.title);
        expect(pillars.chapterId).toBe(cat.id);
        expect(pillars.chapterEmoji).toBeTruthy();

        // 1. Definition
        expect(pillars.definition.short).toBeTruthy();
        expect(pillars.definition.beginner).toBeTruthy();
        expect(pillars.definition.technical).toBeTruthy();

        // 2. Syntax
        expect(pillars.syntax.primary).toBeTruthy();
        expect(pillars.syntax.structure).toBeTruthy();
        expect(pillars.syntax.tokens.length).toBeGreaterThanOrEqual(1);

        // 3. Variations
        expect(pillars.variations.length).toBeGreaterThanOrEqual(1);
        pillars.variations.forEach((v) => {
          expect(v.syntax).toBeTruthy();
          expect(v.whenToUse).toBeTruthy();
        });

        // 4. Examples
        expect(pillars.examples.length).toBeGreaterThanOrEqual(1);
        pillars.examples.forEach((ex) => {
          expect(ex.title).toBeTruthy();
          expect(ex.code).toBeTruthy();
          expect(ex.explanation).toBeTruthy();
        });

        // 5. Explanation
        expect(pillars.explanation.mentalModel).toBeTruthy();
        expect(pillars.explanation.whatChanges).toBeTruthy();
        expect(pillars.explanation.whatDoesNotChange).toBeTruthy();
        expect(pillars.explanation.whyItMatters).toBeTruthy();
        expect(pillars.explanation.proTip).toBeTruthy();
      });
    });

    expect(checkedCount).toBe(128);
  });

  it('should resolve tailored 5-Pillar knowledge for individual subtopics', () => {
    // Check specific subtopic on c-what-is-vcs
    const subtopic = 'Centralized vs Distributed Version Control';
    const subPillars = getTopicPillars('c-what-is-vcs', subtopic);

    expect(subPillars.activeSubtopic).toBe(subtopic);
    expect(subPillars.definition.short).toContain(subtopic);
    expect(subPillars.examples.some((ex) => ex.title.includes(subtopic))).toBe(true);

    // Check branching subtopic
    const branchSub = 'Safe experimentation via isolated branches';
    const branchPillars = getTopicPillars('c-why-use-vcs', branchSub);
    expect(branchPillars.activeSubtopic).toBe(branchSub);
    expect(branchPillars.definition.short).toContain(branchSub);
  });
});
