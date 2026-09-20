import React from 'react';
import type { KubeConcept } from '../../data/topics/types';
import {
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  Wrench,
  Terminal,
  Bookmark,
  Sparkles,
} from 'lucide-react';

interface Props {
  concept: KubeConcept;
}

export const PodPitfallsTab: React.FC<Props> = ({ concept }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.25s ease-out' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(239, 68, 68, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ef4444',
          }}
        >
          <AlertTriangle size={20} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#fff', margin: 0 }}>
            Common Production Pitfalls & Recovery Recipes
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.15rem 0 0 0' }}>
            Real-world failure modes, root-cause analyses, and battle-tested remediation workflows for {concept.number} {concept.title}
          </p>
        </div>
      </div>

      {/* Pitfalls Cards */}
      {concept.commonPitfalls && concept.commonPitfalls.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {concept.commonPitfalls.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                boxShadow: '0 4px 18px rgba(0, 0, 0, 0.15)',
              }}
            >
              {/* Mistake */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <div style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }}>
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase' }}>
                    Failure Mode #{idx + 1}
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.2rem' }}>
                    {item.mistake}
                  </div>
                </div>
              </div>

              {/* Why it Happens */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderLeft: '3px solid #f59e0b',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '0 6px 6px 0',
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase' }}>
                  Why It Happens (Root Cause)
                </div>
                <div style={{ fontSize: '0.84rem', color: '#cbd5e1', marginTop: '0.25rem', lineHeight: 1.55 }}>
                  {item.whyItHappens}
                </div>
              </div>

              {/* Remediation Recipe */}
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.06)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                }}
              >
                <div style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }}>
                  <Wrench size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>
                    The SRE Recovery Recipe
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#e2e8f0', marginTop: '0.25rem', lineHeight: 1.55 }}>
                    {item.fix}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.85rem' }}>
          No specific pitfalls recorded for this topic. Follow standard declarative Kubernetes practices.
        </div>
      )}

      {/* Production Quick Reference Cheat Sheet */}
      {concept.referenceCheatSheet && concept.referenceCheatSheet.length > 0 && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(50, 108, 229, 0.12) 0%, rgba(56, 189, 248, 0.06) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bookmark size={18} color="var(--k8s-cyan)" />
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>
              Essential CLI Cheat Sheet & Shortcuts
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {concept.referenceCheatSheet.map((cmd, i) => {
              const parts = cmd.split(':');
              const code = parts[0]?.trim();
              const desc = parts.slice(1).join(':').trim();

              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '0.5rem 0.85rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700 }}>
                    $ {code}
                  </code>
                  {desc && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {desc}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
