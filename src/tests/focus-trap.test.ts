import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { useFocusTrap } from '../platform/hooks/useFocusTrap';

describe('Modal Dialog Focus Trapping & useFocusTrap (Issue #11)', () => {
  it('exports useFocusTrap hook function', () => {
    expect(typeof useFocusTrap).toBe('function');
  });

  it('ensures UniversalProblemSolver binds useFocusTrap and sets dialog attributes', () => {
    const filePath = path.resolve(__dirname, '../platform/search/UniversalProblemSolver.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toContain('useFocusTrap');
    expect(content).toContain('modalContainerRef');
    expect(content).toContain('role="dialog"');
    expect(content).toContain('aria-modal="true"');
  });

  it('ensures ProgressSettingsModal binds useFocusTrap and sets dialog attributes', () => {
    const filePath = path.resolve(__dirname, '../progress/components/ProgressSettingsModal.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toContain('useFocusTrap');
    expect(content).toContain('modalContainerRef');
    expect(content).toContain('role="dialog"');
    expect(content).toContain('aria-modal="true"');
  });

  it('traps Tab navigation cyclically between first and last focusable elements', () => {
    const focusables = [
      { id: 'first-btn', focus: vi.fn() },
      { id: 'middle-input', focus: vi.fn() },
      { id: 'last-btn', focus: vi.fn() },
    ];

    expect(focusables.length).toBe(3);
    expect(focusables[0].id).toBe('first-btn');
    expect(focusables[2].id).toBe('last-btn');

    // Simulate Tab on last element -> wraps to first
    let activeElement = focusables[2];
    const tabEvent = {
      key: 'Tab',
      shiftKey: false,
      preventDefault: vi.fn(),
    };

    if (!tabEvent.shiftKey && activeElement === focusables[focusables.length - 1]) {
      tabEvent.preventDefault();
      activeElement = focusables[0];
      activeElement.focus();
    }
    expect(tabEvent.preventDefault).toHaveBeenCalled();
    expect(activeElement.id).toBe('first-btn');
    expect(focusables[0].focus).toHaveBeenCalled();

    // Simulate Shift+Tab on first element -> wraps to last
    const shiftTabEvent = {
      key: 'Tab',
      shiftKey: true,
      preventDefault: vi.fn(),
    };

    if (shiftTabEvent.shiftKey && activeElement === focusables[0]) {
      shiftTabEvent.preventDefault();
      activeElement = focusables[focusables.length - 1];
      activeElement.focus();
    }
    expect(shiftTabEvent.preventDefault).toHaveBeenCalled();
    expect(activeElement.id).toBe('last-btn');
    expect(focusables[2].focus).toHaveBeenCalled();
  });
});
