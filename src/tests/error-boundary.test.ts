import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { SuiteErrorBoundary } from '../platform/errors/SuiteErrorBoundary';

describe('SuiteErrorBoundary (Issue #3)', () => {
  it('instantiates cleanly and defines getDerivedStateFromError', () => {
    expect(SuiteErrorBoundary.getDerivedStateFromError).toBeDefined();
    const testError = new Error('Test rendering crash');
    const derived = SuiteErrorBoundary.getDerivedStateFromError(testError);
    expect(derived.hasError).toBe(true);
    expect(derived.error).toBe(testError);
  });

  it('handles error state transitions and renders fallback JSX', () => {
    const boundary = new SuiteErrorBoundary({ children: React.createElement('div', null, 'Hello') });
    expect(boundary.state.hasError).toBe(false);

    const testError = new Error('Visualizer SVG calculation overflow');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    boundary.componentDidCatch(testError, { componentStack: '\n    in TestComponent' });
    errorSpy.mockRestore();

    boundary.state = {
      hasError: true,
      error: testError,
      errorInfo: { componentStack: '\n    in TestComponent' },
      copied: false,
    };

    const rendered = boundary.render();
    expect(rendered).toBeDefined();
    expect(rendered).not.toBe(boundary.props.children);
  });

  it('resets error state when handleReset is invoked', () => {
    const onReset = vi.fn();
    const boundary = new SuiteErrorBoundary({
      children: React.createElement('div', null, 'Hello'),
      onReset,
    });
    boundary.state = {
      hasError: true,
      error: new Error('Simulated Crash'),
      errorInfo: null,
      copied: false,
    };

    (boundary as any).handleReset();
    expect(boundary.state.hasError).toBe(false);
    expect(boundary.state.error).toBeNull();
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
