import { describe, it, expect } from 'vitest';
import { BENTO_CATEGORIES } from '../data/journeyModel';
import { getTopicLesson } from '../data/topicLessons';
import { CHAPTER_METAS, CURATED_CONCEPTS } from '../data/chapterCurations';
import { CHAPTER_SEEDERS, getSeedRepoForCategory } from '../data/chapterSeeders';
import { GitEngine } from '../git-engine/engine';

describe('Comprehensive Chapter Curation & Population Test Suite', () => {
  it('should have detailed metadata for all 12 Bento chapters', () => {
    expect(BENTO_CATEGORIES.length).toBe(12);

    BENTO_CATEGORIES.forEach((cat) => {
      const meta = CHAPTER_METAS[cat.id];
      expect(meta).toBeDefined();
      expect(meta.themeTitle).toBeTruthy();
      expect(meta.kidMetaphor).toBeTruthy();
      expect(meta.kidStory).toBeTruthy();
      expect(meta.missionGoal).toBeTruthy();
      expect(meta.emoji).toBeTruthy();
    });
  });

  it('should have a tailored repository seeder for all 12 chapters', () => {
    BENTO_CATEGORIES.forEach((cat) => {
      const seeder = getSeedRepoForCategory(cat.id);
      expect(seeder).toBeDefined();
      const repo = seeder();
      expect(repo.initialized).toBe(true);
      expect(repo.workingDirectory).toBeDefined();

      // Ensure GitEngine can boot up and execute status on every chapter's repo
      const engine = new GitEngine();
      engine.setRepo(repo);
      const res = engine.execute('git status');
      expect(res.exitCode).toBe(0);
      expect(res.stdout.length).toBeGreaterThan(0);
    });
  });

  it('should verify specific chapter repo contents match expectations', () => {
    // Chapter 3 (Undo & Recover): Should have staged .env mistake and commits to revert
    const undoRepo = CHAPTER_SEEDERS['cat-undo-recover']();
    expect(undoRepo.index['.env']).toBeDefined();
    expect(Object.keys(undoRepo.commits).length).toBeGreaterThanOrEqual(3);

    // Chapter 4 (Branching): Should have multiple branches
    const branchRepo = CHAPTER_SEEDERS['cat-branching']();
    expect(Object.keys(branchRepo.branches).length).toBeGreaterThanOrEqual(3);
    expect(branchRepo.branches['feature/dragon-shield']).toBeDefined();

    // Chapter 5 (Merging): Should have feature branch ready to merge
    const mergeRepo = CHAPTER_SEEDERS['cat-merging']();
    expect(mergeRepo.branches['feature/dessert-menu']).toBeDefined();

    // Chapter 6 (Remote): Should have origin remote configured
    const remoteRepo = CHAPTER_SEEDERS['cat-remote-git']();
    expect(remoteRepo.remotes['origin']).toBeDefined();
    expect(remoteRepo.remotes['origin'].url).toContain('space-adventure');

    // Chapter 9 (Advanced): Should have stash and tags
    const advRepo = CHAPTER_SEEDERS['cat-advanced-git']();
    expect(advRepo.stash.length).toBeGreaterThan(0);
    expect(advRepo.tags['v1.0.0']).toBeDefined();

    // Chapter 10 (Engineering): Should have pre-commit hook and git aliases
    const engRepo = CHAPTER_SEEDERS['cat-git-engineering']();
    expect(engRepo.hooks['pre-commit']).toBeDefined();
    expect(engRepo.config['alias.st']).toBe('status');

    // Chapter 11 (Automation): Should have .github/workflows/ci.yml
    const actRepo = CHAPTER_SEEDERS['cat-github-automation']();
    expect(actRepo.workingDirectory['.github/workflows/ci.yml']).toBeDefined();
  });

  it('should generate curated, high-quality lessons across all 128 concepts', () => {
    let totalConceptsChecked = 0;

    BENTO_CATEGORIES.forEach((cat) => {
      cat.concepts.forEach((concept) => {
        totalConceptsChecked++;
        const pkg = getTopicLesson(concept.id);

        expect(pkg.conceptId).toBe(concept.id);
        expect(pkg.title).toBe(concept.title);
        expect(pkg.categoryTitle).toBe(cat.title);
        expect(pkg.steps.length).toBeGreaterThanOrEqual(3);

        if (concept.id === 'c-staging-area') {
          // Canonical 18-step vertical slice
          expect(pkg.steps.length).toBe(18);
          expect(pkg.steps[0].title).toBeTruthy();
          expect(pkg.steps.some((s) => s.prediction !== undefined)).toBe(true);
          return;
        }

        // Step 1 check
        const step1 = pkg.steps[0];
        expect(step1.title).toBeTruthy();
        expect(step1.seniorDeveloperDialogue).not.toContain('undefined');
        expect(step1.seniorDeveloperDialogue.length).toBeGreaterThan(20);
        expect(step1.prediction).toBeDefined();
        expect(step1.prediction?.options.length).toBe(3);
        const correctCount = step1.prediction?.options.filter((o) => o.isCorrect).length;
        expect(correctCount).toBe(1);

        // Step 2 check
        const step2 = pkg.steps[1];
        expect(step2.expectedCommand).toBeTruthy();
        expect(step2.actionPrompt).toBeTruthy();
        expect(step2.syntaxBreakdown).toBeDefined();
        expect(step2.commandHints?.length).toBe(3);

        // Step 3 check
        const step3 = pkg.steps[pkg.steps.length - 1];
        expect(step3.reflection).toBeDefined();
        expect(step3.reflection?.options.length).toBeGreaterThanOrEqual(2);
        const refCorrect = step3.reflection?.options.some((o) => o.isCorrect);
        expect(refCorrect).toBe(true);
      });
    });

    expect(totalConceptsChecked).toBe(128);
  });
});
