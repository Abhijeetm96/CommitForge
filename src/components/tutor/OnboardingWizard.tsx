import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Terminal, Compass, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ isOpen, onClose }) => {
  const { setInstructionMode, setMode } = useApp();

  if (!isOpen) return null;

  const handleSelect = (experience: 'never' | 'little' | 'comfortable' | 'advanced') => {
    if (experience === 'never') {
      setInstructionMode('beginner');
      setMode('first10');
    } else if (experience === 'little') {
      setInstructionMode('beginner');
      setMode('learn');
    } else if (experience === 'comfortable') {
      setInstructionMode('intermediate');
      setMode('learn');
    } else {
      setInstructionMode('advanced');
      setMode('ide');
    }
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '680px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Banner */}
        <div
          style={{
            padding: '2rem 2rem 1.5rem',
            textAlign: 'center',
            background: 'linear-gradient(180deg, rgba(240, 80, 51, 0.18) 0%, rgba(240, 80, 51, 0) 100%)',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              padding: '0.25rem 0.75rem',
              background: 'rgba(240, 80, 51, 0.2)',
              border: '1px solid var(--git-orange)',
              borderRadius: '999px',
              color: 'var(--git-orange)',
              fontWeight: 800,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              marginBottom: '0.8rem',
            }}
          >
            Welcome to CommitForge
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            Have you used Git before?
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem', maxWidth: '480px', margin: '0.5rem auto 0', lineHeight: 1.5 }}>
            We'll customize your learning path, terminology explanations, and tools so you feel right at home.
          </p>
        </div>

        {/* Options Grid */}
        <div style={{ padding: '0 2rem 2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {/* Option 1: Never (Default / Recommended) */}
          <button
            onClick={() => handleSelect('never')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.1rem 1.25rem',
              background: 'rgba(240, 80, 51, 0.08)',
              border: '2px solid var(--git-orange)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'var(--git-orange)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                }}
              >
                🐣
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Never — I'm a complete beginner
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      background: 'var(--git-orange)',
                      color: 'white',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Recommended
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Learn the mental model first through the guided "First 10 Minutes" mission. No prior terminal or Git knowledge assumed!
                </div>
              </div>
            </div>
            <ArrowRight size={20} style={{ color: 'var(--git-orange)', flexShrink: 0 }} />
          </button>

          {/* Option 2: A little */}
          <button
            onClick={() => handleSelect('little')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.25rem',
              background: 'var(--bg-app)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: 'var(--cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                }}
              >
                🌱
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  A little — I've memorized `add`, `commit`, `push`
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                  Skip basic terminal navigation and jump straight into staging, diffs, and understanding why Git works.
                </div>
              </div>
            </div>
            <ArrowRight size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          </button>

          {/* Option 3: Comfortable */}
          <button
            onClick={() => handleSelect('comfortable')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.25rem',
              background: 'var(--bg-app)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--terminal-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                }}
              >
                🌿
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Comfortable — Ready for branching & conflicts
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                  Dive directly into the Conflict Arena, 3-way LCA merges, and remote team simulations.
                </div>
              </div>
            </div>
            <ArrowRight size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          </button>

          {/* Option 4: Advanced */}
          <button
            onClick={() => handleSelect('advanced')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.25rem',
              background: 'var(--bg-app)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(168, 85, 247, 0.15)',
                  color: '#a855f7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                }}
              >
                🚀
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Advanced / Expert — Show me the full IDE & Git Internals
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                  Unlock the full developer suite: Object DB, plumbing commands, interactive rebase, and Git Hospital.
                </div>
              </div>
            </div>
            <ArrowRight size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          </button>
        </div>
      </div>
    </div>
  );
};
