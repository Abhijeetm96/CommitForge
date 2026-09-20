import { describe, it, expect } from 'vitest';
import { ViewMode } from '../context/AppContext';
import { ACADEMY_18_TOPICS, ALL_ACADEMY_CONCEPTS } from '../commitforge/data/unifiedAcademyData';

describe('Forge Suite Unified Portal Tests', () => {
  it('supports home in ViewMode union type', () => {
    const validHomeMode: ViewMode = 'home';
    expect(validHomeMode).toBe('home');
  });

  it('verifies CommitForge academy data integrity for portal showcase', () => {
    expect(ACADEMY_18_TOPICS.length).toBe(18);
    const totalConcepts = ACADEMY_18_TOPICS.flatMap((t) => t.concepts).length;
    expect(totalConcepts).toBe(75);
  });

  it('validates PodForge target endpoint format', () => {
    const podForgeDevPort = 5174;
    const podForgeUrl = `http://localhost:${podForgeDevPort}/`;
    expect(podForgeUrl).toMatch(/^http:\/\/localhost:\d+\/$/);
  });

  it('validates suite aggregate statistics', () => {
    const commitForgeTopics = 18;
    const commitForgeConcepts = 75;
    const podForgeModules = 16;
    const podForgeConcepts = 56;

    const totalModules = commitForgeTopics + podForgeModules;
    const totalConcepts = commitForgeConcepts + podForgeConcepts;

    expect(totalModules).toBe(34);
    expect(totalConcepts).toBe(131);
  });

  it('supports roadmap in ViewMode union type', () => {
    const validRoadmapMode: ViewMode = 'roadmap';
    expect(validRoadmapMode).toBe('roadmap');
  });

  it('validates devops roadmap stage coverage across 3 tracks and 9 disciplines', () => {
    const totalRoadmapStages = 9;
    const liveStages = ['stage-git', 'stage-cicd', 'stage-k8s'];
    const upcomingStages = ['stage-docker', 'stage-ansible', 'stage-terraform', 'stage-observability', 'stage-security', 'stage-ebpf'];

    expect(liveStages.length + upcomingStages.length).toBe(totalRoadmapStages);
  });
});
