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
} from 'lucide-react';

export const First10MinutesView: React.FC = () => {
  const {
    first10Step,
    setFirst10Step,
    openHumansTerm,
    setShowLostDrawer,
    setMode,
    executeCommand,
    updateEditorContent,
    repo,
  } = useApp();

  const [predictedIndex, setPredictedIndex] = useState<number | null>(null);
  const [showPredictFeedback, setShowPredictFeedback] = useState(false);
  const [showWhyModal, setShowWhyModal] = useState(false);

  const currentStepData: First10Step = FIRST_10_MINUTES_STEPS.find(s => s.step === first10Step) || FIRST_10_MINUTES_STEPS[0];
  const isLastStep = first10Step === FIRST_10_MINUTES_STEPS.length;

  const handleNextStep = () => {
    if (!isLastStep) {
      setFirst10Step(first10Step + 1);
      setPredictedIndex(null);
      setShowPredictFeedback(false);
    } else {
      setMode('dashboard');
    }
  };

  const handlePrevStep = () => {
    if (first10Step > 1) {
      setFirst10Step(first10Step - 1);
      setPredictedIndex(null);
      setShowPredictFeedback(false);
    }
  };

  const applySampleEdit = () => {
    if (currentStepData.editorTargetFile === 'index.html') {
      const currentContent = repo.workingDirectory['index.html'] || '<h1>Hello World</h1>';
      const updated = currentContent.replace(/<h1>.*?<\/h1>/, '<h1>Welcome to My Coffee Shop!</h1>');
      updateEditorContent('index.html', updated);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
      {/* Left Sidebar: Step Guidance & Mentor Dialogue */}
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
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            background: 'linear-gradient(135deg, rgba(240, 80, 51, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
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
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              <button
                onClick={() => setShowLostDrawer(true)}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: 'var(--danger-red)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '999px',
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}
              >
                <LifeBuoy size={11} /> 🆘 I'm Lost
              </button>
            </div>
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            {currentStepData.title}
          </h2>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            {currentStepData.subtitle}
          </div>

          {/* Progress Dots */}
          <div style={{ display: 'flex', gap: '4px', marginTop: '0.8rem' }}>
            {FIRST_10_MINUTES_STEPS.map(s => (
              <div
                key={s.step}
                onClick={() => setFirst10Step(s.step)}
                style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '2px',
                  background:
                    s.step === first10Step
                      ? 'var(--git-orange)'
                      : s.step < first10Step
                      ? 'var(--terminal-green)'
                      : 'var(--border-color)',
                  cursor: 'pointer',
                }}
                title={`Step ${s.step}: ${s.title}`}
              />
            ))}
          </div>
        </div>

        {/* Forge Senior Mentor Card */}
        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
          <div
            style={{
              background: 'var(--bg-app)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              display: 'flex',
              gap: '0.8rem',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--git-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                flexShrink: 0,
                boxShadow: '0 2px 8px var(--git-orange-glow)',
              }}
            >
              👨‍💻
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--git-orange)', textTransform: 'uppercase' }}>
                Forge • Senior Dev Mentor
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: '0.3rem 0 0', lineHeight: 1.5 }}>
                {currentStepData.forgeMessage}
              </p>
            </div>
          </div>

          {/* Concept Explanation */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              The Core Concept
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.4rem' }}>
              {currentStepData.conceptTitle}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {currentStepData.conceptBody}
            </p>
          </div>

          {/* Action Callout */}
          <div
            style={{
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.9rem 1rem',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Your Action Right Now
            </div>

            {currentStepData.requiredActionType === 'terminal' && currentStepData.expectedCommand && (
              <div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Type this command in the terminal:
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <code
                    style={{
                      background: 'var(--bg-terminal)',
                      color: 'var(--terminal-green)',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                    }}
                  >
                    {currentStepData.expectedCommand}
                  </code>
                  <button
                    onClick={() => executeCommand(currentStepData.expectedCommand!)}
                    style={{
                      background: 'var(--cyan)',
                      color: '#000',
                      border: 'none',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    Run It For Me
                  </button>
                </div>
              </div>
            )}

            {currentStepData.requiredActionType === 'editor' && (
              <div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Edit <code>{currentStepData.editorTargetFile}</code> in the code editor, or click:
                </div>
                <button
                  onClick={applySampleEdit}
                  style={{
                    background: 'var(--cyan)',
                    color: '#000',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Apply Sample Edit Automatically ✨
                </button>
              </div>
            )}

            {currentStepData.requiredActionType === 'inspect' && (
              <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                Look around your workspace. When you're ready, click "Next Step" below.
              </div>
            )}
          </div>

          {/* Predict Challenge (if present) */}
          {currentStepData.predictQuestion && (
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '0.9rem 1rem',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--warning-amber)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                🤔 Predict What Will Happen
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
                {currentStepData.predictQuestion.prompt}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {currentStepData.predictQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPredictedIndex(idx);
                      setShowPredictFeedback(true);
                    }}
                    style={{
                      background: predictedIndex === idx ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-app)',
                      border: `1px solid ${predictedIndex === idx ? 'var(--warning-amber)' : 'var(--border-color)'}`,
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.5rem 0.75rem',
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
                    background: predictedIndex === currentStepData.predictQuestion.correctIndex ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    border: `1px solid ${predictedIndex === currentStepData.predictQuestion.correctIndex ? 'var(--terminal-green)' : 'var(--danger-red)'}`,
                    fontSize: '0.82rem',
                  }}
                >
                  <strong style={{ color: predictedIndex === currentStepData.predictQuestion.correctIndex ? 'var(--terminal-green)' : 'var(--danger-red)' }}>
                    {predictedIndex === currentStepData.predictQuestion.correctIndex ? '✅ Correct!' : '💡 Good thought, but:'}
                  </strong>{' '}
                  {currentStepData.predictQuestion.explanation}
                </div>
              )}
            </div>
          )}

          {/* Why Explanation Toggle */}
          <button
            onClick={() => setShowWhyModal(!showWhyModal)}
            style={{
              background: 'transparent',
              border: '1px dashed var(--border-color)',
              color: 'var(--cyan)',
              padding: '0.5rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
            }}
          >
            <HelpCircle size={14} /> Why does Git do this? (Click to view breakdown)
          </button>

          {showWhyModal && (
            <div
              style={{
                background: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.8rem',
                fontSize: '0.82rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
              }}
            >
              <div><strong>What happened:</strong> {currentStepData.whyExplanation.whatHappened}</div>
              <div><strong>Why:</strong> {currentStepData.whyExplanation.why}</div>
              <div style={{ color: 'var(--terminal-green)' }}><strong>What changed:</strong> {currentStepData.whyExplanation.whatChanged}</div>
              <div style={{ color: 'var(--text-muted)' }}><strong>What did NOT change:</strong> {currentStepData.whyExplanation.whatDidNotChange}</div>
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <div
          style={{
            padding: '1rem 1.5rem',
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
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: first10Step === 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <ChevronLeft size={16} /> Back
          </button>

          <button
            onClick={handleNextStep}
            style={{
              background: 'var(--git-orange)',
              color: 'white',
              border: 'none',
              padding: '0.6rem 1.4rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 12px var(--git-orange-glow)',
            }}
          >
            {isLastStep ? 'Complete Mission 🎉' : 'Next Step'} <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Right Side: Interactive Live Environment */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Top: Three-Area Visualizer */}
        <div style={{ height: '38%', borderBottom: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <ThreeAreaVisualizer />
        </div>

        {/* Middle & Bottom: Editor and Terminal */}
        <div style={{ height: '62%', display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>
          <div style={{ borderRight: '1px solid var(--border-color)', height: '100%', overflow: 'hidden' }}>
            <CodeEditor />
          </div>
          <div style={{ height: '100%', overflow: 'hidden' }}>
            <Terminal />
          </div>
        </div>
      </div>
    </div>
  );
};
