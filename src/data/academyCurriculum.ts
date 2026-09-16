export interface CurriculumNode {
  id: string;
  level: number;
  stage:
    | 'Foundations & Basics'
    | 'Branching & Merging'
    | 'Remotes & Collaboration'
    | 'History & Recovery'
    | 'Advanced Git Systems'
    | 'GitHub Platform & DevOps';
  stageNumber: number;
  title: string;
  description: string;
  whyItExists: string;

  prerequisites: string[];

  concepts: string[];
  commands: string[];
  scenarios: string[];

  lessons: string[];
  relatedNodes: string[];

  status: 'locked' | 'available' | 'in-progress' | 'learned' | 'mastered';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  estimatedMinutes: number;

  highlightIcon: string;
  isFullyImplemented?: boolean;
}

export interface IntentSearchResult {
  query: string;
  matchedNodeId: string;
  situation: string;
  recommendedAction: string;
  commands: string[];
  node: CurriculumNode;
}

export interface ProblemSolverScenario {
  id: string;
  title: string;
  summary: string;
  whatProbablyHappened: string;
  whatGitIsDoing: string;
  whatToInspect: string[];
  recommendedRecoveryPath: string;
  safeCommands: string[];
  whatNotToDo: string;
  whyAvoid: string;
  howToVerify: string[];
  relatedNodeId: string;
}

export const ACADEMY_STAGES = [
  { id: 1, name: 'Foundations & Basics', levels: 'Levels 0–5', description: 'Master the command line, version control mental model, and basic snapshots.' },
  { id: 2, name: 'Branching & Merging', levels: 'Levels 6–7', description: 'Create parallel realities, navigate branches, and resolve merge conflicts.' },
  { id: 3, name: 'Remotes & Collaboration', levels: 'Levels 8–12', description: 'Collaborate with remote repositories, pull requests, and team workflows.' },
  { id: 4, name: 'History & Recovery', levels: 'Levels 13–16', description: 'Rewrite commits, investigate regressions with bisect, and rescue lost work.' },
  { id: 5, name: 'Advanced Git Systems', levels: 'Levels 17–23', description: 'Hooks, submodules, worktrees, LFS, and deep Git internals.' },
  { id: 6, name: 'GitHub Platform & DevOps', levels: 'Levels 24–29', description: 'GitHub CLI, Actions CI/CD workflows, APIs, Apps, and ecosystem features.' },
] as const;

export const ACADEMY_CURRICULUM_NODES: CurriculumNode[] = [
  // =========================================================================
  // STAGE 1: FOUNDATIONS & BASICS (Levels 0–5)
  // =========================================================================
  {
    id: 'l0-terminal',
    level: 0,
    stage: 'Foundations & Basics',
    stageNumber: 1,
    title: 'Computer & Terminal Fundamentals',
    description: 'Understand the terminal, shell navigation, paths, and core command arguments without fear.',
    whyItExists: 'Every Git command operates on files in your current working directory. You must navigate comfortably before Git makes sense.',
    prerequisites: [],
    concepts: ['Terminal vs GUI', 'Current Working Directory', 'Absolute vs Relative Paths', 'Flags and Options', 'File System Tree'],
    commands: ['pwd', 'ls', 'cd', 'mkdir', 'touch', 'cat'],
    scenarios: ['Navigating into a project directory', 'Listing hidden files', 'Creating project folders'],
    lessons: ['The Command Line Window', 'Navigating the File Tree', 'Commands with Flags'],
    relatedNodes: ['l1-vcs-fundamentals', 'l2-git-foundations'],
    status: 'available',
    difficulty: 'Beginner',
    estimatedMinutes: 20,
    highlightIcon: '💻',
  },
  {
    id: 'l1-vcs-fundamentals',
    level: 1,
    stage: 'Foundations & Basics',
    stageNumber: 1,
    title: 'Version Control Fundamentals',
    description: 'Learn why version control exists, the problems with manual folder naming, snapshots, and distributed repositories.',
    whyItExists: 'Before Git existed, developers saved copies like "project-final-v2-ACTUAL". Version control automates reliable milestones.',
    prerequisites: ['l0-terminal'],
    concepts: ['Snapshots vs Diffs', 'Repository as Time Vault', 'Time Travel & Rollback', 'Centralized vs Distributed VCS', 'Git vs GitHub'],
    commands: ['git --version', 'git help'],
    scenarios: ['Breaking a working app on Wednesday', 'Needing to turn back the clock to Monday', 'Collaborating without overwriting code'],
    lessons: ['Why We Need Version Control', 'The Snapshot Philosophy', 'Git vs Other VCS'],
    relatedNodes: ['l0-terminal', 'l2-git-foundations'],
    status: 'available',
    difficulty: 'Beginner',
    estimatedMinutes: 25,
    highlightIcon: '🌱',
  },
  {
    id: 'l2-git-foundations',
    level: 2,
    stage: 'Foundations & Basics',
    stageNumber: 1,
    title: 'Your First Git Save Point',
    description: 'The complete interactive teacher-led journey: working tree, selective staging, sealed commits, and accidental secret recovery.',
    whyItExists: 'The foundational mental model: what Git is seeing on your desk, what you choose for the box, and how you seal it into history.',
    prerequisites: ['l1-vcs-fundamentals'],
    concepts: ['Working Tree (Desk)', 'Staging Area (Box / Index)', 'Commit History (Vault)', 'Selective Staging', 'Local Snapshots (Commit ≠ GitHub)'],
    commands: ['git status', 'git diff', 'git add', 'git commit', 'git restore --staged', 'git log --oneline'],
    scenarios: ['Packaging finished index.html while leaving WIP style.css unstaged', 'Accidentally staging simulated .env secret', 'Recovering with git restore --staged'],
    lessons: ['The Problem', 'The Working Tree', 'Git Status', 'Git Diff', 'Staging Decision', 'Sealing the Commit', 'Accidental Secret Recovery', 'Independent Challenge'],
    relatedNodes: ['l3-inspecting', 'l4-saving-work', 'l5-undo-recovery'],
    status: 'in-progress',
    difficulty: 'Beginner',
    estimatedMinutes: 20,
    highlightIcon: '⭐',
    isFullyImplemented: true,
  },
  {
    id: 'l3-inspecting',
    level: 3,
    stage: 'Foundations & Basics',
    stageNumber: 1,
    title: 'Inspecting Your Work',
    description: 'Build total situational awareness: reading status, analyzing diffs between desk, stage, and HEAD, and exploring history logs.',
    whyItExists: 'Senior developers never guess what changed; they inspect before acting to avoid unexpected commits or mistakes.',
    prerequisites: ['l2-git-foundations'],
    concepts: ['Status Interpretation', 'Unstaged vs Staged Diffs', 'Commit Hash Identifiers', 'Log Graph & Stat Visualizations'],
    commands: ['git status', 'git diff', 'git diff --staged', 'git diff HEAD', 'git log -p', 'git show'],
    scenarios: ['Finding what exact lines changed', 'Inspecting staged changes before commit', 'Viewing details of the previous commit'],
    lessons: ['Diffing the Three Areas', 'Advanced Log Formatting', 'Inspecting Specific Commits'],
    relatedNodes: ['l2-git-foundations', 'l4-saving-work', 'l16-investigating'],
    status: 'available',
    difficulty: 'Beginner',
    estimatedMinutes: 25,
    highlightIcon: '🔍',
  },
  {
    id: 'l4-saving-work',
    level: 4,
    stage: 'Foundations & Basics',
    stageNumber: 1,
    title: 'Saving Work & Atomic Commits',
    description: 'Learn professional staging habits, crafting small atomic commits, writing descriptive commit messages, and amending mistakes.',
    whyItExists: 'A commit history with atomic, focused changes makes debugging, code reviews, and rollbacks effortless.',
    prerequisites: ['l2-git-foundations', 'l3-inspecting'],
    concepts: ['Atomic Commits', 'Conventional Commit Messages', 'Interactive Patch Staging', 'Amending the Last Commit'],
    commands: ['git add -p', 'git add -A', 'git commit --amend', 'git commit -v'],
    scenarios: ['Separating bugfix lines from feature lines in the same file', 'Fixing a typo in the last commit message'],
    lessons: ['The Atomic Commit Philosophy', 'Interactive Hunk Staging', 'Amending Safely'],
    relatedNodes: ['l2-git-foundations', 'l5-undo-recovery', 'l13-history-engineering'],
    status: 'available',
    difficulty: 'Intermediate',
    estimatedMinutes: 30,
    highlightIcon: '📦',
  },
  {
    id: 'l5-undo-recovery',
    level: 5,
    stage: 'Foundations & Basics',
    stageNumber: 1,
    title: 'Undo & Safe Recovery',
    description: 'Master the Git undo decision matrix: knowing when to restore, when to reset, when to revert, and how to rescue lost work.',
    whyItExists: 'Mistakes happen constantly in development. Knowing which recovery tool to apply prevents data loss and panic.',
    prerequisites: ['l4-saving-work'],
    concepts: ['The Undo Decision Matrix', 'Soft vs Mixed vs Hard Reset', 'Safe Public History Rollback with Revert', 'Working Tree Cleaning'],
    commands: ['git restore', 'git restore --staged', 'git reset --soft', 'git reset --mixed', 'git reset --hard', 'git revert', 'git clean'],
    scenarios: ['Discarding uncommitted file changes', 'Undoing the last commit while keeping edits in editor', 'Rolling back an already-pushed commit safely'],
    lessons: ['Choosing the Right Undo Tool', 'Reset Modes Deconstructed', 'Public History Safety with Revert'],
    relatedNodes: ['l4-saving-work', 'l16-investigating'],
    status: 'available',
    difficulty: 'Intermediate',
    estimatedMinutes: 35,
    highlightIcon: '⏪',
  },

  // =========================================================================
  // STAGE 2: BRANCHING & MERGING (Levels 6–7)
  // =========================================================================
  {
    id: 'l6-branching',
    level: 6,
    stage: 'Branching & Merging',
    stageNumber: 2,
    title: 'Branching Basics',
    description: 'Understand Git branches as lightweight movable pointers, HEAD tracking, switching contexts, and isolated feature development.',
    whyItExists: 'Branches allow you to build new features in complete safety without touching the stable production code.',
    prerequisites: ['l2-git-foundations'],
    concepts: ['Branches as 41-byte Pointers', 'HEAD Navigation', 'Detached HEAD State', 'Creating, Renaming, and Deleting Branches'],
    commands: ['git branch', 'git switch', 'git switch -c', 'git checkout -b', 'git branch -d'],
    scenarios: ['Creating a new feature branch', 'Switching back to main to fix an urgent bug', 'Deleting merged branches'],
    lessons: ['The Pointer Mental Model', 'Context Switching with Switch', 'Escaping Detached HEAD'],
    relatedNodes: ['l2-git-foundations', 'l7-merging'],
    status: 'available',
    difficulty: 'Beginner',
    estimatedMinutes: 30,
    highlightIcon: '🌿',
  },
  {
    id: 'l7-merging',
    level: 7,
    stage: 'Branching & Merging',
    stageNumber: 2,
    title: 'Merging & Conflict Arena',
    description: 'Integrate code streams cleanly: fast-forward vs 3-way merge commits, reading conflict markers, and resolving conflicts calmly.',
    whyItExists: 'Independent lines of development must eventually reunite. Merge conflicts are not errors—they are Git asking for human intent.',
    prerequisites: ['l6-branching'],
    concepts: ['Fast-Forward Merges', 'Three-Way Merge Algorithm', 'Conflict Markers (<<<<<<<, =======, >>>>>>>)', 'Aborting and Continuing Merges'],
    commands: ['git merge', 'git merge --no-ff', 'git merge --abort', 'git merge --continue'],
    scenarios: ['Merging a clean feature into main', 'Two developers editing the same line of code', 'Resolving and verifying merge commits'],
    lessons: ['Fast-Forward vs Merge Commits', 'The Conflict Arena', 'Safe Merge Resolution'],
    relatedNodes: ['l6-branching', 'l8-remotes', 'l13-history-engineering'],
    status: 'available',
    difficulty: 'Intermediate',
    estimatedMinutes: 40,
    highlightIcon: '⚔️',
  },

  // =========================================================================
  // STAGE 3: REMOTES & GITHUB COLLABORATION (Levels 8–12)
  // =========================================================================
  {
    id: 'l8-remotes',
    level: 8,
    stage: 'Remotes & Collaboration',
    stageNumber: 3,
    title: 'Remote Git & Synchronization',
    description: 'Connect your local repository to the outside world: origin, upstream, remote tracking branches, push, fetch, and pull.',
    whyItExists: 'Version control becomes collaborative when copies exist on cloud servers. Understand that fetch ≠ pull and commit ≠ push.',
    prerequisites: ['l7-merging'],
    concepts: ['Local vs Remote State', 'Remote-Tracking Branches (origin/main)', 'Fetch vs Pull (pull = fetch + merge)', 'Push Rejections & Upstream Setup'],
    commands: ['git remote -v', 'git remote add', 'git fetch', 'git pull', 'git push -u origin main'],
    scenarios: ['Connecting local portfolio to GitHub', 'Resolving rejected push when teammate pushed first', 'Fetching changes without merging'],
    lessons: ['The Remote Mental Model', 'Fetch vs Pull Demystified', 'Tracking Branches & Upstreams'],
    relatedNodes: ['l7-merging', 'l9-github-essentials', 'l10-github-collab'],
    status: 'available',
    difficulty: 'Intermediate',
    estimatedMinutes: 35,
    highlightIcon: '☁️',
  },
  {
    id: 'l9-github-essentials',
    level: 9,
    stage: 'Remotes & Collaboration',
    stageNumber: 3,
    title: 'GitHub Essentials',
    description: 'Learn GitHub as a distinct platform: profile setup, repository creation, README markdown, public vs private repositories, and Issues.',
    whyItExists: 'Git is the underlying tool; GitHub is the collaboration platform. Understanding their boundary is critical for new developers.',
    prerequisites: ['l8-remotes'],
    concepts: ['Git ≠ GitHub', 'Public vs Private Visibility', 'Markdown Formatting', 'Repository Settings & SSH Keys', 'GitHub Issues & Discussions'],
    commands: ['gh repo create', 'gh auth status'],
    scenarios: ['Setting up a professional developer profile', 'Creating a clean README with shields and badges', 'Opening and labeling an issue'],
    lessons: ['Git vs GitHub Platform', 'Crafting Great READMEs', 'Managing Issues & Discussions'],
    relatedNodes: ['l8-remotes', 'l10-github-collab', 'l24-github-cli'],
    status: 'available',
    difficulty: 'Beginner',
    estimatedMinutes: 25,
    highlightIcon: '🐙',
  },
  {
    id: 'l10-github-collab',
    level: 10,
    stage: 'Remotes & Collaboration',
    stageNumber: 3,
    title: 'GitHub Collaboration & Pull Requests',
    description: 'Experience the universal open-source and team workflow: forks vs clones, creating PRs, requesting reviews, and leaving feedback.',
    whyItExists: 'Pull requests are the heart of professional software delivery, enabling peer review, testing, and approval before merging code.',
    prerequisites: ['l9-github-essentials'],
    concepts: ['Fork vs Clone', 'Pull Request Lifecycle', 'Code Review Best Practices', 'Suggesting Changes & Approvals', 'PR Discussion Etiquette'],
    commands: ['gh pr create', 'gh pr review', 'gh pr merge'],
    scenarios: ['Forking an open source repository', 'Opening a feature pull request with screenshots', 'Reviewing teammate pull request comments'],
    lessons: ['The Anatomy of a Great PR', 'Code Review Etiquette', 'Merging and Branch Cleanup'],
    relatedNodes: ['l9-github-essentials', 'l11-team-workflows'],
    status: 'available',
    difficulty: 'Intermediate',
    estimatedMinutes: 40,
    highlightIcon: '🤝',
  },
  {
    id: 'l11-team-workflows',
    level: 11,
    stage: 'Remotes & Collaboration',
    stageNumber: 3,
    title: 'Team Git Workflows',
    description: 'Adopt industry team strategies: GitHub Flow, Trunk-Based Development, release branch conventions, and clean team communication.',
    whyItExists: 'Teams with 5, 50, or 500 developers need clear branch rules to ship features continuously without stepping on each other.',
    prerequisites: ['l10-github-collab'],
    concepts: ['GitHub Flow', 'Trunk-Based Development', 'Release Branching', 'Branch Naming Conventions', 'Protected Branches & Rulesets'],
    commands: ['git switch -c feat/login-box', 'git branch --merged'],
    scenarios: ['Standardizing branch names across a 10-person squad', 'Configuring protected main branch requiring PR review approval'],
    lessons: ['Branching Strategies Compared', 'Branch Rulesets & Enforcements', 'Continuous Delivery Habits'],
    relatedNodes: ['l10-github-collab', 'l12-project-management'],
    status: 'available',
    difficulty: 'Intermediate',
    estimatedMinutes: 30,
    highlightIcon: '👥',
  },
  {
    id: 'l12-project-management',
    level: 12,
    stage: 'Remotes & Collaboration',
    stageNumber: 3,
    title: 'GitHub Project Management',
    description: 'Organize software delivery: GitHub Projects, Kanban boards, roadmaps, milestones, labels, and issue automations.',
    whyItExists: 'Writing code is only half the job; planning milestones, tracking bugs, and prioritizing backlogs ensures the right code ships on time.',
    prerequisites: ['l11-team-workflows'],
    concepts: ['GitHub Projects (v2)', 'Kanban Boards & Sprint Backlogs', 'Milestones & Release Target Dates', 'Custom Fields & Automated Workflows'],
    commands: ['gh project list', 'gh issue create'],
    scenarios: ['Setting up a sprint board for a portfolio v2 release', 'Automatically closing issues when PR merges'],
    lessons: ['Agile Project Boards on GitHub', 'Milestones & Release Tracking', 'Automated Issue Triage'],
    relatedNodes: ['l11-team-workflows', 'l25-github-actions'],
    status: 'available',
    difficulty: 'Beginner',
    estimatedMinutes: 25,
    highlightIcon: '📋',
  },

  // =========================================================================
  // STAGE 4: HISTORY & RECOVERY ENGINEERING (Levels 13–16)
  // =========================================================================
  {
    id: 'l13-history-engineering',
    level: 13,
    stage: 'History & Recovery',
    stageNumber: 4,
    title: 'History Engineering: Rebase & Amend',
    description: 'Craft linear, immaculate project history: interactive rebase, squashing noisy commits, rewording messages, and force-with-lease.',
    whyItExists: 'Local work is often messy with "wip", "fix typo" commits. Rebase lets you polish your work into clean chapters before sharing.',
    prerequisites: ['l5-undo-recovery', 'l7-merging'],
    concepts: ['Linear History vs Merge Bubbles', 'Rebase as Replaying Commits', 'Interactive Rebase (pick, squash, reword, drop)', 'The Golden Rule of Rebase', 'Force-with-lease'],
    commands: ['git rebase', 'git rebase -i', 'git cherry-pick', 'git push --force-with-lease'],
    scenarios: ['Squashing 6 messy commits into 1 atomic feature commit', 'Replaying local branch onto latest main', 'Cherry-picking an urgent hotfix'],
    lessons: ['Rebase Mental Model', 'Interactive Rebase Workshop', 'Safe Force Pushing with Lease'],
    relatedNodes: ['l5-undo-recovery', 'l7-merging', 'l15-stash'],
    status: 'available',
    difficulty: 'Advanced',
    estimatedMinutes: 45,
    highlightIcon: '🎯',
  },
  {
    id: 'l14-tagging',
    level: 14,
    stage: 'History & Recovery',
    stageNumber: 4,
    title: 'Tagging & Semantic Releases',
    description: 'Mark milestones in time: lightweight tags, cryptographic annotated tags, Semantic Versioning (v1.2.3), and GitHub Releases with changelogs.',
    whyItExists: 'Branches move constantly; tags are permanent bookmarks pointing to specific release milestones forever.',
    prerequisites: ['l4-saving-work'],
    concepts: ['Lightweight vs Annotated Tags', 'Semantic Versioning (MAJOR.MINOR.PATCH)', 'Pushing Tags to Remotes', 'GitHub Release Assets & Changelogs'],
    commands: ['git tag', 'git tag -a v1.0.0 -m "Release v1.0.0"', 'git push --tags', 'git tag -d'],
    scenarios: ['Tagging version 1.0.0 for production launch', 'Creating release notes on GitHub with downloadable assets'],
    lessons: ['Bookmarks in History: Tags', 'Semantic Versioning Rules', 'Publishing GitHub Releases'],
    relatedNodes: ['l4-saving-work', 'l25-github-actions'],
    status: 'available',
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    highlightIcon: '🏷️',
  },
  {
    id: 'l15-stash',
    level: 15,
    stage: 'History & Recovery',
    stageNumber: 4,
    title: 'Git Stash & Context Switching',
    description: 'Pause unfinished work instantly: stashing uncommitted changes, inspecting stash stacks, popping changes back, and stashing untracked files.',
    whyItExists: 'When production is on fire and you are halfway through a messy feature, stash lets you tuck your work into a drawer and switch branches.',
    prerequisites: ['l4-saving-work', 'l6-branching'],
    concepts: ['The Stash Drawer', 'Stash Stack (LIFO)', 'Stashing Untracked Files (-u)', 'Applying vs Popping Stashes', 'Branching from Stash'],
    commands: ['git stash', 'git stash push -m "wip"', 'git stash pop', 'git stash list', 'git stash apply', 'git stash drop'],
    scenarios: ['Switching to main for urgent hotfix while working on unfinished form', 'Restoring specific stash entry from yesterday'],
    lessons: ['The Stash Mental Model', 'Managing the Stash Stack', 'Stashing Untracked & Ignored Files'],
    relatedNodes: ['l6-branching', 'l19-worktrees'],
    status: 'available',
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    highlightIcon: '🗃️',
  },
  {
    id: 'l16-investigating',
    level: 16,
    stage: 'History & Recovery',
    stageNumber: 4,
    title: 'Investigating History: Bug Detective',
    description: 'Trace bugs like a senior engineer: binary search with git bisect, author inspection with git blame, code archaeology with log -S, and reflog rescue.',
    whyItExists: 'When a bug appeared recently in a 5,000-commit repository, bisect finds the culprit commit in under 10 automated steps.',
    prerequisites: ['l3-inspecting', 'l5-undo-recovery'],
    concepts: ['Binary Search in History (Bisect)', 'Annotated Line Authorship (Blame)', 'Pickaxe Search (log -S)', 'The Safety Net (Reflog)'],
    commands: ['git bisect start', 'git bisect bad', 'git bisect good', 'git blame -L 10,25 index.html', 'git reflog', 'git log -S "secret_key"'],
    scenarios: ['Finding exactly which commit broke the checkout button', 'Rescuing a commit after accidentally running git reset --hard'],
    lessons: ['The Bug Detective Workshop', 'Line Archaeology with Blame', 'The All-Seeing Reflog'],
    relatedNodes: ['l3-inspecting', 'l5-undo-recovery'],
    status: 'available',
    difficulty: 'Advanced',
    estimatedMinutes: 45,
    highlightIcon: '🕵️',
  },

  // =========================================================================
  // STAGE 5: ADVANCED GIT SYSTEMS (Levels 17–23)
  // =========================================================================
  {
    id: 'l17-git-hooks',
    level: 17,
    stage: 'Advanced Git Systems',
    stageNumber: 5,
    title: 'Git Hooks Workshop',
    description: 'Automate quality gates locally: client-side hooks (pre-commit, commit-msg, pre-push) to format code, run lints, and enforce rules.',
    whyItExists: 'Hooks stop broken code, syntax errors, and accidentally committed secret keys before they ever leave your laptop.',
    prerequisites: ['l4-saving-work'],
    concepts: ['Event-Driven Scripting in Git', 'Client vs Server Hooks', 'Executable Scripts in .git/hooks', 'Bypassing with --no-verify'],
    commands: ['chmod +x .git/hooks/pre-commit', 'git commit -m "feat: check" --no-verify'],
    scenarios: ['Writing a pre-commit hook that runs automated test suites', 'Rejecting commit messages that don’t include ticket numbers'],
    lessons: ['The Hooks Architecture', 'Building a Secret-Key Guard Hook', 'Enforcing Conventional Commits'],
    relatedNodes: ['l4-saving-work', 'l25-github-actions'],
    status: 'available',
    difficulty: 'Advanced',
    estimatedMinutes: 35,
    highlightIcon: '🪝',
  },
  {
    id: 'l18-submodules',
    level: 18,
    stage: 'Advanced Git Systems',
    stageNumber: 5,
    title: 'Git Submodules',
    description: 'Embed other Git repositories inside your project: adding submodules, tracking specific commit hashes, and recursive synchronization.',
    whyItExists: 'Complex codebases frequently share core libraries, shared UI systems, or external dependencies maintained in distinct repositories.',
    prerequisites: ['l8-remotes'],
    concepts: ['Nested Git Repositories', '.gitmodules Configuration', 'Pointer Commits vs Live Tracking', 'Recursive Clones and Updates'],
    commands: ['git submodule add', 'git submodule update --init --recursive', 'git submodule status', 'git submodule sync'],
    scenarios: ['Adding a shared design-system repository to portfolio', 'Cloning a project containing submodules without missing files'],
    lessons: ['Why Submodules Exist', 'The Submodule Mental Model', 'Updating & Synchronizing Submodules'],
    relatedNodes: ['l8-remotes', 'l19-worktrees'],
    status: 'available',
    difficulty: 'Advanced',
    estimatedMinutes: 35,
    highlightIcon: '📦',
  },
  {
    id: 'l19-worktrees',
    level: 19,
    stage: 'Advanced Git Systems',
    stageNumber: 5,
    title: 'Git Worktrees',
    description: 'Check out multiple branches simultaneously in separate directories without cloning multiple times or stashing.',
    whyItExists: 'Worktrees give you multiple desks: work on a long-running feature on Desk 1 while reviewing a PR or fixing a hotfix on Desk 2.',
    prerequisites: ['l6-branching', 'l15-stash'],
    concepts: ['Multiple Working Trees with One .git DB', 'Concurrent Branch Checkouts', 'Locking and Pruning Worktrees'],
    commands: ['git worktree add ../hotfix-branch main', 'git worktree list', 'git worktree remove', 'git worktree prune'],
    scenarios: ['Running tests on branch B while writing code on branch A', 'Reviewing a teammate’s PR locally without stash interruptions'],
    lessons: ['Multiple Desks: The Worktree Model', 'Adding and Navigating Worktrees', 'Housekeeping and Pruning'],
    relatedNodes: ['l6-branching', 'l15-stash'],
    status: 'available',
    difficulty: 'Advanced',
    estimatedMinutes: 30,
    highlightIcon: '🌲',
  },
  {
    id: 'l20-git-attributes',
    level: 20,
    stage: 'Advanced Git Systems',
    stageNumber: 5,
    title: 'Git Attributes & Line Endings',
    description: 'Configure path-specific settings with .gitattributes: LF vs CRLF cross-platform line endings, custom diff behavior, and binary flags.',
    whyItExists: 'Windows and Mac/Linux line ending differences can cause entire files to register as modified; .gitattributes enforces consistency.',
    prerequisites: ['l3-inspecting'],
    concepts: ['.gitattributes Syntax', 'CRLF vs LF Normalization', 'Binary Flagging to Prevent Corrupt Merges', 'Custom Diffs (e.g. Word/PDFs)'],
    commands: ['git check-attr -a file.txt'],
    scenarios: ['Preventing Windows teammate from converting all line endings to CRLF', 'Declaring PNG and ZIP files as binary to avoid merge conflicts'],
    lessons: ['Cross-Platform Line Ending Normalization', 'Custom Diffing Filters', 'Protecting Binary Assets'],
    relatedNodes: ['l3-inspecting', 'l21-lfs'],
    status: 'available',
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    highlightIcon: '⚙️',
  },
  {
    id: 'l21-lfs',
    level: 21,
    stage: 'Advanced Git Systems',
    stageNumber: 5,
    title: 'Git Large File Storage (LFS)',
    description: 'Handle huge binary files efficiently: replacing game assets, video, and machine learning models with lightweight text pointers.',
    whyItExists: 'Normal Git stores every version of every file forever, causing repositories with heavy assets to bloat into gigabytes.',
    prerequisites: ['l20-git-attributes'],
    concepts: ['The Binary Bloat Problem', 'Pointer Files vs Actual Object Storage', 'Tracking Patterns (.gitattributes)', 'Fetching LFS Assets on Demand'],
    commands: ['git lfs install', 'git lfs track "*.psd"', 'git lfs ls-files', 'git lfs pull'],
    scenarios: ['Adding 4K background video assets without bloating repo clone time', 'Tracking Photoshop PSDs with LFS'],
    lessons: ['Why Git Struggles with Binaries', 'Installing & Configuring Git LFS', 'Tracking, Pushing, and Pulling LFS Data'],
    relatedNodes: ['l20-git-attributes', 'l22-internals'],
    status: 'available',
    difficulty: 'Intermediate',
    estimatedMinutes: 30,
    highlightIcon: '💾',
  },
  {
    id: 'l22-internals',
    level: 22,
    stage: 'Advanced Git Systems',
    stageNumber: 5,
    title: 'Git Internals: Objects Database',
    description: 'Deconstruct Git under the hood: inspect raw blobs, tree objects, commit objects, SHA-1/256 hashing, and the .git directory structure.',
    whyItExists: 'Once you see that Git is simply a content-addressable key-value store with trees and commits, nothing in Git ever confuses you again.',
    prerequisites: ['l2-git-foundations', 'l16-investigating'],
    concepts: ['Content-Addressable Storage', 'Blobs (File Content)', 'Trees (Directory Structure)', 'Commits (Author, Time, Tree, Parents)', 'Loose vs Packed Objects'],
    commands: ['git cat-file -p <sha>', 'git cat-file -t <sha>', 'git hash-object -w file', 'git count-objects -v'],
    scenarios: ['Physically inspecting a blob in .git/objects', 'Walking a tree object down to file contents', 'Deconstructing a commit object header'],
    lessons: ['The Four Git Object Types', 'Exploring .git/objects on Disk', 'Packfiles and Garbage Collection (git gc)'],
    relatedNodes: ['l2-git-foundations', 'l23-plumbing'],
    status: 'available',
    difficulty: 'Expert',
    estimatedMinutes: 50,
    highlightIcon: '🔬',
  },
  {
    id: 'l23-plumbing',
    level: 23,
    stage: 'Advanced Git Systems',
    stageNumber: 5,
    title: 'Git Plumbing Commands',
    description: 'Build repositories from first principles using low-level plumbing: write-tree, commit-tree, update-ref, and manual index manipulation.',
    whyItExists: 'Porcelain commands (add, commit) are convenient wrappers. Plumbing commands show you how Git scripts and tooling actually work.',
    prerequisites: ['l22-internals'],
    concepts: ['Porcelain vs Plumbing', 'Manual Index Updates', 'Synthesizing Trees and Commits', 'Updating Ref Pointers Directly'],
    commands: ['git write-tree', 'git commit-tree', 'git update-ref', 'git rev-parse HEAD', 'git update-index --add'],
    scenarios: ['Creating a complete commit without ever typing `git commit`', 'Directly creating and pointing a branch ref'],
    lessons: ['Porcelain vs Plumbing Explained', 'Creating Commits from Raw Hashes', 'Manipulating Refs and Trees'],
    relatedNodes: ['l22-internals'],
    status: 'available',
    difficulty: 'Expert',
    estimatedMinutes: 45,
    highlightIcon: '🔧',
  },

  // =========================================================================
  // STAGE 6: GITHUB PLATFORM & DEVOPS (Levels 24–29)
  // =========================================================================
  {
    id: 'l24-github-cli',
    level: 24,
    stage: 'GitHub Platform & DevOps',
    stageNumber: 6,
    title: 'GitHub CLI (`gh`)',
    description: 'Work with GitHub without leaving your terminal: managing repositories, issues, pull requests, and viewing workflow runs.',
    whyItExists: 'Context switching between browser tabs and the terminal slows developers down; `gh` brings GitHub directly to your command line.',
    prerequisites: ['l9-github-essentials', 'l10-github-collab'],
    concepts: ['Command-Line GitHub Operations', 'Authentication & Context', 'PR Creation & Checkout from CLI', 'Managing Issues & Releases from Terminal'],
    commands: ['gh auth login', 'gh pr create --web', 'gh pr checkout 42', 'gh issue list', 'gh repo clone'],
    scenarios: ['Checking out teammate’s PR locally in one command', 'Viewing CI run failures from the terminal'],
    lessons: ['Installing and Authenticating gh', 'Managing PRs & Issues from CLI', 'Automating GitHub Tasks with Scripts'],
    relatedNodes: ['l10-github-collab', 'l25-github-actions'],
    status: 'available',
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    highlightIcon: '⚡',
  },
  {
    id: 'l25-github-actions',
    level: 25,
    stage: 'GitHub Platform & DevOps',
    stageNumber: 6,
    title: 'GitHub Actions: CI/CD Foundations',
    description: 'Automate testing and deployment: YAML workflow syntax, triggers (push, pull_request), runners, jobs, steps, and marketplace actions.',
    whyItExists: 'Automated Continuous Integration runs your tests on every push and PR, ensuring broken code is caught before reaching production.',
    prerequisites: ['l10-github-collab'],
    concepts: ['Workflows, Jobs, and Steps', 'YAML Syntax and Indentation', 'Trigger Events (push, pull_request, schedule)', 'Runners (ubuntu-latest)', 'Actions Marketplace (actions/checkout)'],
    commands: ['gh workflow run', 'gh run view'],
    scenarios: ['Writing a workflow that runs unit tests on every pull request', 'Deploying production builds automatically when merged to main'],
    lessons: ['Anatomy of an Actions Workflow', 'Triggering on Pull Requests', 'Using Marketplace Actions'],
    relatedNodes: ['l10-github-collab', 'l26-actions-automation'],
    status: 'available',
    difficulty: 'Intermediate',
    estimatedMinutes: 45,
    highlightIcon: '🚀',
  },
  {
    id: 'l26-actions-automation',
    level: 26,
    stage: 'GitHub Platform & DevOps',
    stageNumber: 6,
    title: 'GitHub Automation & CI/CD Pipelines',
    description: 'Advanced CI/CD engineering: dependency caching, build artifacts, encrypted secrets, environment approvals, and matrix builds.',
    whyItExists: 'Professional teams need fast builds (caching), security (encrypted API secrets), and multi-platform validation across OS versions.',
    prerequisites: ['l25-github-actions'],
    concepts: ['Encrypted Repository Secrets', 'Dependency Caching (actions/cache)', 'Passing Artifacts between Jobs', 'Matrix Strategy (Node 18, 20, 22)', 'Reusable Workflows'],
    commands: ['gh secret set', 'gh run list'],
    scenarios: ['Speeding up test suites by caching node_modules', 'Securing API deployment keys with GitHub Secrets', 'Testing on Linux, macOS, and Windows simultaneously'],
    lessons: ['Caching and Performance Optimization', 'Secrets Management and Security', 'Matrix and Multi-Job Pipelines'],
    relatedNodes: ['l25-github-actions', 'l27-github-api'],
    status: 'available',
    difficulty: 'Advanced',
    estimatedMinutes: 40,
    highlightIcon: '🛡️',
  },
  {
    id: 'l27-github-api',
    level: 27,
    stage: 'GitHub Platform & DevOps',
    stageNumber: 6,
    title: 'GitHub API: REST & GraphQL',
    description: 'Interact with GitHub programmatically: querying repositories, creating issues, automating PR comments, and using Octokit.',
    whyItExists: 'When you need custom internal tooling, automated reports, or company integrations, the GitHub API provides full programmatic access.',
    prerequisites: ['l9-github-essentials', 'l24-github-cli'],
    concepts: ['REST vs GraphQL Endpoints', 'Personal Access Tokens (Fine-Grained)', 'Rate Limiting and Pagination', 'Octokit SDKs'],
    commands: ['curl -H "Authorization: Bearer $TOKEN" https://api.github.com/user', 'gh api graphql -f query="..."'],
    scenarios: ['Generating a weekly report of merged pull requests', 'Querying repository metrics via GraphQL'],
    lessons: ['REST API Fundamentals', 'GraphQL Queries & Mutations', 'Authentication & Rate Limits'],
    relatedNodes: ['l24-github-cli', 'l28-github-apps'],
    status: 'available',
    difficulty: 'Advanced',
    estimatedMinutes: 40,
    highlightIcon: '🔌',
  },
  {
    id: 'l28-github-apps',
    level: 28,
    stage: 'GitHub Platform & DevOps',
    stageNumber: 6,
    title: 'GitHub Apps & Webhooks',
    description: 'Build bots and integrations: webhooks for real-time repository events, GitHub App permissions, JWT authentication, and automated bots.',
    whyItExists: 'GitHub Apps provide first-class automated identities that listen to repository events and act on pull requests automatically.',
    prerequisites: ['l27-github-api'],
    concepts: ['Webhooks & Payload Verification', 'GitHub Apps vs OAuth Apps', 'Granular Permissions & Installations', 'Event-Driven Bot Automations'],
    commands: ['gh extension install', 'smee --url ...'],
    scenarios: ['Building a bot that labels PRs automatically based on file changes', 'Verifying webhook cryptographic signatures (HMAC)'],
    lessons: ['The Webhooks Event Loop', 'Creating a GitHub App', 'Building an Automated Review Bot'],
    relatedNodes: ['l27-github-api', 'l29-github-features'],
    status: 'available',
    difficulty: 'Expert',
    estimatedMinutes: 45,
    highlightIcon: '🤖',
  },
  {
    id: 'l29-github-features',
    level: 29,
    stage: 'GitHub Platform & DevOps',
    stageNumber: 6,
    title: 'GitHub Ecosystem: Pages, Codespaces & Copilot',
    description: 'Master the wider modern GitHub toolchain: hosting on GitHub Pages, cloud dev with Codespaces, security scanning, and GitHub Copilot.',
    whyItExists: 'Modern developers deploy websites directly from GitHub, spin up cloud development environments in seconds, and write code with AI.',
    prerequisites: ['l9-github-essentials', 'l25-github-actions'],
    concepts: ['Static Site Hosting on GitHub Pages', 'Cloud Dev Containers with Codespaces', 'Secret Scanning & Dependabot Alerts', 'AI Pair Programming with Copilot'],
    commands: ['gh codespace create'],
    scenarios: ['Publishing your developer portfolio live to yourname.github.io', 'Starting an interactive dev environment in your browser with Codespaces'],
    lessons: ['Publishing on GitHub Pages with Custom Domains', 'Developing Anywhere with Codespaces', 'Automated Security & AI Assistance'],
    relatedNodes: ['l9-github-essentials', 'l25-github-actions'],
    status: 'available',
    difficulty: 'Intermediate',
    estimatedMinutes: 35,
    highlightIcon: '🌐',
  },
];

// =============================================================================
// INTENT-AWARE SEARCH DICTIONARY & SEARCH FUNCTION (Section 13)
// =============================================================================

export interface IntentQuery {
  keywords: string[];
  matchedNodeId: string;
  situation: string;
  recommendedAction: string;
  commands: string[];
}

export const INTENT_SEARCH_DICTIONARY: IntentQuery[] = [
  {
    keywords: ['accidentally committed', 'committed wrong file', 'undo commit', 'uncommit', 'committed secret', 'remove commit'],
    matchedNodeId: 'l5-undo-recovery',
    situation: 'You committed something you didn’t mean to.',
    recommendedAction: 'If not pushed yet, use `git reset --soft HEAD~1` to keep edits on your desk, or `git commit --amend` to fix it.',
    commands: ['git reset --soft HEAD~1', 'git commit --amend', 'git revert <hash>'],
  },
  {
    keywords: ['see what changed', 'view changes', 'inspect changes', 'what changed', 'diff', 'check status'],
    matchedNodeId: 'l3-inspecting',
    situation: 'You want to inspect modifications before staging or committing.',
    recommendedAction: 'Run `git status` to see affected files, and `git diff` to view line-by-line additions and deletions.',
    commands: ['git status', 'git diff', 'git diff --staged'],
  },
  {
    keywords: ['lost commit', 'deleted branch', 'lost work', 'recover lost', 'reflog', 'bring back commit'],
    matchedNodeId: 'l16-investigating',
    situation: 'A commit or branch seems to have vanished after a reset or branch deletion.',
    recommendedAction: 'Git almost never deletes commits immediately. Run `git reflog` to locate the SHA hash, then branch or reset to it.',
    commands: ['git reflog', 'git switch -c recovery-branch <sha>'],
  },
  {
    keywords: ['cant push', 'cannot push', 'push rejected', 'failed to push', 'non-fast-forward push', 'rejected push'],
    matchedNodeId: 'l8-remotes',
    situation: 'Your push was rejected because the remote repository has commits you don’t have locally.',
    recommendedAction: 'Never force push without checking! Run `git fetch origin` to inspect incoming work, then `git pull --rebase` or merge before pushing.',
    commands: ['git fetch origin', 'git pull --rebase origin main', 'git push'],
  },
  {
    keywords: ['merge conflicts', 'conflict', 'both modified', 'conflict markers', 'resolve conflict'],
    matchedNodeId: 'l7-merging',
    situation: 'Git halted a merge or rebase because changes overlap on the same lines.',
    recommendedAction: 'Open the conflicted files, choose which code to keep between the `<<<<<<<` and `>>>>>>>` markers, stage the file, and continue.',
    commands: ['git status', 'git add <resolved-file>', 'git merge --continue', 'git merge --abort'],
  },
  {
    keywords: ['save my work', 'save work', 'create save point', 'checkpoint', 'commit changes', 'stage changes', 'git save'],
    matchedNodeId: 'l2-git-foundations',
    situation: 'You have modified files and want to capture a safe, permanent milestone.',
    recommendedAction: 'Inspect with `git status`, choose files for the packing box with `git add <file>`, and record with `git commit -m "..."`.',
    commands: ['git status', 'git add <file>', 'git commit -m "..."'],
  },
  {
    keywords: ['secret', '.env', 'api key', 'password', 'token', 'staged secret'],
    matchedNodeId: 'l2-git-foundations',
    situation: 'You accidentally staged a sensitive file like .env containing secret keys.',
    recommendedAction: 'Don’t panic—it has NOT been published. Run `git restore --staged .env` to safely remove it from staging without deleting the file.',
    commands: ['git restore --staged .env'],
  },
  {
    keywords: ['switch branch', 'change branch', 'new branch', 'create branch', 'checkout branch'],
    matchedNodeId: 'l6-branching',
    situation: 'You want to work in an isolated branch without disturbing main.',
    recommendedAction: 'Use `git switch -c <branch-name>` to create and jump into a new branch immediately.',
    commands: ['git switch -c <branch-name>', 'git switch main'],
  },
  {
    keywords: ['pause work', 'stash', 'urgent fix', 'save temporary', 'put away work'],
    matchedNodeId: 'l15-stash',
    situation: 'You need to switch branches urgently, but your current changes are unfinished.',
    recommendedAction: 'Run `git stash push -m "work in progress"` to tuck your edits into a temporary drawer, then pop them back later.',
    commands: ['git stash', 'git stash pop'],
  },
  {
    keywords: ['clean history', 'squash', 'combine commits', 'rebase', 'tidy commits'],
    matchedNodeId: 'l13-history-engineering',
    situation: 'You have multiple messy "wip" or "fix typo" commits that you want to condense before opening a pull request.',
    recommendedAction: 'Run `git rebase -i HEAD~<n>` and use `squash` or `fixup` to combine commits into clean, atomic milestones.',
    commands: ['git rebase -i HEAD~3'],
  },
  {
    keywords: ['find bug', 'bisect', 'broken commit', 'who broke', 'which commit introduced bug'],
    matchedNodeId: 'l16-investigating',
    situation: 'A bug exists in production today, but you know it worked 2 weeks ago.',
    recommendedAction: 'Use `git bisect` to run a binary search across history: mark current as bad and past commit as good.',
    commands: ['git bisect start', 'git bisect bad', 'git bisect good <commit>'],
  },
  {
    keywords: ['ci', 'cd', 'actions', 'automated tests', 'pipeline', 'workflow', 'deploy'],
    matchedNodeId: 'l25-github-actions',
    situation: 'You want GitHub to automatically run tests or deploy your website whenever you push code.',
    recommendedAction: 'Create a `.github/workflows/test.yml` workflow file defining your triggers and test steps.',
    commands: ['gh workflow run'],
  },
];

export function searchAcademyByIntent(query: string): IntentSearchResult[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const results: IntentSearchResult[] = [];

  for (const item of INTENT_SEARCH_DICTIONARY) {
    const isMatched = item.keywords.some(
      (kw) => normalized.includes(kw) || kw.includes(normalized)
    );

    if (isMatched) {
      const node = ACADEMY_CURRICULUM_NODES.find((n) => n.id === item.matchedNodeId);
      if (node) {
        results.push({
          query,
          matchedNodeId: item.matchedNodeId,
          situation: item.situation,
          recommendedAction: item.recommendedAction,
          commands: item.commands,
          node,
        });
      }
    }
  }

  // Fallback: search node titles, descriptions, and concepts directly
  if (results.length === 0) {
    for (const node of ACADEMY_CURRICULUM_NODES) {
      const matchTitle = node.title.toLowerCase().includes(normalized);
      const matchDesc = node.description.toLowerCase().includes(normalized);
      const matchConcept = node.concepts.some((c) => c.toLowerCase().includes(normalized));
      const matchCmd = node.commands.some((c) => c.toLowerCase().includes(normalized));

      if (matchTitle || matchDesc || matchConcept || matchCmd) {
        results.push({
          query,
          matchedNodeId: node.id,
          situation: `Looking for concepts related to "${node.title}"`,
          recommendedAction: node.description,
          commands: node.commands.slice(0, 3),
          node,
        });
      }
    }
  }

  return results;
}

// =============================================================================
// THE PROBLEM SOLVER SCENARIOS (Section 14)
// =============================================================================

export const PROBLEM_SOLVER_SCENARIOS: ProblemSolverScenario[] = [
  {
    id: 'ps-wrong-commit',
    title: 'I accidentally committed something I shouldn’t have',
    summary: 'You clicked commit or ran `git commit` too early, or included the wrong file.',
    whatProbablyHappened: 'Git sealed the staged state into a new local commit object. If you have not run `git push`, this commit only exists on your computer disk.',
    whatGitIsDoing: 'HEAD and your current branch are pointing to this new commit.',
    whatToInspect: ['Run `git log -1` to inspect the commit message and author.', 'Run `git show --stat` to see what files are in the commit.'],
    recommendedRecoveryPath: 'Use `git reset --soft HEAD~1`. This unwinds the commit and puts all your file changes right back onto your desk in the staging area safely.',
    safeCommands: ['git reset --soft HEAD~1', 'git commit --amend'],
    whatNotToDo: 'Do NOT casually run `git reset --hard HEAD~1` unless you explicitly want to discard all code changes on disk.',
    whyAvoid: '`--hard` wipes out uncommitted working tree changes permanently.',
    howToVerify: ['Run `git status`—your files should be intact and ready for you to adjust.', 'Run `git log --oneline -3`—the unwanted commit is gone.'],
    relatedNodeId: 'l5-undo-recovery',
  },
  {
    id: 'ps-merge-conflicts',
    title: 'I have merge conflicts and I’m afraid of breaking code',
    summary: 'Git encountered divergent changes on the exact same lines in two branches.',
    whatProbablyHappened: 'You merged or rebased a branch where another developer also changed the same code. Git stopped and asked for human judgment.',
    whatGitIsDoing: 'Git marked the conflicting files with conflict markers and paused the merge process.',
    whatToInspect: ['Run `git status` to see which files say "both modified".', 'Open the files in your editor and look for `<<<<<<<` and `>>>>>>>`.'],
    recommendedRecoveryPath: 'Review each conflict block. Keep the correct code, delete the marker lines, stage the resolved file with `git add`, and run `git merge --continue`.',
    safeCommands: ['git status', 'git merge --abort', 'git add <resolved-file>', 'git merge --continue'],
    whatNotToDo: 'Do not panic and delete `.git` or commit conflict markers (`<<<<<<<`) into history.',
    whyAvoid: 'Conflict markers committed into code will break builds and syntax checkers.',
    howToVerify: ['Run `git diff --check` to ensure no conflict markers remain.', 'Run your tests to confirm the combined code works.'],
    relatedNodeId: 'l7-merging',
  },
  {
    id: 'ps-lost-commit',
    title: 'I lost a commit or accidentally deleted a branch',
    summary: 'A commit disappeared from history or you deleted a branch with work on it.',
    whatProbablyHappened: 'In Git, deleted branches or hard resets only move branch pointers. The underlying commit objects still exist in Git’s object database for days.',
    whatGitIsDoing: 'The commit is an "orphaned object" waiting for garbage collection, safely preserved in `.git/logs/HEAD`.',
    whatToInspect: ['Run `git reflog`—Git’s flight recorder that records every HEAD movement.'],
    recommendedRecoveryPath: 'Find the commit hash in the reflog right before the mistake happened, then create a new branch pointing directly to it: `git switch -c rescue-branch <sha>`.',
    safeCommands: ['git reflog', 'git switch -c rescue <sha>'],
    whatNotToDo: 'Do not run `git gc --prune=now`—that forces immediate deletion of unreferenced objects.',
    whyAvoid: 'You want Git to keep loose objects until you retrieve your SHA.',
    howToVerify: ['Run `git log -1 rescue` to confirm your lost code is restored and intact.'],
    relatedNodeId: 'l16-investigating',
  },
  {
    id: 'ps-push-rejected',
    title: 'My git push was rejected (non-fast-forward)',
    summary: 'You ran `git push` and Git printed `[rejected - non-fast-forward]`.',
    whatProbablyHappened: 'A teammate pushed commits to the remote branch while you were working locally. The remote repository is ahead of your local branch.',
    whatGitIsDoing: 'Git refuses to push to protect you from accidentally overwriting your teammate’s commits.',
    whatToInspect: ['Run `git fetch origin` to download remote updates without touching your working files.', 'Run `git log HEAD..origin/main --oneline` to see what your teammate committed.'],
    recommendedRecoveryPath: 'Integrate their commits into your branch using `git pull --rebase origin main` (or `git pull`), resolve any conflicts, and then push cleanly.',
    safeCommands: ['git fetch origin', 'git pull --rebase origin main', 'git push'],
    whatNotToDo: 'Do NOT run `git push --force` on shared team branches.',
    whyAvoid: 'A blind force push overwrites your teammates’ commits on the remote server.',
    howToVerify: ['Run `git status`—it should report "Your branch is up to date with origin/main".'],
    relatedNodeId: 'l8-remotes',
  },
  {
    id: 'ps-secret-file',
    title: 'I committed or staged a secret file (.env, API key)',
    summary: 'A file containing private passwords or keys entered staging or a local commit.',
    whatProbablyHappened: 'You ran `git add .` or `git add .env` and staged credentials.',
    whatGitIsDoing: 'If only staged: the file is in the staging box. If committed: it is sealed in local history.',
    whatToInspect: ['Run `git status` to see if .env is staged ("Changes to be committed").', 'Run `git log -1 --stat` to see if it was committed.'],
    recommendedRecoveryPath: 'If only staged: run `git restore --staged .env`. If committed locally: run `git reset --soft HEAD~1`, unstage `.env`, add `.env` to `.gitignore`, and recommit.',
    safeCommands: ['git restore --staged .env', 'echo ".env" >> .gitignore'],
    whatNotToDo: 'Do not push the commit to GitHub hoping no one will notice.',
    whyAvoid: 'Automated bots scan GitHub repositories within seconds of pushing. Any pushed secret must be rotated immediately.',
    howToVerify: ['Run `git status`—verify `.env` is untracked or ignored.', 'Verify `git log -p -1` does not contain secret strings.'],
    relatedNodeId: 'l2-git-foundations',
  },
  {
    id: 'ps-broken-build',
    title: 'The build is broken and I need to find which commit caused it',
    summary: 'Something that worked last week is broken today, and there are 50 new commits.',
    whatProbablyHappened: 'A regression was introduced somewhere in recent commits, but no one noticed when it was merged.',
    whatGitIsDoing: 'Git has a complete immutable chronological ledger of every commit and tree state.',
    whatToInspect: ['Run `git log --oneline -20` to skim recent commit messages.', 'Find a past commit hash where you are certain the application worked.'],
    recommendedRecoveryPath: 'Use `git bisect`. Tell Git the current commit is `bad` and the past commit is `good`. Git will check out commits using binary search so you can test them.',
    safeCommands: ['git bisect start', 'git bisect bad', 'git bisect good <sha>', 'git bisect reset'],
    whatNotToDo: 'Do not manually check out and test 50 commits one by one by hand.',
    whyAvoid: 'Manual testing is slow and prone to human error; bisect finds the culprit in $\\approx \\log_2(N)$ steps.',
    howToVerify: ['Git will print: `<sha> is the first bad commit` along with the author and message.'],
    relatedNodeId: 'l16-investigating',
  },
];
