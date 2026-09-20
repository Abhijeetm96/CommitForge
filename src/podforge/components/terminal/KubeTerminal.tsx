import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Terminal as TermIcon, Trash2 } from 'lucide-react';

export const KubeTerminal: React.FC<{ autoFocus?: boolean }> = ({ autoFocus = false }) => {
  const { terminalHistory, executeCommand, clearTerminal } = useApp();
  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const userCommands = terminalHistory
    .map((h) => h.command)
    .filter((c): c is string => typeof c === 'string');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmed = inputVal.trim();
      if (!trimmed) return;
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

  return (
    <div
      ref={containerRef}
      className="terminal-container"
      onClick={() => inputRef.current?.focus()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
    >
      {/* Terminal Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '0.5rem',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '0.65rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--k8s-cyan)', fontSize: '0.76rem', fontWeight: 700 }}>
          <TermIcon size={14} />
          <span>kubectl v1.31.0 • podforge-cluster</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            clearTerminal();
          }}
          title="Clear terminal"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Output History */}
      <div style={{ flex: 1 }}>
        {terminalHistory.map((item, idx) => (
          <div key={idx} className="terminal-line">
            {item.command && (
              <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                <span style={{ color: 'var(--k8s-cyan)', fontWeight: 700 }}>dev@podforge</span>
                <span style={{ color: 'var(--text-muted)' }}>:~$ </span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{item.command}</span>
              </div>
            )}
            {item.stdout &&
              item.stdout.map((line, lIdx) => (
                <div key={lIdx} style={{ color: '#e2e8f0', whiteSpace: 'pre' }}>
                  {line}
                </div>
              ))}
            {item.stderr &&
              item.stderr.map((line, lIdx) => (
                <div key={lIdx} style={{ color: 'var(--k8s-red)', whiteSpace: 'pre-wrap' }}>
                  {line}
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* Input Prompt */}
      <div className="terminal-prompt-line">
        <span className="terminal-prompt">dev@podforge:~$</span>
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
          aria-label="kubectl command line input"
          placeholder="Type a command (e.g. kubectl get pods, kubectl get nodes)..."
        />
      </div>
    </div>
  );
};
