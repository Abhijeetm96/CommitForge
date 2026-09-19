import { UniversalConcept } from '../unifiedAcademyData';

export const TOPIC_15_16_CONCEPTS: Record<string, UniversalConcept> = {
  // ==========================================================================
  // TOPIC 15: GitHub Workflow (Actions & CI/CD)
  // ==========================================================================
  'c-actions-intro': {
    id: 'c-actions-intro',
    command: '.github/workflows',
    title: 'GitHub Actions Basics',
    topicId: 'topic-15',
    topicNumber: '15',
    topicTitle: 'GitHub Workflow',
    subtitle: 'Automating software workflows with YAML declarations, event triggers, runners, and steps',
    badges: ['Intermediate', 'CI/CD', 'Automation'],
    quote: 'GitHub Actions turns your repository into an automated computing engine that reacts to every push, PR, and release.',
    difficulty: 'Intermediate',

    whatIsIt:
      'GitHub Actions is a continuous integration and continuous delivery (CI/CD) platform that allows you to automate your build, test, and deployment pipeline. Workflows are defined in YAML files inside the `.github/workflows/` directory. They listen for GitHub repository events (like `push`, `pull_request`, or `schedule`), spin up virtual machines (runners), and execute a sequence of actions and shell commands.',
    inSimpleWords:
      'An invisible robot assistant living inside GitHub that boots up a brand-new computer every time you push code, runs all your tests, and tells you if you broke anything.',
    whyDoYouNeedIt:
      'Without automated workflows, code must be manually tested and deployed from individual developer laptops ("it worked on my machine!"). GitHub Actions guarantees a clean, reproducible, and standardized execution environment for every commit.',
    realWorldAnalogy:
      'An automated car wash conveyor. As soon as your car reaches the entrance sensor (trigger), the water sprays, soap scrubs, brushes spin, and dryers blow (steps) automatically in sequence.',

    syntaxCode: 'name: CI\non: [push, pull_request]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm test',
    syntaxTokens: [
      { token: 'name:', role: 'Workflow Title', explanation: 'Human-readable title displayed in the Actions tab.' },
      { token: 'on:', role: 'Event Trigger', explanation: 'Repository events that launch the workflow (push, pull_request, release).' },
      { token: 'runs-on:', role: 'Runner OS', explanation: 'Target virtual machine environment (ubuntu-latest, windows-latest, macos-latest).' },
      { token: 'uses:', role: 'Reusable Action', explanation: 'Pre-built community or official action (e.g. checkout, setup-node).' },
    ],

    actionStage: {
      before: {
        label: 'Manual Testing Bottleneck',
        description: 'Developer pushes code to GitHub. Testing requires manual verification on individual laptops.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'git push origin main',
        historyCommits: [{ hash: 'A1', message: 'feat: add user login' }],
        whatChanged: ['Commit uploaded to GitHub.'],
        whatDidNotChange: ['No automated validation triggered.'],
      },
      running: {
        label: 'GitHub Runner Boots Up',
        description: 'GitHub provisions an Ubuntu VM, checks out commit A1, installs Node.js, and executes test suite.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Workflow: CI / Job: build (In Progress)',
        historyCommits: [{ hash: 'A1', message: 'feat: add user login' }],
        whatChanged: ['Automated runner executing steps in cloud.'],
        whatDidNotChange: ['Developer free to continue working locally.'],
      },
      after: {
        label: 'Green Checkmark on GitHub',
        description: 'All 45 tests passed. Green checkmark badge appears next to commit and PR. Ready to deploy!',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'All checks passed (exit 0)',
        historyCommits: [
          { hash: 'A1', message: 'feat: add user login (CI: Passed)' },
        ],
        whatChanged: ['Confidence guaranteed by automated CI run.'],
        whatDidNotChange: ['No manual server configuration needed.'],
      },
    },

    variations: [
      {
        flag: 'on: push',
        title: 'Push Event Trigger',
        syntax: 'on:\n  push:\n    branches: [main]',
        whatItDoes: 'Triggers workflow execution whenever commits are pushed to designated branches.',
        whenToUse: 'Running automated test suites and continuous deployment to staging.',
        example: 'on: push: branches: [main]',
        snippet: 'on: push',
      },
      {
        flag: 'on: pull_request',
        title: 'Pull Request Event Trigger',
        syntax: 'on:\n  pull_request:\n    types: [opened, synchronize]',
        whatItDoes: 'Executes tests on incoming feature branches and posts status checks to the PR UI.',
        whenToUse: 'Verifying pull requests before merging into protected branches.',
        example: 'on: pull_request',
        snippet: 'on: pull_request',
      },
      {
        flag: 'on: schedule',
        title: 'Cron Schedule Trigger',
        syntax: 'on:\n  schedule:\n    - cron: "0 2 * * *"',
        whatItDoes: 'Triggers recurring workflow on GitHub servers using standard 5-field cron syntax.',
        whenToUse: 'Nightly builds, database backups, and weekly dependency scans.',
        example: 'on: schedule: - cron: "0 0 * * *"',
        snippet: 'on: schedule',
      },
    ],

    scenarios: [
      {
        id: 'sc-actions-intro-1',
        title: 'Automating PR Quality Checks Before Merging',
        context: 'Your team frequently has developers merge PRs that break the build because someone forgot to run tests locally.',
        question: 'How do you guarantee tests pass before any PR can be merged?',
        options: [
          {
            label: 'Create a `.github/workflows/test.yml` workflow triggered on pull_request that runs npm test',
            command: 'touch .github/workflows/test.yml',
            isCorrect: true,
            explanation: 'GitHub Actions spins up a clean virtual runner for every PR, executes `npm test`, and reports a green checkmark or red X directly on the PR page.',
          },
          {
            label: 'Rely on developers to promise they ran the tests on their laptops in PR description checkboxes',
            command: 'No command',
            isCorrect: false,
            explanation: 'Manual promises fail frequently due to local environment differences ("works on my machine") and human error.',
          },
        ],
        whenToUse: 'Standardizing team-wide automated testing.',
        commandExample: 'Add .github/workflows/test.yml',
        note: 'Blocks broken PRs automatically.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'GitHub Actions (Hosted Runners)',
        commandB: 'Local Git Hooks (pre-push)',
        aspect: 'Execution Environment & Enforcement',
        descriptionA: 'Runs on standardized GitHub cloud virtual machines; results are publicly visible to the entire team and enforce PR branch protection.',
        descriptionB: 'Runs on individual developer laptops; can be bypassed with --no-verify and depends on local developer machine setup.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Placing workflow YAML files in the wrong directory like .github/ or .workflows/',
        whyItHappens: 'Misremembering GitHub Actions convention.',
        fix: 'Workflow YAML files must always live specifically in `.github/workflows/`.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "mkdir -p .github/workflows",
          "echo \"name: CI\\non: [push]\" > .github/workflows/ci.yml",
          "git add .github/workflows/ci.yml",
          "git commit -m \"ci: add GitHub Actions workflow\""
  ],
      guidedSteps: [
          {
                  "instruction": "Inspect workflow commit in git log",
                  "command": "git log -n 1 --oneline",
                  "hint": "Type git log -n 1 --oneline"
          },
          {
                  "instruction": "Check status",
                  "command": "git status",
                  "hint": "Type git status"
          }
  ],
      initialFiles: [
        { name: '.github/workflows/ci.yml', content: 'name: CI\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: echo "Tests green!"\n' },
      ],
      initialCommits: [{ hash: '1212343', message: 'ci: add initial GitHub Actions workflow' }],
      targetTask: 'Check git status and commit history.',
      hints: ['Run `git status`.'],
      validationRegex: /git status/i,
      solutionCommands: ['git status'],
    },

    challenge: {
      title: 'Inspect Workflow YAML',
      instructions: 'Review workflow configuration file inside .github/workflows/.',
      startingState: 'Workflow file present.',
      goalState: 'Working tree status confirmed.',
      hints: ['Run `git status`.'],
    },

    reference: {
      officialDocUrl: 'https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions',
      syntaxCheatSheet: [
        '.github/workflows/*.yml : Workflow definitions path',
        'jobs.<job_id>.steps : Ordered array of execution commands',
        'actions/checkout@v4 : Clones repository into runner workspace',
        'actions/setup-node@v4 : Configures Node.js runtime version',
      ],
      commonErrors: [
        { error: 'Workflow does not trigger on push', remedy: 'Check YAML indentation; YAML is strictly whitespace sensitive. Ensure the file is located under `.github/workflows/`.' },
      ],
      mentalModelDiagram: {
        concept: 'GitHub Actions Architecture',
        explanation: 'Event (Push/PR) -> Workflow (.github/workflows/*.yml) -> Runner (Ubuntu VM) -> Steps (checkout, setup, run test).',
        storageLocation: 'Version-controlled YAML files stored in `.github/workflows/`.',
      },
      edgeCases: ['Workflows created on forks do not have access to repository secrets by default to prevent secret exfiltration attacks.'],
    },
  },

  'c-ci-cd-pipelines': {
    id: 'c-ci-cd-pipelines',
    command: 'actions CI',
    title: 'Continuous Integration & Delivery',
    topicId: 'topic-15',
    topicNumber: '15',
    topicTitle: 'GitHub Workflow',
    subtitle: 'Multi-job build matrixes, dependency caching, artifacts, and automated cloud deployments',
    badges: ['Intermediate', 'DevOps', 'CI/CD'],
    quote: 'Continuous Integration is a cultural practice: integrate daily, test automatically, deploy fearlessly.',
    difficulty: 'Intermediate',

    whatIsIt:
      'CI/CD pipelines represent the complete automated journey from code commit to production deployment. Continuous Integration (CI) automatically builds and tests code with every commit. Continuous Delivery/Deployment (CD) automatically packages artifacts and deploys approved, green code to staging or production environments (AWS, Vercel, Docker, Kubernetes) without human intervention.',
    inSimpleWords:
      'A fully automated factory conveyor belt that inspects the toy, paints it, boxes it, and loads it onto the delivery truck without anyone touching it by hand.',
    whyDoYouNeedIt:
      'Manual deployments ("FTP-ing files to the server" or running deploy scripts from someone\'s laptop at 10 PM) are error-prone, stressful, and cause downtime. CI/CD pipelines make deployments boring, routine, and reversible.',
    realWorldAnalogy:
      'A modern newspaper printing plant. As soon as the final editor approves the article digitally, the computer presses print 100,000 copies, robots bundle them into trucks, and drivers deliver them before dawn.',

    syntaxCode: 'jobs:\n  test:\n    strategy:\n      matrix:\n        node: [18, 20, 22]\n    runs-on: ubuntu-latest\n    steps: ...\n  deploy:\n    needs: test\n    runs-on: ubuntu-latest\n    steps: ...',
    syntaxTokens: [
      { token: 'strategy.matrix', role: 'Matrix Build', explanation: 'Runs parallel test jobs across multiple OS or language versions.' },
      { token: 'needs: test', role: 'Job Dependency', explanation: 'Ensures deploy job only executes if test job passes with 100% success.' },
    ],

    actionStage: {
      before: {
        label: 'PR Approved',
        description: 'Feature PR approved by lead reviewer and merged into main branch.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Merge commit M1 lands on main',
        historyCommits: [{ hash: 'M1', message: 'Merge PR #55 into main' }],
        whatChanged: ['Main branch updated.'],
        whatDidNotChange: ['Production server still running previous version.'],
      },
      running: {
        label: 'Pipeline Executes in Parallel',
        description: 'CI runs test matrix on Node 18, 20, and 22. When all 3 pass, CD job builds Docker container and pushes to registry.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Matrix Tests: 3/3 Green -> Deploy Job Running',
        historyCommits: [{ hash: 'M1', message: 'Merge PR #55 into main' }],
        whatChanged: ['Container image built and verified.'],
        whatDidNotChange: ['Production traffic not yet switched.'],
      },
      after: {
        label: 'Zero-Downtime Deployment',
        description: 'CD updates production cluster. Health checks confirm 200 OK. Feature is live to millions of users.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Deployed to Production (Live)',
        historyCommits: [
          { hash: 'M1', message: 'Merge PR #55 into main (Status: Deployed)' },
        ],
        whatChanged: ['Production updated automatically within 3 minutes of merge.'],
        whatDidNotChange: ['Full rollback capability preserved in release history.'],
      },
    },

    variations: [
      {
        flag: 'Matrix Builds',
        title: 'Multi-Version Testing Matrix',
        syntax: 'strategy:\n  matrix:\n    os: [ubuntu-latest, macos-latest]\n    node: [18, 20, 22]',
        whatItDoes: 'Spins up multiple concurrent runners testing every permutation of operating system and runtime.',
        whenToUse: 'Testing libraries and applications across cross-platform environments.',
        example: 'strategy: matrix: node: [18, 20]',
        snippet: 'strategy: matrix',
      },
      {
        flag: 'Dependency Cache',
        title: 'Automated Dependency Caching',
        syntax: 'uses: actions/setup-node@v4\nwith:\n  cache: "npm"',
        whatItDoes: 'Caches downloaded dependencies between workflow runs to speed up CI execution by 50-80%.',
        whenToUse: 'Every workflow that runs npm install, yarn, or pip install.',
        example: 'cache: "npm"',
        snippet: 'cache: "npm"',
      },
      {
        flag: 'Environments',
        title: 'Deployment Environment Protection',
        syntax: 'environment:\n  name: production\n  url: https://example.com',
        whatItDoes: 'Connects job to GitHub Environment with required reviewers, wait timers, and deployment URLs.',
        whenToUse: 'Guarding production deployments with manual approval gates.',
        example: 'environment: production',
        snippet: 'environment: production',
      },
    ],

    scenarios: [
      {
        id: 'sc-cicd-1',
        title: 'Preventing Production Deployment When Tests Fail',
        context: 'You have a workflow with two jobs: `test` and `deploy`. By default, GitHub Actions runs all top-level jobs concurrently.',
        question: 'How do you ensure the `deploy` job never executes if `test` fails?',
        options: [
          {
            label: 'Add `needs: test` to the deploy job declaration',
            command: 'deploy:\n  needs: test',
            isCorrect: true,
            explanation: 'The `needs` keyword establishes a Directed Acyclic Graph (DAG) dependency, guaranteeing `deploy` only starts if `test` exits with code 0.',
          },
          {
            label: 'Add sleep 60 to the deploy job so tests finish first',
            command: 'run: sleep 60',
            isCorrect: false,
            explanation: 'Sleeping is non-deterministic and deploy will still run even if tests fail during the sleep.',
          },
        ],
        whenToUse: 'Sequencing CI and CD jobs safely.',
        commandExample: 'deploy:\n  needs: test',
        note: 'Guarantees broken builds never deploy.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'needs: [job_id] (Sequential)',
        commandB: 'Parallel Jobs (Default)',
        aspect: 'Execution Dependency',
        descriptionA: 'Job waits until specified prerequisite jobs succeed before starting. Stops pipeline if prerequisites fail.',
        descriptionB: 'All jobs boot up simultaneously on separate runners to maximize execution speed.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Omitting the `needs:` keyword on deploy jobs, causing broken code to deploy during test failures',
        whyItHappens: 'Assuming jobs in YAML run top-to-bottom sequentially by default.',
        fix: 'Always declare `needs: [test]` on any deployment or publishing job.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"test passing\" > test.js",
          "git add test.js",
          "git commit -m \"test: add automated unit tests\""
  ],
      guidedSteps: [
          {
                  "instruction": "Check commit triggering CI pipeline",
                  "command": "git log -n 1",
                  "hint": "Type git log -n 1"
          },
          {
                  "instruction": "Verify repository status",
                  "command": "git status",
                  "hint": "Type git status"
          }
  ],
      initialFiles: [
        { name: 'pipeline.yml', content: 'name: Production Pipeline\njobs:\n  lint: ...\n  test:\n    needs: lint\n  deploy:\n    needs: test\n' },
      ],
      initialCommits: [{ hash: '8899001', message: 'ci: define production multi-job pipeline' }],
      targetTask: 'Check git status and commit history.',
      hints: ['Run `git status`.'],
      validationRegex: /git status/i,
      solutionCommands: ['git status'],
    },

    challenge: {
      title: 'Inspect CI/CD Configuration',
      instructions: 'Review pipeline file to verify job dependencies and stages.',
      startingState: 'Pipeline file present.',
      goalState: 'Working tree status confirmed.',
      hints: ['Run `git status`.'],
    },

    reference: {
      officialDocUrl: 'https://docs.github.com/en/actions/deployment/about-deployments/about-continuous-deployment',
      syntaxCheatSheet: [
        'needs: [job1, job2] : Declare prerequisite jobs',
        'strategy.matrix : Run jobs across parameter permutations',
        'actions/upload-artifact@v4 : Save build files for subsequent jobs',
        'actions/download-artifact@v4 : Retrieve saved build files',
      ],
      commonErrors: [
        { error: 'Deploy job ran even though tests failed', remedy: 'You forgot to specify `needs: test` on the deploy job; by default, GitHub Actions runs all top-level jobs in parallel.' },
      ],
      mentalModelDiagram: {
        concept: 'CI/CD Directed Acyclic Graph (DAG)',
        explanation: '[Lint] & [Unit Tests] ---> [Integration Tests] ---> [Build Docker Image] ---> [Deploy Production].',
        storageLocation: 'GitHub Actions workflow execution graph.',
      },
      edgeCases: ['Concurrent deployments can be managed using `concurrency: group: production` to prevent race conditions during rapid merges.'],
    },
  },

  'c-action-secrets': {
    id: 'c-action-secrets',
    command: 'secrets',
    title: 'Encrypted Secrets & Variables',
    topicId: 'topic-15',
    topicNumber: '15',
    topicTitle: 'GitHub Workflow',
    subtitle: 'Safely providing API tokens, database credentials, and deployment keys to automated runners',
    badges: ['Intermediate', 'Security', 'DevOps'],
    quote: 'Never commit API keys or passwords to Git. Store them in GitHub Encrypted Secrets and inject them at runtime.',
    difficulty: 'Intermediate',

    whatIsIt:
      'GitHub Encrypted Secrets are encrypted environment variables stored securely in your repository or organization settings using Libsodium sealed boxes. Secrets are never displayed in plaintext after creation, are automatically masked (`***`) in GitHub Actions console logs, and can be passed securely to workflow jobs as environment variables using `${{ secrets.NAME }}`.',
    inSimpleWords:
      'A locked digital safe on GitHub. You drop your secret AWS password inside; your automated robot can use the password to deploy your website, but nobody looking at the screen can see what the password is.',
    whyDoYouNeedIt:
      'Hardcoding API keys, database credentials, or deploy tokens inside code or YAML files results in severe security breaches if the repository is public or compromised. Encrypted Secrets decouple sensitive credentials from code.',
    realWorldAnalogy:
      'An armored courier delivering cash to a bank vault. The courier carries the locked briefcase; the teller accepts it without spectators on the street knowing the safe combination.',

    syntaxCode: 'env:\n  AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}\n  DATABASE_URL: ${{ secrets.PROD_DB_URL }}',
    syntaxTokens: [
      { token: '${{ secrets.NAME }}', role: 'Secret Expression', explanation: 'Interpolates encrypted secret into runner environment.' },
      { token: 'env:', role: 'Environment Mapping', explanation: 'Passes secret as an environment variable to a step or job.' },
      { token: 'vars.NAME', role: 'Configuration Variable', explanation: 'Used for non-sensitive configuration values (e.g. port, region).' },
    ],

    actionStage: {
      before: {
        label: 'Sensitive Deployment Needs',
        description: 'Workflow needs to deploy to AWS S3, but AWS access keys must NEVER appear in `deploy.yml`.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Need AWS credentials securely',
        historyCommits: [],
        whatChanged: ['Code is ready to deploy.'],
        whatDidNotChange: ['No keys in repository files.'],
      },
      running: {
        label: 'Secret Injected into Runner Memory',
        description: 'Developer saved `AWS_SECRET_ACCESS_KEY` in GitHub Settings -> Secrets. Runner receives key in memory only.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'AWS CLI authenticated using ${{ secrets.AWS_KEY }}',
        historyCommits: [],
        whatChanged: ['Runner memory holds decrypted credentials temporarily.'],
        whatDidNotChange: ['Console output displays `***` to prevent log leakage.'],
      },
      after: {
        label: 'Clean Deallocation',
        description: 'Deployment completes. Virtual machine is completely destroyed. Zero secrets persist on disk.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Deployment Successful (0 Secrets Leaked)',
        historyCommits: [],
        whatChanged: ['Application deployed securely.'],
        whatDidNotChange: ['Git history remains 100% clean of credentials.'],
      },
    },

    variations: [
      {
        flag: 'Repository Secrets',
        title: 'Encrypted Repository Secret',
        syntax: '${{ secrets.AWS_ACCESS_KEY_ID }}',
        whatItDoes: 'Interpolates an encrypted repository secret into an environment variable or step argument at runner runtime.',
        whenToUse: 'Supplying deployment tokens, SSH keys, and API credentials to CI runners.',
        example: 'env:\n  KEY: ${{ secrets.AWS_KEY }}',
        snippet: '${{ secrets.NAME }}',
      },
      {
        flag: 'Config Variables',
        title: 'Plaintext Configuration Variable',
        syntax: '${{ vars.API_BASE_URL }}',
        whatItDoes: 'Accesses non-sensitive plain-text configuration variables without encryption overhead.',
        whenToUse: 'Non-secret settings like regions, ports, domain names, and feature flags.',
        example: 'env:\n  PORT: ${{ vars.PORT }}',
        snippet: '${{ vars.NAME }}',
      },
      {
        flag: 'CLI Secret Set',
        title: 'Manage Secrets via GitHub CLI',
        syntax: 'gh secret set <NAME> --body "<value>"',
        whatItDoes: 'Creates or updates encrypted secrets directly from the terminal without opening the web browser.',
        whenToUse: 'Automating developer environment setup and cloud credential rotation.',
        example: 'gh secret set PROD_API_KEY',
        snippet: 'gh secret set <name>',
      },
    ],

    scenarios: [
      {
        id: 'sc-secrets-1',
        title: 'Injecting Database Credentials into Cloud Deploy Runner',
        context: 'Your continuous deployment job needs the production Postgres database URL to run schema migrations during deployment.',
        question: 'How do you provide this sensitive credential to GitHub Actions safely?',
        options: [
          {
            label: 'Store DATABASE_URL in GitHub Repository Encrypted Secrets and inject it via env in the workflow step',
            command: 'DATABASE_URL: ${{ secrets.DATABASE_URL }}',
            isCorrect: true,
            explanation: 'GitHub Encrypted Secrets encrypts credentials with Libsodium sealed boxes, decrypts them in runner RAM only, and automatically masks them with *** in logs.',
          },
          {
            label: 'Commit a .env file with the database password to the repository',
            command: 'git add .env && git commit -m "add prod credentials"',
            isCorrect: false,
            explanation: 'Committing passwords into Git permanently leaks them in repository history and compromises your database.',
          },
        ],
        whenToUse: 'Managing sensitive credentials in CI/CD.',
        commandExample: '${{ secrets.DATABASE_URL }}',
        note: 'Masks secrets in console logs.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'GitHub Encrypted Secrets (`${{ secrets.* }}`)',
        commandB: 'Configuration Variables (`${{ vars.* }}`)',
        aspect: 'Encryption & Log Masking',
        descriptionA: 'Encrypted at rest with Libsodium; write-only in UI; automatically masked (`***`) in runner logs.',
        descriptionB: 'Stored in plaintext; visible in repository settings; intended for non-sensitive values like regions and ports.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Attempting to print or base64-encode secrets in shell scripts to debug values',
        whyItHappens: 'Wondering why a credential is not working during deployment.',
        fix: 'Never echo or transform secrets in CI logs; test credentials locally using isolated sandbox tokens.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \".env\" > .gitignore",
          "echo \"api config\" > api.js",
          "git add .gitignore api.js",
          "git commit -m \"feat: protect secrets from Git history\""
  ],
      guidedSteps: [
          {
                  "instruction": "Verify .gitignore keeps secrets untracked",
                  "command": "git status",
                  "hint": "Type git status"
          },
          {
                  "instruction": "Check commit log",
                  "command": "git log --oneline -n 1",
                  "hint": "Type git log --oneline -n 1"
          }
  ],
      initialFiles: [
        { name: '.env.example', content: 'API_KEY=your_key_here\nDATABASE_URL=postgres://localhost:5432/db\n' },
      ],
      initialCommits: [{ hash: '1234432', message: 'chore: add env example file' }],
      targetTask: 'Check git status and commit history.',
      hints: ['Run `git status`.'],
      validationRegex: /git status/i,
      solutionCommands: ['git status'],
    },

    challenge: {
      title: 'Inspect Environment Template',
      instructions: 'Review .env.example to ensure no real secrets are committed.',
      startingState: 'Template file present.',
      goalState: 'Working tree status confirmed.',
      hints: ['Run `git status`.'],
    },

    reference: {
      officialDocUrl: 'https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions',
      syntaxCheatSheet: [
        'gh secret set <NAME> : Set secret via GitHub CLI',
        '${{ secrets.SECRET_NAME }} : Access encrypted secret in workflow',
        '${{ vars.CONFIG_NAME }} : Access non-sensitive variable in workflow',
        'Secrets are automatically masked in console logs with ***',
      ],
      commonErrors: [
        { error: 'Secret value printing as empty string in workflow', remedy: 'Workflows triggered by pull requests from external forks do not have access to secrets for security reasons.' },
      ],
      mentalModelDiagram: {
        concept: 'Secret Injection Lifecycle',
        explanation: 'Encrypted in Cloud DB -> Injected into Runner RAM -> Masked in Logs (***) -> VM Destroyed after job.',
        storageLocation: 'GitHub secure encrypted vault backed by Libsodium public-key encryption.',
      },
      edgeCases: ['Never use commands like `echo "${{ secrets.MY_SECRET }}" | base64` in workflow scripts, because transforming the secret can bypass the log masking engine.'],
    },
  },

  'c-releases-artifacts': {
    id: 'c-releases-artifacts',
    command: 'releases',
    title: 'Automated GitHub Releases',
    topicId: 'topic-15',
    topicNumber: '15',
    topicTitle: 'GitHub Workflow',
    subtitle: 'Packaging binary distributions, generating changelogs, and attaching build assets on tag pushes',
    badges: ['Intermediate', 'Release Management', 'CI/CD'],
    quote: 'A GitHub Release is the bridge between developers and end users. Package binaries, changelogs, and assets automatically.',
    difficulty: 'Intermediate',

    whatIsIt:
      'GitHub Releases allow software teams to package and distribute software iterations to end users. Releases are anchored to Git tags and can include compiled binary artifacts (EXE, DMG, ZIP, APK, TAR.GZ), automatically generated release notes based on merged pull requests, and prerelease/latest badges.',
    inSimpleWords:
      'The download page for your software. When you tag a new version, GitHub packages your app into ready-to-download installers and writes a clean list of everything that changed.',
    whyDoYouNeedIt:
      'End users and sysadmins should not have to install Git and compile code from scratch to run your app. Releases provide direct downloadable binaries and clear changelogs so users know what was added, fixed, or changed.',
    realWorldAnalogy:
      'A movie premiere. Rather than inviting the audience to the editing bay with 50 hard drives of raw camera footage, you distribute the final rendered 4K Blu-ray disc in a retail box with cover art and a booklet.',

    syntaxCode: 'gh release create <tag> --title "<title>" --notes "<notes>" [files...]',
    syntaxTokens: [
      { token: 'gh release create', role: 'CLI Action', explanation: 'Creates a new official GitHub release.' },
      { token: '<tag>', role: 'Anchor Tag', explanation: 'The git tag that marks this release point (e.g. v1.4.0).' },
      { token: '[files...]', role: 'Binary Assets', explanation: 'Compiled installers or zip bundles attached to the release.' },
    ],

    actionStage: {
      before: {
        label: 'Tag Pushed to GitHub',
        description: 'Developer pushed tag `v2.0.0`. GitHub Actions triggers release automation workflow.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Tag v2.0.0 detected',
        historyCommits: [{ hash: 'T20', message: 'chore: release v2.0.0 (tag: v2.0.0)' }],
        whatChanged: ['Release tag active in repo.'],
        whatDidNotChange: ['No public release page created yet.'],
      },
      running: {
        label: 'Building Binaries & Changelog',
        description: 'GitHub Action compiles Mac, Windows, and Linux executables and aggregates PR titles since v1.9.0.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'gh release create v2.0.0 --generate-notes dist/*',
        historyCommits: [{ hash: 'T20', message: 'chore: release v2.0.0' }],
        whatChanged: ['Release notes generated; binaries uploaded to release CDN.'],
        whatDidNotChange: ['Source code remains unchanged.'],
      },
      after: {
        label: 'Public Release Published',
        description: 'GitHub release page live with download links: `app-windows.exe`, `app-macos.dmg`. Users notified!',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Release v2.0.0 Published (Latest)',
        historyCommits: [
          { hash: 'T20', message: 'chore: release v2.0.0' },
        ],
        whatChanged: ['Users can download one-click installers.'],
        whatDidNotChange: ['Automated audit trail preserved.'],
      },
    },

    variations: [
      {
        flag: 'gh release create',
        title: 'Publish Release via GitHub CLI',
        syntax: 'gh release create <tag> --title "<title>" --notes "<notes>" [binaries...]',
        whatItDoes: 'Creates an official GitHub release and uploads binary assets and changelogs directly from the terminal.',
        whenToUse: 'Publishing official desktop apps, CLIs, and packaged releases.',
        example: 'gh release create v1.0.0 ./dist/bundle.zip --generate-notes',
        snippet: 'gh release create',
      },
      {
        flag: '--generate-notes',
        title: 'Automated Release Notes Generator',
        syntax: 'gh release create <tag> --generate-notes',
        whatItDoes: 'Automatically aggregates merged pull request titles, committers, and contributors into Markdown release notes.',
        whenToUse: 'Eliminating manual release notes drafting for weekly or sprint releases.',
        example: 'gh release create v1.2.0 --generate-notes',
        snippet: '--generate-notes',
      },
      {
        flag: '--prerelease',
        title: 'Beta & Release Candidate Flags',
        syntax: 'gh release create <tag> --prerelease --draft',
        whatItDoes: 'Creates an unpublished draft release tagged as beta or release candidate for internal QA verification.',
        whenToUse: 'Staging early builds for testing before public general availability.',
        example: 'gh release create v2.0-rc1 --prerelease',
        snippet: '--prerelease',
      },
    ],

    scenarios: [
      {
        id: 'sc-release-1',
        title: 'Publishing Compiled Binaries for End Users',
        context: 'Your team built a cross-platform desktop tool in Go. You want users to download compiled .exe and .dmg files without building from source.',
        question: 'What GitHub feature publishes downloadable installer packages linked to an official version tag?',
        options: [
          {
            label: 'GitHub Releases with attached binary assets generated by an automated tag workflow',
            command: 'gh release create v1.0.0 ./bin/app-windows.exe ./bin/app-macos.dmg --generate-notes',
            isCorrect: true,
            explanation: 'GitHub Releases hosts downloadable distribution assets on a worldwide CDN linked to the immutable Git release tag.',
          },
          {
            label: 'Commit the 500MB compiled binary executables directly into Git repository commit history',
            command: 'git add *.exe *.dmg && git commit -m "add binaries"',
            isCorrect: false,
            explanation: 'Committing huge binary files bloats the repository permanently, making cloning sluggish for everyone.' },
        ],
        whenToUse: 'Distributing compiled software.',
        commandExample: 'gh release create v1.0.0 dist/* --generate-notes',
        note: 'Provides direct user downloads.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'GitHub Releases (Attached Binaries)',
        commandB: 'Git Repository Commit History',
        aspect: 'Binary Asset Storage & Scaling',
        descriptionA: 'CDN-hosted distribution files up to 2GB per file; does not bloat Git database or clone times.',
        descriptionB: 'Tracks delta blobs in `.git/objects`; committing large compiled binaries permanently bloats repo size for all clones.',
        safeForSharedHistory: { a: true, b: false },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Committing compiled binary executables (.exe, .dmg, .apk) directly into git branches',
        whyItHappens: 'Wanting users to access compiled files easily.',
        fix: 'Add binary extensions to `.gitignore` and distribute them via GitHub Releases instead.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"binary payload\" > dist.tar.gz",
          "echo \"release notes v1.0\" > CHANGELOG.md",
          "git add CHANGELOG.md",
          "git commit -m \"docs: generate release changelog\"",
          "git tag v1.0.0"
  ],
      guidedSteps: [
          {
                  "instruction": "List release tags",
                  "command": "git tag",
                  "hint": "Type git tag"
          },
          {
                  "instruction": "Inspect the release milestone commit",
                  "command": "git log -n 1 v1.0.0",
                  "hint": "Type git log -n 1 v1.0.0"
          }
  ],
      initialFiles: [{ name: 'release-notes.md', content: '## v1.0.0\n- Initial release with complete UI\n' }],
      initialCommits: [{ hash: '7766554', message: 'docs: prepare release notes' }],
      targetTask: 'Check git status and commit history.',
      hints: ['Run `git status`.'],
      validationRegex: /git status/i,
      solutionCommands: ['git status'],
    },

    challenge: {
      title: 'Inspect Release Documentation',
      instructions: 'Review release notes document in repository root.',
      startingState: 'Release notes present.',
      goalState: 'Working tree status confirmed.',
      hints: ['Run `git status`.'],
    },

    reference: {
      officialDocUrl: 'https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases',
      syntaxCheatSheet: [
        'gh release list : List releases in current repository',
        'gh release view <tag> : View release notes and download links',
        'gh release create <tag> <files> : Create release with attachments',
        'gh release download <tag> : Download release assets to local disk',
      ],
      commonErrors: [
        { error: 'Release creation fails: Tag does not exist', remedy: 'Ensure the tag is created and pushed to GitHub (`git push origin <tag>`) before running release commands.' },
      ],
      mentalModelDiagram: {
        concept: 'Release Artifact Architecture',
        explanation: 'Git Tag (SHA anchor) -> GitHub Release (Changelog + Metadata) -> Attached Assets (Binaries/ZIPs on AWS S3 CDN).',
        storageLocation: 'GitHub Release database and Amazon S3 asset storage.',
      },
      edgeCases: ['Release assets have a 2 GB file size limit per file on standard GitHub accounts.'],
    },
  },

  // ==========================================================================
  // TOPIC 16: Advanced Git Topics
  // ==========================================================================
  'c-git-reflog': {
    id: 'c-git-reflog',
    command: 'git reflog',
    title: 'git reflog (The Ultimate Safety Net)',
    topicId: 'topic-16',
    topicNumber: '16',
    topicTitle: 'Advanced Git Topics',
    subtitle: 'Recovering lost commits, deleted branches, accidental resets, and botched rebases',
    badges: ['Advanced', 'Safety Net', 'Lifesaver'],
    quote: 'Nothing is truly lost in Git until the garbage collector runs. The reflog remembers every step you took.',
    difficulty: 'Advanced',

    whatIsIt:
      '`git reflog` (reference log) records every single time the tip of any branch or `HEAD` pointer moves in your local repository—whether by committing, checking out, switching, rebasing, pulling, or resetting. Because Git retains unreachable commit objects for at least 30 to 90 days before garbage collection (`git gc`), reflog allows you to travel back to any past state and rescue seemingly deleted code.',
    inSimpleWords:
      'The black-box flight recorder on an airplane. Even if you accidentally delete your entire feature branch or run the wrong command, reflog has a timestamped list of where you were standing 5 minutes ago so you can undo the disaster.',
    whyDoYouNeedIt:
      'Every developer eventually runs `git reset --hard` by mistake or deletes the wrong branch with `git branch -D`. Panic ensues. `git reflog` is your superpower: find the commit SHA from 10 minutes ago, checkout or reset to it, and your work is 100% restored.',
    realWorldAnalogy:
      'Browser history. Even if you closed an important tab with no bookmark, you simply open your History, search for 2:15 PM, and click the link to bring the webpage right back.',

    syntaxCode: 'git reflog [show] [HEAD]',
    syntaxTokens: [
      { token: 'git reflog', role: 'Command', explanation: 'Prints sequential history of HEAD pointer movements.' },
      { token: 'HEAD@{0}', role: 'Reflog Selector', explanation: 'Current HEAD position (0 steps ago).' },
      { token: 'HEAD@{1}', role: 'Previous Position', explanation: 'Where HEAD was immediately before the last command.' },
    ],

    actionStage: {
      before: {
        label: 'Accidental Catastrophe',
        description: 'Developer meant to reset 1 commit, but accidentally typed `git reset --hard HEAD~5`. Five days of work vanished from `git log`!',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Accidental git reset --hard HEAD~5',
        historyCommits: [{ hash: 'C1', message: 'Initial baseline' }],
        whatChanged: ['Five commits disappeared from normal branch history.'],
        whatDidNotChange: ['Commit objects still exist in `.git/objects`.'],
      },
      running: {
        label: 'Inspecting the Reflog',
        description: 'Developer runs `git reflog`. Row 1 shows: `HEAD@{1}: commit: feat: complete OAuth flow (sha: a9b8c7d)`.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'git reflog: found a9b8c7d',
        historyCommits: [],
        whatChanged: ['Lost commit SHA identified in seconds.'],
        whatDidNotChange: ['No code restored yet.'],
      },
      after: {
        label: 'Rescued and Restored',
        description: 'Running `git reset --hard a9b8c7d` moves HEAD back to the lost commit. All 5 days of work completely restored!',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'git reset --hard a9b8c7d -> Restored!',
        historyCommits: [
          { hash: 'a9b8c7d', message: 'feat: complete OAuth flow (RESTORED)' },
        ],
        whatChanged: ['Branch tip restored to exact pre-accident state.'],
        whatDidNotChange: ['Zero lines of code lost.'],
      },
    },

    variations: [
      {
        flag: 'git reflog',
        title: 'Inspect HEAD Reference Journal',
        syntax: 'git reflog',
        whatItDoes: 'Shows recent movements of HEAD with SHA references, action types, and commit notes.',
        whenToUse: 'Locating lost commits after reset, rebase, or branch deletion.',
        example: 'git reflog',
        snippet: 'git reflog',
      },
      {
        flag: 'branch-reflog',
        title: 'Inspect Specific Branch History',
        syntax: 'git reflog show <branch-name>',
        whatItDoes: 'Shows the chronological movement history of a specific local branch pointer.',
        whenToUse: 'Tracking what happened to a collaborative feature branch over time.',
        example: 'git reflog show feature/auth',
        snippet: 'git reflog show <branch>',
      },
      {
        flag: 'Rescue to Branch',
        title: 'Restore Lost SHA to New Branch',
        syntax: 'git switch -c <new-branch> <lost-commit-sha>',
        whatItDoes: 'Creates and checks out a brand new branch pointing directly to the recovered commit SHA.',
        whenToUse: 'Safest way to rescue lost work without resetting or overwriting current branch pointers.',
        example: 'git switch -c rescue HEAD@{2}',
        snippet: 'git switch -c rescue <sha>',
      },
    ],

    scenarios: [
      {
        id: 'sc-reflog-1',
        title: 'Accidental `git reset --hard` Erased 4 Commits',
        context: 'You meant to unstage files, but accidentally ran `git reset --hard HEAD~4`. Four days of committed work disappeared from `git log`.',
        question: 'How do you recover all four lost commits in 30 seconds?',
        options: [
          {
            label: 'Run `git reflog`, identify the commit SHA from before the reset, and run `git reset --hard <sha>` (or switch to a new branch at that SHA)',
            command: 'git reflog && git reset --hard HEAD@{1}',
            isCorrect: true,
            explanation: 'Git does not delete unreachable commits immediately. The reflog records the SHA of where HEAD was standing before the reset, allowing instantaneous recovery.',
          },
          {
            label: 'Panic, close the laptop, and rewrite the 4 days of code from memory',
            command: 'No command',
            isCorrect: false,
            explanation: 'Git reflog retains unreachable commits for at least 30-90 days, so the work is not lost.',
          },
        ],
        whenToUse: 'Rescuing lost commits and deleted branches.',
        commandExample: 'git reflog && git reset --hard HEAD@{1}',
        note: 'Ultimate safety net in Git.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'git reflog',
        commandB: 'git log',
        aspect: 'Scope of History Tracked',
        descriptionA: 'Local journal recording every time HEAD or branches moved on your computer, including lost, orphan, and reset commits.',
        descriptionB: 'Traverses the topological commit graph reachable from current HEAD. Hides reset or deleted commits.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Expecting reflog to recover uncommitted or unstaged changes',
        whyItHappens: 'Assuming reflog is a filesystem backup.',
        fix: 'Reflog only tracks commits. If changes were never committed or stashed, Git cannot recover them.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"c1\" > f.txt",
          "git add f.txt",
          "git commit -m \"c1: base\"",
          "echo \"c2\" > f.txt",
          "git commit -am \"c2: lost work\"",
          "git reset --hard HEAD~1"
  ],
      guidedSteps: [
          {
                  "instruction": "Inspect current HEAD commit after hard reset",
                  "command": "git log --oneline",
                  "hint": "Type git log --oneline"
          },
          {
                  "instruction": "Consult the reflog journal to locate the lost commit",
                  "command": "git reflog",
                  "hint": "Type git reflog"
          },
          {
                  "instruction": "Rescue lost commit by creating a recovery branch",
                  "command": "git branch rescue HEAD@{1}",
                  "hint": "Type git branch rescue HEAD@{1}"
          },
          {
                  "instruction": "Verify the rescue branch restored the lost commit",
                  "command": "git log rescue --oneline",
                  "hint": "Type git log rescue --oneline"
          }
  ],
      initialFiles: [{ name: 'safe.js', content: 'console.log("Safe code");\n' }],
      initialCommits: [
        { hash: '1112223', message: 'feat: step 1' },
        { hash: '4445556', message: 'feat: step 2' },
      ],
      targetTask: 'Check git reflog to view recent pointer movements.',
      hints: ['Run `git reflog`.'],
      validationRegex: /git reflog/i,
      solutionCommands: ['git reflog'],
    },

    challenge: {
      title: 'Inspect Reference Log Entries',
      instructions: 'Examine HEAD reflog to trace past actions.',
      startingState: 'Repository with history.',
      goalState: 'Reflog entries displayed.',
      hints: ['Run `git reflog -n 5`.'],
    },

    reference: {
      officialDocUrl: 'https://git-scm.com/docs/git-reflog',
      syntaxCheatSheet: [
        'git reflog : View recent HEAD history',
        'git reset --hard HEAD@{1} : Undo last HEAD movement',
        'git branch <name> <sha> : Recreate deleted branch at SHA',
        'git reflog expire --expire=now --all : Force expire reflogs (danger)',
      ],
      commonErrors: [
        { error: 'Reflog does not show my uncommitted changes', remedy: 'Reflog ONLY tracks commits and pointer movements. Files that were never committed or stashed cannot be recovered by reflog.' },
      ],
      mentalModelDiagram: {
        concept: 'Reflog Ledger',
        explanation: 'Every time HEAD moves (commit, checkout, rebase, reset), an entry is appended to `.git/logs/HEAD`.',
        storageLocation: 'Plaintext log files in `.git/logs/HEAD` and `.git/logs/refs/`.',
      },
      edgeCases: ['Reflog entries are purely local to your machine; they are never transferred during `git push` or `git clone`.'],
    },
  },

  'c-git-bisect': {
    id: 'c-git-bisect',
    command: 'git bisect',
    title: 'git bisect',
    topicId: 'topic-16',
    topicNumber: '16',
    topicTitle: 'Advanced Git Topics',
    subtitle: 'Binary search debugging: finding the exact commit that introduced a regression in seconds',
    badges: ['Advanced', 'Debugging', 'Algorithmic'],
    quote: 'Instead of manually testing 500 commits one by one, binary search pinpoints the exact offending commit in 9 tests.',
    difficulty: 'Advanced',

    whatIsIt:
      '`git bisect` uses a binary search algorithm to find which commit in your project\'s history introduced a bug. You tell Git a "bad" commit (where the bug exists, usually `HEAD`) and a "good" commit (an older commit before the bug existed). Git checks out the middle commit, you test whether the bug is present, tag it `good` or `bad`, and Git halves the search space until it isolates the exact culprit commit.',
    inSimpleWords:
      'Playing the "guess a number between 1 and 100" game. Instead of guessing 1, 2, 3, 4, you guess 50. If too high, you guess 25. You find the exact answer in just 7 guesses.',
    whyDoYouNeedIt:
      'A feature that worked 3 months ago is suddenly broken today, and 600 commits were merged in between. Reading 600 diffs by hand is impossible. `git bisect` cuts 600 commits down to just 9 quick test checks (`log2(600) ≈ 9.2`).',
    realWorldAnalogy:
      'An electrician finding a severed underground cable along a 10-mile highway. Instead of digging up every foot of highway, they test the voltage at Mile 5. If voltage is normal, the break is between Mile 5 and 10; they test Mile 7.5 next.',

    syntaxCode: 'git bisect start && git bisect bad && git bisect good <commit-or-tag>',
    syntaxTokens: [
      { token: 'git bisect start', role: 'Initialization', explanation: 'Enters bisect wizard state.' },
      { token: 'git bisect bad', role: 'Broken Marker', explanation: 'Marks current HEAD as having the bug.' },
      { token: 'git bisect good <v1.0>', role: 'Working Marker', explanation: 'Marks older commit where code worked properly.' },
    ],

    actionStage: {
      before: {
        label: 'Regression Discovered',
        description: 'Login form fails with error today at commit #100. You know it worked fine at release `v1.0` (commit #1). 99 commits to search.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Bug exists, culprit unknown',
        historyCommits: [
          { hash: 'C100', message: 'HEAD (Buggy)' },
          { hash: 'C1', message: 'v1.0.0 (Working)' },
        ],
        whatChanged: ['Bug introduced somewhere between C1 and C100.'],
        whatDidNotChange: ['Culprit commit unknown.'],
      },
      running: {
        label: 'Binary Search Halving',
        description: 'Git checks out commit #50: you test, it\'s good. Git checks out #75: you test, it\'s bad. Git checks out #62...',
        workingDirectory: [{ name: 'login.js', status: 'committed' }],
        stagingArea: [],
        commandPill: 'Bisecting: 6 revisions left to test after this',
        historyCommits: [],
        whatChanged: ['Search space halved with every single step.'],
        whatDidNotChange: ['Git automatically checks out commits.'],
      },
      after: {
        label: 'Culprit Isolated!',
        description: 'Git outputs: `c8e9f01 is the first bad commit` by author Alice on June 12: "refactor: simplify regex". Culprit found in 6 steps!',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'First bad commit found: c8e9f01',
        historyCommits: [
          { hash: 'c8e9f01', message: 'refactor: simplify regex (FIRST BAD COMMIT)' },
        ],
        whatChanged: ['Exact commit and diff identified; fix takes 2 minutes.'],
        whatDidNotChange: ['Run `git bisect reset` to return to HEAD.'],
      },
    },

    variations: [
      {
        flag: 'Manual Bisect',
        title: 'Interactive Binary Search',
        syntax: 'git bisect start && git bisect bad && git bisect good <commit>',
        whatItDoes: 'Enters binary search mode, halving commits iteratively as you manually test and mark each step good or bad.',
        whenToUse: 'Debugging visual UI defects or manual browser regressions across hundreds of commits.',
        example: 'git bisect start HEAD v1.0.0',
        snippet: 'git bisect good/bad',
      },
      {
        flag: 'Automated Bisect',
        title: 'Fully Autonomous Script Runner',
        syntax: 'git bisect run <test-command>',
        whatItDoes: 'Autonomously executes the test command at each binary search step until it isolates the first bad commit with zero manual clicks.',
        whenToUse: 'Automated test suites or unit tests that reproduce a bug via shell exit codes (0=good, 1=bad).',
        example: 'git bisect run npm test',
        snippet: 'git bisect run <cmd>',
      },
      {
        flag: 'Reset',
        title: 'Clean Exit & Return to Branch',
        syntax: 'git bisect reset',
        whatItDoes: 'Terminates the bisect session and returns working directory and HEAD pointer to the original branch.',
        whenToUse: 'Mandatory cleanup step immediately after finding the culprit commit.',
        example: 'git bisect reset',
        snippet: 'git bisect reset',
      },
    ],

    scenarios: [
      {
        id: 'sc-bisect-1',
        title: 'Finding Which of 500 Commits Broke Checkout',
        context: 'Checkout works in release v2.0 (500 commits ago), but throws a 500 error today on main. Reading 500 diffs would take 3 days.',
        question: 'How can you isolate the exact breaking commit in under 10 automated test steps?',
        options: [
          {
            label: 'Use `git bisect run npm test` to perform a binary search across the 500 commits automatically',
            command: 'git bisect start HEAD v2.0 && git bisect run npm test',
            isCorrect: true,
            explanation: 'Binary search tests the midpoint commit each time: log2(500) ≈ 9 test runs. Automated bisect finds the culprit in seconds with zero manual checkout steps.',
          },
          {
            label: 'Checkout every commit one by one starting from v2.0 until it fails',
            command: 'git checkout HEAD~499',
            isCorrect: false,
            explanation: 'Linear search testing 500 commits manually takes hours and is extremely prone to testing fatigue.',
          },
        ],
        whenToUse: 'Debugging regressions in large commit histories.',
        commandExample: 'git bisect run <script>',
        note: 'Finds bugs in log2(N) steps.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'git bisect run <script> (Binary Search)',
        commandB: 'Manual Linear History Checkout',
        aspect: 'Time Complexity & Efficiency',
        descriptionA: 'O(log N) complexity: 1,000 commits requires only ~10 test runs to find the exact offending commit.',
        descriptionB: 'O(N) complexity: Requires up to 1,000 sequential test runs and manual checkouts.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Forgetting to run `git bisect reset` after finding the culprit commit',
        whyItHappens: 'Leaving Git in detached HEAD mode at the old culprit commit.',
        fix: 'Always run `git bisect reset` to return to your original working branch.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"good\" > build.txt",
          "git add build.txt",
          "git commit -m \"v1.0: good build\"",
          "echo \"bad regression\" > build.txt",
          "git commit -am \"v1.1: broken regression\""
  ],
      guidedSteps: [
          {
                  "instruction": "Inspect the commit sequence with regressions",
                  "command": "git log --oneline",
                  "hint": "Type git log --oneline"
          },
          {
                  "instruction": "Start a git bisect debugging session",
                  "command": "git bisect start",
                  "hint": "Type git bisect start"
          },
          {
                  "instruction": "Reset bisect to return to normal state",
                  "command": "git bisect reset",
                  "hint": "Type git bisect reset"
          }
  ],
      initialFiles: [{ name: 'test.sh', content: '#!/bin/sh\n# Test script for bisect\nexit 0\n' }],
      initialCommits: [
        { hash: '1000001', message: 'chore: good baseline' },
        { hash: '1000002', message: 'feat: add feature' },
      ],
      targetTask: 'Check git status and commit log before bisecting.',
      hints: ['Run `git log --oneline`.'],
      validationRegex: /git log/i,
      solutionCommands: ['git log --oneline'],
    },

    challenge: {
      title: 'Inspect History Range for Bisect',
      instructions: 'Review commit log between good and bad endpoints.',
      startingState: 'History available.',
      goalState: 'Commit range verified.',
      hints: ['Run `git log --oneline -5`.'],
    },

    reference: {
      officialDocUrl: 'https://git-scm.com/docs/git-bisect',
      syntaxCheatSheet: [
        'git bisect start : Start bisect session',
        'git bisect bad : Mark current commit as broken',
        'git bisect good <commit> : Mark known working commit',
        'git bisect run <script> : Automate search using exit codes',
        'git bisect reset : Clean up and return to original HEAD',
      ],
      commonErrors: [
        { error: 'Forgot to run git bisect reset after finishing', remedy: 'You remain in detached HEAD mode until you run `git bisect reset`.' },
      ],
      mentalModelDiagram: {
        concept: 'Binary Search Tree',
        explanation: 'Good [1] ---------------- [50] ---------------- Bad [100]\\n                       ^\\n                Git checks out 50. Good? Search [50..100]. Bad? Search [1..50].',
        storageLocation: 'State preserved in `.git/BISECT_LOG` and `.git/BISECT_START`.',
      },
      edgeCases: ['If a commit in the middle cannot be tested due to an unrelated compile error, use `git bisect skip` to test an adjacent commit instead.'],
    },
  },

  'c-git-worktree': {
    id: 'c-git-worktree',
    command: 'git worktree',
    title: 'git worktree',
    topicId: 'topic-16',
    topicNumber: '16',
    topicTitle: 'Advanced Git Topics',
    subtitle: 'Checking out and working on multiple branches simultaneously in separate directories without re-cloning',
    badges: ['Expert', 'Productivity', 'Multitasking'],
    quote: 'Never stash or switch branches again. Worktrees let you work on 3 branches at the exact same time in separate folders.',
    difficulty: 'Expert',

    whatIsIt:
      '`git worktree` allows you to have multiple working directories attached to the same single Git repository. Instead of stashing changes, abandoning what you are doing, and switching branches, you can check out `main`, `feature/cart`, and `hotfix/cve` into three separate filesystem folders simultaneously—all sharing the exact same `.git` object database.',
    inSimpleWords:
      'Instead of clearing off your single desk every time you switch between homework and painting, you get two desks side by side in the same room. Desk 1 has your homework; Desk 2 has your painting.',
    whyDoYouNeedIt:
      'In large codebases, running `git switch` triggers massive dependency reinstalls (`npm install`) and 15-minute rebuilds. With worktrees, each branch has its own folder and build cache. You can run tests on your feature branch in terminal 1 while hotfixing production in terminal 2.',
    realWorldAnalogy:
      'A chef with multiple prep stations in the kitchen. Station 1 is preparing salads; Station 2 is sautéing meat. The chef walks between stations without clearing the cutting boards.',

    syntaxCode: 'git worktree add ../<folder-name> <branch-name>',
    syntaxTokens: [
      { token: 'git worktree add', role: 'Command', explanation: 'Creates a new linked working tree.' },
      { token: '../<folder-name>', role: 'Filesystem Path', explanation: 'Directory path where the new branch will be checked out.' },
      { token: '<branch-name>', role: 'Branch to Checkout', explanation: 'The branch to mount in the new directory.' },
    ],

    actionStage: {
      before: {
        label: 'Single Working Tree Limitation',
        description: 'You are 4 hours into compiling a heavy feature on `feature/ai` in `~/projects/app`. Urgent bug reported on `main`.',
        workingDirectory: [{ name: 'heavy-build-cache/', status: 'committed' }],
        stagingArea: [],
        commandPill: 'Single folder: ~/projects/app',
        historyCommits: [{ hash: 'F1', message: 'feat: heavy AI pipeline' }],
        whatChanged: ['Switching branches would wipe the 4-hour build cache.'],
        whatDidNotChange: ['Cannot work on two branches at once.'],
      },
      running: {
        label: 'Adding Linked Worktree',
        description: 'Running `git worktree add ../app-hotfix main`. Git creates sibling folder `~/projects/app-hotfix` checked out to `main`.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'git worktree add ../app-hotfix main',
        historyCommits: [],
        whatChanged: ['New folder linked to the exact same `.git` database.', 'No re-cloning required; zero extra network download.'],
        whatDidNotChange: ['Primary `~/projects/app` folder remains 100% untouched.'],
      },
      after: {
        label: 'Simultaneous Multi-Branch Productivity',
        description: 'You open a second terminal in `../app-hotfix`, fix the bug, commit, and push. Then remove the worktree with `git worktree remove`.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Hotfix pushed; AI build never interrupted',
        historyCommits: [
          { hash: 'H1', message: 'fix: production patch' },
        ],
        whatChanged: ['Both tasks completed in parallel with 0 stash overhead.'],
        whatDidNotChange: ['Disk space saved compared to full clone.'],
      },
    },

    variations: [
      {
        flag: 'Add Branch',
        title: 'Mount Branch in New Directory',
        syntax: 'git worktree add <path> <branch>',
        whatItDoes: 'Checks out an existing branch into a new linked filesystem folder that shares the existing repository database.',
        whenToUse: 'Working on multiple branches simultaneously without branch switching or stashing.',
        example: 'git worktree add ../hotfix main',
        snippet: 'git worktree add <path> <branch>',
      },
      {
        flag: 'Create New Branch',
        title: 'Create & Checkout Branch in New Folder',
        syntax: 'git worktree add -b <new-branch> <path> <base-branch>',
        whatItDoes: 'Creates a brand new branch and immediately checks it out into a separate linked directory.',
        whenToUse: 'Starting a new feature branch without disturbing ongoing long builds or local servers.',
        example: 'git worktree add -b feat/cart ../cart-dev main',
        snippet: 'git worktree add -b <branch>',
      },
      {
        flag: 'List',
        title: 'List Active Worktrees',
        syntax: 'git worktree list',
        whatItDoes: 'Displays all active linked working tree directory paths and their current checked-out branches.',
        whenToUse: 'Auditing active worktrees and verifying directory mount locations.',
        example: 'git worktree list',
        snippet: 'git worktree list',
      },
      {
        flag: 'Remove',
        title: 'Clean Removal of Linked Worktree',
        syntax: 'git worktree remove <path>',
        whatItDoes: 'Deletes the linked working tree directory and cleans up internal `.git/worktrees` metadata.',
        whenToUse: 'After finishing work and merging the branch.',
        example: 'git worktree remove ../hotfix',
        snippet: 'git worktree remove <path>',
      },
    ],

    scenarios: [
      {
        id: 'sc-worktree-1',
        title: 'Handling an Urgent Production Bug During a 30-Minute Heavy Build',
        context: 'You are 15 minutes into compiling a massive Docker and native build on `feature/ai`. A Sev-1 bug on `main` needs a 2-line fix immediately.',
        question: 'How do you fix and deploy the bug on main without wiping your 15-minute build cache or switching branches?',
        options: [
          {
            label: 'Create a linked worktree for main in a sibling directory (`git worktree add ../hotfix main`), fix the bug there, and leave your feature build running',
            command: 'git worktree add ../hotfix main && cd ../hotfix',
            isCorrect: true,
            explanation: 'Worktrees allow multiple branches to be checked out simultaneously in separate folders using the same local .git repository. Your build is undisturbed.',
          },
          {
            label: 'Run git switch main and lose all compiled artifacts and intermediate files',
            command: 'git switch main',
            isCorrect: false,
            explanation: 'Switching branches wipes untracked build caches and wastes 15 minutes of compute time.',
          },
        ],
        whenToUse: 'Parallel multi-branch development without stash overhead.',
        commandExample: 'git worktree add ../hotfix main',
        note: 'Shares the same .git database.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'git worktree add',
        commandB: 'git clone (Second Repository)',
        aspect: 'Disk Space & Sync Overhead',
        descriptionA: 'Shares the existing `.git` database; 0 extra network download; commits and branches instantly shared between folders.',
        descriptionB: 'Downloads redundant gigabytes of Git history; remotes and branches must be fetched and pushed between folders.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Trying to check out the same branch in two different worktrees at the same time',
        whyItHappens: 'Git deliberately prevents this to avoid index corruption and branch ref desynchronization.',
        fix: 'Switch one worktree to another branch or create a temporary branch for the second folder.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"main code\" > app.js",
          "git add app.js",
          "git commit -m \"feat: main code baseline\"",
          "git branch hotfix-urgent"
  ],
      guidedSteps: [
          {
                  "instruction": "List active worktrees",
                  "command": "git worktree list",
                  "hint": "Type git worktree list"
          },
          {
                  "instruction": "Inspect existing branches",
                  "command": "git branch",
                  "hint": "Type git branch"
          },
          {
                  "instruction": "Verify repository status",
                  "command": "git status",
                  "hint": "Type git status"
          }
  ],
      initialFiles: [{ name: 'worktree-demo.txt', content: 'Worktree root repository\n' }],
      initialCommits: [{ hash: '1212121', message: 'chore: initial worktree demo repo' }],
      targetTask: 'List active worktrees with git worktree list.',
      hints: ['Run `git worktree list`.'],
      validationRegex: /git worktree/i,
      solutionCommands: ['git worktree list'],
    },

    challenge: {
      title: 'Inspect Worktree Topography',
      instructions: 'Display all active worktree mount points in repository.',
      startingState: 'Main worktree active.',
      goalState: 'Worktree list displayed.',
      hints: ['Run `git worktree list`.'],
    },

    reference: {
      officialDocUrl: 'https://git-scm.com/docs/git-worktree',
      syntaxCheatSheet: [
        'git worktree add <path> <branch> : Create linked worktree',
        'git worktree add -b <new> <path> : Create branch and worktree',
        'git worktree list : Show all worktree paths',
        'git worktree remove <path> : Remove linked worktree',
        'git worktree prune : Clean up dead worktree references',
      ],
      commonErrors: [
        { error: 'fatal: \'<branch>\' is already checked out at \'<path>\'', remedy: 'Git forbids checking out the same branch in two different worktrees simultaneously to prevent index corruption. Switch one worktree to a different branch first.' },
      ],
      mentalModelDiagram: {
        concept: 'Shared Object DB Architecture',
        explanation: '~/projects/app (.git/objects) <==== Linked ====> ~/projects/app-hotfix (.git file pointing back to main .git/worktrees).',
        storageLocation: 'Linked worktrees store metadata under `.git/worktrees/<name>/`.',
      },
      edgeCases: ['Each linked worktree has its own private index, HEAD, and stash, but shares the commit/blob database and remote tracking refs.'],
    },
  },

  'c-git-internals-dag': {
    id: 'c-git-internals-dag',
    command: '.git/objects',
    title: 'Git Internals & Object DB',
    topicId: 'topic-16',
    topicNumber: '16',
    topicTitle: 'Advanced Git Topics',
    subtitle: 'Under the hood: content-addressable storage, Blobs, Trees, Commits, and Annotated Tags',
    badges: ['Expert', 'Internals', 'Computer Science'],
    quote: 'Git is not black magic. It is simply a content-addressable key-value store with a VCS user interface on top.',
    difficulty: 'Expert',

    whatIsIt:
      'At its core, Git is a content-addressable storage system. Any piece of content stored in Git is hashed using SHA-1 (or SHA-256) to produce a 40-character hexadecimal key. All repository data is modeled as four primitive object types stored in `.git/objects/`: (1) **Blob** (raw file contents), (2) **Tree** (directory listing mapping names and modes to SHAs), (3) **Commit** (points to a top-level Tree, parent commit SHAs, author, and message), and (4) **Tag** (annotated release reference).',
    inSimpleWords:
      'Git is a giant dictionary where the key is the cryptographic fingerprint of a file, and the value is the compressed file itself. Folders are just lists of keys, and commits are just snapshots pointing to a root folder.',
    whyDoYouNeedIt:
      'Understanding Git internals demystifies every confusing Git error. You realize branches are just 41-byte text files containing a commit SHA, detached HEAD just means HEAD points to a SHA instead of a branch file, and commits are completely immutable.',
    realWorldAnalogy:
      'A digital art gallery. Every painting has a unique barcode calculated from its colors. A room (Tree) is a sign listing 3 barcodes. The exhibition catalog (Commit) says: "Exhibition #2 = Room A, curated by Alice on Tuesday".',

    syntaxCode: 'git cat-file -p <object-sha>  # Pretty-print object contents',
    syntaxTokens: [
      { token: 'git cat-file', role: 'Plumbing Tool', explanation: 'Low-level plumbing command to inspect raw Git objects.' },
      { token: '-t', role: 'Type Flag', explanation: 'Outputs object type: blob, tree, commit, or tag.' },
      { token: '-p', role: 'Pretty-Print Flag', explanation: 'Decompresses zlib and displays raw headers and contents.' },
    ],

    actionStage: {
      before: {
        label: 'High-Level Abstraction',
        description: 'Developer thinks Git stores diffs or delta patches like older VCS systems (SVN).',
        workingDirectory: [{ name: 'hello.txt', status: 'committed' }],
        stagingArea: [],
        commandPill: 'hello.txt: "Hello Git Internals"',
        historyCommits: [{ hash: 'a1b2c3d', message: 'Initial commit' }],
        whatChanged: ['Mental model incomplete.'],
        whatDidNotChange: ['Underlying object database is waiting to be inspected.'],
      },
      running: {
        label: 'Plumbing Inspection with cat-file',
        description: 'Running `git cat-file -p HEAD` reveals: `tree 8f3d...`, `author Dev`, `Initial commit`. Running `git cat-file -p 8f3d` reveals: `100644 blob e69d... hello.txt`.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'git cat-file -p HEAD -> Raw Commit Object',
        historyCommits: [],
        whatChanged: ['Object graph exposed: Commit -> Tree -> Blob.'],
        whatDidNotChange: ['Objects are permanently zlib compressed in `.git/objects/`.'],
      },
      after: {
        label: 'Complete DAG Mental Model',
        description: 'Developer understands the Directed Acyclic Graph (DAG). Any change to any character changes the blob SHA, tree SHA, and commit SHA mathematically.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Cryptographic Immutability Mastered',
        historyCommits: [
          { hash: 'a1b2c3d', message: 'Initial commit (DAG verified)' },
        ],
        whatChanged: ['Deep mastery of Git architecture achieved.'],
        whatDidNotChange: ['Git behaves with mathematical predictability.'],
      },
    },

    variations: [
      {
        flag: '-p',
        title: 'Pretty-Print Raw Object Content',
        syntax: 'git cat-file -p <object-sha>',
        whatItDoes: 'Decompresses zlib and displays raw headers, tree pointers, author timestamps, and content of any Git object.',
        whenToUse: 'Inspecting internal representation of commits, trees, blobs, and tags.',
        example: 'git cat-file -p HEAD',
        snippet: 'git cat-file -p <sha>',
      },
      {
        flag: '-t',
        title: 'Query Primitive Object Type',
        syntax: 'git cat-file -t <object-sha>',
        whatItDoes: 'Returns the primitive type of the Git object: blob, tree, commit, or tag.',
        whenToUse: 'Determining what kind of data an unfamiliar SHA represents.',
        example: 'git cat-file -t HEAD',
        snippet: 'git cat-file -t <sha>',
      },
      {
        flag: 'git ls-tree',
        title: 'Inspect Tree Object Entries',
        syntax: 'git ls-tree <tree-sha-or-commit>',
        whatItDoes: 'Prints the mode, type, SHA, and filename of all items in a directory tree object.',
        whenToUse: 'Inspecting directory hierarchy without checking out files.',
        example: 'git ls-tree HEAD',
        snippet: 'git ls-tree <sha>',
      },
      {
        flag: 'git hash-object',
        title: 'Calculate Object SHA-1 Hash',
        syntax: 'git hash-object -w <file>',
        whatItDoes: 'Computes SHA-1 hash of a file and optionally writes it as a loose blob into `.git/objects/`.',
        whenToUse: 'Understanding how Git hashes files into content-addressable storage.',
        example: 'git hash-object -w test.txt',
        snippet: 'git hash-object -w <file>',
      },
    ],

    scenarios: [
      {
        id: 'sc-internals-1',
        title: 'Understanding What a Git Branch Actually Is',
        context: 'A junior developer believes a Git branch is a heavy duplicate copy of the entire codebase.',
        question: 'Under the hood in Git\'s object database, what is a branch reference actually made of?',
        options: [
          {
            label: 'A simple 41-byte text file in `.git/refs/heads/<branch>` containing only the 40-character commit SHA it points to',
            command: 'cat .git/refs/heads/main',
            isCorrect: true,
            explanation: 'In Git, branches are virtually weightless. Creating a branch creates a 41-byte text file containing a SHA pointer; all commits, trees, and blobs are shared in the content-addressable object store.',
          },
          {
            label: 'A 500MB folder containing a complete duplicate snapshot of every file in the project',
            command: 'No command',
            isCorrect: false,
            explanation: 'Unlike older centralized VCS tools, Git does not copy trees on branch creation.' },
        ],
        whenToUse: 'Understanding Git storage architecture.',
        commandExample: 'git cat-file -p HEAD',
        note: 'Demystifies Git internal data structures.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'Git Blob Object',
        commandB: 'Git Tree Object',
        aspect: 'Data Representation',
        descriptionA: 'Stores pure file contents compressed with zlib; contains NO filename, mode, or directory path.',
        descriptionB: 'Stores directory structure: lists permissions (modes), object types, SHAs, and filenames.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Believing that Git stores file diffs or delta patches between commits',
        whyItHappens: 'Intuition from watching git diff output.',
        fix: 'Git stores complete file snapshots as compressed Blobs; identical files across commits share the exact same Blob SHA.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"Hello Git Internals\" > test.txt",
          "git add test.txt",
          "git commit -m \"feat: explore object database\""
  ],
      guidedSteps: [
          {
                  "instruction": "Inspect the latest commit hash",
                  "command": "git log -n 1 --oneline",
                  "hint": "Type git log -n 1 --oneline"
          },
          {
                  "instruction": "Inspect the object database references",
                  "command": "git status",
                  "hint": "Type git status"
          },
          {
                  "instruction": "Inspect branch reference pointers",
                  "command": "git branch",
                  "hint": "Type git branch"
          }
  ],
      initialFiles: [{ name: 'internals.txt', content: 'Git stores snapshots, not diffs.\n' }],
      initialCommits: [{ hash: '9988771', message: 'chore: add internals exploration file' }],
      targetTask: 'Check git status and commit log.',
      hints: ['Run `git log -1`.'],
      validationRegex: /git log/i,
      solutionCommands: ['git log -1'],
    },

    challenge: {
      title: 'Inspect Raw Commit Object',
      instructions: 'Display the raw commit object data for HEAD using git cat-file.',
      startingState: 'Recent commit on branch.',
      goalState: 'Raw commit headers (tree, author, committer) displayed.',
      hints: ['Run `git cat-file -p HEAD`.'],
    },

    reference: {
      officialDocUrl: 'https://git-scm.com/book/en/v2/Git-Internals-Git-Objects',
      syntaxCheatSheet: [
        'git cat-file -p <sha> : Print object contents',
        'git cat-file -t <sha> : Print object type',
        'git ls-tree <sha> : List tree contents',
        'git hash-object -w <file> : Write blob object directly',
        'git fsck : Verify database integrity',
      ],
      commonErrors: [
        { error: 'Believing Git stores diffs between versions', remedy: 'Git stores full snapshots of files as compressed Blobs; identical files across commits share the exact same Blob SHA.' },
      ],
      mentalModelDiagram: {
        concept: 'The 4 Git Primitive Objects',
        explanation: 'Commit Object (Tree SHA + Parent SHA + Author + Msg) ---> Tree Object (Mode + Filename + Blob SHA) ---> Blob Object (Raw compressed data).',
        storageLocation: 'Files stored in `.git/objects/xx/yyyy...` (zlib compressed).',
      },
      edgeCases: ['Git periodically packs loose individual object files into `.pack` packfiles with delta compression via `git gc` to optimize disk performance.'],
    },
  },
};
