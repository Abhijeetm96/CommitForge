import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { BreakItView } from './BreakItView';
import { UndoLabView } from './UndoLabView';
import { ConflictArenaView } from './ConflictArenaView';
import { GitHospitalView } from './GitHospitalView';
import { TwoDevView } from './TwoDevView';
import { CapstoneView } from './CapstoneView';
import { CommandDiscoveryView } from './CommandDiscoveryView';
import { ConfigLabView } from './ConfigLabView';
import {
  Swords,
  HeartPulse,
  Flame,
  Bug,
  Settings,
  Award,
  Compass,
  RotateCcw,
  CheckCircle2,
  Play,
  ArrowRight,
  ArrowLeft,
  Search,
  ChevronDown,
  Sparkles,
  Zap,
  BookOpen,
  ShieldAlert,
  Code2,
  Terminal as TerminalIcon,
  HelpCircle,
  X,
  Layers,
  FlaskConical,
} from 'lucide-react';

export type LabTab = 'arena' | 'briefing' | 'commands' | 'recovery';

interface LabDefinition {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
  bgGrad: string;
  borderColor: string;
  commands: string[];
  objectives: string[];
  scenario: string;
  recoveryTips: string[];
}

const LAB_ITEMS: LabDefinition[] = [
  {
    id: 'conflict-arena',
    title: 'Merge Conflict Colosseum',
    category: 'Branch Diplomacy',
    badge: '⚔️ Colosseum',
    description: 'Resolve code collisions without yelling at teammates. Decode three-way conflict markers, stage peace treaties, and master git merge --abort.',
    icon: Swords,
    color: '#ef4444',
    bgGrad: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(185, 28, 28, 0.25) 100%)',
    borderColor: 'rgba(239, 68, 68, 0.35)',
    commands: ['git merge', 'git diff', 'git add', 'git merge --abort'],
    objectives: [
      'Decode <<<<<<< HEAD, =======, and >>>>>>> marker boundaries without panic',
      'Resolve single-line and multi-file code collisions with human diplomacy',
      'Stage clean conflict resolutions with git add before committing',
      'Understand how git merge --abort returns you to safe ground unscathed',
    ],
    scenario: 'Two developers modified the exact same function on parallel branches. Git threw up its hands, refused to guess who is right, and dropped conflict markers into the file. Step into the Colosseum to negotiate a peaceful resolution.',
    recoveryTips: [
      'If conflicts become overwhelming, run `git merge --abort` to return to your exact starting state with zero casualties.',
      'Never leave conflict markers inside source files unless you want CI to roast you in front of the team.',
    ],
  },
  {
    id: 'hospital',
    title: 'Git ER & Intensive Care',
    category: 'Triage & CPR',
    badge: '🏥 ER Ward',
    description: 'Detached HEAD triage & CPR for comatose repositories. Resuscitate orphaned commits, repair index trauma, and restore healthy vital signs.',
    icon: HeartPulse,
    color: '#10b981',
    bgGrad: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.25) 100%)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
    commands: ['git status', 'git fsck', 'git reflog', 'git branch'],
    objectives: [
      'Spot detached HEAD states and diagnose why developers wander into them',
      'Rescue orphaned commits created in detached HEAD before switching away',
      'Inspect repository structural integrity using git fsck',
      'Reattach lost commits to a named recovery branch before garbage collection',
    ],
    scenario: 'A developer was casually inspecting old history and made 5 urgent commits directly in detached HEAD mode. Now their branch pointer is gone and panic has set in. Perform surgical reflog resuscitation.',
    recoveryTips: [
      'Do not flatline: `git reflog` records every commit SHA locally for at least 30 days. Your work is almost never dead.',
      'Run `git branch recovery-squad <sha>` to rescue orphaned commits instantly.',
    ],
  },
  {
    id: 'undo-lab',
    title: 'Time Machine & Regret Eraser',
    category: 'Ctrl+Z Deluxe',
    badge: '⏪ Time Travel',
    description: 'Erase bad life choices across working tree, index, and history. Master git restore, revert, and soft/mixed/hard resets safely.',
    icon: RotateCcw,
    color: '#38bdf8',
    bgGrad: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(37, 99, 235, 0.25) 100%)',
    borderColor: 'rgba(56, 189, 248, 0.35)',
    commands: ['git restore', 'git restore --staged', 'git revert', 'git reset'],
    objectives: [
      'Surgically discard uncommitted working modifications with git restore',
      'Unstage accidentally packaged secrets without touching disk files',
      'Differentiate soft vs mixed vs hard resets clearly before pulling the trigger',
      'Create forward-moving inverse commits with git revert for polite public history',
    ],
    scenario: 'You accidentally staged API secrets, broke the CSS layout, and need to undo mistakes across 3 distinct zones without incinerating valid work.',
    recoveryTips: [
      'Use `git restore --staged <file>` to unstage files discreetly without discarding edits.',
      'Use `git revert` instead of `git reset` if commits have already been pushed to teammates.',
    ],
  },
  {
    id: 'break-it',
    title: 'Controlled Demolition Lab',
    category: 'Chaos Engineering',
    badge: '🔥 Chaos Lab',
    description: 'Deliberately break repositories in a blast-proof sandbox. Practice calm diagnosis until terminal error messages stop raising your heart rate.',
    icon: Flame,
    color: '#f59e0b',
    bgGrad: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.25) 100%)',
    borderColor: 'rgba(245, 158, 11, 0.35)',
    commands: ['git reset --hard', 'git reflog', 'git checkout', 'git branch'],
    objectives: [
      'Experience worst-case Git disasters in a blast-proof simulator',
      'Eliminate fear of terminal red text through repeated recovery drills',
      'Understand how Git preserves content-addressable objects under the hood',
      'Build lightning-fast reflexes for recovering corrupted repository states',
    ],
    scenario: 'Chaos engineering: trigger deleted branches, overwrite index files, and execute accidental hard resets, then practice surgical self-rescue.',
    recoveryTips: [
      'Git almost never deletes your data immediately. Even hard resets leave commits lingering in the reflog.',
      'Practice calm diagnosis before typing panic commands — 90% of crises are cured in 10 seconds with `git reflog`.',
    ],
  },
  {
    id: 'two-dev',
    title: 'Teammate Collision Chamber',
    category: 'Multiplayer Drama',
    badge: '👥 4:59 PM Push',
    description: 'Simulate what happens when two developers push simultaneously. Rebase without tears, decode non-fast-forward rejections, and keep friendships intact.',
    icon: Bug,
    color: '#a855f7',
    bgGrad: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(126, 34, 206, 0.25) 100%)',
    borderColor: 'rgba(168, 85, 247, 0.35)',
    commands: ['git fetch', 'git pull --rebase', 'git push', 'git switch'],
    objectives: [
      'Demystify remote tracking branch references (origin/main)',
      'Resolve "[rejected - non-fast-forward]" push errors without breaking a sweat',
      'Use git pull --rebase to keep commit history linear and civilized',
      'Inspect incoming team commits before merging using git fetch',
    ],
    scenario: 'It is Friday at 4:59 PM. Alice pushes a commit to origin while you work offline. When you try to push, Git slams the door in your face. Rebase gracefully.',
    recoveryTips: [
      'Run `git fetch origin` first to inspect what teammates pushed before letting Git merge blindly.',
      'Use `git pull --rebase` to replay your local commits cleanly on top of upstream changes.',
    ],
  },
  {
    id: 'config-lab',
    title: 'Git Interior Design Studio',
    category: 'Workflow Tuning',
    badge: '⚙️ Atelier',
    description: 'Deck out your .gitconfig, forge muscle-memory aliases, configure diff tools, and stop typing 40-character commands like a peasant.',
    icon: Settings,
    color: '#06b6d4',
    bgGrad: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(14, 116, 144, 0.25) 100%)',
    borderColor: 'rgba(6, 182, 212, 0.35)',
    commands: ['git config --global', 'git config --list', 'core.editor', 'init.defaultBranch'],
    objectives: [
      'Master the 3 Git configuration scopes: system, global (~/.gitconfig), and local repo',
      'Forge high-speed aliases (co, br, lg, amend) for frequent multi-flag commands',
      'Configure modern default branch names (init.defaultBranch main)',
      'Set preferred code editors and sensible cross-platform line ending rules',
    ],
    scenario: 'A fresh developer laptop with unconfigured Git is like an apartment with folding chairs. Deck it out with custom aliases, diff tools, and sensible defaults.',
    recoveryTips: [
      'View where all active settings come from with `git config --list --show-origin`.',
      'To remove a faulty alias or setting, run `git config --global --unset <key>`.',
    ],
  },
  {
    id: 'capstone',
    title: 'The Friday Production Gauntlet',
    category: 'Final Boss Battle',
    badge: '🏆 Final Boss',
    description: 'The release deadline is in 20 minutes. Feature branches are flying in, hotfixes are urgent, and the CTO is watching the log. Ship with zero errors.',
    icon: Award,
    color: '#eab308',
    bgGrad: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(161, 98, 7, 0.25) 100%)',
    borderColor: 'rgba(234, 179, 8, 0.35)',
    commands: ['git init', 'git branch', 'git merge', 'git tag', 'git rebase'],
    objectives: [
      'Execute a complete production release lifecycle from initial commit to tagged release',
      'Handle urgent production hotfixes while feature branches are in flight',
      'Merge feature branches and resolve simulated staging collisions',
      'Seal release tags with cryptographic milestone annotations',
    ],
    scenario: 'You are the lead engineer on a fast-growing platform. Build a clean release, navigate an unexpected hotfix, and tag v1.0.0 for deployment before the weekend.',
    recoveryTips: [
      'Always run `git status` and `git log --oneline` at every step before pulling triggers.',
      'Check for clean working trees before initiating branch switches or tag deployments.',
    ],
  },
  {
    id: 'discover',
    title: 'The "What Did I Just Do?" Oracle',
    category: 'Survival Compass',
    badge: '🧭 The Oracle',
    description: 'Side-by-side risk ratings and command matrices so you don\'t blow up the repository. Compare reset, restore, revert, and switch at a glance.',
    icon: Compass,
    color: '#38bdf8',
    bgGrad: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(37, 99, 235, 0.25) 100%)',
    borderColor: 'rgba(56, 189, 248, 0.35)',
    commands: ['git status', 'git restore', 'git reset', 'git revert'],
    objectives: [
      'Understand exactly what changes vs what stays untouched for every command',
      'Identify SAFE commands that can be run on airplanes with zero side effects',
      'Identify DESTRUCTIVE commands that require caution and backups',
      'Quickly choose the right tool for specific developer problems',
    ],
    scenario: 'You need to undo something, but you can\'t remember whether reset, revert, restore, checkout, or switch will vaporize your afternoon\'s work. Consult the Oracle.',
    recoveryTips: [
      'Commands labeled SAFE never alter repository history or destroy working files.',
      'When in doubt between reset and restore, prefer `git restore` for targeted safety.',
    ],
  },
];

export const LabsHubView: React.FC = () => {
  const { mode, setMode, activeLab, setActiveLab, completedLessonIds, markLessonComplete } = useApp();

  // Selected Lab state
  const [selectedLabId, setSelectedLabId] = useState<string>(() => {
    if (mode === 'discover') return 'discover';
    if (activeLab === 'two-dev' || mode === 'two-dev') return 'two-dev';
    if (mode && mode !== 'labs') return mode;
    return 'conflict-arena';
  });

  const [activeTab, setActiveTab] = useState<LabTab>('arena');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);

  // Active lab object
  const currentLab = useMemo(() => {
    return LAB_ITEMS.find((l) => l.id === selectedLabId) || LAB_ITEMS[0];
  }, [selectedLabId]);

  // Is completed
  const isLabCompleted = completedLessonIds.includes(`lab-${currentLab.id}`);

  // Filtered labs
  const filteredLabs = useMemo(() => {
    if (!searchQuery.trim()) return LAB_ITEMS;
    const q = searchQuery.toLowerCase();
    return LAB_ITEMS.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.commands.some((c) => c.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Progress count
  const completedCount = useMemo(() => {
    return LAB_ITEMS.filter((l) => completedLessonIds.includes(`lab-${l.id}`)).length;
  }, [completedLessonIds]);

  const progressPercent = Math.round((completedCount / LAB_ITEMS.length) * 100);

  // Previous & Next navigation
  const currentIndex = LAB_ITEMS.findIndex((l) => l.id === selectedLabId);
  const prevLab = currentIndex > 0 ? LAB_ITEMS[currentIndex - 1] : null;
  const nextLab = currentIndex < LAB_ITEMS.length - 1 ? LAB_ITEMS[currentIndex + 1] : null;

  const handleSelectLab = (labId: string) => {
    setSelectedLabId(labId);
    setShowMobileDrawer(false);
  };

  const handleToggleComplete = () => {
    markLessonComplete(`lab-${currentLab.id}`);
  };

  const IconComponent = currentLab.icon;

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        minHeight: 0,
        background: 'var(--bg-app)',
        color: 'var(--text-primary)',
        overflow: 'hidden',
      }}
    >
      {/* ================================================================ */}
      {/* COLUMN 1: LEFT SIDEBAR (8 Interactive Labs + Progress Tracker)   */}
      {/* ================================================================ */}
      <aside
        className="labs-sidebar-desktop"
        style={{
          width: '270px',
          minWidth: '270px',
          maxWidth: '270px',
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          maxHeight: '100%',
          minHeight: 0,
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            padding: '1.15rem 1rem 0.85rem 1rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-surface)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ef4444',
              }}
            >
              <FlaskConical size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.15 }}>
                Git Labs Hub
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                8 Simulation Arenas • Live
              </div>
            </div>
          </div>
        </div>

        {/* Quick Search Bar */}
        <div style={{ padding: '0.65rem 0.85rem', borderBottom: '1px solid var(--border-color)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '0.4rem 0.65rem',
            }}
          >
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Filter simulation labs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.78rem',
                width: '100%',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* 8 Labs List */}
        <div
          style={{
            flex: '1 1 0%',
            minHeight: 0,
            overflowY: 'auto',
            padding: '0.6rem 0.5rem 5rem 0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}
        >
          {filteredLabs.map((lab, index) => {
            const isActive = lab.id === selectedLabId;
            const isDone = completedLessonIds.includes(`lab-${lab.id}`);
            const LabIcon = lab.icon;

            return (
              <div
                key={lab.id}
                onClick={() => handleSelectLab(lab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: isActive ? `${lab.color}18` : 'transparent',
                  borderLeft: isActive ? `3px solid ${lab.color}` : '3px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    background: isActive ? `${lab.color}25` : 'var(--bg-card)',
                    border: `1px solid ${isActive ? lab.color : 'var(--border-color)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: lab.color,
                    flexShrink: 0,
                  }}
                >
                  <LabIcon size={14} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                  <span
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: isActive ? 800 : 600,
                      color: isActive ? 'var(--text-primary)' : 'var(--text-primary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {lab.title}
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      color: isActive ? lab.color : 'var(--text-muted)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {lab.category}
                  </span>
                </div>

                {isDone && (
                  <CheckCircle2 size={14} color="#22c55e" style={{ flexShrink: 0 }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Tracker Footer */}
        <div
          style={{
            flexShrink: 0,
            padding: '0.85rem 1.15rem',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-surface)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Labs Completed
            </span>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8' }}>
              {progressPercent}%
            </span>
          </div>

          <div
            style={{
              width: '100%',
              height: '6px',
              borderRadius: '999px',
              background: 'var(--border-color)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #38bdf8 0%, #22c55e 100%)',
                borderRadius: '999px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>

          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {completedCount} of {LAB_ITEMS.length} arenas completed
          </div>
        </div>
      </aside>

      {/* ================================================================ */}
      {/* COLUMN 2: CENTER PANEL (Selected Lab Experience)                 */}
      {/* ================================================================ */}
      <main
        className="labs-center-main"
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          maxHeight: '100%',
          overflow: 'hidden',
          background: 'var(--bg-app)',
        }}
      >
        {/* Mobile / Tablet Header (<1200px) */}
        <div
          className="labs-mobile-topbar"
          style={{
            flexShrink: 0,
            padding: '0.5rem 0.85rem',
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
          }}
        >
          <button
            onClick={() => setShowMobileDrawer(!showMobileDrawer)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: `${currentLab.color}15`,
              border: `1px solid ${currentLab.color}40`,
              borderRadius: '8px',
              padding: '0.35rem 0.65rem',
              color: currentLab.color,
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <IconComponent size={15} />
            <span>Labs ({LAB_ITEMS.length}) • {currentLab.title}</span>
            <ChevronDown size={13} />
          </button>

          <button
            onClick={() => setActiveTab('arena')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '8px',
              padding: '0.35rem 0.65rem',
              color: '#22c55e',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Play size={13} />
            <span>Open Arena</span>
          </button>
        </div>

        {/* Scrollable Center Body */}
        <div
          className="labs-content-container"
          style={{
            flex: '1 1 0%',
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '1.25rem 2rem 6.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            boxSizing: 'border-box',
            width: '100%',
            maxWidth: '100%',
          }}
        >
          {/* Hero Header (Matching Learn Page Visual Polish) */}
          <div
            style={{
              flexShrink: 0,
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '1.5rem 1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.15rem',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
            }}
          >
            {/* Top Row: Badges & Status */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: currentLab.color,
                    background: `${currentLab.color}15`,
                    border: `1px solid ${currentLab.color}35`,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {currentLab.badge}
                </span>

                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'var(--accent-primary)',
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '999px',
                  }}
                >
                  {currentLab.category}
                </span>

                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '999px',
                  }}
                >
                  Interactive Simulation
                </span>
              </div>

              {/* Status & Completion Toggle Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <button
                  onClick={handleToggleComplete}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: isLabCompleted ? 'rgba(34, 197, 94, 0.15)' : 'var(--bg-surface)',
                    border: isLabCompleted ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '0.45rem 0.95rem',
                    color: isLabCompleted ? '#22c55e' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <CheckCircle2 size={15} color={isLabCompleted ? '#22c55e' : 'var(--text-muted)'} />
                  <span>{isLabCompleted ? 'Completed' : 'Mark Complete'}</span>
                </button>
              </div>
            </div>

            {/* Title & Description Section */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: `${currentLab.color}25`,
                  border: `1px solid ${currentLab.color}45`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: currentLab.color,
                  flexShrink: 0,
                  boxShadow: `0 4px 12px ${currentLab.color}20`,
                }}
              >
                <IconComponent size={26} />
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: '1.7rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                  {currentLab.title}
                </h1>
                <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {currentLab.description}
                </p>
              </div>
            </div>

            {/* Command Pills Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)' }}>Target Commands:</span>
              {currentLab.commands.map((cmd, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: 'ui-monospace, monospace',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--accent-primary)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '6px',
                  }}
                >
                  $ {cmd}
                </span>
              ))}
            </div>

            {/* Sub-Tabs Navigation (Matching Learn Page) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '0.9rem',
                overflowX: 'auto',
              }}
            >
              {[
                { id: 'arena' as LabTab, label: 'Interactive Lab Arena', icon: Play },
                { id: 'briefing' as LabTab, label: 'Mission Briefing', icon: BookOpen },
                { id: 'commands' as LabTab, label: 'Core Commands', icon: Code2 },
                { id: 'recovery' as LabTab, label: 'Emergency Recovery Guide', icon: ShieldAlert },
              ].map((tab) => {
                const isTabActive = activeTab === tab.id;
                const TabIcon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.5rem 0.95rem',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: isTabActive ? 800 : 600,
                      color: isTabActive ? '#38bdf8' : 'var(--text-secondary)',
                      background: isTabActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                      border: isTabActive ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <TabIcon size={15} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================================================================ */}
          {/* TAB 1: INTERACTIVE LAB ARENA                                     */}
          {/* ================================================================ */}
          {activeTab === 'arena' && (
            <div
              style={{
                flexShrink: 0,
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
                minWidth: 0,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
              }}
            >
              {/* Dynamic Lab Component */}
              {selectedLabId === 'conflict-arena' && <ConflictArenaView />}
              {selectedLabId === 'hospital' && <GitHospitalView />}
              {selectedLabId === 'break-it' && <BreakItView />}
              {selectedLabId === 'two-dev' && <TwoDevView />}
              {selectedLabId === 'undo-lab' && <UndoLabView />}
              {selectedLabId === 'capstone' && <CapstoneView />}
              {selectedLabId === 'config-lab' && <ConfigLabView />}
              {selectedLabId === 'discover' && <CommandDiscoveryView />}
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 2: MISSION BRIEFING                                          */}
          {/* ================================================================ */}
          {activeTab === 'briefing' && (
            <div
              style={{
                flexShrink: 0,
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}
            >
              {/* Scenario Card */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: currentLab.color }}>
                  <Sparkles size={16} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Scenario Briefing
                  </span>
                </div>
                <div style={{ fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  {currentLab.scenario}
                </div>
              </div>

              {/* Objectives Checklist Card */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Learning Outcomes & Objectives ({currentLab.objectives.length})
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.65rem' }}>
                  {currentLab.objectives.map((obj, i) => (
                    <div
                      key={i}
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '0.7rem 0.85rem',
                        fontSize: '0.82rem',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.55rem',
                      }}
                    >
                      <CheckCircle2 size={16} color="#22c55e" style={{ flexShrink: 0 }} />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to action */}
              <div>
                <button
                  onClick={() => setActiveTab('arena')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.8rem 1.6rem',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                  }}
                >
                  <span>Enter {currentLab.title}</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 3: CORE COMMANDS                                             */}
          {/* ================================================================ */}
          {activeTab === 'commands' && (
            <div
              style={{
                flexShrink: 0,
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}
            >
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Commands Exercised in {currentLab.title}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {currentLab.commands.map((cmd, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'ui-monospace, monospace',
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        color: 'var(--accent-primary)',
                        background: 'var(--bg-surface)',
                        padding: '0.35rem 0.65rem',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      $ {cmd}
                    </span>

                    <button
                      onClick={() => setActiveTab('arena')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: 'rgba(56, 189, 248, 0.12)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        borderRadius: '6px',
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#38bdf8',
                        cursor: 'pointer',
                      }}
                    >
                      <Play size={12} />
                      <span>Practice in Arena</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 4: EMERGENCY RECOVERY GUIDE                                  */}
          {/* ================================================================ */}
          {activeTab === 'recovery' && (
            <div
              style={{
                flexShrink: 0,
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}
            >
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  borderRadius: '14px',
                  padding: '1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
                  <ShieldAlert size={18} />
                  <span style={{ fontSize: '0.88rem', fontWeight: 800 }}>
                    Emergency Diagnostic & Recovery Protocol
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {currentLab.recoveryTips.map((tip, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '0.85rem 1rem',
                        fontSize: '0.84rem',
                        color: 'var(--text-primary)',
                        lineHeight: 1.5,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.55rem',
                      }}
                    >
                      <span style={{ color: '#10b981', fontWeight: 800 }}>•</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pinned Bottom Navigation Bar (matching GitAcademyView) */}
        <div
          className="labs-bottom-bar"
          style={{
            flexShrink: 0,
            width: '100%',
            maxWidth: '100%',
            padding: '0.65rem 1.5rem',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            boxSizing: 'border-box',
          }}
        >
          {/* Previous Lab Button */}
          <button
            disabled={!prevLab}
            onClick={() => prevLab && handleSelectLab(prevLab.id)}
            title={prevLab ? `Go to ${prevLab.title}` : 'No previous lab'}
            style={{
              background: prevLab ? 'var(--bg-card)' : 'transparent',
              border: prevLab ? '1px solid var(--border-color)' : '1px solid transparent',
              color: prevLab ? 'var(--text-primary)' : 'var(--text-muted)',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              cursor: prevLab ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              opacity: prevLab ? 1 : 0.4,
              transition: 'all 0.15s ease',
            }}
          >
            <ArrowLeft size={14} />
            <span className="nav-btn-text">Previous</span>
          </button>

          {/* Current Lab Status Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: currentLab.color }}>
              Lab {currentIndex + 1} of {LAB_ITEMS.length}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {currentLab.title}
            </span>
          </div>

          {/* Next Lab Button */}
          <button
            disabled={!nextLab}
            onClick={() => nextLab && handleSelectLab(nextLab.id)}
            title={nextLab ? `Go to ${nextLab.title}` : 'No next lab'}
            style={{
              background: nextLab ? 'var(--bg-card)' : 'transparent',
              border: nextLab ? '1px solid var(--border-color)' : '1px solid transparent',
              color: nextLab ? 'var(--text-primary)' : 'var(--text-muted)',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              cursor: nextLab ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              opacity: nextLab ? 1 : 0.4,
              transition: 'all 0.15s ease',
            }}
          >
            <span className="nav-btn-text">Next</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </main>
    </div>
  );
};
