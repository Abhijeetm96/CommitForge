import React from 'react';
import { useDocker } from '../../context/DockerContext';
import { Container, BookOpen, Layers, ShieldAlert, Terminal, ArrowLeft } from 'lucide-react';

interface HeaderNavProps {
  onSwitchToSuite?: (mode: 'home' | 'learn' | 'podforge') => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ onSwitchToSuite }) => {
  const { mode, setMode } = useDocker();

  return (
    <header
      style={{
        height: '60px',
        flexShrink: 0,
        background: 'var(--docker-surface)',
        borderBottom: '1px solid var(--docker-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Left: Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {onSwitchToSuite && (
          <button
            onClick={() => onSwitchToSuite('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'none',
              border: 'none',
              color: 'var(--docker-text-secondary)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '0.3rem 0.6rem',
              borderRadius: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <ArrowLeft size={15} />
            <span>Suite</span>
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(14, 165, 233, 0.4)',
            }}
          >
            <Container size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', color: '#fff', lineHeight: 1.2 }}>
              Dock<span style={{ color: 'var(--docker-blue)' }}>Forge</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--docker-text-secondary)', fontWeight: 600 }}>
              Docker &amp; Container Engine Academy
            </div>
          </div>
        </div>
      </div>

      {/* Center: Mode Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          onClick={() => setMode('academy')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 0.9rem',
            borderRadius: '8px',
            background: mode === 'academy' ? 'var(--docker-blue-light)' : 'transparent',
            border: mode === 'academy' ? '1px solid var(--docker-border-active)' : '1px solid transparent',
            color: mode === 'academy' ? 'var(--docker-blue)' : 'var(--docker-text-secondary)',
            fontSize: '0.82rem',
            fontWeight: mode === 'academy' ? 700 : 500,
            cursor: 'pointer',
          }}
        >
          <BookOpen size={15} />
          Academy Syllabus
        </button>

        <button
          onClick={() => setMode('visualizer')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 0.9rem',
            borderRadius: '8px',
            background: mode === 'visualizer' ? 'var(--docker-blue-light)' : 'transparent',
            border: mode === 'visualizer' ? '1px solid var(--docker-border-active)' : '1px solid transparent',
            color: mode === 'visualizer' ? 'var(--docker-blue)' : 'var(--docker-text-secondary)',
            fontSize: '0.82rem',
            fontWeight: mode === 'visualizer' ? 700 : 500,
            cursor: 'pointer',
          }}
        >
          <Layers size={15} />
          Container Visualizer
        </button>

        <button
          onClick={() => setMode('labs')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 0.9rem',
            borderRadius: '8px',
            background: mode === 'labs' ? 'var(--docker-blue-light)' : 'transparent',
            border: mode === 'labs' ? '1px solid var(--docker-border-active)' : '1px solid transparent',
            color: mode === 'labs' ? 'var(--docker-blue)' : 'var(--docker-text-secondary)',
            fontSize: '0.82rem',
            fontWeight: mode === 'labs' ? 700 : 500,
            cursor: 'pointer',
          }}
        >
          <ShieldAlert size={15} />
          Triage Labs
        </button>

        <button
          onClick={() => setMode('ide')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 0.9rem',
            borderRadius: '8px',
            background: mode === 'ide' ? 'var(--docker-blue-light)' : 'transparent',
            border: mode === 'ide' ? '1px solid var(--docker-border-active)' : '1px solid transparent',
            color: mode === 'ide' ? 'var(--docker-blue)' : 'var(--docker-text-secondary)',
            fontSize: '0.82rem',
            fontWeight: mode === 'ide' ? 700 : 500,
            cursor: 'pointer',
          }}
        >
          <Terminal size={15} />
          Container IDE
        </button>
      </div>

      {/* Right: Active Daemon Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.75rem',
            borderRadius: '999px',
            background: 'rgba(34, 197, 94, 0.12)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#4ade80',
          }}
        >
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
          Virtual Daemon 26.0.0
        </div>
      </div>
    </header>
  );
};
