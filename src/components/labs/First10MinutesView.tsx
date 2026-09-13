import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FIRST_10_MINUTES_STEPS, First10Step } from '../../data/first10Minutes';
import { GitAnimationStage } from '../animation/GitAnimationStage';
import { StageMode } from '../animation/types';
import { Terminal } from '../terminal/Terminal';
import { ForgeAvatar } from '../common/ForgeAvatar';
import {
  CheckCircle2,
  Copy,
  Terminal as TerminalIcon,
  FileText,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  LifeBuoy,
  Lock,
  Check,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

export const First10MinutesView: React.FC = () => {
  const {
    first10Step,
    setFirst10Step,
    setShowLostDrawer,
    setMode,
    setInstructionMode,
    executeCommand,
    updateEditorContent,
    repo,
    terminalHistory,
    recordSkillEvidence,
  } = useApp();

  const [bottomTab, setBottomTab] = useState<'terminal' | 'output' | 'notes'>('terminal');
  const [stageMode, setStageMode] = useState<StageMode>('animation');
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [showTransitionModal, setShowTransitionModal] = useState(false);

  const mainRef = useRef<HTMLElement>(null);

  // Keep scroll at top on step navigation so user sees the stage and title
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [first10Step]);

  const currentStepData: First10Step =
    FIRST_10_MINUTES_STEPS.find((s) => s.step === first10Step) ||
    FIRST_10_MINUTES_STEPS[0];
  const isLastStep = first10Step === FIRST_10_MINUTES_STEPS.length;
  const nextStepData = FIRST_10_MINUTES_STEPS.find((s) => s.step === first10Step + 1);

  // Gated verification check
  const isStepCompleted = currentStepData.isComplete(repo, terminalHistory);

  const handleNextStep = () => {
    if (!isLastStep) {
      setFirst10Step(first10Step + 1);
      setHintLevel(0);
      recordSkillEvidence('foundations', 'practiced');
    } else {
      recordSkillEvidence('foundations', 'mastered');
      setShowTransitionModal(true);
    }
  };

  const handlePrevStep = () => {
    if (first10Step > 1) {
      setFirst10Step(first10Step - 1);
      setHintLevel(0);
    } else {
      setMode('dashboard');
    }
  };

  const handleCopyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 1500);
  };

  const runSampleAction = () => {
    if (currentStepData.expectedCommand) {
      executeCommand(currentStepData.expectedCommand);
    } else {
      executeCommand(currentStepData.terminalSampleCommand);
    }
  };

  const progressPercent = Math.round(((first10Step - 1) / FIRST_10_MINUTES_STEPS.length) * 100);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        background: '#070c18',
        color: '#f8fafc',
        height: 'calc(100vh - 60px)',
        overflow: 'hidden',
      }}
      className="first10-main-layout"
    >
      {/* COLUMN 1: Curriculum Checklist & Progress Sidebar (Matching Mockup) */}
      <aside
        style={{
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          background: '#0b1120',
          padding: '1.25rem 1rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '1.25rem',
        }}
        className="curriculum-sidebar"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Section Header */}
          <div style={{ paddingLeft: '0.5rem' }}>
            <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#f8fafc' }}>
              Git Foundations
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Essential mental model & workflow
            </div>
          </div>

          {/* 12 Lessons Checklist */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {FIRST_10_MINUTES_STEPS.map((s) => {
              const isCurrent = s.step === first10Step;
              const isDone = s.step < first10Step;
              return (
                <button
                  key={s.step}
                  onClick={() => setFirst10Step(s.step)}
                  style={{
                    background: isCurrent ? 'rgba(37, 99, 235, 0.25)' : 'transparent',
                    border: `1px solid ${isCurrent ? '#3b82f6' : 'transparent'}`,
                    color: isCurrent ? '#ffffff' : isDone ? '#94a3b8' : '#64748b',
                    borderRadius: '8px',
                    padding: '0.5rem 0.65rem',
                    fontSize: '0.82rem',
                    fontWeight: isCurrent ? 800 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isDone ? (
                    <CheckCircle2 size={16} color="#10b981" />
                  ) : (
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: isCurrent ? '#2563eb' : 'rgba(255, 255, 255, 0.06)',
                        color: isCurrent ? '#ffffff' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                      }}
                    >
                      {s.step}
                    </span>
                  )}
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.title} {isCurrent && '✨'}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Next Up Box */}
          {nextStepData && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                borderRadius: '10px',
                padding: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
              }}
            >
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                Next up
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.85rem', color: '#cbd5e1' }}>
                <ChevronRight size={16} color="#38bdf8" /> {nextStepData.title}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                {nextStepData.subtitle}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Sidebar: Progress Dial & Mentor Quote */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem' }}>
          {/* Progress Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'conic-gradient(#38bdf8 0% ' + progressPercent + '%, rgba(255, 255, 255, 0.1) ' + progressPercent + '% 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#38bdf8',
              }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0b1120', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {progressPercent}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc' }}>
                Your Progress
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                {first10Step - 1} of 12 lessons completed
              </div>
            </div>
          </div>

          {/* Forge Avatar Motivation Bubble */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.6rem 0.75rem', borderRadius: '8px' }}>
            <ForgeAvatar size={34} mood="happy" />
            <div style={{ fontSize: '0.74rem', color: '#cbd5e1', lineHeight: 1.4 }}>
              "You're doing great! Every expert was once a beginner."
            </div>
          </div>
        </div>
      </aside>

      {/* COLUMN 2: Main Interactive Content Area (Matching Mockup) */}
      <main
        ref={mainRef}
        style={{
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem 2rem',
          gap: '1.5rem',
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Header Breadcrumbs & Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#64748b' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => setMode('dashboard')}>Learn</span>
            <span>&gt;</span>
            <span>Git Foundations</span>
            <span>&gt;</span>
            <span style={{ color: '#38bdf8', fontWeight: 700 }}>
              🚀 {currentStepData.title}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f8fafc', margin: 0 }}>
                {currentStepData.title}
              </h1>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#10b981',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                }}
              >
                Step {first10Step} of {FIRST_10_MINUTES_STEPS.length}
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.95rem', color: '#94a3b8', margin: '0.2rem 0 0', lineHeight: 1.5 }}>
            {currentStepData.conceptBody}
          </p>
        </div>

        {/* Center Stage: The Interactive Git Animation Stage */}
        <GitAnimationStage
          commandId={currentStepData.commandId}
          stageMode={stageMode}
          repo={repo}
          onExecuteCommand={executeCommand}
          onUpdateFileContent={updateEditorContent}
        />

        {/* Bottom Section: Left Tabs (Terminal / Output / Notes) + Right Column (Mentor / Takeaways / Try It) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(400px, 1.4fr) minmax(320px, 1fr)',
            gap: '1.5rem',
          }}
          className="learn-bottom-grid"
        >
          {/* Bottom Left Panel: Tabbed Container */}
          <div
            style={{
              background: '#0b1120',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            }}
          >
            {/* Tabs Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 1rem',
                background: '#0e172a',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                height: '42px',
              }}
            >
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  onClick={() => setBottomTab('terminal')}
                  style={{
                    background: bottomTab === 'terminal' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                    color: bottomTab === 'terminal' ? '#38bdf8' : '#94a3b8',
                    border: 'none',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <TerminalIcon size={14} /> Terminal
                </button>
                <button
                  onClick={() => setBottomTab('output')}
                  style={{
                    background: bottomTab === 'output' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                    color: bottomTab === 'output' ? '#38bdf8' : '#94a3b8',
                    border: 'none',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <FileText size={14} /> Output
                </button>
                <button
                  onClick={() => setBottomTab('notes')}
                  style={{
                    background: bottomTab === 'notes' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                    color: bottomTab === 'notes' ? '#38bdf8' : '#94a3b8',
                    border: 'none',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <BookOpen size={14} /> Notes
                </button>
              </div>

              <button
                onClick={() => handleCopyCommand(currentStepData.terminalSampleCommand)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <Copy size={13} /> {copiedCmd ? 'Copied!' : 'Copy'}
              </button>
            </div>

            {/* Tab Body: Real Terminal Runner or Realistic Output */}
            <div style={{ flex: 1, minHeight: '320px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {bottomTab === 'terminal' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  <Terminal autoFocus={false} />
                </div>
              )}

              {bottomTab === 'output' && (
                <div style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.85rem', color: '#cbd5e1', overflowY: 'auto', height: '100%' }}>
                  <div style={{ color: '#38bdf8', marginBottom: '0.5rem' }}>
                    $ {currentStepData.terminalSampleCommand}
                  </div>
                  {currentStepData.terminalSampleOutput.map((line, idx) => (
                    <div key={idx} style={{ lineHeight: 1.5 }}>
                      {line}
                    </div>
                  ))}
                </div>
              )}

              {bottomTab === 'notes' && (
                <div style={{ padding: '1rem', fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6, overflowY: 'auto', height: '100%' }}>
                  <div style={{ fontWeight: 800, color: '#f8fafc', marginBottom: '0.4rem' }}>
                    Mental Model Summary
                  </div>
                  <p style={{ margin: '0 0 0.75rem' }}>{currentStepData.conceptBody}</p>
                  <div style={{ fontWeight: 800, color: '#f8fafc', marginBottom: '0.4rem' }}>
                    Rules of Thumb
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                    {currentStepData.keyTakeaways.map((k, idx) => (
                      <li key={idx} style={{ marginBottom: '0.35rem' }}>{k}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Right Column: Mentor, What's Happening, Key Takeaways, Try It Yourself */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Forge (Your Mentor) Card */}
            <div
              style={{
                background: '#0b1120',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '1.1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <ForgeAvatar size={38} mood="happy" />
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc' }}>
                    Forge (Your Mentor)
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    Senior Dev Guidance
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5, background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: '8px' }}>
                {currentStepData.forgeMessage}
              </div>
            </div>

            {/* What's Happening? Card (Matching Mockup with numbered steps) */}
            <div
              style={{
                background: '#0b1120',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '1.1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc' }}>
                <span>💡</span> What's happening?
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {currentStepData.whatsHappeningSteps.map((wh) => (
                  <div key={wh.number} style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#2563eb',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        flexShrink: 0,
                        marginTop: '0.1rem',
                      }}
                    >
                      {wh.number}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc' }}>
                        {wh.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {wh.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Takeaways Card */}
            <div
              style={{
                background: '#0b1120',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '1.1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc' }}>
                <span>📖</span> Key Takeaways
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {currentStepData.keyTakeaways.map((kt, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#cbd5e1' }}>
                    <CheckCircle2 size={14} color="#10b981" />
                    <span>{kt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Try It Yourself Box (Matching Mockup) */}
            <div
              style={{
                background: 'rgba(37, 99, 235, 0.1)',
                border: '1px solid rgba(37, 99, 235, 0.3)',
                borderRadius: '14px',
                padding: '1.1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8' }}>
                <span>&gt;_</span> Try it yourself
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Run the command to execute this operation on the Git Engine:
              </div>

              {/* Command Pill */}
              <div
                style={{
                  background: '#090e1a',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '0.6rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  color: '#38bdf8',
                }}
              >
                <span>{currentStepData.expectedCommand || currentStepData.terminalSampleCommand}</span>
                <button
                  onClick={() => handleCopyCommand(currentStepData.expectedCommand || currentStepData.terminalSampleCommand)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  title="Copy command"
                >
                  <Copy size={14} />
                </button>
              </div>

              {/* Run Command Button */}
              <button
                onClick={runSampleAction}
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                }}
              >
                <Play size={16} fill="white" /> Run Command
              </button>

              {/* Navigation Controls: Next Step & Need a hint */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                <button
                  onClick={handleNextStep}
                  style={{
                    flex: 1,
                    background: '#1e293b',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#f8fafc',
                    padding: '0.65rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                  }}
                >
                  Next Step <ArrowRight size={14} />
                </button>

                <button
                  onClick={() => setHintLevel((prev) => (prev < 3 ? prev + 1 : 1))}
                  style={{
                    background: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#f59e0b',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <HelpCircle size={14} /> Hint
                </button>
              </div>

              {hintLevel > 0 && (
                <div style={{ fontSize: '0.78rem', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                  💡 {hintLevel === 1 ? currentStepData.hint1 : hintLevel === 2 ? currentStepData.hint2 : currentStepData.hint3}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Transition to Developer IDE Modal */}
      {showTransitionModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
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
              background: '#131d33',
              border: '2px solid #2563eb',
              borderRadius: '20px',
              maxWidth: '540px',
              width: '100%',
              padding: '2.5rem',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.25rem',
            }}
          >
            <div style={{ fontSize: '3rem' }}>🎉</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f8fafc', margin: 0 }}>
              You've Learned Git Foundations!
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.98rem', lineHeight: 1.6, margin: 0 }}>
              You understand the fundamental rhythm of Git: files on your desk, selective packing in the staging box, permanent snapshots in your timeline, and sharing with remote repositories.
            </p>

            <div style={{ display: 'flex', gap: '0.8rem', width: '100%', marginTop: '0.5rem' }}>
              <button
                onClick={() => {
                  setInstructionMode('intermediate');
                  setMode('ide');
                }}
                style={{
                  flex: 1,
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '0.9rem',
                  borderRadius: '8px',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                }}
              >
                Enter Developer IDE ➔
              </button>

              <button
                onClick={() => setMode('practice')}
                style={{
                  flex: 1,
                  background: '#1e293b',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#f8fafc',
                  padding: '0.9rem',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                }}
              >
                Guided Missions ➔
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
