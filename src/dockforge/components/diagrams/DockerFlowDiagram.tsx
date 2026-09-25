import React, { useState, useEffect, useMemo } from 'react';
import type { UniversalDockerConcept } from '../../data/unifiedDockerData';
import { getDockerDiagramData } from '../../data/diagrams/dockerTopicFlows';
import type {
  DockerFlowBlock,
  DockerTopicFlowDiagramData,
  DockerBlockCategory,
} from './dockerDiagramTypes';
import './dockerFlowDiagram.css';
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
  X,
  Workflow,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Cloud,
  Columns,
  Rows,
} from 'lucide-react';

interface Props {
  concept: UniversalDockerConcept | { id: string; title: string; topicId?: string; topicNumber?: string };
  compact?: boolean;
}

export type DockerFlowArchetype = 'pipeline' | 'loop' | 'decision' | 'routing' | 'stack';

export const detectDockerArchetype = (data: DockerTopicFlowDiagramData): DockerFlowArchetype => {
  const num = parseInt(data.topicNumber || '0', 10);
  const text = `${data.topicTitle} ${data.conceptTitle} ${data.architectureType} ${data.architecturalSummary}`.toLowerCase();

  // 1. Decision & Security Gatekeeper (Seccomp, AppArmor, Capabilities)
  if (
    num === 12 ||
    text.includes('seccomp') ||
    text.includes('apparmor') ||
    text.includes('cap-drop') ||
    text.includes('hardening')
  ) {
    return 'decision';
  }

  // 2. Reconciliation & Local Dev Feedback Loop (Hot reload, bind sync)
  if (
    num === 13 ||
    text.includes('feedback loop') ||
    text.includes('hot reload') ||
    text.includes('live reload')
  ) {
    return 'loop';
  }

  // 3. Routing & Fan-out: Networks, Bridges, Socket IPC, Ingress, Swarm
  if (
    num === 3 ||
    num === 6 ||
    num === 11 ||
    num === 14 ||
    text.includes('bridge') ||
    text.includes('routing mesh') ||
    text.includes('socket architecture') ||
    text.includes('network topology')
  ) {
    return 'routing';
  }

  // 4. Layered Architectural Stack: Kernel Isolation, Storage Volumes, Compose Services
  if (
    num === 2 ||
    num === 5 ||
    num === 9 ||
    text.includes('persistence architecture') ||
    text.includes('storage driver') ||
    text.includes('mount namespace') ||
    text.includes('compose')
  ) {
    return 'stack';
  }

  // 5. Sequential Pipeline (OCI lifecycle, BuildKit, Registry push/pull, Logging stdout)
  return 'pipeline';
};

export const DockerFlowDiagram: React.FC<Props> = ({ concept, compact = false }) => {
  const diagramData = useMemo(() => {
    return getDockerDiagramData(concept);
  }, [concept]);

  const { blocks, connections, steps } = diagramData;

  const autoArchetype = useMemo(() => detectDockerArchetype(diagramData), [diagramData]);
  const [userArchetype, setUserArchetype] = useState<DockerFlowArchetype | 'auto'>('auto');
  const activeArchetype = userArchetype === 'auto' ? autoArchetype : userArchetype;

  const [pipelineLayoutMode, setPipelineLayoutMode] = useState<'horizontal' | 'vertical'>('horizontal');

  const [prevConceptId, setPrevConceptId] = useState(concept.id);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [inspectedBlock, setInspectedBlock] = useState<DockerFlowBlock | null>(null);
  const [copiedTrace, setCopiedTrace] = useState<boolean>(false);
  const [copiedDiag, setCopiedDiag] = useState<boolean>(false);

  // Sync state if concept changes
  if (prevConceptId !== concept.id) {
    setPrevConceptId(concept.id);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setInspectedBlock(null);
    setUserArchetype('auto');
  }

  const currentStep = steps[currentStepIndex] || steps[0];

  // Auto-play timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => (prev + 1) % steps.length);
      }, 3200);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, steps.length]);

  // Modal Escape key and body lock handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setInspectedBlock(null);
      }
    };
    if (inspectedBlock) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [inspectedBlock]);

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
      case 'cloud': return <Cloud size={18} />;
      case 'activity': return <Activity size={18} />;
      default: return <Sparkles size={18} />;
    }
  };

  const getCategoryColor = (category: DockerBlockCategory) => {
    switch (category) {
      case 'client': return { border: '#38bdf8', bg: 'rgba(56, 189, 248, 0.16)', text: '#38bdf8' };
      case 'daemon': return { border: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.18)', text: '#38bdf8' };
      case 'runtime': return { border: '#10b981', bg: 'rgba(16, 185, 129, 0.16)', text: '#34d399' };
      case 'kernel': return { border: '#a855f7', bg: 'rgba(168, 85, 247, 0.16)', text: '#c084fc' };
      case 'storage': return { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.16)', text: '#fbbf24' };
      case 'network': return { border: '#06b6d4', bg: 'rgba(6, 182, 212, 0.16)', text: '#22d3ee' };
      case 'registry': return { border: '#ec4899', bg: 'rgba(236, 72, 153, 0.16)', text: '#f472b6' };
      case 'compose': return { border: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.16)', text: '#a78bfa' };
      case 'security': return { border: '#ef4444', bg: 'rgba(239, 68, 68, 0.16)', text: '#f87171' };
      case 'cloud': return { border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.16)', text: '#60a5fa' };
      default: return { border: '#94a3b8', bg: 'rgba(148, 163, 184, 0.16)', text: '#e2e8f0' };
    }
  };

  // Reusable High-Contrast, Crystal-Clear Block Card
  const renderBlock = (
    block: DockerFlowBlock,
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
        className={`docker-flow-block-card ${isActive ? 'active-step' : ''}`}
        style={{
          width: options?.width || (compact ? '240px' : '260px'),
          minWidth: '220px',
          background: isActive ? catColors.bg : 'rgba(15, 23, 42, 0.94)',
          border: isInspected
            ? `2px solid #38bdf8`
            : isActive
            ? `2px solid ${catColors.border}`
            : '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: isActive ? `0 0 24px ${catColors.border}50` : '0 4px 14px rgba(0, 0, 0, 0.45)',
        }}
        title={`Click to inspect ${block.label} details & diagnostics`}
      >
        {/* Category Accent Strip on Left */}
        <div
          className="docker-block-accent-strip"
          style={{
            background: catColors.border,
            boxShadow: `0 0 10px ${catColors.border}`,
          }}
        />

        {/* Header: Icon + Full-Width Title */}
        <div className="docker-block-header">
          <div
            className="docker-block-icon-box"
            style={{
              background: catColors.bg,
              border: `1.5px solid ${catColors.border}60`,
              color: catColors.text,
            }}
          >
            {getBlockIcon(block.icon)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="docker-block-title-text">
              {block.label}
            </div>
          </div>
        </div>

        {/* Protocol / Port / Socket Badge Row */}
        {block.portOrProtocol && (
          <div>
            <span
              className="docker-block-protocol-badge"
              title={block.portOrProtocol}
            >
              {block.portOrProtocol}
            </span>
          </div>
        )}

        {/* Sublabel / Role Description */}
        <div className="docker-block-sublabel">
          {options?.annotation || block.sublabel}
        </div>

        {/* Footer Category Tag & Inspect Affordance */}
        <div className="docker-block-footer">
          <span
            className="docker-block-category-tag"
            style={{ color: catColors.text }}
          >
            {block.category}
          </span>
          <span className="docker-block-inspect-hint">
            <Info size={11} /> Click to Inspect
          </span>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // ARCHETYPE 1: PIPELINE (Sequential Process Flow)
  // -------------------------------------------------------------
  const renderPipelineLayout = () => {
    if (pipelineLayoutMode === 'vertical') {
      return (
        <div className="docker-pipeline-vertical">
          {blocks.map((block, idx) => {
            const nextBlock = blocks[idx + 1];
            const conn = nextBlock
              ? connections.find((c) => (c.from === block.id && c.to === nextBlock.id) || (c.from === nextBlock.id && c.to === block.id))
              : undefined;
            const isConnActive = conn?.stepNumber === currentStep.step;

            return (
              <React.Fragment key={block.id}>
                <div style={{ width: '100%', maxWidth: '340px' }}>
                  {renderBlock(block, { width: '100%' })}
                </div>

                {idx < blocks.length - 1 && (
                  <div className="docker-vertical-connector">
                    <span className={`docker-conn-badge ${isConnActive ? 'active' : ''}`}>
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
                        markerEnd={`url(#docker-arrow-${isConnActive ? 'cyan' : 'dim'})`}
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
      <div className="docker-pipeline-grid">
        {blocks.map((block, idx) => {
          const nextBlock = blocks[idx + 1];
          const conn = nextBlock
            ? connections.find((c) => (c.from === block.id && c.to === nextBlock.id) || (c.from === nextBlock.id && c.to === block.id))
            : undefined;
          const isConnActive = conn?.stepNumber === currentStep.step;

          return (
            <React.Fragment key={block.id}>
              <div style={{ flex: '0 0 auto', maxWidth: '100%' }}>
                {renderBlock(block, { width: compact ? '240px' : '260px' })}
              </div>

              {idx < blocks.length - 1 && (
                <div className="docker-pipeline-connector">
                  <span className={`docker-conn-badge ${isConnActive ? 'active' : ''}`}>
                    {conn?.protocol || `Step ${idx + 1}`}
                  </span>
                  <svg width="52" height="20" viewBox="0 0 52 20">
                    <line
                      x1="2"
                      y1="10"
                      x2="44"
                      y2="10"
                      stroke={isConnActive ? '#38bdf8' : '#64748b'}
                      strokeWidth={isConnActive ? 2.5 : 2}
                      markerEnd={`url(#docker-arrow-${isConnActive ? 'cyan' : 'dim'})`}
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
  // ARCHETYPE 2: LOCAL DEV LOOP (Reconciliation / Sync Closed Loop)
  // -------------------------------------------------------------
  const renderLoopLayout = () => {
    const primaryBlocks = blocks.slice(0, 4);

    return (
      <div className="docker-loop-wrapper">
        {/* Top Trigger: Code Edit */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          {primaryBlocks[0] && renderBlock(primaryBlocks[0], { width: 'min(300px, 100%)', annotation: '1. Host Workspace Code Edit' })}
        </div>

        {/* Down Arrow: Bind Mount Sync */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
          <span className="docker-conn-badge">
            Bind Mount inotify filesystem event
          </span>
          <svg width="22" height="26" viewBox="0 0 22 26">
            <line x1="11" y1="0" x2="11" y2="20" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#docker-arrow-cyan)" />
          </svg>
        </div>

        {/* Middle Stage: Container Watcher & Process Reload */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap', width: '100%' }}>
          {primaryBlocks[1] && renderBlock(primaryBlocks[1], { width: 'min(260px, 100%)', annotation: '2. In-Container Virtual Mount' })}

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, fontFamily: 'var(--font-mono, monospace)', color: '#10b981', background: '#040817', padding: '0.18rem 0.6rem', borderRadius: '5px', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
              Hot Reload
            </span>
            <svg width="48" height="18" viewBox="0 0 48 18">
              <line x1="2" y1="9" x2="40" y2="9" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#docker-arrow-emerald)" />
            </svg>
          </div>

          {primaryBlocks[2] && renderBlock(primaryBlocks[2], { width: 'min(260px, 100%)', annotation: '3. Application Process Reload' })}
        </div>

        {/* Down Arrow to Live Container */}
        {primaryBlocks[3] && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, fontFamily: 'var(--font-mono, monospace)', color: '#f59e0b', background: '#040817', padding: '0.18rem 0.6rem', borderRadius: '5px', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                Live Response Ready
              </span>
              <svg width="22" height="26" viewBox="0 0 22 26">
                <line x1="11" y1="0" x2="11" y2="20" stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#docker-arrow-amber)" />
              </svg>
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              {renderBlock(primaryBlocks[3], { width: 'min(300px, 100%)', annotation: '4. Verified Client / Browser Response' })}
            </div>
          </>
        )}

        {/* Feedback Loop Banner */}
        <div className="docker-loop-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#38bdf8', fontSize: '0.88rem', fontWeight: 800 }}>
            <RefreshCw size={16} className={isPlaying ? 'animate-spin' : ''} />
            <span>Continuous Local Development Feedback Loop</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>
            Instant hot sync without rebuilding container image
          </span>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // ARCHETYPE 3: DECISION (Security Gatekeeper Flowchart)
  // -------------------------------------------------------------
  const renderDecisionLayout = () => {
    const requestBlock = blocks[0];
    const passBlock = blocks[1] || blocks[0];
    const targetBlock = blocks[2] || blocks[1];

    return (
      <div className="docker-decision-wrapper">
        {/* 1. Request / Syscall Originator */}
        {requestBlock && renderBlock(requestBlock, { width: 'min(300px, 100%)', annotation: '1. Container Syscall Attempt' })}

        {/* Down Arrow into Decision Diamond */}
        <svg width="22" height="26" viewBox="0 0 22 26">
          <line x1="11" y1="0" x2="11" y2="20" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#docker-arrow-cyan)" />
        </svg>

        {/* 2. Security Decision Diamond Node */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="170" height="92" viewBox="0 0 170 92">
            <polygon
              points="85,4 164,46 85,88 6,46"
              fill="rgba(14, 116, 144, 0.45)"
              stroke="#38bdf8"
              strokeWidth="2.5"
            />
            <text x="85" y="38" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="900" letterSpacing="0.08em">
              SECCOMP GATE
            </text>
            <text x="85" y="58" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="900">
              Permitted?
            </text>
          </svg>
        </div>

        {/* 3. Branching Arms (Allowed vs Blocked) */}
        <div className="docker-decision-arms">
          {/* YES / PASS BRANCH */}
          <div className="docker-decision-branch">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#34d399', fontSize: '0.84rem', fontWeight: 800 }}>
              <CheckCircle2 size={16} />
              <span>[PASS / ALLOWED]</span>
            </div>
            <svg width="22" height="24" viewBox="0 0 22 24">
              <line x1="11" y1="0" x2="11" y2="18" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#docker-arrow-emerald)" />
            </svg>
            {renderBlock(passBlock, { width: '100%', annotation: '2. Capability Whitelist Match' })}

            {targetBlock && targetBlock.id !== passBlock.id && (
              <>
                <svg width="22" height="24" viewBox="0 0 22 24">
                  <line x1="11" y1="0" x2="11" y2="18" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#docker-arrow-emerald)" />
                </svg>
                {renderBlock(targetBlock, { width: '100%', annotation: '3. Host Kernel Execution' })}
              </>
            )}
          </div>

          {/* NO / REJECT BRANCH */}
          <div className="docker-decision-branch">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f87171', fontSize: '0.84rem', fontWeight: 800 }}>
              <XCircle size={16} />
              <span>[BLOCKED / DENIED]</span>
            </div>
            <svg width="22" height="24" viewBox="0 0 22 24">
              <line x1="11" y1="0" x2="11" y2="18" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#docker-arrow-dim)" />
            </svg>

            {/* Rejection Terminal Card */}
            <div
              style={{
                width: '100%',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1.5px solid rgba(239, 68, 68, 0.45)',
                borderRadius: '12px',
                padding: '1.1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#f87171' }}>
                EPERM: Operation Not Permitted
              </div>
              <div style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                Syscall blocked by seccomp BPF filter; container privilege escalation thwarted safely.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // ARCHETYPE 4: ROUTING (Bridge Networking & Fan-Out Tree)
  // -------------------------------------------------------------
  const renderRoutingLayout = () => {
    const ingressBlock = blocks[0];
    const bridgeBlock = blocks[1] || blocks[0];
    const containerBlocks = blocks.slice(2).length > 0 ? blocks.slice(2) : [blocks[blocks.length - 1]];

    return (
      <div className="docker-routing-wrapper">
        {/* Host / Ingress Gateway */}
        {ingressBlock && renderBlock(ingressBlock, { width: 'min(310px, 100%)', annotation: '1. Host Physical Interface (eth0)' })}

        {/* Down Arrow to Bridge */}
        <svg width="22" height="26" viewBox="0 0 22 26">
          <line x1="11" y1="0" x2="11" y2="20" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#docker-arrow-cyan)" />
        </svg>

        {/* Docker0 Virtual Bridge */}
        {bridgeBlock && renderBlock(bridgeBlock, { width: 'min(320px, 100%)', annotation: '2. docker0 Virtual Bridge & iptables NAT' })}

        {/* Fan-Out Branching Bus */}
        <div style={{ width: '100%', maxWidth: '720px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="docker-conn-badge" style={{ marginBottom: '6px' }}>
            veth Pair Peer Tunneling to Container Network Namespaces
          </div>

          <svg width="100%" height="26" viewBox="0 0 400 26" preserveAspectRatio="none">
            <line x1="200" y1="0" x2="200" y2="13" stroke="#38bdf8" strokeWidth="2.5" />
            <line x1="50" y1="13" x2="350" y2="13" stroke="#38bdf8" strokeWidth="2.5" />
            <line x1="50" y1="13" x2="50" y2="24" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#docker-arrow-cyan)" />
            <line x1="200" y1="13" x2="200" y2="24" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#docker-arrow-cyan)" />
            <line x1="350" y1="13" x2="350" y2="24" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#docker-arrow-cyan)" />
          </svg>
        </div>

        {/* Isolated Container Endpoints */}
        <div className="docker-routing-grid">
          {containerBlocks.map((b, i) => (
            <div key={b.id}>
              {renderBlock(b, {
                width: '100%',
                annotation: `Container ${i + 1} (Network Namespace)`,
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // ARCHETYPE 5: STACK (Linux Namespaces / Storage / Compose Stack)
  // -------------------------------------------------------------
  const renderStackLayout = () => {
    const tier1 = blocks.slice(0, 1);
    const tier2 = blocks.slice(1, 3);
    const tier3 = blocks.slice(3);

    return (
      <div className="docker-stack-wrapper">
        {/* Tier 1: Container User Space */}
        <div
          className="docker-stack-tier"
          style={{
            background: 'rgba(56, 189, 248, 0.06)',
            border: '1.5px solid rgba(56, 189, 248, 0.3)',
          }}
        >
          <div className="docker-stack-tier-title" style={{ color: '#38bdf8' }}>
            <span>Tier 1</span> &bull; Containerized Process &amp; Ephemeral Read-Write Layer
          </div>
          <div className="docker-stack-tier-grid">
            {tier1.map((b) => renderBlock(b, { width: '100%' }))}
          </div>
        </div>

        {/* Down Connection Vector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e2e8f0', fontSize: '0.78rem', fontWeight: 600, flexWrap: 'wrap', justifyContent: 'center' }}>
          <svg width="22" height="24" viewBox="0 0 22 24">
            <line x1="11" y1="0" x2="11" y2="18" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#docker-arrow-cyan)" />
          </svg>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', color: '#38bdf8' }}>
            overlay2 driver / veth pair / volume bind mount
          </span>
        </div>

        {/* Tier 2: Docker Engine & Containerd Supervisor */}
        {tier2.length > 0 && (
          <div
            className="docker-stack-tier"
            style={{
              background: 'rgba(14, 165, 233, 0.06)',
              border: '1.5px solid rgba(14, 165, 233, 0.3)',
            }}
          >
            <div className="docker-stack-tier-title" style={{ color: '#0ea5e9' }}>
              <span>Tier 2</span> &bull; Engine Management &amp; OCI Runtime Shim Layer
            </div>
            <div className="docker-stack-tier-grid">
              {tier2.map((b) => (
                <div key={b.id}>
                  {renderBlock(b, { width: '100%' })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Down Connection Vector */}
        {tier3.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e2e8f0', fontSize: '0.78rem', fontWeight: 600, flexWrap: 'wrap', justifyContent: 'center' }}>
              <svg width="22" height="24" viewBox="0 0 22 24">
                <line x1="11" y1="0" x2="11" y2="18" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#docker-arrow-emerald)" />
              </svg>
              <span style={{ fontFamily: 'var(--font-mono, monospace)', color: '#34d399' }}>
                clone() syscall with CLONE_NEW* / Linux cgroups v2
              </span>
            </div>

            {/* Tier 3: Host Linux Kernel Boundary */}
            <div
              className="docker-stack-tier"
              style={{
                background: 'rgba(16, 185, 129, 0.06)',
                border: '1.5px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              <div className="docker-stack-tier-title" style={{ color: '#34d399' }}>
                <span>Tier 3</span> &bull; Linux Host Kernel (Namespaces, cgroups, VFS storage)
              </div>
              <div className="docker-stack-tier-grid">
                {tier3.map((b) => (
                  <div key={b.id}>
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
    <div className={`docker-flow-container ${compact ? 'compact' : ''}`}>
      {/* SVG GLOBAL ARROWHEAD MARKERS */}
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
        <defs>
          <marker id="docker-arrow-cyan" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto">
            <path d="M 1 1 L 7 4 L 1 7 Z" fill="#38bdf8" />
          </marker>
          <marker id="docker-arrow-emerald" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto">
            <path d="M 1 1 L 7 4 L 1 7 Z" fill="#10b981" />
          </marker>
          <marker id="docker-arrow-amber" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto">
            <path d="M 1 1 L 7 4 L 1 7 Z" fill="#f59e0b" />
          </marker>
          <marker id="docker-arrow-dim" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto">
            <path d="M 1 1 L 7 4 L 1 7 Z" fill="#64748b" />
          </marker>
        </defs>
      </svg>

      {/* 1. TOP HEADER BAR: TITLE & ARCHETYPE CHIPS */}
      <div className="docker-flow-header">
        <div className="docker-flow-title-group">
          <div className="docker-flow-title-icon">
            <Workflow size={22} />
          </div>
          <div className="docker-flow-title-content">
            <div className="docker-flow-main-title">
              <span>{diagramData.topicTitle}</span>
              <span className="docker-flow-topic-badge">
                Topic {diagramData.topicNumber}
              </span>
            </div>
            <div className="docker-flow-subtitle">
              <span>{diagramData.architectureType}</span>
              <span>&bull;</span>
              <span>Click any component to inspect internals</span>
            </div>
          </div>
        </div>

        {/* Archetype Quick Filter Chips */}
        <div className="docker-flow-archetype-nav">
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
                className={`docker-flow-archetype-btn ${isSelected ? 'active' : ''}`}
                title={`View in ${arch} architectural layout`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. PLAYBACK & STEP PROGRESSION BAR */}
      <div className="docker-flow-toolbar">
        {/* Playback Controls */}
        <div className="docker-flow-playback-cluster">
          <button
            onClick={handlePrev}
            className="docker-flow-tool-btn"
            title="Previous step"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`docker-flow-tool-btn play-btn ${isPlaying ? 'playing' : ''}`}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>
          <button
            onClick={handleNext}
            className="docker-flow-tool-btn"
            title="Next step"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={handleReset}
            className="docker-flow-tool-btn"
            title="Reset"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Step Indicator Pills */}
        <div className="docker-flow-stepper-cluster">
          {steps.map((s, idx) => {
            const isCurrent = idx === currentStepIndex;
            return (
              <button
                key={s.step}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIndex(idx);
                }}
                className={`docker-flow-step-pill ${isCurrent ? 'active' : ''}`}
              >
                <span>Stage {s.step}</span>
                {idx < currentStepIndex && <Check size={12} color="#34d399" />}
              </button>
            );
          })}
        </div>

        {/* Active Stage Indicator */}
        <div className="docker-flow-active-badge">
          <strong>Stage {currentStep.step}:</strong>
          <span>{currentStep.title}</span>
        </div>
      </div>

      {/* 3. BESPOKE ARCHITECTURAL CANVAS */}
      <div className="docker-flow-canvas">
        {/* Optional Flow Direction Controls for Pipeline Archetype */}
        {activeArchetype === 'pipeline' && (
          <div className="docker-flow-canvas-controls" title="Toggle Pipeline Display Mode">
            <button
              onClick={() => setPipelineLayoutMode('horizontal')}
              className={`docker-canvas-btn ${pipelineLayoutMode === 'horizontal' ? 'active' : ''}`}
              title="Horizontal flow"
            >
              <Columns size={13} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              Horizontal
            </button>
            <button
              onClick={() => setPipelineLayoutMode('vertical')}
              className={`docker-canvas-btn ${pipelineLayoutMode === 'vertical' ? 'active' : ''}`}
              title="Vertical sequence"
            >
              <Rows size={13} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
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
      <div className="docker-flow-explanation-card">
        <div className="docker-explanation-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#38bdf8', background: 'rgba(14, 165, 233, 0.18)', border: '1px solid rgba(14, 165, 233, 0.4)', padding: '0.18rem 0.65rem', borderRadius: '999px' }}>
              STAGE {currentStep.step} / {steps.length}
            </span>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
              {currentStep.title}
            </span>
          </div>
          <div style={{ fontSize: '0.86rem', color: '#cbd5e1', fontWeight: 500 }}>
            {currentStep.summary}
          </div>
        </div>

        <div className="docker-explanation-grid">
          <div className="docker-explanation-box" style={{ borderLeft: '3px solid #f59e0b' }}>
            <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '0.35rem', letterSpacing: '0.04em' }}>
              💡 Simple Explanation (ELI5)
            </div>
            <div style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.6 }}>
              {currentStep.detailExplanation.simpleWords}
            </div>
          </div>

          <div className="docker-explanation-box" style={{ borderLeft: '3px solid #38bdf8' }}>
            <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.35rem', letterSpacing: '0.04em' }}>
              ⚙️ Technical Mechanics
            </div>
            <div style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.6 }}>
              {currentStep.detailExplanation.technicalMechanics}
            </div>
          </div>
        </div>

        {currentStep.dockerTrace && (
          <div className="docker-live-trace-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.84rem', color: '#38bdf8', overflowX: 'auto', maxWidth: 'calc(100% - 90px)' }}>
              <span style={{ color: '#94a3b8', whiteSpace: 'nowrap' }}>Live Trace:</span>
              <code style={{ whiteSpace: 'nowrap' }}>$ {currentStep.dockerTrace}</code>
            </div>
            <button
              onClick={() => handleCopy(currentStep.dockerTrace!, true)}
              className="docker-flow-tool-btn"
              style={{
                color: copiedTrace ? '#10b981' : '#ffffff',
                borderColor: copiedTrace ? '#10b981' : 'rgba(255, 255, 255, 0.2)',
                background: copiedTrace ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                gap: '0.35rem',
              }}
            >
              {copiedTrace ? <Check size={13} /> : <Copy size={13} />}
              <span>{copiedTrace ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        )}
      </div>

      {/* 5. FIXED COMPONENT INSPECTOR MODAL (Centered in Viewport) */}
      {inspectedBlock && (
        <div
          className="docker-inspector-overlay"
          onClick={() => setInspectedBlock(null)}
        >
          <div
            className="docker-inspector-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: getCategoryColor(inspectedBlock.category).bg,
                    border: `1.5px solid ${getCategoryColor(inspectedBlock.category).border}`,
                    color: getCategoryColor(inspectedBlock.category).text,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {getBlockIcon(inspectedBlock.icon)}
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff' }}>
                    {inspectedBlock.label}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '0.1rem' }}>
                    {inspectedBlock.sublabel} &bull; {inspectedBlock.category.toUpperCase()}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setInspectedBlock(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  padding: '0.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Close (Esc)"
              >
                <X size={18} />
              </button>
            </div>

            {/* Role */}
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.35rem', letterSpacing: '0.04em' }}>
                Core Architectural Role
              </div>
              <div style={{ fontSize: '0.92rem', color: '#f1f5f9', lineHeight: 1.6 }}>
                {inspectedBlock.details.role}
              </div>
            </div>

            {/* Key Insight */}
            <div style={{ background: 'rgba(14, 165, 233, 0.08)', border: '1px solid rgba(14, 165, 233, 0.3)', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0ea5e9', textTransform: 'uppercase', marginBottom: '0.35rem', letterSpacing: '0.04em' }}>
                💡 Key SRE &amp; Container Insight
              </div>
              <div style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.55 }}>
                {inspectedBlock.details.keyInsight}
              </div>
            </div>

            {/* Diagnostic Command */}
            <div>
              <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
                Docker Diagnostic Command
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#040816', border: '1px solid rgba(14, 165, 233, 0.3)', borderRadius: '9px', padding: '0.75rem 1rem', gap: '0.75rem', flexWrap: 'wrap' }}>
                <code style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.88rem', color: '#34d399', fontWeight: 700, overflowX: 'auto' }}>
                  $ {inspectedBlock.details.cliDiagnostic}
                </code>
                <button
                  onClick={() => handleCopy(inspectedBlock.details.cliDiagnostic, false)}
                  className="docker-flow-tool-btn"
                  style={{
                    color: copiedDiag ? '#10b981' : '#ffffff',
                    borderColor: copiedDiag ? '#10b981' : 'rgba(255, 255, 255, 0.2)',
                    background: copiedDiag ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                    gap: '0.35rem',
                  }}
                >
                  {copiedDiag ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedDiag ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.35rem' }}>
              <button
                onClick={() => setInspectedBlock(null)}
                style={{
                  background: 'var(--docker-blue, #0ea5e9)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '0.55rem 1.25rem',
                  borderRadius: '9px',
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(14, 165, 233, 0.4)',
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
