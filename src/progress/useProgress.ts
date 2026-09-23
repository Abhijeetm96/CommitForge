// src/progress/useProgress.ts
import { useMemo, useCallback } from 'react';
import { useProgressContext } from './ProgressContext';
import {
  AcademyId,
  CourseProgress,
  CourseStats,
  LessonProgress,
  AcademyLessonSummary,
} from './progressTypes';

/**
 * Primary hook for interacting with ForgeSuite global progress.
 */
export function useProgress() {
  const { manager, progress, isLoaded, showSettingsModal, setShowSettingsModal } = useProgressContext();

  const resetProgress = useCallback(async () => {
    await manager.resetProgress();
  }, [manager]);

  const exportProgress = useCallback(() => {
    return manager.exportProgress();
  }, [manager]);

  const importProgress = useCallback(
    async (jsonString: string) => {
      return manager.importProgress(jsonString);
    },
    [manager]
  );

  return {
    progress,
    manager,
    isLoaded,
    showSettingsModal,
    openSettings: () => setShowSettingsModal(true),
    closeSettings: () => setShowSettingsModal(false),
    resetProgress,
    exportProgress,
    importProgress,
  };
}

/**
 * Hook for consuming and mutating progress within a specific academy.
 */
export function useAcademyProgress(academyId: AcademyId) {
  const { manager, progress } = useProgressContext();

  const course: CourseProgress = useMemo(() => {
    return progress.academies[academyId] || manager.getAcademyProgress(academyId);
  }, [progress, manager, academyId]);

  const stats: CourseStats = useMemo(() => {
    return manager.getCourseStats(academyId);
  }, [manager, progress, academyId]);

  const nextLesson: AcademyLessonSummary | undefined = useMemo(() => {
    return manager.getNextLesson(academyId);
  }, [manager, progress, academyId]);

  const isLessonCompleted = useCallback(
    (lessonId: string) => {
      return course.completedLessonIds.includes(lessonId);
    },
    [course.completedLessonIds]
  );

  const completeLesson = useCallback(
    (lessonId: string) => {
      manager.completeLesson(academyId, lessonId);
    },
    [manager, academyId]
  );

  const startLesson = useCallback(
    (lessonId: string) => {
      manager.startLesson(academyId, lessonId);
    },
    [manager, academyId]
  );

  return {
    course,
    stats,
    nextLesson,
    completedLessonIds: course.completedLessonIds,
    isLessonCompleted,
    completeLesson,
    startLesson,
  };
}

/**
 * Hook for inspecting and advancing an individual lesson's pedagogical milestones.
 */
export function useLessonProgress(academyId: AcademyId, lessonId: string) {
  const { manager, progress } = useProgressContext();

  const lesson: LessonProgress | undefined = useMemo(() => {
    return progress.academies[academyId]?.lessons[lessonId];
  }, [progress, academyId, lessonId]);

  const isCompleted = lesson?.status === 'completed';
  const isInProgress = lesson?.status === 'in_progress';
  const masteryPercent = lesson?.masteryPercent || 0;

  return {
    lesson,
    isCompleted,
    isInProgress,
    masteryPercent,
    startLesson: () => manager.startLesson(academyId, lessonId),
    markConceptViewed: () => manager.markConceptViewed(academyId, lessonId),
    markDefinitionViewed: () => manager.markDefinitionViewed(academyId, lessonId),
    markDiagramViewed: () => manager.markDiagramViewed(academyId, lessonId),
    markSyntaxExplored: () => manager.markSyntaxExplored(academyId, lessonId),
    completeSimulator: (stats?: { attempts?: number; mistakes?: number }) =>
      manager.completeSimulator(academyId, lessonId, stats),
    completeChallenge: (score?: number) => manager.completeChallenge(academyId, lessonId, score),
    completeLesson: () => manager.completeLesson(academyId, lessonId),
  };
}
