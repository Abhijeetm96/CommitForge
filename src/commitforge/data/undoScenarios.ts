export interface UndoScenario {
  id: string;
  title: string;
  problem: string;
  context: string;
  recommendedCommand: string;
  dangerLevel: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH';
  options: {
    command: string;
    description: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  educationalTakeaway: string;
}

export const UNDO_SCENARIOS: UndoScenario[] = [
  {
    id: 'undo-edited-file',
    title: 'Scenario 1: Accidentally edited a file',
    problem: '"I made typos in index.html and want to throw away the unsaved edits to match the last commit."',
    context: 'The edits are only in your Working Directory. You have NOT run `git add`.',
    recommendedCommand: 'git restore index.html',
    dangerLevel: 'MEDIUM',
    options: [
      {
        command: 'git restore index.html',
        description: 'Discards working tree modifications in index.html',
        isCorrect: true,
        explanation: 'Correct! git restore replaces index.html in your working directory with the version from staging/HEAD.'
      },
      {
        command: 'git reset --hard HEAD',
        description: 'Wipes everything in working directory and index',
        isCorrect: false,
        explanation: 'Too destructive! This wipes changes in ALL files across the entire project, not just index.html.'
      },
      {
        command: 'git revert HEAD',
        description: 'Creates a new reverse commit',
        isCorrect: false,
        explanation: 'Incorrect. git revert is for undoing past COMMITS, not unstaged working directory edits.'
      }
    ],
    educationalTakeaway: 'Use `git restore <file>` to discard unstaged working directory changes in specific files.'
  },

  {
    id: 'undo-staged-wrong-file',
    title: 'Scenario 2: Staged the wrong file',
    problem: '"I ran git add debug.log by mistake. I do not want this file in the next commit!"',
    context: 'The file is in the Staging Area. You have NOT committed yet.',
    recommendedCommand: 'git restore --staged debug.log',
    dangerLevel: 'SAFE',
    options: [
      {
        command: 'git restore --staged debug.log',
        description: 'Removes file from staging area without touching disk',
        isCorrect: true,
        explanation: 'Correct! git restore --staged un-stages the file while keeping your local edits intact.'
      },
      {
        command: 'rm debug.log',
        description: 'Deletes the file from your computer',
        isCorrect: false,
        explanation: 'Dangerous! rm deletes the physical file from your disk.'
      },
      {
        command: 'git reset --hard',
        description: 'Hard reset',
        isCorrect: false,
        explanation: 'Too nuclear! Hard reset wipes all uncommitted work.'
      }
    ],
    educationalTakeaway: '`git restore --staged <file>` is the modern safe way to unstage files.'
  },

  {
    id: 'undo-commit-too-early',
    title: 'Scenario 3: Committed too early',
    problem: '"I committed with message \'feat: checkout\', but I forgot to include one more file in the commit!"',
    context: 'The commit exists locally. It has NOT been pushed to GitHub.',
    recommendedCommand: 'git reset --soft HEAD~1',
    dangerLevel: 'LOW',
    options: [
      {
        command: 'git reset --soft HEAD~1',
        description: 'Undoes the commit but keeps all changes staged',
        isCorrect: true,
        explanation: 'Correct! --soft moves HEAD back one commit while keeping your work staged in the index ready to add more files and re-commit.'
      },
      {
        command: 'git reset --hard HEAD~1',
        description: 'Hard reset back one commit',
        isCorrect: false,
        explanation: 'Dangerous! --hard will permanently delete the code you just wrote in that commit.'
      },
      {
        command: 'git revert HEAD',
        description: 'Revert commit',
        isCorrect: false,
        explanation: 'Revert will create an opposite commit that erases your feature code.'
      }
    ],
    educationalTakeaway: '`git reset --soft HEAD~1` cleanly unwraps a commit back into the Staging Area.'
  },

  {
    id: 'undo-preserve-history',
    title: 'Scenario 4: Undo a commit while preserving history',
    problem: '"A commit introduced a bug on our team branch. We want to undo its effect without rewriting history."',
    context: 'The branch is shared with other developers.',
    recommendedCommand: 'git revert <commit-hash>',
    dangerLevel: 'LOW',
    options: [
      {
        command: 'git revert <commit-hash>',
        description: 'Creates a new commit reversing the target commit',
        isCorrect: true,
        explanation: 'Correct! git revert adds a brand new commit that negates the faulty changes, preserving complete audit history.'
      },
      {
        command: 'git reset --hard HEAD~1',
        description: 'Erases the commit from history',
        isCorrect: false,
        explanation: 'Dangerous on shared branches! Rewriting history causes divergence for all teammates.'
      }
    ],
    educationalTakeaway: 'Always use `git revert` on public or shared team branches.'
  },

  {
    id: 'undo-discard-local',
    title: 'Scenario 5: Completely discard local uncommitted experiments',
    problem: '"I tried a crazy experiment across 10 files. It is totally broken. I want to throw away everything and match the latest commit."',
    context: 'You are certain you never want any of these uncommitted edits again.',
    recommendedCommand: 'git reset --hard HEAD',
    dangerLevel: 'HIGH',
    options: [
      {
        command: 'git reset --hard HEAD',
        description: 'Overwrites working directory and index with HEAD commit',
        isCorrect: true,
        explanation: 'Correct! When you want a clean slate matching HEAD, git reset --hard HEAD discards all uncommitted modifications.'
      },
      {
        command: 'git restore --staged .',
        description: 'Unstages changes only',
        isCorrect: false,
        explanation: 'This only unstages files; your dirty modifications remain in the working directory.'
      }
    ],
    educationalTakeaway: '`git reset --hard HEAD` is the ultimate reset button, but cannot be undone for uncommitted files!'
  },

  {
    id: 'undo-pushed-commit',
    title: 'Scenario 6: I already pushed the bad commit to GitHub',
    problem: '"The bad commit is already on the remote repository. Teammates may have pulled it."',
    context: 'Shared remote origin/main.',
    recommendedCommand: 'git revert HEAD && git push origin main',
    dangerLevel: 'LOW',
    options: [
      {
        command: 'git revert HEAD && git push origin main',
        description: 'Revert with a new commit and push normally',
        isCorrect: true,
        explanation: 'Correct! Teammates will pull the revert commit cleanly without merge conflicts.'
      },
      {
        command: 'git reset --hard HEAD~1 && git push --force',
        description: 'Force push to rewrite remote history',
        isCorrect: false,
        explanation: 'Never force push to shared branches! It breaks your coworkers\' local repositories.'
      }
    ],
    educationalTakeaway: 'Revert and push forward. Never rewrite shared public history.'
  }
];
