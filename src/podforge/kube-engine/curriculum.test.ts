import { describe, it, expect } from 'vitest';
import { KUBE_CHAPTERS, TOTAL_CHAPTERS, TOTAL_CONCEPTS, getAllConcepts } from '../data/topics';

describe('PodForge Master Curriculum Completeness & Quality Audit', () => {
  it('contains exactly 15 curated chapters spanning beginner to expert', () => {
    expect(TOTAL_CHAPTERS).toBe(15);
    expect(KUBE_CHAPTERS.length).toBe(15);

    KUBE_CHAPTERS.forEach((ch, idx) => {
      expect(ch.number).toBe(idx + 1);
      expect(ch.id).toBeTruthy();
      expect(ch.title).toBeTruthy();
      expect(ch.category).toBeTruthy();
      expect(ch.concepts.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('covers exactly 71 curated concepts across all 15 chapters', () => {
    expect(TOTAL_CONCEPTS).toBe(71);
    const allConcepts = getAllConcepts();
    expect(allConcepts.length).toBe(71);
  });

  it('verifies 100% of concepts have complete, high-quality pedagogical data', () => {
    const allConcepts = getAllConcepts();
    const missingFields: string[] = [];

    allConcepts.forEach((c) => {
      if (!c.id) missingFields.push(`${c.number}: missing id`);
      if (!c.title) missingFields.push(`${c.number}: missing title`);
      if (!c.description || c.description.length < 20) missingFields.push(`${c.number}: description too short`);
      if (!c.explanation || c.explanation.length < 50) missingFields.push(`${c.number}: explanation too short`);
      if (!c.yamlSnippet || c.yamlSnippet.length < 10) missingFields.push(`${c.number}: missing or short yamlSnippet`);
      if (!c.kubectlCommands || c.kubectlCommands.length === 0) missingFields.push(`${c.number}: missing kubectlCommands`);
      if (!c.practiceChallenge || !c.practiceChallenge.goalCommand) missingFields.push(`${c.number}: missing practiceChallenge.goalCommand`);
      if (!c.practiceChallenge.hints || c.practiceChallenge.hints.length === 0) missingFields.push(`${c.number}: missing hints`);
    });

    expect(missingFields).toEqual([]);
  });

  it('verifies 100% of concepts (71/71) have rich Concept Overview & Subtopics data', () => {
    const allConcepts = getAllConcepts();
    const missingOverviewFields: string[] = [];

    allConcepts.forEach((c) => {
      if (!c.subtopics || c.subtopics.length < 2) {
        missingOverviewFields.push(`${c.number} (${c.id}): subtopics must have >= 2 items`);
      }
      if (!c.whatIsIt || c.whatIsIt.length < 20) {
        missingOverviewFields.push(`${c.number} (${c.id}): missing or short whatIsIt`);
      }
      if (!c.inSimpleWords || c.inSimpleWords.length < 20) {
        missingOverviewFields.push(`${c.number} (${c.id}): missing or short inSimpleWords`);
      }
      if (!c.realWorldAnalogy || !c.realWorldAnalogy.metaphor || !c.realWorldAnalogy.explanation) {
        missingOverviewFields.push(`${c.number} (${c.id}): missing realWorldAnalogy`);
      }
      if (!c.whenToUse || c.whenToUse.length < 2) {
        missingOverviewFields.push(`${c.number} (${c.id}): whenToUse must have >= 2 points`);
      }
      if (!c.whenNotToUse || c.whenNotToUse.length < 1) {
        missingOverviewFields.push(`${c.number} (${c.id}): whenNotToUse must have >= 1 points`);
      }
      if (!c.lifecycleSteps || c.lifecycleSteps.length < 3) {
        missingOverviewFields.push(`${c.number} (${c.id}): lifecycleSteps must have >= 3 steps`);
      }
      if (!c.keyMechanisms || c.keyMechanisms.length < 2) {
        missingOverviewFields.push(`${c.number} (${c.id}): keyMechanisms must have >= 2 mechanisms`);
      }
      if (!c.productionTips || c.productionTips.length < 2) {
        missingOverviewFields.push(`${c.number} (${c.id}): productionTips must have >= 2 tips`);
      }
    });

    expect(missingOverviewFields).toEqual([]);
    expect(allConcepts.length).toBe(71);
  });

  it('verifies 100% of concepts (71/71) have all advanced sections: Pitfalls, Quizzes, YAML Breakdown & Reference', () => {
    const allConcepts = getAllConcepts();
    const missingAdvancedFields: string[] = [];

    allConcepts.forEach((c) => {
      if (!c.commonPitfalls || c.commonPitfalls.length < 2) {
        missingAdvancedFields.push(`${c.number} (${c.id}): commonPitfalls must have >= 2 items`);
      } else {
        c.commonPitfalls.forEach((p, idx) => {
          if (!p.mistake || !p.whyItHappens || !p.fix) {
            missingAdvancedFields.push(`${c.number} (${c.id}) pitfall #${idx}: incomplete mistake/whyItHappens/fix`);
          }
        });
      }

      if (!c.quizQuestion || !c.quizQuestion.question) {
        missingAdvancedFields.push(`${c.number} (${c.id}): missing quizQuestion`);
      } else {
        if (!c.quizQuestion.options || c.quizQuestion.options.length < 3) {
          missingAdvancedFields.push(`${c.number} (${c.id}): quizQuestion must have >= 3 options`);
        }
        const hasCorrect = c.quizQuestion.options?.some((o) => o.isCorrect);
        if (!hasCorrect) {
          missingAdvancedFields.push(`${c.number} (${c.id}): quizQuestion has no correct option marked`);
        }
      }

      if (!c.yamlExplanation || c.yamlExplanation.length < 1) {
        missingAdvancedFields.push(`${c.number} (${c.id}): missing yamlExplanation`);
      }

      if (!c.referenceCheatSheet || c.referenceCheatSheet.length < 2) {
        missingAdvancedFields.push(`${c.number} (${c.id}): referenceCheatSheet must have >= 2 items`);
      }
    });

    expect(missingAdvancedFields).toEqual([]);
  });


  it('prints a complete curriculum coverage report', () => {
    console.log('\n================ PODFORGE MASTER CURRICULUM AUDIT REPORT ================');
    console.log(`Total Chapters: ${TOTAL_CHAPTERS} | Total Concepts: ${TOTAL_CONCEPTS}\n`);

    KUBE_CHAPTERS.forEach((ch) => {
      console.log(`✓ Chapter ${String(ch.number).padStart(2, '0')}: ${ch.title.padEnd(42, ' ')} | ${ch.concepts.length} concepts [${ch.category}]`);
      ch.concepts.forEach((c) => {
        console.log(`    ↳ Concept ${c.number.padEnd(5, ' ')}: ${c.title.padEnd(42, ' ')} [${c.difficulty}] (${c.commandPill})`);
      });
    });

    console.log('========================================================================\n');
  });
});
