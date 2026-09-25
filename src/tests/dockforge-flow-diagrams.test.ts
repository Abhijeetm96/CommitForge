import { describe, it, expect } from 'vitest';
import { DOCKER_14_TOPICS } from '../dockforge/data/unifiedDockerData';
import { getDockerDiagramData } from '../dockforge/data/diagrams/dockerTopicFlows';
import { detectDockerArchetype } from '../dockforge/components/diagrams/DockerFlowDiagram';

describe('DockForge Master Architectural Flow & Block Diagram Integrity Audit', () => {
  it('covers all 14 Docker topics with valid architectural diagram data', () => {
    expect(DOCKER_14_TOPICS.length).toBe(14);

    DOCKER_14_TOPICS.forEach((topic) => {
      topic.concepts.forEach((concept) => {
        const diagram = getDockerDiagramData({
          ...concept,
          topicId: topic.id,
          topicNumber: topic.number,
        });

        expect(diagram).toBeDefined();
        expect(diagram.topicTitle).toBeTruthy();
        expect(diagram.architectureType).toBeTruthy();
        expect(diagram.architecturalSummary.length).toBeGreaterThan(15);

        // Verify minimum blocks
        expect(diagram.blocks.length).toBeGreaterThanOrEqual(3);

        // Verify minimum connections
        expect(diagram.connections.length).toBeGreaterThanOrEqual(2);

        // Verify minimum lifecycle steps
        expect(diagram.steps.length).toBeGreaterThanOrEqual(3);
      });
    });
  });

  it('validates block roles, diagnostics, and category tagging for Docker components', () => {
    DOCKER_14_TOPICS.forEach((topic) => {
      const sampleConcept = topic.concepts[0];
      const diagram = getDockerDiagramData({
        ...sampleConcept,
        topicId: topic.id,
        topicNumber: topic.number,
      });

      diagram.blocks.forEach((block) => {
        expect(block.id).toBeTruthy();
        expect(block.label).toBeTruthy();
        expect(block.category).toBeTruthy();
        expect(block.details.role).toBeTruthy();
        expect(block.details.cliDiagnostic).toBeTruthy();
        expect(block.details.keyInsight).toBeTruthy();
      });
    });
  });

  it('detects diverse architectural archetypes across Docker topics so diagrams do not all look the same', () => {
    const archetypesFound = new Set<string>();
    const archetypeDistribution: Record<string, number> = {};

    DOCKER_14_TOPICS.forEach((topic) => {
      const sample = topic.concepts[0];
      const diagram = getDockerDiagramData({
        ...sample,
        topicId: topic.id,
        topicNumber: topic.number,
      });
      const arch = detectDockerArchetype(diagram);
      archetypesFound.add(arch);
      archetypeDistribution[arch] = (archetypeDistribution[arch] || 0) + 1;
    });

    // Verify all 5 archetypes are actively utilized across Docker topics
    expect(archetypesFound.has('pipeline')).toBe(true);
    expect(archetypesFound.has('loop')).toBe(true);
    expect(archetypesFound.has('decision')).toBe(true);
    expect(archetypesFound.has('routing')).toBe(true);
    expect(archetypesFound.has('stack')).toBe(true);
    expect(archetypesFound.size).toBe(5);

    // Verify domain mappings
    const t01 = getDockerDiagramData({ ...DOCKER_14_TOPICS[0].concepts[0], topicNumber: '01' });
    const t02 = getDockerDiagramData({ ...DOCKER_14_TOPICS[1].concepts[0], topicNumber: '02' });
    const t06 = getDockerDiagramData({ ...DOCKER_14_TOPICS[5].concepts[0], topicNumber: '06' });
    const t12 = getDockerDiagramData({ ...DOCKER_14_TOPICS[11].concepts[0], topicNumber: '12' });
    const t13 = getDockerDiagramData({ ...DOCKER_14_TOPICS[12].concepts[0], topicNumber: '13' });

    expect(detectDockerArchetype(t01)).toBe('pipeline');
    expect(detectDockerArchetype(t02)).toBe('stack');
    expect(detectDockerArchetype(t06)).toBe('routing');
    expect(detectDockerArchetype(t12)).toBe('decision');
    expect(detectDockerArchetype(t13)).toBe('loop');
  });

  it('prints a Docker architectural diagram coverage summary report', () => {
    console.log('\n================ DOCKFORGE ARCHITECTURAL DIAGRAM AUDIT REPORT ================');
    DOCKER_14_TOPICS.forEach((topic) => {
      const sample = topic.concepts[0];
      const diagram = getDockerDiagramData({
        ...sample,
        topicId: topic.id,
        topicNumber: topic.number,
      });
      const arch = detectDockerArchetype(diagram);
      console.log(`✓ Topic ${topic.number}: ${topic.title.padEnd(42, ' ')} [Archetype: ${arch.toUpperCase()}]`);
      console.log(`    ↳ Architecture: [${diagram.architectureType}]`);
      console.log(`    ↳ Topology: ${diagram.blocks.length} Blocks, ${diagram.connections.length} Protocol Paths, ${diagram.steps.length} Lifecycle Stages`);
    });
    console.log('==============================================================================\n');
  });
});
