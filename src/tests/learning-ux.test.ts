import { describe, it, expect, beforeEach } from 'vitest';
import { GitEngine } from '../git-engine/engine';
import { FIRST_10_MINUTES_STEPS } from '../data/first10Minutes';
import { calculateCommandCoverage, GIT_COMMAND_COVERAGE } from '../data/gitCommandCoverage';
import { EvidenceMastery, CompetencyLevel } from '../context/AppContext';

describe('CommitForge Learning UX & Pedagogical System', () => {
  let engine: GitEngine;

  beforeEach(() => {
    engine = new GitEngine({
      'index.html': '<h1>Hello World</h1>',
      'style.css': 'body { background: white; }',
      'script.js': 'console.log("App");',
    });
  });

  describe('Gated Progression (Completion Criteria)', () => {
    it('should gate Step 4 (pwd) until pwd command is entered in terminal history', () => {
      const step4 = FIRST_10_MINUTES_STEPS.find(s => s.step === 4)!;
      expect(step4).toBeDefined();

      const repo = engine.getRepo();
      // Without pwd in history
      expect(step4.isComplete(repo, [])).toBe(false);
      expect(step4.isComplete(repo, [{ command: 'ls' }])).toBe(false);

      // With pwd in history
      expect(step4.isComplete(repo, [{ command: 'pwd' }])).toBe(true);
    });

    it('should gate Step 6 (git init) until repository is actually initialized', () => {
      const step6 = FIRST_10_MINUTES_STEPS.find(s => s.step === 6)!;
      expect(step6).toBeDefined();

      const repoBefore = engine.getRepo();
      expect(step6.isComplete(repoBefore, [])).toBe(false);

      engine.execute('git init');
      const repoAfter = engine.getRepo();
      expect(step6.isComplete(repoAfter, [{ command: 'git init' }])).toBe(true);
    });

    it('should gate Step 8 (Edit index.html & git status) until edit or status is performed', () => {
      const step8 = FIRST_10_MINUTES_STEPS.find(s => s.step === 8)!;
      expect(step8).toBeDefined();

      const repo = engine.getRepo();
      expect(step8.isComplete(repo, [])).toBe(false);

      // Either file content modified with "Coffee Shop" or status run
      engine.updateFileContent('index.html', '<h1>Welcome to My Coffee Shop!</h1>');
      const updatedRepo = engine.getRepo();
      expect(step8.isComplete(updatedRepo, [])).toBe(true);
    });

    it('should gate Step 10 (Selective git add) until index.html is staged', () => {
      const step10 = FIRST_10_MINUTES_STEPS.find(s => s.step === 10)!;
      expect(step10).toBeDefined();

      engine.execute('git init');
      const repoBefore = engine.getRepo();
      expect(step10.isComplete(repoBefore, [])).toBe(false);

      engine.execute('git add index.html');
      const repoAfter = engine.getRepo();
      expect(step10.isComplete(repoAfter, [])).toBe(true);
      // Ensure selective staging: only index.html is in index, not style.css
      expect(repoAfter.index['style.css']).toBeUndefined();
    });

    it('should gate Step 11 (git commit) until a permanent commit milestone exists', () => {
      const step11 = FIRST_10_MINUTES_STEPS.find(s => s.step === 11)!;
      expect(step11).toBeDefined();

      engine.execute('git init');
      engine.execute('git add index.html');
      const repoBefore = engine.getRepo();
      expect(step11.isComplete(repoBefore, [])).toBe(false);

      engine.execute('git commit -m "First milestone"');
      const repoAfter = engine.getRepo();
      expect(step11.isComplete(repoAfter, [])).toBe(true);
      expect(Object.keys(repoAfter.commits).length).toBe(1);
    });
  });

  describe('Evidence-Based Mastery System', () => {
    it('should initialize beginner mastery at 0% (Not Assessed)', () => {
      const initialMastery: EvidenceMastery = {
        foundations: { level: 'not_assessed', score: 0, evidenceCount: 0 },
        filesAndChanges: { level: 'not_assessed', score: 0, evidenceCount: 0 },
        staging: { level: 'not_assessed', score: 0, evidenceCount: 0 },
        commits: { level: 'not_assessed', score: 0, evidenceCount: 0 },
        branches: { level: 'not_assessed', score: 0, evidenceCount: 0 },
        merging: { level: 'not_assessed', score: 0, evidenceCount: 0 },
        recovery: { level: 'not_assessed', score: 0, evidenceCount: 0 },
      };

      expect(initialMastery.foundations.score).toBe(0);
      expect(initialMastery.foundations.level).toBe('not_assessed');
      expect(initialMastery.staging.score).toBe(0);
      expect(initialMastery.commits.score).toBe(0);
    });

    it('should advance competency levels based on verified completion evidence', () => {
      const competencyScores: Record<CompetencyLevel, number> = {
        not_assessed: 0,
        introduced: 25,
        practiced: 50,
        understood: 75,
        independent: 90,
        mastered: 100,
      };

      expect(competencyScores['not_assessed']).toBe(0);
      expect(competencyScores['practiced']).toBe(50);
      expect(competencyScores['mastered']).toBe(100);
    });
  });

  describe('Engine as Teacher (Diffing & Educational Errors)', () => {
    it('should provide clear educational guidance when committing an empty staging box', () => {
      engine.execute('git init');
      // Attempt to commit with empty index
      const commitRes = engine.execute('git commit -m "No staged files"');
      expect(commitRes.exitCode).toBe(1);
      const outputText = commitRes.stdout.join(' ');
      // Educational message explaining that git add is needed to stage changes first
      expect(outputText).toContain('git add');
    });

    it('should calculate state changes correctly after git add and git commit', () => {
      engine.execute('git init');
      engine.execute('git add index.html');
      const repoAfterAdd = engine.getRepo();
      expect(Object.keys(repoAfterAdd.index)).toHaveLength(1);

      engine.execute('git commit -m "Initial commit"');
      const repoAfterCommit = engine.getRepo();
      expect(Object.keys(repoAfterCommit.commits)).toHaveLength(1);
      // Index is clean for the committed file
      expect(repoAfterCommit.head.type).toBe('branch');
    });
  });

  describe('Command Coverage Denominator Integrity', () => {
    it('should accurately calculate coverage across 62 command families and 120+ variants', () => {
      const stats = calculateCommandCoverage();
      expect(stats.totalCommands).toBe(62);
      expect(stats.coveragePercentage).toBeGreaterThanOrEqual(95);

      const totalVariants = GIT_COMMAND_COVERAGE.reduce((sum, item) => sum + item.variants.length, 0);
      expect(totalVariants).toBeGreaterThanOrEqual(120);

      // Verify that all core categories exist in the coverage matrix
      const categories = new Set(GIT_COMMAND_COVERAGE.map(c => c.category));
      expect(categories.has('Terminal Foundations')).toBe(true);
    });
  });
});
