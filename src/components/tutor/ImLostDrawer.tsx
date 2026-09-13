import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  RotateCcw,
  Play,
  ArrowRight,
  HelpCircle,
  AlertTriangle,
  Compass,
} from 'lucide-react';

interface ImLostDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImLostDrawer: React.FC<ImLostDrawerProps> = ({ isOpen, onClose }) => {
  const { repo, resetCurrentExercise, executeCommand, setMode } = useApp();
  const [selectedIssue, setSelectedIssue] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const changedFiles = Object.keys(repo.workingDirectory);
  const stagedFiles = Object.keys(repo.index);

  const ISSUES = [
    {
      id: 'dont-understand',
      text: "I don't understand what's happening",
      explanation: `Right now, Git is looking at your project folder. You have ${changedFiles.length} file(s) on your desk, and ${stagedFiles.length} file(s) in the packing box. Remember: changes happen on your desk first, then you pack them with \`git add\`, then seal them with \`git commit\`.`,
      suggestedCmd: 'git status',
      cmdLabel: 'Run git status to inspect state',
    },
    {
      id: 'dont-know-cmd',
      text: "I don't know what command to use",
      explanation:
        stagedFiles.length > 0
          ? 'You already have files packed in the box! The next step is to seal your snapshot: `git commit -m "Your message"`.'
          : changedFiles.length > 0
          ? 'You have edits on your desk. To pack them into the box, run: `git add <filename>` (e.g. `git add index.html`).'
          : 'Everything is clean! Check your position with `pwd` or view history with `git log`.',
      suggestedCmd: stagedFiles.length > 0 ? 'git commit -m "Save progress"' : 'git status',
      cmdLabel: stagedFiles.length > 0 ? 'Run git commit' : 'Run git status',
    },
    {
      id: 'got-error',
      text: 'I ran a command and got an error',
      explanation:
        'Errors are normal in software development! In Git, most errors happen when typing flags without spaces, forgetting quotes in commit messages, or trying to commit when nothing is staged.',
      suggestedCmd: 'git status',
      cmdLabel: 'Check repository status',
    },
    {
      id: 'broke-something',
      text: 'I think I broke something',
      explanation:
        'Good news: in Git, almost nothing is permanently lost! You can safely reset this exercise to return to the clean starting state.',
      suggestedCmd: 'reset',
      cmdLabel: 'Reset this exercise safely',
    },
  ];

  const handleAction = (cmd: string) => {
    if (cmd === 'reset') {
      resetCurrentExercise();
      onClose();
    } else {
      executeCommand(cmd);
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#131d33',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          maxWidth: '560px',
          width: '100%',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Screen 5: I'm Lost 🙁) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2
              style={{
                fontSize: '1.4rem',
                fontWeight: 900,
                color: '#f8fafc',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              I'm Lost 🙁
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', margin: '0.25rem 0 0 0' }}>
              No problem. What are you stuck on?
            </p>
          </div>

          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#94a3b8',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 4 Selectable Issues */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {ISSUES.map((issue, idx) => {
            const isSelected = selectedIssue === idx;
            return (
              <div
                key={issue.id}
                onClick={() => setSelectedIssue(isSelected ? null : idx)}
                style={{
                  background: isSelected ? 'rgba(56, 189, 248, 0.08)' : '#0e172a',
                  border: `1px solid ${isSelected ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '10px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? '#38bdf8' : '#64748b'}`,
                      background: isSelected ? '#38bdf8' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: '0.92rem', fontWeight: 600, color: isSelected ? '#ffffff' : '#cbd5e1' }}>
                    {issue.text}
                  </span>
                </div>

                {/* Expanded guidance */}
                {isSelected && (
                  <div
                    style={{
                      paddingTop: '0.4rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      fontSize: '0.85rem',
                      color: '#94a3b8',
                      lineHeight: 1.5,
                    }}
                  >
                    <div>{issue.explanation}</div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction(issue.suggestedCmd);
                        }}
                        style={{
                          background: '#2563eb',
                          color: 'white',
                          border: 'none',
                          padding: '0.6rem 1rem',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                        }}
                      >
                        <Play size={13} /> {issue.cmdLabel}
                      </button>

                      {issue.id === 'dont-know-cmd' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMode('discover');
                            onClose();
                          }}
                          style={{
                            background: 'rgba(56, 189, 248, 0.15)',
                            color: '#38bdf8',
                            border: '1px solid rgba(56, 189, 248, 0.35)',
                            padding: '0.6rem 1rem',
                            borderRadius: '6px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                          }}
                        >
                          <Compass size={14} /> Open "What should I do?" (Screen 6)
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Friendly Reassurance Note (Screen 5 footer) */}
        <div
          style={{
            fontSize: '0.82rem',
            color: '#64748b',
            textAlign: 'center',
            lineHeight: 1.5,
            marginTop: '0.25rem',
          }}
        >
          You can always ask. Everyone gets stuck!
          <br />
          That's how developers learn.
        </div>
      </div>
    </div>
  );
};
