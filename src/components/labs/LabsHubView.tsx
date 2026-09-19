import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BreakItView } from './BreakItView';
import { UndoLabView } from './UndoLabView';
import { ConflictArenaView } from './ConflictArenaView';
import { GitHospitalView } from './GitHospitalView';
import { TwoDevView } from './TwoDevView';
import { CapstoneView } from './CapstoneView';
import { CommandDiscoveryView } from './CommandDiscoveryView';
import { ConfigLabView } from './ConfigLabView';
import {
  Swords,
  HeartPulse,
  Bug,
  Flame,
  Compass,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Award,
  Settings,
} from 'lucide-react';

export const LabsHubView: React.FC = () => {
  const { mode, setMode, activeLab, setActiveLab } = useApp();
  const [selectedLabId, setSelectedLabId] = useState<string | null>(null);

  const activeLabView = selectedLabId || (mode === 'discover' ? 'discover' : null);

  const LAB_CARDS = [
    {
      id: 'conflict-arena',
      title: 'Conflict Arena',
      description: 'Resolve merge conflicts like a pro.',
      icon: Swords,
      color: '#ef4444',
      bgGrad: 'linear-gradient(180deg, rgba(239, 68, 68, 0.15) 0%, rgba(19, 29, 51, 0.95) 100%)',
      borderColor: 'rgba(239, 68, 68, 0.35)',
      btnBg: 'rgba(239, 68, 68, 0.2)',
      btnBorder: 'rgba(239, 68, 68, 0.4)',
    },
    {
      id: 'hospital',
      title: 'Git Hospital',
      description: 'Recover lost work and fix common problems.',
      icon: HeartPulse,
      color: '#10b981',
      bgGrad: 'linear-gradient(180deg, rgba(16, 185, 129, 0.15) 0%, rgba(19, 29, 51, 0.95) 100%)',
      borderColor: 'rgba(16, 185, 129, 0.35)',
      btnBg: 'rgba(16, 185, 129, 0.2)',
      btnBorder: 'rgba(16, 185, 129, 0.4)',
    },
    {
      id: 'undo-lab',
      title: 'Undo Lab',
      description: 'Master git restore, revert, reset, and reflog recoveries.',
      icon: RotateCcw,
      color: '#38bdf8',
      bgGrad: 'linear-gradient(180deg, rgba(56, 189, 248, 0.15) 0%, rgba(19, 29, 51, 0.95) 100%)',
      borderColor: 'rgba(56, 189, 248, 0.35)',
      btnBg: 'rgba(56, 189, 248, 0.2)',
      btnBorder: 'rgba(56, 189, 248, 0.4)',
    },
    {
      id: 'break-it',
      title: 'Break It & Fix It',
      description: 'Deliberately break repositories and learn to recover.',
      icon: Flame,
      color: '#f59e0b',
      bgGrad: 'linear-gradient(180deg, rgba(245, 158, 11, 0.15) 0%, rgba(19, 29, 51, 0.95) 100%)',
      borderColor: 'rgba(245, 158, 11, 0.35)',
      btnBg: 'rgba(245, 158, 11, 0.2)',
      btnBorder: 'rgba(245, 158, 11, 0.4)',
    },
    {
      id: 'bug-detective',
      title: 'Two-Dev Simulation',
      description: 'Simulate team workflows, upstream branches, and PRs.',
      icon: Bug,
      color: '#a855f7',
      bgGrad: 'linear-gradient(180deg, rgba(168, 85, 247, 0.15) 0%, rgba(19, 29, 51, 0.95) 100%)',
      borderColor: 'rgba(168, 85, 247, 0.35)',
      btnBg: 'rgba(168, 85, 247, 0.2)',
      btnBorder: 'rgba(168, 85, 247, 0.4)',
    },
    {
      id: 'config-lab',
      title: 'Configuration Lab',
      description: 'Configure gitconfig, aliases, credentials, and editors.',
      icon: Settings,
      color: '#06b6d4',
      bgGrad: 'linear-gradient(180deg, rgba(6, 182, 212, 0.15) 0%, rgba(19, 29, 51, 0.95) 100%)',
      borderColor: 'rgba(6, 182, 212, 0.35)',
      btnBg: 'rgba(6, 182, 212, 0.2)',
      btnBorder: 'rgba(6, 182, 212, 0.4)',
    },
    {
      id: 'capstone',
      title: 'Capstone Challenge',
      description: 'Multi-stage production project test under real pressure.',
      icon: Award,
      color: '#eab308',
      bgGrad: 'linear-gradient(180deg, rgba(234, 179, 8, 0.15) 0%, rgba(19, 29, 51, 0.95) 100%)',
      borderColor: 'rgba(234, 179, 8, 0.35)',
      btnBg: 'rgba(234, 179, 8, 0.2)',
      btnBorder: 'rgba(234, 179, 8, 0.4)',
    },
  ];

  const handleEnterLab = (id: string) => {
    setSelectedLabId(id);
    if (id === 'conflict-arena') setActiveLab('conflict-arena');
    else if (id === 'hospital') setActiveLab('hospital');
    else if (id === 'break-it') setActiveLab('break-it');
    else if (id === 'bug-detective') setActiveLab('two-dev');
    else if (id === 'undo-lab') setActiveLab('undo-lab');
    else if (id === 'capstone') setActiveLab('capstone');
    else if (id === 'config-lab') setActiveLab('config-lab');
    else if (id === 'discover') setMode('discover');
  };

  const handleBackToLabs = () => {
    setSelectedLabId(null);
    if (mode === 'discover') {
      setMode('labs');
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: '#0b111e',
        color: '#f8fafc',
        minHeight: 'calc(100vh - 60px)',
        overflowY: 'auto',
      }}
    >
      {/* If a lab is active, render lab workspace with a top Back bar */}
      {activeLabView ? (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div
            style={{
              padding: '0.6rem 1.5rem',
              background: '#0e172a',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <button
              onClick={handleBackToLabs}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <ArrowLeft size={16} /> Back to Labs
            </button>

            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#38bdf8', textTransform: 'capitalize' }}>
              {activeLabView === 'discover' ? 'Command Discovery' : activeLabView.replace('-', ' ')} Active
            </span>
          </div>

          <div style={{ flex: 1, overflow: 'hidden' }}>
            {activeLabView === 'conflict-arena' && <ConflictArenaView />}
            {activeLabView === 'hospital' && <GitHospitalView />}
            {activeLabView === 'break-it' && <BreakItView />}
            {activeLabView === 'bug-detective' && <TwoDevView />}
            {activeLabView === 'undo-lab' && <UndoLabView />}
            {activeLabView === 'capstone' && <CapstoneView />}
            {activeLabView === 'config-lab' && <ConfigLabView />}
            {activeLabView === 'discover' && <CommandDiscoveryView />}
          </div>
        </div>
      ) : (
        /* Screen 8: Labs Grid Overview */
        <div
          style={{
            maxWidth: '1050px',
            margin: '0 auto',
            width: '100%',
            padding: '3rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem',
          }}
        >
          {/* Header */}
          <div>
            <h1
              style={{
                fontSize: '2.2rem',
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              Labs
            </h1>
            <p
              style={{
                fontSize: '1.05rem',
                color: '#94a3b8',
                marginTop: '0.4rem',
                lineHeight: 1.5,
              }}
            >
              Break things. Then fix them. Build real confidence.
            </p>
          </div>

          {/* 4 Colored Cards (Screen 8) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {LAB_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  style={{
                    background: card.bgGrad,
                    border: `1px solid ${card.borderColor}`,
                    borderRadius: '20px',
                    padding: '1.75rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '260px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Icon Circle */}
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'rgba(0, 0, 0, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: card.color,
                      }}
                    >
                      <Icon size={24} />
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                        {card.title}
                      </h2>
                      <p
                        style={{
                          fontSize: '0.9rem',
                          color: '#cbd5e1',
                          marginTop: '0.4rem',
                          lineHeight: 1.45,
                        }}
                      >
                        {card.description}
                      </p>
                    </div>
                  </div>

                  {/* Enter Lab Button */}
                  <div>
                    <button
                      onClick={() => handleEnterLab(card.id)}
                      style={{
                        width: '100%',
                        background: card.btnBg,
                        border: `1px solid ${card.btnBorder}`,
                        color: '#f8fafc',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      Enter Lab <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Screen 6 Banner: What Should I Do? (Command Discovery) */}
          <div
            style={{
              marginTop: '0.5rem',
              padding: '1.25rem 1.75rem',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(19, 29, 51, 0.8) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.25rem',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '280px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Compass size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#f8fafc' }}>
                  What Should I Do? (Screen 6: Command Discovery)
                </div>
                <div style={{ fontSize: '0.86rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                  Compare commands side-by-side with risk badges (SAFE, LOW RISK, HIGH RISK) for real development scenarios.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleEnterLab('discover')}
              style={{
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'background 0.15s ease',
              }}
            >
              Open Discovery <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
