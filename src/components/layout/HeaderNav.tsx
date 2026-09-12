import React from 'react';
import { useApp, ViewMode, InstructionMode } from '../../context/AppContext';
import { PROJECTS } from '../../data/projects';
import {
  Terminal,
  BookOpen,
  RotateCcw,
  Sun,
  Moon,
  ShieldAlert,
  GitBranch,
  Flame,
  Activity,
  Award,
  BookMarked,
  FolderGit2,
  Users,
  Compass,
  Settings,
  LifeBuoy
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
  } = useApp();

  return (
    <header className="header-nav">
      <div className="brand-section" onClick={() => setMode('dashboard')}>
        <div className="brand-logo">
          <GitBranch size={20} />
        </div>
        <div>
          <div className="brand-title">
            COMMIT<span>FORGE</span>
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.3px' }}>
            Build. Break. Fix. Commit.
          </div>
        </div>
      </div>

      <nav className="nav-tabs">
        <button className={`nav-btn ${mode === 'dashboard' ? 'active' : ''}`} onClick={() => setMode('dashboard')}>
          <BookOpen size={15} /> Home
        </button>
        <button className={`nav-btn ${mode === 'learn' || mode === 'first10' ? 'active' : ''}`} onClick={() => setMode('learn')} style={{ fontWeight: 800 }}>
          <span>🎓</span> Learn
        </button>
        <button className={`nav-btn ${mode === 'practice' ? 'active' : ''}`} onClick={() => setMode('practice')}>
          <FolderGit2 size={15} /> Practice
        </button>

        {/* Progressively Disclosed Tabs: Intermediate+ */}
        {instructionMode !== 'beginner' && (
          <>
            <button className={`nav-btn ${mode === 'labs' || ['break-it', 'undo-lab', 'conflict-arena', 'hospital', 'two-dev', 'capstone', 'config-lab', 'discover'].includes(mode) ? 'active' : ''}`} onClick={() => setMode('labs')}>
              <Flame size={15} /> Labs
            </button>
            <button className={`nav-btn ${mode === 'ide' ? 'active' : ''}`} onClick={() => setMode('ide')}>
              <Terminal size={15} /> Developer IDE
            </button>
          </>
        )}

        {/* Advanced/Expert Only */}
        {(instructionMode === 'advanced' || instructionMode === 'expert') && (
          <button className={`nav-btn ${mode === 'reference' ? 'active' : ''}`} onClick={() => setMode('reference')}>
            <BookMarked size={15} /> Reference
          </button>
        )}
      </nav>

      <div className="header-actions">
        {/* Project Selector - Shown for Intermediate and above or in IDE */}
        {instructionMode !== 'beginner' && (
          <select
            value={currentProject.id}
            onChange={(e) => setProjectKey(e.target.value)}
            style={{
              background: 'var(--bg-app)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              padding: '0.35rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
              cursor: 'pointer',
            }}
            title="Switch Active Project"
          >
            {Object.values(PROJECTS).map((p) => (
              <option key={p.id} value={p.id}>
                📁 {p.name}
              </option>
            ))}
          </select>
        )}

        {/* Training Wheel / Instruction Mode */}
        <select
          value={instructionMode}
          onChange={(e) => setInstructionMode(e.target.value as InstructionMode)}
          style={{
            background: 'var(--bg-app)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            padding: '0.35rem 0.6rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            outline: 'none',
            cursor: 'pointer',
          }}
          title="Change Experience Level (Progressive Disclosure)"
        >
          <option value="beginner">🐣 Beginner (Zero Knowledge)</option>
          <option value="intermediate">🌱 Intermediate (Guided)</option>
          <option value="advanced">👨‍💻 Advanced (Developer)</option>
          <option value="expert">🧙 Expert (Unrestricted)</option>
        </select>

        {/* 🆘 I'm Lost Button */}
        <button
          onClick={() => setShowLostDrawer(true)}
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            color: 'var(--danger-red)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.35rem 0.65rem',
            fontSize: '0.78rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
          title="Emergency Help: I'm Lost"
        >
          <LifeBuoy size={14} /> 🆘 I'm Lost
        </button>

        {/* Reset Current Exercise */}
        <button
          className="icon-btn"
          onClick={resetCurrentExercise}
          title="Reset Project to Initial Snapshot"
        >
          <RotateCcw size={15} />
        </button>

        {/* Theme Toggle */}
        <button
          className="icon-btn"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle Dark / Light Theme"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  );
};
