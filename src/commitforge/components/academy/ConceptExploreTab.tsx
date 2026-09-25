import React, { useState, useMemo, useEffect } from 'react';
import {
  UniversalConcept,
  ACADEMY_18_TOPICS,
  ALL_ACADEMY_CONCEPTS,
  getUniversalConcept,
  ConceptDifficulty,
} from '../../data/unifiedAcademyData';
import { AcademyConceptTab } from './UniversalConceptHero';
import {
  Layers,
  HelpCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  GitCompare,
  Lightbulb,
  Search,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Terminal,
  BookOpen,
  Copy,
  Check,
} from 'lucide-react';

interface Props {
  concept: UniversalConcept;
  onWatchItHappen?: () => void;
  onSelectConcept?: (conceptId: string, targetTab?: AcademyConceptTab) => void;
  initialViewMode?: 'current' | 'all';
  initialContentType?: 'all' | 'variations' | 'scenarios' | 'comparisons' | 'pitfalls';
}

type ContentFilterType = 'all' | 'variations' | 'scenarios' | 'comparisons' | 'pitfalls';

export const ConceptExploreTab: React.FC<Props> = ({
  concept,
  onSelectConcept,
  initialViewMode = 'current',
  initialContentType = 'all',
}) => {
  const [viewMode, setViewMode] = useState<'current' | 'all'>(initialViewMode);

  useEffect(() => {
    if (initialViewMode) {
      setViewMode(initialViewMode);
    }
  }, [initialViewMode]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [contentType, setContentType] = useState<ContentFilterType>(initialContentType);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [collapsedMap, setCollapsedMap] = useState<Record<string, boolean>>({});
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Flattened canonical list of all 71 concepts across all 18 topics
  const allConceptsList = useMemo(() => {
    return ACADEMY_18_TOPICS.flatMap((topic) =>
      topic.concepts.map((cRef) => {
        const full = ALL_ACADEMY_CONCEPTS[cRef.id] || getUniversalConcept(cRef.id);
        return {
          ...full,
          topicNumber: topic.number,
          topicTitle: topic.title,
        };
      })
    );
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(code);
    setTimeout(() => setCopiedSnippet(null), 1500);
  };

  const handleSelectOption = (scenarioKey: string, optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [scenarioKey]: optionIdx,
    }));
  };

  const toggleCollapse = (conceptId: string) => {
    setCollapsedMap((prev) => ({
      ...prev,
      [conceptId]: !prev[conceptId],
    }));
  };

  const handleExpandAll = () => setCollapsedMap({});
  const handleCollapseAll = () => {
    const allCollapsed: Record<string, boolean> = {};
    allConceptsList.forEach((c) => {
      allCollapsed[c.id] = true;
    });
    setCollapsedMap(allCollapsed);
  };

  // Filtered concepts based on topic, difficulty, and search query
  const filteredConcepts = useMemo(() => {
    let list = allConceptsList;

    if (selectedTopicId !== 'all') {
      list = list.filter((c) => c.topicId === selectedTopicId);
    }

    if (selectedDifficulty !== 'all') {
      list = list.filter((c) => c.difficulty === selectedDifficulty);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((c) => {
        const matchCmd = c.command.toLowerCase().includes(q);
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchSub = c.subtitle.toLowerCase().includes(q);
        const matchVars = c.variations?.some(
          (v) =>
            (v.syntax && v.syntax.toLowerCase().includes(q)) ||
            (v.title && v.title.toLowerCase().includes(q)) ||
            (v.whatItDoes && v.whatItDoes.toLowerCase().includes(q)) ||
            (v.example && v.example.toLowerCase().includes(q)) ||
            (v.whenToUse && v.whenToUse.toLowerCase().includes(q))
        );
        const matchScenarios = c.scenarios?.some(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            (s.context && s.context.toLowerCase().includes(q)) ||
            (s.question && s.question.toLowerCase().includes(q)) ||
            s.options?.some(
              (opt) =>
                opt.label.toLowerCase().includes(q) ||
                opt.command.toLowerCase().includes(q) ||
                opt.explanation.toLowerCase().includes(q)
            )
        );
        const matchComparisons = c.commandComparisons?.some(
          (cc) =>
            cc.aspect.toLowerCase().includes(q) ||
            cc.commandA.toLowerCase().includes(q) ||
            cc.commandB.toLowerCase().includes(q) ||
            cc.descriptionA.toLowerCase().includes(q) ||
            cc.descriptionB.toLowerCase().includes(q)
        );
        const matchMistakes = c.commonMistakes?.some(
          (m) =>
            m.mistake.toLowerCase().includes(q) ||
            m.whyItHappens.toLowerCase().includes(q) ||
            m.fix.toLowerCase().includes(q)
        );

        return (
          matchCmd ||
          matchTitle ||
          matchSub ||
          matchVars ||
          matchScenarios ||
          matchComparisons ||
          matchMistakes
        );
      });
    }

    return list;
  }, [allConceptsList, selectedTopicId, selectedDifficulty, searchQuery]);

  // Overall scenario mastery stats
  const scenarioStats = useMemo(() => {
    let answered = 0;
    let correct = 0;
    let total = 0;

    allConceptsList.forEach((c) => {
      (c.scenarios || []).forEach((sc, sIdx) => {
        total++;
        const key = sc.id || `${c.id}-scenario-${sIdx}`;
        const sel = selectedAnswers[key];
        if (sel !== undefined) {
          answered++;
          if (sc.options && sc.options[sel]?.isCorrect) {
            correct++;
          }
        }
      });
    });

    return { answered, correct, total };
  }, [allConceptsList, selectedAnswers]);

  // Difficulty colors helper
  const getDifficultyBadge = (diff: ConceptDifficulty) => {
    switch (diff) {
      case 'Beginner':
        return { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e', border: 'rgba(34, 197, 94, 0.3)' };
      case 'Intermediate':
        return { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', border: 'rgba(56, 189, 248, 0.3)' };
      case 'Advanced':
        return { bg: 'rgba(192, 132, 252, 0.15)', text: '#c084fc', border: 'rgba(192, 132, 252, 0.3)' };
      case 'Expert':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' };
    }
  };

  // Render variations cards block
  const renderVariationsSection = (c: UniversalConcept) => {
    if (!c.variations || c.variations.length === 0) return null;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Layers size={16} color="#38bdf8" />
            <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#f8fafc' }}>
              Command Variations & Modifiers
            </h3>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.12)',
                padding: '0.1rem 0.45rem',
                borderRadius: '999px',
              }}
            >
              {c.variations.length} variations
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
          {c.variations.map((v, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1.15rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                transition: 'border-color 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.45rem' }}>
                <span
                  style={{
                    fontFamily: 'ui-monospace, monospace',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: '#38bdf8',
                    background: 'rgba(56, 189, 248, 0.1)',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                  }}
                >
                  {v.syntax || v.snippet || v.flag || v.title}
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc' }}>
                  {v.title}
                </span>
              </div>

              <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                {v.whatItDoes || v.desc}
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '8px',
                  padding: '0.65rem',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem',
                  fontSize: '0.76rem',
                }}
              >
                {(v.whenToUse || v.desc) && (
                  <div>
                    <span style={{ fontWeight: 700, color: '#22c55e', marginRight: '0.35rem' }}>
                      WHEN TO USE:
                    </span>
                    <span style={{ color: '#94a3b8' }}>{v.whenToUse || v.desc}</span>
                  </div>
                )}
                {v.whenNotToUse && (
                  <div>
                    <span style={{ fontWeight: 700, color: '#ef4444', marginRight: '0.35rem' }}>
                      AVOID IF:
                    </span>
                    <span style={{ color: '#94a3b8' }}>{v.whenNotToUse}</span>
                  </div>
                )}
                {(v.example || v.snippet) && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', overflow: 'hidden' }}>
                      <span style={{ fontWeight: 700, color: '#38bdf8', flexShrink: 0 }}>
                        EXAMPLE:
                      </span>
                      <code
                        style={{
                          color: '#38bdf8',
                          fontFamily: 'monospace',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {v.example || v.snippet}
                      </code>
                    </div>
                    <button
                      onClick={() => handleCopy(v.example || v.snippet || '')}
                      title="Copy command"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: copiedSnippet === (v.example || v.snippet) ? '#22c55e' : '#64748b',
                        cursor: 'pointer',
                        padding: '0.2rem',
                        display: 'flex',
                        alignItems: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {copiedSnippet === (v.example || v.snippet) ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </div>
                )}
              </div>

              {v.warning && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    borderRadius: '6px',
                    padding: '0.45rem 0.65rem',
                    fontSize: '0.72rem',
                    color: '#f59e0b',
                  }}
                >
                  <AlertTriangle size={13} style={{ flexShrink: 0 }} />
                  <span>{v.warning}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render real-world case scenarios block
  const renderScenariosSection = (c: UniversalConcept) => {
    if (!c.scenarios || c.scenarios.length === 0) return null;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle size={18} color="#f59e0b" />
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Real-World Case Scenarios & Decision Framework
            </h2>
          </div>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#f59e0b',
              background: 'rgba(245, 158, 11, 0.12)',
              padding: '0.15rem 0.55rem',
              borderRadius: '999px',
            }}
          >
            {c.scenarios.length} scenarios
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {c.scenarios.map((sc, scIdx) => {
            const scenarioKey = sc.id || `${c.id}-scenario-${scIdx}`;
            const selectedIdx = selectedAnswers[scenarioKey];
            const hasAnswered = selectedIdx !== undefined;

            return (
              <div
                key={scenarioKey}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '1.15rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {sc.title}
                  </div>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                      background: sc.options ? 'rgba(245, 158, 11, 0.12)' : 'rgba(56, 189, 248, 0.12)',
                      color: sc.options ? '#f59e0b' : '#38bdf8',
                    }}
                  >
                    {sc.options ? 'Interactive Challenge' : 'Developer Guide'}
                  </span>
                </div>

                {sc.context && (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    Situation: {sc.context}
                  </div>
                )}

                {sc.question && (
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {sc.question}
                  </div>
                )}

                {/* Multiple choice quiz buttons */}
                {sc.options && sc.options.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {sc.options.map((opt, oIdx) => {
                      const isSelected = selectedIdx === oIdx;
                      let borderColor = 'rgba(255, 255, 255, 0.08)';
                      let bgColor = 'rgba(255, 255, 255, 0.02)';

                      if (hasAnswered) {
                        if (opt.isCorrect) {
                          borderColor = '#22c55e';
                          bgColor = 'rgba(34, 197, 94, 0.12)';
                        } else if (isSelected && !opt.isCorrect) {
                          borderColor = '#ef4444';
                          bgColor = 'rgba(239, 68, 68, 0.12)';
                        }
                      }

                      return (
                        <div
                          key={oIdx}
                          onClick={() => handleSelectOption(scenarioKey, oIdx)}
                          style={{
                            padding: '0.75rem 0.95rem',
                            borderRadius: '8px',
                            border: `1px solid ${borderColor}`,
                            background: bgColor,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.3rem',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#f8fafc' }}>
                              {opt.label}
                            </span>
                            {hasAnswered && opt.isCorrect && (
                              <CheckCircle2 size={16} color="#22c55e" />
                            )}
                            {hasAnswered && isSelected && !opt.isCorrect && (
                              <XCircle size={16} color="#ef4444" />
                            )}
                          </div>
                          <div
                            style={{
                              fontFamily: 'ui-monospace, monospace',
                              fontSize: '0.78rem',
                              color: '#38bdf8',
                            }}
                          >
                            $ {opt.command}
                          </div>

                          {hasAnswered && isSelected && (
                            <div
                              style={{
                                marginTop: '0.35rem',
                                paddingTop: '0.35rem',
                                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                                fontSize: '0.76rem',
                                color: opt.isCorrect ? '#22c55e' : '#f87171',
                                lineHeight: 1.4,
                              }}
                            >
                              {opt.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Scenario Guide card fallback */}
                {!sc.options && (sc.whenToUse || sc.commandExample) && (
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    {sc.whenToUse && (
                      <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                        <span style={{ fontWeight: 700, color: '#22c55e', marginRight: '0.35rem' }}>
                          SITUATION:
                        </span>
                        {sc.whenToUse}
                      </div>
                    )}
                    {sc.commandExample && (
                      <div
                        style={{
                          fontFamily: 'ui-monospace, monospace',
                          fontSize: '0.82rem',
                          color: '#38bdf8',
                          background: 'rgba(0, 0, 0, 0.3)',
                          padding: '0.45rem 0.75rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(56, 189, 248, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>$ {sc.commandExample}</span>
                        <button
                          onClick={() => handleCopy(sc.commandExample || '')}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: copiedSnippet === sc.commandExample ? '#22c55e' : '#64748b',
                            cursor: 'pointer',
                            padding: '0.15rem',
                          }}
                        >
                          {copiedSnippet === sc.commandExample ? <Check size={12} /> : <Copy size={12} />}
                        </button>
                      </div>
                    )}
                    {sc.note && (
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic' }}>
                        💡 {sc.note}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render command comparisons block
  const renderComparisonsSection = (c: UniversalConcept) => {
    if (!c.commandComparisons || c.commandComparisons.length === 0) return null;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <GitCompare size={16} color="#c084fc" />
          <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#f8fafc' }}>
            Command vs Command Comparisons
          </h3>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#c084fc',
              background: 'rgba(192, 132, 252, 0.12)',
              padding: '0.1rem 0.45rem',
              borderRadius: '999px',
            }}
          >
            {c.commandComparisons.length} comparisons
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {c.commandComparisons.map((cc, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1.15rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {cc.aspect}: <span style={{ color: '#38bdf8' }}>{cc.commandA}</span> vs{' '}
                <span style={{ color: '#f59e0b' }}>{cc.commandB}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
                <div
                  style={{
                    background: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    borderRadius: '8px',
                    padding: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                  }}
                >
                  <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700, color: '#38bdf8', fontSize: '0.85rem' }}>
                    {cc.commandA}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                    {cc.descriptionA}
                  </span>
                </div>

                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.05)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    borderRadius: '8px',
                    padding: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                  }}
                >
                  <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700, color: '#f59e0b', fontSize: '0.85rem' }}>
                    {cc.commandB}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                    {cc.descriptionB}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render common mistakes block
  const renderMistakesSection = (c: UniversalConcept) => {
    if (!c.commonMistakes || c.commonMistakes.length === 0) return null;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <AlertTriangle size={16} color="#ef4444" />
          <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#f8fafc' }}>
            Common Mistakes & How to Recover
          </h3>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#ef4444',
              background: 'rgba(239, 68, 68, 0.12)',
              padding: '0.1rem 0.45rem',
              borderRadius: '999px',
            }}
          >
            {c.commonMistakes.length} pitfalls
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {c.commonMistakes.map((cm, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '10px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
              }}
            >
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#f87171' }}>
                ⚠️ {cm.mistake}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                <strong style={{ color: '#cbd5e1' }}>Why it happens:</strong> {cm.whyItHappens}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#22c55e' }}>
                <strong style={{ color: '#22c55e' }}>The Fix:</strong> {cm.fix}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render a full concept block
  const renderConceptCard = (c: UniversalConcept, isSingle = false) => {
    const isCollapsed = Boolean(collapsedMap[c.id]) && !isSingle;
    const diffBadge = getDifficultyBadge(c.difficulty);
    const varCount = (c.variations || []).length;
    const scenCount = (c.scenarios || []).length;
    const compCount = (c.commandComparisons || []).length;
    const mistCount = (c.commonMistakes || []).length;

    return (
      <div
        key={c.id}
        id={`concept-card-${c.id}`}
        style={{
          background: 'rgba(12, 19, 34, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Concept Card Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            paddingBottom: isCollapsed ? 0 : '0.85rem',
            borderBottom: isCollapsed ? 'none' : '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'ui-monospace, monospace',
                fontSize: '0.9rem',
                fontWeight: 800,
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.15)',
                padding: '0.25rem 0.65rem',
                borderRadius: '8px',
                border: '1px solid rgba(56, 189, 248, 0.3)',
              }}
            >
              $ {c.command}
            </span>

            <div>
              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span>{c.title}</span>
                {c.topicTitle && (
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>
                    • Topic {c.topicNumber}: {c.topicTitle}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                {c.subtitle}
              </div>
            </div>

            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '0.15rem 0.5rem',
                borderRadius: '999px',
                background: diffBadge.bg,
                color: diffBadge.text,
                border: `1px solid ${diffBadge.border}`,
              }}
            >
              {c.difficulty}
            </span>
          </div>

          {/* Action links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {onSelectConcept && (
              <>
                <button
                  onClick={() => onSelectConcept(c.id, 'Learn')}
                  title="Study this concept in Git Academy"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#cbd5e1',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <BookOpen size={12} />
                  <span>Learn</span>
                </button>

                <button
                  onClick={() => onSelectConcept(c.id, 'Sandbox')}
                  title="Open live sandbox for this concept"
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.25)',
                    color: '#22c55e',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Terminal size={12} />
                  <span>Sandbox</span>
                </button>
              </>
            )}

            {!isSingle && (
              <button
                onClick={() => toggleCollapse(c.id)}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#94a3b8',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <span>{isCollapsed ? 'Expand' : 'Collapse'}</span>
                {isCollapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
              </button>
            )}
          </div>
        </div>

        {/* Collapsed summary pill bar */}
        {isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.74rem', color: '#64748b' }}>
            <span>⚡ {varCount} Variations</span>
            <span>•</span>
            <span>🎯 {scenCount} Real-World Scenarios</span>
            <span>•</span>
            <span>⚖️ {compCount} Comparisons</span>
            <span>•</span>
            <span>⚠️ {mistCount} Pitfalls</span>
          </div>
        )}

        {/* Expanded Content Sections */}
        {!isCollapsed && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {(contentType === 'all' || contentType === 'variations') && renderVariationsSection(c)}
            {(contentType === 'all' || contentType === 'scenarios') && renderScenariosSection(c)}
            {(contentType === 'all' || contentType === 'comparisons') && renderComparisonsSection(c)}
            {(contentType === 'all' || contentType === 'pitfalls') && renderMistakesSection(c)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Experience Switcher & Quick Navigation Bar */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Left: Active Concept Context */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: viewMode === 'all' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(56, 189, 248, 0.15)',
              border: viewMode === 'all' ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid rgba(56, 189, 248, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: viewMode === 'all' ? '#f59e0b' : 'var(--accent-primary)',
            }}
          >
            {viewMode === 'all' ? <Sparkles size={16} /> : <BookOpen size={16} />}
          </div>
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {viewMode === 'all'
                ? 'All 71 Concepts Universe Catalog'
                : `${concept.command} — Command Variations, Scenarios & Pitfalls`}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {viewMode === 'all'
                ? '219 variations and 79 real-world interactive scenarios across all 18 topics'
                : `Interactive modifiers and failure recovery scenarios for ${concept.title}`}
            </div>
          </div>
        </div>

        {/* Right: Solved Tracker Pill & Concept Jump */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.78rem',
              color: '#22c55e',
              fontWeight: 700,
            }}
          >
            <CheckCircle2 size={14} />
            <span>
              {scenarioStats.answered} / {scenarioStats.total} Scenarios Solved
            </span>
          </div>

          {/* Quick jump to another concept */}
          {onSelectConcept && (
            <select
              value={concept.id}
              onChange={(e) => onSelectConcept(e.target.value)}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                borderRadius: '8px',
                padding: '0.38rem 0.65rem',
                fontSize: '0.76rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {allConceptsList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.command} — {c.title}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MODE 1: ACTIVE CONCEPT FOCUSED VIEW                                  */}
      {/* ==================================================================== */}
      {viewMode === 'current' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Current Concept Details */}
          {renderConceptCard(concept, true)}
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODE 2: ALL 71 CONCEPTS UNIVERSE CATALOG (Variations & Scenarios)    */}
      {/* ==================================================================== */}
      {viewMode === 'all' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Universe Hero Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0c1427 0%, #070c17 100%)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: '14px',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(56, 189, 248, 0.25) 100%)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f59e0b',
                  }}
                >
                  <Layers size={22} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                    The Variations & Real-World Case Scenarios Universe
                  </h2>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    Complete catalog of all 71 concepts, 219 command modifiers, 79 interactive case scenarios, 71 comparisons & recovery pitfalls.
                  </div>
                </div>
              </div>

              {/* Progress Bar & Reset */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '0.65rem 0.95rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  minWidth: '220px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem' }}>
                  <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Mastery Progress</span>
                  <span style={{ color: '#22c55e', fontWeight: 800 }}>
                    {Math.round((scenarioStats.answered / (scenarioStats.total || 1)) * 100)}% ({scenarioStats.answered}/{scenarioStats.total})
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(100, Math.round((scenarioStats.answered / (scenarioStats.total || 1)) * 100))}%`,
                      background: 'linear-gradient(90deg, #38bdf8 0%, #22c55e 100%)',
                      borderRadius: '999px',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.65rem',
              }}
            >
              {[
                { label: 'Total Concepts', value: '71', color: '#38bdf8' },
                { label: 'Command Variations', value: '219', color: '#c084fc' },
                { label: 'Real-World Scenarios', value: '79', color: '#f59e0b' },
                { label: 'Command Comparisons', value: '71', color: '#34d399' },
                { label: 'Syllabus Topics', value: '18', color: '#fb7185' },
              ].map((st, sIdx) => (
                <div
                  key={sIdx}
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '8px',
                    padding: '0.55rem 0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.15rem',
                  }}
                >
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600 }}>{st.label}</span>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: st.color }}>{st.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Universe Filter & Search Bar */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            {/* Search Input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.55rem 0.85rem',
              }}
            >
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all 71 concepts, variation flags, scenarios, comparisons, or pitfalls... (e.g. amend, rebase, revert, cherry-pick)"
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.84rem',
                  width: '100%',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.74rem',
                  }}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Scope / Section Type Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginRight: '0.35rem' }}>
                SHOW SECTIONS:
              </span>
              {(
                [
                  { id: 'all', label: 'All Content' },
                  { id: 'variations', label: '⚡ Variations Only (219)' },
                  { id: 'scenarios', label: '🎯 Case Scenarios Only (79)' },
                  { id: 'comparisons', label: '⚖️ Comparisons (71)' },
                  { id: 'pitfalls', label: '⚠️ Pitfalls (71)' },
                ] as const
              ).map(({ id: sId, label }) => (
                <button
                  key={sId}
                  onClick={() => setContentType(sId)}
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '6px',
                    border: contentType === sId ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: contentType === sId ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    color: contentType === sId ? '#38bdf8' : '#94a3b8',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Topic Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginRight: '0.35rem' }}>
                TOPICS:
              </span>

              <button
                onClick={() => setSelectedTopicId('all')}
                style={{
                  padding: '0.22rem 0.55rem',
                  borderRadius: '6px',
                  border: selectedTopicId === 'all' ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: selectedTopicId === 'all' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  color: selectedTopicId === 'all' ? '#f59e0b' : '#94a3b8',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                All Topics ({ACADEMY_18_TOPICS.length})
              </button>

              {ACADEMY_18_TOPICS.map((topic) => {
                const isSelected = selectedTopicId === topic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopicId(isSelected ? 'all' : topic.id)}
                    style={{
                      padding: '0.22rem 0.55rem',
                      borderRadius: '6px',
                      border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                      background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      color: isSelected ? '#38bdf8' : '#94a3b8',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {topic.number} {topic.title} ({topic.concepts.length})
                  </button>
                );
              })}
            </div>

            {/* Bottom Row: Difficulty & Expand / Collapse Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginRight: '0.35rem' }}>
                  DIFFICULTY:
                </span>
                {['all', 'Beginner', 'Intermediate', 'Advanced', 'Expert'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: '5px',
                      border: selectedDifficulty === diff ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.06)',
                      background: selectedDifficulty === diff ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                      color: selectedDifficulty === diff ? '#f8fafc' : '#64748b',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {diff === 'all' ? 'All Difficulties' : diff}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                  Showing {filteredConcepts.length} of {allConceptsList.length} concepts
                </span>
                <button
                  onClick={handleExpandAll}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#94a3b8',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '5px',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Expand All
                </button>
                <button
                  onClick={handleCollapseAll}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#94a3b8',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '5px',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Collapse All
                </button>
              </div>
            </div>
          </div>

          {/* Concepts Grid / List */}
          {filteredConcepts.length === 0 ? (
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '3rem 2rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <Lightbulb size={28} color="#f59e0b" />
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                No concepts found matching your filters
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Try adjusting your search query or selecting "All Topics".
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTopicId('all');
                  setSelectedDifficulty('all');
                  setContentType('all');
                }}
                style={{
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#38bdf8',
                  padding: '0.45rem 0.95rem',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {filteredConcepts.map((c) => renderConceptCard(c))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
