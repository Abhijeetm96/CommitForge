import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Commit } from '../../git-engine/types';
import { GitBranch, GitCommit, Tag, Clock, User, Calendar, X, Eye } from 'lucide-react';

export const GitGraph: React.FC = () => {
  const { repo } = useApp();
  const [selectedCommit, setSelectedCommit] = useState<Commit | null>(null);

  const commitsList = Object.values(repo.commits).sort((a, b) => a.timestamp - b.timestamp);

  if (commitsList.length === 0) {
    return (
      <div className="git-graph-container" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        No commits in history DAG. Run <code>git commit</code> to start your graph!
      </div>
    );
  }

  // Calculate layout coordinates for SVG DAG
  const nodeRadius = 14;
  const nodeSpacingX = 80;
  const laneSpacingY = 40;

  // Assign lanes to branches
  const lanes: Record<string, number> = {};
  let nextLane = 0;

  commitsList.forEach((c) => {
    // If merge, lane 0
    if (c.parents.length > 1) {
      lanes[c.hash] = 0;
    } else if (c.parents.length === 1 && lanes[c.parents[0]] !== undefined) {
      lanes[c.hash] = lanes[c.parents[0]];
    } else {
      lanes[c.hash] = nextLane++;
    }
  });

  const width = Math.max(700, commitsList.length * nodeSpacingX + 120);
  const height = Math.max(120, (nextLane + 1) * laneSpacingY + 40);

  return (
    <div className="git-graph-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <GitCommit size={15} color="var(--git-orange)" />
          Commit DAG History Network
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Click any commit node to inspect its tree, author, and snapshot
        </div>
      </div>

      <div style={{ overflowX: 'auto', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.5rem' }}>
        <svg width={width} height={height} className="graph-svg">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
          </defs>

          {/* Connectors (Edges) */}
          {commitsList.map((c, i) => {
            const x1 = 50 + i * nodeSpacingX;
            const y1 = 40 + (lanes[c.hash] || 0) * laneSpacingY;

            return c.parents.map((parentHash) => {
              const pIdx = commitsList.findIndex(x => x.hash === parentHash);
              if (pIdx === -1) return null;

              const x2 = 50 + pIdx * nodeSpacingX;
              const y2 = 40 + (lanes[parentHash] || 0) * laneSpacingY;

              return (
                <path
                  key={`${c.hash}-${parentHash}`}
                  d={`M ${x1} ${y1} C ${x1 - 30} ${y1}, ${x2 + 30} ${y2}, ${x2} ${y2}`}
                  fill="none"
                  stroke="#475569"
                  strokeWidth="2.5"
                  markerEnd="url(#arrow)"
                />
              );
            });
          })}

          {/* Commit Nodes */}
          {commitsList.map((c, i) => {
            const cx = 50 + i * nodeSpacingX;
            const cy = 40 + (lanes[c.hash] || 0) * laneSpacingY;

            // Find badges
            const branchBadges: string[] = [];
            for (const [bName, b] of Object.entries(repo.branches)) {
              if (b.targetCommitHash === c.hash) branchBadges.push(bName);
            }
            const tagBadges: string[] = [];
            for (const [tName, t] of Object.entries(repo.tags)) {
              if (t.targetCommitHash === c.hash) tagBadges.push(tName);
            }

            const isHead = repo.head.type === 'branch'
              ? repo.branches[repo.head.ref]?.targetCommitHash === c.hash
              : repo.head.ref === c.hash;

            return (
              <g key={c.hash} onClick={() => setSelectedCommit(c)} style={{ cursor: 'pointer' }}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={nodeRadius}
                  fill={isHead ? '#f05033' : '#1e293b'}
                  stroke={isHead ? '#ff7859' : '#06b6d4'}
                  strokeWidth={isHead ? 3 : 2}
                />
                <text
                  x={cx}
                  y={cy + 4}
                  textAnchor="middle"
                  fill="white"
                  fontSize="9px"
                  fontFamily="var(--font-mono)"
                  fontWeight="bold"
                >
                  {c.shortHash.slice(0, 4)}
                </text>

                {/* Commit Message snippet */}
                <text
                  x={cx}
                  y={cy - 20}
                  textAnchor="middle"
                  fill="var(--text-secondary)"
                  fontSize="10px"
                  fontFamily="var(--font-sans)"
                >
                  {c.message.length > 12 ? c.message.slice(0, 10) + '...' : c.message}
                </text>

                {/* Branch / HEAD tags */}
                {isHead && (
                  <g transform={`translate(${cx - 18}, ${cy + 22})`}>
                    <rect width="36" height="15" rx="3" fill="#f05033" />
                    <text x="18" y="11" textAnchor="middle" fill="white" fontSize="9px" fontWeight="bold">
                      HEAD
                    </text>
                  </g>
                )}

                {branchBadges.length > 0 && (
                  <g transform={`translate(${cx - 24}, ${cy + (isHead ? 40 : 22)})`}>
                    <rect width="48" height="15" rx="3" fill="#0284c7" />
                    <text x="24" y="11" textAnchor="middle" fill="white" fontSize="9px" fontWeight="bold">
                      {branchBadges[0].slice(0, 7)}
                    </text>
                  </g>
                )}

                {tagBadges.length > 0 && (
                  <g transform={`translate(${cx - 20}, ${cy - 35})`}>
                    <rect width="40" height="14" rx="3" fill="#8b5cf6" />
                    <text x="20" y="10" textAnchor="middle" fill="white" fontSize="8px" fontWeight="bold">
                      {tagBadges[0]}
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
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GitCommit size={18} color="var(--git-orange)" />
                Commit Details: {selectedCommit.shortHash}
              </div>
              <button className="icon-btn" onClick={() => setSelectedCommit(null)}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                  {selectedCommit.message}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem', display: 'flex', gap: '1rem' }}>
                  <span><User size={12} style={{ display: 'inline' }} /> {selectedCommit.author}</span>
                  <span><Calendar size={12} style={{ display: 'inline' }} /> {new Date(selectedCommit.timestamp).toLocaleString()}</span>
                </div>
              </div>

              <div style={{ background: 'var(--bg-app)', padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                <div><strong>Full SHA-1:</strong> <code style={{ color: 'var(--git-cyan)' }}>{selectedCommit.hash}</code></div>
                <div><strong>Parents:</strong> {selectedCommit.parents.length > 0 ? selectedCommit.parents.map(p => p.slice(0, 7)).join(', ') : '(root commit)'}</div>
              </div>

              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                Files in this Snapshot ({Object.keys(selectedCommit.files).length}):
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {Object.keys(selectedCommit.files).map(p => (
                  <li key={p} style={{ background: 'var(--bg-app)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                    📄 {p} ({selectedCommit.files[p].length} bytes)
                  </li>
                ))}
              </ul>
            </div>
            <div className="modal-footer">
              <button
                style={{ background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                onClick={() => setSelectedCommit(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
