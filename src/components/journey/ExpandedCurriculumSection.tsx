import React, { useState } from 'react';
import { BentoCategory, JourneyConcept } from '../../data/journeyModel';
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  Clock,
  Circle,
  Lock,
  Terminal,
  Layers,
  Sparkles,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CHAPTER_METAS } from '../../data/chapterCurations';
import { getChapterPillars } from '../../data/topicPillars';
import { KnowledgePillarsCard } from '../learn/KnowledgePillarsCard';

interface ExpandedCurriculumSectionProps {
  category: BentoCategory;
  onBack: () => void;
  onSelectConcept: (concept: JourneyConcept, category: BentoCategory) => void;
}

export const ExpandedCurriculumSection: React.FC<ExpandedCurriculumSectionProps> = ({
  category,
  onBack,
  onSelectConcept,
}) => {
  const { kidMode } = useApp();
  const [showChapterPillars, setShowChapterPillars] = useState<boolean>(true);
  const [inspectedConceptId, setInspectedConceptId] = useState<string | null>(null);

  const chapterMeta = CHAPTER_METAS[category.id];
  const chapterPillars = getChapterPillars(category.id);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem',
        animation: 'fadeIn 0.2s ease-out',
        width: '100%',
      }}
    >
      {/* Category Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0d1527 0%, #080d18 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '1.75rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '4px',
            height: '100%',
            background: category.accentColor,
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#cbd5e1',
              padding: '0.4rem 0.8rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
          >
            <ArrowLeft size={14} />
            <span>Back to Bento Grid</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
            <span>Category {category.number} of 12</span>
            <span>•</span>
            <span style={{ color: category.accentColor, fontWeight: 700 }}>
              {category.concepts.length} Concept Modules
            </span>
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: category.accentColor,
              marginBottom: '0.35rem',
            }}
          >
            {kidMode && chapterMeta ? `${chapterMeta.emoji} ${chapterMeta.themeTitle}` : category.tagline}
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#f8fafc', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>
            {kidMode && chapterMeta ? `${chapterMeta.emoji} Chapter ${category.number}: ${category.title}` : category.title}
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8', margin: 0, maxWidth: '700px', lineHeight: 1.5 }}>
            {kidMode && chapterMeta ? chapterMeta.kidMetaphor : category.description}
          </p>

          {kidMode && chapterMeta && (
            <div
              style={{
                marginTop: '1rem',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1.5px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '12px',
                padding: '0.9rem 1.1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
              }}
            >
              <span style={{ fontSize: '1.3rem' }}>{chapterMeta.emoji}</span>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fde047', marginBottom: '0.2rem' }}>
                  Chapter Adventure: {chapterMeta.themeTitle}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                  {chapterMeta.kidStory}
                </div>
              </div>
            </div>
          )}

          {/* Chapter 5-Pillars Core Reference Button */}
          <div style={{ marginTop: '0.85rem' }}>
            <button
              type="button"
              onClick={() => setShowChapterPillars(!showChapterPillars)}
              style={{
                background: showChapterPillars ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: showChapterPillars ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                color: showChapterPillars ? '#38bdf8' : '#cbd5e1',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.15s ease',
              }}
            >
              <BookOpen size={14} color="#38bdf8" />
              <span>{showChapterPillars ? 'Hide Chapter 5 Pillars' : '📚 View Chapter 5 Pillars (Definition • Syntax • Variations • Examples • Explanation)'}</span>
              {showChapterPillars ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showChapterPillars && (
              <div
                style={{
                  marginTop: '0.85rem',
                  background: 'rgba(5, 9, 18, 0.95)',
                  border: '1.5px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                }}
              >
                {/* 1. Definition */}
                <div style={{ background: 'rgba(56, 189, 248, 0.08)', borderLeft: '3px solid #38bdf8', padding: '0.75rem 1rem', borderRadius: '0 8px 8px 0' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    📖 Chapter Definition
                  </div>
                  <div style={{ fontSize: '0.86rem', color: '#f8fafc', lineHeight: 1.45 }}>
                    {chapterPillars.definition.technical}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#fbbf24', marginTop: '0.35rem', fontStyle: 'italic' }}>
                    🧒 {chapterPillars.definition.beginner}
                  </div>
                </div>

                {/* 2. Syntax */}
                <div style={{ background: 'rgba(16, 185, 129, 0.08)', borderLeft: '3px solid #10b981', padding: '0.75rem 1rem', borderRadius: '0 8px 8px 0' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    💻 Chapter Syntax Conventions
                  </div>
                  <code style={{ fontSize: '0.86rem', color: '#f8fafc', fontFamily: 'monospace' }}>
                    {chapterPillars.syntax.primary}
                  </code>
                </div>

                {/* 3. Variations */}
                <div style={{ background: 'rgba(245, 158, 11, 0.08)', borderLeft: '3px solid #f59e0b', padding: '0.75rem 1rem', borderRadius: '0 8px 8px 0' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    🔀 Key Command Variations
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {chapterPillars.variations.map((v, idx) => (
                      <div key={idx} style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                        <code style={{ color: '#fbbf24', fontWeight: 700, marginRight: '0.5rem' }}>{v.syntax}</code>
                        <span style={{ color: '#94a3b8' }}>— {v.whenToUse}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Examples */}
                <div style={{ background: 'rgba(168, 85, 247, 0.08)', borderLeft: '3px solid #a855f7', padding: '0.75rem 1rem', borderRadius: '0 8px 8px 0' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    💡 Real-World Workflow Example
                  </div>
                  <pre style={{ margin: 0, padding: '0.5rem', background: '#00000088', borderRadius: '6px', color: '#4ade80', fontSize: '0.78rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                    {chapterPillars.examples[0]?.code}
                  </pre>
                  <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.35rem' }}>
                    {chapterPillars.examples[0]?.explanation}
                  </div>
                </div>

                {/* 5. Explanation */}
                <div style={{ background: 'rgba(236, 72, 153, 0.08)', borderLeft: '3px solid #ec4899', padding: '0.75rem 1rem', borderRadius: '0 8px 8px 0' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f472b6', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    🧠 Deep Explanation & Pro-Tip
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                    {chapterPillars.explanation.whatChanges}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#e9d5ff', marginTop: '0.35rem' }}>
                    ⚡ <strong>Pro Tip:</strong> {chapterPillars.explanation.proTip}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {category.prerequisites && category.prerequisites.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
            <span style={{ fontWeight: 700 }}>Prerequisites:</span>
            {category.prerequisites.map((p) => (
              <span
                key={p}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  color: '#cbd5e1',
                }}
              >
                {p}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Grid of Compact Concept Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem',
          width: '100%',
        }}
      >
        {category.concepts.map((concept) => {
          const isMastered = concept.status === 'mastered';
          const isInProgress = concept.status === 'in-progress';
          const isLocked = concept.status === 'locked';

          return (
            <div
              key={concept.id}
              onClick={() => !isLocked && onSelectConcept(concept, category)}
              style={{
                background: isInProgress
                  ? 'linear-gradient(135deg, #0e1c31 0%, #091220 100%)'
                  : 'linear-gradient(135deg, #0d1527 0%, #090e1a 100%)',
                border: isInProgress
                  ? '1.5px solid #38bdf8'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
                cursor: isLocked ? 'not-allowed' : 'pointer',
                opacity: isLocked ? 0.6 : 1,
                boxShadow: isInProgress ? '0 4px 20px rgba(56, 189, 248, 0.15)' : '0 2px 10px rgba(0,0,0,0.3)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isLocked) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = category.accentColor;
                }
              }}
              onMouseLeave={(e) => {
                if (!isLocked) {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = isInProgress ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)';
                }
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {concept.difficulty}
                  </span>

                  {/* Status Indicator */}
                  {isMastered ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontSize: '0.72rem', fontWeight: 700 }}>
                      <CheckCircle2 size={13} />
                      <span>Learned</span>
                    </div>
                  ) : isInProgress ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#38bdf8', fontSize: '0.72rem', fontWeight: 700 }}>
                      <Clock size={13} />
                      <span>In progress</span>
                    </div>
                  ) : isLocked ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#64748b', fontSize: '0.72rem', fontWeight: 700 }}>
                      <Lock size={13} />
                      <span>Locked</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#94a3b8', fontSize: '0.72rem', fontWeight: 600 }}>
                      <Circle size={11} opacity={0.6} />
                      <span>Available</span>
                    </div>
                  )}
                </div>

                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 0.4rem 0' }}>
                  {concept.title}
                </h4>

                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 0.75rem 0', lineHeight: 1.45 }}>
                  {concept.description}
                </p>

                {concept.commands && concept.commands.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
                    {concept.commands.map((cmd) => (
                      <code
                        key={cmd}
                        style={{
                          fontSize: '0.68rem',
                          fontFamily: 'var(--font-mono, monospace)',
                          background: 'rgba(0, 0, 0, 0.4)',
                          color: '#38bdf8',
                          padding: '0.15rem 0.4rem',
                          borderRadius: '4px',
                          border: '1px solid rgba(56, 189, 248, 0.2)',
                        }}
                      >
                        {cmd}
                      </code>
                    ))}
                  </div>
                )}

                {/* Subtopics List */}
                {concept.subtopics && concept.subtopics.length > 0 && (
                  <div style={{ marginTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: '#64748b',
                      }}
                    >
                      Subtopics Covered ({concept.subtopics.length})
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {concept.subtopics.map((sub, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '0.72rem',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.07)',
                            borderRadius: '5px',
                            padding: '0.15rem 0.45rem',
                            color: '#cbd5e1',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            lineHeight: 1.3,
                          }}
                        >
                          <span style={{ color: category.accentColor, fontSize: '0.75rem', lineHeight: 1 }}>•</span>
                          <span>{sub}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {/* 🌟 5-Pillars Badges Preview */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap', marginTop: '0.65rem' }}>
                  <span style={{ fontSize: '0.62rem', background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', padding: '0.1rem 0.35rem', borderRadius: '4px', border: '1px solid rgba(56, 189, 248, 0.25)', fontWeight: 600 }}>
                    📖 Def
                  </span>
                  <span style={{ fontSize: '0.62rem', background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', padding: '0.1rem 0.35rem', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.25)', fontWeight: 600 }}>
                    💻 Syntax
                  </span>
                  <span style={{ fontSize: '0.62rem', background: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', padding: '0.1rem 0.35rem', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.25)', fontWeight: 600 }}>
                    🔀 Var
                  </span>
                  <span style={{ fontSize: '0.62rem', background: 'rgba(168, 85, 247, 0.12)', color: '#c084fc', padding: '0.1rem 0.35rem', borderRadius: '4px', border: '1px solid rgba(168, 85, 247, 0.25)', fontWeight: 600 }}>
                    💡 Ex
                  </span>
                  <span style={{ fontSize: '0.62rem', background: 'rgba(236, 72, 153, 0.12)', color: '#f472b6', padding: '0.1rem 0.35rem', borderRadius: '4px', border: '1px solid rgba(236, 72, 153, 0.25)', fontWeight: 600 }}>
                    🧠 Expl
                  </span>
                </div>
              </div>

              {/* Action Buttons: 5 Pillars & Start Lesson */}
              <div
                style={{
                  paddingTop: '0.65rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                }}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInspectedConceptId(inspectedConceptId === concept.id ? null : concept.id);
                  }}
                  style={{
                    background: inspectedConceptId === concept.id ? 'rgba(56, 189, 248, 0.2)' : 'rgba(56, 189, 248, 0.08)',
                    color: inspectedConceptId === concept.id ? '#38bdf8' : '#38bdf8',
                    border: inspectedConceptId === concept.id ? '1.5px solid #38bdf8' : '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '6px',
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.15s ease',
                  }}
                  title="Inspect Definition, Syntax, Variations, Examples, and Explanation"
                >
                  <BookOpen size={12} />
                  <span>{inspectedConceptId === concept.id ? 'Hide 5 Pillars' : '📚 View 5 Pillars'}</span>
                </button>

                <button
                  disabled={isLocked}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isLocked) onSelectConcept(concept, category);
                  }}
                  style={{
                    background: isInProgress
                      ? 'linear-gradient(135deg, #f05033 0%, #ea580c 100%)'
                      : 'rgba(255, 255, 255, 0.05)',
                    color: isInProgress ? '#ffffff' : '#cbd5e1',
                    border: isInProgress ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <Play size={11} fill={isInProgress ? 'white' : 'none'} />
                  <span>{isMastered ? 'Review Lesson' : isInProgress ? 'Resume Lesson' : 'Start Lesson'}</span>
                </button>
              </div>

              {/* Inline 5-Pillars Card for this concept and subtopics */}
              {inspectedConceptId === concept.id && (
                <div style={{ marginTop: '0.85rem' }} onClick={(e) => e.stopPropagation()}>
                  <KnowledgePillarsCard conceptId={concept.id} compact={false} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
