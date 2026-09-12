export interface First10Step {
  step: number;
  title: string;
  subtitle: string;
  conceptTitle: string;
  conceptBody: string;
  forgeMessage: string;
  hint1: string;
  hint2: string;
  hint3: string;
  requiredActionType: 'terminal' | 'editor' | 'predict' | 'inspect';
  expectedCommand?: string;
  editorTargetFile?: string;
  editorExpectedText?: string;
  predictQuestion?: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  highlightArea?: 'explorer' | 'terminal' | 'editor' | 'three-area' | 'inspector';
  whyExplanation: {
    whatHappened: string;
    why: string;
    whatChanged: string;
    whatDidNotChange: string;
  };
}

export const FIRST_10_MINUTES_STEPS: First10Step[] = [
  {
    step: 1,
    title: 'Welcome to Your Workspace',
    subtitle: 'What is a project, and why do we need Git?',
    conceptTitle: 'The Developer Environment',
    conceptBody: 'On the left is your File Explorer. In the middle is your Code Editor and Live Website Preview. On the bottom is your Terminal. Right now, this is just a regular folder on your computer. If you make a mistake or delete a file, there is no undo history yet!',
    forgeMessage: "👋 Hi there! I'm Forge, your senior dev mentor. Don't worry if you've never coded or used a terminal before. We're going to take it step by step. First, take a look around your workspace.",
    hint1: 'Look at the file tree on the left. You will see index.html, style.css, and script.js.',
    hint2: 'Click on index.html to see the website code.',
    hint3: 'Click "I understand, let\'s continue" to proceed to the terminal.',
    requiredActionType: 'inspect',
    highlightArea: 'explorer',
    whyExplanation: {
      whatHappened: 'You explored the files of a basic web project.',
      why: 'Developers always inspect the project structure before running any commands.',
      whatChanged: 'Nothing in the repository changed.',
      whatDidNotChange: 'No Git repository exists yet.',
    },
  },
  {
    step: 2,
    title: 'The Terminal: Talking to Your Computer',
    subtitle: 'You → Terminal → Computer',
    conceptTitle: 'What is a Terminal?',
    conceptBody: 'A terminal is simply a text-based conversational window into your computer. Instead of clicking icons with a mouse, you type concise instructions called commands and press Enter. The computer executes them and replies with text.',
    forgeMessage: 'Think of the terminal like texting your computer. You send a text message instruction, and the computer immediately texts you back the answer.',
    hint1: 'Click into the terminal prompt on the bottom right.',
    hint2: 'Notice the cursor blinking after the dollar sign ($).',
    hint3: 'Click Next or type pwd to see where you are.',
    requiredActionType: 'inspect',
    highlightArea: 'terminal',
    whyExplanation: {
      whatHappened: 'You learned what a terminal is.',
      why: 'Git is primarily operated through the command line in professional developer environments.',
      whatChanged: 'No files were altered.',
      whatDidNotChange: 'Your computer is waiting for your first command.',
    },
  },
  {
    step: 3,
    title: 'Where Am I? (pwd)',
    subtitle: 'Ask the computer for your current location',
    conceptTitle: 'Print Working Directory',
    conceptBody: 'Before doing anything, developers always verify their location. The `pwd` command stands for "Print Working Directory". It tells you which folder your terminal is currently sitting in.',
    forgeMessage: "Let's run your very first terminal command! Type `pwd` and press Enter.",
    hint1: 'Type the letters `pwd` in lowercase.',
    hint2: 'Press the Enter key on your keyboard after typing pwd.',
    hint3: 'Command: pwd',
    requiredActionType: 'terminal',
    expectedCommand: 'pwd',
    highlightArea: 'terminal',
    whyExplanation: {
      whatHappened: 'The computer printed your active folder path: `/workspace/personal-website`.',
      why: 'Knowing where you are ensures you don\'t create or delete files in the wrong directory.',
      whatChanged: 'Your screen displayed the current folder path.',
      whatDidNotChange: 'No files or Git history were modified.',
    },
  },
  {
    step: 4,
    title: 'Turn This Folder Into a Git Repository (git init)',
    subtitle: 'Grant your project the power of time travel',
    conceptTitle: 'Initializing Git',
    conceptBody: 'Right now, this folder is unaware of Git. To tell Git to start watching this project, we run `git init`. This creates a hidden database folder named `.git` where all your future snapshots will be stored.',
    forgeMessage: "Ready to give your project superpowers? Type `git init` and hit Enter. Watch the File Explorer and the Git visualizer when you do!",
    hint1: 'Type `git init` in the terminal.',
    hint2: 'Make sure there is a space between `git` and `init`.',
    hint3: 'Command: git init',
    requiredActionType: 'terminal',
    expectedCommand: 'git init',
    highlightArea: 'terminal',
    whyExplanation: {
      whatHappened: 'Git initialized an empty repository and created the hidden `.git` database.',
      why: 'This equips your project with version control tracking, branches, and commit capabilities.',
      whatChanged: 'A `.git` database folder now exists. Git is now actively monitoring this workspace.',
      whatDidNotChange: 'Your source files (index.html, style.css) were not touched.',
    },
  },
  {
    step: 5,
    title: 'Ask Git What It Sees (git status)',
    subtitle: 'Your situational awareness radar',
    conceptTitle: 'The Status Command',
    conceptBody: '`git status` is the single most important command in Git. It is 100% read-only and safe to run anytime. It tells you which branch you are on, what files have changed, what is staged, and what Git is ignoring.',
    forgeMessage: "Professional developers run `git status` constantly — before and after almost every command! Let's check what Git sees right now.",
    hint1: 'Type `git status` in the terminal and press Enter.',
    hint2: 'git status will list untracked files in red.',
    hint3: 'Command: git status',
    requiredActionType: 'terminal',
    expectedCommand: 'git status',
    predictQuestion: {
      prompt: 'After running `git init`, what does Git see when you run `git status`?',
      options: [
        'It has already saved all your files into a commit automatically.',
        'It sees untracked files because we haven\'t told it what to track yet.',
        'It deleted your files because the repository was empty.',
        'It uploaded your files to GitHub.'
      ],
      correctIndex: 1,
      explanation: 'Git is deliberate and polite — it never assumes you want to track everything automatically. It lists them as "Untracked files".'
    },
    highlightArea: 'three-area',
    whyExplanation: {
      whatHappened: 'Git printed your current branch (main) and listed your existing files as "Untracked".',
      why: 'Git requires you to explicitly select which files to include in version control.',
      whatChanged: 'Nothing. git status is completely read-only.',
      whatDidNotChange: 'No files were staged or committed.',
    },
  },
  {
    step: 6,
    title: 'Modify Your Website Code in the Editor',
    subtitle: 'Make your first real project change',
    conceptTitle: 'The Working Directory at Work',
    conceptBody: 'Look at the Code Editor on the top. Open `index.html` and let\'s customize your website headline. Notice how changing the file directly affects your Working Directory!',
    forgeMessage: "Let's make this website yours! In the code editor, find the `<h1>` title inside `index.html` and change it to `<h1>Welcome to My Coffee Shop!</h1>`.",
    hint1: 'Click on index.html in the editor.',
    hint2: 'Change the text inside <h1>...</h1> to "Welcome to My Coffee Shop!" or any custom headline.',
    hint3: 'You can also click the quick button "Apply Sample Edit" if you prefer!',
    requiredActionType: 'editor',
    editorTargetFile: 'index.html',
    editorExpectedText: 'Coffee Shop',
    highlightArea: 'editor',
    whyExplanation: {
      whatHappened: 'You modified `index.html` in your Working Directory.',
      why: 'Every piece of software evolves through source code edits in the working directory.',
      whatChanged: '`index.html` now has new content on disk. Git notices it as modified.',
      whatDidNotChange: 'Git has NOT saved this change in history yet. It only exists on your local desk.',
    },
  },
  {
    step: 7,
    title: 'See What Git Noticed (git status)',
    subtitle: 'Witness the Working Directory highlight',
    conceptTitle: 'Tracking Modifications',
    conceptBody: 'Now that you edited `index.html`, let\'s ask Git what it detected. Run `git status` again.',
    forgeMessage: "Notice how Git instantly catches every edit you make? Let's check status to see how Git marks modified files.",
    hint1: 'Type `git status` in the terminal.',
    hint2: 'Look at the Three-Area visualizer above the terminal — notice the Working Directory column.',
    hint3: 'Command: git status',
    requiredActionType: 'terminal',
    expectedCommand: 'git status',
    highlightArea: 'three-area',
    whyExplanation: {
      whatHappened: 'Git reported that `index.html` is modified in your Working Directory.',
      why: 'Git compares the files on disk with its database to spot every addition, modification, or deletion.',
      whatChanged: 'Git status displayed the modified file in red/yellow.',
      whatDidNotChange: 'The file is NOT staged yet.',
    },
  },
  {
    step: 8,
    title: 'Put Changes in the Staging Box (git add index.html)',
    subtitle: 'Prepare your changes for the snapshot',
    conceptTitle: 'The Staging Area (The Box)',
    conceptBody: 'Think of the Staging Area as an open shipping box. When you run `git add index.html`, you are putting this specific file into the box so it will be included in the next snapshot. Watch the Three-Area Visualizer animate the card moving from Working Directory into Staging Area!',
    forgeMessage: "Let's stage your updated file. Type `git add index.html` and watch the card glide into the Staging Area!",
    hint1: 'Type `git add index.html` in the terminal and press Enter.',
    hint2: 'Notice the card moves from "Working Directory" to "Staging Area".',
    hint3: 'Command: git add index.html',
    requiredActionType: 'terminal',
    expectedCommand: 'git add index.html',
    highlightArea: 'three-area',
    whyExplanation: {
      whatHappened: '`index.html` was moved into the Staging Area (Index).',
      why: 'Staging lets you curate exactly what belongs in your next commit.',
      whatChanged: 'The staging area now holds the staged version of `index.html`.',
      whatDidNotChange: 'You did NOT create a commit yet! HEAD did not move.',
    },
  },
  {
    step: 9,
    title: 'Seal Your First Commit (git commit -m "...")',
    subtitle: 'Create a permanent save point in history',
    conceptTitle: 'Recording History',
    conceptBody: 'When you run `git commit -m "message"`, Git takes everything currently in the Staging Area, seals it into an immutable snapshot (with a 40-character SHA hash), moves your branch pointer forward, and empties the staging box. You can now travel back to this moment anytime in the future!',
    forgeMessage: "This is the big moment — taking your very first snapshot! Type: `git commit -m \"Add coffee shop headline\"` and press Enter.",
    hint1: 'Type `git commit -m "Add coffee shop headline"`',
    hint2: 'Make sure your message is enclosed in quotes.',
    hint3: 'Command: git commit -m "Add coffee shop headline"',
    requiredActionType: 'terminal',
    expectedCommand: 'git commit -m "Add coffee shop headline"',
    highlightArea: 'three-area',
    whyExplanation: {
      whatHappened: 'A new commit was created and sealed in the repository.',
      why: 'Commits record milestones of working code with descriptive explanations.',
      whatChanged: 'A new commit node was added to the repository DAG, HEAD and `main` advanced forward, and the Staging Area was cleared.',
      whatDidNotChange: 'Your working directory files remain in place.',
    },
  },
  {
    step: 10,
    title: 'Make a Second Change and Observe Independence',
    subtitle: 'Why commits are permanent milestones',
    conceptTitle: 'Iterative Development',
    conceptBody: 'Software is built in small, verified steps. Let\'s edit `style.css` in the editor to change the background color or button style. Notice how Git keeps your previous commit completely safe even while you experiment with new changes!',
    forgeMessage: "Open `style.css` and tweak any style rule (e.g., change accent color or padding). Then run `git status` to see how Git isolates uncommitted experiments from saved history.",
    hint1: 'Click style.css in the editor tab or file explorer.',
    hint2: 'Change a CSS rule or click "Apply Sample Style Edit".',
    hint3: 'Then run `git status` in the terminal.',
    requiredActionType: 'terminal',
    expectedCommand: 'git status',
    highlightArea: 'editor',
    whyExplanation: {
      whatHappened: 'Git detected a new modified file in your Working Directory.',
      why: 'Working Directory edits never threaten previously committed snapshots.',
      whatChanged: '`style.css` is modified in the working tree.',
      whatDidNotChange: 'Your first commit remains permanently stored in `.git`.',
    },
  },
  {
    step: 11,
    title: 'Compare What Changed (git diff)',
    subtitle: 'The red and green inspector',
    conceptTitle: 'Inspecting Changes Line by Line',
    conceptBody: 'Before staging changes, you always want to review your work. `git diff` shows you line-by-line what was added (prefixed with `+` in green) and what was removed (prefixed with `-` in red).',
    forgeMessage: "Let's see Git's built-in diff tool in action! Type `git diff` and press Enter.",
    hint1: 'Type `git diff` in the terminal.',
    hint2: 'Review the output showing green added lines and red removed lines.',
    hint3: 'Command: git diff',
    requiredActionType: 'terminal',
    expectedCommand: 'git diff',
    highlightArea: 'terminal',
    whyExplanation: {
      whatHappened: 'Git displayed a unified diff of unstaged changes in your working tree.',
      why: 'Diffing prevents bugs and accidental edits from slipping into commits.',
      whatChanged: 'Diff output was printed to the terminal.',
      whatDidNotChange: 'No files or repository state changed.',
    },
  },
  {
    step: 12,
    title: 'Inspect Your Timeline (git log --oneline)',
    subtitle: 'Congratulations, you are now using Git!',
    conceptTitle: 'Reading History',
    conceptBody: 'To see all the commits you have made, use `git log`. Adding `--oneline` shows a clean, concise list with each commit\'s short hash and message.',
    forgeMessage: "🎉 You did it! You've learned the fundamental Git mental model: Edit in Working Directory ➔ Stage with git add ➔ Commit with git commit. Run `git log --oneline` to see your timeline!",
    hint1: 'Type `git log --oneline` in the terminal.',
    hint2: 'Look at your commit hash and message displayed on the screen.',
    hint3: 'Command: git log --oneline',
    requiredActionType: 'terminal',
    expectedCommand: 'git log --oneline',
    highlightArea: 'inspector',
    whyExplanation: {
      whatHappened: 'Git printed your commit history timeline.',
      why: '`git log` allows any developer on your team to understand the evolution of the software.',
      whatChanged: 'You completed your first 10 minutes with Git!',
      whatDidNotChange: 'You now possess the core mental model that powers all professional software development.',
    },
  },
];
