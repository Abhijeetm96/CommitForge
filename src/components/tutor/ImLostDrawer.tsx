import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LifeBuoy,
  X,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  Terminal,
} from 'lucide-react';

interface ImLostDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImLostDrawer: React.FC<ImLostDrawerProps> = ({ isOpen, onClose }) => {
  const { currentLesson, repo, inspection, resetCurrentExercise, openHumansTerm } = useApp();
  const [selectedAnswer, setSelectedAnswer] = useState<'yes' | 'no' | 'unsure' | null>(null);
  const [showFullCommand, setShowFullCommand] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  if (!isOpen) return null;

  const stagedCount = Object.keys(repo.index).length;
  const modifiedFiles = inspection.fileStatuses.filter((f) => f.isModified || f.isUntracked);
  const primaryChangedFile = modifiedFiles[0]?.path || 'your files';

  const handleReset = () => {
    resetCurrentExercise();
    setResetDone(true);
    setTimeout(() => {
      setResetDone(false);
      onClose();
    }, 1500);
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
          maxWidth: '560px',
          width: '100%',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.2rem 1.5rem',
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
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--danger-red)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LifeBuoy size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--danger-red)', fontWeight: 800 }}>
                🆘 Emergency Mentor
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                No problem. Let's figure this out together.
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
              padding: '0.3rem',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Conversational Triage Body (Point 16) */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* 1. What you're trying to do */}
          <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--git-orange)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              You're trying to:
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {currentLesson.mission}
            </div>
          </div>

          {/* 2. What Git currently sees */}
          <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Git currently sees:
            </div>
            <div style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>
              {modifiedFiles.length > 0 ? (
                <span>📄 <code>{primaryChangedFile}</code> has been modified on your desk</span>
              ) : (
                <span>📄 Your desk is clean (no unsaved file modifications)</span>
              )}
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Packing box (Staging Area): {stagedCount === 0 ? 'Empty' : `${stagedCount} file(s) staged`}
              </div>
            </div>
          </div>

          {/* 3. Think Prompt */}
          <div style={{ background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--warning-amber)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Think:
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Have we selected this change for our next snapshot?
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setSelectedAnswer('yes')}
                style={{
                  background: selectedAnswer === 'yes' ? 'var(--git-orange)' : 'var(--bg-app)',
                  color: selectedAnswer === 'yes' ? 'white' : 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
              >
                YES
              </button>

              <button
                onClick={() => setSelectedAnswer('no')}
                style={{
                  background: selectedAnswer === 'no' ? 'var(--git-orange)' : 'var(--bg-app)',
                  color: selectedAnswer === 'no' ? 'white' : 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
              >
                NO
              </button>

              <button
                onClick={() => setSelectedAnswer('unsure')}
                style={{
                  background: selectedAnswer === 'unsure' ? 'var(--git-orange)' : 'var(--bg-app)',
                  color: selectedAnswer === 'unsure' ? 'white' : 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
              >
                I'M NOT SURE
              </button>
            </div>

            {/* Conversational Explanation after answering */}
            {selectedAnswer !== null && (
              <div
                style={{
                  marginTop: '0.8rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                }}
              >
                {selectedAnswer === 'no' && (
                  <div>
                    <strong>Exactly.</strong> If the change is not staged in the packing box, Git cannot include it in a commit.
                    Run: <code>git add {primaryChangedFile}</code>
                  </div>
                )}
                {selectedAnswer === 'yes' && (
                  <div>
                    If you already staged it, you are ready to seal the box!
                    Run: <code>git commit -m "Describe your changes"</code>
                  </div>
                )}
                {selectedAnswer === 'unsure' && (
                  <div>
                    Remember the physical rhythm: <strong>Desk ➔ Packing Box ➔ Sealed Snapshot</strong>.
                    Run <code>git status</code> to see if your file is in red (still on desk) or green (already in the packing box).
                  </div>
                )}

                {!showFullCommand ? (
                  <button
                    onClick={() => setShowFullCommand(true)}
                    style={{
                      marginTop: '0.5rem',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--cyan)',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      padding: 0,
                    }}
                  >
                    Still stuck? Show exact solution command
                  </button>
                ) : (
                  <div style={{ marginTop: '0.5rem', fontFamily: 'monospace', background: 'var(--bg-terminal)', padding: '0.4rem 0.6rem', borderRadius: '4px', color: 'var(--terminal-green)' }}>
                    {currentLesson.solution}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem' }}>
            <button
              onClick={handleReset}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-color)',
                color: 'var(--danger-red)',
                padding: '0.45rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <RotateCcw size={14} /> {resetDone ? 'Resetting...' : 'Reset This Step'}
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'var(--git-orange)',
                color: 'white',
                border: 'none',
                padding: '0.55rem 1.4rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Ready to Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
