import React, { useState, useEffect, useRef } from 'react';
import { GitRepo } from '../../git-engine/types';
import { calculateGitStateDiff, GitStateDelta } from './stateDiff';
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
  Network,
  Cpu,
  GitGraph,
  Info,
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
}) => {
  const story = getCausalStory(commandId, repo);

  // Active stage mode (sync with parent prop)
  const [currentStageMode, setCurrentStageMode] = useState<StageMode>(stageMode);

  useEffect(() => {
    if (stageMode) {
      setCurrentStageMode(stageMode);
    }
  }, [stageMode]);

  // Playback state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Modals
  const [showGitKnowsModal, setShowGitKnowsModal] = useState(false);
  const [showWhyModal, setShowWhyModal] = useState(false);

  // State diffing
  const [beforeSnapshot] = useState<GitRepo>(repo);
  const [stateDelta, setStateDelta] = useState<GitStateDelta | null>(null);

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

  useEffect(() => {
    const diff = calculateGitStateDiff(beforeSnapshot, repo);
    setStateDelta(diff);
  }, [repo, beforeSnapshot]);

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

  // Commits list from real repository
  const commitList = Object.values(repo.commits);
  const displayCommits = commitList.length > 0
    ? commitList.slice(-4)
    : [
        { hash: '4d9e2f3a', message: 'Initial commit', author: 'Dev <dev@commitforge.io>', parents: [] },
        { hash: '9b1c7a0e', message: 'Add core features', author: 'Dev <dev@commitforge.io>', parents: ['4d9e2f3a'] },
        { hash: headHash, message: 'Current work in progress', author: 'Dev <dev@commitforge.io>', parents: ['9b1c7a0e'] },
      ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        background: '#0a0f1d',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '16px',
        padding: '1.25rem',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5)',
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
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#38bdf8',
              boxShadow: '0 0 10px #38bdf8',
            }}
          />
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f8fafc' }}>
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
            }}
          >
            Live Engine
          </span>
        </div>

        {/* Mode Selector Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: '#070c18',
            padding: '0.25rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <button
            onClick={() => setCurrentStageMode('animation')}
            style={{
              background: currentStageMode === 'animation' ? '#2563eb' : 'transparent',
              color: currentStageMode === 'animation' ? '#ffffff' : '#94a3b8',
              border: 'none',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s ease',
            }}
          >
            <Play size={13} fill={currentStageMode === 'animation' ? 'white' : 'none'} />
            Animation Flow
          </button>

          <button
            onClick={() => setCurrentStageMode('diagram')}
            style={{
              background: currentStageMode === 'diagram' ? '#2563eb' : 'transparent',
              color: currentStageMode === 'diagram' ? '#ffffff' : '#94a3b8',
              border: 'none',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s ease',
            }}
          >
            <Layers size={13} />
            Architecture
          </button>

          <button
            onClick={() => setCurrentStageMode('tree')}
            style={{
              background: currentStageMode === 'tree' ? '#2563eb' : 'transparent',
              color: currentStageMode === 'tree' ? '#ffffff' : '#94a3b8',
              border: 'none',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s ease',
            }}
          >
            <GitGraph size={13} />
            Git Tree DAG
          </button>
        </div>
      </div>

      {/* Visual Canvas Stage */}
      <div
        style={{
          background: 'radial-gradient(ellipse at 50% 25%, #152442 0%, #0a1122 100%)',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '1.5rem',
          minHeight: '340px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.6)',
        }}
      >
        {/* ========================================================================= */}
        {/* MODE 1: ANIMATION FLOW (3 THEATERS) */}
        {/* ========================================================================= */}
        {currentStageMode === 'animation' && (
          <>
            {/* THEATER 1: REMOTE PUSH / PULL */}
            {isRemoteStory && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
                {/* Top Grid: Your Computer Laptop + Flow Channel + Remote GitHub Cloud */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(220px, 1fr) auto minmax(220px, 1fr)',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                  className="theater-nodes-grid"
                >
                  {/* Node 1: Your Computer */}
                  <div
                    style={{
                      background: 'rgba(15, 23, 42, 0.85)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      borderRadius: '12px',
                      padding: '1rem',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      minWidth: 0,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                        <Laptop size={17} color="#38bdf8" style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          Your Computer
                        </span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8', background: 'rgba(255, 255, 255, 0.06)', padding: '0.15rem 0.4rem', borderRadius: '4px', flexShrink: 0 }}>
                        📁 project
                      </span>
                    </div>

                    <div style={{ background: '#070b16', borderRadius: '8px', padding: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                        Local Repository
                      </div>

                      {/* C3 */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                          fontSize: '0.8rem',
                          padding: '0.35rem 0.55rem',
                          borderRadius: '6px',
                          background: currentStepIndex >= 4 ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                          border: currentStepIndex >= 4 ? '1px solid #38bdf8' : '1px solid transparent',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#38bdf8', flexShrink: 0 }} />
                          <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#38bdf8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {headHash}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#ffffff', background: '#2563eb', padding: '0.1rem 0.35rem', borderRadius: '4px', flexShrink: 0, whiteSpace: 'nowrap' }}>
                          HEAD → {currentBranch}
                        </span>
                      </div>

                      {/* C2 */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.78rem', padding: '0.25rem 0.55rem', color: '#94a3b8' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#64748b', flexShrink: 0 }} />
                          <span style={{ fontFamily: 'monospace' }}>9b1c7a0</span>
                        </div>
                        <span style={{ fontSize: '0.7rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          Add contact page
                        </span>
                      </div>

                      {/* C1 */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.78rem', padding: '0.25rem 0.55rem', color: '#64748b' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#475569', flexShrink: 0 }} />
                          <span style={{ fontFamily: 'monospace' }}>4d9e2f3</span>
                        </div>
                        <span style={{ fontSize: '0.7rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          Initial commit
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Transit Highway */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '0 0.25rem' }}>
                    <div
                      style={{
                        background: '#080d1a',
                        border: '1px solid #38bdf8',
                        borderRadius: '8px',
                        padding: '0.35rem 0.75rem',
                        textAlign: 'center',
                        boxShadow: '0 2px 10px rgba(56, 189, 248, 0.25)',
                      }}
                    >
                      <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.82rem', color: '#38bdf8' }}>
                        git {commandId}
                      </div>
                      <div style={{ fontSize: '0.66rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                        Syncs local & remote
                      </div>
                    </div>

                    <div
                      style={{
                        width: '100px',
                        height: '4px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        position: 'relative',
                        borderRadius: '2px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          height: '100%',
                          width: '40px',
                          background: 'linear-gradient(90deg, transparent, #38bdf8, transparent)',
                          transform: `translateX(${(currentStepIndex / Math.max(1, totalSteps - 1)) * 80}px)`,
                          transition: 'transform 0.4s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* Node 2: GitHub Cloud */}
                  <div
                    style={{
                      background: 'rgba(15, 23, 42, 0.85)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '12px',
                      padding: '1rem',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      minWidth: 0,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                        <Cloud size={17} color="#10b981" style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          GitHub Remote (origin)
                        </span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.15rem 0.4rem', borderRadius: '4px', flexShrink: 0 }}>
                        ☁️ Cloud
                      </span>
                    </div>

                    <div style={{ background: '#070b16', borderRadius: '8px', padding: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                        Remote Repository
                      </div>

                      {/* Remote C3 */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                          fontSize: '0.8rem',
                          padding: '0.35rem 0.55rem',
                          borderRadius: '6px',
                          background: currentStepIndex >= 5 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                          border: currentStepIndex >= 5 ? '1px solid #10b981' : '1px solid transparent',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: currentStepIndex >= 5 ? '#10b981' : '#64748b', flexShrink: 0 }} />
                          <span style={{ fontFamily: 'monospace', fontWeight: 800, color: currentStepIndex >= 5 ? '#10b981' : '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {currentStepIndex >= 5 ? headHash : remoteHash}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#ffffff', background: '#059669', padding: '0.1rem 0.35rem', borderRadius: '4px', flexShrink: 0, whiteSpace: 'nowrap' }}>
                          origin/{currentBranch}
                        </span>
                      </div>

                      {/* Remote C2 */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.78rem', padding: '0.25rem 0.55rem', color: '#94a3b8' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#64748b', flexShrink: 0 }} />
                          <span style={{ fontFamily: 'monospace' }}>9b1c7a0</span>
                        </div>
                        <span style={{ fontSize: '0.7rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          Add contact page
                        </span>
                      </div>

                      {/* Remote C1 */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.78rem', padding: '0.25rem 0.55rem', color: '#64748b' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#475569', flexShrink: 0 }} />
                          <span style={{ fontFamily: 'monospace' }}>4d9e2f3</span>
                        </div>
                        <span style={{ fontSize: '0.7rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          Initial commit
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Collaboration Network Map */}
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 800 }}>
                      You
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Author</span>
                  </div>

                  <div style={{ width: '20px', height: '2px', background: currentStepIndex >= 5 ? '#10b981' : 'rgba(255, 255, 255, 0.1)' }} />

                  <div
                    style={{
                      background: currentStepIndex >= 5 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${currentStepIndex >= 5 ? '#10b981' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '999px',
                      padding: '0.3rem 0.85rem',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: currentStepIndex >= 5 ? '#10b981' : '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <CheckCircle2 size={13} />
                    {currentStepIndex >= 5 ? 'Now synced across the team!' : 'Commits private until pushed to remote'}
                  </div>

                  <div style={{ width: '20px', height: '2px', background: currentStepIndex >= 5 ? '#10b981' : 'rgba(255, 255, 255, 0.1)' }} />

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#10b981', color: '#062016', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 800 }}>
                      T1
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Teammate</span>
                  </div>
                </div>
              </div>
            )}

            {/* THEATER 2: THREE-AREA STAGE (init, status, add, commit, log) */}
            {isThreeAreaStory && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(200px, 1fr) auto minmax(200px, 1fr) auto minmax(200px, 1fr)',
                  alignItems: 'center',
                  gap: '0.85rem',
                  width: '100%',
                }}
                className="three-area-stage-grid"
              >
                {/* Area 1: Working Tree (Desk) */}
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                    minWidth: 0,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FileText size={16} color="#f59e0b" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      1. Working Tree (Desk)
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Where you draft and edit code</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {['index.html', 'style.css', 'script.js'].map((f) => (
                      <div
                        key={f}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                          padding: '0.35rem 0.55rem',
                          background: '#090e1a',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'monospace',
                            color: '#cbd5e1',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            minWidth: 0,
                            flex: 1,
                          }}
                        >
                          {f}
                        </span>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            color: '#f59e0b',
                            flexShrink: 0,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {commandId === 'add' && f === 'index.html' ? 'EDITED' : 'UNTRACKED'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transit Arrow 1 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', padding: '0 0.2rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                    git add
                  </span>
                  <span style={{ color: '#38bdf8', fontSize: '1.2rem', fontWeight: 900 }}>➔</span>
                </div>

                {/* Area 2: Staging Area (Packing Box) */}
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: isStaged || commandId === 'add' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                    boxShadow: isStaged || commandId === 'add' ? '0 0 15px rgba(56, 189, 248, 0.2)' : 'none',
                    minWidth: 0,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Database size={16} color="#38bdf8" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      2. Staging Area (Box)
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Prepared for next snapshot</div>
                  <div
                    style={{
                      padding: '0.45rem 0.55rem',
                      background: '#090e1a',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'monospace',
                        color: '#38bdf8',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      index.html
                    </span>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        color: '#38bdf8',
                        flexShrink: 0,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      STAGED
                    </span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 700, textAlign: 'center' }}>
                    ⚠️ Not sealed in commit yet
                  </div>
                </div>

                {/* Transit Arrow 2 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', padding: '0 0.2rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                    git commit
                  </span>
                  <span style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: 900 }}>➔</span>
                </div>

                {/* Area 3: Local Repository (Milestones) */}
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                    minWidth: 0,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Camera size={16} color="#10b981" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      3. Local Repository
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Permanent sealed milestones</div>
                  <div
                    style={{
                      padding: '0.45rem 0.55rem',
                      background: '#090e1a',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', minWidth: 0 }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                      <span style={{ fontFamily: 'monospace', color: '#10b981', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {headHash}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        background: '#2563eb',
                        color: 'white',
                        padding: '0.1rem 0.35rem',
                        borderRadius: '4px',
                        flexShrink: 0,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      HEAD → {currentBranch}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#10b981', textAlign: 'center', fontWeight: 700 }}>
                    ✓ Indestructible Savepoint
                  </div>
                </div>
              </div>
            )}

            {/* THEATER 3: BRANCH & MERGE STAGE */}
            {isBranchStory && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', alignItems: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '680px', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <GitBranch size={18} color="#38bdf8" />
                    <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc' }}>
                      Branch Topology & Pointer Lineage
                    </span>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    HEAD stands on: <strong style={{ color: '#38bdf8' }}>{currentBranch}</strong>
                  </span>
                </div>

                {/* Branch Tracks */}
                <div style={{ background: '#070c18', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem', width: '100%', maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Main Track */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ width: '70px', fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace', flexShrink: 0 }}>
                      main
                    </span>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
                      <div style={{ height: '3px', background: '#2563eb', position: 'absolute', left: 0, right: 0 }} />
                      {['4d9e2f3', '9b1c7a0', headHash].map((c, idx) => (
                        <div key={idx} style={{ zIndex: 2, background: '#070c18', border: '2px solid #38bdf8', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, color: '#38bdf8', flexShrink: 0 }}>
                          C{idx + 1}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Feature Track */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ width: '70px', fontSize: '0.78rem', fontWeight: 800, color: '#a855f7', fontFamily: 'monospace', flexShrink: 0 }}>
                      feature
                    </span>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
                      <div style={{ height: '3px', background: '#a855f7', position: 'absolute', left: '40px', right: 0 }} />
                      <div style={{ zIndex: 2, marginLeft: '50px', background: '#070c18', border: '2px solid #a855f7', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, color: '#c084fc', flexShrink: 0 }}>
                        F1
                      </div>
                      <div style={{ zIndex: 2, background: '#070c18', border: '2px solid #a855f7', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, color: '#c084fc', flexShrink: 0 }}>
                        F2
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700, textAlign: 'center' }}>
                  {commandId === 'conflict'
                    ? '⚡ Colliding lines detected on line 4. Resolve in the simulator!'
                    : '✓ A branch is an isolated pointer label, not a duplicate folder.'}
                </div>
              </div>
            )}
          </>
        )}

        {/* ========================================================================= */}
        {/* MODE 2: CAUSAL ARCHITECTURE & GIT INTERNALS DIAGRAM */}
        {/* ========================================================================= */}
        {currentStageMode === 'diagram' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cpu size={18} color="#38bdf8" />
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>
                  Git Internal Plumbing: Data Flow for <span style={{ color: '#38bdf8', fontFamily: 'monospace' }}>git {commandId}</span>
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Content-Addressable Object Store (.git)
              </span>
            </div>

            {/* 4 Architecture Layers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem' }}>
              {/* Layer 1: Working Directory */}
              <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 800, color: '#f59e0b' }}>
                  <FileText size={15} /> 1. Working Copy
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Real files on your disk</div>
                <div style={{ background: '#080d1a', padding: '0.45rem', borderRadius: '6px', fontSize: '0.74rem', fontFamily: 'monospace', color: '#cbd5e1' }}>
                  index.html<br />
                  style.css<br />
                  script.js
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Raw UTF-8 text</div>
              </div>

              {/* Layer 2: Index Cache */}
              <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '10px', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 800, color: '#38bdf8' }}>
                  <Database size={15} /> 2. Staging Index
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>.git/index (Binary manifest)</div>
                <div style={{ background: '#080d1a', padding: '0.45rem', borderRadius: '6px', fontSize: '0.74rem', fontFamily: 'monospace', color: '#38bdf8' }}>
                  100644 blob e69d<br />
                  100644 blob 3f1a
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Path ➔ Blob SHA map</div>
              </div>

              {/* Layer 3: Object Database */}
              <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '10px', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 800, color: '#c084fc' }}>
                  <Layers size={15} /> 3. Object Store
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>.git/objects (Immutable)</div>
                <div style={{ background: '#080d1a', padding: '0.45rem', borderRadius: '6px', fontSize: '0.72rem', fontFamily: 'monospace', color: '#cbd5e1' }}>
                  <div>📦 <span style={{ color: '#38bdf8' }}>blob</span> (file bytes)</div>
                  <div>🌲 <span style={{ color: '#10b981' }}>tree</span> (directory)</div>
                  <div>📸 <span style={{ color: '#f59e0b' }}>commit</span> (milestone)</div>
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Keyed by SHA-1 hash</div>
              </div>

              {/* Layer 4: References */}
              <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 800, color: '#10b981' }}>
                  <GitBranch size={15} /> 4. References & HEAD
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>.git/refs/heads/ & HEAD</div>
                <div style={{ background: '#080d1a', padding: '0.45rem', borderRadius: '6px', fontSize: '0.74rem', fontFamily: 'monospace', color: '#10b981' }}>
                  HEAD ➔ refs/heads/{currentBranch}<br />
                  main ➔ {headHash}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Movable 41-byte pointers</div>
              </div>
            </div>

            {/* Architecture Takeaway Card */}
            <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Info size={16} color="#38bdf8" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                <strong>How <code style={{ color: '#38bdf8' }}>git {commandId}</code> works under the hood:</strong> Reads your Working Copy or Index, writes immutable zlib-compressed objects to <code style={{ color: '#38bdf8' }}>.git/objects/</code>, and safely updates the reference in <code style={{ color: '#38bdf8' }}>.git/refs/</code>.
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE 3: GIT TREE & COMMIT DAG GRAPH */}
        {/* ========================================================================= */}
        {currentStageMode === 'tree' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', maxWidth: '850px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GitGraph size={18} color="#38bdf8" />
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>
                  Commit Directed Acyclic Graph (DAG)
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                Total Commits: <strong style={{ color: '#38bdf8' }}>{displayCommits.length}</strong>
              </div>
            </div>

            {/* Visual Commit Nodes Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {displayCommits.map((c, idx) => {
                const isHead = c.hash.startsWith(headHash) || idx === displayCommits.length - 1;
                return (
                  <div
                    key={c.hash}
                    style={{
                      background: isHead ? 'rgba(37, 99, 235, 0.15)' : 'rgba(15, 23, 42, 0.85)',
                      border: isHead ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      boxShadow: isHead ? '0 0 16px rgba(56, 189, 248, 0.2)' : 'none',
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
                            {c.hash.slice(0, 7)}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {c.message}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                          Parent: {c.parents?.[0]?.slice(0, 7) || 'root (none)'} • {c.author}
                        </span>
                      </div>
                    </div>

                    {/* Labels / Pointers */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
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
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SCRUBBER CONTROLS BAR (Clean, non-colliding, with Inspection triggers) */}
      {/* ========================================================================= */}
      {currentStageMode === 'animation' && (
        <div
          style={{
            background: '#0e172a',
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
