import { UniversalConcept } from '../unifiedAcademyData';

export const TOPIC_07_08_CONCEPTS: Record<string, UniversalConcept> = {
  // ==========================================================================
  // TOPIC 07: Merge Strategies
  // ==========================================================================
  'c-fast-forward': {
    id: 'c-fast-forward',
    command: 'git merge --ff-only',
    title: 'Fast-Forward Merges',
    topicId: 'topic-07',
    topicNumber: '07',
    topicTitle: 'Merge Strategies',
    subtitle: 'Advancing the target branch pointer directly to the tip of the incoming branch',
    badges: ['Beginner', 'Merging', 'Linear History'],
    quote: 'If your target branch has not moved since you branched off, Git doesn\'t need a merge commit—it simply moves the pointer forward.',
    difficulty: 'Beginner',

    whatIsIt:
      'A fast-forward merge occurs when the target branch has no new commits since the feature branch was created. In this case, Git does not need to reconcile diverging histories or create a new merge commit; it simply advances the target branch pointer to point to the latest commit on the incoming branch.',
    inSimpleWords:
      'Like moving your bookmark from page 20 to page 45 because nobody else wrote any new pages in between.',
    whyDoYouNeedIt:
      'Fast-forward merges keep your git log completely linear and free from redundant merge commits ("Merge branch \'main\' into..."). Using `--ff-only` ensures you never accidentally create an unexpected merge commit if histories have diverged.',
    realWorldAnalogy:
      'You step out of a single-file line to grab a coffee. While you were gone, no one else joined the line. When you return, the queue master simply points you to the front of the line.',

    syntaxCode: 'git merge --ff-only <branch-name>',
    syntaxTokens: [
      { token: 'git merge', role: 'Command', explanation: 'Combines branches together.' },
      { token: '--ff-only', role: 'Flag', explanation: 'Refuses to merge unless a pure fast-forward pointer move is possible.' },
      { token: '<branch-name>', role: 'Source Branch', explanation: 'The incoming branch whose tip will become the new head.' },
    ],

    actionStage: {
      before: {
        label: 'Direct Linear Ancestry',
        description: 'Main is at C2. Feature branch has commits C3 and C4 based on C2. Main has 0 new commits.',
        workingDirectory: [{ name: 'feature.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'main at C2, feature at C4',
        historyCommits: [
          { hash: 'C4', message: 'feat: add feature step 2 (feature)' },
          { hash: 'C3', message: 'feat: add feature step 1' },
          { hash: 'C2', message: 'chore: setup project (HEAD -> main)' },
        ],
        whatChanged: ['Main is a direct ancestor of feature.'],
        whatDidNotChange: ['Main has not moved.'],
      },
      running: {
        label: 'Moving Branch Pointer',
        description: 'Git verifies ancestry and slides the `main` pointer from C2 to C4 without creating a new commit.',
        workingDirectory: [{ name: 'feature.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'git merge --ff-only feature',
        historyCommits: [
          { hash: 'C4', message: 'feat: add feature step 2 (HEAD -> main, feature)' },
          { hash: 'C3', message: 'feat: add feature step 1' },
          { hash: 'C2', message: 'chore: setup project' },
        ],
        whatChanged: ['main pointer moved to C4.', 'Working directory updated to match C4.'],
        whatDidNotChange: ['No merge commit was generated.'],
      },
      after: {
        label: 'Seamless Linear History',
        description: 'Main now includes C3 and C4 in a single straight line.',
        workingDirectory: [{ name: 'feature.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'Fast-forward complete',
        historyCommits: [
          { hash: 'C4', message: 'feat: add feature step 2 (HEAD -> main, feature)' },
          { hash: 'C3', message: 'feat: add feature step 1' },
          { hash: 'C2', message: 'chore: setup project' },
        ],
        whatChanged: ['Main is at the latest state.'],
        whatDidNotChange: ['Zero graph branching bubbles.'],
      },
    },

    variations: [
      {
        flag: '--ff-only',
        title: 'Fast-Forward Only (Safe)',
        syntax: 'git merge --ff-only <branch>',
        whatItDoes: 'Advances branch pointer if possible; fails immediately with an error if branches have diverged instead of creating an unexpected merge commit.',
        whenToUse: 'Automated scripts and disciplined trunk-based teams.',
        example: 'git merge --ff-only feature/login',
        snippet: 'git merge --ff-only <branch>',
      },
      {
        flag: '--no-ff',
        title: 'Force Merge Commit',
        syntax: 'git merge --no-ff <branch>',
        whatItDoes: 'Forces Git to create an explicit 2-parent merge commit even if a pure fast-forward pointer move was possible.',
        whenToUse: 'Preserving the historical existence and boundary of a feature branch in GitFlow.',
        example: 'git merge --no-ff feature/payments',
        snippet: 'git merge --no-ff <branch>',
      },
      {
        flag: 'pull.ff only',
        title: 'Enforce Fast-Forward Pulls Globally',
        syntax: 'git config --global pull.ff only',
        whatItDoes: 'Prevents git pull from ever generating accidental local merge commits when origin has moved ahead.',
        whenToUse: 'Recommended global configuration for all Git developers.',
        example: 'git config --global pull.ff only',
        snippet: 'git config --global pull.ff only',
      },
    ],

    scenarios: [
      {
        id: 'sc-ff-1',
        title: 'Pulling Updates Without Accidental Merge Commits',
        context: 'You run git pull on main. While you were coding locally, teammates pushed 3 new commits to origin/main.',
        question: 'How do you ensure pulling doesn\'t create an ugly "Merge branch \'main\' of github.com" commit?',
        options: [
          {
            label: 'Use git pull --ff-only (or git pull --rebase) to cleanly update your branch without merge bubbles',
            command: 'git pull --ff-only',
            isCorrect: true,
            explanation: 'Fast-forward or rebase pulling avoids polluting your repository history with redundant merge commits.',
          },
          {
            label: 'Run git push --force origin main to overwrite teammates\' work',
            command: 'git push --force origin main',
            isCorrect: false,
            explanation: 'Never force push over teammates\' work; it destroys their pushed commits.',
          },
        ],
        whenToUse: 'When pulling latest main before starting new work.',
        commandExample: 'git switch main && git pull --ff-only',
        note: 'If local main had unpushed commits, it will safely warn you rather than creating an ugly merge commit.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'git merge --ff-only <branch>',
        commandB: 'git merge --no-ff <branch>',
        aspect: 'Commit Graph Creation',
        descriptionA: 'Simply slides the branch pointer forward to the tip of incoming commits; zero new commit objects created.',
        descriptionB: 'Always creates an explicit 2-parent merge commit node, permanently recording the branch boundary.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Running `git merge --ff-only` and panicking when Git reports "fatal: Not possible to fast-forward, aborting"',
        whyItHappens: 'Both main and the feature branch have new commits since the fork point (diverged history).',
        fix: 'Rebase your feature branch onto main first (`git rebase main`), then fast-forward merge.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"console.log(\\\"App ready\\\");\" > app.js",
          "git add app.js",
          "git commit -m \"feat: initial baseline\"",
          "git switch -c feature/speed",
          "echo \"// fast code\" >> app.js",
          "git commit -am \"feat: speed up execution\"",
          "git switch main"
  ],
      guidedSteps: [
          {
                  "instruction": "Inspect the commit graph before merging",
                  "command": "git log --oneline",
                  "hint": "Type git log --oneline"
          },
          {
                  "instruction": "Execute a fast-forward only merge",
                  "command": "git merge --ff-only feature/speed",
                  "hint": "Type git merge --ff-only feature/speed"
          },
          {
                  "instruction": "Verify the linear commit history",
                  "command": "git log --oneline",
                  "hint": "Type git log --oneline"
          }
  ],
      initialFiles: [{ name: 'app.js', content: 'console.log("App ready");\n' }],
      initialCommits: [
        { hash: 'c1c1c1c', message: 'Initial baseline' },
        { hash: 'c2c2c2c', message: 'feat: add core logic' },
      ],
      targetTask: 'Check git log to inspect the linear commit sequence.',
      hints: ['Run `git log --graph --oneline`.'],
      validationRegex: /git log/i,
      solutionCommands: ['git log --oneline'],
    },

    challenge: {
      title: 'Inspect Branch Linearity',
      instructions: 'Examine git log with graph markers to confirm whether history is strictly linear.',
      startingState: 'Two sequential commits on main.',
      goalState: 'Commit graph displayed showing linear relationship.',
      hints: ['Run `git log --graph --oneline`.'],
    },

    reference: {
      officialDocUrl: 'https://git-scm.com/docs/git-merge#Documentation/git-merge.txt---ff-only',
      syntaxCheatSheet: [
        'git merge --ff-only <branch> : Fast-forward merge or fail',
        'git merge --no-ff <branch> : Always create merge commit',
        'git config --global pull.ff only : Set global default for safe pulls',
      ],
      commonErrors: [
        { error: 'fatal: Not possible to fast-forward, aborting.', remedy: 'The target branch has diverged with new commits. Either rebase your feature branch or use standard merge.' },
      ],
      mentalModelDiagram: {
        concept: 'Pointer Advancement',
        explanation: 'Before: main -> C2, feature -> C4. After ff: main -> C4, feature -> C4. No new node created.',
        storageLocation: '.git/refs/heads/main simply gets updated with the 40-character SHA of C4.',
      },
      edgeCases: ['If someone pushed commits to origin/main while you were working, your local main will no longer be fast-forwardable until fetched and rebased.'],
    },
  },

  'c-three-way-merge': {
    id: 'c-three-way-merge',
    command: 'git merge --no-ff',
    title: '3-Way Merge Commits',
    topicId: 'topic-07',
    topicNumber: '07',
    topicTitle: 'Merge Strategies',
    subtitle: 'Reconciling diverged branches using common ancestor analysis to create a 2-parent merge commit',
    badges: ['Intermediate', 'Merging', 'History Preservation'],
    quote: 'When two developers branch off and build independently, Git finds their common ancestor and computes a 3-way reconciliation.',
    difficulty: 'Intermediate',

    whatIsIt:
      'A 3-way merge is Git\'s mechanism for combining two branches that have diverged (both branches have commits that the other does not have). Git looks at three points in time: (1) the common ancestor commit (the merge base), (2) the tip of the current branch, and (3) the tip of the incoming branch, synthesizing them into a new commit with two parents.',
    inSimpleWords:
      'Two people take a copy of the same document, go into separate rooms, and make changes to different pages. Git compares both versions against the original document to merge all new edits together into one final file.',
    whyDoYouNeedIt:
      'In team environments, multiple branches move simultaneously. A 3-way merge allows parallel feature work to be combined without erasing the historical record of when and where the branch lived.',
    realWorldAnalogy:
      'Two tributaries of a river flowing separately around an island, then rejoining downstream into a single wider river.',

    syntaxCode: 'git merge --no-ff -m "<merge-message>" <branch-name>',
    syntaxTokens: [
      { token: 'git merge', role: 'Command', explanation: 'Merges incoming branch into current HEAD.' },
      { token: '--no-ff', role: 'Preservation Flag', explanation: 'Forces the creation of a 2-parent merge commit even if fast-forward were possible.' },
      { token: '-m "<msg>"', role: 'Message Flag', explanation: 'Custom message for the new merge commit.' },
    ],

    actionStage: {
      before: {
        label: 'Diverged Branches',
        description: 'Both branches branched off C1. Main has commit M1; feature has commit F1. Neither is a direct ancestor of the other.',
        workingDirectory: [{ name: 'main.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'Diverged at C1',
        historyCommits: [
          { hash: 'M1', message: 'feat: update payment (HEAD -> main)' },
          { hash: 'F1', message: 'feat: update user profile (feature)' },
          { hash: 'C1', message: 'Initial baseline (common ancestor)' },
        ],
        whatChanged: ['Both branches progressed independently.'],
        whatDidNotChange: ['No shared state between M1 and F1.'],
      },
      running: {
        label: 'Computing 3-Way Diff',
        description: 'Git analyzes diff(C1, M1) and diff(C1, F1). Since edits are in different files, Git automatically merges them.',
        workingDirectory: [
          { name: 'main.js', status: 'committed' },
          { name: 'profile.js', status: 'staged' },
        ],
        stagingArea: [{ name: 'profile.js', status: 'staged' }],
        commandPill: 'git merge feature',
        historyCommits: [
          { hash: 'M1', message: 'feat: update payment' },
          { hash: 'F1', message: 'feat: update user profile' },
        ],
        whatChanged: ['All non-conflicting changes staged automatically.'],
        whatDidNotChange: ['Merge commit not yet finalized until written.'],
      },
      after: {
        label: 'Merge Commit Created',
        description: 'New commit C_MERGE created with two parent hashes: M1 and F1.',
        workingDirectory: [
          { name: 'main.js', status: 'committed' },
          { name: 'profile.js', status: 'committed' },
        ],
        stagingArea: [],
        commandPill: 'Merge commit C_MERGE created',
        historyCommits: [
          { hash: 'M2', message: 'Merge branch \'feature\' into main (HEAD -> main)' },
          { hash: 'M1', message: 'feat: update payment' },
          { hash: 'F1', message: 'feat: update user profile' },
        ],
        whatChanged: ['HEAD -> main points to new merge commit M2 with parents [M1, F1].'],
        whatDidNotChange: ['Original commits M1 and F1 remain unchanged in history.'],
      },
    },

    variations: [
      {
        flag: '3-Way Merge',
        title: 'Standard 3-Way Merge',
        syntax: 'git merge <branch>',
        whatItDoes: 'Finds the best common ancestor of both branches, compares changes from both sides, and generates a merge commit.',
        whenToUse: 'Integrating diverged branches in GitFlow or release management.',
        example: 'git merge feature/search',
        snippet: 'git merge <branch>',
      },
      {
        flag: '--no-ff',
        title: 'Always Create Merge Commit (--no-ff)',
        syntax: 'git merge --no-ff <branch>',
        whatItDoes: 'Forces creation of an explicit 2-parent merge commit to preserve the visual boundary of the feature.',
        whenToUse: 'Standard in GitFlow when merging sprint releases into main or develop.',
        example: 'git merge --no-ff feature/auth',
        snippet: 'git merge --no-ff <branch>',
      },
      {
        flag: '--abort',
        title: 'Abort In-Progress Merge',
        syntax: 'git merge --abort',
        whatItDoes: 'Rolls back the merge attempt and restores working directory and index to the pre-merge state.',
        whenToUse: 'When merge conflicts are too tangled or unexpected and you want to start over.',
        example: 'git merge --abort',
        snippet: 'git merge --abort',
      },
    ],

    scenarios: [
      {
        id: 'sc-3way-1',
        title: 'Resolving Diverged Changes in Two Different Files',
        context: 'While you were developing a profile feature, a teammate merged payment changes. Both branches diverged from commit C1.',
        question: 'What happens when you run git merge feature on main if no files overlap?',
        options: [
          {
            label: 'Git automatically performs a 3-way merge without conflict and creates a 2-parent merge commit',
            command: 'git merge feature',
            isCorrect: true,
            explanation: 'Because edits were in different files, Git automatically reconciles them using the common ancestor and creates the merge commit.',
          },
          {
            label: 'Git stops and forces you to re-type every file from scratch',
            command: 'No command',
            isCorrect: false,
            explanation: 'Git only halts for manual resolution when the EXACT same lines in the same file were modified differently.',
          },
        ],
        whenToUse: 'When merging a finished feature branch into `develop` or `release` into `main`.',
        commandExample: 'git switch main && git merge --no-ff release/v1.2.0',
        note: 'Preserves the historical boundary of the release group.',
      },
    ],

    commandComparisons: [
      {
        commandA: '3-Way Merge (git merge)',
        commandB: 'Rebase (git rebase)',
        aspect: 'History Structure',
        descriptionA: 'Preserves the exact chronology and creates a 2-parent merge node; non-destructive to commit SHAs.',
        descriptionB: 'Rewrites commit SHAs to replay them linearly on top of the target base branch; cleaner history but rewrites commits.',
        safeForSharedHistory: { a: true, b: false },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Committing conflict markers (`<<<<<<< HEAD`) directly into the repository',
        whyItHappens: 'Running `git commit -a` without inspecting conflicted files.',
        fix: 'Search for `<<<<<<<` across your project with grep before committing, or use a diff tool to verify all markers are cleared.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"server config v1\" > config.json",
          "git add config.json",
          "git commit -m \"chore: base config\"",
          "git switch -c feature/database",
          "echo \"db_host: localhost\" >> config.json",
          "git commit -am \"feat: add db host\"",
          "git switch main",
          "echo \"cache: redis\" >> config.json",
          "git commit -am \"feat: add redis cache\""
  ],
      guidedSteps: [
          {
                  "instruction": "Check commit differences on main",
                  "command": "git log --oneline -n 2",
                  "hint": "Type git log --oneline -n 2"
          },
          {
                  "instruction": "Merge feature/database creating an explicit merge commit",
                  "command": "git merge --no-ff feature/database",
                  "hint": "Type git merge --no-ff feature/database"
          },
          {
                  "instruction": "Inspect the 2-parent merge graph",
                  "command": "git log --graph --oneline -n 3",
                  "hint": "Type git log --graph --oneline -n 3"
          }
  ],
      initialFiles: [
        { name: 'server.js', content: 'const port = 8080;\n' },
        { name: 'client.js', content: 'const host = "localhost";\n' },
      ],
      initialCommits: [
        { hash: 'c1a2b3c', message: 'chore: initial system baseline' },
        { hash: 'd4e5f6a', message: 'feat: add server configuration' },
      ],
      targetTask: 'Check git log to observe the commit structure.',
      hints: ['Run `git log --graph --oneline`.'],
      validationRegex: /git log/i,
      solutionCommands: ['git log --graph --oneline'],
    },

    challenge: {
      title: 'Verify Merge Base',
      instructions: 'Find the common ancestor commit hash between two branches using git merge-base.',
      startingState: 'Repository with multiple commits.',
      goalState: 'Common ancestor commit SHA displayed.',
      hints: ['Run `git merge-base HEAD HEAD~1`.'],
    },

    reference: {
      officialDocUrl: 'https://git-scm.com/docs/git-merge#_true_merge',
      syntaxCheatSheet: [
        'git merge <branch> : Perform standard 3-way merge',
        'git merge --no-ff <branch> : Force merge commit',
        'git merge --abort : Cancel merge during conflict',
        'git merge-base <b1> <b2> : Print common ancestor SHA',
      ],
      commonErrors: [
        { error: 'Automatic merge failed; fix conflicts and then commit the result', remedy: 'Open the flagged files, edit conflict markers, run `git add <file>`, and complete with `git commit`.' },
      ],
      mentalModelDiagram: {
        concept: '3-Way Merge Commit DAG',
        explanation: '      o---o (feature)\\n     /     \\\\n-o---o-------o (main with 2 parents: main_prev, feat_tip)',
        storageLocation: 'A commit object with two `parent` headers in its metadata.',
      },
      edgeCases: ['Reverting a merge commit with `git revert -m 1 <commit-hash>` requires choosing the parent number to revert against.'],
    },
  },

  'c-git-rebase': {
    id: 'c-git-rebase',
    command: 'git rebase',
    title: 'git rebase',
    topicId: 'topic-07',
    topicNumber: '07',
    topicTitle: 'Merge Strategies',
    subtitle: 'Replaying a series of commits onto a new base commit for perfectly linear project history',
    badges: ['Intermediate', 'Rebase', 'Clean History'],
    quote: 'Rebase rewires your branch\'s origin story, making it look as though you started working on top of the newest code today.',
    difficulty: 'Intermediate',

    whatIsIt:
      '`git rebase` reapplies commits from one branch onto the tip of another branch. It takes the commits unique to your branch, saves them as temporary patches, rewinds your branch back to the common ancestor, fast-forwards your branch to the target base, and then replays your patches one by one—generating brand new commit SHAs.',
    inSimpleWords:
      'Unplugging your branch from an older point in time and plugging it directly into the latest commit, making your history completely straight.',
    whyDoYouNeedIt:
      'Without rebase, every time you want to pull new changes from `main` into your feature branch, you create an ugly "Merge main into feature" commit. Rebasing eliminates all merge bubbles, keeping git history linear and easy to inspect with `git bisect`.',
    realWorldAnalogy:
      'You are building a custom room on top of a trailer home. The foundation moves 5 miles down the road. Rebasing is lifting your custom room, driving it down the road, and bolting it onto the new location.',

    syntaxCode: 'git rebase <base-branch>',
    syntaxTokens: [
      { token: 'git rebase', role: 'Command', explanation: 'Replays commits onto new base.' },
      { token: '<base-branch>', role: 'New Foundation', explanation: 'The branch tip to build upon (e.g., main or origin/main).' },
    ],

    actionStage: {
      before: {
        label: 'Branched from Older Base',
        description: 'You branched off main at C1 and made commits F1 and F2. Meanwhile, main moved ahead with M1 and M2.',
        workingDirectory: [{ name: 'feature.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'HEAD -> feature (based on C1)',
        historyCommits: [
          { hash: 'F2', message: 'feat: add UI step 2 (feature)' },
          { hash: 'F1', message: 'feat: add UI step 1' },
          { hash: 'M2', message: 'feat: main database update (main)' },
          { hash: 'M1', message: 'feat: main config update' },
          { hash: 'C1', message: 'Initial baseline' },
        ],
        whatChanged: ['Feature branch is lagging behind M2.'],
        whatDidNotChange: ['F1 and F2 still have C1 as parent.'],
      },
      running: {
        label: 'Replaying Patches atop M2',
        description: 'Git sets HEAD to M2 and applies F1 as F1\', then F2 as F2\' with new commit hashes.',
        workingDirectory: [{ name: 'feature.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'git rebase main',
        historyCommits: [
          { hash: 'F2\'', message: 'feat: add UI step 2 (HEAD -> feature)' },
          { hash: 'F1\'', message: 'feat: add UI step 1' },
          { hash: 'M2', message: 'feat: main database update (main)' },
          { hash: 'M1', message: 'feat: main config update' },
        ],
        whatChanged: ['New commits F1\' and F2\' created with updated parent pointers.'],
        whatDidNotChange: ['Working code result is the same, but history is linear.'],
      },
      after: {
        label: 'Linear and Fast-Forwardable',
        description: 'Feature branch now sits directly on top of M2. When merging into main, a pure fast-forward is possible!',
        workingDirectory: [{ name: 'feature.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'Rebase complete: linear DAG',
        historyCommits: [
          { hash: 'F2\'', message: 'feat: add UI step 2 (HEAD -> feature)' },
          { hash: 'F1\'', message: 'feat: add UI step 1' },
          { hash: 'M2', message: 'feat: main database update (main)' },
        ],
        whatChanged: ['Zero merge commit bubbles; linear audit trail.'],
        whatDidNotChange: ['Old commits F1 and F2 will eventually be pruned by git garbage collection.'],
      },
    },

    variations: [
      {
        flag: 'Standard Rebase',
        title: 'Standard Rebase atop Target Branch',
        syntax: 'git rebase <base-branch>',
        whatItDoes: 'Unwinds your branch commits, fast-forwards your branch to the target base, and replays each commit as a new SHA.',
        whenToUse: 'Keeping personal feature branches up-to-date with main without adding merge bubbles.',
        example: 'git rebase main',
        snippet: 'git rebase <base>',
      },
      {
        flag: '--continue',
        title: 'Resume Rebase after Conflict',
        syntax: 'git rebase --continue',
        whatItDoes: 'Resumes replaying the remaining commit patches after you stage conflict resolutions.',
        whenToUse: 'After resolving a conflicted file and running git add.',
        example: 'git rebase --continue',
        snippet: 'git rebase --continue',
      },
      {
        flag: '--abort',
        title: 'Cancel Rebase Safely',
        syntax: 'git rebase --abort',
        whatItDoes: 'Halts rebase immediately and resets the branch back to its exact state before rebase began.',
        whenToUse: 'When conflicts are unexpected or you realize you rebased onto the wrong branch.',
        example: 'git rebase --abort',
        snippet: 'git rebase --abort',
      },
    ],

    scenarios: [
      {
        id: 'sc-rebase-1',
        title: 'The Golden Rule of Rebasing',
        context: 'You want to clean up commit history on the team\'s shared public main branch where 10 other developers are actively pushing.',
        question: 'Should you run git rebase on a shared public branch?',
        options: [
          {
            label: 'No! Never rebase public, shared branches. Only rebase private personal feature branches.',
            command: 'git rebase (Forbidden on shared branches)',
            isCorrect: true,
            explanation: 'Rebase rewrites commit SHA hashes. If teammates have pulled old commits, rebasing shared branches causes history nightmares and duplicate commits.',
          },
          {
            label: 'Yes, rebasing main keeps everyone\'s laptops perfectly synchronized',
            command: 'git rebase',
            isCorrect: false,
            explanation: 'Rebasing shared branches breaks everyone\'s tracking branches and causes massive confusion.',
          },
        ],
        whenToUse: 'Before submitting a Pull Request to ensure your code works with latest master.',
        commandExample: 'git fetch origin && git rebase origin/main',
        note: 'Eliminates merge conflicts early on your local machine.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'git rebase main',
        commandB: 'git merge main',
        aspect: 'Commit Graph & Revertability',
        descriptionA: 'Creates a perfectly straight, linear git log. Each commit has a brand new SHA hash. Does not create a merge commit.',
        descriptionB: 'Preserves original commit hashes and timestamps; creates a merge commit showing exactly when branches merged.',
        safeForSharedHistory: { a: false, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Running `git push --force` after rebasing a shared branch used by teammates',
        whyItHappens: 'Git rejects regular push after rebase because hashes changed, so the developer uses force push.',
        fix: 'Only rebase personal feature branches. When pushing rebased feature branches, use `git push --force-with-lease` for safety.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"v1\" > app.txt",
          "git add app.txt",
          "git commit -m \"feat: initial release\"",
          "git switch -c feature/payment",
          "echo \"payment module\" > pay.txt",
          "git add pay.txt",
          "git commit -m \"feat: add pay module\"",
          "git switch main",
          "echo \"security patch\" > patch.txt",
          "git add patch.txt",
          "git commit -m \"fix: security patch\"",
          "git switch feature/payment"
  ],
      guidedSteps: [
          {
                  "instruction": "Inspect divergent commit logs before rebase",
                  "command": "git log --oneline",
                  "hint": "Type git log --oneline"
          },
          {
                  "instruction": "Rebase your feature commits on top of main",
                  "command": "git rebase main",
                  "hint": "Type git rebase main"
          },
          {
                  "instruction": "Verify the rebased linear commit history",
                  "command": "git log --oneline",
                  "hint": "Type git log --oneline"
          }
  ],
      initialFiles: [{ name: 'feature.js', content: 'export const run = () => true;\n' }],
      initialCommits: [
        { hash: 'a1b2c3d', message: 'chore: setup baseline' },
        { hash: 'e5f6a7b', message: 'feat: implement run function' },
      ],
      targetTask: 'Check git status and commit log before rebasing.',
      hints: ['Run `git status`.'],
      validationRegex: /git status/i,
      solutionCommands: ['git status'],
    },

    challenge: {
      title: 'Inspect Branch Divergence',
      instructions: 'Review commit log to determine if your branch is ahead or behind main.',
      startingState: 'Branch checked out.',
      goalState: 'Commit log displayed via git log --oneline.',
      hints: ['Run `git log --oneline -n 3`.'],
    },

    reference: {
      officialDocUrl: 'https://git-scm.com/docs/git-rebase',
      syntaxCheatSheet: [
        'git rebase <base> : Rebase current branch on <base>',
        'git rebase --continue : Proceed after resolving conflicts',
        'git rebase --abort : Completely cancel rebase',
        'git push --force-with-lease : Safely push rebased branch to remote',
      ],
      commonErrors: [
        { error: 'Cannot rebase: You have unstaged changes', remedy: 'Run `git stash` or commit changes before starting `git rebase`.' },
        { error: 'Push rejected (non-fast-forward) after rebase', remedy: 'Because rebase changes commit hashes, push with `git push --force-with-lease` on your private feature branch.' },
      ],
      mentalModelDiagram: {
        concept: 'The Golden Rule of Rebasing',
        explanation: 'NEVER rebase a public shared branch (like main). ONLY rebase your own private feature branches before merging.',
        storageLocation: 'Original commit objects remain in .git/objects/ until reflog expires.',
      },
      edgeCases: ['Never use raw `git push --force` after a rebase; always use `git push --force-with-lease` so you don\'t accidentally overwrite someone else\'s commits.'],
    },
  },

  'c-merge-conflicts': {
    id: 'c-merge-conflicts',
    command: 'conflict markers',
    title: 'Resolving Merge Conflicts',
    topicId: 'topic-07',
    topicNumber: '07',
    topicTitle: 'Merge Strategies',
    subtitle: 'Understanding <<<<<<< HEAD, =======, and >>>>>>> conflict markers and resolving overlapping edits',
    badges: ['Intermediate', 'Troubleshooting', 'Essential'],
    quote: 'Merge conflicts are not bugs or catastrophes; they are simply Git asking you: "Two humans edited the exact same line. Which one is right?"',
    difficulty: 'Intermediate',

    whatIsIt:
      'A merge conflict occurs when two branches modify the same line of code in the same file differently, or when one branch deletes a file that another branch modified. Git stops the merge or rebase, writes explicit visual conflict markers directly into the affected files, and prompts you to manually choose or combine the desired code.',
    inSimpleWords:
      'Git can automatically merge changes if they happen in different files or different lines. But if Bob changes line 10 to "color: red" and Alice changes line 10 to "color: blue", Git pauses and asks you to pick the winner.',
    whyDoYouNeedIt:
      'Software engineering is fundamentally collaborative. Learning how to read conflict markers, pick the correct changes, test the combined result, and finalize the commit is an indispensable developer skill.',
    realWorldAnalogy:
      'Two family members writing on a paper calendar for Saturday night. One wrote "Dinner at Italian place", the other wrote "Movie night". You sit down at the kitchen table, talk it over, erase the pencil marks, and write "Italian dinner then Movie".',

    syntaxCode: '<<<<<<< HEAD (Current Changes)\n...\n=======\n...\n>>>>>>> incoming-branch (Incoming Changes)',
    syntaxTokens: [
      { token: '<<<<<<< HEAD', role: 'Current Marker', explanation: 'Top boundary showing code from your active branch.' },
      { token: '=======', role: 'Separator', explanation: 'Dividing line separating current code from incoming code.' },
      { token: '>>>>>>> branch', role: 'Incoming Marker', explanation: 'Bottom boundary showing code from the incoming branch.' },
    ],

    actionStage: {
      before: {
        label: 'Overlapping Modifications',
        description: 'Main changed line 5 to `PORT = 8080`. Feature branch changed line 5 to `PORT = 3000`.',
        workingDirectory: [{ name: 'config.env', status: 'modified' }],
        stagingArea: [],
        commandPill: 'Overlapping edit detected',
        historyCommits: [
          { hash: 'M1', message: 'fix: use production port 8080' },
          { hash: 'F1', message: 'feat: use development port 3000' },
        ],
        whatChanged: ['Two different commits modified the exact same line.'],
        whatDidNotChange: ['Git cannot guess which value is correct.'],
      },
      running: {
        label: 'Conflict Markers Injected',
        description: 'Git pauses merge and writes markers into config.env. File status becomes "both modified" (UU).',
        workingDirectory: [{ name: 'config.env', status: 'conflict' }],
        stagingArea: [],
        commandPill: 'CONFLICT (content): Merge conflict in config.env',
        historyCommits: [],
        whatChanged: ['File contains <<<<<<< HEAD, =======, and >>>>>>> markers.'],
        whatDidNotChange: ['Repository remains in MERGING state until resolved.'],
      },
      after: {
        label: 'Resolved, Staged & Committed',
        description: 'Developer edits file to `PORT = process.env.PORT || 8080`, deletes markers, runs `git add`, and commits.',
        workingDirectory: [{ name: 'config.env', status: 'committed' }],
        stagingArea: [],
        commandPill: 'git add config.env && git commit',
        historyCommits: [
          { hash: 'C_RES', message: 'Merge branch \'feature\': resolve port conflict' },
        ],
        whatChanged: ['Clean unified resolution committed to repository history.'],
        whatDidNotChange: ['No conflict markers remain in the codebase.'],
      },
    },

    variations: [
      {
        flag: 'Choose Side',
        title: 'Pick One Branch Entirely (--theirs / --ours)',
        syntax: 'git checkout --theirs <filename> / git checkout --ours <filename>',
        whatItDoes: 'Discards one side completely and replaces the conflicted file with the incoming version or current version.',
        whenToUse: 'Binary files, compiled assets, or package lockfiles where manual line editing is error-prone.',
        example: 'git checkout --theirs package-lock.json',
        snippet: 'git checkout --theirs <filename>',
      },
      {
        flag: 'Marker Check',
        title: 'Verify Conflict Markers Removed',
        syntax: 'git diff --check',
        whatItDoes: 'Scans all staged and unstaged files to ensure no residual <<<<<<< conflict markers remain.',
        whenToUse: 'Final validation check before running git commit.',
        example: 'git diff --check',
        snippet: 'git diff --check',
      },
      {
        flag: 'Abort',
        title: 'Cancel Merge Operation Safely',
        syntax: 'git merge --abort',
        whatItDoes: 'Stops the merge and restores your entire working tree and index to the pre-merge state.',
        whenToUse: 'When conflicts are overwhelming and you need to consult your teammate first.',
        example: 'git merge --abort',
        snippet: 'git merge --abort',
      },
    ],

    scenarios: [
      {
        id: 'sc-conflict-1',
        title: 'Resolving a Complex Merge Conflict in package-lock.json',
        context: 'During merge, package-lock.json has 200 lines of conflict markers because dependencies were added on both branches.',
        question: 'What is the cleanest way to resolve a conflict in a generated package lockfile?',
        options: [
          {
            label: 'Accept either side (or delete the lockfile) and regenerate it cleanly using npm install',
            command: 'git checkout --theirs package-lock.json && npm install && git add package-lock.json',
            isCorrect: true,
            explanation: 'Manually editing JSON hash lines in lockfiles almost always introduces JSON syntax errors. Re-running npm install generates a valid, consistent lockfile.',
          },
          {
            label: 'Delete the entire node_modules folder from Git repository permanently',
            command: 'No command',
            isCorrect: false,
            explanation: 'node_modules should already be in .gitignore; the conflict is in package-lock.json itself.',
          },
        ],
        whenToUse: 'When both you and teammate modified the same function.',
        commandExample: 'Edit file -> remove <<<<<<< / ======= / >>>>>>> -> git add <file> -> git commit',
        note: 'Always run unit tests before committing resolution.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'git merge --abort',
        commandB: 'git rebase --abort',
        aspect: 'Operation Aborted',
        descriptionA: 'Restores the branch to the exact state before git merge was invoked, clearing all conflict files.',
        descriptionB: 'Restores the branch to the exact state before git rebase was invoked, clearing all staged replay steps.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Running `git add .` without opening the conflicted files and resolving the code diffs',
        whyItHappens: 'Assuming `git add` automatically resolves the conflicts.',
        fix: 'Git marks conflicts resolved when you `git add` them. You MUST edit the file and delete `<<<<<<<`, `=======`, and `>>>>>>>` first!',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"TITLE = Hello World\" > title.txt",
          "git add title.txt",
          "git commit -m \"chore: initial title\"",
          "git switch -c branch-a",
          "echo \"TITLE = CommitForge Learning\" > title.txt",
          "git commit -am \"feat: title brand A\"",
          "git switch main",
          "echo \"TITLE = Git Mastery Academy\" > title.txt",
          "git commit -am \"feat: title brand main\""
  ],
      guidedSteps: [
          {
                  "instruction": "Attempt to merge branch-a into main",
                  "command": "git merge branch-a",
                  "hint": "Type git merge branch-a"
          },
          {
                  "instruction": "Inspect conflict state and status",
                  "command": "git status",
                  "hint": "Type git status"
          },
          {
                  "instruction": "Abort merge cleanly to return to safe state",
                  "command": "git merge --abort",
                  "hint": "Type git merge --abort"
          }
  ],
      initialFiles: [{ name: 'api.ts', content: '<<<<<<< HEAD\nexport const API_URL = "https://api.v2.com";\n=======\nexport const API_URL = "https://api.legacy.com";\n>>>>>>> feature/old\n' }],
      initialCommits: [{ hash: '9988771', message: 'chore: merge in progress' }],
      targetTask: 'Check git status to see which files are unmerged (both modified).',
      hints: ['Run `git status`.'],
      validationRegex: /git status/i,
      solutionCommands: ['git status'],
    },

    challenge: {
      title: 'Detect Conflict Status',
      instructions: 'Identify files flagged with "both modified" in git status.',
      startingState: 'Repository with unmerged conflict file.',
      goalState: 'Unmerged paths displayed in git status.',
      hints: ['Run `git status -s`.'],
    },

    reference: {
      officialDocUrl: 'https://git-scm.com/docs/git-merge#_how_to_resolve_conflicts',
      syntaxCheatSheet: [
        'git status : Shows unmerged paths (UU)',
        'git diff : Inspect active conflict markers in files',
        'git add <resolved-file> : Mark conflict as resolved',
        'git merge --continue : Complete the merge process',
        'git merge --abort : Cancel and rewind',
      ],
      commonErrors: [
        { error: 'SyntaxError: Unexpected token <<<<<<<', remedy: 'You forgot to delete the Git conflict markers before committing and running your code.' },
      ],
      mentalModelDiagram: {
        concept: 'Conflict Anatomy',
        explanation: '<<<<<<< HEAD\\n[Your changes]\\n=======\\n[Their changes]\\n>>>>>>> branch_name',
        storageLocation: 'The staging index stores 3 stages: stage 1 (ancestor), stage 2 (ours), stage 3 (theirs).',
      },
      edgeCases: ['Enabling `git config --global rerere.enabled true` (Reuse Recorded Resolution) makes Git remember how you resolved a conflict and automatically resolve it if it happens again.'],
    },
  },

  // ==========================================================================
  // TOPIC 08: Best Practices
  // ==========================================================================
  'c-atomic-commits': {
    id: 'c-atomic-commits',
    command: 'best practice',
    title: 'Atomic Commits',
    topicId: 'topic-08',
    topicNumber: '08',
    topicTitle: 'Best Practices',
    subtitle: 'Packaging exactly one logical unit of work per commit with all tests passing',
    badges: ['Beginner', 'Best Practice', 'Software Engineering'],
    quote: 'An atomic commit cannot be split into smaller meaningful commits without breaking the build.',
    difficulty: 'Beginner',

    whatIsIt:
      'An atomic commit is a commit that makes a single, indivisible logical change to the codebase. It includes the implementation, corresponding unit tests, and necessary documentation for that specific change. Crucially, the codebase builds cleanly and all tests pass both immediately before and immediately after an atomic commit.',
    inSimpleWords:
      'Don\'t put groceries, motor oil, a new jacket, and your taxes into the same shopping bag. Group things logically so if you need to return the jacket, you don\'t have to return the milk too.',
    whyDoYouNeedIt:
      'When a commit bundles 10 unrelated changes ("refactor auth, fix button color, update database schema, upgrade node"), reviewing it is a nightmare. If the database change introduces a bug, you cannot revert it without also reverting the button and auth changes. Atomic commits make `git revert` and `git bisect` effortless.',
    realWorldAnalogy:
      'Transactions in database systems (ACID properties). A banking transaction deducts $100 from Account A and adds $100 to Account B simultaneously; it never leaves the system half-deducted.',

    syntaxCode: 'git add -p  # Review and stage single logical chunks',
    syntaxTokens: [
      { token: 'git add -p', role: 'Patch Mode', explanation: 'Interactively review individual diff hunks to stage atomic pieces.' },
      { token: 'git commit -m', role: 'Commit', explanation: 'Creates a single focused snapshot.' },
    ],

    actionStage: {
      before: {
        label: 'Messy Working Tree',
        description: 'You modified 6 files: 2 for a bugfix in billing, 3 for a new button style, 1 for a typo.',
        workingDirectory: [
          { name: 'billing.ts', status: 'modified' },
          { name: 'billing.test.ts', status: 'modified' },
          { name: 'button.css', status: 'modified' },
          { name: 'button.tsx', status: 'modified' },
          { name: 'button.test.tsx', status: 'modified' },
          { name: 'README.md', status: 'modified' },
        ],
        stagingArea: [],
        commandPill: '6 mixed files in working directory',
        historyCommits: [{ hash: 'C1', message: 'baseline' }],
        whatChanged: ['Multiple unrelated tasks worked on at once.'],
        whatDidNotChange: ['Nothing staged yet.'],
      },
      running: {
        label: 'Staging Only Billing Files',
        description: 'Running `git add billing.ts billing.test.ts` to isolate the billing fix.',
        workingDirectory: [
          { name: 'button.css', status: 'modified' },
          { name: 'button.tsx', status: 'modified' },
          { name: 'button.test.tsx', status: 'modified' },
          { name: 'README.md', status: 'modified' },
        ],
        stagingArea: [
          { name: 'billing.ts', status: 'staged' },
          { name: 'billing.test.ts', status: 'staged' },
        ],
        commandPill: 'git commit -m "fix(billing): handle negative discounts"',
        historyCommits: [
          { hash: 'C1', message: 'baseline' },
        ],
        whatChanged: ['Only billing logic is captured.'],
        whatDidNotChange: ['Button styling and README remain safe in working tree for next commit.'],
      },
      after: {
        label: 'Clean Atomic Commit Saved',
        description: 'Commit C2 contains only the billing fix. Button changes can now be staged as commit C3.',
        workingDirectory: [
          { name: 'button.css', status: 'modified' },
          { name: 'button.tsx', status: 'modified' },
          { name: 'button.test.tsx', status: 'modified' },
          { name: 'README.md', status: 'modified' },
        ],
        stagingArea: [],
        commandPill: 'C2: atomic billing fix',
        historyCommits: [
          { hash: 'C2', message: 'fix(billing): handle negative discounts' },
          { hash: 'C1', message: 'baseline' },
        ],
        whatChanged: ['Clean atomic history. If billing fix has a bug, it can be reverted with 1 command.'],
        whatDidNotChange: ['Other work remains uncommitted, ready for separate commits.'],
      },
    },

    variations: [
      {
        flag: 'Patch Mode',
        title: 'Interactive Patch Staging (git add -p)',
        syntax: 'git add -p <file>',
        whatItDoes: 'Interactively prompts you hunk by hunk (y/n/s/e) to selectively stage parts of a file into separate atomic commits.',
        whenToUse: 'When you fixed a bug and reformatted code in the same file and want them in distinct commits.',
        example: 'git add -p src/billing.ts',
        snippet: 'git add -p <file>',
      },
      {
        flag: 'Explicit Files',
        title: 'Explicit File Staging',
        syntax: 'git add <file1> <file2>',
        whatItDoes: 'Stages only the specific implementation file and its unit test together, leaving other edits unstaged.',
        whenToUse: 'Everyday development when multiple files were modified for different reasons.',
        example: 'git add src/auth.ts tests/auth.test.ts',
        snippet: 'git add <file1> <file2>',
      },
      {
        flag: 'Split Previous',
        title: 'Split Previous Commit with Soft Reset',
        syntax: 'git reset HEAD~1',
        whatItDoes: 'Undoes the previous commit while keeping all modifications in your working tree so you can stage them atomically.',
        whenToUse: 'When you realize your last commit bundled too many unrelated features together.',
        example: 'git reset HEAD~1',
        snippet: 'git reset HEAD~1',
      },
    ],

    scenarios: [
      {
        id: 'sc-atomic-1',
        title: 'Separating Bug Fix from Whitespace Reformatting',
        context: 'You fixed a critical login bug (2 lines of code) and auto-formatted the entire 400-line file with Prettier.',
        question: 'How should you commit these changes?',
        options: [
          {
            label: 'Use git add -p to separate the 2-line bugfix into one commit and the formatting cleanup into a second commit',
            command: 'git add -p',
            isCorrect: true,
            explanation: 'Separating functional logic from pure formatting makes code review 10x faster and prevents hiding bugs inside massive formatting diffs.',
          },
          {
            label: 'Commit both together with message "fix login and format file"',
            command: 'git commit -am "fix login and format file"',
            isCorrect: false,
            explanation: 'Mixing formatting with bug fixes clutters git blame and makes git revert dangerous if formatting broke something.',
          },
        ],
        whenToUse: 'You found a bug, but refactored 50 lines while fixing it.',
        commandExample: 'Stage refactoring first -> commit "refactor: extract helper" -> stage bugfix -> commit "fix: resolve off-by-one"',
        note: 'Separating refactoring from behavior changes makes PR reviews 10x faster.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'Atomic Commits (Small, Single-Purpose)',
        commandB: 'Mega-Commits (Multi-Day, Kitchen Sink)',
        aspect: 'Revertability & Code Review',
        descriptionA: 'If a bug is found in production, you can cleanly `git revert <sha>` without losing other working features.',
        descriptionB: 'Reverting a 1,500-line mega-commit tears out 4 other working features and causes panic.',
        safeForSharedHistory: { a: true, b: false },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Bundling a refactor, a dependency upgrade, and a new user feature into one giant commit',
        whyItHappens: 'Not committing frequently throughout the workday.',
        fix: 'Stage and commit each logical task immediately upon completion. Use `git add -p` if you forgot.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"export const Auth = true;\" > auth.js",
          "echo \"body { margin: 0; }\" > styles.css"
  ],
      guidedSteps: [
          {
                  "instruction": "Check unstaged modified files",
                  "command": "git status",
                  "hint": "Type git status"
          },
          {
                  "instruction": "Stage only the authentication change for an atomic commit",
                  "command": "git add auth.js",
                  "hint": "Type git add auth.js"
          },
          {
                  "instruction": "Commit the atomic feature",
                  "command": "git commit -m \"feat: implement auth service\"",
                  "hint": "Type git commit -m <msg>"
          }
  ],
      initialFiles: [
        { name: 'math.ts', content: 'export const add = (a: number, b: number) => a + b;\n' },
        { name: 'math.test.ts', content: 'test("add", () => expect(add(1, 2)).toBe(3));\n' },
      ],
      initialCommits: [{ hash: '1234567', message: 'feat: add math helper and test suite' }],
      targetTask: 'Check git status to confirm clean working directory.',
      hints: ['Run `git status`.'],
      validationRegex: /git status/i,
      solutionCommands: ['git status'],
    },

    challenge: {
      title: 'Practice Selective Staging',
      instructions: 'Review modified files to determine which single logical unit to stage first.',
      startingState: 'Clean repo.',
      goalState: 'Clean status verified.',
      hints: ['Run `git status`.'],
    },

    reference: {
      officialDocUrl: 'https://en.wikipedia.org/wiki/Atomic_commit',
      syntaxCheatSheet: [
        'git add -p <file> : Interactively pick hunks to stage',
        'git commit -v : Show diff in editor while typing commit message',
        'git status : Inspect what is staged vs unstaged',
      ],
      commonErrors: [
        { error: 'Committing broken code ("wip - leaving for lunch")', remedy: 'Use `git stash` instead of committing non-functional, broken-build code to shared branches.' },
      ],
      mentalModelDiagram: {
        concept: 'Atomic Scope',
        explanation: 'Commit = (1 Concept) + (Its Tests) + (Its Documentation). Builds green before. Builds green after.',
        storageLocation: 'Single Git commit tree object containing precisely relevant blobs.',
      },
      edgeCases: ['Very large database schema migrations might need to be split into two backwards-compatible commits: add nullable column first, backfill data, then make non-null.'],
    },
  },

  'c-commit-messages': {
    id: 'c-commit-messages',
    command: 'conventional commits',
    title: 'Conventional Commit Messages',
    topicId: 'topic-08',
    topicNumber: '08',
    topicTitle: 'Best Practices',
    subtitle: 'Standardizing commit history with feat, fix, chore, and semantic release automation',
    badges: ['Beginner', 'Best Practice', 'Standard'],
    quote: 'A good commit message answers: "If applied, this commit will <your message here>".',
    difficulty: 'Beginner',

    whatIsIt:
      'Conventional Commits is a lightweight convention on top of commit messages. It provides an easy set of rules for creating an explicit commit history, using a structured format: `<type>(<optional scope>): <description>`. Common types include `feat` (new feature), `fix` (bug fix), `docs`, `style`, `refactor`, `perf`, `test`, and `chore`.',
    inSimpleWords:
      'A standard labeling rule for your commits so humans and automated release robots instantly know whether you fixed a bug, added a feature, or updated a typo.',
    whyDoYouNeedIt:
      'Vague commit messages like "stuff", "asdf", or "fixed it" make tracking down bugs impossible. Conventional Commits enable automated semantic versioning (`semver`), automatic changelog generation, and lightning-fast PR skimming.',
    realWorldAnalogy:
      'Shipping boxes in a warehouse. Instead of unlabelled brown cardboard boxes, each box has an industry-standard barcode sticker: [FRAGILE-GLASSWARE], [DOCUMENTS-LEGAL], [ELECTRONICS-BATTERY].',

    syntaxCode: 'git commit -m "<type>(<scope>): <imperative subject>"',
    syntaxTokens: [
      { token: '<type>', role: 'Category', explanation: 'feat, fix, docs, refactor, perf, test, chore.' },
      { token: '(<scope>)', role: 'Module Context', explanation: 'Optional context (e.g., auth, billing, ui).' },
      { token: '<description>', role: 'Imperative Summary', explanation: 'Short present-tense action (e.g., add oauth2 login button).' },
    ],

    actionStage: {
      before: {
        label: 'Vague Commit History',
        description: 'Commit log contains: "fixed bug", "updates", "changes", "more fixes".',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'git log: unhelpful messages',
        historyCommits: [
          { hash: 'B3', message: 'more fixes' },
          { hash: 'B2', message: 'updates' },
          { hash: 'B1', message: 'fixed bug' },
        ],
        whatChanged: ['Impossible to determine what changed without opening each diff.'],
        whatDidNotChange: ['Changelogs cannot be automated.'],
      },
      running: {
        label: 'Adopting Standard Format',
        description: 'Writing structured imperative commit messages with type and scope.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'git commit -m "feat(cart): add promo code validation"',
        historyCommits: [
          { hash: 'C4', message: 'feat(cart): add promo code validation' },
        ],
        whatChanged: ['Type (feat) triggers a minor semver bump (v1.1.0).'],
        whatDidNotChange: ['History becomes structured data.'],
      },
      after: {
        label: 'Automated Release Ready',
        description: 'Tools like semantic-release parse git log to generate CHANGELOG.md and bump version automatically.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Auto Changelog & Version Generated',
        historyCommits: [
          { hash: 'C5', message: 'fix(auth): handle expired refresh tokens' },
          { hash: 'C4', message: 'feat(cart): add promo code validation' },
          { hash: 'C3', message: 'docs(api): document webhook endpoints' },
        ],
        whatChanged: ['High-clarity history; team members understand intent at a glance.'],
        whatDidNotChange: ['Zero manual changelog maintenance required.'],
      },
    },

    variations: [
      {
        flag: 'feat:',
        title: 'New Feature (feat:)',
        syntax: 'git commit -m "feat(<scope>): <imperative summary>"',
        whatItDoes: 'Introduces a new user-facing feature to the codebase, triggering a MINOR semantic version bump.',
        whenToUse: 'Whenever adding new capabilities, endpoints, or UI features.',
        example: 'git commit -m "feat(auth): support Passkey WebAuthn login"',
        snippet: 'feat(auth): support Passkey WebAuthn login',
      },
      {
        flag: 'fix:',
        title: 'Bug Fix (fix:)',
        syntax: 'git commit -m "fix(<scope>): <imperative summary>"',
        whatItDoes: 'Patches a bug in production or development, triggering a PATCH semantic version bump.',
        whenToUse: 'Addressing issue tickets, defects, or runtime crashes.',
        example: 'git commit -m "fix(checkout): prevent double submission on slow 3G"',
        snippet: 'fix(checkout): prevent double submission on slow 3G',
      },
      {
        flag: 'Multi-line',
        title: 'Commit with Detailed Body (-m ... -m ...)',
        syntax: 'git commit -m "<summary>" -m "<detailed rationale>"',
        whatItDoes: 'Records a concise 50-character title followed by a multi-line explanation of the architectural context.',
        whenToUse: 'Non-trivial bugfixes where future engineers will need context in git blame.',
        example: 'git commit -m "fix(cache): invalidate redis session on logout" -m "Prevents stale user permissions in distributed pods."',
        snippet: 'git commit -m "summary" -m "body"',
      },
    ],

    scenarios: [
      {
        id: 'sc-msg-1',
        title: 'Writing an Effective Production Commit Summary',
        context: 'You fixed a bug where users saw a blank screen on mobile Safari due to an unhandled Promise.',
        question: 'Which commit message best complies with modern professional engineering standards?',
        options: [
          {
            label: 'fix(ios): resolve Safari white-screen by polyfilling ResizeObserver (#142)',
            command: 'git commit -m "fix(ios): resolve Safari white-screen by polyfilling ResizeObserver (#142)"',
            isCorrect: true,
            explanation: 'Follows Conventional Commits: specifies type (fix), scope (ios), clear imperative action, technical root cause, and links the issue ticket.',
          },
          {
            label: 'fixed stuff',
            command: 'git commit -m "fixed stuff"',
            isCorrect: false,
            explanation: 'Provides zero information about what was fixed, why, or what platform was affected.',
          },
        ],
        whenToUse: 'Whenever committing code intended for team review.',
        commandExample: 'git commit -m "fix(payment): prevent duplicate stripe charges"',
        note: 'Use imperative mood ("prevent", not "prevented" or "prevents").',
      },
    ],

    commandComparisons: [
      {
        commandA: 'Imperative Mood ("Add feature", "Fix bug")',
        commandB: 'Past Tense ("Added feature", "Fixed bug")',
        aspect: 'Git Standard Convention',
        descriptionA: 'Matches the Git engine\'s own generated commits ("Merge branch...", "Revert..."). Completes the sentence: "If applied, this commit will..."',
        descriptionB: 'Past tense is informal and inconsistent with Git internal tooling.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Writing vague commit messages like "updates", "wip", "asdf", or "changes"',
        whyItHappens: 'Rushing to finish work without realizing that commit messages are team documentation.',
        fix: 'Use Conventional Commit templates (`feat:`, `fix:`, `docs:`, `test:`) to build consistent habits.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"v1.0\" > version.txt",
          "git add version.txt"
  ],
      guidedSteps: [
          {
                  "instruction": "Check staged changes",
                  "command": "git status",
                  "hint": "Type git status"
          },
          {
                  "instruction": "Commit using Conventional Commits specification",
                  "command": "git commit -m \"feat(core): release version 1.0 specifications\"",
                  "hint": "Type git commit -m <msg>"
          },
          {
                  "instruction": "Inspect the clean formatted commit message in history",
                  "command": "git log -n 1",
                  "hint": "Type git log -n 1"
          }
  ],
      initialFiles: [{ name: 'server.js', content: 'app.get("/health", (req, res) => res.send("OK"));\n' }],
      initialCommits: [{ hash: 'a2b3c4d', message: 'feat(api): add health check route' }],
      targetTask: 'Check git log to inspect the structured commit message.',
      hints: ['Run `git log -1`.'],
      validationRegex: /git log/i,
      solutionCommands: ['git log -1'],
    },

    challenge: {
      title: 'Audit Recent Commit Message',
      instructions: 'Display the latest commit message and check if it follows conventional format.',
      startingState: 'Recent commit recorded.',
      goalState: 'Latest commit message printed to terminal.',
      hints: ['Run `git log -1 --pretty=format:"%s"`.'],
    },

    reference: {
      officialDocUrl: 'https://www.conventionalcommits.org/en/v1.0.0/',
      syntaxCheatSheet: [
        'feat: New user-facing feature',
        'fix: Bug patch',
        'docs: Documentation changes only',
        'refactor: Code restructuring without behavior change',
        'test: Adding or fixing test suites',
        'chore: Build system, dependencies, auxiliary tools',
      ],
      commonErrors: [
        { error: 'Writing past-tense ("fixed bug") instead of imperative ("fix: resolve bug")', remedy: 'Think of the sentence: "If applied, this commit will <message>".' },
      ],
      mentalModelDiagram: {
        concept: 'Semantic Release Pipeline',
        explanation: 'feat -> bumps 1.X.0. fix -> bumps 1.0.X. BREAKING -> bumps X.0.0. CHANGELOG.md generated automatically.',
        storageLocation: 'Commit message header in Git commit object.',
      },
      edgeCases: ['Multi-line commit messages should leave a blank line between the summary subject and the detailed explanation body.'],
    },
  },

  'c-gitignore-mastery': {
    id: 'c-gitignore-mastery',
    command: '.gitignore',
    title: '.gitignore Mastery',
    topicId: 'topic-08',
    topicNumber: '08',
    topicTitle: 'Best Practices',
    subtitle: 'Preventing secret leaks, node_modules bloat, and build artifacts from polluting Git',
    badges: ['Beginner', 'Security', 'Essential'],
    quote: 'What is once committed to Git lives in the object database forever. Never let secrets or build artifacts cross the boundary.',
    difficulty: 'Beginner',

    whatIsIt:
      'A `.gitignore` file is a plain text file placed in your repository root that tells Git which files, patterns, or directories to intentionally ignore. Untracked files that match patterns in `.gitignore` will not show up in `git status` and cannot be accidentally added via `git add .`.',
    inSimpleWords:
      'A "Do Not Enter" sign for Git. You tell Git: "Ignore my node_modules folder, ignore my secret .env passwords, and ignore compiled binaries."',
    whyDoYouNeedIt:
      'Committing `node_modules/` or binary build folders adds hundreds of megabytes of garbage to your repo, slowing down every clone and push. Even worse, committing `.env` files with AWS keys or database passwords creates severe security vulnerabilities.',
    realWorldAnalogy:
      'A spam filter for your mailbox. Instead of filling your living room with 5,000 credit card offer pamphlets, the filter dumps them in recycling before they ever reach your desk.',

    syntaxCode: 'echo ".env\nnode_modules/\ndist/" >> .gitignore',
    syntaxTokens: [
      { token: '.env', role: 'Exact Match', explanation: 'Ignores any file named exactly .env.' },
      { token: 'node_modules/', role: 'Directory Pattern', explanation: 'Trailing slash matches entire directory and all descendants.' },
      { token: '*.log', role: 'Glob Pattern', explanation: 'Matches all files ending with .log in any subdirectory.' },
    ],

    actionStage: {
      before: {
        label: 'Untracked Noise and Danger',
        description: '`git status` lists 15,000 files from node_modules/ and a sensitive .env file under Untracked files.',
        workingDirectory: [
          { name: '.env', status: 'untracked' },
          { name: 'node_modules/', status: 'untracked' },
          { name: 'app.js', status: 'modified' },
        ],
        stagingArea: [],
        commandPill: 'git status: 15,002 untracked files',
        historyCommits: [],
        whatChanged: ['Build artifacts and secrets visible to git add.'],
        whatDidNotChange: ['Vulnerable to accidental leak.'],
      },
      running: {
        label: 'Adding .gitignore Rules',
        description: 'Writing `.env`, `node_modules/`, and `*.log` into `.gitignore`.',
        workingDirectory: [
          { name: '.gitignore', status: 'untracked' },
          { name: 'app.js', status: 'modified' },
        ],
        stagingArea: [],
        commandPill: 'echo "node_modules/\n.env" > .gitignore',
        historyCommits: [],
        whatChanged: ['Git immediately stops displaying node_modules/ and .env in status.'],
        whatDidNotChange: ['Files remain physically on your disk for local development.'],
      },
      after: {
        label: 'Clean and Safe',
        description: '`git status` only shows `.gitignore` and `app.js`. `git add .` is completely safe.',
        workingDirectory: [
          { name: 'app.js', status: 'modified' },
        ],
        stagingArea: [{ name: '.gitignore', status: 'staged' }],
        commandPill: 'git status: clean & safe',
        historyCommits: [
          { hash: 'G1', message: 'chore: add comprehensive .gitignore' },
        ],
        whatChanged: ['Secrets and bloat permanently prevented from entering repository history.'],
        whatDidNotChange: ['Local development environment functions normally.'],
      },
    },

    variations: [
      {
        flag: 'Untrack Cached',
        title: 'Untrack Already Committed File (git rm --cached)',
        syntax: 'git rm --cached <file>',
        whatItDoes: 'Stops tracking a file in Git and removes it from the index, while keeping the file intact on your local disk.',
        whenToUse: 'When a file was tracked before you added it to .gitignore, so Git keeps monitoring it.',
        example: 'git rm --cached .env',
        snippet: 'git rm --cached <file>',
      },
      {
        flag: 'Check Ignore',
        title: 'Debug .gitignore Pattern Matching',
        syntax: 'git check-ignore -v <file-path>',
        whatItDoes: 'Reveals the exact line of .gitignore that is causing a file to be ignored.',
        whenToUse: 'Debugging why a file you want to commit is unexpectedly ignored by Git.',
        example: 'git check-ignore -v src/config.local.ts',
        snippet: 'git check-ignore -v <path>',
      },
      {
        flag: 'Global Ignore',
        title: 'System-Wide Global Ignore File',
        syntax: 'git config --global core.excludesfile ~/.gitignore_global',
        whatItDoes: 'Ignores operating system files like .DS_Store, Thumbs.db, and IDE preferences across all repositories.',
        whenToUse: 'Keeping OS-specific garbage out of team repositories.',
        example: 'git config --global core.excludesfile ~/.gitignore_global',
        snippet: 'git config --global core.excludesfile ~/.gitignore_global',
      },
    ],

    scenarios: [
      {
        id: 'sc-ignore-1',
        title: 'A File Listed in .gitignore Keeps Showing Up in git status',
        context: 'You added secret.key to .gitignore, but git status still reports changes to secret.key.',
        question: 'Why is Git still tracking secret.key, and how do you fix it?',
        options: [
          {
            label: 'The file was already committed before being added to .gitignore. Untrack it with git rm --cached secret.key',
            command: 'git rm --cached secret.key && git commit -m "chore: stop tracking secret.key"',
            isCorrect: true,
            explanation: '.gitignore only prevents untracked files from being staged. If a file is already in the index/history, you must untrack it with git rm --cached.',
          },
          {
            label: 'Delete .gitignore and recreate it',
            command: 'rm .gitignore',
            isCorrect: false,
            explanation: 'Recreating .gitignore does not affect files that Git is already tracking in its index.',
          },
        ],
        whenToUse: 'First step when creating any new repository.',
        commandExample: 'npx gitignore node',
        note: 'Downloads curated industry-standard gitignore template for Node.js.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'git rm <file>',
        commandB: 'git rm --cached <file>',
        aspect: 'Disk File Deletion',
        descriptionA: 'Deletes the file from both Git tracking AND your physical hard drive.',
        descriptionB: 'Removes the file from Git tracking ONLY, leaving the file intact on your physical hard drive.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Committing `.env` or configuration secrets because .gitignore was created after the commit',
        whyItHappens: '.gitignore does not retroactively remove files that are already part of Git history.',
        fix: 'Run `git rm --cached .env` and commit. If the secret was pushed publicly, rotate the secret key immediately.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"SECRET_KEY=123456\" > .env",
          "echo \"console.log(process.env.SECRET_KEY);\" > index.js",
          "echo \".env\" > .gitignore",
          "echo \"node_modules/\" >> .gitignore"
  ],
      guidedSteps: [
          {
                  "instruction": "Verify Git ignores .env file",
                  "command": "git status",
                  "hint": "Type git status"
          },
          {
                  "instruction": "Stage .gitignore and source files",
                  "command": "git add .gitignore index.js",
                  "hint": "Type git add .gitignore index.js"
          },
          {
                  "instruction": "Commit without leaking secrets",
                  "command": "git commit -m \"chore: add gitignore and index entrypoint\"",
                  "hint": "Type git commit -m <msg>"
          }
  ],
      initialFiles: [
        { name: '.gitignore', content: 'node_modules/\n.env\n*.log\ndist/\n' },
        { name: 'package.json', content: '{\n  "name": "commitforge"\n}\n' },
      ],
      initialCommits: [{ hash: 'e1d2c3b', message: 'chore: add project gitignore' }],
      targetTask: 'Check .gitignore rules and verify status with git status.',
      hints: ['Run `git status`.'],
      validationRegex: /git status/i,
      solutionCommands: ['git status'],
    },

    challenge: {
      title: 'Inspect Ignore Rules',
      instructions: 'Verify which ignore rules apply to a path using git check-ignore.',
      startingState: '.gitignore configured in repo.',
      goalState: 'Rule match confirmed via git check-ignore .env.',
      hints: ['Run `git check-ignore -v .env`.'],
    },

    reference: {
      officialDocUrl: 'https://git-scm.com/docs/gitignore',
      syntaxCheatSheet: [
        '# Comment lines start with #',
        'dir/ : Ignore entire directory',
        '*.ext : Wildcard extension match',
        '!file.ext : Negate ignore rule',
        'git check-ignore -v <path> : Debug which rule is ignoring a file',
        'git rm --cached <file> : Untrack file without deleting it',
      ],
      commonErrors: [
        { error: 'I added a file to .gitignore but git still tracks it', remedy: 'If a file was already committed, .gitignore has no effect on it. Run `git rm --cached <file>` and commit.' },
      ],
      mentalModelDiagram: {
        concept: 'Ignore Evaluation Filter',
        explanation: 'Working File -> Matches .gitignore? -> YES: Skip from untracked list -> NO: Display in git status.',
        storageLocation: 'Plaintext file in repository root: `.gitignore`.',
      },
      edgeCases: ['Empty directories cannot be tracked by Git directly; add an empty `.gitkeep` file inside the directory if you want it tracked.'],
    },
  },

  'c-clean-git-hygiene': {
    id: 'c-clean-git-hygiene',
    command: 'git status -s',
    title: 'Day-to-Day Git Hygiene',
    topicId: 'topic-08',
    topicNumber: '08',
    topicTitle: 'Best Practices',
    subtitle: 'Healthy developer habits: concise statuses, regular pruning, discarding junk, and safe stashing',
    badges: ['Intermediate', 'Hygiene', 'Workflow'],
    quote: 'A clean repository is a fast repository. Cultivate the daily discipline of pruning dead branches and keeping your working tree pristine.',
    difficulty: 'Intermediate',

    whatIsIt:
      'Day-to-day Git hygiene is the practice of maintaining a clean, uncluttered, and predictable local development environment. It encompasses checking short status (`git status -s`), pruning stale remote branches (`git fetch --prune`), cleaning untracked build residue (`git clean`), and keeping the working tree clear at the end of every workday.',
    inSimpleWords:
      'Washing your dishes right after eating instead of letting 50 dirty plates stack up in the kitchen sink until Friday night.',
    whyDoYouNeedIt:
      'Developers who don\'t practice Git hygiene get lost in dozens of stale local branches, confuse uncommitted WIP files across different tasks, accidentally commit test scratchpad files, and suffer merge conflicts because their local branches were abandoned months ago.',
    realWorldAnalogy:
      'A carpenter cleaning wood shavings off the workbench and putting chisels back in the rack before starting the next piece of furniture.',

    syntaxCode: 'git status -s && git fetch --prune && git branch -vv',
    syntaxTokens: [
      { token: 'git status -s', role: 'Short Status', explanation: 'Compact 2-character column view of staged and modified files.' },
      { token: 'git fetch --prune', role: 'Prune Stale', explanation: 'Deletes local tracking pointers for remote branches deleted on GitHub.' },
      { token: 'git branch -vv', role: 'Branch Health', explanation: 'Lists all local branches with their tracking upstream and commit status.' },
    ],

    actionStage: {
      before: {
        label: 'Cluttered Environment',
        description: 'You have 22 local branches (18 already merged on GitHub), 5 untracked scratch files, and stale remote refs.',
        workingDirectory: [
          { name: 'temp-notes.txt', status: 'untracked' },
          { name: 'test.log', status: 'untracked' },
        ],
        stagingArea: [],
        commandPill: '22 branches, unpruned remotes',
        historyCommits: [],
        whatChanged: ['Local repo accumulated months of branch cruft.'],
        whatDidNotChange: ['Remote is clean, but local is bloated.'],
      },
      running: {
        label: 'Running Daily Hygiene Routine',
        description: 'Fetching with prune, deleting merged branches, and clearing untracked scratch files.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'git fetch --prune && git branch -d feature/old',
        historyCommits: [],
        whatChanged: ['Deleted dead local pointers.', 'Remote tracking references synchronized.'],
        whatDidNotChange: ['Active feature code remains protected.'],
      },
      after: {
        label: 'Pristine & Fast',
        description: 'Only active branches remain. `git branch -vv` shows clean 1:1 mapping with GitHub.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Working tree clean, 2 active branches',
        historyCommits: [
          { hash: 'H1', message: 'feat: active feature work' },
        ],
        whatChanged: ['Fast tab-completion, clear mental model, zero stale branch clutter.'],
        whatDidNotChange: ['Nothing lost; all work safely in origin or discarded intentionally.'],
      },
    },

    variations: [
      {
        flag: 'Short Status',
        title: 'Short Status Inspection (git status -s)',
        syntax: 'git status -s',
        whatItDoes: 'Provides a concise 2-column view where column 1 is staging index and column 2 is working tree.',
        whenToUse: 'Quick morning sanity check before writing code.',
        example: 'git status -s',
        snippet: 'git status -s',
      },
      {
        flag: 'Fetch Prune',
        title: 'Prune Deleted Remote References',
        syntax: 'git fetch --prune',
        whatItDoes: 'Deletes local tracking references (origin/...) for branches that were merged and deleted on GitHub.',
        whenToUse: 'Preventing tab-completion clutter and stale tracking branches.',
        example: 'git fetch --prune origin',
        snippet: 'git fetch --prune',
      },
      {
        flag: 'Clean Untracked',
        title: 'Discard Untracked Scratch Files',
        syntax: 'git clean -df',
        whatItDoes: 'Forces deletion of untracked files and untracked directories, returning the repo to a pristine state.',
        whenToUse: 'Clearing compilation outputs and temporary test dumps.',
        example: 'git clean -df',
        snippet: 'git clean -df',
      },
    ],

    scenarios: [
      {
        id: 'sc-hygiene-1',
        title: 'Safely Preserving Uncommitted Edits Before Switching Branches',
        context: 'You have 4 modified files and want to switch branches immediately to investigate an urgent bug report.',
        question: 'What is the cleanest way to preserve your current in-progress work before switching?',
        options: [
          {
            label: 'Run git stash to store your uncommitted changes on the temporary stash stack, then switch branches',
            command: 'git stash && git switch hotfix-branch',
            isCorrect: true,
            explanation: 'Stashing cleans your working tree without losing half-written code, allowing safe branch switches.',
          },
          {
            label: 'Run git restore . and discard all your work so you can switch',
            command: 'git restore .',
            isCorrect: false,
            explanation: 'git restore . permanently wipes your uncommitted work without any way to recover it.',
          },
        ],
        whenToUse: 'Starting your workday.',
        commandExample: 'git switch main && git pull --ff-only && git fetch -p',
        note: 'Ensures your starting point is the absolute latest production state.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'git stash',
        commandB: 'git commit -m "wip"',
        aspect: 'Temporary Storage Mechanism',
        descriptionA: 'Stores uncommitted changes in a lightweight local stack outside of branch commit history.',
        descriptionB: 'Creates an actual commit on the branch. If pushed, requires squashing or amending before PR review.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Leaving dozens of abandoned local branches for months after PRs have been merged',
        whyItHappens: 'Not deleting branches locally after merging PRs on GitHub.',
        fix: 'Periodically run `git branch --merged main | grep -v main | xargs git branch -d` to clean up old merged branches.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"clean codebase\" > main.js",
          "git add main.js",
          "git commit -m \"feat: initial clean codebase\"",
          "echo \"draft\" > draft.txt"
  ],
      guidedSteps: [
          {
                  "instruction": "Inspect working tree with concise short status",
                  "command": "git status -s",
                  "hint": "Type git status -s"
          },
          {
                  "instruction": "Check branch list",
                  "command": "git branch",
                  "hint": "Type git branch"
          },
          {
                  "instruction": "Inspect commit history",
                  "command": "git log --oneline",
                  "hint": "Type git log --oneline"
          }
  ],
      initialFiles: [{ name: 'main.ts', content: 'console.log("Clean repo");\n' }],
      initialCommits: [{ hash: '7766554', message: 'chore: baseline setup' }],
      targetTask: 'Check short status using git status -s.',
      hints: ['Run `git status -s`.'],
      validationRegex: /git status/i,
      solutionCommands: ['git status -s'],
    },

    challenge: {
      title: 'Inspect Repository Hygiene',
      instructions: 'Run short status to verify there are no hidden uncommitted modifications.',
      startingState: 'Repository checked out.',
      goalState: 'Short status confirms clean working tree.',
      hints: ['Run `git status -s`.'],
    },

    reference: {
      officialDocUrl: 'https://git-scm.com/docs/git-clean',
      syntaxCheatSheet: [
        'git status -s : 2-column short status view',
        'git fetch -p : Fetch and prune dead tracking branches',
        'git branch -vv : Show tracking relationships and commit delta',
        'git clean -nd : Dry-run check what untracked files would be deleted',
        'git clean -fd : Delete untracked files and directories',
      ],
      commonErrors: [
        { error: 'error: The branch \'feature\' is not fully merged', remedy: 'Git protects you from losing unmerged commits. If you are certain you want to delete it, use `git branch -D feature`.' },
      ],
      mentalModelDiagram: {
        concept: 'Daily Git Loop',
        explanation: 'Morning: Pull & Prune -> Midday: Atomic Commits -> Afternoon: Push & PR -> Evening: Stash or Commit WIP.',
        storageLocation: 'Local repo pointers and temporary ref logs.',
      },
      edgeCases: ['Never run `git clean -fdx` without running `git clean -ndx` first, because the `x` flag will delete ignored files like `.env`!'],
    },
  },
};
