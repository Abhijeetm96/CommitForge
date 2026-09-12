import { GitRepo, CommandResult, Commit } from '../types';
import { ParsedCommand } from '../parser';
import { generateGitHash } from '../hash';

export function executePlumbing(cmd: ParsedCommand, repo: GitRepo): CommandResult {
  const sub = cmd.subCommand;

  if (sub === 'hash-object') {
    const isWrite = cmd.flags['w'] || cmd.flags['write'];
    const targetFile = cmd.args[0];

    if (!targetFile) {
      return {
        stdout: [],
        stderr: ['fatal: no file specified for hash-object'],
        exitCode: 1,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    const content = repo.workingDirectory[targetFile] || '';
    const { hash } = generateGitHash(`blob ${content.length}\0${content}`);

    return {
      stdout: [hash],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: false,
      repo,
      educationalFeedback: `Computed SHA-1 hash for '${targetFile}': ${hash}\n${isWrite ? `Object written into .git/objects/${hash.substring(0, 2)}/${hash.substring(2)}` : 'Object not written (dry-run without -w)'}`,
    };
  }

  if (sub === 'cat-file') {
    const isPretty = cmd.flags['p'];
    const isType = cmd.flags['t'];
    const isSize = cmd.flags['s'];
    const target = cmd.args[0];

    if (!target) {
      return {
        stdout: [],
        stderr: ['fatal: git cat-file (-p | -t | -s) <object>'],
        exitCode: 1,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    // Check if target is a commit
    let matchHash = '';
    for (const [hash, commit] of Object.entries(repo.commits)) {
      if (hash.startsWith(target) || commit.shortHash.startsWith(target)) {
        matchHash = hash;
        break;
      }
    }

    if (matchHash && repo.commits[matchHash]) {
      const c = repo.commits[matchHash];
      const treeHash = generateGitHash(`tree ${JSON.stringify(c.tree || {})}`).hash;
      if (isType) {
        return {
          stdout: ['commit'],
          stderr: [],
          exitCode: 0,
          dangerLevel: 'SAFE',
          stateChanged: false,
          repo,
        };
      }
      if (isSize) {
        const body = `tree ${treeHash}\nauthor ${c.author}\n\n${c.message}`;
        return {
          stdout: [`${body.length}`],
          stderr: [],
          exitCode: 0,
          dangerLevel: 'SAFE',
          stateChanged: false,
          repo,
        };
      }
      if (isPretty) {
        const lines = [
          `tree ${treeHash}`,
          ...c.parents.map(p => `parent ${p}`),
          `author ${c.author} <developer@commitforge.local> ${Math.floor(c.timestamp / 1000)} +0000`,
          `committer ${c.author} <developer@commitforge.local> ${Math.floor(c.timestamp / 1000)} +0000`,
          '',
          c.message,
        ];
        return {
          stdout: lines,
          stderr: [],
          exitCode: 0,
          dangerLevel: 'SAFE',
          stateChanged: false,
          repo,
        };
      }
    }

    // Check if target is an index file or working tree blob
    for (const [path, content] of Object.entries(repo.index)) {
      const { hash: blobHash } = generateGitHash(`blob ${content.length}\0${content}`);
      if (blobHash.startsWith(target)) {
        if (isType) return { stdout: ['blob'], stderr: [], exitCode: 0, dangerLevel: 'SAFE', stateChanged: false, repo };
        if (isSize) return { stdout: [`${content.length}`], stderr: [], exitCode: 0, dangerLevel: 'SAFE', stateChanged: false, repo };
        if (isPretty) return { stdout: content.split('\n'), stderr: [], exitCode: 0, dangerLevel: 'SAFE', stateChanged: false, repo };
      }
    }

    for (const [path, content] of Object.entries(repo.workingDirectory)) {
      const { hash: blobHash } = generateGitHash(`blob ${content.length}\0${content}`);
      if (blobHash.startsWith(target)) {
        if (isType) return { stdout: ['blob'], stderr: [], exitCode: 0, dangerLevel: 'SAFE', stateChanged: false, repo };
        if (isSize) return { stdout: [`${content.length}`], stderr: [], exitCode: 0, dangerLevel: 'SAFE', stateChanged: false, repo };
        if (isPretty) return { stdout: content.split('\n'), stderr: [], exitCode: 0, dangerLevel: 'SAFE', stateChanged: false, repo };
      }
    }

    return {
      stdout: [],
      stderr: [`fatal: git cat-file: could not get object info for '${target}'`],
      exitCode: 1,
      dangerLevel: 'SAFE',
      stateChanged: false,
      repo,
    };
  }

  if (sub === 'ls-files') {
    const isStage = cmd.flags['s'] || cmd.flags['stage'];
    const lines: string[] = [];

    for (const [file, content] of Object.entries(repo.index)) {
      const { hash } = generateGitHash(`blob ${content.length}\0${content}`);
      if (isStage) {
        lines.push(`100644 ${hash} 0\t${file}`);
      } else {
        lines.push(file);
      }
    }

    return {
      stdout: lines.length > 0 ? lines : ['(staging area is empty)'],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: false,
      repo,
    };
  }

  if (sub === 'ls-tree') {
    const target = cmd.args[0] || 'HEAD';
    const lines: string[] = [];

    for (const [file, content] of Object.entries(repo.index)) {
      const { hash } = generateGitHash(`blob ${content.length}\0${content}`);
      lines.push(`100644 blob ${hash.substring(0, 7)}\t${file}`);
    }

    return {
      stdout: lines.length > 0 ? lines : ['(empty tree)'],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: false,
      repo,
    };
  }

  if (sub === 'write-tree') {
    const serializedIndex = Object.entries(repo.index)
      .map(([f, c]) => `${f}:${c}`)
      .sort()
      .join('\n');
    const { hash: treeHash } = generateGitHash(`tree ${serializedIndex.length}\0${serializedIndex}`);

    return {
      stdout: [treeHash],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: false,
      repo,
      educationalFeedback: `Created tree object from index: ${treeHash}`,
    };
  }

  if (sub === 'commit-tree') {
    const tree = cmd.args[0];
    const msg = cmd.flags['m'] || 'Commit created via commit-tree';
    const parent = cmd.flags['p'] || (repo.head.type === 'branch' ? repo.branches[repo.head.ref]?.targetCommitHash : '');

    if (!tree) {
      return {
        stdout: [],
        stderr: ['fatal: commit-tree requires a tree hash'],
        exitCode: 1,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    const parents = parent ? [String(parent)] : [];
    const { hash, shortHash } = generateGitHash(`commit ${tree} ${Date.now()}`);

    const newCommit: Commit = {
      hash,
      shortHash,
      parents,
      tree: { ...repo.index },
      files: { ...repo.index },
      author: 'You',
      email: 'developer@commitforge.local',
      date: new Date().toISOString(),
      timestamp: Date.now(),
      message: String(msg),
    };

    const nextRepo: GitRepo = {
      ...repo,
      commits: {
        ...repo.commits,
        [hash]: newCommit,
      },
    };

    return {
      stdout: [hash],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: true,
      repo: nextRepo,
      educationalFeedback: `Commit object created: ${shortHash} with tree ${tree.substring(0, 7)}`,
    };
  }

  if (sub === 'rev-parse') {
    const isShort = cmd.flags['short'];
    const target = cmd.args[0] || 'HEAD';

    let resolvedHash = '';
    if (target === 'HEAD') {
      if (repo.head.type === 'branch') {
        resolvedHash = repo.branches[repo.head.ref]?.targetCommitHash || '';
      } else {
        resolvedHash = repo.head.ref || '';
      }
    } else if (repo.branches[target]) {
      resolvedHash = repo.branches[target].targetCommitHash;
    } else if (target === 'HEAD~1' || target === 'HEAD^') {
      const curr = repo.head.type === 'branch' ? repo.branches[repo.head.ref]?.targetCommitHash : repo.head.ref;
      if (curr && repo.commits[curr]?.parents[0]) {
        resolvedHash = repo.commits[curr].parents[0];
      }
    } else if (repo.commits[target]) {
      resolvedHash = target;
    }

    if (!resolvedHash) {
      return {
        stdout: [],
        stderr: [`fatal: ambiguous argument '${target}': unknown revision or path not in the working tree.`],
        exitCode: 1,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    return {
      stdout: [isShort ? resolvedHash.substring(0, 7) : resolvedHash],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: false,
      repo,
    };
  }

  if (sub === 'rev-list') {
    const isCount = cmd.flags['count'];
    const hashes = Object.keys(repo.commits);

    if (isCount) {
      return {
        stdout: [`${hashes.length}`],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    return {
      stdout: hashes,
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: false,
      repo,
    };
  }

  if (sub === 'update-ref') {
    const ref = cmd.args[0];
    const newSha = cmd.args[1];

    if (!ref || !newSha) {
      return {
        stdout: [],
        stderr: ['fatal: update-ref <ref> <new-sha>'],
        exitCode: 1,
        dangerLevel: 'HIGH',
        stateChanged: false,
        repo,
      };
    }

    // Branch update
    const branchName = ref.replace('refs/heads/', '');
    if (repo.branches[branchName]) {
      const nextRepo = {
        ...repo,
        branches: {
          ...repo.branches,
          [branchName]: {
            ...repo.branches[branchName],
            targetCommitHash: newSha,
          },
        },
      };
      return {
        stdout: [],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'HIGH',
        stateChanged: true,
        repo: nextRepo,
        educationalFeedback: `Updated ref ${ref} to point to ${newSha.substring(0, 7)}`,
      };
    }

    return {
      stdout: [],
      stderr: [`fatal: ref '${ref}' does not exist`],
      exitCode: 1,
      dangerLevel: 'HIGH',
      stateChanged: false,
      repo,
    };
  }

  if (sub === 'show-ref') {
    const lines: string[] = [];
    for (const [name, b] of Object.entries(repo.branches)) {
      lines.push(`${b.targetCommitHash} refs/heads/${name}`);
    }
    for (const [name, t] of Object.entries(repo.tags)) {
      lines.push(`${t.targetCommitHash} refs/tags/${name}`);
    }
    return {
      stdout: lines,
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: false,
      repo,
    };
  }

  if (sub === 'for-each-ref') {
    const lines: string[] = [];
    for (const [name, b] of Object.entries(repo.branches)) {
      lines.push(`${b.targetCommitHash} commit\trefs/heads/${name}`);
    }
    return {
      stdout: lines,
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: false,
      repo,
    };
  }

  if (sub === 'count-objects') {
    const looseCount = Object.keys(repo.commits).length * 2 + Object.keys(repo.index).length;
    const isVerbose = cmd.flags['v'] || cmd.flags['verbose'];

    if (isVerbose) {
      return {
        stdout: [
          `count: ${looseCount}`,
          `size: ${looseCount * 4}`,
          'in-pack: 0',
          'packs: 0',
          'size-pack: 0',
          'prune-packable: 0',
          'garbage: 0',
          'size-garbage: 0',
        ],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    return {
      stdout: [`${looseCount} objects, ${looseCount * 4} kilobytes`],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: false,
      repo,
    };
  }

  if (sub === 'fsck') {
    return {
      stdout: [
        'Checking object directories: 100% (256/256), done.',
        'Checking objects: 100% done.',
        'Repository integrity verified. Zero dangling commits found.',
      ],
      stderr: [],
      exitCode: 0,
      dangerLevel: 'SAFE',
      stateChanged: false,
      repo,
      educationalFeedback: 'Repository consistency check passed.',
    };
  }

  return {
    stdout: [],
    stderr: [`git: '${sub}' is not a recognized plumbing command.`],
    exitCode: 1,
    dangerLevel: 'SAFE',
    stateChanged: false,
    repo,
  };
}
