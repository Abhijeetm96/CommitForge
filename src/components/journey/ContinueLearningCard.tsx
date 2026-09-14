import React from 'react';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

interface ContinueLearningCardProps {
  onContinue: () => void;
  activeTopic?: string;
  stepDescription?: string;
  currentStep?: number;
  totalSteps?: number;
  stepTitle?: string;
}

export const ContinueLearningCard: React.FC<ContinueLearningCardProps> = ({
  onContinue,
  activeTopic = 'FOUNDATIONS',
  stepDescription = 'Mastering terminal basics, repository anatomy, and creating your very first Git save point.',
  currentStep = 1,
  totalSteps = 11,
  stepTitle = 'Terminal & Repository Basics',
}) => {
  const percent = Math.max(0, Math.round(((currentStep - 1) / totalSteps) * 100));

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #0d1729 0%, #0a1120 100%)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '16px',
        padding: '1.75rem 2rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.03)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      {/* Subtle ambient light glow in background */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '240px',
          height: '240px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          {/* Section Kicker */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#38bdf8',
              marginBottom: '0.5rem',
            }}
          >
            <Sparkles size={13} />
            <span>Continue Learning</span>
          </div>

          {/* Active Lesson Title */}
          <h2
            style={{
              fontSize: '1.75rem',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              color: '#f8fafc',
              margin: '0 0 0.4rem 0',
            }}
          >
            {activeTopic}
          </h2>

          <p
            style={{
              fontSize: '0.92rem',
              color: '#94a3b8',
              margin: 0,
              maxWidth: '620px',
              lineHeight: 1.5,
            }}
          >
            {stepDescription}
          </p>
        </div>

        {/* Big Action CTA */}
        <button
          onClick={onContinue}
          style={{
            background: 'linear-gradient(135deg, #f05033 0%, #ea580c 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '0.85rem 1.6rem',
            borderRadius: '10px',
            fontSize: '0.92rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 16px rgba(240, 80, 51, 0.4)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            flexShrink: 0,
            alignSelf: 'center',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 6px 22px rgba(240, 80, 51, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(240, 80, 51, 0.4)';
          }}
        >
          <Play size={16} fill="white" />
          <span>{currentStep === 1 ? 'Start Learning' : 'Continue Lesson'}</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Progress Bar & Step Counter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem' }}>
          <span style={{ color: '#cbd5e1', fontWeight: 600 }}>
            Step {currentStep} of {totalSteps} — {stepTitle}
          </span>
          <span style={{ color: '#38bdf8', fontWeight: 800, fontFamily: 'var(--font-mono, monospace)' }}>
            {percent}% Complete
          </span>
        </div>

        <div
          style={{
            width: '100%',
            height: '6px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '999px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${percent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #38bdf8 0%, #10b981 100%)',
              borderRadius: '999px',
              transition: 'width 0.4s ease-out',
            }}
          />
        </div>
      </div>
    </div>
  );
};
