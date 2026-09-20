import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Layers,
  FlaskConical,
  Code2,
  Activity,
  CheckCircle2,
  Boxes,
  ChevronDown,
  Flame,
  Sparkles,
  Home,
} from 'lucide-react';

interface HeaderNavProps {
  onSwitchToSuite?: (mode: 'home' | 'learn' | 'roadmap') => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ onSwitchToSuite }) => {
  const { mode, setMode, clusterState, completedConcepts } = useApp();
  const [showSuiteMenu, setShowSuiteMenu] = useState(false);

  const nodeCount = Object.keys(clusterState.nodes).length;
  const podCount = Object.keys(clusterState.pods).length;

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
        minHeight: '60px',
        maxHeight: '60px',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.25rem',
        boxSizing: 'border-box',
        zIndex: 100,
      }}
    >
      {/* Brand & Cluster Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Brand */}
        <div
          onClick={() => (onSwitchToSuite ? onSwitchToSuite('home') : setMode('academy'))}
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', userSelect: 'none' }}
          title="Go to Forge Suite Home"
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #326ce5 0%, #1e40af 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 0 15px rgba(50, 108, 229, 0.4)',
            }}
          >
            <Compass size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1.15 }}>
              PodForge
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--k8s-cyan)', fontWeight: 600 }}>
              Deploy. Break. Scale.
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

                {/* PodForge (Active) */}
                <button
                  onClick={() => {
                    setShowSuiteMenu(false);
                    setMode('academy');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.5rem 0.65rem',
                    borderRadius: '8px',
                    background: 'rgba(56, 189, 248, 0.12)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
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
                  <div style={{ fontSize: '0.65rem', color: '#4ade80', fontWeight: 700 }}>Active</div>
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

                {/* DevOps & Cloud Roadmap */}
                <button
                  onClick={() => {
                    setShowSuiteMenu(false);
                    onSwitchToSuite('roadmap');
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
                  <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'rgba(234, 179, 8, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#facc15', flexShrink: 0 }}>
                    <Sparkles size={14} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>DevOps Roadmap</div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>9-stage engineering path</div>
                  </div>
                </button>

                <div style={{ height: '1px', background: 'rgba(148, 163, 184, 0.15)', margin: '0.2rem 0' }} />
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.25rem' }}>
                  Coming Soon (DevOps Roadmap)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
                  {[
                    { name: 'Dockernaut', tag: 'Docker & OCI', color: '#0ea5e9' },
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
                        if (onSwitchToSuite) onSwitchToSuite('home');
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
        )}

        {/* Live Cluster Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '999px',
            padding: '0.2rem 0.65rem',
            fontSize: '0.72rem',
            color: '#10b981',
            fontWeight: 700,
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
          <span>Cluster Active ({nodeCount} Nodes, {podCount} Pods)</span>
        </div>
      </div>

      {/* Navigation Modes */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        {onSwitchToSuite && (
          <button
            onClick={() => onSwitchToSuite('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.42rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Home size={15} />
            <span>Home</span>
          </button>
        )}

        {[
          { id: 'academy' as const, label: 'Pod Academy', icon: Layers },
          { id: 'labs' as const, label: 'Triage Labs', icon: FlaskConical },
          { id: 'ide' as const, label: 'Cluster IDE', icon: Code2 },
          { id: 'cluster' as const, label: 'Live Mesh', icon: Activity },
        ].map((item) => {
          const isActive = mode === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setMode(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.42rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: isActive ? 800 : 600,
                color: isActive ? '#fff' : 'var(--text-secondary)',
                background: isActive ? 'var(--k8s-blue)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? '0 2px 10px rgba(50, 108, 229, 0.35)' : 'none',
              }}
            >
              <Icon size={15} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Progress & Quick Stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            background: 'var(--bg-card)',
            padding: '0.35rem 0.75rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
          }}
        >
          <CheckCircle2 size={14} color="#10b981" />
          <span>{completedConcepts.length} Concepts Mastered</span>
        </div>
      </div>
    </header>
  );
};
