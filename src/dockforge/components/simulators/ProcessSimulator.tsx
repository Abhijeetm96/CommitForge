import React, { useState } from 'react';
import { Cpu, Play, Pause, Square, Trash2, ShieldCheck, Activity, AlertTriangle } from 'lucide-react';
import { UniversalDockerConcept } from '../../data/unifiedDockerData';

interface ProcessSimulatorProps {
  concept: UniversalDockerConcept;
  simState: 'created' | 'running' | 'paused' | 'stopped' | 'removed';
  setSimState: (s: 'created' | 'running' | 'paused' | 'stopped' | 'removed') => void;
  showToast: (msg: string) => void;
}

export const ProcessSimulator: React.FC<ProcessSimulatorProps> = ({
  concept,
  simState,
  setSimState,
  showToast,
}) => {
  const [pidNamespaceActive, setPidNamespaceActive] = useState<boolean>(true);
  const [cpuLimit, setCpuLimit] = useState<number>(50); // %
  const [memoryLimit, setMemoryLimit] = useState<number>(512); // MB
  const [memoryRequested, setMemoryRequested] = useState<number>(300); // MB
  const [secNonRoot, setSecNonRoot] = useState<boolean>(true);

  const isOomKilled = memoryRequested > memoryLimit;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* CONTROL DASHBOARD HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', background: 'rgba(0,0,0,0.3)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--docker-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <Cpu size={18} color="var(--docker-blue)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>
            Engine A: Process Isolation & Linux Kernel Controls
          </span>
        </div>

        {/* State Control Action Buttons */}
        <div style={{ display: 'flex', gap: '0.45rem' }}>
          <button
            onClick={() => {
              setSimState('running');
              showToast('🟢 Container spawned as PID 1 inside isolated namespace.');
            }}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              background: simState === 'running' ? 'rgba(34, 197, 94, 0.25)' : 'rgba(255,255,255,0.05)',
              border: simState === 'running' ? '1px solid #22c55e' : '1px solid var(--docker-border)',
              color: simState === 'running' ? '#4ade80' : '#cbd5e1',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <Play size={13} color="#22c55e" />
            Start
          </button>

          <button
            onClick={() => {
              setSimState('paused');
              showToast('🟡 Container cgroups freezer invoked. CPU ticks frozen.');
            }}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              background: simState === 'paused' ? 'rgba(234, 179, 8, 0.25)' : 'rgba(255,255,255,0.05)',
              border: simState === 'paused' ? '1px solid #eab308' : '1px solid var(--docker-border)',
              color: simState === 'paused' ? '#facc15' : '#cbd5e1',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <Pause size={13} color="#eab308" />
            Pause
          </button>

          <button
            onClick={() => {
              setSimState('stopped');
              showToast('🔴 SIGTERM sent to PID 1. Graceful shutdown complete.');
            }}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              background: simState === 'stopped' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255,255,255,0.05)',
              border: simState === 'stopped' ? '1px solid #ef4444' : '1px solid var(--docker-border)',
              color: simState === 'stopped' ? '#f87171' : '#cbd5e1',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <Square size={13} color="#ef4444" />
            Stop
          </button>

          <button
            onClick={() => {
              setSimState('removed');
              showToast('🧹 Container unlinked from PID namespace and memory freed.');
            }}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              background: simState === 'removed' ? 'rgba(148, 163, 184, 0.25)' : 'rgba(255,255,255,0.05)',
              border: '1px solid var(--docker-border)',
              color: '#cbd5e1',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <Trash2 size={13} />
            Remove
          </button>
        </div>
      </div>

      {/* DUAL PANELS: NAMESPACES & CGROUPS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* PANEL 1: NAMESPACE PID VISIBILITY */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--docker-border)', padding: '1rem', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Activity size={16} color="#38bdf8" />
              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#fff' }}>Linux PID Namespace</span>
            </div>
            <label style={{ fontSize: '0.72rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={pidNamespaceActive}
                onChange={(e) => {
                  setPidNamespaceActive(e.target.checked);
                  showToast(e.target.checked ? 'PID Namespace Enabled: Process isolated as PID 1' : 'PID Namespace Disabled: Process sees host PIDs!');
                }}
              />
              <span>Isolate PID</span>
            </label>
          </div>

          <div style={{ background: '#090d16', padding: '0.75rem', borderRadius: '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#cbd5e1', minHeight: '120px' }}>
            {simState === 'removed' ? (
              <div style={{ color: '#94a3b8', fontStyle: 'italic', padding: '1.5rem 0', textAlign: 'center' }}>
                Container process terminated. No PID allocated.
              </div>
            ) : pidNamespaceActive ? (
              <div>
                <div style={{ color: '#4ade80', fontWeight: 800, marginBottom: '0.4rem' }}>Inside Container PID View:</div>
                <div>PID 1 &nbsp;&rarr; {concept.command.split(' ')[0] || 'nginx'} (master process)</div>
                <div>PID 7 &nbsp;&rarr; worker process</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.6rem' }}>
                  🔒 Other host processes are completely invisible to this container.
                </div>
              </div>
            ) : (
              <div>
                <div style={{ color: '#facc15', fontWeight: 800, marginBottom: '0.4rem' }}>Host Shared PID View (Unisolated):</div>
                <div>PID 1 &nbsp;&rarr; systemd</div>
                <div>PID 842 &rarr; containerd</div>
                <div>PID 4920 &rarr; {concept.command.split(' ')[0] || 'nginx'}</div>
                <div>PID 8102 &rarr; chrome</div>
              </div>
            )}
          </div>
        </div>

        {/* PANEL 2: CGROUPS RESOURCE CONTROL */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--docker-border)', padding: '1rem', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} color="#facc15" />
              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#fff' }}>cgroups v2 Quota Limits</span>
            </div>
            {isOomKilled && (
              <span style={{ fontSize: '0.68rem', fontWeight: 800, background: 'rgba(239, 68, 68, 0.25)', color: '#f87171', border: '1px solid #ef4444', padding: '0.15rem 0.5rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <AlertTriangle size={11} /> OOM KILLED (Exit 137)
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.78rem' }}>
            {/* CPU Control Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', marginBottom: '0.25rem' }}>
                <span>CPU Quota Limit: <strong>{cpuLimit}% Core</strong></span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={cpuLimit}
                onChange={(e) => setCpuLimit(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#0ea5e9' }}
              />
            </div>

            {/* RAM Limit & Request Controls */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', marginBottom: '0.25rem' }}>
                <span>cgroups Memory Limit: <strong>{memoryLimit} MB</strong></span>
                <span>App RAM Requested: <strong style={{ color: isOomKilled ? '#f87171' : '#4ade80' }}>{memoryRequested} MB</strong></span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
                <button
                  onClick={() => {
                    setMemoryRequested(256);
                    showToast('App requesting 256MB RAM (Within cgroups limit)');
                  }}
                  style={{ flex: 1, padding: '0.3rem', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--docker-border)', color: '#cbd5e1', fontSize: '0.72rem', cursor: 'pointer' }}
                >
                  Request 256MB
                </button>
                <button
                  onClick={() => {
                    setMemoryRequested(700);
                    showToast('⚠️ App requested 700MB RAM! Exceeded cgroups 512MB limit -> OOMKilled!');
                  }}
                  style={{ flex: 1, padding: '0.3rem', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171', fontSize: '0.72rem', cursor: 'pointer' }}
                >
                  Request 700MB (Exceed Limit)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
