import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UniversalConcept, ACADEMY_18_TOPICS } from '../../data/unifiedAcademyData';
import { Terminal as TerminalIcon, RotateCcw, Play, CheckCircle2, ChevronRight } from 'lucide-react';
import { AcademyConceptTab } from './UniversalConceptHero';

interface Props {
  concept: UniversalConcept;
  onOpenCenterSandbox?: () => void;
  _isFullView?: boolean;
  onSelectConcept?: (conceptId: string, targetTab?: AcademyConceptTab) => void;
}

export const InteractiveTerminalSandbox: React.FC<Props> = ({ concept, onOpenCenterSandbox, onSelectConcept }) => {
  const { executeCommand } = useApp();

  const [activeTab, setActiveTab] = useState<'terminal' | 'guided'>('terminal');
  const [inputVal, setInputVal] = useState<string>('');
  const [history, setHistory] = useState<{ command: string; output: string[] }[]>([]);
  const [guidedStepIndex, setGuidedStepIndex] = useState<number>(0);
  const terminalOutputRef = useRef<HTMLDivElement>(null);

  const handleReset = () => {
    // Run seed commands from sandbox
    const seed = concept.sandbox?.initialCommands || [];
    const initialHist: { command: string; output: string[] }[] = [];

    seed.forEach((cmd) => {
      const res = executeCommand(cmd);
      initialHist.push({
        command: cmd,
        output: res.stdout || (res.success ? ['OK'] : [res.error || 'Failed']),
      });
    });

    setHistory(initialHist);
    setGuidedStepIndex(0);
    setInputVal('');
  };

  // Initialize terminal on concept load
  useEffect(() => {
    handleReset();
  }, [concept.id]);

  useEffect(() => {
    if (terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
    }
  }, [history]);

  const handleRunCommand = (cmdToRun?: string) => {
    const raw = (cmdToRun !== undefined ? cmdToRun : inputVal).trim();
    if (!raw) return;

    const res = executeCommand(raw);
    const out: string[] = [];
    if (res.stdout && res.stdout.length > 0) {
      out.push(...res.stdout);
    } else if (res.stderr && res.stderr.length > 0) {
      out.push(...res.stderr);
    } else if (res.error) {
      out.push(`fatal: ${res.error}`);
    } else if (res.success) {
      // Provide positive feedback if output is empty
      if (raw.startsWith('git add')) {
        out.push('Staged successfully.');
      } else if (raw.startsWith('git restore --staged')) {
        out.push('Unstaged changes from index.');
      }
    }

    setHistory((prev) => [...prev, { command: raw, output: out }]);
    setInputVal('');

    // Check guided step progression
    if (activeTab === 'guided') {
      const guidedSteps = concept.sandbox?.guidedSteps || [];
      const targetStep = guidedSteps[guidedStepIndex];
      if (targetStep && (raw === targetStep.command || raw.includes(targetStep.command.split(' ')[1] || ''))) {
        if (guidedStepIndex < guidedSteps.length - 1) {
          setGuidedStepIndex((prev) => prev + 1);
        }
      }
    }
  };

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        boxShadow: 'var(--card-shadow, 0 4px 20px rgba(0, 0, 0, 0.15))',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '0.85rem 1rem 0.65rem 1rem',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-surface)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center' }}>
              <TerminalIcon size={16} />
            </span>
            <span style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Live Sandbox
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            {onSelectConcept && (
              <select
                value={concept.id}
                onChange={(e) => onSelectConcept(e.target.value, 'Sandbox')}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  borderRadius: '6px',
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.72rem',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {ACADEMY_18_TOPICS.map((topic) => (
                  <optgroup key={topic.id} label={`Topic ${topic.number}: ${topic.title}`}>
                    {topic.concepts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.command} — {c.title}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            )}

            <span
              style={{
                fontSize: '0.66rem',
                fontWeight: 800,
                color: '#22c55e',
                background: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '0.12rem 0.45rem',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e' }} />
              ONLINE
            </span>
            {onOpenCenterSandbox && (
              <button
                onClick={onOpenCenterSandbox}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-primary)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '0.1rem 0.3rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}
                title="Expand sandbox to center stage"
              >
                Expand
                <ChevronRight size={12} />
              </button>
            )}
          </div>
        </div>
        <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
          Run real Git commands in an isolated interactive repository.
        </div>
      </div>

      {/* Sub-Tabs: Interactive Terminal | Guided Steps | Reset */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.4rem 0.75rem',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            onClick={() => setActiveTab('terminal')}
            style={{
              background: activeTab === 'terminal' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              border: 'none',
              borderRadius: '6px',
              color: activeTab === 'terminal' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontSize: '0.74rem',
              fontWeight: 700,
              padding: '0.25rem 0.55rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Interactive Terminal
          </button>
          <button
            onClick={() => setActiveTab('guided')}
            style={{
              background: activeTab === 'guided' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              border: 'none',
              borderRadius: '6px',
              color: activeTab === 'guided' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontSize: '0.74rem',
              fontWeight: 700,
              padding: '0.25rem 0.55rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Guided Steps
          </button>
        </div>

        <button
          onClick={handleReset}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.72rem',
            cursor: 'pointer',
            padding: '0.2rem 0.4rem',
            borderRadius: '4px',
            transition: 'all 0.15s ease',
          }}
          title="Reset sandbox"
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>

      {/* Guided Steps Helper Banner */}
      {activeTab === 'guided' && (
        <div
          style={{
            background: 'rgba(56, 189, 248, 0.08)',
            borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
            padding: '0.65rem 0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}
        >
          {concept.sandbox?.guidedSteps && concept.sandbox.guidedSteps.length > 0 ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8' }}>
                  Step {guidedStepIndex + 1} of {concept.sandbox.guidedSteps.length}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  {concept.sandbox.guidedSteps[guidedStepIndex]?.hint}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#f8fafc', fontWeight: 600 }}>
                {concept.sandbox.guidedSteps[guidedStepIndex]?.instruction}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                <button
                  onClick={() => handleRunCommand(concept.sandbox?.guidedSteps?.[guidedStepIndex]?.command)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    background: '#38bdf8',
                    color: '#090e1a',
                    border: 'none',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Play size={11} />
                  Run: {concept.sandbox?.guidedSteps?.[guidedStepIndex]?.command}
                </button>
              </div>
            </>
          ) : (
            <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
              No guided steps configured for this command yet. You can run any command directly below.
            </div>
          )}
        </div>
      )}

      {/* Terminal Output Area */}
      <div
        ref={terminalOutputRef}
        style={{
          padding: '0.85rem 1rem',
          background: '#040711',
          minHeight: '190px',
          maxHeight: '260px',
          overflowY: 'auto',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: '0.78rem',
          lineHeight: 1.5,
          color: '#cbd5e1',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem',
        }}
      >
        {history.map((entry, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8' }}>
              <span style={{ color: '#22c55e', fontWeight: 700 }}>$</span>
              <span style={{ fontWeight: 600, color: '#f8fafc' }}>{entry.command}</span>
            </div>
            {entry.output.map((line, lIdx) => (
              <div key={lIdx} style={{ color: '#94a3b8', paddingLeft: '0.85rem', whiteSpace: 'pre-wrap' }}>
                {line}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Command Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRunCommand();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.6rem 0.85rem',
          background: '#070b14',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <span style={{ color: '#22c55e', fontWeight: 700, fontSize: '0.85rem' }}>$</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Type your next command..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#f8fafc',
            fontFamily: 'ui-monospace, monospace',
            fontSize: '0.8rem',
          }}
        />
        <button
          type="submit"
          disabled={!inputVal.trim()}
          style={{
            background: inputVal.trim() ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)',
            color: inputVal.trim() ? '#090e1a' : '#64748b',
            border: 'none',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputVal.trim() ? 'pointer' : 'default',
            transition: 'all 0.15s ease',
          }}
          title="Run command"
        >
          <ChevronRight size={14} />
        </button>
      </form>
    </div>
  );
};
