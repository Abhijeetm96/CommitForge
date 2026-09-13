import React, { useState } from 'react';
import { GitRepo } from '../../git-engine/types';
import { Play, RotateCcw, AlertTriangle, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';

interface InteractiveSimulatorProps {
  simulatorType?: 'push' | 'commit' | 'add' | 'branch' | 'switch' | 'merge' | 'conflict' | 'rebase' | 'reset' | 'stash';
  repo: GitRepo;
  onExecuteCommand: (cmd: string) => void;
  onUpdateFileContent?: (path: string, content: string) => void;
}

export const InteractiveSimulator: React.FC<InteractiveSimulatorProps> = ({
  simulatorType = 'push',
  repo,
  onExecuteCommand,
  onUpdateFileContent,
}) => {
  const [resetMode, setResetMode] = useState<'soft' | 'mixed' | 'hard'>('mixed');
  const [conflictChoice, setConflictChoice] = useState<'yours' | 'theirs' | 'both' | null>(null);

  const currentBranch = repo.head.type === 'branch' ? repo.head.ref : 'main';
  const remoteBranch = repo.remotes['origin']?.branches[currentBranch]?.targetCommitHash;
  const localBranch = repo.branches[currentBranch]?.targetCommitHash;
  const isPushable = Boolean(localBranch && (!remoteBranch || localBranch !== remoteBranch));
  const isStaged = Object.keys(repo.index).length > 0;
  const hasStash = repo.stash.length > 0;

  return (
    <div
      style={{
        background: '#0d1527',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '12px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1rem' }}>🎮</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f8fafc' }}>
            Interactive Simulator
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              padding: '0.15rem 0.5rem',
              borderRadius: '999px',
            }}
          >
            Direct Engine Interface
          </span>
        </div>
      </div>

      {/* Simulator: PUSH */}
      {simulatorType === 'push' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
            Test the real Git Engine transaction: click below to send local commits to <code>origin/{currentBranch}</code>.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => onExecuteCommand(`git push origin ${currentBranch}`)}
              disabled={!isPushable}
              style={{
                background: isPushable ? '#2563eb' : '#1e293b',
                color: isPushable ? 'white' : '#64748b',
                border: 'none',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: isPushable ? 'pointer' : 'not-allowed',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: isPushable ? '0 4px 12px rgba(37, 99, 235, 0.35)' : 'none',
              }}
            >
              <Play size={14} fill={isPushable ? 'white' : '#64748b'} />
              Push {localBranch ? localBranch.slice(0, 7) : 'Commit'} to origin/{currentBranch}
            </button>
            {!isPushable && (
              <span style={{ fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={16} /> Remote is already in sync!
              </span>
            )}
          </div>
        </div>
      )}

      {/* Simulator: COMMIT */}
      {simulatorType === 'commit' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
            {isStaged
              ? 'Files are in the staging box. Click below to take a permanent snapshot.'
              : 'Staging area is empty. Stage changes first with git add.'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => onExecuteCommand('git commit -m "Update homepage"')}
              disabled={!isStaged}
              style={{
                background: isStaged ? '#10b981' : '#1e293b',
                color: isStaged ? '#062016' : '#64748b',
                border: 'none',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: isStaged ? 'pointer' : 'not-allowed',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Play size={14} fill={isStaged ? '#062016' : '#64748b'} />
              Seal Staged Changes into Commit
            </button>
            {!isStaged && (
              <button
                onClick={() => onExecuteCommand('git add index.html')}
                style={{
                  background: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#38bdf8',
                  padding: '0.55rem 1rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
              >
                Stage index.html first
              </button>
            )}
          </div>
        </div>
      )}

      {/* Simulator: RESET */}
      {simulatorType === 'reset' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
            Compare the 3 reset modes interactively. Observe the difference before executing:
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {(['soft', 'mixed', 'hard'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setResetMode(m)}
                style={{
                  flex: 1,
                  padding: '0.55rem 0.75rem',
                  borderRadius: '6px',
                  border: resetMode === m ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: resetMode === m ? 'rgba(245, 158, 11, 0.15)' : '#131d33',
                  color: resetMode === m ? '#f59e0b' : '#94a3b8',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                --{m.toUpperCase()}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '0.8rem', color: '#cbd5e1', background: '#131d33', padding: '0.65rem 0.85rem', borderRadius: '6px' }}>
            {resetMode === 'soft' && '🟢 --soft: HEAD moves backwards. Changes remain STAGED in packing box.'}
            {resetMode === 'mixed' && '🟡 --mixed: HEAD moves backwards. Changes remain on your DESK in working files.'}
            {resetMode === 'hard' && '🔴 --hard: ⚠️ DESTRUCTIVE WORKING-TREE OPERATION. Working files and staging match target commit.'}
          </div>

          <button
            onClick={() => onExecuteCommand(`git reset --${resetMode} HEAD~1`)}
            style={{
              background: resetMode === 'hard' ? '#ef4444' : '#f59e0b',
              color: 'white',
              border: 'none',
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              alignSelf: 'flex-start',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            {resetMode === 'hard' && <ShieldAlert size={15} />}
            Execute git reset --{resetMode} HEAD~1
          </button>
        </div>
      )}

      {/* Simulator: STASH */}
      {simulatorType === 'stash' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
            Shelve unfinished modifications in the stash drawer, or pop them back out:
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => onExecuteCommand('git stash')}
              style={{
                background: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              📦 git stash (Slide into Drawer)
            </button>
            <button
              onClick={() => onExecuteCommand('git stash pop')}
              disabled={!hasStash}
              style={{
                background: hasStash ? '#10b981' : '#1e293b',
                color: hasStash ? '#062016' : '#64748b',
                border: 'none',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: hasStash ? 'pointer' : 'not-allowed',
              }}
            >
              📤 git stash pop ({repo.stash.length} in drawer)
            </button>
          </div>
        </div>
      )}

      {/* Simulator: CONFLICT */}
      {simulatorType === 'conflict' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
            Interactive 3-Way Conflict Resolver: choose how to integrate colliding lines:
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => {
                setConflictChoice('yours');
                if (onUpdateFileContent) onUpdateFileContent('index.html', '<h1>Welcome to CommitForge</h1>');
              }}
              style={{
                flex: 1,
                padding: '0.6rem',
                borderRadius: '6px',
                border: conflictChoice === 'yours' ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                background: conflictChoice === 'yours' ? 'rgba(16, 185, 129, 0.15)' : '#131d33',
                color: conflictChoice === 'yours' ? '#10b981' : '#94a3b8',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              Accept Yours ("Welcome")
            </button>

            <button
              onClick={() => {
                setConflictChoice('theirs');
                if (onUpdateFileContent) onUpdateFileContent('index.html', '<h1>Hello from Teammate</h1>');
              }}
              style={{
                flex: 1,
                padding: '0.6rem',
                borderRadius: '6px',
                border: conflictChoice === 'theirs' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                background: conflictChoice === 'theirs' ? 'rgba(56, 189, 248, 0.15)' : '#131d33',
                color: conflictChoice === 'theirs' ? '#38bdf8' : '#94a3b8',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              Accept Theirs ("Hello")
            </button>

            <button
              onClick={() => {
                setConflictChoice('both');
                if (onUpdateFileContent) onUpdateFileContent('index.html', '<h1>Welcome & Hello to CommitForge</h1>');
              }}
              style={{
                flex: 1,
                padding: '0.6rem',
                borderRadius: '6px',
                border: conflictChoice === 'both' ? '1px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
                background: conflictChoice === 'both' ? 'rgba(168, 85, 247, 0.15)' : '#131d33',
                color: conflictChoice === 'both' ? '#c084fc' : '#94a3b8',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              Combine Both
            </button>
          </div>

          {conflictChoice && (
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <button
                onClick={() => {
                  onExecuteCommand('git add index.html');
                  onExecuteCommand('git commit -m "Merge branch and resolve conflict"');
                }}
                style={{
                  background: '#10b981',
                  color: '#062016',
                  border: 'none',
                  padding: '0.6rem 1.25rem',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Stage & Complete Merge
              </button>
              <span style={{ fontSize: '0.8rem', color: '#10b981' }}>
                ✓ Markers removed. Ready to seal!
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
