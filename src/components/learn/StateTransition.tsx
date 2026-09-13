import React from 'react';
import { ArrowRight, Check } from 'lucide-react';

interface StateTransitionProps {
  comparison: {
    before: {
      working: string;
      staging: string;
      repo: string;
      remote?: string;
    };
    after: {
      working: string;
      staging: string;
      repo: string;
      remote?: string;
    };
  };
}

export const StateTransition: React.FC<StateTransitionProps> = ({ comparison }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        maxWidth: '820px',
        width: '100%',
        margin: '0 auto 1.25rem',
        flexWrap: 'wrap',
      }}
    >
      {/* BEFORE COLUMN */}
      <div
        style={{
          flex: '1 1 300px',
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '1.1rem 1.25rem',
        }}
      >
        <div
          style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#94a3b8',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <span>BEFORE</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
            <span style={{ color: '#64748b' }}>Working Tree:</span>
            <span style={{ fontWeight: 600 }}>{comparison.before.working}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
            <span style={{ color: '#64748b' }}>Staging Box:</span>
            <span style={{ fontWeight: 600 }}>{comparison.before.staging}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
            <span style={{ color: '#64748b' }}>Repository:</span>
            <span style={{ fontWeight: 600 }}>{comparison.before.repo}</span>
          </div>
          {comparison.before.remote && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
              <span style={{ color: '#64748b' }}>Remote:</span>
              <span style={{ fontWeight: 600 }}>{comparison.before.remote}</span>
            </div>
          )}
        </div>
      </div>

      {/* TRANSITION ARROW */}
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'rgba(56, 189, 248, 0.12)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#38bdf8',
          flexShrink: 0,
        }}
      >
        <ArrowRight size={18} />
      </div>

      {/* AFTER COLUMN */}
      <div
        style={{
          flex: '1 1 300px',
          background: 'rgba(34, 197, 94, 0.06)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '12px',
          padding: '1.1rem 1.25rem',
        }}
      >
        <div
          style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#22c55e',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Check size={14} />
          <span>AFTER (WHAT CHANGED)</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e2e8f0' }}>
            <span style={{ color: '#64748b' }}>Working Tree:</span>
            <span style={{ fontWeight: 600 }}>{comparison.after.working}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e2e8f0' }}>
            <span style={{ color: '#64748b' }}>Staging Box:</span>
            <span style={{ fontWeight: 700, color: '#4ade80' }}>{comparison.after.staging}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e2e8f0' }}>
            <span style={{ color: '#64748b' }}>Repository:</span>
            <span style={{ fontWeight: 700, color: '#38bdf8' }}>{comparison.after.repo}</span>
          </div>
          {comparison.after.remote && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e2e8f0' }}>
              <span style={{ color: '#64748b' }}>Remote:</span>
              <span style={{ fontWeight: 700, color: '#a855f7' }}>{comparison.after.remote}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
