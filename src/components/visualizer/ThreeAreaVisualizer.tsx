import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HardDrive,
  Inbox,
  Database,
  Globe,
  FileText,
  HelpCircle,
  Play,
  RotateCcw,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const ThreeAreaVisualizer: React.FC = () => {
  const { repo, openFileTab, openHumansTerm, replayTrigger, triggerReplay, instructionMode } = useApp();
  const [animatingAdd, setAnimatingAdd] = useState(false);
  const [animatingCommit, setAnimatingCommit] = useState(false);
  const [selectedFileCard, setSelectedFileCard] = useState<{ path: string; area: string; reason: string } | null>(null);
  const [activeExplainColumn, setActiveExplainColumn] = useState<string | null>(null);

  const isBeginner = instructionMode === 'beginner';
  const isIntermediate = instructionMode === 'intermediate';

  const workingFiles = Object.keys(repo.workingDirectory);
  const stagedFiles = Object.keys(repo.index);

  let headFiles: Record<string, string> = {};
  const headCommitHash = repo.head.type === 'branch' ? repo.branches[repo.head.ref]?.targetCommitHash : repo.head.ref;
  if (headCommitHash && repo.commits[headCommitHash]) {
    headFiles = repo.commits[headCommitHash].files || {};
  }
  const committedPaths = Object.keys(headFiles);

  const remoteMainHash = repo.remotes['origin']?.branches['main']?.targetCommitHash;
  const remoteCommit = remoteMainHash ? repo.commits[remoteMainHash] : null;

  // Trigger animation pulse on replay or state change
  useEffect(() => {
    if (replayTrigger > 0) {
      setAnimatingAdd(true);
      setTimeout(() => {
        setAnimatingAdd(false);
        setAnimatingCommit(true);
        setTimeout(() => setAnimatingCommit(false), 800);
      }, 700);
    }
  }, [replayTrigger]);

  const toggleExplain = (col: string) => {
    setActiveExplainColumn(prev => prev === col ? null : col);
  };

  return (
    <div className="three-area-container" style={{ position: 'relative' }}>
      {/* Header with Title and Replay Animation */}
      <div className="three-area-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div className="three-area-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800 }}>
            <Database size={16} color="var(--git-orange)" />
            {isBeginner ? 'The Three Steps of Git (How Git Remembers)' : 'The Three Areas of Git (Mental Model)'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            onClick={triggerReplay}
            style={{
              background: 'rgba(240, 80, 51, 0.12)',
              color: 'var(--git-orange)',
              border: '1px solid rgba(240, 80, 51, 0.3)',
              borderRadius: '999px',
              padding: '0.25rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
            title="Replay the file transition animation"
          >
            <Play size={12} fill="currentColor" /> Replay Flow
          </button>
        </div>
      </div>

      {/* Visual Pipeline Connector Bar with Progressive Terminology */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0.4rem 1rem',
          background: 'var(--bg-app)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.74rem',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-color)',
          marginBottom: '0.6rem',
          flexWrap: 'wrap',
          gap: '0.4rem',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, color: 'var(--warning-amber)' }}>
          <HardDrive size={13} /> {isBeginner ? '📄 Your Files (Desk)' : isIntermediate ? '📁 Working Directory' : 'Working Tree'}
        </span>
        <span style={{ color: 'var(--git-orange)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          ➔ <code>git add</code> ➔
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, color: 'var(--terminal-green)' }}>
          <Inbox size={13} /> {isBeginner ? '📦 Packing Box (Staging)' : isIntermediate ? '📦 Staging Area' : 'Index (Stage)'}
        </span>
        <span style={{ color: 'var(--git-orange)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          ➔ <code>git commit</code> ➔
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, color: 'var(--cyan)' }}>
          <Database size={13} /> {isBeginner ? '💾 Saved Snapshots' : isIntermediate ? '💾 Local Repository' : 'Commit DAG (HEAD)'}
        </span>
        {!isBeginner && (
          <>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              ➔ <code>git push</code> ➔
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, color: '#a855f7' }}>
              <Globe size={13} /> {isIntermediate ? '🌐 Remote (origin)' : 'Remote Tracking'}
            </span>
          </>
        )}
      </div>

      {/* Explanatory Banner if toggled */}
      {activeExplainColumn && (
        <div
          style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--git-orange)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.6rem 0.9rem',
            marginBottom: '0.6rem',
            fontSize: '0.8rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'var(--text-primary)',
          }}
        >
          <div>
            {activeExplainColumn === 'col1' && (
              <>
                <strong style={{ color: 'var(--warning-amber)' }}>
                  {isBeginner ? '📄 Your Files (On Desk)' : 'Working Tree'}:
                </strong>{' '}
                These are the real files on your computer. When you edit code in your editor, changes happen here first. Git notices changes, but does NOT save them into history until you add them.
              </>
            )}
            {activeExplainColumn === 'col2' && (
              <>
                <strong style={{ color: 'var(--terminal-green)' }}>
                  {isBeginner ? '📦 Packing Box (Staging Area)' : 'Staging Area (Index)'}:
                </strong>{' '}
                A staging area is like a box where you pack only the specific changes you want to save. Running <code>git add &lt;file&gt;</code> puts a file into this box.
              </>
            )}
            {activeExplainColumn === 'col3' && (
              <>
                <strong style={{ color: 'var(--cyan)' }}>
                  {isBeginner ? '💾 Saved Snapshots (Commits)' : 'Repository (HEAD)'}:
                </strong>{' '}
                Running <code>git commit</code> seals the packing box and writes a permanent snapshot with your name and message into history. You can travel back here anytime.
              </>
            )}
            {activeExplainColumn === 'col4' && (
              <>
                <strong style={{ color: '#a855f7' }}>Remote (origin):</strong> A backup copy of your repository hosted on another machine or service (like GitHub). <code>git push</code> uploads your commits there.
              </>
            )}
          </div>
          <button
            onClick={() => setActiveExplainColumn(null)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: '0.8rem', fontWeight: 800 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Columns */}
      <div className="three-area-columns">
        {/* Column 1: Working Directory */}
        <div
          className="visual-column"
          style={{
            transition: 'box-shadow 0.3s ease',
            boxShadow: animatingAdd ? '0 0 14px rgba(245, 158, 11, 0.4)' : 'none',
          }}
        >
          <div className="column-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <HardDrive size={13} />
              {isBeginner ? '1. Your Files (Desk)' : isIntermediate ? '1. Working Directory' : '1. Working Tree'}
              <button
                onClick={() => toggleExplain('col1')}
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: 'var(--warning-amber)',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  padding: '0.1rem 0.35rem',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}
                title="What is this? Click for plain explanation"
              >
                ❓ What is this?
              </button>
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{workingFiles.length} on desk</span>
          </div>

          <div className="file-cards">
            {workingFiles.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center', margin: 'auto' }}>No files</div>
            ) : (
              workingFiles.map(path => {
                const isModified = repo.index[path] !== undefined && repo.workingDirectory[path] !== repo.index[path];
                const isUntracked = repo.index[path] === undefined && headFiles[path] === undefined;
                const hasConflict = repo.workingDirectory[path]?.includes('<<<<<<< HEAD');

                return (
                  <div
                    key={path}
                    className={`file-card ${hasConflict ? 'conflict' : isModified ? 'modified' : isUntracked ? 'untracked' : ''}`}
                    onClick={() => {
                      openFileTab(path);
                      setSelectedFileCard({
                        path,
                        area: isBeginner ? 'Your Files (On Desk)' : 'Working Tree',
                        reason: hasConflict
                          ? 'This file has conflicting changes from two branches that need your resolution.'
                          : isModified
                          ? 'This file has changes on your desk. Run `git add` to place it in the packing box.'
                          : isUntracked
                          ? 'This file is brand new. Git is not tracking it until you run `git add`.'
                          : 'This file matches the latest saved snapshot.',
                      });
                    }}
                    title="Click to view file in editor & inspect state"
                    style={{ cursor: 'pointer' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <FileText size={12} /> {path}
                    </span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: hasConflict ? 'var(--danger)' : isModified ? 'var(--warning)' : isUntracked ? 'var(--git-cyan)' : 'var(--text-muted)' }}>
                      {hasConflict ? 'CONFLICT' : isModified ? 'MOD' : isUntracked ? 'NEW' : '✓'}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Column 2: Staging Area (Index) */}
        <div
          className="visual-column"
          style={{
            borderColor: stagedFiles.length > 0 ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-color)',
            transition: 'box-shadow 0.3s ease',
            boxShadow: animatingCommit ? '0 0 14px rgba(16, 185, 129, 0.4)' : 'none',
          }}
        >
          <div className="column-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Inbox size={13} />
              {isBeginner ? '2. Packing Box (Staging)' : isIntermediate ? '2. Staging Area' : '2. Index (Staging)'}
              <button
                onClick={() => toggleExplain('col2')}
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: 'var(--terminal-green)',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  padding: '0.1rem 0.35rem',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}
                title="What is this? Click for plain explanation"
              >
                ❓ What is this?
              </button>
            </span>
            <span style={{ color: stagedFiles.length > 0 ? 'var(--success)' : 'var(--text-muted)' }}>
              {stagedFiles.length} in box
            </span>
          </div>

          <div className="file-cards">
            {stagedFiles.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center', margin: 'auto' }}>
                Packing box empty (run <code>git add</code>)
              </div>
            ) : (
              stagedFiles.map(path => (
                <div
                  key={path}
                  className="file-card staged"
                  onClick={() => {
                    openFileTab(path);
                    setSelectedFileCard({
                      path,
                      area: isBeginner ? 'Packing Box' : 'Staging Area',
                      reason: 'This file is inside the packing box! It will be permanently recorded when you run `git commit`.',
                    });
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <FileText size={12} /> {path}
                  </span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--success)' }}>
                    STAGED
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Local Repository (HEAD) */}
        <div className="visual-column">
          <div className="column-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Database size={13} />
              {isBeginner ? '3. Saved Snapshots' : isIntermediate ? '3. Local Repository' : '3. Commit DAG (HEAD)'}
              <button
                onClick={() => toggleExplain('col3')}
                style={{
                  background: 'rgba(6, 182, 212, 0.15)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  color: 'var(--cyan)',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  padding: '0.1rem 0.35rem',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}
                title="What is this? Click for plain explanation"
              >
                ❓ What is this?
              </button>
            </span>
            <span>
              {isBeginner
                ? `${committedPaths.length} files saved`
                : repo.head.type === 'branch' ? repo.head.ref : repo.head.ref ? repo.head.ref.slice(0, 7) : 'init'}
            </span>
          </div>

          <div className="file-cards">
            {committedPaths.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center', margin: 'auto' }}>
                No commits yet (run <code>git commit</code>)
              </div>
            ) : (
              committedPaths.map(path => (
                <div
                  key={path}
                  className="file-card committed"
                  onClick={() => {
                    openFileTab(path);
                    setSelectedFileCard({
                      path,
                      area: isBeginner ? 'Saved Snapshot' : 'Repository (HEAD)',
                      reason: 'This file is safely sealed inside your project history. You can travel back to this snapshot anytime.',
                    });
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <FileText size={12} /> {path}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    v{Object.keys(repo.commits).length}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 4: Remote Repository - Only for Intermediate and above */}
        {!isBeginner && (
          <div className="visual-column">
            <div className="column-header">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Globe size={13} /> 4. Remote (origin)
                <button
                  onClick={() => toggleExplain('col4')}
                  style={{
                    background: 'rgba(168, 85, 247, 0.15)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    color: '#a855f7',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    padding: '0.1rem 0.35rem',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                  }}
                  title="What is this? Click for plain explanation"
                >
                  ❓ What is this?
                </button>
              </span>
              <span>{repo.remotes['origin'] ? 'Connected' : 'None'}</span>
            </div>

            <div className="file-cards">
              {!repo.remotes['origin'] ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center', margin: 'auto' }}>
                  No remote set (git remote add)
                </div>
              ) : !remoteCommit ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center', margin: 'auto' }}>
                  Not pushed yet (git push)
                </div>
              ) : (
                Object.keys(remoteCommit.files).map(path => (
                  <div key={path} className="file-card remote" onClick={() => openFileTab(path)} style={{ cursor: 'pointer' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <FileText size={12} /> {path}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--git-cyan)' }}>
                      SYNCED
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected File Card Explanation Toast */}
      {selectedFileCard && (
        <div
          style={{
            marginTop: '0.6rem',
            padding: '0.6rem 0.9rem',
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.82rem',
          }}
        >
          <div>
            <strong style={{ color: 'var(--cyan)' }}>{selectedFileCard.path}</strong> ({selectedFileCard.area}):{' '}
            <span style={{ color: 'var(--text-primary)' }}>{selectedFileCard.reason}</span>
          </div>
          <button
            onClick={() => setSelectedFileCard(null)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
