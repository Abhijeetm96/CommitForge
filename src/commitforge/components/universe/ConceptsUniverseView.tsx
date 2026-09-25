import React, { useState, useMemo } from 'react';
import {
  UniversalConcept,
  ACADEMY_18_TOPICS,
  ALL_ACADEMY_CONCEPTS,
  getUniversalConcept,
  ConceptDifficulty,
} from '../../data/unifiedAcademyData';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Search,
  BookOpen,
  Terminal,
  Layers,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  GitCompare,
  Lightbulb,
  Copy,
  Check,
  ChevronRight,
  Flame,
  ArrowRight,
  RotateCcw,
  ArrowUp,
  GraduationCap,
} from 'lucide-react';

type ContentFilterType = 'all' | 'variations' | 'scenarios' | 'comparisons' | 'pitfalls';

export const ConceptsUniverseView: React.FC = () => {
  const { setMode, setActiveLessonConcept, setAcademyTab, setShowProblemSearch } = useApp();

  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [contentType, setContentType] = useState<ContentFilterType>('all');
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
        if (!sc.options || sc.options.length === 0) return;
        total++;
        const key = sc.id || `${c.id}-scenario-${sIdx}`;
        const sel = selectedAnswers[key];
        if (sel !== undefined) {
          answered++;
          if (sc.options[sel]?.isCorrect) {
            correct++;
          }
        }
      });
    });

    return { answered, correct, total };
  }, [allConceptsList, selectedAnswers]);

  const difficultyColors: Record<ConceptDifficulty, { bg: string; text: string; border: string }> = {
    Beginner: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e', border: 'rgba(34, 197, 94, 0.25)' },
    Intermediate: { bg: 'rgba(56, 189, 248, 0.1)', text: '#38bdf8', border: 'rgba(56, 189, 248, 0.25)' },
    Advanced: { bg: 'rgba(168, 85, 247, 0.1)', text: '#a855f7', border: 'rgba(168, 85, 247, 0.25)' },
    Expert: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.25)' },
  };

  const navigateToAcademy = (conceptId: string, tab: 'Learn' | 'Sandbox' = 'Learn') => {
    setActiveLessonConcept(conceptId);
    setAcademyTab(tab);
    setMode('learn', conceptId);
  };

  return (
    <div
      className="concepts-universe-view-container"
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        minHeight: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        boxSizing: 'border-box',
        padding: '1.25rem 2rem 6.5rem 2rem',
        background: 'var(--bg-app)',
      }}
    >
      <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Top Breadcrumb & Return Action Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.85rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.82rem',
              color: '#64748b',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => setMode('home')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.82rem',
                padding: '0.2rem 0.4rem',
                borderRadius: '6px',
              }}
            >
              <Flame size={13} color="#f05033" />
              <span>Forge Suite</span>
            </button>
            <ChevronRight size={12} color="#475569" />
            <button
              onClick={() => setMode('learn')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#cbd5e1',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.82rem',
                padding: '0.2rem 0.4rem',
                borderRadius: '6px',
              }}
            >
              <GraduationCap size={14} color="#38bdf8" />
              <span>CommitForge</span>
            </button>
            <ChevronRight size={12} color="#475569" />
            <span style={{ color: '#f59e0b', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Sparkles size={13} />
              71 Concepts Universe
            </span>
          </nav>

          {/* Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              onClick={() => setShowProblemSearch(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                color: '#38bdf8',
                padding: '0.35rem 0.7rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Search size={13} />
              <span>Problem Solver (⌘K)</span>
            </button>

            <button
              onClick={() => setMode('learn')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#cbd5e1',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <GraduationCap size={14} color="#38bdf8" />
              <span>Back to Git Academy</span>
            </button>
          </div>
        </div>

        {/* Hero Header Section */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0c1427 0%, #070c17 100%)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '16px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
          }}
        >
          {/* Title, Badge, Stats */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.45rem' }}>
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.2)',
                    color: '#f59e0b',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '999px',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <Sparkles size={13} />
                  <span>Independent Curriculum Catalog</span>
                </div>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>•</span>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>18 Topics • 71 Concepts</span>
              </div>

              <h1 style={{ margin: 0, fontSize: '1.65rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                The 71 Git Concepts Universe
              </h1>
              <p style={{ margin: '0.45rem 0 0 0', fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5, maxWidth: '820px' }}>
                The complete interactive encyclopedia of 71 Git concepts, 219 command modifiers, 79 real-world scenarios, and 71 recovery comparisons across all 18 curriculum topics. Click on any concept to study it in the Academy or practice in the Live Sandbox.
              </p>
            </div>

            {/* Mastery Progress Card */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '0.85rem 1.15rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
                minWidth: '240px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem' }}>
                <span style={{ color: '#cbd5e1', fontWeight: 700 }}>Scenarios Solved</span>
                <span style={{ color: '#22c55e', fontWeight: 800 }}>
                  {Math.round((scenarioStats.answered / (scenarioStats.total || 1)) * 100)}% ({scenarioStats.answered}/{scenarioStats.total})
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
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
              {scenarioStats.answered > 0 && (
                <button
                  onClick={() => setSelectedAnswers({})}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '0.68rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.1rem 0',
                    marginTop: '0.15rem',
                  }}
                >
                  <RotateCcw size={11} />
                  <span>Reset scenario answers</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {[
              { label: 'Total Concepts', value: '71', desc: 'All curriculum concepts', color: '#38bdf8' },
              { label: 'Command Variations', value: '219', desc: 'Syntax flags & modifiers', color: '#c084fc' },
              { label: 'Real-World Scenarios', value: '79', desc: 'Interactive challenges', color: '#f59e0b' },
              { label: 'Command Comparisons', value: '71', desc: 'Side-by-side analysis', color: '#34d399' },
              { label: 'Curriculum Topics', value: '18', desc: 'Foundations to CI/CD', color: '#fb7185' },
            ].map((st, sIdx) => (
              <div
                key={sIdx}
                style={{
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>{st.label}</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: st.color }}>{st.value}</span>
                </div>
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{st.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Toolbar: Search, Topic Filter, Difficulty Filter, Content Type Pills */}
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
          {/* Top Row: Search Input & Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div
              style={{
                flex: 1,
                minWidth: '260px',
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
                placeholder="Search all 71 concepts, syntax modifiers, scenario challenges, or recovery pitfalls (e.g. rebase, amend, stash)..."
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
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Topic Filter Dropdown */}
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                borderRadius: '8px',
                padding: '0.55rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Topics (18 Topics • 71 Concepts)</option>
              {ACADEMY_18_TOPICS.map((t) => (
                <option key={t.id} value={t.id}>
                  Topic {t.number}: {t.title} ({t.concepts.length})
                </option>
              ))}
            </select>

            {/* Expand / Collapse All */}
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                onClick={handleExpandAll}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <ChevronDown size={13} />
                <span>Expand All</span>
              </button>
              <button
                onClick={handleCollapseAll}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <ChevronUp size={13} />
                <span>Collapse All</span>
              </button>
            </div>
          </div>

          {/* Bottom Row: Difficulty & Content Filters */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            {/* Difficulty Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginRight: '0.25rem' }}>
                TIER:
              </span>
              {['all', 'Beginner', 'Intermediate', 'Advanced', 'Expert'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  style={{
                    background: selectedDifficulty === diff ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-surface)',
                    border: selectedDifficulty === diff ? '1px solid #38bdf8' : '1px solid var(--border-color)',
                    color: selectedDifficulty === diff ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    borderRadius: '6px',
                    padding: '0.28rem 0.65rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {diff === 'all' ? 'All Tiers' : diff}
                </button>
              ))}
            </div>

            {/* Content Type Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginRight: '0.25rem' }}>
                FOCUS:
              </span>
              {[
                { id: 'all', label: 'All Content' },
                { id: 'variations', label: 'Variations' },
                { id: 'scenarios', label: 'Scenarios' },
                { id: 'comparisons', label: 'Comparisons' },
                { id: 'pitfalls', label: 'Pitfalls' },
              ].map((ct) => (
                <button
                  key={ct.id}
                  onClick={() => setContentType(ct.id as ContentFilterType)}
                  style={{
                    background: contentType === ct.id ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-surface)',
                    border: contentType === ct.id ? '1px solid #f59e0b' : '1px solid var(--border-color)',
                    color: contentType === ct.id ? '#f59e0b' : 'var(--text-secondary)',
                    borderRadius: '6px',
                    padding: '0.28rem 0.65rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {ct.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredConcepts.length}</strong> of{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{allConceptsList.length}</strong> concepts across{' '}
            <strong style={{ color: 'var(--text-primary)' }}>18 topics</strong>
          </div>
          {(searchQuery || selectedTopicId !== 'all' || selectedDifficulty !== 'all' || contentType !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTopicId('all');
                setSelectedDifficulty('all');
                setContentType('all');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#38bdf8',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Reset All Filters
            </button>
          )}
        </div>

        {/* Concept Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredConcepts.map((c) => {
            const isCollapsed = collapsedMap[c.id];
            const diffTheme = difficultyColors[c.difficulty] || difficultyColors.Beginner;
            const varsCount = c.variations?.length || 0;
            const scenCount = c.scenarios?.length || 0;
            const compCount = c.commandComparisons?.length || 0;
            const mistCount = c.commonMistakes?.length || 0;

            return (
              <div
                key={c.id}
                id={`universe-concept-${c.id}`}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '14px',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  transition: 'border-color 0.15s ease',
                }}
              >
                {/* Header Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                    <div
                      style={{
                        padding: '0.35rem 0.65rem',
                        borderRadius: '8px',
                        background: 'rgba(56, 189, 248, 0.1)',
                        border: '1px solid rgba(56, 189, 248, 0.25)',
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        color: 'var(--accent-primary)',
                      }}
                    >
                      {c.command}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {c.title}
                        </h3>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '0.12rem 0.45rem',
                            borderRadius: '999px',
                            background: diffTheme.bg,
                            color: diffTheme.text,
                            border: `1px solid ${diffTheme.border}`,
                          }}
                        >
                          {c.difficulty}
                        </span>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            padding: '0.12rem 0.45rem',
                            borderRadius: '999px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-color)',
                          }}
                        >
                          Topic {c.topicNumber}: {c.topicTitle}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        {c.subtitle}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Collapse Toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <button
                      onClick={() => navigateToAcademy(c.id, 'Learn')}
                      title="Study this concept in Git Academy"
                      style={{
                        background: 'rgba(56, 189, 248, 0.1)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        color: '#38bdf8',
                        padding: '0.3rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <BookOpen size={13} />
                      <span>Learn</span>
                    </button>

                    <button
                      onClick={() => navigateToAcademy(c.id, 'Sandbox')}
                      title="Open interactive sandbox for this concept"
                      style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.25)',
                        color: '#22c55e',
                        padding: '0.3rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <Terminal size={13} />
                      <span>Sandbox</span>
                    </button>

                    <button
                      onClick={() => toggleCollapse(c.id)}
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-secondary)',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <span>{isCollapsed ? 'Expand' : 'Collapse'}</span>
                      {isCollapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
                    </button>
                  </div>
                </div>

                {/* Collapsed summary stats bar */}
                {isCollapsed && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    <span>✨ {varsCount} Variations</span>
                    <span>•</span>
                    <span>🎯 {scenCount} Scenarios</span>
                    <span>•</span>
                    <span>⚖️ {compCount} Comparisons</span>
                    <span>•</span>
                    <span>⚠️ {mistCount} Pitfalls</span>
                  </div>
                )}

                {/* Expanded Sections */}
                {!isCollapsed && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* 1. Variations Section */}
                    {(contentType === 'all' || contentType === 'variations') && c.variations && c.variations.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Layers size={13} />
                          <span>Command Variations & Modifiers ({c.variations.length})</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0.65rem' }}>
                          {c.variations.map((v, vIdx) => (
                            <div
                              key={vIdx}
                              style={{
                                background: 'var(--bg-surface)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                padding: '0.75rem 0.9rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.4rem',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>{v.title}</span>
                                {v.syntax && (
                                  <button
                                    onClick={() => handleCopy(v.syntax || '')}
                                    title="Copy command to clipboard"
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: copiedSnippet === v.syntax ? '#22c55e' : 'var(--text-muted)',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.2rem',
                                      fontSize: '0.7rem',
                                    }}
                                  >
                                    {copiedSnippet === v.syntax ? <Check size={12} /> : <Copy size={12} />}
                                    <span>{copiedSnippet === v.syntax ? 'Copied' : 'Copy'}</span>
                                  </button>
                                )}
                              </div>
                              {v.syntax && (
                                <code style={{ fontSize: '0.76rem', background: 'rgba(0, 0, 0, 0.35)', padding: '0.3rem 0.5rem', borderRadius: '5px', color: 'var(--accent-primary)', display: 'block', wordBreak: 'break-all' }}>
                                  {v.syntax}
                                </code>
                              )}
                              <p style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{v.whatItDoes}</p>
                              {v.whenToUse && (
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                  <strong style={{ color: '#cbd5e1' }}>When:</strong> {v.whenToUse}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2. Interactive Scenarios Section */}
                    {(contentType === 'all' || contentType === 'scenarios') && c.scenarios && c.scenarios.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Lightbulb size={13} />
                          <span>Interactive Case Scenarios ({c.scenarios.length})</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {c.scenarios.map((sc, sIdx) => {
                            const scKey = sc.id || `${c.id}-scenario-${sIdx}`;
                            const selectedOption = selectedAnswers[scKey];
                            const isAnswered = selectedOption !== undefined;
                            const isCorrect = isAnswered && !!sc.options?.[selectedOption]?.isCorrect;

                            return (
                              <div
                                key={sIdx}
                                style={{
                                  background: 'var(--bg-surface)',
                                  border: isAnswered
                                    ? isCorrect
                                      ? '1px solid rgba(34, 197, 94, 0.4)'
                                      : '1px solid rgba(239, 68, 68, 0.4)'
                                    : '1px solid var(--border-color)',
                                  borderRadius: '10px',
                                  padding: '0.9rem 1.1rem',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '0.6rem',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                    Scenario {sIdx + 1}: {sc.title}
                                  </span>
                                  {isAnswered && (
                                    <span
                                      style={{
                                        fontSize: '0.72rem',
                                        fontWeight: 800,
                                        color: isCorrect ? '#22c55e' : '#ef4444',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                      }}
                                    >
                                      {isCorrect ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                                      {isCorrect ? 'Correct Solved!' : 'Incorrect'}
                                    </span>
                                  )}
                                </div>

                                {sc.context && (
                                  <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontStyle: 'italic', background: 'rgba(0, 0, 0, 0.2)', padding: '0.4rem 0.65rem', borderRadius: '6px' }}>
                                    {sc.context}
                                  </div>
                                )}

                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                  {sc.question}
                                </div>

                                {/* Options */}
                                {sc.options && sc.options.length > 0 && (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    {sc.options.map((opt, oIdx) => {
                                      const isThisSelected = selectedOption === oIdx;
                                      const isThisCorrect = !!opt.isCorrect;

                                    let optBg = 'rgba(255, 255, 255, 0.02)';
                                    let optBorder = '1px solid var(--border-color)';
                                    let optColor = 'var(--text-secondary)';

                                    if (isAnswered) {
                                      if (isThisCorrect) {
                                        optBg = 'rgba(34, 197, 94, 0.12)';
                                        optBorder = '1px solid #22c55e';
                                        optColor = '#22c55e';
                                      } else if (isThisSelected) {
                                        optBg = 'rgba(239, 68, 68, 0.12)';
                                        optBorder = '1px solid #ef4444';
                                        optColor = '#ef4444';
                                      }
                                    }

                                    return (
                                      <button
                                        key={oIdx}
                                        onClick={() => handleSelectOption(scKey, oIdx)}
                                        style={{
                                          background: optBg,
                                          border: optBorder,
                                          borderRadius: '6px',
                                          padding: '0.5rem 0.75rem',
                                          textAlign: 'left',
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                          fontSize: '0.78rem',
                                          color: optColor,
                                          transition: 'all 0.15s ease',
                                        }}
                                      >
                                        <div>
                                          <strong>{String.fromCharCode(65 + oIdx)}.</strong> {opt.label}
                                          {opt.command && (
                                            <code style={{ marginLeft: '0.5rem', background: 'rgba(0, 0, 0, 0.3)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.72rem' }}>
                                              {opt.command}
                                            </code>
                                          )}
                                        </div>
                                        {isAnswered && isThisCorrect && <CheckCircle2 size={14} color="#22c55e" />}
                                        {isAnswered && isThisSelected && !isThisCorrect && <XCircle size={14} color="#ef4444" />}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}

                              {isAnswered && (
                                <div
                                  style={{
                                    fontSize: '0.76rem',
                                    color: isCorrect ? '#86efac' : '#fca5a5',
                                    background: isCorrect ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                                    padding: '0.45rem 0.65rem',
                                    borderRadius: '6px',
                                    lineHeight: 1.4,
                                  }}
                                >
                                  <strong>Explanation:</strong> {sc.options?.[selectedOption]?.explanation || 'Review the documentation for full details.'}
                                </div>
                              )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 3. Command Comparisons Section */}
                    {(contentType === 'all' || contentType === 'comparisons') && c.commandComparisons && c.commandComparisons.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <GitCompare size={13} />
                          <span>Command Comparisons ({c.commandComparisons.length})</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0.65rem' }}>
                          {c.commandComparisons.map((cc, cIdx) => (
                            <div
                              key={cIdx}
                              style={{
                                background: 'var(--bg-surface)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                padding: '0.75rem 0.9rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.4rem',
                              }}
                            >
                              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#34d399' }}>{cc.aspect}</div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '0.45rem', borderRadius: '6px' }}>
                                  <code style={{ fontSize: '0.74rem', color: 'var(--accent-primary)', fontWeight: 700 }}>{cc.commandA}</code>
                                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>{cc.descriptionA}</p>
                                </div>
                                <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '0.45rem', borderRadius: '6px' }}>
                                  <code style={{ fontSize: '0.74rem', color: '#c084fc', fontWeight: 700 }}>{cc.commandB}</code>
                                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>{cc.descriptionB}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 4. Common Mistakes & Pitfalls Section */}
                    {(contentType === 'all' || contentType === 'pitfalls') && c.commonMistakes && c.commonMistakes.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#fb7185', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <AlertTriangle size={13} />
                          <span>Pitfalls & Recovery Guides ({c.commonMistakes.length})</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0.65rem' }}>
                          {c.commonMistakes.map((m, mIdx) => (
                            <div
                              key={mIdx}
                              style={{
                                background: 'rgba(239, 68, 68, 0.05)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                borderRadius: '8px',
                                padding: '0.75rem 0.9rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.35rem',
                              }}
                            >
                              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f87171' }}>⚠️ {m.mistake}</div>
                              <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                                <strong style={{ color: '#cbd5e1' }}>Why:</strong> {m.whyItHappens}
                              </p>
                              <div style={{ marginTop: '0.2rem', background: 'rgba(0, 0, 0, 0.3)', padding: '0.35rem 0.5rem', borderRadius: '5px' }}>
                                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#4ade80' }}>Fix & Recover:</div>
                                <code style={{ fontSize: '0.72rem', color: '#86efac', display: 'block', marginTop: '0.15rem' }}>{m.fix}</code>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Floating Scroll to Top button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <button
            onClick={() => {
              const el = document.querySelector('.concepts-universe-view-container');
              if (el) el.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              padding: '0.5rem 1rem',
              borderRadius: '999px',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <ArrowUp size={14} />
            <span>Back to Top of Universe</span>
          </button>
        </div>
      </div>
    </div>
  );
};
