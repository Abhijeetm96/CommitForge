import React from 'react';

interface SceneQuestionProps {
  question?: string;
  subQuestion?: string;
}

export const SceneQuestion: React.FC<SceneQuestionProps> = ({ question, subQuestion }) => {
  if (!question) return null;

  return (
    <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 1.25rem' }}>
      <h2
        style={{
          fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)',
          fontWeight: 800,
          color: '#f8fafc',
          letterSpacing: '-0.02em',
          margin: 0,
          lineHeight: 1.3,
        }}
      >
        {question}
      </h2>
      {subQuestion && (
        <p
          style={{
            fontSize: '0.95rem',
            color: '#94a3b8',
            marginTop: '0.4rem',
            marginBottom: 0,
            lineHeight: 1.4,
          }}
        >
          {subQuestion}
        </p>
      )}
    </div>
  );
};
