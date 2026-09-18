/* Guided Challenges */
import { UniversalConcept } from '../unifiedAcademyData';

export const TOPIC_11_12_CONCEPTS: Record<string, UniversalConcept> = {
  // ==========================================================================
  // TOPIC 11: Intermediate Git Topics
  // ==========================================================================
  'c-git-stash': {
    id: 'c-git-stash',
    command: 'git stash',
    title: 'git stash',
    topicId: 'topic-11',
    topicNumber: '11',
    topicTitle: 'Intermediate Git Topics',
    subtitle: 'Temporarily shelving uncommitted changes to work on something else with a clean working directory',
    badges: ['Intermediate', 'Everyday Git', 'Context Switch'],
    quote: 'Git stash is your clipboard for dirty working directories. Shelve your mess, switch branches, and paste it back whenever you\'re ready.',
    difficulty: 'Intermediate',

    whatIsIt:
      '`git stash` takes the uncommitted modifications in your working directory (both staged and unstaged) and saves them on a temporary stack of incomplete changes. It then resets your working directory to match `HEAD`, giving you a completely clean slate so you can switch branches or pull updates without committing half-finished work.',
    inSimpleWords:
      'Sweeping your half-finished lego project into a drawer and closing it so you can use the desk for dinner, then taking the legos out afterwards to keep building.',
    whyDoYouNeedIt:
      'You are midway through coding a complex feature when an urgent production bug appears. Git will not allow you to switch branches with conflicting unstaged edits. Instead of making a messy "wip - broken" commit, you run `git stash`, fix the bug on hotfix branch, return, and run `git stash pop`.',
    realWorldAnalogy:
      'Pausing an offline video game. Your character freezes in place; you go answer the doorbell, and when you return, you unpause and resume playing from the exact same millisecond.',

    syntaxCode: 'git stash push -m "<description>" [-u]',
    syntaxTokens: [
      { token: 'git stash', role: 'Command', explanation: 'Shelves working directory modifications.' },
      { token: 'push -m "<msg>"', role: 'Descriptive Label', explanation: 'Gives the stash entry an identifiable name on the stack.' },
      { token: '-u', role: 'Include Untracked Flag', explanation: 'Also stashes newly created untracked files.' },
    ],

    actionStage: {
      before: {
        label: 'Dirty Working Directory',
        description: 'You modified `auth.ts` and created `scratch.ts`. Branch switch is blocked.',
        workingDirectory: [
          { name: 'auth.ts', status: 'modified' },
          { name: 'scratch.ts', status: 'untracked' },
        ],
        stagingArea: [],
        commandPill: 'Uncommitted edits present',
        historyCommits: [{ hash: 'C1', message: 'baseline' }],
        whatChanged: ['Work in progress in working tree.'],
        whatDidNotChange: ['Nothing committed.'],
      },
      running: {
        label: 'Pushing to Stash Stack',
        description: 'Git creates stash commit object `stash@{0}` holding index and working tree diffs, then resets to C1.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'git stash push -u -m "WIP auth"',
        historyCommits: [{ hash: 'C1', message: 'baseline' }],
        whatChanged: ['Working directory reset to pristine HEAD.', 'Diff stored in `.git/refs/stash`.'],
        whatDidNotChange: ['No commits added to your branch history.'],
      },
      after: {
        label: 'Popping Back to Working Tree',
        description: 'After switching branches and returning, `git stash pop` restores the saved diff and removes it from the stash stack.',
        workingDirectory: [
          { name: 'auth.ts', status: 'modified' },
          { name: 'scratch.ts', status: 'untracked' },
        ],
        stagingArea: [],
        commandPill: 'git stash pop -> Work Restored',
        historyCommits: [{ hash: 'C1', message: 'baseline' }],
        whatChanged: ['Your exact working tree state is restored.'],
        whatDidNotChange: ['Stash entry popped from stack.'],
      },
    },

    variations: [
      {
        flag: 'pop',
        title: 'Apply & Remove from Stack',
        syntax: 'git stash pop',
        whatItDoes: 'Applies changes from the latest stash entry (stash@{0}) to the working tree and removes it from the stash stack if merge succeeds.',
        whenToUse: 'When you are done with the interruption and ready to resume your shelved work.',
        example: 'git stash pop',
        snippet: 'git stash pop',
      },
      {
        flag: 'apply',
        title: 'Apply Without Removing',
        syntax: 'git stash apply [stash@{n}]',
        whatItDoes: 'Restores stashed changes into your working directory while preserving the stash entry on the stack for re-application elsewhere.',
        whenToUse: 'When testing stashed changes across multiple different branches.',
        example: 'git stash apply stash@{0}',
        snippet: 'git stash apply',
      },
      {
        flag: 'include-untracked',
        title: 'Stash Untracked Files (-u)',
        syntax: 'git stash push -u -m "<description>"',
        whatItDoes: 'Captures both modified tracked files AND newly created untracked files into the stash.',
        whenToUse: 'Whenever you added new files that have not yet been staged with git add.',
        example: 'git stash push -u -m "WIP login component"',
        snippet: 'git stash push -u',
      },
      {
        flag: 'branch',
        title: 'Create Branch from Stash',
        syntax: 'git stash branch <new-branch-name>',
        whatItDoes: 'Creates a new branch starting from the commit where the stash was created, checks it out, and pops the stash without conflicts.',
        whenToUse: 'When your active branch moved too far forward and popping stash causes heavy conflicts.',
        example: 'git stash branch feature-rescue',
        snippet: 'git stash branch <branch>',
      },
    ],

    scenarios: [
      {
        id: 'sc-stash-1',
        title: 'Critical Hotfix While Feature is Half-Finished',
        context: 'You are 4 hours into implementing a payment refactor with 8 uncommitted files. A Severity-1 production issue requires you to switch to main immediately.',
        question: 'How do you switch branches safely without creating messy WIP commits or losing changes?',
        options: [
          {
            label: 'Shelve all tracked and untracked changes with a descriptive message, checkout main, fix the bug, then pop your work back upon return',
            command: 'git stash push -u -m "wip payment refactor" && git switch main',
            isCorrect: true,
            explanation: 'git stash push -u captures untracked files and leaves your working tree completely clean so you can switch branches with 0 friction.',
          },
          {
            label: 'Run git reset --hard HEAD to wipe local changes and start fresh later',
            command: 'git reset --hard HEAD',
            isCorrect: false,
            explanation: 'git reset --hard permanently destroys all uncommitted work in your working directory!',
          },
        ],
        whenToUse: 'Handling sudden sprint interruptions.',
        commandExample: 'git stash push -u -m "WIP" && git switch main',
        note: 'Restores working directory to pristine state.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'git stash pop',
        commandB: 'git stash apply',
        aspect: 'Stack Retention',
        descriptionA: 'Restores the changes and immediately drops the entry from the stash stack upon clean application.',
        descriptionB: 'Restores the changes but retains the entry on the stash stack until explicitly dropped.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Forgetting to use the -u flag when stashing newly created files',
        whyItHappens: 'git stash by default only saves tracked files; newly created files remain loose in the working directory.',
        fix: 'Always use `git stash push -u` to include untracked files in the stash.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"stable release\" > app.js",
          "git add app.js",
          "git commit -m \"feat: stable app\"",
          "echo \"// urgent experimental draft\" >> app.js"
  ],
      guidedSteps: [
          {
                  "instruction": "Inspect uncommitted experimental edits",
                  "command": "git status -s",
                  "hint": "Type git status -s"
          },
          {
                  "instruction": "Stash uncommitted edits to clean your working tree",
                  "command": "git stash",
                  "hint": "Type git stash"
          },
          {
                  "instruction": "Verify your working tree is clean",
                  "command": "git status",
                  "hint": "Type git status"
          },
          {
                  "instruction": "Reapply your stashed work",
                  "command": "git stash pop",
                  "hint": "Type git stash pop"
          }
  ],
      initialFiles: [{ name: 'feature.js', content: '// WIP unfinished code\nconsole.log("half done");\n' }],
      initialCommits: [{ hash: 'a1b2c3d', message: 'feat: setup feature structure' }],
      targetTask: 'Check git status and inspect uncommitted changes.',
      hints: ['Run `git status`.'],
      validationRegex: /git status/i,
      solutionCommands: ['git status'],
    },

    challenge: {
      title: 'Practice Stashing State',
      instructions: 'Examine status of working tree before stashing modifications.',
      startingState: 'Uncommitted file present.',
      goalState: 'Working tree status printed to terminal.',
      hints: ['Run `git status`.'],
    },

    reference: {
      officialDocUrl: 'https://git-scm.com/docs/git-stash',
      syntaxCheatSheet: [
        'git stash : Shelve tracked changes',
        'git stash -u : Shelve tracked and untracked files',
        'git stash pop : Restore changes and remove from stash stack',
        'git stash list : View all saved stashes',
        'git stash clear : Delete all saved stashes',
      ],
      commonErrors: [
        { error: 'CONFLICT (content): Merge conflict in <file> on stash pop', remedy: 'Your active branch modified the same lines that were stashed. Open the file, resolve conflict markers, run `git add`, and drop the stash manually.' },
      ],
      mentalModelDiagram: {
        concept: 'Stash LIFO Stack',
        explanation: 'stash@{0} (most recent)\\nstash@{1}\\nstash@{2}\\nStored in .git/refs/stash pointing to multi-parent commit objects.',
        storageLocation: '.git/logs/refs/stash and .git/refs/stash.',
      },
      edgeCases: ['By default, `git stash` ignores untracked files and files matched by `.gitignore`. Use `-u` (untracked) or `-a` (all, including ignored) to capture them.'],
    },
  },

  'c-git-cherry-pick': {
    id: 'c-git-cherry-pick',
    command: 'git cherry-pick',
    title: 'git cherry-pick',
    topicId: 'topic-11',
    topicNumber: '11',
    topicTitle: 'Intermediate Git Topics',
    subtitle: 'Copying an individual commit from another branch and applying it directly onto your current branch',
    badges: ['Intermediate', 'Commit Surgery', 'Surgical'],
    quote: 'Don\'t merge the whole tree when you only need one ripe fruit. Cherry-pick lets you extract single commits surgically.',
    difficulty: 'Intermediate',

    whatIsIt:
      '`git cherry-pick` takes the patch introduced by an existing commit on any branch and applies it onto your current working branch as a brand new commit with a new hash. It allows you to select specific bugfixes or features without merging the entire history of the branch where the commit originally lived.',
    inSimpleWords:
      'Photocopying a single recipe from a friend\'s cookbook and gluing it into your own cookbook, without taking their whole book.',
    whyDoYouNeedIt:
      'A teammate fixed a critical bug in a large, unreleased 50-commit feature branch. You need that single bugfix in production right now, but the rest of their branch is broken and cannot be merged. Cherry-pick copies just that one commit into `main`.',
    realWorldAnalogy:
      'A buffet line. Instead of taking the entire tray of salad, pasta, fish, and soup, you use the tongs to pick up just the single piece of grilled chicken you want.',

    syntaxCode: 'git cherry-pick <commit-hash>',
    syntaxTokens: [
      { token: 'git cherry-pick', role: 'Command', explanation: 'Applies diff of specified commit to HEAD.' },
      { token: '<commit-hash>', role: 'Target Commit', explanation: 'The 7-to-40 character SHA of the commit you want to copy.' },
    ],

    actionStage: {
      before: {
        label: 'Commit on Unmerged Branch',
        description: 'Commit `e8a912b` ("fix: resolve memory leak") lives on experimental branch `dev-ai`. You are on `main`.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'HEAD -> main',
        historyCommits: [
          { hash: 'M2', message: 'feat: production stable (HEAD -> main)' },
          { hash: 'e8a912b', message: 'fix: resolve memory leak (on dev-ai)' },
        ],
        whatChanged: ['Bugfix exists only on dev-ai branch.'],
        whatDidNotChange: ['Main suffers from memory leak.'],
      },
      running: {
        label: 'Extracting and Replaying Patch',
        description: 'Git extracts the diff introduced by `e8a912b` and applies it cleanly on top of `M2`.',
        workingDirectory: [{ name: 'server.js', status: 'staged' }],
        stagingArea: [{ name: 'server.js', status: 'staged' }],
        commandPill: 'git cherry-pick e8a912b',
        historyCommits: [
          { hash: 'M2', message: 'feat: production stable' },
        ],
        whatChanged: ['Diff applied to current branch working tree and index.'],
        whatDidNotChange: ['Original commit on dev-ai remains completely intact.'],
      },
      after: {
        label: 'New Duplicate Commit Created',
        description: 'New commit `f41c33a` recorded on main with the same message and diff, but a new timestamp and hash.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Cherry-pick successful',
        historyCommits: [
          { hash: 'f41c33a', message: 'fix: resolve memory leak (HEAD -> main)' },
          { hash: 'M2', message: 'feat: production stable' },
        ],
        whatChanged: ['Main now has the bugfix without adopting any other commits from dev-ai.'],
        whatDidNotChange: ['Dev-ai branch continues its independent work.'],
      },
    },

    variations: [
      {
        flag: 'Single Commit',
        title: 'Surgical Single Commit Replay',
        syntax: 'git cherry-pick <commit-hash>',
        whatItDoes: 'Calculates the diff introduced by the specified commit and replays it on top of current HEAD as a new commit.',
        whenToUse: 'Extracting a bugfix or isolated feature from an experimental branch.',
        example: 'git cherry-pick 7b2a8f4',
        snippet: 'git cherry-pick 7b2a8f4',
      },
      {
        flag: '-n (no-commit)',
        title: 'Stage Changes Without Committing',
        syntax: 'git cherry-pick -n <commit-hash>',
        whatItDoes: 'Applies the commit diff into your working tree and staging index without automatically creating a commit.',
        whenToUse: 'When you want to tweak the code or batch multiple commits into one.',
        example: 'git cherry-pick -n 7b2a8f4',
        snippet: 'git cherry-pick -n <hash>',
      },
      {
        flag: '-x',
        title: 'Record Provenance Trailer',
        syntax: 'git cherry-pick -x <commit-hash>',
        whatItDoes: 'Appends "(cherry picked from commit ...)" trailer to the commit message to preserve cross-branch provenance.',
        whenToUse: 'Backporting bugfixes to maintenance/LTS release branches.',
        example: 'git cherry-pick -x 7b2a8f4',
        snippet: 'git cherry-pick -x <hash>',
      },
      {
        flag: 'Range',
        title: 'Cherry-Pick Sequential Range',
        syntax: 'git cherry-pick <old-hash>..<new-hash>',
        whatItDoes: 'Applies a chronological series of commits from another branch onto your current branch one by one.',
        whenToUse: 'Porting a multi-commit feature before the rest of the branch is ready.',
        example: 'git cherry-pick A..B',
        snippet: 'git cherry-pick A..B',
      },
    ],

    scenarios: [
      {
        id: 'sc-cherry-1',
        title: 'Backporting an Isolated Hotfix from Dev to Production',
        context: 'A teammate fixed a critical null-pointer exception on a feature branch with 40 unreviewed commits. You need that single fix deployed to production main right now.',
        question: 'How do you extract just that specific bugfix without merging 40 unreviewed commits?',
        options: [
          {
            label: 'Check out production main and cherry-pick the exact commit hash of the bugfix with -x',
            command: 'git switch main && git cherry-pick -x a1b2c3d',
            isCorrect: true,
            explanation: 'git cherry-pick applies only the single commit diff onto main while leaving the remaining 39 commits isolated on the feature branch.',
          },
          {
            label: 'Merge the entire feature branch into main and revert the 39 unwanted commits one by one',
            command: 'git merge feature-branch',
            isCorrect: false,
            explanation: 'Merging the branch pollutes main with incomplete, broken code and creates enormous revert overhead.',
          },
        ],
        whenToUse: 'Backporting security patches and bugfixes.',
        commandExample: 'git cherry-pick -x <hash>',
        note: '-x flag provides an audit trail.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'git cherry-pick <sha>',
        commandB: 'git merge <branch>',
        aspect: 'Scope of Integration',
        descriptionA: 'Surgically copies a single commit diff to HEAD as a brand new commit, ignoring branch history.',
        descriptionB: 'Brings all commits and history of the branch together, creating a merge commit or fast-forward.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Cherry-picking commits back and forth repeatedly between collaborative branches',
        whyItHappens: 'Treating cherry-pick as a substitute for standard branch merging and rebasing.',
        fix: 'Use merge or rebase for branch synchronization; reserve cherry-pick for surgical hotfix backports.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"core\" > core.txt",
          "git add core.txt",
          "git commit -m \"feat: core\"",
          "git switch -c hotfix",
          "echo \"critical fix\" > fix.txt",
          "git add fix.txt",
          "git commit -m \"fix: critical security bug\"",
          "git switch main"
  ],
      guidedSteps: [
          {
                  "instruction": "Inspect hotfix branch commits",
                  "command": "git log hotfix --oneline -n 1",
                  "hint": "Type git log hotfix --oneline -n 1"
          },
          {
                  "instruction": "Cherry-pick the specific fix commit onto main",
                  "command": "git cherry-pick hotfix",
                  "hint": "Type git cherry-pick hotfix"
          },
          {
                  "instruction": "Verify the commit applied to main",
                  "command": "git log --oneline -n 2",
                  "hint": "Type git log --oneline -n 2"
          }
  ],
      initialFiles: [{ name: 'patch.js', content: 'export const patched = true;\n' }],
      initialCommits: [
        { hash: '1122334', message: 'chore: base' },
        { hash: '9988776', message: 'fix: patch memory leak' },
      ],
      targetTask: 'Check commit log with git log --oneline to identify commit hashes.',
      hints: ['Run `git log --oneline`.'],
      validationRegex: /git log/i,
      solutionCommands: ['git log --oneline'],
    },

    challenge: {
      title: 'Inspect Target Cherry-Pick Commit',
      instructions: 'Display the latest commit hash to use as a cherry-pick candidate.',
      startingState: 'Recent commits on branch.',
      goalState: 'Commit SHA displayed in output.',
      hints: ['Run `git log -1 --pretty=format:"%h"`.'],
    },

    reference: {
      officialDocUrl: 'https://git-scm.com/docs/git-cherry-pick',
      syntaxCheatSheet: [
        'git cherry-pick <sha> : Copy commit to current branch',
        'git cherry-pick -n <sha> : Stage diff without committing',
        'git cherry-pick -x <sha> : Record origin commit trailer',
        'git cherry-pick --continue : Resume after conflict resolution',
        'git cherry-pick --abort : Cancel and restore branch',
      ],
      commonErrors: [
        { error: 'Cherry-pick produces duplicate commits when branches merge later', remedy: 'Git is smart enough to handle duplicate diffs in 3-way merges, but avoid cherry-picking excessively when normal rebase or merge would work.' },
      ],
      mentalModelDiagram: {
        concept: 'Cherry-Pick Differential Copy',
        explanation: 'Branch A: ---[C1]---[C2 (fix)]---[C3]\\n                                  | (diff applied as new commit)\\nBranch B: ---[B1]----------------[C2\']',
        storageLocation: 'A brand new commit object with current HEAD as parent.',
      },
      edgeCases: ['Cherry-picking a merge commit requires passing `-m 1` or `-m 2` to specify which parent line is considered the mainline.'],
    },
  },

  'c-git-rebase-i': {
    id: 'c-git-rebase-i',
    command: 'git rebase -i',
    title: 'Interactive Rebase',
    topicId: 'topic-11',
    topicNumber: '11',
    topicTitle: 'Intermediate Git Topics',
    subtitle: 'Squash, reword, drop, fixup, and reorder past commits to craft a polished PR history',
    badges: ['Advanced', 'History Rewriting', 'Git Mastery'],
    quote: 'Interactive rebase is the sculptor\'s chisel for Git history. Turn a rough block of messy drafts into a masterpiece before pushing.',
    difficulty: 'Advanced',

    whatIsIt:
      'Interactive Rebase (`git rebase -i`) opens a text editor showing a script of commits between your branch and a base. You can choose specific actions for each commit: `pick` (keep), `reword` (edit message), `edit` (pause to amend files), `squash` (melt into previous commit), `fixup` (melt into previous commit discarding message), `drop` (delete commit), or reorder lines to reorder history.',
    inSimpleWords:
      'A video editing timeline where you can delete bloopers, merge three quick takes into one smooth scene, and rename clips before exporting the final movie.',
    whyDoYouNeedIt:
      'During development, you inevitably make messy commits: "typo", "wip", "broken test", "fix test", "remove debug print". Submitting this to code review is unprofessional and hard to read. `git rebase -i` lets you combine them into 1–2 clean, descriptive commits.',
    realWorldAnalogy:
      'Writing an email draft. You write, backspace, rephrase, delete a paragraph, and fix spelling mistakes. You only hit "Send" when the email is clean; the recipient never sees your backspaces.',

    syntaxCode: 'git rebase -i HEAD~<number-of-commits>',
    syntaxTokens: [
      { token: 'git rebase -i', role: 'Interactive Flag', explanation: 'Launches interactive editor script.' },
      { token: 'HEAD~3', role: 'Revision Range', explanation: 'Operates on the last 3 commits.' },
      { token: 'squash / fixup', role: 'Action Commands', explanation: 'Melts a commit into the one above it.' },
    ],

    actionStage: {
      before: {
        label: 'Noisy Commit History',
        description: 'Last 3 commits on feature branch: C1 "feat: user avatar", C2 "fix: typo in avatar", C3 "remove console.log".',
        workingDirectory: [],
        stagingArea: [],
        commandPill: '3 noisy commits',
        historyCommits: [
          { hash: 'C3', message: 'remove console.log' },
          { hash: 'C2', message: 'fix: typo in avatar' },
          { hash: 'C1', message: 'feat: user avatar' },
        ],
        whatChanged: ['Messy trial-and-error commits.'],
        whatDidNotChange: ['Final code is correct, but history is ugly.'],
      },
      running: {
        label: 'Editing Rebase Todo List',
        description: 'In editor: keep C1 as `pick`, change C2 to `fixup`, change C3 to `fixup`. Save and exit.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'pick C1 / fixup C2 / fixup C3',
        historyCommits: [],
        whatChanged: ['Git replays C1, folds C2\'s changes into it, then folds C3\'s changes into it.'],
        whatDidNotChange: ['Working code result remains completely identical.'],
      },
      after: {
        label: 'Sculpted Single Commit',
        description: 'History now contains one single pristine commit: "feat: user avatar" with all fixes included!',
        workingDirectory: [],
        stagingArea: [],
        commandPill: '1 clean commit: ready for PR',
        historyCommits: [
          { hash: 'C1_CLEAN', message: 'feat: user avatar (all fixes bundled)' },
        ],
        whatChanged: ['Noisy interim commits eliminated from git log.'],
        whatDidNotChange: ['Reviewers see only clean, cohesive engineering.'],
      },
    },

    variations: [
      {
        flag: 'squash (s)',
        title: 'Melt Commits & Merge Messages',
        syntax: 'squash <commit-hash>',
        whatItDoes: 'Combines the commit into the previous commit and opens an editor to merge and edit both commit messages together.',
        whenToUse: 'Combining logical steps that belong together in a single conceptual feature.',
        example: 'squash 2b3c4d fix: tests',
        snippet: 'squash <sha>',
      },
      {
        flag: 'fixup (f)',
        title: 'Melt Commits & Discard Message',
        syntax: 'fixup <commit-hash>',
        whatItDoes: 'Combines the commit into the previous commit while automatically discarding this commit\'s log message.',
        whenToUse: 'Melting typo fixes, formatting, and lint tweaks into the main feature commit.',
        example: 'fixup 3c4d5e chore: lint',
        snippet: 'fixup <sha>',
      },
      {
        flag: 'reword (r)',
        title: 'Edit Commit Message',
        syntax: 'reword <commit-hash>',
        whatItDoes: 'Pauses the rebase process to let you edit the commit message without modifying any code diffs.',
        whenToUse: 'Correcting typos or formatting commit messages to follow Conventional Commits standard.',
        example: 'reword 1a2b3c feat: improved api',
        snippet: 'reword <sha>',
      },
      {
        flag: 'drop (d)',
        title: 'Delete Commit From History',
        syntax: 'drop <commit-hash>',
        whatItDoes: 'Deletes the commit entirely from branch history and recalculates subsequent commit patches.',
        whenToUse: 'Removing experimental debugging commits or dead temporary code.',
        example: 'drop 4d5e6f debug logs',
        snippet: 'drop <sha>',
      },
      {
        flag: 'edit (e)',
        title: 'Pause to Amend Code',
        syntax: 'edit <commit-hash>',
        whatItDoes: 'Pauses the rebase at this commit so you can amend files, add new files, or split it into multiple commits.',
        whenToUse: 'When an old commit contains a bug or missing file that needs fixing before later commits.',
        example: 'edit 1a2b3c feat: add auth',
        snippet: 'edit <sha>',
      },
    ],

    scenarios: [
      {
        id: 'sc-rebase-i-1',
        title: 'Polishing 6 Work-in-Progress Commits into 1 Clean Feature Commit',
        context: 'Before submitting a Pull Request, your branch has commits: "add auth", "typo", "wip", "fix test", "lint", "done".',
        question: 'How do you turn this into a professional, single-commit PR without losing any work?',
        options: [
          {
            label: 'Run git rebase -i HEAD~6, keep the first commit as pick, and set the remaining 5 commits to fixup',
            command: 'git rebase -i HEAD~6',
            isCorrect: true,
            explanation: 'Setting the later 5 commits to fixup melts all code changes into the first commit and discards the noisy WIP commit messages.',
          },
          {
            label: 'Delete the .git directory and run git init',
            command: 'rm -rf .git && git init',
            isCorrect: false,
            explanation: 'Deleting .git destroys the entire repository history, remotes, and branch tracking.',
          },
        ],
        whenToUse: 'Pre-PR polishing routine.',
        commandExample: 'git rebase -i origin/main',
        note: 'Squashes trial-and-error commits cleanly.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'squash (s)',
        commandB: 'fixup (f)',
        aspect: 'Commit Message Handling',
        descriptionA: 'Melts code into previous commit and prompts you to edit and merge the commit messages.',
        descriptionB: 'Melts code into previous commit and automatically discards this commit\'s message.',
        safeForSharedHistory: { a: false, b: false },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Running interactive rebase on commits already pushed to a shared public branch',
        whyItHappens: 'Attempting to clean up history after teammates have already pulled the original commit hashes.',
        fix: 'Only interactively rebase local private branches before opening/merging PRs.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"1\" > file.txt",
          "git add file.txt",
          "git commit -m \"feat: step 1\"",
          "echo \"2\" >> file.txt",
          "git commit -am \"wip typo\"",
          "echo \"3\" >> file.txt",
          "git commit -am \"feat: step 2\""
  ],
      guidedSteps: [
          {
                  "instruction": "Check commit sequence before rebasing",
                  "command": "git log --oneline -n 3",
                  "hint": "Type git log --oneline -n 3"
          },
          {
                  "instruction": "Inspect repository status",
                  "command": "git status",
                  "hint": "Type git status"
          }
  ],
      initialFiles: [{ name: 'feature.ts', content: 'export const status = "ready";\n' }],
      initialCommits: [
        { hash: 'a111111', message: 'feat: add feature' },
        { hash: 'b222222', message: 'fix: typo' },
        { hash: 'c333333', message: 'chore: format' },
      ],
      targetTask: 'Check git log --oneline to inspect the last 3 commits.',
      hints: ['Run `git log --oneline -3`.'],
      validationRegex: /git log/i,
      solutionCommands: ['git log --oneline -3'],
    },

    challenge: {
      title: 'Analyze Recent Commits for Squashing',
      instructions: 'Inspect the last 3 commits to plan which ones could be merged using fixup.',
      startingState: 'Branch with 3 commits.',
      goalState: '3 commits displayed via git log.',
      hints: ['Run `git log --oneline -n 3`.'],
    },

    reference: {
      officialDocUrl: 'https://git-scm.com/docs/git-rebase#_interactive_mode',
      syntaxCheatSheet: [
        'git rebase -i HEAD~N : Rebase last N commits',
        'git rebase -i <base-branch> : Rebase all branch commits against base',
        'git rebase --continue : Proceed to next step',
        'git rebase --abort : Abort and restore original state',
      ],
      commonErrors: [
        { error: 'Deleting a line in the rebase editor deletes that commit!', remedy: 'If you didn\'t mean to delete the commit, don\'t delete the line—change its keyword to `pick` or abort with `git rebase --abort`.' },
      ],
      mentalModelDiagram: {
        concept: 'Rebase Todo Execution',
        explanation: 'Top of file = OLDEST commit (executed first). Bottom of file = NEWEST commit (executed last).',
        storageLocation: '.git/rebase-merge/git-rebase-todo temporary instruction file.',
      },
      edgeCases: ['Never interactively rebase commits that have already been pushed to a shared collaboration branch like `main` or `develop`.'],
    },
  },

  'c-git-reset-modes': {
    id: 'c-git-reset-modes',
    command: 'git reset',
    title: 'git reset (--soft, --mixed, --hard)',
    topicId: 'topic-11',
    topicNumber: '11',
    topicTitle: 'Intermediate Git Topics',
    subtitle: 'Moving the HEAD pointer backward while controlling what happens to the Staging Index and Working Tree',
    badges: ['Intermediate', 'Undo Tool', 'Crucial'],
    quote: 'Reset moves HEAD. --soft keeps index and files. --mixed (default) resets index. --hard destroys everything.',
    difficulty: 'Intermediate',

    whatIsIt:
      '`git reset` is Git\'s primary tool for moving the current branch pointer (`HEAD`) to an earlier commit in history. The three modes dictate how the three trees (HEAD, Index, Working Directory) are updated: (1) `--soft` moves HEAD only, leaving staged files intact; (2) `--mixed` (default) moves HEAD and resets the index, leaving files in working directory; (3) `--hard` moves HEAD, clears index, and destroys working directory changes.',
    inSimpleWords:
      'A time machine with three dials: Soft rewinds the clock but keeps your paperwork on your desk ready to sign. Mixed rewinds the clock and takes the papers out of the envelope. Hard rewinds the clock and burns the papers in a bonfire.',
    whyDoYouNeedIt:
      'You committed too early and want to add another file (`--soft`). Or you committed broken code and want to start over without losing edits (`--mixed`). Or an experiment completely failed and you want to wipe it off the face of the earth (`--hard`).',
    realWorldAnalogy:
      'Unpacking a moving box. Soft: you take the box off the moving truck into the living room. Mixed: you open the box and place the items on the floor. Hard: you throw the entire box into the incinerator.',

    syntaxCode: 'git reset [--soft | --mixed | --hard] <target-commit>',
    syntaxTokens: [
      { token: 'git reset', role: 'Command', explanation: 'Moves HEAD pointer backward.' },
      { token: '--soft', role: 'Safe Undo Flag', explanation: 'Keeps changes staged in index.' },
      { token: '--mixed', role: 'Default Flag', explanation: 'Keeps changes unstaged in working directory.' },
      { token: '--hard', role: 'Destructive Flag', explanation: 'Wipes changes completely from disk.' },
    ],

    actionStage: {
      before: {
        label: 'Commit Just Made (HEAD)',
        description: 'You just made commit C2 ("wip: bad commit message"). You want to undo it.',
        workingDirectory: [{ name: 'app.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'HEAD at C2',
        historyCommits: [
          { hash: 'C2', message: 'wip: bad commit message (HEAD)' },
          { hash: 'C1', message: 'feat: working baseline' },
        ],
        whatChanged: ['Commit C2 saved.'],
        whatDidNotChange: ['Files are currently clean.'],
      },
      running: {
        label: 'Executing git reset --soft HEAD~1',
        description: 'Git moves HEAD back to C1. All modifications introduced by C2 remain staged in index!',
        workingDirectory: [],
        stagingArea: [{ name: 'app.js', status: 'staged' }],
        commandPill: 'git reset --soft HEAD~1',
        historyCommits: [
          { hash: 'C1', message: 'feat: working baseline (HEAD)' },
        ],
        whatChanged: ['HEAD moved back to C1.', 'Diff from C2 remains staged in green, ready for new commit.'],
        whatDidNotChange: ['Zero code was lost.'],
      },
      after: {
        label: 'Re-committed with Perfect Message',
        description: 'You run `git commit -m "feat(app): add complete validation flow"`. Clean history achieved.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Clean commit C2_NEW',
        historyCommits: [
          { hash: 'C2_NEW', message: 'feat(app): add complete validation flow (HEAD)' },
          { hash: 'C1', message: 'feat: working baseline' },
        ],
        whatChanged: ['Ugly commit replaced cleanly.'],
        whatDidNotChange: ['Repository history remains linear.'],
      },
    },

    variations: [
      {
        flag: '--soft',
        title: 'Rewind HEAD, Keep Staged',
        syntax: 'git reset --soft HEAD~1',
        whatItDoes: 'Moves HEAD pointer back 1 commit; keeps all modified files staged in index ready for immediate re-commit.',
        whenToUse: 'Redoing a commit message, adding forgotten files, or squashing recent commits.',
        example: 'git reset --soft HEAD~1',
        snippet: 'git reset --soft HEAD~1',
      },
      {
        flag: '--mixed',
        title: 'Rewind HEAD, Keep Working Tree (Default)',
        syntax: 'git reset HEAD~1',
        whatItDoes: 'Moves HEAD back 1 commit and clears index; preserves modified files in working directory so you can selectively re-stage them.',
        whenToUse: 'When you want to inspect or split changes before staging with git add -p.',
        example: 'git reset HEAD~1',
        snippet: 'git reset HEAD~1',
      },
      {
        flag: '--hard',
        title: 'Rewind HEAD & Discard All Changes',
        syntax: 'git reset --hard HEAD~1',
        whatItDoes: 'Moves HEAD back 1 commit, clears staging index, and permanently overwrites working tree files to match target commit.',
        whenToUse: 'Throwing away broken experiments and resetting to match origin exactly.',
        example: 'git reset --hard origin/main',
        snippet: 'git reset --hard HEAD~1',
        warning: 'Destructive operation! Any uncommitted changes in your working tree will be permanently wiped.',
      },
    ],

    scenarios: [
      {
        id: 'sc-reset-1',
        title: 'Accidentally Committed Too Early with Missing Files',
        context: 'You ran git commit -m "feat: user profile", but forgot to include avatar-uploader.ts and css styles.',
        question: 'What is the safest way to undo the commit while keeping all your files staged and intact?',
        options: [
          {
            label: 'Run git reset --soft HEAD~1, stage the missing files, and re-commit',
            command: 'git reset --soft HEAD~1 && git add . && git commit -m "feat: user profile with uploader"',
            isCorrect: true,
            explanation: 'git reset --soft rewinds the commit object but preserves all modified files staged in the index, allowing you to easily add files and re-commit.',
          },
          {
            label: 'Run git reset --hard HEAD~1',
            command: 'git reset --hard HEAD~1',
            isCorrect: false,
            explanation: '--hard will erase all changes introduced in that commit from disk.',
          },
        ],
        whenToUse: 'Undoing premature or incomplete commits.',
        commandExample: 'git reset --soft HEAD~1',
        note: 'Leaves index green and ready to re-commit.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'git reset --soft HEAD~1',
        commandB: 'git reset --hard HEAD~1',
        aspect: 'Working Directory & Index Safety',
        descriptionA: '100% non-destructive. HEAD moves backward, but all code remains staged in the index ready to re-commit.',
        descriptionB: 'Destructive. HEAD moves backward, and all uncommitted code and index deltas are permanently wiped.',
        safeForSharedHistory: { a: false, b: false },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Running git reset --hard when you only wanted to unstage files or change a commit message',
        whyItHappens: 'Assuming reset --hard is just a standard undo command.',
        fix: 'Use git reset --soft to undo commits safely, or git restore --staged to unstage individual files.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"v1\" > file.txt",
          "git add file.txt",
          "git commit -m \"feat: commit 1\"",
          "echo \"v2\" > file.txt",
          "git commit -am \"feat: commit 2 (accidental)\""
  ],
      guidedSteps: [
          {
                  "instruction": "Inspect the last 2 commits",
                  "command": "git log --oneline -n 2",
                  "hint": "Type git log --oneline -n 2"
          },
          {
                  "instruction": "Soft reset back 1 commit keeping changes staged",
                  "command": "git reset --soft HEAD~1",
                  "hint": "Type git reset --soft HEAD~1"
          },
          {
                  "instruction": "Verify changes remain staged in index",
                  "command": "git status",
                  "hint": "Type git status"
          }
  ],
      initialFiles: [{ name: 'index.js', content: 'console.log("active code");\n' }],
      initialCommits: [
        { hash: '1010101', message: 'Initial baseline' },
        { hash: '2020202', message: 'wip commit to undo' },
      ],
      targetTask: 'Check git status and commit log before resetting.',
      hints: ['Run `git log --oneline`.'],
      validationRegex: /git log/i,
      solutionCommands: ['git log --oneline'],
    },

    challenge: {
      title: 'Inspect HEAD Distance',
      instructions: 'Confirm the hash of HEAD~1 using git rev-parse.',
      startingState: 'Repository with multiple commits.',
      goalState: 'Parent commit hash displayed.',
      hints: ['Run `git rev-parse HEAD~1`.'],
    },

    reference: {
      officialDocUrl: 'https://git-scm.com/docs/git-reset',
      syntaxCheatSheet: [
        'git reset --soft HEAD~1 : Undo commit, keep staged',
        'git reset HEAD~1 : Undo commit, keep unstaged',
        'git reset --hard HEAD~1 : Undo commit, destroy changes',
        'git reset <file> : Unstage a specific file (legacy)',
      ],
      commonErrors: [
        { error: 'Accidentally ran git reset --hard and lost uncommitted work', remedy: 'Uncommitted files are gone forever, but any committed work can be rescued using `git reflog`!' },
      ],
      mentalModelDiagram: {
        concept: 'The 3 Trees Matrix',
        explanation: 'Mode    | HEAD Moves? | Index (Staged) Updated? | Working Tree Touched?\\n--soft  | YES         | NO (remains staged)     | NO\\n--mixed | YES         | YES (unstaged)          | NO\\n--hard  | YES         | YES                     | YES (overwritten!)',
        storageLocation: '.git/refs/heads/<branch> pointer file updated.',
      },
      edgeCases: ['Never reset a branch that has already been pushed and shared with teammates, because force-pushing will overwrite their branches.'],
    },
  },

  'c-git-revert': {
    id: 'c-git-revert',
    command: 'git revert',
    title: 'git revert',
    topicId: 'topic-11',
    topicNumber: '11',
    topicTitle: 'Intermediate Git Topics',
    subtitle: 'Safely undoing changes on public shared branches by creating a new forward commit that inverts the target diff',
    badges: ['Intermediate', 'Safe Undo', 'Team Collaboration'],
    quote: 'Reset rewrites history backward; revert makes history forward. Revert is the only safe way to undo commits on shared branches.',
    difficulty: 'Intermediate',

    whatIsIt:
      '`git revert` records a new commit that applies the exact inverse diff of an earlier commit. If commit `C2` added 10 lines and deleted 2 lines, `git revert C2` creates commit `C3` that deletes those 10 lines and restores the 2 lines. Because it only moves forward in time, it does not rewrite history and requires no force pushes.',
    inSimpleWords:
      'Writing an errata or retraction paragraph in today\'s newspaper rather than breaking into everyone\'s houses at night to tear yesterday\'s page out of their newspapers.',
    whyDoYouNeedIt:
      'If you push a buggy commit to `main`, using `git reset` and `git push --force` will corrupt the local repositories of every engineer on your team. `git revert` is 100% safe for shared public branches because teammates simply pull the new revert commit.',
    realWorldAnalogy:
      'Accounting ledgers. In double-entry bookkeeping, accountants never erase or white-out a line with an error; they post an offsetting adjustment transaction on the next line.',

    syntaxCode: 'git revert [--no-commit] <commit-hash>',
    syntaxTokens: [
      { token: 'git revert', role: 'Command', explanation: 'Inverts target commit diff.' },
      { token: '<commit-hash>', role: 'Target to Undo', explanation: 'The SHA of the problematic commit to invert.' },
      { token: '--no-commit', role: 'Optional Flag', explanation: 'Stages the inverse diff in index without immediately committing.' },
    ],

    actionStage: {
      before: {
        label: 'Bug in Production on Shared Main',
        description: 'Commit `c8b91a` broke production payment processing. Commit is already pushed to GitHub `origin/main`.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Pushed broken commit on main',
        historyCommits: [
          { hash: 'c8b91a', message: 'feat: update payment gateway (BROKEN)' },
          { hash: 'b7a80f', message: 'chore: previous stable baseline' },
        ],
        whatChanged: ['Production is failing.'],
        whatDidNotChange: ['Cannot use git reset because commit is public.'],
      },
      running: {
        label: 'Generating Inverting Diff',
        description: 'Git analyzes `c8b91a`, creates inverse diff, and prepares commit message: "Revert \'feat: update payment gateway\'".',
        workingDirectory: [{ name: 'payment.js', status: 'staged' }],
        stagingArea: [{ name: 'payment.js', status: 'staged' }],
        commandPill: 'git revert c8b91a',
        historyCommits: [],
        whatChanged: ['Inverse changes staged.'],
        whatDidNotChange: ['History is not rewritten.'],
      },
      after: {
        label: 'New Revert Commit Pushed',
        description: 'New commit `d9c02b` created on main. Pushed with regular `git push`. Production immediately restored!',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Production restored via forward commit',
        historyCommits: [
          { hash: 'd9c02b', message: 'Revert "feat: update payment gateway"' },
          { hash: 'c8b91a', message: 'feat: update payment gateway (BROKEN)' },
          { hash: 'b7a80f', message: 'chore: previous stable baseline' },
        ],
        whatChanged: ['Production code reverted safely.', 'Full transparent audit trail preserved.'],
        whatDidNotChange: ['Zero force-pushes; zero teammate disruption.'],
      },
    },

    variations: [
      {
        flag: 'Single Commit',
        title: 'Safely Invert Single Commit',
        syntax: 'git revert <commit-hash>',
        whatItDoes: 'Creates a new commit that applies the exact inverse diff of the target commit, leaving existing history completely untouched.',
        whenToUse: 'Safely undoing a bad commit on a shared or production branch.',
        example: 'git revert a1b2c3d',
        snippet: 'git revert <sha>',
      },
      {
        flag: '-n (no-commit)',
        title: 'Batch Revert Multiple Commits',
        syntax: 'git revert -n <commit-hash>',
        whatItDoes: 'Stages the inverted changes in the index without creating a commit, allowing multiple reverts to be batched into one clean rollback commit.',
        whenToUse: 'Reverting multiple consecutive commits into a single unified rollback commit.',
        example: 'git revert -n HEAD~2..HEAD',
        snippet: 'git revert -n <sha>',
      },
      {
        flag: '-m 1',
        title: 'Reverting a Merge Commit',
        syntax: 'git revert -m 1 <merge-commit-hash>',
        whatItDoes: 'Reverts a merge commit by specifying which parent branch should be treated as the surviving mainline.',
        whenToUse: 'Backing out an entire merged Pull Request on main.',
        example: 'git revert -m 1 9f8e7d6',
        snippet: 'git revert -m 1 <sha>',
      },
    ],

    scenarios: [
      {
        id: 'sc-revert-1',
        title: 'Emergency Rollback on Shared Main Branch',
        context: 'A merged PR just caused payment processing to fail in production. Teammates are actively working on main.',
        question: 'What is the safe and professional way to undo the changes without corrupting teammates\' git trees?',
        options: [
          {
            label: 'Run git revert -m 1 <merge-hash> and push the resulting revert commit to main',
            command: 'git revert -m 1 c8b91a && git push origin main',
            isCorrect: true,
            explanation: 'git revert creates a brand new forward commit that undoes the changes cleanly. Teammates simply git pull without any merge conflicts or broken commit histories.',
          },
          {
            label: 'Run git reset --hard HEAD~1 and git push origin main --force',
            command: 'git reset --hard HEAD~1 && git push origin main --force',
            isCorrect: false,
            explanation: 'Force-pushing a rewritten history onto a shared main branch will break every other developer\'s branch and cause widespread data desynchronization.',
          },
        ],
        whenToUse: 'Production rollbacks on shared branches.',
        commandExample: 'git revert -m 1 <sha> && git push origin main',
        note: 'Leaves a transparent audit trail.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'git revert <sha>',
        commandB: 'git reset <sha>',
        aspect: 'History Direction & Remote Safety',
        descriptionA: 'Moves forward in time by recording a new commit that inverts the patch. 100% safe for shared remote branches.',
        descriptionB: 'Moves backward in time by rewriting the branch pointer. Requires destructive force-push if already pushed.',
        safeForSharedHistory: { a: true, b: false },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Attempting to revert a merge commit without specifying the -m 1 flag',
        whyItHappens: 'Merge commits have multiple parents, so Git does not know which parent line of history to preserve.',
        fix: 'Always pass `-m 1` to specify that the first parent (the branch merged into) is the mainline.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"good code\" > app.js",
          "git add app.js",
          "git commit -m \"feat: good feature\"",
          "echo \"bad code causing crash\" >> app.js",
          "git commit -am \"feat: broken change\""
  ],
      guidedSteps: [
          {
                  "instruction": "Inspect broken commit in history",
                  "command": "git log --oneline -n 2",
                  "hint": "Type git log --oneline -n 2"
          },
          {
                  "instruction": "Revert the broken commit safely via an inverse commit",
                  "command": "git revert HEAD",
                  "hint": "Type git revert HEAD"
          },
          {
                  "instruction": "Verify new revert commit was recorded",
                  "command": "git log --oneline -n 3",
                  "hint": "Type git log --oneline -n 3"
          }
  ],
      initialFiles: [{ name: 'bug.js', content: 'throw new Error("fatal bug");\n' }],
      initialCommits: [
        { hash: '1234567', message: 'feat: stable baseline' },
        { hash: '7654321', message: 'feat: introduce buggy code' },
      ],
      targetTask: 'Check git log --oneline to identify the commit to revert.',
      hints: ['Run `git log --oneline`.'],
      validationRegex: /git log/i,
      solutionCommands: ['git log --oneline'],
    },

    challenge: {
      title: 'Inspect Target for Revert',
      instructions: 'Review commit history to verify SHA before generating inverse commit.',
      startingState: 'Recent bug commit on branch.',
      goalState: 'Commit log displayed via git log.',
      hints: ['Run `git log -2 --oneline`.'],
    },

    reference: {
      officialDocUrl: 'https://git-scm.com/docs/git-revert',
      syntaxCheatSheet: [
        'git revert <sha> : Invert commit and commit result',
        'git revert -n <sha> : Invert commit without committing',
        'git revert -m 1 <sha> : Invert a merge commit preserving parent 1',
        'git revert --continue : Resume after conflict resolution',
        'git revert --abort : Cancel revert operation',
      ],
      commonErrors: [
        { error: 'Commit is a merge but no -m option was given', remedy: 'When reverting a merge commit, you must pass `-m 1` (to keep parent 1 mainline) or `-m 2`.' },
      ],
      mentalModelDiagram: {
        concept: 'Revert Forward Progress',
        explanation: 'Before: C1 -> C2 (bad)\\nAfter:  C1 -> C2 (bad) -> C3 (revert C2, identical code to C1).',
        storageLocation: 'A new normal commit object with a single parent pointer pointing to current HEAD.',
      },
      edgeCases: ['If you revert a branch and later want to re-merge it, Git will think those changes are already in history. You must revert the revert commit first.'],
    },
  },

  // ==========================================================================
  // TOPIC 12: Tagging
  // ==========================================================================
  'c-lightweight-tags': {
    id: 'c-lightweight-tags',
    command: 'git tag v1.0.0',
    title: 'Lightweight Tags',
    topicId: 'topic-12',
    topicNumber: '12',
    topicTitle: 'Tagging',
    subtitle: 'Simple, unannotated pointers directly referencing specific commits in repository history',
    badges: ['Beginner', 'Release', 'Pointers'],
    quote: 'A lightweight tag is like a branch that never moves. It is a permanent bookmark on a specific commit.',
    difficulty: 'Beginner',

    whatIsIt:
      'A lightweight tag is essentially a fixed reference pointing directly to a specific commit. Unlike branches, which advance automatically whenever you commit, a lightweight tag permanently stays on the commit where it was created. It contains no metadata, author, or message—just the commit SHA.',
    inSimpleWords:
      'Writing a permanent sticky note saying "v1.0.0" and slapping it onto a specific commit in your timeline.',
    whyDoYouNeedIt:
      'Branches like `main` keep moving every day. When customers report a bug in "Version 1.0.0", you need an exact, immutable pointer to inspect the exact code state that shipped on release day.',
    realWorldAnalogy:
      'A numbered mile marker on a highway. Mile 100 stays permanently at mile 100; it never moves down the road.',

    syntaxCode: 'git tag <tag-name> [<commit-hash>]',
    syntaxTokens: [
      { token: 'git tag', role: 'Command', explanation: 'Creates or lists tags.' },
      { token: '<tag-name>', role: 'Tag Label', explanation: 'The release or milestone name (e.g., v1.0.0, beta-1).' },
      { token: '[<commit-hash>]', role: 'Target Commit', explanation: 'Optional SHA; defaults to HEAD if omitted.' },
    ],

    actionStage: {
      before: {
        label: 'Commit Ready for Release',
        description: 'Commit `a1b2c3d` has passed all QA checks. Main branch is at this commit.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'HEAD -> main at a1b2c3d',
        historyCommits: [{ hash: 'a1b2c3d', message: 'chore: release candidate build' }],
        whatChanged: ['Code is ready.'],
        whatDidNotChange: ['No permanent tag reference exists.'],
      },
      running: {
        label: 'Creating Lightweight Tag',
        description: 'Running `git tag v1.0.0`. Git creates `.git/refs/tags/v1.0.0` holding SHA `a1b2c3d`.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'git tag v1.0.0',
        historyCommits: [
          { hash: 'a1b2c3d', message: 'chore: release candidate build (HEAD -> main, tag: v1.0.0)' },
        ],
        whatChanged: ['Permanent tag created pointing to a1b2c3d.'],
        whatDidNotChange: ['No new commit or object created.'],
      },
      after: {
        label: 'Branch Advances, Tag Stays',
        description: 'Developers commit new features to main. `main` moves to C2, but `v1.0.0` stays permanently at `a1b2c3d`.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Tag v1.0.0 remains fixed',
        historyCommits: [
          { hash: 'e4f5a6b', message: 'feat: sprint 2 work (HEAD -> main)' },
          { hash: 'a1b2c3d', message: 'chore: release candidate build (tag: v1.0.0)' },
        ],
        whatChanged: ['Main moves forward; tag remains fixed milestone.'],
        whatDidNotChange: ['Tag never moves automatically.'],
      },
    },

    variations: [
      {
        flag: 'Create',
        title: 'Create Lightweight Bookmark',
        syntax: 'git tag <tag-name>',
        whatItDoes: 'Creates a simple lightweight reference bookmark pointing directly to current HEAD with 0 metadata.',
        whenToUse: 'Quick local bookmarks or temporary sprint test marks.',
        example: 'git tag v1.0.0-rc1',
        snippet: 'git tag <name>',
      },
      {
        flag: 'Target Commit',
        title: 'Bookmark Older Commit',
        syntax: 'git tag <tag-name> <commit-hash>',
        whatItDoes: 'Creates a lightweight tag pointing to an older commit in git log history.',
        whenToUse: 'Bookmarking a past commit before starting a debugging investigation.',
        example: 'git tag baseline-test 9f8e7d6',
        snippet: 'git tag <name> <sha>',
      },
      {
        flag: 'Delete',
        title: 'Delete Local Tag',
        syntax: 'git tag -d <tag-name>',
        whatItDoes: 'Deletes the specified tag reference from your local repository.',
        whenToUse: 'Removing experimental or obsolete local tags.',
        example: 'git tag -d test-tag',
        snippet: 'git tag -d <name>',
      },
    ],

    scenarios: [
      {
        id: 'sc-light-tag-1',
        title: 'Marking a Rapid Internal Testing Point',
        context: 'You want to bookmark the exact commit you sent to QA for device testing before starting on the next sprint ticket.',
        question: 'What is the fastest way to save a permanent bookmark on this commit without writing release notes?',
        options: [
          {
            label: 'Create a lightweight tag directly on the current commit',
            command: 'git tag sprint-14-qa',
            isCorrect: true,
            explanation: 'A lightweight tag creates an instant, immutable pointer to the current commit without opening an editor or creating an annotated object.',
          },
          {
            label: 'Create a new branch and leave it untouched forever',
            command: 'git branch sprint-14-qa',
            isCorrect: false,
            explanation: 'While branches point to commits, they are meant for ongoing development and can accidentally be checked out and advanced.',
          },
        ],
        whenToUse: 'Internal development bookmarks.',
        commandExample: 'git tag sprint-14-qa',
        note: 'Fast and lightweight pointer.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'Lightweight Tag (`git tag <name>`)',
        commandB: 'Annotated Tag (`git tag -a <name> -m`)',
        aspect: 'Metadata & Object Storage',
        descriptionA: 'Simple 41-byte pointer file containing only a commit SHA. No author, timestamp, or release message.',
        descriptionB: 'Full cryptographic Git object in the database with tagger name, email, timestamp, message, and optional GPG signature.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Expecting git push to automatically upload lightweight tags to GitHub',
        whyItHappens: 'Standard git push only uploads branch commits and excludes tags by default.',
        fix: 'Explicitly push the tag with `git push origin <tagname>` or `git push --tags`.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"v1.0 release code\" > app.js",
          "git add app.js",
          "git commit -m \"feat: complete v1.0.0 release\""
  ],
      guidedSteps: [
          {
                  "instruction": "Create a lightweight tag pointing to current commit",
                  "command": "git tag v1.0.0",
                  "hint": "Type git tag v1.0.0"
          },
          {
                  "instruction": "List all repository tags",
                  "command": "git tag",
                  "hint": "Type git tag"
          },
          {
                  "instruction": "Inspect commit details for the tag",
                  "command": "git log -n 1 v1.0.0",
                  "hint": "Type git log -n 1 v1.0.0"
          }
  ],
      initialFiles: [{ name: 'version.txt', content: '1.0.0\n' }],
      initialCommits: [{ hash: 'a1b2c3d', message: 'chore: bump version to 1.0.0' }],
      targetTask: 'Check existing tags using git tag.',
      hints: ['Run `git tag`.'],
      validationRegex: /git tag/i,
      solutionCommands: ['git tag'],
    },

    challenge: {
      title: 'List Repository Tags',
      instructions: 'Display all tags in the repository to verify release points.',
      startingState: 'Repository checked out.',
      goalState: 'Tag list displayed in terminal.',
      hints: ['Run `git tag`.'],
    },

    reference: {
      officialDocUrl: 'https://git-scm.com/docs/git-tag#_lightweight_tags',
      syntaxCheatSheet: [
        'git tag <name> : Create lightweight tag on HEAD',
        'git tag <name> <sha> : Tag older commit',
        'git tag : List all tags',
        'git tag -d <name> : Delete local tag',
      ],
      commonErrors: [
        { error: 'Tag did not appear on GitHub after pushing', remedy: '`git push` does NOT push tags by default! You must run `git push origin <tagname>` or `git push --tags`.' },
      ],
      mentalModelDiagram: {
        concept: 'Lightweight Tag Pointer',
        explanation: '.git/refs/tags/v1.0.0 file containing simply "a1b2c3d4e5...". No author, date, or message.',
        storageLocation: 'File inside `.git/refs/tags/<name>`.',
      },
      edgeCases: ['Lightweight tags do not create an object in `.git/objects`; they are strictly reference pointers.'],
    },
  },

  'c-annotated-tags': {
    id: 'c-annotated-tags',
    command: 'git tag -a -m',
    title: 'Annotated Tags',
    topicId: 'topic-12',
    topicNumber: '12',
    topicTitle: 'Tagging',
    subtitle: 'Full first-class Git objects containing tagger name, email, date, release message, and cryptographic signatures',
    badges: ['Intermediate', 'Release Management', 'Best Practice'],
    quote: 'Always use annotated tags for official releases. They store who tagged it, when, and the release notes.',
    difficulty: 'Intermediate',

    whatIsIt:
      'An annotated tag is stored as a full, independent object in the Git object database. It contains its own cryptographic SHA-1/SHA-256 hash, the tagger\'s name and email, the creation date, a custom release message, and optionally a GPG cryptographic signature. It is the industry standard for production releases.',
    inSimpleWords:
      'A notarized birth certificate for your release. It has a legal stamp, date, signature, and official release notes.',
    whyDoYouNeedIt:
      'Lightweight tags don\'t record who made them or why. For official production releases, you need accountability: who authorized the release, on what date, and what changes were included in the changelog.',
    realWorldAnalogy:
      'Signing a deed in front of a public notary. The notary stamps the document with an official embossed seal, date, and identification details.',

    syntaxCode: 'git tag -a <tag-name> -m "<release-notes>"',
    syntaxTokens: [
      { token: 'git tag -a', role: 'Annotated Flag', explanation: 'Instructs Git to create a full annotated tag object.' },
      { token: '<tag-name>', role: 'Version Tag', explanation: 'Standard semantic version (e.g., v2.1.0).' },
      { token: '-m "<msg>"', role: 'Release Message', explanation: 'Summary of features and fixes included in this release.' },
    ],

    actionStage: {
      before: {
        label: 'Production Build Verified',
        description: 'Release candidate passes all CI tests. Team lead prepares official public release.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Ready for official v2.0.0 tag',
        historyCommits: [{ hash: 'R20', message: 'release: finalize v2.0.0 artifacts' }],
        whatChanged: ['Final commit ready.'],
        whatDidNotChange: ['No signed or annotated tag created.'],
      },
      running: {
        label: 'Creating Tag Object',
        description: 'Git creates new object in `.git/objects` storing tagger, timestamp, and release message.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'git tag -a v2.0.0 -m "Release v2.0.0: new UI and OAuth"',
        historyCommits: [
          { hash: 'R20', message: 'release: finalize v2.0.0 artifacts (tag: v2.0.0)' },
        ],
        whatChanged: ['Tag object created and reference saved in `.git/refs/tags/v2.0.0`.'],
        whatDidNotChange: ['Commit tree remains untouched.'],
      },
      after: {
        label: 'Inspectable Release Metadata',
        description: 'Running `git show v2.0.0` displays tagger identity, date, full release notes, and commit details.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'git show v2.0.0: Fully Documented',
        historyCommits: [
          { hash: 'R20', message: 'release: finalize v2.0.0 artifacts (tag: v2.0.0)' },
        ],
        whatChanged: ['Audit trail complete and ready for GitHub Releases.'],
        whatDidNotChange: ['Immutable release point established.'],
      },
    },

    variations: [
      {
        flag: '-a -m',
        title: 'Annotated Tag with Release Message',
        syntax: 'git tag -a <tag-name> -m "<release-notes>"',
        whatItDoes: 'Creates a complete tag object containing tagger identity, timestamp, and release changelog notes in the Git object database.',
        whenToUse: 'All production releases, npm/PyPI library versions, and semantic version milestones.',
        example: 'git tag -a v2.0.0 -m "Release v2.0.0: new API and OAuth"',
        snippet: 'git tag -a <name> -m "<msg>"',
      },
      {
        flag: '-s',
        title: 'Cryptographically GPG-Signed Tag',
        syntax: 'git tag -s <tag-name> -m "<release-notes>"',
        whatItDoes: 'Signs the tag object using your private GPG/PGP key for tamper-proof authenticity verification.',
        whenToUse: 'Security-critical open source projects and enterprise compliance pipelines.',
        example: 'git tag -s v2.0.0 -m "Verified release by Security Lead"',
        snippet: 'git tag -s <name> -m "<msg>"',
      },
      {
        flag: 'git show',
        title: 'Inspect Complete Tag Object',
        syntax: 'git show <tag-name>',
        whatItDoes: 'Displays tagger name, date, tag message, cryptographic signature status, and the commit object it points to.',
        whenToUse: 'Auditing who created an official release and reading the release changelog.',
        example: 'git show v2.0.0',
        snippet: 'git show <tag>',
      },
    ],

    scenarios: [
      {
        id: 'sc-ann-tag-1',
        title: 'Cutting an Official Semantic Production Release',
        context: 'Your software has passed security audits and is being published to npm as v2.0.0. The team requires an audit trail of who authorized the release.',
        question: 'How do you create the release tag according to Git best practices?',
        options: [
          {
            label: 'Create an annotated tag with the author, timestamp, and release notes',
            command: 'git tag -a v2.0.0 -m "Release v2.0.0: Stripe integration and UI refresh"',
            isCorrect: true,
            explanation: 'Annotated tags store full metadata in Git\'s object database, providing accountability and powering automated release notes on GitHub.',
          },
          {
            label: 'Create a lightweight tag with git tag v2.0.0',
            command: 'git tag v2.0.0',
            isCorrect: false,
            explanation: 'Lightweight tags do not store tagger name, date, or release notes, making them unsuitable for production compliance.',
          },
        ],
        whenToUse: 'Publishing packages and public releases.',
        commandExample: 'git tag -a v2.0.0 -m "Release notes"',
        note: 'Generates GitHub release entries automatically.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'Annotated Tag (`git tag -a`)',
        commandB: 'Git Release Branch (`release/2.0`)',
        aspect: 'Immutability & Release Scope',
        descriptionA: 'An immutable static snapshot representing a finished release version that never changes.',
        descriptionB: 'A mutable branch used to stabilize code, cherry-pick hotfixes, and prepare builds prior to tagging.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Using lightweight tags instead of annotated tags for semantic version releases',
        whyItHappens: 'Lightweight tags are simpler to type (`git tag v1.0.0`), but lack author attribution and release changelog.',
        fix: 'Always use `-a` with a message for public releases: `git tag -a v1.0.0 -m "Initial release"`.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"v2.0 production\" > app.js",
          "git add app.js",
          "git commit -m \"feat: release candidate 2.0\""
  ],
      guidedSteps: [
          {
                  "instruction": "Create an annotated tag with full metadata",
                  "command": "git tag -a v2.0.0 -m \"Production release v2.0.0\"",
                  "hint": "Type git tag -a v2.0.0 -m <message>"
          },
          {
                  "instruction": "List all tags",
                  "command": "git tag",
                  "hint": "Type git tag"
          },
          {
                  "instruction": "Inspect the tag object and author metadata",
                  "command": "git log -n 1 v2.0.0",
                  "hint": "Type git log -n 1 v2.0.0"
          }
  ],
      initialFiles: [{ name: 'CHANGELOG.md', content: '## [1.0.0] - 2026-09-18\n- Initial release\n' }],
      initialCommits: [{ hash: '9988776', message: 'docs: update changelog for v1.0.0' }],
      targetTask: 'Check git tag list or inspect tag with git show.',
      hints: ['Run `git tag`.'],
      validationRegex: /git tag/i,
      solutionCommands: ['git tag'],
    },

    challenge: {
      title: 'Inspect Tag Metadata',
      instructions: 'Use git tag or git show to examine tag details.',
      startingState: 'Repository checked out.',
      goalState: 'Tag details displayed.',
      hints: ['Run `git tag -l`.'],
    },

    reference: {
      officialDocUrl: 'https://git-scm.com/docs/git-tag#_annotated_tags',
      syntaxCheatSheet: [
        'git tag -a <name> -m "<msg>" : Create annotated tag',
        'git tag -s <name> -m "<msg>" : Create GPG-signed tag',
        'git show <name> : Inspect tagger and release message',
        'git tag -v <name> : Verify cryptographic signature',
      ],
      commonErrors: [
        { error: 'error: gpg failed to sign the data', remedy: 'Ensure your GPG key is loaded and `user.signingkey` is configured in `git config`.' },
      ],
      mentalModelDiagram: {
        concept: 'Tag Object Hierarchy',
        explanation: 'Tag Reference (.git/refs/tags/v1.0.0) -> Tag Object (Tagger, Date, Message, GPG) -> Commit Object -> Tree -> Blobs.',
        storageLocation: 'Standalone object in `.git/objects/` with type `tag`.',
      },
      edgeCases: ['GitHub Releases automatically creates an annotated tag if you draft a new release from the GitHub web UI.'],
    },
  },

  'c-pushing-tags': {
    id: 'c-pushing-tags',
    command: 'git push --tags',
    title: 'Pushing & Managing Tags',
    topicId: 'topic-12',
    topicNumber: '12',
    topicTitle: 'Tagging',
    subtitle: 'Sharing release tags to remote servers, triggering CI releases, and remote tag deletion',
    badges: ['Beginner', 'Release', 'Remote Git'],
    quote: 'Git push does not transfer tags by default. You must explicitly push tags to trigger cloud releases.',
    difficulty: 'Beginner',

    whatIsIt:
      'By default, running `git push` only transfers branch commits to the remote repository; it does NOT transfer local tags. To share tags with teammates and trigger automated GitHub Actions release workflows, you must explicitly push individual tags (`git push origin v1.0.0`) or all tags (`git push origin --tags`).',
    inSimpleWords:
      'Making a bookmark on your laptop is private. You have to explicitly send the bookmark to GitHub so the whole world can see your new version.',
    whyDoYouNeedIt:
      'Modern CI/CD pipelines (like GitHub Actions) are configured to trigger build, packaging, and deployment whenever a tag matching `v*` is pushed. If you don\'t push the tag, your automated release will never deploy.',
    realWorldAnalogy:
      'Launching a rocket. The countdown and checklist happen in the local bunker. Pushing the tag is pressing the red button that ignites the rocket and broadcasts the launch to the world.',

    syntaxCode: 'git push origin <tag-name>  # or git push origin --tags',
    syntaxTokens: [
      { token: 'git push origin', role: 'Remote Destination', explanation: 'Uploads to default remote server.' },
      { token: '<tag-name>', role: 'Specific Tag', explanation: 'Pushes single tag (e.g., v1.2.0).' },
      { token: '--tags', role: 'Bulk Flag', explanation: 'Pushes all local tags that are not yet on the remote.' },
    ],

    actionStage: {
      before: {
        label: 'Tag Local Only',
        description: 'You ran `git tag -a v1.0.0 -m "release"`. Tag exists on your laptop, but GitHub shows 0 releases.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Tag local only',
        historyCommits: [{ hash: 'C10', message: 'chore: release candidate (tag: v1.0.0)' }],
        whatChanged: ['Tag created in local `.git/refs/tags`.'],
        whatDidNotChange: ['Remote repository has no record of v1.0.0.'],
      },
      running: {
        label: 'Pushing Tag to GitHub',
        description: 'Running `git push origin v1.0.0`. Remote creates tag ref and fires `on: push: tags: [\'v*\']` workflow.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'git push origin v1.0.0',
        historyCommits: [
          { hash: 'C10', message: 'chore: release candidate (tag: v1.0.0, origin/main)' },
        ],
        whatChanged: ['Tag uploaded to remote server.'],
        whatDidNotChange: ['Branch commit pointers remain unchanged.'],
      },
      after: {
        label: 'GitHub Release Triggered',
        description: 'GitHub displays release v1.0.0. CI/CD pipeline packages binaries and deploys to production.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'v1.0.0 Live on GitHub',
        historyCommits: [
          { hash: 'C10', message: 'chore: release candidate (tag: v1.0.0)' },
        ],
        whatChanged: ['Release live globally.'],
        whatDidNotChange: ['Users can download source zip or binaries.'],
      },
    },

    variations: [
      {
        flag: 'Single Tag',
        title: 'Push Specific Tag (Recommended)',
        syntax: 'git push origin <tag-name>',
        whatItDoes: 'Pushes only the specified tag to the remote repository, preventing accidental publishing of local draft tags.',
        whenToUse: 'Standard production deployments and publishing specific semantic versions.',
        example: 'git push origin v1.0.0',
        snippet: 'git push origin <tag>',
      },
      {
        flag: '--follow-tags',
        title: 'Push Commits & Reachable Annotated Tags',
        syntax: 'git push --follow-tags',
        whatItDoes: 'Pushes your branch commits PLUS any annotated tags that point to those commits, leaving draft/unrelated tags local.',
        whenToUse: 'Daily developer workflow when you commit and tag a release simultaneously.',
        example: 'git push origin main --follow-tags',
        snippet: 'git push --follow-tags',
      },
      {
        flag: '--tags',
        title: 'Push All Local Tags Indiscriminately',
        syntax: 'git push origin --tags',
        whatItDoes: 'Uploads every single tag in `.git/refs/tags/` to the remote server at once.',
        whenToUse: 'Initial repository migration or synchronizing dozens of historical release tags.',
        example: 'git push origin --tags',
        snippet: 'git push origin --tags',
        warning: 'Pushes all local test and experimental tags to GitHub where CI might trigger unwanted builds.',
      },
      {
        flag: 'Delete Remote',
        title: 'Delete Remote Tag from GitHub',
        syntax: 'git push origin --delete <tag-name>',
        whatItDoes: 'Removes the tag reference from the remote server, un-publishing the release milestone.',
        whenToUse: 'Retracting an erroneous or premature release tag.',
        example: 'git push origin --delete v1.0.0-rc1',
        snippet: 'git push origin --delete <tag>',
      },
    ],

    scenarios: [
      {
        id: 'sc-push-tags-1',
        title: 'Triggering GitHub Actions Release Pipeline',
        context: 'Your repository has a GitHub Actions workflow configured with `on: push: tags: [\'v*\']`. You created tag `v1.2.0` locally.',
        question: 'What command properly triggers the remote build and publishing pipeline?',
        options: [
          {
            label: 'Push the specific release tag to the origin remote',
            command: 'git push origin v1.2.0',
            isCorrect: true,
            explanation: 'Explicitly pushing the tag ref triggers the tag-based workflow on GitHub and deploys the release artifacts.',
          },
          {
            label: 'Run git push origin main and expect tags to accompany commits',
            command: 'git push origin main',
            isCorrect: false,
            explanation: 'Standard git push does not transfer tags to the remote repository.',
          },
        ],
        whenToUse: 'Deploying versioned releases.',
        commandExample: 'git push origin v1.2.0',
        note: 'Fires webhook and automated build actions.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'git push origin <tag>',
        commandB: 'git push origin --tags',
        aspect: 'Push Specificity & Safety',
        descriptionA: 'Pushes only the single intended tag. Safe against accidentally uploading local draft or experimental tags.',
        descriptionB: 'Pushes EVERY local tag on your machine to the remote server indiscriminately.',
        safeForSharedHistory: { a: true, b: false },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Running git push and assuming your newly created tag is live on GitHub',
        whyItHappens: 'Git deliberately isolates branch pushing from tag pushing to prevent unintentional releases.',
        fix: 'Always push tags explicitly using `git push origin <tagname>` or `git push --follow-tags`.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"v1.5 code\" > app.js",
          "git add app.js",
          "git commit -m \"feat: milestone 1.5\"",
          "git tag v1.5.0",
          "git remote add origin https://github.com/org/repo.git"
  ],
      guidedSteps: [
          {
                  "instruction": "List local tags ready to publish",
                  "command": "git tag",
                  "hint": "Type git tag"
          },
          {
                  "instruction": "Push tags to remote origin",
                  "command": "git push --tags",
                  "hint": "Type git push --tags"
          },
          {
                  "instruction": "Verify remote status",
                  "command": "git status",
                  "hint": "Type git status"
          }
  ],
      initialFiles: [{ name: 'release.json', content: '{\n  "version": "1.0.0"\n}\n' }],
      initialCommits: [{ hash: 'e1e1e1e', message: 'chore: release 1.0.0' }],
      targetTask: 'Check remote configuration before pushing tags.',
      hints: ['Run `git remote -v`.'],
      validationRegex: /git remote/i,
      solutionCommands: ['git remote -v'],
    },

    challenge: {
      title: 'Inspect Remote Push Targets',
      instructions: 'Verify configured remote destination where tags will be pushed.',
      startingState: 'Remote configured.',
      goalState: 'Remote URL displayed.',
      hints: ['Run `git remote -v`.'],
    },

    reference: {
      officialDocUrl: 'https://git-scm.com/docs/git-push#Documentation/git-push.txt---tags',
      syntaxCheatSheet: [
        'git push origin <tag> : Push single tag to remote',
        'git push origin --tags : Push all local tags to remote',
        'git push --follow-tags : Push branch and annotated tags together',
        'git push origin --delete <tag> : Delete remote tag',
      ],
      commonErrors: [
        { error: 'I ran git push but my release tag didn\'t show up on GitHub', remedy: '`git push` does not push tags. Run `git push origin <tag-name>`.' },
      ],
      mentalModelDiagram: {
        concept: 'Remote Tag Synchronization',
        explanation: 'Local Tag (.git/refs/tags/v1.0.0) -> git push origin v1.0.0 -> Remote (.git/refs/tags/v1.0.0) -> GitHub Release webhook.',
        storageLocation: 'Remote tracking references under `refs/tags/`.',
      },
      edgeCases: ['Deleting a remote tag does not delete it from teammates\' local machines if they already fetched it. They must delete their local copy manually.'],
    },
  },
};
