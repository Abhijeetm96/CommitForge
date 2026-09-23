// src/platform/search/UniversalProblemSolver.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { ProblemDiagnosis } from './types';
import { UNIVERSAL_PROBLEM_DIAGNOSES } from './problemDatabase';
import { TechnologyType } from '../lesson-runtime/types';

interface UniversalProblemSolverProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson?: (technology: TechnologyType, lessonId: string) => void;
}

export const UniversalProblemSolver: React.FC<UniversalProblemSolverProps> = ({
  isOpen,
  onClose,
  onSelectLesson,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [techFilter, setTechFilter] = useState<'all' | TechnologyType>('all');
  const [selectedProblem, setSelectedProblem] = useState<ProblemDiagnosis | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter diagnoses
  const filteredProblems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return UNIVERSAL_PROBLEM_DIAGNOSES.filter((prob) => {
      if (techFilter !== 'all' && prob.technology !== techFilter) return false;
      if (!q) return true;
      return (
        prob.title.toLowerCase().includes(q) ||
        prob.symptom.toLowerCase().includes(q) ||
        prob.category.toLowerCase().includes(q) ||
        prob.remedyCommand.toLowerCase().includes(q) ||
        prob.whyItHappened.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, techFilter]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const getTechBadge = (tech: TechnologyType) => {
    switch (tech) {
      case 'git':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'docker':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'kubernetes':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Search Bar Header */}
        <div className="p-4 md:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-3">
            <span className="text-xl">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Describe your problem (e.g. 'container exited 137', 'undo commit', 'crashloop')..."
              className="w-full bg-transparent text-sm md:text-base text-white placeholder-slate-500 focus:outline-none font-mono"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-500 hidden md:inline">ESC to close</span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Technology Filter Bar */}
        <div className="px-5 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setTechFilter('all')}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                techFilter === 'all'
                  ? 'bg-white text-slate-900 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              All Academies
            </button>
            <button
              onClick={() => setTechFilter('git')}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                techFilter === 'git'
                  ? 'bg-orange-500 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Git (CommitForge)
            </button>
            <button
              onClick={() => setTechFilter('docker')}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                techFilter === 'docker'
                  ? 'bg-cyan-500 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Docker (DockForge)
            </button>
            <button
              onClick={() => setTechFilter('kubernetes')}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                techFilter === 'kubernetes'
                  ? 'bg-indigo-500 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Kubernetes (PodForge)
            </button>
          </div>
          <span className="text-[11px] text-slate-500 font-mono hidden md:inline">
            {filteredProblems.length} diagnostic solutions
          </span>
        </div>

        {/* Modal Body: Split View (List on left, details on right) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-[350px]">
          {/* List of Problems */}
          <div className="md:col-span-5 border-r border-slate-800 overflow-y-auto p-3 space-y-2 bg-slate-950/40">
            {filteredProblems.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No matching problems found. Try simpler keywords.
              </div>
            ) : (
              filteredProblems.map((prob) => {
                const isSelected = selectedProblem?.id === prob.id;
                return (
                  <button
                    key={prob.id}
                    onClick={() => setSelectedProblem(prob)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase font-bold border ${getTechBadge(
                          prob.technology
                        )}`}
                      >
                        {prob.technology}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{prob.category}</span>
                    </div>
                    <h4 className="text-xs font-bold leading-snug line-clamp-2">{prob.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{prob.symptom}</p>
                  </button>
                );
              })
            )}
          </div>

          {/* Detailed Diagnosis View */}
          <div className="md:col-span-7 overflow-y-auto p-6 bg-slate-900 space-y-5">
            {selectedProblem ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-mono uppercase font-bold border ${getTechBadge(
                      selectedProblem.technology
                    )}`}
                  >
                    {selectedProblem.technology.toUpperCase()} • {selectedProblem.category}
                  </span>
                  {onSelectLesson && (
                    <button
                      onClick={() => {
                        onSelectLesson(selectedProblem.technology, selectedProblem.relatedLessonId);
                        onClose();
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 underline flex items-center gap-1"
                    >
                      <span>Open Lesson: {selectedProblem.relatedLessonTitle}</span>
                      <span>➜</span>
                    </button>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white">{selectedProblem.title}</h3>

                {/* Symptom */}
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                  <span className="text-rose-400 font-bold uppercase tracking-wider block mb-1">
                    Observed Symptom
                  </span>
                  <p className="text-slate-300">{selectedProblem.symptom}</p>
                </div>

                {/* Why it happened */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="text-amber-400 font-bold uppercase tracking-wider">
                    Underlying Root Cause
                  </div>
                  <p className="text-slate-200 leading-relaxed">{selectedProblem.whyItHappened}</p>
                </div>

                {/* Mental Model */}
                <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-900/40 space-y-2 text-xs">
                  <div className="text-indigo-400 font-bold uppercase tracking-wider">
                    Senior Dev Mental Model
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {selectedProblem.mentalModelExplanation}
                  </p>
                </div>

                {/* Remedy Command */}
                <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      Remedy Execution
                    </span>
                    <button
                      onClick={() => copyToClipboard(selectedProblem.remedyCommand)}
                      className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-800 text-[11px] font-mono transition-all"
                    >
                      {copiedCmd ? '✓ Copied' : 'Copy Command'}
                    </button>
                  </div>
                  <pre className="p-3 rounded bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300 whitespace-pre-wrap select-all">
                    {selectedProblem.remedyCommand}
                  </pre>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedProblem.explanationOfFix}
                  </p>
                </div>

                {/* Preventative Tip */}
                <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-900/30 text-xs text-emerald-200">
                  <strong className="text-emerald-400">Pro-Tip: </strong>
                  {selectedProblem.preventativeTip}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <span className="text-4xl mb-3">💡</span>
                <h4 className="text-sm font-semibold text-slate-400">
                  Select a problem from the left or search above
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Diagnose real errors across Git commits, Docker OOM/ports, and Kubernetes CrashLoopBackOff.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
