import { GitRepo, CommandResult, FileStatus, StateInspectorData } from './types';
import { parseCommand } from './parser';
import { evaluateDanger } from './danger';
import { executeFsCommand } from './commands/fsCommands';
import { executeGitBasics } from './commands/gitBasics';
import { executeBranchMerge } from './commands/branchMerge';
import { executeHistoryRecovery } from './commands/historyRecovery';
import { executeRemotesCollab } from './commands/remotesCollab';
import { executeAdvanced } from './commands/advanced';
import { executePlumbing } from './commands/plumbing';
import { inspectGitState, getFileStatuses } from './stateInspector';

export function createInitialRepo(files: Record<string, string> = {}): GitRepo {
  return {
    initialized: false,
    currentDir: '/home/developer/project',
    workingDirectory: { ...files },
    index: {},
    head: { type: 'branch', ref: 'main' },
    branches: {},
    remotes: {},
    commits: {},
    tags: {},
    stash: [],
    reflog: [],
    mergeState: null,
    rebaseState: null,
    bisectState: null,
    config: {
      'user.name': 'Developer',
      'user.email': 'developer@commitforge.dev',
      'init.defaultBranch': 'main',
    },
    ignoredPatterns: ['.env', 'node_modules', '*.log', 'dist', 'build', '.DS_Store'],
    hooks: {},
  };
}

export class GitEngine {
  private repo: GitRepo;
  private initialRepoState: GitRepo;
  private listeners: ((repo: GitRepo) => void)[] = [];

  constructor(initialFiles: Record<string, string> = {}) {
    this.repo = createInitialRepo(initialFiles);
    this.initialRepoState = JSON.parse(JSON.stringify(this.repo));
  }

  public getRepo(): GitRepo {
    return this.repo;
  }

  public setRepo(newRepo: GitRepo): void {
    this.repo = newRepo;
    this.notifyListeners();
  }

  public resetToSnapshot(snapshot: GitRepo): void {
    this.repo = JSON.parse(JSON.stringify(snapshot));
    this.notifyListeners();
  }

  public resetRepo(): void {
    this.repo = JSON.parse(JSON.stringify(this.initialRepoState));
    this.notifyListeners();
  }

  public subscribe(listener: (repo: GitRepo) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.repo);
    }
  }

  // File mutations from IDE Editor or Explorer
  public updateFileContent(path: string, content: string): void {
    this.repo = {
      ...this.repo,
      workingDirectory: {
        ...this.repo.workingDirectory,
        [path]: content,
      },
    };
    this.notifyListeners();
  }

  public createFile(path: string, content: string = ''): void {
    this.repo = {
      ...this.repo,
      workingDirectory: {
        ...this.repo.workingDirectory,
        [path]: content,
      },
    };
    this.notifyListeners();
  }

  public deleteFile(path: string): void {
    const newWorking = { ...this.repo.workingDirectory };
    delete newWorking[path];
    this.repo = {
      ...this.repo,
      workingDirectory: newWorking,
    };
    this.notifyListeners();
  }

  public renameFile(oldPath: string, newPath: string): void {
    const content = this.repo.workingDirectory[oldPath];
    if (content !== undefined) {
      const newWorking = { ...this.repo.workingDirectory };
      delete newWorking[oldPath];
      newWorking[newPath] = content;
      this.repo = {
        ...this.repo,
        workingDirectory: newWorking,
      };
      this.notifyListeners();
    }
  }

  // Inspection helpers
  public getStatuses(): FileStatus[] {
    return getFileStatuses(this.repo);
  }

  public getInspection(): StateInspectorData {
    return inspectGitState(this.repo);
  }

  // Command Execution Pipeline
  public execute(commandLine: string): CommandResult {
    const trimmed = commandLine.trim();
    if (!trimmed) {
      return {
        stdout: [],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo: this.repo,
      };
    }

    const parsed = parseCommand(trimmed);
    const danger = evaluateDanger(trimmed);

    let result: CommandResult;

    if (!parsed.isGit) {
      result = executeFsCommand(parsed, this.repo);
    } else {
      const sub = parsed.subCommand;

      if (['--version', '-v', 'version', 'init', 'status', 'add', 'commit', 'log', 'diff', 'show', 'rm', 'mv', 'help'].includes(sub)) {
        result = executeGitBasics(parsed, this.repo);
      } else if (['branch', 'switch', 'checkout', 'merge'].includes(sub)) {
        result = executeBranchMerge(parsed, this.repo);
      } else if (['reset', 'restore', 'revert', 'reflog'].includes(sub)) {
        result = executeHistoryRecovery(parsed, this.repo);
      } else if (['remote', 'fetch', 'push', 'pull', 'clone'].includes(sub)) {
        result = executeRemotesCollab(parsed, this.repo);
      } else if (['stash', 'tag', 'cherry-pick', 'rebase', 'bisect', 'blame', 'clean', 'config', 'worktree', 'submodule', 'format-patch', 'apply', 'lfs', 'gc', 'maintenance', 'prune'].includes(sub)) {
        result = executeAdvanced(parsed, this.repo);
      } else if (['hash-object', 'cat-file', 'ls-files', 'ls-tree', 'write-tree', 'commit-tree', 'rev-parse', 'rev-list', 'update-ref', 'show-ref', 'for-each-ref', 'count-objects', 'fsck'].includes(sub)) {
        result = executePlumbing(parsed, this.repo);
      } else {
        result = {
          stdout: [],
          stderr: [`git: '${sub}' is not a recognized command. See 'git --help'.`],
          exitCode: 1,
          dangerLevel: 'SAFE',
          stateChanged: false,
          repo: this.repo,
        };
      }
    }

    result.dangerLevel = danger.level;

    if (result.stateChanged) {
      this.repo = result.repo;
      this.notifyListeners();
    }

    return result;
  }
}
