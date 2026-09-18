/* Variations Extended */
import { UniversalConcept } from '../unifiedAcademyData';

export const TOPIC_01_CONCEPTS: Record<string, UniversalConcept> = {
  'c-what-is-vcs': {
    id: 'c-what-is-vcs',
    command: 'git concepts',
    title: 'What is Version Control?',
    topicId: 'topic-01',
    topicNumber: '01',
    topicTitle: 'Learn the Basics',
    subtitle: 'Tracking code history, milestones, and intent over time',
    badges: ['Beginner', 'Foundations', 'Mental Model'],
    quote: 'Version control is the time machine and collective memory of software engineering.',
    difficulty: 'Beginner',

    whatIsIt:
      'Version Control is a category of software tools that records changes made to files over time so you can recall specific versions later, compare differences, and collaborate without overwriting teammates\' work.',
    inSimpleWords:
      'Imagine an infinite undo button combined with a detailed diary that remembers who changed what line of code, when they did it, and exactly why.',
    whyDoYouNeedIt:
      'Without version control, developers resort to chaotic folder names like "project_final_v2_final_FINAL". A single bug can ruin days of work, and two developers editing the same file end up overwriting each other.',
    realWorldAnalogy:
      'Like an architect\'s blueprint archive. Every blueprint revision is stamped with the architect\'s seal, date, and reason for change, so anyone can inspect how the skyscraper evolved from the foundation.',

    syntaxCode: 'git --version',
    syntaxTokens: [
      { token: 'git', role: 'Version Control System', explanation: 'The command line interface for Git.' },
      { token: '--version', role: 'Information Flag', explanation: 'Queries the installed version of Git binary.' },
    ],

    actionStage: {
      before: {
        label: 'Unmanaged Files',
        description: 'Files exist on disk with no tracking history or safety net.',
        workingDirectory: [
          { name: 'main.js', status: 'untracked' },
          { name: 'index.html', status: 'untracked' },
        ],
        stagingArea: [],
        commandPill: 'Manual Editing',
        historyCommits: [],
        whatChanged: ['Files created on computer disk.'],
        whatDidNotChange: ['No snapshots exist. Deleting a file loses it forever.'],
      },
      running: {
        label: 'Activating VCS',
        description: 'Initializing Git records baseline timestamps and checksums.',
        workingDirectory: [
          { name: 'main.js', status: 'untracked' },
          { name: 'index.html', status: 'untracked' },
        ],
        stagingArea: [],
        commandPill: 'git init',
        historyCommits: [],
        whatChanged: ['Git metadata directory created (.git).'],
        whatDidNotChange: ['Your source code files are untouched.'],
      },
      after: {
        label: 'Version-Controlled Repo',
        description: 'Your project is now protected with complete audit logging.',
        workingDirectory: [
          { name: 'main.js', status: 'committed' },
          { name: 'index.html', status: 'committed' },
        ],
        stagingArea: [],
        commandPill: 'Initial Snapshot Saved',
        historyCommits: [{ hash: 'C1', message: 'Initial project foundation', isNew: true }],
        whatChanged: ['Permanent milestone C1 recorded in local database.'],
        whatDidNotChange: ['Remote cloud servers are not touched until you push.'],
      },
    },

    variations: [
      {
        title: 'Local VCS',
        syntax: 'rcs / sccs',
        whatItDoes: 'Simple database kept on a single local computer disk.',
        whenToUse: 'Historical interest; replaced by modern distributed systems.',
        example: 'ci -u file.c',
      },
      {
        title: 'Centralized VCS (CVCS)',
        syntax: 'svn checkout https://server/repo',
        whatItDoes: 'A single central server holds all versions; clients check out single revisions.',
        whenToUse: 'Legacy enterprise systems or massive binary art assets.',
        example: 'svn commit -m "Update level graphics"',
        warning: 'If the central server goes down, no developer can commit or view history.',
      },
      {
        title: 'Distributed VCS (DVCS)',
        syntax: 'git clone <url>',
        whatItDoes: 'Every developer has a full, independent clone of the complete repository history.',
        whenToUse: 'Modern standard for 99% of global software engineering.',
        example: 'git clone https://github.com/facebook/react.git',
      },
    ],

    scenarios: [
      {
        id: 'sc-vcs-intro-1',
        title: 'Your hard drive crashes while coding',
        context: 'You worked for 3 weeks on a mobile application. Your laptop hardware unexpectedly dies.',
        question: 'How does modern Distributed Version Control save your work?',
        options: [
          {
            label: 'Your teammates and remote hosts have full historical mirrors of the repo',
            command: 'git clone <remote-url>',
            isCorrect: true,
            explanation: 'In Git, every clone is a complete backup of the entire repository history DAG.',
          },
          {
            label: 'Git automatically repairs broken physical computer disks',
            command: 'No command',
            isCorrect: false,
            explanation: 'Git is software, not hardware data recovery.',
          },
        ],
      },
    ],

    commandComparisons: [
      {
        commandA: 'Distributed (Git)',
        commandB: 'Centralized (SVN)',
        aspect: 'Offline Capability',
        descriptionA: '100% functional offline: commits, branches, diffs, and logs work on an airplane.',
        descriptionB: 'Requires constant connection to server to commit or view commit logs.',
        safeForSharedHistory: { a: true, b: false },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Thinking Git requires an active internet connection to track files',
        whyItHappens: 'Confusing Git (the offline tool) with GitHub (the online website).',
        fix: 'Remember Git works entirely on your local machine. You only need internet to push or pull.',
      },
    ],

    sandbox: {
      initialCommands: ['git init', 'echo "Hello Version Control" > README.md'],
      guidedSteps: [
        { instruction: 'Check Git installation and version', command: 'git --version', hint: 'Type git --version' },
        { instruction: 'Inspect repository status', command: 'git status', hint: 'Type git status' },
      ],
    },

    challenge: {
      title: 'Verify Your Local Git Environment',
      objective: 'Check your Git installation version and inspect the local working directory status.',
      seedCommands: ['git init', 'echo "CommitForge Academy" > project.txt'],
      initialFiles: { 'project.txt': 'CommitForge Academy' },
      expectedCommands: ['git --version', 'git status'],
      hints: ['Type `git --version` to query Git.', 'Run `git status` to inspect files.'],
      solutionExplanation: 'Git operates as a local binary executable communicating with local metadata directories.',
      safeFailure: {
        mistakeTitle: 'Running arbitrary non-Git commands',
        mistakeCommand: 'git whatever',
        whatHappened: 'Git returned an unrecognized sub-command error.',
        whatWasNotLost: 'Your filesystem and repository remain completely unharmed.',
        recoveryCommand: 'git --help',
        recoveryExplanation: 'Run `git --help` to view valid commands.',
      },
    },

    reference: {
      synopsis: 'git [--version] [--help] <command> [<args>]',
      options: [
        { flag: '--version', description: 'Prints the Git suite version that the tool was built with.' },
        { flag: '--help', description: 'Displays manual pages and command summaries.' },
      ],
      gitInternals: {
        objectType: 'Executable Binary',
        explanation: 'Git is written in high-performance C, managing content-addressable storage.',
        storageLocation: 'System PATH executable',
      },
      edgeCases: ['Path casing on Windows (case-insensitive) vs Linux (case-sensitive).'],
    },
  },

  'c-why-use-vcs': {
    id: 'c-why-use-vcs',
    command: 'git concepts',
    title: 'Why use Version Control?',
    topicId: 'topic-01',
    topicNumber: '01',
    topicTitle: 'Learn the Basics',
    subtitle: 'Audit trails, fear-free experimentation, and seamless collaboration',
    badges: ['Beginner', 'Foundations', 'Workflow'],
    quote: 'The greatest freedom in programming is being able to break things without fear of losing working code.',
    difficulty: 'Beginner',

    whatIsIt:
      'Version Control provides five foundational superpowers to engineering teams: complete historical auditing, non-destructive experimentation, effortless rollback of bugs, concurrent collaboration, and context-rich documentation of every architectural decision.',
    inSimpleWords:
      'It lets you experiment boldly. If something breaks, you jump back to a working version in two seconds instead of panicking.',
    whyDoYouNeedIt:
      'Without VCS, teams suffer from merge overwrites, cannot identify when or why a bug was introduced, and waste hundreds of hours manually syncing code over email, Slack, or USB drives.',
    realWorldAnalogy:
      'Like video game save slots. Before fighting a difficult boss, you save your progress. If your character dies, you reload your exact checkpoint instantly instead of restarting the entire game from level 1.',

    syntaxCode: 'git log --oneline',
    syntaxTokens: [
      { token: 'git', role: 'VCS Tool', explanation: 'The Git executable.' },
      { token: 'log', role: 'Audit Command', explanation: 'Queries the historical commit journal.' },
      { token: '--oneline', role: 'Format Flag', explanation: 'Condenses each historical milestone to a single readable line.' },
    ],

    actionStage: {
      before: {
        label: 'Risky Experiment',
        description: 'You want to rewrite the database query system, but fear breaking the live web app.',
        workingDirectory: [{ name: 'database.js', status: 'modified' }],
        stagingArea: [],
        commandPill: 'Pre-experiment Checkpoint',
        historyCommits: [{ hash: 'C1', message: 'Stable v1.0 release' }],
        whatChanged: ['Stable state is securely saved in history.'],
        whatDidNotChange: ['Experimental code is not yet committed.'],
      },
      running: {
        label: 'Experiment Fails',
        description: 'Your experiment introduces syntax errors and crashes the test suite.',
        workingDirectory: [{ name: 'database.js', status: 'modified' }],
        stagingArea: [],
        commandPill: 'git restore database.js',
        historyCommits: [{ hash: 'C1', message: 'Stable v1.0 release' }],
        whatChanged: ['Restoring pulls the clean snapshot from the repository.'],
        whatDidNotChange: ['The historical record C1 was never altered.'],
      },
      after: {
        label: 'Restored to Working State',
        description: 'Within milliseconds, working directory is reverted to the pristine milestone.',
        workingDirectory: [{ name: 'database.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'Instant Clean Recovery',
        historyCommits: [{ hash: 'C1', message: 'Stable v1.0 release' }],
        whatChanged: ['All broken experiment changes discarded safely.'],
        whatDidNotChange: ['Zero risk to customer uptime.'],
      },
    },

    variations: [
      {
        title: 'Trace who wrote a line',
        syntax: 'git blame <file>',
        whatItDoes: 'Shows the author, timestamp, and commit SHA for every single line of a file.',
        whenToUse: 'When you encounter weird legacy code and need to understand the original intent.',
        example: 'git blame src/auth.ts',
      },
      {
        title: 'Search commit history messages',
        syntax: 'git log --grep="<keyword>"',
        whatItDoes: 'Filters history to only commits mentioning specific issue tickets or keywords.',
        whenToUse: 'Locating when a specific feature or bug was shipped.',
        example: 'git log --grep="JIRA-4021"',
      },
    ],

    scenarios: [
      {
        id: 'sc-why-vcs-1',
        title: 'Production regression reported by QA',
        context: 'A payment button that worked yesterday is suddenly throwing errors today.',
        question: 'How does version control help identify what went wrong?',
        options: [
          {
            label: 'Run git diff or git bisect between yesterday and today to see the exact code delta',
            command: 'git diff HEAD~5..HEAD',
            isCorrect: true,
            explanation: 'Git pinpoints the exact 3-line change that broke the payment flow, and who authored it.',
          },
          {
            label: 'Rewrite the whole payment system from scratch',
            command: 'No command',
            isCorrect: false,
            explanation: 'Rewriting code is slow and introduces even more bugs.',
          },
        ],
      },
    ],

    commandComparisons: [
      {
        commandA: 'git log --oneline',
        commandB: 'Manual folder copies (v1, v2_final)',
        aspect: 'History Tracking & Auditing',
        descriptionA: 'Cryptographically hashed timeline of milestones with precise line diffs and author attribution.',
        descriptionB: 'Cluttered duplicate folders on disk with no tracking of what lines changed or why.',
        safeForSharedHistory: { a: true, b: false },
      },
    ],
    commonMistakes: [
      {
        mistake: 'Waiting until an entire multi-day project is finished before making your first commit',
        whyItHappens: 'Assuming commits are only for final public releases.',
        fix: 'Commit small, logical, working increments frequently so you can roll back anytime without losing days of effort.',
      },
    ],

    sandbox: {
      initialCommands: ['git init', 'echo "v1 working" > app.js', 'git add app.js', 'git commit -m "feat: stable base"'],
      guidedSteps: [
        { instruction: 'View the commit journal', command: 'git log --oneline', hint: 'Type git log --oneline' },
      ],
    },

    challenge: {
      title: 'Inspect the Project Commit Journal',
      objective: 'Query the project history using git log to confirm version control tracking is active.',
      seedCommands: ['git init', 'echo "v1" > app.js', 'git add app.js', 'git commit -m "feat: stable app base"'],
      initialFiles: { 'app.js': 'console.log("v1");' },
      expectedCommands: ['git log --oneline', 'git status'],
      hints: ['Run `git log --oneline` to see the commit journal.'],
      solutionExplanation: 'Git log provides the transparent audit trail that distinguishes professional engineering.',
      safeFailure: {
        mistakeTitle: 'Deleting working tree file thinking it is lost',
        mistakeCommand: 'rm app.js',
        whatHappened: 'The working directory file was removed.',
        whatWasNotLost: 'The file is safe in Git history! Run git restore app.js to bring it back.',
        recoveryCommand: 'git restore app.js',
        recoveryExplanation: 'Git restore extracts the committed file from history back to disk.',
      },
    },

    reference: {
      synopsis: 'git log [<options>] [<revision-range>]',
      options: [
        { flag: '--oneline', description: 'Condenses output to SHA and message.' },
        { flag: '--stat', description: 'Includes diff statistics per commit.' },
      ],
      gitInternals: {
        objectType: 'Commit History DAG',
        explanation: 'Directed Acyclic Graph linking parent commit hashes cryptographically.',
        storageLocation: '.git/logs/ and .git/objects/',
      },
      edgeCases: ['Shallow clones (git clone --depth 1) only contain the most recent commit.'],
    },
  },

  'c-git-vs-other-vcs': {
    id: 'c-git-vs-other-vcs',
    command: 'git vs svn',
    title: 'Git vs Other VCS',
    topicId: 'topic-01',
    topicNumber: '01',
    topicTitle: 'Learn the Basics',
    subtitle: 'Understanding Distributed (Git) vs Centralized (SVN, Perforce)',
    badges: ['Beginner', 'Architecture', 'Comparison'],
    quote: 'In Git, your local computer is a first-class repository, not just a fragile checkout client.',
    difficulty: 'Beginner',

    whatIsIt:
      'Git is a Distributed Version Control System (DVCS). Unlike centralized tools (like Subversion, TFVC, or Perforce) where developers check out slices from a single server, Git gives every user a complete, autonomous clone containing all files, branches, and historical commits.',
    inSimpleWords:
      'In older tools, if the central server went down or you lost Wi-Fi, you could not save your work. With Git, your laptop has the entire library of history right inside the project folder.',
    whyDoYouNeedIt:
      'Distributed architecture enables blazing-fast local branching, offline productivity, cryptographic integrity via SHA hashes, and zero single points of failure.',
    realWorldAnalogy:
      'Centralized VCS is like renting a single textbook from the library; you can only read it while the library is open. Git is like having your own personal digital photocopy of every book in the library on your laptop.',

    syntaxCode: 'git clone https://github.com/torvalds/linux.git',
    syntaxTokens: [
      { token: 'git', role: 'VCS Tool', explanation: 'The Git executable.' },
      { token: 'clone', role: 'Replication Command', explanation: 'Downloads the entire remote repository and all commit history.' },
      { token: '<url>', role: 'Remote Target', explanation: 'The network address of the upstream repository.' },
    ],

    actionStage: {
      before: {
        label: 'Single Central Server (Old Style)',
        description: 'All history lives on one central server. Local machines only have a single checked-out copy.',
        workingDirectory: [{ name: 'code.c', status: 'modified' }],
        stagingArea: [],
        commandPill: 'Centralized SVN Model',
        historyCommits: [],
        whatChanged: ['No local history. Offline commits are impossible.'],
        whatDidNotChange: ['Client must query remote server for any log.'],
      },
      running: {
        label: 'Cloning Full Git DAG',
        description: 'Git mirrors every commit, branch, and tag from remote to local disk.',
        workingDirectory: [{ name: 'code.c', status: 'untracked' }],
        stagingArea: [],
        commandPill: 'git clone <url>',
        historyCommits: [{ hash: 'C1', message: 'First' }, { hash: 'C2', message: 'Second' }],
        whatChanged: ['Entire historical DAG downloaded locally in seconds.'],
        whatDidNotChange: ['Remote server repository is unaffected.'],
      },
      after: {
        label: 'Autonomous Local Repo',
        description: 'Local repo is 100% self-sufficient. Commits, branch switching, and diffs run instantly offline.',
        workingDirectory: [{ name: 'code.c', status: 'committed' }],
        stagingArea: [],
        commandPill: 'Offline Distributed Freedom',
        historyCommits: [{ hash: 'C1', message: 'First' }, { hash: 'C2', message: 'Second' }],
        whatChanged: ['Full local database initialized under .git.'],
        whatDidNotChange: ['Changes are purely local until you choose to push.'],
      },
    },

    variations: [
      {
        title: 'Shallow Clone (Save Bandwidth)',
        syntax: 'git clone --depth 1 <url>',
        whatItDoes: 'Clones only the most recent commit, saving gigabytes of historical downloads for CI/CD.',
        whenToUse: 'Fast deployment pipelines and Docker container builds.',
        example: 'git clone --depth 1 https://github.com/vercel/next.js.git',
      },
      {
        title: 'Bare Repository (Server-Side)',
        syntax: 'git clone --bare <url>',
        whatItDoes: 'Creates a server-only repository without a working directory for developers to edit files.',
        whenToUse: 'Hosting a central Git server or backup mirror.',
        example: 'git clone --bare project.git',
      },
    ],

    scenarios: [
      {
        id: 'sc-git-vs-vcs-1',
        title: 'Working on an airplane with no Wi-Fi',
        context: 'You are on a 10-hour flight without internet access and need to make 6 commits across 2 branches.',
        question: 'Will Git permit you to branch and commit while offline?',
        options: [
          {
            label: 'Yes, Git is completely distributed; all commits and branch switches work 100% offline',
            command: 'git branch feature && git commit -m "offline progress"',
            isCorrect: true,
            explanation: 'Git requires zero internet access to commit, branch, view logs, or inspect diffs.',
          },
          {
            label: 'No, Git requires a connection to GitHub to assign commit IDs',
            command: 'No command',
            isCorrect: false,
            explanation: 'Commit IDs are calculated locally using cryptographic SHA-1/SHA-256 hashes.',
          },
        ],
      },
    ],

    commandComparisons: [
      {
        commandA: 'Git',
        commandB: 'Perforce / Helix Core',
        aspect: 'Large Game Assets (100GB+ Binaries)',
        descriptionA: 'Git stores full snapshots; large binary art requires Git LFS extension.',
        descriptionB: 'Perforce excels at locking massive binary 3D art files on a central server.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Assuming someone else can see your commits before you run `git push`',
        whyItHappens: 'Forgetting that commits are 100% local until explicitly synchronized.',
        fix: 'Always remember: `git commit` saves to your laptop; `git push` sends to the team.',
      },
    ],

    sandbox: {
      initialCommands: ['git init', 'echo "DVCS power" > test.txt', 'git add test.txt', 'git commit -m "feat: first local commit"'],
      guidedSteps: [
        { instruction: 'Inspect repository commit graph', command: 'git log --oneline', hint: 'Run git log --oneline' },
      ],
    },

    challenge: {
      title: 'Experience Local Autonomous Commits',
      objective: 'Create a local commit without connecting to any remote server.',
      seedCommands: ['git init', 'echo "Local power" > feature.js'],
      initialFiles: { 'feature.js': 'const offline = true;' },
      expectedCommands: ['git add feature.js', 'git commit -m "feat: offline autonomy"'],
      hints: ['Stage the file with `git add feature.js`.', 'Seal the snapshot with `git commit -m "..."`.'],
      solutionExplanation: 'DVCS empowers developers to work with zero latency and complete privacy.',
      safeFailure: {
        mistakeTitle: 'Trying to push with no remote configured',
        mistakeCommand: 'git push origin main',
        whatHappened: 'Git returned: "fatal: \'origin\' does not appear to be a git repository".',
        whatWasNotLost: 'Your commit is completely safe on your computer! Simply add a remote when ready.',
        recoveryCommand: 'git status',
        recoveryExplanation: 'Run git status to verify your local commit is safely preserved.',
      },
    },

    reference: {
      synopsis: 'git clone [--depth <depth>] [--bare] <repository> [<directory>]',
      options: [
        { flag: '--depth', description: 'Create a shallow clone with truncated history.' },
        { flag: '--bare', description: 'Make a bare Git repository without working directory.' },
      ],
      gitInternals: {
        objectType: 'Complete DAG Mirror',
        explanation: 'Every clone duplicates the object database (.git/objects).',
        storageLocation: '.git/',
      },
      edgeCases: ['Submodules require explicit recursive cloning (`git clone --recursive`).'],
    },
  },

  'c-installing-git-locally': {
    id: 'c-installing-git-locally',
    command: 'git --version',
    title: 'Installing Git Locally',
    topicId: 'topic-01',
    topicNumber: '01',
    topicTitle: 'Learn the Basics',
    subtitle: 'Setup on macOS, Linux, Windows, and initial user configuration',
    badges: ['Beginner', 'Setup', 'Config'],
    quote: 'Before you make your first commit, teach Git your name and email so history remembers who you are.',
    difficulty: 'Beginner',

    whatIsIt:
      'Installing Git places the Git command-line executable in your system PATH, allowing your terminal and IDEs (VS Code, Cursor, WebStorm) to communicate with Git repositories. After installation, setting `user.name` and `user.email` configures your cryptographic commit identity.',
    inSimpleWords:
      'Installing the Git app on your computer, then signing your name on your developer ID badge so every commit you make has your name on it.',
    whyDoYouNeedIt:
      'Without Git installed, your terminal will report `command not found: git`. Without configuring your name and email, Git will block you from creating commits with an identity error.',
    realWorldAnalogy:
      'Like buying a wax seal stamp with your official family crest. Before you seal any royal letters (commits), you must carve your name onto the stamp.',

    syntaxCode: 'git config --global user.name "Your Name"',
    syntaxTokens: [
      { token: 'git', role: 'VCS Executable', explanation: 'The Git binary program.' },
      { token: 'config', role: 'Configuration Manager', explanation: 'Reads and writes Git settings and preferences.' },
      { token: '--global', role: 'Scope Flag', explanation: 'Applies this setting to all repositories for the current user (~/.gitconfig).' },
      { token: 'user.name', role: 'Target Setting Key', explanation: 'Specifies the author name attached to every future commit.' },
      { token: '"Your Name"', role: 'Setting Value', explanation: 'Your real or developer pseudonym name.' },
    ],

    actionStage: {
      before: {
        label: 'Unconfigured Identity',
        description: 'Git is installed, but lacks author identity configuration.',
        workingDirectory: [{ name: 'setup.txt', status: 'untracked' }],
        stagingArea: [],
        commandPill: 'Empty ~/.gitconfig',
        historyCommits: [],
        whatChanged: ['No identity defined.'],
        whatDidNotChange: ['System default settings remain in place.'],
      },
      running: {
        label: 'Writing Global Config',
        description: 'Storing developer credentials into global configuration file.',
        workingDirectory: [{ name: 'setup.txt', status: 'untracked' }],
        stagingArea: [],
        commandPill: 'git config --global user.name "Alice Dev"',
        historyCommits: [],
        whatChanged: ['~/.gitconfig updated with author credentials.'],
        whatDidNotChange: ['Individual repositories can still override locally.'],
      },
      after: {
        label: 'Identity Active',
        description: 'Every commit will now be signed with verified author metadata.',
        workingDirectory: [{ name: 'setup.txt', status: 'committed' }],
        stagingArea: [],
        commandPill: 'Author: Alice Dev <alice@dev.com>',
        historyCommits: [{ hash: 'C1', message: 'First signed commit', isNew: true }],
        whatChanged: ['Commits now contain author timestamp and cryptographic signature.'],
        whatDidNotChange: ['Password or SSH authentication is configured separately.'],
      },
    },

    variations: [
      {
        title: 'Set user email',
        syntax: 'git config --global user.email "you@example.com"',
        whatItDoes: 'Associates your commits with your GitHub email for avatar badges.',
        whenToUse: 'Required setup step on any new computer.',
        example: 'git config --global user.email "dev@commitforge.com"',
      },
      {
        title: 'List all active configurations',
        syntax: 'git config --list --show-origin',
        whatItDoes: 'Prints every configuration variable alongside the file where it is stored.',
        whenToUse: 'Debugging why Git is behaving unexpectedly or using the wrong email.',
        example: 'git config --list --show-origin',
      },
      {
        title: 'Set default branch name',
        syntax: 'git config --global init.defaultBranch main',
        whatItDoes: 'Ensures all new repositories initialize with `main` instead of `master`.',
        whenToUse: 'Modern standard across all Git communities.',
        example: 'git config --global init.defaultBranch main',
      },
    ],

    scenarios: [
      {
        id: 'sc-install-1',
        title: 'Work laptop with multiple GitHub accounts',
        context: 'You have a personal GitHub account and a work company account on the same laptop.',
        question: 'How do you prevent using your personal name/email on work commits?',
        options: [
          {
            label: 'Omit --global and run git config user.email locally inside the work repo',
            command: 'git config user.email "corp@work.com"',
            isCorrect: true,
            explanation: 'Local configs (.git/config) override global configs (~/.gitconfig) on a per-project basis.',
          },
          {
            label: 'You can only ever have one email across all repositories',
            command: 'No command',
            isCorrect: false,
            explanation: 'Git supports system, global, and repository-local configuration hierarchies.',
          },
        ],
      },
    ],

    commandComparisons: [
      {
        commandA: 'git config --global',
        commandB: 'git config --local',
        aspect: 'Configuration Scope',
        descriptionA: 'Applies user identity and preferences across all repositories for this OS user account.',
        descriptionB: 'Applies configuration overrides exclusively to the current repository inside .git/config.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using a fake or disposable email address in git config',
        whyItHappens: 'Assuming it does not matter.',
        fix: 'Use the email connected to your GitHub profile so your commit contribution heatmaps light up green.',
      },
    ],

    sandbox: {
      initialCommands: ['git init', 'echo "Setup done" > setup.log'],
      guidedSteps: [
        { instruction: 'Verify Git installation', command: 'git --version', hint: 'Type git --version' },
        { instruction: 'Inspect current config', command: 'git config --list', hint: 'Type git config --list' },
      ],
    },

    challenge: {
      title: 'Inspect Git Version and Configuration',
      objective: 'Verify your Git version and list active configuration parameters.',
      seedCommands: ['git init', 'echo "Ready" > ready.txt'],
      initialFiles: { 'ready.txt': 'Ready' },
      expectedCommands: ['git --version', 'git config --list'],
      hints: ['Run `git --version` first.', 'Then execute `git config --list`.'],
      solutionExplanation: 'Git configuration drives everything from commit signatures to branch naming and merge tools.',
      safeFailure: {
        mistakeTitle: 'Setting typo configuration key',
        mistakeCommand: 'git config user.namme "Typo"',
        whatHappened: 'A harmless typo key was added to config.',
        whatWasNotLost: 'Your repository data was not affected.',
        recoveryCommand: 'git config --unset user.namme',
        recoveryExplanation: 'Run git config --unset <key> to remove invalid keys.',
      },
    },

    reference: {
      synopsis: 'git config [<file-option>] [name [value]]',
      options: [
        { flag: '--global', description: 'Write to global ~/.gitconfig file.' },
        { flag: '--local', description: 'Write to repository .git/config file (default).' },
        { flag: '--list', description: 'List all variables set in config files.' },
      ],
      gitInternals: {
        objectType: 'INI-Format Text Config',
        explanation: 'Plaintext INI format stored in ~/.gitconfig and .git/config.',
        storageLocation: '~/.gitconfig and .git/config',
      },
      edgeCases: ['System level (/etc/gitconfig) requires administrator/root permissions.'],
    },
  },

  'c-what-is-a-repository': {
    id: 'c-what-is-a-repository',
    command: 'git repo',
    title: 'What is a Repository?',
    topicId: 'topic-01',
    topicNumber: '01',
    topicTitle: 'Learn the Basics',
    subtitle: 'Demystifying the project folder and the hidden .git database',
    badges: ['Beginner', 'Architecture', 'Internals'],
    quote: 'A Git repository is simply your normal folder plus a hidden .git database that tracks everything.',
    difficulty: 'Beginner',

    whatIsIt:
      'A Git repository (or "repo") is the complete data structure that tracks your project. It consists of two essential parts: your **Working Directory** (the visible files and folders you create and edit) and the hidden **`.git` database directory** (the hidden vault containing all commit objects, branch pointers, logs, and cryptographic blobs).',
    inSimpleWords:
      'Your project folder is the desk where you work. The hidden `.git` folder inside it is the private safe underneath your desk where every snapshot and history file is locked up.',
    whyDoYouNeedIt:
      'Understanding this separation explains why deleting a project file is never permanent (it still exists in `.git`), and why deleting the `.git` folder turns your project back into an ordinary, untracked directory.',
    realWorldAnalogy:
      'Like an artist\'s studio. The canvas on the easel is your Working Directory. The flat files and photographic archive in the back storage room is the `.git` directory.',

    syntaxCode: 'ls -la',
    syntaxTokens: [
      { token: 'ls', role: 'List Directory', explanation: 'POSIX command to list directory contents.' },
      { token: '-la', role: 'All Details Flag', explanation: '-a shows hidden files (starting with a dot like .git), -l shows details.' },
    ],

    actionStage: {
      before: {
        label: 'Ordinary Directory',
        description: 'A normal computer folder containing code files. No version history exists.',
        workingDirectory: [
          { name: 'index.html', status: 'untracked' },
          { name: 'styles.css', status: 'untracked' },
        ],
        stagingArea: [],
        commandPill: 'Standard Folder',
        historyCommits: [],
        whatChanged: ['No version control active.'],
        whatDidNotChange: ['Operating system manages files normally.'],
      },
      running: {
        label: 'Creating the .git Database',
        description: 'Git creates the internal directory structure: objects/, refs/, HEAD, and config.',
        workingDirectory: [
          { name: 'index.html', status: 'untracked' },
          { name: 'styles.css', status: 'untracked' },
        ],
        stagingArea: [],
        commandPill: 'git init',
        historyCommits: [],
        whatChanged: ['.git/ folder created inside your project root.'],
        whatDidNotChange: ['Your HTML and CSS files remain exactly as they were.'],
      },
      after: {
        label: 'Full Git Repository',
        description: 'Folder is now a certified Git repository ready to record historical milestones.',
        workingDirectory: [
          { name: 'index.html', status: 'committed' },
          { name: 'styles.css', status: 'committed' },
        ],
        stagingArea: [],
        commandPill: 'Tracked Repository',
        historyCommits: [{ hash: 'C1', message: 'feat: initial landing page', isNew: true }],
        whatChanged: ['Working tree is linked to immutable commit DAG in .git/objects.'],
        whatDidNotChange: ['File contents visible to your browser or editor are unchanged.'],
      },
    },

    variations: [
      {
        title: 'Inspect .git internals',
        syntax: 'ls -F .git',
        whatItDoes: 'Reveals the internal folders: objects/, refs/, HEAD, config, description, and hooks/.',
        whenToUse: 'Demystifying Git internals and debugging pointer references.',
        example: 'ls -F .git',
      },
      {
        title: 'Check repository root path',
        syntax: 'git rev-parse --show-toplevel',
        whatItDoes: 'Prints the absolute path of the current repository root directory.',
        whenToUse: 'Scripts, tooling, or when nested deeply inside subfolders.',
        example: 'git rev-parse --show-toplevel',
      },
    ],

    scenarios: [
      {
        id: 'sc-repo-concept-1',
        title: 'Accidentally deleting the .git folder',
        context: 'A developer deletes the hidden `.git` folder to "free up disk space".',
        question: 'What happens to the project?',
        options: [
          {
            label: 'All Git history, branches, and commits are lost, leaving only current files on disk',
            command: 'rm -rf .git',
            isCorrect: true,
            explanation: 'The entire history lives in .git. Without it, the folder is just an ordinary unversioned directory.',
          },
          {
            label: 'Git files are restored automatically from the cloud without internet',
            command: 'No command',
            isCorrect: false,
            explanation: 'Git is local. If you delete .git without pushing to GitHub, your local history is gone.',
          },
        ],
      },
    ],

    commandComparisons: [
      {
        commandA: 'Working Directory',
        commandB: '.git Database Vault',
        aspect: 'Storage Role & Persistence',
        descriptionA: 'The visible files you actively edit with your IDE or build tools on disk.',
        descriptionB: 'The hidden immutable object store recording all parent commit graphs, trees, and historical blobs.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],
    commonMistakes: [
      {
        mistake: 'Initializing a Git repository inside an existing Git repository (nested repos)',
        whyItHappens: 'Running `git init` inside a project subfolder by accident.',
        fix: 'Only initialize once at the top-level root of your project.',
      },
    ],

    sandbox: {
      initialCommands: ['git init', 'echo "Hello Repo" > index.html'],
      guidedSteps: [
        { instruction: 'Inspect hidden files including .git', command: 'ls -la', hint: 'Type ls -la' },
        { instruction: 'Check repository status', command: 'git status', hint: 'Type git status' },
      ],
    },

    challenge: {
      title: 'Inspect the Anatomy of a Repository',
      objective: 'Run status to verify your project directory is recognized as an active Git repository.',
      seedCommands: ['git init', 'echo "My App" > app.js'],
      initialFiles: { 'app.js': 'console.log("App");' },
      expectedCommands: ['git status'],
      hints: ['Run `git status` to see Git monitoring your repository.'],
      solutionExplanation: 'The working directory and .git database together form the repository.',
      safeFailure: {
        mistakeTitle: 'Running status in an uninitialized directory',
        mistakeCommand: 'cd .. && git status',
        whatHappened: 'Git reported "fatal: not a git repository (or any of the parent directories)".',
        whatWasNotLost: 'Nothing was damaged; Git simply told you no .git directory was found.',
        recoveryCommand: 'git status',
        recoveryExplanation: 'Navigate back to your repository folder and run git status.',
      },
    },

    reference: {
      synopsis: 'git rev-parse --show-toplevel | git status',
      options: [
        { flag: '--show-toplevel', description: 'Show the path of the top-level directory of the working tree.' },
      ],
      gitInternals: {
        objectType: 'Database Container',
        explanation: 'Contains HEAD, index, objects/, refs/heads/, and config.',
        storageLocation: '.git/',
      },
      edgeCases: ['Bare repositories have no working directory; .git files reside directly in root.'],
    },
  },

  'c-git-init': {
    id: 'c-git-init',
    command: 'git init',
    title: 'Initialize Repository',
    topicId: 'topic-01',
    topicNumber: '01',
    topicTitle: 'Learn the Basics',
    subtitle: 'Birth of a Git repository: creating the .git metadata database',
    badges: ['Beginner', 'Essential', 'Local'],
    quote: 'Every great software project in human history began with a single invocation of git init.',
    difficulty: 'Beginner',

    whatIsIt:
      '`git init` creates a brand new, empty Git repository or reinitializes an existing one. It generates the hidden `.git` directory containing object stores, template hooks, and the default branch reference pointer.',
    inSimpleWords:
      'It turns an ordinary, dumb folder on your computer into a smart version-controlled Git project ready to take snapshots.',
    whyDoYouNeedIt:
      'Before you can stage files (`git add`) or take snapshots (`git commit`), Git must initialize its internal ledger. `git init` is the very first command you run when starting a new codebase from scratch.',
    realWorldAnalogy:
      'Like buying a new hardcover diary and writing "Volume 1" on the first blank page. Until you open the diary, you have nowhere to write your daily entries.',

    syntaxCode: 'git init [-b <branch-name>]',
    syntaxTokens: [
      { token: 'git', role: 'VCS Tool', explanation: 'The Git executable command line program.' },
      { token: 'init', role: 'Subcommand', explanation: 'Initializes a new repository database in current directory.' },
      { token: '-b main', role: 'Optional Flag', explanation: 'Specifies the initial branch name (defaults to main).' },
    ],

    actionStage: {
      before: {
        label: 'Unversioned Folder',
        description: 'Standard filesystem directory with no Git metadata.',
        workingDirectory: [{ name: 'server.js', status: 'untracked' }],
        stagingArea: [],
        commandPill: 'Pre-init State',
        historyCommits: [],
        whatChanged: ['No version control active.'],
        whatDidNotChange: ['Source files exist on disk.'],
      },
      running: {
        label: 'Generating Database',
        description: 'Git creates .git/ directory, HEAD pointer, objects store, and refs.',
        workingDirectory: [{ name: 'server.js', status: 'untracked' }],
        stagingArea: [],
        commandPill: 'git init',
        historyCommits: [],
        whatChanged: ['Initialized empty Git repository in /path/to/project/.git/'],
        whatDidNotChange: ['Working tree files are unmodified.'],
      },
      after: {
        label: 'Initialized Repository',
        description: 'Git is now actively listening for file changes on the default branch.',
        workingDirectory: [{ name: 'server.js', status: 'untracked' }],
        stagingArea: [],
        commandPill: 'Ready for Staging',
        historyCommits: [],
        whatChanged: ['Repository is initialized on branch main.'],
        whatDidNotChange: ['Files are untracked until you run git add.'],
      },
    },

    variations: [
      {
        title: 'Initialize with custom branch name',
        syntax: 'git init -b main',
        whatItDoes: 'Overrides global default to explicitly name the root branch `main`.',
        whenToUse: 'Starting modern projects adhering to current naming standards.',
        example: 'git init -b main',
      },
      {
        title: 'Initialize bare repository',
        syntax: 'git init --bare',
        whatItDoes: 'Creates a repository without a working directory, specifically for central remotes.',
        whenToUse: 'Setting up a remote server storage hub.',
        example: 'git init --bare /srv/git/my-project.git',
      },
      {
        title: 'Initialize in specific subfolder',
        syntax: 'git init <directory>',
        whatItDoes: 'Creates the specified directory if missing and initializes Git inside it.',
        whenToUse: 'Creating a new project directory and repo in a single step.',
        example: 'git init my-new-app',
      },
    ],

    scenarios: [
      {
        id: 'sc-git-init-1',
        title: 'Running git init in an existing repository',
        context: 'You accidentally run `git init` inside a project that was already initialized 6 months ago.',
        question: 'Will re-running git init delete your commit history?',
        options: [
          {
            label: 'No, git init is safe to re-run; it will not overwrite existing commits or branches',
            command: 'git init',
            isCorrect: true,
            explanation: 'Git will report "Reinitialized existing Git repository" and preserve all existing commits and objects.',
          },
          {
            label: 'Yes, it wipes all previous history and starts over at zero',
            command: 'No command',
            isCorrect: false,
            explanation: 'git init is non-destructive on existing repositories.',
          },
        ],
      },
    ],

    commandComparisons: [
      {
        commandA: 'git init',
        commandB: 'git clone <url>',
        aspect: 'Project Origin',
        descriptionA: 'Starts a brand new empty repository on your local computer from scratch.',
        descriptionB: 'Copies an existing repository and all its historical commits from a remote host.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Running `git init` in your computer\'s home or desktop directory',
        whyItHappens: 'Forgetting to `cd` into the specific project folder before initializing.',
        fix: 'Check `pwd` before running `git init`. If done by mistake, remove `.git` from home: `rm -rf ~/.git`.',
      },
    ],

    sandbox: {
      initialCommands: ['git init', 'echo "# My New App" > README.md'],
      guidedSteps: [
        { instruction: 'Check initialized repository status', command: 'git status', hint: 'Type git status' },
      ],
    },

    challenge: {
      title: 'Initialize Your Project & Inspect Status',
      objective: 'Run git init to create a new repository and verify that Git begins tracking the directory.',
      seedCommands: ['echo "const version = 1.0;" > app.js'],
      initialFiles: { 'app.js': 'const version = 1.0;' },
      expectedCommands: ['git init', 'git status'],
      hints: ['Type `git init` to initialize.', 'Then run `git status` to see untracked files.'],
      solutionExplanation: 'git init creates the foundational .git directory, converting the folder into a Git repository.',
      safeFailure: {
        mistakeTitle: 'Running commit before git init',
        mistakeCommand: 'git commit -m "initial"',
        whatHappened: 'Git failed: "fatal: not a git repository".',
        whatWasNotLost: 'Your code files are unharmed. Simply run git init first!',
        recoveryCommand: 'git init',
        recoveryExplanation: 'Running git init creates the required repository environment.',
      },
    },

    reference: {
      synopsis: 'git init [-q | --quiet] [--bare] [--template=<template-directory>] [-b <branch-name>] [<directory>]',
      options: [
        { flag: '-b <name>', description: 'Use the specified name for the initial branch in the newly created repository.' },
        { flag: '--bare', description: 'Create a bare repository (no working directory).' },
        { flag: '--quiet', description: 'Only print error and warning messages; all other output will be suppressed.' },
      ],
      gitInternals: {
        objectType: 'Repository Blueprint',
        explanation: 'Generates .git/HEAD pointing to refs/heads/main, .git/objects/ database, and default hooks.',
        storageLocation: '.git/',
      },
      edgeCases: ['Reinitializing preserves existing objects and configuration.'],
    },
  },
};
