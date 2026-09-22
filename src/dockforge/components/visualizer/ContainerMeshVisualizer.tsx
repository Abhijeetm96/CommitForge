import React, { useState } from 'react';
import { useDocker } from '../../context/DockerContext';
import { Container, DockerImage, DockerVolume, DockerNetwork } from '../../docker-engine/types';
import { Layers, Database, Network, HardDrive, Cpu, Terminal, ArrowRight, ShieldCheck, Activity, Zap } from 'lucide-react';
import { EnterpriseDockerSimulator } from '../simulators/EnterpriseDockerSimulator';

export const ContainerMeshVisualizer: React.FC = () => {
  const { containers, images, volumes, networks } = useDocker();
  const [selectedView, setSelectedView] = useState<'enterprise' | 'filesystem' | 'layers' | 'networking'>('enterprise');

  const activeContainers = containers.filter((c) => c.status === 'running');

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', background: 'var(--docker-dark-bg)', padding: '1.75rem 2rem 3rem' }}>
      {/* Visualizer Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--docker-blue)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
            Container Engine State &bull; Real-time Inspector
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', margin: 0 }}>
            Container Topology &amp; Production Visualizer
          </h1>
        </div>

        {/* View Switcher Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--docker-surface)', padding: '0.35rem', borderRadius: '10px', border: '1px solid var(--docker-border)' }}>
          <button
            onClick={() => setSelectedView('enterprise')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              border: 'none',
              background: selectedView === 'enterprise' ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' : 'transparent',
              color: selectedView === 'enterprise' ? '#fff' : '#38bdf8',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: selectedView === 'enterprise' ? '0 0 12px rgba(14,165,233,0.4)' : 'none',
            }}
          >
            <Zap size={14} />
            ⚡ Enterprise Production Rig
          </button>

          <button
            onClick={() => setSelectedView('filesystem')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              border: 'none',
              background: selectedView === 'filesystem' ? 'var(--docker-blue)' : 'transparent',
              color: selectedView === 'filesystem' ? '#fff' : 'var(--docker-text-secondary)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <HardDrive size={14} />
            Filesystem &amp; Mounts
          </button>

          <button
            onClick={() => setSelectedView('layers')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              border: 'none',
              background: selectedView === 'layers' ? 'var(--docker-blue)' : 'transparent',
              color: selectedView === 'layers' ? '#fff' : 'var(--docker-text-secondary)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Layers size={14} />
            Overlay2 Image Layers
          </button>

          <button
            onClick={() => setSelectedView('networking')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              border: 'none',
              background: selectedView === 'networking' ? 'var(--docker-blue)' : 'transparent',
              color: selectedView === 'networking' ? '#fff' : 'var(--docker-text-secondary)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Network size={14} />
            Bridge Networking
          </button>
        </div>
      </div>

      {/* VIEW 0: ENTERPRISE PRODUCTION RIG */}
      {selectedView === 'enterprise' && (
        <div style={{ flex: 1, minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
          <EnterpriseDockerSimulator />
        </div>
      )}

      {/* VIEW 1: FILESYSTEM & MOUNTS */}
      {selectedView === 'filesystem' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Ephemeral Containers */}
          <div className="docker-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--docker-blue)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1rem' }}>
              <Activity size={16} />
              <span>Active Containers ({containers.length})</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {containers.map((c) => (
                <div key={c.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--docker-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.9rem' }}>{c.name}</div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '999px', background: c.status === 'running' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: c.status === 'running' ? '#4ade80' : '#ef4444' }}>
                      {c.status.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--docker-text-secondary)', marginBottom: '0.4rem' }}>
                    Image: <code style={{ color: '#38bdf8' }}>{c.imageName}</code> &bull; IP: {c.ipAddress}
                  </div>

                  {c.mounts.length > 0 && (
                    <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem', color: '#facc15' }}>
                      Mount: {c.mounts[0].type} ({c.mounts[0].source} &rarr; {c.mounts[0].target})
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Managed Volumes */}
          <div className="docker-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4ade80', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1rem' }}>
              <Database size={16} />
              <span>Docker Volumes &amp; Persistence ({volumes.length})</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {volumes.map((v) => (
                <div key={v.name} style={{ background: 'rgba(34,197,94,0.05)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <div style={{ fontWeight: 800, color: '#4ade80', fontSize: '0.88rem', marginBottom: '0.35rem' }}>{v.name}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--docker-text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>
                    Mountpoint: {v.mountpoint}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.35rem' }}>
                    Driver: {v.driver} &bull; Size: {v.sizeMb}MB
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: OVERLAY2 IMAGE LAYERS */}
      {selectedView === 'layers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {images.map((img) => (
            <div key={img.id} className="docker-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                    {img.repository}:{img.tag}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--docker-text-secondary)', marginTop: '0.2rem' }}>
                    Digest: sha256:{img.digest} &bull; Total Size: {img.sizeMb.toFixed(1)}MB
                  </div>
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '6px', background: 'var(--docker-blue-light)', color: 'var(--docker-blue)' }}>
                  {img.layers.length} Layers
                </span>
              </div>

              {/* Stack Visualizer */}
              <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '0.4rem' }}>
                {img.layers.map((l, idx) => (
                  <div key={l.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.55rem 0.85rem', borderRadius: '6px', background: idx === img.layers.length - 1 ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255,255,255,0.03)', border: idx === img.layers.length - 1 ? '1px solid rgba(14, 165, 233, 0.4)' : '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--docker-text-muted)', width: '40px' }}>L{idx + 1}</span>
                      <code style={{ fontSize: '0.8rem', color: '#e2e8f0', fontFamily: 'JetBrains Mono, monospace' }}>{l.createdCommand}</code>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--docker-text-secondary)' }}>
                      {l.cached ? '⚡ CACHED' : ''} &bull; {l.sizeMb}MB
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 3: BRIDGE NETWORKING */}
      {selectedView === 'networking' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {networks.map((net) => (
            <div key={net.id} className="docker-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>
                    Network: {net.name} ({net.driver})
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--docker-text-secondary)', marginTop: '0.2rem' }}>
                    Subnet: {net.subnet} &bull; Gateway: {net.gateway}
                  </div>
                </div>
              </div>

              {/* Connected Containers Mesh */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                {containers
                  .filter((c) => c.network === net.name || (net.name === 'bridge' && c.network === 'bridge'))
                  .map((c) => (
                    <div key={c.id} style={{ padding: '0.85rem', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--docker-border)' }}>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.86rem' }}>{c.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--docker-blue)', marginTop: '0.2rem', fontFamily: 'JetBrains Mono, monospace' }}>
                        IP: {c.ipAddress}
                      </div>
                      {c.ports.length > 0 && (
                        <div style={{ fontSize: '0.72rem', color: '#4ade80', marginTop: '0.35rem' }}>
                          Port: {c.ports[0].hostPort} &rarr; {c.ports[0].containerPort}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
