import { describe, it, expect } from 'vitest';
import {
  mapSegmentToMode,
  mapModeToSegment,
  getUrlForMode,
  getTitleForMode,
  getBaseUrl,
} from '../platform/routing/urlRouter';

describe('Forge Suite Unified SPA URL Router & Deep-Linking', () => {
  it('correctly maps URL path segments to ViewModes', () => {
    expect(mapSegmentToMode('podforge')).toBe('podforge');
    expect(mapSegmentToMode('k8s')).toBe('podforge');
    expect(mapSegmentToMode('kubernetes')).toBe('podforge');

    expect(mapSegmentToMode('dockforge')).toBe('dockforge');
    expect(mapSegmentToMode('docker')).toBe('dockforge');

    expect(mapSegmentToMode('commitforge')).toBe('learn');
    expect(mapSegmentToMode('git')).toBe('learn');
    expect(mapSegmentToMode('learn')).toBe('learn');

    expect(mapSegmentToMode('roadmap')).toBe('roadmap');
    expect(mapSegmentToMode('practice')).toBe('practice');
    expect(mapSegmentToMode('labs')).toBe('labs');
    expect(mapSegmentToMode('ide')).toBe('ide');
    expect(mapSegmentToMode('home')).toBe('home');
    expect(mapSegmentToMode('')).toBe('home');
  });

  it('correctly maps ViewModes to canonical URL path segments', () => {
    expect(mapModeToSegment('podforge')).toBe('podforge');
    expect(mapModeToSegment('dockforge')).toBe('dockforge');
    expect(mapModeToSegment('learn')).toBe('commitforge');
    expect(mapModeToSegment('roadmap')).toBe('roadmap');
    expect(mapModeToSegment('practice')).toBe('practice');
    expect(mapModeToSegment('home')).toBe('');
  });

  it('generates correct URLs with base path and optional concept deep-link parameter', () => {
    const base = getBaseUrl();

    expect(getUrlForMode('home')).toBe(base);
    expect(getUrlForMode('podforge')).toBe(`${base}podforge`);
    expect(getUrlForMode('dockforge')).toBe(`${base}dockforge`);
    expect(getUrlForMode('learn')).toBe(`${base}commitforge`);

    // With concept deep-link
    expect(getUrlForMode('podforge', 'c-k8s-pods')).toBe(`${base}podforge?concept=c-k8s-pods`);
    expect(getUrlForMode('dockforge', 'c-dockerfile')).toBe(`${base}dockforge?concept=c-dockerfile`);
  });

  it('generates distinct branded titles for each academy', () => {
    expect(getTitleForMode('podforge')).toContain('PodForge');
    expect(getTitleForMode('dockforge')).toContain('DockForge');
    expect(getTitleForMode('learn')).toContain('CommitForge');
    expect(getTitleForMode('roadmap')).toContain('Roadmap');
    expect(getTitleForMode('home')).toContain('Forge Suite');

    // With concept prefix
    expect(getTitleForMode('podforge', 'Pod Lifecycle')).toBe('Pod Lifecycle | PodForge | Interactive Kubernetes Academy');
  });
});
