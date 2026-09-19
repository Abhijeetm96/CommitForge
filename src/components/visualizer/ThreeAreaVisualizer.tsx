import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GitRepo } from '../../git-engine/types';
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

export interface ThreeAreaVisualizerProps {
  repo?: GitRepo;
}

export const ThreeAreaVisualizer: React.FC<ThreeAreaVisualizerProps> = ({ repo: propRepo }) => {
  const { repo: contextRepo, openFileTab, executeCommand } = useApp();
  const repo = propRepo || contextRepo;
  const [viewMode, setViewMode] = useState<'conceptual' | 'technical'>('conceptual');

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
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5)',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
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
              background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 2px 8px rgba(56, 189, 248, 0.3)',
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
            onClick={() => {
              setViewMode(viewMode === 'conceptual' ? 'technical' : 'conceptual');
            }}
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
            <span>
              {isTechnical
                ? '🔬 Technical (Internals & Cache)'
                : '✨ Conceptual (Workflow & Zones)'}
            </span>
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* The 3 Connected Area Cards with Optical Conveyor Pipeline */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr)',
          gap: '0.65rem',
          alignItems: 'stretch',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
        className="three-area-stage-grid"
      >
        {/* Card 1: Working Tree */}
        <div
          style={{
            background: 'rgba(11, 18, 33, 0.92)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '12px',
            padding: '0.9rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            minWidth: 0,
            maxWidth: '100%',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', minWidth: 0, flex: 1 }}>
              <FileText size={17} color="#f59e0b" style={{ flexShrink: 0, marginTop: '1px' }} />
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.25, wordBreak: 'break-word' }}>
                1. Working Tree
              </div>
            </div>
            <span style={{ fontSize: '0.66rem', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.12)', padding: '0.12rem 0.4rem', borderRadius: '4px', flexShrink: 0, fontWeight: 700 }}>
              Local Disk
            </span>
          </div>

          <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.35 }}>
            {isTechnical
              ? 'Uncommitted file modifications on filesystem'
              : 'Your active workspace where files are drafted and edited'}
          </div>

          {/* Files List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', minWidth: 0 }}>
            {workingFiles.length === 0 ? (
              <div style={{ fontSize: '0.76rem', color: '#64748b', textAlign: 'center', padding: '0.85rem' }}>
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
                      padding: '0.4rem 0.55rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      gap: '0.4rem',
                      minWidth: 0,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#e2e8f0', minWidth: 0, flex: 1 }}>
                      <FileText size={13} color="#94a3b8" style={{ flexShrink: 0 }} />
                      <span style={{ fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {file}
                      </span>
                    </div>
                    {(isModified || isUntracked) && (
                      <span
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 800,
                          color: '#f59e0b',
                          background: 'rgba(245, 158, 11, 0.12)',
                          padding: '0.1rem 0.35rem',
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
                padding: '0.4rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
              }}
            >
              <Zap size={13} style={{ flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Stage All: <code>git add .</code>
              </span>
            </button>
          )}
        </div>

        {/* Optical Conveyor 1 */}
        <div
          className="three-area-conveyor"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem',
            padding: '0 0.1rem',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              color: '#38bdf8',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
              background: '#040711',
              border: '1px solid rgba(56, 189, 248, 0.5)',
              padding: '0.18rem 0.4rem',
              borderRadius: '6px',
              boxShadow: '0 0 10px rgba(56, 189, 248, 0.2)',
            }}
            title="Stage changes: git add"
          >
            git add
          </span>
          <div style={{ display: 'flex', alignItems: 'center', color: '#38bdf8', fontSize: '1.1rem', fontWeight: 900, lineHeight: 1 }}>
            ➔
          </div>
        </div>

        {/* Card 2: Staging Area */}
        <div
          style={{
            background: 'rgba(11, 18, 33, 0.92)',
            border: stagedFiles.length > 0 ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '0.9rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
            boxShadow: stagedFiles.length > 0 ? '0 0 20px rgba(56, 189, 248, 0.2)' : 'none',
            minWidth: 0,
            maxWidth: '100%',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', minWidth: 0, flex: 1 }}>
              <Database size={17} color="#38bdf8" style={{ flexShrink: 0, marginTop: '1px' }} />
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.25, wordBreak: 'break-word' }}>
                2. Staging Area
              </div>
            </div>
            <span style={{ fontSize: '0.66rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', padding: '0.12rem 0.4rem', borderRadius: '4px', flexShrink: 0, fontWeight: 700 }}>
              .git/index
            </span>
          </div>

          <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.35 }}>
            {isTechnical
              ? 'Binary tree manifest mapping filenames to blob SHAs'
              : 'The preparation zone before committing snapshots'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', minWidth: 0 }}>
            {stagedFiles.length === 0 ? (
              <div
                style={{
                  border: '1.5px dashed rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '1rem',
                  textAlign: 'center',
                  color: '#64748b',
                  fontSize: '0.76rem',
                }}
              >
                <div>(Staging area empty)</div>
                <div style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>
                  Run git add to prepare files
                </div>
              </div>
            ) : (
              stagedFiles.map((file) => (
                <div
                  key={file}
                  style={{
                    background: '#040711',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '6px',
                    padding: '0.4rem 0.55rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.4rem',
                    minWidth: 0,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#38bdf8', minWidth: 0, flex: 1 }}>
                    <FileText size={13} style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>
                      {file}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      color: '#38bdf8',
                      background: 'rgba(56, 189, 248, 0.15)',
                      padding: '0.1rem 0.35rem',
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
                padding: '0.4rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
              }}
            >
              <CheckCircle2 size={13} style={{ flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Seal: <code>git commit</code>
              </span>
            </button>
          )}
        </div>

        {/* Optical Conveyor 2 */}
        <div
          className="three-area-conveyor"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem',
            padding: '0 0.1rem',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              color: '#10b981',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
              background: '#040711',
              border: '1px solid rgba(16, 185, 129, 0.5)',
              padding: '0.18rem 0.4rem',
              borderRadius: '6px',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.2)',
            }}
            title="Create commit: git commit"
          >
            git commit
          </span>
          <div style={{ display: 'flex', alignItems: 'center', color: '#10b981', fontSize: '1.1rem', fontWeight: 900, lineHeight: 1 }}>
            ➔
          </div>
        </div>

        {/* Card 3: Local Repository */}
        <div
          style={{
            background: 'rgba(11, 18, 33, 0.92)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '12px',
            padding: '0.9rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            minWidth: 0,
            maxWidth: '100%',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', minWidth: 0, flex: 1 }}>
              <Database size={17} color="#10b981" style={{ flexShrink: 0, marginTop: '1px' }} />
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.25, wordBreak: 'break-word' }}>
                3. Local Repository
              </div>
            </div>
            <span style={{ fontSize: '0.66rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', padding: '0.12rem 0.4rem', borderRadius: '4px', flexShrink: 0, fontWeight: 700 }}>
              .git/objects
            </span>
          </div>

          <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.35 }}>
            {isTechnical
              ? 'Immutable cryptographic DAG of commit snapshots'
              : 'Permanent database of committed project milestones'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', minWidth: 0 }}>
            {commits.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem',
                  gap: '0.35rem',
                  color: '#64748b',
                }}
              >
                <Database size={20} color="#475569" />
                <div style={{ fontSize: '0.76rem' }}>
                  No commits sealed yet
                </div>
              </div>
            ) : (
              commits.slice(-3).reverse().map((c, idx) => (
                <div
                  key={c.hash}
                  style={{
                    background: '#040711',
                    border: idx === 0 ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '6px',
                    padding: '0.4rem 0.55rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.4rem',
                    minWidth: 0,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', minWidth: 0, flex: 1 }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'monospace', color: '#10b981', fontSize: '0.76rem', fontWeight: 800, flexShrink: 0 }}>
                      {c.shortHash}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.message}
                    </span>
                  </div>
                  {idx === 0 && (
                    <span style={{ fontSize: '0.62rem', fontWeight: 800, background: '#2563eb', color: 'white', padding: '0.1rem 0.3rem', borderRadius: '4px', flexShrink: 0 }}>
                      HEAD
                    </span>
                  )}
                </div>
              ))
            )}
          </div>

          <div style={{ fontSize: '0.68rem', color: '#10b981', textAlign: 'center', fontWeight: 700, background: 'rgba(16, 185, 129, 0.08)', padding: '0.3rem 0.45rem', borderRadius: '6px', wordBreak: 'break-word', lineHeight: 1.3 }}>
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
          minWidth: 0,
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Info size={18} style={{ flexShrink: 0 }} />
        <span style={{ wordBreak: 'break-word', flex: 1, minWidth: 0, lineHeight: 1.4 }}>
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
