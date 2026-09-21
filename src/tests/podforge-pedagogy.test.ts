import { describe, it, expect } from 'vitest';
import { KUBE_CHAPTERS, getAllConcepts, getConceptById, TOTAL_CONCEPTS, TOTAL_CHAPTERS } from '../podforge/data/topics';
import { getDockerBridgeForConcept } from '../podforge/data/topics/dockerBridgeData';

describe('PodForge: Beginner-to-Expert Topic Architecture & Interactivity', () => {
  it('loads all 15 chapters and 71 concepts', () => {
    expect(TOTAL_CHAPTERS).toBe(15);
    expect(TOTAL_CONCEPTS).toBe(71);
    expect(KUBE_CHAPTERS).toHaveLength(15);

    const all = getAllConcepts();
    expect(all).toHaveLength(71);
  });

  it('validates 4-tier progressive mastery distribution', () => {
    const all = getAllConcepts();
    const beginner = all.filter((c) => c.difficulty === 'Beginner');
    const intermediate = all.filter((c) => c.difficulty === 'Intermediate');
    const advanced = all.filter((c) => c.difficulty === 'Advanced');
    const expert = all.filter((c) => c.difficulty === 'Expert');

    expect(beginner.length).toBeGreaterThan(0);
    expect(intermediate.length).toBeGreaterThan(0);
    expect(advanced.length).toBeGreaterThan(0);
    expect(expert.length).toBeGreaterThan(0);
    expect(beginner.length + intermediate.length + advanced.length + expert.length).toBe(71);
  });

  it('verifies every concept has an enriched Docker-to-Kubernetes conceptual bridge', () => {
    const all = getAllConcepts();

    for (const concept of all) {
      const bridge = getDockerBridgeForConcept(concept);
      expect(bridge).toBeDefined();
      expect(bridge.dockerEquivalent).toBeTruthy();
      expect(bridge.k8sEquivalent).toBeTruthy();
      expect(bridge.keyDifference).toBeTruthy();
      expect(bridge.whyK8sApproach).toBeTruthy();
    }
  });

  it('verifies Chapter 1 & 2 foundational container concepts have rich Docker comparisons', () => {
    const k8sOverview = getConceptById('c-k8s-overview');
    expect(k8sOverview).toBeDefined();
    expect(k8sOverview?.dockerBridge?.dockerEquivalent).toContain('docker run');

    const containersConcept = getConceptById('c-containers-what-are');
    expect(containersConcept).toBeDefined();
    expect(containersConcept?.dockerBridge?.dockerEquivalent).toBeTruthy();

    const containersVsVms = getConceptById('c-containers-vs-vms');
    expect(containersVsVms).toBeDefined();
    expect(containersVsVms?.dockerBridge?.whyK8sApproach).toBeTruthy();
  });

  it('verifies concepts possess interactive lifecycle steps and declarative YAML specs', () => {
    const all = getAllConcepts();

    for (const concept of all) {
      expect(concept.yamlSnippet).toBeTruthy();
      expect(concept.lifecycleSteps).toBeDefined();
      expect(concept.lifecycleSteps?.length).toBeGreaterThan(0);
      expect(concept.practiceChallenge).toBeDefined();
      expect(concept.practiceChallenge.goalCommand).toBeTruthy();
    }
  });

  it('tests curriculum search filtering mechanism', () => {
    const all = getAllConcepts();
    const q = 'docker';
    const matches = all.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.dockerBridge?.dockerEquivalent.toLowerCase().includes(q) ?? false)
    );

    expect(matches.length).toBeGreaterThan(0);
  });
});
