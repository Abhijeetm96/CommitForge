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
} from 'lucide-react';

interface Props {
  concept: KubeConcept;
}

export const PodVisualizerTab: React.FC<Props> = ({ concept }) => {
  const { executeCommand } = useApp();
  const [visualizerMode, setVisualizerMode] = useState<'diagram' | 'topology'>('diagram');

  const handleSimulateApply = () => {
    executeCommand('kubectl apply -f manifest.yaml');
  };

  const handleSimulateScale = () => {
    executeCommand('kubectl scale deployment web-app --replicas=4');
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

          {/* Quick Simulator Triggers */}
          <div style={{ display: 'flex', gap: '0.45rem' }}>
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
          </div>
        </div>
      </div>

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
