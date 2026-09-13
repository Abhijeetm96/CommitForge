import { GitRepo } from '../../git-engine/types';

export interface GitStateDelta {
  hasChanges: boolean;
  workingTreeChanges: {
    file: string;
    action: 'created' | 'modified' | 'deleted';
  }[];
  indexChanges: {
    file: string;
    action: 'staged' | 'unstaged' | 'modified';
  }[];
  headMoved: boolean;
  headBefore: string;
  headAfter: string;
  branchesChanged: {
    name: string;
    beforeHash?: string;
    afterHash?: string;
    type: 'created' | 'moved' | 'deleted';
  }[];
  remoteBranchesChanged: {
    remote: string;
    branch: string;
    beforeHash?: string;
    afterHash?: string;
  }[];
  newCommits: {
    hash: string;
    message: string;
    author: string;
  }[];
  stashChanged: boolean;
  stashCountBefore: number;
  stashCountAfter: number;
  summary: string[];
  whyExplanation: string;
}

export function calculateGitStateDiff(before: GitRepo, after: GitRepo): GitStateDelta {
  const summary: string[] = [];

  // 1. Working Tree
  const workingTreeChanges: GitStateDelta['workingTreeChanges'] = [];
  const allFiles = new Set([...Object.keys(before.workingDirectory), ...Object.keys(after.workingDirectory)]);
  
  for (const file of allFiles) {
    const contentBefore = before.workingDirectory[file];
    const contentAfter = after.workingDirectory[file];

    if (contentBefore === undefined && contentAfter !== undefined) {
      workingTreeChanges.push({ file, action: 'created' });
      summary.push(`Created file '${file}' in Working Tree`);
    } else if (contentBefore !== undefined && contentAfter === undefined) {
      workingTreeChanges.push({ file, action: 'deleted' });
      summary.push(`Removed file '${file}' from Working Tree`);
    } else if (contentBefore !== contentAfter) {
      workingTreeChanges.push({ file, action: 'modified' });
      summary.push(`Modified file '${file}' in Working Tree`);
    }
  }

  // 2. Index (Staging Area)
  const indexChanges: GitStateDelta['indexChanges'] = [];
  const allIndexFiles = new Set([...Object.keys(before.index), ...Object.keys(after.index)]);

  for (const file of allIndexFiles) {
    const stagedBefore = before.index[file];
    const stagedAfter = after.index[file];

    if (stagedBefore === undefined && stagedAfter !== undefined) {
      indexChanges.push({ file, action: 'staged' });
      summary.push(`Staged '${file}' into Staging Area`);
    } else if (stagedBefore !== undefined && stagedAfter === undefined) {
      indexChanges.push({ file, action: 'unstaged' });
      summary.push(`Unstaged '${file}' from Staging Area`);
    } else if (stagedBefore !== stagedAfter) {
      indexChanges.push({ file, action: 'modified' });
      summary.push(`Updated staged content for '${file}'`);
    }
  }

  // 3. HEAD Movement
  const headBeforeRef = before.head.ref || 'none';
  const headAfterRef = after.head.ref || 'none';
  const headMoved = headBeforeRef !== headAfterRef;
  if (headMoved) {
    summary.push(`HEAD moved from '${headBeforeRef}' to '${headAfterRef}'`);
  }

  // 4. Branch movements
  const branchesChanged: GitStateDelta['branchesChanged'] = [];
  const allBranches = new Set([...Object.keys(before.branches), ...Object.keys(after.branches)]);

  for (const bName of allBranches) {
    const bBefore = before.branches[bName];
    const bAfter = after.branches[bName];

    if (!bBefore && bAfter) {
      branchesChanged.push({ name: bName, afterHash: bAfter.targetCommitHash, type: 'created' });
      summary.push(`Created branch '${bName}' pointing to ${bAfter.targetCommitHash.slice(0, 7)}`);
    } else if (bBefore && !bAfter) {
      branchesChanged.push({ name: bName, beforeHash: bBefore.targetCommitHash, type: 'deleted' });
      summary.push(`Deleted branch '${bName}'`);
    } else if (bBefore && bAfter && bBefore.targetCommitHash !== bAfter.targetCommitHash) {
      branchesChanged.push({
        name: bName,
        beforeHash: bBefore.targetCommitHash,
        afterHash: bAfter.targetCommitHash,
        type: 'moved',
      });
      summary.push(`Branch '${bName}' advanced from ${bBefore.targetCommitHash.slice(0, 7)} to ${bAfter.targetCommitHash.slice(0, 7)}`);
    }
  }

  // 5. Remote branch tracking references
  const remoteBranchesChanged: GitStateDelta['remoteBranchesChanged'] = [];
  for (const [rName, rAfter] of Object.entries(after.remotes)) {
    const rBefore = before.remotes[rName];
    for (const [rbName, rbAfter] of Object.entries(rAfter.branches)) {
      const rbBeforeHash = rBefore?.branches[rbName]?.targetCommitHash;
      if (rbBeforeHash !== rbAfter.targetCommitHash) {
        remoteBranchesChanged.push({
          remote: rName,
          branch: rbName,
          beforeHash: rbBeforeHash,
          afterHash: rbAfter.targetCommitHash,
        });
        summary.push(
          `Remote reference '${rName}/${rbName}' updated from ${rbBeforeHash ? rbBeforeHash.slice(0, 7) : 'none'} to ${rbAfter.targetCommitHash.slice(0, 7)}`
        );
      }
    }
  }

  // 6. New Commits
  const newCommits: GitStateDelta['newCommits'] = [];
  for (const [hash, commit] of Object.entries(after.commits)) {
    if (!before.commits[hash]) {
      newCommits.push({ hash, message: commit.message, author: commit.author });
      summary.push(`Created new commit [${hash.slice(0, 7)}] "${commit.message}"`);
    }
  }

  // 7. Stash
  const stashChanged = before.stash.length !== after.stash.length;
  if (stashChanged) {
    if (after.stash.length > before.stash.length) {
      summary.push(`Stashed working modifications (${after.stash.length} in stash stack)`);
    } else {
      summary.push(`Popped/dropped stash entry (${after.stash.length} remaining)`);
    }
  }

  const hasChanges =
    workingTreeChanges.length > 0 ||
    indexChanges.length > 0 ||
    headMoved ||
    branchesChanged.length > 0 ||
    remoteBranchesChanged.length > 0 ||
    newCommits.length > 0 ||
    stashChanged;

  let whyExplanation = 'No state changes occurred.';
  if (remoteBranchesChanged.length > 0) {
    whyExplanation = `Remote reference '${remoteBranchesChanged[0].remote}/${remoteBranchesChanged[0].branch}' was updated because new commits were accepted by the remote repository.`;
  } else if (newCommits.length > 0) {
    whyExplanation = `A new commit was created because you took a snapshot of staged changes.`;
  } else if (indexChanges.length > 0 && indexChanges.some(i => i.action === 'staged')) {
    whyExplanation = `Files were placed in the Staging Area to prepare them for the next commit snapshot.`;
  } else if (headMoved) {
    whyExplanation = `HEAD moved to point to your new working location.`;
  }

  return {
    hasChanges,
    workingTreeChanges,
    indexChanges,
    headMoved,
    headBefore: headBeforeRef,
    headAfter: headAfterRef,
    branchesChanged,
    remoteBranchesChanged,
    newCommits,
    stashChanged,
    stashCountBefore: before.stash.length,
    stashCountAfter: after.stash.length,
    summary,
    whyExplanation,
  };
}
