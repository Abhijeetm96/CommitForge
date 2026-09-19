import React, { useState } from 'react';
import {
  PROBLEM_SOLVER_SCENARIOS,
  ProblemSolverScenario,
  ACADEMY_CURRICULUM_NODES,
} from '../../data/academyCurriculum';
import {
  LifeBuoy,
  X,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Ban,
  Terminal,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectNode: (nodeId: string) => void;
}

export const ProblemSolverModal: React.FC<Props> = ({ isOpen, onClose, onSelectNode }) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    PROBLEM_SOLVER_SCENARIOS[0].id
  );

  if (!isOpen) return null;

  const activeScenario: ProblemSolverScenario =
    PROBLEM_SOLVER_SCENARIOS.find((s) => s.id === selectedScenarioId) ||
    PROBLEM_SOLVER_SCENARIOS[0];

  const relatedNode = ACADEMY_CURRICULUM_NODES.find(
    (n) => n.id === activeScenario.relatedNodeId
  );

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '960px',
          height: '85vh',
          maxHeight: '760px',
          background: '#090e1a',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(56, 189, 248, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          color: '#f8fafc',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div
          style={{
            padding: '1.1rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(12, 19, 34, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(240, 80, 51, 0.15)',
                border: '1px solid rgba(240, 80, 51, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f05033',
              }}
            >
              <LifeBuoy size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                Git Problem Solver
              </h2>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                Safe, contextual diagnosis for common Git panics. Never blindly force-push.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '6px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY: SPLIT VIEW (SCENARIO SELECTOR ON LEFT, DIAGNOSIS ON RIGHT) */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* LEFT: SCENARIOS LIST */}
          <div
            style={{
              width: '320px',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
              background: '#070b14',
              padding: '1rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.2rem',
                paddingLeft: '0.4rem',
              }}
            >
              What are you trying to do?
            </div>

            {PROBLEM_SOLVER_SCENARIOS.map((scenario) => {
              const isSelected = scenario.id === selectedScenarioId;
              return (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => setSelectedScenarioId(scenario.id)}
                  style={{
                    background: isSelected
                      ? 'rgba(56, 189, 248, 0.12)'
                      : 'rgba(255, 255, 255, 0.02)',
                    border: isSelected
                      ? '1px solid rgba(56, 189, 248, 0.4)'
                      : '1px solid rgba(255, 255, 255, 0.06)',
                    color: isSelected ? '#38bdf8' : '#cbd5e1',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? 700 : 500,
                    lineHeight: 1.35,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {scenario.title}
                </button>
              );
            })}
          </div>

          {/* RIGHT: DIAGNOSTIC & SAFE RECOVERY PATH */}
          <div
            style={{
              flex: 1,
              padding: '1.5rem 1.75rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.2rem',
              background: '#0a0f1d',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: '#f05033',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Diagnostic Summary
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.2rem 0 0.4rem 0' }}>
                {activeScenario.title}
              </h3>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.86rem', lineHeight: 1.45 }}>
                {activeScenario.summary}
              </p>
            </div>

            {/* WHAT HAPPENED & WHAT GIT IS DOING */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.85rem',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '0.85rem',
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  What Probably Happened
                </div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                  {activeScenario.whatProbablyHappened}
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '0.85rem',
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#4ade80', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  What Git Is Currently Doing
                </div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                  {activeScenario.whatGitIsDoing}
                </div>
              </div>
            </div>

            {/* WHAT TO INSPECT */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                1. Inspect Before Touching Code
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {activeScenario.whatToInspect.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '6px',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.8rem',
                      color: '#e2e8f0',
                      fontFamily: 'monospace',
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* RECOMMENDED RECOVERY PATH */}
            <div
              style={{
                background: 'rgba(34, 197, 94, 0.08)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '8px',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#4ade80', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                <ShieldCheck size={16} />
                <span>Recommended Safe Recovery</span>
              </div>
              <p style={{ margin: '0 0 0.65rem 0', color: '#f1f5f9', fontSize: '0.84rem', lineHeight: 1.45 }}>
                {activeScenario.recommendedRecoveryPath}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {activeScenario.safeCommands.map((cmd, idx) => (
                  <code
                    key={idx}
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      color: '#86efac',
                      padding: '0.25rem 0.55rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                    }}
                  >
                    {cmd}
                  </code>
                ))}
              </div>
            </div>

            {/* WHAT NOT TO DO & WHY */}
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f87171', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                <Ban size={15} />
                <span>What NOT to Do: {activeScenario.whatNotToDo}</span>
              </div>
              <p style={{ margin: 0, color: '#fca5a5', fontSize: '0.78rem', lineHeight: 1.4 }}>
                <strong>Why:</strong> {activeScenario.whyAvoid}
              </p>
            </div>

            {/* HOW TO VERIFY */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                How to Verify Recovery
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.8rem', lineHeight: 1.5 }}>
                {activeScenario.howToVerify.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* FOOTER: DIRECT LINK TO RELEVANT ACADEMY NODE */}
            {relatedNode && (
              <div
                style={{
                  marginTop: 'auto',
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                    Learn this deeply in the Academy
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                    Level {relatedNode.level}: {relatedNode.title}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSelectNode(relatedNode.id);
                  }}
                  style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    color: '#38bdf8',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <span>Open Academy Node</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
