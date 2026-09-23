// src/progress/progressTypes.ts

/**
 * Supported learning academy identifiers across ForgeSuite.
 */
export type AcademyId = 'commitforge' | 'dockforge' | 'podforge';

/**
 * Status of an individual lesson/concept.
 */
export type LessonStatus = 'not_started' | 'in_progress' | 'completed';

/**
 * Granular learner progress milestones within a single lesson or concept.
 * 
 * SECURITY NOTICE:
 * This state is offline, persistent, and private to the user's browser.
 * It is NOT authenticated or cryptographically verified.
 * Never use this state for security-sensitive authorizations, backend access, or paid certificates.
 */
export interface LessonProgress {
  lessonId: string;
  status: LessonStatus;

  // Conceptual & pedagogical section milestones
  conceptViewed: boolean;
  definitionViewed: boolean;
  diagramViewed: boolean;

  // Syntax & command exploration
  syntaxExplored: boolean;
  examplesViewed: boolean;

  // Interactive Simulator execution
  simulatorStarted: boolean;
  simulatorCompleted: boolean;

  // Hands-on Challenge / Quiz / Assessment
  challengeStarted: boolean;
  challengeCompleted: boolean;

  // Quantitative learning telemetry
  attempts: number;
  mistakes: number;
  score?: number; // e.g. 0-100 challenge or quiz score
  masteryPercent: number; // 0 to 100 derived mastery score

  // Timestamps (ISO strings)
  firstStartedAt?: string;
  lastVisitedAt?: string;
  completedAt?: string;
}

/**
 * Complete learner state for a specific academy course.
 */
export interface CourseProgress {
  academyId: AcademyId;
  currentTopicId?: string;
  currentLessonId?: string;
  completedLessonIds: string[];
  startedLessonIds: string[];
  lessons: Record<string, LessonProgress>;
  achievements: string[];
  lastVisitedAt?: string;
}

/**
 * Top-level persistent state container across all of ForgeSuite.
 */
export interface ForgeSuiteProgress {
  version: number;
  academies: Record<AcademyId, CourseProgress>;
  preferences?: {
    lastAcademy?: AcademyId;
    lastRoute?: string;
  };
}

/**
 * Abstract course lesson summary definition extracted from curriculum sources.
 */
export interface AcademyLessonSummary {
  id: string;
  title: string;
  topicId: string;
  topicTitle: string;
}

/**
 * Real-time computed progress metrics for an entire course.
 */
export interface CourseStats {
  totalLessons: number;
  completedLessons: number;
  startedLessons: number;
  remainingLessons: number;
  percentage: number;
  currentLessonId?: string;
  nextLessonId?: string;
  nextLessonTitle?: string;
}

/**
 * Real-time computed progress metrics for a specific topic within a course.
 */
export interface TopicStats {
  topicId: string;
  title: string;
  totalLessons: number;
  completedLessons: number;
  inProgressLessons: number;
  percentage: number;
}
