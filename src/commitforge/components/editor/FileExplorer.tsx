import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileCode, FileText, Plus, Trash2, Folder, File, Code } from 'lucide-react';

export const FileExplorer: React.FC = () => {
  const { repo, engine, activeFile, openFileTab, inspection } = useApp();
  const [newFileName, setNewFileName] = useState('');
  const [showNewFileInput, setShowNewFileInput] = useState(false);

  const fileList = Object.keys(repo.workingDirectory).sort();

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFileName.trim()) {
      engine.createFile(newFileName.trim(), '');
      openFileTab(newFileName.trim());
      setNewFileName('');
      setShowNewFileInput(false);
    }
  };

  const getFileIcon = (path: string) => {
    if (path.endsWith('.html')) return <Code size={14} color="#f97316" />;
    if (path.endsWith('.css')) return <Code size={14} color="#38bdf8" />;
    if (path.endsWith('.js') || path.endsWith('.ts')) return <Code size={14} color="#facc15" />;
    if (path.endsWith('.md')) return <FileText size={14} color="#a855f7" />;
    return <File size={14} color="#94a3b8" />;
  };

  const getStatusBadge = (path: string) => {
    const status = inspection.fileStatuses.find(s => s.path === path);
    if (!status) return null;

    if (status.hasConflict) {
      return <span style={{ color: 'var(--danger)', fontWeight: 800, fontSize: '0.7rem' }}>!C</span>;
    }
    if (status.isStagedNew || status.isStagedModified) {
      return <span style={{ color: 'var(--success)', fontWeight: 800, fontSize: '0.7rem' }}>S</span>;
    }
    if (status.isModified) {
      return <span style={{ color: 'var(--warning)', fontWeight: 800, fontSize: '0.7rem' }}>M</span>;
    }
    if (status.isUntracked) {
      return <span style={{ color: 'var(--git-cyan)', fontWeight: 800, fontSize: '0.7rem' }}>U</span>;
    }
    return null;
  };

  return (
    <div className="file-explorer">
      <div className="explorer-header">
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Folder size={14} color="var(--git-orange)" />
          Files
        </span>
        <button
          className="icon-btn"
          style={{ width: '22px', height: '22px' }}
          onClick={() => setShowNewFileInput(!showNewFileInput)}
          title="Create New File"
        >
          <Plus size={13} />
        </button>
      </div>

      {showNewFileInput && (
        <form onSubmit={handleCreateFile} style={{ padding: '0.4rem 0.6rem', borderBottom: '1px solid var(--border-color)' }}>
          <input
            type="text"
            placeholder="filename.ext"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              background: 'var(--bg-app)',
              border: '1px solid var(--git-orange)',
              color: 'var(--text-primary)',
              padding: '0.3rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono)',
              outline: 'none',
            }}
          />
        </form>
      )}

      <ul className="file-tree">
        {fileList.map((path) => (
          <li
            key={path}
            className={`file-item ${activeFile === path ? 'active' : ''}`}
            onClick={() => openFileTab(path)}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {getFileIcon(path)}
              {path}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {getStatusBadge(path)}
              <span
                title="Delete file from working directory"
                onClick={(e) => {
                  e.stopPropagation();
                  engine.deleteFile(path);
                }}
                style={{ display: 'inline-flex', cursor: 'pointer', opacity: 0.4 }}
              >
                <Trash2 size={12} />
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
