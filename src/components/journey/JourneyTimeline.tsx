import React from 'react';
import { JOURNEY_TIMELINE_STEPS, TimelineMilestone } from '../../data/journeyModel';
import { Check } from 'lucide-react';

interface JourneyTimelineProps {
  onSelectMilestone?: (milestone: TimelineMilestone) => void;
  activeCategoryId?: string | null;
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({
  onSelectMilestone,
  activeCategoryId,
}) => {
  const currentIdx = JOURNEY_TIMELINE_STEPS.findIndex((s) => s.status === 'current');
  const activeStep = currentIdx >= 0 ? JOURNEY_TIMELINE_STEPS[currentIdx] : JOURNEY_TIMELINE_STEPS[0];
  const displayStepNumber = (currentIdx >= 0 ? currentIdx : 0) + 1;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#94a3b8',
          }}
        >
          Your Journey Progression
        </span>
        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
          Step {displayStepNumber} of {JOURNEY_TIMELINE_STEPS.length}: <strong style={{ color: '#38bdf8' }}>{activeStep.label}</strong>
        </span>
      </div>

      {/* Horizontal Scrollable Timeline Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {JOURNEY_TIMELINE_STEPS.map((step, idx) => {
          const isCurrent = step.status === 'current';
          const isCompleted = step.status === 'completed';
          const isLast = idx === JOURNEY_TIMELINE_STEPS.length - 1;
          const isSelected = activeCategoryId === step.categoryId;

          return (
            <React.Fragment key={step.id}>
              {/* Step Pill */}
              <div
                onClick={() => onSelectMilestone?.(step)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '999px',
                  background: isCurrent
                    ? 'rgba(56, 189, 248, 0.14)'
                    : isSelected
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: isCurrent
                    ? '1px solid #38bdf8'
                    : isSelected
                    ? '1px solid rgba(255, 255, 255, 0.2)'
                    : '1px solid rgba(255, 255, 255, 0.06)',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                  position: 'relative',
                }}
              >
                {/* State Badge */}
                {isCompleted ? (
                  <div
                    style={{
                      width: '15px',
                      height: '15px',
                      borderRadius: '999px',
                      background: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    <Check size={10} strokeWidth={3} />
                  </div>
                ) : isCurrent ? (
                  <div
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '999px',
                      background: '#38bdf8',
                      boxShadow: '0 0 10px #38bdf8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '999px',
                        background: '#090e1a',
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '999px',
                      border: '1.5px solid #475569',
                      background: 'transparent',
                    }}
                  />
                )}

                {/* Step Label */}
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: isCurrent ? 800 : 600,
                    color: isCurrent ? '#f8fafc' : isCompleted ? '#cbd5e1' : '#64748b',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting subtle line between steps */}
              {!isLast && (
                <div
                  style={{
                    width: '16px',
                    height: '1.5px',
                    background: isCompleted
                      ? '#10b981'
                      : isCurrent
                      ? 'linear-gradient(90deg, #38bdf8 0%, rgba(255, 255, 255, 0.1) 100%)'
                      : 'rgba(255, 255, 255, 0.08)',
                    flexShrink: 0,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
