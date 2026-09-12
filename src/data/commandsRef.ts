export interface CommandDoc {
  command: string;
  category: string;
  syntax: string;
  purpose: string;
  example: string;
  whatChanges: string;
  whatDoesNotChange: string;
  whenToUse: string;
  whenNotToUse: string;
  riskLevel: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  related: string[];
}

export interface InteractiveComparison {
  id: string;
  title: string;
  description: string;
  columns: {
    command: string;
    concept: string;
    whatItChanges: string;
    safetyRule: string;
    bestScenario: string;
    drawback: string;
  }[];
}

export const COMMANDS_DOCS: CommandDoc[] = [
  {
    command: 'git status',
    category: 'Inspection',
    syntax: 'git status',
    purpose: 'Inspects the status of the working tree, staging area, and untracked files.',
    example: 'git status',
    whatChanges: 'Nothing. Completely read-only.',
    whatDoesNotChange: 'Files, branches, commits, staging.',
    whenToUse: 'Before and after every Git command to maintain situational awareness.',
    whenNotToUse: 'There is no situation where git status is unsafe.',
    riskLevel: 'SAFE',
    related: ['git diff', 'git log'],
  },
  {
    command: 'git add',
    category: 'Staging',
    syntax: 'git add <file> | git add .',
    purpose: 'Moves modified or new files from the Working Directory into the Staging Area (Index).',
    example: 'git add index.html style.css',
    whatChanges: 'Updates the Staging Area snapshot for the specified files.',
    whatDoesNotChange: 'Working directory content or commit history.',
    whenToUse: 'When you are ready to prepare specific files for the next commit.',
    whenNotToUse: 'Avoid `git add .` blindly when you have sensitive files like .env or temporary logs.',
    riskLevel: 'SAFE',
    related: ['git restore --staged', 'git status'],
  },
  {
    command: 'git commit',
    category: 'History',
    syntax: 'git commit -m "Descriptive message"',
    purpose: 'Records a permanent snapshot of the current Staging Area into the Git repository.',
    example: 'git commit -m "Fix checkout discount code bug"',
    whatChanges: 'Creates a new commit object, advances the current branch pointer and HEAD, clears index.',
    whatDoesNotChange: 'Unstaged files in the working directory.',
    whenToUse: 'When staged files represent a logical, functional increment of work.',
    whenNotToUse: 'When you have not verified that your changes compile or pass tests.',
    riskLevel: 'LOW',
    related: ['git log', 'git add', 'git commit --amend'],
  },
  {
    command: 'git reset',
    category: 'Recovery',
    syntax: 'git reset [--soft | --mixed | --hard] <target-commit>',
    purpose: 'Moves HEAD and the current branch pointer backwards or to a target commit.',
    example: 'git reset --soft HEAD~1',
    whatChanges: 'Branch pointer and HEAD move. With --hard, working tree and index are overwritten.',
    whatDoesNotChange: 'With --soft, index and working tree are preserved.',
    whenToUse: 'To unwrap commits or discard local experiments.',
    whenNotToUse: 'Never use on commits that have already been pushed to a shared remote branch!',
    riskLevel: 'HIGH',
    related: ['git revert', 'git restore', 'git reflog'],
  },
  {
    command: 'git revert',
    category: 'Recovery',
    syntax: 'git revert <commit-hash>',
    purpose: 'Creates a new commit that applies the exact inverse diff of an earlier commit.',
    example: 'git revert a1b2c3d',
    whatChanges: 'Creates a new commit, updates files to negate the target commit.',
    whatDoesNotChange: 'Past commit history remains 100% intact.',
    whenToUse: 'Undoing changes on shared team branches or production.',
    whenNotToUse: 'When you only want to discard local, uncommitted experiments.',
    riskLevel: 'LOW',
    related: ['git reset', 'git log'],
  },
  {
    command: 'git switch',
    category: 'Branches',
    syntax: 'git switch <branch> | git switch -c <new-branch>',
    purpose: 'Switches the active branch and updates the working tree to match.',
    example: 'git switch -c feature/cart',
    whatChanges: 'Moves HEAD pointer to the target branch; updates working files to match target commit.',
    whatDoesNotChange: 'Commit history or uncommitted changes (unless there is a conflict).',
    whenToUse: 'Changing between features, fixes, or releases.',
    whenNotToUse: 'When you have uncommitted changes that would conflict with the target branch.',
    riskLevel: 'SAFE',
    related: ['git branch', 'git checkout'],
  },
  {
    command: 'git merge',
    category: 'Integration',
    syntax: 'git merge <source-branch>',
    purpose: 'Integrates changes from another branch into your currently checked out branch.',
    example: 'git merge feature/cart',
    whatChanges: 'Creates a merge commit (or fast-forwards branch pointer) and updates working tree.',
    whatDoesNotChange: 'The source branch remains untouched.',
    whenToUse: 'Bringing completed feature work into main.',
    whenNotToUse: 'When you are not currently on the destination branch.',
    riskLevel: 'LOW',
    related: ['git rebase', 'git branch'],
  },
  {
    command: 'git rebase',
    category: 'History',
    syntax: 'git rebase <base-branch> | git rebase -i HEAD~3',
    purpose: 'Replays your local branch commits on top of another branch to maintain a clean linear history.',
    example: 'git rebase main',
    whatChanges: 'Rewrites commit hashes for all replayed commits.',
    whatDoesNotChange: 'The upstream branch remains untouched.',
    whenToUse: 'Cleaning up personal local commits before opening a Pull Request.',
    whenNotToUse: 'NEVER rebase commits that have already been pushed to a public/shared branch.',
    riskLevel: 'MEDIUM',
    related: ['git merge', 'git reflog'],
  },
  {
    command: 'git stash',
    category: 'Utilities',
    syntax: 'git stash push -m "msg" | git stash pop | git stash list',
    purpose: 'Temporarily shelves dirty working directory and staging modifications on a stack.',
    example: 'git stash pop',
    whatChanges: 'Working tree is reset to match HEAD; changes are saved in the stash stack.',
    whatDoesNotChange: 'Commit history.',
    whenToUse: 'When you need to switch branches urgently without creating a premature commit.',
    whenNotToUse: 'As a long-term storage mechanism for forgotten work.',
    riskLevel: 'LOW',
    related: ['git switch', 'git restore'],
  },
  {
    command: 'git reflog',
    category: 'Recovery',
    syntax: 'git reflog',
    purpose: 'Displays a chronological journal of every move of HEAD in the local repository.',
    example: 'git reflog',
    whatChanges: 'Nothing. Read-only.',
    whatDoesNotChange: 'Any repository state.',
    whenToUse: 'When you accidentally ran git reset --hard or lost a commit in detached HEAD.',
    whenNotToUse: 'No restrictions. Reflog is local to your machine.',
    riskLevel: 'SAFE',
    related: ['git reset', 'git log'],
  }
];

export const COMPARISONS: InteractiveComparison[] = [
  {
    id: 'restore-vs-reset-vs-revert',
    title: 'git restore vs git reset vs git revert',
    description: 'The three pillars of undoing mistakes in Git. Understanding which one to reach for defines a junior vs senior developer.',
    columns: [
      {
        command: 'git restore <file>',
        concept: 'Discards uncommitted changes in files',
        whatItChanges: 'Working directory or Staging Area only',
        safetyRule: 'SAFE when unstaging; MEDIUM when discarding working files.',
        bestScenario: 'Discarding typos or unstaging accidentally added files.',
        drawback: 'Cannot undo past commits.',
      },
      {
        command: 'git reset <target>',
        concept: 'Rewinds branch pointer backwards',
        whatItChanges: 'HEAD, branch pointer, and optionally index/working tree',
        safetyRule: 'Safe on private local branches; DANGEROUS on shared branches.',
        bestScenario: 'Unwrapping local commits before pushing to fix messages or stage extra files.',
        drawback: 'Rewrites history; --hard deletes uncommitted edits permanently.',
      },
      {
        command: 'git revert <commit>',
        concept: 'Forward-moving undo commit',
        whatItChanges: 'Creates a brand new commit that negates an earlier commit',
        safetyRule: '100% SAFE on public shared branches.',
        bestScenario: 'Undoing bad commits on main or production branches.',
        drawback: 'Adds an extra commit to the history log.',
      },
    ],
  },
  {
    id: 'merge-vs-rebase',
    title: 'git merge vs git rebase',
    description: 'Two approaches to integrating work: merging preserves non-linear history; rebasing creates a sleek linear story.',
    columns: [
      {
        command: 'git merge',
        concept: 'Combines branches via a merge commit',
        whatItChanges: 'Adds a commit with two parents',
        safetyRule: 'Completely safe on shared team branches.',
        bestScenario: 'Merging completed feature branches into main or release branches.',
        drawback: 'Can result in a cluttered "train tracks" commit graph.',
      },
      {
        command: 'git rebase',
        concept: 'Replays commits onto new base',
        whatItChanges: 'Regenerates new commit hashes for your commits',
        safetyRule: 'Only use on private, unpushed branches.',
        bestScenario: 'Keeping your local feature branch up to date with main before opening a PR.',
        drawback: 'Rewrites commit IDs; dangerous if shared.',
      },
    ],
  },
  {
    id: 'fetch-vs-pull',
    title: 'git fetch vs git pull',
    description: 'Downloading remote changes: safe inspection versus automatic integration.',
    columns: [
      {
        command: 'git fetch',
        concept: 'Downloads remote data without modifying local code',
        whatItChanges: 'Updates remote-tracking branches (origin/main) only',
        safetyRule: 'Completely safe. Never alters your working directory.',
        bestScenario: 'Checking what teammates have done before deciding to integrate.',
        drawback: 'Does not update your local working files.',
      },
      {
        command: 'git pull',
        concept: 'git fetch + git merge in one command',
        whatItChanges: 'Downloads remote commits AND merges them into your current local branch',
        safetyRule: 'Can cause unexpected merge conflicts if local branch has diverged.',
        bestScenario: 'Updating your local branch when you know working directory is clean.',
        drawback: 'Can interrupt workflow if a merge conflict occurs unexpectedly.',
      },
    ],
  },
];
