import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Terminal,
  CheckCircle2,
  Lock,
  Sparkles,
  MapPin,
  X,
  Compass,
} from 'lucide-react';

export interface RoadmapCommand {
  name: string;
  desc: string;
  syntax: string;
  purposeNote?: string;
  risk?: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface RoadmapMilestone {
  levelNumber: number;
  levelCode: string;
  title: string;
  tagline: string;
  badge?: string;
  status: 'completed' | 'active' | 'upcoming';
  commands: RoadmapCommand[];
}

export const ROADMAP_MILESTONES: RoadmapMilestone[] = [
  {
    levelNumber: 0,
    levelCode: '00',
    title: 'Computer & Git Foundations',
    tagline: 'Terminal navigation, files, paths & local vs cloud',
    status: 'completed',
    commands: [
      { name: 'pwd', desc: 'Print working directory path', syntax: 'pwd', risk: 'SAFE' },
      { name: 'ls', desc: 'List files and folders in active folder', syntax: 'ls -la', risk: 'SAFE' },
      { name: 'cd', desc: 'Change current working directory', syntax: 'cd <dir>', risk: 'SAFE' },
      { name: 'mkdir', desc: 'Create a new project folder', syntax: 'mkdir <folder>', risk: 'SAFE' },
      { name: 'touch', desc: 'Create a new file', syntax: 'touch <file>', risk: 'SAFE' },
      { name: 'rm', desc: 'Remove file from disk', syntax: 'rm <file>', risk: 'MEDIUM' },
    ],
  },
  {
    levelNumber: 1,
    levelCode: '01',
    title: 'Save My Work',
    tagline: 'The foundational save loop: inspect, stage & snapshot',
    badge: 'Current Chapter',
    status: 'active',
    commands: [
      { name: 'git init', desc: 'Turn current folder into a Git repository', syntax: 'git init', risk: 'SAFE' },
      { name: 'git status', desc: 'Check working tree desk & staging box', syntax: 'git status', risk: 'SAFE' },
      { name: 'git diff', desc: 'Inspect unstaged line-by-line changes', syntax: 'git diff', risk: 'SAFE' },
      { name: 'git add', desc: 'Pack changes into the staging area', syntax: 'git add <file>', risk: 'SAFE' },
      { name: 'git commit', desc: 'Seal staged files into a permanent snapshot', syntax: 'git commit -m "msg"', risk: 'SAFE' },
      { name: 'git log', desc: 'View commit timeline & history graph', syntax: 'git log --oneline', risk: 'SAFE' },
    ],
  },
  {
    levelNumber: 2,
    levelCode: '02',
    title: 'Undo & Recover',
    tagline: 'Discard mistakes, unstage files & rescue lost commits',
    status: 'upcoming',
    commands: [
      { name: 'git restore', desc: 'Discard uncommitted working tree changes', syntax: 'git restore <file>', risk: 'LOW' },
      { name: 'git restore --staged', desc: 'Take accidentally staged files out of box', syntax: 'git restore --staged <file>', risk: 'SAFE' },
      { name: 'git reset', desc: 'Rewind HEAD pointer or uncommit files', syntax: 'git reset [--soft|--hard] HEAD~1', risk: 'MEDIUM' },
      { name: 'git revert', desc: 'Create a safe forward-moving undo commit', syntax: 'git revert <commit>', risk: 'SAFE' },
      { name: 'git clean', desc: 'Delete untracked files from disk', syntax: 'git clean -fd', risk: 'HIGH' },
      { name: 'git reflog', desc: 'Emergency log of every commit HEAD ever visited', syntax: 'git reflog', risk: 'SAFE' },
    ],
  },
  {
    levelNumber: 3,
    levelCode: '03',
    title: 'Branch Management',
    tagline: 'Parallel development lines, switching & fast-forward merges',
    status: 'upcoming',
    commands: [
      { name: 'git branch', desc: 'List, create or safely delete branches', syntax: 'git branch [-a|-d]', risk: 'SAFE' },
      { name: 'git switch', desc: 'Modern dedicated branch context switcher', syntax: 'git switch [-c] <branch>', risk: 'SAFE' },
      { name: 'git checkout', desc: 'Legacy multi-purpose branch and file switch', syntax: 'git checkout <branch>', risk: 'LOW' },
      { name: 'git merge', desc: 'Combine branch history into current branch', syntax: 'git merge <branch>', risk: 'MEDIUM' },
    ],
  },
  {
    levelNumber: 4,
    levelCode: '04',
    title: 'Remote Collaboration',
    tagline: 'Cloning, remote-tracking branches, pushing & pulling',
    status: 'upcoming',
    commands: [
      { name: 'git remote', desc: 'Manage connections to remote repositories', syntax: 'git remote -v', risk: 'SAFE' },
      { name: 'git clone', desc: 'Copy an entire remote repository locally', syntax: 'git clone <url>', risk: 'SAFE' },
      { name: 'git fetch', desc: 'Download remote updates without modifying code', syntax: 'git fetch origin', risk: 'SAFE' },
      { name: 'git pull', desc: 'Download remote commits and merge into branch', syntax: 'git pull origin <branch>', risk: 'MEDIUM' },
      { name: 'git push', desc: 'Upload local commits to remote repository', syntax: 'git push -u origin <branch>', risk: 'MEDIUM' },
    ],
  },
  {
    levelNumber: 5,
    levelCode: '05',
    title: 'Conflict Arena',
    tagline: 'Resolving merge collisions & understanding conflict markers',
    status: 'upcoming',
    commands: [
      { name: 'git diff', desc: 'Locate conflict markers (<<<< / ==== / >>>>)', syntax: 'git diff', risk: 'SAFE' },
      { name: 'git add', desc: 'Stage resolved conflict file', syntax: 'git add <resolved-file>', risk: 'SAFE' },
      { name: 'git merge --continue', desc: 'Complete merge once conflicts are resolved', syntax: 'git merge --continue', risk: 'SAFE' },
      { name: 'git merge --abort', desc: 'Safely cancel conflicted merge and reset', syntax: 'git merge --abort', risk: 'SAFE' },
    ],
  },
  {
    levelNumber: 6,
    levelCode: '06',
    title: 'Stashing & Partial Work',
    tagline: 'Temporary drawers and hunk-by-hunk selective staging',
    status: 'upcoming',
    commands: [
      { name: 'git stash', desc: 'Temporarily shelve dirty workspace changes', syntax: 'git stash push -m "wip"', risk: 'SAFE' },
      { name: 'git stash pop', desc: 'Reapply shelved changes and delete from stash', syntax: 'git stash pop', risk: 'LOW' },
      { name: 'git stash list', desc: 'View all saved stash shelves', syntax: 'git stash list', risk: 'SAFE' },
      { name: 'git add -p', desc: 'Interactively review and stage individual hunks', syntax: 'git add -p', risk: 'SAFE' },
    ],
  },
  {
    levelNumber: 7,
    levelCode: '07',
    title: 'History Engineering',
    tagline: 'Interactive rebasing, squash, cherry-pick & amend',
    status: 'upcoming',
    commands: [
      { name: 'git rebase', desc: 'Replay branch commits on top of another base', syntax: 'git rebase <base>', risk: 'HIGH' },
      { name: 'git rebase -i', desc: 'Interactive rebase (squash, reword, fixup)', syntax: 'git rebase -i HEAD~3', risk: 'HIGH' },
      { name: 'git cherry-pick', desc: 'Apply a specific commit to current branch', syntax: 'git cherry-pick <sha>', risk: 'MEDIUM' },
      { name: 'git commit --amend', desc: 'Modify most recent commit message or files', syntax: 'git commit --amend', risk: 'LOW' },
    ],
  },
  {
    levelNumber: 8,
    levelCode: '08',
    title: 'Forensics & Investigation',
    tagline: 'Line attribution, pickaxe commit search & bisect',
    status: 'upcoming',
    commands: [
      { name: 'git blame', desc: 'Show who changed each line of code and when', syntax: 'git blame <file>', risk: 'SAFE' },
      { name: 'git log -S', desc: 'Pickaxe search: find commits introducing a string', syntax: 'git log -S"secret"', risk: 'SAFE' },
      { name: 'git log -G', desc: 'Regex search across commit patches', syntax: 'git log -G"pattern"', risk: 'SAFE' },
      { name: 'git bisect', desc: 'Binary search to pinpoint bug-causing commit', syntax: 'git bisect start', risk: 'SAFE' },
    ],
  },
  {
    levelNumber: 9,
    levelCode: '09',
    title: 'Professional Git',
    tagline: 'Tags, .gitignore rules, worktrees, submodules & LFS',
    status: 'upcoming',
    commands: [
      { name: 'git tag', desc: 'Create annotated release version tag', syntax: 'git tag -a v1.0.0 -m "Release"', risk: 'SAFE' },
      { name: 'git check-ignore', desc: 'Debug and test .gitignore pattern matching', syntax: 'git check-ignore -v <file>', risk: 'SAFE' },
      { name: 'git worktree', desc: 'Check out multiple branches in parallel folders', syntax: 'git worktree add <path> <branch>', risk: 'MEDIUM' },
      { name: 'git submodule', desc: 'Manage external Git repositories inside project', syntax: 'git submodule update --init', risk: 'MEDIUM' },
      { name: 'git lfs', desc: 'Large file tracking and management', syntax: 'git lfs track "*.zip"', risk: 'LOW' },
    ],
  },
  {
    levelNumber: 10,
    levelCode: '10',
    title: 'Git Internals & Objects',
    tagline: 'Blobs, trees, commit objects, SHA-1 math & repo integrity',
    status: 'upcoming',
    commands: [
      { name: 'git cat-file', desc: 'Inspect raw object content and type (-p -t)', syntax: 'git cat-file -p HEAD', risk: 'SAFE' },
      { name: 'git hash-object', desc: 'Compute SHA-1 hash for raw content', syntax: 'git hash-object -w <file>', risk: 'SAFE' },
      { name: 'git ls-tree', desc: 'Inspect directory tree hierarchy objects', syntax: 'git ls-tree HEAD', risk: 'SAFE' },
      { name: 'git rev-parse', desc: 'Resolve branch and ref names to commit hashes', syntax: 'git rev-parse HEAD', risk: 'SAFE' },
      { name: 'git fsck', desc: 'Verify database integrity and find lost objects', syntax: 'git fsck', risk: 'SAFE' },
      { name: 'git count-objects', desc: 'Count loose objects and disk space consumption', syntax: 'git count-objects -v', risk: 'SAFE' },
    ],
  },
  {
    levelNumber: 11,
    levelCode: '11',
    title: 'Plumbing & Repository Maintenance',
    tagline: 'Low-level plumbing, garbage collection & maintenance tasks',
    status: 'upcoming',
    commands: [
      { name: 'git write-tree', desc: 'Create tree object from staging area index', syntax: 'git write-tree', risk: 'LOW' },
      { name: 'git commit-tree', desc: 'Create commit object from tree and parent', syntax: 'git commit-tree <tree> -m "msg"', risk: 'MEDIUM' },
      { name: 'git update-ref', desc: 'Safely update reference pointer directly', syntax: 'git update-ref refs/heads/main <sha>', risk: 'HIGH' },
      { name: 'git gc', desc: 'Run garbage collection and optimize repository', syntax: 'git gc [--prune]', risk: 'MEDIUM' },
      { name: 'git prune', desc: 'Prune unreachable loose objects from database', syntax: 'git prune', risk: 'HIGH' },
      { name: 'git maintenance', desc: 'Schedule background repository optimization', syntax: 'git maintenance run', risk: 'SAFE' },
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
  const [expandedMilestones, setExpandedMilestones] = useState<Record<number, boolean>>({
    1: true, // Level 1 is expanded by default (Current Chapter)
  });

  const toggleMilestone = (lvl: number) => {
    setExpandedMilestones(prev => ({
      ...prev,
      [lvl]: !prev[lvl],
    }));
  };

  const filteredMilestones = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return ROADMAP_MILESTONES;

    return ROADMAP_MILESTONES.map(m => {
      const matchingCommands = m.commands.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.desc.toLowerCase().includes(q) ||
          c.syntax.toLowerCase().includes(q)
      );
      const titleMatches = m.title.toLowerCase().includes(q) || m.tagline.toLowerCase().includes(q);

      return {
        ...m,
        commands: titleMatches ? m.commands : matchingCommands,
      };
    }).filter(m => m.commands.length > 0);
  }, [searchQuery]);

  const totalCount = useMemo(() => {
    return ROADMAP_MILESTONES.reduce((acc, m) => acc + m.commands.length, 0);
  }, []);

  return (
    <aside
      style={{
        width: '320px',
        minWidth: '320px',
        maxWidth: '320px',
        background: '#070b14',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* ROADMAP HEADER */}
      <div
        style={{
          padding: '1.1rem 1.25rem 0.9rem 1.25rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          background: 'rgba(10, 15, 28, 0.98)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Compass size={18} color="#38bdf8" />
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.02em' }}>
                Git Mastery Roadmap
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                12 Intent Levels · {totalCount} Commands
              </div>
            </div>
          </div>

          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 800,
              color: '#38bdf8',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              padding: '0.15rem 0.45rem',
              borderRadius: '999px',
            }}
          >
            Level 1 Active
          </span>
        </div>

        {/* SEARCH INPUT */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '7px',
            padding: '0.45rem 0.7rem',
          }}
        >
          <Search size={14} color="#64748b" />
          <input
            type="text"
            placeholder="Search roadmap commands..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#f8fafc',
              fontSize: '0.78rem',
              width: '100%',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ROADMAP TIMELINE TRACK */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem 1.1rem',
          position: 'relative',
        }}
      >
        {/* VERTICAL CONNECTOR SPINE LINE */}
        <div
          style={{
            position: 'absolute',
            left: '27px',
            top: '28px',
            bottom: '40px',
            width: '2px',
            background: 'linear-gradient(to bottom, #38bdf8 0%, rgba(56, 189, 248, 0.3) 25%, rgba(255, 255, 255, 0.08) 100%)',
            zIndex: 1,
          }}
        />

        {/* MILESTONE CARDS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', zIndex: 2 }}>
          {filteredMilestones.map(milestone => {
            const isExpanded = searchQuery.trim().length > 0 || expandedMilestones[milestone.levelNumber];
            const isActiveMilestone = milestone.status === 'active';
            const isCompletedMilestone = milestone.status === 'completed';

            return (
              <div key={milestone.levelNumber} style={{ position: 'relative', paddingLeft: '28px' }}>
                {/* NODE INDICATOR ICON ON THE SPINE */}
                <div
                  onClick={() => toggleMilestone(milestone.levelNumber)}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '2px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: isActiveMilestone
                      ? '#0284c7'
                      : isCompletedMilestone
                      ? '#10b981'
                      : '#0f172a',
                    border: isActiveMilestone
                      ? '2px solid #38bdf8'
                      : isCompletedMilestone
                      ? '2px solid #34d399'
                      : '2px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: isActiveMilestone ? '0 0 10px rgba(56, 189, 248, 0.5)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    color: isActiveMilestone || isCompletedMilestone ? '#ffffff' : '#94a3b8',
                    cursor: 'pointer',
                    zIndex: 3,
                  }}
                  title={`Level ${milestone.levelCode}: ${milestone.title}`}
                >
                  {isCompletedMilestone ? (
                    <CheckCircle2 size={12} color="#ffffff" />
                  ) : (
                    <span>{milestone.levelCode}</span>
                  )}
                </div>

                {/* MILESTONE HEADER CARD */}
                <div
                  onClick={() => toggleMilestone(milestone.levelNumber)}
                  style={{
                    background: isActiveMilestone
                      ? 'rgba(56, 189, 248, 0.08)'
                      : 'rgba(255, 255, 255, 0.02)',
                    border: isActiveMilestone
                      ? '1px solid rgba(56, 189, 248, 0.35)'
                      : '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '8px',
                    padding: '0.75rem 0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        color: isActiveMilestone ? '#38bdf8' : '#94a3b8',
                      }}
                    >
                      Level {milestone.levelCode}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {milestone.badge && (
                        <span
                          style={{
                            fontSize: '0.58rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            background: '#0284c7',
                            color: '#ffffff',
                            padding: '0.12rem 0.35rem',
                            borderRadius: '3px',
                          }}
                        >
                          {milestone.badge}
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronDown size={14} color="#94a3b8" />
                      ) : (
                        <ChevronRight size={14} color="#64748b" />
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      color: isActiveMilestone ? '#f8fafc' : '#e2e8f0',
                      lineHeight: 1.3,
                    }}
                  >
                    {milestone.title}
                  </div>

                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: '#94a3b8',
                      marginTop: '0.25rem',
                      lineHeight: 1.35,
                    }}
                  >
                    {milestone.tagline}
                  </div>
                </div>

                {/* COMMANDS CHECKPOINT LIST UNDER THIS MILESTONE */}
                {isExpanded && (
                  <div
                    style={{
                      marginTop: '0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.45rem',
                      paddingLeft: '0.2rem',
                    }}
                  >
                    {milestone.commands.map(cmd => {
                      const isCurrentTask =
                        currentCommand && currentCommand.toLowerCase().startsWith(cmd.name.toLowerCase());

                      return (
                        <div
                          key={cmd.name}
                          style={{
                            background: isCurrentTask
                              ? 'rgba(56, 189, 248, 0.12)'
                              : 'rgba(15, 23, 42, 0.6)',
                            border: isCurrentTask
                              ? '1px solid #38bdf8'
                              : '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '6px',
                            padding: '0.55rem 0.75rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.2rem',
                            position: 'relative',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <code
                                style={{
                                  fontSize: '0.78rem',
                                  fontWeight: 800,
                                  color: isCurrentTask ? '#38bdf8' : '#f1f5f9',
                                  fontFamily: 'monospace',
                                }}
                              >
                                {cmd.name}
                              </code>

                              {isCurrentTask && (
                                <span
                                  style={{
                                    fontSize: '0.55rem',
                                    fontWeight: 800,
                                    background: '#0284c7',
                                    color: 'white',
                                    padding: '0.05rem 0.3rem',
                                    borderRadius: '3px',
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  Current Task
                                </span>
                              )}
                            </div>

                            {onInsertCommand && (
                              <button
                                onClick={() => onInsertCommand(cmd.syntax)}
                                title={`Insert "${cmd.syntax}" into terminal`}
                                style={{
                                  background: 'rgba(56, 189, 248, 0.1)',
                                  border: '1px solid rgba(56, 189, 248, 0.3)',
                                  color: '#38bdf8',
                                  padding: '0.2rem 0.45rem',
                                  borderRadius: '4px',
                                  fontSize: '0.62rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                }}
                              >
                                <Terminal size={10} />
                                <span>Try</span>
                              </button>
                            )}
                          </div>

                          <div
                            style={{
                              fontSize: '0.7rem',
                              color: '#94a3b8',
                              lineHeight: 1.3,
                            }}
                          >
                            {cmd.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
