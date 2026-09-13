export type NodeType = 'root' | 'category' | 'topic' | 'subtopic';

export type NodeStatus = 'locked' | 'available' | 'in-progress' | 'learned' | 'mastered';

export type EdgeType = 'prerequisite' | 'contains' | 'related';

export type CurriculumSection = 'foundations' | 'collaboration' | 'advanced' | 'engineering';

export interface RoadmapNode {
  id: string;
  title: string;
  type: NodeType;
  section: CurriculumSection;
  description?: string;
  parentId?: string;
  prerequisites?: string[];
  children?: string[];
  status: NodeStatus;
  commands?: string[];
  bestPractices?: string[];
  pitfalls?: string[];
  lessonNodeId?: string;
  isBeginner?: boolean;
}

export interface RoadmapEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  priority?: number;
}

export interface GraphValidationResult {
  isValid: boolean;
  nodeCount: number;
  edgeCount: number;
  orphanNodes: string[];
  invalidEdges: string[];
  duplicateEdges: string[];
  selfEdges: string[];
}

// ============================================================================
// NORMALIZED CURRICULUM GRAPH
// Structured with 4 major regions and a crystal-clear primary spine:
// VERSION CONTROL -> GIT FOUNDATIONS -> INSPECT -> SAVE -> BRANCH ->
// MERGE -> REMOTE -> GITHUB -> COLLABORATION -> ADVANCED GIT -> GITHUB ENGINEERING
// ============================================================================

export const RAW_ROADMAP_NODES: RoadmapNode[] = [
  // ========================================================================
  // SECTION 1: FOUNDATIONS
  // ========================================================================
  {
    id: 'sec-foundations',
    title: 'Git Foundations',
    type: 'root',
    section: 'foundations',
    description: 'Core concepts of version control, repository mechanics, and working with local files.',
    status: 'mastered',
    isBeginner: true,
  },
  {
    id: 'version-control',
    title: 'Version Control',
    type: 'category',
    section: 'foundations',
    parentId: 'sec-foundations',
    description: 'Fundamental principles of tracking file revisions over time.',
    status: 'mastered',
    isBeginner: true,
    children: ['what-is-vcs', 'why-use-vcs', 'git-vs-other-vcs', 'installing-git-locally'],
  },
  {
    id: 'what-is-vcs',
    title: 'What is VCS?',
    type: 'topic',
    section: 'foundations',
    parentId: 'version-control',
    description: 'A system that records changes to files over time so you can recall specific versions.',
    status: 'mastered',
    isBeginner: true,
    bestPractices: ['Treat version control as an active safety net, not an end-of-day chore.'],
  },
  {
    id: 'why-use-vcs',
    title: 'Why use VCS?',
    type: 'topic',
    section: 'foundations',
    parentId: 'version-control',
    description: 'Enables safe experimentation, transparent team collaboration, and regression recovery.',
    status: 'mastered',
    isBeginner: true,
  },
  {
    id: 'git-vs-other-vcs',
    title: 'Git vs Other VCS',
    type: 'topic',
    section: 'foundations',
    parentId: 'version-control',
    description: 'Distributed architecture vs centralized systems like SVN or Perforce.',
    status: 'mastered',
    isBeginner: true,
  },
  {
    id: 'installing-git-locally',
    title: 'Installing Git',
    type: 'topic',
    section: 'foundations',
    parentId: 'version-control',
    description: 'Installing and verifying Git on macOS, Windows, and Linux.',
    status: 'mastered',
    commands: ['git --version', 'which git'],
    isBeginner: true,
  },

  {
    id: 'git-basics',
    title: 'Git Basics & Config',
    type: 'category',
    section: 'foundations',
    parentId: 'sec-foundations',
    prerequisites: ['version-control'],
    description: 'Repository initialization and developer identity configuration.',
    status: 'mastered',
    isBeginner: true,
    children: ['git-init', 'git-config', 'local-vs-global-config', 'gitignore'],
  },
  {
    id: 'git-init',
    title: 'git init',
    type: 'topic',
    section: 'foundations',
    parentId: 'git-basics',
    description: 'Creates a new Git repository by creating the .git metadata directory.',
    status: 'mastered',
    commands: ['git init', 'git init my-app'],
    isBeginner: true,
  },
  {
    id: 'git-config',
    title: 'git config',
    type: 'topic',
    section: 'foundations',
    parentId: 'git-basics',
    description: 'Configures identity, editor, and core preferences.',
    status: 'mastered',
    commands: ['git config --global user.name "Dev"', 'git config --global user.email "dev@test.com"'],
    isBeginner: true,
  },
  {
    id: 'local-vs-global-config',
    title: 'Local vs Global Config',
    type: 'subtopic',
    section: 'foundations',
    parentId: 'git-config',
    description: 'Global config (~/.gitconfig) vs repository-specific local config (.git/config).',
    status: 'learned',
    isBeginner: true,
  },
  {
    id: 'gitignore',
    title: '.gitignore',
    type: 'topic',
    section: 'foundations',
    parentId: 'git-basics',
    description: 'Specifies intentionally untracked files to ignore from commits.',
    status: 'mastered',
    bestPractices: ['Always ignore node_modules, build artifacts, and secrets like .env.'],
    isBeginner: true,
  },

  {
    id: 'working-tree-staging',
    title: 'Working Tree & Staging',
    type: 'category',
    section: 'foundations',
    parentId: 'sec-foundations',
    prerequisites: ['git-basics'],
    description: 'The two stages of change preparation: your workspace and the index snapshot.',
    status: 'in-progress',
    isBeginner: true,
    children: ['working-directory', 'staging-area', 'git-status', 'git-diff-basic'],
  },
  {
    id: 'working-directory',
    title: 'Working Directory',
    type: 'topic',
    section: 'foundations',
    parentId: 'working-tree-staging',
    description: 'The physical files you edit on disk.',
    status: 'mastered',
    isBeginner: true,
  },
  {
    id: 'staging-area',
    title: 'Staging Area (Index)',
    type: 'topic',
    section: 'foundations',
    parentId: 'working-tree-staging',
    description: 'The staging staging ground where you curate snapshots before committing.',
    status: 'in-progress',
    commands: ['git add <file>', 'git add -A', 'git restore --staged <file>'],
    lessonNodeId: 'l2-git-foundations',
    isBeginner: true,
  },
  {
    id: 'git-status',
    title: 'git status',
    type: 'topic',
    section: 'foundations',
    parentId: 'working-tree-staging',
    description: 'Displays paths that have differences between index and working tree or HEAD.',
    status: 'mastered',
    commands: ['git status', 'git status -s'],
    isBeginner: true,
  },
  {
    id: 'git-diff-basic',
    title: 'git diff (Basic)',
    type: 'subtopic',
    section: 'foundations',
    parentId: 'working-tree-staging',
    description: 'Inspect changes between working tree and index, or staged vs HEAD.',
    status: 'in-progress',
    commands: ['git diff', 'git diff --staged'],
    isBeginner: true,
  },

  {
    id: 'commits-history',
    title: 'Commits & History',
    type: 'category',
    section: 'foundations',
    parentId: 'sec-foundations',
    prerequisites: ['working-tree-staging'],
    description: 'Creating immutable historical snapshots and navigating project lineage.',
    status: 'available',
    isBeginner: true,
    children: ['git-commit', 'commit-messages', 'git-log', 'viewing-commit-history'],
  },
  {
    id: 'git-commit',
    title: 'git commit',
    type: 'topic',
    section: 'foundations',
    parentId: 'commits-history',
    description: 'Records staged changes to the repository as a cryptographically hashed commit.',
    status: 'available',
    commands: ['git commit -m "feat: initial commit"', 'git commit -v'],
    lessonNodeId: 'l2-git-foundations',
    isBeginner: true,
  },
  {
    id: 'commit-messages',
    title: 'Commit Conventions',
    type: 'topic',
    section: 'foundations',
    parentId: 'commits-history',
    description: 'Writing clear, intentional commit messages following Conventional Commits.',
    status: 'available',
    bestPractices: ['Use imperative mood ("fix bug" not "fixed bug"). Keep the first line under 50 chars.'],
    isBeginner: true,
  },
  {
    id: 'git-log',
    title: 'git log',
    type: 'topic',
    section: 'foundations',
    parentId: 'commits-history',
    description: 'Shows the commit logs and ancestry graph.',
    status: 'available',
    commands: ['git log --oneline', 'git log --graph --all'],
    isBeginner: true,
  },
  {
    id: 'viewing-commit-history',
    title: 'History Navigation',
    type: 'subtopic',
    section: 'foundations',
    parentId: 'commits-history',
    description: 'Filtering commits by author, date, message, or file path.',
    status: 'available',
    commands: ['git log -n 5', 'git log --author="Alex"'],
    isBeginner: true,
  },

  // ========================================================================
  // SECTION 2: COLLABORATION
  // ========================================================================
  {
    id: 'sec-collaboration',
    title: 'Collaboration & GitHub',
    type: 'root',
    section: 'collaboration',
    prerequisites: ['commits-history'],
    description: 'Branching, merging, remotes, GitHub workflows, and team collaboration.',
    status: 'available',
    isBeginner: true,
  },
  {
    id: 'branching-mechanics',
    title: 'Branching Basics',
    type: 'category',
    section: 'collaboration',
    parentId: 'sec-collaboration',
    prerequisites: ['commits-history'],
    description: 'Lightweight, movable pointers to commits that enable parallel features.',
    status: 'available',
    isBeginner: true,
    children: ['creating-branch', 'checkout-switch', 'renaming-branch', 'deleting-branch'],
  },
  {
    id: 'creating-branch',
    title: 'Creating Branch',
    type: 'topic',
    section: 'collaboration',
    parentId: 'branching-mechanics',
    description: 'Creating a new line of development with git branch or git switch -c.',
    status: 'available',
    commands: ['git switch -c feature/login', 'git branch feature/login'],
    isBeginner: true,
  },
  {
    id: 'checkout-switch',
    title: 'Switching Branches',
    type: 'topic',
    section: 'collaboration',
    parentId: 'branching-mechanics',
    description: 'Updating working directory files to match the specified branch head.',
    status: 'available',
    commands: ['git switch main', 'git checkout main'],
    isBeginner: true,
  },
  {
    id: 'renaming-branch',
    title: 'Renaming Branch',
    type: 'subtopic',
    section: 'collaboration',
    parentId: 'branching-mechanics',
    description: 'Renaming a local branch safely.',
    status: 'available',
    commands: ['git branch -m old-name new-name'],
    isBeginner: true,
  },
  {
    id: 'deleting-branch',
    title: 'Deleting Branch',
    type: 'subtopic',
    section: 'collaboration',
    parentId: 'branching-mechanics',
    description: 'Removing merged or abandoned branches.',
    status: 'available',
    commands: ['git branch -d feature/done', 'git branch -D feature/abandoned'],
    isBeginner: true,
  },

  {
    id: 'merging-mechanics',
    title: 'Merging & Conflicts',
    type: 'category',
    section: 'collaboration',
    parentId: 'sec-collaboration',
    prerequisites: ['branching-mechanics'],
    description: 'Integrating divergent histories and resolving concurrent file edits.',
    status: 'locked',
    isBeginner: true,
    children: ['merging-basics', 'fast-forward-vs-non-ff', 'handling-conflicts', 'squash-merge'],
  },
  {
    id: 'merging-basics',
    title: 'Merging Basics',
    type: 'topic',
    section: 'collaboration',
    parentId: 'merging-mechanics',
    description: 'Joining two development histories together with git merge.',
    status: 'locked',
    commands: ['git merge feature/branch', 'git merge --no-ff feature/branch'],
    isBeginner: true,
  },
  {
    id: 'fast-forward-vs-non-ff',
    title: 'Fast-Forward vs Merge Commit',
    type: 'subtopic',
    section: 'collaboration',
    parentId: 'merging-mechanics',
    description: 'Direct pointer advancement vs true 3-way merge commits.',
    status: 'locked',
    isBeginner: false,
  },
  {
    id: 'handling-conflicts',
    title: 'Handling Conflicts',
    type: 'topic',
    section: 'collaboration',
    parentId: 'merging-mechanics',
    description: 'Resolving overlapping edits when Git cannot safely decide automatically.',
    status: 'locked',
    commands: ['git status', 'git merge --abort'],
    pitfalls: ['Panicking and deleting the repository when encountering conflict markers.'],
    isBeginner: true,
  },
  {
    id: 'squash-merge',
    title: 'Squash Merging',
    type: 'subtopic',
    section: 'collaboration',
    parentId: 'merging-mechanics',
    description: 'Combining all commits from a feature branch into a single clean commit.',
    status: 'locked',
    commands: ['git merge --squash feature/branch'],
    isBeginner: false,
  },

  {
    id: 'git-remotes-sync',
    title: 'Git Remotes & Sync',
    type: 'category',
    section: 'collaboration',
    parentId: 'sec-collaboration',
    prerequisites: ['merging-mechanics'],
    description: 'Managing remote servers, pushing branches, and pulling team updates.',
    status: 'locked',
    isBeginner: true,
    children: ['cloning-repositories', 'managing-remotes', 'pushing-pulling-changes', 'fetch-without-merge'],
  },
  {
    id: 'cloning-repositories',
    title: 'Cloning Repositories',
    type: 'topic',
    section: 'collaboration',
    parentId: 'git-remotes-sync',
    description: 'Downloading an existing repository, all its branches, and complete history.',
    status: 'locked',
    commands: ['git clone https://github.com/org/repo.git'],
    isBeginner: true,
  },
  {
    id: 'managing-remotes',
    title: 'Managing Remotes',
    type: 'topic',
    section: 'collaboration',
    parentId: 'git-remotes-sync',
    description: 'Inspecting, adding, and modifying remote tracking connections.',
    status: 'locked',
    commands: ['git remote -v', 'git remote add origin <url>'],
    isBeginner: true,
  },
  {
    id: 'pushing-pulling-changes',
    title: 'Push & Pull',
    type: 'topic',
    section: 'collaboration',
    parentId: 'git-remotes-sync',
    description: 'Publishing local commits to remote and integrating incoming team commits.',
    status: 'locked',
    commands: ['git push -u origin main', 'git pull origin main'],
    isBeginner: true,
  },
  {
    id: 'fetch-without-merge',
    title: 'Fetch without Merge',
    type: 'subtopic',
    section: 'collaboration',
    parentId: 'git-remotes-sync',
    description: 'Inspecting remote branches before deciding to integrate them into local work.',
    status: 'locked',
    commands: ['git fetch origin', 'git diff main origin/main'],
    isBeginner: true,
  },

  {
    id: 'github-essentials-cat',
    title: 'GitHub Essentials',
    type: 'category',
    section: 'collaboration',
    parentId: 'sec-collaboration',
    prerequisites: ['git-remotes-sync'],
    description: 'Cloud hosting, profile setup, and collaborative repo governance.',
    status: 'locked',
    isBeginner: true,
    children: ['creating-account', 'github-interface', 'profile-readme', 'private-vs-public'],
  },
  {
    id: 'creating-account',
    title: 'Account & SSH Keys',
    type: 'topic',
    section: 'collaboration',
    parentId: 'github-essentials-cat',
    description: 'Authenticating securely with SSH keys and Personal Access Tokens.',
    status: 'locked',
    commands: ['ssh-keygen -t ed25519', 'ssh -T git@github.com'],
    isBeginner: true,
  },
  {
    id: 'github-interface',
    title: 'GitHub Interface',
    type: 'topic',
    section: 'collaboration',
    parentId: 'github-essentials-cat',
    description: 'Navigating repos, commit trees, releases, and issue trackers.',
    status: 'locked',
    isBeginner: true,
  },
  {
    id: 'profile-readme',
    title: 'Profile README',
    type: 'subtopic',
    section: 'collaboration',
    parentId: 'github-essentials-cat',
    description: 'Customizing your GitHub developer profile markdown.',
    status: 'locked',
    isBeginner: true,
  },
  {
    id: 'private-vs-public',
    title: 'Private vs Public',
    type: 'subtopic',
    section: 'collaboration',
    parentId: 'github-essentials-cat',
    description: 'Managing visibility, licensing, and repository access permissions.',
    status: 'locked',
    isBeginner: true,
  },

  {
    id: 'pr-collaboration-workflow',
    title: 'Pull Requests & Reviews',
    type: 'category',
    section: 'collaboration',
    parentId: 'sec-collaboration',
    prerequisites: ['github-essentials-cat'],
    description: 'Peer code reviews, fork workflows, issue tracking, and discussions.',
    status: 'locked',
    isBeginner: true,
    children: ['forking-vs-cloning', 'issues-tracking', 'pull-requests', 'pr-from-fork', 'code-reviews'],
  },
  {
    id: 'forking-vs-cloning',
    title: 'Forking vs Cloning',
    type: 'topic',
    section: 'collaboration',
    parentId: 'pr-collaboration-workflow',
    description: 'Server-side fork copy for open-source contributions vs direct clone.',
    status: 'locked',
    isBeginner: true,
  },
  {
    id: 'issues-tracking',
    title: 'Issues & Milestones',
    type: 'topic',
    section: 'collaboration',
    parentId: 'pr-collaboration-workflow',
    description: 'Tracking bugs, features, tasks, and linking them to pull requests.',
    status: 'locked',
    isBeginner: true,
  },
  {
    id: 'pull-requests',
    title: 'Pull Requests',
    type: 'topic',
    section: 'collaboration',
    parentId: 'pr-collaboration-workflow',
    description: 'Proposing changes, triggering automated CI checks, and initiating discussion.',
    status: 'locked',
    isBeginner: true,
  },
  {
    id: 'pr-from-fork',
    title: 'PR from a Fork',
    type: 'subtopic',
    section: 'collaboration',
    parentId: 'pr-collaboration-workflow',
    description: 'Upstream synchronization and cross-repository pull requests.',
    status: 'locked',
    isBeginner: true,
  },
  {
    id: 'code-reviews',
    title: 'Code Reviews',
    type: 'topic',
    section: 'collaboration',
    parentId: 'pr-collaboration-workflow',
    description: 'Reviewing diffs, suggesting line changes, approving, and requesting updates.',
    status: 'locked',
    isBeginner: true,
  },

  // ========================================================================
  // SECTION 3: ADVANCED GIT
  // ========================================================================
  {
    id: 'sec-advanced',
    title: 'Advanced Git',
    type: 'root',
    section: 'advanced',
    prerequisites: ['pr-collaboration-workflow'],
    description: 'History rewriting, emergency recovery, stashing, submodules, and internals.',
    status: 'locked',
    isBeginner: false,
  },
  {
    id: 'git-stash-cat',
    title: 'Git Stash',
    type: 'category',
    section: 'advanced',
    parentId: 'sec-advanced',
    prerequisites: ['pr-collaboration-workflow'],
    description: 'Shelving uncommitted working directory changes to work on something else.',
    status: 'locked',
    isBeginner: false,
    children: ['git-stash-basics', 'stash-pop-apply', 'stash-branch'],
  },
  {
    id: 'git-stash-basics',
    title: 'git stash',
    type: 'topic',
    section: 'advanced',
    parentId: 'git-stash-cat',
    description: 'Saves uncommitted modifications away and resets working tree to HEAD.',
    status: 'locked',
    commands: ['git stash', 'git stash save "work in progress"'],
    isBeginner: false,
  },
  {
    id: 'stash-pop-apply',
    title: 'Stash Pop & Apply',
    type: 'subtopic',
    section: 'advanced',
    parentId: 'git-stash-cat',
    description: 'Restoring stashed changes with pop (removes from list) or apply (retains).',
    status: 'locked',
    commands: ['git stash pop', 'git stash apply', 'git stash list'],
    isBeginner: false,
  },
  {
    id: 'stash-branch',
    title: 'Stash to Branch',
    type: 'subtopic',
    section: 'advanced',
    parentId: 'git-stash-cat',
    description: 'Creating a new branch directly from a stash when conflicts would occur.',
    status: 'locked',
    commands: ['git stash branch new-feature stash@{0}'],
    isBeginner: false,
  },

  {
    id: 'undoing-history-cat',
    title: 'Undoing Changes & Reset',
    type: 'category',
    section: 'advanced',
    parentId: 'sec-advanced',
    prerequisites: ['git-stash-cat'],
    description: 'Reverting commits safely and resetting the working tree, index, or HEAD.',
    status: 'locked',
    isBeginner: false,
    children: ['git-revert', 'git-reset', 'reset-soft', 'reset-hard', 'reset-mixed'],
  },
  {
    id: 'git-revert',
    title: 'git revert',
    type: 'topic',
    section: 'advanced',
    parentId: 'undoing-history-cat',
    description: 'Creates a new inverse commit that neutralizes changes without rewriting history.',
    status: 'locked',
    commands: ['git revert <commit-hash>', 'git revert HEAD'],
    bestPractices: ['Always use git revert for shared public branches.'],
    isBeginner: false,
  },
  {
    id: 'git-reset',
    title: 'git reset',
    type: 'topic',
    section: 'advanced',
    parentId: 'undoing-history-cat',
    description: 'Moves current HEAD pointer back to a specified commit.',
    status: 'locked',
    commands: ['git reset --soft HEAD~1', 'git reset --hard origin/main'],
    pitfalls: ['git reset --hard destroys uncommitted changes on your filesystem with no undo.'],
    isBeginner: false,
  },
  {
    id: 'reset-soft',
    title: 'Reset --soft',
    type: 'subtopic',
    section: 'advanced',
    parentId: 'undoing-history-cat',
    description: 'Moves HEAD; keeps changes staged in the index ready for a new commit.',
    status: 'locked',
    isBeginner: false,
  },
  {
    id: 'reset-mixed',
    title: 'Reset --mixed',
    type: 'subtopic',
    section: 'advanced',
    parentId: 'undoing-history-cat',
    description: 'Default reset: moves HEAD and unstages changes into working directory.',
    status: 'locked',
    isBeginner: false,
  },
  {
    id: 'reset-hard',
    title: 'Reset --hard',
    type: 'subtopic',
    section: 'advanced',
    parentId: 'undoing-history-cat',
    description: 'Moves HEAD and discards all staging and working directory modifications.',
    status: 'locked',
    isBeginner: false,
  },

  {
    id: 'rewriting-history-cat',
    title: 'History Rewriting & Rebase',
    type: 'category',
    section: 'advanced',
    parentId: 'sec-advanced',
    prerequisites: ['undoing-history-cat'],
    description: 'Linearizing branches, editing commit messages, and cherry-picking.',
    status: 'locked',
    isBeginner: false,
    children: ['git-commit-amend', 'git-rebase', 'interactive-rebase', 'cherry-pick', 'git-push-force'],
  },
  {
    id: 'git-commit-amend',
    title: 'git commit --amend',
    type: 'topic',
    section: 'advanced',
    parentId: 'rewriting-history-cat',
    description: 'Modifies the most recent commit with newly staged changes or updated message.',
    status: 'locked',
    commands: ['git commit --amend --no-edit'],
    isBeginner: false,
  },
  {
    id: 'git-rebase',
    title: 'git rebase',
    type: 'topic',
    section: 'advanced',
    parentId: 'rewriting-history-cat',
    description: 'Re-applies commits on top of another base tip for linear project history.',
    status: 'locked',
    commands: ['git rebase main', 'git rebase --continue', 'git rebase --abort'],
    isBeginner: false,
  },
  {
    id: 'interactive-rebase',
    title: 'Interactive Rebase',
    type: 'subtopic',
    section: 'advanced',
    parentId: 'rewriting-history-cat',
    description: 'Reordering, squashing, splitting, and dropping historical commits with -i.',
    status: 'locked',
    commands: ['git rebase -i HEAD~4'],
    isBeginner: false,
  },
  {
    id: 'cherry-pick',
    title: 'git cherry-pick',
    type: 'topic',
    section: 'advanced',
    parentId: 'rewriting-history-cat',
    description: 'Applies the changes introduced by some existing commits onto the current branch.',
    status: 'locked',
    commands: ['git cherry-pick <commit-hash>'],
    isBeginner: false,
  },
  {
    id: 'git-push-force',
    title: 'Force Push & Lease',
    type: 'subtopic',
    section: 'advanced',
    parentId: 'rewriting-history-cat',
    description: 'Publishing rewritten history safely using --force-with-lease.',
    status: 'locked',
    commands: ['git push --force-with-lease origin branch'],
    isBeginner: false,
  },

  {
    id: 'rescue-internals-cat',
    title: 'Recovery & Diagnostics',
    type: 'category',
    section: 'advanced',
    parentId: 'sec-advanced',
    prerequisites: ['rewriting-history-cat'],
    description: 'Emergency tools for recovering lost commits, finding bugs, and large files.',
    status: 'locked',
    isBeginner: false,
    children: ['git-reflog', 'git-bisect', 'git-worktree', 'git-lfs'],
  },
  {
    id: 'git-reflog',
    title: 'git reflog',
    type: 'topic',
    section: 'advanced',
    parentId: 'rescue-internals-cat',
    description: 'The local audit log recording every single HEAD update and commit movement.',
    status: 'locked',
    commands: ['git reflog', 'git reset --hard HEAD@{2}'],
    bestPractices: ['Almost nothing in Git is truly lost as long as it has been recorded in reflog.'],
    isBeginner: false,
  },
  {
    id: 'git-bisect',
    title: 'git bisect',
    type: 'topic',
    section: 'advanced',
    parentId: 'rescue-internals-cat',
    description: 'Binary search through commit history to identify the exact commit that broke tests.',
    status: 'locked',
    commands: ['git bisect start', 'git bisect bad', 'git bisect good <commit>'],
    isBeginner: false,
  },
  {
    id: 'git-worktree',
    title: 'git worktree',
    type: 'topic',
    section: 'advanced',
    parentId: 'rescue-internals-cat',
    description: 'Managing multiple working trees attached to the same repository simultaneously.',
    status: 'locked',
    commands: ['git worktree add ../hotfix main'],
    isBeginner: false,
  },
  {
    id: 'git-lfs',
    title: 'Git LFS',
    type: 'subtopic',
    section: 'advanced',
    parentId: 'rescue-internals-cat',
    description: 'Large File Storage replacing huge binary assets with pointer references.',
    status: 'locked',
    commands: ['git lfs track "*.psd"'],
    isBeginner: false,
  },

  {
    id: 'hooks-submodules-cat',
    title: 'Hooks & Submodules',
    type: 'category',
    section: 'advanced',
    parentId: 'sec-advanced',
    prerequisites: ['rescue-internals-cat'],
    description: 'Client and server automation scripts and nested child repositories.',
    status: 'locked',
    isBeginner: false,
    children: ['git-hooks', 'common-hooks', 'submodules', 'git-tagging'],
  },
  {
    id: 'git-hooks',
    title: 'Git Hooks',
    type: 'topic',
    section: 'advanced',
    parentId: 'hooks-submodules-cat',
    description: 'Scripts executed automatically before or after Git events like commit or push.',
    status: 'locked',
    isBeginner: false,
  },
  {
    id: 'common-hooks',
    title: 'pre-commit & commit-msg',
    type: 'subtopic',
    section: 'advanced',
    parentId: 'hooks-submodules-cat',
    description: 'Running linters, typecheckers, and validating commit message formats.',
    status: 'locked',
    isBeginner: false,
  },
  {
    id: 'submodules',
    title: 'Git Submodules',
    type: 'topic',
    section: 'advanced',
    parentId: 'hooks-submodules-cat',
    description: 'Keeping another Git repository inside a subfolder of your repository.',
    status: 'locked',
    commands: ['git submodule add <url>', 'git submodule update --init --recursive'],
    isBeginner: false,
  },
  {
    id: 'git-tagging',
    title: 'Tagging & Releases',
    type: 'topic',
    section: 'advanced',
    parentId: 'hooks-submodules-cat',
    description: 'Marking specific points in history as important (e.g. v1.0.0 semantic releases).',
    status: 'locked',
    commands: ['git tag -a v1.0.0 -m "Release 1.0.0"', 'git push origin --tags'],
    isBeginner: false,
  },

  // ========================================================================
  // SECTION 4: GITHUB ENGINEERING
  // ========================================================================
  {
    id: 'sec-engineering',
    title: 'GitHub Engineering',
    type: 'root',
    section: 'engineering',
    prerequisites: ['hooks-submodules-cat'],
    description: 'Enterprise workflows, CI/CD Actions, APIs, Apps, and automated deployment.',
    status: 'locked',
    isBeginner: false,
  },
  {
    id: 'github-actions-cat',
    title: 'GitHub Actions & CI/CD',
    type: 'category',
    section: 'engineering',
    parentId: 'sec-engineering',
    prerequisites: ['hooks-submodules-cat'],
    description: 'Automating builds, testing suites, and production deployments via YAML workflows.',
    status: 'locked',
    isBeginner: false,
    children: ['actions-yaml-syntax', 'workflow-triggers', 'workflow-runners', 'secrets-and-env-vars'],
  },
  {
    id: 'actions-yaml-syntax',
    title: 'Workflow YAML Syntax',
    type: 'topic',
    section: 'engineering',
    parentId: 'github-actions-cat',
    description: 'Defining jobs, steps, matrices, and reusable actions in .github/workflows.',
    status: 'locked',
    isBeginner: false,
  },
  {
    id: 'workflow-triggers',
    title: 'Workflow Triggers',
    type: 'topic',
    section: 'engineering',
    parentId: 'github-actions-cat',
    description: 'Triggering on push, pull_request, schedule cron, or repository_dispatch.',
    status: 'locked',
    isBeginner: false,
  },
  {
    id: 'workflow-runners',
    title: 'Runners & Environments',
    type: 'subtopic',
    section: 'engineering',
    parentId: 'github-actions-cat',
    description: 'GitHub-hosted virtual environments vs self-hosted enterprise runners.',
    status: 'locked',
    isBeginner: false,
  },
  {
    id: 'secrets-and-env-vars',
    title: 'Secrets & Environment',
    type: 'subtopic',
    section: 'engineering',
    parentId: 'github-actions-cat',
    description: 'Storing encrypted deployment keys and passing environment variables.',
    status: 'locked',
    isBeginner: false,
  },

  {
    id: 'github-api-apps-cat',
    title: 'API, Apps & Webhooks',
    type: 'category',
    section: 'engineering',
    parentId: 'sec-engineering',
    prerequisites: ['github-actions-cat'],
    description: 'Programmatic automation via REST, GraphQL, webhooks, and GitHub Apps.',
    status: 'locked',
    isBeginner: false,
    children: ['github-rest-graphql', 'github-apps', 'webhooks-automation', 'github-cli'],
  },
  {
    id: 'github-rest-graphql',
    title: 'REST & GraphQL API',
    type: 'topic',
    section: 'engineering',
    parentId: 'github-api-apps-cat',
    description: 'Querying and mutating repository data, issues, and PR statuses via API.',
    status: 'locked',
    isBeginner: false,
  },
  {
    id: 'github-apps',
    title: 'GitHub & OAuth Apps',
    type: 'topic',
    section: 'engineering',
    parentId: 'github-api-apps-cat',
    description: 'First-class actor integrations with fine-grained repository permissions.',
    status: 'locked',
    isBeginner: false,
  },
  {
    id: 'webhooks-automation',
    title: 'Webhooks',
    type: 'topic',
    section: 'engineering',
    parentId: 'github-api-apps-cat',
    description: 'Subscribing to real-time events published by GitHub to external servers.',
    status: 'locked',
    isBeginner: false,
  },
  {
    id: 'github-cli',
    title: 'GitHub CLI (gh)',
    type: 'subtopic',
    section: 'engineering',
    parentId: 'github-api-apps-cat',
    description: 'Managing PRs, issues, releases, and workflows directly from your terminal.',
    status: 'locked',
    commands: ['gh pr create', 'gh pr checkout 12', 'gh issue list'],
    isBeginner: false,
  },

  {
    id: 'hosting-ecosystem-cat',
    title: 'Hosting & Ecosystem',
    type: 'category',
    section: 'engineering',
    parentId: 'sec-engineering',
    prerequisites: ['github-api-apps-cat'],
    description: 'Static website deployment, package registries, and developer tooling.',
    status: 'locked',
    isBeginner: false,
    children: ['github-pages', 'github-codespaces', 'github-packages', 'github-security'],
  },
  {
    id: 'github-pages',
    title: 'GitHub Pages',
    type: 'topic',
    section: 'engineering',
    parentId: 'hosting-ecosystem-cat',
    description: 'Hosting static documentation and frontend apps directly from a repository branch.',
    status: 'locked',
    isBeginner: true,
  },
  {
    id: 'github-codespaces',
    title: 'Codespaces',
    type: 'topic',
    section: 'engineering',
    parentId: 'hosting-ecosystem-cat',
    description: 'Cloud-powered developer dev containers configured via devcontainer.json.',
    status: 'locked',
    isBeginner: false,
  },
  {
    id: 'github-packages',
    title: 'GitHub Packages',
    type: 'subtopic',
    section: 'engineering',
    parentId: 'hosting-ecosystem-cat',
    description: 'Publishing and hosting npm, Docker, Maven, or Ruby packages with repo access.',
    status: 'locked',
    isBeginner: false,
  },
  {
    id: 'github-security',
    title: 'Dependabot & Security',
    type: 'subtopic',
    section: 'engineering',
    parentId: 'hosting-ecosystem-cat',
    description: 'Automated vulnerability alerts, secret scanning, and code scanning with CodeQL.',
    status: 'locked',
    isBeginner: false,
  },
];

// ============================================================================
// NORMALIZED RELATIONSHIPS (EDGES)
// Data defines relationships, not visual positions.
// ============================================================================

export const RAW_ROADMAP_EDGES: RoadmapEdge[] = [
  // ------------------------------------------------------------------------
  // PRIMARY SPINE PREREQUISITES (Weight 100)
  // Flow: Version Control -> Basics -> Staging -> Commits -> Branching ->
  // Merging -> Remotes -> GitHub Essentials -> PRs -> Stash -> Reset ->
  // Rebase -> Diagnostics -> Hooks -> Actions -> API -> Hosting
  // ------------------------------------------------------------------------
  { id: 'spine-1', source: 'version-control', target: 'git-basics', type: 'prerequisite', priority: 100 },
  { id: 'spine-2', source: 'git-basics', target: 'working-tree-staging', type: 'prerequisite', priority: 100 },
  { id: 'spine-3', source: 'working-tree-staging', target: 'commits-history', type: 'prerequisite', priority: 100 },
  { id: 'spine-4', source: 'commits-history', target: 'branching-mechanics', type: 'prerequisite', priority: 100 },
  { id: 'spine-5', source: 'branching-mechanics', target: 'merging-mechanics', type: 'prerequisite', priority: 100 },
  { id: 'spine-6', source: 'merging-mechanics', target: 'git-remotes-sync', type: 'prerequisite', priority: 100 },
  { id: 'spine-7', source: 'git-remotes-sync', target: 'github-essentials-cat', type: 'prerequisite', priority: 100 },
  { id: 'spine-8', source: 'github-essentials-cat', target: 'pr-collaboration-workflow', type: 'prerequisite', priority: 100 },
  { id: 'spine-9', source: 'pr-collaboration-workflow', target: 'git-stash-cat', type: 'prerequisite', priority: 100 },
  { id: 'spine-10', source: 'git-stash-cat', target: 'undoing-history-cat', type: 'prerequisite', priority: 100 },
  { id: 'spine-11', source: 'undoing-history-cat', target: 'rewriting-history-cat', type: 'prerequisite', priority: 100 },
  { id: 'spine-12', source: 'rewriting-history-cat', target: 'rescue-internals-cat', type: 'prerequisite', priority: 100 },
  { id: 'spine-13', source: 'rescue-internals-cat', target: 'hooks-submodules-cat', type: 'prerequisite', priority: 100 },
  { id: 'spine-14', source: 'hooks-submodules-cat', target: 'github-actions-cat', type: 'prerequisite', priority: 100 },
  { id: 'spine-15', source: 'github-actions-cat', target: 'github-api-apps-cat', type: 'prerequisite', priority: 100 },
  { id: 'spine-16', source: 'github-api-apps-cat', target: 'hosting-ecosystem-cat', type: 'prerequisite', priority: 100 },

  // ------------------------------------------------------------------------
  // CATEGORY -> TOPIC BRANCH CONNECTIONS (Containment & Entry into Subgraph)
  // Connects the main learning spine to secondary branch concepts
  // ------------------------------------------------------------------------
  { id: 'branch-vcs', source: 'version-control', target: 'what-is-vcs', type: 'contains', priority: 50 },
  { id: 'branch-bas', source: 'git-basics', target: 'git-init', type: 'contains', priority: 50 },
  { id: 'branch-stg', source: 'working-tree-staging', target: 'working-directory', type: 'contains', priority: 50 },
  { id: 'branch-cmt', source: 'commits-history', target: 'git-commit', type: 'contains', priority: 50 },
  { id: 'branch-br', source: 'branching-mechanics', target: 'creating-branch', type: 'contains', priority: 50 },
  { id: 'branch-mg', source: 'merging-mechanics', target: 'merging-basics', type: 'contains', priority: 50 },
  { id: 'branch-rm', source: 'git-remotes-sync', target: 'managing-remotes', type: 'contains', priority: 50 },
  { id: 'branch-gh', source: 'github-essentials-cat', target: 'creating-account', type: 'contains', priority: 50 },
  { id: 'branch-pr', source: 'pr-collaboration-workflow', target: 'forking-vs-cloning', type: 'contains', priority: 50 },
  { id: 'branch-st', source: 'git-stash-cat', target: 'git-stash-basics', type: 'contains', priority: 50 },
  { id: 'branch-und', source: 'undoing-history-cat', target: 'git-revert', type: 'contains', priority: 50 },
  { id: 'branch-rew', source: 'rewriting-history-cat', target: 'git-commit-amend', type: 'contains', priority: 50 },
  { id: 'branch-rec', source: 'rescue-internals-cat', target: 'git-reflog', type: 'contains', priority: 50 },
  { id: 'branch-hk', source: 'hooks-submodules-cat', target: 'git-hooks', type: 'contains', priority: 50 },
  { id: 'branch-act', source: 'github-actions-cat', target: 'actions-yaml-syntax', type: 'contains', priority: 50 },
  { id: 'branch-api', source: 'github-api-apps-cat', target: 'github-rest-graphql', type: 'contains', priority: 50 },
  { id: 'branch-hst', source: 'hosting-ecosystem-cat', target: 'github-pages', type: 'contains', priority: 50 },

  // ------------------------------------------------------------------------
  // TOPIC & SUBTOPIC PREREQUISITES & INTERNAL DEPENDENCY FLOWS
  // ------------------------------------------------------------------------
  // Foundations:
  { id: 'dep-vcs-1', source: 'what-is-vcs', target: 'why-use-vcs', type: 'prerequisite' },
  { id: 'dep-vcs-2', source: 'why-use-vcs', target: 'git-vs-other-vcs', type: 'prerequisite' },
  { id: 'dep-vcs-3', source: 'git-vs-other-vcs', target: 'installing-git-locally', type: 'prerequisite' },

  { id: 'dep-bas-1', source: 'git-init', target: 'git-config', type: 'prerequisite' },
  { id: 'dep-bas-2', source: 'git-config', target: 'local-vs-global-config', type: 'contains' },
  { id: 'dep-bas-3', source: 'git-config', target: 'gitignore', type: 'prerequisite' },

  { id: 'dep-stg-1', source: 'working-directory', target: 'staging-area', type: 'prerequisite' },
  { id: 'dep-stg-2', source: 'staging-area', target: 'git-status', type: 'prerequisite' },
  { id: 'dep-stg-3', source: 'git-status', target: 'git-diff-basic', type: 'related' },

  { id: 'dep-cmt-1', source: 'staging-area', target: 'git-commit', type: 'prerequisite' },
  { id: 'dep-cmt-2', source: 'git-commit', target: 'commit-messages', type: 'prerequisite' },
  { id: 'dep-cmt-3', source: 'git-commit', target: 'git-log', type: 'prerequisite' },
  { id: 'dep-cmt-4', source: 'git-log', target: 'viewing-commit-history', type: 'contains' },

  // Collaboration:
  { id: 'dep-br-1', source: 'creating-branch', target: 'checkout-switch', type: 'prerequisite' },
  { id: 'dep-br-2', source: 'checkout-switch', target: 'renaming-branch', type: 'related' },
  { id: 'dep-br-3', source: 'checkout-switch', target: 'deleting-branch', type: 'related' },

  { id: 'dep-mg-1', source: 'merging-basics', target: 'fast-forward-vs-non-ff', type: 'contains' },
  { id: 'dep-mg-2', source: 'merging-basics', target: 'handling-conflicts', type: 'prerequisite' },
  { id: 'dep-mg-3', source: 'merging-basics', target: 'squash-merge', type: 'related' },

  { id: 'dep-rm-1', source: 'managing-remotes', target: 'pushing-pulling-changes', type: 'prerequisite' },
  { id: 'dep-rm-2', source: 'pushing-pulling-changes', target: 'fetch-without-merge', type: 'related' },
  { id: 'dep-rm-3', source: 'cloning-repositories', target: 'pushing-pulling-changes', type: 'prerequisite' },

  { id: 'dep-gh-1', source: 'creating-account', target: 'github-interface', type: 'prerequisite' },
  { id: 'dep-gh-2', source: 'github-interface', target: 'profile-readme', type: 'related' },
  { id: 'dep-gh-3', source: 'github-interface', target: 'private-vs-public', type: 'related' },

  { id: 'dep-pr-1', source: 'forking-vs-cloning', target: 'pull-requests', type: 'prerequisite' },
  { id: 'dep-pr-2', source: 'issues-tracking', target: 'pull-requests', type: 'related' },
  { id: 'dep-pr-3', source: 'pull-requests', target: 'pr-from-fork', type: 'contains' },
  { id: 'dep-pr-4', source: 'pull-requests', target: 'code-reviews', type: 'prerequisite' },

  // Advanced Git:
  { id: 'dep-st-1', source: 'git-stash-basics', target: 'stash-pop-apply', type: 'prerequisite' },
  { id: 'dep-st-2', source: 'stash-pop-apply', target: 'stash-branch', type: 'related' },

  { id: 'dep-und-1', source: 'git-revert', target: 'git-reset', type: 'related' },
  { id: 'dep-und-2', source: 'git-reset', target: 'reset-soft', type: 'contains' },
  { id: 'dep-und-3', source: 'git-reset', target: 'reset-mixed', type: 'contains' },
  { id: 'dep-und-4', source: 'git-reset', target: 'reset-hard', type: 'contains' },

  { id: 'dep-rew-1', source: 'git-commit-amend', target: 'git-rebase', type: 'prerequisite' },
  { id: 'dep-rew-2', source: 'git-rebase', target: 'interactive-rebase', type: 'contains' },
  { id: 'dep-rew-3', source: 'git-rebase', target: 'cherry-pick', type: 'related' },
  { id: 'dep-rew-4', source: 'git-rebase', target: 'git-push-force', type: 'prerequisite' },

  { id: 'dep-rec-1', source: 'git-reflog', target: 'git-bisect', type: 'related' },
  { id: 'dep-rec-2', source: 'git-reflog', target: 'git-worktree', type: 'related' },
  { id: 'dep-rec-3', source: 'git-worktree', target: 'git-lfs', type: 'related' },

  { id: 'dep-hk-1', source: 'git-hooks', target: 'common-hooks', type: 'contains' },
  { id: 'dep-hk-2', source: 'git-hooks', target: 'submodules', type: 'related' },
  { id: 'dep-hk-3', source: 'submodules', target: 'git-tagging', type: 'related' },

  // GitHub Engineering:
  { id: 'dep-act-1', source: 'actions-yaml-syntax', target: 'workflow-triggers', type: 'prerequisite' },
  { id: 'dep-act-2', source: 'workflow-triggers', target: 'workflow-runners', type: 'prerequisite' },
  { id: 'dep-act-3', source: 'workflow-runners', target: 'secrets-and-env-vars', type: 'prerequisite' },

  { id: 'dep-api-1', source: 'github-rest-graphql', target: 'webhooks-automation', type: 'related' },
  { id: 'dep-api-2', source: 'webhooks-automation', target: 'github-apps', type: 'prerequisite' },
  { id: 'dep-api-3', source: 'github-apps', target: 'github-cli', type: 'related' },

  { id: 'dep-hst-1', source: 'github-pages', target: 'github-codespaces', type: 'related' },
  { id: 'dep-hst-2', source: 'github-codespaces', target: 'github-packages', type: 'related' },
  { id: 'dep-hst-3', source: 'github-packages', target: 'github-security', type: 'related' },
];

// ============================================================================
// DEVELOPMENT GRAPH VALIDATOR (Section 25 & 26)
// ============================================================================

export function validateRoadmapGraph(
  nodes: RoadmapNode[],
  edges: RoadmapEdge[]
): GraphValidationResult {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const orphanNodes: string[] = [];
  const invalidEdges: string[] = [];
  const duplicateEdges: string[] = [];
  const selfEdges: string[] = [];

  // Check orphans: nodes not linked to any edge or having no valid section/parent
  const referencedNodeIds = new Set<string>();
  edges.forEach((e) => {
    referencedNodeIds.add(e.source);
    referencedNodeIds.add(e.target);
  });

  nodes.forEach((n) => {
    if (n.type !== 'root' && !referencedNodeIds.has(n.id) && !n.parentId) {
      orphanNodes.push(n.id);
    }
  });

  // Check edges
  const edgeKeys = new Set<string>();
  edges.forEach((e) => {
    // 1. Source existence
    if (!nodeMap.has(e.source)) {
      invalidEdges.push(`${e.id}: Source "${e.source}" does not exist`);
    }
    // 2. Target existence
    if (!nodeMap.has(e.target)) {
      invalidEdges.push(`${e.id}: Target "${e.target}" does not exist`);
    }
    // 3. Self edges
    if (e.source === e.target) {
      selfEdges.push(`${e.id}: Self-edge on "${e.source}"`);
    }
    // 4. Duplicate edges
    const key = `${e.source}-->${e.target}`;
    if (edgeKeys.has(key)) {
      duplicateEdges.push(`${e.id}: Duplicate connection ${key}`);
    } else {
      edgeKeys.add(key);
    }
  });

  const isValid =
    orphanNodes.length === 0 &&
    invalidEdges.length === 0 &&
    duplicateEdges.length === 0 &&
    selfEdges.length === 0;

  return {
    isValid,
    nodeCount: nodes.length,
    edgeCount: edges.length,
    orphanNodes,
    invalidEdges,
    duplicateEdges,
    selfEdges,
  };
}
