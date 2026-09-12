import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Terminal } from '../terminal/Terminal';
import { CodeEditor } from '../editor/CodeEditor';
import { FileExplorer } from '../editor/FileExplorer';
import {
  Wrench,
  ChevronDown,
  ArrowRight,
  GitBranch,
  ShieldAlert,
  CheckCircle2,
  Play,
  RotateCcw,
} from 'lucide-react';

interface PracticeMission {
  id: string;
  level: number;
  title: string;
  description: string;
  skills: string[];
  initialCommand?: string;
  solutionCommand: string;
}

export const PracticeView: React.FC = () => {
  const { executeCommand, repo } = useApp();
  const [selectedLevel, setSelectedLevel] = useState<number>(3);
  const [activeMission, setActiveMission] = useState<PracticeMission | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const MISSIONS: PracticeMission[] = [
    {
      id: 'level-1-init',
      level: 1,
      title: 'Initialize & First Commit',
      description: 'You just started a new portfolio. Set up version control and create your very first project commit.',
      skills: ['git init', 'git status', 'git add', 'git commit'],
      solutionCommand: 'git add . && git commit -m "First commit"',
    },
    {
      id: 'level-2-staging',
      level: 2,
      title: 'Selective Staging Mission',
      description: 'You edited both style.css and secrets.txt. Stage ONLY style.css and commit without leaking secrets.',
      skills: ['git status', 'git add style.css', 'git diff'],
      solutionCommand: 'git add style.css && git commit -m "Update styles"',
    },
    {
      id: 'level-3-recover',
      level: 3,
      title: 'Recover the website',
      description: 'You accidentally changed the homepage. Your job: restore the previous version.',
      skills: ['git log', 'git show', 'git restore', 'git reset'],
      solutionCommand: 'git restore index.html',
    },
    {
      id: 'level-4-branch',
      level: 4,
      title: 'Feature Branch Isolation',
      description: 'Create a new feature branch called feature/navbar, make changes, and switch back safely.',
      skills: ['git branch', 'git switch', 'git checkout -b'],
      solutionCommand: 'git switch -c feature/navbar',
    },
  ];

  const currentMission = MISSIONS.find((m) => m.level === selectedLevel) || MISSIONS[2];

  const handleStartMission = () => {
    setActiveMission(currentMission);
    setIsCompleted(false);
    // Prepare dirty state for "Recover the website"
    if (currentMission.id === 'level-3-recover') {
      executeCommand('git status');
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
  };

  return (
    <div
      style={{
        flex: 1,
        padding: '2.5rem 2rem',
        background: '#0b111e',
        color: '#f8fafc',
        overflowY: 'auto',
        minHeight: 'calc(100vh - 60px)',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Header Bar with Level Selector (Screen 7) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
              Practice
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '0.3rem', margin: 0 }}>
              Apply what you've learned with guided challenges.
            </p>
          </div>

          {/* Level Dropdown */}
          <div style={{ position: 'relative' }}>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(Number(e.target.value))}
              style={{
                background: '#131d33',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#f8fafc',
                padding: '0.5rem 1.25rem',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: 700,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value={1}>Level 1</option>
              <option value={2}>Level 2</option>
              <option value={3}>Level 3</option>
              <option value={4}>Level 4</option>
            </select>
          </div>
        </div>

        {/* Challenge Card (Screen 7 Horizontal Split) */}
        <div
          style={{
            background: '#131d33',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)',
          }}
        >
          {/* Left Side: Mission Info & Start CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Wrench size={26} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                {currentMission.title}
              </h2>
            </div>

            <p style={{ fontSize: '0.98rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              {currentMission.description}
            </p>

            <div>
              <button
                onClick={handleStartMission}
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '0.85rem 1.75rem',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                }}
              >
                Start Mission <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Right Side: Skills you'll use */}
          <div
            style={{
              borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
              paddingLeft: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 800,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Skills you'll use
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {currentMission.skills.map((skill) => (
                <div
                  key={skill}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '0.6rem 1rem',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    color: '#cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span style={{ color: '#38bdf8' }}>$</span>
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Mission Interactive Workspace (when mission is started) */}
        {activeMission && (
          <div
            style={{
              background: '#131d33',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div
              style={{
                padding: '0.75rem 1.25rem',
                background: '#0e172a',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#38bdf8' }}>
                Mission Active: {activeMission.title}
              </div>

              <button
                onClick={handleComplete}
                style={{
                  background: isCompleted ? '#10b981' : '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                {isCompleted ? <CheckCircle2 size={14} /> : <Play size={14} />}
                {isCompleted ? 'Mission Complete!' : 'Verify Solution'}
              </button>
            </div>

            <div style={{ height: '340px' }}>
              <Terminal />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
