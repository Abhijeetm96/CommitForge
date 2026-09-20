import React from 'react';
import { useApp } from '../../context/AppContext';
import { Flame, Boxes, Sparkles, Search, GitBranch, Container } from 'lucide-react';

export const SuiteHeaderNav: React.FC = () => {
  const { mode, setMode, setShowProblemSearch } = useApp();

  return (
    <header
      className="header-nav"
      style={{
        height: '60px',
        flexShrink: 0,
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => setMode('home')}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #f05033 0%, #326ce5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(240, 80, 51, 0.3)',
            }}
          >
            <Flame size={18} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Forge<span style={{ color: '#38bdf8' }}>Suite</span>
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '0.15rem 0.5rem',
              borderRadius: '999px',
              background: 'rgba(56, 189, 248, 0.1)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            DevOps Academies
          </span>
        </button>
      </div>

      {/* Academy Switcher Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={() => setMode('learn')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 0.9rem',
            borderRadius: '8px',
            background: 'rgba(240, 80, 51, 0.1)',
            border: '1px solid rgba(240, 80, 51, 0.3)',
            color: 'var(--git-orange)',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          title="Open CommitForge Git Academy"
        >
          <GitBranch size={15} />
          CommitForge
        </button>

        <button
          onClick={() => setMode('dockforge')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 0.9rem',
            borderRadius: '8px',
            background: 'rgba(14, 165, 233, 0.12)',
            border: '1px solid rgba(14, 165, 233, 0.35)',
            color: '#38bdf8',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          title="Open DockForge Docker & Container Academy"
        >
          <Container size={15} />
          DockForge
        </button>

        <button
          onClick={() => setMode('podforge')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 0.9rem',
            borderRadius: '8px',
            background: 'rgba(50, 108, 229, 0.1)',
            border: '1px solid rgba(50, 108, 229, 0.3)',
            color: '#60a5fa',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          title="Open PodForge Kubernetes Academy"
        >
          <Boxes size={15} />
          PodForge
        </button>

        <button
          onClick={() => setMode('roadmap')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 0.85rem',
            borderRadius: '8px',
            background: mode === 'roadmap' ? 'rgba(234, 179, 8, 0.16)' : 'transparent',
            border: mode === 'roadmap' ? '1px solid rgba(234, 179, 8, 0.45)' : '1px solid var(--border-color)',
            color: mode === 'roadmap' ? '#facc15' : 'var(--text-secondary)',
            fontSize: '0.82rem',
            fontWeight: mode === 'roadmap' ? 800 : 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: mode === 'roadmap' ? '0 0 12px rgba(234, 179, 8, 0.2)' : 'none',
          }}
          title="Explore DevOps & Cloud-Native Engineering Roadmap"
        >
          <Sparkles size={14} color={mode === 'roadmap' ? '#facc15' : '#eab308'} />
          Roadmap
        </button>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={() => setShowProblemSearch(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '6px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            fontSize: '0.75rem',
            cursor: 'pointer',
          }}
          title="Search all concepts (Ctrl+K)"
        >
          <Search size={13} />
          <span>Search</span>
          <kbd
            style={{
              padding: '0.1rem 0.3rem',
              borderRadius: '3px',
              background: 'var(--bg-surface-elevated)',
              fontSize: '0.65rem',
              fontFamily: 'var(--font-mono)',
            }}
          >
            ⌘K
          </kbd>
        </button>
      </div>
    </header>
  );
};
