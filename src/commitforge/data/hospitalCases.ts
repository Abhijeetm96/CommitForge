export interface HospitalCase {
  id: string;
  patientName: string;
  condition: string;
  severity: 'MILD' | 'MODERATE' | 'CRITICAL';
  symptoms: string;
  diagnosticQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
    rationale: string;
  }[];
  treatmentGoal: string;
  cureCommand: string;
  educationalPrescription: string;
}

export const HOSPITAL_CASES: HospitalCase[] = [
  {
    id: 'case-detached-head',
    patientName: 'Repo #101 (Detached HEAD Patient)',
    condition: 'Acute Head Detachment',
    severity: 'MODERATE',
    symptoms: 'Student ran `git checkout a1b2c3d` to test something, made 2 commits, and now sees warning "HEAD detached at a1b2c3d". They fear switching branches will kill their commits.',
    diagnosticQuestions: [
      {
        question: 'What happened to this repository?',
        options: [
          'The .git directory was deleted',
          'HEAD points directly to a commit SHA rather than to a named branch pointer',
          'A merge conflict crashed Git',
          'The computer disconnected from the internet'
        ],
        correctIndex: 1,
        rationale: 'HEAD was pointed directly at a commit hash instead of a branch reference.'
      },
      {
        question: 'Why is this dangerous if the user runs `git switch main` right now?',
        options: [
          'Main branch will be deleted',
          'The two new commits have no branch pointer pointing to them and will become orphaned garbage',
          'GitHub will ban the user',
          'The computer will run out of memory'
        ],
        correctIndex: 1,
        rationale: 'Without a branch pointer referencing them, commits made in detached HEAD are abandoned upon switching.'
      },
      {
        question: 'How do you fix it to preserve the commits?',
        options: [
          'Run git reset --hard',
          'Run `git switch -c <new-branch-name>` right now to attach a branch to the current commit',
          'Delete the project folder',
          'Run git status'
        ],
        correctIndex: 1,
        rationale: '`git switch -c <name>` or `git branch <name>` anchors the commits with a permanent branch pointer.'
      }
    ],
    treatmentGoal: 'Anchor the detached commits to a new branch named `feature/recovery`.',
    cureCommand: 'git switch -c feature/recovery',
    educationalPrescription: 'Never panic in Detached HEAD. Simply run `git switch -c <branch-name>` to save your work.'
  },

  {
    id: 'case-lost-commit-reflog',
    patientName: 'Repo #102 (Accidental Reset Patient)',
    condition: 'Lost Commit via git reset --hard',
    severity: 'CRITICAL',
    symptoms: 'Developer accidentally ran `git reset --hard HEAD~1` thinking it was `--soft`. Their latest commit vanished from `git log`. They think hours of work are lost forever.',
    diagnosticQuestions: [
      {
        question: 'What happened when `git reset --hard HEAD~1` was executed?',
        options: [
          'Git permanently erased the commit object from the disk database',
          'The branch pointer moved backwards, leaving the commit unreferenced in git log, but still in the Git object database',
          'The repository was converted to SVN',
          'The files were pushed to a secret server'
        ],
        correctIndex: 1,
        rationale: 'Git almost never deletes committed objects immediately. The commit object is still in the database!'
      },
      {
        question: 'Where can you find the hash of the "lost" commit?',
        options: [
          'In git status',
          'In `git reflog` (the chronological reference log of all HEAD movements)',
          'In .gitignore',
          'In package.json'
        ],
        correctIndex: 1,
        rationale: '`git reflog` records every position HEAD has held in the local repository.'
      }
    ],
    treatmentGoal: 'Inspect `git reflog`, identify the previous commit hash, and reset HEAD back to it.',
    cureCommand: 'git reset --hard HEAD@{1}',
    educationalPrescription: 'The Git Reflog is your safety net. As long as you committed your work, `git reflog` can rescue it.'
  },

  {
    id: 'case-committed-to-main',
    patientName: 'Repo #103 (Committed to Main by Accident)',
    condition: 'Wrong Branch Placement',
    severity: 'MILD',
    symptoms: 'Developer wrote code for a brand new experimental feature and committed it directly onto `main` instead of creating `feature/login`.',
    diagnosticQuestions: [
      {
        question: 'What is the clean professional fix?',
        options: [
          'Create the feature branch at current commit (`git branch feature/login`), then reset main back one commit (`git reset --hard HEAD~1`)',
          'Delete main branch',
          'Copy paste the code into notepad and reclone',
          'Push main to production'
        ],
        correctIndex: 0,
        rationale: 'Creating the feature branch preserves the commit; then moving main back cleans up the main branch.'
      }
    ],
    treatmentGoal: 'Create branch `feature/login` to hold the commit, then reset `main` back one commit.',
    cureCommand: 'git branch feature/login && git reset --hard HEAD~1',
    educationalPrescription: 'Branches are just pointers. You can always label the current commit with a new branch before rolling back main.'
  },

  {
    id: 'case-rejected-push',
    patientName: 'Repo #104 (Non-Fast-Forward Push)',
    condition: 'Remote Divergence Rejection',
    severity: 'MODERATE',
    symptoms: 'Developer types `git push origin main` and receives error: `[rejected] (non-fast-forward)`. Teammate Rahul pushed earlier.',
    diagnosticQuestions: [
      {
        question: 'Why did Git reject the push?',
        options: [
          'The developer\'s password was incorrect',
          'The remote branch has commits that the developer does not have locally. Pushing would overwrite Rahul\'s commits.',
          'The internet connection dropped',
          'GitHub is down'
        ],
        correctIndex: 1,
        rationale: 'Git prevents accidental destruction of teammate work when branches diverge.'
      },
      {
        question: 'What is the correct remedy?',
        options: [
          'Run `git push --force` immediately',
          'Run `git pull` to fetch Rahul\'s changes and merge/rebase them locally before pushing',
          'Delete the remote repository',
          'Change user.name in git config'
        ],
        correctIndex: 1,
        rationale: 'Pull first to integrate the remote changes, verify the code builds, and then push.'
      }
    ],
    treatmentGoal: 'Integrate the remote changes using `git pull` and then push cleanly.',
    cureCommand: 'git pull origin main && git push origin main',
    educationalPrescription: 'Never use `--force` to solve a rejected push on a shared branch. Pull first, resolve differences, then push.'
  },

  {
    id: 'case-untracked-secret',
    patientName: 'Repo #105 (Leaked Secret Key)',
    condition: 'Secret Infiltration',
    severity: 'CRITICAL',
    symptoms: 'Student ran `git add .` and staged `.env` with an `AWS_SECRET_KEY=...`.',
    diagnosticQuestions: [
      {
        question: 'What must be done before running `git commit`?',
        options: [
          'Unstage .env with `git restore --staged .env` and add `.env` to `.gitignore`',
          'Commit it quickly before anyone looks',
          'Email the secret to your manager',
          'Rename .env to .env.txt'
        ],
        correctIndex: 0,
        rationale: 'Unstage the secret file immediately and ensure .gitignore ignores it permanently.'
      }
    ],
    treatmentGoal: 'Unstage `.env` and add it to `.gitignore`.',
    cureCommand: 'git restore --staged .env',
    educationalPrescription: 'Never commit secrets into version control. Once pushed, secrets must be considered compromised.'
  }
];
