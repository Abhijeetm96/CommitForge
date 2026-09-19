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
  levelTitle: string;
  badge: string;
  topic: string;
  subtopics: string[];
  title: string;
  description: string;
  skills: string[];
  initialCommand?: string;
  solutionCommand: string;
}

export const PracticeView: React.FC = () => {
  const { executeCommand, repo } = useApp();
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [activeMission, setActiveMission] = useState<PracticeMission | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const MISSIONS: PracticeMission[] = [
    {
      id: 'level-0-terminal',
      level: 0,
      levelTitle: 'Level 0: Computer & Terminal Fundamentals',
      badge: '💻 Level 0',
      topic: 'Filesystem Navigation & Setup',
      subtopics: [
        'Working directory awareness (pwd)',
        'Listing directory contents and hidden files (ls -la)',
        'Filesystem traversal with relative/absolute paths (cd)',
        'Creating project directories and workspace files (mkdir, touch)',
      ],
      title: 'Terminal Navigation & Workspace Setup',
      description: 'You just opened a new terminal. Discover your active directory path, list existing project files, and prepare your project workspace before initializing version control.',
      skills: ['pwd', 'ls', 'cd', 'mkdir', 'touch'],
      solutionCommand: 'pwd && ls',
    },
    {
      id: 'level-1-init',
      level: 1,
      levelTitle: 'Level 1: Git Fundamentals',
      badge: '🌱 Level 1',
      topic: 'Snapshots & The Three Areas',
      subtopics: [
        'Repository initialization and hidden .git directory (git init)',
        'Inspecting working tree desk status (git status)',
        'Staging changed files into the packing box (git add)',
        'Sealing atomic snapshots into permanent history (git commit)',
      ],
      title: 'Initialize & First Commit',
      description: 'You just started a new portfolio project. Set up version control with git init, inspect changes with status, pack files into staging, and create your first milestone snapshot.',
      skills: ['git init', 'git status', 'git add', 'git commit'],
      solutionCommand: 'git add . && git commit -m "First commit"',
    },
    {
      id: 'level-2-staging',
      level: 2,
      levelTitle: 'Level 2: Everyday Git & Quality',
      badge: '⚡ Level 2',
      topic: 'Selective Staging & .gitignore',
      subtopics: [
        'Inspecting line-by-line working edits (git diff)',
        'Selective staging of specific files while leaving others unstaged',
        'Preventing secrets and build artifacts from leaking (.gitignore)',
        'Writing conventional, descriptive commit messages',
      ],
      title: 'Selective Staging & Clean Commits',
      description: 'You edited both style.css and secrets.txt. Inspect differences with git diff, stage ONLY style.css, and seal a clean commit without committing secrets.',
      skills: ['git status', 'git diff', 'git add style.css', 'git commit'],
      solutionCommand: 'git add style.css && git commit -m "Update styles"',
    },
    {
      id: 'level-3-recover',
      level: 3,
      levelTitle: 'Level 3: History & Recovery',
      badge: '⏪ Level 3',
      topic: 'Time Travel & Safe Undos',
      subtopics: [
        'Inspecting commit timeline and log hashes (git log --oneline)',
        'Surgically discarding unstaged working edits (git restore)',
        'Unstaging accidentally staged files (git restore --staged)',
        'Safe non-destructive reversal with git revert',
      ],
      title: 'Recover the Website & Safe Undos',
      description: 'You accidentally broke index.html with experimental edits. Discard your uncommitted mistakes cleanly using git restore without affecting any other files.',
      skills: ['git log', 'git status', 'git restore', 'git revert'],
      solutionCommand: 'git restore index.html',
    },
    {
      id: 'level-4-branch',
      level: 4,
      levelTitle: 'Level 4: Branches & Exploration',
      badge: '🌿 Level 4',
      topic: 'Parallel Realities & Pointers',
      subtopics: [
        'Creating isolated feature branches (git switch -c)',
        'Listing and understanding movable branch pointers (git branch -v)',
        'Context switching between branches without file collisions',
        'Preparing clean branches for upstream merging',
      ],
      title: 'Feature Branch Isolation',
      description: 'Create a dedicated feature branch called feature/navbar, make changes in isolation, and verify that main remains completely untouched and stable.',
      skills: ['git branch', 'git switch', 'git checkout -b', 'git status'],
      solutionCommand: 'git switch -c feature/navbar',
    },
    {
      id: 'level-5-merge',
      level: 5,
      levelTitle: 'Level 5: Merging & Conflict Arena',
      badge: '⚔️ Level 5',
      topic: 'Integrating Streams & Conflicts',
      subtopics: [
        'Fast-forward merges vs 3-way merge commits',
        'Detecting and understanding conflict markers (<<<< / ==== / >>>>)',
        'Resolving conflicting edits and staging the clean resolution',
        'Safely aborting merges during collisions (git merge --abort)',
      ],
      title: 'Merging & Conflict Resolution Arena',
      description: 'Combine your feature branch back into main. Inspect differences, handle merge collisions calmly, and seal the integrated history cleanly.',
      skills: ['git merge', 'git diff', 'git add', 'git merge --continue'],
      solutionCommand: 'git merge feature/navbar',
    },
    {
      id: 'level-6-remote',
      level: 6,
      levelTitle: 'Level 6: GitHub & Remote Repositories',
      badge: '🌐 Level 6',
      topic: 'Distributed Collaboration & Remotes',
      subtopics: [
        'Inspecting remote connections (git remote -v)',
        'Downloading updates without touching code (git fetch origin)',
        'Pulling and integrating remote commits (git pull origin)',
        'Publishing local commits safely with upstream tracking (git push -u)',
      ],
      title: 'Remote Origin & Push Synchronization',
      description: 'Connect your local repository to GitHub, verify remote connections with git remote -v, fetch remote branches, and synchronize cleanly.',
      skills: ['git remote -v', 'git fetch', 'git pull', 'git push'],
      solutionCommand: 'git remote -v && git fetch origin',
    },
    {
      id: 'level-7-pr',
      level: 7,
      levelTitle: 'Level 7: Pull Requests & Code Review',
      badge: '🤝 Level 7',
      topic: 'Code Review Hygiene & PRs',
      subtopics: [
        'Structuring pull requests with atomic, readable commits',
        'Comparing branches before opening review (git diff main...HEAD)',
        'Responding to peer code review comments and amending',
        'Squash and rebase merge options on team projects',
      ],
      title: 'Pull Request Review & Branch Preparation',
      description: 'Prepare a production-ready pull request branch. Inspect the diff against main, verify that commit messages follow standards, and prepare for team review.',
      skills: ['git log --oneline', 'git diff main...HEAD', 'git push origin'],
      solutionCommand: 'git log --oneline -n 3',
    },
    {
      id: 'level-8-tools',
      level: 8,
      levelTitle: 'Level 8: Professional Git Tools',
      badge: '🛠️ Level 8',
      topic: 'Stash, Bisect, Blame & Tags',
      subtopics: [
        'Shelving uncommitted work in progress (git stash push)',
        'Restoring stashed changes safely (git stash pop)',
        'Finding who wrote each line and why (git blame)',
        'Automated binary search bug hunting (git bisect)',
        'Creating immutable release milestones (git tag -a)',
      ],
      title: 'Stash Shelving & Release Tagging',
      description: 'An urgent hotfix arrived. Shelve your uncommitted work safely with git stash, inspect stash shelves, and pop your changes back when ready.',
      skills: ['git stash', 'git stash list', 'git tag -a v1.0.0', 'git stash pop'],
      solutionCommand: 'git stash && git stash pop',
    },
    {
      id: 'level-9-rebase',
      level: 9,
      levelTitle: 'Level 9: Rebase & Clean History',
      badge: '🎯 Level 9',
      topic: 'Linear History & Interactive Rebase',
      subtopics: [
        'Replaying commits onto updated parent branches (git rebase)',
        'Interactive squash, reword, fixup, and drop (git rebase -i)',
        'Resolving rebase step collisions (git rebase --continue)',
        'The golden rule: never rebase public shared history',
      ],
      title: 'Linear Rebase & History Cleanup',
      description: 'Replay your branch commits cleanly on top of main. Understand how rebase avoids unnecessary merge bubble commits for a clean linear history.',
      skills: ['git rebase', 'git rebase -i', 'git log --graph', 'git rebase --continue'],
      solutionCommand: 'git rebase main',
    },
    {
      id: 'level-10-hospital',
      level: 10,
      levelTitle: 'Level 10: Git Hospital & Rescue',
      badge: '🏥 Level 10',
      topic: 'Detached HEAD & Reflog Surgery',
      subtopics: [
        'Diagnosing detached HEAD states and understanding why they happen',
        'Rescuing commits created in detached HEAD before switching',
        'Inspecting the ultimate recovery ledger (git reflog)',
        'Restoring lost commits after an accidental git reset --hard',
      ],
      title: 'Emergency Reflog Rescue & Detached HEAD',
      description: 'You lost a commit after an accidental reset! Use Git\'s immutable safety journal (git reflog) to locate the lost commit hash and restore it safely.',
      skills: ['git reflog', 'git branch recovery-branch', 'git reset', 'git status'],
      solutionCommand: 'git reflog',
    },
    {
      id: 'level-11-ecosystem',
      level: 11,
      levelTitle: 'Level 11: Advanced Git Ecosystem',
      badge: '🚀 Level 11',
      topic: 'Worktrees, Hooks & Multi-Remotes',
      subtopics: [
        'Checking out multiple branches at once in separate folders (git worktree)',
        'Automating linting and tests before commit (pre-commit hooks)',
        'Managing nested repository dependencies (git submodule)',
        'Tracking large media and binary assets with Git LFS',
      ],
      title: 'Git Worktree & Multi-Branch Development',
      description: 'Work on an urgent fix without abandoning your current branch. Inspect Git worktree capabilities to manage parallel working trees with zero stash friction.',
      skills: ['git worktree list', 'git worktree add', 'git worktree prune'],
      solutionCommand: 'git worktree list',
    },
    {
      id: 'level-12-internals',
      level: 12,
      levelTitle: 'Level 12: Git Internals & Architecture',
      badge: '🔬 Level 12',
      topic: 'Blobs, Trees & Object Database',
      subtopics: [
        'The 4 core Git objects: blobs, trees, commits, and tags',
        'SHA-1 content-addressable hash computation (git hash-object)',
        'Deconstructing raw object contents with git cat-file -p',
        'Examining directory hierarchy tree objects with git ls-tree',
      ],
      title: 'Object Forensics & Git Internals Plumbing',
      description: 'Look beneath the porcelain surface into the .git/objects database. Inspect commit objects, raw blobs, and directory trees using Git plumbing commands.',
      skills: ['git cat-file -p HEAD', 'git cat-file -t', 'git ls-tree HEAD', 'git rev-parse HEAD'],
      solutionCommand: 'git cat-file -p HEAD',
    },
  ];

  const currentMission = MISSIONS.find((m) => m.level === selectedLevel) || MISSIONS[1];

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
      className="practice-view-container"
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        minHeight: 0,
        padding: '2.5rem 2rem 6rem 2rem',
        background: 'var(--bg-app)',
        color: 'var(--text-primary)',
        overflowY: 'auto',
        overflowX: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Header Bar with Level Selector (Screen 7) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#38bdf8',
                  background: 'rgba(56, 189, 248, 0.1)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                13 Curriculum Levels • All Topics & Subtopics
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              Guided Practice Missions
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.3rem', margin: 0 }}>
              Apply what you've learned with hands-on challenges across the complete Git toolchain.
            </p>
          </div>

          {/* Level Dropdown: All 13 Levels */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Select Level:</span>
            <select
              value={selectedLevel}
              onChange={(e) => {
                setSelectedLevel(Number(e.target.value));
                setActiveMission(null);
                setIsCompleted(false);
              }}
              style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '0.55rem 1.25rem',
                borderRadius: '10px',
                fontSize: '0.88rem',
                fontWeight: 700,
                outline: 'none',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {MISSIONS.map((m) => (
                <option key={m.level} value={m.level}>
                  {m.badge} — {m.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Challenge Card (Screen 7 Horizontal Split) */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            padding: '2rem',
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '2.5rem',
            alignItems: 'start',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {/* Left Side: Mission Info & Start CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#f05033',
                  background: 'rgba(240, 80, 51, 0.1)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(240, 80, 51, 0.25)',
                }}
              >
                {currentMission.badge}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Topic: <strong style={{ color: 'var(--text-primary)' }}>{currentMission.topic}</strong>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Wrench size={24} />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {currentMission.title}
              </h2>
            </div>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {currentMission.description}
            </p>

            {/* Subtopics Covered in this Challenge */}
            <div
              style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
              }}
            >
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#38bdf8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Subtopics Covered ({currentMission.subtopics.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {currentMission.subtopics.map((sub, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.4rem',
                      lineHeight: 1.4,
                    }}
                  >
                    <span style={{ color: '#38bdf8', fontWeight: 800 }}>✓</span>
                    <span>{sub}</span>
                  </div>
                ))}
              </div>
            </div>

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
              borderLeft: '1px solid var(--border-color)',
              paddingLeft: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div
              style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Commands & Skills Exercised
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {currentMission.skills.map((skill) => (
                <div
                  key={skill}
                  style={{
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '0.6rem 1rem',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    color: 'var(--text-primary)',
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

            <div
              style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: '#38bdf8' }}>
                💡 Mentor Tip:{' '}
              </strong>
              Each mission runs inside the live in-browser Git engine. Use the interactive terminal below to practice real commands.
            </div>
          </div>
        </div>

        {/* Active Mission Interactive Workspace (when mission is started) */}
        {activeMission && (
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div
              style={{
                padding: '0.75rem 1.25rem',
                background: 'var(--bg-surface)',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#38bdf8' }}>
                Mission Active: {activeMission.title}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

                <button
                  type="button"
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
