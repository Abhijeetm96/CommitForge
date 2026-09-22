import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Pod } from '../../kube-engine/types';
import {
  Server,
  Activity,
  Layers,
  AlertTriangle,
  XCircle,
  Clock,
  X,
  Zap,
} from 'lucide-react';
import { CoolingTurbineFan } from '../../../components/simulation/CoolingTurbineFan';
import { LuminousBulb } from '../../../components/simulation/LuminousBulb';

export const ClusterCanvas: React.FC = () => {
  const { clusterState, selectedPod } = useApp();
  const [inspectPod, setInspectPod] = useState<Pod | null>(null);

  const nodes = Object.values(clusterState.nodes);
  const pods = Object.values(clusterState.pods);

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'Running':
        return <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} className="running-pulse" />;
      case 'CrashLoopBackOff':
      case 'Failed':
        return <XCircle size={13} color="#ef4444" className="error-pulse" />;
      case 'OOMKilled':
        return <AlertTriangle size={13} color="#f59e0b" />;
      case 'Pending':
      case 'ContainerCreating':
        return <Clock size={13} color="#eab308" />;
      default:
        return <Activity size={13} color="#38bdf8" />;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Running':
        return '#10b981';
      case 'CrashLoopBackOff':
      case 'Failed':
        return '#ef4444';
      case 'OOMKilled':
        return '#f59e0b';
      case 'Pending':
        return '#eab308';
      default:
        return '#38bdf8';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        padding: '1.25rem',
        background: 'var(--bg-app)',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
    >
      {/* Visualizer Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Server size={18} color="var(--k8s-cyan)" />
            <span>Kubernetes Cluster Topology (Live Mesh)</span>
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            Interactive node and pod scheduling canvas. Click any pod to inspect runtime metrics, container logs, and lifecycle events.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.74rem', background: 'var(--bg-surface)', padding: '0.25rem 0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
            Nodes: <strong style={{ color: '#fff' }}>{nodes.length}</strong>
          </span>
          <span style={{ fontSize: '0.74rem', background: 'var(--bg-surface)', padding: '0.25rem 0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
            Pods: <strong style={{ color: '#fff' }}>{pods.length}</strong>
          </span>
        </div>
      </div>

      {/* Nodes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {nodes.map((node) => {
          const isCP = node.status.role === 'control-plane';
          const nodePods = pods.filter((p) => p.spec.nodeName === node.metadata.name);
          const isUnschedulable = node.spec.unschedulable;

          return (
            <div
              key={node.metadata.name}
              style={{
                background: 'var(--bg-card)',
                border: `1px solid ${isUnschedulable ? 'var(--k8s-amber)' : 'var(--border-color)'}`,
                borderRadius: '14px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
              }}
            >
              {/* Node Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: isCP ? 'rgba(168, 85, 247, 0.15)' : 'rgba(50, 108, 229, 0.15)',
                      border: `1px solid ${isCP ? 'rgba(168, 85, 247, 0.35)' : 'rgba(50, 108, 229, 0.35)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isCP ? 'var(--k8s-purple)' : 'var(--k8s-blue)',
                    }}
                  >
                    <Server size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff' }}>
                      {node.metadata.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {node.status.nodeIP} • {node.status.osImage}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CoolingTurbineFan
                    status={!node.status.ready ? 'fault' : node.status.usage.cpuPercent > 70 ? 'turbo' : 'running'}
                    size={38}
                    showRpm={false}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.55rem',
                        borderRadius: '999px',
                        textTransform: 'uppercase',
                        background: isCP ? 'rgba(168, 85, 247, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                        color: isCP ? 'var(--k8s-purple)' : 'var(--k8s-cyan)',
                        border: `1px solid ${isCP ? 'rgba(168, 85, 247, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`,
                      }}
                    >
                      {node.status.role}
                    </span>

                    {isUnschedulable && (
                      <span style={{ fontSize: '0.66rem', color: 'var(--k8s-amber)', fontWeight: 700 }}>
                        SchedulingDisabled
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Resource Gauges */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <div style={{ background: 'var(--bg-surface)', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    <span>CPU Allocation</span>
                    <span style={{ fontWeight: 700, color: '#fff' }}>{node.status.usage.cpuPercent}%</span>
                  </div>
                  <div style={{ height: '4px', background: 'var(--border-color)', borderRadius: '999px', marginTop: '0.4rem', overflow: 'hidden' }}>
                    <div style={{ width: `${node.status.usage.cpuPercent}%`, height: '100%', background: 'var(--k8s-cyan)' }} />
                  </div>
                </div>

                <div style={{ background: 'var(--bg-surface)', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    <span>RAM Usage</span>
                    <span style={{ fontWeight: 700, color: '#fff' }}>{node.status.usage.memoryPercent}%</span>
                  </div>
                  <div style={{ height: '4px', background: 'var(--border-color)', borderRadius: '999px', marginTop: '0.4rem', overflow: 'hidden' }}>
                    <div style={{ width: `${node.status.usage.memoryPercent}%`, height: '100%', background: 'var(--k8s-green)' }} />
                  </div>
                </div>
              </div>

              {/* Pods Hosted on this Node */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Scheduled Pods ({nodePods.length})
                </div>

                {nodePods.length === 0 ? (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.5rem', background: 'var(--bg-surface)', borderRadius: '6px', textAlign: 'center' }}>
                    No active pods scheduled on this node.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {nodePods.map((p) => {
                      const phaseColor = getPhaseColor(p.status.phase);
                      const isSelected = selectedPod?.metadata.name === p.metadata.name;

                      return (
                        <div
                          key={p.metadata.name}
                          onClick={() => setInspectPod(p)}
                          style={{
                            background: isSelected ? 'rgba(50, 108, 229, 0.15)' : 'var(--bg-surface)',
                            border: `1px solid ${isSelected ? 'var(--k8s-blue)' : 'var(--border-color)'}`,
                            borderRadius: '8px',
                            padding: '0.55rem 0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', minWidth: 0 }}>
                            <LuminousBulb
                              state={
                                p.status.phase === 'Running'
                                  ? 'green'
                                  : p.status.phase === 'CrashLoopBackOff' || p.status.phase === 'Failed'
                                  ? 'red'
                                  : 'amber'
                              }
                              size={15}
                            />
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {p.metadata.name}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <CoolingTurbineFan
                              status={p.status.phase === 'Running' ? 'running' : 'stopped'}
                              size={22}
                              showRpm={false}
                            />
                            <span
                              style={{
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                color: phaseColor,
                                background: `${phaseColor}15`,
                                border: `1px solid ${phaseColor}35`,
                                padding: '0.15rem 0.45rem',
                                borderRadius: '4px',
                              }}
                            >
                              {p.status.phase}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pod Deep Inspector Modal */}
      {inspectPod && (
        <div className="modal-backdrop" onClick={() => setInspectPod(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Layers size={18} color="var(--k8s-cyan)" />
                <span>Pod Inspector: {inspectPod.metadata.name}</span>
              </div>
              <button onClick={() => setInspectPod(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem', background: 'var(--bg-app)', padding: '0.75rem', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Status</div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: getPhaseColor(inspectPod.status.phase) }}>
                    {inspectPod.status.phase}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Pod IP</div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fff' }}>
                    {inspectPod.status.podIP || 'Unassigned'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Node</div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fff' }}>
                    {inspectPod.spec.nodeName || 'Pending'}
                  </div>
                </div>
              </div>

              {/* Containers list */}
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
                  CONTAINER SPECIFICATIONS
                </div>
                {inspectPod.spec.containers.map((c, i) => (
                  <div key={i} style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
                    <div><span style={{ color: 'var(--k8s-cyan)' }}>name:</span> {c.name}</div>
                    <div><span style={{ color: 'var(--k8s-cyan)' }}>image:</span> {c.image}</div>
                    <div><span style={{ color: 'var(--k8s-cyan)' }}>port:</span> {c.ports?.[0]?.containerPort || 80}/TCP</div>
                  </div>
                ))}
              </div>

              {/* Simulated Logs */}
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
                  LIVE CONTAINER STDOUT LOGS
                </div>
                <div style={{ background: '#050811', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: '#94a3b8', maxHeight: '160px', overflowY: 'auto' }}>
                  {inspectPod.status.phase === 'CrashLoopBackOff' ? (
                    <div style={{ color: 'var(--k8s-red)' }}>
                      [fatal] Failed to initialize database connection. Missing DB_PASSWORD env.<br />
                      [error] Process exited with exit code 1.<br />
                      [kubelet] Back-off restarting failed container.
                    </div>
                  ) : (
                    <div>
                      [info] 2026/09/20 03:40:00 Started container {inspectPod.spec.containers[0]?.name}<br />
                      [info] 2026/09/20 03:40:01 Listening on 0.0.0.0:{inspectPod.spec.containers[0]?.ports?.[0]?.containerPort || 80}<br />
                      [info] 2026/09/20 03:40:05 Health check passed. Status 200 OK.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setInspectPod(null)}
                style={{
                  background: 'var(--bg-surface-elevated)',
                  color: '#fff',
                  border: '1px solid var(--border-color)',
                  padding: '0.45rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                }}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
