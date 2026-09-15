import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  SliceState,
  TeachingStep,
  MilestoneType,
  seedTeacherSliceRepo,
} from '../../data/teacherSliceStory';
import { getTopicLesson, TopicLessonPackage } from '../../data/topicLessons';
import { GitRepo } from '../../git-engine/types';
import { TeachingCanvas } from './TeachingCanvas';
import { TeacherDialogueCard } from './TeacherDialogueCard';
import { ContextualGitStage } from './ContextualGitStage';
import { BENTO_CATEGORIES, BentoCategory, JourneyConcept } from '../../data/journeyModel';
import {
  CheckCircle2,
  BookmarkCheck,
  GitCommit,
  GitBranch,
  Share2,
  GitMerge,
  Clock,
  ArrowLeft,
  Sparkles,
  Layers,
  Search,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ListFilter,
} from 'lucide-react';

const MILESTONES: { key: MilestoneType; label: string }[] = [
  { key: 'Problem', label: 'Problem' },
  { key: 'Inspect', label: 'Inspect' },
  { key: 'Choose', label: 'Choose' },
  { key: 'Save', label: 'Save' },
  { key: 'Fix', label: 'Fix' },
  { key: 'Prove', label: 'Prove' },
];

interface TeacherLessonViewProps {
  onBackToJourney?: () => void;
  conceptId?: string | null;
}

export const TeacherLessonView: React.FC<TeacherLessonViewProps> = ({ onBackToJourney, conceptId }) => {
  const { engine, recordSkillEvidence, setMode, activeLessonConcept, setActiveLessonConcept } = useApp();

  const effectiveConceptId = conceptId || activeLessonConcept || 'c-what-is-vcs';
  const lessonPackage: TopicLessonPackage = useMemo(() => getTopicLesson(effectiveConceptId), [effectiveConceptId]);

  const [currentRepo, setCurrentRepo] = useState<GitRepo>(() => {
    const seeded = lessonPackage.seedRepo();
    engine.setRepo(seeded);
    return seeded;
  });

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [terminalHistory, setTerminalHistory] = useState<{ command: string; output: string[] }[]>([]);
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [predictionFeedback, setPredictionFeedback] = useState<string | null>(null);
  const [selectedReflection, setSelectedReflection] = useState<string | null>(null);
  const [reflectionFeedback, setReflectionFeedback] = useState<string | null>(null);
  const [mistakeAttempts, setMistakeAttempts] = useState<number>(0);
  const [commandHistoryLog, setCommandHistoryLog] = useState<string[]>([]);
  const [isMilestoneMastered, setIsMilestoneMastered] = useState<boolean>(false);
  const [sidebarTab, setSidebarTab] = useState<'current' | 'all-topics'>('current');
  const [topicSearch, setTopicSearch] = useState<string>('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'cat-foundations': true,
  });

  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const filteredCategories = useMemo(() => {
    const q = topicSearch.trim().toLowerCase();
    if (!q) return BENTO_CATEGORIES;
    return BENTO_CATEGORIES.map(cat => {
      const matchingConcepts = cat.concepts.filter(
        c =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          (c.subtopics && c.subtopics.some(s => s.toLowerCase().includes(q))) ||
          (c.commands && c.commands.some(cmd => cmd.toLowerCase().includes(q)))
      );
      return {
        ...cat,
        concepts: matchingConcepts,
      };
    }).filter(cat => cat.concepts.length > 0);
  }, [topicSearch]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const currentStep: TeachingStep = lessonPackage.steps[currentStepIndex] || lessonPackage.steps[0];

  // Subscribe to engine updates
  useEffect(() => {
    const unsubscribe = engine.subscribe((updated) => {
      setCurrentRepo(updated);
    });
    return () => unsubscribe();
  }, [engine]);

  // When concept changes, re-seed repo and reset step index
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsMilestoneMastered(false);
    setTerminalHistory([]);
    setCommandHistoryLog([]);
    setSelectedPrediction(null);
    setPredictionFeedback(null);
    setSelectedReflection(null);
    setReflectionFeedback(null);
    const seeded = lessonPackage.seedRepo();
    engine.setRepo(seeded);
  }, [effectiveConceptId, lessonPackage, engine]);

  // When step changes, perform necessary environmental setups for that step
  useEffect(() => {
    setSelectedPrediction(null);
    setPredictionFeedback(null);
    setSelectedReflection(null);
    setReflectionFeedback(null);
    setMistakeAttempts(0);

    const repoState = engine.getRepo();

    // Step 3 (FILES_MODIFIED): introduce Tuesday's edits to index.html and style.css
    if (currentStep.id === SliceState.FILES_MODIFIED) {
      if (!repoState.workingDirectory['index.html']?.includes('hero')) {
        const updatedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Developer Portfolio</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="hero">Welcome to my Portfolio</header>
  <h1>Welcome to my website</h1>
</body>
</html>`;
        const updatedCss = `body {
  font-family: system-ui, sans-serif;
  margin: 0;
  padding: 2rem;
  background: #0f172a;
  color: #f8fafc;
}

/* WIP: Unfinished button styling */
.button {
  background: #f05033;
  color: white;
}`;
        engine.updateFileContent('index.html', updatedHtml);
        engine.updateFileContent('style.css', updatedCss);
      }
    }

    // Step 13 (ENV_ACCIDENTALLY_STAGED): introduce untracked .env file with simulated secret
    if (currentStep.id === SliceState.ENV_ACCIDENTALLY_STAGED) {
      if (repoState.workingDirectory['.env'] === undefined) {
        engine.createFile('.env', 'STRIPE_SECRET_KEY=SIMULATED_SECRET\nDB_PASS=SIMULATED_PASSWORD');
      }
    }

    // Step 17 (INDEPENDENT_CHALLENGE): introduce about.html and notes.tmp on disk
    if (currentStep.id === SliceState.INDEPENDENT_CHALLENGE) {
      if (repoState.workingDirectory['about.html'] === undefined) {
        engine.createFile(
          'about.html',
          '<h2>About Me</h2>\n<p>Senior Full-Stack Developer specializing in Git and TypeScript.</p>'
        );
      }
      if (repoState.workingDirectory['notes.tmp'] === undefined) {
        engine.createFile('notes.tmp', 'TODO: Refactor CSS, call dentist, fix typo');
      }
    }
  }, [currentStepIndex, engine, currentStep.id]);

  // Auto-scroll terminal output
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  // Evaluate if current step's mastery requirements are satisfied
  const isActionCompleted = (): boolean => {
    if (currentStep.expectedCommand) {
      const lastCmd = commandHistoryLog[commandHistoryLog.length - 1];
      if (!lastCmd) return false;
      const expected = currentStep.expectedCommand.trim().toLowerCase();
      const actual = lastCmd.trim().toLowerCase();
      const matches =
        actual === expected ||
        (expected.startsWith('git ') && actual.startsWith(expected.split(' ')[0] + ' ' + (expected.split(' ')[1] || '')));
      if (!matches && currentStep.masteryRequirements?.stateTransition) {
        if (!currentStep.masteryRequirements.stateTransition(engine.getRepo(), commandHistoryLog)) {
          return false;
        }
      } else if (!matches) {
        return false;
      }
    }

    const reqs = currentStep.masteryRequirements;
    if (!reqs) return true;

    // Check state transition
    if (reqs.stateTransition && !reqs.stateTransition(engine.getRepo(), commandHistoryLog)) {
      return false;
    }

    // Check prediction
    if (reqs.prediction) {
      if (!selectedPrediction) return false;
      const opt = currentStep.prediction?.options?.find((o) => o.id === selectedPrediction);
      if (!opt || !opt.isCorrect) return false;
    }

    // Check reflection
    if (reqs.reflection) {
      if (!selectedReflection) return false;
      const opt = currentStep.reflection?.options?.find((o) => o.id === selectedReflection);
      if (!opt || !opt.isCorrect) return false;
    }

    return true;
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd) return;

    setTerminalInput('');

    // Execute in GitEngine
    const res = engine.execute(cmd);
    setCommandHistoryLog((prev) => [...prev, cmd]);

    // Format output with Senior Developer mentoring
    let outputLines = res.stdout.length > 0 ? res.stdout : res.stderr;
    if (outputLines.length === 0) {
      outputLines = ['(command completed with no output)'];
    }

    // Senior Dev gentle error advice
    if (currentStep.expectedCommand === 'git add index.html' && cmd === 'git add .') {
      outputLines = [
        ...outputLines,
        '👨‍💻 Senior Dev Note: `git add .` stages EVERYTHING in the directory (including unfinished CSS!). Let’s inspect what entered staging.',
      ];
    } else if (res.exitCode !== 0 && res.stderr.some((l) => l.includes('is not a git command'))) {
      outputLines = [
        ...outputLines,
        '👨‍💻 Senior Dev Note: Git doesn’t recognize that command. Let’s look at what you were trying to ask Git.',
      ];
    }

    setTerminalHistory((prev) => [
      ...prev,
      {
        command: cmd,
        output: outputLines,
      },
    ]);

    // Track mistakes for progressive hints
    if (currentStep.expectedCommand) {
      const isMatch =
        cmd === currentStep.expectedCommand ||
        (currentStep.masteryRequirements?.stateTransition &&
          currentStep.masteryRequirements.stateTransition(engine.getRepo(), [
            ...commandHistoryLog,
            cmd,
          ]));
      if (!isMatch) {
        setMistakeAttempts((prev) => prev + 1);
      }
    }
  };

  const handleSelectPrediction = (choiceId: string) => {
    setSelectedPrediction(choiceId);
    const choice = currentStep.prediction?.options?.find((o) => o.id === choiceId);
    if (choice) {
      setPredictionFeedback(choice.explanation);
    }
  };

  const handleSelectReflection = (optionId: string) => {
    setSelectedReflection(optionId);
    const option = currentStep.reflection?.options?.find((o) => o.id === optionId);
    if (option && currentStep.reflection) {
      setReflectionFeedback(currentStep.reflection.explanation);
    }
  };

  const handleAdvanceStep = () => {
    if (!isActionCompleted()) return;

    if (currentStepIndex < lessonPackage.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsMilestoneMastered(true);
      recordSkillEvidence('foundations', 'mastered');
    }
  };

  const handleResetChallenge = () => {
    engine.createFile(
      'about.html',
      '<h2>About Me</h2>\n<p>Senior Full-Stack Developer specializing in Git and TypeScript.</p>'
    );
    engine.createFile('notes.tmp', 'TODO: Refactor CSS, call dentist, fix typo');
    // Unstage notes.tmp if staged
    if (engine.getRepo().index['notes.tmp']) {
      engine.execute('git restore --staged notes.tmp');
    }
    setTerminalHistory((prev) => [
      ...prev,
      {
        command: '# Challenge reset',
        output: ['Reset about.html and notes.tmp to unstaged state on disk.'],
      },
    ]);
  };

  const activeMilestoneIndex = MILESTONES.findIndex((m) => m.key === currentStep.milestone);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 60px)',
        minHeight: '600px',
        maxHeight: '100vh',
        background: '#090e1a',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* ============================================================ */}
      {/* 1. QUIET STORY PROGRESS HEADER                                */}
      {/* ============================================================ */}
      <header
        style={{
          height: '50px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: '#0c1322',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {onBackToJourney && (
            <button
              onClick={onBackToJourney}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#cbd5e1',
                borderRadius: '6px',
                padding: '0.25rem 0.6rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                marginRight: '0.35rem',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
              title="Return to Git Journey Bento"
            >
              <ArrowLeft size={13} />
              <span>Back to Journey</span>
            </button>
          )}
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: lessonPackage.categoryAccent,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {lessonPackage.categoryTitle}
          </span>
          <span style={{ color: '#475569' }}>/</span>
          <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#f8fafc' }}>
            {lessonPackage.title}
          </span>
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '0.15rem 0.45rem',
              borderRadius: '4px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#94a3b8',
              marginLeft: '0.3rem',
            }}
          >
            {lessonPackage.difficulty}
          </span>
        </div>

        {/* Milestone Steps Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          {lessonPackage.steps.map((st, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div
                key={st.id || idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.72rem',
                  fontWeight: isCurrent ? 800 : 600,
                  color: isCurrent ? '#38bdf8' : isCompleted ? '#4ade80' : '#475569',
                  background: isCurrent ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '999px',
                  border: isCurrent
                    ? '1px solid rgba(56, 189, 248, 0.3)'
                    : '1px solid transparent',
                }}
              >
                {isCompleted ? <CheckCircle2 size={12} /> : null}
                <span>Step {idx + 1}: {st.milestoneLabel || st.milestone}</span>
                {idx < lessonPackage.steps.length - 1 && (
                  <span style={{ color: '#334155', marginLeft: '0.15rem' }}>→</span>
                )}
              </div>
            );
          })}
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. MAIN LAYOUT: YOUR JOURNEY RAIL (LEFT) + TEACHING CANVAS (CENTER) */}
      {/* ============================================================ */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* DUAL-TAB "YOUR JOURNEY" RAIL */}
        <nav
          style={{
            width: '280px',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            background: '#070b14',
            padding: '1rem 0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            flexShrink: 0,
            overflowY: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => {
                if (onBackToJourney) {
                  onBackToJourney();
                } else {
                  setMode('learn');
                }
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#38bdf8',
                padding: '0.4rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.15s ease',
              }}
              title="Return to the Git Journey Curriculum"
            >
              <ArrowLeft size={13} />
              <span>Git Journey</span>
            </button>

            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              128 Topics
            </span>
          </div>

          {/* Mode Switcher Tabs: Current Lesson vs All Topics */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '3px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <button
              onClick={() => setSidebarTab('current')}
              style={{
                background: sidebarTab === 'current' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                color: sidebarTab === 'current' ? '#38bdf8' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                padding: '0.35rem 0.4rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
                transition: 'all 0.15s ease',
              }}
            >
              <BookOpen size={12} />
              <span>Current</span>
            </button>
            <button
              onClick={() => setSidebarTab('all-topics')}
              style={{
                background: sidebarTab === 'all-topics' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                color: sidebarTab === 'all-topics' ? '#38bdf8' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                padding: '0.35rem 0.4rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
                transition: 'all 0.15s ease',
              }}
            >
              <Layers size={12} />
              <span>All Topics</span>
            </button>
          </div>

          {/* TAB 1: CURRENT LESSON DETAILS */}
          {sidebarTab === 'current' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    color: lessonPackage.categoryAccent,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '0.3rem',
                    paddingLeft: '0.2rem',
                  }}
                >
                  {lessonPackage.categoryTitle}
                </div>
                <div
                  style={{
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    color: '#f8fafc',
                    marginBottom: '0.75rem',
                    paddingLeft: '0.2rem',
                    lineHeight: 1.3,
                  }}
                >
                  {lessonPackage.title}
                </div>

                {/* Steps Progress */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      paddingLeft: '0.2rem',
                      marginBottom: '0.2rem',
                    }}
                  >
                    Lesson Steps
                  </div>
                  {lessonPackage.steps.map((st, sIdx) => {
                    const isCur = sIdx === currentStepIndex;
                    const isDone = sIdx < currentStepIndex;
                    return (
                      <div
                        key={sIdx}
                        onClick={() => {
                          if (sIdx <= currentStepIndex) {
                            setCurrentStepIndex(sIdx);
                          }
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.4rem 0.6rem',
                          borderRadius: '6px',
                          background: isCur ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                          color: isCur ? '#38bdf8' : isDone ? '#4ade80' : '#64748b',
                          fontSize: '0.75rem',
                          fontWeight: isCur ? 800 : 600,
                          cursor: sIdx <= currentStepIndex ? 'pointer' : 'default',
                        }}
                      >
                        {isDone ? (
                          <CheckCircle2 size={13} color="#4ade80" />
                        ) : (
                          <span
                            style={{
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              background: isCur ? '#38bdf8' : '#334155',
                            }}
                          />
                        )}
                        <span>{st.title || `Step ${sIdx + 1}`}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Subtopics Checklist */}
                <div
                  style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingTop: '0.85rem',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      paddingLeft: '0.2rem',
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <Layers size={12} color={lessonPackage.categoryAccent} />
                    <span>Subtopics Covered ({lessonPackage.subtopics.length})</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', paddingLeft: '0.2rem' }}>
                    {lessonPackage.subtopics.map((sub, idx) => (
                      <div
                        key={idx}
                        style={{
                          fontSize: '0.72rem',
                          color: '#cbd5e1',
                          lineHeight: 1.4,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.4rem',
                          background: 'rgba(255, 255, 255, 0.02)',
                          padding: '0.3rem 0.5rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 255, 255, 0.04)',
                        }}
                      >
                        <span style={{ color: lessonPackage.categoryAccent, marginTop: '2px', fontSize: '0.75rem' }}>•</span>
                        <span>{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ALL TOPICS & SUBTOPICS EXPLORER */}
          {sidebarTab === 'all-topics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Search input */}
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Search
                  size={12}
                  color="#64748b"
                  style={{ position: 'absolute', left: '0.6rem', pointerEvents: 'none' }}
                />
                <input
                  type="text"
                  placeholder="Search 128 topics..."
                  value={topicSearch}
                  onChange={(e) => setTopicSearch(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '6px',
                    padding: '0.35rem 0.6rem 0.35rem 1.8rem',
                    fontSize: '0.72rem',
                    color: '#f8fafc',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Categories & Concepts Accordion */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: 'calc(100vh - 230px)', overflowY: 'auto' }}>
                {filteredCategories.map((category) => {
                  const isExpanded = expandedCategories[category.id] ?? (topicSearch.length > 0);
                  const isCategoryActive = category.title === lessonPackage.categoryTitle;

                  return (
                    <div
                      key={category.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: isCategoryActive ? `1px solid ${category.accentColor}55` : '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Category Header */}
                      <div
                        onClick={() => toggleCategory(category.id)}
                        style={{
                          padding: '0.45rem 0.6rem',
                          background: isCategoryActive ? `${category.accentColor}11` : 'rgba(255, 255, 255, 0.03)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          userSelect: 'none',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
                          <span
                            style={{
                              fontSize: '0.62rem',
                              fontWeight: 800,
                              color: category.accentColor,
                              fontFamily: 'monospace',
                            }}
                          >
                            {category.number}
                          </span>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: '#f8fafc',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {category.title}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <span style={{ fontSize: '0.62rem', color: '#64748b' }}>
                            {category.concepts.length}
                          </span>
                          {isExpanded ? <ChevronDown size={12} color="#94a3b8" /> : <ChevronRight size={12} color="#94a3b8" />}
                        </div>
                      </div>

                      {/* Concepts List within Category */}
                      {isExpanded && (
                        <div style={{ padding: '0.35rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          {category.concepts.map((c) => {
                            const isCurrentConcept = c.id === effectiveConceptId;
                            return (
                              <div
                                key={c.id}
                                onClick={() => {
                                  if (setActiveLessonConcept) {
                                    setActiveLessonConcept(c.id);
                                  }
                                }}
                                style={{
                                  padding: '0.4rem 0.55rem',
                                  borderRadius: '6px',
                                  background: isCurrentConcept ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                                  border: isCurrentConcept ? '1px solid #38bdf8' : '1px solid transparent',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '0.2rem',
                                  transition: 'all 0.15s ease',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.3rem' }}>
                                  <span
                                    style={{
                                      fontSize: '0.72rem',
                                      fontWeight: isCurrentConcept ? 800 : 600,
                                      color: isCurrentConcept ? '#38bdf8' : '#e2e8f0',
                                      lineHeight: 1.3,
                                    }}
                                  >
                                    {c.title}
                                  </span>
                                  {isCurrentConcept && (
                                    <span
                                      style={{
                                        fontSize: '0.55rem',
                                        background: '#38bdf8',
                                        color: '#070b14',
                                        padding: '0.05rem 0.25rem',
                                        borderRadius: '3px',
                                        fontWeight: 800,
                                      }}
                                    >
                                      ACTIVE
                                    </span>
                                  )}
                                </div>

                                {c.subtopics && c.subtopics.length > 0 && (
                                  <div style={{ fontSize: '0.62rem', color: '#64748b' }}>
                                    {c.subtopics.length} subtopics
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* TEACHING CANVAS (CENTER OF THE PRODUCT) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <TeachingCanvas
              conceptId={effectiveConceptId}
              currentStep={currentStep}
              currentRepo={currentRepo}
              terminalInput={terminalInput}
              setTerminalInput={setTerminalInput}
              terminalHistory={terminalHistory}
              onTerminalSubmit={handleTerminalSubmit}
              selectedPrediction={selectedPrediction}
              onSelectPrediction={handleSelectPrediction}
              predictionFeedback={predictionFeedback}
              selectedReflection={selectedReflection}
              onSelectReflection={handleSelectReflection}
              reflectionFeedback={reflectionFeedback}
              commandHistoryLog={commandHistoryLog}
              terminalEndRef={terminalEndRef}
              onResetChallenge={handleResetChallenge}
              mistakeAttempts={mistakeAttempts}
            />
          </div>

          {/* ============================================================ */}
          {/* 3. SENIOR DEVELOPER PROMPT & PERSISTENT GIT STATE ANCHOR       */}
          {/* ============================================================ */}
          <TeacherDialogueCard
            step={currentStep}
            canAdvance={isActionCompleted()}
            onAdvance={handleAdvanceStep}
            isLastStep={currentStepIndex === lessonPackage.steps.length - 1}
          />

          <ContextualGitStage
            repo={currentRepo}
            highlightArea={currentStep.highlightArea}
          />
        </div>
      </div>

      {/* MASTERY CERTIFICATE MODAL */}
      {isMilestoneMastered && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              background: '#0f172a',
              border: `2px solid ${lessonPackage.categoryAccent}`,
              borderRadius: '16px',
              padding: '2.5rem',
              maxWidth: '550px',
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(56, 189, 248, 0.3)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎓</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f8fafc', margin: '0 0 0.5rem 0' }}>
              Topic Mastered!
            </h2>
            <div
              style={{
                color: lessonPackage.categoryAccent,
                fontWeight: 800,
                fontSize: '1.05rem',
                marginBottom: '0.35rem',
              }}
            >
              {lessonPackage.title}
            </div>
            <div
              style={{
                color: '#64748b',
                fontSize: '0.75rem',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {lessonPackage.categoryTitle} • {lessonPackage.difficulty}
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              You completed the interactive lesson and validated knowledge across all {lessonPackage.subtopics.length} subtopics!
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  if (onBackToJourney) {
                    onBackToJourney();
                  } else {
                    setMode('learn');
                  }
                }}
                style={{
                  background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                  color: '#0f172a',
                  border: 'none',
                  padding: '0.75rem 1.4rem',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                Back to Git Journey
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMilestoneMastered(false);
                  setCurrentStepIndex(0);
                  const seeded = lessonPackage.seedRepo();
                  engine.setRepo(seeded);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#f8fafc',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '0.75rem 1.4rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                Review Lesson
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
