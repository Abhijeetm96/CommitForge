import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FIRST_10_MINUTES_STEPS, First10Step } from '../../data/first10Minutes';
import { ThreeAreaVisualizer } from '../visualizer/ThreeAreaVisualizer';
import { Terminal } from '../terminal/Terminal';
import { ForgeAvatar } from '../common/ForgeAvatar';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Copy,
  FileText,
  Camera,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  LifeBuoy,
  Lock,
  Check,
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

  const [hintLevel, setHintLevel] = useState<number>(0);
  const [selectedKnowledgeChoice, setSelectedKnowledgeChoice] = useState<'know' | 'not-sure' | null>(null);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [showTransitionModal, setShowTransitionModal] = useState(false);

  const currentStepData: First10Step =
    FIRST_10_MINUTES_STEPS.find((s) => s.step === first10Step) ||
    FIRST_10_MINUTES_STEPS[0];
  const isLastStep = first10Step === FIRST_10_MINUTES_STEPS.length;

  // Gated verification check
  const isStepCompleted = currentStepData.isComplete(repo, terminalHistory);

  const handleNextStep = () => {
    if (!isStepCompleted && first10Step >= 4 && first10Step !== 7) {
      // If task requires completion before continuing
      return;
    }

    if (!isLastStep) {
      setFirst10Step(first10Step + 1);
      setHintLevel(0);
      setSelectedKnowledgeChoice(null);
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
      setSelectedKnowledgeChoice(null);
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
    } else if (currentStepData.requiredActionType === 'editor') {
      const currentContent = repo.workingDirectory['index.html'] || '<h1>Hello World</h1>';
      const updated = currentContent.replace(/<h1>.*?<\/h1>/, '<h1>Welcome to My Coffee Shop!</h1>');
      updateEditorContent('index.html', updated);
      executeCommand('git status');
    }
  };

  const progressPercent = Math.round((first10Step / FIRST_10_MINUTES_STEPS.length) * 100);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        background: '#0b111e',
        color: '#f8fafc',
        height: 'calc(100vh - 60px)',
        overflow: 'hidden',
      }}
    >
      {/* Top Sub-Bar: Back button & Progress (Getting Started X / 12) */}
      <div
        style={{
          height: '48px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          background: '#0e172a',
          flexShrink: 0,
        }}
      >
        <button
          onClick={handlePrevStep}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.6rem',
            borderRadius: '6px',
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Centered Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '320px', maxWidth: '50%' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', whiteSpace: 'nowrap' }}>
            Getting Started
          </span>
          <div
            style={{
              flex: 1,
              height: '6px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '999px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: '#38bdf8',
                borderRadius: '999px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>
            {first10Step} / 12
          </span>
        </div>

        {/* Emergency I'm Lost Button */}
        <button
          onClick={() => setShowLostDrawer(true)}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <LifeBuoy size={14} color="#f05033" /> Need Help?
        </button>
      </div>

      {/* Main 3-Column Content Layout (Responsive) */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '240px 1fr 280px',
          overflow: 'hidden',
        }}
        className="learn-3col-grid"
      >
        {/* Column 1: Step Checklist Sidebar */}
        <div
          style={{
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            background: '#0e172a',
            padding: '1.25rem 1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
          }}
          className="learn-checklist-sidebar"
        >
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem',
              paddingLeft: '0.5rem',
            }}
          >
            Lessons
          </div>

          {FIRST_10_MINUTES_STEPS.map((s) => {
            const isCurrent = s.step === first10Step;
            const isCompleted = s.step < first10Step;
            return (
              <button
                key={s.step}
                onClick={() => setFirst10Step(s.step)}
                style={{
                  background: isCurrent ? '#2563eb' : 'transparent',
                  color: isCurrent ? '#ffffff' : isCompleted ? '#94a3b8' : '#64748b',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.82rem',
                  fontWeight: isCurrent ? 800 : 500,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  transition: 'background 0.15s ease',
                }}
              >
                {isCompleted ? (
                  <CheckCircle2 size={15} color="#10b981" />
                ) : (
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: isCurrent ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                    }}
                  >
                    {s.step}
                  </div>
                )}
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {s.title.replace(/\s*\(.*?\)/, '')}
                </span>
              </button>
            );
          })}
        </div>

        {/* Column 2: Center Interactive Content (Screen 2 / Screen 3 / Screen 4) */}
        <div
          style={{
            padding: '2rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem',
            maxWidth: '850px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          {/* If Task is Completed on commit/milestone step: Show Screen 3 (After Action - Visual Feedback) */}
          {isStepCompleted && currentStepData.step >= 11 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Success Banner */}
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid #10b981',
                  borderRadius: '12px',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: '#10b981',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#10b981',
                    color: '#0b111e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check size={16} strokeWidth={3} />
                </div>
                <span>Awesome! You just created a commit. Let's see what happened.</span>
              </div>

              {/* Before vs After Comparison */}
              <div
                className="before-after-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 1fr',
                  gap: '1rem',
                  alignItems: 'center',
                }}
              >
                {/* Before Card */}
                <div
                  style={{
                    background: '#131d33',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                    Before
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                    <FileText size={18} color="#94a3b8" />
                    <span>index.html</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 700 }}>
                    <span>Changed</span>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b' }} />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Git noticed the change
                  </div>
                </div>

                {/* Arrow */}
                <div style={{ color: '#38bdf8', fontSize: '1.5rem', fontWeight: 900 }}>➔</div>

                {/* After Card */}
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>
                    After
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#f8fafc' }}>
                    <CheckCircle2 size={18} color="#10b981" />
                    <span>Version 1</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 600 }}>
                    Your work is now saved as a commit.
                  </div>
                </div>
              </div>

              {/* The command used box */}
              <div
                style={{
                  background: '#131d33',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8rem',
                }}
              >
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8' }}>
                  The command used:
                </span>
                <div
                  style={{
                    background: '#090e1a',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontFamily: 'monospace',
                    fontSize: '0.92rem',
                    color: '#38bdf8',
                  }}
                >
                  <code>git commit -m "Save homepage"</code>
                  <button
                    onClick={() => handleCopyCommand('git commit -m "Save homepage"')}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    title="Copy command"
                  >
                    <Copy size={16} />
                  </button>
                </div>

                <button
                  onClick={handleNextStep}
                  style={{
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '0.85rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                    marginTop: '0.4rem',
                  }}
                >
                  Next: See the history →
                </button>
              </div>
            </div>
          ) : (
            /* Otherwise: Show Screen 2 (Concept First) */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Mission Header */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f05033', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  <Sparkles size={14} /> Your Mission
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', margin: '0.3rem 0 0.6rem' }}>
                  {currentStepData.title}
                </h1>
                <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                  {currentStepData.conceptBody}
                </p>
              </div>

              {/* Concept Visualization Card (Screen 2: Your project -> A saved version) */}
              <div
                className="concept-diagram-box"
                style={{
                  background: '#131d33',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '1.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2rem',
                }}
              >
                {/* Project File Card */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.6rem',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#cbd5e1',
                    }}
                  >
                    <FileText size={32} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                      Your project
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      (index.html changed)
                    </div>
                  </div>
                </div>

                {/* Green Transition Arrow */}
                <div style={{ color: '#10b981', fontSize: '1.8rem', fontWeight: 900 }}>➔</div>

                {/* Saved Version (Commit) Card */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.6rem',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle at 35% 30%, #38bdf8 0%, #1d4ed8 80%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)',
                    }}
                  >
                    <Camera size={30} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                      A saved version
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
                      (a commit)
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Reasoning Box ("What do you think we should do?") */}
              <div
                style={{
                  background: '#131d33',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#e2e8f0' }}>
                  What do you think we should do?
                </div>

                <div style={{ display: 'flex', gap: '0.85rem' }}>
                  <button
                    onClick={() => setSelectedKnowledgeChoice('know')}
                    style={{
                      flex: 1,
                      padding: '0.75rem 1rem',
                      background: selectedKnowledgeChoice === 'know' ? '#2563eb' : '#0e172a',
                      color: selectedKnowledgeChoice === 'know' ? '#ffffff' : '#94a3b8',
                      border: `1px solid ${selectedKnowledgeChoice === 'know' ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    I know
                  </button>

                  <button
                    onClick={() => {
                      setSelectedKnowledgeChoice('not-sure');
                      setHintLevel(1);
                    }}
                    style={{
                      flex: 1,
                      padding: '0.75rem 1rem',
                      background: selectedKnowledgeChoice === 'not-sure' ? 'rgba(245, 158, 11, 0.15)' : '#0e172a',
                      color: selectedKnowledgeChoice === 'not-sure' ? '#f59e0b' : '#94a3b8',
                      border: `1px solid ${selectedKnowledgeChoice === 'not-sure' ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    I'm not sure
                  </button>
                </div>

                {/* If user knows or is ready: Interactive Action Button */}
                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.4rem', alignItems: 'center' }}>
                  {currentStepData.requiredActionType === 'terminal' && (
                    <button
                      onClick={runSampleAction}
                      style={{
                        background: '#10b981',
                        color: '#062016',
                        border: 'none',
                        padding: '0.65rem 1.25rem',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <Play size={14} fill="#062016" /> {currentStepData.primaryActionLabel}
                    </button>
                  )}

                  {currentStepData.requiredActionType === 'editor' && (
                    <button
                      onClick={runSampleAction}
                      style={{
                        background: '#f05033',
                        color: 'white',
                        border: 'none',
                        padding: '0.65rem 1.25rem',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <Play size={14} /> {currentStepData.primaryActionLabel}
                    </button>
                  )}

                  {isStepCompleted && (
                    <span style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <CheckCircle2 size={16} /> Task Complete!
                    </span>
                  )}
                </div>
              </div>

              {/* If step 7 or later: Show Screen 4 (What Git Sees Visualizer) */}
              {first10Step >= 7 && (
                <div style={{ marginTop: '0.5rem' }}>
                  <ThreeAreaVisualizer />
                </div>
              )}

              {/* Embedded Terminal (when on terminal steps 3 to 6, or 9 to 12) */}
              {first10Step >= 3 && first10Step <= 6 && (
                <div style={{ height: '240px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <Terminal />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Column 3: Forge (Your Mentor) Card & Continue Button */}
        <div
          style={{
            borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
            background: '#0e172a',
            padding: '1.5rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
          className="learn-mentor-sidebar"
        >
          {/* Mentor Profile & Dialogue */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Header with Mascot Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <ForgeAvatar size={48} mood="happy" />
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc' }}>
                  Forge
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  Your Mentor
                </div>
              </div>
            </div>

            {/* Speech Dialogue Bubble */}
            <div
              style={{
                background: '#131d33',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '1rem',
                fontSize: '0.88rem',
                color: '#cbd5e1',
                lineHeight: 1.55,
                position: 'relative',
              }}
            >
              {isStepCompleted && currentStepData.step >= 11
                ? "That's it! You just saved your first version. A commit is like a photo of your project at this moment in time."
                : currentStepData.forgeMessage}
            </div>

            {/* Progressive Hint Button */}
            {!isStepCompleted && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={() => setHintLevel(prev => (prev < 3 ? prev + 1 : 1))}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#94a3b8',
                    padding: '0.55rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <HelpCircle size={14} color="#38bdf8" /> Give me a hint
                </button>

                {hintLevel > 0 && (
                  <div
                    style={{
                      background: 'rgba(56, 189, 248, 0.08)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      fontSize: '0.8rem',
                      color: '#38bdf8',
                      lineHeight: 1.45,
                    }}
                  >
                    💡 {hintLevel === 1 ? currentStepData.hint1 : hintLevel === 2 ? currentStepData.hint2 : currentStepData.hint3}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Primary Bottom Action CTA: Continue */}
          <div>
            <button
              onClick={handleNextStep}
              style={{
                width: '100%',
                background: isStepCompleted || first10Step < 4 || first10Step === 7 ? '#2563eb' : '#1e293b',
                color: isStepCompleted || first10Step < 4 || first10Step === 7 ? 'white' : '#64748b',
                border: 'none',
                padding: '0.9rem',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: isStepCompleted || first10Step < 4 || first10Step === 7 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                boxShadow: isStepCompleted ? '0 4px 14px rgba(37, 99, 235, 0.4)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {isStepCompleted || first10Step < 4 || first10Step === 7 ? (
                <>
                  Continue <ArrowRight size={18} />
                </>
              ) : (
                <>
                  <Lock size={15} /> Complete task first
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Transition to Developer IDE Modal (Point 27) */}
      {showTransitionModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.78)',
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
              You've Learned the Basics!
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.98rem', lineHeight: 1.6, margin: 0 }}>
              You understand the fundamental rhythm of Git: files on your desk, selective packing in the staging box, and permanent snapshot commits in your timeline.
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
                onClick={() => {
                  setMode('practice');
                }}
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
