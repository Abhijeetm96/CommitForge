import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Folder,
  FileText,
  Database,
  ArrowRight,
  Info,
  ChevronDown,
  Layers,
  Camera,
  CheckCircle2,
  Sparkles,
  Zap,
  Play,
} from 'lucide-react';

export const ThreeAreaVisualizer: React.FC = () => {
  const { repo, openFileTab, executeCommand } = useApp();
  const [viewMode, setViewMode] = useState<'simple' | 'technical'>('simple');

  const workingFiles = Object.keys(repo.workingDirectory);
  const stagedFiles = Object.keys(repo.index);
  const commits = Object.values(repo.commits);

  const isTechnical = viewMode === 'technical';
  const currentBranch = repo.head.type === 'branch' ? repo.head.ref : 'main';
  const headHash = repo.branches[currentBranch]?.targetCommitHash?.slice(0, 7) || 'a3f2e1d';

  return (
    <div
      style={{
        background: '#070b16',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '16px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
              boxShadow: '0 0 12px rgba(56, 189, 248, 0.25)',
            }}
          >
            <Layers size={18} />
          </div>
          <div>
            <h2
              style={{
                fontSize: '1.15rem',
                fontWeight: 900,
                color: '#f8fafc',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              The Three Core Git Areas
            </h2>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
              Working Directory ➔ Staging Index ➔ Local Repository
            </div>
          </div>
        </div>

        {/* View Mode Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setViewMode(viewMode === 'simple' ? 'technical' : 'simple')}
            style={{
              background: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#cbd5e1',
              padding: '0.4rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{isTechnical ? '🔬 Technical (Internals)' : '✨ Conceptual (Desk/Box/Vault)'}</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* The 3 Connected Area Cards with Optical Conveyor Pipeline */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(220px, 1fr) auto minmax(220px, 1fr) auto minmax(220px, 1fr)',
          gap: '0.85rem',
          alignItems: 'center',
        }}
        className="three-area-stage-grid"
      >
        {/* Card 1: Working Tree */}
        <div
          style={{
            background: 'rgba(11, 18, 33, 0.92)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '12px',
            padding: '1.1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            minWidth: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
              <FileText size={17} color="#f59e0b" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                1. Working Tree
              </div>
            </div>
            <span style={{ fontSize: '0.68rem', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.12)', padding: '0.15rem 0.45rem', borderRadius: '4px', flexShrink: 0, fontWeight: 700 }}>
              Local Disk
            </span>
          </div>

          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            {isTechnical ? 'Uncommitted file modifications on filesystem' : 'Your physical desk where files are drafted'}
          </div>

          {/* Files List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {workingFiles.length === 0 ? (
              <div style={{ fontSize: '0.78rem', color: '#64748b', textAlign: 'center', padding: '1rem' }}>
                No files in working tree
              </div>
            ) : (
              workingFiles.map((file) => {
                const isModified = repo.index[file] !== undefined && repo.workingDirectory[file] !== repo.index[file];
                const isUntracked = repo.index[file] === undefined;
                return (
                  <div
                    key={file}
                    onClick={() => openFileTab(file)}
                    style={{
                      background: '#040711',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '6px',
                      padding: '0.45rem 0.65rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: '#e2e8f0', minWidth: 0, flex: 1 }}>
                      <FileText size={14} color="#94a3b8" style={{ flexShrink: 0 }} />
                      <span style={{ fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {file}
                      </span>
                    </div>
                    {(isModified || isUntracked) && (
                      <span
                        style={{
                          fontSize: '0.66rem',
                          fontWeight: 800,
                          color: '#f59e0b',
                          background: 'rgba(245, 158, 11, 0.12)',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '4px',
                          flexShrink: 0,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {isUntracked ? 'UNTRACKED' : 'MODIFIED'}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {workingFiles.length > 0 && (
            <button
              onClick={() => executeCommand('git add .')}
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#f59e0b',
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
              }}
            >
              <Zap size={13} /> Stage All: <code>git add .</code>
            </button>
          )}
        </div>

        {/* Optical Conveyor 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', padding: '0 0.2rem' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#38bdf8',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
              background: '#040711',
              border: '1px solid #38bdf8',
              padding: '0.2rem 0.5rem',
              borderRadius: '6px',
              boxShadow: '0 0 10px rgba(56, 189, 248, 0.2)',
            }}
          >
            git add
          </span>
          <div style={{ display: 'flex', alignItems: 'center', color: '#38bdf8', fontSize: '1.2rem', fontWeight: 900 }}>
            ➔
          </div>
        </div>

        {/* Card 2: Staging Area */}
        <div
          style={{
            background: 'rgba(11, 18, 33, 0.92)',
            border: stagedFiles.length > 0 ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '1.1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            boxShadow: stagedFiles.length > 0 ? '0 0 20px rgba(56, 189, 248, 0.2)' : 'none',
            minWidth: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
              <Database size={17} color="#38bdf8" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                2. Staging Area (Index)
              </div>
            </div>
            <span style={{ fontSize: '0.68rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', padding: '0.15rem 0.45rem', borderRadius: '4px', flexShrink: 0, fontWeight: 700 }}>
              .git/index
            </span>
          </div>

          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            {isTechnical ? 'Binary tree manifest mapping filenames to blob SHAs' : 'The packing crate ready for next milestone'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {stagedFiles.length === 0 ? (
              <div
                style={{
                  border: '1.5px dashed rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '1.2rem',
                  textAlign: 'center',
                  color: '#64748b',
                  fontSize: '0.78rem',
                }}
              >
                <div>(Packing crate empty)</div>
                <div style={{ fontSize: '0.72rem', marginTop: '0.2rem' }}>Run <code>git add</code> to prepare files</div>
              </div>
            ) : (
              stagedFiles.map((file) => (
                <div
                  key={file}
                  style={{
                    background: '#040711',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '6px',
                    padding: '0.45rem 0.65rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: '#38bdf8', minWidth: 0, flex: 1 }}>
                    <FileText size={14} style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>
                      {file}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.66rem',
                      fontWeight: 800,
                      color: '#38bdf8',
                      background: 'rgba(56, 189, 248, 0.15)',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '4px',
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    STAGED
                  </span>
                </div>
              ))
            )}
          </div>

          {stagedFiles.length > 0 && (
            <button
              onClick={() => executeCommand('git commit -m "Update project milestones"')}
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#10b981',
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
              }}
            >
              <CheckCircle2 size={13} /> Seal Milestone: <code>git commit</code>
            </button>
          )}
        </div>

        {/* Optical Conveyor 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', padding: '0 0.2rem' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#10b981',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
              background: '#040711',
              border: '1px solid #10b981',
              padding: '0.2rem 0.5rem',
              borderRadius: '6px',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.2)',
            }}
          >
            git commit
          </span>
          <div style={{ display: 'flex', alignItems: 'center', color: '#10b981', fontSize: '1.2rem', fontWeight: 900 }}>
            ➔
          </div>
        </div>

        {/* Card 3: Local Repository */}
        <div
          style={{
            background: 'rgba(11, 18, 33, 0.92)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '12px',
            padding: '1.1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            minWidth: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
              <Camera size={17} color="#10b981" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                3. Local Repository
              </div>
            </div>
            <span style={{ fontSize: '0.68rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', padding: '0.15rem 0.45rem', borderRadius: '4px', flexShrink: 0, fontWeight: 700 }}>
              .git/objects
            </span>
          </div>

          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            {isTechnical ? 'Immutable cryptographic DAG of commit snapshots' : 'Indestructible time machine vault'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {commits.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.2rem',
                  gap: '0.4rem',
                  color: '#64748b',
                }}
              >
                <Database size={22} color="#475569" />
                <div style={{ fontSize: '0.78rem' }}>No commits sealed yet</div>
              </div>
            ) : (
              commits.slice(-3).reverse().map((c, idx) => (
                <div
                  key={c.hash}
                  style={{
                    background: '#040711',
                    border: idx === 0 ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '6px',
                    padding: '0.45rem 0.65rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0, flex: 1 }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'monospace', color: '#10b981', fontSize: '0.78rem', fontWeight: 800, flexShrink: 0 }}>
                      {c.shortHash}
                    </span>
                    <span style={{ fontSize: '0.76rem', color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.message}
                    </span>
                  </div>
                  {idx === 0 && (
                    <span style={{ fontSize: '0.66rem', fontWeight: 800, background: '#2563eb', color: 'white', padding: '0.1rem 0.35rem', borderRadius: '4px', flexShrink: 0 }}>
                      HEAD
                    </span>
                  )}
                </div>
              ))
            )}
          </div>

          <div style={{ fontSize: '0.7rem', color: '#10b981', textAlign: 'center', fontWeight: 700, background: 'rgba(16, 185, 129, 0.08)', padding: '0.35rem', borderRadius: '6px' }}>
            ✓ Permanent snapshot chain active
          </div>
        </div>
      </div>

      {/* Bottom Educational Status Banner */}
      <div
        style={{
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '10px',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          color: '#38bdf8',
          fontSize: '0.85rem',
          fontWeight: 600,
        }}
      >
        <Info size={18} style={{ flexShrink: 0 }} />
        <span>
          {stagedFiles.length > 0
            ? `You have ${stagedFiles.length} file(s) in staging ready to be sealed into a commit.`
            : workingFiles.length > 0
            ? `You have ${workingFiles.length} changed file(s). Stage them with git add, then commit to create a savepoint.`
            : 'Working tree is clean. Ready for your next changes.'}
        </span>
      </div>
    </div>
  );
};
