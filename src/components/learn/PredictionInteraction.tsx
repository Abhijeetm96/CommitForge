import React, { useState } from 'react';
import { PredictionChoice } from '../../data/focusLessonScenes';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface PredictionInteractionProps {
  choices: PredictionChoice[];
  onCorrectAnswer: (choice: PredictionChoice) => void;
  onSelectAnswer?: (choice: PredictionChoice) => void;
}

export const PredictionInteraction: React.FC<PredictionInteractionProps> = ({
  choices,
  onCorrectAnswer,
  onSelectAnswer,
}) => {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const handleSelect = (choice: PredictionChoice) => {
    setSelectedChoiceId(choice.id);
    setFeedback({
      isCorrect: choice.isCorrect,
      text: choice.explanation,
    });

    if (onSelectAnswer) {
      onSelectAnswer(choice);
    }
  };

  const selectedChoice = choices.find(c => c.id === selectedChoiceId);

  return (
    <div style={{ maxWidth: '640px', width: '100%', margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {choices.map(choice => {
          const isSelected = selectedChoiceId === choice.id;
          const showAnswerFeedback = isSelected && feedback !== null;

          return (
            <button
              key={choice.id}
              onClick={() => handleSelect(choice)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.9rem 1.25rem',
                borderRadius: '10px',
                background: isSelected
                  ? choice.isCorrect
                    ? 'rgba(34, 197, 94, 0.12)'
                    : 'rgba(234, 179, 8, 0.12)'
                  : 'rgba(255, 255, 255, 0.04)',
                border: isSelected
                  ? choice.isCorrect
                    ? '1.5px solid #22c55e'
                    : '1.5px solid #eab308'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                color: '#f8fafc',
                fontSize: '0.95rem',
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{choice.text}</span>
              {showAnswerFeedback && (
                <span style={{ marginLeft: '0.5rem', flexShrink: 0 }}>
                  {choice.isCorrect ? (
                    <CheckCircle2 size={18} color="#22c55e" />
                  ) : (
                    <AlertCircle size={18} color="#eab308" />
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {feedback && (
        <div
          style={{
            marginTop: '1rem',
            padding: '0.85rem 1.1rem',
            borderRadius: '8px',
            background: feedback.isCorrect ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
            border: feedback.isCorrect ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(234, 179, 8, 0.3)',
            color: '#e2e8f0',
            fontSize: '0.9rem',
            lineHeight: 1.45,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.6rem',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {feedback.isCorrect ? (
            <CheckCircle2 size={18} color="#22c55e" style={{ flexShrink: 0, marginTop: '2px' }} />
          ) : (
            <AlertCircle size={18} color="#eab308" style={{ flexShrink: 0, marginTop: '2px' }} />
          )}
          <div style={{ flex: 1 }}>
            <strong>{feedback.isCorrect ? 'Correct thinking!' : 'Good intuition, but here is how Git works:'}</strong>{' '}
            {feedback.text}
          </div>
        </div>
      )}

      {selectedChoice && selectedChoice.isCorrect && (
        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <button
            onClick={() => onCorrectAnswer(selectedChoice)}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(34, 197, 94, 0.35)',
              transition: 'transform 0.15s ease',
            }}
          >
            <span>Proceed to Action</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
