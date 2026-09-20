import { describe, it, expect } from 'vitest';
import { KUBE_CHAPTERS, TOTAL_CHAPTERS, TOTAL_CONCEPTS, getAllConcepts } from '../data/topics';

describe('PodForge Master Curriculum Completeness & Quality Audit', () => {
  it('contains exactly 16 comprehensive chapters spanning beginner to expert', () => {
    expect(TOTAL_CHAPTERS).toBe(16);
    expect(KUBE_CHAPTERS.length).toBe(16);

    KUBE_CHAPTERS.forEach((ch, idx) => {
      expect(ch.number).toBe(idx + 1);
      expect(ch.id).toBeTruthy();
      expect(ch.title).toBeTruthy();
      expect(ch.category).toBeTruthy();
      expect(ch.concepts.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('covers over 50 comprehensive concepts across all 16 chapters', () => {
    expect(TOTAL_CONCEPTS).toBeGreaterThanOrEqual(50);
    const allConcepts = getAllConcepts();
    expect(allConcepts.length).toBe(TOTAL_CONCEPTS);
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

  it('prints a complete curriculum coverage report', () => {
    console.log('\n================ PODFORGE MASTER CURRICULUM AUDIT REPORT ================');
    console.log(`Total Chapters: ${TOTAL_CHAPTERS} | Total Concepts: ${TOTAL_CONCEPTS}\n`);

    KUBE_CHAPTERS.forEach((ch) => {
      console.log(`✓ Chapter ${String(ch.number).padStart(2, '0')}: ${ch.title.padEnd(48, ' ')} | ${ch.concepts.length} concepts [${ch.category}]`);
      ch.concepts.forEach((c) => {
        console.log(`    ↳ Concept ${c.number.padEnd(5, ' ')}: ${c.title.padEnd(45, ' ')} [${c.difficulty}] (${c.commandPill})`);
      });
    });

    console.log('========================================================================\n');
  });
});
