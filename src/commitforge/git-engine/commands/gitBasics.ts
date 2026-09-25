import { GitRepo, CommandResult, Commit, ReflogEntry } from '../types';
import { ParsedCommand } from '../parser';
import { getFileStatuses } from '../stateInspector';
import { generateGitHash } from '../hash';
import { computeLineDiff, formatGitDiffOutput } from '../diff';

export function executeGitBasics(cmd: ParsedCommand, repo: GitRepo): CommandResult {
  const sub = cmd.subCommand;

  // git --version
  if (sub === '--version' || sub === '-v' || sub === 'version') {
    return {
      stdout: ['git version 2.44.0 (CommitForge Education Engine)'],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: false,
      repo,
      educationalFeedback: 'CommitForge runs a full deterministic in-browser Git simulation engine.',
    };
  }

  // git init
  if (sub === 'init') {
    if (repo.initialized) {
      return {
        stdout: [`Reinitialized existing Git repository in ${repo.currentDir}/.git/`],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    const defaultBranch = repo.config['init.defaultBranch'] || 'main';
    const newRepo: GitRepo = {
      ...repo,
      initialized: true,
      head: { type: 'branch', ref: defaultBranch },
      branches: {
        [defaultBranch]: {
          name: defaultBranch,
          targetCommitHash: '',
        },
      },
      reflog: [],
    };

    return {
      stdout: [
        `Initialized empty Git repository in ${repo.currentDir}/.git/`,
      ],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: true,
      repo: newRepo,
      whyExplanation: {
        summary: `Created .git/ directory and initialized branch '${defaultBranch}'.`,
        headMoved: `HEAD now points to the newborn branch '${defaultBranch}'.`,
        indexState: 'Staging area (index) is currently empty.',
        workingState: 'Existing files remain in the working tree as untracked files.',
        historyState: 'No commits exist yet.',
      },
      educationalFeedback: `Repository initialized on branch '${defaultBranch}'. Git is now ready to track file snapshots.`,
    };
  }

  // Ensure repo is initialized for all other git commands
  if (!repo.initialized) {
    return {
      stdout: [],
      stderr: ['fatal: not a git repository (or any of the parent directories): .git'],
      exitCode: 128,
      dangerLevel: 'SAFE',
      stateChanged: false,
      repo,
      educationalFeedback: 'You must initialize a Git repository first using `git init`.',
    };
  }

  // git status
  if (sub === 'status') {
    const statuses = getFileStatuses(repo);
    const lines: string[] = [];

    if (repo.head.type === 'detached') {
      const commit = repo.commits[repo.head.ref];
      lines.push(`HEAD detached at ${commit ? commit.shortHash : repo.head.ref}`);
    } else {
      const currentBranch = repo.head.ref;
      lines.push(`On branch ${currentBranch}`);

      const branch = repo.branches[currentBranch];
      if (branch?.upstream) {
        const [remoteName, remoteBranchName] = branch.upstream.split('/');
        const remoteBranch = repo.remotes[remoteName]?.branches[remoteBranchName];
        if (remoteBranch) {
          if (branch.targetCommitHash === remoteBranch.targetCommitHash) {
            lines.push(`Your branch is up to date with '${branch.upstream}'.`);
          } else {
            lines.push(`Your branch has changes compared to '${branch.upstream}'.`);
          }
        }
      } else {
        lines.push(`No remote upstream configured for '${currentBranch}'.`);
      }
    }

    const staged = statuses.filter(s => s.isStagedNew || s.isStagedModified || s.isStagedDeleted);
    const unstaged = statuses.filter(s => s.isModified || s.isWorkingDeleted);
    const untracked = statuses.filter(s => s.isUntracked);

    if (staged.length > 0) {
      lines.push('');
      lines.push('Changes to be committed:');
      lines.push('  (use "git restore --staged <file>..." to unstage)');
      for (const s of staged) {
        if (s.isStagedNew) lines.push(`\tnew file:   ${s.path}`);
        else if (s.isStagedDeleted) lines.push(`\tdeleted:    ${s.path}`);
        else lines.push(`\tmodified:   ${s.path}`);
      }
    }

    if (unstaged.length > 0) {
      lines.push('');
      lines.push('Changes not staged for commit:');
      lines.push('  (use "git add <file>..." to update what will be committed)');
      lines.push('  (use "git restore <file>..." to discard changes in working directory)');
      for (const s of unstaged) {
        if (s.isWorkingDeleted) lines.push(`\tdeleted:    ${s.path}`);
        else lines.push(`\tmodified:   ${s.path}`);
      }
    }

    if (untracked.length > 0) {
      lines.push('');
      lines.push('Untracked files:');
      lines.push('  (use "git add <file>..." to include in what will be committed)');
      for (const s of untracked) {
        lines.push(`\t${s.path}`);
      }
    }

    if (staged.length === 0 && unstaged.length === 0 && untracked.length === 0) {
      lines.push('nothing to commit, working tree clean');
    } else if (staged.length === 0 && (unstaged.length > 0 || untracked.length > 0)) {
      lines.push('');
      lines.push('no changes added to commit (use "git add" to stage)');
    }

    return {
      stdout: lines,
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: false,
      repo,
      educationalFeedback: `git status inspects the Three Areas: Working Directory vs Staging Area vs HEAD repository.`,
    };
  }

  // git add <args...>
  if (sub === 'add') {
    if (cmd.args.length === 0 && !cmd.flags['A'] && !cmd.flags['all']) {
      return {
        stdout: [],
        stderr: ['fatal: Nothing specified, nothing added.'],
        exitCode: 1,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    const newIndex = { ...repo.index };
    const target = cmd.args[0] || '.';
    const warnings: string[] = [];

    // Check .gitignore patterns
    const isIgnored = (path: string) => repo.ignoredPatterns.some(pat => {
      if (pat.startsWith('*.')) return path.endsWith(pat.slice(1));
      return path === pat || path.startsWith(pat + '/');
    });

    if (target === '.' || target === '-A' || cmd.flags['A'] || cmd.flags['all']) {
      // Stage all working directory files
      for (const [path, content] of Object.entries(repo.workingDirectory)) {
        if (!isIgnored(path)) {
          newIndex[path] = content;
          if (path === '.env' && /SECRET|KEY|PASSWORD|TOKEN/i.test(content)) {
            warnings.push('⚠️ SECURITY WARNING: .env contains secret keys! Avoid committing secrets into version control.');
          }
        }
      }
      // Stage deleted files
      for (const path of Object.keys(repo.index)) {
        if (repo.workingDirectory[path] === undefined) {
          delete newIndex[path];
        }
      }
    } else {
      for (const fileArg of cmd.args) {
        if (repo.workingDirectory[fileArg] !== undefined) {
          if (isIgnored(fileArg) && !cmd.flags['f'] && !cmd.flags['force']) {
            return {
              stdout: [],
              stderr: [`The following paths are ignored by one of your .gitignore files:`, fileArg, `Use -f if you really want to add them.`],
              exitCode: 1,
              dangerLevel: 'SAFE',
              stateChanged: false,
              repo,
            };
          }
          newIndex[fileArg] = repo.workingDirectory[fileArg];
          if (fileArg === '.env' && /SECRET|KEY|PASSWORD|TOKEN/i.test(repo.workingDirectory[fileArg])) {
            warnings.push('⚠️ SECURITY WARNING: .env contains secret keys! Avoid committing secrets into version control.');
          }
        } else if (repo.index[fileArg] !== undefined) {
          // File was deleted from working directory, stage the deletion
          delete newIndex[fileArg];
        } else {
          return {
            stdout: [],
            stderr: [`fatal: pathspec '${fileArg}' did not match any files`],
            exitCode: 128,
            dangerLevel: 'SAFE',
            stateChanged: false,
            repo,
          };
        }
      }
    }

    // Check if -p or --patch was used
    if (cmd.flags['p'] || cmd.flags['patch']) {
      const targetFile = cmd.args[0] || Object.keys(repo.workingDirectory)[0];
      if (targetFile && repo.workingDirectory[targetFile]) {
        newIndex[targetFile] = repo.workingDirectory[targetFile];
        warnings.push(`diff --git a/${targetFile} b/${targetFile}`);
        warnings.push(`@@ -1,3 +1,3 @@`);
        warnings.push(`(1/1) Stage this hunk [y,n,q,a,d,s,e,?]? y`);
        warnings.push(`Staged 1 hunk into staging area.`);
      }
    }

    const changedCount = Object.keys(newIndex).length;

    return {
      stdout: warnings,
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: true,
      repo: { ...repo, index: newIndex },
      whyExplanation: {
        summary: `Moved changes from the Working Directory into the Staging Area (Index).`,
        headMoved: 'HEAD did not move.',
        indexState: `Staging Area now contains ${changedCount} file snapshot(s) prepared for the next commit.`,
        workingState: 'Working Directory files remain intact.',
        historyState: 'No commits were created yet.',
      },
      educationalFeedback: `Staged changes. Files now reside in the Staging Area, ready for 'git commit'.`,
    };
  }

  // git commit
  if (sub === 'commit') {
    const isAmend = Boolean(cmd.flags['amend']);
    let message = (cmd.flags['m'] as string) || (cmd.flags['message'] as string) || '';
    
    // Check if -a or -am was used
    let activeIndex = { ...repo.index };
    if (cmd.flags['a']) {
      // Stage all modified tracked files
      for (const [p, content] of Object.entries(repo.workingDirectory)) {
        if (activeIndex[p] !== undefined) {
          activeIndex[p] = content;
        }
      }
    }

    // Determine current HEAD commit
    let currentCommitHash = '';
    if (repo.head.type === 'branch') {
      const branch = repo.branches[repo.head.ref];
      currentCommitHash = branch ? branch.targetCommitHash : '';
    } else {
      currentCommitHash = repo.head.ref;
    }

    // Handle git commit --amend
    if (isAmend) {
      if (!currentCommitHash || !repo.commits[currentCommitHash]) {
        return {
          stdout: [],
          stderr: ['fatal: You have no commits to amend.'],
          exitCode: 1,
          dangerLevel: 'MEDIUM',
          stateChanged: false,
          repo,
        };
      }

      const prevCommit = repo.commits[currentCommitHash];
      const finalMessage = message || prevCommit.message;
      const mergedFiles = { ...prevCommit.files, ...activeIndex };
      const { hash: amendHash, shortHash: amendShortHash } = generateGitHash(finalMessage + JSON.stringify(mergedFiles) + Date.now());

      const amendedCommit: Commit = {
        hash: amendHash,
        shortHash: amendShortHash,
        parents: prevCommit.parents,
        tree: {},
        files: mergedFiles,
        author: prevCommit.author,
        email: prevCommit.email,
        date: new Date().toISOString(),
        timestamp: Date.now(),
        message: finalMessage,
      };

      const newCommits = { ...repo.commits, [amendHash]: amendedCommit };
      const newBranches = { ...repo.branches };
      let newHead = { ...repo.head };

      if (repo.head.type === 'branch') {
        const branchName = repo.head.ref;
        newBranches[branchName] = {
          ...newBranches[branchName],
          targetCommitHash: amendHash,
        };
      } else {
        newHead = { type: 'detached', ref: amendHash };
      }

      const newReflog: ReflogEntry[] = [
        {
          index: repo.reflog.length,
          fromHash: currentCommitHash,
          toHash: amendHash,
          action: 'commit (amend)',
          message: `commit (amend): ${finalMessage}`,
          timestamp: Date.now(),
        },
        ...repo.reflog,
      ];

      return {
        stdout: [
          `[${repo.head.type === 'branch' ? repo.head.ref : 'detached HEAD'} ${amendShortHash}] ${finalMessage}`,
          ` Date: ${new Date().toISOString()}`,
          ` Amended commit ${prevCommit.shortHash} -> ${amendShortHash}`,
        ],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'MEDIUM',
        stateChanged: true,
        repo: {
          ...repo,
          commits: newCommits,
          branches: newBranches,
          head: newHead,
          reflog: newReflog,
        },
        educationalFeedback: `Amended latest commit without creating a child commit. Replaced ${prevCommit.shortHash} with ${amendShortHash}.`,
      };
    }

    // Check if anything is staged
    const statuses = getFileStatuses({ ...repo, index: activeIndex });
    const staged = statuses.filter(s => s.isStagedNew || s.isStagedModified || s.isStagedDeleted);

    if (staged.length === 0 && !repo.mergeState?.inProgress) {
      const unstaged = statuses.filter(s => s.isModified || s.isUntracked);
      return {
        stdout: [
          `On branch ${repo.head.type === 'branch' ? repo.head.ref : 'HEAD'}`,
          unstaged.length > 0 ? 'Changes not staged for commit:' : 'nothing to commit, working tree clean',
          ...(unstaged.length > 0 ? ['  (use "git add <file>..." to stage changes)'] : []),
        ],
        stderr: [],
        exitCode: 1,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
        educationalFeedback: 'You must stage your changes using `git add` before committing them. Git only commits what is inside the Staging Area.',
      };
    }

    if (!message) {
      if (repo.mergeState?.inProgress) {
        message = `Merge branch '${repo.mergeState.sourceBranch}' into ${repo.mergeState.targetBranch}`;
      } else {
        return {
          stdout: [],
          stderr: ['error: empty commit message. Use `git commit -m "Your descriptive message"`'],
          exitCode: 1,
          dangerLevel: 'SAFE',
          stateChanged: false,
          repo,
        };
      }
    }

    // Quality check commit message
    const lowQualityMessages = ['fix', 'changes', 'stuff', 'update', 'test', 'asdf', 'wip', 'commit'];
    const warnings: string[] = [];
    if (lowQualityMessages.includes(message.trim().toLowerCase())) {
      warnings.push(`💡 Professional Tip: Commit message "${message}" is very vague.`);
      warnings.push(`Good commit messages describe the 'why' and 'what' (e.g. "Fix checkout discount code calculation").`);
    }

    // Check secrets
    for (const [p, content] of Object.entries(activeIndex)) {
      if (p.includes('.env') || /api_key\s*=\s*['"]?[a-zA-Z0-9_-]{10,}/i.test(content)) {
        warnings.push('🚨 WARNING: You committed potential secrets/API keys! In professional repositories, secrets must be in .env and ignored by .gitignore.');
      }
    }

    // Build commit snapshot
    const commitFiles: Record<string, string> = { ...activeIndex };
    const { hash, shortHash } = generateGitHash(message + JSON.stringify(commitFiles));

    let parents: string[] = [];
    if (currentCommitHash) {
      parents.push(currentCommitHash);
    }

    if (repo.mergeState?.inProgress && repo.mergeState.sourceCommit) {
      parents.push(repo.mergeState.sourceCommit);
    }

    const userName = repo.config['user.name'] || 'Developer';
    const userEmail = repo.config['user.email'] || 'developer@commitforge.dev';

    const newCommit: Commit = {
      hash,
      shortHash,
      parents,
      tree: {},
      files: commitFiles,
      author: userName,
      email: userEmail,
      date: new Date().toISOString(),
      timestamp: Date.now(),
      message,
    };

    const newCommits = { ...repo.commits, [hash]: newCommit };
    const newBranches = { ...repo.branches };
    let newHead = { ...repo.head };

    if (repo.head.type === 'branch') {
      const branchName = repo.head.ref;
      newBranches[branchName] = {
        ...newBranches[branchName],
        targetCommitHash: hash,
      };
    } else {
      newHead = { type: 'detached', ref: hash };
    }

    // Add to reflog
    const newReflog: ReflogEntry[] = [
      {
        index: repo.reflog.length,
        fromHash: currentCommitHash || '0000000',
        toHash: hash,
        action: repo.mergeState?.inProgress ? 'merge' : 'commit',
        message: `${repo.mergeState?.inProgress ? 'commit (merge):' : 'commit:'} ${message}`,
        timestamp: Date.now(),
      },
      ...repo.reflog,
    ];

    const out = [
      ...warnings,
      `[${repo.head.type === 'branch' ? repo.head.ref : 'detached HEAD'} ${shortHash}] ${message}`,
      ` ${staged.length} file(s) changed`,
    ];

    return {
      stdout: out,
      stderr: [],
      exitCode: 0,
      dangerLevel: 'LOW',
      stateChanged: true,
      repo: {
        ...repo,
        commits: newCommits,
        branches: newBranches,
        head: newHead,
        reflog: newReflog,
        mergeState: null, // Clear merge in progress once committed
      },
      whyExplanation: {
        summary: `Created permanent snapshot ${shortHash} and updated ${repo.head.type === 'branch' ? repo.head.ref : 'detached HEAD'}.`,
        headMoved: `HEAD now points to new commit ${shortHash}.`,
        indexState: 'Staging Area is now synchronized with HEAD commit.',
        workingState: 'Working Directory is clean relative to the new commit.',
        historyState: `Commit DAG extended: ${parents.length > 0 ? repo.commits[parents[0]]?.shortHash || 'root' : 'root'} ➔ ${shortHash}`,
      },
      educationalFeedback: `Created commit ${shortHash}: "${message}". This snapshot is now permanently recorded in Git history.`,
    };
  }

  // git log
  if (sub === 'log') {
    const isOneLine = cmd.flags['oneline'] || cmd.flags['o'];
    const isGraph = Boolean(cmd.flags['graph']);
    const isAll = Boolean(cmd.flags['all']);
    const searchStr = (cmd.flags['S'] as string) || '';
    const searchRegex = (cmd.flags['G'] as string) || '';
    let maxCount = cmd.flags['n'] ? parseInt(cmd.flags['n'] as string, 10) : 50;

    let headCommitHash = repo.head.type === 'branch'
      ? repo.branches[repo.head.ref]?.targetCommitHash
      : repo.head.ref;

    if (!headCommitHash || !repo.commits[headCommitHash]) {
      return {
        stdout: [],
        stderr: [`fatal: your current branch '${repo.head.ref}' does not have any commits yet`],
        exitCode: 128,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    const lines: string[] = [];
    const queue: string[] = isAll
      ? Array.from(new Set(Object.values(repo.branches).map(b => b.targetCommitHash).concat([headCommitHash])))
      : [headCommitHash];

    let count = 0;
    const visited = new Set<string>();

    while (queue.length > 0 && count < maxCount) {
      const h = queue.shift()!;
      if (!h || visited.has(h) || !repo.commits[h]) continue;
      visited.add(h);

      const commit = repo.commits[h];

      // Pickaxe / search filtering
      if (searchStr) {
        const matchesMsg = commit.message.toLowerCase().includes(searchStr.toLowerCase());
        const matchesFiles = Object.values(commit.files).some(content => content.toLowerCase().includes(searchStr.toLowerCase()));
        if (!matchesMsg && !matchesFiles) continue;
      }

      if (searchRegex) {
        try {
          const reg = new RegExp(searchRegex, 'i');
          const matchesMsg = reg.test(commit.message);
          const matchesFiles = Object.values(commit.files).some(content => reg.test(content));
          if (!matchesMsg && !matchesFiles) continue;
        } catch {
          // ignore bad regex
        }
      }

      count++;

      // Find branch/tag decorations
      const decorations: string[] = [];
      if (h === headCommitHash) {
        decorations.push(repo.head.type === 'branch' ? `HEAD -> ${repo.head.ref}` : 'HEAD');
      }
      for (const [bName, branch] of Object.entries(repo.branches)) {
        if (branch.targetCommitHash === h && (repo.head.type !== 'branch' || repo.head.ref !== bName)) {
          decorations.push(bName);
        }
      }
      for (const [rName, remote] of Object.entries(repo.remotes)) {
        for (const [rbName, rBranch] of Object.entries(remote.branches)) {
          if (rBranch.targetCommitHash === h) {
            decorations.push(`${rName}/${rbName}`);
          }
        }
      }
      for (const [tName, tag] of Object.entries(repo.tags)) {
        if (tag.targetCommitHash === h) {
          decorations.push(`tag: ${tName}`);
        }
      }

      const decStr = decorations.length > 0 ? ` (${decorations.join(', ')})` : '';
      const graphPrefix = isGraph ? '* ' : '';

      if (isOneLine) {
        lines.push(`${graphPrefix}${commit.shortHash}${decStr} ${commit.message}`);
      } else {
        lines.push(`${graphPrefix}commit ${commit.hash}${decStr}`);
        if (commit.parents.length > 1) {
          lines.push(`${isGraph ? '| ' : ''}Merge: ${commit.parents.map(p => p.slice(0, 7)).join(' ')}`);
        }
        lines.push(`${isGraph ? '| ' : ''}Author: ${commit.author} <${commit.email}>`);
        lines.push(`${isGraph ? '| ' : ''}Date:   ${new Date(commit.timestamp).toUTCString()}`);
        lines.push(`${isGraph ? '|' : ''}`);
        lines.push(`${isGraph ? '|   ' : '    '}${commit.message}`);
        lines.push(`${isGraph ? '|' : ''}`);
      }

      for (const parent of commit.parents) {
        if (!visited.has(parent)) {
          queue.push(parent);
        }
      }
    }

    return {
      stdout: lines.length > 0 ? lines : ['(no commits matching filter)'],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: false,
      repo,
      educationalFeedback: `git log walks backwards along parent commit pointers starting from ${isAll ? 'all refs' : 'HEAD'}.`,
    };
  }

  // git help
  if (sub === 'help') {
    const topic = cmd.args[0];
    if (topic) {
      return {
        stdout: [
          `Usage: git ${topic} [options]`,
          `Run 'CommitForge Encyclopedia' or open Command Reference to inspect all ${topic} variants and repository state transitions.`,
        ],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }
    return {
      stdout: [
        'CommitForge Git Core Help:',
        '  status     Show the working tree status',
        '  add        Add file contents to the staging area',
        '  commit     Record changes to the repository',
        '  log        Show commit logs',
        '  diff       Show changes between commits, commit and working tree',
        '  branch     List, create, or delete branches',
        '  switch     Switch branches',
        '  merge      Join two or more development histories together',
        '  reset      Reset current HEAD to the specified state',
        '  revert     Revert some existing commits',
        '',
        'Use "git help <command>" for detailed documentation.',
      ],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: false,
      repo,
    };
  }

  // git diff
  if (sub === 'diff') {
    const isStaged = cmd.flags['staged'] || cmd.flags['cached'];
    const lines: string[] = [];

    let headFiles: Record<string, string> = {};
    const headCommitHash = repo.head.type === 'branch'
      ? repo.branches[repo.head.ref]?.targetCommitHash
      : repo.head.ref;

    if (headCommitHash && repo.commits[headCommitHash]) {
      headFiles = repo.commits[headCommitHash].files;
    }

    if (isStaged) {
      // Index vs HEAD
      const allPaths = new Set([...Object.keys(repo.index), ...Object.keys(headFiles)]);
      for (const p of Array.from(allPaths).sort()) {
        const indexVal = repo.index[p] ?? null;
        const headVal = headFiles[p] ?? null;
        if (indexVal !== headVal) {
          const diff = computeLineDiff(headVal, indexVal, p);
          lines.push(...formatGitDiffOutput(diff));
        }
      }
    } else {
      // Working Directory vs Index (or HEAD if not staged)
      const allPaths = new Set([...Object.keys(repo.workingDirectory), ...Object.keys(repo.index)]);
      for (const p of Array.from(allPaths).sort()) {
        const workingVal = repo.workingDirectory[p] ?? null;
        const indexVal = repo.index[p] ?? null;
        if (workingVal !== null && indexVal !== null && workingVal !== indexVal) {
          const diff = computeLineDiff(indexVal, workingVal, p);
          lines.push(...formatGitDiffOutput(diff));
        } else if (workingVal === null && indexVal !== null) {
          const diff = computeLineDiff(indexVal, null, p);
          lines.push(...formatGitDiffOutput(diff));
        }
      }
    }

    return {
      stdout: lines.length > 0 ? lines : [''],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: false,
      repo,
      educationalFeedback: isStaged
        ? 'git diff --staged shows differences between the Staging Area and HEAD commit.'
        : 'git diff shows unstaged differences between your Working Directory and the Staging Area.',
    };
  }

  // git show
  if (sub === 'show') {
    const target = cmd.args[0] || 'HEAD';
    let targetHash = target;

    if (target === 'HEAD') {
      targetHash = repo.head.type === 'branch'
        ? repo.branches[repo.head.ref]?.targetCommitHash
        : repo.head.ref;
    } else if (repo.branches[target]) {
      targetHash = repo.branches[target].targetCommitHash;
    } else if (repo.tags[target]) {
      targetHash = repo.tags[target].targetCommitHash;
    } else {
      // Match short hash
      const found = Object.keys(repo.commits).find(h => h.startsWith(target));
      if (found) targetHash = found;
    }

    const commit = repo.commits[targetHash];
    if (!commit) {
      return {
        stdout: [],
        stderr: [`fatal: bad object ${target}`],
        exitCode: 128,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    const parentFiles = commit.parents[0] && repo.commits[commit.parents[0]]
      ? repo.commits[commit.parents[0]].files
      : {};

    const diffLines: string[] = [];
    const allPaths = new Set([...Object.keys(commit.files), ...Object.keys(parentFiles)]);

    for (const p of Array.from(allPaths).sort()) {
      const oldVal = parentFiles[p] ?? null;
      const newVal = commit.files[p] ?? null;
      if (oldVal !== newVal) {
        const diff = computeLineDiff(oldVal, newVal, p);
        diffLines.push(...formatGitDiffOutput(diff));
      }
    }

    return {
      stdout: [
        `commit ${commit.hash}`,
        `Author: ${commit.author} <${commit.email}>`,
        `Date:   ${new Date(commit.timestamp).toUTCString()}`,
        '',
        `    ${commit.message}`,
        '',
        ...diffLines,
      ],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: false,
      repo,
      educationalFeedback: `git show inspects a specific commit object and shows its metadata plus patch diff.`,
    };
  }

  // git rm
  if (sub === 'rm') {
    const fileName = cmd.args[0];
    if (!fileName) {
      return {
        stdout: [],
        stderr: ['fatal: No path specified'],
        exitCode: 1,
        dangerLevel: 'MEDIUM',
        stateChanged: false,
        repo,
      };
    }

    const newIndex = { ...repo.index };
    const newWorking = { ...repo.workingDirectory };

    delete newIndex[fileName];
    if (!cmd.flags['cached']) {
      delete newWorking[fileName];
    }

    return {
      stdout: [`rm '${fileName}'`],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'MEDIUM',
      stateChanged: true,
      repo: { ...repo, index: newIndex, workingDirectory: newWorking },
      educationalFeedback: cmd.flags['cached']
        ? `Untracked '${fileName}' from Git staging while leaving physical file on disk.`
        : `Removed '${fileName}' from working directory and staged the deletion.`,
    };
  }

  // git mv
  if (sub === 'mv') {
    const src = cmd.args[0];
    const dest = cmd.args[1];

    if (!src || !dest) {
      return {
        stdout: [],
        stderr: ['fatal: destination missing after ' + (src || 'arguments')],
        exitCode: 1,
        dangerLevel: 'LOW',
        stateChanged: false,
        repo,
      };
    }

    const content = repo.workingDirectory[src];
    if (content === undefined) {
      return {
        stdout: [],
        stderr: [`fatal: bad source, source=${src}`],
        exitCode: 1,
        dangerLevel: 'LOW',
        stateChanged: false,
        repo,
      };
    }

    const newWorking = { ...repo.workingDirectory };
    const newIndex = { ...repo.index };

    delete newWorking[src];
    delete newIndex[src];

    newWorking[dest] = content;
    newIndex[dest] = content;

    return {
      stdout: [],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'LOW',
      stateChanged: true,
      repo: { ...repo, workingDirectory: newWorking, index: newIndex },
      educationalFeedback: `Renamed '${src}' to '${dest}' and staged the change automatically.`,
    };
  }

  return {
    stdout: [],
    stderr: [`git: '${sub}' is not a recognized command. See 'git --help'.`],
    exitCode: 1,
    dangerLevel: 'SAFE',
    stateChanged: false,
    repo,
  };
}
