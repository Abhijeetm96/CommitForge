export interface CapstoneStep {
  id: number;
  phase: string;
  title: string;
  timeLabel: string;
  speaker?: {
    name: string;
    role: string;
    avatar: string;
    message: string;
  };
  objective: string;
  expectedAction: string;
  hints: string[];
}

export interface SkillScore {
  name: string;
  category: string;
  score: number; // 0 - 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'Needs Practice';
  feedback: string;
}

export const CAPSTONE_MISSION = {
  ticketId: '#184',
  time: 'MONDAY 9:07 AM',
  title: 'Bug: Checkout occasionally fails when customers use discount codes',
  priority: 'High',
  description: `Customer support has received multiple tickets reporting that applying discount promo codes causes checkout calculations to throw NaN or fail.
Your task: Inspect the checkout logic, create a feature branch, reproduce and fix the bug in the interactive store, verify in the live preview, write a clean commit, handle teammate updates, resolve any conflicts, and prepare the release.`,
  team: [
    { name: 'Abhijeet', role: 'Staff Lead Engineer', avatar: '👨‍💻' },
    { name: 'Sarah', role: 'Senior QA Engineer', avatar: '👩‍🔬' },
    { name: 'Rahul', role: 'Backend Services Lead', avatar: '🧑‍💼' },
    { name: 'Priya', role: 'Product Manager', avatar: '👩‍💼' },
    { name: 'David', role: 'Release / DevOps', avatar: '👨‍🔧' },
  ],
  steps: [
    {
      id: 1,
      phase: '1. Onboarding & Inspection',
      title: 'Inspect Repository State',
      timeLabel: '09:12 AM',
      speaker: {
        name: 'Abhijeet',
        role: 'Staff Lead Engineer',
        avatar: '👨‍💻',
        message: 'Welcome to the team! Before writing any code, always check your git status and commit history on main to make sure you have a clean starting point.'
      },
      objective: 'Run `git status` and `git log --oneline` to inspect the repository state.',
      expectedAction: 'git status',
      hints: ['Run `git status` to verify your branch is clean.', 'Run `git log --oneline` to see existing commits.']
    },
    {
      id: 2,
      phase: '2. Branch Isolation',
      title: 'Create Feature Branch',
      timeLabel: '09:20 AM',
      speaker: {
        name: 'Abhijeet',
        role: 'Staff Lead Engineer',
        avatar: '👨‍💻',
        message: 'Never code directly on main! Create a branch named `fix/checkout-discount`.'
      },
      objective: 'Create and switch to `fix/checkout-discount`.',
      expectedAction: 'git switch -c fix/checkout-discount',
      hints: ['Use `git switch -c fix/checkout-discount` or `git checkout -b fix/checkout-discount`.']
    },
    {
      id: 3,
      phase: '3. Investigation & Code Fix',
      title: 'Fix the Discount Calculation Bug',
      timeLabel: '09:45 AM',
      speaker: {
        name: 'Sarah',
        role: 'Senior QA Engineer',
        avatar: '👩‍🔬',
        message: 'In cart.js, look at the `applyDiscount()` function. When an unknown discount code was applied, discount was set to NaN or undefined. Fix it so invalid codes keep discount at 0!'
      },
      objective: 'Open cart.js in the editor, ensure discount is set to 0 when code is invalid, and test in Live App Preview.',
      expectedAction: 'edit cart.js',
      hints: ['Look at line 14 of cart.js in the editor.', 'Ensure invalid coupons do not break calculations.', 'Test entering promo codes in the preview.']
    },
    {
      id: 4,
      phase: '4. Stage & Commit',
      title: 'Review Diff & Commit',
      timeLabel: '10:15 AM',
      speaker: {
        name: 'Abhijeet',
        role: 'Staff Lead Engineer',
        avatar: '👨‍💻',
        message: 'Review your diff with `git diff`. Make sure only relevant files are staged, then write a clear professional commit message.'
      },
      objective: 'Review `git diff`, stage cart.js, and commit with message: "Fix checkout discount calculation on invalid promo codes".',
      expectedAction: 'git commit',
      hints: ['Run `git diff` to review lines changed.', 'Run `git add cart.js`.', 'Run `git commit -m "Fix checkout discount calculation on invalid promo codes"`']
    },
    {
      id: 5,
      phase: '5. Pull Request & Team Merge',
      title: 'Simulate PR, Teammate Conflict & Release',
      timeLabel: '11:30 AM',
      speaker: {
        name: 'Rahul',
        role: 'Backend Services Lead',
        avatar: '🧑‍💼',
        message: 'Hey! I just merged some tax calculation updates into main. Switch to main, pull, and merge your branch in cleanly. Then create release tag v1.2.0!'
      },
      objective: 'Switch to main, merge `fix/checkout-discount`, and create annotated release tag `v1.2.0`.',
      expectedAction: 'git tag v1.2.0',
      hints: ['Run `git switch main`.', 'Run `git merge fix/checkout-discount`.', 'Run `git tag -a v1.2.0 -m "Release v1.2.0"`']
    }
  ]
};

export function calculateGitProfile(actionsCount: number, errorCount: number, predictionAccuracy: number): SkillScore[] {
  const baseScore = Math.min(100, Math.max(65, 95 - errorCount * 5));

  return [
    { name: 'Git Understanding', category: 'Core Models', score: Math.round(baseScore), grade: 'A', feedback: 'Deep comprehension of the Three Areas (Working Tree, Index, Repository).' },
    { name: 'Command Knowledge', category: 'CLI Mastery', score: Math.round(baseScore - 2), grade: 'A', feedback: 'Fluent in git add, commit, diff, switch, merge, reset, and log.' },
    { name: 'Repository Awareness', category: 'Mental Model', score: Math.round(baseScore + 3), grade: 'A+', feedback: 'Consistently inspects status and DAG state before executing destructive operations.' },
    { name: 'Branch Management', category: 'Workflow', score: Math.round(baseScore), grade: 'A', feedback: 'Effectively isolates features on dedicated branches away from main.' },
    { name: 'Commit Quality', category: 'Professional Standards', score: 95, grade: 'A+', feedback: 'Writes clear, imperative-mood commit messages explaining why and what.' },
    { name: 'Conflict Resolution', category: 'Collaboration', score: Math.round(baseScore - 5), grade: 'B', feedback: 'Comfortable reading and resolving <<<<<<< HEAD markers.' },
    { name: 'Remote Understanding', category: 'Collaboration', score: Math.round(baseScore), grade: 'A', feedback: 'Distinguishes fetch vs pull and handles rejected pushes gracefully.' },
    { name: 'Troubleshooting & Recovery', category: 'Diagnostics', score: Math.round(baseScore + 2), grade: 'A', feedback: 'Mastered git restore, reset modes, and reflog rescue.' },
    { name: 'Prediction Accuracy', category: 'Mental Simulation', score: Math.round(predictionAccuracy), grade: predictionAccuracy >= 85 ? 'A+' : 'B', feedback: 'Accurately predicts repository state changes prior to command execution.' },
    { name: 'Independent Problem Solving', category: 'Autonomous Engineering', score: 94, grade: 'A+', feedback: 'Able to diagnose broken repositories without tutorials or cheat sheets.' }
  ];
}
