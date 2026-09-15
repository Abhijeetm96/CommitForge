import React, { useState } from 'react';
import { GitRepo } from '../../git-engine/types';
import {
  Target,
  CheckCircle2,
  Circle,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from 'lucide-react';

interface Props {
  repo: GitRepo;
  commandHistory: string[];
  terminalOutput: { command: string; output: string[] }[];
  terminalInput: string;
  onInputChange: (val: string) => void;
  onSubmitCommand: (e: React.FormEvent) => void;
  terminalEndRef: React.RefObject<HTMLDivElement | null>;
  onResetChallenge: () => void;
}

export const IndependentChallengeView: React.FC<Props> = ({
  repo,
  commandHistory,
  terminalOutput,
  terminalInput,
  onInputChange,
  onSubmitCommand,
  terminalEndRef,
  onResetChallenge,
}) => {
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [showHints, setShowHints] = useState<boolean>(false);

  // Progressive hints
  const HINTS = [
    'Think about what Git is asking you to do before creating a snapshot: inspect what is on your desk.',
    'You need to choose which changes belong in the next commit, leaving temporary notes unstaged.',
    'Which Git command prepares changes for a commit? Think about adding the specific file.',
    'Try running `git status`, then `git add about.html`, then `git commit -m "..."`.',
  ];

  // Evaluate 6-point checklist from repo and history
  const hasCheckedStatus = commandHistory.some((c) => c.trim().startsWith('git status'));
  const isAboutStaged = repo.index['about.html'] !== undefined;
  const isNotesStaged = repo.index['notes.tmp'] !== undefined;

  const headCommitHash = repo.branches['main']?.targetCommitHash;
  const headCommit = headCommitHash ? repo.commits[headCommitHash] : undefined;
  const commitCount = Object.keys(repo.commits).length;

  const hasNewCommit = commitCount >= 2;
  const isAboutInCommit = headCommit?.files['about.html'] !== undefined;
  const isNotesInCommit = headCommit?.files['notes.tmp'] !== undefined;
  const isSafetyHonored = !isNotesInCommit && !isNotesStaged;

  const hasVerified =
    hasNewCommit &&
    commandHistory
      .slice(-3)
      .some((c) => c.trim().startsWith('git status') || c.trim().startsWith('git log'));

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',
        gap: '1rem',
        height: '100%',
        padding: '1rem',
        overflow: 'hidden',
      }}
    >
      {/* LEFT: MISSION BRIEFING & 6-POINT EVALUATION CHECKLIST */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          overflowY: 'auto',
          paddingRight: '0.4rem',
        }}
      >
        {/* MISSION CARD */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '8px',
            padding: '1rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: '#38bdf8',
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '0.35rem',
            }}
          >
            <Target size={14} />
            <span>Developer Mission</span>
          </div>

          <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>
            Deploying the Portfolio
          </h3>

          <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.82rem', lineHeight: 1.45 }}>
            You finished writing <code style={{ color: '#86efac' }}>about.html</code>. Your desk also has temporary scratch notes in <code style={{ color: '#fca5a5' }}>notes.tmp</code>.
          </p>

          <div style={{ marginTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.78rem', color: '#94a3b8' }}>
            <div>1. Inspect the repository.</div>
            <div>2. Stage <strong>ONLY</strong> <code style={{ color: '#86efac' }}>about.html</code>.</div>
            <div>3. Commit it with a meaningful message.</div>
            <div>4. Verify that <code style={{ color: '#fca5a5' }}>notes.tmp</code> was not committed.</div>
          </div>
        </div>

        {/* 6-POINT EVALUATION CHECKLIST */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '1rem',
          }}
        >
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#94a3b8',
              letterSpacing: '0.04em',
              marginBottom: '0.6rem',
            }}
          >
            Real-Time Evaluation Checklist
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {/* 1. Recognition */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
              {hasCheckedStatus ? (
                <CheckCircle2 size={16} color="#4ade80" />
              ) : (
                <Circle size={16} color="#64748b" />
              )}
              <span style={{ color: hasCheckedStatus ? '#f8fafc' : '#94a3b8' }}>
                Recognition: Inspected repository status with <code style={{ fontSize: '0.75rem' }}>git status</code>
              </span>
            </div>

            {/* 2. Choice */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
              {isAboutStaged ? (
                <CheckCircle2 size={16} color="#4ade80" />
              ) : (
                <Circle size={16} color="#64748b" />
              )}
              <span style={{ color: isAboutStaged ? '#f8fafc' : '#94a3b8' }}>
                Choice: Selected <code style={{ fontSize: '0.75rem' }}>about.html</code> for staging
              </span>
            </div>

            {/* 3. Safety */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
              {isSafetyHonored ? (
                <CheckCircle2 size={16} color="#4ade80" />
              ) : (
                <AlertTriangle size={16} color="#f59e0b" />
              )}
              <span style={{ color: isSafetyHonored ? '#f8fafc' : '#fca5a5' }}>
                Safety: Excluded <code style={{ fontSize: '0.75rem' }}>notes.tmp</code> from staging
              </span>
            </div>

            {/* 4. Execution */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
              {isAboutStaged && !isNotesStaged ? (
                <CheckCircle2 size={16} color="#4ade80" />
              ) : (
                <Circle size={16} color="#64748b" />
              )}
              <span style={{ color: isAboutStaged && !isNotesStaged ? '#f8fafc' : '#94a3b8' }}>
                Execution: Staged only <code style={{ fontSize: '0.75rem' }}>about.html</code>
              </span>
            </div>

            {/* 5. Commit */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
              {hasNewCommit && isAboutInCommit ? (
                <CheckCircle2 size={16} color="#4ade80" />
              ) : (
                <Circle size={16} color="#64748b" />
              )}
              <span style={{ color: hasNewCommit && isAboutInCommit ? '#f8fafc' : '#94a3b8' }}>
                Commit: Created milestone containing <code style={{ fontSize: '0.75rem' }}>about.html</code>
              </span>
            </div>

            {/* 6. Verification */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
              {hasVerified ? (
                <CheckCircle2 size={16} color="#4ade80" />
              ) : (
                <Circle size={16} color="#64748b" />
              )}
              <span style={{ color: hasVerified ? '#f8fafc' : '#94a3b8' }}>
                Verification: Verified result with status or log
              </span>
            </div>
          </div>
        </div>

        {/* GENTLE MISTAKE ADVICE (IF NOTES.TMP IS ACCIDENTALLY STAGED) */}
        {isNotesStaged && (
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '8px',
              padding: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', fontSize: '0.75rem', fontWeight: 800 }}>
              <AlertTriangle size={14} />
              <span>Senior Dev Observation</span>
            </div>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.78rem', color: '#fde68a', lineHeight: 1.4 }}>
              Notice that <code style={{ color: '#fff' }}>notes.tmp</code> entered the staging box! Don’t panic—it hasn’t been committed yet. Unstage it safely using:
              <br />
              <code style={{ background: 'rgba(0,0,0,0.4)', padding: '0.1rem 0.35rem', borderRadius: '3px', marginTop: '0.3rem', display: 'inline-block' }}>
                git restore --staged notes.tmp
              </code>
            </p>
          </div>
        )}

        {/* PROGRESSIVE HINTS DRAWER */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setShowHints(!showHints)}
              style={{
                background: 'none',
                border: 'none',
                color: '#38bdf8',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <HelpCircle size={14} />
              <span>{showHints ? 'Hide Hints' : 'Request Progressive Hint'}</span>
              {showHints ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            <button
              type="button"
              onClick={onResetChallenge}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '0.72rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                cursor: 'pointer',
              }}
              title="Reset challenge files to start over"
            >
              <RotateCcw size={12} />
              <span>Reset Challenge</span>
            </button>
          </div>

          {showHints && (
            <div style={{ marginTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                <strong>Hint {hintLevel + 1} of 4:</strong> {HINTS[hintLevel]}
              </div>
              {hintLevel < HINTS.length - 1 && (
                <button
                  type="button"
                  onClick={() => setHintLevel((prev) => prev + 1)}
                  style={{
                    alignSelf: 'flex-start',
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#38bdf8',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    marginTop: '0.2rem',
                  }}
                >
                  Need more specific guidance?
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: REAL TERMINAL WORKSPACE */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          background: '#050811',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '0.5rem 0.85rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            fontSize: '0.75rem',
            color: '#94a3b8',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>Developer Terminal</span>
          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>portfolio-website</span>
        </div>

        {/* OUTPUT STREAM */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0.75rem',
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            lineHeight: 1.45,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            color: '#f8fafc',
          }}
        >
          {terminalOutput.length === 0 && (
            <div style={{ color: '#475569', fontStyle: 'italic' }}>
              Your terminal is ready. Run commands to inspect and complete your mission.
            </div>
          )}
          {terminalOutput.map((item, idx) => (
            <div key={idx}>
              <div style={{ color: '#38bdf8' }}>$ {item.command}</div>
              <div style={{ color: '#cbd5e1', whiteSpace: 'pre-wrap', paddingLeft: '0.5rem' }}>
                {item.output.join('\n')}
              </div>
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* INPUT FORM */}
        <form
          onSubmit={onSubmitCommand}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 0.75rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            background: '#070b14',
          }}
        >
          <span style={{ color: '#38bdf8', fontFamily: 'monospace', fontWeight: 800 }}>$</span>
          <input
            type="text"
            value={terminalInput}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Type git command..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#f8fafc',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
            }}
          />
          <button
            type="submit"
            style={{
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              padding: '0.3rem 0.7rem',
              borderRadius: '4px',
              fontSize: '0.74rem',
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
