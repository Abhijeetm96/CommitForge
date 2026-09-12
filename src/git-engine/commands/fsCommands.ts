import { GitRepo, CommandResult } from '../types';
import { ParsedCommand } from '../parser';

export function executeFsCommand(cmd: ParsedCommand, repo: GitRepo): CommandResult {
  const base = cmd.baseCommand;

  switch (base) {
    case 'pwd': {
      return {
        stdout: [repo.currentDir || '/home/developer/project'],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    case 'ls':
    case 'dir': {
      const showAll = cmd.flags['a'] || cmd.flags['all'];
      const fileNames = Object.keys(repo.workingDirectory);
      
      // Filter by directory prefix if any
      const currentDirPrefix = repo.currentDir && repo.currentDir !== '/' && repo.currentDir !== '/home/developer/project'
        ? repo.currentDir.replace(/^\//, '') + '/'
        : '';

      const visible = new Set<string>();
      for (const p of fileNames) {
        if (currentDirPrefix && !p.startsWith(currentDirPrefix)) continue;
        const relative = p.slice(currentDirPrefix.length);
        const parts = relative.split('/');
        visible.add(parts[0]);
      }

      if (showAll && repo.initialized) {
        visible.add('.git');
      }

      const list = Array.from(visible).sort();
      return {
        stdout: list.length > 0 ? [list.join('  ')] : ['(empty directory)'],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    case 'cd': {
      const target = cmd.args[0];
      if (!target || target === '~' || target === '/') {
        return {
          stdout: [],
          stderr: [],
          exitCode: 0,
          dangerLevel: 'SAFE',
          stateChanged: true,
          repo: { ...repo, currentDir: '/home/developer/project' },
        };
      }

      if (target === '..') {
        const parts = repo.currentDir.split('/').filter(Boolean);
        parts.pop();
        return {
          stdout: [],
          stderr: [],
          exitCode: 0,
          dangerLevel: 'SAFE',
          stateChanged: true,
          repo: { ...repo, currentDir: '/' + parts.join('/') },
        };
      }

      return {
        stdout: [],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: true,
        repo: { ...repo, currentDir: `${repo.currentDir}/${target}`.replace(/\/+/g, '/') },
      };
    }

    case 'mkdir': {
      const dirName = cmd.args[0];
      if (!dirName) {
        return {
          stdout: [],
          stderr: ['mkdir: missing operand'],
          exitCode: 1,
          dangerLevel: 'SAFE',
          stateChanged: false,
          repo,
        };
      }
      return {
        stdout: [],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
        educationalFeedback: `Created directory: ${dirName}/`,
      };
    }

    case 'touch': {
      const fileName = cmd.args[0];
      if (!fileName) {
        return {
          stdout: [],
          stderr: ['touch: missing file operand'],
          exitCode: 1,
          dangerLevel: 'SAFE',
          stateChanged: false,
          repo,
        };
      }

      const newWorking = { ...repo.workingDirectory };
      if (newWorking[fileName] === undefined) {
        newWorking[fileName] = '';
      }

      return {
        stdout: [],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: true,
        repo: { ...repo, workingDirectory: newWorking },
        educationalFeedback: `Created empty file: ${fileName}`,
      };
    }

    case 'cat': {
      const fileName = cmd.args[0];
      if (!fileName) {
        return {
          stdout: [],
          stderr: ['cat: missing file operand'],
          exitCode: 1,
          dangerLevel: 'SAFE',
          stateChanged: false,
          repo,
        };
      }

      const content = repo.workingDirectory[fileName];
      if (content === undefined) {
        return {
          stdout: [],
          stderr: [`cat: ${fileName}: No such file or directory`],
          exitCode: 1,
          dangerLevel: 'SAFE',
          stateChanged: false,
          repo,
        };
      }

      return {
        stdout: content ? content.split('\n') : [''],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    case 'rm': {
      const fileName = cmd.args[0];
      if (!fileName) {
        return {
          stdout: [],
          stderr: ['rm: missing operand'],
          exitCode: 1,
          dangerLevel: 'MEDIUM',
          stateChanged: false,
          repo,
        };
      }

      if (repo.workingDirectory[fileName] === undefined) {
        return {
          stdout: [],
          stderr: [`rm: cannot remove '${fileName}': No such file or directory`],
          exitCode: 1,
          dangerLevel: 'MEDIUM',
          stateChanged: false,
          repo,
        };
      }

      const newWorking = { ...repo.workingDirectory };
      delete newWorking[fileName];

      return {
        stdout: [],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'MEDIUM',
        stateChanged: true,
        repo: { ...repo, workingDirectory: newWorking },
        educationalFeedback: `Removed '${fileName}' from working directory. (Git index still tracks it until staged!)`,
      };
    }

    case 'echo': {
      // Check if echo has redirection: echo "content" > file
      const raw = cmd.raw;
      const redirectMatch = raw.match(/echo\s+["']?([^"'>]*)["']?\s*(>>|>)\s*([^\s]+)/);
      if (redirectMatch) {
        const text = redirectMatch[1];
        const isAppend = redirectMatch[2] === '>>';
        const targetFile = redirectMatch[3];

        const newWorking = { ...repo.workingDirectory };
        const existing = newWorking[targetFile] || '';
        newWorking[targetFile] = isAppend ? (existing ? `${existing}\n${text}` : text) : text;

        return {
          stdout: [],
          stderr: [],
          exitCode: 0,
          dangerLevel: 'LOW',
          stateChanged: true,
          repo: { ...repo, workingDirectory: newWorking },
          educationalFeedback: `Wrote to ${targetFile}`,
        };
      }

      return {
        stdout: [cmd.args.join(' ')],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    case 'clear': {
      return {
        stdout: ['__CLEAR__'],
        stderr: [],
        exitCode: 0,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
    }

    default:
      return {
        stdout: [],
        stderr: [`commitforge: command not found: ${base}`],
        exitCode: 127,
        dangerLevel: 'SAFE',
        stateChanged: false,
        repo,
      };
  }
}
