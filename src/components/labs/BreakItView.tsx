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
  Search,
  Check,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

type DiagnosticPhase = 'choose' | 'observe' | 'hypothesize' | 'inspect' | 'strategy' | 'fix' | 'verified';

interface DisasterScenario {
  id: string;
  name: string;
  badge: string;
  description: string;
  breakAction: () => void;
  // Step 2: What do you notice?
  observeOptions: { text: string; correct: boolean; feedback: string }[];
  // Step 3: What do you think happened?
  hypothesisOptions: { text: string; correct: boolean; explanation: string }[];
  // Step 4: Inspect command to run
  recommendedInspectCmd: string;
  inspectTip: string;
  // Step 5: Choose a recovery strategy
  strategyOptions: { text: string; correct: boolean; strategyRationale: string; command: string }[];
  // Step 6: Verification check
  verifyCheck: (repo: any) => boolean;
}

export const BreakItView: React.FC = () => {
  const { engine, repo, executeCommand, openHumansTerm } = useApp();
  const [activeDisasterId, setActiveDisasterId] = useState<string | null>(null);
  const [phase, setPhase] = useState<DiagnosticPhase>('choose');
  const [selectedObserve, setSelectedObserve] = useState<number | null>(null);
  const [selectedHypothesis, setSelectedHypothesis] = useState<number | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<number | null>(null);
  const [inspectDone, setInspectDone] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);

  const DISASTERS: DisasterScenario[] = [
    {
      id: 'detached-head',
      name: 'The Detached HEAD Trap',
      badge: '👻 Detached HEAD',
      description: 'You accidentally checked out a commit hash directly instead of a branch name! Commits made here are not tracked by any branch.',
      breakAction: () => {
        const hashes = Object.keys(engine.getRepo().commits);
        const target = hashes[0] || 'HEAD~1';
        engine.execute(`git checkout ${target}`);
      },
      observeOptions: [
        { text: 'Terminal warns "HEAD detached at..." and branch name disappeared', correct: true, feedback: 'Correct! HEAD is no longer pointing to a branch reference.' },
        { text: 'All files were deleted from my hard drive', correct: false, feedback: 'No, all files exist safely. Only the pointer changed.' },
        { text: 'Git threw a syntax error', correct: false, feedback: 'No error occurred. Detached HEAD is a valid Git state, but risky for new commits.' },
      ],
      hypothesisOptions: [
        { text: 'HEAD points directly to a commit hash instead of a branch label', correct: true, explanation: 'Exactly. Usually HEAD points to a branch (like main). Now it sits directly on a commit.' },
        { text: 'The repository became corrupted and needs to be deleted', correct: false, explanation: 'Not corrupted at all! Git is just visiting a past snapshot.' },
        { text: 'Git switched to remote GitHub server', correct: false, explanation: 'This is purely local to your repository.' },
      ],
      recommendedInspectCmd: 'git status',
      inspectTip: 'Run `git status` in the terminal to inspect how Git describes your current position.',
      strategyOptions: [
        { text: 'Create a new branch right here (`git switch -c rescue-branch`) to preserve work', correct: true, strategyRationale: 'Best strategy! Any work you do is now safely attached to a new named branch.', command: 'git switch -c rescue-work' },
        { text: 'Switch back to main (`git switch main`) if no commits were made', correct: true, strategyRationale: 'Also safe if you just wanted to look at history and not keep changes.', command: 'git switch main' },
        { text: 'Run `git init` again', correct: false, strategyRationale: 'Never re-run git init to fix pointers; that does not resolve detached HEAD.', command: 'git status' },
      ],
      verifyCheck: (r) => r.head.type === 'branch',
    },
    {
      id: 'accidental-hard-reset',
      name: 'Accidental `git reset --hard`',
      badge: '💥 Lost Commits',
      description: 'You ran `git reset --hard HEAD~1` by mistake and thought your latest commit was wiped from existence!',
      breakAction: () => {
        engine.execute('git reset --hard HEAD~1');
      },
      observeOptions: [
        { text: 'The latest commit disappeared from `git log` and uncommitted edits vanished', correct: true, feedback: 'Spot on! The branch pointer moved back by 1 commit.' },
        { text: 'The remote server blocked your access', correct: false, feedback: 'Reset is a local operation.' },
        { text: 'Git created a merge conflict', correct: false, feedback: 'No merge took place.' },
      ],
      hypothesisOptions: [
        { text: 'The branch pointer moved backward, but the commit hash is still in Git\'s reflog database', correct: true, explanation: 'Bingo! Git almost never immediately deletes commits. The hash is saved in reflog.' },
        { text: 'The data is permanently erased from your SSD', correct: false, explanation: 'Git objects are immutable and kept in .git/objects.' },
      ],
      recommendedInspectCmd: 'git reflog',
      inspectTip: 'Run `git reflog` to see the diary of everywhere HEAD has been recently.',
      strategyOptions: [
        { text: 'Find the prior commit in reflog and reset forward (`git reset --hard HEAD@{1}`)', correct: true, strategyRationale: 'The pro developer technique: jump directly back to the commit before the reset!', command: 'git reset --hard HEAD@{1}' },
        { text: 'Re-type all the lost code from memory', correct: false, strategyRationale: 'No need! Git reflog has your back.', command: 'git status' },
      ],
      verifyCheck: (r) => Object.keys(r.commits).length > 1,
    },
    {
      id: 'deleted-branch',
      name: 'Deleted An Unmerged Feature Branch',
      badge: '🗑️ Deleted Branch',
      description: 'Someone ran `git branch -D feature` and deleted the branch pointer!',
      breakAction: () => {
        engine.execute('git branch -D feature');
      },
      observeOptions: [
        { text: '`git branch` no longer lists the branch name', correct: true, feedback: 'Yes, the branch pointer reference was removed.' },
        { text: 'Git deleted the repository', correct: false, feedback: 'Only the branch reference was removed.' },
      ],
      hypothesisOptions: [
        { text: 'A branch is only a 41-byte text file with a commit hash. The commits still exist in Git history!', correct: true, explanation: 'Exactly. Deleting a branch deletes the label, not the commit graph!' },
        { text: 'All files in that branch were permanently destroyed', correct: false, explanation: 'Commits remain until garbage collected weeks later.' },
      ],
      recommendedInspectCmd: 'git reflog',
      inspectTip: 'Inspect the reflog to find the commit hash where the feature branch was pointing.',
      strategyOptions: [
        { text: 'Re-create the branch at the reflog commit (`git branch feature HEAD@{1}`)', correct: true, strategyRationale: 'Restores the branch label instantly!', command: 'git branch feature' },
        { text: 'Clone the repository again from scratch', correct: false, strategyRationale: 'Too destructive; Git can recover pointers locally.', command: 'git status' },
      ],
      verifyCheck: (r) => r.branches['feature'] !== undefined || r.head.type === 'branch',
    },
  ];

  const currentDisaster = DISASTERS.find(d => d.id === activeDisasterId);

  const startDisaster = (d: DisasterScenario) => {
    d.breakAction();
    setActiveDisasterId(d.id);
    setPhase('observe');
    setSelectedObserve(null);
    setSelectedHypothesis(null);
    setSelectedStrategy(null);
    setInspectDone(false);
    setVerificationFeedback(null);
  };

  const handleVerify = () => {
    if (!currentDisaster) return;
    const currentRepo = engine.getRepo();
    const ok = currentDisaster.verifyCheck(currentRepo);
    if (ok) {
      setPhase('verified');
      setVerificationFeedback('🎉 Outstanding work! Repository state is healthy and normal again.');
    } else {
      setVerificationFeedback('⚠️ Repository is not fully recovered yet. Review your command or try the recovery strategy.');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '460px 1fr', height: 'calc(100vh - 100px)', overflow: 'hidden' }}>
      {/* Left Column: 6-Step Diagnostic Experience */}
      <div
        style={{
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-color)',
          padding: '1.25rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem',
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
              marginBottom: '0.4rem',
            }}
          >
            Controlled Chaos Sandbox
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            Break It ➔ Diagnose ➔ Recover
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', marginTop: '0.2rem', lineHeight: 1.45 }}>
            Do not fear mistakes. Follow the 6-step developer recovery method: observe symptoms, hypothesize the cause, inspect state, choose a strategy, and verify the fix.
          </p>
        </div>

        {/* Disaster Selector */}
        {phase === 'choose' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Choose a disaster to trigger:
            </div>
            {DISASTERS.map(d => (
              <button
                key={d.id}
                onClick={() => startDisaster(d)}
                style={{
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem',
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
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {d.description}
                </div>
                <div style={{ marginTop: '0.2rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--danger-red)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Flame size={12} /> Trigger Disaster ➔
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Phase Progress Tracker */}
        {phase !== 'choose' && currentDisaster && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Disaster Banner */}
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid var(--danger-red)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.7rem 0.9rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--danger-red)', textTransform: 'uppercase' }}>
                  Disaster Active
                </span>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  {currentDisaster.name}
                </div>
              </div>
              <button
                onClick={() => setPhase('choose')}
                style={{
                  background: 'none',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-muted)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                }}
              >
                Exit Lab
              </button>
            </div>

            {/* Step 2: What do you notice? */}
            {phase === 'observe' && (
              <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--git-orange)', textTransform: 'uppercase' }}>
                  Step 1: What do you notice?
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Look at the Terminal and Visualizer right now. What symptom do you observe?
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {currentDisaster.observeOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedObserve(idx)}
                      style={{
                        padding: '0.6rem 0.8rem',
                        borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${selectedObserve === idx ? (opt.correct ? 'var(--terminal-green)' : 'var(--danger-red)') : 'var(--border-color)'}`,
                        background: selectedObserve === idx ? (opt.correct ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)') : 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                        textAlign: 'left',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                      }}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
                {selectedObserve !== null && (
                  <div style={{ fontSize: '0.8rem', color: currentDisaster.observeOptions[selectedObserve].correct ? 'var(--terminal-green)' : 'var(--danger-red)', fontWeight: 600 }}>
                    {currentDisaster.observeOptions[selectedObserve].feedback}
                  </div>
                )}
                {selectedObserve !== null && currentDisaster.observeOptions[selectedObserve].correct && (
                  <button
                    onClick={() => setPhase('hypothesize')}
                    style={{
                      background: 'var(--git-orange)',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 800,
                      cursor: 'pointer',
                      alignSelf: 'flex-start',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    Next: Form Hypothesis <ChevronRight size={14} />
                  </button>
                )}
              </div>
            )}

            {/* Step 3: What do you think happened? */}
            {phase === 'hypothesize' && (
              <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--git-orange)', textTransform: 'uppercase' }}>
                  Step 2: What do you think happened?
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Under the hood, why did Git enter this state?
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {currentDisaster.hypothesisOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedHypothesis(idx)}
                      style={{
                        padding: '0.6rem 0.8rem',
                        borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${selectedHypothesis === idx ? (opt.correct ? 'var(--terminal-green)' : 'var(--danger-red)') : 'var(--border-color)'}`,
                        background: selectedHypothesis === idx ? (opt.correct ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)') : 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                        textAlign: 'left',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                      }}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
                {selectedHypothesis !== null && (
                  <div style={{ fontSize: '0.8rem', color: currentDisaster.hypothesisOptions[selectedHypothesis].correct ? 'var(--terminal-green)' : 'var(--danger-red)', fontWeight: 600 }}>
                    {currentDisaster.hypothesisOptions[selectedHypothesis].explanation}
                  </div>
                )}
                {selectedHypothesis !== null && currentDisaster.hypothesisOptions[selectedHypothesis].correct && (
                  <button
                    onClick={() => setPhase('inspect')}
                    style={{
                      background: 'var(--git-orange)',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 800,
                      cursor: 'pointer',
                      alignSelf: 'flex-start',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    Next: Inspect Repository <ChevronRight size={14} />
                  </button>
                )}
              </div>
            )}

            {/* Step 4: Inspect */}
            {phase === 'inspect' && (
              <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--git-orange)', textTransform: 'uppercase' }}>
                  Step 3: Inspect Repository
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                  {currentDisaster.inspectTip}
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    onClick={() => {
                      executeCommand(currentDisaster.recommendedInspectCmd);
                      setInspectDone(true);
                    }}
                    style={{
                      background: 'var(--bg-terminal)',
                      color: 'var(--terminal-green)',
                      border: '1px solid var(--border-color)',
                      padding: '0.5rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      fontFamily: 'monospace',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <Play size={12} /> Run <code>{currentDisaster.recommendedInspectCmd}</code>
                  </button>
                </div>
                {inspectDone && (
                  <button
                    onClick={() => setPhase('strategy')}
                    style={{
                      background: 'var(--git-orange)',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 800,
                      cursor: 'pointer',
                      alignSelf: 'flex-start',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    Next: Choose Recovery Strategy <ChevronRight size={14} />
                  </button>
                )}
              </div>
            )}

            {/* Step 5: Choose a Recovery Strategy */}
            {phase === 'strategy' && (
              <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--git-orange)', textTransform: 'uppercase' }}>
                  Step 4: Choose a Recovery Strategy
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Which recovery strategy fits best?
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {currentDisaster.strategyOptions.map((strat, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedStrategy(idx)}
                      style={{
                        padding: '0.7rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${selectedStrategy === idx ? (strat.correct ? 'var(--terminal-green)' : 'var(--danger-red)') : 'var(--border-color)'}`,
                        background: selectedStrategy === idx ? (strat.correct ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)') : 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                        textAlign: 'left',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                      }}
                    >
                      {strat.text}
                    </button>
                  ))}
                </div>
                {selectedStrategy !== null && (
                  <div style={{ fontSize: '0.8rem', color: currentDisaster.strategyOptions[selectedStrategy].correct ? 'var(--terminal-green)' : 'var(--danger-red)', fontWeight: 600 }}>
                    {currentDisaster.strategyOptions[selectedStrategy].strategyRationale}
                  </div>
                )}
                {selectedStrategy !== null && currentDisaster.strategyOptions[selectedStrategy].correct && (
                  <button
                    onClick={() => {
                      executeCommand(currentDisaster.strategyOptions[selectedStrategy].command);
                      setPhase('fix');
                    }}
                    style={{
                      background: 'var(--terminal-green)',
                      color: 'black',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 800,
                      cursor: 'pointer',
                      alignSelf: 'flex-start',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    Execute Recovery: <code>{currentDisaster.strategyOptions[selectedStrategy].command}</code>
                  </button>
                )}
              </div>
            )}

            {/* Step 6: Fix & Verify */}
            {(phase === 'fix' || phase === 'verified') && (
              <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--terminal-green)', textTransform: 'uppercase' }}>
                  Step 5: Fix & Verify
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  The recovery command was run. Now verify whether the repository has returned to a normal, healthy state.
                </div>
                <button
                  onClick={handleVerify}
                  style={{
                    background: 'var(--git-orange)',
                    color: 'white',
                    border: 'none',
                    padding: '0.6rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <CheckCircle2 size={16} /> Verify Repository Health
                </button>
                {verificationFeedback && (
                  <div
                    style={{
                      padding: '0.6rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      background: phase === 'verified' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                      color: phase === 'verified' ? 'var(--terminal-green)' : 'var(--warning-amber)',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                    }}
                  >
                    {verificationFeedback}
                  </div>
                )}
                {phase === 'verified' && (
                  <button
                    onClick={() => setPhase('choose')}
                    style={{
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      alignSelf: 'flex-start',
                    }}
                  >
                    Try Another Disaster ➔
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Column: Visualizer & Terminal */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <div style={{ height: '48%', borderBottom: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <ThreeAreaVisualizer />
        </div>
        <div style={{ height: '52%', overflow: 'hidden' }}>
          <Terminal />
        </div>
      </div>
    </div>
  );
};
