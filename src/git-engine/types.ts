export type DangerLevel = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';

export interface FileNode {
  path: string;
  content: string;
  isDeleted?: boolean;
}

export interface Commit {
  hash: string;
  shortHash: string;
  parents: string[];
  tree: Record<string, string>; // path -> blobHash
  files: Record<string, string>; // snapshot of path -> content
  author: string;
  email: string;
  date: string;
  timestamp: number;
  message: string;
  tags?: string[];
}

export interface Branch {
  name: string;
  targetCommitHash: string;
  upstream?: string; // e.g. "origin/main"
}

export interface RemoteBranch {
  remote: string; // e.g. "origin"
  branch: string; // e.g. "main"
  targetCommitHash: string;
}

export interface Remote {
  name: string;
  url: string;
  branches: Record<string, RemoteBranch>;
}

export interface Tag {
  name: string;
  targetCommitHash: string;
  annotated: boolean;
  message?: string;
  tagger?: string;
  date?: string;
}

export interface StashEntry {
  id: number;
  message: string;
  branch: string;
  workingFiles: Record<string, string>;
  indexFiles: Record<string, string>;
  timestamp: number;
}

export interface ReflogEntry {
  index: number;
  fromHash: string;
  toHash: string;
  action: string; // "commit", "checkout", "reset", "merge", "rebase", etc.
  message: string;
  timestamp: number;
}

export interface MergeState {
  inProgress: boolean;
  sourceBranch: string;
  sourceCommit: string;
  targetBranch: string;
  conflicts: string[]; // file paths containing conflict markers
  resolved: string[];
  autoMergedFiles: Record<string, string>;
}

export type RebaseAction = 'pick' | 'reword' | 'edit' | 'squash' | 'fixup' | 'drop';

export interface RebaseTodoItem {
  action: RebaseAction;
  hash: string;
  shortHash: string;
  message: string;
  files: Record<string, string>;
}

export interface RebaseState {
  inProgress: boolean;
  ontoBranch: string;
  ontoCommit: string;
  originalHead: string;
  todoList: RebaseTodoItem[];
  currentStep: number;
  interactive: boolean;
}

export interface BisectState {
  active: boolean;
  badCommit: string | null;
  goodCommits: string[];
  remainingCommits: string[];
  currentTestCommit: string | null;
  foundBadCommit?: string | null;
}

export interface HeadRef {
  type: 'branch' | 'detached';
  ref: string; // branch name (e.g. 'main') or commit hash (e.g. 'c4d7e2a')
}

export interface GitRepo {
  initialized: boolean;
  currentDir: string;
  workingDirectory: Record<string, string>; // path -> content
  index: Record<string, string>; // path -> content (staged)
  head: HeadRef;
  branches: Record<string, Branch>;
  remotes: Record<string, Remote>;
  commits: Record<string, Commit>;
  tags: Record<string, Tag>;
  stash: StashEntry[];
  reflog: ReflogEntry[];
  mergeState: MergeState | null;
  rebaseState: RebaseState | null;
  bisectState: BisectState | null;
  config: Record<string, string>;
  ignoredPatterns: string[];
  hooks: Record<string, string>;
}

export interface WhyExplanation {
  summary: string;
  headMoved?: string;
  indexState?: string;
  workingState?: string;
  historyState?: string;
}

export interface CommandComparison {
  title: string;
  options: {
    label: string;
    description: string;
    effect: string;
  }[];
}

export interface CommandResult {
  stdout: string[];
  stderr: string[];
  exitCode: number;
  dangerLevel: DangerLevel;
  stateChanged: boolean;
  repo: GitRepo;
  error?: string;
  success?: boolean;
  whyExplanation?: WhyExplanation;
  comparisons?: CommandComparison;
  educationalFeedback?: string;
}

export interface FileStatus {
  path: string;
  inWorkingTree: boolean;
  inIndex: boolean;
  inHead: boolean;
  workingContent: string | null;
  indexContent: string | null;
  headContent: string | null;
  isModified: boolean; // working != index
  isStagedModified: boolean; // index != head
  isUntracked: boolean; // in working, not in index or head
  isStagedNew: boolean; // in index, not in head
  isStagedDeleted: boolean; // in head, not in index
  isWorkingDeleted: boolean; // in index, not in working
  isIgnored: boolean;
  hasConflict: boolean;
}

export interface StateInspectorData {
  head: string;
  headCommitHash: string | null;
  headCommitShortHash: string | null;
  headCommitMessage: string | null;
  currentBranch: string | null;
  isDetachedHead: boolean;
  workingDirSummary: string;
  stagingSummary: string;
  remoteSyncSummary: string;
  activeOperation: 'idle' | 'merging' | 'rebasing' | 'bisecting';
  plainEnglishExplanation: string[];
  fileStatuses: FileStatus[];
}
