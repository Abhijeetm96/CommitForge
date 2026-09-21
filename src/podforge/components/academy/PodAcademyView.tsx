import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KUBE_CHAPTERS } from '../../data/topics';
import { getConceptIcon, getChapterIcon } from './podIcons';
import { PodConceptOverviewTab } from './PodConceptOverviewTab';
import { PodYamlSpecTab } from './PodYamlSpecTab';
import { PodPracticeTab } from './PodPracticeTab';
import { PodVisualizerTab } from './PodVisualizerTab';
import { PodPitfallsTab } from './PodPitfallsTab';
import { PodQuizTab } from './PodQuizTab';
import {
  Layers,
  BookOpen,
  Activity,
  Code2,
  FileCode,
  CheckCircle2,
  Play,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lightbulb,
  ChevronRight,
  Boxes,
  Flame,
  AlertTriangle,
  Award,
} from 'lucide-react';

import { ViewMode } from '../../../context/AppContext';

type AcademyTab = 'learn' | 'spec' | 'practice' | 'visualize' | 'pitfalls' | 'quiz';

interface PodAcademyViewProps {
  onSwitchToSuite?: (mode: ViewMode) => void;
}

export const PodAcademyView: React.FC<PodAcademyViewProps> = ({ onSwitchToSuite }) => {
  const { activeConcept, setActiveConceptId, completedConcepts, markConceptComplete, executeCommand } = useApp();
  const [activeTab, setActiveTab] = useState<AcademyTab>('learn');
  const [practiceInput, setPracticeInput] = useState('');
  const [practiceSuccess, setPracticeSuccess] = useState(false);

  const currentChapter = KUBE_CHAPTERS.find((ch) => ch.concepts.some((c) => c.id === activeConcept.id));

  // Flatten all concepts for linear previous / next navigation
  const allConcepts = KUBE_CHAPTERS.flatMap((ch) => ch.concepts);
  const currentIndex = allConcepts.findIndex((c) => c.id === activeConcept.id);
  const prevConcept = currentIndex > 0 ? allConcepts[currentIndex - 1] : null;
  const nextConcept = currentIndex < allConcepts.length - 1 ? allConcepts[currentIndex + 1] : null;

  const isCompleted = completedConcepts.includes(activeConcept.id);

  const handleRunPractice = () => {
    const trimmed = practiceInput.trim();
    if (!trimmed) return;
    executeCommand(trimmed);

    if (trimmed === activeConcept.practiceChallenge.goalCommand) {
      setPracticeSuccess(true);
      markConceptComplete(activeConcept.id);
    }
  };

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
      {/* COLUMN 1: LEFT SIDEBAR (Curriculum Navigator) */}
      <aside
        style={{
          width: '280px',
          minWidth: '280px',
          maxWidth: '280px',
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Sidebar Header */}
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Layers size={16} color="var(--k8s-blue)" />
            <span>Kubernetes Curriculum</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {KUBE_CHAPTERS.length} Chapters • {allConcepts.length} Core Concepts
          </div>
        </div>

        {/* Chapters & Concepts List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.65rem 0.5rem' }}>
          {KUBE_CHAPTERS.map((ch) => {
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
                          setPracticeSuccess(false);
                          setPracticeInput('');
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
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                              {c.badge}
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
          })}
        </div>

        {/* Progress Footer */}
        <div style={{ padding: '0.85rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '0.35rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Mastery Progress</span>
            <span style={{ fontWeight: 800, color: 'var(--k8s-cyan)' }}>
              {Math.round((completedConcepts.length / allConcepts.length) * 100)}%
            </span>
          </div>
          <div style={{ height: '5px', background: 'var(--border-color)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: `${(completedConcepts.length / allConcepts.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #326ce5 0%, #10b981 100%)' }} />
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
                setActiveConceptId('c-pod-intro');
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
                { id: 'spec' as AcademyTab, label: 'Declarative YAML', icon: FileCode },
                { id: 'practice' as AcademyTab, label: 'Terminal Sandbox', icon: Code2 },
                { id: 'visualize' as AcademyTab, label: 'Live Visualizer', icon: Activity },
                { id: 'pitfalls' as AcademyTab, label: 'Pitfalls & SRE', icon: AlertTriangle },
                { id: 'quiz' as AcademyTab, label: 'Scenario Quiz', icon: Award },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
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
          {activeTab === 'learn' && (
            <PodConceptOverviewTab concept={activeConcept} />
          )}

          {/* TAB 2: DECLARATIVE YAML & SYNTAX */}
          {activeTab === 'spec' && (
            <PodYamlSpecTab concept={activeConcept} />
          )}

          {/* TAB 3: HANDS-ON PRACTICE SANDBOX */}
          {activeTab === 'practice' && (
            <PodPracticeTab concept={activeConcept} />
          )}

          {/* TAB 4: LIVE CLUSTER VISUALIZER */}
          {activeTab === 'visualize' && (
            <PodVisualizerTab concept={activeConcept} />
          )}

          {/* TAB 5: PITFALLS & SRE RECOVERY */}
          {activeTab === 'pitfalls' && (
            <PodPitfallsTab concept={activeConcept} />
          )}

          {/* TAB 6: SCENARIO KNOWLEDGE CHECK QUIZ */}
          {activeTab === 'quiz' && (
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
