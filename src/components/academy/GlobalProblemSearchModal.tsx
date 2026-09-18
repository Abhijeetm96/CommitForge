import React, { useState, useMemo } from 'react';
import {
  GLOBAL_PROBLEM_SOLUTIONS,
  ProblemSolution,
  ACADEMY_18_TOPICS,
  UniversalConcept,
} from '../../data/unifiedAcademyData';
import { Search, X, LifeBuoy, ArrowRight, CheckCircle2, Terminal, BookOpen, ChevronRight, HelpCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectConcept: (conceptId: string, tab?: 'Learn' | 'Explore' | 'Sandbox' | 'Visualize' | 'Practice' | 'Reference') => void;
}

export const GlobalProblemSearchModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectConcept,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProblem, setActiveProblem] = useState<ProblemSolution | null>(null);
  const [decisionChoiceIdx, setDecisionChoiceIdx] = useState<number | null>(null);

  // Filter solutions & commands
  const filteredProblems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return GLOBAL_PROBLEM_SOLUTIONS;
    return GLOBAL_PROBLEM_SOLUTIONS.filter(
      (p) =>
        p.problemTitle.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const matchingConcepts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    const results: { id: string; command: string; title: string; topicTitle: string }[] = [];
    for (const topic of ACADEMY_18_TOPICS) {
      for (const c of topic.concepts) {
        if (
          c.command.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.shortDesc.toLowerCase().includes(q)
        ) {
          results.push({
            id: c.id,
            command: c.command,
            title: c.title,
            topicTitle: topic.title,
          });
        }
      }
    }
    return results.slice(0, 6);
  }, [searchQuery]);

  if (!isOpen) return null;

  const handlePickProblem = (prob: ProblemSolution) => {
    setActiveProblem(prob);
    setDecisionChoiceIdx(null);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 1500,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '5vh 1.5rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '780px',
          background: '#090e1a',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '16px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(56, 189, 248, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          color: '#f8fafc',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Search size={20} color="#38bdf8" />
          <input
            autoFocus
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveProblem(null);
            }}
            placeholder='Search commands, topics or ask a question... e.g. "undo last commit"'
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#f8fafc',
              fontSize: '1rem',
              fontWeight: 500,
            }}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveProblem(null);
              }}
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '0.2rem 0.5rem',
              color: '#94a3b8',
              fontSize: '0.72rem',
              cursor: 'pointer',
            }}
          >
            ESC
          </button>
        </div>

        {/* Quick Problem Suggestion Pills */}
        {!searchQuery && !activeProblem && (
          <div
            style={{
              padding: '0.85rem 1.25rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              background: 'rgba(12, 19, 34, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Frequently Asked Situations
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {GLOBAL_PROBLEM_SOLUTIONS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePickProblem(p)}
                  style={{
                    background: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    color: '#e2e8f0',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <LifeBuoy size={12} color="#38bdf8" />
                  {p.problemTitle}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div
          style={{
            maxHeight: '60vh',
            overflowY: 'auto',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {/* Active Problem with Decision Tree */}
          {activeProblem ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <LifeBuoy size={18} color="#f05033" />
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                    {activeProblem.problemTitle}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveProblem(null)}
                  style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.78rem', cursor: 'pointer' }}
                >
                  ← Back to search
                </button>
              </div>

              <div style={{ fontSize: '0.86rem', color: '#94a3b8' }}>
                {activeProblem.description}
              </div>

              {/* Decision Tree Branching */}
              {activeProblem.decisionTree ? (
                <div
                  style={{
                    background: 'rgba(56, 189, 248, 0.05)',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc' }}>
                    {activeProblem.decisionTree.question}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
                    {activeProblem.decisionTree.options.map((opt, oIdx) => {
                      const isChosen = decisionChoiceIdx === oIdx;
                      return (
                        <div
                          key={oIdx}
                          onClick={() => setDecisionChoiceIdx(oIdx)}
                          style={{
                            background: isChosen ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                            border: isChosen ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '10px',
                            padding: '1rem',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div style={{ fontSize: '0.84rem', fontWeight: 700, color: isChosen ? '#38bdf8' : '#f8fafc' }}>
                            {opt.label}
                          </div>
                          <div
                            style={{
                              fontFamily: 'ui-monospace, monospace',
                              fontSize: '0.8rem',
                              color: '#22c55e',
                              fontWeight: 700,
                            }}
                          >
                            $ {opt.recommendedCommand}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
                            {opt.explanation}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectConcept(opt.targetConceptId, opt.targetTab);
                              onClose();
                            }}
                            style={{
                              marginTop: '0.5rem',
                              background: '#38bdf8',
                              color: '#090e1a',
                              border: 'none',
                              padding: '0.35rem 0.75rem',
                              borderRadius: '6px',
                              fontSize: '0.76rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            <span>Open In Academy</span>
                            <ArrowRight size={12} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : activeProblem.directRecommendation ? (
                <div
                  style={{
                    background: 'rgba(34, 197, 94, 0.08)',
                    border: '1px solid rgba(34, 197, 94, 0.25)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#22c55e' }}>
                    Recommended Action:
                  </div>
                  <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.9rem', color: '#f8fafc', fontWeight: 700 }}>
                    $ {activeProblem.directRecommendation.recommendedCommand}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                    {activeProblem.directRecommendation.explanation}
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        if (activeProblem.directRecommendation) {
                          onSelectConcept(
                            activeProblem.directRecommendation.targetConceptId,
                            activeProblem.directRecommendation.targetTab
                          );
                          onClose();
                        }
                      }}
                      style={{
                        background: '#22c55e',
                        color: '#090e1a',
                        border: 'none',
                        padding: '0.45rem 1rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <span>Go to Command Lesson</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              {/* Direct Concept Matches */}
              {matchingConcepts.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Git Commands & Topics
                  </div>
                  {matchingConcepts.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        onSelectConcept(c.id, 'Learn');
                        onClose();
                      }}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Terminal size={16} color="#38bdf8" />
                        <div>
                          <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700, color: '#f8fafc', fontSize: '0.86rem' }}>
                            {c.command}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginLeft: '0.5rem' }}>
                            {c.title}
                          </span>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {c.topicTitle} →
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Problem Matches */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  Problem Solutions & Guidance
                </div>
                {filteredProblems.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handlePickProblem(p)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <LifeBuoy size={16} color="#f05033" />
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f8fafc' }}>
                          {p.problemTitle}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                          {p.description}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={16} color="#64748b" />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
