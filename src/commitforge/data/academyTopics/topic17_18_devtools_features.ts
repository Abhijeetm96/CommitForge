import { UniversalConcept } from '../unifiedAcademyData';

export const TOPIC_17_18_CONCEPTS: Record<string, UniversalConcept> = {
  // ==========================================================================
  // TOPIC 17: GitHub Developer Tools
  // ==========================================================================
  'c-gh-cli': {
    id: 'c-gh-cli',
    command: 'gh pr create',
    title: 'GitHub CLI (`gh`)',
    topicId: 'topic-17',
    topicNumber: '17',
    topicTitle: 'GitHub Developer Tools',
    subtitle: 'Managing pull requests, issues, releases, and repository settings directly from your terminal',
    badges: ['Intermediate', 'Developer Tools', 'CLI'],
    quote: 'Stay in your flow state. The GitHub CLI brings the entire GitHub web interface right to your command line.',
    difficulty: 'Intermediate',

    whatIsIt:
      'GitHub CLI (`gh`) is GitHub\'s official command-line tool. It brings pull requests, issues, GitHub Actions, releases, and repo configuration to your terminal alongside Git. Instead of switching back and forth between your code editor and web browser to open PRs, check CI runs, or review teammates\' diffs, you can do it all without leaving the command line.',
    inSimpleWords:
      'A remote control for GitHub that works right inside your terminal, so you don\'t have to open Chrome every time you want to submit code.',
    whyDoYouNeedIt:
      'Context-switching between the terminal and browser breaks focus. Opening a PR via `gh pr create --fill` takes 2 seconds and automatically opens the PR, sets assignees, and links issues without 10 manual clicks in a browser.',
    realWorldAnalogy:
      'A drive-thru window at a restaurant. Instead of finding parking, walking inside, waiting in line, and ordering at the counter, you order and receive your meal directly through the car window.',

    syntaxCode: 'gh pr create --title "<title>" --body "<body>" --web',
    syntaxTokens: [
      { token: 'gh', role: 'GitHub CLI Binary', explanation: 'Official command-line executable for GitHub.' },
      { token: 'pr create', role: 'Subcommand', explanation: 'Interactive or automated Pull Request creation.' },
      { token: '--fill', role: 'Smart Flag', explanation: 'Prefills title and description automatically from commit history.' },
    ],

    actionStage: {
      before: {
        label: 'Terminal Flow Interrupted',
        description: 'Developer commits code on feature branch. Normally must open browser, navigate to repo, and click "New PR".',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'git push origin feature/auth',
        historyCommits: [{ hash: 'F1', message: 'feat: add auth' }],
        whatChanged: ['Branch pushed.'],
        whatDidNotChange: ['No PR opened yet.'],
      },
      running: {
        label: 'Executing gh pr create',
        description: 'Running `gh pr create --fill`. CLI detects target base `main`, formats title and description, and creates PR #42.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'gh pr create --fill',
        historyCommits: [],
        whatChanged: ['PR created on GitHub servers instantly.'],
        whatDidNotChange: ['Zero browser tabs opened.'],
      },
      after: {
        label: 'PR Active with CI Running',
        description: 'Terminal prints: `https://github.com/org/repo/pull/42`. Developer runs `gh pr checks` to watch CI in terminal.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'gh pr status (Green)',
        historyCommits: [],
        whatChanged: ['Complete PR workflow managed directly in terminal.'],
        whatDidNotChange: ['Full developer focus preserved.'],
      },
    },

    variations: [
      {
        flag: 'gh pr create',
        title: 'Open Pull Request',
        syntax: 'gh pr create [--fill] [--draft] [--title "<title>"] [--body "<body>"]',
        whatItDoes: 'Creates a Pull Request directly from your current branch to the repository base branch.',
        whenToUse: 'Submitting your feature branch for review without leaving the command line or opening a browser.',
        example: 'gh pr create --fill --draft',
        snippet: 'gh pr create --fill',
        warning: 'Ensure your current branch has already been pushed to the remote (`git push -u origin <branch>`), or pass `--head`.',
      },
      {
        flag: 'gh pr checkout',
        title: 'Fetch and Switch to PR Branch',
        syntax: 'gh pr checkout <pr-number-or-url>',
        whatItDoes: 'Fetches the PR branch from remote (including forks) and switches your local workspace to it with tracking.',
        whenToUse: 'Testing a teammate\'s PR locally, running tests, or resolving complex merge conflicts.',
        example: 'gh pr checkout 142',
        snippet: 'gh pr checkout 142',
      },
      {
        flag: 'gh run watch',
        title: 'Live Stream Actions CI in Terminal',
        syntax: 'gh run watch [<run-id>]',
        whatItDoes: 'Streams real-time step execution logs from running GitHub Actions CI workflows directly in your terminal.',
        whenToUse: 'Monitoring continuous integration test runs without keeping a browser window open.',
        example: 'gh run watch',
        snippet: 'gh run watch',
      },
      {
        flag: 'gh repo clone',
        title: 'Clone Repository by Short Name',
        syntax: 'gh repo clone <owner>/<repo> [<directory>]',
        whatItDoes: 'Clones any repository using clean owner/name shorthand without looking up HTTPS or SSH URLs.',
        whenToUse: 'Cloning organization repositories or popular open source projects quickly.',
        example: 'gh repo clone facebook/react',
        snippet: 'gh repo clone owner/repo',
      },
      {
        flag: 'gh issue',
        title: 'Manage Issues from Command Line',
        syntax: 'gh issue create --title "<title>" --body "<body>" --label "bug"',
        whatItDoes: 'Creates, lists, views, or closes GitHub issues directly in your terminal shell.',
        whenToUse: 'Logging a bug immediately when you discover it while coding.',
        example: 'gh issue list --assignee "@me"',
        snippet: 'gh issue list',
      },
    ],

    scenarios: [
      {
        id: 'sc-gh-cli-1',
        title: 'Rapid PR Creation from Terminal Without Leaving Editor',
        context: 'You just finished coding a bug fix on branch `fix/payment-timeout` and committed your changes with `git commit -m "fix: extend payment timeout to 30s"`. You want to open a PR immediately.',
        question: 'What is the fastest command to push your branch and open a PR with the title and description prefilled from your commit?',
        options: [
          {
            label: 'Run `git push -u origin HEAD && gh pr create --fill`',
            command: 'git push -u origin HEAD && gh pr create --fill',
            isCorrect: true,
            explanation: 'This pushes the current branch to origin and uses `gh pr create --fill` to automatically extract the PR title and description directly from the commit history.',
          },
          {
            label: 'Open Chrome, navigate to github.com, search for the repo, and click the Compare & Pull Request green banner',
            command: 'Open browser manually',
            isCorrect: false,
            explanation: 'While this works, it causes unnecessary context switching between your terminal and browser.',
          },
          {
            label: 'Run `git pr create`',
            command: 'git pr create',
            isCorrect: false,
            explanation: '`git` does not have a native `pr` command; pull requests are a GitHub feature, so the command is `gh pr create`.',
          },
        ],
        whenToUse: 'Submitting completed feature branches directly from terminal.',
        commandExample: 'gh pr create --fill',
        note: 'Prefills PR metadata from commit log.',
      },
      {
        id: 'sc-gh-cli-2',
        title: 'Reviewing and Running Teammate\'s Branch Locally',
        context: 'A teammate asks you to test their PR #78 locally because they are experiencing an intermittent test failure on macOS.',
        question: 'How do you immediately switch your local workspace to their PR branch without manually checking remote branch names?',
        options: [
          {
            label: 'Run `gh pr checkout 78`',
            command: 'gh pr checkout 78',
            isCorrect: true,
            explanation: '`gh pr checkout 78` fetches the pull request branch (even from a fork), creates or updates a local branch, and checks it out immediately.',
          },
          {
            label: 'Run `git checkout origin/pr-78`',
            command: 'git checkout origin/pr-78',
            isCorrect: false,
            explanation: 'Git remote tracking branches do not automatically map to PR numbers unless you configure custom refspecs.',
          },
          {
            label: 'Run `git clone https://github.com/teammate/repo.git pr78`',
            command: 'git clone https://github.com/teammate/repo.git pr78',
            isCorrect: false,
            explanation: 'Cloning the entire repository into a separate folder wastes disk space and time when `gh pr checkout` handles it in-place.',
          },
        ],
        whenToUse: 'Locally validating, debugging, or reviewing peer pull requests.',
        commandExample: 'gh pr checkout 78',
        note: 'Sets up tracking branch automatically.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'GitHub CLI (`gh`)',
        commandB: 'Git Core CLI (`git`)',
        aspect: 'Scope of Responsibilities',
        descriptionA: 'Handles GitHub-specific hosting platform features: Pull Requests, Issues, Actions CI runs, Releases, and Codespaces.',
        descriptionB: 'Handles core distributed version control operations: Commits, staging index, local branch DAG, rebasing, and merging.',
        safeForSharedHistory: { a: true, b: true },
      },
      {
        commandA: 'gh pr create --fill',
        commandB: 'GitHub Web Browser UI',
        aspect: 'Developer Workflow & Context Switching',
        descriptionA: 'Runs instantaneously in the terminal; automates title and description via commit messages (--fill) and supports scripting.',
        descriptionB: 'Requires opening a web browser, navigating to the repository, selecting branches, and manual form input.',
        safeForSharedHistory: { a: true, b: true },
      },
      {
        commandA: 'gh run watch',
        commandB: 'GitHub Actions Web Console',
        aspect: 'CI Pipeline Monitoring',
        descriptionA: 'Live streams runner step outputs and exit codes directly inside your terminal window with auto-refresh.',
        descriptionB: 'Requires reloading or watching animated spinners in a browser tab across multiple step disclosure widgets.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Confusing `git` and `gh` command binaries',
        whyItHappens: 'New developers often type `git pr create` or `gh commit` expecting the tools to be interchangeable.',
        fix: 'Remember that `git` controls the local repository and object database, whereas `gh` commands communicate with GitHub\'s cloud servers.',
      },
      {
        mistake: 'Running `gh pr create` before pushing the local branch to the remote',
        whyItHappens: 'If the branch does not exist on GitHub, the API cannot establish a diff against the base branch.',
        fix: 'Push your branch first with `git push -u origin <branch>` or use `gh pr create` interactively which offers to push the branch for you.',
      },
      {
        mistake: 'Failing to authenticate `gh` or having expired auth tokens',
        whyItHappens: 'Running `gh` on a new machine without running `gh auth login` first.',
        fix: 'Run `gh auth login` and choose HTTPS with web browser verification or pass a personal access token.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"feature cli\" > cli.js",
          "git add cli.js",
          "git commit -m \"feat: add cli automation\"",
          "git switch -c feature/cli-support"
  ],
      guidedSteps: [
          {
                  "instruction": "Inspect feature branch",
                  "command": "git branch",
                  "hint": "Type git branch"
          },
          {
                  "instruction": "Review the feature commit",
                  "command": "git log -n 1 --oneline",
                  "hint": "Type git log -n 1 --oneline"
          },
          {
                  "instruction": "Check working tree status",
                  "command": "git status",
                  "hint": "Type git status"
          }
  ],
      initialFiles: [{ name: 'cli-notes.md', content: '# GitHub CLI Guide\nUse `gh pr create` and `gh issue list`.\n' }],
      initialCommits: [{ hash: '1234567', message: 'docs: document GitHub CLI conventions' }],
      targetTask: 'Check git status and commit history.',
      hints: ['Run `git status`.'],
      validationRegex: /git status/i,
      solutionCommands: ['git status'],
    },

    challenge: {
      title: 'Inspect CLI Documentation',
      instructions: 'Review documentation commit to verify GitHub CLI workflow tips.',
      startingState: 'Documentation present.',
      goalState: 'Working tree status confirmed.',
      hints: ['Run `git status`.'],
    },

    reference: {
      officialDocUrl: 'https://cli.github.com/manual/',
      syntaxCheatSheet: [
        'gh auth login : Authenticate CLI with GitHub account',
        'gh pr list : List pull requests',
        'gh pr create --fill : Open PR using commit message',
        'gh pr checkout <id> : Switch to PR branch locally',
        'gh issue list : List open issues',
      ],
      commonErrors: [
        { error: 'gh: command not found', remedy: 'Install GitHub CLI via Homebrew (`brew install gh`), winget (`winget install GitHub.cli`), or apt (`sudo apt install gh`).' },
      ],
      mentalModelDiagram: {
        concept: 'CLI Bridge Architecture',
        explanation: 'Terminal Command (`gh pr create`) -> GitHub REST/GraphQL API -> GitHub Servers -> Instant JSON Response in Terminal.',
        storageLocation: 'Executable CLI binary communicating over HTTPS API with personal access token.',
      },
      edgeCases: ['The `gh` tool integrates with `git credential-manager` so you never have to re-enter tokens once logged in.'],
    },
  },

  'c-gh-api': {
    id: 'c-gh-api',
    command: 'api.github.com',
    title: 'GitHub REST & GraphQL API',
    topicId: 'topic-17',
    topicNumber: '17',
    topicTitle: 'GitHub Developer Tools',
    subtitle: 'Programmatic repository automation, webhook triggers, octokit SDKs, and GraphQL queries',
    badges: ['Advanced', 'API', 'Automation'],
    quote: 'Everything you can click in GitHub can be automated through the GitHub REST and GraphQL APIs.',
    difficulty: 'Advanced',

    whatIsIt:
      'The GitHub API provides programmatic access to nearly all GitHub data and actions. It consists of two flavors: (1) **REST API** (standard resource endpoints like `GET /repos/{owner}/{repo}/pulls`), and (2) **GraphQL API** (enables fetching precise, nested data structures in a single query). The GitHub CLI provides a built-in `gh api` helper to query endpoints directly without configuring curl headers.',
    inSimpleWords:
      'A secret telephone line that lets computer scripts talk directly to GitHub, asking questions like "Who opened PRs today?" or giving instructions like "Close all stale issues".',
    whyDoYouNeedIt:
      'Large engineering organizations require automated auditing, custom Slack notifications for deployment status, compliance reports, and automated bot accounts. The GitHub API powers these custom integrations.',
    realWorldAnalogy:
      'An automated bank API. Instead of a human standing at the teller counter depositing checks, an automated payroll system transfers money to 1,000 employees electronically every Friday at midnight.',

    syntaxCode: 'gh api repos/:owner/:repo/issues --jq ".[].title"',
    syntaxTokens: [
      { token: 'gh api', role: 'API Helper', explanation: 'Authenticated CLI shortcut to query GitHub REST and GraphQL endpoints.' },
      { token: 'repos/:owner/:repo', role: 'REST Endpoint', explanation: 'Target resource path automatically substituting active repo.' },
      { token: '--jq', role: 'JSON Processor', explanation: 'Filters and extracts specific JSON properties from the response.' },
    ],

    actionStage: {
      before: {
        label: 'Manual Auditing Task',
        description: 'Engineering Director needs a list of all open PRs created more than 14 days ago across 10 repositories.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Manual auditing: slow and tedious',
        historyCommits: [],
        whatChanged: ['No automated script.'],
        whatDidNotChange: ['Auditing takes hours.'],
      },
      running: {
        label: 'Executing API Query',
        description: 'Script queries GraphQL endpoint: fetches PR numbers, authors, and creation dates across all 10 repos in 300ms.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'gh api graphql -f query=\'{ ... }\'',
        historyCommits: [],
        whatChanged: ['GitHub returns exact structured JSON payload.'],
        whatDidNotChange: ['Zero manual browser clicking.'],
      },
      after: {
        label: 'Automated Slack Report Delivered',
        description: 'Script parses JSON and posts formatted table of stale PRs directly to #eng-leads Slack channel.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Audit Completed in 1.2 seconds',
        historyCommits: [],
        whatChanged: ['Continuous automated compliance reporting.'],
        whatDidNotChange: ['Engineers focus on writing code.'],
      },
    },

    variations: [
      {
        flag: 'gh api REST',
        title: 'REST Query via CLI',
        syntax: 'gh api repos/:owner/:repo/issues --jq ".[].title"',
        whatItDoes: 'Sends authenticated HTTP GET/POST/PUT requests to GitHub REST v3 endpoints with built-in token injection.',
        whenToUse: 'Quick terminal queries, bash automation scripts, and querying specific GitHub resources.',
        example: 'gh api repos/facebook/react/releases/latest',
        snippet: 'gh api repos/:owner/:repo',
      },
      {
        flag: 'GraphQL Query',
        title: 'GraphQL API',
        syntax: 'gh api graphql -f query=\'query { viewer { login repositories(first: 5) { nodes { name } } } }\'',
        whatItDoes: 'Executes custom GraphQL queries against `https://api.github.com/graphql` returning precise nested data in 1 request.',
        whenToUse: 'Complex reporting, fetching deeply nested resources, or eliminating multiple REST round-trips.',
        example: 'gh api graphql -f query=\'...\'',
        snippet: 'gh api graphql',
      },
      {
        flag: 'Octokit SDK',
        title: 'Official Client Libraries',
        syntax: 'import { Octokit } from "octokit";\nconst octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });',
        whatItDoes: 'Type-safe client library with automatic retry handling, rate limit backoff, and pagination helpers.',
        whenToUse: 'Building GitHub Actions, internal automation bots, or enterprise dashboard backends.',
        example: 'await octokit.rest.pulls.list({ owner, repo });',
        snippet: 'new Octokit({ auth })',
      },
      {
        flag: 'Automatic Pagination',
        title: 'Pagination Traversal',
        syntax: 'gh api repos/:owner/:repo/commits --paginate --jq ".[].commit.message"',
        whatItDoes: 'Automatically traverses HTTP `Link` rel="next" headers to fetch all pages of a resource collection.',
        whenToUse: 'Auditing complete histories, extracting all contributors, or listing all repository webhooks.',
        example: 'gh api user/repos --paginate',
        snippet: 'gh api <path> --paginate',
      },
    ],

    scenarios: [
      {
        id: 'sc-gh-api-1',
        title: 'Auditing Stale Pull Requests Across Multiple Repositories',
        context: 'As an engineering lead, you need to list all PRs created more than 30 days ago that remain open across 15 microservice repositories.',
        question: 'What is the most efficient programmatic approach to fetch this data without writing custom pagination loops for 15 repos?',
        options: [
          {
            label: 'Write a single GitHub GraphQL query that fetches open PRs filtered by `created:<DATE` across all 15 repositories in one round-trip',
            command: 'gh api graphql -f query=\'{ ... }\'',
            isCorrect: true,
            explanation: 'GraphQL allows batching multiple queries and requesting only specific fields (`title`, `createdAt`, `author`), avoiding hundreds of individual REST HTTP calls.',
          },
          {
            label: 'Manually open each of the 15 repositories in Chrome and copy PR dates into an Excel spreadsheet',
            command: 'Manual web browsing',
            isCorrect: false,
            explanation: 'Manual collection is error-prone, unscalable, and cannot be scheduled to run automatically.',
          },
          {
            label: 'Run `git log --since="30 days ago"` in each local directory',
            command: 'git log --since="30 days ago"',
            isCorrect: false,
            explanation: '`git log` inspects commit history, not pull request metadata hosted on GitHub.',
          },
        ],
        whenToUse: 'Batch querying complex repository state across multiple projects.',
        commandExample: 'gh api graphql -f query=\'{ ... }\'',
        note: 'Single network call returns exact filtered dataset.',
      },
      {
        id: 'sc-gh-api-2',
        title: 'Handling Secondary Rate Limits in CI/CD Automation Bots',
        context: 'Your custom GitHub bot is posting comments on 500 pull requests sequentially in a tight loop and suddenly starts receiving HTTP 403 / 429 errors.',
        question: 'Why is the GitHub API rejecting your script even though your hourly token rate limit has 4,000 requests remaining?',
        options: [
          {
            label: 'The script triggered GitHub\'s secondary rate limits (abuse detection) by sending too many write requests concurrently',
            command: 'Implement exponential backoff and sleep 1s between writes',
            isCorrect: true,
            explanation: 'GitHub enforces secondary rate limits for concurrent write requests. Automation must implement exponential backoff and sleep 1 second between write operations.',
          },
          {
            label: 'GitHub tokens expire automatically after 10 consecutive API calls',
            command: 'No command',
            isCorrect: false,
            explanation: 'Tokens do not expire based on call volume; standard personal access tokens remain valid until their configured expiration date.',
          },
          {
            label: 'The repository was converted to read-only mode by GitHub staff',
            command: 'No command',
            isCorrect: false,
            explanation: '403/429 with retry-after headers specifically indicates rate limit throttling.',
          },
        ],
        whenToUse: 'Architecting robust, high-volume GitHub API automation scripts.',
        commandExample: 'Implement 1-second delays between write requests',
        note: 'Prevents secondary rate limit tripping.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'GitHub REST API (v3)',
        commandB: 'GitHub GraphQL API (v4)',
        aspect: 'Data Fetching & Payload Structure',
        descriptionA: 'Fixed REST endpoints returning comprehensive standardized JSON objects; can cause over-fetching and requires multiple round-trips for nested relations.',
        descriptionB: 'Single `/graphql` endpoint where the client specifies the exact hierarchical shape of the desired response, eliminating over-fetching.',
        safeForSharedHistory: { a: true, b: true },
      },
      {
        commandA: 'gh api',
        commandB: 'curl with manual headers',
        aspect: 'Authentication & Convenience',
        descriptionA: 'Automatically handles OAuth/PAT authentication, injects correct headers, expands `:owner/:repo` shortcuts, and integrates `--jq` filtering.',
        descriptionB: 'Requires manually passing `-H "Authorization: Bearer $TOKEN"` and `-H "Accept: application/vnd.github+json"` on every call.',
        safeForSharedHistory: { a: true, b: true },
      },
      {
        commandA: 'Personal Access Token (PAT)',
        commandB: 'GITHUB_TOKEN in Actions',
        aspect: 'Security Scope & Lifecycle',
        descriptionA: 'Tied to an individual user account; has long lifespans and can accidentally expose personal access across all user repos if leaked.',
        descriptionB: 'Ephemeral token generated per GitHub Actions run; automatically expires when the job finishes and is scoped strictly to the current repo.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Exceeding the unauthenticated API rate limit (60 requests/hour)',
        whyItHappens: 'Calling `curl https://api.github.com/...` without an Authorization header.',
        fix: 'Always provide authentication via `gh api` or pass a Personal Access Token / GITHUB_TOKEN to raise the limit to 5,000 requests/hour.',
      },
      {
        mistake: 'Committing Personal Access Tokens (PATs) into repository code',
        whyItHappens: 'Hardcoding tokens in test scripts or config files when testing API calls.',
        fix: 'Store tokens in environment variables (`process.env.GITHUB_TOKEN`) or GitHub Actions Secrets; never hardcode credentials in code.',
      },
      {
        mistake: 'Ignoring pagination when listing resources like issues or commits',
        whyItHappens: 'Assuming the first response includes all records when GitHub defaults to 30 items per page (maximum 100 per page).',
        fix: 'Use `gh api --paginate` or read the `Link` header in REST to iterate through all result pages.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"api automation webhook\" > webhook.js",
          "git add webhook.js",
          "git commit -m \"feat: add api webhook integration\""
  ],
      guidedSteps: [
          {
                  "instruction": "Inspect the webhook commit",
                  "command": "git log -n 1 --oneline",
                  "hint": "Type git log -n 1 --oneline"
          },
          {
                  "instruction": "Verify repository status",
                  "command": "git status",
                  "hint": "Type git status"
          }
  ],
      initialFiles: [{ name: 'query.graphql', content: 'query {\n  viewer {\n    login\n  }\n}\n' }],
      initialCommits: [{ hash: '9988771', message: 'chore: add sample graphql query' }],
      targetTask: 'Check git status and commit history.',
      hints: ['Run `git status`.'],
      validationRegex: /git status/i,
      solutionCommands: ['git status'],
    },

    challenge: {
      title: 'Inspect GraphQL Query File',
      instructions: 'Review query.graphql to see syntax structure for GitHub API queries.',
      startingState: 'Query file present.',
      goalState: 'Working tree status confirmed.',
      hints: ['Run `git status`.'],
    },

    reference: {
      officialDocUrl: 'https://docs.github.com/en/rest',
      syntaxCheatSheet: [
        'gh api repos/{owner}/{repo} : Get repository metadata',
        'gh api repos/{owner}/{repo}/pulls : List active PRs',
        'gh api graphql : Execute custom GraphQL query',
        'Rate limit: 5,000 requests/hour authenticated',
      ],
      commonErrors: [
        { error: 'API rate limit exceeded', remedy: 'Ensure requests include an authenticated Authorization header (Personal Access Token or GITHUB_TOKEN) to increase limit from 60 to 5,000/hr.' },
      ],
      mentalModelDiagram: {
        concept: 'REST vs GraphQL',
        explanation: 'REST: Multiple fixed endpoints (fetch /repos, then /pulls, then /commits). GraphQL: Single endpoint (`/graphql`) returning custom hierarchical tree.',
        storageLocation: 'GitHub cloud API gateway serving JSON over HTTPS.',
      },
      edgeCases: ['GitHub Webhooks must respond with an HTTP 2xx status code within 10 seconds, or GitHub will mark the delivery as timed out.'],
    },
  },

  'c-codespaces': {
    id: 'c-codespaces',
    command: 'codespaces',
    title: 'GitHub Codespaces',
    topicId: 'topic-17',
    topicNumber: '17',
    topicTitle: 'GitHub Developer Tools',
    subtitle: 'Instant cloud developer environments in browser powered by Docker, VS Code, and devcontainers',
    badges: ['Beginner', 'Cloud IDE', 'Onboarding'],
    quote: 'From zero to full running dev environment in 10 seconds on any laptop, tablet, or browser.',
    difficulty: 'Beginner',

    whatIsIt:
      'GitHub Codespaces is a cloud-hosted, containerized developer environment. Configured via a `.devcontainer/devcontainer.json` file, Codespaces provisions a dedicated Linux virtual machine in the cloud pre-installed with all necessary tools, compilers, databases, extensions, and environment variables, accessible through VS Code in your web browser or desktop editor.',
    inSimpleWords:
      'A powerful developer laptop living in the cloud. You can code from a $200 Chromebook or iPad because all the heavy compilation and database work happens on Microsoft\'s cloud servers.',
    whyDoYouNeedIt:
      'Onboarding new engineers often takes 2 full days of troubleshooting conflicting local Node versions, Docker settings, and OS dependencies ("works on Mac, broken on Windows"). Codespaces gives every developer the exact same pre-configured environment in 10 seconds.',
    realWorldAnalogy:
      'A professional rental workshop. Instead of buying $50,000 of woodworking machinery and setting it up in your garage, you rent a workshop bench that is already fully stocked with every tool sharpened and plugged into the wall.',

    syntaxCode: 'gh codespace create -r <owner>/<repo> -b main',
    syntaxTokens: [
      { token: 'gh codespace create', role: 'Creation Command', explanation: 'Launches a cloud VM and initializes the devcontainer.' },
      { token: '.devcontainer.json', role: 'Environment Blueprint', explanation: 'Configures Docker image, VS Code extensions, and port forwards.' },
    ],

    actionStage: {
      before: {
        label: 'Day 1 Onboarding Pain',
        description: 'New hire joins the team on Windows. App requires Linux-specific C bindings and Postgres 16. Install fails.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Local environment setup failing',
        historyCommits: [],
        whatChanged: ['New hire blocked from writing code.'],
        whatDidNotChange: ['Local machine lacks prerequisites.'],
      },
      running: {
        label: 'Clicking "Open in Codespace"',
        description: 'GitHub launches 4-core cloud VM. Pulls Docker container specified in `.devcontainer/devcontainer.json`. Runs `npm install`.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Codespace provisioned in 12 seconds',
        historyCommits: [],
        whatChanged: ['Cloud container boots with Node, Postgres, and VS Code extensions.'],
        whatDidNotChange: ['Zero software installed on new hire\'s physical laptop.'],
      },
      after: {
        label: 'Instant Productivity',
        description: 'Browser tab opens full VS Code editor. Server runs on port 3000 with automatic port forwarding. First PR submitted by lunch!',
        workingDirectory: [{ name: 'feature.ts', status: 'committed' }],
        stagingArea: [],
        commandPill: 'Coding in Browser (Port 3000 Live)',
        historyCommits: [
          { hash: 'C1', message: 'feat: new hire first contribution' },
        ],
        whatChanged: ['100% standardized environment across entire engineering team.'],
        whatDidNotChange: ['Codespace auto-sleeps after 30 minutes of inactivity to save cost.'],
      },
    },

    variations: [
      {
        flag: 'Browser Mode',
        title: 'Web Browser VS Code',
        syntax: 'Press "." while on any GitHub repository page',
        whatItDoes: 'Opens a lightweight in-browser editor or provisions a full cloud Codespace VM inside Chrome/Safari/Edge.',
        whenToUse: 'Quick reviews, documentation fixes, or coding when away from your primary developer machine.',
        example: 'github.com/org/repo -> Press "."',
        snippet: 'Press "." in GitHub',
      },
      {
        flag: 'Desktop VS Code',
        title: 'Connect Desktop App',
        syntax: 'gh codespace code -c <codespace-name>',
        whatItDoes: 'Connects your local native VS Code app over an SSH tunnel to the cloud container running on Azure.',
        whenToUse: 'When you want your local keybindings, multi-monitor window setup, and custom extensions powered by cloud compute.',
        example: 'gh codespace code',
        snippet: 'gh codespace code',
      },
      {
        flag: 'devcontainer.json',
        title: 'Reproducible Environment Blueprint',
        syntax: '{\n  "image": "mcr.microsoft.com/devcontainers/typescript-node:20",\n  "forwardPorts": [3000],\n  "postCreateCommand": "npm install"\n}',
        whatItDoes: 'Defines Docker container image, pre-installed extensions, environment variables, and startup scripts.',
        whenToUse: 'Standardizing team development environments so onboarding takes 1 minute instead of 2 days.',
        example: '.devcontainer/devcontainer.json',
        snippet: '.devcontainer.json',
      },
      {
        flag: 'gh codespace ssh',
        title: 'SSH from Terminal',
        syntax: 'gh codespace ssh -c <codespace-name>',
        whatItDoes: 'Opens an interactive SSH shell directly into the Codespace virtual machine from your local command line.',
        whenToUse: 'Running command-line utilities, debugging services, or editing files via Vim/Neovim on the cloud VM.',
        example: 'gh codespace ssh',
        snippet: 'gh codespace ssh',
      },
    ],

    scenarios: [
      {
        id: 'sc-codespaces-1',
        title: 'Eliminating "Works On My Machine" Onboarding Delays',
        context: 'A new engineer joins your company with a Windows laptop. Your backend requires specific Linux C++ libraries, Redis, and PostgreSQL 16, which frequently fail to compile locally on Windows.',
        question: 'What is the fastest way to get them productive writing code on day one without reformatting their laptop to Linux?',
        options: [
          {
            label: 'Configure a `.devcontainer/devcontainer.json` file in the repo and launch a GitHub Codespace in their browser',
            command: 'Add .devcontainer/devcontainer.json and click "Open in Codespace"',
            isCorrect: true,
            explanation: 'Codespaces spins up an Ubuntu Linux VM in the cloud pre-installed with Docker, Redis, Postgres, and all dependencies in seconds, accessible from any OS browser.',
          },
          {
            label: 'Spend 2 days troubleshooting native Windows compilation errors and path issues',
            command: 'Manual local OS troubleshooting',
            isCorrect: false,
            explanation: 'Manual local OS troubleshooting wastes valuable engineering time and leads to fragile, non-reproducible setups.',
          },
          {
            label: 'Purchase a dedicated secondary Linux laptop and ship it via courier',
            command: 'Ship hardware',
            isCorrect: false,
            explanation: 'Expensive, slow, and unnecessary when cloud development environments can be provisioned on-demand.',
          },
        ],
        whenToUse: 'Standardizing development dependencies across diverse operating systems.',
        commandExample: 'Add .devcontainer/devcontainer.json',
        note: 'Uniform environment for every team member.',
      },
      {
        id: 'sc-codespaces-2',
        title: 'Preventing Unnecessary Cloud Billing for Idle Environments',
        context: 'Developers on your team frequently leave their Codespaces open at the end of the day, causing high compute usage billing on the organization account.',
        question: 'How can you ensure Codespaces do not burn through monthly compute credits overnight?',
        options: [
          {
            label: 'Set the default auto-stop idle timeout to 15 or 30 minutes in organization and repository Codespace settings',
            command: 'Configure auto-stop idle timeout: 15 min',
            isCorrect: true,
            explanation: 'Codespaces automatically suspends the VM when no editor activity or SSH connection is detected for the timeout duration, pausing compute billing.',
          },
          {
            label: 'Delete the repository every evening at 6 PM and recreate it at 9 AM',
            command: 'Delete repo',
            isCorrect: false,
            explanation: 'Deleting repositories destroys PR history, branch tracking, and active code.',
          },
          {
            label: 'Ask developers to manually set calendar alarms to shut down their machines',
            command: 'Manual alarms',
            isCorrect: false,
            explanation: 'Human memory is unreliable; automated idle timeouts provide guaranteed cost enforcement.',
          },
        ],
        whenToUse: 'Managing cloud compute budgets and preventing runaway infrastructure bills.',
        commandExample: 'Organization Settings -> Codespaces -> Default idle timeout: 15 min',
        note: 'Cloud VM pauses automatically when idle.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'GitHub Codespaces',
        commandB: 'Local Development Environment',
        aspect: 'Hardware Dependency & Provisioning Speed',
        descriptionA: 'Runs in the cloud; provisions identical Linux Docker containers in seconds on any device (Chromebook, tablet, Mac, Windows); uses cloud CPU/RAM.',
        descriptionB: 'Runs locally; subject to host OS differences, version conflicts, local battery drain, and manual dependency installation.',
        safeForSharedHistory: { a: true, b: true },
      },
      {
        commandA: 'Codespaces (Full Cloud VM)',
        commandB: 'github.dev (Web Editor)',
        aspect: 'Terminal & Server Runtime Capability',
        descriptionA: 'Full cloud virtual machine with terminal access, Docker, build compilers, databases, port forwarding, and test runners.',
        descriptionB: 'Client-side in-browser editor only; no terminal, no Node/Python runtime, and cannot run tests or build servers.',
        safeForSharedHistory: { a: true, b: true },
      },
      {
        commandA: 'Codespaces',
        commandB: 'Docker Desktop Locally',
        aspect: 'Resource Consumption & Maintenance',
        descriptionA: 'Zero CPU/RAM load on developer laptop; pre-warmed container images start in seconds without local disk hogging.',
        descriptionB: 'Heavy local battery and RAM consumption; requires managing Docker Desktop licensing and virtualization settings locally.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Leaving Codespaces running without setting an idle timeout',
        whyItHappens: 'Developers close their laptop lids assuming the cloud VM terminates immediately.',
        fix: 'Configure an auto-stop idle timeout (e.g. 15-30 minutes) in Codespace settings so compute charges cease automatically.',
      },
      {
        mistake: 'Modifying files outside the workspace folder and expecting them to persist',
        whyItHappens: 'Installing global packages or changing root OS configs (`/etc/`) without adding them to Dockerfile or `devcontainer.json`.',
        fix: 'Only files in `/workspaces/<repo>` persist across container rebuilds; codify all system packages in `.devcontainer/devcontainer.json` or `Dockerfile`.',
      },
      {
        mistake: 'Committing private secrets into `.devcontainer` configuration',
        whyItHappens: 'Hardcoding API keys or database passwords in `devcontainer.json`.',
        fix: 'Use Codespaces User Secrets or Repository Secrets (`Settings -> Secrets and variables -> Codespaces`) which are injected securely as environment variables.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "mkdir -p .devcontainer",
          "echo \"{\\\"name\\\": \\\"Node.js Dev\\\", \\\"image\\\": \\\"mcr.microsoft.com/devcontainers/javascript-node:20\\\"}\" > .devcontainer/devcontainer.json",
          "git add .devcontainer/devcontainer.json",
          "git commit -m \"chore: configure Codespaces dev container\""
  ],
      guidedSteps: [
          {
                  "instruction": "Inspect the Codespaces configuration commit",
                  "command": "git log -n 1 --oneline",
                  "hint": "Type git log -n 1 --oneline"
          },
          {
                  "instruction": "Verify repository status",
                  "command": "git status",
                  "hint": "Type git status"
          }
  ],
      initialFiles: [
        { name: '.devcontainer/devcontainer.json', content: '{\n  "name": "Node.js & TypeScript",\n  "image": "mcr.microsoft.com/devcontainers/typescript-node:20",\n  "forwardPorts": [3000]\n}\n' },
      ],
      initialCommits: [{ hash: '4455667', message: 'chore: add devcontainer specification' }],
      targetTask: 'Check git status and commit history.',
      hints: ['Run `git status`.'],
      validationRegex: /git status/i,
      solutionCommands: ['git status'],
    },

    challenge: {
      title: 'Inspect Devcontainer Configuration',
      instructions: 'Review devcontainer.json configuration file in .devcontainer directory.',
      startingState: 'Devcontainer file present.',
      goalState: 'Working tree status confirmed.',
      hints: ['Run `git status`.'],
    },

    reference: {
      officialDocUrl: 'https://docs.github.com/en/codespaces',
      syntaxCheatSheet: [
        'Press . on any GitHub repo : Launch web editor',
        'gh codespace list : List active running Codespaces',
        'gh codespace code : Connect local desktop VS Code',
        '.devcontainer/devcontainer.json : Environment definition',
      ],
      commonErrors: [
        { error: 'Codespace running out of free monthly hours', remedy: 'Set the auto-stop timeout in settings to 15 or 30 minutes so cloud VMs stop consuming compute when idle.' },
      ],
      mentalModelDiagram: {
        concept: 'Codespace Architecture',
        explanation: 'Browser/Desktop VS Code <== Secure WebSocket ==> Cloud VM (Azure) <== Docker Container (Node, DB, Extensions).',
        storageLocation: 'Cloud VM persistent storage disk linked to GitHub account.',
      },
      edgeCases: ['Codespaces automatically forward listening ports (e.g. 3000, 8080) with private or public shareable HTTPS preview URLs.'],
    },
  },

  // ==========================================================================
  // TOPIC 18: More GitHub Features
  // ==========================================================================
  'c-gh-discussions': {
    id: 'c-gh-discussions',
    command: 'discussions',
    title: 'GitHub Discussions',
    topicId: 'topic-18',
    topicNumber: '18',
    topicTitle: 'More GitHub Features',
    subtitle: 'Community forum for open-ended conversations, Q&A, RFC proposals, and announcements',
    badges: ['Beginner', 'Community', 'Collaboration'],
    quote: 'Keep your issue tracker focused on actionable bugs and tasks. Use Discussions for questions, brainstorms, and community chat.',
    difficulty: 'Beginner',

    whatIsIt:
      'GitHub Discussions is a collaborative communication forum for open source projects and engineering teams. Unlike GitHub Issues (which represent actionable tasks with a binary Open/Closed state), Discussions provide threaded conversations, categorized categories (Ideas, Q&A, RFCs, Announcements), upvoting, and marked "Answered" solutions.',
    inSimpleWords:
      'A StackOverflow and Reddit built directly into your GitHub repo where users can ask questions and brainstorm ideas without cluttering your todo list.',
    whyDoYouNeedIt:
      'When users ask "How do I configure this with Docker?" inside GitHub Issues, maintainers get overwhelmed with 500 open issues that aren\'t actually bugs. Discussions separates conversation from actionable code work.',
    realWorldAnalogy:
      'A suggestion box and town hall meeting vs a work order clipboard. You don\'t write "What if we painted the building blue?" on the plumbing repair ticket.',

    syntaxCode: 'Repository Settings -> Features -> Discussions (Checkbox: Enable)',
    syntaxTokens: [
      { token: 'Discussions Tab', role: 'Community Forum', explanation: 'Dedicated top-level repository tab alongside Code and Issues.' },
      { token: 'Mark as Answer', role: 'Q&A Resolution', explanation: 'Allows authors to highlight the correct answer at the top of the thread.' },
    ],

    actionStage: {
      before: {
        label: 'Cluttered Issue Backlog',
        description: 'Repo has 300 open issues. 180 of them are questions ("How do I use this?", "Does this support Vue?"). Maintainers feel burned out.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Issue tracker clogged with questions',
        historyCommits: [],
        whatChanged: ['Bugs lost in sea of questions.'],
        whatDidNotChange: ['Community lacks a structured forum.'],
      },
      running: {
        label: 'Enabling GitHub Discussions',
        description: 'Maintainer enables Discussions with categories: Announcements, General, Ideas, and Q&A. Converts questions into discussions.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Discussions Enabled',
        historyCommits: [],
        whatChanged: ['180 questions moved to Discussions forum.'],
        whatDidNotChange: ['Real actionable bugs remain in Issues.'],
      },
      after: {
        label: 'Thriving Community & Clean Backlog',
        description: 'Community members answer each other\'s questions in Discussions. Marked solutions help future users via search. Issues count drops to 20 actionable bugs.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Clean Issues Backlog + Active Forum',
        historyCommits: [],
        whatChanged: ['Searchable knowledge base built automatically.'],
        whatDidNotChange: ['Maintainers maintain sanity.'],
      },
    },

    variations: [
      {
        flag: 'Q&A Category',
        title: 'Question & Answer Forum',
        syntax: 'Discussions -> Category: Q&A -> "Mark as answer"',
        whatItDoes: 'Provides an upvoteable thread where community members propose answers and the author or maintainer can mark the verified solution.',
        whenToUse: 'Troubleshooting how-to questions, setup inquiries, and architecture guidance without opening bug issues.',
        example: 'Discussions -> Q&A',
        snippet: 'Category: Q&A',
      },
      {
        flag: 'Ideas / RFC',
        title: 'Proposals & Brainstorming',
        syntax: 'Discussions -> Category: Ideas (Upvoting enabled)',
        whatItDoes: 'Allows users and contributors to propose enhancements, vote with reactions, and debate trade-offs before code is written.',
        whenToUse: 'Requesting community feedback on architectural designs or exploring demand for new features.',
        example: 'Category: Ideas (Upvote count)',
        snippet: 'Category: Ideas',
      },
      {
        flag: 'Announcements',
        title: 'Maintainer Broadcasts',
        syntax: 'Discussions -> Category: Announcements (Maintainer write-only)',
        whatItDoes: 'Restricted category where only maintainers can start new threads to announce releases, events, or roadmaps.',
        whenToUse: 'Publishing newsletter updates, major version announcements, or community town halls.',
        example: 'Category: Announcements',
        snippet: 'Category: Announcements',
      },
      {
        flag: 'Convert to Discussion',
        title: 'Transfer Question from Issues',
        syntax: 'Issue sidebar -> Click "Convert to discussion"',
        whatItDoes: 'Moves an issue and all existing comments cleanly into Discussions, closing the issue backlog item without losing context.',
        whenToUse: 'Triaging issues that turn out to be general usage questions rather than reproducible software bugs.',
        example: 'Issue #45 -> Convert to discussion',
        snippet: 'Convert to discussion',
      },
    ],

    scenarios: [
      {
        id: 'sc-gh-discussions-1',
        title: 'Triaging General Usage Questions Out of the Issue Tracker',
        context: 'Your open source library has 250 open GitHub Issues, but 180 of them are questions like "How do I configure this with Next.js?" or "Is there an example for AWS?". Maintainers are overwhelmed.',
        question: 'What is the best practice to organize questions without losing community knowledge or cluttering the bug tracker?',
        options: [
          {
            label: 'Enable GitHub Discussions with a "Q&A" category and use "Convert to discussion" on non-bug issues',
            command: 'Enable Discussions and click "Convert to discussion"',
            isCorrect: true,
            explanation: 'Discussions provides threaded conversations and marked answers for questions, keeping the Issue tracker strictly reserved for actionable, verifiable bugs.',
          },
          {
            label: 'Immediately close all question issues with the label `wontfix` and delete the comments',
            command: 'Close issues with wontfix',
            isCorrect: false,
            explanation: 'Hostile to users and destroys knowledge that other community members could benefit from.',
          },
          {
            label: 'Leave all questions in GitHub Issues indefinitely so everyone sees them',
            command: 'Leave issues open',
            isCorrect: false,
            explanation: 'Clogs the backlog, makes real bugs hard to find, and demoralizes maintainers.',
          },
        ],
        whenToUse: 'Maintaining a clean, actionable bug tracker while fostering a supportive community.',
        commandExample: 'Click "Convert to discussion" on question issues',
        note: 'Preserves comment history in Q&A forum.',
      },
      {
        id: 'sc-gh-discussions-2',
        title: 'Promoting a Brainstormed Discussion into an Actionable Issue',
        context: 'A community member proposed a brilliant caching feature in Discussions under "Ideas". After 2 weeks of debate, maintainers agreed on the API design and are ready to assign implementation.',
        question: 'How should maintainers transition this approved design into the development sprint backlog?',
        options: [
          {
            label: 'Click "Create issue from discussion" on the right sidebar of the discussion thread',
            command: 'Discussion sidebar -> "Create issue from discussion"',
            isCorrect: true,
            explanation: 'GitHub automatically opens a new Issue referencing the original discussion, linking the full RFC context directly to the new task.',
          },
          {
            label: 'Leave the discussion open and tell developers to remember what was agreed upon',
            command: 'No action taken',
            isCorrect: false,
            explanation: 'Tasks get lost unless tracked in the development backlog or project board.',
          },
          {
            label: 'Copy-paste the entire thread manually into a secret document',
            command: 'Manual copy-paste',
            isCorrect: false,
            explanation: 'Breaks transparency and loses direct GitHub cross-linking.',
          },
        ],
        whenToUse: 'Moving approved RFC proposals into the implementation phase.',
        commandExample: 'Discussion sidebar -> "Create issue from discussion"',
        note: 'Directly links conversation context to actionable task.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'GitHub Discussions',
        commandB: 'GitHub Issues',
        aspect: 'Purpose & Lifecycle State',
        descriptionA: 'Open-ended community forum for Q&A, brainstorming, and RFCs; no completion deadline; supports upvoting and marked answers.',
        descriptionB: 'Actionable work tracking for bugs and tasks; binary Open/Closed lifecycle; linked directly to Pull Requests and milestones.',
        safeForSharedHistory: { a: true, b: true },
      },
      {
        commandA: 'GitHub Discussions',
        commandB: 'Discord / Slack Channels',
        aspect: 'Searchability & Knowledge Permanence',
        descriptionA: 'Permanently indexed by search engines (Google, GitHub search); easily discovered by future users facing the same issue months later.',
        descriptionB: 'Ephemeral real-time chat; discussions get buried quickly in chat logs and are not discoverable via public web search engines.',
        safeForSharedHistory: { a: true, b: true },
      },
      {
        commandA: 'Q&A Discussions',
        commandB: 'Stack Overflow',
        aspect: 'Context & Repository Proximity',
        descriptionA: 'Lives directly inside the project repository; maintains close proximity to the codebase, source code releases, and core team members.',
        descriptionB: 'External platform with strict moderation rules; maintainers may not monitor third-party tags consistently.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Using GitHub Issues for open-ended design discussions and general questions',
        whyItHappens: 'Not enabling Discussions, causing users to default to Issues for every communication need.',
        fix: 'Enable GitHub Discussions in repository settings and use issue templates pointing questions to Discussions.',
      },
      {
        mistake: 'Leaving helpful answers unverified without clicking "Mark as answer"',
        whyItHappens: 'Original authors finding their fix and forgetting to stamp the solution.',
        fix: 'Maintainers and authors should actively click "Mark as answer" so the solution is pinned to the top of the thread and marked solved in search results.',
      },
      {
        mistake: 'Using public repository Discussions for confidential security vulnerability reports',
        whyItHappens: 'Users wanting quick help with an exploit they uncovered.',
        fix: 'Use GitHub Private Vulnerability Reporting (`Security -> Report a vulnerability`) so security flaws can be patched before public disclosure.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"# RFC: Community Proposal\\nDiscussion #12\" > RFC.md",
          "git add RFC.md",
          "git commit -m \"docs: add RFC proposal for GitHub Discussions\""
  ],
      guidedSteps: [
          {
                  "instruction": "Inspect proposal documentation commit",
                  "command": "git log -n 1 --oneline",
                  "hint": "Type git log -n 1 --oneline"
          },
          {
                  "instruction": "Check status",
                  "command": "git status",
                  "hint": "Type git status"
          }
  ],
      initialFiles: [{ name: 'COMMUNITY.md', content: '# Community Guidelines\nAsk questions in GitHub Discussions!\n' }],
      initialCommits: [{ hash: '5566778', message: 'docs: link to github discussions' }],
      targetTask: 'Check git status and commit history.',
      hints: ['Run `git status`.'],
      validationRegex: /git status/i,
      solutionCommands: ['git status'],
    },

    challenge: {
      title: 'Inspect Community Documentation',
      instructions: 'Review community guidelines document in repository root.',
      startingState: 'Community doc present.',
      goalState: 'Working tree status confirmed.',
      hints: ['Run `git status`.'],
    },

    reference: {
      officialDocUrl: 'https://docs.github.com/en/discussions',
      syntaxCheatSheet: [
        'Discussions categories: Q&A, Ideas, General, Announcements',
        'Convert issue to discussion: Right sidebar on issue page',
        'Convert discussion to issue: When an idea becomes an approved task',
      ],
      commonErrors: [
        { error: 'Treating Discussions as a bug tracker', remedy: 'If a discussion identifies a verified, reproducible bug, use "Create issue from discussion" to track the fix.' },
      ],
      mentalModelDiagram: {
        concept: 'Discussions vs Issues Separation',
        explanation: 'Discussions (Open-ended, Q&A, Brainstorm, No deadline) <==== Separated ====> Issues (Actionable, Binary Open/Closed, PR-linked).',
        storageLocation: 'GitHub repository discussions database with voting and answer resolution.',
      },
      edgeCases: ['Organization-level discussions are available for announcements across an entire company or open-source org.'],
    },
  },

  'c-gh-pages': {
    id: 'c-gh-pages',
    command: 'pages',
    title: 'GitHub Pages',
    topicId: 'topic-18',
    topicNumber: '18',
    topicTitle: 'More GitHub Features',
    subtitle: 'Free static website hosting directly from your repository with custom domains and SSL',
    badges: ['Beginner', 'Hosting', 'Web'],
    quote: 'Turn any repository into a live public website with zero server configuration.',
    difficulty: 'Beginner',

    whatIsIt:
      'GitHub Pages is a static site hosting service that takes HTML, CSS, and JavaScript files straight from a repository (or generated via GitHub Actions), runs the files through an optional Jekyll build process, and publishes a website hosted on `https://<username>.github.io/<repo>/` with free automated SSL certificates and custom domain support.',
    inSimpleWords:
      'A free web hosting service built into GitHub. Put an `index.html` file on your branch, turn on GitHub Pages, and your website is instantly live to the whole world.',
    whyDoYouNeedIt:
      'Developers need a free, maintenance-free home for project documentation sites (Docusaurus, VitePress), interactive portfolio pages, demo previews, and open-source project landing pages without paying for hosting servers.',
    realWorldAnalogy:
      'A storefront display window. You arrange your products inside the window (repo files), flip the light switch on (Pages setting), and anyone walking down the street can see your display through the glass.',

    syntaxCode: 'Repository Settings -> Pages -> Source: Deploy from a branch (gh-pages)',
    syntaxTokens: [
      { token: 'gh-pages', role: 'Conventional Branch', explanation: 'Standard branch name dedicated to holding compiled static web assets.' },
      { token: 'Custom domain', role: 'CNAME Mapping', explanation: 'Allows mapping your own domain (e.g. docs.myproject.com) with free HTTPS.' },
    ],

    actionStage: {
      before: {
        label: 'Local Web Code Only',
        description: 'You built a beautiful interactive web app with `index.html`, `style.css`, and `app.js`. Only visible on localhost:3000.',
        workingDirectory: [{ name: 'index.html', status: 'committed' }],
        stagingArea: [],
        commandPill: 'localhost only',
        historyCommits: [{ hash: 'P1', message: 'feat: build web landing page' }],
        whatChanged: ['Website code committed.'],
        whatDidNotChange: ['No public web URL exists.'],
      },
      running: {
        label: 'Enabling GitHub Pages',
        description: 'In Settings -> Pages, select branch `main` and folder `/root`. GitHub automatically kicks off `pages-build-deployment` Action.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'GitHub Pages deployment running',
        historyCommits: [],
        whatChanged: ['GitHub provisions CDN routing and generates SSL cert.'],
        whatDidNotChange: ['Repository source code remains unchanged.'],
      },
      after: {
        label: 'Website Live to the World',
        description: 'Site is live at `https://user.github.io/my-app/` with green HTTPS padlock. Updates deploy automatically on every push.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Live: https://user.github.io/my-app/',
        historyCommits: [
          { hash: 'P1', message: 'feat: build web landing page (Deployed to Pages)' },
        ],
        whatChanged: ['Public website accessible worldwide.'],
        whatDidNotChange: ['Zero server maintenance required.'],
      },
    },

    variations: [
      {
        flag: 'Deploy from Branch',
        title: 'Static Branch Source (/root or /docs)',
        syntax: 'Settings -> Pages -> Source: Deploy from a branch (main / docs)',
        whatItDoes: 'Directly serves static HTML, CSS, and JS files from the designated branch folder to the web.',
        whenToUse: 'Simple static websites, plain HTML/CSS/JS demos, or pre-built asset repositories.',
        example: 'Settings -> Pages -> Branch: main, Folder: /docs',
        snippet: 'Deploy from branch',
      },
      {
        flag: 'GitHub Actions',
        title: 'Actions Source (Vite / Next.js Export)',
        syntax: 'Settings -> Pages -> Source: GitHub Actions\nuses: actions/deploy-pages@v4',
        whatItDoes: 'Compiles frontend frameworks inside GitHub Actions and uploads the build artifact to Pages CDN.',
        whenToUse: 'Modern frontend projects requiring a bundler compilation step before publication.',
        example: 'uses: actions/deploy-pages@v4',
        snippet: 'actions/deploy-pages',
      },
      {
        flag: 'Custom Domain',
        title: 'Custom Domain Mapping + Auto SSL',
        syntax: 'echo "docs.example.com" > CNAME\n# DNS: CNAME docs -> <username>.github.io',
        whatItDoes: 'Binds your custom domain to GitHub Pages with free automated Let\'s Encrypt SSL certificate provisioning.',
        whenToUse: 'Branded documentation sites, production portfolio URLs, and commercial open-source landing pages.',
        example: 'echo "docs.example.com" > CNAME',
        snippet: 'CNAME: docs.example.com',
      },
      {
        flag: '.nojekyll',
        title: 'Bypass Jekyll Processing',
        syntax: 'touch .nojekyll',
        whatItDoes: 'Prevents GitHub Pages\' default Jekyll engine from ignoring files and folders starting with underscores (`_next`, `_assets`).',
        whenToUse: 'Essential for Vite, React, Vue, and Next.js static exports whose bundlers generate `_assets` directories.',
        example: 'touch dist/.nojekyll',
        snippet: 'touch .nojekyll',
      },
    ],

    scenarios: [
      {
        id: 'sc-gh-pages-1',
        title: 'Fixing Broken CSS & JavaScript Assets on Subpath URLs',
        context: 'You deploy a React/Vite app to GitHub Pages at `https://alice.github.io/my-portfolio/`. The site loads a blank page with console errors: `Failed to load resource: 404 /assets/index.js`.',
        question: 'Why are the assets failing to load and how do you fix it?',
        options: [
          {
            label: 'The bundler generated root-relative paths (`/assets/...`); set `base: "/my-portfolio/"` in `vite.config.ts`',
            command: 'vite.config.ts: export default { base: "/my-portfolio/" }',
            isCorrect: true,
            explanation: 'Because project sites are hosted under a repository subpath (`/<repo>/`), asset URLs must include the repository prefix, or they will resolve incorrectly to the root domain.',
          },
          {
            label: 'GitHub Pages does not support JavaScript files',
            command: 'No command',
            isCorrect: false,
            explanation: 'GitHub Pages supports all static web assets, including JavaScript, WASM, CSS, and images.',
          },
          {
            label: 'You must pay for a GitHub Enterprise subscription to host Vite apps',
            command: 'Upgrade subscription',
            isCorrect: false,
            explanation: 'GitHub Pages is completely free for public repositories on all account tiers.',
          },
        ],
        whenToUse: 'Deploying single page applications (SPAs) to repository subpaths.',
        commandExample: 'vite.config.ts: export default { base: "/my-portfolio/" }',
        note: 'Ensures correct asset path resolution.',
      },
      {
        id: 'sc-gh-pages-2',
        title: 'Deploying Modern Frameworks Without Committing Build Artifacts',
        context: 'Your team builds documentation using Docusaurus. You do not want developers to manually run `npm run build` and commit compiled HTML bundles to git branches.',
        question: 'What is the recommended modern architecture for GitHub Pages deployments?',
        options: [
          {
            label: 'Switch Pages source to "GitHub Actions" and use a workflow that builds and publishes using `actions/deploy-pages`',
            command: 'Settings -> Pages -> Source: GitHub Actions',
            isCorrect: true,
            explanation: 'GitHub Actions compiles the site in a clean runner and deploys the artifact directly to GitHub\'s CDN without polluting your git commit history with built files.',
          },
          {
            label: 'Force developers to commit the `dist/` directory into the `main` branch before every PR',
            command: 'git add dist/ && git commit -m "build"',
            isCorrect: false,
            explanation: 'Committing compiled build artifacts bloats repository history and causes endless merge conflicts.',
          },
          {
            label: 'FTP upload the files manually to a third-party server',
            command: 'ftp upload',
            isCorrect: false,
            explanation: 'Manual FTP deployment is unautomated, insecure, and defeats the purpose of CI/CD.',
          },
        ],
        whenToUse: 'Automating static site builds from TypeScript/React source code.',
        commandExample: 'Settings -> Pages -> Source: GitHub Actions',
        note: 'Keeps repository branch history clean.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'GitHub Pages (Actions Source)',
        commandB: 'GitHub Pages (Branch Source)',
        aspect: 'Build Automation & Repository Cleanliness',
        descriptionA: 'Compiles source files in CI runner; keeps compiled bundles out of git history; supports complex build pipelines.',
        descriptionB: 'Requires pre-built static assets to be committed to a branch (e.g. `gh-pages` or `/docs`), increasing git history size.',
        safeForSharedHistory: { a: true, b: true },
      },
      {
        commandA: 'GitHub Pages',
        commandB: 'Vercel / Netlify',
        aspect: 'Runtime Server Features & SSR',
        descriptionA: 'Free static file hosting directly from repo; no serverless backend functions, SSR, or dynamic server-side redirects.',
        descriptionB: 'Full-stack cloud platform supporting Server-Side Rendering (SSR), serverless functions, edge middleware, and instant branch previews.',
        safeForSharedHistory: { a: true, b: true },
      },
      {
        commandA: 'User Site (<user>.github.io)',
        commandB: 'Project Site (<user>.github.io/<repo>)',
        aspect: 'Domain Routing & Base Path',
        descriptionA: 'Hosted at the root domain (`https://<user>.github.io`); requires repository named exactly `<user>.github.io`; asset paths use `/`.',
        descriptionB: 'Hosted under a subpath (`https://<user>.github.io/<repo>/`); requires bundler base URL configuration to match the subpath.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Forgetting `.nojekyll` when deploying SPAs with underscore directories',
        whyItHappens: 'Jekyll ignores folders like `_next/` or `_assets/`, causing 404s on stylesheets and scripts.',
        fix: 'Include an empty `.nojekyll` file at the root of your published output directory.',
      },
      {
        mistake: 'Expecting GitHub Pages to execute Node.js, Python, or PHP backend code',
        whyItHappens: 'Assuming Pages is a full web server that can run Express APIs or connect to MongoDB.',
        fix: 'GitHub Pages only serves static client assets (HTML/CSS/JS/WASM); host backend APIs on Render, Fly.io, or AWS.',
      },
      {
        mistake: 'Not handling client-side SPA routing for deep URLs (404 on refresh)',
        whyItHappens: 'Refreshing `/dashboard` results in GitHub Pages looking for a physical file `/dashboard/index.html` and returning 404.',
        fix: 'Use a 404.html redirect script (like `spa-github-pages`) or configure hash-based routing (`createHashRouter`) for static SPAs.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"<!DOCTYPE html><html><head><title>Docs</title></head><body><h1>Hello Pages</h1></body></html>\" > index.html",
          "git add index.html",
          "git commit -m \"feat: create static GitHub Pages site\"",
          "git branch gh-pages"
  ],
      guidedSteps: [
          {
                  "instruction": "Inspect branch list",
                  "command": "git branch",
                  "hint": "Type git branch"
          },
          {
                  "instruction": "Switch to gh-pages hosting branch",
                  "command": "git switch gh-pages",
                  "hint": "Type git switch gh-pages"
          },
          {
                  "instruction": "Verify static site status",
                  "command": "git status",
                  "hint": "Type git status"
          }
  ],
      initialFiles: [
        { name: 'index.html', content: '<!DOCTYPE html>\n<html>\n<head><title>My Pages App</title></head>\n<body><h1>Hello from GitHub Pages!</h1></body>\n</html>\n' },
      ],
      initialCommits: [{ hash: '3344556', message: 'feat: add index.html for GitHub Pages' }],
      targetTask: 'Check git status and inspect index.html.',
      hints: ['Run `git status`.'],
      validationRegex: /git status/i,
      solutionCommands: ['git status'],
    },

    challenge: {
      title: 'Inspect GitHub Pages Entrypoint',
      instructions: 'Review index.html file configured for static hosting.',
      startingState: 'index.html present.',
      goalState: 'Working tree status confirmed.',
      hints: ['Run `git status`.'],
    },

    reference: {
      officialDocUrl: 'https://docs.github.com/en/pages',
      syntaxCheatSheet: [
        'URL format: https://<username>.github.io/<repo>/',
        'User site format: repo named <username>.github.io -> https://<username>.github.io',
        'CNAME file : Contains custom domain name',
        '.nojekyll file : Tells Pages not to process with Jekyll (required for Vite/Next.js)',
      ],
      commonErrors: [
        { error: '404 File Not Found on GitHub Pages', remedy: 'Ensure `index.html` is at the root of the selected publishing folder, and wait 1-2 minutes for the initial DNS and build propagation.' },
        { error: 'Assets (CSS, JS) broken due to wrong base path', remedy: 'For subpath URLs (`/repo/`), set `base: "/<repo>/"` in your Vite or Webpack bundler config.' },
      ],
      mentalModelDiagram: {
        concept: 'Pages Hosting Pipeline',
        explanation: 'Git Commit -> GitHub Pages Action -> Build & Extract Artifact -> Fastly Global CDN -> HTTPS Request.',
        storageLocation: 'Global CDN edge nodes serving repository static files.',
      },
      edgeCases: ['GitHub Pages is for static content only; server-side execution (Node.js backend, PHP, Python Flask) is not supported.'],
    },
  },

  'c-gh-security': {
    id: 'c-gh-security',
    command: 'dependabot',
    title: 'Dependabot & Security Alerts',
    topicId: 'topic-18',
    topicNumber: '18',
    topicTitle: 'More GitHub Features',
    subtitle: 'Automated vulnerability scanning, secret detection, and automated PR dependency patches',
    badges: ['Intermediate', 'Security', 'DevSecOps'],
    quote: 'Security is not an afterthought. Dependabot monitors your dependency tree 24/7 and patches CVEs automatically.',
    difficulty: 'Intermediate',

    whatIsIt:
      'GitHub Security features provide continuous, automated protection for your codebase. Key components include: (1) **Dependabot Alerts** (notifies you when third-party packages in package.json, requirements.txt, or Cargo.toml have known security vulnerabilities), (2) **Dependabot Security Updates** (automatically opens Pull Requests bumping vulnerable packages to safe patched versions), (3) **Secret Scanning** (detects leaked tokens and revokes them with cloud providers), and (4) **CodeQL Code Scanning** (semantic static analysis finding SQL injection and XSS).',
    inSimpleWords:
      'A digital home security guard that checks all the locks on your doors every morning. If a burglar finds a way to pick a lock on one of your installed packages, Dependabot opens a door-repair ticket with the new lock already installed.',
    whyDoYouNeedIt:
      '90% of modern software code comes from open-source dependencies. When a critical zero-day CVE is discovered in an npm or pip package, attackers exploit it within hours. Dependabot automatically patches vulnerabilities before hackers can find them.',
    realWorldAnalogy:
      'An automobile manufacturer recall service. If a specific brake fluid sensor has a manufacturing defect, the manufacturer automatically mails you the replacement sensor and repair instructions.',

    syntaxCode: '# .github/dependabot.yml\nversion: 2\nupdates:\n  - package-ecosystem: "npm"\n    directory: "/"\n    schedule:\n      interval: "weekly"',
    syntaxTokens: [
      { token: 'dependabot.yml', role: 'Configuration File', explanation: 'Tells Dependabot which package ecosystems and directories to monitor.' },
      { token: 'package-ecosystem:', role: 'Language Ecosystem', explanation: 'npm, pip, cargo, maven, nuget, docker, github-actions.' },
      { token: 'interval: "weekly"', role: 'Cadence', explanation: 'How often Dependabot checks for updates (daily, weekly, monthly).' },
    ],

    actionStage: {
      before: {
        label: 'Hidden Vulnerability',
        description: 'Your project uses `axios: 0.21.1`. Security researchers publish CVE-2023-45857: high-severity SSRF vulnerability.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Vulnerability published in CVE database',
        historyCommits: [],
        whatChanged: ['Project is vulnerable to remote exploit.'],
        whatDidNotChange: ['Developers unaware of the advisory.'],
      },
      running: {
        label: 'Dependabot Detects & Opens PR',
        description: 'GitHub Advisory Database matches your lockfile. Dependabot automatically opens PR #89: "Bump axios from 0.21.1 to 1.6.0".',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Dependabot PR #89 Opened Automatically',
        historyCommits: [],
        whatChanged: ['PR contains changelog, release notes, and automated version bump.'],
        whatDidNotChange: ['CI test suite automatically executes on the PR branch.'],
      },
      after: {
        label: '1-Click Patch Merged',
        description: 'CI tests pass green. Developer clicks "Merge". Vulnerability resolved in production in under 5 minutes!',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Vulnerability Patched: All Green',
        historyCommits: [
          { hash: 'D89', message: 'chore(deps): bump axios from 0.21.1 to 1.6.0' },
        ],
        whatChanged: ['Zero security vulnerabilities; complete compliance audit trail.'],
        whatDidNotChange: ['Zero manual package editing required.'],
      },
    },

    variations: [
      {
        flag: 'Security Updates',
        title: 'Automated Security PRs',
        syntax: 'Settings -> Code security -> Dependabot security updates: Enabled',
        whatItDoes: 'Automatically opens targeted Pull Requests to bump package versions the instant a known CVE is published.',
        whenToUse: 'Instant automated remediation of zero-day and high-severity security vulnerabilities in dependencies.',
        example: 'Dependabot PR: "Bump lodash from 4.17.15 to 4.17.21"',
        snippet: 'Dependabot security updates',
      },
      {
        flag: 'Version Updates',
        title: 'Scheduled Dependency Maintenance',
        syntax: 'version: 2\nupdates:\n  - package-ecosystem: "npm"\n    directory: "/"\n    schedule:\n      interval: "weekly"',
        whatItDoes: 'Opens regular weekly or monthly PRs keeping dependencies continuously updated to the latest stable versions.',
        whenToUse: 'Preventing technical debt and breaking changes from accumulating over years.',
        example: 'schedule: interval: "weekly"',
        snippet: '.github/dependabot.yml',
      },
      {
        flag: 'Secret Scanning',
        title: 'Block Leaked Credentials at Push Time',
        syntax: 'Settings -> Code security -> Secret scanning -> Push protection: Enabled',
        whatItDoes: 'Inspects commits at the moment of `git push` and rejects the push if it detects cloud API keys or tokens.',
        whenToUse: 'Guaranteeing secrets never enter public git commit history or cloud repositories.',
        example: 'Remote rejected: Push contains AWS Access Key ID',
        snippet: 'Secret push protection',
      },
      {
        flag: 'CodeQL Scanning',
        title: 'Semantic SAST Analysis',
        syntax: 'uses: github/codeql-action/analyze@v3',
        whatItDoes: 'Parses source code into a queryable database to detect SQL injections, cross-site scripting (XSS), and data leaks.',
        whenToUse: 'Continuous security auditing of proprietary application logic on every pull request.',
        example: 'CodeQL analysis: 0 alerts',
        snippet: 'codeql-action/analyze',
      },
    ],

    scenarios: [
      {
        id: 'sc-gh-security-1',
        title: 'Responding to a Critical Remote Code Execution (RCE) Advisory',
        context: 'A critical CVE is disclosed in a popular utility library used by your application. Attackers are actively scanning GitHub for vulnerable repositories.',
        question: 'How does GitHub Dependabot help your security team remediate this vulnerability within minutes?',
        options: [
          {
            label: 'Dependabot automatically matches your lockfile, opens a PR with the patched version, and runs CI tests for instant review',
            command: 'Review and merge Dependabot automated security PR',
            isCorrect: true,
            explanation: 'Dependabot eliminates manual search-and-replace drills by opening a complete PR with changelogs and release notes that can be tested and merged immediately.',
          },
          {
            label: 'Dependabot sends an email and requires you to manually edit 40 package.json files on local branches',
            command: 'Manual edits',
            isCorrect: false,
            explanation: 'Dependabot Security Updates generates the pull request automatically with the exact minimum safe version bump.',
          },
          {
            label: 'Dependabot shuts down your production website to prevent hacks',
            command: 'No command',
            isCorrect: false,
            explanation: 'Dependabot operates strictly on repository dependencies and does not terminate production servers.',
          },
        ],
        whenToUse: 'Rapid incident response to newly disclosed security vulnerabilities.',
        commandExample: 'Review and merge Dependabot automated security PR',
        note: 'Instant automated patch with CI test coverage.',
      },
      {
        id: 'sc-gh-security-2',
        title: 'Preventing Accidental AWS Key Commits Before Remote Push',
        context: 'A developer accidentally leaves their live AWS Secret Access Key in a test config file and runs `git push origin feature/s3-upload`.',
        question: 'What happens if Secret Scanning with Push Protection is enabled on the repository?',
        options: [
          {
            label: 'GitHub intercepts the push, blocks the commit with an error explaining the secret type, and prevents the key from entering the remote repo',
            command: 'git push origin feature/s3-upload (Blocked by Push Protection)',
            isCorrect: true,
            explanation: 'Push protection scans the incoming commit objects in real-time and rejects the push before the secret is written to the remote ref database.',
          },
          {
            label: 'GitHub silently publishes the key on the repository homepage',
            command: 'No command',
            isCorrect: false,
            explanation: 'Push protection blocks secrets from entering the repository.',
          },
          {
            label: 'GitHub automatically rotates the AWS key without telling the developer',
            command: 'No command',
            isCorrect: false,
            explanation: 'GitHub notifies partner providers (AWS/Slack) if secrets are committed, but push protection blocks the push at the gate.',
          },
        ],
        whenToUse: 'Protecting cloud infrastructure credentials from catastrophic leaks.',
        commandExample: 'git push origin feature/s3-upload (Blocked by Push Protection)',
        note: 'Blocks leaked credentials at push time.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'Dependabot Security Updates',
        commandB: 'Dependabot Version Updates',
        aspect: 'Trigger Cadence & Scope',
        descriptionA: 'Triggered immediately upon publication of a verified CVE advisory; targets only the vulnerable package to reach a safe patched version.',
        descriptionB: 'Triggered on a scheduled cron cadence (e.g. weekly on Monday); bumps packages to latest releases regardless of security status.',
        safeForSharedHistory: { a: true, b: true },
      },
      {
        commandA: 'Secret Scanning Push Protection',
        commandB: 'Git Client Pre-commit Hooks',
        aspect: 'Enforcement Point & Tamper Resistance',
        descriptionA: 'Server-side gate enforced by GitHub infrastructure on push; impossible for individual developers to bypass locally.',
        descriptionB: 'Client-side script running on developer laptop; can be easily bypassed with `git commit --no-verify` or forgotten on new machines.',
        safeForSharedHistory: { a: true, b: true },
      },
      {
        commandA: 'CodeQL Code Scanning',
        commandB: 'Linters (ESLint / Flake8)',
        aspect: 'Analysis Depth & Security Vulnerability Detection',
        descriptionA: 'Deep semantic data-flow analysis tracking untrusted user input from HTTP requests into database sinks (detecting SQLi, XSS, SSRF).',
        descriptionB: 'Syntactic style and formatting checks (detecting unused variables, missing semicolons, or indentation rules).',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Ignoring Dependabot PRs until major version breaking changes accumulate',
        whyItHappens: 'Teams treating dependency updates as low-priority chores, causing PRs to go stale and suffer merge conflicts.',
        fix: 'Establish a regular weekly triage rhythm or use automated merge workflows (`@dependabot merge`) for verified patch updates.',
      },
      {
        mistake: 'Bypassing Secret Scanning push protection without rotating the secret',
        whyItHappens: 'Developers in a rush clicking "bypass protection" because they think "I will delete the key in the next commit".',
        fix: 'Never push a secret; remove the secret from commit history using `git commit --amend` or `git reset` before pushing, and rotate the secret if exposed.',
      },
      {
        mistake: 'Not scoping Dependabot schedule intervals leading to dozens of simultaneous PRs',
        whyItHappens: 'Setting `interval: "daily"` on huge monorepos with 50 dependencies.',
        fix: 'Set `open-pull-requests-limit: 5` and `interval: "weekly"` in `.github/dependabot.yml` to maintain a manageable review cadence.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "mkdir -p .github",
          "echo \"version: 2\\nupdates:\\n  - package-ecosystem: npm\\n    directory: /\\n    schedule:\\n      interval: weekly\" > .github/dependabot.yml",
          "git add .github/dependabot.yml",
          "git commit -m \"security: configure dependabot weekly vulnerability scanning\""
  ],
      guidedSteps: [
          {
                  "instruction": "Inspect Dependabot security configuration commit",
                  "command": "git log -n 1 --oneline",
                  "hint": "Type git log -n 1 --oneline"
          },
          {
                  "instruction": "Verify repository status",
                  "command": "git status",
                  "hint": "Type git status"
          }
  ],
      initialFiles: [
        { name: '.github/dependabot.yml', content: 'version: 2\nupdates:\n  - package-ecosystem: "npm"\n    directory: "/"\n    schedule:\n      interval: "weekly"\n' },
      ],
      initialCommits: [{ hash: '1212344', message: 'chore: configure dependabot updates' }],
      targetTask: 'Check git status and inspect dependabot configuration.',
      hints: ['Run `git status`.'],
      validationRegex: /git status/i,
      solutionCommands: ['git status'],
    },

    challenge: {
      title: 'Inspect Dependabot Configuration',
      instructions: 'Review dependabot.yml to verify package ecosystems configured for automated monitoring.',
      startingState: 'dependabot.yml present.',
      goalState: 'Working tree status confirmed.',
      hints: ['Run `git status`.'],
    },

    reference: {
      officialDocUrl: 'https://docs.github.com/en/code-security/dependabot',
      syntaxCheatSheet: [
        '.github/dependabot.yml : Configuration path for Dependabot',
        'Security tab on GitHub : Security overview, alerts, and CodeQL results',
        'Dependabot commands in PR comments: @dependabot rebase, @dependabot recreate',
        'Secret scanning push protection : Prevents committing credentials',
      ],
      commonErrors: [
        { error: 'Dependabot PRs breaking build due to major version bump', remedy: 'Configure `ignore: - dependency-name: "*", update-types: ["version-update:semver-major"]` in dependabot.yml to restrict updates to non-breaking minor/patch versions.' },
      ],
      mentalModelDiagram: {
        concept: 'DevSecOps Defense in Depth',
        explanation: 'Push Protection (Blocks secrets) -> CodeQL (Static analysis for SQLi/XSS) -> Dependabot (Vulnerability CVE monitoring & auto-PRs).',
        storageLocation: 'GitHub Advisory Database and GitHub Security Operations Center.',
      },
      edgeCases: ['Dependabot can be commanded directly via PR comments: `@dependabot merge` will auto-merge the PR once CI passes.'],
    },
  },
};
