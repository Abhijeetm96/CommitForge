import React, { useState, useEffect } from 'react';
import { UniversalDockerConcept } from '../../data/unifiedDockerData';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  HelpCircle,
  Box,
  Plus,
  Square,
  Trash2,
  FileText,
  ArrowRight,
  Globe,
  CheckCircle2,
} from 'lucide-react';

interface ContainerItem {
  id: string;
  name: string;
  port: number;
  status: 'running' | 'stopped';
}

interface DockerSimulatorEngineProps {
  concept: UniversalDockerConcept;
  onComplete: () => void;
  showToast: (msg: string) => void;
}

export const DockerSimulatorEngine: React.FC<DockerSimulatorEngineProps> = ({
  concept,
  onComplete,
  showToast,
}) => {
  // Stepper State (1 to 6)
  const [currentStep, setCurrentStep] = useState<number>(6);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showWhyModal, setShowWhyModal] = useState<boolean>(false);
  const [showLogs, setShowLogs] = useState<boolean>(false);

  // Active Containers List
  const [containers, setContainers] = useState<ContainerItem[]>([
    { id: 'a3f2c1d4e5f6', name: 'Nginx Container', port: 8080, status: 'running' },
  ]);

  const stepDetails = [
    { step: 1, title: 'CLI Receives Command', desc: 'Validates flags and translates command into REST API payload.', why: 'CLI converts human terminal input into HTTP UNIX socket request.' },
    { step: 2, title: 'Check Local Image', desc: 'Queries local daemon storage driver (overlay2) for image layers.', why: 'Avoids network downloads if image layers exist locally.' },
    { step: 3, title: 'Pull Image Layers', desc: 'Fetches compressed filesystem layers from Docker Hub registry.', why: 'Downloads immutable rootfs binaries.' },
    { step: 4, title: 'Create Container Layer', desc: 'Allocates thin read-write OverlayFS layer on top of image.', why: 'Isolates container filesystem changes.' },
    { step: 5, title: 'Attach Network & Ports', desc: 'Allocates virtual IP (172.17.0.2) and iptables port mapping (8080->80).', why: 'Binds host port 8080 to container port 80.' },
    { step: 6, title: 'Start Process (RUNNING)', desc: 'Container runtime (runc) executes PID 1 inside isolated namespaces.', why: 'Process is now running and servicing HTTP requests.' },
  ];

  // Auto Play Timer Effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= 6) {
            setIsPlaying(false);
            onComplete();
            showToast('🟢 Container is RUNNING & bound to http://localhost:8080');
            return 6;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, onComplete, showToast]);

  const handleRun = () => {
    setCurrentStep(1);
    setIsPlaying(true);
    showToast('Executing Docker run simulation pipeline...');
  };

  const handleStepNext = () => {
    if (currentStep < 6) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (nextStep === 6) {
        onComplete();
        showToast('🟢 Container is RUNNING & bound to http://localhost:8080');
      }
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(1);
    showToast('Simulation reset.');
  };

  const handleAddContainer = () => {
    if (containers.length >= 3) {
      showToast('Maximum 3 containers active on visual stage');
      return;
    }
    const nextNum = containers.length + 1;
    const newId = Math.random().toString(36).substring(2, 10);
    const newPort = 8080 + containers.length;
    const pool = [
      { name: 'Node.js App', port: 3000 },
      { name: 'Python API', port: 5000 },
      { name: 'Postgres DB', port: 5432 },
    ];
    const item = pool[(containers.length - 1) % pool.length];

    setContainers((prev) => [
      ...prev,
      { id: newId, name: item.name, port: item.port, status: 'running' },
    ]);
    showToast(`🟢 Started ${item.name} (${newId}) on port ${item.port}`);
  };

  const handleStopAll = () => {
    setContainers((prev) => prev.map((c) => ({ ...c, status: 'stopped' })));
    showToast('🛑 Containers stopped (SIGTERM sent)');
  };

  const handleRemoveContainer = () => {
    if (containers.length > 1) {
      const removed = containers[containers.length - 1];
      setContainers((prev) => prev.slice(0, prev.length - 1));
      showToast(`🗑️ Removed ${removed.name}`);
    } else {
      setContainers((prev) => prev.map((c) => ({ ...c, status: 'stopped' })));
      showToast('🗑️ Container unlinked and stopped');
    }
  };

  const activeStepInfo = stepDetails.find((s) => s.step === currentStep) || stepDetails[5];

  return (
    <div className="docker-card" style={{ padding: '1.75rem', background: '#090d16', border: '1px solid var(--docker-border-active)' }}>
      {/* 1. SIMULATOR TOOLBAR CONTROLS */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--docker-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            onClick={handleRun}
            style={{
              padding: '0.5rem 1.1rem',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
              color: '#fff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 4px 14px rgba(14, 165, 233, 0.4)',
            }}
          >
            <Play size={15} fill="#fff" />
            <span>▶ Run</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              padding: '0.5rem 0.95rem',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--docker-border)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={handleStepNext}
            disabled={currentStep >= 6}
            style={{
              padding: '0.5rem 0.95rem',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: currentStep >= 6 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              opacity: currentStep >= 6 ? 0.5 : 1,
            }}
          >
            <span>Step →</span>
          </button>

          <button
            onClick={handleReset}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--docker-border)',
              color: 'var(--docker-text-secondary)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

          <button
            onClick={() => setShowWhyModal(!showWhyModal)}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              background: 'rgba(250, 204, 21, 0.15)',
              border: '1px solid rgba(250, 204, 21, 0.3)',
              color: '#facc15',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <HelpCircle size={14} />
            <span>Why?</span>
          </button>
        </div>

        {/* Endpoint Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(14, 165, 233, 0.1)', padding: '0.4rem 0.85rem', borderRadius: '999px', border: '1px solid rgba(14, 165, 233, 0.3)', fontSize: '0.78rem', color: '#38bdf8' }}>
          <Globe size={14} />
          <span>Accessible at: <strong>http://localhost:{containers[0]?.port || 8080}</strong></span>
        </div>
      </div>

      {/* 2. WHY MODAL OVERLAY */}
      {showWhyModal && (
        <div style={{ background: 'rgba(250, 204, 21, 0.08)', border: '1px solid rgba(250, 204, 21, 0.3)', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.84rem' }}>
          <div style={{ fontWeight: 800, color: '#facc15', marginBottom: '0.35rem' }}>
            WHY DID DOCKER DO STEP {activeStepInfo.step}: {activeStepInfo.title}?
          </div>
          <p style={{ color: '#e2e8f0', margin: 0, lineHeight: 1.5 }}>
            "{activeStepInfo.why}"
          </p>
        </div>
      )}

      {/* 3. STEP PIPELINE STEPPER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {stepDetails.map((st) => {
          const isDone = currentStep >= st.step;
          const isCurrent = currentStep === st.step;
          return (
            <div
              key={st.step}
              onClick={() => setCurrentStep(st.step)}
              style={{
                flex: 1,
                minWidth: '130px',
                padding: '0.65rem',
                borderRadius: '8px',
                background: isCurrent ? 'rgba(14, 165, 233, 0.25)' : isDone ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255,255,255,0.02)',
                border: isCurrent ? '2px solid #0ea5e9' : isDone ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid var(--docker-border)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: isCurrent ? '#38bdf8' : isDone ? '#4ade80' : 'var(--docker-text-muted)' }}>
                STEP {st.step}
              </div>
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {st.title}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. BEFORE / AFTER STATE COMPARISON BOX */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--docker-border)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--docker-text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            BEFORE COMMAND RUN
          </div>
          <div style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <div>Images: 0</div>
            <div>Containers: 0</div>
            <div>Network: Bare Host</div>
          </div>
        </div>

        <div style={{ background: 'rgba(14, 165, 233, 0.08)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(14, 165, 233, 0.3)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            AFTER STEP {currentStep}: {activeStepInfo.title}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#fff', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <div>Images: {currentStep >= 3 ? 'nginx:latest' : '0 (Checking)'}</div>
            <div>Active Containers: {currentStep >= 4 ? containers.length : 0}</div>
            <div>State: <strong style={{ color: currentStep >= 6 ? '#4ade80' : '#facc15' }}>{currentStep >= 6 ? 'RUNNING' : currentStep >= 4 ? 'CREATED' : 'INITIALIZING'}</strong></div>
            <div>Port Mapping: {currentStep >= 5 ? `Host ${containers[0]?.port || 8080} -> Container 80` : 'None'}</div>
          </div>
        </div>
      </div>

      {/* 5. VISUAL STAGE: HOST MACHINE vs CONTAINER BOXES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Host Machine Box */}
        <div style={{ background: 'rgba(15, 23, 42, 0.85)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--docker-border)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#fff' }}>
            🖥️ Host Machine (Your Computer)
          </div>
          <div style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div>OS: Linux / macOS / Windows</div>
            <div>CPU: 8 Cores • Memory: 16 GB</div>
            <div>Docker Engine: Active (UNIX Socket)</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, rgba(148, 163, 184, 0.15) 0%, rgba(30, 41, 59, 0.4) 100%)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#fff' }}>
            🐧 Host OS (Shared Linux Kernel)
          </div>
        </div>

        {/* Dynamic Containers List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {containers.map((cnt) => (
            <div
              key={cnt.id}
              style={{
                background: cnt.status === 'running' && currentStep >= 6 ? 'linear-gradient(180deg, rgba(14, 165, 233, 0.2) 0%, rgba(2, 132, 199, 0.1) 100%)' : 'rgba(15, 23, 42, 0.85)',
                border: cnt.status === 'running' && currentStep >= 6 ? '2px solid #0ea5e9' : '1px dashed #ef4444',
                padding: '1.1rem',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                boxShadow: cnt.status === 'running' && currentStep >= 6 ? '0 0 25px rgba(14, 165, 233, 0.3)' : 'none',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--docker-border)', paddingBottom: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#fff' }}>{cnt.name}</div>
                  <div style={{ fontSize: '0.7rem', color: '#38bdf8', fontFamily: 'JetBrains Mono, monospace' }}>{cnt.id}</div>
                </div>

                <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.18rem 0.55rem', borderRadius: '999px', background: cnt.status === 'running' && currentStep >= 6 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: cnt.status === 'running' && currentStep >= 6 ? '#4ade80' : '#f87171' }}>
                  {cnt.status === 'running' && currentStep >= 6 ? '🟢 Running' : '🔴 Stopped'}
                </span>
              </div>

              <div style={{ background: 'rgba(14, 165, 233, 0.08)', padding: '0.65rem', borderRadius: '8px', border: '1px solid rgba(14, 165, 233, 0.25)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8' }}>
                  Port {cnt.port === 8080 ? 80 : 8080} (inside container) &rarr; Mapped to <strong>Port {cnt.port}</strong> (on host)
                </div>

                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: '#a7f3d0' }}>
                  / <br />
                  ├── usr/ <br />
                  ├── etc/ <br />
                  └── <strong>nginx.conf</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. BOTTOM ACTION CONTROLS */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--docker-border)', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleAddContainer}
            style={{ padding: '0.45rem 0.85rem', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--docker-border)', color: '#fff', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Plus size={14} /> Add Another Container
          </button>
          <button
            onClick={handleStopAll}
            style={{ padding: '0.45rem 0.85rem', borderRadius: '8px', background: 'rgba(234, 179, 8, 0.15)', border: '1px solid rgba(234, 179, 8, 0.3)', color: '#facc15', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Square size={14} /> Stop Container
          </button>
          <button
            onClick={handleRemoveContainer}
            style={{ padding: '0.45rem 0.85rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Trash2 size={14} /> Remove Container
          </button>
        </div>

        <button
          onClick={() => setShowLogs(!showLogs)}
          style={{ padding: '0.45rem 0.85rem', borderRadius: '8px', background: 'rgba(14, 165, 233, 0.12)', border: '1px solid var(--docker-border-active)', color: '#38bdf8', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <FileText size={14} /> View Logs
        </button>
      </div>

      {/* Logs View */}
      {showLogs && (
        <div style={{ marginTop: '1rem', background: '#040711', border: '1px solid var(--docker-border)', padding: '0.85rem', borderRadius: '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.74rem', color: '#a7f3d0' }}>
          <div>[INFO] 2026-09-21 22:30:01 - Nginx master process pid 1 initialized</div>
          <div>[INFO] 2026-09-21 22:30:01 - Worker process 7 started</div>
          <div>[INFO] 2026-09-21 22:30:02 - Ready to accept HTTP connections on port 80</div>
        </div>
      )}
    </div>
  );
};
