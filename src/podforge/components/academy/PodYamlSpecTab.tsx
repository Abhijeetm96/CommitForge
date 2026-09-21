import React, { useState, useMemo } from 'react';
import type { KubeConcept } from '../../data/topics/types';
import { useApp } from '../../context/AppContext';
import {
  FileCode,
  Copy,
  Check,
  Play,
  Layers,
  Sliders,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  concept: KubeConcept;
}

export const PodYamlSpecTab: React.FC<Props> = ({ concept }) => {
  const { executeCommand } = useApp();
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);
  const [dryRunRan, setDryRunRan] = useState(false);
  const [selectedFieldIdx, setSelectedFieldIdx] = useState<number | null>(null);

  // Check which parameters actually exist in this specific manifest
  const hasReplicas = useMemo(() => /replicas:\s*\d+/.test(concept.yamlSnippet), [concept.yamlSnippet]);
  const hasCpu = useMemo(() => /cpu:\s*["']?[0-9]+m?["']?/.test(concept.yamlSnippet), [concept.yamlSnippet]);
  const hasMemory = useMemo(() => /memory:\s*["']?[0-9]+[A-Za-z]+["']?/.test(concept.yamlSnippet), [concept.yamlSnippet]);
  const hasImage = useMemo(() => /image:\s*[\w\-\.\/]+/.test(concept.yamlSnippet), [concept.yamlSnippet]);

  // Tweak controls are ONLY rendered where fields exist in the manifest
  const hasAnyTweakControls = hasReplicas || hasCpu || hasMemory || hasImage;

  // Live tweak controls state
  const [replicas, setReplicas] = useState<number>(3);
  const [cpuLimit, setCpuLimit] = useState<string>('500m');
  const [memLimit, setMemLimit] = useState<string>('256Mi');
  const [imageTag, setImageTag] = useState<string>('1.25-alpine');

  // Compute live updated YAML only for fields that exist
  const liveYaml = useMemo(() => {
    let text = concept.yamlSnippet;

    if (hasReplicas) {
      text = text.replace(/replicas:\s*\d+/g, `replicas: ${replicas}`);
    }
    if (hasCpu) {
      text = text.replace(/cpu:\s*["']?[0-9]+m?["']?/g, `cpu: "${cpuLimit}"`);
    }
    if (hasMemory) {
      text = text.replace(/memory:\s*["']?[0-9]+[A-Za-z]+["']?/g, `memory: "${memLimit}"`);
    }
    if (hasImage) {
      text = text.replace(/(image:\s*[\w\-\.\/]+)(:\S+)?/g, (_match, p1) => `${p1}:${imageTag}`);
    }

    return text;
  }, [concept.yamlSnippet, hasReplicas, hasCpu, hasMemory, hasImage, replicas, cpuLimit, memLimit, imageTag]);

  const handleCopy = () => {
    navigator.clipboard.writeText(liveYaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    executeCommand(`kubectl apply -f manifest.yaml`);
    setApplied(true);
    setTimeout(() => setApplied(false), 3000);
  };

  const handleDryRun = () => {
    executeCommand(`kubectl apply --dry-run=client -f manifest.yaml -o yaml`);
    setDryRunRan(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.25s ease-out' }}>
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.85rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--k8s-cyan)',
            }}
          >
            <FileCode size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#fff' }}>
              Declarative Kubernetes YAML Studio
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Production schema blueprint for {concept.number} {concept.title}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleDryRun}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              color: '#38bdf8',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <ShieldCheck size={14} />
            <span>Pre-Flight Dry-Run</span>
          </button>

          <button
            onClick={handleCopy}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: copied ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface)',
              border: copied ? '1px solid #10b981' : '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              color: copied ? '#10b981' : 'var(--text-primary)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Manifest'}</span>
          </button>

          <button
            onClick={handleApply}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: applied ? 'rgba(16, 185, 129, 0.25)' : 'linear-gradient(135deg, #326ce5 0%, #0284c7 100%)',
              border: applied ? '1px solid #10b981' : 'none',
              borderRadius: '8px',
              padding: '0.45rem 1rem',
              color: '#fff',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(50, 108, 229, 0.3)',
              transition: 'all 0.15s ease',
            }}
          >
            {applied ? <Check size={14} /> : <Play size={14} />}
            <span>{applied ? 'Applied to Cluster!' : 'Apply to Cluster'}</span>
          </button>
        </div>
      </div>

      {/* PARAMETER CONTROLS: ONLY RENDERED WHERE RELEVANT TO MANIFEST SCHEMA */}
      {hasAnyTweakControls && (
        <div
          style={{
            background: 'rgba(50, 108, 229, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.76rem', fontWeight: 800, color: 'var(--k8s-cyan)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <Sliders size={15} color="var(--k8s-cyan)" />
            <span>Interactive Spec Parameters (Manifest Customizer)</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
            {/* Replicas Control - only if manifest has replicas */}
            {hasReplicas && (
              <div style={{ background: 'rgba(0, 0, 0, 0.35)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.65rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  <span>Desired Replicas:</span>
                  <strong style={{ color: '#38bdf8' }}>{replicas} Pods</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    value={replicas}
                    onChange={(e) => setReplicas(Number(e.target.value))}
                    style={{ flex: 1, accentColor: 'var(--k8s-cyan)', cursor: 'pointer' }}
                  />
                </div>
              </div>
            )}

            {/* CPU Limit Control - only if manifest has cpu */}
            {hasCpu && (
              <div style={{ background: 'rgba(0, 0, 0, 0.35)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.65rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  <span>CPU Limit:</span>
                  <strong style={{ color: '#10b981' }}>{cpuLimit}</strong>
                </div>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {['250m', '500m', '1000m', '2000m'].map((cpu) => (
                    <button
                      key={cpu}
                      onClick={() => setCpuLimit(cpu)}
                      style={{
                        flex: 1,
                        background: cpuLimit === cpu ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                        border: cpuLimit === cpu ? '1px solid #10b981' : '1px solid transparent',
                        color: cpuLimit === cpu ? '#fff' : 'var(--text-muted)',
                        borderRadius: '4px',
                        padding: '0.2rem 0',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {cpu}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Memory Limit Control - only if manifest has memory */}
            {hasMemory && (
              <div style={{ background: 'rgba(0, 0, 0, 0.35)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.65rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  <span>Memory Limit:</span>
                  <strong style={{ color: '#c084fc' }}>{memLimit}</strong>
                </div>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {['128Mi', '256Mi', '512Mi', '1Gi'].map((mem) => (
                    <button
                      key={mem}
                      onClick={() => setMemLimit(mem)}
                      style={{
                        flex: 1,
                        background: memLimit === mem ? 'rgba(192, 132, 252, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                        border: memLimit === mem ? '1px solid #c084fc' : '1px solid transparent',
                        color: memLimit === mem ? '#fff' : 'var(--text-muted)',
                        borderRadius: '4px',
                        padding: '0.2rem 0',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {mem}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Image Tag Control - only if manifest has image */}
            {hasImage && (
              <div style={{ background: 'rgba(0, 0, 0, 0.35)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.65rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  <span>Container Image Tag:</span>
                  <strong style={{ color: '#f59e0b' }}>{imageTag}</strong>
                </div>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {['1.25-alpine', 'latest', 'v2.1.0'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setImageTag(tag)}
                      style={{
                        flex: 1,
                        background: imageTag === tag ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                        border: imageTag === tag ? '1px solid #f59e0b' : '1px solid transparent',
                        color: imageTag === tag ? '#fff' : 'var(--text-muted)',
                        borderRadius: '4px',
                        padding: '0.2rem 0',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dry-Run Feedback Box */}
      {dryRunRan && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '10px',
            padding: '0.85rem 1.15rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1 }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#10b981' }}>
              Pre-Flight Admission Validation Passed (Client Dry-Run OK)
            </div>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.5 }}>
              OpenAPI v3 schema validated. All mandatory spec fields present. Mutating admission webhooks approved resource requests against namespace quotas.
            </div>
          </div>
        </div>
      )}

      {/* Manifest Code Block */}
      <div
        style={{
          background: '#040711',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.6rem 1.15rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.74rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span style={{ marginLeft: '0.4rem', color: '#e2e8f0', fontWeight: 700 }}>manifest.yaml</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>YAML / UTF-8</span>
        </div>

        <pre
          style={{
            margin: 0,
            padding: '1.25rem 1.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            lineHeight: 1.6,
            color: '#7dd3fc',
            overflowX: 'auto',
          }}
        >
          {liveYaml}
        </pre>
      </div>

      {/* Field-by-Field Syntax Breakdown */}
      {concept.yamlExplanation && concept.yamlExplanation.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="var(--k8s-cyan)" />
              <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                Manifest Syntax &amp; Key Field Explanations
              </h2>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Click on any field to inspect
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0.85rem' }}>
            {concept.yamlExplanation.map((item, idx) => {
              const isSelected = selectedFieldIdx === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedFieldIdx(isSelected ? null : idx)}
                  style={{
                    background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-card)',
                    border: isSelected ? '1px solid #38bdf8' : '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        color: '#38bdf8',
                        background: 'rgba(56, 189, 248, 0.08)',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                        padding: '0.25rem 0.55rem',
                        borderRadius: '6px',
                        width: 'fit-content',
                      }}
                    >
                      {item.field}
                    </div>
                    {isSelected && (
                      <span style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 700 }}>
                        SELECTED
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    {item.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
