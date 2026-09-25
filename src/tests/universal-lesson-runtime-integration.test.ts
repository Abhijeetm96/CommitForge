import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { GitEngine } from '../commitforge/git-engine/engine';
import { DockerEngine } from '../dockforge/docker-engine/engine';
import { KubeEngine } from '../podforge/kube-engine/engine';
import { GitRuntimeAdapter, gitLessonAdapter } from '../platform/adapters/gitAdapter';
import { DockerRuntimeAdapter, dockerLessonAdapter } from '../platform/adapters/dockerAdapter';
import { KubeRuntimeAdapter, kubeLessonAdapter } from '../platform/adapters/kubeAdapter';
import { getUniversalConcept } from '../commitforge/data/unifiedAcademyData';
import { DOCKER_UNIVERSAL_CONCEPTS } from '../dockforge/data/unifiedDockerData';
import { KUBE_CHAPTERS } from '../podforge/data/topics';

describe('UniversalLessonRuntime & UniversalTerminal Across All Academies (Issue #5)', () => {
  it('verifies GitRuntimeAdapter and gitLessonAdapter generate valid 14-step pedagogical lesson', () => {
    const gitEngine = new GitEngine();
    const adapter = new GitRuntimeAdapter(gitEngine);
    expect(adapter.technology).toBe('git');

    const concept = getUniversalConcept('c-git-commit');
    const lesson = gitLessonAdapter(concept);

    expect(lesson.technology).toBe('git');
    expect(lesson.title).toBe(concept.title);
    expect(lesson.syntax.tokens.length).toBeGreaterThan(0);
    expect(lesson.syntax.variations.length).toBeGreaterThanOrEqual(2);
    expect(lesson.visualDiagram.nodes.length).toBeGreaterThanOrEqual(3);
  });

  it('verifies DockerRuntimeAdapter and dockerLessonAdapter generate valid 14-step pedagogical lesson', () => {
    const dockerEngine = new DockerEngine();
    const adapter = new DockerRuntimeAdapter(dockerEngine);
    expect(adapter.technology).toBe('docker');

    const concept = DOCKER_UNIVERSAL_CONCEPTS['c-what-are-containers'];
    const lesson = dockerLessonAdapter(concept);

    expect(lesson.technology).toBe('docker');
    expect(lesson.syntax.tokens.length).toBeGreaterThan(0);
    expect(lesson.syntax.variations.length).toBeGreaterThanOrEqual(2);
    expect(lesson.visualDiagram.nodes.length).toBeGreaterThanOrEqual(3);
  });

  it('verifies KubeRuntimeAdapter and kubeLessonAdapter generate valid 14-step pedagogical lesson', () => {
    const kubeEngine = new KubeEngine();
    const adapter = new KubeRuntimeAdapter(kubeEngine);
    expect(adapter.technology).toBe('kubernetes');

    const concept = KUBE_CHAPTERS[0].concepts[0];
    const lesson = kubeLessonAdapter(concept);

    expect(lesson.technology).toBe('kubernetes');
    expect(lesson.syntax.tokens.length).toBeGreaterThan(0);
    expect(lesson.syntax.variations.length).toBeGreaterThanOrEqual(2);
    expect(lesson.visualDiagram.nodes.length).toBeGreaterThanOrEqual(3);
  });

  it('verifies UniversalLessonRuntime is wired into CommitForgeApp, DockForgeApp, and PodForgeApp', () => {
    const commitAppPath = path.resolve(__dirname, '../commitforge/CommitForgeApp.tsx');
    const commitContent = fs.readFileSync(commitAppPath, 'utf-8');
    expect(commitContent).toContain('UniversalLessonRuntime');
    expect(commitContent).toContain('GitRuntimeAdapter');

    const dockAppPath = path.resolve(__dirname, '../dockforge/DockForgeApp.tsx');
    const dockContent = fs.readFileSync(dockAppPath, 'utf-8');
    expect(dockContent).toContain('UniversalLessonRuntime');
    expect(dockContent).toContain('DockerRuntimeAdapter');

    const podAppPath = path.resolve(__dirname, '../podforge/PodForgeApp.tsx');
    const podContent = fs.readFileSync(podAppPath, 'utf-8');
    expect(podContent).toContain('UniversalLessonRuntime');
    expect(podContent).toContain('KubeRuntimeAdapter');
  });
});
