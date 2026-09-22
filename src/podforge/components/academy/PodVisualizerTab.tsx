import React, { useState } from 'react';
import type { KubeConcept } from '../../data/topics/types';
import { ClusterCanvas } from '../visualizer/ClusterCanvas';
import { KubeFlowDiagram } from '../diagrams/KubeFlowDiagram';
import { useApp } from '../../context/AppContext';
import {
  Play,
  Zap,
  Network,
  Server,
  Flame,
  AlertOctagon,
  TrendingUp,
  RefreshCcw,
  Boxes,
  Activity,
} from 'lucide-react';

interface Props {
  concept: KubeConcept;
}

interface ChaosEventLog {
  id: string;
  time: string;
  type: 'kill' | 'scale' | 'drain' | 'rollout';
  message: string;
}

import { getVisualizerCapabilities } from '../../data/topics/visualizerScope';

export const PodVisualizerTab: React.FC<Props> = ({ concept }) => {
  const { executeCommand } = useApp();
  const [visualizerMode, setVisualizerMode] = useState<'diagram' | 'topology'>('diagram');
  const [chaosLogs, setChaosLogs] = useState<ChaosEventLog[]>([]);

  const caps = getVisualizerCapabilities(concept);
  const allowsPodCrash = caps.allowsPodCrash;
  const allowsHpaSpike = caps.allowsHpaSpike;
  const allowsNodeDrain = caps.allowsNodeDrain;
  const allowsRollingUpdate = caps.allowsRollingUpdate;
  const hasAnySimulatorAction = caps.supportsChaosSimulator;
  const allowsScale = caps.allowsScale;
  const allowsApply = caps.allowsApply;
  const supportsTopology = caps.supportsTopology;

  const addChaosLog = (type: 'kill' | 'scale' | 'drain' | 'rollout', msg: string) => {
    const newLog: ChaosEventLog = {
      id: `${Date.now()}-${Math.random()}`,
      time: new Date().toLocaleTimeString(),
      type,
      message: msg,
    };
    setChaosLogs((prev) => [newLog, ...prev.slice(0, 3)]);
  };

  const handleSimulateApply = () => {
    executeCommand('kubectl apply -f manifest.yaml');
    addChaosLog('scale', 'kubectl apply -f manifest.yaml executed. Desired state applied to API server.');
  };

  const handleSimulateScale = () => {
    executeCommand('kubectl scale deployment web-app --replicas=4');
    addChaosLog('scale', 'Scaled deployment web-app to 4 replicas. ReplicaSet reconciling 4 Pods across nodes.');
  };

  const handleKillPod = () => {
    executeCommand('kubectl delete pod web-app-7b9f8-x4q2 --grace-period=0 --force');
    addChaosLog(
      'kill',
      'Simulated Pod Crash: Kubelet detected pod termination. ReplicaSet controller observed 2/3 desired pods and automatically scheduled a replacement pod!'
    );
  };

  const handleTrafficSpike = () => {
    executeCommand('kubectl autoscale deployment web-app --cpu-percent=70 --min=2 --max=6');
    addChaosLog(
      'scale',
      'Simulated Traffic Surge: CPU utilization reached 88% > 70% threshold. HPA controller scaled replicas from 2 to 5 pods across worker nodes!'
    );
  };

  const handleDrainNode = () => {
    executeCommand('kubectl drain worker-node-2 --ignore-daemonsets --delete-emptydir-data');
    addChaosLog(
      'drain',
      'Simulated Node Maintenance: worker-node-2 cordoned. Pods gracefully terminated and evacuated to worker-node-1 with zero downtime.'
    );
  };

  const handleRollingUpdate = () => {
    executeCommand('kubectl set image deployment/web-app web=nginx:1.26-alpine --record');
    addChaosLog(
      'rollout',
      'Simulated Rolling Update: Deployment created new ReplicaSet v2. MaxSurge: 1 spawned v2 pod before terminating v1 pod (Zero Downtime).'
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'fadeIn 0.25s ease-out' }}>
      {/* Visualizer Context Banner & Mode Switcher */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(50, 108, 229, 0.15) 0%, rgba(56, 189, 248, 0.08) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '14px',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.2)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
            }}
          >
            {visualizerMode === 'diagram' ? <Network size={22} /> : <Server size={22} />}
          </div>
          <div>
            <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#fff' }}>
              Visual Engine: {concept.number} {concept.title}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.15rem' }}>
              {concept.visualizerFocus}
            </div>
          </div>
        </div>

        {/* Mode Switcher Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {supportsTopology && (
            <div
              style={{
                display: 'flex',
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '8px',
                padding: '0.25rem',
                border: '1px solid rgba(56, 189, 248, 0.3)',
              }}
            >
              <button
                onClick={() => setVisualizerMode('diagram')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: visualizerMode === 'diagram' ? 'var(--k8s-blue)' : 'transparent',
                  color: visualizerMode === 'diagram' ? '#fff' : '#94a3b8',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Network size={14} />
                <span>Architecture &amp; Flow Diagram</span>
              </button>

              <button
                onClick={() => setVisualizerMode('topology')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: visualizerMode === 'topology' ? 'var(--k8s-blue)' : 'transparent',
                  color: visualizerMode === 'topology' ? '#fff' : '#94a3b8',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Server size={14} />
                <span>Live Cluster Topology</span>
              </button>
            </div>
          )}

          {/* Quick Apply / Scale triggers - Only rendered where valid */}
          {(allowsApply || allowsScale) && (
            <div style={{ display: 'flex', gap: '0.45rem' }}>
              {allowsApply && (
                <button
                  onClick={handleSimulateApply}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '7px',
                    padding: '0.35rem 0.65rem',
                    color: '#38bdf8',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <Play size={12} /> Apply Manifest
                </button>
              )}

              {allowsScale && (
                <button
                  onClick={handleSimulateScale}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '7px',
                    padding: '0.35rem 0.65rem',
                    color: '#10b981',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <Zap size={12} /> Scale
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* TARGETED SIMULATOR TOOLBAR: ONLY SHOWN WHERE DIRECTLY REQUIRED */}
      {hasAnySimulatorAction && (
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '0.85rem 1.15rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.76rem', fontWeight: 800, color: '#f87171', textTransform: 'uppercase' }}>
              <Flame size={15} color="#ef4444" />
              <span>Targeted Behavioral Simulator</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Interactive simulation relevant to {concept.title}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {allowsPodCrash && (
              <button
                onClick={handleKillPod}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: '8px',
                  padding: '0.45rem 0.85rem',
                  color: '#f87171',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <AlertOctagon size={14} />
                <span>Simulate Pod Crash (Self-Healing)</span>
              </button>
            )}

            {allowsHpaSpike && (
              <button
                onClick={handleTrafficSpike}
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '8px',
                  padding: '0.45rem 0.85rem',
                  color: '#fbbf24',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <TrendingUp size={14} />
                <span>Simulate Traffic Spike (HPA)</span>
              </button>
            )}

            {allowsNodeDrain && (
              <button
                onClick={handleDrainNode}
                style={{
                  background: 'rgba(168, 85, 247, 0.15)',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  borderRadius: '8px',
                  padding: '0.45rem 0.85rem',
                  color: '#c084fc',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <Boxes size={14} />
                <span>Simulate Node Drain (Eviction)</span>
              </button>
            )}

            {allowsRollingUpdate && (
              <button
                onClick={handleRollingUpdate}
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '8px',
                  padding: '0.45rem 0.85rem',
                  color: '#34d399',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <RefreshCcw size={14} />
                <span>Simulate Rolling Update (Zero Downtime)</span>
              </button>
            )}
          </div>

          {/* Chaos Event Feed */}
          {chaosLogs.length > 0 && (
            <div style={{ background: 'rgba(0, 0, 0, 0.6)', borderRadius: '8px', padding: '0.65rem 0.85rem', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Activity size={12} color="#38bdf8" />
                <span>Cluster Event Reconciler Output:</span>
              </div>
              {chaosLogs.slice(0, 2).map((log) => (
                <div key={log.id} style={{ fontSize: '0.76rem', color: '#e2e8f0', lineHeight: 1.45, display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                  <span style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', flexShrink: 0 }}>[{log.time}]</span>
                  <span>{log.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Visualizer Content */}
      {visualizerMode === 'diagram' ? (
        <KubeFlowDiagram concept={concept} />
      ) : (
        <div
          style={{
            height: '620px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
          }}
        >
          <ClusterCanvas />
        </div>
      )}
    </div>
  );
};
