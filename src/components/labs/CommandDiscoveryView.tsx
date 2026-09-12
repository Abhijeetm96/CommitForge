import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface ScenarioTool {
  command: string;
  badge: 'SAFE' | 'LOW RISK' | 'MEDIUM' | 'HIGH RISK';
  description: string;
  isBestChoice: boolean;
  explanation: string;
}

interface ScenarioItem {
  id: string;
  title: string;
  prompt: string;
  tools: ScenarioTool[];
}

export const CommandDiscoveryView: React.FC = () => {
  const { executeCommand } = useApp();
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [activeToolFeedback, setActiveToolFeedback] = useState<{
    toolIndex: number;
    executed: boolean;
  } | null>(null);

  const SCENARIOS: ScenarioItem[] = [
    {
      id: 'save-version',
      title: 'Save Changed File',
      prompt: 'You changed a file and want to save it as a new version.',
      tools: [
        {
          command: 'git add',
          badge: 'SAFE',
          description: 'Stages the file for commit.',
          isBestChoice: true,
          explanation: 'git add prepares the file by placing it into the staging area so you can inspect it before committing.',
        },
        {
          command: 'git commit',
          badge: 'LOW RISK',
          description: 'Saves a new version.',
          isBestChoice: false,
          explanation: 'git commit seals staged files into a permanent snapshot. Remember to git add first!',
        },
        {
          command: 'git reset --hard',
          badge: 'HIGH RISK',
          description: 'Discards your changes.',
          isBestChoice: false,
          explanation: 'git reset --hard will destroy your changes! Only use this if you truly want to wipe all work.',
        },
        {
          command: 'git restore',
          badge: 'MEDIUM',
          description: 'Undo changes to a file.',
          isBestChoice: false,
          explanation: 'git restore will revert this file back to its previous version, discarding current edits.',
        },
      ],
    },
    {
      id: 'undo-file',
      title: 'Discard Mistakes',
      prompt: 'You made experimental edits to a file that broke the app and you want to throw them away.',
      tools: [
        {
          command: 'git restore',
          badge: 'SAFE',
          description: 'Discards uncommitted working file edits.',
          isBestChoice: true,
          explanation: 'git restore surgically discards edits in the working tree without affecting any other files or commits.',
        },
        {
          command: 'git add',
          badge: 'MEDIUM',
          description: 'Stages the broken file.',
          isBestChoice: false,
          explanation: 'Staging broken code prepares it to be committed, which is the opposite of discarding it.',
        },
        {
          command: 'git reset --hard',
          badge: 'HIGH RISK',
          description: 'Destroys all changes in every file.',
          isBestChoice: false,
          explanation: 'Too destructive: it wipes all files across the whole project, not just this one file.',
        },
        {
          command: 'git commit',
          badge: 'HIGH RISK',
          description: 'Permanently records the broken code.',
          isBestChoice: false,
          explanation: 'Never commit broken code you wanted to throw away!',
        },
      ],
    },
    {
      id: 'pause-work',
      title: 'Urgent Task Switch',
      prompt: 'Your manager asks you to urgently switch branches, but your current edits are unfinished.',
      tools: [
        {
          command: 'git stash',
          badge: 'SAFE',
          description: 'Temporarily shelves dirty changes.',
          isBestChoice: true,
          explanation: 'git stash saves your dirty edits to a temporary clipboard so you can switch branches with a clean slate.',
        },
        {
          command: 'git commit',
          badge: 'MEDIUM',
          description: 'Commits unfinished code.',
          isBestChoice: false,
          explanation: 'Pollutes git history with broken WIP commits.',
        },
        {
          command: 'git reset --hard',
          badge: 'HIGH RISK',
          description: 'Erases all progress.',
          isBestChoice: false,
          explanation: 'Destroys all your work instead of shelving it.',
        },
        {
          command: 'git checkout',
          badge: 'MEDIUM',
          description: 'May block switch if files conflict.',
          isBestChoice: false,
          explanation: 'Git will refuse to switch branches if dirty files would be overwritten.',
        },
      ],
    },
  ];

  const currentScenario = SCENARIOS[selectedScenarioIndex];

  const handleTryThis = (toolIndex: number, tool: ScenarioTool) => {
    setActiveToolFeedback({ toolIndex, executed: true });
    // Execute safe commands in engine if applicable
    if (tool.command === 'git add') {
      executeCommand('git add .');
    } else if (tool.command === 'git commit') {
      executeCommand('git commit -m "Auto save"');
    } else if (tool.command === 'git restore') {
      executeCommand('git status');
    } else if (tool.command === 'git stash') {
      executeCommand('git stash');
    }
  };

  return (
    <div
      style={{
        flex: 1,
        padding: '2.5rem 2rem',
        background: '#0b111e',
        color: '#f8fafc',
        overflowY: 'auto',
        minHeight: 'calc(100vh - 60px)',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Title Bar (Screen 6: What should I do?) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(240, 80, 51, 0.15)',
                color: '#f05033',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Compass size={22} />
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
              What should I do?
            </h1>
          </div>

          {/* Scenario Switcher Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {SCENARIOS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedScenarioIndex(idx);
                  setActiveToolFeedback(null);
                }}
                style={{
                  background: selectedScenarioIndex === idx ? '#2563eb' : '#131d33',
                  color: selectedScenarioIndex === idx ? '#ffffff' : '#94a3b8',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>

        {/* Scenario Card (Screen 6) */}
        <div
          style={{
            background: '#131d33',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
              flexShrink: 0,
            }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Scenario
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc', marginTop: '0.2rem' }}>
              {currentScenario.prompt}
            </div>
          </div>
        </div>

        {/* 4 Tool Cards in a Row (Screen 6) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {currentScenario.tools.map((tool, idx) => {
            const isSelected = activeToolFeedback?.toolIndex === idx;
            const badgeBg =
              tool.badge === 'SAFE'
                ? 'rgba(16, 185, 129, 0.15)'
                : tool.badge === 'LOW RISK'
                ? 'rgba(245, 158, 11, 0.15)'
                : tool.badge === 'MEDIUM'
                ? 'rgba(245, 158, 11, 0.15)'
                : 'rgba(239, 68, 68, 0.15)';
            const badgeColor =
              tool.badge === 'SAFE'
                ? '#10b981'
                : tool.badge === 'LOW RISK'
                ? '#f59e0b'
                : tool.badge === 'MEDIUM'
                ? '#f59e0b'
                : '#ef4444';

            return (
              <div
                key={tool.command}
                style={{
                  background: isSelected ? 'rgba(37, 99, 235, 0.08)' : '#131d33',
                  border: `1px solid ${isSelected ? '#2563eb' : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 8px 24px rgba(37, 99, 235, 0.2)' : 'none',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'monospace' }}>
                    {tool.command}
                  </div>

                  {/* Badge Pill */}
                  <div
                    style={{
                      alignSelf: 'flex-start',
                      background: badgeBg,
                      color: badgeColor,
                      padding: '0.2rem 0.65rem',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: badgeColor }} />
                    {tool.badge}
                  </div>

                  {/* Description Subtitle */}
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.45 }}>
                    {tool.description}
                  </div>
                </div>

                {/* Primary Button: Try this */}
                <button
                  onClick={() => handleTryThis(idx, tool)}
                  style={{
                    width: '100%',
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    transition: 'background 0.15s ease',
                  }}
                >
                  Try this
                </button>
              </div>
            );
          })}
        </div>

        {/* Selected Tool Educational Feedback */}
        {activeToolFeedback !== null && (
          <div
            style={{
              background: currentScenario.tools[activeToolFeedback.toolIndex].isBestChoice
                ? 'rgba(16, 185, 129, 0.1)'
                : 'rgba(245, 158, 11, 0.1)',
              border: `1px solid ${
                currentScenario.tools[activeToolFeedback.toolIndex].isBestChoice ? '#10b981' : '#f59e0b'
              }`,
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
            }}
          >
            {currentScenario.tools[activeToolFeedback.toolIndex].isBestChoice ? (
              <CheckCircle2 size={24} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
            ) : (
              <AlertTriangle size={24} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
            )}
            <div>
              <div
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: currentScenario.tools[activeToolFeedback.toolIndex].isBestChoice ? '#10b981' : '#f59e0b',
                }}
              >
                {currentScenario.tools[activeToolFeedback.toolIndex].isBestChoice
                  ? 'Recommended Choice!'
                  : 'Important Note:'}
              </div>
              <div style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: '0.3rem', lineHeight: 1.5 }}>
                {currentScenario.tools[activeToolFeedback.toolIndex].explanation}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
