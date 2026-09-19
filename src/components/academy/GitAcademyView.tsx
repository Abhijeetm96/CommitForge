import React, { useState, useMemo } from 'react';
import {
  ACADEMY_18_TOPICS,
  getUniversalConcept,
  UniversalConcept,
} from '../../data/unifiedAcademyData';
import { UniversalConceptView } from './UniversalConceptView';
import { AcademyConceptTab } from './UniversalConceptHero';
import { getConceptIcon, getTopicIcon } from './academyIcons';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  X,
  Search,
  Terminal,
} from 'lucide-react';

interface Props {
  initialConceptId?: string;
}

export const GitAcademyView: React.FC<Props> = ({ initialConceptId }) => {
  const { completedLessonIds, markLessonComplete, setShowProblemSearch, mode } = useApp();

  const [activeConceptId, setActiveConceptId] = useState<string>(
    initialConceptId || 'c-git-commit'
  );

  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({
    'topic-02': true,
  });

  const [activeTab, setActiveTab] = useState<AcademyConceptTab>(
    mode === 'community' ? 'Explore' : mode === 'visualize' ? 'Visualize' : 'Learn'
  );

  React.useEffect(() => {
    if (mode === 'visualize') {
      setActiveTab('Visualize');
    } else if (mode === 'community') {
      setActiveTab('Explore');
    }
  }, [mode]);
  const [showMobileTopicsDrawer, setShowMobileTopicsDrawer] = useState<boolean>(false);

  const activeConcept: UniversalConcept = useMemo(() => {
    return getUniversalConcept(activeConceptId);
  }, [activeConceptId]);

  const toggleTopic = (topicId: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  const handleSelectConcept = (cId: string, tab?: AcademyConceptTab) => {
    setActiveConceptId(cId);
    if (tab) {
      setActiveTab(tab);
    }
  };

  // Flattened concept list for Next / Previous navigation
  const allConceptList = useMemo(() => {
    return ACADEMY_18_TOPICS.flatMap((topic) => topic.concepts);
  }, []);

  const currentConceptIndex = useMemo(() => {
    return allConceptList.findIndex((c) => c.id === activeConceptId);
  }, [allConceptList, activeConceptId]);

  const prevConcept = currentConceptIndex > 0 ? allConceptList[currentConceptIndex - 1] : null;
  const nextConcept =
    currentConceptIndex >= 0 && currentConceptIndex < allConceptList.length - 1
      ? allConceptList[currentConceptIndex + 1]
      : null;

  const isConceptDone = completedLessonIds.includes(activeConceptId);

  const handleNavigateConcept = (cId: string) => {
    setActiveConceptId(cId);
    const parentTopic = ACADEMY_18_TOPICS.find((t) => t.concepts.some((c) => c.id === cId));
    if (parentTopic) {
      setExpandedTopics((prev) => ({
        ...prev,
        [parentTopic.id]: true,
      }));
    }
  };

  // Progress metrics
  const totalConcepts = useMemo(() => {
    return ACADEMY_18_TOPICS.reduce((acc, t) => acc + t.concepts.length, 0);
  }, []);

  const completedCount = completedLessonIds.length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalConcepts) * 100));

  // Render unique relevant icons for each concept
  const renderConceptIcon = (conceptId: string, command: string, isDone: boolean) => {
    if (isDone) {
      return <CheckCircle2 size={14} color="#22c55e" />;
    }
    return getConceptIcon(conceptId, command, 14);
  };

  // Render topic icons dynamically
  const renderTopicIcon = (iconName: string) => {
    return getTopicIcon(iconName, 16);
  };

  const renderTopicsSidebar = (isDrawer = false) => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      {/* Sidebar Header */}
      <div
        style={{
          padding: '1.25rem 1.25rem 1rem 1.25rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
            }}
          >
            <GraduationCap size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.15 }}>
              Git Academy
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>
              18 Topics • Your Git Journey
            </div>
          </div>
        </div>

        {isDrawer && (
          <button
            onClick={() => setShowMobileTopicsDrawer(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: '#94a3b8',
              padding: '0.3rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Close Topics Drawer"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* 18 Topics Accordion List */}
      <div
        style={{
          flex: '1 1 0%',
          minHeight: 0,
          overflowY: 'auto',
          padding: '0.75rem 0.5rem 3rem 0.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
        }}
      >
        {ACADEMY_18_TOPICS.map((topic) => {
          const isExpanded = !!expandedTopics[topic.id];
          const hasActiveChild = topic.concepts.some((c) => c.id === activeConceptId);

          return (
            <div key={topic.id} style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Topic Header Row */}
              <div
                onClick={() => toggleTopic(topic.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: hasActiveChild && !isExpanded
                    ? 'rgba(56, 189, 248, 0.08)'
                    : 'transparent',
                  color: hasActiveChild ? '#38bdf8' : '#94a3b8',
                  transition: 'all 0.15s ease',
                }}
                className="sidebar-topic-row"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span
                    style={{
                      fontFamily: 'ui-monospace, monospace',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#64748b',
                      width: '18px',
                    }}
                  >
                    {topic.number}
                  </span>
                  <span style={{ color: hasActiveChild ? '#38bdf8' : '#64748b' }}>
                    {renderTopicIcon(topic.iconName)}
                  </span>
                  <span
                    style={{
                      fontSize: '0.84rem',
                      fontWeight: hasActiveChild ? 700 : 600,
                      color: hasActiveChild ? '#f8fafc' : '#cbd5e1',
                    }}
                  >
                    {topic.title}
                  </span>
                </div>

                <span style={{ color: '#64748b' }}>
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </span>
              </div>

              {/* Sub-concepts */}
              {isExpanded && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                    padding: '0.25rem 0.5rem 0.5rem 1.85rem',
                  }}
                >
                  {topic.concepts.map((concept) => {
                    const isActive = concept.id === activeConceptId;
                    const isDone = completedLessonIds.includes(concept.id);

                    return (
                      <div
                        key={concept.id}
                        onClick={() => {
                          handleSelectConcept(concept.id);
                          if (isDrawer) setShowMobileTopicsDrawer(false);
                        }}
                        style={{
                          padding: '0.55rem 0.75rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.55rem',
                          background: isActive
                            ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(37, 99, 235, 0.25) 100%)'
                            : 'transparent',
                          border: isActive ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
                          color: isActive ? '#38bdf8' : isDone ? '#22c55e' : '#94a3b8',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span
                          style={{
                            color: isActive ? '#38bdf8' : isDone ? '#22c55e' : '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {renderConceptIcon(concept.id, concept.command, isDone)}
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                          <span
                            style={{
                              fontFamily: 'ui-monospace, monospace',
                              fontSize: '0.8rem',
                              fontWeight: isActive ? 800 : 600,
                              color: isActive ? '#f8fafc' : '#e2e8f0',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {concept.command}
                          </span>
                          <span
                            style={{
                              fontSize: '0.68rem',
                              color: isActive ? '#38bdf8' : '#64748b',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {concept.shortDesc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Tracker Footer */}
      <div
        style={{
          flexShrink: 0,
          padding: '0.85rem 1.15rem',
          borderTop: '1px solid var(--border-color)',
          background: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8' }}>
            Your Progress
          </span>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8' }}>
            {progressPercent}%
          </span>
        </div>

        <div
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '999px',
            background: 'rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #38bdf8 0%, #22c55e 100%)',
              borderRadius: '999px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
          {completedCount} of {totalConcepts} concepts completed
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        height: '100%',
        maxHeight: '100%',
        minHeight: 0,
        background: 'var(--bg-app)',
        color: 'var(--text-primary)',
        overflow: 'hidden',
      }}
    >
      {/* ================================================================ */}
      {/* COLUMN 1: LEFT SIDEBAR (18 Topics Accordion + Progress Tracker) */}
      {/* ================================================================ */}
      <aside
        className="academy-sidebar-desktop"
        style={{
          width: '240px',
          minWidth: '240px',
          maxWidth: '240px',
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          maxHeight: '100%',
          minHeight: 0,
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        {renderTopicsSidebar(false)}
      </aside>

      {/* ================================================================ */}
      {/* COLUMN 2: CENTER PANEL (Universal Concept Page)                   */}
      {/* ================================================================ */}
      <main
        className="academy-center-main"
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          maxHeight: '100%',
          overflow: 'hidden',
          background: 'var(--bg-app)',
        }}
      >
        {/* Mobile & Tablet Top Bar (<1200px) */}
        <div
          className="academy-mobile-topbar"
          style={{
            flexShrink: 0,
            padding: '0.5rem 0.85rem',
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
          }}
        >
          {/* Topics Drawer Toggle Button */}
          <button
            onClick={() => setShowMobileTopicsDrawer(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '8px',
              padding: '0.35rem 0.65rem',
              color: '#38bdf8',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              maxWidth: '65%',
            }}
          >
            <GraduationCap size={15} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Topics (18) • {activeConcept.command}
            </span>
            <ChevronDown size={13} />
          </button>

          {/* Quick Sandbox / Problem Search on Mobile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              onClick={() => setActiveTab('Sandbox')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: activeTab === 'Sandbox' ? 'rgba(34, 197, 94, 0.25)' : 'rgba(34, 197, 94, 0.1)',
                border: activeTab === 'Sandbox' ? '1px solid #22c55e' : '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '8px',
                padding: '0.35rem 0.6rem',
                color: '#22c55e',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Terminal size={13} />
              <span>Sandbox</span>
            </button>
            <button
              onClick={() => setShowProblemSearch(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30px',
                height: '30px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#cbd5e1',
                cursor: 'pointer',
              }}
              title="Search problems & commands"
            >
              <Search size={14} />
            </button>
          </div>
        </div>

        <div
          style={{
            flex: '1 1 0%',
            minHeight: 0,
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <UniversalConceptView
            concept={activeConcept}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onSelectConcept={handleSelectConcept}
          />
        </div>

        {/* Pinned Center Footer Bar */}
        <div
          className="academy-bottom-bar"
          style={{
            flexShrink: 0,
            padding: '0.65rem 1.25rem',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            boxSizing: 'border-box',
          }}
        >
          {/* Previous Concept Button */}
          <button
            disabled={!prevConcept}
            onClick={() => prevConcept && handleNavigateConcept(prevConcept.id)}
            title={prevConcept ? `Go to ${prevConcept.command}` : 'No previous concept'}
            style={{
              background: prevConcept ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
              border: prevConcept ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
              color: prevConcept ? '#cbd5e1' : '#475569',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              cursor: prevConcept ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s ease',
            }}
          >
            <ChevronLeft size={14} />
            <span className="academy-bottom-label" style={{ maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {prevConcept ? `Prev: ${prevConcept.command}` : 'Start'}
            </span>
          </button>

          {/* Center: Mark Complete + Problem Search Shortcut */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => markLessonComplete(activeConceptId)}
              style={{
                background: isConceptDone
                  ? 'rgba(34, 197, 94, 0.15)'
                  : 'rgba(56, 189, 248, 0.12)',
                border: isConceptDone
                  ? '1px solid rgba(34, 197, 94, 0.35)'
                  : '1px solid rgba(56, 189, 248, 0.3)',
                color: isConceptDone ? '#22c55e' : '#38bdf8',
                padding: '0.42rem 0.95rem',
                borderRadius: '8px',
                fontSize: '0.76rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <CheckCircle2 size={14} />
              <span>{isConceptDone ? 'Learned ✓' : 'Mark as Learned'}</span>
            </button>
          </div>

          {/* Next Concept Button */}
          <button
            disabled={!nextConcept}
            onClick={() => nextConcept && handleNavigateConcept(nextConcept.id)}
            title={nextConcept ? `Go to ${nextConcept.command}` : 'All concepts completed'}
            style={{
              background: nextConcept
                ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(37, 99, 235, 0.25) 100%)'
                : 'transparent',
              border: nextConcept
                ? '1px solid rgba(56, 189, 248, 0.4)'
                : '1px solid transparent',
              color: nextConcept ? '#f8fafc' : '#475569',
              padding: '0.45rem 0.95rem',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              cursor: nextConcept ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s ease',
            }}
          >
            <span className="academy-bottom-label" style={{ maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {nextConcept ? `Next: ${nextConcept.command}` : 'Completed!'}
            </span>
            <ChevronRight size={14} />
          </button>
        </div>
      </main>

      {/* Mobile Topics Drawer */}
      {showMobileTopicsDrawer && (
        <div
          className="academy-mobile-drawer-backdrop"
          onClick={() => setShowMobileTopicsDrawer(false)}
        >
          <div
            className="academy-mobile-drawer-content"
            onClick={(e) => e.stopPropagation()}
          >
            {renderTopicsSidebar(true)}
          </div>
        </div>
      )}
    </div>
  );
};
