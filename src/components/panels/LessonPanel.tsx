import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LESSONS } from '../../data/curriculum';
import {
  Lightbulb,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Key,
  Award,
  Zap,
  BookOpen,
  Target
} from 'lucide-react';

export const LessonPanel: React.FC = () => {
  const {
    currentLesson,
    setCurrentLessonId,
    completedLessonIds,
    markLessonComplete,
    instructionMode,
    repo,
    recordPrediction,
  } = useApp();

  const [activeHintIndex, setActiveHintIndex] = useState<number>(0);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [predictionAnswered, setPredictionAnswered] = useState<boolean>(false);
  const [selectedPrediction, setSelectedPrediction] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);

  const currentIndex = LESSONS.findIndex(l => l.id === currentLesson.id);
  const prevLesson = currentIndex > 0 ? LESSONS[currentIndex - 1] : null;
  const nextLesson = currentIndex < LESSONS.length - 1 ? LESSONS[currentIndex + 1] : null;

  const isCompleted = completedLessonIds.includes(currentLesson.id);
  const validationResult = currentLesson.validate(repo);

  // Auto-mark complete if validation passes
  if (validationResult.passed && !isCompleted) {
    markLessonComplete(currentLesson.id);
  }

  const handlePredictionSelect = (idx: number) => {
    if (predictionAnswered || !currentLesson.predict) return;
    setSelectedPrediction(idx);
    setPredictionAnswered(true);
    const isCorrect = idx === currentLesson.predict.correctIndex;
    recordPrediction(isCorrect);
  };

  const handleQuizSelect = (idx: number) => {
    if (quizAnswered) return;
    setSelectedQuiz(idx);
    setQuizAnswered(true);
  };

  // Determine which task prompt to show based on training wheel level
  const getTaskPrompt = () => {
    if (instructionMode === 'expert') return currentLesson.task.expertPrompt;
    if (instructionMode === 'advanced') return currentLesson.task.advancedPrompt;
    if (instructionMode === 'intermediate') return currentLesson.task.intermediatePrompt;
    return currentLesson.task.beginnerPrompt;
  };

  return (
    <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', padding: '1.2rem 1.5rem' }}>
      {/* Top Breadcrumb & Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--git-orange)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {currentLesson.levelTitle}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span className={`badge-mode ${currentLesson.difficulty.toLowerCase()}`}>
            {currentLesson.difficulty}
          </span>
          {isCompleted && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--success)', fontSize: '0.75rem', fontWeight: 700 }}>
              <CheckCircle2 size={13} /> Completed
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {prevLesson && (
            <button
              className="icon-btn"
              onClick={() => {
                setCurrentLessonId(prevLesson.id);
                setPredictionAnswered(false);
                setSelectedPrediction(null);
                setQuizAnswered(false);
                setSelectedQuiz(null);
                setShowSolution(false);
                setActiveHintIndex(0);
              }}
              title="Previous Lesson"
            >
              <ChevronLeft size={16} />
            </button>
          )}
          {nextLesson && (
            <button
              className="icon-btn"
              onClick={() => {
                setCurrentLessonId(nextLesson.id);
                setPredictionAnswered(false);
                setSelectedPrediction(null);
                setQuizAnswered(false);
                setSelectedQuiz(null);
                setShowSolution(false);
                setActiveHintIndex(0);
              }}
              title="Next Lesson"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Lesson Title */}
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
        {currentLesson.title}
      </h2>

      {/* Developer Mission Context */}
      <div style={{ background: 'rgba(56, 189, 248, 0.08)', borderLeft: '3px solid #38bdf8', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem' }}>
        <strong style={{ color: '#38bdf8' }}>🎯 Developer Mission:</strong> {currentLesson.mission}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        {/* Left Column: Concept & Predict */}
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Why This Matters
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              {currentLesson.whyItMatters}
            </p>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Core Concept
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              {currentLesson.concept}
            </p>
          </div>

          {/* Predict Step (Requirement 6) */}
          {currentLesson.predict && (
            <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.8rem', marginTop: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--git-orange)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <Zap size={14} /> Predict Before Executing:
              </div>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                {currentLesson.predict.question}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {currentLesson.predict.options.map((opt, oIdx) => {
                  let btnBg = 'var(--bg-surface)';
                  let btnBorder = 'var(--border-color)';
                  if (predictionAnswered) {
                    if (oIdx === currentLesson.predict!.correctIndex) {
                      btnBg = 'rgba(16, 185, 129, 0.2)';
                      btnBorder = 'var(--success)';
                    } else if (selectedPrediction === oIdx) {
                      btnBg = 'rgba(239, 68, 68, 0.2)';
                      btnBorder = 'var(--danger)';
                    }
                  }
                  return (
                    <button
                      key={oIdx}
                      disabled={predictionAnswered}
                      onClick={() => handlePredictionSelect(oIdx)}
                      style={{
                        textAlign: 'left',
                        padding: '0.4rem 0.6rem',
                        background: btnBg,
                        border: `1px solid ${btnBorder}`,
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-primary)',
                        fontSize: '0.8rem',
                        cursor: predictionAnswered ? 'default' : 'pointer',
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {predictionAnswered && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--git-cyan)' }}>
                  💡 {currentLesson.predict.explanation}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Hands-on Task, Hints & Solution */}
        <div>
          <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--git-orange)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Target size={15} /> Your Task:
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Mode: {instructionMode.toUpperCase()}
              </span>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.5', marginBottom: '0.8rem' }}>
              {getTaskPrompt()}
            </p>

            {/* Validation Feedback */}
            <div style={{
              padding: '0.5rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: validationResult.passed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.1)',
              color: validationResult.passed ? 'var(--success)' : 'var(--warning)',
              border: `1px solid ${validationResult.passed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
              marginBottom: '1rem',
            }}>
              {validationResult.passed ? '✅ ' : '⏳ '} {validationResult.message}
            </div>

            {/* Progressive Hints (Requirement 53) */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Need a clue?
                </span>
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  {currentLesson.hints.map((_, hIdx) => (
                    <button
                      key={hIdx}
                      onClick={() => setActiveHintIndex(hIdx)}
                      style={{
                        padding: '0.2rem 0.5rem',
                        fontSize: '0.75rem',
                        background: activeHintIndex === hIdx ? 'var(--git-orange)' : 'var(--bg-surface)',
                        color: activeHintIndex === hIdx ? 'white' : 'var(--text-muted)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                      }}
                    >
                      Hint {hIdx + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    style={{
                      padding: '0.2rem 0.5rem',
                      fontSize: '0.75rem',
                      background: showSolution ? 'var(--danger)' : 'var(--bg-surface)',
                      color: showSolution ? 'white' : 'var(--danger)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Solution
                  </button>
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                {showSolution ? (
                  <div>
                    <strong style={{ color: 'var(--danger)' }}>Solution Commands:</strong>
                    <pre style={{ marginTop: '0.3rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{currentLesson.solution}</pre>
                  </div>
                ) : (
                  <div>💡 {currentLesson.hints[activeHintIndex]}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
