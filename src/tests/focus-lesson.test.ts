import { describe, it, expect, beforeEach } from 'vitest';
import { GitEngine } from '../git-engine/engine';
import { FOCUS_LESSONS } from '../data/focusLessonScenes';

describe('Focus Lesson Architecture & Scenes (Section 67-69)', () => {
  let engine: GitEngine;

  beforeEach(() => {
    engine = new GitEngine({
      'index.html': '<h1>Hello World</h1>',
      'style.css': 'body { margin: 0; }',
    });
    engine.execute('git init');
  });

  it('Lesson 1 (Git Add) defines 7 strict progressive scenes', () => {
    const lesson = FOCUS_LESSONS['add'];
    expect(lesson).toBeDefined();
    expect(lesson.scenes).toHaveLength(7);

    const types = lesson.scenes.map(s => s.type);
    expect(types).toEqual([
      'situation',
      'prediction',
      'interaction',
      'watch',
      'observe',
      'understand',
      'command',
    ]);
  });

  it('Lesson 2 (Git Commit) defines 7 strict progressive scenes', () => {
    const lesson = FOCUS_LESSONS['commit'];
    expect(lesson).toBeDefined();
    expect(lesson.scenes).toHaveLength(7);

    const types = lesson.scenes.map(s => s.type);
    expect(types).toEqual([
      'situation',
      'prediction',
      'interaction',
      'watch',
      'observe',
      'understand',
      'command',
    ]);
  });

  it('Lesson 3 (Git Push) defines 6 strict progressive scenes', () => {
    const lesson = FOCUS_LESSONS['push'];
    expect(lesson).toBeDefined();
    expect(lesson.scenes).toHaveLength(6);

    const types = lesson.scenes.map(s => s.type);
    expect(types).toEqual([
      'situation',
      'prediction',
      'interaction',
      'watch',
      'understand',
      'command',
    ]);
  });

  it('Predictions have exactly one correct choice and helpful explanations for wrong choices', () => {
    for (const lessonKey of ['add', 'commit', 'push'] as const) {
      const lesson = FOCUS_LESSONS[lessonKey];
      const predictionScene = lesson.scenes.find(s => s.type === 'prediction');
      expect(predictionScene).toBeDefined();
      expect(predictionScene?.predictionChoices).toBeDefined();

      const choices = predictionScene!.predictionChoices!;
      const correct = choices.filter(c => c.isCorrect);
      expect(correct).toHaveLength(1);

      // Verify each incorrect choice has an educational explanation (errors must teach)
      choices.forEach(c => {
        expect(c.explanation.length).toBeGreaterThan(15);
      });
    }
  });

  it('State synchronization: GitEngine command execution alters repo state predictably', () => {
    // Modify file
    engine.updateFileContent('index.html', '<h1>Hello World Updated</h1>');
    let repo = engine.getRepo();
    expect(repo.workingDirectory['index.html']).toBe('<h1>Hello World Updated</h1>');
    expect(Object.keys(repo.index)).toHaveLength(0);

    // git add
    const addResult = engine.execute('git add index.html');
    expect(addResult.exitCode).toBe(0);
    repo = engine.getRepo();
    expect(repo.index['index.html']).toBeDefined();

    // git commit
    const commitResult = engine.execute('git commit -m "Update title"');
    expect(commitResult.exitCode).toBe(0);
    repo = engine.getRepo();
    expect(Object.keys(repo.commits).length).toBeGreaterThan(0);
  });

  it('Every scene provides a contextual mentor hint for Forge', () => {
    for (const lessonKey of ['add', 'commit', 'push'] as const) {
      const lesson = FOCUS_LESSONS[lessonKey];
      lesson.scenes.forEach((scene, index) => {
        expect(scene.hint, `${lessonKey} scene ${index + 1} missing hint`).toBeDefined();
        expect(scene.hint.length).toBeGreaterThan(10);
      });
    }
  });
});
