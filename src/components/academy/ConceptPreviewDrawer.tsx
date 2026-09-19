import React from 'react';
import { CurriculumNode } from '../../data/academyCurriculum';
import {
  X,
  Clock,
  CheckCircle2,
  Lock,
  ArrowRight,
  BookOpen,
  Sparkles,
  Layers,
  Terminal,
} from 'lucide-react';

interface Props {
  node: CurriculumNode | null;
  onClose: () => void;
  onStartLesson: (nodeId: string) => void;
}

export const ConceptPreviewDrawer: React.FC<Props> = ({ node, onClose, onStartLesson }) => {
  if (!node) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '420px',
        maxWidth: '90vw',
        background: '#0a0f1d',
        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.6)',
        zIndex: 1100,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        color: '#f8fafc',
      }}
    >
      {/* DRAWER HEADER */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(12, 19, 34, 0.95)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{ fontSize: '1.6rem' }}>{node.highlightIcon}</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: '#38bdf8',
                  background: 'rgba(56, 189, 248, 0.12)',
                  padding: '0.15rem 0.4rem',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                }}
              >
                Level {node.level}
              </span>
              <span style={{ fontSize: '0.68rem', color: '#64748b' }}>•</span>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{node.stage}</span>
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
              {node.title}
            </h3>
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
            padding: '0.3rem',
            borderRadius: '6px',
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* DRAWER BODY */}
      <div
        style={{
          flex: 1,
          padding: '1.25rem 1.5rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        {/* SUMMARY & WHY IT EXISTS */}
        <div>
          <div style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '0.75rem' }}>
            {node.description}
          </div>

          <div
            style={{
              background: 'rgba(56, 189, 248, 0.06)',
              borderLeft: '3px solid #38bdf8',
              padding: '0.6rem 0.85rem',
              borderRadius: '0 6px 6px 0',
            }}
          >
            <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#38bdf8', marginBottom: '0.2rem' }}>
              Why This Concept Exists
            </div>
            <div style={{ fontSize: '0.78rem', color: '#e2e8f0', lineHeight: 1.45 }}>
              {node.whyItExists}
            </div>
          </div>
        </div>

        {/* METADATA CHIPS (TIME, DIFFICULTY, STATUS) */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '0.25rem 0.6rem',
              borderRadius: '999px',
              fontSize: '0.72rem',
              color: '#94a3b8',
            }}
          >
            <Clock size={12} />
            <span>~{node.estimatedMinutes} mins</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '0.25rem 0.6rem',
              borderRadius: '999px',
              fontSize: '0.72rem',
              color: '#94a3b8',
            }}
          >
            <span>{node.difficulty}</span>
          </div>

          {node.isFullyImplemented && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                background: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '0.25rem 0.6rem',
                borderRadius: '999px',
                fontSize: '0.72rem',
                color: '#4ade80',
                fontWeight: 700,
              }}
            >
              <Sparkles size={12} />
              <span>Interactive Lesson Active</span>
            </div>
          )}
        </div>

        {/* WHAT YOU'LL LEARN */}
        <div>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#94a3b8',
              marginBottom: '0.5rem',
            }}
          >
            What You’ll Learn
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {node.concepts.map((concept, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem', color: '#e2e8f0' }}>
                <CheckCircle2 size={14} color="#38bdf8" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                <span>{concept}</span>
              </div>
            ))}
          </div>
        </div>

        {/* IMPORTANT COMMANDS */}
        {node.commands.length > 0 && (
          <div>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#94a3b8',
                marginBottom: '0.5rem',
              }}
            >
              Commands & Syntax Introduced
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {node.commands.map((cmd, idx) => (
                <code
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#38bdf8',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                  }}
                >
                  {cmd}
                </code>
              ))}
            </div>
          </div>
        )}

        {/* PREREQUISITES */}
        {node.prerequisites.length > 0 && (
          <div>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#94a3b8',
                marginBottom: '0.35rem',
              }}
            >
              Prerequisites
            </div>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
              Requires foundations from previous level nodes.
            </div>
          </div>
        )}
      </div>

      {/* DRAWER FOOTER / ACTION BUTTON */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(12, 19, 34, 0.95)',
        }}
      >
        {node.isFullyImplemented ? (
          <button
            type="button"
            onClick={() => onStartLesson(node.id)}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
              color: '#0f172a',
              border: 'none',
              padding: '0.85rem 1.25rem',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(56, 189, 248, 0.35)',
              transition: 'all 0.15s ease',
            }}
          >
            <span>Start Teacher-Led Lesson</span>
            <ArrowRight size={17} />
          </button>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                color: '#94a3b8',
                fontSize: '0.76rem',
              }}
            >
              <Lock size={13} />
              <span>Curriculum preview • Teacher lesson coming next</span>
            </div>
            <button
              type="button"
              disabled
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#64748b',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '0.75rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
              }}
            >
              <span>Coming Next</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
