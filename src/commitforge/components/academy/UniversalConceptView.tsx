import React, { useState } from 'react';
import { UniversalConcept } from '../../data/unifiedAcademyData';
import { UniversalConceptHero, AcademyConceptTab } from './UniversalConceptHero';
import { InteractiveSyntaxExplorer } from './InteractiveSyntaxExplorer';
import { InteractiveTerminalSandbox } from './InteractiveTerminalSandbox';
import { ConceptVisualActionStage } from './ConceptVisualActionStage';
import { ConceptExploreTab } from './ConceptExploreTab';
import { ConceptPracticeTab } from './ConceptPracticeTab';
import { ConceptReferenceTab } from './ConceptReferenceTab';
import { ConceptVisualizerTab } from './ConceptVisualizerTab';
import { ThreeAreaVisualizer } from '../visualizer/ThreeAreaVisualizer';
import { GitGraph } from '../visualizer/GitGraph';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  HelpCircle,
  Lightbulb,
  Gamepad2,
  Play,
  Terminal,
  Layers,
  CheckCircle2,
  XCircle,
  ArrowRight,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

interface Props {
  concept: UniversalConcept;
  activeTab: AcademyConceptTab;
  onSelectTab: (tab: AcademyConceptTab) => void;
  onSelectConcept?: (conceptId: string, targetTab?: AcademyConceptTab) => void;
}

export const UniversalConceptView: React.FC<Props> = ({
  concept,
  activeTab,
  onSelectTab,
  onSelectConcept,
}) => {
  const { repo, completedLessonIds, markLessonComplete, setMode } = useApp();
  const isCiCd = concept.topicId === 'topic-15';

  const isCompleted = completedLessonIds.includes(concept.id);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [exploreViewMode, setExploreViewMode] = useState<'current' | 'all'>('current');
  const [exploreContentType, setExploreContentType] = useState<'all' | 'variations' | 'scenarios' | 'comparisons' | 'pitfalls'>('all');

  const handleToggleComplete = () => {
    markLessonComplete(concept.id);
  };

  const handleSelectOption = (scenarioId: string, optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [scenarioId]: optionIdx,
    }));
  };

  return (
    <div
      className="academy-concept-container"
      style={{
        flex: 1,
        minHeight: 0,
        height: '100%',
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        padding: '1rem 1.75rem 6.5rem 1.75rem',
        overflowY: 'auto',
        overflowX: 'hidden',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Universal Concept Hero & Sub-Tabs */}
      <UniversalConceptHero
        concept={concept}
        isCompleted={isCompleted}
        onToggleComplete={handleToggleComplete}
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        onSelectConcept={onSelectConcept}
      />

      {/* ================================================================ */}
      {/* TAB 1: LEARN (Default Beginner-First Experience)                  */}
      {/* ================================================================ */}
      {activeTab === 'Learn' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Section 1: What is it? */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={18} color={isCiCd ? '#a855f7' : '#38bdf8'} />
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
                1. What is it?
              </h2>
            </div>

            <div
              className="academy-two-col-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '0.85rem',
              }}
            >
              {/* Left Card: Core definition */}
              <div
                style={{
                  background: isCiCd ? 'rgba(30, 18, 56, 0.4)' : 'var(--bg-card)',
                  border: isCiCd ? '1px solid rgba(139, 92, 246, 0.25)' : '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '1rem 1.15rem',
                  fontSize: '0.86rem',
                  color: 'var(--text-primary)',
                  lineHeight: 1.55,
                }}
              >
                {concept.whatIsIt}
              </div>

              {/* Right Card: In simple words */}
              <div
                style={{
                  background: isCiCd ? 'rgba(139, 92, 246, 0.08)' : 'rgba(56, 189, 248, 0.05)',
                  border: isCiCd ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: '12px',
                  padding: '1rem 1.15rem',
                  display: 'flex',
                  gap: '0.75rem',
                }}
              >
                <div style={{ color: isCiCd ? '#c084fc' : '#38bdf8', flexShrink: 0, marginTop: '2px' }}>
                  <Lightbulb size={20} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: isCiCd ? '#c084fc' : '#38bdf8' }}>
                    In simple words
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                    {concept.inSimpleWords}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Why do you need it? */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={18} color="#f05033" />
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
                2. Why do you need it?
              </h2>
            </div>

            <div
              className="academy-two-col-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '0.85rem',
              }}
            >
              {/* Left Card: Rationale */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '1rem 1.15rem',
                  fontSize: '0.86rem',
                  color: 'var(--text-primary)',
                  lineHeight: 1.55,
                }}
              >
                {concept.whyDoYouNeedIt}
              </div>

              {/* Right Card: Real world analogy */}
              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.05)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  borderRadius: '12px',
                  padding: '1rem 1.15rem',
                  display: 'flex',
                  gap: '0.75rem',
                }}
              >
                <div style={{ color: '#22c55e', flexShrink: 0, marginTop: '2px' }}>
                  <Gamepad2 size={20} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#22c55e' }}>
                    Real world analogy
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                    {concept.realWorldAnalogy}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Syntax */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 800, color: isCiCd ? '#a855f7' : '#f59e0b', fontSize: '1rem' }}>
                &gt;_
              </span>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
                3. Syntax
              </h2>
            </div>

            <InteractiveSyntaxExplorer
              syntaxCode={concept.syntaxCode}
              syntaxTokens={concept.syntaxTokens}
            />
          </div>

          {/* Section 4: See it in action */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Play size={18} color={isCiCd ? '#a855f7' : '#22c55e'} />
              <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                4. See it in action
              </h2>
            </div>

            <ConceptVisualActionStage
              concept={concept}
              onOpenVisualize={() => onSelectTab('Visualize')}
            />
          </div>

          {/* Section 5: Common Variations & Modifiers */}
          {concept.variations && concept.variations.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={18} color="#c084fc" />
                  <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                    5. Common Variations & Modifiers
                  </h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      setExploreViewMode('current');
                      setExploreContentType('variations');
                      onSelectTab('Explore');
                    }}
                    style={{
                      background: 'rgba(192, 132, 252, 0.1)',
                      border: '1px solid rgba(192, 132, 252, 0.25)',
                      borderRadius: '6px',
                      color: '#c084fc',
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>Deep Variations Tab</span>
                    <ArrowRight size={13} />
                  </button>
                  <button
                    onClick={() => {
                      setMode('universe');
                    }}
                    style={{
                      background: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      borderRadius: '6px',
                      color: '#38bdf8',
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Sparkles size={13} />
                    <span>Browse All 75 Concepts (220+ Variations)</span>
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
                {concept.variations.map((v, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '1rem 1.15rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <span
                        style={{
                          fontFamily: 'ui-monospace, monospace',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          color: '#38bdf8',
                          background: 'rgba(56, 189, 248, 0.1)',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                        }}
                      >
                        {v.syntax || v.snippet || v.flag || v.title}
                      </span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc' }}>
                        {v.title}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.45 }}>
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
                        <div>
                          <span style={{ fontWeight: 700, color: '#38bdf8', marginRight: '0.35rem' }}>
                            EXAMPLE:
                          </span>
                          <code style={{ color: '#38bdf8', fontFamily: 'monospace' }}>{v.example || v.snippet}</code>
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
          )}

          {/* Section 6: Real-World Case Scenarios */}
          {concept.scenarios && concept.scenarios.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <HelpCircle size={18} color="#f59e0b" />
                  <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                    6. Real-World Case Scenarios
                  </h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      setExploreViewMode('current');
                      setExploreContentType('scenarios');
                      onSelectTab('Explore');
                    }}
                    style={{
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      borderRadius: '6px',
                      color: '#f59e0b',
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>This Concept's Scenarios</span>
                    <ArrowRight size={13} />
                  </button>
                  <button
                    onClick={() => {
                      setMode('universe');
                    }}
                    style={{
                      background: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid rgba(245, 158, 11, 0.35)',
                      borderRadius: '6px',
                      color: '#f59e0b',
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Sparkles size={13} />
                    <span>Solve All 79 Scenarios across 71 Concepts</span>
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {concept.scenarios.map((sc, scIdx) => {
                  const scenarioKey = sc.id || `scenario-${scIdx}`;
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
                        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc' }}>
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
                            border: sc.options ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(56, 189, 248, 0.3)',
                          }}
                        >
                          {sc.options ? 'Scenario Challenge' : 'Production Scenario'}
                        </span>
                      </div>

                      {sc.context && (
                        <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontStyle: 'italic', lineHeight: 1.4 }}>
                          Context: {sc.context}
                        </div>
                      )}

                      {sc.question && (
                        <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#cbd5e1' }}>
                          {sc.question}
                        </div>
                      )}

                      {/* Interactive Choice Buttons (if options array exists) */}
                      {sc.options && sc.options.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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

                      {/* Scenario Guide Card (when whenToUse / commandExample is used) */}
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
                              }}
                            >
                              $ {sc.commandExample}
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
          )}
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB 2: EXPLORE (Variations, Scenarios, Comparisons, Pitfalls)    */}
      {/* ================================================================ */}
      {activeTab === 'Explore' && (
        <ConceptExploreTab
          concept={concept}
          onSelectConcept={onSelectConcept}
          initialViewMode="current"
          initialContentType={exploreContentType}
        />
      )}

      {/* ================================================================ */}
      {/* TAB: SANDBOX (Full Live Terminal, Visualizer, & Engine)          */}
      {/* ================================================================ */}
      {activeTab === 'Sandbox' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(34, 197, 94, 0.2)',
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#22c55e',
                }}
              >
                <Terminal size={20} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
                  Live Git Sandbox: {concept.command}
                </h2>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Execute commands safely. Changes dynamically update the repository visualizer below.
                </div>
              </div>
            </div>

            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#22c55e',
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
              Live Engine Connected
            </span>
          </div>

          {/* Interactive Terminal */}
          <InteractiveTerminalSandbox
            concept={concept}
            isFullView={true}
            onSelectConcept={onSelectConcept}
          />

          {/* Live 3-Area Visualizer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#f8fafc' }}>
                Live Repository State
              </div>
              <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                Updates in real-time as you execute commands above
              </div>
            </div>
            <ThreeAreaVisualizer repo={repo} />
          </div>

          {/* Git History Graph */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#f8fafc' }}>
              Commit Graph DAG
            </div>
            <GitGraph repo={repo} onSelectCommit={() => {}} />
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB 3: VISUALIZE (Full 3-Tree Visualizer & Live Graph)             */}
      {/* ================================================================ */}
      {activeTab === 'Visualize' && (
        <ConceptVisualizerTab
          concept={concept}
          onSelectConcept={onSelectConcept}
        />
      )}

      {/* ================================================================ */}
      {/* TAB 4: PRACTICE (Live Challenge & Safe Failure Arena)            */}
      {/* ================================================================ */}
      {activeTab === 'Practice' && (
        <ConceptPracticeTab concept={concept} />
      )}

      {/* ================================================================ */}
      {/* TAB 5: REFERENCE (Full Options, Internals, Edge Cases)           */}
      {/* ================================================================ */}
      {activeTab === 'Reference' && (
        <ConceptReferenceTab concept={concept} />
      )}
    </div>
  );
};
