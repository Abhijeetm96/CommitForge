import React, { useState } from 'react';
import { UniversalDockerConcept } from '../../data/unifiedDockerData';
import { ProcessSimulator } from './ProcessSimulator';
import { FilesystemSimulator } from './FilesystemSimulator';
import { NetworkSimulator } from './NetworkSimulator';
import { PipelineSimulator } from './PipelineSimulator';
import { ClusterSimulator } from './ClusterSimulator';
import { Code, Check, HelpCircle, Sparkles, Terminal, Play, AlertTriangle } from 'lucide-react';

interface UniversalTeachingShellProps {
  concept: UniversalDockerConcept;
  completedConceptIds: string[];
  markConceptComplete: (id: string) => void;
  executeCommand: (cmd: string) => void;
  showToast: (msg: string) => void;
}

export const UniversalTeachingShell: React.FC<UniversalTeachingShellProps> = ({
  concept,
  completedConceptIds,
  markConceptComplete,
  executeCommand,
  showToast,
}) => {
  const [simState, setSimState] = useState<'created' | 'running' | 'paused' | 'stopped' | 'removed'>('running');
  const [activeTokenIdx, setActiveTokenIdx] = useState<number | null>(null);
  const [activeVariation, setActiveVariation] = useState<number | null>(null);

  // Determine engine type from concept ID and topic
  const engineType = React.useMemo(() => {
    const id = concept.id.toLowerCase();
    const topicNum = Number(concept.topicNumber);

    if (id.includes('swarm') || id.includes('kubernetes') || id.includes('nomad') || id.includes('paas') || topicNum === 14) return 'cluster';
    if (id.includes('build') || id.includes('push') || id.includes('scan') || id.includes('ci') || id.includes('test') || topicNum === 8 || topicNum === 13) return 'pipeline';
    if (id.includes('network') || id.includes('port') || id.includes('bridge') || id.includes('host-net') || id.includes('overlay') || topicNum === 4 || topicNum === 9 || topicNum === 10) return 'network';
    if (id.includes('volume') || id.includes('bind') || id.includes('mount') || id.includes('dockerfile') || id.includes('layer') || id.includes('multistage') || topicNum === 5 || topicNum === 7) return 'filesystem';
    return 'process'; // Default for Topics 1, 2, 3, 6, 11, 12 (Process isolation, Namespaces, cgroups, Engine, exec, stop/start, security)
  }, [concept]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* 1. TOP HEADER & BREADCRUMB */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--docker-surface)', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid var(--docker-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--docker-blue)', background: 'rgba(14, 165, 233, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
            TOPIC {concept.topicNumber} &bull; CONCEPT {concept.id}
          </span>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            {concept.title}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', padding: '0.25rem 0.65rem', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', color: '#cbd5e1', border: '1px solid var(--docker-border)' }}>
            {concept.difficulty}
          </span>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', padding: '0.25rem 0.65rem', borderRadius: '999px', background: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8', border: '1px solid rgba(14, 165, 233, 0.3)' }}>
            ENGINE: {engineType.toUpperCase()}
          </span>
        </div>
      </div>

      {/* 2. VISUAL SIMULATOR CANVAS (ENGINES A, B, C, D, or E) */}
      <div className="docker-card" style={{ padding: '1.5rem', borderColor: 'var(--docker-border-active)', background: 'linear-gradient(180deg, rgba(14, 165, 233, 0.05) 0%, rgba(15, 23, 42, 0.6) 100%)' }}>
        {engineType === 'process' && <ProcessSimulator concept={concept} simState={simState} setSimState={setSimState} showToast={showToast} />}
        {engineType === 'filesystem' && <FilesystemSimulator concept={concept} simState={simState} setSimState={setSimState} showToast={showToast} />}
        {engineType === 'network' && <NetworkSimulator concept={concept} simState={simState} setSimState={setSimState} showToast={showToast} />}
        {engineType === 'pipeline' && <PipelineSimulator concept={concept} simState={simState} setSimState={setSimState} showToast={showToast} />}
        {engineType === 'cluster' && <ClusterSimulator concept={concept} simState={simState} setSimState={setSimState} showToast={showToast} />}
      </div>

      {/* 3. WHAT IS HAPPENING & REAL-WORLD PROBLEM */}
      <div className="docker-card" style={{ padding: '1.5rem' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HelpCircle size={16} color="var(--docker-blue)" />
          <span>What is happening &amp; Why do you need it?</span>
        </div>
        <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1rem' }}>
          {concept.whatIsIt}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--docker-border)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.35rem' }}>💡 Simple ELI5 Explanation</div>
            <div style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>{concept.inSimpleWords}</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--docker-border)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4ade80', marginBottom: '0.35rem' }}>🌐 Real-World Analogy</div>
            <div style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>{concept.realWorldAnalogy}</div>
          </div>
        </div>
      </div>

      {/* 4. INTERACTIVE COMMAND BREAKDOWN & TOKEN INSPECTOR */}
      <div className="docker-card" style={{ padding: '1.5rem', borderColor: 'var(--docker-border-active)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code size={16} color="var(--docker-blue)" />
            <span>Interactive Command Token Breakdown</span>
          </div>

          <button
            onClick={() => {
              executeCommand(concept.command);
              markConceptComplete(concept.id);
              showToast(`Executed ${concept.command} in Live Terminal!`);
            }}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
              color: '#fff',
              border: 'none',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 2px 8px rgba(14, 165, 233, 0.4)',
            }}
          >
            <Play size={13} fill="#fff" />
            Run in Terminal
          </button>
        </div>

        {/* Command Display */}
        <div style={{ background: '#070b14', padding: '1rem 1.25rem', borderRadius: '10px', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.95rem', color: '#38bdf8', border: '1px solid var(--docker-border)', marginBottom: '1rem' }}>
          {concept.syntaxCode || concept.command}
        </div>

        {/* Tokens Grid */}
        {concept.syntaxTokens && concept.syntaxTokens.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {concept.syntaxTokens.map((t, idx) => (
              <div
                key={idx}
                onClick={() => setActiveTokenIdx(activeTokenIdx === idx ? null : idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  background: activeTokenIdx === idx ? 'rgba(14, 165, 233, 0.12)' : 'rgba(255,255,255,0.03)',
                  padding: '0.65rem 1rem',
                  borderRadius: '8px',
                  border: activeTokenIdx === idx ? '1px solid var(--docker-blue)' : '1px solid rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <code style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--docker-blue)', fontWeight: 700, fontSize: '0.85rem', minWidth: '160px' }}>
                  {t.token}
                </code>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(14, 165, 233, 0.1)', color: '#38bdf8' }}>
                  {t.role}
                </span>
                <span style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>{t.explanation}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. WHAT CHANGED vs WHAT DIDN'T CHANGE? */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <div className="docker-card" style={{ padding: '1.25rem', borderColor: 'rgba(34, 197, 94, 0.4)' }}>
          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#4ade80', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Check size={16} color="#4ade80" />
            <span>WHAT CHANGED? (Side Effects)</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            {concept.actionStage.running.details.map((d, i) => (
              <li key={i} style={{ marginBottom: '0.35rem' }}>{d}</li>
            ))}
          </ul>
        </div>

        <div className="docker-card" style={{ padding: '1.25rem', borderColor: 'rgba(234, 179, 8, 0.4)' }}>
          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#facc15', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={16} color="#facc15" />
            <span>WHAT DID NOT CHANGE? (Immutable Host)</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            {concept.actionStage.before.details.map((d, i) => (
              <li key={i} style={{ marginBottom: '0.35rem' }}>{d}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 6. TRY VARIATION & BREAK IT / FIX IT */}
      {concept.variations && concept.variations.length > 0 && (
        <div className="docker-card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={16} color="var(--docker-blue)" />
            <span>Try Variations, Break It &amp; Fix It</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {concept.variations.map((v, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--docker-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.86rem' }}>{v.title}</div>
                  {v.syntax && (
                    <button
                      onClick={() => executeCommand(v.syntax!)}
                      style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: '4px',
                        background: 'rgba(14, 165, 233, 0.15)',
                        border: '1px solid var(--docker-border-active)',
                        color: 'var(--docker-blue)',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Run Variation
                    </button>
                  )}
                </div>
                {v.syntax && (
                  <code style={{ display: 'block', background: '#090d16', padding: '0.45rem 0.75rem', borderRadius: '6px', color: '#facc15', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                    {v.syntax}
                  </code>
                )}
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>{v.whatItDoes}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
