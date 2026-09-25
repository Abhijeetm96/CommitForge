import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Terminal } from '../terminal/Terminal';
import {
  Wrench,
  CheckCircle2,
  Play,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Search,
  ChevronDown,
  ShieldAlert,
  HelpCircle,
  Code2,
  Terminal as TerminalIcon,
  Sparkles,
  Zap,
  BookOpen,
  X,
} from 'lucide-react';

export type PracticeTab = 'briefing' | 'sandbox' | 'skills' | 'safeFailure' | 'hints';

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
  seedCommands: string[];
  solutionCommand: string;
  solutionExplanation: string;
  hints: string[];
  safeFailure: {
    mistakeTitle: string;
    mistakeCommand: string;
    whatHappened: string;
    whatWasNotLost: string;
    recoveryCommand: string;
    recoveryExplanation: string;
  };
}

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
    description: 'You just opened a new terminal. Discover your active directory path, inspect project files, and prepare your workspace before initializing version control.',
    skills: ['pwd', 'ls', 'cd', 'mkdir', 'touch'],
    seedCommands: ['pwd', 'ls'],
    solutionCommand: 'pwd && ls',
    solutionExplanation: 'Verifying your current location with pwd and examining existing files with ls ensures you operate in the intended project directory before running Git.',
    hints: [
      'Type `pwd` to print your working directory.',
      'Type `ls` or `ls -la` to list all directory contents.',
    ],
    safeFailure: {
      mistakeTitle: 'Running commands in the wrong directory',
      mistakeCommand: 'rm -rf /',
      whatHappened: 'Executing blind destructive actions outside your sandbox.',
      whatWasNotLost: 'CommitForge sandboxes all terminal operations safely in memory.',
      recoveryCommand: 'pwd',
      recoveryExplanation: 'Always execute `pwd` first to ground your terminal awareness.',
    },
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
    seedCommands: ['git init', 'echo "# Portfolio" > README.md'],
    solutionCommand: 'git add . && git commit -m "feat: initial commit"',
    solutionExplanation: 'Running git init creates the local repository; staging files with git add prepares them for an immutable commit checkpoint.',
    hints: [
      'Start by running `git init` if not already initialized.',
      'Stage your files with `git add .` and seal them with `git commit -m "feat: initial commit"`.',
    ],
    safeFailure: {
      mistakeTitle: 'Committing with an Empty Staging Box',
      mistakeCommand: 'git commit -m "Empty snapshot"',
      whatHappened: 'Git refused the commit because no changes were staged.',
      whatWasNotLost: 'Your working files on your desk remain completely safe.',
      recoveryCommand: 'git add .',
      recoveryExplanation: 'Stage files into the packing box first before sealing a commit.',
    },
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
    seedCommands: ['git init', 'echo "body { margin: 0; }" > style.css', 'echo "API_KEY=xyz" > .env'],
    solutionCommand: 'git add style.css && git commit -m "style: update layout"',
    solutionExplanation: 'Selective staging allows you to separate public feature code from private tokens and configuration files.',
    hints: [
      'Use `git status` to verify which files are modified.',
      'Stage only `style.css` using `git add style.css` and commit.',
    ],
    safeFailure: {
      mistakeTitle: 'Accidentally Staging Sensitive Secrets',
      mistakeCommand: 'git add .env',
      whatHappened: 'Private API credentials staged into the git index.',
      whatWasNotLost: 'The commit has not been pushed to any remote cloud servers.',
      recoveryCommand: 'git restore --staged .env',
      recoveryExplanation: 'Use `git restore --staged` to unbox files from staging safely.',
    },
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
    seedCommands: ['git init', 'echo "Working site" > index.html', 'git add index.html', 'git commit -m "feat: stable website"', 'echo "Broken code" > index.html'],
    solutionCommand: 'git restore index.html',
    solutionExplanation: '`git restore <file>` discards unstaged working tree modifications, restoring the file to the last committed state.',
    hints: [
      'Run `git status` to view modified unstaged files.',
      'Discard unwanted modifications using `git restore index.html`.',
    ],
    safeFailure: {
      mistakeTitle: 'Hard Resetting Away Uncommitted Work',
      mistakeCommand: 'git reset --hard',
      whatHappened: 'Overwrote working directory changes completely.',
      whatWasNotLost: 'All previously committed historical snapshots remain in Git.',
      recoveryCommand: 'git status',
      recoveryExplanation: 'Prefer target-specific `git restore <file>` over indiscriminate `git reset --hard`.',
    },
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
    seedCommands: ['git init', 'echo "main branch" > app.js', 'git add app.js', 'git commit -m "chore: base app"'],
    solutionCommand: 'git switch -c feature/navbar',
    solutionExplanation: 'Branches are lightweight 41-byte pointers to commits, enabling parallel feature experiments without risk to production code.',
    hints: [
      'Use modern branch creation syntax: `git switch -c feature/navbar`.',
      'Verify active branch with `git branch`.',
    ],
    safeFailure: {
      mistakeTitle: 'Committing Directly to Main in Shared Projects',
      mistakeCommand: 'git commit -m "quick unreviewed fix on main"',
      whatHappened: 'Pushed unreviewed code directly into trunk.',
      whatWasNotLost: 'Commits can easily be branched off using `git branch <name>`.',
      recoveryCommand: 'git switch -c fix/isolated-fix',
      recoveryExplanation: 'Isolate changes on a feature branch and open a review request.',
    },
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
    seedCommands: ['git init', 'echo "base" > file.txt', 'git add file.txt', 'git commit -m "base"', 'git switch -c feature/navbar', 'echo "nav code" > file.txt', 'git commit -am "feature work"', 'git switch main'],
    solutionCommand: 'git merge feature/navbar',
    solutionExplanation: 'Merging brings separate lines of development together. When changes do not conflict, Git performs a fast-forward or 3-way merge.',
    hints: [
      'Make sure you are on the target branch (`main`).',
      'Run `git merge feature/navbar`.',
    ],
    safeFailure: {
      mistakeTitle: 'Panicking During Conflict Markers',
      mistakeCommand: 'rm -rf .git',
      whatHappened: 'Destroyed whole Git database out of fear of merge conflicts.',
      whatWasNotLost: 'Git provides `git merge --abort` to return to exact safety.',
      recoveryCommand: 'git merge --abort',
      recoveryExplanation: 'Run `git merge --abort` anytime a merge conflict gets overwhelming.',
    },
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
    seedCommands: ['git init', 'git remote add origin https://github.com/developer/forge-lab.git', 'echo "code" > main.js', 'git add main.js', 'git commit -m "feat: initial"'],
    solutionCommand: 'git remote -v && git fetch origin',
    solutionExplanation: '`git remote -v` verifies authenticated URLs, while `git fetch` updates local tracking branches without modifying working tree files.',
    hints: [
      'Check registered remotes with `git remote -v`.',
      'Fetch remote changes with `git fetch origin`.',
    ],
    safeFailure: {
      mistakeTitle: 'Force Pushing Blindly to Shared Main',
      mistakeCommand: 'git push --force origin main',
      whatHappened: 'Overwrote teammates remote commits on the shared branch.',
      whatWasNotLost: 'Commits can be recovered from teammates local clones or reflogs.',
      recoveryCommand: 'git push --force-with-lease',
      recoveryExplanation: 'Use `--force-with-lease` so Git refuses to overwrite unknown remote commits.',
    },
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
    seedCommands: ['git init', 'echo "base" > app.js', 'git add app.js', 'git commit -m "base"', 'git switch -c pr/api-integration', 'echo "api code" >> app.js', 'git commit -am "feat(api): connect endpoint"'],
    solutionCommand: 'git log --oneline -n 3',
    solutionExplanation: 'Reviewing branch history with git log and comparing three-dot diffs ensures your PR is clean and easy for teammates to review.',
    hints: [
      'Inspect your branch commits: `git log --oneline -n 3`.',
      'Review changes made against base: `git diff main...HEAD`.',
    ],
    safeFailure: {
      mistakeTitle: 'Submitting a 5,000-Line Giant PR',
      mistakeCommand: 'git commit -am "misc changes and entire rewrite"',
      whatHappened: 'Unreviewable massive PR leads to missed bugs.',
      whatWasNotLost: 'Changes can be split into smaller atomic branches.',
      recoveryCommand: 'git log --oneline',
      recoveryExplanation: 'Keep pull requests under 300 lines for faster, higher quality reviews.',
    },
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
    seedCommands: ['git init', 'echo "v1" > app.js', 'git add app.js', 'git commit -m "v1"', 'echo "WIP edits" >> app.js'],
    solutionCommand: 'git stash && git stash pop',
    solutionExplanation: 'Git stash saves dirty working directory state onto an internal stack, giving you a clean slate to switch tasks immediately.',
    hints: [
      'Shelve your working changes: `git stash`.',
      'Restore them when finished: `git stash pop`.',
    ],
    safeFailure: {
      mistakeTitle: 'Dropping Stash Accidentally',
      mistakeCommand: 'git stash drop',
      whatHappened: 'Removed top stash from the stack.',
      whatWasNotLost: 'Stash commits still exist in `.git/objects` and can be found via `git fsck`.',
      recoveryCommand: 'git stash list',
      recoveryExplanation: 'Inspect `git stash list` carefully before dropping any stored work.',
    },
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
    seedCommands: ['git init', 'echo "c1" > file.txt', 'git add file.txt', 'git commit -m "feat: c1"', 'git switch -c feature/auth', 'echo "auth" >> file.txt', 'git commit -am "feat: auth"', 'git switch main', 'echo "c2" >> file.txt', 'git commit -am "feat: c2"', 'git switch feature/auth'],
    solutionCommand: 'git rebase main',
    solutionExplanation: 'Rebase detaches feature commits and reapplies each commit as a fresh patch on top of the target base, creating a linear history.',
    hints: [
      'Make sure you are on your feature branch: `feature/auth`.',
      'Run `git rebase main` to replay commits.',
    ],
    safeFailure: {
      mistakeTitle: 'Rebasing Pushed Public Main Branch',
      mistakeCommand: 'git rebase -i HEAD~5 (on main after push)',
      whatHappened: 'Rewrote commit hashes that team members already pulled.',
      whatWasNotLost: 'Reflog preserves original commit hashes locally.',
      recoveryCommand: 'git reflog',
      recoveryExplanation: 'Never rebase commits that have already been published to a shared branch.',
    },
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
    seedCommands: ['git init', 'echo "important code" > doc.txt', 'git add doc.txt', 'git commit -m "crucial snapshot"', 'git reset --hard HEAD~1'],
    solutionCommand: 'git reflog',
    solutionExplanation: '`git reflog` records every single movement of HEAD. Even after a hard reset, previous commit objects remain in Git\'s object store for at least 30 days.',
    hints: [
      'Inspect your local action journal: `git reflog`.',
      'Look for the commit hash before the reset and attach a branch.',
    ],
    safeFailure: {
      mistakeTitle: 'Assuming Hard-Reset Commits Are Gone Forever',
      mistakeCommand: 'echo "I lost everything!"',
      whatHappened: 'Giving up hope without checking Git internals.',
      whatWasNotLost: 'Git almost NEVER deletes commits immediately.',
      recoveryCommand: 'git reflog',
      recoveryExplanation: 'Check `git reflog` first — 99% of lost work can be restored in seconds.',
    },
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
    seedCommands: ['git init', 'echo "core" > index.js', 'git add index.js', 'git commit -m "init"'],
    solutionCommand: 'git worktree list',
    solutionExplanation: 'Worktrees allow multiple active working directories connected to the same underlying Git repository database.',
    hints: [
      'List active worktrees: `git worktree list`.',
      'Notice that the main repository path is listed as the root worktree.',
    ],
    safeFailure: {
      mistakeTitle: 'Deleting Worktree Folder Manually without Pruning',
      mistakeCommand: 'rm -rf ../hotfix-worktree',
      whatHappened: 'Left stale administrative metadata in `.git/worktrees`.',
      whatWasNotLost: 'Repository commits and branches remain completely healthy.',
      recoveryCommand: 'git worktree prune',
      recoveryExplanation: 'Run `git worktree prune` to clean up dangling administrative records.',
    },
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
    seedCommands: ['git init', 'echo "internal code" > app.js', 'git add app.js', 'git commit -m "chore: internals test"'],
    solutionCommand: 'git cat-file -p HEAD',
    solutionExplanation: '`git cat-file -p HEAD` inspects the raw binary commit object payload, displaying the tree hash, author, committer, and commit message.',
    hints: [
      'Pretty-print the HEAD commit object: `git cat-file -p HEAD`.',
      'Inspect object type: `git cat-file -t HEAD`.',
    ],
    safeFailure: {
      mistakeTitle: 'Directly Editing Files Inside .git/objects',
      mistakeCommand: 'nano .git/objects/a1/b2c3...',
      whatHappened: 'Corrupted compressed zlib object payload.',
      whatWasNotLost: 'Working directory files still retain their source content.',
      recoveryCommand: 'git status',
      recoveryExplanation: 'Never manually edit files in `.git/objects`; use Git plumbing commands.',
    },
  },
];

export const PracticeView: React.FC = () => {
  const { executeCommand, completedLessonIds, markLessonComplete } = useApp();

  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<PracticeTab>('briefing');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);

  // Active mission
  const currentMission = useMemo(() => {
    return MISSIONS.find((m) => m.level === selectedLevel) || MISSIONS[1];
  }, [selectedLevel]);

  // Check if current mission is completed
  const isMissionDone = completedLessonIds.includes(currentMission.id);

  // Filtered missions for search
  const filteredMissions = useMemo(() => {
    if (!searchQuery.trim()) return MISSIONS;
    const q = searchQuery.toLowerCase();
    return MISSIONS.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.topic.toLowerCase().includes(q) ||
        m.skills.some((s) => s.toLowerCase().includes(q)) ||
        m.badge.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Overall progress
  const completedCount = useMemo(() => {
    return MISSIONS.filter((m) => completedLessonIds.includes(m.id)).length;
  }, [completedLessonIds]);

  const progressPercent = Math.round((completedCount / MISSIONS.length) * 100);

  // Previous and Next mission navigation
  const currentIndex = MISSIONS.findIndex((m) => m.level === selectedLevel);
  const prevMission = currentIndex > 0 ? MISSIONS[currentIndex - 1] : null;
  const nextMission = currentIndex < MISSIONS.length - 1 ? MISSIONS[currentIndex + 1] : null;

  const handleSelectLevel = (lvl: number) => {
    setSelectedLevel(lvl);
    setVerifyResult(null);
    setShowMobileDrawer(false);
  };

  const handleSeedSandbox = () => {
    currentMission.seedCommands.forEach((cmd) => {
      executeCommand(cmd);
    });
    setVerifyResult({
      success: true,
      message: `Loaded starting sandbox for ${currentMission.title}!`,
    });
    setTimeout(() => setVerifyResult(null), 3000);
  };

  const handleVerifyMission = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      // Mark complete
      markLessonComplete(currentMission.id);
      setVerifyResult({
        success: true,
        message: `Verified! Level ${currentMission.level} challenge completed successfully.`,
      });
    }, 600);
  };

  const handleToggleComplete = () => {
    markLessonComplete(currentMission.id);
  };

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        minHeight: 0,
        background: 'var(--bg-app)',
        color: 'var(--text-primary)',
        overflow: 'hidden',
      }}
    >
      {/* ================================================================ */}
      {/* COLUMN 1: LEFT SIDEBAR (13 Practice Missions Accordion + Progress) */}
      {/* ================================================================ */}
      <aside
        className="practice-sidebar-desktop"
        style={{
          width: '270px',
          minWidth: '270px',
          maxWidth: '270px',
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          maxHeight: '100%',
          minHeight: 0,
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            padding: '1.15rem 1rem 0.85rem 1rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-surface)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
              }}
            >
              <Wrench size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.15 }}>
                Practice Missions
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                13 Curriculum Levels • Labs
              </div>
            </div>
          </div>
        </div>

        {/* Quick Search Bar */}
        <div style={{ padding: '0.65rem 0.85rem', borderBottom: '1px solid var(--border-color)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '0.4rem 0.65rem',
            }}
          >
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Filter missions or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.78rem',
                width: '100%',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* 13 Missions List */}
        <div
          style={{
            flex: '1 1 0%',
            minHeight: 0,
            overflowY: 'auto',
            padding: '0.6rem 0.5rem 5rem 0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}
        >
          {filteredMissions.map((m) => {
            const isActive = m.level === selectedLevel;
            const isDone = completedLessonIds.includes(m.id);

            return (
              <div
                key={m.id}
                onClick={() => handleSelectLevel(m.level)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: isActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                  borderLeft: isActive ? '3px solid #38bdf8' : '3px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <span
                  style={{
                    fontFamily: 'ui-monospace, monospace',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: isActive ? '#38bdf8' : 'var(--text-muted)',
                    background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-card)',
                    padding: '0.15rem 0.35rem',
                    borderRadius: '4px',
                    minWidth: '24px',
                    textAlign: 'center',
                  }}
                >
                  L{m.level}
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                  <span
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: isActive ? 800 : 600,
                      color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {m.title}
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {m.topic}
                  </span>
                </div>

                {isDone && (
                  <CheckCircle2 size={14} color="#22c55e" style={{ flexShrink: 0 }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Tracker Footer */}
        <div
          style={{
            flexShrink: 0,
            padding: '0.85rem 1.15rem',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-surface)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Mission Progress
            </span>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8' }}>
              {progressPercent}%
            </span>
          </div>

          <div
            style={{
              width: '100%',
              height: '6px',
              borderRadius: '999px',
              background: 'var(--border-color)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #38bdf8 0%, #22c55e 100%)',
                borderRadius: '999px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>

          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {completedCount} of {MISSIONS.length} levels completed
          </div>
        </div>
      </aside>

      {/* ================================================================ */}
      {/* COLUMN 2: CENTER PANEL (Practice Mission Experience)              */}
      {/* ================================================================ */}
      <main
        className="practice-center-main"
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          maxHeight: '100%',
          overflow: 'hidden',
          background: 'var(--bg-app)',
        }}
      >
        {/* Mobile / Tablet Header (<1200px) */}
        <div
          className="practice-mobile-topbar"
          style={{
            flexShrink: 0,
            padding: '0.5rem 0.85rem',
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
          }}
        >
          <button
            onClick={() => setShowMobileDrawer(!showMobileDrawer)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '8px',
              padding: '0.35rem 0.65rem',
              color: '#38bdf8',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Wrench size={15} />
            <span>Missions ({MISSIONS.length}) • L{currentMission.level}</span>
            <ChevronDown size={13} />
          </button>

          <button
            onClick={() => setActiveTab('sandbox')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '8px',
              padding: '0.35rem 0.65rem',
              color: '#22c55e',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <TerminalIcon size={13} />
            <span>Sandbox</span>
          </button>
        </div>

        {/* Scrollable Center Body */}
        <div
          className="practice-concept-container"
          style={{
            flex: '1 1 0%',
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '1.25rem 2rem 6.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            boxSizing: 'border-box',
          }}
        >
          {/* Hero Header (Matching Learn Page Visual Polish) */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '1.5rem 1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.15rem',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
            }}
          >
            {/* Top Row: Badges & Status */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: '#38bdf8',
                    background: 'rgba(56, 189, 248, 0.12)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {currentMission.badge}
                </span>

                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#a855f7',
                    background: 'rgba(168, 85, 247, 0.12)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '999px',
                  }}
                >
                  {currentMission.topic}
                </span>

                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '999px',
                  }}
                >
                  Interactive Lab
                </span>
              </div>

              {/* Status & Completion Toggle Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <button
                  onClick={handleToggleComplete}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: isMissionDone ? 'rgba(34, 197, 94, 0.15)' : 'var(--bg-surface)',
                    border: isMissionDone ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '0.45rem 0.95rem',
                    color: isMissionDone ? '#22c55e' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <CheckCircle2 size={15} color={isMissionDone ? '#22c55e' : 'var(--text-muted)'} />
                  <span>{isMissionDone ? 'Completed' : 'Mark Complete'}</span>
                </button>
              </div>
            </div>

            {/* Title & Command Section */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(37, 99, 235, 0.3) 100%)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38bdf8',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(56, 189, 248, 0.2)',
                  }}
                >
                  <Wrench size={26} />
                </div>
                <div>
                  <h1 style={{ margin: 0, fontSize: '1.7rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                    {currentMission.title}
                  </h1>
                  <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {currentMission.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Skills Pills Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)' }}>Target Commands:</span>
              {currentMission.skills.map((cmd, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: 'ui-monospace, monospace',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--accent-primary)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '6px',
                  }}
                >
                  $ {cmd}
                </span>
              ))}
            </div>

            {/* Sub-Tabs Navigation (Learn, Visualize, Variations style) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '0.9rem',
                overflowX: 'auto',
              }}
            >
              {[
                { id: 'briefing' as PracticeTab, label: 'Mission Briefing', icon: BookOpen },
                { id: 'sandbox' as PracticeTab, label: 'Terminal Sandbox', icon: TerminalIcon },
                { id: 'skills' as PracticeTab, label: 'Skills & Commands', icon: Code2 },
                { id: 'safeFailure' as PracticeTab, label: 'Safe Failure Lab', icon: ShieldAlert },
                { id: 'hints' as PracticeTab, label: 'Hints & Solution', icon: HelpCircle },
              ].map((tab) => {
                const isTabActive = activeTab === tab.id;
                const IconComponent = tab.icon;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.5rem 0.95rem',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: isTabActive ? 800 : 600,
                      color: isTabActive ? '#38bdf8' : 'var(--text-secondary)',
                      background: isTabActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                      border: isTabActive ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <IconComponent size={15} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Verification Notification Banner */}
          {verifyResult && (
            <div
              style={{
                padding: '0.85rem 1.15rem',
                borderRadius: '10px',
                background: verifyResult.success ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: verifyResult.success ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
                color: verifyResult.success ? '#10b981' : '#ef4444',
                fontSize: '0.86rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
              }}
            >
              <CheckCircle2 size={18} />
              <span>{verifyResult.message}</span>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 1: MISSION BRIEFING                                          */}
          {/* ================================================================ */}
          {activeTab === 'briefing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Mission Scenario Card */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8' }}>
                  <Sparkles size={16} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Scenario Briefing
                  </span>
                </div>
                <div style={{ fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  {currentMission.description}
                </div>
              </div>

              {/* Subtopics Covered Card */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Subtopics Tested in this Lab ({currentMission.subtopics.length})
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.65rem' }}>
                  {currentMission.subtopics.map((sub, i) => (
                    <div
                      key={i}
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '0.7rem 0.85rem',
                        fontSize: '0.82rem',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.55rem',
                      }}
                    >
                      <CheckCircle2 size={16} color="#22c55e" style={{ flexShrink: 0 }} />
                      <span>{sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action to Launch Sandbox */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                <button
                  onClick={() => {
                    handleSeedSandbox();
                    setActiveTab('sandbox');
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.8rem 1.6rem',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                  }}
                >
                  <span>Launch Terminal Sandbox</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => setActiveTab('hints')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                    padding: '0.8rem 1.25rem',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                  }}
                >
                  <HelpCircle size={16} />
                  <span>View Hints</span>
                </button>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 2: TERMINAL SANDBOX                                          */}
          {/* ================================================================ */}
          {activeTab === 'sandbox' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Mission Verification HUD Card */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '1.15rem 1.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Zap size={16} color="#f59e0b" />
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      Mission Goal & Verification
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Execute the required workflow in the terminal below, then click Verify Solution.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <button
                    onClick={handleSeedSandbox}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '0.45rem 0.85rem',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                    title="Preload starting repository state"
                  >
                    <RotateCcw size={13} />
                    <span>Reset Seed State</span>
                  </button>

                  <button
                    onClick={handleVerifyMission}
                    disabled={isVerifying}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      background: isMissionDone ? '#10b981' : '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.45rem 1.15rem',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                    }}
                  >
                    {isMissionDone ? <CheckCircle2 size={15} /> : <Play size={15} />}
                    <span>{isVerifying ? 'Verifying...' : isMissionDone ? 'Verified ✓' : 'Verify Solution'}</span>
                  </button>
                </div>
              </div>

              {/* Pre-fill Quick Action Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)' }}>Quick Commands:</span>
                {currentMission.skills.map((cmd, idx) => (
                  <button
                    key={idx}
                    onClick={() => executeCommand(cmd)}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      padding: '0.25rem 0.6rem',
                      fontFamily: 'ui-monospace, monospace',
                      fontSize: '0.76rem',
                      color: 'var(--accent-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                    title={`Click to execute ${cmd}`}
                  >
                    <span>$ {cmd}</span>
                  </button>
                ))}
              </div>

              {/* Terminal Frame */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  height: '420px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                }}
              >
                <Terminal />
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 3: SKILLS & COMMANDS                                         */}
          {/* ================================================================ */}
          {activeTab === 'skills' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Key Commands Exercised in Level {currentMission.level}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {currentMission.skills.map((skill, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <span
                        style={{
                          fontFamily: 'ui-monospace, monospace',
                          fontSize: '0.9rem',
                          fontWeight: 800,
                          color: 'var(--accent-primary)',
                          background: 'var(--bg-surface)',
                          padding: '0.35rem 0.65rem',
                          borderRadius: '6px',
                          border: '1px solid var(--border-color)',
                        }}
                      >
                        $ {skill}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        executeCommand(skill);
                        setActiveTab('sandbox');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: 'rgba(56, 189, 248, 0.12)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        borderRadius: '6px',
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#38bdf8',
                        cursor: 'pointer',
                      }}
                    >
                      <TerminalIcon size={12} />
                      <span>Run in Sandbox</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 4: SAFE FAILURE LAB                                          */}
          {/* ================================================================ */}
          {activeTab === 'safeFailure' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  borderRadius: '14px',
                  padding: '1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
                  <ShieldAlert size={18} />
                  <span style={{ fontSize: '0.88rem', fontWeight: 800 }}>
                    Common Real-World Pitfall: {currentMission.safeFailure.mistakeTitle}
                  </span>
                </div>

                <div
                  style={{
                    fontFamily: 'ui-monospace, monospace',
                    fontSize: '0.86rem',
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    color: '#ef4444',
                    fontWeight: 700,
                  }}
                >
                  $ {currentMission.safeFailure.mistakeCommand}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
                  <div
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '0.85rem 1rem',
                    }}
                  >
                    <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      What Happened?
                    </div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)', marginTop: '0.35rem', lineHeight: 1.5 }}>
                      {currentMission.safeFailure.whatHappened}
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '0.85rem 1rem',
                    }}
                  >
                    <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>
                      What Was Not Lost?
                    </div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)', marginTop: '0.35rem', lineHeight: 1.5 }}>
                      {currentMission.safeFailure.whatWasNotLost}
                    </div>
                  </div>
                </div>

                {/* Recovery Action */}
                <div
                  style={{
                    background: 'rgba(34, 197, 94, 0.08)',
                    border: '1px solid rgba(34, 197, 94, 0.25)',
                    borderRadius: '10px',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#22c55e', textTransform: 'uppercase' }}>
                      Recommended Recovery Command
                    </div>
                    <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                      $ {currentMission.safeFailure.recoveryCommand}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      executeCommand(currentMission.safeFailure.recoveryCommand);
                      setActiveTab('sandbox');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.45rem 0.95rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <span>Run Recovery</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 5: HINTS & SOLUTION                                          */}
          {/* ================================================================ */}
          {activeTab === 'hints' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Progressive Hints
              </div>

              {currentMission.hints.map((hint, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: '#f59e0b',
                      background: 'rgba(245, 158, 11, 0.15)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      flexShrink: 0,
                    }}
                  >
                    Hint {idx + 1}
                  </span>
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    {hint}
                  </span>
                </div>
              ))}

              {/* Solution Command Box */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  marginTop: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
                    Verified Solution
                  </span>
                  <button
                    onClick={() => {
                      executeCommand(currentMission.solutionCommand);
                      setActiveTab('sandbox');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      borderRadius: '6px',
                      padding: '0.35rem 0.85rem',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#38bdf8',
                      cursor: 'pointer',
                    }}
                  >
                    <span>Run Solution</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                <div
                  style={{
                    fontFamily: 'ui-monospace, monospace',
                    fontSize: '0.88rem',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    color: 'var(--accent-primary)',
                    fontWeight: 700,
                  }}
                >
                  $ {currentMission.solutionCommand}
                </div>

                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {currentMission.solutionExplanation}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pinned Bottom Navigation Bar (matching GitAcademyView) */}
        <div
          className="practice-bottom-bar"
          style={{
            flexShrink: 0,
            padding: '0.65rem 1.25rem',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            boxSizing: 'border-box',
          }}
        >
          {/* Previous Mission Button */}
          <button
            disabled={!prevMission}
            onClick={() => prevMission && handleSelectLevel(prevMission.level)}
            title={prevMission ? `Go to Level ${prevMission.level}: ${prevMission.title}` : 'No previous level'}
            style={{
              background: prevMission ? 'var(--bg-card)' : 'transparent',
              border: prevMission ? '1px solid var(--border-color)' : '1px solid transparent',
              color: prevMission ? 'var(--text-primary)' : 'var(--text-muted)',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              cursor: prevMission ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              opacity: prevMission ? 1 : 0.4,
              transition: 'all 0.15s ease',
            }}
          >
            <ArrowLeft size={14} />
            <span className="nav-btn-text">Previous</span>
          </button>

          {/* Current Level Status Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8' }}>
              Level {currentMission.level} of 12
            </span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {currentMission.title}
            </span>
          </div>

          {/* Next Mission Button */}
          <button
            disabled={!nextMission}
            onClick={() => nextMission && handleSelectLevel(nextMission.level)}
            title={nextMission ? `Go to Level ${nextMission.level}: ${nextMission.title}` : 'No next level'}
            style={{
              background: nextMission ? 'var(--bg-card)' : 'transparent',
              border: nextMission ? '1px solid var(--border-color)' : '1px solid transparent',
              color: nextMission ? 'var(--text-primary)' : 'var(--text-muted)',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              cursor: nextMission ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              opacity: nextMission ? 1 : 0.4,
              transition: 'all 0.15s ease',
            }}
          >
            <span className="nav-btn-text">Next</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </main>
    </div>
  );
};
