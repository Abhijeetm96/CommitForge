import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Flame,
  Boxes,
  GitBranch,
  Terminal,
  ShieldCheck,
  Zap,
  Container,
  Cloud,
  Activity,
  Sparkles,
  Cpu,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setMode, setShowProblemSearch } = useApp();

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-color)',
        background: 'linear-gradient(180deg, rgba(8, 12, 20, 0.85) 0%, rgba(5, 8, 17, 0.98) 100%)',
        color: 'var(--text-secondary)',
        padding: '3.5rem 2rem 2.5rem',
        marginTop: 'auto',
        position: 'relative',
        zIndex: 20,
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {/* Top 4-Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Column 1: Brand & Philosophy */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #f05033 0%, #326ce5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 10px rgba(240, 80, 51, 0.3)',
                }}
              >
                <Flame size={18} color="#fff" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', color: '#fff' }}>
                Forge<span style={{ color: '#38bdf8' }}>Suite</span>
              </span>
            </div>

            <p style={{ fontSize: '0.86rem', lineHeight: 1.6, color: '#94a3b8', margin: '0 0 1.25rem' }}>
              High-fidelity in-browser engineering academies. Real command engines, visual DAGs, live cluster topologies, and incident recovery triage. Zero slides. Zero fluff.
            </p>

            {/* Live System Status Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '999px',
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.25)',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#4ade80',
              }}
            >
              <div
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#22c55e',
                  boxShadow: '0 0 8px #22c55e',
                }}
              />
              <span>2 Simulation Engines Operational</span>
            </div>
          </div>

          {/* Column 2: Available & Upcoming Academies */}
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
              Academies
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <button
                  onClick={() => setMode('learn')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    cursor: 'pointer',
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--git-orange)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  <GitBranch size={14} color="var(--git-orange)" />
                  <span>CommitForge (Git &amp; Version Control)</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => setMode('podforge')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    cursor: 'pointer',
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  <Boxes size={14} color="#38bdf8" />
                  <span>PodForge (Kubernetes Control Plane)</span>
                </button>
              </li>

              <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', color: '#64748b' }}>
                <Container size={14} color="#0ea5e9" />
                <span>Docker (Containers &amp; Image Layers)</span>
                <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'rgba(14, 165, 233, 0.12)', color: '#0ea5e9', fontWeight: 700 }}>SOON</span>
              </li>

              <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', color: '#64748b' }}>
                <Cpu size={14} color="#ef4444" />
                <span>Ansible (Configuration &amp; Automation)</span>
                <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', fontWeight: 700 }}>SOON</span>
              </li>

              <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', color: '#64748b' }}>
                <Cloud size={14} color="#a855f7" />
                <span>Terraform &amp; OpenTofu</span>
                <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'rgba(168, 85, 247, 0.12)', color: '#a855f7', fontWeight: 700 }}>SOON</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Interactive Laboratories */}
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
              Simulators &amp; Labs
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
              <li>
                <button
                  onClick={() => {
                    setMode('learn');
                  }}
                  style={{ background: 'none', border: 'none', padding: 0, color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                >
                  <Terminal size={14} color="var(--git-orange)" />
                  <span>Interactive Git DAG Visualizer</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setMode('podforge');
                  }}
                  style={{ background: 'none', border: 'none', padding: 0, color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                >
                  <Activity size={14} color="#38bdf8" />
                  <span>Live K8s Cluster Mesh Topology</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setMode('hospital');
                  }}
                  style={{ background: 'none', border: 'none', padding: 0, color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                >
                  <ShieldCheck size={14} color="#ef4444" />
                  <span>Git Hospital (16 Emergency Triage Cases)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setMode('conflict-arena');
                  }}
                  style={{ background: 'none', border: 'none', padding: 0, color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                >
                  <Sparkles size={14} color="#f59e0b" />
                  <span>Merge Conflict Arena</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowProblemSearch(true)}
                  style={{ background: 'none', border: 'none', padding: 0, color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                >
                  <Zap size={14} color="#38bdf8" />
                  <span>Natural-Language Problem Solver (⌘K)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Shortcuts & Platform Specs */}
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
              Platform &amp; Shortcuts
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8' }}>Global Problem Search</span>
                <kbd style={{ padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#cbd5e1' }}>⌘K / Ctrl+K</kbd>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8' }}>Clear Terminal</span>
                <kbd style={{ padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#cbd5e1' }}>Ctrl+L</kbd>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8' }}>Execution Environment</span>
                <span style={{ color: '#38bdf8', fontWeight: 600 }}>100% In-Browser</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#94a3b8' }}>Cloud Fees</span>
                <span style={{ color: '#4ade80', fontWeight: 700 }}>$0.00 (Zero Cloud Account Needed)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Tech Stack Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(148, 163, 184, 0.12)',
            paddingTop: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.78rem',
            color: '#64748b',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>&copy; {new Date().getFullYear()} Forge Suite. MIT License.</span>
            <span>&bull;</span>
            <span>Built for developers who learn by building, breaking, and fixing.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={13} color="#eab308" />
              <span>React 19 &bull; Vite &bull; TypeScript</span>
            </span>
            <span style={{ color: 'rgba(148, 163, 184, 0.3)' }}>|</span>
            <span style={{ color: '#94a3b8' }}>Agentation MCP Enabled</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
