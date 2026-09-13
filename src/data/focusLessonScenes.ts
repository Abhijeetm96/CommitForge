export type SceneType =
  | 'situation'
  | 'prediction'
  | 'interaction'
  | 'watch'
  | 'observe'
  | 'understand'
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

  // Single Question for the scene
  question?: string;
  subQuestion?: string;

  // Visual simulation world state for this scene
  visualState: {
    workingFiles: { name: string; status: 'modified' | 'untracked' | 'staged'; isSelected?: boolean }[];
    stagingFiles: string[];
    localCommits: { hash: string; message: string; branch?: string; isHead?: boolean }[];
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
  actionType?: 'select_file' | 'move_to_staging' | 'take_snapshot' | 'send_packet' | 'next_scene' | 'open_terminal';

  // Before / After comparisons for observe scenes
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

  // Single contextual Forge hint
  hint: string;
}

export interface FocusLesson {
  id: 'add' | 'commit' | 'push';
  title: string;
  shortDescription: string;
  icon: string;
  scenes: FocusScene[];
}

export const FOCUS_LESSONS: Record<string, FocusLesson> = {
  add: {
    id: 'add',
    title: 'Git Add',
    shortDescription: 'Choose which changes go into the next snapshot',
    icon: '📦',
    scenes: [
      {
        id: 'add-1',
        lessonId: 'add',
        lessonTitle: 'Git Add',
        sceneNumber: 1,
        totalScenes: 7,
        type: 'situation',
        question: 'Something changed on your computer. Which file needs attention?',
        subQuestion: 'Click on the modified file to inspect it.',
        visualState: {
          workingFiles: [{ name: 'index.html', status: 'modified', isSelected: false }],
          stagingFiles: [],
          localCommits: [{ hash: 'C0', message: 'Initial project setup', branch: 'main', isHead: true }],
          remoteCommits: [],
          highlightZone: 'working',
        },
        primaryActionLabel: 'Select index.html',
        actionType: 'select_file',
        hint: 'Look at the files on your desk. One of them has an orange modified indicator.',
      },
      {
        id: 'add-2',
        lessonId: 'add',
        lessonTitle: 'Git Add',
        sceneNumber: 2,
        totalScenes: 7,
        type: 'prediction',
        question: 'Where should this change go before we save a version?',
        subQuestion: 'Think about where changes wait before becoming a snapshot.',
        visualState: {
          workingFiles: [{ name: 'index.html', status: 'modified', isSelected: true }],
          stagingFiles: [],
          localCommits: [{ hash: 'C0', message: 'Initial project setup', branch: 'main', isHead: true }],
          remoteCommits: [],
          highlightZone: 'staging',
        },
        predictionChoices: [
          {
            id: 'staging',
            text: 'Into the 📦 Staging Box',
            isCorrect: true,
            explanation: 'Exactly! The staging box is where you collect changes you want to save.',
          },
          {
            id: 'direct-commit',
            text: 'Directly into permanent history without choosing',
            isCorrect: false,
            explanation: 'Git wants you to deliberately choose what to save first, so you don\'t accidentally commit half-baked work.',
          },
          {
            id: 'remote',
            text: 'Straight to the Internet Cloud',
            isCorrect: false,
            explanation: 'You must prepare and save changes locally on your computer before anything can be sent to the cloud.',
          },
        ],
        hint: 'Before taking a photo, you arrange the subjects. Where do changes get arranged first?',
      },
      {
        id: 'add-3',
        lessonId: 'add',
        lessonTitle: 'Git Add',
        sceneNumber: 3,
        totalScenes: 7,
        type: 'interaction',
        question: 'Move the modified file into Staging.',
        subQuestion: 'Drag index.html into the Staging Box, or click the button below.',
        visualState: {
          workingFiles: [{ name: 'index.html', status: 'modified', isSelected: true }],
          stagingFiles: [],
          localCommits: [{ hash: 'C0', message: 'Initial project setup', branch: 'main', isHead: true }],
          remoteCommits: [],
          highlightZone: 'staging',
        },
        primaryActionLabel: 'Move index.html to Staging 📦',
        actionType: 'move_to_staging',
        hint: 'Click the "Move to Staging" button or drag the file directly into the box.',
      },
      {
        id: 'add-4',
        lessonId: 'add',
        lessonTitle: 'Git Add',
        sceneNumber: 4,
        totalScenes: 7,
        type: 'watch',
        question: 'Watch Git stage the file.',
        subQuestion: 'Git inspects the file diff and places it into the staging area.',
        visualState: {
          workingFiles: [{ name: 'index.html', status: 'modified', isSelected: false }],
          stagingFiles: ['index.html'],
          localCommits: [{ hash: 'C0', message: 'Initial project setup', branch: 'main', isHead: true }],
          remoteCommits: [],
          highlightZone: 'staging',
        },
        primaryActionLabel: 'Continue to Inspection',
        actionType: 'next_scene',
        hint: 'The file has entered the staging box and is now ready for the next snapshot.',
      },
      {
        id: 'add-5',
        lessonId: 'add',
        lessonTitle: 'Git Add',
        sceneNumber: 5,
        totalScenes: 7,
        type: 'observe',
        question: 'Observe what changed.',
        subQuestion: 'Compare what was on your desk before and what is in the box now.',
        visualState: {
          workingFiles: [{ name: 'index.html', status: 'staged', isSelected: false }],
          stagingFiles: ['index.html'],
          localCommits: [{ hash: 'C0', message: 'Initial project setup', branch: 'main', isHead: true }],
          remoteCommits: [],
          highlightZone: 'staging',
        },
        stateComparison: {
          before: {
            working: 'index.html (modified on disk)',
            staging: 'Empty (nothing selected)',
            repo: 'main → C0',
          },
          after: {
            working: 'index.html (modified on disk)',
            staging: '✓ index.html (ready for snapshot)',
            repo: 'main → C0',
          },
        },
        primaryActionLabel: 'I See What Changed',
        actionType: 'next_scene',
        hint: 'Notice how the working file is still on your computer, but now a copy is staged in the box.',
      },
      {
        id: 'add-6',
        lessonId: 'add',
        lessonTitle: 'Git Add',
        sceneNumber: 6,
        totalScenes: 7,
        type: 'understand',
        question: 'Mental Model: The Staging Area',
        mentalModelText: 'Staging lets you choose which changes go into the next snapshot.',
        technicalTerm: 'Staging Area (also called the "Index")',
        technicalCommand: 'git add <filename>',
        visualState: {
          workingFiles: [{ name: 'index.html', status: 'staged' }],
          stagingFiles: ['index.html'],
          localCommits: [{ hash: 'C0', message: 'Initial project setup', branch: 'main', isHead: true }],
          remoteCommits: [],
          highlightZone: 'staging',
        },
        primaryActionLabel: 'Try It in Terminal ⚡',
        actionType: 'open_terminal',
        hint: 'In Git, staging means preparing a specific set of changes for saving.',
      },
      {
        id: 'add-7',
        lessonId: 'add',
        lessonTitle: 'Git Add',
        sceneNumber: 7,
        totalScenes: 7,
        type: 'command',
        question: 'Try the real Git command.',
        subQuestion: 'Type the command into the terminal to stage your file.',
        technicalCommand: 'git add index.html',
        visualState: {
          workingFiles: [{ name: 'index.html', status: 'modified' }],
          stagingFiles: [],
          localCommits: [{ hash: 'C0', message: 'Initial project setup', branch: 'main', isHead: true }],
          remoteCommits: [],
        },
        hint: 'Type "git add index.html" and press Enter to execute it in the real Git engine.',
      },
    ],
  },

  commit: {
    id: 'commit',
    title: 'Git Commit',
    shortDescription: 'Save a permanent milestone snapshot of staged changes',
    icon: '📸',
    scenes: [
      {
        id: 'commit-1',
        lessonId: 'commit',
        lessonTitle: 'Git Commit',
        sceneNumber: 1,
        totalScenes: 7,
        type: 'situation',
        question: 'You have chosen a change in Staging. What needs to happen next?',
        subQuestion: 'index.html is in the box, but hasn\'t been saved as a permanent version yet.',
        visualState: {
          workingFiles: [{ name: 'index.html', status: 'staged' }],
          stagingFiles: ['index.html'],
          localCommits: [{ hash: 'C0', message: 'Initial project setup', branch: 'main', isHead: true }],
          remoteCommits: [],
          highlightZone: 'staging',
          cameraActive: false,
        },
        primaryActionLabel: 'Inspect Snapshot Camera 📸',
        actionType: 'next_scene',
        hint: 'Files in staging are just waiting. To keep them forever, we need to capture a snapshot.',
      },
      {
        id: 'commit-2',
        lessonId: 'commit',
        lessonTitle: 'Git Commit',
        sceneNumber: 2,
        totalScenes: 7,
        type: 'prediction',
        question: 'What does a Git commit capture?',
        subQuestion: 'Before taking the snapshot, what will actually be saved inside it?',
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
            text: 'Only the changes currently inside the Staging Box',
            isCorrect: true,
            explanation: 'Yes! Git only commits what you put in the staging box. Anything left unstaged stays untouched.',
          },
          {
            id: 'entire-computer',
            text: 'Every file and folder on your entire hard drive',
            isCorrect: false,
            explanation: 'No, Git only tracks files inside your repository, and commits only what is staged.',
          },
          {
            id: 'random',
            text: 'A random draft that changes constantly',
            isCorrect: false,
            explanation: 'A commit is permanent and immutable. Once created, it never secretly changes.',
          },
        ],
        hint: 'Remember the box metaphor: the camera points directly at what is inside Staging.',
      },
      {
        id: 'commit-3',
        lessonId: 'commit',
        lessonTitle: 'Git Commit',
        sceneNumber: 3,
        totalScenes: 7,
        type: 'interaction',
        question: 'Take a snapshot of your staged changes.',
        subQuestion: 'Click the camera or the action button to seal the commit.',
        visualState: {
          workingFiles: [{ name: 'index.html', status: 'staged' }],
          stagingFiles: ['index.html'],
          localCommits: [{ hash: 'C0', message: 'Initial project setup', branch: 'main', isHead: true }],
          remoteCommits: [],
          highlightZone: 'camera',
          cameraActive: true,
        },
        primaryActionLabel: '📸 Take Snapshot',
        actionType: 'take_snapshot',
        hint: 'Click the glowing Camera or the "Take Snapshot" button.',
      },
      {
        id: 'commit-4',
        lessonId: 'commit',
        lessonTitle: 'Git Commit',
        sceneNumber: 4,
        totalScenes: 7,
        type: 'watch',
        question: 'Watch Git seal the snapshot.',
        subQuestion: 'A new commit C1 is minted. The "main" branch pointer moves forward to C1.',
        visualState: {
          workingFiles: [{ name: 'index.html', status: 'staged' }],
          stagingFiles: [],
          localCommits: [
            { hash: 'C1', message: 'Add hero section to index.html', branch: 'main', isHead: true },
            { hash: 'C0', message: 'Initial project setup' },
          ],
          remoteCommits: [],
          highlightZone: 'repo',
          cameraActive: false,
        },
        primaryActionLabel: 'Continue to Comparison',
        actionType: 'next_scene',
        hint: 'The camera flashed, the staging box emptied, and C1 was added to your history stack.',
      },
      {
        id: 'commit-5',
        lessonId: 'commit',
        lessonTitle: 'Git Commit',
        sceneNumber: 5,
        totalScenes: 7,
        type: 'observe',
        question: 'Observe what changed.',
        subQuestion: 'Look at Staging and the Repository history stack before and after.',
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
        stateComparison: {
          before: {
            working: 'index.html',
            staging: '✓ index.html',
            repo: 'main → C0',
          },
          after: {
            working: 'index.html (clean)',
            staging: 'Empty (cleared)',
            repo: 'main → C1 (new snapshot!)',
          },
        },
        primaryActionLabel: 'Understand the Mental Model',
        actionType: 'next_scene',
        hint: 'Notice that staging emptied because its contents became part of commit C1.',
      },
      {
        id: 'commit-6',
        lessonId: 'commit',
        lessonTitle: 'Git Commit',
        sceneNumber: 6,
        totalScenes: 7,
        type: 'understand',
        question: 'Mental Model: What is a Commit?',
        mentalModelText: 'A commit is a saved snapshot of the changes you staged.',
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
        hint: 'Each commit has a message explaining why the change was made.',
      },
      {
        id: 'commit-7',
        lessonId: 'commit',
        lessonTitle: 'Git Commit',
        sceneNumber: 7,
        totalScenes: 7,
        type: 'command',
        question: 'Try the real Git command.',
        subQuestion: 'Commit staged changes with a descriptive message.',
        technicalCommand: 'git commit -m "Update home page"',
        visualState: {
          workingFiles: [{ name: 'index.html', status: 'staged' }],
          stagingFiles: ['index.html'],
          localCommits: [{ hash: 'C0', message: 'Initial project setup', branch: 'main', isHead: true }],
          remoteCommits: [],
        },
        hint: 'Type: git commit -m "Update home page" and press Enter.',
      },
    ],
  },

  push: {
    id: 'push',
    title: 'Git Push',
    shortDescription: 'Send your local commits to the remote cloud so others can access them',
    icon: '☁️',
    scenes: [
      {
        id: 'push-1',
        lessonId: 'push',
        lessonTitle: 'Git Push',
        sceneNumber: 1,
        totalScenes: 6,
        type: 'situation',
        question: 'Your computer has C3. The remote cloud doesn\'t. What do you notice?',
        subQuestion: 'Your local repository is 1 commit ahead of the remote repository.',
        visualState: {
          workingFiles: [],
          stagingFiles: [],
          localCommits: [
            { hash: 'C3', message: 'Add interactive checkout', branch: 'main', isHead: true },
            { hash: 'C2', message: 'Design product cards' },
            { hash: 'C1', message: 'Setup basic layout' },
          ],
          remoteCommits: [
            { hash: 'C2', message: 'Design product cards', branch: 'main' },
            { hash: 'C1', message: 'Setup basic layout' },
          ],
          highlightZone: 'highway',
          isInSync: false,
        },
        primaryActionLabel: 'Examine Difference',
        actionType: 'next_scene',
        hint: 'Notice the top commit C3 on your computer. Look at the cloud: it only has up to C2.',
      },
      {
        id: 'push-2',
        lessonId: 'push',
        lessonTitle: 'Git Push',
        sceneNumber: 2,
        totalScenes: 6,
        type: 'prediction',
        question: 'What should happen so the remote cloud gets your new commit?',
        subQuestion: 'Choose what action will synchronize your work with the team.',
        visualState: {
          workingFiles: [],
          stagingFiles: [],
          localCommits: [
            { hash: 'C3', message: 'Add interactive checkout', branch: 'main', isHead: true },
            { hash: 'C2', message: 'Design product cards' },
            { hash: 'C1', message: 'Setup basic layout' },
          ],
          remoteCommits: [
            { hash: 'C2', message: 'Design product cards', branch: 'main' },
            { hash: 'C1', message: 'Setup basic layout' },
          ],
          highlightZone: 'highway',
          isInSync: false,
        },
        predictionChoices: [
          {
            id: 'send-c3',
            text: 'Send commit C3 across the connection to Remote',
            isCorrect: true,
            explanation: 'Spot on! Git calculates the missing commits (C3) and uploads them.',
          },
          {
            id: 'delete-local',
            text: 'Delete C3 from your computer so they match',
            isCorrect: false,
            explanation: 'No! You don\'t want to throw away your hard work just because it\'s not on the cloud yet.',
          },
          {
            id: 'do-nothing',
            text: 'Do nothing and assume the cloud updates automatically',
            isCorrect: false,
            explanation: 'Git is distributed and offline-first: it NEVER sends code over the internet unless you explicitly push.',
          },
        ],
        hint: 'We need to transmit the new local commit across the network line to the cloud.',
      },
      {
        id: 'push-3',
        lessonId: 'push',
        lessonTitle: 'Git Push',
        sceneNumber: 3,
        totalScenes: 6,
        type: 'interaction',
        question: 'Transmit C3 across the connection line.',
        subQuestion: 'Click the button to send the commit packet to the remote.',
        visualState: {
          workingFiles: [],
          stagingFiles: [],
          localCommits: [
            { hash: 'C3', message: 'Add interactive checkout', branch: 'main', isHead: true },
            { hash: 'C2', message: 'Design product cards' },
            { hash: 'C1', message: 'Setup basic layout' },
          ],
          remoteCommits: [
            { hash: 'C2', message: 'Design product cards', branch: 'main' },
            { hash: 'C1', message: 'Setup basic layout' },
          ],
          highlightZone: 'highway',
          packetTransfer: {
            active: false,
            packetLabel: '📦 C3',
            stepDescription: 'Ready to send packet',
            progressPercent: 0,
          },
        },
        primaryActionLabel: '🚀 Send C3 to Remote',
        actionType: 'send_packet',
        hint: 'Click "Send C3 to Remote" to start the network transmission.',
      },
      {
        id: 'push-4',
        lessonId: 'push',
        lessonTitle: 'Git Push',
        sceneNumber: 4,
        totalScenes: 6,
        type: 'watch',
        question: 'Watch Git transfer the commit packet.',
        subQuestion: 'Local Git negotiates with Remote, transfers C3, and advances the remote branch.',
        visualState: {
          workingFiles: [],
          stagingFiles: [],
          localCommits: [
            { hash: 'C3', message: 'Add interactive checkout', branch: 'main', isHead: true },
            { hash: 'C2', message: 'Design product cards' },
            { hash: 'C1', message: 'Setup basic layout' },
          ],
          remoteCommits: [
            { hash: 'C3', message: 'Add interactive checkout', branch: 'main' },
            { hash: 'C2', message: 'Design product cards' },
            { hash: 'C1', message: 'Setup basic layout' },
          ],
          highlightZone: 'remote',
          packetTransfer: {
            active: true,
            packetLabel: '📦 C3',
            stepDescription: 'Remote received C3. main advanced to C3.',
            progressPercent: 100,
          },
          isInSync: true,
        },
        primaryActionLabel: 'Verify Synchronization',
        actionType: 'next_scene',
        hint: 'The packet traveled the fiber optic line and settled safely on the remote server.',
      },
      {
        id: 'push-5',
        lessonId: 'push',
        lessonTitle: 'Git Push',
        sceneNumber: 5,
        totalScenes: 6,
        type: 'understand',
        question: 'Mental Model: Git Push',
        mentalModelText: 'Push sends your local commits to the remote so others can access them.',
        technicalTerm: 'Remote Push (Synchronizing local and remote branches)',
        technicalCommand: 'git push origin main',
        visualState: {
          workingFiles: [],
          stagingFiles: [],
          localCommits: [
            { hash: 'C3', message: 'Add interactive checkout', branch: 'main', isHead: true },
            { hash: 'C2', message: 'Design product cards' },
            { hash: 'C1', message: 'Setup basic layout' },
          ],
          remoteCommits: [
            { hash: 'C3', message: 'Add interactive checkout', branch: 'main' },
            { hash: 'C2', message: 'Design product cards' },
            { hash: 'C1', message: 'Setup basic layout' },
          ],
          isInSync: true,
          highlightZone: 'remote',
        },
        primaryActionLabel: 'Try It in Terminal ⚡',
        actionType: 'open_terminal',
        hint: 'Your local computer and the remote repository are now completely in sync.',
      },
      {
        id: 'push-6',
        lessonId: 'push',
        lessonTitle: 'Git Push',
        sceneNumber: 6,
        totalScenes: 6,
        type: 'command',
        question: 'Try the real Git command.',
        subQuestion: 'Push your committed branch to the remote repository named "origin".',
        technicalCommand: 'git push origin main',
        visualState: {
          workingFiles: [],
          stagingFiles: [],
          localCommits: [
            { hash: 'C3', message: 'Add interactive checkout', branch: 'main', isHead: true },
            { hash: 'C2', message: 'Design product cards' },
            { hash: 'C1', message: 'Setup basic layout' },
          ],
          remoteCommits: [
            { hash: 'C2', message: 'Design product cards', branch: 'main' },
            { hash: 'C1', message: 'Setup basic layout' },
          ],
          isInSync: false,
        },
        hint: 'Type: git push origin main and press Enter.',
      },
    ],
  },
};
