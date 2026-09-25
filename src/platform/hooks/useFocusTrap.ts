// src/platform/hooks/useFocusTrap.ts
import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Traps keyboard Tab navigation within an active modal container.
 * Restores keyboard focus to the triggering element upon modal dismissal.
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(isActive: boolean = true) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    // Cache previously active element to return focus on modal close
    const previouslyFocusedElement = document.activeElement as HTMLElement | null;

    const getFocusableElements = (): HTMLElement[] => {
      return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null || el.offsetWidth > 0 || el.offsetHeight > 0
      );
    };

    const focusables = getFocusableElements();
    if (focusables.length > 0) {
      const autoFocusEl = focusables.find((el) => el.hasAttribute('autofocus'));
      (autoFocusEl || focusables[0]).focus();
    } else {
      container.setAttribute('tabindex', '-1');
      container.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const currentFocusables = getFocusableElements();
      if (currentFocusables.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = currentFocusables[0];
      const lastElement = currentFocusables[currentFocusables.length - 1];

      if (e.shiftKey) {
        // Shift + Tab: if on first element, wrap around to last
        if (document.activeElement === firstElement || !container.contains(document.activeElement)) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: if on last element, wrap around to first
        if (document.activeElement === lastElement || !container.contains(document.activeElement)) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
        previouslyFocusedElement.focus();
      }
    };
  }, [isActive]);

  return containerRef;
}
