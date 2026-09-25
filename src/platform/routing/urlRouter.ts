// src/platform/routing/urlRouter.ts
import type { ViewMode } from '../../context/AppContext';

export interface RouteState {
  mode: ViewMode;
  conceptId?: string | null;
}

/**
 * Normalizes the base URL configured by Vite (e.g. '/CommitForge/' or '/')
 */
export function getBaseUrl(): string {
  const base = import.meta.env.BASE_URL || '/';
  if (!base.startsWith('/')) return `/${base.endsWith('/') ? base : base + '/'}`;
  return base.endsWith('/') ? base : `${base}/`;
}

/**
 * Extracts the route segment and search query from either pathname or hash.
 * Handles both HTML5 History pushState routes:
 *   https://abhijeetm96.github.io/CommitForge/podforge
 * and Hash fallback routes:
 *   https://abhijeetm96.github.io/CommitForge/#/podforge
 */
export function parseCurrentRoute(): RouteState {
  if (typeof window === 'undefined') {
    return { mode: 'home' };
  }

  const base = getBaseUrl();
  let path = window.location.pathname;

  // Strip base prefix (case-insensitive)
  if (path.toLowerCase().startsWith(base.toLowerCase())) {
    path = path.slice(base.length);
  } else if (path.startsWith('/')) {
    path = path.slice(1);
  }

  // Remove trailing slashes
  path = path.replace(/\/+$/, '').toLowerCase();

  // If path is empty, check if hash contains a route
  if (!path && window.location.hash) {
    const rawHash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    const [hashPath] = rawHash.split('?');
    path = hashPath.replace(/\/+$/, '');
  }

  // Check query params for concept deep-linking
  const searchParams = new URLSearchParams(
    window.location.search || (window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '')
  );
  const conceptId = searchParams.get('concept') || searchParams.get('id') || null;

  const mode = mapSegmentToMode(path);
  return { mode, conceptId };
}

export function mapSegmentToMode(segment: string): ViewMode {
  const seg = segment.toLowerCase().trim();

  switch (seg) {
    case 'podforge':
    case 'k8s':
    case 'kubernetes':
      return 'podforge';

    case 'dockforge':
    case 'docker':
      return 'dockforge';

    case 'commitforge':
    case 'git':
    case 'learn':
    case 'academy':
      return 'learn';

    case 'universe':
    case 'concepts':
      return 'universe';

    case 'roadmap':
    case 'devops':
      return 'roadmap';

    case 'practice':
    case 'challenges':
      return 'practice';

    case 'labs':
      return 'labs';

    case 'ide':
    case 'workspace':
      return 'ide';

    case 'conflict-arena':
    case 'hospital':
    case 'break-it':
    case 'two-dev':
    case 'undo-lab':
    case 'capstone':
    case 'config-lab':
    case 'discover':
    case 'lesson':
    case 'guided-lesson':
      return seg as ViewMode;

    case 'home':
    case '':
    default:
      return 'home';
  }
}

export function mapModeToSegment(mode: ViewMode): string {
  switch (mode) {
    case 'podforge':
      return 'podforge';
    case 'dockforge':
      return 'dockforge';
    case 'learn':
      return 'commitforge';
    case 'universe':
      return 'universe';
    case 'roadmap':
      return 'roadmap';
    case 'practice':
      return 'practice';
    case 'labs':
      return 'labs';
    case 'ide':
      return 'ide';
    case 'conflict-arena':
    case 'hospital':
    case 'break-it':
    case 'two-dev':
    case 'undo-lab':
    case 'capstone':
    case 'config-lab':
    case 'discover':
    case 'lesson':
    case 'guided-lesson':
      return mode;
    case 'home':
    default:
      return '';
  }
}

/**
 * Returns the target document title for each mode.
 */
export function getTitleForMode(mode: ViewMode, conceptTitle?: string | null): string {
  const prefix = conceptTitle ? `${conceptTitle} | ` : '';
  switch (mode) {
    case 'podforge':
      return `${prefix}PodForge | Interactive Kubernetes Academy`;
    case 'dockforge':
      return `${prefix}DockForge | Interactive Docker & Container Academy`;
    case 'learn':
      return `${prefix}CommitForge | Interactive Git & Version Control Academy`;
    case 'universe':
      return `${prefix}71 Concepts Universe | CommitForge Git Academy`;
    case 'roadmap':
      return `${prefix}DevOps & Cloud-Native Engineering Roadmap | Forge Suite`;
    case 'practice':
      return `${prefix}CommitForge Practice Challenges | Forge Suite`;
    case 'labs':
      return `${prefix}CommitForge Simulation Labs | Forge Suite`;
    case 'ide':
      return `${prefix}CommitForge Developer IDE | Forge Suite`;
    case 'home':
    default:
      return 'Forge Suite | Interactive Developer & Cloud-Native Academies (CommitForge & PodForge)';
  }
}

/**
 * Returns the absolute path including Vite BASE_URL for the given mode.
 */
export function getUrlForMode(mode: ViewMode, conceptId?: string | null): string {
  const base = getBaseUrl();
  const segment = mapModeToSegment(mode);
  let target = segment ? `${base}${segment}` : base;

  if (conceptId) {
    target += `?concept=${encodeURIComponent(conceptId)}`;
  }

  return target;
}

/**
 * Synchronizes the browser address bar and history with the active view mode.
 */
export function syncUrlWithMode(mode: ViewMode, conceptId?: string | null, replace: boolean = false): void {
  if (typeof window === 'undefined') return;

  const targetUrl = getUrlForMode(mode, conceptId);
  const currentUrl = `${window.location.pathname}${window.location.search}`;

  if (targetUrl !== currentUrl) {
    if (replace) {
      window.history.replaceState({ mode, conceptId }, '', targetUrl);
    } else {
      window.history.pushState({ mode, conceptId }, '', targetUrl);
    }
  }

  document.title = getTitleForMode(mode);
}
