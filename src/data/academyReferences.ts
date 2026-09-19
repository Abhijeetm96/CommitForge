export interface ConceptReferenceOption {
  flag: string;
  description: string;
}

export interface ConceptReferenceInternal {
  objectType: string;
  explanation: string;
  storageLocation: string;
}

export interface ConceptReferenceCommonError {
  error: string;
  remedy: string;
}

export interface ConceptReferenceSupplement {
  synopsis?: string;
  officialDocUrl?: string;
  syntaxCheatSheet?: string[];
  options?: ConceptReferenceOption[];
  gitInternals?: ConceptReferenceInternal;
  commonErrors?: ConceptReferenceCommonError[];
  edgeCases?: string[];
}

export const ALL_CONCEPT_REFERENCES: Record<string, ConceptReferenceSupplement> = {
  // =========================================================================
  // TOPIC 01: Learn the Basics (Needs DocUrl, SyntaxCheatSheet, CommonErrors)
  // =========================================================================
  'c-what-is-vcs': {
    officialDocUrl: 'https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control',
    syntaxCheatSheet: [
      'git --version : Verify local Git binary installation',
      'git help <command> : Display the full manual page for any command',
      'git config --list --show-origin : View active configuration scopes',
    ],
    commonErrors: [
      { error: 'git: command not found', remedy: 'Install Git via brew, apt, or git-scm.com installer and ensure binary is on system PATH.' },
      { error: 'fatal: not a git repository (or any of the parent directories)', remedy: 'Run `git init` or cd into a directory containing a `.git/` folder.' },
    ],
  },

  'c-why-use-vcs': {
    officialDocUrl: 'https://git-scm.com/book/en/v2/Getting-Started-Git-Basics',
    syntaxCheatSheet: [
      'git log --stat : View file change metrics and commit lineage',
      'git diff HEAD~1 HEAD : Inspect full diff between two historical points',
      'git checkout <hash> -- <file> : Restore an exact snapshot of an individual file',
    ],
    commonErrors: [
      { error: 'Overwriting teammates code without version history', remedy: 'Always fetch and branch before making substantial code modifications.' },
      { error: 'Manual backup folders (e.g. project_final_v2.zip)', remedy: 'Replace manual copies with atomic commits and meaningful commit messages.' },
    ],
  },

  'c-git-vs-other-vcs': {
    officialDocUrl: 'https://git-scm.com/about/free-and-open-source',
    syntaxCheatSheet: [
      'git log --graph --oneline --all : Render visual ASCII history of all branches',
      'git remote -v : List remote connection endpoints',
      'git branch -a : Inspect both local and remote-tracking branch references',
    ],
    commonErrors: [
      { error: 'Assuming committing pushes to server', remedy: 'In distributed VCS, `git commit` is 100% local. Run `git push` to upload to remotes.' },
      { error: 'Expecting centralized file locking', remedy: 'Git uses non-blocking concurrent branching and merge resolution instead of SVN file locks.' },
    ],
  },

  'c-installing-git-locally': {
    officialDocUrl: 'https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup',
    syntaxCheatSheet: [
      'git config --global user.name "Your Name" : Set default author name',
      'git config --global user.email "you@example.com" : Set author email address',
      'git config --global init.defaultBranch main : Configure default root branch',
      'git config --global core.editor "code --wait" : Set VS Code as default Git editor',
    ],
    commonErrors: [
      { error: 'fatal: empty ident name (for <user>) not allowed', remedy: 'Run `git config --global user.name "Your Name"` and `git config --global user.email "you@domain.com"`.' },
      { error: 'warning: LF will be replaced by CRLF', remedy: 'Configure `git config --global core.autocrlf true` on Windows, or `input` on macOS/Linux.' },
    ],
  },

  'c-what-is-a-repository': {
    officialDocUrl: 'https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain',
    syntaxCheatSheet: [
      'ls -la .git : Inspect hidden Git metadata directory',
      'find .git/objects -type f : Count low-level compressed object files',
      'cat .git/HEAD : View current branch pointer reference',
    ],
    commonErrors: [
      { error: 'Accidentally deleting the .git/ folder', remedy: 'Never remove `.git/` unless you intend to permanently destroy all project history.' },
      { error: 'Nesting a repository inside another repository without submodules', remedy: 'Avoid initializing a repo inside an existing repo root; remove the nested `.git` or use submodules.' },
    ],
  },

  'c-git-init': {
    officialDocUrl: 'https://git-scm.com/docs/git-init',
    syntaxCheatSheet: [
      'git init : Initialize repository in current working directory',
      'git init <directory> : Create directory and initialize repository inside it',
      'git init --initial-branch=main : Initialize repo with main as default branch',
      'git init --bare : Create central remote distribution repository without working tree',
    ],
    commonErrors: [
      { error: 'Reinitialized existing Git repository', remedy: 'Harmless; Git retains existing objects and only refreshes config and hooks template files.' },
      { error: 'fatal: cannot mkdir : Permission denied', remedy: 'Run with write permissions or target a directory in user space.' },
    ],
  },

  // =========================================================================
  // TOPIC 02: Git Commands (Needs DocUrl, SyntaxCheatSheet, CommonErrors)
  // =========================================================================
  'c-git-status': {
    officialDocUrl: 'https://git-scm.com/docs/git-status',
    syntaxCheatSheet: [
      'git status : Full human-readable status report',
      'git status -s : Short format showing concise two-character file status flags',
      'git status -b : Show branch and tracking upstream delta information',
      'git status -uall : Show individual untracked files within untracked directories',
    ],
    commonErrors: [
      { error: 'Untracked files not showing up in status', remedy: 'Verify files are not matched by rules inside `.gitignore` or `.git/info/exclude`.' },
      { error: 'Changes not staged for commit', remedy: 'Run `git add <filename>` to stage modified working tree changes into the index.' },
    ],
  },

  'c-git-add': {
    officialDocUrl: 'https://git-scm.com/docs/git-add',
    syntaxCheatSheet: [
      'git add <file> : Stage individual file changes',
      'git add . : Stage all modifications, deletions, and new files in current directory',
      'git add -p : Interactively review and stage individual code hunks',
      'git add -u : Stage modified and deleted tracked files, ignoring untracked files',
    ],
    commonErrors: [
      { error: 'fatal: pathspec did not match any files', remedy: 'Check spelling and path relative to current working directory.' },
      { error: 'Accidentally staging sensitive credentials or node_modules', remedy: 'Unstage immediately with `git restore --staged <path>` and add file pattern to `.gitignore`.' },
    ],
  },

  'c-git-commit': {
    officialDocUrl: 'https://git-scm.com/docs/git-commit',
    syntaxCheatSheet: [
      'git commit -m "feat: descriptive title" : Commit staged changes with message',
      'git commit -am "fix: inline fix" : Stage tracked modified files and commit in one step',
      'git commit --amend : Replace previous commit with currently staged changes',
      'git commit --amend --no-edit : Update previous commit contents without modifying message',
    ],
    commonErrors: [
      { error: 'Aborting commit due to empty commit message', remedy: 'Provide a non-empty message using `-m "message"` or type a message in the text editor.' },
      { error: 'nothing to commit, working tree clean', remedy: 'Run `git add <file>` first; commit only captures changes present in the staging area.' },
    ],
  },

  'c-git-diff': {
    officialDocUrl: 'https://git-scm.com/docs/git-diff',
    syntaxCheatSheet: [
      'git diff : View unstaged changes in working tree vs staging area',
      'git diff --staged : View changes staged in the index vs last commit (HEAD)',
      'git diff HEAD~1 HEAD : Compare last two commits against each other',
      'git diff branchA..branchB : Compare tip of branchA with tip of branchB',
    ],
    commonErrors: [
      { error: 'git diff outputs nothing after git add', remedy: 'Unstaged diff is empty because changes are staged; use `git diff --staged` or `git diff --cached`.' },
      { error: 'Whitespace changes obscuring real code diffs', remedy: 'Pass `-w` or `--ignore-all-space` to ignore whitespace differences.' },
    ],
  },

  'c-git-restore-staged': {
    officialDocUrl: 'https://git-scm.com/docs/git-restore',
    syntaxCheatSheet: [
      'git restore --staged <file> : Unstage file, keeping working tree edits intact',
      'git restore <file> : Discard working tree modifications, reverting to index snapshot',
      'git restore --source=HEAD~1 <file> : Restore file state from a specific historical commit',
      'git restore . : Discard all unstaged working tree modifications in current folder',
    ],
    commonErrors: [
      { error: 'Accidentally losing uncommitted work with git restore <file>', remedy: '`git restore <file>` permanently discards unstaged changes. Use stash or verify diff before running.' },
      { error: 'error: pathspec did not match any file(s) known to git', remedy: 'File may be untracked; untracked files are deleted with `git clean -f`, not `git restore`.' },
    ],
  },

  // =========================================================================
  // TOPIC 03: Branching Basics (Needs DocUrl, SyntaxCheatSheet, CommonErrors)
  // =========================================================================
  'c-git-branch': {
    officialDocUrl: 'https://git-scm.com/docs/git-branch',
    syntaxCheatSheet: [
      'git branch : List local branches with active branch highlighted',
      'git branch -a : List local and remote-tracking branches',
      'git branch <name> : Create a new branch pointer at HEAD without switching to it',
      'git branch -d <name> : Safely delete merged branch',
      'git branch -D <name> : Force delete branch regardless of merge status',
    ],
    commonErrors: [
      { error: 'error: The branch is not fully merged', remedy: 'Use `git branch -D <name>` if you intentionally want to discard unmerged branch commits.' },
      { error: 'fatal: cannot delete branch used by worktree at...', remedy: 'Switch to a different branch before deleting the active branch.' },
    ],
  },

  'c-git-switch': {
    officialDocUrl: 'https://git-scm.com/docs/git-switch',
    syntaxCheatSheet: [
      'git switch <branch> : Switch to an existing branch',
      'git switch -c <branch> : Create a new branch and switch to it immediately',
      'git switch - : Switch back to the previously active branch',
      'git switch --detach <commit> : Check out an exact commit in detached HEAD mode',
    ],
    commonErrors: [
      { error: 'fatal: a branch named already exists', remedy: 'Use `git switch <branch>` without `-c` to switch to an existing branch.' },
      { error: 'error: Your local changes to the following files would be overwritten', remedy: 'Commit your working changes or run `git stash` before switching branches.' },
    ],
  },

  'c-git-checkout': {
    officialDocUrl: 'https://git-scm.com/docs/git-checkout',
    syntaxCheatSheet: [
      'git checkout -b <branch> : Create and switch to new branch (legacy syntax)',
      'git checkout <branch> : Switch branch',
      'git checkout <commit> : Jump to specific commit in detached HEAD state',
      'git checkout -- <file> : Discard working directory changes for file',
    ],
    commonErrors: [
      { error: 'Confusing branch switching with file discard', remedy: 'Use modern dedicated commands: `git switch` for branch navigation, `git restore` for files.' },
      { error: 'You are in detached HEAD state', remedy: 'Run `git switch -c <new-branch>` to preserve any new commits made while detached.' },
    ],
  },

  'c-git-merge-basic': {
    officialDocUrl: 'https://git-scm.com/docs/git-merge',
    syntaxCheatSheet: [
      'git merge <branch> : Merge specified branch into current branch',
      'git merge --no-ff <branch> : Force creation of a merge commit even if fast-forward is possible',
      'git merge --ff-only <branch> : Refuse merge unless it can resolve as a clean fast-forward',
      'git merge --abort : Cancel in-progress merge and restore pre-merge branch state',
    ],
    commonErrors: [
      { error: 'Automatic merge failed; fix conflicts and then commit the result', remedy: 'Open conflicting files, resolve conflict markers (`<<<<<<<`), stage with `git add`, and `git commit`.' },
      { error: 'fatal: Not possible to fast-forward, aborting', remedy: 'Branch histories have diverged; run regular merge without `--ff-only` or rebase.' },
    ],
  },

  'c-detached-head': {
    officialDocUrl: 'https://git-scm.com/docs/git-checkout#_detached_head',
    syntaxCheatSheet: [
      'git checkout <commit-hash> : Enter detached HEAD state at target commit',
      'git status : Verify HEAD is detached from any branch pointer',
      'git switch -c <new-branch> : Turn detached HEAD state into a permanent branch',
      'git switch main : Safely abandon experimental detached commits and return to main',
    ],
    commonErrors: [
      { error: 'Commits made in detached HEAD lost after switching away', remedy: 'Run `git reflog` to locate the SHA of orphaned commits, then create branch: `git branch recovery <sha>`.' },
      { error: 'HEAD detached at origin/main', remedy: 'Remote tracking refs cannot be checked out directly; switch to a local branch or use `git switch -c feature`.' },
    ],
  },

  // =========================================================================
  // TOPIC 04: Basic Collaboration (Needs DocUrl, SyntaxCheatSheet, CommonErrors)
  // =========================================================================
  'c-git-remote': {
    officialDocUrl: 'https://git-scm.com/docs/git-remote',
    syntaxCheatSheet: [
      'git remote -v : List remote names with fetch and push URLs',
      'git remote add <name> <url> : Register new named remote repository',
      'git remote set-url <name> <new-url> : Change URL of an existing remote',
      'git remote remove <name> : Delete remote pointer and associated tracking branches',
    ],
    commonErrors: [
      { error: 'fatal: remote origin already exists', remedy: 'Use `git remote set-url origin <new-url>` or remove old one with `git remote remove origin`.' },
      { error: 'fatal: No such remote origin', remedy: 'Add remote first using `git remote add origin <repo-url>`.' },
    ],
  },

  'c-git-push': {
    officialDocUrl: 'https://git-scm.com/docs/git-push',
    syntaxCheatSheet: [
      'git push -u origin <branch> : Push branch to origin and establish upstream tracking',
      'git push : Push commits on current branch to configured upstream tracking remote',
      'git push --all : Push all local branches to remote destination',
      'git push --force-with-lease : Safely force push only if remote ref matches your expectations',
    ],
    commonErrors: [
      { error: 'error: failed to push some refs (fetch first)', remedy: 'Remote contains commits not present locally; run `git pull --rebase` or `git fetch` before pushing.' },
      { error: 'fatal: The current branch has no upstream branch', remedy: 'Execute suggested command: `git push --set-upstream origin <branch-name>`.' },
    ],
  },

  'c-git-fetch': {
    officialDocUrl: 'https://git-scm.com/docs/git-fetch',
    syntaxCheatSheet: [
      'git fetch origin : Fetch all updated refs and commits from origin without touching working files',
      'git fetch --all : Fetch latest refs from all registered remote destinations',
      'git fetch --prune : Delete local tracking branches that have been deleted on remote',
      'git log HEAD..origin/main : Review incoming remote commits before integrating',
    ],
    commonErrors: [
      { error: 'Expecting working directory files to change after fetch', remedy: '`git fetch` only updates remote pointers in `.git/refs/remotes/`. Run `git merge` or `git pull` to update working tree.' },
      { error: 'Authentication failed for remote', remedy: 'Verify GitHub personal access token (PAT) or SSH key credentials.' },
    ],
  },

  'c-git-pull': {
    officialDocUrl: 'https://git-scm.com/docs/git-pull',
    syntaxCheatSheet: [
      'git pull : Fetch upstream commits and merge into current local branch',
      'git pull --rebase : Fetch and rebase local commits on top of incoming remote branch',
      'git pull --ff-only : Pull only if merge resolves as clean fast-forward, preventing unwanted merge commits',
      'git pull origin <branch> : Pull from specific remote branch',
    ],
    commonErrors: [
      { error: 'warning: Pulling without specifying how to reconcile divergent branches is discouraged', remedy: 'Set preference: `git config pull.rebase true` or `git config pull.ff only`.' },
      { error: 'error: cannot pull with rebase: You have unstaged changes', remedy: 'Commit your working changes or run `git stash` before pulling.' },
    ],
  },

  'c-git-clone': {
    officialDocUrl: 'https://git-scm.com/docs/git-clone',
    syntaxCheatSheet: [
      'git clone <url> : Clone remote repo into directory named after repo',
      'git clone <url> <custom-dir> : Clone repository into specific local target directory',
      'git clone --depth 1 <url> : Shallow clone downloading only the latest commit snapshot',
      'git clone --branch <name> <url> : Clone and check out specific branch directly',
    ],
    commonErrors: [
      { error: 'fatal: destination path already exists and is not an empty directory', remedy: 'Specify a new target directory name or clone into an empty path.' },
      { error: 'fatal: repository not found or access denied', remedy: 'Verify URL accuracy, check repo visibility (public vs private), and authenticate SSH/PAT.' },
    ],
  },

  // =========================================================================
  // TOPIC 05: GitHub Essentials (Needs Synopsis, Options, GitInternals)
  // =========================================================================
  'c-github-intro': {
    synopsis: 'git remote [-v] | git push [-u] <remote> <branch>',
    options: [
      { flag: '-v, --verbose', description: 'Lists remote alias names along with their full fetch and push network URLs.' },
      { flag: '-u, --set-upstream', description: 'Configures tracking association so subsequent `git push` or `git pull` works without arguments.' },
    ],
    gitInternals: {
      objectType: 'Remote Repository & Transport Protocol',
      explanation: 'GitHub communicates via Smart HTTP or SSH protocols, exchanging packfiles containing commits, trees, and blobs.',
      storageLocation: 'Cloud-hosted bare Git repositories backed by GitHub enterprise infrastructure.',
    },
  },

  'c-github-forks': {
    synopsis: 'git remote add upstream <url> && git fetch upstream',
    options: [
      { flag: 'add <name> <url>', description: 'Registers a new named remote endpoint pointing to parent open-source project.' },
      { flag: '-v, --verbose', description: 'Displays both origin (your fork) and upstream (parent project) endpoints.' },
    ],
    gitInternals: {
      objectType: 'Multi-Remote Namespace Routing',
      explanation: 'Git isolates remote tracking branches under separate namespaces in `.git/refs/remotes/origin` and `.git/refs/remotes/upstream`.',
      storageLocation: '.git/refs/remotes/upstream/ and .git/config [remote "upstream"]',
    },
  },

  'c-github-pull-requests': {
    synopsis: 'gh pr create [--title <text>] [--body <text>] [--base <branch>]',
    options: [
      { flag: '--base <branch>', description: 'Specifies the target branch in the parent repo into which changes should be merged.' },
      { flag: '--draft', description: 'Opens the pull request as a Work In Progress (WIP), preventing accidental merges.' },
      { flag: '--fill', description: 'Automatically populates title and description from git commit history.' },
    ],
    gitInternals: {
      objectType: 'Pull Request Reference (refs/pull/<id>/head)',
      explanation: 'GitHub stores pull request revisions under custom read-only Git references that can be fetched locally with `git fetch origin refs/pull/<id>/head:pr-<id>`.',
      storageLocation: 'Remote GitHub ref namespace `refs/pull/*`',
    },
  },

  'c-github-ssh-keys': {
    synopsis: 'ssh-keygen -t ed25519 -C "<email>" && ssh -T git@github.com',
    options: [
      { flag: '-t ed25519', description: 'Specifies modern Ed25519 elliptic curve digital signature algorithm.' },
      { flag: '-C <comment>', description: 'Adds an identifying email or label comment inside the public key file.' },
      { flag: '-T', description: 'Disables pseudo-terminal allocation to test authentication connection to GitHub.' },
    ],
    gitInternals: {
      objectType: 'Asymmetric Cryptographic Key Pair',
      explanation: 'Uses public-key cryptography where your public key verifies signed challenge tokens without ever exposing your private key.',
      storageLocation: '~/.ssh/id_ed25519 (private) and ~/.ssh/id_ed25519.pub (public)',
    },
  },

  // =========================================================================
  // TOPIC 06: Collaboration on GitHub (Needs Synopsis, Options, GitInternals)
  // =========================================================================
  'c-gh-code-review': {
    synopsis: 'gh pr review [<number>] [--approve | --request-changes | --comment] [-b <body-text>]',
    options: [
      { flag: '--approve', description: 'Submits formal approval allowing the pull request to satisfy branch protection requirements.' },
      { flag: '--request-changes', description: 'Blocks pull request merge until developer pushes revisions resolving feedback.' },
      { flag: '-c, --comment', description: 'Leaves neutral general feedback or inline architectural suggestions.' },
    ],
    gitInternals: {
      objectType: 'Three-Dot Range Diff (base...head)',
      explanation: 'GitHub generates PR diffs using `git diff merge-base(main, feature)..feature`, displaying only commits introduced on the feature branch.',
      storageLocation: 'GitHub database relational review thread store tied to Git commit tree SHAs.',
    },
  },

  'c-gh-upstream-sync': {
    synopsis: 'git fetch upstream && git merge upstream/main [or git rebase upstream/main]',
    options: [
      { flag: '--ff-only', description: 'Ensures local fork main fast-forwards strictly without generating unnecessary merge commits.' },
      { flag: '--prune', description: 'Removes deleted remote-tracking references no longer present in upstream.' },
    ],
    gitInternals: {
      objectType: 'Fast-Forward Pointer Advance',
      explanation: 'Moves local branch pointer directly to upstream commit hash when no conflicting local divergence exists.',
      storageLocation: '.git/refs/heads/main and .git/refs/remotes/upstream/main',
    },
  },

  'c-gh-pr-squash': {
    synopsis: 'git merge --squash <branch> | gh pr merge --squash',
    options: [
      { flag: '--squash', description: 'Produces a single condensed working tree commit combining all branch commits without merge parent pointers.' },
      { flag: '--rebase', description: 'Replays branch commits linearly onto base branch without merge commits.' },
      { flag: '--merge', description: 'Standard merge creating two-parent merge commit preserving full branch topology.' },
    ],
    gitInternals: {
      objectType: 'Single-Parent Synthetic Commit',
      explanation: 'Creates a standard single-parent commit tree representing all changes, omitting intermediate commit lineage from the trunk graph.',
      storageLocation: '.git/objects/ (new commit object referencing accumulated tree)',
    },
  },

  'c-gh-protected-branches': {
    synopsis: 'gh api --method PUT /repos/{owner}/{repo}/branches/{branch}/protection',
    options: [
      { flag: 'require_pull_request_reviews', description: 'Enforces minimum number of code review approvals before allowing merge.' },
      { flag: 'strict', description: 'Requires branch to be up-to-date with base branch before merge.' },
      { flag: 'enforce_admins', description: 'Applies protection rules to repository administrators as well.' },
    ],
    gitInternals: {
      objectType: 'Remote Server-Side Pre-Receive Gate',
      explanation: 'GitHub enforces server-side pre-receive Git hooks that inspect incoming push requests and reject unauthorized direct updates.',
      storageLocation: 'GitHub repository settings policies enforced on GitHub Git cluster daemon.',
    },
  },

  // =========================================================================
  // TOPIC 07: Merge Strategies (Needs Synopsis, Options, GitInternals)
  // =========================================================================
  'c-fast-forward': {
    synopsis: 'git merge --ff-only <branch>',
    options: [
      { flag: '--ff-only', description: 'Refuses to merge with an exit error unless the merge can resolve as a clean fast-forward.' },
      { flag: '--no-ff', description: 'Forces Git to create a merge commit even when a fast-forward is possible.' },
    ],
    gitInternals: {
      objectType: 'Direct Reference Shift (No New Commit)',
      explanation: 'Fast-forward simply changes the commit SHA recorded inside `.git/refs/heads/<target>` to match the source branch SHA.',
      storageLocation: '.git/refs/heads/<branch>',
    },
  },

  'c-three-way-merge': {
    synopsis: 'git merge -m "<message>" <branch>',
    options: [
      { flag: '-m, --message', description: 'Specifies custom merge commit message in place of default automatic message.' },
      { flag: '--no-commit', description: 'Performs merge but halts prior to creating merge commit so user can inspect staged result.' },
      { flag: '--abort', description: 'Restores working directory and HEAD to pre-merge state if conflicts occur.' },
    ],
    gitInternals: {
      objectType: 'Two-Parent Commit Object',
      explanation: 'Computes common ancestor with `git merge-base`, builds a unified tree object, and writes a commit with two `parent` headers.',
      storageLocation: '.git/objects/ (commit file containing parent 1 and parent 2 hashes)',
    },
  },

  'c-git-rebase': {
    synopsis: 'git rebase <upstream-branch> [<branch>]',
    options: [
      { flag: '--onto <newbase>', description: 'Starts replaying commits onto a specific base rather than the upstream branch point.' },
      { flag: '--continue', description: 'Resumes rebase process after conflicts in current commit have been resolved and staged.' },
      { flag: '--abort', description: 'Cancels rebase completely and resets branch pointer to original pre-rebase position.' },
      { flag: '--skip', description: 'Discards current patch commit and proceeds to the next commit in the rebase queue.' },
    ],
    gitInternals: {
      objectType: 'Commit Re-creation Sequence',
      explanation: 'Creates new commit objects with distinct SHA hashes by applying changes as sequential patches onto the new base commit.',
      storageLocation: '.git/rebase-apply/ or .git/rebase-merge/ during active rebase',
    },
  },

  'c-merge-conflicts': {
    synopsis: 'git status && git add <resolved-file> && git commit',
    options: [
      { flag: '--ours', description: 'Checks out our version of conflicting files during a merge.' },
      { flag: '--theirs', description: 'Checks out incoming version of conflicting files during a merge.' },
      { flag: '--conflict=diff3', description: 'Displays common ancestor version alongside ours and theirs in conflict markers.' },
    ],
    gitInternals: {
      objectType: 'Index Multi-Stage Conflict Entries (Stages 1, 2, 3)',
      explanation: 'Stores common ancestor at stage 1, our version at stage 2, and incoming branch version at stage 3 inside `.git/index`.',
      storageLocation: '.git/index unmerged stage slots and conflict markers in working tree files',
    },
  },

  // =========================================================================
  // TOPIC 08: Best Practices (Needs Synopsis, Options, GitInternals)
  // =========================================================================
  'c-atomic-commits': {
    synopsis: 'git add -p <file> && git commit -m "feat(scope): concise single purpose"',
    options: [
      { flag: '-p, --patch', description: 'Interactively chunks file diffs so unrelated changes are not lumped into the same commit.' },
      { flag: '--amend', description: 'Appends overlooked files to the last commit to preserve atomicity.' },
    ],
    gitInternals: {
      objectType: 'Focused Tree Object',
      explanation: 'Each commit encapsulates one isolated, deployable state that can be safely bisected or reverted independently.',
      storageLocation: '.git/objects/ tree and commit records',
    },
  },

  'c-commit-messages': {
    synopsis: 'git commit -m "<type>(<scope>): <subject>"',
    options: [
      { flag: '-m <msg>', description: 'Supplies commit summary subject line directly from CLI.' },
      { flag: '-F <file>', description: 'Reads multi-line formatted commit message from a designated template or draft file.' },
    ],
    gitInternals: {
      objectType: 'Commit Object Metadata Payload',
      explanation: 'Formatted commit messages are stored as plain UTF-8 text inside the commit object body following the header lines.',
      storageLocation: '.git/objects/ commit object payload',
    },
  },

  'c-gitignore-mastery': {
    synopsis: 'git check-ignore -v <path> | git rm -r --cached <path>',
    options: [
      { flag: '-v, --verbose', description: 'Reports exact filename and line number in `.gitignore` responsible for ignoring target path.' },
      { flag: '--cached', description: 'Unstages and stops tracking file from index without deleting it from local hard drive.' },
      { flag: '-n, --dry-run', description: 'Simulates `git clean` or `git rm` without altering any files.' },
    ],
    gitInternals: {
      objectType: 'Exclusion Pattern Filter',
      explanation: 'Git consults `.gitignore`, `.git/info/exclude`, and `core.excludesFile` before adding untracked files to directory index traversal.',
      storageLocation: '.gitignore file in repository tree and .git/info/exclude',
    },
  },

  'c-clean-git-hygiene': {
    synopsis: 'git clean -fdx [-n] | git remote prune origin',
    options: [
      { flag: '-n, --dry-run', description: 'Lists untracked files and directories that would be removed without actually deleting them.' },
      { flag: '-f, --force', description: 'Enforces deletion of untracked files from disk.' },
      { flag: '-d', description: 'Removes whole untracked directories in addition to files.' },
      { flag: '-x', description: 'Ignores .gitignore rules and cleans ignored build artifacts as well.' },
    ],
    gitInternals: {
      objectType: 'Working Tree Sweeper',
      explanation: 'Traverses filesystem directory tree and removes nodes not registered in the index or repository object store.',
      storageLocation: 'Direct working tree filesystem modification',
    },
  },

  // =========================================================================
  // TOPIC 09: Working in a Team (Needs Synopsis, Options, GitInternals)
  // =========================================================================
  'c-trunk-based': {
    synopsis: 'git switch main && git pull --rebase && git switch -c short-lived-feature',
    options: [
      { flag: '--rebase', description: 'Replays local commits atop trunk to maintain a single continuous linear history.' },
      { flag: '--delete', description: 'Deletes short-lived feature branch immediately after PR merge to keep branches clean.' },
    ],
    gitInternals: {
      objectType: 'Short-Lived Branch Reference',
      explanation: 'Minimizes long-lived branch divergence to avoid costly merge conflicts and reduce integration risk.',
      storageLocation: '.git/refs/heads/ and fast-forward trunk merges',
    },
  },

  'c-gitflow': {
    synopsis: 'git flow init | git flow feature start <name>',
    options: [
      { flag: 'feature start <name>', description: 'Creates and switches to a new feature branch originating from `develop`.' },
      { flag: 'release start <version>', description: 'Branches release candidate from `develop` for final stabilization.' },
      { flag: 'hotfix start <version>', description: 'Branches urgent patch directly from `main`.' },
    ],
    gitInternals: {
      objectType: 'Branch Topology Convention',
      explanation: 'Organizes branch references into standardized naming conventions: `develop`, `release/*`, `feature/*`, and `hotfix/*`.',
      storageLocation: '.git/refs/heads/ hierarchical ref names',
    },
  },

  'c-team-conflict-prevention': {
    synopsis: 'git fetch origin && git rebase origin/main',
    options: [
      { flag: '--autostash', description: 'Automatically stashes dirty working tree changes before rebase and pops them after.' },
      { flag: 'rerere.enabled true', description: 'Enables Reuse Recorded Resolution so Git remembers how you previously resolved conflicts.' },
    ],
    gitInternals: {
      objectType: 'RERERE Conflict Pre-image Database',
      explanation: 'Git hashes conflict hunks and records resolutions in `.git/rr-cache`, automatically reapplying them when the same conflict reappears.',
      storageLocation: '.git/rr-cache/ conflict signatures and resolutions',
    },
  },

  // =========================================================================
  // TOPIC 10: GitHub Projects (Needs Synopsis, Options, GitInternals)
  // =========================================================================
  'c-gh-issues': {
    synopsis: 'gh issue create [--title <title>] [--body <body>] [--label <label>]',
    options: [
      { flag: '-t, --title <text>', description: 'Sets issue title directly from CLI.' },
      { flag: '-b, --body <text>', description: 'Sets issue description markdown content.' },
      { flag: '-l, --label <names>', description: 'Assigns category labels (e.g. bug, enhancement).' },
      { flag: '-a, --assignee <users>', description: 'Assigns issue to designated GitHub usernames.' },
    ],
    gitInternals: {
      objectType: 'Commit Message Keyword Parser (Closes #123)',
      explanation: 'GitHub webhook scanners inspect commit messages on default branch pushes for keywords like `fixes #123` to close issues automatically.',
      storageLocation: 'GitHub platform relational issue tracker metadata',
    },
  },

  'c-gh-project-boards': {
    synopsis: 'gh project list | gh project item-create <project-number> [--title <title>]',
    options: [
      { flag: '--owner <org/user>', description: 'Specifies project board owner organization or user handle.' },
      { flag: '--format json', description: 'Outputs project board card metadata in JSON format for automation scripts.' },
    ],
    gitInternals: {
      objectType: 'Kanban Column Workflow Model',
      explanation: 'Synchronizes issues and pull requests into customizable tables and boards with automated status transition triggers.',
      storageLocation: 'GitHub Projects V2 GraphQL schema backend',
    },
  },

  'c-gh-milestones': {
    synopsis: 'gh api /repos/{owner}/{repo}/milestones -f title="v1.0.0" -f due_on="2026-12-31T23:59:59Z"',
    options: [
      { flag: 'due_on', description: 'Sets target ISO 8601 deadline date for milestone completion.' },
      { flag: 'state', description: 'Filters milestones by open or closed status.' },
    ],
    gitInternals: {
      objectType: 'Sprint Progress Aggregator',
      explanation: 'Tracks overall percentage completion based on ratio of closed issues to total issues tagged with the milestone identifier.',
      storageLocation: 'GitHub relational project planning database',
    },
  },

  // =========================================================================
  // TOPIC 11: Intermediate Git Topics (Needs Synopsis, Options, GitInternals)
  // =========================================================================
  'c-git-stash': {
    synopsis: 'git stash [push [-m <message>]] | git stash pop [<stash>]',
    options: [
      { flag: 'push -m <msg>', description: 'Saves uncommitted changes with a custom descriptive note.' },
      { flag: 'pop', description: 'Restores the most recent stash onto working tree and removes it from stash stack.' },
      { flag: 'apply', description: 'Restores stash onto working tree while preserving it on the stash list for reuse.' },
      { flag: '-u, --include-untracked', description: 'Stashes untracked files alongside tracked modifications.' },
      { flag: 'list', description: 'Displays all stashes currently stored on the stack.' },
    ],
    gitInternals: {
      objectType: 'Two or Three-Parent Commit on Stash Ref',
      explanation: 'A stash is a special commit referenced by `.git/refs/stash` with parents for HEAD, index, and optionally untracked files.',
      storageLocation: '.git/refs/stash and .git/logs/refs/stash (reflog stack)',
    },
  },

  'c-git-cherry-pick': {
    synopsis: 'git cherry-pick <commit-hash> [--no-commit] [-x]',
    options: [
      { flag: '-n, --no-commit', description: 'Applies changes from target commit to working tree and index without creating a new commit.' },
      { flag: '-x', description: 'Appends a line saying "(cherry picked from commit ...)" to the new commit message.' },
      { flag: '--continue', description: 'Resumes cherry-pick after manually resolving conflict markers.' },
      { flag: '--abort', description: 'Cancels cherry-pick and restores previous branch state.' },
    ],
    gitInternals: {
      objectType: 'Patch Application & Fresh Commit Synthesis',
      explanation: 'Computes diff of specified commit against its parent and applies that diff as a patch on top of current HEAD, creating a new commit SHA.',
      storageLocation: '.git/objects/ (new commit) and .git/sequencer/ during active cherry-pick',
    },
  },

  'c-git-rebase-i': {
    synopsis: 'git rebase -i <base-commit-or-HEAD~N>',
    options: [
      { flag: '-i, --interactive', description: 'Opens interactive todo list in editor with pick, squash, edit, reword, and drop verbs.' },
      { flag: '--autosquash', description: 'Automatically pairs and orders `fixup!` and `squash!` commits with their target commits.' },
      { flag: '--root', description: 'Allows rebasing all commits all the way back to the root initial commit.' },
    ],
    gitInternals: {
      objectType: 'Rebase Instruction Sequencer Script',
      explanation: 'Git writes a sequence list of commit hashes and commands to `.git/rebase-merge/git-rebase-todo` and executes them step-by-step.',
      storageLocation: '.git/rebase-merge/git-rebase-todo and .git/rebase-merge/done',
    },
  },

  'c-git-reset-modes': {
    synopsis: 'git reset [--soft | --mixed | --hard] <commit-or-HEAD~N>',
    options: [
      { flag: '--soft', description: 'Moves HEAD pointer only; keeps index (staged) and working tree modifications completely intact.' },
      { flag: '--mixed (default)', description: 'Moves HEAD pointer and resets index; leaves working tree modifications uncommitted and unstaged.' },
      { flag: '--hard', description: 'Moves HEAD, resets index, and overwrites working tree files, destroying uncommitted changes.' },
    ],
    gitInternals: {
      objectType: 'Branch Pointer Displacement',
      explanation: 'Updates `.git/refs/heads/<branch>` to point to the target commit hash, selectively synchronizing `.git/index` and working directory files.',
      storageLocation: '.git/refs/heads/<branch> and .git/index',
    },
  },

  'c-git-revert': {
    synopsis: 'git revert <commit-hash> [--no-commit] [-m <parent-number>]',
    options: [
      { flag: '-n, --no-commit', description: 'Stages inverse changes without creating commit, allowing batching multiple reverts together.' },
      { flag: '-m, --mainline <num>', description: 'Specifies parent number (usually 1) when reverting a merge commit.' },
      { flag: '--continue', description: 'Completes revert after resolving any conflicts that arose.' },
    ],
    gitInternals: {
      objectType: 'Inverse Patch Commit',
      explanation: 'Computes diff introduced by target commit and creates a new forward-moving commit applying the exact mathematical opposite.',
      storageLocation: '.git/objects/ (new commit object referencing inverted tree)',
    },
  },

  // =========================================================================
  // TOPIC 12: Tagging (Needs Synopsis, Options, GitInternals)
  // =========================================================================
  'c-lightweight-tags': {
    synopsis: 'git tag <tag-name> [<commit-hash>]',
    options: [
      { flag: '-l, --list', description: 'Lists existing tags matching optional wildcard pattern.' },
      { flag: '-d, --delete', description: 'Deletes designated tag reference locally.' },
    ],
    gitInternals: {
      objectType: 'Raw Reference Pointer (No Object Header)',
      explanation: 'A lightweight tag is simply a plain-text file in `.git/refs/tags/` containing a single 40-character commit SHA-1/SHA-256 hash.',
      storageLocation: '.git/refs/tags/<tagname>',
    },
  },

  'c-annotated-tags': {
    synopsis: 'git tag -a <tag-name> -m "<release-message>" [<commit-hash>]',
    options: [
      { flag: '-a', description: 'Instructs Git to create an annotated tag object instead of a lightweight pointer.' },
      { flag: '-m <msg>', description: 'Specifies release or tag description message.' },
      { flag: '-s', description: 'Cryptographically signs tag object with GPG private key.' },
    ],
    gitInternals: {
      objectType: 'Dedicated Tag Object (git cat-file -t tag)',
      explanation: 'A full Git database object containing object target hash, tagger name, email, timestamp, and optional GPG cryptographic signature.',
      storageLocation: '.git/objects/ (tag object) pointed to by .git/refs/tags/<tagname>',
    },
  },

  'c-pushing-tags': {
    synopsis: 'git push origin <tag-name> | git push origin --tags',
    options: [
      { flag: '--tags', description: 'Pushes all local tags to remote repository that are not already present there.' },
      { flag: '--delete <tag>', description: 'Deletes remote tag on server: `git push origin --delete v1.0.0`.' },
    ],
    gitInternals: {
      objectType: 'Remote Tag Reference Refspec',
      explanation: 'Transfers tag objects and associated commit DAG histories to remote daemon, updating `refs/tags/*` on server.',
      storageLocation: 'Remote `.git/refs/tags/` namespace and packed-refs',
    },
  },

  // =========================================================================
  // TOPIC 13: Git Hooks (Needs Synopsis, Options, GitInternals)
  // =========================================================================
  'c-client-hooks': {
    synopsis: 'chmod +x .git/hooks/<hook-name>',
    options: [
      { flag: '--no-verify', description: 'Bypasses client-side `pre-commit` and `commit-msg` hooks during git commit or push.' },
    ],
    gitInternals: {
      objectType: 'Local Shell/Executable Script',
      explanation: 'Git checks `.git/hooks/` for executable files matching hook lifecycle events (pre-commit, prepare-commit-msg, pre-push).',
      storageLocation: '.git/hooks/<hook-name> (e.g. .git/hooks/pre-commit)',
    },
  },

  'c-commit-msg-hook': {
    synopsis: '.git/hooks/commit-msg <file-containing-commit-message>',
    options: [
      { flag: '$1 argument', description: 'Path to temporary file holding draft commit message text (e.g. `.git/COMMIT_EDITMSG`).' },
    ],
    gitInternals: {
      objectType: 'Message Validator Process',
      explanation: 'Executes before commit object is created; if hook exits with non-zero status, Git aborts commit operation immediately.',
      storageLocation: '.git/hooks/commit-msg and .git/COMMIT_EDITMSG',
    },
  },

  'c-husky-lint-staged': {
    synopsis: 'npx husky init && npx lint-staged',
    options: [
      { flag: 'core.hooksPath', description: 'Configures Git to look for hooks in a committed directory (e.g. `.husky/`) instead of `.git/hooks/`.' },
    ],
    gitInternals: {
      objectType: 'Configured Hooks Directory Override',
      explanation: 'Uses Git configuration key `core.hooksPath = .husky` to allow hook scripts to be tracked and shared in version control.',
      storageLocation: '.husky/ directory and .git/config [core "hooksPath"]',
    },
  },

  // =========================================================================
  // TOPIC 14: Submodules (Needs Synopsis, Options, GitInternals)
  // =========================================================================
  'c-submodule-add': {
    synopsis: 'git submodule add <repository-url> [<path>]',
    options: [
      { flag: '-b <branch>', description: 'Tracks specific branch of submodule repository instead of default HEAD.' },
      { flag: '--name <name>', description: 'Assigns custom logical name for submodule entry in `.gitmodules`.' },
    ],
    gitInternals: {
      objectType: 'Gitlink Tree Entry (Mode 160000)',
      explanation: 'Parent tree stores a special gitlink object entry with mode 160000 pointing to the exact commit SHA of the embedded repository.',
      storageLocation: '.gitmodules config file, .git/config, and .git/modules/',
    },
  },

  'c-submodule-update': {
    synopsis: 'git submodule update --init --recursive',
    options: [
      { flag: '--init', description: 'Initializes submodules registered in `.gitmodules` that have not yet been cloned locally.' },
      { flag: '--recursive', description: 'Traverses nested submodules recursively through all child repositories.' },
      { flag: '--remote', description: 'Fetches latest commit from tracking branch specified in `.gitmodules` instead of recorded SHA.' },
    ],
    gitInternals: {
      objectType: 'Detached Submodule Repository State',
      explanation: 'Checks out submodules directly at the recorded commit SHA in detached HEAD mode inside their respective folder paths.',
      storageLocation: '.git/modules/<submodule-name>/ and child working directory',
    },
  },

  'c-submodules-vs-monorepo': {
    synopsis: 'git submodule status | git clone --recurse-submodules <url>',
    options: [
      { flag: '--recurse-submodules', description: 'Automatically initializes and clones all submodules during initial parent repository clone.' },
    ],
    gitInternals: {
      objectType: 'Modular Distributed vs Unified Tree Architecture',
      explanation: 'Monorepos maintain a single unified tree object graph, whereas submodules link distinct independent repository graphs.',
      storageLocation: 'Single `.git/` object store vs multiple nested `.git/modules/` stores',
    },
  },

  // =========================================================================
  // TOPIC 15: GitHub Workflow (Needs Synopsis, Options, GitInternals)
  // =========================================================================
  'c-actions-intro': {
    synopsis: 'name: CI\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps: ...',
    options: [
      { flag: 'runs-on', description: 'Selects runner OS environment (e.g. `ubuntu-latest`, `windows-latest`, `macos-latest`).' },
      { flag: 'uses', description: 'Pulls pre-built action from GitHub Marketplace (e.g. `actions/checkout@v4`).' },
    ],
    gitInternals: {
      objectType: 'YAML Workflow Declarations',
      explanation: 'GitHub watches `.github/workflows/*.yml` files in the repository tree and launches ephemeral virtual machine runners upon trigger events.',
      storageLocation: '.github/workflows/*.yml in repository root',
    },
  },

  'c-ci-cd-pipelines': {
    synopsis: 'gh run list | gh run watch <run-id>',
    options: [
      { flag: '--workflow <file>', description: 'Filters pipeline runs by specific workflow file name.' },
      { flag: '--limit <num>', description: 'Caps number of historical pipeline runs displayed in CLI.' },
    ],
    gitInternals: {
      objectType: 'Automated Build Matrix & Step Executor',
      explanation: 'Parses step dependency graph, spins up containerized runner instances, and executes bash/powershell commands sequentially.',
      storageLocation: 'GitHub Actions runner telemetry and artifact cache storage',
    },
  },

  'c-action-secrets': {
    synopsis: 'gh secret set <NAME> [--body <value> | --env <env-name>]',
    options: [
      { flag: '-b, --body <text>', description: 'Supplies secret plaintext value directly from CLI.' },
      { flag: '-e, --env <name>', description: 'Associates secret with a specific deployment environment rather than entire repository.' },
    ],
    gitInternals: {
      objectType: 'LibSodium Sealed Box Encrypted Secrets',
      explanation: 'GitHub encrypts secret values in browser/CLI with repository public key using LibSodium before transmission; decrypted only inside runner memory.',
      storageLocation: 'GitHub cryptographic vault database, redacted in runner logs',
    },
  },

  'c-releases-artifacts': {
    synopsis: 'gh release create <tag> [<files>...] [--title <title>] [--notes <notes>]',
    options: [
      { flag: '-t, --title <text>', description: 'Sets release title in GitHub web UI.' },
      { flag: '-n, --notes <text>', description: 'Release changelog notes in Markdown format.' },
      { flag: '--draft', description: 'Creates unreleased draft visible only to repository collaborators.' },
      { flag: '--prerelease', description: 'Marks release as alpha, beta, or release candidate.' },
    ],
    gitInternals: {
      objectType: 'Release Metadata & Binary Asset Storage',
      explanation: 'Binds release changelog directly to a Git tag reference and attaches compiled binary artifacts stored in cloud object storage.',
      storageLocation: 'GitHub Releases cloud blob storage bound to Git tag reference',
    },
  },

  // =========================================================================
  // TOPIC 16: Advanced Git Topics (Needs Synopsis, Options, GitInternals)
  // =========================================================================
  'c-git-reflog': {
    synopsis: 'git reflog [show [<ref>]] | git reset --hard <reflog-entry>',
    options: [
      { flag: 'expire --expire=30.days.ago', description: 'Prunes reflog entries older than specified timeframe.' },
      { flag: '--all', description: 'Shows reflog history for all branches and references, not just HEAD.' },
    ],
    gitInternals: {
      objectType: 'Local Reference Action Log',
      explanation: 'Every time HEAD or a branch pointer moves, an append-only entry is recorded in `.git/logs/HEAD` with previous SHA, new SHA, and action description.',
      storageLocation: '.git/logs/HEAD and .git/logs/refs/heads/<branch>',
    },
  },

  'c-git-bisect': {
    synopsis: 'git bisect start && git bisect bad && git bisect good <known-good-commit>',
    options: [
      { flag: 'run <script>', description: 'Automates binary search by executing test script on each checkout to automatically identify breaking commit.' },
      { flag: 'reset', description: 'Terminates bisect session and returns HEAD to original starting branch.' },
      { flag: 'skip', description: 'Skips current commit if it has unrelated build problems.' },
    ],
    gitInternals: {
      objectType: 'Binary Search State Machine',
      explanation: 'Calculates midpoint commit between known good and bad boundaries using the topological DAG, checking out each candidate in detached HEAD.',
      storageLocation: '.git/BISECT_START, .git/BISECT_LOG, and .git/refs/bisect/',
    },
  },

  'c-git-worktree': {
    synopsis: 'git worktree add <path> <branch> | git worktree list',
    options: [
      { flag: '-b <new-branch>', description: 'Creates a new branch and checks it out directly into the new linked worktree.' },
      { flag: 'remove <worktree>', description: 'Deletes linked worktree folder and prunes its associated administrative metadata.' },
      { flag: 'prune', description: 'Cleans up administrative records for worktrees whose directories were deleted manually.' },
    ],
    gitInternals: {
      objectType: 'Linked Working Tree Administrative Directory',
      explanation: 'Maintains independent working directories that share the single main repository `.git/objects/` store, with separate HEAD and index files.',
      storageLocation: '.git/worktrees/<name>/ (containing private HEAD and index)',
    },
  },

  'c-git-internals-dag': {
    synopsis: 'git cat-file -p <sha> | git cat-file -t <sha>',
    options: [
      { flag: '-p', description: 'Pretty-prints the contents of a Git object based on its internal type (blob, tree, commit, tag).' },
      { flag: '-t', description: 'Displays the internal type of object represented by the SHA hash.' },
      { flag: '-s', description: 'Displays the size in bytes of the object.' },
    ],
    gitInternals: {
      objectType: 'Content-Addressable Cryptographic Object Store',
      explanation: 'Objects are zlib-compressed files named by SHA hash, categorized into 4 types: blobs (file data), trees (directory listings), commits, and tags.',
      storageLocation: '.git/objects/[0-9a-f]{2}/[0-9a-f]{38} and .git/objects/pack/',
    },
  },

  // =========================================================================
  // TOPIC 17: GitHub Developer Tools (Needs Synopsis, Options, GitInternals)
  // =========================================================================
  'c-gh-cli': {
    synopsis: 'gh auth login | gh repo clone <owner>/<repo> | gh pr checkout <pr-number>',
    options: [
      { flag: 'auth status', description: 'Verifies active authentication credentials, scopes, and target GitHub host.' },
      { flag: 'alias set <alias> <expansion>', description: 'Defines custom shortcut commands for frequent multi-step GitHub CLI tasks.' },
    ],
    gitInternals: {
      objectType: 'REST & GraphQL API Client Binary',
      explanation: 'Encapsulates GitHub API v3 and v4 calls into native terminal workflows, communicating with git credential helper for transparent tokens.',
      storageLocation: '~/.config/gh/config.yml and OS credential manager',
    },
  },

  'c-gh-api': {
    synopsis: 'gh api /user | gh api graphql -f query="query { viewer { login } }"',
    options: [
      { flag: '-X, --method <GET|POST|PUT|DELETE>', description: 'Specifies HTTP request method.' },
      { flag: '-f, --field <key=value>', description: 'Adds parameter field to API request payload.' },
      { flag: '-H, --header <key:value>', description: 'Appends custom HTTP header (e.g. `Accept: application/vnd.github.v3+json`).' },
    ],
    gitInternals: {
      objectType: 'JSON Network Protocol Interface',
      explanation: 'Direct programmatic interface into GitHub backend database with granular token scopes and rate-limiting headers.',
      storageLocation: 'api.github.com HTTPS endpoint with rate-limit response headers',
    },
  },

  'c-codespaces': {
    synopsis: 'gh codespace create -r <owner>/<repo> | gh codespace code -c <name>',
    options: [
      { flag: '-m, --machine <spec>', description: 'Selects hardware specs (e.g. 2-core, 4-core, 8-core CPU and RAM tier).' },
      { flag: '-s, --status', description: 'Displays current container provisioning and uptime status.' },
    ],
    gitInternals: {
      objectType: 'Cloud Docker Container with DevContainer Spec',
      explanation: 'Spins up containerized Linux development environment initialized via `.devcontainer/devcontainer.json` with pre-cloned repository.',
      storageLocation: '.devcontainer/devcontainer.json and Azure cloud container instances',
    },
  },

  // =========================================================================
  // TOPIC 18: More GitHub Features (Needs Synopsis, Options, GitInternals)
  // =========================================================================
  'c-gh-discussions': {
    synopsis: 'gh api graphql -f query="query { repository(owner:\\"o\\", name:\\"r\\") { discussions(first:10) { nodes { title } } } }"',
    options: [
      { flag: 'category', description: 'Sorts discussions into Q&A, Ideas, Announcements, or General forums.' },
      { flag: 'answer', description: 'Marks community reply as verified correct answer for community reference.' },
    ],
    gitInternals: {
      objectType: 'Collaborative Community Knowledge Base',
      explanation: 'Forum discussion threads stored outside Git commit tree to preserve repository history from non-code noise.',
      storageLocation: 'GitHub cloud forum discussion database',
    },
  },

  'c-gh-pages': {
    synopsis: 'git push origin main [or gh-pages branch] -> deployed to https://<user>.github.io/<repo>',
    options: [
      { flag: 'Source branch', description: 'Designates publishing source branch (usually `gh-pages` or `main /docs`).' },
      { flag: 'Custom domain', description: 'Points CNAME record to custom domain with automatic Let\'s Encrypt SSL certificate.' },
    ],
    gitInternals: {
      objectType: 'Static CDN Site Deployment',
      explanation: 'GitHub deploys static HTML/CSS/JS assets from designated branch to globally distributed Fastly CDN edge caching nodes.',
      storageLocation: 'GitHub Pages CDN edge servers and CNAME configuration file',
    },
  },

  'c-gh-security': {
    synopsis: 'gh secret list | Dependabot automated security PRs',
    options: [
      { flag: 'interval: daily', description: 'Configures daily scanning of project manifest files (package.json, requirements.txt).' },
      { flag: 'open-pull-requests-limit', description: 'Caps number of concurrent automated vulnerability patching PRs.' },
    ],
    gitInternals: {
      objectType: 'Vulnerability Advisory Database Matcher',
      explanation: 'Scans dependency lockfiles against the GitHub Advisory Database (CVE catalog) and dispatches automated patch pull requests.',
      storageLocation: '.github/dependabot.yml and GitHub Advisory Database',
    },
  },
};
