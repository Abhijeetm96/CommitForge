import { GitRepo, StateInspectorData, FileStatus } from './types';

export function getFileStatuses(repo: GitRepo): FileStatus[] {
  const allPaths = new Set<string>([
    ...Object.keys(repo.workingDirectory),
    ...Object.keys(repo.index),
  ]);

  let headFiles: Record<string, string> = {};
  if (repo.head.type === 'branch') {
    const branch = repo.branches[repo.head.ref];
    if (branch && repo.commits[branch.targetCommitHash]) {
      headFiles = repo.commits[branch.targetCommitHash].files || {};
    }
  } else if (repo.head.type === 'detached') {
    if (repo.commits[repo.head.ref]) {
      headFiles = repo.commits[repo.head.ref].files || {};
    }
  }

  for (const p of Object.keys(headFiles)) {
    allPaths.add(p);
  }

  const statuses: FileStatus[] = [];

  for (const path of Array.from(allPaths).sort()) {
    const workingContent = repo.workingDirectory[path] ?? null;
    const indexContent = repo.index[path] ?? null;
    const headContent = headFiles[path] ?? null;

    const inWorkingTree = workingContent !== null;
    const inIndex = indexContent !== null;
    const inHead = headContent !== null;

    // Is it ignored by pattern?
    const isIgnored = repo.ignoredPatterns.some(pat => {
      if (pat.startsWith('*.')) {
        return path.endsWith(pat.slice(1));
      }
      return path === pat || path.startsWith(pat + '/');
    });

    const isModified = inWorkingTree && inIndex && workingContent !== indexContent;
    const isStagedModified = inIndex && inHead && indexContent !== headContent;
    const isUntracked = inWorkingTree && !inIndex && !inHead && !isIgnored;
    const isStagedNew = inIndex && !inHead;
    const isStagedDeleted = inHead && !inIndex;
    const isWorkingDeleted = inIndex && !inWorkingTree;
    const hasConflict = !!(workingContent && workingContent.includes('<<<<<<< HEAD'));

    statuses.push({
      path,
      inWorkingTree,
      inIndex,
      inHead,
      workingContent,
      indexContent,
      headContent,
      isModified,
      isStagedModified,
      isUntracked,
      isStagedNew,
      isStagedDeleted,
      isWorkingDeleted,
      isIgnored,
      hasConflict,
    });
  }

  return statuses;
}

export function inspectGitState(repo: GitRepo): StateInspectorData {
  if (!repo.initialized) {
    return {
      head: 'Not initialized',
      headCommitHash: null,
      headCommitShortHash: null,
      headCommitMessage: null,
      currentBranch: null,
      isDetachedHead: false,
      workingDirSummary: 'No Git repository found (run git init)',
      stagingSummary: 'Empty',
      remoteSyncSummary: 'No remotes',
      activeOperation: 'idle',
      plainEnglishExplanation: [
        'Directory is not a Git repository. Git is not tracking any changes here yet.',
        'Type `git init` to initialize version control in this project.'
      ],
      fileStatuses: [],
    };
  }

  const statuses = getFileStatuses(repo);
  const isDetached = repo.head.type === 'detached';
  const currentBranch = isDetached ? null : repo.head.ref;
  
  let headCommitHash: string | null = null;
  if (isDetached) {
    headCommitHash = repo.head.ref;
  } else if (currentBranch && repo.branches[currentBranch]) {
    headCommitHash = repo.branches[currentBranch].targetCommitHash;
  }

  const headCommit = headCommitHash ? repo.commits[headCommitHash] : null;
  const headCommitShort = headCommit ? headCommit.shortHash : null;

  // Summaries
  const modifiedCount = statuses.filter(s => s.isModified).length;
  const untrackedCount = statuses.filter(s => s.isUntracked).length;
  const stagedCount = statuses.filter(s => s.isStagedModified || s.isStagedNew || s.isStagedDeleted).length;
  const conflictCount = statuses.filter(s => s.hasConflict).length;

  let workingDirSummary = 'Clean';
  if (conflictCount > 0) {
    workingDirSummary = `${conflictCount} conflict(s) need resolution!`;
  } else if (modifiedCount > 0 || untrackedCount > 0) {
    const parts = [];
    if (modifiedCount > 0) parts.push(`${modifiedCount} modified`);
    if (untrackedCount > 0) parts.push(`${untrackedCount} untracked`);
    workingDirSummary = parts.join(', ');
  }

  const stagingSummary = stagedCount > 0 ? `${stagedCount} change(s) staged for commit` : 'Empty (nothing staged)';

  // Remote Sync calculation
  let remoteSyncSummary = 'Up to date';
  if (currentBranch) {
    const branch = repo.branches[currentBranch];
    if (branch?.upstream) {
      const [remoteName, remoteBranchName] = branch.upstream.split('/');
      const remote = repo.remotes[remoteName];
      const remoteBranch = remote?.branches[remoteBranchName];

      if (remoteBranch) {
        // Count commits ahead or behind
        let ahead = 0;
        let behind = 0;

        // Simple BFS or ancestor check
        const localHash = branch.targetCommitHash;
        const remoteHash = remoteBranch.targetCommitHash;

        if (localHash === remoteHash) {
          remoteSyncSummary = `In sync with ${branch.upstream}`;
        } else {
          // Check ahead
          let curr: string | null = localHash;
          while (curr && curr !== remoteHash && repo.commits[curr]) {
            ahead++;
            curr = repo.commits[curr].parents[0] || null;
          }

          if (curr !== remoteHash) {
            ahead = 0;
            // Check behind
            curr = remoteHash;
            while (curr && curr !== localHash && repo.commits[curr]) {
              behind++;
              curr = repo.commits[curr].parents[0] || null;
            }
          }

          if (ahead > 0 && behind > 0) {
            remoteSyncSummary = `Diverged (${ahead} ahead, ${behind} behind ${branch.upstream})`;
          } else if (ahead > 0) {
            remoteSyncSummary = `${ahead} commit(s) ahead of ${branch.upstream}`;
          } else if (behind > 0) {
            remoteSyncSummary = `${behind} commit(s) behind ${branch.upstream}`;
          }
        }
      }
    } else {
      remoteSyncSummary = 'Local branch (no remote tracking)';
    }
  }

  // Active operation
  let activeOperation: 'idle' | 'merging' | 'rebasing' | 'bisecting' = 'idle';
  if (repo.mergeState?.inProgress) activeOperation = 'merging';
  else if (repo.rebaseState?.inProgress) activeOperation = 'rebasing';
  else if (repo.bisectState?.active) activeOperation = 'bisecting';

  // Plain English Bullet Points
  const explanations: string[] = [];

  if (isDetached) {
    explanations.push(`⚠️ Detached HEAD: You are currently looking directly at commit ${headCommitShort || repo.head.ref}. HEAD is NOT pointing to any branch.`);
    explanations.push(`Any new commits you make right now will not belong to any branch and will be lost when you switch away unless you create a branch.`);
  } else {
    explanations.push(`HEAD points to the branch '${currentBranch}'.`);
    if (headCommit) {
      explanations.push(`Latest commit is [${headCommit.shortHash}] "${headCommit.message}" by ${headCommit.author}.`);
    } else {
      explanations.push(`No commits have been made yet on '${currentBranch}'. Ready for initial commit.`);
    }
  }

  if (activeOperation === 'merging') {
    explanations.push(`⚡ Merge in progress: Integrating '${repo.mergeState?.sourceBranch}' into '${currentBranch}'.`);
    if (conflictCount > 0) {
      explanations.push(`🚨 Merge conflicts detected in ${conflictCount} file(s). Edit the markers (<<<<<<< HEAD) to resolve, then run git add and git commit.`);
    } else {
      explanations.push(`All conflicts resolved. Run 'git commit' to record the merge commit.`);
    }
  } else if (activeOperation === 'rebasing') {
    explanations.push(`🔄 Rebase in progress: Replaying commits onto '${repo.rebaseState?.ontoBranch}'. Step ${repo.rebaseState?.currentStep} of ${repo.rebaseState?.todoList.length}.`);
  } else if (activeOperation === 'bisecting') {
    explanations.push(`🔍 Git Bisect active: Binary searching for the regression commit. Test the code and run 'git bisect good' or 'git bisect bad'.`);
  }

  if (stagedCount > 0) {
    explanations.push(`${stagedCount} file(s) are in the Staging Area. Running 'git commit' right now will save these exact staged changes.`);
  } else {
    explanations.push(`Staging Area is empty. Running 'git commit' will result in 'nothing to commit'. Use 'git add <file>' first.`);
  }

  if (modifiedCount > 0) {
    explanations.push(`${modifiedCount} file(s) in your Working Directory have unsaved changes that are not yet staged.`);
  }

  if (untrackedCount > 0) {
    explanations.push(`${untrackedCount} file(s) are untracked (new files Git has never seen before).`);
  }

  if (repo.stash.length > 0) {
    explanations.push(`📦 Stash has ${repo.stash.length} saved stash item(s). Use 'git stash list' or 'git stash pop' to retrieve.`);
  }

  return {
    head: isDetached ? `detached (${headCommitShort})` : currentBranch || 'HEAD',
    headCommitHash,
    headCommitShortHash: headCommitShort,
    headCommitMessage: headCommit ? headCommit.message : null,
    currentBranch,
    isDetachedHead: isDetached,
    workingDirSummary,
    stagingSummary,
    remoteSyncSummary,
    activeOperation,
    plainEnglishExplanation: explanations,
    fileStatuses: statuses,
  };
}
