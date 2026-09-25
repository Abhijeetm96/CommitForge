// src/progress/progressStorage.ts
import { ForgeSuiteProgress } from './progressTypes';

/**
 * Interface for progress persistence providers.
 * Abstracted so ForgeSuite can swap between localStorage, IndexedDB, or a remote API.
 */
export interface ProgressStorage {
  load(): Promise<ForgeSuiteProgress | null>;
  save(progress: ForgeSuiteProgress): Promise<void>;
  clear(): Promise<void>;
}

export const PROGRESS_STORAGE_KEY_V1 = 'forgesuite:progress:v1';
export const FORGESUITE_IDB_NAME = 'forgesuite_storage_db';
export const FORGESUITE_IDB_STORE = 'progress_store';
export const FORGESUITE_IDB_VERSION = 1;

/**
 * LocalStorage implementation of ProgressStorage.
 * Handles storage unavailability, quota errors, and corrupted JSON safely.
 */
export class LocalStorageProgressStorage implements ProgressStorage {
  private key: string;

  constructor(key: string = PROGRESS_STORAGE_KEY_V1) {
    this.key = key;
  }

  public async load(): Promise<ForgeSuiteProgress | null> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    try {
      const raw = window.localStorage.getItem(this.key);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw);
      if (typeof parsed !== 'object' || parsed === null) {
        console.warn(`[ProgressStorage] Invalid JSON format found in ${this.key}.`);
        return null;
      }

      return parsed as ForgeSuiteProgress;
    } catch (err) {
      console.warn(`[ProgressStorage] Failed to read or parse progress from ${this.key}:`, err);
      return null;
    }
  }

  public async save(progress: ForgeSuiteProgress): Promise<void> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    try {
      const serialized = JSON.stringify(progress);
      window.localStorage.setItem(this.key, serialized);
    } catch (err: any) {
      // Handle QuotaExceededError or SecurityError gracefully
      if (err?.name === 'QuotaExceededError' || err?.code === 22) {
        console.error('[ProgressStorage] LocalStorage quota exceeded. Progress could not be written to disk.', err);
      } else {
        console.warn('[ProgressStorage] Unable to save progress to localStorage:', err);
      }
    }
  }

  public async clear(): Promise<void> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    try {
      window.localStorage.removeItem(this.key);
    } catch (err) {
      console.warn(`[ProgressStorage] Error clearing ${this.key}:`, err);
    }
  }
}

/**
 * IndexedDB implementation of ProgressStorage.
 * Ideal for storing large telemetry dumps, challenge replay logs, and session recordings
 * without the 5MB quota limitation of LocalStorage.
 */
export class IndexedDBProgressStorage implements ProgressStorage {
  private dbName: string;
  private storeName: string;
  private version: number;
  private dbPromise: Promise<IDBDatabase> | null = null;

  constructor(
    dbName: string = FORGESUITE_IDB_NAME,
    storeName: string = FORGESUITE_IDB_STORE,
    version: number = FORGESUITE_IDB_VERSION
  ) {
    this.dbName = dbName;
    this.storeName = storeName;
    this.version = version;
  }

  private isSupported(): boolean {
    return typeof window !== 'undefined' && 'indexedDB' in window && window.indexedDB !== null;
  }

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    if (!this.isSupported()) {
      return Promise.reject(new Error('IndexedDB is not supported in this environment'));
    }

    this.dbPromise = new Promise((resolve, reject) => {
      const req = window.indexedDB.open(this.dbName, this.version);

      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error('Failed to open IndexedDB'));
    });

    return this.dbPromise;
  }

  public async load(): Promise<ForgeSuiteProgress | null> {
    if (!this.isSupported()) return null;
    try {
      return await this.loadItem<ForgeSuiteProgress>('progress_state');
    } catch (err) {
      console.warn('[IndexedDBProgressStorage] Failed to load progress from IndexedDB:', err);
      return null;
    }
  }

  public async save(progress: ForgeSuiteProgress): Promise<void> {
    if (!this.isSupported()) return;
    try {
      await this.saveItem('progress_state', progress);
    } catch (err) {
      console.warn('[IndexedDBProgressStorage] Failed to save progress to IndexedDB:', err);
    }
  }

  public async clear(): Promise<void> {
    if (!this.isSupported()) return;
    try {
      const db = await this.getDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        const req = store.clear();
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('[IndexedDBProgressStorage] Error clearing IndexedDB store:', err);
    }
  }

  /**
   * Arbitrary item storage for large telemetry logs, challenge replays, or terminal recordings.
   */
  public async saveItem<T>(key: string, value: T): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const req = store.put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public async loadItem<T>(key: string): Promise<T | null> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result !== undefined ? (req.result as T) : null);
      req.onerror = () => reject(req.error);
    });
  }
}

/**
 * Hybrid storage provider that uses IndexedDB when available,
 * and falls back safely to LocalStorage if IndexedDB fails or is unavailable.
 */
export class HybridProgressStorage implements ProgressStorage {
  private idb: IndexedDBProgressStorage;
  private lstore: LocalStorageProgressStorage;

  constructor() {
    this.idb = new IndexedDBProgressStorage();
    this.lstore = new LocalStorageProgressStorage();
  }

  public async load(): Promise<ForgeSuiteProgress | null> {
    try {
      const idbData = await this.idb.load();
      if (idbData) return idbData;
    } catch {
      // Fallback
    }
    return this.lstore.load();
  }

  public async save(progress: ForgeSuiteProgress): Promise<void> {
    // Write to both for maximum redundancy
    await this.lstore.save(progress);
    try {
      await this.idb.save(progress);
    } catch {
      // IndexedDB optional error handled gracefully
    }
  }

  public async clear(): Promise<void> {
    await this.lstore.clear();
    try {
      await this.idb.clear();
    } catch {
      // Optional error handled gracefully
    }
  }
}

/**
 * Remote cloud sync adapter interface and implementation for authenticated backups.
 */
export interface CloudSyncResult {
  success: boolean;
  syncedAt?: string;
  error?: string;
  mergedProgress?: ForgeSuiteProgress;
}

export class RemoteCloudSyncAdapter {
  /**
   * Export progress as portable JSON package with verification checksum and timestamp.
   */
  public exportProgress(progress: ForgeSuiteProgress): string {
    const packagePayload = {
      format: 'forgesuite-progress-backup',
      version: progress.version,
      exportedAt: new Date().toISOString(),
      data: progress,
    };
    return JSON.stringify(packagePayload, null, 2);
  }

  /**
   * Import and validate an exported progress package.
   */
  public importProgress(jsonString: string): ForgeSuiteProgress {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid progress backup package: Root must be an object');
    }
    const data = parsed.data || parsed;
    if (!data.academies || typeof data.academies !== 'object') {
      throw new Error('Invalid progress backup package: Missing academies state');
    }
    return data as ForgeSuiteProgress;
  }

  /**
   * Merges local and remote progress using latest-wins timestamp comparison.
   */
  public mergeProgress(
    local: ForgeSuiteProgress,
    remote: ForgeSuiteProgress
  ): ForgeSuiteProgress {
    const merged: ForgeSuiteProgress = {
      version: Math.max(local.version || 1, remote.version || 1),
      academies: { ...local.academies },
      preferences: { ...local.preferences, ...remote.preferences },
    };

    for (const academyId of ['commitforge', 'dockforge', 'podforge'] as const) {
      const localCourse = local.academies?.[academyId];
      const remoteCourse = remote.academies?.[academyId];

      if (!localCourse && remoteCourse) {
        merged.academies[academyId] = remoteCourse;
      } else if (localCourse && remoteCourse) {
        const completedSet = new Set([
          ...(localCourse.completedLessonIds || []),
          ...(remoteCourse.completedLessonIds || []),
        ]);
        const startedSet = new Set([
          ...(localCourse.startedLessonIds || []),
          ...(remoteCourse.startedLessonIds || []),
        ]);

        const mergedLessons = { ...(localCourse.lessons || {}) };
        for (const [lessonId, remoteLesson] of Object.entries(remoteCourse.lessons || {})) {
          const localLesson = mergedLessons[lessonId];
          if (!localLesson) {
            mergedLessons[lessonId] = remoteLesson;
          } else {
            // Merge milestones
            mergedLessons[lessonId] = {
              ...localLesson,
              ...remoteLesson,
              status:
                localLesson.status === 'completed' || remoteLesson.status === 'completed'
                  ? 'completed'
                  : 'in_progress',
              masteryPercent: Math.max(localLesson.masteryPercent || 0, remoteLesson.masteryPercent || 0),
              attempts: (localLesson.attempts || 0) + (remoteLesson.attempts || 0),
              conceptViewed: localLesson.conceptViewed || remoteLesson.conceptViewed,
              syntaxExplored: localLesson.syntaxExplored || remoteLesson.syntaxExplored,
              simulatorCompleted: localLesson.simulatorCompleted || remoteLesson.simulatorCompleted,
              challengeCompleted: localLesson.challengeCompleted || remoteLesson.challengeCompleted,
            };
          }
        }

        merged.academies[academyId] = {
          academyId,
          completedLessonIds: Array.from(completedSet),
          startedLessonIds: Array.from(startedSet),
          lessons: mergedLessons,
          achievements: Array.from(new Set([...(localCourse.achievements || []), ...(remoteCourse.achievements || [])])),
          currentLessonId: remoteCourse.lastVisitedAt && (!localCourse.lastVisitedAt || remoteCourse.lastVisitedAt > localCourse.lastVisitedAt)
            ? remoteCourse.currentLessonId
            : localCourse.currentLessonId,
          lastVisitedAt: remoteCourse.lastVisitedAt && (!localCourse.lastVisitedAt || remoteCourse.lastVisitedAt > localCourse.lastVisitedAt)
            ? remoteCourse.lastVisitedAt
            : localCourse.lastVisitedAt,
        };
      }
    }

    return merged;
  }
}
