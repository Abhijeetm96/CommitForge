import React, { useState } from 'react';
import { useApp, ViewMode, InstructionMode } from '../../context/AppContext';
import { PROJECTS } from '../../data/projects';
import {
  Flame,
  Settings,
  Sun,
  Moon,
  RotateCcw,
  LifeBuoy,
  GitBranch,
  CheckCircle2,
  X,
} from 'lucide-react';

export const HeaderNav: React.FC = () => {
  const {
    mode,
    setMode,
    instructionMode,
    setInstructionMode,
    theme,
    setTheme,
    currentProject,
    setProjectKey,
    resetCurrentExercise,
    setShowLostDrawer,
    repo,
  } = useApp();

  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const isIDE = mode === 'ide';
  const isClean = Object.keys(repo.workingDirectory).length === 0 || Object.keys(repo.index).length === 0;

  return (
    <header
      style={{
        height: '60px',
        background: '#0c1322',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Brand Logo & Tagline */}
      <div
        onClick={() => setMode('dashboard')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #f05033 0%, #ea580c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 2px 8px rgba(240, 80, 51, 0.4)',
          }}
        >
          <Flame size={18} />
        </div>
        <div>
          <div
            style={{
              fontSize: '1.05rem',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              color: '#f8fafc',
              lineHeight: 1.1,
            }}
          >
            CommitForge
          </div>
          <div
            className="header-tagline"
            style={{
              fontSize: '0.62rem',
              fontWeight: 600,
              color: '#64748b',
              letterSpacing: '0.02em',
            }}
          >
            Build. Break. Fix. Commit.
          </div>
        </div>
      </div>

      {/* 4 Main Nav Tabs (Learn, Practice, Labs, IDE) */}
      <nav className="header-nav-tabs" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          onClick={() => setMode('learn')}
          style={{
            background: 'none',
            border: 'none',
            color: mode === 'learn' || mode === 'first10' ? '#38bdf8' : '#94a3b8',
            fontSize: '0.9rem',
            fontWeight: mode === 'learn' || mode === 'first10' ? 800 : 600,
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.15s ease',
          }}
        >
          Learn
          {(mode === 'learn' || mode === 'first10') && (
            <div
              style={{
                position: 'absolute',
                bottom: '-8px',
                left: '20%',
                right: '20%',
                height: '2px',
                background: '#38bdf8',
                borderRadius: '999px',
                boxShadow: '0 0 8px #38bdf8',
              }}
            />
          )}
        </button>

        <button
          onClick={() => setMode('practice')}
          style={{
            background: 'none',
            border: 'none',
            color: mode === 'practice' ? '#38bdf8' : '#94a3b8',
            fontSize: '0.9rem',
            fontWeight: mode === 'practice' ? 800 : 600,
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.15s ease',
          }}
        >
          Practice
          {mode === 'practice' && (
            <div
              style={{
                position: 'absolute',
                bottom: '-8px',
                left: '20%',
                right: '20%',
                height: '2px',
                background: '#38bdf8',
                borderRadius: '999px',
                boxShadow: '0 0 8px #38bdf8',
              }}
            />
          )}
        </button>

        <button
          onClick={() => setMode('labs')}
          style={{
            background: 'none',
            border: 'none',
            color: mode === 'labs' || ['break-it', 'undo-lab', 'conflict-arena', 'hospital', 'two-dev', 'capstone', 'config-lab', 'discover'].includes(mode) ? '#38bdf8' : '#94a3b8',
            fontSize: '0.9rem',
            fontWeight: mode === 'labs' || ['break-it', 'undo-lab', 'conflict-arena', 'hospital', 'two-dev', 'capstone', 'config-lab', 'discover'].includes(mode) ? 800 : 600,
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.15s ease',
          }}
        >
          Labs
          {(mode === 'labs' || ['break-it', 'undo-lab', 'conflict-arena', 'hospital', 'two-dev', 'capstone', 'config-lab', 'discover'].includes(mode)) && (
            <div
              style={{
                position: 'absolute',
                bottom: '-8px',
                left: '20%',
                right: '20%',
                height: '2px',
                background: '#38bdf8',
                borderRadius: '999px',
                boxShadow: '0 0 8px #38bdf8',
              }}
            />
          )}
        </button>

        <button
          onClick={() => setMode('ide')}
          style={{
            background: 'none',
            border: 'none',
            color: mode === 'ide' ? '#38bdf8' : '#94a3b8',
            fontSize: '0.9rem',
            fontWeight: mode === 'ide' ? 800 : 600,
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.15s ease',
          }}
        >
          IDE
          {mode === 'ide' && (
            <div
              style={{
                position: 'absolute',
                bottom: '-8px',
                left: '20%',
                right: '20%',
                height: '2px',
                background: '#38bdf8',
                borderRadius: '999px',
                boxShadow: '0 0 8px #38bdf8',
              }}
            />
          )}
        </button>
      </nav>

      {/* Right Action Icons: Status Badge (in IDE) & Settings Gear */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', position: 'relative' }}>
        {/* I'm Lost quick helper trigger */}
        <button
          onClick={() => setShowLostDrawer(true)}
          style={{
            background: 'rgba(240, 80, 51, 0.12)',
            color: '#f05033',
            border: '1px solid rgba(240, 80, 51, 0.3)',
            borderRadius: '999px',
            padding: '0.3rem 0.75rem',
            fontSize: '0.75rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
          title="I'm Lost - Get friendly help"
        >
          <LifeBuoy size={13} /> <span className="header-lost-label">I'm Lost</span>
        </button>

        {/* IDE Git Branch & Status Pill (shown in Screen 9) */}
        {isIDE && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#10b981',
              borderRadius: '999px',
              padding: '0.25rem 0.7rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
            <span>{repo.head.type === 'branch' ? repo.head.ref : 'detached'}</span>
            <span style={{ color: '#64748b' }}>•</span>
            <span>{isClean ? 'clean' : 'modified'}</span>
          </div>
        )}

        {/* Settings Gear Button */}
        <button
          onClick={() => setShowSettingsMenu(!showSettingsMenu)}
          style={{
            background: showSettingsMenu ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            border: 'none',
            color: '#94a3b8',
            padding: '0.4rem',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.15s ease',
          }}
          title="Settings & Options"
        >
          <Settings size={18} />
        </button>

        {/* Settings Popover Menu */}
        {showSettingsMenu && (
          <div
            style={{
              position: 'absolute',
              top: '48px',
              right: 0,
              width: '260px',
              background: '#131d33',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              padding: '1rem',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem',
              zIndex: 100,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Settings & Tools
              </span>
              <button
                onClick={() => setShowSettingsMenu(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Instruction Mode */}
            <div>
              <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                EXPERIENCE LEVEL
              </label>
              <select
                value={instructionMode}
                onChange={(e) => setInstructionMode(e.target.value as InstructionMode)}
                style={{
                  width: '100%',
                  background: '#0b111e',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#f8fafc',
                  padding: '0.4rem 0.6rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="beginner">🐣 Beginner (Zero Knowledge)</option>
                <option value="intermediate">🌱 Intermediate (Guided)</option>
                <option value="advanced">👨‍💻 Advanced (Developer)</option>
                <option value="expert">🧙 Expert (Unrestricted)</option>
              </select>
            </div>

            {/* Project Switcher */}
            <div>
              <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                ACTIVE PROJECT
              </label>
              <select
                value={currentProject.id}
                onChange={(e) => setProjectKey(e.target.value)}
                style={{
                  width: '100%',
                  background: '#0b111e',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#f8fafc',
                  padding: '0.4rem 0.6rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {Object.values(PROJECTS).map((p) => (
                  <option key={p.id} value={p.id}>
                    📁 {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Toggle & Reset Exercise */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                style={{
                  flex: 1,
                  background: '#0b111e',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#94a3b8',
                  padding: '0.4rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem',
                }}
              >
                {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />} {theme === 'dark' ? 'Light' : 'Dark'}
              </button>

              <button
                onClick={() => {
                  resetCurrentExercise();
                  setShowSettingsMenu(false);
                }}
                style={{
                  flex: 1,
                  background: '#0b111e',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#f05033',
                  padding: '0.4rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem',
                }}
              >
                <RotateCcw size={13} /> Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
