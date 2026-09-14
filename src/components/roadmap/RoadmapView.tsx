import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoadmapNode } from '../../data/roadmapGraphModel';
import { RoadmapCanvas } from './RoadmapCanvas';
import {
  X,
  Terminal,
  Lightbulb,
  AlertTriangle,
  ArrowRight,
  Compass,
  CheckCircle2,
} from 'lucide-react';

export const RoadmapView: React.FC = () => {
  const { setMode } = useApp();
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        background: '#070b14',
        position: 'relative',
        overflow: 'hidden',
        flex: '1 1 0%',
        minHeight: 0,
      }}
    >
      {/* Top Header Bar */}
      <div
        style={{
          background: '#0d1527',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0.65rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '999px',
              background: '#38bdf8',
              boxShadow: '0 0 10px #38bdf8',
            }}
          />
          <span style={{ fontSize: '0.92rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            CommitForge Interactive Knowledge Graph
          </span>
          <span
            style={{
              fontSize: '0.72rem',
              color: '#38bdf8',
              background: 'rgba(56, 189, 248, 0.12)',
              padding: '0.15rem 0.5rem',
              borderRadius: '999px',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              fontWeight: 700,
            }}
          >
            ELK Layered Architecture
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setMode('learn')}
            style={{
              background: 'rgba(56, 189, 248, 0.1)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Compass size={13} />
            Academy Lessons
          </button>
        </div>
      </div>

      {/* Main Interactive ELK Directed Graph Canvas */}
      <div style={{ flex: '1 1 0%', minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        <RoadmapCanvas
          selectedNodeId={selectedNode?.id}
          onSelectNode={(node) => setSelectedNode(node)}
          onJumpToAcademy={() => setMode('learn')}
        />

        {/* Slide-out Node Details Drawer (Section 15, 21) */}
        {selectedNode && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '400px',
              maxWidth: '100vw',
              height: '100%',
              background: '#0d1527',
              borderLeft: '1px solid #27354f',
              boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.7)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 100,
              animation: 'fadeInRight 0.2s ease-out',
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '1.25rem',
                borderBottom: '1px solid #1e293b',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1rem',
                background: '#151f33',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#38bdf8',
                    marginBottom: '0.25rem',
                    letterSpacing: '0.05em',
                  }}
                >
                  {selectedNode.section} • {selectedNode.type}
                </div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#f8fafc', margin: 0 }}>
                  {selectedNode.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '0.25rem',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
              <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5, marginTop: 0 }}>
                {selectedNode.description || 'Core concept in the Git & GitHub curriculum.'}
              </p>

              {/* Commands */}
              {selectedNode.commands && selectedNode.commands.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: '#38bdf8',
                      marginBottom: '0.45rem',
                    }}
                  >
                    <Terminal size={14} />
                    <span>Essential Commands</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {selectedNode.commands.map((cmd, i) => (
                      <code
                        key={i}
                        style={{
                          background: '#070b14',
                          border: '1px solid #1e293b',
                          borderRadius: '6px',
                          padding: '0.45rem 0.65rem',
                          fontSize: '0.8rem',
                          color: '#a5f3fc',
                          fontFamily: 'monospace',
                        }}
                      >
                        {cmd}
                      </code>
                    ))}
                  </div>
                </div>
              )}

              {/* Senior Developer Tips */}
              {selectedNode.bestPractices && selectedNode.bestPractices.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: '#34d399',
                      marginBottom: '0.45rem',
                    }}
                  >
                    <Lightbulb size={14} />
                    <span>Senior Developer Tips</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#cbd5e1', fontSize: '0.82rem' }}>
                    {selectedNode.bestPractices.map((tip, i) => (
                      <li key={i} style={{ marginBottom: '0.35rem', lineHeight: 1.4 }}>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pitfalls */}
              {selectedNode.pitfalls && selectedNode.pitfalls.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: '#f87171',
                      marginBottom: '0.45rem',
                    }}
                  >
                    <AlertTriangle size={14} />
                    <span>Common Traps & Pitfalls</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#cbd5e1', fontSize: '0.82rem' }}>
                    {selectedNode.pitfalls.map((pitfall, i) => (
                      <li key={i} style={{ marginBottom: '0.35rem', lineHeight: 1.4 }}>
                        {pitfall}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Drawer Actions Footer */}
            <div
              style={{
                padding: '1rem 1.25rem',
                borderTop: '1px solid #1e293b',
                background: '#151f33',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <button
                onClick={() => {
                  setSelectedNode(null);
                  setMode('learn');
                }}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.65rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                }}
              >
                <span>Practice in Academy</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
