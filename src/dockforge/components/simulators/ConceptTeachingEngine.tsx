import React, { useState, useMemo } from 'react';
import { UniversalDockerConcept, ConceptTerm, BlockDiagramNode } from '../../data/unifiedDockerData';
import {
  BookOpen,
  Box,
  Terminal as TerminalIcon,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Layers,
  Sparkles,
  Info,
  Zap,
  Check,
  X,
  Workflow,
} from 'lucide-react';
import { DockerSimulatorEngine } from './DockerSimulatorEngine';
import { ensureFullConceptData } from '../../data/conceptDataEnricher';
import { DockerFlowDiagram } from '../diagrams/DockerFlowDiagram';

interface ConceptTeachingEngineProps {
  concept: UniversalDockerConcept;
  completedConceptIds: string[];
  markConceptComplete: (id: string) => void;
  executeCommand: (cmd: string) => void;
  showToast: (msg: string) => void;
  prevConcept?: { id: string; title: string } | null;
  nextConcept?: { id: string; title: string } | null;
  onSelectConcept?: (id: string) => void;
}

export const ConceptTeachingEngine: React.FC<ConceptTeachingEngineProps> = ({
  concept: rawConcept,
  completedConceptIds,
  markConceptComplete,
  executeCommand,
  showToast,
  prevConcept,
  nextConcept,
  onSelectConcept,
}) => {
  const concept = ensureFullConceptData(rawConcept);

  // Runtime simulator is ONLY required for dynamic container execution & resource topics
  const isRuntimeSimulationRequired = useMemo(() => {
    const cid = concept.id.toLowerCase();
    const ctitle = concept.title.toLowerCase();
    return (
      cid.includes('run') ||
      cid.includes('volume') ||
      cid.includes('mount') ||
      cid.includes('compose') ||
      cid.includes('stats') ||
      cid.includes('stop') ||
      cid.includes('exec') ||
      cid.includes('database') ||
      ctitle.includes('running containers') ||
      ctitle.includes('stopping') ||
      ctitle.includes('volume') ||
      ctitle.includes('compose') ||
      ctitle.includes('interactive shells')
    );
  }, [concept.id, concept.title]);

  // 5 Learning Stage Anchors
  const [stage, setStage] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Stage 2: Block Diagram & Terms
  const [selectedDiagramNode, setSelectedDiagramNode] = useState<BlockDiagramNode | null>(
    concept.blockDiagram?.nodes[1] || null
  );
  const [termViewMode, setTermViewMode] = useState<Record<string, 'simple' | 'technical'>>({});

  // Stage 3: Syntax Token Explorer & Variations
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number | null>(0);
  const [selectedVariationIndex, setSelectedVariationIndex] = useState<number>(2);

  // Stage 4: Internal Flow Step Inspector & Why Modal
  const [activeInternalStep, setActiveInternalStep] = useState<number>(1);
  const [inspectWhyStep, setInspectWhyStep] = useState<number | null>(null);

  // Stage 5: Terminal Sandbox State & Hints
  const [inputCommand, setInputCommand] = useState<string>('');
  const [terminalHistory, setTerminalHistory] = useState<
    Array<{ type: 'input' | 'output' | 'error' | 'hint'; text: string }>
  >([
    { type: 'output', text: '$ DockForge Interactive Docker Shell v2.4' },
    { type: 'output', text: `Target Goal: ${concept.sandbox?.targetTask || 'Run docker command'}` },
  ]);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const toggleTermMode = (termName: string) => {
    setTermViewMode((prev) => ({
      ...prev,
      [termName]: prev[termName] === 'technical' ? 'simple' : 'technical',
    }));
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCommand.trim()) return;

    const cmd = inputCommand.trim();
    const newHistory = [...terminalHistory, { type: 'input' as const, text: `$ ${cmd}` }];

    // Concept-aware command evaluation using sandbox data
    const solutionCmds = concept.sandbox?.solutionCommands || [];
    const guidedSteps = concept.sandbox?.guidedSteps || [];
    const allValidCmds = [...solutionCmds, ...guidedSteps.map((s) => s.command)];
    const isExactSolution = solutionCmds.some((sol) => cmd === sol);
    const isGuidedCmd = guidedSteps.some((s) => cmd === s.command);
    const isPartialMatch = allValidCmds.some((sol) => cmd.startsWith(sol.split(' ').slice(0, 2).join(' ')));

    if (isExactSolution) {
      newHistory.push({
        type: 'output',
        text: `✅ Command accepted. Executing: ${cmd}`,
      });
      newHistory.push({
        type: 'output',
        text: `🟢 SUCCESS! ${concept.title} task completed successfully.`,
      });
      markConceptComplete(concept.id);
      showToast(`🎉 "${concept.title}" marked as completed!`);
    } else if (isGuidedCmd) {
      const step = guidedSteps.find((s) => cmd === s.command);
      newHistory.push({
        type: 'output',
        text: `✅ Step complete: ${step?.instruction || 'Command executed.'}`,
      });
    } else if (cmd === 'docker ps') {
      newHistory.push({
        type: 'output',
        text: 'CONTAINER ID   IMAGE          COMMAND              CREATED         STATUS         PORTS',
      });
      newHistory.push({
        type: 'output',
        text: `a3f2c1d4e5f6   ${concept.command.split(' ').pop() || 'app'}   "entrypoint..."   2s ago   Up 2s   0.0.0.0:8080->80/tcp`,
      });
    } else if (cmd === 'help' || cmd === 'hint') {
      const nextStep = guidedSteps[0];
      if (nextStep) {
        newHistory.push({
          type: 'hint',
          text: `💡 Hint: ${nextStep.hint}`,
        });
      } else {
        newHistory.push({
          type: 'hint',
          text: `💡 Try running: ${concept.command}`,
        });
      }
    } else if (isPartialMatch) {
      newHistory.push({
        type: 'error',
        text: `⚠️ You're close! Check your flags and arguments. Type "hint" for guidance.`,
      });
    } else {
      newHistory.push({
        type: 'output',
        text: `Executed: ${cmd}`,
      });
    }

    setTerminalHistory(newHistory);
    setInputCommand('');
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
        background: 'var(--docker-bg)',
        color: '#e2e8f0',
      }}
    >
      {/* ==================================================================== */}
      {/* 1. TOP PROGRESSIVE DISCLOSURE ANCHOR NAVIGATION BAR */}
      {/* ==================================================================== */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--docker-border)',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--docker-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Topic {concept.topicNumber} • {concept.topicTitle}
            </span>
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>
            {concept.topicNumber}. {concept.title}
          </h1>
        </div>

        {/* Anchor Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.03)', padding: '0.3rem', borderRadius: '10px', border: '1px solid var(--docker-border)' }}>
          {[
            { id: 1, label: '1. Concept & Problem', icon: BookOpen },
            { id: 2, label: '2. Block & Flow Diagram', icon: Workflow },
            { id: 3, label: '3. Syntax & Tokens', icon: Zap },
            { id: 4, label: '4. Internal Mechanics', icon: Layers },
            { id: 5, label: isRuntimeSimulationRequired ? '5. Simulator & Practice' : '5. Practice & Quiz', icon: TerminalIcon },
          ].map((stg) => {
            const IconComp = stg.icon;
            const isActive = stage === stg.id;
            return (
              <button
                key={stg.id}
                onClick={() => setStage(stg.id as any)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '7px',
                  border: 'none',
                  background: isActive ? 'var(--docker-blue)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--docker-text-secondary)',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease',
                }}
              >
                <IconComp size={14} />
                <span>{stg.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Canvas Body */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {/* ==================================================================== */}
        {/* STAGE 1: CONCEPT & PROBLEM */}
        {/* ==================================================================== */}
        {stage === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* What is it? Card */}
            <div className="docker-card" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--docker-blue)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                Core Definition
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: '0 0 1rem 0' }}>
                What is {concept.title}?
              </h2>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: '#cbd5e1', margin: 0 }}>
                {concept.whatIsIt}
              </p>

              {/* In Simple Words Box */}
              <div style={{ marginTop: '1.5rem', background: 'rgba(56, 189, 248, 0.06)', borderLeft: '4px solid #38bdf8', padding: '1.25rem', borderRadius: '0 10px 10px 0' }}>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#38bdf8', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Sparkles size={16} /> In Simple Words
                </div>
                <p style={{ fontSize: '0.94rem', lineHeight: 1.6, color: '#e2e8f0', margin: 0 }}>
                  "{concept.inSimpleWords}"
                </p>
              </div>
            </div>

            {/* Why Does it Exist? Without vs With Containers */}
            {concept.withoutVsWith && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <HelpCircle size={18} color="var(--docker-blue)" />
                  <span>Why Do We Need {concept.title}?</span>
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                  {/* WITHOUT CONTAINERS */}
                  <div className="docker-card" style={{ padding: '1.5rem', borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.03)' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#f87171', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <X size={18} color="#ef4444" />
                      <span>{concept.withoutVsWith.without.title}</span>
                    </div>

                    <ul style={{ paddingLeft: '1.2rem', margin: '0 0 1.25rem 0', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {concept.withoutVsWith.without.items.map((item, idx) => (
                        <li key={idx} style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#f87171', padding: '0.75rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                      Result: {concept.withoutVsWith.without.outcome}
                    </div>
                  </div>

                  {/* WITH CONTAINERS */}
                  <div className="docker-card" style={{ padding: '1.5rem', borderColor: 'rgba(34, 197, 94, 0.3)', background: 'rgba(34, 197, 94, 0.03)' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#4ade80', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Check size={18} color="#22c55e" />
                      <span>{concept.withoutVsWith.with.title}</span>
                    </div>

                    <ul style={{ paddingLeft: '1.2rem', margin: '0 0 1.25rem 0', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {concept.withoutVsWith.with.items.map((item, idx) => (
                        <li key={idx} style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div style={{ background: 'rgba(34, 197, 94, 0.12)', color: '#4ade80', padding: '0.75rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                      Result: {concept.withoutVsWith.with.outcome}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Real World Analogy */}
            <div className="docker-card" style={{ padding: '1.5rem' }}>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#fff', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Info size={16} color="var(--docker-blue)" />
                <span>Real-World Analogy</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                {concept.realWorldAnalogy}
              </p>
            </div>

            {/* Next CTA */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                onClick={() => setStage(2)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(14, 165, 233, 0.4)',
                }}
              >
                <span>Continue to 2. Block & Flow Diagram</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* STAGE 2: VISUAL BLOCK & FLOW DIAGRAM & TERMS EXPLORER */}
        {/* ==================================================================== */}
        {stage === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* Interactive Multi-Archetype Block & Flow Diagram */}
            <DockerFlowDiagram concept={concept} />

            {/* Terms You Just Encountered */}
            {concept.terms && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={18} color="var(--docker-blue)" />
                  <span>Terms You Just Encountered</span>
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  {concept.terms.map((t) => {
                    const isTech = termViewMode[t.term] === 'technical';
                    return (
                      <div key={t.term} className="docker-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>{t.term}</span>
                          <button
                            onClick={() => toggleTermMode(t.term)}
                            style={{
                              padding: '0.25rem 0.55rem',
                              borderRadius: '6px',
                              background: isTech ? 'rgba(56, 189, 248, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                              color: isTech ? '#38bdf8' : '#4ade80',
                              border: 'none',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                            }}
                          >
                            {isTech ? 'Technical View' : 'Simple View'}
                          </button>
                        </div>

                        <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                          {isTech ? t.technical : t.simple}
                        </p>

                        {t.analogy && (
                          <div style={{ fontSize: '0.76rem', color: 'var(--docker-text-secondary)', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.65rem', borderRadius: '6px' }}>
                            💡 <strong>Analogy:</strong> {t.analogy}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Real Developer Scenario */}
            {concept.developerScenario && (
              <div className="docker-card" style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.8)' }}>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#fff', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Sparkles size={16} color="var(--docker-blue)" />
                  <span>{concept.developerScenario.title}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.86rem', lineHeight: 1.5 }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', borderLeft: '3px solid #38bdf8' }}>
                    <strong>Developer Setup:</strong> {concept.developerScenario.setup}
                  </div>
                  <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '0.75rem', borderRadius: '8px', borderLeft: '3px solid #f87171' }}>
                    <strong>The Problem:</strong> {concept.developerScenario.problem}
                  </div>
                  <div style={{ background: 'rgba(34, 197, 94, 0.05)', padding: '0.75rem', borderRadius: '8px', borderLeft: '3px solid #4ade80' }}>
                    <strong>The Solution:</strong> {concept.developerScenario.solution}
                  </div>
                </div>
              </div>
            )}

            {/* Next CTA */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button
                onClick={() => setStage(1)}
                style={{ padding: '0.75rem 1.25rem', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid var(--docker-border)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                ← Back to 1. Concept
              </button>
              <button
                onClick={() => setStage(3)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(14, 165, 233, 0.4)',
                }}
              >
                <span>Continue to 3. Syntax & Tokens</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* STAGE 3: SYNTAX, TOKENS & VARIATIONS */}
        {/* ==================================================================== */}
        {stage === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* Interactive Syntax Token Explorer */}
            <div className="docker-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem 0' }}>
                Command Syntax & Token Breakdown
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--docker-text-secondary)', margin: '0 0 1.5rem 0' }}>
                Click any part of the command token below to see what it does:
              </p>

              {/* Interactive Syntax Bar */}
              <div
                style={{
                  background: '#090d16',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  border: '1px solid var(--docker-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: 'var(--docker-text-secondary)' }}>
                    $ {concept.syntaxCode || concept.command}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#64748b', fontStyle: 'italic' }}>
                    👆 Click any token below
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem' }}>
                  {concept.syntaxTokens.map((tok, idx) => {
                    const isSelected = selectedTokenIndex === idx;
                    // Role-based color coding
                    const roleColors: Record<string, { bg: string; border: string; text: string; selectedBg: string }> = {
                      'CLI Tool': { bg: 'rgba(56, 189, 248, 0.12)', border: '#38bdf8', text: '#38bdf8', selectedBg: 'rgba(56, 189, 248, 0.3)' },
                      'Command': { bg: 'rgba(74, 222, 128, 0.12)', border: '#4ade80', text: '#4ade80', selectedBg: 'rgba(74, 222, 128, 0.3)' },
                      'Flag': { bg: 'rgba(167, 139, 250, 0.12)', border: '#a78bfa', text: '#a78bfa', selectedBg: 'rgba(167, 139, 250, 0.3)' },
                      'Image': { bg: 'rgba(251, 191, 36, 0.12)', border: '#fbbf24', text: '#fbbf24', selectedBg: 'rgba(251, 191, 36, 0.3)' },
                      'Target Image': { bg: 'rgba(251, 191, 36, 0.12)', border: '#fbbf24', text: '#fbbf24', selectedBg: 'rgba(251, 191, 36, 0.3)' },
                      'Argument': { bg: 'rgba(244, 114, 182, 0.12)', border: '#f472b6', text: '#f472b6', selectedBg: 'rgba(244, 114, 182, 0.3)' },
                      'Option': { bg: 'rgba(244, 114, 182, 0.12)', border: '#f472b6', text: '#f472b6', selectedBg: 'rgba(244, 114, 182, 0.3)' },
                      'Subcommand': { bg: 'rgba(45, 212, 191, 0.12)', border: '#2dd4bf', text: '#2dd4bf', selectedBg: 'rgba(45, 212, 191, 0.3)' },
                    };
                    const colors = roleColors[tok.role] || { bg: 'rgba(148, 163, 184, 0.12)', border: '#94a3b8', text: '#94a3b8', selectedBg: 'rgba(148, 163, 184, 0.3)' };
                    return (
                      <span
                        key={idx}
                        onClick={() => setSelectedTokenIndex(isSelected ? null : idx)}
                        style={{
                          padding: '0.4rem 0.75rem',
                          borderRadius: '8px',
                          background: isSelected ? colors.selectedBg : colors.bg,
                          border: isSelected ? `2px solid ${colors.border}` : `1px solid ${colors.border}40`,
                          color: colors.text,
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: isSelected ? `0 0 12px ${colors.border}30` : 'none',
                          transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                        }}
                      >
                        {tok.token}
                        <span style={{ fontSize: '0.6rem', marginLeft: '0.4rem', opacity: 0.7, fontWeight: 600 }}>
                          {tok.role}
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Active Token Explanation Card */}
              {selectedTokenIndex !== null && concept.syntaxTokens[selectedTokenIndex] && (() => {
                const tok = concept.syntaxTokens[selectedTokenIndex];
                const roleColors: Record<string, string> = {
                  'CLI Tool': '#38bdf8', 'Command': '#4ade80', 'Flag': '#a78bfa',
                  'Image': '#fbbf24', 'Target Image': '#fbbf24', 'Argument': '#f472b6',
                  'Option': '#f472b6', 'Subcommand': '#2dd4bf',
                };
                const accentColor = roleColors[tok.role] || '#94a3b8';
                return (
                  <div style={{
                    background: `linear-gradient(135deg, ${accentColor}10 0%, rgba(15, 23, 42, 0.6) 100%)`,
                    border: `1px solid ${accentColor}50`,
                    padding: '1.25rem',
                    borderRadius: '10px',
                    marginBottom: '1rem',
                    animation: 'fadeIn 0.2s ease',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '6px', background: accentColor, color: '#000' }}>
                        {tok.role}
                      </span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, fontSize: '1.05rem', color: accentColor }}>
                        {tok.token}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.92rem', color: '#e2e8f0', margin: 0, lineHeight: 1.6 }}>
                      {tok.explanation}
                    </p>
                  </div>
                );
              })()}
            </div>

            {/* Syntax Variations Explorer */}
            {concept.variations && (
              <div className="docker-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: '0 0 0.35rem 0' }}>
                  Progressive Command Variations
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--docker-text-secondary)', margin: '0 0 1.25rem 0' }}>
                  See how adding flags changes Docker container behavior step by step:
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  {concept.variations.map((v, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariationIndex(idx)}
                      style={{
                        padding: '0.5rem 0.85rem',
                        borderRadius: '8px',
                        border: selectedVariationIndex === idx ? '1px solid var(--docker-blue)' : '1px solid var(--docker-border)',
                        background: selectedVariationIndex === idx ? 'rgba(14, 165, 233, 0.2)' : 'rgba(255,255,255,0.03)',
                        color: selectedVariationIndex === idx ? '#38bdf8' : '#cbd5e1',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      {v.title}
                    </button>
                  ))}
                </div>

                {/* Selected Variation Detail */}
                {concept.variations[selectedVariationIndex] && (
                  <div style={{ background: '#090d16', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--docker-border)' }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.92rem', color: '#4ade80', marginBottom: '1rem', background: 'rgba(0,0,0,0.4)', padding: '0.65rem 0.85rem', borderRadius: '6px' }}>
                      $ {concept.variations[selectedVariationIndex].syntax}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.3rem' }}>WHAT CHANGED & WHY?</div>
                        <p style={{ fontSize: '0.84rem', color: '#e2e8f0', margin: 0, lineHeight: 1.5 }}>
                          {concept.variations[selectedVariationIndex].whatItDoes}
                        </p>
                      </div>

                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#4ade80', marginBottom: '0.3rem' }}>WHEN TO USE THIS</div>
                        <p style={{ fontSize: '0.84rem', color: '#e2e8f0', margin: 0, lineHeight: 1.5 }}>
                          {concept.variations[selectedVariationIndex].whenToUse}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* When to use vs When NOT to use */}
            {concept.whenToUse && concept.whenNotToUse && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                <div className="docker-card" style={{ padding: '1.5rem', borderColor: 'rgba(34, 197, 94, 0.3)' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#4ade80', marginBottom: '1rem' }}>
                    ✓ WHEN TO USE
                  </div>
                  <ul style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {concept.whenToUse.map((item, idx) => (
                      <li key={idx} style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="docker-card" style={{ padding: '1.5rem', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#f87171', marginBottom: '1rem' }}>
                    ✕ WHEN NOT TO USE
                  </div>
                  <ul style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {concept.whenNotToUse.map((item, idx) => (
                      <li key={idx} style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Next CTA */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button
                onClick={() => setStage(2)}
                style={{ padding: '0.75rem 1.25rem', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid var(--docker-border)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                ← Back to 2. Block & Flow Diagram
              </button>
              <button
                onClick={() => setStage(4)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(14, 165, 233, 0.4)',
                }}
              >
                <span>Continue to 4. Internal Mechanics</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* STAGE 4: INTERNAL MECHANICS & STEP INSPECTOR */}
        {/* ==================================================================== */}
        {stage === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {concept.internalFlow && (
              <div className="docker-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: '0 0 0.35rem 0' }}>
                  What Happens Internally When You Run the Command?
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--docker-text-secondary)', margin: '0 0 1.5rem 0' }}>
                  Click any step in the internal execution sequence to inspect low-level details:
                </p>

                {/* Pipeline Stepper Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  {concept.internalFlow.map((st) => {
                    const isActive = activeInternalStep === st.step;
                    return (
                      <div
                        key={st.step}
                        onClick={() => setActiveInternalStep(st.step)}
                        style={{
                          padding: '1.25rem',
                          borderRadius: '12px',
                          background: isActive ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255,255,255,0.02)',
                          border: isActive ? '2px solid #0ea5e9' : '1px solid var(--docker-border)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.65rem',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.65rem', borderRadius: '999px', background: isActive ? '#0ea5e9' : 'rgba(255,255,255,0.08)', color: '#fff' }}>
                            Step {st.step}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setInspectWhyStep(st.step);
                            }}
                            style={{
                              padding: '0.2rem 0.55rem',
                              borderRadius: '6px',
                              background: 'rgba(56, 189, 248, 0.2)',
                              color: '#38bdf8',
                              border: 'none',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                          >
                            <HelpCircle size={12} /> Why?
                          </button>
                        </div>

                        <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#fff' }}>
                          {st.title}
                        </div>
                        <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                          {st.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Inspect Why Modal / Drawer */}
                {inspectWhyStep !== null && (
                  <div style={{ background: 'rgba(14, 165, 233, 0.1)', border: '1px solid #0ea5e9', padding: '1.25rem', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <HelpCircle size={16} /> WHY DOES DOCKER DO STEP {inspectWhyStep}?
                      </div>
                      <button
                        onClick={() => setInspectWhyStep(null)}
                        style={{ padding: '0.2rem 0.55rem', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                      >
                        Close
                      </button>
                    </div>

                    {concept.internalFlow.find((s) => s.step === inspectWhyStep) && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.86rem' }}>
                        <div>
                          <strong>Reason:</strong> {concept.internalFlow.find((s) => s.step === inspectWhyStep)?.why}
                        </div>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#a7f3d0', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                          Technical Syscall/API Detail: {concept.internalFlow.find((s) => s.step === inspectWhyStep)?.techDetail}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Next CTA */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button
                onClick={() => setStage(3)}
                style={{ padding: '0.75rem 1.25rem', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid var(--docker-border)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                ← Back to 3. Syntax
              </button>
              <button
                onClick={() => setStage(5)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(14, 165, 233, 0.4)',
                }}
              >
                <span>Continue to 5. Interactive Simulator & Practice</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* STAGE 5: INTERACTIVE SIMULATOR, TERMINAL & RECAP */}
        {/* ==================================================================== */}
        {stage === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* Interactive Reusable Simulator Engine - ONLY rendered when runtime simulation is required */}
            {isRuntimeSimulationRequired && (
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--docker-blue)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  Interactive Cause &amp; Effect Simulator
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0 0 1rem 0' }}>
                  Let's See It Happen Live
                </h3>

                <DockerSimulatorEngine
                  concept={concept}
                  onComplete={() => markConceptComplete(concept.id)}
                  showToast={showToast}
                />
              </div>
            )}

            {/* Try It Yourself Terminal Sandbox */}
            <div className="docker-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <TerminalIcon size={18} color="var(--docker-blue)" />
                  <span>Try It Yourself (Terminal Practice)</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--docker-text-secondary)' }}>
                  Goal: {concept.sandbox?.targetTask || 'Run container command'}
                </span>
              </div>

              {/* Terminal Window */}
              <div
                style={{
                  background: '#070a12',
                  border: '1px solid var(--docker-border)',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.84rem',
                  minHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', overflowY: 'auto', maxHeight: '240px' }}>
                  {terminalHistory.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        color:
                          item.type === 'input'
                            ? '#38bdf8'
                            : item.type === 'error'
                            ? '#f87171'
                            : '#e2e8f0',
                      }}
                    >
                      {item.text}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleTerminalSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                  <span style={{ color: '#4ade80', fontWeight: 800 }}>$</span>
                  <input
                    type="text"
                    value={inputCommand}
                    onChange={(e) => setInputCommand(e.target.value)}
                    placeholder="Type docker command (e.g. docker run -d -p 8080:80 nginx)..."
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      color: '#fff',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.86rem',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    style={{ padding: '0.35rem 0.85rem', borderRadius: '6px', background: 'var(--docker-blue)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.78rem' }}
                  >
                    Run
                  </button>
                </form>
              </div>
            </div>

            {/* Common Mistakes */}
            {concept.commonMistakes && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={18} color="#facc15" />
                  <span>Things Beginners Commonly Get Wrong</span>
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  {concept.commonMistakes.map((m, idx) => (
                    <div key={idx} className="docker-card" style={{ padding: '1.25rem', borderColor: 'rgba(250, 204, 21, 0.3)', background: 'rgba(250, 204, 21, 0.02)' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#facc15', marginBottom: '0.5rem' }}>
                        ❌ {m.mistake}
                      </div>
                      <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 0.65rem 0' }}>
                        <strong>Why it's wrong:</strong> {m.whyWrong}
                      </p>
                      <div style={{ fontSize: '0.8rem', color: '#4ade80', background: 'rgba(34, 197, 94, 0.1)', padding: '0.5rem 0.65rem', borderRadius: '6px' }}>
                        💡 <strong>Correct way:</strong> {m.correctWay}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Final Recap & Quiz Challenge */}
            <div className="docker-card" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(15, 23, 42, 0.8) 100%)', borderColor: 'rgba(34, 197, 94, 0.3)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: '0 0 1rem 0' }}>
                Quick Recap & Self-Check
              </h3>

              {concept.recapChecklist && (
                <ul style={{ paddingLeft: '1.2rem', margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {concept.recapChecklist.map((item, idx) => (
                    <li key={idx} style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                      ✓ {item}
                    </li>
                  ))}
                </ul>
              )}

              {/* Quiz Challenge */}
              {concept.challenge && (
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--docker-border)' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#fff', marginBottom: '0.85rem' }}>
                    ❓ Challenge Quiz: {concept.challenge.question}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '1rem' }}>
                    {concept.challenge.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setQuizSelectedOption(idx);
                          setQuizSubmitted(true);
                        }}
                        style={{
                          textAlign: 'left',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          border: quizSelectedOption === idx ? '1px solid var(--docker-blue)' : '1px solid var(--docker-border)',
                          background: quizSelectedOption === idx ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255,255,255,0.03)',
                          color: '#fff',
                          fontSize: '0.84rem',
                          cursor: 'pointer',
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {quizSubmitted && quizSelectedOption !== null && (
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, padding: '0.75rem', borderRadius: '8px', background: concept.challenge.options[quizSelectedOption].isCorrect ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: concept.challenge.options[quizSelectedOption].isCorrect ? '#4ade80' : '#f87171' }}>
                      {concept.challenge.options[quizSelectedOption].explanation}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Nav Next Topic Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button
                onClick={() => setStage(4)}
                style={{ padding: '0.75rem 1.25rem', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid var(--docker-border)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                ← Back to 4. Internal Mechanics
              </button>

              {nextConcept && onSelectConcept && (
                <button
                  onClick={() => onSelectConcept(nextConcept.id)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 14px rgba(14, 165, 233, 0.4)',
                  }}
                >
                  <span>Next Lesson: {nextConcept.title}</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
