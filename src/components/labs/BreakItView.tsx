import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Terminal } from '../terminal/Terminal';
import { ThreeAreaVisualizer } from '../visualizer/ThreeAreaVisualizer';
import {
  Flame,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Play,
  Lightbulb,
  ShieldAlert,
} from 'lucide-react';

interface DisasterScenario {
  id: string;
  name: string;
  badge: string;
  description: string;
  breakAction: () => void;
  symptoms: string[];
  diagnosis: string;
  recoveryCommand: string;
  recoveryExplanation: string;
}

export const BreakItView: React.FC = () => {
  const { engine, repo, executeCommand, openHumansTerm } = useApp();
  const [activeDisaster, setActiveDisaster] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const DISASTERS: DisasterScenario[] = [
    {
      id: 'detached-head',
      name: 'The Detached HEAD Trap',
      badge: '👻 Detached HEAD',
      description: 'You accidentally checked out a commit hash directly instead of a branch name! Commits made here are not tracked by any branch and will be lost when you switch away.',
      breakAction: () => {
        const hashes = Object.keys(engine.getRepo().commits);
        const target = hashes[0] || 'HEAD~1';
        engine.execute(`git checkout ${target}`);
        setActiveDisaster('detached-head');
        setShowHint(false);
        setShowSolution(false);
      },
      symptoms: [
        'git status reports: "HEAD detached at..."',
        'Branch indicators turn grey or warn of detached state',
        'New commits do not advance any named branch',
      ],
      diagnosis: 'HEAD is pointing directly to a commit hash instead of a branch reference.',
      recoveryCommand: 'git switch -c rescue-branch  (or git switch main)',
      recoveryExplanation: 'To save any work done in detached HEAD, create a branch right here (`git switch -c <name>`). If you just want to abandon experiments, switch back (`git switch main`).',
    },
    {
      id: 'accidental-hard-reset',
      name: 'Accidental `git reset --hard`',
      badge: '💥 Lost Commits',
      description: 'You ran `git reset --hard HEAD~1` by mistake and thought your latest commit was wiped from existence!',
      breakAction: () => {
        engine.execute('git reset --hard HEAD~1');
        setActiveDisaster('accidental-hard-reset');
        setShowHint(false);
        setShowSolution(false);
      },
      symptoms: [
        'Latest commit disappeared from `git log`',
        'Working tree edits were discarded',
        'Panic sets in thinking code is permanently deleted',
      ],
      diagnosis: 'Branch pointer moved backwards. But Git NEVER deletes commits immediately! The hash is safely saved in the reflog.',
      recoveryCommand: 'git reflog  -> then  git reset --hard HEAD@{1}',
      recoveryExplanation: 'Run `git reflog` to find the SHA hash of the commit you were at before the reset. Then run `git reset --hard HEAD@{1}` to jump right back!',
    },
    {
      id: 'deleted-branch',
      name: 'Deleted An Unmerged Feature Branch',
      badge: '🗑️ Deleted Branch',
      description: 'Someone ran `git branch -D feature/cart` and deleted the branch pointer!',
      breakAction: () => {
        engine.execute('git branch -D feature');
        setActiveDisaster('deleted-branch');
        setShowHint(false);
        setShowSolution(false);
      },
      symptoms: [
        'git branch does not show the feature branch anymore',
        'The commits seem to have vanished from the branch listing',
      ],
      diagnosis: 'A branch is only a 41-byte text file containing a commit hash. Deleting the branch only deleted the reference, not the commits!',
      recoveryCommand: 'git reflog  -> then  git branch feature <commit-hash>',
      recoveryExplanation: 'Find the commit hash from `git reflog`, then re-create the branch pointer: `git branch feature <hash>`.',
    },
  ];

  const currentDisaster = DISASTERS.find(d => d.id === activeDisaster);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '440px 1fr', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
      {/* Left Column: Disaster Launcher & Recovery Guide */}
      <div
        style={{
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-color)',
          padding: '1.5rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              padding: '0.2rem 0.6rem',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid var(--danger-red)',
              borderRadius: '999px',
              color: 'var(--danger-red)',
              fontWeight: 800,
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}
          >
            Controlled Chaos Sandbox
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            Break It & Fix It
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.3rem', lineHeight: 1.5 }}>
            The best developers don't avoid mistakes — they know how to recover from them without panic. Trigger a real repository disaster below, then use Git's tools to fix it!
          </p>
        </div>

        {/* Disaster Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {DISASTERS.map(d => (
            <button
              key={d.id}
              onClick={d.breakAction}
              style={{
                background: activeDisaster === d.id ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-app)',
                border: `1px solid ${activeDisaster === d.id ? 'var(--danger-red)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '0.8rem 1rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                  {d.name}
                </span>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--danger-red)' }}>
                  {d.badge}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: 1.4 }}>
                {d.description}
              </div>
            </button>
          ))}
        </div>

        {/* Active Disaster Triage Panel */}
        {currentDisaster && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.06)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '1.1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--danger-red)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase' }}>
              <ShieldAlert size={16} /> Disaster Active: {currentDisaster.name}
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Symptoms to observe in Terminal & Visualizer:
              </div>
              <ul style={{ paddingLeft: '1.2rem', margin: '0.3rem 0 0', fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                {currentDisaster.symptoms.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Senior Dev Diagnosis:
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0', lineHeight: 1.45 }}>
                {currentDisaster.diagnosis}
              </p>
            </div>

            {/* Hint and Solution Controls */}
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                onClick={() => setShowHint(!showHint)}
                style={{
                  flex: 1,
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--warning-amber)',
                  padding: '0.4rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem',
                }}
              >
                <Lightbulb size={13} /> {showHint ? 'Hide Hint' : 'Recovery Hint'}
              </button>

              <button
                onClick={() => setShowSolution(!showSolution)}
                style={{
                  flex: 1,
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--terminal-green)',
                  padding: '0.4rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem',
                }}
              >
                <CheckCircle2 size={13} /> {showSolution ? 'Hide Solution' : 'Show Solution'}
              </button>
            </div>

            {showHint && (
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                💡 <strong>Hint:</strong> Check your <code>git reflog</code> to see every past position of HEAD!
              </div>
            )}

            {showSolution && (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div style={{ fontWeight: 800, color: 'var(--terminal-green)' }}>Recovery Command:</div>
                <code style={{ background: 'var(--bg-terminal)', color: 'var(--terminal-green)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontFamily: 'monospace' }}>
                  {currentDisaster.recoveryCommand}
                </code>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {currentDisaster.recoveryExplanation}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Column: Visualizer & Terminal to diagnose and fix */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <div style={{ height: '45%', borderBottom: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <ThreeAreaVisualizer />
        </div>
        <div style={{ height: '55%', overflow: 'hidden' }}>
          <Terminal />
        </div>
      </div>
    </div>
  );
};
