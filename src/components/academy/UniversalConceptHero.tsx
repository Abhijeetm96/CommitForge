import React from 'react';
import { UniversalConcept, ACADEMY_18_TOPICS } from '../../data/unifiedAcademyData';
import {
  CheckCircle2,
  Bookmark,
  ChevronRight,
  Terminal,
} from 'lucide-react';
import { getConceptIcon, getTopicIcon } from './academyIcons';

export type AcademyConceptTab = 'Learn' | 'Explore' | 'Sandbox' | 'Visualize' | 'Practice' | 'Reference';

interface Props {
  concept: UniversalConcept;
  isCompleted: boolean;
  onToggleComplete: () => void;
  activeTab: AcademyConceptTab;
  onSelectTab: (tab: AcademyConceptTab) => void;
}

export const UniversalConceptHero: React.FC<Props> = ({
  concept,
  isCompleted,
  onToggleComplete,
  activeTab,
  onSelectTab,
}) => {
  const topic = ACADEMY_18_TOPICS.find((t) => t.id === concept.topicId);

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
        {/* Breadcrumb path */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '0.8rem',
            color: '#64748b',
          }}
        >
          <span>Git Academy</span>
          <ChevronRight size={13} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            {getTopicIcon(topic?.iconName, 13, '#94a3b8')}
            <span>{concept.topicTitle}</span>
          </span>
          <ChevronRight size={13} />
          <span style={{ color: '#cbd5e1', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            {getConceptIcon(concept.id, concept.command, 13, '#38bdf8')}
            <span>{concept.command}</span>
          </span>
        </div>

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
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(9, 14, 26, 0.9) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem',
          flexWrap: 'wrap',
          boxShadow: '0 8px 24px -8px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Hero Icon */}
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f05033 0%, #ea580c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 6px 16px rgba(240, 80, 51, 0.35)',
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
                color: '#94a3b8',
                lineHeight: 1.35,
              }}
            >
              {concept.subtitle}
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.1rem', flexWrap: 'wrap' }}>
              {concept.badges.map((b, idx) => {
                const colorTheme =
                  idx === 0
                    ? { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e', border: 'rgba(34, 197, 94, 0.3)' }
                    : idx === 1
                    ? { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', border: 'rgba(56, 189, 248, 0.3)' }
                    : { bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.3)' };

                return (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.55rem',
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
              background: 'rgba(56, 189, 248, 0.05)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: '10px',
              padding: '0.65rem 0.95rem',
              maxWidth: '260px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.78rem',
              fontStyle: 'italic',
              color: '#38bdf8',
              lineHeight: 1.35,
              flexShrink: 0,
            }}
          >
            "{concept.quote}"
          </div>
        )}
      </div>

      {/* 6 Sub-Tabs: Learn | Explore | Sandbox | Visualize | Practice | Reference (Sticky so navigation is never lost) */}
      <div
        className="academy-subtabs-bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '0.2rem',
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: '#070b14',
          paddingTop: '0.4rem',
        }}
      >
        {([
          { id: 'Learn', label: 'Learn' },
          { id: 'Explore', label: 'Variations & Scenarios' },
          { id: 'Sandbox', label: 'Sandbox' },
          { id: 'Visualize', label: 'Visualize' },
          { id: 'Practice', label: 'Practice' },
          { id: 'Reference', label: 'Reference' },
        ] as const).map(({ id: tab, label }) => {
          const isActive = activeTab === tab;
          const isSandbox = tab === 'Sandbox';
          return (
            <button
              key={tab}
              onClick={() => onSelectTab(tab)}
              style={{
                background: isSandbox && !isActive ? 'rgba(34, 197, 94, 0.06)' : 'none',
                border: 'none',
                color: isActive ? (isSandbox ? '#22c55e' : '#38bdf8') : isSandbox ? '#86efac' : '#94a3b8',
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
              <span>{label}</span>
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: '15%',
                    right: '15%',
                    height: '2.5px',
                    background: isSandbox ? '#22c55e' : '#38bdf8',
                    borderRadius: '999px',
                    boxShadow: isSandbox ? '0 0 10px #22c55e' : '0 0 10px #38bdf8',
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
