import React, { useState } from 'react';
import { Server, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { UniversalDockerConcept } from '../../data/unifiedDockerData';

interface ClusterSimulatorProps {
  concept: UniversalDockerConcept;
  simState: 'created' | 'running' | 'paused' | 'stopped' | 'removed';
  setSimState: (s: 'created' | 'running' | 'paused' | 'stopped' | 'removed') => void;
  showToast: (msg: string) => void;
}

export const ClusterSimulator: React.FC<ClusterSimulatorProps> = ({
  concept,
  showToast,
}) => {
  const [replicas, setReplicas] = useState<number>(3);
  const [worker1Healthy, setWorker1Healthy] = useState<boolean>(true);
  const [rescheduling, setRescheduling] = useState<boolean>(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* HEADER & CONTROLS */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--docker-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <Server size={18} color="var(--docker-blue)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>
            Engine E: Multi-Node Cluster Orchestrator & Auto-Scaler
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
            <span>Replicas: <strong>{replicas}</strong></span>
            <button
              onClick={() => {
                const r = Math.min(replicas + 1, 6);
                setReplicas(r);
                showToast(`Scaled up replicas to ${r}`);
              }}
              style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'var(--docker-blue)', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}
            >
              + Scale Up
            </button>
            <button
              onClick={() => {
                const r = Math.max(replicas - 1, 1);
                setReplicas(r);
                showToast(`Scaled down replicas to ${r}`);
              }}
              style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#cbd5e1', border: '1px solid var(--docker-border)', fontWeight: 800, cursor: 'pointer' }}
            >
              - Scale Down
            </button>
          </div>

          <button
            onClick={() => {
              if (worker1Healthy) {
                setWorker1Healthy(false);
                setRescheduling(true);
                showToast('⚠️ Worker Node 1 Crashed! Orchestration self-healing loop invoked...');
                setTimeout(() => {
                  setRescheduling(false);
                  showToast('✅ Desired state restored! Replicas rescheduled on Worker 2.');
                }, 2000);
              } else {
                setWorker1Healthy(true);
                showToast('♻️ Worker Node 1 recovered and re-joined the cluster mesh.');
              }
            }}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              background: worker1Healthy ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
              color: worker1Healthy ? '#f87171' : '#4ade80',
              border: worker1Healthy ? '1px solid #ef4444' : '1px solid #22c55e',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            {worker1Healthy ? 'Simulate Node Crash' : 'Recover Node'}
          </button>
        </div>
      </div>

      {/* CLUSTER TOPOLOGY GRAPH */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {/* Manager Node */}
        <div style={{ background: 'rgba(14, 165, 233, 0.12)', border: '1px solid var(--docker-blue)', padding: '1rem', borderRadius: '10px' }}>
          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#fff', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Manager Node (Leader)</span>
            <ShieldCheck size={16} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '0.74rem', color: '#cbd5e1', fontFamily: 'JetBrains Mono' }}>Raft Consensus Control Plane</div>
          <div style={{ fontSize: '0.72rem', color: '#38bdf8', marginTop: '0.5rem' }}>Desired State: {replicas} replicas</div>
        </div>

        {/* Worker Node 1 */}
        <div style={{ background: !worker1Healthy ? 'rgba(239, 68, 68, 0.12)' : 'rgba(255,255,255,0.03)', border: !worker1Healthy ? '1px dashed #ef4444' : '1px solid var(--docker-border)', padding: '1rem', borderRadius: '10px' }}>
          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: !worker1Healthy ? '#f87171' : '#fff', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Worker Node 1</span>
            {!worker1Healthy && <AlertTriangle size={16} color="#ef4444" />}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>
            {!worker1Healthy ? 'NODE UNREACHABLE (CRASHED)' : `Running Math.ceil(${replicas}/2) replicas`}
          </div>
        </div>

        {/* Worker Node 2 */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--docker-border)', padding: '1rem', borderRadius: '10px' }}>
          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#fff', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Worker Node 2</span>
            <Server size={16} color="#4ade80" />
          </div>
          <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>
            {rescheduling ? '⚡ Absorbing rescheduled replicas...' : `Running ${replicas} total cluster replica(s)`}
          </div>
        </div>
      </div>
    </div>
  );
};
