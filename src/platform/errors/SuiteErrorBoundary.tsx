import React from 'react';
import { AlertTriangle, RefreshCw, Home, Copy, Check, Terminal } from 'lucide-react';
import { getBaseUrl } from '../routing/urlRouter';

interface Props {
  children: React.ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  copied: boolean;
}

export class SuiteErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    copied: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    console.error('[SuiteErrorBoundary] Uncaught application exception:', error, errorInfo);
  }

  private handleReset = () => {
    const nextState: State = { hasError: false, error: null, errorInfo: null, copied: false };
    this.setState(nextState);
    Object.assign(this.state, nextState);
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleReturnHome = () => {
    const base = getBaseUrl();
    window.location.href = base;
  };

  private handleClearStorageAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  };

  private handleCopyTrace = () => {
    const errorText = `Error: ${this.state.error?.message || 'Unknown error'}\n\nStack:\n${this.state.error?.stack || ''}\n\nComponent Stack:\n${this.state.errorInfo?.componentStack || ''}`;
    navigator.clipboard.writeText(errorText);
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 2000);
  };

  public render() {
    if (this.state.hasError) {
      const title = this.props.fallbackTitle || 'Forge Suite View Encountered an Exception';

      return (
        <div
          style={{
            flex: 1,
            minHeight: 'calc(100vh - 60px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(ellipse at top, #0f172a 0%, #030712 100%)',
            padding: '1.5rem',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '640px',
              background: '#090e1f',
              border: '1.5px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.7), 0 0 32px rgba(239, 68, 68, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              color: '#f8fafc',
            }}
          >
            {/* Header Icon + Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1.5px solid rgba(239, 68, 68, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f87171',
                  flexShrink: 0,
                }}
              >
                <AlertTriangle size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                  {title}
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0.2rem 0 0' }}>
                  The application captured this error to prevent a total session crash.
                </p>
              </div>
            </div>

            {/* Error Message Box */}
            <div
              style={{
                background: '#030712',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                fontFamily: 'monospace',
                fontSize: '0.82rem',
                color: '#fca5a5',
                overflowX: 'auto',
              }}
            >
              <strong>{this.state.error?.name || 'Error'}:</strong> {this.state.error?.message || 'Unknown runtime error'}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
              <button
                onClick={this.handleReset}
                style={{
                  flex: 1,
                  minWidth: '130px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  padding: '0.6rem 1rem',
                  background: '#38bdf8',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#030712',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <RefreshCw size={15} />
                Try Again
              </button>

              <button
                onClick={this.handleReturnHome}
                style={{
                  flex: 1,
                  minWidth: '130px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  padding: '0.6rem 1rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Home size={15} />
                Return Home
              </button>

              <button
                onClick={this.handleCopyTrace}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  padding: '0.6rem 0.85rem',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#94a3b8',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
                title="Copy error details for debugging"
              >
                {this.state.copied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                <span>{this.state.copied ? 'Copied' : 'Copy Trace'}</span>
              </button>
            </div>

            {/* Collapsible Diagnostics Stack */}
            {this.state.errorInfo?.componentStack && (
              <details
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.74rem',
                  color: '#94a3b8',
                }}
              >
                <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#cbd5e1' }}>
                  Component Stack Trace
                </summary>
                <pre
                  style={{
                    margin: '0.6rem 0 0',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    fontSize: '0.72rem',
                    color: '#64748b',
                    maxHeight: '160px',
                    overflowY: 'auto',
                  }}
                >
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
