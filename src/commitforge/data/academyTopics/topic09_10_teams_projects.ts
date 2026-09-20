import { UniversalConcept } from '../unifiedAcademyData';

export const TOPIC_09_10_CONCEPTS: Record<string, UniversalConcept> = {
  // ==========================================================================
  // TOPIC 09: Working in a Team
  // ==========================================================================
  'c-trunk-based': {
    id: 'c-trunk-based',
    command: 'trunk-based',
    title: 'Trunk-Based Development',
    topicId: 'topic-09',
    topicNumber: '09',
    topicTitle: 'Working in a Team',
    subtitle: 'Short-lived feature branches, daily merges to main, and continuous integration',
    badges: ['Intermediate', 'Workflow', 'DevOps'],
    quote: 'Merge to trunk every day. If it hurts, do it more often until the friction disappears.',
    difficulty: 'Intermediate',

    whatIsIt:
      'Trunk-Based Development (TBD) is a branching model where all developers merge small, frequent updates to a single core branch (the "trunk" or `main`), typically multiple times per day. Feature branches live for less than 1–2 days. Feature toggles (flags) are used to decouple code deployment from feature release.',
    inSimpleWords:
      'Instead of working alone in a cave for 3 weeks and suffering a nightmare merge conflict at the end, you merge small 2-hour chunks into the main branch every single afternoon.',
    whyDoYouNeedIt:
      'Long-lived branches cause "merge hell", where merging back to main requires days of resolving conflicting code. Trunk-Based Development eliminates merge hell, enables true continuous delivery, and provides immediate feedback on breaking changes.',
    realWorldAnalogy:
      'Constructing a skyscraper. Workers bolt steel beams into the central tower every hour, rather than building three separate miniature towers in different parking lots and trying to weld them together at the end of the year.',

    syntaxCode: 'git switch -c feat/small-task main && git commit -m "feat: small slice" && gh pr create',
    syntaxTokens: [
      { token: 'feat/small-task', role: 'Short-Lived Branch', explanation: 'Branch designed to live 4 to 24 hours max.' },
      { token: 'gh pr create', role: 'Fast PR', explanation: 'Small PR containing < 200 lines of code for immediate review.' },
    ],

    actionStage: {
      before: {
        label: 'Continuous Flow',
        description: 'Main is always deployable to production. Developer pulls latest main in the morning.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'main (always green)',
        historyCommits: [
          { hash: 'T10', message: 'feat: fast checkout' },
          { hash: 'T9', message: 'fix: billing edge case' },
        ],
        whatChanged: ['Main moves forward several times daily.'],
        whatDidNotChange: ['Zero lingering 2-week branches.'],
      },
      running: {
        label: 'Merging Small Slice',
        description: 'Developer branches at 10 AM, writes 80 lines + unit tests, opens PR at 1 PM, approved and merged by 2 PM.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'PR #12 merged into main',
        historyCommits: [
          { hash: 'T11', message: 'feat(cart): add promo input behind feature flag' },
          { hash: 'T10', message: 'feat: fast checkout' },
        ],
        whatChanged: ['Small delta merged cleanly without conflicts.'],
        whatDidNotChange: ['Feature flag keeps unfinished UI invisible to end users.'],
      },
      after: {
        label: 'Production Deployed',
        description: 'Automated CI/CD deploys commit T11 to staging and production automatically.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Shipped via CI/CD',
        historyCommits: [
          { hash: 'T11', message: 'feat(cart): add promo input behind feature flag' },
        ],
        whatChanged: ['Code is live in production safely gated behind flag.'],
        whatDidNotChange: ['Teammates never fall more than a few hours out of sync.'],
      },
    },

    variations: [
      {
        flag: 'Short PRs',
        title: 'Short-Lived Feature Branch (<24h)',
        syntax: 'git switch -c feat/short-lived-task && gh pr create',
        whatItDoes: 'Creates a branch designed to live under 24 hours, scoped to under 200 lines, reviewed and merged within hours.',
        whenToUse: 'Standard mode for fast-paced web and SaaS teams.',
        example: 'git switch -c feat/cart-summary && gh pr create --fill',
        snippet: 'git switch -c feat/<task>',
      },
      {
        flag: 'Feature Flags',
        title: 'Feature Flag Decoupling',
        syntax: 'if (featureFlags.isEnabled("NEW_CHECKOUT")) { ... }',
        whatItDoes: 'Allows incomplete features to be safely merged to trunk without exposing them to production users.',
        whenToUse: 'Multi-day epics where daily merges are mandatory to avoid drift.',
        example: 'if (FLAGS.NEW_CHECKOUT) renderV2();',
        snippet: 'if (FLAGS.ENABLED) { ... }',
      },
      {
        flag: 'Daily Rebase',
        title: 'Frequent Daily Rebase against Trunk',
        syntax: 'git fetch origin && git rebase origin/main',
        whatItDoes: 'Ensures branch is always aligned with commits teammates pushed minutes ago.',
        whenToUse: 'Morning and midday sync routines.',
        example: 'git fetch origin && git rebase origin/main',
        snippet: 'git rebase origin/main',
      },
    ],

    scenarios: [
      {
        id: 'sc-tbd-1',
        title: 'Managing a 3-Week Epic under Trunk-Based Development',
        context: 'You are building a complex new search engine that will take 3 weeks of work. Your team practices Trunk-Based Development.',
        question: 'How should you manage your branching and merging?',
        options: [
          {
            label: 'Break the work into small daily PRs merged behind a disabled feature flag, keeping trunk deployable',
            command: 'git switch -c feat/search-indexer-part-1',
            isCorrect: true,
            explanation: 'Feature flags decouple deployment from release, avoiding massive merge conflicts and keeping code flowing continuously.',
          },
          {
            label: 'Keep a private branch open on your laptop for 3 weeks without merging anything',
            command: 'No command',
            isCorrect: false,
            explanation: 'A 3-week branch guarantees massive merge conflicts, architectural drift, and high risk of production outage on merge day.',
          },
        ],
        whenToUse: 'Modern web companies shipping to production multiple times per day.',
        commandExample: 'git switch -c fix/date-parse && git commit -am "fix: parse iso dates" && gh pr create --fill',
        note: 'Fast cycle time keeps lead time to production under 2 hours.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'Trunk-Based Development',
        commandB: 'GitFlow Workflow',
        aspect: 'Branch Lifespan & Release Cycle',
        descriptionA: 'Branches live 1-2 days max; continuous integration into main multiple times daily; releases decoupled via feature flags.',
        descriptionB: 'Branches live weeks/months; uses develop, release, and hotfix branches; batch releases on scheduled release windows.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Merging unreviewed or untested code directly to main because "it is trunk-based"',
        whyItHappens: 'Confusing fast integration with lack of automated testing or code review.',
        fix: 'Always require automated CI test gates and at least one peer approval before merging to main.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"console.log(\\\"trunk v1\\\");\" > app.js",
          "git add app.js",
          "git commit -m \"feat: initial trunk baseline\"",
          "git switch -c short-lived-task",
          "echo \"// quick patch\" >> app.js",
          "git commit -am \"fix: small 1-day patch\"",
          "git switch main"
  ],
      guidedSteps: [
          {
                  "instruction": "Check active branch",
                  "command": "git branch",
                  "hint": "Type git branch"
          },
          {
                  "instruction": "Fast integrate the short-lived branch into trunk",
                  "command": "git merge short-lived-task",
                  "hint": "Type git merge short-lived-task"
          },
          {
                  "instruction": "Delete the merged temporary branch",
                  "command": "git branch -d short-lived-task",
                  "hint": "Type git branch -d short-lived-task"
          }
  ],
      initialFiles: [{ name: 'flags.ts', content: 'export const FLAGS = { NEW_NAV: false };\n' }],
      initialCommits: [{ hash: 'b1b1b1b', message: 'chore: setup feature flags' }],
      targetTask: 'Check git status to verify clean working branch.',
      hints: ['Run `git status`.'],
      validationRegex: /git status/i,
      solutionCommands: ['git status'],
    },

    challenge: {
      title: 'Inspect Branch Lifespan',
      instructions: 'Check recent commit timestamps to verify frequent integration cadence.',
      startingState: 'Recent commits on branch.',
      goalState: 'Commit log displayed with timestamps.',
      hints: ['Run `git log --pretty=format:"%h - %an, %ar : %s"`.'],
    },

    reference: {
      officialDocUrl: 'https://trunkbaseddevelopment.com/',
      syntaxCheatSheet: [
        'git switch main && git pull --ff-only : Sync with trunk daily',
        'git switch -c feat/short-name : Create short-lived branch',
        'gh pr create --fill : Open compact PR',
      ],
      commonErrors: [
        { error: 'Keeping a branch open for 3 weeks', remedy: 'Break down the task into smaller PRs and use feature flags so uncompleted features can safely live in main.' },
      ],
      mentalModelDiagram: {
        concept: 'Trunk Flow',
        explanation: 'Trunk (main) ----------*-------*-------*-----> (Continuous Production)\\n                       / \\     / \\     / \\\\n                      b1  *   b2  *   b3  * (branches live < 1 day)',
        storageLocation: 'Single active branch tracked in Git with automated CI pipelines.',
      },
      edgeCases: ['Requires comprehensive automated test suites; without fast, reliable CI, trunk-based development can cause production outages.'],
    },
  },

  'c-gitflow': {
    id: 'c-gitflow',
    command: 'gitflow',
    title: 'GitFlow Workflow',
    topicId: 'topic-09',
    topicNumber: '09',
    topicTitle: 'Working in a Team',
    subtitle: 'Structured multi-branch model with develop, release, feature, and hotfix branches',
    badges: ['Intermediate', 'Workflow', 'Enterprise'],
    quote: 'GitFlow provides rigorous branch isolation for products with scheduled release cycles and multiple version maintenance.',
    difficulty: 'Intermediate',

    whatIsIt:
      'GitFlow is a strict branching model designed around the project release. It defines specific roles for different branches: `main` (stores official release history), `develop` (serves as an integration branch for features), `feature/*` (for new features), `release/*` (for release prep and QA polishing), and `hotfix/*` (for critical production patches).',
    inSimpleWords:
      'A formal system of separate train tracks: one track for building brand new engines, one track for testing and painting, one track for the public schedule, and an emergency express track for repairs.',
    whyDoYouNeedIt:
      'If your company ships versioned software (e.g., iOS App Store apps, desktop software, medical device firmware) that requires formal QA testing periods, GitFlow ensures ongoing development never disrupts release stabilization.',
    realWorldAnalogy:
      'A car manufacturing plant. The assembly line (`develop`) builds new prototypes; when a model year is ready, it moves to the QA & detailing bay (`release`); the showroom floor (`main`) only displays finalized production vehicles.',

    syntaxCode: 'git flow init  # or manual branch conventions',
    syntaxTokens: [
      { token: 'main', role: 'Production Branch', explanation: 'Always represents tagged production releases (e.g., v1.0, v2.0).' },
      { token: 'develop', role: 'Integration Branch', explanation: 'Receives completed feature branches; acts as next release staging.' },
      { token: 'hotfix/*', role: 'Emergency Branch', explanation: 'Branches off main to fix urgent production bugs, merges into both main and develop.' },
    ],

    actionStage: {
      before: {
        label: 'Dual Mainlines Active',
        description: 'Repository maintains `main` (current production v1.0.0) and `develop` (sprint work for v1.1.0).',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'main (v1.0.0) | develop (v1.1.0-alpha)',
        historyCommits: [
          { hash: 'D3', message: 'feat: develop active sprint work (develop)' },
          { hash: 'M1', message: 'release: v1.0.0 (HEAD -> main)' },
        ],
        whatChanged: ['Two long-lived central branches established.'],
        whatDidNotChange: ['Production isolated from active work.'],
      },
      running: {
        label: 'Release Branch Hardening',
        description: 'Branch `release/v1.1.0` cut from `develop`. QA tests and commits bugfixes directly to release branch.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'release/v1.1.0 QA testing',
        historyCommits: [
          { hash: 'R1', message: 'fix(qa): resolve layout shift on iPad' },
          { hash: 'D3', message: 'feat: develop active sprint work' },
        ],
        whatChanged: ['Feature freeze in place; only bugfixes allowed.'],
        whatDidNotChange: ['Developers can keep adding new features to develop without delaying v1.1.0.'],
      },
      after: {
        label: 'Release Completed',
        description: 'Release branch merged into `main` (tagged v1.1.0) AND back into `develop`. Release branch deleted.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Tagged v1.1.0 on main',
        historyCommits: [
          { hash: 'M2', message: 'Merge release/v1.1.0 into main (tag: v1.1.0)' },
          { hash: 'D4', message: 'Merge release/v1.1.0 into develop' },
        ],
        whatChanged: ['Both main and develop incorporate all release bugfixes.'],
        whatDidNotChange: ['History structure is permanently preserved via explicit merge commits.'],
      },
    },

    variations: [
      {
        flag: 'feature/*',
        title: 'Feature Branches (Off develop)',
        syntax: 'git switch -c feature/<name> develop',
        whatItDoes: 'Creates isolated branch off develop for new sprint functionality; merges back into develop when done.',
        whenToUse: 'Starting standard sprint feature development in GitFlow.',
        example: 'git switch -c feature/search develop',
        snippet: 'git switch -c feature/<name> develop',
      },
      {
        flag: 'release/*',
        title: 'Release Hardening Branches',
        syntax: 'git switch -c release/<version> develop',
        whatItDoes: 'Cuts a branch from develop for QA testing and bug fixing prior to official production launch.',
        whenToUse: 'Preparing versioned software releases for app stores or client deployments.',
        example: 'git switch -c release/v2.1.0 develop',
        snippet: 'git switch -c release/<version> develop',
      },
      {
        flag: 'hotfix/*',
        title: 'Emergency Production Hotfix',
        syntax: 'git switch -c hotfix/<version> main',
        whatItDoes: 'Branches directly off production main to patch urgent live bugs, merging back to both main and develop.',
        whenToUse: 'Critical production outages or zero-day security vulnerabilities.',
        example: 'git switch -c hotfix/v2.0.1 main',
        snippet: 'git switch -c hotfix/<version> main',
      },
    ],

    scenarios: [
      {
        id: 'sc-gitflow-1',
        title: 'Applying an Urgent Production Hotfix in GitFlow',
        context: 'A critical payment bug is discovered on production (main). Active sprint work for next month is underway on develop.',
        question: 'Where do you branch the hotfix from and where must it be merged?',
        options: [
          {
            label: 'Branch directly off main, apply fix, tag release, and merge into BOTH main and develop',
            command: 'git switch -c hotfix/payment-fix main && git merge --no-ff hotfix/payment-fix',
            isCorrect: true,
            explanation: 'Hotfixes branch from production to fix live code immediately, and must also be merged back into develop so the bug doesn\'t re-appear next release.',
          },
          {
            label: 'Branch off develop and wait 4 weeks for the next scheduled release',
            command: 'No command',
            isCorrect: false,
            explanation: 'Waiting weeks leaves production broken and damages customer trust.',
          },
        ],
        whenToUse: 'Apps requiring 1-week Apple App Store review and QA regression testing.',
        commandExample: 'git switch -c release/2.4.0 develop',
        note: 'Allows team to start sprint 2.5 on develop while 2.4 is undergoing QA.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'develop Branch (GitFlow)',
        commandB: 'main Branch (GitFlow)',
        aspect: 'Environment Role',
        descriptionA: 'The integration branch containing finished features waiting for the next release batch; not directly in production.',
        descriptionB: 'Reflects the exact, pristine code running in live production; each commit on main is tagged with a release version.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Merging a hotfix into main but forgetting to merge it back into develop',
        whyItHappens: 'Assuming merging to production is enough.',
        fix: 'Always back-merge hotfixes into develop immediately so subsequent releases do not re-introduce the bug.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"production code v1.0\" > prod.txt",
          "git add prod.txt",
          "git commit -m \"chore: initial production release\"",
          "git branch develop",
          "git switch develop",
          "git branch feature/cart"
  ],
      guidedSteps: [
          {
                  "instruction": "Inspect GitFlow branch hierarchy",
                  "command": "git branch",
                  "hint": "Type git branch"
          },
          {
                  "instruction": "Switch to feature branch off develop",
                  "command": "git switch feature/cart",
                  "hint": "Type git switch feature/cart"
          },
          {
                  "instruction": "Verify status on feature branch",
                  "command": "git status",
                  "hint": "Type git status"
          }
  ],
      initialFiles: [{ name: 'VERSION', content: '1.0.0\n' }],
      initialCommits: [
        { hash: 'a1a1a1a', message: 'chore: initial release v1.0.0' },
        { hash: 'b2b2b2b', message: 'feat: add develop sprint work' },
      ],
      targetTask: 'Check branch listings with git branch.',
      hints: ['Run `git branch`.'],
      validationRegex: /git branch/i,
      solutionCommands: ['git branch'],
    },

    challenge: {
      title: 'Inspect Branch Structure',
      instructions: 'Examine existing branches to identify mainline integration branches.',
      startingState: 'Repository with branches.',
      goalState: 'Branch listing displayed.',
      hints: ['Run `git branch -a`.'],
    },

    reference: {
      officialDocUrl: 'https://nvie.com/posts/a-successful-git-branching-model/',
      syntaxCheatSheet: [
        'git switch -c feature/<name> develop : Start new feature',
        'git switch -c release/<version> develop : Start release freeze',
        'git switch -c hotfix/<version> main : Start production emergency patch',
      ],
      commonErrors: [
        { error: 'Forgetting to merge hotfix back into develop', remedy: 'Always merge hotfixes into both `main` and `develop`, otherwise your next release will re-introduce the bug!' },
      ],
      mentalModelDiagram: {
        concept: 'GitFlow Branch Topology',
        explanation: 'main      -----------------o---------------o (releases)\\n          \\               /               /\\nhotfix     \\-------------*               /\\ndevelop   --o---o---o-------o---o---o---o (integration)',
        storageLocation: 'Standard Git branches named with conventions: main, develop, feature/*, release/*, hotfix/*. ',
      },
      edgeCases: ['GitFlow is often considered too heavy and slow for modern web applications where continuous deployment is preferred.'],
    },
  },

  'c-team-conflict-prevention': {
    id: 'c-team-conflict-prevention',
    command: 'team sync',
    title: 'Conflict Prevention in Teams',
    topicId: 'topic-09',
    topicNumber: '09',
    topicTitle: 'Working in a Team',
    subtitle: 'Architectural modularity, frequent upstream rebases, and small pull requests',
    badges: ['Intermediate', 'Best Practice', 'Collaboration'],
    quote: 'The easiest merge conflict to resolve is the one that never happened in the first place.',
    difficulty: 'Intermediate',

    whatIsIt:
      'Conflict prevention is a collection of architectural and process disciplines designed to minimize the likelihood and severity of Git merge conflicts. Key techniques include: keeping PRs small (< 300 lines), rebasing feature branches against `origin/main` daily, establishing clean file and modular package boundaries, and communicating before large refactorings.',
    inSimpleWords:
      'Instead of two chefs trying to stir the exact same small pot of soup at the same time, one chef works on the soup, one chef prepares the salad, and they talk to each other before rearranging the pantry.',
    whyDoYouNeedIt:
      'Complex merge conflicts cost engineering teams thousands of hours and frequently introduce subtle regression bugs when developers mistakenly discard teammate changes during manual conflict resolution.',
    realWorldAnalogy:
      'Air traffic control. Planes fly at assigned altitudes and standardized flight paths so they never come close to colliding in mid-air.',

    syntaxCode: 'git fetch origin && git rebase origin/main',
    syntaxTokens: [
      { token: 'git fetch origin', role: 'Update', explanation: 'Downloads teammates\' latest pushed work.' },
      { token: 'git rebase origin/main', role: 'Frequent Sync', explanation: 'Resolves small conflicts daily rather than one monster conflict after 3 weeks.' },
    ],

    actionStage: {
      before: {
        label: 'Monolithic Overlap Risk',
        description: 'Two developers assign themselves tickets that modify the same 4,000-line monolithic `app.ts` file.',
        workingDirectory: [{ name: 'app.ts', status: 'modified' }],
        stagingArea: [],
        commandPill: 'High Collision Risk',
        historyCommits: [],
        whatChanged: ['Both working on overlapping lines without communication.'],
        whatDidNotChange: ['No sync routine established.'],
      },
      running: {
        label: 'Modular Decomposition',
        description: 'Team refactors `app.ts` into `auth.ts`, `cart.ts`, and `notifications.ts`. Developers own distinct files.',
        workingDirectory: [
          { name: 'auth.ts', status: 'modified' },
        ],
        stagingArea: [],
        commandPill: 'Modular boundaries established',
        historyCommits: [],
        whatChanged: ['Each developer modifies independent files.'],
        whatDidNotChange: ['Application functionality remains intact.'],
      },
      after: {
        label: 'Zero-Conflict Integration',
        description: 'Both developers rebase daily against main. PRs merge cleanly with 100% fast-forward / automatic merge.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Merged with 0 conflicts',
        historyCommits: [
          { hash: 'P2', message: 'feat: cart checkout updates' },
          { hash: 'P1', message: 'feat: auth session updates' },
        ],
        whatChanged: ['Zero merge conflicts encountered; cycle time accelerated.'],
        whatDidNotChange: ['Code quality and test coverage preserved.'],
      },
    },

    variations: [
      {
        flag: 'Daily Rebase',
        title: 'Daily Main Rebase Routine',
        syntax: 'git fetch origin && git rebase origin/main',
        whatItDoes: 'Syncs your branch with all updates teammates merged earlier in the day, resolving tiny deltas incrementally.',
        whenToUse: 'Morning standup and midday development routines.',
        example: 'git fetch origin && git rebase origin/main',
        snippet: 'git fetch origin && git rebase origin/main',
      },
      {
        flag: 'Small PRs',
        title: 'Bite-Sized PR Scope (<200 lines)',
        syntax: 'git diff --stat origin/main...HEAD',
        whatItDoes: 'Checks the line delta of your branch to keep PRs small, reviewable, and mergeable in hours.',
        whenToUse: 'Before opening any pull request.',
        example: 'git diff --stat origin/main...HEAD',
        snippet: 'git diff --stat origin/main...HEAD',
      },
      {
        flag: 'CODEOWNERS',
        title: 'File Ownership Boundaries',
        syntax: 'src/modules/billing/ @billing-team',
        whatItDoes: 'Directs PR reviews to the correct domain experts and signals file ownership boundaries across the team.',
        whenToUse: 'Large mono-repos or multi-team codebases.',
        example: '.github/CODEOWNERS',
        snippet: 'src/billing/ @team',
      },
    ],

    scenarios: [
      {
        id: 'sc-prevention-1',
        title: 'Two Developers Assigned to the Same Monolith File',
        context: 'Both you and a teammate need to add methods to a 2,000-line services.ts file during the same sprint.',
        question: 'What architectural approach best prevents merge conflicts?',
        options: [
          {
            label: 'Deconstruct services.ts into smaller modular service files before adding the new methods',
            command: 'mkdir -p src/services && touch src/services/auth.ts src/services/user.ts',
            isCorrect: true,
            explanation: 'Modular architecture eliminates the root cause of conflicts by giving each developer their own isolated file to work in.',
          },
          {
            label: 'Agree that whoever finishes last has to manually resolve all the conflicts',
            command: 'No command',
            isCorrect: false,
            explanation: 'Manual conflict resolution under deadline pressure causes bugs and delays releases.',
          },
        ],
        whenToUse: 'Before renaming database columns or core types.',
        commandExample: 'Announce in Slack #engineering -> merge during low-traffic hours -> notify team to rebase immediately.',
        note: 'Prevents teammates from continuing work on deprecated interfaces.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'Early Continuous Integration (Daily Rebase)',
        commandB: 'Big Bang Integration (End of Sprint)',
        aspect: 'Conflict Difficulty',
        descriptionA: 'Resolves tiny 2-line conflicts incrementally when the code is fresh in your memory.',
        descriptionB: 'Confronts massive 500-line multi-file conflicts weeks after code was written when nobody remembers original intent.',
        safeForSharedHistory: { a: true, b: false },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Holding a feature branch open for 3 weeks without running git fetch or rebasing against main',
        whyItHappens: 'Focusing exclusively on local code without checking teammates\' progress.',
        fix: 'Rebase against `origin/main` at least once every morning to keep your diff minimal.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"shared utility v1\" > utils.js",
          "git add utils.js",
          "git commit -m \"feat: add shared utils\"",
          "git remote add origin https://github.com/team/core.git"
  ],
      guidedSteps: [
          {
                  "instruction": "Fetch latest team changes before starting work",
                  "command": "git fetch origin",
                  "hint": "Type git fetch origin"
          },
          {
                  "instruction": "Check repository status",
                  "command": "git status",
                  "hint": "Type git status"
          },
          {
                  "instruction": "Inspect commit log",
                  "command": "git log --oneline -n 1",
                  "hint": "Type git log --oneline -n 1"
          }
  ],
      initialFiles: [
        { name: 'auth.ts', content: 'export const login = () => {};\n' },
        { name: 'billing.ts', content: 'export const charge = () => {};\n' },
      ],
      initialCommits: [{ hash: '9988112', message: 'refactor: decouple auth and billing modules' }],
      targetTask: 'Check git status and modified paths.',
      hints: ['Run `git status`.'],
      validationRegex: /git status/i,
      solutionCommands: ['git status'],
    },

    challenge: {
      title: 'Review File Modularization',
      instructions: 'Inspect file structure to ensure modules are cleanly separated.',
      startingState: 'Decoupled module files.',
      goalState: 'Working tree status verified.',
      hints: ['Run `git status`.'],
    },

    reference: {
      officialDocUrl: 'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners',
      syntaxCheatSheet: [
        'git fetch origin && git rebase origin/main : Daily sync routine',
        'git diff --stat origin/main...HEAD : Check size of your branch diff',
        'CODEOWNERS file in .github/ : Automate domain review assignments',
      ],
      commonErrors: [
        { error: 'Running large auto-formatters (Prettier) inside a feature PR', remedy: 'Run codebase-wide formatting in a dedicated, isolated PR with 0 logic changes so you don\'t create conflicts for everyone on the team.' },
      ],
      mentalModelDiagram: {
        concept: 'Proactive vs Reactive Integration',
        explanation: 'Reactive: Work for 3 weeks -> 50 conflicts. Proactive: Modular files + Daily rebase + Small PRs -> 0 conflicts.',
        storageLocation: 'Development process standards and .github/CODEOWNERS file.',
      },
      edgeCases: ['Auto-generated files (GraphQL schemas, protobuf code, CSS bundles) should usually be generated in CI or separated to avoid lock conflicts.'],
    },
  },

  // ==========================================================================
  // TOPIC 10: GitHub Projects
  // ==========================================================================
  'c-gh-issues': {
    id: 'c-gh-issues',
    command: 'github issues',
    title: 'Issue Tracking',
    topicId: 'topic-10',
    topicNumber: '10',
    topicTitle: 'GitHub Projects',
    subtitle: 'Bug reporting, feature requests, markdown templates, and automated PR linking',
    badges: ['Beginner', 'Project Management', 'Collaboration'],
    quote: 'If it is not tracked in an issue, it doesn\'t exist. Document requirements before writing code.',
    difficulty: 'Beginner',

    whatIsIt:
      'GitHub Issues are integrated tracking items to record bugs, tasks, enhancements, and questions directly within your repository. Issues support Markdown, task lists, labels, assignees, milestones, and issue forms. Closing keywords in PR descriptions (`Closes #42`, `Fixes #101`) automatically link and resolve issues upon merge.',
    inSimpleWords:
      'A digital sticky-note board for your project where anyone can report a broken button or request a new feature, and developers can discuss how to build it.',
    whyDoYouNeedIt:
      'Without issue tracking, bugs get lost in Slack threads or forgotten emails. Having issues directly in the repository keeps bug reports, technical discussions, and the commits that fix them tightly linked in one place.',
    realWorldAnalogy:
      'A hospital patient chart. The symptoms are recorded at intake (Issue description), doctors write diagnostic notes (comments), medication is administered (PR commits), and the patient is discharged (Issue closed).',

    syntaxCode: 'gh issue create --title "<title>" --body "<body>" --label "bug"',
    syntaxTokens: [
      { token: 'gh issue create', role: 'CLI Action', explanation: 'Creates a new GitHub issue from the command line.' },
      { token: '--title', role: 'Title Flag', explanation: 'Summary of the bug or task.' },
      { token: '--label', role: 'Tag Flag', explanation: 'Categorization tag (e.g., bug, enhancement, documentation).' },
    ],

    actionStage: {
      before: {
        label: 'Bug Discovered',
        description: 'User reports that clicking "Checkout" with an expired coupon triggers a 500 error.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Untracked Bug',
        historyCommits: [],
        whatChanged: ['Bug identified by user.'],
        whatDidNotChange: ['No engineering record created yet.'],
      },
      running: {
        label: 'Issue Created with Reproduction Steps',
        description: 'Issue #104 opened: "Bug: 500 error on expired coupon". Assigned to @frontend-team with label `bug`.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Issue #104 Opened',
        historyCommits: [],
        whatChanged: ['GitHub creates discussion thread and notification events.'],
        whatDidNotChange: ['Code remains unchanged.'],
      },
      after: {
        label: 'PR Linked and Auto-Closed',
        description: 'PR #105 contains `Fixes #104` in description. When PR #105 merges into main, Issue #104 automatically closes!',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Issue #104 Auto-Closed',
        historyCommits: [
          { hash: 'F105', message: 'fix(cart): handle expired coupons gracefully (Fixes #104)' },
        ],
        whatChanged: ['Issue automatically moved to Done with reference to resolving commit.'],
        whatDidNotChange: ['Full audit trail preserved forever.'],
      },
    },

    variations: [
      {
        flag: 'CLI Issue',
        title: 'Create Issue via GitHub CLI',
        syntax: 'gh issue create --title "<title>" --body "<body>" --label "bug"',
        whatItDoes: 'Opens a structured bug report or task card directly from your terminal session.',
        whenToUse: 'Logging defects or feature requests quickly without opening a web browser.',
        example: 'gh issue create --title "fix: 500 error on checkout" --label "bug"',
        snippet: 'gh issue create --title "<title>"',
      },
      {
        flag: 'Auto-Close',
        title: 'Auto-Closing Linking Keywords',
        syntax: 'Closes #42 / Fixes #101 / Resolves #88',
        whatItDoes: 'Automatically transitions and closes the linked issue when the PR merges into the default branch.',
        whenToUse: 'In PR descriptions or commit messages.',
        example: 'git commit -m "fix(auth): handle expired token. Closes #42"',
        snippet: 'Closes #<id>',
      },
      {
        flag: 'My Issues',
        title: 'List My Assigned Issues via CLI',
        syntax: 'gh issue list --assignee "@me" --state open',
        whatItDoes: 'Filters repository issues to display only tasks currently assigned to your account.',
        whenToUse: 'Selecting your next sprint task during morning planning.',
        example: 'gh issue list --assignee "@me"',
        snippet: 'gh issue list --assignee "@me"',
      },
    ],

    scenarios: [
      {
        id: 'sc-issue-1',
        title: 'Automatically Closing an Issue When Your PR Merges',
        context: 'You fixed bug #104. You want GitHub to automatically close issue #104 as soon as the PR is merged into main.',
        question: 'How do you configure your PR description to do this automatically?',
        options: [
          {
            label: 'Include the magic keyword "Closes #104" or "Fixes #104" in the PR body',
            command: 'gh pr create --body "Fixes #104 with proper null checks"',
            isCorrect: true,
            explanation: 'GitHub parses keywords like Closes, Fixes, Resolves and links the lifecycle of the issue to the PR merge event.',
          },
          {
            label: 'Manually email the repository admin asking them to delete the issue',
            command: 'No command',
            isCorrect: false,
            explanation: 'GitHub provides native issue closing keywords to automate task transitions.'
          },
        ],
        whenToUse: 'When a customer reports an unexpected crash.',
        commandExample: 'gh issue create --title "crash: Safari 16 payment button" --label "bug,high-priority"',
        note: 'Assign to sprint milestone for prioritization.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'GitHub Issues',
        commandB: 'Git Commit Messages',
        aspect: 'Purpose & Audience',
        descriptionA: 'Discussion hub for bugs, feature proposals, and task assignments; accessible to product managers and designers.',
        descriptionB: 'Technical ledger of exact code differences; permanent cryptographic record for developers.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Opening an issue with only "it doesn\'t work" and no steps to reproduce',
        whyItHappens: 'Assuming developers have telepathic knowledge of the user\'s setup.',
        fix: 'Always provide steps to reproduce, expected vs actual behavior, and environment details (OS, browser, version).',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"buggy calculation\" > calc.js",
          "git add calc.js",
          "git commit -m \"fix(#42): resolve invoice rounding calculation error\""
  ],
      guidedSteps: [
          {
                  "instruction": "Inspect the commit referencing issue #42",
                  "command": "git log -n 1",
                  "hint": "Type git log -n 1"
          },
          {
                  "instruction": "Check working tree status",
                  "command": "git status",
                  "hint": "Type git status"
          }
  ],
      initialFiles: [{ name: 'issue-notes.md', content: '# Issue #42\nFix header alignment on mobile viewports.\n' }],
      initialCommits: [{ hash: 'a5b4c3d', message: 'docs: add issue tracking notes' }],
      targetTask: 'Check git log to see recent commit messages referencing issues.',
      hints: ['Run `git log --oneline`.'],
      validationRegex: /git log/i,
      solutionCommands: ['git log --oneline'],
    },

    challenge: {
      title: 'Practice Commit Message Issue Linking',
      instructions: 'Review how commit messages reference issue numbers using #<id> syntax.',
      startingState: 'Repository checked out.',
      goalState: 'Commit message verified.',
      hints: ['Run `git log -1`.'],
    },

    reference: {
      officialDocUrl: 'https://docs.github.com/en/issues/tracking-your-work-with-issues/about-issues',
      syntaxCheatSheet: [
        'gh issue list : List open issues in current repository',
        'gh issue view <number> : Display issue details and discussion',
        'gh issue create : Interactive prompt to create issue',
        'Keywords: Closes #ID, Fixes #ID, Resolves #ID',
      ],
      commonErrors: [
        { error: 'Issue did not close when PR merged', remedy: 'The keyword must be in the PR description body (e.g. "Closes #12"), not just in an arbitrary comment on the PR.' },
      ],
      mentalModelDiagram: {
        concept: 'Issue Lifecycle',
        explanation: 'Opened (Backlog) -> Assigned (In Progress) -> Linked in PR ("Fixes #10") -> PR Merged -> Auto-Closed (Done).',
        storageLocation: 'GitHub repository issues database with Markdown commentary.',
      },
      edgeCases: ['Cross-repository issue linking is supported using `Fixes owner/repo#123` syntax.'],
    },
  },

  'c-gh-project-boards': {
    id: 'c-gh-project-boards',
    command: 'projects v2',
    title: 'GitHub Projects & Boards',
    topicId: 'topic-10',
    topicNumber: '10',
    topicTitle: 'GitHub Projects',
    subtitle: 'Spreadsheet tables, Kanban boards, roadmaps, and automated workflow triggers',
    badges: ['Beginner', 'Agile', 'Planning'],
    quote: 'GitHub Projects v2 transforms your issues and PRs into an interactive, real-time spreadsheet and Kanban board.',
    difficulty: 'Beginner',

    whatIsIt:
      'GitHub Projects (v2) is an adaptable, flexible tool for planning and tracking work on GitHub. It pulls in issues and pull requests from across multiple repositories into customizable views: Kanban boards, spreadsheets/tables, and Gantt-style Roadmap timelines, complete with custom fields (Estimate, Priority, Sprint, Target Date) and built-in automation.',
    inSimpleWords:
      'A Trello or Jira board built right into GitHub, where moving a card from "In Progress" to "Done" happens automatically when your Pull Request merges.',
    whyDoYouNeedIt:
      'Engineering teams need high-level visibility across dozens of tasks. Without GitHub Projects, teams resort to expensive third-party tools that get out of sync with code. GitHub Projects updates in real-time as developers push commits and open PRs.',
    realWorldAnalogy:
      'A flight control radar screen at an airport. Rather than tracking each airplane by radioing pilots individually, the controller sees every flight, its altitude, fuel level, and arrival gate on one interactive map.',

    syntaxCode: 'gh project list --owner "<org-or-user>"',
    syntaxTokens: [
      { token: 'gh project', role: 'CLI Tool', explanation: 'GitHub CLI extension for managing Projects v2.' },
      { token: 'Board View', role: 'Kanban Layout', explanation: 'Visual columns: Todo -> In Progress -> In Review -> Done.' },
      { token: 'Table View', role: 'Spreadsheet Layout', explanation: 'Dense grid showing estimates, assignees, and custom metadata.' },
    ],

    actionStage: {
      before: {
        label: 'Scattered Tasks',
        description: '25 issues exist across frontend, backend, and infra repos with no unified roadmap.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Unorganized Backlog',
        historyCommits: [],
        whatChanged: ['Tasks are dispersed across different repositories.'],
        whatDidNotChange: ['No single source of sprint truth.'],
      },
      running: {
        label: 'Kanban Board Setup',
        description: 'Created "Sprint 42 Board". Added custom fields: Priority (P0/P1/P2) and Story Points.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Project Board Active',
        historyCommits: [],
        whatChanged: ['Cards organized into columns: Todo, In Progress, Review, Done.'],
        whatDidNotChange: ['Issues remain in their respective source repositories.'],
      },
      after: {
        label: 'Automated Status Progression',
        description: 'Developer branches and opens PR: card moves to "In Review". PR merges: card auto-moves to "Done".',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Auto-moved to Done',
        historyCommits: [],
        whatChanged: ['Zero manual status updates required by engineers.'],
        whatDidNotChange: ['Project managers have real-time visibility.'],
      },
    },

    variations: [
      {
        flag: 'List Projects',
        title: 'List Team Projects via CLI',
        syntax: 'gh project list --owner <org>',
        whatItDoes: 'Displays active project boards, numbers, and views across your organization.',
        whenToUse: 'Locating sprint board IDs and status configurations.',
        example: 'gh project list --owner acme-corp',
        snippet: 'gh project list --owner <org>',
      },
      {
        flag: 'Create Card',
        title: 'Add Item to Project Board',
        syntax: 'gh project item-create <project-number> --owner <org> --title "Task"',
        whatItDoes: 'Creates a card on the Kanban board without needing a full GitHub Issue.',
        whenToUse: 'Quick scratchpad tasks or sprint brainstorming.',
        example: 'gh project item-create 1 --owner acme --title "Update SSL certs"',
        snippet: 'gh project item-create <id>',
      },
      {
        flag: 'Automation',
        title: 'Built-in Board Automation',
        syntax: 'Automated workflows: Item closed -> Set status to Done',
        whatItDoes: 'Automatically shifts issue cards across Kanban columns as PRs merge.',
        whenToUse: 'Zero-touch sprint tracking without manual card dragging.',
        example: 'Projects -> Workflows -> Auto-close',
        snippet: 'Auto-move cards to Done',
      },
    ],

    scenarios: [
      {
        id: 'sc-project-1',
        title: 'Sprint Progress Tracking for Engineering Teams',
        context: 'Your engineering team wants a real-time Kanban view showing Todo, In Progress, Review, and Done columns across 3 repos.',
        question: 'What GitHub tool provides visual visibility across multiple repositories in an organization?',
        options: [
          {
            label: 'GitHub Projects (v2 Tables and Kanban boards with custom fields and automated status syncing)',
            command: 'gh project view 1 --owner org --web',
            isCorrect: true,
            explanation: 'GitHub Projects v2 supports multi-repo aggregation, custom metadata fields (estimates, sprints), and automated status moves.',
          },
          {
            label: 'Create 50 separate branches in Git with names like todo/task-1',
            command: 'No command',
            isCorrect: false,
            explanation: 'Branches are for code isolation, not for project management visualization.'
          },
        ],
        whenToUse: 'Every two weeks to assign team workload.',
        commandExample: 'Filter project board by `Iteration: @current` and balance story points across developers.',
        note: 'Drag cards into priority order.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'GitHub Projects (Kanban / Tables)',
        commandB: 'Classic Milestones',
        aspect: 'Visualization & Customization',
        descriptionA: 'Customizable multi-repo boards with swimlanes, custom fields (size, priority), and automated column routing.',
        descriptionB: 'Simple date-based container that groups issues by completion percentage toward a single release target.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Letting cards sit in "In Progress" for months without updating status',
        whyItHappens: 'Treating the project board as a chore rather than a real-time reflection of work.',
        fix: 'Use automated workflows so cards move automatically when PRs are opened and merged.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"milestone 1 roadmap\" > roadmap.md",
          "git add roadmap.md",
          "git commit -m \"docs: define sprint 1 roadmap\""
  ],
      guidedSteps: [
          {
                  "instruction": "Review sprint roadmap commit",
                  "command": "git log --oneline",
                  "hint": "Type git log --oneline"
          },
          {
                  "instruction": "Check status",
                  "command": "git status",
                  "hint": "Type git status"
          }
  ],
      initialFiles: [{ name: 'sprint.json', content: '{\n  "sprint": 12,\n  "status": "active"\n}\n' }],
      initialCommits: [{ hash: '1122334', message: 'chore: setup sprint configuration' }],
      targetTask: 'Check git status to confirm working tree readiness.',
      hints: ['Run `git status`.'],
      validationRegex: /git status/i,
      solutionCommands: ['git status'],
    },

    challenge: {
      title: 'Inspect Sprint Configuration',
      instructions: 'Verify repository status and sprint documentation.',
      startingState: 'Clean repo.',
      goalState: 'Status confirmed.',
      hints: ['Run `git status`.'],
    },

    reference: {
      officialDocUrl: 'https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects',
      syntaxCheatSheet: [
        'gh project list : List organization projects',
        'gh project item-list <project-number> : List cards on board',
        'Automation: Auto-add issues matching label to project',
        'Automation: Set status to In Progress when PR opens',
      ],
      commonErrors: [
        { error: 'Issues from other repos not appearing', remedy: 'Ensure the GitHub Project was created at the Organization level, not inside an individual repository.' },
      ],
      mentalModelDiagram: {
        concept: 'Projects v2 Data Plane',
        explanation: 'Repo A (Issues) + Repo B (PRs) + Repo C (Tasks) ---> Aggregated into Unified GitHub Project (Kanban / Roadmap / Table).',
        storageLocation: 'GitHub Organization level GraphQL metadata schema.',
      },
      edgeCases: ['GitHub Projects supports GraphQL API queries for building custom company dashboards and burndown charts.'],
    },
  },

  'c-gh-milestones': {
    id: 'c-gh-milestones',
    command: 'milestones',
    title: 'Milestones & Epics',
    topicId: 'topic-10',
    topicNumber: '10',
    topicTitle: 'GitHub Projects',
    subtitle: 'Grouping issues and PRs into targeted release deadlines with progress percentages',
    badges: ['Intermediate', 'Release Management', 'Planning'],
    quote: 'A goal without a deadline is just a wish. Milestones turn backlogs into scheduled releases.',
    difficulty: 'Intermediate',

    whatIsIt:
      'A GitHub Milestone is a container for issues and pull requests associated with a specific target release version or deadline date (e.g., "Version 2.0.0" or "Q3 Launch"). Milestones provide a visual progress bar indicating the percentage of closed vs open issues, allowing teams to track release readiness at a glance.',
    inSimpleWords:
      'A target release date with a progress bar that fills up with green as your team completes each issue needed for that release.',
    whyDoYouNeedIt:
      'When managing 100 open issues, it is hard to know which 10 issues must be completed before shipping next Friday\'s release. Milestones filter your team\'s attention onto the critical path and answer: "Are we on track to launch on time?"',
    realWorldAnalogy:
      'A marathon milestone marker. When running 26 miles, seeing the Mile 10, Mile 20, and Finish Line markers tells the runner exactly how much distance remains.',

    syntaxCode: 'gh issue list --milestone "v2.0.0"',
    syntaxTokens: [
      { token: 'gh issue list', role: 'Filter Command', explanation: 'Lists issues in current repository.' },
      { token: '--milestone "v2.0.0"', role: 'Scope Filter', explanation: 'Restricts display only to issues tagged with the v2.0.0 target release.' },
    ],

    actionStage: {
      before: {
        label: 'Unscoped Backlog',
        description: 'Repository has 80 open issues. Team lead cannot tell which ones block the upcoming v2.0 launch.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: '80 issues mixed together',
        historyCommits: [],
        whatChanged: ['No target release boundary.'],
        whatDidNotChange: ['Release date approaching with unknown scope.'],
      },
      running: {
        label: 'Milestone Created & Assigned',
        description: 'Created Milestone "v2.0.0 - Public Beta" with due date Sept 30. Assigned 12 critical issues.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Milestone: 0% Complete (0/12 closed)',
        historyCommits: [],
        whatChanged: ['Scope locked down; progress bar displayed on GitHub.'],
        whatDidNotChange: ['Non-essential issues left in general backlog.'],
      },
      after: {
        label: '100% Closed -> Ready to Ship',
        description: 'All 12 issues closed. Milestone bar reaches 100% green. Release manager tags git release.',
        workingDirectory: [],
        stagingArea: [],
        commandPill: 'Milestone: 100% Complete (12/12 closed)',
        historyCommits: [
          { hash: 'M12', message: 'release: ship v2.0.0 public beta' },
        ],
        whatChanged: ['Release readiness verified; zero open blocking bugs.'],
        whatDidNotChange: ['Milestone can now be closed and archived.'],
      },
    },

    variations: [
      {
        flag: 'Due Date',
        title: 'Release Due Date & Progress Bar',
        syntax: 'gh api repos/{owner}/{repo}/milestones -f title="v2.0" -f due_on="2026-10-31T23:59:59Z"',
        whatItDoes: 'Associates a calendar deadline with the milestone and calculates real-time completion percentage based on closed vs open issues.',
        whenToUse: 'When setting sprint or quarterly release ship targets.',
        example: 'Milestone "v2.0" with due date Oct 31',
        snippet: 'gh issue list --milestone "v2.0"',
      },
      {
        flag: 'Filter Scope',
        title: 'Filter PRs & Issues by Target Release',
        syntax: 'gh issue list --milestone "v2.0.0" --state open',
        whatItDoes: 'Filters all issues and pull requests to only show blockers remaining before the release can ship.',
        whenToUse: 'Sprint triage meetings and release-day deployment readiness checks.',
        example: 'gh issue list --milestone "v2.0.0" --state open',
        snippet: 'gh pr list --milestone "v2.0.0"',
      },
      {
        flag: 'Archive / Close',
        title: 'Close & Archive Completed Milestone',
        syntax: 'gh api repos/{owner}/{repo}/milestones/{number} -X PATCH -f state="closed"',
        whatItDoes: 'Marks the milestone as finished and preserves its historical burn-down stats without deleting past associations.',
        whenToUse: 'Immediately following the production deployment of the target version.',
        example: 'gh api repos/{owner}/{repo}/milestones/1 -X PATCH -f state="closed"',
        snippet: 'Milestone state: closed',
      },
    ],

    scenarios: [
      {
        id: 'sc-milestone-1',
        title: 'Scoping a Scheduled Versioned Release',
        context: 'Your team is preparing to ship Version 3.0.0 in 6 weeks. There are 150 total issues in the backlog, but only 14 are required for the 3.0 release.',
        question: 'How do you track release readiness and prevent non-critical bugs from delaying the deadline?',
        options: [
          {
            label: 'Create a "v3.0.0" Milestone with the target due date, assign the 14 blocking issues to it, and move scope-creeping issues out to "v3.1.0" if time runs short',
            command: 'gh issue edit 42 --milestone "v3.0.0"',
            isCorrect: true,
            explanation: 'Milestones provide an unambiguous progress bar and clear boundary of what is in-scope vs out-of-scope for a specific release date.',
          },
          {
            label: 'Tag every commit message with the word "URGENT_RELEASE" in Git history',
            command: 'git commit -m "URGENT_RELEASE: fix button"',
            isCorrect: false,
            explanation: 'Commit messages cannot track unfinished work or calculate progress bars across a team.',
          },
        ],
        whenToUse: 'When scoping a scheduled release with a hard deadline.',
        commandExample: 'gh issue list --milestone "v3.0.0" --state open',
        note: 'If count is 0, release manager has green light to deploy.',
      },
    ],

    commandComparisons: [
      {
        commandA: 'GitHub Milestone',
        commandB: 'Git Tag (v2.0.0)',
        aspect: 'Planning Container vs Immutable Snapshot',
        descriptionA: 'A dynamic planning container that tracks forward-looking progress (open vs closed issues/PRs) leading up to a release.',
        descriptionB: 'An immutable static pointer in Git commit history marking the exact commit SHA that was deployed.',
        safeForSharedHistory: { a: true, b: true },
      },
    ],

    commonMistakes: [
      {
        mistake: 'Letting scope creep push a milestone deadline back repeatedly without moving non-essential issues out',
        whyItHappens: 'Treating a milestone as a wishlist rather than a timeboxed commitment.',
        fix: 'Enforce strict scope triage: if a feature is not ready by the deadline, move its issue to the next milestone and ship on time.',
      },
    ],

    sandbox: {
      initialCommands: [
          "git init",
          "echo \"Release v2.0 Scope\" > milestone.txt",
          "git add milestone.txt",
          "git commit -m \"chore(release): close milestone v2.0 targets\""
  ],
      guidedSteps: [
          {
                  "instruction": "Inspect commit history for milestone",
                  "command": "git log -n 1 --oneline",
                  "hint": "Type git log -n 1 --oneline"
          },
          {
                  "instruction": "Verify repository status",
                  "command": "git status",
                  "hint": "Type git status"
          }
  ],
      initialFiles: [{ name: 'roadmap.md', content: '# Release Milestone: v2.0.0\nTarget Date: Q4\n' }],
      initialCommits: [{ hash: '4455667', message: 'docs: document release milestone targets' }],
      targetTask: 'Check git log to inspect recent documentation commits.',
      hints: ['Run `git log -1`.'],
      validationRegex: /git log/i,
      solutionCommands: ['git log -1'],
    },

    challenge: {
      title: 'Inspect Milestone Documentation',
      instructions: 'Review latest documentation commit to verify release version alignment.',
      startingState: 'Milestone notes committed.',
      goalState: 'Latest commit message verified.',
      hints: ['Run `git log -1`.'],
    },

    reference: {
      officialDocUrl: 'https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/about-milestones',
      syntaxCheatSheet: [
        'gh issue list --milestone "<name>" : List issues in milestone',
        'gh pr list --milestone "<name>" : List PRs in milestone',
        'Milestone page displays: Open issues, Closed issues, Percentage bar',
      ],
      commonErrors: [
        { error: 'Feature creep delaying milestone', remedy: 'Aggressively triage: move non-essential open issues out of the current milestone into "Backlog" or "vNext" to keep release on schedule.' },
      ],
      mentalModelDiagram: {
        concept: 'Milestone Progress Bar',
        explanation: '[===================>          ] 65% Closed (13/20 issues resolved). Deadline: Nov 1.',
        storageLocation: 'GitHub repository metadata entity associated with issues and pull requests.',
      },
      edgeCases: ['An issue can only belong to one milestone at a time, whereas it can have multiple labels.'],
    },
  },
};
