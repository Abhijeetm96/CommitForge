export type SceneType =
  | 'situation'
  | 'prediction'
  | 'interaction'
  | 'watch'
  | 'observe'
  | 'understand'
  | 'experiment'
  | 'command';

export interface PredictionChoice {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface FocusScene {
  id: string;
  lessonId: 'add' | 'commit' | 'push';
  lessonTitle: string;
  sceneNumber: number;
  totalScenes: number;
  type: SceneType;

  // Human concept question first (zero jargon initially)
  question?: string;
  subQuestion?: string;

  // Visual simulation world state for this scene
  visualState: {
    workingFiles: { name: string; status: 'modified' | 'untracked' | 'staged'; isSelected?: boolean; diff?: string }[];
    stagingFiles: string[];
    localCommits: { hash: string; message: string; branch?: string; isHead?: boolean; files?: string[] }[];
    remoteCommits: { hash: string; message: string; branch?: string }[];
    highlightZone?: 'working' | 'staging' | 'camera' | 'repo' | 'remote' | 'highway';
    cameraActive?: boolean;
    packetTransfer?: {
      active: boolean;
      packetLabel: string;
      stepDescription: string;
      progressPercent: number;
    };
    isInSync?: boolean;
  };

  // Prediction options if this is a prediction scene
  predictionChoices?: PredictionChoice[];

  // Primary action button or interaction prompt
  primaryActionLabel?: string;
  actionType?: 'drag_file' | 'take_snapshot' | 'drag_commit' | 'next_scene' | 'open_terminal';

  // Temporary Before / After comparisons for observe scenes
  stateComparison?: {
    before: {
      working: string;
      staging: string;
      repo: string;
      remote?: string;
    };
    after: {
      working: string;
      staging: string;
      repo: string;
      remote?: string;
    };
  };

  // Explanation and technical reveal
  mentalModelText?: string;
  technicalTerm?: string;
  technicalCommand?: string;

  // Quiet "Why did that happen?" causal explanation (hidden until clicked)
  whyExplanation?: string;

  // Progressive terminal hints (Hint 1 -> Hint 2 -> Hint 3)
  progressiveHints?: string[];

  // Single contextual Forge hint
  hint: string;
}

export interface FocusLesson {
  id: 'add' | 'commit' | 'push';
  title: string;
  conceptTitle: string;
  shortDescription: string;
  icon: string;
  scenes: FocusScene[];
}

// ONE CONTINUOUS STORY NARRATIVE:
// Lesson 1: You edit index.html and discover staging to select it.
// Lesson 2: You take a permanent snapshot commit C1 of what you staged.
// Lesson 3: You continue building (C2, C3). You see GitHub only has C2. You push C3 to sync.
export const FOCUS_LESSONS: Record<string, FocusLesson> = {
  add: {
    id: 'add',
    title: 'Selecting Changes',
    conceptTitle: 'Staging Area',
    shortDescription: 'Choose which modified files go into the next snapshot',
    icon: '📦',
    scenes: [
      {
        id: 'add-1',
        lessonId: 'add',
        lessonTitle: 'Selecting Changes',
        sceneNumber: 1,
        totalScenes: 6,
        type: 'situation',
        question: 'Something changed on your desk.',
        subQuestion: 'You just modified index.html. Notice the modified indicator on the file.',
        visualState: {
          workingFiles: [
            { name: 'index.html', status: 'modified', isSelected: true, diff: '+ <section class="hero">Welcome</section>' },
            { name: 'style.css', status: 'modified', isSelected: false, diff: '+ .hero { padding: 2rem; }' },
          ],
          stagingFiles: [],
          localCommits: [{ hash: 'C0', message: 'Initial project setup', branch: 'main', isHead: true, files: ['index.html'] }],
          remoteCommits: [],
          highlightZone: 'working',
        },
        primaryActionLabel: 'Notice Changes',
        actionType: 'next_scene',
        whyExplanation: 'Git tracks your file system. When a file is edited, Git marks it modified compared to the last snapshot.',
        hint: 'Look at your desk. index.html has an orange modified badge because its content changed.',
      },
      {
        id: 'add-2',
        lessonId: 'add',
        lessonTitle: 'Selecting Changes',
        sceneNumber: 2,
        totalScenes: 6,
        type: 'prediction',
        question: 'Where should this change go before you save a permanent version?',
        subQuestion: 'Think about where changes wait before becoming a snapshot.',
        visualState: {
          workingFiles: [
            { name: 'index.html', status: 'modified', isSelected: true },
            { name: 'style.css', status: 'modified', isSelected: false },
          ],
          stagingFiles: [],
          localCommits: [{ hash: 'C0', message: 'Initial project setup', branch: 'main', isHead: true }],
          remoteCommits: [],
          highlightZone: 'staging',
        },
        predictionChoices: [
          {
            id: 'staging-box',
            text: 'Into the 📦 Staging Box (to select it for the snapshot)',
            isCorrect: true,
            explanation: 'Exactly! The staging box is where you deliberately collect what you want to save.',
          },
          {
            id: 'cloud-direct',
            text: 'Directly to the Internet Cloud',
            isCorrect: false,
            explanation: 'Git is offline-first. You must save changes locally before you ever send anything to the cloud.',
          },
          {
            id: 'everything-blindly',
            text: 'Save every file on your computer without choosing',
            isCorrect: false,
            explanation: 'If Git saved everything blindly, half-finished experimental edits would get mixed into your history!',
          },
        ],
        whyExplanation: 'Staging gives you a buffer: you decide which changes are clean enough to save.',
        hint: 'Before taking a photo, you arrange what goes in front of the lens. Staging is where you arrange changes.',
      },
      {
        id: 'add-3',
        lessonId: 'add',
        lessonTitle: 'Selecting Changes',
        sceneNumber: 3,
        totalScenes: 6,
        type: 'interaction',
        question: 'Move index.html into the Staging Box.',
        subQuestion: 'Drag index.html from your desk directly into the box.',
        visualState: {
          workingFiles: [
            { name: 'index.html', status: 'modified', isSelected: true },
            { name: 'style.css', status: 'modified', isSelected: false },
          ],
          stagingFiles: [],
          localCommits: [{ hash: 'C0', message: 'Initial project setup', branch: 'main', isHead: true }],
          remoteCommits: [],
          highlightZone: 'staging',
        },
        primaryActionLabel: 'Drag file into staging',
        actionType: 'drag_file',
        whyExplanation: 'Dragging the file to staging prepares it to be photographed in the next snapshot commit.',
        hint: 'Click and drag index.html into the pulsing Staging Box.',
      },
      {
        id: 'add-4',
        lessonId: 'add',
        lessonTitle: 'Selecting Changes',
        sceneNumber: 4,
        totalScenes: 6,
        type: 'observe',
        question: 'Discovery: Why Staging Exists!',
        subQuestion: 'Notice that index.html is staged, while style.css remains on your desk untouched.',
        visualState: {
          workingFiles: [
            { name: 'index.html', status: 'staged', isSelected: false },
            { name: 'style.css', status: 'modified', isSelected: false },
          ],
          stagingFiles: ['index.html'],
          localCommits: [{ hash: 'C0', message: 'Initial project setup', branch: 'main', isHead: true }],
          remoteCommits: [],
          highlightZone: 'staging',
        },
        stateComparison: {
          before: {
            working: 'index.html & style.css modified',
            staging: 'Empty (nothing selected)',
            repo: 'main → C0',
          },
          after: {
            working: 'style.css still modified on desk',
            staging: '✓ index.html staged for commit',
            repo: 'main → C0',
          },
        },
        primaryActionLabel: 'I Understand Why Staging Exists',
        actionType: 'next_scene',
        whyExplanation: 'Staging allows precise, selective commits. You can commit the HTML now, and finish the CSS later.',
        hint: 'Notice how only index.html is in the box. You control exactly what gets saved.',
      },
      {
        id: 'add-5',
        lessonId: 'add',
        lessonTitle: 'Selecting Changes',
        sceneNumber: 5,
        totalScenes: 6,
        type: 'understand',
        question: 'Mental Model: Staging',
        mentalModelText: 'Staging lets you choose which changes go into your next snapshot.',
        technicalTerm: 'Staging Area (also called the "Index")',
        technicalCommand: 'git add <filename>',
        visualState: {
          workingFiles: [
            { name: 'index.html', status: 'staged' },
            { name: 'style.css', status: 'modified' },
          ],
          stagingFiles: ['index.html'],
          localCommits: [{ hash: 'C0', message: 'Initial project setup', branch: 'main', isHead: true }],
          remoteCommits: [],
          highlightZone: 'staging',
        },
        primaryActionLabel: 'Try It in Terminal ⚡',
        actionType: 'open_terminal',
        whyExplanation: 'In Git, running "git add" copies file contents to the staging area (.git/index).',
        hint: 'Human concept: Selecting changes. Git concept: Staging area. Command: git add.',
      },
      {
        id: 'add-6',
        lessonId: 'add',
        lessonTitle: 'Selecting Changes',
        sceneNumber: 6,
        totalScenes: 6,
        type: 'command',
        question: 'Try the real Git command.',
        subQuestion: 'Type the command to stage index.html.',
        technicalCommand: 'git add index.html',
        visualState: {
          workingFiles: [
            { name: 'index.html', status: 'modified' },
            { name: 'style.css', status: 'modified' },
          ],
          stagingFiles: [],
          localCommits: [{ hash: 'C0', message: 'Initial project setup', branch: 'main', isHead: true }],
          remoteCommits: [],
        },
        progressiveHints: [
          'What command starts with "git add"?',
          'Which file did you just move to the box? (index.html)',
          'Type: git add index.html',
        ],
        hint: 'Type "git add index.html" and press Enter.',
      },
    ],
  },

  commit: {
    id: 'commit',
    title: 'Saving Snapshots',
    conceptTitle: 'Commits & Branches',
    shortDescription: 'Capture and seal a permanent milestone of staged changes',
    icon: '📸',
    scenes: [
      {
        id: 'commit-1',
        lessonId: 'commit',
        lessonTitle: 'Saving Snapshots',
        sceneNumber: 1,
        totalScenes: 6,
        type: 'situation',
        question: 'index.html is selected in Staging. How do you save it permanently?',
        subQuestion: 'Changes in staging are temporary until you capture a permanent snapshot.',
        visualState: {
          workingFiles: [{ name: 'index.html', status: 'staged' }],
          stagingFiles: ['index.html'],
          localCommits: [{ hash: 'C0', message: 'Initial project setup', branch: 'main', isHead: true, files: ['index.html'] }],
          remoteCommits: [],
          highlightZone: 'staging',
          cameraActive: true,
        },
        primaryActionLabel: 'Examine Snapshot Camera',
        actionType: 'next_scene',
        whyExplanation: 'Staging is just a staging ground. A commit turns whatever is currently in staging into a permanent, immutable record.',
        hint: 'Look at the Camera apparatus pointing at the Staging Box. It is ready to take a snapshot.',
      },
      {
        id: 'commit-2',
        lessonId: 'commit',
        lessonTitle: 'Saving Snapshots',
        sceneNumber: 2,
        totalScenes: 6,
        type: 'prediction',
        question: 'What will the snapshot commit contain?',
        subQuestion: 'Think about what the camera is pointed at.',
        visualState: {
          workingFiles: [{ name: 'index.html', status: 'staged' }],
          stagingFiles: ['index.html'],
          localCommits: [{ hash: 'C0', message: 'Initial project setup', branch: 'main', isHead: true }],
          remoteCommits: [],
          highlightZone: 'camera',
          cameraActive: true,
        },
        predictionChoices: [
          {
            id: 'staged-only',
            text: 'Only the changes currently inside the Staging Box (index.html)',
            isCorrect: true,
            explanation: 'Spot on! The camera captures exactly what is in the box. Nothing more, nothing less.',
          },
          {
            id: 'whole-computer',
            text: 'Every file on your computer, even unstaged files',
            isCorrect: false,
            explanation: 'No! Git commits only what you staged. Unstaged changes remain on your desk.',
          },
        ],
        whyExplanation: 'A commit is an immutable snapshot of the staging area at the moment you fire the snapshot.',
        hint: 'The camera lens is aimed directly at the Staging Box.',
      },
      {
        id: 'commit-3',
        lessonId: 'commit',
        lessonTitle: 'Saving Snapshots',
        sceneNumber: 3,
        totalScenes: 6,
        type: 'interaction',
        question: 'Capture the snapshot.',
        subQuestion: 'Click directly on the Snapshot Camera to seal the commit.',
        visualState: {
          workingFiles: [{ name: 'index.html', status: 'staged' }],
          stagingFiles: ['index.html'],
          localCommits: [{ hash: 'C0', message: 'Initial project setup', branch: 'main', isHead: true }],
          remoteCommits: [],
          highlightZone: 'camera',
          cameraActive: true,
        },
        primaryActionLabel: 'Click the Camera',
        actionType: 'take_snapshot',
        whyExplanation: 'When you take a snapshot, Git writes a commit object and records the author, timestamp, and message.',
        hint: 'Click the camera apparatus above the staging box to capture the snapshot.',
      },
      {
        id: 'commit-4',
        lessonId: 'commit',
        lessonTitle: 'Saving Snapshots',
        sceneNumber: 4,
        totalScenes: 6,
        type: 'observe',
        question: 'Observe what happened!',
        subQuestion: 'Notice: Staging is now empty, a new commit C1 was added, and "main" moved forward to C1.',
        visualState: {
          workingFiles: [{ name: 'index.html', status: 'staged' }],
          stagingFiles: [],
          localCommits: [
            { hash: 'C1', message: 'Add hero section to index.html', branch: 'main', isHead: true, files: ['index.html'] },
            { hash: 'C0', message: 'Initial project setup', files: ['index.html'] },
          ],
          remoteCommits: [],
          highlightZone: 'repo',
        },
        stateComparison: {
          before: {
            working: 'index.html',
            staging: '✓ index.html',
            repo: 'main → C0',
          },
          after: {
            working: 'Clean',
            staging: 'Empty (cleared into C1)',
            repo: 'main → C1 (new snapshot!)',
          },
        },
        primaryActionLabel: 'I See What Changed',
        actionType: 'next_scene',
        whyExplanation: 'Staging emptied because its contents were sealed into commit C1. The branch label "main" automatically moved to point to C1.',
        hint: 'Look at the history stack: C1 is now the latest commit, and the main branch label points to C1.',
      },
      {
        id: 'commit-5',
        lessonId: 'commit',
        lessonTitle: 'Saving Snapshots',
        sceneNumber: 5,
        totalScenes: 6,
        type: 'understand',
        question: 'Mental Model: Commits & Branches',
        mentalModelText: 'A commit is a saved snapshot of staged changes. A branch is just a movable label pointing to a commit.',
        technicalTerm: 'Commit Snapshot & Branch Pointer Advancement',
        technicalCommand: 'git commit -m "Your descriptive message"',
        visualState: {
          workingFiles: [{ name: 'index.html', status: 'staged' }],
          stagingFiles: [],
          localCommits: [
            { hash: 'C1', message: 'Add hero section to index.html', branch: 'main', isHead: true },
            { hash: 'C0', message: 'Initial project setup' },
          ],
          remoteCommits: [],
          highlightZone: 'repo',
        },
        primaryActionLabel: 'Try It in Terminal ⚡',
        actionType: 'open_terminal',
        whyExplanation: 'Branches in Git are lightweight pointers: when you commit, the current branch pointer automatically moves forward.',
        hint: 'Human concept: Snapshot. Git concept: Commit. Branch: Movable label.',
      },
      {
        id: 'commit-6',
        lessonId: 'commit',
        lessonTitle: 'Saving Snapshots',
        sceneNumber: 6,
        totalScenes: 6,
        type: 'command',
        question: 'Try the real Git command.',
        subQuestion: 'Commit the staged change with a message explaining what you did.',
        technicalCommand: 'git commit -m "Add hero section"',
        visualState: {
          workingFiles: [{ name: 'index.html', status: 'staged' }],
          stagingFiles: ['index.html'],
          localCommits: [{ hash: 'C0', message: 'Initial project setup', branch: 'main', isHead: true }],
          remoteCommits: [],
        },
        progressiveHints: [
          'What command starts with "git commit"?',
          'The -m flag stands for message: git commit -m "..."',
          'Type: git commit -m "Add hero section"',
        ],
        hint: 'Type: git commit -m "Add hero section" and press Enter.',
      },
    ],
  },

  push: {
    id: 'push',
    title: 'Sending Work to GitHub',
    conceptTitle: 'Remote Synchronization',
    shortDescription: 'Send your local commits across to GitHub so others can access them',
    icon: '☁️',
    scenes: [
      {
        id: 'push-1',
        lessonId: 'push',
        lessonTitle: 'Sending Work to GitHub',
        sceneNumber: 1,
        totalScenes: 5,
        type: 'situation',
        question: 'Your computer has C3. GitHub only has C2. What do you notice?',
        subQuestion: 'As you kept working, you created C2 and C3. But GitHub does not have C3 yet.',
        visualState: {
          workingFiles: [],
          stagingFiles: [],
          localCommits: [
            { hash: 'C3', message: 'Add interactive checkout', branch: 'main', isHead: true, files: ['index.html', 'cart.js'] },
            { hash: 'C2', message: 'Design product cards', files: ['style.css'] },
            { hash: 'C1', message: 'Add hero section', files: ['index.html'] },
          ],
          remoteCommits: [
            { hash: 'C2', message: 'Design product cards', branch: 'main' },
            { hash: 'C1', message: 'Add hero section' },
          ],
          highlightZone: 'highway',
          isInSync: false,
        },
        primaryActionLabel: 'Examine Difference',
        actionType: 'next_scene',
        whyExplanation: 'Git repositories are independent. Commits created on your computer stay local until you explicitly push them.',
        hint: 'Look at the top commit on your computer: C3. Look at GitHub: its main branch is still pointing to C2.',
      },
      {
        id: 'push-2',
        lessonId: 'push',
        lessonTitle: 'Sending Work to GitHub',
        sceneNumber: 2,
        totalScenes: 5,
        type: 'prediction',
        question: 'How should GitHub get your new commit C3?',
        subQuestion: 'Think about how distributed version control works.',
        visualState: {
          workingFiles: [],
          stagingFiles: [],
          localCommits: [
            { hash: 'C3', message: 'Add interactive checkout', branch: 'main', isHead: true },
            { hash: 'C2', message: 'Design product cards' },
            { hash: 'C1', message: 'Add hero section' },
          ],
          remoteCommits: [
            { hash: 'C2', message: 'Design product cards', branch: 'main' },
            { hash: 'C1', message: 'Add hero section' },
          ],
          highlightZone: 'highway',
          isInSync: false,
        },
        predictionChoices: [
          {
            id: 'transfer-c3',
            text: 'Send the missing commit C3 across the connection to GitHub',
            isCorrect: true,
            explanation: 'Spot on! Git calculates which commits are missing on GitHub (C3) and uploads them.',
          },
          {
            id: 'auto-sync',
            text: 'Do nothing and wait for GitHub to guess your changes',
            isCorrect: false,
            explanation: 'Git NEVER secretly sends files over the internet. You are in full control of when you publish your work.',
          },
        ],
        whyExplanation: 'Pushing calculates the commit delta: local has C1, C2, C3; remote has C1, C2. Git only sends C3.',
        hint: 'We need to transmit the missing commit C3 over to the remote GitHub repository.',
      },
      {
        id: 'push-3',
        lessonId: 'push',
        lessonTitle: 'Sending Work to GitHub',
        sceneNumber: 3,
        totalScenes: 5,
        type: 'interaction',
        question: 'Send commit C3 to GitHub.',
        subQuestion: 'Drag commit C3 across the line to GitHub, or click the transfer button.',
        visualState: {
          workingFiles: [],
          stagingFiles: [],
          localCommits: [
            { hash: 'C3', message: 'Add interactive checkout', branch: 'main', isHead: true },
            { hash: 'C2', message: 'Design product cards' },
            { hash: 'C1', message: 'Add hero section' },
          ],
          remoteCommits: [
            { hash: 'C2', message: 'Design product cards', branch: 'main' },
            { hash: 'C1', message: 'Add hero section' },
          ],
          highlightZone: 'highway',
          packetTransfer: {
            active: false,
            packetLabel: 'C3',
            stepDescription: 'Ready to transmit commit C3',
            progressPercent: 0,
          },
        },
        primaryActionLabel: 'Send C3 to GitHub 🚀',
        actionType: 'drag_commit',
        whyExplanation: 'Git sends the commit object and tree data across the network connection.',
        hint: 'Drag commit C3 across to the GitHub cloud or click the transfer action.',
      },
      {
        id: 'push-4',
        lessonId: 'push',
        lessonTitle: 'Sending Work to GitHub',
        sceneNumber: 4,
        totalScenes: 5,
        type: 'observe',
        question: 'GitHub is now updated and In Sync!',
        subQuestion: 'GitHub received C3. Its main branch pointer now matches your computer.',
        visualState: {
          workingFiles: [],
          stagingFiles: [],
          localCommits: [
            { hash: 'C3', message: 'Add interactive checkout', branch: 'main', isHead: true },
            { hash: 'C2', message: 'Design product cards' },
            { hash: 'C1', message: 'Add hero section' },
          ],
          remoteCommits: [
            { hash: 'C3', message: 'Add interactive checkout', branch: 'main' },
            { hash: 'C2', message: 'Design product cards' },
            { hash: 'C1', message: 'Add hero section' },
          ],
          isInSync: true,
          highlightZone: 'remote',
        },
        stateComparison: {
          before: {
            working: 'Clean',
            staging: 'Clean',
            repo: 'main → C3',
            remote: 'main → C2 (behind by 1)',
          },
          after: {
            working: 'Clean',
            staging: 'Clean',
            repo: 'main → C3',
            remote: 'main → C3 (IN SYNC ✓)',
          },
        },
        primaryActionLabel: 'Understand Git Push',
        actionType: 'next_scene',
        whyExplanation: 'Both your computer and GitHub now have identical commit history at main (C3).',
        hint: 'Both local and remote now show "main" pointing to C3.',
      },
      {
        id: 'push-5',
        lessonId: 'push',
        lessonTitle: 'Sending Work to GitHub',
        sceneNumber: 5,
        totalScenes: 5,
        type: 'command',
        question: 'Try the real Git command.',
        subQuestion: 'Push your branch to the remote repository named "origin".',
        technicalCommand: 'git push origin main',
        visualState: {
          workingFiles: [],
          stagingFiles: [],
          localCommits: [
            { hash: 'C3', message: 'Add interactive checkout', branch: 'main', isHead: true },
            { hash: 'C2', message: 'Design product cards' },
            { hash: 'C1', message: 'Add hero section' },
          ],
          remoteCommits: [
            { hash: 'C2', message: 'Design product cards', branch: 'main' },
            { hash: 'C1', message: 'Add hero section' },
          ],
          isInSync: false,
        },
        progressiveHints: [
          'What command starts with "git push"?',
          'origin is the remote name, main is the branch name',
          'Type: git push origin main',
        ],
        hint: 'Type: git push origin main and press Enter.',
      },
    ],
  },
};
