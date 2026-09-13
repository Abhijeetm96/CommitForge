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
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

export const FocusLessonView: React.FC = () => {
  const { engine, repo, recordSkillEvidence, recordPrediction } = useApp();

  const [activeLessonId, setActiveLessonId] = useState<'add' | 'commit' | 'push' | null>('add');
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [isForgeOpen, setIsForgeOpen] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  // Local interactive scene state overrides
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [stagedFiles, setStagedFiles] = useState<string[]>([]);
  const [packetProgress, setPacketProgress] = useState<number>(0);

  const activeLesson = activeLessonId ? FOCUS_LESSONS[activeLessonId] : null;
  const currentScene: FocusScene | null = activeLesson ? activeLesson.scenes[currentSceneIndex] || null : null;

  // Reset interactive overrides when scene changes
  useEffect(() => {
    if (currentScene) {
      setSelectedFile(null);
      setStagedFiles([...currentScene.visualState.stagingFiles]);
      setPacketProgress(currentScene.visualState.packetTransfer?.progressPercent || 0);
      setIsForgeOpen(false);
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

  // Scene-specific interactive triggers
  const handleFileClick = (fileName: string) => {
    setSelectedFile(fileName);
    if (currentScene.actionType === 'select_file') {
      // Advance to prediction
      handleNextScene();
    }
  };

  const handleStageFile = (fileName: string) => {
    setStagedFiles(prev => (prev.includes(fileName) ? prev : [...prev, fileName]));
    // Synchronize with real GitEngine
    engine.execute('git add index.html');
    setTimeout(() => {
      handleNextScene();
    }, 400);
  };

  const handleTakeSnapshot = () => {
    // Synchronize with real GitEngine
    engine.execute('git commit -m "Add hero section"');
    setStagedFiles([]);
    setTimeout(() => {
      handleNextScene();
    }, 450);
  };

  const handleSendPacket = () => {
    setPacketProgress(100);
    // Real Git engine remote sync
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
    isSelected: selectedFile === f.name || f.isSelected,
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
      {/* ZONE 1: MINIMAL TOP BAR */}
      {/* ============================================================ */}
      <nav
        style={{
          height: '52px',
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
          title="Return to lesson topics or previous scene"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        {/* Center: Lesson Name and Scene X / Y */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>
            {currentScene.lessonTitle}
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              color: '#64748b',
              fontWeight: 700,
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '0.15rem 0.55rem',
              borderRadius: '999px',
              fontFamily: 'monospace',
            }}
          >
            Scene {currentScene.sceneNumber} / {currentScene.totalScenes}
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

      {/* Subtle Progress Bar */}
      <div style={{ height: '2px', background: 'rgba(255, 255, 255, 0.06)', width: '100%' }}>
        <div
          style={{
            height: '100%',
            width: `${(currentScene.sceneNumber / currentScene.totalScenes) * 100}%`,
            background: 'linear-gradient(90deg, #f05033, #38bdf8)',
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* ============================================================ */}
      {/* ZONE 2: CORE VISUAL STAGE (Physical Simulator) */}
      {/* ============================================================ */}
      <div
        style={{
          flex: '1 1 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.75rem 1.5rem',
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
          onFileClick={handleFileClick}
          onStageFile={handleStageFile}
          onTakeSnapshot={handleTakeSnapshot}
        />
      </div>

      {/* ============================================================ */}
      {/* ZONE 3: ONE QUESTION / ONE PRIMARY INTERACTION */}
      {/* ============================================================ */}
      <div
        style={{
          flexShrink: 0,
          background: 'rgba(15, 23, 42, 0.85)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '1.25rem 1.5rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Single Prominent Question */}
        <SceneQuestion
          question={currentScene.question}
          subQuestion={currentScene.subQuestion}
        />

        {/* Scene Type Specific Primary Interaction */}
        {currentScene.type === 'prediction' && currentScene.predictionChoices && (
          <PredictionInteraction
            choices={currentScene.predictionChoices}
            onCorrectAnswer={handlePredictionAnswer}
          />
        )}

        {currentScene.type === 'observe' && currentScene.stateComparison && (
          <div style={{ width: '100%', textAlign: 'center' }}>
            <StateTransition comparison={currentScene.stateComparison} />
            <button
              onClick={handleNextScene}
              style={{
                padding: '0.75rem 2rem',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                color: '#0f172a',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.95rem',
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

        {currentScene.type === 'understand' && (
          <TechnicalReveal
            mentalModelText={currentScene.mentalModelText}
            technicalTerm={currentScene.technicalTerm}
            technicalCommand={currentScene.technicalCommand}
            onProceedToTerminal={handleNextScene}
          />
        )}

        {currentScene.type === 'command' && (
          <LessonTerminalBridge
            expectedCommand={currentScene.technicalCommand || 'git status'}
            engine={engine}
            onSuccess={handleNextScene}
          />
        )}

        {(currentScene.type === 'situation' ||
          currentScene.type === 'interaction' ||
          currentScene.type === 'watch') && (
          <div style={{ textAlign: 'center' }}>
            {currentScene.actionType === 'move_to_staging' && (
              <button
                onClick={() => handleStageFile('index.html')}
                style={{
                  padding: '0.85rem 2.25rem',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 16px rgba(34, 197, 94, 0.35)',
                }}
              >
                <span>{currentScene.primaryActionLabel || 'Move to Staging 📦'}</span>
                <ArrowRight size={16} />
              </button>
            )}

            {currentScene.actionType === 'take_snapshot' && (
              <button
                onClick={handleTakeSnapshot}
                style={{
                  padding: '0.85rem 2.25rem',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #f05033 0%, #ea580c 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 16px rgba(240, 80, 51, 0.4)',
                }}
              >
                <span>{currentScene.primaryActionLabel || '📸 Take Snapshot'}</span>
                <ArrowRight size={16} />
              </button>
            )}

            {currentScene.actionType === 'send_packet' && (
              <button
                onClick={handleSendPacket}
                style={{
                  padding: '0.85rem 2.25rem',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 16px rgba(168, 85, 247, 0.4)',
                }}
              >
                <span>{currentScene.primaryActionLabel || '🚀 Send C3 to Remote'}</span>
                <ArrowRight size={16} />
              </button>
            )}

            {(currentScene.actionType === 'select_file' ||
              currentScene.actionType === 'next_scene' ||
              !currentScene.actionType) && (
              <button
                onClick={handleNextScene}
                style={{
                  padding: '0.8rem 2rem',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                  color: '#0f172a',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.95rem',
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};
