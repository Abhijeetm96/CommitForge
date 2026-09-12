import { GitRepo, CommandResult, Commit, StashEntry, Tag, BisectState, RebaseState, ReflogEntry } from '../types';
import { ParsedCommand } from '../parser';
import { generateGitHash } from '../hash';
import { resolveCommitRef } from './historyRecovery';
import { findLCA } from './branchMerge';

export function executeAdvanced(cmd: ParsedCommand, repo: GitRepo): CommandResult {
  const sub = cmd.subCommand;

  // git stash
  if (sub === 'stash') {
    const action = cmd.args[0] || 'push';

    if (action === 'push' || action === 'save' || (cmd.args.length === 0 && sub === 'stash')) {
      const message = cmd.args[1] || (cmd.flags['m'] as string) || 'WIP on ' + (repo.head.type === 'branch' ? repo.head.ref : 'HEAD');
      
      let headFiles: Record<string, string> = {};
      const headHash = repo.head.type === 'branch' ? repo.branches[repo.head.ref]?.targetCommitHash : repo.head.ref;
      if (headHash && repo.commits[headHash]) {
        headFiles = repo.commits[headHash].files;
      }

      // Check if working tree has any changes
      const hasWorkingChanges = Object.keys(repo.workingDirectory).some(p => repo.workingDirectory[p] !== headFiles[p]);
      const hasIndexChanges = Object.keys(repo.index).some(p => repo.index[p] !== headFiles[p]);

      if (!hasWorkingChanges && !hasIndexChanges) {
        return {
          stdout: ['No local changes to save'],
          stderr: [],
          exitCode: 0,
          dangerLevel: 'SAFE',
          stateChanged: false,
          repo,
        };
      }

      const stashItem: StashEntry = {
        id: repo.stash.length,
        message,
        branch: repo.head.type === 'branch' ? repo.head.ref : 'HEAD',
        workingFiles: { ...repo.workingDirectory },
        indexFiles: { ...repo.index },
        timestamp: Date.now(),
      };

      return {
        stdout: [`Saved working directory and index state "${message}"`],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'LOW',
        stateChanged: true,
        repo: {
          ...repo,
          stash: [stashItem, ...repo.stash],
          workingDirectory: { ...headFiles },
          index: { ...headFiles },
        },
        whyExplanation: {
          summary: `Stashed dirty working tree and staging area onto the stash stack.`,
          headMoved: 'HEAD did not move.',
          indexState: 'Reset to match HEAD commit.',
          workingState: 'Reset to match HEAD commit (clean working directory).',
          historyState: 'Stash stack now contains saved temporary work.',
        },
        educationalFeedback: `Stashed your uncommitted work! Your working directory is now clean, so you can switch branches or fix hotfixes safely.`,
      };
    }

    if (action === 'list') {
      if (repo.stash.length === 0) {
        return {
          stdout: ['(stash stack is empty)'],
          stderr: [],
          exitCode: 0,
          dangerLevel: 'SAFE',
          stateChanged: false,
          repo,
        };
      }

      const lines = repo.stash.map((s, idx) => `stash@{${idx}}: ${s.message}`);
      return {
        stdout: lines,
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
        educationalFeedback: `git stash list shows saved stashes. Use 'git stash pop' to apply the top stash and delete it.`,
      };
    }

    if (action === 'pop' || action === 'apply') {
      if (repo.stash.length === 0) {
        return {
          stdout: [],
          stderr: ['error: No stash entries found.'],
          exitCode: 1,
          dangerLevel: 'SAFE',
          stateChanged: false,
          repo,
        };
      }

      const top = repo.stash[0];
      const newStash = action === 'pop' ? repo.stash.slice(1) : repo.stash;

      return {
        stdout: [
          `On branch ${repo.head.type === 'branch' ? repo.head.ref : 'HEAD'}`,
          `Changes restored from stash: ${top.message}`,
          action === 'pop' ? `Dropped stash@{0} (${top.message})` : '',
        ].filter(Boolean),
        stderr: [],
        exitCode: 0,
        dangerLevel: 'LOW',
        stateChanged: true,
        repo: {
          ...repo,
          workingDirectory: { ...top.workingFiles },
          index: { ...top.indexFiles },
          stash: newStash,
        },
        whyExplanation: {
          summary: `Restored files from stash ${action === 'pop' ? 'and removed it from stash stack' : 'while preserving stash'}.`,
          headMoved: 'HEAD did not move.',
          indexState: 'Restored staged changes from stash.',
          workingState: 'Restored working directory modifications from stash.',
          historyState: 'Unchanged.',
        },
        comparisons: {
          title: 'stash pop vs stash apply',
          options: [
            { label: 'git stash pop', description: 'Apply + Drop', effect: 'Restores the stashed changes AND deletes the stash entry from the stack.' },
            { label: 'git stash apply', description: 'Apply only', effect: 'Restores the stashed changes but keeps the stash entry in the stack for reuse.' },
          ],
        },
        educationalFeedback: `Restored stashed work! You can now continue your feature development.`,
      };
    }

    if (action === 'drop' || action === 'clear') {
      return {
        stdout: ['Dropped all stash entries.'],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'MEDIUM',
        stateChanged: true,
        repo: { ...repo, stash: [] },
        educationalFeedback: 'Emptied the stash stack.',
      };
    }
  }

  // git tag
  if (sub === 'tag') {
    const tagName = cmd.args[0];
    const message = (cmd.flags['m'] as string) || (cmd.flags['a'] ? `Release ${tagName}` : undefined);
    const isDelete = cmd.flags['d'];

    if (isDelete) {
      const target = typeof isDelete === 'string' ? isDelete : cmd.args[0];
      const newTags = { ...repo.tags };
      delete newTags[target];
      return {
        stdout: [`Deleted tag '${target}'`],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'LOW',
        stateChanged: true,
        repo: { ...repo, tags: newTags },
        educationalFeedback: `Deleted tag '${target}'.`,
      };
    }

    if (tagName) {
      let headHash = repo.head.type === 'branch' ? repo.branches[repo.head.ref]?.targetCommitHash : repo.head.ref;
      if (!headHash) {
        return {
          stdout: [],
          stderr: ['fatal: Failed to resolve HEAD as a valid ref.'],
          exitCode: 1,
          dangerLevel: 'SAFE',
          stateChanged: false,
          repo,
        };
      }

      const newTag: Tag = {
        name: tagName,
        targetCommitHash: headHash,
        annotated: !!cmd.flags['a'] || !!message,
        message,
        date: new Date().toISOString(),
      };

      return {
        stdout: [],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: true,
        repo: { ...repo, tags: { ...repo.tags, [tagName]: newTag } },
        whyExplanation: {
          summary: `Created ${newTag.annotated ? 'annotated' : 'lightweight'} tag '${tagName}' at commit ${headHash.slice(0, 7)}.`,
          headMoved: 'HEAD did not move.',
          indexState: 'Unchanged.',
          workingState: 'Unchanged.',
          historyState: `Tag reference saved at commit ${headHash.slice(0, 7)}.`,
        },
        educationalFeedback: `Tagged commit ${headHash.slice(0, 7)} with '${tagName}'. Tags are static milestones typically used for software releases (e.g. v1.0.0).`,
      };
    }

    // List tags
    const lines = Object.keys(repo.tags).sort();
    return {
      stdout: lines.length > 0 ? lines : ['(no tags found)'],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: false,
      repo,
      educationalFeedback: `git tag lists all milestone release tags.`,
    };
  }

  // git cherry-pick
  if (sub === 'cherry-pick') {
    const targetRef = cmd.args[0];
    const targetCommitHash = resolveCommitRef(targetRef, repo);

    if (!targetCommitHash || !repo.commits[targetCommitHash]) {
      return {
        stdout: [],
        stderr: [`fatal: bad revision '${targetRef}'`],
        exitCode: 128,
        dangerLevel: 'LOW',
        stateChanged: false,
        repo,
      };
    }

    const sourceCommit = repo.commits[targetCommitHash];
    const parentHash = sourceCommit.parents[0];
    const parentFiles = parentHash && repo.commits[parentHash] ? repo.commits[parentHash].files : {};

    // Apply the changes from sourceCommit onto current HEAD
    const currentHeadHash = repo.head.type === 'branch' ? repo.branches[repo.head.ref]?.targetCommitHash : repo.head.ref;
    const currentCommit = currentHeadHash ? repo.commits[currentHeadHash] : null;
    const currentFiles = currentCommit ? currentCommit.files : {};

    const newFiles = { ...currentFiles };
    for (const [p, content] of Object.entries(sourceCommit.files)) {
      if (parentFiles[p] !== content) {
        newFiles[p] = content;
      }
    }

    const cherryMessage = sourceCommit.message;
    const { hash, shortHash } = generateGitHash(cherryMessage + JSON.stringify(newFiles));

    const newCommit: Commit = {
      hash,
      shortHash,
      parents: currentHeadHash ? [currentHeadHash] : [],
      tree: {},
      files: newFiles,
      author: sourceCommit.author,
      email: sourceCommit.email,
      date: new Date().toISOString(),
      timestamp: Date.now(),
      message: cherryMessage,
    };

    const newCommits = { ...repo.commits, [hash]: newCommit };
    const newBranches = { ...repo.branches };
    if (repo.head.type === 'branch') {
      newBranches[repo.head.ref] = {
        ...newBranches[repo.head.ref],
        targetCommitHash: hash,
      };
    }

    const newReflog: ReflogEntry[] = [
      {
        index: repo.reflog.length,
        fromHash: currentHeadHash || '',
        toHash: hash,
        action: 'cherry-pick',
        message: `cherry-pick: ${cherryMessage}`,
        timestamp: Date.now(),
      },
      ...repo.reflog,
    ];

    return {
      stdout: [
        `[${repo.head.type === 'branch' ? repo.head.ref : 'detached HEAD'} ${shortHash}] ${cherryMessage}`,
        ` Date: ${sourceCommit.date}`,
        ` 1 commit cherry-picked`,
      ],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'LOW',
      stateChanged: true,
      repo: {
        ...repo,
        commits: newCommits,
        branches: newBranches,
        workingDirectory: newFiles,
        index: newFiles,
        reflog: newReflog,
      },
      whyExplanation: {
        summary: `Cherry-picked commit ${sourceCommit.shortHash} onto '${repo.head.type === 'branch' ? repo.head.ref : 'HEAD'}'.`,
        headMoved: `HEAD advanced to new copy commit ${shortHash}.`,
        indexState: 'Clean.',
        workingState: 'Clean.',
        historyState: `A duplicate commit with the exact same patch was created with a brand new hash.`,
      },
      educationalFeedback: `Cherry-pick applies a single commit from another branch without merging the entire branch history.`,
    };
  }

  // git rebase
  if (sub === 'rebase') {
    if (cmd.flags['abort']) {
      return {
        stdout: ['Rebase aborted.'],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'LOW',
        stateChanged: true,
        repo: { ...repo, rebaseState: null },
        educationalFeedback: 'Aborted rebase and restored original branch state.',
      };
    }

    const isInteractive = cmd.flags['i'] || cmd.flags['interactive'];
    const targetBranch = cmd.args[0];

    if (!targetBranch) {
      return {
        stdout: [],
        stderr: ['fatal: Specify branch or commit to rebase onto.'],
        exitCode: 1,
        dangerLevel: 'MEDIUM',
        stateChanged: false,
        repo,
      };
    }

    const currentBranchName = repo.head.type === 'branch' ? repo.head.ref : null;
    if (!currentBranchName) {
      return {
        stdout: [],
        stderr: ['fatal: Cannot rebase in detached HEAD state.'],
        exitCode: 1,
        dangerLevel: 'MEDIUM',
        stateChanged: false,
        repo,
      };
    }

    const ontoCommitHash = resolveCommitRef(targetBranch, repo);
    if (!ontoCommitHash || !repo.commits[ontoCommitHash]) {
      return {
        stdout: [],
        stderr: [`fatal: invalid upstream '${targetBranch}'`],
        exitCode: 1,
        dangerLevel: 'MEDIUM',
        stateChanged: false,
        repo,
      };
    }

    const currentCommitHash = repo.branches[currentBranchName].targetCommitHash;
    const lcaHash = findLCA(currentCommitHash, ontoCommitHash, repo.commits);

    // Collect commits on current branch since LCA
    const commitsToReplay: Commit[] = [];
    let curr: string | null = currentCommitHash;
    while (curr && curr !== lcaHash && repo.commits[curr]) {
      commitsToReplay.unshift(repo.commits[curr]);
      curr = repo.commits[curr].parents[0] || null;
    }

    if (commitsToReplay.length === 0) {
      // Current branch is already an ancestor of target -> fast-forward!
      const targetCommit = repo.commits[ontoCommitHash];
      const newBranches = {
        ...repo.branches,
        [currentBranchName]: {
          ...repo.branches[currentBranchName],
          targetCommitHash: ontoCommitHash,
        },
      };

      return {
        stdout: [
          `Current branch ${currentBranchName} is up to date.`,
          `Fast-forwarded to ${ontoCommitHash.slice(0, 7)}`,
        ],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'MEDIUM',
        stateChanged: true,
        repo: {
          ...repo,
          branches: newBranches,
          workingDirectory: { ...targetCommit.files },
          index: { ...targetCommit.files },
        },
        educationalFeedback: `Rebase completed: Fast-forwarded '${currentBranchName}' to match '${targetBranch}'.`,
      };
    }

    // Replay commits on top of ontoCommitHash
    let latestHash = ontoCommitHash;
    const newCommits = { ...repo.commits };

    for (const originalCommit of commitsToReplay) {
      const baseFiles = repo.commits[latestHash].files;
      const combinedFiles = { ...baseFiles, ...originalCommit.files };
      const { hash, shortHash } = generateGitHash(originalCommit.message + latestHash);

      const replayedCommit: Commit = {
        hash,
        shortHash,
        parents: [latestHash],
        tree: {},
        files: combinedFiles,
        author: originalCommit.author,
        email: originalCommit.email,
        date: new Date().toISOString(),
        timestamp: Date.now(),
        message: originalCommit.message,
      };

      newCommits[hash] = replayedCommit;
      latestHash = hash;
    }

    const newBranches = {
      ...repo.branches,
      [currentBranchName]: {
        ...repo.branches[currentBranchName],
        targetCommitHash: latestHash,
      },
    };

    const newReflog: ReflogEntry[] = [
      {
        index: repo.reflog.length,
        fromHash: currentCommitHash,
        toHash: latestHash,
        action: 'rebase',
        message: `rebase: fast-forward on ${targetBranch}`,
        timestamp: Date.now(),
      },
      ...repo.reflog,
    ];

    const targetFiles = newCommits[latestHash].files;

    return {
      stdout: [
        `Successfully rebased and updated refs/heads/${currentBranchName}.`,
        `Replayed ${commitsToReplay.length} commit(s) onto ${ontoCommitHash.slice(0, 7)}.`,
      ],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'MEDIUM',
      stateChanged: true,
      repo: {
        ...repo,
        commits: newCommits,
        branches: newBranches,
        workingDirectory: { ...targetFiles },
        index: { ...targetFiles },
        reflog: newReflog,
      },
      whyExplanation: {
        summary: `Rebased '${currentBranchName}' onto '${targetBranch}'.`,
        headMoved: `HEAD advanced to new top commit ${latestHash.slice(0, 7)}.`,
        indexState: 'Clean.',
        workingState: 'Clean.',
        historyState: `History rewritten! Your ${commitsToReplay.length} commits were regenerated with new hashes on top of ${targetBranch}.`,
      },
      comparisons: {
        title: 'git merge vs git rebase',
        options: [
          {
            label: 'git merge',
            description: 'Preserves exact history',
            effect: 'Creates a merge commit joining two branches. Safe for shared team branches.',
          },
          {
            label: 'git rebase',
            description: 'Creates a linear history',
            effect: 'Rewrites commit hashes to make it look like you developed directly on top of the latest main. NEVER rebase public shared history!',
          },
        ],
      },
      educationalFeedback: `Rebase rewrites commit history so that all your changes appear in a single clean linear line!`,
    };
  }

  // git bisect
  if (sub === 'bisect') {
    const action = cmd.args[0] || 'help';

    if (action === 'start') {
      const commitHashes = Object.keys(repo.commits);
      const bisectState: BisectState = {
        active: true,
        badCommit: null,
        goodCommits: [],
        remainingCommits: commitHashes,
        currentTestCommit: null,
      };

      return {
        stdout: [
          'Bisect started: Searching for regression bug.',
          'Mark known bad commit with: `git bisect bad`',
          'Mark known good commit with: `git bisect good <commit>`',
        ],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: true,
        repo: { ...repo, bisectState },
        educationalFeedback: `Git Bisect uses binary search (O(log N)) to find which commit introduced a bug!`,
      };
    }

    if (action === 'bad') {
      const currentHead = repo.head.type === 'branch' ? repo.branches[repo.head.ref]?.targetCommitHash : repo.head.ref;
      const targetHash = cmd.args[1] ? resolveCommitRef(cmd.args[1], repo) : currentHead;

      if (!repo.bisectState?.active) {
        return {
          stdout: [],
          stderr: ['fatal: You need to run "git bisect start" first.'],
          exitCode: 1,
          dangerLevel: 'SAFE',
          stateChanged: false,
          repo,
        };
      }

      // Check if we have good commits to compute midpoint
      const good = repo.bisectState.goodCommits[0];
      if (!good) {
        return {
          stdout: [`Marked ${targetHash?.slice(0, 7)} as bad. Now mark a known good commit: 'git bisect good <hash>'`],
          stderr: [],
          exitCode: 0,
          dangerLevel: 'SAFE',
          stateChanged: true,
          repo: { ...repo, bisectState: { ...repo.bisectState, badCommit: targetHash } },
        };
      }

      // Binary search midpoint
      const commitsList = Object.keys(repo.commits);
      const midpointIndex = Math.floor(commitsList.length / 2);
      const midCommit = commitsList[midpointIndex];

      return {
        stdout: [
          `Bisecting: 3 revisions left to test after this (roughly 2 steps)`,
          `[${midCommit.slice(0, 7)}] ${repo.commits[midCommit]?.message}`,
        ],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'LOW',
        stateChanged: true,
        repo: {
          ...repo,
          head: { type: 'detached', ref: midCommit },
          workingDirectory: { ...repo.commits[midCommit].files },
          bisectState: { ...repo.bisectState, currentTestCommit: midCommit },
        },
        educationalFeedback: `Bisect jumped to the midpoint commit ${midCommit.slice(0, 7)}. Test your app now! If it works, type 'git bisect good'. If broken, type 'git bisect bad'.`,
      };
    }

    if (action === 'good') {
      const targetHash = cmd.args[1] ? resolveCommitRef(cmd.args[1], repo) : (repo.head.type === 'branch' ? repo.branches[repo.head.ref]?.targetCommitHash : repo.head.ref);
      
      return {
        stdout: [
          `Marked ${targetHash?.slice(0, 7)} as good.`,
          `Bisecting: Testing next revision...`,
        ],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: true,
        repo: {
          ...repo,
          bisectState: {
            ...repo.bisectState!,
            goodCommits: [...(repo.bisectState?.goodCommits || []), targetHash || ''],
          },
        },
        educationalFeedback: `Narrowed search space in half!`,
      };
    }

    if (action === 'reset') {
      const mainHash = repo.branches['main']?.targetCommitHash || '';
      return {
        stdout: ['We are back to main.'],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: true,
        repo: {
          ...repo,
          head: { type: 'branch', ref: 'main' },
          workingDirectory: { ...(repo.commits[mainHash]?.files || {}) },
          bisectState: null,
        },
        educationalFeedback: `Bisect finished. Restored original branch.`,
      };
    }
  }

  // git blame
  if (sub === 'blame') {
    const fileName = cmd.args[0];
    if (!fileName || repo.workingDirectory[fileName] === undefined) {
      return {
        stdout: [],
        stderr: [`fatal: no such path '${fileName || ''}' in HEAD`],
        exitCode: 128,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    const content = repo.workingDirectory[fileName] || '';
    const lines = content.split('\n');
    const authors = ['Abhijeet', 'Rahul', 'Priya', 'Sarah', 'David'];

    let headCommitHash = repo.head.type === 'branch' ? repo.branches[repo.head.ref]?.targetCommitHash : repo.head.ref;
    const shortHash = headCommitHash ? headCommitHash.slice(0, 7) : 'a1b2c3d';

    const out = lines.map((line, idx) => {
      const author = authors[idx % authors.length];
      const date = '2026-09-12 14:30:00';
      return `${shortHash} (${author.padEnd(8)} ${date} ${String(idx + 1).padStart(3)}) ${line}`;
    });

    return {
      stdout: out,
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: false,
      repo,
      educationalFeedback: `git blame shows who modified each line and in which commit. Tip: Blame is for debugging and learning context, not blaming your coworkers!`,
    };
  }

  // git clean
  if (sub === 'clean') {
    const isForce = cmd.flags['f'] || cmd.flags['force'];
    if (!isForce) {
      return {
        stdout: ['fatal: clean.requireForce defaults to true and neither -i, -n, nor -f given; refusing to clean'],
        stderr: [],
        exitCode: 1,
        dangerLevel: 'HIGH',
        stateChanged: false,
        repo,
      };
    }

    const newWorking = { ...repo.workingDirectory };
    const deleted: string[] = [];

    for (const p of Object.keys(newWorking)) {
      if (repo.index[p] === undefined) {
        deleted.push(p);
        delete newWorking[p];
      }
    }

    return {
      stdout: deleted.map(p => `Removing ${p}`),
      stderr: [],
      exitCode: 0,
      dangerLevel: 'HIGH',
      stateChanged: true,
      repo: { ...repo, workingDirectory: newWorking },
      whyExplanation: {
        summary: `Permanently removed untracked files: ${deleted.join(', ')}.`,
        headMoved: 'HEAD did not move.',
        indexState: 'Unchanged.',
        workingState: 'All untracked files deleted.',
        historyState: 'Unchanged.',
      },
      educationalFeedback: `Cleaned untracked files from working directory.`,
    };
  }

  // git config
  if (sub === 'config') {
    const isList = cmd.flags['list'] || cmd.flags['l'];
    const isGet = cmd.flags['get'];
    const isUnset = cmd.flags['unset'];
    const key = (typeof isGet === 'string' ? isGet : null) || (typeof isUnset === 'string' ? isUnset : null) || cmd.args[0];
    const val = cmd.args[1];

    if (isList || (!key && !val)) {
      const lines = Object.entries(repo.config).map(([k, v]) => `${k}=${v}`);
      return {
        stdout: lines.length > 0 ? lines : ['(no config set)'],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    if (isUnset) {
      const newConfig = { ...repo.config };
      delete newConfig[key!];
      return {
        stdout: [],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: true,
        repo: { ...repo, config: newConfig },
        educationalFeedback: `Unset config key: ${key}`,
      };
    }

    if (isGet || (!val && key)) {
      return {
        stdout: [repo.config[key!] || ''],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    if (key && val) {
      const newConfig = { ...repo.config, [key]: val };
      return {
        stdout: [],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: true,
        repo: { ...repo, config: newConfig },
        educationalFeedback: `Updated git config: ${key} = ${val}`,
      };
    }
  }

  // git worktree
  if (sub === 'worktree') {
    const action = cmd.args[0] || 'list';
    if (action === 'list') {
      return {
        stdout: [
          `/workspace/personal-website   ${repo.head.type === 'branch' ? repo.branches[repo.head.ref]?.targetCommitHash.slice(0, 7) || '0000000' : repo.head.ref.slice(0, 7)} [${repo.head.type === 'branch' ? repo.head.ref : 'detached HEAD'}]`,
          `/workspace/hotfix-tree        8f2a1b9 [hotfix/emergency] (worktree linked)`,
        ],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
        educationalFeedback: `git worktree allows checking out multiple branches simultaneously across separate directories.`,
      };
    }
    if (action === 'add') {
      const path = cmd.args[1] || '../hotfix-tree';
      const branch = cmd.args[2] || 'hotfix-worktree';
      return {
        stdout: [
          `Preparing worktree (new branch '${branch}')`,
          `HEAD is now at ${repo.head.type === 'branch' ? repo.branches[repo.head.ref]?.targetCommitHash.slice(0, 7) || '0000000' : '0000000'} Initial commit`,
        ],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'LOW',
        stateChanged: false,
        repo,
        educationalFeedback: `Created worktree at '${path}' on branch '${branch}'. You can now work on hotfixes without altering your active editor files!`,
      };
    }
    if (action === 'remove' || action === 'prune') {
      return {
        stdout: ['Removed worktree. Cleaned up linked metadata.'],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'LOW',
        stateChanged: false,
        repo,
      };
    }
  }

  // git submodule
  if (sub === 'submodule') {
    const action = cmd.args[0] || 'status';
    if (action === 'status') {
      return {
        stdout: [' 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b vendor/analytics (heads/v1.2.0)'],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
        educationalFeedback: `Submodules keep a Git repository as a subdirectory of another Git repository.`,
      };
    }
    if (action === 'add') {
      const url = cmd.args[1] || 'https://github.com/vendor/analytics.git';
      const path = cmd.args[2] || 'vendor/analytics';
      return {
        stdout: [
          `Cloning into '/workspace/personal-website/${path}'...`,
          `done.`,
          `Added submodule '${path}' from '${url}' to .gitmodules`,
        ],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'LOW',
        stateChanged: false,
        repo,
        educationalFeedback: `Registered submodule at '${path}'. Staged .gitmodules configuration file.`,
      };
    }
    if (action === 'init' || action === 'update') {
      return {
        stdout: ['Submodule path \'vendor/analytics\': checked out \'1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b\''],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }
  }

  // git format-patch & apply
  if (sub === 'format-patch') {
    const headHash = repo.head.type === 'branch' ? repo.branches[repo.head.ref]?.targetCommitHash : repo.head.ref;
    const short = headHash ? headHash.slice(0, 7) : '0000000';
    return {
      stdout: [`0001-${short}-patch.patch`],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: false,
      repo,
      educationalFeedback: `Generated patch file for commit ${short}. Suitable for submitting contributions via email or manual review.`,
    };
  }

  if (sub === 'apply') {
    const patchFile = cmd.args[0] || '0001-patch.patch';
    return {
      stdout: [`Applied patch '${patchFile}' cleanly to working directory.`],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'LOW',
      stateChanged: false,
      repo,
      educationalFeedback: `Applied patch file to working directory. Changes can now be reviewed with 'git diff'.`,
    };
  }

  // git lfs
  if (sub === 'lfs') {
    const action = cmd.args[0] || 'status';
    if (action === 'track') {
      const pattern = cmd.args[1] || '*.psd';
      return {
        stdout: [`Tracking "${pattern}" via Git LFS in .gitattributes`],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
        educationalFeedback: `Git LFS stores large binary files on a dedicated server and replaces them with tiny pointer files in Git.`,
      };
    }
    return {
      stdout: ['Git LFS is active. 0 LFS objects in repository.'],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: false,
      repo,
    };
  }

  // git gc & maintenance & prune
  if (sub === 'gc') {
    return {
      stdout: [
        'Counting objects: 100% (24/24), done.',
        'Delta compression using up to 8 threads',
        'Compressing objects: 100% (18/18), done.',
        'Writing objects: 100% (24/24), done.',
        'Total 24 (delta 6), reused 0 (delta 0), pack-reused 0',
      ],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'LOW',
      stateChanged: false,
      repo,
      educationalFeedback: `git gc packs loose objects into a single packfile and indexes them for maximum performance.`,
    };
  }

  if (sub === 'maintenance') {
    return {
      stdout: ['Running Git maintenance background tasks... done.'],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: false,
      repo,
    };
  }

  if (sub === 'prune') {
    return {
      stdout: ['Pruned 0 unreachable loose objects.'],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'LOW',
      stateChanged: false,
      repo,
    };
  }

  return {
    stdout: [],
    stderr: [`git: '${sub}' is not recognized.`],
    exitCode: 1,
    dangerLevel: 'SAFE',
    stateChanged: false,
    repo,
  };
}
