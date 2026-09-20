import React from 'react';
import { UniversalConcept } from '../../data/unifiedAcademyData';
import { Terminal, Database, Cpu, Code2, ExternalLink, AlertTriangle } from 'lucide-react';

interface Props {
  concept: UniversalConcept;
}

export const ConceptReferenceTab: React.FC<Props> = ({ concept }) => {
  const ref = concept.reference;
  const options = ref.options || [];
  const edgeCases = ref.edgeCases || [];
  const syntaxCheatSheet = ref.syntaxCheatSheet || [];
  const commonErrors = ref.commonErrors || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Official Documentation Link */}
      {ref.officialDocUrl && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '10px',
            padding: '0.85rem 1.15rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ExternalLink size={16} color="#38bdf8" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
              Official Documentation & Specs
            </span>
          </div>
          <a
            href={ref.officialDocUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: '0.8rem',
              color: 'var(--accent-primary)',
              textDecoration: 'none',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            Open Docs ↗
          </a>
        </div>
      )}

      {/* 1. Synopsis */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Terminal size={18} color="#38bdf8" />
          <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Synopsis
          </h2>
        </div>
        <div
          style={{
            fontFamily: 'ui-monospace, monospace',
            fontSize: '0.86rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            padding: '1rem',
            borderRadius: '10px',
            color: 'var(--accent-primary)',
          }}
        >
          {ref.synopsis || concept.command}
        </div>
      </div>

      {/* Syntax Cheat Sheet */}
      {syntaxCheatSheet.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code2 size={18} color="#38bdf8" />
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Command Syntax Cheatsheet
            </h2>
          </div>
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            {syntaxCheatSheet.map((item, idx) => (
              <div
                key={idx}
                style={{
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: '0.82rem',
                  color: 'var(--text-primary)',
                  padding: '0.35rem 0.6rem',
                  background: 'var(--bg-surface)',
                  borderRadius: '6px',
                  borderLeft: '3px solid #38bdf8',
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Options & Flags Table */}
      {options.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code2 size={18} color="#f59e0b" />
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Options & Flags
            </h2>
          </div>

          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'var(--text-secondary)', width: '30%' }}>Flag</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {options.map((opt, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: idx < options.length - 1 ? '1px solid var(--border-color)' : 'none',
                    }}
                  >
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'ui-monospace, monospace', color: 'var(--accent-primary)', fontWeight: 700 }}>
                      {opt.flag}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                      {opt.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Git Internals */}
      {ref.gitInternals && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={18} color="#a855f7" />
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Git Internals & Architecture
            </h2>
          </div>

          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#a855f7' }}>
              Database Object: {ref.gitInternals.objectType}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              {ref.gitInternals.explanation}
            </div>
            <div
              style={{
                fontFamily: 'ui-monospace, monospace',
                fontSize: '0.76rem',
                color: 'var(--text-muted)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
              }}
            >
              Storage path: {ref.gitInternals.storageLocation}
            </div>
          </div>
        </div>
      )}

      {/* Common Errors */}
      {commonErrors.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} color="#ef4444" />
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Common Errors & Solutions
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {commonErrors.map((err, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={{ color: '#ef4444', fontSize: '0.84rem', fontWeight: 700 }}>
                  🚨 {err.error}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5 }}>
                  <strong style={{ color: '#10b981' }}>Remedy:</strong> {err.remedy}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Edge Cases */}
      {edgeCases.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={18} color="#22c55e" />
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Edge Cases & Advanced Behaviors
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {edgeCases.map((ec, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  fontSize: '0.82rem',
                  color: 'var(--text-primary)',
                  lineHeight: 1.5,
                }}
              >
                • {ec}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
