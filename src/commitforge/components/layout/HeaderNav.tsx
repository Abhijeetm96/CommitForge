import React, { useState } from 'react';
import { useApp, InstructionMode } from '../../context/AppContext';
import { PROJECTS } from '../../data/projects';
import {
  Flame,
  Settings,
  Sun,
  Moon,
  RotateCcw,
  LifeBuoy,
  BookOpen,
  Search,
  X,
  ChevronDown,
  Boxes,
  Container,
  Sparkles,
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
    setShowCommandAtlas,
    setShowProblemSearch,
    repo,
    setActiveLessonConcept,
    academyTab,
    setAcademyTab,
  } = useApp();

  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showSuiteMenu, setShowSuiteMenu] = useState(false);

  // Light mode feature toggle (currently disabled; code preserved)
  const LIGHT_MODE_ENABLED = false;

  const isIDE = mode === 'ide';
  const isClean = Object.keys(repo.workingDirectory).length === 0 || Object.keys(repo.index).length === 0;

  React.useEffect(() => {
    const handleGlobalClick = () => {
      setShowSuiteMenu(false);
      setShowSettingsMenu(false);
    };
    if (showSuiteMenu || showSettingsMenu) {
      window.addEventListener('click', handleGlobalClick);
      return () => window.removeEventListener('click', handleGlobalClick);
    }
  }, [showSuiteMenu, showSettingsMenu]);

  return (
    <>
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
          padding: '0 1rem',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          maxWidth: '100vw',
          boxSizing: 'border-box',
        }}
    >
      {/* Brand & Suite Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
        {/* Quick return to Forge Suite Home when inside CommitForge */}
        {mode !== 'home' && (
          <button
            onClick={() => {
              setActiveLessonConcept(null);
              setMode('home');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.55rem',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              color: '#cbd5e1',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#38bdf8';
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#cbd5e1';
              e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.2)';
            }}
            title="Return to Forge Suite Portal"
          >
            <Boxes size={13} color="#38bdf8" />
            <span className="header-lost-label">Suite Home</span>
          </button>
        )}

        {/* Brand Logo & Tagline */}
        <div
          onClick={() => {
            setActiveLessonConcept(null);
            setMode(mode === 'home' ? 'home' : 'learn');
          }}
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
              background:
                mode === 'home'
                  ? 'linear-gradient(135deg, #0284c7 0%, #ea580c 100%)'
                  : 'linear-gradient(135deg, #f05033 0%, #ea580c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow:
                mode === 'home'
                  ? '0 2px 10px rgba(56, 189, 248, 0.35)'
                  : '0 2px 8px rgba(240, 80, 51, 0.4)',
            }}
          >
            {mode === 'home' ? <Boxes size={18} /> : <Flame size={18} />}
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
              {mode === 'home' ? 'Forge Suite' : 'CommitForge'}
            </div>
            <div
              className="header-tagline"
              style={{
                fontSize: '0.62rem',
                fontWeight: 600,
                color: mode === 'home' ? '#64748b' : '#fb923c',
                letterSpacing: '0.02em',
              }}
            >
              {mode === 'home' ? 'Interactive Cloud & DevOps Academies' : 'Git & Version Control Academy'}
            </div>
          </div>
        </div>

        {/* Suite Switcher Dropdown */}
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

              {/* Item 1: CommitForge */}
              <button
                onClick={() => {
                  setShowSuiteMenu(false);
                  setActiveLessonConcept(null);
                  setMode('learn');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.5rem 0.65rem',
                  borderRadius: '8px',
                  background: mode !== 'home' ? 'rgba(240, 80, 51, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  border: mode !== 'home' ? '1px solid rgba(240, 80, 51, 0.3)' : '1px solid transparent',
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
                {mode !== 'home' && mode !== 'podforge' && <div style={{ fontSize: '0.65rem', color: '#4ade80', fontWeight: 700 }}>Active</div>}
              </button>

              {/* Item 2: PodForge */}
              <button
                onClick={() => {
                  setShowSuiteMenu(false);
                  setActiveLessonConcept(null);
                  setMode('podforge');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.5rem 0.65rem',
                  borderRadius: '8px',
                  background: mode === 'podforge' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  border: mode === 'podforge' ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
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
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Kubernetes &amp; Cloud-Native</div>
                </div>
                {mode === 'podforge' && <div style={{ fontSize: '0.65rem', color: '#4ade80', fontWeight: 700 }}>Active</div>}
              </button>

              {/* Item 3: DockForge */}
              <button
                onClick={() => {
                  setShowSuiteMenu(false);
                  setActiveLessonConcept(null);
                  setMode('dockforge');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.5rem 0.65rem',
                  borderRadius: '8px',
                  background: mode === 'dockforge' ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: mode === 'dockforge' ? '1px solid rgba(14, 165, 233, 0.35)' : '1px solid transparent',
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
                {mode === 'dockforge' && <div style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: 700 }}>Active</div>}
              </button>

              <div style={{ height: '1px', background: 'rgba(148, 163, 184, 0.15)', margin: '0.15rem 0' }} />

              {/* Item 3: Forge Suite Home Portal */}
              <button
                onClick={() => {
                  setShowSuiteMenu(false);
                  setActiveLessonConcept(null);
                  setMode('home');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.5rem 0.65rem',
                  borderRadius: '8px',
                  background: mode === 'home' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  border: mode === 'home' ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
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
                {mode === 'home' && <div style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: 700 }}>Active</div>}
              </button>

              {/* Item 4: DevOps & Cloud Roadmap */}
              <button
                onClick={() => {
                  setShowSuiteMenu(false);
                  setActiveLessonConcept(null);
                  setMode('roadmap');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.5rem 0.65rem',
                  borderRadius: '8px',
                  background: mode === 'roadmap' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: mode === 'roadmap' ? '1px solid rgba(234, 179, 8, 0.35)' : '1px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'rgba(234, 179, 8, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#facc15', flexShrink: 0 }}>
                  <Sparkles size={14} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>DevOps Roadmap</div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>9-stage engineering path</div>
                </div>
                {mode === 'roadmap' && <div style={{ fontSize: '0.65rem', color: '#facc15', fontWeight: 700 }}>Active</div>}
              </button>

              <div style={{ height: '1px', background: 'rgba(148, 163, 184, 0.15)', margin: '0.2rem 0' }} />
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.25rem' }}>
                Coming Soon (DevOps Roadmap)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
                {[
                  { name: 'HelmCraft', tag: 'Helm & Charts', color: '#0ea5e9' },
                  { name: 'PipelinePilot', tag: 'CI/CD & Actions', color: '#f59e0b' },
                  { name: 'TerraStack', tag: 'Terraform & IaC', color: '#a855f7' },
                  { name: 'ObserveIQ', tag: 'Prometheus & SRE', color: '#10b981' },
                  { name: 'DevSecShield', tag: 'DevSecOps & Vault', color: '#f43f5e' },
                  { name: 'LinuxCore', tag: 'Linux Kernel', color: '#06b6d4' },
                ].map((item) => (
                  <div
                    key={item.name}
                    onClick={() => {
                      setShowSuiteMenu(false);
                      setActiveLessonConcept(null);
                      setMode('home');
                    }}
                    style={{
                      padding: '0.35rem 0.5rem',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      cursor: 'pointer',
                    }}
                    title={`${item.name} (${item.tag}) - Coming Soon! Click to view on Home`}
                  >
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#cbd5e1' }}>{item.name}</div>
                    <div style={{ fontSize: '0.62rem', color: item.color }}>{item.tag}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center Nav: Suite-level navigation on Home, CommitForge tabs inside CommitForge */}
      {mode === 'home' ? (
        <nav className="header-nav-tabs" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => {
              const el = document.getElementById('academies');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#cbd5e1',
              fontSize: '0.86rem',
              fontWeight: 600,
              padding: '0.4rem 0.75rem',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#38bdf8'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#cbd5e1'; }}
          >
            Academies
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('devops-stack');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#cbd5e1',
              fontSize: '0.86rem',
              fontWeight: 600,
              padding: '0.4rem 0.75rem',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#38bdf8'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#cbd5e1'; }}
          >
            DevOps Roadmap
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('why-suite');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#cbd5e1',
              fontSize: '0.86rem',
              fontWeight: 600,
              padding: '0.4rem 0.75rem',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#38bdf8'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#cbd5e1'; }}
          >
            Pedagogy
          </button>
        </nav>
      ) : (
        <nav className="header-nav-tabs" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {(() => {
            const isUniverseActive = mode === 'universe';
            const isLearnActive =
              (mode === 'learn' || mode === 'roadmap' || mode === 'first10' || mode === 'dashboard');

            return (
              <>
                <button
                  onClick={() => {
                    setActiveLessonConcept(null);
                    setMode('learn');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isLearnActive ? '#38bdf8' : '#94a3b8',
                    fontSize: '0.86rem',
                    fontWeight: isLearnActive ? 800 : 600,
                    padding: '0.4rem 0.75rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Learn
                  {isLearnActive && (
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

                {/* Concepts Universe (All 71 Concepts) Nav Button - Independent Page */}
                <button
                  onClick={() => {
                    setMode('universe');
                  }}
                  style={{
                    background: isUniverseActive ? 'rgba(245, 158, 11, 0.14)' : 'none',
                    border: isUniverseActive ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid transparent',
                    color: isUniverseActive ? '#f59e0b' : '#94a3b8',
                    fontSize: '0.86rem',
                    fontWeight: isUniverseActive ? 800 : 600,
                    padding: '0.4rem 0.75rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.15s ease',
                  }}
                  title="Explore all 71 Git concepts, 219 variations, and 79 scenarios in the Universe page"
                >
                  <Sparkles size={13} color={isUniverseActive ? '#f59e0b' : '#94a3b8'} />
                  <span>71 Concepts</span>
                  {isUniverseActive && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-8px',
                        left: '15%',
                        right: '15%',
                        height: '2px',
                        background: '#f59e0b',
                        borderRadius: '999px',
                        boxShadow: '0 0 8px #f59e0b',
                      }}
                    />
                  )}
                </button>
              </>
            );
          })()}

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
      )}

      {/* Right Action Icons: Theme Toggle, User Avatar, Settings & Helper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', position: 'relative', flexShrink: 0 }}>
        {mode === 'home' ? (
          <>
            {/* Live Academies Status Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.28rem 0.65rem',
                borderRadius: '999px',
                background: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#4ade80',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#22c55e',
                  boxShadow: '0 0 6px #22c55e',
                }}
              />
              <span className="header-lost-label">2 Academies Online</span>
            </div>

            {/* Quick Launch CommitForge */}
            <button
              onClick={() => {
                setActiveLessonConcept(null);
                setMode('learn');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                background: 'rgba(240, 80, 51, 0.12)',
                border: '1px solid rgba(240, 80, 51, 0.35)',
                color: '#fff',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Launch CommitForge (Git & Version Control)"
            >
              <Flame size={14} color="#f05033" />
              <span className="header-lost-label">CommitForge</span>
            </button>

            {/* Quick Launch PodForge */}
            <button
              onClick={() => {
                setActiveLessonConcept(null);
                setMode('podforge');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                color: '#fff',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Launch PodForge (Kubernetes & Cloud-Native)"
            >
              <Boxes size={14} color="#38bdf8" />
              <span className="header-lost-label">PodForge</span>
            </button>
          </>
        ) : (
          <>
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
          </>
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
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '1rem',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem',
              zIndex: 100,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Settings & Tools
              </span>
              <button
                onClick={() => setShowSettingsMenu(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                aria-label="Close settings"
              >
                <X size={14} />
              </button>
            </div>

            {/* Instruction Mode */}
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                EXPERIENCE LEVEL
              </label>
              <select
                value={instructionMode}
                onChange={(e) => setInstructionMode(e.target.value as InstructionMode)}
                style={{
                  width: '100%',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
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
              <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                ACTIVE PROJECT
              </label>
              <select
                value={currentProject.id}
                onChange={(e) => setProjectKey(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
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

            {/* Theme Toggle & Reset Exercise - light mode disabled; code preserved */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
              {LIGHT_MODE_ENABLED && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  style={{
                    flex: 1,
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                    padding: '0.45rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                  }}
                  title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {theme === 'dark' ? <Sun size={13} color="#f59e0b" /> : <Moon size={13} color="#0284c7" />}
                  {theme === 'dark' ? 'Light' : 'Dark'}
                </button>
              )}

              <button
                onClick={() => {
                  resetCurrentExercise();
                  setShowSettingsMenu(false);
                }}
                style={{
                  flex: 1,
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                  color: '#f05033',
                  padding: '0.45rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
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
              {mode === 'home' ? 'Forge Suite Gateways' : 'CommitForge Navigation'}
            </div>
            {mode === 'home' ? (
              <>
                <button
                  onClick={() => {
                    setActiveLessonConcept(null);
                    setMode('learn');
                    setShowMobileNav(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, rgba(240, 80, 51, 0.15) 0%, rgba(234, 88, 12, 0.15) 100%)',
                    border: '1px solid rgba(240, 80, 51, 0.35)',
                    color: '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Flame size={18} color="#f05033" />
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>CommitForge</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Git &amp; Version Control Academy</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#f05033', fontWeight: 700 }}>Launch</div>
                </button>

                <button
                  onClick={() => {
                    setActiveLessonConcept(null);
                    setMode('podforge');
                    setShowMobileNav(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    color: '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Boxes size={18} color="#38bdf8" />
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>PodForge</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Kubernetes &amp; Cloud-Native Academy</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>Launch</div>
                </button>

                <div style={{ height: '1px', background: 'rgba(148, 163, 184, 0.15)', margin: '0.4rem 0' }} />

                <button
                  onClick={() => {
                    setShowMobileNav(false);
                    const el = document.getElementById('academies');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    color: '#cbd5e1',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  Live Academies
                </button>

                <button
                  onClick={() => {
                    setShowMobileNav(false);
                    const el = document.getElementById('devops-stack');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    color: '#cbd5e1',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  DevOps Roadmap
                </button>

                <button
                  onClick={() => {
                    setShowMobileNav(false);
                    const el = document.getElementById('why-suite');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    color: '#cbd5e1',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  Pedagogical Standard
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setActiveLessonConcept(null);
                    setMode('home');
                    setShowMobileNav(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#38bdf8',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <Boxes size={15} />
                  <span>← Return to Forge Suite Home</span>
                </button>

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

                {/* Launch PodForge Button */}
                <button
                  onClick={() => {
                    setActiveLessonConcept(null);
                    setMode('podforge');
                    setShowMobileNav(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    color: '#fff',
                    marginTop: '0.35rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Boxes size={18} color="#38bdf8" />
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>PodForge</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Kubernetes &amp; Cloud-Native Academy</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>In-App</div>
                </button>
              </>
            )}
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
