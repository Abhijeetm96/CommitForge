import { describe, it, expect } from 'vitest';
import { DOCKER_14_TOPICS, DOCKER_UNIVERSAL_CONCEPTS } from '../dockforge/data/unifiedDockerData';
import { ensureFullConceptData } from '../dockforge/data/conceptDataEnricher';

describe('DockForge Master Docker Curriculum & Interactive Pedagogy Audit', () => {
  it('covers all 14 Docker topics spanning absolute beginner to enterprise SRE', () => {
    expect(DOCKER_14_TOPICS.length).toBe(14);

    DOCKER_14_TOPICS.forEach((topic, idx) => {
      expect(topic.id).toBeTruthy();
      expect(topic.title).toBeTruthy();
      expect(topic.number).toBe(String(idx + 1).padStart(2, '0'));
      expect(topic.concepts.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('guarantees all 42 Docker concepts have complete 5-stage interactive learning data', () => {
    const allConcepts = DOCKER_14_TOPICS.flatMap((t) => t.concepts);
    expect(allConcepts.length).toBe(42);

    const missingDataIssues: string[] = [];

    allConcepts.forEach((rawConcept) => {
      const fullConcept = DOCKER_UNIVERSAL_CONCEPTS[rawConcept.id];
      if (!fullConcept) {
        missingDataIssues.push(`${rawConcept.id}: concept not found in DOCKER_UNIVERSAL_CONCEPTS`);
        return;
      }
      const concept = ensureFullConceptData(fullConcept);

      // Stage 1: Mental Model & Without vs With
      if (!concept.withoutVsWith) {
        missingDataIssues.push(`${concept.id}: missing withoutVsWith`);
      } else {
        if (!concept.withoutVsWith.without.items || concept.withoutVsWith.without.items.length < 2) {
          missingDataIssues.push(`${concept.id}: withoutVsWith.without must have >= 2 items`);
        }
        if (!concept.withoutVsWith.with.items || concept.withoutVsWith.with.items.length < 2) {
          missingDataIssues.push(`${concept.id}: withoutVsWith.with must have >= 2 items`);
        }
      }

      if (!concept.realWorldAnalogy || concept.realWorldAnalogy.length < 10) {
        missingDataIssues.push(`${concept.id}: missing or short realWorldAnalogy`);
      }

      // Stage 2: Architectural Block Diagram & Terms
      if (!concept.blockDiagram) {
        missingDataIssues.push(`${concept.id}: missing blockDiagram`);
      } else {
        if (!concept.blockDiagram.nodes || concept.blockDiagram.nodes.length < 3) {
          missingDataIssues.push(`${concept.id}: blockDiagram must have >= 3 nodes`);
        }
        concept.blockDiagram.nodes.forEach((node) => {
          if (!node.id || !node.label || !node.simpleDef || !node.techDef) {
            missingDataIssues.push(`${concept.id} node ${node.id}: incomplete node definition`);
          }
        });
      }

      if (!concept.terms || concept.terms.length < 2) {
        missingDataIssues.push(`${concept.id}: terms must have >= 2 items`);
      }

      // Stage 3: Command Syntax & Variations
      if (!concept.syntaxTokens || concept.syntaxTokens.length < 2) {
        missingDataIssues.push(`${concept.id}: syntaxTokens must have >= 2 tokens`);
      }
      if (!concept.variations || concept.variations.length < 2) {
        missingDataIssues.push(`${concept.id}: variations must have >= 2 variations`);
      }

      // Stage 4: Internal Execution Flow
      if (!concept.internalFlow || concept.internalFlow.length < 4) {
        missingDataIssues.push(`${concept.id}: internalFlow must have >= 4 steps`);
      } else {
        concept.internalFlow.forEach((step, sIdx) => {
          if (step.step !== sIdx + 1) {
            missingDataIssues.push(`${concept.id} internalFlow step #${sIdx}: sequence mismatch`);
          }
          if (!step.title || !step.desc || !step.why || !step.techDetail) {
            missingDataIssues.push(`${concept.id} internalFlow step #${step.step}: missing detail fields`);
          }
        });
      }

      // Stage 5: Common Mistakes & Challenge
      if (!concept.commonMistakes || concept.commonMistakes.length < 2) {
        missingDataIssues.push(`${concept.id}: commonMistakes must have >= 2 items`);
      }
      if (!concept.recapChecklist || concept.recapChecklist.length < 2) {
        missingDataIssues.push(`${concept.id}: recapChecklist must have >= 2 items`);
      }
      if (!concept.challenge || !concept.challenge.question || !concept.challenge.options) {
        missingDataIssues.push(`${concept.id}: missing challenge or options`);
      } else {
        const hasCorrect = concept.challenge.options.some((o) => o.isCorrect);
        if (!hasCorrect) {
          missingDataIssues.push(`${concept.id}: challenge has no correct option marked`);
        }
      }
    });

    expect(missingDataIssues).toEqual([]);
  });

  it('prints complete Docker beginner-to-expert curriculum coverage report', () => {
    console.log('\n================ DOCKER MASTER CURRICULUM AUDIT REPORT ================');
    const allConcepts = DOCKER_14_TOPICS.flatMap((t) => t.concepts);
    console.log(`Total Topics: ${DOCKER_14_TOPICS.length} | Total Concepts: ${allConcepts.length}\n`);

    DOCKER_14_TOPICS.forEach((topic) => {
      console.log(`✓ Topic ${topic.number}: ${topic.title.padEnd(38, ' ')} | ${topic.concepts.length} concepts`);
      topic.concepts.forEach((c) => {
        const full = ensureFullConceptData(DOCKER_UNIVERSAL_CONCEPTS[c.id] || c as any);
        console.log(`    ↳ [${full.difficulty.padEnd(12, ' ')}] ${c.title.padEnd(36, ' ')} (${c.command})`);
        console.log(`        - Internal Flow: ${full.internalFlow?.length} steps | Nodes: ${full.blockDiagram?.nodes.length} | Mistakes: ${full.commonMistakes?.length}`);
      });
    });

    console.log('=======================================================================\n');
  });
});
