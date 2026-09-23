import React from 'react';
import { useApp } from '../../context/AppContext';
import { useProgress } from '../../progress';
import { Flame, Search, Sun } from 'lucide-react';

export const SuiteHeaderNav: React.FC = () => {
  const { mode, setMode, setShowProblemSearch } = useApp();
  const { openSettings } = useProgress();

  return (
    <header
      className="header-nav"
      style={{
        height: '62px',
        flexShrink: 0,
        background: '#090e1a',
        borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxSizing: 'border-box',
      }}
    >
      {/* Brand & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <button
          onClick={() => setMode('roadmap')}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            cursor: 'pointer',
            padding: 0,
          }}
          title="ForgeSuite Home"
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(14, 165, 233, 0.35)',
            }}
          >
            <Flame size={19} color="#ffffff" fill="#ffffff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
            Forge<span style={{ color: '#38bdf8' }}>Suite</span>
          </span>
        </button>

        {/* Navigation Tabs Matching Reference Image */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.6rem' }}>
          {/* Learn Tab */}
          <button
            onClick={() => setMode('learn')}
            style={{
              background: 'none',
              border: 'none',
              color: mode === 'learn' ? '#ffffff' : '#94a3b8',
              fontSize: '0.86rem',
              fontWeight: mode === 'learn' ? 700 : 500,
              cursor: 'pointer',
              padding: '0.4rem 0',
              position: 'relative',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => {
              if (mode !== 'learn') e.currentTarget.style.color = '#94a3b8';
            }}
          >
            Learn
            {mode === 'learn' && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '-12px',
                  left: 0,
                  right: 0,
                  height: '3px',
                  borderRadius: '9999px',
                  background: '#38bdf8',
                  boxShadow: '0 0 8px rgba(56, 189, 248, 0.8)',
                }}
              />
            )}
          </button>

          {/* Roadmap Tab (Active) */}
          <button
            onClick={() => setMode('roadmap')}
            style={{
              background: 'none',
              border: 'none',
              color: mode === 'roadmap' ? '#ffffff' : '#94a3b8',
              fontSize: '0.86rem',
              fontWeight: mode === 'roadmap' ? 700 : 500,
              cursor: 'pointer',
              padding: '0.4rem 0',
              position: 'relative',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => {
              if (mode !== 'roadmap') e.currentTarget.style.color = '#94a3b8';
            }}
          >
            Roadmap
            {mode === 'roadmap' && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '-12px',
                  left: '-4px',
                  right: '-4px',
                  height: '3px',
                  borderRadius: '9999px',
                  background: '#0284c7',
                  boxShadow: '0 0 10px rgba(2, 132, 199, 0.9)',
                }}
              />
            )}
          </button>

          {/* Practice Tab */}
          <button
            onClick={() => setMode('dockforge')}
            style={{
              background: 'none',
              border: 'none',
              color: mode === 'dockforge' ? '#ffffff' : '#94a3b8',
              fontSize: '0.86rem',
              fontWeight: mode === 'dockforge' ? 700 : 500,
              cursor: 'pointer',
              padding: '0.4rem 0',
              position: 'relative',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => {
              if (mode !== 'dockforge') e.currentTarget.style.color = '#94a3b8';
            }}
          >
            Practice
            {mode === 'dockforge' && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '-12px',
                  left: 0,
                  right: 0,
                  height: '3px',
                  borderRadius: '9999px',
                  background: '#38bdf8',
                }}
              />
            )}
          </button>

          {/* Challenges Tab */}
          <button
            onClick={() => setMode('podforge')}
            style={{
              background: 'none',
              border: 'none',
              color: mode === 'podforge' ? '#ffffff' : '#94a3b8',
              fontSize: '0.86rem',
              fontWeight: mode === 'podforge' ? 700 : 500,
              cursor: 'pointer',
              padding: '0.4rem 0',
              position: 'relative',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => {
              if (mode !== 'podforge') e.currentTarget.style.color = '#94a3b8';
            }}
          >
            Challenges
            {mode === 'podforge' && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '-12px',
                  left: 0,
                  right: 0,
                  height: '3px',
                  borderRadius: '9999px',
                  background: '#38bdf8',
                }}
              />
            )}
          </button>

          {/* Labs Tab */}
          <button
            onClick={() => setShowProblemSearch(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '0.86rem',
              fontWeight: 500,
              cursor: 'pointer',
              padding: '0.4rem 0',
              position: 'relative',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
          >
            Labs
          </button>

          {/* Community Tab */}
          <button
            onClick={() => {
              window.open('https://github.com/Abhijeetm96/CommitForge', '_blank', 'noopener,noreferrer');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '0.86rem',
              fontWeight: 500,
              cursor: 'pointer',
              padding: '0.4rem 0',
              position: 'relative',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
          >
            Community
          </button>
        </nav>
      </div>

      {/* Right Controls: Search, Theme Toggle, Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Search Input Box */}
        <div
          onClick={() => setShowProblemSearch(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            padding: '0.4rem 0.95rem',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(148, 163, 184, 0.18)',
            color: '#64748b',
            fontSize: '0.82rem',
            cursor: 'pointer',
            width: '180px',
            transition: 'border-color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.18)')}
        >
          <Search size={14} color="#64748b" />
          <span style={{ color: '#94a3b8' }}>Search...</span>
        </div>

        {/* Theme Toggle Icon (Sun) */}
        <button
          type="button"
          onClick={() => {
            const isDark = document.documentElement.classList.contains('theme-dark') || !document.documentElement.classList.contains('theme-light');
            if (isDark) {
              document.documentElement.classList.remove('theme-dark');
              document.documentElement.classList.add('theme-light');
            } else {
              document.documentElement.classList.remove('theme-light');
              document.documentElement.classList.add('theme-dark');
            }
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.35rem',
            borderRadius: '50%',
            transition: 'color 0.15s ease',
          }}
          title="Toggle Light / Dark Mode"
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
        >
          <Sun size={18} />
        </button>

        {/* User Profile Avatar Circle "A" */}
        <button
          onClick={openSettings}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
            border: '2px solid rgba(56, 189, 248, 0.4)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.84rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)',
            transition: 'transform 0.15s ease',
          }}
          title="User Profile & Progress Backup"
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          A
        </button>
      </div>
    </header>
  );
};
