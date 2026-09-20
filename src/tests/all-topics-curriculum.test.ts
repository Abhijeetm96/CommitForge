import { describe, it, expect } from 'vitest';
import {
  ACADEMY_18_TOPICS,
  ALL_ACADEMY_CONCEPTS,
  getUniversalConcept,
} from '../commitforge/data/unifiedAcademyData';

describe('All 18 Topics Complete Curriculum Verification & Quality Audit', () => {
  it('verifies all 18 topics exist with metadata, icon, and valid concept counts', () => {
    expect(ACADEMY_18_TOPICS).toHaveLength(18);

    ACADEMY_18_TOPICS.forEach((topic, idx) => {
      const expectedNum = String(idx + 1).padStart(2, '0');
      expect(topic.number).toBe(expectedNum);
      expect(topic.title.length).toBeGreaterThan(3);
      expect(topic.description.length).toBeGreaterThan(10);
      expect(topic.iconName).toBeTruthy();
      expect(topic.concepts.length).toBe(topic.conceptCount);
    });
  });

  const allConceptIds = ACADEMY_18_TOPICS.flatMap((topic) =>
    topic.concepts.map((c) => ({
      conceptId: c.id,
      title: c.title,
      topicNumber: topic.number,
      topicTitle: topic.title,
    }))
  );

  it('contains exactly 75 total concepts across all 18 topics', () => {
    expect(allConceptIds).toHaveLength(75);
  });

  it('audits all 75 concepts: depth, accuracy, structure, and zero generic fallbacks', () => {
    const fallbackSignature = 'is a core Git mechanism used in';

    allConceptIds.forEach(({ conceptId, title, topicNumber, topicTitle }) => {
      const concept = ALL_ACADEMY_CONCEPTS[conceptId];
      expect(concept, `Missing concept in ALL_ACADEMY_CONCEPTS: [${conceptId}] "${title}" in Topic ${topicNumber} (${topicTitle})`).toBeDefined();

      // Identity & Badge checks
      expect(concept.id).toBe(conceptId);
      expect(concept.title).toBeTruthy();
      expect(concept.subtitle.length, `Short subtitle for ${conceptId}`).toBeGreaterThanOrEqual(15);
      expect(concept.badges.length, `Insufficient badges for ${conceptId}`).toBeGreaterThanOrEqual(2);
      expect(concept.quote.length, `Short quote for ${conceptId}`).toBeGreaterThanOrEqual(20);
      expect(['Beginner', 'Intermediate', 'Advanced', 'Expert']).toContain(concept.difficulty);

      // Section 1: Understand (Substantial depth and no placeholder text)
      expect(concept.whatIsIt.length, `whatIsIt too short for ${conceptId}`).toBeGreaterThanOrEqual(40);
      expect(concept.whatIsIt).not.toContain(fallbackSignature);
      expect(concept.whatIsIt).not.toContain('${found.');
      expect(concept.whatIsIt).not.toContain('${topic.');
      expect(concept.inSimpleWords.length, `inSimpleWords too short for ${conceptId}`).toBeGreaterThanOrEqual(20);
      expect(concept.inSimpleWords).not.toContain('${found.');
      expect(concept.whyDoYouNeedIt.length, `whyDoYouNeedIt too short for ${conceptId}`).toBeGreaterThanOrEqual(35);
      expect(concept.whyDoYouNeedIt).not.toContain('${found.');
      expect(concept.realWorldAnalogy.length, `realWorldAnalogy too short for ${conceptId}`).toBeGreaterThanOrEqual(25);
      expect(concept.realWorldAnalogy).not.toContain('organized filing cabinet milestone');

      // Section 2: Syntax & Token Anatomy
      expect(concept.syntaxCode, `Missing syntaxCode for ${conceptId}`).toBeTruthy();
      expect(concept.syntaxTokens.length, `Insufficient syntaxTokens for ${conceptId}`).toBeGreaterThanOrEqual(2);
      concept.syntaxTokens.forEach((tok) => {
        expect(tok.token, `Empty token in ${conceptId}`).toBeTruthy();
        expect(tok.role, `Empty role in ${conceptId}`).toBeTruthy();
        expect(tok.explanation.length, `Short token explanation in ${conceptId}`).toBeGreaterThanOrEqual(8);
      });

      // Section 3: Visual Action Stage (Before, Running, After 3-step state)
      expect(concept.actionStage, `Missing actionStage for ${conceptId}`).toBeDefined();
      ['before', 'running', 'after'].forEach((phase) => {
        const stage = concept.actionStage[phase as 'before' | 'running' | 'after'];
        expect(stage, `Missing ${phase} stage in ${conceptId}`).toBeDefined();
        expect(stage.label.length, `Short ${phase} label in ${conceptId}`).toBeGreaterThanOrEqual(4);
        expect(stage.description.length, `Short ${phase} description in ${conceptId}`).toBeGreaterThanOrEqual(15);
        expect(stage.commandPill, `Missing ${phase} commandPill in ${conceptId}`).toBeTruthy();
        expect(stage.whatChanged.length, `Empty whatChanged in ${phase} for ${conceptId}`).toBeGreaterThanOrEqual(1);
        expect(stage.whatDidNotChange.length, `Empty whatDidNotChange in ${phase} for ${conceptId}`).toBeGreaterThanOrEqual(1);
      });

      // Section 4: Variations & Modifiers
      expect(concept.variations.length, `Insufficient variations for ${conceptId}`).toBeGreaterThanOrEqual(2);
      concept.variations.forEach((v) => {
        expect(v.title, `Empty variation title in ${conceptId}`).toBeTruthy();
        const syntaxOrCode = v.syntax || v.snippet || v.flag;
        expect(syntaxOrCode, `Missing syntax/snippet/flag in variation for ${conceptId}`).toBeTruthy();
        const descOrExplanation = v.whatItDoes || v.desc || v.whenToUse;
        expect(descOrExplanation, `Missing description in variation for ${conceptId}`).toBeTruthy();
      });

      // Section 5: Real-World Scenarios
      expect(concept.scenarios.length, `Insufficient scenarios for ${conceptId}`).toBeGreaterThanOrEqual(1);
      concept.scenarios.forEach((s) => {
        expect(s.title, `Empty scenario title in ${conceptId}`).toBeTruthy();
        const hasQuiz = Array.isArray(s.options) && s.options.length >= 2;
        const hasGuide = Boolean(s.commandExample || s.whenToUse);
        expect(hasQuiz || hasGuide, `Scenario missing options or guide content in ${conceptId}`).toBe(true);
      });

      // Practice & Reference Support
      expect(concept.sandbox, `Missing sandbox for ${conceptId}`).toBeDefined();
      expect(concept.sandbox.initialFiles || concept.sandbox.initialCommands).toBeDefined();
      expect(concept.challenge, `Missing challenge for ${conceptId}`).toBeDefined();
      expect(concept.challenge.title).toBeTruthy();
      expect(concept.challenge.instructions || (concept.challenge as any).objective).toBeTruthy();
      expect(concept.reference, `Missing reference for ${conceptId}`).toBeDefined();
      expect(concept.reference.officialDocUrl || concept.reference.synopsis).toBeTruthy();

      // Resolver integration
      const resolved = getUniversalConcept(conceptId);
      expect(resolved.id).toBe(conceptId);
      expect(resolved.whatIsIt).toBe(concept.whatIsIt);
      expect(resolved.topicNumber).toBe(topicNumber);
    });
  });

  it('audits Variations & Scenarios tab sections across all 75 concepts', () => {
    const missingComparisons: string[] = [];
    const missingMistakes: string[] = [];
    const missingVariationsRich: string[] = [];
    const missingScenariosRich: string[] = [];

    allConceptIds.forEach(({ conceptId }) => {
      const concept = ALL_ACADEMY_CONCEPTS[conceptId];
      if (!concept.commandComparisons || concept.commandComparisons.length === 0) {
        missingComparisons.push(conceptId);
      }
      if (!concept.commonMistakes || concept.commonMistakes.length === 0) {
        missingMistakes.push(conceptId);
      }
      // Check variations richness
      const hasRichVariations = concept.variations && concept.variations.length >= 2 &&
        concept.variations.every(v => (v.syntax || v.snippet || v.flag) && (v.whatItDoes || v.desc) && (v.whenToUse || v.desc));
      if (!hasRichVariations) {
        missingVariationsRich.push(conceptId);
      }
      // Check scenarios richness
      const hasRichScenarios = concept.scenarios && concept.scenarios.length >= 1 &&
        concept.scenarios.every(s => (s.options && s.options.length >= 2) || (s.whenToUse && s.commandExample));
      if (!hasRichScenarios) {
        missingScenariosRich.push(conceptId);
      }
    });

    console.log('Missing commandComparisons count:', missingComparisons.length, missingComparisons);
    console.log('Missing commonMistakes count:', missingMistakes.length, missingMistakes);
    console.log('Missing rich variations count:', missingVariationsRich.length, missingVariationsRich);
    console.log('Missing rich scenarios count:', missingScenariosRich.length, missingScenariosRich);

    expect(missingComparisons).toEqual([]);
    expect(missingMistakes).toEqual([]);
    expect(missingVariationsRich).toEqual([]);
    expect(missingScenariosRich).toEqual([]);
  });
});
