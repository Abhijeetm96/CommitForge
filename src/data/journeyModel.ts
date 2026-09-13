export type TimelineStepStatus = 'completed' | 'current' | 'upcoming';

export interface TimelineMilestone {
  id: string;
  label: string;
  status: TimelineStepStatus;
  categoryId: string;
}

export type BentoPreviewType =
  | 'repository'
  | 'staging'
  | 'recovery'
  | 'branching'
  | 'merging'
  | 'remote'
  | 'github'
  | 'collaboration'
  | 'rebase'
  | 'internals'
  | 'actions'
  | 'api';

export type ConceptStatus = 'locked' | 'available' | 'in-progress' | 'learned' | 'mastered';

export interface JourneyConcept {
  id: string;
  title: string;
  description: string;
  status: ConceptStatus;
  commands?: string[];
  subtopics?: string[];
  keyIdea?: string;
  lessonId?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface BentoCategory {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  timelineStepId: string;
  previewType: BentoPreviewType;
  accentColor: string;
  colSpanDesktop: number; // in 12-col grid
  status: ConceptStatus;
  concepts: JourneyConcept[];
  prerequisites?: string[];
}

export interface ContinuingRoadmap {
  id: string;
  title: string;
  description: string;
  badgeColor: string;
}

export const CONTINUING_ROADMAPS: ContinuingRoadmap[] = [
  { id: 'frontend', title: 'Frontend', description: 'Modern JavaScript, TypeScript, React, Next.js, and CSS Architecture', badgeColor: '#3b82f6' },
  { id: 'backend', title: 'Backend', description: 'Node.js, Go, Python, APIs, Databases, and Distributed Systems', badgeColor: '#10b981' },
  { id: 'devops', title: 'DevOps', description: 'Docker, Kubernetes, Linux, Terraform, and Cloud Infrastructure', badgeColor: '#a855f7' },
  { id: 'fullstack', title: 'Full-stack', description: 'End-to-end web applications, real-time data, and scalable deployments', badgeColor: '#f97316' },
];

export const JOURNEY_TIMELINE_STEPS: TimelineMilestone[] = [
  { id: 'foundations', label: 'Foundations', status: 'current', categoryId: 'cat-foundations' },
  { id: 'inspect', label: 'Inspect', status: 'upcoming', categoryId: 'cat-inspect-save' },
  { id: 'save', label: 'Save', status: 'upcoming', categoryId: 'cat-inspect-save' },
  { id: 'recover', label: 'Recover', status: 'upcoming', categoryId: 'cat-undo-recover' },
  { id: 'branch', label: 'Branch', status: 'upcoming', categoryId: 'cat-branching' },
  { id: 'merge', label: 'Merge', status: 'upcoming', categoryId: 'cat-merging' },
  { id: 'remote', label: 'Remote', status: 'upcoming', categoryId: 'cat-remote-git' },
  { id: 'github', label: 'GitHub', status: 'upcoming', categoryId: 'cat-github' },
  { id: 'collaborate', label: 'Collaborate', status: 'upcoming', categoryId: 'cat-collaboration' },
  { id: 'advanced', label: 'Advanced', status: 'upcoming', categoryId: 'cat-advanced-git' },
  { id: 'engineering', label: 'Engineering', status: 'upcoming', categoryId: 'cat-git-engineering' },
];

export const BENTO_CATEGORIES: BentoCategory[] = [
  // ========================================================================
  // 01 — FOUNDATIONS (PDF: Learn the Basics & What is a Repository)
  // ========================================================================
  {
    id: 'cat-foundations',
    number: '01',
    title: 'Foundations',
    tagline: 'Understand Git from the ground up',
    description: 'Mental models, repository structures, working tree, and configuration.',
    timelineStepId: 'foundations',
    previewType: 'repository',
    accentColor: '#38bdf8',
    colSpanDesktop: 7,
    status: 'in-progress',
    concepts: [
      {
        id: 'c-what-is-vcs',
        subtopics: [
          "Centralized vs Distributed Version Control",
          "Historical tracking of file changes over time",
          "Collaborative coding and conflict avoidance"
        ],
        title: 'What is Version Control?',
        description: 'Systems that record changes to a file or set of files over time so you can recall specific versions.',
        status: 'in-progress',
        difficulty: 'Beginner',
      },
      {
        id: 'c-why-use-vcs',
        subtopics: [
          "Accountability & audit trails of who changed what",
          "Safe experimentation via isolated branches",
          "Rolling back breaking mistakes and regressions",
          "Decentralized backup and multi-machine sync"
        ],
        title: 'Why use Version Control?',
        description: 'Collaboration, revision tracking, reverting mistakes, branching experiments, and auditing changes.',
        status: 'available',
        difficulty: 'Beginner',
      },
      {
        id: 'c-git-vs-other-vcs',
        subtopics: [
          "Git vs SVN (Centralized server architecture)",
          "Git vs Mercurial (Distributed design comparisons)",
          "Cryptographic Directed Acyclic Graph (DAG) integrity"
        ],
        title: 'Git vs Other VCS',
        description: 'Distributed architecture vs centralized systems (SVN, Mercurial, Perforce).',
        status: 'available',
        difficulty: 'Beginner',
      },
      {
        id: 'c-installing-git-locally',
        subtopics: [
          "macOS installation (Homebrew / Xcode Command Line Tools)",
          "Windows installation (Git for Windows & Git Bash)",
          "Linux installation (apt / dnf / pacman)",
          "Verifying installation and version (git --version)"
],
        title: 'Installing Git Locally',
        description: 'Installing and verifying Git across macOS (brew), Linux (apt), and Windows.',
        status: 'mastered',
        commands: ['git --version'],
        difficulty: 'Beginner',
      },
      {
        id: 'c-what-is-a-repository',
        subtopics: [
          "The hidden .git metadata database directory",
          "Working Tree (checked out files you edit)",
          "Commit object storage & history DAG",
          "Reference pointers (branches, tags, and HEAD)"
],
        title: 'What is a Repository',
        description: 'The root project folder containing your code plus the internal .git metadata database.',
        status: 'mastered',
        difficulty: 'Beginner',
      },
      {
        id: 'c-repo-init',
        subtopics: [
          "Initializing existing directory (git init)",
          "Initializing named directory (git init <name>)",
          "Configuring default branch name (main)",
          "Bare repositories for remote servers (--bare)"
],
        title: 'git init (Repository Initialization)',
        description: 'Initializes a new empty Git repository in the current directory, creating the .git folder.',
        status: 'mastered',
        commands: ['git init', 'git init <project-name>'],
        difficulty: 'Beginner',
      },
      {
        id: 'c-config',
        subtopics: [
          "Listing active configurations (git config --list)",
          "Setting author name (user.name)",
          "Setting author email (user.email)",
          "Setting default text editor (core.editor)",
          "Setting line-ending behavior (core.autocrlf)"
],
        title: 'git config',
        description: 'Reading and writing configuration variables that govern how Git operates.',
        status: 'mastered',
        commands: ['git config --list', 'git config user.name "Your Name"'],
        difficulty: 'Beginner',
      },
      {
        id: 'c-local-vs-global-config',
        subtopics: [
          "Local configuration per repo (.git/config)",
          "Global configuration per user (~/.gitconfig)",
          "System-wide configuration (/etc/gitconfig)",
          "Configuration precedence order (Local > Global > System)"
],
        title: 'Local vs Global Config',
        description: 'Global config (~/.gitconfig) applies across all projects; local config (.git/config) overrides per repo.',
        status: 'mastered',
        commands: ['git config --global user.name', 'git config --local core.editor'],
        difficulty: 'Beginner',
      },
      {
        id: 'c-intro-git-commands',
        subtopics: [
          "Command anatomy: git <subcommand> [flags] [arguments]",
          "Built-in help manual (git help and git <cmd> --help)",
          "Plumbing (low-level) vs Porcelain (high-level) commands",
          "Tab completion and shell aliases"
        ],
        title: 'Intro and Git Commands',
        description: 'Understanding command syntax: git <command> [options] [arguments] and built-in help.',
        status: 'available',
        commands: ['git help', 'git help <command>'],
        difficulty: 'Beginner',
      },
      {
        id: 'c-working-directory',
        subtopics: [
          "Tracked files vs Untracked files",
          "Unmodified files vs Modified files",
          "The 3 Git states: Working Tree, Index, Repository"
],
        title: 'Working Directory',
        description: 'The real sandbox files currently checked out on disk for your editor to modify.',
        status: 'mastered',
        difficulty: 'Beginner',
      },
      {
        id: 'c-staging-area',
        subtopics: [
          "The intermediate snapshot staging buffer (Index)",
          "Curating clean atomic commits before finalizing",
          "Staging individual files vs staging all changes",
          "Interactive hunk staging (git add -p)"
],
        title: 'Staging Area (Index)',
        description: 'The intermediate staging ground where you curate snapshots before committing.',
        status: 'mastered',
        difficulty: 'Beginner',
      },
      {
        id: 'c-committing-changes',
        subtopics: [
          "Creating permanent snapshots (git commit -m)",
          "Author and committer identity metadata",
          "Cryptographic SHA-1 / SHA-256 hash generation",
          "Parent commit linkage in history DAG"
],
        title: 'Committing Changes',
        description: 'Creating permanent, cryptographically verified milestone snapshots of staged files.',
        status: 'mastered',
        commands: ['git commit -m "feat: initial commit"'],
        difficulty: 'Beginner',
      },
      {
        id: 'c-gitignore',
        subtopics: [
          "Ignoring compiled build outputs (dist/, build/)",
          "Ignoring package dependencies (node_modules/)",
          "Ignoring environment variables and secrets (.env)",
          "Wildcard and glob patterns (*, **, !negation)",
          "Global gitignore files (~/.gitignore_global)"
],
        title: '.gitignore Rules',
        description: 'Specifies intentionally untracked files to ignore from commits (node_modules, .env, builds).',
        status: 'mastered',
        difficulty: 'Beginner',
      },
      {
        id: 'c-viewing-commit-history',
        subtopics: [
          "Chronological log inspection (git log)",
          "One-line condensed history (git log --oneline)",
          "Limiting commit counts (git log -n 5)",
          "Filtering history by date (--since, --until)"
],
        title: 'Viewing Commit History',
        description: 'Inspecting the chronological lineage of commits, authors, timestamps, and commit hashes.',
        status: 'mastered',
        commands: ['git log', 'git log --oneline'],
        difficulty: 'Beginner',
      },
    ],
  },

  // ========================================================================
  // 02 — INSPECT & SAVE (PDF: status, diffs, log options, linear history)
  // ========================================================================
  {
    id: 'cat-inspect-save',
    number: '02',
    title: 'Inspect & Save',
    tagline: 'Curate your next snapshot with precision',
    description: 'Staging ground, status diffing, atomic commits, and descriptive history.',
    timelineStepId: 'save',
    previewType: 'staging',
    accentColor: '#10b981',
    colSpanDesktop: 5,
    status: 'in-progress',
    prerequisites: ['Foundations'],
    concepts: [
      {
        id: 'c-git-status',
        subtopics: [
          "Checking working tree clean status",
          "Changes staged for commit (Green in Index)",
          "Changes not staged for commit (Red in Working Tree)",
          "Untracked files list",
          "Short status format (git status -s)"
],
        title: 'git status',
        description: 'Inspect what changed across the working tree, staging index, and HEAD commit.',
        status: 'mastered',
        commands: ['git status', 'git status -s'],
        difficulty: 'Beginner',
      },
      {
        id: 'c-git-add-staging',
        subtopics: [
          "Staging individual files (git add <file>)",
          "Staging entire project changes (git add . / -A)",
          "Interactive patch staging hunk-by-hunk (git add -p)",
          "Staging file deletions and renames"
],
        title: 'git add & Selective Staging',
        description: 'Moving changes from working directory to the index staging ground.',
        status: 'in-progress',
        commands: ['git add <file>', 'git add .', 'git add -p'],
        lessonId: 'l2-git-foundations',
        difficulty: 'Beginner',
      },
      {
        id: 'c-viewing-diffs',
        subtopics: [
          "git diff (Working tree vs Staging Index)",
          "git diff --staged / --cached (Index vs HEAD commit)",
          "Word-level diff inspection (--word-diff)",
          "Ignoring whitespace changes (-w)"
],
        title: 'Viewing Diffs (Staged & Unstaged)',
        description: 'Inspecting exact line deltas between working tree and index, or index and HEAD.',
        status: 'learned',
        commands: ['git diff', 'git diff --staged'],
        difficulty: 'Beginner',
      },
      {
        id: 'c-diff-between-commits-branches',
        subtopics: [
          "Two-dot commit diff (commitA..commitB)",
          "Three-dot branch merge-base diff (main...feature)",
          "File path scoped diffs (git diff <branch> -- <path>)",
          "Diff change statistics summary (--stat)"
],
        title: 'Diff Between Commits & Branches',
        description: 'Comparing deltas across two commit hashes or comparing feature branch to main.',
        status: 'learned',
        commands: ['git diff commitA..commitB', 'git diff main..feature'],
        difficulty: 'Intermediate',
      },
      {
        id: 'c-git-log-options',
        subtopics: [
          "ASCII branch graph visualization (--graph)",
          "Decorating commits with branch/tag refs (--decorate)",
          "Author filtering (git log --author=\"Name\")",
          "Commit message search (git log --grep=\"keyword\")",
          "Custom formatting (--pretty=format:\"%h - %an: %s\")"
],
        title: 'git log Options & Formatting',
        description: 'Advanced history formatting with --graph, --stat, --author, and custom pretty formats.',
        status: 'available',
        commands: ['git log --graph --oneline --decorate --all'],
        difficulty: 'Intermediate',
      },
      {
        id: 'c-linear-vs-nonlinear',
        subtopics: [
          "Linear rebased commit timeline benefits",
          "Non-linear merge commits with multiple parents",
          "Pros & cons of merge bubbles vs linear history",
          "Fast-forward only merge policies"
],
        title: 'Linear vs Non-Linear History',
        description: 'Understanding merge commits vs linear rebased histories and when each is preferred.',
        status: 'available',
        difficulty: 'Intermediate',
      },
      {
        id: 'c-head-and-detached-head',
        subtopics: [
          "HEAD pointer role as active reference",
          "Symbolic references (.git/HEAD -> refs/heads/main)",
          "Detached HEAD state on commit/tag checkout",
          "Re-attaching HEAD or creating branch from detached state"
],
        title: 'HEAD & Detached HEAD',
        description: 'The active pointer indicating your current commit or branch tip.',
        status: 'available',
        commands: ['git status', 'git checkout <sha>'],
        difficulty: 'Intermediate',
      },
      {
        id: 'c-commit-messages-best-practices',
        subtopics: [
          "Conventional Commits specification (feat, fix, chore, docs)",
          "50/72 rule (50-char subject, 72-char body wrap)",
          "Imperative mood titles (\"Add feature\" not \"Added feature\")",
          "Linking issue trackers and ticket IDs (#123)"
],
        title: 'Commit Messages & Conventions',
        description: 'Writing imperative titles, Conventional Commits (feat, fix, refactor), and descriptive bodies.',
        status: 'available',
        difficulty: 'Beginner',
      },
      {
        id: 'c-git-commit-amend',
        subtopics: [
          "Fixing typos in the most recent commit message",
          "Adding forgotten staged files to the last commit",
          "Updating commit timestamp and metadata",
          "Golden rule: Never amend already pushed public commits"
],
        title: 'git commit --amend',
        description: 'Modifying the most recent commit without creating an extra historical entry.',
        status: 'available',
        commands: ['git commit --amend --no-edit'],
        difficulty: 'Intermediate',
      },
      {
        id: 'c-git-show',
        subtopics: [
          "Viewing full commit metadata and unified diff",
          "Inspecting raw blob file contents at specific revisions",
          "Inspecting directory tree objects and annotated tags"
],
        title: 'git show (Object & Commit Inspection)',
        description: 'Viewing the detailed commit metadata and unified diff for any specific revision.',
        status: 'available',
        commands: ['git show <commit-hash>', 'git show HEAD'],
        difficulty: 'Beginner',
      },
      {
        id: 'c-git-blame',
        subtopics: [
          "Annotating who changed every line and when",
          "Limiting inspection to specific line ranges (-L 15,30)",
          "Ignoring formatting/refactoring commits (--ignore-rev)",
          "Detecting moved and copied lines across files (-C, -M)"
],
        title: 'git blame (Annotate Line Histories)',
        description: 'Discovering who changed what line when, including commit hash and timestamp.',
        status: 'available',
        commands: ['git blame <file>', 'git blame -L 10,25 <file>'],
        difficulty: 'Intermediate',
      },
      {
        id: 'c-git-shortlog',
        subtopics: [
          "Summarizing commit counts grouped by author",
          "Sorting authors by commit frequency (-sn)",
          "Displaying email addresses (-e)",
          "Aggregating across all repository branches (--all)"
],
        title: 'git shortlog (Author Summaries)',
        description: 'Summarizing git log outputs grouped by author with commit counts and titles.',
        status: 'available',
        commands: ['git shortlog -sn', 'git shortlog --all'],
        difficulty: 'Intermediate',
      },
    ],
  },

  // ========================================================================
  // 03 — UNDO & RECOVER (PDF: git restore, git reset, git revert, git reflog)
  // ========================================================================
  {
    id: 'cat-undo-recover',
    number: '03',
    title: 'Undo & Recover',
    tagline: 'Time travel safely without fear of losing work',
    description: 'Restore files, reset branches, revert published commits, and rescue via reflog.',
    timelineStepId: 'recover',
    previewType: 'recovery',
    accentColor: '#f59e0b',
    colSpanDesktop: 4,
    status: 'available',
    prerequisites: ['Inspect & Save'],
    concepts: [
      {
        id: 'c-git-restore',
        subtopics: [
          "Discarding uncommitted working tree modifications",
          "Restoring specific files from the staging index",
          "Restoring from a specific commit (--source=<sha>)",
          "Bulk directory restoration (git restore .)"
],
        title: 'git restore (Working Directory)',
        description: 'Discards unstaged modifications in working files, restoring from the index.',
        status: 'available',
        commands: ['git restore <file>', 'git restore .'],
        difficulty: 'Beginner',
      },
      {
        id: 'c-git-restore-staged',
        subtopics: [
          "Unstaging files from the staging index",
          "Keeping modified changes safely in the working tree",
          "Selective hunk unstaging with patch mode (-p)"
],
        title: 'git restore --staged',
        description: 'Unstages changes from the index while keeping working tree files modified.',
        status: 'available',
        commands: ['git restore --staged <file>'],
        difficulty: 'Beginner',
      },
      {
        id: 'c-git-reset-soft',
        subtopics: [
          "Rewinding branch HEAD pointer by N commits",
          "Preserving all commit changes staged in the index",
          "Ideal for squashing and re-writing local commits"
],
        title: 'git reset --soft',
        description: 'Moves branch pointer back; leaves all changes staged in the index.',
        status: 'available',
        commands: ['git reset --soft HEAD~1'],
        difficulty: 'Intermediate',
      },
      {
        id: 'c-git-reset-mixed',
        subtopics: [
          "Default reset mode (git reset HEAD~1)",
          "Rewinding branch pointer and unstaging changes",
          "Preserving all modifications safely in working tree"
],
        title: 'git reset --mixed (Default)',
        description: 'Moves branch pointer back and unstages changes; preserves edits in working tree.',
        status: 'available',
        commands: ['git reset --mixed HEAD~1'],
        difficulty: 'Intermediate',
      },
      {
        id: 'c-git-reset-hard',
        subtopics: [
          "Rewinding branch pointer to target commit",
          "Wiping all index staged snapshots",
          "Overwriting working tree files with target commit state",
          "Permanent data loss risk for uncommitted work"
],
        title: 'git reset --hard',
        description: 'Dangerous: moves branch pointer and completely wipes index and working tree edits.',
        status: 'available',
        commands: ['git reset --hard HEAD~1'],
        difficulty: 'Intermediate',
      },
      {
        id: 'c-git-revert',
        subtopics: [
          "Calculating exact inverse delta of a previous commit",
          "Creating a new forward commit recording the undo",
          "Safe for published/shared collaborative branches",
          "Reverting merge commits with mainline flag (-m 1)"
],
        title: 'git revert (Safe Public Undo)',
        description: 'Creates a new commit that records the exact inverse delta of a previous commit.',
        status: 'available',
        commands: ['git revert <commit-hash>'],
        difficulty: 'Intermediate',
      },
      {
        id: 'c-git-clean',
        subtopics: [
          "Dry-run preview of files to be removed (git clean -n)",
          "Force removing untracked files (git clean -f)",
          "Removing untracked directories (-d)",
          "Removing ignored files (-x) for clean rebuilds"
],
        title: 'git clean (Remove Untracked)',
        description: 'Removes untracked files and directories from the working tree safely.',
        status: 'available',
        commands: ['git clean -fd', 'git clean -n'],
        difficulty: 'Intermediate',
      },
      {
        id: 'c-git-reflog-rescue',
        subtopics: [
          "Local audit log tracking all HEAD pointer moves",
          "HEAD@{n} reference notation",
          "Rescuing commits after accidental git reset --hard",
          "Rescuing accidentally deleted local branches"
],
        title: 'git reflog (The Audit Log)',
        description: 'The local audit log recording every HEAD update; allows rescuing lost commits.',
        status: 'available',
        commands: ['git reflog', 'git reset --hard HEAD@{1}'],
        difficulty: 'Advanced',
      },
      {
        id: 'c-undo-strategy',
        subtopics: [
          "Decision matrix: Working tree vs Index vs Committed",
          "Local private branch vs Published shared remote branch",
          "When to use restore vs reset vs revert"
],
        title: 'Undo Strategy: Restore vs Reset vs Revert',
        description: 'Clear decision matrix for choosing the right undo command based on publish status and risk.',
        status: 'available',
        difficulty: 'Intermediate',
      },
      {
        id: 'c-recovering-lost-commits',
        subtopics: [
          "Finding orphaned commits via git fsck --lost-found",
          "Inspecting dangling commits with git cat-file",
          "Reconnecting dangling commits back to a named branch"
],
        title: 'Rescuing Dangling Blobs & Commits',
        description: 'Using git fsck --lost-found to resurrect orphaned commits that are not in the reflog.',
        status: 'available',
        commands: ['git fsck --lost-found'],
        difficulty: 'Advanced',
      },
    ],
  },

  // ========================================================================
  // 04 — BRANCHING (PDF: Creating, Renaming, Deleting, Checkout Branch)
  // ========================================================================
  {
    id: 'cat-branching',
    number: '04',
    title: 'Branching',
    tagline: 'Work on new ideas without disturbing main',
    description: 'Movable pointers, isolated feature development, and switching contexts.',
    timelineStepId: 'branch',
    previewType: 'branching',
    accentColor: '#10b981',
    colSpanDesktop: 4,
    status: 'available',
    prerequisites: ['Inspect & Save'],
    concepts: [
      {
        id: 'c-branching-basics',
        subtopics: [
          "Lightweight 41-byte ref pointer semantics",
          "Branch files stored in .git/refs/heads/",
          "Default primary branch conventions (main vs master)",
          "Zero-copy, instantaneous branch creation"
],
        title: 'Branching Basics',
        description: 'Understanding that branches in Git are lightweight, movable 41-byte pointers to commits.',
        status: 'available',
        difficulty: 'Beginner',
      },
      {
        id: 'c-creating-branch',
        subtopics: [
          "Creating branch reference (git branch <name>)",
          "Creating and switching in one step (git switch -c <name>)",
          "Creating branch from specific commit SHA or tag",
          "Creating local branch tracking a remote branch"
],
        title: 'Creating Branch',
        description: 'Spawning a new line of development from the current HEAD commit.',
        status: 'available',
        commands: ['git branch <branch-name>', 'git switch -c <branch-name>'],
        difficulty: 'Beginner',
      },
      {
        id: 'c-checkout-switch-branch',
        subtopics: [
          "Modern branch switching (git switch <name>)",
          "Legacy checkout syntax (git checkout <name>)",
          "Switching branches with uncommitted local work",
          "Detached HEAD warnings and resolution"
],
        title: 'Checkout / Switch Branch',
        description: 'Navigating between branches safely using modern git switch and git checkout.',
        status: 'available',
        commands: ['git switch <branch-name>', 'git checkout <branch-name>'],
        difficulty: 'Beginner',
      },
      {
        id: 'c-renaming-branch',
        subtopics: [
          "Renaming current active branch (git branch -m <new>)",
          "Renaming another branch (git branch -m <old> <new>)",
          "Updating remote tracking ref after branch rename"
],
        title: 'Renaming Branch',
        description: 'Renaming local branches and updating the corresponding upstream references.',
        status: 'available',
        commands: ['git branch -m <old-name> <new-name>', 'git branch -M main'],
        difficulty: 'Beginner',
      },
      {
        id: 'c-deleting-branch',
        subtopics: [
          "Safe delete merged branch (git branch -d <name>)",
          "Force delete unmerged branch (git branch -D <name>)",
          "Deleting remote branch (git push origin --delete <name>)"
],
        title: 'Deleting Branch',
        description: 'Safely deleting merged branches (-d) or force deleting unmerged branches (-D).',
        status: 'available',
        commands: ['git branch -d <name>', 'git push origin --delete <name>'],
        difficulty: 'Beginner',
      },
      {
        id: 'c-branch-naming-conventions',
        subtopics: [
          "Feature branches (feat/user-authentication)",
          "Bugfix branches (fix/login-null-pointer)",
          "Chore and dependency branches (chore/deps-update)",
          "Release and hotfix branch patterns"
],
        title: 'Branch Naming Guidelines',
        description: 'Standard team patterns: feat/user-auth, fix/login-typo, chore/deps.',
        status: 'available',
        difficulty: 'Beginner',
      },
      {
        id: 'c-listing-inspecting-branches',
        subtopics: [
          "Listing local branches (git branch)",
          "Listing remote branches (git branch -r)",
          "Listing all local and remote branches (git branch -a)",
          "Verbose commit SHAs and upstream status (git branch -vv)"
],
        title: 'Listing & Inspecting Branches',
        description: 'Listing local and remote-tracking branches with commit SHAs and upstream status.',
        status: 'available',
        commands: ['git branch -a -v', 'git branch -vv'],
        difficulty: 'Beginner',
      },
      {
        id: 'c-merged-unmerged-branches',
        subtopics: [
          "Filtering merged branches (git branch --merged)",
          "Filtering active unmerged branches (git branch --no-merged)",
          "Safe batch cleanup of merged local branches"
],
        title: 'Merged vs Unmerged Branches',
        description: 'Filtering branches that have already been integrated into main versus active feature branches.',
        status: 'available',
        commands: ['git branch --merged', 'git branch --no-merged'],
        difficulty: 'Intermediate',
      },
    ],
  },

  // ========================================================================
  // 05 — MERGING (PDF: Fast-Forward, Non-FF, Conflicts, Rebase, Squash, Cherry-Pick)
  // ========================================================================
  {
    id: 'cat-merging',
    number: '05',
    title: 'Merging & Strategies',
    tagline: 'Unite independent lines of development',
    description: 'Fast-forwards, 3-way merge commits, squash merges, and calm conflict resolution.',
    timelineStepId: 'merge',
    previewType: 'merging',
    accentColor: '#8b5cf6',
    colSpanDesktop: 4,
    status: 'available',
    prerequisites: ['Branching'],
    concepts: [
      {
        id: 'c-merging-basics',
        subtopics: [
          "Target branch vs Incoming branch concepts",
          "Identifying the common ancestor commit",
          "Merging incoming changes into current active branch"
],
        title: 'Merging Basics',
        description: 'Integrating independent lines of development into the current branch.',
        status: 'available',
        commands: ['git merge <branch>'],
        difficulty: 'Beginner',
      },
      {
        id: 'c-fast-forward-vs-non-ff',
        subtopics: [
          "Fast-Forward pointer slide when history is linear",
          "Enforcing explicit merge commit records (--no-ff)",
          "Enforcing fast-forward only merges (--ff-only)",
          "Visual topology differences in commit graph"
],
        title: 'Fast-Forward vs Non-FF',
        description: 'Sliding branch pointers forward when linear versus creating an explicit merge commit (--no-ff).',
        status: 'available',
        commands: ['git merge --ff-only <branch>', 'git merge --no-ff <branch>'],
        difficulty: 'Intermediate',
      },
      {
        id: 'c-handling-conflicts',
        subtopics: [
          "Conflict marker anatomy (<<<<<<<, =======, >>>>>>>)",
          "Inspecting both versions and common ancestor",
          "Marking resolved files with git add",
          "Completing merge with git merge --continue"
],
        title: 'Handling Merge Conflicts',
        description: 'Interpreting conflict markers (<<<<<<<, =======, >>>>>>>) and resolving differences cleanly.',
        status: 'available',
        commands: ['git status', 'git merge --continue', 'git merge --abort'],
        difficulty: 'Intermediate',
      },
      {
        id: 'c-rebase-merge-strategy',
        subtopics: [
          "Replaying feature commits on top of upstream tip",
          "Crafting a completely linear project history",
          "Rebase vs Merge tradeoffs and team conventions",
          "Resolving step-by-step rebase conflicts"
],
        title: 'Rebase (Merge Strategy)',
        description: 'Replaying feature branch commits on top of upstream main before merging.',
        status: 'available',
        commands: ['git rebase main'],
        difficulty: 'Intermediate',
      },
      {
        id: 'c-squash-merging',
        subtopics: [
          "Collapsing multiple WIP commits into one unified commit",
          "Executing git merge --squash <feature-branch>",
          "Writing clean summary commit message for main",
          "Simplifying bisect and rollback operations"
],
        title: 'Squash Merging',
        description: 'Collapsing multiple work-in-progress commits into a single clean commit on target branch.',
        status: 'available',
        commands: ['git merge --squash <branch>'],
        difficulty: 'Intermediate',
      },
      {
        id: 'c-cherry-picking-commits',
        subtopics: [
          "Applying specific commit delta from another branch",
          "Cherry-picking production hotfixes into main",
          "Cherry-picking without committing immediately (-n)",
          "Resolving cherry-pick conflicts"
],
        title: 'Cherry Picking Commits',
        description: 'Applying changes from specific commits on other branches onto the active branch.',
        status: 'available',
        commands: ['git cherry-pick <commit-hash>'],
        difficulty: 'Intermediate',
      },
      {
        id: 'c-aborting-merges',
        subtopics: [
          "Executing git merge --abort on conflicted merge",
          "Restoring repository state before the merge began",
          "Cleaning conflicted index and working directory"
],
        title: 'Aborting Failed Merges',
        description: 'Cancelling an in-progress merge conflict and restoring repository state before the merge attempt.',
        status: 'available',
        commands: ['git merge --abort'],
        difficulty: 'Beginner',
      },
      {
        id: 'c-merge-strategies-options',
        subtopics: [
          "ort merge driver (modern default in Git)",
          "recursive strategy and subtree merges",
          "Favoring local edits (-X ours)",
          "Favoring incoming edits (-X theirs)"
],
        title: 'Merge Strategies & Options',
        description: 'Understanding ort and recursive merge drivers, ours/theirs flags, and subtree merges.',
        status: 'available',
        commands: ['git merge -X ours <branch>', 'git merge -X theirs <branch>'],
        difficulty: 'Advanced',
      },
    ],
  },

  // ========================================================================
  // 06 — REMOTE GIT (PDF: Managing Remotes, Cloning, Push/Pull, Fetch)
  // ========================================================================
  {
    id: 'cat-remote-git',
    number: '06',
    title: 'Remote Git',
    tagline: 'Synchronize code across machines and cloud servers',
    description: 'Origin, fetch, pull, push, upstream tracking, and remote branches.',
    timelineStepId: 'remote',
    previewType: 'remote',
    accentColor: '#38bdf8',
    colSpanDesktop: 6,
    status: 'available',
    prerequisites: ['Merging & Strategies'],
    concepts: [
      {
        id: 'c-cloning-repositories',
        subtopics: [
          "Downloading complete repository history DAG",
          "Cloning over SSH vs HTTPS protocols",
          "Cloning into custom directory names",
          "Automatic origin remote configuration"
],
        title: 'Cloning Repositories',
        description: 'Downloading full repository histories and setting up default origin remote and tracking.',
        status: 'available',
        commands: ['git clone <url>', 'git clone --depth 1 <url>'],
        difficulty: 'Beginner',
      },
      {
        id: 'c-managing-remotes',
        subtopics: [
          "Listing configured remotes and URLs (git remote -v)",
          "Adding new remote servers (git remote add <name> <url>)",
          "Renaming remotes (git remote rename <old> <new>)",
          "Updating remote URLs (git remote set-url <name> <url>)"
],
        title: 'Managing Remotes',
        description: 'Listing, adding, renaming, and removing remote repository connections.',
        status: 'available',
        commands: ['git remote -v', 'git remote add origin <url>', 'git remote set-url origin <url>'],
        difficulty: 'Beginner',
      },
      {
        id: 'c-pushing-pulling-changes',
        subtopics: [
          "Pushing local commits to remote (git push origin <branch>)",
          "Pulling remote commits (git pull origin <branch>)",
          "Setting upstream tracking flags (-u / --set-upstream)",
          "Pull with rebase workflow (git pull --rebase)"
],
        title: 'Pushing / Pulling Changes',
        description: 'Publishing local branch commits to remote servers and pulling down teammate updates.',
        status: 'available',
        commands: ['git push -u origin <branch>', 'git pull origin <branch>'],
        difficulty: 'Beginner',
      },
      {
        id: 'c-fetch-without-merge',
        subtopics: [
          "Downloading remote commits without touching working tree",
          "Updating remote tracking references (origin/main)",
          "Inspecting incoming changes before merging",
          "Comparing local branch against fetched remote branch"
],
        title: 'Fetch without Merge',
        description: 'Inspecting remote branches safely without mutating local working tree or branch pointers.',
        status: 'available',
        commands: ['git fetch origin', 'git diff main origin/main'],
        difficulty: 'Intermediate',
      },
      {
        id: 'c-upstream-tracking-branches',
        subtopics: [
          "Configuring default tracking relationship (-u)",
          "Inspecting ahead/behind status (git branch -vv)",
          "Automating default push and pull destinations"
],
        title: 'Upstream & Tracking Branches',
        description: 'Configuring branch tracking (-u) so git pull and git push know the default target.',
        status: 'available',
        commands: ['git branch -vv', 'git branch --set-upstream-to=origin/<branch>'],
        difficulty: 'Intermediate',
      },
      {
        id: 'c-remote-pruning',
        subtopics: [
          "Cleaning up deleted remote branch references locally",
          "Executing git fetch --prune / git fetch -p",
          "Configuring automatic global prune (fetch.prune = true)"
],
        title: 'Remote Pruning (Dead References)',
        description: 'Cleaning up obsolete local references to deleted remote branches.',
        status: 'available',
        commands: ['git fetch -p', 'git remote prune origin'],
        difficulty: 'Intermediate',
      },
      {
        id: 'c-multiple-remotes',
        subtopics: [
          "Managing personal fork remote (origin)",
          "Managing central upstream open-source repo (upstream)",
          "Syncing personal fork with upstream changes"
],
        title: 'Multiple Remotes (origin & upstream)',
        description: 'Managing upstream original repositories alongside personal fork origins in open-source.',
        status: 'available',
        commands: ['git remote add upstream <url>', 'git fetch upstream'],
        difficulty: 'Intermediate',
      },
      {
        id: 'c-shallow-cloning',
        subtopics: [
          "Shallow clone with commit history depth (git clone --depth 1)",
          "Blobless partial clone (git clone --filter=blob:none)",
          "Treeless partial clones for monorepos",
          "Deepening shallow clones (--deepen=10)"
],
        title: 'Shallow & Partial Clones',
        description: 'Optimizing CI speed and disk usage with --depth=1 and --filter=blob:none.',
        status: 'available',
        commands: ['git clone --depth=1 <url>', 'git clone --filter=blob:none <url>'],
        difficulty: 'Advanced',
      },
    ],
  },

  // ========================================================================
  // 07 — GITHUB ESSENTIALS (PDF: Account, Interface, Profile, Repositories)
  // ========================================================================
  {
    id: 'cat-github',
    number: '07',
    title: 'GitHub Essentials & Profile',
    tagline: 'Cloud hosting, profile setup, and community',
    description: 'Account security, profile READMEs, repository visibility, and developer presence.',
    timelineStepId: 'github',
    previewType: 'github',
    accentColor: '#ec4899',
    colSpanDesktop: 6,
    status: 'available',
    prerequisites: ['Remote Git'],
    concepts: [
      {
        id: 'c-creating-account',
        subtopics: [
          "GitHub account registration and username choice",
          "Two-Factor Authentication (2FA) via Authenticator/WebAuthn",
          "Generating secure Ed25519 SSH keypairs",
          "Registering public key with GitHub account settings"
],
        title: 'Creating Account & Authentication',
        description: 'Configuring 2FA, SSH keys (Ed25519), and Personal Access Tokens for secure operations.',
        status: 'available',
        commands: ['ssh-keygen -t ed25519', 'ssh -T git@github.com'],
        difficulty: 'Beginner',
      },
      {
        id: 'c-github-interface',
        subtopics: [
          "Code repository browser and blame view",
          "Commit history list and commit network graph",
          "Quick file finder (hotkey \"t\")",
          "Symbol search and global code search"
],
        title: 'GitHub Interface Navigation',
        description: 'Navigating code trees, commit history views, blame views, and keyboard shortcuts.',
        status: 'available',
        difficulty: 'Beginner',
      },
      {
        id: 'c-setting-up-profile',
        subtopics: [
          "Creating username/username special repository",
          "Profile README.md bio, skills, and portfolio showcase",
          "Dynamic GitHub stats cards and activity widgets",
          "Pinning top 6 featured repositories"
],
        title: 'Setting up Profile & Readme',
        description: 'Creating the special username/username repository to render a custom profile markdown.',
        status: 'available',
        difficulty: 'Beginner',
      },
      {
        id: 'c-creating-repositories',
        subtopics: [
          "Public open-source vs Private proprietary repositories",
          "Choosing open-source licenses (MIT, Apache 2.0, GPL)",
          "Initializing with README and .gitignore templates",
          "Repository description, website link, and topic tags"
],
        title: 'Creating Repositories (Private vs Public)',
        description: 'Configuring repository visibility, open-source licenses (MIT, Apache), and templates.',
        status: 'available',
        difficulty: 'Beginner',
      },
      {
        id: 'c-github-discussions',
        subtopics: [
          "Community discussion categories (Announcements, Q&A, Ideas)",
          "Upvoting discussions and marking accepted answers",
          "Converting productive discussions into trackable issues"
],
        title: 'GitHub Discussions',
        description: 'Open conversation forums for project ideas, questions, and announcements.',
        status: 'available',
        difficulty: 'Beginner',
      },
      {
        id: 'c-saved-replies-mentions-reactions',
        subtopics: [
          "Creating reusable saved reply templates for code reviews",
          "User and team @mentions for targeted notifications",
          "Emoji reactions on issues and PR comments (+1, heart, rocket)"
],
        title: 'Saved Replies, Mentions & Reactions',
        description: 'Productivity features: saved comment snippets, @mentions, and emoji reactions.',
        status: 'available',
        difficulty: 'Beginner',
      },
      {
        id: 'c-github-gists',
        subtopics: [
          "Creating public and secret code gists",
          "Multi-file version-controlled code snippets",
          "Embedding interactive gists in documentation and blogs"
],
        title: 'GitHub Gists',
        description: 'Sharing individual snippets, scripts, and notes without full repository overhead.',
        status: 'available',
        difficulty: 'Beginner',
      },
      {
        id: 'c-github-sponsors',
        subtopics: [
          "Setting up a developer sponsorship profile",
          "Configuring monthly and one-time funding tiers",
          "Adding repository funding button (.github/FUNDING.yml)"
],
        title: 'GitHub Sponsors',
        description: 'Financially supporting open-source maintainers and projects directly through GitHub.',
        status: 'available',
        difficulty: 'Beginner',
      },
      {
        id: 'c-ssh-vs-https-auth',
        subtopics: [
          "Passwordless SSH authentication with ssh-agent",
          "HTTPS authentication via Git Credential Manager (GCM)",
          "Migrating remotes from HTTPS to SSH format"
],
        title: 'SSH Keys vs HTTPS Credentials',
        description: 'Setting up passwordless Git push with Ed25519 keys, ssh-agent, and Git Credential Manager.',
        status: 'available',
        commands: ['ssh -T git@github.com', 'git config --global credential.helper osxkeychain'],
        difficulty: 'Beginner',
      },
      {
        id: 'c-personal-access-tokens',
        subtopics: [
          "Classic tokens vs Fine-Grained Personal Access Tokens",
          "Granular repository access permissions and scopes",
          "Setting security expiration schedules",
          "CLI authentication for gh and automated scripts"
],
        title: 'Personal Access Tokens (Fine-Grained PATs)',
        description: 'Generating scoped tokens for CLI operations and third-party tools with least privilege.',
        status: 'available',
        difficulty: 'Intermediate',
      },
      {
        id: 'c-github-notifications',
        subtopics: [
          "Watching releases vs Participating vs All activity",
          "Configuring notification delivery (Email vs Web inbox)",
          "Triage workflows (Mark as Done, Save for later, Unsubscribe)"
],
        title: 'Notifications & Watch Settings',
        description: 'Managing inbox filters, email notifications, and watching vs participating in repos.',
        status: 'available',
        difficulty: 'Beginner',
      },
    ],
  },

  // ========================================================================
  // 08 — COLLABORATION & DOCUMENTATION (PDF: Forks, PRs, Code Reviews, Projects, Teams)
  // ========================================================================
  {
    id: 'cat-collaboration',
    number: '08',
    title: 'Collaboration, PRs & Projects',
    tagline: 'Peer review, project planning, and documentation',
    description: 'Pull requests, code reviews, Kanban boards, teams, and project docs.',
    timelineStepId: 'collaborate',
    previewType: 'collaboration',
    accentColor: '#06b6d4',
    colSpanDesktop: 5,
    status: 'available',
    prerequisites: ['GitHub Essentials & Profile'],
    concepts: [
      {
        id: 'c-forking-vs-cloning',
        subtopics: [
          "Server-side fork into personal user account",
          "Fork workflow for contributing to open-source software",
          "Sync fork button in GitHub web UI"
],
        title: 'Forking vs Cloning',
        description: 'Server-side fork copy for open-source contributions vs direct repository checkout.',
        status: 'available',
        difficulty: 'Beginner',
      },
      {
        id: 'c-issues-and-labelling',
        subtopics: [
          "Filing structured bug reports and feature requests",
          "Issue template forms (.github/ISSUE_TEMPLATE/)",
          "Applying triage labels (bug, enhancement, good first issue)",
          "Assigning team members and milestone deadlines"
],
        title: 'Issues & Labelling Issues / PRs',
        description: 'Filing bug reports, applying triage labels (good first issue, bug), and assigning.',
        status: 'available',
        difficulty: 'Beginner',
      },
      {
        id: 'c-collaborators-and-members',
        subtopics: [
          "Inviting collaborators to private and public repositories",
          "Permission levels (Read, Triage, Write, Maintain, Admin)",
          "Enforcing least-privilege access policies"
],
        title: 'Collaborators & Members',
        description: 'Managing read, write, triage, and admin permissions for teammates and contributors.',
        status: 'available',
        difficulty: 'Beginner',
      },
      {
        id: 'c-pull-requests-and-fork-prs',
        subtopics: [
          "Opening Pull Request between base and compare branches",
          "Cross-repository Pull Requests from forked repositories",
          "Draft Pull Requests for early feedback",
          "Auto-closing issues with keywords (Fixes #12, Closes #34)"
],
        title: 'Pull Requests & PR from a Fork',
        description: 'Proposing changes, triggering automated CI checks, and opening review discussions.',
        status: 'available',
        difficulty: 'Beginner',
      },
      {
        id: 'c-code-reviews-and-guidelines',
        subtopics: [
          "Unified vs Split diff comparison views",
          "Inline code comments and multi-line suggestions",
          "Submitting batch reviews (Comment, Approve, Request changes)",
          "Resolving conversation threads and re-requesting review"
],
        title: 'Code Reviews & PR Guidelines',
        description: 'Reviewing line diffs, submitting batch reviews, requesting changes, and approving.',
        status: 'available',
        difficulty: 'Intermediate',
      },
      {
        id: 'c-documentation-markdown-wikis',
        subtopics: [
          "GitHub Flavored Markdown (tables, checklists, syntax highlight)",
          "Comprehensive README.md project documentation",
          "Repository Wikis for extended developer guides",
          "CITATION.cff for academic research attribution"
],
        title: 'Documentation (Markdown, Wikis, CITATION)',
        description: 'Writing rich README.md, GitHub Wikis, and CITATION.cff academic attribution files.',
        status: 'available',
        difficulty: 'Beginner',
      },
      {
        id: 'c-contribution-guidelines-clean-history',
        subtopics: [
          "CONTRIBUTING.md instructions for setup and testing",
          "Contributor Covenant Code of Conduct (CODE_OF_CONDUCT.md)",
          "Squashing and rebasing PR commits before merge",
          "Enforcing clean commit history standards"
],
        title: 'Contribution Guidelines & Clean History',
        description: 'CONTRIBUTING.md standards, code of conduct, and maintaining clean git histories.',
        status: 'available',
        difficulty: 'Intermediate',
      },
      {
        id: 'c-github-organizations-and-teams',
        subtopics: [
          "Setting up a GitHub Organization",
          "Nested team structures and role permissions",
          "Team @mentions for group notifications",
          "Organization-wide default repository permissions"
],
        title: 'Organizations & Teams',
        description: 'Setting up enterprise organizations, team mentions (@org/team), and team repos.',
        status: 'available',
        difficulty: 'Intermediate',
      },
      {
        id: 'c-github-projects-kanban-roadmaps',
        subtopics: [
          "Project boards with Kanban column layouts",
          "Table, Board, and Roadmap timeline views",
          "Custom issue fields (Priority, Estimate, Sprint)",
          "Automated status updates when PRs are opened or merged"
],
        title: 'GitHub Projects (Kanban & Automations)',
        description: 'Modern table, board, and roadmap views with automated issue status transitions.',
        status: 'available',
        difficulty: 'Intermediate',
      },
      {
        id: 'c-branch-protection-rules',
        subtopics: [
          "Requiring pull request approvals before merging",
          "Requiring passing CI status checks",
          "Restricting branch pushes to designated maintainers",
          "Repository rulesets across multiple target branches"
],
        title: 'Branch Protection & Rulesets',
        description: 'Enforcing required PR reviews, passing CI status checks, and linear commit history.',
        status: 'available',
        difficulty: 'Intermediate',
      },
      {
        id: 'c-codeowners-file',
        subtopics: [
          ".github/CODEOWNERS syntax and glob patterns",
          "Mapping directory paths to team reviewers",
          "Automatically requesting review from code owners"
],
        title: 'CODEOWNERS File',
        description: 'Automatically assigning subject-matter expert reviewers based on modified file paths.',
        status: 'available',
        difficulty: 'Intermediate',
      },
      {
        id: 'c-draft-pull-requests',
        subtopics: [
          "Marking work-in-progress PRs as Draft",
          "Preventing accidental merging by teammates",
          "Requesting early architectural feedback without alerting team",
          "Converting Draft to Ready for Review"
],
        title: 'Draft Pull Requests',
        description: 'Sharing early work-in-progress code without notifying assignees or blocking merge queues.',
        status: 'available',
        difficulty: 'Beginner',
      },
    ],
  },

  // ========================================================================
  // 09 — ADVANCED GIT & REWRITING (PDF: Stash, Rebase -i, Filter-branch, Tags, Bisect)
  // ========================================================================
  {
    id: 'cat-advanced-git',
    number: '09',
    title: 'Advanced Git & History Rewriting',
    tagline: 'Craft pristine, linear, and intentional history',
    description: 'Interactive rebase, squash, cherry-pick, stash, bisect, and safe force push.',
    timelineStepId: 'advanced',
    previewType: 'rebase',
    accentColor: '#f97316',
    colSpanDesktop: 7,
    status: 'available',
    prerequisites: ['Collaboration, PRs & Projects'],
    concepts: [
      {
        id: 'c-git-stash-basics',
        subtopics: [
          "Shelving uncommitted working tree edits (git stash)",
          "Listing stashed states (git stash list)",
          "Restoring and removing from stack (git stash pop)",
          "Restoring and retaining in stack (git stash apply)",
          "Clearing entire stash stack (git stash clear)"
],
        title: 'Git Stash Basics',
        description: 'Shelving uncommitted work temporarily to switch contexts without losing edits.',
        status: 'available',
        commands: ['git stash', 'git stash pop', 'git stash list', 'git stash apply'],
        difficulty: 'Intermediate',
      },
      {
        id: 'c-git-stash-branch',
        subtopics: [
          "Inspecting stash patch contents (git stash show -p)",
          "Creating a new branch directly from stash (git stash branch)",
          "Stashing untracked and ignored files (-u, -a)"
],
        title: 'git stash branch & Inspection',
        description: 'Inspecting stash diffs and creating a brand new branch directly from stashed changes.',
        status: 'available',
        commands: ['git stash show -p', 'git stash branch <new-branch>'],
        difficulty: 'Intermediate',
      },
      {
        id: 'c-git-rebase-and-interactive',
        subtopics: [
          "pick: keep commit unchanged",
          "reword: modify commit message",
          "edit: pause rebase to amend files or commits",
          "squash: combine commit into previous with message",
          "fixup: combine commit into previous discarding message",
          "drop: permanently delete commit from history"
],
        title: 'git rebase & Interactive Rebase (-i)',
        description: 'Reordering, squashing, editing, and dropping historical commits with surgical precision.',
        status: 'available',
        commands: ['git rebase -i HEAD~4', 'git rebase --abort'],
        difficulty: 'Advanced',
      },
      {
        id: 'c-git-filter-branch',
        subtopics: [
          "Rewriting historical branches across the entire repository",
          "Purging accidentally committed secrets (.env, API keys)",
          "Purging large binary assets from all commits",
          "Modern high-speed replacement: git-filter-repo"
],
        title: 'git filter-branch & git-filter-repo',
        description: 'Rewriting whole historical branches to purge accidentally committed secrets or huge binaries.',
        status: 'available',
        commands: ['git filter-branch', 'git-filter-repo'],
        difficulty: 'Expert',
      },
      {
        id: 'c-git-push-force-and-lease',
        subtopics: [
          "Catastrophic risks of blind git push --force",
          "Safe force pushing with lease (--force-with-lease)",
          "Verifying remote ref has not changed before overwrite",
          "Team communication during history rewriting"
],
        title: 'git push --force & --force-with-lease',
        description: 'Publishing rewritten history safely using lease protection to prevent teammate overwrite.',
        status: 'available',
        commands: ['git push --force-with-lease origin <branch>'],
        difficulty: 'Advanced',
      },
      {
        id: 'c-tagging-releases',
        subtopics: [
          "Lightweight tags as named commit pointers (git tag <v1.0>)",
          "Annotated tags with author and message (git tag -a <v1.0> -m)",
          "Semantic Versioning guidelines (vMAJOR.MINOR.PATCH)",
          "Pushing tags to remotes (git push origin --tags)",
          "Publishing GitHub Releases with attached binary assets"
],
        title: 'Tagging & GitHub Releases',
        description: 'Annotated release tags, pushing tags, and creating binary release bundles on GitHub.',
        status: 'available',
        commands: ['git tag -a v1.0.0 -m "Release v1.0.0"', 'git push origin --tags'],
        difficulty: 'Intermediate',
      },
      {
        id: 'c-git-bisect',
        subtopics: [
          "Binary search regression debugging through commit history",
          "Marking bad commit (git bisect bad)",
          "Marking good commit (git bisect good <sha>)",
          "Automating regression detection with test script (git bisect run)"
],
        title: 'Git Bisect (Binary Regression Search)',
        description: 'Binary searching through commit history to identify the exact commit that broke a feature.',
        status: 'available',
        commands: ['git bisect start', 'git bisect bad', 'git bisect good <sha>'],
        difficulty: 'Advanced',
      },
      {
        id: 'c-git-worktree',
        subtopics: [
          "Managing multiple working trees attached to one repository",
          "Checking out two branches simultaneously in different folders",
          "Adding new worktree (git worktree add ../hotfix main)",
          "Listing and pruning worktrees (git worktree list / prune)"
],
        title: 'Git Worktree (Parallel Checkouts)',
        description: 'Managing multiple working trees attached to the same repository simultaneously.',
        status: 'available',
        commands: ['git worktree add ../hotfix main', 'git worktree list'],
        difficulty: 'Advanced',
      },
      {
        id: 'c-git-attributes',
        subtopics: [
          ".gitattributes syntax and file pattern rules",
          "Cross-platform line-ending normalization (text eol=lf)",
          "Binary file diff prevention and LFS filters",
          "Custom merge drivers per file extension"
],
        title: 'Git Attributes (.gitattributes)',
        description: 'Configuring line-ending normalization (CRLF/LF), diff filters, and binary file handling.',
        status: 'available',
        difficulty: 'Intermediate',
      },
      {
        id: 'c-git-rerere',
        subtopics: [
          "Enabling Reuse Recorded Resolution (rerere.enabled = true)",
          "Automatically recording conflict resolutions",
          "Auto-replaying recorded conflict resolutions during rebase"
],
        title: 'git rerere (Reuse Recorded Resolution)',
        description: 'Automatically recording and replaying identical merge conflict resolutions during rebase.',
        status: 'available',
        commands: ['git config --global rerere.enabled true'],
        difficulty: 'Expert',
      },
      {
        id: 'c-git-lfs',
        subtopics: [
          "Tracking large file extensions (git lfs track \"*.psd\")",
          "Storing small text pointer files in Git repository",
          "Uploading and downloading heavy payloads from LFS storage",
          "git lfs pull and fetch commands"
],
        title: 'Git LFS (Large File Storage)',
        description: 'Replacing huge binary assets (models, audio, video) with tiny pointer references.',
        status: 'available',
        commands: ['git lfs install', 'git lfs track "*.psd"'],
        difficulty: 'Advanced',
      },
      {
        id: 'c-git-patch',
        subtopics: [
          "Exporting commit as formatted email patch (git format-patch)",
          "Applying patches directly to repository (git apply / git am)",
          "Offline and mailing-list developer workflows"
],
        title: 'Git Patch (format-patch & am)',
        description: 'Exporting commits as portable email patches and applying them to other repositories.',
        status: 'available',
        commands: ['git format-patch -1 <sha>', 'git apply <patch-file>'],
        difficulty: 'Advanced',
      },
    ],
  },

  // ========================================================================
  // 10 — GIT ENGINEERING & HOOKS (PDF: Git hooks, Common Hooks, Submodules)
  // ========================================================================
  {
    id: 'cat-git-engineering',
    number: '10',
    title: 'Git Engineering & Hooks',
    tagline: 'Under the hood: DAGs, objects, and scripts',
    description: 'Client and server hooks, nested submodules, and the internal object model.',
    timelineStepId: 'engineering',
    previewType: 'internals',
    accentColor: '#a855f7',
    colSpanDesktop: 4,
    status: 'locked',
    prerequisites: ['Advanced Git & History Rewriting'],
    concepts: [
      {
        id: 'c-git-hooks-what-why',
        subtopics: [
          "Custom scripts executed automatically on Git lifecycle events",
          ".git/hooks/ directory and sample scripts",
          "Non-zero exit codes to block or cancel Git commands",
          "Client-side hooks vs Server-side hooks"
],
        title: 'Git Hooks: What and Why?',
        description: 'Scripts executed automatically before or after Git events like commit, push, or merge.',
        status: 'locked',
        difficulty: 'Advanced',
      },
      {
        id: 'c-client-vs-server-hooks',
        subtopics: [
          "Client hooks: pre-commit, prepare-commit-msg, commit-msg, post-commit",
          "Client hooks: pre-push, post-checkout, post-merge",
          "Server hooks: pre-receive, update, post-receive"
],
        title: 'Client vs Server Hooks',
        description: 'Local developer hooks (pre-commit, commit-msg) vs remote server-side hooks (pre-receive, update).',
        status: 'locked',
        difficulty: 'Advanced',
      },
      {
        id: 'c-common-hooks-pre-commit',
        subtopics: [
          "pre-commit: linting, formatting, and secret checking",
          "commit-msg: validating Conventional Commit message syntax",
          "Bypassing hooks for emergencies (--no-verify)"
],
        title: 'pre-commit & commit-msg Hooks',
        description: 'Running linters and tests before commit creation, and validating commit message syntax.',
        status: 'locked',
        commands: ['.git/hooks/pre-commit', '.git/hooks/commit-msg'],
        difficulty: 'Advanced',
      },
      {
        id: 'c-common-hooks-post-checkout-update',
        subtopics: [
          "post-checkout: auto-installing dependencies on branch change",
          "pre-push: running test suites before publishing code",
          "post-receive: triggering server build notifications"
],
        title: 'post-checkout, post-update, pre-push',
        description: 'Lifecycle hooks for checking dependencies on branch switch and validating before push.',
        status: 'locked',
        commands: ['.git/hooks/post-checkout', '.git/hooks/pre-push'],
        difficulty: 'Advanced',
      },
      {
        id: 'c-submodules-what-why',
        subtopics: [
          "Embedding external Git repositories inside parent repositories",
          "Pinning child repositories to specific commit SHAs",
          ".gitmodules configuration file",
          "Managing shared code libraries and dependencies"
],
        title: 'Submodules: What and Why use?',
        description: 'Keeping a Git repository as a subdirectory of another Git repository at a pinned commit.',
        status: 'locked',
        difficulty: 'Advanced',
      },
      {
        id: 'c-submodules-adding-updating',
        subtopics: [
          "Adding submodules (git submodule add <url> <path>)",
          "Initializing and updating (git submodule update --init)",
          "Recursive cloning (git clone --recurse-submodules)",
          "Syncing submodule pointers to latest upstream commits"
],
        title: 'Submodules: Adding & Updating',
        description: 'Adding child submodules, cloning with --recurse-submodules, and syncing upstream SHAs.',
        status: 'locked',
        commands: ['git submodule add <url>', 'git submodule update --init --recursive'],
        difficulty: 'Advanced',
      },
      {
        id: 'c-git-internals-objects',
        subtopics: [
          "Blob object: raw uncompressed file contents",
          "Tree object: directory listing of names, modes, and SHAs",
          "Commit object: tree pointer, parent SHA, author, message",
          "Annotated tag object: commit pointer and signature",
          "Zlib compression and SHA-1/SHA-256 content addressing"
],
        title: 'Git Internals (Blobs, Trees, Commits)',
        description: 'Deconstructing SHA-1 hashing, header byte lengths, and zlib compressed packfile storage.',
        status: 'locked',
        commands: ['git cat-file -p <sha>', 'git cat-file -t <sha>'],
        difficulty: 'Expert',
      },
      {
        id: 'c-modern-hook-managers',
        subtopics: [
          "Husky setup and automation in package.json",
          "lint-staged: running formatters only on staged files",
          "pre-commit framework for multi-language projects",
          "Committing and sharing hook configuration with team"
],
        title: 'Modern Hook Tooling (Husky & lint-staged)',
        description: 'Standardizing team-wide pre-commit formatting and testing scripts committed in package.json.',
        status: 'locked',
        commands: ['npx husky-init', 'npx lint-staged'],
        difficulty: 'Intermediate',
      },
      {
        id: 'c-git-garbage-collection',
        subtopics: [
          "Packing loose objects into compressed packfiles (.pack, .idx)",
          "Pruning unreachable dangling objects (git prune)",
          "Automated background git gc runs",
          "Inspecting repository object counts (git count-objects -v)"
],
        title: 'git gc & git prune',
        description: 'Optimizing the local repository database by consolidating loose objects into packfiles.',
        status: 'locked',
        commands: ['git gc --prune=now', 'git count-objects -v'],
        difficulty: 'Expert',
      },
      {
        id: 'c-plumbing-vs-porcelain',
        subtopics: [
          "Porcelain commands: user-facing commands (add, commit, status)",
          "Plumbing commands: low-level primitives (cat-file, hash-object)",
          "Low-level object manipulation (git write-tree, commit-tree)",
          "Building custom Git extensions and developer tooling"
],
        title: 'Plumbing vs Porcelain Architecture',
        description: 'Distinguishing high-level user interface commands from low-level UNIX-style plumbing.',
        status: 'locked',
        commands: ['git rev-parse HEAD', 'git write-tree', 'git commit-tree'],
        difficulty: 'Expert',
      },
    ],
  },

  // ========================================================================
  // 11 — GITHUB AUTOMATION (PDF: GitHub Actions, YAML, Triggers, Secrets, CI/CD)
  // ========================================================================
  {
    id: 'cat-github-automation',
    number: '11',
    title: 'GitHub Automation & Actions',
    tagline: 'Continuous Integration & automated pipelines',
    description: 'GitHub Actions, YAML syntax, runners, triggers, secrets, and deployment pipelines.',
    timelineStepId: 'engineering',
    previewType: 'actions',
    accentColor: '#2563eb',
    colSpanDesktop: 4,
    status: 'locked',
    prerequisites: ['Collaboration, PRs & Projects'],
    concepts: [
      {
        id: 'c-github-actions-what-usecases',
        subtopics: [
          "Native CI/CD automation directly in GitHub",
          "Automating test suites, linters, and type checking",
          "Automated build packaging and release deployment",
          "Automated issue/PR triage bots and notifications"
],
        title: 'GitHub Actions: What are these & Usecases',
        description: 'Automating build, test, package, release, and deployment workflows directly on GitHub.',
        status: 'locked',
        difficulty: 'Intermediate',
      },
      {
        id: 'c-actions-yaml-syntax',
        subtopics: [
          ".github/workflows/*.yml file path convention",
          "name:, on:, jobs:, steps: root keys",
          "uses: referencing community marketplace actions",
          "run: executing shell commands directly"
],
        title: 'YAML Syntax for Workflows',
        description: 'Structuring .github/workflows/*.yml with name:, on:, jobs:, steps:, and uses:.',
        status: 'locked',
        difficulty: 'Intermediate',
      },
      {
        id: 'c-workflow-triggers-scheduled',
        subtopics: [
          "on: push and on: pull_request triggers",
          "Branch and file path filtering (paths: [\"src/**\"])",
          "Manual workflow dispatch button (workflow_dispatch)",
          "Scheduled cron expressions (schedule: - cron: \"0 0 * * *\")"
],
        title: 'Workflow Triggers & Scheduled Workflows',
        description: 'Triggering pipelines on push, pull_request, workflow_dispatch, and cron schedules.',
        status: 'locked',
        difficulty: 'Intermediate',
      },
      {
        id: 'c-workflow-runners-and-context',
        subtopics: [
          "GitHub-hosted runners (ubuntu-latest, macos-latest, windows-latest)",
          "Self-hosted runners on private infrastructure",
          "Reading ${{ github.sha }} and ${{ runner.os }} context objects"
],
        title: 'Workflow Runners & Context',
        description: 'Running jobs on ubuntu-latest, macos, or self-hosted runners; reading ${{ github }} contexts.',
        status: 'locked',
        difficulty: 'Advanced',
      },
      {
        id: 'c-secrets-and-env-vars',
        subtopics: [
          "Encrypted repository and organization secrets",
          "Injecting secrets into steps (${{ secrets.DEPLOY_TOKEN }})",
          "GitHub Environments and deployment protection rules",
          "GITHUB_TOKEN default permissions and security scoping"
],
        title: 'Secrets and Env Vars',
        description: 'Injecting encrypted repository secrets (${{ secrets.API_KEY }}) safely into container steps.',
        status: 'locked',
        difficulty: 'Advanced',
      },
      {
        id: 'c-caching-dependencies-artifacts',
        subtopics: [
          "actions/cache action for npm/pip/cargo dependencies",
          "Drastically reducing CI pipeline run durations",
          "actions/upload-artifact for test reports and build bundles",
          "actions/download-artifact in downstream deployment jobs"
],
        title: 'Caching Dependencies & Storing Artifacts',
        description: 'Accelerating CI by caching node_modules and uploading test reports and build outputs.',
        status: 'locked',
        commands: ['actions/cache@v3', 'actions/upload-artifact@v3'],
        difficulty: 'Advanced',
      },
      {
        id: 'c-workflow-status-marketplace',
        subtopics: [
          "Embedding SVG status badges into README.md",
          "Browsing verified developer actions in GitHub Marketplace",
          "Pinning action versions via tags (@v3) or commit SHAs"
],
        title: 'Workflow Status & Marketplace Actions',
        description: 'Checking CI status badges and leveraging verified community actions from the Marketplace.',
        status: 'locked',
        difficulty: 'Intermediate',
      },
      {
        id: 'c-matrix-builds',
        subtopics: [
          "Running jobs across multiple Node versions [18, 20, 22]",
          "Running jobs across multiple OS [ubuntu, macos, windows]",
          "fail-fast: false to ensure all matrix combinations complete"
],
        title: 'Matrix Strategy (Cross-Platform Testing)',
        description: 'Executing workflow jobs across multiple OS environments and Node/Python versions concurrently.',
        status: 'locked',
        difficulty: 'Advanced',
      },
      {
        id: 'c-reusable-workflows',
        subtopics: [
          "workflow_call trigger for shared template workflows",
          "Composite actions for bundling multi-step shell logic",
          "Centralized organization-wide CI/CD pipelines"
],
        title: 'Reusable Workflows & Composite Actions',
        description: 'DRY CI/CD architectures reusing centralized workflow templates across organizations.',
        status: 'locked',
        difficulty: 'Advanced',
      },
      {
        id: 'c-action-concurrency',
        subtopics: [
          "concurrency: group configuration",
          "cancel-in-progress: true to abort superseded PR runs",
          "Preventing deployment race conditions on production"
],
        title: 'Concurrency & Cancellation Rules',
        description: 'Cancelling redundant queued test runs when new commits are pushed to the same branch.',
        status: 'locked',
        difficulty: 'Advanced',
      },
    ],
  },

  // ========================================================================
  // 12 — GITHUB ENGINEERING & ECOSYSTEM (PDF: CLI, API, Apps, Webhooks, Pages, Security, Copilot)
  // ========================================================================
  {
    id: 'cat-github-engineering',
    number: '12',
    title: 'GitHub Developer Tools & Ecosystem',
    tagline: 'APIs, webhooks, CLI, Codespaces, and AI tools',
    description: 'GitHub CLI, REST/GraphQL APIs, Apps, webhooks, Pages, Security, and Copilot.',
    timelineStepId: 'engineering',
    previewType: 'api',
    accentColor: '#0284c7',
    colSpanDesktop: 4,
    status: 'locked',
    prerequisites: ['GitHub Automation & Actions'],
    concepts: [
      {
        id: 'c-github-cli-setup-repos-prs',
        subtopics: [
          "gh auth login with web browser or personal token",
          "Creating, cloning, and viewing repositories (gh repo)",
          "Creating, reviewing, and checking out PRs (gh pr)",
          "Managing issues and releases from the terminal (gh issue, gh release)"
],
        title: 'GitHub CLI (gh setup, repos, PRs)',
        description: 'Managing issues, pull requests, releases, and repository cloning directly from the terminal.',
        status: 'locked',
        commands: ['gh auth login', 'gh pr create', 'gh repo clone <repo>'],
        difficulty: 'Intermediate',
      },
      {
        id: 'c-github-api-rest-graphql',
        subtopics: [
          "REST API endpoints (https://api.github.com)",
          "GraphQL API for single-roundtrip nested data queries",
          "Making quick API requests via gh api command",
          "Rate limiting headers and pagination strategies"
],
        title: 'GitHub API (REST & GraphQL API)',
        description: 'Querying and mutating repository data, pull request reviews, and commit statuses via API.',
        status: 'locked',
        commands: ['gh api user', 'gh api graphql -f query="..."'],
        difficulty: 'Advanced',
      },
      {
        id: 'c-creating-apps-github-oauth',
        subtopics: [
          "GitHub Apps with fine-grained repository permissions",
          "Bot accounts with custom webhook event subscriptions",
          "OAuth Apps for user identity authentication",
          "App installation tokens and JWT authentication"
],
        title: 'Creating Apps (GitHub Apps & OAuth)',
        description: 'First-class automated bot integrations with fine-grained repository permissions and webhooks.',
        status: 'locked',
        difficulty: 'Expert',
      },
      {
        id: 'c-webhooks-automation',
        subtopics: [
          "Subscribing to push, pull_request, and issue webhook events",
          "Inspecting JSON webhook event payloads",
          "Validating HMAC SHA-256 payload signatures (X-Hub-Signature-256)",
          "Delivering real-time events to server endpoints"
],
        title: 'Webhooks & Event Delivery',
        description: 'Subscribing to real-time events published by GitHub to your external web servers.',
        status: 'locked',
        difficulty: 'Advanced',
      },
      {
        id: 'c-deploying-static-websites',
        subtopics: [
          "Publishing static sites from branch (/gh-pages or /docs)",
          "Publishing via modern custom GitHub Actions workflow",
          "Automatic HTTPS certificate provisioning",
          "Custom 404.html single-page application routing"
],
        title: 'Deploying Static Websites (GitHub Pages)',
        description: 'Hosting static documentation and frontend apps directly from a repository branch or Actions.',
        status: 'locked',
        difficulty: 'Beginner',
      },
      {
        id: 'c-custom-domains-static-site-generators',
        subtopics: [
          "Configuring CNAME file and DNS A/CNAME records",
          "Enforcing HTTPS on custom apex and subdomains",
          "Static site generators (Vite, Astro, Jekyll, Hugo, Next.js)",
          "Automated build and deploy pipelines to GitHub Pages"
],
        title: 'Custom Domains & Static Site Generators',
        description: 'Configuring CNAME DNS records, Jekyll, Vite, Astro, and automated GitHub Pages deployment.',
        status: 'locked',
        difficulty: 'Intermediate',
      },
      {
        id: 'c-github-codespaces',
        subtopics: [
          "Cloud-hosted development containers running VS Code in browser",
          ".devcontainer/devcontainer.json configuration file",
          "Pre-configured Docker images with languages and tools",
          "Automatic port forwarding for web dev servers"
],
        title: 'GitHub Codespaces',
        description: 'Cloud-powered development containers configured via .devcontainer/devcontainer.json.',
        status: 'locked',
        difficulty: 'Intermediate',
      },
      {
        id: 'c-github-packages',
        subtopics: [
          "Publishing packages for npm, Docker, Maven, NuGet, RubyGems",
          "Authenticating package publishing via GITHUB_TOKEN",
          "Scoped packages tied to GitHub Organization access controls"
],
        title: 'GitHub Packages',
        description: 'Publishing and hosting npm, Docker, Maven, or Ruby packages with repository access controls.',
        status: 'locked',
        difficulty: 'Advanced',
      },
      {
        id: 'c-github-security',
        subtopics: [
          "Dependabot automated security alerts & dependency update PRs",
          "CodeQL static analysis for security vulnerabilities (SAST)",
          "Secret scanning and push protection for committed credentials",
          "Configuring security advisory policies (SECURITY.md)"
],
        title: 'GitHub Security (Dependabot & CodeQL)',
        description: 'Automated vulnerability alerts, dependency PRs, secret scanning, and SAST code scanning.',
        status: 'locked',
        difficulty: 'Advanced',
      },
      {
        id: 'c-github-education',
        subtopics: [
          "GitHub Student Developer Pack benefits and free tools",
          "GitHub Classroom automated assignment distribution and grading",
          "GitHub Campus Program and Student Club sponsorships"
],
        title: 'GitHub Education & Student Pack',
        description: 'Student Developer Pack benefits, GitHub Classroom assignment workflows, and Campus Program.',
        status: 'locked',
        difficulty: 'Beginner',
      },
      {
        id: 'c-github-marketplace',
        subtopics: [
          "Discovering verified developer tools, linters, and CI actions",
          "Publishing custom Actions and Apps to GitHub Marketplace",
          "Managing free and paid developer tool subscriptions"
],
        title: 'GitHub Marketplace',
        description: 'Discovering and installing verified developer tools, Actions, and third-party apps.',
        status: 'locked',
        difficulty: 'Beginner',
      },
      {
        id: 'c-github-models-and-copilot',
        subtopics: [
          "GitHub Copilot AI code autocompletion in your editor",
          "Copilot Chat in editor and agent mode",
          "Copilot in GitHub CLI for shell command generation",
          "Prototyping with foundation LLM models in GitHub Models"
],
        title: 'GitHub Models & GitHub Copilot',
        description: 'AI pair programming in your editor, terminal CLI suggestions, and prototyping with LLM models.',
        status: 'locked',
        difficulty: 'Beginner',
      },
      {
        id: 'c-github-audit-log',
        subtopics: [
          "Organization security audit logs and compliance monitoring",
          "Streaming audit events to SIEM systems (Splunk, Datadog)",
          "IP allow-lists and SAML Single Sign-On (SSO) enforcement",
          "SOC2, ISO 27001, and HIPAA enterprise controls"
],
        title: 'Enterprise Audit Logs & Compliance',
        description: 'Monitoring organization security events, IP allow lists, and SOC2 compliance controls.',
        status: 'locked',
        difficulty: 'Expert',
      },
    ],
  },
];
