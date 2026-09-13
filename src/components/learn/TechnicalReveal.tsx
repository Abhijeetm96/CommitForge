import React from 'react';
import { Terminal, Lightbulb, Code } from 'lucide-react';

interface TechnicalRevealProps {
  mentalModelText?: string;
  technicalTerm?: string;
  technicalCommand?: string;
  onProceedToTerminal: () => void;
}

export const TechnicalReveal: React.FC<TechnicalRevealProps> = ({
  mentalModelText,
  technicalTerm,
  technicalCommand,
  onProceedToTerminal,
}) => {
  return (
    <div
      style={{
        maxWidth: '680px',
        width: '100%',
        margin: '0 auto',
        textAlign: 'center',
      }}
    >
      {/* Bold Core Mental Model Statement */}
      {mentalModelText && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12), rgba(14, 165, 233, 0.05))',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '16px',
            padding: '1.5rem 1.75rem',
            marginBottom: '1.25rem',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#38bdf8',
              fontSize: '0.8rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.6rem',
            }}
          >
            <Lightbulb size={16} />
            <span>Key Takeaway</span>
          </div>
          <div
            style={{
              fontSize: 'clamp(1.15rem, 2.2vw, 1.45rem)',
              fontWeight: 800,
              color: '#f8fafc',
              lineHeight: 1.4,
            }}
          >
            “{mentalModelText}”
          </div>
        </div>
      )}

      {/* Progressive Technical Reveal */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          background: 'rgba(15, 23, 42, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        {technicalTerm && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem' }}>
            <span style={{ color: '#64748b' }}>Technical Concept:</span>
            <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{technicalTerm}</span>
          </div>
        )}
        {technicalCommand && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem' }}>
            <span style={{ color: '#64748b' }}>Real Git Command:</span>
            <code
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                color: '#38bdf8',
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontWeight: 700,
              }}
            >
              {technicalCommand}
            </code>
          </div>
        )}
      </div>

      {/* CTA Button to Terminal */}
      <button
        onClick={onProceedToTerminal}
        style={{
          padding: '0.85rem 2.25rem',
          borderRadius: '999px',
          background: 'linear-gradient(135deg, #f05033 0%, #ea580c 100%)',
          color: '#ffffff',
          border: 'none',
          fontWeight: 800,
          fontSize: '1rem',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.6rem',
          boxShadow: '0 4px 16px rgba(240, 80, 51, 0.4)',
          transition: 'transform 0.15s ease',
        }}
      >
        <Terminal size={18} />
        <span>Try It in Terminal</span>
      </button>
    </div>
  );
};
