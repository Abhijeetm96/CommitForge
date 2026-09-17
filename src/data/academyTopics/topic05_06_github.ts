import { UniversalConcept } from '../unifiedAcademyData';

export const TOPIC_05_06_CONCEPTS: Record<string, UniversalConcept> = {
  // ==========================================================================
  // TOPIC 05: GitHub Essentials
  // ==========================================================================
  'c-github-intro': {
    id: 'c-github-intro',
    command: 'github.com',
    title: 'GitHub Overview',
    topicId: 'topic-05',
    topicNumber: '05',
    topicTitle: 'GitHub Essentials',
    subtitle: 'Cloud hosting, distributed collaboration, and the global open-source hub',
    badges: ['Beginner', 'Collaboration', 'Cloud'],
    quote: 'Git is the local engine; GitHub is the global airport where millions of code flights depart and arrive.',
    difficulty: 'Beginner',

    whatIsIt:
      'GitHub is a cloud-based hosting platform for software development and version control using Git. It provides the distributed version control and source code management (SCM) functionality of Git, plus access control, bug tracking, feature requests, task management, and continuous integration wikis.',
    inSimpleWords:
      'If Git is your offline camera taking snapshots of code, GitHub is Instagram where you publish your albums and invite friends to collaborate.',
    whyDoYouNeedIt:
      'Without GitHub or a similar remote platform, collaborating requires manually emailing patch files or setting up custom SSH servers. GitHub provides a single web interface for code reviews, automated security checks, issue boards, and continuous deployment.',
    realWorldAnalogy:
      'Git is like writing a book in Microsoft Word with Track Changes on your laptop. GitHub is Google Docs in the cloud, allowing multiple editors worldwide to comment, propose edits, and publish together.',

    syntaxCode: 'git remote add origin https://github.com/<username>/<repo>.git',
    syntaxTokens: [
      { token: 'git remote add', role: 'Command', explanation: 'Registers a remote destination pointer.' },
      { token: 'origin', role: 'Default Remote Alias', explanation: 'Conventional short name for the main remote repo.' },
      { token: 'https://github.com/...', role: 'Repository URL', explanation: 'The authenticated cloud endpoint for the repo.' },
    ],

    actionStage: {
      before: {
        label: 'Local Isolation',
        description: 'You have commits on your laptop, but nobody else on Earth can see or test your code.',
        workingDirectory: [{ name: 'index.html', status: 'committed' }],
        stagingArea: [],
        commandPill: 'Local Only',
        historyCommits: [{ hash: 'C1', message: 'Initial commit' }],
        whatChanged: ['Repository only exists on your hard drive.'],
        whatDidNotChange: ['No remote backups or peer reviews.'],
      },
      running: {
        label: 'Connecting to Cloud',
        description: 'Registering the remote GitHub URL and pushing the local branch.',
        workingDirectory: [{ name: 'index.html', status: 'committed' }],
        stagingArea: [],
        commandPill: 'git remote add origin && git push -u origin main',
        historyCommits: [{ hash: 'C1', message: 'Initial commit (HEAD -> main, origin/main)' }],
        whatChanged: ['Cloud repository synchronized with local branch.'],
        whatDidNotChange: ['Local files and commit hashes remain completely identical.'],
      },
      after: {
        label: 'Global Accessibility',
        description: 'Code is backed up in the cloud, viewable via browser, and ready for team pull requests.',
        workingDirectory: [{ name: 'index.html', status: 'committed' }],
        stagingArea: [],
        commandPill: 'origin/main synced',
        historyCommits: [{ hash: 'C1', message: 'Initial commit (HEAD -> main, origin/main)' }],
        whatChanged: ['Branch tracking configured: origin/main.'],
        whatDidNotChange: ['Your working directory remains clean.'],
      },
    },

    variations: [
      {
        flag: 'Remote Add',
        title: 'Link to Remote Repository',
        syntax: 'git remote add origin https://github.com/<user>/<repo>.git',
        whatItDoes: 'Connects your local Git database to a cloud repository hosted on GitHub.',
        whenToUse: 'When setting up a brand new local project to back up and share in the cloud.',
        example: 'git remote add origin https://github.com/alice/project.git',
        snippet: 'git remote add origin https://github.com/<user>/<repo>.git',
      },
      {
        flag: 'gh CLI',
        title: 'Create Cloud Repo from Terminal',
        syntax: 'gh repo create <name> --public --source=. --push',
        whatItDoes: 'Creates a new GitHub repository via GitHub CLI, links origin, and pushes your current branch.',
        whenToUse: 'Quickly publishing a local project to GitHub without opening a web browser.',
        example: 'gh repo create my-app --public --source=. --push',
        snippet: 'gh repo create <name> --public --source=. --push',
      },
      {
        flag: 'Inspect',
        title: 'Inspect Configured Remotes',
        syntax: 'git remote -v',
        whatItDoes: 'Displays the fetch and push URLs for all registered remote repositories.',
        whenToUse: 'Verifying where git push and git fetch will connect.',
        example: 'git remote -v',
        snippet: 'git remote -v',
      },
    ],

    scenarios: [
      {
        id: 'sc-gh-intro-1',
        title: 'Publishing a Local Project to GitHub',
        context: 'You created a project locally with git init and made 3 commits. Now you want teammates to access and review it.',
        question: 'What is the standard procedure to publish this project to GitHub?',
        options: [
          {
            label: 'Create an empty GitHub repository, run git remote add origin <url>, then git push -u origin main',
            command: 'git remote add origin https://github.com/team/app.git && git push -u origin main',
            isCorrect: true,
            explanation: 'This registers the remote cloud address and sets up upstream tracking so future git push commands require no extra flags.',
          },
          {
            label: 'Zip the folder and email it to your teammates',
            command: 'No command',
            isCorrect: false,
            explanation: 'Emailing code loses real-time sync, automated CI/CD, and pull request review workflows.',
          },
        ],
        whenToUse: 'When you just initialized a project locally and want to back it up.',
        commandExample: 'git remote add origin https://github.com/user/app.git && git push -u origin main',
        note: 'Use -u to link the upstream tracking branch.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'Git (Local CLI engine)',
        commandB: 'GitHub (Cloud collaboration platform)',
        aspect: 'Role in Development',
        descriptionA: 'Runs completely offline on your computer; creates cryptographic snapshots, branches, and diffs in the .git folder.',
        descriptionB: 'Cloud hosting service that adds pull requests, automated CI/CD runners, issue tracking, and team access control.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Pushing API keys, .env files, or database credentials to a public GitHub repository',
        whyItHappens: 'Forgetting to add secrets to .gitignore before staging files.',
        fix: 'Add .env to .gitignore immediately, invalidate exposed credentials in your cloud console, and use git filter-repo or BFG to purge secrets from history.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"# Welcome to My Project\\nHosted on GitHub.\" > README.md",
          "git add README.md",
          "git commit -m \"chore: initial project documentation\"",
          "git remote add origin https://github.com/learn/forge.git"
  ],
      guidedSteps: [
          {
                  "instruction": "Inspect configured remotes with verbose URLs",
                  "command": "git remote -v",
                  "hint": "Type git remote -v"
          },
          {
                  "instruction": "Check working tree and branch status",
                  "command": "git status",
                  "hint": "Type git status"
          },
          {
                  "instruction": "Review the initial project commit",
                  "command": "git log --oneline",
                  "hint": "Type git log --oneline"
          }
  ],
      initialFiles: [{ name: 'README.md', content: '# Welcome to My Project\nHosted on GitHub.' }],
      initialCommits: [{ hash: 'a1b2c3d', message: 'chore: initial project documentation' }],
      targetTask: 'Check your remote configuration or add an origin remote.',
      hints: ['Run `git remote -v` to inspect existing remotes.'],
      validationRegex: /git remote/i,
      solutionCommands: ['git remote -v'],
    },

    challenge: {
      title: 'Inspect Remote Connection',
      instructions: 'Examine configured remotes to verify where your branch will push its commits.',
      startingState: 'Local repo initialized with origin set to https://github.com/learn/forge.git',
      goalState: 'Remote origin URL displayed with both (fetch) and (push) permissions.',
      hints: ['Use `git remote -v` to show URL targets.'],
    },

    reference: {
      officialDocUrl: 'https://docs.github.com/en/get-started/start-your-journey/about-github-and-git',
      syntaxCheatSheet: [
        'git remote -v : List remote connections with URLs',
        'git remote add <name> <url> : Connect to cloud repository',
        'git push -u <name> <branch> : Push and set upstream default',
      ],
      commonErrors: [
        { error: 'fatal: remote origin already exists', remedy: 'Run `git remote set-url origin <new-url>` or `git remote remove origin` first.' },
        { error: 'Support for password authentication was removed', remedy: 'Use an SSH key or a GitHub Personal Access Token (PAT) instead of account password.' },
      ],
      mentalModelDiagram: {
        concept: 'GitHub as Central Cloud Hub',
        explanation: 'Local Git repositories on different developer laptops push snapshots to a centralized GitHub server.',
        storageLocation: 'Cloud-hosted bare Git repositories backed by GitHub infrastructure.',
      },
      edgeCases: ['Private repositories require explicit collaborator grants or team-level organization permissions.'],
    },
  },

  'c-github-forks': {
    id: 'c-github-forks',
    command: 'forks',
    title: 'Forks vs Clones',
    topicId: 'topic-05',
    topicNumber: '05',
    topicTitle: 'GitHub Essentials',
    subtitle: 'Contributing to projects where you lack direct write permissions',
    badges: ['Beginner', 'Open Source', 'Collaboration'],
    quote: 'A clone copies code to your computer; a fork copies the entire cloud repository to your personal GitHub account.',
    difficulty: 'Beginner',

    whatIsIt:
      'A fork is a personal copy of another user\'s repository on GitHub that you own and manage. It allows you to freely experiment with changes without affecting the original upstream repository, serving as the foundation of open-source contribution workflows.',
    inSimpleWords:
      'Cloning is downloading a book to read at home. Forking is having the publisher print you your own personalized copy where you can rewrite any chapter you want.',
    whyDoYouNeedIt:
      'In open-source, you cannot push directly to repositories like Linux, React, or Python. By forking, you get a writable cloud copy where you push your feature branch, then open a Pull Request back to the original author.',
    realWorldAnalogy:
      'You see a great recipe at a restaurant. You cannot write on the restaurant\'s master menu, so you copy the recipe into your personal notebook, modify the spices, and suggest your upgrade to the chef.',

    syntaxCode: 'gh repo fork <owner>/<repo> --clone',
    syntaxTokens: [
      { token: 'gh repo fork', role: 'GitHub CLI Command', explanation: 'Triggers a server-side fork on GitHub.' },
      { token: '<owner>/<repo>', role: 'Target Upstream', explanation: 'The repository you want to copy (e.g., torvalds/linux).' },
      { token: '--clone', role: 'Flag', explanation: 'Automatically clones your new personal fork to your local machine.' },
    ],

    actionStage: {
      before: {
        label: 'Upstream Repository (Read Only)',
        description: 'You want to contribute to an open-source library, but you have no write access.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'upstream: read-only',
        historyCommits: [{ hash: 'U10', message: 'release: v2.0.0' }],
        whatChanged: ['Original repo exists at github.com/upstream/project.'],
        whatDidNotChange: ['No personal copy exists yet.'],
      },
      running: {
        label: 'Forking on GitHub',
        description: 'GitHub duplicates the repository into github.com/your-username/project with full write rights.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Fork created in cloud',
        historyCommits: [{ hash: 'U10', message: 'release: v2.0.0' }],
        whatChanged: ['You now have admin privileges on your personal cloud copy.'],
        whatDidNotChange: ['Upstream remains untouched.'],
      },
      after: {
        label: 'Dual Remotes Configured',
        description: 'Local clone has `origin` pointing to your fork and `upstream` pointing to the main project.',
        workingDirectory: [{ name: 'feature.js', status: 'modified' }],
        stagingArea: [],
        commandPill: 'origin (your fork) + upstream (main repo)',
        historyCommits: [
          { hash: 'F1', message: 'feat: add awesome feature' },
          { hash: 'U10', message: 'release: v2.0.0' },
        ],
        whatChanged: ['You can freely push feature branches to your fork.'],
        whatDidNotChange: ['Upstream repo remains clean until a PR is merged.'],
      },
    },

    variations: [
      {
        flag: 'gh CLI Fork',
        title: 'Fork and Clone via GitHub CLI',
        syntax: 'gh repo fork <owner>/<repo> --clone',
        whatItDoes: 'Creates a remote fork under your GitHub account and clones it locally with both origin and upstream remotes configured.',
        whenToUse: 'Contributing to open source libraries where you lack direct write permissions.',
        example: 'gh repo fork facebook/react --clone',
        snippet: 'gh repo fork <owner>/<repo> --clone',
      },
      {
        flag: 'Upstream Setup',
        title: 'Add Upstream Remote Manually',
        syntax: 'git remote add upstream <url>',
        whatItDoes: 'Registers the original parent repository so you can pull future updates and bug fixes into your fork.',
        whenToUse: 'After manually forking through the GitHub website and cloning your fork.',
        example: 'git remote add upstream https://github.com/facebook/react.git',
        snippet: 'git remote add upstream <url>',
      },
      {
        flag: 'Sync Fork',
        title: 'Sync Fork with Upstream',
        syntax: 'git fetch upstream && git merge upstream/main',
        whatItDoes: 'Downloads upstream changes and advances your local main branch to match the original project.',
        whenToUse: 'Before starting a new feature branch to ensure you branch off the freshest codebase.',
        example: 'git fetch upstream && git merge upstream/main',
        snippet: 'git fetch upstream && git merge upstream/main',
      },
    ],

    scenarios: [
      {
        id: 'sc-gh-fork-1',
        title: 'Contributing a Fix to an Open-Source Library',
        context: 'You found a bug in an open-source library. You run git push origin bugfix on your clone of the original repo and get 403 Forbidden.',
        question: 'Why did Git reject your push, and how should you proceed?',
        options: [
          {
            label: 'You lack write permissions on the original repo. Fork it to your account, clone your fork, push there, and open a PR.',
            command: 'gh repo fork owner/repo --clone',
            isCorrect: true,
            explanation: 'In open source, maintainers only give write permissions to core teams. Outside contributors must fork to a writable personal copy.',
          },
          {
            label: 'Run git push --force until the server accepts it',
            command: 'git push --force origin main',
            isCorrect: false,
            explanation: 'Force pushing cannot bypass authentication and permission checks; it will still fail with 403 Forbidden.',
          },
        ],
        whenToUse: 'When you encounter a bug in an npm package and want to fix it.',
        commandExample: 'gh repo fork expressjs/express --clone',
        note: 'Pushes go to your origin, PR targets upstream main.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'git clone <url>',
        commandB: 'gh repo fork <owner>/<repo>',
        aspect: 'Copy Location & Permissions',
        descriptionA: 'Downloads a repository to your local computer. If you do not have write permissions on that repo, you cannot push your branches back.',
        descriptionB: 'Creates a full copy of the repository under your personal GitHub account where you have 100% admin and write permissions.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Making code changes directly on your fork\'s `main` branch instead of creating a feature branch',
        whyItHappens: 'Thinking the fork belongs to you so branching does not matter.',
        fix: 'Always keep your fork\'s main branch strictly in sync with upstream/main, and create isolated branches like `feat/my-change` for your work.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"# Contributing Guide\" > CONTRIBUTING.md",
          "git add CONTRIBUTING.md",
          "git commit -m \"docs: add contribution guide\"",
          "git remote add origin https://github.com/my-user/contributing-repo.git"
  ],
      guidedSteps: [
          {
                  "instruction": "Verify existing origin remote connection",
                  "command": "git remote -v",
                  "hint": "Type git remote -v"
          },
          {
                  "instruction": "Add upstream remote link pointing to official repo",
                  "command": "git remote add upstream https://github.com/upstream-org/contributing-repo.git",
                  "hint": "Type git remote add upstream https://github.com/upstream-org/contributing-repo.git"
          },
          {
                  "instruction": "Verify both origin and upstream remotes are configured",
                  "command": "git remote -v",
                  "hint": "Type git remote -v"
          }
  ],
      initialFiles: [{ name: 'CONTRIBUTING.md', content: '# Please fork before submitting PRs\n' }],
      initialCommits: [{ hash: 'e4d3c2b', message: 'docs: add contribution guide' }],
      targetTask: 'Check your remotes to see if upstream or origin is defined.',
      hints: ['Run `git remote -v`.'],
      validationRegex: /git remote/i,
      solutionCommands: ['git remote -v'],
    },

    challenge: {
      title: 'Configure Dual Remotes',
      instructions: 'Ensure your local repo can fetch both your fork (origin) and upstream.',
      startingState: 'Single remote `origin` pointing to your fork.',
      goalState: 'Two remotes visible in git remote -v: origin and upstream.',
      hints: ['Run `git remote add upstream https://github.com/original/repo.git`.'],
    },

    reference: {
      officialDocUrl: 'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/about-forks',
      syntaxCheatSheet: [
        'gh repo fork <owner>/<repo> --clone : Fork and clone instantly',
        'git remote add upstream <url> : Add the original repo as upstream',
        'git fetch upstream : Pull latest upstream commits to stay synced',
      ],
      commonErrors: [
        { error: 'Permission to upstream denied to user', remedy: 'You tried to push directly to upstream. Push to origin (your fork) instead, then open a PR.' },
      ],
      mentalModelDiagram: {
        concept: 'Triangle Workflow',
        explanation: 'Fetch from Upstream -> Commit Locally -> Push to Origin (Fork) -> Open Pull Request to Upstream.',
        storageLocation: 'Separate repository record in GitHub cloud metadata referencing the parent repo.',
      },
      edgeCases: ['Private forks are only available in GitHub Enterprise or paid organizations if the upstream allows it.'],
    },
  },

  'c-github-pull-requests': {
    id: 'c-github-pull-requests',
    command: 'pull requests',
    title: 'Pull Requests',
    topicId: 'topic-05',
    topicNumber: '05',
    topicTitle: 'GitHub Essentials',
    subtitle: 'The gold standard for code review, team discussion, and continuous integration gating',
    badges: ['Beginner', 'Collaboration', 'Core Workflow'],
    quote: 'A Pull Request is not just a merge proposal; it is a collaborative design discussion backed by automated tests.',
    difficulty: 'Beginner',

    whatIsIt:
      'A Pull Request (PR) is a GitHub feature that lets you notify team members about changes you\'ve pushed to a branch in a repository. Once a PR is opened, collaborators can review the unified diff, leave line-by-line comments, run automated CI tests, and approve or request changes before merging.',
    inSimpleWords:
      'It is you raising your hand and saying: "Hey team, I built this new feature on my branch. Please check my work, run tests, and merge it when you\'re happy!"',
    whyDoYouNeedIt:
      'Without PRs, developers push untested code directly to production branches, causing unexpected crashes, conflicting edits, and architectural drift. PRs provide a quality gate where code must be reviewed and pass CI before merging.',
    realWorldAnalogy:
      'Like submitting a blueprint proposal to the senior city architect. They review the structural diagrams, suggest stronger materials on line 42, and stamp "Approved" before construction begins.',

    syntaxCode: 'gh pr create --title "<title>" --body "<description>" --base main',
    syntaxTokens: [
      { token: 'gh pr create', role: 'CLI Action', explanation: 'Opens a new Pull Request on GitHub from current branch.' },
      { token: '--title', role: 'Flag', explanation: 'Concise summary of the feature or bugfix.' },
      { token: '--base main', role: 'Target Branch', explanation: 'The destination branch you want your changes merged into.' },
    ],

    actionStage: {
      before: {
        label: 'Feature Branch Pushed',
        description: 'You pushed commits on `feature/dark-mode` to GitHub, but main is unchanged.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'branch: feature/dark-mode',
        historyCommits: [
          { hash: 'D2', message: 'feat: add dark mode theme toggle' },
          { hash: 'M1', message: 'feat: production baseline' },
        ],
        whatChanged: ['Commits exist on remote feature branch.'],
        whatDidNotChange: ['Main branch has not received the changes.'],
      },
      running: {
        label: 'PR Opened & CI Running',
        description: 'PR #42 created. Automated test suite runs; reviewers receive notifications.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'PR #42: Checks Running...',
        historyCommits: [
          { hash: 'D2', message: 'feat: add dark mode theme toggle' },
          { hash: 'M1', message: 'feat: production baseline' },
        ],
        whatChanged: ['GitHub creates discussion thread, diff view, and status checks.'],
        whatDidNotChange: ['Git commit history remains untouched until merge.'],
      },
      after: {
        label: 'Merged into Main',
        description: 'Reviewers approved, CI passed green, and the PR was merged.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Merged into main',
        historyCommits: [
          { hash: 'M2', message: 'Merge pull request #42 from feature/dark-mode' },
          { hash: 'D2', message: 'feat: add dark mode theme toggle' },
          { hash: 'M1', message: 'feat: production baseline' },
        ],
        whatChanged: ['Main branch now incorporates all feature commits.'],
        whatDidNotChange: ['Feature branch can now be safely deleted.'],
      },
    },

    variations: [
      {
        flag: 'Create PR',
        title: 'Create Pull Request from CLI',
        syntax: 'gh pr create --title "<title>" --body "<description>"',
        whatItDoes: 'Pushes current branch if needed and opens a formal review pull request on GitHub.',
        whenToUse: 'When feature work is ready for code review and automated CI validation.',
        example: 'gh pr create --title "feat: add user profile page" --body "Closes #102"',
        snippet: 'gh pr create --title "<title>" --body "<body>"',
      },
      {
        flag: 'Draft PR',
        title: 'Open Draft PR for Early Feedback',
        syntax: 'gh pr create --draft',
        whatItDoes: 'Opens a pull request marked as Draft, notifying reviewers that work is in progress and cannot be merged yet.',
        whenToUse: 'When you want early feedback on architecture before writing tests.',
        example: 'gh pr create --draft --title "WIP: New Payment Flow"',
        snippet: 'gh pr create --draft',
      },
      {
        flag: 'PR Checkout',
        title: 'Test a Teammate\'s PR Locally',
        syntax: 'gh pr checkout <pr-number>',
        whatItDoes: 'Downloads the teammate\'s branch and switches your local working directory to it for testing.',
        whenToUse: 'When reviewing complex PRs that need interactive local testing.',
        example: 'gh pr checkout 42',
        snippet: 'gh pr checkout <number>',
      },
    ],

    scenarios: [
      {
        id: 'sc-gh-pr-1',
        title: 'Preparing a Clean Pull Request',
        context: 'You finished building a payment gateway feature across 4 commits. Before opening a PR, you want to ensure the PR is easy to review.',
        question: 'What is the best practice for submitting a high-quality Pull Request?',
        options: [
          {
            label: 'Ensure commits are atomic, write a clear summary with screenshots/testing notes, and link the issue number',
            command: 'gh pr create --title "feat(pay): add Stripe gateway" --body "Resolves #84"',
            isCorrect: true,
            explanation: 'Clear PR titles, descriptive context, and issue linking accelerate review cycles and reduce back-and-forth comments.',
          },
          {
            label: 'Bundle 5 unrelated bugfixes and features into one 3,000-line Pull Request',
            command: 'No command',
            isCorrect: false,
            explanation: 'Massive monolithic PRs take days to review, hide subtle bugs, and frequently cause merge conflicts.',
          },
        ],
        whenToUse: 'Every time you finish a sprint task on an isolated branch.',
        commandExample: 'gh pr create --fill',
        note: 'Uses commit messages to prefill the PR title and description.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'Direct push to main',
        commandB: 'Pull Request Workflow',
        aspect: 'Code Quality & Stability',
        descriptionA: 'Uncontrolled push directly to production branch without automated tests or second-pair-of-eyes review.',
        descriptionB: 'Enforces code reviews, automated CI test checks, and discussion before code is allowed to enter production.',
        safeForSharedHistory: { a: false, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Opening a PR before pushing your local commits to the remote branch',
        whyItHappens: 'Forgetting that GitHub only knows about commits that were pushed via git push.',
        fix: 'Run `git push -u origin <branch-name>` first, then open your PR.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"export const theme = \\\"dark\\\";\" > feature.js",
          "git add feature.js",
          "git commit -m \"feat: add dark theme support\"",
          "git branch feature/theme-toggle"
  ],
      guidedSteps: [
          {
                  "instruction": "Check your commit log before opening a pull request",
                  "command": "git log --oneline",
                  "hint": "Type git log --oneline"
          },
          {
                  "instruction": "Switch to the new feature branch",
                  "command": "git switch feature/theme-toggle",
                  "hint": "Type git switch feature/theme-toggle"
          },
          {
                  "instruction": "Verify current active branch",
                  "command": "git branch",
                  "hint": "Type git branch"
          }
  ],
      initialFiles: [{ name: 'feature.js', content: 'export const theme = "dark";\n' }],
      initialCommits: [{ hash: 'f3a2b1c', message: 'feat: add dark theme support' }],
      targetTask: 'Check your commit log before opening a pull request.',
      hints: ['Use `git log --oneline -n 3`.'],
      validationRegex: /git log/i,
      solutionCommands: ['git log --oneline'],
    },

    challenge: {
      title: 'Prepare Branch for PR',
      instructions: 'Inspect the commit history to ensure commits are clean and ready for team review.',
      startingState: 'Feature branch with 1 commit ready for submission.',
      goalState: 'Commit message verified with conventional prefix.',
      hints: ['Run `git log -1` to inspect the latest commit.'],
    },

    reference: {
      officialDocUrl: 'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests',
      syntaxCheatSheet: [
        'gh pr create : Interactively prompt to create a PR',
        'gh pr list : List open PRs in repository',
        'gh pr checkout <number> : Download and switch to a teammate\'s PR branch',
        'gh pr merge <number> : Merge PR after approval',
      ],
      commonErrors: [
        { error: 'There isn’t anything to compare', remedy: 'Ensure you pushed your local commits to the remote branch before opening the PR.' },
        { error: 'Cannot be merged automatically (conflicts)', remedy: 'Rebase or merge the latest main into your feature branch and resolve conflicts locally first.' },
      ],
      mentalModelDiagram: {
        concept: 'PR Quality Gate',
        explanation: 'Feature Branch -> CI Tests + Peer Review -> Approved -> Merged into Target Branch.',
        storageLocation: 'GitHub metadata object linking two branch tips with comments, review events, and CI statuses.',
      },
      edgeCases: ['Cross-repository PRs from forks cannot access write secrets in GitHub Actions by default for security.'],
    },
  },

  'c-github-ssh-keys': {
    id: 'c-github-ssh-keys',
    command: 'ssh-keygen',
    title: 'SSH Keys & Authentication',
    topicId: 'topic-05',
    topicNumber: '05',
    topicTitle: 'GitHub Essentials',
    subtitle: 'Cryptographic public-key authentication for seamless and secure Git operations',
    badges: ['Intermediate', 'Security', 'Authentication'],
    quote: 'Never type passwords again. SSH key pairs prove identity mathematically using public-key cryptography.',
    difficulty: 'Intermediate',

    whatIsIt:
      'SSH (Secure Shell) keys provide a secure way to log into servers and services without typing passwords. An SSH key pair consists of a private key (which never leaves your computer) and a public key (which you upload to your GitHub account). When you push or fetch, GitHub uses mathematical challenge-response cryptography to verify your identity.',
    inSimpleWords:
      'The public key is a custom padlock you put on GitHub\'s locker. The private key is the unique physical key in your pocket. Only your key can open the padlock.',
    whyDoYouNeedIt:
      'GitHub deprecated password authentication for Git pushes in 2021 due to credential stuffing risks. SSH keys or Personal Access Tokens (PAT) are mandatory. SSH keys are superior for everyday developer laptops because they don\'t expire every 30 days and work automatically with the SSH agent.',
    realWorldAnalogy:
      'Like an automated keycard scanner at a secure office building. You hold your RFID card (private key) up to the door (public key); the door verifies your crypto credentials and clicks open without a security guard asking for a password.',

    syntaxCode: 'ssh-keygen -t ed25519 -C "your_email@example.com"',
    syntaxTokens: [
      { token: 'ssh-keygen', role: 'Key Generator Utility', explanation: 'Standard OpenSSH command to create key pairs.' },
      { token: '-t ed25519', role: 'Algorithm Flag', explanation: 'Specifies Ed25519, the modern, ultra-secure elliptic curve standard.' },
      { token: '-C "email"', role: 'Comment Label', explanation: 'Appends an identification label to the public key file.' },
    ],

    actionStage: {
      before: {
        label: 'No SSH Keys',
        description: 'Attempting to push over `git@github.com:...` results in "Permission denied (publickey)".',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Permission denied (publickey)',
        historyCommits: [],
        whatChanged: ['No recognized public key on GitHub servers.'],
        whatDidNotChange: ['Local code is fine, but unpushable.'],
      },
      running: {
        label: 'Generating Key Pair',
        description: 'Generating ~/.ssh/id_ed25519 (private) and ~/.ssh/id_ed25519.pub (public).',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'ssh-keygen -t ed25519',
        historyCommits: [],
        whatChanged: ['Private key stored securely on disk with 600 permissions.', 'Public key copied to clipboard.'],
        whatDidNotChange: ['Private key must NEVER be sent over the internet or uploaded.'],
      },
      after: {
        label: 'Authenticated & Tested',
        description: 'Public key pasted into GitHub Settings -> SSH and GPG keys. Handshake successful!',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Hi user! You\'ve successfully authenticated.',
        historyCommits: [],
        whatChanged: ['All future git push and git fetch commands authenticate transparently.'],
        whatDidNotChange: ['Repository history remains unchanged.'],
      },
    },

    variations: [
      {
        flag: 'Ed25519 Key',
        title: 'Generate Modern Ed25519 Key',
        syntax: 'ssh-keygen -t ed25519 -C "your_email@example.com"',
        whatItDoes: 'Creates a cryptographic public/private keypair using modern elliptic-curve cryptography.',
        whenToUse: 'Recommended standard for all modern developer machines and servers.',
        example: 'ssh-keygen -t ed25519 -C "dev@commitforge.com"',
        snippet: 'ssh-keygen -t ed25519 -C "<email>"',
      },
      {
        flag: 'Test Connection',
        title: 'Verify Handshake with GitHub',
        syntax: 'ssh -T git@github.com',
        whatItDoes: 'Initiates an SSH handshake with GitHub to verify that your key is loaded and authenticated.',
        whenToUse: 'Troubleshooting "Permission denied (publickey)" errors.',
        example: 'ssh -T git@github.com',
        snippet: 'ssh -T git@github.com',
      },
      {
        flag: 'SSH Agent',
        title: 'Load Key into SSH Agent',
        syntax: 'eval "$(ssh-agent -s)" && ssh-add ~/.ssh/id_ed25519',
        whatItDoes: 'Starts background SSH authentication agent and caches your decrypted private key in memory.',
        whenToUse: 'Preventing repeated passphrase prompts when pushing or fetching.',
        example: 'ssh-add ~/.ssh/id_ed25519',
        snippet: 'ssh-add ~/.ssh/id_ed25519',
      },
    ],

    scenarios: [
      {
        id: 'sc-gh-ssh-1',
        title: 'Permission Denied (publickey) Error on Push',
        context: 'You run git push and get "git@github.com: Permission denied (publickey). fatal: Could not read from remote repository."',
        question: 'What is the most likely cause and remedy?',
        options: [
          {
            label: 'Your SSH key is not loaded in ssh-agent or the public key was not added to your GitHub Settings -> SSH Keys',
            command: 'ssh-add ~/.ssh/id_ed25519 && ssh -T git@github.com',
            isCorrect: true,
            explanation: 'SSH requires the public key on GitHub and the matching private key in your local agent memory.',
          },
          {
            label: 'Switch back to using your GitHub account password in terminal',
            command: 'No command',
            isCorrect: false,
            explanation: 'GitHub permanently removed account password authentication for Git operations in August 2021.',
          },
        ],
        whenToUse: 'First day setting up a new Mac, Linux, or Windows laptop.',
        commandExample: 'ssh-keygen -t ed25519 && cat ~/.ssh/id_ed25519.pub',
        note: 'Copy the .pub contents into GitHub Settings.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'SSH Authentication (git@github.com:...)',
        commandB: 'HTTPS Authentication (https://github.com/...)',
        aspect: 'Security & Credentials',
        descriptionA: 'Uses asymmetric public/private cryptographic keys stored in ~/.ssh; never transmits credentials over the wire.',
        descriptionB: 'Requires Personal Access Tokens (PATs) with expiration dates or Git Credential Manager OAuth prompts.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Uploading your private key (`id_ed25519`) instead of your public key (`id_ed25519.pub`) to GitHub',
        whyItHappens: 'Confusing the private secret file with the shareable public key file.',
        fix: 'Never share or upload files without the `.pub` extension. Always run `cat ~/.ssh/id_ed25519.pub` to copy your public key.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "git config user.name \"Developer\"",
          "git config user.email \"dev@example.com\"",
          "echo \"# SSH Secured Repo\" > README.md",
          "git add README.md",
          "git commit -m \"chore: setup initial commit\""
  ],
      guidedSteps: [
          {
                  "instruction": "Check your Git configuration to verify author identity",
                  "command": "git config --list",
                  "hint": "Type git config --list"
          },
          {
                  "instruction": "Configure an authenticated SSH remote URL",
                  "command": "git remote add origin git@github.com:dev/ssh-project.git",
                  "hint": "Type git remote add origin git@github.com:dev/ssh-project.git"
          },
          {
                  "instruction": "Verify the SSH remote protocol endpoint",
                  "command": "git remote -v",
                  "hint": "Type git remote -v"
          }
  ],
      initialFiles: [{ name: '.gitconfig', content: '[user]\n  name = Developer\n  email = dev@example.com\n' }],
      initialCommits: [{ hash: 'b4c3d2e', message: 'chore: setup user config' }],
      targetTask: 'Check your Git configuration to verify your author email matches your SSH key comment.',
      hints: ['Run `git config --list`.'],
      validationRegex: /git config/i,
      solutionCommands: ['git config --list'],
    },

    challenge: {
      title: 'Verify Git Author Identity',
      instructions: 'Confirm user.name and user.email are set correctly so your SSH commits link to your GitHub avatar.',
      startingState: 'Git author settings populated.',
      goalState: 'user.name and user.email displayed.',
      hints: ['Run `git config user.email`.'],
    },

    reference: {
      officialDocUrl: 'https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent',
      syntaxCheatSheet: [
        'ssh-keygen -t ed25519 -C "email" : Generate key pair',
        'eval "$(ssh-agent -s)" : Start the SSH background agent',
        'ssh-add ~/.ssh/id_ed25519 : Add private key to agent',
        'ssh -T git@github.com : Test authenticated handshake',
      ],
      commonErrors: [
        { error: 'Permission denied (publickey)', remedy: 'Your private key is not loaded in ssh-agent or public key is missing on GitHub. Run `ssh-add ~/.ssh/id_ed25519`.' },
        { error: 'WARNING: UNPROTECTED PRIVATE KEY FILE!', remedy: 'Run `chmod 600 ~/.ssh/id_ed25519` so other users cannot read your private key.' },
      ],
      mentalModelDiagram: {
        concept: 'Asymmetric Public-Key Crypto',
        explanation: 'Laptop holds Private Key (never shared). GitHub holds Public Key. Server sends encrypted puzzle that only your private key can solve.',
        storageLocation: 'Local: ~/.ssh/id_ed25519. Remote: GitHub User Settings -> SSH Keys DB.',
      },
      edgeCases: ['Corporate firewalls blocking port 22 (SSH) can be bypassed by configuring SSH over port 443 via ~/.ssh/config.'],
    },
  },

  // ==========================================================================
  // TOPIC 06: Collaboration on GitHub
  // ==========================================================================
  'c-gh-code-review': {
    id: 'c-gh-code-review',
    command: 'code review',
    title: 'Effective Code Reviews',
    topicId: 'topic-06',
    topicNumber: '06',
    topicTitle: 'Collaboration on GitHub',
    subtitle: 'Constructive feedback, line-level diff analysis, and maintaining team quality standards',
    badges: ['Intermediate', 'Best Practice', 'Teamwork'],
    quote: 'Code review is not an exam where you grade your peer; it is a collaborative safeguard for code maintainability and shared learning.',
    difficulty: 'Intermediate',

    whatIsIt:
      'Code review is the systematic examination of computer source code intended to find bugs, ensure adherence to coding standards, and improve architecture. On GitHub, this takes place on the "Files changed" tab of a Pull Request, enabling inline comments, suggested code replacements, and formal Approve / Request Changes decisions.',
    inSimpleWords:
      'Proofreading your teammate’s essay before it gets published, pointing out typos and suggesting better sentences directly in the margins.',
    whyDoYouNeedIt:
      'Authors are naturally blind to their own blind spots and edge cases. Peer reviews catch security bugs, verify architectural consistency, spread domain knowledge across the team, and eliminate single points of failure.',
    realWorldAnalogy:
      'Like a co-pilot running through the pre-flight checklist with the pilot. Both are skilled aviators, but having a second pair of eyes confirms that the landing gear switch is actually locked down.',

    syntaxCode: 'gh pr review <pr-number> --approve --body "LGTM! Clean refactor."',
    syntaxTokens: [
      { token: 'gh pr review', role: 'Review Command', explanation: 'GitHub CLI command to submit a formal review.' },
      { token: '--approve', role: 'Decision Flag', explanation: 'Formally stamps the PR as approved for merge.' },
      { token: '--body', role: 'Comment', explanation: 'High-level commentary summarizing the reviewer\'s thoughts.' },
    ],

    actionStage: {
      before: {
        label: 'PR Under Review',
        description: 'Pull Request opened with 4 files changed. Reviewer opens "Files changed" tab.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Review Pending',
        historyCommits: [{ hash: 'R1', message: 'feat: add stripe checkout flow' }],
        whatChanged: ['Diff displayed in side-by-side or split mode.'],
        whatDidNotChange: ['No comments or approval stamp yet.'],
      },
      running: {
        label: 'Leaving Inline Suggestions',
        description: 'Reviewer clicks line 42 and leaves a suggestion box: ```suggestion price * 100 ```.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: '1 Request Changes, 2 Comments',
        historyCommits: [{ hash: 'R1', message: 'feat: add stripe checkout flow' }],
        whatChanged: ['Author receives actionable line-item feedback.'],
        whatDidNotChange: ['Main branch remains protected until revisions are submitted.'],
      },
      after: {
        label: 'Approved & Resolved',
        description: 'Author committed the suggestion; reviewer approves with green checkmark.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Status: Approved',
        historyCommits: [
          { hash: 'R2', message: 'fix: apply suggestion for cents conversion' },
          { hash: 'R1', message: 'feat: add stripe checkout flow' },
        ],
        whatChanged: ['Branch meets protection requirements; ready to merge.'],
        whatDidNotChange: ['Review history remains preserved forever in PR discussion.'],
      },
    },

    variations: [
      {
        flag: 'Approve',
        title: 'Formal Approval via CLI',
        syntax: 'gh pr review <pr-number> --approve -b "<notes>"',
        whatItDoes: 'Submits a formal approval review, unblocking the PR to merge if required approval counts are met.',
        whenToUse: 'When code passes inspection, automated CI tests are green, and architecture is sound.',
        example: 'gh pr review 42 --approve -b "LGTM, clean implementation!"',
        snippet: 'gh pr review <number> --approve',
      },
      {
        flag: 'Request Changes',
        title: 'Request Changes (Block Merge)',
        syntax: 'gh pr review <pr-number> --request-changes -b "<reasons>"',
        whatItDoes: 'Blocks the PR from merging until the author resolves designated flaws, security bugs, or test gaps.',
        whenToUse: 'When critical flaws or architectural regressions must be addressed before landing on main.',
        example: 'gh pr review 42 --request-changes -b "Missing CSRF token validation on the new endpoint."',
        snippet: 'gh pr review <number> --request-changes -b "<text>"',
      },
      {
        flag: 'CLI Diff',
        title: 'Inspect PR Diff in Terminal',
        syntax: 'gh pr diff <pr-number>',
        whatItDoes: 'Displays all file changes and code differences in the terminal with colored syntax highlighting.',
        whenToUse: 'Fast command-line review without switching context to a web browser.',
        example: 'gh pr diff 42',
        snippet: 'gh pr diff <number>',
      },
    ],

    scenarios: [
      {
        id: 'sc-gh-review-1',
        title: 'Spotting an Unindexed Database Query in Code Review',
        context: 'While reviewing a teammate\'s PR, you notice a query on the users table that will cause a full-table scan on 500k records in production.',
        question: 'What is the most constructive and effective way to provide review feedback?',
        options: [
          {
            label: 'Leave an inline suggestion on the migration file proposing an index with an explanation of the query plan',
            command: 'gh pr review --comment -b "Suggested adding an index on user_id to prevent full-table scans at scale."',
            isCorrect: true,
            explanation: 'Constructive, actionable inline suggestions with technical rationale empower teammates to fix issues quickly.',
          },
          {
            label: 'Reject the PR with a vague comment saying "This code is slow" without specifics',
            command: 'No command',
            isCorrect: false,
            explanation: 'Vague negative feedback slows teams down and damages collaborative morale.',
          },
        ],
        whenToUse: 'When you notice an off-by-one error or missing null check.',
        commandExample: 'Use GitHub suggestion block: ```suggestion\\nif (!user) return null;\\n```',
        note: 'Author can accept with 1 click without leaving browser.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'GitHub Suggestion Blocks (```suggestion)',
        commandB: 'Standard Text Comments',
        aspect: 'Actionability & Speed',
        descriptionA: 'Allows the author to accept and commit the reviewer\'s exact suggested 1-line or multi-line fix with a single click in browser.',
        descriptionB: 'Requires the author to manually open their editor, rewrite the code, commit, and push again.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Submitting a review saying "LGTM" (Looks Good To Me) without reading the diff or running tests',
        whyItHappens: 'Rushing or rubber-stamping teammates\' work under deadline pressure.',
        fix: 'Review diffs thoroughly; test locally when changes touch critical paths like billing, authentication, or migrations.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"function calculateTotal(price) { return price; }\" > checkout.js",
          "git add checkout.js",
          "git commit -m \"feat: calculate total\"",
          "echo \"function applyDiscount(price) { return price * 0.9; }\" >> checkout.js"
  ],
      guidedSteps: [
          {
                  "instruction": "Review the diff of your local changes before opening a PR review",
                  "command": "git diff",
                  "hint": "Type git diff"
          },
          {
                  "instruction": "Stage the reviewed improvements",
                  "command": "git add checkout.js",
                  "hint": "Type git add checkout.js"
          },
          {
                  "instruction": "Commit the verified changes",
                  "command": "git commit -m \"feat: add discount calculation after review\"",
                  "hint": "Type git commit -m <msg>"
          }
  ],
      initialFiles: [{ name: 'checkout.js', content: 'function calculateTotal(price) {\n  return price;\n}\n' }],
      initialCommits: [{ hash: 'c5b4a3f', message: 'feat: calculate total' }],
      targetTask: 'Check the git diff of your local changes to self-review before opening PR.',
      hints: ['Run `git diff`.'],
      validationRegex: /git diff/i,
      solutionCommands: ['git diff'],
    },

    challenge: {
      title: 'Pre-PR Self-Review',
      instructions: 'Inspect differences before submitting code to teammates to catch accidental console.log or secrets.',
      startingState: 'Uncommitted edits present in working tree.',
      goalState: 'Diff reviewed and confirmed clean.',
      hints: ['Run `git diff` to view modifications.'],
    },

    reference: {
      officialDocUrl: 'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/about-pull-request-reviews',
      syntaxCheatSheet: [
        'gh pr diff <pr-number> : View full pull request diff in terminal pager',
        'gh pr review <number> --approve : Approve pull request',
        'gh pr review <number> --request-changes : Request revisions',
      ],
      commonErrors: [
        { error: 'Review comments sound overly critical or harsh', remedy: 'Focus on code, not the person. Use prefixes like "nit:" for styling, or phrase as questions ("What happens if user is null?").' },
      ],
      mentalModelDiagram: {
        concept: 'Review Feedback Loop',
        explanation: 'Author pushes commits -> Reviewer leaves suggestions -> Author pushes fixes to same branch -> PR auto-updates -> Reviewer Approves.',
        storageLocation: 'GitHub Pull Request review comments DB attached to commit SHAs.',
      },
      edgeCases: ['When an author pushes new commits to a PR, previously submitted approvals can be automatically dismissed if branch protection requires it.'],
    },
  },

  'c-gh-upstream-sync': {
    id: 'c-gh-upstream-sync',
    command: 'upstream sync',
    title: 'Syncing Fork with Upstream',
    topicId: 'topic-06',
    topicNumber: '06',
    topicTitle: 'Collaboration on GitHub',
    subtitle: 'Keeping your personal fork aligned with the original parent repository',
    badges: ['Intermediate', 'Forks', 'Maintenance'],
    quote: 'Open source moves fast. If you do not sync your fork weekly, merge conflicts will bury your pull requests.',
    difficulty: 'Intermediate',

    whatIsIt:
      'Syncing a fork is the process of bringing your personal GitHub copy and local clone up to date with new commits that were merged into the original parent ("upstream") repository. This ensures your feature branches are branched off the latest master/main commit rather than a months-old snapshot.',
    inSimpleWords:
      'Refreshing your copy of the master recipe book so you don\'t waste hours fixing a problem that someone else already fixed yesterday.',
    whyDoYouNeedIt:
      'If upstream moves ahead 50 commits while you write your feature, your PR will either fail automated tests or produce thorny merge conflicts. Regular syncing keeps your diff minimal and easy for maintainers to merge.',
    realWorldAnalogy:
      'Downloading software updates on your smartphone. If you keep running version 1.0 while the cloud backend is on version 5.0, your app will eventually refuse to connect.',

    syntaxCode: 'git fetch upstream && git switch main && git merge upstream/main',
    syntaxTokens: [
      { token: 'git fetch upstream', role: 'Fetch Action', explanation: 'Downloads latest commits from original parent repo.' },
      { token: 'git switch main', role: 'Branch Switch', explanation: 'Ensures you are standing on your local main branch.' },
      { token: 'git merge upstream/main', role: 'Fast-Forward Merge', explanation: 'Advances your local pointer to match upstream main.' },
    ],

    actionStage: {
      before: {
        label: 'Fork Lagging Behind',
        description: 'Upstream has commit U5, but your fork and local main are stuck on U1.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Behind by 4 commits',
        historyCommits: [
          { hash: 'U1', message: 'Initial baseline' },
        ],
        whatChanged: ['Upstream repo advanced while your fork stayed stationary.'],
        whatDidNotChange: ['Local branch is out of date.'],
      },
      running: {
        label: 'Fetching Upstream Refs',
        description: 'Downloading upstream commit objects into local storage without touching working files.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'git fetch upstream',
        historyCommits: [
          { hash: 'U5', message: 'feat: upstream latest release (upstream/main)' },
          { hash: 'U1', message: 'Initial baseline (HEAD -> main, origin/main)' },
        ],
        whatChanged: ['Remote tracking pointer upstream/main updated.'],
        whatDidNotChange: ['Local main branch pointer has not moved yet.'],
      },
      after: {
        label: 'Fast-Forwarded and Pushed',
        description: 'Local main fast-forwarded to U5 and pushed to origin/main. 100% in sync!',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'In sync with upstream',
        historyCommits: [
          { hash: 'U5', message: 'feat: upstream latest release (HEAD -> main, origin/main, upstream/main)' },
        ],
        whatChanged: ['Both local and cloud fork are fully up to date.'],
        whatDidNotChange: ['No merge conflicts occurred because main was never edited directly.'],
      },
    },

    variations: [
      {
        flag: 'Fast-Forward Sync',
        title: 'Standard Local Upstream Sync',
        syntax: 'git fetch upstream && git switch main && git merge upstream/main --ff-only',
        whatItDoes: 'Fetches upstream commits and fast-forwards your local main branch cleanly.',
        whenToUse: 'Before starting any new feature branch or rebasing current work.',
        example: 'git fetch upstream && git switch main && git merge upstream/main --ff-only',
        snippet: 'git fetch upstream && git merge upstream/main',
      },
      {
        flag: 'gh repo sync',
        title: 'One-Line CLI Fork Sync',
        syntax: 'gh repo sync <owner>/<repo> -b main',
        whatItDoes: 'Synchronizes both your cloud GitHub fork and local clone with upstream in one command.',
        whenToUse: 'Fast daily sync routine.',
        example: 'gh repo sync myuser/react -b main',
        snippet: 'gh repo sync -b main',
      },
      {
        flag: 'Rebase Feature',
        title: 'Rebase Active Feature on Upstream',
        syntax: 'git switch feature && git rebase upstream/main',
        whatItDoes: 'Replays your active feature commits on top of the latest upstream main branch.',
        whenToUse: 'Resolving merge conflicts before submitting your open-source PR.',
        example: 'git switch my-feature && git rebase upstream/main',
        snippet: 'git rebase upstream/main',
      },
    ],

    scenarios: [
      {
        id: 'sc-gh-sync-1',
        title: 'Your Open-Source PR is 20 Commits Behind Upstream',
        context: 'The upstream maintainer says: "Please rebase on the latest main before we can merge your PR."',
        question: 'What commands will update your branch without adding messy merge commits?',
        options: [
          {
            label: 'Fetch upstream, rebase your feature branch on upstream/main, resolve any conflicts, and force push with lease',
            command: 'git fetch upstream && git switch my-feature && git rebase upstream/main && git push --force-with-lease',
            isCorrect: true,
            explanation: 'Rebasing places your feature commits neatly on top of the freshest upstream code, maintaining a clean linear history.',
          },
          {
            label: 'Merge upstream/main directly into your feature branch and regular push',
            command: 'git merge upstream/main',
            isCorrect: false,
            explanation: 'Many open-source projects reject merge commits in PR branches because it clutters project history.',
          },
        ],
        whenToUse: 'When GitHub PR says "This branch has conflicts that must be resolved".',
        commandExample: 'git fetch upstream && git rebase upstream/main',
        note: 'Fix conflicts locally commit-by-commit and force-push.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'git fetch upstream && git merge upstream/main',
        commandB: 'gh repo sync',
        aspect: 'Scope & Execution',
        descriptionA: 'Runs purely locally through Git; requires you to subsequently git push origin main to update your cloud fork.',
        descriptionB: 'Calls GitHub API to fast-forward your remote cloud fork on GitHub first, then pulls to your local clone.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Committing feature work directly onto your fork\'s `main` branch',
        whyItHappens: 'Treating fork main like a working scratchpad.',
        fix: 'If fork main diverges from upstream, resetting it requires `git reset --hard upstream/main`. Always create dedicated feature branches.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"console.log(\\\"v1.0.0\\\");\" > app.js",
          "git add app.js",
          "git commit -m \"chore: initial app setup\"",
          "git remote add upstream https://github.com/upstream-org/app.git"
  ],
      guidedSteps: [
          {
                  "instruction": "Inspect remote upstream endpoints",
                  "command": "git remote -v",
                  "hint": "Type git remote -v"
          },
          {
                  "instruction": "Fetch latest commits from upstream remote",
                  "command": "git fetch upstream",
                  "hint": "Type git fetch upstream"
          },
          {
                  "instruction": "Check repository synchronization status",
                  "command": "git status",
                  "hint": "Type git status"
          }
  ],
      initialFiles: [{ name: 'app.js', content: 'console.log("v1.0.0");\n' }],
      initialCommits: [{ hash: 'a1a1a1a', message: 'chore: initial app setup' }],
      targetTask: 'Check remote branch tracking status with git remote show.',
      hints: ['Run `git remote -v`.'],
      validationRegex: /git remote/i,
      solutionCommands: ['git remote -v'],
    },

    challenge: {
      title: 'Inspect Remote Fetch Heads',
      instructions: 'Check your remotes to verify upstream is registered for fetching.',
      startingState: 'Forked repository locally configured.',
      goalState: 'Remotes verified with git remote -v.',
      hints: ['Run `git remote -v`.'],
    },

    reference: {
      officialDocUrl: 'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork',
      syntaxCheatSheet: [
        'git remote add upstream <url> : Connect to original repository',
        'git fetch upstream : Fetch upstream branch pointers',
        'git merge upstream/main : Merge latest upstream changes into current branch',
        'gh repo sync : GitHub CLI shortcut to sync fork',
      ],
      commonErrors: [
        { error: 'fatal: \'upstream\' does not appear to be a git repository', remedy: 'Run `git remote add upstream https://github.com/original-owner/repo.git` first.' },
      ],
      mentalModelDiagram: {
        concept: 'Upstream Synchronization Flow',
        explanation: 'Upstream Main -> (fetch & merge) -> Local Main -> (push) -> Origin Main (Your Fork).',
        storageLocation: '.git/refs/remotes/upstream/main pointer file.',
      },
      edgeCases: ['Never make commits directly on your fork\'s `main` branch. Always keep `main` pristine so it can fast-forward cleanly without merge commits.'],
    },
  },

  'c-gh-pr-squash': {
    id: 'c-gh-pr-squash',
    command: 'merge options',
    title: 'Squash vs Merge Commit vs Rebase',
    topicId: 'topic-06',
    topicNumber: '06',
    topicTitle: 'Collaboration on GitHub',
    subtitle: 'Choosing the right history strategy when merging Pull Requests into main',
    badges: ['Intermediate', 'Git Hygiene', 'History Strategy'],
    quote: 'History is not an unfiltered surveillance tape; it is an organized storybook of your engineering architecture.',
    difficulty: 'Intermediate',

    whatIsIt:
      'GitHub provides three distinct merge strategies when closing a Pull Request: (1) **Create a merge commit** (preserves all individual commits and creates a 2-parent merge node), (2) **Squash and merge** (combines all PR commits into one single commit on the base branch), and (3) **Rebase and merge** (replays all individual commits onto the base branch linearly without a merge commit).',
    inSimpleWords:
      'Merge commit keeps the whole messy diary. Squash compresses the messy diary into a single neat summary paragraph. Rebase tears the diary pages out and tapes them neatly onto the end of the book.',
    whyDoYouNeedIt:
      'During feature development, developers create messy interim commits ("fix typo", "wip", "tests passing now"). Merging all 15 commits directly pollutes git log and makes git bisect painful. Knowing when to Squash vs Rebase keeps history clean and readable.',
    realWorldAnalogy:
      'Writing an essay. You don\'t submit your 40 crumpled rough-draft napkins to your professor (Merge Commit). You hand in the final polished version (Squash).',

    syntaxCode: 'gh pr merge <pr-number> --squash --delete-branch',
    syntaxTokens: [
      { token: 'gh pr merge', role: 'Merge Trigger', explanation: 'GitHub CLI command to merge an approved PR.' },
      { token: '--squash', role: 'Strategy Flag', explanation: 'Squashes all PR commits into a single atomic commit.' },
      { token: '--delete-branch', role: 'Cleanup Flag', explanation: 'Automatically deletes remote feature branch after merge.' },
    ],

    actionStage: {
      before: {
        label: 'Messy Feature History',
        description: 'Branch `feature/auth` has 5 commits: "add auth", "fix lint", "wip", "fix typo", "done".',
        workingDirectory: [],
        stagingArea: [],
        commandPill: '5 WIP Commits on Branch',
        historyCommits: [
          { hash: 'W5', message: 'finally done' },
          { hash: 'W4', message: 'fix typo' },
          { hash: 'W3', message: 'wip tests' },
          { hash: 'W2', message: 'lint error fix' },
          { hash: 'W1', message: 'start auth' },
        ],
        whatChanged: ['Interim commits created during work.'],
        whatDidNotChange: ['Target main branch has not changed.'],
      },
      running: {
        label: 'Executing Squash Merge',
        description: 'GitHub flattens all 5 diffs into one single patch, applying it atop main.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'gh pr merge --squash',
        historyCommits: [
          { hash: 'S1', message: 'feat(auth): complete OAuth2 login flow (#42)' },
          { hash: 'M0', message: 'previous main commit' },
        ],
        whatChanged: ['Only 1 clean, atomic commit lands on main.'],
        whatDidNotChange: ['Individual messy commit hashes do not pollute main.'],
      },
      after: {
        label: 'Pristine Main History',
        description: 'Main git log shows one clear commit per feature. Reverting or cherry-picking is a breeze.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Linear & Revertable',
        historyCommits: [
          { hash: 'S1', message: 'feat(auth): complete OAuth2 login flow (#42)' },
          { hash: 'M0', message: 'previous main commit' },
        ],
        whatChanged: ['Main history remains clean, scannable, and atomic.'],
        whatDidNotChange: ['PR web discussion page still preserves all individual commit links.'],
      },
    },

    variations: [
      {
        flag: 'Squash Merge',
        title: 'Squash and Merge',
        syntax: 'gh pr merge <pr-number> --squash --delete-branch',
        whatItDoes: 'Combines all PR commits into 1 single commit on the base branch and deletes the remote branch.',
        whenToUse: 'Best for 90% of feature branches containing interim WIP, typo, and testing commits.',
        example: 'gh pr merge 42 --squash --delete-branch',
        snippet: 'gh pr merge <number> --squash',
      },
      {
        flag: 'Merge Commit',
        title: 'Create a Merge Commit',
        syntax: 'gh pr merge <pr-number> --merge --delete-branch',
        whatItDoes: 'Preserves the entire branch commit history and appends an explicit 2-parent merge commit.',
        whenToUse: 'When each individual commit is already polished and represents a distinct architectural milestone.',
        example: 'gh pr merge 42 --merge --delete-branch',
        snippet: 'gh pr merge <number> --merge',
      },
      {
        flag: 'Rebase Merge',
        title: 'Rebase and Merge',
        syntax: 'gh pr merge <pr-number> --rebase --delete-branch',
        whatItDoes: 'Replays each branch commit individually onto the base branch without creating a merge commit.',
        whenToUse: 'When team rules require a strictly linear history while preserving individual commit authors.',
        example: 'gh pr merge 42 --rebase --delete-branch',
        snippet: 'gh pr merge <number> --rebase',
      },
    ],

    scenarios: [
      {
        id: 'sc-gh-squash-1',
        title: 'Messy Feature Branch with 12 Trial-and-Error Commits',
        context: 'Your feature branch has 12 commits like "wip", "fixed typo", "broken test", "fixed test again", "now it works".',
        question: 'Which merge strategy should you choose to keep the project\'s production history clean and readable?',
        options: [
          {
            label: 'Squash and Merge into a single atomic commit with a conventional message like feat(auth): add OAuth2',
            command: 'gh pr merge --squash',
            isCorrect: true,
            explanation: 'Squashing encapsulates all temporary trial-and-error noise into a single clean, revertible commit on main.',
          },
          {
            label: 'Create a Merge Commit preserving all 12 messy commits in production git log',
            command: 'gh pr merge --merge',
            isCorrect: false,
            explanation: 'Polluting main with "wip" and "fix typo" commits makes git bisect difficult and clutters history logs.',
          },
        ],
        whenToUse: 'Merging 1-3 day feature branches where interim commits are noisy.',
        commandExample: 'gh pr merge 12 --squash --delete-branch',
        note: 'Keeps main log at 1 commit per PR, easily revertible.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'Squash and Merge',
        commandB: 'Create a Merge Commit',
        aspect: 'Historical Granularity',
        descriptionA: 'Compresses all branch commits into 1 single commit on main. Great for feature branches with interim noise.',
        descriptionB: 'Retains every individual commit plus a merge commit. Best for long-lived releases or multi-author branches.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Squashing a massive multi-month refactor containing 5 independent features into a single 10,000-line commit',
        whyItHappens: 'Defaulting to squash for every PR without considering atomic revertibility.',
        fix: 'If a PR contains multiple independent architectural changes, keep them as separate clean commits or split into smaller PRs.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"export const login = () => true;\" > login.js",
          "git add login.js",
          "git commit -m \"feat: add login\"",
          "git branch feature/login-flow",
          "git switch feature/login-flow",
          "echo \"// add validation\" >> login.js",
          "git commit -am \"fix: typo in login\""
  ],
      guidedSteps: [
          {
                  "instruction": "Check the granular draft commits in your feature branch",
                  "command": "git log --oneline -n 2",
                  "hint": "Type git log --oneline -n 2"
          },
          {
                  "instruction": "Switch back to the main branch",
                  "command": "git switch main",
                  "hint": "Type git switch main"
          },
          {
                  "instruction": "Squash merge the feature branch into main",
                  "command": "git merge --squash feature/login-flow",
                  "hint": "Type git merge --squash feature/login-flow"
          }
  ],
      initialFiles: [{ name: 'login.js', content: 'export const login = () => true;\n' }],
      initialCommits: [
        { hash: '1111111', message: 'feat: add login' },
        { hash: '2222222', message: 'fix: typo in login' },
      ],
      targetTask: 'Check git log oneline to see commit granularity.',
      hints: ['Run `git log --oneline`.'],
      validationRegex: /git log/i,
      solutionCommands: ['git log --oneline'],
    },

    challenge: {
      title: 'Analyze Commit History',
      instructions: 'Review commit history to evaluate if commits should be squashed.',
      startingState: 'Branch with 2 commits.',
      goalState: 'Commit log displayed via git log --oneline.',
      hints: ['Use `git log --oneline`.'],
    },

    reference: {
      officialDocUrl: 'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-into-a-base-branch/about-pull-request-merges',
      syntaxCheatSheet: [
        'gh pr merge <id> --squash : Squash all PR commits into one',
        'gh pr merge <id> --merge : Create explicit 2-parent merge commit',
        'gh pr merge <id> --rebase : Linearly rebase commits without merge node',
      ],
      commonErrors: [
        { error: 'Squash destroyed author attribution', remedy: 'GitHub sets the commit author to the PR creator, but adds "Co-authored-by: user <email>" trailers in the commit message body for contributors.' },
      ],
      mentalModelDiagram: {
        concept: 'Squash vs Merge Comparison',
        explanation: 'Merge Commit: (A--B--C)\\n                \\--M (branch preserved)\\nSquash: A--B--C becomes single commit S on main.',
        storageLocation: 'GitHub repository settings under "Pull Requests -> Allow squash merging".',
      },
      edgeCases: ['Rebase and merge cannot be used if the feature branch contains merge commits; GitHub will reject it.'],
    },
  },

  'c-gh-protected-branches': {
    id: 'c-gh-protected-branches',
    command: 'branch rules',
    title: 'Protected Branches & Rulesets',
    topicId: 'topic-06',
    topicNumber: '06',
    topicTitle: 'Collaboration on GitHub',
    subtitle: 'Enforcing required reviews, passing CI status checks, and preventing accidental deletions',
    badges: ['Intermediate', 'Security', 'DevOps'],
    quote: 'Trust your team, but protect your production branches with automated guardrails.',
    difficulty: 'Intermediate',

    whatIsIt:
      'Protected branches and GitHub Rulesets are repository security configurations that prevent users from accidentally damaging core branches like `main` or `production`. They can block force pushes, disallow branch deletions, require pull request reviews before merging, and require automated CI checks to pass before code can land.',
    inSimpleWords:
      'A locked electronic turnstile at the building entrance that will not let anyone enter without scanning a valid security badge and passing the metal detector.',
    whyDoYouNeedIt:
      'Without branch protection, any developer (or compromised token) can run `git push --force origin main` and instantly wipe out months of company history. Protection rules guarantee that every commit on production has passed tests and been peer-reviewed.',
    realWorldAnalogy:
      'Like bank vaults with two-key requirements. Neither teller nor manager can open the safety deposit box alone; both keys must be inserted simultaneously.',

    syntaxCode: 'Repository Settings -> Rules -> Rulesets -> New ruleset',
    syntaxTokens: [
      { token: 'Require a pull request', role: 'Rule', explanation: 'Disallows direct `git push origin main`.' },
      { token: 'Require approvals: 1', role: 'Threshold', explanation: 'At least one peer must stamp Approve on the PR.' },
      { token: 'Require status checks', role: 'CI Gate', explanation: 'Automated CI/CD jobs must pass green before merge.' },
    ],

    actionStage: {
      before: {
        label: 'Unprotected Branch (Danger Zone)',
        description: 'Main branch is completely open. Direct push or `git push --force` will succeed immediately.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Direct push allowed',
        historyCommits: [{ hash: 'P1', message: 'production code' }],
        whatChanged: ['No safety net active.'],
        whatDidNotChange: ['Vulnerable to accidental overwrite.'],
      },
      running: {
        label: 'Attempting Direct Push',
        description: 'Developer runs `git push origin main`. GitHub server intercepts and evaluates protection rules.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'git push origin main',
        historyCommits: [{ hash: 'P1', message: 'production code' }],
        whatChanged: ['GitHub rejects push with error: "remote: error: GH006: Protected branch hook declined".'],
        whatDidNotChange: ['Remote main branch remains completely untouched and safe.'],
      },
      after: {
        label: 'Compliant Workflow Enforced',
        description: 'Developer pushes to a feature branch, opens PR #88, tests pass, peer approves, PR merges cleanly.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'PR #88 Merged through Ruleset',
        historyCommits: [
          { hash: 'M2', message: 'Merge PR #88 (Reviewed by @lead)' },
          { hash: 'P1', message: 'production code' },
        ],
        whatChanged: ['All production commits have verified audit trails and green CI.'],
        whatDidNotChange: ['Developers retain full freedom on their feature branches.'],
      },
    },

    variations: [
      {
        flag: 'CLI Ruleset',
        title: 'Create Ruleset via CLI',
        syntax: 'gh ruleset create --name "Protect Main" --enforcement active',
        whatItDoes: 'Configures branch security rules targeting main to block force pushes and enforce pull request reviews.',
        whenToUse: 'Automating consistent branch policies across organizations.',
        example: 'gh ruleset create --name "Protect Main"',
        snippet: 'gh ruleset create --name "<name>"',
      },
      {
        flag: 'Peer Review Gate',
        title: 'Mandatory Peer Review',
        syntax: 'Require pull request before merging (1+ approvals)',
        whatItDoes: 'Disallows direct pushes to main and blocks PR merging until designated code owners or peers approve.',
        whenToUse: 'All production repositories to eliminate single points of failure.',
        example: 'Settings -> Rulesets -> Require a pull request before merging',
        snippet: 'Require a pull request before merging',
      },
      {
        flag: 'CI Gate',
        title: 'Automated CI Status Checks',
        syntax: 'Require status checks to pass before merging',
        whatItDoes: 'Guarantees that automated test suites, linters, and vulnerability scans are green before merging.',
        whenToUse: 'Preventing regressions from entering production builds.',
        example: 'Settings -> Rulesets -> Require status checks to pass',
        snippet: 'Require status checks to pass',
      },
    ],

    scenarios: [
      {
        id: 'sc-gh-protect-1',
        title: 'Accidental Direct Push to Main Branch',
        context: 'A developer accidentally runs git push origin main instead of pushing their feature branch.',
        question: 'How does GitHub Branch Protection respond?',
        options: [
          {
            label: 'GitHub intercepts the push and rejects it with: "Protected branch hook declined: direct push not allowed"',
            command: 'git push origin main',
            isCorrect: true,
            explanation: 'Branch protection acts as an automated server-side pre-receive hook that protects main from direct pushes.',
          },
          {
            label: 'GitHub silently creates a new branch named main-2 and pushes there',
            command: 'No command',
            isCorrect: false,
            explanation: 'Git never renames branches automatically on push; it explicitly rejects unauthorized operations.',
          },
        ],
        whenToUse: 'On any professional repository before adding contributors.',
        commandExample: 'Create ruleset targeting `default branch` requiring PR + 1 review + CI pass.',
        note: 'Admins can optionally be exempted or included.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'Classic Branch Protection Rules',
        commandB: 'GitHub Rulesets (Modern)',
        aspect: 'Configuration & Scalability',
        descriptionA: 'Configured per individual branch pattern in a single repository; can be accidentally bypassed by repo admins.',
        descriptionB: 'Modern organization-wide or repo-wide rules supporting tiered bypass permissions and multiple target branches.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Leaving "Include administrators" unchecked in branch protection rules',
        whyItHappens: 'Assuming admins will never make accidental mistakes or push wrong branches.',
        fix: 'Always enforce rules on administrators or use modern Rulesets with restricted bypass lists so everyone follows PR reviews.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"// Production Code protected by GitHub Rulesets\" > secure.ts",
          "git add secure.ts",
          "git commit -m \"feat: add production security logic\"",
          "git branch staging"
  ],
      guidedSteps: [
          {
                  "instruction": "Inspect all existing branches",
                  "command": "git branch",
                  "hint": "Type git branch"
          },
          {
                  "instruction": "Switch to the staging branch for testing",
                  "command": "git switch staging",
                  "hint": "Type git switch staging"
          },
          {
                  "instruction": "Verify current branch isolation",
                  "command": "git status",
                  "hint": "Type git status"
          }
  ],
      initialFiles: [{ name: 'secure.ts', content: '// Production Code protected by GitHub Rulesets\n' }],
      initialCommits: [{ hash: '9988776', message: 'feat: add production security logic' }],
      targetTask: 'Inspect current branch with git branch --show-current.',
      hints: ['Run `git branch`.'],
      validationRegex: /git branch/i,
      solutionCommands: ['git branch'],
    },

    challenge: {
      title: 'Check Active Branch Name',
      instructions: 'Verify which branch you are on so you do not attempt direct pushes to main.',
      startingState: 'Repository checked out.',
      goalState: 'Active branch name printed to console.',
      hints: ['Run `git branch --show-current`.'],
    },

    reference: {
      officialDocUrl: 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets',
      syntaxCheatSheet: [
        'gh ruleset list : List active branch rulesets in current repo',
        'gh ruleset view <id> : View rule requirements and status checks',
      ],
      commonErrors: [
        { error: 'remote: error: GH006: Protected branch hook declined', remedy: 'Direct pushes are forbidden. Create a feature branch (`git switch -c feature`), push it, and open a Pull Request.' },
        { error: 'Required status checks must pass before merging', remedy: 'Inspect the failed CI job on GitHub Actions and push fixes to your feature branch.' },
      ],
      mentalModelDiagram: {
        concept: 'Branch Security Shield',
        explanation: 'Direct Push -> BLOCKED. PR -> Tests Pass -> Approval Received -> MERGE ALLOWED.',
        storageLocation: 'GitHub repository metadata settings table.',
      },
      edgeCases: ['Repository administrators can bypass branch protections unless "Do not allow bypassing the above settings" is explicitly checked.'],
    },
  },
};
