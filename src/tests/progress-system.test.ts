// src/tests/progress-system.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  ProgressManager,
  LocalStorageProgressStorage,
  createDefaultProgress,
  migrateProgress,
  calculateCourseProgress,
  calculateTopicProgress,
  calculateLessonMastery,
  getCourseLessons,
  PROGRESS_STORAGE_KEY_V1,
  ForgeSuiteProgress,
} from '../progress';

describe('ForgeSuite Local-First Progress Tracking Architecture', () => {
  let mockStorageData: Record<string, string> = {};

  // Mock localStorage
  const mockLocalStorage = {
    getItem: vi.fn((key: string) => mockStorageData[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      mockStorageData[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete mockStorageData[key];
    }),
    clear: vi.fn(() => {
      mockStorageData = {};
    }),
  };

  beforeEach(() => {
    mockStorageData = {};
    vi.stubGlobal('localStorage', mockLocalStorage);
    vi.stubGlobal('window', { localStorage: mockLocalStorage });
  });

  describe('1. Default Initial State', () => {
    it('creates default progress with version 1 and all 3 academies', () => {
      const def = createDefaultProgress();
      expect(def.version).toBe(1);
      expect(def.academies.commitforge).toBeDefined();
      expect(def.academies.dockforge).toBeDefined();
      expect(def.academies.podforge).toBeDefined();
      expect(def.academies.commitforge.completedLessonIds).toEqual([]);
      expect(def.academies.dockforge.completedLessonIds).toEqual([]);
      expect(def.academies.podforge.completedLessonIds).toEqual([]);
    });

    it('initializes ProgressManager with clean storage', async () => {
      const storage = new LocalStorageProgressStorage('test:progress');
      const manager = new ProgressManager(storage);
      await manager.initialize();

      expect(manager.getIsLoaded()).toBe(true);
      const stats = manager.getCourseStats('dockforge');
      expect(stats.completedLessons).toBe(0);
      expect(stats.percentage).toBe(0);
      expect(stats.totalLessons).toBe(42); // 42 Docker concepts
    });
  });

  describe('2. Lesson Progression & Section Mastery', () => {
    it('marks lesson as in_progress when started', async () => {
      const storage = new LocalStorageProgressStorage('test:progress');
      const manager = new ProgressManager(storage);
      await manager.initialize();

      manager.startLesson('dockforge', 'c-what-are-containers');
      const lesson = manager.getLessonProgress('dockforge', 'c-what-are-containers');

      expect(lesson).toBeDefined();
      expect(lesson?.status).toBe('in_progress');
      expect(lesson?.firstStartedAt).toBeDefined();

      const course = manager.getAcademyProgress('dockforge');
      expect(course.startedLessonIds).toContain('c-what-are-containers');
      expect(course.completedLessonIds).not.toContain('c-what-are-containers');
    });

    it('calculates incremental mastery as sections are completed', async () => {
      const storage = new LocalStorageProgressStorage('test:progress');
      const manager = new ProgressManager(storage);
      await manager.initialize();

      const lessonId = 'c-what-are-containers';
      manager.startLesson('dockforge', lessonId);
      expect(manager.getLessonProgress('dockforge', lessonId)?.masteryPercent).toBe(0);

      manager.markConceptViewed('dockforge', lessonId);
      expect(manager.getLessonProgress('dockforge', lessonId)?.masteryPercent).toBe(15);

      manager.markSyntaxExplored('dockforge', lessonId);
      expect(manager.getLessonProgress('dockforge', lessonId)?.masteryPercent).toBe(30);

      manager.completeSimulator('dockforge', lessonId, { attempts: 2, mistakes: 1 });
      const afterSim = manager.getLessonProgress('dockforge', lessonId);
      expect(afterSim?.simulatorCompleted).toBe(true);
      expect(afterSim?.attempts).toBe(2);
      expect(afterSim?.mistakes).toBe(1);
      expect(afterSim?.masteryPercent).toBe(55);

      manager.completeChallenge('dockforge', lessonId, 95);
      const afterChal = manager.getLessonProgress('dockforge', lessonId);
      expect(afterChal?.challengeCompleted).toBe(true);
      expect(afterChal?.score).toBe(95);
      expect(afterChal?.masteryPercent).toBe(75);
    });

    it('sets mastery to 100% and marks completed on completeLesson()', async () => {
      const storage = new LocalStorageProgressStorage('test:progress');
      const manager = new ProgressManager(storage);
      await manager.initialize();

      const lessonId = 'c-what-are-containers';
      manager.completeLesson('dockforge', lessonId);

      const lesson = manager.getLessonProgress('dockforge', lessonId);
      expect(lesson?.status).toBe('completed');
      expect(lesson?.masteryPercent).toBe(100);
      expect(lesson?.completedAt).toBeDefined();

      const stats = manager.getCourseStats('dockforge');
      expect(stats.completedLessons).toBe(1);
      expect(manager.getAcademyProgress('dockforge').completedLessonIds).toContain(lessonId);
    });
  });

  describe('3. Multi-Academy Independence', () => {
    it('ensures progress in Git does not affect Docker or Kubernetes', async () => {
      const storage = new LocalStorageProgressStorage('test:progress');
      const manager = new ProgressManager(storage);
      await manager.initialize();

      // Complete 2 lessons in Git
      manager.completeLesson('commitforge', 'c-what-is-vcs');
      manager.completeLesson('commitforge', 'c-why-use-vcs');

      const gitStats = manager.getCourseStats('commitforge');
      const dockerStats = manager.getCourseStats('dockforge');
      const kubeStats = manager.getCourseStats('podforge');

      expect(gitStats.completedLessons).toBe(2);
      expect(gitStats.percentage).toBeGreaterThan(0);

      expect(dockerStats.completedLessons).toBe(0);
      expect(dockerStats.percentage).toBe(0);

      expect(kubeStats.completedLessons).toBe(0);
      expect(kubeStats.percentage).toBe(0);
    });
  });

  describe('4. Derived Progress Calculations & Next Lesson', () => {
    it('computes accurate total, completed, remaining, and percentage', () => {
      const def = createDefaultProgress();
      const lessons = getCourseLessons('dockforge');
      expect(lessons.length).toBe(42);

      // Complete 21 of 42 lessons
      const halfIds = lessons.slice(0, 21).map((l) => l.id);
      def.academies.dockforge.completedLessonIds = halfIds;

      const stats = calculateCourseProgress('dockforge', def.academies.dockforge);
      expect(stats.totalLessons).toBe(42);
      expect(stats.completedLessons).toBe(21);
      expect(stats.remainingLessons).toBe(21);
      expect(stats.percentage).toBe(50);
      expect(stats.nextLessonId).toBe(lessons[21].id);
      expect(stats.nextLessonTitle).toBe(lessons[21].title);
    });

    it('computes accurate topic progress', () => {
      const def = createDefaultProgress();
      // Topic 1 has 4 concepts in DockForge: c-what-are-containers, c-why-need-containers, c-baremetal-vm-containers, c-docker-and-oci
      def.academies.dockforge.completedLessonIds = ['c-what-are-containers', 'c-why-need-containers'];

      const topicStats = calculateTopicProgress('dockforge', 'topic-01', def.academies.dockforge);
      expect(topicStats.totalLessons).toBe(4);
      expect(topicStats.completedLessons).toBe(2);
      expect(topicStats.percentage).toBe(50);
    });
  });

  describe('5. Storage Quota & Corrupt JSON Safety', () => {
    it('gracefully recovers when localStorage contains malformed JSON', async () => {
      mockStorageData[PROGRESS_STORAGE_KEY_V1] = '{ invalid json !! corrupt';
      const storage = new LocalStorageProgressStorage(PROGRESS_STORAGE_KEY_V1);

      const loaded = await storage.load();
      expect(loaded).toBeNull();

      const manager = new ProgressManager(storage);
      await manager.initialize();
      expect(manager.getIsLoaded()).toBe(true);
      expect(manager.getState().version).toBe(1);
    });

    it('handles localStorage QuotaExceededError without throwing', async () => {
      const storage = new LocalStorageProgressStorage('test:quota');
      mockLocalStorage.setItem.mockImplementationOnce(() => {
        const error = new Error('Quota exceeded');
        error.name = 'QuotaExceededError';
        throw error;
      });

      const def = createDefaultProgress();
      await expect(storage.save(def)).resolves.not.toThrow();
    });
  });

  describe('6. Legacy Migration', () => {
    it('automatically migrates legacy podforge_completed localStorage key', async () => {
      mockStorageData['podforge_completed'] = JSON.stringify(['c-k8s-overview', 'c-k8s-why-use']);

      const storage = new LocalStorageProgressStorage('test:migration');
      const manager = new ProgressManager(storage);
      await manager.initialize();

      const podStats = manager.getCourseStats('podforge');
      expect(podStats.completedLessons).toBe(2);
      expect(manager.getAcademyProgress('podforge').completedLessonIds).toContain('c-k8s-overview');
      expect(manager.getAcademyProgress('podforge').completedLessonIds).toContain('c-k8s-why-use');
    });
  });

  describe('7. Reset & Export / Import Progress', () => {
    it('resets progress back to default 0%', async () => {
      const storage = new LocalStorageProgressStorage('test:reset');
      const manager = new ProgressManager(storage);
      await manager.initialize();

      manager.completeLesson('dockforge', 'c-what-are-containers');
      expect(manager.getCourseStats('dockforge').completedLessons).toBe(1);

      await manager.resetProgress();
      expect(manager.getCourseStats('dockforge').completedLessons).toBe(0);
      expect(manager.getAcademyProgress('dockforge').completedLessonIds).toEqual([]);
    });

    it('exports and imports progress with complete roundtrip fidelity', async () => {
      const storage1 = new LocalStorageProgressStorage('test:export');
      const manager1 = new ProgressManager(storage1);
      await manager1.initialize();

      manager1.completeLesson('commitforge', 'c-what-is-vcs');
      manager1.completeLesson('dockforge', 'c-what-are-containers');
      manager1.completeLesson('podforge', 'c-k8s-overview');

      const json = manager1.exportProgress();
      expect(typeof json).toBe('string');

      // Create new fresh manager and import
      const storage2 = new LocalStorageProgressStorage('test:import');
      const manager2 = new ProgressManager(storage2);
      await manager2.initialize();

      expect(manager2.getCourseStats('commitforge').completedLessons).toBe(0);

      const importResult = await manager2.importProgress(json);
      expect(importResult.success).toBe(true);

      expect(manager2.getCourseStats('commitforge').completedLessons).toBe(1);
      expect(manager2.getCourseStats('dockforge').completedLessons).toBe(1);
      expect(manager2.getCourseStats('podforge').completedLessons).toBe(1);
    });

    it('rejects invalid JSON string during import', async () => {
      const storage = new LocalStorageProgressStorage('test:import-bad');
      const manager = new ProgressManager(storage);
      await manager.initialize();

      const result = await manager.importProgress('not-valid-json');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
