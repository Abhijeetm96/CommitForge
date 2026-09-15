import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TopicPillars, getTopicPillars } from '../../data/topicPillars';
import {
  BookOpen,
  Terminal,
  Layers,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';

interface KnowledgePillarsCardProps {
  conceptId: string;
  onApplyCommand?: (command: string) => void;
  compact?: boolean;
}

type PillarTab = 'definition' | 'syntax' | 'variations' | 'examples' | 'explanation';

export const KnowledgePillarsCard: React.FC<KnowledgePillarsCardProps> = ({
  conceptId,
  onApplyCommand,
  compact = false,
}) => {
  const { kidMode } = useApp();
  const [activeTab, setActiveTab] = useState<PillarTab>('definition');
  const [selectedSubtopic, setSelectedSubtopic] = useState<string | undefined>(undefined);
  const [isExpanded, setIsExpanded] = useState<boolean>(!compact);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const pillars: TopicPillars = getTopicPillars(conceptId, selectedSubtopic);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  const tabs: { id: PillarTab; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'definition', label: 'Definition', icon: <BookOpen size={14} />, color: '#38bdf8' },
    { id: 'syntax', label: 'Syntax', icon: <Terminal size={14} />, color: '#10b981' },
    { id: 'variations', label: 'Variations', icon: <Layers size={14} />, color: '#f59e0b' },
    { id: 'examples', label: 'Examples', icon: <Sparkles size={14} />, color: '#a855f7' },
    { id: 'explanation', label: 'Explanation', icon: <HelpCircle size={14} />, color: '#ec4899' },
  ];

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #090e1a 0%, #060911 100%)',
        border: '1.5px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        width: '100%',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          padding: '0.65rem 1rem',
          background: 'rgba(255, 255, 255, 0.03)',
          borderBottom: isExpanded ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.2rem' }}>{pillars.chapterEmoji}</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#38bdf8',
                }}
              >
                {pillars.chapterTitle} • 5 Core Pillars
              </span>
              {kidMode && (
                <span
                  style={{
                    fontSize: '0.68rem',
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: '#fbbf24',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    padding: '0.05rem 0.35rem',
                    borderRadius: '4px',
                    fontWeight: 700,
                  }}
                >
                  🧒 Kid Friendly
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f8fafc' }}>
              {pillars.conceptTitle}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
            {isExpanded ? 'Collapse' : 'Show 5 Pillars Reference'}
          </span>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: 0,
            }}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Expanded Body */}
      {isExpanded && (
        <div style={{ padding: '0.85rem 1rem' }}>
          {/* Subtopics Chip Selector */}
          {pillars.subtopics && pillars.subtopics.length > 0 && (
            <div style={{ marginBottom: '0.85rem' }}>
              <div
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.35rem',
                }}
              >
                Subtopics in this module:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {pillars.subtopics.map((sub, idx) => {
                  const isSubSelected = selectedSubtopic === sub || (!selectedSubtopic && idx === 0);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSubtopic(sub);
                      }}
                      style={{
                        background: isSubSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                        border: isSubSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                        color: isSubSelected ? '#38bdf8' : '#cbd5e1',
                        borderRadius: '6px',
                        padding: '0.2rem 0.5rem',
                        fontSize: '0.72rem',
                        fontWeight: isSubSelected ? 700 : 500,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span style={{ fontSize: '0.7rem' }}>•</span>
                      <span>{sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5 Tabs Navigation */}
          <div
            style={{
              display: 'flex',
              gap: '0.4rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '0.5rem',
              marginBottom: '0.85rem',
              overflowX: 'auto',
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: isActive ? `${tab.color}22` : 'rgba(255, 255, 255, 0.02)',
                    border: isActive ? `1px solid ${tab.color}` : '1px solid rgba(255, 255, 255, 0.06)',
                    color: isActive ? tab.color : '#94a3b8',
                    borderRadius: '6px',
                    padding: '0.35rem 0.7rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Display */}
          <div style={{ minHeight: '120px' }}>
            {/* 1. DEFINITION */}
            {activeTab === 'definition' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div
                  style={{
                    background: 'rgba(56, 189, 248, 0.06)',
                    borderLeft: '3px solid #38bdf8',
                    padding: '0.75rem 1rem',
                    borderRadius: '0 8px 8px 0',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.2rem', textTransform: 'uppercase' }}>
                    Quick Definition
                  </div>
                  <div style={{ fontSize: '0.86rem', color: '#f8fafc', lineHeight: 1.5, fontWeight: 500 }}>
                    {pillars.definition.short}
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', fontWeight: 800, color: '#fbbf24', marginBottom: '0.25rem' }}>
                    <Lightbulb size={14} />
                    <span>In Plain English / Kid Metaphor</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#fde047', lineHeight: 1.5 }}>
                    {pillars.definition.beginner}
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                    Technical Definition
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                    {pillars.definition.technical}
                  </div>
                </div>
              </div>
            )}

            {/* 2. SYNTAX */}
            {activeTab === 'syntax' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div
                  style={{
                    background: '#040711',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                      Primary Command Syntax
                    </div>
                    <code style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 700, fontFamily: 'var(--font-mono, monospace)' }}>
                      {pillars.syntax.primary}
                    </code>
                  </div>
                  {onApplyCommand && (
                    <button
                      type="button"
                      onClick={() => onApplyCommand(pillars.syntax.primary)}
                      style={{
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid #10b981',
                        color: '#10b981',
                        borderRadius: '6px',
                        padding: '0.3rem 0.65rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <span>🪄 Use In Terminal</span>
                    </button>
                  )}
                </div>

                {/* Grammar Tokens Breakdown */}
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    Syntax Structure & Tokens:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {pillars.syntax.tokens.map((t, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '6px',
                          padding: '0.45rem 0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                        }}
                      >
                        <code style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.82rem', fontFamily: 'monospace', minWidth: '80px' }}>
                          {t.token}
                        </code>
                        <span style={{ fontSize: '0.68rem', background: 'rgba(255, 255, 255, 0.08)', color: '#94a3b8', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                          {t.role}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                          {t.explanation}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. VARIATIONS */}
            {activeTab === 'variations' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                  Important Command Variations & Flags:
                </div>
                {pillars.variations.map((v, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '8px',
                      padding: '0.65rem 0.85rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <code style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700, fontFamily: 'monospace' }}>
                        {v.syntax}
                      </code>
                      <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600 }}>
                        {v.title}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      {v.whenToUse}
                    </div>
                    {v.watchOut && (
                      <div style={{ fontSize: '0.72rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <AlertTriangle size={12} />
                        <span>{v.watchOut}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 4. EXAMPLES */}
            {activeTab === 'examples' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {pillars.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#040711',
                      border: '1px solid rgba(168, 85, 247, 0.25)',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#c084fc' }}>
                        💡 Example {idx + 1}: {ex.title}
                      </span>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button
                          type="button"
                          onClick={() => handleCopy(ex.code)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#cbd5e1',
                            borderRadius: '4px',
                            padding: '0.15rem 0.45rem',
                            fontSize: '0.7rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          {copiedCode === ex.code ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                          <span>{copiedCode === ex.code ? 'Copied' : 'Copy'}</span>
                        </button>
                        {onApplyCommand && (
                          <button
                            type="button"
                            onClick={() => onApplyCommand(ex.code)}
                            style={{
                              background: 'rgba(168, 85, 247, 0.2)',
                              border: '1px solid #a855f7',
                              color: '#c084fc',
                              borderRadius: '4px',
                              padding: '0.15rem 0.45rem',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            🪄 Paste
                          </button>
                        )}
                      </div>
                    </div>

                    <pre
                      style={{
                        margin: '0.2rem 0',
                        padding: '0.5rem 0.75rem',
                        background: 'rgba(0, 0, 0, 0.6)',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        color: '#4ade80',
                        fontFamily: 'monospace',
                        overflowX: 'auto',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {ex.code}
                    </pre>

                    <div style={{ fontSize: '0.76rem', color: '#94a3b8', lineHeight: 1.4 }}>
                      {ex.explanation}
                    </div>

                    {ex.output && (
                      <div
                        style={{
                          fontSize: '0.72rem',
                          color: '#64748b',
                          background: 'rgba(255, 255, 255, 0.02)',
                          padding: '0.35rem 0.6rem',
                          borderRadius: '4px',
                          borderLeft: '2px solid #a855f7',
                        }}
                      >
                        <strong>Output:</strong> {ex.output}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 5. EXPLANATION */}
            {activeTab === 'explanation' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div
                  style={{
                    background: 'rgba(236, 72, 153, 0.06)',
                    borderLeft: '3px solid #ec4899',
                    padding: '0.75rem 1rem',
                    borderRadius: '0 8px 8px 0',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ec4899', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    Mental Model
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                    {pillars.explanation.mentalModel}
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.65rem',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      padding: '0.65rem',
                      borderRadius: '8px',
                    }}
                  >
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.2rem' }}>
                      🔄 What Changes:
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#94a3b8', lineHeight: 1.4 }}>
                      {pillars.explanation.whatChanges}
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      padding: '0.65rem',
                      borderRadius: '8px',
                    }}
                  >
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10b981', marginBottom: '0.2rem' }}>
                      🛡️ What Stays Safe:
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#94a3b8', lineHeight: 1.4 }}>
                      {pillars.explanation.whatDoesNotChange}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(168, 85, 247, 0.08)',
                    border: '1px solid rgba(168, 85, 247, 0.25)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                  }}
                >
                  <Sparkles size={16} color="#c084fc" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
                  <div style={{ fontSize: '0.78rem', color: '#e9d5ff', lineHeight: 1.45 }}>
                    <strong>Senior Pro-Tip:</strong> {pillars.explanation.proTip}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
