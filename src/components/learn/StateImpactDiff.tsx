import React from 'react';
import { StateDiff } from '../../data/teacherSliceStory';
import { PlusCircle, ShieldCheck } from 'lucide-react';

interface Props {
  diff: StateDiff;
}

export const StateImpactDiff: React.FC<Props> = ({ diff }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '0.85rem',
        marginTop: '0.75rem',
        marginBottom: '0.75rem',
      }}
    >
      {/* WHAT CHANGED */}
      <div
        style={{
          background: 'rgba(34, 197, 94, 0.08)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '8px',
          padding: '0.85rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#4ade80',
            fontWeight: 800,
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '0.5rem',
          }}
        >
          <PlusCircle size={15} />
          <span>What Changed</span>
        </div>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#f1f5f9', fontSize: '0.82rem', lineHeight: 1.5 }}>
          {diff.changed.map((item, idx) => (
            <li key={idx} style={{ marginBottom: '0.25rem' }}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* WHAT DID NOT CHANGE */}
      <div
        style={{
          background: 'rgba(148, 163, 184, 0.06)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '8px',
          padding: '0.85rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#94a3b8',
            fontWeight: 800,
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '0.5rem',
          }}
        >
          <ShieldCheck size={15} color="#38bdf8" />
          <span>What Did NOT Change</span>
        </div>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.82rem', lineHeight: 1.5 }}>
          {diff.notChanged.map((item, idx) => (
            <li key={idx} style={{ marginBottom: '0.25rem' }}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
