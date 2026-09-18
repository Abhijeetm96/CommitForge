import React, { useState } from 'react';
import { SyntaxToken } from '../../data/unifiedAcademyData';
import { Copy, Check, Terminal, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  syntaxCode: string;
  syntaxTokens: SyntaxToken[];
}

export const InteractiveSyntaxExplorer: React.FC<Props> = ({ syntaxCode, syntaxTokens }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedExample, setCopiedExample] = useState(false);
  const [activeTokenIndex, setActiveTokenIndex] = useState<number>(0);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(syntaxCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const currentIdx = syntaxTokens.length > 0 ? Math.min(activeTokenIndex, syntaxTokens.length - 1) : 0;
  const activeToken = syntaxTokens[currentIdx];

  const colors = [
    { border: '#38bdf8', bg: 'rgba(56, 189, 248, 0.1)', text: '#38bdf8', borderGlow: 'rgba(56, 189, 248, 0.4)' },
    { border: '#f05033', bg: 'rgba(240, 80, 51, 0.1)', text: '#f05033', borderGlow: 'rgba(240, 80, 51, 0.4)' },
    { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', borderGlow: 'rgba(245, 158, 11, 0.4)' },
    { border: '#34d399', bg: 'rgba(52, 211, 153, 0.1)', text: '#34d399', borderGlow: 'rgba(52, 211, 153, 0.4)' },
    { border: '#c084fc', bg: 'rgba(192, 132, 252, 0.1)', text: '#c084fc', borderGlow: 'rgba(192, 132, 252, 0.4)' },
  ];

  const activeTheme = colors[currentIdx % colors.length];

  const generateExampleForToken = (token: SyntaxToken, fullCommand: string): string => {
    const t = token.token.trim().toLowerCase();
    if (t === 'git') {
      return 'git status';
    }
    if (t === 'commit') {
      return 'git commit -m "feat(auth): implement session validation"';
    }
    if (t === '-m') {
      return 'git commit -m "fix(nav): resolve sticky header alignment"';
    }
    if (t.includes('message') || t.startsWith('"') || t.startsWith("'")) {
      return 'git commit -m "docs: add getting started setup guide"';
    }
    if (t === 'status') {
      return 'git status -s';
    }
    if (t === 'add') {
      return 'git add src/App.tsx style.css';
    }
    if (t === '.') {
      return 'git add .';
    }
    if (t === 'diff') {
      return 'git diff HEAD~1';
    }
    if (t === '--staged' || t === '--cached') {
      return 'git diff --staged';
    }
    if (t === 'restore') {
      return 'git restore --staged index.html';
    }
    if (t === 'branch') {
      return 'git branch feature/user-profile';
    }
    if (t === 'switch') {
      return 'git switch main';
    }
    if (t === 'checkout') {
      return 'git checkout -b feature/dark-theme';
    }
    if (t === 'merge') {
      return 'git merge feature/user-profile';
    }
    if (t === 'push') {
      return 'git push origin main';
    }
    if (t === 'pull') {
      return 'git pull origin main';
    }
    if (t === 'clone') {
      return 'git clone https://github.com/torvalds/linux.git';
    }
    if (t === 'rebase') {
      return 'git rebase main';
    }
    if (t === 'stash') {
      return 'git stash pop';
    }

    return fullCommand;
  };

  const activeExample = activeToken ? generateExampleForToken(activeToken, syntaxCode) : syntaxCode;

  const renderHighlightedExample = (example: string, tokenStr: string, highlightColor: string) => {
    const trimmed = tokenStr.trim().replace(/^["']|["']$/g, '');
    if (!trimmed) return <span>{example}</span>;
    try {
      const parts = example.split(new RegExp(`(${trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
      return parts.map((part, i) =>
        part.toLowerCase() === trimmed.toLowerCase() ? (
          <span
            key={i}
            style={{
              color: highlightColor,
              fontWeight: 800,
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      );
    } catch {
      return <span>{example}</span>;
    }
  };

  const handleCopyExample = () => {
    navigator.clipboard.writeText(activeExample);
    setCopiedExample(true);
    setTimeout(() => setCopiedExample(false), 2000);
  };

  return (
    <div
      style={{
        background: '#090e1a',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Code Header with bash badge, instruction hint, and Copy button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.65rem 1rem',
          background: 'rgba(255, 255, 255, 0.03)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'lowercase',
              color: '#94a3b8',
              letterSpacing: '0.05em',
              background: 'rgba(255, 255, 255, 0.06)',
              padding: '0.15rem 0.5rem',
              borderRadius: '4px',
            }}
          >
            bash
          </span>
          <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
            Select any token to inspect its role and real-world example
          </span>
        </div>

        <button
          onClick={handleCopyCode}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            padding: '0.25rem 0.65rem',
            color: copiedCode ? '#22c55e' : '#cbd5e1',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          title="Copy command to clipboard"
        >
          {copiedCode ? <Check size={13} /> : <Copy size={13} />}
          <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>

      {/* Monospace Code Display with Clickable Tokens */}
      <div
        style={{
          padding: '1rem 1.25rem',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: '1.05rem',
          color: '#f8fafc',
          background: '#070b14',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        {syntaxTokens.map((st, idx) => {
          const isSelected = currentIdx === idx;
          const theme = colors[idx % colors.length];
          return (
            <button
              key={idx}
              onClick={() => setActiveTokenIndex(idx)}
              style={{
                background: isSelected ? theme.bg : 'transparent',
                border: isSelected ? `1px solid ${theme.border}` : '1px solid transparent',
                borderBottom: isSelected ? `2px solid ${theme.border}` : '2px solid rgba(255, 255, 255, 0.15)',
                color: theme.text,
                padding: '0.25rem 0.55rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                fontWeight: isSelected ? 800 : 500,
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? `0 0 10px ${theme.borderGlow}` : 'none',
              }}
              title={`Click to inspect ${st.token}`}
            >
              {st.token}
            </button>
          );
        })}
      </div>

      {/* 1 Active Box with Details and Example */}
      {activeToken && (
        <div
          style={{
            padding: '1.15rem 1.25rem',
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(9, 14, 26, 0.98) 100%)',
            borderTop: `2px solid ${activeTheme.border}`,
            borderBottom: `1px solid ${activeTheme.borderGlow}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Active Token Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span
                style={{
                  fontFamily: 'ui-monospace, monospace',
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  color: activeTheme.text,
                  background: activeTheme.bg,
                  border: `1px solid ${activeTheme.border}`,
                  padding: '0.25rem 0.65rem',
                  borderRadius: '6px',
                  boxShadow: `0 0 10px ${activeTheme.borderGlow}`,
                }}
              >
                {activeToken.token}
              </span>
              <span
                style={{
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  color: activeTheme.text,
                  background: activeTheme.bg,
                  border: `1px solid ${activeTheme.borderGlow}`,
                  padding: '0.25rem 0.65rem',
                  borderRadius: '6px',
                  letterSpacing: '0.01em',
                }}
              >
                {activeToken.role}
              </span>
            </div>

            {/* Stepper Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8', marginRight: '0.25rem' }}>
                Token <strong style={{ color: activeTheme.text }}>{currentIdx + 1}</strong> of {syntaxTokens.length}
              </span>
              <button
                disabled={currentIdx === 0}
                onClick={() => setActiveTokenIndex((prev) => Math.max(0, prev - 1))}
                style={{
                  background: currentIdx > 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                  border: currentIdx > 0 ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
                  color: currentIdx > 0 ? '#cbd5e1' : '#475569',
                  borderRadius: '6px',
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: currentIdx > 0 ? 'pointer' : 'not-allowed',
                }}
                title="Previous token"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                disabled={currentIdx >= syntaxTokens.length - 1}
                onClick={() => setActiveTokenIndex((prev) => Math.min(syntaxTokens.length - 1, prev + 1))}
                style={{
                  background: currentIdx < syntaxTokens.length - 1 ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                  border: currentIdx < syntaxTokens.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
                  color: currentIdx < syntaxTokens.length - 1 ? '#cbd5e1' : '#475569',
                  borderRadius: '6px',
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: currentIdx < syntaxTokens.length - 1 ? 'pointer' : 'not-allowed',
                }}
                title="Next token"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Details Section */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: `1px solid ${activeTheme.borderGlow}`,
              borderRadius: '8px',
              padding: '0.85rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: activeTheme.text, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Role & Explanation
            </div>
            <div style={{ fontSize: '0.86rem', color: '#e2e8f0', lineHeight: 1.55 }}>
              {activeToken.explanation}
            </div>
          </div>

          {/* Example Section */}
          <div
            style={{
              background: '#040711',
              border: `1px solid ${activeTheme.borderGlow}`,
              borderRadius: '8px',
              padding: '0.85rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Terminal size={14} color={activeTheme.text} />
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: activeTheme.text, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Practical Example
                </span>
              </div>
              <button
                onClick={handleCopyExample}
                style={{
                  background: 'none',
                  border: 'none',
                  color: copiedExample ? '#22c55e' : '#64748b',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  cursor: 'pointer',
                  padding: 0,
                }}
                title="Copy example"
              >
                {copiedExample ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedExample ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontSize: '0.84rem',
                color: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                overflowX: 'auto',
              }}
            >
              <span style={{ color: activeTheme.text, fontWeight: 700, userSelect: 'none' }}>$</span>
              <span style={{ color: '#f8fafc' }}>
                {renderHighlightedExample(activeExample, activeToken.token, activeTheme.text)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
