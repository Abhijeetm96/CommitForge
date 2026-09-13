import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface TermData {
  term: string;
  simple: string;
  technical: string;
  analogy: string;
}

const GLOSSARY_MAP: Record<string, TermData> = {
  'working tree': {
    term: 'Working Tree (Your Computer Desk)',
    simple: 'The actual files on your computer disk that you can open and edit in your code editor.',
    technical: 'The directory tree containing active files checked out from the repository database.',
    analogy: 'Draft papers spread out across your physical desk before you decide to archive them.',
  },
  'staging area': {
    term: 'Staging Area / Index (The Packing Box)',
    simple: 'A preparation box where you select which file changes will go into the next snapshot.',
    technical: 'Git index file (.git/index) holding the proposed tree structure for the next commit.',
    analogy: 'An open cardboard shipping box sitting beside your desk where you place chosen items before taping it shut.',
  },
  'repository': {
    term: 'Repository (The Project Vault)',
    simple: 'The folder containing your project files plus the hidden .git directory containing all history.',
    technical: 'The complete object database and ref storage managing all snapshots since project creation.',
    analogy: 'A secure time vault that keeps not just the latest book edition, but every single draft version ever saved.',
  },
  'commit': {
    term: 'Commit (Sealed Snapshot)',
    simple: 'A permanent, recorded milestone of your staged changes at a specific moment in time.',
    technical: 'An immutable Git object with a SHA hash pointing to a tree object, author, timestamp, and parent commit(s).',
    analogy: 'A video game checkpoint save. If your character falls later, you can return right back to this exact point.',
  },
  'head': {
    term: 'HEAD (You Are Here Bookmark)',
    simple: 'Git’s internal pointer indicating what commit or branch you are currently looking at.',
    technical: 'A reference file (.git/HEAD) pointing either to a branch ref or a specific commit object.',
    analogy: 'The laser playback needle on a record player. Wherever the needle rests, that is the exact track playing.',
  },
  '.gitignore': {
    term: '.gitignore (The Ignore List)',
    simple: 'A plain text file listing file patterns that Git should deliberately ignore and never offer for staging.',
    technical: 'Pattern file evaluated during status/add traversal to skip specified files and directories.',
    analogy: 'A "Do Not Disturb" sign hanging on certain sensitive or temporary folders.',
  },
};

interface Props {
  termKey: string;
  children?: React.ReactNode;
}

export const ContextualTermPopover: React.FC<Props> = ({ termKey, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const data = GLOSSARY_MAP[termKey.toLowerCase()];

  if (!data) {
    return <span>{children || termKey}</span>;
  }

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          margin: 0,
          color: '#38bdf8',
          textDecoration: 'underline dotted #38bdf8',
          cursor: 'pointer',
          font: 'inherit',
          fontWeight: 600,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.2rem',
        }}
        title="Click to see what this term means"
      >
        {children || data.term}
        <HelpCircle size={12} color="#38bdf8" />
      </button>

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 998,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: '8px',
              width: '320px',
              maxWidth: '90vw',
              background: '#0f172a',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '8px',
              padding: '0.85rem',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 0 15px rgba(56, 189, 248, 0.2)',
              zIndex: 999,
              color: '#f8fafc',
              fontSize: '0.82rem',
              lineHeight: 1.4,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.3rem' }}>
              <span style={{ fontWeight: 800, color: '#38bdf8', fontSize: '0.85rem' }}>
                {data.term}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
              >
                <X size={14} />
              </button>
            </div>

            <div style={{ marginBottom: '0.4rem' }}>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>In Plain English</div>
              <p style={{ margin: '0.15rem 0', color: '#e2e8f0' }}>{data.simple}</p>
            </div>

            <div style={{ marginBottom: '0.4rem' }}>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>Real-World Analogy</div>
              <p style={{ margin: '0.15rem 0', color: '#cbd5e1', fontStyle: 'italic' }}>{data.analogy}</p>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>Technical Detail</div>
              <p style={{ margin: '0.15rem 0', color: '#94a3b8', fontSize: '0.75rem' }}>{data.technical}</p>
            </div>
          </div>
        </>
      )}
    </span>
  );
};
