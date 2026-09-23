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
