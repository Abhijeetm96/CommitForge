import React, { useState } from 'react';
import { FolderOpen, FolderClosed, ChevronRight, ChevronDown } from 'lucide-react';
import { PROJECT_TREE, ProjectTreeItem, isFolder } from './ideProjectFiles';

export interface IdeFileExplorerProps {
  activeFilePath: string;
  onSelectFile: (path: string) => void;
}

const FileTreeNode: React.FC<{
  item: ProjectTreeItem;
  level: number;
  activeFilePath: string;
  onSelectFile: (path: string) => void;
}> = ({ item, level, activeFilePath, onSelectFile }) => {
  // Initialize from tree data if available, default to false
  const [expanded, setExpanded] = useState<boolean>((item as any).expanded ?? false);
  const isDir = isFolder(item);
  const isActive = activeFilePath === item.path;

  return (
    <div>
      <div
        onClick={() => {
          if (isDir) {
            setExpanded(!expanded);
          } else if (item.path) {
            onSelectFile(item.path);
          }
        }}
        onMouseEnter={(e) => {
          if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.currentTarget.style.backgroundColor = isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent';
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '4px 0',
          paddingLeft: `${level * 16 + 8}px`,
          cursor: 'pointer',
          backgroundColor: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
          borderLeft: `2px solid ${isActive ? '#38bdf8' : 'transparent'}`,
          color: isActive ? '#e2e8f0' : '#94a3b8',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.78rem',
          userSelect: 'none',
          transition: 'background-color 0.1s ease',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', marginRight: '4px', width: '16px', justifyContent: 'center' }}>
          {isDir ? (
            expanded ? <ChevronDown size={14} color="#94a3b8" /> : <ChevronRight size={14} color="#94a3b8" />
          ) : null}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', marginRight: '6px' }}>
          {isDir ? (
            expanded ? <FolderOpen size={14} color="#38bdf8" /> : <FolderClosed size={14} color="#94a3b8" />
          ) : (
            <span style={{ fontSize: '14px', width: '14px', textAlign: 'center', display: 'inline-block' }}>
              {(item as any).icon || '📄'}
            </span>
          )}
        </span>
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.name}
        </span>
      </div>
      {isDir && expanded && (item as any).children && (
        <div>
          {(item as any).children.map((child: ProjectTreeItem, idx: number) => (
            <FileTreeNode
              key={idx}
              item={child}
              level={level + 1}
              activeFilePath={activeFilePath}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const IdeFileExplorer: React.FC<IdeFileExplorerProps> = ({ activeFilePath, onSelectFile }) => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0a0f1a',
      color: '#e2e8f0',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#94a3b8',
          letterSpacing: '0.05em',
          marginBottom: '8px',
        }}>
          EXPLORER
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: '#e2e8f0',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          <FolderClosed size={14} color="#a78bfa" />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            acme-saas-platform
          </span>
        </div>
      </div>
      <div style={{ paddingTop: '8px', paddingBottom: '16px' }}>
        {PROJECT_TREE.map((item, idx) => (
          <FileTreeNode
            key={idx}
            item={item}
            level={0}
            activeFilePath={activeFilePath}
            onSelectFile={onSelectFile}
          />
        ))}
      </div>
    </div>
  );
};
