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
  Filter,
} from 'lucide-react';

export type ScenarioDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

interface DiscoveryScenario {
  id: string;
  title: string;
  difficulty: ScenarioDifficulty;
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
  // Beginner
  {
    id: 'beginner-save-file',
    title: 'Save Edits Made to index.html',
    difficulty: 'beginner',
    category: 'Foundations',
    problemStatement: 'You edited `index.html` on your desk. You want Git to permanently remember this version with the message "Add contact form".',
    repoStateDescription: 'index.html (modified on desk) | Staging: empty | HEAD: initial commit',
    goal: 'Place index.html in the packing box (stage it) and record a saved snapshot.',
    options: [
      {
        command: 'git add index.html && git commit -m "Add contact form"',
        label: 'git add + git commit',
        whatItDoes: 'Places index.html into staging box, then seals the snapshot with a message.',
        whatItChanges: 'Staging Area and Commit History (HEAD).',
        tradeoff: 'Requires two steps, but gives you precision over what is saved.',
        risk: 'SAFE',
        isBestChoice: true,
        explanation: 'The fundamental two-step workflow: stage what you want, then commit it.',
      },
      {
        command: 'git push origin main',
        label: 'git push',
        whatItDoes: 'Attempts to send commits to remote GitHub server.',
        whatItChanges: 'Remote server.',
        tradeoff: 'Fails because no local commit has been created yet!',
        risk: 'LOW',
        isBestChoice: false,
        explanation: 'You must commit locally before you can push to a remote server.',
      },
      {
        command: 'git reset --hard',
        label: 'git reset --hard',
        whatItDoes: 'Discards all edits on your desk.',
        whatItChanges: 'Working directory.',
        tradeoff: 'Destroys your hard work!',
        risk: 'VERY_HIGH',
        isBestChoice: false,
        explanation: 'Never run reset --hard when you want to save your work!',
      },
    ],
  },
  {
    id: 'undo-uncommitted',
    title: 'Undo Local Uncommitted Edits to One File',
    difficulty: 'beginner',
    category: 'Recovery',
    problemStatement: "You tried a messy test in `script.js`. It broke everything. You have NOT run `git add` or `git commit`. You just want `script.js` back to how it was.",
    repoStateDescription: 'Working Tree: script.js (modified) | Staging Area: clean | HEAD: clean',
    goal: 'Discard working tree edits without touching commit history.',
    options: [
      {
        command: 'git restore script.js',
        label: 'git restore <file>',
        whatItDoes: 'Overwrites working tree file with the clean version from the index.',
        whatItChanges: 'Working Directory only.',
        tradeoff: 'Uncommitted edits in script.js are permanently discarded.',
        risk: 'LOW',
        isBestChoice: true,
        explanation: 'Modern, precise, and surgical. Restores only script.js without altering staging or HEAD.',
      },
      {
        command: 'git reset --hard HEAD',
        label: 'git reset --hard HEAD',
        whatItDoes: 'Destroys ALL uncommitted changes across every file in the project.',
        whatItChanges: 'Working tree, index.',
        tradeoff: 'Destroys other files you might have been editing too.',
        risk: 'HIGH',
        isBestChoice: false,
        explanation: 'Too destructive! If you had edits in other files, those would be wiped too.',
      },
      {
        command: 'git revert HEAD',
        label: 'git revert HEAD',
        whatItDoes: 'Creates a new commit negating the last commit.',
        whatItChanges: 'Creates new commit.',
        tradeoff: 'Wrong tool: your changes were never committed!',
        risk: 'LOW',
        isBestChoice: false,
        explanation: 'Revert is for undoing saved commits in history, not uncommitted drafts on your desk.',
      },
    ],
  },

  // Intermediate
  {
    id: 'pause-work-switch-task',
    title: 'Urgent Context Switch (Unfinished Work)',
    difficulty: 'intermediate',
    category: 'Workspace',
    problemStatement: "You are halfway through refactoring and your code does not compile. Your manager asks you to urgently switch to `main` to inspect a deployment bug. You cannot commit broken code, but you cannot switch branches with dirty files.",
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
        whatItDoes: 'Creates a broken commit on the branch.',
        whatItChanges: 'Records a broken commit in history.',
        tradeoff: 'Pollutes git log with non-compiling commits.',
        risk: 'MEDIUM',
        isBestChoice: false,
        explanation: 'Committing non-working code breaks git bisect and CI/CD automated tests.',
      },
      {
        command: 'git reset --hard',
        label: 'git reset --hard',
        whatItDoes: 'Destroys all uncommitted work permanently.',
        whatItChanges: 'Erases all progress.',
        tradeoff: 'You lose hours of work forever.',
        risk: 'VERY_HIGH',
        isBestChoice: false,
        explanation: 'Never run reset --hard when you actually want to keep your work!',
      },
    ],
  },
  {
    id: 'undo-last-commit-soft',
    title: 'Undo Last Commit But Keep All Your Code',
    difficulty: 'intermediate',
    category: 'History',
    problemStatement: 'You committed too early before finishing tests. You want to un-commit the snapshot, but KEEP all the written code in staging so you can keep working.',
    repoStateDescription: 'HEAD: commit a1b2c3d (premature commit) | Need: files back in staging',
    goal: 'Move branch pointer back by 1 commit without touching files or index.',
    options: [
      {
        command: 'git reset --soft HEAD~1',
        label: 'git reset --soft HEAD~1',
        whatItDoes: 'Moves HEAD back 1 commit, leaving all committed files staged in the index.',
        whatItChanges: 'HEAD pointer only.',
        tradeoff: 'Only use on local commits that have not been pushed.',
        risk: 'LOW',
        isBestChoice: true,
        explanation: '--soft reset preserves all files in the staging area ready to re-commit.',
      },
      {
        command: 'git reset --hard HEAD~1',
        label: 'git reset --hard HEAD~1',
        whatItDoes: 'Moves HEAD back 1 commit and destroys all changes.',
        whatItChanges: 'HEAD, index, working tree.',
        tradeoff: 'Erases the code you just wrote.',
        risk: 'HIGH',
        isBestChoice: false,
        explanation: '--hard would destroy the work you wanted to keep!',
      },
      {
        command: 'git branch -D main',
        label: 'git branch -D main',
        whatItDoes: 'Attempts to force-delete the current branch.',
        whatItChanges: 'Fails because you cannot delete the branch you are on.',
        tradeoff: 'Dangerous habit.',
        risk: 'VERY_HIGH',
        isBestChoice: false,
        explanation: 'Deleting branches is not how you undo a single commit.',
      },
    ],
  },

  // Advanced
  {
    id: 'cherry-pick-hotfix',
    title: 'Bring a Single Hotfix to Production',
    difficulty: 'advanced',
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
        tradeoff: 'Creates a new commit hash on main.',
        risk: 'LOW',
        isBestChoice: true,
        explanation: 'Cherry-pick is designed specifically for surgical extraction of individual commits.',
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
    id: 'undo-pushed-commit',
    title: 'Undo a Bad Commit That Was Already Pushed to Team',
    difficulty: 'advanced',
    category: 'Collaboration',
    problemStatement: 'A broken commit was pushed to `origin/main` 2 hours ago. Teammates have already pulled it. You need to undo its effect without rewriting shared history.',
    repoStateDescription: 'origin/main contains commit 4d5e6f (broken). Teammates have pulled.',
    goal: 'Safely invert changes without rewriting shared Git history.',
    options: [
      {
        command: 'git revert 4d5e6f',
        label: 'git revert <hash>',
        whatItDoes: 'Generates a new commit that records the exact inverse diff of the target commit.',
        whatItChanges: 'Appends a new forward commit to history.',
        tradeoff: 'Adds a commit to history, but does not disrupt any teammates.',
        risk: 'SAFE',
        isBestChoice: true,
        explanation: 'Revert is the gold standard for undoing pushed commits in team repositories.',
      },
      {
        command: 'git reset --hard HEAD~1 && git push --force',
        label: 'git reset --hard + force push',
        whatItDoes: 'Rewrites history and force-pushes.',
        whatItChanges: 'Rewrites remote branch history.',
        tradeoff: 'Corrupts teammates local branches who pulled commit 4d5e6f.',
        risk: 'VERY_HIGH',
        isBestChoice: false,
        explanation: 'Force-pushing rewritten history on shared branches creates merge chaos for teammates.',
      },
    ],
  },

  // Expert
  {
    id: 'expert-reflog-recovery',
    title: 'State: Broken Rebase & Discarded Commits',
    difficulty: 'expert',
    category: 'Diagnostics',
    problemStatement: 'Developer ran an interactive rebase with drop commands, abort failed, and HEAD is detached with work apparently lost.',
    repoStateDescription: 'HEAD: detached at 8f2a1b | main: branch 3 commits behind | reflog contains prior state',
    goal: 'Restore main to the exact SHA hash prior to the rebase operation using reflog.',
    options: [
      {
        command: 'git reflog  -->  git switch main  -->  git reset --hard HEAD@{4}',
        label: 'Reflog Inspection + Branch Pointer Reset',
        whatItDoes: 'Inspects HEAD journey in reflog, switches to main, and resets pointer forward to pre-rebase SHA.',
        whatItChanges: 'Restores branch pointer to the exact pre-rebase commit.',
        tradeoff: 'Must carefully identify the exact reflog index.',
        risk: 'LOW',
        isBestChoice: true,
        explanation: 'Reflog is the definitive safety net for recovering from botched rebases and dropped commits.',
      },
      {
        command: 'git clone <url> fresh_repo',
        label: 'Discard Repo and Re-clone',
        whatItDoes: 'Abandons local repository entirely.',
        whatItChanges: 'Loses all unpushed local work.',
        tradeoff: 'Destroys local commits.',
        risk: 'HIGH',
        isBestChoice: false,
        explanation: 'Unnecessary destruction: all commits exist inside .git/objects and reflog.',
      },
    ],
  },
];

export const CommandDiscoveryView: React.FC = () => {
  const { executeCommand, setMode, instructionMode } = useApp();
  const [filterDifficulty, setFilterDifficulty] = useState<ScenarioDifficulty | 'all'>('all');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(DISCOVERY_SCENARIOS[0].id);
  const [chosenOptionIndex, setChosenOptionIndex] = useState<number | null>(null);

  const filteredScenarios = filterDifficulty === 'all'
    ? DISCOVERY_SCENARIOS
    : DISCOVERY_SCENARIOS.filter(s => s.difficulty === filterDifficulty);

  const scenario = filteredScenarios.find(s => s.id === selectedScenarioId) || filteredScenarios[0];

  const handleSelectScenario = (id: string) => {
    setSelectedScenarioId(id);
    setChosenOptionIndex(null);
  };

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(240, 80, 51, 0.08) 100%)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
        <div style={{ display: 'inline-flex', padding: '0.25rem 0.75rem', background: 'rgba(6, 182, 212, 0.2)', border: '1px solid var(--cyan)', borderRadius: '999px', color: 'var(--cyan)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
          Decision Lab • What Should I Do?
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
          Reason From Repository State, Not Memorized Commands
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.4rem', maxWidth: '750px', lineHeight: 1.5 }}>
          Senior developers do not guess. They inspect the repository state, define the objective, and pick the surgical tool.
        </p>
      </div>

      {/* Difficulty Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginRight: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Filter size={14} /> Difficulty:
        </div>
        {(['all', 'beginner', 'intermediate', 'advanced', 'expert'] as const).map(diff => (
          <button
            key={diff}
            onClick={() => {
              setFilterDifficulty(diff);
              const available = diff === 'all' ? DISCOVERY_SCENARIOS : DISCOVERY_SCENARIOS.filter(s => s.difficulty === diff);
              if (available.length > 0) {
                setSelectedScenarioId(available[0].id);
                setChosenOptionIndex(null);
              }
            }}
            style={{
              padding: '0.35rem 0.8rem',
              borderRadius: '999px',
              border: filterDifficulty === diff ? '1px solid var(--git-orange)' : '1px solid var(--border-color)',
              background: filterDifficulty === diff ? 'rgba(240, 80, 51, 0.15)' : 'var(--bg-app)',
              color: filterDifficulty === diff ? 'var(--git-orange)' : 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: filterDifficulty === diff ? 800 : 600,
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {diff}
          </button>
        ))}
      </div>

      {/* Scenario Selector Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
        {filteredScenarios.map(s => (
          <button
            key={s.id}
            onClick={() => handleSelectScenario(s.id)}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: selectedScenarioId === s.id ? '1px solid var(--git-orange)' : '1px solid var(--border-color)',
              background: selectedScenarioId === s.id ? 'rgba(240, 80, 51, 0.12)' : 'var(--bg-app)',
              color: selectedScenarioId === s.id ? 'var(--git-orange)' : 'var(--text-secondary)',
              fontWeight: selectedScenarioId === s.id ? 800 : 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Scenario Case Card */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              THE SITUATION
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '0.15rem 0.5rem',
                borderRadius: '4px',
                background: 'rgba(240, 80, 51, 0.12)',
                color: 'var(--git-orange)',
                textTransform: 'uppercase',
              }}
            >
              {scenario.difficulty} • {scenario.category}
            </span>
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
