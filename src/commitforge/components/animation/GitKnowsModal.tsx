import React from 'react';
import { GitRepo } from '../../git-engine/types';
import { deriveVisualSnapshot } from './gitPhysics';
import { X, CheckCircle2, AlertCircle, FileText, GitBranch, Cloud, Database } from 'lucide-react';

interface GitKnowsModalProps {
  repo: GitRepo;
  onClose: () => void;
}

export const GitKnowsModal: React.FC<GitKnowsModalProps> = ({ repo, onClose }) => {
  const snapshot = deriveVisualSnapshot(repo);
  const currentBranch = repo.head.type === 'branch' ? repo.head.ref : 'main';
  const headCommit = repo.head.type === 'branch'
    ? repo.branches[currentBranch]?.targetCommitHash
    : repo.head.ref;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          background: '#0e172a',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '16px',
          maxWidth: '750px',
          width: '100%',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#131d33',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              🧠
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
                What Does Git Know Right Now?
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Authoritative internal state observed directly from GitEngine
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body content */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Grid of Knowledge Areas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {/* Area 1: Working Tree */}
            <div
              style={{
                background: '#131d33',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <FileText size={16} color="#f59e0b" />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase' }}>
                  1. Working Tree (Your Desk)
                </span>
              </div>
              {snapshot.workingTree.length === 0 ? (
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>No files on desk</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {snapshot.workingTree.map((f) => (
                    <div
                      key={f.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.82rem',
                        padding: '0.35rem 0.6rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '6px',
                      }}
                    >
                      <span style={{ fontFamily: 'monospace', color: '#cbd5e1' }}>{f.name}</span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          background:
                            f.status === 'clean'
                              ? 'rgba(16, 185, 129, 0.15)'
                              : f.status === 'modified'
                              ? 'rgba(245, 158, 11, 0.15)'
                              : 'rgba(56, 189, 248, 0.15)',
                          color:
                            f.status === 'clean'
                              ? '#10b981'
                              : f.status === 'modified'
                              ? '#f59e0b'
                              : '#38bdf8',
                        }}
                      >
                        {f.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Area 2: Staging Area */}
            <div
              style={{
                background: '#131d33',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Database size={16} color="#38bdf8" />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase' }}>
                  2. Staging Area (Packing Box)
                </span>
              </div>
              {snapshot.stagingArea.length === 0 ? (
                <div style={{ fontSize: '0.82rem', color: '#64748b', fontStyle: 'italic' }}>
                  Empty (Nothing staged for next commit)
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {snapshot.stagingArea.map((f) => (
                    <div
                      key={f.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.82rem',
                        padding: '0.35rem 0.6rem',
                        background: 'rgba(56, 189, 248, 0.08)',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                        borderRadius: '6px',
                      }}
                    >
                      <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{f.name}</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8' }}>
                        STAGED
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Area 3: Current Branch & HEAD */}
            <div
              style={{
                background: '#131d33',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <GitBranch size={16} color="#a855f7" />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase' }}>
                  3. Active Branch & HEAD
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.84rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>HEAD points to:</span>
                  <span style={{ fontWeight: 800, color: '#38bdf8' }}>
                    {repo.head.type === 'branch' ? `refs/heads/${repo.head.ref}` : 'Detached HEAD'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Target Commit:</span>
                  <span style={{ fontFamily: 'monospace', color: '#f8fafc', fontWeight: 700 }}>
                    {headCommit ? headCommit.slice(0, 7) : 'None'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Total Local Commits:</span>
                  <span style={{ fontWeight: 800, color: '#10b981' }}>
                    {Object.keys(repo.commits).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Area 4: Remote Tracking */}
            <div
              style={{
                background: '#131d33',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Cloud size={16} color="#38bdf8" />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase' }}>
                  4. Remote Tracking (origin)
                </span>
              </div>
              {snapshot.remotes.length === 0 ? (
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>No remotes configured</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.84rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Remote URL:</span>
                    <span style={{ fontFamily: 'monospace', color: '#cbd5e1', fontSize: '0.78rem' }}>
                      {snapshot.remotes[0].url}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>origin/{currentBranch}:</span>
                    <span style={{ fontFamily: 'monospace', color: '#f8fafc', fontWeight: 700 }}>
                      {snapshot.remotes[0].branches[currentBranch]?.slice(0, 7) || 'Unpublished'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Sync Status:</span>
                    <span
                      style={{
                        fontWeight: 800,
                        color: snapshot.remotes[0].isInSync
                          ? '#10b981'
                          : snapshot.remotes[0].isAhead
                          ? '#f59e0b'
                          : '#38bdf8',
                      }}
                    >
                      {snapshot.remotes[0].isInSync
                        ? '✓ In Sync'
                        : snapshot.remotes[0].isAhead
                        ? '▲ Ahead (Ready to Push)'
                        : '▼ Behind (Need to Pull)'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: '#131d33',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
