import React from 'react';
import { BentoPreviewType } from '../../data/journeyModel';

interface PreviewProps {
  type: BentoPreviewType;
  isHovered?: boolean;
}

export const CurriculumPreview: React.FC<PreviewProps> = ({ type, isHovered = false }) => {
  switch (type) {
    case 'repository':
      // Miniature repository visualization: Working Tree -> Staging Index -> HEAD
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', height: '40px' }}>
          <div
            style={{
              padding: '0.2rem 0.45rem',
              borderRadius: '4px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.62rem',
              color: '#94a3b8',
              fontFamily: 'var(--font-mono, monospace)',
            }}
          >
            work
          </div>
          <span style={{ color: '#64748b', fontSize: '0.7rem' }}>→</span>
          <div
            style={{
              padding: '0.2rem 0.45rem',
              borderRadius: '4px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              fontSize: '0.62rem',
              color: '#34d399',
              fontFamily: 'var(--font-mono, monospace)',
              transform: isHovered ? 'scale(1.05)' : 'none',
              transition: 'transform 0.2s ease',
            }}
          >
            index
          </div>
          <span style={{ color: '#64748b', fontSize: '0.7rem' }}>→</span>
          <div
            style={{
              padding: '0.2rem 0.45rem',
              borderRadius: '4px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              fontSize: '0.62rem',
              color: '#38bdf8',
              fontFamily: 'var(--font-mono, monospace)',
              fontWeight: 700,
            }}
          >
            HEAD
          </div>
        </div>
      );

    case 'staging':
      // File -> staging box with animated pulse
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', height: '40px' }}>
          <div
            style={{
              fontSize: '0.65rem',
              color: '#e2e8f0',
              background: 'rgba(255, 255, 255, 0.06)',
              padding: '0.2rem 0.4rem',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontFamily: 'var(--font-mono, monospace)',
            }}
          >
            index.html
          </div>
          <svg width="24" height="14" viewBox="0 0 24 14">
            <path
              d="M 0 7 L 18 7 M 14 3 L 20 7 L 14 11"
              fill="none"
              stroke={isHovered ? '#10b981' : '#64748b'}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <div
            style={{
              fontSize: '0.65rem',
              fontWeight: 800,
              color: '#10b981',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              padding: '0.2rem 0.5rem',
              borderRadius: '6px',
              boxShadow: isHovered ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none',
              transition: 'box-shadow 0.2s ease',
            }}
          >
            Staged
          </div>
        </div>
      );

    case 'recovery':
      // Time travel undo arrow
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', height: '40px' }}>
          <svg width="60" height="24" viewBox="0 0 60 24">
            <circle cx="10" cy="12" r="4" fill="#64748b" />
            <line x1="10" y1="12" x2="35" y2="12" stroke="#475569" strokeWidth="2" />
            <circle cx="35" cy="12" r="5" fill="#f59e0b" />
            <path
              d="M 35 6 C 25 -2, 18 2, 13 8"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.8"
              strokeDasharray="2 2"
            />
            <polygon points="12,5 12,9 16,8" fill="#f59e0b" />
          </svg>
          <span style={{ fontSize: '0.65rem', color: '#f59e0b', fontWeight: 700 }}>restore</span>
        </div>
      );

    case 'branching':
      // Small Git branching DAG
      return (
        <svg width="70" height="32" viewBox="0 0 70 32">
          {/* Main line */}
          <line x1="6" y1="22" x2="64" y2="22" stroke="#475569" strokeWidth="2" />
          <circle cx="10" cy="22" r="3.5" fill="#64748b" />
          <circle cx="30" cy="22" r="3.5" fill="#64748b" />
          <circle cx="58" cy="22" r="4" fill="#38bdf8" />
          {/* Feature branch */}
          <path
            d="M 30 22 C 38 22, 42 10, 50 10 L 64 10"
            fill="none"
            stroke={isHovered ? '#10b981' : '#10b981'}
            strokeWidth="2"
          />
          <circle cx="54" cy="10" r="3.5" fill="#10b981" />
          <circle cx="64" cy="10" r="3.5" fill="#10b981" />
        </svg>
      );

    case 'merging':
      // Two branches joining into a merge node
      return (
        <svg width="64" height="32" viewBox="0 0 64 32">
          <line x1="6" y1="24" x2="56" y2="24" stroke="#475569" strokeWidth="2" />
          <circle cx="10" cy="24" r="3.5" fill="#64748b" />
          <path
            d="M 10 24 C 20 24, 25 10, 36 10 C 44 10, 48 24, 56 24"
            fill="none"
            stroke="#a855f7"
            strokeWidth="2"
          />
          <circle cx="36" cy="10" r="3.5" fill="#a855f7" />
          <circle cx="56" cy="24" r="4.5" fill="#a855f7" stroke="#ffffff" strokeWidth="1" />
        </svg>
      );

    case 'remote':
      // Local -> Remote cloud
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', height: '40px' }}>
          <span style={{ fontSize: '0.62rem', color: '#94a3b8', fontFamily: 'monospace' }}>local</span>
          <svg width="32" height="14" viewBox="0 0 32 14">
            <line
              x1="0"
              y1="7"
              x2="26"
              y2="7"
              stroke={isHovered ? '#38bdf8' : '#64748b'}
              strokeWidth="2"
              strokeDasharray={isHovered ? '3 3' : undefined}
            />
            <polygon points="24,3 30,7 24,11" fill={isHovered ? '#38bdf8' : '#64748b'} />
          </svg>
          <span
            style={{
              fontSize: '0.62rem',
              color: '#38bdf8',
              fontWeight: 800,
              background: 'rgba(56, 189, 248, 0.12)',
              padding: '0.15rem 0.4rem',
              borderRadius: '4px',
            }}
          >
            origin
          </span>
        </div>
      );

    case 'github':
      // GitHub repo icon + PR count
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', height: '40px' }}>
          <div
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '999px',
              background: 'rgba(236, 72, 153, 0.2)',
              border: '1px solid #ec4899',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.6rem',
              color: '#ec4899',
            }}
          >
            ★
          </div>
          <span style={{ fontSize: '0.68rem', color: '#e2e8f0', fontWeight: 700 }}>
            repo / pr #42
          </span>
        </div>
      );

    case 'collaboration':
      // Review checks passed
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', height: '40px' }}>
          <div
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '999px',
              background: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.55rem',
              fontWeight: 900,
            }}
          >
            ✓
          </div>
          <span style={{ fontSize: '0.65rem', color: '#34d399', fontWeight: 700 }}>
            Approved
          </span>
        </div>
      );

    case 'rebase':
      // Linear rebase commit chain
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', height: '40px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '999px', background: '#f97316' }} />
          <div style={{ width: '12px', height: '2px', background: '#f97316' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '999px', background: '#f97316' }} />
          <div style={{ width: '12px', height: '2px', background: '#f97316' }} />
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '999px',
              background: '#f97316',
              border: '1.5px solid white',
              transform: isHovered ? 'scale(1.2)' : 'none',
              transition: 'transform 0.2s ease',
            }}
          />
        </div>
      );

    case 'internals':
      // Object model DAG: commit -> tree -> blob
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontFamily: 'monospace',
            fontSize: '0.58rem',
            color: '#a855f7',
          }}
        >
          <span>commit</span>
          <span>→</span>
          <span>tree</span>
          <span>→</span>
          <span style={{ color: '#c084fc' }}>blob</span>
        </div>
      );

    case 'actions':
      // Pipeline steps: push -> test -> deploy
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', height: '40px' }}>
          <span
            style={{
              fontSize: '0.62rem',
              color: '#38bdf8',
              background: 'rgba(56, 189, 248, 0.1)',
              padding: '0.15rem 0.35rem',
              borderRadius: '3px',
            }}
          >
            build
          </span>
          <span style={{ color: '#64748b', fontSize: '0.6rem' }}>›</span>
          <span
            style={{
              fontSize: '0.62rem',
              color: '#34d399',
              background: 'rgba(52, 211, 153, 0.1)',
              padding: '0.15rem 0.35rem',
              borderRadius: '3px',
            }}
          >
            test
          </span>
        </div>
      );

    case 'api':
      // Webhook JSON packet
      return (
        <div
          style={{
            fontSize: '0.6rem',
            fontFamily: 'monospace',
            color: '#38bdf8',
            background: 'rgba(56, 189, 248, 0.1)',
            padding: '0.2rem 0.4rem',
            borderRadius: '4px',
            border: '1px solid rgba(56, 189, 248, 0.25)',
          }}
        >
          POST /hook 200
        </div>
      );

    default:
      return null;
  }
};
