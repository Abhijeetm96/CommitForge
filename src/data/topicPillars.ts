import { BENTO_CATEGORIES, BentoCategory, JourneyConcept } from './journeyModel';
import { COMMANDS_DOCS, CommandDoc } from './commandsRef';
import { CHAPTER_METAS, CURATED_CONCEPTS } from './chapterCurations';

export interface PillarDefinition {
  short: string;
  beginner: string;
  technical: string;
}

export interface PillarSyntaxToken {
  token: string;
  role: string;
  explanation: string;
}

export interface PillarSyntax {
  primary: string;
  structure: string;
  tokens: PillarSyntaxToken[];
}

export interface PillarVariation {
  syntax: string;
  title: string;
  whenToUse: string;
  watchOut?: string;
}

export interface PillarExample {
  title: string;
  code: string;
  explanation: string;
  output?: string;
}

export interface PillarExplanation {
  mentalModel: string;
  whatChanges: string;
  whatDoesNotChange: string;
  whyItMatters: string;
  proTip: string;
}

export interface TopicPillars {
  conceptId: string;
  conceptTitle: string;
  chapterId: string;
  chapterTitle: string;
  chapterEmoji: string;
  activeSubtopic?: string;
  subtopics: string[];
  definition: PillarDefinition;
  syntax: PillarSyntax;
  variations: PillarVariation[];
  examples: PillarExample[];
  explanation: PillarExplanation;
}

export interface ChapterPillars {
  chapterId: string;
  chapterNumber: string;
  chapterTitle: string;
  chapterEmoji: string;
  definition: PillarDefinition;
  syntax: PillarSyntax;
  variations: PillarVariation[];
  examples: PillarExample[];
  explanation: PillarExplanation;
  conceptCount: number;
}

// ============================================================================
// CHAPTER-LEVEL 5 PILLARS REGISTRY (12 CHAPTERS)
// ============================================================================
export const CHAPTER_PILLARS: Record<string, ChapterPillars> = {
  'cat-foundations': {
    chapterId: 'cat-foundations',
    chapterNumber: '01',
    chapterTitle: 'Foundations',
    chapterEmoji: '🏰',
    definition: {
      short: 'The core mental model, database structure, and identity configuration of Git.',
      beginner: 'Git is a Magic Time Machine Camera that takes unbreakable 3D snapshots of your project so you can travel back in time whenever you make a mistake.',
      technical: 'A content-addressable Directed Acyclic Graph (DAG) version control system that cryptographically tracks snapshot states across working directory, index, and commit objects.',
    },
    syntax: {
      primary: 'git <command> [options] [arguments]',
      structure: 'git <subcommand> [--flag] [<parameter>]',
      tokens: [
        { token: 'git', role: 'Executable', explanation: 'The Git command line program binary.' },
        { token: '<subcommand>', role: 'Action', explanation: 'e.g. init, config, status, add, commit' },
        { token: '[flags]', role: 'Options', explanation: 'Modifiers like --global, -m, -v' },
      ],
    },
    variations: [
      { syntax: 'git init', title: 'Initialize Repository', whenToUse: 'Turn an existing folder into a tracked Git repo.' },
      { syntax: 'git config --global user.name "Your Name"', title: 'Configure Identity', whenToUse: 'Set global author identity across all repositories.' },
      { syntax: 'git config --list', title: 'Inspect Configuration', whenToUse: 'View all active local and global configuration variables.' },
    ],
    examples: [
      {
        title: 'Complete Day 1 Project Setup',
        code: 'mkdir my-magic-app\ncd my-magic-app\ngit init\ngit config user.name "Alex Coder"\ngit config user.email "alex@code.dev"',
        explanation: 'Creates a project directory, initializes the hidden .git database, and stamps your developer identity.',
        output: 'Initialized empty Git repository in /home/developer/my-magic-app/.git/',
      },
    ],
    explanation: {
      mentalModel: 'Your project folder has two worlds: the visible files you edit on your desk, and the hidden .git time-capsule database storing your history.',
      whatChanges: 'Initializes `.git/` folder, creates `config`, `HEAD`, `objects/`, and `refs/` directory trees.',
      whatDoesNotChange: 'Existing files in your folder are untouched until you explicitly stage and commit them.',
      whyItMatters: 'Without version control, breaking mistakes cannot be rolled back and collaborating with others requires manual file copying.',
      proTip: 'Always verify your author email matches your GitHub account so commit contributions are properly attributed on your profile graph.',
    },
    conceptCount: 14,
  },

  'cat-inspect-save': {
    chapterId: 'cat-inspect-save',
    chapterNumber: '02',
    chapterTitle: 'Inspect & Save',
    chapterEmoji: '🔍',
    definition: {
      short: 'Inspecting differences, staging curated snapshots into the index, and committing milestones.',
      beginner: 'Checking your messy craft desk (status), choosing which drawings go into your backpack (staging), and snapping a permanent Polaroid photo (commit).',
      technical: 'Two-stage commit workflow: diffing the working tree against the index staging cache, and creating SHA-hashed commit objects linked to parent milestones.',
    },
    syntax: {
      primary: 'git status | git add <file> | git commit -m "<msg>"',
      structure: 'git status [-s] | git diff [--staged] | git add <path> | git commit -m "<msg>"',
      tokens: [
        { token: 'git status', role: 'Inspection', explanation: 'Reports differences across working tree, index, and HEAD.' },
        { token: 'git add', role: 'Staging', explanation: 'Stages file content from working tree into index buffer.' },
        { token: 'git commit', role: 'Snapshot', explanation: 'Bakes staged changes into an immutable commit object.' },
      ],
    },
    variations: [
      { syntax: 'git status -s', title: 'Short Status', whenToUse: 'Compact view showing staged (green) vs unstaged (red) status codes.' },
      { syntax: 'git diff', title: 'Unstaged Diff', whenToUse: 'Spot changes between working tree and staging index before adding.' },
      { syntax: 'git diff --staged', title: 'Staged Diff', whenToUse: 'Sanity check changes packed in the index before committing.' },
      { syntax: 'git commit --amend', title: 'Amend Last Commit', whenToUse: 'Fix typos in the most recent commit or add forgotten staged files.' },
    ],
    examples: [
      {
        title: 'Curated Atomic Commit Workflow',
        code: 'git status\ngit diff index.html\ngit add index.html\ngit diff --staged\ngit commit -m "feat(ui): add glowing hero banner"',
        explanation: 'Inspect changes on desk, pack only index.html into backpack, verify staged delta, and snap a permanent milestone photo.',
        output: '[main b4d92c1] feat(ui): add glowing hero banner\n 1 file changed, 14 insertions(+)',
      },
    ],
    explanation: {
      mentalModel: 'The staging area is a curation table. You never have to commit everything at once—you carefully craft clean, atomic story chapters.',
      whatChanges: '`git add` updates the index file and creates loose blob objects. `git commit` creates tree and commit objects and advances HEAD pointer.',
      whatDoesNotChange: 'Unstaged files on your desk remain unchanged on disk.',
      whyItMatters: 'Atomic commits make code reviews effortless and allow pinpoint bisecting when regressions occur.',
      proTip: 'Follow the 50/72 rule: 50-character imperative subject line, blank line, and 72-character wrapped body explanation.',
    },
    conceptCount: 12,
  },

  'cat-undo-recover': {
    chapterId: 'cat-undo-recover',
    chapterNumber: '03',
    chapterTitle: 'Undo & Recover',
    chapterEmoji: '🛟',
    definition: {
      short: 'Safely reverting changes, unstaging accidental files, and recovering lost commits via reflog.',
      beginner: 'The magical eraser and safety trampoline: wipe off desk scribbles, un-pack your backpack, or rewind the tape to rescue lost work.',
      technical: 'Non-destructive and destructive rollback operations across working directory (restore), index (restore --staged), and commit tree (revert, reset, reflog).',
    },
    syntax: {
      primary: 'git restore <file> | git revert <commit> | git reset [--soft|--mixed|--hard] <target>',
      structure: 'git restore [--staged] <path> | git reset [--mode] <commit> | git reflog',
      tokens: [
        { token: 'git restore', role: 'Clean Undo', explanation: 'Safely restores files in working directory or index.' },
        { token: 'git revert', role: 'Safe Reversal', explanation: 'Creates a brand new commit that inverts a past mistake commit.' },
        { token: 'git reflog', role: 'Safety Net', explanation: 'Journal of everywhere HEAD pointer has been in the last 90 days.' },
      ],
    },
    variations: [
      { syntax: 'git restore <file>', title: 'Discard Working Edits', whenToUse: 'Wipe away accidental edits in a file, restoring it to last commit.' },
      { syntax: 'git restore --staged <file>', title: 'Unstage from Index', whenToUse: 'Pull an accidental file (like .env) out of the staging backpack.' },
      { syntax: 'git revert HEAD', title: 'Revert Last Commit', whenToUse: 'Safely undo a bad commit on a shared branch without rewriting history.' },
      { syntax: 'git reset --soft HEAD~1', title: 'Undo Commit (Keep Staged)', whenToUse: 'Undo the last commit but keep all modified code staged in index.' },
      { syntax: 'git reset --hard HEAD~1', title: 'Destructive Reset', whenToUse: 'Wipe out the last commit, index, and working tree changes completely.' },
    ],
    examples: [
      {
        title: 'Rescuing Staged Secrets & Reverting Bad Code',
        code: 'git restore --staged .env\ngit revert 9c02d88\ngit status',
        explanation: 'Unstages private API keys from the backpack, then creates a clean counter-commit to neutralize a buggy commit.',
        output: '[main 4a12ec8] Revert "feat(combat): increase damage multiplier (BUGGY!)"\n 1 file changed, 1 deletion(-)',
      },
    ],
    explanation: {
      mentalModel: 'Git almost never truly deletes committed data. Commits are immortal for at least 90 days in the reflog trampoline.',
      whatChanges: '`restore` overwrites working tree with index; `reset` moves branch reference; `revert` appends an inverse commit.',
      whatDoesNotChange: 'Past commit objects remain immutable in `.git/objects/`.',
      whyItMatters: 'Developers can experiment fearlessly knowing that any breaking change can be cleanly undone.',
      proTip: 'Never run `git reset --hard` on public branches shared with teammates. Use `git revert` instead.',
    },
    conceptCount: 10,
  },

  'cat-branching': {
    chapterId: 'cat-branching',
    chapterNumber: '04',
    chapterTitle: 'Branching',
    chapterEmoji: '🌳',
    definition: {
      short: 'Parallel story paths and lightweight reference pointers for isolated feature development.',
      beginner: 'Choose-Your-Own-Adventure story paths that let you test wild ideas in parallel dimensions without breaking the main game.',
      technical: 'Lightweight, movable 41-byte text pointers referencing specific commit hashes in the DAG, navigated via HEAD symbolic ref.',
    },
    syntax: {
      primary: 'git branch <name> | git switch <name> | git checkout -b <name>',
      structure: 'git branch [-a|-d|-D] | git switch [-c] <branch-name>',
      tokens: [
        { token: 'git branch', role: 'Manager', explanation: 'Lists, creates, renames, or deletes branch reference pointers.' },
        { token: 'git switch', role: 'Navigation', explanation: 'Modern command to change the active checked-out branch.' },
        { token: '-c', role: 'Create Flag', explanation: 'Creates and immediately switches into the new branch.' },
      ],
    },
    variations: [
      { syntax: 'git branch', title: 'List Local Branches', whenToUse: 'View all branch pointers and see which one is active (*).' },
      { syntax: 'git switch -c feature/login', title: 'Create & Switch', whenToUse: 'Start working on a new isolated feature immediately.' },
      { syntax: 'git switch main', title: 'Switch Branch', whenToUse: 'Return to the main production branch.' },
      { syntax: 'git branch -d feature/login', title: 'Safe Delete Branch', whenToUse: 'Delete a merged feature branch you no longer need.' },
      { syntax: 'git branch -D feature/test', title: 'Force Delete Branch', whenToUse: 'Discard an unmerged experiment branch completely.' },
    ],
    examples: [
      {
        title: 'Feature Branch Workflow',
        code: 'git switch -c feature/dragon-shield\n# edit hero.ts\ngit add hero.ts\ngit commit -m "feat: add dragon shield with +50 HP"\ngit switch main',
        explanation: 'Branches off main into an isolated timeline, commits the new shield, and safely switches back to main.',
        output: "Switched to a new branch 'feature/dragon-shield'\nSwitched to branch 'main'",
      },
    ],
    explanation: {
      mentalModel: 'A branch is not a heavy container folder—it is simply a lightweight sticky note pointing to the newest commit in that story timeline.',
      whatChanges: 'Creates `.git/refs/heads/<name>`, updates `.git/HEAD` reference, updates working tree files on switch.',
      whatDoesNotChange: 'Files in other branches remain safely isolated in `.git/objects/`.',
      whyItMatters: 'Multiple engineers can work on disparate features at the same time without code conflicts or destabilizing main.',
      proTip: 'Use descriptive namespace prefixes: `feat/name`, `fix/issue-id`, `refactor/component`.',
    },
    conceptCount: 9,
  },

  'cat-merging': {
    chapterId: 'cat-merging',
    chapterNumber: '05',
    chapterTitle: 'Merging & Strategies',
    chapterEmoji: '🤝',
    definition: {
      short: 'Integrating divergent branch timelines via fast-forward, 3-way merges, and rebase linear history.',
      beginner: 'Superpower High-Five: combining your drawings with your friend\'s drawings into one master adventure, and solving the coloring mix-up puzzle if both drew in the same spot.',
      technical: 'Combining separate commit DAG lines through Fast-Forward pointers, 3-Way Common Ancestor synthesis, or Rebase commit replay.',
    },
    syntax: {
      primary: 'git merge <branch> | git rebase <base-branch>',
      structure: 'git merge [--no-ff|--squash|--abort] <branch> | git rebase [--continue|--abort] <upstream>',
      tokens: [
        { token: 'git merge', role: 'Integration', explanation: 'Merges named branch into active branch.' },
        { token: 'git rebase', role: 'Replay', explanation: 'Re-applies your commits on top of another base branch tip.' },
        { token: '--abort', role: 'Safety Exit', explanation: 'Cancels merge or rebase in progress and resets cleanly.' },
      ],
    },
    variations: [
      { syntax: 'git merge feature/auth', title: '3-Way / Fast-Forward Merge', whenToUse: 'Bring completed feature branch into main.' },
      { syntax: 'git merge --squash feature/wip', title: 'Squash Merge', whenToUse: 'Compress dozens of messy draft commits into 1 clean commit.' },
      { syntax: 'git rebase main', title: 'Rebase on Main', whenToUse: 'Update your feature branch with newest main commits for linear history.' },
      { syntax: 'git cherry-pick <sha>', title: 'Cherry Pick Commit', whenToUse: 'Surgically copy a single specific commit from another branch.' },
    ],
    examples: [
      {
        title: '3-Way Branch Merge & Verification',
        code: 'git switch main\ngit merge feature/dessert-menu\ngit log --oneline --graph -n 3',
        explanation: 'Switches to main, executes 3-way merge integrating Luigi dessert menu, and verifies the new merge commit.',
        output: "Merge made by the 'ort' strategy.\n dessert.txt | 1 +\n 1 file changed, 1 insertion(+)",
      },
    ],
    explanation: {
      mentalModel: 'Merging joins two parallel rivers into one. A merge conflict is not an error—it is Git politely pausing to ask the human developer which code to keep.',
      whatChanges: 'Creates a Merge Commit with 2 parents, updates active branch pointer to new merge commit hash.',
      whatDoesNotChange: 'The merged feature branch commits remain intact in history.',
      whyItMatters: 'Enables teams to integrate hundreds of independent features into a unified product release.',
      proTip: 'Always pull the latest `main` and test locally before initiating your merge or pull request.',
    },
    conceptCount: 9,
  },

  'cat-remote-git': {
    chapterId: 'cat-remote-git',
    chapterNumber: '06',
    chapterTitle: 'Remote Git',
    chapterEmoji: '📡',
    definition: {
      short: 'Connecting local repos to shared remote servers (origin), syncing with fetch/pull, and publishing with push.',
      beginner: 'The Cloud Teleporter: beaming your game save points up to the Cloud Castle in the sky and parachuting updates down to your desk.',
      technical: 'Tracking remote repositories via named URL aliases (`origin`), maintaining remote tracking refs (`refs/remotes/origin/*`), and network sync.',
    },
    syntax: {
      primary: 'git remote -v | git fetch origin | git pull origin <branch> | git push -u origin <branch>',
      structure: 'git remote [add|set-url|prune] <name> <url> | git push [-u|--force-with-lease] <remote> <branch>',
      tokens: [
        { token: 'git remote', role: 'Network Alias', explanation: 'Manages tracked remote repository URLs.' },
        { token: 'git fetch', role: 'Safe Download', explanation: 'Downloads new commits from remote without modifying local working files.' },
        { token: 'git pull', role: 'Fetch + Merge', explanation: 'Downloads remote changes and immediately merges them into active branch.' },
        { token: 'git push', role: 'Upload', explanation: 'Uploads local commits to remote branch reference.' },
      ],
    },
    variations: [
      { syntax: 'git remote -v', title: 'List Remotes', whenToUse: 'Check fetch and push URLs linked to your local repository.' },
      { syntax: 'git remote add origin <url>', title: 'Link Remote', whenToUse: 'Connect a fresh local repo to a new GitHub repo.' },
      { syntax: 'git push -u origin main', title: 'Push & Set Upstream', whenToUse: 'First push to set default tracking branch for future `git push`.' },
      { syntax: 'git fetch --prune', title: 'Prune Stale Remote Refs', whenToUse: 'Clean up local references to branches deleted on GitHub.' },
    ],
    examples: [
      {
        title: 'Syncing Local Work with Cloud Remote',
        code: 'git remote -v\ngit fetch origin\ngit log HEAD..origin/main --oneline\ngit pull origin main\ngit push origin main',
        explanation: 'Inspects remotes, checks incoming cloud commits safely, pulls them down, and pushes local commits.',
        output: 'origin  https://github.com/coder-kid/space-adventure.git (fetch)\nTo https://github.com/coder-kid/space-adventure.git\n   rem0011..rem0022  main -> main',
      },
    ],
    explanation: {
      mentalModel: 'Your local Git repo is 100% complete and self-sufficient. The remote server is simply another clone living on a computer in the cloud.',
      whatChanges: 'Updates `refs/remotes/origin/*`, advances local tracking branches, syncs object database over HTTPS/SSH.',
      whatDoesNotChange: '`git fetch` never touches your working tree or active uncommitted edits.',
      whyItMatters: 'Decentralized backups ensure you never lose work even if your laptop is destroyed or stolen.',
      proTip: 'Prefer `git fetch` followed by inspection over blind `git pull` in production environments.',
    },
    conceptCount: 9,
  },

  'cat-github': {
    chapterId: 'cat-github',
    chapterNumber: '07',
    chapterTitle: 'GitHub Essentials & Profile',
    chapterEmoji: '🌍',
    definition: {
      short: 'The cloud hosting platform, SSH/HTTPS security keys, public galleries, and developer profiles.',
      beginner: 'The Global Clubhouse: the giant international showcase where millions of young creators display their games and exchange badges.',
      technical: 'Cloud-hosted Git forge providing repository hosting, public key cryptography authentication (SSH/GPG), and profile social graphing.',
    },
    syntax: {
      primary: 'ssh -T git@github.com | git clone <repo-url>',
      structure: 'ssh-keygen -t ed25519 -C "<email>" | git clone [--depth 1] <url>',
      tokens: [
        { token: 'git clone', role: 'Copy Repo', explanation: 'Downloads a complete remote repository and historical database to your computer.' },
        { token: 'ssh -T', role: 'Authenticate', explanation: 'Tests public key cryptographic connection to GitHub servers.' },
      ],
    },
    variations: [
      { syntax: 'git clone https://github.com/user/repo.git', title: 'HTTPS Clone', whenToUse: 'Quick download using browser login or Personal Access Token.' },
      { syntax: 'git clone git@github.com:user/repo.git', title: 'SSH Clone', whenToUse: 'Secure passwordless authentication using Ed25519 keys.' },
      { syntax: 'git clone --depth 1 <url>', title: 'Shallow Clone', whenToUse: 'Fast download fetching only the latest commit to save disk space.' },
    ],
    examples: [
      {
        title: 'Authenticating & Cloning an Open Source Project',
        code: 'ssh -T git@github.com\ngit clone git@github.com:coder-kid/starquest.git\ncd starquest\nls -la',
        explanation: 'Verifies SSH authentication with GitHub, clones the full repository, and navigates into project folder.',
        output: 'Hi coder-kid! You have successfully authenticated, but GitHub does not provide shell access.\nCloning into \'starquest\'...\nReceiving objects: 100%',
      },
    ],
    explanation: {
      mentalModel: 'Git is the engine in the car; GitHub is the global highway and parking clubhouse connecting all cars together.',
      whatChanges: 'Stores repository clones on GitHub servers, registers SSH keys in `~/.ssh/`, and creates local working directories.',
      whatDoesNotChange: 'Local Git syntax and CLI commands remain identical whether using GitHub, GitLab, or local drives.',
      whyItMatters: 'GitHub is the de-facto resume and collaboration hub for software developers globally.',
      proTip: 'Use modern `ed25519` SSH keys instead of legacy `rsa` keys for higher security and faster encryption handshakes.',
    },
    conceptCount: 11,
  },

  'cat-collaboration': {
    chapterId: 'cat-collaboration',
    chapterNumber: '08',
    chapterTitle: 'Collaboration, PRs & Projects',
    chapterEmoji: '👥',
    definition: {
      short: 'Team workflows, Pull Requests, Code Reviews, branch protection rules, and CODEOWNERS.',
      beginner: 'Team Quests: asking the team captain to review your drawing (Pull Request) before it gets stamped into the official comic book.',
      technical: 'Code review gating via Pull Requests, peer diff annotations, automated branch protection rulesets, and code ownership enforcement.',
    },
    syntax: {
      primary: 'gh pr create | gh pr checkout <number> | git push origin <branch>',
      structure: 'gh pr [create|review|merge|status] [--flags]',
      tokens: [
        { token: 'Pull Request', role: 'Proposal', explanation: 'A formal request to merge commits from your branch into another branch.' },
        { token: 'Code Review', role: 'Inspection', explanation: 'Peers reviewing your line diffs, asking questions, and approving changes.' },
        { token: 'CODEOWNERS', role: 'Policy', explanation: 'File defining which teammates must approve changes to specific paths.' },
      ],
    },
    variations: [
      { syntax: 'gh pr create --web', title: 'Create PR via Browser', whenToUse: 'Open GitHub UI to write title, checklist, and assign reviewers.' },
      { syntax: 'gh pr review --approve', title: 'Approve PR', whenToUse: 'Give your teammate the thumbs-up to merge their code.' },
      { syntax: 'gh pr checkout 42', title: 'Checkout Teammate PR', whenToUse: 'Pull a teammate\'s branch locally to run and test it on your machine.' },
    ],
    examples: [
      {
        title: 'Opening a Pull Request with Checklist',
        code: 'git switch -c feat/neon-shield\n# write code & commit\ngit push -u origin feat/neon-shield\ngh pr create --title "feat: add neon shield" --body "Tested on local canvas."',
        explanation: 'Pushes feature branch to GitHub and opens a collaborative Pull Request for team review.',
        output: 'https://github.com/teamcraft/project/pull/104\nCreated Pull Request #104',
      },
    ],
    explanation: {
      mentalModel: 'No one pushes directly to production. Everyone submits a Pull Request so teammates can check for bugs and celebrate accomplishments together.',
      whatChanges: 'Creates PR record on GitHub, sends review notifications, runs automated CI check suites.',
      whatDoesNotChange: 'The base `main` branch remains untouched until the PR is explicitly approved and merged.',
      whyItMatters: 'Code review catches bugs early, shares knowledge across the team, and enforces engineering consistency.',
      proTip: 'Use Draft PRs (`Draft: ...`) early in development to get architecture feedback before writing tests.',
    },
    conceptCount: 12,
  },

  'cat-advanced-git': {
    chapterId: 'cat-advanced-git',
    chapterNumber: '09',
    chapterTitle: 'Advanced Git & History Rewriting',
    chapterEmoji: '⚡',
    definition: {
      short: 'Interactive rebasing, stashing in-progress work, semantic release tagging, and bisect debugging.',
      beginner: 'The Master Crafter\'s secret pocket (Stash) for unfinished toys and time-wand (Interactive Rebase) to polish rough drafts into diamonds.',
      technical: 'Interactive history rewriting (`rebase -i`), index dirty tree suspension (`stash`), cryptographic tag creation (`tag -a`), and binary search bug hunting (`bisect`).',
    },
    syntax: {
      primary: 'git stash [pop] | git rebase -i HEAD~<n> | git tag -a <tag> -m "<msg>" | git bisect [start|bad|good]',
      structure: 'git stash [push|pop|list|drop] | git rebase -i <upstream> | git tag -a <name> -m "<msg>"',
      tokens: [
        { token: 'git stash', role: 'Temporary Drawer', explanation: 'Shelves uncommitted changes so you can work on a clean workspace.' },
        { token: 'git rebase -i', role: 'History Editor', explanation: 'Opens interactive editor to squash, reorder, or reword commits.' },
        { token: 'git tag', role: 'Milestone Marker', explanation: 'Creates permanent milestone tags like v1.0.0.' },
        { token: 'git bisect', role: 'Bug Hunter', explanation: 'Performs binary search across history to find the exact commit that broke code.' },
      ],
    },
    variations: [
      { syntax: 'git stash', title: 'Stash Dirty Tree', whenToUse: 'Quickly clear your desk to switch branches without committing unfinished work.' },
      { syntax: 'git stash pop', title: 'Restore Stashed Work', whenToUse: 'Pull your suspended work back onto your desk and resume coding.' },
      { syntax: 'git rebase -i HEAD~3', title: 'Interactive Rebase 3 Commits', whenToUse: 'Squash ugly "fix typo" commits into 1 clean atomic commit before PR.' },
      { syntax: 'git tag -a v1.0.0 -m "Release v1.0.0"', title: 'Annotated Release Tag', whenToUse: 'Mark a production release version.' },
    ],
    examples: [
      {
        title: 'Squashing Commits with Interactive Rebase',
        code: 'git stash list\ngit rebase -i HEAD~3\n# mark commits 2 and 3 as squash (s)\ngit tag -a v1.0.0 -m "Release v1.0.0"\ngit push origin --tags',
        explanation: 'Inspects stashed work, polishes the last 3 draft commits into one clean release commit, and stamps tag v1.0.0.',
        output: 'Successfully rebased and updated refs/heads/main.\n * [new tag] v1.0.0 -> v1.0.0',
      },
    ],
    explanation: {
      mentalModel: 'Drafts are messy while coding. Interactive rebase lets you edit your historical comic book so your final work looks like pure genius.',
      whatChanges: 'Recreates commit objects with new parent hashes, moves branch pointers, creates tag references in `.git/refs/tags/`.',
      whatDoesNotChange: 'Original commits remain in Git database until garbage collection cleans orphaned nodes.',
      whyItMatters: 'Maintains clean, readable production commit history for team audits and changelogs.',
      proTip: 'Golden Rule of Rebase: Never rebase commits that have already been pushed to a shared public branch.',
    },
    conceptCount: 12,
  },

  'cat-git-engineering': {
    chapterId: 'cat-git-engineering',
    chapterNumber: '10',
    chapterTitle: 'Git Engineering & Hooks',
    chapterEmoji: '⚙️',
    definition: {
      short: 'Automated client-side hooks, commitlint standards, plumbing vs porcelain, and Git object internals.',
      beginner: 'Castle Guard Robots standing at the gate: checking that your code is tidy and passwords are safe before letting you commit.',
      technical: 'Lifecycle hook execution (pre-commit, commit-msg, pre-push), Conventional Commits linting, and low-level object database plumbing (blobs, trees, commits).',
    },
    syntax: {
      primary: 'sh .git/hooks/pre-commit | git cat-file -p <sha> | git rev-parse HEAD',
      structure: '.git/hooks/<hook-name> | git cat-file [-p|-t] <object-hash>',
      tokens: [
        { token: 'pre-commit', role: 'Gatekeeper Hook', explanation: 'Shell script executed automatically before git commit finalizes.' },
        { token: 'git cat-file', role: 'Plumbing Inspector', explanation: 'Pretty-prints the raw contents of any blob, tree, or commit object.' },
        { token: 'Husky', role: 'Hook Manager', explanation: 'Modern Node.js tool to share Git hooks across team members via npm.' },
      ],
    },
    variations: [
      { syntax: '.git/hooks/pre-commit', title: 'Pre-Commit Hook', whenToUse: 'Run linter, type-checker, and secrets scanner before committing.' },
      { syntax: '.git/hooks/commit-msg', title: 'Commit Message Hook', whenToUse: 'Enforce Conventional Commits (feat:, fix:, chore:).' },
      { syntax: 'git cat-file -p HEAD', title: 'Inspect Commit Object', whenToUse: 'View raw tree hash, parent hash, author, and commit message.' },
      { syntax: 'git count-objects -v', title: 'Database Statistics', whenToUse: 'View count and disk size of loose objects vs packed packs.' },
    ],
    examples: [
      {
        title: 'Inspecting Git Database Internals & Hook Validation',
        code: 'git cat-file -p HEAD\ngit cat-file -t HEAD\ngit config alias.st status\ngit st',
        explanation: 'Inspects raw commit object metadata, checks object type, defines a handy alias, and runs it.',
        output: 'tree blob_eng_1\nauthor Dev Engineer <engineer@commitforge.dev>\nfeat: initialize core engineering platform\ncommit\nOn branch main',
      },
    ],
    explanation: {
      mentalModel: 'Under the hood, Git is simply a key-value database where the key is the SHA-1 hash of the file content, and the value is the compressed data.',
      whatChanges: 'Executes scripts in `.git/hooks/`, rejects commits with non-zero exit codes, queries raw objects in `.git/objects/`.',
      whatDoesNotChange: 'Hooks only run locally on client machines unless configured as server-side pre-receive hooks.',
      whyItMatters: 'Automated hooks eliminate human error by preventing syntax errors, unformatted code, and secret leaks before commits occur.',
      proTip: 'Use `lint-staged` with Husky so hooks only lint files staged in the index, keeping your commit speed instantaneous.',
    },
    conceptCount: 10,
  },

  'cat-github-automation': {
    chapterId: 'cat-github-automation',
    chapterNumber: '11',
    chapterTitle: 'GitHub Automation & Actions',
    chapterEmoji: '🤖',
    definition: {
      short: 'Continuous Integration & Continuous Deployment (CI/CD), YAML workflows, matrix runners, and secrets.',
      beginner: 'The Robotic Assembly Line: friendly robot helpers that wake up when you push code, run your tests, and build your game automatically.',
      technical: 'Event-driven workflow automation executed on cloud virtual machine runners (Ubuntu, macOS, Windows) configured via YAML in `.github/workflows/`.',
    },
    syntax: {
      primary: 'name: CI\non: [push, pull_request]\njobs:\n  build:\n    runs-on: ubuntu-latest',
      structure: 'on: <events> -> jobs: <job_id> -> steps: uses: <action> | run: <command>',
      tokens: [
        { token: 'on:', role: 'Event Trigger', explanation: 'Defines when workflow executes (e.g. push to main, pull_request, schedule cron).' },
        { token: 'runs-on:', role: 'Runner VM', explanation: 'Specifies host OS virtual machine (ubuntu-latest, macos-latest, windows-latest).' },
        { token: 'steps:', role: 'Task Sequence', explanation: 'Sequential commands or pre-built marketplace actions to execute.' },
      ],
    },
    variations: [
      { syntax: 'on: [push, pull_request]', title: 'Branch Triggers', whenToUse: 'Run test suite on every push and PR.' },
      { syntax: 'strategy: matrix: node: [18, 20]', title: 'Matrix Testing', whenToUse: 'Test code simultaneously across multiple versions of Node or OS.' },
      { syntax: 'secrets.NPM_TOKEN', title: 'Repository Secrets', whenToUse: 'Safely inject encrypted credentials and API keys without committing them.' },
    ],
    examples: [
      {
        title: 'Standard Automated Test & Build Workflow',
        code: 'name: Test & Build\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with: { node-version: 20 }\n      - run: npm ci\n      - run: npm test',
        explanation: 'Spins up clean Ubuntu VM, checks out repo, installs dependencies, and runs tests on every push.',
        output: '✓ Checkout Code (1s)\n✓ Setup Node.js 20 (2s)\n✓ npm ci (4s)\n✓ npm test: 92 passed (1s)',
      },
    ],
    explanation: {
      mentalModel: 'A personal robot butler for your code. You never have to manually run tests on 5 different computers—GitHub Actions runs them all in parallel in seconds.',
      whatChanges: 'Executes jobs in ephemeral cloud containers, posts pass/fail status checks on Pull Requests, deploys build artifacts.',
      whatDoesNotChange: 'Repository source code is not modified unless an action explicitly pushes a commit.',
      whyItMatters: 'Guarantees that broken code can never be merged into production without passing automated verification.',
      proTip: 'Always use dependency caching (`cache: "npm"`) in setup-node to cut workflow execution times by over 50%.',
    },
    conceptCount: 10,
  },

  'cat-github-engineering': {
    chapterId: 'cat-github-engineering',
    chapterNumber: '12',
    chapterTitle: 'GitHub Developer Tools & Ecosystem',
    chapterEmoji: '🚀',
    definition: {
      short: 'GitHub CLI (gh), cloud Codespaces, Dependabot security scanning, static website deployment, and APIs.',
      beginner: 'The Developer Super-Suit: an Ironman utility belt packed with cloud coding pods, automatic security shields, and terminal superpowers.',
      technical: 'Developer toolchain integration through GitHub CLI, cloud devcontainer environments, automated security vulnerability scanning, and REST/GraphQL APIs.',
    },
    syntax: {
      primary: 'gh auth login | gh repo clone <repo> | gh pr create | gh issue list',
      structure: 'gh <command> <subcommand> [flags]',
      tokens: [
        { token: 'gh', role: 'GitHub CLI', explanation: 'Official command-line tool to manage GitHub directly from your terminal.' },
        { token: 'Codespaces', role: 'Cloud Dev', explanation: 'Instant, fully-configured developer environment in the cloud accessible from any browser.' },
        { token: 'Dependabot', role: 'Security Bot', explanation: 'Automated bot that monitors dependencies and opens PRs for security patches.' },
      ],
    },
    variations: [
      { syntax: 'gh pr create --web', title: 'Open PR in Browser', whenToUse: 'Quickly open web browser to write PR description.' },
      { syntax: 'gh issue list', title: 'View Project Issues', whenToUse: 'Check open bug tickets and tasks without leaving your terminal.' },
      { syntax: 'gh api user', title: 'Query GitHub REST API', whenToUse: 'Retrieve account metadata and repository statistics programmatically.' },
    ],
    examples: [
      {
        title: 'Full Terminal GitHub Developer Flow',
        code: 'gh auth status\ngh repo clone coder-kid/space-adventure\ncd space-adventure\ngh pr list\ngh issue create --title "Add shield particle effect" --body "Enhancement request."',
        explanation: 'Checks authentication, clones repository via CLI, checks active pull requests, and opens a new issue ticket.',
        output: 'Logged in to github.com as coder-kid\n✓ Created issue #25 (https://github.com/coder-kid/space-adventure/issues/25)',
      },
    ],
    explanation: {
      mentalModel: 'Modern software engineering is more than just Git commands—it is an interconnected cloud ecosystem of developer utilities that automate tedious chores.',
      whatChanges: 'Interacts with GitHub REST/GraphQL APIs, triggers webhooks, launches cloud VMs, and publishes releases.',
      whatDoesNotChange: 'Local Git repositories remain standard and compatible with any tool.',
      whyItMatters: 'Boosts developer velocity by 3x by keeping you in flow in the terminal without context-switching to browser tabs.',
      proTip: 'Configure `.devcontainer/devcontainer.json` so any team member can launch a 100% configured development environment in 1 click.',
    },
    conceptCount: 13,
  },
};

// ============================================================================
// CONCEPT & SUBTOPIC LEVEL 5 PILLARS RESOLVER
// Resolves Definition, Syntax, Variations, Examples, and Explanation for ANY concept
// ============================================================================
export const getTopicPillars = (
  conceptId: string,
  subtopicTitle?: string
): TopicPillars => {
  // 1. Locate concept and category in journeyModel
  let foundCategory: BentoCategory = BENTO_CATEGORIES[0];
  let foundConcept: JourneyConcept = BENTO_CATEGORIES[0].concepts[0];

  for (const cat of BENTO_CATEGORIES) {
    const c = cat.concepts.find((item) => item.id === conceptId);
    if (c) {
      foundCategory = cat;
      foundConcept = c;
      break;
    }
  }

  const chapterMeta = CHAPTER_METAS[foundCategory.id] || CHAPTER_METAS['cat-foundations'];
  const chapterPillar = CHAPTER_PILLARS[foundCategory.id] || CHAPTER_PILLARS['cat-foundations'];
  const curatedConcept = CURATED_CONCEPTS[conceptId];

  // 2. Identify primary command and match against commandsRef
  const primaryCmd = (foundConcept.commands && foundConcept.commands[0])
    ? foundConcept.commands[0].trim()
    : chapterMeta.defaultExpectedCommand;
  const cleanCmd = primaryCmd.startsWith('git') || primaryCmd.startsWith('gh') || primaryCmd === 'pwd' || primaryCmd === 'ls'
    ? primaryCmd
    : `git ${primaryCmd}`;

  // Try to find matching command documentation
  const matchedDoc: CommandDoc | undefined = COMMANDS_DOCS.find(
    (d) => d.command === cleanCmd || cleanCmd.startsWith(d.command) || d.command.startsWith(cleanCmd)
  );

  // Subtopics list
  const subtopicsList = (foundConcept.subtopics && foundConcept.subtopics.length > 0)
    ? foundConcept.subtopics
    : [
        `Mental model of ${foundConcept.title}`,
        `Command execution and options`,
        `Verification and best practices`,
      ];

  const activeSub = subtopicTitle || subtopicsList[0];

  // 3. Synthesize Definition (Short, Beginner, Technical)
  const definition: PillarDefinition = {
    short: matchedDoc?.oneLineDefinition || foundConcept.description,
    beginner: matchedDoc?.beginnerDefinition || curatedConcept?.kidAnalogy || chapterMeta.kidMetaphor,
    technical: matchedDoc?.technicalDefinition || `${foundConcept.title} provides ${foundConcept.description} within the Git content-addressable DAG architecture.`,
  };

  // If subtopic is specified, tailor the definition to that subtopic
  if (subtopicTitle) {
    definition.short = `${subtopicTitle}: ${foundConcept.description}`;
    definition.beginner = `In our story of ${chapterMeta.themeTitle}, ${subtopicTitle} explains how: ${chapterMeta.kidStory}`;
  }

  // 4. Synthesize Syntax (Primary, Structure, Tokens)
  const tokens: PillarSyntaxToken[] = curatedConcept?.syntaxBreakdown || (
    cleanCmd.startsWith('git')
      ? [
          { token: 'git', role: 'Core CLI', explanation: 'Invokes the Git version control executable binary.' },
          { token: cleanCmd.split(' ')[1] || 'status', role: 'Subcommand', explanation: `Executes the ${foundConcept.title} action.` },
        ]
      : [{ token: cleanCmd, role: 'CLI Utility', explanation: `Utility for ${foundConcept.title}.` }]
  );

  const syntax: PillarSyntax = {
    primary: matchedDoc?.syntax || cleanCmd,
    structure: matchedDoc?.syntax ? matchedDoc.syntax : `${cleanCmd} [flags] [arguments]`,
    tokens,
  };

  // 5. Synthesize Variations
  const variations: PillarVariation[] = [];

  if (matchedDoc?.syntaxVariants && matchedDoc.syntaxVariants.length > 0) {
    matchedDoc.syntaxVariants.forEach((v) => {
      variations.push({
        syntax: v.syntax,
        title: v.description,
        whenToUse: v.whenToUse,
      });
    });
  } else if (curatedConcept?.variations && curatedConcept.variations.length > 0) {
    curatedConcept.variations.forEach((v) => variations.push(v));
  } else if (foundConcept.commands && foundConcept.commands.length > 1) {
    foundConcept.commands.forEach((c, idx) => {
      variations.push({
        syntax: c,
        title: `Variant ${idx + 1}`,
        whenToUse: `Use when applying ${c} in your workflow.`,
      });
    });
  } else {
    variations.push(
      { syntax: cleanCmd, title: 'Standard Invocation', whenToUse: 'Common standard invocation for this workflow.' },
      { syntax: `${cleanCmd} --help`, title: 'Manual & Documentation', whenToUse: 'Open built-in manual documentation.' }
    );
  }

  // 6. Synthesize Examples
  const examples: PillarExample[] = [
    {
      title: `Standard ${foundConcept.title} Example`,
      code: matchedDoc?.example || `${cleanCmd}`,
      explanation: `Demonstrates applying ${foundConcept.title} in a realistic developer repository.`,
      output: `Executed ${cleanCmd} successfully.`,
    },
    {
      title: `Subtopic Focus: ${activeSub}`,
      code: `${cleanCmd} --help || ${cleanCmd}`,
      explanation: `Applies the principles of ${activeSub} to verify repository state.`,
      output: `State verified against ${foundConcept.title}.`,
    },
  ];

  // 7. Synthesize Explanation (Mental Model, What Changes, What Stays Safe, Why It Matters, Pro Tip)
  const explanation: PillarExplanation = {
    mentalModel: chapterMeta.kidStory,
    whatChanges: matchedDoc?.whatChanges || `Modifies or queries repository state related to ${foundConcept.title}.`,
    whatDoesNotChange: matchedDoc?.whatDoesNotChange || `Uncommitted work or unrelated branch histories remain completely protected.`,
    whyItMatters: foundConcept.keyIdea || `${foundConcept.title} ensures deterministic version tracking and prevents regressions.`,
    proTip: chapterMeta.proTip,
  };

  return {
    conceptId: foundConcept.id,
    conceptTitle: foundConcept.title,
    chapterId: foundCategory.id,
    chapterTitle: foundCategory.title,
    chapterEmoji: chapterMeta.emoji,
    activeSubtopic: activeSub,
    subtopics: subtopicsList,
    definition,
    syntax,
    variations,
    examples,
    explanation,
  };
};

export const getChapterPillars = (chapterId: string): ChapterPillars => {
  return CHAPTER_PILLARS[chapterId] || CHAPTER_PILLARS['cat-foundations'];
};
