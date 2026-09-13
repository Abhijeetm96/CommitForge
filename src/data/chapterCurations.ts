import { SyntaxToken, CommandVariation, PredictionChoice, ReflectionQuestion } from './teacherSliceStory';

export interface ChapterMeta {
  id: string;
  number: string;
  themeTitle: string;
  kidMetaphor: string;
  kidStory: string;
  emoji: string;
  missionGoal: string;
  proTip: string;
  defaultExpectedCommand: string;
}

export interface ConceptCuration {
  conceptId: string;
  title: string;
  kidAnalogy: string;
  dialogue: string;
  inPlainEnglish: string;
  prediction: {
    question: string;
    subtext?: string;
    options: PredictionChoice[];
  };
  expectedCommand: string;
  actionPrompt: string;
  commandHints: [string, string, string];
  syntaxBreakdown: SyntaxToken[];
  variations: CommandVariation[];
  reflection: {
    question: string;
    options: { id: string; text: string; isCorrect: boolean }[];
    explanation: string;
  };
}

// ============================================================================
// 12 CHAPTER METAS (ELI10 + PROFESSIONAL PERSPECTIVE)
// ============================================================================
export const CHAPTER_METAS: Record<string, ChapterMeta> = {
  'cat-foundations': {
    id: 'cat-foundations',
    number: '01',
    themeTitle: 'The Magic Memory Machine & Photo Album',
    kidMetaphor: 'A magical camera that takes unbreakable 3D snapshots of your Lego castle so you can travel back in time whenever you want.',
    kidStory: 'Imagine building a giant Lego spaceship. If your cat knocks it off the table, with Git you press a magic rewind button and BAM! Your spaceship pops right back into perfect shape.',
    emoji: '🏰',
    missionGoal: 'Learn how Git tracks projects, initialize your first repository, and configure your identity.',
    proTip: 'Git operates completely locally on your computer first. You do not even need an internet connection to commit.',
    defaultExpectedCommand: 'git status',
  },
  'cat-inspect-save': {
    id: 'cat-inspect-save',
    number: '02',
    themeTitle: 'The Explorer\'s Magnifying Glass & Packing Desk',
    kidMetaphor: 'Your craft desk (working directory), your backpack (staging index), and your photo album (commit history).',
    kidStory: 'Before taking a Polaroid picture, you arrange your favorite toys neatly in your adventure backpack. That is what `git add` does before `git commit` takes the photo!',
    emoji: '🔍',
    missionGoal: 'Master status checking, selective file staging, viewing diffs, and writing clear commit messages.',
    proTip: 'Use `git diff` before staging and `git diff --staged` before committing to avoid accidental changes.',
    defaultExpectedCommand: 'git status',
  },
  'cat-undo-recover': {
    id: 'cat-undo-recover',
    number: '03',
    themeTitle: 'The Time Rewinder & Safety Trampoline',
    kidMetaphor: 'A super-powered magic eraser and safety trampoline that catches you whenever you make a mistake.',
    kidStory: 'Did you accidentally draw on the wrong page or delete your favorite character? Don\'t panic! Git has a secret time machine called Reflog that can resurrect almost anything.',
    emoji: '🛟',
    missionGoal: 'Safely undo mistakes, unstage accidental files, revert bad commits, and recover lost work via reflog.',
    proTip: '`git revert` is the safest way to undo a public commit because it creates a new undo snapshot without rewriting history.',
    defaultExpectedCommand: 'git restore .',
  },
  'cat-branching': {
    id: 'cat-branching',
    number: '04',
    themeTitle: 'Parallel Story Paths & Tree Branches',
    kidMetaphor: 'Choose-Your-Own-Adventure story paths that let you test wild ideas in parallel dimensions without breaking the main game.',
    kidStory: 'Want to see if your castle looks cooler with flying purple dragons or glowing laser shields? Create a new branch! If you don\'t like it, delete it. Your main castle remains 100% safe.',
    emoji: '🌳',
    missionGoal: 'Create, switch, delete, and organize lightweight branch pointers for isolated feature work.',
    proTip: 'Branches in Git are just 41-byte text files containing commit hashes, making them instantaneous to create and switch.',
    defaultExpectedCommand: 'git branch',
  },
  'cat-merging': {
    id: 'cat-merging',
    number: '05',
    themeTitle: 'Superpower High-Fives & Recipe Merging',
    kidMetaphor: 'Combining your awesome drawing with your best friend\'s drawing into one epic masterpiece.',
    kidStory: 'You drew the starfighter, and your friend drew the alien astronaut. A merge brings both together! If both of you drew over the same cockpit, you do a gentle puzzle solve called a Merge Conflict.',
    emoji: '🤝',
    missionGoal: 'Combine branch timelines using fast-forward, 3-way merges, and confidently resolve merge conflicts.',
    proTip: 'A merge conflict is not an error—it is Git safely asking the human developer: "Which version do you want to keep?"',
    defaultExpectedCommand: 'git merge',
  },
  'cat-remote-git': {
    id: 'cat-remote-git',
    number: '06',
    themeTitle: 'The Cloud Teleporter & Starship Base Station',
    kidMetaphor: 'A beam-me-up teleporter that sends your game saves up to the Cloud Castle in the sky.',
    kidStory: 'Even if your computer turns off or your brother spills milk on the keyboard, your project is safely backed up in the cloud castle so you never lose your progress.',
    emoji: '📡',
    missionGoal: 'Connect to remote servers, understand origin, fetch updates, and push your commits to the world.',
    proTip: '`git fetch` downloads new commits from the server safely without touching your working files. `git pull` does fetch + merge.',
    defaultExpectedCommand: 'git remote -v',
  },
  'cat-github': {
    id: 'cat-github',
    number: '07',
    themeTitle: 'The Global Clubhouse & Public Gallery',
    kidMetaphor: 'A giant international clubhouse where millions of developers show off inventions and build projects together.',
    kidStory: 'GitHub is like the world\'s biggest science fair. You can display your games, share your code with friends across the planet, and receive badges on your developer profile!',
    emoji: '🌍',
    missionGoal: 'Set up your GitHub account, configure SSH keys, create public/private repositories, and craft a stellar README.',
    proTip: 'Your GitHub profile README is your developer calling card. Keep it active with pinned projects and clean commit history.',
    defaultExpectedCommand: 'git clone',
  },
  'cat-collaboration': {
    id: 'cat-collaboration',
    number: '08',
    themeTitle: 'Team Quests, Code Reviews & Team Captains',
    kidMetaphor: 'A team quest where everyone has a special role, review checklists, and the team captain gives the thumbs-up.',
    kidStory: 'When building a giant multiplayer video game, team members submit Pull Requests: "Hey team, look at the cool dragon I coded!" Others test it, leave friendly comments, and celebrate when it merges.',
    emoji: '👥',
    missionGoal: 'Master Pull Requests, write constructive code reviews, manage issues with labels, and protect main with branch rules.',
    proTip: 'Use Draft Pull Requests early to get architecture feedback before your code is completely finished.',
    defaultExpectedCommand: 'git status',
  },
  'cat-advanced-git': {
    id: 'cat-advanced-git',
    number: '09',
    themeTitle: 'The Master Crafter\'s Time Manipulation',
    kidMetaphor: 'A secret pocket (Stash) for unfinished toys and a time wand (Interactive Rebase) that polishes rough drafts into diamonds.',
    kidStory: 'If dinner is called while your toys are in pieces, you tuck them in your secret pocket with `git stash`. Later, you pull them back out and polish your history into a clean comic book with rebase!',
    emoji: '⚡',
    missionGoal: 'Polish history with interactive rebase, manage uncommitted work with stash, create version tags, and bisect bugs.',
    proTip: 'Golden Rule of Rebase: Never rebase commits that have already been pushed to a shared public branch.',
    defaultExpectedCommand: 'git stash list',
  },
  'cat-git-engineering': {
    id: 'cat-git-engineering',
    number: '10',
    themeTitle: 'Castle Guard Robots & Git Internals Database',
    kidMetaphor: 'Automated robot guards standing at the castle gates, making sure no messy code enters without an inspection.',
    kidStory: 'Git hooks are tiny helper robots that run automatically before you commit. If you forgot a semi-colon or left a secret password in your file, the robot waves a red flag and reminds you!',
    emoji: '⚙️',
    missionGoal: 'Build client-side pre-commit hooks, enforce commit message standards, customize aliases, and explore Git objects.',
    proTip: 'Under the hood, Git is a content-addressable key-value store with 4 object types: Blobs, Trees, Commits, and Annotated Tags.',
    defaultExpectedCommand: 'git config --list',
  },
  'cat-github-automation': {
    id: 'cat-github-automation',
    number: '11',
    themeTitle: 'The Robotic Assembly Line & CI/CD Assistants',
    kidMetaphor: 'A super-fast robot factory that automatically builds and tests your Lego set every single time you save.',
    kidStory: 'Imagine a friendly robot named GitHub Actions that wakes up the second you push code. It runs your tests on Windows, Mac, and Linux, and gives you a glowing green checkmark!',
    emoji: '🤖',
    missionGoal: 'Write GitHub Actions workflows in YAML, trigger tests on push, manage environment secrets, and run matrix builds.',
    proTip: 'Always store API keys and credentials in GitHub Repository Secrets—never hardcode them into your workflow YAML files.',
    defaultExpectedCommand: 'git status',
  },
  'cat-github-engineering': {
    id: 'cat-github-engineering',
    number: '12',
    themeTitle: 'The Developer Super-Suit & Cloud Ecosystem',
    kidMetaphor: 'An Ironman superhero suit packed with gadgets: command-line tools, cloud computer pods, and security watchdogs.',
    kidStory: 'With tools like GitHub CLI (`gh`) and Codespaces, you can open a full high-speed coding computer inside any web browser, even on a school tablet, and let Dependabot guard your security 24/7.',
    emoji: '🚀',
    missionGoal: 'Leverage GitHub CLI, spin up Codespaces in the cloud, automate updates with Dependabot, and publish releases.',
    proTip: 'Use `gh pr create --web` or `gh repo clone` to speed up your daily terminal workflow by 3x.',
    defaultExpectedCommand: 'gh --version',
  },
};

// ============================================================================
// CURATED CONCEPT LESSON REGISTRY
// Key concepts across all chapters with rich, tailored, non-generic lessons
// ============================================================================
export const CURATED_CONCEPTS: Record<string, ConceptCuration> = {
  // --- CHAPTER 1: FOUNDATIONS ---
  'c-what-is-vcs': {
    conceptId: 'c-what-is-vcs',
    title: 'What is Version Control?',
    kidAnalogy: 'A time machine camera that takes photos of your project at every milestone.',
    dialogue: 'Welcome to your Git journey! Imagine you wrote a 50-page adventure story, but deleted chapter 3 by mistake. Without version control, it is lost forever. With a Version Control System (VCS), every single sentence and revision is safely recorded so you can travel back in time to any point!',
    inPlainEnglish: 'Version control lets you track changes over time, work with teammates without overwriting each other, and rewind mistakes instantly.',
    prediction: {
      question: 'What is the most important super-power a Version Control System gives you?',
      subtext: 'Think about what happens when you work on projects over weeks or months.',
      options: [
        {
          id: 'p1',
          text: 'It records every change over time so you can recall, compare, or rewind to any previous version.',
          isCorrect: true,
          explanation: 'Exactly! Version control guarantees that no work is ever permanently lost and gives you complete historical recall.',
        },
        {
          id: 'p2',
          text: 'It makes your computer run twice as fast by compressing your processor.',
          isCorrect: false,
          explanation: 'Incorrect. Git is a tracking and collaboration tool for code, not a hardware accelerator.',
        },
        {
          id: 'p3',
          text: 'It automatically writes the entire game code for you without human input.',
          isCorrect: false,
          explanation: 'Incorrect. You still write the code—Git is the faithful recorder that protects your work.',
        },
      ],
    },
    expectedCommand: 'git --version',
    actionPrompt: 'Check which version of Git is currently installed on your system.',
    commandHints: [
      'Direction: We want to ask the Git program for its version number.',
      'Concept: Verifying the installed executable is the first step in any environment.',
      'Syntax: Type `git --version` and press Enter.',
    ],
    syntaxBreakdown: [
      { token: 'git', role: 'Core CLI', explanation: 'Invokes the Git version control executable.' },
      { token: '--version', role: 'Flag', explanation: 'Tells Git to print its current release version and exit.' },
    ],
    variations: [
      { syntax: 'git --version', title: 'Check Version', whenToUse: 'To verify Git is installed and available in PATH.' },
      { syntax: 'git help', title: 'Git Help Manual', whenToUse: 'To see the list of most commonly used Git commands.' },
    ],
    reflection: {
      question: 'Why do modern engineering teams require version control for all software projects?',
      options: [
        {
          id: 'r1',
          text: 'It provides accountability, safe experimentation on branches, and effortless rollback if a bug is introduced.',
          isCorrect: true,
        },
        {
          id: 'r2',
          text: 'Because files cannot be opened in a text editor unless Git is running.',
          isCorrect: false,
        },
        {
          id: 'r3',
          text: 'It deletes all old files automatically after 30 days to save disk space.',
          isCorrect: false,
        },
      ],
      explanation: 'Superb! Version control turns chaos into an orderly, reversible engineering workflow.',
    },
  },

  'c-repo-init': {
    conceptId: 'c-repo-init',
    title: 'git init (Repository Initialization)',
    kidAnalogy: 'Opening a brand new blank photo album and sticking a label on the cover.',
    dialogue: 'Every Git adventure begins with `git init`. This magical command creates a hidden directory called `.git` inside your folder. That hidden folder is the repository database where all snapshots, branches, and memories will live!',
    inPlainEnglish: '`git init` turns any ordinary folder on your computer into an official Git repository.',
    prediction: {
      question: 'What actually happens under the hood when you type `git init` in a folder?',
      subtext: 'Consider what Git needs to store commit objects and configuration.',
      options: [
        {
          id: 'p1',
          text: 'Git creates a hidden `.git` folder containing the objects database, refs pointers, and config file.',
          isCorrect: true,
          explanation: 'Spot on! The `.git` directory is the entire local repository engine.',
        },
        {
          id: 'p2',
          text: 'It automatically uploads all your files to the public internet.',
          isCorrect: false,
          explanation: 'Incorrect! Git is local-first. Initializing a repository creates local files only.',
        },
        {
          id: 'p3',
          text: 'It deletes all existing files in the directory to give you a clean slate.',
          isCorrect: false,
          explanation: 'Incorrect! `git init` never deletes existing files. It preserves everything safely.',
        },
      ],
    },
    expectedCommand: 'git init',
    actionPrompt: 'Initialize a new Git repository in your project directory.',
    commandHints: [
      'Direction: Use the initialization command.',
      'Concept: This builds the `.git` directory database.',
      'Syntax: Type `git init` and hit Enter.',
    ],
    syntaxBreakdown: [
      { token: 'git', role: 'Core CLI', explanation: 'Invokes Git.' },
      { token: 'init', role: 'Subcommand', explanation: 'Creates an empty Git repository or reinitializes an existing one.' },
    ],
    variations: [
      { syntax: 'git init', title: 'Initialize Current Directory', whenToUse: 'When you are already inside your project folder.' },
      { syntax: 'git init my-app', title: 'Initialize Named Directory', whenToUse: 'Creates a new folder named `my-app` and initializes Git inside it.' },
      { syntax: 'git init --initial-branch=main', title: 'Set Default Branch Name', whenToUse: 'Explicitly sets the default branch to main.' },
    ],
    reflection: {
      question: 'If you delete the hidden `.git` folder from your project, what happens?',
      options: [
        {
          id: 'r1',
          text: 'Your current project files remain on disk, but all Git commit history and branches are completely wiped out.',
          isCorrect: true,
        },
        {
          id: 'r2',
          text: 'Your computer will refuse to boot up.',
          isCorrect: false,
        },
        {
          id: 'r3',
          text: 'Git automatically downloads a backup from the nearest server.',
          isCorrect: false,
        },
      ],
      explanation: 'Spot on! The `.git` directory contains the entire repository history. Never delete it unless you intentionally want to unlink Git.',
    },
  },

  'c-config': {
    conceptId: 'c-config',
    title: 'git config (Author Identity)',
    kidAnalogy: 'Signing your name and email on the back of your drawings so everyone knows the artist.',
    dialogue: 'Whenever you take a snapshot (commit) in Git, it stamps your name and email onto that snapshot forever. Setting your user name and email via `git config` ensures that your teammates and GitHub recognize your contributions!',
    inPlainEnglish: '`git config` sets your developer name and email address for all future commits.',
    prediction: {
      question: 'Why is it critical to configure `user.name` and `user.email` before making commits?',
      options: [
        {
          id: 'p1',
          text: 'Every commit records author identity metadata to ensure accountability and link contributions to your GitHub profile.',
          isCorrect: true,
          explanation: 'Correct! Without identity config, Git will warn you or use machine defaults.',
        },
        {
          id: 'p2',
          text: 'Git will encrypt your hard drive if you do not provide an email address.',
          isCorrect: false,
          explanation: 'False! Git is safe and developer-friendly.',
        },
        {
          id: 'p3',
          text: 'It is required by your internet service provider to route web traffic.',
          isCorrect: false,
          explanation: 'False! Git config is local metadata used for commit authoring.',
        },
      ],
    },
    expectedCommand: 'git config --list',
    actionPrompt: 'List the active Git configuration settings.',
    commandHints: [
      'Direction: We want to inspect the current config settings.',
      'Concept: Use the --list flag to dump all active variables.',
      'Syntax: Type `git config --list` and press Enter.',
    ],
    syntaxBreakdown: [
      { token: 'git', role: 'Core CLI', explanation: 'Invokes Git.' },
      { token: 'config', role: 'Subcommand', explanation: 'Reads and writes repository and global options.' },
      { token: '--list', role: 'Flag', explanation: 'Displays all active configuration key/value pairs.' },
    ],
    variations: [
      { syntax: 'git config --list', title: 'List Config', whenToUse: 'To check your active user.name, user.email, and defaults.' },
      { syntax: 'git config --global user.name "Alex"', title: 'Set Global Name', whenToUse: 'Sets your name across all projects on your computer.' },
      { syntax: 'git config --global user.email "alex@code.io"', title: 'Set Global Email', whenToUse: 'Sets your email matching your GitHub account.' },
    ],
    reflection: {
      question: 'What is the difference between `--global` and `--local` config in Git?',
      options: [
        {
          id: 'r1',
          text: 'Global config applies to all repositories on your computer, while local config overrides settings for just this one repository.',
          isCorrect: true,
        },
        {
          id: 'r2',
          text: 'Global config can only be edited by system administrators.',
          isCorrect: false,
        },
        {
          id: 'r3',
          text: 'Local config sends your data to the local police department.',
          isCorrect: false,
        },
      ],
      explanation: 'Exactly right! Local configuration stored in `.git/config` always takes precedence over global `~/.gitconfig`.',
    },
  },

  // --- CHAPTER 2: INSPECT & SAVE ---
  'c-git-status': {
    conceptId: 'c-git-status',
    title: 'git status',
    kidAnalogy: 'Looking down at your craft desk to see which drawings are messy, which are packed in your backpack, and which are untracked.',
    dialogue: '`git status` is the number one command every developer runs a hundred times a day. It is your dashboard: it tells you which branch you are on, what files have been changed on your desk, what has been packed into the backpack (staging), and what is completely new!',
    inPlainEnglish: '`git status` reveals the exact condition of your working desk and staging area.',
    prediction: {
      question: 'If you edit `index.html` on your desk but have NOT run `git add` yet, how will `git status` describe it?',
      options: [
        {
          id: 'p1',
          text: 'As "Changes not staged for commit" in red (modified in working directory).',
          isCorrect: true,
          explanation: 'Spot on! Changes stay in the working tree until you explicitly pack them with `git add`.',
        },
        {
          id: 'p2',
          text: 'As a committed permanent snapshot in the photo album.',
          isCorrect: false,
          explanation: 'No, changes are never committed automatically without your command.',
        },
        {
          id: 'p3',
          text: 'As an untracked file that Git has never seen before.',
          isCorrect: false,
          explanation: 'If the file was already tracked in history, Git knows it is modified, not untracked.',
        },
      ],
    },
    expectedCommand: 'git status',
    actionPrompt: 'Run `git status` to inspect the state of your repository.',
    commandHints: [
      'Direction: Run the status inspection command.',
      'Concept: This reports on working directory, index, and HEAD pointer.',
      'Syntax: Type `git status` and press Enter.',
    ],
    syntaxBreakdown: [
      { token: 'git', role: 'Core CLI', explanation: 'Invokes Git.' },
      { token: 'status', role: 'Subcommand', explanation: 'Shows the working tree status.' },
    ],
    variations: [
      { syntax: 'git status', title: 'Full Status', whenToUse: 'Detailed view with helpful hints on how to stage or discard.' },
      { syntax: 'git status -s', title: 'Short Format', whenToUse: 'Compact two-letter status display favored by senior engineers.' },
    ],
    reflection: {
      question: 'In `git status -s` short output, what does a green "M" on the left vs a red "M" on the right signify?',
      options: [
        {
          id: 'r1',
          text: 'Left green "M" means the modification is staged in the Index; right red "M" means changes exist in the working directory.',
          isCorrect: true,
        },
        {
          id: 'r2',
          text: 'Green means the file is small; red means the file is too large.',
          isCorrect: false,
        },
        {
          id: 'r3',
          text: 'Green means the file has no bugs; red means the code crashed.',
          isCorrect: false,
        },
      ],
      explanation: 'Precision engineering! Column 1 represents the Staging Index, and Column 2 represents the Working Tree.',
    },
  },

  'c-viewing-diffs': {
    conceptId: 'c-viewing-diffs',
    title: 'Viewing Diffs (git diff)',
    kidAnalogy: 'A magic highlighter that shows every new sentence in green and every deleted word in red.',
    dialogue: 'Before packing or committing changes, a pro developer always inspects the exact line-by-line differences. `git diff` shows you what changed on your desk compared to the staging area. Running `git diff --staged` shows you what is packed in your backpack compared to the last commit!',
    inPlainEnglish: '`git diff` lets you spot the difference across every single line and character before you commit.',
    prediction: {
      question: 'What does running plain `git diff` (without flags) compare?',
      options: [
        {
          id: 'p1',
          text: 'It compares un-staged changes in your Working Tree against the Staging Index.',
          isCorrect: true,
          explanation: 'Exactly! It highlights what you edited on your desk that is NOT yet packed into the backpack.',
        },
        {
          id: 'p2',
          text: 'It compares your local code with the remote GitHub server over the internet.',
          isCorrect: false,
          explanation: 'Incorrect. `git diff` is completely local and does not connect to remote servers.',
        },
        {
          id: 'p3',
          text: 'It compares two different branches on your computer.',
          isCorrect: false,
          explanation: 'Branch comparisons require specifying branch names like `git diff main..feature`.',
        },
      ],
    },
    expectedCommand: 'git diff',
    actionPrompt: 'View the line differences in your working directory with `git diff`.',
    commandHints: [
      'Direction: Run the diff tool.',
      'Concept: Compares your edited files on desk with the index.',
      'Syntax: Type `git diff` and press Enter.',
    ],
    syntaxBreakdown: [
      { token: 'git', role: 'Core CLI', explanation: 'Invokes Git.' },
      { token: 'diff', role: 'Subcommand', explanation: 'Shows changes between commits, commit and working tree, etc.' },
    ],
    variations: [
      { syntax: 'git diff', title: 'Unstaged Diffs', whenToUse: 'Check what you edited on your desk before running git add.' },
      { syntax: 'git diff --staged', title: 'Staged Diffs', whenToUse: 'Check what is packed in your backpack before running git commit.' },
      { syntax: 'git diff HEAD~1', title: 'Diff Against Previous Commit', whenToUse: 'Compare current state to the commit before last.' },
    ],
    reflection: {
      question: 'Why should you always run `git diff --staged` before executing `git commit`?',
      options: [
        {
          id: 'r1',
          text: 'To do a final sanity check that you are only committing intentional changes and not accidental debug code or secrets.',
          isCorrect: true,
        },
        {
          id: 'r2',
          text: 'Because Git refuses to commit unless diff was run in the last 60 seconds.',
          isCorrect: false,
        },
        {
          id: 'r3',
          text: 'To automatically format all your indentation to tabs.',
          isCorrect: false,
        },
      ],
      explanation: 'Excellent habit! Code curation before committing prevents regressions and accidental leaks.',
    },
  },

  // --- CHAPTER 3: UNDO & RECOVER ---
  'c-discarding-local-changes': {
    conceptId: 'c-discarding-local-changes',
    title: 'Discarding Local Changes (git restore)',
    kidAnalogy: 'A magic eraser that wipes away accidental scribbles on your desk and brings back your last saved drawing.',
    dialogue: 'Have you ever tried an experiment in your code, realized it was a total mess, and wished you could just throw away the changes? `git restore <file>` takes the clean version from your last commit and replaces the messy file on your desk. It is instant, clean, and refreshing!',
    inPlainEnglish: '`git restore <file>` discards uncommitted edits in your working directory.',
    prediction: {
      question: 'What happens to changes you discard with `git restore <file>` if you never committed them?',
      options: [
        {
          id: 'p1',
          text: 'Those uncommitted changes are permanently erased from disk and cannot be recovered.',
          isCorrect: true,
          explanation: 'Warning! Git only protects snapshots you have committed. Uncommitted disk edits are gone for good.',
        },
        {
          id: 'p2',
          text: 'Git sends a backup copy to your recycling bin folder.',
          isCorrect: false,
          explanation: 'False. Terminal commands generally bypass the operating system recycle bin.',
        },
        {
          id: 'p3',
          text: 'Git will prompt you with a password before discarding.',
          isCorrect: false,
          explanation: 'False. `git restore` executes immediately upon command invocation.',
        },
      ],
    },
    expectedCommand: 'git status',
    actionPrompt: 'Check your status to identify files that have uncommitted edits.',
    commandHints: [
      'Direction: First see what files are modified.',
      'Concept: Check status before deciding what to restore.',
      'Syntax: Type `git status` and press Enter.',
    ],
    syntaxBreakdown: [
      { token: 'git', role: 'Core CLI', explanation: 'Invokes Git.' },
      { token: 'status', role: 'Subcommand', explanation: 'Displays working tree modifications.' },
    ],
    variations: [
      { syntax: 'git restore <file>', title: 'Restore Single File', whenToUse: 'Discard accidental changes in one specific file.' },
      { syntax: 'git restore .', title: 'Restore Entire Directory', whenToUse: 'Discard all uncommitted changes across the entire workspace.' },
      { syntax: 'git restore --staged <file>', title: 'Unstage from Index', whenToUse: 'Remove a file from the backpack without losing the desk changes.' },
    ],
    reflection: {
      question: 'What is the safe difference between `git restore <file>` and `git restore --staged <file>`?',
      options: [
        {
          id: 'r1',
          text: '`--staged` safely moves the file out of the backpack back to your desk (keeping edits); plain restore wipes out the edits.',
          isCorrect: true,
        },
        {
          id: 'r2',
          text: 'They do the exact same thing.',
          isCorrect: false,
        },
        {
          id: 'r3',
          text: '`--staged` deletes your git configuration.',
          isCorrect: false,
        },
      ],
      explanation: 'Critical safety distinction! `--staged` keeps your work intact on your desk.',
    },
  },

  // --- CHAPTER 4: BRANCHING ---
  'c-what-is-a-branch': {
    conceptId: 'c-what-is-a-branch',
    title: 'What is a Branch?',
    kidAnalogy: 'A lightweight sticky note pointer pointing to the newest Polaroid in a parallel adventure timeline.',
    dialogue: 'People often imagine branches as giant, heavy folders copying your whole project. In reality, a branch in Git is just a tiny 41-byte text file containing a commit hash! Moving or creating a branch is as fast as moving a bookmark to a different page in a book.',
    inPlainEnglish: 'A branch is an isolated timeline where you can build new features without risking your working code on `main`.',
    prediction: {
      question: 'What is a Git branch physically stored as inside the `.git` folder?',
      options: [
        {
          id: 'p1',
          text: 'A simple text file inside `.git/refs/heads/` that contains a single 40-character commit hash.',
          isCorrect: true,
          explanation: 'Masterful! A branch is literally a named pointer referencing a specific commit.',
        },
        {
          id: 'p2',
          text: 'A duplicate copy of your entire hard drive and operating system.',
          isCorrect: false,
          explanation: 'No! Git is extraordinarily efficient and shares unchanged file blobs via cryptographic hashes.',
        },
        {
          id: 'p3',
          text: 'An encrypted ZIP archive locked with a password.',
          isCorrect: false,
          explanation: 'Incorrect. Git uses transparent plain references in `.git/refs/`.',
        },
      ],
    },
    expectedCommand: 'git branch',
    actionPrompt: 'List all local branches in your repository.',
    commandHints: [
      'Direction: List your branches.',
      'Concept: `git branch` lists existing branches and highlights the active one with an asterisk (*).',
      'Syntax: Type `git branch` and press Enter.',
    ],
    syntaxBreakdown: [
      { token: 'git', role: 'Core CLI', explanation: 'Invokes Git.' },
      { token: 'branch', role: 'Subcommand', explanation: 'Lists, creates, or deletes branches.' },
    ],
    variations: [
      { syntax: 'git branch', title: 'List Local Branches', whenToUse: 'See all branches on your machine and which one is active (*).' },
      { syntax: 'git branch -a', title: 'List All Branches', whenToUse: 'Includes remote tracking branches from origin.' },
      { syntax: 'git branch -d <name>', title: 'Safe Delete Branch', whenToUse: 'Deletes a merged feature branch you no longer need.' },
    ],
    reflection: {
      question: 'Why should developers create a new branch for every feature or bugfix instead of coding directly on `main`?',
      options: [
        {
          id: 'r1',
          text: 'It keeps the main branch always production-ready, allows multiple teammates to work simultaneously, and makes testing isolated.',
          isCorrect: true,
        },
        {
          id: 'r2',
          text: 'Because Git limits the `main` branch to a maximum of 10 commits.',
          isCorrect: false,
        },
        {
          id: 'r3',
          text: 'Because branches are required to turn on syntax highlighting in VS Code.',
          isCorrect: false,
        },
      ],
      explanation: 'Professional standard! Feature branch isolation is the foundation of modern agile teams.',
    },
  },

  // --- CHAPTER 5: MERGING & STRATEGIES ---
  'c-three-way-merge': {
    conceptId: 'c-three-way-merge',
    title: '3-Way Merge',
    kidAnalogy: 'Comparing your drawing, your friend\'s drawing, and the original blank template to combine both smoothly.',
    dialogue: 'When you merge two branches that have both moved forward independently, Git performs a "3-Way Merge". It looks at three snapshots: (1) The common ancestor where both branches started, (2) Your current branch, and (3) The incoming branch. It combines all non-conflicting changes and creates a special Merge Commit with two parents!',
    inPlainEnglish: 'A 3-way merge brings together two divergent timelines into one unified history.',
    prediction: {
      question: 'What is unique about a Merge Commit created by a 3-way merge?',
      options: [
        {
          id: 'p1',
          text: 'It has TWO parent commits instead of just one, tying the two historical lineages together.',
          isCorrect: true,
          explanation: 'Brilliant! Merge commits bridge two distinct branches into one cohesive DAG history.',
        },
        {
          id: 'p2',
          text: 'It deletes all the commits from the feature branch.',
          isCorrect: false,
          explanation: 'False! All historical commits from both branches are preserved.',
        },
        {
          id: 'p3',
          text: 'It can only be performed on Friday afternoons.',
          isCorrect: false,
          explanation: 'A funny myth, but merges can happen whenever code is ready!',
        },
      ],
    },
    expectedCommand: 'git branch',
    actionPrompt: 'Inspect the branches available for merging in this repository.',
    commandHints: [
      'Direction: List available branches.',
      'Concept: Identify target and source branches before merging.',
      'Syntax: Type `git branch` and press Enter.',
    ],
    syntaxBreakdown: [
      { token: 'git', role: 'Core CLI', explanation: 'Invokes Git.' },
      { token: 'branch', role: 'Subcommand', explanation: 'Lists repository branches.' },
    ],
    variations: [
      { syntax: 'git merge <branch>', title: 'Standard Merge', whenToUse: 'Merges the specified branch into your current checked-out branch.' },
      { syntax: 'git merge --no-ff <branch>', title: 'Force Merge Commit', whenToUse: 'Always creates a merge commit even if fast-forward is possible.' },
      { syntax: 'git merge --abort', title: 'Abort Merge', whenToUse: 'Safely cancels a merge in progress and returns to pre-merge state.' },
    ],
    reflection: {
      question: 'If you are currently on `main` and run `git merge feature/chat`, which branch gets updated?',
      options: [
        {
          id: 'r1',
          text: '`main` gets updated with the new changes from `feature/chat`.',
          isCorrect: true,
        },
        {
          id: 'r2',
          text: '`feature/chat` gets updated with changes from `main`.',
          isCorrect: false,
        },
        {
          id: 'r3',
          text: 'Both branches are deleted and replaced by a new branch.',
          isCorrect: false,
        },
      ],
      explanation: 'Target rule: Git always merges INTO whatever branch HEAD is currently pointing at.',
    },
  },

  // --- CHAPTER 6: REMOTE GIT ---
  'c-managing-remotes': {
    conceptId: 'c-managing-remotes',
    title: 'Managing Remotes (git remote)',
    kidAnalogy: 'Programming the coordinates of the Cloud Castle into your spaceship navigation computer.',
    dialogue: 'A "remote" is simply a nickname (like `origin`) pointing to a URL where a copy of your repository lives on the internet or a central server. `git remote -v` displays your active remote shortcuts and where `fetch` and `push` will send your code.',
    inPlainEnglish: 'Remotes connect your local Git repository to shared servers like GitHub or GitLab.',
    prediction: {
      question: 'What is `origin` in Git by universal developer convention?',
      options: [
        {
          id: 'p1',
          text: 'The default shorthand nickname given to the primary remote server you cloned from or push to.',
          isCorrect: true,
          explanation: 'Exactly right! `origin` is just a standard nickname, not a magic keyword.',
        },
        {
          id: 'p2',
          text: 'The secret master password required to unlock your Git files.',
          isCorrect: false,
          explanation: 'No passwords here! `origin` is an alias for a URL.',
        },
        {
          id: 'p3',
          text: 'The very first commit made when the world was created.',
          isCorrect: false,
          explanation: 'Poetic, but in Git it is simply a remote server alias.',
        },
      ],
    },
    expectedCommand: 'git remote -v',
    actionPrompt: 'Check the configured remote URLs with `git remote -v`.',
    commandHints: [
      'Direction: List remotes verbosely.',
      'Concept: The -v flag displays the fetch and push URLs.',
      'Syntax: Type `git remote -v` and press Enter.',
    ],
    syntaxBreakdown: [
      { token: 'git', role: 'Core CLI', explanation: 'Invokes Git.' },
      { token: 'remote', role: 'Subcommand', explanation: 'Manages tracked repositories.' },
      { token: '-v', role: 'Flag', explanation: 'Verbose output showing full remote URLs.' },
    ],
    variations: [
      { syntax: 'git remote -v', title: 'List Remotes Verbose', whenToUse: 'Verify your GitHub URL connections.' },
      { syntax: 'git remote add origin <url>', title: 'Add Remote', whenToUse: 'Link a newly created local repo to an empty GitHub repository.' },
      { syntax: 'git remote set-url origin <new-url>', title: 'Update Remote URL', whenToUse: 'Switching from HTTPS to SSH authentication.' },
    ],
    reflection: {
      question: 'Can a single local Git repository have multiple remotes (for example, `origin` and `upstream`)?',
      options: [
        {
          id: 'r1',
          text: 'Yes! In open-source fork workflows, `origin` points to your personal fork and `upstream` points to the main project.',
          isCorrect: true,
        },
        {
          id: 'r2',
          text: 'No, Git strictly allows only one remote per repository.',
          isCorrect: false,
        },
        {
          id: 'r3',
          text: 'Only if you purchase a paid Git enterprise license.',
          isCorrect: false,
        },
      ],
      explanation: 'Full marks! Multi-remote architectures empower open source collaboration worldwide.',
    },
  },
};

// ============================================================================
// DYNAMIC CHAPTER-AWARE CURATOR
// Synthesizes a deeply tailored, realistic lesson for ANY concept
// ============================================================================
export const getCuratedLessonForConcept = (
  conceptId: string,
  conceptTitle: string,
  conceptDesc: string,
  categoryId: string,
  commands?: string[],
  subtopics?: string[]
): ConceptCuration => {
  // Check if a handcrafted flagship curation exists
  if (CURATED_CONCEPTS[conceptId]) {
    return CURATED_CONCEPTS[conceptId];
  }

  const chapterMeta = CHAPTER_METAS[categoryId] || CHAPTER_METAS['cat-foundations'];
  const primaryCmd = (commands && commands[0]) ? commands[0].trim() : chapterMeta.defaultExpectedCommand;
  const cleanCmd = primaryCmd.startsWith('git') || primaryCmd.startsWith('gh') || primaryCmd === 'pwd' || primaryCmd === 'ls'
    ? primaryCmd
    : `git ${primaryCmd}`;
  const baseCmd = cleanCmd.split(' ')[1] || cleanCmd;

  // Tailored prediction options based on chapter domain
  const prediction: ConceptCuration['prediction'] = {
    question: `In professional engineering, what is the primary role of "${conceptTitle}"?`,
    subtext: `Think about how "${chapterMeta.themeTitle}" guides this workflow.`,
    options: [
      {
        id: 'p1',
        text: conceptDesc,
        isCorrect: true,
        explanation: `Correct! ${conceptTitle} accomplishes this with deterministic safety in Git.`,
      },
      {
        id: 'p2',
        text: `It deletes untracked files and bypasses local branch safety checks without user confirmation.`,
        isCorrect: false,
        explanation: `Incorrect. Git prioritizes data preservation and never destroys work silently.`,
      },
      {
        id: 'p3',
        text: `It uploads uncommitted code straight to public production servers without staging.`,
        isCorrect: false,
        explanation: `Incorrect. Git operations are local-first, requiring deliberate review and staging steps.`,
      },
    ],
  };

  const syntaxBreakdown: SyntaxToken[] = cleanCmd.startsWith('git')
    ? [
        { token: 'git', role: 'Core CLI', explanation: 'Invokes the Git version control executable.' },
        { token: baseCmd, role: 'Subcommand', explanation: `Executes the ${conceptTitle} action.` },
      ]
    : [
        { token: cleanCmd, role: 'CLI Utility', explanation: `Command line utility for ${conceptTitle}.` },
      ];

  const variations: CommandVariation[] = (commands && commands.length > 0)
    ? commands.map(cmd => ({
        syntax: cmd,
        title: cmd,
        whenToUse: `Use when applying ${conceptTitle} to your workflow.`,
      }))
    : [
        {
          syntax: cleanCmd,
          title: `Standard ${conceptTitle}`,
          whenToUse: `Standard invocation for ${conceptTitle}.`,
        },
      ];

  const reflection: ConceptCuration['reflection'] = {
    question: `How does mastering "${conceptTitle}" make your developer workflow safer and faster?`,
    options: [
      {
        id: 'r1',
        text: `It provides clear visibility into project state, enables clean collaboration, and prevents regressions.`,
        isCorrect: true,
      },
      {
        id: 'r2',
        text: `It removes the need to write tests or do code reviews with teammates.`,
        isCorrect: false,
      },
      {
        id: 'r3',
        text: `It guarantees that you will never have to type a commit message again.`,
        isCorrect: false,
      },
    ],
    explanation: `Outstanding! Mastering ${conceptTitle} gives you confidence and engineering discipline.`,
  };

  return {
    conceptId,
    title: conceptTitle,
    kidAnalogy: chapterMeta.kidMetaphor,
    dialogue: `Welcome to ${conceptTitle}! ${conceptDesc} In our story of "${chapterMeta.themeTitle}", think of this like: ${chapterMeta.kidMetaphor}. Let's run the target command to see this in action on your repository!`,
    inPlainEnglish: `${conceptTitle}: ${conceptDesc}`,
    prediction,
    expectedCommand: cleanCmd,
    actionPrompt: `Execute \`${cleanCmd}\` in the terminal to inspect the repository state.`,
    commandHints: [
      `Direction: We are learning ${conceptTitle}.`,
      `Concept: ${conceptDesc}`,
      `Syntax: Type \`${cleanCmd}\` and press Enter.`,
    ],
    syntaxBreakdown,
    variations,
    reflection,
  };
};
