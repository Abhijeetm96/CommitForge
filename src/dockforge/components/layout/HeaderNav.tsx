import React, { useState, useEffect } from 'react';
import { useDocker } from '../../context/DockerContext';
import { Container, BookOpen, Layers, ShieldAlert, Terminal, ArrowLeft, Boxes, ChevronDown, Flame, Sparkles } from 'lucide-react';

interface HeaderNavProps {
  onSwitchToSuite?: (mode: 'home' | 'learn' | 'podforge' | 'roadmap') => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ onSwitchToSuite }) => {
  const { mode, setMode } = useDocker();
  const [showSuiteMenu, setShowSuiteMenu] = useState(false);

  useEffect(() => {
    const handleGlobalClick = () => setShowSuiteMenu(false);
    if (showSuiteMenu) {
      window.addEventListener('click', handleGlobalClick);
      return () => window.removeEventListener('click', handleGlobalClick);
    }
  }, [showSuiteMenu]);

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
      {/* Left: Brand & Suite Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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

        {/* Suite Switcher Dropdown */}
        {onSwitchToSuite && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSuiteMenu(!showSuiteMenu);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.28rem 0.55rem',
                borderRadius: '8px',
                background: showSuiteMenu ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                color: '#cbd5e1',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Switch Academy (Forge Suite)"
            >
              <Boxes size={13} color="#38bdf8" />
              <span>Suite</span>
              <ChevronDown size={12} />
            </button>

            {showSuiteMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  top: '36px',
                  left: 0,
                  width: '280px',
                  background: 'rgba(15, 23, 42, 0.98)',
                  border: '1px solid rgba(148, 163, 184, 0.25)',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  boxShadow: '0 16px 36px rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(16px)',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.25rem' }}>
                  Forge Suite Academies
                </div>

                {/* CommitForge */}
                <button
                  onClick={() => {
                    setShowSuiteMenu(false);
                    onSwitchToSuite('learn');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.5rem 0.65rem',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'linear-gradient(135deg, #f05033, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                    <Flame size={14} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>CommitForge</div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Git &amp; Version Control</div>
                  </div>
                </button>

                {/* DockForge (Active) */}
                <button
                  onClick={() => setShowSuiteMenu(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.5rem 0.65rem',
                    borderRadius: '8px',
                    background: 'rgba(14, 165, 233, 0.15)',
                    border: '1px solid rgba(14, 165, 233, 0.35)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                    <Container size={14} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>DockForge</div>
                    <div style={{ fontSize: '0.68rem', color: '#38bdf8' }}>Docker &amp; Containers</div>
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: 700 }}>Active</div>
                </button>

                {/* PodForge */}
                <button
                  onClick={() => {
                    setShowSuiteMenu(false);
                    onSwitchToSuite('podforge');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.5rem 0.65rem',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'linear-gradient(135deg, #0284c7, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                    <Boxes size={14} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>PodForge</div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Kubernetes Academy</div>
                  </div>
                </button>

                <div style={{ height: '1px', background: 'rgba(148, 163, 184, 0.15)', margin: '0.15rem 0' }} />

                {/* Forge Suite Home Portal */}
                <button
                  onClick={() => {
                    setShowSuiteMenu(false);
                    onSwitchToSuite('home');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.5rem 0.65rem',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', flexShrink: 0 }}>
                    <Sparkles size={14} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>Forge Suite Portal</div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Unified platform gateway</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        )}
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
