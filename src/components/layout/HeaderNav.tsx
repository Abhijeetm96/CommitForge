import React, { useState } from 'react';
import { useApp, ViewMode, InstructionMode } from '../../context/AppContext';
import { PROJECTS } from '../../data/projects';
import {
  Flame,
  Settings,
  RotateCcw,
  LifeBuoy,
  GitBranch,
  CheckCircle2,
  X,
  Film,
  BookOpen,
  Search,
  Menu,
} from 'lucide-react';

export const HeaderNav: React.FC = () => {
  const {
    mode,
    setMode,
    instructionMode,
    setInstructionMode,
    currentProject,
    setProjectKey,
    resetCurrentExercise,
    setShowLostDrawer,
    setShowGitMovie,
    setShowCommandAtlas,
    showProblemSearch,
    setShowProblemSearch,
    repo,
    setActiveLessonConcept,
  } = useApp();

  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  const isIDE = mode === 'ide';
  const isClean = Object.keys(repo.workingDirectory).length === 0 || Object.keys(repo.index).length === 0;

  return (
    <>
      <header
        className="header-nav"
        style={{
          height: '60px',
          flexShrink: 0,
          background: '#0c1322',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          maxWidth: '100vw',
          boxSizing: 'border-box',
        }}
    >
      {/* Brand Logo & Tagline */}
      <div
        onClick={() => {
          setActiveLessonConcept(null);
          setMode('learn');
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          cursor: 'pointer',
          userSelect: 'none',
          flexShrink: 0,
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
            Master Git. Build Better.
          </div>
        </div>
      </div>

      {/* Main Nav Tabs: Learn, Practice, Labs, IDE, Reference, Problem Solver */}
      <nav className="header-nav-tabs" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <button
          onClick={() => {
            setActiveLessonConcept(null);
            setMode('learn');
          }}
          style={{
            background: 'none',
            border: 'none',
            color: mode === 'learn' || mode === 'roadmap' || mode === 'first10' || mode === 'dashboard' ? '#38bdf8' : '#94a3b8',
            fontSize: '0.86rem',
            fontWeight: mode === 'learn' || mode === 'roadmap' || mode === 'first10' || mode === 'dashboard' ? 800 : 600,
            padding: '0.4rem 0.75rem',
            borderRadius: '6px',
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.15s ease',
          }}
        >
          Learn
          {(mode === 'learn' || mode === 'roadmap' || mode === 'first10' || mode === 'dashboard') && (
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
            fontSize: '0.86rem',
            fontWeight: mode === 'practice' ? 800 : 600,
            padding: '0.4rem 0.75rem',
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
            fontSize: '0.86rem',
            fontWeight: mode === 'labs' || ['break-it', 'undo-lab', 'conflict-arena', 'hospital', 'two-dev', 'capstone', 'config-lab', 'discover'].includes(mode) ? 800 : 600,
            padding: '0.4rem 0.75rem',
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
            fontSize: '0.86rem',
            fontWeight: mode === 'ide' ? 800 : 600,
            padding: '0.4rem 0.75rem',
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

        <button
          onClick={() => setMode('reference')}
          style={{
            background: 'none',
            border: 'none',
            color: mode === 'reference' ? '#38bdf8' : '#94a3b8',
            fontSize: '0.86rem',
            fontWeight: mode === 'reference' ? 800 : 600,
            padding: '0.4rem 0.75rem',
            borderRadius: '6px',
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.15s ease',
          }}
        >
          Reference
          {mode === 'reference' && (
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

        {/* Problem Solver Trigger Button in Top Nav Bar */}
        <button
          onClick={() => setShowProblemSearch(true)}
          style={{
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            color: '#38bdf8',
            fontSize: '0.82rem',
            fontWeight: 700,
            padding: '0.38rem 0.75rem',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            transition: 'all 0.15s ease',
            marginLeft: '0.35rem',
          }}
          title="Open Natural-Language Problem Solver (⌘K)"
        >
          <Search size={13} color="#38bdf8" />
          <span>Problem Solver</span>
          <kbd
            style={{
              background: 'rgba(56, 189, 248, 0.18)',
              border: '1px solid rgba(56, 189, 248, 0.28)',
              borderRadius: '4px',
              padding: '0.1rem 0.35rem',
              fontSize: '0.65rem',
              fontFamily: 'monospace',
              color: '#e0f2fe',
            }}
          >
            ⌘K
          </kbd>
        </button>
      </nav>

      {/* Right Action Icons: Theme Toggle, User Avatar, Settings & Helper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', position: 'relative', flexShrink: 0 }}>
        {/* Mobile Search Button */}
        <button
          onClick={() => setShowProblemSearch(true)}
          className="header-search-mobile-btn"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#38bdf8',
            padding: '0.35rem',
            borderRadius: '6px',
            cursor: 'pointer',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Search commands (⌘K)"
        >
          <Search size={16} />
        </button>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setShowMobileNav(!showMobileNav)}
          className="header-mobile-menu-btn"
          style={{
            background: showMobileNav ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            border: showMobileNav ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
            color: showMobileNav ? '#38bdf8' : '#f8fafc',
            padding: '0.35rem',
            borderRadius: '6px',
            cursor: 'pointer',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Toggle Navigation Menu"
        >
          {showMobileNav ? <X size={18} /> : <Menu size={18} />}
        </button>
        {/* I'm Lost quick helper trigger (Section 16) */}
        <button
          onClick={() => setShowLostDrawer(true)}
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            color: '#cbd5e1',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '0.35rem 0.7rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
          title="I have a Git problem - Get friendly help"
        >
          <LifeBuoy size={13} color="#f05033" /> <span className="header-lost-label">Problem?</span>
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

            {/* Reset Exercise */}
            <div style={{ marginTop: '0.2rem' }}>

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

    {/* Mobile Navigation Drawer */}
    {showMobileNav && (
      <div
        className="academy-mobile-drawer-backdrop"
        onClick={() => setShowMobileNav(false)}
        style={{
          position: 'fixed',
          top: '54px',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 140,
        }}
      >
        <div
          className="academy-mobile-drawer-content"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '100%',
            background: 'rgba(8, 13, 25, 0.98)',
            padding: '1.25rem 1rem 2rem 1rem',
            overflowY: 'auto',
            gap: '1.25rem',
          }}
        >
          {/* Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Navigation
            </div>
            {[
              { id: 'learn', label: 'Git Academy', desc: '18 Canonical Topics & Live Sandbox' },
              { id: 'practice', label: 'Practice Missions', desc: 'Guided interactive developer challenges' },
              { id: 'labs', label: 'Labs', desc: 'Break, diagnose & recovery simulations' },
              { id: 'ide', label: 'Developer IDE', desc: 'Simulated professional developer workspace' },
              { id: 'reference', label: 'Command Reference', desc: 'Detailed options, flags & internals' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveLessonConcept(null);
                  setMode(item.id as any);
                  setShowMobileNav(false);
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  background: mode === item.id ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: mode === item.id ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '0.94rem', fontWeight: 800, color: mode === item.id ? '#38bdf8' : '#f8fafc' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                  {item.desc}
                </div>
              </button>
            ))}
          </div>

          {/* Quick Tools */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Tools
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  setShowMobileNav(false);
                  setShowProblemSearch(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 0.75rem',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  color: '#cbd5e1',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Search size={14} color="#38bdf8" />
                Problem Solver
              </button>
              <button
                onClick={() => {
                  setShowMobileNav(false);
                  setShowCommandAtlas(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 0.75rem',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  color: '#cbd5e1',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <BookOpen size={14} color="#f59e0b" />
                Command Atlas
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
  );
};
