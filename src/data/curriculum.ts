import { GitRepo } from '../git-engine/types';

export interface PredictChallenge {
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ProgressiveTask {
  beginnerPrompt: string;
  intermediatePrompt: string;
  advancedPrompt: string;
  expertPrompt: string;
}

export interface Lesson {
  id: string;
  level: number;
  levelTitle: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  mission: string;
  whyItMatters: string;
  concept: string;
  projectKey: string;
  predict?: PredictChallenge;
  task: ProgressiveTask;
  hints: string[];
  solution: string;
  quiz: QuizQuestion;
  keyTakeaways: string[];
  validate: (repo: GitRepo) => { passed: boolean; message: string };
}

export interface LevelInfo {
  level: number;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
}

export const LEVELS: LevelInfo[] = [
  { level: 0, title: 'Computer & Terminal Fundamentals', subtitle: 'The Command Line Journey Begins', badge: '💻 Level 0', description: 'Understand files, folders, navigation, and core terminal commands without fear.' },
  { level: 1, title: 'Git Fundamentals', subtitle: 'Snapshots & The Three Areas', badge: '🌱 Level 1', description: 'Learn git init, staging with add, creating snapshots with commit, and reading history.' },
  { level: 2, title: 'Everyday Git & Quality', subtitle: 'Daily Habits & .gitignore', badge: '⚡ Level 2', description: 'Selective staging, diff inspection, .gitignore hygiene, and professional commit messages.' },
  { level: 3, title: 'History & Recovery', subtitle: 'Time Travel & Safe Undos', badge: '⏪ Level 3', description: 'Master git restore, revert, and the three reset modes (--soft, --mixed, --hard).' },
  { level: 4, title: 'Branches & Exploration', subtitle: 'Parallel Realities', badge: '🌿 Level 4', description: 'Create isolated lines of development, switch contexts safely, and understand movable pointers.' },
  { level: 5, title: 'Merging & Conflict Arena', subtitle: 'Integrating Code Streams', badge: '⚔️ Level 5', description: 'Fast-forwards, 3-way merges, and mastering conflict resolution without panic.' },
  { level: 6, title: 'GitHub & Remotes', subtitle: 'Collaborating Across Machines', badge: '🌐 Level 6', description: 'Understand origin, upstream, fetch vs pull, and resolving push rejections.' },
  { level: 7, title: 'Pull Requests & Code Review', subtitle: 'Team Workflow & Feedback', badge: '🤝 Level 7', description: 'Simulate feature branch PRs, respond to teammate review comments, and merge cleanly.' },
  { level: 8, title: 'Professional Git Tools', subtitle: 'Stash, Blame, Bisect & Tags', badge: '🛠️ Level 8', description: 'Pause work with stash, track regressions with bisect, tag releases, and cherry-pick fixes.' },
  { level: 9, title: 'Rebase & Clean History', subtitle: 'Linear Commits & Rebase -i', badge: '🎯 Level 9', description: 'Replay commits cleanly, squash messy work with interactive rebase, and learn the golden rules.' },
  { level: 10, title: 'Troubleshooting & Git Hospital', subtitle: 'Detached HEAD & Reflog Rescue', badge: '🏥 Level 10', description: 'Diagnose and cure broken repositories, rescue lost commits, and escape detached HEAD states.' },
  { level: 11, title: 'Advanced Git Ecosystem', subtitle: 'Worktrees, Hooks & Multi-Remotes', badge: '🚀 Level 11', description: 'Worktree multitasking, custom git pre-commit hooks, and professional configurations.' },
  { level: 12, title: 'Git Internals & Architecture', subtitle: 'Under the Hood: Blobs, Trees, Objects', badge: '🔬 Level 12', description: 'Deconstruct SHA-1 object databases, inspect raw blobs and trees, and master the mental model.' },
];

export const LESSONS: Lesson[] = [
  // LEVEL 0: Terminal
  {
    id: 'l0-navigation',
    level: 0,
    levelTitle: 'Computer & Terminal Fundamentals',
    title: 'Navigating the File System (pwd, ls, cd)',
    difficulty: 'Beginner',
    mission: 'You just opened your terminal inside a new workspace. Before touching any code, discover where you are and what files exist.',
    whyItMatters: 'Every Git operation happens in the context of a current working directory. If you don\'t know where you are, you\'ll commit files in the wrong place.',
    concept: 'The terminal is a text-based window into your computer. `pwd` prints your Working Directory. `ls` lists files. `cd` changes your folder location.',
    projectKey: 'personal-website',
    predict: {
      question: 'If you run `ls` in an empty folder, what happens?',
      options: [
        'The computer deletes the folder',
        'Nothing or (empty directory) is printed because no files exist',
        'Git creates an index.html file',
        'An error is thrown'
      ],
      correctIndex: 1,
      explanation: 'ls simply lists directory contents; if nothing is in the folder, it prints an empty listing.'
    },
    task: {
      beginnerPrompt: 'Type `pwd` to inspect your current directory, then type `ls` to list the files.',
      intermediatePrompt: 'Inspect your current path and list all project files in the terminal.',
      advancedPrompt: 'Verify your directory and list project contents.',
      expertPrompt: 'Discover the project files in your current location.',
    },
    hints: [
      'Type `pwd` and press Enter to see your current directory path.',
      'Type `ls` and press Enter to list all files in this project.',
      'Both commands are read-only and completely safe.',
      'Solution: Run `pwd` then run `ls`.'
    ],
    solution: 'pwd\nls',
    quiz: {
      question: 'What does `pwd` stand for?',
      options: ['Permanent Web Directory', 'Print Working Directory', 'Private Workspace Domain', 'Process Word Data'],
      correctIndex: 1,
      explanation: 'pwd stands for Print Working Directory. It tells you your exact folder path.'
    },
    keyTakeaways: ['pwd shows where you are', 'ls lists files in the current directory', 'Commands are safe inspection tools'],
    validate: () => ({ passed: true, message: 'Explored directory navigation!' })
  },

  // LEVEL 1: Git Basics
  {
    id: 'l1-git-init',
    level: 1,
    levelTitle: 'Git Fundamentals',
    title: 'Initializing a Repository (git init)',
    difficulty: 'Beginner',
    mission: 'You have a portfolio project with index.html and style.css, but Git is not tracking anything. Turn this project into a Git repository.',
    whyItMatters: 'Git does not track folders automatically. You must explicitly initialize a repository so Git can create its database (.git folder).',
    concept: 'Running `git init` creates a hidden `.git` directory. This is where Git stores all snapshots, commit history, and branch pointers.',
    projectKey: 'personal-website',
    predict: {
      question: 'What does `git init` do to your existing source files?',
      options: [
        'It overwrites index.html with boilerplate code',
        'It deletes all unstaged files',
        'It leaves your source files untouched and creates a hidden .git database',
        'It automatically commits everything to GitHub'
      ],
      correctIndex: 2,
      explanation: 'git init only creates the internal .git tracking database. Your source files are never altered.'
    },
    task: {
      beginnerPrompt: 'Type `git init` in the terminal to initialize this project as a Git repository.',
      intermediatePrompt: 'Initialize Git version control in this project folder.',
      advancedPrompt: 'Make this directory a tracked Git repository.',
      expertPrompt: 'Turn this directory into a repository.',
    },
    hints: [
      'The command to initialize a repository is `git init`.',
      'Type `git init` and hit Enter in the terminal.',
      'After running it, notice how the Three-Area Visualizer and Inspector light up!',
      'Solution: `git init`'
    ],
    solution: 'git init',
    quiz: {
      question: 'Where does Git store its history and commit metadata?',
      options: ['In a cloud database only', 'Inside a hidden .git directory in your project root', 'In your browser cache', 'Inside the Windows Registry'],
      correctIndex: 1,
      explanation: 'All Git data lives locally inside the hidden `.git/` folder inside your project directory.'
    },
    keyTakeaways: ['git init creates the .git folder', 'Your code is not modified', 'The repository starts on branch main'],
    validate: (repo) => ({
      passed: repo.initialized,
      message: repo.initialized ? 'Repository initialized!' : 'Run git init to create the repository.'
    })
  },

  {
    id: 'l1-status-and-staging',
    level: 1,
    levelTitle: 'Git Fundamentals',
    title: 'The Staging Area: git status & git add',
    difficulty: 'Beginner',
    mission: 'Your portfolio files are untracked. Inspect the repository with git status, then move index.html into the Staging Area.',
    whyItMatters: 'Git has a two-step commit process (Working Directory ➔ Staging Area ➔ Commit). Staging lets you craft precise, logical commits instead of committing everything blindly.',
    concept: 'The Staging Area (or Index) is a draft board. You pick exactly which changes belong in the next snapshot using `git add <file>`.',
    projectKey: 'personal-website',
    predict: {
      question: 'If you edit index.html and run `git add index.html`, where is the change stored?',
      options: [
        'It is saved directly to GitHub',
        'It moves into the Staging Area (Index) ready to be committed',
        'It is deleted from the hard drive',
        'It creates a new branch'
      ],
      correctIndex: 1,
      explanation: 'git add copies the file state into the Staging Area, preparing it for the next commit snapshot.'
    },
    task: {
      beginnerPrompt: 'Run `git status` to see untracked files, then run `git add index.html` to stage it.',
      intermediatePrompt: 'Inspect the repository status and stage the index.html file.',
      advancedPrompt: 'Stage index.html for your initial snapshot.',
      expertPrompt: 'Prepare index.html for commit.',
    },
    hints: [
      'First run `git status` to see the red untracked files.',
      'Then run `git add index.html` to move it to the staging area.',
      'Watch the Three-Area Visualizer animate index.html into the middle column!',
      'Solution: `git status` followed by `git add index.html`'
    ],
    solution: 'git status\ngit add index.html',
    quiz: {
      question: 'Why does Git use a Staging Area instead of committing directly from files?',
      options: [
        'To slow developers down for safety',
        'To allow you to review and select only relevant changes for each logical commit',
        'Because computer memory is too small for commits',
        'To automatically fix syntax bugs'
      ],
      correctIndex: 1,
      explanation: 'The Staging Area gives you complete control over which changes are bundled together into each clean commit.'
    },
    keyTakeaways: ['git status reveals file states', 'git add moves files into the Staging Area', 'Only staged changes get committed'],
    validate: (repo) => ({
      passed: !!repo.index['index.html'],
      message: repo.index['index.html'] ? 'index.html is staged!' : 'Stage index.html using git add index.html'
    })
  },

  {
    id: 'l1-first-commit',
    level: 1,
    levelTitle: 'Git Fundamentals',
    title: 'Recording History: git commit',
    difficulty: 'Beginner',
    mission: 'Now that index.html is staged, record your first permanent snapshot with a meaningful commit message.',
    whyItMatters: 'Commits are the checkpoints of your project. Each commit preserves the exact state of all staged files along with who made it, when, and why.',
    concept: 'Running `git commit -m "Your message"` packages the Staging Area into a permanent Commit object with a unique SHA hash and adds it to the DAG history.',
    projectKey: 'personal-website',
    predict: {
      question: 'What happens to unstaged files in your working directory when you run `git commit`?',
      options: [
        'They are deleted',
        'They are automatically committed anyway',
        'They remain untouched in your working directory and are NOT included in the commit',
        'Git throws a fatal crash'
      ],
      correctIndex: 2,
      explanation: 'Git commits ONLY what is currently in the Staging Area. Unstaged files stay in the working directory.'
    },
    task: {
      beginnerPrompt: 'Run `git commit -m "Create homepage structure"` to create your first commit.',
      intermediatePrompt: 'Create a commit with a descriptive message describing the homepage.',
      advancedPrompt: 'Commit your staged changes with a meaningful message.',
      expertPrompt: 'Save the snapshot permanently in Git history.',
    },
    hints: [
      'The syntax is `git commit -m "Your message"`.',
      'Make sure to include the `-m` flag and wrap your message in quotes.',
      'Check the Commit DAG graph to see your new commit node appear!',
      'Solution: `git commit -m "Create homepage structure"`'
    ],
    solution: 'git commit -m "Create homepage structure"',
    quiz: {
      question: 'What is a Git commit hash?',
      options: [
        'A random password generated by GitHub',
        'A 40-character hexadecimal fingerprint uniquely identifying the snapshot and its parent',
        'The line count of the file',
        'The author\'s employee ID'
      ],
      correctIndex: 1,
      explanation: 'A Git commit hash is a cryptographic SHA checksum representing the entire snapshot contents and metadata.'
    },
    keyTakeaways: ['git commit creates a permanent snapshot', 'Commit messages explain the intent', 'The commit DAG extends forward'],
    validate: (repo) => ({
      passed: Object.keys(repo.commits).length > 0,
      message: Object.keys(repo.commits).length > 0 ? 'First commit recorded!' : 'Run git commit -m "..." to create a commit.'
    })
  },

  // LEVEL 2: Everyday Git
  {
    id: 'l2-gitignore-secrets',
    level: 2,
    levelTitle: 'Everyday Git & Quality',
    title: '.gitignore & Keeping Secrets Safe',
    difficulty: 'Intermediate',
    mission: 'A developer accidentally created a `.env` file containing API keys. Ensure Git ignores sensitive files and secret credentials.',
    whyItMatters: 'Leaking API keys and passwords into Git repositories is one of the top causes of security breaches in software teams.',
    concept: '`.gitignore` tells Git which files or patterns to ignore. Files matching patterns in `.gitignore` are excluded from `git status` and `git add .`.',
    projectKey: 'coffee-shop',
    predict: {
      question: 'If a file named `.env` is listed inside `.gitignore`, what happens when you run `git status`?',
      options: [
        'Git deletes the .env file from disk',
        'Git ignores .env and does not list it under untracked files',
        'Git prompts you to enter your password',
        'Git adds .env to staging automatically'
      ],
      correctIndex: 1,
      explanation: 'Ignored files are completely filtered out by Git and will not appear in git status or git add.'
    },
    task: {
      beginnerPrompt: 'Check `git status` to see tracked files, create a `.gitignore` if needed, and verify `.env` is never committed.',
      intermediatePrompt: 'Inspect the repository and confirm ignore rules protect secret files.',
      advancedPrompt: 'Verify .gitignore patterns and inspect repository status.',
      expertPrompt: 'Prevent sensitive configuration files from leaking into Git tracking.',
    },
    hints: [
      'Check `git status` to see what is currently tracked.',
      'Check the `.gitignore` file in the project explorer to see the ignore patterns.',
      'Try running `git add -f .env` vs `git add .env` to see Git\'s protection in action.',
      'Solution: Run `git status`'
    ],
    solution: 'git status',
    quiz: {
      question: 'If you already committed a secret file BEFORE adding it to .gitignore, will .gitignore delete it from Git history?',
      options: [
        'Yes, .gitignore automatically removes past commits',
        'No! .gitignore only prevents UNTRACKED files from being added. Already committed files remain in history until manually removed.',
        'Yes, but only on GitHub',
        'Only if you reboot the computer'
      ],
      correctIndex: 1,
      explanation: 'Critical concept: .gitignore only ignores untracked files. If a file was already committed, you must use git rm --cached to stop tracking it.'
    },
    keyTakeaways: ['.gitignore blocks untracked files from being staged', 'Never commit secrets or credentials', 'Already tracked files must be untracked manually'],
    validate: (repo) => ({
      passed: repo.ignoredPatterns.includes('.env'),
      message: 'Verified .gitignore protection!'
    })
  },

  // LEVEL 4: Branches
  {
    id: 'l4-branch-creation',
    level: 4,
    levelTitle: 'Branches & Exploration',
    title: 'Creating & Switching Branches (git switch -c)',
    difficulty: 'Intermediate',
    mission: 'You are tasked with adding a shopping cart to the store. Create a new branch named `feature/cart` so you do not break the `main` branch.',
    whyItMatters: 'Branches allow you to build new features, experiment, and fix bugs in total isolation without impacting production or teammates.',
    concept: 'A branch in Git is simply a lightweight, movable 41-byte reference pointer to a commit. Switching branches moves the HEAD pointer.',
    projectKey: 'ecommerce-store',
    predict: {
      question: 'When you create and switch to a new branch, what happens to your existing commits?',
      options: [
        'They are duplicated on your hard drive',
        'Nothing is duplicated; the new branch simply points to the current commit',
        'All commits on main are deleted',
        'Git clones the entire repository again'
      ],
      correctIndex: 1,
      explanation: 'Branches are just pointers! Creating a branch does not duplicate code; it simply creates a new named pointer pointing to the current commit.'
    },
    task: {
      beginnerPrompt: 'Run `git switch -c feature/cart` to create and checkout the new feature branch.',
      intermediatePrompt: 'Create and switch to a feature branch named `feature/cart`.',
      advancedPrompt: 'Isolate your shopping cart development on a new branch named `feature/cart`.',
      expertPrompt: 'Branch off main into `feature/cart`.',
    },
    hints: [
      'Use the modern command: `git switch -c feature/cart`.',
      'Alternatively, `git checkout -b feature/cart` also works.',
      'Check the Git Graph visualizer to see the HEAD badge jump to `feature/cart`!',
      'Solution: `git switch -c feature/cart`'
    ],
    solution: 'git switch -c feature/cart',
    quiz: {
      question: 'What is `HEAD` in Git?',
      options: [
        'The first commit in the repository',
        'A special pointer that tells Git which branch or commit you are currently looking at',
        'The main developer\'s username',
        'The remote server URL'
      ],
      correctIndex: 1,
      explanation: 'HEAD is the reference pointer indicating your current checkout location.'
    },
    keyTakeaways: ['Branches are cheap movable pointers', 'git switch -c creates and checks out a branch', 'HEAD points to the active branch'],
    validate: (repo) => ({
      passed: repo.head.ref === 'feature/cart',
      message: repo.head.ref === 'feature/cart' ? 'Switched to feature/cart!' : 'Create and switch to feature/cart'
    })
  },

  // LEVEL 5: Merging & Conflicts
  {
    id: 'l5-merging-fastforward',
    level: 5,
    levelTitle: 'Merging & Conflict Arena',
    title: 'Integrating Branches: Fast-Forward vs 3-Way Merge',
    difficulty: 'Intermediate',
    mission: 'You completed work on a feature branch. Switch back to main and merge the feature branch.',
    whyItMatters: 'Merging brings independent streams of development back together into a shared branch like main.',
    concept: 'If no new commits were made on main, Git does a Fast-Forward (simply sliding the main pointer forward). If both branches had commits, Git performs a 3-Way Merge.',
    projectKey: 'ecommerce-store',
    predict: {
      question: 'What is a Fast-Forward merge?',
      options: [
        'A merge that skips testing to save time',
        'When Git simply moves the target branch pointer forward because history is linear with no divergence',
        'When Git deletes the feature branch automatically',
        'A merge performed over a high-speed internet connection'
      ],
      correctIndex: 1,
      explanation: 'In a fast-forward merge, the target branch simply advances forward along the existing linear commit chain.'
    },
    task: {
      beginnerPrompt: 'Run `git switch main` and then run `git merge feature/cart`.',
      intermediatePrompt: 'Switch back to main and integrate the changes from feature/cart.',
      advancedPrompt: 'Merge feature/cart into your main branch.',
      expertPrompt: 'Integrate the completed feature into main.',
    },
    hints: [
      'You must always be on the RECEIVING branch before merging! Run `git switch main` first.',
      'Then run `git merge feature/cart` to bring the commits across.',
      'Watch the branch pointers align in the Git Commit Graph!',
      'Solution: `git switch main` then `git merge feature/cart`'
    ],
    solution: 'git switch main\ngit merge feature/cart',
    quiz: {
      question: 'Which branch must you be on when executing `git merge <feature>`?',
      options: [
        'The feature branch',
        'The target branch you want to merge INTO (e.g. main)',
        'It doesn\'t matter, Git prompts you',
        'On no branch (detached HEAD)'
      ],
      correctIndex: 1,
      explanation: 'You must checkout the branch you want to receive the changes (e.g. main) before running git merge.'
    },
    keyTakeaways: ['Always switch to the destination branch before merging', 'Fast-forwards happen when history is linear', '3-way merges create a merge commit with 2 parents'],
    validate: (repo) => ({
      passed: repo.head.ref === 'main',
      message: repo.head.ref === 'main' ? 'Merged into main!' : 'Switch to main and merge.'
    })
  },

  // LEVEL 10: Detached HEAD & Recovery
  {
    id: 'l10-detached-head',
    level: 10,
    levelTitle: 'Troubleshooting & Git Hospital',
    title: 'Detached HEAD & Time Travel',
    difficulty: 'Advanced',
    mission: 'You need to inspect an older commit to see how the app looked in the past. Check out a past commit hash and observe the Detached HEAD state.',
    whyItMatters: 'Checking out a specific commit allows you to run, test, and inspect old code, but if you don\'t understand Detached HEAD, you risk losing new commits.',
    concept: 'Detached HEAD means HEAD points directly to a commit hash instead of a named branch pointer. Any new commits made here are not attached to any branch!',
    projectKey: 'coffee-shop',
    predict: {
      question: 'What happens if you make a commit while in a Detached HEAD state and then switch to main?',
      options: [
        'The commit is automatically merged into main',
        'The commit becomes unreachable by any branch and will be lost unless you save it with a branch',
        'Git displays a compiler error',
        'The commit is uploaded to GitHub'
      ],
      correctIndex: 1,
      explanation: 'In detached HEAD, new commits are orphans without a branch reference and will be abandoned when you switch branches.'
    },
    task: {
      beginnerPrompt: 'Run `git log --oneline` to find a past commit hash, then run `git checkout <hash>` to enter Detached HEAD mode.',
      intermediatePrompt: 'Check out a previous commit hash directly to enter Detached HEAD state.',
      advancedPrompt: 'Travel back in time to an earlier commit.',
      expertPrompt: 'Inspect an historical commit snapshot directly.',
    },
    hints: [
      'First run `git log --oneline` to see the available commit hashes.',
      'Pick a commit hash and run `git checkout <hash>`.',
      'Notice the state inspector warning: "⚠️ Detached HEAD"!',
      'Solution: `git checkout HEAD~1` or `git checkout <hash>`'
    ],
    solution: 'git checkout HEAD~1',
    quiz: {
      question: 'How do you safely keep a commit you created while in Detached HEAD state?',
      options: [
        'Run git push immediately',
        'Create a branch at your current location: `git switch -c <new-branch>`',
        'You can never save it',
        'Delete the .git directory'
      ],
      correctIndex: 1,
      explanation: 'Running `git switch -c <name>` attaches a new branch reference to your current commit so it is never lost.'
    },
    keyTakeaways: ['Detached HEAD means HEAD points to a SHA, not a branch', 'You can look around safely', 'Create a branch with switch -c to save any work'],
    validate: (repo) => ({
      passed: repo.head.type === 'detached',
      message: repo.head.type === 'detached' ? 'Successfully entered Detached HEAD!' : 'Checkout a commit hash or HEAD~1 to enter detached HEAD.'
    })
  },
];
