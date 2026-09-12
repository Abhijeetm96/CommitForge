import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  LifeBuoy,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  Terminal,
} from 'lucide-react';

export const ForgeTutor: React.FC = () => {
  const {
    currentLesson,
    instructionMode,
    setShowLostDrawer,
    openHumansTerm,
    lastWhyExplanation,
  } = useApp();

  const [expanded, setExpanded] = useState(true);
  const [hintLevel, setHintLevel] = useState(0); // 0 = none, 1 = concept, 2 = strong, 3 = command
  const [showWhy, setShowWhy] = useState(false);

  // If in expert mode and user collapsed, keep minimal
  if (instructionMode === 'expert' && !expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          background: 'var(--git-orange)',
          color: 'white',
          border: 'none',
          borderRadius: '999px',
          padding: '0.6rem 1rem',
          fontWeight: 800,
          fontSize: '0.85rem',
          cursor: 'pointer',
          boxShadow: '0 4px 14px var(--git-orange-glow)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 1000,
        }}
      >
        <span>👨‍💻</span> Forge Tutor
      </button>
    );
  }

  return (
    <aside
      aria-label="Forge Senior Developer Tutor"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '0.75rem 1rem',
          background: 'linear-gradient(90deg, rgba(240, 80, 51, 0.12), rgba(6, 182, 212, 0.08))',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'var(--git-orange)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              boxShadow: '0 2px 8px var(--git-orange-glow)',
            }}
          >
            👨‍💻
          </div>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              Forge <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--git-orange)' }}>Senior Dev Mentor</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => setShowLostDrawer(true)}
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              color: 'var(--danger-red)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '999px',
              padding: '0.25rem 0.6rem',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
            title="I'm Lost (🆘 Assistance)"
          >
            <LifeBuoy size={12} /> 🆘 I'm Lost
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.2rem',
            }}
          >
            {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
      </div>

      {/* Expanded Body */}
      {expanded && (
        <div style={{ padding: '0.9rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Conversational Speech Bubble */}
          <div
            style={{
              background: 'var(--bg-app)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 0.85rem',
              fontSize: '0.85rem',
              color: 'var(--text-primary)',
              lineHeight: 1.5,
              position: 'relative',
            }}
          >
            {currentLesson.hints[0]
              ? `👋 You're working on: "${currentLesson.title}". Remember, Git works in three distinct spaces: Working Directory, Staging Area, and Commits.`
              : `👋 Welcome! I'm here beside you. Whenever you run a command or make a change, I'll help you understand what Git is thinking.`}
          </div>

          {/* Action Row: Hints & Why */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setHintLevel(prev => (prev < 3 ? prev + 1 : 0))}
              style={{
                flex: 1,
                background: hintLevel > 0 ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-app)',
                color: hintLevel > 0 ? 'var(--warning-amber)' : 'var(--text-secondary)',
                border: `1px solid ${hintLevel > 0 ? 'var(--warning-amber)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-sm)',
                padding: '0.4rem 0.6rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
              }}
            >
              <Lightbulb size={13} />
              {hintLevel === 0 ? 'Need a Hint?' : hintLevel === 1 ? 'Hint 1 (Concept)' : hintLevel === 2 ? 'Hint 2 (Stronger)' : 'Hint 3 (Reveal)'}
            </button>

            {lastWhyExplanation && (
              <button
                onClick={() => setShowWhy(!showWhy)}
                style={{
                  background: showWhy ? 'rgba(6, 182, 212, 0.15)' : 'var(--bg-app)',
                  color: showWhy ? 'var(--cyan)' : 'var(--text-secondary)',
                  border: `1px solid ${showWhy ? 'var(--cyan)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.4rem 0.6rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <HelpCircle size={13} /> Why?
              </button>
            )}

            <button
              onClick={() => openHumansTerm('working-directory')}
              style={{
                background: 'var(--bg-app)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.4rem 0.6rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
              title="Git For Humans Glossary"
            >
              <BookOpen size={13} /> Metaphors
            </button>
          </div>

          {/* Hint Reveal Box */}
          {hintLevel > 0 && (
            <div
              style={{
                padding: '0.65rem 0.8rem',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
                color: 'var(--text-primary)',
                lineHeight: 1.45,
              }}
            >
              {hintLevel === 1 && (
                <div>
                  <strong style={{ color: 'var(--warning-amber)' }}>Concept Clue:</strong>{' '}
                  {currentLesson.hints[0] || 'Think about which area stores unstaged files.'}
                </div>
              )}
              {hintLevel === 2 && (
                <div>
                  <strong style={{ color: 'var(--cyan)' }}>Stronger Clue:</strong>{' '}
                  {currentLesson.hints[1] || 'You need a command that prepares files for a snapshot.'}
                </div>
              )}
              {hintLevel === 3 && (
                <div>
                  <strong style={{ color: 'var(--terminal-green)' }}>Solution Command:</strong>{' '}
                  <code style={{ background: 'var(--bg-terminal)', color: 'var(--terminal-green)', padding: '0.15rem 0.4rem', borderRadius: '3px', fontFamily: 'monospace' }}>
                    {currentLesson.solution}
                  </code>
                </div>
              )}
            </div>
          )}

          {/* Why Explanation Box */}
          {showWhy && lastWhyExplanation && (
            <div
              style={{
                padding: '0.65rem 0.8rem',
                background: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
              }}
            >
              <div style={{ fontWeight: 700, color: 'var(--cyan)', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                Why Did That Happen?
              </div>
              <div style={{ color: 'var(--text-primary)' }}>{lastWhyExplanation.summary}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.76rem' }}>
                • {lastWhyExplanation.headMoved}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.76rem' }}>
                • {lastWhyExplanation.indexState}
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
