// src/progress/progressCalculator.ts
import {
  AcademyId,
  CourseProgress,
  LessonProgress,
  CourseStats,
  TopicStats,
  AcademyLessonSummary,
} from './progressTypes';
import { ACADEMY_18_TOPICS } from '../commitforge/data/unifiedAcademyData';
import { DOCKER_14_TOPICS } from '../dockforge/data/unifiedDockerData';
import { KUBE_CHAPTERS } from '../podforge/data/topics/index';

/**
 * Extracts a flattened list of all lessons/concepts for a given academy.
 */
export function getCourseLessons(academyId: AcademyId): AcademyLessonSummary[] {
  switch (academyId) {
    case 'commitforge':
      return ACADEMY_18_TOPICS.flatMap((topic) =>
        topic.concepts.map((concept) => ({
          id: concept.id,
          title: concept.title,
          topicId: topic.id,
          topicTitle: topic.title,
        }))
      );

    case 'dockforge':
      return DOCKER_14_TOPICS.flatMap((topic) =>
        topic.concepts.map((concept) => ({
          id: concept.id,
          title: concept.title,
          topicId: topic.id,
          topicTitle: topic.title,
        }))
      );

    case 'podforge':
      return KUBE_CHAPTERS.flatMap((chapter) =>
        chapter.concepts.map((concept) => ({
          id: concept.id,
          title: concept.title,
          topicId: chapter.id,
          topicTitle: chapter.title,
        }))
      );

    default:
      return [];
  }
}

/**
 * Calculates granular 0-100% mastery for an individual lesson based on its interactive section completions.
 */
export function calculateLessonMastery(progress?: LessonProgress): number {
  if (!progress) return 0;
  if (progress.status === 'completed') return 100;

  let score = 0;
  if (progress.conceptViewed) score += 15;
  if (progress.definitionViewed) score += 10;
  if (progress.diagramViewed) score += 10;
  if (progress.syntaxExplored) score += 15;
  if (progress.examplesViewed) score += 5;

  if (progress.simulatorCompleted) {
    score += 25;
  } else if (progress.simulatorStarted) {
    score += 10;
  }

  if (progress.challengeCompleted) {
    score += 20;
  } else if (progress.challengeStarted) {
    score += 10;
  }

  return Math.min(100, score);
}

/**
 * Derives comprehensive real-time course statistics by cross-referencing
 * static curriculum content with the learner's state.
 */
export function calculateCourseProgress(
  academyId: AcademyId,
  courseProgress?: CourseProgress
): CourseStats {
  const allLessons = getCourseLessons(academyId);
  const totalLessons = allLessons.length;

  if (totalLessons === 0) {
    return {
      totalLessons: 0,
      completedLessons: 0,
      startedLessons: 0,
      remainingLessons: 0,
      percentage: 0,
    };
  }

  const completedSet = new Set(courseProgress?.completedLessonIds || []);
  const startedSet = new Set(courseProgress?.startedLessonIds || []);

  const completedCount = allLessons.filter((l) => completedSet.has(l.id)).length;
  const startedCount = allLessons.filter((l) => startedSet.has(l.id) && !completedSet.has(l.id)).length;
  const remainingCount = totalLessons - completedCount;
  const percentage = Math.min(100, Math.round((completedCount / totalLessons) * 100));

  // Determine the next recommended uncompleted lesson
  const nextLesson = allLessons.find((l) => !completedSet.has(l.id));

  return {
    totalLessons,
    completedLessons: completedCount,
    startedLessons: startedCount,
    remainingLessons: remainingCount,
    percentage,
    currentLessonId: courseProgress?.currentLessonId || allLessons[0]?.id,
    nextLessonId: nextLesson?.id,
    nextLessonTitle: nextLesson?.title,
  };
}

/**
 * Computes progress metrics for an individual topic/chapter.
 */
export function calculateTopicProgress(
  academyId: AcademyId,
  topicId: string,
  courseProgress?: CourseProgress
): TopicStats {
  const allLessons = getCourseLessons(academyId);
  const topicLessons = allLessons.filter((l) => l.topicId === topicId);
  const totalLessons = topicLessons.length;
  const topicTitle = topicLessons[0]?.topicTitle || topicId;

  if (totalLessons === 0) {
    return {
      topicId,
      title: topicTitle,
      totalLessons: 0,
      completedLessons: 0,
      inProgressLessons: 0,
      percentage: 0,
    };
  }

  const completedSet = new Set(courseProgress?.completedLessonIds || []);
  const startedSet = new Set(courseProgress?.startedLessonIds || []);

  const completedCount = topicLessons.filter((l) => completedSet.has(l.id)).length;
  const inProgressCount = topicLessons.filter((l) => startedSet.has(l.id) && !completedSet.has(l.id)).length;
  const percentage = Math.min(100, Math.round((completedCount / totalLessons) * 100));

  return {
    topicId,
    title: topicTitle,
    totalLessons,
    completedLessons: completedCount,
    inProgressLessons: inProgressCount,
    percentage,
  };
}
