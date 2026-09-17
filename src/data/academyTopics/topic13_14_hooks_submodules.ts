import { UniversalConcept } from '../unifiedAcademyData';

export const TOPIC_13_14_CONCEPTS: Record<string, UniversalConcept> = {
  // ==========================================================================
  // TOPIC 13: Git Hooks
  // ==========================================================================
  'c-client-hooks': {
    id: 'c-client-hooks',
    command: 'pre-commit',
    title: 'Client-Side Hooks',
    topicId: 'topic-13',
    topicNumber: '13',
    topicTitle: 'Git Hooks',
    subtitle: 'Automating linters, type checks, and unit tests locally before commits are created or pushed',
    badges: ['Advanced', 'Automation', 'Code Quality'],
    quote: 'Catch bugs on your laptop in 2 seconds instead of waiting 10 minutes for a failing CI build in the cloud.',
    difficulty: 'Advanced',

    whatIsIt:
      'Git hooks are custom executable scripts that Git runs automatically when specific events occur in your repository lifecycle. Client-side hooks run locally on your machine during actions like committing (`pre-commit`, `prepare-commit-msg`, `commit-msg`, `post-commit`) and pushing (`pre-push`). If a pre-commit script exits with a non-zero status code, Git aborts the commit.',
    inSimpleWords:
      'A personal spell-checker and security guard on your computer that checks your code for mistakes before letting you save a commit.',
    whyDoYouNeedIt:
      'Developers frequently forget to run linters or type checkers, leading to embarrassing broken builds in CI and wasted compute minutes. A pre-commit hook runs tests instantly and blocks the commit if syntax errors or test failures exist.',
    realWorldAnalogy:
      'A modern car door sensor. If your seatbelt is not clicked or a door is ajar, the car beeps and refuses to shift into drive.',

    syntaxCode: 'chmod +x .git/hooks/pre-commit',
    syntaxTokens: [
      { token: '.git/hooks/', role: 'Hooks Directory', explanation: 'Where Git looks for hook executable scripts.' },
      { token: 'pre-commit', role: 'Hook Lifecycle Event', explanation: 'Runs before commit message is even prompted; exit code != 0 aborts commit.' },
      { token: 'chmod +x', role: 'Execution Permission', explanation: 'Required on Unix/Mac so Git can execute the shell script.' },
    ],

    actionStage: {
      before: {
        label: 'Unchecked Commit Attempt',
        description: 'Developer runs `git commit -m "feat: add payment"` with a fatal TypeScript syntax error in `payment.ts`.',
        workingDirectory: [{ name: 'payment.ts', status: 'staged' }],
        stagingArea: [{ name: 'payment.ts', status: 'staged' }],
        commandPill: 'git commit -m "feat: add payment"',
        historyCommits: [{ hash: 'C1', message: 'baseline' }],
        whatChanged: ['Staged file has syntax error.'],
        whatDidNotChange: ['Commit not written yet.'],
      },
      running: {
        label: 'Pre-Commit Hook Intercepts',
        description: 'Git fires `.git/hooks/pre-commit`. Hook runs `npm run lint && npm test`. TypeScript compiler reports error on line 24.',
        workingDirectory: [{ name: 'payment.ts', status: 'staged' }],
        stagingArea: [{ name: 'payment.ts', status: 'staged' }],
        commandPill: 'Hook returned exit code 1 -> Commit Aborted!',
        historyCommits: [{ hash: 'C1', message: 'baseline' }],
        whatChanged: ['Commit aborted; terminal displays exact compilation error.'],
        whatDidNotChange: ['No broken commit enters repository history.'],
      },
      after: {
        label: 'Fixed & Committed Cleanly',
        description: 'Developer fixes line 24, stages the fix, and runs `git commit`. Hook passes green; commit succeeds!',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Hook Passed (exit 0) -> Commit C2 Created',
        historyCommits: [
          { hash: 'C2', message: 'feat: add payment (validated)' },
          { hash: 'C1', message: 'baseline' },
        ],
        whatChanged: ['High-quality commit saved; CI pipeline in cloud will pass green.'],
        whatDidNotChange: ['Developer saved 15 minutes of failed CI debug time.'],
      },
    },

    variations: [
      {
        flag: 'pre-commit',
        title: 'Pre-Commit Hook',
        syntax: '.git/hooks/pre-commit',
        whatItDoes: 'Executes before the commit message prompt opens; aborts the commit if the script exits with non-zero status.',
        whenToUse: 'Fast linters, syntax checks, and staged file formatting.',
        example: '#!/bin/sh\nnpm test',
        snippet: 'pre-commit',
      },
      {
        flag: 'pre-push',
        title: 'Pre-Push Hook',
        syntax: '.git/hooks/pre-push',
        whatItDoes: 'Executes before git push sends commit objects to the remote server; aborts the network push if tests fail.',
        whenToUse: 'Running full unit test suites or integration verification before remote push.',
        example: '#!/bin/sh\nnpm run test:e2e',
        snippet: 'pre-push',
      },
      {
        flag: '--no-verify',
        title: 'Bypass Hooks Flag',
        syntax: 'git commit --no-verify -m "<msg>"',
        whatItDoes: 'Instructs Git to skip the pre-commit and commit-msg hooks entirely.',
        whenToUse: 'Emergency hotfixes or pushing temporary work-in-progress on private branches.',
        example: 'git commit --no-verify -m "emergency: hotfix"',
        snippet: 'git commit --no-verify',
        warning: 'Bypasses all automated local quality, security, and type safety checks.',
      },
    ],

    scenarios: [
      {
        id: 'sc-client-hooks-1',
        title: 'Catching TypeScript Errors Before Pushing to CI',
        context: 'You committed a change locally that had a typo in a type definition. 15 minutes later, CI failed on GitHub and blocked everyone\'s PR.',
        question: 'How can you catch these compilation errors locally in 2 seconds before the commit is created?',
        options: [
          {
            label: 'Set up an executable .git/hooks/pre-commit script that runs tsc --noEmit',
            command: 'echo "npx tsc --noEmit" > .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit',
            isCorrect: true,
            explanation: 'The pre-commit hook runs before git writes the commit. If TypeScript finds an error, the hook exits with code 1 and git aborts the commit immediately on your laptop.',
          },
          {
            label: 'Wait for GitHub Actions to send a failure email and push a "fix typo" commit',
            command: 'git commit -m "fix typo"',
            isCorrect: false,
            explanation: 'Waiting for remote CI wastes team time, pollutes git history with trivial fix commits, and consumes CI billable minutes.',
          },
        ],
        whenToUse: 'Preventing broken commits from entering git.',
        commandExample: 'npx tsc --noEmit in pre-commit',
        note: 'Runs in seconds locally.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'pre-commit hook',
        commandB: 'pre-push hook',
        aspect: 'Execution Frequency & Scope',
        descriptionA: 'Runs on every local commit. Must be extremely fast (<2s) like linting staged files.',
        descriptionB: 'Runs only when pushing to remote. Can execute heavier integration tests and security scans.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Putting slow, 5-minute full test suites into the pre-commit hook',
        whyItHappens: 'Wanting 100% test coverage before every single commit.',
        fix: 'Keep pre-commit under 3 seconds using lint-staged; move heavy test suites to pre-push or CI.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "mkdir -p .git/hooks",
          "echo \"#!/bin/sh\\nexit 0\" > .git/hooks/pre-commit",
          "echo \"code\" > file.js",
          "git add file.js"
  ],
      guidedSteps: [
          {
                  "instruction": "Check staged files prior to hook trigger",
                  "command": "git status",
                  "hint": "Type git status"
          },
          {
                  "instruction": "Execute commit triggering the pre-commit hook",
                  "command": "git commit -m \"feat: test pre-commit validation\"",
                  "hint": "Type git commit -m <msg>"
          }
  ],
      initialFiles: [{ name: 'hook-test.sh', content: '#!/bin/sh\necho "Running pre-commit check..."\nexit 0\n' }],
      initialCommits: [{ hash: '1212121', message: 'chore: setup hooks' }],
      targetTask: 'Check git status to ensure working directory is clean.',
      hints: ['Run `git status`.'],
      validationRegex: /git status/i,
      solutionCommands: ['git status'],
    },

    challenge: {
      title: 'Inspect Hooks Directory',
      instructions: 'Check the default Git hooks sample directory in .git/hooks.',
      startingState: 'Git repository initialized.',
      goalState: 'Working tree status verified.',
      hints: ['Run `git status`.'],
    },

    reference: {
      officialDocUrl: 'https://git-scm.com/docs/githooks',
      syntaxCheatSheet: [
        '.git/hooks/pre-commit : Run linters/tests',
        '.git/hooks/pre-push : Run heavy integration tests',
        'git commit --no-verify : Bypass hooks temporarily',
        'git config core.hooksPath <path> : Customize hooks location',
      ],
      commonErrors: [
        { error: 'Hook does not execute on Mac/Linux', remedy: 'You forgot to make the script executable. Run `chmod +x .git/hooks/<hook-name>`.' },
      ],
      mentalModelDiagram: {
        concept: 'Hook Execution Pipeline',
        explanation: 'git commit -> pre-commit (Lint/Test) -> commit-msg (Validate format) -> post-commit (Notify) -> Done.',
        storageLocation: 'Local shell scripts located in `.git/hooks/`. (Not committed by default).',
      },
      edgeCases: ['The `.git/hooks/` directory is NOT tracked by Git when cloned. Teams must use tooling like Husky to version and distribute hooks.'],
    },
  },

  'c-commit-msg-hook': {
    id: 'c-commit-msg-hook',
    command: 'commit-msg',
    title: 'Commit Message Hooks',
    topicId: 'topic-13',
    topicNumber: '13',
    topicTitle: 'Git Hooks',
    subtitle: 'Enforcing Conventional Commits, issue ticket numbers, and style guides programmatically',
    badges: ['Advanced', 'Validation', 'Standards'],
    quote: 'A commit-msg hook guarantees that every single commit in your repository adheres to company standards before it is written to history.',
    difficulty: 'Advanced',

    whatIsIt:
      'The `commit-msg` hook is invoked right after the commit message has been entered by the author (or provided via `-m`). Git passes the path to the temporary commit message file (`$1`) as an argument. The hook script inspects the message text using regular expressions or tools like `commitlint`. If the message fails validation, the hook exits with non-zero, aborting the commit.',
    inSimpleWords:
      'A teacher reading your essay title. If you forgot to include your Student ID number or used the wrong title format, they hand it back and tell you to fix it before grading.',
    whyDoYouNeedIt:
      'Automated semantic releases and Jira integrations depend on strict formatting (`feat(auth): ...` or `[JIRA-123] ...`). Humans forget and type "wip" or "fix". The `commit-msg` hook rejects non-compliant messages instantly.',
    realWorldAnalogy:
      'A postal sorting machine. If the envelope does not have a valid 5-digit zip code stamped on the front, the optical scanner rejects it into the return bin.',

    syntaxCode: 'npx commitlint --edit $1',
    syntaxTokens: [
      { token: 'commit-msg', role: 'Hook Name', explanation: 'Standard Git hook event for message validation.' },
      { token: '$1', role: 'File Argument', explanation: 'Path to .git/COMMIT_EDITMSG containing the author\'s message.' },
      { token: 'commitlint', role: 'Linter Engine', explanation: 'Popular npm package that validates conventional commit rules.' },
    ],

    actionStage: {
      before: {
        label: 'Vague Commit Message Entered',
        description: 'Developer runs `git commit -m "fixed stuff"`. Repository policy requires Conventional Commits.',
        workingDirectory: [],
        stagingArea: [{ name: 'auth.ts', status: 'staged' }],
        commandPill: 'git commit -m "fixed stuff"',
        historyCommits: [{ hash: 'C1', message: 'baseline' }],
        whatChanged: ['Commit message submitted for validation.'],
        whatDidNotChange: ['Commit object not yet created.'],
      },
      running: {
        label: 'commit-msg Hook Evaluates',
        description: 'Hook reads `.git/COMMIT_EDITMSG`. RegEx checks for `^(feat|fix|docs|chore)(\\(.+\\))?: .+`. Pattern match FAILS.',
        workingDirectory: [],
        stagingArea: [{ name: 'auth.ts', status: 'staged' }],
        commandPill: 'Error: Subject "fixed stuff" must start with feat/fix/chore',
        historyCommits: [{ hash: 'C1', message: 'baseline' }],
        whatChanged: ['Hook prints corrective guidance to stderr and exits with code 1.'],
        whatDidNotChange: ['Commit aborted; staging index remains intact.'],
      },
      after: {
        label: 'Compliant Message Accepted',
        description: 'Developer runs `git commit -m "fix(auth): handle null session token"`. Hook passes with exit code 0.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Commit C2 successfully written',
        historyCommits: [
          { hash: 'C2', message: 'fix(auth): handle null session token' },
          { hash: 'C1', message: 'baseline' },
        ],
        whatChanged: ['Repository history complies with semantic release requirements.'],
        whatDidNotChange: ['Zero manual review corrections needed.'],
      },
    },

    variations: [
      {
        flag: 'commitlint',
        title: 'Commitlint Conventional Validator',
        syntax: 'npx --no-install commitlint --edit "$1"',
        whatItDoes: 'Validates the commit message against Conventional Commits rules defined in commitlint.config.js.',
        whenToUse: 'Enforcing semantic commits across all developers on a project.',
        example: 'npx commitlint --edit "$1"',
        snippet: 'commitlint --edit "$1"',
      },
      {
        flag: 'Regex Bash',
        title: 'Lightweight Shell RegEx',
        syntax: 'grep -qE "^(feat|fix|docs|chore)(\\(.+\\))?: .+" "$1"',
        whatItDoes: 'Validates commit message format using a lightweight bash regular expression without Node.js dependencies.',
        whenToUse: 'C++, Go, Rust, or Python repositories without npm or node installed.',
        example: 'grep -qE "^(feat|fix):" "$1"',
        snippet: 'grep -qE',
      },
      {
        flag: 'Ticket Prefix',
        title: 'Jira / Linear Issue Key Enforcer',
        syntax: 'grep -qE "^\\[[A-Z]+-[0-9]+\\]" "$1"',
        whatItDoes: 'Ensures every commit message begins with a tracked project issue key (e.g. "[PROJ-104] fix auth").',
        whenToUse: 'Enterprise organizations requiring issue traceability across Jira or Linear.',
        example: 'grep -qE "^\\[PROJ-[0-9]+\\]" "$1"',
        snippet: 'regex ticket check',
      },
    ],

    scenarios: [
      {
        id: 'sc-commit-msg-1',
        title: 'Automating Semantic Release and Changelog Generation',
        context: 'Your release tool generates changelogs and bumps semantic versions based on commits starting with feat: or fix:. A developer tries to commit "updated checkout button".',
        question: 'How does the commit-msg hook maintain release automation integrity?',
        options: [
          {
            label: 'The commit-msg hook validates the message format and rejects "updated checkout button" with an error prompting for feat(cart): ...',
            command: 'npx commitlint --edit .git/COMMIT_EDITMSG',
            isCorrect: true,
            explanation: 'The hook intercepts the message file, validates the regex/convention, and exits with code 1, forcing the developer to provide a properly formatted semantic message.',
          },
          {
            label: 'The hook silently edits the code files without telling the developer',
            command: 'No command',
            isCorrect: false,
            explanation: 'commit-msg hooks only validate message text in $1, they do not edit application code.',
          },
        ],
        whenToUse: 'Enforcing commit message standards.',
        commandExample: 'npx commitlint --edit "$1"',
        note: 'Provides instant feedback to author.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'commit-msg hook',
        commandB: 'pre-commit hook',
        aspect: 'Lifecycle Stage & Purpose',
        descriptionA: 'Executes AFTER the author writes the commit message; receives the message file path ($1) to validate message format.',
        descriptionB: 'Executes BEFORE the commit message editor opens; validates code changes, linting, and staged files.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Trying to check code or run tests inside the commit-msg hook instead of pre-commit',
        whyItHappens: 'Confusing the responsibilities of the Git hook lifecycle stages.',
        fix: 'Use pre-commit for code linting/testing; reserve commit-msg strictly for validating message syntax.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"feature\" > feat.js",
          "git add feat.js"
  ],
      guidedSteps: [
          {
                  "instruction": "Check staged files",
                  "command": "git status",
                  "hint": "Type git status"
          },
          {
                  "instruction": "Submit commit message adhering to standard format",
                  "command": "git commit -m \"feat(hooks): validate commit message standards\"",
                  "hint": "Type git commit -m <msg>"
          }
  ],
      initialFiles: [{ name: 'commitlint.config.js', content: 'module.exports = { extends: ["@commitlint/config-conventional"] };\n' }],
      initialCommits: [{ hash: '3434343', message: 'chore: add commitlint configuration' }],
      targetTask: 'Check git log to inspect compliant commit messages.',
      hints: ['Run `git log -1`.'],
      validationRegex: /git log/i,
      solutionCommands: ['git log -1'],
    },

    challenge: {
      title: 'Audit Commit Message Convention',
      instructions: 'Review recent commit message to confirm type and scope prefix format.',
      startingState: 'Recent commit on branch.',
      goalState: 'Commit message printed to console.',
      hints: ['Run `git log -1 --pretty=format:"%s"`.'],
    },

    reference: {
      officialDocUrl: 'https://git-scm.com/docs/githooks#_commit_msg',
      syntaxCheatSheet: [
        '.git/hooks/commit-msg : Hook script path',
        '$1 : Path to temporary file containing commit message',
        'Exit code 0 : Commit succeeds',
        'Exit code 1+ : Commit rejected',
      ],
      commonErrors: [
        { error: 'Commit failed but I don\'t know why', remedy: 'Inspect the terminal error output from the hook script; it will explain which rule (type, case, max length) was violated.' },
      ],
      mentalModelDiagram: {
        concept: 'Message Validation Flow',
        explanation: 'User Input -> .git/COMMIT_EDITMSG -> commit-msg hook script -> Exit 0? -> Write Commit Object. Exit 1? -> Abort.',
        storageLocation: 'Temporary file at `.git/COMMIT_EDITMSG` during commit phase.',
      },
      edgeCases: ['Automated merge commits generated by Git often bypass the commit-msg hook unless `--no-ff` with custom message is used.'],
    },
  },

  'c-husky-lint-staged': {
    id: 'c-husky-lint-staged',
    command: 'husky',
    title: 'Modern Tooling (Husky & lint-staged)',
    topicId: 'topic-13',
    topicNumber: '13',
    topicTitle: 'Git Hooks',
    subtitle: 'Sharing version-controlled hooks across teams and running linters only on staged files for 10x speed',
    badges: ['Intermediate', 'Modern Tooling', 'Efficiency'],
    quote: 'Don\'t lint 10,000 files on every commit. Use lint-staged to format and check only the 2 files you actually touched.',
    difficulty: 'Intermediate',

    whatIsIt:
      'Husky makes Git hooks easy by configuring them in a version-controlled `.husky/` directory tracked in Git and configured via `core.hooksPath`. `lint-staged` pairs with Husky to run linters, Prettier formatters, and tests ONLY on the files that are currently staged in the Git index, rather than scanning the entire million-line codebase.',
    inSimpleWords:
      'Husky shares your git hook rules with everyone on your team automatically. lint-staged makes sure it only checks the 2 files you changed today instead of making you wait 5 minutes for the whole project.',
    whyDoYouNeedIt:
      'Raw `.git/hooks/` files cannot be committed to Git repositories. Without Husky, every developer on a team has to manually copy bash scripts into their private `.git/hooks` folder. Without lint-staged, running `eslint .` on large repositories takes minutes per commit.',
    realWorldAnalogy:
      'An automated toll booth. Instead of doing a complete vehicle safety inspection on every car passing through, it only inspects the vehicle\'s license plate and transponder in 0.2 seconds.',

    syntaxCode: 'npx husky init && npx lint-staged',
    syntaxTokens: [
      { token: 'husky init', role: 'Setup Command', explanation: 'Creates .husky/ directory and sets up npm prepare script.' },
      { token: 'lint-staged', role: 'Targeted Runner', explanation: 'Filters staged files against globs and runs formatters.' },
      { token: 'core.hooksPath', role: 'Git Configuration', explanation: 'Tells Git to look in .husky/ instead of .git/hooks/.' },
    ],

    actionStage: {
      before: {
        label: 'Slow & Unshared Hooks',
        description: 'New team member clones the repo. Their `.git/hooks` is empty, so they push unlinted, broken code to main.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'No shared hooks active',
        historyCommits: [],
        whatChanged: ['New developers have no local protections.'],
        whatDidNotChange: ['Code quality degrades.'],
      },
      running: {
        label: 'Husky & lint-staged Initialized',
        description: '`package.json` configures `"prepare": "husky"`. Developer commits: lint-staged runs Prettier only on `Button.tsx`.',
        workingDirectory: [],
        stagingArea: [{ name: 'Button.tsx', status: 'staged' }],
        commandPill: 'lint-staged: 1 file checked in 180ms',
        historyCommits: [],
        whatChanged: ['Button.tsx auto-formatted and re-staged automatically.'],
        whatDidNotChange: ['9,999 untouched files were skipped, saving minutes.'],
      },
      after: {
        label: 'Effortless Team-wide Quality',
        description: 'Every developer who clones the repo automatically inherits the exact same formatting and linting guardrails.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: '100% Team Compliance',
        historyCommits: [
          { hash: 'H1', message: 'chore: setup husky and lint-staged' },
        ],
        whatChanged: ['Zero formatting debates in PR code reviews.'],
        whatDidNotChange: ['Build and commit cycle times remain instantaneous.'],
      },
    },

    variations: [
      {
        flag: 'husky-init',
        title: 'Initialize Husky in Repository',
        syntax: 'npx husky init',
        whatItDoes: 'Initializes .husky/ directory, sets git core.hooksPath, and configures the npm prepare lifecycle script.',
        whenToUse: 'Initial project setup to share version-controlled hooks across the entire team.',
        example: 'npx husky init',
        snippet: 'npx husky init',
      },
      {
        flag: 'lint-staged-config',
        title: 'Targeted Staged Files Config',
        syntax: '"lint-staged": { "*.{ts,tsx}": ["eslint --fix", "prettier --write"] }',
        whatItDoes: 'Filters only staged files matching the glob and runs linters and formatters in parallel in under 300ms.',
        whenToUse: 'Configuring instantaneous sub-second formatting during pre-commit.',
        example: '"lint-staged": { "*.ts": "eslint --fix" }',
        snippet: 'lint-staged',
      },
      {
        flag: 'manual-run',
        title: 'Manual Lint-Staged Execution',
        syntax: 'npx lint-staged',
        whatItDoes: 'Executes configured lint-staged tasks directly from the command line against current git index files.',
        whenToUse: 'Verifying lint-staged behavior or testing custom glob patterns.',
        example: 'npx lint-staged',
        snippet: 'npx lint-staged',
      },
    ],

    scenarios: [
      {
        id: 'sc-husky-1',
        title: 'Scaling Pre-Commit Checks on a 50,000-File Repository',
        context: 'Running `npm run lint` on the entire repository takes 45 seconds. Developers are getting frustrated and using --no-verify on every commit.',
        question: 'How can you ensure code formatting and linting take under 1 second per commit?',
        options: [
          {
            label: 'Use Husky with lint-staged so linters only examine the 1 or 2 files currently staged in git',
            command: 'echo "npx lint-staged" > .husky/pre-commit',
            isCorrect: true,
            explanation: 'lint-staged filters only the files in the git staging index, running ESLint and Prettier exclusively on modified files in ~200ms.',
          },
          {
            label: 'Completely disable all linting and tell engineers to run formatters manually before submitting PRs',
            command: 'npm uninstall eslint',
            isCorrect: false,
            explanation: 'Manual formatting leads to inconsistent code, git diff noise, and code review arguments.' },
        ],
        whenToUse: 'Fast team-wide git hook enforcement.',
        commandExample: 'npx husky init && npx lint-staged',
        note: 'Runs in milliseconds on staged files.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'Husky (.husky/ directory)',
        commandB: 'Raw Git Hooks (.git/hooks/)',
        aspect: 'Version Control & Team Distribution',
        descriptionA: 'Tracked in Git and automatically installed for all teammates via npm prepare script.',
        descriptionB: 'Local-only to one developer\'s machine; never committed or cloned across the team.',
        safeForSharedHistory: { a: true, b: false },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Forgetting to include the "prepare": "husky" script in package.json',
        whyItHappens: 'New team members clone the repo and run npm install, but Husky is never activated.',
        fix: 'Ensure package.json scripts contains `"prepare": "husky"` so `npm install` installs hooks automatically.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"{\\\"scripts\\\": {\\\"lint\\\": \\\"eslint\\\"}}\" > package.json",
          "git add package.json",
          "git commit -m \"chore: add husky and lint-staged config\""
  ],
      guidedSteps: [
          {
                  "instruction": "Verify package configuration commit",
                  "command": "git log -n 1 --oneline",
                  "hint": "Type git log -n 1 --oneline"
          },
          {
                  "instruction": "Check working tree status",
                  "command": "git status",
                  "hint": "Type git status"
          }
  ],
      initialFiles: [
        { name: 'package.json', content: '{\n  "scripts": {\n    "prepare": "husky"\n  },\n  "lint-staged": {\n    "*.ts": "eslint --fix"\n  }\n}\n' },
        { name: '.husky/pre-commit', content: '#!/bin/sh\nnpx lint-staged\n' },
      ],
      initialCommits: [{ hash: '5566778', message: 'chore: configure husky and lint-staged' }],
      targetTask: 'Check git status to inspect configured files.',
      hints: ['Run `git status`.'],
      validationRegex: /git status/i,
      solutionCommands: ['git status'],
    },

    challenge: {
      title: 'Inspect Husky Configuration',
      instructions: 'Review repository status to verify .husky directory files are tracked.',
      startingState: 'Husky files present.',
      goalState: 'Working tree status confirmed.',
      hints: ['Run `git status`.'],
    },

    reference: {
      officialDocUrl: 'https://typicode.github.io/husky/',
      syntaxCheatSheet: [
        'npx husky init : Setup Husky in repository',
        'echo "npx lint-staged" > .husky/pre-commit : Add pre-commit hook',
        'npx lint-staged : Run staged linter manually',
        'git config core.hooksPath : Verify configured hooks directory',
      ],
      commonErrors: [
        { error: 'husky - Git hooks were not installed', remedy: 'Run `npm run prepare` or ensure your package.json has `"prepare": "husky"`.' },
      ],
      mentalModelDiagram: {
        concept: 'Husky + lint-staged Pipeline',
        explanation: 'git commit -> .husky/pre-commit -> lint-staged -> Inspect Staging Index -> Run Prettier on changed files -> Re-stage -> Commit Saved.',
        storageLocation: 'Version-controlled directory in repository root: `.husky/`.',
      },
      edgeCases: ['In monorepos with multiple package.json files, Husky should be installed at the repository root where `.git` lives.'],
    },
  },

  // ==========================================================================
  // TOPIC 14: Submodules
  // ==========================================================================
  'c-submodule-add': {
    id: 'c-submodule-add',
    command: 'git submodule add',
    title: 'Adding Submodules',
    topicId: 'topic-14',
    topicNumber: '14',
    topicTitle: 'Submodules',
    subtitle: 'Embedding an external Git repository inside your codebase pinned to an exact commit SHA',
    badges: ['Advanced', 'Multi-Repo', 'Architecture'],
    quote: 'A submodule is not a copy of code; it is a pointer to an external repository pinned to a single commit hash.',
    difficulty: 'Advanced',

    whatIsIt:
      'Git submodules allow you to keep a Git repository as a subdirectory of another Git repository. This lets you clone another repository into your project and keep your commits separate. Crucially, the parent repository does not track the submodule\'s files directly; it only tracks the submodule\'s remote URL (in `.gitmodules`) and a 160-bit commit SHA (a gitlink entry in the tree).',
    inSimpleWords:
      'Picture framing a window into someone else\'s house. You can see their room inside your wall, but your house blueprint only records the address of their house and the exact date you took the picture.',
    whyDoYouNeedIt:
      'When multiple corporate projects share a core C++ library, common design token package, or shared hardware driver, copying files causes divergence. Submodules keep the shared code in its own independent repo while allowing parent projects to pin to exact stable releases.',
    realWorldAnalogy:
      'An automobile assembly line. Ford buys car audio systems from Sony. Ford doesn\'t manufacture the radio circuits; they order part #SONY-7782 and bolt the pre-built unit into the dashboard.',

    syntaxCode: 'git submodule add <repository-url> [<path>]',
    syntaxTokens: [
      { token: 'git submodule add', role: 'Command', explanation: 'Registers and clones nested repository.' },
      { token: '<repository-url>', role: 'External Repo URL', explanation: 'Remote Git URL of the library to embed.' },
      { token: '[<path>]', role: 'Local Destination', explanation: 'Directory path inside parent repo (e.g., libs/shared-ui).' },
    ],

    actionStage: {
      before: {
        label: 'Parent Repository Standalone',
        description: 'Parent project needs a shared cryptography library `crypto-core` maintained by security team.',
        workingDirectory: [{ name: 'main.cpp', status: 'committed' }],
        stagingArea: [],
        commandPill: 'Standalone Repo',
        historyCommits: [{ hash: 'P1', message: 'chore: initial parent app' }],
        whatChanged: ['Crypto library not yet linked.'],
        whatDidNotChange: ['Parent repo has no external dependencies.'],
      },
      running: {
        label: 'Adding Submodule',
        description: 'Running `git submodule add https://github.com/org/crypto-core libs/crypto`. Git clones repo and creates `.gitmodules`.',
        workingDirectory: [],
        stagingArea: [
          { name: '.gitmodules', status: 'staged' },
          { name: 'libs/crypto', status: 'staged' },
        ],
        commandPill: 'git submodule add ... libs/crypto',
        historyCommits: [{ hash: 'P1', message: 'chore: initial parent app' }],
        whatChanged: ['.gitmodules configuration created.', 'Special gitlink object (mode 160000) staged at libs/crypto.'],
        whatDidNotChange: ['Individual files inside libs/crypto are NOT added to parent index.'],
      },
      after: {
        label: 'Pinned to Exact Commit',
        description: 'Parent commits the submodule addition. Parent tree now records: `libs/crypto -> commit 8f3d12a`.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Submodule Pinned to 8f3d12a',
        historyCommits: [
          { hash: 'P2', message: 'feat: embed crypto-core submodule at 8f3d12a' },
          { hash: 'P1', message: 'chore: initial parent app' },
        ],
        whatChanged: ['Parent repo successfully references external repo at exact immutable commit.'],
        whatDidNotChange: ['External repo can continue developing without breaking parent app.'],
      },
    },

    variations: [
      {
        flag: 'Custom Path',
        title: 'Add Submodule to Custom Path',
        syntax: 'git submodule add <repository-url> <path>',
        whatItDoes: 'Clones remote repository into specified subdirectory and records gitlink pointer entry (mode 160000) in parent index.',
        whenToUse: 'Embedding an external shared repository into a specific internal folder.',
        example: 'git submodule add https://github.com/org/crypto-core libs/crypto',
        snippet: 'git submodule add <url> <path>',
      },
      {
        flag: 'Branch Tracking',
        title: 'Track Specific Remote Branch',
        syntax: 'git submodule add -b <branch> <repository-url> <path>',
        whatItDoes: 'Configures submodule to track a specific remote release branch in .gitmodules for seamless submodule updates.',
        whenToUse: 'When the embedded repository maintains a stable release branch like v2.x.',
        example: 'git submodule add -b release/v2 https://github.com/org/ui.git vendor/ui',
        snippet: 'git submodule add -b <branch> <url>',
      },
      {
        flag: 'status',
        title: 'Inspect Submodule Status & SHAs',
        syntax: 'git submodule status',
        whatItDoes: 'Prints the currently checked-out commit SHA and status prefix (+ if out of sync, U if merge conflict) for all submodules.',
        whenToUse: 'Auditing which commit SHA each submodule is pinned to.',
        example: 'git submodule status',
        snippet: 'git submodule status',
      },
    ],

    scenarios: [
      {
        id: 'sc-submod-add-1',
        title: 'Embedding a Shared Core Library Across 3 Independent Apps',
        context: 'Your company has 3 separate applications that all need to use the exact same security library `auth-core`. Copy-pasting the code has caused version drift.',
        question: 'How do you link the shared library while guaranteeing each app controls when it upgrades?',
        options: [
          {
            label: 'Add auth-core as a Git submodule; the parent repo will pin to an exact immutable commit SHA',
            command: 'git submodule add https://github.com/company/auth-core.git libs/auth-core',
            isCorrect: true,
            explanation: 'Submodules embed external repositories pinned to an exact commit SHA (gitlink mode 160000). The parent app won\'t break when auth-core publishes new commits.',
          },
          {
            label: 'Create a symlink pointing to your local laptop\'s hard drive folder',
            command: 'ln -s ~/Projects/auth-core ./libs/auth-core',
            isCorrect: false,
            explanation: 'Local symlinks only work on your machine and fail completely when teammates clone or CI builds the repo.',
          },
        ],
        whenToUse: 'Sharing code across multiple distinct repositories.',
        commandExample: 'git submodule add <url> <path>',
        note: 'Creates .gitmodules entry.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'git submodule add',
        commandB: 'npm install (Package Manager)',
        aspect: 'Source Access & Compilation',
        descriptionA: 'Embeds complete raw Git repository with full source code, history, and internal build system.',
        descriptionB: 'Installs pre-compiled, versioned artifact bundle from a registry into node_modules.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Attempting to add a submodule in a path that already exists in Git index',
        whyItHappens: 'The folder was previously committed as regular files.',
        fix: 'Remove the directory from Git index first with `git rm -r --cached <path>` before running `git submodule add`.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"main app\" > app.js",
          "git add app.js",
          "git commit -m \"feat: root app\""
  ],
      guidedSteps: [
          {
                  "instruction": "Inspect working tree before adding submodule",
                  "command": "git status",
                  "hint": "Type git status"
          },
          {
                  "instruction": "Check commit log",
                  "command": "git log --oneline",
                  "hint": "Type git log --oneline"
          }
  ],
      initialFiles: [
        { name: '.gitmodules', content: '[submodule "vendor/shared"]\n\tpath = vendor/shared\n\turl = https://github.com/example/shared.git\n' },
        { name: 'main.go', content: 'package main\nfunc main() {}\n' },
      ],
      initialCommits: [{ hash: '8877665', message: 'chore: add vendor submodule configuration' }],
      targetTask: 'Check .gitmodules file and git status.',
      hints: ['Run `git status`.'],
      validationRegex: /git status/i,
      solutionCommands: ['git status'],
    },

    challenge: {
      title: 'Inspect Submodule Configuration',
      instructions: 'Review .gitmodules file to verify repository URL mapping.',
      startingState: 'Submodule configuration present.',
      goalState: 'Working tree status verified.',
      hints: ['Run `git status`.'],
    },

    reference: {
      officialDocUrl: 'https://git-scm.com/docs/git-submodule#Documentation/git-submodule.txt-add',
      syntaxCheatSheet: [
        'git submodule add <url> <path> : Add submodule to parent repo',
        'git submodule status : Show current submodule commit SHAs',
        '.gitmodules : Tracks submodule URL and destination paths',
        'git diff --submodule : View detailed submodule commit changes',
      ],
      commonErrors: [
        { error: 'fatal: \'<path>\' already exists in the index', remedy: 'If a folder previously existed, remove it from the index with `git rm -r --cached <path>` before adding as submodule.' },
      ],
      mentalModelDiagram: {
        concept: 'Gitlink Mode 160000',
        explanation: 'Parent Commit Tree contains: [100644 blob file.js], [160000 commit 8f3d12a libs/crypto].',
        storageLocation: 'The parent repo only stores the 40-character SHA of the submodule commit.',
      },
      edgeCases: ['Submodules default to a detached HEAD pointing to the pinned commit SHA whenever checked out.'],
    },
  },

  'c-submodule-update': {
    id: 'c-submodule-update',
    command: 'git submodule update',
    title: 'Cloning & Updating Submodules',
    topicId: 'topic-14',
    topicNumber: '14',
    topicTitle: 'Submodules',
    subtitle: 'Initializing empty submodule directories, recursive clones, and advancing pinned commits',
    badges: ['Advanced', 'Submodules', 'Workflow'],
    quote: 'By default, cloning a repo leaves submodules as empty directories. You must run --init --recursive to fill them.',
    difficulty: 'Advanced',

    whatIsIt:
      'When you clone a repository that contains submodules, Git creates the destination directories but leaves them completely empty by default. To populate them, you must initialize and update them: `git submodule update --init --recursive` (or clone with `--recurse-submodules`). To advance a submodule to a newer commit, you cd into the submodule, pull the new commit, and commit the new pointer in the parent repository.',
    inSimpleWords:
      'Downloading a picture frame comes with an empty glass. You have to run a second command to tell Git: "Go fetch the actual photo from the other website and put it inside the frame."',
    whyDoYouNeedIt:
      'New team members frequently clone a project and find that the project fails to compile because all the shared libraries are empty folders. Knowing the `--init --recursive` command gets your environment running immediately.',
    realWorldAnalogy:
      'Buying furniture from IKEA. The box arrives at your apartment (clone), but the table legs are inside a separate parts box that requires you to unwrap and assemble it (`update --init`).',

    syntaxCode: 'git submodule update --init --recursive',
    syntaxTokens: [
      { token: 'git submodule update', role: 'Command', explanation: 'Checks out submodule commit recorded in parent.' },
      { token: '--init', role: 'Initialization Flag', explanation: 'Copies URLs from .gitmodules into local .git/config.' },
      { token: '--recursive', role: 'Nested Flag', explanation: 'Initializes any submodules nested inside other submodules.' },
    ],

    actionStage: {
      before: {
        label: 'Fresh Clone: Empty Folders',
        description: 'Developer ran `git clone <repo>`. Directory `libs/crypto/` exists on disk but is 100% empty.',
        workingDirectory: [{ name: 'libs/crypto (empty)', status: 'untracked' }],
        stagingArea: [],
        commandPill: 'Empty submodule directory',
        historyCommits: [{ hash: 'P2', message: 'chore: project with submodules' }],
        whatChanged: ['Project builds fail due to missing library code.'],
        whatDidNotChange: ['Parent repo has not fetched submodule objects.'],
      },
      running: {
        label: 'Running Recursive Update',
        description: 'Running `git submodule update --init --recursive`. Git registers submodule URLs and clones commit 8f3d12a.',
        workingDirectory: [{ name: 'libs/crypto/crypto.c', status: 'committed' }],
        stagingArea: [],
        commandPill: 'git submodule update --init --recursive',
        historyCommits: [{ hash: 'P2', message: 'chore: project with submodules' }],
        whatChanged: ['Submodule repository cloned into `.git/modules/libs/crypto`.'],
        whatDidNotChange: ['Working tree populated at exact pinned commit.'],
      },
      after: {
        label: 'Ready to Build',
        description: 'Submodule files populated; project compiles cleanly. Submodule stands in detached HEAD at pinned SHA.',
        workingDirectory: [{ name: 'libs/crypto/crypto.c', status: 'committed' }],
        stagingArea: [],
        commandPill: 'Submodules synchronized',
        historyCommits: [
          { hash: 'P2', message: 'chore: project with submodules' },
        ],
        whatChanged: ['All dependencies ready; full codebase operational.'],
        whatDidNotChange: ['Parent repository remains cleanly in sync.'],
      },
    },

    variations: [
      {
        flag: 'recursive-clone',
        title: 'Recursive Clone One-Liner',
        syntax: 'git clone --recurse-submodules <repository-url>',
        whatItDoes: 'Clones the parent repository and automatically clones and checks out all nested submodules in a single step.',
        whenToUse: 'Initial checkout of any repository configured with submodules.',
        example: 'git clone --recurse-submodules https://github.com/org/super-app.git',
        snippet: 'git clone --recurse-submodules',
      },
      {
        flag: 'update-init',
        title: 'Initialize & Checkout Pinned Commits',
        syntax: 'git submodule update --init --recursive',
        whatItDoes: 'Registers submodule URLs in .git/config, clones missing repositories, and checks out the commit SHAs recorded in the parent commit tree.',
        whenToUse: 'Populating empty submodule folders after standard git clone or git pull.',
        example: 'git submodule update --init --recursive',
        snippet: 'git submodule update --init',
      },
      {
        flag: 'update-remote',
        title: 'Advance to Remote Branch Tip',
        syntax: 'git submodule update --remote --merge',
        whatItDoes: 'Fetches the newest commit from the tracking branch defined in .gitmodules and merges it into the local submodule.',
        whenToUse: 'Upgrading the submodule to the latest upstream release.',
        example: 'git submodule update --remote --merge',
        snippet: 'git submodule update --remote',
      },
      {
        flag: 'foreach',
        title: 'Execute Command Across All Submodules',
        syntax: 'git submodule foreach "<command>"',
        whatItDoes: 'Iterates through every active submodule and runs the specified shell command inside each directory.',
        whenToUse: 'Checking status or pulling updates across multiple nested submodules at once.',
        example: 'git submodule foreach "git status"',
        snippet: 'git submodule foreach',
      },
    ],

    scenarios: [
      {
        id: 'sc-submod-update-1',
        title: 'New Teammate Clones Repo with Empty Submodule Folders',
        context: 'A new hire ran `git clone <repo>` and ran the build, but the compiler failed with "module not found: vendor/shared". The vendor/shared folder is empty.',
        question: 'What command populates the missing submodule code at the correct version?',
        options: [
          {
            label: 'Run git submodule update --init --recursive to fetch and checkout the pinned submodule commits',
            command: 'git submodule update --init --recursive',
            isCorrect: true,
            explanation: 'git submodule update --init registers the submodule URLs in .git/config and clones/checks out the exact pinned commit recorded in the parent repository.',
          },
          {
            label: 'Manually copy-paste the files from another teammate\'s laptop over a USB drive',
            command: 'No command',
            isCorrect: false,
            explanation: 'Manual file transfers bypass git versioning and leave the repo in a detached/untracked state.',
          },
        ],
        whenToUse: 'First-time repository setup and pulling updates.',
        commandExample: 'git submodule update --init --recursive',
        note: 'Populates all nested folders.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'git submodule update',
        commandB: 'git submodule update --remote',
        aspect: 'Target Commit Source',
        descriptionA: 'Checks out the exact commit SHA recorded in the PARENT repository commit tree.',
        descriptionB: 'Fetches and advances to the latest commit available on the REMOTE submodule repository branch.',
        safeForSharedHistory: { a: true, b: false },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Pushing a parent commit that references a submodule commit you forgot to push',
        whyItHappens: 'Committing inside the submodule locally, pointing the parent to it, and pushing parent only.',
        fix: 'Always push commits inside the submodule FIRST before pushing the parent repository.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"submodule config\" > .gitmodules",
          "git add .gitmodules",
          "git commit -m \"chore: add gitmodules registry\""
  ],
      guidedSteps: [
          {
                  "instruction": "Review gitmodules tracking commit",
                  "command": "git log -n 1",
                  "hint": "Type git log -n 1"
          },
          {
                  "instruction": "Verify repository status",
                  "command": "git status",
                  "hint": "Type git status"
          }
  ],
      initialFiles: [{ name: 'README.md', content: '# Project Setup\nRun `git submodule update --init --recursive` after cloning.\n' }],
      initialCommits: [{ hash: '7788990', message: 'docs: document submodule clone setup' }],
      targetTask: 'Check git status to confirm clean repository.',
      hints: ['Run `git status`.'],
      validationRegex: /git status/i,
      solutionCommands: ['git status'],
    },

    challenge: {
      title: 'Practice Submodule Status Inspection',
      instructions: 'Check status of submodules using git submodule status.',
      startingState: 'Repository checked out.',
      goalState: 'Working tree status verified.',
      hints: ['Run `git status`.'],
    },

    reference: {
      officialDocUrl: 'https://git-scm.com/docs/git-submodule#Documentation/git-submodule.txt-update',
      syntaxCheatSheet: [
        'git clone --recurse-submodules <url> : Clone and init in 1 step',
        'git submodule update --init --recursive : Populate empty submodules',
        'git submodule update --remote : Pull latest upstream submodule commits',
        'git submodule foreach <command> : Batch command execution',
      ],
      commonErrors: [
        { error: 'Submodule changes show up as "modified content" or "untracked content"', remedy: 'You made uncommitted changes inside the submodule folder. Either commit them inside the submodule or discard them with `git checkout .` inside that directory.' },
      ],
      mentalModelDiagram: {
        concept: 'Two-Step Initialization',
        explanation: '.gitmodules (Blueprint) -> `submodule init` (registers in .git/config) -> `submodule update` (clones objects into .git/modules/ and checks out files).',
        storageLocation: 'Actual Git database for submodule is stored in `.git/modules/<name>/`.',
      },
      edgeCases: ['Never push a parent commit that points to a submodule commit you haven\'t pushed yet, or teammates will get "fatal: reference is not a tree".'],
    },
  },

  'c-submodules-vs-monorepo': {
    id: 'c-submodules-vs-monorepo',
    command: 'architecture',
    title: 'Submodules vs Monorepos',
    topicId: 'topic-14',
    topicNumber: '14',
    topicTitle: 'Submodules',
    subtitle: 'Architectural tradeoffs: multi-repo composition vs unified monorepo tooling (Nx, Turborepo)',
    badges: ['Expert', 'Architecture', 'Tradeoffs'],
    quote: 'Submodules give independent permissions at the cost of high workflow complexity. Monorepos give atomic refactoring at the cost of repo scale.',
    difficulty: 'Expert',

    whatIsIt:
      'Choosing between Git Submodules (multi-repo) and a Monorepo is one of the most consequential architectural decisions in software engineering. Submodules keep codebases in physically separate repositories with independent access permissions and release cadences. A Monorepo holds all apps, libraries, and microservices in a single Git repository managed by modern build tools like Turborepo, Nx, or Bazel.',
    inSimpleWords:
      'Submodules: Living in separate houses and texting each other when you need to borrow a lawnmower. Monorepo: Living in a big apartment building with a shared tool shed in the basement.',
    whyDoYouNeedIt:
      'Teams that prematurely adopt submodules often suffer from complex synchronization, detached HEAD errors, and multi-repo PR friction. Understanding when to use a Monorepo vs Submodules saves years of developer frustration.',
    realWorldAnalogy:
      'A city with 5 independent suburban towns (Submodules) with border checkpoints vs 1 large metropolitan city (Monorepo) with a unified metro transit system.',

    syntaxCode: '# Monorepo (pnpm/turborepo) vs Submodule (.gitmodules)',
    syntaxTokens: [
      { token: 'pnpm-workspace.yaml', role: 'Monorepo Tool', explanation: 'Symlinks internal packages locally without Git overhead.' },
      { token: '.gitmodules', role: 'Submodule Tool', explanation: 'Pins independent Git repos at exact commit SHAs.' },
    ],

    actionStage: {
      before: {
        label: 'Architectural Crossroad',
        description: 'Company is building 3 frontend apps and 4 shared UI packages. Lead architect evaluates repository strategy.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Evaluating Architecture',
        historyCommits: [],
        whatChanged: ['Requirements defined.'],
        whatDidNotChange: ['No tooling locked in.'],
      },
      running: {
        label: 'Comparing Workflow Impact',
        description: 'Submodules: Changing button requires 4 separate PRs across 4 repos. Monorepo: 1 atomic PR updates button and all 3 apps simultaneously.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Tradeoff Analysis',
        historyCommits: [],
        whatChanged: ['Monorepo wins for fast-moving fullstack teams; Submodules win for strict third-party IP isolation.'],
        whatDidNotChange: ['Both approaches remain viable for their respective niches.'],
      },
      after: {
        label: 'Strategy Selected & Documented',
        description: 'Team selects Monorepo with Turborepo for internal code; uses Submodules only for external third-party open-source engines.',
        workingDirectory: [{ name: 'turbo.json', status: 'committed' }],
        stagingArea: [],
        commandPill: 'Architecture Decision Record (ADR)',
        historyCommits: [
          { hash: 'A1', message: 'docs: add ADR-004 Monorepo vs Submodule strategy' },
        ],
        whatChanged: ['Clear architectural guidelines established for all engineers.'],
        whatDidNotChange: ['Developer productivity maximized.'],
      },
    },

    variations: [
      {
        flag: 'Monorepo Workspace',
        title: 'Unified Monorepo Workspace',
        syntax: 'pnpm-workspace.yaml / turbo.json',
        whatItDoes: 'Symlinks internal packages locally within a single Git repository for instantaneous atomic refactoring and unified CI.',
        whenToUse: 'When the same team develops multiple interdependent applications and packages.',
        example: 'packages: ["apps/*", "packages/*"]',
        snippet: 'pnpm-workspace.yaml',
      },
      {
        flag: 'Submodules',
        title: 'Multi-Repo Git Submodules',
        syntax: '.gitmodules with multiple remote URLs',
        whatItDoes: 'Maintains independent Git repositories with isolated permissions, pinned at specific commit hashes.',
        whenToUse: 'When embedding external open-source engines or proprietary code across organizational boundaries.',
        example: '[submodule "engine"] path = engine',
        snippet: '.gitmodules',
      },
      {
        flag: 'Package Registry',
        title: 'Private Artifact Registry',
        syntax: 'npm publish / npm install @company/core-ui@^2.0.0',
        whatItDoes: 'Distributes compiled versioned artifacts through private registries like Artifactory, npm, or GitHub Packages.',
        whenToUse: 'When packages have stable APIs and need loose coupling without source code sharing.',
        example: 'npm install @company/core-ui',
        snippet: 'package.json dependency',
      },
    ],

    scenarios: [
      {
        id: 'sc-submod-vs-mono-1',
        title: 'Renaming a Core Database Method Across 4 Microservices',
        context: 'Your team needs to change the signature of `getUserById()` used across 4 internal services. With submodules/multi-repos, this requires 5 PRs, coordination, and temporary breaking states.',
        question: 'What architectural repository strategy makes this refactoring atomic in a single PR?',
        options: [
          {
            label: 'A Monorepo (Turborepo/Nx) where packages live in one Git repository, allowing a single PR to update the method and all 4 callers simultaneously',
            command: 'git checkout -b refactor-db && git commit -m "refactor: rename getUserById across all services"',
            isCorrect: true,
            explanation: 'In a monorepo, cross-package changes are atomic: CI runs against the complete workspace, and a single commit updates the interface and all consumers with 0 drift.',
          },
          {
            label: 'Create 4 separate submodules and coordinate merging the PRs in a shared Google Sheet',
            command: 'No command',
            isCorrect: false,
            explanation: 'Coordinating multi-repo PRs is slow, error-prone, and breaks CI when PRs merge out of order.',
          },
        ],
        whenToUse: 'Evaluating repository architecture.',
        commandExample: 'Monorepo for internal apps, submodules for third-party isolation.',
        note: 'Aligns repo topology with team structure.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'Monorepo (Single Unified Git Repo)',
        commandB: 'Git Submodules (Multi-Repo Composition)',
        aspect: 'Atomic Refactoring & Coordination',
        descriptionA: '1 commit can atomically refactor APIs across libraries and consuming apps simultaneously with unified CI.',
        descriptionB: 'Requires coordinating separate commits and PRs across multiple independent repositories.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Using submodules for closely coupled internal packages that change every sprint',
        whyItHappens: 'Believing separate repositories inherently create better software modularity.',
        fix: 'Use a monorepo workspace (pnpm, Turborepo, Nx) for internal packages that evolve together.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "mkdir packages",
          "echo \"pkg A\" > packages/a.js",
          "echo \"pkg B\" > packages/b.js",
          "git add packages/",
          "git commit -m \"feat(monorepo): structure monorepo packages\""
  ],
      guidedSteps: [
          {
                  "instruction": "Inspect monorepo layout commit",
                  "command": "git log -n 1 --oneline",
                  "hint": "Type git log -n 1 --oneline"
          },
          {
                  "instruction": "Check working tree cleanliness",
                  "command": "git status",
                  "hint": "Type git status"
          }
  ],
      initialFiles: [{ name: 'ADR-architecture.md', content: '# ADR: Monorepo vs Submodules\nSelected: Monorepo for internal apps, Submodules for external C++ core.\n' }],
      initialCommits: [{ hash: '9988112', message: 'docs: record architecture decision record' }],
      targetTask: 'Check git status and commit history.',
      hints: ['Run `git status`.'],
      validationRegex: /git status/i,
      solutionCommands: ['git status'],
    },

    challenge: {
      title: 'Review Architecture Documentation',
      instructions: 'Inspect the commit log to verify architectural decisions.',
      startingState: 'ADR documented.',
      goalState: 'Commit log verified.',
      hints: ['Run `git log -1`.'],
    },

    reference: {
      officialDocUrl: 'https://monorepo.tools/',
      syntaxCheatSheet: [
        'Monorepo: Atomic commits, 1 PR, fast refactoring, shared CI',
        'Submodules: Granular permissions, separate repos, independent release cycles',
        'pnpm / npm workspaces : Native package linking without Git gitlinks',
      ],
      commonErrors: [
        { error: 'Using submodules when developers need to edit both repos every day', remedy: 'If developers edit the parent and submodule in the same sprint, migrate to a monorepo workspace to eliminate multi-PR synchronization hell.' },
      ],
      mentalModelDiagram: {
        concept: 'Architecture Spectrum',
        explanation: 'Multi-Repo (Decoupled, high sync friction) <---- Git Submodules ----> Monorepo (Coupled, atomic commits, fast iteration).',
        storageLocation: 'Repository topology and workspace package configuration.',
      },
      edgeCases: ['Very large monorepos (Google, Meta) require specialized VCS tools like Sapling or custom virtual file systems to handle git scale.'],
    },
  },
};
