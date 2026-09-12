import { GitRepo } from '../git-engine/types';

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
  requiredActionType: 'inspect' | 'terminal' | 'editor' | 'predict';
  expectedCommand?: string;
  editorTargetFile?: string;
  editorExpectedText?: string;
  predictQuestion?: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  highlightArea?: 'explorer' | 'terminal' | 'editor' | 'three-area' | 'inspector' | 'none';
  primaryActionLabel: string;
  whyExplanation: {
    whatHappened: string;
    why: string;
    whatChanged: string;
    whatDidNotChange: string;
  };
  isComplete: (repo: GitRepo, history: { command?: string }[], stepCompletedDirectly?: boolean) => boolean;
}

export const FIRST_10_MINUTES_STEPS: First10Step[] = [
  {
    step: 1,
    title: 'What is Git?',
    subtitle: 'Step 1 of 12: A time machine for your code',
    conceptTitle: 'Git Helps Developers Track Changes',
    conceptBody:
      'Git helps developers keep track of changes to their projects. Instead of saving files as "project_v2_final_FINAL.zip", Git lets you save clean, sealed snapshots of your work so you can undo mistakes or collaborate with others safely.',
    forgeMessage:
      "👋 Hi there! I'm Forge, your senior dev mentor. We are starting from absolute zero. Let's take our first step together!",
    hint1: 'Read the concept on the screen.',
    hint2: 'Think of Git as a reliable time machine for your work.',
    hint3: 'Click "Show Me" to explore your project.',
    requiredActionType: 'inspect',
    primaryActionLabel: 'Show Me →',
    highlightArea: 'none',
    whyExplanation: {
      whatHappened: 'You learned the core purpose of Git.',
      why: 'Understanding why a tool exists makes learning its commands simple.',
      whatChanged: 'Nothing yet. We are preparing your mental model.',
      whatDidNotChange: 'No files were created or modified.',
    },
    isComplete: () => true,
  },
  {
    step: 2,
    title: 'Meet Your Project',
    subtitle: 'Step 2 of 12: Your website files',
    conceptTitle: 'A Regular Folder On Your Computer',
    conceptBody:
      'Here is your project: 📁 Personal Website. It has three files: index.html (the structure), style.css (the appearance), and script.js (the interactivity). Right now, this is just an ordinary folder. Git is not turned on yet.',
    forgeMessage:
      'These three files make up a real website. Take a look at them — in a moment, we will teach Git to watch over them.',
    hint1: 'Look at index.html, style.css, and script.js.',
    hint2: 'These are the files sitting on your disk.',
    hint3: 'Click "Continue" to meet the terminal.',
    requiredActionType: 'inspect',
    primaryActionLabel: 'Continue →',
    highlightArea: 'explorer',
    whyExplanation: {
      whatHappened: 'You inspected the project source files.',
      why: 'Developers always inspect project files before modifying them.',
      whatChanged: 'No changes were made.',
      whatDidNotChange: 'The files remain in their initial state.',
    },
    isComplete: () => true,
  },
  {
    step: 3,
    title: 'Meet the Terminal',
    subtitle: 'Step 3 of 12: Talking to your computer',
    conceptTitle: 'What is a Terminal?',
    conceptBody:
      'The terminal lets you give instructions to your computer by typing them. Instead of clicking menus with a mouse, you type concise instructions called commands and press Enter. The computer executes them and replies with text.',
    forgeMessage:
      'Think of the terminal like texting your computer. You send an instruction, and the computer texts you back!',
    hint1: 'Notice the terminal window on the screen.',
    hint2: 'You will type commands here soon.',
    hint3: 'Click "Open Terminal" to start typing.',
    requiredActionType: 'inspect',
    primaryActionLabel: 'Open Terminal →',
    highlightArea: 'terminal',
    whyExplanation: {
      whatHappened: 'You learned what a terminal is.',
      why: 'Professional Git operations happen through command line instructions.',
      whatChanged: 'The terminal is now active.',
      whatDidNotChange: 'No commands have been run yet.',
    },
    isComplete: () => true,
  },
  {
    step: 4,
    title: 'Where Are We? (pwd)',
    subtitle: 'Step 4 of 12: Ask the computer for your location',
    conceptTitle: 'Print Working Directory',
    conceptBody:
      'Before doing anything, developers always verify their location. The `pwd` command stands for "Print Working Directory". It asks the computer: "Where am I right now?"',
    forgeMessage:
      'Let\'s run your very first terminal command! Type `pwd` and press Enter, or click the button below.',
    hint1: 'Type `pwd` in the terminal.',
    hint2: 'Press Enter on your keyboard.',
    hint3: 'Command: pwd',
    requiredActionType: 'terminal',
    expectedCommand: 'pwd',
    primaryActionLabel: 'Run pwd',
    highlightArea: 'terminal',
    whyExplanation: {
      whatHappened: 'The computer printed your active folder path: `/home/developer/project`.',
      why: 'Checking your directory prevents saving files in the wrong folder.',
      whatChanged: 'The folder path was displayed in the terminal.',
      whatDidNotChange: 'No files or Git history were modified.',
    },
    isComplete: (_, history) =>
      history.some((h) => h.command?.trim() === 'pwd'),
  },
  {
    step: 5,
    title: 'What Is In This Folder? (ls)',
    subtitle: 'Step 5 of 12: List your project files',
    conceptTitle: 'Listing Directory Contents',
    conceptBody:
      'The `ls` command stands for "List". It asks the computer: "What files and folders exist in this directory?" Let\'s run `ls` to verify our website files.',
    forgeMessage:
      'Type `ls` and press Enter. You should see index.html, style.css, and script.js.',
    hint1: 'Type `ls` in the terminal.',
    hint2: 'Press Enter after typing ls.',
    hint3: 'Command: ls',
    requiredActionType: 'terminal',
    expectedCommand: 'ls',
    primaryActionLabel: 'Run ls',
    highlightArea: 'terminal',
    whyExplanation: {
      whatHappened: 'The computer listed the files in the project folder.',
      why: 'Always verify which files are present before initializing or editing.',
      whatChanged: 'File list was printed to the terminal.',
      whatDidNotChange: 'Files remain untouched.',
    },
    isComplete: (_, history) =>
      history.some((h) => h.command?.trim() === 'ls'),
  },
  {
    step: 6,
    title: "Turn On Git's Memory (git init)",
    subtitle: 'Step 6 of 12: Initialize your repository',
    conceptTitle: 'Initializing Git',
    conceptBody:
      'Let\'s turn this folder into a Git repository. Git needs to know that this project should be managed by Git. Running `git init` creates a hidden database folder named `.git`. Git can now compare your current files with the versions it has saved.',
    forgeMessage:
      'Type `git init` and hit Enter. Watch: our project is about to get the superpower of version tracking!',
    hint1: 'Type `git init` in the terminal.',
    hint2: 'Make sure there is a space between `git` and `init`.',
    hint3: 'Command: git init',
    requiredActionType: 'terminal',
    expectedCommand: 'git init',
    primaryActionLabel: 'Run git init',
    highlightArea: 'terminal',
    whyExplanation: {
      whatHappened: 'Git initialized a repository and created the hidden `.git` database.',
      why: 'This folder is now recognized by Git.',
      whatChanged: 'Git is now set up for this project.',
      whatDidNotChange: 'Your website code was not modified.',
    },
    isComplete: (repo) => repo.initialized,
  },
  {
    step: 7,
    title: 'The Three Areas of Git',
    subtitle: 'Step 7 of 12: Your visual mental model',
    conceptTitle: 'Desk ➔ Packing Box ➔ Sealed Snapshot',
    conceptBody:
      'Git has three main areas you need to remember:\n1. Your Files (Working Directory): The files on your desk where you draft code.\n2. The Packing Box (Staging Area): Where you place changes you want in your next snapshot.\n3. Saved Snapshots (Repository): Sealed historical milestones you can always return to.',
    forgeMessage:
      'This three-area mental model is the secret to mastering Git. Take a look at the visual pipeline at the top!',
    hint1: 'Look at the Three-Area visualizer above the terminal.',
    hint2: 'Desk ➔ Packing Box ➔ Snapshot.',
    hint3: 'Click "I Understand the 3 Areas" to continue.',
    requiredActionType: 'inspect',
    primaryActionLabel: 'I Understand the 3 Areas →',
    highlightArea: 'three-area',
    whyExplanation: {
      whatHappened: 'You internalized the 3 areas of Git.',
      why: 'Knowing where your file sits (Desk vs Box vs Snapshot) prevents almost every Git mistake.',
      whatChanged: 'Your mental model is in place.',
      whatDidNotChange: 'Repository state is waiting for your first edit.',
    },
    isComplete: () => true,
  },
  {
    step: 8,
    title: 'Make a Change & Check Status',
    subtitle: 'Step 8 of 12: Edit index.html and run git status',
    conceptTitle: 'What Git Sees When Files Change',
    conceptBody:
      'When you edit a file on your desk, Git can immediately tell that the file differs from its clean initial state. Let\'s make a change to `index.html`, and then run `git status` to see how Git detects it.',
    forgeMessage:
      'Click "Apply Sample Edit" or edit `index.html` in the code editor, then run `git status`.',
    hint1: 'Click "Apply Sample Edit" to change index.html.',
    hint2: 'Type `git status` in the terminal.',
    hint3: 'Command: git status',
    requiredActionType: 'editor',
    editorTargetFile: 'index.html',
    editorExpectedText: 'Coffee Shop',
    expectedCommand: 'git status',
    primaryActionLabel: 'Apply Edit & Check Status',
    highlightArea: 'editor',
    predictQuestion: {
      prompt: 'After editing index.html, which area does the change currently sit in?',
      options: [
        'On your desk (Working Directory) only',
        'Inside the packing box (Staging Area)',
        'In a permanent snapshot (Commit)',
        '🤔 I\'m not sure',
      ],
      correctIndex: 0,
      explanation:
        'When you edit code in your editor, it only changes on your desk (Working Directory). You must explicitly add it to the packing box (Staging) next!',
    },
    whyExplanation: {
      whatHappened: 'You modified `index.html` and asked Git what it sees.',
      why: '`git status` gives you situational awareness before taking any action.',
      whatChanged: '`index.html` is modified on your desk.',
      whatDidNotChange: 'The change has NOT been staged or committed.',
    },
    isComplete: (repo, history) =>
      Boolean(repo.workingDirectory['index.html']?.includes('Coffee Shop')) ||
      history.some((h) => h.command?.trim() === 'git status'),
  },
  {
    step: 9,
    title: 'See the Exact Difference (git diff)',
    subtitle: 'Step 9 of 12: The red and green line inspector',
    conceptTitle: 'Inspecting Changes Line by Line',
    conceptBody:
      'Before staging a change, developers review what they did using `git diff`. It shows exactly what lines were added (green +) or removed (red -).',
    forgeMessage:
      'Run `git diff` to inspect your headline change. Red shows the old text; green shows your new text!',
    hint1: 'Type `git diff` in the terminal.',
    hint2: 'Review the green and red diff lines.',
    hint3: 'Command: git diff',
    requiredActionType: 'terminal',
    expectedCommand: 'git diff',
    primaryActionLabel: 'Run git diff',
    highlightArea: 'terminal',
    whyExplanation: {
      whatHappened: 'Git printed a unified diff of your unsaved edits.',
      why: 'Diffing prevents mistakes and accidental debug lines from reaching commits.',
      whatChanged: 'Diff output was displayed.',
      whatDidNotChange: 'Your files were not modified.',
    },
    isComplete: (_, history) =>
      history.some((h) => h.command?.trim().startsWith('git diff')),
  },
  {
    step: 10,
    title: 'Packing the Box (git add index.html)',
    subtitle: 'Step 10 of 12: Selective staging',
    conceptTitle: 'The Staging Area',
    conceptBody:
      'To prepare a change for our next snapshot, we place it in the Staging Area (the packing box). Running `git add index.html` selectively puts this file in the box. Notice why we type `git add index.html` instead of `git add .` — selective staging lets you craft clean, focused commits!',
    forgeMessage:
      'Type `git add index.html` and press Enter. Watch the file card move into the Packing Box!',
    hint1: 'Type `git add index.html` in the terminal.',
    hint2: 'Notice the card moves from Desk to Packing Box.',
    hint3: 'Command: git add index.html',
    requiredActionType: 'terminal',
    expectedCommand: 'git add index.html',
    primaryActionLabel: 'Run git add index.html',
    highlightArea: 'three-area',
    whyExplanation: {
      whatHappened: '`index.html` was placed into the Staging Area.',
      why: 'Staging lets you choose which files belong in the next snapshot.',
      whatChanged: 'Staging box now contains `index.html`.',
      whatDidNotChange: 'You have NOT created a commit yet!',
    },
    isComplete: (repo) => Boolean(repo.index['index.html']),
  },
  {
    step: 11,
    title: 'Sealing the Snapshot (git commit -m "...")',
    subtitle: 'Step 11 of 12: Create your first permanent milestone',
    conceptTitle: 'Sealing a Commit',
    conceptBody:
      'When you run `git commit -m "Your message"`, Git takes everything currently in the packing box, seals it into a permanent snapshot with an author, timestamp, and unique fingerprint, and empties the box for your next task.',
    forgeMessage:
      'Let\'s seal the box! Run: `git commit -m "Add coffee shop headline"`',
    hint1: 'Type `git commit -m "Add coffee shop headline"`',
    hint2: 'Remember the quotes around your message.',
    hint3: 'Command: git commit -m "Add coffee shop headline"',
    requiredActionType: 'terminal',
    expectedCommand: 'git commit -m "Add coffee shop headline"',
    primaryActionLabel: 'Run git commit',
    highlightArea: 'three-area',
    whyExplanation: {
      whatHappened: 'A permanent snapshot was created in your repository.',
      why: 'Commits are save points that you can inspect or return to at any time.',
      whatChanged: 'New commit added to history. Staging box emptied.',
      whatDidNotChange: 'Your working files remain safely on your desk.',
    },
    isComplete: (repo) => Object.keys(repo.commits).length > 0,
  },
  {
    step: 12,
    title: 'Inspect Your History (git log)',
    subtitle: 'Step 12 of 12: Congratulations, you know Git!',
    conceptTitle: 'The Commit Timeline',
    conceptBody:
      'Run `git log --oneline` to see your timeline. You have mastered the fundamental rhythm of Git:\n1. Edit files on your desk\n2. Inspect changes with status & diff\n3. Pack the box with git add\n4. Seal the snapshot with git commit',
    forgeMessage:
      "🎉 You did it! You have built the authentic Git mental model. You are ready for real developer projects!",
    hint1: 'Type `git log --oneline` in the terminal.',
    hint2: 'Look at your commit hash and message in history.',
    hint3: 'Command: git log --oneline',
    requiredActionType: 'terminal',
    expectedCommand: 'git log --oneline',
    primaryActionLabel: 'Run git log --oneline',
    highlightArea: 'three-area',
    whyExplanation: {
      whatHappened: 'Git printed your commit history timeline.',
      why: '`git log` shows how your software evolved over time.',
      whatChanged: 'You completed the First 10 Minutes Golden Path!',
      whatDidNotChange: 'Your fundamentals are solid and permanent.',
    },
    isComplete: (_, history) =>
      history.some((h) => h.command?.trim().startsWith('git log')),
  },
];
