import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  IndexedDBProgressStorage,
  HybridProgressStorage,
  RemoteCloudSyncAdapter,
  LocalStorageProgressStorage,
} from '../progress/progressStorage';
import { ForgeSuiteProgress } from '../progress/progressTypes';

describe('IndexedDB & Cloud Sync Progress Storage Suite', () => {
  let mockStore: Record<string, string> = {};

  const fakeLocalStorage = {
    getItem: vi.fn((key: string) => mockStore[key] || null),
    setItem: vi.fn((key: string, val: string) => {
      mockStore[key] = val;
    }),
    removeItem: vi.fn((key: string) => {
      delete mockStore[key];
    }),
    clear: vi.fn(() => {
      mockStore = {};
    }),
  };

  beforeEach(() => {
    mockStore = {};
    vi.stubGlobal('localStorage', fakeLocalStorage);
    vi.stubGlobal('window', { localStorage: fakeLocalStorage, indexedDB: null });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const mockProgress: ForgeSuiteProgress = {
    version: 1,
    academies: {
      commitforge: {
        academyId: 'commitforge',
        completedLessonIds: ['c-git-init', 'c-git-commit'],
        startedLessonIds: ['c-git-init', 'c-git-commit', 'c-git-branch'],
        lessons: {
          'c-git-init': {
            lessonId: 'c-git-init',
            status: 'completed',
            conceptViewed: true,
            definitionViewed: true,
            diagramViewed: true,
            syntaxExplored: true,
            examplesViewed: true,
            simulatorStarted: true,
            simulatorCompleted: true,
            challengeStarted: true,
            challengeCompleted: true,
            attempts: 1,
            mistakes: 0,
            masteryPercent: 100,
          },
        },
        achievements: ['first-commit'],
        lastVisitedAt: '2026-09-25T10:00:00.000Z',
      },
      dockforge: {
        academyId: 'dockforge',
        completedLessonIds: [],
        startedLessonIds: [],
        lessons: {},
        achievements: [],
      },
      podforge: {
        academyId: 'podforge',
        completedLessonIds: [],
        startedLessonIds: [],
        lessons: {},
        achievements: [],
      },
    },
    preferences: {
      lastAcademy: 'commitforge',
    },
  };

  describe('LocalStorageProgressStorage Fallback', () => {
    it('saves and loads progress from localStorage', async () => {
      const storage = new LocalStorageProgressStorage('test:progress:key');
      await storage.save(mockProgress);
      const loaded = await storage.load();
      expect(loaded).toEqual(mockProgress);
      await storage.clear();
      const cleared = await storage.load();
      expect(cleared).toBeNull();
    });
  });

  describe('RemoteCloudSyncAdapter', () => {
    const adapter = new RemoteCloudSyncAdapter();

    it('exports progress package as valid JSON with metadata', () => {
      const exported = adapter.exportProgress(mockProgress);
      expect(typeof exported).toBe('string');
      const parsed = JSON.parse(exported);
      expect(parsed.format).toBe('forgesuite-progress-backup');
      expect(parsed.version).toBe(1);
      expect(parsed.data.academies.commitforge.completedLessonIds).toContain('c-git-commit');
    });

    it('imports and validates an exported package', () => {
      const exported = adapter.exportProgress(mockProgress);
      const imported = adapter.importProgress(exported);
      expect(imported.academies.commitforge.completedLessonIds).toEqual(['c-git-init', 'c-git-commit']);
    });

    it('merges local and remote progress with conflict resolution', () => {
      const remoteProgress: ForgeSuiteProgress = {
        version: 1,
        academies: {
          commitforge: {
            academyId: 'commitforge',
            completedLessonIds: ['c-git-push'],
            startedLessonIds: ['c-git-push'],
            lessons: {
              'c-git-push': {
                lessonId: 'c-git-push',
                status: 'completed',
                conceptViewed: true,
                definitionViewed: true,
                diagramViewed: true,
                syntaxExplored: true,
                examplesViewed: true,
                simulatorStarted: true,
                simulatorCompleted: true,
                challengeStarted: true,
                challengeCompleted: true,
                attempts: 2,
                mistakes: 1,
                masteryPercent: 95,
              },
            },
            achievements: ['remote-pusher'],
            lastVisitedAt: '2026-09-25T12:00:00.000Z',
          },
          dockforge: {
            academyId: 'dockforge',
            completedLessonIds: ['docker-run'],
            startedLessonIds: ['docker-run'],
            lessons: {},
            achievements: [],
          },
          podforge: {
            academyId: 'podforge',
            completedLessonIds: [],
            startedLessonIds: [],
            lessons: {},
            achievements: [],
          },
        },
      };

      const merged = adapter.mergeProgress(mockProgress, remoteProgress);

      // Union of completed lessons
      expect(merged.academies.commitforge.completedLessonIds).toContain('c-git-init');
      expect(merged.academies.commitforge.completedLessonIds).toContain('c-git-commit');
      expect(merged.academies.commitforge.completedLessonIds).toContain('c-git-push');

      // Union of achievements
      expect(merged.academies.commitforge.achievements).toContain('first-commit');
      expect(merged.academies.commitforge.achievements).toContain('remote-pusher');

      // Remote course added
      expect(merged.academies.dockforge.completedLessonIds).toContain('docker-run');
    });
  });

  describe('IndexedDB and Hybrid Fallbacks', () => {
    it('gracefully handles load failure when IndexedDB is unavailable in unit test environment', async () => {
      const idbStorage = new IndexedDBProgressStorage('mock_db', 'mock_store');
      const result = await idbStorage.load();
      // In node/vitest without browser indexedDB, it returns null safely
      expect(result).toBeNull();
    });

    it('HybridProgressStorage falls back to LocalStorage when IndexedDB is absent', async () => {
      const hybrid = new HybridProgressStorage();
      await hybrid.save(mockProgress);
      const loaded = await hybrid.load();
      expect(loaded).toEqual(mockProgress);
      await hybrid.clear();
    });
  });
});
