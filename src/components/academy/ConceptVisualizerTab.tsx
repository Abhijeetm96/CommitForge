import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  UniversalConcept,
  ACADEMY_18_TOPICS,
  ALL_ACADEMY_CONCEPTS,
  getUniversalConcept,
} from '../../data/unifiedAcademyData';
import { AcademyConceptTab } from './UniversalConceptHero';
import { ThreeAreaVisualizer } from '../visualizer/ThreeAreaVisualizer';
import { GitGraph } from '../visualizer/GitGraph';
import { useApp } from '../../context/AppContext';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Layers,
  FolderOpen,
  Archive,
  FileCode,
  ArrowRight,
  CheckCircle2,
  Info,
  Search,
  Terminal,
  Compass,
  ChevronRight,
  Zap,
  Database,
  BookOpen,
  FastForward,
} from 'lucide-react';

interface Props {
  concept: UniversalConcept;
  onSelectConcept?: (conceptId: string, targetTab?: AcademyConceptTab) => void;
}

type VisualizerViewMode = 'simulation' | 'liveRepo' | 'internals';
type TopicFilterKey =
  | 'all'
  | 'basics'
  | 'branching'
  | 'github'
  | 'merges'
  | 'teams'
  | 'intermediate'
  | 'advanced';

export const ConceptVisualizerTab: React.FC<Props> = ({
  concept: initialConcept,
  onSelectConcept,
}) => {
  const { repo, executeCommand } = useApp();

  // Active visualized concept (can be switched locally or passed upward)
  const [selectedConceptId, setSelectedConceptId] = useState<string>(initialConcept.id);

  // Sync if prop changes
  useEffect(() => {
    setSelectedConceptId(initialConcept.id);
  }, [initialConcept.id]);

  const activeConcept: UniversalConcept = useMemo(() => {
    return ALL_ACADEMY_CONCEPTS[selectedConceptId] || getUniversalConcept(selectedConceptId) || initialConcept;
  }, [selectedConceptId, initialConcept]);

  // View mode within Visualizer: 3-Stage Simulation vs Live Repo vs Internals
  const [viewMode, setViewMode] = useState<VisualizerViewMode>('simulation');

  // Step state for simulation: 'before' | 'running' | 'after'
  const [simulationStep, setSimulationStep] = useState<'before' | 'running' | 'after'>('before');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x or 2x
  const [seedSuccessMsg, setSeedSuccessMsg] = useState<string | null>(null);

  // Concept switcher drawer state
  const [conceptBrowserMode, setConceptBrowserMode] = useState<'current' | 'all'>('current');
  const [topicFilter, setTopicFilter] = useState<TopicFilterKey>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Auto-play timer ref
  const timerRef = useRef<any>(null);

  // Flattened list of all 71 concepts across all 18 topics
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

  // Filtered concepts for the visual browser
  const filteredConcepts = useMemo(() => {
    let list = allConceptsList;

    if (topicFilter !== 'all') {
      if (topicFilter === 'basics') {
        list = list.filter((c) => c.topicNumber === 1 || c.topicNumber === 2);
      } else if (topicFilter === 'branching') {
        list = list.filter((c) => c.topicNumber === 3 || c.topicNumber === 4);
      } else if (topicFilter === 'github') {
        list = list.filter((c) => c.topicNumber === 5 || c.topicNumber === 6);
      } else if (topicFilter === 'merges') {
        list = list.filter((c) => c.topicNumber === 7 || c.topicNumber === 8);
      } else if (topicFilter === 'teams') {
        list = list.filter((c) => c.topicNumber === 9 || c.topicNumber === 10);
      } else if (topicFilter === 'intermediate') {
        list = list.filter((c) => c.topicNumber === 11 || c.topicNumber === 12);
      } else if (topicFilter === 'advanced') {
        list = list.filter((c) => c.topicNumber >= 13);
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.command.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.subtitle.toLowerCase().includes(q) ||
          c.topicTitle.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allConceptsList, topicFilter, searchQuery]);

  // Simulation auto-play loop
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const stepInterval = playbackSpeed === 1 ? 2400 : 1200;

    timerRef.current = setInterval(() => {
      setSimulationStep((prev) => {
        if (prev === 'before') return 'running';
        if (prev === 'running') return 'after';
        // After reaching after, stop playing
        setIsPlaying(false);
        return 'after';
      });
    }, stepInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  const handleStartPlay = () => {
    if (simulationStep === 'after') {
      setSimulationStep('before');
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleResetSimulation = () => {
    setIsPlaying(false);
    setSimulationStep('before');
  };

  const handleStepNext = () => {
    setIsPlaying(false);
    if (simulationStep === 'before') setSimulationStep('running');
    else if (simulationStep === 'running') setSimulationStep('after');
  };

  const handleStepPrev = () => {
    setIsPlaying(false);
    if (simulationStep === 'after') setSimulationStep('running');
    else if (simulationStep === 'running') setSimulationStep('before');
  };

  const handleSelectTargetConcept = (conceptId: string) => {
    setSelectedConceptId(conceptId);
    setSimulationStep('before');
    setIsPlaying(false);
    setConceptBrowserMode('current');
    if (onSelectConcept) {
      onSelectConcept(conceptId, 'Visualize');
    }
  };

  const handleSeedLiveRepo = () => {
    const seedCommands = activeConcept.sandbox?.initialCommands || [];
    seedCommands.forEach((cmd) => {
      executeCommand(cmd);
    });
    setSeedSuccessMsg(`Successfully loaded preset state for ${activeConcept.command}!`);
    setTimeout(() => setSeedSuccessMsg(null), 3000);
  };

  const stage = activeConcept.actionStage[simulationStep];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      {/* Top Banner & Context Switcher */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(7, 11, 22, 0.98) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '16px',
          padding: '1.15rem 1.35rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(37, 99, 235, 0.3) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
              }}
            >
              <Layers size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#38bdf8',
                    background: 'rgba(56, 189, 248, 0.12)',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                  }}
                >
                  Topic {activeConcept.topicNumber}: {activeConcept.topicTitle}
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#94a3b8',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '6px',
                  }}
                >
                  {activeConcept.difficulty}
                </span>
              </div>
              <h2
                style={{
                  margin: '0.35rem 0 0.15rem 0',
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                }}
              >
                <span>{activeConcept.title}</span>
                <span
                  style={{
                    fontFamily: 'ui-monospace, monospace',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: '#f59e0b',
                    background: 'rgba(245, 158, 11, 0.12)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                  }}
                >
                  $ {activeConcept.command}
                </span>
              </h2>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                {activeConcept.subtitle}
              </div>
            </div>
          </div>

          {/* Mode Switcher: Current Concept vs Browse All Topics */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'flex',
                background: 'rgba(15, 23, 42, 0.8)',
                padding: '0.25rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <button
                onClick={() => setConceptBrowserMode('current')}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: conceptBrowserMode === 'current' ? '#38bdf8' : 'transparent',
                  color: conceptBrowserMode === 'current' ? '#070b14' : '#94a3b8',
                  transition: 'all 0.15s ease',
                }}
              >
                Visual Simulation
              </button>
              <button
                onClick={() => setConceptBrowserMode('all')}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: conceptBrowserMode === 'all' ? '#38bdf8' : 'transparent',
                  color: conceptBrowserMode === 'all' ? '#070b14' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <Compass size={14} />
                <span>Browse All 18 Topics ({allConceptsList.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* View Mode Tabs: State Flow vs Live Repo vs Git Internals */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '0.75rem',
            flexWrap: 'wrap',
            gap: '0.65rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setViewMode('simulation')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: viewMode === 'simulation' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                background: viewMode === 'simulation' ? 'rgba(56, 189, 248, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                color: viewMode === 'simulation' ? '#38bdf8' : '#cbd5e1',
                transition: 'all 0.15s ease',
              }}
            >
              <Zap size={14} />
              <span>3-Stage State Flow Simulation</span>
            </button>

            <button
              onClick={() => setViewMode('liveRepo')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: viewMode === 'liveRepo' ? '1px solid #22c55e' : '1px solid rgba(255, 255, 255, 0.08)',
                background: viewMode === 'liveRepo' ? 'rgba(34, 197, 94, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                color: viewMode === 'liveRepo' ? '#22c55e' : '#cbd5e1',
                transition: 'all 0.15s ease',
              }}
            >
              <Layers size={14} />
              <span>Live Active Repository & DAG</span>
            </button>

            <button
              onClick={() => setViewMode('internals')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: viewMode === 'internals' ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.08)',
                background: viewMode === 'internals' ? 'rgba(192, 132, 252, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                color: viewMode === 'internals' ? '#c084fc' : '#cbd5e1',
                transition: 'all 0.15s ease',
              }}
            >
              <Database size={14} />
              <span>Git Internal Architecture</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleSeedLiveRepo}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#f59e0b',
                padding: '0.35rem 0.75rem',
                borderRadius: '7px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Seed this concept's working files into the live visualizer"
            >
              <Sparkles size={13} />
              <span>Seed Concept State</span>
            </button>

            {onSelectConcept && (
              <button
                onClick={() => onSelectConcept(activeConcept.id, 'Sandbox')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: 'rgba(34, 197, 94, 0.12)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  color: '#22c55e',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '7px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Terminal size={13} />
                <span>Open in Sandbox</span>
                <ChevronRight size={13} />
              </button>
            )}
          </div>
        </div>

        {seedSuccessMsg && (
          <div
            style={{
              fontSize: '0.78rem',
              color: '#22c55e',
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <CheckCircle2 size={15} />
            <span>{seedSuccessMsg} Switch to "Live Active Repository" view to inspect!</span>
          </div>
        )}
      </div>

      {/* ================================================================ */}
      {/* MODE A: BROWSE ALL 18 TOPICS VISUALIZATION BROWSER               */}
      {/* ================================================================ */}
      {conceptBrowserMode === 'all' && (
        <div
          style={{
            background: '#090e1a',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={18} color="#38bdf8" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                All Topics Visualization Gallery (71 Concepts)
              </h3>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Select any concept to launch its 3-stage animated transition and DAG
            </div>
          </div>

          {/* Search bar & Category filters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '0.45rem 0.85rem',
              }}
            >
              <Search size={15} color="#38bdf8" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any command or concept to visualize (e.g. rebase, merge, stash, worktree, cherry-pick)..."
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#f8fafc',
                  fontSize: '0.82rem',
                  flex: 1,
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                  }}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Topic Filter Chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
              {[
                { id: 'all', label: 'All Topics (71)' },
                { id: 'basics', label: 'Basics & Staging (T1-T2)' },
                { id: 'branching', label: 'Branching & Remote (T3-T4)' },
                { id: 'github', label: 'GitHub & Workflows (T5-T6)' },
                { id: 'merges', label: 'Merges & Conflicts (T7-T8)' },
                { id: 'teams', label: 'Teams & Projects (T9-T10)' },
                { id: 'intermediate', label: 'Rebase, Stash, Tags (T11-T12)' },
                { id: 'advanced', label: 'Hooks, Worktrees, Bisect (T13-T18)' },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setTopicFilter(chip.id as TopicFilterKey)}
                  style={{
                    padding: '0.3rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    border: topicFilter === chip.id ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: topicFilter === chip.id ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    color: topicFilter === chip.id ? '#38bdf8' : '#94a3b8',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Concept Visualization Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '0.75rem',
              maxHeight: '480px',
              overflowY: 'auto',
              paddingRight: '0.35rem',
            }}
          >
            {filteredConcepts.map((item) => {
              const isCurrent = item.id === activeConcept.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectTargetConcept(item.id)}
                  style={{
                    background: isCurrent ? 'rgba(56, 189, 248, 0.08)' : 'rgba(15, 23, 42, 0.65)',
                    border: isCurrent ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.07)',
                    borderRadius: '10px',
                    padding: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: '#94a3b8',
                        background: 'rgba(255, 255, 255, 0.04)',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                      }}
                    >
                      T{item.topicNumber}
                    </span>
                    <span
                      style={{
                        fontFamily: 'ui-monospace, monospace',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: isCurrent ? '#38bdf8' : '#e2e8f0',
                        background: 'rgba(0, 0, 0, 0.3)',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      {item.command}
                    </span>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#f8fafc' }}>
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontSize: '0.74rem',
                        color: '#94a3b8',
                        lineHeight: 1.35,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {item.subtitle}
                    </div>
                  </div>

                  {/* Action Stage Snapshot Badge */}
                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: '0.45rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.68rem', color: '#64748b' }}>
                      <span style={{ color: '#38bdf8' }}>Before</span>
                      <span>→</span>
                      <span style={{ color: '#f59e0b' }}>Run</span>
                      <span>→</span>
                      <span style={{ color: '#22c55e' }}>After</span>
                    </div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#38bdf8',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                      }}
                    >
                      <span>Visualize</span>
                      <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODE B: 3-STAGE STATE FLOW SIMULATION                            */}
      {/* ================================================================ */}
      {viewMode === 'simulation' && (
        <div
          style={{
            background: '#090e1a',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Simulation Player Header & Controls */}
          <div
            style={{
              padding: '0.85rem 1.25rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            {/* Step Selection Toggles */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setSimulationStep('before');
                }}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: simulationStep === 'before' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: simulationStep === 'before' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                  color: simulationStep === 'before' ? '#38bdf8' : '#94a3b8',
                  transition: 'all 0.15s ease',
                }}
              >
                1. {activeConcept.actionStage.before.label}
              </button>
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setSimulationStep('running');
                }}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: simulationStep === 'running' ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: simulationStep === 'running' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                  color: simulationStep === 'running' ? '#f59e0b' : '#94a3b8',
                  transition: 'all 0.15s ease',
                }}
              >
                2. {activeConcept.actionStage.running.label}
              </button>
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setSimulationStep('after');
                }}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: simulationStep === 'after' ? '1px solid #22c55e' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: simulationStep === 'after' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                  color: simulationStep === 'after' ? '#22c55e' : '#94a3b8',
                  transition: 'all 0.15s ease',
                }}
              >
                3. {activeConcept.actionStage.after.label}
              </button>
            </div>

            {/* Playback Control Bar (Play / Pause / Prev / Next / Reset / Speed) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                onClick={handleStepPrev}
                disabled={simulationStep === 'before'}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: simulationStep === 'before' ? '#475569' : '#e2e8f0',
                  padding: '0.35rem 0.55rem',
                  borderRadius: '6px',
                  cursor: simulationStep === 'before' ? 'not-allowed' : 'pointer',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Step backward"
              >
                ◀ Step
              </button>

              {isPlaying ? (
                <button
                  onClick={handlePause}
                  style={{
                    background: 'rgba(245, 158, 11, 0.2)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    color: '#f59e0b',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <Pause size={14} />
                  <span>Pause</span>
                </button>
              ) : (
                <button
                  onClick={handleStartPlay}
                  style={{
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    border: '1px solid #22c55e',
                    color: '#ffffff',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: '0 2px 8px rgba(34, 197, 94, 0.35)',
                  }}
                >
                  <Play size={14} />
                  <span>Play Simulation</span>
                </button>
              )}

              <button
                onClick={handleStepNext}
                disabled={simulationStep === 'after'}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: simulationStep === 'after' ? '#475569' : '#e2e8f0',
                  padding: '0.35rem 0.55rem',
                  borderRadius: '6px',
                  cursor: simulationStep === 'after' ? 'not-allowed' : 'pointer',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Step forward"
              >
                Step ▶
              </button>

              <button
                onClick={handleResetSimulation}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#94a3b8',
                  padding: '0.35rem 0.55rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Reset simulation to initial state"
              >
                <RotateCcw size={13} />
              </button>

              <button
                onClick={() => setPlaybackSpeed((s) => (s === 1 ? 2 : 1))}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: playbackSpeed === 2 ? '#38bdf8' : '#94a3b8',
                  padding: '0.35rem 0.55rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                }}
                title="Toggle playback speed"
              >
                {playbackSpeed}x
              </button>
            </div>
          </div>

          {/* Simulation Progress Timeline Bar */}
          <div style={{ height: '3px', width: '100%', background: 'rgba(255, 255, 255, 0.05)', position: 'relative' }}>
            <div
              style={{
                height: '100%',
                background:
                  simulationStep === 'before'
                    ? '#38bdf8'
                    : simulationStep === 'running'
                    ? '#f59e0b'
                    : '#22c55e',
                width:
                  simulationStep === 'before'
                    ? '33.3%'
                    : simulationStep === 'running'
                    ? '66.6%'
                    : '100%',
                transition: 'all 0.4s ease',
              }}
            />
          </div>

          {/* Main 3-Area Visual Flow Stage */}
          <div
            style={{
              padding: '1.25rem',
              background: '#070b14',
              display: 'flex',
              alignItems: 'stretch',
              justifyContent: 'space-between',
              gap: '0.85rem',
              overflowX: 'auto',
            }}
          >
            {/* Column 1: Working Directory */}
            <div
              style={{
                flex: '1 1 0',
                minWidth: '150px',
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '0.95rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#94a3b8',
                  whiteSpace: 'nowrap',
                }}
              >
                <FolderOpen size={15} color="#f59e0b" />
                <span>Working Directory</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {stage.workingDirectory.length === 0 ? (
                  <div style={{ fontSize: '0.74rem', color: '#64748b', fontStyle: 'italic', padding: '0.5rem 0' }}>
                    Clean working directory
                  </div>
                ) : (
                  stage.workingDirectory.map((file, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.74rem',
                        fontFamily: 'ui-monospace, monospace',
                        background: 'rgba(255, 255, 255, 0.03)',
                        padding: '0.35rem 0.55rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        minWidth: 0,
                      }}
                    >
                      <FileCode
                        size={12}
                        color={file.status === 'modified' ? '#f59e0b' : file.status === 'staged' ? '#38bdf8' : '#22c55e'}
                        style={{ flexShrink: 0 }}
                      />
                      <span style={{ color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {file.name}
                      </span>
                      <span
                        style={{
                          marginLeft: 'auto',
                          fontSize: '0.66rem',
                          fontWeight: 700,
                          color: file.status === 'modified' ? '#f59e0b' : file.status === 'staged' ? '#38bdf8' : '#22c55e',
                          flexShrink: 0,
                        }}
                      >
                        ({file.status})
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Transition Arrow 1 */}
            <div style={{ color: '#475569', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <ArrowRight size={18} />
            </div>

            {/* Column 2: Staging Area */}
            <div
              style={{
                flex: '1 1 0',
                minWidth: '150px',
                background: 'rgba(15, 23, 42, 0.85)',
                border:
                  simulationStep === 'after' && stage.stagingArea.length === 0
                    ? '1px dashed rgba(255, 255, 255, 0.15)'
                    : '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '10px',
                padding: '0.95rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#38bdf8',
                  whiteSpace: 'nowrap',
                }}
              >
                <Archive size={15} color="#38bdf8" />
                <span>Staging Index (.git/index)</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {stage.stagingArea.length === 0 ? (
                  <div
                    style={{
                      fontSize: '0.74rem',
                      color: '#64748b',
                      fontStyle: 'italic',
                      padding: '0.5rem 0',
                      textAlign: 'center',
                    }}
                  >
                    (index empty / clean)
                  </div>
                ) : (
                  stage.stagingArea.map((file, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.74rem',
                        fontFamily: 'ui-monospace, monospace',
                        background: 'rgba(56, 189, 248, 0.08)',
                        padding: '0.35rem 0.55rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                        minWidth: 0,
                      }}
                    >
                      <FileCode size={12} color="#38bdf8" style={{ flexShrink: 0 }} />
                      <span style={{ color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {file.name}
                      </span>
                      <span style={{ marginLeft: 'auto', fontSize: '0.66rem', fontWeight: 700, color: '#38bdf8', flexShrink: 0 }}>
                        (staged)
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Transition Arrow 2 */}
            <div style={{ color: '#475569', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <ArrowRight size={18} />
            </div>

            {/* Column 3: Action Execution Pill */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  background:
                    simulationStep === 'running'
                      ? 'linear-gradient(135deg, #f05033 0%, #ea580c 100%)'
                      : 'rgba(255, 255, 255, 0.08)',
                  border:
                    simulationStep === 'running'
                      ? '1px solid #f05033'
                      : '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#f8fafc',
                  padding: '0.55rem 0.95rem',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontFamily: 'ui-monospace, monospace',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  boxShadow:
                    simulationStep === 'running'
                      ? '0 0 20px rgba(240, 80, 51, 0.5), 0 0 40px rgba(240, 80, 51, 0.2)'
                      : 'none',
                  transform: simulationStep === 'running' ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.25s ease',
                }}
              >
                {stage.commandPill || activeConcept.command}
              </div>
              <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                {simulationStep === 'before'
                  ? 'Awaiting execution'
                  : simulationStep === 'running'
                  ? 'Executing command...'
                  : 'Command completed'}
              </span>
            </div>

            {/* Transition Arrow 3 */}
            <div style={{ color: '#475569', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <ArrowRight size={18} />
            </div>

            {/* Column 4: Repository History DAG */}
            <div
              style={{
                flex: '1.2 1 0',
                minWidth: '175px',
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '0.95rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#94a3b8',
                  whiteSpace: 'nowrap',
                }}
              >
                <Layers size={15} color="#22c55e" />
                <span>Repository History DAG</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {stage.historyCommits.map((cmt, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      fontSize: '0.74rem',
                      background: cmt.isNew ? 'rgba(34, 197, 94, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: cmt.isNew ? '1px solid rgba(34, 197, 94, 0.35)' : '1px solid rgba(255, 255, 255, 0.05)',
                      padding: '0.35rem 0.55rem',
                      borderRadius: '6px',
                      minWidth: 0,
                    }}
                  >
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: cmt.isNew ? '#22c55e' : '#64748b',
                        boxShadow: cmt.isNew ? '0 0 10px #22c55e' : 'none',
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'ui-monospace, monospace',
                        fontWeight: 700,
                        color: cmt.isNew ? '#22c55e' : '#cbd5e1',
                        flexShrink: 0,
                      }}
                    >
                      {cmt.hash}
                    </span>
                    <span
                      style={{
                        color: '#94a3b8',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        minWidth: 0,
                      }}
                    >
                      {cmt.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Explanatory description note */}
          <div
            style={{
              padding: '0.85rem 1.25rem',
              background: 'rgba(255, 255, 255, 0.02)',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '0.84rem',
              color: '#cbd5e1',
              lineHeight: 1.5,
            }}
          >
            <span style={{ fontWeight: 700, color: '#f8fafc', marginRight: '0.4rem' }}>
              Phase {simulationStep === 'before' ? '1' : simulationStep === 'running' ? '2' : '3'} Note:
            </span>
            {stage.description}
          </div>

          {/* Dual Summary Cards: What Changed vs What Did NOT Change */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '0.85rem',
              padding: '1rem 1.25rem',
              background: '#070b14',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            {/* Green Card: What Changed? */}
            <div
              style={{
                background: 'rgba(34, 197, 94, 0.06)',
                border: '1px solid rgba(34, 197, 94, 0.22)',
                borderRadius: '10px',
                padding: '0.95rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: '#22c55e',
                }}
              >
                <CheckCircle2 size={16} />
                <span>What changed in Git?</span>
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '1.15rem',
                  fontSize: '0.78rem',
                  color: '#e2e8f0',
                  lineHeight: 1.55,
                }}
              >
                {stage.whatChanged.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Blue Card: What Did NOT Change? */}
            <div
              style={{
                background: 'rgba(56, 189, 248, 0.06)',
                border: '1px solid rgba(56, 189, 248, 0.22)',
                borderRadius: '10px',
                padding: '0.95rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: '#38bdf8',
                }}
              >
                <Info size={16} />
                <span>What did NOT change?</span>
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '1.15rem',
                  fontSize: '0.78rem',
                  color: '#e2e8f0',
                  lineHeight: 1.55,
                }}
              >
                {stage.whatDidNotChange.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODE C: LIVE ACTIVE REPOSITORY & DAG                             */}
      {/* ================================================================ */}
      {viewMode === 'liveRepo' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            style={{
              background: 'rgba(34, 197, 94, 0.06)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: '12px',
              padding: '0.95rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc' }}>
                Active Git Engine: Working Directory, Index & DAG
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Reflects your active repository in real-time. Execute commands in the Sandbox to inspect state shifts.
              </div>
            </div>
            <button
              onClick={handleSeedLiveRepo}
              style={{
                background: 'rgba(34, 197, 94, 0.18)',
                border: '1px solid #22c55e',
                color: '#22c55e',
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Zap size={14} />
              <span>Load "{activeConcept.command}" State</span>
            </button>
          </div>

          <ThreeAreaVisualizer repo={repo} />

          <div style={{ marginTop: '0.25rem' }}>
            <GitGraph repo={repo} onSelectCommit={() => {}} />
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODE D: GIT INTERNAL ARCHITECTURE                                */}
      {/* ================================================================ */}
      {viewMode === 'internals' && (
        <div
          style={{
            background: '#090e1a',
            border: '1px solid rgba(192, 132, 252, 0.25)',
            borderRadius: '14px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Database size={20} color="#c084fc" />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                Object Database & Pointer Mechanics: {activeConcept.command}
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                How Git manipulates blobs, trees, commit objects, and ref pointers behind the scenes.
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
            }}
          >
            {/* Box 1: Storage Location */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8' }}>
                OBJECT TYPE / STORAGE TARGET
              </div>
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.92rem', color: '#f8fafc', fontWeight: 700 }}>
                {activeConcept.reference?.gitInternals?.storageLocation || '.git/objects (40-char SHA-1 database)'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.45 }}>
                {activeConcept.reference?.gitInternals?.objectType || 'Direct DAG Node Pointer'}
              </div>
            </div>

            {/* Box 2: Mechanics Explanation */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#c084fc' }}>
                INTERNAL ENGINE BEHAVIOR
              </div>
              <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                {activeConcept.reference?.gitInternals?.explanation ||
                  `When you execute ${activeConcept.command}, Git calculates the cryptographic SHA hash of the tree, records changes immutably in .git/objects, and atomically advances the active branch pointer.`}
              </div>
            </div>
          </div>

          {/* Real World Analogy Callout */}
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.06)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '10px',
              padding: '0.95rem 1.15rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <Sparkles size={20} color="#f59e0b" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.45 }}>
              <span style={{ fontWeight: 800, color: '#f59e0b', marginRight: '0.4rem' }}>
                Mental Model:
              </span>
              {activeConcept.realWorldAnalogy}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
