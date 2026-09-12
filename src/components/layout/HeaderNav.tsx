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
          <BookOpen size={15} /> Dashboard
        </button>
        <button className={`nav-btn ${mode === 'first10' ? 'active' : ''}`} onClick={() => setMode('first10')} style={{ color: 'var(--git-orange)', fontWeight: 800 }}>
          <span>🐣</span> First 10 Mins
        </button>
        <button className={`nav-btn ${mode === 'learn' ? 'active' : ''}`} onClick={() => setMode('learn')}>
          <FolderGit2 size={15} /> Curriculum
        </button>
        <button className={`nav-btn ${mode === 'discover' ? 'active' : ''}`} onClick={() => setMode('discover')}>
          <Compass size={15} /> What Should I Do?
        </button>
        <button className={`nav-btn ${mode === 'break-it' ? 'active' : ''}`} onClick={() => setMode('break-it')}>
          <Flame size={15} /> Break It
        </button>
        <button className={`nav-btn ${mode === 'ide' ? 'active' : ''}`} onClick={() => setMode('ide')}>
          <Terminal size={15} /> Developer IDE
        </button>

        {/* Progressively Disclosed Tabs */}
        {instructionMode !== 'beginner' && (
          <>
            <button className={`nav-btn ${mode === 'undo-lab' ? 'active' : ''}`} onClick={() => setMode('undo-lab')}>
              <RotateCcw size={15} /> Undo Lab
            </button>
            <button className={`nav-btn ${mode === 'conflict-arena' ? 'active' : ''}`} onClick={() => setMode('conflict-arena')}>
              <ShieldAlert size={15} /> Conflict Arena
            </button>
            <button className={`nav-btn ${mode === 'hospital' ? 'active' : ''}`} onClick={() => setMode('hospital')}>
              <Activity size={15} /> Git Hospital
            </button>
            <button className={`nav-btn ${mode === 'two-dev' ? 'active' : ''}`} onClick={() => setMode('two-dev')}>
              <Users size={15} /> Team Sim
            </button>
            <button className={`nav-btn ${mode === 'config-lab' ? 'active' : ''}`} onClick={() => setMode('config-lab')}>
              <Settings size={15} /> Config Lab
            </button>
          </>
        )}

        <button className={`nav-btn ${mode === 'reference' ? 'active' : ''}`} onClick={() => setMode('reference')}>
          <BookMarked size={15} /> Encyclopedia
        </button>
      </nav>

      <div className="header-actions">
        {/* Project Selector */}
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
          title="Instruction Mode (Training Wheel Removal)"
        >
          <option value="beginner">🟢 Beginner (Detailed)</option>
          <option value="intermediate">🔵 Intermediate (Clues)</option>
          <option value="advanced">🟡 Advanced (Goal Only)</option>
          <option value="expert">🔴 Expert (Zero Hints)</option>
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
