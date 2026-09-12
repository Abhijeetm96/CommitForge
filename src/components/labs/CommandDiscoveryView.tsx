import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Search,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Terminal,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

interface DiscoveryScenario {
  id: string;
  title: string;
  category: string;
  problemStatement: string;
  repoStateDescription: string;
  goal: string;
  options: {
    command: string;
    label: string;
    whatItDoes: string;
    whatItChanges: string;
    tradeoff: string;
    risk: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
    isBestChoice: boolean;
    explanation: string;
  }[];
}

const DISCOVERY_SCENARIOS: DiscoveryScenario[] = [
  {
    id: 'undo-uncommitted',
    title: 'Undo Local Uncommitted Edits',
    category: 'Recovery',
    problemStatement: "You tried a messy experiment in `script.js` on your desk. It broke everything, and you haven't run `git add` or `git commit`. You just want your file back to the way it was.",
    repoStateDescription: 'Working Tree: script.js (modified) | Staging Area: clean | HEAD: clean',
    goal: 'Discard working tree edits without touching commit history.',
    options: [
      {
        command: 'git restore script.js',
        label: 'git restore <file>',
        whatItDoes: 'Overwrites working tree file with the clean version from the index.',
        whatItChanges: 'Working Directory only.',
        tradeoff: 'Uncommitted edits are permanently lost (no backup).',
        risk: 'LOW',
        isBestChoice: true,
        explanation: 'Modern, precise, and surgical. It restores only script.js without altering staging or HEAD.',
      },
      {
        command: 'git reset --hard HEAD',
        label: 'git reset --hard HEAD',
        whatItDoes: 'Destroys ALL uncommitted changes in working tree and staging across the entire project.',
        whatItChanges: 'Working tree, index.',
        tradeoff: 'Destroys all other files you might have been working on too.',
        risk: 'HIGH',
        isBestChoice: false,
        explanation: 'Too nuclear! If you modified 3 other files, you will lose those too.',
      },
      {
        command: 'git revert HEAD',
        label: 'git revert HEAD',
        whatItDoes: 'Creates a new commit negating the last commit.',
        whatItChanges: 'Creates new commit, modifies working tree.',
        tradeoff: 'Completely wrong tool: your changes were never committed!',
        risk: 'LOW',
        isBestChoice: false,
        explanation: 'Revert is for undoing saved commits, not uncommitted working directory drafts.',
      },
    ],
  },
  {
    id: 'cherry-pick-hotfix',
    title: 'Bring a Single Hotfix to Production',
    category: 'Branching & Integration',
    problemStatement: 'A critical payment bug was fixed on `feature/checkout` in commit `9c8a1b2`. You need this single fix on `main` immediately, but the rest of `feature/checkout` is half-finished and not ready to release.',
    repoStateDescription: 'main: commit C | feature/checkout: C -> D (wip) -> 9c8a1b2 (bugfix) -> F (wip)',
    goal: 'Apply commit 9c8a1b2 to main without merging unfinished work.',
    options: [
      {
        command: 'git cherry-pick 9c8a1b2',
        label: 'git cherry-pick 9c8a1b2',
        whatItDoes: 'Extracts the exact diff of commit 9c8a1b2 and replays it as a new commit on main.',
        whatItChanges: 'Applies diff and creates a new commit on main.',
        tradeoff: 'Creates a duplicate commit hash on main.',
        risk: 'LOW',
        isBestChoice: true,
        explanation: 'Cherry-pick is specifically designed for surgical extraction of individual commits across branches.',
      },
      {
        command: 'git merge feature/checkout',
        label: 'git merge feature/checkout',
        whatItDoes: 'Integrates the entire feature/checkout branch into main.',
        whatItChanges: 'Brings all commits (D, bugfix, F) into main.',
        tradeoff: 'Poisons production with unfinished, broken WIP code.',
        risk: 'HIGH',
        isBestChoice: false,
        explanation: 'Never merge a branch containing unfinished code to production!',
      },
      {
        command: 'git rebase feature/checkout',
        label: 'git rebase feature/checkout',
        whatItDoes: 'Moves main commits on top of feature/checkout.',
        whatItChanges: 'Rewrites main history.',
        tradeoff: 'Disaster! Moves main on top of an experimental feature.',
        risk: 'VERY_HIGH',
        isBestChoice: false,
        explanation: 'Rebasing main onto an incomplete branch disrupts the entire team.',
      },
    ],
  },
  {
    id: 'pause-work-switch-task',
    title: 'Urgent Context Switch (Unfinished Work)',
    category: 'Workspace',
    problemStatement: "You are halfway through refactoring and your code doesn't even compile. Your manager asks you to urgently switch to `main` to inspect a deployment bug. You cannot commit broken code, but you cannot switch branches with dirty files.",
    repoStateDescription: 'Working tree: 4 dirty uncompilable files | Need to switch to: main',
    goal: 'Shelve changes temporarily, switch branches, and retrieve them later.',
    options: [
      {
        command: 'git stash push -m "WIP refactoring"',
        label: 'git stash',
        whatItDoes: 'Takes dirty working tree and index changes and saves them onto a temporary stack, restoring a clean state.',
        whatItChanges: 'Working tree and index are reset to clean HEAD.',
        tradeoff: 'Must remember to `git stash pop` when you return.',
        risk: 'SAFE',
        isBestChoice: true,
        explanation: 'Git stash is the perfect clipboard for temporary context switching.',
      },
      {
        command: 'git commit -m "wip broken stuff"',
        label: 'git commit -am "broken"',
        whatItDoes: 'Creates a garbage commit on the branch.',
        whatItChanges: 'Records a broken commit in history.',
        tradeoff: 'Pollutes git log with non-compiling commits.',
        risk: 'MEDIUM',
        isBestChoice: false,
        explanation: 'Committing non-working code breaks git bisect and team CI/CD tests.',
      },
      {
        command: 'git reset --hard',
        label: 'git reset --hard',
        whatItDoes: 'Destroys all uncommitted work permanently.',
        whatItChanges: 'Erases all progress.',
        tradeoff: 'You lose half a day of work forever.',
        risk: 'VERY_HIGH',
        isBestChoice: false,
        explanation: 'Never run reset --hard when you actually want to keep your work!',
      },
    ],
  },
];

export const CommandDiscoveryView: React.FC = () => {
  const { executeCommand, setMode } = useApp();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(DISCOVERY_SCENARIOS[0].id);
  const [chosenOptionIndex, setChosenOptionIndex] = useState<number | null>(null);

  const scenario = DISCOVERY_SCENARIOS.find(s => s.id === selectedScenarioId) || DISCOVERY_SCENARIOS[0];

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(240, 80, 51, 0.08) 100%)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
        <div style={{ display: 'inline-flex', padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.2)', border: '1px solid var(--cyan)', borderRadius: '999px', color: 'var(--cyan)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
          Command Discovery • What Should I Do?
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
          Reason From Repository State, Not Memorized Commands
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.4rem', maxWidth: '750px', lineHeight: 1.5 }}>
          In professional development, nobody memorizes 100 flags. Senior developers analyze the current repository state, define the desired goal, and select the safest tool.
        </p>
      </div>

      {/* Scenario Selector Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {DISCOVERY_SCENARIOS.map(s => (
          <button
            key={s.id}
            onClick={() => {
              setSelectedScenarioId(s.id);
              setChosenOptionIndex(null);
            }}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${selectedScenarioId === s.id ? 'var(--git-orange)' : 'var(--border-color)'}`,
              background: selectedScenarioId === s.id ? 'rgba(240, 80, 51, 0.12)' : 'var(--bg-surface)',
              color: selectedScenarioId === s.id ? 'var(--git-orange)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Scenario Case Card */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            THE SITUATION
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.2rem 0 0.5rem' }}>
            {scenario.title}
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
            {scenario.problemStatement}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.8rem' }}>
          <div style={{ background: 'var(--bg-app)', padding: '0.8rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--cyan)', textTransform: 'uppercase' }}>
              CURRENT REPOSITORY STATE
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.2rem', fontFamily: 'monospace' }}>
              {scenario.repoStateDescription}
            </div>
          </div>

          <div style={{ background: 'var(--bg-app)', padding: '0.8rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--terminal-green)', textTransform: 'uppercase' }}>
              DESIRED GOAL
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginTop: '0.2rem', fontWeight: 600 }}>
              {scenario.goal}
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Tools Comparison */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.8rem' }}>
          Which Git command would you choose?
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {scenario.options.map((opt, idx) => {
            const isChosen = chosenOptionIndex === idx;

            return (
              <div
                key={idx}
                style={{
                  background: isChosen
                    ? opt.isBestChoice
                      ? 'rgba(16, 185, 129, 0.08)'
                      : 'rgba(239, 68, 68, 0.08)'
                    : 'var(--bg-surface)',
                  border: `1px solid ${isChosen ? (opt.isBestChoice ? 'var(--terminal-green)' : 'var(--danger-red)') : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '1.1rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <code style={{ background: 'var(--bg-terminal)', color: 'var(--terminal-green)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 700 }}>
                      {opt.command}
                    </code>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {opt.label}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        background: opt.risk === 'SAFE' ? 'rgba(16, 185, 129, 0.2)' : opt.risk === 'LOW' ? 'rgba(6, 182, 212, 0.2)' : opt.risk === 'MEDIUM' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: opt.risk === 'SAFE' ? 'var(--terminal-green)' : opt.risk === 'LOW' ? 'var(--cyan)' : opt.risk === 'MEDIUM' ? 'var(--warning-amber)' : 'var(--danger-red)',
                      }}
                    >
                      {opt.risk} RISK
                    </span>

                    <button
                      onClick={() => setChosenOptionIndex(idx)}
                      style={{
                        background: isChosen ? 'var(--text-primary)' : 'var(--bg-app)',
                        color: isChosen ? 'var(--bg-app)' : 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                        padding: '0.35rem 0.8rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {isChosen ? 'Selected' : 'Choose This Tool'}
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  {opt.whatItDoes}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <strong>Affects:</strong> {opt.whatItChanges} • <strong>Tradeoff:</strong> {opt.tradeoff}
                </div>

                {isChosen && (
                  <div
                    style={{
                      marginTop: '0.4rem',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: opt.isBestChoice ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      border: `1px solid ${opt.isBestChoice ? 'var(--terminal-green)' : 'var(--danger-red)'}`,
                      fontSize: '0.85rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: opt.isBestChoice ? 'var(--terminal-green)' : 'var(--danger-red)', marginBottom: '0.2rem' }}>
                      {opt.isBestChoice ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                      {opt.isBestChoice ? 'EXCELLENT DECISION (Recommended Pattern)' : 'WHY THIS IS NOT OPTIMAL:'}
                    </div>
                    <div style={{ color: 'var(--text-primary)', lineHeight: 1.5 }}>
                      {opt.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
