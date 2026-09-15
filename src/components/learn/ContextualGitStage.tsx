import React from 'react';
import { GitRepo, Commit } from '../../git-engine/types';
import { FileCode, Box, FolderGit2, AlertTriangle, Check } from 'lucide-react';

interface Props {
  repo: GitRepo;
  highlightArea?: 'working' | 'staging' | 'commits';
}

export const ContextualGitStage: React.FC<Props> = ({ repo, highlightArea }) => {
  // 1. Working Tree files
  const workingFiles = Object.keys(repo.workingDirectory);

  // 2. Staging Area: compare index vs HEAD commit
  const headCommitHash = repo.branches['main']?.targetCommitHash;
  const headCommit = headCommitHash ? repo.commits[headCommitHash] : undefined;

  // Staged files: files in index that differ from HEAD commit files, or are newly added
  const stagedEntries = Object.keys(repo.index).filter((filename) => {
    if (!headCommit) return true;
    const committedContent = headCommit.files[filename];
    return committedContent !== repo.index[filename];
  });

  // 3. Commit History sorted newest first
  const commitsList: Commit[] = (Object.values(repo.commits) as Commit[]).sort(
    (a, b) => b.timestamp - a.timestamp
  );

  return (
    <div
      style={{
        background: '#070b14',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '0.65rem 1.25rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.85rem',
        flexShrink: 0,
      }}
    >
      {/* COLUMN 1: WORKING TREE (YOUR DESK) */}
      <div
        style={{
          background:
            highlightArea === 'working'
              ? 'rgba(56, 189, 248, 0.07)'
              : 'rgba(255, 255, 255, 0.02)',
          border:
            highlightArea === 'working'
              ? '1px solid rgba(56, 189, 248, 0.35)'
              : '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '6px',
          padding: '0.45rem 0.65rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
          transition: 'all 0.2s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            color: '#38bdf8',
            fontSize: '0.68rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          <FileCode size={13} />
          <span>Working Tree (Desk)</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {workingFiles.length === 0 ? (
            <span style={{ color: '#64748b', fontSize: '0.72rem', fontStyle: 'italic' }}>
              Directory is empty
            </span>
          ) : (
            workingFiles.map((file) => {
              const isSecret = file === '.env';
              const committedContent = headCommit?.files[file];
              const isUntracked = committedContent === undefined && repo.index[file] === undefined;
              const isModified = committedContent !== undefined && committedContent !== repo.workingDirectory[file];

              return (
                <div
                  key={file}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: isSecret
                      ? '1px solid #f59e0b'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '0.2rem 0.45rem',
                    borderRadius: '4px',
                    fontSize: '0.74rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'monospace',
                      color: isSecret ? '#f59e0b' : '#f8fafc',
                    }}
                  >
                    {file}
                  </span>
                  {isSecret && <span title="Simulated secret file">⚠️</span>}
                  {isModified && !isSecret && <span title="Modified file">✏️</span>}
                  {isUntracked && !isSecret && <span title="Untracked file" style={{ color: '#94a3b8' }}>?</span>}
                  {!isModified && !isUntracked && !isSecret && (
                    <span title="Clean tracked file" style={{ color: '#475569', fontSize: '0.65rem' }}>✓</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* COLUMN 2: STAGING AREA (THE PACKING BOX) */}
      <div
        style={{
          background:
            highlightArea === 'staging'
              ? 'rgba(240, 80, 51, 0.07)'
              : 'rgba(255, 255, 255, 0.02)',
          border:
            highlightArea === 'staging'
              ? '1px solid rgba(240, 80, 51, 0.35)'
              : '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '6px',
          padding: '0.45rem 0.65rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
          transition: 'all 0.2s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            color: '#fb923c',
            fontSize: '0.68rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          <Box size={13} />
          <span>Staging Area (Index)</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {stagedEntries.length === 0 ? (
            <span style={{ color: '#64748b', fontSize: '0.72rem', fontStyle: 'italic' }}>
              — (Packing box is empty)
            </span>
          ) : (
            stagedEntries.map((file) => {
              const isSecret = file === '.env';
              return (
                <div
                  key={file}
                  style={{
                    background: isSecret
                      ? 'rgba(239, 68, 68, 0.18)'
                      : 'rgba(34, 197, 94, 0.14)',
                    border: isSecret
                      ? '1px solid #ef4444'
                      : '1px solid rgba(34, 197, 94, 0.4)',
                    padding: '0.2rem 0.45rem',
                    borderRadius: '4px',
                    fontSize: '0.74rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      color: isSecret ? '#fca5a5' : '#86efac',
                    }}
                  >
                    {file}
                  </span>
                  {isSecret ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        fontSize: '0.65rem',
                        color: '#ef4444',
                        fontWeight: 800,
                      }}
                    >
                      <AlertTriangle size={11} /> ⚠️ DANGER
                    </span>
                  ) : (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        color: '#4ade80',
                      }}
                    >
                      <Check size={11} />
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* COLUMN 3: COMMIT HISTORY (THE VAULT) */}
      <div
        style={{
          background:
            highlightArea === 'commits'
              ? 'rgba(34, 197, 94, 0.07)'
              : 'rgba(255, 255, 255, 0.02)',
          border:
            highlightArea === 'commits'
              ? '1px solid rgba(34, 197, 94, 0.35)'
              : '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '6px',
          padding: '0.45rem 0.65rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
          transition: 'all 0.2s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            color: '#4ade80',
            fontSize: '0.68rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          <FolderGit2 size={13} />
          <span>Commit History (Vault)</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
          {commitsList.map((c, idx) => {
            const isHead = headCommitHash === c.hash;
            const shortLabel = `C${commitsList.length - 1 - idx}`;
            return (
              <div
                key={c.hash}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: isHead
                    ? '1px solid rgba(56, 189, 248, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '0.2rem 0.45rem',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 800,
                    color: '#38bdf8',
                  }}
                >
                  {shortLabel}
                </span>
                <span
                  style={{
                    color: '#cbd5e1',
                    maxWidth: '120px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={c.message}
                >
                  {c.message}
                </span>
                {isHead && (
                  <span
                    style={{
                      fontSize: '0.6rem',
                      background: 'rgba(56, 189, 248, 0.2)',
                      color: '#38bdf8',
                      padding: '0.05rem 0.25rem',
                      borderRadius: '3px',
                      fontWeight: 700,
                    }}
                  >
                    HEAD
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
