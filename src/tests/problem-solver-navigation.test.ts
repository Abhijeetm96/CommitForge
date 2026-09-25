import { describe, it, expect } from 'vitest';
import { UNIVERSAL_PROBLEM_DIAGNOSES } from '../platform/search/problemDatabase';
import { ALL_ACADEMY_CONCEPTS } from '../commitforge/data/unifiedAcademyData';
import { DOCKER_UNIVERSAL_CONCEPTS } from '../dockforge/data/unifiedDockerData';
import { KUBE_CHAPTERS } from '../podforge/data/topics';

describe('UniversalProblemSolver Related Lesson Integrity (Issue #1)', () => {
  it('every Git problem has a valid relatedLessonId in CommitForge', () => {
    const gitProblems = UNIVERSAL_PROBLEM_DIAGNOSES.filter((p) => p.technology === 'git');
    expect(gitProblems.length).toBeGreaterThan(0);

    for (const prob of gitProblems) {
      expect(prob.relatedLessonId).toBeTruthy();
      const exists = Boolean(ALL_ACADEMY_CONCEPTS[prob.relatedLessonId]);
      expect(exists, `Git concept ${prob.relatedLessonId} must exist in CommitForge`).toBe(true);
    }
  });

  it('every Docker problem has a valid relatedLessonId in DockForge', () => {
    const dockerProblems = UNIVERSAL_PROBLEM_DIAGNOSES.filter((p) => p.technology === 'docker');
    expect(dockerProblems.length).toBeGreaterThan(0);

    for (const prob of dockerProblems) {
      expect(prob.relatedLessonId).toBeTruthy();
      const exists = Boolean(DOCKER_UNIVERSAL_CONCEPTS[prob.relatedLessonId]);
      expect(exists, `Docker concept ${prob.relatedLessonId} must exist in DockForge`).toBe(true);
    }
  });

  it('every Kubernetes problem has a valid relatedLessonId in PodForge', () => {
    const k8sProblems = UNIVERSAL_PROBLEM_DIAGNOSES.filter((p) => p.technology === 'kubernetes');
    expect(k8sProblems.length).toBeGreaterThan(0);

    const allK8sConceptIds = new Set(
      KUBE_CHAPTERS.flatMap((ch) => ch.concepts.map((c) => c.id))
    );

    for (const prob of k8sProblems) {
      expect(prob.relatedLessonId).toBeTruthy();
      const exists = allK8sConceptIds.has(prob.relatedLessonId);
      expect(exists, `Kubernetes concept ${prob.relatedLessonId} must exist in PodForge`).toBe(true);
    }
  });
});
