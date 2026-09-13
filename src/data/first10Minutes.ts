import { GitRepo } from '../git-engine/types';

export interface First10Step {
  step: number;
  title: string;
  subtitle: string;
  conceptTitle: string;
  conceptBody: string;
  forgeMessage: string;
  commandId: string;
  expectedCommand?: string;
  whatsHappeningSteps: {
    number: number;
    title: string;
    description: string;
  }[];
  keyTakeaways: string[];
  terminalSampleCommand: string;
  terminalSampleOutput: string[];
  hint1: string;
  hint2: string;
  hint3: string;
  requiredActionType: 'inspect' | 'terminal' | 'editor';
  primaryActionLabel: string;
  isComplete: (repo: GitRepo, history: { command?: string }[]) => boolean;
}

export const FIRST_10_MINUTES_STEPS: First10Step[] = [
  // 1. What is Git?
  {
    step: 1,
    title: 'What is Git?',
    subtitle: 'A time machine for your code',
    conceptTitle: 'Git Helps Developers Track Changes',
    conceptBody: 'Git is a distributed version control system that records snapshots of your project over time. It lets you experiment safely, track changes, and collaborate without losing work.',
    forgeMessage: "👋 Welcome to CommitForge! Git is like a time machine for your code. Let's start from absolute zero!",
    commandId: 'status',
    whatsHappeningSteps: [
      { number: 1, title: 'Your code evolves', description: 'You draft and edit files on your computer.' },
      { number: 2, title: 'Git watches changes', description: 'Git detects every modified character.' },
      { number: 3, title: 'You seal snapshots', description: 'You save milestones you can always return to.' },
      { number: 4, title: 'Zero fear of breaking things', description: 'You can undo mistakes instantly.' },
    ],
    keyTakeaways: [
      'Git tracks changes over time using sealed snapshots.',
      'It prevents files like "project_v2_FINAL.zip".',
      'Git runs locally on your computer.',
      'GitHub is the cloud where you share your Git commits.',
    ],
    terminalSampleCommand: 'git --version',
    terminalSampleOutput: ['git version 2.44.0'],
    hint1: 'Review the concept on the screen.',
    hint2: 'Think of Git as an indestructible save system.',
    hint3: 'Click "Start Learning" to continue.',
    requiredActionType: 'inspect',
    primaryActionLabel: 'Start Learning →',
    isComplete: () => true,
  },

  // 2. Your first repository (git init)
  {
    step: 2,
    title: 'Your first repository',
    subtitle: 'Initializing with git init',
    conceptTitle: 'Turn On Git Tracking',
    conceptBody: 'Turn a regular project folder into a Git repository by running git init. This creates the hidden .git database.',
    forgeMessage: "Let's turn this folder into a real Git repository. Type git init or click Run Command below!",
    commandId: 'status',
    expectedCommand: 'git init',
    whatsHappeningSteps: [
      { number: 1, title: 'Git inspects directory', description: 'Verifies the folder is not already a repository.' },
      { number: 2, title: 'Hidden .git folder created', description: 'Initializes the object database and reference store.' },
      { number: 3, title: 'Default branch set', description: 'Sets the default branch pointer to main.' },
      { number: 4, title: 'Ready for snapshots', description: 'Git is now watching your project files.' },
    ],
    keyTakeaways: [
      'git init turns any folder into a version-controlled repository.',
      'It creates a hidden .git directory storing all history.',
      'Your existing website files are untouched.',
      'You only run git init once per project.',
    ],
    terminalSampleCommand: 'git init',
    terminalSampleOutput: [
      'Initialized empty Git repository in /home/developer/project/.git/',
    ],
    hint1: 'Type git init in the terminal.',
    hint2: 'Press Enter to execute.',
    hint3: 'Command: git init',
    requiredActionType: 'terminal',
    primaryActionLabel: 'Run git init',
    isComplete: (repo) => repo.initialized,
  },

  // 3. Files, changes and status (git status)
  {
    step: 3,
    title: 'Files, changes and status',
    subtitle: 'Checking what Git sees with git status',
    conceptTitle: 'Situational Awareness',
    conceptBody: 'Check which files are clean, modified, or untracked. Git status is read-only and 100% safe to run anytime.',
    forgeMessage: "Always check git status before doing anything! It tells you exactly what Git sees on your desk.",
    commandId: 'status',
    expectedCommand: 'git status',
    whatsHappeningSteps: [
      { number: 1, title: 'Git scans working files', description: 'Compares your files on disk against the index.' },
      { number: 2, title: 'Detects untracked files', description: 'Identifies files Git has never seen before.' },
      { number: 3, title: 'Checks active branch', description: 'Identifies which branch HEAD currently stands on.' },
      { number: 4, title: 'Outputs 3-area report', description: 'Displays clear color-coded guidance.' },
    ],
    keyTakeaways: [
      'git status is read-only and safe to run at any moment.',
      'Red text indicates untracked or unstaged changes on your desk.',
      'Green text indicates files staged in the packing box.',
      'It tells you which branch you are currently on.',
    ],
    terminalSampleCommand: 'git status',
    terminalSampleOutput: [
      'On branch main',
      'No commits yet',
      'Untracked files:',
      '  (use "git add <file>..." to include in what will be committed)',
      '	index.html',
      '	style.css',
      '	script.js',
    ],
    hint1: 'Type git status in the terminal.',
    hint2: 'Notice the red untracked file names.',
    hint3: 'Command: git status',
    requiredActionType: 'terminal',
    primaryActionLabel: 'Run git status',
    isComplete: (_, history) => history.some((h) => h.command?.trim() === 'git status'),
  },

  // 4. Staging with git add
  {
    step: 4,
    title: 'Staging with git add',
    subtitle: 'Packing the staging box',
    conceptTitle: 'The Staging Area',
    conceptBody: 'Selectively pack files into the staging box before taking a snapshot. Notice: Git has NOT saved a new version yet!',
    forgeMessage: "Think of git add like putting items into a shipping box. You choose what belongs in the next snapshot.",
    commandId: 'add',
    expectedCommand: 'git add index.html',
    whatsHappeningSteps: [
      { number: 1, title: 'Git inspects index.html', description: 'Reads the file contents on your desk.' },
      { number: 2, title: 'Stores content in database', description: 'Creates a compressed blob object in .git/objects.' },
      { number: 3, title: 'Adds entry to index', description: 'Marks index.html as staged for the next commit.' },
      { number: 4, title: 'NOT committed yet!', description: 'The changes are waiting in the box for sealing.' },
    ],
    keyTakeaways: [
      'git add moves files from Working Tree into the Staging Area.',
      'CRITICAL: Git has NOT saved a new commit yet!',
      'Selective staging allows you to craft clean, atomic commits.',
      'Use git add <file> rather than git add . to stay intentional.',
    ],
    terminalSampleCommand: 'git add index.html',
    terminalSampleOutput: [],
    hint1: 'Type git add index.html',
    hint2: 'Watch the file card move into the packing box.',
    hint3: 'Command: git add index.html',
    requiredActionType: 'terminal',
    primaryActionLabel: 'Run git add index.html',
    isComplete: (repo) => Boolean(repo.index['index.html']),
  },

  // 5. Creating a commit
  {
    step: 5,
    title: 'Creating a commit',
    subtitle: 'Sealing the snapshot milestone',
    conceptTitle: 'Sealing a Commit',
    conceptBody: 'Take everything currently in the staging box and seal it into a permanent, timestamped snapshot in your project timeline.',
    forgeMessage: "📸 Snap! Running git commit seals the box into permanent history. Give it a meaningful message!",
    commandId: 'commit',
    expectedCommand: 'git commit -m "Initial commit"',
    whatsHappeningSteps: [
      { number: 1, title: 'Git checks staging area', description: 'Verifies files are prepared in the box.' },
      { number: 2, title: 'Compacts tree object', description: 'Creates a directory tree snapshot.' },
      { number: 3, title: 'Seals commit milestone', description: 'Generates author, timestamp, message, and SHA hash.' },
      { number: 4, title: 'Branch advances', description: 'The main branch label moves forward to the new commit.' },
    ],
    keyTakeaways: [
      'A commit is an immutable saved version of your staged files.',
      'Every commit has an author, message, and unique hash.',
      'The staging area is cleared and ready for your next task.',
      'Your working files remain safely on your desk.',
    ],
    terminalSampleCommand: 'git commit -m "Initial commit"',
    terminalSampleOutput: [
      '[main (root-commit) 4d9e2f3] Initial commit',
      ' 1 file changed, 12 insertions(+)',
      ' create mode 100644 index.html',
    ],
    hint1: 'Type git commit -m "Initial commit"',
    hint2: 'Remember the quotes around your message.',
    hint3: 'Command: git commit -m "Initial commit"',
    requiredActionType: 'terminal',
    primaryActionLabel: 'Run git commit',
    isComplete: (repo) => Object.keys(repo.commits).length > 0,
  },

  // 6. Exploring history (git log)
  {
    step: 6,
    title: 'Exploring history',
    subtitle: 'Walking the commit timeline',
    conceptTitle: 'The Commit Timeline',
    conceptBody: 'Inspect your project timeline. Every commit is linked to its parent, creating a verifiable chain of custody.',
    forgeMessage: "Run git log --oneline to view your timeline! You can see your author name, commit hash, and message.",
    commandId: 'status',
    expectedCommand: 'git log --oneline',
    whatsHappeningSteps: [
      { number: 1, title: 'Git reads HEAD pointer', description: 'Finds the latest commit your active branch points to.' },
      { number: 2, title: 'Traverses parent links', description: 'Follows parent pointers backward through time.' },
      { number: 3, title: 'Reads commit metadata', description: 'Extracts hash, author, date, and description.' },
      { number: 4, title: 'Prints historical log', description: 'Displays the chronological progression of your code.' },
    ],
    keyTakeaways: [
      'git log displays the historical sequence of commits.',
      'git log --oneline provides a clean, concise single-line summary.',
      'Each commit points to its parent commit.',
      'Commits can be inspected or checked out at any time.',
    ],
    terminalSampleCommand: 'git log --oneline',
    terminalSampleOutput: [
      '4d9e2f3 (HEAD -> main) Initial commit',
    ],
    hint1: 'Type git log --oneline in the terminal.',
    hint2: 'Review your commit hash in the output.',
    hint3: 'Command: git log --oneline',
    requiredActionType: 'terminal',
    primaryActionLabel: 'Run git log --oneline',
    isComplete: (_, history) => history.some((h) => h.command?.trim().startsWith('git log')),
  },

  // 7. Pushing to a remote ✨ (Mockup Benchmark)
  {
    step: 7,
    title: 'Pushing to a remote',
    subtitle: 'Sharing commits with GitHub',
    conceptTitle: 'Send Commits to Remote',
    conceptBody: 'Send your local commits to a remote repository so others can see your work. Watch the commits travel across the network!',
    forgeMessage: "Great! You've created a commit. 🎉 Now let's send it to a remote repository so others can see your work. Think of it like uploading your photo to a shared album. Ready to see how it works?",
    commandId: 'push',
    expectedCommand: 'git push origin main',
    whatsHappeningSteps: [
      { number: 1, title: 'Git checks the remote (origin)', description: 'It compares your local commits with the remote.' },
      { number: 2, title: 'Your commits are packed', description: 'Git prepares the data to send.' },
      { number: 3, title: 'Commits are uploaded', description: 'Your changes are sent over the internet.' },
      { number: 4, title: 'Remote is updated', description: 'The new commits are now available for others.' },
    ],
    keyTakeaways: [
      'git push sends your local commits to a remote.',
      'Others can now see your work.',
      'You need the correct permissions.',
      'Use git pull to get the latest changes from others.',
    ],
    terminalSampleCommand: 'git push origin main',
    terminalSampleOutput: [
      'Enumerating objects: 5, done.',
      'Counting objects: 100% (5/5), done.',
      'Delta compression using up to 8 threads',
      'Compressing objects: 100% (3/3), done.',
      'Writing objects: 100% (3/3), 354 bytes | 354.00 KiB/s, done.',
      'Total 3 (delta 1), reused 0 (delta 0)',
      'To github.com:you/my-website.git',
      ' * [new branch]      main -> main',
    ],
    hint1: 'Type git push origin main in the terminal.',
    hint2: 'Watch the commits stream into the GitHub cloud.',
    hint3: 'Command: git push origin main',
    requiredActionType: 'terminal',
    primaryActionLabel: 'Run git push origin main',
    isComplete: (repo) => Boolean(repo.remotes['origin']?.branches['main']),
  },

  // 8. Pulling changes (git pull)
  {
    step: 8,
    title: 'Pulling changes',
    subtitle: 'Synchronizing teammate updates',
    conceptTitle: 'Fetch + Integrate',
    conceptBody: 'Download the latest commits from the remote repository and integrate them into your current branch.',
    forgeMessage: "When teammates push new work, run git pull to bring their commits into your local repository!",
    commandId: 'push', // Uses remote collab visualization
    expectedCommand: 'git pull origin main',
    whatsHappeningSteps: [
      { number: 1, title: 'Git contacts remote', description: 'Checks if origin has commits you are missing.' },
      { number: 2, title: 'Fetches new objects', description: 'Downloads commits and updates origin/main.' },
      { number: 3, title: 'Integrates into branch', description: 'Merges or fast-forwards your local main branch.' },
      { number: 4, title: 'Working files updated', description: 'Your desk now reflects your team\'s latest work.' },
    ],
    keyTakeaways: [
      'git pull ≈ git fetch + integration (commonly merge or rebase).',
      'It brings teammates\' remote commits into your active branch.',
      'Always pull before starting a new feature to stay up to date.',
      'If you both edited the same lines, a merge conflict will occur.',
    ],
    terminalSampleCommand: 'git pull origin main',
    terminalSampleOutput: [
      'From github.com:you/my-website',
      ' * branch            main     -> FETCH_HEAD',
      'Already up to date.',
    ],
    hint1: 'Type git pull origin main in the terminal.',
    hint2: 'Press Enter to synchronize with remote.',
    hint3: 'Command: git pull origin main',
    requiredActionType: 'terminal',
    primaryActionLabel: 'Run git pull',
    isComplete: (_, history) => history.some((h) => h.command?.trim().startsWith('git pull')),
  },

  // 9. Branches (git branch & switch)
  {
    step: 9,
    title: 'Branches',
    subtitle: 'Parallel development lines',
    conceptTitle: 'Movable Reference Stickers',
    conceptBody: 'A branch is NOT a copy of your project folder. It is a lightweight pointer to a commit.',
    forgeMessage: "Branches let you build new features without breaking your working production code!",
    commandId: 'branch',
    expectedCommand: 'git switch -c feature-header',
    whatsHappeningSteps: [
      { number: 1, title: 'Git creates reference', description: 'Places a new branch label on your current commit.' },
      { number: 2, title: 'HEAD points to new branch', description: 'Switches your active context to feature-header.' },
      { number: 3, title: 'Isolated line of work', description: 'Future commits will advance feature-header only.' },
      { number: 4, title: 'Main remains protected', description: 'Main stays safe and ready for deployment.' },
    ],
    keyTakeaways: [
      'A branch is a 41-byte pointer file, not a duplicate folder.',
      'git switch -c <name> creates and checks out the new branch in one go.',
      'HEAD tells Git which branch sticker you are currently standing on.',
      'You can have dozens of branches with zero performance cost.',
    ],
    terminalSampleCommand: 'git switch -c feature-header',
    terminalSampleOutput: [
      "Switched to a new branch 'feature-header'",
    ],
    hint1: 'Type git switch -c feature-header',
    hint2: 'Notice the branch badge in the status bar updates.',
    hint3: 'Command: git switch -c feature-header',
    requiredActionType: 'terminal',
    primaryActionLabel: 'Run git switch -c feature-header',
    isComplete: (repo) => repo.head.type === 'branch' && repo.head.ref !== 'main',
  },

  // 10. Merging (git merge)
  {
    step: 10,
    title: 'Merging',
    subtitle: 'Uniting code streams',
    conceptTitle: 'Combining Histories',
    conceptBody: 'Merge completed feature branches back into main. Git determines whether to fast-forward or create a merge commit.',
    forgeMessage: "When your feature is tested and complete, merge it into main to ship it!",
    commandId: 'merge',
    expectedCommand: 'git merge feature-header',
    whatsHappeningSteps: [
      { number: 1, title: 'Finds common ancestor', description: 'Identifies the commit where branches split.' },
      { number: 2, title: 'Calculates 3-way diff', description: 'Evaluates changes made on both branches.' },
      { number: 3, title: 'Applies feature changes', description: 'Combines the histories cleanly.' },
      { number: 4, title: 'Advances receiving branch', description: 'Main now includes all your new feature code.' },
    ],
    keyTakeaways: [
      'Merging combines histories; it does not copy files.',
      'Fast-forward merges occur when main has no competing commits.',
      '3-way merges create a new commit with two parents.',
      'Always test code before merging into main.',
    ],
    terminalSampleCommand: 'git merge feature-header',
    terminalSampleOutput: [
      'Updating 4d9e2f3..a3f2e1d',
      'Fast-forward',
      ' index.html | 4 ++++',
      ' 1 file changed, 4 insertions(+)',
    ],
    hint1: 'Switch to main first, then merge feature-header.',
    hint2: 'Command: git merge feature-header',
    hint3: 'Type git merge feature-header',
    requiredActionType: 'terminal',
    primaryActionLabel: 'Run git merge',
    isComplete: (_, history) => history.some((h) => h.command?.trim().startsWith('git merge')),
  },

  // 11. Resolving conflicts (Merge Conflict Arena)
  {
    step: 11,
    title: 'Resolving conflicts',
    subtitle: 'Mastering the collision',
    conceptTitle: 'When Edits Collide',
    conceptBody: 'When two developers modify the same line, Git stops and asks human intelligence to choose the solution.',
    forgeMessage: "Don't panic when you see conflict markers! Git is protecting your code from accidental overwrites.",
    commandId: 'conflict',
    expectedCommand: 'git status',
    whatsHappeningSteps: [
      { number: 1, title: 'Collision detected', description: 'Both branches modified identical lines.' },
      { number: 2, title: 'Conflict markers placed', description: 'Git writes <<<<<<< HEAD and >>>>>>> into the file.' },
      { number: 3, title: 'You select the resolution', description: 'Accept yours, accept theirs, or combine both.' },
      { number: 4, title: 'Stage and commit', description: 'Staging marks the conflict as resolved.' },
    ],
    keyTakeaways: [
      'Conflicts are normal in collaborative software development.',
      'Git never deletes code silently; it pauses for human judgment.',
      'Remove conflict markers before committing.',
      'Stage the resolved file with git add, then git commit.',
    ],
    terminalSampleCommand: 'git status',
    terminalSampleOutput: [
      'You have unmerged paths.',
      '  (fix conflicts and run "git commit")',
      'Unmerged paths:',
      '  both modified:   index.html',
    ],
    hint1: 'Review the conflict markers in the visualizer.',
    hint2: 'Choose your preferred resolution.',
    hint3: 'Command: git status',
    requiredActionType: 'terminal',
    primaryActionLabel: 'Inspect Conflict Status',
    isComplete: () => true,
  },

  // 12. Working with others (Remotes & Collaboration)
  {
    step: 12,
    title: 'Working with others',
    subtitle: 'The professional developer workflow',
    conceptTitle: 'The Modern Git Rhythm',
    conceptBody: 'You know the complete developer rhythm: branch, edit, test, stage, commit, push, review, and merge!',
    forgeMessage: "🎉 You did it! You have built a true, lasting mental model of Git. You are ready for real engineering teams!",
    commandId: 'push',
    whatsHappeningSteps: [
      { number: 1, title: 'Daily developer rhythm', description: 'Branch -> Edit -> Stage -> Commit -> Push.' },
      { number: 2, title: 'Code reviews & PRs', description: 'Teammates review commits before merging.' },
      { number: 3, title: 'Continuous integration', description: 'Automated tests run on every push.' },
      { number: 4, title: 'Production release', description: 'Clean history deploys to the world.' },
    ],
    keyTakeaways: [
      'You understand where your files sit: Desk vs Box vs Snapshot.',
      'You know how commits travel to GitHub with git push.',
      'You know how to branch and merge without fear.',
      'You are ready to work like a professional software engineer!',
    ],
    terminalSampleCommand: 'git log --graph --oneline',
    terminalSampleOutput: [
      '* a3f2e1d (HEAD -> main, origin/main) Add contact page',
      '* 4d9e2f3 Initial commit',
    ],
    hint1: 'Celebrate! You completed the Foundations.',
    hint2: 'Click "Enter Developer IDE" to write real code.',
    hint3: 'You have mastered Git foundations.',
    requiredActionType: 'inspect',
    primaryActionLabel: 'Enter Developer IDE →',
    isComplete: () => true,
  },
];
