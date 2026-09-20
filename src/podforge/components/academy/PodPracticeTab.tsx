import React, { useState } from 'react';
import type { KubeConcept } from '../../data/topics/types';
import { useApp } from '../../context/AppContext';
import {
  Code2,
  Play,
  CheckCircle2,
  Lightbulb,
  HelpCircle,
  Sparkles,
  Terminal,
  RotateCcw,
} from 'lucide-react';

interface Props {
  concept: KubeConcept;
}

export const PodPracticeTab: React.FC<Props> = ({ concept }) => {
  const { executeCommand, markConceptComplete, completedConcepts } = useApp();
  const [input, setInput] = useState('');
  const [outputLogs, setOutputLogs] = useState<string[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isCompleted = completedConcepts.includes(concept.id);

  const handleRun = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    executeCommand(trimmed);

    const newLogs = [...outputLogs, `$ ${trimmed}`];

    if (trimmed === concept.practiceChallenge.goalCommand) {
      newLogs.push(concept.practiceChallenge.expectedOutput || 'Success! Resource state verified and updated.');
      setIsSuccess(true);
      markConceptComplete(concept.id);
    } else {
      newLogs.push(`Command executed: ${trimmed}. Note: To pass the challenge, run the exact target goal command.`);
    }

    setOutputLogs(newLogs);
    setInput('');
  };

  const handleAutoFill = () => {
    setInput(concept.practiceChallenge.goalCommand);
  };

  const handleReset = () => {
    setOutputLogs([]);
    setIsSuccess(false);
    setInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.25s ease-out' }}>
      {/* Challenge Hero */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: '#10b981', fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase' }}>
            <Lightbulb size={16} />
            <span>Interactive Terminal Challenge</span>
          </div>

          {isCompleted && (
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.2rem 0.65rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={13} /> Completed
            </span>
          )}
        </div>

        <div style={{ fontSize: '1.05rem', color: '#fff', fontWeight: 700, lineHeight: 1.5 }}>
          {concept.practiceChallenge.instructions}
        </div>

        {/* Action Goal Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Target Command:</span>
          <code
            onClick={handleAutoFill}
            title="Click to copy into terminal prompt"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              color: '#38bdf8',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              padding: '0.25rem 0.6rem',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            $ {concept.practiceChallenge.goalCommand}
          </code>
          <button
            onClick={handleAutoFill}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.72rem',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            (Fill prompt)
          </button>
        </div>
      </div>

      {/* Terminal Sandbox Console */}
      <div
        style={{
          background: '#040711',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Terminal Title Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.65rem 1.15rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.74rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span style={{ marginLeft: '0.4rem', color: '#e2e8f0', fontWeight: 700 }}>kubernetes-cluster-shell (~/kube)</span>
          </div>

          <button
            onClick={handleReset}
            title="Reset Terminal Output"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.72rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <RotateCcw size={12} /> Clear
          </button>
        </div>

        {/* Output Stream */}
        <div
          style={{
            padding: '1rem 1.25rem',
            minHeight: '140px',
            maxHeight: '260px',
            overflowY: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            lineHeight: 1.6,
            color: '#cbd5e1',
          }}
        >
          {outputLogs.length === 0 ? (
            <div style={{ color: '#64748b', fontStyle: 'italic' }}>
              # Kubernetes terminal session active. Type or auto-fill the target command below to verify the cluster state.
            </div>
          ) : (
            outputLogs.map((log, i) => (
              <div
                key={i}
                style={{
                  color: log.startsWith('$') ? '#38bdf8' : log.startsWith('Success') ? '#10b981' : '#cbd5e1',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {log}
              </div>
            ))
          )}
        </div>

        {/* Interactive Prompt Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.75rem 1.15rem',
            background: 'rgba(0, 0, 0, 0.3)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#02040a', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '8px', padding: '0.45rem 0.85rem', fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: 'var(--k8s-cyan)', marginRight: '0.6rem', fontWeight: 800 }}>$</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRun()}
              placeholder={`Type: ${concept.practiceChallenge.goalCommand}`}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                width: '100%',
                fontSize: '0.84rem',
                fontFamily: 'var(--font-mono)',
              }}
            />
          </div>

          <button
            onClick={handleRun}
            style={{
              background: 'linear-gradient(135deg, #326ce5 0%, #0284c7 100%)',
              color: '#fff',
              border: 'none',
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 4px 12px rgba(50, 108, 229, 0.3)',
            }}
          >
            <Play size={14} /> Execute
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {isSuccess && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid #10b981',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            animation: 'fadeIn 0.25s ease-out',
          }}
        >
          <CheckCircle2 size={22} style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>Challenge Mastered!</div>
            <div style={{ fontSize: '0.82rem', color: '#a7f3d0' }}>
              Concept {concept.number} has been marked as complete. You are ready to proceed to the next concept or review solutions below.
            </div>
          </div>
        </div>
      )}

      {/* Hints & Solution Drawers */}
      <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setShowHints(!showHints)}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '0.45rem 0.85rem',
            color: showHints ? '#f59e0b' : 'var(--text-secondary)',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Lightbulb size={14} />
          <span>{showHints ? 'Hide Hints' : 'Need a Hint?'}</span>
        </button>

        <button
          onClick={() => setShowSolution(!showSolution)}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '0.45rem 0.85rem',
            color: showSolution ? '#38bdf8' : 'var(--text-secondary)',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <HelpCircle size={14} />
          <span>{showSolution ? 'Hide Solution Explanation' : 'View Solution Explanation'}</span>
        </button>
      </div>

      {showHints && (
        <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase' }}>
            Helpful Guidance
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.6 }}>
            {concept.practiceChallenge.hints.map((hint, i) => (
              <li key={i}>{hint}</li>
            ))}
          </ul>
        </div>
      )}

      {showSolution && (
        <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
            Solution Analysis
          </div>
          <div style={{ fontSize: '0.84rem', color: '#e2e8f0', lineHeight: 1.6 }}>
            {concept.practiceChallenge.solutionExplanation || `Execute \`${concept.practiceChallenge.goalCommand}\` to query the Kubernetes API server and verify this resource status.`}
          </div>
        </div>
      )}
    </div>
  );
};
