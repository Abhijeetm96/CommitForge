import React, { useState } from 'react';
import { UNDO_SCENARIOS, UndoScenario } from '../../data/undoScenarios';
import { useApp } from '../../context/AppContext';
import { RotateCcw, AlertTriangle, CheckCircle, ShieldAlert, ChevronRight, HelpCircle } from 'lucide-react';

export const UndoLabView: React.FC = () => {
  const { executeCommand } = useApp();
  const [selectedScenario, setSelectedScenario] = useState<UndoScenario>(UNDO_SCENARIOS[0]);
  const [chosenOptionIndex, setChosenOptionIndex] = useState<number | null>(null);

  const handleSelectScenario = (sc: UndoScenario) => {
    setSelectedScenario(sc);
    setChosenOptionIndex(null);
  };

  const handleOptionPick = (idx: number) => {
    setChosenOptionIndex(idx);
  };

  const handleExecute = () => {
    if (chosenOptionIndex === null) return;
    const opt = selectedScenario.options[chosenOptionIndex];
    executeCommand(opt.command);
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--git-orange)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
          <RotateCcw size={16} /> Safe Mistakes & Recovery Laboratory
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.2rem' }}>Undo Lab</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
          Real developers make mistakes every day. Git was designed with powerful undo capabilities. Select a scenario below and choose the correct recovery strategy.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem' }}>
        {/* Scenario List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {UNDO_SCENARIOS.map((sc) => (
            <div
              key={sc.id}
              onClick={() => handleSelectScenario(sc)}
              style={{
                background: selectedScenario.id === sc.id ? 'var(--bg-card-hover)' : 'var(--bg-surface)',
                border: '1px solid',
                borderColor: selectedScenario.id === sc.id ? 'var(--git-orange)' : 'var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.8rem 1rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: selectedScenario.id === sc.id ? 'var(--git-orange)' : 'var(--text-primary)' }}>
                {sc.title}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                Danger: <span style={{ color: sc.dangerLevel === 'HIGH' ? 'var(--danger)' : sc.dangerLevel === 'MEDIUM' ? 'var(--warning)' : 'var(--success)', fontWeight: 600 }}>{sc.dangerLevel}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Active Scenario Card */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            {selectedScenario.title}
          </h2>

          <div style={{ background: 'rgba(240, 80, 51, 0.08)', borderLeft: '3px solid var(--git-orange)', padding: '0.8rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--git-orange)', fontSize: '0.85rem' }}>The Situation:</div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontStyle: 'italic', marginTop: '0.2rem' }}>
              {selectedScenario.problem}
            </p>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              <strong>Context:</strong> {selectedScenario.context}
            </div>
          </div>

          <div style={{ fontWeight: 700, marginBottom: '0.8rem', color: 'var(--text-secondary)' }}>
            What is the appropriate Git command?
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.2rem' }}>
            {selectedScenario.options.map((opt, idx) => {
              const isSelected = chosenOptionIndex === idx;
              let border = 'var(--border-color)';
              let bg = 'var(--bg-app)';
              if (isSelected) {
                border = opt.isCorrect ? 'var(--success)' : 'var(--danger)';
                bg = opt.isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleOptionPick(idx)}
                  style={{
                    padding: '0.8rem 1rem',
                    background: bg,
                    border: `1px solid ${border}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <code style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--git-orange)', fontFamily: 'var(--font-mono)' }}>
                      $ {opt.command}
                    </code>
                    {isSelected && (
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: opt.isCorrect ? 'var(--success)' : 'var(--danger)' }}>
                        {opt.isCorrect ? 'CORRECT RECOVERY' : 'INCORRECT / RISKY'}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                    {opt.description}
                  </p>
                  {isSelected && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: opt.isCorrect ? 'var(--success)' : 'var(--danger)' }}>
                      {opt.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {chosenOptionIndex !== null && selectedScenario.options[chosenOptionIndex].isCorrect && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--git-cyan)' }}>
                <strong>Key Takeaway:</strong> {selectedScenario.educationalTakeaway}
              </div>
              <button
                style={{
                  background: 'var(--success)',
                  color: 'white',
                  border: 'none',
                  padding: '0.6rem 1.2rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                onClick={handleExecute}
              >
                Execute in Terminal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
