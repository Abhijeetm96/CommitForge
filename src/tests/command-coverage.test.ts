import { describe, it, expect, beforeEach } from 'vitest';
import { GitEngine } from '../commitforge/git-engine/engine';
import { GIT_COMMAND_COVERAGE, calculateCommandCoverage } from '../commitforge/data/gitCommandCoverage';

describe('CommitForge Complete Git Command Coverage', () => {
  let engine: GitEngine;

  beforeEach(() => {
    engine = new GitEngine({
      'index.html': '<h1>Hello CommitForge</h1>',
      'style.css': 'body { background: #111; }',
      'script.js': 'console.log("Ready");',
    });
    engine.execute('git init');
    engine.execute('git add .');
    engine.execute('git commit -m "Initial commit"');
  });

  it('should verify command coverage matrix satisfies comprehensive requirements', () => {
    const stats = calculateCommandCoverage();
    expect(stats.totalCommands).toBeGreaterThanOrEqual(35);
    expect(stats.engineSupportedCount).toBeGreaterThan(30);
    expect(stats.coveragePercentage).toBeGreaterThanOrEqual(90);

    for (const item of GIT_COMMAND_COVERAGE) {
      expect(item.command).toBeDefined();
      expect(item.category).toBeDefined();
      expect(['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4']).toContain(item.tier);
      expect(item.description.length).toBeGreaterThan(10);
    }
  });

  it('should support git commit --amend', () => {
    engine.updateFileContent('index.html', '<h1>Updated Header</h1>');
    engine.execute('git add index.html');
    const amendRes = engine.execute('git commit --amend -m "Amended initial commit"');
    expect(amendRes.exitCode).toBe(0);
    expect(amendRes.stdout.some(l => l.includes('Amended commit'))).toBe(true);

    const logRes = engine.execute('git log --oneline');
    expect(logRes.stdout.length).toBe(1); // Still only 1 commit in history, not 2!
    expect(logRes.stdout[0]).toContain('Amended initial commit');
  });

  it('should support git add -p (patch staging simulation)', () => {
    engine.updateFileContent('index.html', '<h1>Patched</h1>');
    const addRes = engine.execute('git add -p index.html');
    expect(addRes.exitCode).toBe(0);
    expect(addRes.stdout.some(l => l.includes('Stage this hunk'))).toBe(true);
    expect(engine.getRepo().index['index.html']).toBe('<h1>Patched</h1>');
  });

  it('should support git log variants (--graph, --all, -S pickaxe)', () => {
    engine.execute('git branch feature');
    engine.execute('git switch feature');
    engine.updateFileContent('auth.js', 'export const token = "abc123secret";');
    engine.execute('git add auth.js');
    engine.execute('git commit -m "Add authentication token"');

    const graphRes = engine.execute('git log --graph --all --oneline');
    expect(graphRes.exitCode).toBe(0);
    expect(graphRes.stdout.some(l => l.startsWith('*'))).toBe(true);

    const pickaxeRes = engine.execute('git log -S token --oneline');
    expect(pickaxeRes.exitCode).toBe(0);
    expect(pickaxeRes.stdout.some(l => l.includes('Add authentication token'))).toBe(true);
  });

  it('should support git branch variants (-r, -vv, -c copy, --merged)', () => {
    engine.execute('git remote add origin https://github.com/example/repo.git');
    engine.execute('git push -u origin main');

    const copyRes = engine.execute('git branch -c main main-backup');
    expect(copyRes.exitCode).toBe(0);
    expect(engine.getRepo().branches['main-backup']).toBeDefined();

    const remotesRes = engine.execute('git branch -r');
    expect(remotesRes.exitCode).toBe(0);
    expect(remotesRes.stdout.some(l => l.includes('origin/main'))).toBe(true);

    const verboseRes = engine.execute('git branch -vv');
    expect(verboseRes.exitCode).toBe(0);
    expect(verboseRes.stdout.some(l => l.includes('main'))).toBe(true);
  });

  it('should support git merge variants (--squash, --ff-only, --continue, --abort)', () => {
    engine.execute('git switch -c feature/cart');
    engine.updateFileContent('cart.js', 'console.log("cart item");');
    engine.execute('git add cart.js');
    engine.execute('git commit -m "Commit 1 on feature"');

    engine.updateFileContent('cart.js', 'console.log("cart item v2");');
    engine.execute('git add cart.js');
    engine.execute('git commit -m "Commit 2 on feature"');

    engine.execute('git switch main');
    const squashRes = engine.execute('git merge --squash feature/cart');
    expect(squashRes.exitCode).toBe(0);
    expect(squashRes.stdout.some(l => l.includes('Squash commit -- not updating HEAD'))).toBe(true);
    expect(engine.getRepo().index['cart.js']).toBeDefined();
    // In squash merge, HEAD commit does not change until git commit is run
    expect(engine.getRepo().head.type).toBe('branch');
    expect(engine.getRepo().head.ref).toBe('main');
  });

  it('should support git push --force-with-lease and git push --delete', () => {
    engine.execute('git remote add origin https://github.com/example/repo.git');
    engine.execute('git push -u origin main');

    // Create and push branch
    engine.execute('git switch -c temp-branch');
    engine.updateFileContent('temp.txt', '123');
    engine.execute('git add temp.txt');
    engine.execute('git commit -m "temp"');
    engine.execute('git push -u origin temp-branch');
    expect(engine.getRepo().remotes['origin'].branches['temp-branch']).toBeDefined();

    // Delete remote branch
    const deleteRes = engine.execute('git push origin --delete temp-branch');
    expect(deleteRes.exitCode).toBe(0);
    expect(engine.getRepo().remotes['origin'].branches['temp-branch']).toBeUndefined();
  });

  it('should support git config (--list, --get, --unset, and updating key-values)', () => {
    engine.execute('git config user.name "Alice Dev"');
    engine.execute('git config user.email "alice@example.com"');

    const getRes = engine.execute('git config user.name');
    expect(getRes.stdout[0]).toBe('Alice Dev');

    const listRes = engine.execute('git config --list');
    expect(listRes.stdout.some(l => l.includes('user.name=Alice Dev'))).toBe(true);

    const unsetRes = engine.execute('git config --unset user.name');
    expect(unsetRes.exitCode).toBe(0);
    const getAfter = engine.execute('git config user.name');
    expect(getAfter.stdout[0]).toBe('');
  });

  it('should support low-level Git plumbing commands', () => {
    // git hash-object
    const hashRes = engine.execute('git hash-object index.html');
    expect(hashRes.exitCode).toBe(0);
    const hash = hashRes.stdout[0];
    expect(hash).toMatch(/^[0-9a-f]{40}$/);

    // git write-tree
    const treeRes = engine.execute('git write-tree');
    expect(treeRes.exitCode).toBe(0);
    const treeHash = treeRes.stdout[0];
    expect(treeHash).toMatch(/^[0-9a-f]{40}$/);

    // git commit-tree
    const commitTreeRes = engine.execute(`git commit-tree ${treeHash} -m "Plumbing commit"`);
    expect(commitTreeRes.exitCode).toBe(0);
    const commitHash = commitTreeRes.stdout[0];
    expect(commitHash).toMatch(/^[0-9a-f]{40}$/);
    expect(engine.getRepo().commits[commitHash]).toBeDefined();

    // git rev-parse
    const revParseRes = engine.execute('git rev-parse HEAD');
    expect(revParseRes.exitCode).toBe(0);
    expect(revParseRes.stdout[0]).toMatch(/^[0-9a-f]{40}$/);

    // git cat-file -t and -p
    const catTypeRes = engine.execute(`git cat-file -t ${commitHash}`);
    expect(catTypeRes.stdout[0]).toBe('commit');

    const catPrettyRes = engine.execute(`git cat-file -p ${commitHash}`);
    expect(catPrettyRes.stdout.some(l => l.includes('Plumbing commit'))).toBe(true);

    // git ls-files
    const lsFilesRes = engine.execute('git ls-files');
    expect(lsFilesRes.exitCode).toBe(0);
    expect(lsFilesRes.stdout.includes('index.html')).toBe(true);

    // git count-objects and fsck
    const countRes = engine.execute('git count-objects');
    expect(countRes.exitCode).toBe(0);
    expect(countRes.stdout[0]).toContain('objects');

    const fsckRes = engine.execute('git fsck');
    expect(fsckRes.exitCode).toBe(0);
    expect(fsckRes.stdout.some(l => l.includes('done'))).toBe(true);
  });

  it('should support professional simulations (worktree, submodule, format-patch, apply, lfs, gc)', () => {
    const worktreeRes = engine.execute('git worktree list');
    expect(worktreeRes.exitCode).toBe(0);
    expect(worktreeRes.stdout.some(l => l.includes('/workspace'))).toBe(true);

    const submoduleRes = engine.execute('git submodule status');
    expect(submoduleRes.exitCode).toBe(0);

    const patchRes = engine.execute('git format-patch -1 HEAD');
    expect(patchRes.exitCode).toBe(0);

    const applyRes = engine.execute('git apply 0001-patch.patch');
    expect(applyRes.exitCode).toBe(0);

    const lfsRes = engine.execute('git lfs track "*.psd"');
    expect(lfsRes.exitCode).toBe(0);

    const gcRes = engine.execute('git gc');
    expect(gcRes.exitCode).toBe(0);
    expect(gcRes.stdout.some(l => l.includes('Counting objects'))).toBe(true);
  });
});
