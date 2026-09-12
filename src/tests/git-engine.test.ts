import { describe, it, expect, beforeEach } from 'vitest';
import { GitEngine } from '../git-engine/engine';
import { extractObjectDatabase } from '../git-engine/internals';
import { evaluateDanger } from '../git-engine/danger';

describe('CommitForge Git Engine', () => {
  let engine: GitEngine;

  beforeEach(() => {
    engine = new GitEngine({
      'index.html': '<h1>Hello CommitForge</h1>',
      'style.css': 'body { background: #111; }',
      'script.js': 'console.log("Ready");',
    });
  });

  it('should initialize repository', () => {
    const res = engine.execute('git init');
    expect(res.exitCode).toBe(0);
    expect(engine.getRepo().initialized).toBe(true);
    expect(engine.getRepo().head.ref).toBe('main');
  });

  it('should stage files with git add and reflect in status', () => {
    engine.execute('git init');
    const statusBefore = engine.execute('git status');
    expect(statusBefore.stdout.some(l => l.includes('Untracked files:'))).toBe(true);

    const addRes = engine.execute('git add index.html');
    expect(addRes.exitCode).toBe(0);
    expect(engine.getRepo().index['index.html']).toBe('<h1>Hello CommitForge</h1>');

    const statusAfter = engine.execute('git status');
    expect(statusAfter.stdout.some(l => l.includes('Changes to be committed:'))).toBe(true);
  });

  it('should prevent adding ignored .env and warn on forced secret addition', () => {
    engine.execute('git init');
    engine.createFile('.env', 'API_KEY=secret1234567890');
    
    // Normal add should be blocked by .gitignore
    const addBlocked = engine.execute('git add .env');
    expect(addBlocked.exitCode).toBe(1);
    expect(addBlocked.stderr.some(l => l.includes('ignored'))).toBe(true);

    // Force add should succeed but emit security warning
    const addRes = engine.execute('git add -f .env');
    expect(addRes.stdout.some(l => l.includes('SECURITY WARNING'))).toBe(true);
  });

  it('should create commits and update branch reference', () => {
    engine.execute('git init');
    engine.execute('git add .');
    const commitRes = engine.execute('git commit -m "Initial commit"');
    expect(commitRes.exitCode).toBe(0);

    const repo = engine.getRepo();
    const mainBranch = repo.branches['main'];
    expect(mainBranch).toBeDefined();
    expect(mainBranch.targetCommitHash).not.toBe('');

    const headCommit = repo.commits[mainBranch.targetCommitHash];
    expect(headCommit).toBeDefined();
    expect(headCommit.message).toBe('Initial commit');
    expect(headCommit.files['index.html']).toBe('<h1>Hello CommitForge</h1>');
  });

  it('should handle branching and switching', () => {
    engine.execute('git init');
    engine.execute('git add .');
    engine.execute('git commit -m "Initial commit"');

    const branchRes = engine.execute('git switch -c feature-cart');
    expect(branchRes.exitCode).toBe(0);
    expect(engine.getRepo().head.ref).toBe('feature-cart');
    expect(engine.getRepo().branches['feature-cart']).toBeDefined();

    // Modify file in feature branch
    engine.updateFileContent('index.html', '<h1>Cart Enabled</h1>');
    engine.execute('git add index.html');
    engine.execute('git commit -m "Add cart to index"');

    // Switch back to main
    const switchBack = engine.execute('git switch main');
    expect(switchBack.exitCode).toBe(0);
    expect(engine.getRepo().workingDirectory['index.html']).toBe('<h1>Hello CommitForge</h1>');
  });

  it('should support detached HEAD on checkout of commit hash', () => {
    engine.execute('git init');
    engine.execute('git add .');
    engine.execute('git commit -m "Commit 1"');
    const commit1Hash = engine.getRepo().branches['main'].targetCommitHash;

    engine.updateFileContent('index.html', '<h1>Commit 2</h1>');
    engine.execute('git add .');
    engine.execute('git commit -m "Commit 2"');

    const checkoutRes = engine.execute(`git checkout ${commit1Hash.slice(0, 7)}`);
    expect(checkoutRes.exitCode).toBe(0);
    expect(engine.getRepo().head.type).toBe('detached');
    expect(engine.getRepo().head.ref).toBe(commit1Hash);
    expect(engine.getRepo().workingDirectory['index.html']).toBe('<h1>Hello CommitForge</h1>');
  });

  it('should perform fast-forward merge', () => {
    engine.execute('git init');
    engine.execute('git add .');
    engine.execute('git commit -m "Initial commit"');

    engine.execute('git switch -c feature-cart');
    engine.updateFileContent('index.html', '<h1>Cart Enabled</h1>');
    engine.execute('git add index.html');
    engine.execute('git commit -m "Add cart"');

    engine.execute('git switch main');
    const mergeRes = engine.execute('git merge feature-cart');
    expect(mergeRes.exitCode).toBe(0);
    expect(mergeRes.stdout.some(l => l.includes('Fast-forward'))).toBe(true);
    expect(engine.getRepo().workingDirectory['index.html']).toBe('<h1>Cart Enabled</h1>');
  });

  it('should detect merge conflicts and inject markers', () => {
    engine.execute('git init');
    engine.execute('git add .');
    engine.execute('git commit -m "Initial commit"');

    engine.execute('git switch -c branch-a');
    engine.updateFileContent('index.html', '<h1>Version A</h1>');
    engine.execute('git add index.html');
    engine.execute('git commit -m "Change to A"');

    engine.execute('git switch main');
    engine.updateFileContent('index.html', '<h1>Version Main</h1>');
    engine.execute('git add index.html');
    engine.execute('git commit -m "Change to Main"');

    const conflictMerge = engine.execute('git merge branch-a');
    expect(conflictMerge.exitCode).toBe(1);
    expect(engine.getRepo().mergeState?.inProgress).toBe(true);
    expect(engine.getRepo().workingDirectory['index.html']).toContain('<<<<<<< HEAD');
    expect(engine.getRepo().workingDirectory['index.html']).toContain('=======');
    expect(engine.getRepo().workingDirectory['index.html']).toContain('>>>>>>> branch-a');
  });

  it('should correctly execute reset --soft, --mixed, and --hard', () => {
    engine.execute('git init');
    engine.execute('git add .');
    engine.execute('git commit -m "Commit 1"');

    engine.updateFileContent('index.html', '<h1>Commit 2 Edits</h1>');
    engine.execute('git add .');
    engine.execute('git commit -m "Commit 2"');

    // Reset --soft HEAD~1
    const softRes = engine.execute('git reset --soft HEAD~1');
    expect(softRes.exitCode).toBe(0);
    expect(softRes.whyExplanation?.summary).toContain('--soft');
    expect(engine.getRepo().workingDirectory['index.html']).toBe('<h1>Commit 2 Edits</h1>');
    expect(engine.getRepo().index['index.html']).toBe('<h1>Commit 2 Edits</h1>');

    // Re-commit
    engine.execute('git commit -m "Commit 2 Recommitted"');

    // Reset --hard HEAD~1
    const hardRes = engine.execute('git reset --hard HEAD~1');
    expect(hardRes.exitCode).toBe(0);
    expect(hardRes.dangerLevel).toBe('HIGH');
    expect(engine.getRepo().workingDirectory['index.html']).toBe('<h1>Hello CommitForge</h1>');
  });

  it('should support git restore and restore --staged', () => {
    engine.execute('git init');
    engine.execute('git add .');
    engine.execute('git commit -m "Base"');

    engine.updateFileContent('index.html', '<h1>Unsaved Temporary Edit</h1>');
    engine.execute('git add index.html');
    expect(engine.getRepo().index['index.html']).toBe('<h1>Unsaved Temporary Edit</h1>');

    // Unstage
    const restoreStaged = engine.execute('git restore --staged index.html');
    expect(restoreStaged.exitCode).toBe(0);
    expect(engine.getRepo().index['index.html']).toBe('<h1>Hello CommitForge</h1>');
    expect(engine.getRepo().workingDirectory['index.html']).toBe('<h1>Unsaved Temporary Edit</h1>');

    // Discard working copy changes
    const restoreWork = engine.execute('git restore index.html');
    expect(restoreWork.exitCode).toBe(0);
    expect(engine.getRepo().workingDirectory['index.html']).toBe('<h1>Hello CommitForge</h1>');
  });

  it('should support git revert', () => {
    engine.execute('git init');
    engine.execute('git add .');
    engine.execute('git commit -m "Commit 1"');

    engine.updateFileContent('index.html', '<h1>Broken Edit</h1>');
    engine.execute('git add .');
    engine.execute('git commit -m "Bad commit"');

    const revertRes = engine.execute('git revert HEAD');
    expect(revertRes.exitCode).toBe(0);
    expect(engine.getRepo().workingDirectory['index.html']).toBe('<h1>Hello CommitForge</h1>');
  });

  it('should support git stash push and pop', () => {
    engine.execute('git init');
    engine.execute('git add .');
    engine.execute('git commit -m "Base"');

    engine.updateFileContent('index.html', '<h1>Half Done Work</h1>');
    const stashRes = engine.execute('git stash push -m "WIP on index"');
    expect(stashRes.exitCode).toBe(0);
    expect(engine.getRepo().workingDirectory['index.html']).toBe('<h1>Hello CommitForge</h1>');

    const popRes = engine.execute('git stash pop');
    expect(popRes.exitCode).toBe(0);
    expect(engine.getRepo().workingDirectory['index.html']).toBe('<h1>Half Done Work</h1>');
  });

  it('should reject non-fast-forward push when remote is ahead', () => {
    engine.execute('git init');
    engine.execute('git add .');
    engine.execute('git commit -m "Base"');

    engine.execute('git remote add origin https://github.com/company/shop.git');
    engine.execute('git push -u origin main');

    // Simulate remote moving ahead (e.g. teammate pushed)
    const repo = engine.getRepo();
    repo.remotes['origin'].branches['main'].targetCommitHash = 'f000000000000000000000000000000000000000';
    engine.setRepo(repo);

    // Make local commit without pulling
    engine.updateFileContent('index.html', '<h1>Local Divergent</h1>');
    engine.execute('git add .');
    engine.execute('git commit -m "Local divergent"');

    const pushRes = engine.execute('git push origin main');
    expect(pushRes.exitCode).toBe(1);
    expect(pushRes.stdout.some(l => l.includes('non-fast-forward'))).toBe(true);
  });

  it('should evaluate danger levels accurately', () => {
    expect(evaluateDanger('git status').level).toBe('SAFE');
    expect(evaluateDanger('git log --oneline').level).toBe('SAFE');
    expect(evaluateDanger('git reset --mixed HEAD~1').level).toBe('MEDIUM');
    expect(evaluateDanger('git reset --hard HEAD~1').level).toBe('HIGH');
    expect(evaluateDanger('git push origin main --force').level).toBe('VERY_HIGH');
  });

  it('should extract Git Internals object database', () => {
    engine.execute('git init');
    engine.execute('git add .');
    engine.execute('git commit -m "Initial commit"');

    const objects = extractObjectDatabase(engine.getRepo());
    expect(objects.some(o => o.type === 'commit')).toBe(true);
    expect(objects.some(o => o.type === 'tree')).toBe(true);
    expect(objects.some(o => o.type === 'blob')).toBe(true);
  });
});
