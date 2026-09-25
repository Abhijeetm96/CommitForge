import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { KUBE_CHAPTERS } from '../../data/topics';
import { getConceptIcon, getChapterIcon } from './podIcons';
import { PodConceptOverviewTab } from './PodConceptOverviewTab';
import { PodYamlSpecTab } from './PodYamlSpecTab';
import { PodPracticeTab } from './PodPracticeTab';
import { PodVisualizerTab } from './PodVisualizerTab';
import { PodPitfallsTab } from './PodPitfallsTab';
import { PodQuizTab } from './PodQuizTab';
import { KubeFlowDiagram } from '../diagrams/KubeFlowDiagram';
import {
  Layers,
  BookOpen,
  Activity,
  Code2,
  FileCode,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Boxes,
  Flame,
  AlertTriangle,
  Award,
  Search,
  Filter,
  X,
  Workflow,
} from 'lucide-react';

import { ViewMode } from '../../../context/AppContext';
import { conceptRequiresVisualizer } from '../../data/topics/visualizerScope';

type AcademyTab = 'learn' | 'diagram' | 'spec' | 'practice' | 'visualize' | 'pitfalls' | 'quiz';
type DifficultyTier = 'All' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

interface PodAcademyViewProps {
  onSwitchToSuite?: (mode: ViewMode) => void;
}

export const PodAcademyView: React.FC<PodAcademyViewProps> = ({ onSwitchToSuite }) => {
  const { activeConcept, setActiveConceptId, completedConcepts, markConceptComplete } = useApp();
  const [activeTab, setActiveTab] = useState<AcademyTab>('learn');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyTier>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentChapter = KUBE_CHAPTERS.find((ch) => ch.concepts.some((c) => c.id === activeConcept.id));

  // Determine if this concept requires/supports an interactive visualizer or simulator
  const hasVisualizer = useMemo(() => conceptRequiresVisualizer(activeConcept), [activeConcept]);

  // Derived effective tab - fallback to learn if current concept has no visualizer
  const currentTab = activeTab === 'visualize' && !hasVisualizer ? 'learn' : activeTab;

  // Flatten all concepts for linear previous / next navigation
  const allConcepts = useMemo(() => KUBE_CHAPTERS.flatMap((ch) => ch.concepts), []);
  const currentIndex = allConcepts.findIndex((c) => c.id === activeConcept.id);
  const prevConcept = currentIndex > 0 ? allConcepts[currentIndex - 1] : null;
  const nextConcept = currentIndex < allConcepts.length - 1 ? allConcepts[currentIndex + 1] : null;

  const isCompleted = completedConcepts.includes(activeConcept.id);

  // Filtered chapters & concepts based on tier + search query
  const filteredChapters = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return KUBE_CHAPTERS.map((ch) => {
      const matchingConcepts = ch.concepts.filter((c) => {
        const matchesDiff = difficultyFilter === 'All' || c.difficulty === difficultyFilter;
        const matchesQuery =
          !q ||
          c.title.toLowerCase().includes(q) ||
          c.number.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.commandPill.toLowerCase().includes(q) ||
          (c.dockerBridge?.dockerEquivalent.toLowerCase().includes(q) ?? false) ||
          (c.subtopics?.some((s) => s.toLowerCase().includes(q)) ?? false);

        return matchesDiff && matchesQuery;
      });

      return {
        ...ch,
        concepts: matchingConcepts,
      };
    }).filter((ch) => ch.concepts.length > 0);
  }, [difficultyFilter, searchQuery]);

  const totalMatchingConcepts = useMemo(
    () => filteredChapters.reduce((acc, ch) => acc + ch.concepts.length, 0),
    [filteredChapters]
  );

  const beginnerTotal = useMemo(() => allConcepts.filter((c) => c.difficulty === 'Beginner').length, [allConcepts]);
  const beginnerDone = useMemo(
    () => allConcepts.filter((c) => c.difficulty === 'Beginner' && completedConcepts.includes(c.id)).length,
    [allConcepts, completedConcepts]
  );



  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        background: 'var(--bg-app)',
        color: 'var(--text-primary)',
        overflow: 'hidden',
      }}
    >
      {/* COLUMN 1: LEFT SIDEBAR (Curriculum Navigator with Filters & Search) */}
      <aside
        style={{
          width: '300px',
          minWidth: '300px',
          maxWidth: '300px',
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Sidebar Header */}
        <div style={{ padding: '0.85rem 1rem 0.65rem 1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Layers size={16} color="var(--k8s-blue)" />
              <span>Kubernetes Curriculum</span>
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--k8s-cyan)', background: 'rgba(56, 189, 248, 0.12)', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>
              {totalMatchingConcepts}/{allConcepts.length}
            </span>
          </div>

          {/* Quick Search Input */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={13} color="#94a3b8" style={{ position: 'absolute', left: '0.6rem', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search concepts, docker, rbac..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '0.35rem 1.8rem 0.35rem 1.9rem',
                color: '#fff',
                fontSize: '0.74rem',
                outline: 'none',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '0.45rem', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.1rem' }}
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Difficulty Tier Tabs */}
          <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto', paddingBottom: '0.1rem' }}>
            {(['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'] as DifficultyTier[]).map((tier) => {
              const isSelected = difficultyFilter === tier;
              return (
                <button
                  key={tier}
                  onClick={() => setDifficultyFilter(tier)}
                  style={{
                    background: isSelected ? 'var(--k8s-blue)' : 'rgba(255, 255, 255, 0.04)',
                    border: isSelected ? '1px solid #38bdf8' : '1px solid transparent',
                    color: isSelected ? '#fff' : 'var(--text-muted)',
                    borderRadius: '5px',
                    padding: '0.2rem 0.45rem',
                    fontSize: '0.68rem',
                    fontWeight: isSelected ? 800 : 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tier}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chapters & Concepts List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.65rem 0.5rem' }}>
          {filteredChapters.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.65rem', alignItems: 'center' }}>
              <Filter size={24} color="#64748b" />
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>
                No concepts match the current filter.
              </div>
              <button
                onClick={() => {
                  setDifficultyFilter('All');
                  setSearchQuery('');
                }}
                style={{
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#38bdf8',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredChapters.map((ch) => {
              const ChapterIcon = getChapterIcon(ch.number);
              return (
                <div key={ch.id} style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.68rem', fontWeight: 800, color: 'var(--k8s-cyan)', textTransform: 'uppercase', padding: '0.25rem 0.6rem', letterSpacing: '0.04em' }}>
                    <ChapterIcon size={14} color="var(--k8s-cyan)" />
                    <span>{ch.title}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.2rem' }}>
                    {ch.concepts.map((c) => {
                      const isActive = c.id === activeConcept.id;
                      const isDone = completedConcepts.includes(c.id);
                      const ConceptIcon = getConceptIcon(c.id);

                      return (
                        <div
                          key={c.id}
                          onClick={() => {
                            setActiveConceptId(c.id);
                          }}
                          style={{
                            padding: '0.5rem 0.65rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            background: isActive ? 'rgba(50, 108, 229, 0.18)' : 'transparent',
                            borderLeft: isActive ? '3px solid var(--k8s-blue)' : '3px solid transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.55rem',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', minWidth: 0, flex: 1 }}>
                            <div
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '6px',
                                background: isActive ? 'rgba(56, 189, 248, 0.2)' : 'rgba(148, 163, 184, 0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                color: isActive ? 'var(--k8s-cyan)' : 'var(--text-muted)',
                              }}
                            >
                              <ConceptIcon size={13} />
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ fontSize: '0.78rem', fontWeight: isActive ? 800 : 600, color: isActive ? '#fff' : 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {c.number} {c.title}
                              </div>
                              <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <span>{c.difficulty}</span>
                                <span>•</span>
                                <span>{c.badge}</span>
                              </div>
                            </div>
                          </div>

                          {isDone && <CheckCircle2 size={14} color="#10b981" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Progress Footer */}
        <div style={{ padding: '0.85rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Mastery Journey</span>
            <span style={{ fontWeight: 800, color: 'var(--k8s-cyan)' }}>
              {Math.round((completedConcepts.length / allConcepts.length) * 100)}% ({completedConcepts.length}/{allConcepts.length})
            </span>
          </div>
          <div style={{ height: '5px', background: 'var(--border-color)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: `${(completedConcepts.length / allConcepts.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #326ce5 0%, #10b981 100%)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            <span>Beginner: {beginnerDone}/{beginnerTotal}</span>
            <span>All 4 Tracks Active</span>
          </div>
        </div>
      </aside>

      {/* COLUMN 2: CENTER PANEL (Learning & Practice Experience) */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Scrollable Center Body */}
        <div
          style={{
            flex: '1 1 0%',
            overflowY: 'auto',
            padding: '1.25rem 2rem 5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            boxSizing: 'border-box',
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
              onClick={() => onSwitchToSuite?.('home')}
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

            {/* Breadcrumb 2: PodForge Academy */}
            <button
              type="button"
              onClick={() => {
                setActiveConceptId('c-k8s-overview');
                setActiveTab('learn');
              }}
              title="Return to PodForge Academy"
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
              <Boxes size={13} color="#38bdf8" />
              <span>PodForge Academy</span>
            </button>

            <ChevronRight size={12} color="#475569" />

            {/* Breadcrumb 3: Chapter */}
            {currentChapter && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (currentChapter.concepts[0]) {
                      setActiveConceptId(currentChapter.concepts[0].id);
                      setActiveTab('learn');
                    }
                  }}
                  title={`Jump to ${currentChapter.title}`}
                  style={{
                    background: 'transparent',
                    border: '1px solid transparent',
                    padding: '0.2rem 0.45rem',
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
                  {React.createElement(getChapterIcon(currentChapter.number), { size: 13, color: '#38bdf8' })}
                  <span>{currentChapter.title}</span>
                </button>

                <ChevronRight size={12} color="#475569" />
              </>
            )}

            {/* Breadcrumb 4: Current Concept Active Pill */}
            <button
              type="button"
              onClick={() => setActiveTab('learn')}
              title={`Active Concept: ${activeConcept.number} ${activeConcept.title} (Click to reset to Concept Overview)`}
              style={{
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                padding: '0.2rem 0.55rem',
                borderRadius: '6px',
                color: '#38bdf8',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: '0 0 8px rgba(56, 189, 248, 0.2)',
                transition: 'all 0.15s ease',
              }}
            >
              {React.createElement(getConceptIcon(activeConcept.id), { size: 13, color: '#38bdf8' })}
              <span>{activeConcept.number} {activeConcept.title}</span>
            </button>
          </nav>

          {/* Concept Hero Header */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--k8s-blue)', background: 'rgba(50, 108, 229, 0.15)', border: '1px solid rgba(50, 108, 229, 0.3)', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                  {activeConcept.badge}
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                  {activeConcept.difficulty}
                </span>
              </div>

              <button
                onClick={() => markConceptComplete(activeConcept.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: isCompleted ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface)',
                  border: isCompleted ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '0.4rem 0.85rem',
                  color: isCompleted ? '#10b981' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                }}
              >
                <CheckCircle2 size={14} color={isCompleted ? '#10b981' : 'var(--text-muted)'} />
                <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
              </button>
            </div>

            {/* Concept Hero with Relevant Thematic Icon */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.15rem' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(50, 108, 229, 0.25) 0%, rgba(56, 189, 248, 0.15) 100%)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38bdf8',
                  boxShadow: '0 6px 22px rgba(50, 108, 229, 0.25)',
                  flexShrink: 0,
                }}
              >
                {React.createElement(getConceptIcon(activeConcept.id), { size: 28 })}
              </div>

              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
                  {activeConcept.number} {activeConcept.title}
                </h1>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0.4rem 0 0 0', lineHeight: 1.55 }}>
                  {activeConcept.description}
                </p>
              </div>
            </div>

            {/* Target Commands Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)' }}>Target CLI:</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--k8s-cyan)', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
                $ {activeConcept.commandPill}
              </span>
            </div>

            {/* Docker & Container Foundation Bridge (Chapters 1 & 2) */}
            {(currentChapter?.number === 1 || currentChapter?.number === 2) && (
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(50, 108, 229, 0.08) 100%)',
                  border: '1px solid rgba(14, 165, 233, 0.3)',
                  borderRadius: '10px',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.65rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', background: 'rgba(14, 165, 233, 0.2)', padding: '0.15rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                    Docker &rarr; K8s Bridge
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                    In Docker, you run standalone containers via <code style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>docker run</code>. In Kubernetes, containers are wrapped inside <strong>Pods</strong> alongside a Pause container for clustered networking and storage volumes.
                  </span>
                </div>

                {onSwitchToSuite && (
                  <button
                    onClick={() => onSwitchToSuite('dockforge')}
                    style={{
                      background: 'rgba(14, 165, 233, 0.15)',
                      border: '1px solid rgba(14, 165, 233, 0.35)',
                      color: '#38bdf8',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      padding: '0.3rem 0.75rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>DockForge Docker Academy</span>
                    <ChevronRight size={12} />
                  </button>
                )}
              </div>
            )}

            {/* Sub-Tabs Navigation */}
            <div style={{ display: 'flex', gap: '0.4rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', flexWrap: 'wrap' }}>
              {[
                { id: 'learn' as AcademyTab, label: 'Concept Overview', icon: BookOpen },
                { id: 'diagram' as AcademyTab, label: 'Block & Flow Diagram', icon: Workflow },
                { id: 'spec' as AcademyTab, label: 'Declarative YAML', icon: FileCode },
                { id: 'practice' as AcademyTab, label: 'Terminal Sandbox', icon: Code2 },
                ...(hasVisualizer
                  ? [{ id: 'visualize' as AcademyTab, label: 'Live Visualizer', icon: Activity }]
                  : []),
                { id: 'pitfalls' as AcademyTab, label: 'Pitfalls & SRE', icon: AlertTriangle },
                { id: 'quiz' as AcademyTab, label: 'Scenario Quiz', icon: Award },
              ].map((tab) => {
                const isActive = currentTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: isActive ? 800 : 600,
                      color: isActive ? 'var(--k8s-cyan)' : 'var(--text-secondary)',
                      background: isActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                      border: isActive ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 1: LEARN (CONCEPT OVERVIEW) */}
          {currentTab === 'learn' && (
            <PodConceptOverviewTab concept={activeConcept} />
          )}

          {/* TAB: FLOW & BLOCK DIAGRAM */}
          {currentTab === 'diagram' && (
            <div style={{ padding: '0.25rem 0' }}>
              <KubeFlowDiagram concept={activeConcept} />
            </div>
          )}

          {/* TAB 2: DECLARATIVE YAML & SYNTAX */}
          {currentTab === 'spec' && (
            <PodYamlSpecTab concept={activeConcept} />
          )}

          {/* TAB 3: HANDS-ON PRACTICE SANDBOX */}
          {currentTab === 'practice' && (
            <PodPracticeTab concept={activeConcept} />
          )}

          {/* TAB 4: LIVE CLUSTER VISUALIZER */}
          {currentTab === 'visualize' && (
            <PodVisualizerTab concept={activeConcept} />
          )}

          {/* TAB 5: PITFALLS & SRE RECOVERY */}
          {currentTab === 'pitfalls' && (
            <PodPitfallsTab concept={activeConcept} />
          )}

          {/* TAB 6: SCENARIO KNOWLEDGE CHECK QUIZ */}
          {currentTab === 'quiz' && (
            <PodQuizTab concept={activeConcept} />
          )}
        </div>

        {/* Pinned Bottom Bar */}
        <div
          style={{
            height: '52px',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 5rem 0 1.5rem',
            boxSizing: 'border-box',
          }}
        >
          <button
            disabled={!prevConcept}
            onClick={() => prevConcept && setActiveConceptId(prevConcept.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'transparent',
              border: 'none',
              color: prevConcept ? 'var(--text-primary)' : 'var(--text-muted)',
              cursor: prevConcept ? 'pointer' : 'not-allowed',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={15} /> Previous Concept
          </button>

          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {activeConcept.number} • {activeConcept.title}
          </span>

          <button
            disabled={!nextConcept}
            onClick={() => nextConcept && setActiveConceptId(nextConcept.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'transparent',
              border: 'none',
              color: nextConcept ? 'var(--text-primary)' : 'var(--text-muted)',
              cursor: nextConcept ? 'pointer' : 'not-allowed',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            Next Concept <ArrowRight size={15} />
          </button>
        </div>
      </main>
    </div>
  );
};
