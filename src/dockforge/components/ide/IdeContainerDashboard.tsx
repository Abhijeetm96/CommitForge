import React, { useState } from 'react';
import { useDocker } from '../../context/DockerContext';
import { Container } from '../../docker-engine/types';
import { Square, Play, RotateCw, ScrollText, Terminal as TerminalIcon, Zap } from 'lucide-react';
import { CoolingTurbineFan } from '../../../components/simulation/CoolingTurbineFan';
import { LuminousBulb } from '../../../components/simulation/LuminousBulb';
import { PhysicalRockerSwitch } from '../../../components/simulation/PhysicalRockerSwitch';

export const IdeContainerDashboard: React.FC = () => {
  const { containers, executeCommand } = useDocker();
  const [selectedLogs, setSelectedLogs] = useState<string | null>(null);

  const handleStop = (name: string) => {
    executeCommand(`docker stop ${name}`);
  };

  const handleRestart = (name: string) => {
    executeCommand(`docker restart ${name}`);
  };

  const handleTogglePower = (name: string, currentlyRunning: boolean) => {
    if (currentlyRunning) {
      handleStop(name);
    } else {
      executeCommand(`docker start ${name}`);
    }
  };

  const handleRefresh = () => {
    // Force a dummy command just to trigger a re-render from context, or rely on state.
    executeCommand('docker ps');
  };

  const toggleLogs = (name: string) => {
    setSelectedLogs(selectedLogs === name ? null : name);
  };

  const getBulbState = (state: string) => {
    const s = state.toLowerCase();
    if (s === 'running') return 'green';
    if (s === 'exited' || s === 'stopped' || s === 'dead') return 'red';
    return 'amber';
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'transparent',
      color: '#e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 1rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        backgroundColor: '#0f1724'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={15} color="#38bdf8" />
          <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.05em' }}>LIVE HARDWARE RIG</span>
          <span style={{
            backgroundColor: '#1a2332',
            padding: '0.1rem 0.4rem',
            borderRadius: '12px',
            fontSize: '0.72rem',
            color: '#38bdf8',
            fontWeight: 700,
          }}>
            {containers.length} active
          </span>
        </div>
        <button
          onClick={handleRefresh}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#94a3b8',
            padding: '0.2rem'
          }}
          title="Refresh"
        >
          <RotateCw size={14} />
        </button>
      </div>

      {/* Container List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
        {containers.length === 0 ? (
          <div style={{
            padding: '2rem 1rem',
            textAlign: 'center',
            color: '#94a3b8',
            fontSize: '0.78rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <CoolingTurbineFan status="stopped" size={42} showRpm={false} />
            <span>No containers active. Click &quot;Build &amp; Run&quot; above to ignite the rig!</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {containers.map((container: Container) => {
              const isRunning = container.status.toLowerCase() === 'running';
              return (
                <div key={container.id} style={{
                  backgroundColor: '#0b1120',
                  border: `1px solid ${isRunning ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '8px',
                  padding: '0.65rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  boxShadow: isRunning ? '0 0 14px rgba(14, 165, 233, 0.15)' : 'none',
                }}>
                  {/* Top: Bulb + Name + Rocker Switch */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <LuminousBulb
                        state={getBulbState(container.status)}
                        size={18}
                        label={container.name}
                        sublabel={container.imageName}
                      />
                    </div>
                    {/* Direct Physical Switch */}
                    <PhysicalRockerSwitch
                      checked={isRunning}
                      onChange={() => handleTogglePower(container.name, isRunning)}
                      color="emerald"
                      size="sm"
                    />
                  </div>

                  {/* Middle: Fan + Ports + CPU Load */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(0,0,0,0.3)',
                    padding: '0.4rem 0.6rem',
                    borderRadius: '6px',
                  }}>
                    {/* Spinning Turbine Fan */}
                    <CoolingTurbineFan
                      status={isRunning ? (container.cpuUsagePct > 70 ? 'turbo' : 'running') : 'stopped'}
                      size={36}
                      showRpm={true}
                    />

                    {/* Ports */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>PORTS</span>
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {container.ports.map((p, idx) => (
                          <span key={idx} style={{
                            backgroundColor: 'rgba(56,189,248,0.15)',
                            color: '#38bdf8',
                            padding: '0.1rem 0.35rem',
                            borderRadius: '4px',
                            fontSize: '0.68rem',
                            fontFamily: 'var(--font-mono, monospace)'
                          }}>
                            {p.hostPort}&rarr;{p.containerPort}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CPU gauge */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                      <span style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 600 }}>CPU</span>
                      <div style={{ width: '50px', height: '4px', backgroundColor: '#1a2332', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${Math.min(container.cpuUsagePct, 100)}%`,
                          backgroundColor: container.cpuUsagePct > 80 ? '#f87171' : '#4ade80'
                        }} />
                      </div>
                      <span style={{ fontSize: '0.66rem', color: isRunning ? '#4ade80' : '#64748b', fontWeight: 700 }}>
                        {isRunning ? `${container.cpuUsagePct.toFixed(1)}%` : 'OFF'}
                      </span>
                    </div>
                  </div>

                  {/* Action row (Restart / Logs) */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                    <button
                      onClick={() => handleRestart(container.name)}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '4px',
                        padding: '0.18rem 0.45rem',
                        fontSize: '0.68rem',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <RotateCw size={11} /> Reboot
                    </button>
                    <button
                      onClick={() => toggleLogs(container.name)}
                      style={{
                        background: selectedLogs === container.name ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '4px',
                        padding: '0.18rem 0.45rem',
                        fontSize: '0.68rem',
                        color: selectedLogs === container.name ? '#38bdf8' : '#94a3b8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <ScrollText size={11} /> Logs
                    </button>
                  </div>

                  {/* Logs Drawer */}
                  {selectedLogs === container.name && (
                    <div style={{
                      backgroundColor: '#050914',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-mono, monospace)',
                      color: '#38bdf8',
                      maxHeight: '80px',
                      overflowY: 'auto'
                    }}>
                      {container.logs && container.logs.length > 0 ? container.logs.join('\n') : '[info] container initialized and listening for requests'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
