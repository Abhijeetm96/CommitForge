import React from 'react';
import type { KubeConcept } from '../../data/topics/types';
import { ClusterCanvas } from '../visualizer/ClusterCanvas';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  Server,
  Play,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';

interface Props {
  concept: KubeConcept;
}

export const PodVisualizerTab: React.FC<Props> = ({ concept }) => {
  const { executeCommand } = useApp();

  const handleSimulateApply = () => {
    executeCommand('kubectl apply -f manifest.yaml');
  };

  const handleSimulateScale = () => {
    executeCommand('kubectl scale deployment web-app --replicas=4');
  };

  const handleSimulateGet = () => {
    executeCommand('kubectl get all -o wide');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'fadeIn 0.25s ease-out' }}>
      {/* Visualizer Context Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(50, 108, 229, 0.15) 0%, rgba(56, 189, 248, 0.08) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '12px',
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
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
            }}
          >
            <Activity size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff' }}>
              Cluster Topology Focus: {concept.number} {concept.title}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.15rem' }}>
              {concept.visualizerFocus}
            </div>
          </div>
        </div>

        {/* Quick Simulator Triggers */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleSimulateApply}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '7px',
              padding: '0.35rem 0.75rem',
              color: '#38bdf8',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Play size={12} /> Apply Manifest
          </button>

          <button
            onClick={handleSimulateScale}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '7px',
              padding: '0.35rem 0.75rem',
              color: '#10b981',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Zap size={12} /> Scale Workload
          </button>
        </div>
      </div>

      {/* Cluster Canvas Container */}
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
    </div>
  );
};
