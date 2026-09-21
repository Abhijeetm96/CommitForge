import React, { useState, useEffect } from 'react';
import type { KubeConcept } from '../../data/topics/types';
import { getDockerBridgeForConcept } from '../../data/topics/dockerBridgeData';
import { KubeFlowDiagram } from '../diagrams/KubeFlowDiagram';
import {
  BookOpen,
  Lightbulb,
  Boxes,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  Award,
  Terminal,
  Copy,
  Check,
  Sparkles,
  Zap,
  ListChecks,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Anchor,
} from 'lucide-react';

interface Props {
  concept: KubeConcept;
}

export const PodConceptOverviewTab: React.FC<Props> = ({ concept }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [isPlayingLifecycle, setIsPlayingLifecycle] = useState<boolean>(false);
  const [copiedDockerCmd, setCopiedDockerCmd] = useState<boolean>(false);

  const dockerBridge = getDockerBridgeForConcept(concept);

  // Auto-play lifecycle stepper
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isPlayingLifecycle && concept.lifecycleSteps && concept.lifecycleSteps.length > 0) {
      timer = setInterval(() => {
        setActiveStepIdx((prev) => (prev + 1) % (concept.lifecycleSteps?.length || 1));
      }, 2800);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlayingLifecycle, concept.lifecycleSteps]);

  // Reset active step when concept changes
  useEffect(() => {
    setActiveStepIdx(0);
    setIsPlayingLifecycle(false);
  }, [concept.id]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        animation: 'fadeIn 0.25s ease-out',
      }}
    >
      {/* CURATED SUBTOPICS & SYLLABUS COVERAGE */}
      {concept.subtopics && concept.subtopics.length > 0 && (
        <section
          style={{
            background: 'linear-gradient(135deg, rgba(50, 108, 229, 0.12) 0%, rgba(56, 189, 248, 0.06) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '12px',
            padding: '0.9rem 1.15rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.74rem', fontWeight: 800, color: 'var(--k8s-cyan)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <ListChecks size={15} color="var(--k8s-cyan)" />
            <span>Curated Subtopics & Core Syllabus Inquiries</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {concept.subtopics.map((sub, i) => (
              <span
                key={i}
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#e2e8f0',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span style={{ color: 'var(--k8s-cyan)', fontSize: '0.7rem' }}>•</span>
                {sub}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 1. WHAT IS IT & IN SIMPLE WORDS DUAL CARDS */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={18} color="var(--k8s-cyan)" />
          <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
            1. Concept Definition & Mental Model
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
          }}
        >
          {/* Technical Definition */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: '12px',
              padding: '1.15rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              boxShadow: '0 4px 18px rgba(0, 0, 0, 0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.74rem', fontWeight: 800, color: 'var(--k8s-cyan)', textTransform: 'uppercase' }}>
              <Zap size={14} color="var(--k8s-cyan)" />
              <span>Authoritative Technical Definition</span>
            </div>
            <div style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.65 }}>
              {concept.whatIsIt || concept.description}
            </div>
          </div>

          {/* In Simple Words */}
          <div
            style={{
              background: 'rgba(56, 189, 248, 0.05)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '12px',
              padding: '1.15rem',
              display: 'flex',
              gap: '0.85rem',
              boxShadow: '0 4px 18px rgba(56, 189, 248, 0.05)',
            }}
          >
            <div style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }}>
              <Lightbulb size={22} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase' }}>
                In Simple Words (ELI5)
              </div>
              <div style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                {concept.inSimpleWords || concept.description}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DOCKER TO KUBERNETES CONCEPT BRIDGE */}
      {dockerBridge && (
        <section
          style={{
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(50, 108, 229, 0.06) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '14px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                <Anchor size={16} />
              </div>
              <div>
                <span style={{ fontSize: '0.96rem', fontWeight: 800, color: '#fff' }}>
                  Docker &rarr; Kubernetes Mental Model Bridge
                </span>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                  Beginner Transition: Translating standalone container habits into clustered orchestrator primitives
                </div>
              </div>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 700 }}>
              Zero-Friction Guide
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '0.85rem' }}>
            {/* Docker Side */}
            <div style={{ background: 'rgba(0, 0, 0, 0.35)', border: '1px solid rgba(14, 165, 233, 0.25)', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
                <span>🐳 In Standalone Docker (Single Host)</span>
              </div>
              <div style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                {dockerBridge.dockerEquivalent}
              </div>
              {dockerBridge.dockerCommand && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '0.35rem 0.65rem', borderRadius: '6px', marginTop: '0.25rem' }}>
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: '#7dd3fc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    $ {dockerBridge.dockerCommand}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(dockerBridge.dockerCommand || '');
                      setCopiedDockerCmd(true);
                      setTimeout(() => setCopiedDockerCmd(false), 2000);
                    }}
                    style={{ background: 'transparent', border: 'none', color: copiedDockerCmd ? '#10b981' : '#94a3b8', cursor: 'pointer', padding: '0.2rem', marginLeft: '0.5rem' }}
                    title="Copy Docker command"
                  >
                    {copiedDockerCmd ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                </div>
              )}
            </div>

            {/* Kubernetes Side */}
            <div style={{ background: 'rgba(50, 108, 229, 0.1)', border: '1px solid rgba(50, 108, 229, 0.35)', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.75rem', fontWeight: 800, color: '#60a5fa', textTransform: 'uppercase' }}>
                <span>☸️ In Clustered Kubernetes (Multi-Node)</span>
              </div>
              <div style={{ fontSize: '0.84rem', color: '#e2e8f0', lineHeight: 1.55 }}>
                {dockerBridge.k8sEquivalent}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.45rem', marginTop: '0.15rem' }}>
                <strong>Key Architectural Shift:</strong> {dockerBridge.keyDifference}
              </div>
            </div>
          </div>

          {/* Why K8s Approach */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '8px', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <Sparkles size={16} color="#38bdf8" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5 }}>
              <strong style={{ color: '#fff' }}>Why Kubernetes Takes This Approach:</strong> {dockerBridge.whyK8sApproach}
            </span>
          </div>
        </section>
      )}

      {/* 2. REAL-WORLD ANALOGY */}
      {concept.realWorldAnalogy && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Boxes size={18} color="#10b981" />
            <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
              2. Real-World Physical Analogy
            </h2>
          </div>

          <div
            style={{
              background: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '12px',
              padding: '1.15rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                METAPHOR
              </span>
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff' }}>
                {concept.realWorldAnalogy.metaphor}
              </span>
            </div>
            <div style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.65 }}>
              {concept.realWorldAnalogy.explanation}
            </div>
          </div>
        </section>
      )}

      {/* 3. ARCHITECTURAL EXPLANATION */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="var(--k8s-blue)" />
          <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
            3. Deep Architectural Explanation
          </h2>
        </div>

        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1.25rem',
            fontSize: '0.88rem',
            color: '#e2e8f0',
            lineHeight: 1.75,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          {concept.explanation}
        </div>
      </section>

      {/* 4. DECISION MATRIX: WHEN TO USE VS WHEN NOT TO USE */}
      {(concept.whenToUse || concept.whenNotToUse) && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={18} color="#c084fc" />
            <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
              4. Decision Matrix: When to Use vs When NOT to Use
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
            }}
          >
            {/* When to Use */}
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.04)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '12px',
                padding: '1.15rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>
                <CheckCircle2 size={16} color="#10b981" />
                <span>When to Use / Target Workloads</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                {concept.whenToUse?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* When NOT to Use */}
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.04)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '12px',
                padding: '1.15rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase' }}>
                <XCircle size={16} color="#ef4444" />
                <span>When NOT to Use / Anti-Patterns</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                {concept.whenNotToUse?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* 5. INTERACTIVE ARCHITECTURAL LIFECYCLE STEPPER */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} color="#38bdf8" />
            <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
              5. Interactive Control Plane & Kernel Lifecycle Player
            </h2>
          </div>

          {/* Playback Controls */}
          {concept.lifecycleSteps && concept.lifecycleSteps.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.25rem 0.6rem' }}>
              <button
                onClick={() => {
                  setIsPlayingLifecycle(false);
                  setActiveStepIdx((prev) => (prev > 0 ? prev - 1 : (concept.lifecycleSteps?.length || 1) - 1));
                }}
                title="Previous Step"
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.2rem' }}
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={() => setIsPlayingLifecycle(!isPlayingLifecycle)}
                title={isPlayingLifecycle ? 'Pause' : 'Auto-Play Stepper'}
                style={{ background: isPlayingLifecycle ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.2)', border: isPlayingLifecycle ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(56, 189, 248, 0.4)', color: isPlayingLifecycle ? '#ef4444' : '#38bdf8', cursor: 'pointer', padding: '0.25rem 0.65rem', borderRadius: '5px', fontSize: '0.74rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                {isPlayingLifecycle ? <Pause size={13} /> : <Play size={13} />}
                <span>{isPlayingLifecycle ? 'Pause' : 'Auto Play'}</span>
              </button>

              <button
                onClick={() => {
                  setIsPlayingLifecycle(false);
                  setActiveStepIdx((prev) => (prev + 1) % (concept.lifecycleSteps?.length || 1));
                }}
                title="Next Step"
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.2rem' }}
              >
                <ChevronRight size={16} />
              </button>

              <button
                onClick={() => {
                  setIsPlayingLifecycle(false);
                  setActiveStepIdx(0);
                }}
                title="Reset to Step 1"
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', marginLeft: '0.25rem', padding: '0.2rem' }}
              >
                <RotateCcw size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Visual Interactive Block Diagram Engine */}
        <KubeFlowDiagram concept={concept} compact={true} />

        {/* Interactive Step Scrubber and Cards */}
        {concept.lifecycleSteps && concept.lifecycleSteps.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Scrubber pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', overflowX: 'auto', padding: '0.2rem 0' }}>
              {concept.lifecycleSteps.map((step, idx) => {
                const isActive = activeStepIdx === idx;
                return (
                  <button
                    key={step.step}
                    onClick={() => {
                      setIsPlayingLifecycle(false);
                      setActiveStepIdx(idx);
                    }}
                    style={{
                      background: isActive ? 'var(--k8s-blue)' : 'rgba(255, 255, 255, 0.05)',
                      border: isActive ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: isActive ? '#fff' : 'var(--text-muted)',
                      borderRadius: '8px',
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.76rem',
                      fontWeight: isActive ? 800 : 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>Step {step.step}: {step.title.split(':')[0] || step.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Step Feature Hero Card */}
            {concept.lifecycleSteps[activeStepIdx] && (
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(50, 108, 229, 0.15) 0%, rgba(56, 189, 248, 0.08) 100%)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  boxShadow: '0 8px 24px rgba(50, 108, 229, 0.12)',
                  animation: 'fadeIn 0.2s ease-out',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--k8s-blue)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.85rem' }}>
                      {concept.lifecycleSteps[activeStepIdx].step}
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
                      {concept.lifecycleSteps[activeStepIdx].title}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 700, background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '0.2rem 0.65rem', borderRadius: '999px' }}>
                    Active Step {activeStepIdx + 1} of {concept.lifecycleSteps.length}
                  </span>
                </div>

                <div style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.65 }}>
                  {concept.lifecycleSteps[activeStepIdx].description}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 6. KEY MECHANISMS DECK */}
      {concept.keyMechanisms && concept.keyMechanisms.length > 0 && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={18} color="#f59e0b" />
            <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
              6. Low-Level Mechanics & Primitives
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '0.85rem',
            }}
          >
            {concept.keyMechanisms.map((mech, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem',
                }}
              >
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#38bdf8' }}>
                  {mech.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {mech.detail}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. PRODUCTION & CKA/CKAD FIELD WISDOM */}
      {concept.productionTips && concept.productionTips.length > 0 && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} color="#c084fc" />
            <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
              7. Production SRE Wisdom & CKA Exam Tips
            </h2>
          </div>

          <div
            style={{
              background: 'rgba(192, 132, 252, 0.05)',
              border: '1px solid rgba(192, 132, 252, 0.25)',
              borderRadius: '12px',
              padding: '1.15rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
            }}
          >
            {concept.productionTips.map((tip, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
                <span style={{ color: '#c084fc', marginTop: '2px', flexShrink: 0 }}>✦</span>
                <span style={{ fontSize: '0.84rem', color: '#e2e8f0', lineHeight: 1.6 }}>{tip}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. FREQUENTLY USED KUBECTL COMMANDS WITH QUICK COPY */}
      {concept.kubectlCommands && concept.kubectlCommands.length > 0 && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Terminal size={18} color="var(--k8s-cyan)" />
            <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
              8. Core Kubectl Commands Quick Reference
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {concept.kubectlCommands.map((cmd, i) => (
              <div
                key={i}
                style={{
                  background: '#070c18',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '0.65rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: 'var(--k8s-cyan)', overflowX: 'auto' }}>
                  <span style={{ color: '#64748b' }}>$</span>
                  <span>{cmd}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(cmd, i)}
                  title="Copy command to clipboard"
                  style={{
                    background: copiedIndex === i ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid',
                    borderColor: copiedIndex === i ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '0.3rem 0.55rem',
                    color: copiedIndex === i ? '#10b981' : '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    transition: 'all 0.15s ease',
                    flexShrink: 0,
                  }}
                >
                  {copiedIndex === i ? (
                    <>
                      <Check size={12} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
