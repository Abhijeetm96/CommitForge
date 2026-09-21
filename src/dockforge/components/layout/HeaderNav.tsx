import React, { useState, useEffect } from 'react';
import { useDocker } from '../../context/DockerContext';
import {
  Container,
  BookOpen,
  Code,
  Trophy,
  FileText,
  Search,
  Sun,
  User,
  Boxes,
  ChevronDown,
  Flame,
  Sparkles,
} from 'lucide-react';

interface HeaderNavProps {
  onSwitchToSuite?: (mode: 'home' | 'learn' | 'podforge' | 'roadmap') => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ onSwitchToSuite }) => {
  const { mode, setMode, completedConceptIds } = useDocker();
  const [showSuiteMenu, setShowSuiteMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const totalConcepts = 42;
  const progressPct = Math.round((completedConceptIds.length / totalConcepts) * 100);

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
        height: '62px',
        flexShrink: 0,
        background: '#0b1120',
        borderBottom: '1px solid var(--docker-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.25rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* LEFT: BRAND & SUITE SWITCHER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 12px rgba(14, 165, 233, 0.45)',
            }}
          >
            <Container size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em', color: '#fff', lineHeight: 1.1 }}>
              Dock<span style={{ color: 'var(--docker-blue)' }}>Forge</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--docker-text-muted)', fontWeight: 600 }}>
              Master Docker by Doing
            </div>
          </div>
        </div>

        {/* Suite Switcher Dropdown */}
        {onSwitchToSuite && (
          <div style={{ position: 'relative', marginLeft: '0.5rem' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSuiteMenu(!showSuiteMenu);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.28rem 0.6rem',
                borderRadius: '8px',
                background: showSuiteMenu ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--docker-border)',
                color: '#cbd5e1',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
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
                  top: '38px',
                  left: 0,
                  width: '280px',
                  background: 'rgba(15, 23, 42, 0.98)',
                  border: '1px solid var(--docker-border)',
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
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', padding: '0 0.25rem' }}>
                  Forge Suite Academies
                </div>

                <button
                  onClick={() => {
                    setShowSuiteMenu(false);
                    onSwitchToSuite('learn');
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0.65rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}
                >
                  <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'linear-gradient(135deg, #f05033, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <Flame size={14} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>CommitForge</div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Git &amp; Version Control</div>
                  </div>
                </button>

                <button
                  onClick={() => setShowSuiteMenu(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0.65rem', borderRadius: '8px', background: 'rgba(14, 165, 233, 0.15)', border: '1px solid rgba(14, 165, 233, 0.35)', cursor: 'pointer', textAlign: 'left', width: '100%' }}
                >
                  <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <Container size={14} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>DockForge</div>
                    <div style={{ fontSize: '0.68rem', color: '#38bdf8' }}>Docker &amp; Containers</div>
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: 700 }}>Active</div>
                </button>

                <button
                  onClick={() => {
                    setShowSuiteMenu(false);
                    onSwitchToSuite('podforge');
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0.65rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}
                >
                  <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'linear-gradient(135deg, #0284c7, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <Boxes size={14} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>PodForge</div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Kubernetes Academy</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CENTER: SCREENSHOT NAVIGATION PILLS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          onClick={() => setMode('academy')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 1.1rem',
            borderRadius: '999px',
            background: mode === 'academy' ? 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' : 'rgba(255, 255, 255, 0.04)',
            border: mode === 'academy' ? 'none' : '1px solid transparent',
            color: '#fff',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: mode === 'academy' ? '0 2px 10px rgba(14, 165, 233, 0.4)' : 'none',
          }}
        >
          <BookOpen size={15} />
          Learn
        </button>

        <button
          onClick={() => setMode('ide')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 1.1rem',
            borderRadius: '999px',
            background: mode === 'ide' ? 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' : 'rgba(255, 255, 255, 0.04)',
            border: 'none',
            color: mode === 'ide' ? '#fff' : 'var(--docker-text-secondary)',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Code size={15} />
          Practice
        </button>

        <button
          onClick={() => setMode('labs')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 1.1rem',
            borderRadius: '999px',
            background: mode === 'labs' ? 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' : 'rgba(255, 255, 255, 0.04)',
            border: 'none',
            color: mode === 'labs' ? '#fff' : 'var(--docker-text-secondary)',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Trophy size={15} />
          Challenges
        </button>

        <button
          onClick={() => setMode('visualizer')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 1.1rem',
            borderRadius: '999px',
            background: mode === 'visualizer' ? 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' : 'rgba(255, 255, 255, 0.04)',
            border: 'none',
            color: mode === 'visualizer' ? '#fff' : 'var(--docker-text-secondary)',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <FileText size={15} />
          Reference
        </button>
      </div>

      {/* RIGHT: SEARCH, PROGRESS BAR, THEME TOGGLE, PROFILE AVATAR */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Search Input Box */}
        <div style={{ position: 'relative', width: '200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--docker-text-muted)' }} />
          <input
            type="text"
            placeholder="Search concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.4rem 0.75rem 0.4rem 2.2rem',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--docker-border)',
              color: '#fff',
              fontSize: '0.78rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Your Progress Widget */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', width: '100px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontWeight: 700, color: 'var(--docker-text-muted)' }}>
            <span>Progress</span>
            <span style={{ color: '#4ade80' }}>{progressPct}%</span>
          </div>
          <div style={{ width: '100%', height: '5px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
            <div style={{ width: `${progressPct}%`, height: '100%', background: 'linear-gradient(90deg, #22c55e, #4ade80)' }} />
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--docker-border)',
            color: '#cbd5e1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          title="Toggle Theme"
        >
          <Sun size={15} />
        </button>

        {/* Profile Avatar */}
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            color: '#fff',
            fontWeight: 800,
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(14, 165, 233, 0.4)',
          }}
        >
          A
        </div>
      </div>
    </header>
  );
};
