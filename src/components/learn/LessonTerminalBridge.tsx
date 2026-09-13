import React, { useState } from 'react';
import { Terminal, CheckCircle2, AlertCircle, ArrowRight, Play, Sparkles } from 'lucide-react';
import { GitEngine } from '../../git-engine/engine';

interface LessonTerminalBridgeProps {
  expectedCommand: string;
  engine: GitEngine;
  onSuccess: () => void;
}

export const LessonTerminalBridge: React.FC<LessonTerminalBridgeProps> = ({
  expectedCommand,
  engine,
  onSuccess,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cmd = inputValue.trim();
    if (!cmd) return;

    // Validate command intent
    const normalizedExpected = expectedCommand.replace(/\s+/g, ' ').trim();
    const normalizedInput = cmd.replace(/\s+/g, ' ').trim();

    // Check if command matches or is an equivalent valid execution
    if (normalizedInput === normalizedExpected || normalizedInput.startsWith(normalizedExpected.split(' ')[0])) {
      if (!engine.getRepo().initialized) {
        engine.execute('git init');
      }
      if (!engine.getRepo().workingDirectory['index.html']) {
        engine.updateFileContent('index.html', '<h1>Hello CommitForge</h1>');
      }
      if (cmd.startsWith('git commit') && Object.keys(engine.getRepo().index).length === 0) {
        engine.execute('git add index.html');
      }
      if (cmd.startsWith('git push')) {
        if (Object.keys(engine.getRepo().commits).length === 0) {
          engine.execute('git add index.html');
          engine.execute('git commit -m "Initial commit"');
        }
        if (!engine.getRepo().remotes['origin']) {
          engine.execute('git remote add origin https://github.com/developer/project.git');
        }
      }
      // Execute directly on the real Git engine
      const result = engine.execute(cmd);
      if (result.exitCode === 0) {
        setIsSuccess(true);
        setErrorFeedback(null);
      } else {
        const errorMsg = result.stderr.join(' ') || 'Git reported an issue executing this command.';
        setErrorFeedback(errorMsg);
      }
    } else {
      setErrorFeedback(`Expected: "${expectedCommand}". Try typing the exact command or click Auto-fill.`);
    }
  };

  const handleAutofill = () => {
    setInputValue(expectedCommand);
  };

  return (
    <div
      style={{
        maxWidth: '680px',
        width: '100%',
        margin: '0 auto',
      }}
    >
      {/* Friendly One-sentence beginner explanation */}
      <div
        style={{
          fontSize: '0.85rem',
          color: '#94a3b8',
          textAlign: 'center',
          marginBottom: '1rem',
        }}
      >
        A <strong>terminal</strong> lets you control your computer and Git by typing commands.
      </div>

      {/* Terminal Window Box */}
      <div
        style={{
          background: '#090d16',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)',
        }}
      >
        {/* Terminal Header Bar */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0.6rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eab308' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '0.5rem', fontFamily: 'monospace' }}>
              bash — commitforge-terminal
            </span>
          </div>

          <button
            onClick={handleAutofill}
            style={{
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '6px',
              padding: '0.2rem 0.6rem',
              color: '#38bdf8',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
            title="Auto-fill recommended command"
          >
            <Sparkles size={12} />
            <span>Auto-fill</span>
          </button>
        </div>

        {/* Terminal Prompt Area */}
        <form onSubmit={handleSubmit} style={{ padding: '1.25rem', margin: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontFamily: 'monospace',
              fontSize: '0.95rem',
            }}
          >
            <span style={{ color: '#22c55e', fontWeight: 700 }}>$</span>
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder={expectedCommand}
              disabled={isSuccess}
              autoFocus
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#f8fafc',
                fontFamily: 'monospace',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
            {!isSuccess && (
              <button
                type="submit"
                style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                  color: '#4ade80',
                  borderRadius: '6px',
                  padding: '0.3rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <Play size={12} />
                <span>Run</span>
              </button>
            )}
          </div>
        </form>

        {/* Error Feedback */}
        {errorFeedback && (
          <div
            style={{
              padding: '0.75rem 1.25rem',
              background: 'rgba(239, 68, 68, 0.1)',
              borderTop: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#fca5a5',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertCircle size={16} />
            <span>{errorFeedback}</span>
          </div>
        )}

        {/* Success Confirmation */}
        {isSuccess && (
          <div
            style={{
              padding: '0.85rem 1.25rem',
              background: 'rgba(34, 197, 94, 0.12)',
              borderTop: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#86efac',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} color="#22c55e" />
              <span>✓ Git command successfully executed on the repository!</span>
            </div>

            <button
              onClick={onSuccess}
              style={{
                padding: '0.45rem 1.1rem',
                borderRadius: '8px',
                background: '#22c55e',
                color: '#0f172a',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>Continue</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
