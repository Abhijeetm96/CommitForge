import { GitRepo } from '../../git-engine/types';

/**
 * Reusable Visual Entities for CommitForge Git Physics
 * Ensures consistent visual identity across all lessons, labs, and movie mode.
 */

export interface VisualFile {
  name: string;
  status: 'untracked' | 'modified' | 'staged' | 'clean' | 'deleted';
  linesAdded?: number;
  linesRemoved?: number;
  previewSnippet?: string;
}

export interface VisualCommitNode {
  hash: string;
  shortHash: string;
  message: string;
  author: string;
  timestamp: number;
  parents: string[];
  branchLabels: string[];
  isHead: boolean;
  isRemoteHead?: boolean;
  x?: number;
  y?: number;
  isNew?: boolean;
  isReplayed?: boolean;
}

export interface VisualBranchPointer {
  name: string;
  targetCommitHash: string;
  isHeadTarget: boolean;
  isRemote?: boolean;
  remoteName?: string;
}

export interface VisualHeadPointer {
  type: 'branch' | 'detached';
  targetBranch?: string;
  targetCommitHash: string;
}

export interface VisualStashEntry {
  index: number;
  message: string;
  branch: string;
  files: string[];
}

export interface VisualRemoteRepo {
  name: string;
  url: string;
  branches: Record<string, string>; // branchName -> targetCommitHash
  isAhead?: boolean;
  isBehind?: boolean;
  isInSync?: boolean;
  unpushedCommitsCount?: number;
}

export interface GitVisualSnapshot {
  workingTree: VisualFile[];
  stagingArea: VisualFile[];
  commits: VisualCommitNode[];
  branches: VisualBranchPointer[];
  head: VisualHeadPointer;
  remotes: VisualRemoteRepo[];
  stash: VisualStashEntry[];
  activeConflict?: {
    file: string;
    ourContent: string;
    theirContent: string;
    ancestorContent?: string;
  };
}

/**
 * Derives a consistent GitVisualSnapshot from the authoritative GitRepo state
 */
export function deriveVisualSnapshot(repo: GitRepo): GitVisualSnapshot {
  const headCommitHash = repo.head.type === 'branch'
    ? repo.branches[repo.head.ref]?.targetCommitHash || ''
    : repo.head.ref;

  // 1. Working Tree Files
  const workingTree: VisualFile[] = Object.entries(repo.workingDirectory).map(([name, content]) => {
    const isStaged = Boolean(repo.index[name]);
    const isCommitted = Boolean(headCommitHash && repo.commits[headCommitHash]?.files?.[name]);
    
    let status: VisualFile['status'] = 'clean';
    if (!repo.initialized) {
      status = 'untracked';
    } else if (!isCommitted && !isStaged) {
      status = 'untracked';
    } else if (isStaged && repo.index[name] !== content) {
      status = 'modified';
    } else if (!isStaged && isCommitted && repo.commits[headCommitHash]?.files?.[name] !== content) {
      status = 'modified';
    } else if (isStaged) {
      status = 'staged';
    }

    return {
      name,
      status,
      previewSnippet: content.slice(0, 100),
    };
  });

  // 2. Staging Area Files
  const stagingArea: VisualFile[] = Object.entries(repo.index).map(([name, content]) => ({
    name,
    status: 'staged',
    previewSnippet: content.slice(0, 100),
  }));

  // 3. Commit Graph Nodes
  const commits: VisualCommitNode[] = Object.values(repo.commits).map((c) => {
    const branchLabels = Object.entries(repo.branches)
      .filter(([_, b]) => b.targetCommitHash === c.hash)
      .map(([name]) => name);

    return {
      hash: c.hash,
      shortHash: c.hash.slice(0, 7),
      message: c.message,
      author: c.author,
      timestamp: c.timestamp,
      parents: c.parents,
      branchLabels,
      isHead: headCommitHash === c.hash,
    };
  });

  // 4. Branch Pointers
  const branches: VisualBranchPointer[] = Object.entries(repo.branches).map(([name, b]) => ({
    name,
    targetCommitHash: b.targetCommitHash,
    isHeadTarget: repo.head.type === 'branch' && repo.head.ref === name,
  }));

  // 5. HEAD Pointer
  const head: VisualHeadPointer = {
    type: repo.head.type,
    targetBranch: repo.head.type === 'branch' ? repo.head.ref : undefined,
    targetCommitHash: headCommitHash,
  };

  // 6. Remotes
  const remotes: VisualRemoteRepo[] = Object.entries(repo.remotes).map(([name, r]) => {
    const remoteBranches: Record<string, string> = {};
    for (const [bName, rb] of Object.entries(r.branches)) {
      remoteBranches[bName] = rb.targetCommitHash;
    }

    // Check sync status for current branch
    const curBranch = repo.head.type === 'branch' ? repo.head.ref : 'main';
    const localHash = repo.branches[curBranch]?.targetCommitHash;
    const remoteHash = remoteBranches[curBranch];

    const isInSync = Boolean(localHash && remoteHash && localHash === remoteHash);
    const isAhead = Boolean(localHash && remoteHash && localHash !== remoteHash);

    return {
      name,
      url: r.url,
      branches: remoteBranches,
      isInSync,
      isAhead,
      unpushedCommitsCount: isAhead ? 1 : 0,
    };
  });

  // 7. Stash
  const stash: VisualStashEntry[] = repo.stash.map((s, idx) => ({
    index: idx,
    message: s.message,
    branch: s.branch,
    files: Object.keys(s.workingFiles),
  }));

  return {
    workingTree,
    stagingArea,
    commits,
    branches,
    head,
    remotes,
    stash,
    activeConflict: repo.mergeState?.conflicts?.length
      ? {
          file: repo.mergeState.conflicts[0],
          ourContent: repo.workingDirectory[repo.mergeState.conflicts[0]] || '',
          theirContent: '',
        }
      : undefined,
  };
}
