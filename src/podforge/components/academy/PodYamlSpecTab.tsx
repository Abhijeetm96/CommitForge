import React, { useState } from 'react';
import type { KubeConcept } from '../../data/topics/types';
import { useApp } from '../../context/AppContext';
import {
  FileCode,
  Copy,
  Check,
  Play,
  Layers,
  Sparkles,
  HelpCircle,
  Terminal,
} from 'lucide-react';

interface Props {
  concept: KubeConcept;
}

export const PodYamlSpecTab: React.FC<Props> = ({ concept }) => {
  const { executeCommand } = useApp();
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(concept.yamlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    executeCommand(`kubectl apply -f manifest.yaml`);
    setApplied(true);
    setTimeout(() => setApplied(false), 3000);
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
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--k8s-cyan)',
            }}
          >
            <FileCode size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>
              Declarative Kubernetes YAML Manifest
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Production schema blueprint for {concept.number} {concept.title}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
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
            <span>{copied ? 'Copied' : 'Copy Manifest'}</span>
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
            <span>{applied ? 'Applied to Cluster!' : 'Deploy to Simulator'}</span>
          </button>
        </div>
      </div>

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
          {concept.yamlSnippet}
        </pre>
      </div>

      {/* Field-by-Field Syntax Breakdown */}
      {concept.yamlExplanation && concept.yamlExplanation.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="var(--k8s-cyan)" />
            <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
              Manifest Syntax & Key Field Explanations
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0.85rem' }}>
            {concept.yamlExplanation.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                }}
              >
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
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {item.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
