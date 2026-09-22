import React, { useState, useEffect, useRef } from 'react';
import { useDocker } from '../../context/DockerContext';
import { Terminal, Settings, FileCode, Play, Check, ArrowDown, Activity } from 'lucide-react';

interface IdeBuildOutputProps {
  activeTab: 'terminal' | 'build' | 'logs';
  onTabChange: (tab: 'terminal' | 'build' | 'logs') => void;
}

const BUILD_STEPS_SIMULATION = [
  { text: '=> [internal] load build definition from Dockerfile', type: 'info' },
  { text: '=> [internal] load .dockerignore', type: 'info' },
  { text: '=> [builder 1/5] FROM node:20-alpine@sha256:1a84f3', type: 'pulled' },
  { text: '=> CACHED [builder 2/5] COPY package*.json ./', type: 'cached' },
  { text: '=> CACHED [builder 3/5] RUN npm ci --production=false', type: 'cached' },
  { text: '=> [builder 4/5] COPY src/ ./src/', type: 'pulled' },
  { text: '=> [builder 5/5] RUN npm run build', type: 'pulled' },
  { text: '=> [production 1/3] FROM node:20-alpine', type: 'pulled' },
  { text: '=> [production 2/3] COPY --from=builder /app/dist ./dist', type: 'pulled' },
  { text: '=> [production 3/3] COPY --from=builder /app/node_modules ./node_modules', type: 'pulled' },
  { text: '=> exporting to image', type: 'info' }
];

const LOG_MESSAGES = [
  '🚀 Acme API running on port 3000',
  '📊 Health: http://localhost:3000/health',
  'GET /health 200 3ms',
  'GET /api/users 200 12ms (cache hit)'
];

export const IdeBuildOutput: React.FC<IdeBuildOutputProps> = ({ activeTab, onTabChange }) => {
  const { containers, images } = useDocker();
  
  // Build Output State
  const [buildSteps, setBuildSteps] = useState<{ text: string, type: string }[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  
  // Logs State
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const simulateBuild = () => {
    setIsBuilding(true);
    setBuildSteps([]);
    let step = 0;
    
    const interval = setInterval(() => {
      if (step < BUILD_STEPS_SIMULATION.length) {
        setBuildSteps(prev => [...prev, BUILD_STEPS_SIMULATION[step]]);
        step++;
      } else {
        clearInterval(interval);
        setIsBuilding(false);
      }
    }, 300);
  };

  useEffect(() => {
    let logInterval: ReturnType<typeof setInterval>;
    if (activeTab === 'logs') {
      logInterval = setInterval(() => {
        const dateStr = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
        const randomLog = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
        setLogs(prev => [...prev, `${dateStr}  ${randomLog}`]);
      }, 2500);
    }
    
    return () => clearInterval(logInterval);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'logs' && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, activeTab]);

  const renderIcon = (type: string) => {
    switch(type) {
      case 'cached': return <Check size={14} style={{ color: '#4ade80', marginRight: '8px' }} />;
      case 'pulled': return <ArrowDown size={14} style={{ color: '#38bdf8', marginRight: '8px' }} />;
      default: return <span style={{ width: '22px', display: 'inline-block' }}></span>;
    }
  };

  const getLineColor = (type: string) => {
    switch(type) {
      case 'cached': return '#fbbf24'; // yellow-amber for cached
      case 'pulled': return '#e2e8f0';
      default: return '#94a3b8';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#050810', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Tab Bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 16px', alignItems: 'center' }}>
        <button 
          onClick={() => onTabChange('terminal')}
          style={{
            background: 'none', border: 'none', color: activeTab === 'terminal' ? '#e2e8f0' : '#94a3b8',
            padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
            borderBottom: activeTab === 'terminal' ? '2px solid #38bdf8' : '2px solid transparent',
            fontFamily: 'inherit', fontSize: '0.85rem'
          }}
        >
          <Terminal size={14} /> Terminal
        </button>
        <button 
          onClick={() => onTabChange('build')}
          style={{
            background: 'none', border: 'none', color: activeTab === 'build' ? '#e2e8f0' : '#94a3b8',
            padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
            borderBottom: activeTab === 'build' ? '2px solid #38bdf8' : '2px solid transparent',
            fontFamily: 'inherit', fontSize: '0.85rem'
          }}
        >
          <Settings size={14} /> Build Output
        </button>
        <button 
          onClick={() => onTabChange('logs')}
          style={{
            background: 'none', border: 'none', color: activeTab === 'logs' ? '#e2e8f0' : '#94a3b8',
            padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
            borderBottom: activeTab === 'logs' ? '2px solid #38bdf8' : '2px solid transparent',
            fontFamily: 'inherit', fontSize: '0.85rem'
          }}
        >
          <Activity size={14} /> Docker Logs
        </button>
        
        {activeTab === 'build' && (
          <div style={{ marginLeft: 'auto' }}>
            <button
              onClick={simulateBuild}
              disabled={isBuilding}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: isBuilding ? 'rgba(255,255,255,0.1)' : '#1a2332',
                border: '1px solid rgba(255,255,255,0.1)',
                color: isBuilding ? '#94a3b8' : '#e2e8f0',
                padding: '4px 12px', borderRadius: '4px', cursor: isBuilding ? 'not-allowed' : 'pointer',
                fontSize: '0.75rem', fontFamily: 'inherit'
              }}
            >
              <Play size={12} style={{ color: isBuilding ? '#94a3b8' : '#4ade80' }} />
              {isBuilding ? 'Building...' : 'Simulate Build'}
            </button>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8rem', color: '#e2e8f0' }}>
        {activeTab === 'terminal' && null}
        
        {activeTab === 'build' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {buildSteps.length > 0 && (
              <div style={{ marginBottom: '8px', color: '#e2e8f0', fontWeight: 'bold' }}>
                [+] Building {isBuilding ? '...' : '12.3s'} ({buildSteps.length}/{BUILD_STEPS_SIMULATION.length}) {isBuilding ? '' : 'FINISHED'}
              </div>
            )}
            {buildSteps.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', color: getLineColor(step.type) }}>
                {renderIcon(step.type)}
                <span>{step.text}</span>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'logs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {logs.length === 0 ? (
              <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>Waiting for logs...</div>
            ) : (
              logs.map((log, idx) => {
                const parts = log.split('  ');
                return (
                  <div key={idx} style={{ display: 'flex', gap: '16px' }}>
                    <span style={{ color: '#94a3b8' }}>{parts[0]}</span>
                    <span style={{ color: '#e2e8f0' }}>{parts[1]}</span>
                  </div>
                );
              })
            )}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};
