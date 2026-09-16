import { UniversalConcept } from '../unifiedAcademyData';

export const TOPIC_03_CONCEPTS: Record<string, UniversalConcept> = {
  'c-git-branch': {
    id: 'c-git-branch',
    command: 'git branch',
    title: 'git branch',
    topicId: 'topic-03',
    topicNumber: '03',
    topicTitle: 'Branching Basics',
    subtitle: 'List, create, rename, and delete lightweight branch pointers',
    badges: ['Beginner', 'Essential', 'Branching'],
    quote: 'Branches in Git are not heavy copies of your files; they are 41-byte movable pointers to commits.',
    difficulty: 'Beginner',

    whatIsIt:
      '`git branch` allows you to view, create, rename, and delete branches. A Git branch is an inexpensive, movable pointer to a specific commit in the history DAG, enabling isolated development without affecting the main production codebase.',
    inSimpleWords:
      'Like creating a parallel universe where you can test crazy new ideas without messing up your original world.',
    whyDoYouNeedIt:
      'Without branches, everyone works on the same linear line of code. If you start a new feature that takes 2 weeks, you cannot fix an urgent production bug without shipping your half-finished, broken feature code.',
    realWorldAnalogy:
      'Like a bookmark in a book with a label written on it. Moving the bookmark to a new page takes one second and doesn\'t require photocopying the entire book.',

    syntaxCode: 'git branch [-a] [-d <branch-name>] [<new-branch>]',
    syntaxTokens: [
      { token: 'git', role: 'VCS Executable', explanation: 'The Git command.' },
      { token: 'branch', role: 'Subcommand', explanation: 'Branch management tool.' },
      { token: '<new-branch>', role: 'Branch Name', explanation: 'The identifier for the new pointer (e.g., feature/login).' },
    ],

    actionStage: {
      before: {
        label: 'Single Main Branch',
        description: 'Only the main branch exists, pointing at commit C2.',
        workingDirectory: [{ name: 'app.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'HEAD -> main',
        historyCommits: [
          { hash: 'C2', message: 'feat: baseline app' },
          { hash: 'C1', message: 'Initial commit' },
        ],
        whatChanged: ['Single branch active.'],
        whatDidNotChange: ['No parallel work possible.'],
      },
      running: {
        label: 'Creating Feature Pointer',
        description: 'Creating the feature-auth pointer at the exact same commit C2.',
        workingDirectory: [{ name: 'app.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'git branch feature-auth',
        historyCommits: [
          { hash: 'C2', message: 'feat: baseline app (HEAD -> main, feature-auth)' },
          { hash: 'C1', message: 'Initial commit' },
        ],
        whatChanged: ['New reference file created in .git/refs/heads/feature-auth.'],
        whatDidNotChange: ['HEAD is still pointing at main. You have not switched yet.'],
      },
      after: {
        label: 'Branch Ready',
        description: 'Two independent pointers exist. You can switch to feature-auth anytime.',
        workingDirectory: [{ name: 'app.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'feature-auth created',
        historyCommits: [
          { hash: 'C2', message: 'feat: baseline app' },
          { hash: 'C1', message: 'Initial commit' },
        ],
        whatChanged: ['Parallel development path unlocked.'],
        whatDidNotChange: ['Files on disk are identical until new commits are made.'],
      },
    },

    variations: [
      {
        title: 'List all branches (local & remote)',
        syntax: 'git branch -a',
        whatItDoes: 'Lists all local branches with an asterisk next to current, plus remote tracking branches.',
        whenToUse: 'Finding branch names or seeing what branches exist on the remote server.',
        example: 'git branch -a',
      },
      {
        title: 'Safely delete a merged branch',
        syntax: 'git branch -d <branch-name>',
        whatItDoes: 'Deletes a branch only if its commits are already merged into the current branch.',
        whenToUse: 'Cleaning up feature branches after PR merge.',
        example: 'git branch -d feature/login',
      },
      {
        title: 'Force delete an unmerged branch',
        syntax: 'git branch -D <branch-name>',
        whatItDoes: 'Forces deletion of a branch even if it contains unmerged commits.',
        whenToUse: 'Discarding abandoned experiments completely.',
        example: 'git branch -D experiment-failed',
        warning: 'Commits exclusive to this branch may become dangling and garbage-collected.',
      },
    ],

    scenarios: [
      {
        id: 'sc-branch-1',
        title: 'You want to build a dark mode toggle',
        context: 'You want to write dark mode CSS, but production must stay clean for an imminent release.',
        question: 'What command creates a dedicated workspace branch?',
        options: [
          {
            label: 'Create an isolated feature branch named feature/dark-mode',
            command: 'git branch feature/dark-mode',
            isCorrect: true,
            explanation: 'Isolating feature work on a branch protects main from half-finished work.',
          },
          {
            label: 'Write the code directly on main and comment it out',
            command: 'No command',
            isCorrect: false,
            explanation: 'Commenting out code is prone to accidental release and clutters main.',
          },
        ],
      },
    ],

    commandComparisons: [
      {
        commandA: 'git branch <name>',
        commandB: 'git switch -c <name>',
        aspect: 'Switching Action',
        descriptionA: 'Creates the branch pointer, but leaves you standing on your current branch.',
        descriptionB: 'Creates the new branch AND immediately switches your working directory to it.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Creating a branch with `git branch new-feature` and editing files, thinking you are on the new branch',
        whyItHappens: '`git branch <name>` creates the branch but does NOT switch to it.',
        fix: 'Use `git switch -c <name>` or run `git switch <name>` after creating.',
      },
    ],

    sandbox: {
      initialCommands: ['git init', 'echo "base" > app.js', 'git add app.js', 'git commit -m "feat: initial base"'],
      guidedSteps: [
        { instruction: 'Create a new feature branch', command: 'git branch feature/auth', hint: 'Type git branch feature/auth' },
        { instruction: 'List all branches', command: 'git branch', hint: 'Type git branch' },
      ],
    },

    challenge: {
      title: 'Create and Inspect a Feature Branch',
      objective: 'Create a branch named `feature/login` and verify it appears in the branch list.',
      seedCommands: ['git init', 'echo "app" > app.js', 'git add app.js', 'git commit -m "feat: base app"'],
      initialFiles: { 'app.js': 'console.log("App");' },
      expectedCommands: ['git branch feature/login', 'git branch'],
      hints: ['Run `git branch feature/login`.', 'Verify with `git branch`.'],
      solutionExplanation: 'git branch creates the pointer in .git/refs/heads/ without modifying the working tree.',
      safeFailure: {
        mistakeTitle: 'Trying to delete the branch you are currently standing on',
        mistakeCommand: 'git branch -d main',
        whatHappened: 'Git refused: "error: Cannot delete branch \'main\' checked out at ..."',
        whatWasNotLost: 'Git prevents you from cutting off the branch you are standing on.',
        recoveryCommand: 'git branch',
        recoveryExplanation: 'Switch to another branch first if you ever need to delete.',
      },
    },

    reference: {
      synopsis: 'git branch [--color[=<when>] | --no-color] [-r | -a] [--list] [<pattern>...]',
      options: [
        { flag: '-a', description: 'List both remote-tracking branches and local branches.' },
        { flag: '-d', description: 'Delete a branch. The branch must be fully merged in its upstream branch.' },
        { flag: '-m', description: 'Move/rename a branch and the corresponding reflog.' },
      ],
      gitInternals: {
        objectType: 'Reference Pointer File',
        explanation: 'Stored in .git/refs/heads/<branch-name>, holding exactly 40 hex characters of a commit SHA.',
        storageLocation: '.git/refs/heads/',
      },
      edgeCases: ['Branch names cannot contain spaces, double dots (..), tildes (~), or colons (:).'],
    },
  },

  'c-git-switch': {
    id: 'c-git-switch',
    command: 'git switch',
    title: 'git switch',
    topicId: 'topic-03',
    topicNumber: '03',
    topicTitle: 'Branching Basics',
    subtitle: 'The modern, safe dedicated command for switching Git branches',
    badges: ['Beginner', 'Essential', 'Safe UX'],
    quote: 'git switch was introduced to do one single thing safely and clearly: change branches without accidentally destroying files.',
    difficulty: 'Beginner',

    whatIsIt:
      '`git switch` is a modern Git command (introduced in Git 2.23) designed specifically for navigating between branches. It replaces the overloaded legacy `git checkout` command for branch operations, eliminating the risk of accidentally overwriting uncommitted files.',
    inSimpleWords:
      'The elevator button between parallel universes. Press the button to travel to another branch; your working directory instantly morphs to match.',
    whyDoYouNeedIt:
      'Before `git switch`, developers used `git checkout` for both switching branches and discarding file edits. A single missing space or typo could permanently delete working code. `git switch` is 100% safe because it only handles branches.',
    realWorldAnalogy:
      'Like changing TV channels. Switching to channel 4 lets you watch the sports game without recording over the movie on channel 2.',

    syntaxCode: 'git switch [-c <new-branch>] <branch-name>',
    syntaxTokens: [
      { token: 'git', role: 'VCS Executable', explanation: 'The Git command.' },
      { token: 'switch', role: 'Branch Navigator', explanation: 'Moves HEAD to the target branch and updates files.' },
      { token: '-c', role: 'Create & Switch Flag', explanation: 'Creates the branch first, then switches to it immediately.' },
      { token: '<branch-name>', role: 'Destination Branch', explanation: 'The branch to navigate to.' },
    ],

    actionStage: {
      before: {
        label: 'Standing on Main',
        description: 'HEAD points to main. Working directory contains production files.',
        workingDirectory: [{ name: 'index.html', status: 'committed' }],
        stagingArea: [],
        commandPill: 'HEAD -> main',
        historyCommits: [{ hash: 'C1', message: 'Initial commit' }],
        whatChanged: ['On main branch.'],
        whatDidNotChange: ['Feature branch is waiting.'],
      },
      running: {
        label: 'Switching Context',
        description: 'Git updates HEAD to point to feature branch and refreshes files on disk.',
        workingDirectory: [{ name: 'index.html', status: 'committed' }],
        stagingArea: [],
        commandPill: 'git switch feature-payment',
        historyCommits: [{ hash: 'C1', message: 'Initial commit' }],
        whatChanged: ['HEAD now points to refs/heads/feature-payment.'],
        whatDidNotChange: ['Uncommitted changes that do not conflict are safely preserved.'],
      },
      after: {
        label: 'Active on Feature Branch',
        description: 'All new commits will now be added exclusively to feature-payment.',
        workingDirectory: [{ name: 'index.html', status: 'committed' }],
        stagingArea: [],
        commandPill: 'HEAD -> feature-payment',
        historyCommits: [{ hash: 'C1', message: 'Initial commit' }],
        whatChanged: ['Working directory reflects feature-payment.'],
        whatDidNotChange: ['Main branch remains untouched at C1.'],
      },
    },

    variations: [
      {
        title: 'Create and switch in one step',
        syntax: 'git switch -c <new-branch>',
        whatItDoes: 'Creates the branch and immediately checks it out.',
        whenToUse: 'The standard everyday command for starting new features.',
        example: 'git switch -c feature/shopping-cart',
      },
      {
        title: 'Switch back to previous branch',
        syntax: 'git switch -',
        whatItDoes: 'Switches back to whatever branch you were previously standing on.',
        whenToUse: 'Toggling rapidly between your feature branch and main.',
        example: 'git switch -',
      },
    ],

    scenarios: [
      {
        id: 'sc-switch-1',
        title: 'Switching branches with uncommitted work',
        context: 'You have edited a file on main, but realize those edits belong on a new branch.',
        question: 'How do you move those edits to a new branch safely?',
        options: [
          {
            label: 'Run git switch -c feature/new-idea; your unstaged edits travel with you',
            command: 'git switch -c feature/new-idea',
            isCorrect: true,
            explanation: 'If uncommitted edits do not conflict with the destination branch, Git safely carries them over.',
          },
          {
            label: 'Delete all files and rewrite them from scratch',
            command: 'No command',
            isCorrect: false,
            explanation: 'Git preserves your working tree modifications across compatible branch switches.',
          },
        ],
      },
    ],

    commandComparisons: [
      {
        commandA: 'git switch <branch>',
        commandB: 'git checkout <branch>',
        aspect: 'Safety & Scope',
        descriptionA: 'Only switches branches. Impossible to accidentally overwrite or discard files.',
        descriptionB: 'Legacy multi-tool that can switch branches OR overwrite files depending on syntax.',
        safeForSharedHistory: { a: true, b: false },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Using `git checkout <branch>` and making a typo that overwrites a file',
        whyItHappens: '`git checkout` does too many unrelated things.',
        fix: 'Adopt the modern standard: use `git switch` for branches and `git restore` for files.',
      },
    ],

    sandbox: {
      initialCommands: ['git init', 'echo "app" > app.js', 'git add app.js', 'git commit -m "base"'],
      guidedSteps: [
        { instruction: 'Create and switch to feature branch', command: 'git switch -c feature/ui', hint: 'Type git switch -c feature/ui' },
        { instruction: 'Switch back to main', command: 'git switch main', hint: 'Type git switch main' },
      ],
    },

    challenge: {
      title: 'Create and Navigate Branches with git switch',
      objective: 'Create and switch to `feature/profile`, then return to `main` using `git switch -`.',
      seedCommands: ['git init', 'echo "main app" > index.js', 'git add index.js', 'git commit -m "feat: init"'],
      initialFiles: { 'index.js': 'console.log("main");' },
      expectedCommands: ['git switch -c feature/profile', 'git switch main'],
      hints: ['Run `git switch -c feature/profile`.', 'Then switch back with `git switch main`.'],
      solutionExplanation: 'git switch safely updates HEAD and aligns your working directory to the target branch.',
      safeFailure: {
        mistakeTitle: 'Switching to a non-existent branch without -c',
        mistakeCommand: 'git switch nonexistent',
        whatHappened: 'Git reported "fatal: invalid reference: nonexistent".',
        whatWasNotLost: 'Zero data lost. You remained on your current branch.',
        recoveryCommand: 'git switch -c nonexistent',
        recoveryExplanation: 'Add the -c flag if you intend to create a new branch.',
      },
    },

    reference: {
      synopsis: 'git switch [<options>] [--no-guess] <branch> | git switch [<options>] --create <new-branch>',
      options: [
        { flag: '-c, --create <new-branch>', description: 'Create a new branch and switch to it.' },
        { flag: '-C, --force-create <new-branch>', description: 'Reset an existing branch to starting point and switch to it.' },
        { flag: '-', description: 'Shorthand for the previous branch checked out before current.' },
      ],
      gitInternals: {
        objectType: 'HEAD Pointer Mutation',
        explanation: 'Updates .git/HEAD file to contain "ref: refs/heads/<target-branch>".',
        storageLocation: '.git/HEAD',
      },
      edgeCases: ['Switching is blocked if uncommitted changes would be overwritten by files on target branch.'],
    },
  },

  'c-git-checkout': {
    id: 'c-git-checkout',
    command: 'git checkout',
    title: 'git checkout',
    topicId: 'topic-03',
    topicNumber: '03',
    topicTitle: 'Branching Basics',
    subtitle: 'The historic multi-purpose command for switching branches and restoring files',
    badges: ['Intermediate', 'Legacy', 'Multi-tool'],
    quote: 'Understanding git checkout is essential for reading legacy tutorials and scripts written before Git 2.23.',
    difficulty: 'Intermediate',

    whatIsIt:
      '`git checkout` is Git\'s classic multi-purpose command. Historically, it was used both to switch branches (`git checkout <branch>`) and to discard uncommitted changes in files (`git checkout -- <file>`). While modern Git introduced `git switch` and `git restore` to separate these roles, `git checkout` remains universally supported.',
    inSimpleWords:
      'A Swiss Army knife from older Git versions that could either change branches or throw away edits in a file depending on how you typed it.',
    whyDoYouNeedIt:
      'You will encounter `git checkout` in thousands of StackOverflow answers, company CI/CD scripts, and senior developer habits. Knowing how it works prevents confusion when collaborating.',
    realWorldAnalogy:
      'Like a combination key that opens both your office door and your file cabinet. Convenient, but dangerous if you turn it the wrong way.',

    syntaxCode: 'git checkout [-b <new-branch>] [<branch> | <commit>] [-- <file>]',
    syntaxTokens: [
      { token: 'git', role: 'VCS Executable', explanation: 'The Git command.' },
      { token: 'checkout', role: 'Multi-tool Command', explanation: 'Updates files in the working tree or checks out a tree.' },
      { token: '-b', role: 'Branch Creation Flag', explanation: 'Creates and checks out a new branch simultaneously.' },
      { token: '--', role: 'Disambiguation Marker', explanation: 'Tells Git the following argument is a file path, not a branch.' },
    ],

    actionStage: {
      before: {
        label: 'Inspecting Older Commit',
        description: 'Head is at C3 on main. You want to inspect how the app looked at commit C1.',
        workingDirectory: [{ name: 'app.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'HEAD -> main (C3)',
        historyCommits: [
          { hash: 'C3', message: 'Third' },
          { hash: 'C2', message: 'Second' },
          { hash: 'C1', message: 'First' },
        ],
        whatChanged: ['Standing on latest commit.'],
        whatDidNotChange: ['Earlier states are safely preserved in object store.'],
      },
      running: {
        label: 'Checking Out Specific Commit',
        description: 'Git moves HEAD directly to commit hash C1 (Detached HEAD state).',
        workingDirectory: [{ name: 'app.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'git checkout C1',
        historyCommits: [
          { hash: 'C3', message: 'Third' },
          { hash: 'C2', message: 'Second' },
          { hash: 'C1', message: 'First (HEAD)' },
        ],
        whatChanged: ['Working directory transformed to match commit C1 state.'],
        whatDidNotChange: ['Main branch still points to C3.'],
      },
      after: {
        label: 'Historical Inspection Mode',
        description: 'You can test or run old code. Return safely with git switch main.',
        workingDirectory: [{ name: 'app.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'Detached HEAD at C1',
        historyCommits: [
          { hash: 'C3', message: 'Third' },
          { hash: 'C2', message: 'Second' },
          { hash: 'C1', message: 'First' },
        ],
        whatChanged: ['Files match exact historical milestone C1.'],
        whatDidNotChange: ['No commits were destroyed.'],
      },
    },

    variations: [
      {
        title: 'Create and switch branch (legacy)',
        syntax: 'git checkout -b <new-branch>',
        whatItDoes: 'Creates a branch and checks it out (identical to `git switch -c`).',
        whenToUse: 'Ubiquitous in older tutorials and automated bash scripts.',
        example: 'git checkout -b feature/auth',
      },
      {
        title: 'Discard working tree file changes (legacy)',
        syntax: 'git checkout -- <file>',
        whatItDoes: 'Overwrites modified file with clean version from index (replaced by `git restore`).',
        whenToUse: 'Legacy habit; prefer `git restore <file>`.',
        example: 'git checkout -- index.html',
        warning: 'Uncommitted edits are permanently destroyed.',
      },
    ],

    scenarios: [
      {
        id: 'sc-checkout-1',
        title: 'Reading legacy documentation',
        context: 'A tutorial written in 2017 instructs you to run `git checkout -b v2-redesign`.',
        question: 'What is the modern equivalent of this command?',
        options: [
          {
            label: 'git switch -c v2-redesign',
            command: 'git switch -c v2-redesign',
            isCorrect: true,
            explanation: '`git switch -c` is the direct modern replacement for `git checkout -b`.',
          },
          {
            label: 'git branch v2-redesign',
            command: 'git branch v2-redesign',
            isCorrect: false,
            explanation: '`git branch` only creates the pointer; it does not switch to it.',
          },
        ],
      },
    ],

    commandComparisons: [
      {
        commandA: 'git checkout <branch>',
        commandB: 'git switch <branch>',
        aspect: 'Command Specialization',
        descriptionA: 'Overloaded legacy syntax handling both branch switching and file restoration.',
        descriptionB: 'Modern targeted command dedicated strictly to branch switching.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Accidentally discarding file edits by typing `git checkout <file>` without realizing it overwrites local code',
        whyItHappens: '`git checkout` lacks safety guardrails for file vs branch ambiguities.',
        fix: 'Always use `git restore` for files and `git switch` for branches.',
      },
    ],

    sandbox: {
      initialCommands: ['git init', 'echo "test" > file.txt', 'git add file.txt', 'git commit -m "base"'],
      guidedSteps: [
        { instruction: 'Create and switch branch using checkout', command: 'git checkout -b staging', hint: 'Type git checkout -b staging' },
        { instruction: 'Return to main', command: 'git checkout main', hint: 'Type git checkout main' },
      ],
    },

    challenge: {
      title: 'Practice Traditional Branch Switching with git checkout',
      objective: 'Create a branch named `dev-test` using `git checkout -b dev-test` and switch back.',
      seedCommands: ['git init', 'echo "code" > main.js', 'git add main.js', 'git commit -m "feat: init"'],
      initialFiles: { 'main.js': 'console.log(1);' },
      expectedCommands: ['git checkout -b dev-test', 'git checkout main'],
      hints: ['Run `git checkout -b dev-test`.', 'Return with `git checkout main`.'],
      solutionExplanation: 'git checkout remains widely used across industry tooling and legacy repositories.',
      safeFailure: {
        mistakeTitle: 'Checking out a file name that matches a branch name',
        mistakeCommand: 'git checkout test',
        whatHappened: 'Git disambiguation error if both a file and branch are named "test".',
        whatWasNotLost: 'No code was lost; Git requests you clarify with `--`.',
        recoveryCommand: 'git checkout -- test',
        recoveryExplanation: 'Use `--` to clarify you mean the file.',
      },
    },

    reference: {
      synopsis: 'git checkout [-q] [-f] [-m] [<branch>] | git checkout [-b <new-branch>] [<start-point>]',
      options: [
        { flag: '-b', description: 'Create a new branch named <new-branch> and start it at <start-point>.' },
        { flag: '-f, --force', description: 'When switching branches, proceed even if the index or working tree differs from HEAD.' },
      ],
      gitInternals: {
        objectType: 'Dual-Role Executor',
        explanation: 'Modifies either .git/HEAD or updates working tree blobs from index/tree.',
        storageLocation: '.git/',
      },
      edgeCases: ['Ambiguous names require `git checkout <branch> --` vs `git checkout -- <file>`.'],
    },
  },

  'c-git-merge-basic': {
    id: 'c-git-merge-basic',
    command: 'git merge',
    title: 'git merge',
    topicId: 'topic-03',
    topicNumber: '03',
    topicTitle: 'Branching Basics',
    subtitle: 'Reuniting parallel universes: combining branch histories together',
    badges: ['Beginner', 'Essential', 'Integration'],
    quote: 'Branching is how developers work in isolation; merging is how teams integrate into unity.',
    difficulty: 'Beginner',

    whatIsIt:
      '`git merge` incorporates changes from one or more branches into your current active branch. Depending on the commit graph, Git performs either a Fast-Forward (simply advancing the pointer forward) or a 3-way Merge (creating a new merge commit that ties both parent histories together).',
    inSimpleWords:
      'Pouring two rivers back into one big river. All the new features and bug fixes built on your feature branch flow directly into the main project.',
    whyDoYouNeedIt:
      'Features built on isolated branches must eventually be deployed to production. `git merge` is the fundamental tool for integrating tested code into main.',
    realWorldAnalogy:
      'Like two authors writing different chapters of a book simultaneously, then binding both chapters together into the finished published volume.',

    syntaxCode: 'git merge [--no-ff] [--ff-only] <branch-to-merge>',
    syntaxTokens: [
      { token: 'git', role: 'VCS Executable', explanation: 'The Git command.' },
      { token: 'merge', role: 'Integration Subcommand', explanation: 'Joins another branch into current branch.' },
      { token: '<branch-to-merge>', role: 'Source Branch', explanation: 'The feature branch whose changes will be integrated.' },
    ],

    actionStage: {
      before: {
        label: 'Divergent Realities',
        description: 'Main is at C2. The feature branch is at C3 with new code ready to integrate.',
        workingDirectory: [{ name: 'feature.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'Standing on main',
        historyCommits: [
          { hash: 'C3', message: 'feat: add user authentication (feature)' },
          { hash: 'C2', message: 'feat: baseline app (HEAD -> main)' },
          { hash: 'C1', message: 'Initial commit' },
        ],
        whatChanged: ['Feature branch has commits not yet in main.'],
        whatDidNotChange: ['Main has not incorporated feature code yet.'],
      },
      running: {
        label: 'Executing Merge',
        description: 'Git identifies common ancestor C2, combines files, and advances main to C3.',
        workingDirectory: [{ name: 'feature.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'git merge feature',
        historyCommits: [
          { hash: 'C3', message: 'feat: add user authentication (HEAD -> main, feature)' },
          { hash: 'C2', message: 'feat: baseline app' },
          { hash: 'C1', message: 'Initial commit' },
        ],
        whatChanged: ['Main branch pointer updated to include commit C3.'],
        whatDidNotChange: ['Feature branch pointer remains intact.'],
      },
      after: {
        label: 'Integrated Codebase',
        description: 'Main now contains all changes from the feature branch. Ready for deployment.',
        workingDirectory: [{ name: 'feature.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'Fast-forward merge complete',
        historyCommits: [
          { hash: 'C3', message: 'feat: add user authentication (HEAD -> main)' },
          { hash: 'C2', message: 'feat: baseline app' },
          { hash: 'C1', message: 'Initial commit' },
        ],
        whatChanged: ['Main is now fully up to date.'],
        whatDidNotChange: ['Historical authorship and commit timestamps are preserved.'],
      },
    },

    variations: [
      {
        title: 'Force explicit merge commit (no fast-forward)',
        syntax: 'git merge --no-ff <branch>',
        whatItDoes: 'Always creates a dedicated merge commit, preserving the visual branch bubble in git log.',
        whenToUse: 'Tracking when large feature milestones were merged into release branches.',
        example: 'git merge --no-ff feature/payment',
      },
      {
        title: 'Fast-forward only (safe guard)',
        syntax: 'git merge --ff-only <branch>',
        whatItDoes: 'Refuses to merge if a 3-way merge commit would be required.',
        whenToUse: 'Pulling upstream updates without creating unwanted merge bubbles.',
        example: 'git merge --ff-only origin/main',
      },
      {
        title: 'Abort an in-progress merge',
        syntax: 'git merge --abort',
        whatItDoes: 'Restores working directory and index back to the exact pre-merge state.',
        whenToUse: 'When unexpected merge conflicts occur and you want to cleanly back out.',
        example: 'git merge --abort',
      },
    ],

    scenarios: [
      {
        id: 'sc-merge-1',
        title: 'Feature is tested and ready for production',
        context: 'You finished `feature/search`. You are currently on `main`.',
        question: 'How do you bring `feature/search` into `main`?',
        options: [
          {
            label: 'Run `git merge feature/search` while standing on `main`',
            command: 'git merge feature/search',
            isCorrect: true,
            explanation: 'Always stand on the receiving destination branch (main), then merge the source branch into it.',
          },
          {
            label: 'Switch to feature/search and run git merge main',
            command: 'git switch feature/search && git merge main',
            isCorrect: false,
            explanation: 'That brings main into your feature branch, not the other way around!',
          },
        ],
      },
    ],

    commandComparisons: [
      {
        commandA: 'git merge',
        commandB: 'git rebase',
        aspect: 'History Shape',
        descriptionA: 'Non-destructive: preserves complete original commit graph and timestamps exactly as they happened.',
        descriptionB: 'Linear rewriting: replays commits on top of base branch, creating new commit hashes.',
        safeForSharedHistory: { a: true, b: false },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Running `git merge main` when you intended to merge your feature into main',
        whyItHappens: 'Forgetting which branch you are currently standing on.',
        fix: 'Remember the golden rule: "Stand on the branch you want to update (git switch main), then call git merge <source>".',
      },
    ],

    sandbox: {
      initialCommands: [
        'git init',
        'echo "main code" > app.js',
        'git add app.js',
        'git commit -m "feat: initial"',
        'git branch feature',
        'git switch feature',
        'echo "feature code" > feature.js',
        'git add feature.js',
        'git commit -m "feat: new feature"',
        'git switch main',
      ],
      guidedSteps: [
        { instruction: 'Merge feature branch into main', command: 'git merge feature', hint: 'Type git merge feature' },
        { instruction: 'Verify merged history', command: 'git log --oneline', hint: 'Type git log --oneline' },
      ],
    },

    challenge: {
      title: 'Integrate a Feature Branch into Main',
      objective: 'Merge the `feature` branch into `main` and verify that the commit graph includes the new code.',
      seedCommands: [
        'git init',
        'echo "v1" > app.js',
        'git add app.js',
        'git commit -m "feat: init"',
        'git branch feature',
        'git switch feature',
        'echo "nav" > nav.js',
        'git add nav.js',
        'git commit -m "feat: add navigation"',
        'git switch main',
      ],
      initialFiles: { 'app.js': 'console.log("v1");' },
      expectedCommands: ['git merge feature'],
      hints: ['Make sure you are on `main` (`git status`).', 'Run `git merge feature`.'],
      solutionExplanation: 'git merge combines independent lines of development into your active branch.',
      safeFailure: {
        mistakeTitle: 'Merging while having uncommitted dirty changes',
        mistakeCommand: 'echo "dirty" > app.js && git merge feature',
        whatHappened: 'Git refused: "error: Your local changes to the following files would be overwritten by merge".',
        whatWasNotLost: 'Git protects your uncommitted work and cancels the merge cleanly.',
        recoveryCommand: 'git restore app.js && git merge feature',
        recoveryExplanation: 'Commit or stash changes before merging.',
      },
    },

    reference: {
      synopsis: 'git merge [-n] [--stat] [--no-commit] [--squash] [--[no-]edit] [--no-ff] <commit>...',
      options: [
        { flag: '--no-ff', description: 'Create a merge commit even when the merge resolves as a fast-forward.' },
        { flag: '--ff-only', description: 'Refuse to merge unless the current HEAD is already up to date or the merge can be resolved as a fast-forward.' },
        { flag: '--abort', description: 'Abort the current conflict resolution process, and try to reconstruct the pre-merge state.' },
      ],
      gitInternals: {
        objectType: 'Merge Commit Object',
        explanation: 'Contains two parent SHAs: parent 1 (current HEAD) and parent 2 (merged branch tip).',
        storageLocation: '.git/objects/',
      },
      edgeCases: ['Conflicting edits on the same lines will pause the merge and prompt for manual conflict resolution.'],
    },
  },

  'c-detached-head': {
    id: 'c-detached-head',
    command: 'HEAD pointer',
    title: 'Understanding HEAD & Detached HEAD',
    topicId: 'topic-03',
    topicNumber: '03',
    topicTitle: 'Branching Basics',
    subtitle: 'Where you stand in history: navigating commits directly without a branch',
    badges: ['Intermediate', 'Internals', 'Pointers'],
    quote: 'HEAD is your "YOU ARE HERE" pin on the Git map. When it points directly to a commit instead of a branch, you are in Detached HEAD.',
    difficulty: 'Intermediate',

    whatIsIt:
      '`HEAD` is the special Git pointer that determines what commit is currently checked out in your working directory. Normally, HEAD points to a branch name (symbolic ref). But when you check out a specific commit hash, tag, or remote branch directly, HEAD points directly to that commit: this state is known as **Detached HEAD**.',
    inSimpleWords:
      'Normally you hold onto a branch handle while walking through history. In "Detached HEAD", you let go of the handle and step directly onto an old stone in the river.',
    whyDoYouNeedIt:
      'Detached HEAD is not an error! It is Git\'s built-in time machine mode. It allows you to compile, run tests, and inspect code from any historical point in time without having to create a throwaway branch.',
    realWorldAnalogy:
      'Like entering "Replay Mode" in a racing video game. You can watch any past lap from any camera angle. If you decide you want to start racing from that point, you just create a branch!',

    syntaxCode: 'git checkout <commit-sha>',
    syntaxTokens: [
      { token: 'git', role: 'VCS Executable', explanation: 'The Git command.' },
      { token: 'checkout', role: 'Pointer Movement', explanation: 'Moves HEAD to the designated target.' },
      { token: '<commit-sha>', role: 'Direct Commit Target', explanation: 'The 40-character (or 7-character short) hexadecimal hash of the historical commit.' },
    ],

    actionStage: {
      before: {
        label: 'Attached HEAD (Normal)',
        description: 'HEAD points to the main branch pointer. Normal working state.',
        workingDirectory: [{ name: 'app.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'HEAD -> refs/heads/main',
        historyCommits: [
          { hash: 'C3', message: 'Current latest commit (HEAD -> main)' },
          { hash: 'C2', message: 'Bug fix milestone' },
          { hash: 'C1', message: 'Initial project release' },
        ],
        whatChanged: ['HEAD is safely attached to branch main.'],
        whatDidNotChange: ['Commits move the main pointer automatically.'],
      },
      running: {
        label: 'Entering Detached HEAD',
        description: 'Checking out commit C1 directly. HEAD detaches from main and points straight at C1.',
        workingDirectory: [{ name: 'app.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'git checkout C1',
        historyCommits: [
          { hash: 'C3', message: 'Current latest commit (main)' },
          { hash: 'C2', message: 'Bug fix milestone' },
          { hash: 'C1', message: 'Initial project release (HEAD)' },
        ],
        whatChanged: ['Working directory rolls back to match commit C1.'],
        whatDidNotChange: ['Main branch still safely points to C3.'],
      },
      after: {
        label: 'Detached HEAD Active',
        description: 'You can test or debug. To save new work made here, run git switch -c new-feature.',
        workingDirectory: [{ name: 'app.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'HEAD detached at C1',
        historyCommits: [
          { hash: 'C3', message: 'Current latest commit (main)' },
          { hash: 'C2', message: 'Bug fix milestone' },
          { hash: 'C1', message: 'Initial project release (HEAD)' },
        ],
        whatChanged: ['You can inspect historical bugs without side effects.'],
        whatDidNotChange: ['Return to safety anytime with git switch main.'],
      },
    },

    variations: [
      {
        title: 'Save work from a detached HEAD',
        syntax: 'git switch -c <new-branch-name>',
        whatItDoes: 'Attaches a new branch pointer to your current detached commit, preserving your work forever.',
        whenToUse: 'When you did experimental commits while in detached HEAD and want to keep them.',
        example: 'git switch -c rescue-experiment',
      },
      {
        title: 'Return safely to current branch',
        syntax: 'git switch main',
        whatItDoes: 'Exits detached HEAD mode and returns to the tip of main.',
        whenToUse: 'Finished inspecting historical code.',
        example: 'git switch main',
      },
    ],

    scenarios: [
      {
        id: 'sc-detached-1',
        title: 'You see the famous "You are in \'detached HEAD\' state" warning',
        context: 'You checked out an older commit to test an old bug. Git displays a large terminal warning.',
        question: 'Is your repository broken or corrupted?',
        options: [
          {
            label: 'No, this is completely normal; Git is informing you that new commits will not belong to any branch unless you create one',
            command: 'git status',
            isCorrect: true,
            explanation: 'Detached HEAD simply means HEAD points to a commit hash rather than a named branch ref.',
          },
          {
            label: 'Yes, your repository has suffered catastrophic file corruption',
            command: 'No command',
            isCorrect: false,
            explanation: 'Detached HEAD is an intentional, core feature of Git.',
          },
        ],
      },
    ],

    commandComparisons: [
      {
        commandA: 'Attached HEAD',
        commandB: 'Detached HEAD',
        aspect: 'Pointer Target',
        descriptionA: '.git/HEAD contains "ref: refs/heads/main". New commits advance the branch pointer.',
        descriptionB: '.git/HEAD contains a raw commit hash (e.g. "9a3f81e..."). New commits have no branch pointer.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Making 10 commits in detached HEAD, switching back to main, and thinking your work vanished',
        whyItHappens: 'Without a branch pointer, commits become unreachable from branch tips.',
        fix: 'Run `git reflog` to find the commit hash, then `git branch save-work <hash>` to recover.',
      },
    ],

    sandbox: {
      initialCommands: [
        'git init',
        'echo "v1" > app.js',
        'git add app.js',
        'git commit -m "feat: release 1"',
        'echo "v2" > app.js',
        'git commit -am "feat: release 2"',
      ],
      guidedSteps: [
        { instruction: 'Inspect commit history', command: 'git log --oneline', hint: 'Type git log --oneline' },
        { instruction: 'Return to main branch', command: 'git switch main', hint: 'Type git switch main' },
      ],
    },

    challenge: {
      title: 'Inspect Detached HEAD and Return Safely',
      objective: 'Check repository status, observe HEAD location, and return to main safely.',
      seedCommands: [
        'git init',
        'echo "C1" > file.txt',
        'git add file.txt',
        'git commit -m "C1"',
        'echo "C2" > file.txt',
        'git commit -am "C2"',
      ],
      initialFiles: { 'file.txt': 'C2' },
      expectedCommands: ['git status', 'git switch main'],
      hints: ['Run `git status` to observe your active HEAD pointer.', 'Run `git switch main` to ensure you are attached.'],
      solutionExplanation: 'HEAD is the master viewfinder in Git. Understanding where it points resolves 90% of beginner confusion.',
      safeFailure: {
        mistakeTitle: 'Checking out a commit that does not exist',
        mistakeCommand: 'git checkout deadbeef',
        whatHappened: 'Git reported: "error: pathspec \'deadbeef\' did not match any file(s) known to git".',
        whatWasNotLost: 'HEAD was not moved. Your position is safe.',
        recoveryCommand: 'git status',
        recoveryExplanation: 'Run git status to confirm your current branch.',
      },
    },

    reference: {
      synopsis: 'git checkout <commit-ish> | git switch --detach <commit-ish>',
      options: [
        { flag: '--detach', description: 'Explicitly switch to commit in detached state with git switch.' },
      ],
      gitInternals: {
        objectType: 'Pointer Reference File',
        explanation: '.git/HEAD file contents change from "ref: refs/heads/..." to a 40-char commit SHA.',
        storageLocation: '.git/HEAD',
      },
      edgeCases: ['Unreachable commits in detached HEAD are cleaned up by git gc after 30 days.'],
    },
  },
};
