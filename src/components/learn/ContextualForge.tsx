import React from 'react';
import { HelpCircle, Sparkles, X } from 'lucide-react';

interface ContextualForgeProps {
  hint: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export const ContextualForge: React.FC<ContextualForgeProps> = ({
  hint,
  isOpen,
  onToggle,
  onClose,
}) => {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={onToggle}
        aria-label="Forge hint mentor"
        title="Need a hint? Ask Forge"
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: isOpen ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.08)',
          border: isOpen ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.15)',
          color: isOpen ? '#38bdf8' : '#cbd5e1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontSize: '1rem',
          fontWeight: 700,
        }}
      >
        <HelpCircle size={18} />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-labelledby="forge-hint-title"
          style={{
            position: 'absolute',
            top: '46px',
            right: 0,
            width: '320px',
            background: '#0f172a',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '14px',
            padding: '1.25rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.15)',
            zIndex: 100,
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #f05033, #ea580c)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <Sparkles size={13} />
              </div>
              <span id="forge-hint-title" style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.9rem' }}>
                Forge Mentor
              </span>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Close hint"
            >
              <X size={16} />
            </button>
          </div>

          <p
            style={{
              color: '#cbd5e1',
              fontSize: '0.88rem',
              lineHeight: 1.5,
              margin: '0 0 1rem 0',
            }}
          >
            {hint}
          </p>

          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#38bdf8',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
          >
            Got it
          </button>
        </div>
      )}
    </div>
  );
};
