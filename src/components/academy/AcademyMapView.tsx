import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ACADEMY_CURRICULUM_NODES,
  ACADEMY_STAGES,
  CurriculumNode,
  searchAcademyByIntent,
  IntentSearchResult,
} from '../../data/academyCurriculum';
import { ConceptPreviewDrawer } from './ConceptPreviewDrawer';
import { ProblemSolverModal } from './ProblemSolverModal';
import {
  Search,
  LifeBuoy,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  Layers,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export const AcademyMapView: React.FC = () => {
  const { setMode } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedStageNumber, setSelectedStageNumber] = useState<number | 'All'>('All');
  const [activeDrawerNode, setActiveDrawerNode] = useState<CurriculumNode | null>(null);
  const [isProblemSolverOpen, setIsProblemSolverOpen] = useState<boolean>(false);

  // Search results
  const searchResults: IntentSearchResult[] = useMemo(() => {
    return searchAcademyByIntent(searchQuery);
  }, [searchQuery]);

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return ACADEMY_CURRICULUM_NODES.filter((node) => {
      const matchDiff =
        selectedDifficulty === 'All' || node.difficulty === selectedDifficulty;
      const matchStage =
        selectedStageNumber === 'All' || node.stageNumber === selectedStageNumber;
      return matchDiff && matchStage;
    });
  }, [selectedDifficulty, selectedStageNumber]);

  const handleStartLesson = (nodeId: string) => {
    if (nodeId === 'l2-git-foundations') {
      setMode('learn');
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: '#070b14',
        color: '#f8fafc',
        minHeight: 'calc(100vh - 60px)',
        overflowY: 'auto',
      }}
    >
      {/* ============================================================ */}
      {/* 1. ACADEMY ORIENTATION & NEXT GOAL BANNER                     */}
      {/* ============================================================ */}
      <div
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(56, 189, 248, 0.15) 0%, #0c1322 75%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '1.75rem 2rem 1.25rem 2rem',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#38bdf8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.3rem',
                }}
              >
                <Sparkles size={14} />
                <span>Git + GitHub Knowledge World</span>
              </div>
              <h1
                style={{
                  fontSize: '1.85rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}
              >
                CommitForge Academy
              </h1>
              <p style={{ margin: '0.25rem 0 0 0', color: '#94a3b8', fontSize: '0.88rem' }}>
                Complete curriculum from computer fundamentals through advanced GitHub engineering.
              </p>
            </div>

            {/* QUICK NEXT GOAL ANCHOR (Section 46: What should I learn next?) */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '10px',
                padding: '0.85rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                  You are learning: <strong style={{ color: '#38bdf8' }}>Git Foundations</strong>
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.15rem' }}>
                  Your First Git Save Point
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <button
                  type="button"
                  onClick={() => setMode('roadmap')}
                  style={{
                    background: 'rgba(255, 212, 59, 0.15)',
                    color: '#ffd43b',
                    border: '1px solid #ffd43b',
                    padding: '0.6rem 1rem',
                    borderRadius: '6px',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>🗺️ Visual Roadmap</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('learn')}
                  style={{
                    background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                    color: '#0f172a',
                    border: 'none',
                    padding: '0.6rem 1.15rem',
                    borderRadius: '6px',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 2px 10px rgba(56, 189, 248, 0.3)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>Continue Learning</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 2. SEARCH WITH INTENT & PROBLEM SOLVER ENTRY BAR              */}
          {/* ============================================================ */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            {/* NATURAL LANGUAGE SEARCH INPUT */}
            <div
              style={{
                flex: 1,
                minWidth: '280px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '0.55rem 0.85rem',
                  gap: '0.5rem',
                }}
              >
                <Search size={16} color="#94a3b8" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search concepts or describe your intent (e.g. 'I committed wrong file', 'see what changed', 'lost commit')..."
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#f8fafc',
                    fontSize: '0.84rem',
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.75rem' }}
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* SEARCH RESULTS DROPDOWN */}
              {searchQuery && searchResults.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '0.4rem',
                    background: '#0d1527',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '8px',
                    boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6)',
                    zIndex: 100,
                    maxHeight: '340px',
                    overflowY: 'auto',
                    padding: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                  }}
                >
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', padding: '0.2rem 0.4rem' }}>
                    Intent Matching Concepts
                  </div>
                  {searchResults.map((res, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setActiveDrawerNode(res.node);
                        setSearchQuery('');
                      }}
                      style={{
                        padding: '0.6rem 0.75rem',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8' }}>
                          Level {res.node.level}: {res.node.title}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{res.node.stage}</span>
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>
                        {res.situation}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#86efac', fontFamily: 'monospace' }}>
                        💡 {res.recommendedAction}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PROBLEM SOLVER SHORTCUT BUTTON (Section 37) */}
            <button
              type="button"
              onClick={() => setIsProblemSolverOpen(true)}
              style={{
                background: 'rgba(240, 80, 51, 0.12)',
                border: '1px solid rgba(240, 80, 51, 0.35)',
                color: '#fb923c',
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.15s ease',
              }}
            >
              <LifeBuoy size={15} color="#f05033" />
              <span>What are you trying to do?</span>
            </button>
          </div>

          {/* ============================================================ */}
          {/* 3. FILTERS (STAGE & DIFFICULTY)                               */}
          {/* ============================================================ */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              paddingTop: '0.85rem',
            }}
          >
            {/* STAGE TABS */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', overflowX: 'auto' }}>
              <button
                type="button"
                onClick={() => setSelectedStageNumber('All')}
                style={{
                  background: selectedStageNumber === 'All' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                  border: selectedStageNumber === 'All' ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
                  color: selectedStageNumber === 'All' ? '#38bdf8' : '#94a3b8',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                All Stages (30 Levels)
              </button>

              {ACADEMY_STAGES.map((stg) => {
                const isSelected = selectedStageNumber === stg.id;
                return (
                  <button
                    key={stg.id}
                    type="button"
                    onClick={() => setSelectedStageNumber(stg.id)}
                    style={{
                      background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                      border: isSelected ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
                      color: isSelected ? '#38bdf8' : '#94a3b8',
                      padding: '0.3rem 0.65rem',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Stage {stg.id}: {stg.name}
                  </button>
                );
              })}
            </div>

            {/* DIFFICULTY PILLS */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b', marginRight: '0.2rem' }}>Difficulty:</span>
              {['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'].map((diff) => {
                const isSelected = selectedDifficulty === diff;
                return (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    style={{
                      background: isSelected ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                      border: 'none',
                      color: isSelected ? '#ffffff' : '#64748b',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    {diff}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. VISUAL KNOWLEDGE MAP (6 STAGES, 30 CONNECTED LEVELS)       */}
      {/* ============================================================ */}
      <div
        style={{
          flex: 1,
          padding: '2rem',
          maxWidth: '1280px',
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2.5rem',
        }}
      >
        {ACADEMY_STAGES.map((stage) => {
          // Check if this stage should be shown based on filter
          if (selectedStageNumber !== 'All' && selectedStageNumber !== stage.id) {
            return null;
          }

          const stageNodes = filteredNodes.filter((n) => n.stageNumber === stage.id);
          if (stageNodes.length === 0) return null;

          return (
            <div
              key={stage.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              {/* STAGE HEADER WITH CONNECTIONS ANCHOR */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '0.75rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingBottom: '0.5rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    color: '#38bdf8',
                    background: 'rgba(56, 189, 248, 0.12)',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '4px',
                  }}
                >
                  STAGE {stage.id}
                </span>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                  {stage.name}
                </h2>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  ({stage.levels}) • {stage.description}
                </span>
              </div>

              {/* STAGE NODES GRID */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1rem',
                }}
              >
                {stageNodes.map((node) => {
                  const isCurrentPosition = node.id === 'l2-git-foundations';

                  return (
                    <div
                      key={node.id}
                      onClick={() => setActiveDrawerNode(node)}
                      style={{
                        background: isCurrentPosition
                          ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(56, 189, 248, 0.08) 100%)'
                          : 'rgba(15, 23, 42, 0.7)',
                        border: isCurrentPosition
                          ? '2px solid #38bdf8'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '10px',
                        padding: '1rem 1.15rem',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.65rem',
                        position: 'relative',
                        boxShadow: isCurrentPosition
                          ? '0 0 25px rgba(56, 189, 248, 0.25)'
                          : '0 4px 12px rgba(0, 0, 0, 0.2)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {/* "YOU ARE HERE" BADGE ON LEVEL 2 */}
                      {isCurrentPosition && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '-10px',
                            right: '12px',
                            background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                            color: '#0f172a',
                            fontSize: '0.65rem',
                            fontWeight: 900,
                            padding: '0.15rem 0.55rem',
                            borderRadius: '999px',
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            boxShadow: '0 2px 8px rgba(56, 189, 248, 0.5)',
                          }}
                        >
                          YOU ARE HERE
                        </div>
                      )}

                      {/* TOP ROW: ICON, LEVEL, AND DIFFICULTY */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '1.25rem' }}>{node.highlightIcon}</span>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              color: isCurrentPosition ? '#38bdf8' : '#94a3b8',
                              textTransform: 'uppercase',
                            }}
                          >
                            Level {node.level}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span
                            style={{
                              fontSize: '0.65rem',
                              color: '#64748b',
                              background: 'rgba(255, 255, 255, 0.04)',
                              padding: '0.1rem 0.35rem',
                              borderRadius: '3px',
                            }}
                          >
                            {node.difficulty}
                          </span>

                          {node.isFullyImplemented && (
                            <span
                              style={{
                                fontSize: '0.65rem',
                                color: '#4ade80',
                                background: 'rgba(34, 197, 94, 0.15)',
                                padding: '0.1rem 0.35rem',
                                borderRadius: '3px',
                                fontWeight: 700,
                              }}
                            >
                              Ready
                            </span>
                          )}
                        </div>
                      </div>

                      {/* TITLE & DESCRIPTION */}
                      <div>
                        <h3
                          style={{
                            fontSize: '0.95rem',
                            fontWeight: 800,
                            color: isCurrentPosition ? '#ffffff' : '#f8fafc',
                            margin: '0 0 0.25rem 0',
                            lineHeight: 1.3,
                          }}
                        >
                          {node.title}
                        </h3>
                        <p
                          style={{
                            fontSize: '0.78rem',
                            color: '#94a3b8',
                            margin: 0,
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {node.description}
                        </p>
                      </div>

                      {/* BOTTOM ROW: TIME & ACTION PREVIEW */}
                      <div
                        style={{
                          marginTop: 'auto',
                          paddingTop: '0.4rem',
                          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.72rem',
                          color: '#64748b',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={11} />
                          <span>~{node.estimatedMinutes}m</span>
                        </div>

                        <span
                          style={{
                            color: isCurrentPosition ? '#38bdf8' : '#64748b',
                            fontWeight: isCurrentPosition ? 800 : 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                          }}
                        >
                          {node.isFullyImplemented ? 'Start Lesson' : 'Explore'}
                          <ArrowRight size={11} />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* CONCEPT PREVIEW DRAWER (RIGHT PANEL) */}
      <ConceptPreviewDrawer
        node={activeDrawerNode}
        onClose={() => setActiveDrawerNode(null)}
        onStartLesson={handleStartLesson}
      />

      {/* PROBLEM SOLVER MODAL ("WHAT ARE YOU TRYING TO DO?") */}
      <ProblemSolverModal
        isOpen={isProblemSolverOpen}
        onClose={() => setIsProblemSolverOpen(false)}
        onSelectNode={(nodeId) => {
          const targetNode = ACADEMY_CURRICULUM_NODES.find((n) => n.id === nodeId);
          if (targetNode) {
            setActiveDrawerNode(targetNode);
          }
        }}
      />
    </div>
  );
};
