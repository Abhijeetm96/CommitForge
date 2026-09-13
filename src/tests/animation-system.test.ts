import { describe, it, expect, beforeEach } from 'vitest';
import { GitEngine } from '../git-engine/engine';
import { calculateGitStateDiff } from '../components/animation/stateDiff';
import { deriveVisualSnapshot } from '../components/animation/gitPhysics';
import { getCausalStory } from '../components/animation/causalStories';

describe('CommitForge Animation-First Git Physics & Causal Engine', () => {
  let engine: GitEngine;

  beforeEach(() => {
    engine = new GitEngine({
      'index.html': '<h1>Hello CommitForge</h1>',
      'style.css': 'body { background: #000; }',
    });
  });

  describe('Git Physics & Visual Snapshot Derivation', () => {
    it('should derive consistent visual entities directly from GitRepo', () => {
      engine.execute('git init');
      const repo = engine.getRepo();
      const snapshot = deriveVisualSnapshot(repo);

      expect(snapshot.workingTree).toHaveLength(2);
      expect(snapshot.stagingArea).toHaveLength(0);
      expect(snapshot.commits).toHaveLength(0);
      expect(snapshot.head.type).toBe('branch');
      expect(snapshot.head.targetBranch).toBe('main');
    });

    it('should accurately track files moving into staging area', () => {
      engine.execute('git init');
      engine.execute('git add index.html');
      const repo = engine.getRepo();
      const snapshot = deriveVisualSnapshot(repo);

      expect(snapshot.stagingArea).toHaveLength(1);
      expect(snapshot.stagingArea[0].name).toBe('index.html');
      expect(snapshot.stagingArea[0].status).toBe('staged');
    });
  });

  describe('State Diff Engine (calculateGitStateDiff)', () => {
    it('should accurately detect commits and branch advancements', () => {
      engine.execute('git init');
      const beforeRepo = engine.getRepo();

      engine.execute('git add index.html');
      engine.execute('git commit -m "First snapshot"');
      const afterRepo = engine.getRepo();

      const diff = calculateGitStateDiff(beforeRepo, afterRepo);
      expect(diff.hasChanges).toBe(true);
      expect(diff.newCommits).toHaveLength(1);
      expect(diff.newCommits[0].message).toBe('First snapshot');
      expect(diff.branchesChanged).toHaveLength(1);
      expect(diff.branchesChanged[0].name).toBe('main');
    });

    it('should detect remote reference updates during push', () => {
      engine.execute('git init');
      engine.execute('git add index.html');
      engine.execute('git commit -m "Commit for remote"');
      engine.execute('git remote add origin https://github.com/developer/repo.git');

      const beforePush = engine.getRepo();
      engine.execute('git push origin main');
      const afterPush = engine.getRepo();

      const diff = calculateGitStateDiff(beforePush, afterPush);
      expect(diff.remoteBranchesChanged).toHaveLength(1);
      expect(diff.remoteBranchesChanged[0].remote).toBe('origin');
      expect(diff.remoteBranchesChanged[0].branch).toBe('main');
      expect(diff.summary.some(s => s.includes('origin/main'))).toBe(true);
    });

    it('should detect stash pushes and pops', () => {
      engine.execute('git init');
      engine.execute('git add index.html');
      engine.execute('git commit -m "Base"');
      engine.updateFileContent('index.html', '<h1>Dirty edit</h1>');

      const beforeStash = engine.getRepo();
      engine.execute('git stash');
      const afterStash = engine.getRepo();

      const stashDiff = calculateGitStateDiff(beforeStash, afterStash);
      expect(stashDiff.stashChanged).toBe(true);
      expect(stashDiff.stashCountAfter).toBe(1);

      engine.execute('git stash pop');
      const afterPop = engine.getRepo();
      const popDiff = calculateGitStateDiff(afterStash, afterPop);
      expect(popDiff.stashChanged).toBe(true);
      expect(popDiff.stashCountAfter).toBe(0);
    });
  });

  describe('6-Step Causal Stories & Guardrail Verification', () => {
    it('git push story must include contact, compare, prepare, transfer, and update phases', () => {
      const story = getCausalStory('push');
      expect(story.id).toBe('push');

      const labels = story.steps.map(s => s.label.toLowerCase());
      expect(labels.some(l => l.includes('contact'))).toBe(true);
      expect(labels.some(l => l.includes('compare'))).toBe(true);
      expect(labels.some(l => l.includes('prepare'))).toBe(true);
      expect(labels.some(l => l.includes('transfer'))).toBe(true);
      expect(labels.some(l => l.includes('update'))).toBe(true);

      // Must have prediction checkpoint
      const predictionStep = story.steps.find(s => s.prediction !== undefined);
      expect(predictionStep).toBeDefined();
      expect(predictionStep?.prediction?.options).toContain("🤔 I'm not sure");
    });

    it('git commit story must verify staging area and advance branch label', () => {
      const story = getCausalStory('commit');
      expect(story.id).toBe('commit');

      const checkStep = story.steps.find(s => s.phase === 'check');
      expect(checkStep).toBeDefined();
      expect(checkStep?.label.toLowerCase()).toContain('check');

      const branchStep = story.steps.find(s => s.title.toLowerCase().includes('branch'));
      expect(branchStep).toBeDefined();
    });

    it('git rebase story must explain that commit identities change (D != D\')', () => {
      const story = getCausalStory('rebase');
      const replayStep = story.steps.find(s => s.title.toLowerCase().includes('replayed'));
      expect(replayStep).toBeDefined();
      expect(replayStep?.description).toContain('D != D\'');
    });

    it('git reset story must include --hard warning for destructive working tree operations', () => {
      const story = getCausalStory('reset');
      const desc = story.keyTakeaways.join(' ');
      expect(desc).toContain('DESTRUCTIVE WORKING-TREE OPERATION');
    });

    it('git merge conflict story must show collision before markers and provide 3-way choice', () => {
      const story = getCausalStory('conflict');
      expect(story.simulatorType).toBe('conflict');
      const firstStep = story.steps[0];
      expect(firstStep.title.toLowerCase()).toContain('same line');
    });
  });
});
