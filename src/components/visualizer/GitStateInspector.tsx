import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HelpCircle,
  GitBranch,
  GitCommit,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Layers,
  Archive,
  Eye,
  Info,
  X
} from 'lucide-react';

export const GitStateInspector: React.FC = () => {
  const { inspection, repo, lastWhyExplanation, setLastWhyExplanation, lastComparison, setLastComparison } = useApp();
  const [showExplanationModal, setShowExplanationModal] = useState(false);

  return (
    <>
      <div className="git-inspector-bar">
        <div className="inspector-indicators">
          {/* HEAD Indicator */}
          <div className="hud-item" title="Current HEAD location">
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>HEAD:</span>
            <span className={`hud-tag ${inspection.isDetachedHead ? 'detached' : 'branch'}`}>
              <GitBranch size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              {inspection.isDetachedHead ? `DETACHED (${inspection.headCommitShortHash})` : inspection.currentBranch || 'uninitialized'}
            </span>
          </div>

          {/* Commit Indicator */}
          {inspection.headCommitShortHash && (
            <div className="hud-item" title="Latest Commit on this branch">
              <GitCommit size={13} style={{ color: 'var(--git-orange)' }} />
              <strong style={{ color: 'var(--text-primary)' }}>{inspection.headCommitShortHash}</strong>
              <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                "{inspection.headCommitMessage}"
              </span>
            </div>
          )}

          {/* Working Dir Status */}
          <div className="hud-item">
            <span style={{ color: 'var(--text-muted)' }}>Working Tree:</span>
            <strong style={{ color: inspection.workingDirSummary.includes('conflict') ? 'var(--danger)' : 'var(--text-secondary)' }}>
              {inspection.workingDirSummary}
            </strong>
          </div>

          {/* Staging Status */}
          <div className="hud-item">
            <span style={{ color: 'var(--text-muted)' }}>Staging:</span>
            <strong style={{ color: inspection.stagingSummary.includes('change') ? 'var(--success)' : 'var(--text-muted)' }}>
              {inspection.stagingSummary}
            </strong>
          </div>

          {/* Remote Sync */}
          <div className="hud-item">
            <span style={{ color: 'var(--text-muted)' }}>Sync:</span>
            <span>{inspection.remoteSyncSummary}</span>
          </div>

          {/* Stash Indicator */}
          {repo.stash.length > 0 && (
            <div className="hud-item" style={{ color: 'var(--warning)' }}>
              <Archive size={13} />
              <span>Stash: {repo.stash.length}</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {lastWhyExplanation && (
            <button
              className="inspector-explain-btn"
              style={{ borderColor: 'var(--git-orange)', color: 'var(--git-orange)', fontWeight: 600 }}
              onClick={() => setShowExplanationModal(true)}
            >
              <HelpCircle size={13} /> Why Did This Happen?
            </button>
          )}

          <button
            className="inspector-explain-btn"
            onClick={() => setShowExplanationModal(true)}
          >
            <Eye size={13} /> What's Git Thinking?
          </button>
        </div>
      </div>

      {/* "What's Git Thinking?" / "Why Did This Happen?" Modal */}
      {showExplanationModal && (
        <div className="modal-backdrop" onClick={() => setShowExplanationModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Info size={20} color="var(--git-orange)" />
                What's Git Thinking Right Now?
              </div>
              <button className="icon-btn" onClick={() => setShowExplanationModal(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="modal-body">
              {lastWhyExplanation && (
                <div style={{ background: 'rgba(240, 80, 51, 0.08)', border: '1px solid var(--git-orange)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--git-orange)', marginBottom: '0.4rem' }}>
                    Latest Operation Breakdown:
                  </div>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    {lastWhyExplanation.summary}
                  </p>
                  <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.85rem' }}>
                    {lastWhyExplanation.headMoved && <li><strong>HEAD:</strong> {lastWhyExplanation.headMoved}</li>}
                    {lastWhyExplanation.indexState && <li><strong>Staging Area:</strong> {lastWhyExplanation.indexState}</li>}
                    {lastWhyExplanation.workingState && <li><strong>Working Directory:</strong> {lastWhyExplanation.workingState}</li>}
                    {lastWhyExplanation.historyState && <li><strong>History DAG:</strong> {lastWhyExplanation.historyState}</li>}
                  </ul>
                </div>
              )}

              {lastComparison && (
                <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--git-cyan)', marginBottom: '0.5rem' }}>
                    {lastComparison.title}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {lastComparison.options.map((opt, i) => (
                      <div key={i} style={{ background: 'var(--bg-surface)', padding: '0.5rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{opt.label}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{opt.description}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{opt.effect}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Plain-English Repository Status:
              </div>
              <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem' }}>
                {inspection.plainEnglishExplanation.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            </div>

            <div className="modal-footer">
              <button
                style={{
                  background: 'var(--git-orange)',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1.2rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                onClick={() => setShowExplanationModal(false)}
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
