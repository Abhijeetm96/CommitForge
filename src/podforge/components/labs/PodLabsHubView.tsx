import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FlaskConical,
  Flame,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface LabScenario {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  triggerCmd: string;
  cureCmd: string;
  targetPod: string;
  diagnosticSteps: string[];
  explanation: string;
}

const KUBE_LABS: LabScenario[] = [
  {
    id: 'crashloop',
    title: 'The CrashLoopBackOff Clinic',
    category: 'Runtime Triage',
    badge: '🩺 Clinic Ward',
    description: 'A critical microservice container is repeatedly crashing on boot with exit code 1. Diagnose environment variables and restore service pulse.',
    triggerCmd: 'simulate crashloop',
    cureCmd: 'kubectl apply -f fix-env.yaml',
    targetPod: 'frontend-web-7bc9f-1',
    diagnosticSteps: [
      'Run `kubectl get pods` to identify the failing pod in CrashLoopBackOff state.',
      'Run `kubectl logs frontend-web-7bc9f-1` to inspect standard error output.',
      'Notice missing DB_PASSWORD configuration variable.',
      'Inject corrected environment configuration to stabilize the pod.',
    ],
    explanation: 'CrashLoopBackOff means the container was started, but its main PID 1 process exited immediately with an error. Kubernetes backs off restart attempts exponentially (10s, 20s, 40s... up to 5 minutes) to avoid overloading the node.',
  },
  {
    id: 'oomkilled',
    title: 'OOMKilled Intensive Care',
    category: 'Memory & cgroups',
    badge: '💥 OOM Ward',
    description: 'A memory-hungry worker container exceeded its 256Mi memory limit and was terminated by the Linux kernel OOM killer (Exit Code 137).',
    triggerCmd: 'simulate oomkill',
    cureCmd: 'kubectl apply -f fix-memory-limit.yaml',
    targetPod: 'frontend-web-7bc9f-2',
    diagnosticSteps: [
      'Inspect `kubectl describe pod frontend-web-7bc9f-2` and look for Last State: Terminated (Reason: OOMKilled, Exit Code: 137).',
      'Understand how cgroup limits kill containers that exceed their declared `limits.memory`.',
      'Increase container memory limits to 512Mi or resolve the memory leak.',
    ],
    explanation: 'Exit code 137 indicates 128 + 9 (SIGKILL). When a container consumes more RAM than declared in its pod spec limits, the kernel immediately terminates it to prevent host node starvation.',
  },
  {
    id: 'drain-node',
    title: 'Node Evacuation & Maintenance',
    category: 'Node Ops',
    badge: '🚜 Maintenance',
    description: 'Worker-node-1 requires an urgent kernel upgrade. Cordon the node and drain all running workloads to worker-node-2 without dropping traffic.',
    triggerCmd: 'simulate maintenance',
    cureCmd: 'kubectl drain worker-node-1 --ignore-daemonsets',
    targetPod: 'frontend-web-7bc9f-1',
    diagnosticSteps: [
      'Run `kubectl drain worker-node-1` to mark the node unschedulable and evict pods.',
      'Verify that evicted pods re-spawn automatically on worker-node-2.',
      'Run `kubectl uncordon worker-node-1` when maintenance completes.',
    ],
    explanation: 'Draining nodes is the standard cloud-native method for zero-downtime maintenance. Deployments immediately sense the lost pods and schedule replacements on surviving ready nodes.',
  },
];

export const PodLabsHubView: React.FC = () => {
  const { engine, executeCommand } = useApp();
  const [selectedLabId, setSelectedLabId] = useState<string>('crashloop');
  const [labState, setLabState] = useState<'normal' | 'disaster' | 'cured'>('normal');

  const currentLab = KUBE_LABS.find((l) => l.id === selectedLabId) || KUBE_LABS[0];

  const handleTriggerDisaster = () => {
    if (currentLab.id === 'crashloop') {
      engine.injectCrashLoop(currentLab.targetPod);
    } else if (currentLab.id === 'oomkilled') {
      engine.injectOOMKilled(currentLab.targetPod);
    } else if (currentLab.id === 'drain-node') {
      executeCommand('kubectl cordon worker-node-1');
    }
    setLabState('disaster');
  };

  const handleCure = () => {
    engine.curePod(currentLab.targetPod);
    if (currentLab.id === 'drain-node') {
      executeCommand('kubectl drain worker-node-1');
    }
    setLabState('cured');
  };

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        width: '100%',
        height: '100%',
        background: 'var(--bg-app)',
        color: 'var(--text-primary)',
        overflow: 'hidden',
      }}
    >
      {/* SIDEBAR: Labs List */}
      <aside
        style={{
          width: '280px',
          minWidth: '280px',
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <FlaskConical size={16} color="var(--k8s-red)" />
            <span>Kube Triage Arenas</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {KUBE_LABS.length} Hands-On Disaster Recovery Scenarios
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0.65rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {KUBE_LABS.map((lab) => {
            const isActive = lab.id === currentLab.id;
            return (
              <div
                key={lab.id}
                onClick={() => {
                  setSelectedLabId(lab.id);
                  setLabState('normal');
                }}
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: isActive ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--k8s-red)' : '3px solid transparent',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem',
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: isActive ? 800 : 600, color: '#fff' }}>
                  {lab.title}
                </div>
                <div style={{ fontSize: '0.7rem', color: isActive ? 'var(--k8s-red)' : 'var(--text-muted)' }}>
                  {lab.badge} • {lab.category}
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* CENTER: Lab Arena */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflowY: 'auto',
          padding: '1.5rem 2rem 5rem 2rem',
          gap: '1.25rem',
          boxSizing: 'border-box',
        }}
      >
        {/* Lab Header */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--k8s-red)', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
              {currentLab.badge}
            </span>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
              {currentLab.category}
            </span>
          </div>

          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', margin: 0 }}>
              {currentLab.title}
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0 0', lineHeight: 1.5 }}>
              {currentLab.description}
            </p>
          </div>

          {/* Action Triggers */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleTriggerDisaster}
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                color: '#fff',
                border: 'none',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
              }}
            >
              <Flame size={16} /> Trigger Disaster in Sandbox
            </button>

            <button
              onClick={handleCure}
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#10b981',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <CheckCircle2 size={16} /> Apply Diagnostic Cure
            </button>
          </div>

          {/* Status Feedback */}
          {labState === 'disaster' && (
            <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid #ef4444', borderRadius: '8px', padding: '0.85rem', color: '#ef4444', fontSize: '0.84rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} />
              <span>Disaster triggered! Target pod is failing. Open the terminal or visualizer to diagnose the error.</span>
            </div>
          )}

          {labState === 'cured' && (
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '8px', padding: '0.85rem', color: '#10b981', fontSize: '0.84rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} />
              <span>Great job! Container health restored to normal Running status.</span>
            </div>
          )}
        </div>

        {/* Diagnostic Steps & Explanation */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--k8s-cyan)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Diagnostic Playbook
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {currentLab.diagnosticSteps.map((step, i) => (
                <div key={i} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                  <span style={{ color: 'var(--k8s-cyan)', fontWeight: 800 }}>{i + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--k8s-blue)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Root Cause Anatomy
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {currentLab.explanation}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
