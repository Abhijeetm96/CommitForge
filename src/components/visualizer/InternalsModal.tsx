import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { extractObjectDatabase, GitObject } from '../../git-engine/internals';
import { Database, FolderTree, FileCode, Check, X, ArrowRight, Layers } from 'lucide-react';

export const InternalsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { repo } = useApp();
  const [selectedObject, setSelectedObject] = useState<GitObject | null>(null);

  const objects = extractObjectDatabase(repo);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', width: '95%' }}>
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={20} color="var(--git-orange)" />
            Git Internals: The Object Database (.git/objects)
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* Mental model transformation diagram */}
          <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.2rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--git-cyan)', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
              The 5 Core Git Data Primitives:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem', textAlign: 'center', fontSize: '0.78rem' }}>
              <div style={{ background: 'var(--bg-surface)', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: '#38bdf8' }}>📄 Blob</strong>
                <p style={{ color: 'var(--text-muted)' }}>Raw file contents (SHA-1)</p>
              </div>
              <div style={{ background: 'var(--bg-surface)', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: '#a855f7' }}>📁 Tree</strong>
                <p style={{ color: 'var(--text-muted)' }}>Folder structure & filenames</p>
              </div>
              <div style={{ background: 'var(--bg-surface)', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: '#f05033' }}>📦 Commit</strong>
                <p style={{ color: 'var(--text-muted)' }}>Root Tree + Author + Parents</p>
              </div>
              <div style={{ background: 'var(--bg-surface)', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: '#10b981' }}>🌿 Branch</strong>
                <p style={{ color: 'var(--text-muted)' }}>Movable 41-byte text pointer</p>
              </div>
              <div style={{ background: 'var(--bg-surface)', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: '#fbbf24' }}>📍 HEAD</strong>
                <p style={{ color: 'var(--text-muted)' }}>Points to current branch/SHA</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1rem', minHeight: '260px' }}>
            {/* Objects List */}
            <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.8rem', overflowY: 'auto', maxHeight: '300px' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                All Objects in .git/objects ({objects.length}):
              </div>
              {objects.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No objects yet. Run git commit first!</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {objects.map((obj) => (
                    <div
                      key={obj.id}
                      onClick={() => setSelectedObject(obj)}
                      style={{
                        padding: '0.5rem 0.6rem',
                        background: selectedObject?.id === obj.id ? 'rgba(240, 80, 51, 0.15)' : 'var(--bg-surface)',
                        border: '1px solid',
                        borderColor: selectedObject?.id === obj.id ? 'var(--git-orange)' : 'var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-mono)' }}>
                        <span style={{
                          color: obj.type === 'commit' ? 'var(--git-orange)' : obj.type === 'tree' ? 'var(--git-purple)' : 'var(--git-cyan)',
                          fontWeight: 700,
                          marginRight: '6px'
                        }}>
                          [{obj.type.toUpperCase()}]
                        </span>
                        {obj.id.slice(0, 10)}...
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{obj.size}B</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Object Inspector Payload */}
            <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.8rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                Raw Object Payload (git cat-file -p):
              </div>
              {selectedObject ? (
                <div>
                  <div style={{ fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                    <strong>ID:</strong> <code style={{ color: 'var(--git-cyan)' }}>{selectedObject.id}</code>
                  </div>
                  <pre
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      background: 'var(--bg-surface)',
                      padding: '0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      whiteSpace: 'pre-wrap',
                      color: 'var(--text-primary)',
                      maxHeight: '220px',
                      overflowY: 'auto',
                    }}
                  >
                    {selectedObject.content}
                  </pre>
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2rem', textAlign: 'center' }}>
                  Click an object on the left to inspect what Git actually stores on disk.
                </div>
              )}
            </div>
          </div>
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
            onClick={onClose}
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
