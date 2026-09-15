import { describe, it, expect } from 'vitest';
import {
  SliceState,
  TEACHING_STEPS,
  seedTeacherSliceRepo,
} from '../data/teacherSliceStory';
import { GitEngine } from '../git-engine/engine';

describe('Teacher-Led Vertical Slice: Portfolio Website First Git Snapshot', () => {
  it('defines the canonical 18 states in sequential order', () => {
    expect(TEACHING_STEPS).toHaveLength(18);

    const expectedSequence: SliceState[] = [
      SliceState.PROBLEM,
      SliceState.INITIAL_REPO_EXPLORED,
      SliceState.FILES_MODIFIED,
      SliceState.STATUS_OBSERVED,
      SliceState.DIFF_OBSERVED,
      SliceState.STAGING_EXPLAINED,
      SliceState.PREDICT_STAGING,
      SliceState.INDEX_HTML_STAGED,
      SliceState.STAGING_VERIFIED,
      SliceState.COMMIT_EXPLAINED,
      SliceState.COMMIT_CREATED,
      SliceState.COMMIT_VERIFIED,
      SliceState.ENV_ACCIDENTALLY_STAGED,
      SliceState.DANGER_EXPLAINED,
      SliceState.ENV_UNSTAGED,
      SliceState.RECOVERY_VERIFIED,
      SliceState.INDEPENDENT_CHALLENGE,
      SliceState.MASTERY_GATE,
    ];

    TEACHING_STEPS.forEach((step, idx) => {
      expect(step.id).toBe(expectedSequence[idx]);
      expect(step.stepIndex).toBe(idx + 1);
      expect(step.seniorDeveloperDialogue).toBeDefined();
      expect(step.seniorDeveloperDialogue.length).toBeGreaterThan(20);
    });
  });

  it('correctly maps the 6 story milestones across steps', () => {
    const milestones = TEACHING_STEPS.map(s => s.milestone);
    expect(milestones.slice(0, 2)).toEqual(['Problem', 'Problem']);
    expect(milestones.slice(2, 5)).toEqual(['Inspect', 'Inspect', 'Inspect']);
    expect(milestones.slice(5, 9)).toEqual(['Choose', 'Choose', 'Choose', 'Choose']);
    expect(milestones.slice(9, 12)).toEqual(['Save', 'Save', 'Save']);
    expect(milestones.slice(12, 16)).toEqual(['Fix', 'Fix', 'Fix', 'Fix']);
    expect(milestones.slice(16, 18)).toEqual(['Prove', 'Prove']);
  });

  it('seeds repository with pre-existing C0 commit and clean tracked files', () => {
    const repo = seedTeacherSliceRepo();
    expect(repo.initialized).toBe(true);
    expect(repo.branches['main']?.targetCommitHash).toBe('c0a1b2c');
    expect(repo.commits['c0a1b2c']).toBeDefined();
    expect(repo.commits['c0a1b2c'].message).toBe('Initial website setup');
    expect(repo.workingDirectory['index.html']).toBeDefined();
    expect(repo.workingDirectory['style.css']).toBeDefined();
    expect(repo.index['index.html']).toBeDefined();
    expect(repo.index['style.css']).toBeDefined();
    expect(repo.ignoredPatterns).not.toContain('.env');
  });

  it('simulates status and diff on modified tracked files cleanly', () => {
    const engine = new GitEngine();
    const repo = seedTeacherSliceRepo();
    engine.setRepo(repo);

    // Simulate Tuesday's edits
    engine.updateFileContent('index.html', '<header class="hero">Welcome</header>');
    engine.updateFileContent('style.css', 'body { margin: 0; } .button { color: red; }');

    const statusRes = engine.execute('git status');
    expect(statusRes.stdout.join('\n')).toContain('Changes not staged for commit:');
    expect(statusRes.stdout.join('\n')).toContain('modified:   index.html');
    expect(statusRes.stdout.join('\n')).toContain('modified:   style.css');

    const diffRes = engine.execute('git diff');
    expect(diffRes.stdout.join('\n')).toContain('+<header class="hero">Welcome</header>');
  });

  it('selectively stages index.html while keeping style.css unstaged in working tree', () => {
    const engine = new GitEngine();
    const repo = seedTeacherSliceRepo();
    engine.setRepo(repo);

    engine.updateFileContent('index.html', '<header class="hero">Welcome</header>');
    engine.updateFileContent('style.css', 'body { margin: 0; } .button { color: red; }');

    // Execute git add index.html
    const addRes = engine.execute('git add index.html');
    expect(addRes.exitCode).toBe(0);

    const updated = engine.getRepo();
    // index.html is staged
    expect(updated.index['index.html']).toBe('<header class="hero">Welcome</header>');
    // style.css is NOT staged (matches C0 in index, modified in workingDirectory)
    expect(updated.index['style.css']).toBe(repo.commits['c0a1b2c'].files['style.css']);
    expect(updated.workingDirectory['style.css']).toBe('body { margin: 0; } .button { color: red; }');

    // Validate step transition logic
    const step8 = TEACHING_STEPS.find(s => s.id === SliceState.INDEX_HTML_STAGED);
    expect(step8?.masteryRequirements?.stateTransition?.(updated, ['git add index.html'])).toBe(true);
  });

  it('creates commit C1, empties staging, and leaves style.css modified on desk', () => {
    const engine = new GitEngine();
    const repo = seedTeacherSliceRepo();
    engine.setRepo(repo);

    engine.updateFileContent('index.html', '<header class="hero">Welcome</header>');
    engine.updateFileContent('style.css', 'body { margin: 0; } .button { color: red; }');
    engine.execute('git add index.html');

    const commitRes = engine.execute('git commit -m "Add hero header to homepage"');
    expect(commitRes.exitCode).toBe(0);

    const updated = engine.getRepo();
    expect(Object.keys(updated.commits)).toHaveLength(2);

    const headHash = updated.branches['main']?.targetCommitHash;
    expect(updated.commits[headHash]?.message).toBe('Add hero header to homepage');
    expect(updated.commits[headHash]?.files['index.html']).toBe('<header class="hero">Welcome</header>');
    // style.css is still modified in working directory!
    expect(updated.workingDirectory['style.css']).toBe('body { margin: 0; } .button { color: red; }');

    const step11 = TEACHING_STEPS.find(s => s.id === SliceState.COMMIT_CREATED);
    expect(step11?.masteryRequirements?.stateTransition?.(updated, ['git commit -m "Add hero header to homepage"'])).toBe(true);
  });

  it('accurately handles .env accidental staging and safe recovery with git restore --staged', () => {
    const engine = new GitEngine();
    const repo = seedTeacherSliceRepo();
    engine.setRepo(repo);

    // Create untracked secret file using fictional simulated secret
    engine.createFile('.env', 'STRIPE_SECRET_KEY=SIMULATED_SECRET\nDB_PASS=SIMULATED_PASSWORD');

    // Accidentally stage .env
    const addEnvRes = engine.execute('git add .env');
    expect(addEnvRes.exitCode).toBe(0);
    expect(engine.getRepo().index['.env']).toBe('STRIPE_SECRET_KEY=SIMULATED_SECRET\nDB_PASS=SIMULATED_PASSWORD');

    const step13 = TEACHING_STEPS.find(s => s.id === SliceState.ENV_ACCIDENTALLY_STAGED);
    expect(step13?.masteryRequirements?.stateTransition?.(engine.getRepo(), ['git add .env'])).toBe(true);

    // Execute safe recovery
    const restoreRes = engine.execute('git restore --staged .env');
    expect(restoreRes.exitCode).toBe(0);

    const restoredRepo = engine.getRepo();
    // Removed from staging area
    expect(restoredRepo.index['.env']).toBeUndefined();
    // Still present on disk with keys intact!
    expect(restoredRepo.workingDirectory['.env']).toBe('STRIPE_SECRET_KEY=SIMULATED_SECRET\nDB_PASS=SIMULATED_PASSWORD');

    const step15 = TEACHING_STEPS.find(s => s.id === SliceState.ENV_UNSTAGED);
    expect(step15?.masteryRequirements?.stateTransition?.(restoredRepo, ['git restore --staged .env'])).toBe(true);
  });

  it('validates the independent challenge logic and mistake recovery', () => {
    const engine = new GitEngine();
    const repo = seedTeacherSliceRepo();
    engine.setRepo(repo);

    // Independent challenge files
    engine.createFile('about.html', '<h2>About Me</h2>');
    engine.createFile('notes.tmp', 'TODO: scratchpad');

    const challengeStep = TEACHING_STEPS.find(s => s.id === SliceState.INDEPENDENT_CHALLENGE);
    expect(challengeStep).toBeDefined();

    // Mistake case: User runs git add . which stages both about.html and notes.tmp
    engine.execute('git add .');
    expect(engine.getRepo().index['notes.tmp']).toBeDefined();

    // Recover using git restore --staged notes.tmp
    engine.execute('git restore --staged notes.tmp');
    expect(engine.getRepo().index['notes.tmp']).toBeUndefined();
    expect(engine.getRepo().index['about.html']).toBeDefined();

    // Now commit
    engine.execute('git commit -m "Add developer portfolio bio"');

    // Validation should succeed after recovery
    expect(challengeStep?.masteryRequirements?.stateTransition?.(engine.getRepo(), [])).toBe(true);
  });

  it('requires conceptual explanation in the final mastery gate', () => {
    const masteryGate = TEACHING_STEPS.find(s => s.id === SliceState.MASTERY_GATE);
    expect(masteryGate).toBeDefined();
    expect(masteryGate?.reflection).toBeDefined();

    const correctOpt = masteryGate?.reflection?.options.find(o => o.isCorrect);
    expect(correctOpt?.text).toContain('Because I only staged about.html');

    const wrongOpts = masteryGate?.reflection?.options.filter(o => !o.isCorrect);
    expect(wrongOpts?.length).toBe(2);
  });
});
