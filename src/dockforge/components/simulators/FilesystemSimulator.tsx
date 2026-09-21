import React, { useState } from 'react';
import { Layers, HardDrive, Box, Plus, Trash2, RefreshCw } from 'lucide-react';
import { UniversalDockerConcept } from '../../data/unifiedDockerData';

interface FilesystemSimulatorProps {
  concept: UniversalDockerConcept;
  simState: 'created' | 'running' | 'paused' | 'stopped' | 'removed';
  setSimState: (s: 'created' | 'running' | 'paused' | 'stopped' | 'removed') => void;
  showToast: (msg: string) => void;
}

export const FilesystemSimulator: React.FC<FilesystemSimulatorProps> = ({
  concept,
  simState,
  setSimState,
  showToast,
}) => {
  const [buildLayerStep, setBuildLayerStep] = useState<number>(4);
  const [volumeFiles, setVolumeFiles] = useState<string[]>(['database.sqlite', 'app.log']);
  const [activeTab, setActiveTab] = useState<'layers' | 'storage'>('layers');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* HEADER CONTROLS */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--docker-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <Layers size={18} color="var(--docker-blue)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>
            Engine B: Overlay2 Filesystem & Storage Persistence Engine
          </span>
        </div>

        {/* Mode Switcher */}
        <div style={{ display: 'flex', gap: '0.35rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem', borderRadius: '6px' }}>
          <button
            onClick={() => setActiveTab('layers')}
            style={{
              padding: '0.3rem 0.65rem',
              borderRadius: '4px',
              background: activeTab === 'layers' ? 'var(--docker-blue)' : 'transparent',
              color: '#fff',
              border: 'none',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Overlay2 Layers
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            style={{
              padding: '0.3rem 0.65rem',
              borderRadius: '4px',
              background: activeTab === 'storage' ? 'var(--docker-blue)' : 'transparent',
              color: '#fff',
              border: 'none',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Volume & Bind Mount Sync
          </button>
        </div>
      </div>

      {/* MODE 1: OVERLAY2 LAYER STACK & BUILD STEPS */}
      {activeTab === 'layers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--docker-border)' }}>
            <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>Build Step Progress: <strong>Layer {buildLayerStep} of 4</strong></span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  setBuildLayerStep((prev) => (prev % 4) + 1);
                  showToast(`Advanced build step to Layer ${(buildLayerStep % 4) + 1}`);
                }}
                style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', background: 'var(--docker-blue)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.76rem', cursor: 'pointer' }}
              >
                Step Next Layer
              </button>
              <button
                onClick={() => {
                  setBuildLayerStep(4);
                  showToast('BuildKit Layer Cache Invalidated & Rebuilt!');
                }}
                style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', color: '#cbd5e1', border: '1px solid var(--docker-border)', fontWeight: 700, fontSize: '0.76rem', cursor: 'pointer' }}
              >
                Rebuild Cache
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '0.5rem' }}>
            <div style={{ background: buildLayerStep >= 4 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.03)', border: buildLayerStep >= 4 ? '1px solid #22c55e' : '1px dashed var(--docker-border)', padding: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Box size={16} color="#4ade80" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#fff' }}>Layer 4 (Top): Writable Container Layer</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--docker-text-muted)', fontFamily: 'JetBrains Mono' }}>CMD ["node", "index.js"] | Copy-On-Write delta</div>
                </div>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#4ade80', fontWeight: 800 }}>READ/WRITE (0.1 MB)</span>
            </div>

            <div style={{ background: buildLayerStep >= 3 ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255,255,255,0.03)', border: '1px solid var(--docker-border)', padding: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={16} color="#38bdf8" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#fff' }}>Layer 3: Application Dependencies</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--docker-text-muted)', fontFamily: 'JetBrains Mono' }}>RUN npm install --production</div>
                </div>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 800 }}>CACHED (142 MB)</span>
            </div>

            <div style={{ background: buildLayerStep >= 2 ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255,255,255,0.03)', border: '1px solid var(--docker-border)', padding: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={16} color="#38bdf8" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#fff' }}>Layer 2: Package Manifest</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--docker-text-muted)', fontFamily: 'JetBrains Mono' }}>COPY package.json ./</div>
                </div>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 800 }}>CACHED (2.4 KB)</span>
            </div>

            <div style={{ background: buildLayerStep >= 1 ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255,255,255,0.03)', border: '1px solid var(--docker-border)', padding: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={16} color="#38bdf8" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#fff' }}>Layer 1 (Base): OS Base Runtime</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--docker-text-muted)', fontFamily: 'JetBrains Mono' }}>FROM node:18-alpine</div>
                </div>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 800 }}>READ-ONLY (174 MB)</span>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: DUAL-PANE VOLUME STORAGE SYNC */}
      {activeTab === 'storage' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--docker-border)' }}>
            <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>Host Mount Status: <strong style={{ color: '#4ade80' }}>Connected to Persistent Volume</strong></span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  const newF = `file_${Date.now().toString().slice(-4)}.json`;
                  setVolumeFiles((prev) => [...prev, newF]);
                  showToast(`Added persistent file ${newF} on host disk!`);
                }}
                style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', background: 'var(--docker-blue)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.76rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <Plus size={13} /> Create File on Host
              </button>
              <button
                onClick={() => {
                  if (simState === 'removed') {
                    setSimState('running');
                    showToast('New container mounted to existing volume files!');
                  } else {
                    setSimState('removed');
                    showToast('Container killed! Host volume files remain 100% safe.');
                  }
                }}
                style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', background: simState === 'removed' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', color: simState === 'removed' ? '#4ade80' : '#f87171', border: '1px solid var(--docker-border)', fontWeight: 700, fontSize: '0.76rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                {simState === 'removed' ? <RefreshCw size={13} /> : <Trash2 size={13} />}
                {simState === 'removed' ? 'Respawn Container' : 'Kill Container'}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Host Storage Panel */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--docker-border)', padding: '1rem', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <HardDrive size={16} color="#facc15" />
                <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#fff' }}>Host Storage Directory (/var/lib/docker/volumes)</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {volumeFiles.map((f, i) => (
                  <div key={i} style={{ background: '#090d16', padding: '0.45rem 0.75rem', borderRadius: '6px', fontFamily: 'JetBrains Mono', fontSize: '0.78rem', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>📄 {f}</span>
                    <span style={{ fontSize: '0.68rem', color: '#4ade80', fontWeight: 700 }}>PERSISTED</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Container Path Panel */}
            <div style={{ background: simState === 'removed' ? 'rgba(239,68,68,0.05)' : 'rgba(14,165,233,0.05)', border: simState === 'removed' ? '1px dashed #ef4444' : '1px solid var(--docker-border-active)', padding: '1rem', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Box size={16} color={simState === 'removed' ? '#ef4444' : 'var(--docker-blue)'} />
                <span style={{ fontWeight: 800, fontSize: '0.85rem', color: simState === 'removed' ? '#f87171' : '#fff' }}>
                  Container Path Mount (/app/data) {simState === 'removed' ? '(CONTAINER DESTROYED)' : ''}
                </span>
              </div>
              {simState === 'removed' ? (
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic', padding: '1.25rem 0', textAlign: 'center' }}>
                  Container is dead, but data on host disk remains 100% intact! Respawn container to reconnect.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {volumeFiles.map((f, i) => (
                    <div key={i} style={{ background: '#090d16', padding: '0.45rem 0.75rem', borderRadius: '6px', fontFamily: 'JetBrains Mono', fontSize: '0.78rem', color: '#a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>⚡ {f}</span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--docker-blue)', fontWeight: 700 }}>SYNCED</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
