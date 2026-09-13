import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FOCUS_LESSONS, FocusScene, PredictionChoice } from '../../data/focusLessonScenes';
import { PhysicalGitStage } from './PhysicalGitStage';
import { SceneQuestion } from './SceneQuestion';
import { PredictionInteraction } from './PredictionInteraction';
import { StateTransition } from './StateTransition';
import { TechnicalReveal } from './TechnicalReveal';
import { LessonTerminalBridge } from './LessonTerminalBridge';
import { ContextualForge } from './ContextualForge';
import { LessonTopicPicker } from './LessonTopicPicker';
import { ArrowLeft, ArrowRight, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const FocusLessonView: React.FC = () => {
  const { engine, repo, recordSkillEvidence, recordPrediction } = useApp();

  const [activeLessonId, setActiveLessonId] = useState<'add' | 'commit' | 'push' | null>('add');
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [isForgeOpen, setIsForgeOpen] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [showWhyExplanation, setShowWhyExplanation] = useState(false);

  // Local interactive scene state overrides
  const [stagedFiles, setStagedFiles] = useState<string[]>([]);
  const [packetProgress, setPacketProgress] = useState<number>(0);

  const activeLesson = activeLessonId ? FOCUS_LESSONS[activeLessonId] : null;
  const currentScene: FocusScene | null = activeLesson ? activeLesson.scenes[currentSceneIndex] || null : null;

  // Ensure repo is initialized when entering focus lessons
  useEffect(() => {
    if (!repo.initialized) {
      engine.execute('git init');
    }
  }, [repo.initialized, engine]);

  // Reset interactive overrides and why explanation when scene changes
  useEffect(() => {
    if (currentScene) {
      setStagedFiles([...currentScene.visualState.stagingFiles]);
      setPacketProgress(currentScene.visualState.packetTransfer?.progressPercent || 0);
      setIsForgeOpen(false);
      setShowWhyExplanation(false);
    }
  }, [currentSceneIndex, activeLessonId]);

  if (!activeLesson || !currentScene) {
    return (
      <LessonTopicPicker
        onSelectLesson={id => {
          setActiveLessonId(id);
          setCurrentSceneIndex(0);
        }}
        completedLessons={completedLessons}
      />
    );
  }

  // Navigation handlers
  const handleBack = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(prev => prev - 1);
    } else {
      setActiveLessonId(null);
    }
  };

  const handleNextScene = () => {
    if (currentSceneIndex < activeLesson.scenes.length - 1) {
      setCurrentSceneIndex(prev => prev + 1);
    } else {
      // Lesson complete! Record evidence
      if (!completedLessons.includes(activeLesson.id)) {
        setCompletedLessons(prev => [...prev, activeLesson.id]);
      }
      if (activeLesson.id === 'add') {
        recordSkillEvidence('staging', 'understood');
      } else if (activeLesson.id === 'commit') {
        recordSkillEvidence('commits', 'understood');
      } else if (activeLesson.id === 'push') {
        recordSkillEvidence('foundations', 'understood');
      }
      setActiveLessonId(null);
    }
  };

  // Direct physical manipulation handlers
  const handleStageFile = (fileName: string) => {
    setStagedFiles(prev => (prev.includes(fileName) ? prev : [...prev, fileName]));
    engine.execute(`git add ${fileName}`);
    setTimeout(() => {
      handleNextScene();
    }, 400);
  };

  const handleTakeSnapshot = () => {
    engine.execute('git commit -m "Add hero section"');
    setStagedFiles([]);
    setTimeout(() => {
      handleNextScene();
    }, 450);
  };

  const handleTransferCommit = () => {
    setPacketProgress(100);
    engine.execute('git push origin main');
    setTimeout(() => {
      handleNextScene();
    }, 600);
  };

  const handlePredictionAnswer = (choice: PredictionChoice) => {
    recordPrediction(choice.isCorrect);
    if (choice.isCorrect) {
      handleNextScene();
    }
  };

  // Compute visual state merging defaults and scene overrides
  const workingFiles = currentScene.visualState.workingFiles.map(f => ({
    ...f,
    status: stagedFiles.includes(f.name) ? ('staged' as const) : f.status,
  }));

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 60px)',
        minHeight: '600px',
        maxHeight: '100vh',
        background: '#0a0f1d',
        color: '#f8fafc',
        overflow: 'hidden',
      }}
    >
      {/* ============================================================ */}
      {/* ZONE 1: MINIMAL TOP BAR (Whisper-quiet, non-slideshow) */}
      {/* ============================================================ */}
      <nav
        style={{
          height: '48px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          background: 'rgba(10, 15, 29, 0.95)',
          flexShrink: 0,
        }}
      >
        {/* Left: Back button */}
        <button
          onClick={handleBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer',
            padding: '0.35rem 0.6rem',
            borderRadius: '6px',
            transition: 'color 0.15s ease',
          }}
          title="Return to lesson topics or previous step"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        {/* Center: Subtle Title only (No loud Scene 1 / 7 slideshow counter!) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f8fafc' }}>
            {activeLesson.conceptTitle}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>•</span>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
            {activeLesson.title}
          </span>
        </div>

        {/* Right: Contextual Forge (?) Button */}
        <ContextualForge
          hint={currentScene.hint}
          isOpen={isForgeOpen}
          onToggle={() => setIsForgeOpen(prev => !prev)}
          onClose={() => setIsForgeOpen(false)}
        />
      </nav>

      {/* Subtle Progress Line */}
      <div style={{ height: '2px', background: 'rgba(255, 255, 255, 0.04)', width: '100%' }}>
        <div
          style={{
            height: '100%',
            width: `${(currentScene.sceneNumber / currentScene.totalScenes) * 100}%`,
            background: 'linear-gradient(90deg, #f05033, #38bdf8)',
            transition: 'width 0.35s ease',
          }}
        />
      </div>

      {/* ============================================================ */}
      {/* ZONE 2: CORE VISUAL STAGE (Physical Interactive Simulator) */}
      {/* ============================================================ */}
      <div
        style={{
          flex: '1 1 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.5rem 1.5rem',
          overflow: 'hidden',
        }}
      >
        <PhysicalGitStage
          workingFiles={workingFiles}
          stagingFiles={stagedFiles}
          localCommits={currentScene.visualState.localCommits}
          remoteCommits={currentScene.visualState.remoteCommits}
          highlightZone={currentScene.visualState.highlightZone}
          cameraActive={currentScene.visualState.cameraActive}
          packetTransfer={
            currentScene.visualState.packetTransfer
              ? {
                  ...currentScene.visualState.packetTransfer,
                  progressPercent: packetProgress,
                }
              : undefined
          }
          isInSync={currentScene.visualState.isInSync || packetProgress === 100}
          onStageFile={handleStageFile}
          onTakeSnapshot={handleTakeSnapshot}
          onTransferCommit={handleTransferCommit}
        />
      </div>

      {/* ============================================================ */}
      {/* ZONE 3: ONE QUESTION / ONE ACTION (Strictly Mutually Staged!) */}
      {/* ============================================================ */}
      <div
        style={{
          flexShrink: 0,
          background: 'rgba(15, 23, 42, 0.88)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '1.1rem 1.5rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Single Question Header */}
        <SceneQuestion
          question={currentScene.question}
          subQuestion={currentScene.subQuestion}
        />

        {/* 1. PREDICTION SCENE: Only prediction options rendered */}
        {currentScene.type === 'prediction' && currentScene.predictionChoices && (
          <PredictionInteraction
            choices={currentScene.predictionChoices}
            onCorrectAnswer={handlePredictionAnswer}
          />
        )}

        {/* 2. INTERACTION SCENE: Physical manipulation only (NO competing buttons!) */}
        {currentScene.type === 'interaction' && (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '999px',
                padding: '0.4rem 1rem',
                color: '#38bdf8',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              <span>✋ Drag the object in the world above to perform the action</span>
            </div>
          </div>
        )}

        {/* 3. OBSERVE SCENE: State comparison diff */}
        {currentScene.type === 'observe' && currentScene.stateComparison && (
          <div style={{ width: '100%', textAlign: 'center' }}>
            <StateTransition comparison={currentScene.stateComparison} />
            <button
              onClick={handleNextScene}
              style={{
                padding: '0.7rem 2rem',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                color: '#0f172a',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)',
              }}
            >
              <span>{currentScene.primaryActionLabel || 'Continue'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* 4. UNDERSTAND SCENE: Bold mental model takeaway only */}
        {currentScene.type === 'understand' && (
          <TechnicalReveal
            mentalModelText={currentScene.mentalModelText}
            technicalTerm={currentScene.technicalTerm}
            technicalCommand={currentScene.technicalCommand}
            onProceedToTerminal={handleNextScene}
          />
        )}

        {/* 5. COMMAND SCENE: Terminal bridge prompt with progressive hints */}
        {currentScene.type === 'command' && (
          <LessonTerminalBridge
            expectedCommand={currentScene.technicalCommand || 'git status'}
            engine={engine}
            progressiveHints={currentScene.progressiveHints}
            onSuccess={handleNextScene}
          />
        )}

        {/* 6. SITUATION / WATCH SCENE: Simple Proceed Button */}
        {(currentScene.type === 'situation' || currentScene.type === 'watch') && (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleNextScene}
              style={{
                padding: '0.75rem 2rem',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                color: '#0f172a',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)',
              }}
            >
              <span>{currentScene.primaryActionLabel || 'Continue'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Quiet "Why did that happen?" toggleable causal explanation */}
        {currentScene.whyExplanation && (
          <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
            <button
              onClick={() => setShowWhyExplanation(prev => !prev)}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                transition: 'color 0.15s ease',
              }}
            >
              <HelpCircle size={13} />
              <span>Why did that happen?</span>
              {showWhyExplanation ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {showWhyExplanation && (
              <div
                style={{
                  marginTop: '0.4rem',
                  maxWidth: '560px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '0.5rem 0.85rem',
                  fontSize: '0.8rem',
                  color: '#94a3b8',
                  lineHeight: 1.45,
                  animation: 'fadeIn 0.15s ease-out',
                }}
              >
                {currentScene.whyExplanation}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
