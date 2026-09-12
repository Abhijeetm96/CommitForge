import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FIRST_10_MINUTES_STEPS, First10Step } from '../../data/first10Minutes';
import { ThreeAreaVisualizer } from '../visualizer/ThreeAreaVisualizer';
import { Terminal } from '../terminal/Terminal';
import { CodeEditor } from '../editor/CodeEditor';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  HelpCircle,
  Play,
  RotateCcw,
  BookOpen,
  LifeBuoy,
  Lock,
  ArrowRight,
  FileText,
  Eye,
  Info,
  Terminal as TerminalIcon,
} from 'lucide-react';

export const First10MinutesView: React.FC = () => {
  const {
    first10Step,
    setFirst10Step,
    openHumansTerm,
    setShowLostDrawer,
    setMode,
    setInstructionMode,
    executeCommand,
    updateEditorContent,
    repo,
    terminalHistory,
    lastEngineDiff,
    recordSkillEvidence,
  } = useApp();

  const [predictedIndex, setPredictedIndex] = useState<number | null>(null);
  const [showPredictFeedback, setShowPredictFeedback] = useState(false);
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [showTechDetails, setShowTechDetails] = useState(false);
  const [showTransitionModal, setShowTransitionModal] = useState(false);

  const currentStepData: First10Step =
    FIRST_10_MINUTES_STEPS.find((s) => s.step === first10Step) ||
    FIRST_10_MINUTES_STEPS[0];
  const isLastStep = first10Step === FIRST_10_MINUTES_STEPS.length;

  // Gated verification check
  const isStepCompleted = currentStepData.isComplete(repo, terminalHistory);

  const handleNextStep = () => {
    if (!isStepCompleted) return;
    if (!isLastStep) {
      setFirst10Step(first10Step + 1);
      setPredictedIndex(null);
      setShowPredictFeedback(false);
      setShowWhyModal(false);
      recordSkillEvidence('foundations', 'practiced');
    } else {
      recordSkillEvidence('foundations', 'mastered');
      setShowTransitionModal(true);
    }
  };

  const handlePrevStep = () => {
    if (first10Step > 1) {
      setFirst10Step(first10Step - 1);
      setPredictedIndex(null);
      setShowPredictFeedback(false);
      setShowWhyModal(false);
    }
  };

  const runPrimaryAction = () => {
    if (currentStepData.requiredActionType === 'terminal' && currentStepData.expectedCommand) {
      executeCommand(currentStepData.expectedCommand);
    } else if (currentStepData.requiredActionType === 'editor') {
      const currentContent = repo.workingDirectory['index.html'] || '<h1>Hello World</h1>';
      const updated = currentContent.replace(/<h1>.*?<\/h1>/, '<h1>Welcome to My Coffee Shop!</h1>');
      updateEditorContent('index.html', updated);
      executeCommand('git status');
    } else {
      handleNextStep();
    }
  };

  // Simple State Card Calculations (Point 9)
  const changedCount = Object.keys(repo.workingDirectory).length;
  const stagedCount = Object.keys(repo.index).length;
  const commitCount = Object.keys(repo.commits).length;
  const currentBranch = repo.head.type === 'branch' ? repo.head.ref : 'detached';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '440px 1fr', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
      {/* Left Column: Guidance, Dialogue, Single Primary Action */}
      <div
        style={{
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflowY: 'auto',
        }}
      >
        {/* Step Progress Header */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border-color)',
            background: 'linear-gradient(135deg, rgba(240, 80, 51, 0.1) 0%, rgba(6, 182, 212, 0.06) 100%)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: 'var(--git-orange)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Step {currentStepData.step} of {FIRST_10_MINUTES_STEPS.length}
            </span>
            <button
              onClick={() => setShowLostDrawer(true)}
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                color: 'var(--danger-red)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <LifeBuoy size={12} /> 🆘 I'm Lost
            </button>
          </div>

          <h1 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            {currentStepData.title}
          </h1>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: '1.25rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Senior Dev Mentor Bubble (Point 15: Concise, supportive) */}
          <div
            style={{
              background: 'rgba(240, 80, 51, 0.08)',
              border: '1px solid rgba(240, 80, 51, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '0.9rem',
              display: 'flex',
              gap: '0.8rem',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--git-orange)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                flexShrink: 0,
              }}
            >
              👨‍💻
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--git-orange)', textTransform: 'uppercase' }}>
                Forge • Senior Mentor
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginTop: '0.2rem', lineHeight: 1.5 }}>
                {currentStepData.forgeMessage}
              </div>
            </div>
          </div>

          {/* Core Concept (Point 6: Exactly one concept per step) */}
          <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Core Concept
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.4rem 0' }}>
              {currentStepData.conceptTitle}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {currentStepData.conceptBody}
            </p>
          </div>

          {/* Primary Action Card (Point 4 & 8: One obvious primary action) */}
          <div
            style={{
              background: isStepCompleted ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-app)',
              border: `1.5px solid ${isStepCompleted ? 'var(--terminal-green)' : 'var(--git-orange)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '1.1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: isStepCompleted ? 'var(--terminal-green)' : 'var(--git-orange)', textTransform: 'uppercase' }}>
                {isStepCompleted ? '✅ Task Completed' : 'Your Action Right Now'}
              </div>
              {!isStepCompleted && (
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {currentStepData.requiredActionType === 'terminal' ? 'Type in terminal or click below' : 'Action required'}
                </span>
              )}
            </div>

            {/* If task not yet complete, show primary action button */}
            {!isStepCompleted ? (
              <button
                onClick={runPrimaryAction}
                style={{
                  background: 'var(--git-orange)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px var(--git-orange-glow)',
                }}
              >
                <Play size={16} fill="white" /> {currentStepData.primaryActionLabel}
              </button>
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--terminal-green)', fontWeight: 700 }}>
                Great work! You can continue to the next step below.
              </div>
            )}
          </div>

          {/* Predict Challenge (Point 19 & 27) */}
          {currentStepData.predictQuestion && (
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '0.9rem',
              }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--warning-amber)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                🤔 Predict What Will Happen
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {currentStepData.predictQuestion.prompt}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {currentStepData.predictQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPredictedIndex(idx);
                      setShowPredictFeedback(true);
                      if (idx === currentStepData.predictQuestion?.correctIndex) {
                        recordSkillEvidence('foundations', 'understood');
                      }
                    }}
                    style={{
                      background: predictedIndex === idx ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-app)',
                      border: `1px solid ${predictedIndex === idx ? 'var(--warning-amber)' : 'var(--border-color)'}`,
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.45rem 0.7rem',
                      textAlign: 'left',
                      fontSize: '0.82rem',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                    }}
                  >
                    {String.fromCharCode(65 + idx)}. {opt}
                  </button>
                ))}
              </div>

              {showPredictFeedback && predictedIndex !== null && (
                <div
                  style={{
                    marginTop: '0.6rem',
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    background:
                      predictedIndex === currentStepData.predictQuestion.correctIndex
                        ? 'rgba(16, 185, 129, 0.15)'
                        : 'rgba(245, 158, 11, 0.15)',
                    fontSize: '0.82rem',
                  }}
                >
                  <strong>
                    {predictedIndex === currentStepData.predictQuestion.correctIndex
                      ? '✅ Correct! '
                      : '💡 Conceptual Insight: '}
                  </strong>
                  {currentStepData.predictQuestion.explanation}
                </div>
              )}
            </div>
          )}

          {/* Engine As Teacher: What Changed? (Point 18) */}
          {lastEngineDiff && (
            <div
              style={{
                background: 'var(--bg-app)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.9rem',
                fontSize: '0.82rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
              }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--cyan)', textTransform: 'uppercase' }}>
                💡 What Just Happened?
              </div>
              <div><strong>Result:</strong> {lastEngineDiff.whatHappened}</div>
              <div style={{ color: 'var(--terminal-green)' }}>
                <strong>What Changed:</strong> {lastEngineDiff.whatChanged.join(', ')}
              </div>
              <div style={{ color: 'var(--text-muted)' }}>
                <strong>What Did NOT Change:</strong> {lastEngineDiff.whatDidNotChange.join(', ')}
              </div>
            </div>
          )}

          {/* Why Explanation Toggle */}
          <button
            onClick={() => setShowWhyModal(!showWhyModal)}
            style={{
              background: 'transparent',
              border: '1px dashed var(--border-color)',
              color: 'var(--text-secondary)',
              padding: '0.45rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
            }}
          >
            <HelpCircle size={13} /> {showWhyModal ? 'Hide Explanation' : 'Why does Git work this way?'}
          </button>

          {showWhyModal && (
            <div
              style={{
                background: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.8rem',
                fontSize: '0.8rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.3rem',
              }}
            >
              <div><strong>What happened:</strong> {currentStepData.whyExplanation.whatHappened}</div>
              <div><strong>Why:</strong> {currentStepData.whyExplanation.why}</div>
            </div>
          )}
        </div>

        {/* Gated Navigation Footer (Point 9 & 13) */}
        <div
          style={{
            padding: '0.9rem 1.25rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg-app)',
          }}
        >
          <button
            onClick={handlePrevStep}
            disabled={first10Step === 1}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-color)',
              color: first10Step === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: first10Step === 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <ChevronLeft size={15} /> Back
          </button>

          {/* Gated Continue Button: Locked if step not completed! */}
          <button
            onClick={handleNextStep}
            disabled={!isStepCompleted}
            style={{
              background: isStepCompleted ? 'var(--terminal-green)' : 'var(--bg-surface)',
              color: isStepCompleted ? 'white' : 'var(--text-muted)',
              border: `1px solid ${isStepCompleted ? 'var(--terminal-green)' : 'var(--border-color)'}`,
              padding: '0.55rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: isStepCompleted ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: isStepCompleted ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            {isStepCompleted ? (
              <>
                {isLastStep ? 'Complete Mission 🎉' : 'Continue'} <ChevronRight size={16} />
              </>
            ) : (
              <>
                <Lock size={14} /> Complete Task First
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Column: Progressive Stage (Point 2 & 5) */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Simple State Card (Point 9) */}
        <div
          style={{
            padding: '0.6rem 1.25rem',
            background: 'var(--bg-app)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.82rem',
          }}
        >
          <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
            <span>📄 <strong>{changedCount}</strong> changed file(s)</span>
            <span>📦 <strong>{stagedCount}</strong> staged</span>
            <span>💾 <strong>{commitCount}</strong> saved snapshot(s)</span>
            <span>🌿 branch: <strong>{currentBranch}</strong></span>
          </div>

          <button
            onClick={() => setShowTechDetails(!showTechDetails)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {showTechDetails ? 'Hide technical details' : 'Show technical details'}
          </button>
        </div>

        {/* Technical Details Drawer if opened */}
        {showTechDetails && (
          <div
            style={{
              padding: '0.5rem 1.25rem',
              background: 'var(--bg-terminal)',
              borderBottom: '1px solid var(--border-color)',
              fontFamily: 'monospace',
              fontSize: '0.78rem',
              color: 'var(--terminal-green)',
              display: 'flex',
              gap: '1.5rem',
            }}
          >
            <span>HEAD: {repo.head.type === 'branch' ? repo.head.ref : repo.head.ref.substring(0, 7)}</span>
            <span>Index: {stagedCount === 0 ? 'clean' : `${stagedCount} staged`}</span>
            <span>Working Tree: {changedCount > 0 ? 'modified' : 'clean'}</span>
          </div>
        )}

        {/* Step-Specific Progressive Content (Point 5) */}
        {/* Steps 1 & 2: Clean concept & project introduction without terminal clutter */}
        {(first10Step === 1 || first10Step === 2) && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3rem',
              textAlign: 'center',
              background: 'var(--bg-surface)',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(240, 80, 51, 0.12)',
                border: '2px solid var(--git-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                marginBottom: '1.5rem',
              }}
            >
              {first10Step === 1 ? '⏳' : '📁'}
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 0.8rem 0' }}>
              {first10Step === 1 ? 'Git is Your Code Time Machine' : 'Your Website Project Files'}
            </h2>

            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '520px', lineHeight: 1.6, margin: '0 0 2rem 0' }}>
              {first10Step === 1
                ? 'Every time you reach a working milestone, Git saves a permanent snapshot. If an experiment goes wrong, you can travel backward with one click.'
                : 'Here are the source files sitting on your disk right now. Look at how clean they are before we turn on Git.'}
            </p>

            {first10Step === 2 && (
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {['index.html', 'style.css', 'script.js'].map((f) => (
                  <div
                    key={f}
                    style={{
                      background: 'var(--bg-app)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      fontWeight: 700,
                    }}
                  >
                    <FileText size={18} color="var(--git-orange)" />
                    {f}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleNextStep}
              style={{
                background: 'var(--git-orange)',
                color: 'white',
                border: 'none',
                padding: '0.8rem 2rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px var(--git-orange-glow)',
              }}
            >
              Continue to Step {first10Step + 1} <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Steps 3, 4, 5, 6: Terminal Focus (Point 11: clear terminal explanation) */}
        {(first10Step >= 3 && first10Step <= 6) && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            <div
              style={{
                padding: '0.6rem 1rem',
                background: 'var(--bg-surface)',
                borderBottom: '1px solid var(--border-color)',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <TerminalIcon size={14} color="var(--git-orange)" />
              <strong>Interactive Terminal:</strong> Type commands below or click the orange action button on the left.
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <Terminal />
            </div>
          </div>
        )}

        {/* Steps 7 to 12: The Three-Area Visualizer + Terminal / Editor */}
        {first10Step >= 7 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {/* Top: Three-Area Visualizer */}
            <div style={{ height: '40%', borderBottom: '1px solid var(--border-color)', overflow: 'hidden' }}>
              <ThreeAreaVisualizer />
            </div>

            {/* Bottom: Code Editor & Terminal Side by Side */}
            <div style={{ height: '60%', display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>
              <div style={{ borderRight: '1px solid var(--border-color)', height: '100%', overflow: 'hidden' }}>
                <CodeEditor />
              </div>
              <div style={{ height: '100%', overflow: 'hidden' }}>
                <Terminal />
              </div>
            </div>
          </div>
        )}
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
              background: 'var(--bg-surface)',
              border: '2px solid var(--git-orange)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '560px',
              width: '100%',
              padding: '2.5rem',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.25rem',
            }}
          >
            <div style={{ fontSize: '3.2rem' }}>🎉</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              You've Learned the Basics!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.6, margin: 0 }}>
              You understand the fundamental rhythm of Git: files on your desk, selective packing in the staging box, and permanent snapshot commits in your timeline.
            </p>
            <div
              style={{
                background: 'var(--bg-app)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                width: '100%',
                textAlign: 'left',
                fontSize: '0.85rem',
                color: 'var(--text-primary)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
              }}
            >
              <div style={{ fontWeight: 800, color: 'var(--terminal-green)', marginBottom: '0.2rem' }}>Skills Mastered:</div>
              <div>✓ 📄 Desk vs 📦 Packing Box vs 💾 Sealed Snapshot</div>
              <div>✓ 🔍 Inspection with <code>git status</code> & <code>git diff</code></div>
              <div>✓ 📦 Selective Staging with <code>git add &lt;file&gt;</code></div>
              <div>✓ 💾 Permanent Commit Milestones with <code>git commit</code></div>
              <div>✓ 📜 Timeline Navigation with <code>git log</code></div>
            </div>

            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.3rem' }}>
              Ready to work like a developer?
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
              This is where everything you've learned comes together.
            </p>

            <div style={{ display: 'flex', gap: '0.8rem', width: '100%', marginTop: '0.5rem' }}>
              <button
                onClick={() => {
                  setInstructionMode('intermediate');
                  setMode('ide');
                }}
                style={{
                  flex: 1,
                  background: 'var(--git-orange)',
                  color: 'white',
                  border: 'none',
                  padding: '0.9rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 14px var(--git-orange-glow)',
                }}
              >
                <TerminalIcon size={16} /> Enter Developer IDE ➔
              </button>

              <button
                onClick={() => {
                  setMode('practice');
                }}
                style={{
                  flex: 1,
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  padding: '0.9rem',
                  borderRadius: 'var(--radius-md)',
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
