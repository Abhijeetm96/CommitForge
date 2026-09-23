import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GitRepo, Commit } from '../../git-engine/types';
import { calculateGitStateDiff } from './stateDiff';
import { CausalAnimationStep, StageMode } from './types';
import { getCausalStory } from './causalStories';
import { GitKnowsModal } from './GitKnowsModal';
import { WhyDidGitDoThatModal } from './WhyDidGitDoThatModal';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Laptop,
  Cloud,
  Layers,
  Database,
  Camera,
  FileText,
  GitBranch,
  HelpCircle,
  GitGraph,
  AlertTriangle,
  Cpu,
  Shield,
} from 'lucide-react';

interface GitAnimationStageProps {
  commandId?: string;
  stageMode?: StageMode;
  repo: GitRepo;
  onExecuteCommand: (cmd: string) => void;
  onUpdateFileContent?: (path: string, content: string) => void;
}

export const GitAnimationStage: React.FC<GitAnimationStageProps> = ({
  commandId = 'push',
  stageMode = 'animation',
  repo,
  onExecuteCommand: _onExecuteCommand,
}) => {
  const story = useMemo(() => getCausalStory(commandId, repo), [commandId, repo]);

  // Active stage mode (sync with parent prop without cascading render)
  const [currentStageMode, setCurrentStageMode] = useState<StageMode>(stageMode);
  const prevStageModeRef = useRef(stageMode);
  if (prevStageModeRef.current !== stageMode) {
    prevStageModeRef.current = stageMode;
    setCurrentStageMode(stageMode);
  }

  // Playback state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Selected item in architecture or tree view
  const [selectedArchObject, setSelectedArchObject] = useState<{
    type: 'working' | 'index' | 'commit' | 'tree' | 'blob' | 'ref';
    name: string;
    hash?: string;
    content: string;
  }>({
    type: 'commit',
    name: 'HEAD Commit Object',
    hash: 'a3f2e1d',
    content: `tree 7c8d9e01\nparent 4d9e2f3a\nauthor Dev <dev@commitforge.io> 1718000000 +0000\ncommitter Dev <dev@commitforge.io> 1718000000 +0000\n\nAdd interactive features and update tests`,
  });

  const [selectedDagCommit, setSelectedDagCommit] = useState<Commit | null>(null);

  // Modals
  const [showGitKnowsModal, setShowGitKnowsModal] = useState(false);
  const [showWhyModal, setShowWhyModal] = useState(false);

  // State diffing (pure memoized derivation without cascading renders)
  const [beforeSnapshot] = useState<GitRepo>(repo);
  const stateDelta = useMemo(
    () => calculateGitStateDiff(beforeSnapshot, repo),
    [beforeSnapshot, repo]
  );

  const timerRef = useRef<any>(null);

  const activeStep: CausalAnimationStep = story.steps[currentStepIndex] || story.steps[0];
  const totalSteps = story.steps.length;

  // Auto-play timer for animation mode
  useEffect(() => {
    if (currentStageMode !== 'animation' || !isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const stepInterval = Math.round(3200 / playbackSpeed);

    timerRef.current = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < totalSteps - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, stepInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, totalSteps, playbackSpeed, currentStageMode]);

  const handleReplay = () => {
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  const handleStepClick = (index: number) => {
    setCurrentStepIndex(index);
    setIsPlaying(false);
  };

  const currentBranch = repo.head.type === 'branch' ? repo.head.ref : 'main';
  const headHash = repo.branches[currentBranch]?.targetCommitHash?.slice(0, 7) || 'a3f2e1d';
  const remoteHash = repo.remotes['origin']?.branches[currentBranch]?.targetCommitHash?.slice(0, 7) || '9b1c7a0';
  const isStaged = Object.keys(repo.index).length > 0;

  // Determine stage category
  const isRemoteStory = commandId === 'push' || commandId === 'pull' || commandId === 'fetch';
  const isBranchStory = commandId === 'branch' || commandId === 'switch' || commandId === 'merge' || commandId === 'conflict' || commandId === 'rebase';
  const isThreeAreaStory = !isRemoteStory && !isBranchStory;

  // Commits list from real repository (pure memoized fallback)
  const commitList = Object.values(repo.commits);
  const displayCommits = useMemo(() => {
    if (commitList.length > 0) return commitList;
    const baseTime = 1718000000000;
    return [
      {
        hash: '4d9e2f3a8b1c4e2d3f5a6b7c8d9e0f1a2b3c4d5e',
        shortHash: '4d9e2f3',
        message: 'Initial repository setup',
        author: 'Dev <dev@commitforge.io>',
        timestamp: baseTime - 3600000 * 4,
        parents: [],
        files: { 'index.html': '<html><body>Hello CommitForge</body></html>' },
      },
      {
        hash: '9b1c7a0e3d4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
        shortHash: '9b1c7a0',
        message: 'Add responsive navigation layout',
        author: 'Dev <dev@commitforge.io>',
        timestamp: baseTime - 3600000 * 2,
        parents: ['4d9e2f3a8b1c4e2d3f5a6b7c8d9e0f1a2b3c4d5e'],
        files: { 'index.html': '<html><body>Updated layout</body></html>', 'style.css': 'body { margin: 0; }' },
      },
      {
        hash: `${headHash}000000000000000000000000000000000`,
        shortHash: headHash,
        message: 'Implement core state transitions',
        author: 'Dev <dev@commitforge.io>',
        timestamp: baseTime - 1800000,
        parents: ['9b1c7a0e3d4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b'],
        files: { 'index.html': '...', 'style.css': '...', 'script.js': 'console.log("Ready");' },
      },
    ];
  }, [commitList, headHash]);

  const activeDagCommit = selectedDagCommit || displayCommits[displayCommits.length - 1];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1.25rem',
        boxShadow: 'var(--shadow-sm)',
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Header Toolbar with View Mode Switcher */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#38bdf8',
              boxShadow: '0 0 12px #38bdf8',
              animation: 'radarPing 2s infinite ease-out',
            }}
          />
          <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Interactive Git Stage: <span style={{ color: '#38bdf8', fontFamily: 'monospace' }}>git {commandId}</span>
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              color: '#10b981',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '0.15rem 0.5rem',
              borderRadius: '999px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981' }} />
            Single Source of Truth (GitEngine)
          </span>
        </div>

        {/* Mode Selector Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'var(--bg-surface)',
            padding: '0.25rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
          }}
        >
          <button
            onClick={() => setCurrentStageMode('animation')}
            style={{
              background: currentStageMode === 'animation' ? '#2563eb' : 'transparent',
              color: currentStageMode === 'animation' ? '#ffffff' : 'var(--text-secondary)',
              border: 'none',
              padding: '0.35rem 0.8rem',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s ease',
              boxShadow: currentStageMode === 'animation' ? '0 2px 10px rgba(37, 99, 235, 0.4)' : 'none',
            }}
          >
            <Play size={13} fill={currentStageMode === 'animation' ? 'white' : 'none'} />
            🎬 Animation Flow
          </button>

          <button
            onClick={() => setCurrentStageMode('diagram')}
            style={{
              background: currentStageMode === 'diagram' ? '#2563eb' : 'transparent',
              color: currentStageMode === 'diagram' ? '#ffffff' : 'var(--text-secondary)',
              border: 'none',
              padding: '0.35rem 0.8rem',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s ease',
              boxShadow: currentStageMode === 'diagram' ? '0 2px 10px rgba(37, 99, 235, 0.4)' : 'none',
            }}
          >
            <Layers size={13} />
            📐 Causal Architecture
          </button>

          <button
            onClick={() => setCurrentStageMode('tree')}
            style={{
              background: currentStageMode === 'tree' ? '#2563eb' : 'transparent',
              color: currentStageMode === 'tree' ? '#ffffff' : '#94a3b8',
              border: 'none',
              padding: '0.35rem 0.8rem',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s ease',
              boxShadow: currentStageMode === 'tree' ? '0 2px 10px rgba(37, 99, 235, 0.4)' : 'none',
            }}
          >
            <GitGraph size={13} />
            🌳 Git Tree / DAG
          </button>
        </div>
      </div>

      {/* Visual Canvas Stage Container */}
      <div
        style={{
          background: 'radial-gradient(ellipse at 50% 20%, #111c38 0%, #060a14 100%)',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '1.5rem',
          minHeight: '360px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 60px rgba(0, 0, 0, 0.7)',
        }}
      >
        {/* ========================================================================= */}
        {/* MODE 1: ANIMATION FLOW (3 THEATERS) */}
        {/* ========================================================================= */}
        {currentStageMode === 'animation' && (
          <>
            {/* THEATER 1: REMOTE PUSH / PULL (Workstation + Fiber Optic Highway + GitHub Cloud) */}
            {isRemoteStory && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
                {/* Top Grid: Your Computer Laptop + Flow Channel + Remote GitHub Cloud */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(240px, 1.1fr) minmax(130px, 0.8fr) minmax(240px, 1.1fr)',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                  className="theater-nodes-grid"
                >
                  {/* Node 1: Dev Workstation Laptop */}
                  <div
                    style={{
                      background: 'rgba(11, 18, 33, 0.92)',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      borderRadius: '12px',
                      padding: '1rem',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      minWidth: 0,
                    }}
                  >
                    {/* Workstation Screen Bezel Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ef4444' }} />
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f59e0b' }} />
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} />
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          Dev Workstation
                        </span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8', background: 'rgba(255, 255, 255, 0.05)', padding: '0.15rem 0.45rem', borderRadius: '4px', flexShrink: 0 }}>
                        📁 ~/project
                      </span>
                    </div>

                    <div style={{ background: '#050811', borderRadius: '8px', padding: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', fontWeight: 800, color: '#64748b' }}>
                        <span>LOCAL COMMITS</span>
                        <span style={{ color: '#38bdf8' }}>3 ahead of origin</span>
                      </div>

                      {/* Commit 3 */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                          fontSize: '0.8rem',
                          padding: '0.4rem 0.55rem',
                          borderRadius: '6px',
                          background: currentStepIndex >= 4 ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                          border: currentStepIndex >= 4 ? '1px solid #38bdf8' : '1px solid transparent',
                          boxShadow: currentStepIndex >= 4 ? '0 0 12px rgba(56, 189, 248, 0.3)' : 'none',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#38bdf8', flexShrink: 0 }} />
                          <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#38bdf8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {headHash}
                          </span>
                          <span style={{ fontSize: '0.74rem', color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            Interactive features
                          </span>
                        </div>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#ffffff', background: '#2563eb', padding: '0.1rem 0.4rem', borderRadius: '4px', flexShrink: 0, whiteSpace: 'nowrap' }}>
                          HEAD → {currentBranch}
                        </span>
                      </div>

                      {/* Commit 2 */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.78rem', padding: '0.3rem 0.55rem', color: '#94a3b8' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#64748b', flexShrink: 0 }} />
                          <span style={{ fontFamily: 'monospace' }}>9b1c7a0</span>
                          <span style={{ fontSize: '0.74rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            Add navigation bar
                          </span>
                        </div>
                        <span style={{ fontSize: '0.68rem', color: '#64748b' }}>C2</span>
                      </div>

                      {/* Commit 1 */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.78rem', padding: '0.3rem 0.55rem', color: '#64748b' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#475569', flexShrink: 0 }} />
                          <span style={{ fontFamily: 'monospace' }}>4d9e2f3</span>
                          <span style={{ fontSize: '0.74rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            Initial commit
                          </span>
                        </div>
                        <span style={{ fontSize: '0.68rem', color: '#475569' }}>C1</span>
                      </div>
                    </div>
                  </div>

                  {/* Cyber Data Highway with Animated Fiber Optic Cable */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem', padding: '0 0.5rem' }}>
                    <div
                      style={{
                        background: '#040711',
                        border: '1px solid #38bdf8',
                        borderRadius: '8px',
                        padding: '0.35rem 0.75rem',
                        textAlign: 'center',
                        boxShadow: '0 0 16px rgba(56, 189, 248, 0.3)',
                      }}
                    >
                      <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.84rem', color: '#38bdf8' }}>
                        git {commandId}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                        ⚡ SSH / TLS 1.3
                      </div>
                    </div>

                    {/* Animated SVG Fiber Optic Line */}
                    <div style={{ width: '100%', maxWidth: '160px', position: 'relative', height: '24px', display: 'flex', alignItems: 'center' }}>
                      <svg width="100%" height="24" viewBox="0 0 160 24" style={{ overflow: 'visible' }}>
                        <line x1="0" y1="12" x2="160" y2="12" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="3" />
                        <line
                          x1="0"
                          y1="12"
                          x2="160"
                          y2="12"
                          stroke="#38bdf8"
                          strokeWidth="3"
                          strokeDasharray="8 6"
                          style={{ animation: 'cyberFlow 1.5s linear infinite' }}
                        />
                      </svg>

                      {/* Moving Commit Payload Packet */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '1px',
                          left: `${Math.min(85, Math.max(5, (currentStepIndex / Math.max(1, totalSteps - 1)) * 80))}%`,
                          background: '#2563eb',
                          color: '#ffffff',
                          border: '1px solid #38bdf8',
                          borderRadius: '6px',
                          padding: '0.1rem 0.4rem',
                          fontSize: '0.65rem',
                          fontFamily: 'monospace',
                          fontWeight: 800,
                          boxShadow: '0 0 12px #38bdf8',
                          transition: 'left 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                          whiteSpace: 'nowrap',
                          zIndex: 2,
                        }}
                      >
                        📦 {headHash}
                      </div>
                    </div>

                    <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 700 }}>
                      {currentStepIndex >= 4 ? '➔ Transferring commits' : 'Connecting to remote...'}
                    </div>
                  </div>

                  {/* Node 2: GitHub Remote Cloud Datacenter */}
                  <div
                    style={{
                      background: 'rgba(11, 18, 33, 0.92)',
                      border: '1px solid rgba(16, 185, 129, 0.35)',
                      borderRadius: '12px',
                      padding: '1rem',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      minWidth: 0,
                    }}
                  >
                    {/* Cloud Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                        <Cloud size={17} color="#10b981" style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          GitHub Remote (origin)
                        </span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', padding: '0.15rem 0.45rem', borderRadius: '4px', flexShrink: 0 }}>
                        🟢 Cloud Datacenter
                      </span>
                    </div>

                    <div style={{ background: '#050811', borderRadius: '8px', padding: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', fontWeight: 800, color: '#64748b' }}>
                        <span>REMOTE COMMITS</span>
                        <span style={{ color: currentStepIndex >= 5 ? '#10b981' : '#f59e0b' }}>
                          {currentStepIndex >= 5 ? '✓ Up to date' : 'Waiting for sync'}
                        </span>
                      </div>

                      {/* Remote C3 */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                          fontSize: '0.8rem',
                          padding: '0.4rem 0.55rem',
                          borderRadius: '6px',
                          background: currentStepIndex >= 5 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                          border: currentStepIndex >= 5 ? '1px solid #10b981' : '1px solid transparent',
                          boxShadow: currentStepIndex >= 5 ? '0 0 12px rgba(16, 185, 129, 0.3)' : 'none',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: currentStepIndex >= 5 ? '#10b981' : '#64748b', flexShrink: 0 }} />
                          <span style={{ fontFamily: 'monospace', fontWeight: 800, color: currentStepIndex >= 5 ? '#10b981' : '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {currentStepIndex >= 5 ? headHash : remoteHash}
                          </span>
                          <span style={{ fontSize: '0.74rem', color: currentStepIndex >= 5 ? '#cbd5e1' : '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {currentStepIndex >= 5 ? 'Interactive features' : 'Add navigation bar'}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#ffffff', background: currentStepIndex >= 5 ? '#059669' : '#334155', padding: '0.1rem 0.4rem', borderRadius: '4px', flexShrink: 0, whiteSpace: 'nowrap' }}>
                          origin/{currentBranch}
                        </span>
                      </div>

                      {/* Remote C2 */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.78rem', padding: '0.3rem 0.55rem', color: '#94a3b8' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#64748b', flexShrink: 0 }} />
                          <span style={{ fontFamily: 'monospace' }}>9b1c7a0</span>
                          <span style={{ fontSize: '0.74rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            Add navigation bar
                          </span>
                        </div>
                        <span style={{ fontSize: '0.68rem', color: '#64748b' }}>C2</span>
                      </div>

                      {/* Remote C1 */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.78rem', padding: '0.3rem 0.55rem', color: '#64748b' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#475569', flexShrink: 0 }} />
                          <span style={{ fontFamily: 'monospace' }}>4d9e2f3</span>
                          <span style={{ fontSize: '0.74rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            Initial commit
                          </span>
                        </div>
                        <span style={{ fontSize: '0.68rem', color: '#475569' }}>C1</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Global Team Network Map */}
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.74rem', fontWeight: 800 }}>
                      You
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>Author (Local)</span>
                  </div>

                  <div style={{ width: '24px', height: '2px', background: currentStepIndex >= 5 ? '#10b981' : 'rgba(255, 255, 255, 0.1)' }} />

                  <div
                    style={{
                      background: currentStepIndex >= 5 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${currentStepIndex >= 5 ? '#10b981' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '999px',
                      padding: '0.35rem 1rem',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      color: currentStepIndex >= 5 ? '#10b981' : '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      boxShadow: currentStepIndex >= 5 ? '0 0 16px rgba(16, 185, 129, 0.25)' : 'none',
                    }}
                  >
                    <CheckCircle2 size={14} />
                    {currentStepIndex >= 5 ? 'Synced with team repository! Teammates can now pull' : 'Commits stored locally until git push'}
                  </div>

                  <div style={{ width: '24px', height: '2px', background: currentStepIndex >= 5 ? '#10b981' : 'rgba(255, 255, 255, 0.1)' }} />

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10b981', color: '#062016', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.74rem', fontWeight: 800 }}>
                      T1
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Sarah (Peer)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f59e0b', color: '#1a1003', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.74rem', fontWeight: 800 }}>
                      CI
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>GitHub Actions</span>
                  </div>
                </div>
              </div>
            )}

            {/* THEATER 2: THREE-AREA PHYSICAL GIT LABORATORY (init, status, add, commit, log) */}
            {isThreeAreaStory && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr)',
                  alignItems: 'center',
                  gap: '0.85rem',
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                }}
                className="three-area-stage-grid"
              >
                {/* Area 1: Working Tree (The Physical Desk) */}
                <div
                  style={{
                    background: 'rgba(11, 18, 33, 0.92)',
                    border: '1px solid rgba(245, 158, 11, 0.35)',
                    borderRadius: '12px',
                    padding: '1.1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    minWidth: 0,
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  {/* Subtle Laser Scan on Working Tree */}
                  {commandId === 'add' && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)',
                        boxShadow: '0 0 10px #f59e0b',
                        animation: 'laserScan 2.5s infinite ease-in-out',
                        pointerEvents: 'none',
                      }}
                    />
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                      <FileText size={16} color="#f59e0b" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        1. Working Tree
                      </span>
                    </div>
                    <span style={{ fontSize: '0.68rem', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px', flexShrink: 0 }}>
                      Local Disk
                    </span>
                  </div>

                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    Active files where you write and edit code
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {[
                      { name: 'index.html', diff: '+12 -2', status: commandId === 'add' ? 'EDITED' : 'UNTRACKED' },
                      { name: 'style.css', diff: '+4 -0', status: 'UNTRACKED' },
                      { name: 'script.js', diff: '+28 -5', status: 'UNTRACKED' },
                    ].map((f) => (
                      <div
                        key={f.name}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                          padding: '0.4rem 0.6rem',
                          background: '#040711',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0, flex: 1 }}>
                          <span style={{ fontFamily: 'monospace', color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {f.name}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: '#10b981', fontFamily: 'monospace', flexShrink: 0 }}>
                            {f.diff}
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: '0.66rem',
                            fontWeight: 800,
                            color: '#f59e0b',
                            background: 'rgba(245, 158, 11, 0.12)',
                            padding: '0.1rem 0.35rem',
                            borderRadius: '4px',
                            flexShrink: 0,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {f.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: '0.7rem', color: '#64748b', textAlign: 'center' }}>
                    Changes are not protected by Git yet
                  </div>
                </div>

                {/* Conveyor 1: git add Optical Pipeline */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', padding: '0 0.2rem' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#38bdf8',
                      fontFamily: 'monospace',
                      whiteSpace: 'nowrap',
                      background: '#040711',
                      border: '1px solid #38bdf8',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                      boxShadow: '0 0 10px rgba(56, 189, 248, 0.2)',
                    }}
                  >
                    git add
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#38bdf8', fontSize: '1.2rem', fontWeight: 900 }}>
                    ➔
                  </div>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                    Stage files
                  </span>
                </div>

                {/* Area 2: Staging Area (The Index / Packing Crate) */}
                <div
                  style={{
                    background: 'rgba(11, 18, 33, 0.92)',
                    border: isStaged || commandId === 'add' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '1.1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    boxShadow: isStaged || commandId === 'add' ? '0 0 20px rgba(56, 189, 248, 0.25)' : 'none',
                    minWidth: 0,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                      <Database size={16} color="#38bdf8" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        2. Staging Area (Index)
                      </span>
                    </div>
                    <span style={{ fontSize: '0.68rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px', flexShrink: 0 }}>
                      .git/index
                    </span>
                  </div>

                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    Curated packing crate prepared for next snapshot
                  </div>

                  <div
                    style={{
                      padding: '0.55rem 0.65rem',
                      background: '#040711',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                      <span style={{ fontFamily: 'monospace', color: '#38bdf8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 700 }}>
                        index.html
                      </span>
                      <span style={{ fontSize: '0.66rem', color: '#64748b', fontFamily: 'monospace' }}>
                        blob 8a3f2e1d (zlib compressed)
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        color: '#38bdf8',
                        background: 'rgba(56, 189, 248, 0.15)',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        flexShrink: 0,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      STAGED
                    </span>
                  </div>

                  <div style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 700, textAlign: 'center', background: 'rgba(245, 158, 11, 0.08)', padding: '0.35rem', borderRadius: '6px' }}>
                    ⚠️ Not a permanent milestone yet!
                  </div>
                </div>

                {/* Conveyor 2: git commit Cryptographic Sealer */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', padding: '0 0.2rem' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#10b981',
                      fontFamily: 'monospace',
                      whiteSpace: 'nowrap',
                      background: '#040711',
                      border: '1px solid #10b981',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                      boxShadow: '0 0 10px rgba(16, 185, 129, 0.2)',
                    }}
                  >
                    git commit
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#10b981', fontSize: '1.2rem', fontWeight: 900 }}>
                    ➔
                  </div>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                    Seal snapshot
                  </span>
                </div>

                {/* Area 3: Local Repository (The Milestone Vault) */}
                <div
                  style={{
                    background: 'rgba(11, 18, 33, 0.92)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    borderRadius: '12px',
                    padding: '1.1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    minWidth: 0,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                      <Camera size={16} color="#10b981" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        3. Local Repository
                      </span>
                    </div>
                    <span style={{ fontSize: '0.68rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px', flexShrink: 0 }}>
                      .git/objects
                    </span>
                  </div>

                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    Permanent, cryptographically sealed milestones
                  </div>

                  <div
                    style={{
                      padding: '0.55rem 0.65rem',
                      background: '#040711',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', minWidth: 0 }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                        <span style={{ fontFamily: 'monospace', color: '#10b981', fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {headHash}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.66rem', color: '#64748b' }}>
                        tree 7c8d9e • parent 9b1c7a
                      </span>
                    </div>

                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        background: '#2563eb',
                        color: 'white',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        flexShrink: 0,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      HEAD → {currentBranch}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.72rem', color: '#10b981', textAlign: 'center', fontWeight: 700, background: 'rgba(16, 185, 129, 0.08)', padding: '0.35rem', borderRadius: '6px' }}>
                    ✓ Indestructible Milestone Saved
                  </div>
                </div>
              </div>
            )}

            {/* THEATER 3: BRANCH & MERGE STAGE (Interactive SVG Railway Topology) */}
            {isBranchStory && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', alignItems: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '720px', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <GitBranch size={18} color="#38bdf8" />
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>
                      Branch Topology & Pointer Lineage
                    </span>
                  </div>
                  <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                    Active HEAD standing on: <strong style={{ color: '#38bdf8' }}>{currentBranch}</strong> ({headHash})
                  </span>
                </div>

                {/* SVG Branch Railway Canvas */}
                <div
                  style={{
                    background: '#040711',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    width: '100%',
                    maxWidth: '720px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                    boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.6)',
                  }}
                >
                  {/* Main Branch Track */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ width: '80px', fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace', flexShrink: 0 }}>
                      main
                    </span>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1.25rem', position: 'relative' }}>
                      <div style={{ height: '3px', background: '#2563eb', position: 'absolute', left: 0, right: 0, zIndex: 1 }} />
                      {[
                        { label: 'C1', hash: '4d9e2f3', title: 'Initial commit' },
                        { label: 'C2', hash: '9b1c7a0', title: 'Navbar update' },
                        { label: 'C3', hash: headHash, title: 'Features complete' },
                      ].map((c, idx) => (
                        <div
                          key={c.hash}
                          style={{
                            zIndex: 2,
                            background: '#070c18',
                            border: idx === 2 ? '2px solid #38bdf8' : '2px solid #2563eb',
                            boxShadow: idx === 2 ? '0 0 14px #38bdf8' : 'none',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            color: idx === 2 ? '#38bdf8' : '#cbd5e1',
                            flexShrink: 0,
                            cursor: 'pointer',
                          }}
                          title={`${c.hash}: ${c.title}`}
                        >
                          {c.label}
                        </div>
                      ))}
                      <span style={{ zIndex: 2, fontSize: '0.7rem', fontWeight: 800, background: '#2563eb', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                        HEAD → main
                      </span>
                    </div>
                  </div>

                  {/* Feature Branch Track */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ width: '80px', fontSize: '0.8rem', fontWeight: 800, color: '#c084fc', fontFamily: 'monospace', flexShrink: 0 }}>
                      feature
                    </span>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1.25rem', position: 'relative' }}>
                      <div style={{ height: '3px', background: '#a855f7', position: 'absolute', left: '70px', right: '40px', zIndex: 1 }} />
                      <div
                        style={{
                          zIndex: 2,
                          marginLeft: '70px',
                          background: '#070c18',
                          border: '2px solid #a855f7',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          color: '#c084fc',
                          flexShrink: 0,
                        }}
                      >
                        F1
                      </div>
                      <div
                        style={{
                          zIndex: 2,
                          background: '#070c18',
                          border: '2px solid #a855f7',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          color: '#c084fc',
                          flexShrink: 0,
                        }}
                      >
                        F2
                      </div>
                      <span style={{ zIndex: 2, fontSize: '0.7rem', fontWeight: 800, background: '#9333ea', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                        feature
                      </span>
                    </div>
                  </div>
                </div>

                {/* Branch Takeaway or Conflict Resolver Banner */}
                {commandId === 'conflict' ? (
                  <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid #ef4444', borderRadius: '8px', padding: '0.75rem 1rem', width: '100%', maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ef4444', fontWeight: 800, fontSize: '0.85rem' }}>
                      <AlertTriangle size={16} /> 3-Way Merge Collision Detected on line 4
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                      Both branches edited the same line after common ancestor C2. Choose resolution in the terminal or simulator!
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700, textAlign: 'center' }}>
                    ✓ Git branches are lightweight 41-byte pointer files, not heavy folder copies.
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ========================================================================= */}
        {/* MODE 2: CAUSAL ARCHITECTURE & GIT INTERNALS (Interactive Object Graph) */}
        {/* ========================================================================= */}
        {currentStageMode === 'diagram' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', maxWidth: '960px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cpu size={18} color="#38bdf8" />
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>
                  Git Internal Plumbing: Data Flow for <span style={{ color: '#38bdf8', fontFamily: 'monospace' }}>git {commandId}</span>
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Click any layer to inspect raw Git primitives
              </span>
            </div>

            {/* 4 Interactive Architecture Layers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.85rem' }}>
              {/* Layer 1: Working Copy */}
              <div
                onClick={() =>
                  setSelectedArchObject({
                    type: 'working',
                    name: 'Working Copy Filesystem',
                    content: 'Physical disk files in user directory.\nPermissions: 0644\nEncoding: UTF-8\nChanges exist only in volatile RAM/disk before git add.',
                  })
                }
                style={{
                  background: selectedArchObject.type === 'working' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(11, 18, 33, 0.92)',
                  border: selectedArchObject.type === 'working' ? '1px solid #f59e0b' : '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  boxShadow: selectedArchObject.type === 'working' ? '0 0 16px rgba(245, 158, 11, 0.25)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 800, color: '#f59e0b' }}>
                    <FileText size={15} /> 1. Working Copy
                  </div>
                  <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Disk</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Physical files on local drive</div>
                <div style={{ background: '#040711', padding: '0.45rem', borderRadius: '6px', fontSize: '0.74rem', fontFamily: 'monospace', color: '#cbd5e1' }}>
                  index.html<br />
                  style.css<br />
                  script.js
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Uncompressed bytes</div>
              </div>

              {/* Layer 2: Staging Index Cache */}
              <div
                onClick={() =>
                  setSelectedArchObject({
                    type: 'index',
                    name: '.git/index (Binary Manifest Cache)',
                    content: 'DIRC (Directory Cache) v2\nEntries (3):\n100644 blob e69de29bb2d1d64345e39d29e30d6056630005a8 0\tindex.html\n100644 blob 3f1a4e2d3c4b5a6b7c8d9e0f1a2b3c4d5e6f7a8b 0\tstyle.css\n100644 blob a3f2e1d000000000000000000000000000000000 0\tscript.js',
                  })
                }
                style={{
                  background: selectedArchObject.type === 'index' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(11, 18, 33, 0.92)',
                  border: selectedArchObject.type === 'index' ? '1px solid #38bdf8' : '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  boxShadow: selectedArchObject.type === 'index' ? '0 0 16px rgba(56, 189, 248, 0.25)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 800, color: '#38bdf8' }}>
                    <Database size={15} /> 2. Staging Index
                  </div>
                  <span style={{ fontSize: '0.65rem', color: '#64748b' }}>.git/index</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Binary path-to-SHA mapping</div>
                <div style={{ background: '#040711', padding: '0.45rem', borderRadius: '6px', fontSize: '0.74rem', fontFamily: 'monospace', color: '#38bdf8' }}>
                  100644 blob e69d...<br />
                  100644 blob 3f1a...
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Pre-computed tree cache</div>
              </div>

              {/* Layer 3: Object Store */}
              <div
                onClick={() =>
                  setSelectedArchObject({
                    type: 'commit',
                    name: '.git/objects (Immutable Object Database)',
                    content: 'Object format: type + space + size + null byte + content\nSHA-1 = sha1(header + content)\nStored with zlib deflate compression.\n\nBlobs: File payload contents only\nTrees: File permissions, type, SHA-1, filename\nCommits: Top-level Tree SHA + Parent Commit SHA + Author + Message',
                  })
                }
                style={{
                  background: selectedArchObject.type === 'commit' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(11, 18, 33, 0.92)',
                  border: selectedArchObject.type === 'commit' ? '1px solid #c084fc' : '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  boxShadow: selectedArchObject.type === 'commit' ? '0 0 16px rgba(168, 85, 247, 0.25)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 800, color: '#c084fc' }}>
                    <Layers size={15} /> 3. Object Store
                  </div>
                  <span style={{ fontSize: '0.65rem', color: '#64748b' }}>.git/objects</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Content-addressable database</div>
                <div style={{ background: '#040711', padding: '0.45rem', borderRadius: '6px', fontSize: '0.72rem', fontFamily: 'monospace', color: '#cbd5e1' }}>
                  <div>📦 <span style={{ color: '#38bdf8' }}>blob</span> (raw bytes)</div>
                  <div>🌲 <span style={{ color: '#10b981' }}>tree</span> (directory)</div>
                  <div>📸 <span style={{ color: '#f59e0b' }}>commit</span> (milestone)</div>
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Keyed by 160-bit SHA-1</div>
              </div>

              {/* Layer 4: References & HEAD */}
              <div
                onClick={() =>
                  setSelectedArchObject({
                    type: 'ref',
                    name: '.git/refs/heads/ & HEAD',
                    content: `cat .git/HEAD\nref: refs/heads/${currentBranch}\n\ncat .git/refs/heads/${currentBranch}\n${headHash}000000000000000000000000000000000\n\nA branch is simply a 41-byte text file containing the SHA-1 of its latest commit!`,
                  })
                }
                style={{
                  background: selectedArchObject.type === 'ref' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(11, 18, 33, 0.92)',
                  border: selectedArchObject.type === 'ref' ? '1px solid #10b981' : '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  boxShadow: selectedArchObject.type === 'ref' ? '0 0 16px rgba(16, 185, 129, 0.25)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 800, color: '#10b981' }}>
                    <GitBranch size={15} /> 4. Refs & HEAD
                  </div>
                  <span style={{ fontSize: '0.65rem', color: '#64748b' }}>.git/refs</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Movable text pointer files</div>
                <div style={{ background: '#040711', padding: '0.45rem', borderRadius: '6px', fontSize: '0.74rem', fontFamily: 'monospace', color: '#10b981' }}>
                  HEAD ➔ refs/heads/{currentBranch}<br />
                  {currentBranch} ➔ {headHash}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>41-byte text files</div>
              </div>
            </div>

            {/* Interactive Inspector Terminal Drawer */}
            <div style={{ background: '#040711', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace' }}>
                  $ git cat-file -p {selectedArchObject.hash || selectedArchObject.name}
                </span>
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Live Git Object Inspection</span>
              </div>
              <pre style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1', fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: 1.5, background: 'rgba(255, 255, 255, 0.02)', padding: '0.6rem', borderRadius: '6px' }}>
                {selectedArchObject.content}
              </pre>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE 3: GIT TREE DAG (Interactive SVG Commit Network & Lineage) */}
        {/* ========================================================================= */}
        {currentStageMode === 'tree' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', maxWidth: '960px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GitGraph size={18} color="#38bdf8" />
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>
                  Commit Directed Acyclic Graph (DAG) & Branch Pointers
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                Click any commit to inspect snapshot tree
              </div>
            </div>

            {/* Split layout: SVG DAG on Left, Commit Inspector Card on Right */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.4fr) minmax(240px, 1fr)', gap: '1rem' }}>
              {/* Left: Commit Nodes Timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {displayCommits.map((c, idx) => {
                  const isHead = c.hash.startsWith(headHash) || idx === displayCommits.length - 1;
                  const isSelected = activeDagCommit.hash === c.hash;

                  return (
                    <div
                      key={c.hash}
                      onClick={() => setSelectedDagCommit(c as Commit)}
                      style={{
                        background: isSelected ? 'rgba(37, 99, 235, 0.2)' : 'rgba(11, 18, 33, 0.92)',
                        border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '10px',
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        cursor: 'pointer',
                        boxShadow: isSelected ? '0 0 16px rgba(56, 189, 248, 0.25)' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: isHead ? '#38bdf8' : '#1e293b',
                            color: isHead ? '#070c18' : '#94a3b8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 900,
                            flexShrink: 0,
                          }}
                        >
                          C{idx + 1}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontFamily: 'monospace', fontWeight: 800, color: isHead ? '#38bdf8' : '#f8fafc', fontSize: '0.84rem' }}>
                              {c.shortHash || c.hash.slice(0, 7)}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {c.message}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                            {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {c.author}
                          </span>
                        </div>
                      </div>

                      {/* Labels / Pointers */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
                        {isHead && (
                          <>
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#2563eb', color: 'white', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                              {currentBranch}
                            </span>
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#059669', color: 'white', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                              HEAD
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right: Active Commit Snapshot Inspector */}
              <div
                style={{
                  background: '#040711',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8' }}>
                  <Shield size={16} /> Selected Commit Milestone
                </div>

                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc' }}>
                  {activeDagCommit.message}
                </div>

                <div style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div>
                    <strong style={{ color: '#cbd5e1' }}>Commit SHA:</strong> <code style={{ color: '#38bdf8' }}>{activeDagCommit.hash.slice(0, 16)}...</code>
                  </div>
                  <div>
                    <strong style={{ color: '#cbd5e1' }}>Parent SHA:</strong> <code style={{ color: '#94a3b8' }}>{activeDagCommit.parents[0]?.slice(0, 7) || 'None (root commit)'}</code>
                  </div>
                  <div>
                    <strong style={{ color: '#cbd5e1' }}>Author:</strong> {activeDagCommit.author}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', marginBottom: '0.35rem' }}>
                    SNAPSHOT FILES ({Object.keys(activeDagCommit.files || {}).length}):
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {Object.keys(activeDagCommit.files || {}).map((fileName) => (
                      <div
                        key={fileName}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          padding: '0.3rem 0.55rem',
                          borderRadius: '4px',
                          fontSize: '0.74rem',
                          fontFamily: 'monospace',
                          color: '#cbd5e1',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>📄 {fileName}</span>
                        <span style={{ color: '#64748b' }}>{(activeDagCommit.files as Record<string, string>)?.[fileName]?.length || 0} bytes</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SCRUBBER CONTROLS BAR (Clean, non-colliding, with Inspection triggers) */}
      {/* ========================================================================= */}
      {currentStageMode === 'animation' && (
        <div
          style={{
            background: '#040711',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '0.85rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}
        >
          {/* Scrubber Pipeline */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', width: '100%' }}>
            <div
              style={{
                position: 'absolute',
                top: '14px',
                left: '15px',
                right: '15px',
                height: '2px',
                background: 'rgba(255, 255, 255, 0.1)',
                zIndex: 1,
              }}
            />

            {story.steps.map((s, idx) => {
              const isPassed = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div
                  key={s.id}
                  onClick={() => handleStepClick(idx)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer',
                    zIndex: 2,
                    position: 'relative',
                  }}
                  title={s.title}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: isCurrent ? '#38bdf8' : isPassed ? '#10b981' : '#1e293b',
                      border: isCurrent ? '2px solid #ffffff' : '2px solid rgba(255, 255, 255, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isCurrent ? '0 0 14px #38bdf8' : 'none',
                      transition: 'all 0.2s ease',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: isCurrent ? '#070c18' : isPassed ? '#ffffff' : '#94a3b8',
                    }}
                  >
                    {isPassed ? <CheckCircle2 size={13} color="#ffffff" /> : idx + 1}
                  </div>

                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: isCurrent ? 800 : 500,
                      color: isCurrent ? '#38bdf8' : isPassed ? '#94a3b8' : '#64748b',
                      maxWidth: '85px',
                      textAlign: 'center',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {s.label.replace(/^\d+\.\s*/, '')}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Playback Controls & Inspection Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              paddingTop: '0.75rem',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}
          >
            {/* Left: Play / Pause / Replay / Speed */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
                }}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} fill="white" />}
              </button>

              <button
                onClick={handleReplay}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#cbd5e1',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '0.35rem 0.7rem',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <RotateCcw size={12} /> Replay
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', background: '#070c18', padding: '0.15rem', borderRadius: '4px' }}>
                {[0.5, 1, 1.5, 2].map((sp) => (
                  <button
                    key={sp}
                    onClick={() => setPlaybackSpeed(sp)}
                    style={{
                      background: playbackSpeed === sp ? '#38bdf8' : 'transparent',
                      color: playbackSpeed === sp ? '#070c18' : '#64748b',
                      border: 'none',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '3px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    {sp}x
                  </button>
                ))}
              </div>
            </div>

            {/* Center: Active Caption Badge */}
            <div
              style={{
                flex: 1,
                minWidth: '200px',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '8px',
                padding: '0.35rem 0.65rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: '#38bdf8',
                  background: 'rgba(56, 189, 248, 0.15)',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  flexShrink: 0,
                }}
              >
                Step {currentStepIndex + 1}/{totalSteps}
              </span>
              <span
                style={{
                  fontSize: '0.76rem',
                  color: '#f8fafc',
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {activeStep.title}
              </span>
            </div>

            {/* Right: Inspection Triggers */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
              <button
                onClick={() => setShowGitKnowsModal(true)}
                style={{
                  background: 'rgba(56, 189, 248, 0.1)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '6px',
                  padding: '0.3rem 0.6rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                🧠 What does Git know?
              </button>

              <button
                onClick={() => setShowWhyModal(true)}
                style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  color: '#f59e0b',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '6px',
                  padding: '0.3rem 0.6rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  whiteSpace: 'nowrap',
                }}
              >
                <HelpCircle size={12} /> Why?
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showGitKnowsModal && (
        <GitKnowsModal repo={repo} onClose={() => setShowGitKnowsModal(false)} />
      )}

      {showWhyModal && (
        <WhyDidGitDoThatModal
          currentStep={activeStep}
          stateDelta={stateDelta}
          onClose={() => setShowWhyModal(false)}
        />
      )}
    </div>
  );
};
