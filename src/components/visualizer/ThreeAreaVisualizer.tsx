import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Folder,
  FileText,
  Database,
  ArrowRight,
  Info,
  ChevronDown,
  Layers,
  Inbox,
  CheckCircle2,
} from 'lucide-react';

export const ThreeAreaVisualizer: React.FC = () => {
  const { repo, openFileTab } = useApp();
  const [viewMode, setViewMode] = useState<'simple' | 'technical'>('simple');

  const workingFiles = Object.keys(repo.workingDirectory);
  const stagedFiles = Object.keys(repo.index);
  const commits = Object.values(repo.commits);

  const isTechnical = viewMode === 'technical';

  return (
    <div
      style={{
        background: '#0c1322',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
            }}
          >
            <Layers size={16} />
          </div>
          <h2
            style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              color: '#f8fafc',
              margin: 0,
            }}
          >
            What Git Sees
          </h2>
        </div>

        {/* View Mode Selector */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setViewMode(viewMode === 'simple' ? 'technical' : 'simple')}
            style={{
              background: '#131d33',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#94a3b8',
              padding: '0.35rem 0.8rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>{isTechnical ? 'Technical view' : 'Simple view'}</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* The 3 Connected Area Cards with Arrows */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          alignItems: 'stretch',
        }}
      >
        {/* Card 1: Working Tree (Your files) */}
        <div
          style={{
            background: '#131d33',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            position: 'relative',
          }}
        >
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>
              {isTechnical ? 'Working Tree' : 'Working Tree'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.1rem' }}>
              {isTechnical ? 'Unstaged local edits' : 'Your files'}
            </div>
          </div>

          {/* Files List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
            {workingFiles.length === 0 ? (
              <div style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center', margin: 'auto' }}>
                No files on disk
              </div>
            ) : (
              workingFiles.map((file) => {
                const isModified = repo.index[file] !== undefined && repo.workingDirectory[file] !== repo.index[file];
                const isUntracked = repo.index[file] === undefined;
                return (
                  <div
                    key={file}
                    onClick={() => openFileTab(file)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '8px',
                      padding: '0.55rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 500 }}>
                      <FileText size={15} color="#94a3b8" />
                      <span>{file}</span>
                    </div>
                    {(isModified || isUntracked) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: '#f59e0b', fontWeight: 700 }}>
                        <span>{isUntracked ? 'new' : '(modified)'}</span>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b' }} />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Card 2: Staging Area (Files ready to commit) */}
        <div
          style={{
            background: '#131d33',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}
        >
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>
              {isTechnical ? 'Index (Stage)' : 'Staging Area'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.1rem' }}>
              {isTechnical ? 'Changes prepared for next snapshot' : 'Files ready to commit'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, justifyContent: 'center' }}>
            {stagedFiles.length === 0 ? (
              <div
                style={{
                  border: '1.5px dashed rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  padding: '1.5rem 1rem',
                  textAlign: 'center',
                  color: '#64748b',
                  fontSize: '0.82rem',
                }}
              >
                <div>(empty)</div>
                <div style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>No files staged</div>
              </div>
            ) : (
              stagedFiles.map((file) => (
                <div
                  key={file}
                  style={{
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '8px',
                    padding: '0.55rem 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>
                    <FileText size={15} />
                    <span>{file}</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800 }}>READY</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Card 3: Local Repository (Saved versions) */}
        <div
          style={{
            background: '#131d33',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}
        >
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>
              {isTechnical ? 'Commit DAG (HEAD)' : 'Local Repository'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.1rem' }}>
              {isTechnical ? 'Committed history chain' : 'Saved versions'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, justifyContent: 'center' }}>
            {commits.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.5rem 1rem',
                  gap: '0.4rem',
                  color: '#64748b',
                }}
              >
                <Database size={24} color="#475569" />
                <div style={{ fontSize: '0.8rem' }}>No commits yet</div>
              </div>
            ) : (
              commits.slice(-3).reverse().map((c, idx) => (
                <div
                  key={c.hash}
                  style={{
                    background: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    borderRadius: '8px',
                    padding: '0.55rem 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 600 }}>
                    {c.message}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontFamily: 'monospace' }}>
                    {c.shortHash}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Info Banner */}
      <div
        style={{
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '10px',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          color: '#38bdf8',
          fontSize: '0.88rem',
          fontWeight: 500,
        }}
      >
        <Info size={18} style={{ flexShrink: 0 }} />
        <span>
          {stagedFiles.length > 0
            ? `You have ${stagedFiles.length} file(s) in staging ready to commit.`
            : workingFiles.length > 0
            ? `You have ${workingFiles.length} changed file. Stage it, then commit it to save your work.`
            : 'Working tree is clean. Ready for your next changes.'}
        </span>
      </div>
    </div>
  );
};
