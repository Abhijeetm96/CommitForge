import React from 'react';
import { GIT_FOR_HUMANS, GitTermDefinition } from '../../data/gitForHumans';
import { BookOpen, X, AlertTriangle, Lightbulb, Terminal } from 'lucide-react';

interface GitForHumansModalProps {
  termId: string | null;
  onClose: () => void;
}

export const GitForHumansModal: React.FC<GitForHumansModalProps> = ({ termId, onClose }) => {
  if (!termId) return null;

  const term: GitTermDefinition | undefined = GIT_FOR_HUMANS[termId] || Object.values(GIT_FOR_HUMANS).find(
    t => t.name.toLowerCase().includes(termId.toLowerCase()) || t.id.toLowerCase().includes(termId.toLowerCase())
  );

  if (!term) return null;

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
          maxWidth: '650px',
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
            background: 'rgba(240, 80, 51, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--git-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <BookOpen size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--git-orange)', fontWeight: 800 }}>
                Git For Humans • Plain-English Guide
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {term.name}
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
        <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Metaphor Callout */}
          <div
            style={{
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              display: 'flex',
              gap: '0.8rem',
              alignItems: 'flex-start',
            }}
          >
            <Lightbulb size={22} style={{ color: 'var(--cyan)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--cyan)', textTransform: 'uppercase' }}>
                The Mental Metaphor
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                {term.metaphor}
              </div>
            </div>
          </div>

          {/* Short Definition */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              What is it?
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
              {term.shortDefinition}
            </p>
          </div>

          {/* Real-World Analogy */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Real-World Analogy
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, background: 'var(--bg-app)', padding: '0.8rem 1rem', borderRadius: 'var(--radius-sm)' }}>
              {term.realWorldAnalogy}
            </p>
          </div>

          {/* Detailed Explanation */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              How it works in practice
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {term.detailedExplanation}
            </p>
          </div>

          {/* Common Mistake */}
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '0.9rem 1rem',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
            }}
          >
            <AlertTriangle size={20} style={{ color: 'var(--danger-red)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--danger-red)', textTransform: 'uppercase' }}>
                Common Beginner Mistake
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: 1.5 }}>
                {term.commonMistake}
              </div>
            </div>
          </div>

          {/* Command Snippet */}
          {term.commandSnippet && (
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Terminal size={14} /> Example Command
              </div>
              <pre
                style={{
                  background: 'var(--bg-terminal)',
                  color: 'var(--terminal-green)',
                  padding: '0.8rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  margin: 0,
                  overflowX: 'auto',
                }}
              >
                {term.commandSnippet}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '0.9rem 1.5rem',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-app)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
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
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
