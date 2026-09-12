import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LifeBuoy,
  X,
  HelpCircle,
  Eye,
  Lightbulb,
  Terminal,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface ImLostDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImLostDrawer: React.FC<ImLostDrawerProps> = ({ isOpen, onClose }) => {
  const { currentLesson, repo, inspection, executeCommand, resetCurrentExercise, openHumansTerm } = useApp();
  const [revealedLevel, setRevealedLevel] = useState<number>(1); // 1 = conceptual, 2 = example, 3 = exact command
  const [resetDone, setResetDone] = useState(false);

  if (!isOpen) return null;

  const currentBranch = repo.head.type === 'branch' ? repo.head.ref : 'detached HEAD';
  const stagedCount = Object.keys(repo.index).length;
  const untrackedCount = inspection.fileStatuses.filter(f => f.isUntracked).length;
  const modifiedCount = inspection.fileStatuses.filter(f => f.isModified).length;

  const handleReset = () => {
    resetCurrentExercise();
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2500);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '680px',
          width: '100%',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(90deg, rgba(240, 80, 51, 0.15), rgba(245, 158, 11, 0.1))',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'var(--danger-red)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <LifeBuoy size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--danger-red)', fontWeight: 800 }}>
                🆘 Emergency Mentor • Senior Dev Support
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Don't Worry, We've Got You Covered
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* 1. What are you trying to accomplish? */}
          <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--git-orange)', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              <HelpCircle size={16} /> 1. What are you trying to accomplish?
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5 }}>
              {currentLesson.mission}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
              Goal: {currentLesson.task.beginnerPrompt}
            </div>
          </div>

          {/* 2. What is the current repository state? */}
          <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--cyan)', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              <Eye size={16} /> 2. What is Git's current state right now?
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem' }}>
              <div style={{ background: 'var(--bg-surface)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ACTIVE BRANCH</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{currentBranch}</div>
              </div>
              <div style={{ background: 'var(--bg-surface)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>STAGING AREA</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: stagedCount > 0 ? 'var(--terminal-green)' : 'var(--text-secondary)' }}>
                  {stagedCount} file(s)
                </div>
              </div>
              <div style={{ background: 'var(--bg-surface)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>WORKING EDITS</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: modifiedCount + untrackedCount > 0 ? 'var(--warning-amber)' : 'var(--text-secondary)' }}>
                  {modifiedCount + untrackedCount} file(s)
                </div>
              </div>
            </div>
          </div>

          {/* 3. Progressive Hints (3 Tiers) */}
          <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', background: 'rgba(245, 158, 11, 0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning-amber)', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              <Lightbulb size={16} /> 3. Progressive Guidance (Think First)
            </div>

            {/* Hint 1: Conceptual */}
            <div style={{ padding: '0.75rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-sm)', marginBottom: '0.6rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--warning-amber)', textTransform: 'uppercase' }}>
                Level 1: Conceptual Clue
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                {currentLesson.hints[0] || 'Observe what changed in your working directory versus the staging area.'}
              </div>
            </div>

            {/* Hint 2: Stronger */}
            {revealedLevel >= 2 ? (
              <div style={{ padding: '0.75rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-sm)', marginBottom: '0.6rem', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--cyan)', textTransform: 'uppercase' }}>
                  Level 2: Stronger Hint
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                  {currentLesson.hints[1] || 'Look at the command syntax required to prepare files or move branches.'}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setRevealedLevel(2)}
                style={{
                  background: 'transparent',
                  border: '1px dashed var(--border-color)',
                  color: 'var(--text-secondary)',
                  padding: '0.5rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  width: '100%',
                  justifyContent: 'center',
                  marginBottom: '0.6rem',
                }}
              >
                Need a stronger clue? Click to reveal Level 2 <ChevronRight size={14} />
              </button>
            )}

            {/* Hint 3: Exact Command */}
            {revealedLevel >= 3 ? (
              <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--terminal-green)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Terminal size={14} /> Level 3: Exact Solution
                </div>
                <div style={{ fontSize: '0.88rem', marginTop: '0.2rem', fontFamily: 'monospace', background: 'var(--bg-terminal)', padding: '0.5rem 0.75rem', borderRadius: '4px', color: 'var(--terminal-green)' }}>
                  {currentLesson.solution}
                </div>
              </div>
            ) : revealedLevel >= 2 ? (
              <button
                onClick={() => setRevealedLevel(3)}
                style={{
                  background: 'transparent',
                  border: '1px dashed var(--border-color)',
                  color: 'var(--text-secondary)',
                  padding: '0.5rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  width: '100%',
                  justifyContent: 'center',
                }}
              >
                Still stuck? Reveal exact command solution <ChevronRight size={14} />
              </button>
            ) : null}
          </div>

          {/* 4. Safe Reset Option */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-app)', padding: '0.8rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Feel like you broke something?
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                You can safely reset this exercise to its clean initial state anytime.
              </div>
            </div>
            <button
              onClick={handleReset}
              style={{
                background: resetDone ? 'var(--terminal-green)' : 'rgba(239, 68, 68, 0.15)',
                color: resetDone ? 'white' : 'var(--danger-red)',
                border: `1px solid ${resetDone ? 'var(--terminal-green)' : 'rgba(239, 68, 68, 0.4)'}`,
                padding: '0.45rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              {resetDone ? <CheckCircle2 size={16} /> : <RotateCcw size={16} />}
              {resetDone ? 'Reset Complete!' : 'Reset Exercise'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '0.9rem 1.5rem',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-app)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <button
            onClick={() => {
              onClose();
              openHumansTerm('staging-area');
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--cyan)',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              textDecoration: 'underline',
            }}
          >
            <Sparkles size={14} /> Open Git for Humans Metaphors
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'var(--git-orange)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Ready to Try Again
          </button>
        </div>
      </div>
    </div>
  );
};
