import React, { useState } from 'react';
import { DOCKER_LAB_SCENARIOS, DockerLabScenario } from '../../data/dockerLabs';
import { useDocker } from '../../context/DockerContext';
import { DockerTerminal } from '../terminal/DockerTerminal';
import { ShieldAlert, CheckCircle2, ArrowRight, RefreshCw, Terminal, AlertTriangle, Lightbulb } from 'lucide-react';

export const DockerLabsHubView: React.FC = () => {
  const { executeCommand } = useDocker();
  const [activeScenarioId, setActiveScenarioId] = useState<string>(DOCKER_LAB_SCENARIOS[0].id);
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);

  const activeLab = DOCKER_LAB_SCENARIOS.find((s) => s.id === activeScenarioId) || DOCKER_LAB_SCENARIOS[0];

  const handleVerifyStep = (stepIdx: number, expectedCmd: string) => {
    executeCommand(expectedCmd);
    if (stepIdx === activeLab.guidedSteps.length - 1) {
      if (!completedScenarios.includes(activeLab.id)) {
        setCompletedScenarios([...completedScenarios, activeLab.id]);
      }
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', height: '100%', width: '100%', overflow: 'hidden' }}>
      {/* Left Sidebar: Lab Scenarios */}
      <aside style={{ width: '320px', flexShrink: 0, background: 'var(--docker-surface)', borderRight: '1px solid var(--docker-border)', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--docker-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: 800, fontSize: '0.85rem' }}>
            <ShieldAlert size={18} />
            <span>Incident Triage &amp; SRE Labs</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--docker-text-muted)', marginTop: '0.3rem' }}>
            Diagnose &amp; resolve broken Docker production failures.
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }}>
          {DOCKER_LAB_SCENARIOS.map((lab) => {
            const isActive = lab.id === activeScenarioId;
            const isResolved = completedScenarios.includes(lab.id);

            return (
              <div
                key={lab.id}
                onClick={() => setActiveScenarioId(lab.id)}
                style={{
                  padding: '0.85rem',
                  borderRadius: '10px',
                  background: isActive ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255,255,255,0.03)',
                  border: isActive ? '1px solid var(--docker-border-active)' : '1px solid transparent',
                  cursor: 'pointer',
                  marginBottom: '0.5rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isActive ? '#fff' : 'var(--docker-text-primary)' }}>
                    {lab.title}
                  </span>
                  {isResolved && <CheckCircle2 size={15} color="#22c55e" />}
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--docker-text-secondary)', marginBottom: '0.4rem' }}>
                  {lab.category} &bull; {lab.difficulty}
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main Lab Resolution Workspace */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', background: 'var(--docker-dark-bg)', padding: '1.75rem 2rem 3rem' }}>
        {/* Lab Header */}
        <div className="docker-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            <AlertTriangle size={15} />
            <span>Active Incident Breakdown</span>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', margin: '0 0 0.5rem' }}>
            {activeLab.title}
          </h2>

          <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 1rem' }}>
            {activeLab.summary}
          </p>

          <div style={{ background: '#090d16', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--docker-border)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: '#ef4444' }}>
            Symptom: {activeLab.symptom}
          </div>
        </div>

        {/* Guided Triage Steps & Terminal */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '1.5rem', height: '480px' }}>
          {/* Steps */}
          <div className="docker-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--docker-blue)', marginBottom: '1rem' }}>
              Recommended Resolution Steps:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activeLab.guidedSteps.map((step, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--docker-border)' }}>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                    Step {idx + 1}: {step.instruction}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <code style={{ fontSize: '0.78rem', color: '#38bdf8', fontFamily: 'JetBrains Mono, monospace' }}>
                      {step.expectedCommand}
                    </code>
                    <button
                      onClick={() => handleVerifyStep(idx, step.expectedCommand)}
                      style={{
                        padding: '0.3rem 0.65rem',
                        borderRadius: '6px',
                        background: 'var(--docker-blue)',
                        color: '#fff',
                        border: 'none',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Run Step
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {completedScenarios.includes(activeLab.id) && (
              <div style={{ marginTop: 'auto', paddingTop: '1rem', color: '#4ade80', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} />
                <span>Incident Resolved Successfully!</span>
              </div>
            )}
          </div>

          {/* Terminal */}
          <div style={{ height: '100%' }}>
            <DockerTerminal />
          </div>
        </div>
      </main>
    </div>
  );
};
