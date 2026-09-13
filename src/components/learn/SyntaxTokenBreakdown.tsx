import React, { useState } from 'react';
import { SyntaxToken, CommandVariation } from '../../data/teacherSliceStory';
import { Terminal, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  tokens: SyntaxToken[];
  variations?: CommandVariation[];
}

export const SyntaxTokenBreakdown: React.FC<Props> = ({ tokens, variations }) => {
  const [activeTokenIdx, setActiveTokenIdx] = useState<number>(0);
  const [showVariations, setShowVariations] = useState<boolean>(false);

  const activeToken = tokens[activeTokenIdx] || tokens[0];

  return (
    <div
      style={{
        background: '#090d16',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        padding: '0.85rem',
        marginTop: '0.75rem',
        marginBottom: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
          <Terminal size={14} />
          <span>Interactive Syntax Explorer</span>
        </div>
        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Click any word to inspect its role</span>
      </div>

      {/* CLICKABLE TOKENS */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.4rem',
          background: 'rgba(0, 0, 0, 0.4)',
          padding: '0.5rem',
          borderRadius: '6px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        {tokens.map((t, idx) => {
          const isSelected = idx === activeTokenIdx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveTokenIdx(idx)}
              style={{
                background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                color: isSelected ? '#38bdf8' : '#f8fafc',
                padding: '0.35rem 0.65rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                fontWeight: 700,
                transition: 'all 0.15s ease',
              }}
            >
              {t.token}
            </button>
          );
        })}
      </div>

      {/* TOKEN EXPLANATION CARD */}
      {activeToken && (
        <div
          style={{
            marginTop: '0.5rem',
            padding: '0.6rem 0.75rem',
            background: 'rgba(56, 189, 248, 0.06)',
            borderLeft: '3px solid #38bdf8',
            borderRadius: '0 6px 6px 0',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
          }}
        >
          <Info size={16} color="#38bdf8" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#38bdf8', fontSize: '0.85rem' }}>
                {activeToken.token}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', background: 'rgba(255, 255, 255, 0.08)', padding: '0.1rem 0.35rem', borderRadius: '3px' }}>
                {activeToken.role}
              </span>
            </div>
            <p style={{ margin: '0.2rem 0 0 0', color: '#cbd5e1', fontSize: '0.8rem', lineHeight: 1.4 }}>
              {activeToken.explanation}
            </p>
          </div>
        </div>
      )}

      {/* PURPOSE-DRIVEN VARIATIONS TOGGLE */}
      {variations && variations.length > 0 && (
        <div style={{ marginTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setShowVariations(!showVariations)}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            {showVariations ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            <span>{showVariations ? 'Hide command variations' : 'Show important variations & when to use them'}</span>
          </button>

          {showVariations && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
              {variations.map((v, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                    borderRadius: '6px',
                    padding: '0.5rem 0.65rem',
                    fontSize: '0.78rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#f8fafc' }}>{v.syntax}</span>
                    <span style={{ color: '#38bdf8', fontSize: '0.72rem', fontWeight: 600 }}>{v.title}</span>
                  </div>
                  <div style={{ color: '#94a3b8', marginTop: '0.2rem' }}>{v.whenToUse}</div>
                  {v.watchOut && (
                    <div style={{ color: '#f59e0b', fontSize: '0.72rem', marginTop: '0.15rem' }}>
                      ⚠️ {v.watchOut}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
