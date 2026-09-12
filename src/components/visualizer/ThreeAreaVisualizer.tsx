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
  const { repo, openFileTab, openHumansTerm, replayTrigger, triggerReplay } = useApp();
  const [animatingAdd, setAnimatingAdd] = useState(false);
  const [animatingCommit, setAnimatingCommit] = useState(false);
  const [selectedFileCard, setSelectedFileCard] = useState<{ path: string; area: string; reason: string } | null>(null);

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

  return (
    <div className="three-area-container" style={{ position: 'relative' }}>
      {/* Header with Title and Replay Animation */}
      <div className="three-area-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div className="three-area-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800 }}>
            <Database size={16} color="var(--git-orange)" />
            The Three Areas of Git (Your Visual Mental Model)
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

      {/* Visual Pipeline Connector Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0.35rem 1rem',
          background: 'var(--bg-app)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.72rem',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-color)',
          marginBottom: '0.5rem',
          flexWrap: 'wrap',
          gap: '0.4rem',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
          <HardDrive size={12} color="var(--warning-amber)" /> Working Tree
        </span>
        <span style={{ color: 'var(--git-orange)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          ➔ <code>git add</code> ➔
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
          <Inbox size={12} color="var(--terminal-green)" /> Staging Area
        </span>
        <span style={{ color: 'var(--git-orange)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          ➔ <code>git commit</code> ➔
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
          <Database size={12} color="var(--cyan)" /> Local Repo
        </span>
        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          ➔ <code>git push</code> ➔
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
          <Globe size={12} color="#a855f7" /> Remote
        </span>
      </div>

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
              <HardDrive size={13} /> 1. Working Tree
              <button
                onClick={() => openHumansTerm('working-directory')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                title="What is the Working Tree? (Click for plain English explanation)"
              >
                <HelpCircle size={12} />
              </button>
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{workingFiles.length} files on desk</span>
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
                        area: 'Working Tree',
                        reason: hasConflict
                          ? 'This file has conflicting changes from both branches that need your manual resolution.'
                          : isModified
                          ? 'This file has uncommitted edits on your local desk. Run `git add` to prepare it for a snapshot.'
                          : isUntracked
                          ? 'This file is brand new. Git is not watching it yet until you run `git add`.'
                          : 'This file matches the latest saved version.',
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
              <Inbox size={13} /> 2. Staging Area (The Box)
              <button
                onClick={() => openHumansTerm('staging-area')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                title="What is the Staging Area? (Click for plain English explanation)"
              >
                <HelpCircle size={12} />
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
                      area: 'Staging Area',
                      reason: 'This file is inside the staging box! It will be permanently recorded when you run `git commit`.',
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
              <Database size={13} /> 3. Local Repo (HEAD)
              <button
                onClick={() => openHumansTerm('commit')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                title="What is a Commit? (Click for plain English explanation)"
              >
                <HelpCircle size={12} />
              </button>
            </span>
            <span>
              {repo.head.type === 'branch' ? repo.head.ref : repo.head.ref ? repo.head.ref.slice(0, 7) : 'init'}
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
                      area: 'Repository (HEAD)',
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

        {/* Column 4: Remote Repository */}
        <div className="visual-column">
          <div className="column-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Globe size={13} /> 4. Remote (origin)
              <button
                onClick={() => openHumansTerm('remote')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                title="What is a Remote? (Click for plain English explanation)"
              >
                <HelpCircle size={12} />
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
