import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { BENTO_CATEGORIES, BentoCategory, JourneyConcept } from '../../data/journeyModel';
import { CHAPTER_METAS } from '../../data/chapterCurations';
import { getChapterPillars } from '../../data/topicPillars';
import { KnowledgePillarsCard } from '../learn/KnowledgePillarsCard';
import {
  X,
  BookOpen,
  Terminal,
  Layers,
  Sparkles,
  HelpCircle,
  Search,
  ArrowRight,
  Play,
  Check,
  Copy,
  ChevronRight,
} from 'lucide-react';

export const PillarsNavigatorModal: React.FC = () => {
  const {
    showPillarsModal,
    setShowPillarsModal,
    pillarsActiveTarget,
    executeCommand,
    setActiveLessonConcept,
    setMode,
  } = useApp();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    pillarsActiveTarget?.chapterId || BENTO_CATEGORIES[0].id
  );
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(
    pillarsActiveTarget?.conceptId || null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Sync target when modal opens or target changes
  useEffect(() => {
    if (pillarsActiveTarget?.chapterId) {
      setSelectedCategoryId(pillarsActiveTarget.chapterId);
    }
    if (pillarsActiveTarget?.conceptId) {
      setSelectedConceptId(pillarsActiveTarget.conceptId);
    }
  }, [pillarsActiveTarget, showPillarsModal]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showPillarsModal) {
        setShowPillarsModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPillarsModal, setShowPillarsModal]);

  const activeCategory = useMemo(() => {
    return BENTO_CATEGORIES.find((c) => c.id === selectedCategoryId) || BENTO_CATEGORIES[0];
  }, [selectedCategoryId]);

  const chapterMeta = CHAPTER_METAS[activeCategory.id];
  const chapterPillars = useMemo(() => getChapterPillars(activeCategory.id), [activeCategory.id]);

  const activeConcept = useMemo(() => {
    if (!selectedConceptId) return null;
    return activeCategory.concepts.find((c) => c.id === selectedConceptId) || null;
  }, [selectedConceptId, activeCategory]);

  // Filter concepts across all categories if search is active
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results: { category: BentoCategory; concept: JourneyConcept }[] = [];
    for (const cat of BENTO_CATEGORIES) {
      for (const c of cat.concepts) {
        const titleMatch = c.title.toLowerCase().includes(q);
        const cmdMatch = c.commands?.some((cmd) => cmd.toLowerCase().includes(q));
        const subtopicMatch = c.subtopics?.some((st) => st.toLowerCase().includes(q));
        if (titleMatch || cmdMatch || subtopicMatch) {
          results.push({ category: cat, concept: c });
        }
      }
    }
    return results.slice(0, 15);
  }, [searchQuery]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  const handleStartLesson = (conceptId: string) => {
    setShowPillarsModal(false);
    setActiveLessonConcept(conceptId);
    setMode('learn');
  };

  if (!showPillarsModal) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
      }}
      onClick={() => setShowPillarsModal(false)}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #0a1124 0%, #050914 100%)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '1140px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(56, 189, 248, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)',
              }}
            >
              <BookOpen size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#f8fafc' }}>
                  The 5 Pillars of Git Mastery
                </h2>
                <span
                  style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#38bdf8',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  All 12 Chapters • 128 Topics
                </span>
              </div>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                Every single concept includes <strong>Definition</strong>, <strong>Syntax</strong>, <strong>Variations</strong>, <strong>Examples</strong>, and <strong>Explanation</strong>.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Quick search */}
            <div style={{ position: 'relative', width: '240px' }}>
              <Search
                size={14}
                color="#64748b"
                style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search topics or commands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '0.4rem 0.75rem 0.4rem 2.1rem',
                  fontSize: '0.78rem',
                  color: '#f8fafc',
                  outline: 'none',
                }}
              />
            </div>

            <button
              onClick={() => setShowPillarsModal(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#cbd5e1',
                padding: '0.4rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Close (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Chapter Carousel Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            background: 'rgba(0, 0, 0, 0.25)',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          {BENTO_CATEGORIES.map((cat) => {
            const isSelected = selectedCategoryId === cat.id && !searchQuery;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategoryId(cat.id);
                  setSelectedConceptId(null);
                  setSearchQuery('');
                }}
                style={{
                  background: isSelected
                    ? `linear-gradient(135deg, ${cat.accentColor}25, ${cat.accentColor}10)`
                    : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected ? `1.5px solid ${cat.accentColor}` : '1px solid rgba(255, 255, 255, 0.07)',
                  color: isSelected ? '#f8fafc' : '#94a3b8',
                  padding: '0.35rem 0.7rem',
                  borderRadius: '8px',
                  fontSize: '0.74rem',
                  fontWeight: isSelected ? 800 : 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontFamily: 'monospace', color: cat.accentColor, fontWeight: 800 }}>
                  {cat.number}
                </span>
                <span>{cat.title}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body: Left Sidebar Concepts + Right Pillars Viewer */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            overflow: 'hidden',
            minHeight: '480px',
          }}
        >
          {/* Left Column: Topics / Concepts Selector */}
          <div
            style={{
              width: '320px',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(0, 0, 0, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              flexShrink: 0,
            }}
          >
            {/* Search results mode */}
            {searchQuery.trim() ? (
              <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', padding: '0 0.25rem' }}>
                  {searchResults.length} Search Matches
                </div>
                {searchResults.map(({ category, concept }) => {
                  const isSelected = selectedConceptId === concept.id;
                  return (
                    <div
                      key={concept.id}
                      onClick={() => {
                        setSelectedCategoryId(category.id);
                        setSelectedConceptId(concept.id);
                      }}
                      style={{
                        padding: '0.6rem 0.75rem',
                        borderRadius: '8px',
                        background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                        border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ fontSize: '0.68rem', color: category.accentColor, fontWeight: 700 }}>
                        {category.title}
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                        {concept.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {/* 1. Chapter Overview Button */}
                <div
                  onClick={() => setSelectedConceptId(null)}
                  style={{
                    padding: '0.75rem 0.85rem',
                    borderRadius: '10px',
                    background: selectedConceptId === null ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: selectedConceptId === null ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.07)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
                      Chapter Architecture
                    </div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#f8fafc' }}>
                      🏛️ Chapter {activeCategory.number} 5 Pillars
                    </div>
                  </div>
                  {selectedConceptId === null && <ChevronRight size={16} color="#38bdf8" />}
                </div>

                {/* Divider */}
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', padding: '0.35rem 0.25rem 0 0.25rem' }}>
                  Topics & Subtopics ({activeCategory.concepts.length})
                </div>

                {/* Concept list */}
                {activeCategory.concepts.map((concept, idx) => {
                  const isSelected = selectedConceptId === concept.id;
                  return (
                    <div
                      key={concept.id}
                      onClick={() => setSelectedConceptId(concept.id)}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.05)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.2rem',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace' }}>
                          #{idx + 1}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 700 }}>
                          5 Pillars ✓
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isSelected ? '#f8fafc' : '#cbd5e1' }}>
                        {concept.title}
                      </div>
                      {concept.commands && concept.commands[0] && (
                        <code style={{ fontSize: '0.68rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                          {concept.commands[0]}
                        </code>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Active 5-Pillar Inspector */}
          <div
            style={{
              flex: 1,
              padding: '1.25rem 1.5rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {/* If Concept Selected -> Render KnowledgePillarsCard with live action buttons */}
            {activeConcept ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: activeCategory.accentColor, textTransform: 'uppercase' }}>
                      {activeCategory.title} • Module #{activeCategory.concepts.findIndex((c) => c.id === activeConcept.id) + 1}
                    </div>
                    <h3 style={{ margin: '0.15rem 0 0 0', fontSize: '1.25rem', fontWeight: 900, color: '#f8fafc' }}>
                      {activeConcept.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleStartLesson(activeConcept.id)}
                    style={{
                      background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                      border: '1px solid #38bdf8',
                      color: '#fff',
                      padding: '0.45rem 0.9rem',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)',
                    }}
                  >
                    <Play size={14} />
                    <span>Launch Interactive Lesson</span>
                  </button>
                </div>

                {/* The Complete 5-Pillars Card with Subtopic Chips */}
                <KnowledgePillarsCard
                  conceptId={activeConcept.id}
                  onApplyCommand={(cmd) => {
                    executeCommand(cmd);
                    setShowPillarsModal(false);
                    setMode('learn');
                  }}
                  compact={false}
                />
              </div>
            ) : (
              /* Chapter Level 5 Pillars */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: activeCategory.accentColor, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    {chapterMeta?.emoji} Chapter {activeCategory.number}: {activeCategory.tagline}
                  </div>
                  <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.35rem', fontWeight: 900, color: '#f8fafc' }}>
                    {activeCategory.title} — 5 Foundations of Git
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5 }}>
                    {activeCategory.description}
                  </p>
                </div>

                {/* 1. Definition */}
                <div style={{ background: 'rgba(56, 189, 248, 0.07)', borderLeft: '4px solid #38bdf8', padding: '1rem', borderRadius: '0 10px 10px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    <BookOpen size={14} /> 1. Definition
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#f8fafc', lineHeight: 1.5, fontWeight: 500 }}>
                    {chapterPillars.definition.technical}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#fbbf24', marginTop: '0.5rem', fontStyle: 'italic' }}>
                    💡 Intuitive Analogy: {chapterPillars.definition.beginner}
                  </div>
                </div>

                {/* 2. Syntax */}
                <div style={{ background: 'rgba(16, 185, 129, 0.07)', borderLeft: '4px solid #10b981', padding: '1rem', borderRadius: '0 10px 10px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    <Terminal size={14} /> 2. Syntax Grammar
                  </div>
                  <code style={{ fontSize: '0.92rem', color: '#34d399', fontFamily: 'monospace', fontWeight: 700 }}>
                    {chapterPillars.syntax.primary}
                  </code>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.6rem' }}>
                    {chapterPillars.syntax.tokens.map((t, idx) => (
                      <span key={idx} style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.15)', color: '#a7f3d0', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                        <strong>{t.token}</strong> ({t.role}): {t.explanation}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 3. Variations */}
                <div style={{ background: 'rgba(245, 158, 11, 0.07)', borderLeft: '4px solid #f59e0b', padding: '1rem', borderRadius: '0 10px 10px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
                    <Layers size={14} /> 3. Practical Variations
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {chapterPillars.variations.map((v, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', padding: '0.35rem 0', borderBottom: idx < chapterPillars.variations.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none' }}>
                        <div>
                          <code style={{ color: '#fbbf24', fontSize: '0.82rem', fontWeight: 700 }}>{v.syntax}</code>
                          <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '0.15rem' }}>{v.title}</div>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#cbd5e1', background: 'rgba(255, 255, 255, 0.04)', padding: '0.2rem 0.5rem', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                          {v.whenToUse}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Examples */}
                <div style={{ background: 'rgba(168, 85, 247, 0.07)', borderLeft: '4px solid #a855f7', padding: '1rem', borderRadius: '0 10px 10px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase' }}>
                      <Sparkles size={14} /> 4. Real-World Examples
                    </div>
                    {chapterPillars.examples[0] && (
                      <button
                        onClick={() => handleCopy(chapterPillars.examples[0].code)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#cbd5e1',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                      >
                        {copiedCode === chapterPillars.examples[0].code ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                        <span>{copiedCode === chapterPillars.examples[0].code ? 'Copied' : 'Copy Example'}</span>
                      </button>
                    )}
                  </div>
                  <pre
                    style={{
                      margin: 0,
                      padding: '0.75rem',
                      background: 'rgba(0, 0, 0, 0.4)',
                      borderRadius: '8px',
                      color: '#4ade80',
                      fontSize: '0.82rem',
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.45,
                    }}
                  >
                    {chapterPillars.examples[0]?.code}
                  </pre>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '0.45rem' }}>
                    {chapterPillars.examples[0]?.explanation}
                  </div>
                </div>

                {/* 5. Explanation */}
                <div style={{ background: 'rgba(236, 72, 153, 0.07)', borderLeft: '4px solid #ec4899', padding: '1rem', borderRadius: '0 10px 10px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 800, color: '#f472b6', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    <HelpCircle size={14} /> 5. Technical Explanation & Mental Model
                  </div>
                  <div style={{ fontSize: '0.86rem', color: '#f8fafc', lineHeight: 1.5 }}>
                    {chapterPillars.explanation.mentalModel}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
                    <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#38bdf8' }}>WHAT CHANGES</div>
                      <div style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>{chapterPillars.explanation.whatChanges}</div>
                    </div>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#34d399' }}>WHAT DOES NOT CHANGE</div>
                      <div style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>{chapterPillars.explanation.whatDoesNotChange}</div>
                    </div>
                  </div>
                  {chapterPillars.explanation.proTip && (
                    <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(245, 158, 11, 0.12)', borderRadius: '6px', fontSize: '0.76rem', color: '#fde047' }}>
                      💡 <strong>Pro Tip:</strong> {chapterPillars.explanation.proTip}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
