import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { lazyWithRetry } from '../platform/utils/lazyWithRetry';
import fs from 'fs';
import path from 'path';

describe('lazyWithRetry (Deployment & Stale Chunk Recovery)', () => {
  let mockStorage: Record<string, string> = {};
  let reloadMock = vi.fn();

  beforeEach(() => {
    mockStorage = {};
    reloadMock = vi.fn();

    (globalThis as any).sessionStorage = {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, val: string) => { mockStorage[key] = val; },
      removeItem: (key: string) => { delete mockStorage[key]; },
      clear: () => { mockStorage = {}; },
    };

    (globalThis as any).window = {
      location: {
        reload: reloadMock,
      },
    };
  });

  afterEach(() => {
    delete (globalThis as any).sessionStorage;
    delete (globalThis as any).window;
  });

  it('exports lazyWithRetry function', () => {
    expect(typeof lazyWithRetry).toBe('function');
  });

  it('resolves component cleanly on successful dynamic import', async () => {
    const DummyComponent: React.FC = () => React.createElement('div', null, 'Loaded');
    const LazyComponent = lazyWithRetry(async () => ({ default: DummyComponent }));

    expect(LazyComponent).toBeDefined();
    expect((LazyComponent as any).$$typeof).toBe(Symbol.for('react.lazy'));
  });

  it('automatically triggers window.location.reload upon detecting stale dynamic import chunk error', async () => {
    const chunkError = new TypeError('Failed to fetch dynamically imported module: https://domain/assets/old-chunk.js');
    let attemptCount = 0;

    const LazyComponent = lazyWithRetry(async () => {
      attemptCount++;
      throw chunkError;
    });

    (LazyComponent as any)._payload._result();
    await Promise.resolve();

    expect(attemptCount).toBe(1);
    expect(reloadMock).toHaveBeenCalledTimes(1);
    expect(mockStorage['forgesuite_chunk_retry_timestamp']).toBeDefined();
  });

  it('ensures all App.tsx code-split views use lazyWithRetry', () => {
    const appPath = path.resolve(__dirname, '../App.tsx');
    const appContent = fs.readFileSync(appPath, 'utf-8');
    expect(appContent).toContain('lazyWithRetry');
    expect(appContent).toContain('const DevOpsRoadmapView = lazyWithRetry');
    expect(appContent).toContain('const CommitForgeApp = lazyWithRetry');
    expect(appContent).toContain('const DockForgeApp = lazyWithRetry');
    expect(appContent).toContain('const PodForgeApp = lazyWithRetry');
    expect(appContent).toContain('const UniversalProblemSolver = lazyWithRetry');
  });

  it('ensures main.tsx registers vite:preloadError event listener', () => {
    const mainPath = path.resolve(__dirname, '../main.tsx');
    const mainContent = fs.readFileSync(mainPath, 'utf-8');
    expect(mainContent).toContain("window.addEventListener('vite:preloadError'");
  });
});
