/* Scenarios Extended */
import { UniversalConcept } from '../unifiedAcademyData';

export const TOPIC_04_CONCEPTS: Record<string, UniversalConcept> = {
  'c-git-remote': {
    id: 'c-git-remote',
    command: 'git remote',
    title: 'git remote',
    topicId: 'topic-04',
    topicNumber: '04',
    topicTitle: 'Basic Collaboration',
    subtitle: 'Manage bookmarks to remote repository servers (origin, upstream)',
    badges: ['Beginner', 'Collaboration', 'Networking'],
    quote: 'A remote in Git is just a friendly bookmark nickname pointing to a server URL.',
    difficulty: 'Beginner',

    whatIsIt:
      '`git remote` manages the set of tracked remote repositories. Remote repositories are versions of your project that are hosted on the Internet (such as GitHub, GitLab, or Bitbucket) or network somewhere, giving your local repository endpoints to push commits to and fetch updates from.',
    inSimpleWords:
      'Like saving a contact\'s phone number in your phone. Instead of typing the long URL `https://github.com/company/super-long-repo-name.git` every time, you give it the nickname `origin`.',
    whyDoYouNeedIt:
      'Without remote pointers, your repository cannot communicate with external servers. Connecting a remote is what enables team members to share commits, review Pull Requests, and trigger automated deployment pipelines.',
    realWorldAnalogy:
      'Like a speed-dial button on your telephone. Button 1 is labeled "Home Office" (origin). Whenever you press it, your phone automatically dials the full international phone number.',

    syntaxCode: 'git remote add <name> <url>',
    syntaxTokens: [
      { token: 'git', role: 'VCS Executable', explanation: 'The Git command line tool.' },
      { token: 'remote', role: 'Subcommand', explanation: 'Manages tracked remote repository servers.' },
      { token: 'add', role: 'Action', explanation: 'Adds a new remote nickname and URL pair.' },
      { token: '<name>', role: 'Nickname', explanation: 'Short handle for the server (typically "origin" or "upstream").' },
      { token: '<url>', role: 'Server URL', explanation: 'HTTPS or SSH address of the remote repository.' },
    ],

    actionStage: {
      before: {
        label: 'Isolated Local Repo',
        description: 'Repository exists only on your computer. No remotes configured.',
        workingDirectory: [{ name: 'main.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'No Remotes Configured',
        historyCommits: [{ hash: 'C1', message: 'Initial commit' }],
        whatChanged: ['Local commits only.'],
        whatDidNotChange: ['No remote connection defined.'],
      },
      running: {
        label: 'Adding Remote Handle',
        description: 'Binding the nickname "origin" to your GitHub repository URL.',
        workingDirectory: [{ name: 'main.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'git remote add origin https://...',
        historyCommits: [{ hash: 'C1', message: 'Initial commit' }],
        whatChanged: ['.git/config updated with [remote "origin"] section.'],
        whatDidNotChange: ['No network traffic sent yet; this is purely configuration.'],
      },
      after: {
        label: 'Connected to Cloud',
        description: 'Local repository is ready to push and pull from GitHub.',
        workingDirectory: [{ name: 'main.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'origin -> https://github.com/...',
        historyCommits: [{ hash: 'C1', message: 'Initial commit' }],
        whatChanged: ['origin nickname active and verified.'],
        whatDidNotChange: ['Commits on GitHub have not changed until you push.'],
      },
    },

    variations: [
      {
        title: 'View remotes with URLs',
        syntax: 'git remote -v',
        whatItDoes: 'Lists all configured remote handles along with their fetch and push URLs.',
        whenToUse: 'Verifying what server your repository is currently linked to.',
        example: 'git remote -v',
      },
      {
        title: 'Rename a remote',
        syntax: 'git remote rename <old-name> <new-name>',
        whatItDoes: 'Changes the nickname of a configured remote server.',
        whenToUse: 'Correcting typos or adjusting naming conventions.',
        example: 'git remote rename origin upstream',
      },
      {
        title: 'Change remote URL',
        syntax: 'git remote set-url <name> <new-url>',
        whatItDoes: 'Updates the URL of an existing remote (e.g. switching from HTTPS to SSH).',
        whenToUse: 'Switching repository locations or authentication protocols.',
        example: 'git remote set-url origin git@github.com:org/repo.git',
      },
    ],

    scenarios: [
      {
        id: 'sc-remote-1',
        title: 'Switching authentication from HTTPS to SSH',
        context: 'You generated a new SSH key and want Git to stop asking for personal access tokens on push.',
        question: 'Which command updates the origin remote to use your SSH address?',
        options: [
          {
            label: 'git remote set-url origin git@github.com:user/repo.git',
            command: 'git remote set-url origin git@github.com:user/repo.git',
            isCorrect: true,
            explanation: '`set-url` modifies the existing origin pointer to the SSH address without losing tracking branches.',
          },
          {
            label: 'Delete the entire project folder and clone again',
            command: 'No command',
            isCorrect: false,
            explanation: 'Re-cloning is unnecessary and risks losing unpushed local branches.',
          },
        ],
      },
    ],

    commandComparisons: [
      {
        commandA: 'git remote add <name> <url>',
        commandB: 'git clone <url>',
        aspect: 'Remote Connection Method',
        descriptionA: 'Manually links an existing local repository to an online host without modifying local code.',
        descriptionB: 'Copies a complete remote repository from the cloud, creating the directory and linking origin automatically.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],
    commonMistakes: [
      {
        mistake: 'Thinking `origin` is a special Git keyword or magical server',
        whyItHappens: 'Git uses "origin" as the default name when you clone.',
        fix: 'Remember "origin" is just a convention. You could name it "github", "backup", or "server".',
      },
    ],

    sandbox: {
      initialCommands: ['git init', 'echo "app" > app.js', 'git add app.js', 'git commit -m "init"'],
      guidedSteps: [
        { instruction: 'Add a remote nickname', command: 'git remote add origin https://github.com/demo/repo.git', hint: 'Type git remote add origin https://github.com/demo/repo.git' },
        { instruction: 'Inspect configured remotes', command: 'git remote -v', hint: 'Type git remote -v' },
      ],
    },

    challenge: {
      title: 'Configure and Verify a Remote Repository',
      objective: 'Add a remote named `origin` pointing to `https://github.com/acme/project.git` and verify with `git remote -v`.',
      seedCommands: ['git init', 'echo "test" > file.txt', 'git add file.txt', 'git commit -m "feat: init"'],
      initialFiles: { 'file.txt': 'test' },
      expectedCommands: [
        'git remote add origin https://github.com/acme/project.git',
        'git remote -v',
      ],
      hints: ['Run `git remote add origin https://github.com/acme/project.git`.', 'Run `git remote -v` to inspect.'],
      solutionExplanation: 'git remote writes endpoint addresses to .git/config under [remote "name"].',
      safeFailure: {
        mistakeTitle: 'Adding a remote that already exists',
        mistakeCommand: 'git remote add origin https://github.com/other/repo.git',
        whatHappened: 'Git reported: "error: remote origin already exists".',
        whatWasNotLost: 'Existing remote configuration was not overwritten.',
        recoveryCommand: 'git remote -v',
        recoveryExplanation: 'Use `git remote set-url origin <new-url>` if you want to update it.',
      },
    },

    reference: {
      synopsis: 'git remote [-v | --verbose] | git remote add [-t <branch>] <name> <url>',
      options: [
        { flag: '-v, --verbose', description: 'Be a little more verbose and show remote url after name.' },
      ],
      gitInternals: {
        objectType: 'Config Entry',
        explanation: 'Stored under [remote "origin"] in .git/config with url and fetch refspec.',
        storageLocation: '.git/config',
      },
      edgeCases: ['You can have multiple remotes configured simultaneously (e.g. origin and upstream for open source forks).'],
    },
  },

  'c-git-push': {
    id: 'c-git-push',
    command: 'git push',
    title: 'git push',
    topicId: 'topic-04',
    topicNumber: '04',
    topicTitle: 'Basic Collaboration',
    subtitle: 'Publishing local commits to remote servers and tracking branches',
    badges: ['Beginner', 'Essential', 'Networking'],
    quote: 'git commit saves your work to your computer; git push shares your work with the world.',
    difficulty: 'Beginner',

    whatIsIt:
      '`git push` uploads your local repository commits and reference pointers to a remote repository. It transfers the cryptographic commit objects, trees, and blobs that exist locally but are missing on the remote server, updating the remote branch tip.',
    inSimpleWords:
      'Sending your saved work to the cloud so your teammates can see it and your deployment server can run it.',
    whyDoYouNeedIt:
      'Until you run `git push`, your commits only exist on your physical laptop. If your computer breaks, unpushed commits are lost. Pushing backs up your work and allows team collaboration.',
    realWorldAnalogy:
      'Like clicking "Upload" or "Send" on an email draft. Writing the email is `git commit`; actually hitting send is `git push`.',

    syntaxCode: 'git push [-u] [<remote>] [<branch>]',
    syntaxTokens: [
      { token: 'git', role: 'VCS Executable', explanation: 'The Git command.' },
      { token: 'push', role: 'Upload Command', explanation: 'Transfers commits to the remote repository.' },
      { token: '-u', role: 'Set Upstream Flag', explanation: 'Links local branch to remote branch for future shorthand `git push`.' },
      { token: 'origin', role: 'Remote Target', explanation: 'The remote server nickname.' },
      { token: 'main', role: 'Target Branch', explanation: 'The branch on the remote server to update.' },
    ],

    actionStage: {
      before: {
        label: 'Local Commits Unpushed',
        description: 'You made commit C2 locally. The remote server only has commit C1.',
        workingDirectory: [{ name: 'app.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'main (ahead of origin/main by 1 commit)',
        historyCommits: [
          { hash: 'C2', message: 'feat: add dark mode (HEAD -> main)', isNew: true },
          { hash: 'C1', message: 'Initial commit (origin/main)' },
        ],
        whatChanged: ['Local branch is 1 commit ahead.'],
        whatDidNotChange: ['Remote server has not received C2 yet.'],
      },
      running: {
        label: 'Transmitting Packfile',
        description: 'Compressing and uploading commit C2 object over HTTPS/SSH network stream.',
        workingDirectory: [{ name: 'app.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'git push -u origin main',
        historyCommits: [
          { hash: 'C2', message: 'feat: add dark mode' },
          { hash: 'C1', message: 'Initial commit' },
        ],
        whatChanged: ['Writing objects: 100% (3/3), done. Remote branch main updated.'],
        whatDidNotChange: ['Working tree files are unmodified.'],
      },
      after: {
        label: 'Synchronized with Cloud',
        description: 'Local and remote pointers are identical at commit C2.',
        workingDirectory: [{ name: 'app.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'HEAD -> main, origin/main',
        historyCommits: [
          { hash: 'C2', message: 'feat: add dark mode (HEAD -> main, origin/main)' },
          { hash: 'C1', message: 'Initial commit' },
        ],
        whatChanged: ['origin/main pointer moved forward to C2.'],
        whatDidNotChange: ['Your local branch is completely clean and up to date.'],
      },
    },

    variations: [
      {
        title: 'Set upstream tracking branch',
        syntax: 'git push -u origin <branch>',
        whatItDoes: 'Uploads branch and configures future `git push` and `git pull` to work with no arguments.',
        whenToUse: 'The very first time you push a newly created local branch.',
        example: 'git push -u origin feature/login',
      },
      {
        title: 'Delete a remote branch',
        syntax: 'git push origin --delete <branch>',
        whatItDoes: 'Deletes the branch on the remote server.',
        whenToUse: 'Cleaning up remote branches after Pull Request merge.',
        example: 'git push origin --delete feature/login',
      },
      {
        title: 'Force push with lease (safer force)',
        syntax: 'git push --force-with-lease',
        whatItDoes: 'Forces update only if no one else has pushed commits to the remote branch since your last fetch.',
        whenToUse: 'Pushing rebased feature branches safely without overwriting teammates.',
        example: 'git push --force-with-lease',
        warning: 'Standard `git push --force` can overwrite teammates\' work blindly.',
      },
    ],

    scenarios: [
      {
        id: 'sc-push-1',
        title: 'Push rejected: non-fast-forward',
        context: 'A teammate pushed a commit to main while you were coding. Git rejects your push with "[rejected - non-fast-forward]".',
        question: 'What is the correct way to proceed?',
        options: [
          {
            label: 'Run git pull (or git pull --rebase) to incorporate your teammate\'s commits, then push again',
            command: 'git pull --rebase origin main && git push origin main',
            isCorrect: true,
            explanation: 'Git protects shared history by requiring you to incorporate upstream work before pushing.',
          },
          {
            label: 'Use git push --force to overwrite your teammate\'s commits',
            command: 'git push --force origin main',
            isCorrect: false,
            explanation: 'Force pushing to shared branches destroys teammates\' commits and causes major team disruption.',
          },
        ],
      },
    ],

    commandComparisons: [
      {
        commandA: 'git push',
        commandB: 'git commit',
        aspect: 'Storage Location',
        descriptionA: 'Network operation: sends commit objects to remote cloud server (GitHub).',
        descriptionB: 'Local operation: saves snapshot to your local computer (.git/objects). Zero network.',
        safeForSharedHistory: { a: false, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Pushing sensitive API keys, passwords, or .env files to public GitHub repositories',
        whyItHappens: 'Forgetting to add secrets to `.gitignore` before committing.',
        fix: 'Never commit secrets. If pushed, immediately revoke/rotate the compromised secret credentials.',
      },
    ],

    sandbox: {
      initialCommands: [
        'git init',
        'echo "v1" > app.js',
        'git add app.js',
        'git commit -m "feat: init"',
        'git remote add origin https://github.com/acme/app.git',
      ],
      guidedSteps: [
        { instruction: 'Check unpushed status', command: 'git status', hint: 'Type git status' },
        { instruction: 'Push to remote branch', command: 'git push origin main', hint: 'Type git push origin main' },
      ],
    },

    challenge: {
      title: 'Publish Commits to Remote with git push',
      objective: 'Run git push to synchronize your local commits with the remote tracking branch.',
      seedCommands: [
        'git init',
        'echo "code" > index.js',
        'git add index.js',
        'git commit -m "feat: first release"',
        'git remote add origin https://github.com/acme/project.git',
      ],
      initialFiles: { 'index.js': 'console.log("Ready");' },
      expectedCommands: ['git push origin main'],
      hints: ['Run `git push origin main`.'],
      solutionExplanation: 'git push transmits local commit objects and moves remote branch pointers forward.',
      safeFailure: {
        mistakeTitle: 'Pushing to a non-existent remote nickname',
        mistakeCommand: 'git push upstream main',
        whatHappened: 'Git reported: "fatal: \'upstream\' does not appear to be a git repository".',
        whatWasNotLost: 'Your local commits are 100% safe.',
        recoveryCommand: 'git push origin main',
        recoveryExplanation: 'Check `git remote -v` to see your configured remote nicknames.',
      },
    },

    reference: {
      synopsis: 'git push [--all | --branches | --mirror | --tags] [--follow-tags] [-u | --set-upstream] [<repository> [<refspec>...]]',
      options: [
        { flag: '-u, --set-upstream', description: 'For every branch that is up to date or successfully pushed, add upstream (tracking) reference.' },
        { flag: '--force-with-lease', description: 'Refuse to update a remote ref unless its current value matches what we expect.' },
        { flag: '--tags', description: 'All refs under refs/tags are pushed, in addition to refspecs explicitly listed.' },
      ],
      gitInternals: {
        objectType: 'Network Packfile Transfer',
        explanation: 'Generates an efficient delta-compressed packfile sent over smart HTTP/SSH protocols.',
        storageLocation: '.git/refs/remotes/origin/',
      },
      edgeCases: ['Force pushing to protected branches on GitHub is blocked by server-side rulesets.'],
    },
  },

  'c-git-fetch': {
    id: 'c-git-fetch',
    command: 'git fetch',
    title: 'git fetch',
    topicId: 'topic-04',
    topicNumber: '04',
    topicTitle: 'Basic Collaboration',
    subtitle: 'Safe surveillance: download remote commits without modifying working files',
    badges: ['Intermediate', 'Collaboration', 'Safe Inspection'],
    quote: 'git fetch is pure inspection: it downloads what the team did without touching a single file on your desk.',
    difficulty: 'Intermediate',

    whatIsIt:
      '`git fetch` downloads commits, files, and refs from a remote repository into your local repository database, updating remote-tracking branches (like `origin/main`). Crucially, `git fetch` **never modifies your working directory files** or alters your local branches.',
    inSimpleWords:
      'Like looking out the window to see if your package arrived on the porch, without opening the front door or dragging the box inside yet.',
    whyDoYouNeedIt:
      '`git pull` immediately merges remote changes into your active files, which can cause unexpected merge conflicts while you are in the middle of writing code. `git fetch` is the safe professional alternative: see what changed first, review with `git diff`, and merge when you are ready.',
    realWorldAnalogy:
      'Like downloading incoming emails to your inbox list. You can see the email subjects and sender names without being forced to stop what you are currently typing.',

    syntaxCode: 'git fetch [<remote>] [<branch>]',
    syntaxTokens: [
      { token: 'git', role: 'VCS Executable', explanation: 'The Git command.' },
      { token: 'fetch', role: 'Download Command', explanation: 'Fetches remote objects and updates remote-tracking branches.' },
      { token: 'origin', role: 'Remote Target', explanation: 'The remote repository to fetch from (defaults to origin).' },
    ],

    actionStage: {
      before: {
        label: 'Unaware of Teammate Work',
        description: 'A teammate pushed commit C3 to GitHub. Your computer is still at commit C2.',
        workingDirectory: [{ name: 'app.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'HEAD -> main at C2',
        historyCommits: [
          { hash: 'C2', message: 'Your local commit' },
          { hash: 'C1', message: 'Initial commit' },
        ],
        whatChanged: ['Local state only.'],
        whatDidNotChange: ['Teammate\'s C3 is on GitHub, but unknown locally.'],
      },
      running: {
        label: 'Fetching Remote Objects',
        description: 'Git contacts GitHub, downloads commit C3 into .git/objects, and updates origin/main.',
        workingDirectory: [{ name: 'app.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'git fetch origin',
        historyCommits: [
          { hash: 'C3', message: 'Teammate commit (origin/main)', isNew: true },
          { hash: 'C2', message: 'Your local commit (HEAD -> main)' },
          { hash: 'C1', message: 'Initial commit' },
        ],
        whatChanged: ['origin/main pointer advanced to C3.'],
        whatDidNotChange: ['Your local main branch and working directory files are 100% untouched.'],
      },
      after: {
        label: 'Informed & Safe',
        description: 'You can now run `git log main..origin/main` or `git diff` to inspect teammate work safely.',
        workingDirectory: [{ name: 'app.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'origin/main updated safely',
        historyCommits: [
          { hash: 'C3', message: 'Teammate commit (origin/main)' },
          { hash: 'C2', message: 'Your local commit (HEAD -> main)' },
          { hash: 'C1', message: 'Initial commit' },
        ],
        whatChanged: ['You now know exactly what changes exist on the server.'],
        whatDidNotChange: ['Zero merge conflicts triggered.'],
      },
    },

    variations: [
      {
        title: 'Fetch and prune deleted branches',
        syntax: 'git fetch --prune',
        whatItDoes: 'Deletes local remote-tracking branches (like origin/old-feature) that were deleted on GitHub.',
        whenToUse: 'Regular maintenance to clean up stale branch clutter.',
        example: 'git fetch -p',
      },
      {
        title: 'Fetch all remotes',
        syntax: 'git fetch --all',
        whatItDoes: 'Fetches updates from every configured remote server (e.g. origin and upstream).',
        whenToUse: 'Open source development with multi-remote forks.',
        example: 'git fetch --all',
      },
    ],

    scenarios: [
      {
        id: 'sc-fetch-1',
        title: 'Checking if teammates pushed code without risking conflicts',
        context: 'You are in the middle of debugging a fragile function. You want to see if your coworker pushed a fix.',
        question: 'Should you run git pull or git fetch?',
        options: [
          {
            label: 'Run git fetch; it downloads their commits without touching your active files',
            command: 'git fetch origin',
            isCorrect: true,
            explanation: '`git fetch` is safe and read-only with respect to your working directory.',
          },
          {
            label: 'Run git pull; it will automatically overwrite your uncommitted edits',
            command: 'git pull',
            isCorrect: false,
            explanation: '`git pull` attempts an automatic merge, which can fail with merge conflicts while you are working.',
          },
        ],
      },
    ],

    commandComparisons: [
      {
        commandA: 'git fetch',
        commandB: 'git pull',
        aspect: 'Working Directory Impact',
        descriptionA: '100% Safe: only updates .git database and origin/* pointers. Working directory is untouched.',
        descriptionB: 'Modifies Working Directory: runs `git fetch` followed immediately by `git merge`.',
        safeForSharedHistory: { a: true, b: false },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Running `git fetch` and wondering why your code files did not change',
        whyItHappens: 'Forgetting that fetch only downloads objects; you must run `git merge` or `git pull` to apply them.',
        fix: 'Run `git merge origin/main` after fetch when you are ready to integrate.',
      },
    ],

    sandbox: {
      initialCommands: [
        'git init',
        'echo "v1" > app.js',
        'git add app.js',
        'git commit -m "feat: init"',
        'git remote add origin https://github.com/acme/app.git',
      ],
      guidedSteps: [
        { instruction: 'Fetch latest remote references', command: 'git fetch origin', hint: 'Type git fetch origin' },
        { instruction: 'Compare local vs remote branches', command: 'git status', hint: 'Type git status' },
      ],
    },

    challenge: {
      title: 'Perform Safe Remote Surveillance with git fetch',
      objective: 'Run `git fetch` to download remote updates without altering your active working tree files.',
      seedCommands: [
        'git init',
        'echo "local code" > main.js',
        'git add main.js',
        'git commit -m "feat: base"',
        'git remote add origin https://github.com/acme/project.git',
      ],
      initialFiles: { 'main.js': 'console.log("local");' },
      expectedCommands: ['git fetch origin'],
      hints: ['Run `git fetch origin`.'],
      solutionExplanation: 'git fetch safely synchronizes remote tracking branches without touching active working files.',
      safeFailure: {
        mistakeTitle: 'Fetching from an invalid remote URL',
        mistakeCommand: 'git fetch invalid-remote',
        whatHappened: 'Git reported: "fatal: \'invalid-remote\' does not appear to be a git repository".',
        whatWasNotLost: 'Your local repository is completely unaffected.',
        recoveryCommand: 'git fetch origin',
        recoveryExplanation: 'Fetch from the configured origin remote.',
      },
    },

    reference: {
      synopsis: 'git fetch [<options>] [<repository> [<refspec>...]]',
      options: [
        { flag: '-p, --prune', description: 'Before fetching, remove any remote-tracking references that no longer exist on the remote.' },
        { flag: '--all', description: 'Fetch all remotes.' },
      ],
      gitInternals: {
        objectType: 'Remote-Tracking Reference',
        explanation: 'Updates .git/refs/remotes/<remote>/<branch> files.',
        storageLocation: '.git/refs/remotes/',
      },
      edgeCases: ['Tag fetching behavior can be configured via `remote.<name>.tagOpt`.'],
    },
  },

  'c-git-pull': {
    id: 'c-git-pull',
    command: 'git pull',
    title: 'git pull',
    topicId: 'topic-04',
    topicNumber: '04',
    topicTitle: 'Basic Collaboration',
    subtitle: 'Fetch + Merge in one step: bringing remote changes directly into your branch',
    badges: ['Beginner', 'Essential', 'Sync'],
    quote: 'git pull is simply git fetch followed immediately by git merge.',
    difficulty: 'Beginner',

    whatIsIt:
      '`git pull` incorporates changes from a remote repository into your current local branch. In its default mode, `git pull` is shorthand for running `git fetch` to download remote commits, followed immediately by `git merge FETCH_HEAD` to integrate those commits into your working files.',
    inSimpleWords:
      'The "Download and Update" button. It grabs whatever your teammates pushed to GitHub and merges it straight into your code.',
    whyDoYouNeedIt:
      'Software is built in teams. Before you start writing code in the morning, and before you push in the evening, you run `git pull` to ensure you are building on top of the latest team progress.',
    realWorldAnalogy:
      'Like updating a Google Doc with changes made by your co-author while you were away from your desk.',

    syntaxCode: 'git pull [--rebase] [<remote>] [<branch>]',
    syntaxTokens: [
      { token: 'git', role: 'VCS Executable', explanation: 'The Git command.' },
      { token: 'pull', role: 'Sync Command', explanation: 'Fetches remote commits and merges them into current branch.' },
      { token: '--rebase', role: 'Workflow Flag', explanation: 'Replays local commits on top of incoming commits instead of creating a merge commit.' },
      { token: 'origin', role: 'Remote Target', explanation: 'The remote server nickname.' },
      { token: 'main', role: 'Source Branch', explanation: 'The branch to pull from.' },
    ],

    actionStage: {
      before: {
        label: 'Local Behind Remote',
        description: 'GitHub has commit C2 (shipped by teammate). Your local branch is still at C1.',
        workingDirectory: [{ name: 'navbar.js', status: 'untracked' }],
        stagingArea: [],
        commandPill: 'Behind origin/main by 1 commit',
        historyCommits: [{ hash: 'C1', message: 'Initial commit (HEAD -> main)' }],
        whatChanged: ['Local branch is out of date.'],
        whatDidNotChange: ['Teammate code is not on your laptop yet.'],
      },
      running: {
        label: 'Fetching & Fast-Forwarding',
        description: 'Git downloads commit C2 and fast-forwards your local main branch.',
        workingDirectory: [{ name: 'navbar.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'git pull origin main',
        historyCommits: [
          { hash: 'C2', message: 'feat: add navbar (HEAD -> main, origin/main)', isNew: true },
          { hash: 'C1', message: 'Initial commit' },
        ],
        whatChanged: ['navbar.js written to disk in working directory.'],
        whatDidNotChange: ['No manual conflict resolution needed.'],
      },
      after: {
        label: 'Fully Synchronized',
        description: 'Your local branch, working directory, and remote tracking branch are all at C2.',
        workingDirectory: [{ name: 'navbar.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'Up to date with origin/main',
        historyCommits: [
          { hash: 'C2', message: 'feat: add navbar (HEAD -> main, origin/main)' },
          { hash: 'C1', message: 'Initial commit' },
        ],
        whatChanged: ['You have the latest teammate changes ready for development.'],
        whatDidNotChange: ['Historical authorship is accurately attributed.'],
      },
    },

    variations: [
      {
        title: 'Pull with rebase (clean linear history)',
        syntax: 'git pull --rebase origin <branch>',
        whatItDoes: 'Replays your local unpushed commits on top of incoming remote commits, avoiding messy merge bubbles.',
        whenToUse: 'Industry best practice for keeping branch histories clean and readable.',
        example: 'git pull --rebase origin main',
      },
      {
        title: 'Configure rebase as default pull behavior',
        syntax: 'git config --global pull.rebase true',
        whatItDoes: 'Configures Git to always rebase on pull automatically.',
        whenToUse: 'Recommended default for modern developer workstations.',
        example: 'git config --global pull.rebase true',
      },
    ],

    scenarios: [
      {
        id: 'sc-pull-1',
        title: 'Morning routine before starting feature development',
        context: 'You open your laptop on Monday morning and want to write new code on main.',
        question: 'What command should you run before creating your feature branch?',
        options: [
          {
            label: 'git switch main && git pull',
            command: 'git switch main && git pull',
            isCorrect: true,
            explanation: 'Always pull the latest team changes before branching to avoid starting with stale code.',
          },
          {
            label: 'Immediately start coding without pulling',
            command: 'No command',
            isCorrect: false,
            explanation: 'Starting on stale code guarantees painful merge conflicts when you try to merge later.',
          },
        ],
      },
    ],

    commandComparisons: [
      {
        commandA: 'git pull',
        commandB: 'git pull --rebase',
        aspect: 'History Structure',
        descriptionA: 'Creates a 3-way merge commit if local and remote have diverged.',
        descriptionB: 'Replays local commits on top of incoming commits, creating a linear history with zero merge commits.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Running `git pull` with uncommitted changes in your working directory',
        whyItHappens: 'Forgetting to stash or commit local edits before pulling.',
        fix: 'Run `git stash` to set aside work, run `git pull`, then `git stash pop`.',
      },
    ],

    sandbox: {
      initialCommands: [
        'git init',
        'echo "v1" > app.js',
        'git add app.js',
        'git commit -m "feat: init"',
        'git remote add origin https://github.com/acme/app.git',
      ],
      guidedSteps: [
        { instruction: 'Pull latest changes from remote', command: 'git pull origin main', hint: 'Type git pull origin main' },
      ],
    },

    challenge: {
      title: 'Synchronize Local Code with git pull',
      objective: 'Execute `git pull origin main` to sync your repository with upstream changes.',
      seedCommands: [
        'git init',
        'echo "init" > app.js',
        'git add app.js',
        'git commit -m "feat: base"',
        'git remote add origin https://github.com/acme/project.git',
      ],
      initialFiles: { 'app.js': 'console.log("init");' },
      expectedCommands: ['git pull origin main'],
      hints: ['Run `git pull origin main`.'],
      solutionExplanation: 'git pull fetches and merges upstream progress in a single command.',
      safeFailure: {
        mistakeTitle: 'Pulling with conflicting uncommitted local files',
        mistakeCommand: 'echo "conflict" > app.js && git pull origin main',
        whatHappened: 'Git stopped: "error: Your local changes to the following files would be overwritten by merge".',
        whatWasNotLost: 'Your uncommitted edits were not destroyed.',
        recoveryCommand: 'git stash && git pull origin main',
        recoveryExplanation: 'Stash dirty edits before pulling.',
      },
    },

    reference: {
      synopsis: 'git pull [<options>] [<repository> [<refspec>...]]',
      options: [
        { flag: '-r, --rebase', description: 'When true, rebase the current branch on top of the upstream branch after fetching.' },
        { flag: '--no-commit', description: 'Perform the merge but pretend the user halted the commit.' },
      ],
      gitInternals: {
        objectType: 'Composite Command',
        explanation: 'Invokes git-fetch followed by git-merge with FETCH_HEAD.',
        storageLocation: '.git/FETCH_HEAD',
      },
      edgeCases: ['Git 2.27+ warns if pull.rebase is unset when pulling diverged branches.'],
    },
  },

  'c-git-clone': {
    id: 'c-git-clone',
    command: 'git clone',
    title: 'git clone',
    topicId: 'topic-04',
    topicNumber: '04',
    topicTitle: 'Basic Collaboration',
    subtitle: 'Onboarding to a project: cloning full repositories from the internet',
    badges: ['Beginner', 'Essential', 'Onboarding'],
    quote: 'git clone is how every developer enters an existing codebase for the first time.',
    difficulty: 'Beginner',

    whatIsIt:
      '`git clone` copies an existing Git repository from a remote location (like GitHub) to a new directory on your local machine. It creates remote-tracking branches for each branch in the cloned repository, sets up `origin` pointing to the cloned URL, and checks out the default branch.',
    inSimpleWords:
      'Downloading a complete copy of an open source project or company codebase, including every file and every historical version since day 1.',
    whyDoYouNeedIt:
      'When you start a new job or contribute to an open-source project (like React, VS Code, or Linux), `git clone` is the very first command you run to get the codebase running on your computer.',
    realWorldAnalogy:
      'Like downloading a complete, functional digital twin of a factory onto your workstation so you can start manufacturing parts immediately.',

    syntaxCode: 'git clone [--depth 1] <repository-url> [<target-directory>]',
    syntaxTokens: [
      { token: 'git', role: 'VCS Executable', explanation: 'The Git command line program.' },
      { token: 'clone', role: 'Replication Command', explanation: 'Clones repository into a new directory.' },
      { token: '<url>', role: 'Remote URL', explanation: 'HTTPS or SSH address of the target repository.' },
      { token: '[<directory>]', role: 'Optional Folder Name', explanation: 'Custom folder name to create locally (defaults to repo name).' },
    ],

    actionStage: {
      before: {
        label: 'Empty Workstation',
        description: 'You have a fresh laptop with no company code files.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Empty Local Disk',
        historyCommits: [],
        whatChanged: ['No local project files exist.'],
        whatDidNotChange: ['GitHub hosts the full repository.'],
      },
      running: {
        label: 'Cloning Repository',
        description: 'Downloading objects, unpackaging trees, and resolving deltas.',
        workingDirectory: [
          { name: 'package.json', status: 'untracked' },
          { name: 'src/index.ts', status: 'untracked' },
        ],
        stagingArea: [],
        commandPill: 'git clone https://...',
        historyCommits: [{ hash: 'C100', message: 'Release v2.4.0' }],
        whatChanged: ['Cloned 100% of objects, created .git, checked out default branch.'],
        whatDidNotChange: ['Remote repository is untouched.'],
      },
      after: {
        label: 'Fully Functional Local Project',
        description: 'You can immediately start editing, testing, running npm install, and committing.',
        workingDirectory: [
          { name: 'package.json', status: 'committed' },
          { name: 'src/index.ts', status: 'committed' },
        ],
        stagingArea: [],
        commandPill: 'Ready to Code',
        historyCommits: [{ hash: 'C100', message: 'Release v2.4.0 (HEAD -> main, origin/main)' }],
        whatChanged: ['Complete repository and working tree ready.'],
        whatDidNotChange: ['No remote permissions required just to read and run code.'],
      },
    },

    variations: [
      {
        title: 'Shallow clone for fast CI builds',
        syntax: 'git clone --depth 1 <url>',
        whatItDoes: 'Truncates historical commits to only the latest 1, saving 90% download bandwidth.',
        whenToUse: 'CI/CD deployment pipelines, automated test workers, and Docker images.',
        example: 'git clone --depth 1 https://github.com/facebook/react.git',
      },
      {
        title: 'Clone with submodules recursively',
        syntax: 'git clone --recurse-submodules <url>',
        whatItDoes: 'Clones the parent repo and automatically clones all nested submodules inside it.',
        whenToUse: 'Projects that depend on external submodule libraries.',
        example: 'git clone --recurse-submodules https://github.com/godotengine/godot.git',
      },
      {
        title: 'Clone specific single branch',
        syntax: 'git clone -b <branch-name> --single-branch <url>',
        whatItDoes: 'Clones only the history of the specified branch.',
        whenToUse: 'Working on massive multi-gigabyte repositories.',
        example: 'git clone -b develop --single-branch https://github.com/org/mono.git',
      },
    ],

    scenarios: [
      {
        id: 'sc-clone-1',
        title: 'HTTPS vs SSH Clone URLs',
        context: 'GitHub provides two clone URLs: HTTPS (`https://github.com/...`) and SSH (`git@github.com:...`).',
        question: 'Which URL format is best if you have configured SSH keys?',
        options: [
          {
            label: 'SSH URL (`git@github.com:...`); authenticates automatically via cryptographic keys with no password prompts',
            command: 'git clone git@github.com:org/project.git',
            isCorrect: true,
            explanation: 'SSH keys provide seamless, automated authentication for pushing and pulling.',
          },
          {
            label: 'Neither; Git only allows downloading ZIP files',
            command: 'No command',
            isCorrect: false,
            explanation: 'Downloading ZIP files strips away the `.git` directory, losing all version control capability.',
          },
        ],
      },
    ],

    commandComparisons: [
      {
        commandA: 'git clone <url>',
        commandB: 'Download ZIP from GitHub',
        aspect: 'Version Control Capability',
        descriptionA: 'Creates a full Git repository with complete history, branch tracking, and push/pull ability.',
        descriptionB: 'Downloads only a static archive of files. No Git history, no branches, no commit capability.',
        safeForSharedHistory: { a: true, b: false },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Cloning a repository inside an existing Git repository',
        whyItHappens: 'Not checking your current folder (`pwd`) before running `git clone`.',
        fix: 'Always clone projects into a dedicated workspace folder (e.g. `~/Developer` or `~/Projects`).',
      },
    ],

    sandbox: {
      initialCommands: [
        'git init',
        'echo "cloned repo mock" > README.md',
        'git add README.md',
        'git commit -m "feat: cloned project"',
      ],
      guidedSteps: [
        { instruction: 'Inspect cloned repository status', command: 'git status', hint: 'Type git status' },
        { instruction: 'Inspect commit history', command: 'git log --oneline', hint: 'Type git log --oneline' },
      ],
    },

    challenge: {
      title: 'Inspect a Cloned Repository Environment',
      objective: 'Verify repository status and inspect cloned commit history.',
      seedCommands: [
        'git init',
        'echo "console.log(\'cloned\');" > index.js',
        'git add index.js',
        'git commit -m "feat: initial cloned repo commit"',
      ],
      initialFiles: { 'index.js': 'console.log("cloned");' },
      expectedCommands: ['git status', 'git log --oneline'],
      hints: ['Run `git status`.', 'Run `git log --oneline`.'],
      solutionExplanation: 'git clone sets up a complete self-contained Git repository locally.',
      safeFailure: {
        mistakeTitle: 'Cloning into a folder that already exists and contains files',
        mistakeCommand: 'git clone https://... .',
        whatHappened: 'Git stopped: "fatal: destination path \'.\' already exists and is not an empty directory".',
        whatWasNotLost: 'Existing files were protected from overwrite.',
        recoveryCommand: 'git status',
        recoveryExplanation: 'Clone into a new, empty directory.',
      },
    },

    reference: {
      synopsis: 'git clone [--template=<template-directory>] [-l] [-s] [--no-hardlinks] [-q] [-n] [--bare] [--mirror] [-o <name>] [-b <name>] [-u <upload-pack>] [--reference <repository>] [--dissociate] [--separate-git-dir <git-dir>] [--depth <depth>] [--[no-]single-branch] [--no-tags] [--recurse-submodules[=<pathspec>]] [--[no-]shallow-submodules] [--[no-]remote-submodules] [--jobs <n>] [--sparse] [--[no-]reject-shallow] [--filter=<filter>] [--also-filter-submodules]] [--] <repository> [<directory>]',
      options: [
        { flag: '--depth <depth>', description: 'Create a shallow clone with a history truncated to the specified number of commits.' },
        { flag: '--recurse-submodules', description: 'After the clone is created, initialize and clone submodules within.' },
        { flag: '-b <name>', description: 'Instead of pointing the newly created HEAD to the branch pointed to by the cloned repository\'s HEAD, point to <name> branch instead.' },
      ],
      gitInternals: {
        objectType: 'Full Repository Replication',
        explanation: 'Transfers packs, sets up remote origin, creates .git/refs/remotes/origin/HEAD, checks out default branch.',
        storageLocation: '<directory>/.git/',
      },
      edgeCases: ['Private repositories require authenticated credentials (SSH key or GitHub Personal Access Token).'],
    },
  },
};
