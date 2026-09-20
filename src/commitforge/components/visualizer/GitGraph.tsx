import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GitRepo, Commit } from '../../git-engine/types';
import { GitBranch, GitCommit, Tag, Clock, User, Calendar, X, Eye, Shield, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

export interface GitGraphProps {
  repo?: GitRepo;
  onSelectCommit?: (commit: Commit) => void;
}

export const GitGraph: React.FC<GitGraphProps> = ({ repo: propRepo, onSelectCommit }) => {
  const { repo: contextRepo } = useApp();
  const repo = propRepo || contextRepo;
  const [selectedCommit, setSelectedCommit] = useState<Commit | null>(null);
  const [hoveredHash, setHoveredHash] = useState<string | null>(null);

  const commitsList = Object.values(repo.commits).sort((a, b) => a.timestamp - b.timestamp);

  if (commitsList.length === 0) {
    return (
      <div
        className="git-graph-container"
        style={{
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: '0.85rem',
          padding: '2.5rem 1rem',
          background: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
        }}
      >
        <GitCommit size={28} color="#475569" style={{ margin: '0 auto 0.5rem' }} />
        <div>No commits in history DAG yet.</div>
        <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: '#38bdf8' }}>
          Run <code>git commit</code> in the terminal to plant your first commit milestone!
        </div>
      </div>
    );
  }

  // Calculate layout coordinates for SVG DAG
  const nodeRadius = 16;
  const nodeSpacingX = 90;
  const laneSpacingY = 48;

  // Assign lanes to branches
  const lanes: Record<string, number> = {};
  let nextLane = 0;

  commitsList.forEach((c) => {
    if (c.parents.length > 1) {
      lanes[c.hash] = 0; // Merge back to main lane
    } else if (c.parents.length === 1 && lanes[c.parents[0]] !== undefined) {
      lanes[c.hash] = lanes[c.parents[0]];
    } else {
      lanes[c.hash] = nextLane++;
    }
  });

  const laneColors = ['#38bdf8', '#c084fc', '#f59e0b', '#10b981', '#ec4899'];
  const width = Math.max(760, commitsList.length * nodeSpacingX + 140);
  const height = Math.max(140, (nextLane + 1) * laneSpacingY + 50);

  return (
    <div
      className="git-graph-container"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '14px',
        padding: '1.25rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 10px #38bdf8' }} />
          <GitCommit size={16} color="#38bdf8" />
          Commit Directed Acyclic Graph (DAG)
        </div>
        <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
          Click any commit node to inspect its tree snapshot and parent pointers
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div
        style={{
          overflowX: 'auto',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '0.75rem',
        }}
      >
        <svg width={width} height={height} className="graph-svg" style={{ overflow: 'visible' }}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8" />
            </marker>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Connectors (Edges between Commits) */}
          {commitsList.map((c, i) => {
            const x1 = 60 + i * nodeSpacingX;
            const lane1 = lanes[c.hash] || 0;
            const y1 = 45 + lane1 * laneSpacingY;
            const edgeColor = laneColors[lane1 % laneColors.length];

            return c.parents.map((parentHash) => {
              const pIdx = commitsList.findIndex((x) => x.hash === parentHash);
              if (pIdx === -1) return null;

              const x2 = 60 + pIdx * nodeSpacingX;
              const lane2 = lanes[parentHash] || 0;
              const y2 = 45 + lane2 * laneSpacingY;

              return (
                <g key={`${c.hash}-${parentHash}`}>
                  <path
                    d={`M ${x1} ${y1} C ${x1 - 35} ${y1}, ${x2 + 35} ${y2}, ${x2} ${y2}`}
                    fill="none"
                    stroke={edgeColor}
                    strokeWidth="3"
                    strokeOpacity="0.75"
                    markerEnd="url(#arrow)"
                  />
                </g>
              );
            });
          })}

          {/* Commit Nodes */}
          {commitsList.map((c, i) => {
            const cx = 60 + i * nodeSpacingX;
            const lane = lanes[c.hash] || 0;
            const cy = 45 + lane * laneSpacingY;
            const color = laneColors[lane % laneColors.length];

            // Badges
            const branchBadges: string[] = [];
            for (const [bName, b] of Object.entries(repo.branches)) {
              if (b.targetCommitHash === c.hash) branchBadges.push(bName);
            }

            const isHead = repo.head.type === 'branch'
              ? repo.branches[repo.head.ref]?.targetCommitHash === c.hash
              : repo.head.ref === c.hash;

            const isHovered = hoveredHash === c.hash;
            const isSelected = selectedCommit?.hash === c.hash;

            return (
              <g
                key={c.hash}
                onClick={() => {
                  setSelectedCommit(c);
                  onSelectCommit?.(c);
                }}
                onMouseEnter={() => setHoveredHash(c.hash)}
                onMouseLeave={() => setHoveredHash(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Outer Glow Ring if HEAD or Hovered */}
                {(isHead || isHovered || isSelected) && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={nodeRadius + 6}
                    fill="none"
                    stroke={isHead ? '#38bdf8' : color}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity="0.8"
                    filter="url(#glow)"
                  />
                )}

                {/* Node Circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={nodeRadius}
                  fill="#050811"
                  stroke={isHead ? '#38bdf8' : color}
                  strokeWidth={isHead ? 3.5 : 2.5}
                />

                {/* Commit Short Hash text inside circle */}
                <text
                  x={cx}
                  y={cy + 4}
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontSize="10px"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  C{i + 1}
                </text>

                {/* Commit Message above node */}
                <text
                  x={cx}
                  y={cy - 22}
                  textAnchor="middle"
                  fill="#cbd5e1"
                  fontSize="10px"
                  fontWeight="600"
                >
                  {c.message.length > 14 ? c.message.slice(0, 12) + '...' : c.message}
                </text>

                {/* Branch / HEAD tags below node */}
                {isHead && (
                  <g transform={`translate(${cx - 20}, ${cy + 22})`}>
                    <rect width="40" height="16" rx="4" fill="#2563eb" />
                    <text x="20" y="12" textAnchor="middle" fill="white" fontSize="9px" fontWeight="800">
                      HEAD
                    </text>
                  </g>
                )}

                {branchBadges.length > 0 && (
                  <g transform={`translate(${cx - 26}, ${cy + (isHead ? 42 : 22)})`}>
                    <rect width="52" height="16" rx="4" fill="#0284c7" />
                    <text x="26" y="12" textAnchor="middle" fill="white" fontSize="9px" fontWeight="800">
                      {branchBadges[0].slice(0, 8)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Commit Inspector Modal */}
      {selectedCommit && (
        <div className="modal-backdrop" onClick={() => setSelectedCommit(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                <GitCommit size={18} color="#38bdf8" />
                Commit Snapshot: <code style={{ color: '#38bdf8' }}>{selectedCommit.shortHash}</code>
              </div>
              <button className="icon-btn" onClick={() => setSelectedCommit(null)}>
                <X size={16} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                  {selectedCommit.message}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.35rem', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                  <span><User size={12} style={{ display: 'inline', marginRight: '4px' }} /> {selectedCommit.author}</span>
                  <span><Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} /> {new Date(selectedCommit.timestamp).toLocaleString()}</span>
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div><strong style={{ color: 'var(--text-secondary)' }}>Full SHA-1:</strong> <code style={{ color: '#38bdf8' }}>{selectedCommit.hash}</code></div>
                <div><strong style={{ color: 'var(--text-secondary)' }}>Parent commits:</strong> {selectedCommit.parents.length > 0 ? selectedCommit.parents.map((p) => p.slice(0, 7)).join(', ') : 'None (Root Commit)'}</div>
              </div>

              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.45rem', fontSize: '0.84rem' }}>
                  Files in this sealed snapshot ({Object.keys(selectedCommit.files).length}):
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {Object.keys(selectedCommit.files).map((path) => (
                    <div
                      key={path}
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                        padding: '0.45rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontFamily: 'monospace',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ color: 'var(--text-primary)' }}>📄 {path}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{selectedCommit.files[path]?.length || 0} bytes</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ borderTop: '1px solid var(--border-color)' }}>
              <button
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '0.45rem 1rem',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedCommit(null)}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
