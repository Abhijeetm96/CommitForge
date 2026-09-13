import { GitRepo } from '../git-engine/types';

export const SliceState = {
  PROBLEM: 'PROBLEM',
  INITIAL_REPO_EXPLORED: 'INITIAL_REPO_EXPLORED',
  FILES_MODIFIED: 'FILES_MODIFIED',
  STATUS_OBSERVED: 'STATUS_OBSERVED',
  DIFF_OBSERVED: 'DIFF_OBSERVED',
  STAGING_EXPLAINED: 'STAGING_EXPLAINED',
  PREDICT_STAGING: 'PREDICT_STAGING',
  INDEX_HTML_STAGED: 'INDEX_HTML_STAGED',
  STAGING_VERIFIED: 'STAGING_VERIFIED',
  COMMIT_EXPLAINED: 'COMMIT_EXPLAINED',
  COMMIT_CREATED: 'COMMIT_CREATED',
  COMMIT_VERIFIED: 'COMMIT_VERIFIED',
  ENV_ACCIDENTALLY_STAGED: 'ENV_ACCIDENTALLY_STAGED',
  DANGER_EXPLAINED: 'DANGER_EXPLAINED',
  ENV_UNSTAGED: 'ENV_UNSTAGED',
  RECOVERY_VERIFIED: 'RECOVERY_VERIFIED',
  INDEPENDENT_CHALLENGE: 'INDEPENDENT_CHALLENGE',
  MASTERY_GATE: 'MASTERY_GATE',
} as const;

export type SliceState = (typeof SliceState)[keyof typeof SliceState];

export type MilestoneType = 'Problem' | 'Inspect' | 'Choose' | 'Save' | 'Fix' | 'Prove';

export interface StateDiff {
  changed: string[];
  notChanged: string[];
}

export interface SyntaxToken {
  token: string;
  role: string;
  explanation: string;
}

export interface CommandVariation {
  syntax: string;
  title: string;
  whenToUse: string;
  watchOut?: string;
}

export interface PredictionChoice {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ReflectionQuestion {
  question: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
}

export interface MasteryRequirements {
  stateTransition?: (repo: GitRepo, history: string[]) => boolean;
  reflection?: boolean;
  prediction?: boolean;
  explanation?: boolean;
}

export interface TeachingStep {
  id: SliceState;
  stepIndex: number;
  totalSteps: number;
  milestone: MilestoneType;
  milestoneLabel: string;
  title: string;
  seniorDeveloperDialogue: string;
  inPlainEnglish?: string;

  // Visual highlights for current focus
  highlightArea?: 'working' | 'staging' | 'commits';

  // State diff shown after actions
  stateDiff?: StateDiff;

  // Interactive prediction phase
  prediction?: {
    question: string;
    subtext?: string;
    options: PredictionChoice[];
  };

  // Expected command / action
  actionPrompt?: string;
  expectedCommand?: string;
  commandHints?: string[]; // 1: Direction, 2: Concept, 3: Syntax

  // Syntax and variations
  syntaxBreakdown?: SyntaxToken[];
  variations?: CommandVariation[];

  // Reflection gate before advancing
  reflection?: ReflectionQuestion;

  // Multi-dimensional mastery requirements
  masteryRequirements?: MasteryRequirements;
}

/**
 * Seeds the initial repository state for this vertical slice.
 * CRITICAL RULE: C0 (Initial website) already exists so status & diff
 * operate on tracked files cleanly without inventing new initializations.
 */
export function seedTeacherSliceRepo(): GitRepo {
  const initialHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Developer Portfolio</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Welcome to my website</h1>
</body>
</html>`;

  const initialCss = `body {
  font-family: system-ui, sans-serif;
  margin: 0;
  padding: 2rem;
  background: #0f172a;
  color: #f8fafc;
}`;

  return {
    initialized: true,
    currentDir: '/home/developer/portfolio',
    workingDirectory: {
      'index.html': initialHtml,
      'style.css': initialCss,
    },
    index: {
      'index.html': initialHtml,
      'style.css': initialCss,
    },
    head: { type: 'branch', ref: 'main' },
    branches: {
      main: {
        name: 'main',
        targetCommitHash: 'c0a1b2c',
      },
    },
    remotes: {},
    commits: {
      'c0a1b2c': {
        hash: 'c0a1b2c',
        shortHash: 'c0a1b2c',
        parents: [],
        tree: { 'index.html': 'blob_idx_c0', 'style.css': 'blob_css_c0' },
        author: 'Developer',
        email: 'dev@commitforge.dev',
        date: new Date(Date.now() - 86400000).toISOString(),
        timestamp: Date.now() - 86400000,
        message: 'Initial website setup',
        files: {
          'index.html': initialHtml,
          'style.css': initialCss,
        },
      },
    },
    tags: {},
    stash: [],
    reflog: [
      {
        index: 0,
        fromHash: '',
        toHash: 'c0a1b2c',
        action: 'commit (initial)',
        message: 'commit: Initial website setup',
        timestamp: Date.now() - 86400000,
      },
    ],
    mergeState: null,
    rebaseState: null,
    bisectState: null,
    config: {
      'user.name': 'Developer',
      'user.email': 'dev@commitforge.dev',
      'init.defaultBranch': 'main',
    },
    // Exclude .env so it behaves as an untracked file initially
    ignoredPatterns: ['node_modules', '*.log', 'dist', 'build', '.DS_Store'],
    hooks: {},
  };
}

export const TEACHING_STEPS: TeachingStep[] = [
  // =========================================================================
  // MILESTONE: Problem
  // =========================================================================
  {
    id: SliceState.PROBLEM,
    stepIndex: 1,
    totalSteps: 18,
    milestone: 'Problem',
    milestoneLabel: 'The Problem: Why do we need Git?',
    title: 'The Need for Save Points',
    seniorDeveloperDialogue:
      'Imagine you spent all Monday building your portfolio website. On Tuesday you tweak the layout and try out some new colors. On Wednesday morning you make another small tweak, and suddenly the whole page breaks. You desperately wish you could turn back the clock to Monday’s working version.\n\nThat is the basic problem Git solves: it creates permanent, reliable save points in your project that you can always return to.',
    inPlainEnglish:
      'Without Git, developers used to save folders like "portfolio-final-v2-ACTUAL-FINAL". Git replaces that mess with precise, clean snapshots.',
    highlightArea: 'working',
    actionPrompt: 'Click to see how Git organizes your work',
    masteryRequirements: {
      explanation: true,
    },
  },
  {
    id: SliceState.INITIAL_REPO_EXPLORED,
    stepIndex: 2,
    totalSteps: 18,
    milestone: 'Problem',
    milestoneLabel: 'The Working Tree & Repository',
    title: 'Your Computer Desk & The Vault',
    seniorDeveloperDialogue:
      'We already have our portfolio in a Git repository with an initial save point `C0`. Notice the two areas in front of you:\n\n1. Your Working Tree: The actual files currently sitting on your computer disk that you open in your code editor.\n2. The Repository: The hidden `.git` folder that acts as your project’s permanent time vault.',
    inPlainEnglish:
      'Working Tree = your physical desk where work happens.\nRepository = the archival vault storing every snapshot you ever took.',
    highlightArea: 'working',
    actionPrompt: 'Let’s start making today’s updates',
    masteryRequirements: {
      explanation: true,
    },
  },

  // =========================================================================
  // MILESTONE: Inspect
  // =========================================================================
  {
    id: SliceState.FILES_MODIFIED,
    stepIndex: 3,
    totalSteps: 18,
    milestone: 'Inspect',
    milestoneLabel: 'Changes on Your Desk',
    title: 'Work Happens on Your Desk',
    seniorDeveloperDialogue:
      'You just worked on two files:\n• `index.html`: You added a finished hero header section.\n• `style.css`: You started tweaking button colors, but haven’t finished yet.\n\nGit immediately detects that the files on your disk no longer match the `C0` snapshot. Before doing anything else, senior developers always check situational awareness.',
    inPlainEnglish:
      'Never guess what changed. Always inspect what Git sees on your desk before deciding your next move.',
    highlightArea: 'working',
    actionPrompt: 'Ask Git what is happening on your desk',
    expectedCommand: 'git status',
    commandHints: [
      'We want to check the current status of our working files.',
      'Think of the command that inspects the repository state.',
      'Type: git status',
    ],
    masteryRequirements: {
      stateTransition: (_repo, history) => history.some(cmd => cmd.trim() === 'git status'),
    },
  },
  {
    id: SliceState.STATUS_OBSERVED,
    stepIndex: 4,
    totalSteps: 18,
    milestone: 'Inspect',
    milestoneLabel: 'Reading Git Status',
    title: 'Situational Awareness with Status',
    seniorDeveloperDialogue:
      'Look at Git’s output. It tells you:\n`Changes not staged for commit:`\n`  modified:   index.html`\n`  modified:   style.css`\n\nGit recognizes both files are modified compared to snapshot C0. But notice the key phrase: "not staged for commit". Git sees the changes, but you haven’t told Git to prepare them for a snapshot yet.',
    inPlainEnglish:
      'Git is telling you: "I see you edited two files, but you haven\'t packed either of them into the snapshot box yet."',
    highlightArea: 'working',
    syntaxBreakdown: [
      { token: 'git', role: 'Command Line Tool', explanation: 'Tells the computer to run the Git version control system.' },
      { token: 'status', role: 'Subcommand', explanation: 'Inspects and reports the state of the working tree and staging area.' },
    ],
    variations: [
      { syntax: 'git status', title: 'Standard Full Status', whenToUse: 'Default daily check for full situational awareness.' },
      { syntax: 'git status -s', title: 'Short Format', whenToUse: 'Compact view showing "M" or "??" next to files for quick terminal reading.' },
    ],
    actionPrompt: 'Now let’s inspect the exact lines of code that changed',
    masteryRequirements: {
      explanation: true,
    },
  },
  {
    id: SliceState.DIFF_OBSERVED,
    stepIndex: 5,
    totalSteps: 18,
    milestone: 'Inspect',
    milestoneLabel: 'Inspecting Code Line by Line',
    title: 'Exact Diffs with git diff',
    seniorDeveloperDialogue:
      'We know two files changed. But what exact code was added or deleted? Let’s run `git diff` to see the line-by-line differences.',
    inPlainEnglish:
      'git diff is like a red and green highlighter: green lines are additions, red lines are removals.',
    highlightArea: 'working',
    actionPrompt: 'Inspect the line-by-line diff',
    expectedCommand: 'git diff',
    commandHints: [
      'We want to view differences between our working files and the last snapshot.',
      'The command name is short for "difference".',
      'Type: git diff',
    ],
    masteryRequirements: {
      stateTransition: (_repo, history) => history.some(cmd => cmd.trim() === 'git diff'),
    },
  },

  // =========================================================================
  // MILESTONE: Choose
  // =========================================================================
  {
    id: SliceState.STAGING_EXPLAINED,
    stepIndex: 6,
    totalSteps: 18,
    milestone: 'Choose',
    milestoneLabel: 'The Staging Decision',
    title: 'Why Staging Exists: The Packing Box',
    seniorDeveloperDialogue:
      'Here is the critical situation every real developer faces:\n• Your hero header in `index.html` is completely finished, tested, and ready.\n• Your styling changes in `style.css` are half-done and look broken.\n\nYou want to save ONLY `index.html` right now. You do NOT want broken CSS saved into your history.\n\nWithout staging, Git would force you to commit everything. Staging is your packing box—it lets you choose exactly which changes belong in the next snapshot.',
    inPlainEnglish:
      'Think of staging like a cardboard packing box. You put only the items you want into the box before taping it shut.',
    highlightArea: 'staging',
    actionPrompt: 'Let’s predict which file belongs in the box',
    masteryRequirements: {
      explanation: true,
    },
  },
  {
    id: SliceState.PREDICT_STAGING,
    stepIndex: 7,
    totalSteps: 18,
    milestone: 'Choose',
    milestoneLabel: 'Before You Run the Command',
    title: 'Prediction: Making the Right Staging Choice',
    seniorDeveloperDialogue:
      'Before we type any command, let’s test your reasoning. Based on our goal (saving the finished hero section while leaving broken CSS for later), which file should enter the staging box?',
    prediction: {
      question: 'Which file should be placed into the staging area right now?',
      subtext: 'Consider which change is finished and ready to be committed.',
      options: [
        { id: 'css', text: 'style.css (half-finished button styling)', isCorrect: false, explanation: 'Not yet! Remember, the CSS is half-finished and looks broken. We want to keep working on it later.' },
        { id: 'both', text: 'Both index.html and style.css', isCorrect: false, explanation: 'Committing both would record broken CSS into your project history. Staging lets us be selective!' },
        { id: 'html', text: 'index.html (finished hero header)', isCorrect: true, explanation: 'Exactly right! We stage index.html because it is tested and complete. style.css stays on our desk.' },
      ],
    },
    highlightArea: 'staging',
    masteryRequirements: {
      prediction: true,
    },
  },
  {
    id: SliceState.INDEX_HTML_STAGED,
    stepIndex: 8,
    totalSteps: 18,
    milestone: 'Choose',
    milestoneLabel: 'Executing the Staging Action',
    title: 'Putting index.html in the Staging Box',
    seniorDeveloperDialogue:
      'Great prediction. Now let’s tell Git to stage `index.html`. We use the `git add` command followed by the filename.',
    inPlainEnglish:
      'git add does not create a commit. It merely places the specified changes into the staging box.',
    highlightArea: 'staging',
    syntaxBreakdown: [
      { token: 'git', role: 'Command Line Tool', explanation: 'Run the Git program.' },
      { token: 'add', role: 'Subcommand', explanation: 'Stages file changes from your working tree into the index for the next commit.' },
      { token: 'index.html', role: 'Target File', explanation: 'The specific file whose current contents should be staged.' },
    ],
    variations: [
      { syntax: 'git add <file>', title: 'Stage One File (Safest)', whenToUse: 'When you want to craft clean, focused commits containing only specific files.' },
      { syntax: 'git add .', title: 'Stage Current Directory', whenToUse: 'When you intentionally want all modified and new files staged. Watch out for staging unintended files!' },
      { syntax: 'git add -p', title: 'Patch / Interactive Staging', whenToUse: 'When you made multiple changes in ONE file and only want to stage some lines (hunks).' },
    ],
    actionPrompt: 'Stage index.html in the terminal',
    expectedCommand: 'git add index.html',
    commandHints: [
      'Use the add command with the target filename.',
      'Specify index.html after git add.',
      'Type: git add index.html',
    ],
    masteryRequirements: {
      stateTransition: (repo) => repo.index['index.html'] !== undefined && repo.index['index.html'] !== repo.commits['c0a1b2c']?.files['index.html'],
    },
  },
  {
    id: SliceState.STAGING_VERIFIED,
    stepIndex: 9,
    totalSteps: 18,
    milestone: 'Choose',
    milestoneLabel: 'What Changed vs What Did NOT Change',
    title: 'Observing the Staged State',
    seniorDeveloperDialogue:
      'Pause right here and observe the state in front of you. This is where many beginners get confused, so let’s be crystal clear about what just happened:',
    stateDiff: {
      changed: [
        'index.html is now in the Staging Area ("Changes to be committed").',
        'Git is prepared to snapshot index.html in the next commit.',
      ],
      notChanged: [
        'style.css is STILL modified on your desk in the Working Tree (unstaged).',
        'Your actual files on disk were not altered or moved.',
        'NO commit has been created yet. git add ≠ git commit!',
      ],
    },
    reflection: {
      question: 'In your own words, what did git add index.html actually do?',
      options: [
        { id: '1', text: 'It created a permanent save point in the repository history.', isCorrect: false },
        { id: '2', text: 'It staged the current edits of index.html into the packing box, leaving style.css unstaged.', isCorrect: true },
        { id: '3', text: 'It uploaded index.html to GitHub.', isCorrect: false },
      ],
      explanation: 'Precisely. git add only prepares selected changes in the staging box. It does not create a commit or touch remote servers.',
    },
    highlightArea: 'staging',
    actionPrompt: 'Confirm understanding to proceed to committing',
    masteryRequirements: {
      reflection: true,
    },
  },

  // =========================================================================
  // MILESTONE: Save
  // =========================================================================
  {
    id: SliceState.COMMIT_EXPLAINED,
    stepIndex: 10,
    totalSteps: 18,
    milestone: 'Save',
    milestoneLabel: 'Sealing the Snapshot',
    title: 'The Commit: A Permanent Milestone',
    seniorDeveloperDialogue:
      'Our packing box holds `index.html`. Now let’s seal and label it.\n\nIn Git, a permanent snapshot is called a **commit**. Every commit records:\n• A unique fingerprint hash\n• The exact contents of what was in the staging box\n• The author and timestamp\n• A message explaining WHY the change was made\n\n⚠️ Golden Rule: A commit is recorded in your local repository. It is NOT sent to GitHub yet. Commit = local snapshot. Push = upload to remote.',
    inPlainEnglish:
      'Committing is like taping your packing box shut, stamping today’s date on it, and storing it safely in your warehouse.',
    highlightArea: 'commits',
    actionPrompt: 'Ready to record the commit',
    masteryRequirements: {
      explanation: true,
    },
  },
  {
    id: SliceState.COMMIT_CREATED,
    stepIndex: 11,
    totalSteps: 18,
    milestone: 'Save',
    milestoneLabel: 'Executing the Commit',
    title: 'Recording Commit C1',
    seniorDeveloperDialogue:
      'Let’s create our commit using `git commit -m "Add hero header to homepage"`. Always write commit messages that tell future teammates (and future you) what and why you changed it.',
    highlightArea: 'commits',
    syntaxBreakdown: [
      { token: 'git', role: 'Command Line Tool', explanation: 'Run the Git program.' },
      { token: 'commit', role: 'Subcommand', explanation: 'Records the current staged changes as a new snapshot in project history.' },
      { token: '-m', role: 'Message Flag', explanation: 'Tells Git that the commit message follows in quotes.' },
      { token: '"Add hero header to homepage"', role: 'Commit Message', explanation: 'A concise summary of the intent behind this change.' },
    ],
    variations: [
      { syntax: 'git commit -m "Message"', title: 'Standard Commit', whenToUse: 'Standard way to commit staged changes with a concise message.' },
      { syntax: 'git commit --amend', title: 'Amend Last Commit', whenToUse: 'Fix a typo in your last commit message or add a forgotten file to the most recent commit before pushing.' },
    ],
    actionPrompt: 'Create the commit in the terminal',
    expectedCommand: 'git commit -m "Add hero header to homepage"',
    commandHints: [
      'Use git commit with the -m flag and a message.',
      'Remember to put your message in quotation marks.',
      'Type: git commit -m "Add hero header to homepage"',
    ],
    masteryRequirements: {
      stateTransition: (repo) => Object.keys(repo.commits).length >= 2,
    },
  },
  {
    id: SliceState.COMMIT_VERIFIED,
    stepIndex: 12,
    totalSteps: 18,
    milestone: 'Save',
    milestoneLabel: 'Verifying What Changed and What Remained',
    title: 'Inspecting Your New Milestone',
    seniorDeveloperDialogue:
      'Congratulations! Snapshot `C1` is permanently recorded in your repository history. Look at the state now:',
    stateDiff: {
      changed: [
        'Staging area is now empty (the packed changes were sealed into the commit).',
        'Commit history advanced: C1 is recorded with your message.',
        'HEAD pointer moved forward to C1.',
      ],
      notChanged: [
        'style.css is STILL modified in your Working Tree, untouched and ready for you to finish later!',
        'No changes were sent to GitHub or any remote server.',
      ],
    },
    reflection: {
      question: 'Where does your new commit C1 currently exist?',
      options: [
        { id: '1', text: 'On GitHub, visible to the whole world.', isCorrect: false },
        { id: '2', text: 'Only in your local Git repository on your computer disk.', isCorrect: true },
        { id: '3', text: 'In temporary computer RAM that disappears when you turn off the computer.', isCorrect: false },
      ],
      explanation: 'Correct! Commits are 100% saved locally on your computer. They do not appear on GitHub until you explicitly push.',
    },
    highlightArea: 'commits',
    actionPrompt: 'Now let’s learn what happens when you make a mistake',
    masteryRequirements: {
      reflection: true,
    },
  },

  // =========================================================================
  // MILESTONE: Fix
  // =========================================================================
  {
    id: SliceState.ENV_ACCIDENTALLY_STAGED,
    stepIndex: 13,
    totalSteps: 18,
    milestone: 'Fix',
    milestoneLabel: 'A Real Developer Mistake',
    title: 'The Accidental .env Staging',
    seniorDeveloperDialogue:
      'Now let’s experience a real-life situation that every developer encounters. You added a `.env` file on your desk containing secret API keys: `STRIPE_SECRET_KEY=sk_live_secret123`.\n\nWithout thinking, you run:\n`git add .env`\n\nNotice the staging area now has a ⚠️ SECURITY WARNING: A secret file is in the staging box!',
    inPlainEnglish:
      'You accidentally put an envelope containing your private house keys into the mail delivery box.',
    highlightArea: 'staging',
    actionPrompt: 'Stage .env to see the consequence',
    expectedCommand: 'git add .env',
    commandHints: [
      'We want to simulate staging the .env file.',
      'Type: git add .env',
    ],
    masteryRequirements: {
      stateTransition: (repo) => repo.index['.env'] !== undefined,
    },
  },
  {
    id: SliceState.DANGER_EXPLAINED,
    stepIndex: 14,
    totalSteps: 18,
    milestone: 'Fix',
    milestoneLabel: 'Understanding the Danger',
    title: 'Don’t Panic: It’s Not Published Yet',
    seniorDeveloperDialogue:
      'Take a breath: Git has NOT published your secret key. It has only placed `.env` in the staging box.\n\nThe danger is: if you were to run `git commit` right now, that secret key would be sealed into the repository history.\n\nWe need to take `.env` out of the staging box without deleting the file from your computer.',
    inPlainEnglish:
      'Your keys are in the box, but the box has not been mailed yet. We just need to take them back out.',
    highlightArea: 'staging',
    actionPrompt: 'Learn the safe recovery command',
    masteryRequirements: {
      explanation: true,
    },
  },
  {
    id: SliceState.ENV_UNSTAGED,
    stepIndex: 15,
    totalSteps: 18,
    milestone: 'Fix',
    milestoneLabel: 'Safe Recovery with git restore --staged',
    title: 'Taking .env Out of the Staging Box',
    seniorDeveloperDialogue:
      'To unstage a file safely, Git provides:\n`git restore --staged .env`\n\nThis tells Git: "Restore the staging area for `.env` to its previous state (empty), but do NOT touch or delete the file on my disk."',
    highlightArea: 'staging',
    syntaxBreakdown: [
      { token: 'git', role: 'Command Line Tool', explanation: 'Run Git.' },
      { token: 'restore', role: 'Subcommand', explanation: 'Restores specified paths in the working tree or staging area.' },
      { token: '--staged', role: 'Staged Flag', explanation: 'Crucial flag! Directs restore to act on the STAGING AREA, keeping your working tree file safe.' },
      { token: '.env', role: 'Target File', explanation: 'The file to remove from the staging box.' },
    ],
    actionPrompt: 'Run git restore --staged .env in the terminal',
    expectedCommand: 'git restore --staged .env',
    commandHints: [
      'Use git restore with the --staged flag.',
      'Target .env: git restore --staged .env',
    ],
    masteryRequirements: {
      stateTransition: (repo) => repo.index['.env'] === undefined && repo.workingDirectory['.env'] !== undefined,
    },
  },
  {
    id: SliceState.RECOVERY_VERIFIED,
    stepIndex: 16,
    totalSteps: 18,
    milestone: 'Fix',
    milestoneLabel: 'Verifying Recovery & Future Protection',
    title: 'Safe and Intact: The Professional Habit',
    seniorDeveloperDialogue:
      'Look at your desk and staging area now:\n• Staging Area: Clean! `.env` is completely removed from the staging box.\n• Working Tree: `.env` is still right here on your computer with your secret keys intact!\n\n💡 Professional Habit Teaser: In a future chapter, we will learn about `.gitignore`. By listing `.env` inside `.gitignore`, Git will automatically ignore `.env` so you can never accidentally stage it in the first place.',
    stateDiff: {
      changed: [
        '.env was removed from the Staging Area.',
      ],
      notChanged: [
        '.env STILL exists on your computer disk with all its contents intact!',
        'No commits were damaged or modified.',
      ],
    },
    reflection: {
      question: 'When you ran git restore --staged .env, what happened to the file on your disk?',
      options: [
        { id: '1', text: 'It was permanently deleted from your computer.', isCorrect: false },
        { id: '2', text: 'It was removed from staging, but your local file and API keys were left completely safe.', isCorrect: true },
        { id: '3', text: 'It was sent to the trash bin.', isCorrect: false },
      ],
      explanation: 'Exactly right! git restore --staged only touches the staging area index. Your actual file on disk is never harmed.',
    },
    highlightArea: 'working',
    actionPrompt: 'Ready to prove your skills in an independent challenge',
    masteryRequirements: {
      reflection: true,
    },
  },

  // =========================================================================
  // MILESTONE: Prove
  // =========================================================================
  {
    id: SliceState.INDEPENDENT_CHALLENGE,
    stepIndex: 17,
    totalSteps: 18,
    milestone: 'Prove',
    milestoneLabel: 'The Real-World Challenge',
    title: 'Independent Challenge: Deploying the Portfolio',
    seniorDeveloperDialogue:
      'You are now on your own as a junior developer preparing your portfolio for deployment.\n\nHere is what happened on your desk:\n• You finished writing `about.html` (your developer biography).\n• You also created `notes.tmp` containing messy scratch notes you do NOT want in the commit.\n\nYour Mission:\n1. Check status to see what is on your desk.\n2. Stage ONLY `about.html`.\n3. Commit with a meaningful message.\n4. Verify that `notes.tmp` was NOT committed.',
    inPlainEnglish:
      'No step-by-step command prompts. Use what you learned: inspect, choose, save, and verify.',
    highlightArea: 'working',
    actionPrompt: 'Solve the challenge using the terminal',
    masteryRequirements: {
      stateTransition: (repo) => {
        // Must have created a new commit containing about.html, and notes.tmp is NOT in that commit
        const headCommitHash = repo.branches['main']?.targetCommitHash;
        const headCommit = repo.commits[headCommitHash];
        const hasAbout = headCommit?.files['about.html'] !== undefined;
        const noNotesInCommit = headCommit?.files['notes.tmp'] === undefined;
        const notesStillOnDisk = repo.workingDirectory['notes.tmp'] !== undefined;
        return hasAbout && noNotesInCommit && notesStillOnDisk;
      },
    },
  },
  {
    id: SliceState.MASTERY_GATE,
    stepIndex: 18,
    totalSteps: 18,
    milestone: 'Prove',
    milestoneLabel: 'Conceptual Understanding Gate',
    title: 'The Final Mastery Gate',
    seniorDeveloperDialogue:
      'Your commit was successfully recorded in the repository! But before I certify your completion of this milestone, I need to know that you understand WHY it worked:',
    reflection: {
      question: 'Why didn’t notes.tmp go into your new commit?',
      options: [
        { id: '1', text: 'Because Git automatically deletes temporary files with .tmp extensions.', isCorrect: false },
        { id: '2', text: 'Because I only staged about.html; a commit only contains what was in the staging area, not everything on my desk.', isCorrect: true },
        { id: '3', text: 'Because notes.tmp was already on GitHub.', isCorrect: false },
      ],
      explanation: 'Outstanding! You don’t just know commands—you understand how Git works. You know what Git is, why staging exists, how to inspect state, how to create clean commits, and how to recover from an accidental staging mistake safely.',
    },
    highlightArea: 'commits',
    actionPrompt: 'Complete Milestone',
    masteryRequirements: {
      reflection: true,
    },
  },
];
