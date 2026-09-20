import React, { useState } from 'react';
import type { KubeConcept } from '../../data/topics/types';
import { useApp } from '../../context/AppContext';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  Award,
  ArrowRight,
} from 'lucide-react';

interface Props {
  concept: KubeConcept;
}

export const PodQuizTab: React.FC<Props> = ({ concept }) => {
  const { markConceptComplete, completedConcepts } = useApp();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const quiz = concept.quizQuestion;
  const isCompleted = completedConcepts.includes(concept.id);

  const handleSelect = (idx: number) => {
    setSelectedIdx(idx);
    if (quiz?.options[idx]?.isCorrect) {
      markConceptComplete(concept.id);
    }
  };

  const handleReset = () => {
    setSelectedIdx(null);
  };

  if (!quiz) {
    return (
      <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '1rem' }}>
        No quiz available for this concept.
      </div>
    );
  }

  const hasAnswered = selectedIdx !== null;
  const isSelectedCorrect = hasAnswered && quiz.options[selectedIdx]?.isCorrect;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.25s ease-out' }}>
      {/* Quiz Card */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: '#c084fc', fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase' }}>
            <Award size={18} />
            <span>Scenario Knowledge Check • CKA / CKAD Exam Simulation</span>
          </div>

          {hasAnswered && (
            <button
              onClick={handleReset}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.74rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <RotateCcw size={13} /> Reset Quiz
            </button>
          )}
        </div>

        {/* Question Text */}
        <div style={{ fontSize: '1.08rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.55 }}>
          {quiz.question}
        </div>

        {/* Options List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {quiz.options.map((opt, idx) => {
            const isSelected = selectedIdx === idx;
            const isCorrect = opt.isCorrect;

            let borderColor = 'var(--border-color)';
            let bgColor = 'var(--bg-surface)';

            if (hasAnswered) {
              if (isSelected) {
                borderColor = isCorrect ? '#10b981' : '#ef4444';
                bgColor = isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)';
              } else if (isCorrect) {
                borderColor = '#10b981';
                bgColor = 'rgba(16, 185, 129, 0.06)';
              }
            }

            return (
              <div
                key={idx}
                onClick={() => !hasAnswered && handleSelect(idx)}
                style={{
                  background: bgColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '10px',
                  padding: '1rem 1.15rem',
                  cursor: hasAnswered ? 'default' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        background: isSelected ? (isCorrect ? '#10b981' : '#ef4444') : 'rgba(255, 255, 255, 0.08)',
                        color: isSelected ? '#fff' : 'var(--text-secondary)',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {opt.label}
                    </span>
                    <span style={{ fontSize: '0.88rem', fontWeight: isSelected ? 700 : 500, color: '#f1f5f9' }}>
                      {opt.text}
                    </span>
                  </div>

                  {hasAnswered && (
                    <div>
                      {isCorrect && <CheckCircle2 size={18} color="#10b981" />}
                      {isSelected && !isCorrect && <XCircle size={18} color="#ef4444" />}
                    </div>
                  )}
                </div>

                {/* Explanation Reveal */}
                {hasAnswered && (isSelected || isCorrect) && (
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: isCorrect ? '#a7f3d0' : '#fca5a5',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      paddingTop: '0.5rem',
                      marginTop: '0.2rem',
                      lineHeight: 1.5,
                    }}
                  >
                    <strong>{isCorrect ? 'Correct! ' : 'Incorrect: '}</strong>
                    {opt.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Feedback Bottom Banner */}
        {hasAnswered && (
          <div
            style={{
              padding: '0.85rem 1.15rem',
              borderRadius: '8px',
              background: isSelectedCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.12)',
              border: isSelectedCorrect ? '1px solid #10b981' : '1px solid #ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.65rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              {isSelectedCorrect ? <CheckCircle2 size={18} color="#10b981" /> : <XCircle size={18} color="#ef4444" />}
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: isSelectedCorrect ? '#10b981' : '#ef4444' }}>
                {isSelectedCorrect
                  ? 'Excellent analysis! You identified the correct architectural answer.'
                  : 'Not quite. Review the explanation above and try again to reinforce the concept.'}
              </span>
            </div>

            {!isSelectedCorrect && (
              <button
                onClick={handleReset}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
