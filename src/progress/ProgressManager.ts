// src/progress/ProgressManager.ts
import {
  AcademyId,
  CourseProgress,
  LessonProgress,
  ForgeSuiteProgress,
  CourseStats,
  TopicStats,
  AcademyLessonSummary,
} from './progressTypes';
import { ProgressStorage, LocalStorageProgressStorage } from './progressStorage';
import { createDefaultProgress, createDefaultCourseProgress, migrateProgress } from './progressMigration';
import {
  calculateCourseProgress,
  calculateTopicProgress,
  calculateLessonMastery,
  getCourseLessons,
} from './progressCalculator';

export type ProgressListener = (progress: ForgeSuiteProgress) => void;

/**
 * ProgressManager manages in-memory learner state, event subscriptions,
 * debounced storage persistence, and pedagogical progression calculations.
 */
export class ProgressManager {
  private static instance: ProgressManager;
  private storage: ProgressStorage;
  private state: ForgeSuiteProgress;
  private listeners: Set<ProgressListener> = new Set();
  private saveTimeout: any = null;
  private isLoaded: boolean = false;

  constructor(storage?: ProgressStorage) {
    this.storage = storage || new LocalStorageProgressStorage();
    this.state = createDefaultProgress();
  }

  public static getInstance(storage?: ProgressStorage): ProgressManager {
    if (!ProgressManager.instance) {
      ProgressManager.instance = new ProgressManager(storage);
    }
    return ProgressManager.instance;
  }

  /**
   * Initializes the manager by loading stored state, performing any migrations,
   * and notifying subscribers.
   */
  public async initialize(): Promise<void> {
    if (this.isLoaded) return;

    try {
      const stored = await this.storage.load();
      if (stored) {
        this.state = migrateProgress(stored);
      } else {
        this.state = migrateProgress(createDefaultProgress());
        await this.storage.save(this.state);
      }
    } catch (err) {
      console.warn('[ProgressManager] Initialization failed, using default state:', err);
      this.state = createDefaultProgress();
    } finally {
      this.isLoaded = true;
      this.notifyListeners();
    }
  }

  /**
   * Returns whether the manager has finished loading from persistent storage.
   */
  public getIsLoaded(): boolean {
    return this.isLoaded;
  }

  /**
   * Retrieves the raw global progress state.
   */
  public getState(): ForgeSuiteProgress {
    return this.state;
  }

  /**
   * Subscribes a listener callback to state mutations.
   */
  public subscribe(listener: ProgressListener): () => void {
    this.listeners.add(listener);
    // Immediately emit current state to new subscriber
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const currentState = { ...this.state };
    this.listeners.forEach((listener) => {
      try {
        listener(currentState);
      } catch (err) {
        console.error('[ProgressManager] Subscriber notification error:', err);
      }
    });
  }

  /**
   * Schedules debounced persistence to avoid thrashing localStorage during fast simulator actions.
   */
  private scheduleSave(immediate: boolean = false): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }

    if (immediate) {
      this.storage.save(this.state).catch((err) => {
        console.warn('[ProgressManager] Immediate save error:', err);
      });
      return;
    }

    this.saveTimeout = setTimeout(() => {
      this.storage.save(this.state).catch((err) => {
        console.warn('[ProgressManager] Debounced save error:', err);
      });
      this.saveTimeout = null;
    }, 250);
  }

  // ==========================================================================
  // ACADEMY & LESSON PROGRESS READERS
  // ==========================================================================

  public getAcademyProgress(academyId: AcademyId): CourseProgress {
    if (!this.state.academies[academyId]) {
      this.state.academies[academyId] = createDefaultCourseProgress(academyId);
    }
    return this.state.academies[academyId];
  }

  public getCourseStats(academyId: AcademyId): CourseStats {
    return calculateCourseProgress(academyId, this.getAcademyProgress(academyId));
  }

  public getTopicProgress(academyId: AcademyId, topicId: string): TopicStats {
    return calculateTopicProgress(academyId, topicId, this.getAcademyProgress(academyId));
  }

  public getLessonProgress(academyId: AcademyId, lessonId: string): LessonProgress | undefined {
    return this.getAcademyProgress(academyId).lessons[lessonId];
  }

  public getNextLesson(academyId: AcademyId): AcademyLessonSummary | undefined {
    const stats = this.getCourseStats(academyId);
    if (!stats.nextLessonId) return undefined;
    const all = getCourseLessons(academyId);
    return all.find((l) => l.id === stats.nextLessonId);
  }

  private ensureLessonProgress(academyId: AcademyId, lessonId: string): LessonProgress {
    const course = this.getAcademyProgress(academyId);
    if (!course.lessons[lessonId]) {
      course.lessons[lessonId] = {
        lessonId,
        status: 'not_started',
        conceptViewed: false,
        definitionViewed: false,
        diagramViewed: false,
        syntaxExplored: false,
        examplesViewed: false,
        simulatorStarted: false,
        simulatorCompleted: false,
        challengeStarted: false,
        challengeCompleted: false,
        attempts: 0,
        mistakes: 0,
        masteryPercent: 0,
      };
    }
    return course.lessons[lessonId];
  }

  // ==========================================================================
  // PROGRESS MUTATION METHODS
  // ==========================================================================

  public startLesson(academyId: AcademyId, lessonId: string): void {
    const course = this.getAcademyProgress(academyId);
    const lesson = this.ensureLessonProgress(academyId, lessonId);

    const now = new Date().toISOString();
    course.currentLessonId = lessonId;
    course.lastVisitedAt = now;
    lesson.lastVisitedAt = now;

    if (!lesson.firstStartedAt) {
      lesson.firstStartedAt = now;
    }

    if (lesson.status === 'not_started') {
      lesson.status = 'in_progress';
      if (!course.startedLessonIds.includes(lessonId)) {
        course.startedLessonIds.push(lessonId);
      }
    }

    lesson.masteryPercent = calculateLessonMastery(lesson);
    this.notifyListeners();
    this.scheduleSave(false);
  }

  public markConceptViewed(academyId: AcademyId, lessonId: string): void {
    const lesson = this.ensureLessonProgress(academyId, lessonId);
    lesson.conceptViewed = true;
    if (lesson.status === 'not_started') lesson.status = 'in_progress';
    lesson.lastVisitedAt = new Date().toISOString();
    lesson.masteryPercent = calculateLessonMastery(lesson);

    this.notifyListeners();
    this.scheduleSave(false);
  }

  public markDefinitionViewed(academyId: AcademyId, lessonId: string): void {
    const lesson = this.ensureLessonProgress(academyId, lessonId);
    lesson.definitionViewed = true;
    if (lesson.status === 'not_started') lesson.status = 'in_progress';
    lesson.lastVisitedAt = new Date().toISOString();
    lesson.masteryPercent = calculateLessonMastery(lesson);

    this.notifyListeners();
    this.scheduleSave(false);
  }

  public markDiagramViewed(academyId: AcademyId, lessonId: string): void {
    const lesson = this.ensureLessonProgress(academyId, lessonId);
    lesson.diagramViewed = true;
    if (lesson.status === 'not_started') lesson.status = 'in_progress';
    lesson.lastVisitedAt = new Date().toISOString();
    lesson.masteryPercent = calculateLessonMastery(lesson);

    this.notifyListeners();
    this.scheduleSave(false);
  }

  public markSyntaxExplored(academyId: AcademyId, lessonId: string): void {
    const lesson = this.ensureLessonProgress(academyId, lessonId);
    lesson.syntaxExplored = true;
    if (lesson.status === 'not_started') lesson.status = 'in_progress';
    lesson.lastVisitedAt = new Date().toISOString();
    lesson.masteryPercent = calculateLessonMastery(lesson);

    this.notifyListeners();
    this.scheduleSave(false);
  }

  public startSimulator(academyId: AcademyId, lessonId: string): void {
    const lesson = this.ensureLessonProgress(academyId, lessonId);
    lesson.simulatorStarted = true;
    if (lesson.status === 'not_started') lesson.status = 'in_progress';
    lesson.lastVisitedAt = new Date().toISOString();
    lesson.masteryPercent = calculateLessonMastery(lesson);

    this.notifyListeners();
    this.scheduleSave(false);
  }

  public completeSimulator(
    academyId: AcademyId,
    lessonId: string,
    stats?: { attempts?: number; mistakes?: number }
  ): void {
    const lesson = this.ensureLessonProgress(academyId, lessonId);
    lesson.simulatorStarted = true;
    lesson.simulatorCompleted = true;
    if (stats?.attempts) lesson.attempts += stats.attempts;
    if (stats?.mistakes) lesson.mistakes += stats.mistakes;
    lesson.lastVisitedAt = new Date().toISOString();
    lesson.masteryPercent = calculateLessonMastery(lesson);

    this.notifyListeners();
    this.scheduleSave(true);
  }

  public recordAttempt(
    academyId: AcademyId,
    lessonId: string,
    options?: { success?: boolean; mistake?: boolean }
  ): void {
    const lesson = this.ensureLessonProgress(academyId, lessonId);
    lesson.attempts += 1;
    if (options?.mistake) {
      lesson.mistakes += 1;
    }
    lesson.lastVisitedAt = new Date().toISOString();
    this.notifyListeners();
    this.scheduleSave(false);
  }

  public completeChallenge(
    academyId: AcademyId,
    lessonId: string,
    score?: number
  ): void {
    const lesson = this.ensureLessonProgress(academyId, lessonId);
    lesson.challengeStarted = true;
    lesson.challengeCompleted = true;
    if (typeof score === 'number') {
      lesson.score = score;
    }
    lesson.lastVisitedAt = new Date().toISOString();
    lesson.masteryPercent = calculateLessonMastery(lesson);

    this.notifyListeners();
    this.scheduleSave(true);
  }

  public completeLesson(academyId: AcademyId, lessonId: string): void {
    const course = this.getAcademyProgress(academyId);
    const lesson = this.ensureLessonProgress(academyId, lessonId);
    const now = new Date().toISOString();

    lesson.status = 'completed';
    lesson.completedAt = now;
    lesson.lastVisitedAt = now;
    lesson.masteryPercent = 100;

    if (!course.completedLessonIds.includes(lessonId)) {
      course.completedLessonIds.push(lessonId);
    }
    if (!course.startedLessonIds.includes(lessonId)) {
      course.startedLessonIds.push(lessonId);
    }

    course.lastVisitedAt = now;

    this.notifyListeners();
    this.scheduleSave(true);
  }

  // ==========================================================================
  // RESET, EXPORT & IMPORT
  // ==========================================================================

  public async resetProgress(): Promise<void> {
    await this.storage.clear();
    this.state = createDefaultProgress();
    await this.storage.save(this.state);
    this.notifyListeners();
  }

  public exportProgress(): string {
    return JSON.stringify(this.state, null, 2);
  }

  public async importProgress(jsonString: string): Promise<{ success: boolean; error?: string }> {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, error: 'Uploaded file is not a valid JSON object.' };
      }

      const migrated = migrateProgress(parsed);
      this.state = migrated;
      await this.storage.save(this.state);
      this.notifyListeners();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to parse JSON progress.' };
    }
  }
}
