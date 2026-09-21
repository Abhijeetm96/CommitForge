import React, { useState, useEffect } from 'react';
import type { KubeConcept } from '../../data/topics/types';
import { getDiagramDataForConcept } from '../../data/diagrams/topicFlows';
import type { FlowBlock } from './kubeDiagramTypes';
import {
  Terminal,
  Server,
  Database,
  Cpu,
  Shield,
  Network,
  Box,
  HardDrive,
  Layers,
  Activity,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Check,
  Copy,
  ChevronRight,
  ChevronLeft,
  Info,
  Zap,
  X,
} from 'lucide-react';

interface Props {
  concept: KubeConcept;
  compact?: boolean;
}

export const KubeFlowDiagram: React.FC<Props> = ({ concept, compact = false }) => {
  const diagramData = getDiagramDataForConcept(concept);
  const { blocks, connections, steps } = diagramData;

  const [prevConceptId, setPrevConceptId] = useState(concept.id);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [inspectedBlock, setInspectedBlock] = useState<FlowBlock | null>(null);
  const [viewMode, setViewMode] = useState<'flow' | 'topology'>('flow');
  const [copiedTrace, setCopiedTrace] = useState<boolean>(false);
  const [copiedDiag, setCopiedDiag] = useState<boolean>(false);

  // Sync state if concept changes
  if (prevConceptId !== concept.id) {
    setPrevConceptId(concept.id);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setInspectedBlock(null);
  }

  const currentStep = steps[currentStepIndex] || steps[0];

  // Auto-play timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => (prev + 1) % steps.length);
      }, 3000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, steps.length]);

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => (prev + 1 < steps.length ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => (prev > 0 ? prev - 1 : steps.length - 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleCopy = (text: string, isTrace: boolean) => {
    navigator.clipboard.writeText(text);
    if (isTrace) {
      setCopiedTrace(true);
      setTimeout(() => setCopiedTrace(false), 2000);
    } else {
      setCopiedDiag(true);
      setTimeout(() => setCopiedDiag(false), 2000);
    }
  };

  const getBlockIcon = (iconName: string) => {
    switch (iconName) {
      case 'terminal': return <Terminal size={18} />;
      case 'server': return <Server size={18} />;
      case 'database': return <Database size={18} />;
      case 'cpu': return <Cpu size={18} />;
      case 'shield': return <Shield size={18} />;
      case 'network': return <Network size={18} />;
      case 'box': return <Box size={18} />;
      case 'hard-drive': return <HardDrive size={18} />;
      case 'layers': return <Layers size={18} />;
      case 'activity': return <Activity size={18} />;
      default: return <Sparkles size={18} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'client': return { border: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)', text: '#38bdf8' };
      case 'control-plane': return { border: '#60a5fa', bg: 'rgba(96, 165, 250, 0.12)', text: '#60a5fa' };
      case 'node': return { border: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)', text: '#c084fc' };
      case 'runtime': return { border: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', text: '#34d399' };
      case 'storage': return { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', text: '#fbbf24' };
      case 'network': return { border: '#06b6d4', bg: 'rgba(6, 182, 212, 0.12)', text: '#22d3ee' };
      case 'security': return { border: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)', text: '#f472b6' };
      default: return { border: '#94a3b8', bg: 'rgba(148, 163, 184, 0.12)', text: '#cbd5e1' };
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        background: 'var(--bg-card)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '16px',
        padding: compact ? '1rem' : '1.5rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 1. TOP HEADER: ARCHITECTURAL TITLE & PLAYBACK CONTROLS */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(50, 108, 229, 0.3) 0%, rgba(56, 189, 248, 0.2) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
            }}
          >
            <Zap size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>{diagramData.architectureType}</span>
              <span style={{ fontSize: '0.7rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: 700 }}>
                {concept.number}
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              {diagramData.chapterTitle} • Click any block to inspect internals & diagnostic commands
            </div>
          </div>
        </div>

        {/* Action Controls & View Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Mode Switcher */}
          <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', padding: '0.2rem', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setViewMode('flow')}
              style={{
                background: viewMode === 'flow' ? 'var(--k8s-blue)' : 'transparent',
                color: viewMode === 'flow' ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '6px',
                padding: '0.3rem 0.65rem',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Step Flow
            </button>
            <button
              onClick={() => setViewMode('topology')}
              style={{
                background: viewMode === 'topology' ? 'var(--k8s-blue)' : 'transparent',
                color: viewMode === 'topology' ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '6px',
                padding: '0.3rem 0.65rem',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Full Map
            </button>
          </div>

          {/* Stepper Buttons (Visible in Flow Mode) */}
          {viewMode === 'flow' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <button
                onClick={handlePrev}
                title="Previous step"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  color: '#cbd5e1',
                  borderRadius: '6px',
                  padding: '0.35rem 0.55rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ChevronLeft size={14} />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                title={isPlaying ? 'Pause auto-play' : 'Start auto-play simulation'}
                style={{
                  background: isPlaying ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  border: `1px solid ${isPlaying ? '#ef4444' : '#10b981'}`,
                  color: isPlaying ? '#f87171' : '#4ade80',
                  borderRadius: '6px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
              </button>

              <button
                onClick={handleNext}
                title="Next step"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  color: '#cbd5e1',
                  borderRadius: '6px',
                  padding: '0.35rem 0.55rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ChevronRight size={14} />
              </button>

              <button
                onClick={handleReset}
                title="Reset to step 1"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  color: '#94a3b8',
                  borderRadius: '6px',
                  padding: '0.35rem 0.55rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <RotateCcw size={13} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. PROGRESS STEP SCRUBBER PILLS */}
      {viewMode === 'flow' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {steps.map((s, idx) => {
            const isCurrent = idx === currentStepIndex;
            const isPassed = idx < currentStepIndex;

            return (
              <button
                key={s.step}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIndex(idx);
                }}
                style={{
                  flex: 1,
                  minWidth: '120px',
                  background: isCurrent ? 'rgba(56, 189, 248, 0.15)' : isPassed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                  border: isCurrent ? '1px solid #38bdf8' : isPassed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '0.45rem 0.65rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.15rem',
                  transition: 'all 0.2s ease',
                  boxShadow: isCurrent ? '0 0 12px rgba(56, 189, 248, 0.25)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem', fontWeight: 800, color: isCurrent ? '#38bdf8' : isPassed ? '#10b981' : '#64748b' }}>
                  <span>Step {s.step}</span>
                  {isPassed && <Check size={11} color="#10b981" />}
                </div>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: isCurrent ? '#fff' : '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {s.title}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* 3. VISUAL ARCHITECTURAL BLOCK DIAGRAM CANVAS */}
      <div
        style={{
          background: '#040711',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: '14px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          position: 'relative',
        }}
      >
        {/* Diagram Blocks Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            alignItems: 'stretch',
          }}
        >
          {blocks.map((block) => {
            const isActive = viewMode === 'flow' ? currentStep.activeBlockIds.includes(block.id) : true;
            const isInspected = inspectedBlock?.id === block.id;
            const catColors = getCategoryColor(block.category);

            return (
              <div
                key={block.id}
                onClick={() => setInspectedBlock(block)}
                style={{
                  background: isActive ? catColors.bg : 'rgba(15, 23, 42, 0.6)',
                  border: isInspected ? `2px solid ${catColors.border}` : isActive ? `1px solid ${catColors.border}` : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isActive ? `0 8px 24px ${catColors.border}25` : 'none',
                  opacity: viewMode === 'flow' && !isActive ? 0.45 : 1,
                }}
              >
                {/* Block Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: catColors.bg,
                        border: `1px solid ${catColors.border}40`,
                        color: catColors.text,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {getBlockIcon(block.icon)}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
                        {block.label}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                        {block.sublabel}
                      </div>
                    </div>
                  </div>

                  {block.portOrProtocol && (
                    <span
                      style={{
                        fontSize: '0.62rem',
                        fontFamily: 'var(--font-mono)',
                        padding: '0.15rem 0.4rem',
                        borderRadius: '4px',
                        background: 'rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: catColors.text,
                        flexShrink: 0,
                      }}
                    >
                      {block.portOrProtocol}
                    </span>
                  )}
                </div>

                {/* Brief Role Preview */}
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', lineHeight: 1.45 }}>
                  {block.details.role}
                </div>

                {/* Footer Tag */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.4rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: catColors.text, fontWeight: 700 }}>
                    {block.category}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Info size={11} /> Inspect
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Connection Arrows Banner */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.25rem' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--k8s-cyan)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Activity size={13} />
            <span>Active Data Flow &amp; Protocol Paths:</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {connections
              .filter((c) => (viewMode === 'flow' ? c.stepNumber === currentStep.step : true))
              .map((conn, idx) => {
                const sourceBlock = blocks.find((b) => b.id === conn.from);
                const targetBlock = blocks.find((b) => b.id === conn.to);

                return (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(56, 189, 248, 0.08)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      borderRadius: '8px',
                      padding: '0.45rem 0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      animation: 'fadeIn 0.2s ease-out',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.8rem', color: '#e2e8f0', fontWeight: 700 }}>
                      <span style={{ color: '#38bdf8' }}>{sourceBlock?.label || conn.from}</span>
                      <ChevronRight size={14} color="#64748b" />
                      <span style={{ color: '#10b981' }}>{targetBlock?.label || conn.to}</span>
                      <span style={{ color: '#94a3b8', fontWeight: 500, fontSize: '0.76rem', marginLeft: '0.4rem' }}>
                        &mdash; {conn.label}
                      </span>
                    </div>

                    {conn.protocol && (
                      <span style={{ fontSize: '0.66rem', fontFamily: 'var(--font-mono)', background: 'rgba(0, 0, 0, 0.4)', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#38bdf8' }}>
                        {conn.protocol}
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* 4. CURRENT STEP EXPLANATION CALLOUT (ELI5 + Senior SRE Technical Depth) */}
      {viewMode === 'flow' && currentStep && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(50, 108, 229, 0.12) 0%, rgba(56, 189, 248, 0.06) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            animation: 'fadeIn 0.25s ease-out',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                STAGE {currentStep.step} OF {steps.length}
              </span>
              <span style={{ fontSize: '0.96rem', fontWeight: 800, color: '#fff' }}>
                {currentStep.title}
              </span>
            </div>

            <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
              {currentStep.summary}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {/* ELI5 In Simple Words */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                💡 In Simple Words (ELI5)
              </div>
              <div style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                {currentStep.detailExplanation.simpleWords}
              </div>
            </div>

            {/* Low-Level Technical Mechanics */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                ⚙️ Low-Level Technical Mechanics
              </div>
              <div style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                {currentStep.detailExplanation.technicalMechanics}
              </div>
            </div>
          </div>

          {/* Live Cluster Diagnostic Trace Command */}
          {currentStep.kubectlTrace && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#050913', padding: '0.55rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#38bdf8' }}>
                <span style={{ color: '#64748b' }}>Live Trace:</span>
                <code>$ {currentStep.kubectlTrace}</code>
              </div>

              <button
                onClick={() => handleCopy(currentStep.kubectlTrace!, true)}
                style={{
                  background: copiedTrace ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                  border: `1px solid ${copiedTrace ? '#10b981' : 'rgba(255, 255, 255, 0.15)'}`,
                  color: copiedTrace ? '#10b981' : '#cbd5e1',
                  padding: '0.25rem 0.55rem',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                {copiedTrace ? <Check size={11} /> : <Copy size={11} />}
                <span>{copiedTrace ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* 5. COMPONENT INSPECTOR DRAWER / MODAL */}
      {inspectedBlock && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(5, 10, 24, 0.88)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            animation: 'fadeIn 0.2s ease-out',
          }}
          onClick={() => setInspectedBlock(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '560px',
              background: '#090e1f',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.15rem',
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.6)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: getCategoryColor(inspectedBlock.category).bg,
                    border: `1px solid ${getCategoryColor(inspectedBlock.category).border}`,
                    color: getCategoryColor(inspectedBlock.category).text,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {getBlockIcon(inspectedBlock.icon)}
                </div>
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
                    {inspectedBlock.label}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                    {inspectedBlock.sublabel} &bull; {inspectedBlock.category.toUpperCase()}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setInspectedBlock(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Core Role */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px', padding: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--k8s-cyan)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Core Architectural Role
              </div>
              <div style={{ fontSize: '0.86rem', color: '#e2e8f0', lineHeight: 1.6 }}>
                {inspectedBlock.details.role}
              </div>
            </div>

            {/* Key Golden Insight */}
            <div style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '10px', padding: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                💡 Key SRE Design Insight
              </div>
              <div style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                {inspectedBlock.details.keyInsight}
              </div>
            </div>

            {/* Diagnostic Command */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Live Diagnostic Command
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#040711', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.65rem 0.85rem', gap: '0.5rem' }}>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#34d399' }}>
                  $ {inspectedBlock.details.cliDiagnostic}
                </code>
                <button
                  onClick={() => handleCopy(inspectedBlock.details.cliDiagnostic, false)}
                  style={{
                    background: copiedDiag ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                    border: `1px solid ${copiedDiag ? '#10b981' : 'rgba(255, 255, 255, 0.15)'}`,
                    color: copiedDiag ? '#10b981' : '#cbd5e1',
                    padding: '0.25rem 0.55rem',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  {copiedDiag ? <Check size={11} /> : <Copy size={11} />}
                  <span>{copiedDiag ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Close */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
              <button
                onClick={() => setInspectedBlock(null)}
                style={{
                  background: 'var(--k8s-blue)',
                  border: 'none',
                  color: '#fff',
                  padding: '0.45rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
