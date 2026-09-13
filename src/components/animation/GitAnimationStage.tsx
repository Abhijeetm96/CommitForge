import React, { useState, useEffect, useRef } from 'react';
import { GitRepo } from '../../git-engine/types';
import { deriveVisualSnapshot, GitVisualSnapshot } from './gitPhysics';
import { calculateGitStateDiff, GitStateDelta } from './stateDiff';
import { CausalCommandStory, CausalAnimationStep, ViewLevel, StageMode, TimeState } from './types';
import { getCausalStory } from './causalStories';
import { GitKnowsModal } from './GitKnowsModal';
import { WhyDidGitDoThatModal } from './WhyDidGitDoThatModal';
import { InteractiveSimulator } from './InteractiveSimulator';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Info,
  HelpCircle,
  Eye,
  Laptop,
  Cloud,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Database,
  GitBranch,
} from 'lucide-react';

interface GitAnimationStageProps {
  commandId?: string;
  repo: GitRepo;
  onExecuteCommand: (cmd: string) => void;
  onUpdateFileContent?: (path: string, content: string) => void;
}

export const GitAnimationStage: React.FC<GitAnimationStageProps> = ({
  commandId = 'push',
  repo,
  onExecuteCommand,
  onUpdateFileContent,
}) => {
  const story = getCausalStory(commandId, repo);

  // Animation Playback States
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [stageMode, setStageMode] = useState<StageMode>('animation');
  const [timeState, setTimeState] = useState<TimeState>('during');
  const [viewLevel, setViewLevel] = useState<ViewLevel>('git-user');
  const [highlightOnlyChanged, setHighlightOnlyChanged] = useState(false);

  // Modals
  const [showGitKnowsModal, setShowGitKnowsModal] = useState(false);
  const [showWhyModal, setShowWhyModal] = useState(false);

  // Prediction State
  const [predictionSelected, setPredictionSelected] = useState<number | null>(null);
  const [predictionSubmitted, setPredictionSubmitted] = useState(false);
  const [showPredictionHint, setShowPredictionHint] = useState(false);

  // Track state snapshot for diffing
  const [beforeSnapshot, setBeforeSnapshot] = useState<GitRepo>(repo);
  const [stateDelta, setStateDelta] = useState<GitStateDelta | null>(null);

  const timerRef = useRef<any>(null);

  const activeStep: CausalAnimationStep = story.steps[currentStepIndex] || story.steps[0];
  const totalSteps = story.steps.length;

  // Auto-play progression
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // If active step has prediction and user hasn't submitted yet, PAUSE automatically!
    if (activeStep.prediction && !predictionSubmitted) {
      setIsPlaying(false);
      return;
    }

    const stepInterval = Math.round(3500 / playbackSpeed);

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
  }, [isPlaying, currentStepIndex, totalSteps, playbackSpeed, activeStep, predictionSubmitted]);

  // Compute state diff when repo changes
  useEffect(() => {
    const diff = calculateGitStateDiff(beforeSnapshot, repo);
    setStateDelta(diff);
  }, [repo, beforeSnapshot]);

  const handleReplay = () => {
    setCurrentStepIndex(0);
    setPredictionSelected(null);
    setPredictionSubmitted(false);
    setShowPredictionHint(false);
    setIsPlaying(true);
  };

  const handleStepClick = (index: number) => {
    setCurrentStepIndex(index);
    setIsPlaying(false);
  };

  const handlePredictionAnswer = (index: number) => {
    setPredictionSelected(index);
    if (activeStep.prediction && index === activeStep.prediction.options.length - 1) {
      // User picked "I'm not sure" -> show friendly hint, zero penalty!
      setShowPredictionHint(true);
    } else {
      setPredictionSubmitted(true);
      setShowPredictionHint(false);
      // Resume playback after short delay
      setTimeout(() => setIsPlaying(true), 1200);
    }
  };

  const currentBranch = repo.head.type === 'branch' ? repo.head.ref : 'main';
  const headHash = repo.branches[currentBranch]?.targetCommitHash?.slice(0, 7) || 'a3f2e1d';
  const remoteCommitHash = repo.remotes['origin']?.branches[currentBranch]?.targetCommitHash?.slice(0, 7) || '9b1c7a0';
  const isInSync = headHash === remoteCommitHash;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        background: '#090f1d',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1.25rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.45)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Controls Bar: View Mode Switcher, Complexity Levels, & Inspection Badges */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          paddingBottom: '0.85rem',
        }}
      >
        {/* Left: View Mode Pills (Animation / Diagram / Real View) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#0e172a', padding: '0.25rem', borderRadius: '8px' }}>
          <button
            onClick={() => setStageMode('animation')}
            style={{
              background: stageMode === 'animation' ? '#2563eb' : 'transparent',
              color: stageMode === 'animation' ? '#ffffff' : '#94a3b8',
              border: 'none',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s ease',
            }}
          >
            <Play size={13} fill={stageMode === 'animation' ? '#ffffff' : 'none'} />
            Animation
          </button>
          <button
            onClick={() => setStageMode('diagram')}
            style={{
              background: stageMode === 'diagram' ? '#2563eb' : 'transparent',
              color: stageMode === 'diagram' ? '#ffffff' : '#94a3b8',
              border: 'none',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Layers size={13} />
            Diagram
          </button>
          <button
            onClick={() => setStageMode('real')}
            style={{
              background: stageMode === 'real' ? '#2563eb' : 'transparent',
              color: stageMode === 'real' ? '#ffffff' : '#94a3b8',
              border: 'none',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Database size={13} />
            Real View
          </button>
        </div>

        {/* Center: State Freeze Pills (Before / During / After) & What Changed Highlight */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ display: 'flex', background: '#0e172a', padding: '0.2rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            {(['before', 'during', 'after'] as const).map((ts) => (
              <button
                key={ts}
                onClick={() => {
                  setTimeState(ts);
                  if (ts === 'before') setCurrentStepIndex(0);
                  if (ts === 'after') setCurrentStepIndex(totalSteps - 1);
                  setIsPlaying(false);
                }}
                style={{
                  background: timeState === ts ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                  color: timeState === ts ? '#38bdf8' : '#64748b',
                  border: 'none',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                }}
              >
                {ts}
              </button>
            ))}
          </div>

          <button
            onClick={() => setHighlightOnlyChanged(!highlightOnlyChanged)}
            style={{
              background: highlightOnlyChanged ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: highlightOnlyChanged ? '#10b981' : '#94a3b8',
              border: `1px solid ${highlightOnlyChanged ? '#10b981' : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: '6px',
              padding: '0.3rem 0.65rem',
              fontSize: '0.74rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <Sparkles size={13} />
            What Changed?
          </button>
        </div>

        {/* Right: Knowledge & Reasoning Triggers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setShowGitKnowsModal(true)}
            style={{
              background: 'rgba(56, 189, 248, 0.12)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '6px',
              padding: '0.3rem 0.65rem',
              fontSize: '0.74rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            🧠 What does Git know?
          </button>

          <button
            onClick={() => setShowWhyModal(true)}
            style={{
              background: 'rgba(245, 158, 11, 0.12)',
              color: '#f59e0b',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '6px',
              padding: '0.3rem 0.65rem',
              fontSize: '0.74rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <HelpCircle size={13} /> Why did Git do that?
          </button>
        </div>
      </div>

      {/* Main Canvas Theater (Rendered dynamically based on stageMode and command) */}
      <div
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, #15233d 0%, #0c1424 100%)',
          borderRadius: '12px',
          border: '1px solid rgba(56, 189, 248, 0.15)',
          padding: '2rem 1.5rem',
          position: 'relative',
          minHeight: '340px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.5)',
        }}
        className="animation-theater-canvas"
      >
        {/* PUSH THEATER (Matching Reference Mockup media_1789287463226.jpg) */}
        {commandId === 'push' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
            {/* Top Row: Local Laptop + Transfer Lane + GitHub Cloud */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(260px, 1fr) auto minmax(260px, 1fr)',
                alignItems: 'center',
                gap: '1.5rem',
              }}
              className="theater-nodes-grid"
            >
              {/* Node 1: Your Computer (Laptop & Local Repo Card) */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: highlightOnlyChanged ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  backdropFilter: 'blur(6px)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Laptop size={18} color="#38bdf8" />
                    <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc' }}>
                      Your Computer
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#94a3b8',
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                    }}
                  >
                    📁 my-website
                  </span>
                </div>

                {/* Local Repository Commit Stack */}
                <div
                  style={{
                    background: '#0a0f1d',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                    Local Repository
                  </div>

                  {/* C3 (HEAD -> main) */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.82rem',
                      padding: '0.4rem 0.6rem',
                      borderRadius: '6px',
                      background: activeStep.phase === 'change' || currentStepIndex >= 4 ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                      border: activeStep.phase === 'change' || currentStepIndex >= 4 ? '1px solid #38bdf8' : '1px solid transparent',
                      boxShadow: activeStep.phase === 'change' ? '0 0 12px rgba(56, 189, 248, 0.4)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} />
                      <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#38bdf8' }}>
                        {headHash}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f8fafc', background: '#2563eb', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                      HEAD → {currentBranch}
                    </span>
                  </div>

                  {/* C2 */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.8rem',
                      padding: '0.35rem 0.6rem',
                      color: '#94a3b8',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#64748b' }} />
                      <span style={{ fontFamily: 'monospace' }}>9b1c7a0</span>
                    </div>
                    <span style={{ fontSize: '0.72rem' }}>Add contact page</span>
                  </div>

                  {/* C1 */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.8rem',
                      padding: '0.35rem 0.6rem',
                      color: '#64748b',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#475569' }} />
                      <span style={{ fontFamily: 'monospace' }}>4d9e2f3</span>
                    </div>
                    <span style={{ fontSize: '0.72rem' }}>Initial commit</span>
                  </div>
                </div>
              </div>

              {/* Transit Highway / Flow Channel */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0 0.5rem',
                  position: 'relative',
                }}
              >
                {/* Command Action Pill */}
                <div
                  style={{
                    background: '#090e1a',
                    border: '1px solid #38bdf8',
                    borderRadius: '8px',
                    padding: '0.45rem 0.85rem',
                    textAlign: 'center',
                    boxShadow: '0 4px 14px rgba(56, 189, 248, 0.25)',
                  }}
                >
                  <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.85rem', color: '#38bdf8' }}>
                    git push
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                    Sends commits & objects
                  </div>
                </div>

                {/* Animated Flying Packet Stream */}
                <div
                  style={{
                    width: '120px',
                    height: '6px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '999px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {(activeStep.phase === 'change' || currentStepIndex >= 4) && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        height: '100%',
                        width: '35%',
                        background: 'linear-gradient(90deg, #38bdf8, #60a5fa)',
                        borderRadius: '999px',
                        boxShadow: '0 0 10px #38bdf8',
                        animation: 'packetStream 1.2s infinite ease-in-out',
                      }}
                    />
                  )}
                </div>

                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: currentStepIndex >= 6 ? '#10b981' : '#38bdf8' }}>
                  {currentStepIndex >= 6 ? '✓ Transfer Complete' : 'Streaming Objects →'}
                </div>
              </div>

              {/* Node 2: Remote Repository (GitHub Cloud) */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  border:
                    highlightOnlyChanged && currentStepIndex >= 6
                      ? '2px solid #10b981'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  backdropFilter: 'blur(6px)',
                  boxShadow:
                    currentStepIndex >= 6
                      ? '0 0 25px rgba(16, 185, 129, 0.2)'
                      : '0 8px 24px rgba(0, 0, 0, 0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Cloud size={18} color="#60a5fa" />
                    <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc' }}>
                      Remote Repository
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#60a5fa',
                      background: 'rgba(96, 165, 250, 0.15)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                    }}
                  >
                    origin (GitHub)
                  </span>
                </div>

                {/* Remote Commit Stack */}
                <div
                  style={{
                    background: '#0a0f1d',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                    origin/{currentBranch}
                  </div>

                  {/* Remote Target Commit */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.82rem',
                      padding: '0.4rem 0.6rem',
                      borderRadius: '6px',
                      background: currentStepIndex >= 6 ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                      border: currentStepIndex >= 6 ? '1px solid #10b981' : '1px solid transparent',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: currentStepIndex >= 6 ? '#10b981' : '#64748b',
                        }}
                      />
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: 800,
                          color: currentStepIndex >= 6 ? '#10b981' : '#cbd5e1',
                        }}
                      >
                        {currentStepIndex >= 6 ? headHash : '9b1c7a0'}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: currentStepIndex >= 6 ? '#10b981' : '#94a3b8',
                      }}
                    >
                      {currentStepIndex >= 6 ? `(origin/${currentBranch})` : '(missing C3)'}
                    </span>
                  </div>

                  {/* Remote Older Commits */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.8rem',
                      padding: '0.35rem 0.6rem',
                      color: '#64748b',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#475569' }} />
                      <span style={{ fontFamily: 'monospace' }}>4d9e2f3</span>
                    </div>
                    <span style={{ fontSize: '0.72rem' }}>Initial commit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section: World Collaboration Map (You + Teammates) */}
            <div
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.85rem',
              }}
            >
              {/* Collaboration Team Network Node Graph */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2.5rem',
                  flexWrap: 'wrap',
                }}
              >
                {/* You */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      color: 'white',
                      boxShadow: '0 0 12px rgba(37, 99, 235, 0.5)',
                    }}
                  >
                    You
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Author</span>
                </div>

                <div style={{ width: '40px', height: '2px', background: currentStepIndex >= 6 ? '#10b981' : 'rgba(255, 255, 255, 0.1)' }} />

                {/* Central Status Pill */}
                <div
                  style={{
                    background: currentStepIndex >= 6 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${currentStepIndex >= 6 ? '#10b981' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '999px',
                    padding: '0.45rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: currentStepIndex >= 6 ? '#10b981' : '#94a3b8',
                  }}
                >
                  <CheckCircle2 size={16} />
                  {currentStepIndex >= 6
                    ? 'Now everyone can see your work!'
                    : 'Commits private to your computer until pushed'}
                </div>

                <div style={{ width: '40px', height: '2px', background: currentStepIndex >= 6 ? '#10b981' : 'rgba(255, 255, 255, 0.1)' }} />

                {/* Teammate 1 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      color: '#062016',
                    }}
                  >
                    T1
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Teammate</span>
                </div>

                {/* Teammate 2 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      color: '#1a1003',
                    }}
                  >
                    T2
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Teammate</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GENERIC / FALLBACK THEATER (For commit, add, merge, rebase, etc.) */}
        {commandId !== 'push' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', padding: '1rem 0' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                {story.title}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                {story.mentalModelQuote}
              </div>
            </div>

            {/* Visual Step Display */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '12px',
                padding: '1.5rem',
                maxWidth: '560px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
                  {activeStep.label}
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8' }}>
                  Phase: {activeStep.phase.toUpperCase()}
                </span>
              </div>

              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
                {activeStep.title}
              </div>

              <div style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                {activeStep.description}
              </div>

              {activeStep.whatChangedBadges && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' }}>
                  {activeStep.whatChangedBadges.map((b, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid #10b981',
                        color: '#10b981',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                      }}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Prediction Overlay (Appears when animation pauses before a critical decision) */}
        {activeStep.prediction && !predictionSubmitted && (
          <div
            style={{
              position: 'absolute',
              inset: '1.5rem',
              background: 'rgba(14, 23, 42, 0.94)',
              backdropFilter: 'blur(8px)',
              borderRadius: '12px',
              border: '2px solid #38bdf8',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              zIndex: 30,
              gap: '1rem',
              boxShadow: '0 0 35px rgba(56, 189, 248, 0.3)',
            }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
              🔮 Prediction Checkpoint
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', maxWidth: '500px' }}>
              {activeStep.prediction.prompt}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', maxWidth: '480px' }}>
              {activeStep.prediction.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePredictionAnswer(idx)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    background: predictionSelected === idx ? '#2563eb' : 'rgba(255, 255, 255, 0.04)',
                    color: '#f8fafc',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>

            {showPredictionHint && (
              <div style={{ fontSize: '0.84rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '0.65rem 1rem', borderRadius: '8px', maxWidth: '480px' }}>
                💡 Hint: {activeStep.prediction.hint}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Causal Step Scrubber Bar (With Meaningful Steps & "YOU ARE HERE" Indicator) */}
      <div
        style={{
          background: '#0e172a',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '12px',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        {/* Scrubber Pipeline */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          {/* Background Connector Bar */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '15px',
              right: '15px',
              height: '3px',
              background: 'rgba(255, 255, 255, 0.1)',
              transform: 'translateY(-50%)',
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
                }}
              >
                {/* Node Pill */}
                <div
                  style={{
                    width: isCurrent ? '28px' : '20px',
                    height: isCurrent ? '28px' : '20px',
                    borderRadius: '50%',
                    background: isCurrent ? '#38bdf8' : isPassed ? '#10b981' : '#1e293b',
                    border: isCurrent ? '3px solid #0e172a' : '2px solid rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isCurrent ? '0 0 14px #38bdf8' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isPassed && <CheckCircle2 size={12} color="#ffffff" />}
                  {isCurrent && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0e172a' }} />}
                </div>

                {/* Step Label */}
                <span
                  style={{
                    fontSize: isCurrent ? '0.74rem' : '0.68rem',
                    fontWeight: isCurrent ? 800 : 600,
                    color: isCurrent ? '#38bdf8' : isPassed ? '#94a3b8' : '#64748b',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {s.label.replace(/^\d+\.\s*/, '')}
                  {isCurrent && ' (YOU ARE HERE)'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Playback Controls Row: Play/Pause, Speed, Replay */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: '0.65rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                background: '#2563eb',
                color: 'white',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)',
              }}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} fill="white" />}
            </button>

            <button
              onClick={handleReplay}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#cbd5e1',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <RotateCcw size={13} /> Replay
            </button>
          </div>

          {/* Active Step Caption */}
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' }}>
            Step {currentStepIndex + 1} of {totalSteps}: {activeStep.title}
          </div>

          {/* Speed Multiplier Pill (0.5x, 1x, 1.5x, 2x) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#090e1a', padding: '0.2rem', borderRadius: '6px' }}>
            {[0.5, 1, 1.5, 2].map((sp) => (
              <button
                key={sp}
                onClick={() => setPlaybackSpeed(sp)}
                style={{
                  background: playbackSpeed === sp ? '#38bdf8' : 'transparent',
                  color: playbackSpeed === sp ? '#0e172a' : '#64748b',
                  border: 'none',
                  padding: '0.2rem 0.45rem',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {sp}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Simulator (Direct GitEngine interface) */}
      <InteractiveSimulator
        simulatorType={story.simulatorType}
        repo={repo}
        onExecuteCommand={onExecuteCommand}
        onUpdateFileContent={onUpdateFileContent}
      />

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
