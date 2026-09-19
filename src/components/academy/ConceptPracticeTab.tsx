import React, { useState, useRef, useEffect } from 'react';
import { UniversalConcept } from '../../data/unifiedAcademyData';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Circle,
  HelpCircle,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  Play,
  ArrowRight,
  Lightbulb,
  Terminal,
  CornerDownLeft,
  FileText,
  Database,
  Layers,
  Check,
  Trophy,
  AlertCircle,
  Flame,
} from 'lucide-react';

interface Props {
  concept: UniversalConcept;
}

export const ConceptPracticeTab: React.FC<Props> = ({ concept }) => {
  const { executeCommand, repo, engine, markLessonComplete, completedLessonIds } = useApp();
  const isCompleted = completedLessonIds.includes(concept.id);

  const [hintLevel, setHintLevel] = useState<number>(0);
  const [safeFailureState, setSafeFailureState] = useState<'idle' | 'triggered' | 'recovered'>('idle');

  // Terminal & Workbench state
  const [inputVal, setInputVal] = useState<string>('');
  const [history, setHistory] = useState<{ command: string; output: string[]; isError?: boolean }[]>([]);
  const [commandHistoryList, setCommandHistoryList] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [hasCheckedSolution, setHasCheckedSolution] = useState<boolean>(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const initialCommitCountRef = useRef<number>(0);

  const challenge = concept.challenge;
  const initialFiles = challenge.initialFiles || {};
  const seedCommands = challenge.seedCommands && challenge.seedCommands.length > 0 ? challenge.seedCommands : ['git init'];
  const expectedCommands = challenge.expectedCommands && challenge.expectedCommands.length > 0 ? challenge.expectedCommands : [concept.command];
  const safeFailure = challenge.safeFailure || {
    mistakeTitle: 'Unchecked Working Tree Reset',
    mistakeCommand: 'git reset --hard HEAD',
    whatHappened: 'Uncommitted file modifications in the working tree were discarded.',
    whatWasNotLost: 'Committed history in the object database was preserved.',
    recoveryCommand: 'git status',
    recoveryExplanation: 'Always inspect git status before executing destructive resets.',
  };

  // Initialize or reset challenge sandbox
  const handleResetChallenge = () => {
    // Reset index & ensure initial files exist
    for (const [fName, content] of Object.entries(initialFiles)) {
      engine.createFile(fName, content);
    }

    const seed = seedCommands;

    const seedLogs: { command: string; output: string[]; isError?: boolean }[] = [];

    seed.forEach((cmd) => {
      const res = executeCommand(cmd);
      const isOk = res.exitCode === 0;
      const out: string[] = [];

      if (res.stdout && res.stdout.length > 0) {
        out.push(...res.stdout);
      } else if (res.stderr && res.stderr.length > 0) {
        out.push(...res.stderr);
      } else if (!isOk) {
        out.push(`Failed with exit code ${res.exitCode}`);
      }

      seedLogs.push({
        command: cmd,
        output: out,
        isError: !isOk,
      });
    });

    initialCommitCountRef.current = Object.keys(repo.commits).length;
    setHistory(seedLogs);
    setCommandHistoryList([]);
    setHistoryIndex(-1);
    setInputVal('');
    setHasCheckedSolution(false);
    setSafeFailureState('idle');
  };

  useEffect(() => {
    handleResetChallenge();
  }, [concept.id]);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  // Execute terminal input
  const handleRunCommand = (cmdToRun?: string) => {
    const raw = (cmdToRun !== undefined ? cmdToRun : inputVal).trim();
    if (!raw) return;

    const res = executeCommand(raw);
    const isOk = res.exitCode === 0;
    const out: string[] = [];

    if (res.stdout && res.stdout.length > 0) {
      out.push(...res.stdout);
    } else if (res.stderr && res.stderr.length > 0) {
      out.push(...res.stderr);
    } else if (res.error) {
      out.push(`fatal: ${res.error}`);
    } else if (!isOk) {
      out.push(`Process exited with code ${res.exitCode}`);
    } else if (raw.startsWith('git add')) {
      out.push('Changes staged into index.');
    } else if (raw.startsWith('git restore --staged') || raw.startsWith('git reset')) {
      out.push('Changes unstaged from index.');
    }

    setHistory((prev) => [...prev, { command: raw, output: out, isError: !isOk }]);
    setCommandHistoryList((prev) => [...prev, raw]);
    setHistoryIndex(-1);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRunCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistoryList.length === 0) return;
      const nextIdx = historyIndex === -1 ? commandHistoryList.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(commandHistoryList[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= commandHistoryList.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(commandHistoryList[nextIdx]);
      }
    }
  };

  // Safe failure simulator
  const handleSimulateMistake = () => {
    executeCommand(safeFailure.mistakeCommand);
    setSafeFailureState('triggered');
  };

  const handleExecuteRecovery = () => {
    executeCommand(safeFailure.recoveryCommand);
    setSafeFailureState('recovered');
  };

  // Live Criteria Evaluation
  const userCommands = commandHistoryList.map((c) => c.trim());
  const hasRunStatus = userCommands.some((c) => c.startsWith('git status'));
  const hasRunTarget = userCommands.some((c) =>
    c.includes(concept.command) ||
    expectedCommands.some((ec) => c.startsWith(ec.split(' ')[0] + ' ' + (ec.split(' ')[1] || '')))
  );

  const headCommitHash = repo.head.type === 'branch'
    ? repo.branches[repo.head.ref]?.targetCommitHash
    : repo.head.ref;
  const headCommit = headCommitHash ? repo.commits[headCommitHash] : undefined;
  const commitCount = Object.keys(repo.commits).length;
  const stagedCount = Object.keys(repo.index).length;
  const workingFiles = Object.keys(repo.workingDirectory);
  const stagedFiles = Object.keys(repo.index);

  // Concept-specific criteria
  const isCommitConcept = concept.command.includes('commit') || expectedCommands.some((c) => c.includes('commit'));
  const isAddConcept = concept.command.includes('add') || expectedCommands.some((c) => c.includes('add'));

  // Security check: did user avoid committing sensitive/temporary files?
  const forbiddenFiles = Object.keys(initialFiles).filter(
    (f) => f.includes('secret') || f.includes('temp') || f.includes('.tmp') || f.includes('draft')
  );
  const isForbiddenSafe = forbiddenFiles.length === 0 || forbiddenFiles.every(
    (f) => !headCommit || headCommit.files[f] === undefined
  );

  // Construct dynamic checklist items
  const criteriaList: { title: string; desc: string; passed: boolean }[] = [];

  // Criterion 1: Status inspection
  criteriaList.push({
    title: 'Inspect Repository Status',
    desc: 'Run `git status` to see unstaged changes or branch state',
    passed: hasRunStatus || userCommands.length >= 2,
  });

  // Criterion 2: Action step
  if (isCommitConcept) {
    const targetFile = Object.keys(initialFiles).find((f) => !forbiddenFiles.includes(f)) || 'app.js';
    criteriaList.push({
      title: `Stage Code Changes (\`${targetFile}\`)`,
      desc: `Add the intended file to staging while keeping temporary files untracked`,
      passed: (headCommit && headCommit.files[targetFile] !== undefined) || repo.index[targetFile] !== undefined,
    });
  } else if (isAddConcept) {
    criteriaList.push({
      title: 'Stage Target Changes',
      desc: 'Move modifications from Working Tree into the Staging Index',
      passed: stagedCount > 0,
    });
  } else {
    criteriaList.push({
      title: `Execute \`${concept.command}\``,
      desc: `Apply the target command: ${expectedCommands[0] || concept.command}`,
      passed: hasRunTarget,
    });
  }

  // Criterion 3: Verification & Safety
  if (isCommitConcept) {
    criteriaList.push({
      title: 'Seal Snapshot without Leaking Secrets',
      desc: 'Commit the staged milestone with a descriptive message (secrets kept untracked)',
      passed: commitCount > initialCommitCountRef.current && isForbiddenSafe,
    });
  } else {
    criteriaList.push({
      title: 'Verify Successful State Transition',
      desc: 'Confirm the repository accurately reflects your commands',
      passed: hasRunTarget && userCommands.length >= 1,
    });
  }

  const allCriteriaPassed = criteriaList.every((c) => c.passed);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%' }}>
      {/* 1. Mission Briefing Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(9, 14, 26, 0.95) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '14px',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
                boxShadow: '0 0 12px rgba(56, 189, 248, 0.25)',
              }}
            >
              <Sparkles size={18} />
            </span>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#f8fafc' }}>
                {challenge.title}
              </h2>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Interactive Hands-On Practice Mission for <code>{concept.command}</code>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '0.25rem 0.65rem',
                borderRadius: '999px',
                background: 'rgba(56, 189, 248, 0.12)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)',
              }}
            >
              Interactive Mission
            </span>
            <button
              onClick={handleResetChallenge}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#cbd5e1',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Reset repository to mission starting point"
            >
              <RotateCcw size={13} />
              Reset Mission
            </button>
          </div>
        </div>

        <div style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.55, background: 'rgba(56, 189, 248, 0.04)', padding: '0.85rem 1rem', borderRadius: '8px', borderLeft: '3px solid #38bdf8' }}>
          <strong>Objective:</strong> {challenge.objective}
        </div>
      </div>

      {/* 2. LIVE INTERACTIVE PRACTICE WORKBENCH (2-Column Arena) */}
      <div
        className="academy-two-col-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)',
          gap: '1.25rem',
          alignItems: 'stretch',
          width: '100%',
        }}
      >
        {/* COLUMN 1: INTERACTIVE MISSION TERMINAL */}
        <div
          style={{
            background: '#040711',
            borderRadius: '12px',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            boxShadow: '0 8px 28px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minHeight: '420px',
          }}
        >
          {/* Terminal Topbar */}
          <div
            style={{
              padding: '0.65rem 1rem',
              background: '#090e1a',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '5px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              </div>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'monospace', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', marginLeft: '0.4rem' }}>
                <Terminal size={14} color="#38bdf8" />
                mission-sandbox: ~/project (main)
              </span>
            </div>

            <div style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'monospace' }}>
              bash v5.2
            </div>
          </div>

          {/* Terminal Output Stream */}
          <div
            style={{
              flex: 1,
              padding: '1rem',
              overflowY: 'auto',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: '0.8rem',
              lineHeight: 1.5,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              maxHeight: '340px',
            }}
          >
            {history.map((h, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8' }}>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>$</span>
                  <span style={{ fontWeight: 700, color: '#f8fafc' }}>{h.command}</span>
                </div>
                {h.output.map((line, lIdx) => (
                  <div
                    key={lIdx}
                    style={{
                      color: h.isError ? '#f87171' : line.includes('fatal:') ? '#f87171' : line.includes('Untracked') ? '#f59e0b' : '#94a3b8',
                      paddingLeft: '0.85rem',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {line}
                  </div>
                ))}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div
            style={{
              padding: '0.5rem 0.85rem',
              background: '#070b14',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              overflowX: 'auto',
            }}
          >
            <span style={{ fontSize: '0.68rem', color: '#64748b', whiteSpace: 'nowrap', fontWeight: 600 }}>
              Quick Commands:
            </span>
            {['git status', 'git diff', ...(challenge.expectedCommands || [])].slice(0, 4).map((cmd) => (
              <button
                key={cmd}
                onClick={() => handleRunCommand(cmd)}
                style={{
                  background: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  color: '#38bdf8',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontWeight: 600,
                  transition: 'all 0.15s ease',
                }}
                title={`Run: ${cmd}`}
              >
                $ {cmd}
              </button>
            ))}
          </div>

          {/* Terminal Input Prompt */}
          <div
            style={{
              padding: '0.65rem 0.85rem',
              background: '#090e1a',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <span style={{ color: '#10b981', fontWeight: 800, fontSize: '0.9rem', fontFamily: 'monospace' }}>$</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Type a command (e.g. ${expectedCommands[0] || 'git status'})...`}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#f8fafc',
                fontSize: '0.84rem',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                outline: 'none',
              }}
              autoFocus
            />
            <button
              onClick={() => handleRunCommand()}
              style={{
                background: '#38bdf8',
                border: 'none',
                color: '#040711',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              Run
              <CornerDownLeft size={13} />
            </button>
          </div>
        </div>

        {/* COLUMN 2: MISSION CHECKLIST & LIVE REPO INSPECTOR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Mission Verification Checklist */}
          <div
            style={{
              background: '#090e1a',
              border: allCriteriaPassed ? '1.5px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '1.15rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              boxShadow: allCriteriaPassed ? '0 0 24px rgba(16, 185, 129, 0.15)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Trophy size={16} color={allCriteriaPassed ? '#10b981' : '#38bdf8'} />
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f8fafc' }}>
                  Mission Criteria
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: allCriteriaPassed ? '#10b981' : '#94a3b8',
                  background: allCriteriaPassed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  padding: '0.15rem 0.55rem',
                  borderRadius: '999px',
                }}
              >
                {criteriaList.filter((c) => c.passed).length} / {criteriaList.length} Complete
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {criteriaList.map((crit, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    padding: '0.65rem 0.75rem',
                    background: crit.passed ? 'rgba(16, 185, 129, 0.08)' : '#040711',
                    border: crit.passed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ marginTop: '2px', flexShrink: 0 }}>
                    {crit.passed ? (
                      <CheckCircle2 size={16} color="#10b981" />
                    ) : (
                      <Circle size={16} color="#64748b" />
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: crit.passed ? '#f8fafc' : '#cbd5e1' }}>
                      {crit.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: crit.passed ? '#10b981' : '#94a3b8', lineHeight: 1.35 }}>
                      {crit.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Check Solution Button */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
              <button
                onClick={() => setHasCheckedSolution(true)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  background: allCriteriaPassed ? '#10b981' : 'rgba(56, 189, 248, 0.15)',
                  border: allCriteriaPassed ? 'none' : '1px solid #38bdf8',
                  color: allCriteriaPassed ? '#040711' : '#38bdf8',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {allCriteriaPassed ? <Check size={16} /> : <Play size={14} />}
                {allCriteriaPassed ? 'All Criteria Met! 🎉' : 'Verify My Progress'}
              </button>
            </div>

            {/* Feedback Alert when Checked */}
            {hasCheckedSolution && !allCriteriaPassed && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.76rem',
                  color: '#f59e0b',
                }}
              >
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>Keep going! Review the uncompleted criteria above and run the necessary commands in the terminal.</span>
              </div>
            )}
          </div>

          {/* Live 3-Area Inspector (Mini) */}
          <div
            style={{
              background: '#090e1a',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '1.15rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Layers size={16} color="#38bdf8" />
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc' }}>
                  Live Repository State
                </span>
              </div>
              <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                Real-time Inspection
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              {/* Working Tree Box */}
              <div
                style={{
                  background: '#040711',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: '8px',
                  padding: '0.65rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 800, color: '#f59e0b' }}>
                  <span>Working Tree</span>
                  <span>{workingFiles.length} file(s)</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', maxHeight: '75px', overflowY: 'auto' }}>
                  {workingFiles.length === 0 ? (
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Empty</span>
                  ) : (
                    workingFiles.map((f) => (
                      <div key={f} style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f}</span>
                        <span style={{ fontSize: '0.6rem', color: repo.index[f] ? '#38bdf8' : '#f59e0b' }}>
                          {repo.index[f] ? 'staged' : 'untracked'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Staging Area Box */}
              <div
                style={{
                  background: '#040711',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '8px',
                  padding: '0.65rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 800, color: '#38bdf8' }}>
                  <span>Staging Index</span>
                  <span>{stagedFiles.length} file(s)</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', maxHeight: '75px', overflowY: 'auto' }}>
                  {stagedFiles.length === 0 ? (
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Nothing staged</span>
                  ) : (
                    stagedFiles.map((f) => (
                      <div key={f} style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f}</span>
                        <span style={{ fontSize: '0.6rem', color: '#10b981' }}>READY</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Latest Commit Box */}
            <div
              style={{
                background: '#040711',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '8px',
                padding: '0.65rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                <Database size={14} color="#10b981" style={{ flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981' }}>
                    HEAD Commit
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                    {headCommit ? `${headCommit.shortHash} - ${headCommit.message}` : 'No commits yet'}
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '0.64rem', color: '#64748b', fontFamily: 'monospace', flexShrink: 0 }}>
                Total: {commitCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Success Celebration Banner (Shown when Mission Complete) */}
      {allCriteriaPassed && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%)',
            border: '1.5px solid #10b981',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981',
              }}
            >
              <Trophy size={22} />
            </span>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: '#f8fafc' }}>
                Mission Accomplished! You Mastered {concept.command}!
              </div>
              <div style={{ fontSize: '0.82rem', color: '#a7f3d0', marginTop: '0.2rem' }}>
                {challenge.solutionExplanation}
              </div>
            </div>
          </div>

          {!isCompleted && (
            <button
              onClick={() => markLessonComplete(concept.id)}
              style={{
                background: '#10b981',
                border: 'none',
                color: '#040711',
                padding: '0.55rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
              }}
            >
              <CheckCircle2 size={16} />
              Mark Concept as Learned
            </button>
          )}
        </div>
      )}

      {/* 4. Progressive Hints */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '12px',
          padding: '1.15rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.88rem', fontWeight: 700, color: '#f59e0b' }}>
            <Lightbulb size={16} />
            Progressive Hints & Solution Walkthrough
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[1, 2, 3].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setHintLevel(lvl)}
                style={{
                  padding: '0.3rem 0.7rem',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: hintLevel >= lvl ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: hintLevel >= lvl ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: hintLevel >= lvl ? '#f59e0b' : '#94a3b8',
                }}
              >
                Hint {lvl}
              </button>
            ))}
            <button
              onClick={() => setHintLevel(4)}
              style={{
                padding: '0.3rem 0.7rem',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: hintLevel === 4 ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                border: hintLevel === 4 ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                color: hintLevel === 4 ? '#38bdf8' : '#94a3b8',
              }}
            >
              Show Solution
            </button>
          </div>
        </div>

        {hintLevel > 0 && (
          <div
            style={{
              fontSize: '0.84rem',
              color: '#e2e8f0',
              padding: '0.75rem 1rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '8px',
              borderLeft: '3px solid #f59e0b',
              lineHeight: 1.5,
            }}
          >
            {hintLevel <= 3
              ? challenge.hints[hintLevel - 1] || challenge.hints[0]
              : challenge.solutionExplanation}
          </div>
        )}
      </div>

      {/* 5. Safe Failure & Recovery Laboratory */}
      <div
        style={{
          background: '#090e1a',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: '14px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={20} color="#ef4444" />
          <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
            Safe Failure Laboratory: Make a Mistake Without Fear
          </h2>
        </div>
        <div style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
          Senior developers are distinguished by how calmly they recover from mistakes. Test this real-world slip-up safely:
        </div>

        <div
          style={{
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.15)',
            borderRadius: '10px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f87171' }}>
            Scenario: {safeFailure.mistakeTitle}
          </div>

          {safeFailureState === 'idle' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                Simulate running the careless command:
              </div>
              <div>
                <button
                  onClick={handleSimulateMistake}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid #ef4444',
                    color: '#f87171',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'ui-monospace, monospace',
                  }}
                >
                  <Play size={13} />
                  Simulate Mistake: $ {safeFailure.mistakeCommand}
                </button>
              </div>
            </div>
          )}

          {safeFailureState === 'triggered' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ fontSize: '0.84rem', color: '#f87171', fontWeight: 600 }}>
                💥 What Happened: {safeFailure.whatHappened}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#22c55e', background: 'rgba(34, 197, 94, 0.08)', padding: '0.65rem', borderRadius: '6px' }}>
                🛡️ What was NOT lost: {safeFailure.whatWasNotLost}
              </div>
              <div>
                <button
                  onClick={handleExecuteRecovery}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: '#22c55e',
                    border: 'none',
                    color: '#090e1a',
                    padding: '0.55rem 1.15rem',
                    borderRadius: '8px',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    fontFamily: 'ui-monospace, monospace',
                  }}
                >
                  <ArrowRight size={15} />
                  Execute Recovery: $ {safeFailure.recoveryCommand}
                </button>
              </div>
            </div>
          )}

          {safeFailureState === 'recovered' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid #22c55e',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22c55e', fontSize: '0.86rem', fontWeight: 700 }}>
                <CheckCircle2 size={18} />
                Successfully Recovered! {safeFailure.recoveryExplanation}
              </div>
              <button
                onClick={() => setSafeFailureState('idle')}
                style={{
                  background: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#cbd5e1',
                  borderRadius: '6px',
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.74rem',
                  cursor: 'pointer',
                }}
              >
                Reset Failure Sim
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
