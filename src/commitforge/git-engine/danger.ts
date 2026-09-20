import { DangerLevel } from './types';

export interface CommandDangerInfo {
  level: DangerLevel;
  whatItDoes: string;
  whatCanGoWrong: string;
  whenAppropriate: string;
  whenNotToUse: string;
}

export function evaluateDanger(rawCommand: string): CommandDangerInfo {
  const trimmed = rawCommand.trim();

  if (/git\s+push.*(--force|-f)\b/.test(trimmed)) {
    return {
      level: 'VERY_HIGH',
      whatItDoes: 'Forces the remote branch to match your local branch, overwriting whatever commits are on the remote server.',
      whatCanGoWrong: 'Permanently erases commits made by your teammates on the shared remote repository. Breaks their local working branches.',
      whenAppropriate: 'Only on private feature branches that nobody else is pulling from, after an intentional local rebase.',
      whenNotToUse: 'Never on main/master or shared team branches. Never when multiple developers collaborate on the same branch.'
    };
  }

  if (/git\s+reset.*--hard\b/.test(trimmed)) {
    return {
      level: 'HIGH',
      whatItDoes: 'Moves HEAD, resets the staging area, and overwrites all tracked files in your working directory to match the target commit.',
      whatCanGoWrong: 'All uncommitted changes in tracked files and all staged changes are immediately and permanently discarded. Git cannot recover unstaged changes.',
      whenAppropriate: 'When you are 100% certain you want to completely trash current uncommitted work and reset to a clean state.',
      whenNotToUse: 'When you have any uncommitted edits you might want to keep or reference later.'
    };
  }

  if (/git\s+clean.*(-f|-fd|-df|-xdf)\b/.test(trimmed)) {
    return {
      level: 'HIGH',
      whatItDoes: 'Deletes all untracked files and directories from the working tree.',
      whatCanGoWrong: 'Untracked files were never recorded in Git history. Once deleted, they are gone forever.',
      whenAppropriate: 'Cleaning up untracked build artifacts, generated logs, or test output.',
      whenNotToUse: 'When you created new files that you forgot to `git add`.'
    };
  }

  if (/git\s+rebase\b/.test(trimmed)) {
    return {
      level: 'MEDIUM',
      whatItDoes: 'Replays your commits onto the tip of another branch, rewriting commit hashes and historical timestamps.',
      whatCanGoWrong: 'Rewriting public shared history causes merge conflicts and headaches for all teammates who already based work on those commits.',
      whenAppropriate: 'Cleaning up your personal local feature branch before creating a Pull Request.',
      whenNotToUse: 'Never rebase commits that have already been pushed to a public/shared branch.'
    };
  }

  if (/git\s+reset\b/.test(trimmed)) {
    return {
      level: 'MEDIUM',
      whatItDoes: 'Moves the HEAD and current branch pointer backwards or to a target commit.',
      whatCanGoWrong: 'With default `--mixed`, uncommitted staging is cleared. Easy to cause confusion if you do not understand where your changes went.',
      whenAppropriate: 'Unstaging files or unwrapping the latest commit while keeping all your edits in the working tree.',
      whenNotToUse: 'When a simple `git revert` is safer for preserving transparent project history.'
    };
  }

  if (/git\s+(branch\s+(-D|-d)|rm\b|restore\b)/.test(trimmed)) {
    return {
      level: 'MEDIUM',
      whatItDoes: 'Deletes a branch, removes tracked files, or discards working tree changes.',
      whatCanGoWrong: 'Discarded working tree changes cannot be recovered by Git. Deleting an unmerged branch loses its commits unless retrieved via reflog.',
      whenAppropriate: 'Cleaning up merged branches or discarding unwanted file edits.',
      whenNotToUse: 'When you have not verified whether the changes or branch are already preserved in another branch or commit.'
    };
  }

  if (/git\s+(commit|merge|cherry-pick|tag|stash)\b/.test(trimmed)) {
    return {
      level: 'LOW',
      whatItDoes: 'Records a new snapshot, integrates branches, or tags a milestone.',
      whatCanGoWrong: 'May create unexpected merge conflicts or commit messy code. However, all commits are safely logged in Git history and can be recovered.',
      whenAppropriate: 'Everyday development after staging logical changes.',
      whenNotToUse: 'Committing half-broken code with meaningless messages like "fix".'
    };
  }

  // Read-only commands: status, log, diff, show, blame, reflog, etc.
  return {
    level: 'SAFE',
    whatItDoes: 'Inspects repository state, history, differences, or logs without altering any files or commit pointers.',
    whatCanGoWrong: 'Nothing. This command is completely read-only and safe to run anytime.',
    whenAppropriate: 'Anytime you want to understand the state of your project.',
    whenNotToUse: 'There is no danger in running read-only inspection commands.'
  };
}
