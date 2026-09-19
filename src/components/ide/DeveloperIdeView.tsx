import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CodeEditor } from '../editor/CodeEditor';
import { Terminal } from '../terminal/Terminal';
import {
  Folder,
  FileCode,
  FileText,
  GitBranch,
  File,
  Code,
  CheckCircle2,
  Terminal as TerminalIcon,
  Play,
  Maximize2,
  Minus,
  X,
} from 'lucide-react';

export const DeveloperIdeView: React.FC = () => {
  const { repo, activeFile, openFileTab, engine, executeCommand } = useApp();
  const [activeBottomTab, setActiveBottomTab] = useState<'terminal' | 'output'>('terminal');

  const files = Object.keys(repo.workingDirectory);
  const branches = Object.keys(repo.branches);
  const currentBranch = repo.head.type === 'branch' ? repo.head.ref : 'detached';

  // Changed files
  const changedFiles = files.filter(
    (f) => repo.index[f] !== undefined && repo.workingDirectory[f] !== repo.index[f]
  );
  const untrackedFiles = files.filter((f) => repo.index[f] === undefined);

  return (
    <div
      className="ide-container"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 60px)',
        background: 'var(--bg-app)',
        color: 'var(--text-primary)',
        overflow: 'hidden',
      }}
    >
      {/* Top Workspace Section (Split into 3 panels: Files, Editor, Git) */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '220px 1fr 240px',
          borderBottom: '1px solid var(--border-color)',
          overflow: 'hidden',
        }}
        className="ide-3panel-grid"
      >
        {/* Left Panel: Project Files */}
        <div
          className="ide-files-panel"
          style={{
            background: 'var(--bg-surface)',
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              padding: '0.65rem 1rem',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            Project Files
          </div>

          <div style={{ padding: '0.75rem' }}>
            {/* Root Folder */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '0.4rem',
              }}
            >
              <Folder size={15} color="#38bdf8" />
              <span>my-website</span>
            </div>

            {/* Nested Files */}
            <div style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              {files.map((file) => {
                const isActive = activeFile === file;
                return (
                  <div
                    key={file}
                    onClick={() => openFileTab(file)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.35rem 0.6rem',
                      borderRadius: '4px',
                      background: isActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                      color: isActive ? '#38bdf8' : 'var(--text-secondary)',
                      fontSize: '0.82rem',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    <FileText size={14} />
                    <span>{file}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center Panel: Code Editor */}
        <div className="ide-editor-panel" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <CodeEditor />
        </div>

        {/* Right Panel: Git (Branches & Changes) */}
        <div
          className="ide-git-panel"
          style={{
            background: 'var(--bg-surface)',
            borderLeft: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              padding: '0.65rem 1rem',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            Git
          </div>

          {/* Branches Section */}
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Branches
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {branches.map((b) => {
                const isCurrent = b === currentBranch;
                return (
                  <div
                    key={b}
                    onClick={() => executeCommand(`git switch ${b}`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.82rem',
                      color: isCurrent ? '#38bdf8' : '#94a3b8',
                      fontWeight: isCurrent ? 700 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    <GitBranch size={13} color={isCurrent ? '#38bdf8' : '#64748b'} />
                    <span>{b}</span>
                    {isCurrent && <span style={{ fontSize: '0.65rem', color: '#10b981' }}>✓</span>}
                  </div>
                );
              })}
              {!branches.includes('feature/login') && (
                <div
                  onClick={() => executeCommand('git branch feature/login')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.82rem',
                    color: '#64748b',
                    cursor: 'pointer',
                  }}
                  title="Click to create branch"
                >
                  <GitBranch size={13} color="#64748b" />
                  <span>feature/login</span>
                </div>
              )}
            </div>
          </div>

          {/* Changes Section */}
          <div style={{ padding: '0.75rem 1rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Changes
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {changedFiles.length === 0 && untrackedFiles.length === 0 ? (
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>No changes</div>
              ) : (
                <>
                  {changedFiles.map((f) => (
                    <div
                      key={f}
                      onClick={() => openFileTab(f)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.82rem',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <FileText size={13} color="var(--text-muted)" />
                        <span>{f}</span>
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#f59e0b' }}>M</span>
                    </div>
                  ))}
                  {untrackedFiles.map((f) => (
                    <div
                      key={f}
                      onClick={() => openFileTab(f)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.82rem',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <FileText size={13} color="var(--text-muted)" />
                        <span>{f}</span>
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#38bdf8' }}>U</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Panel: Terminal & Output Tabs */}
      <div style={{ height: '240px', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
        <div
          style={{
            height: '34px',
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 1rem',
            gap: '1rem',
          }}
        >
          <button
            onClick={() => setActiveBottomTab('terminal')}
            style={{
              background: 'none',
              border: 'none',
              color: activeBottomTab === 'terminal' ? '#38bdf8' : 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <TerminalIcon size={14} /> Terminal
          </button>

          <button
            onClick={() => setActiveBottomTab('output')}
            style={{
              background: 'none',
              border: 'none',
              color: activeBottomTab === 'output' ? '#38bdf8' : 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Output
          </button>
        </div>

        <div style={{ flex: 1, overflow: 'hidden' }}>
          {activeBottomTab === 'terminal' ? (
            <Terminal />
          ) : (
            <div style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.85rem', color: '#94a3b8' }}>
              CommitForge v2.0 Execution Environment ready.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
