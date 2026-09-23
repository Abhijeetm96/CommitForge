// src/progress/progressMigration.ts
import { ForgeSuiteProgress, CourseProgress, AcademyId } from './progressTypes';

export const CURRENT_PROGRESS_VERSION = 1;

/**
 * Creates a clean, initialized default ForgeSuiteProgress state.
 */
export function createDefaultCourseProgress(academyId: AcademyId): CourseProgress {
  return {
    academyId,
    completedLessonIds: [],
    startedLessonIds: [],
    lessons: {},
    achievements: [],
    lastVisitedAt: new Date().toISOString(),
  };
}

export function createDefaultProgress(): ForgeSuiteProgress {
  return {
    version: CURRENT_PROGRESS_VERSION,
    academies: {
      commitforge: createDefaultCourseProgress('commitforge'),
      dockforge: createDefaultCourseProgress('dockforge'),
      podforge: createDefaultCourseProgress('podforge'),
    },
    preferences: {
      lastAcademy: 'commitforge',
    },
  };
}

/**
 * Checks for legacy localStorage data from older individual academy implementations
 * and merges them seamlessly into the v1 ForgeSuiteProgress structure.
 */
export function detectAndMigrateLegacyStorage(progress: ForgeSuiteProgress): ForgeSuiteProgress {
  if (typeof window === 'undefined' || !window.localStorage) {
    return progress;
  }

  let mutated = false;
  const migrated = { ...progress };

  // 1. PodForge legacy: `podforge_completed` was stored as a JSON string array of IDs
  try {
    const rawPod = window.localStorage.getItem('podforge_completed');
    if (rawPod) {
      const parsedPod = JSON.parse(rawPod);
      if (Array.isArray(parsedPod) && parsedPod.length > 0) {
        const podCourse = migrated.academies.podforge || createDefaultCourseProgress('podforge');
        const mergedSet = new Set([...podCourse.completedLessonIds, ...parsedPod]);
        const newCompleted = Array.from(mergedSet);

        if (newCompleted.length > podCourse.completedLessonIds.length) {
          podCourse.completedLessonIds = newCompleted;
          // Ensure lessons dictionary has entries
          newCompleted.forEach((id) => {
            if (!podCourse.lessons[id]) {
              podCourse.lessons[id] = {
                lessonId: id,
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
                completedAt: new Date().toISOString(),
              };
            }
          });
          migrated.academies.podforge = podCourse;
          mutated = true;
        }
      }
    }
  } catch (err) {
    console.warn('[ProgressMigration] Error scanning legacy podforge_completed:', err);
  }

  return mutated ? migrated : progress;
}

/**
 * Validates and migrates any arbitrary loaded JSON payload to the current ForgeSuiteProgress schema.
 */
export function migrateProgress(raw: any): ForgeSuiteProgress {
  if (!raw || typeof raw !== 'object') {
    return createDefaultProgress();
  }

  const defaultProgress = createDefaultProgress();

  // Validate version
  const rawVersion = typeof raw.version === 'number' ? raw.version : 1;
  const academies = raw.academies || {};

  const ensureAcademy = (id: AcademyId): CourseProgress => {
    const rawAcademy = academies[id];
    if (!rawAcademy || typeof rawAcademy !== 'object') {
      return createDefaultCourseProgress(id);
    }
    return {
      academyId: id,
      currentTopicId: typeof rawAcademy.currentTopicId === 'string' ? rawAcademy.currentTopicId : undefined,
      currentLessonId: typeof rawAcademy.currentLessonId === 'string' ? rawAcademy.currentLessonId : undefined,
      completedLessonIds: Array.isArray(rawAcademy.completedLessonIds) ? rawAcademy.completedLessonIds : [],
      startedLessonIds: Array.isArray(rawAcademy.startedLessonIds) ? rawAcademy.startedLessonIds : [],
      lessons: typeof rawAcademy.lessons === 'object' && rawAcademy.lessons !== null ? rawAcademy.lessons : {},
      achievements: Array.isArray(rawAcademy.achievements) ? rawAcademy.achievements : [],
      lastVisitedAt: typeof rawAcademy.lastVisitedAt === 'string' ? rawAcademy.lastVisitedAt : undefined,
    };
  };

  const migrated: ForgeSuiteProgress = {
    version: Math.max(rawVersion, CURRENT_PROGRESS_VERSION),
    academies: {
      commitforge: ensureAcademy('commitforge'),
      dockforge: ensureAcademy('dockforge'),
      podforge: ensureAcademy('podforge'),
    },
    preferences: {
      lastAcademy: raw.preferences?.lastAcademy || 'commitforge',
      lastRoute: raw.preferences?.lastRoute,
    },
  };

  // Perform any legacy key imports
  return detectAndMigrateLegacyStorage(migrated);
}
