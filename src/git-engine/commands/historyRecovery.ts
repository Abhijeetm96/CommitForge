import { GitRepo, CommandResult, Commit, ReflogEntry } from '../types';
import { ParsedCommand } from '../parser';
import { generateGitHash } from '../hash';
import { computeLineDiff } from '../diff';

// Helper to resolve HEAD~n or commit references
export function resolveCommitRef(target: string, repo: GitRepo): string | null {
  let headHash = repo.head.type === 'branch'
    ? repo.branches[repo.head.ref]?.targetCommitHash
    : repo.head.ref;

  if (!headHash) return null;

  if (target === 'HEAD') return headHash;

  // Check HEAD~n or HEAD^
  const matchHeadTilde = target.match(/^HEAD~(\d+)$/);
  if (matchHeadTilde) {
    const steps = parseInt(matchHeadTilde[1], 10);
    let curr: string | null = headHash;
    for (let i = 0; i < steps; i++) {
      if (!curr || !repo.commits[curr] || repo.commits[curr].parents.length === 0) return null;
      curr = repo.commits[curr].parents[0];
    }
    return curr;
  }

  if (target === 'HEAD^' || target === 'HEAD~') {
    return repo.commits[headHash]?.parents[0] || null;
  }

  if (target === 'HEAD^^') {
    const parent1 = repo.commits[headHash]?.parents[0];
    return parent1 ? repo.commits[parent1]?.parents[0] || null : null;
  }

  // Check branches
  if (repo.branches[target]) {
    return repo.branches[target].targetCommitHash;
  }

  // Check tags
  if (repo.tags[target]) {
    return repo.tags[target].targetCommitHash;
  }

  // Check reflog syntax: HEAD@{n}
  const matchReflog = target.match(/^HEAD@\{(\d+)\}$/);
  if (matchReflog) {
    const idx = parseInt(matchReflog[1], 10);
    const entry = repo.reflog[idx];
    return entry ? entry.toHash : null;
  }

  // Check commit hashes (short or full)
  for (const h of Object.keys(repo.commits)) {
    if (h.startsWith(target)) return h;
  }

  return null;
}

export function executeHistoryRecovery(cmd: ParsedCommand, repo: GitRepo): CommandResult {
  const sub = cmd.subCommand;

  // git restore
  if (sub === 'restore') {
    const isStaged = cmd.flags['staged'] || cmd.flags['S'];
    const targetFile = cmd.args[0];

    if (!targetFile) {
      return {
        stdout: [],
        stderr: ['fatal: you must specify path(s) to restore'],
        exitCode: 1,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    let headFiles: Record<string, string> = {};
    const headCommitHash = repo.head.type === 'branch' ? repo.branches[repo.head.ref]?.targetCommitHash : repo.head.ref;
    if (headCommitHash && repo.commits[headCommitHash]) {
      headFiles = repo.commits[headCommitHash].files;
    }

    if (isStaged) {
      // Unstage: restore --staged <file>
      const newIndex = { ...repo.index };
      if (headFiles[targetFile] !== undefined) {
        newIndex[targetFile] = headFiles[targetFile];
      } else {
        // Was a new untracked file that got staged
        delete newIndex[targetFile];
      }

      return {
        stdout: [],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: true,
        repo: { ...repo, index: newIndex },
        whyExplanation: {
          summary: `Unstaged '${targetFile}'. File removed from Staging Area.`,
          headMoved: 'HEAD did not move.',
          indexState: `'${targetFile}' reverted to match HEAD (or was unstaged).`,
          workingState: `Working Directory content was NOT modified. Your edits are safe.`,
          historyState: 'Commit history unchanged.',
        },
        comparisons: {
          title: 'Unstaging Methods Comparison',
          options: [
            { label: 'git restore --staged <file>', description: 'Modern, intuitive command', effect: 'Unstages file; preserves working copy edits.' },
            { label: 'git reset <file>', description: 'Older traditional command', effect: 'Does the exact same thing as restore --staged.' },
            { label: 'git restore <file>', description: 'Without --staged flag', effect: 'DISCARDS working tree edits! Be careful.' },
          ],
        },
        educationalFeedback: `Unstaged '${targetFile}'. The file remains in your working directory with all your edits intact!`,
      };
    }

    // Restore working copy: git restore <file>
    if (repo.index[targetFile] !== undefined) {
      const newWorking = { ...repo.workingDirectory, [targetFile]: repo.index[targetFile] };
      return {
        stdout: [],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'MEDIUM',
        stateChanged: true,
        repo: { ...repo, workingDirectory: newWorking },
        whyExplanation: {
          summary: `Discarded working directory edits in '${targetFile}'.`,
          headMoved: 'HEAD did not move.',
          indexState: 'Unchanged.',
          workingState: `'${targetFile}' restored to match the Staging Area.`,
          historyState: 'Unchanged.',
        },
        educationalFeedback: `Restored '${targetFile}' to match Staging Area. Unstaged changes in this file were discarded.`,
      };
    } else if (headFiles[targetFile] !== undefined) {
      const newWorking = { ...repo.workingDirectory, [targetFile]: headFiles[targetFile] };
      return {
        stdout: [],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'MEDIUM',
        stateChanged: true,
        repo: { ...repo, workingDirectory: newWorking },
        educationalFeedback: `Restored '${targetFile}' to match HEAD.`,
      };
    }

    return {
      stdout: [],
      stderr: [`error: pathspec '${targetFile}' did not match any file(s) known to git`],
      exitCode: 1,
      dangerLevel: 'SAFE',
      stateChanged: false,
      repo,
    };
  }

  // git reset
  if (sub === 'reset') {
    const isSoft = cmd.flags['soft'];
    const isHard = cmd.flags['hard'];
    const isMixed = cmd.flags['mixed'] || (!isSoft && !isHard);

    // Check if user is resetting specific file: git reset <file> or git reset HEAD <file>
    let firstArg = cmd.args[0] || 'HEAD';
    if (firstArg === 'HEAD' && cmd.args[1]) {
      // git reset HEAD <file>
      return executeHistoryRecovery({ ...cmd, subCommand: 'restore', flags: { staged: true }, args: [cmd.args[1]] }, repo);
    }

    if (repo.workingDirectory[firstArg] !== undefined || repo.index[firstArg] !== undefined) {
      // Argument is a file path
      return executeHistoryRecovery({ ...cmd, subCommand: 'restore', flags: { staged: true }, args: [firstArg] }, repo);
    }

    // Commit reset: git reset [--soft|--mixed|--hard] <target>
    const targetRef = firstArg;
    const targetCommitHash = resolveCommitRef(targetRef, repo);

    if (!targetCommitHash || !repo.commits[targetCommitHash]) {
      return {
        stdout: [],
        stderr: [`fatal: ambiguous argument '${targetRef}': unknown revision or path`],
        exitCode: 128,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    const currentHeadHash = repo.head.type === 'branch'
      ? repo.branches[repo.head.ref]?.targetCommitHash || ''
      : repo.head.ref;

    const targetCommit = repo.commits[targetCommitHash];
    const newBranches = { ...repo.branches };
    let newHead = { ...repo.head };

    if (repo.head.type === 'branch') {
      newBranches[repo.head.ref] = {
        ...newBranches[repo.head.ref],
        targetCommitHash,
      };
    } else {
      newHead = { type: 'detached', ref: targetCommitHash };
    }

    let newIndex = { ...repo.index };
    let newWorking = { ...repo.workingDirectory };

    if (isSoft) {
      // --soft: Keep Staging and Working tree intact!
      // Any commits uncommitted become staged!
      // In fact, the staged index keeps changes between targetCommit and previous HEAD
    } else if (isHard) {
      // --hard: Overwrite both Index and Working Directory!
      newIndex = { ...targetCommit.files };
      newWorking = { ...targetCommit.files };
    } else {
      // --mixed (default): Reset Index to targetCommit, keep Working Directory intact!
      newIndex = { ...targetCommit.files };
    }

    const newReflog: ReflogEntry[] = [
      {
        index: repo.reflog.length,
        fromHash: currentHeadHash,
        toHash: targetCommitHash,
        action: 'reset',
        message: `reset: moving to ${targetRef}`,
        timestamp: Date.now(),
      },
      ...repo.reflog,
    ];

    const modeName = isSoft ? '--soft' : isHard ? '--hard' : '--mixed';
    const dangerLevel = isHard ? 'HIGH' : 'MEDIUM';

    return {
      stdout: [
        isHard ? `HEAD is now at ${targetCommit.shortHash} ${targetCommit.message}` : `Unstaged changes after reset:`,
      ],
      stderr: [],
      exitCode: 0,
      dangerLevel,
      stateChanged: true,
      repo: {
        ...repo,
        branches: newBranches,
        head: newHead,
        index: newIndex,
        workingDirectory: newWorking,
        reflog: newReflog,
      },
      whyExplanation: {
        summary: `Executed 'git reset ${modeName} ${targetRef}'. HEAD moved to commit ${targetCommit.shortHash}.`,
        headMoved: `HEAD and branch pointer moved from ${currentHeadHash.slice(0, 7)} to ${targetCommit.shortHash}.`,
        indexState: isSoft
          ? 'Preserved! Your changes from undone commits are now in the Staging Area.'
          : isHard
          ? `Overwritten to match commit ${targetCommit.shortHash}.`
          : `Reset to match commit ${targetCommit.shortHash} (changes left unstaged in Working Tree).`,
        workingState: isHard
          ? `Overwritten! All unstaged and uncommitted changes were permanently deleted.`
          : 'Preserved! Your edited files are still in your working directory.',
        historyState: `Previous commit ${currentHeadHash.slice(0, 7)} is no longer in branch history, but can still be recovered via 'git reflog'!`,
      },
      comparisons: {
        title: 'Git Reset Modes Comparison',
        options: [
          {
            label: 'git reset --soft',
            description: 'Moves HEAD only',
            effect: 'Undoes commit(s), but leaves all changes staged in the index ready to re-commit.',
          },
          {
            label: 'git reset --mixed (default)',
            description: 'Moves HEAD + Resets Staging Area',
            effect: 'Undoes commit(s) and unstages files, but keeps all edits in your working directory.',
          },
          {
            label: 'git reset --hard',
            description: 'Moves HEAD + Resets Staging Area + Overwrites Working Tree',
            effect: 'DESTRUCTIVE! Discards all uncommitted changes. Matches target commit completely.',
          },
        ],
      },
      educationalFeedback: `Reset to ${targetCommit.shortHash} (${modeName}). ${isHard ? 'All changes discarded.' : 'Changes preserved in files.'}`,
    };
  }

  // git revert
  if (sub === 'revert') {
    const targetRef = cmd.args[0] || 'HEAD';
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

    const commitToRevert = repo.commits[targetCommitHash];
    const parentHash = commitToRevert.parents[0];
    const parentFiles = parentHash && repo.commits[parentHash] ? repo.commits[parentHash].files : {};

    // Revert logic: apply inverse of commitToRevert relative to its parent
    const newWorking = { ...repo.workingDirectory };
    const newIndex = { ...repo.index };

    // For files modified in commitToRevert, restore them to parentFiles
    for (const [p, content] of Object.entries(commitToRevert.files)) {
      if (parentFiles[p] !== undefined) {
        newWorking[p] = parentFiles[p];
        newIndex[p] = parentFiles[p];
      } else {
        // Was added in commitToRevert -> delete it
        delete newWorking[p];
        delete newIndex[p];
      }
    }

    const revertMessage = `Revert "${commitToRevert.message}"`;
    const { hash, shortHash } = generateGitHash(revertMessage + JSON.stringify(newIndex));

    let headCommitHash = repo.head.type === 'branch' ? repo.branches[repo.head.ref]?.targetCommitHash : repo.head.ref;

    const newCommit: Commit = {
      hash,
      shortHash,
      parents: headCommitHash ? [headCommitHash] : [],
      tree: {},
      files: newIndex,
      author: repo.config['user.name'] || 'Developer',
      email: repo.config['user.email'] || 'developer@commitforge.dev',
      date: new Date().toISOString(),
      timestamp: Date.now(),
      message: revertMessage,
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
        fromHash: headCommitHash || '',
        toHash: hash,
        action: 'revert',
        message: `revert: ${revertMessage}`,
        timestamp: Date.now(),
      },
      ...repo.reflog,
    ];

    return {
      stdout: [
        `[${repo.head.type === 'branch' ? repo.head.ref : 'detached HEAD'} ${shortHash}] ${revertMessage}`,
        ` 1 file(s) changed, reverted`,
      ],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'LOW',
      stateChanged: true,
      repo: {
        ...repo,
        commits: newCommits,
        branches: newBranches,
        workingDirectory: newWorking,
        index: newIndex,
        reflog: newReflog,
      },
      whyExplanation: {
        summary: `Created a NEW commit ${shortHash} that reverses changes from ${commitToRevert.shortHash}.`,
        headMoved: `HEAD advanced forward to new commit ${shortHash}.`,
        indexState: 'Clean.',
        workingState: 'Clean.',
        historyState: `History is preserved! Nothing was erased. A forward-moving commit reversed the bad change.`,
      },
      comparisons: {
        title: 'git reset vs git revert',
        options: [
          {
            label: 'git revert <commit>',
            description: 'Safe for shared branches',
            effect: 'Adds a brand new commit that negates previous changes. Preserves linear history and teammates never encounter divergence.',
          },
          {
            label: 'git reset <commit>',
            description: 'Rewrites history',
            effect: 'Moves branch backwards and drops commits. Dangerous on shared/pushed branches!',
          },
        ],
      },
      educationalFeedback: `Created revert commit ${shortHash}. 'git revert' is the professional choice for undoing pushed commits safely!`,
    };
  }

  // git reflog
  if (sub === 'reflog') {
    if (repo.reflog.length === 0) {
      return {
        stdout: ['(reflog is empty)'],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    const lines: string[] = [];
    repo.reflog.forEach((entry, idx) => {
      const short = entry.toHash.slice(0, 7) || '0000000';
      lines.push(`${short} HEAD@{${idx}}: ${entry.action}: ${entry.message}`);
    });

    return {
      stdout: lines,
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: false,
      repo,
      educationalFeedback: `Reflog (Reference Log) records every change to HEAD. Even if you reset --hard, you can find your lost commit here!`,
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
