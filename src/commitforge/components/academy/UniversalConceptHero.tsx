import React from 'react';
import { UniversalConcept, ACADEMY_18_TOPICS } from '../../data/unifiedAcademyData';
import {
  CheckCircle2,
  Bookmark,
  ChevronRight,
  Terminal,
  Flame,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { getConceptIcon, getTopicIcon } from './academyIcons';
import { useApp } from '../../context/AppContext';
import type { AcademyConceptTab } from '../../context/AppContext';
export type { AcademyConceptTab } from '../../context/AppContext';

interface Props {
  concept: UniversalConcept;
  isCompleted: boolean;
  onToggleComplete: () => void;
  activeTab: AcademyConceptTab;
  onSelectTab: (tab: AcademyConceptTab) => void;
  onSelectConcept?: (conceptId: string, targetTab?: AcademyConceptTab) => void;
}

export const UniversalConceptHero: React.FC<Props> = ({
  concept,
  isCompleted,
  onToggleComplete,
  activeTab,
  onSelectTab,
  onSelectConcept,
}) => {
  const { setMode } = useApp();
  const topic = ACADEMY_18_TOPICS.find((t) => t.id === concept.topicId);
  const isCiCd = concept.topicId === 'topic-15';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        padding: '0 0 1rem 0',
      }}
    >
      {/* Breadcrumbs & Header Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Interactive Routed Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.8rem',
            color: '#64748b',
            flexWrap: 'wrap',
          }}
        >
          {/* Breadcrumb 1: Forge Suite Portal */}
          <button
            type="button"
            onClick={() => setMode('home')}
            title="Navigate to Forge Suite Homepage"
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0.2rem 0.4rem',
              borderRadius: '6px',
              color: '#94a3b8',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94a3b8';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <Flame size={13} color="#f05033" />
            <span>Forge Suite</span>
          </button>

          <ChevronRight size={12} color="#475569" />

          {/* Breadcrumb 2: Git Academy */}
          <button
            type="button"
            onClick={() => {
              setMode('learn');
              onSelectConcept?.('c-git-commit', 'Learn');
            }}
            title="Return to Git Academy"
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0.2rem 0.4rem',
              borderRadius: '6px',
              color: '#cbd5e1',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#38bdf8';
              e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#cbd5e1';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <GraduationCap size={13} color="#38bdf8" />
            <span>Git Academy</span>
          </button>

          <ChevronRight size={12} color="#475569" />

          {/* Breadcrumb 3: Topic Level */}
          <button
            type="button"
            onClick={() => {
              if (topic && topic.concepts.length > 0) {
                onSelectConcept?.(topic.concepts[0].id, 'Learn');
              }
            }}
            title={`Topic ${topic?.number}: ${topic?.title} (Click to open topic first concept)`}
            style={{
              background: isCiCd ? 'rgba(139, 92, 246, 0.12)' : 'transparent',
              border: isCiCd ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
              padding: '0.2rem 0.45rem',
              borderRadius: '6px',
              color: isCiCd ? '#e9d5ff' : '#cbd5e1',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = isCiCd ? '#f3e8ff' : '#38bdf8';
              e.currentTarget.style.background = isCiCd ? 'rgba(139, 92, 246, 0.22)' : 'rgba(56, 189, 248, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = isCiCd ? '#e9d5ff' : '#cbd5e1';
              e.currentTarget.style.background = isCiCd ? 'rgba(139, 92, 246, 0.12)' : 'transparent';
            }}
          >
            {getTopicIcon(topic?.iconName, 13, isCiCd ? '#a855f7' : '#94a3b8')}
            <span>{concept.topicTitle}</span>
          </button>

          <ChevronRight size={12} color="#475569" />

          {/* Breadcrumb 4: Current Concept Active Pill */}
          <button
            type="button"
            onClick={() => onSelectTab('Learn')}
            title={`Active Concept: ${concept.command} (Click to reset to Learn tab)`}
            style={{
              background: isCiCd ? 'rgba(139, 92, 246, 0.2)' : 'rgba(56, 189, 248, 0.12)',
              border: isCiCd ? '1px solid rgba(168, 85, 247, 0.45)' : '1px solid rgba(56, 189, 248, 0.3)',
              padding: '0.2rem 0.55rem',
              borderRadius: '6px',
              color: isCiCd ? '#ffffff' : '#38bdf8',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: isCiCd ? '0 0 8px rgba(139, 92, 246, 0.25)' : undefined,
              transition: 'all 0.15s ease',
            }}
          >
            {getConceptIcon(concept.id, concept.command, 13, isCiCd ? '#c084fc' : '#38bdf8')}
            <span style={{ fontFamily: 'ui-monospace, monospace' }}>{concept.command}</span>
          </button>
        </nav>

        {/* Action Buttons: Mark as Complete & Bookmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            onClick={onToggleComplete}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: isCompleted ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: isCompleted ? '1px solid #22c55e' : '1px solid rgba(255, 255, 255, 0.12)',
              color: isCompleted ? '#22c55e' : '#cbd5e1',
              padding: '0.45rem 0.95rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <CheckCircle2 size={15} />
            {isCompleted ? 'Completed' : 'Mark as Complete'}
          </button>

          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94a3b8',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="Bookmark this concept"
          >
            <Bookmark size={15} />
          </button>
        </div>
      </div>

      {/* Main Hero Card */}
      <div
        className="academy-hero-card"
        style={{
          background: isCiCd
            ? 'linear-gradient(135deg, rgba(30, 18, 56, 0.95) 0%, rgba(13, 17, 34, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(9, 14, 26, 0.9) 100%)',
          border: isCiCd
            ? '1px solid rgba(139, 92, 246, 0.45)'
            : '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem',
          flexWrap: 'wrap',
          boxShadow: isCiCd
            ? '0 8px 32px -8px rgba(139, 92, 246, 0.35)'
            : '0 8px 24px -8px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Hero Icon */}
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: isCiCd
                ? 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%)'
                : 'linear-gradient(135deg, #f05033 0%, #ea580c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: isCiCd
                ? '0 6px 20px rgba(139, 92, 246, 0.5)'
                : '0 6px 16px rgba(240, 80, 51, 0.35)',
              flexShrink: 0,
            }}
          >
            {getConceptIcon(concept.id, concept.command, 24)}
          </div>

          {/* Title, Subtitle, and Badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <h1
              style={{
                margin: 0,
                fontSize: '1.45rem',
                fontWeight: 900,
                color: '#f8fafc',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              }}
            >
              {concept.command}
            </h1>
            <div
              style={{
                fontSize: '0.86rem',
                color: isCiCd ? '#cbd5e1' : '#94a3b8',
                lineHeight: 1.35,
              }}
            >
              {concept.subtitle}
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.1rem', flexWrap: 'wrap' }}>
              {isCiCd && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.18rem 0.65rem',
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.35) 0%, rgba(99, 102, 241, 0.35) 100%)',
                    color: '#f3e8ff',
                    border: '1px solid rgba(168, 85, 247, 0.6)',
                    boxShadow: '0 0 10px rgba(139, 92, 246, 0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <span>⚡</span>
                  <span>CI/CD Pipeline Track</span>
                </span>
              )}

              {concept.badges.map((b, idx) => {
                const colorTheme =
                  idx === 0
                    ? { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e', border: 'rgba(34, 197, 94, 0.3)' }
                    : idx === 1
                    ? isCiCd
                      ? { bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.3)' }
                      : { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', border: 'rgba(56, 189, 248, 0.3)' }
                    : { bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.3)' };

                return (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.18rem 0.6rem',
                      borderRadius: '999px',
                      background: colorTheme.bg,
                      color: colorTheme.text,
                      border: `1px solid ${colorTheme.border}`,
                    }}
                  >
                    {b}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quote Bubble Box on the right */}
        {concept.quote && (
          <div
            className="academy-hero-quote"
            style={{
              background: isCiCd ? 'rgba(139, 92, 246, 0.08)' : 'rgba(56, 189, 248, 0.05)',
              border: isCiCd ? '1px solid rgba(139, 92, 246, 0.28)' : '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: '10px',
              padding: '0.65rem 0.95rem',
              maxWidth: '260px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.78rem',
              fontStyle: 'italic',
              color: isCiCd ? '#d8b4fe' : '#38bdf8',
              lineHeight: 1.35,
              flexShrink: 0,
            }}
          >
            "{concept.quote}"
          </div>
        )}
      </div>

      {/* 6 Sub-Tabs: Concept Overview | Variations & Scenarios | Interactive Sandbox | Visual Flow | Hands-on Challenge | Command Manual */}
      <div
        className="academy-subtabs-bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.2rem',
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: 'var(--bg-app)',
          paddingTop: '0.4rem',
        }}
      >
        {([
          { id: 'Learn', label: 'Concept Overview' },
          { id: 'Explore', label: 'Variations & Scenarios' },
          { id: 'Universe', label: 'All 71 Concepts' },
          { id: 'Sandbox', label: 'Interactive Sandbox' },
          { id: 'Visualize', label: 'Visual Flow' },
          { id: 'Practice', label: 'Hands-on Challenge' },
          { id: 'Reference', label: 'Command Manual' },
        ] as const).map(({ id: tab, label }) => {
          const isActive = activeTab === tab;
          const isSandbox = tab === 'Sandbox';
          const isUniverse = tab === 'Universe';
          const activeColor = isSandbox ? '#22c55e' : isUniverse ? '#f59e0b' : (isCiCd ? '#a855f7' : '#38bdf8');
          const inactiveColor = isSandbox ? '#86efac' : isUniverse ? '#f59e0b' : '#94a3b8';

          return (
            <button
              key={tab}
              onClick={() => onSelectTab(tab)}
              style={{
                background: isSandbox && !isActive ? 'rgba(34, 197, 94, 0.06)' : isUniverse && !isActive ? 'rgba(245, 158, 11, 0.08)' : 'none',
                border: isUniverse && !isActive ? '1px solid rgba(245, 158, 11, 0.25)' : 'none',
                color: isActive ? activeColor : inactiveColor,
                fontSize: '0.88rem',
                fontWeight: isActive ? 800 : 600,
                padding: '0.45rem 0.95rem',
                borderRadius: '6px',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                flexShrink: 0,
                transition: 'all 0.15s ease',
              }}
            >
              {isSandbox && <Terminal size={14} color={isActive ? '#22c55e' : '#86efac'} />}
              {isUniverse && <Sparkles size={14} color={isActive ? '#f59e0b' : '#f59e0b'} />}
              <span>{label}</span>
              {isUniverse && (
                <span
                  style={{
                    background: isActive ? '#f59e0b' : 'rgba(245, 158, 11, 0.2)',
                    color: isActive ? '#0f172a' : '#f59e0b',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '0.1rem 0.4rem',
                    borderRadius: '999px',
                    marginLeft: '0.15rem',
                  }}
                >
                  71
                </span>
              )}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: '15%',
                    right: '15%',
                    height: '2.5px',
                    background: activeColor,
                    borderRadius: '999px',
                    boxShadow: `0 0 10px ${activeColor}`,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
