import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  SliceState,
  TeachingStep,
  TEACHING_STEPS,
  seedTeacherSliceRepo,
  MilestoneType,
} from '../../data/teacherSliceStory';
import { GitRepo, Commit } from '../../git-engine/types';
import { StateImpactDiff } from './StateImpactDiff';
import { SyntaxTokenBreakdown } from './SyntaxTokenBreakdown';
import { ContextualTermPopover } from './ContextualTermPopover';
import { CommandSidebar } from './CommandSidebar';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  FolderGit2,
  Box,
  Layers,
  ArrowRight,
  Terminal as TerminalIcon,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';

const MILESTONES: { key: MilestoneType; label: string }[] = [
  { key: 'Problem', label: 'Problem' },
  { key: 'Inspect', label: 'Inspect' },
  { key: 'Choose', label: 'Choose' },
  { key: 'Save', label: 'Save' },
  { key: 'Fix', label: 'Fix' },
  { key: 'Prove', label: 'Prove' },
];

export const TeacherLessonView: React.FC = () => {
  const { engine, recordSkillEvidence } = useApp();

  const [currentRepo, setCurrentRepo] = useState<GitRepo>(() => {
    const seeded = seedTeacherSliceRepo();
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

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const currentStep: TeachingStep = TEACHING_STEPS[currentStepIndex] || TEACHING_STEPS[0];

  // Subscribe to engine state updates
  useEffect(() => {
    const unsubscribe = engine.subscribe((updated) => {
      setCurrentRepo(updated);
    });
    return () => unsubscribe();
  }, [engine]);

  // When step changes, perform necessary environmental setups for that step
  useEffect(() => {
    setSelectedPrediction(null);
    setPredictionFeedback(null);
    setSelectedReflection(null);
    setReflectionFeedback(null);
    setMistakeAttempts(0);

    const currentRepo = engine.getRepo();

    // In State 3 (FILES_MODIFIED), introduce Tuesday's edits to index.html and style.css
    if (currentStep.id === SliceState.FILES_MODIFIED) {
      if (!currentRepo.workingDirectory['index.html'].includes('hero')) {
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

    // In State 13 (ENV_ACCIDENTALLY_STAGED), introduce untracked .env file
    if (currentStep.id === SliceState.ENV_ACCIDENTALLY_STAGED) {
      if (currentRepo.workingDirectory['.env'] === undefined) {
        engine.createFile('.env', 'STRIPE_SECRET_KEY=sk_live_secret123\nDB_PASS=supersecret');
      }
    }

    // In State 17 (INDEPENDENT_CHALLENGE), introduce about.html and notes.tmp on disk
    if (currentStep.id === SliceState.INDEPENDENT_CHALLENGE) {
      if (currentRepo.workingDirectory['about.html'] === undefined) {
        engine.createFile('about.html', '<h2>About Me</h2><p>Senior Full-Stack Developer specializing in Git and TypeScript.</p>');
      }
      if (currentRepo.workingDirectory['notes.tmp'] === undefined) {
        engine.createFile('notes.tmp', 'TODO: Refactor CSS, call dentist, fix typo');
      }
    }
  }, [currentStepIndex]);

  // Auto-scroll terminal output
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  // Evaluate if current step's mastery requirements are met
  const isActionCompleted = (): boolean => {
    const currentRepo = engine.getRepo();
    const reqs = currentStep.masteryRequirements;
    if (!reqs) return true;

    // Check state transition
    if (reqs.stateTransition && !reqs.stateTransition(currentRepo, commandHistoryLog)) {
      return false;
    }

    // Check prediction
    if (reqs.prediction) {
      if (!selectedPrediction) return false;
      const opt = currentStep.prediction?.options.find(o => o.id === selectedPrediction);
      if (!opt || !opt.isCorrect) return false;
    }

    // Check reflection
    if (reqs.reflection) {
      if (!selectedReflection) return false;
      const opt = currentStep.reflection?.options.find(o => o.id === selectedReflection);
      if (!opt || !opt.isCorrect) return false;
    }

    return true;
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd) return;

    setTerminalInput('');

    // Execute in engine
    const res = engine.execute(cmd);
    setCommandHistoryLog(prev => [...prev, cmd]);
    setTerminalHistory(prev => [
      ...prev,
      {
        command: cmd,
        output: res.stdout.length > 0 ? res.stdout : (res.stderr.length > 0 ? res.stderr : ['(command completed with no output)']),
      },
    ]);

    // Check if command matched expected
    if (currentStep.expectedCommand) {
      const isExpected = cmd === currentStep.expectedCommand || (currentStep.masteryRequirements?.stateTransition && currentStep.masteryRequirements.stateTransition(engine.getRepo(), [...commandHistoryLog, cmd]));
      if (!isExpected) {
        setMistakeAttempts(prev => prev + 1);
      }
    }
  };

  const handleSelectPrediction = (choiceId: string) => {
    setSelectedPrediction(choiceId);
    const choice = currentStep.prediction?.options.find(o => o.id === choiceId);
    if (choice) {
      setPredictionFeedback(choice.explanation);
    }
  };

  const handleSelectReflection = (optionId: string) => {
    setSelectedReflection(optionId);
    const option = currentStep.reflection?.options.find(o => o.id === optionId);
    if (option && currentStep.reflection) {
      setReflectionFeedback(currentStep.reflection.explanation);
    }
  };

  const handleAdvanceStep = () => {
    if (!isActionCompleted()) return;

    if (currentStepIndex < TEACHING_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsMilestoneMastered(true);
      recordSkillEvidence('foundations', 'understood');
      recordSkillEvidence('staging', 'mastered');
      recordSkillEvidence('commits', 'mastered');
    }
  };

  const activeMilestoneIndex = MILESTONES.findIndex(m => m.key === currentStep.milestone);

  // Compute files for display in Working Tree, Staging, and Commits
  const workingFiles = Object.keys(currentRepo.workingDirectory);
  const stagedFiles = Object.keys(currentRepo.index);
  const commitsList: Commit[] = (Object.values(currentRepo.commits) as Commit[]).sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 60px)',
        minHeight: '620px',
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
          height: '52px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(12, 19, 34, 0.98)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            portfolio-website
          </span>
          <span style={{ color: '#475569' }}>/</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
            Chapter 1: Your First Git Save Point
          </span>
        </div>

        {/* Milestone Pills: Problem → Inspect → Choose → Save → Fix → Prove */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {MILESTONES.map((m, idx) => {
            const isCompleted = idx < activeMilestoneIndex;
            const isCurrent = idx === activeMilestoneIndex;
            return (
              <div
                key={m.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.72rem',
                  fontWeight: isCurrent ? 800 : 600,
                  color: isCurrent ? '#38bdf8' : (isCompleted ? '#4ade80' : '#475569'),
                  background: isCurrent ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '999px',
                  border: isCurrent ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
                }}
              >
                {isCompleted ? <CheckCircle2 size={12} /> : null}
                <span>{m.label}</span>
                {idx < MILESTONES.length - 1 && <span style={{ color: '#334155', marginLeft: '0.2rem' }}>→</span>}
              </div>
            );
          })}
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. MAIN LAYOUT: COMMANDS SIDEBAR (LEFT) + WORKSPACE (RIGHT) */}
      {/* ============================================================ */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* LEFT SIDEBAR: ALL COMMANDS */}
        <CommandSidebar
          currentCommand={currentStep.expectedCommand}
          onInsertCommand={(cmd) => setTerminalInput(cmd)}
        />

        {/* REST TO THE RIGHT: SPLIT WORKSPACE (MENTOR CONVERSATION & LIVING REPO STATE) */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.15fr 1fr', overflow: 'hidden' }}>

        {/* LEFT COLUMN: THE PATIENT SENIOR DEVELOPER & TEACHING STEP */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            background: '#0a0f1d',
            overflowY: 'auto',
            padding: '1.5rem',
            gap: '1rem',
          }}
        >
          {/* SENIOR DEVELOPER SPEECH CARD */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '12px',
              padding: '1.25rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0f172a',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                }}
              >
                👨‍💻
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
                  Senior Dev Mentor
                </div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                  {currentStep.title}
                </h2>
              </div>
            </div>

            {/* DIALOGUE TEXT */}
            <div style={{ color: '#e2e8f0', fontSize: '0.88rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {currentStep.seniorDeveloperDialogue}
            </div>

            {/* IN PLAIN ENGLISH BOX */}
            {currentStep.inPlainEnglish && (
              <div
                style={{
                  marginTop: '0.85rem',
                  background: 'rgba(56, 189, 248, 0.06)',
                  borderLeft: '3px solid #38bdf8',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '0 6px 6px 0',
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#38bdf8', marginBottom: '0.2rem' }}>
                  In Plain English
                </div>
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                  {currentStep.inPlainEnglish}
                </div>
              </div>
            )}

            {/* CONTEXTUAL TERMINOLOGY HELPERS */}
            <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Click term for quick explanation:</span>
              <ContextualTermPopover termKey="working tree" />
              <ContextualTermPopover termKey="staging area" />
              <ContextualTermPopover termKey="repository" />
              <ContextualTermPopover termKey="commit" />
              <ContextualTermPopover termKey="head" />
            </div>
          </div>

          {/* PREDICTION PHASE */}
          {currentStep.prediction && (
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(240, 80, 51, 0.3)',
                borderRadius: '10px',
                padding: '1.1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f05033', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                <Sparkles size={14} />
                <span>Before We Run The Command</span>
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.2rem 0', color: '#f8fafc' }}>
                {currentStep.prediction.question}
              </h3>
              {currentStep.prediction.subtext && (
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0 0 0.75rem 0' }}>
                  {currentStep.prediction.subtext}
                </p>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {currentStep.prediction.options.map(opt => {
                  const isSelected = selectedPrediction === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectPrediction(opt.id)}
                      style={{
                        background: isSelected
                          ? (opt.isCorrect ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)')
                          : 'rgba(255, 255, 255, 0.04)',
                        border: isSelected
                          ? (opt.isCorrect ? '1px solid #22c55e' : '1px solid #ef4444')
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#f8fafc',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '6px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{opt.text}</span>
                      {isSelected && (opt.isCorrect ? <CheckCircle2 size={16} color="#22c55e" /> : <AlertTriangle size={16} color="#ef4444" />)}
                    </button>
                  );
                })}
              </div>

              {predictionFeedback && (
                <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.8rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '6px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                  {predictionFeedback}
                </div>
              )}
            </div>
          )}

          {/* SYNTAX EXPLORER */}
          {currentStep.syntaxBreakdown && (
            <SyntaxTokenBreakdown
              tokens={currentStep.syntaxBreakdown}
              variations={currentStep.variations}
            />
          )}

          {/* STATE IMPACT DIFF (WHAT CHANGED VS WHAT DID NOT) */}
          {currentStep.stateDiff && (
            <StateImpactDiff diff={currentStep.stateDiff} />
          )}

          {/* REFLECTION QUESTION (CONCEPTUAL MASTERY GATE) */}
          {currentStep.reflection && (
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '10px',
                padding: '1.1rem',
              }}
            >
              <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Conceptual Understanding Check
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.75rem 0', color: '#f8fafc' }}>
                {currentStep.reflection.question}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {currentStep.reflection.options.map(opt => {
                  const isSelected = selectedReflection === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectReflection(opt.id)}
                      style={{
                        background: isSelected
                          ? (opt.isCorrect ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)')
                          : 'rgba(255, 255, 255, 0.04)',
                        border: isSelected
                          ? (opt.isCorrect ? '1px solid #22c55e' : '1px solid #ef4444')
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#f8fafc',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '6px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{opt.text}</span>
                      {isSelected && (opt.isCorrect ? <CheckCircle2 size={16} color="#22c55e" /> : <AlertTriangle size={16} color="#ef4444" />)}
                    </button>
                  );
                })}
              </div>

              {reflectionFeedback && (
                <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.8rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '6px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                  {reflectionFeedback}
                </div>
              )}
            </div>
          )}

          {/* ADVANCE STEP BUTTON (ONLY ACTIVE WHEN STEP MASTERY SATISFIED) */}
          <div style={{ marginTop: 'auto', paddingTop: '0.75rem' }}>
            <button
              type="button"
              onClick={handleAdvanceStep}
              disabled={!isActionCompleted()}
              style={{
                width: '100%',
                background: isActionCompleted()
                  ? 'linear-gradient(135deg, #0284c7, #38bdf8)'
                  : 'rgba(255, 255, 255, 0.08)',
                color: isActionCompleted() ? '#0f172a' : '#64748b',
                border: 'none',
                padding: '0.75rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: isActionCompleted() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{currentStep.actionPrompt || 'Continue'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVING GIT STATE (DESK + PACKING BOX + VAULT) & REAL TERMINAL */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#070b14' }}>

          {/* TOP HALF: THE LIVING GIT 3-ZONE WORLD */}
          <div
            style={{
              flex: '1 1 50%',
              padding: '1.25rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              overflowY: 'auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.85rem',
            }}
          >
            {/* ZONE 1: WORKING TREE (YOUR DESK) */}
            <div
              style={{
                background: currentStep.highlightArea === 'working' ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                border: currentStep.highlightArea === 'working' ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                <FileCode size={14} />
                <span>Working Tree (Desk)</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
                {workingFiles.map(file => {
                  const isModified = currentRepo.commits['c0a1b2c']?.files[file] !== currentRepo.workingDirectory[file];
                  const isUntracked = currentRepo.commits['c0a1b2c']?.files[file] === undefined;
                  const isSecret = file === '.env';
                  return (
                    <div
                      key={file}
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: isSecret ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                        padding: '0.45rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.78rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ fontFamily: 'monospace', color: isSecret ? '#f59e0b' : '#f8fafc' }}>{file}</span>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          padding: '0.1rem 0.35rem',
                          borderRadius: '3px',
                          background: isSecret ? 'rgba(245, 158, 11, 0.2)' : (isUntracked ? 'rgba(148, 163, 184, 0.2)' : 'rgba(240, 80, 51, 0.2)'),
                          color: isSecret ? '#f59e0b' : (isUntracked ? '#94a3b8' : '#f05033'),
                        }}
                      >
                        {isSecret ? 'secret' : (isUntracked ? 'untracked' : (isModified ? 'modified' : 'clean'))}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ZONE 2: STAGING AREA (THE PACKING BOX) */}
            <div
              style={{
                background: currentStep.highlightArea === 'staging' ? 'rgba(240, 80, 51, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                border: currentStep.highlightArea === 'staging' ? '1px solid rgba(240, 80, 51, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f05033', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                <Box size={14} />
                <span>Staging Area (Box)</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
                {stagedFiles.length === 0 ? (
                  <div style={{ color: '#64748b', fontSize: '0.75rem', fontStyle: 'italic', margin: 'auto', textAlign: 'center' }}>
                    Packing box is empty
                  </div>
                ) : (
                  stagedFiles.map(file => {
                    const isSecret = file === '.env';
                    return (
                      <div
                        key={file}
                        style={{
                          background: isSecret ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.12)',
                          border: isSecret ? '1px solid #ef4444' : '1px solid rgba(34, 197, 94, 0.3)',
                          padding: '0.45rem 0.6rem',
                          borderRadius: '4px',
                          fontSize: '0.78rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span style={{ fontFamily: 'monospace', color: isSecret ? '#fca5a5' : '#86efac' }}>{file}</span>
                        {isSecret ? (
                          <span style={{ fontSize: '0.65rem', background: '#ef4444', color: 'white', padding: '0.1rem 0.35rem', borderRadius: '3px', fontWeight: 700 }}>
                            ⚠️ DANGER
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.65rem', color: '#86efac' }}>staged</span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* ZONE 3: REPOSITORY COMMITS (THE VAULT) */}
            <div
              style={{
                background: currentStep.highlightArea === 'commits' ? 'rgba(34, 197, 94, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                border: currentStep.highlightArea === 'commits' ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#4ade80', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                <FolderGit2 size={14} />
                <span>History Vault (Commits)</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', flex: 1 }}>
                {commitsList.map(c => {
                  const isHead = currentRepo.branches['main']?.targetCommitHash === c.hash;
                  return (
                    <div
                      key={c.hash}
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        padding: '0.45rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#38bdf8' }}>{c.shortHash}</span>
                        {isHead && (
                          <span style={{ fontSize: '0.62rem', background: '#0284c7', color: 'white', padding: '0.1rem 0.35rem', borderRadius: '3px', fontWeight: 700 }}>
                            {'HEAD -> main'}
                          </span>
                        )}
                      </div>
                      <div style={{ color: '#cbd5e1', fontSize: '0.72rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.message}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* BOTTOM HALF: REAL TERMINAL FOR EXECUTING ACTIONS */}
          <div style={{ flex: '1 1 50%', display: 'flex', flexDirection: 'column', background: '#050811', padding: '1rem', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>
                <TerminalIcon size={14} />
                <span>Developer Terminal</span>
              </div>
              {currentStep.expectedCommand && (
                <div style={{ fontSize: '0.72rem', color: '#38bdf8' }}>
                  Target: <code style={{ color: '#f8fafc' }}>{currentStep.expectedCommand}</code>
                </div>
              )}
            </div>

            {/* TERMINAL OUTPUT STREAM */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                lineHeight: 1.45,
                color: '#f8fafc',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
              }}
            >
              {terminalHistory.length === 0 && (
                <div style={{ color: '#475569', fontStyle: 'italic' }}>
                  Ready. Type your command below and press Enter.
                </div>
              )}
              {terminalHistory.map((item, idx) => (
                <div key={idx}>
                  <div style={{ color: '#38bdf8' }}>
                    $ {item.command}
                  </div>
                  <div style={{ color: '#cbd5e1', whiteSpace: 'pre-wrap', paddingLeft: '0.5rem' }}>
                    {item.output.join('\n')}
                  </div>
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* PROGRESSIVE SENIOR DEV HINTS (WHEN LEARNER STRUGGLES) */}
            {mistakeAttempts > 0 && currentStep.commandHints && (
              <div
                style={{
                  marginTop: '0.5rem',
                  padding: '0.45rem 0.75rem',
                  background: 'rgba(240, 80, 51, 0.1)',
                  borderLeft: '3px solid #f05033',
                  borderRadius: '0 4px 4px 0',
                  fontSize: '0.75rem',
                  color: '#fca5a5',
                }}
              >
                💡 Senior Dev Hint: {currentStep.commandHints[Math.min(mistakeAttempts - 1, currentStep.commandHints.length - 1)]}
              </div>
            )}

            {/* TERMINAL INPUT FORM */}
            <form onSubmit={handleTerminalSubmit} style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#38bdf8', fontFamily: 'monospace', fontWeight: 800 }}>$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder={currentStep.expectedCommand ? `Type ${currentStep.expectedCommand}` : 'Enter git command...'}
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '4px',
                  color: '#f8fafc',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  padding: '0.45rem 0.65rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'rgba(56, 189, 248, 0.2)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  color: '#38bdf8',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '4px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Run
              </button>
            </form>
          </div>

        </div>
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
              border: '2px solid #38bdf8',
              borderRadius: '16px',
              padding: '2.5rem',
              maxWidth: '550px',
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(56, 189, 248, 0.3)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎓</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f8fafc', margin: '0 0 0.5rem 0' }}>
              Milestone 1 Mastered!
            </h2>
            <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Portfolio Website: First Git Save Point
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              You have mastered the foundational Git mental model. You understand why snapshots exist, how to inspect changes, how to selectively stage files, how to create sealed commits, and how to recover from an accidental secret file staging without losing your work.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsMilestoneMastered(false);
                setCurrentStepIndex(0);
                const seeded = seedTeacherSliceRepo();
                engine.setRepo(seeded);
              }}
              style={{
                background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                color: '#0f172a',
                border: 'none',
                padding: '0.85rem 1.8rem',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
              }}
            >
              Replay Journey or Review Concepts
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
