// src/platform/lesson-runtime/UniversalLessonRuntime.tsx
import React, { useState } from 'react';
import { UniversalLesson, PedagogicalStepId, PedagogicalStepConfig } from './types';
import { SyntaxExplorer } from '../components/SyntaxExplorer';
import { BlockDiagramRenderer } from '../components/BlockDiagramRenderer';
import { MistakeRecoveryBox } from '../components/MistakeRecoveryBox';
import { UniversalTerminal, UniversalTerminalHandle } from '../terminal/UniversalTerminal';
import { RuntimeAdapter } from '../terminal/types';

const PEDAGOGICAL_STEPS: PedagogicalStepConfig[] = [
  { id: 'problem', stepNumber: 1, label: 'The Problem', shortTitle: 'Problem', icon: '❓' },
  { id: 'concept', stepNumber: 2, label: 'The Concept', shortTitle: 'Concept', icon: '💡' },
  { id: 'visual', stepNumber: 3, label: 'Visual Model', shortTitle: 'Diagram', icon: '📐' },
  { id: 'terminology', stepNumber: 4, label: 'Terminology', shortTitle: 'Terms', icon: '📖' },
  { id: 'syntax', stepNumber: 5, label: 'Syntax Breakdown', shortTitle: 'Syntax', icon: '⚡' },
  { id: 'variations', stepNumber: 6, label: 'Variations & Why', shortTitle: 'Variations', icon: '🔀' },
  { id: 'scenario', stepNumber: 7, label: 'Real Scenario', shortTitle: 'Scenario', icon: '💼' },
  { id: 'simulation', stepNumber: 8, label: 'Interactive Simulation', shortTitle: 'Simulator', icon: '⚙️' },
  { id: 'cause_effect', stepNumber: 9, label: 'Cause & Effect', shortTitle: 'Cause/Effect', icon: '🔄' },
  { id: 'terminal', stepNumber: 10, label: 'Real Terminal', shortTitle: 'Terminal', icon: '💻' },
  { id: 'mistake', stepNumber: 11, label: 'Safe Mistake', shortTitle: 'Mistake', icon: '⚠️' },
  { id: 'recovery', stepNumber: 12, label: 'Recovery Path', shortTitle: 'Recovery', icon: '🛠️' },
  { id: 'challenge', stepNumber: 13, label: 'Challenge Task', shortTitle: 'Challenge', icon: '🎯' },
  { id: 'mastery', stepNumber: 14, label: 'Concept Mastery', shortTitle: 'Mastery', icon: '🏆' },
];

interface UniversalLessonRuntimeProps {
  lesson: UniversalLesson;
  adapter: RuntimeAdapter;
  onNextLesson?: () => void;
  onPrevLesson?: () => void;
  renderTechnologySimulation?: () => React.ReactNode;
}

export const UniversalLessonRuntime: React.FC<UniversalLessonRuntimeProps> = ({
  lesson,
  adapter,
  onNextLesson,
  onPrevLesson,
  renderTechnologySimulation,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [techExplanationMode, setTechExplanationMode] = useState<boolean>(false);
  const [activeScenarioTab, setActiveScenarioTab] = useState<'beginner' | 'realDev' | 'production'>('beginner');
  const [challengeCompleted, setChallengeCompleted] = useState<boolean>(false);
  const [challengeInput, setChallengeInput] = useState<string>('');
  const [showHintIndex, setShowHintIndex] = useState<number>(-1);
  const [selectedTermIndex, setSelectedTermIndex] = useState<number>(0);

  const terminalRef = React.useRef<UniversalTerminalHandle>(null);

  const currentStep = PEDAGOGICAL_STEPS[currentStepIndex];
  const totalSteps = PEDAGOGICAL_STEPS.length;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else if (onNextLesson) {
      onNextLesson();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    } else if (onPrevLesson) {
      onPrevLesson();
    }
  };

  const handleSendToTerminal = (cmd: string) => {
    // Jump to terminal step and execute
    setCurrentStepIndex(9); // terminal step index
    setTimeout(() => {
      terminalRef.current?.executeCommand(cmd);
    }, 150);
  };

  const verifyChallenge = () => {
    const cleanUser = challengeInput.trim().replace(/\s+/g, ' ');
    const cleanSolution = lesson.challenge.solutionCommand.trim().replace(/\s+/g, ' ');
    if (cleanUser === cleanSolution || cleanUser.endsWith(cleanSolution)) {
      setChallengeCompleted(true);
    } else {
      alert(`Not quite right! Expected: ${lesson.challenge.solutionCommand}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      {/* Top Header & Breadcrumbs */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-6 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {lesson.technology.toUpperCase()}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">
                  Topic {lesson.topicNumber}: {lesson.topicTitle}
                </span>
                <span className="text-xs text-slate-600">•</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {lesson.difficulty}
                </span>
              </div>
              <h1 className="text-base md:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                {lesson.title}
                <code className="text-xs font-mono font-normal text-cyan-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {lesson.command}
                </code>
              </h1>
            </div>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold text-slate-300">
                Step {currentStep.stepNumber} of {totalSteps}:{' '}
                <span className="text-indigo-400">{currentStep.label}</span>
              </span>
              <div className="w-36 h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0 && !onPrevLesson}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-xs font-medium transition-all"
              >
                ◀ Prev
              </button>
              <button
                onClick={handleNextStep}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1"
              >
                <span>{currentStepIndex === totalSteps - 1 ? 'Finish Lesson' : 'Next Step'}</span>
                <span>▶</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Progressive Step Breadcrumb Nav */}
      <nav className="bg-slate-900/60 border-b border-slate-800/80 px-6 py-2 overflow-x-auto scrollbar-thin">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          {PEDAGOGICAL_STEPS.map((step, idx) => {
            const isActive = idx === currentStepIndex;
            const isCompleted = idx < currentStepIndex;

            return (
              <button
                key={step.id}
                onClick={() => setCurrentStepIndex(idx)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                    : isCompleted
                    ? 'bg-slate-800/90 text-slate-300 hover:text-white'
                    : 'text-slate-500 hover:text-slate-400'
                }`}
              >
                <span>{step.icon}</span>
                <span>{step.shortTitle}</span>
                {isCompleted && <span className="text-[10px] text-emerald-400 font-bold">✓</span>}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Single-Focused Pedagogical Viewport */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8 space-y-6">
        {/* STEP 1: THE PROBLEM */}
        {currentStep.id === 'problem' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 shadow-2xl">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                Step 1 • The Real-World Problem
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Why was <code className="text-cyan-400 font-mono">{lesson.command}</code> invented?
              </h2>
              <p className="text-base text-slate-300 leading-relaxed mb-6 font-medium">
                {lesson.problemItSolves}
              </p>

              <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-6">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  The Friction Before This Existed:
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{lesson.whyDoWeNeedIt}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/30">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                    When You Use It
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    {lesson.whenToUse.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/30">
                  <div className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">
                    When NOT To Use It
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    {lesson.whenNotToUse.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: THE CONCEPT */}
        {currentStep.id === 'concept' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  Step 2 • Conceptual Mental Model
                </div>
                <button
                  onClick={() => setTechExplanationMode(!techExplanationMode)}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                >
                  {techExplanationMode ? 'Show Simple Plain English' : 'Show Technical Depth'}
                </button>
              </div>

              <h2 className="text-2xl font-bold text-white mb-4">{lesson.title}</h2>

              {/* Simple vs Technical toggle */}
              {!techExplanationMode ? (
                <div className="space-y-4">
                  <div className="p-6 rounded-xl bg-gradient-to-r from-cyan-950/30 to-indigo-950/30 border border-cyan-800/40">
                    <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                      In Simple Words:
                    </div>
                    <p className="text-base text-slate-100 leading-relaxed font-medium">
                      {lesson.inSimpleWords}
                    </p>
                  </div>
                  <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                      Beginner Explanation:
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {lesson.beginnerExplanation}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-6 rounded-xl bg-slate-950 border border-indigo-800/40">
                    <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                      Formal Specification & Engine Reality:
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed font-mono">
                      {lesson.technicalExplanation}
                    </p>
                  </div>
                  <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Formal Definition:
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{lesson.definition}</p>
                  </div>
                </div>
              )}

              {/* Real World Analogy Card */}
              <div className="mt-6 p-5 rounded-xl bg-amber-950/20 border border-amber-900/30">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                  <span>💡</span>
                  Real-World Metaphor: {lesson.realWorldAnalogy.metaphor}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lesson.realWorldAnalogy.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: VISUAL MODEL (BLOCK DIAGRAM) */}
        {currentStep.id === 'visual' && (
          <div className="space-y-4 animate-fadeIn">
            <BlockDiagramRenderer diagram={lesson.visualDiagram} />
          </div>
        )}

        {/* STEP 4: TERMINOLOGY BREAKDOWN */}
        {currentStep.id === 'terminology' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                Step 4 • Essential Terminology
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Understand the vocabulary before executing
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Click any term to inspect plain-English vs technical engine meaning.
              </p>

              {/* Term Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {lesson.terminology.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTermIndex(idx)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedTermIndex === idx
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {t.term}
                  </button>
                ))}
              </div>

              {/* Selected Term Details */}
              {lesson.terminology[selectedTermIndex] && (
                <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-cyan-300 font-mono">
                      {lesson.terminology[selectedTermIndex].term}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
                        In Plain English
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {lesson.terminology[selectedTermIndex].simpleDef}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
                        Technical Definition
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {lesson.terminology[selectedTermIndex].technicalDef}
                      </p>
                    </div>
                  </div>

                  {lesson.terminology[selectedTermIndex].analogy && (
                    <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-900/30 text-xs text-amber-200">
                      <strong className="text-amber-400">Analogy: </strong>
                      {lesson.terminology[selectedTermIndex].analogy}
                    </div>
                  )}

                  {lesson.terminology[selectedTermIndex].confusionNote && (
                    <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-900/30 text-xs text-rose-200">
                      <strong className="text-rose-400">Don't confuse with: </strong>
                      {lesson.terminology[selectedTermIndex].confusionNote}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 5: SYNTAX BREAKDOWN */}
        {currentStep.id === 'syntax' && (
          <div className="space-y-4 animate-fadeIn">
            <SyntaxExplorer
              command={lesson.syntax.command}
              tokens={lesson.syntax.tokens}
              variations={lesson.syntax.variations}
              onRunVariation={handleSendToTerminal}
            />
          </div>
        )}

        {/* STEP 6: VARIATIONS & WHY */}
        {currentStep.id === 'variations' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                Step 6 • Syntax Variations & Why They Exist
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Compare command patterns side-by-side
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Understand what changes in behavior when options or flags are added.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lesson.syntax.variations.map((v, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1.5">{v.title}</h4>
                      <code className="block font-mono text-xs text-cyan-300 bg-slate-900 p-2.5 rounded border border-slate-800 mb-3">
                        {v.syntax}
                      </code>
                      <p className="text-xs text-slate-300 leading-relaxed mb-3">
                        {v.explanation}
                      </p>
                    </div>
                    <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-[11px] text-slate-400">
                      <span>
                        <strong className="text-slate-300">When:</strong> {v.whenToUse}
                      </span>
                      <button
                        onClick={() => handleSendToTerminal(v.syntax)}
                        className="px-2 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-[10px]"
                      >
                        Try in Shell ➜
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: REAL SCENARIO */}
        {currentStep.id === 'scenario' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                Step 7 • Realistic Scenarios
              </div>
              <h2 className="text-xl font-bold text-white mb-4">
                How developers apply this on the job
              </h2>

              {/* Scenario Tabs */}
              <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3">
                <button
                  onClick={() => setActiveScenarioTab('beginner')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeScenarioTab === 'beginner'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Beginner Context
                </button>
                <button
                  onClick={() => setActiveScenarioTab('realDev')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeScenarioTab === 'realDev'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Real Developer Problem
                </button>
                <button
                  onClick={() => setActiveScenarioTab('production')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeScenarioTab === 'production'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Production Workload
                </button>
              </div>

              {/* Tab Contents */}
              {activeScenarioTab === 'beginner' && (
                <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <h3 className="text-base font-bold text-emerald-400">
                    {lesson.scenarios.beginner.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lesson.scenarios.beginner.context}
                  </p>
                  {lesson.scenarios.beginner.goal && (
                    <div className="p-3 bg-slate-900 rounded border border-slate-800 text-xs text-slate-200">
                      <strong className="text-emerald-400">Goal: </strong>
                      {lesson.scenarios.beginner.goal}
                    </div>
                  )}
                </div>
              )}

              {activeScenarioTab === 'realDev' && (
                <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <h3 className="text-base font-bold text-indigo-400">
                    {lesson.scenarios.realDeveloper.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded bg-slate-900 border border-slate-800">
                      <div className="font-bold text-slate-400 mb-1">Setup / Context</div>
                      <p className="text-slate-300">{lesson.scenarios.realDeveloper.setup}</p>
                    </div>
                    <div className="p-3.5 rounded bg-slate-900 border border-slate-800">
                      <div className="font-bold text-amber-400 mb-1">Challenge / Problem</div>
                      <p className="text-slate-300">{lesson.scenarios.realDeveloper.problem}</p>
                    </div>
                  </div>
                  {lesson.scenarios.realDeveloper.solution && (
                    <div className="p-3.5 bg-indigo-950/30 rounded border border-indigo-900/40 text-xs text-indigo-200">
                      <strong className="text-indigo-400">Resolution: </strong>
                      {lesson.scenarios.realDeveloper.solution}
                    </div>
                  )}
                </div>
              )}

              {activeScenarioTab === 'production' && (
                <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <h3 className="text-base font-bold text-amber-400">
                    {lesson.scenarios.production.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lesson.scenarios.production.context}
                  </p>
                  {lesson.scenarios.production.takeaway && (
                    <div className="p-3.5 bg-amber-950/30 rounded border border-amber-900/40 text-xs text-amber-200">
                      <strong className="text-amber-400">Production Takeaway: </strong>
                      {lesson.scenarios.production.takeaway}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 8: INTERACTIVE SIMULATION */}
        {currentStep.id === 'simulation' && (
          <div className="space-y-6 animate-fadeIn">
            {renderTechnologySimulation ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <div className="text-xs text-slate-400">
                    Interact directly with the physical engine simulation below.
                  </div>
                  <button
                    onClick={() => setCurrentStepIndex(9)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 underline"
                  >
                    Open terminal to execute real commands ➜
                  </button>
                </div>
                {renderTechnologySimulation()}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-lg font-bold text-white">Interactive State Machine</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lesson.simulation.initialStateDescription}
                </p>
                <div className="space-y-3 mt-4">
                  {lesson.simulation.steps.map((st, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-xs font-mono text-cyan-400 font-bold mb-1">
                        Step {st.stepNumber}: {st.actionTitle}
                      </div>
                      <p className="text-xs text-slate-300 mb-2">{st.whatHappens}</p>
                      <div className="text-[11px] text-slate-400 font-mono bg-slate-900 p-2 rounded border border-slate-850">
                        {st.technicalDetail}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 9: CAUSE & EFFECT */}
        {currentStep.id === 'cause_effect' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                Step 9 • State Transition Causality
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Watch Action ➔ Engine ➔ Mutation ➔ Visual Result
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Never jump state magically. Every command mutates internal engine data structures.
              </p>

              <div className="space-y-4">
                {lesson.simulation.steps.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div>
                      <div className="text-[11px] font-mono text-cyan-400 uppercase font-bold mb-1">
                        Action 0{s.stepNumber}
                      </div>
                      <h4 className="text-sm font-bold text-white">{s.actionTitle}</h4>
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-indigo-400 uppercase font-bold mb-1">
                        State Transition
                      </div>
                      <p className="text-xs text-slate-300">{s.whatHappens}</p>
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-emerald-400 uppercase font-bold mb-1">
                        Why / Mechanism
                      </div>
                      <p className="text-xs text-slate-300">{s.why}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 10: REAL TERMINAL */}
        {currentStep.id === 'terminal' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Execute real simulated commands against the state machine:</span>
              <button
                onClick={() => terminalRef.current?.executeCommand(lesson.command)}
                className="font-mono text-cyan-400 hover:text-cyan-300 text-xs bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800"
              >
                Auto-run: {lesson.command}
              </button>
            </div>
            <div className="h-[420px]">
              <UniversalTerminal
                ref={terminalRef}
                adapter={adapter}
                title={`${lesson.technology.toUpperCase()} Command Shell`}
              />
            </div>
          </div>
        )}

        {/* STEP 11 & 12: MISTAKE LAB & RECOVERY */}
        {(currentStep.id === 'mistake' || currentStep.id === 'recovery') && (
          <div className="space-y-4 animate-fadeIn">
            <MistakeRecoveryBox
              mistake={lesson.mistakeAndRecovery}
              onApplyRecoveryCommand={handleSendToTerminal}
            />
          </div>
        )}

        {/* STEP 13: CHALLENGE */}
        {currentStep.id === 'challenge' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                Step 13 • Hands-on Challenge
              </div>
              <h2 className="text-xl font-bold text-white mb-2">{lesson.challenge.taskGoal}</h2>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                {lesson.challenge.instructions}
              </p>

              {/* Challenge Input */}
              <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="text-xs font-mono text-slate-400">
                  ENTER THE COMMAND TO SOLVE THIS TASK:
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-mono font-bold">{adapter.promptPrefix}</span>
                  <input
                    type="text"
                    value={challengeInput}
                    onChange={(e) => setChallengeInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && verifyChallenge()}
                    placeholder="e.g. docker run -d -p 8080:80 nginx"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={verifyChallenge}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all"
                  >
                    Submit
                  </button>
                </div>

                {/* Challenge Result */}
                {challengeCompleted && (
                  <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between">
                    <div>
                      <strong>Success!</strong> You solved the challenge correctly.
                      <p className="text-[11px] text-emerald-300/80 mt-1">
                        {lesson.challenge.explanation}
                      </p>
                    </div>
                    <button
                      onClick={() => setCurrentStepIndex(13)}
                      className="px-3 py-1.5 rounded bg-emerald-600 text-white font-semibold text-xs ml-4"
                    >
                      Proceed to Mastery 🏆
                    </button>
                  </div>
                )}

                {/* Hints Accordion */}
                <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Stuck on the task?</span>
                  <div className="flex gap-2">
                    {lesson.challenge.hints.map((_, hIdx) => (
                      <button
                        key={hIdx}
                        onClick={() => setShowHintIndex(showHintIndex === hIdx ? -1 : hIdx)}
                        className="text-[11px] px-2.5 py-1 rounded bg-slate-800 text-amber-300 hover:bg-slate-750 border border-slate-700"
                      >
                        Hint {hIdx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {showHintIndex >= 0 && (
                  <div className="p-3 bg-amber-950/20 border border-amber-900/30 rounded text-xs text-amber-200">
                    💡 {lesson.challenge.hints[showHintIndex]}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 14: MASTERY */}
        {currentStep.id === 'mastery' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/40 shadow-2xl text-center space-y-6">
              <div className="text-5xl">🏆</div>
              <h2 className="text-2xl font-bold text-white">
                Concept Mastered: {lesson.title}
              </h2>
              <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                You have journeyed through the real-world problem, mental model, syntax breakdown,
                interactive state simulation, safe mistake recovery, and challenge execution.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                {lesson.badges.map((b, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                  >
                    ✦ {b}
                  </span>
                ))}
              </div>

              {onNextLesson && (
                <div className="pt-4">
                  <button
                    onClick={onNextLesson}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-cyan-500/20 transition-all"
                  >
                    Continue to Next Lesson ➔
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
