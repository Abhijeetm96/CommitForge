import React from 'react';
import { useDocker } from '../../context/DockerContext';
import { DockerTerminal } from '../terminal/DockerTerminal';
import { FileCode, Play, Terminal, Layers, Box, Check, RefreshCw, HardDrive } from 'lucide-react';

export const DockerIdeView: React.FC = () => {
  const {
    activeIdeFile,
    setActiveIdeFile,
    dockerfileContent,
    setDockerfileContent,
    composeContent,
    setComposeContent,
    executeCommand,
    containers,
  } = useDocker();

  const handleBuildRun = () => {
    if (activeIdeFile === 'Dockerfile') {
      executeCommand('docker build -t my-app:latest .');
    } else {
      executeCommand('docker compose up -d');
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden', background: 'var(--docker-dark-bg)' }}>
      {/* IDE Top Action Bar */}
      <div
        style={{
          height: '45px',
          background: 'var(--docker-surface)',
          borderBottom: '1px solid var(--docker-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.25rem',
        }}
      >
        {/* File Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            onClick={() => setActiveIdeFile('Dockerfile')}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '6px 6px 0 0',
              background: activeIdeFile === 'Dockerfile' ? 'var(--docker-dark-bg)' : 'transparent',
              border: 'none',
              borderTop: activeIdeFile === 'Dockerfile' ? '2px solid var(--docker-blue)' : '2px solid transparent',
              color: activeIdeFile === 'Dockerfile' ? '#fff' : 'var(--docker-text-secondary)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <FileCode size={14} color="#0ea5e9" />
            Dockerfile
          </button>

          <button
            onClick={() => setActiveIdeFile('docker-compose.yml')}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '6px 6px 0 0',
              background: activeIdeFile === 'docker-compose.yml' ? 'var(--docker-dark-bg)' : 'transparent',
              border: 'none',
              borderTop: activeIdeFile === 'docker-compose.yml' ? '2px solid var(--docker-blue)' : '2px solid transparent',
              color: activeIdeFile === 'docker-compose.yml' ? '#fff' : 'var(--docker-text-secondary)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Layers size={14} color="#38bdf8" />
            docker-compose.yml
          </button>
        </div>

        {/* Action Controls */}
        <button
          onClick={handleBuildRun}
          style={{
            padding: '0.35rem 0.9rem',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
            color: '#fff',
            border: 'none',
            fontSize: '0.78rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: '0 2px 8px rgba(14, 165, 233, 0.4)',
          }}
        >
          <Play size={13} fill="#fff" />
          {activeIdeFile === 'Dockerfile' ? 'Build & Run Image' : 'Compose Up'}
        </button>
      </div>

      {/* Main Workspace Layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', height: 'calc(100% - 45px)' }}>
        {/* Editor Side */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--docker-border)', height: '100%' }}>
          <textarea
            value={activeIdeFile === 'Dockerfile' ? dockerfileContent : composeContent}
            onChange={(e) => {
              if (activeIdeFile === 'Dockerfile') {
                setDockerfileContent(e.target.value);
              } else {
                setComposeContent(e.target.value);
              }
            }}
            spellCheck={false}
            style={{
              flex: 1,
              width: '100%',
              background: '#070b14',
              color: '#38bdf8',
              fontFamily: 'JetBrains Mono, Fira Code, monospace',
              fontSize: '0.88rem',
              lineHeight: 1.6,
              padding: '1.25rem',
              border: 'none',
              outline: 'none',
              resize: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Output Side: Containers Monitor & Terminal */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Active Containers Mini Inspector */}
          <div style={{ padding: '0.85rem 1rem', background: 'var(--docker-surface)', borderBottom: '1px solid var(--docker-border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--docker-text-secondary)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Active Containers ({containers.length})
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
              {containers.map((c) => (
                <div key={c.id} style={{ padding: '0.4rem 0.65rem', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--docker-border)', fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
                  <span style={{ fontWeight: 700, color: '#fff' }}>{c.name}</span>
                  <span style={{ color: c.status === 'running' ? '#4ade80' : '#ef4444', marginLeft: '0.4rem' }}>● {c.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Terminal */}
          <div style={{ flex: 1, height: '100%' }}>
            <DockerTerminal />
          </div>
        </div>
      </div>
    </div>
  );
};
