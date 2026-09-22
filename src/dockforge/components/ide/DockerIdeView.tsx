import React, { useState, useCallback, useMemo } from 'react';
import { useDocker } from '../../context/DockerContext';
import { DockerTerminal } from '../terminal/DockerTerminal';
import { IdeFileExplorer } from './IdeFileExplorer';
import { IdeSyntaxEditor } from './IdeSyntaxEditor';
import { IdeContainerDashboard } from './IdeContainerDashboard';
import { IdeBuildOutput } from './IdeBuildOutput';
import { IdeStatusBar } from './IdeStatusBar';
import { PROJECT_FILES, PROJECT_TREE, ProjectFile, isFolder, ProjectTreeItem } from './ideProjectFiles';
import { Play, Upload, ArrowUpCircle, StopCircle, BarChart3, Trash2, Zap, Code2 } from 'lucide-react';
import { EnterpriseDockerSimulator } from '../simulators/EnterpriseDockerSimulator';

// Flatten the tree to quickly find a file by path
function findFileInTree(items: ProjectTreeItem[], path: string): ProjectFile | null {
  for (const item of items) {
    if (isFolder(item)) {
      const found = findFileInTree(item.children, path);
      if (found) return found;
    } else if (item.path === path) {
      return item;
    }
  }
  return null;
}

export const DockerIdeView: React.FC = () => {
  const {
    executeCommand,
    containers,
    images,
    volumes,
    dockerfileContent,
    setDockerfileContent,
    composeContent,
    setComposeContent,
  } = useDocker();

  // File explorer state
  const [activeFilePath, setActiveFilePath] = useState('Dockerfile');
  const [outputTab, setOutputTab] = useState<'terminal' | 'build' | 'logs'>('terminal');
  const [centerMode, setCenterMode] = useState<'editor' | 'simulation'>('editor');

  // Custom file contents for editable files (override PROJECT_FILES defaults)
  const [customFiles, setCustomFiles] = useState<Record<string, string>>({});

  const activeFile = useMemo(() => findFileInTree(PROJECT_TREE, activeFilePath), [activeFilePath]);

  const activeContent = useMemo(() => {
    // Sync with context for Dockerfile/compose
    if (activeFilePath === 'Dockerfile') return dockerfileContent;
    if (activeFilePath === 'docker-compose.yml') return composeContent;
    return customFiles[activeFilePath] || PROJECT_FILES[activeFilePath] || '// File not found';
  }, [activeFilePath, dockerfileContent, composeContent, customFiles]);

  const handleFileContentChange = useCallback((content: string) => {
    if (activeFilePath === 'Dockerfile') {
      setDockerfileContent(content);
    } else if (activeFilePath === 'docker-compose.yml') {
      setComposeContent(content);
    } else {
      setCustomFiles(prev => ({ ...prev, [activeFilePath]: content }));
    }
  }, [activeFilePath, setDockerfileContent, setComposeContent]);

  // Toolbar actions
  const handleBuildRun = () => {
    setOutputTab('build');
    executeCommand('docker build -t acme-api:latest .');
    executeCommand('docker run -d --name acme-api -p 3000:3000 acme-api:latest');
  };

  const handleComposeUp = () => {
    setOutputTab('build');
    executeCommand('docker compose up -d');
  };

  const handleComposeDown = () => {
    executeCommand('docker compose down');
  };

  const handlePush = () => {
    setOutputTab('build');
    executeCommand('docker push ghcr.io/acme-corp/acme-api:latest');
  };

  const handlePrune = () => {
    executeCommand('docker system prune -f');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden', background: 'var(--docker-dark-bg)' }}>

      {/* === TOP TOOLBAR === */}
      <div style={{
        height: '42px',
        background: '#0c1220',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem',
        flexShrink: 0,
      }}>
        {/* Left: Project name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1rem' }}>🐳</span>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#e2e8f0', letterSpacing: '-0.01em' }}>
            acme-saas-platform
          </span>
          <span style={{ fontSize: '0.65rem', color: '#475569', padding: '0.1rem 0.4rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
            v2.4.1
          </span>
        </div>

        {/* Center: View Switcher (Editor vs Enterprise Simulation Rig) */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', padding: '0.15rem' }}>
          <button
            onClick={() => setCenterMode('editor')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.2rem 0.6rem',
              borderRadius: '5px',
              border: 'none',
              background: centerMode === 'editor' ? '#0ea5e9' : 'transparent',
              color: centerMode === 'editor' ? '#fff' : '#94a3b8',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Code2 size={12} />
            Code Editor
          </button>
          <button
            onClick={() => setCenterMode('simulation')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.2rem 0.6rem',
              borderRadius: '5px',
              border: 'none',
              background: centerMode === 'simulation' ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' : 'transparent',
              color: centerMode === 'simulation' ? '#fff' : '#38bdf8',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: centerMode === 'simulation' ? '0 0 10px rgba(14, 165, 233, 0.4)' : 'none',
            }}
          >
            <Zap size={12} />
            ⚡ Enterprise Live Rig
          </button>
        </div>

        {/* Right: Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ToolbarButton icon={<Play size={12} fill="#fff" />} label="Build & Run" color="#0ea5e9" onClick={handleBuildRun} />
          <ToolbarButton icon={<ArrowUpCircle size={12} />} label="Compose Up" color="#4ade80" onClick={handleComposeUp} />
          <ToolbarButton icon={<StopCircle size={12} />} label="Compose Down" color="#f87171" onClick={handleComposeDown} />
          <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.08)', margin: '0 0.2rem' }} />
          <ToolbarButton icon={<Upload size={12} />} label="Push" color="#a78bfa" onClick={handlePush} />
          <ToolbarButton icon={<Trash2 size={12} />} label="Prune" color="#94a3b8" onClick={handlePrune} />
        </div>
      </div>

      {/* === MAIN WORKSPACE === */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: centerMode === 'simulation' ? '220px 1fr' : '220px 1fr 340px',
        height: 'calc(100% - 70px)',
        overflow: 'hidden',
      }}>

        {/* Column 1: File Explorer */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.08)', overflowY: 'auto', background: '#0a0f1a' }}>
          <IdeFileExplorer activeFilePath={activeFilePath} onSelectFile={setActiveFilePath} />
        </div>

        {/* Column 2: Code Editor OR Enterprise Simulation Rig */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {centerMode === 'simulation' ? (
            <EnterpriseDockerSimulator />
          ) : (
            <IdeSyntaxEditor
              filePath={activeFilePath}
              content={activeContent}
              language={activeFile?.language || 'dockerfile'}
              editable={activeFile?.editable ?? false}
              onChange={handleFileContentChange}
            />
          )}
        </div>

        {/* Column 3: Dashboard + Terminal (only when in editor mode) */}
        {centerMode === 'editor' && (
          <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>

            {/* Top: Container Dashboard with Live Hardware switches & fans */}
            <div style={{ height: '45%', overflowY: 'auto', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <IdeContainerDashboard />
            </div>

            {/* Bottom: Terminal / Build Output */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <IdeBuildOutput activeTab={outputTab} onTabChange={setOutputTab} />
              {outputTab === 'terminal' && (
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <DockerTerminal />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* === STATUS BAR === */}
      <IdeStatusBar />
    </div>
  );
};

// --- Helper: Toolbar Button ---
const ToolbarButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}> = ({ icon, label, color, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem',
      padding: '0.28rem 0.65rem',
      borderRadius: '5px',
      background: `${color}18`,
      border: `1px solid ${color}30`,
      color,
      fontSize: '0.7rem',
      fontWeight: 700,
      cursor: 'pointer',
      transition: 'all 0.15s ease',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.background = `${color}30`; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = `${color}18`; }}
  >
    {icon}
    {label}
  </button>
);
