export interface ParsedCommand {
  raw: string;
  isGit: boolean;
  baseCommand: string; // 'git' or 'ls', 'cd', etc.
  subCommand: string; // for git: 'status', 'commit', 'add', etc.
  args: string[]; // positional arguments
  flags: Record<string, string | boolean>; // parsed flags e.g. { m: "commit message", hard: true, oneline: true }
}

export function tokenizeCommandLine(input: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let inDoubleQuote = false;
  let inSingleQuote = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
    } else if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
    } else if (/\s/.test(char) && !inDoubleQuote && !inSingleQuote) {
      if (current.length > 0) {
        tokens.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }

  if (current.length > 0) {
    tokens.push(current);
  }

  return tokens;
}

export function parseCommand(raw: string): ParsedCommand {
  const trimmed = raw.trim();
  const tokens = tokenizeCommandLine(trimmed);

  if (tokens.length === 0) {
    return {
      raw,
      isGit: false,
      baseCommand: '',
      subCommand: '',
      args: [],
      flags: {},
    };
  }

  const baseCommand = tokens[0].toLowerCase();
  const isGit = baseCommand === 'git';

  let subCommand = '';
  const args: string[] = [];
  const flags: Record<string, string | boolean> = {};

  let idx = 1;

  if (isGit && tokens.length > 1) {
    // Check if token[1] is a flag or subcommand (e.g. git --version)
    if (tokens[1].startsWith('-')) {
      subCommand = tokens[1];
      idx = 2;
    } else {
      subCommand = tokens[1].toLowerCase();
      idx = 2;
    }
  }

  while (idx < tokens.length) {
    const token = tokens[idx];

    if (token.startsWith('--')) {
      const flagName = token.slice(2);
      if (flagName.includes('=')) {
        const [k, v] = flagName.split('=');
        flags[k] = v;
      } else if (
        ['message', 'author', 'onto', 'strategy'].includes(flagName) &&
        idx + 1 < tokens.length &&
        !tokens[idx + 1].startsWith('-')
      ) {
        flags[flagName] = tokens[idx + 1];
        idx++;
      } else {
        flags[flagName] = true;
      }
    } else if (token.startsWith('-') && token.length > 1) {
      const flagName = token.slice(1);
      if (['m', 'c', 'b', 'd', 'D', 'n', 'S', 'G'].includes(flagName) && idx + 1 < tokens.length && !tokens[idx + 1].startsWith('-')) {
        flags[flagName] = tokens[idx + 1];
        idx++;
      } else if (flagName === 'am' && idx + 1 < tokens.length) {
        flags['a'] = true;
        flags['m'] = tokens[idx + 1];
        idx++;
      } else {
        // multiple short flags e.g. -fd or -a
        for (const char of flagName) {
          flags[char] = true;
        }
      }
    } else {
      args.push(token);
    }

    idx++;
  }

  return {
    raw,
    isGit,
    baseCommand,
    subCommand,
    args,
    flags,
  };
}
