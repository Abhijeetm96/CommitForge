import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, Terminal, ArrowRight, BookOpen, Sparkles } from 'lucide-react';

interface AtlasEntry {
  id: string;
  intent: string;
  command: string;
  purpose: string;
  whenToUse: string;
  relatedCategory: string;
  relatedConceptId?: string;
  keywords: string[];
}

const COMMAND_ATLAS_ENTRIES: AtlasEntry[] = [
  {
    id: 'cmd-undo',
    intent: 'Undo uncommitted changes in a file',
    command: 'git restore <file>',
    purpose: 'Discards working tree modifications and restores the file from the index.',
    whenToUse: 'When you made edits in a file that you want to completely throw away.',
    relatedCategory: 'Undo & Recover',
    relatedConceptId: 'c-restore',
    keywords: ['undo', 'discard', 'revert changes', 'throw away', 'restore', 'cancel edit'],
  },
  {
    id: 'cmd-unstage',
    intent: 'Unstage a staged file without losing edits',
    command: 'git restore --staged <file>',
    purpose: 'Removes file from the staging area while leaving your file modifications safe on disk.',
    whenToUse: 'When you ran git add by mistake or want to stage a different file first.',
    relatedCategory: 'Inspect & Save',
    relatedConceptId: 'c-staging-index',
    keywords: ['unstage', 'remove from staging', 'add undo', 'staging', 'restore staged'],
  },
  {
    id: 'cmd-save',
    intent: 'Stage all modified files for the next commit',
    command: 'git add -A',
    purpose: 'Adds all modifications, deletions, and untracked files to the staging index.',
    whenToUse: 'When your changes across multiple files are ready for an atomic commit.',
    relatedCategory: 'Inspect & Save',
    relatedConceptId: 'c-staging-index',
    keywords: ['save', 'stage', 'add', 'stage all', 'prepare commit'],
  },
  {
    id: 'cmd-commit',
    intent: 'Record staged changes as a permanent snapshot',
    command: 'git commit -m "message"',
    purpose: 'Creates a cryptographically hashed commit object pointing to a tree snapshot and parent.',
    whenToUse: 'When a logical, atomic piece of work is tested and complete.',
    relatedCategory: 'Inspect & Save',
    relatedConceptId: 'c-git-commit',
    keywords: ['commit', 'save', 'snapshot', 'checkpoint', 'record'],
  },
  {
    id: 'cmd-amend',
    intent: 'Modify or fix the most recent commit',
    command: 'git commit --amend',
    purpose: 'Replaces the tip commit with a new commit containing staged fixes or an updated message.',
    whenToUse: 'When you just committed and realized you forgot a file or made a typo in the message.',
    relatedCategory: 'Inspect & Save',
    relatedConceptId: 'c-commit-amend',
    keywords: ['amend', 'fix commit', 'update message', 'forgot file', 'edit commit'],
  },
  {
    id: 'cmd-status',
    intent: 'See what changed across working tree and index',
    command: 'git status',
    purpose: 'Displays staged, unstaged, and untracked file status relative to HEAD.',
    whenToUse: 'Frequently: before staging, before committing, and before pulling.',
    relatedCategory: 'Inspect & Save',
    relatedConceptId: 'c-git-status',
    keywords: ['status', 'see changes', 'what changed', 'inspect', 'diff status'],
  },
  {
    id: 'cmd-diff',
    intent: 'Inspect exact line changes before staging',
    command: 'git diff',
    purpose: 'Displays exact line additions and deletions between working tree and staging index.',
    whenToUse: 'Before running git add, to verify you are not staging unexpected code.',
    relatedCategory: 'Inspect & Save',
    relatedConceptId: 'c-git-diff',
    keywords: ['diff', 'lines changed', 'inspect delta', 'what changed'],
  },
  {
    id: 'cmd-branch',
    intent: 'Create a new feature branch',
    command: 'git switch -c <name>',
    purpose: 'Creates a new branch pointer at HEAD and immediately checks it out.',
    whenToUse: 'Whenever starting a new feature, bugfix, or experiment.',
    relatedCategory: 'Branching',
    relatedConceptId: 'c-switch-checkout',
    keywords: ['branch', 'new branch', 'switch', 'checkout', 'create branch'],
  },
  {
    id: 'cmd-stash',
    intent: 'Temporarily shelve uncommitted work',
    command: 'git stash',
    purpose: 'Saves working tree and index dirty state on a LIFO stack and reverts to HEAD.',
    whenToUse: 'When an urgent hotfix arrives and your current work is half-finished.',
    relatedCategory: 'Advanced Git',
    relatedConceptId: 'c-stash-management',
    keywords: ['stash', 'temporary save', 'shelve', 'pause', 'hide changes'],
  },
  {
    id: 'cmd-stash-pop',
    intent: 'Re-apply temporarily shelved changes',
    command: 'git stash pop',
    purpose: 'Applies the top stash back to the working tree and removes it from the stash list.',
    whenToUse: 'When you return to your feature after finishing an urgent context switch.',
    relatedCategory: 'Advanced Git',
    relatedConceptId: 'c-stash-management',
    keywords: ['pop', 'stash pop', 'restore stash', 'resume work'],
  },
  {
    id: 'cmd-reflog',
    intent: 'Recover lost commits or undo bad resets',
    command: 'git reflog',
    purpose: 'Displays the local audit trail of every position HEAD has pointed to in the past 90 days.',
    whenToUse: 'When you ran git reset --hard or deleted a branch by accident.',
    relatedCategory: 'Undo & Recover',
    relatedConceptId: 'c-reflog-rescue',
    keywords: ['reflog', 'lost commit', 'recover', 'rescue', 'accident', 'undo reset'],
  },
  {
    id: 'cmd-rebase',
    intent: 'Replay feature commits linearly onto main',
    command: 'git rebase main',
    purpose: 'Picks your feature commits and replays them on top of the latest main tip.',
    whenToUse: 'Before submitting a pull request to keep history clean and avoid merge bubbles.',
    relatedCategory: 'Advanced Git',
    relatedConceptId: 'c-git-rebase',
    keywords: ['rebase', 'linear history', 'update branch', 'squash'],
  },
  {
    id: 'cmd-push',
    intent: 'Publish local commits to GitHub',
    command: 'git push -u origin <branch>',
    purpose: 'Uploads local commits and establishes upstream tracking on the remote repository.',
    whenToUse: 'When your local feature is ready for teammate review or cloud backup.',
    relatedCategory: 'Remote Git',
    relatedConceptId: 'c-push-upstream',
    keywords: ['push', 'send to github', 'upload', 'sync', 'remote'],
  },
  {
    id: 'cmd-bisect',
    intent: 'Binary search history to find the commit that introduced a bug',
    command: 'git bisect start',
    purpose: 'Automatically checks out halfway commits between good and bad points.',
    whenToUse: 'When a test is failing in production and you do not know which commit broke it.',
    relatedCategory: 'Advanced Git',
    relatedConceptId: 'c-git-bisect',
    keywords: ['bisect', 'find bug', 'regression', 'binary search'],
  },
];

interface CommandAtlasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConcept?: (conceptId: string) => void;
}

export const CommandAtlasModal: React.FC<CommandAtlasModalProps> = ({
  isOpen,
  onClose,
  onSelectConcept,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filtered = useMemo(() => {
    if (!query.trim()) return COMMAND_ATLAS_ENTRIES;
    const q = query.toLowerCase();
    return COMMAND_ATLAS_ENTRIES.filter(
      (entry) =>
        entry.intent.toLowerCase().includes(q) ||
        entry.command.toLowerCase().includes(q) ||
        entry.purpose.toLowerCase().includes(q) ||
        entry.whenToUse.toLowerCase().includes(q) ||
        entry.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 8, 17, 0.82)',
        backdropFilter: 'blur(8px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
        animation: 'fadeIn 0.15s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '680px',
          maxWidth: '92vw',
          maxHeight: '75vh',
          background: '#0d1527',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '16px',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.8), 0 0 32px rgba(56, 189, 248, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: '#121c33',
          }}
        >
          <Search size={18} color="#38bdf8" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by intent (e.g. undo, branch, temporary save, lost commit)..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#f8fafc',
              fontSize: '0.95rem',
              fontWeight: 500,
            }}
          />
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              borderRadius: '6px',
              color: '#94a3b8',
              padding: '0.3rem',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Results List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          {filtered.length === 0 ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
              No commands matching "{query}". Try searching by intent like "undo", "stash", or "rebase".
            </div>
          ) : (
            filtered.map((entry) => (
              <div
                key={entry.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  transition: 'background 0.15s ease, border-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(56, 189, 248, 0.04)';
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc' }}>
                    {entry.intent}
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: '#38bdf8',
                      background: 'rgba(56, 189, 248, 0.1)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                    }}
                  >
                    {entry.relatedCategory}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <code
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.82rem',
                      color: '#34d399',
                      background: 'rgba(0, 0, 0, 0.5)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                    }}
                  >
                    {entry.command}
                  </code>
                </div>

                <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0.2rem 0 0 0', lineHeight: 1.4 }}>
                  <strong style={{ color: '#cbd5e1' }}>When:</strong> {entry.whenToUse}
                </p>

                {entry.relatedConceptId && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectConcept?.(entry.relatedConceptId!);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#38bdf8',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.2rem',
                      }}
                    >
                      <span>Study in Journey</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '0.65rem 1.25rem',
            background: '#090e1a',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            color: '#64748b',
          }}
        >
          <span>Tip: Type intent words like "undo", "stash", or "rebase"</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
