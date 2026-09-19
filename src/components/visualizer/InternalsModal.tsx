import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { extractObjectDatabase, GitObject } from '../../git-engine/internals';
import { Database, FolderTree, FileCode, Check, X, ArrowRight, Layers, GitBranch, Camera, FileText } from 'lucide-react';

export const InternalsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { repo } = useApp();
  const [selectedObject, setSelectedObject] = useState<GitObject | null>(null);

  const objects = extractObjectDatabase(repo);
  const currentBranch = repo.head.type === 'branch' ? repo.head.ref : 'main';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '880px', width: '95%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
        <div className="modal-header" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Database size={20} color="#38bdf8" />
            <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
              Git Internals: The Content-Addressable Object Database (.git/objects)
            </span>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Mental model cryptographic transformation diagram */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.1rem' }}>
            <div style={{ fontWeight: 800, color: '#38bdf8', marginBottom: '0.65rem', fontSize: '0.85rem' }}>
              Cryptographic Object Hierarchy (How Git Stores Everything):
            </div>

            {/* Visual Hierarchy Flow */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
              {/* Step 1: HEAD */}
              <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid #f59e0b', borderRadius: '8px', padding: '0.65rem 0.85rem', textAlign: 'center', minWidth: '120px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f59e0b' }}>📍 HEAD</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '0.2rem', fontFamily: 'monospace' }}>
                  refs/heads/{currentBranch}
                </div>
              </div>

              <span style={{ color: 'var(--text-secondary)', fontWeight: 800 }}>➔</span>

              {/* Step 2: Branch */}
              <div style={{ background: 'rgba(56, 189, 248, 0.12)', border: '1px solid #38bdf8', borderRadius: '8px', padding: '0.65rem 0.85rem', textAlign: 'center', minWidth: '120px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8' }}>🌿 Branch Ref</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '0.2rem', fontFamily: 'monospace' }}>
                  41-byte text SHA
                </div>
              </div>

              <span style={{ color: 'var(--text-secondary)', fontWeight: 800 }}>➔</span>

              {/* Step 3: Commit */}
              <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid #ef4444', borderRadius: '8px', padding: '0.65rem 0.85rem', textAlign: 'center', minWidth: '120px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ef4444' }}>📦 Commit</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '0.2rem', fontFamily: 'monospace' }}>
                  Tree + Parent + Author
                </div>
              </div>

              <span style={{ color: 'var(--text-secondary)', fontWeight: 800 }}>➔</span>

              {/* Step 4: Tree */}
              <div style={{ background: 'rgba(168, 85, 247, 0.12)', border: '1px solid #a855f7', borderRadius: '8px', padding: '0.65rem 0.85rem', textAlign: 'center', minWidth: '120px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#c084fc' }}>📁 Tree</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '0.2rem', fontFamily: 'monospace' }}>
                  Directory listing
                </div>
              </div>

              <span style={{ color: 'var(--text-secondary)', fontWeight: 800 }}>➔</span>

              {/* Step 5: Blobs */}
              <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10b981', borderRadius: '8px', padding: '0.65rem 0.85rem', textAlign: 'center', minWidth: '120px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981' }}>📄 Blobs</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '0.2rem', fontFamily: 'monospace' }}>
                  Raw file bytes
                </div>
              </div>
            </div>
          </div>

          {/* Database Object Explorer */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 1fr) minmax(300px, 1.4fr)', gap: '1rem', minHeight: '280px' }}>
            {/* Objects List */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.85rem', overflowY: 'auto', maxHeight: '340px' }}>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.82rem', marginBottom: '0.65rem' }}>
                Objects in .git/objects ({objects.length}):
              </div>
              {objects.length === 0 ? (
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textAlign: 'center', padding: '1rem' }}>
                  No objects stored yet. Run git commit to generate blobs, trees, and commits!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {objects.map((obj) => (
                    <div
                      key={obj.id}
                      onClick={() => setSelectedObject(obj)}
                      style={{
                        padding: '0.5rem 0.65rem',
                        background: selectedObject?.id === obj.id ? 'rgba(56, 189, 248, 0.18)' : 'var(--bg-card)',
                        border: '1px solid',
                        borderColor: selectedObject?.id === obj.id ? '#38bdf8' : 'var(--border-color)',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                        <span
                          style={{
                            color:
                              obj.type === 'commit'
                                ? '#ef4444'
                                : obj.type === 'tree'
                                ? '#c084fc'
                                : '#38bdf8',
                            fontWeight: 800,
                            marginRight: '6px',
                          }}
                        >
                          [{obj.type.toUpperCase()}]
                        </span>
                        {obj.id.slice(0, 8)}...
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{obj.size}B</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Object Inspector Payload */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 800, color: '#38bdf8', fontSize: '0.82rem', fontFamily: 'monospace' }}>
                  $ git cat-file -p {selectedObject?.id.slice(0, 8) || '<object-sha>'}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Decompressed Payload</span>
              </div>

              {selectedObject ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                    <strong>Full SHA-1:</strong> <code style={{ color: '#38bdf8' }}>{selectedObject.id}</code>
                  </div>
                  <pre
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.76rem',
                      fontFamily: 'monospace',
                      color: 'var(--text-primary)',
                      whiteSpace: 'pre-wrap',
                      overflowY: 'auto',
                      flex: 1,
                      margin: 0,
                    }}
                  >
                    {selectedObject.content}
                  </pre>
                </div>
              ) : (
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 'auto', textAlign: 'center' }}>
                  Select an object on the left to inspect its raw header, directory tree, or file blob.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            style={{
              background: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1.25rem',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer',
            }}
            onClick={onClose}
          >
            Close Internals
          </button>
        </div>
      </div>
    </div>
  );
};
