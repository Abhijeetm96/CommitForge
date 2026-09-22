import { describe, it, expect } from 'vitest';
import { KUBE_CHAPTERS, getAllConcepts, TOTAL_CONCEPTS } from '../podforge/data/topics';
import { getDiagramDataForConcept } from '../podforge/data/diagrams/topicFlows';

describe('PodForge Master Architectural Flow & Block Diagram Integrity Audit', () => {
  it('covers all 71 concepts across all 15 chapters with valid diagram data', () => {
    const allConcepts = getAllConcepts();
    expect(allConcepts.length).toBe(TOTAL_CONCEPTS);
    expect(allConcepts.length).toBe(71);

    allConcepts.forEach((concept) => {
      const diagram = getDiagramDataForConcept(concept);

      expect(diagram).toBeDefined();
      expect(diagram.chapterNumber).toBeGreaterThanOrEqual(1);
      expect(diagram.chapterNumber).toBeLessThanOrEqual(15);
      expect(diagram.conceptNumber).toBe(concept.number);
      expect(diagram.conceptTitle).toBe(concept.title);
      expect(diagram.architectureType).toBeTruthy();
      expect(diagram.architecturalSummary.length).toBeGreaterThan(20);

      // Verify minimum block count
      expect(diagram.blocks.length).toBeGreaterThanOrEqual(3);

      // Verify minimum connection count
      expect(diagram.connections.length).toBeGreaterThanOrEqual(2);

      // Verify minimum step count
      expect(diagram.steps.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('validates block structure, roles, and diagnostic commands for every concept', () => {
    const allConcepts = getAllConcepts();
    const invalidBlocks: string[] = [];

    allConcepts.forEach((concept) => {
      const diagram = getDiagramDataForConcept(concept);

      diagram.blocks.forEach((block) => {
        if (!block.id) invalidBlocks.push(`${concept.number}: block missing id`);
        if (!block.label) invalidBlocks.push(`${concept.number}: block missing label`);
        if (!block.category) invalidBlocks.push(`${concept.number}: block missing category`);
        if (!block.details || !block.details.role) {
          invalidBlocks.push(`${concept.number} (${block.id}): missing details.role`);
        }
        if (!block.details.cliDiagnostic) {
          invalidBlocks.push(`${concept.number} (${block.id}): missing details.cliDiagnostic`);
        }
        if (!block.details.keyInsight) {
          invalidBlocks.push(`${concept.number} (${block.id}): missing details.keyInsight`);
        }
      });
    });

    expect(invalidBlocks).toEqual([]);
  });

  it('verifies that all connections link to existing block IDs', () => {
    const allConcepts = getAllConcepts();
    const brokenConnections: string[] = [];

    allConcepts.forEach((concept) => {
      const diagram = getDiagramDataForConcept(concept);
      const blockIds = new Set(diagram.blocks.map((b) => b.id));

      diagram.connections.forEach((conn, idx) => {
        if (!blockIds.has(conn.from)) {
          brokenConnections.push(`${concept.number} connection #${idx}: source block "${conn.from}" not found`);
        }
        if (!blockIds.has(conn.to)) {
          brokenConnections.push(`${concept.number} connection #${idx}: target block "${conn.to}" not found`);
        }
        if (!conn.label) {
          brokenConnections.push(`${concept.number} connection #${idx}: missing label`);
        }
        if (typeof conn.stepNumber !== 'number' || conn.stepNumber < 1) {
          brokenConnections.push(`${concept.number} connection #${idx}: invalid stepNumber`);
        }
      });
    });

    expect(brokenConnections).toEqual([]);
  });

  it('verifies step progression, active block references, and dual explanations', () => {
    const allConcepts = getAllConcepts();
    const invalidSteps: string[] = [];

    allConcepts.forEach((concept) => {
      const diagram = getDiagramDataForConcept(concept);
      const blockIds = new Set(diagram.blocks.map((b) => b.id));

      diagram.steps.forEach((step, sIdx) => {
        if (step.step !== sIdx + 1) {
          invalidSteps.push(`${concept.number} step #${sIdx}: step number mismatch (${step.step} vs ${sIdx + 1})`);
        }
        if (!step.title) {
          invalidSteps.push(`${concept.number} step #${sIdx}: missing title`);
        }
        if (!step.detailExplanation || !step.detailExplanation.simpleWords) {
          invalidSteps.push(`${concept.number} step #${sIdx}: missing simpleWords explanation`);
        }
        if (!step.detailExplanation.technicalMechanics) {
          invalidSteps.push(`${concept.number} step #${sIdx}: missing technicalMechanics explanation`);
        }
        if (!step.activeBlockIds || step.activeBlockIds.length === 0) {
          invalidSteps.push(`${concept.number} step #${sIdx}: missing activeBlockIds`);
        } else {
          step.activeBlockIds.forEach((bId) => {
            if (!blockIds.has(bId)) {
              invalidSteps.push(`${concept.number} step #${sIdx}: activeBlockId "${bId}" does not exist in blocks`);
            }
          });
        }
      });
    });

    expect(invalidSteps).toEqual([]);
  });

  it('verifies exact chapter alignment: Chapter 1 is Cluster Architecture, Chapter 4 is Pod Lifecycle', () => {
    const ch1Sample = KUBE_CHAPTERS[0].concepts[0]; // 1.1 Overview of Kubernetes
    const ch4Sample = KUBE_CHAPTERS[3].concepts[0]; // 4.1 Pods

    const ch1Diagram = getDiagramDataForConcept(ch1Sample);
    const ch4Diagram = getDiagramDataForConcept(ch4Sample);

    expect(ch1Diagram.architectureType).toBe('Kubernetes Cluster Architecture & Declarative Request Lifecycle');
    expect(ch1Diagram.architectureType).not.toContain('Pod Lifecycle');

    expect(ch4Diagram.architectureType).toBe('Pod Lifecycle & Low-Level Runtime Plumbing');
    expect(ch4Diagram.blocks.some((b) => b.id === 'c4-pause')).toBe(true);
  });

  it('verifies that visualizer & simulator are provided strictly where required', async () => {
    const { conceptRequiresVisualizer, getVisualizerCapabilities } = await import(
      '../podforge/data/topics/visualizerScope'
    );
    const allConcepts = getAllConcepts();

    // Theoretical/Setup concepts must NOT require visualizers/simulators
    const excludedSamples = allConcepts.filter((c) =>
      ['c-k8s-overview', 'c-containers-what-are', 'c-choosing-k8s-environment', 'c-cpu-and-memory'].includes(c.id)
    );
    expect(excludedSamples.length).toBe(4);
    excludedSamples.forEach((concept) => {
      expect(conceptRequiresVisualizer(concept)).toBe(false);
      const caps = getVisualizerCapabilities(concept);
      expect(caps.requiresVisualizer).toBe(false);
      expect(caps.supportsChaosSimulator).toBe(false);
    });

    // Workload and active runtime concepts MUST require visualizers
    const includedSamples = allConcepts.filter((c) =>
      ['c-pods-running-apps', 'c-k8s-services-clusterip', 'c-horizontal-pod-autoscaler'].includes(
        c.id
      )
    );
    expect(includedSamples.length).toBe(3);
    includedSamples.forEach((concept) => {
      expect(conceptRequiresVisualizer(concept)).toBe(true);
      const caps = getVisualizerCapabilities(concept);
      expect(caps.requiresVisualizer).toBe(true);
    });
  });

  it('prints an architectural diagram coverage summary report', () => {
    console.log('\n================ PODFORGE ARCHITECTURAL DIAGRAM AUDIT REPORT ================');
    const allConcepts = getAllConcepts();
    console.log(`Audited ${allConcepts.length} Concepts across ${KUBE_CHAPTERS.length} Chapters:\n`);

    KUBE_CHAPTERS.forEach((ch) => {
      const sample = ch.concepts[0];
      const diagram = getDiagramDataForConcept(sample);
      console.log(`✓ Chapter ${String(ch.number).padStart(2, '0')}: ${ch.title.padEnd(42, ' ')}`);
      console.log(`    ↳ Architecture: [${diagram.architectureType}]`);
      console.log(`    ↳ Topology: ${diagram.blocks.length} Blocks, ${diagram.connections.length} Protocol Paths, ${diagram.steps.length} Lifecycle Stages`);
    });

    console.log('============================================================================\n');
  });
});

