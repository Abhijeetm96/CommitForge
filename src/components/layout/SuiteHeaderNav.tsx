import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useProgress } from '../../progress';
import { Flame, Boxes, Sparkles, Search, GitBranch, Container, Database, Menu, X } from 'lucide-react';
import './suiteHeaderNav.css';

export const SuiteHeaderNav: React.FC = () => {
  const { mode, setMode, setShowProblemSearch } = useApp();
  const { openSettings } = useProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header className="header-nav suite-header-nav">
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => {
            setMode('home');
            setMobileMenuOpen(false);
          }}
          className="suite-brand-btn"
          aria-label="ForgeSuite Home"
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
          <span className="suite-brand-title" style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            Forge<span style={{ color: '#38bdf8' }}>Suite</span>
          </span>
          <span className="suite-brand-badge">
            DevOps Academies
          </span>
        </button>
      </div>

      {/* Academy Switcher Buttons (Desktop & Tablet) */}
      <div className="suite-nav-links">
        <button
          onClick={() => setMode('learn')}
          className="suite-nav-btn"
          style={{
            background: mode === 'learn' ? 'rgba(240, 80, 51, 0.22)' : 'rgba(240, 80, 51, 0.1)',
            border: '1px solid rgba(240, 80, 51, 0.3)',
            color: 'var(--git-orange)',
          }}
          title="Open CommitForge Git Academy"
          aria-label="CommitForge Git Academy"
        >
          <GitBranch size={15} />
          <span className="suite-nav-text">CommitForge</span>
        </button>

        <button
          onClick={() => setMode('dockforge')}
          className="suite-nav-btn"
          style={{
            background: mode === 'dockforge' ? 'rgba(14, 165, 233, 0.24)' : 'rgba(14, 165, 233, 0.12)',
            border: '1px solid rgba(14, 165, 233, 0.35)',
            color: '#38bdf8',
          }}
          title="Open DockForge Docker & Container Academy"
          aria-label="DockForge Docker & Container Academy"
        >
          <Container size={15} />
          <span className="suite-nav-text">DockForge</span>
        </button>

        <button
          onClick={() => setMode('podforge')}
          className="suite-nav-btn"
          style={{
            background: mode === 'podforge' ? 'rgba(50, 108, 229, 0.22)' : 'rgba(50, 108, 229, 0.1)',
            border: '1px solid rgba(50, 108, 229, 0.3)',
            color: '#60a5fa',
          }}
          title="Open PodForge Kubernetes Academy"
          aria-label="PodForge Kubernetes Academy"
        >
          <Boxes size={15} />
          <span className="suite-nav-text">PodForge</span>
        </button>

        <button
          onClick={() => setMode('roadmap')}
          className="suite-nav-btn"
          style={{
            background: mode === 'roadmap' ? 'rgba(234, 179, 8, 0.16)' : 'transparent',
            border: mode === 'roadmap' ? '1px solid rgba(234, 179, 8, 0.45)' : '1px solid var(--border-color)',
            color: mode === 'roadmap' ? '#facc15' : 'var(--text-secondary)',
            boxShadow: mode === 'roadmap' ? '0 0 12px rgba(234, 179, 8, 0.2)' : 'none',
          }}
          title="Explore DevOps & Cloud-Native Engineering Roadmap"
          aria-label="DevOps & Cloud-Native Engineering Roadmap"
        >
          <Sparkles size={14} color={mode === 'roadmap' ? '#facc15' : '#eab308'} />
          <span className="suite-nav-text">Roadmap</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="suite-right-controls">
        <button
          onClick={openSettings}
          className="suite-control-btn"
          title="Backup & Restore Learning Progress"
          aria-label="Backup & Restore Learning Progress"
        >
          <Database size={13} color="#38bdf8" />
          <span className="suite-control-text">Progress</span>
        </button>

        <button
          onClick={() => setShowProblemSearch(true)}
          className="suite-control-btn"
          title="Search all concepts (Ctrl+K or ⌘K)"
          aria-label="Search all concepts"
        >
          <Search size={13} />
          <span className="suite-control-text">Search</span>
          <kbd
            className="suite-control-kbd"
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

        {/* Mobile Hamburger Toggle (< 640px) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="suite-mobile-toggle-btn"
          title={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Drawer (< 640px) */}
      {mobileMenuOpen && (
        <div className="suite-mobile-drawer">
          <button
            onClick={() => {
              setMode('learn');
              setMobileMenuOpen(false);
            }}
            className="suite-mobile-item"
            style={{ borderLeft: '3px solid var(--git-orange)' }}
          >
            <GitBranch size={16} color="var(--git-orange)" />
            <div>
              <div style={{ color: 'var(--git-orange)' }}>CommitForge</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Interactive Git Graph Academy</div>
            </div>
          </button>

          <button
            onClick={() => {
              setMode('dockforge');
              setMobileMenuOpen(false);
            }}
            className="suite-mobile-item"
            style={{ borderLeft: '3px solid #38bdf8' }}
          >
            <Container size={16} color="#38bdf8" />
            <div>
              <div style={{ color: '#38bdf8' }}>DockForge</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Docker & Containerization Engine</div>
            </div>
          </button>

          <button
            onClick={() => {
              setMode('podforge');
              setMobileMenuOpen(false);
            }}
            className="suite-mobile-item"
            style={{ borderLeft: '3px solid #60a5fa' }}
          >
            <Boxes size={16} color="#60a5fa" />
            <div>
              <div style={{ color: '#60a5fa' }}>PodForge</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Kubernetes Orchestration Academy</div>
            </div>
          </button>

          <button
            onClick={() => {
              setMode('roadmap');
              setMobileMenuOpen(false);
            }}
            className="suite-mobile-item"
            style={{ borderLeft: '3px solid #facc15' }}
          >
            <Sparkles size={16} color="#facc15" />
            <div>
              <div style={{ color: '#facc15' }}>DevOps Roadmap</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>9-Stage Engineering Curriculum</div>
            </div>
          </button>

          <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.2rem 0' }} />

          <button
            onClick={() => {
              openSettings();
              setMobileMenuOpen(false);
            }}
            className="suite-mobile-item"
          >
            <Database size={16} color="#38bdf8" />
            <span>Backup & Restore Progress</span>
          </button>

          <button
            onClick={() => {
              setShowProblemSearch(true);
              setMobileMenuOpen(false);
            }}
            className="suite-mobile-item"
          >
            <Search size={16} />
            <span>Search Concept Database (⌘K)</span>
          </button>
        </div>
      )}
    </header>
  );
};
