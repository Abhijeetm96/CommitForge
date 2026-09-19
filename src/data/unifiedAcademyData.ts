export type ConceptDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface SyntaxToken {
  token: string;
  role: string;
  explanation: string;
}

export interface ConceptVariation {
  syntax?: string;
  title: string;
  whatItDoes?: string;
  whenToUse?: string;
  whenNotToUse?: string;
  example?: string;
  warning?: string;
  flag?: string;
  desc?: string;
  snippet?: string;
}

export interface ScenarioQuestion {
  id?: string;
  title: string;
  context?: string;
  question?: string;
  options?: {
    label: string;
    command: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  whenToUse?: string;
  commandExample?: string;
  note?: string;
}

export interface CommandComparisonItem {
  commandA: string;
  commandB: string;
  commandC?: string;
  aspect: string;
  descriptionA: string;
  descriptionB: string;
  descriptionC?: string;
  safeForSharedHistory: {
    a: boolean;
    b: boolean;
    c?: boolean;
  };
}

export interface ActionStageFile {
  name: string;
  status: 'modified' | 'staged' | 'untracked' | 'committed' | 'conflict';
}

export interface ActionStageState {
  label: string;
  description: string;
  workingDirectory: ActionStageFile[];
  stagingArea: ActionStageFile[];
  commandPill: string;
  historyCommits: { hash: string; message: string; isNew?: boolean }[];
  whatChanged: string[];
  whatDidNotChange: string[];
}

export interface ConceptPracticeChallenge {
  title: string;
  objective?: string;
  instructions?: string | string[];
  startingState?: string;
  goalState?: string;
  seedCommands?: string[];
  initialFiles?: Record<string, string>;
  expectedCommands?: string[];
  hints: string[];
  solutionExplanation?: string;
  safeFailure?: {
    mistakeTitle: string;
    mistakeCommand: string;
    whatHappened: string;
    whatWasNotLost: string;
    recoveryCommand: string;
    recoveryExplanation: string;
  };
}

export interface UniversalConcept {
  id: string;
  command: string;
  title: string;
  topicId: string;
  topicNumber: string;
  topicTitle: string;
  subtitle: string;
  badges: string[]; // e.g. ['Beginner', 'Essential', 'Local']
  quote: string; // e.g. "A commit is a checkpoint for your project."
  difficulty: ConceptDifficulty;

  // Level 1: Understand
  whatIsIt: string;
  inSimpleWords: string;
  whyDoYouNeedIt: string;
  realWorldAnalogy: string;

  // Level 2: Syntax
  syntaxCode: string;
  syntaxTokens: SyntaxToken[];

  // Level 3: See it in action
  actionStage: {
    before: ActionStageState;
    running: ActionStageState;
    after: ActionStageState;
  };

  // Level 4: Explore
  variations: ConceptVariation[];
  scenarios: ScenarioQuestion[];
  commandComparisons?: CommandComparisonItem[];
  commonMistakes?: {
    mistake: string;
    whyItHappens: string;
    fix: string;
  }[];

  // Level 5: Practice & Sandbox
  sandbox: {
    initialCommands: string[];
    guidedSteps: {
      instruction: string;
      command: string;
      hint: string;
    }[];
    initialFiles?: { name: string; content: string }[];
    initialCommits?: { hash: string; message: string }[];
    targetTask?: string;
    hints?: string[];
    validationRegex?: RegExp;
    solutionCommands?: string[];
  };
  challenge: ConceptPracticeChallenge;

  // Level 6: Reference
  reference: ConceptReference;
}

export interface ConceptReferenceOption {
  flag: string;
  description: string;
}

export interface ConceptReferenceInternal {
  objectType: string;
  explanation: string;
  storageLocation: string;
}

export interface ConceptReferenceCommonError {
  error: string;
  remedy: string;
}

export interface ConceptReference {
  synopsis?: string;
  officialDocUrl?: string;
  syntaxCheatSheet?: string[];
  commonErrors?: ConceptReferenceCommonError[];
  mentalModelDiagram?: {
    concept: string;
    explanation: string;
    storageLocation: string;
  };
  options?: ConceptReferenceOption[];
  gitInternals?: ConceptReferenceInternal;
  edgeCases?: string[];
}

export interface AcademyTopic {
  id: string;
  number: string;
  title: string;
  description: string;
  iconName: string;
  conceptCount: number;
  concepts: {
    id: string;
    command: string;
    title: string;
    shortDesc: string;
    difficulty: ConceptDifficulty;
    isFullyDetailed?: boolean;
  }[];
}

// ============================================================================
// 18 TOPICS CANONICAL SYLLABUS
// ============================================================================
export const ACADEMY_18_TOPICS: AcademyTopic[] = [
  {
    id: 'topic-01',
    number: '01',
    title: 'Learn the Basics',
    description: 'Mental models, version control philosophies, and repository anatomy.',
    iconName: 'BookOpen',
    conceptCount: 6,
    concepts: [
      { id: 'c-what-is-vcs', command: 'git concepts', title: 'What is Version Control?', shortDesc: 'Tracking code history over time', difficulty: 'Beginner' },
      { id: 'c-why-use-vcs', command: 'git concepts', title: 'Why use Version Control?', shortDesc: 'Rollbacks and team audit trails', difficulty: 'Beginner' },
      { id: 'c-git-vs-other-vcs', command: 'git vs svn', title: 'Git vs Other VCS', shortDesc: 'Distributed DAG vs Centralized servers', difficulty: 'Beginner' },
      { id: 'c-installing-git-locally', command: 'git --version', title: 'Installing Git Locally', shortDesc: 'Setup on Mac, Linux, and Windows', difficulty: 'Beginner' },
      { id: 'c-what-is-a-repository', command: 'git repo', title: 'What is a Repository?', shortDesc: 'Project directory + .git database', difficulty: 'Beginner' },
      { id: 'c-git-init', command: 'git init', title: 'Initialize Repository', shortDesc: 'Create a new local repository', difficulty: 'Beginner' },
    ],
  },
  {
    id: 'topic-02',
    number: '02',
    title: 'Git Commands',
    description: 'The core everyday commands for inspecting, staging, and committing code.',
    iconName: 'Terminal',
    conceptCount: 5,
    concepts: [
      { id: 'c-git-status', command: 'git status', title: 'git status', shortDesc: 'See what changed', difficulty: 'Beginner', isFullyDetailed: true },
      { id: 'c-git-add', command: 'git add', title: 'git add', shortDesc: 'Stage changes', difficulty: 'Beginner', isFullyDetailed: true },
      { id: 'c-git-commit', command: 'git commit', title: 'git commit', shortDesc: 'Save a snapshot', difficulty: 'Beginner', isFullyDetailed: true },
      { id: 'c-git-diff', command: 'git diff', title: 'git diff', shortDesc: 'See differences', difficulty: 'Beginner', isFullyDetailed: true },
      { id: 'c-git-restore-staged', command: 'git restore --staged', title: 'git restore --staged', shortDesc: 'Unstage changes safely', difficulty: 'Beginner', isFullyDetailed: true },
    ],
  },
  {
    id: 'topic-03',
    number: '03',
    title: 'Branching Basics',
    description: 'Create parallel universes, isolate feature work, and switch contexts.',
    iconName: 'GitBranch',
    conceptCount: 5,
    concepts: [
      { id: 'c-git-branch', command: 'git branch', title: 'git branch', shortDesc: 'List and create branches', difficulty: 'Beginner' },
      { id: 'c-git-switch', command: 'git switch', title: 'git switch', shortDesc: 'Switch between branches safely', difficulty: 'Beginner' },
      { id: 'c-git-checkout', command: 'git checkout', title: 'git checkout', shortDesc: 'Traditional branch and file switcher', difficulty: 'Intermediate' },
      { id: 'c-git-merge-basic', command: 'git merge', title: 'git merge', shortDesc: 'Combine branches together', difficulty: 'Beginner' },
      { id: 'c-detached-head', command: 'HEAD pointer', title: 'Understanding HEAD & Detached HEAD', shortDesc: 'Where you are standing in history', difficulty: 'Intermediate' },
    ],
  },
  {
    id: 'topic-04',
    number: '04',
    title: 'Basic Collaboration',
    description: 'Connect with remote repositories, push commits, and pull updates.',
    iconName: 'Share2',
    conceptCount: 5,
    concepts: [
      { id: 'c-git-remote', command: 'git remote', title: 'git remote', shortDesc: 'Manage remote server pointers', difficulty: 'Beginner' },
      { id: 'c-git-push', command: 'git push', title: 'git push', shortDesc: 'Upload local commits to remote', difficulty: 'Beginner' },
      { id: 'c-git-fetch', command: 'git fetch', title: 'git fetch', shortDesc: 'Download remote commits without merging', difficulty: 'Intermediate' },
      { id: 'c-git-pull', command: 'git pull', title: 'git pull', shortDesc: 'Fetch and merge remote changes', difficulty: 'Beginner' },
      { id: 'c-git-clone', command: 'git clone', title: 'git clone', shortDesc: 'Download an existing repository', difficulty: 'Beginner' },
    ],
  },
  {
    id: 'topic-05',
    number: '05',
    title: 'GitHub Essentials',
    description: 'The premier platform for hosting code, managing forks, and sharing work.',
    iconName: 'Globe',
    conceptCount: 4,
    concepts: [
      { id: 'c-github-intro', command: 'github.com', title: 'GitHub Overview', shortDesc: 'Remote hosting & developer network', difficulty: 'Beginner' },
      { id: 'c-github-forks', command: 'forks', title: 'Forks vs Clones', shortDesc: 'Contributing to projects you do not own', difficulty: 'Beginner' },
      { id: 'c-github-pull-requests', command: 'pull requests', title: 'Pull Requests', shortDesc: 'Proposing changes for code review', difficulty: 'Beginner' },
      { id: 'c-github-ssh-keys', command: 'ssh-keygen', title: 'SSH Keys & Authentication', shortDesc: 'Securely authenticating with GitHub', difficulty: 'Intermediate' },
    ],
  },
  {
    id: 'topic-06',
    number: '06',
    title: 'Collaboration on GitHub',
    description: 'Code review workflows, PR etiquette, resolving review comments, and upstream sync.',
    iconName: 'Users',
    conceptCount: 4,
    concepts: [
      { id: 'c-gh-code-review', command: 'code review', title: 'Effective Code Reviews', shortDesc: 'Reviewing diffs and leaving feedback', difficulty: 'Intermediate' },
      { id: 'c-gh-upstream-sync', command: 'upstream sync', title: 'Syncing Fork with Upstream', shortDesc: 'Keeping personal forks up to date', difficulty: 'Intermediate' },
      { id: 'c-gh-pr-squash', command: 'merge options', title: 'Squash vs Merge Commit vs Rebase', shortDesc: 'GitHub PR merge options', difficulty: 'Intermediate' },
      { id: 'c-gh-protected-branches', command: 'branch rules', title: 'Protected Branches', shortDesc: 'Enforcing required reviews & status checks', difficulty: 'Intermediate' },
    ],
  },
  {
    id: 'topic-07',
    number: '07',
    title: 'Merge Strategies',
    description: 'Master fast-forward merges, recursive 3-way merges, and git rebase.',
    iconName: 'GitMerge',
    conceptCount: 4,
    concepts: [
      { id: 'c-fast-forward', command: 'git merge --ff-only', title: 'Fast-Forward Merges', shortDesc: 'Linear pointer advancement', difficulty: 'Beginner' },
      { id: 'c-three-way-merge', command: 'git merge --no-ff', title: '3-Way Merge Commits', shortDesc: 'Creating explicit merge commits', difficulty: 'Intermediate' },
      { id: 'c-git-rebase', command: 'git rebase', title: 'git rebase', shortDesc: 'Replaying commits onto a new base', difficulty: 'Intermediate' },
      { id: 'c-merge-conflicts', command: 'conflict markers', title: 'Resolving Merge Conflicts', shortDesc: 'Fixing <<<<<<< HEAD conflicts', difficulty: 'Intermediate' },
    ],
  },
  {
    id: 'topic-08',
    number: '08',
    title: 'Best Practices',
    description: 'Write clean commit messages, make atomic commits, and protect secret files.',
    iconName: 'CheckCircle2',
    conceptCount: 4,
    concepts: [
      { id: 'c-atomic-commits', command: 'best practice', title: 'Atomic Commits', shortDesc: 'One logical change per commit', difficulty: 'Beginner' },
      { id: 'c-commit-messages', command: 'conventional commits', title: 'Conventional Commit Messages', shortDesc: 'feat: and fix: standardized messages', difficulty: 'Beginner' },
      { id: 'c-gitignore-mastery', command: '.gitignore', title: '.gitignore Mastery', shortDesc: 'Preventing secret and build file leaks', difficulty: 'Beginner' },
      { id: 'c-clean-git-hygiene', command: 'git status -s', title: 'Day-to-Day Git Hygiene', shortDesc: 'Stash vs Commit vs Discard routines', difficulty: 'Intermediate' },
    ],
  },
  {
    id: 'topic-09',
    number: '09',
    title: 'Working in a Team',
    description: 'GitFlow, Trunk-Based Development, release trains, and release branching.',
    iconName: 'Layers',
    conceptCount: 3,
    concepts: [
      { id: 'c-trunk-based', command: 'trunk-based', title: 'Trunk-Based Development', shortDesc: 'Short-lived feature branches & CI', difficulty: 'Intermediate' },
      { id: 'c-gitflow', command: 'gitflow', title: 'GitFlow Workflow', shortDesc: 'Develop, release, and hotfix branches', difficulty: 'Intermediate' },
      { id: 'c-team-conflict-prevention', command: 'team sync', title: 'Conflict Prevention in Teams', shortDesc: 'Frequent rebasing and modular architectures', difficulty: 'Intermediate' },
    ],
  },
  {
    id: 'topic-10',
    number: '10',
    title: 'GitHub Projects',
    description: 'Issues, Kanban boards, roadmaps, milestones, and labels.',
    iconName: 'LayoutGrid',
    conceptCount: 3,
    concepts: [
      { id: 'c-gh-issues', command: 'github issues', title: 'Issue Tracking', shortDesc: 'Bug reports, feature requests & linking', difficulty: 'Beginner' },
      { id: 'c-gh-project-boards', command: 'projects v2', title: 'GitHub Projects & Boards', shortDesc: 'Interactive Kanban tables and views', difficulty: 'Beginner' },
      { id: 'c-gh-milestones', command: 'milestones', title: 'Milestones & Epics', shortDesc: 'Tracking release targets and deadlines', difficulty: 'Intermediate' },
    ],
  },
  {
    id: 'topic-11',
    number: '11',
    title: 'Intermediate Git Topics',
    description: 'Stashing, cherry-picking, interactive rebase, and resetting safely.',
    iconName: 'Zap',
    conceptCount: 5,
    concepts: [
      { id: 'c-git-stash', command: 'git stash', title: 'git stash', shortDesc: 'Temporarily shelve uncommitted work', difficulty: 'Intermediate' },
      { id: 'c-git-cherry-pick', command: 'git cherry-pick', title: 'git cherry-pick', shortDesc: 'Apply specific commits to current branch', difficulty: 'Intermediate' },
      { id: 'c-git-rebase-i', command: 'git rebase -i', title: 'Interactive Rebase', shortDesc: 'Squash, fixup, reword, and reorder', difficulty: 'Advanced' },
      { id: 'c-git-reset-modes', command: 'git reset', title: 'git reset (--soft, --mixed, --hard)', shortDesc: 'Moving HEAD and adjusting index/working tree', difficulty: 'Intermediate' },
      { id: 'c-git-revert', command: 'git revert', title: 'git revert', shortDesc: 'Safe public history undo via new commit', difficulty: 'Intermediate' },
    ],
  },
  {
    id: 'topic-12',
    number: '12',
    title: 'Tagging',
    description: 'Mark release points, semantic versions, and cryptographically signed tags.',
    iconName: 'Bookmark',
    conceptCount: 3,
    concepts: [
      { id: 'c-lightweight-tags', command: 'git tag v1.0.0', title: 'Lightweight Tags', shortDesc: 'Simple pointers to specific commits', difficulty: 'Beginner' },
      { id: 'c-annotated-tags', command: 'git tag -a -m', title: 'Annotated Tags', shortDesc: 'Full tagger metadata, date, and message', difficulty: 'Intermediate' },
      { id: 'c-pushing-tags', command: 'git push --tags', title: 'Pushing & Managing Tags', shortDesc: 'Sharing release tags to remote', difficulty: 'Beginner' },
    ],
  },
  {
    id: 'topic-13',
    number: '13',
    title: 'Git Hooks',
    description: 'Automate linting, unit testing, and commit message validation before commits.',
    iconName: 'Cpu',
    conceptCount: 3,
    concepts: [
      { id: 'c-client-hooks', command: 'pre-commit', title: 'Client-Side Hooks', shortDesc: 'Automating tests and formatting locally', difficulty: 'Advanced' },
      { id: 'c-commit-msg-hook', command: 'commit-msg', title: 'Commit Message Hooks', shortDesc: 'Validating conventional commit rules', difficulty: 'Advanced' },
      { id: 'c-husky-lint-staged', command: 'husky', title: 'Modern Tooling (Husky & lint-staged)', shortDesc: 'Sharing repo hooks across teams', difficulty: 'Intermediate' },
    ],
  },
  {
    id: 'topic-14',
    number: '14',
    title: 'Submodules',
    description: 'Embed other Git repositories inside your codebase with pinned commits.',
    iconName: 'FolderGit2',
    conceptCount: 3,
    concepts: [
      { id: 'c-submodule-add', command: 'git submodule add', title: 'Adding Submodules', shortDesc: 'Pinning external repos at exact commits', difficulty: 'Advanced' },
      { id: 'c-submodule-update', command: 'git submodule update', title: 'Cloning & Updating Submodules', shortDesc: 'Initializing nested repositories recursively', difficulty: 'Advanced' },
      { id: 'c-submodules-vs-monorepo', command: 'architecture', title: 'Submodules vs Monorepos', shortDesc: 'Tradeoffs and maintenance realities', difficulty: 'Expert' },
    ],
  },
  {
    id: 'topic-15',
    number: '15',
    title: 'GitHub Workflow',
    description: 'GitHub Actions, automated CI/CD pipelines, release automation, and artifact builds.',
    iconName: 'PlayCircle',
    conceptCount: 4,
    concepts: [
      { id: 'c-actions-intro', command: '.github/workflows', title: 'GitHub Actions Basics', shortDesc: 'YAML workflows, jobs, and steps', difficulty: 'Intermediate' },
      { id: 'c-ci-cd-pipelines', command: 'actions CI', title: 'Continuous Integration', shortDesc: 'Automated test runners on every push', difficulty: 'Intermediate' },
      { id: 'c-action-secrets', command: 'secrets', title: 'Encrypted Secrets & Variables', shortDesc: 'Safely providing deployment tokens', difficulty: 'Intermediate' },
      { id: 'c-releases-artifacts', command: 'releases', title: 'Automated GitHub Releases', shortDesc: 'Packaging binaries and changelogs', difficulty: 'Intermediate' },
    ],
  },
  {
    id: 'topic-16',
    number: '16',
    title: 'Advanced Git Topics',
    description: 'Rescuing deleted work with reflog, binary search debugging with bisect, and worktrees.',
    iconName: 'ShieldAlert',
    conceptCount: 4,
    concepts: [
      { id: 'c-git-reflog', command: 'git reflog', title: 'git reflog (The Ultimate Safety Net)', shortDesc: 'Recovering deleted commits and branches', difficulty: 'Advanced' },
      { id: 'c-git-bisect', command: 'git bisect', title: 'git bisect', shortDesc: 'Binary search debugging for regressions', difficulty: 'Advanced' },
      { id: 'c-git-worktree', command: 'git worktree', title: 'git worktree', shortDesc: 'Check out multiple branches simultaneously', difficulty: 'Expert' },
      { id: 'c-git-internals-dag', command: '.git/objects', title: 'Git Internals & Object DB', shortDesc: 'Blobs, trees, commits, and cryptographic hashes', difficulty: 'Expert' },
    ],
  },
  {
    id: 'topic-17',
    number: '17',
    title: 'GitHub Developer Tools',
    description: 'GitHub CLI, GitHub REST/GraphQL APIs, personal access tokens, and Codespaces.',
    iconName: 'Command',
    conceptCount: 3,
    concepts: [
      { id: 'c-gh-cli', command: 'gh pr create', title: 'GitHub CLI (`gh`)', shortDesc: 'Manage PRs, issues, and repos from terminal', difficulty: 'Intermediate' },
      { id: 'c-gh-api', command: 'api.github.com', title: 'GitHub REST & GraphQL API', shortDesc: 'Programmatic automation and webhooks', difficulty: 'Advanced' },
      { id: 'c-codespaces', command: 'codespaces', title: 'GitHub Codespaces', shortDesc: 'Cloud developer environments in browser', difficulty: 'Beginner' },
    ],
  },
  {
    id: 'topic-18',
    number: '18',
    title: 'More GitHub Features',
    description: 'Discussions, GitHub Pages, Dependabot security updates, and Secret Scanning.',
    iconName: 'Sparkles',
    conceptCount: 3,
    concepts: [
      { id: 'c-gh-discussions', command: 'discussions', title: 'GitHub Discussions', shortDesc: 'Community forum for open source projects', difficulty: 'Beginner' },
      { id: 'c-gh-pages', command: 'pages', title: 'GitHub Pages', shortDesc: 'Free static web hosting from a repository', difficulty: 'Beginner' },
      { id: 'c-gh-security', command: 'dependabot', title: 'Dependabot & Security Alerts', shortDesc: 'Automated vulnerability scanning & PR patches', difficulty: 'Intermediate' },
    ],
  },
];

// ============================================================================
// FIRST VERTICAL SLICE: FULL BESPOKE DATA
// 1. git status
// 2. git diff
// 3. git add
// 4. git commit
// 5. git restore --staged
// ============================================================================

export const BESPOKE_CONCEPTS: Record<string, UniversalConcept> = {
  // --------------------------------------------------------------------------
  // GIT COMMIT (As showcased in reference screenshot!)
  // --------------------------------------------------------------------------
  'c-git-commit': {
    id: 'c-git-commit',
    command: 'git commit',
    title: 'git commit',
    topicId: 'topic-02',
    topicNumber: '02',
    topicTitle: 'Git Commands',
    subtitle: 'Create a new commit from the changes currently in the staging area.',
    badges: ['Beginner', 'Essential', 'Local'],
    quote: 'A commit is a checkpoint for your project.',
    difficulty: 'Beginner',

    whatIsIt: 'A commit records the changes currently in the staging area as a new point in your project\'s history.',
    inSimpleWords: "It's like taking a snapshot of your project so you can return to it later.",
    whyDoYouNeedIt: 'Git needs commits so you can record meaningful versions of your project, track progress, collaborate with others, and go back if something breaks.',
    realWorldAnalogy: 'Think of commits like save points in a game. You can always go back to a previous point.',

    syntaxCode: 'git commit -m "Your commit message"',
    syntaxTokens: [
      { token: 'git', role: 'The Git tool', explanation: 'The command-line program that manages your version history.' },
      { token: 'commit', role: 'Create a commit', explanation: 'The action command telling Git to seal staged changes into a permanent snapshot.' },
      { token: '-m', role: 'Provide a message', explanation: 'A flag telling Git that the following string is the commit log message.' },
      { token: '"Your commit message"', role: 'A short description of the changes', explanation: 'A concise summary explaining why this change was made to the codebase.' },
    ],

    actionStage: {
      before: {
        label: 'Before Commit',
        description: 'You modified index.html and style.css, and already ran git add to prepare them in the staging area.',
        workingDirectory: [
          { name: 'index.html', status: 'modified' },
          { name: 'style.css', status: 'modified' },
        ],
        stagingArea: [
          { name: 'index.html', status: 'staged' },
          { name: 'style.css', status: 'staged' },
        ],
        commandPill: 'git commit -m "Add login page"',
        historyCommits: [
          { hash: 'C1', message: 'Initial commit' },
        ],
        whatChanged: [
          'Nothing yet — awaiting the git commit command.',
        ],
        whatDidNotChange: [
          'Files in your working directory and staging index are currently intact.',
          'Your repository history still only contains previous commits.',
        ],
      },
      running: {
        label: 'Run Command',
        description: 'Git creates a cryptographic tree object of the staging area, records author & timestamp, and advances the current branch pointer.',
        workingDirectory: [
          { name: 'index.html', status: 'committed' },
          { name: 'style.css', status: 'committed' },
        ],
        stagingArea: [
          { name: 'index.html', status: 'staged' },
          { name: 'style.css', status: 'staged' },
        ],
        commandPill: '⚡ Sealing C2 [main e8f2a1b]',
        historyCommits: [
          { hash: 'C1', message: 'Initial commit' },
          { hash: 'C2', message: 'Add login page', isNew: true },
        ],
        whatChanged: [
          'A new commit object (C2) is created.',
          'The branch pointer (main) and HEAD advance to point to C2.',
        ],
        whatDidNotChange: [
          'No remote servers were contacted. Commits are 100% local.',
        ],
      },
      after: {
        label: 'After Commit',
        description: 'After committing, the staging area is cleared and a new commit is added to your local repository.',
        workingDirectory: [
          { name: 'index.html', status: 'committed' },
          { name: 'style.css', status: 'committed' },
        ],
        stagingArea: [],
        commandPill: 'git commit (Completed)',
        historyCommits: [
          { hash: 'C2', message: 'Add login page (HEAD -> main)', isNew: true },
          { hash: 'C1', message: 'Initial commit' },
        ],
        whatChanged: [
          'A new commit was created in the local repository.',
          'The staging area is cleared.',
        ],
        whatDidNotChange: [
          'Your working directory files remain the same.',
          'Nothing is uploaded to GitHub. A commit is local until you push.',
        ],
      },
    },

    variations: [
      {
        title: 'Normal commit',
        syntax: 'git commit -m "message"',
        whatItDoes: 'Creates a standard commit containing all currently staged changes.',
        whenToUse: 'Use when you want to create a commit with a message.',
        example: 'git commit -m "feat: implement responsive navigation bar"',
      },
      {
        title: 'Commit tracked files',
        syntax: 'git commit -am "message"',
        whatItDoes: 'Automatically stages all modified tracked files and commits them in one step.',
        whenToUse: 'Use when you want to skip staging for already tracked files.',
        whenNotToUse: 'Do not use if you have new untracked files, or want to review changes first.',
        example: 'git commit -am "fix: typo in footer copyright text"',
        warning: 'Does not stage brand-new untracked files.',
      },
      {
        title: 'Modify last commit',
        syntax: 'git commit --amend',
        whatItDoes: 'Combines staged changes with the previous commit and allows updating the commit message.',
        whenToUse: 'Use when you need to change the last commit\'s message or content.',
        whenNotToUse: 'Never amend a commit that has already been pushed to a shared remote branch!',
        example: 'git add forgotten-file.js && git commit --amend --no-edit',
        warning: 'Rewrites commit hash. Safe only for local unpushed commits.',
      },
    ],

    scenarios: [
      {
        id: 'sc-feature-finished',
        title: 'You finished a feature',
        context: 'You completed coding the login page and verified the form validation works cleanly.',
        question: 'What is the best action to take before starting on the payment page?',
        options: [
          {
            label: 'Stage the changes and create a clear atomic commit',
            command: 'git add src/login.js && git commit -m "feat: add login page"',
            isCorrect: true,
            explanation: 'Correct! Creating a commit seals this milestone so you can revert or branch cleanly without mixing payment work into login code.',
          },
          {
            label: 'Keep editing directly without committing',
            command: 'No Git command',
            isCorrect: false,
            explanation: 'Mixing login code and payment code in a single uncommitted working tree makes debugging and rollbacks very painful.',
          },
          {
            label: 'Force push to GitHub immediately',
            command: 'git push --force origin main',
            isCorrect: false,
            explanation: 'You cannot push until you have committed locally, and force pushing to main can destroy teammates\' work.',
          },
        ],
      },
      {
        id: 'sc-fixed-bug',
        title: 'You fixed a bug',
        context: 'You found a critical null pointer in the auth handler and patched the line.',
        question: 'How should you record this fix in history?',
        options: [
          {
            label: 'Commit the fix with a meaningful bugfix message',
            command: 'git commit -am "fix(auth): prevent null crash when token is missing"',
            isCorrect: true,
            explanation: 'Clear, imperative commit messages help future developers understand exactly why the code was modified.',
          },
          {
            label: 'Commit with a vague message like "updates"',
            command: 'git commit -m "updates"',
            isCorrect: false,
            explanation: 'Vague messages make git log and git blame useless when investigating regressions later.',
          },
        ],
      },
      {
        id: 'sc-forgot-file',
        title: 'You want to clean up your commits',
        context: 'You just ran git commit, but realized you forgot to include the unit test file.',
        question: 'How do you bundle the test into the commit you just made without creating a messy "whoops" commit?',
        options: [
          {
            label: 'Stage the test file and amend the previous commit',
            command: 'git add tests/login.test.js && git commit --amend --no-edit',
            isCorrect: true,
            explanation: 'git commit --amend replaces the last commit with a new one incorporating the staged file, keeping your history pristine.',
          },
          {
            label: 'Create a second commit named "added test whoops"',
            command: 'git commit -m "added test whoops"',
            isCorrect: false,
            explanation: 'While functional, cluttering project history with fixup commits when you haven\'t pushed yet is poor practice.',
          },
        ],
      },
    ],

    commandComparisons: [
      {
        commandA: 'git commit',
        commandB: 'git push',
        aspect: 'Scope of Impact',
        descriptionA: 'Saves your staged snapshot into your local repository database. Requires zero internet.',
        descriptionB: 'Transfers your local commit history over the network to a remote repository like GitHub.',
        safeForSharedHistory: { a: true, b: true },
      },
      {
        commandA: 'git commit -m',
        commandB: 'git commit --amend',
        aspect: 'History Treatment',
        descriptionA: 'Appends a brand new commit onto the tip of the current branch.',
        descriptionB: 'Replaces the most recent commit with a newly hashed version. Rewrites local history.',
        safeForSharedHistory: { a: true, b: false },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Running `git commit` without staging changes first',
        whyItHappens: 'Forgetting that Git requires two steps: staging (git add) then committing (git commit).',
        fix: 'Run `git status` to see unstaged changes, then `git add <file>` before committing.',
      },
      {
        mistake: 'Writing vague messages like "fixed stuff" or "asdf"',
        whyItHappens: 'Rushing to commit without thinking about teammates or future self reading git log.',
        fix: 'Use the imperative mood: "Add user profile avatar component" or follow Conventional Commits: "feat:", "fix:".',
      },
      {
        mistake: 'Amending a commit after it has already been pushed',
        whyItHappens: 'Attempting to clean up history without realizing team members already pulled the original commit.',
        fix: 'Once pushed, create a new forward-moving commit instead of amending.',
      },
    ],

    sandbox: {
      initialCommands: [
        'mkdir my-project',
        'cd my-project',
        'echo "Hello Git" > index.html',
        'git init',
      ],
      guidedSteps: [
        {
          instruction: 'Check what Git notices in your working directory',
          command: 'git status',
          hint: 'Type git status to see untracked index.html.',
        },
        {
          instruction: 'Stage index.html so it is ready for your checkpoint',
          command: 'git add index.html',
          hint: 'Type git add index.html to move the file into the staging area.',
        },
        {
          instruction: 'Seal the staged changes into a permanent snapshot',
          command: 'git commit -m "feat: initial project homepage"',
          hint: 'Type git commit -m "feat: initial project homepage" to save the commit.',
        },
        {
          instruction: 'Verify your commit is now saved in the history log',
          command: 'git log --oneline',
          hint: 'Type git log --oneline to view your new commit hash and message.',
        },
      ],
    },

    challenge: {
      title: 'Create Your First Production Snapshot',
      objective: 'You have modified both `app.js` and `secret.key`. You must selectively stage ONLY `app.js` and commit it with a descriptive message. Do NOT commit `secret.key`!',
      seedCommands: [
        'git init',
        'echo "console.log(1);" > app.js',
        'echo "SECRET_KEY_123" > secret.key',
      ],
      initialFiles: {
        'app.js': 'console.log("App ready");',
        'secret.key': 'API_KEY_DO_NOT_COMMIT=99999',
      },
      expectedCommands: [
        'git add app.js',
        'git commit -m "feat: app bootstrap"',
      ],
      hints: [
        'Run `git status` first to inspect both files.',
        'Use `git add app.js` to stage ONLY the application code. Do NOT run `git add .`!',
        'Execute `git commit -m "feat: app bootstrap"` to create the checkpoint.',
      ],
      solutionExplanation: 'Selective staging allows you to separate production code from temporary secrets or unfinished experiments before sealing the commit.',
      safeFailure: {
        mistakeTitle: 'Accidentally Staging a Secret File',
        mistakeCommand: 'git add .',
        whatHappened: 'Running `git add .` indiscriminately stages `secret.key` alongside your app code.',
        whatWasNotLost: 'The commit has not been made yet! The secret is only in the staging index.',
        recoveryCommand: 'git restore --staged secret.key',
        recoveryExplanation: '`git restore --staged <file>` removes the sensitive file from the staging box while keeping your file safe on your disk.',
      },
    },

    reference: {
      synopsis: 'git commit [-a | --interactive | --patch] [-s] [-v] [-u<mode>] [--amend] [--dry-run] [-m <msg>]',
      options: [
        { flag: '-m <msg>', description: 'Use the given <msg> as the commit message directly without opening an external text editor.' },
        { flag: '-a, --all', description: 'Automatically stage files that have been modified and deleted, but new untracked files are not affected.' },
        { flag: '--amend', description: 'Replace the tip of the current branch by creating a new commit combining staged changes with the previous commit.' },
        { flag: '--no-edit', description: 'Use the selected commit message without launching an editor when amending.' },
        { flag: '-v, --verbose', description: 'Show unified diff of changes to be committed in the commit message editor template.' },
      ],
      gitInternals: {
        objectType: 'Commit Object (40-character SHA-1 / 64-char SHA-256 hash)',
        explanation: 'A commit object in `.git/objects` contains: (1) pointer to a root tree object snapshot, (2) zero or more parent commit hashes, (3) author metadata with timestamp, (4) committer metadata, and (5) the commit message.',
        storageLocation: '.git/objects/[first 2 chars]/[remaining 38 chars]',
      },
      edgeCases: [
        'Empty commits: By default Git forbids commits with no staged changes. Pass `--allow-empty` to force an empty commit (useful for kicking CI pipelines).',
        'Line ending normalization: Core settings `core.autocrlf` or `.gitattributes` normalize CRLF and LF before commit tree calculation.',
      ],
    },
  },

  // --------------------------------------------------------------------------
  // GIT STATUS
  // --------------------------------------------------------------------------
  'c-git-status': {
    id: 'c-git-status',
    command: 'git status',
    title: 'git status',
    topicId: 'topic-02',
    topicNumber: '02',
    topicTitle: 'Git Commands',
    subtitle: 'Inspect the state of the working directory and staging area relative to HEAD.',
    badges: ['Beginner', 'Essential', 'Inspection'],
    quote: 'When in doubt, run git status.',
    difficulty: 'Beginner',

    whatIsIt: 'Displays paths that have differences between the index file and the current HEAD commit, paths that have differences between the working tree and the index file, and paths in the working tree that are not tracked by Git.',
    inSimpleWords: 'It tells you what files Git sees, what changes are ready to be saved, and what you haven\'t told Git about yet.',
    whyDoYouNeedIt: 'Before making any move in Git — staging, committing, branching, or pulling — you need a reliable map of your current workspace.',
    realWorldAnalogy: 'Think of git status like a dashboard speedometer and checklist before driving your car.',

    syntaxCode: 'git status',
    syntaxTokens: [
      { token: 'git', role: 'The Git tool', explanation: 'The command-line program that manages your version history.' },
      { token: 'status', role: 'Query state', explanation: 'Tells Git to inspect your working tree and staging index, then output a summary.' },
    ],

    actionStage: {
      before: {
        label: 'Before Status',
        description: 'You modified README.md and created a new file script.js on your computer.',
        workingDirectory: [
          { name: 'README.md', status: 'modified' },
          { name: 'script.js', status: 'untracked' },
        ],
        stagingArea: [],
        commandPill: 'git status',
        historyCommits: [
          { hash: 'C1', message: 'Initial commit' },
        ],
        whatChanged: [
          'Nothing in repository data has changed.',
        ],
        whatDidNotChange: [
          'No files have been modified or staged. Git status is purely a read-only query.',
        ],
      },
      running: {
        label: 'Querying State',
        description: 'Git compares file timestamps and cryptographic hashes between working tree, staging index, and HEAD.',
        workingDirectory: [
          { name: 'README.md', status: 'modified' },
          { name: 'script.js', status: 'untracked' },
        ],
        stagingArea: [],
        commandPill: '🔍 Comparing SHA hashes...',
        historyCommits: [
          { hash: 'C1', message: 'Initial commit' },
        ],
        whatChanged: [
          'Git generates the color-coded state report.',
        ],
        whatDidNotChange: [
          'Zero files or commits are altered.',
        ],
      },
      after: {
        label: 'After Status',
        description: 'Git outputs the exact three-tier status: Changes to be committed, Changes not staged for commit, and Untracked files.',
        workingDirectory: [
          { name: 'README.md', status: 'modified' },
          { name: 'script.js', status: 'untracked' },
        ],
        stagingArea: [],
        commandPill: 'git status (Read complete)',
        historyCommits: [
          { hash: 'C1', message: 'Initial commit' },
        ],
        whatChanged: [
          'You received complete visibility into what is staged, modified, or untracked.',
        ],
        whatDidNotChange: [
          'Your files remain completely unchanged. git status is 100% safe to run anytime.',
        ],
      },
    },

    variations: [
      {
        title: 'Full status',
        syntax: 'git status',
        whatItDoes: 'Full verbose output with helpful hints on how to stage or discard changes.',
        whenToUse: 'Default choice for learning and detailed inspection.',
        example: 'git status',
      },
      {
        title: 'Short status',
        syntax: 'git status -s',
        whatItDoes: 'Compact two-character status code per file (e.g. `M` for modified, `??` for untracked).',
        whenToUse: 'Use when you have dozens of changed files and want a clean summary.',
        example: 'git status -s -b',
      },
    ],

    scenarios: [
      {
        id: 'sc-status-check',
        title: 'Unsure what changed',
        context: 'You returned to your computer after lunch and forgot what files you were editing.',
        question: 'What command should you run first?',
        options: [
          {
            label: 'Run git status to see your current changes',
            command: 'git status',
            isCorrect: true,
            explanation: 'git status immediately shows you modified files in red, staged files in green, and untracked files.',
          },
          {
            label: 'Run git reset --hard to start over',
            command: 'git reset --hard',
            isCorrect: false,
            explanation: 'git reset --hard destroys all uncommitted work! Never run it when you just want to inspect.',
          },
        ],
      },
    ],

    commandComparisons: [
      {
        commandA: 'git status',
        commandB: 'git diff',
        aspect: 'Information Granularity',
        descriptionA: 'Shows high-level file lists (which files were added, modified, or deleted).',
        descriptionB: 'Shows line-by-line additions (+) and deletions (-) inside the files.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Ignoring red untracked files',
        whyItHappens: 'Thinking Git automatically tracks any file you save in the folder.',
        fix: 'Git will ignore untracked files until you explicitly tell it to track them with `git add <file>`.',
      },
    ],

    sandbox: {
      initialCommands: [
        'git init',
        'echo "CommitForge v1" > README.md',
      ],
      guidedSteps: [
        {
          instruction: 'Check repository status',
          command: 'git status',
          hint: 'Type git status to see untracked README.md.',
        },
        {
          instruction: 'Stage the file',
          command: 'git add README.md',
          hint: 'Type git add README.md.',
        },
        {
          instruction: 'Check status again to see the staged file turned green',
          command: 'git status',
          hint: 'Notice "Changes to be committed" now contains README.md.',
        },
      ],
    },

    challenge: {
      title: 'Diagnose Repository State',
      objective: 'Inspect the repository to determine whether any files are currently staged for commit.',
      seedCommands: [
        'git init',
        'echo "a" > a.txt',
        'git add a.txt',
        'echo "b" > b.txt',
      ],
      initialFiles: { 'a.txt': 'a', 'b.txt': 'b' },
      expectedCommands: ['git status'],
      hints: ['Run `git status` and observe which file is under "Changes to be committed".'],
      solutionExplanation: 'a.txt is staged and ready to commit; b.txt is untracked.',
      safeFailure: {
        mistakeTitle: 'Assuming all files are staged',
        mistakeCommand: 'git commit -m "init"',
        whatHappened: 'Only a.txt was committed. b.txt was left behind untracked.',
        whatWasNotLost: 'b.txt was not deleted; it remained in your working tree.',
        recoveryCommand: 'git add b.txt && git commit --amend --no-edit',
        recoveryExplanation: 'Stage the missing file and amend the previous commit.',
      },
    },

    reference: {
      synopsis: 'git status [<options>] [--] [<pathspec>...]',
      options: [
        { flag: '-s, --short', description: 'Give the output in the short-format.' },
        { flag: '-b, --branch', description: 'Show the branch and tracking info even in short-format.' },
        { flag: '-u, --untracked-files[=<mode>]', description: 'Show untracked files: all, normal, or no.' },
      ],
      gitInternals: {
        objectType: 'Stat cache & index inspection',
        explanation: 'Compares file metadata (mtime, size, SHA) in the `.git/index` binary against filesystem stat calls.',
        storageLocation: '.git/index',
      },
      edgeCases: ['File permissions changes (executable bit chmod +x) show up as file modifications in git status.'],
    },
  },

  // --------------------------------------------------------------------------
  // GIT ADD
  // --------------------------------------------------------------------------
  'c-git-add': {
    id: 'c-git-add',
    command: 'git add',
    title: 'git add',
    topicId: 'topic-02',
    topicNumber: '02',
    topicTitle: 'Git Commands',
    subtitle: 'Add file contents to the staging area to prepare the next commit snapshot.',
    badges: ['Beginner', 'Essential', 'Staging'],
    quote: 'Choose what goes into your next save point.',
    difficulty: 'Beginner',

    whatIsIt: 'Updates the index using the current content found in the working tree, to prepare the content staged for the next commit.',
    inSimpleWords: 'It puts the files you choose into a packing box so Git knows what to include in your next snapshot.',
    whyDoYouNeedIt: 'You often edit 5 files at once, but only 2 belong to the current logical feature. git add lets you craft precise, atomic commits.',
    realWorldAnalogy: 'Like packing a shipping box: you pick and choose which items go inside before taping it shut.',

    syntaxCode: 'git add <file-path>',
    syntaxTokens: [
      { token: 'git', role: 'The Git tool', explanation: 'The command-line program that manages your version history.' },
      { token: 'add', role: 'Stage file contents', explanation: 'Tells Git to read the file, create a blob object, and update the staging index.' },
      { token: '<file-path>', role: 'Target file or pattern', explanation: 'The specific file or glob path you want to add (e.g. index.html or src/).' },
    ],

    actionStage: {
      before: {
        label: 'Before Add',
        description: 'You edited app.js. It exists in your working directory, but the staging area is empty.',
        workingDirectory: [{ name: 'app.js', status: 'modified' }],
        stagingArea: [],
        commandPill: 'git add app.js',
        historyCommits: [{ hash: 'C1', message: 'Initial commit' }],
        whatChanged: ['Nothing yet.'],
        whatDidNotChange: ['Staging area is still empty.'],
      },
      running: {
        label: 'Staging in Progress',
        description: 'Git hashes the contents of app.js into a blob object in .git/objects and updates .git/index.',
        workingDirectory: [{ name: 'app.js', status: 'staged' }],
        stagingArea: [{ name: 'app.js', status: 'staged' }],
        commandPill: '📦 Hashing blob & updating index...',
        historyCommits: [{ hash: 'C1', message: 'Initial commit' }],
        whatChanged: ['Blob stored in .git/objects.', 'File pointer recorded in staging index.'],
        whatDidNotChange: ['No commit has been created yet.'],
      },
      after: {
        label: 'After Add',
        description: 'app.js is now staged in the staging area and ready for git commit.',
        workingDirectory: [{ name: 'app.js', status: 'staged' }],
        stagingArea: [{ name: 'app.js', status: 'staged' }],
        commandPill: 'git add (Staged)',
        historyCommits: [{ hash: 'C1', message: 'Initial commit' }],
        whatChanged: ['app.js changes are staged in the index.'],
        whatDidNotChange: ['No commit has been created. History has not advanced.'],
      },
    },

    variations: [
      {
        title: 'Stage specific file',
        syntax: 'git add <file>',
        whatItDoes: 'Stages only the specified file, leaving all other modifications unstaged.',
        whenToUse: 'Whenever you want clean, atomic commits.',
        example: 'git add src/Button.tsx',
      },
      {
        title: 'Stage all changes',
        syntax: 'git add -A',
        whatItDoes: 'Stages all modifications, new untracked files, and deletions across the entire repository.',
        whenToUse: 'When all current edits represent one complete task.',
        warning: 'Careful: may accidentally stage secret files like .env.',
        example: 'git add -A',
      },
      {
        title: 'Interactive patch staging',
        syntax: 'git add -p',
        whatItDoes: 'Prompts you hunk-by-hunk, allowing you to stage parts of a file while leaving others unstaged.',
        whenToUse: 'When one file contains two different logical changes.',
        example: 'git add -p src/app.js',
      },
    ],

    scenarios: [
      {
        id: 'sc-selective-add',
        title: 'Selective staging',
        context: 'You edited both `header.css` and a temporary test file `scratch.txt`.',
        question: 'How do you prepare only the CSS file for commit?',
        options: [
          {
            label: 'Run git add header.css',
            command: 'git add header.css',
            isCorrect: true,
            explanation: 'Correct! Only header.css is staged. scratch.txt remains untracked in your working tree.',
          },
          {
            label: 'Run git add .',
            command: 'git add .',
            isCorrect: false,
            explanation: 'git add . stages everything in the directory including scratch.txt.',
          },
        ],
      },
    ],

    commandComparisons: [
      {
        commandA: 'git add',
        commandB: 'git commit',
        aspect: 'Function in Two-Step Pipeline',
        descriptionA: 'Prepares what goes into the snapshot (staging).',
        descriptionB: 'Permanently records the snapshot in the database.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Modifying a file after running `git add` and wondering why changes are missing in the commit',
        whyItHappens: '`git add` takes a snapshot of the file at the exact moment you run it. Subsequent edits remain unstaged!',
        fix: 'Run `git add` again after making further edits before committing.',
      },
    ],

    sandbox: {
      initialCommands: [
        'git init',
        'echo "body { color: red; }" > style.css',
      ],
      guidedSteps: [
        { instruction: 'Stage the stylesheet', command: 'git add style.css', hint: 'Type git add style.css' },
        { instruction: 'Verify staging', command: 'git status', hint: 'Type git status' },
      ],
    },

    challenge: {
      title: 'Stage Only CSS Files',
      objective: 'Stage `style.css` without staging `notes.txt`.',
      seedCommands: ['git init', 'echo "css" > style.css', 'echo "notes" > notes.txt'],
      initialFiles: { 'style.css': 'css', 'notes.txt': 'notes' },
      expectedCommands: ['git add style.css'],
      hints: ['Run `git add style.css` explicitly.'],
      solutionExplanation: 'Targeting specific files ensures your commit history remains laser-focused.',
      safeFailure: {
        mistakeTitle: 'Staging all files by reflex',
        mistakeCommand: 'git add .',
        whatHappened: 'notes.txt was staged along with style.css.',
        whatWasNotLost: 'Files are safe; you can unstage notes.txt.',
        recoveryCommand: 'git restore --staged notes.txt',
        recoveryExplanation: 'Removes notes.txt from the staging area.',
      },
    },

    reference: {
      synopsis: 'git add [--verbose | -v] [--dry-run | -n] [--patch | -p] [--all | -A] [--] [<pathspec>...]',
      options: [
        { flag: '-A, --all', description: 'Update the index not only where the working tree has a file matching <pathspec> but also where the index already has an entry.' },
        { flag: '-p, --patch', description: 'Interactively choose hunks of patch between the index and the work tree.' },
        { flag: '-u, --update', description: 'Update the index just where it already has an entry matching <pathspec>. Untracked files are ignored.' },
      ],
      gitInternals: {
        objectType: 'Blob Object',
        explanation: '`git add` reads the file content, compresses it with zlib, hashes it to generate a 40-char SHA-1 blob, writes it into `.git/objects`, and points to it in `.git/index`.',
        storageLocation: '.git/index and .git/objects',
      },
      edgeCases: ['Ignored files: Files in `.gitignore` are rejected by `git add` unless forced with `-f` (`--force`).'],
    },
  },

  // --------------------------------------------------------------------------
  // GIT DIFF
  // --------------------------------------------------------------------------
  'c-git-diff': {
    id: 'c-git-diff',
    command: 'git diff',
    title: 'git diff',
    topicId: 'topic-02',
    topicNumber: '02',
    topicTitle: 'Git Commands',
    subtitle: 'Show changes between commits, commit and working tree, or staging index.',
    badges: ['Beginner', 'Essential', 'Inspection'],
    quote: 'See exactly what changed line by line.',
    difficulty: 'Beginner',

    whatIsIt: 'Show changes between the working tree and the index or a tree, changes between the index and a tree, changes between two trees, changes resulting from a merge, or changes between two blob objects.',
    inSimpleWords: 'It shows you a colored line-by-line comparison of additions (green +) and deletions (red -).',
    whyDoYouNeedIt: 'You should never stage code blindly. git diff lets you review every single line of code you wrote before packing it into history.',
    realWorldAnalogy: 'Like "Track Changes" in Microsoft Word or Google Docs, showing exact crossed-out and inserted text.',

    syntaxCode: 'git diff',
    syntaxTokens: [
      { token: 'git', role: 'The Git tool', explanation: 'The command-line program that manages your version history.' },
      { token: 'diff', role: 'Compute line delta', explanation: 'Compares working tree or index content against reference trees.' },
    ],

    actionStage: {
      before: {
        label: 'Before Diff',
        description: 'You changed line 12 of server.js from port 3000 to port 8080.',
        workingDirectory: [{ name: 'server.js', status: 'modified' }],
        stagingArea: [],
        commandPill: 'git diff',
        historyCommits: [{ hash: 'C1', message: 'Initial commit' }],
        whatChanged: ['None (Read-only query).'],
        whatDidNotChange: ['Zero files or commits are altered.'],
      },
      running: {
        label: 'Computing Delta',
        description: 'Git uses Myers diff algorithm to calculate the minimal line edits between the index and working tree.',
        workingDirectory: [{ name: 'server.js', status: 'modified' }],
        stagingArea: [],
        commandPill: '⚡ - const PORT = 3000;\n⚡ + const PORT = 8080;',
        historyCommits: [{ hash: 'C1', message: 'Initial commit' }],
        whatChanged: ['Diff output rendered to terminal.'],
        whatDidNotChange: ['Files remain intact.'],
      },
      after: {
        label: 'After Diff',
        description: 'You reviewed the exact delta and verified port 8080 is the only modification made.',
        workingDirectory: [{ name: 'server.js', status: 'modified' }],
        stagingArea: [],
        commandPill: 'git diff (Reviewed)',
        historyCommits: [{ hash: 'C1', message: 'Initial commit' }],
        whatChanged: ['You have verified the exact modifications.'],
        whatDidNotChange: ['No commits or index changes occurred.'],
      },
    },

    variations: [
      {
        title: 'Unstaged differences',
        syntax: 'git diff',
        whatItDoes: 'Shows differences between your working directory and the staging area.',
        whenToUse: 'Before running git add.',
        example: 'git diff',
      },
      {
        title: 'Staged differences',
        syntax: 'git diff --staged',
        whatItDoes: 'Shows differences between the staging area and the last commit (HEAD).',
        whenToUse: 'Before running git commit to verify what will go into the snapshot.',
        example: 'git diff --staged',
      },
      {
        title: 'Diff between commits',
        syntax: 'git diff <commit1> <commit2>',
        whatItDoes: 'Shows changes across two commit snapshots or branches.',
        whenToUse: 'Comparing feature branch against main.',
        example: 'git diff main feature-login',
      },
    ],

    scenarios: [
      {
        id: 'sc-diff-staged',
        title: 'Verify staged changes',
        context: 'You ran git add, but now `git diff` shows nothing on screen!',
        question: 'Why did git diff show nothing, and how do you view your staged changes?',
        options: [
          {
            label: 'Run git diff --staged (or --cached)',
            command: 'git diff --staged',
            isCorrect: true,
            explanation: 'Plain `git diff` only inspects unstaged changes. Once staged, use `git diff --staged` to view the delta against HEAD.',
          },
          {
            label: 'The files were lost; re-edit them',
            command: 'No command',
            isCorrect: false,
            explanation: 'Your changes were not lost! They are safely staged in the index.',
          },
        ],
      },
    ],

    commandComparisons: [
      {
        commandA: 'git diff',
        commandB: 'git diff --staged',
        aspect: 'Comparison Target',
        descriptionA: 'Working Tree vs Staging Index (What you haven\'t staged yet).',
        descriptionB: 'Staging Index vs HEAD Commit (What you are about to commit).',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Assuming `git diff` shows untracked files',
        whyItHappens: 'Git diff only tracks files already known to Git. Brand new files show up under `git status`, not `git diff`.',
        fix: 'Stage the new file with `git add -N <file>` if you want it to appear in diffs.',
      },
    ],

    sandbox: {
      initialCommands: [
        'git init',
        'echo "const port = 3000;" > server.js',
        'git add server.js',
        'git commit -m "init"',
        'echo "const port = 8080;" > server.js',
      ],
      guidedSteps: [
        { instruction: 'Inspect line differences', command: 'git diff', hint: 'Type git diff' },
      ],
    },

    challenge: {
      title: 'Inspect Staged vs Unstaged Code',
      objective: 'Run the correct diff command to view changes that have already been staged.',
      seedCommands: [
        'git init',
        'echo "v1" > app.js',
        'git add app.js',
        'git commit -m "v1"',
        'echo "v2" > app.js',
        'git add app.js',
      ],
      initialFiles: { 'app.js': 'v2' },
      expectedCommands: ['git diff --staged'],
      hints: ['Remember that app.js is already staged in the index.'],
      solutionExplanation: 'git diff --staged compares the index against HEAD.',
      safeFailure: {
        mistakeTitle: 'Running plain git diff',
        mistakeCommand: 'git diff',
        whatHappened: 'Outputs nothing because working tree matches the index.',
        whatWasNotLost: 'Nothing lost.',
        recoveryCommand: 'git diff --staged',
        recoveryExplanation: 'View the staged delta.',
      },
    },

    reference: {
      synopsis: 'git diff [<options>] [<commit>] [--] [<path>...]',
      options: [
        { flag: '--staged, --cached', description: 'View the changes staged for the next commit relative to HEAD.' },
        { flag: '--stat', description: 'Generate a condensed diffstat showing files changed, insertions, and deletions.' },
        { flag: '-w, --ignore-all-space', description: 'Ignore whitespace when comparing lines.' },
      ],
      gitInternals: {
        objectType: 'Delta calculation',
        explanation: 'Generates unified diff format headers (e.g. `@@ -1,3 +1,4 @@`) comparing blob contents.',
        storageLocation: 'Ephemeral terminal output',
      },
      edgeCases: ['Binary files: Git diff skips binary files unless `--text` is supplied.'],
    },
  },

  // --------------------------------------------------------------------------
  // GIT RESTORE --STAGED
  // --------------------------------------------------------------------------
  'c-git-restore-staged': {
    id: 'c-git-restore-staged',
    command: 'git restore --staged',
    title: 'git restore --staged',
    topicId: 'topic-02',
    topicNumber: '02',
    topicTitle: 'Git Commands',
    subtitle: 'Safely unstage a file from the staging area without losing your edits.',
    badges: ['Beginner', 'Essential', 'Safety Net'],
    quote: 'Take something out of the box without throwing it away.',
    difficulty: 'Beginner',

    whatIsIt: 'Restores the contents of the staging area (the index) from HEAD, effectively unstaging changes while leaving your working tree files completely untouched.',
    inSimpleWords: 'It un-stages a file you accidentally added, leaving all your code safe on your disk.',
    whyDoYouNeedIt: 'We all accidentally type `git add .` and stage an API key, `.env` file, or half-finished code. This command safely rescues you without destroying anything.',
    realWorldAnalogy: 'Taking an item out of your shopping cart and placing it back on your counter before paying.',

    syntaxCode: 'git restore --staged <file-path>',
    syntaxTokens: [
      { token: 'git', role: 'The Git tool', explanation: 'The command-line program that manages your version history.' },
      { token: 'restore', role: 'Restore file state', explanation: 'The modern Git command for copying file states from HEAD or index.' },
      { token: '--staged', role: 'Target the staging area', explanation: 'Explicitly specifies that only the index is modified; working tree files are untouched.' },
      { token: '<file-path>', role: 'File to unstage', explanation: 'The target file path you want to remove from the staging area.' },
    ],

    actionStage: {
      before: {
        label: 'Before Restore',
        description: 'You accidentally ran git add .env. The secret API key is sitting in the staging area.',
        workingDirectory: [{ name: '.env', status: 'staged' }],
        stagingArea: [{ name: '.env', status: 'staged' }],
        commandPill: 'git restore --staged .env',
        historyCommits: [{ hash: 'C1', message: 'Initial commit' }],
        whatChanged: ['None yet.'],
        whatDidNotChange: ['.env is currently still staged in the index.'],
      },
      running: {
        label: 'Unstaging',
        description: 'Git copies the HEAD state of .env into the index, un-staging it.',
        workingDirectory: [{ name: '.env', status: 'modified' }],
        stagingArea: [],
        commandPill: '🛡️ Removing from index...',
        historyCommits: [{ hash: 'C1', message: 'Initial commit' }],
        whatChanged: ['.env removed from staging area.'],
        whatDidNotChange: ['Your working directory file .env was NEVER touched or deleted!'],
      },
      after: {
        label: 'After Restore',
        description: 'The secret .env file is safely back in unstaged working directory state.',
        workingDirectory: [{ name: '.env', status: 'modified' }],
        stagingArea: [],
        commandPill: 'git restore --staged (Safe)',
        historyCommits: [{ hash: 'C1', message: 'Initial commit' }],
        whatChanged: ['.env is no longer staged.'],
        whatDidNotChange: ['Your file content on disk is 100% intact. Zero lines were deleted.'],
      },
    },

    variations: [
      {
        title: 'Unstage specific file',
        syntax: 'git restore --staged <file>',
        whatItDoes: 'Unstages only the designated file from the index.',
        whenToUse: 'When you ran git add on the wrong file.',
        example: 'git restore --staged config/credentials.json',
      },
      {
        title: 'Unstage all files',
        syntax: 'git restore --staged .',
        whatItDoes: 'Clears the entire staging area back to match HEAD.',
        whenToUse: 'When you want to reset your staging decisions and start fresh.',
        example: 'git restore --staged .',
      },
      {
        title: 'Discard working tree edits (DANGER)',
        syntax: 'git restore <file>',
        whatItDoes: 'WITHOUT `--staged`, this replaces your working tree file with the index version, permanently deleting unstaged edits!',
        whenToUse: 'Only when you want to throw away local experimental edits.',
        warning: 'Irreversible data loss if uncommitted!',
        example: 'git restore index.html',
      },
    ],

    scenarios: [
      {
        id: 'sc-secret-staged',
        title: 'Accidentally staged sensitive credentials',
        context: 'You typed `git add .` and noticed `.env` is listed under "Changes to be committed".',
        question: 'How do you remove `.env` from staging without deleting the file from your computer?',
        options: [
          {
            label: 'Run git restore --staged .env',
            command: 'git restore --staged .env',
            isCorrect: true,
            explanation: 'Correct! The file is unstaged immediately, and your API credentials remain on your disk.',
          },
          {
            label: 'Run rm .env',
            command: 'rm .env',
            isCorrect: false,
            explanation: 'rm deletes the file from your computer completely!',
          },
        ],
      },
    ],

    commandComparisons: [
      {
        commandA: 'git restore --staged <file>',
        commandB: 'git restore <file>',
        aspect: 'Risk of Data Loss',
        descriptionA: 'SAFE: Only affects the staging area. Working file is completely untouched.',
        descriptionB: 'DESTRUCTIVE: Overwrites your working file with index state. Uncommitted edits are permanently lost!',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Forgetting `--staged` and running `git restore <file>` by accident',
        whyItHappens: 'Thinking `git restore` automatically means unstage.',
        fix: 'Always double-check: `--staged` touches the index. Without `--staged` it discards disk changes.',
      },
    ],

    sandbox: {
      initialCommands: [
        'git init',
        'echo "SECRET=12345" > .env',
        'git add .env',
      ],
      guidedSteps: [
        { instruction: 'See that .env is staged (in green)', command: 'git status', hint: 'Type git status' },
        { instruction: 'Safely unstage .env', command: 'git restore --staged .env', hint: 'Type git restore --staged .env' },
        { instruction: 'Verify .env is now untracked/unstaged (in red)', command: 'git status', hint: 'Type git status' },
      ],
    },

    challenge: {
      title: 'Rescue Staged Secrets',
      objective: 'Unstage `.env` without losing its contents, then commit `readme.md`.',
      seedCommands: [
        'git init',
        'echo "doc" > readme.md',
        'echo "SECRET" > .env',
        'git add readme.md .env',
      ],
      initialFiles: { 'readme.md': 'doc', '.env': 'SECRET' },
      expectedCommands: [
        'git restore --staged .env',
        'git commit -m "docs: add readme"',
      ],
      hints: [
        'Run `git restore --staged .env` first.',
        'Then commit with `git commit -m "docs: add readme"`.',
      ],
      solutionExplanation: 'Separating sensitive configuration from deployable code is a required daily discipline.',
      safeFailure: {
        mistakeTitle: 'Accidental commit of secrets',
        mistakeCommand: 'git commit -m "all"',
        whatHappened: 'Secret is now in git history.',
        whatWasNotLost: 'Nothing lost, but secret was committed.',
        recoveryCommand: 'git reset --soft HEAD~1 && git restore --staged .env',
        recoveryExplanation: 'Rewind the commit and unstage the secret.',
      },
    },

    reference: {
      synopsis: 'git restore [--source=<tree>] [--staged] [--worktree] [--] <pathspec>...',
      options: [
        { flag: '-S, --staged', description: 'Restore the index (unstage changes).' },
        { flag: '-W, --worktree', description: 'Restore the working tree.' },
        { flag: '-s, --source=<tree>', description: 'Restore the working tree files with the content from the given tree (defaults to HEAD if --staged, or index otherwise).' },
      ],
      gitInternals: {
        objectType: 'Index pointer update',
        explanation: 'Replaces the SHA recorded in `.git/index` for the specified path with the SHA recorded in HEAD tree.',
        storageLocation: '.git/index',
      },
      edgeCases: ['Legacy synonym: `git reset HEAD <file>` achieves the exact same unstaging effect in older Git versions (< 2.23).'],
    },
  },
};

// ============================================================================
// ALL 18 TOPICS BESPOKE CONCEPTS REGISTRY
// ============================================================================
import { TOPIC_01_CONCEPTS } from './academyTopics/topic01_basics';
import { TOPIC_03_CONCEPTS } from './academyTopics/topic03_branching';
import { TOPIC_04_CONCEPTS } from './academyTopics/topic04_collaboration';
import { TOPIC_05_06_CONCEPTS } from './academyTopics/topic05_06_github';
import { TOPIC_07_08_CONCEPTS } from './academyTopics/topic07_08_merges_practices';
import { TOPIC_09_10_CONCEPTS } from './academyTopics/topic09_10_teams_projects';
import { TOPIC_11_12_CONCEPTS } from './academyTopics/topic11_12_intermediate_tags';
import { TOPIC_13_14_CONCEPTS } from './academyTopics/topic13_14_hooks_submodules';
import { TOPIC_15_16_CONCEPTS } from './academyTopics/topic15_16_actions_advanced';
import { TOPIC_17_18_CONCEPTS } from './academyTopics/topic17_18_devtools_features';
import { ALL_PRACTICE_CHALLENGES } from './academyChallenges';
import { ALL_CONCEPT_REFERENCES } from './academyReferences';

const RAW_ALL_ACADEMY_CONCEPTS: Record<string, UniversalConcept> = {
  ...BESPOKE_CONCEPTS,
  ...TOPIC_01_CONCEPTS,
  ...TOPIC_03_CONCEPTS,
  ...TOPIC_04_CONCEPTS,
  ...TOPIC_05_06_CONCEPTS,
  ...TOPIC_07_08_CONCEPTS,
  ...TOPIC_09_10_CONCEPTS,
  ...TOPIC_11_12_CONCEPTS,
  ...TOPIC_13_14_CONCEPTS,
  ...TOPIC_15_16_CONCEPTS,
  ...TOPIC_17_18_CONCEPTS,
};

// Merge in all practice challenges and references for 100% complete coverage across all 18 topics
export const ALL_ACADEMY_CONCEPTS: Record<string, UniversalConcept> = Object.fromEntries(
  Object.entries(RAW_ALL_ACADEMY_CONCEPTS).map(([id, concept]) => {
    let updatedConcept = concept;
    if (ALL_PRACTICE_CHALLENGES[id]) {
      updatedConcept = {
        ...updatedConcept,
        challenge: {
          ...updatedConcept.challenge,
          ...ALL_PRACTICE_CHALLENGES[id],
        },
      };
    }
    const refSupplement = ALL_CONCEPT_REFERENCES[id];
    if (refSupplement) {
      updatedConcept = {
        ...updatedConcept,
        reference: {
          ...updatedConcept.reference,
          ...refSupplement,
          options: refSupplement.options && refSupplement.options.length > 0 ? refSupplement.options : (updatedConcept.reference?.options || []),
          syntaxCheatSheet: refSupplement.syntaxCheatSheet && refSupplement.syntaxCheatSheet.length > 0 ? refSupplement.syntaxCheatSheet : (updatedConcept.reference?.syntaxCheatSheet || []),
          commonErrors: refSupplement.commonErrors && refSupplement.commonErrors.length > 0 ? refSupplement.commonErrors : (updatedConcept.reference?.commonErrors || []),
          edgeCases: refSupplement.edgeCases && refSupplement.edgeCases.length > 0 ? refSupplement.edgeCases : (updatedConcept.reference?.edgeCases || []),
          gitInternals: refSupplement.gitInternals || updatedConcept.reference?.gitInternals,
        },
      };
    }
    return [id, updatedConcept];
  })
);

// Returns bespoke concept data across all 18 topics
export function getUniversalConcept(conceptId: string): UniversalConcept {
  if (ALL_ACADEMY_CONCEPTS[conceptId]) {
    return ALL_ACADEMY_CONCEPTS[conceptId];
  }

  // Find concept in syllabus
  for (const topic of ACADEMY_18_TOPICS) {
    const found = topic.concepts.find((c) => c.id === conceptId);
    if (found) {
      return {
        id: found.id,
        command: found.command,
        title: found.title,
        topicId: topic.id,
        topicNumber: topic.number,
        topicTitle: topic.title,
        subtitle: found.shortDesc,
        badges: [found.difficulty, 'Core Concept', 'Git'],
        quote: `Mastering ${found.title} is essential for reliable Git workflows.`,
        difficulty: found.difficulty,

        whatIsIt: `${found.title} is a core Git mechanism used in ${topic.title}.`,
        inSimpleWords: `It helps you manage ${found.shortDesc.toLowerCase()} in your project.`,
        whyDoYouNeedIt: `Without ${found.title}, collaborating and version tracking become error-prone and chaotic.`,
        realWorldAnalogy: `Think of it like an organized filing cabinet milestone in your developer toolkit.`,

        syntaxCode: found.command.startsWith('git') ? `${found.command} [options]` : `git ${found.command}`,
        syntaxTokens: [
          { token: 'git', role: 'The Git tool', explanation: 'The version control executable binary.' },
          { token: found.command.replace('git ', ''), role: 'Command Action', explanation: found.shortDesc },
        ],

        actionStage: {
          before: {
            label: 'Initial State',
            description: `Ready to execute ${found.command}.`,
            workingDirectory: [{ name: 'project-file.js', status: 'modified' }],
            stagingArea: [],
            commandPill: found.command,
            historyCommits: [{ hash: 'C1', message: 'Initial commit' }],
            whatChanged: ['No change yet.'],
            whatDidNotChange: ['Repository state remains untouched.'],
          },
          running: {
            label: 'Executing Command',
            description: `Git is executing ${found.command}...`,
            workingDirectory: [{ name: 'project-file.js', status: 'modified' }],
            stagingArea: [],
            commandPill: `⚡ ${found.command}`,
            historyCommits: [{ hash: 'C1', message: 'Initial commit' }],
            whatChanged: ['State updated.'],
            whatDidNotChange: ['Remote history unchanged.'],
          },
          after: {
            label: 'Completed State',
            description: `Operation completed for ${found.title}.`,
            workingDirectory: [{ name: 'project-file.js', status: 'committed' }],
            stagingArea: [],
            commandPill: `${found.command} (Done)`,
            historyCommits: [{ hash: 'C1', message: 'Initial commit' }],
            whatChanged: [`${found.title} state applied.`],
            whatDidNotChange: ['Remote repository is not updated until push.'],
          },
        },

        variations: [
          {
            title: `Standard ${found.title}`,
            syntax: found.command,
            whatItDoes: found.shortDesc,
            whenToUse: `Use when you need to perform standard ${found.title} actions.`,
            example: found.command,
          },
        ],

        scenarios: [
          {
            id: `sc-${found.id}`,
            title: `When to use ${found.title}`,
            context: `You are working in ${topic.title} and need to apply ${found.shortDesc}.`,
            question: `Which command should you execute?`,
            options: [
              {
                label: `Run ${found.command}`,
                command: found.command,
                isCorrect: true,
                explanation: `Correct! ${found.command} handles this workflow.`,
              },
            ],
          },
        ],

        commandComparisons: [],
        commonMistakes: [],

        sandbox: {
          initialCommands: ['git init', 'echo "test" > file.txt'],
          guidedSteps: [
            { instruction: `Run ${found.command}`, command: found.command, hint: `Type ${found.command}` },
          ],
        },

        challenge: {
          title: `Practice ${found.title}`,
          objective: `Execute ${found.command} in a clean repository.`,
          seedCommands: ['git init', 'echo "test" > file.txt'],
          initialFiles: { 'file.txt': 'test' },
          expectedCommands: [found.command],
          hints: [`Type ${found.command} in the terminal.`],
          solutionExplanation: `${found.command} applies changes to your repo.`,
          safeFailure: {
            mistakeTitle: 'Incorrect parameters',
            mistakeCommand: `${found.command} --wrong-flag`,
            whatHappened: 'Flag error returned.',
            whatWasNotLost: 'Repository data was not corrupted.',
            recoveryCommand: found.command,
            recoveryExplanation: 'Run without unrecognized flags.',
          },
        },

        reference: {
          synopsis: `${found.command} [<options>]`,
          options: [{ flag: '--help', description: 'Display command usage synopsis.' }],
          gitInternals: {
            objectType: 'Git Reference Object',
            explanation: `Governs internal state under .git/ related to ${found.title}.`,
            storageLocation: '.git/',
          },
          edgeCases: ['Refer to official git documentation for complete flags.'],
        },
      };
    }
  }

  // Fallback to git commit if conceptId not found
  return BESPOKE_CONCEPTS['c-git-commit'];
}

// ============================================================================
// GLOBAL NATURAL-LANGUAGE PROBLEM SOLVER DECISION TREES
// "What are you trying to do?"
// ============================================================================
export interface ProblemDecisionNode {
  question: string;
  options: {
    label: string;
    actionText: string;
    recommendedCommand: string;
    explanation: string;
    targetConceptId: string;
    targetTab: 'Learn' | 'Explore' | 'Visualize' | 'Practice' | 'Reference';
  }[];
}

export interface ProblemSolution {
  id: string;
  problemTitle: string;
  description: string;
  keywords: string[];
  decisionTree?: ProblemDecisionNode;
  directRecommendation?: {
    recommendedCommand: string;
    explanation: string;
    targetConceptId: string;
    targetTab: 'Learn' | 'Explore' | 'Visualize' | 'Practice' | 'Reference';
  };
}

export const GLOBAL_PROBLEM_SOLUTIONS: ProblemSolution[] = [
  {
    id: 'prob-undo-commit',
    problemTitle: 'I want to undo my last commit',
    description: 'You made a commit and need to unwind it or remove it from history.',
    keywords: ['undo commit', 'revert commit', 'reset commit', 'undo last commit', 'cancel commit', 'remove commit'],
    decisionTree: {
      question: 'Has the commit already been pushed to GitHub or a shared remote repository?',
      options: [
        {
          label: 'YES — Already pushed to GitHub / remote',
          actionText: 'Use git revert (Safe for shared history)',
          recommendedCommand: 'git revert HEAD',
          explanation: 'Since the commit is public, resetting it would break your teammates\' histories. git revert safely creates a new commit that inverts the changes.',
          targetConceptId: 'c-git-commit',
          targetTab: 'Explore',
        },
        {
          label: 'NO — Still only on my local computer',
          actionText: 'Use git reset (Clean local rewind)',
          recommendedCommand: 'git reset --soft HEAD~1',
          explanation: '`git reset --soft HEAD~1` removes the commit while keeping all your edited code staged in your working directory, ready for editing.',
          targetConceptId: 'c-git-commit',
          targetTab: 'Practice',
        },
      ],
    },
  },
  {
    id: 'prob-unstage-file',
    problemTitle: 'I accidentally staged a file (e.g. .env or secret)',
    description: 'You ran git add on a file that shouldn\'t be in the commit.',
    keywords: ['unstage', 'unstage file', 'accidentally staged', 'remove from staging', 'staged .env', 'unadd'],
    directRecommendation: {
      recommendedCommand: 'git restore --staged <file-path>',
      explanation: 'Removes the file from the staging area immediately without deleting or modifying your code on disk.',
      targetConceptId: 'c-git-restore-staged',
      targetTab: 'Learn',
    },
  },
  {
    id: 'prob-send-github',
    problemTitle: 'I want to send my code to GitHub',
    description: 'Upload your local commits to a remote repository branch.',
    keywords: ['send to github', 'push to github', 'upload code', 'sync github', 'publish branch', 'git push'],
    directRecommendation: {
      recommendedCommand: 'git push -u origin main',
      explanation: 'Transmits local commits to the remote `main` branch and sets up tracking.',
      targetConceptId: 'c-git-push',
      targetTab: 'Learn',
    },
  },
  {
    id: 'prob-discard-changes',
    problemTitle: 'I want to discard changes in a file',
    description: 'Throw away experimental edits and revert the file back to last commit.',
    keywords: ['discard changes', 'throw away changes', 'revert file', 'undo edits', 'checkout file'],
    decisionTree: {
      question: 'Are the modifications currently staged in the index (ran `git add`)?',
      options: [
        {
          label: 'YES — The changes are already staged',
          actionText: 'Unstage first, then restore',
          recommendedCommand: 'git restore --staged <file> && git restore <file>',
          explanation: 'Unstage the file from the index, then restore the file to match HEAD.',
          targetConceptId: 'c-git-restore-staged',
          targetTab: 'Learn',
        },
        {
          label: 'NO — Edits are only in the working tree',
          actionText: 'Directly restore working tree',
          recommendedCommand: 'git restore <file>',
          explanation: 'Replaces your working tree file with the clean index version.',
          targetConceptId: 'c-git-diff',
          targetTab: 'Explore',
        },
      ],
    },
  },
  {
    id: 'prob-merge-conflict',
    problemTitle: 'I have a merge conflict',
    description: 'Git could not automatically reconcile divergent edits across branches.',
    keywords: ['merge conflict', 'conflict', 'resolve conflict', 'conflict markers', 'both modified'],
    directRecommendation: {
      recommendedCommand: 'git status (Inspect conflicts, open editor, remove <<< markers, then git add)',
      explanation: 'Open the conflicting files, choose the correct lines between `<<<<<<< HEAD` and `>>>>>>>`, then stage and commit.',
      targetConceptId: 'c-merge-conflicts',
      targetTab: 'Explore',
    },
  },
  {
    id: 'prob-lost-commit',
    problemTitle: 'I lost a commit or deleted the wrong branch',
    description: 'You ran hard reset or deleted a branch and need your code back.',
    keywords: ['lost commit', 'lost branch', 'deleted branch', 'recover commit', 'reflog'],
    directRecommendation: {
      recommendedCommand: 'git reflog',
      explanation: 'Git records every movement of HEAD in the reflog. Run `git reflog` to find the lost commit hash, then `git branch rescue <hash>`.',
      targetConceptId: 'c-git-reflog',
      targetTab: 'Learn',
    },
  },
];
