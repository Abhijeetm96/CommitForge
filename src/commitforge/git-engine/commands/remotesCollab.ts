import { GitRepo, CommandResult, Remote, RemoteBranch, ReflogEntry } from '../types';
import { ParsedCommand } from '../parser';
import { findLCA } from './branchMerge';

export function executeRemotesCollab(cmd: ParsedCommand, repo: GitRepo): CommandResult {
  const sub = cmd.subCommand;

  // git remote
  if (sub === 'remote') {
    const isVerbose = cmd.flags['v'] || cmd.flags['verbose'];
    const action = cmd.args[0];

    if (action === 'add') {
      const name = cmd.args[1];
      const url = cmd.args[2];

      if (!name || !url) {
        return {
          stdout: [],
          stderr: ['usage: git remote add <name> <url>'],
          exitCode: 1,
          dangerLevel: 'SAFE',
          stateChanged: false,
          repo,
        };
      }

      if (repo.remotes[name]) {
        return {
          stdout: [],
          stderr: [`fatal: remote ${name} already exists.`],
          exitCode: 128,
          dangerLevel: 'SAFE',
          stateChanged: false,
          repo,
        };
      }

      const newRemote: Remote = {
        name,
        url,
        branches: {},
      };

      return {
        stdout: [],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: true,
        repo: { ...repo, remotes: { ...repo.remotes, [name]: newRemote } },
        whyExplanation: {
          summary: `Added remote repository link '${name}' -> ${url}.`,
          headMoved: 'HEAD did not move.',
          indexState: 'Unchanged.',
          workingState: 'Unchanged.',
          historyState: `New remote configuration saved.`,
        },
        educationalFeedback: `Added remote '${name}'. Remotes are bookmarks to shared repositories (like GitHub/GitLab).`,
      };
    }

    if (action === 'rename') {
      const oldName = cmd.args[1];
      const newName = cmd.args[2];
      if (!oldName || !newName || !repo.remotes[oldName]) {
        return {
          stdout: [],
          stderr: [`fatal: remote ${oldName} not found or invalid rename syntax`],
          exitCode: 1,
          dangerLevel: 'LOW',
          stateChanged: false,
          repo,
        };
      }
      const newRemotes = { ...repo.remotes };
      const remoteData = newRemotes[oldName];
      delete newRemotes[oldName];
      newRemotes[newName] = { ...remoteData, name: newName };

      return {
        stdout: [`Renamed remote '${oldName}' to '${newName}'`],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'LOW',
        stateChanged: true,
        repo: { ...repo, remotes: newRemotes },
        educationalFeedback: `Renamed remote bookmark to '${newName}'.`,
      };
    }

    if (action === 'set-url') {
      const name = cmd.args[1];
      const newUrl = cmd.args[2];
      if (!name || !newUrl || !repo.remotes[name]) {
        return {
          stdout: [],
          stderr: [`fatal: remote ${name} not found or invalid url`],
          exitCode: 1,
          dangerLevel: 'LOW',
          stateChanged: false,
          repo,
        };
      }
      const newRemotes = {
        ...repo.remotes,
        [name]: { ...repo.remotes[name], url: newUrl },
      };
      return {
        stdout: [],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'LOW',
        stateChanged: true,
        repo: { ...repo, remotes: newRemotes },
        educationalFeedback: `Updated remote '${name}' URL to '${newUrl}'.`,
      };
    }

    if (action === 'remove' || action === 'rm') {
      const name = cmd.args[1];
      const newRemotes = { ...repo.remotes };
      delete newRemotes[name];

      return {
        stdout: [],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'LOW',
        stateChanged: true,
        repo: { ...repo, remotes: newRemotes },
        educationalFeedback: `Removed remote reference '${name}'.`,
      };
    }

    // List remotes
    const lines: string[] = [];
    for (const [name, remote] of Object.entries(repo.remotes)) {
      if (isVerbose) {
        lines.push(`${name}\t${remote.url} (fetch)`);
        lines.push(`${name}\t${remote.url} (push)`);
      } else {
        lines.push(name);
      }
    }

    return {
      stdout: lines,
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: false,
      repo,
      educationalFeedback: `git remote -v shows configured remote repository URLs.`,
    };
  }

  // git fetch
  if (sub === 'fetch') {
    const remoteName = cmd.args[0] || 'origin';
    const remote = repo.remotes[remoteName];

    if (!remote) {
      return {
        stdout: [],
        stderr: [`fatal: '${remoteName}' does not appear to be a git repository`],
        exitCode: 128,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    const lines: string[] = [`From ${remote.url}`];
    for (const [rbName, rBranch] of Object.entries(remote.branches)) {
      lines.push(` * [new branch]      ${rbName}     -> ${remoteName}/${rbName}`);
    }

    return {
      stdout: lines,
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: false,
      repo,
      whyExplanation: {
        summary: `Fetched latest commits from remote '${remoteName}'.`,
        headMoved: 'HEAD did NOT move! Your working files and local branches are completely untouched.',
        indexState: 'Unchanged.',
        workingState: 'Unchanged.',
        historyState: `Updated remote-tracking branches (${remoteName}/*).`,
      },
      comparisons: {
        title: 'git fetch vs git pull',
        options: [
          {
            label: 'git fetch',
            description: 'Safe download only',
            effect: 'Downloads new commits and updates remote-tracking branches (origin/main). Does NOT touch your working tree or current branch.',
          },
          {
            label: 'git pull',
            description: 'Fetch + Merge',
            effect: 'Downloads new commits AND immediately merges them into your currently checked out local branch.',
          },
        ],
      },
      educationalFeedback: `git fetch downloaded remote references safely without modifying your local code or branch pointer.`,
    };
  }

  // git push
  if (sub === 'push') {
    const remoteName = cmd.args[0] || 'origin';
    const remote = repo.remotes[remoteName];
    const isForce = cmd.flags['f'] || cmd.flags['force'];
    const setUpstream = cmd.flags['u'] || cmd.flags['set-upstream'];

    if (!remote) {
      return {
        stdout: [],
        stderr: [`fatal: '${remoteName}' does not appear to be a git repository`],
        exitCode: 128,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    const currentBranchName = repo.head.type === 'branch' ? repo.head.ref : null;
    if (!currentBranchName) {
      return {
        stdout: [],
        stderr: ['fatal: You are not currently on a branch.'],
        exitCode: 1,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    const isForceWithLease = Boolean(cmd.flags['force-with-lease']);
    const isDelete = Boolean(cmd.flags['delete'] || cmd.flags['d']);

    if (isDelete) {
      const branchToDelete = cmd.args[1] || (cmd.args[0] !== remoteName ? cmd.args[0] : '');
      if (!branchToDelete) {
        return {
          stdout: [],
          stderr: ['fatal: branch to delete required for git push --delete'],
          exitCode: 1,
          dangerLevel: 'MEDIUM',
          stateChanged: false,
          repo,
        };
      }
      const updatedRemoteBranches = { ...remote.branches };
      delete updatedRemoteBranches[branchToDelete];

      return {
        stdout: [
          `To ${remote.url}`,
          ` - [deleted]         ${branchToDelete}`,
        ],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'MEDIUM',
        stateChanged: true,
        repo: {
          ...repo,
          remotes: {
            ...repo.remotes,
            [remoteName]: { ...remote, branches: updatedRemoteBranches },
          },
        },
        educationalFeedback: `Deleted remote branch '${remoteName}/${branchToDelete}'.`,
      };
    }

    const targetBranchName = cmd.args[1] || currentBranchName;
    const localCommitHash = repo.branches[currentBranchName]?.targetCommitHash;

    if (!localCommitHash) {
      return {
        stdout: [],
        stderr: [`error: src refspec ${currentBranchName} does not match any`],
        exitCode: 1,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    const remoteBranch = remote.branches[targetBranchName];

    // Check non-fast-forward push rejection!
    if (remoteBranch && !isForce && !isForceWithLease) {
      const remoteHash = remoteBranch.targetCommitHash;
      if (remoteHash && remoteHash !== localCommitHash) {
        // Is remoteHash an ancestor of localCommitHash?
        const lca = findLCA(localCommitHash, remoteHash, repo.commits);
        if (lca !== remoteHash) {
          // Non-fast-forward rejection!
          return {
            stdout: [
              `To ${remote.url}`,
              ` ! [rejected]        ${currentBranchName} -> ${targetBranchName} (non-fast-forward)`,
              `error: failed to push some refs to '${remote.url}'`,
              `hint: Updates were rejected because the remote contains work that you do`,
              `hint: not have locally. This is usually caused by another repository pushing`,
              `hint: to the same ref. You may want to first integrate the remote changes`,
              `hint: (e.g., 'git pull ...') before pushing again.`,
              `hint: See the 'Note about fast-forwards' in 'git push --help' for details.`,
            ],
            stderr: [],
            exitCode: 1,
            dangerLevel: 'MEDIUM',
            stateChanged: false,
            repo,
            educationalFeedback: `🚨 Push rejected! Someone pushed changes to ${remoteName}/${targetBranchName} that you do not have locally. Run 'git pull' first to integrate their work.`,
          };
        }
      }
    }

    // Update remote branch
    const updatedRemoteBranches = {
      ...remote.branches,
      [targetBranchName]: {
        remote: remoteName,
        branch: targetBranchName,
        targetCommitHash: localCommitHash,
      },
    };

    const updatedRemote: Remote = {
      ...remote,
      branches: updatedRemoteBranches,
    };

    const newBranches = { ...repo.branches };
    if (setUpstream && newBranches[currentBranchName]) {
      newBranches[currentBranchName] = {
        ...newBranches[currentBranchName],
        upstream: `${remoteName}/${targetBranchName}`,
      };
    }

    const lines = [
      `To ${remote.url}`,
      isForce
        ? ` + ${localCommitHash.slice(0, 7)}...${localCommitHash.slice(0, 7)} ${currentBranchName} -> ${targetBranchName} (forced update)`
        : `   ${localCommitHash.slice(0, 7)}..${localCommitHash.slice(0, 7)} ${currentBranchName} -> ${targetBranchName}`,
    ];

    if (setUpstream) {
      lines.push(`Branch '${currentBranchName}' set up to track remote branch '${targetBranchName}' from '${remoteName}'.`);
    }

    return {
      stdout: lines,
      stderr: [],
      exitCode: 0,
      dangerLevel: isForce ? 'VERY_HIGH' : 'LOW',
      stateChanged: true,
      repo: {
        ...repo,
        remotes: { ...repo.remotes, [remoteName]: updatedRemote },
        branches: newBranches,
      },
      whyExplanation: {
        summary: `Pushed commits from local branch '${currentBranchName}' to ${remoteName}/${targetBranchName}.`,
        headMoved: 'HEAD remained on local branch.',
        indexState: 'Unchanged.',
        workingState: 'Unchanged.',
        historyState: `Remote branch '${remoteName}/${targetBranchName}' now matches your local commit ${localCommitHash.slice(0, 7)}.`,
      },
      educationalFeedback: isForce
        ? `⚠️ Force pushed to ${remoteName}/${targetBranchName}. Remote history was overwritten.`
        : `Successfully pushed! Remote repository ${remoteName}/${targetBranchName} is now synchronized.`,
    };
  }

  // git pull
  if (sub === 'pull') {
    const remoteName = cmd.args[0] || 'origin';
    const remote = repo.remotes[remoteName];

    if (!remote) {
      return {
        stdout: [],
        stderr: [`fatal: '${remoteName}' does not appear to be a git repository`],
        exitCode: 128,
        dangerLevel: 'LOW',
        stateChanged: false,
        repo,
      };
    }

    const currentBranchName = repo.head.type === 'branch' ? repo.head.ref : null;
    if (!currentBranchName) {
      return {
        stdout: [],
        stderr: ['fatal: You are not currently on a branch.'],
        exitCode: 1,
        dangerLevel: 'LOW',
        stateChanged: false,
        repo,
      };
    }

    const targetBranchName = cmd.args[1] || currentBranchName;
    const remoteBranch = remote.branches[targetBranchName];

    if (!remoteBranch) {
      return {
        stdout: [
          `From ${remote.url}`,
          `There is no tracking information for the current branch.`,
        ],
        stderr: [],
        exitCode: 1,
        dangerLevel: 'LOW',
        stateChanged: false,
        repo,
      };
    }

    const localCommitHash = repo.branches[currentBranchName].targetCommitHash;
    const remoteCommitHash = remoteBranch.targetCommitHash;

    if (localCommitHash === remoteCommitHash) {
      return {
        stdout: ['Already up to date.'],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'LOW',
        stateChanged: false,
        repo,
        educationalFeedback: 'Local branch is already identical to the remote branch.',
      };
    }

    // Pull combines Fetch + Merge
    const remoteCommit = repo.commits[remoteCommitHash];
    if (!remoteCommit) {
      return {
        stdout: ['Already up to date.'],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'LOW',
        stateChanged: false,
        repo,
      };
    }

    // Fast-forward or 3-way merge remote commit
    const newBranches = {
      ...repo.branches,
      [currentBranchName]: {
        ...repo.branches[currentBranchName],
        targetCommitHash: remoteCommitHash,
      },
    };

    const newReflog: ReflogEntry[] = [
      {
        index: repo.reflog.length,
        fromHash: localCommitHash,
        toHash: remoteCommitHash,
        action: 'pull',
        message: `pull: Fast-forward to ${remoteCommitHash.slice(0, 7)}`,
        timestamp: Date.now(),
      },
      ...repo.reflog,
    ];

    return {
      stdout: [
        `Updating ${localCommitHash.slice(0, 7)}..${remoteCommitHash.slice(0, 7)}`,
        `Fast-forward`,
        ` ${Object.keys(remoteCommit.files).length} file(s) updated`,
      ],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'LOW',
      stateChanged: true,
      repo: {
        ...repo,
        branches: newBranches,
        workingDirectory: { ...remoteCommit.files },
        index: { ...remoteCommit.files },
        reflog: newReflog,
      },
      whyExplanation: {
        summary: `Pulled latest commits from ${remoteName}/${targetBranchName}.`,
        headMoved: `HEAD advanced to commit ${remoteCommitHash.slice(0, 7)}.`,
        indexState: `Updated to match remote commit.`,
        workingState: `Working files updated to match remote commit.`,
        historyState: `Local branch caught up with ${remoteName}/${targetBranchName}.`,
      },
      educationalFeedback: `git pull fetched new commits from the remote server and merged them into your local branch.`,
    };
  }

  // git clone
  if (sub === 'clone') {
    const url = cmd.args[0];
    if (!url) {
      return {
        stdout: [],
        stderr: ['fatal: You must specify a repository to clone.'],
        exitCode: 1,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    const repoName = url.split('/').pop()?.replace('.git', '') || 'project';
    return {
      stdout: [
        `Cloning into '${repoName}'...`,
        'remote: Enumerating objects: 12, done.',
        'remote: Compressing objects: 100% (8/8), done.',
        'remote: Total 12 (delta 2), reused 12 (delta 2)',
        'Receiving objects: 100% (12/12), done.',
      ],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: true,
      repo,
      educationalFeedback: `Cloned '${url}' into local project. Clones set up the default 'origin' remote automatically.`,
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
