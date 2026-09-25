import React, { useState, useEffect, useMemo } from 'react';
import './kubeFlowDiagram.css';
import type { KubeConcept } from '../../data/topics/types';
import { getDiagramDataForConcept, getChapterMasterDiagram } from '../../data/diagrams/topicFlows';
import type { FlowBlock, FlowConnection, FlowStep, TopicFlowDiagramData } from './kubeDiagramTypes';
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
  Workflow,
  RefreshCw,
  GitFork,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface Props {
  concept: KubeConcept;
  compact?: boolean;
}

export type FlowArchetype = 'pipeline' | 'loop' | 'decision' | 'routing' | 'stack';

// Detect the ideal visual flowchart archetype based on concept domain
export const detectArchetype = (data: TopicFlowDiagramData): FlowArchetype => {
  const text = `${data.chapterTitle} ${data.conceptTitle} ${data.architectureType} ${data.architecturalSummary}`.toLowerCase();

  // 1. Reconciliation & Closed Loop: Controllers, Operators, Autoscaling, Self-Healing
  if (
    text.includes('reconcil') ||
    text.includes('operator') ||
    text.includes('autoscaling') ||
    text.includes('informer') ||
    text.includes('workqueue') ||
    text.includes('hpa') ||
    data.chapterNumber === 10 ||
    data.chapterNumber === 14
  ) {
    return 'loop';
  }

  // 2. Decision & Gatekeeper: Webhooks, RBAC, Scheduling filters/scoring, Network Policies
  if (
    text.includes('webhook') ||
    text.includes('rbac') ||
    text.includes('filter') ||
    text.includes('scoring') ||
    text.includes('policy') ||
    text.includes('admission') ||
    data.chapterNumber === 8 ||
    data.chapterNumber === 11
  ) {
    return 'decision';
  }

  // 3. Routing & Fan-out: Services, Ingress, DNS, CoreDNS, VIPs, Load Balancing
  if (
    text.includes('service') ||
    text.includes('network') ||
    text.includes('ingress') ||
    text.includes('dns') ||
    text.includes('traffic') ||
    text.includes('routing') ||
    text.includes('vip') ||
    data.chapterNumber === 5
  ) {
    return 'routing';
  }

  // 4. Layered Architectural Stack: Storage (PVC/PV/CSI), Compute Limits (cgroups), Setup
  if (
    text.includes('storage') ||
    text.includes('volume') ||
    text.includes('pvc') ||
    text.includes('pv') ||
    text.includes('csi') ||
    text.includes('resource') ||
    text.includes('cgroup') ||
    data.chapterNumber === 7 ||
    data.chapterNumber === 12 ||
    data.chapterNumber === 3
  ) {
    return 'stack';
  }

  // Default: Clean Sequential Pipeline (Lifecycle, OCI runtime, CI/CD, Deployments)
  return 'pipeline';
};

export const KubeFlowDiagram: React.FC<Props> = ({ concept, compact = false }) => {
  const [diagramScope, setDiagramScope] = useState<'concept' | 'chapter'>('concept');
  const chapterNumber = parseInt(concept.number.split('.')[0], 10) || 1;

  const diagramData = useMemo(() => {
    return diagramScope === 'chapter'
      ? getChapterMasterDiagram(chapterNumber, concept)
      : getDiagramDataForConcept(concept);
  }, [diagramScope, chapterNumber, concept]);

  const { blocks, connections, steps } = diagramData;

  const autoArchetype = useMemo(() => detectArchetype(diagramData), [diagramData]);
  const [userArchetype, setUserArchetype] = useState<FlowArchetype | 'auto'>('auto');
  const activeArchetype = userArchetype === 'auto' ? autoArchetype : userArchetype;

  const [pipelineLayoutMode, setPipelineLayoutMode] = useState<'horizontal' | 'vertical'>('horizontal');

  const [prevConceptId, setPrevConceptId] = useState(concept.id);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [inspectedBlock, setInspectedBlock] = useState<FlowBlock | null>(null);
  const [copiedTrace, setCopiedTrace] = useState<boolean>(false);
  const [copiedDiag, setCopiedDiag] = useState<boolean>(false);

  // Modal Escape key and body lock handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setInspectedBlock(null);
      }
    };
    if (inspectedBlock) {
      window.addEventListener('keydown', handleKeyDown);
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [inspectedBlock]);

  // Sync state if concept changes
  if (prevConceptId !== concept.id) {
    setPrevConceptId(concept.id);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setInspectedBlock(null);
    setUserArchetype('auto');
  }

  const handleScopeToggle = (newScope: 'concept' | 'chapter') => {
    setDiagramScope(newScope);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setInspectedBlock(null);
  };

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
      case 'terminal': return <Terminal size={16} />;
      case 'server': return <Server size={16} />;
      case 'database': return <Database size={16} />;
      case 'cpu': return <Cpu size={16} />;
      case 'shield': return <Shield size={16} />;
      case 'network': return <Network size={16} />;
      case 'box': return <Box size={16} />;
      case 'hard-drive': return <HardDrive size={16} />;
      case 'layers': return <Layers size={16} />;
      case 'activity': return <Activity size={16} />;
      default: return <Sparkles size={16} />;
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

  // Reusable Simplified Block Card
  const renderBlock = (
    block: FlowBlock,
    options?: {
      width?: string | number;
      annotation?: string;
      customHighlight?: boolean;
    }
  ) => {
    const isStepActive = currentStep.activeBlockIds.includes(block.id);
    const isActive = options?.customHighlight ?? isStepActive;
    const isInspected = inspectedBlock?.id === block.id;
    const catColors = getCategoryColor(block.category);

    return (
      <div
        key={block.id}
        onClick={() => setInspectedBlock(block)}
        style={{
          width: options?.width || (compact ? '240px' : '270px'),
          minWidth: '220px',
          background: isActive ? catColors.bg : 'rgba(15, 23, 42, 0.94)',
          border: isInspected
            ? `2px solid #38bdf8`
            : isActive
            ? `2px solid ${catColors.border}`
            : '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '12px',
          padding: '0.9rem 1rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          transform: isActive ? 'scale(1.02)' : 'scale(1)',
          boxShadow: isActive ? `0 0 22px ${catColors.border}45` : '0 4px 12px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          position: 'relative',
          backdropFilter: 'blur(8px)',
          opacity: 1, // Always 100% opacity for maximum text clarity
        }}
        title={`Click to inspect ${block.label} details & diagnostics`}
      >
        {/* Category Accent Strip on Left */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '8px',
            bottom: '8px',
            width: '4px',
            borderRadius: '0 2px 2px 0',
            background: catColors.border,
            boxShadow: `0 0 8px ${catColors.border}`,
          }}
        />

        {/* Header: Icon + Full-Width Title (Never squished by badge) */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', paddingLeft: '0.35rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: catColors.bg,
              border: `1.5px solid ${catColors.border}60`,
              color: catColors.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '1px',
            }}
          >
            {getBlockIcon(block.icon)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: '0.96rem',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.3,
                wordBreak: 'normal',
                overflowWrap: 'break-word',
              }}
            >
              {block.label}
            </div>
          </div>
        </div>

        {/* Dedicated Protocol / Port / Socket Badge Row (Full Width, Never Compresses Title) */}
        {block.portOrProtocol && (
          <div style={{ paddingLeft: '0.35rem' }}>
            <span
              style={{
                display: 'inline-block',
                maxWidth: '100%',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono, monospace)',
                fontWeight: 700,
                padding: '0.2rem 0.55rem',
                borderRadius: '6px',
                background: 'rgba(0, 0, 0, 0.75)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                color: '#38bdf8',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={block.portOrProtocol}
            >
              {block.portOrProtocol}
            </span>
          </div>
        )}

        {/* Sublabel / Role Description (Full Visibility, Clean Spacing) */}
        <div
          style={{
            fontSize: '0.82rem',
            color: '#cbd5e1',
            lineHeight: 1.45,
            paddingLeft: '0.35rem',
            fontWeight: 500,
          }}
        >
          {options?.annotation || block.sublabel}
        </div>

        {/* Footer Category Tag & Inspect Affordance */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '0.35rem',
            paddingTop: '0.4rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              color: catColors.text,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {block.category}
          </span>
          <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <Info size={11} /> Click to Inspect
          </span>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // ARCHETYPE 1: PIPELINE (Sequential Horizontal Process Flow)
  // -------------------------------------------------------------
  const renderPipelineLayout = () => {
    if (pipelineLayoutMode === 'vertical') {
      return (
        <div className="kube-pipeline-vertical">
          {blocks.map((block, idx) => {
            const nextBlock = blocks[idx + 1];
            const conn = nextBlock
              ? connections.find((c) => (c.from === block.id && c.to === nextBlock.id) || (c.from === nextBlock.id && c.to === block.id))
              : undefined;
            const isConnActive = conn?.stepNumber === currentStep.step;

            return (
              <React.Fragment key={block.id}>
                <div style={{ width: '100%', maxWidth: '360px' }}>
                  {renderBlock(block, { width: '100%' })}
                </div>

                {idx < blocks.length - 1 && (
                  <div className="kube-vertical-connector">
                    <span className={`kube-conn-badge ${isConnActive ? 'active' : ''}`}>
                      {conn?.protocol || `Step ${idx + 1}`}
                    </span>
                    <svg width="22" height="30" viewBox="0 0 22 30">
                      <line
                        x1="11"
                        y1="2"
                        x2="11"
                        y2="22"
                        stroke={isConnActive ? '#38bdf8' : '#64748b'}
                        strokeWidth={isConnActive ? 2.5 : 2}
                        markerEnd={`url(#flow-arrow-${isConnActive ? 'cyan' : 'dim'})`}
                      />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      );
    }

    return (
      <div className="kube-pipeline-grid">
        {blocks.map((block, idx) => {
          const nextBlock = blocks[idx + 1];
          const conn = nextBlock
            ? connections.find((c) => (c.from === block.id && c.to === nextBlock.id) || (c.from === nextBlock.id && c.to === block.id))
            : undefined;
          const isConnActive = conn?.stepNumber === currentStep.step;

          return (
            <React.Fragment key={block.id}>
              <div style={{ flex: '0 0 auto', maxWidth: '100%' }}>
                {renderBlock(block, { width: compact ? '240px' : '270px' })}
              </div>

              {idx < blocks.length - 1 && (
                <div className="kube-pipeline-connector">
                  <span className={`kube-conn-badge ${isConnActive ? 'active' : ''}`}>
                    {conn?.protocol || `Step ${idx + 1}`}
                  </span>
                  <svg width="56" height="18" viewBox="0 0 56 18">
                    <line
                      x1="2"
                      y1="9"
                      x2="48"
                      y2="9"
                      stroke={isConnActive ? '#38bdf8' : '#64748b'}
                      strokeWidth={isConnActive ? 2.5 : 2}
                      markerEnd={`url(#flow-arrow-${isConnActive ? 'cyan' : 'dim'})`}
                    />
                  </svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  // -------------------------------------------------------------
  // ARCHETYPE 2: RECONCILIATION LOOP (Continuous Closed Loop)
  // -------------------------------------------------------------
  const renderLoopLayout = () => {
    const primaryBlocks = blocks.slice(0, 4);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          width: '100%',
          padding: '0.75rem 0',
        }}
      >
        {/* Top Observe Component */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {primaryBlocks[0] && renderBlock(primaryBlocks[0], { width: '280px', annotation: '1. Watch & Observe' })}
        </div>

        {/* Down Arrow */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, fontFamily: 'var(--font-mono, monospace)', color: '#38bdf8', background: '#040817', padding: '0.15rem 0.55rem', borderRadius: '5px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            Watch Stream Event
          </span>
          <svg width="22" height="26" viewBox="0 0 22 26">
            <line x1="11" y1="0" x2="11" y2="20" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#flow-arrow-cyan)" />
          </svg>
        </div>

        {/* Middle Stage: Informer / WorkQueue & Reconciler */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          {primaryBlocks[1] && renderBlock(primaryBlocks[1], { width: '260px', annotation: '2. Diff Desired vs Actual' })}

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, fontFamily: 'var(--font-mono, monospace)', color: '#10b981', background: '#040817', padding: '0.15rem 0.55rem', borderRadius: '5px', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
              Reconcile
            </span>
            <svg width="52" height="18" viewBox="0 0 52 18">
              <line x1="2" y1="9" x2="44" y2="9" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#flow-arrow-emerald)" />
            </svg>
          </div>

          {primaryBlocks[2] && renderBlock(primaryBlocks[2], { width: '260px', annotation: '3. Corrective Action' })}
        </div>

        {/* Down Arrow to Target */}
        {primaryBlocks[3] && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, fontFamily: 'var(--font-mono, monospace)', color: '#f59e0b', background: '#040817', padding: '0.15rem 0.55rem', borderRadius: '5px', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                Execute Mutation
              </span>
              <svg width="22" height="26" viewBox="0 0 22 26">
                <line x1="11" y1="0" x2="11" y2="20" stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#flow-arrow-amber)" />
              </svg>
            </div>
            <div>{renderBlock(primaryBlocks[3], { width: '280px', annotation: '4. Target Resource State' })}</div>
          </>
        )}

        {/* Closed Feedback Loop Banner & Return Vector */}
        <div
          style={{
            marginTop: '0.75rem',
            width: '100%',
            maxWidth: '620px',
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1.5px dashed rgba(56, 189, 248, 0.5)',
            borderRadius: '12px',
            padding: '0.65rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#38bdf8', fontSize: '0.88rem', fontWeight: 800 }}>
            <RefreshCw size={16} className={isPlaying ? 'animate-spin' : ''} />
            <span>Closed Reconciliation Feedback Loop</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>
            Continuously re-evaluates actual state vs declarative spec
          </span>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // ARCHETYPE 3: DECISION (Branching Gatekeeper Flowchart)
  // -------------------------------------------------------------
  const renderDecisionLayout = () => {
    const requestBlock = blocks[0];
    const passBlock = blocks[1] || blocks[0];
    const targetBlock = blocks[2] || blocks[1];

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.85rem',
          width: '100%',
          padding: '0.75rem 0',
        }}
      >
        {/* 1. Request Originator */}
        {requestBlock && renderBlock(requestBlock, { width: '280px', annotation: '1. Incoming Admission Request' })}

        {/* Down Arrow into Decision Diamond */}
        <svg width="22" height="26" viewBox="0 0 22 26">
          <line x1="11" y1="0" x2="11" y2="20" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#flow-arrow-cyan)" />
        </svg>

        {/* 2. Decision Diamond Node */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="170" height="92" viewBox="0 0 170 92">
            <polygon
              points="85,4 164,46 85,88 6,46"
              fill="rgba(14, 116, 144, 0.45)"
              stroke="#38bdf8"
              strokeWidth="2.5"
            />
            <text x="85" y="38" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="900" letterSpacing="0.08em">
              POLICY GATE
            </text>
            <text x="85" y="58" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="900">
              Authorized?
            </text>
          </svg>
        </div>

        {/* 3. Branching Arms (Yes vs No) */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '2rem', width: '100%', maxWidth: '680px' }}>
          {/* YES / PASS BRANCH */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.55rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#34d399', fontSize: '0.82rem', fontWeight: 800 }}>
              <CheckCircle2 size={15} />
              <span>[PASS / ALLOWED]</span>
            </div>
            <svg width="22" height="24" viewBox="0 0 22 24">
              <line x1="11" y1="0" x2="11" y2="18" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#flow-arrow-emerald)" />
            </svg>
            {renderBlock(passBlock, { width: '100%', annotation: '2. Webhook / Scoring Check' })}

            {targetBlock && targetBlock.id !== passBlock.id && (
              <>
                <svg width="22" height="24" viewBox="0 0 22 24">
                  <line x1="11" y1="0" x2="11" y2="18" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#flow-arrow-emerald)" />
                </svg>
                {renderBlock(targetBlock, { width: '100%', annotation: '3. Committed to Cluster State' })}
              </>
            )}
          </div>

          {/* NO / REJECT BRANCH */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.55rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f87171', fontSize: '0.82rem', fontWeight: 800 }}>
              <XCircle size={15} />
              <span>[FAIL / DENIED]</span>
            </div>
            <svg width="22" height="24" viewBox="0 0 22 24">
              <line x1="11" y1="0" x2="11" y2="18" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#flow-arrow-dim)" />
            </svg>

            {/* Rejection Terminal Card */}
            <div
              style={{
                width: '100%',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1.5px solid rgba(239, 68, 68, 0.45)',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
              }}
            >
              <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#f87171' }}>
                403 Forbidden / Rejected
              </div>
              <div style={{ fontSize: '0.8rem', color: '#e2e8f0', lineHeight: 1.45 }}>
                Request dropped immediately; audit violation logged; cluster state unchanged.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // ARCHETYPE 4: ROUTING (Fan-Out / Hub & Spoke Tree)
  // -------------------------------------------------------------
  const renderRoutingLayout = () => {
    const ingressBlock = blocks[0];
    const routerBlock = blocks[1] || blocks[0];
    const backendBlocks = blocks.slice(2).length > 0 ? blocks.slice(2) : [blocks[blocks.length - 1]];

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.85rem',
          width: '100%',
          padding: '0.75rem 0',
        }}
      >
        {/* Ingress / Caller */}
        {ingressBlock && renderBlock(ingressBlock, { width: '300px', annotation: '1. Ingress / Client DNS Request' })}

        {/* Down Arrow to Router */}
        <svg width="22" height="26" viewBox="0 0 22 26">
          <line x1="11" y1="0" x2="11" y2="20" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#flow-arrow-cyan)" />
        </svg>

        {/* Central Router / VIP */}
        {routerBlock && renderBlock(routerBlock, { width: '300px', annotation: '2. Stable VIP / iptables DNAT Proxy' })}

        {/* Fan-Out Branching Bus */}
        <div style={{ width: '100%', maxWidth: '720px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mono, monospace)',
              fontWeight: 700,
              color: '#38bdf8',
              background: 'rgba(14, 165, 233, 0.12)',
              border: '1px solid rgba(14, 165, 233, 0.35)',
              padding: '0.2rem 0.75rem',
              borderRadius: '999px',
              marginBottom: '4px',
            }}
          >
            Round-Robin Load Balancing / Endpoints Fan-Out
          </div>

          <svg width="100%" height="28" viewBox="0 0 400 28" preserveAspectRatio="none">
            {/* Center stem down */}
            <line x1="200" y1="0" x2="200" y2="14" stroke="#38bdf8" strokeWidth="2.5" />
            {/* Horizontal bus line */}
            <line x1="50" y1="14" x2="350" y2="14" stroke="#38bdf8" strokeWidth="2.5" />
            {/* Left drop */}
            <line x1="50" y1="14" x2="50" y2="26" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#flow-arrow-cyan)" />
            {/* Center drop */}
            <line x1="200" y1="14" x2="200" y2="26" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#flow-arrow-cyan)" />
            {/* Right drop */}
            <line x1="350" y1="14" x2="350" y2="26" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#flow-arrow-cyan)" />
          </svg>
        </div>

        {/* Backend Endpoints Row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', width: '100%' }}>
          {backendBlocks.map((b, i) => (
            <div key={b.id}>
              {renderBlock(b, {
                width: compact ? '240px' : '260px',
                annotation: `Pod Replica ${i + 1} (Healthy)`,
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // ARCHETYPE 5: STACK (Tiered Hierarchical Architecture)
  // -------------------------------------------------------------
  const renderStackLayout = () => {
    // Partition blocks into 2 or 3 architectural tiers
    const tier1 = blocks.slice(0, 1);
    const tier2 = blocks.slice(1, 3);
    const tier3 = blocks.slice(3);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          width: '100%',
          maxWidth: '720px',
          margin: '0 auto',
        }}
      >
        {/* Tier 1: Application Layer */}
        <div
          style={{
            width: '100%',
            background: 'rgba(56, 189, 248, 0.04)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: '12px',
            padding: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
          }}
        >
          <div style={{ fontSize: '0.64rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Tier 1 &bull; Workload &amp; Consumer Layer
          </div>
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            {tier1.map((b) => renderBlock(b, { width: '100%' }))}
          </div>
        </div>

        {/* Down Connection Vector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.65rem' }}>
          <svg width="18" height="20" viewBox="0 0 18 20">
            <line x1="9" y1="0" x2="9" y2="15" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#flow-arrow-cyan)" />
          </svg>
          <span style={{ fontFamily: 'var(--font-mono)' }}>spec.volumeClaimTemplates / Requests &bull; Limits</span>
        </div>

        {/* Tier 2: Cluster Abstraction Layer */}
        {tier2.length > 0 && (
          <div
            style={{
              width: '100%',
              background: 'rgba(168, 85, 247, 0.04)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              borderRadius: '12px',
              padding: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem',
            }}
          >
            <div style={{ fontSize: '0.64rem', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Tier 2 &bull; Cluster Abstraction &amp; Management Layer
            </div>
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
              {tier2.map((b) => (
                <div key={b.id} style={{ flex: 1, minWidth: '180px' }}>
                  {renderBlock(b, { width: '100%' })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Down Connection Vector */}
        {tier3.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.65rem' }}>
              <svg width="18" height="20" viewBox="0 0 18 20">
                <line x1="9" y1="0" x2="9" y2="15" stroke="#10b981" strokeWidth="2" markerEnd="url(#flow-arrow-emerald)" />
              </svg>
              <span style={{ fontFamily: 'var(--font-mono)' }}>CSI Driver Protocol / Linux cgroup Hierarchy</span>
            </div>

            {/* Tier 3: Physical / Kernel Layer */}
            <div
              style={{
                width: '100%',
                background: 'rgba(16, 185, 129, 0.04)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '12px',
                padding: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
              }}
            >
              <div style={{ fontSize: '0.64rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Tier 3 &bull; Physical Node &amp; Kernel Storage / Compute Driver
              </div>
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                {tier3.map((b) => (
                  <div key={b.id} style={{ flex: 1, minWidth: '180px' }}>
                    {renderBlock(b, { width: '100%' })}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.15rem',
        background: 'var(--bg-card)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '16px',
        padding: compact ? '1rem' : '1.5rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* SVG GLOBAL ARROWHEAD MARKERS */}
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
        <defs>
          <marker id="flow-arrow-cyan" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto">
            <path d="M 1 1 L 7 4 L 1 7 Z" fill="#38bdf8" />
          </marker>
          <marker id="flow-arrow-emerald" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto">
            <path d="M 1 1 L 7 4 L 1 7 Z" fill="#10b981" />
          </marker>
          <marker id="flow-arrow-amber" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto">
            <path d="M 1 1 L 7 4 L 1 7 Z" fill="#f59e0b" />
          </marker>
          <marker id="flow-arrow-dim" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto">
            <path d="M 1 1 L 7 4 L 1 7 Z" fill="#64748b" />
          </marker>
        </defs>
      </svg>

      {/* 1. TOP HEADER BAR: SCOPE SWITCHER & ARCHETYPE CHIPS */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, rgba(50, 108, 229, 0.3) 0%, rgba(56, 189, 248, 0.2) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
            }}
          >
            <Workflow size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.96rem', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>{diagramScope === 'chapter' ? diagramData.chapterTitle : concept.title}</span>
              <span style={{ fontSize: '0.68rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '0.1rem 0.45rem', borderRadius: '999px', fontWeight: 700 }}>
                {concept.number}
              </span>
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
              {diagramData.architectureType} &bull; Click any component to inspect internals
            </div>
          </div>
        </div>

        {/* Right Controls: Scope + Archetype Quick Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Subtopic vs Chapter Toggle */}
          <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', padding: '0.2rem', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => handleScopeToggle('concept')}
              style={{
                background: diagramScope === 'concept' ? 'var(--k8s-blue)' : 'transparent',
                color: diagramScope === 'concept' ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '6px',
                padding: '0.25rem 0.55rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Sub-Topic ({concept.number})
            </button>
            <button
              onClick={() => handleScopeToggle('chapter')}
              style={{
                background: diagramScope === 'chapter' ? 'var(--k8s-blue)' : 'transparent',
                color: diagramScope === 'chapter' ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '6px',
                padding: '0.25rem 0.55rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Chapter {chapterNumber} Master
            </button>
          </div>

          {/* Archetype Quick Filter Chips */}
          <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', padding: '0.2rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            {(['auto', 'pipeline', 'loop', 'decision', 'routing', 'stack'] as const).map((arch) => {
              const isSelected = userArchetype === arch;
              const label =
                arch === 'auto'
                  ? `Auto (${autoArchetype})`
                  : arch === 'pipeline'
                  ? 'Pipeline'
                  : arch === 'loop'
                  ? 'Loop'
                  : arch === 'decision'
                  ? 'Decision'
                  : arch === 'routing'
                  ? 'Routing'
                  : 'Stack';

              return (
                <button
                  key={arch}
                  onClick={() => setUserArchetype(arch)}
                  title={`View in ${arch} architectural layout`}
                  style={{
                    background: isSelected ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                    border: isSelected ? '1px solid #38bdf8' : 'none',
                    color: isSelected ? '#38bdf8' : 'var(--text-secondary)',
                    borderRadius: '5px',
                    padding: '0.2rem 0.45rem',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. PLAYBACK & STEP PROGRESSION BAR */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.02)', padding: '0.45rem 0.75rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={handlePrev}
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: '#cbd5e1', borderRadius: '5px', padding: '0.25rem 0.45rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Previous step"
          >
            <ChevronLeft size={13} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              background: isPlaying ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              border: `1px solid ${isPlaying ? '#ef4444' : '#10b981'}`,
              color: isPlaying ? '#f87171' : '#4ade80',
              borderRadius: '5px',
              padding: '0.25rem 0.65rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            {isPlaying ? <Pause size={11} /> : <Play size={11} />}
            <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>
          <button
            onClick={handleNext}
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: '#cbd5e1', borderRadius: '5px', padding: '0.25rem 0.45rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Next step"
          >
            <ChevronRight size={13} />
          </button>
          <button
            onClick={handleReset}
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: '#94a3b8', borderRadius: '5px', padding: '0.25rem 0.45rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Reset"
          >
            <RotateCcw size={12} />
          </button>
        </div>

        {/* Step Indicator Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', overflowX: 'auto' }}>
          {steps.map((s, idx) => {
            const isCurrent = idx === currentStepIndex;
            return (
              <button
                key={s.step}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIndex(idx);
                }}
                style={{
                  background: isCurrent ? 'var(--k8s-blue)' : 'rgba(255, 255, 255, 0.05)',
                  border: isCurrent ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: isCurrent ? '#fff' : '#94a3b8',
                  borderRadius: '6px',
                  padding: '0.2rem 0.55rem',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <span>Stage {s.step}</span>
                {idx < currentStepIndex && <Check size={10} color="#10b981" />}
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 600 }}>
          <span style={{ color: '#38bdf8', fontWeight: 800 }}>Stage {currentStep.step}:</span> {currentStep.title}
        </div>
      </div>

      {/* 3. SIMPLIFIED BESPOKE ARCHITECTURAL CANVAS */}
      <div
        className="kube-flow-canvas"
        style={{
          padding: compact ? '1rem 0.5rem' : '1.5rem 1rem',
        }}
      >
        {activeArchetype === 'pipeline' && (
          <div className="kube-flow-canvas-controls">
            <button
              onClick={() => setPipelineLayoutMode('horizontal')}
              className={`kube-canvas-btn ${pipelineLayoutMode === 'horizontal' ? 'active' : ''}`}
              title="Horizontal Track"
            >
              Horizontal
            </button>
            <button
              onClick={() => setPipelineLayoutMode('vertical')}
              className={`kube-canvas-btn ${pipelineLayoutMode === 'vertical' ? 'active' : ''}`}
              title="Vertical Sequence"
            >
              Vertical
            </button>
          </div>
        )}

        {activeArchetype === 'pipeline' && renderPipelineLayout()}
        {activeArchetype === 'loop' && renderLoopLayout()}
        {activeArchetype === 'decision' && renderDecisionLayout()}
        {activeArchetype === 'routing' && renderRoutingLayout()}
        {activeArchetype === 'stack' && renderStackLayout()}
      </div>

      {/* 4. CURRENT STAGE EXPLANATION & CLI TRACE */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(50, 108, 229, 0.1) 0%, rgba(56, 189, 248, 0.05) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '12px',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
              STAGE {currentStep.step} / {steps.length}
            </span>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>
              {currentStep.title}
            </span>
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            {currentStep.summary}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '0.65rem' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
              💡 Simple Explanation (ELI5)
            </div>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.5 }}>
              {currentStep.detailExplanation.simpleWords}
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '0.65rem' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
              ⚙️ Technical Mechanics
            </div>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.5 }}>
              {currentStep.detailExplanation.technicalMechanics}
            </div>
          </div>
        </div>

        {currentStep.kubectlTrace && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#050913', padding: '0.45rem 0.75rem', borderRadius: '7px', border: '1px solid rgba(56, 189, 248, 0.2)', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#38bdf8' }}>
              <span style={{ color: '#64748b' }}>Live Trace:</span>
              <code>$ {currentStep.kubectlTrace}</code>
            </div>
            <button
              onClick={() => handleCopy(currentStep.kubectlTrace!, true)}
              style={{
                background: copiedTrace ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                border: `1px solid ${copiedTrace ? '#10b981' : 'rgba(255, 255, 255, 0.15)'}`,
                color: copiedTrace ? '#10b981' : '#cbd5e1',
                padding: '0.2rem 0.5rem',
                borderRadius: '5px',
                fontSize: '0.68rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              {copiedTrace ? <Check size={10} /> : <Copy size={10} />}
              <span>{copiedTrace ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        )}
      </div>

      {/* 5. COMPONENT INSPECTOR MODAL */}
      {inspectedBlock && (
        <div
          className="kube-flow-modal-overlay"
          onClick={() => setInspectedBlock(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Inspect ${inspectedBlock.label}`}
        >
          <div
            className="kube-flow-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
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
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
                    {inspectedBlock.label}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    {inspectedBlock.sublabel} &bull; {inspectedBlock.category.toUpperCase()}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setInspectedBlock(null)}
                className="kube-flow-modal-close-btn"
                aria-label="Close Inspector Modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Role */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '0.75rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--k8s-cyan)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Core Architectural Role
              </div>
              <div style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.55 }}>
                {inspectedBlock.details.role}
              </div>
            </div>

            {/* SRE Key Insight */}
            <div style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px', padding: '0.75rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                💡 Key SRE Design Insight
              </div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                {inspectedBlock.details.keyInsight}
              </div>
            </div>

            {/* Diagnostic Command */}
            <div>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Diagnostic Command
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#040711', border: '1px solid var(--border-color)', borderRadius: '7px', padding: '0.55rem 0.75rem', gap: '0.5rem' }}>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#34d399' }}>
                  $ {inspectedBlock.details.cliDiagnostic}
                </code>
                <button
                  onClick={() => handleCopy(inspectedBlock.details.cliDiagnostic, false)}
                  style={{
                    background: copiedDiag ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                    border: `1px solid ${copiedDiag ? '#10b981' : 'rgba(255, 255, 255, 0.15)'}`,
                    color: copiedDiag ? '#10b981' : '#cbd5e1',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '5px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  {copiedDiag ? <Check size={10} /> : <Copy size={10} />}
                  <span>{copiedDiag ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.25rem' }}>
              <button
                onClick={() => setInspectedBlock(null)}
                style={{
                  background: 'var(--k8s-blue)',
                  border: 'none',
                  color: '#fff',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '7px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
