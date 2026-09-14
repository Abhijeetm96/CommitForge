import React, { useState } from 'react';
import { BENTO_CATEGORIES, BentoCategory } from '../../data/journeyModel';
import { CurriculumPreview } from './CurriculumPreviews';
import { ArrowRight, Lock, CheckCircle2, Clock, Sparkles, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CHAPTER_METAS } from '../../data/chapterCurations';

interface CurriculumBentoProps {
  onSelectCategory: (cat: BentoCategory) => void;
  activeCategoryId?: string | null;
}

export const CurriculumBento: React.FC<CurriculumBentoProps> = ({
  onSelectCategory,
  activeCategoryId,
}) => {
  const { kidMode, openPillarsModal } = useApp();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div
      className="curriculum-bento-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '1.25rem',
        width: '100%',
      }}
    >
      {BENTO_CATEGORIES.map((cat) => {
        const isHovered = hoveredId === cat.id;
        const isSelected = activeCategoryId === cat.id;
        const isLocked = cat.status === 'locked';
        const chapterMeta = CHAPTER_METAS[cat.id];

        return (
          <div
            key={cat.id}
            className={`bento-tile bento-span-${cat.colSpanDesktop}`}
            onClick={() => onSelectCategory(cat)}
            onMouseEnter={() => setHoveredId(cat.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              gridColumn: `span ${cat.colSpanDesktop}`,
              background: isSelected
                ? 'linear-gradient(135deg, #131d33 0%, #0d1527 100%)'
                : 'linear-gradient(135deg, #0d1527 0%, #080d18 100%)',
              border: isSelected
                ? `1.5px solid ${cat.accentColor}`
                : isHovered
                ? '1.5px solid rgba(255, 255, 255, 0.2)'
                : '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '230px',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: isHovered
                ? '0 12px 32px rgba(0, 0, 0, 0.5), 0 0 24px rgba(56, 189, 248, 0.08)'
                : '0 4px 16px rgba(0, 0, 0, 0.3)',
              transform: isHovered ? 'translateY(-3px)' : 'none',
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, box-shadow 0.2s ease',
              opacity: isLocked ? 0.75 : 1,
            }}
          >
            {/* Subtle category accent bar at top */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '20px',
                right: '20px',
                height: '2px',
                background: isHovered || isSelected ? cat.accentColor : 'transparent',
                transition: 'background 0.2s ease',
              }}
            />

            {/* Header: Category Number, Title & Status */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.65rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: cat.accentColor,
                    }}
                  >
                    {cat.number}
                  </span>
                  <span style={{ color: '#475569', fontSize: '0.7rem' }}>—</span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: '#94a3b8',
                    }}
                  >
                    {kidMode && chapterMeta ? chapterMeta.emoji + ' ' + cat.tagline : cat.tagline}
                  </span>
                </div>

                {/* Status Indicator */}
                {cat.status === 'mastered' ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.68rem',
                      color: '#10b981',
                      fontWeight: 700,
                    }}
                  >
                    <CheckCircle2 size={12} />
                    <span>Learned</span>
                  </div>
                ) : cat.status === 'in-progress' ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.68rem',
                      color: '#38bdf8',
                      fontWeight: 700,
                    }}
                  >
                    <Clock size={12} />
                    <span>In Progress</span>
                  </div>
                ) : isLocked ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.68rem',
                      color: '#64748b',
                      fontWeight: 700,
                    }}
                  >
                    <Lock size={12} />
                    <span>Locked</span>
                  </div>
                ) : null}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: '#f8fafc',
                  letterSpacing: '-0.02em',
                  margin: '0 0 0.4rem 0',
                }}
              >
                {kidMode && chapterMeta ? `${chapterMeta.emoji} ${cat.title}` : cat.title}
              </h3>

              <p
                style={{
                  fontSize: '0.82rem',
                  color: '#94a3b8',
                  lineHeight: 1.45,
                  margin: '0 0 0.85rem 0',
                }}
              >
                {kidMode && chapterMeta ? chapterMeta.kidMetaphor : cat.description}
              </p>

              {/* Concepts List (3-4 bullet tags) */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.35rem',
                  marginBottom: '1rem',
                }}
              >
                {cat.concepts.slice(0, 4).map((c) => (
                  <span
                    key={c.id}
                    style={{
                      fontSize: '0.68rem',
                      color: '#cbd5e1',
                      background: 'rgba(255, 255, 255, 0.04)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    {c.title}
                  </span>
                ))}
                {cat.concepts.length > 4 && (
                  <span
                    style={{
                      fontSize: '0.68rem',
                      color: '#64748b',
                      padding: '0.15rem 0.25rem',
                    }}
                  >
                    +{cat.concepts.length - 4} more
                  </span>
                )}
              </div>

              {/* 🌟 5 Pillars Quick Access Ribbon */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  openPillarsModal({ chapterId: cat.id });
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '7px',
                  background: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  marginBottom: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(56, 189, 248, 0.18)';
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.25)';
                }}
                title="View Definition, Syntax, Variations, Examples & Explanation for this chapter"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <BookOpen size={12} color="#38bdf8" />
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#38bdf8' }}>
                    5 Pillars
                  </span>
                  <span style={{ fontSize: '0.66rem', color: '#94a3b8' }}>
                    Def • Syntax • Var • Ex • Expl
                  </span>
                </div>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#38bdf8' }}>
                  Open ➔
                </span>
              </div>
            </div>

            {/* Bottom Row: Visual Concept Preview & Explore Link */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              {/* Lightweight SVG/CSS Preview */}
              <CurriculumPreview type={cat.previewType} isHovered={isHovered} />

              {/* Concepts & Subtopics count + Explore CTA */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: isHovered ? cat.accentColor : '#64748b',
                  transition: 'color 0.15s ease',
                }}
              >
                <span>
                  {cat.concepts.length} topics • {cat.concepts.reduce((acc, c) => acc + (c.subtopics ? c.subtopics.length : 0), 0)} subtopics
                </span>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    color: isHovered ? cat.accentColor : 'transparent',
                    transform: isHovered ? 'translateX(2px)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Explore <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
