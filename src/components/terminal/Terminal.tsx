import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { evaluateDanger, CommandDangerInfo } from '../../git-engine/danger';
import { AlertTriangle, ShieldAlert, X, Check, Sparkles } from 'lucide-react';
import { KID_COMMAND_CHIPS } from '../../data/kidMetaphors';

interface TerminalProps {
  autoFocus?: boolean;
}

export const Terminal: React.FC<TerminalProps> = ({ autoFocus = false }) => {
  const {
    repo,
    terminalHistory,
    executeCommand,
    clearTerminal,
    kidMode,
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [dangerModal, setDangerModal] = useState<{ command: string; danger: CommandDangerInfo } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Only scroll the terminal container itself, never outer page
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const userCommands = terminalHistory
    .map(h => h.command)
    .filter((c): c is string => typeof c === 'string');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmed = inputVal.trim();
      if (!trimmed) return;

      // Check danger level
      const danger = evaluateDanger(trimmed);
      if (danger.level === 'HIGH' || danger.level === 'VERY_HIGH') {
        setDangerModal({ command: trimmed, danger });
        return;
      }

      executeCommand(trimmed);
      setInputVal('');
      setHistoryIndex(null);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (userCommands.length === 0) return;
      const nextIdx = historyIndex === null ? userCommands.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(userCommands[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === null) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= userCommands.length) {
        setHistoryIndex(null);
        setInputVal('');
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(userCommands[nextIdx]);
      }
    }
  };

  const handleConfirmDanger = () => {
    if (dangerModal) {
      executeCommand(dangerModal.command);
      setDangerModal(null);
      setInputVal('');
      setHistoryIndex(null);
    }
  };

  const currentBranchLabel = repo.head.type === 'branch'
    ? repo.head.ref
    : `detached@${repo.head.ref.slice(0, 7)}`;

  return (
    <div ref={containerRef} className="terminal-container" onClick={() => inputRef.current?.focus()}>
      {/* Output lines */}
      {terminalHistory.map((item, idx) => (
        <div key={idx} className="terminal-line">
          {item.command && (
            <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
              <span style={{ color: 'var(--git-orange)' }}>developer@commitforge</span>
              <span style={{ color: 'var(--text-muted)' }}>:~/project</span>
              <span style={{ color: 'var(--git-cyan)' }}> ({currentBranchLabel})</span>
              <span style={{ color: 'var(--text-primary)' }}>$ {item.command}</span>
            </div>
          )}
          {item.stdout &&
            item.stdout.map((line, lIdx) => {
              let color = 'var(--terminal-text)';
              if (line.includes('warning') || line.includes('WARNING') || line.includes('Note:')) {
                color = 'var(--warning)';
              } else if (line.includes('error') || line.includes('fatal:') || line.includes('CONFLICT')) {
                color = 'var(--danger)';
              } else if (line.includes('Fast-forward') || line.includes('clean') || line.includes('Switched') || line.includes('Initialized')) {
                color = 'var(--success)';
              } else if (line.startsWith('\tmodified:') || line.includes('Changes not staged')) {
                color = 'var(--warning)';
              } else if (line.startsWith('\tnew file:') || line.includes('Changes to be committed')) {
                color = 'var(--success)';
              } else if (line.includes('Untracked files')) {
                color = 'var(--git-cyan)';
              }
              return (
                <div key={lIdx} style={{ color, whiteSpace: 'pre-wrap' }}>
                  {line}
                </div>
              );
            })}
          {item.stderr &&
            item.stderr.map((line, lIdx) => (
              <div key={lIdx} style={{ color: 'var(--danger)', whiteSpace: 'pre-wrap' }}>
                {line}
              </div>
            ))}
        </div>
      ))}

      {/* 🪄 Kid Mode / Beginner Quick Action Chips */}
      {kidMode && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.75rem',
            background: 'rgba(245, 158, 11, 0.08)',
            borderTop: '1px solid rgba(245, 158, 11, 0.2)',
            borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
            overflowX: 'auto',
            flexWrap: 'wrap',
            userSelect: 'none',
          }}
        >
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span>🪄 Magic Wand:</span>
          </span>
          {KID_COMMAND_CHIPS.map((chip) => (
            <button
              key={chip.cmd}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setInputVal(chip.cmd);
                inputRef.current?.focus();
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                executeCommand(chip.cmd);
                setInputVal('');
              }}
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                border: `1px solid ${chip.color}55`,
                color: chip.color,
                borderRadius: '6px',
                padding: '0.2rem 0.5rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                transition: 'all 0.15s ease',
              }}
              title={`${chip.hint} (Click to fill, double-click to run)`}
            >
              <span>{chip.label}</span>
              <span style={{ opacity: 0.6, fontSize: '0.65rem' }}>({chip.cmd})</span>
            </button>
          ))}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              clearTerminal();
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94a3b8',
              borderRadius: '6px',
              padding: '0.2rem 0.5rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
            title="Clear the terminal screen"
          >
            🧹 Clear
          </button>
        </div>
      )}

      {/* Prompt line */}
      <div className="terminal-prompt-line">
        <span className="terminal-prompt">
          developer@commitforge:<span style={{ color: 'var(--text-muted)' }}>~/project</span>
          <span style={{ color: 'var(--git-cyan)' }}> ({currentBranchLabel})</span>$
        </span>
        <input
          ref={inputRef}
          type="text"
          className="terminal-input"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          spellCheck={false}
          autoComplete="off"
        />
      </div>

      <div ref={terminalEndRef} />

      {/* Danger Confirmation Modal */}
      {dangerModal && (
        <div className="modal-backdrop" onClick={() => setDangerModal(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ borderColor: 'var(--danger)' }}>
            <div className="modal-header">
              <div className="modal-title" style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={22} />
                Risk Warning: {dangerModal.danger.level} Danger Command
              </div>
              <button className="icon-btn" onClick={() => setDangerModal(null)}>
                <X size={16} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg-app)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', color: 'var(--git-orange)', marginBottom: '1rem', fontWeight: 600 }}>
                $ {dangerModal.command}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>What it does:</strong>
                  <p>{dangerModal.danger.whatItDoes}</p>
                </div>
                <div>
                  <strong style={{ color: 'var(--danger)' }}>🚨 What can go wrong:</strong>
                  <p style={{ color: 'var(--text-primary)' }}>{dangerModal.danger.whatCanGoWrong}</p>
                </div>
                <div>
                  <strong style={{ color: 'var(--success)' }}>When it is appropriate:</strong>
                  <p>{dangerModal.danger.whenAppropriate}</p>
                </div>
                <div>
                  <strong style={{ color: 'var(--warning)' }}>When NOT to use it:</strong>
                  <p>{dangerModal.danger.whenNotToUse}</p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                style={{
                  background: 'var(--bg-surface-elevated)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                }}
                onClick={() => setDangerModal(null)}
              >
                Cancel (Keep Changes)
              </button>
              <button
                style={{
                  background: 'var(--danger)',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1.2rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                onClick={handleConfirmDanger}
              >
                I Understand The Risks, Execute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
