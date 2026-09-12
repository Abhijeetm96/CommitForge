import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Terminal,
  FolderGit2,
  Clock,
  Rocket,
  ArrowRight,
  CheckCircle2,
  Circle,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { setMode } = useApp();

  const JOURNEY_MILESTONES = [
    { id: 'getting-started', label: 'Getting Started', status: 'active' },
    { id: 'everyday-git', label: 'Everyday Git', status: 'locked' },
    { id: 'branches', label: 'Branches', status: 'locked' },
    { id: 'working-with-others', label: 'Working With Others', status: 'locked' },
    { id: 'professional-git', label: 'Professional Git', status: 'locked' },
    { id: 'expert', label: 'Expert', status: 'locked' },
  ];

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 2rem',
        background: 'radial-gradient(ellipse at 80% 20%, rgba(30, 58, 138, 0.25) 0%, #0b111e 70%)',
        minHeight: 'calc(100vh - 60px)',
        overflowY: 'auto',
      }}
    >
      <div
        className="dashboard-grid"
        style={{
          maxWidth: '1200px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
        }}
      >
        {/* Left Column: Hero & Getting Started */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div>
            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                margin: 0,
              }}
            >
              Welcome to <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #f05033 0%, #fb923c 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                CommitForge
              </span>
            </h1>
            <p
              style={{
                fontSize: '1.2rem',
                color: '#94a3b8',
                marginTop: '1rem',
                lineHeight: 1.5,
                fontWeight: 500,
              }}
            >
              Learn Git by doing. No prior knowledge needed.
            </p>
          </div>

          {/* 4 Feature Badges */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.85rem',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '0.8rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                color: '#e2e8f0',
                fontSize: '0.88rem',
                fontWeight: 600,
              }}
            >
              <Terminal size={18} color="#38bdf8" />
              <span>Interactive lessons</span>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '0.8rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                color: '#e2e8f0',
                fontSize: '0.88rem',
                fontWeight: 600,
              }}
            >
              <FolderGit2 size={18} color="#f05033" />
              <span>Real projects</span>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '0.8rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                color: '#e2e8f0',
                fontSize: '0.88rem',
                fontWeight: 600,
              }}
            >
              <Clock size={18} color="#f59e0b" />
              <span>Learn at your pace</span>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '0.8rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                color: '#e2e8f0',
                fontSize: '0.88rem',
                fontWeight: 600,
              }}
            >
              <Rocket size={18} color="#10b981" />
              <span>From zero to professional</span>
            </div>
          </div>

          {/* Primary CTA: Start Learning */}
          <div>
            <button
              onClick={() => setMode('learn')}
              style={{
                background: 'linear-gradient(135deg, #f05033 0%, #ea580c 100%)',
                color: 'white',
                border: 'none',
                padding: '1rem 2.4rem',
                borderRadius: '999px',
                fontSize: '1.1rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                boxShadow: '0 6px 20px rgba(240, 80, 51, 0.4)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              Start Learning <ArrowRight size={20} />
            </button>
          </div>

          {/* Inspiring Quote */}
          <div
            style={{
              borderLeft: '3px solid rgba(240, 80, 51, 0.5)',
              paddingLeft: '1rem',
              marginTop: '0.5rem',
            }}
          >
            <div
              style={{
                fontSize: '0.95rem',
                color: '#cbd5e1',
                fontStyle: 'italic',
                lineHeight: 1.5,
              }}
            >
              “ The best way to learn Git is to use Git. ”
            </div>
            <div
              style={{
                fontSize: '0.8rem',
                color: '#64748b',
                marginTop: '0.25rem',
              }}
            >
              Let's build something amazing together.
            </div>
          </div>
        </div>

        {/* Right Column: Mountain Summit Art & Your Journey Timeline */}
        <div
          style={{
            position: 'relative',
            background: 'linear-gradient(180deg, #0e172a 0%, #080d1a 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '2.5rem 2rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '1.5rem',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Mountain Path Graphic */}
          <div style={{ position: 'relative', height: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg
              viewBox="0 0 320 360"
              width="100%"
              height="100%"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Stars in dark sky */}
              <circle cx="40" cy="50" r="1.5" fill="#93c5fd" opacity="0.8" />
              <circle cx="110" cy="30" r="1" fill="#93c5fd" opacity="0.7" />
              <circle cx="220" cy="45" r="1.5" fill="#93c5fd" opacity="0.9" />
              <circle cx="290" cy="80" r="1" fill="#93c5fd" opacity="0.5" />
              <circle cx="60" cy="120" r="1.2" fill="#93c5fd" opacity="0.6" />

              {/* Glowing Warm Sun/Moon on Summit */}
              <circle cx="160" cy="70" r="28" fill="url(#sunGlow)" />
              <circle cx="160" cy="70" r="18" fill="#fde68a" />

              {/* Distant Mountain Peak */}
              <path
                d="M40 320 L160 90 L280 320 Z"
                fill="url(#mountainGrad)"
                opacity="0.95"
              />

              {/* Summit Flag */}
              <line x1="160" y1="90" x2="160" y2="70" stroke="#cbd5e1" strokeWidth="2" />
              <path d="M160 70 L176 77 L160 84 Z" fill="#f05033" />

              {/* Winding Golden Trail */}
              <path
                d="M160 96 C 180 130, 220 170, 180 210 C 140 250, 110 270, 160 320"
                stroke="url(#trailGrad)"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
              />

              {/* Foreground Dark Hills */}
              <path
                d="M0 340 Q80 270 160 300 T320 340 L320 360 L0 360 Z"
                fill="#070b14"
              />

              <defs>
                <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="mountainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0a0f1d" />
                </linearGradient>
                <linearGradient id="trailGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Your Journey Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 800,
                color: '#94a3b8',
                letterSpacing: '0.05em',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
              }}
            >
              Your Journey
            </div>

            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Vertical connecting line */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  bottom: '12px',
                  left: '9px',
                  width: '2px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  zIndex: 1,
                }}
              />

              {JOURNEY_MILESTONES.map((item, idx) => {
                const isActive = item.status === 'active';
                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      zIndex: 2,
                    }}
                  >
                    {isActive ? (
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: '#38bdf8',
                          boxShadow: '0 0 12px rgba(56, 189, 248, 0.8)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffffff' }} />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: '2px solid #334155',
                          background: '#0b111e',
                        }}
                      />
                    )}

                    <span
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: isActive ? 800 : 500,
                        color: isActive ? '#38bdf8' : '#64748b',
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
