import { ConceptPracticeChallenge } from './unifiedAcademyData';

export const ALL_PRACTICE_CHALLENGES: Record<string, ConceptPracticeChallenge> = {
  // =========================================================================
  // TOPIC 05: GitHub Essentials
  // =========================================================================
  'c-github-intro': {
    title: 'Verify Remote GitHub Origin Connection',
    objective: 'Inspect configured remotes with git remote -v to verify your local repository connects to GitHub.',
    instructions: 'Run git remote -v to confirm that both (fetch) and (push) URLs point to the intended GitHub project repository.',
    startingState: 'Local repo initialized with origin pointing to https://github.com/learn/forge.git',
    goalState: 'Remote origin URL displayed with valid fetch and push targets.',
    seedCommands: ['git init', 'git remote add origin https://github.com/learn/forge.git'],
    initialFiles: {
      'README.md': '# Project Forge\nInteractive Git and Developer Academy platform.\n',
    },
    expectedCommands: ['git remote -v', 'git status'],
    hints: [
      'Use the verbose flag with `git remote` to see complete endpoint URLs.',
      'Run `git remote -v` to print both fetch and push target addresses.',
    ],
    solutionExplanation: 'Running `git remote -v` provides full visibility into which remote servers your local branch communicates with.',
    safeFailure: {
      mistakeTitle: 'Pushing Blindly Without Verifying Remote',
      mistakeCommand: 'git push origin main',
      whatHappened: 'Attempted to push without verifying write permissions or target URL.',
      whatWasNotLost: 'All local commits remain completely intact on your disk.',
      recoveryCommand: 'git remote -v',
      recoveryExplanation: 'Always inspect `git remote -v` before publishing code to ensure you target the right upstream repository.',
    },
  },

  'c-github-forks': {
    title: 'Configure Dual Fork & Upstream Remotes',
    objective: 'Attach the upstream open-source repository so your fork stays synchronized with parent changes.',
    instructions: 'Add upstream remote URL to establish the triangle open-source workflow alongside origin.',
    startingState: 'Single remote `origin` pointing to your personal fork.',
    goalState: 'Two distinct remotes visible in git remote -v: origin and upstream.',
    seedCommands: ['git init', 'git remote add origin https://github.com/dev-user/open-forge.git'],
    initialFiles: {
      'CONTRIBUTING.md': '# Contributing Guide\nPlease fork this repository before opening pull requests.\n',
    },
    expectedCommands: ['git remote add upstream https://github.com/upstream-org/open-forge.git', 'git remote -v'],
    hints: [
      'Use `git remote add` specifying the name `upstream`.',
      'Run `git remote add upstream https://github.com/upstream-org/open-forge.git` and verify with `git remote -v`.',
    ],
    solutionExplanation: 'Configuring both origin (your fork) and upstream (original repo) enables seamless synchronization without permission errors.',
    safeFailure: {
      mistakeTitle: 'Direct Push to Upstream Repository',
      mistakeCommand: 'git push upstream main',
      whatHappened: 'Attempted to push directly to an open-source repository where you lack write access.',
      whatWasNotLost: 'Your local commits and your fork on origin remain untouched.',
      recoveryCommand: 'git push origin main',
      recoveryExplanation: 'In fork workflows, push feature branches to your fork (origin), then open a Pull Request.',
    },
  },

  'c-github-pull-requests': {
    title: 'Prepare Feature Branch for Pull Request',
    objective: 'Create an isolated feature branch, stage changes, and seal an atomic commit for code review.',
    instructions: 'Create feature branch `feature/navbar`, stage navbar.js, and commit with a conventional semantic message.',
    startingState: 'On main branch with uncommitted navbar component file on disk.',
    goalState: 'Branch feature/navbar active with clean sealed commit ready for PR review.',
    seedCommands: ['git init', 'git commit --allow-empty -m "feat: initial commit"'],
    initialFiles: {
      'navbar.js': 'export const Navbar = () => <nav className="top-nav">Navigation</nav>;\n',
    },
    expectedCommands: ['git switch -c feature/navbar', 'git add navbar.js', 'git commit -m "feat(ui): add responsive navigation bar"'],
    hints: [
      'Create and switch to a branch with `git switch -c feature/navbar`.',
      'Stage the component with `git add navbar.js` and commit with a descriptive message.',
    ],
    solutionExplanation: 'Pull requests require isolated branch history so peers can review and test changes without affecting the main branch.',
    safeFailure: {
      mistakeTitle: 'Committing PR Changes Directly on Main',
      mistakeCommand: 'git add . && git commit -m "navbar"',
      whatHappened: 'Committed directly to main, polluting stable production branch before peer review.',
      whatWasNotLost: 'The commit exists in local history; you can branch off it and reset main.',
      recoveryCommand: 'git branch feature/navbar && git reset --hard HEAD~1',
      recoveryExplanation: 'Branching off the commit preserves your work on feature/navbar while resetting main to clean state.',
    },
  },

  'c-github-ssh-keys': {
    title: 'Test GitHub SSH Authentication',
    objective: 'Verify secure cryptographic SSH key connectivity to github.com using SSH authentication testing.',
    instructions: 'Verify SSH credentials with `ssh -T git@github.com` and inspect remote connectivity.',
    startingState: 'Local workspace configured with SSH remote address git@github.com:dev/repo.git.',
    goalState: 'SSH protocol verification executed and remote connection confirmed.',
    seedCommands: ['git init', 'git remote add origin git@github.com:dev/repo.git'],
    initialFiles: {
      '.ssh-config': 'Host github.com\n  User git\n  IdentityFile ~/.ssh/id_ed25519\n',
    },
    expectedCommands: ['ssh -T git@github.com', 'git remote -v'],
    hints: [
      'Test SSH authentication handshake with `ssh -T git@github.com`.',
      'Run `git remote -v` to confirm SSH URLs (`git@github.com:...`).',
    ],
    solutionExplanation: 'SSH key pairs provide encrypted public-key authentication without storing plain-text passwords on developer machines.',
    safeFailure: {
      mistakeTitle: 'Sharing Private Key Instead of Public Key',
      mistakeCommand: 'cat ~/.ssh/id_ed25519',
      whatHappened: 'Displayed secret private key. Never upload or share private keys with anyone.',
      whatWasNotLost: 'Your key is still valid locally, but public keys (`.pub`) are the only keys safe to share.',
      recoveryCommand: 'cat ~/.ssh/id_ed25519.pub',
      recoveryExplanation: 'Always use the `.pub` file when adding keys to GitHub settings.',
    },
  },

  // =========================================================================
  // TOPIC 06: Collaboration on GitHub
  // =========================================================================
  'c-gh-code-review': {
    title: 'Review Branch Diffs Before PR Submission',
    objective: 'Inspect exact line modifications between your feature branch and main using three-dot diff.',
    instructions: 'Run `git diff main...HEAD` to verify only intended changes are included in your pull request.',
    startingState: 'On feature/auth with modified authentication logic.',
    goalState: 'Diff reviewed and confirmed clean without extraneous debugging lines.',
    seedCommands: ['git init', 'git commit --allow-empty -m "initial"', 'git switch -c feature/auth', 'echo "jwt" > auth.js', 'git add auth.js', 'git commit -m "feat: add jwt auth"'],
    initialFiles: {
      'auth.js': 'export const authenticate = (token) => token ? { valid: true } : null;\n',
    },
    expectedCommands: ['git diff main...HEAD', 'git log --oneline -n 2'],
    hints: [
      'Use three-dot diff notation: `git diff main...HEAD`.',
      'Check commit history with `git log --oneline -n 2`.',
    ],
    solutionExplanation: 'Self-reviewing diffs before opening pull requests catches stray console.logs, commented code, and unwanted file changes.',
    safeFailure: {
      mistakeTitle: 'Submitting PR Without Reviewing Diff',
      mistakeCommand: 'git push origin feature/auth',
      whatHappened: 'Pushed branch containing unintended temporary files and debug statements.',
      whatWasNotLost: 'You can amend the commit locally and push an updated version.',
      recoveryCommand: 'git diff HEAD~1',
      recoveryExplanation: 'Inspect the commit diff to identify what needs to be cleaned up.',
    },
  },

  'c-gh-upstream-sync': {
    title: 'Synchronize Local Fork with Upstream',
    objective: 'Fetch the latest upstream commits and merge upstream/main into your local branch.',
    instructions: 'Run `git fetch upstream` and fast-forward your local branch to stay up to date with the team.',
    startingState: 'Local fork is 2 commits behind upstream repository.',
    goalState: 'Upstream fetched and local main synchronized without conflicts.',
    seedCommands: ['git init', 'git remote add upstream https://github.com/org/upstream-core.git'],
    initialFiles: {
      'README.md': '# Upstream Core Repository\n',
    },
    expectedCommands: ['git fetch upstream', 'git merge upstream/main'],
    hints: [
      'Download upstream milestones with `git fetch upstream`.',
      'Integrate the downloaded commits with `git merge upstream/main`.',
    ],
    solutionExplanation: 'Fetching without merging downloads objects safely into the repository, allowing careful inspection before merging.',
    safeFailure: {
      mistakeTitle: 'Force Pushing Over Divergent Upstream',
      mistakeCommand: 'git push --force origin main',
      whatHappened: 'Overwrote fork history without incorporating upstream team commits.',
      whatWasNotLost: 'Upstream commits are safe on the central server.',
      recoveryCommand: 'git fetch upstream && git merge upstream/main',
      recoveryExplanation: 'Always fetch and merge upstream before pushing your own changes.',
    },
  },

  'c-gh-pr-squash': {
    title: 'Squash Multiple WIP Commits for Clean PR',
    objective: 'Condense messy checkpoint commits into a single clean semantic milestone.',
    instructions: 'Use soft reset or squash merge to turn 3 intermediate commits into one production-ready commit.',
    startingState: 'Branch contains 3 messy commits: "wip 1", "wip 2", "fix typo".',
    goalState: 'Single clean commit with conventional message on branch.',
    seedCommands: ['git init', 'git commit --allow-empty -m "base"', 'git commit --allow-empty -m "wip 1"', 'git commit --allow-empty -m "wip 2"', 'git commit --allow-empty -m "fix typo"'],
    initialFiles: {
      'feature.js': 'export const completedFeature = true;\n',
    },
    expectedCommands: ['git reset --soft HEAD~3', 'git commit -m "feat(core): complete feature implementation"'],
    hints: [
      'Soft reset moves HEAD backward while keeping all changes staged: `git reset --soft HEAD~3`.',
      'Then commit the staged changes with a clean message.',
    ],
    solutionExplanation: 'Squashing keeps team history linear and easy to bisect, preventing noisy "fix typo" commits from entering production history.',
    safeFailure: {
      mistakeTitle: 'Hard Resetting Instead of Soft Resetting',
      mistakeCommand: 'git reset --hard HEAD~3',
      whatHappened: 'Discarded working files and staging index along with commit pointers.',
      whatWasNotLost: 'Commits can still be recovered from `git reflog` within 30 days.',
      recoveryCommand: 'git reflog',
      recoveryExplanation: 'Inspect `git reflog` to locate the commit hash before the reset and restore it.',
    },
  },

  'c-gh-protected-branches': {
    title: 'Enforce Branch Protection Workflows',
    objective: 'Verify branch protection policies by isolating changes on a feature branch instead of direct push.',
    instructions: 'Create feature branch `feature/protected-audit`, make changes, and verify main branch protection.',
    startingState: 'On main branch with protected branch rules active.',
    goalState: 'Feature branch created and changes staged in isolation.',
    seedCommands: ['git init', 'git commit --allow-empty -m "stable release v1.0"'],
    initialFiles: {
      'core.js': 'console.log("Protected production core");\n',
    },
    expectedCommands: ['git switch -c feature/protected-audit', 'git status'],
    hints: [
      'Create a feature branch with `git switch -c feature/protected-audit`.',
      'Inspect status to confirm you are no longer on protected main.',
    ],
    solutionExplanation: 'Branch protection rules prevent direct pushes and force pull request reviews, passing CI checks, and linear history.',
    safeFailure: {
      mistakeTitle: 'Attempting Force Push to Protected Main',
      mistakeCommand: 'git push --force origin main',
      whatHappened: 'Remote rejected push: protected branches disallow force pushes and direct commits.',
      whatWasNotLost: 'Your local commits are safe on your disk.',
      recoveryCommand: 'git switch -c feature/my-work',
      recoveryExplanation: 'Create a feature branch from your work and open a pull request for review.',
    },
  },

  // =========================================================================
  // TOPIC 07: Merge Strategies
  // =========================================================================
  'c-fast-forward': {
    title: 'Execute a Clean Fast-Forward Merge',
    objective: 'Fast-forward the main branch pointer to match a linear feature branch without creating merge commit.',
    instructions: 'Switch to main and run `git merge --ff-only feature/speed` to advance the branch pointer linearly.',
    startingState: 'Feature branch is 1 commit ahead of main with no divergent commits.',
    goalState: 'Main pointer fast-forwarded to feature commit with clean linear log.',
    seedCommands: ['git init', 'git commit --allow-empty -m "base"', 'git switch -c feature/speed', 'echo "fast" > perf.txt', 'git add perf.txt', 'git commit -m "feat: add performance optimizations"'],
    initialFiles: {
      'perf.txt': 'High performance caching active\n',
    },
    expectedCommands: ['git switch main', 'git merge --ff-only feature/speed'],
    hints: [
      'Switch to the receiving branch first: `git switch main`.',
      'Merge with the fast-forward only flag: `git merge --ff-only feature/speed`.',
    ],
    solutionExplanation: 'Fast-forward merges simply move the branch pointer forward in time without adding cluttering merge bubble commits.',
    safeFailure: {
      mistakeTitle: 'Forcing Merge Commit When Linear',
      mistakeCommand: 'git merge --no-ff feature/speed',
      whatHappened: 'Created an unnecessary merge commit when history was already linear.',
      whatWasNotLost: 'All files and commits are safe.',
      recoveryCommand: 'git reset --hard HEAD~1',
      recoveryExplanation: 'Reset the merge commit and run `git merge --ff-only feature/speed`.',
    },
  },

  'c-three-way-merge': {
    title: 'Perform True 3-Way Merge with Divergent Branches',
    objective: 'Reconcile two divergent branches and seal an integrated 3-way merge commit.',
    instructions: 'Merge branch `feature/payment` into main, inspect the combined state, and finalize the merge commit.',
    startingState: 'Main and feature/payment have divergent commits created since common ancestor.',
    goalState: 'Merge commit sealed with two parent pointers in commit DAG.',
    seedCommands: [
      'git init',
      'echo "root" > app.txt',
      'git add app.txt',
      'git commit -m "root: initialize app"',
      'git switch -c feature/payment',
      'echo "pay" > payment.js',
      'git add payment.js',
      'git commit -m "feat: payment gateway"',
      'git switch main',
      'echo "ui" > navbar.css',
      'git add navbar.css',
      'git commit -m "style: update navigation bar"',
    ],
    initialFiles: {
      'payment.js': 'export const pay = () => true;\n',
      'navbar.css': 'nav { display: flex; }\n',
    },
    expectedCommands: ['git merge feature/payment -m "merge: integrate payment gateway into main"'],
    hints: [
      'Run `git merge feature/payment` from the main branch.',
      'Provide a clear merge message describing the combined features.',
    ],
    solutionExplanation: 'Git uses common ancestor analysis (best common ancestor) to calculate automatic 3-way reconciliation.',
    safeFailure: {
      mistakeTitle: 'Aborting a Clean Non-Conflicting Merge',
      mistakeCommand: 'git merge --abort',
      whatHappened: 'Aborted the merge before completion, resetting main to its pre-merge state.',
      whatWasNotLost: 'Both branches retain their independent commits.',
      recoveryCommand: 'git merge feature/payment',
      recoveryExplanation: 'Re-run the merge command to complete the integration.',
    },
  },

  'c-git-rebase': {
    title: 'Rebase Feature Branch Linearly on Main',
    objective: 'Replay feature branch commits on top of updated main to eliminate merge bubbles.',
    instructions: 'While on feature branch, run `git rebase main` to transplant your commits onto current main.',
    startingState: 'Feature branch created from old main commit while main has advanced with new commits.',
    goalState: 'Feature commits replayed cleanly on top of main with linear timeline.',
    seedCommands: [
      'git init',
      'git commit --allow-empty -m "initial commit"',
      'git switch -c feature/search',
      'echo "search" > search.js',
      'git add search.js',
      'git commit -m "feat: search index"',
      'git switch main',
      'echo "config" > config.json',
      'git add config.json',
      'git commit -m "chore: update environment config"',
      'git switch feature/search',
    ],
    initialFiles: {
      'search.js': 'export const search = () => [];\n',
      'config.json': '{\n  "env": "production"\n}\n',
    },
    expectedCommands: ['git rebase main', 'git log --oneline'],
    hints: [
      'Run `git rebase main` while on the feature branch.',
      'Check history with `git log --oneline` to see the linear commit order.',
    ],
    solutionExplanation: 'Rebase rewinds your branch to the common ancestor, applies main commits, then replays your commits one by one.',
    safeFailure: {
      mistakeTitle: 'Rebasing the Wrong Direction (Main on Feature)',
      mistakeCommand: 'git switch main && git rebase feature/search',
      whatHappened: 'Transplanted production main onto a temporary local feature branch.',
      whatWasNotLost: 'Reflog preserves the original main branch pointer.',
      recoveryCommand: 'git reset --hard ORIG_HEAD',
      recoveryExplanation: 'Git sets ORIG_HEAD before rebases; resetting to it undoes the accidental rebase instantly.',
    },
  },

  'c-merge-conflicts': {
    title: 'Resolve File Conflict Markers Calmly',
    objective: 'Open conflicted file, eliminate conflict markers, keep correct code, and seal resolution commit.',
    instructions: 'Inspect `config.js`, remove `<<<<<<<`, `=======`, `>>>>>>>` markers, stage file, and commit.',
    startingState: 'Merge collision in `config.js` with both branches modifying the same line.',
    goalState: 'Conflict markers removed, file staged, and merge finalized.',
    seedCommands: ['git init', 'git commit --allow-empty -m "base"'],
    initialFiles: {
      'config.js': '<<<<<<< HEAD\nexport const theme = "light";\n=======\nexport const theme = "dark";\n>>>>>>> feature/dark-theme\n',
    },
    expectedCommands: ['git status', 'git add config.js', 'git commit -m "merge: resolve theme configuration conflict"'],
    hints: [
      'Run `git status` to see unmerged paths.',
      'Stage the resolved file with `git add config.js`, then run `git commit`.',
    ],
    solutionExplanation: 'Git stops and asks for developer intent when both branches edit the exact same lines.',
    safeFailure: {
      mistakeTitle: 'Committing Raw Conflict Markers to Production',
      mistakeCommand: 'git commit -am "fix"',
      whatHappened: 'Committed raw `<<<<<<< HEAD` syntax into repository, breaking runtime syntax.',
      whatWasNotLost: 'You can amend the commit or edit the file and recommit.',
      recoveryCommand: 'git status',
      recoveryExplanation: 'Never stage files until all conflict markers have been manually reviewed and removed.',
    },
  },

  // =========================================================================
  // TOPIC 08: Best Practices
  // =========================================================================
  'c-atomic-commits': {
    title: 'Stage and Seal Focused Atomic Commits',
    objective: 'Separate styling changes from critical business logic into distinct single-purpose commits.',
    instructions: 'Stage style.css and commit it first. Then stage auth.js and commit it separately.',
    startingState: 'Working tree contains both modified style.css and modified auth.js.',
    goalState: 'Two distinct, atomic commits sealed in repository history.',
    seedCommands: ['git init', 'echo "body { color: #111; }" > style.css', 'echo "export const auth = false;" > auth.js'],
    initialFiles: {
      'style.css': 'body { color: #334155; font-family: sans-serif; }\n',
      'auth.js': 'export const login = () => true;\n',
    },
    expectedCommands: ['git add style.css', 'git commit -m "style(ui): improve body typography"', 'git add auth.js', 'git commit -m "feat(auth): implement login handler"'],
    hints: [
      'Stage only `style.css` with `git add style.css` and commit.',
      'Then stage `auth.js` with `git add auth.js` and commit with a focused message.',
    ],
    solutionExplanation: 'Atomic commits do one thing well, making rollbacks, cherry-picks, and code reviews effortless.',
    safeFailure: {
      mistakeTitle: 'Blanket Staging Multiple Unrelated Changes',
      mistakeCommand: 'git add . && git commit -m "changes"',
      whatHappened: 'Lumped UI tweaks and critical auth logic into a single monolithic commit.',
      whatWasNotLost: 'Use soft reset to split the monolithic commit.',
      recoveryCommand: 'git reset --soft HEAD~1',
      recoveryExplanation: 'Soft reset returns the files to staging so you can selectively unstage and commit them atomically.',
    },
  },

  'c-commit-messages': {
    title: 'Craft Conventional Semantic Commit Message',
    objective: 'Write a professional commit message following Conventional Commits format (`type(scope): message`).',
    instructions: 'Stage validator.js and commit using the `fix(auth):` conventional prefix.',
    startingState: 'Modified validator.js on disk with fixed email verification logic.',
    goalState: 'Commit sealed with standard conventional semantic syntax.',
    seedCommands: ['git init', 'echo "validator" > validator.js', 'git add validator.js'],
    initialFiles: {
      'validator.js': 'export const isValidEmail = (email) => email && email.includes("@") && email.includes(".");\n',
    },
    expectedCommands: ['git commit -m "fix(auth): enforce strict email format validation"'],
    hints: [
      'Use the conventional format: `fix(scope): description`.',
      'For example: `git commit -m "fix(auth): enforce strict email format validation"`.',
    ],
    solutionExplanation: 'Conventional commits allow automated changelog generation, semantic versioning, and fast commit skimming.',
    safeFailure: {
      mistakeTitle: 'Vague Commit Message ("fixed bug")',
      mistakeCommand: 'git commit -m "fixed bug"',
      whatHappened: 'Committed with no scope or context, making future git bisect audits difficult.',
      whatWasNotLost: 'You can rewrite the message of the most recent commit immediately.',
      recoveryCommand: 'git commit --amend -m "fix(auth): enforce strict email format validation"',
      recoveryExplanation: 'Using `git commit --amend -m "..."` updates the latest commit message cleanly.',
    },
  },

  'c-gitignore-mastery': {
    title: 'Protect Secrets with .gitignore Rules',
    objective: 'Configure `.gitignore` to prevent sensitive credentials and environment variables from leaking.',
    instructions: 'Add `.env` to `.gitignore`, stage `.gitignore` and `app.js`, and verify `.env` stays untracked.',
    startingState: 'Working tree contains untracked `.env` secret file and modified `app.js`.',
    goalState: '`.env` is ignored by Git and only `.gitignore` and `app.js` are staged.',
    seedCommands: ['git init', 'echo "SECRET_KEY=prod_live_key_999" > .env', 'echo "console.log(1);" > app.js'],
    initialFiles: {
      '.env': 'DATABASE_PASSWORD=super_secret_password_123\nAPI_SECRET=sk_live_xyz\n',
      'app.js': 'console.log("Application started successfully");\n',
    },
    expectedCommands: ['echo ".env" >> .gitignore', 'git status', 'git add .gitignore app.js', 'git commit -m "chore: ignore environment secrets"'],
    hints: [
      'Append `.env` to `.gitignore` file: `echo ".env" >> .gitignore`.',
      'Check `git status` to verify `.env` is no longer listed under untracked files.',
    ],
    solutionExplanation: 'Ignoring credentials prevents secrets from being pushed to public GitHub repositories.',
    safeFailure: {
      mistakeTitle: 'Accidentally Staging .env Secret File',
      mistakeCommand: 'git add .env',
      whatHappened: 'Staged sensitive credentials file into the packing index.',
      whatWasNotLost: 'The file has not been committed yet! You can unstage it safely.',
      recoveryCommand: 'git restore --staged .env',
      recoveryExplanation: 'Running `git restore --staged .env` removes it from staging without deleting the file on disk.',
    },
  },

  'c-clean-git-hygiene': {
    title: 'Prune Stale Merged Branches',
    objective: 'Identify local branches that have already been integrated into main and delete them safely.',
    instructions: 'Run `git branch --merged` to find dead branches, then delete `feature/old-navbar` with `-d`.',
    startingState: 'Local repo has stale merged branch `feature/old-navbar`.',
    goalState: 'Merged branch deleted and branch listing clean.',
    seedCommands: [
      'git init',
      'git commit --allow-empty -m "root"',
      'git switch -c feature/old-navbar',
      'git commit --allow-empty -m "navbar"',
      'git switch main',
      'git merge feature/old-navbar',
    ],
    initialFiles: {
      'README.md': '# Project\n',
    },
    expectedCommands: ['git branch --merged', 'git branch -d feature/old-navbar'],
    hints: [
      'Find already merged branches with `git branch --merged`.',
      'Safely delete with `git branch -d feature/old-navbar`.',
    ],
    solutionExplanation: 'Deleting merged branches prevents branch clutter and eliminates confusion about active work.',
    safeFailure: {
      mistakeTitle: 'Force Deleting Unmerged Branch with -D',
      mistakeCommand: 'git branch -D feature/in-progress',
      whatHappened: 'Force deleted a branch that contained unmerged commits.',
      whatWasNotLost: 'Commits can be found in `git reflog` and restored to a new branch.',
      recoveryCommand: 'git reflog',
      recoveryExplanation: 'Inspect `git reflog` to find the last commit SHA of the deleted branch.',
    },
  },

  // =========================================================================
  // TOPIC 09: Working in a Team
  // =========================================================================
  'c-trunk-based': {
    title: 'Execute Trunk-Based Short-Lived Flow',
    objective: 'Create a micro-branch, apply a fix, merge directly into trunk, and delete branch within one sprint cycle.',
    instructions: 'Create branch `fix/header-typo`, commit fix, switch to main, and merge with fast-forward.',
    startingState: 'On trunk (main) with verified production build.',
    goalState: 'Fix integrated directly into trunk within single command cycle.',
    seedCommands: ['git init', 'git commit --allow-empty -m "trunk: stable build"'],
    initialFiles: {
      'header.js': 'export const Title = "CommitForge Academy";\n',
    },
    expectedCommands: ['git switch -c fix/header-typo', 'git add header.js', 'git commit -m "fix(header): correct title spelling"', 'git switch main', 'git merge fix/header-typo'],
    hints: [
      'Create short branch: `git switch -c fix/header-typo`.',
      'Commit and merge back to main promptly.',
    ],
    solutionExplanation: 'Trunk-based development avoids multi-week branch divergence by merging small changes frequently.',
    safeFailure: {
      mistakeTitle: 'Letting Branch Stale for Months',
      mistakeCommand: 'git status',
      whatHappened: 'Left branch unmerged while trunk advanced hundreds of commits.',
      whatWasNotLost: 'Rebasing on trunk resolves divergence incrementally.',
      recoveryCommand: 'git rebase main',
      recoveryExplanation: 'Rebase frequently against main to keep merge conflicts negligible.',
    },
  },

  'c-gitflow': {
    title: 'Initialize Gitflow Release Branch',
    objective: 'Branch off `develop` into `release/v1.0.0` to stabilize version milestones before merging to production.',
    instructions: 'Create and checkout `release/v1.0.0` from develop, bump version file, and commit.',
    startingState: 'On develop branch with all sprint features completed.',
    goalState: 'Release branch active with version bump commit ready for QA.',
    seedCommands: ['git init', 'git branch develop', 'git switch develop', 'git commit --allow-empty -m "feat: all sprint features completed"'],
    initialFiles: {
      'version.json': '{\n  "version": "1.0.0-rc.1"\n}\n',
    },
    expectedCommands: ['git switch -c release/v1.0.0', 'git add version.json', 'git commit -m "chore(release): bump version to v1.0.0"'],
    hints: [
      'Create release branch with `git switch -c release/v1.0.0`.',
      'Stage version.json and commit release metadata.',
    ],
    solutionExplanation: 'Gitflow separates active daily development (`develop`) from release hardening (`release/*`) and production (`main`).',
    safeFailure: {
      mistakeTitle: 'Branching Release Directly Off Feature Branch',
      mistakeCommand: 'git switch -c release/v1.0.0 feature/untested',
      whatHappened: 'Created release branch containing experimental unapproved feature code.',
      whatWasNotLost: 'Develop branch is safe; delete accidental release branch.',
      recoveryCommand: 'git switch develop && git branch -D release/v1.0.0',
      recoveryExplanation: 'Always cut release branches from develop after feature freeze.',
    },
  },

  'c-team-conflict-prevention': {
    title: 'Proactive Morning Rebase Synchronization',
    objective: 'Rebase your active branch on current main every morning to resolve collisions before they escalate.',
    instructions: 'Rebase your local work on updated main, verify test files, and inspect status.',
    startingState: 'Your feature branch has 1 commit while main received 1 teammate commit.',
    goalState: 'Feature commits cleanly transplanted on top of teammate work with zero conflicts.',
    seedCommands: [
      'git init',
      'git commit --allow-empty -m "init"',
      'git switch -c feature/cart',
      'echo "cart" > cart.js',
      'git add cart.js',
      'git commit -m "feat: add cart"',
      'git switch main',
      'echo "item" > item.js',
      'git add item.js',
      'git commit -m "feat: add item model"',
      'git switch feature/cart',
    ],
    initialFiles: {
      'cart.js': 'export const cart = [];\n',
      'item.js': 'export const item = {};\n',
    },
    expectedCommands: ['git rebase main', 'git status'],
    hints: [
      'While on `feature/cart`, run `git rebase main`.',
      'Run `git status` to verify clean working tree.',
    ],
    solutionExplanation: 'Syncing daily keeps diffs minimal and ensures you test against current team code continuously.',
    safeFailure: {
      mistakeTitle: 'Waiting for Big-Bang Merge at Sprint End',
      mistakeCommand: 'git status',
      whatHappened: 'Allowed 4 weeks of divergence resulting in 30 file collisions.',
      whatWasNotLost: 'Work is preserved; rebase step-by-step.',
      recoveryCommand: 'git rebase main',
      recoveryExplanation: 'Rebasing frequently breaks conflict resolution into tiny 1-minute tasks.',
    },
  },

  // =========================================================================
  // TOPIC 10: GitHub Projects
  // =========================================================================
  'c-gh-issues': {
    title: 'Close Issues Automatically via Commit Message',
    objective: 'Seal a bugfix commit using the `Closes #15` keyword to trigger automated GitHub issue closing.',
    instructions: 'Stage patch.js and commit with message `fix(cart): resolve negative quantity bug (Closes #15)`.',
    startingState: 'Uncommitted bugfix for Issue #15 in working tree.',
    goalState: 'Commit sealed containing closing keyword and issue number.',
    seedCommands: ['git init', 'echo "fix" > patch.js', 'git add patch.js'],
    initialFiles: {
      'patch.js': 'export const validateQuantity = (qty) => Math.max(1, qty);\n',
    },
    expectedCommands: ['git commit -m "fix(cart): resolve negative quantity bug (Closes #15)"'],
    hints: [
      'Use closing keywords: `Closes #15` or `Fixes #15`.',
      'Include keyword in commit message: `git commit -m "fix(cart): resolve negative quantity bug (Closes #15)"`.',
    ],
    solutionExplanation: 'GitHub automatically closes referenced issues when the commit merges into the repository default branch.',
    safeFailure: {
      mistakeTitle: 'Omitting Issue Number in Commit',
      mistakeCommand: 'git commit -m "fixed negative quantity issue"',
      whatHappened: 'Commit does not link to GitHub issue tracker; issue remains open.',
      whatWasNotLost: 'Amend the commit message to add the reference.',
      recoveryCommand: 'git commit --amend -m "fix(cart): resolve negative quantity bug (Closes #15)"',
      recoveryExplanation: 'Amend the latest commit to include the `(Closes #15)` keyword.',
    },
  },

  'c-gh-project-boards': {
    title: 'Audit Project Board Branch Work Items',
    objective: 'Verify your branch conforms to project board work item naming conventions before pull request.',
    instructions: 'Check branch name with `git branch -v` and inspect working tree status.',
    startingState: 'Feature branch linked to GitHub Projects card.',
    goalState: 'Branch verified and clean for automated board column transitions.',
    seedCommands: ['git init', 'git commit --allow-empty -m "base"', 'git switch -c feature/proj-42-checkout'],
    initialFiles: {
      'checkout.js': 'export const checkout = () => true;\n',
    },
    expectedCommands: ['git status', 'git branch -v'],
    hints: [
      'Inspect branch name and tracking with `git branch -v`.',
      'Check status with `git status`.',
    ],
    solutionExplanation: 'Linking branch names to project board card IDs automates card movement from "In Progress" to "Review".',
    safeFailure: {
      mistakeTitle: 'Moving Project Card Without Creating Branch',
      mistakeCommand: 'git status',
      whatHappened: 'Card moved to In Progress but no developer branch exists.',
      whatWasNotLost: 'Create the branch now.',
      recoveryCommand: 'git switch -c feature/proj-card',
      recoveryExplanation: 'Branch off main with matching task card ID.',
    },
  },

  'c-gh-milestones': {
    title: 'Tag Sprint Milestone Target Commit',
    objective: 'Create an annotated milestone tag marking the completion of a major sprint objective.',
    instructions: 'Create tag `milestone/sprint-3` with milestone notes and verify tag listing.',
    startingState: 'All sprint deliverables merged into main.',
    goalState: 'Annotated milestone tag sealed and listed.',
    seedCommands: ['git init', 'git commit --allow-empty -m "feat(milestone): deliver sprint 3 scope"'],
    initialFiles: {
      'MILESTONE.md': '# Sprint 3 Milestone Scope\nDelivered core features on schedule.\n',
    },
    expectedCommands: ['git tag -a milestone/sprint-3 -m "Sprint 3 Milestone Target Delivered"', 'git tag -l'],
    hints: [
      'Use `git tag -a milestone/sprint-3 -m "Sprint 3 Milestone Target Delivered"`.',
      'List tags with `git tag -l`.',
    ],
    solutionExplanation: 'Milestone tags establish permanent cryptographic pointers corresponding to product release deadlines.',
    safeFailure: {
      mistakeTitle: 'Creating Tag on Wrong Commit',
      mistakeCommand: 'git tag milestone/sprint-3 HEAD~1',
      whatHappened: 'Tagged older commit before all sprint deliverables were merged.',
      whatWasNotLost: 'Tags can be deleted and recreated on current HEAD.',
      recoveryCommand: 'git tag -d milestone/sprint-3 && git tag -a milestone/sprint-3 -m "Sprint 3"',
      recoveryExplanation: 'Delete the misaligned tag with `-d` and retag the correct HEAD commit.',
    },
  },

  // =========================================================================
  // TOPIC 11: Intermediate Git Topics
  // =========================================================================
  'c-git-stash': {
    title: 'Shelve and Restore Work In Progress with Stash',
    objective: 'Shelve uncommitted modifications with `git stash`, inspect clean status, and restore changes with `git stash pop`.',
    instructions: 'Run `git stash` to clean workspace, verify with `git status`, then restore using `git stash pop`.',
    startingState: 'Working tree has uncommitted edits in draft.js while an urgent hotfix is requested.',
    goalState: 'Edits shelved safely, workspace confirmed clean, and edits popped back successfully.',
    seedCommands: ['git init', 'git commit --allow-empty -m "base"', 'echo "wip code" > draft.js'],
    initialFiles: {
      'draft.js': 'export const experimentalFunction = () => "untested draft";\n',
    },
    expectedCommands: ['git stash', 'git status', 'git stash pop'],
    hints: [
      'Shelve your edits into the stash stack: `git stash`.',
      'Verify clean working tree: `git status`.',
      'Restore and remove from stash: `git stash pop`.',
    ],
    solutionExplanation: 'Git stash saves uncommitted edits to a temporary storage stack so you can switch branches cleanly.',
    safeFailure: {
      mistakeTitle: 'Running Hard Reset Instead of Stash',
      mistakeCommand: 'git reset --hard',
      whatHappened: 'Destroyed working tree modifications permanently on disk.',
      whatWasNotLost: 'Committed history is safe, but uncommitted edits are gone.',
      recoveryCommand: 'git status',
      recoveryExplanation: 'Always use `git stash` instead of `git reset --hard` when you want to save your progress.',
    },
  },

  'c-git-cherry-pick': {
    title: 'Surgically Cherry-Pick a Hotfix Commit',
    objective: 'Apply an isolated bugfix commit from a hotfix branch onto main without merging unrelated branch history.',
    instructions: 'Inspect hotfix commit with `git log hotfix --oneline` and cherry-pick it into main.',
    startingState: 'Main is missing a critical patch that was committed on the hotfix branch.',
    goalState: 'Patch commit applied cleanly to main with identical content and new commit SHA.',
    seedCommands: [
      'git init',
      'git commit --allow-empty -m "v1.0 release"',
      'git switch -c hotfix',
      'echo "security patch" > patch.js',
      'git add patch.js',
      'git commit -m "fix(security): patch SQL injection vulnerability"',
      'git switch main',
    ],
    initialFiles: {
      'patch.js': 'export const sanitize = (input) => input.replace(/[\';]/g, "");\n',
    },
    expectedCommands: ['git log hotfix --oneline -n 1', 'git cherry-pick hotfix'],
    hints: [
      'Check the commit hash on hotfix branch: `git log hotfix --oneline -n 1`.',
      'Cherry-pick the branch tip: `git cherry-pick hotfix`.',
    ],
    solutionExplanation: 'Cherry-picking copies the changes from a single commit and creates a brand-new commit on your current branch.',
    safeFailure: {
      mistakeTitle: 'Cherry-Picking Wrong Commit Hash',
      mistakeCommand: 'git cherry-pick HEAD~5',
      whatHappened: 'Picked an irrelevant older commit into the current branch.',
      whatWasNotLost: 'You can abort or reset the cherry-pick.',
      recoveryCommand: 'git reset --hard HEAD~1',
      recoveryExplanation: 'Undo the cherry-picked commit cleanly using `git reset --hard HEAD~1`.',
    },
  },

  'c-git-rebase-i': {
    title: 'Interactive Rebase Commit Cleanup',
    objective: 'Combine multiple messy micro-commits into clean milestones using interactive rebase.',
    instructions: 'Run `git rebase -i HEAD~2` and verify the streamlined commit history.',
    startingState: 'Recent history contains redundant WIP commits.',
    goalState: 'History reviewed and verified with git log --oneline.',
    seedCommands: ['git init', 'git commit --allow-empty -m "root"', 'git commit --allow-empty -m "wip 1"', 'git commit --allow-empty -m "wip 2"'],
    initialFiles: {
      'app.js': 'console.log("Rebase clean app");\n',
    },
    expectedCommands: ['git rebase -i HEAD~2', 'git log --oneline'],
    hints: [
      'Launch interactive rebase with `git rebase -i HEAD~2`.',
      'Inspect resulting linear log with `git log --oneline`.',
    ],
    solutionExplanation: 'Interactive rebase gives you complete editing power over past commits: squash, reword, drop, or reorder.',
    safeFailure: {
      mistakeTitle: 'Deleting Commit Line in Interactive Todo List',
      mistakeCommand: 'git rebase --abort',
      whatHappened: 'Deleting a line in the rebase editor instructs Git to drop that commit.',
      whatWasNotLost: 'Aborting the rebase restores your exact previous branch state.',
      recoveryCommand: 'git rebase --abort',
      recoveryExplanation: 'Run `git rebase --abort` to escape interactive rebase without any changes.',
    },
  },

  'c-git-reset-modes': {
    title: 'Master Soft vs Mixed vs Hard Reset',
    objective: 'Unwind an accidental commit while keeping changes staged using `git reset --soft HEAD~1`.',
    instructions: 'Run `git reset --soft HEAD~1` and verify with `git status` that changes remain in the staging index.',
    startingState: 'Accidental commit sealed with files you still need to adjust.',
    goalState: 'Commit unwound, changes safely in staging index ready for amendment.',
    seedCommands: ['git init', 'echo "data" > data.txt', 'git add data.txt', 'git commit -m "accidental commit"'],
    initialFiles: {
      'data.txt': 'Crucial business records\n',
    },
    expectedCommands: ['git reset --soft HEAD~1', 'git status'],
    hints: [
      'Use the `--soft` flag to preserve staged changes: `git reset --soft HEAD~1`.',
      'Run `git status` to verify `data.txt` is still green (staged).',
    ],
    solutionExplanation: 'Soft reset moves HEAD backward without touching the staging area or working directory.',
    safeFailure: {
      mistakeTitle: 'Using --hard Instead of --soft',
      mistakeCommand: 'git reset --hard HEAD~1',
      whatHappened: 'Wiped working tree modifications from disk.',
      whatWasNotLost: 'The commit is stored in reflog and can be recovered.',
      recoveryCommand: 'git reflog',
      recoveryExplanation: 'Check `git reflog` to locate the commit hash and reset back to it.',
    },
  },

  'c-git-revert': {
    title: 'Safely Revert a Bad Production Commit',
    objective: 'Create an inverse snapshot with `git revert` to undo a regression without rewriting public history.',
    instructions: 'Revert the latest commit using `git revert HEAD --no-edit` and confirm new revert commit in log.',
    startingState: 'Latest commit introduced a bug on the production branch.',
    goalState: 'New revert commit created that cancels the buggy changes cleanly.',
    seedCommands: [
      'git init',
      'echo "v1" > app.js',
      'git add app.js',
      'git commit -m "feat: stable app"',
      'echo "broken syntax" > app.js',
      'git add app.js',
      'git commit -m "feat: broken experimental change"',
    ],
    initialFiles: {
      'app.js': 'syntax error: broken code;\n',
    },
    expectedCommands: ['git revert HEAD --no-edit', 'git log --oneline -n 2'],
    hints: [
      'Revert the tip commit: `git revert HEAD --no-edit`.',
      'Check `git log --oneline -n 2` to see the new revert commit.',
    ],
    solutionExplanation: 'Revert creates a forward-moving commit with inverse diffs, making it 100% safe for shared team branches.',
    safeFailure: {
      mistakeTitle: 'Resetting Shared Public History Instead of Reverting',
      mistakeCommand: 'git reset --hard HEAD~1',
      whatHappened: 'Rewrote history on a shared branch, causing divergence for all teammates who pulled.',
      whatWasNotLost: 'Reflog allows restoring your commit.',
      recoveryCommand: 'git revert HEAD',
      recoveryExplanation: 'On public shared branches, always use `git revert` instead of `git reset`.',
    },
  },

  // =========================================================================
  // TOPIC 12: Tagging
  // =========================================================================
  'c-lightweight-tags': {
    title: 'Create Lightweight Pointer Tag',
    objective: 'Create a lightweight tag bookmarking the current release candidate commit.',
    instructions: 'Run `git tag v1.0.0-rc` and list active tags with `git tag -l`.',
    startingState: 'Commit ready for staging environment release testing.',
    goalState: 'Tag v1.0.0-rc created and confirmed in tag listing.',
    seedCommands: ['git init', 'git commit --allow-empty -m "build: release candidate 1"'],
    initialFiles: {
      'package.json': '{\n  "version": "1.0.0-rc.1"\n}\n',
    },
    expectedCommands: ['git tag v1.0.0-rc', 'git tag -l'],
    hints: [
      'Create tag: `git tag v1.0.0-rc`.',
      'List tags: `git tag -l`.',
    ],
    solutionExplanation: 'A lightweight tag is simply an immovable reference bookmark pointing directly to a specific commit SHA.',
    safeFailure: {
      mistakeTitle: 'Misnaming Release Tag Without Version Prefix',
      mistakeCommand: 'git tag release',
      whatHappened: 'Created ambiguous tag without semantic version identifier.',
      whatWasNotLost: 'Tags can be deleted and recreated with correct naming.',
      recoveryCommand: 'git tag -d release && git tag v1.0.0-rc',
      recoveryExplanation: 'Delete with `git tag -d <name>` and recreate with standard `v1.0.0` format.',
    },
  },

  'c-annotated-tags': {
    title: 'Create Annotated Cryptographic Release Tag',
    objective: 'Create an annotated tag with author metadata, date, and detailed release message.',
    instructions: 'Run `git tag -a v1.0.0 -m "Release v1.0.0 (Production Stable)"` and inspect with `git show v1.0.0`.',
    startingState: 'Production release milestone commit ready for formal tagging.',
    goalState: 'Annotated tag object stored in Git database and inspected.',
    seedCommands: ['git init', 'git commit --allow-empty -m "chore(release): finalize v1.0.0 deliverables"'],
    initialFiles: {
      'CHANGELOG.md': '# Changelog v1.0.0\n- High performance Git engine\n- 71 concepts\n',
    },
    expectedCommands: ['git tag -a v1.0.0 -m "Release v1.0.0 (Production Stable)"', 'git show v1.0.0'],
    hints: [
      'Use `-a` and `-m` flags: `git tag -a v1.0.0 -m "Release v1.0.0 (Production Stable)"`.',
      'Inspect tag object details: `git show v1.0.0`.',
    ],
    solutionExplanation: 'Annotated tags are stored as full objects in `.git/objects/` containing tagger name, email, timestamp, and message.',
    safeFailure: {
      mistakeTitle: 'Creating Tag Without Message Flag',
      mistakeCommand: 'git tag -a v1.0.0',
      whatHappened: 'Opens default terminal editor without pre-filling message.',
      whatWasNotLost: 'Exit editor or provide `-m` flag directly.',
      recoveryCommand: 'git tag -a v1.0.0 -m "Release v1.0.0"',
      recoveryExplanation: 'Always pass `-m "..."` for quick and reliable annotated tagging.',
    },
  },

  'c-pushing-tags': {
    title: 'Publish Release Tags to Remote Origin',
    objective: 'Explicitly push release tags to the remote repository using `git push origin <tag>`.',
    instructions: 'Run `git push origin v1.0.0` to publish the release tag to the remote server.',
    startingState: 'Local annotated tag v1.0.0 exists but has not been sent to remote.',
    goalState: 'Tag pushed and confirmed with remote verification.',
    seedCommands: ['git init', 'git remote add origin https://github.com/learn/repo.git', 'git tag -a v1.0.0 -m "v1.0.0"'],
    initialFiles: {
      'README.md': '# Project\n',
    },
    expectedCommands: ['git push origin v1.0.0', 'git tag -l'],
    hints: [
      'Push single tag: `git push origin v1.0.0`.',
      'Verify tags locally with `git tag -l`.',
    ],
    solutionExplanation: 'Git intentionally does not push tags during regular `git push` to prevent leaking local testing tags.',
    safeFailure: {
      mistakeTitle: 'Assuming Standard Push Uploads Tags',
      mistakeCommand: 'git push origin main',
      whatHappened: 'Pushed commits, but tags were not uploaded.',
      whatWasNotLost: 'Tags still exist locally on disk.',
      recoveryCommand: 'git push origin v1.0.0',
      recoveryExplanation: 'Tags must always be pushed explicitly by name or using `--tags`.',
    },
  },

  // =========================================================================
  // TOPIC 13: Git Hooks
  // =========================================================================
  'c-client-hooks': {
    title: 'Inspect Client-Side Hook Architecture',
    objective: 'Explore the `.git/hooks` directory and examine sample hook trigger scripts.',
    instructions: 'Run `ls .git/hooks` and inspect repository status to understand client automation.',
    startingState: 'Repository initialized with default Git sample hook templates.',
    goalState: 'Hook templates discovered and inspected.',
    seedCommands: ['git init'],
    initialFiles: {
      'app.js': 'console.log("Hooks demo");\n',
    },
    expectedCommands: ['ls .git/hooks', 'git status'],
    hints: [
      'List hooks directory: `ls .git/hooks`.',
      'Check status: `git status`.',
    ],
    solutionExplanation: 'Git hooks are executable shell scripts triggered by events like commit, push, and rebase.',
    safeFailure: {
      mistakeTitle: 'Forgetting to Remove .sample Extension',
      mistakeCommand: 'git commit -m "test"',
      whatHappened: 'Hook did not trigger because it retained the `.sample` file extension.',
      whatWasNotLost: 'Rename the file to activate it.',
      recoveryCommand: 'ls .git/hooks',
      recoveryExplanation: 'Remove the `.sample` extension and ensure executable permissions to activate hooks.',
    },
  },

  'c-commit-msg-hook': {
    title: 'Enforce Commit Message Standards via Hook',
    objective: 'Inspect and test the `commit-msg` hook that validates regex patterns on commit messages.',
    instructions: 'Examine hook rules and verify clean commit message validation.',
    startingState: 'Pre-configured commit-msg hook validating conventional semantic prefixes.',
    goalState: 'Commit message validated and sealed by hook.',
    seedCommands: ['git init', 'echo "code" > script.js', 'git add script.js'],
    initialFiles: {
      'script.js': 'export const run = () => true;\n',
    },
    expectedCommands: ['git commit -m "feat(core): implement core runtime engine"'],
    hints: [
      'Provide message conforming to `feat(...)` or `fix(...)`.',
      'Run `git commit -m "feat(core): implement core runtime engine"`.',
    ],
    solutionExplanation: 'The `commit-msg` hook intercepts commit messages before commits are written, rejecting invalid formats.',
    safeFailure: {
      mistakeTitle: 'Bypassing Hook with --no-verify',
      mistakeCommand: 'git commit --no-verify -m "bad message"',
      whatHappened: 'Bypassed team linting and conventional commit validation rules.',
      whatWasNotLost: 'Amend the commit with a proper message.',
      recoveryCommand: 'git commit --amend -m "feat(core): implement core runtime engine"',
      recoveryExplanation: 'Avoid `--no-verify` to ensure continuous quality standards across team repositories.',
    },
  },

  'c-husky-lint-staged': {
    title: 'Automate Pre-Commit Linting with Husky',
    objective: 'Test automated lint-staged pipeline that formats code before sealing commits.',
    instructions: 'Stage `index.js` and execute commit to trigger automated lint verification.',
    startingState: 'Husky and lint-staged configured in package.json.',
    goalState: 'Code formatted, lint verified, and commit sealed cleanly.',
    seedCommands: ['git init', 'echo "console.log(1);" > index.js', 'git add index.js'],
    initialFiles: {
      'package.json': '{\n  "scripts": { "lint": "eslint ." },\n  "lint-staged": { "*.js": "eslint --fix" }\n}\n',
      'index.js': 'const greeting = "Hello CommitForge";\nconsole.log(greeting);\n',
    },
    expectedCommands: ['git status', 'git commit -m "chore(lint): verify husky pre-commit workflow"'],
    hints: [
      'Check staged files with `git status`.',
      'Commit with `git commit -m "chore(lint): verify husky pre-commit workflow"`.',
    ],
    solutionExplanation: 'Husky binds Git hooks to npm scripts, enabling shared team-wide linting and test automation.',
    safeFailure: {
      mistakeTitle: 'Running Full-Repo Lint Instead of Staged Only',
      mistakeCommand: 'npm run lint',
      whatHappened: 'Linted 5,000 legacy files instead of only the files being committed.',
      whatWasNotLost: 'Use `lint-staged` to keep pre-commit execution under 2 seconds.',
      recoveryCommand: 'git status',
      recoveryExplanation: 'lint-staged runs linters exclusively on files currently staged in the index.',
    },
  },

  // =========================================================================
  // TOPIC 14: Submodules
  // =========================================================================
  'c-submodule-add': {
    title: 'Embed External Repository as Submodule',
    objective: 'Attach an external Git repository into vendor/helpers using `git submodule add`.',
    instructions: 'Run `git submodule add https://github.com/utils/helpers.git vendor/helpers` and inspect `.gitmodules`.',
    startingState: 'Main application project ready for external helper library integration.',
    goalState: 'Submodule added, `.gitmodules` generated, and vendor/helpers staged.',
    seedCommands: ['git init'],
    initialFiles: {
      'README.md': '# Main Application\n',
    },
    expectedCommands: ['git submodule add https://github.com/utils/helpers.git vendor/helpers', 'git status'],
    hints: [
      'Run `git submodule add <url> <path>`.',
      'Check status with `git status` to see `.gitmodules` and `vendor/helpers`.',
    ],
    solutionExplanation: 'Submodules record an exact commit SHA of an external repo inside the parent project repository.',
    safeFailure: {
      mistakeTitle: 'Copy-Pasting External Code Directly into Repo',
      mistakeCommand: 'mkdir vendor/helpers',
      whatHappened: 'Lost upstream git history and ability to pull updates automatically.',
      whatWasNotLost: 'Use `git submodule add` to preserve upstream linkage.',
      recoveryCommand: 'git submodule add https://github.com/utils/helpers.git vendor/helpers',
      recoveryExplanation: 'Submodules maintain upstream git links while embedding code in your workspace.',
    },
  },

  'c-submodule-update': {
    title: 'Initialize & Sync Cloned Submodules',
    objective: 'Populate empty submodule directories after cloning with `git submodule update --init --recursive`.',
    instructions: 'Run `git submodule update --init --recursive` to fetch submodule contents and inspect status.',
    startingState: 'Parent repo cloned but submodule directory `lib` is empty.',
    goalState: 'Submodule files populated and synchronized.',
    seedCommands: ['git init', 'echo "[submodule \\"lib\\"]\\n\\tpath = lib\\n\\turl = https://github.com/lib/core.git" > .gitmodules'],
    initialFiles: {
      '.gitmodules': '[submodule "lib"]\n\tpath = lib\n\turl = https://github.com/lib/core.git\n',
    },
    expectedCommands: ['git submodule update --init --recursive', 'git status'],
    hints: [
      'Run `git submodule update --init --recursive`.',
      'Check status with `git status`.',
    ],
    solutionExplanation: 'Cloning parent repos does not download submodule files automatically unless `--recurse-submodules` was passed.',
    safeFailure: {
      mistakeTitle: 'Editing Submodule in Detached HEAD State',
      mistakeCommand: 'cd lib && echo "edit" > file.js && git commit -am "edit"',
      whatHappened: 'Created commits on detached HEAD in submodule; updates will overwrite them.',
      whatWasNotLost: 'Commits exist in submodule reflog.',
      recoveryCommand: 'git submodule update',
      recoveryExplanation: 'Always checkout a branch inside the submodule before making edits.',
    },
  },

  'c-submodules-vs-monorepo': {
    title: 'Inspect Monorepo Package Boundaries',
    objective: 'Examine package boundaries in a unified monorepo architecture versus submodules.',
    instructions: 'Inspect package directories and git status to observe single-repository atomic commits.',
    startingState: 'Monorepo workspace with `packages/ui` and `packages/api`.',
    goalState: 'Package directories inspected and status verified.',
    seedCommands: ['git init', 'mkdir -p packages/ui packages/api'],
    initialFiles: {
      'packages/ui/package.json': '{\n  "name": "@app/ui",\n  "version": "1.0.0"\n}\n',
      'packages/api/package.json': '{\n  "name": "@app/api",\n  "version": "1.0.0"\n}\n',
    },
    expectedCommands: ['ls packages', 'git status'],
    hints: [
      'List packages: `ls packages`.',
      'Check status: `git status`.',
    ],
    solutionExplanation: 'Monorepos allow single atomic commits across multiple packages, eliminating submodule version drift.',
    safeFailure: {
      mistakeTitle: 'Overusing Submodules for Internal Code',
      mistakeCommand: 'git status',
      whatHappened: 'Created multi-repo submodule overhead for closely coupled internal libraries.',
      whatWasNotLost: 'Workspaces in package managers simplify multi-package repos.',
      recoveryCommand: 'git status',
      recoveryExplanation: 'Use monorepo tools (npm/pnpm/Turborepo) when packages are developed together.',
    },
  },

  // =========================================================================
  // TOPIC 15: GitHub Workflow & Releases
  // =========================================================================
  'c-actions-intro': {
    title: 'Configure GitHub Actions CI Workflow',
    objective: 'Create a continuous integration workflow file in `.github/workflows/ci.yml` that runs automated tests.',
    instructions: 'Stage `.github/workflows/ci.yml` and commit with message `ci: configure automated test workflow`.',
    startingState: 'Workflow file drafted in `.github/workflows/ci.yml`.',
    goalState: 'CI workflow committed to repository.',
    seedCommands: ['git init', 'mkdir -p .github/workflows'],
    initialFiles: {
      '.github/workflows/ci.yml': 'name: CI\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Run tests\n        run: npm test\n',
    },
    expectedCommands: ['git add .github/workflows/ci.yml', 'git commit -m "ci: configure automated test workflow"'],
    hints: [
      'Stage the workflow file: `git add .github/workflows/ci.yml`.',
      'Commit with `git commit -m "ci: configure automated test workflow"`.',
    ],
    solutionExplanation: 'GitHub Actions automatically runs jobs defined in `.github/workflows/` on every push and pull request.',
    safeFailure: {
      mistakeTitle: 'Committing Syntax Errors in Workflow YAML',
      mistakeCommand: 'git commit -am "ci"',
      whatHappened: 'Workflow contains indentation errors that cause GitHub Actions parser to fail.',
      whatWasNotLost: 'Edit the file and amend the commit.',
      recoveryCommand: 'git status',
      recoveryExplanation: 'Validate YAML formatting and indentation before committing workflows.',
    },
  },

  'c-ci-cd-pipelines': {
    title: 'Structure Multi-Stage Build & Deploy Pipeline',
    objective: 'Configure multi-job deployment pipeline with build artifacts and environment gates.',
    instructions: 'Stage `.github/workflows/deploy.yml` and commit with conventional message.',
    startingState: 'Deployment workflow created in `.github/workflows/deploy.yml`.',
    goalState: 'Multi-stage pipeline committed.',
    seedCommands: ['git init', 'mkdir -p .github/workflows'],
    initialFiles: {
      '.github/workflows/deploy.yml': 'name: Deploy\non:\n  push:\n    branches: [main]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: echo "Building release"\n',
    },
    expectedCommands: ['git add .github/workflows/deploy.yml', 'git commit -m "ci(deploy): add automated production deployment pipeline"'],
    hints: [
      'Stage deploy workflow: `git add .github/workflows/deploy.yml`.',
      'Commit with message: `git commit -m "ci(deploy): add automated production deployment pipeline"`.',
    ],
    solutionExplanation: 'Separating build, test, and deploy into discrete jobs allows concurrent execution and gate checks.',
    safeFailure: {
      mistakeTitle: 'Deploying Untested Code to Production',
      mistakeCommand: 'git push origin main',
      whatHappened: 'Triggered production deploy without waiting for automated test suite to pass.',
      whatWasNotLost: 'Add `needs: test` dependency in workflow YAML.',
      recoveryCommand: 'git status',
      recoveryExplanation: 'Use job dependencies (`needs: [test]`) to ensure deployments only run if tests succeed.',
    },
  },

  'c-action-secrets': {
    title: 'Reference Encrypted Secrets in CI Workflows',
    objective: 'Ensure sensitive tokens are referenced via `${{ secrets.DEPLOY_KEY }}` instead of hardcoded strings.',
    instructions: 'Stage release workflow containing encrypted secrets reference and commit.',
    startingState: 'Workflow file using GitHub repository secrets context.',
    goalState: 'Secret-safe workflow committed.',
    seedCommands: ['git init', 'mkdir -p .github/workflows'],
    initialFiles: {
      '.github/workflows/release.yml': 'name: Release\njobs:\n  publish:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - env:\n          NPM_TOKEN: ${{ secrets.NPM_PUBLISH_TOKEN }}\n        run: echo "Publishing securely"\n',
    },
    expectedCommands: ['git add .github/workflows/release.yml', 'git commit -m "ci(security): reference encrypted release secret token"'],
    hints: [
      'Stage the workflow: `git add .github/workflows/release.yml`.',
      'Commit: `git commit -m "ci(security): reference encrypted release secret token"`.',
    ],
    solutionExplanation: 'Repository secrets are encrypted at rest and automatically masked in workflow logs.',
    safeFailure: {
      mistakeTitle: 'Printing Secret to Terminal Logs',
      mistakeCommand: 'run: echo "Token is $NPM_TOKEN"',
      whatHappened: 'Printed secret variable into public build execution log.',
      whatWasNotLost: 'Rotate compromised token immediately in GitHub Settings.',
      recoveryCommand: 'git status',
      recoveryExplanation: 'Never echo or print secret environment variables in CI/CD steps.',
    },
  },

  'c-releases-artifacts': {
    title: 'Publish Production Release Milestone',
    objective: 'Create an annotated release tag and verify distribution assets in the repository.',
    instructions: 'Create release tag `v1.0.0` with release notes and inspect tag list.',
    startingState: 'Compiled distribution bundle in `dist/bundle.js`.',
    goalState: 'Release tag v1.0.0 created and verified.',
    seedCommands: ['git init', 'mkdir -p dist', 'echo "bundle" > dist/bundle.js', 'git add dist', 'git commit -m "build: compile v1.0.0 release bundle"'],
    initialFiles: {
      'dist/bundle.js': 'console.log("Compiled CommitForge Academy Bundle v1.0.0");\n',
    },
    expectedCommands: ['git tag -a v1.0.0 -m "Production Release v1.0.0"', 'git tag -l'],
    hints: [
      'Tag with: `git tag -a v1.0.0 -m "Production Release v1.0.0"`.',
      'List tags: `git tag -l`.',
    ],
    solutionExplanation: 'GitHub Releases package git tags with downloadable binary assets, release notes, and contributor mentions.',
    safeFailure: {
      mistakeTitle: 'Publishing Debug Artifacts in Release Bundle',
      mistakeCommand: 'git tag v1.0.0',
      whatHappened: 'Tagged before production minification and security scans completed.',
      whatWasNotLost: 'Delete tag and rebuild.',
      recoveryCommand: 'git tag -d v1.0.0',
      recoveryExplanation: 'Verify production bundles with automated CI before tagging formal releases.',
    },
  },

  // =========================================================================
  // TOPIC 16: Advanced Git Topics
  // =========================================================================
  'c-git-reflog': {
    title: 'Emergency Commit Rescue with Reflog',
    objective: 'Use Git\'s safety journal (`git reflog`) to locate and rescue an accidentally deleted commit.',
    instructions: 'Run `git reflog` to identify the lost commit SHA, then create a branch `rescue` to restore it.',
    startingState: 'A hard reset (`git reset --hard HEAD~1`) accidentally discarded a crucial commit.',
    goalState: 'Lost commit rescued into a new branch named `rescue`.',
    seedCommands: [
      'git init',
      'echo "lost code" > important.txt',
      'git add important.txt',
      'git commit -m "feat: crucial feature before accident"',
      'git reset --hard HEAD~1',
    ],
    initialFiles: {
      'README.md': '# Project\n',
    },
    expectedCommands: ['git reflog', 'git branch rescue HEAD@{1}', 'git log rescue --oneline -n 1'],
    hints: [
      'Find the lost commit SHA in reflog: `git reflog`.',
      'Create a recovery branch pointing to it: `git branch rescue HEAD@{1}`.',
    ],
    solutionExplanation: 'The reflog records every update to HEAD. Even deleted commits remain in the object database for up to 30 days.',
    safeFailure: {
      mistakeTitle: 'Expiring Reflog Immediately',
      mistakeCommand: 'git reflog expire --expire=now --all',
      whatHappened: 'Purged all reflog entries, destroying the safety journal.',
      whatWasNotLost: 'Avoid running prune commands during emergencies.',
      recoveryCommand: 'git reflog',
      recoveryExplanation: 'Never run `reflog expire` when attempting to recover lost commits.',
    },
  },

  'c-git-bisect': {
    title: 'Binary Search Bug Hunting with Bisect',
    objective: 'Initiate a `git bisect` session, mark good and bad commits, and let Git binary search the regression.',
    instructions: 'Run `git bisect start`, mark current commit as `bad`, and mark `HEAD~2` as `good`.',
    startingState: 'Current HEAD has broken tests, but an older commit was known to be working.',
    goalState: 'Bisect session active and halfway commit checked out.',
    seedCommands: [
      'git init',
      'echo "good" > status.txt',
      'git add status.txt',
      'git commit -m "v1 working baseline"',
      'echo "ok" > status.txt',
      'git add status.txt',
      'git commit -m "v2 added features"',
      'echo "broken" > status.txt',
      'git add status.txt',
      'git commit -m "v3 regression introduced"',
    ],
    initialFiles: {
      'status.txt': 'broken: runtime exception\n',
    },
    expectedCommands: ['git bisect start', 'git bisect bad', 'git bisect good HEAD~2'],
    hints: [
      'Start bisect: `git bisect start`.',
      'Mark current state bad: `git bisect bad`.',
      'Mark working state good: `git bisect good HEAD~2`.',
    ],
    solutionExplanation: 'Git bisect uses binary search (O(log N)) to pinpoint the exact commit that introduced a bug in seconds.',
    safeFailure: {
      mistakeTitle: 'Leaving Repository in Bisect State',
      mistakeCommand: 'git status',
      whatHappened: 'Repository left in detached HEAD bisect state.',
      whatWasNotLost: 'Run reset to restore your original branch.',
      recoveryCommand: 'git bisect reset',
      recoveryExplanation: 'Always conclude bisect sessions with `git bisect reset` to return to your branch.',
    },
  },

  'c-git-worktree': {
    title: 'Manage Concurrent Branches with Worktree',
    objective: 'Mount a second active working directory with `git worktree add` to tackle an urgent fix in parallel.',
    instructions: 'Run `git worktree add ../hotfix-worktree -b hotfix/urgent` and inspect active worktrees.',
    startingState: 'On main working on long-running task when urgent hotfix is needed.',
    goalState: 'Parallel worktree directory created and listed in `git worktree list`.',
    seedCommands: ['git init', 'git commit --allow-empty -m "main baseline"'],
    initialFiles: {
      'index.html': '<h1>Main Application</h1>\n',
    },
    expectedCommands: ['git worktree add ../hotfix-worktree -b hotfix/urgent', 'git worktree list'],
    hints: [
      'Add parallel worktree: `git worktree add ../hotfix-worktree -b hotfix/urgent`.',
      'Inspect active trees: `git worktree list`.',
    ],
    solutionExplanation: 'Worktrees allow checking out multiple branches simultaneously into separate directories without stash switching.',
    safeFailure: {
      mistakeTitle: 'Checking Out Same Branch in Two Worktrees',
      mistakeCommand: 'git worktree add ../duplicate-tree main',
      whatHappened: 'Git rejected checkout: a branch cannot be checked out in multiple worktrees at once.',
      whatWasNotLost: 'Use a unique branch name with `-b <new-branch>`.',
      recoveryCommand: 'git worktree list',
      recoveryExplanation: 'Each worktree must checkout a distinct branch to prevent conflicting HEAD pointers.',
    },
  },

  'c-git-internals-dag': {
    title: 'Plumbing Object Database Forensics',
    objective: 'Inspect raw SHA-1 objects, directory trees, and blob payloads using `git cat-file`.',
    instructions: 'Run `git cat-file -t HEAD` to inspect object type, and `git cat-file -p HEAD` to view decompressed commit payload.',
    startingState: 'Repository with committed files in `.git/objects/`.',
    goalState: 'Object type and payload printed to terminal.',
    seedCommands: ['git init', 'echo "Hello Forensics" > test.txt', 'git add test.txt', 'git commit -m "feat: first forensic snapshot"'],
    initialFiles: {
      'test.txt': 'Hello Forensics: inspecting SHA-1 storage\n',
    },
    expectedCommands: ['git cat-file -t HEAD', 'git cat-file -p HEAD', 'git ls-tree HEAD'],
    hints: [
      'Check object type: `git cat-file -t HEAD`.',
      'Pretty-print payload: `git cat-file -p HEAD`.',
      'Inspect tree objects: `git ls-tree HEAD`.',
    ],
    solutionExplanation: 'Git is fundamentally a content-addressable key-value store mapping 40-character SHA-1 hashes to compressed objects.',
    safeFailure: {
      mistakeTitle: 'Manually Editing Files in .git/objects/',
      mistakeCommand: 'echo "corrupt" > .git/objects/12/3456...',
      whatHappened: 'Corrupted SHA-1 cryptographic checksum.',
      whatWasNotLost: 'Never edit `.git/objects/` directly; always use Git plumbing commands.',
      recoveryCommand: 'git fsck',
      recoveryExplanation: 'Run `git fsck` to verify database integrity and diagnose corrupted objects.',
    },
  },

  // =========================================================================
  // TOPIC 17: GitHub Developer Tools
  // =========================================================================
  'c-gh-cli': {
    title: 'Automate GitHub Operations via `gh` CLI',
    objective: 'Execute terminal-driven GitHub queries with GitHub CLI commands (`gh pr list`, `gh issue list`).',
    instructions: 'Run `gh pr list` and `gh issue list` to inspect remote collaboration items directly from your shell.',
    startingState: 'Local workspace connected to GitHub origin repository.',
    goalState: 'Pull requests and issues queried via command-line interface.',
    seedCommands: ['git init', 'git remote add origin https://github.com/developer/app.git'],
    initialFiles: {
      'README.md': '# CLI Automation Demo\n',
    },
    expectedCommands: ['gh pr list', 'gh issue list', 'gh repo view'],
    hints: [
      'List pull requests: `gh pr list`.',
      'List issues: `gh issue list`.',
    ],
    solutionExplanation: 'GitHub CLI (`gh`) brings pull requests, issues, releases, and actions directly into the developer terminal.',
    safeFailure: {
      mistakeTitle: 'Passing Plain-Text Tokens in Shell Arguments',
      mistakeCommand: 'gh auth login --with-token < secret.txt',
      whatHappened: 'Risk of leaking token into shell history file.',
      whatWasNotLost: 'Interactive login is encrypted and stores tokens in system keychain.',
      recoveryCommand: 'gh auth status',
      recoveryExplanation: 'Use `gh auth login` for interactive, secure credential storage.',
    },
  },

  'c-gh-api': {
    title: 'Query GitHub REST / GraphQL API',
    objective: 'Perform direct authenticated API queries with `gh api /user` to inspect account and permissions.',
    instructions: 'Run `gh api /user` to query your authenticated GitHub profile endpoints.',
    startingState: 'Authenticated GitHub CLI environment.',
    goalState: 'API response JSON retrieved.',
    seedCommands: ['git init', 'git remote add origin https://github.com/org/repo.git'],
    initialFiles: {
      'api.json': '{\n  "endpoint": "/user"\n}\n',
    },
    expectedCommands: ['gh api /user', 'gh api /repos/org/repo'],
    hints: [
      'Query user endpoint: `gh api /user`.',
      'Query repository endpoint: `gh api /repos/org/repo`.',
    ],
    solutionExplanation: 'The GitHub API allows scripting custom automation, webhooks, and repository audits.',
    safeFailure: {
      mistakeTitle: 'Exhausting Unauthenticated Rate Limits',
      mistakeCommand: 'curl https://api.github.com/users/dev',
      whatHappened: 'Unauthenticated requests are capped at 60 requests per hour.',
      whatWasNotLost: 'Authenticated requests allow 5,000 requests per hour.',
      recoveryCommand: 'gh api /rate_limit',
      recoveryExplanation: 'Always use authenticated requests via `gh api` to avoid hitting rate limits.',
    },
  },

  'c-codespaces': {
    title: 'Configure Cloud DevContainer Environment',
    objective: 'Create a `.devcontainer/devcontainer.json` configuration for instant cloud-based developer environments.',
    instructions: 'Stage `.devcontainer/devcontainer.json` and commit with message `chore: configure devcontainer environment`.',
    startingState: 'DevContainer configuration drafted in `.devcontainer/devcontainer.json`.',
    goalState: 'Configuration committed to version control.',
    seedCommands: ['git init', 'mkdir -p .devcontainer'],
    initialFiles: {
      '.devcontainer/devcontainer.json': '{\n  "name": "CommitForge Cloud Node",\n  "image": "mcr.microsoft.com/devcontainers/javascript-node:18",\n  "features": {\n    "ghcr.io/devcontainers/features/git:1": {}\n  }\n}\n',
    },
    expectedCommands: ['git add .devcontainer/devcontainer.json', 'git commit -m "chore: configure devcontainer environment"'],
    hints: [
      'Stage the devcontainer config: `git add .devcontainer/devcontainer.json`.',
      'Commit: `git commit -m "chore: configure devcontainer environment"`.',
    ],
    solutionExplanation: 'DevContainers define the exact OS, tools, extensions, and runtime settings needed to run your project anywhere.',
    safeFailure: {
      mistakeTitle: 'Hardcoding Personal Credentials in DevContainer Config',
      mistakeCommand: 'git add .devcontainer',
      whatHappened: 'Attempted to commit private API keys inside shared container settings.',
      whatWasNotLost: 'Secrets should be stored in GitHub Codespaces Secrets settings.',
      recoveryCommand: 'git status',
      recoveryExplanation: 'Use environment secrets instead of hardcoding tokens in devcontainer.json.',
    },
  },

  // =========================================================================
  // TOPIC 18: More GitHub Features
  // =========================================================================
  'c-gh-discussions': {
    title: 'Structure RFC Architecture Proposals',
    objective: 'Draft a Request for Comments (RFC) document for GitHub Discussions architecture reviews.',
    instructions: 'Stage `docs/rfc/001-caching.md` and commit with message `docs(rfc): propose caching architecture`.',
    startingState: 'Drafted architecture proposal in `docs/rfc/001-caching.md`.',
    goalState: 'RFC proposal committed and ready for discussion.',
    seedCommands: ['git init', 'mkdir -p docs/rfc'],
    initialFiles: {
      'docs/rfc/001-caching.md': '# RFC 001: Distributed Cache Architecture\n## Summary\nProposes Redis caching layer for sub-5ms response times.\n',
    },
    expectedCommands: ['git add docs/rfc/001-caching.md', 'git commit -m "docs(rfc): propose caching architecture"'],
    hints: [
      'Stage RFC: `git add docs/rfc/001-caching.md`.',
      'Commit with `docs(rfc):` conventional message.',
    ],
    solutionExplanation: 'GitHub Discussions separates open-ended architecture debates from actionable issue tracker bug backlogs.',
    safeFailure: {
      mistakeTitle: 'Clogging Bug Tracker with Open-Ended Debates',
      mistakeCommand: 'git status',
      whatHappened: 'Opened 20 subjective discussions in the issue tracker instead of GitHub Discussions.',
      whatWasNotLost: 'Convert issues to discussions in GitHub UI.',
      recoveryCommand: 'git status',
      recoveryExplanation: 'Keep issues strictly for actionable bugs and tasks; use Discussions for RFCs and brainstorming.',
    },
  },

  'c-gh-pages': {
    title: 'Deploy Static Documentation with GitHub Pages',
    objective: 'Structure `docs/index.html` documentation portal and commit for automated static hosting.',
    instructions: 'Stage `docs/index.html` and commit with message `docs: create GitHub Pages documentation portal`.',
    startingState: 'Documentation portal created in `docs/index.html`.',
    goalState: 'Pages portal committed.',
    seedCommands: ['git init', 'mkdir -p docs'],
    initialFiles: {
      'docs/index.html': '<!DOCTYPE html>\n<html>\n<head><title>CommitForge Docs</title></head>\n<body><h1>CommitForge Academy Docs</h1></body>\n</html>\n',
    },
    expectedCommands: ['git add docs/index.html', 'git commit -m "docs: create GitHub Pages documentation portal"'],
    hints: [
      'Stage documentation: `git add docs/index.html`.',
      'Commit: `git commit -m "docs: create GitHub Pages documentation portal"`.',
    ],
    solutionExplanation: 'GitHub Pages automatically serves static websites directly from the `docs/` folder or `gh-pages` branch.',
    safeFailure: {
      mistakeTitle: 'Publishing Server-Side Code to GitHub Pages',
      mistakeCommand: 'echo "app.listen(3000);" > docs/server.js',
      whatHappened: 'GitHub Pages is static-only and cannot execute Node.js, Python, or Ruby backends.',
      whatWasNotLost: 'Compile frontend assets to static HTML/CSS/JS.',
      recoveryCommand: 'git status',
      recoveryExplanation: 'GitHub Pages only hosts static client assets (HTML, CSS, JavaScript).',
    },
  },

  'c-gh-security': {
    title: 'Configure Automated Dependabot Security Scans',
    objective: 'Create `.github/dependabot.yml` configuration to automate daily npm dependency security scans.',
    instructions: 'Stage `.github/dependabot.yml` and commit with message `security: configure dependabot daily vulnerability scans`.',
    startingState: 'Dependabot configuration file drafted in `.github/dependabot.yml`.',
    goalState: 'Security automation configuration committed.',
    seedCommands: ['git init', 'mkdir -p .github'],
    initialFiles: {
      '.github/dependabot.yml': 'version: 2\nupdates:\n  - package-ecosystem: "npm"\n    directory: "/"\n    schedule:\n      interval: "daily"\n',
    },
    expectedCommands: ['git add .github/dependabot.yml', 'git commit -m "security: configure dependabot daily vulnerability scans"'],
    hints: [
      'Stage dependabot config: `git add .github/dependabot.yml`.',
      'Commit: `git commit -m "security: configure dependabot daily vulnerability scans"`.',
    ],
    solutionExplanation: 'Dependabot scans your dependencies daily and automatically opens pull requests to patch known CVE vulnerabilities.',
    safeFailure: {
      mistakeTitle: 'Ignoring Critical CVE Security Alerts',
      mistakeCommand: 'git status',
      whatHappened: 'Allowed known critical vulnerability to persist in production for 6 months.',
      whatWasNotLost: 'Dependabot PRs provide 1-click automated security updates.',
      recoveryCommand: 'git status',
      recoveryExplanation: 'Review and merge Dependabot security PRs promptly to keep dependencies safe.',
    },
  },
};
