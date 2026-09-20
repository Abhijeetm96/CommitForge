import React, { useState, useRef, useEffect } from 'react';
import { useDocker } from '../../context/DockerContext';
import { Terminal as TerminalIcon, Trash2, ArrowRight } from 'lucide-react';

export const DockerTerminal: React.FC = () => {
  const { terminalHistory, executeCommand, clearTerminal } = useDocker();
  const [inputVal, setInputVal] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    executeCommand(inputVal);
    setInputVal('');
  };

  return (
    <div className="docker-terminal" style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>
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
          onClick={clearTerminal}
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
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Try 'docker ps', 'docker run -d nginx:alpine', or 'docker images'..."
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
