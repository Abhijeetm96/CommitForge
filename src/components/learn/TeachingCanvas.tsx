import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TeachingStep, SliceState, STATUS_LINE_ANNOTATIONS } from '../../data/teacherSliceStory';
import { GitRepo } from '../../git-engine/types';
import { StateImpactDiff } from './StateImpactDiff';
import { SyntaxTokenBreakdown } from './SyntaxTokenBreakdown';
import { IndependentChallengeView } from './IndependentChallengeView';
import { KnowledgePillarsCard } from './KnowledgePillarsCard';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  FolderGit2,
  Box,
  Layers,
  Terminal as TerminalIcon,
  ShieldAlert,
  HelpCircle,
  X,
  Lock,
} from 'lucide-react';

interface Props {
  conceptId?: string;
  currentStep: TeachingStep;
  currentRepo: GitRepo;
  terminalInput: string;
  setTerminalInput: (val: string) => void;
  terminalHistory: { command: string; output: string[] }[];
  onTerminalSubmit: (e: React.FormEvent) => void;
  selectedPrediction: string | null;
  onSelectPrediction: (id: string) => void;
  predictionFeedback: string | null;
  selectedReflection: string | null;
  onSelectReflection: (id: string) => void;
  reflectionFeedback: string | null;
  commandHistoryLog: string[];
  terminalEndRef: React.RefObject<HTMLDivElement | null>;
  onResetChallenge: () => void;
  mistakeAttempts: number;
}

export const TeachingCanvas: React.FC<Props> = ({
  conceptId,
  currentStep,
  currentRepo,
  terminalInput,
  setTerminalInput,
  terminalHistory,
  onTerminalSubmit,
  selectedPrediction,
  onSelectPrediction,
  predictionFeedback,
  selectedReflection,
  onSelectReflection,
  reflectionFeedback,
  commandHistoryLog,
  terminalEndRef,
  onResetChallenge,
  mistakeAttempts,
}) => {
  const [activeStatusAnnotation, setActiveStatusAnnotation] = useState<{
    title: string;
    explanation: string;
  } | null>(null);

  // ---------------------------------------------------------------------------
  // 1. PROBLEM MOMENT: The Need for Save Points (No Terminal, No Jargon)
  // ---------------------------------------------------------------------------
  if (currentStep.id === SliceState.PROBLEM) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          maxWidth: '860px',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#38bdf8',
              fontSize: '0.78rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.5rem',
            }}
          >
            <Sparkles size={14} />
            <span>The Real-World Developer Dilemma</span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f8fafc', margin: '0 0 0.5rem 0' }}>
            Why does Git even exist?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '580px', margin: '0 auto', lineHeight: 1.5 }}>
            Every developer without version control has lived through this exact nightmare:
          </p>
        </div>

        {/* 3-DAY TIMELINE COMPARISON CARDS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            width: '100%',
            marginBottom: '2rem',
          }}
        >
          {/* MONDAY */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '8px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4ade80' }}>MONDAY</span>
              <span style={{ fontSize: '0.7rem', color: '#4ade80', background: 'rgba(34, 197, 94, 0.15)', padding: '0.1rem 0.35rem', borderRadius: '3px' }}>Working</span>
            </div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#f8fafc', fontWeight: 700 }}>Clean Portfolio</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.4 }}>
              You finish building a working version of your personal website. It looks great and works flawlessly.
            </p>
          </div>

          {/* TUESDAY */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '8px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b' }}>TUESDAY</span>
              <span style={{ fontSize: '0.7rem', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', padding: '0.1rem 0.35rem', borderRadius: '3px' }}>Tweaking</span>
            </div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#f8fafc', fontWeight: 700 }}>Layout Changes</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.4 }}>
              You decide to tweak colors and add a hero header. The code is in the middle of being changed.
            </p>
          </div>

          {/* WEDNESDAY */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '8px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ef4444' }}>WEDNESDAY</span>
              <span style={{ fontSize: '0.7rem', color: '#ef4444', background: 'rgba(239, 68, 68, 0.15)', padding: '0.1rem 0.35rem', borderRadius: '3px' }}>Broken!</span>
            </div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#f8fafc', fontWeight: 700 }}>Page Breaks</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.4 }}>
              One small syntax error breaks the whole page. You wish you could turn back the clock to Monday.
            </p>
          </div>
        </div>

        {/* REVELATION CALLOUT */}
        <div
          style={{
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '8px',
            padding: '1rem 1.5rem',
            textAlign: 'center',
            maxWidth: '650px',
          }}
        >
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.25rem' }}>
            The Git Solution
          </div>
          <div style={{ fontSize: '0.84rem', color: '#e2e8f0', lineHeight: 1.5 }}>
            Git creates reliable, permanent <strong>save points</strong> (milestones). Whenever something breaks, you can inspect what happened or restore any past working state cleanly.
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. DESK VS VAULT MOMENT (Visual Explanation of Working Tree vs Repository)
  // ---------------------------------------------------------------------------
  if (currentStep.id === SliceState.INITIAL_REPO_EXPLORED) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          maxWidth: '860px',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Foundational Mental Model
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f8fafc', margin: '0.3rem 0' }}>
            Your Computer Desk & The Permanent Vault
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', maxWidth: '540px', margin: '0 auto' }}>
            Git separates your daily workspace from your permanent history records.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
            width: '100%',
            maxWidth: '720px',
            marginBottom: '2rem',
          }}
        >
          {/* DESK: WORKING TREE */}
          <div
            style={{
              background: 'rgba(56, 189, 248, 0.06)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '10px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8' }}>
              <FileCode size={20} />
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>The Working Tree</h3>
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              "Your Physical Desk"
            </div>
            <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.84rem', lineHeight: 1.5 }}>
              The actual project files sitting on your computer disk that you open, edit, and run in your editor.
            </p>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.78rem', fontFamily: 'monospace', color: '#f8fafc' }}>
              portfolio/
              <br />
              ├── index.html
              <br />
              └── style.css
            </div>
          </div>

          {/* VAULT: REPOSITORY */}
          <div
            style={{
              background: 'rgba(34, 197, 94, 0.06)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '10px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4ade80' }}>
              <FolderGit2 size={20} />
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>The Git Repository</h3>
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              "The Permanent Vault"
            </div>
            <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.84rem', lineHeight: 1.5 }}>
              The hidden <code style={{ color: '#4ade80' }}>.git</code> directory where Git safely seals every milestone snapshot you ever take.
            </p>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.78rem', fontFamily: 'monospace', color: '#4ade80' }}>
              [C0] Initial website setup
              <br />
              <span style={{ color: '#64748b' }}>└─ Permanent base snapshot</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 3. PREDICTION MOMENT (State 7: PREDICT_STAGING)
  // ---------------------------------------------------------------------------
  if (currentStep.prediction) {
    return (
      <div
        style={{
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.5rem',
          maxWidth: '780px',
          margin: '0 auto',
          width: '100%',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            width: '100%',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '12px',
            padding: '1.75rem',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: '#38bdf8',
              fontWeight: 800,
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '0.5rem',
            }}
          >
            <Sparkles size={15} />
            <span>Developer Prediction Phase</span>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: '#f8fafc' }}>
            {currentStep.prediction.question}
          </h3>

          {currentStep.prediction.subtext && (
            <p style={{ color: '#94a3b8', fontSize: '0.84rem', margin: '0 0 1.25rem 0' }}>
              {currentStep.prediction.subtext}
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {currentStep.prediction.options.map((opt) => {
              const isSelected = selectedPrediction === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelectPrediction(opt.id)}
                  style={{
                    background: isSelected
                      ? opt.isCorrect
                        ? 'rgba(34, 197, 94, 0.15)'
                        : 'rgba(239, 68, 68, 0.15)'
                      : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected
                      ? opt.isCorrect
                        ? '1px solid #22c55e'
                        : '1px solid #ef4444'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#f8fafc',
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.86rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{opt.text}</span>
                  {isSelected &&
                    (opt.isCorrect ? (
                      <CheckCircle2 size={18} color="#22c55e" />
                    ) : (
                      <AlertTriangle size={18} color="#ef4444" />
                    ))}
                </button>
              );
            })}
          </div>

          {predictionFeedback && (
            <div
              style={{
                marginTop: '1.25rem',
                padding: '0.85rem 1rem',
                background: 'rgba(56, 189, 248, 0.08)',
                borderLeft: '3px solid #38bdf8',
                borderRadius: '0 6px 6px 0',
                fontSize: '0.84rem',
                color: '#cbd5e1',
                lineHeight: 1.45,
              }}
            >
              {predictionFeedback}
            </div>
          )}
        </div>

        {/* 5-PILLAR KNOWLEDGE REFERENCE (DEFINITION, SYNTAX, VARIATIONS, EXAMPLES, EXPLANATIONS) */}
        <div style={{ width: '100%', marginTop: '1.25rem' }}>
          <KnowledgePillarsCard
            conceptId={conceptId || currentStep.id}
            onApplyCommand={setTerminalInput}
            compact={true}
          />
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 4. INDEPENDENT CHALLENGE MOMENT (State 17)
  // ---------------------------------------------------------------------------
  if (currentStep.id === SliceState.INDEPENDENT_CHALLENGE) {
    return (
      <IndependentChallengeView
        repo={currentRepo}
        commandHistory={commandHistoryLog}
        terminalOutput={terminalHistory}
        terminalInput={terminalInput}
        onInputChange={setTerminalInput}
        onSubmitCommand={onTerminalSubmit}
        terminalEndRef={terminalEndRef}
        onResetChallenge={onResetChallenge}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // 5. REFLECTION / MASTERY GATE MOMENT (States 9, 12, 16, 18)
  // If the step has a reflection question and NO terminal action
  // ---------------------------------------------------------------------------
  if (currentStep.reflection && !currentStep.expectedCommand) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          maxWidth: '720px',
          margin: '0 auto',
          overflowY: 'auto',
        }}
      >
        {/* WHAT CHANGED DIFF IF AVAILABLE */}
        {currentStep.stateDiff && (
          <div style={{ width: '100%', marginBottom: '1.5rem' }}>
            <StateImpactDiff diff={currentStep.stateDiff} />
          </div>
        )}

        <div
          style={{
            width: '100%',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '12px',
            padding: '1.75rem',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div
            style={{
              color: '#38bdf8',
              fontWeight: 800,
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '0.5rem',
            }}
          >
            Conceptual Understanding Check
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1.25rem 0', color: '#f8fafc' }}>
            {currentStep.reflection.question}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {currentStep.reflection.options.map((opt) => {
              const isSelected = selectedReflection === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelectReflection(opt.id)}
                  style={{
                    background: isSelected
                      ? opt.isCorrect
                        ? 'rgba(34, 197, 94, 0.15)'
                        : 'rgba(239, 68, 68, 0.15)'
                      : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected
                      ? opt.isCorrect
                        ? '1px solid #22c55e'
                        : '1px solid #ef4444'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#f8fafc',
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.86rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{opt.text}</span>
                  {isSelected &&
                    (opt.isCorrect ? (
                      <CheckCircle2 size={18} color="#22c55e" />
                    ) : (
                      <AlertTriangle size={18} color="#ef4444" />
                    ))}
                </button>
              );
            })}
          </div>

          {reflectionFeedback && (
            <div
              style={{
                marginTop: '1.25rem',
                padding: '0.85rem 1rem',
                background: 'rgba(56, 189, 248, 0.08)',
                borderLeft: '3px solid #38bdf8',
                borderRadius: '0 6px 6px 0',
                fontSize: '0.84rem',
                color: '#cbd5e1',
                lineHeight: 1.45,
              }}
            >
              {reflectionFeedback}
            </div>
          )}
        </div>

        {/* 5-PILLAR KNOWLEDGE REFERENCE */}
        <div style={{ width: '100%', marginTop: '1.25rem' }}>
          <KnowledgePillarsCard
            conceptId={conceptId || currentStep.id}
            onApplyCommand={setTerminalInput}
            compact={true}
          />
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 6. TERMINAL MOMENTS: When learner executes commands
  // (Status, Diff, Add, Commit, Restore)
  // ---------------------------------------------------------------------------
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem 1.5rem',
        gap: '0.85rem',
        overflow: 'hidden',
        maxWidth: '1000px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* 5-PILLAR KNOWLEDGE EXPLORER: DEFINITION, SYNTAX, VARIATIONS, EXAMPLES, EXPLANATIONS */}
      <KnowledgePillarsCard
        conceptId={conceptId || currentStep.id}
        onApplyCommand={setTerminalInput}
        compact={false}
      />

      {/* SYNTAX EXPLORER (Shown if step provides syntax breakdown for canonical slice) */}
      {currentStep.syntaxBreakdown && !conceptId && (
        <SyntaxTokenBreakdown
          tokens={currentStep.syntaxBreakdown}
          variations={currentStep.variations}
        />
      )}

      {/* DANGER CALLOUT FOR .ENV (State 13, 14) */}
      {currentStep.id === SliceState.ENV_ACCIDENTALLY_STAGED && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}
        >
          <ShieldAlert size={18} color="#ef4444" />
          <div style={{ fontSize: '0.8rem', color: '#fca5a5' }}>
            <strong>Security Warning:</strong> Simulated secret keys were staged in <code style={{ color: '#fff' }}>.env</code>.
            Do not commit! We will safely unstage this file next.
          </div>
        </div>
      )}

      {/* TERMINAL BOX */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: '#050811',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '8px',
          overflow: 'hidden',
          minHeight: '220px',
        }}
      >
        {/* TERMINAL BAR */}
        <div
          style={{
            padding: '0.45rem 0.85rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.74rem', fontWeight: 700 }}>
            <TerminalIcon size={13} />
            <span>Developer Terminal</span>
          </div>

          {currentStep.expectedCommand && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600 }}>
                Target command:
              </span>
              <code style={{ color: '#f8fafc', background: 'rgba(56, 189, 248, 0.12)', padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                {currentStep.expectedCommand}
              </code>
              <button
                type="button"
                onClick={() => setTerminalInput(currentStep.expectedCommand || '')}
                style={{
                  background: 'rgba(245, 158, 11, 0.18)',
                  border: '1px solid #f59e0b',
                  color: '#fbbf24',
                  borderRadius: '4px',
                  padding: '0.15rem 0.5rem',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
                title="Fill command into terminal"
              >
                🪄 Fill
              </button>
            </div>
          )}
        </div>

        {/* OUTPUT STREAM WITH CLICKABLE ANNOTATIONS */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0.85rem',
            fontFamily: 'monospace',
            fontSize: '0.82rem',
            lineHeight: 1.5,
            color: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          {terminalHistory.length === 0 && (
            <div style={{ color: '#475569', fontStyle: 'italic' }}>
              Ready. Type the command below to inspect or change the repository.
            </div>
          )}

          {terminalHistory.map((item, idx) => (
            <div key={idx}>
              <div style={{ color: '#38bdf8' }}>$ {item.command}</div>
              <div style={{ color: '#cbd5e1', whiteSpace: 'pre-wrap', paddingLeft: '0.5rem' }}>
                {item.output.map((line, lineIdx) => {
                  // Check if this line has a clickable annotation
                  const trimmed = line.trim();
                  const annotationKey = Object.keys(STATUS_LINE_ANNOTATIONS).find((key) =>
                    trimmed.includes(key)
                  );
                  const annotation = annotationKey ? STATUS_LINE_ANNOTATIONS[annotationKey] : null;

                  if (annotation) {
                    return (
                      <div
                        key={lineIdx}
                        onClick={() => setActiveStatusAnnotation(annotation)}
                        style={{
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: 'rgba(56, 189, 248, 0.08)',
                          padding: '0.1rem 0.35rem',
                          borderRadius: '3px',
                          border: '1px dotted #38bdf8',
                          margin: '0.1rem 0',
                        }}
                        title="Click to see what this line means"
                      >
                        <span>{line}</span>
                        <HelpCircle size={11} color="#38bdf8" />
                      </div>
                    );
                  }

                  // Standard line coloring (diff highlights)
                  const isDiffAdd = line.startsWith('+') && !line.startsWith('+++');
                  const isDiffDel = line.startsWith('-') && !line.startsWith('---');

                  return (
                    <div
                      key={lineIdx}
                      style={{
                        color: isDiffAdd ? '#4ade80' : isDiffDel ? '#f87171' : 'inherit',
                      }}
                    >
                      {line}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* CLICKABLE ANNOTATION POPOVER CARD */}
        {activeStatusAnnotation && (
          <div
            style={{
              padding: '0.65rem 0.85rem',
              background: 'rgba(15, 23, 42, 0.95)',
              borderTop: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '0.5rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
                Git Status Breakdown: {activeStatusAnnotation.title}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#e2e8f0', marginTop: '0.15rem' }}>
                {activeStatusAnnotation.explanation}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveStatusAnnotation(null)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* PROGRESSIVE SENIOR DEV HINTS */}
        {mistakeAttempts > 0 && currentStep.commandHints && (
          <div
            style={{
              padding: '0.4rem 0.85rem',
              background: 'rgba(240, 80, 51, 0.1)',
              borderTop: '1px solid rgba(240, 80, 51, 0.3)',
              fontSize: '0.75rem',
              color: '#fca5a5',
            }}
          >
            💡 Senior Dev Hint:{' '}
            {currentStep.commandHints[
              Math.min(mistakeAttempts - 1, currentStep.commandHints.length - 1)
            ]}
          </div>
        )}

        {/* INPUT FORM */}
        <form
          onSubmit={onTerminalSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 0.85rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            background: '#070b14',
          }}
        >
          <span style={{ color: '#38bdf8', fontFamily: 'monospace', fontWeight: 800 }}>$</span>
          <input
            type="text"
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            placeholder={
              currentStep.expectedCommand
                ? `Type \`${currentStep.expectedCommand}\``
                : 'Enter git command...'
            }
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#f8fafc',
              fontFamily: 'monospace',
              fontSize: '0.84rem',
            }}
          />
          <button
            type="submit"
            style={{
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              color: '#38bdf8',
              padding: '0.35rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Run
          </button>
        </form>
      </div>
    </div>
  );
};
