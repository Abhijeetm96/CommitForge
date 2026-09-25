import React, { useState, useRef, useEffect } from 'react';
import { useDocker } from '../../context/DockerContext';
import { Terminal as TerminalIcon, Trash2, ArrowRight } from 'lucide-react';

export const DockerTerminal: React.FC = () => {
  const { terminalHistory, executeCommand, clearTerminal } = useDocker();
  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const userCommands = terminalHistory
    .map((h) => h.command)
    .filter((c): c is string => typeof c === 'string' && c.trim().length > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    executeCommand(inputVal);
    setInputVal('');
    setHistoryIndex(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
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
      className="docker-terminal"
      onClick={() => inputRef.current?.focus()}
      style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}
    >
      {/* Terminal Bar */}
      <div
        style={{
          height: '34px',
          background: 'rgba(15, 23, 42, 0.9)',
          borderBottom: '1px solid var(--docker-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 0.85rem',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.75rem', color: 'var(--docker-text-secondary)', fontWeight: 700 }}>
          <TerminalIcon size={13} color="var(--docker-blue)" />
          <span>Docker Engine CLI Terminal</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            clearTerminal();
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--docker-text-muted)',
            cursor: 'pointer',
            padding: '0.2rem',
            display: 'flex',
            alignItems: 'center',
          }}
          title="Clear terminal"
          aria-label="Clear terminal output"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Output Stream */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {terminalHistory.map((entry, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {entry.command && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="docker-prompt">user@docker-host:~$</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{entry.command}</span>
              </div>
            )}

            {entry.stdout && entry.stdout.length > 0 && (
              <div style={{ color: '#94a3b8', whiteSpace: 'pre-wrap' }}>
                {entry.stdout.map((line, lIdx) => (
                  <div key={lIdx}>{line}</div>
                ))}
              </div>
            )}

            {entry.stderr && entry.stderr.length > 0 && (
              <div style={{ color: '#ef4444', whiteSpace: 'pre-wrap' }}>
                {entry.stderr.map((line, lIdx) => (
                  <div key={lIdx}>{line}</div>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Command Input Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 0.85rem', background: '#050810', borderTop: '1px solid var(--docker-border)' }}>
        <span className="docker-prompt" style={{ marginRight: '0.5rem' }}>
          $
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Try 'docker ps', 'docker run -d nginx:alpine', or 'docker images'..."
          aria-label="Docker CLI command input"
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            color: '#fff',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.84rem',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          aria-label="Execute command"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--docker-blue)',
            cursor: 'pointer',
            padding: '0.2rem',
          }}
        >
          <ArrowRight size={15} />
        </button>
      </form>
    </div>
  );
};
