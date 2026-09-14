import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BENTO_CATEGORIES,
  BentoCategory,
  JourneyConcept,
  TimelineMilestone,
  CONTINUING_ROADMAPS,
} from '../../data/journeyModel';
import { ContinueLearningCard } from './ContinueLearningCard';
import { JourneyTimeline } from './JourneyTimeline';
import { CurriculumBento } from './CurriculumBento';
import { ExpandedCurriculumSection } from './ExpandedCurriculumSection';
import {
  HelpCircle,
  Terminal,
  Search,
  LayoutGrid,
  ListFilter,
  ArrowRight,
  ExternalLink,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface GitJourneyViewProps {
  onStartTeacherLesson?: (conceptId?: string) => void;
  onOpenCommandAtlas?: () => void;
}

export const GitJourneyView: React.FC<GitJourneyViewProps> = ({
  onStartTeacherLesson,
  onOpenCommandAtlas,
}) => {
  const { setMode, setShowLostDrawer, kidMode, openPillarsModal } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<BentoCategory | null>(null);
  const [viewMode, setViewMode] = useState<'bento' | 'atlas'>('bento');
  const [searchQuery, setSearchQuery] = useState('');

  const totalConceptCount = useMemo(() => {
    return BENTO_CATEGORIES.reduce((acc, cat) => acc + cat.concepts.length, 0);
  }, []);

  const totalSubtopicCount = useMemo(() => {
    return BENTO_CATEGORIES.reduce(
      (acc, cat) => acc + cat.concepts.reduce((cAcc, c) => cAcc + (c.subtopics ? c.subtopics.length : 0), 0),
      0
    );
  }, []);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return BENTO_CATEGORIES;
    const q = searchQuery.toLowerCase().trim();
    return BENTO_CATEGORIES.map((cat) => {
      const matchingConcepts = cat.concepts.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          (c.commands && c.commands.some((cmd) => cmd.toLowerCase().includes(q))) ||
          (c.subtopics && c.subtopics.some((sub) => sub.toLowerCase().includes(q)))
      );
      return {
        ...cat,
        concepts: matchingConcepts,
      };
    }).filter((cat) => cat.concepts.length > 0);
  }, [searchQuery]);

  const matchingConceptsCount = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.concepts.length, 0);
  }, [filteredCategories]);

  const handleContinue = () => {
    if (onStartTeacherLesson) {
      onStartTeacherLesson('c-what-is-vcs');
    } else {
      setMode('learn');
    }
  };

  const handleSelectConcept = (concept: JourneyConcept, category: BentoCategory) => {
    if (onStartTeacherLesson) {
      onStartTeacherLesson(concept.id);
    } else {
      setMode('learn');
    }
  };

  const handleSelectMilestone = (milestone: TimelineMilestone) => {
    const targetCat = BENTO_CATEGORIES.find((c) => c.id === milestone.categoryId);
    if (targetCat) {
      setSelectedCategory(targetCat);
      setViewMode('bento');
    }
  };

  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        minHeight: '100%',
        background: '#070b14',
        color: '#f8fafc',
        overflowY: 'auto',
        padding: '2.5rem 2rem 5rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1280px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2.5rem',
        }}
      >
        {/* ============================================================ */}
        {/* HERO TITLE & INTRO                                           */}
        {/* ============================================================ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: '#f05033',
              }}
            >
              CommitForge Academy
            </span>
            {kidMode ? (
              <span
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  color: '#fbbf24',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.65rem',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span>🧒 Kid Mode Active • The Magic Time Machine</span>
              </span>
            ) : (
              <span
                style={{
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  color: '#38bdf8',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <Sparkles size={11} />
                100% Roadmap Parity • {totalConceptCount} Topics • {totalSubtopicCount} Subtopics
              </span>
            )}
          </div>

          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              letterSpacing: '-0.035em',
              color: '#f8fafc',
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            {kidMode ? 'Your Git Adventure' : 'Your Git Journey'}
          </h1>
          <p
            style={{
              fontSize: '1.05rem',
              color: '#94a3b8',
              margin: 0,
              maxWidth: '680px',
              lineHeight: 1.5,
            }}
          >
            {kidMode
              ? 'Git is a Magic Time Machine Camera! Take Polaroid snapshots of your code and games so you can rewind mistakes and explore alternate timelines anytime!'
              : 'From your first local commit to Git internals, branching strategies, and GitHub engineering. Every concept from the curriculum is structured and interactive.'}
          </p>
        </div>

        {/* ============================================================ */}
        {/* 🧒 KID MODE 3-STEP VISUAL STORY BANNER                       */}
        {/* ============================================================ */}
        {kidMode && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(56, 189, 248, 0.08) 100%)',
              border: '1.5px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontWeight: 800, color: '#fde047' }}>
              <span>🚀 The Secret to Git in 3 Fun Steps:</span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1rem',
              }}
            >
              {/* Step 1 */}
              <div style={{ background: '#070b14', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ fontSize: '1.4rem', marginBottom: '0.3rem' }}>🎨</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.2rem' }}>
                  1. Build on your Desk
                </div>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', lineHeight: 1.4 }}>
                  This is your <strong>Working Tree</strong>. Write stories or code. It’s like drawing on your craft desk.
                </div>
              </div>

              {/* Step 2 */}
              <div style={{ background: '#070b14', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ fontSize: '1.4rem', marginBottom: '0.3rem' }}>🎒</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.2rem' }}>
                  2. Pack your Backpack
                </div>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', lineHeight: 1.4 }}>
                  Type <code>git add</code> to choose which drawings are ready for your next adventure photo.
                </div>
              </div>

              {/* Step 3 */}
              <div style={{ background: '#070b14', border: '1px solid rgba(74, 222, 128, 0.25)', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ fontSize: '1.4rem', marginBottom: '0.3rem' }}>📸</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.2rem' }}>
                  3. Snap a Polaroid Photo
                </div>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', lineHeight: 1.4 }}>
                  Type <code>git commit</code>! You’ve sealed a game save point in your photo album forever.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* DOMINANT HERO: CONTINUE LEARNING CARD                        */}
        {/* ============================================================ */}
        <ContinueLearningCard onContinue={handleContinue} />

        {/* ============================================================ */}
        {/* HORIZONTAL JOURNEY TIMELINE                                  */}
        {/* ============================================================ */}
        <div
          style={{
            background: '#0a101f',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
          }}
        >
          <JourneyTimeline
            onSelectMilestone={handleSelectMilestone}
            activeCategoryId={selectedCategory?.id}
          />
        </div>

        {/* ============================================================ */}
        {/* CURRICULUM SECTION: BENTO OR EXPANDED OR ATLAS               */}
        {/* ============================================================ */}
        <div>
          {selectedCategory ? (
            <ExpandedCurriculumSection
              category={selectedCategory}
              onBack={() => setSelectedCategory(null)}
              onSelectConcept={handleSelectConcept}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Header & Controls */}
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
                  <h2
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      color: '#f8fafc',
                      letterSpacing: '-0.02em',
                      margin: '0 0 0.25rem 0',
                    }}
                  >
                    Explore Curriculum
                  </h2>
                  <p style={{ fontSize: '0.86rem', color: '#94a3b8', margin: 0 }}>
                    12 comprehensive areas • {totalConceptCount} verified topics • {totalSubtopicCount} subtopics covering the complete developer Git toolchain.
                  </p>
                </div>

                {/* View Mode Toggle & Quick Utilities */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                  {/* Search Bar */}
                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Search
                      size={14}
                      color="#64748b"
                      style={{ position: 'absolute', left: '0.75rem', pointerEvents: 'none' }}
                    />
                    <input
                      type="text"
                      placeholder="Search 128 topics & subtopics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '0.45rem 0.85rem 0.45rem 2.1rem',
                        fontSize: '0.78rem',
                        color: '#f8fafc',
                        outline: 'none',
                        width: '210px',
                        transition: 'width 0.2s ease, border-color 0.2s ease',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'rgba(56, 189, 248, 0.4)')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)')}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        style={{
                          position: 'absolute',
                          right: '0.5rem',
                          background: 'none',
                          border: 'none',
                          color: '#94a3b8',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* View Toggle */}
                  <div
                    style={{
                      display: 'flex',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '2px',
                    }}
                  >
                    <button
                      onClick={() => setViewMode('bento')}
                      style={{
                        background: viewMode === 'bento' && !searchQuery ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                        color: viewMode === 'bento' && !searchQuery ? '#f8fafc' : '#94a3b8',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.35rem 0.65rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <LayoutGrid size={13} />
                      <span>Bento</span>
                    </button>
                    <button
                      onClick={() => setViewMode('atlas')}
                      style={{
                        background: viewMode === 'atlas' || searchQuery ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                        color: viewMode === 'atlas' || searchQuery ? '#38bdf8' : '#94a3b8',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.35rem 0.65rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <ListFilter size={13} />
                      <span>Full Atlas ({totalConceptCount} Topics)</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setShowLostDrawer(true)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#cbd5e1',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      padding: '0.45rem 0.85rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <HelpCircle size={14} color="#f59e0b" />
                    <span>I have a problem</span>
                  </button>

                  <button
                    onClick={onOpenCommandAtlas}
                    style={{
                      background: 'rgba(56, 189, 248, 0.1)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      color: '#38bdf8',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      padding: '0.45rem 0.85rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <Terminal size={14} />
                    <span>Command Atlas</span>
                    <kbd
                      style={{
                        background: 'rgba(56, 189, 248, 0.2)',
                        padding: '0.1rem 0.35rem',
                        borderRadius: '4px',
                        fontSize: '0.65rem',
                        fontFamily: 'monospace',
                      }}
                    >
                      ⌘K
                    </kbd>
                  </button>
                </div>
              </div>

              {/* Active Search Notification */}
              {searchQuery && (
                <div
                  style={{
                    background: 'rgba(56, 189, 248, 0.06)',
                    border: '1px solid rgba(56, 189, 248, 0.15)',
                    borderRadius: '8px',
                    padding: '0.6rem 1rem',
                    fontSize: '0.82rem',
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>
                    Found <strong style={{ color: '#38bdf8' }}>{matchingConceptsCount}</strong> topic
                    {matchingConceptsCount === 1 ? '' : 's'} matching "{searchQuery}"
                  </span>
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#38bdf8',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Clear Search
                  </button>
                </div>
              )}

              {/* 🌟 5-Pillars of Mastery Highlight Banner */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(99, 102, 241, 0.12) 100%)',
                  border: '1.5px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '12px',
                  padding: '0.85rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.85rem',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      flexShrink: 0,
                    }}
                  >
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>5 Pillars of Mastery: Every Chapter & Subtopic Included</span>
                      <span style={{ fontSize: '0.65rem', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '0.1rem 0.45rem', borderRadius: '999px', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
                        VERIFIED & COMPLETE
                      </span>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '0.2rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      <span style={{ color: '#38bdf8', fontWeight: 700 }}>📖 Definition</span>
                      <span>•</span>
                      <span style={{ color: '#34d399', fontWeight: 700 }}>💻 Syntax</span>
                      <span>•</span>
                      <span style={{ color: '#fbbf24', fontWeight: 700 }}>🔀 Variations</span>
                      <span>•</span>
                      <span style={{ color: '#c084fc', fontWeight: 700 }}>💡 Examples</span>
                      <span>•</span>
                      <span style={{ color: '#f472b6', fontWeight: 700 }}>🧠 Explanation</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => openPillarsModal()}
                  style={{
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    border: '1px solid #38bdf8',
                    color: '#fff',
                    padding: '0.45rem 0.95rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 2px 10px rgba(56, 189, 248, 0.3)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>Explore 5 Pillars Navigator</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* View Rendering: Bento OR Full Atlas */}
              {viewMode === 'bento' && !searchQuery ? (
                <CurriculumBento
                  onSelectCategory={(cat) => setSelectedCategory(cat)}
                  activeCategoryId={undefined}
                />
              ) : (
                /* Full Atlas Matrix View: All categories and all 128 topics visible at once */
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                    gap: '1.25rem',
                  }}
                >
                  {filteredCategories.map((category) => (
                    <div
                      key={category.id}
                      style={{
                        background: '#0c1222',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '14px',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        transition: 'border-color 0.2s ease',
                      }}
                    >
                      {/* Header */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              color: category.accentColor,
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                              marginBottom: '0.2rem',
                            }}
                          >
                            AREA {category.number}
                          </div>
                          <h3
                            style={{
                              fontSize: '1.05rem',
                              fontWeight: 800,
                              color: '#f8fafc',
                              margin: 0,
                            }}
                          >
                            {category.title}
                          </h3>
                        </div>
                        <button
                          onClick={() => setSelectedCategory(category)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#cbd5e1',
                            borderRadius: '6px',
                            padding: '0.25rem 0.55rem',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <span>Explore</span>
                          <ArrowRight size={11} />
                        </button>
                      </div>

                      {/* Concepts List */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {category.concepts.map((concept) => (
                          <div
                            key={concept.id}
                            onClick={() => handleSelectConcept(concept, category)}
                            style={{
                              background: 'rgba(255, 255, 255, 0.02)',
                              border: '1px solid rgba(255, 255, 255, 0.05)',
                              borderRadius: '8px',
                              padding: '0.55rem 0.75rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '0.75rem',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                              e.currentTarget.style.borderColor = category.accentColor + '55';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                            }}
                          >
                            <div style={{ minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: '0.84rem',
                                  fontWeight: 600,
                                  color: '#e2e8f0',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {concept.title}
                              </div>
                              {concept.commands && concept.commands[0] && (
                                <div
                                  style={{
                                    fontSize: '0.7rem',
                                    fontFamily: 'monospace',
                                    color: '#64748b',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}
                                >
                                  {concept.commands[0]}
                                </div>
                              )}
                              {concept.subtopics && concept.subtopics.length > 0 && (
                                <div
                                  style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '0.25rem',
                                    marginTop: '0.35rem',
                                  }}
                                >
                                  {concept.subtopics.map((sub, sIdx) => (
                                    <span
                                      key={sIdx}
                                      style={{
                                        fontSize: '0.67rem',
                                        background: 'rgba(255, 255, 255, 0.04)',
                                        border: '1px solid rgba(255, 255, 255, 0.06)',
                                        borderRadius: '4px',
                                        padding: '0.08rem 0.35rem',
                                        color: '#94a3b8',
                                        lineHeight: 1.3,
                                      }}
                                    >
                                      • {sub}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                              <span
                                style={{
                                  fontSize: '0.65rem',
                                  fontWeight: 700,
                                  padding: '0.1rem 0.35rem',
                                  borderRadius: '4px',
                                  background:
                                    concept.difficulty === 'Beginner'
                                      ? 'rgba(16, 185, 129, 0.15)'
                                      : concept.difficulty === 'Intermediate'
                                      ? 'rgba(56, 189, 248, 0.15)'
                                      : concept.difficulty === 'Advanced'
                                      ? 'rgba(245, 158, 11, 0.15)'
                                      : 'rgba(239, 68, 68, 0.15)',
                                  color:
                                    concept.difficulty === 'Beginner'
                                      ? '#10b981'
                                      : concept.difficulty === 'Intermediate'
                                      ? '#38bdf8'
                                      : concept.difficulty === 'Advanced'
                                      ? '#f59e0b'
                                      : '#ef4444',
                                }}
                              >
                                {concept.difficulty}
                              </span>
                              <ArrowRight size={13} color="#64748b" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* CONTINUING ROADMAPS FOOTER (Matching PDF Footer)             */}
        {/* ============================================================ */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#64748b',
                marginBottom: '0.25rem',
              }}
            >
              Curriculum Progression
            </div>
            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: 800,
                color: '#f8fafc',
                margin: '0 0 0.25rem 0',
              }}
            >
              Continue learning with following roadmaps:
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#94a3b8', margin: 0 }}>
              Once you master Git and GitHub version control, extend your developer craft into specialized software engineering tracks.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
            }}
          >
            {CONTINUING_ROADMAPS.map((roadmap) => (
              <div
                key={roadmap.id}
                style={{
                  background: '#0a101f',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px',
                  padding: '1.15rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  transition: 'border-color 0.2s ease, transform 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = roadmap.badgeColor + '66';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      background: roadmap.badgeColor + '20',
                      color: roadmap.badgeColor,
                    }}
                  >
                    {roadmap.title} Track
                  </span>
                  <ExternalLink size={13} color="#64748b" />
                </div>

                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                  {roadmap.title} Roadmap
                </div>

                <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
                  {roadmap.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
