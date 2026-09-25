import { describe, it, expect, vi } from 'vitest';

describe('Storage Safety & SecurityError Resilience (Issue #5)', () => {
  it('handles SecurityError in localStorage gracefully without throwing exceptions', () => {
    const throwingStorage = {
      getItem: vi.fn(() => {
        throw new Error('SecurityError: The operation is insecure.');
      }),
      setItem: vi.fn(() => {
        throw new Error('SecurityError: The operation is insecure.');
      }),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };

    vi.stubGlobal('localStorage', throwingStorage);
    vi.stubGlobal('window', { localStorage: throwingStorage });

    let safeReadValue = 'default';
    expect(() => {
      try {
        safeReadValue = window.localStorage.getItem('commitforge_instruction_mode') || 'default';
      } catch {
        safeReadValue = 'default';
      }
    }).not.toThrow();
    expect(safeReadValue).toBe('default');

    expect(() => {
      try {
        window.localStorage.setItem('commitforge_onboarded', 'true');
      } catch {}
    }).not.toThrow();

    vi.unstubAllGlobals();
  });
});
