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
      prompt: 'You changed a file and want to save it as a new permanent version in Git.',
      tools: [
        {
          command: 'git add',
          badge: 'SAFE',
          description: 'Stages the file into the packing box.',
          isBestChoice: true,
          explanation: 'git add prepares the file by placing it into the staging area so you can review it before sealing the snapshot.',
        },
        {
          command: 'git commit',
          badge: 'LOW RISK',
          description: 'Saves staged changes into history.',
          isBestChoice: false,
          explanation: 'git commit seals staged files into permanent history. Remember: you must stage files with git add first!',
        },
        {
          command: 'git reset --hard',
          badge: 'HIGH RISK',
          description: 'Discards all uncommitted changes.',
          isBestChoice: false,
          explanation: 'git reset --hard will destroy your uncommitted work! Only use this if you want to permanently erase changes.',
        },
        {
          command: 'git restore',
          badge: 'MEDIUM',
          description: 'Reverts file edits back to previous commit.',
          isBestChoice: false,
          explanation: 'git restore discards changes in this file instead of saving them.',
        },
      ],
    },
    {
      id: 'undo-file',
      title: 'Discard Mistakes',
      prompt: 'You made experimental edits to a file that broke the app and you want to throw them away cleanly.',
      tools: [
        {
          command: 'git restore',
          badge: 'SAFE',
          description: 'Surgically discards uncommitted file edits.',
          isBestChoice: true,
          explanation: 'git restore surgically discards edits in the working tree without affecting any other files, branches, or commits.',
        },
        {
          command: 'git add',
          badge: 'MEDIUM',
          description: 'Stages the broken file.',
          isBestChoice: false,
          explanation: 'Staging broken code prepares it to be committed, which is the exact opposite of discarding it.',
        },
        {
          command: 'git reset --hard',
          badge: 'HIGH RISK',
          description: 'Destroys all changes across every file.',
          isBestChoice: false,
          explanation: 'Too destructive: it wipes all files across the whole project, not just this one broken file.',
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
      prompt: 'Your team lead asks you to urgently switch branches, but your current edits are halfway done.',
      tools: [
        {
          command: 'git stash',
          badge: 'SAFE',
          description: 'Temporarily shelves dirty changes in a drawer.',
          isBestChoice: true,
          explanation: 'git stash saves your dirty edits to a temporary clipboard shelf so you can switch branches with a clean slate.',
        },
        {
          command: 'git commit',
          badge: 'MEDIUM',
          description: 'Commits unfinished code.',
          isBestChoice: false,
          explanation: 'Pollutes git history with half-finished WIP commits.',
        },
        {
          command: 'git reset --hard',
          badge: 'HIGH RISK',
          description: 'Erases all progress on your desk.',
          isBestChoice: false,
          explanation: 'Destroys all your work instead of shelving it.',
        },
        {
          command: 'git switch',
          badge: 'MEDIUM',
          description: 'May block switch if files collide.',
          isBestChoice: false,
          explanation: 'Git will refuse to switch branches if dirty files would be overwritten by the destination branch.',
        },
      ],
    },
    {
      id: 'merge-conflict',
      title: 'Collision on Merge',
      prompt: 'You ran git merge feature/navbar and Git reports CONFLICT in index.html.',
      tools: [
        {
          command: 'git diff',
          badge: 'SAFE',
          description: 'Inspects conflict markers (<<<< / ==== / >>>>).',
          isBestChoice: true,
          explanation: 'Always inspect conflict markers first to understand what both sides edited before choosing or combining.',
        },
        {
          command: 'git merge --abort',
          badge: 'SAFE',
          description: 'Cancels the merge and returns to clean state.',
          isBestChoice: false,
          explanation: 'Use git merge --abort when you want to step back, communicate with teammates, and re-attempt later.',
        },
        {
          command: 'git add <file>',
          badge: 'LOW RISK',
          description: 'Marks conflict as resolved.',
          isBestChoice: false,
          explanation: 'Run git add only AFTER you have manually edited the file to remove conflict markers.',
        },
        {
          command: 'git reset --hard',
          badge: 'HIGH RISK',
          description: 'Wipes merge state and uncommitted work.',
          isBestChoice: false,
          explanation: 'Prefer `git merge --abort` over reset --hard when aborting a conflicted merge.',
        },
      ],
    },
    {
      id: 'accidental-main-commit',
      title: 'Committed to Main',
      prompt: 'You committed a new feature directly to main instead of creating a feature branch first.',
      tools: [
        {
          command: 'git branch feature && git reset --soft HEAD~1',
          badge: 'SAFE',
          description: 'Preserves commit on feature branch, rewinds main.',
          isBestChoice: true,
          explanation: 'Creates the feature branch pointing at your new commit, then safely rewinds main back one commit with your edits intact.',
        },
        {
          command: 'git push --force origin main',
          badge: 'HIGH RISK',
          description: 'Forces untested feature straight to production.',
          isBestChoice: false,
          explanation: 'Danger! Never force push unreviewed feature commits to the team\'s main branch.',
        },
        {
          command: 'git revert HEAD',
          badge: 'MEDIUM',
          description: 'Creates an inverse commit on main.',
          isBestChoice: false,
          explanation: 'Leaves an unnecessary commit-revert cycle on main when local history hasn\'t even been pushed yet.',
        },
        {
          command: 'git reset --hard HEAD~1',
          badge: 'HIGH RISK',
          description: 'Deletes your new feature code completely.',
          isBestChoice: false,
          explanation: 'Wipes the commit and all your hard work from disk without saving it anywhere.',
        },
      ],
    },
    {
      id: 'push-rejected',
      title: 'Remote Push Rejected',
      prompt: 'You ran git push, but GitHub rejected it: "[rejected - non-fast-forward] fetch first".',
      tools: [
        {
          command: 'git pull --rebase origin <branch>',
          badge: 'SAFE',
          description: 'Replays local commits on top of remote updates.',
          isBestChoice: true,
          explanation: 'Downloads teammates\' updates and replays your local commits cleanly on top, keeping history linear and conflict-free.',
        },
        {
          command: 'git push --force',
          badge: 'HIGH RISK',
          description: 'Overwrites teammates\' work on remote.',
          isBestChoice: false,
          explanation: 'Destroys all commits pushed by other teammates since your last fetch!',
        },
        {
          command: 'git clone <url>',
          badge: 'LOW RISK',
          description: 'Re-clones the entire repository from scratch.',
          isBestChoice: false,
          explanation: 'Wasteful and cumbersome: leaves your local unpushed commits stranded in the old folder.',
        },
        {
          command: 'git reset --hard origin/main',
          badge: 'HIGH RISK',
          description: 'Erases all your unpushed commits.',
          isBestChoice: false,
          explanation: 'Discards all your local work to match the server instead of integrating it.',
        },
      ],
    },
    {
      id: 'regression-hunting',
      title: 'Pinpoint Regression Bug',
      prompt: 'A critical bug exists in production that wasn\'t there 2 weeks ago across 200 commits.',
      tools: [
        {
          command: 'git bisect',
          badge: 'SAFE',
          description: 'Binary search to pinpoint exact bug commit.',
          isBestChoice: true,
          explanation: 'git bisect uses binary search (log2 N), finding the exact commit that introduced the bug in just ~7 test steps instead of 200.',
        },
        {
          command: 'git log -p',
          badge: 'SAFE',
          description: 'Manually read 200 commit diffs.',
          isBestChoice: false,
          explanation: 'Extremely slow and fatigue-inducing compared to automated binary search with git bisect.',
        },
        {
          command: 'git reset --hard HEAD~50',
          badge: 'HIGH RISK',
          description: 'Blindly roll back 50 commits.',
          isBestChoice: false,
          explanation: 'Deletes 50 legitimate features without knowing if the bug was even introduced in that window.',
        },
        {
          command: 'git revert HEAD',
          badge: 'LOW RISK',
          description: 'Reverts the most recent commit.',
          isBestChoice: false,
          explanation: 'Useless if the bug was introduced 10 or 50 commits ago.',
        },
      ],
    },
    {
      id: 'detached-head-rescue',
      title: 'Detached HEAD Rescue',
      prompt: 'You inspected an old commit, made 2 experimental commits, and now notice "HEAD detached at a1b2c3d".',
      tools: [
        {
          command: 'git switch -c new-feature-branch',
          badge: 'SAFE',
          description: 'Attaches a new branch name to current HEAD.',
          isBestChoice: true,
          explanation: 'Creates and switches to a new branch at your current commit so your new commits are permanently tracked and safe.',
        },
        {
          command: 'git switch main',
          badge: 'HIGH RISK',
          description: 'Abandons detached commits to garbage collection.',
          isBestChoice: false,
          explanation: 'If you switch away without creating a branch, your commits become orphans and are eventually deleted.',
        },
        {
          command: 'git reset --hard',
          badge: 'HIGH RISK',
          description: 'Erases all detached work.',
          isBestChoice: false,
          explanation: 'Immediately deletes all your experimental progress.',
        },
        {
          command: 'git commit --amend',
          badge: 'LOW RISK',
          description: 'Modifies the last detached commit.',
          isBestChoice: false,
          explanation: 'Does not solve the detached HEAD problem; you still need a branch pointer.',
        },
      ],
    },
    {
      id: 'cleanup-wip',
      title: 'Clean Up Messy Commits',
      prompt: 'Before opening a PR, your branch has 5 messy commits: "wip", "fix typo", "oops", "works now".',
      tools: [
        {
          command: 'git rebase -i HEAD~5',
          badge: 'SAFE',
          description: 'Interactive rebase to squash and reword.',
          isBestChoice: true,
          explanation: 'Allows combining (squashing) micro-commits into clean, atomic milestones with professional messages before team review.',
        },
        {
          command: 'git merge --no-ff',
          badge: 'LOW RISK',
          description: 'Merges with all messy commits intact.',
          isBestChoice: false,
          explanation: 'Pollutes the shared project git history with confusing "wip" and "oops" commits.',
        },
        {
          command: 'git push --force-with-lease',
          badge: 'MEDIUM',
          description: 'Pushes messy commits directly.',
          isBestChoice: false,
          explanation: 'Does not clean up the commit history.',
        },
        {
          command: 'git reset --hard main',
          badge: 'HIGH RISK',
          description: 'Destroys all branch commits completely.',
          isBestChoice: false,
          explanation: 'Erases all 5 commits and all feature code.',
        },
      ],
    },
    {
      id: 'inspect-internals',
      title: 'Verify Database & Forensics',
      prompt: 'You want to verify the cryptographic SHA-1 integrity of your repository and inspect raw objects.',
      tools: [
        {
          command: 'git fsck && git cat-file -p HEAD',
          badge: 'SAFE',
          description: 'Verifies DB integrity & inspects commit object.',
          isBestChoice: true,
          explanation: 'git fsck verifies internal database integrity, while git cat-file pretty-prints raw blob, tree, and commit metadata safely.',
        },
        {
          command: 'cat .git/objects/*',
          badge: 'MEDIUM',
          description: 'Directly reads binary compressed zlib files.',
          isBestChoice: false,
          explanation: 'Git object files are zlib-compressed binary hashes; reading them directly outputs unreadable binary gibberish.',
        },
        {
          command: 'rm -rf .git/objects',
          badge: 'HIGH RISK',
          description: 'Deletes the entire Git database.',
          isBestChoice: false,
          explanation: 'Catastrophic! Permanently deletes every commit, blob, and tree in project history.',
        },
        {
          command: 'git clean -fdx',
          badge: 'MEDIUM',
          description: 'Cleans untracked ignored workspace files.',
          isBestChoice: false,
          explanation: 'Cleans workspace files but does not verify or inspect the .git internal object database.',
        },
      ],
    },
  ];

  const currentScenario = SCENARIOS[selectedScenarioIndex];

  const handleTryThis = (toolIndex: number, tool: ScenarioTool) => {
    setActiveToolFeedback({ toolIndex, executed: true });
    // Execute safe commands in engine if applicable
    if (tool.command.includes('git add')) {
      executeCommand('git add .');
    } else if (tool.command.includes('git commit')) {
      executeCommand('git commit -m "Auto save"');
    } else if (tool.command.includes('git restore')) {
      executeCommand('git status');
    } else if (tool.command.includes('git stash')) {
      executeCommand('git stash');
    } else if (tool.command.includes('git branch')) {
      executeCommand('git branch');
    } else if (tool.command.includes('git diff')) {
      executeCommand('git diff');
    } else if (tool.command.includes('git log')) {
      executeCommand('git log --oneline -n 5');
    } else if (tool.command.includes('git cat-file')) {
      executeCommand('git cat-file -p HEAD');
    } else {
      executeCommand('git status');
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
          <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', maxWidth: '680px', justifyContent: 'flex-end' }}>
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
                  border: selectedScenarioIndex === idx ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: selectedScenarioIndex === idx ? '0 2px 10px rgba(37, 99, 235, 0.4)' : 'none',
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
