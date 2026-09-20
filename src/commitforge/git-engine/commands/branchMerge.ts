import { GitRepo, CommandResult, Commit, MergeState, ReflogEntry } from '../types';
import { ParsedCommand } from '../parser';
import { generateGitHash } from '../hash';

// Helper: Find Lowest Common Ancestor (LCA)
export function findLCA(commitA: string, commitB: string, commits: Record<string, Commit>): string | null {
  if (commitA === commitB) return commitA;

  const ancestorsA = new Set<string>();
  const queueA = [commitA];

  while (queueA.length > 0) {
    const curr = queueA.shift()!;
    if (!curr || ancestorsA.has(curr) || !commits[curr]) continue;
    ancestorsA.add(curr);
    for (const p of commits[curr].parents) {
      queueA.push(p);
    }
  }

  const queueB = [commitB];
  const visitedB = new Set<string>();

  while (queueB.length > 0) {
    const curr = queueB.shift()!;
    if (!curr || visitedB.has(curr) || !commits[curr]) continue;
    visitedB.add(curr);

    if (ancestorsA.has(curr)) {
      return curr; // First shared ancestor found
    }

    for (const p of commits[curr].parents) {
      queueB.push(p);
    }
  }

  return null;
}

export function executeBranchMerge(cmd: ParsedCommand, repo: GitRepo): CommandResult {
  const sub = cmd.subCommand;

  // git branch
  if (sub === 'branch') {
    const isAll = cmd.flags['a'] || cmd.flags['all'];
    const deleteBranch = cmd.flags['d'] || cmd.flags['D'];
    const renameBranch = cmd.flags['m'] || cmd.flags['M'];

    // Delete branch
    if (deleteBranch) {
      const target = (typeof deleteBranch === 'string' ? deleteBranch : cmd.args[0]) || '';
      if (!target) {
        return {
          stdout: [],
          stderr: ['fatal: branch name required for deletion'],
          exitCode: 1,
          dangerLevel: 'MEDIUM',
          stateChanged: false,
          repo,
        };
      }

      if (repo.head.type === 'branch' && repo.head.ref === target) {
        return {
          stdout: [],
          stderr: [`error: Cannot delete branch '${target}' checked out at '${repo.currentDir}'`],
          exitCode: 1,
          dangerLevel: 'MEDIUM',
          stateChanged: false,
          repo,
        };
      }

      if (!repo.branches[target]) {
        return {
          stdout: [],
          stderr: [`error: branch '${target}' not found.`],
          exitCode: 1,
          dangerLevel: 'MEDIUM',
          stateChanged: false,
          repo,
        };
      }

      const newBranches = { ...repo.branches };
      delete newBranches[target];

      return {
        stdout: [`Deleted branch ${target} (was ${repo.branches[target].targetCommitHash.slice(0, 7)}).`],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'MEDIUM',
        stateChanged: true,
        repo: { ...repo, branches: newBranches },
        whyExplanation: {
          summary: `Deleted branch pointer '${target}'.`,
          headMoved: 'HEAD did not move (you were on another branch).',
          indexState: 'Staging Area unchanged.',
          workingState: 'Working tree files unchanged.',
          historyState: 'Commits remain in history; only the reference pointer was removed.',
        },
        educationalFeedback: `A branch is simply a movable pointer to a commit. Deleting a branch deletes the pointer, not the commit history.`,
      };
    }

    // Rename branch
    if (renameBranch) {
      const oldName = cmd.args.length > 1 ? cmd.args[0] : (repo.head.type === 'branch' ? repo.head.ref : '');
      const newName = cmd.args.length > 1 ? cmd.args[1] : cmd.args[0];

      if (!oldName || !newName || !repo.branches[oldName]) {
        return {
          stdout: [],
          stderr: [`error: invalid branch rename syntax`],
          exitCode: 1,
          dangerLevel: 'LOW',
          stateChanged: false,
          repo,
        };
      }

      const newBranches = { ...repo.branches };
      const branchData = newBranches[oldName];
      delete newBranches[oldName];
      newBranches[newName] = { ...branchData, name: newName };

      let newHead = { ...repo.head };
      if (newHead.type === 'branch' && newHead.ref === oldName) {
        newHead = { type: 'branch', ref: newName };
      }

      return {
        stdout: [`Renamed branch '${oldName}' to '${newName}'`],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'LOW',
        stateChanged: true,
        repo: { ...repo, branches: newBranches, head: newHead },
        educationalFeedback: `Renamed branch pointer to '${newName}'.`,
      };
    }

    // Create branch
    if (cmd.args.length > 0) {
      const branchName = cmd.args[0];
      if (repo.branches[branchName]) {
        return {
          stdout: [],
          stderr: [`fatal: A branch named '${branchName}' already exists.`],
          exitCode: 128,
          dangerLevel: 'SAFE',
          stateChanged: false,
          repo,
        };
      }

      let currentCommitHash = '';
      if (repo.head.type === 'branch') {
        currentCommitHash = repo.branches[repo.head.ref]?.targetCommitHash || '';
      } else {
        currentCommitHash = repo.head.ref;
      }

      const newBranches = {
        ...repo.branches,
        [branchName]: {
          name: branchName,
          targetCommitHash: currentCommitHash,
        },
      };

      return {
        stdout: [],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: true,
        repo: { ...repo, branches: newBranches },
        whyExplanation: {
          summary: `Created new branch reference '${branchName}' pointing to ${currentCommitHash ? currentCommitHash.slice(0, 7) : 'root'}.`,
          headMoved: `HEAD remains on '${repo.head.type === 'branch' ? repo.head.ref : 'detached'}'. Use 'git switch ${branchName}' to switch to it.`,
          indexState: 'Unchanged.',
          workingState: 'Unchanged.',
          historyState: `New branch pointer added at commit ${currentCommitHash.slice(0, 7)}.`,
        },
        educationalFeedback: `Created branch '${branchName}'. Remember: 'git branch <name>' creates the branch, but does NOT switch to it yet.`,
      };
    }

    // Copy branch: git branch -c <old> <new> or git branch -c <new>
    const copyBranch = cmd.flags['c'] || cmd.flags['C'];
    if (copyBranch) {
      const srcName = cmd.args.length > 1 ? cmd.args[0] : (repo.head.type === 'branch' ? repo.head.ref : '');
      const destName = cmd.args.length > 1 ? cmd.args[1] : (typeof copyBranch === 'string' ? copyBranch : cmd.args[0]);

      if (!srcName || !destName || !repo.branches[srcName]) {
        return {
          stdout: [],
          stderr: [`error: branch '${srcName}' not found or invalid copy arguments`],
          exitCode: 1,
          dangerLevel: 'LOW',
          stateChanged: false,
          repo,
        };
      }

      const newBranches = {
        ...repo.branches,
        [destName]: {
          name: destName,
          targetCommitHash: repo.branches[srcName].targetCommitHash,
        },
      };

      return {
        stdout: [`Copied branch '${srcName}' to '${destName}'`],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'LOW',
        stateChanged: true,
        repo: { ...repo, branches: newBranches },
        educationalFeedback: `Copied branch reference '${srcName}' to '${destName}'.`,
      };
    }

    // List branches
    const isRemotes = cmd.flags['r'] || cmd.flags['remotes'];
    const isVerbose = cmd.flags['v'] || cmd.flags['vv'];
    const isMerged = cmd.flags['merged'];
    const isNoMerged = cmd.flags['no-merged'];
    const lines: string[] = [];

    const headHash = repo.head.type === 'branch' ? repo.branches[repo.head.ref]?.targetCommitHash : repo.head.ref;

    if (!isRemotes) {
      for (const bName of Object.keys(repo.branches).sort()) {
        const branchHash = repo.branches[bName].targetCommitHash;
        const isCurrent = repo.head.type === 'branch' && repo.head.ref === bName;

        if (isMerged && headHash && branchHash !== headHash) {
          const lca = findLCA(headHash, branchHash, repo.commits);
          if (lca !== branchHash) continue;
        }
        if (isNoMerged && headHash && branchHash === headHash) {
          continue;
        }

        const commit = repo.commits[branchHash];
        const vInfo = isVerbose && commit ? ` ${commit.shortHash} ${commit.message}` : '';
        lines.push(`${isCurrent ? '* ' : '  '}${bName}${vInfo}`);
      }
    }

    if (isAll || isRemotes) {
      for (const [rName, remote] of Object.entries(repo.remotes)) {
        for (const rbName of Object.keys(remote.branches).sort()) {
          const rHash = remote.branches[rbName].targetCommitHash;
          const commit = repo.commits[rHash];
          const vInfo = isVerbose && commit ? ` ${commit.shortHash} ${commit.message}` : '';
          lines.push(`  remotes/${rName}/${rbName}${vInfo}`);
        }
      }
    }

    return {
      stdout: lines.length > 0 ? lines : ['(no branches found)'],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: false,
      repo,
      educationalFeedback: `git branch lists branches. The asterisk (*) indicates where HEAD is currently pointing.`,
    };
  }

  // git switch
  if (sub === 'switch') {
    const isCreate = cmd.flags['c'] || cmd.flags['create'];
    let targetBranch = cmd.args[0] || (typeof isCreate === 'string' ? isCreate : '');

    if (isCreate) {
      if (!targetBranch) {
        return {
          stdout: [],
          stderr: ['fatal: missing branch name for -c'],
          exitCode: 1,
          dangerLevel: 'SAFE',
          stateChanged: false,
          repo,
        };
      }

      let currentCommitHash = repo.head.type === 'branch'
        ? repo.branches[repo.head.ref]?.targetCommitHash || ''
        : repo.head.ref;

      const newBranches = {
        ...repo.branches,
        [targetBranch]: {
          name: targetBranch,
          targetCommitHash: currentCommitHash,
        },
      };

      const newReflog: ReflogEntry[] = [
        {
          index: repo.reflog.length,
          fromHash: currentCommitHash,
          toHash: currentCommitHash,
          action: 'checkout',
          message: `checkout: moving from ${repo.head.ref} to ${targetBranch}`,
          timestamp: Date.now(),
        },
        ...repo.reflog,
      ];

      return {
        stdout: [`Switched to a new branch '${targetBranch}'`],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: true,
        repo: {
          ...repo,
          branches: newBranches,
          head: { type: 'branch', ref: targetBranch },
          reflog: newReflog,
        },
        whyExplanation: {
          summary: `Created and checked out branch '${targetBranch}'.`,
          headMoved: `HEAD now points to branch '${targetBranch}'.`,
          indexState: 'Preserved.',
          workingState: 'Preserved.',
          historyState: `Commit DAG now has pointer '${targetBranch}' at ${currentCommitHash ? currentCommitHash.slice(0, 7) : 'root'}.`,
        },
        educationalFeedback: `Switched to '${targetBranch}'. Future commits will advance this branch.`,
      };
    }

    if (!targetBranch || !repo.branches[targetBranch]) {
      return {
        stdout: [],
        stderr: [`fatal: invalid reference: ${targetBranch || '(none)'}`],
        exitCode: 1,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    // Switch to existing branch
    const branch = repo.branches[targetBranch];
    const targetCommit = repo.commits[branch.targetCommitHash];
    const targetFiles = targetCommit ? targetCommit.files : {};

    const newReflog: ReflogEntry[] = [
      {
        index: repo.reflog.length,
        fromHash: repo.head.type === 'branch' ? repo.branches[repo.head.ref]?.targetCommitHash || '' : repo.head.ref,
        toHash: branch.targetCommitHash,
        action: 'checkout',
        message: `checkout: moving to ${targetBranch}`,
        timestamp: Date.now(),
      },
      ...repo.reflog,
    ];

    return {
      stdout: [`Switched to branch '${targetBranch}'`],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: true,
      repo: {
        ...repo,
        head: { type: 'branch', ref: targetBranch },
        workingDirectory: { ...targetFiles },
        index: { ...targetFiles },
        reflog: newReflog,
      },
      whyExplanation: {
        summary: `Switched active branch to '${targetBranch}'.`,
        headMoved: `HEAD now points to '${targetBranch}' (commit ${branch.targetCommitHash.slice(0, 7)}).`,
        indexState: `Staging Area loaded files from commit ${branch.targetCommitHash.slice(0, 7)}.`,
        workingState: `Working Directory updated to match the files of '${targetBranch}'.`,
        historyState: 'Branch history remains unchanged.',
      },
      educationalFeedback: `Switched to branch '${targetBranch}'. Working directory was updated to match this branch's latest commit.`,
    };
  }

  // git checkout
  if (sub === 'checkout') {
    const isCreate = cmd.flags['b'];
    let target = (typeof isCreate === 'string' ? isCreate : cmd.args[0]) || '';

    if (isCreate) {
      return executeBranchMerge({ ...cmd, subCommand: 'switch', flags: { c: target }, args: [target] }, repo);
    }

    // File restore: git checkout -- <file>
    if (cmd.args[0] === '--' && cmd.args[1]) {
      const fileArg = cmd.args[1];
      let headFiles: Record<string, string> = {};
      const headCommitHash = repo.head.type === 'branch' ? repo.branches[repo.head.ref]?.targetCommitHash : repo.head.ref;
      if (headCommitHash && repo.commits[headCommitHash]) {
        headFiles = repo.commits[headCommitHash].files;
      }

      if (headFiles[fileArg] !== undefined) {
        return {
          stdout: [`Updated 1 path from HEAD`],
          stderr: [],
          exitCode: 0,
          dangerLevel: 'MEDIUM',
          stateChanged: true,
          repo: {
            ...repo,
            workingDirectory: { ...repo.workingDirectory, [fileArg]: headFiles[fileArg] },
            index: { ...repo.index, [fileArg]: headFiles[fileArg] },
          },
          educationalFeedback: `Restored '${fileArg}' to match HEAD. (Modern Git recommends 'git restore <file>' instead).`,
        };
      }
    }

    // Check if target is branch
    if (repo.branches[target]) {
      return executeBranchMerge({ ...cmd, subCommand: 'switch', args: [target], flags: {} }, repo);
    }

    // Check if target is a commit hash (Detached HEAD!)
    let matchedCommitHash = '';
    for (const h of Object.keys(repo.commits)) {
      if (h.startsWith(target)) {
        matchedCommitHash = h;
        break;
      }
    }

    if (matchedCommitHash) {
      const targetCommit = repo.commits[matchedCommitHash];
      const newReflog: ReflogEntry[] = [
        {
          index: repo.reflog.length,
          fromHash: repo.head.type === 'branch' ? repo.branches[repo.head.ref]?.targetCommitHash || '' : repo.head.ref,
          toHash: matchedCommitHash,
          action: 'checkout',
          message: `checkout: moving to ${target}`,
          timestamp: Date.now(),
        },
        ...repo.reflog,
      ];

      return {
        stdout: [
          `Note: switching to '${matchedCommitHash.slice(0, 7)}'.`,
          '',
          `You are in 'detached HEAD' state. You can look around, make experimental`,
          `changes and commit them, and you can discard any commits you make in this`,
          `state without impacting any branches by switching back to a branch.`,
          '',
          `If you want to create a new branch to retain commits you create, you may`,
          `do so (now or later) by using -c with the switch command. Example:`,
          '',
          `  git switch -c <new-branch-name>`,
          '',
          `HEAD is now at ${matchedCommitHash.slice(0, 7)} ${targetCommit.message}`,
        ],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'LOW',
        stateChanged: true,
        repo: {
          ...repo,
          head: { type: 'detached', ref: matchedCommitHash },
          workingDirectory: { ...targetCommit.files },
          index: { ...targetCommit.files },
          reflog: newReflog,
        },
        whyExplanation: {
          summary: `Entered Detached HEAD state at commit ${matchedCommitHash.slice(0, 7)}.`,
          headMoved: `HEAD now points directly to commit SHA ${matchedCommitHash.slice(0, 7)} instead of a branch name!`,
          indexState: `Staging Area updated to commit ${matchedCommitHash.slice(0, 7)}.`,
          workingState: `Working Directory updated to commit ${matchedCommitHash.slice(0, 7)}.`,
          historyState: 'No commits were destroyed.',
        },
        educationalFeedback: `Detached HEAD! HEAD is attached directly to commit ${matchedCommitHash.slice(0, 7)}, not to any branch.`,
      };
    }

    return {
      stdout: [],
      stderr: [`error: pathspec '${target}' did not match any file(s) known to git`],
      exitCode: 1,
      dangerLevel: 'SAFE',
      stateChanged: false,
      repo,
    };
  }

  // git merge
  if (sub === 'merge') {
    if (cmd.flags['abort']) {
      if (!repo.mergeState?.inProgress) {
        return {
          stdout: [],
          stderr: ['fatal: There is no merge to abort (MERGE_HEAD missing).'],
          exitCode: 128,
          dangerLevel: 'SAFE',
          stateChanged: false,
          repo,
        };
      }

      // Restore HEAD commit files
      let headFiles: Record<string, string> = {};
      const headHash = repo.head.type === 'branch' ? repo.branches[repo.head.ref]?.targetCommitHash : repo.head.ref;
      if (headHash && repo.commits[headHash]) {
        headFiles = repo.commits[headHash].files;
      }

      return {
        stdout: ['Merge aborted. Working directory and staging area restored.'],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'LOW',
        stateChanged: true,
        repo: {
          ...repo,
          workingDirectory: { ...headFiles },
          index: { ...headFiles },
          mergeState: null,
        },
        educationalFeedback: `Aborted merge and safely restored all files to their pre-merge state.`,
      };
    }

    if (cmd.flags['continue']) {
      if (!repo.mergeState?.inProgress) {
        return {
          stdout: [],
          stderr: ['fatal: There is no merge in progress (MERGE_HEAD missing).'],
          exitCode: 128,
          dangerLevel: 'SAFE',
          stateChanged: false,
          repo,
        };
      }

      // Check if conflicts remain
      const hasConflictMarkers = Object.values(repo.workingDirectory).some(c => c.includes('<<<<<<<'));
      if (hasConflictMarkers) {
        return {
          stdout: [],
          stderr: [
            'error: Committing is not possible because you have unmerged files.',
            'hint: Fix them up in the work tree, and then use \'git add/rm <file>\'',
            'hint: as appropriate to mark resolution and run \'git commit\' or \'git merge --continue\'.'
          ],
          exitCode: 1,
          dangerLevel: 'LOW',
          stateChanged: false,
          repo,
        };
      }

      // Conclude merge
      const targetBranch = repo.mergeState.targetBranch;
      const sourceCommit = repo.mergeState.sourceCommit;
      const targetCommit = repo.branches[targetBranch]?.targetCommitHash || '';
      const mergeMsg = `Merge branch '${repo.mergeState.sourceBranch}' into ${targetBranch}`;
      const { hash: mergeHash, shortHash: mergeShortHash } = generateGitHash(mergeMsg + JSON.stringify(repo.workingDirectory) + Date.now());

      const mergeCommit: Commit = {
        hash: mergeHash,
        shortHash: mergeShortHash,
        parents: [targetCommit, sourceCommit].filter(Boolean),
        tree: {},
        files: { ...repo.workingDirectory },
        author: repo.config['user.name'] || 'Developer',
        email: repo.config['user.email'] || 'developer@commitforge.dev',
        date: new Date().toISOString(),
        timestamp: Date.now(),
        message: mergeMsg,
      };

      const newCommits = { ...repo.commits, [mergeHash]: mergeCommit };
      const newBranches = {
        ...repo.branches,
        [targetBranch]: {
          ...repo.branches[targetBranch],
          targetCommitHash: mergeHash,
        },
      };

      const newReflog: ReflogEntry[] = [
        {
          index: repo.reflog.length,
          fromHash: targetCommit,
          toHash: mergeHash,
          action: 'merge',
          message: `merge ${repo.mergeState.sourceBranch}: Merge made by the 'ort' strategy.`,
          timestamp: Date.now(),
        },
        ...repo.reflog,
      ];

      return {
        stdout: [
          `[${targetBranch} ${mergeShortHash}] ${mergeMsg}`,
          `Merge conflict resolved and concluded.`,
        ],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'LOW',
        stateChanged: true,
        repo: {
          ...repo,
          commits: newCommits,
          branches: newBranches,
          index: { ...repo.workingDirectory },
          reflog: newReflog,
          mergeState: null,
        },
        educationalFeedback: `Merge concluded successfully! Created 3-way merge commit ${mergeShortHash}.`,
      };
    }

    const isSquash = Boolean(cmd.flags['squash']);
    const isNoFF = Boolean(cmd.flags['no-ff']);
    const isFFOnly = Boolean(cmd.flags['ff-only']);

    const sourceBranchName = cmd.args[0];
    if (!sourceBranchName) {
      return {
        stdout: [],
        stderr: ['fatal: No remote or branch specified for merge.'],
        exitCode: 1,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    const sourceBranch = repo.branches[sourceBranchName];
    if (!sourceBranch) {
      return {
        stdout: [],
        stderr: [`merge: ${sourceBranchName} - not something we can merge`],
        exitCode: 1,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    const currentBranchName = repo.head.type === 'branch' ? repo.head.ref : null;
    if (!currentBranchName) {
      return {
        stdout: [],
        stderr: ['fatal: You are in detached HEAD state. Switch to a branch before merging.'],
        exitCode: 1,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    if (currentBranchName === sourceBranchName) {
      return {
        stdout: ['Already up to date.'],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    const targetCommitHash = repo.branches[currentBranchName].targetCommitHash;
    const sourceCommitHash = sourceBranch.targetCommitHash;

    if (targetCommitHash === sourceCommitHash) {
      return {
        stdout: ['Already up to date.'],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    const lcaHash = findLCA(targetCommitHash, sourceCommitHash, repo.commits);

    if (isFFOnly && lcaHash !== targetCommitHash) {
      return {
        stdout: [],
        stderr: ['fatal: Not possible to fast-forward, aborting.'],
        exitCode: 128,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
        educationalFeedback: `With --ff-only, Git rejects the merge if a 3-way merge commit would be required.`,
      };
    }

    if (isSquash) {
      const sourceCommit = repo.commits[sourceCommitHash];
      const mergedIndex = { ...repo.index, ...sourceCommit.files };
      const mergedWorking = { ...repo.workingDirectory, ...sourceCommit.files };

      return {
        stdout: [
          `Squash commit -- not updating HEAD`,
          `Automatic merge went well; stopped before committing as requested`,
        ],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'LOW',
        stateChanged: true,
        repo: {
          ...repo,
          index: mergedIndex,
          workingDirectory: mergedWorking,
        },
        educationalFeedback: `Squash merge: All changes from '${sourceBranchName}' have been staged in the index. Run 'git commit' to seal them as a single commit.`,
      };
    }

    // Case 1: Fast-forward (LCA is current HEAD commit) without --no-ff
    if (lcaHash === targetCommitHash && !isNoFF) {
      const sourceCommit = repo.commits[sourceCommitHash];
      const newBranches = {
        ...repo.branches,
        [currentBranchName]: {
          ...repo.branches[currentBranchName],
          targetCommitHash: sourceCommitHash,
        },
      };

      const newReflog: ReflogEntry[] = [
        {
          index: repo.reflog.length,
          fromHash: targetCommitHash,
          toHash: sourceCommitHash,
          action: 'merge',
          message: `merge ${sourceBranchName}: Fast-forward`,
          timestamp: Date.now(),
        },
        ...repo.reflog,
      ];

      return {
        stdout: [
          `Updating ${targetCommitHash.slice(0, 7)}..${sourceCommitHash.slice(0, 7)}`,
          'Fast-forward',
          ` ${Object.keys(sourceCommit.files).length} file(s) updated`,
        ],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'LOW',
        stateChanged: true,
        repo: {
          ...repo,
          branches: newBranches,
          workingDirectory: { ...sourceCommit.files },
          index: { ...sourceCommit.files },
          reflog: newReflog,
        },
        whyExplanation: {
          summary: `Fast-Forward Merge: Advanced '${currentBranchName}' directly to match '${sourceBranchName}'.`,
          headMoved: `HEAD moved to commit ${sourceCommitHash.slice(0, 7)}.`,
          indexState: `Staging Area updated to commit ${sourceCommitHash.slice(0, 7)}.`,
          workingState: `Working Directory files updated to commit ${sourceCommitHash.slice(0, 7)}.`,
          historyState: 'No new merge commit was needed because history was linear.',
        },
        educationalFeedback: `Fast-forward merge completed! Because '${currentBranchName}' had no new commits since branching, Git simply slid the branch pointer forward.`,
      };
    }

    // Case 2: 3-way Merge (Diverged branches)
    const baseCommit = lcaHash ? repo.commits[lcaHash] : null;
    const baseFiles = baseCommit ? baseCommit.files : {};
    const ourCommit = repo.commits[targetCommitHash];
    const ourFiles = ourCommit ? ourCommit.files : {};
    const theirCommit = repo.commits[sourceCommitHash];
    const theirFiles = theirCommit ? theirCommit.files : {};

    const allPaths = new Set([
      ...Object.keys(baseFiles),
      ...Object.keys(ourFiles),
      ...Object.keys(theirFiles),
    ]);

    const mergedWorking = { ...ourFiles };
    const mergedIndex = { ...ourFiles };
    const conflicts: string[] = [];
    const autoMerged: string[] = [];

    for (const p of allPaths) {
      const baseVal = baseFiles[p] ?? null;
      const ourVal = ourFiles[p] ?? null;
      const theirVal = theirFiles[p] ?? null;

      if (ourVal === theirVal) {
        // Both kept identical or made identical changes
        if (ourVal !== null) mergedWorking[p] = ourVal;
        else delete mergedWorking[p];
      } else if (ourVal === baseVal && theirVal !== baseVal) {
        // Changed only in their branch -> Auto-merge their changes!
        if (theirVal !== null) {
          mergedWorking[p] = theirVal;
          mergedIndex[p] = theirVal;
          autoMerged.push(p);
        } else {
          delete mergedWorking[p];
          delete mergedIndex[p];
        }
      } else if (ourVal !== baseVal && theirVal === baseVal) {
        // Changed only in our branch -> Keep our changes!
      } else {
        // Changed differently in both -> Conflict!
        conflicts.push(p);
        const conflictText = [
          '<<<<<<< HEAD',
          ourVal || '',
          '=======',
          theirVal || '',
          `>>>>>>> ${sourceBranchName}`,
        ].join('\n');

        mergedWorking[p] = conflictText;
        // Do not stage conflict in index until user resolves it
      }
    }

    if (conflicts.length > 0) {
      const mergeState: MergeState = {
        inProgress: true,
        sourceBranch: sourceBranchName,
        sourceCommit: sourceCommitHash,
        targetBranch: currentBranchName,
        conflicts,
        resolved: [],
        autoMergedFiles: {},
      };

      const out = [
        ...autoMerged.map(p => `Auto-merging ${p}`),
        ...conflicts.map(p => `CONFLICT (content): Merge conflict in ${p}`),
        'Automatic merge failed; fix conflicts and then commit the result.',
      ];

      return {
        stdout: out,
        stderr: [],
        exitCode: 1,
        dangerLevel: 'LOW',
        stateChanged: true,
        repo: {
          ...repo,
          workingDirectory: mergedWorking,
          index: mergedIndex,
          mergeState,
        },
        whyExplanation: {
          summary: `Merge Conflict detected in ${conflicts.length} file(s).`,
          headMoved: 'HEAD did not move.',
          indexState: 'Auto-merged files are staged. Conflicting files need manual resolution.',
          workingState: `Conflict markers (<<<<<<< HEAD) injected into: ${conflicts.join(', ')}.`,
          historyState: 'Merge is paused awaiting resolution.',
        },
        educationalFeedback: `🚨 Merge Conflict! Both '${currentBranchName}' and '${sourceBranchName}' modified the same file(s). Edit the markers in the editor, run 'git add', and run 'git commit'.`,
      };
    }

    // No conflicts -> Create 3-Way Merge Commit!
    const mergeMessage = `Merge branch '${sourceBranchName}' into ${currentBranchName}`;
    const { hash, shortHash } = generateGitHash(mergeMessage + JSON.stringify(mergedWorking));

    const newCommit: Commit = {
      hash,
      shortHash,
      parents: [targetCommitHash, sourceCommitHash],
      tree: {},
      files: mergedWorking,
      author: repo.config['user.name'] || 'Developer',
      email: repo.config['user.email'] || 'developer@commitforge.dev',
      date: new Date().toISOString(),
      timestamp: Date.now(),
      message: mergeMessage,
    };

    const newCommits = { ...repo.commits, [hash]: newCommit };
    const newBranches = {
      ...repo.branches,
      [currentBranchName]: {
        ...repo.branches[currentBranchName],
        targetCommitHash: hash,
      },
    };

    const newReflog: ReflogEntry[] = [
      {
        index: repo.reflog.length,
        fromHash: targetCommitHash,
        toHash: hash,
        action: 'merge',
        message: `merge ${sourceBranchName}: Merge made by the 'ort' strategy.`,
        timestamp: Date.now(),
      },
      ...repo.reflog,
    ];

    return {
      stdout: [
        `Merge made by the 'ort' strategy.`,
        ` [${currentBranchName} ${shortHash}] ${mergeMessage}`,
      ],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'LOW',
      stateChanged: true,
      repo: {
        ...repo,
        commits: newCommits,
        branches: newBranches,
        workingDirectory: mergedWorking,
        index: mergedWorking,
        reflog: newReflog,
      },
      whyExplanation: {
        summary: `3-Way Merge succeeded: Created merge commit ${shortHash} with 2 parent commits.`,
        headMoved: `HEAD moved to new merge commit ${shortHash}.`,
        indexState: 'Clean.',
        workingState: 'Clean.',
        historyState: `Branches converged! Parents: ${targetCommitHash.slice(0, 7)} and ${sourceCommitHash.slice(0, 7)}.`,
      },
      educationalFeedback: `Successfully merged '${sourceBranchName}' into '${currentBranchName}'. Created a merge commit with two parent commits!`,
    };
  }

  return {
    stdout: [],
    stderr: [`git: '${sub}' is not a recognized command.`],
    exitCode: 1,
    dangerLevel: 'SAFE',
    stateChanged: false,
    repo,
  };
}
