import { describe, it, expect } from 'vitest';
import { BENTO_CATEGORIES } from '../data/journeyModel';
import { getTopicLesson } from '../data/topicLessons';
import { GitEngine } from '../git-engine/engine';

describe('Topic Lessons Coverage & Quality Suite', () => {
  const allConcepts = BENTO_CATEGORIES.flatMap((cat) => cat.concepts);

  it('should verify all 128 concepts exist and produce a valid lesson package', () => {
    expect(allConcepts.length).toBe(128);

    allConcepts.forEach((concept) => {
      const pkg = getTopicLesson(concept.id);
      expect(pkg).toBeDefined();
      expect(pkg.conceptId).toBe(concept.id);
      expect(pkg.title).toBe(concept.title);
      expect(pkg.categoryTitle).toBeTruthy();
      expect(pkg.categoryAccent).toBeTruthy();
      expect(pkg.subtopics.length).toBeGreaterThan(0);
      expect(pkg.steps.length).toBeGreaterThanOrEqual(3);

      // Verify each step has required didactic components
      pkg.steps.forEach((step, idx) => {
        expect(step.title).toBeTruthy();
        expect(step.seniorDeveloperDialogue).toBeTruthy();
        expect(step.stepIndex).toBe(idx + 1);
        expect(step.totalSteps).toBe(pkg.steps.length);
        expect(step.milestone).toBeTruthy();
        expect(step.milestoneLabel).toBeTruthy();

        // If prediction exists, verify options
        if (step.prediction) {
          expect(step.prediction.question).toBeTruthy();
          expect(step.prediction.options.length).toBeGreaterThan(1);
          const hasCorrect = step.prediction.options.some((o) => o.isCorrect);
          expect(hasCorrect).toBe(true);
        }

        // If reflection exists, verify options
        if (step.reflection) {
          expect(step.reflection.question).toBeTruthy();
          expect(step.reflection.options.length).toBeGreaterThan(1);
          const hasCorrect = step.reflection.options.some((o) => o.isCorrect);
          expect(hasCorrect).toBe(true);
        }
      });

      // Verify seedRepo returns a valid repo for GitEngine
      const repo = pkg.seedRepo();
      expect(repo).toBeDefined();
      const engine = new GitEngine();
      engine.setRepo(repo);
      expect(engine.getRepo()).toBeDefined();
    });
  });

  it('should deliver the 18-step canonical vertical slice for c-staging-area', () => {
    const stagingLesson = getTopicLesson('c-staging-area');
    expect(stagingLesson.conceptId).toBe('c-staging-area');
    expect(stagingLesson.steps.length).toBe(18);
    expect(stagingLesson.steps[0].milestone).toBe('Problem');
    expect(stagingLesson.steps[stagingLesson.steps.length - 1].milestone).toBe('Prove');
  });

  it('should deliver canonical handcrafted lessons for foundations topics', () => {
    const vcsLesson = getTopicLesson('c-what-is-vcs');
    expect(vcsLesson.conceptId).toBe('c-what-is-vcs');
    expect(vcsLesson.steps.length).toBe(3);
    expect(vcsLesson.subtopics).toContain('Centralized vs Distributed Version Control');

    const initLesson = getTopicLesson('c-repo-init');
    expect(initLesson.conceptId).toBe('c-repo-init');
    expect(initLesson.steps.length).toBe(3);
    expect(initLesson.steps[1].expectedCommand).toBe('git init');
  });

  it('should provide a graceful fallback for unknown concept IDs', () => {
    const unknownLesson = getTopicLesson('c-unknown-concept-xyz');
    expect(unknownLesson).toBeDefined();
    expect(unknownLesson.title).toBe('What is Version Control?');
    expect(unknownLesson.steps.length).toBeGreaterThanOrEqual(3);
  });
});
