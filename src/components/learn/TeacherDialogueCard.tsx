import React from 'react';
import { TeachingStep } from '../../data/teacherSliceStory';
import { ContextualTermPopover } from './ContextualTermPopover';
import { useApp } from '../../context/AppContext';
import { ArrowRight, CheckCircle2, Lock, Sparkles } from 'lucide-react';

interface Props {
  step: TeachingStep;
  canAdvance: boolean;
  onAdvance: () => void;
  isLastStep?: boolean;
}

export const TeacherDialogueCard: React.FC<Props> = ({
  step,
  canAdvance,
  onAdvance,
  isLastStep = false,
}) => {
  const { kidMode } = useApp();

  // Determine helpful disabled message
  const getDisabledHint = (): string => {
    if (step.masteryRequirements?.prediction) {
      return kidMode ? 'Pick your guess above to continue!' : 'Select your prediction above to proceed';
    }
    if (step.masteryRequirements?.stateTransition) {
      return step.expectedCommand
        ? kidMode
          ? `Type \`${step.expectedCommand}\` (or click "🪄 Fill" in terminal!)`
          : `Execute \`${step.expectedCommand}\` in the terminal to proceed`
        : 'Satisfy the repository requirement to proceed';
    }
    if (step.masteryRequirements?.reflection) {
      return kidMode ? 'Answer the fun question above to continue!' : 'Answer the conceptual question above to proceed';
    }
    return 'Complete the current teaching moment to continue';
  };

  return (
    <div
      style={{
        background: 'rgba(11, 17, 32, 0.95)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        flexShrink: 0,
      }}
    >
      {/* LEFT: MENTOR AVATAR & DIALOGUE */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', flex: 1, minWidth: 0 }}>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: kidMode
              ? 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)'
              : 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            flexShrink: 0,
            boxShadow: kidMode ? '0 2px 8px rgba(245, 158, 11, 0.35)' : '0 2px 8px rgba(56, 189, 248, 0.25)',
          }}
          title={kidMode ? "Your Friendly Git Guide" : "Senior Developer Mentor"}
        >
          {kidMode ? '🧙‍♂️' : '👨‍💻'}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: kidMode ? '#fbbf24' : '#38bdf8',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {kidMode ? '🌟 Magic Git Guide' : 'Senior Dev Mentor'}
            </span>
            <span style={{ color: '#475569', fontSize: '0.72rem' }}>•</span>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc' }}>
              {step.title}
            </span>
          </div>

          <div
            style={{
              color: '#e2e8f0',
              fontSize: '0.84rem',
              lineHeight: 1.45,
              whiteSpace: 'pre-line',
              maxHeight: '75px',
              overflowY: 'auto',
              paddingRight: '0.5rem',
            }}
          >
            {step.seniorDeveloperDialogue}
          </div>

          {/* INLINE CONTEXTUAL TERMS & PLAIN ENGLISH TEASER */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.45rem', marginTop: '0.35rem' }}>
            <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{kidMode ? 'Magic Toys:' : 'Terms:'}</span>
            <ContextualTermPopover termKey="working tree">
              {kidMode ? '🎨 Lego Desk' : 'Working Tree'}
            </ContextualTermPopover>
            <ContextualTermPopover termKey="staging area">
              {kidMode ? '🎒 Backpack' : 'Staging Area'}
            </ContextualTermPopover>
            <ContextualTermPopover termKey="commit">
              {kidMode ? '📸 Polaroid Photo' : 'Commit'}
            </ContextualTermPopover>
            <ContextualTermPopover termKey="repository">
              {kidMode ? '📚 Photo Album' : 'Repository'}
            </ContextualTermPopover>
            <ContextualTermPopover termKey="head">
              {kidMode ? '📍 Sticker' : 'HEAD'}
            </ContextualTermPopover>
          </div>
        </div>
      </div>

      {/* RIGHT: ADVANCE ACTION BUTTON */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem', flexShrink: 0 }}>
        <button
          type="button"
          onClick={onAdvance}
          disabled={!canAdvance}
          style={{
            background: canAdvance
              ? 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)'
              : 'rgba(255, 255, 255, 0.05)',
            color: canAdvance ? '#0f172a' : '#64748b',
            border: canAdvance ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0.65rem 1.4rem',
            borderRadius: '6px',
            fontWeight: 800,
            fontSize: '0.84rem',
            cursor: canAdvance ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            boxShadow: canAdvance ? '0 2px 12px rgba(56, 189, 248, 0.3)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          <span>{step.actionPrompt || (isLastStep ? 'Complete Milestone' : 'Continue')}</span>
          {canAdvance ? <ArrowRight size={15} /> : <Lock size={13} />}
        </button>

        {!canAdvance && (
          <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontStyle: 'italic' }}>
            {getDisabledHint()}
          </span>
        )}
        {canAdvance && (
          <span style={{ fontSize: '0.68rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <CheckCircle2 size={11} /> Ready to proceed
          </span>
        )}
      </div>
    </div>
  );
};
