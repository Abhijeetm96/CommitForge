import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const CodeEditor: React.FC = () => {
  const {
    repo,
    activeFile,
    setActiveFile,
    openFiles,
    closeFileTab,
    updateEditorContent,
  } = useApp();

  if (!activeFile || repo.workingDirectory[activeFile] === undefined) {
    return (
      <div className="code-editor-panel" style={{ alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        Select a file from the explorer to view and edit code
      </div>
    );
  }

  const content = repo.workingDirectory[activeFile] || '';
  const lines = content.split('\n');

  // Conflict marker detection
  const hasConflict = content.includes('<<<<<<< HEAD');

  const handleResolveConflict = (strategy: 'current' | 'incoming' | 'both') => {
    // Parse conflict markers and replace
    const regex = /<<<<<<< HEAD\r?\n([\s\S]*?)=======\r?\n([\s\S]*?)>>>>>>>[^\r\n]*/g;

    let resolved = content.replace(regex, (_match, currentPart, incomingPart) => {
      if (strategy === 'current') return currentPart.trimEnd();
      if (strategy === 'incoming') return incomingPart.trimEnd();
      return `${currentPart.trimEnd()}\n${incomingPart.trimEnd()}`;
    });

    updateEditorContent(activeFile, resolved);
  };

  return (
    <div className="code-editor-panel">
      {/* Tabs */}
      <div className="editor-tabs">
        {openFiles.map((path) => {
          const isDirty = repo.index[path] !== undefined && repo.workingDirectory[path] !== repo.index[path];
          return (
            <button
              key={path}
              className={`editor-tab ${activeFile === path ? 'active' : ''}`}
              onClick={() => setActiveFile(path)}
            >
              <span>{path}</span>
              {isDirty && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--git-orange)' }} />}
              <X
                size={12}
                onClick={(e) => {
                  e.stopPropagation();
                  closeFileTab(path);
                }}
                style={{ opacity: 0.6, cursor: 'pointer' }}
              />
            </button>
          );
        })}
      </div>

      {/* Merge Conflict Helper Banner */}
      {hasConflict && (
        <div className="conflict-helper-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--danger)', fontWeight: 600 }}>
            <AlertTriangle size={15} />
            Merge Conflict detected in this file!
          </div>
          <div className="conflict-actions">
            <button className="conflict-btn" onClick={() => handleResolveConflict('current')}>
              Accept Current (HEAD)
            </button>
            <button className="conflict-btn" onClick={() => handleResolveConflict('incoming')}>
              Accept Incoming
            </button>
            <button className="conflict-btn" onClick={() => handleResolveConflict('both')}>
              Accept Both
            </button>
          </div>
        </div>
      )}

      {/* Editor Body */}
      <div className="editor-body">
        {/* Line Numbers */}
        <div className="editor-line-numbers">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          className="editor-textarea"
          value={content}
          onChange={(e) => updateEditorContent(activeFile, e.target.value)}
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
};
