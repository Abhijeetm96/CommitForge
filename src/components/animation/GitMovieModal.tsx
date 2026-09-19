import React, { useState } from 'react';
import { GitRepo } from '../../git-engine/types';
import { GitAnimationStage } from './GitAnimationStage';
import { X, Film, Play, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

interface GitMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  repo: GitRepo;
  onExecuteCommand: (cmd: string) => void;
}

const MOVIE_SHELF = [
  { id: 'push', title: 'git push', subtitle: 'Send commits to remote', icon: '🚀' },
  { id: 'commit', title: 'git commit', subtitle: 'Seal snapshot milestone', icon: '📸' },
  { id: 'add', title: 'git add', subtitle: 'Pack the staging box', icon: '📦' },
  { id: 'status', title: 'git status', subtitle: '3-Area situation report', icon: '🔍' },
  { id: 'branch', title: 'git branch', subtitle: 'Movable reference pointers', icon: '🌿' },
  { id: 'merge', title: 'git merge', subtitle: 'Combine two code streams', icon: '⚔️' },
  { id: 'conflict', title: 'Merge Conflicts', subtitle: 'Collide & resolve lines', icon: '⚡' },
  { id: 'rebase', title: 'git rebase', subtitle: 'Replay on a clean base', icon: '🎯' },
  { id: 'reset', title: 'git reset', subtitle: 'Rewind the timeline', icon: '⏪' },
  { id: 'stash', title: 'git stash', subtitle: 'Emergency desk drawer', icon: '🗄️' },
];

export const GitMovieModal: React.FC<GitMovieModalProps> = ({
  isOpen,
  onClose,
  repo,
  onExecuteCommand,
}) => {
  const [selectedMovie, setSelectedMovie] = useState<string>('push');

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 250,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          maxWidth: '1100px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Cinema Header */}
        <div
          style={{
            padding: '1.25rem 2rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-card)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f05033 0%, #ea580c 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Film size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                🎬 Git Movie Theater
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                20–60 second cinematic overviews: watch Git happen before you do it yourself
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '0.4rem',
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Cinema Workspace: Left Shelf + Main Theater Screen */}
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: '260px 1fr',
            overflow: 'hidden',
          }}
          className="movie-modal-grid"
        >
          {/* Left Shelf: Command Selector */}
          <div
            style={{
              background: 'var(--bg-surface)',
              borderRight: '1px solid var(--border-color)',
              padding: '1.25rem 1rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Select Movie Feature
            </div>

            {MOVIE_SHELF.map((m) => {
              const isSelected = selectedMovie === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMovie(m.id)}
                  style={{
                    background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                    border: `1px solid ${isSelected ? '#38bdf8' : 'transparent'}`,
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{m.icon}</span>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: isSelected ? 800 : 600, color: isSelected ? '#38bdf8' : 'var(--text-primary)' }}>
                      {m.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {m.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Embedded Active Stage */}
          <div style={{ padding: '1.5rem', overflowY: 'auto', background: 'var(--bg-app)' }}>
            <GitAnimationStage
              commandId={selectedMovie}
              repo={repo}
              onExecuteCommand={onExecuteCommand}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
