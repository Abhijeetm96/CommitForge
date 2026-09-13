import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Terminal,
  X,
  BookOpen,
  ArrowUpRight,
} from 'lucide-react';

export interface CurriculumCommand {
  name: string;
  desc: string;
  syntax: string;
  level: number;
  risk?: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface CurriculumLevel {
  levelNumber: number;
  title: string;
  subtitle: string;
  isCurrent?: boolean;
  commands: CurriculumCommand[];
}

export const CURRICULUM_LEVELS: CurriculumLevel[] = [
  {
    levelNumber: 0,
    title: 'LEVEL 0 — Computer & Git Fundamentals',
    subtitle: 'Terminal, files, paths & mental models',
    commands: [
      { name: 'pwd', desc: 'Print working directory path', syntax: 'pwd', level: 0, risk: 'SAFE' },
      { name: 'ls', desc: 'List files and folders', syntax: 'ls -la', level: 0, risk: 'SAFE' },
      { name: 'cd', desc: 'Change current directory', syntax: 'cd <dir>', level: 0, risk: 'SAFE' },
      { name: 'mkdir', desc: 'Create a new directory', syntax: 'mkdir <name>', level: 0, risk: 'SAFE' },
      { name: 'touch', desc: 'Create an empty file', syntax: 'touch <file>', level: 0, risk: 'SAFE' },
      { name: 'cat', desc: 'Display file contents', syntax: 'cat <file>', level: 0, risk: 'SAFE' },
      { name: 'rm', desc: 'Remove file from disk', syntax: 'rm <file>', level: 0, risk: 'MEDIUM' },
    ],
  },
  {
    levelNumber: 1,
    title: 'LEVEL 1 — Save My Work',
    subtitle: 'The foundational Git save loop',
    isCurrent: true,
    commands: [
      { name: 'git init', desc: 'Initialize local Git repository', syntax: 'git init', level: 1, risk: 'SAFE' },
      { name: 'git status', desc: 'Inspect desk & staging box', syntax: 'git status [-s]', level: 1, risk: 'SAFE' },
      { name: 'git diff', desc: 'Compare unstaged file changes', syntax: 'git diff', level: 1, risk: 'SAFE' },
      { name: 'git add', desc: 'Stage changes into packing box', syntax: 'git add <file>', level: 1, risk: 'SAFE' },
      { name: 'git commit', desc: 'Seal snapshot into history vault', syntax: 'git commit -m "msg"', level: 1, risk: 'SAFE' },
      { name: 'git log', desc: 'View commit history timeline', syntax: 'git log --oneline', level: 1, risk: 'SAFE' },
    ],
  },
  {
    levelNumber: 2,
    title: 'LEVEL 2 — Undo & Recover',
    subtitle: 'Restoring files & unwrapping commits',
    commands: [
      { name: 'git restore', desc: 'Discard working changes', syntax: 'git restore <file>', level: 2, risk: 'LOW' },
      { name: 'git restore --staged', desc: 'Unstage file from packing box', syntax: 'git restore --staged <file>', level: 2, risk: 'SAFE' },
      { name: 'git reset', desc: 'Rewind HEAD / unstage commits', syntax: 'git reset [--soft|--hard]', level: 2, risk: 'MEDIUM' },
      { name: 'git revert', desc: 'Create safe undo commit', syntax: 'git revert <commit>', level: 2, risk: 'SAFE' },
      { name: 'git clean', desc: 'Remove untracked files', syntax: 'git clean -fd', level: 2, risk: 'HIGH' },
      { name: 'git reflog', desc: 'Safety net of all HEAD moves', syntax: 'git reflog', level: 2, risk: 'SAFE' },
    ],
  },
  {
    levelNumber: 3,
    title: 'LEVEL 3 — Branches',
    subtitle: 'Parallel universes & switching',
    commands: [
      { name: 'git branch', desc: 'List, create, or delete branches', syntax: 'git branch [-a|-d]', level: 3, risk: 'SAFE' },
      { name: 'git switch', desc: 'Switch or create branch', syntax: 'git switch [-c] <branch>', level: 3, risk: 'SAFE' },
      { name: 'git checkout', desc: 'Legacy context switch', syntax: 'git checkout <branch>', level: 3, risk: 'LOW' },
      { name: 'git merge', desc: 'Combine branch histories', syntax: 'git merge <branch>', level: 3, risk: 'MEDIUM' },
      { name: 'git branch -d', desc: 'Safely delete merged branch', syntax: 'git branch -d <name>', level: 3, risk: 'LOW' },
    ],
  },
  {
    levelNumber: 4,
    title: 'LEVEL 4 — Remote Collaboration',
    subtitle: 'Cloning, fetching & pushing',
    commands: [
      { name: 'git remote', desc: 'Manage remote connections', syntax: 'git remote -v', level: 4, risk: 'SAFE' },
      { name: 'git fetch', desc: 'Download remote updates safely', syntax: 'git fetch origin', level: 4, risk: 'SAFE' },
      { name: 'git pull', desc: 'Fetch + merge remote branch', syntax: 'git pull origin <b-name>', level: 4, risk: 'MEDIUM' },
      { name: 'git push', desc: 'Upload commits to remote', syntax: 'git push -u origin <b-name>', level: 4, risk: 'MEDIUM' },
      { name: 'git clone', desc: 'Copy entire remote repository', syntax: 'git clone <url>', level: 4, risk: 'SAFE' },
    ],
  },
  {
    levelNumber: 5,
    title: 'LEVEL 5 — Conflicts',
    subtitle: 'Resolving conflicting histories',
    commands: [
      { name: 'merge conflicts', desc: 'Read conflict markers (<<<< / >>>>)', syntax: 'git diff', level: 5, risk: 'LOW' },
      { name: 'git add (resolved)', desc: 'Mark conflict resolved', syntax: 'git add <file>', level: 5, risk: 'SAFE' },
      { name: 'git merge --continue', desc: 'Finalize resolved merge', syntax: 'git merge --continue', level: 5, risk: 'SAFE' },
      { name: 'git merge --abort', desc: 'Cancel merge & return to start', syntax: 'git merge --abort', level: 5, risk: 'SAFE' },
    ],
  },
  {
    levelNumber: 6,
    title: 'LEVEL 6 — Stashing & Partial Work',
    subtitle: 'Shelving uncommitted work & patch staging',
    commands: [
      { name: 'git stash', desc: 'Temporarily shelve dirty changes', syntax: 'git stash push -m "msg"', level: 6, risk: 'SAFE' },
      { name: 'git stash pop', desc: 'Reapply stash and drop from shelf', syntax: 'git stash pop', level: 6, risk: 'LOW' },
      { name: 'git stash list', desc: 'View all shelved stashes', syntax: 'git stash list', level: 6, risk: 'SAFE' },
      { name: 'git add -p', desc: 'Stage hunks interactively', syntax: 'git add -p', level: 6, risk: 'SAFE' },
    ],
  },
  {
    levelNumber: 7,
    title: 'LEVEL 7 — History Engineering',
    subtitle: 'Rebase, cherry-pick & amend',
    commands: [
      { name: 'git rebase', desc: 'Replay commits onto new base', syntax: 'git rebase <base>', level: 7, risk: 'HIGH' },
      { name: 'git rebase -i', desc: 'Interactive rebase (squash/edit)', syntax: 'git rebase -i HEAD~3', level: 7, risk: 'HIGH' },
      { name: 'git cherry-pick', desc: 'Apply commit to active branch', syntax: 'git cherry-pick <hash>', level: 7, risk: 'MEDIUM' },
      { name: 'git commit --amend', desc: 'Modify most recent commit', syntax: 'git commit --amend', level: 7, risk: 'LOW' },
    ],
  },
  {
    levelNumber: 8,
    title: 'LEVEL 8 — Investigation',
    subtitle: 'Blame, bisect & deep log forensics',
    commands: [
      { name: 'git blame', desc: 'Line-by-line author attribution', syntax: 'git blame <file>', level: 8, risk: 'SAFE' },
      { name: 'git log -S', desc: 'Pickaxe code search in history', syntax: 'git log -S"string"', level: 8, risk: 'SAFE' },
      { name: 'git log -G', desc: 'Regex search across commit diffs', syntax: 'git log -G"regex"', level: 8, risk: 'SAFE' },
      { name: 'git bisect', desc: 'Binary search to find bug commit', syntax: 'git bisect start/bad/good', level: 8, risk: 'SAFE' },
    ],
  },
  {
    levelNumber: 9,
    title: 'LEVEL 9 — Professional Git',
    subtitle: 'Tags, .gitignore, worktrees & submodules',
    commands: [
      { name: 'git tag', desc: 'Create and list release tags', syntax: 'git tag -a v1.0 -m "msg"', level: 9, risk: 'SAFE' },
      { name: 'git check-ignore', desc: 'Debug .gitignore exclusion rules', syntax: 'git check-ignore -v <file>', level: 9, risk: 'SAFE' },
      { name: 'git worktree', desc: 'Multiple working trees on branches', syntax: 'git worktree add <dir> <b-name>', level: 9, risk: 'MEDIUM' },
      { name: 'git submodule', desc: 'Manage nested repositories', syntax: 'git submodule update --init', level: 9, risk: 'MEDIUM' },
      { name: 'git lfs', desc: 'Large file tracking extension', syntax: 'git lfs track "*.psd"', level: 9, risk: 'LOW' },
    ],
  },
  {
    levelNumber: 10,
    title: 'LEVEL 10 — Git Internals',
    subtitle: 'Blobs, trees, commits & object hash math',
    commands: [
      { name: 'git cat-file', desc: 'Inspect raw Git objects (-p -t)', syntax: 'git cat-file -p HEAD', level: 10, risk: 'SAFE' },
      { name: 'git hash-object', desc: 'Compute SHA-1 hash for file', syntax: 'git hash-object -w <file>', level: 10, risk: 'SAFE' },
      { name: 'git ls-tree', desc: 'Inspect tree object records', syntax: 'git ls-tree HEAD', level: 10, risk: 'SAFE' },
      { name: 'git rev-parse', desc: 'Resolve ref expressions to SHAs', syntax: 'git rev-parse HEAD~1', level: 10, risk: 'SAFE' },
      { name: 'git count-objects', desc: 'Count loose objects & disk use', syntax: 'git count-objects -v', level: 10, risk: 'SAFE' },
      { name: 'git fsck', desc: 'Check object database integrity', syntax: 'git fsck', level: 10, risk: 'SAFE' },
    ],
  },
  {
    levelNumber: 11,
    title: 'LEVEL 11+ — Expert Git & Plumbing',
    subtitle: 'Low-level plumbing, gc & maintenance',
    commands: [
      { name: 'git write-tree', desc: 'Create tree object from index', syntax: 'git write-tree', level: 11, risk: 'LOW' },
      { name: 'git commit-tree', desc: 'Create commit directly from tree', syntax: 'git commit-tree <tree> -m "msg"', level: 11, risk: 'MEDIUM' },
      { name: 'git update-ref', desc: 'Update branch reference directly', syntax: 'git update-ref refs/heads/main <sha>', level: 11, risk: 'HIGH' },
      { name: 'git gc', desc: 'Compress objects & cleanup repo', syntax: 'git gc [--prune]', level: 11, risk: 'MEDIUM' },
      { name: 'git prune', desc: 'Prune unreachable loose objects', syntax: 'git prune', level: 11, risk: 'HIGH' },
      { name: 'git maintenance', desc: 'Run optimization background jobs', syntax: 'git maintenance run', level: 11, risk: 'SAFE' },
    ],
  },
];

interface CommandSidebarProps {
  currentCommand?: string;
  onInsertCommand?: (cmdText: string) => void;
}

export const CommandSidebar: React.FC<CommandSidebarProps> = ({
  currentCommand,
  onInsertCommand,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openLevels, setOpenLevels] = useState<Record<number, boolean>>({ 1: true });
  const [selectedCommand, setSelectedCommand] = useState<CurriculumCommand | null>(null);

  const toggleLevel = (lvl: number) => {
    setOpenLevels(prev => ({
      ...prev,
      [lvl]: !prev[lvl],
    }));
  };

  const filteredLevels = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return CURRICULUM_LEVELS;

    return CURRICULUM_LEVELS.map(lvl => {
      const matching = lvl.commands.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.desc.toLowerCase().includes(q) ||
          c.syntax.toLowerCase().includes(q)
      );
      return {
        ...lvl,
        commands: matching,
      };
    }).filter(lvl => lvl.commands.length > 0);
  }, [searchQuery]);

  const totalCommandsCount = useMemo(() => {
    return CURRICULUM_LEVELS.reduce((acc, lvl) => acc + lvl.commands.length, 0);
  }, []);

  return (
    <aside
      style={{
        width: '260px',
        minWidth: '260px',
        maxWidth: '260px',
        background: '#070b14',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* SIDEBAR TITLE & SEARCH */}
      <div
        style={{
          padding: '0.85rem 0.9rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          background: 'rgba(10, 15, 28, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <BookOpen size={14} color="#38bdf8" />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Git Curriculum
            </span>
          </div>
          <span
            style={{
              fontSize: '0.65rem',
              color: '#38bdf8',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              padding: '0.1rem 0.4rem',
              borderRadius: '999px',
              fontWeight: 700,
            }}
          >
            {totalCommandsCount} cmds
          </span>
        </div>

        {/* SEARCH BAR */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            padding: '0.35rem 0.55rem',
          }}
        >
          <Search size={13} color="#64748b" />
          <input
            type="text"
            placeholder="Filter all commands..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#f8fafc',
              fontSize: '0.75rem',
              width: '100%',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* CURRICULUM LEVELS ACCORDION LIST */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0.45rem 0.4rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
        }}
      >
        {filteredLevels.map(lvl => {
          const isOpen = searchQuery.trim().length > 0 || openLevels[lvl.levelNumber];
          const hasActiveInLevel = lvl.commands.some(
            c => currentCommand && currentCommand.toLowerCase().startsWith(c.name.toLowerCase())
          );

          return (
            <div
              key={lvl.levelNumber}
              style={{
                borderRadius: '6px',
                background: hasActiveInLevel
                  ? 'rgba(56, 189, 248, 0.04)'
                  : 'rgba(255, 255, 255, 0.02)',
                border: hasActiveInLevel
                  ? '1px solid rgba(56, 189, 248, 0.25)'
                  : '1px solid rgba(255, 255, 255, 0.04)',
                overflow: 'hidden',
              }}
            >
              {/* LEVEL HEADER BUTTON */}
              <button
                onClick={() => toggleLevel(lvl.levelNumber)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.6rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', overflow: 'hidden' }}>
                  {isOpen ? <ChevronDown size={13} color="#94a3b8" /> : <ChevronRight size={13} color="#64748b" />}
                  <div style={{ overflow: 'hidden' }}>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: hasActiveInLevel ? '#38bdf8' : '#e2e8f0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {lvl.title}
                    </div>
                  </div>
                </div>

                {lvl.isCurrent && (
                  <span
                    style={{
                      fontSize: '0.58rem',
                      fontWeight: 800,
                      background: '#0284c7',
                      color: 'white',
                      padding: '0.1rem 0.35rem',
                      borderRadius: '3px',
                      textTransform: 'uppercase',
                      flexShrink: 0,
                    }}
                  >
                    Active
                  </span>
                )}
              </button>

              {/* LEVEL COMMANDS */}
              {isOpen && (
                <div
                  style={{
                    padding: '0.15rem 0.35rem 0.45rem 0.35rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                  }}
                >
                  {lvl.commands.map(cmd => {
                    const isTaskCommand =
                      currentCommand && currentCommand.toLowerCase().startsWith(cmd.name.toLowerCase());
                    const isInspected = selectedCommand?.name === cmd.name;

                    return (
                      <div
                        key={cmd.name}
                        onClick={() => setSelectedCommand(cmd)}
                        style={{
                          padding: '0.35rem 0.45rem',
                          borderRadius: '4px',
                          background: isInspected
                            ? 'rgba(56, 189, 248, 0.16)'
                            : isTaskCommand
                            ? 'rgba(56, 189, 248, 0.08)'
                            : 'transparent',
                          border: isInspected
                            ? '1px solid #38bdf8'
                            : isTaskCommand
                            ? '1px dashed rgba(56, 189, 248, 0.4)'
                            : '1px solid transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.4rem',
                          transition: 'all 0.12s ease',
                        }}
                      >
                        <div style={{ overflow: 'hidden', flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <code
                              style={{
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                color: isTaskCommand ? '#38bdf8' : '#f8fafc',
                                fontFamily: 'monospace',
                              }}
                            >
                              {cmd.name}
                            </code>
                            {isTaskCommand && (
                              <span
                                style={{
                                  fontSize: '0.55rem',
                                  color: '#38bdf8',
                                  fontWeight: 800,
                                  textTransform: 'uppercase',
                                }}
                              >
                                • task
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              fontSize: '0.66rem',
                              color: '#94a3b8',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {cmd.desc}
                          </div>
                        </div>

                        {onInsertCommand && (
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onInsertCommand(cmd.syntax);
                            }}
                            title={`Insert "${cmd.syntax}" into terminal`}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#64748b',
                              cursor: 'pointer',
                              padding: '0.2rem',
                              display: 'flex',
                              alignItems: 'center',
                              borderRadius: '3px',
                            }}
                          >
                            <Terminal size={12} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* COMPACT COMMAND INSPECTOR POPUP CARD AT BOTTOM */}
      {selectedCommand && (
        <div
          style={{
            borderTop: '1px solid rgba(56, 189, 248, 0.3)',
            background: 'rgba(10, 16, 32, 0.98)',
            padding: '0.65rem 0.8rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <code style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8' }}>
                {selectedCommand.name}
              </code>
              <span
                style={{
                  fontSize: '0.58rem',
                  padding: '0.05rem 0.3rem',
                  borderRadius: '3px',
                  fontWeight: 700,
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: selectedCommand.risk === 'SAFE' ? '#4ade80' : selectedCommand.risk === 'HIGH' ? '#ef4444' : '#f59e0b',
                }}
              >
                {selectedCommand.risk || 'SAFE'}
              </span>
            </div>
            <button
              onClick={() => setSelectedCommand(null)}
              style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
            >
              <X size={13} />
            </button>
          </div>

          <div style={{ fontSize: '0.68rem', color: '#cbd5e1', lineHeight: 1.3 }}>
            {selectedCommand.desc}
          </div>

          <div
            style={{
              background: '#040711',
              padding: '0.25rem 0.45rem',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '0.7rem',
              color: '#38bdf8',
            }}
          >
            {selectedCommand.syntax}
          </div>

          {onInsertCommand && (
            <button
              onClick={() => onInsertCommand(selectedCommand.syntax)}
              style={{
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#38bdf8',
                borderRadius: '4px',
                padding: '0.25rem 0.5rem',
                fontSize: '0.68rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
                marginTop: '0.1rem',
              }}
            >
              <Terminal size={11} />
              <span>Insert in Terminal</span>
            </button>
          )}
        </div>
      )}
    </aside>
  );
};
