import React, { useState } from 'react';
import type { KubeConcept } from '../../data/topics/types';
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
} from 'lucide-react';

interface Props {
  concept: KubeConcept;
}

export const PodConceptOverviewTab: React.FC<Props> = ({ concept }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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

      {/* 5. LIFECYCLE & EXECUTION TIMELINE */}
      {concept.lifecycleSteps && concept.lifecycleSteps.length > 0 && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} color="#38bdf8" />
            <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
              5. Control Plane & Runtime Execution Pipeline
            </h2>
          </div>

          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {concept.lifecycleSteps.map((step) => (
              <div
                key={step.step}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.85rem',
                  borderBottom: step.step < (concept.lifecycleSteps?.length || 0) ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
                  paddingBottom: step.step < (concept.lifecycleSteps?.length || 0) ? '0.85rem' : '0',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    flexShrink: 0,
                  }}
                >
                  {step.step}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#fff' }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
